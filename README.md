# SnapSickle Grid Snap

**Customize object grid snapping in DashCraft.io.**

SnapSickle Grid Snap is an experimental browser extension for adjusting object placement snapping in DashCraft's editor.

The extension modifies selected WebAssembly (WASM) instructions at runtime to change grid-snapping behavior.

> **Status: Experimental**
>
> Some features may behave unexpectedly depending on the game version. Vertical movement and camera behavior may not work perfectly. Rotation modification is currently excluded because reliable rotation modification has not been established.

## Features

- **Custom grid snapping:** Adjust supported horizontal and vertical snapping intervals.
- **In-game settings panel:** Configure snapping without manually editing the extension's source.
- **Runtime patching:** Applies supported modifications when DashCraft loads its WebAssembly module.
- **Version display:** Check which version of SnapSickle is installed.
- **English interface:** Settings and instructions are provided in English.

Feature availability may change between releases.

---

## Quick Start Tutorial

### 1. Install SnapSickle

1. Download the ZIP file for the latest version.
2. Extract the ZIP file into a folder on your computer.
3. Open your browser's extensions page:
   - **Google Chrome:** `chrome://extensions`
   - **Microsoft Edge:** `edge://extensions`
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted SnapSickle folder containing `manifest.json`.
7. Make sure SnapSickle is enabled.

Keep the extracted folder in place while using the extension.

### 2. Open DashCraft

1. Open [DashCraft.io](https://dashcraft.io/).
2. Enter the track editor.
3. Press **Tab** to open the SnapSickle settings panel.
4. Check the version number displayed in the panel.

### 3. Configure Grid Snapping

1. Adjust the available X/Z and Y snapping settings.
2. **Completely reload DashCraft** to apply the changes.
3. Wait for the game to finish loading.
4. Move an object to test the new snapping intervals.

### 4. How to Reload DashCraft

SnapSickle applies its settings when the game's WebAssembly module loads. Changing a setting does not automatically update an already-running game instance.

To reload the game:

1. Save your track.
2. Press **Ctrl + R** on Windows, or click your browser's reload button.
3. Wait for DashCraft to finish loading.
4. Reopen the editor and test the snapping settings.

If the settings still do not apply, check that SnapSickle is enabled and that you have not left an older version active.

**Important:** A snapping interval of 5 allows positions such as 0, 5, 10, and 15. It does not force every object to sit at position 5.

---

## User Manual

### Opening the Settings Panel

1. Open DashCraft.io.
2. Enter the editor.
3. Press **Tab** to open the SnapSickle settings panel.
4. Check the displayed version number.

The panel's availability may depend on the installed version and the current game state.

### Adjusting Grid Snapping

1. Open the SnapSickle panel.
2. Change the supported X/Z or Y snapping values.
3. Reload DashCraft completely.
4. Test the result on a spare track before using it on an important project.

Changing a snapping interval does not necessarily move an existing object immediately. The result depends on how DashCraft handles the object's current position and subsequent movement.

### Understanding the Axes

| Axis | Purpose |
|---|---|
| X | Horizontal position on one world axis |
| Y | Vertical height |
| Z | Horizontal position on the other world axis |

A snapping interval determines the spacing between permitted positions. For example, with an interval of 5, positions such as 0, 5, 10, and 15 may be valid.

### Rotation

Rotation modification is currently not supported. SnapSickle does not attempt to change DashCraft's rotation rules.

---

## Troubleshooting

### The Settings Panel Does Not Appear

- Confirm that SnapSickle is enabled in your browser.
- Check that you loaded the folder containing `manifest.json`.
- Reload DashCraft.
- Check the browser console for extension errors.

### Settings Change, but Object Positions Do Not

- Completely reload DashCraft after changing the settings.
- Confirm that only
