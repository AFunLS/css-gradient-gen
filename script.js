const angleRange = document.getElementById('angleRange');
const angleNumber = document.getElementById('angleNumber');
const color1 = document.getElementById('color1');
const color2 = document.getElementById('color2');
const color1Text = document.getElementById('color1Text');
const color2Text = document.getElementById('color2Text');
const preview = document.getElementById('preview');
const cssOutput = document.getElementById('cssOutput');
const copyButton = document.getElementById('copyButton');
const copyStatus = document.getElementById('copyStatus');
const presetButtons = document.querySelectorAll('.preset');

function normalizeHex(value) {
  const trimmed = value.trim().toUpperCase();
  return /^#[0-9A-F]{6}$/.test(trimmed) ? trimmed : null;
}

function gradientCss() {
  return `background: linear-gradient(${angleNumber.value}deg, ${color1.value.toUpperCase()} 0%, ${color2.value.toUpperCase()} 100%);`;
}

function render() {
  const css = gradientCss();
  preview.style.background = `linear-gradient(${angleNumber.value}deg, ${color1.value}, ${color2.value})`;
  cssOutput.textContent = [
    '.gradient-surface {',
    `  ${css}`,
    '}'
  ].join('\n');
}

function syncAngle(value) {
  const safeValue = Math.max(0, Math.min(360, Number(value) || 0));
  angleRange.value = safeValue;
  angleNumber.value = safeValue;
  render();
}

function syncColor(picker, textInput, value) {
  const normalized = normalizeHex(value);
  if (!normalized) {
    textInput.value = picker.value.toUpperCase();
    return;
  }
  picker.value = normalized;
  textInput.value = normalized;
  render();
}

angleRange.addEventListener('input', (event) => syncAngle(event.target.value));
angleNumber.addEventListener('input', (event) => syncAngle(event.target.value));

color1.addEventListener('input', (event) => syncColor(color1, color1Text, event.target.value));
color2.addEventListener('input', (event) => syncColor(color2, color2Text, event.target.value));
color1Text.addEventListener('change', (event) => syncColor(color1, color1Text, event.target.value));
color2Text.addEventListener('change', (event) => syncColor(color2, color2Text, event.target.value));

presetButtons.forEach((button) => {
  button.addEventListener('click', () => {
    syncAngle(button.dataset.angle);
    syncColor(color1, color1Text, button.dataset.color1);
    syncColor(color2, color2Text, button.dataset.color2);
    copyStatus.textContent = `Loaded ${button.textContent} preset.`;
  });
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(cssOutput.textContent);
    copyStatus.textContent = 'CSS copied to clipboard.';
  } catch (error) {
    copyStatus.textContent = 'Clipboard copy failed. You can still select and copy the CSS manually.';
    console.error(error);
  }
});

color1Text.value = color1.value.toUpperCase();
color2Text.value = color2.value.toUpperCase();
render();
