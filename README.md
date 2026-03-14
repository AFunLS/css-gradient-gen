# CSS Gradient Generator

A polished static web tool for creating linear CSS gradients with live preview, angle control, two color pickers, and one-click CSS copy.

## Features

- Live gradient preview
- Angle slider and numeric input
- Two color pickers with editable hex values
- Preset gradients for quick inspiration
- Copyable CSS output
- Fully static — works on GitHub Pages

## Usage

1. Open the tool.
2. Adjust the angle.
3. Pick two colors or load a preset.
4. Click **Copy CSS**.
5. Paste the generated CSS into your project.

### Example output

```css
.gradient-surface {
  background: linear-gradient(135deg, #7C3AED 0%, #06B6D4 100%);
}
```

## Local development

Open `index.html` directly in a browser, or serve the folder with a static server.

```bash
cd /Users/fty/Documents/Dev/micro-tools/css-gradient-gen
python3 -m http.server 8124
```

## Live site

https://afunls.github.io/css-gradient-gen/
