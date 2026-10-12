# SnapSickle Grid Snap 0.4.3

English-language Chrome/Edge extension for DashCraft. Press **Tab** to open the in-game panel; the installed version is shown beside the title.

## Settings
- **X/Z snap spacing:** 1–30
- **Y snap spacing:** 1–30

Rotation controls have been removed. This extension does not attempt to override DashCraft's rotation/game rules. The patch also no longer modifies unverified legacy or camera-related WASM locations; only the identified grid/cursor movement instructions are patched.

Settings are saved locally and applied when DashCraft loads its WebAssembly game code. Reload DashCraft after changing a setting. Disable older SnapSickle/Grid Snap copies before testing.

**Validation:** source syntax, target signatures, and WASM compilation can be checked locally, but in-game camera behavior cannot be confirmed without testing in DashCraft. If the camera still moves unexpectedly, that behavior needs a separate runtime investigation rather than another speculative patch.

## Install
1. Extract this ZIP.
2. Open `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Disable/remove older SnapSickle copies.
5. Click **Load unpacked** and select `dashcraft-grid-snap-0.4.3`.
6. Reload DashCraft and press **Tab**. The panel should show `v0.4.3`.
