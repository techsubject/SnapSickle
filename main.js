(() => {
  "use strict";
  const WASM_BUILD = "236a06dc9063b747832944747c8d9f6c.wasm.br";
  const KEYS = { xz: "__dcgs_snap_xz", y: "__dcgs_snap_y" };
  const DEFAULTS = { xz: 15, y: 15 };
  const LIMITS = { xz: [1, 30], y: [1, 30] };

  // Only patch the cursor/grid movement instructions whose roles were identified.
  // Do not touch camera/legacy locations or the game's rotation rules.
  const SITES = [
    { offset: 0x1063153, kind: "float", type: "xz-half", original: 7.5 },
    { offset: 0x106317b, kind: "float", type: "xz-float", original: 15 },
    { offset: 0x10631d7, kind: "float", type: "xz-half", original: 7.5 },
    { offset: 0x10631ff, kind: "float", type: "xz-float", original: 15 },
    { offset: 0x106326a, kind: "int", type: "y-int", original: 15 },
    { offset: 0x1063271, kind: "int", type: "xz-int", original: 15 },
    { offset: 0x106327a, kind: "int", type: "xz-int", original: 15 }
  ].sort((a,b)=>a.offset-b.offset);

  function readSetting(key) {
    const [min,max] = LIMITS[key];
    try {
      const n = Number.parseInt(localStorage.getItem(KEYS[key]) || String(DEFAULTS[key]), 10);
      if (Number.isInteger(n) && n >= min && n <= max) return n;
    } catch (_) {}
    return DEFAULTS[key];
  }
  function hasBytes(bytes, offset, expected) {
    return offset >= 0 && offset + expected.length <= bytes.length && expected.every((v,i)=>bytes[offset+i]===v);
  }
  function readLeb(bytes, pos) {
    let value=0, shift=0, p=pos, byte;
    do { if (p>=bytes.length || shift>35) throw new Error("Invalid WASM LEB128"); byte=bytes[p++]; value |= (byte & 0x7f) << shift; shift += 7; } while (byte & 0x80);
    return { value: value >>> 0, next: p, length: p-pos };
  }
  function encodeUleb(value) {
    const out=[]; let v=value>>>0;
    do { let b=v&0x7f; v>>>=7; if(v) b|=0x80; out.push(b); } while(v);
    return out;
  }
  function encodeSignedLeb(value) {
    const out=[]; let more=true;
    while(more) {
      let byte=value & 0x7f; value >>= 7;
      const sign=(byte & 0x40)!==0;
      more=!((value===0 && !sign)||(value===-1 && sign));
      if(more) byte |= 0x80;
      out.push(byte);
    }
    return out;
  }
  function concat(parts) {
    const length=parts.reduce((n,p)=>n+p.length,0), out=new Uint8Array(length); let at=0;
    for(const part of parts){out.set(part,at);at+=part.length;} return out;
  }
  function parseSections(bytes) {
    const sections=[]; let p=8;
    while(p<bytes.length) {
      const begin=p, id=bytes[p++], size=readLeb(bytes,p), payloadStart=size.next, payloadEnd=payloadStart+size.value;
      if(payloadEnd>bytes.length) throw new Error("WASM section extends beyond file");
      sections.push({id,begin,payloadStart,payloadEnd,payload:bytes.subarray(payloadStart,payloadEnd)}); p=payloadEnd;
    }
    return sections;
  }
  function makeResponse(bytes, original) {
    const headers=new Headers(original.headers);
    headers.delete("content-encoding"); headers.delete("content-length"); headers.delete("content-range");
    headers.set("content-type","application/wasm");
    return new Response(bytes,{status:original.status,statusText:original.statusText,headers});
  }
  function patchWasm(buffer, values) {
    const original=new Uint8Array(buffer);
    if(original.length<8 || original[0]!==0 || original[1]!==0x61 || original[2]!==0x73 || original[3]!==0x6d)
      return {ok:false,reason:"WASM header mismatch",bytes:original};
    let sections;
    try { sections=parseSections(original); } catch(e) { return {ok:false,reason:e.message,bytes:original}; }
    const code=sections.find(s=>s.id===10);
    if(!code) return {ok:false,reason:"WASM code section not found",bytes:original};
    try {
      let q=code.payloadStart; const count=readLeb(original,q); q=count.next;
      const bodies=[];
      for(let i=0;i<count.value;i++) {
        const size=readLeb(original,q), bodyStart=size.next, bodyEnd=bodyStart+size.value;
        if(bodyEnd>code.payloadEnd) throw new Error("WASM function extends beyond code section");
        bodies.push({index:i,start:bodyStart,end:bodyEnd,bytes:original.subarray(bodyStart,bodyEnd),edits:[]});
        q=bodyEnd;
      }
      if(q!==code.payloadEnd) throw new Error("Could not parse WASM code section exactly");

      // Account for immediate-length changes as each grid constant is replaced.
      let inputDelta=0;
      for(const site of SITES) {
        const at=site.offset+inputDelta;
        if(site.kind==="float") {
          if(at<0 || at+5>original.length || original[at]!==0x43)
            throw new Error(`WASM target mismatch at 0x${site.offset.toString(16)} (float)`);
          const body=bodies.find(b=>at>=b.start && at<b.end);
          if(!body) throw new Error(`No function body at 0x${site.offset.toString(16)}`);
          let replacementValue;
          if(site.type==="xz-half") replacementValue=values.xz/2;
          else if(site.type==="xz-float") replacementValue=values.xz;
          else replacementValue=site.original;
          const replacement=new Uint8Array(5); replacement[0]=0x43;
          new DataView(replacement.buffer).setFloat32(1,replacementValue,true);
          body.edits.push({at,oldLength:5,replacement,baseOffset:site.offset});
          inputDelta += 0;
        } else {
          if(at<0 || at+2>=original.length || original[at]!==0x41)
            throw new Error(`WASM target mismatch at 0x${site.offset.toString(16)} (integer)`);
          let pos=at+1, shift=0, byte, immediateLength=0;
          do {
            if(pos>=original.length || shift>35) throw new Error("Invalid signed LEB128 at patch target");
            byte=original[pos++]; immediateLength++; shift+=7;
          } while(byte&0x80);
          if(original[at+1+immediateLength]!==0x6c)
            throw new Error(`WASM multiply instruction mismatch at 0x${site.offset.toString(16)}`);
          const oldLength=1+immediateLength;
          const body=bodies.find(b=>at>=b.start && at<b.end);
          if(!body) throw new Error(`No function body at 0x${site.offset.toString(16)}`);
          let replacementValue=site.original;
          if(site.type==="y-int") replacementValue=values.y;
          else if(site.type==="xz-int") replacementValue=values.xz;
          const replacement=new Uint8Array([0x41,...encodeSignedLeb(replacementValue)]);
          body.edits.push({at,oldLength,replacement,baseOffset:site.offset});
          inputDelta += oldLength-2;
        }
      }

      const rebuiltBodies=[];
      for(const body of bodies) {
        if(!body.edits.length) { rebuiltBodies.push(concat([encodeUleb(body.bytes.length),body.bytes])); continue; }
        body.edits.sort((a,b)=>a.at-b.at);
        const pieces=[]; let cursor=body.start;
        for(const edit of body.edits) {
          if(edit.at<cursor || edit.at+edit.oldLength>body.end) throw new Error("Overlapping or out-of-range WASM patch");
          pieces.push(original.subarray(cursor,edit.at));
          pieces.push(edit.replacement);
          cursor=edit.at+edit.oldLength;
        }
        pieces.push(original.subarray(cursor,body.end));
        const bodyBytes=concat(pieces);
        rebuiltBodies.push(concat([encodeUleb(bodyBytes.length),bodyBytes]));
      }
      const newCodePayload=concat([encodeUleb(count.value),...rebuiltBodies]);
      const newCodeSection=concat([new Uint8Array([10]),encodeUleb(newCodePayload.length),newCodePayload]);
      const outSections=[];
      for(const section of sections) outSections.push(section.id===10?newCodeSection:original.subarray(section.begin,section.payloadEnd));
      return {ok:true,bytes:concat([original.subarray(0,8),...outSections])};
    } catch(e) { return {ok:false,reason:e.message,bytes:original}; }
  }

  if(window.__snapSickleGridSnap043Installed) return;
  window.__snapSickleGridSnap043Installed=true;
  const originalFetch=window.fetch;
  if(typeof originalFetch!=="function") return;
  window.fetch=async function(input,init) {
    const response=await Reflect.apply(originalFetch,this,[input,init]);
    let url=""; try { url=typeof input==="string" ? input : input.url; } catch (_) {}
    if(!url.includes(WASM_BUILD) || !response.ok) return response;
    let originalBytes;
    try {
      originalBytes=await response.arrayBuffer();
      const values={xz:readSetting("xz"),y:readSetting("y")};
      const result=patchWasm(originalBytes,values);
      if(!result.ok) {
        console.warn(`[DashCraft Grid Snap] WASM was not patched (${result.reason}); original bytes are preserved.`);
        document.documentElement?.setAttribute("data-dcgs-patch","mismatch");
        document.documentElement?.setAttribute("data-dcgs-reason",result.reason);
        return makeResponse(result.bytes,response);
      }
      document.documentElement?.setAttribute("data-dcgs-patch","applied");
      document.documentElement?.setAttribute("data-dcgs-xz",String(values.xz));
      document.documentElement?.setAttribute("data-dcgs-y",String(values.y));
      console.info(`[SnapSickle Grid Snap 0.4.3] X/Z: ${values.xz}; Y: ${values.y}. The grid movement WASM patches were applied.`);
      return makeResponse(result.bytes,response);
    } catch(error) {
      console.error("[DashCraft Grid Snap] Patch failed; original game code remains available.",error);
      if(originalBytes) return makeResponse(originalBytes,response);
      return response;
    }
  };
})();
