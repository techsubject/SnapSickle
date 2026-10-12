(() => {
  "use strict";
  if(window.__dashcraftGridSnapUiLoaded) return;
  window.__dashcraftGridSnapUiLoaded=true;
  const settings={
    xz:{title:"X/Z snap spacing",min:1,max:30,def:15,key:"__dcgs_snap_xz",storage:"dashcraftGridSnapXZ",unit:"units"},
    y:{title:"Y snap spacing",min:1,max:30,def:15,key:"__dcgs_snap_y",storage:"dashcraftGridSnapY",unit:"units"}
  };
  const logoUrl = "https://raw.githubusercontent.com/techsubject/SnapSickle-logo/main/Schermopname_9-10-2026_17322_www.design.com.jpeg";
  const values={};
  for(const [key,cfg] of Object.entries(settings)) {
    values[key]=cfg.def;
    try { const n=Number.parseInt(localStorage.getItem(cfg.key)||"",10); if(Number.isInteger(n)&&n>=cfg.min&&n<=cfg.max) values[key]=n; } catch(_) {}
  }
  const style=document.createElement("style");
  style.textContent=`#dcgs-panel{position:fixed;z-index:2147483647;top:0;left:50%;width:min(390px,calc(100vw - 24px));max-height:90vh;overflow:auto;box-sizing:border-box;transform:translate(-50%,-110%);opacity:0;pointer-events:none;transition:transform 180ms ease,opacity 180ms ease;padding:14px 16px 15px;border:1px solid rgba(255,255,255,.16);border-top:0;border-radius:0 0 14px 14px;background:rgba(25,27,31,.97);color:#f5f5f5;box-shadow:0 10px 32px rgba(0,0,0,.38);font:14px/1.4 system-ui,-apple-system,Segoe UI,sans-serif;backdrop-filter:blur(10px)}#dcgs-panel.dcgs-open{transform:translate(-50%,0);opacity:1;pointer-events:auto}#dcgs-panel *{box-sizing:border-box}#dcgs-panel .dcgs-header{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}#dcgs-panel .dcgs-brand{display:flex;align-items:center;gap:10px;min-width:0}#dcgs-panel .dcgs-logo{width:34px;height:34px;object-fit:contain;border-radius:5px;flex:none;background:#fff}#dcgs-panel .dcgs-title{font-weight:750;font-size:15px}#dcgs-panel .dcgs-version{display:inline-block;margin-left:6px;padding:2px 5px;border-radius:5px;background:#343943;color:#c7cbd1;font-size:10px;font-weight:650;vertical-align:2px}#dcgs-panel .dcgs-key{border:1px solid #50545d;border-radius:5px;padding:2px 7px;color:#c7cbd1;font-size:11px}#dcgs-panel .dcgs-setting{padding:7px 0 10px;border-top:1px solid #3b3f47}#dcgs-panel .dcgs-row{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:5px}#dcgs-panel .dcgs-value{font-size:21px;font-weight:800;font-variant-numeric:tabular-nums}#dcgs-panel input[type=range]:disabled{opacity:.38;cursor:not-allowed}#dcgs-panel input[type=range]{display:block;width:100%;margin:7px 0;accent-color:#7db7ff;cursor:pointer}#dcgs-panel .dcgs-scale{display:flex;justify-content:space-between;color:#aeb4be;font-size:11px}#dcgs-panel .dcgs-note{margin-top:10px;color:#aeb4be;font-size:11px}#dcgs-panel .dcgs-status{margin-top:9px;padding:8px 9px;border-radius:7px;background:#202329;color:#d5d9e0;font-size:11px}#dcgs-panel .dcgs-close{color:#e8eaf0;background:#353941;border:1px solid #51555f;border-radius:7px;padding:5px 9px;cursor:pointer;font:inherit}`;
  (document.documentElement||document.head).appendChild(style);
  const panel=document.createElement("section"); panel.id="dcgs-panel"; panel.setAttribute("aria-label","SnapSickle Grid Snap");
  const patchState=document.documentElement?.getAttribute("data-dcgs-patch");
  let statusText=patchState==="applied"?`X/Z: ${document.documentElement.getAttribute("data-dcgs-xz")}; Y: ${document.documentElement.getAttribute("data-dcgs-y")}.`:patchState==="mismatch"?"Patch not applied: this game build does not match. Check the console.":"X/Z and Y settings are applied when the game code loads.";
  panel.innerHTML=`<div class="dcgs-header"><div class="dcgs-brand"><img class="dcgs-logo" src="${logoUrl}" alt="SnapSickle-logo"><div class="dcgs-title">SnapSickle <span style="font-weight:400;color:#aeb4be">Grid Snap</span><span class="dcgs-version">v0.4.3</span></div></div><div><span class="dcgs-key">Tab</span> <button class="dcgs-close" type="button">Close</button></div></div>${Object.entries(settings).map(([key,cfg])=>`<div class="dcgs-setting"><div class="dcgs-row"><label for="dcgs-${key}">${cfg.title}</label><output class="dcgs-value" id="dcgs-${key}-value">${values[key]}</output></div><input id="dcgs-${key}" data-key="${key}" type="range" min="${cfg.min}" max="${cfg.max}" step="1" value="${values[key]}"><div class="dcgs-scale"><span>${cfg.min}</span><span>${Math.round((cfg.min+cfg.max)/2)}</span><span>${cfg.max}</span></div></div>`).join("")}<div class="dcgs-status" id="dcgs-status">${statusText}</div><div class="dcgs-note">Only X/Z and Y grid spacing are changed. Rotation rules and unverified legacy/camera locations are left untouched. Reload DashCraft after changing a setting, and disable older SnapSickle copies before testing.</div>`;
  (document.documentElement||document.body).appendChild(panel);
  const status=panel.querySelector("#dcgs-status"); let isOpen=false;
  function publish(key,raw) {
    const cfg=settings[key]; let n=Math.round(Math.max(cfg.min,Math.min(cfg.max,Number(raw))));
    values[key]=n; const slider=panel.querySelector(`#dcgs-${key}`); slider.value=String(n);
    const output=panel.querySelector(`#dcgs-${key}-value`); output.value=String(n); output.textContent=output.value;
    try { localStorage.setItem(cfg.key,String(n)); } catch(_) {}
    try { chrome.storage.local.set({[cfg.storage]:n}); } catch(_) {}
    status.textContent=`X/Z: ${values.xz}; Y: ${values.y} (applied after reload).`;
  }
  function setOpen(open) { isOpen=Boolean(open); panel.classList.toggle("dcgs-open",isOpen); panel.setAttribute("aria-hidden",String(!isOpen)); }
  for(const slider of panel.querySelectorAll('input[type="range"]')) slider.addEventListener("input",()=>publish(slider.dataset.key,slider.value));
  panel.querySelector(".dcgs-close").addEventListener("click",()=>setOpen(false));
  document.addEventListener("keydown",event=>{if(event.key!=="Tab"||event.ctrlKey||event.altKey||event.metaKey)return;event.preventDefault();event.stopPropagation();setOpen(!isOpen);},true);
  try { chrome.storage.local.get(["dashcraftGridSnap",...Object.values(settings).map(v=>v.storage),"dashcraftGridSnapY"],result=>{for(const [key,cfg] of Object.entries(settings)){if(localStorage.getItem(cfg.key))continue;const stored=result[cfg.storage];const old=key==="xz"?result.dashcraftGridSnap:undefined;const n=Number.isInteger(stored)?stored:old;if(Number.isInteger(n)&&n>=cfg.min&&n<=cfg.max){panel.querySelector(`#dcgs-${key}`).value=String(n);publish(key,n);}}}); } catch(_) {}
})();
