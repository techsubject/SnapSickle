# SnapSickle Grid Snap

**Customize object grid snapping in DashCraft.io.**

SnapSickle Grid Snap is an experimental browser extension for adjusting object placement snapping in DashCraft's editor.

The project modifies selected WebAssembly (WASM) instructions at runtime to change grid-snapping behavior.

> **Status: Experimental**
>
> Some features may behave unexpectedly depending on the game version. In particular, vertical movement and camera behavior may not work perfectly. Rotation controls are currently excluded because reliable rotation modification has not been established.

## Features

- **Custom grid snapping:** Adjust supported horizontal and vertical snapping intervals.
- **In-game settings panel:** Configure snapping without manually editing the extension's source.
- **Runtime patching:** Applies supported modifications when DashCraft loads its WebAssembly module.

Feature availability may change between releases.

## Installation

### Requirements

- Google Chrome or Microsoft Edge
- Access to DashCraft.io
- The SnapSickle Grid Snap extension files

### Install on Chrome or Edge

1. Download the ZIP file for the version you want to install.
2. Extract the ZIP into a folder on your computer.
3. Open `chrome://extensions` in Chrome or `edge://extensions` in Edge.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted extension folder containing `manifest.json`.
7. Open or reload DashCraft.io.

Keep the extracted folder in place while using the extension. The browser loads the extension directly from that folder.

### Updating

1. Disable or remove the previous SnapSickle installation.
2. Extract the new version into a separate folder.
3. Load the new folder through the browser's extensions page.
4. Reload DashCraft completely.

Only keep one SnapSickle version enabled at a time to avoid conflicts between runtime patches.

## User Manual

### Opening the settings panel

1. Open DashCraft.io.
2. Enter the editor.
3. Press **Tab** to open the SnapSickle settings panel.
4. Check the version number displayed in the panel.

The panel's availability may depend on the installed version and the current game state.

### Adjusting grid snapping

1. Open the SnapSickle panel.
2. Change the supported X/Z or Y snapping values.
3. Save or apply the settings using the controls provided by your installed version.
4. Reload DashCraft completely so the WebAssembly module can be patched with the new settings.
5. Test the result on a spare track before using it on an important project.

**Important:** Changing a snapping interval does not necessarily move an existing object immediately. The result depends on how DashCraft handles the object's current position and subsequent movement.

### Understanding the axes

| Axis | Purpose |
|---|---|
| X | Horizontal position on one world axis |
| Y | Vertical height |
| Z | Horizontal position on the other world axis |

A snapping interval determines the spacing between permitted positions. For example, an interval of 5 does not mean that every object must be placed at Y = 5. A position of Y = 15 is also a multiple of 5.

### Known limitations

- Vertical snapping may interact incorrectly with the camera.
- Mouse-following behavior may vary when changing the Y interval.
- Scroll-wheel and keyboard movement may not always follow the expected grid spacing.
- Rotation modification is not currently supported.
- DashCraft updates may change the WebAssembly instructions targeted by the extension.
- A successful patch or compilation does not guarantee correct in-game behavior.

If a feature stops working after a DashCraft update, disable the extension and report the issue with the game version, extension version, and steps to reproduce it.

## Troubleshooting

### The settings panel does not appear

- Confirm that SnapSickle is enabled in your browser.
- Reload DashCraft.
- Check that you loaded the folder containing `manifest.json`.
- Check the browser console for extension errors.

### Settings change, but object positions do not

- Reload DashCraft after changing the settings.
- Confirm that only one SnapSickle version is enabled.
- Test with a new or disposable track.
- Remember that existing positions may remain unchanged until the object is moved.

### The camera moves unexpectedly

Disable SnapSickle and reload DashCraft to check whether the issue persists without the extension. Avoid using experimental vertical snapping on an important track until the behavior is reliable.

### The extension stops working after a game update

The extension depends on specific WebAssembly instruction locations. A game update can change those locations or the surrounding logic. Do not assume that an older patch remains compatible with a newer build.

## Legal Rights and Disclaimer

### Ownership

SnapSickle Grid Snap is an independent project. Unless otherwise stated in a specific file or third-party license, the original source code, documentation, and original project assets created for SnapSickle remain the property of their respective copyright holders.

Publishing this repository does not automatically grant permission to copy, redistribute, modify, or commercially exploit its contents. Permission must be obtained from the relevant copyright holder unless an applicable license or law allows the activity.

### DashCraft and third-party rights

DashCraft.io, its game, trademarks, assets, and underlying software belong to their respective owners. SnapSickle is not an official DashCraft product and is not affiliated with, endorsed by, or sponsored by the DashCraft developers.

This project does not claim ownership of DashCraft's code or assets. Do not redistribute the game's original files as part of this project without the necessary permission.

### License

**No license is currently granted unless a separate `LICENSE` file or an explicit license notice states otherwise.**

Making this repository publicly visible does not, by itself, place its contents under an open-source license. All applicable copyright and other legal protections remain in effect.

If a license is added in the future, its terms will govern the use, modification, and redistribution of the material covered by that license.

### Disclaimer of Warranty

SnapSickle is provided on an experimental, as-is basis, without guarantees that it will function correctly, remain compatible with future DashCraft updates, or preserve every editing feature.

Use it at your own risk. Back up important tracks before testing experimental modifications. The project author is not responsible for lost work, unexpected game behavior, or damage resulting from use of the extension, to the extent permitted by applicable law.

Users remain responsible for following applicable laws and the relevant platform's terms and rules.

### Reporting Issues

When reporting a bug, include:

- SnapSickle version
- Browser and version
- DashCraft build, if known
- Steps to reproduce the problem
- Expected behavior and actual behavior

Do not include passwords, session tokens, or other private account information in bug reports.

## Development

SnapSickle uses browser-extension APIs and runtime WebAssembly modification.

Changes to the game's underlying build may require new instruction signatures and compatibility checks. Patch validation should include both technical tests and in-game testing before a release is described as stable.

## Credits

Created by **TechSubject**.

Repository: [github.com/techsubject/SnapSickle](https://github.com/techsubject/SnapSickle)

---

*SnapSickle Grid Snap is an unofficial community project. DashCraft remains the property of its respective owners.*
