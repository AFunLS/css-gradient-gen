const presets = [
  {
    name: 'Aurora Flow',
    type: 'linear',
    angle: 120,
    stops: [
      { color: '#7c5cff', position: 0 },
      { color: '#2dd4bf', position: 52 },
      { color: '#f9a826', position: 100 },
    ],
  },
  {
    name: 'Sunset Bloom',
    type: 'linear',
    angle: 90,
    stops: [
      { color: '#ff6b6b', position: 0 },
      { color: '#f06595', position: 48 },
      { color: '#845ef7', position: 100 },
    ],
  },
  {
    name: 'Ocean Mist',
    type: 'radial',
    angle: 90,
    stops: [
      { color: '#0ea5e9', position: 0 },
      { color: '#14b8a6', position: 55 },
      { color: '#0f172a', position: 100 },
    ],
  },
  {
    name: 'Candy Pop',
    type: 'linear',
    angle: 135,
    stops: [
      { color: '#ff4d6d', position: 0 },
      { color: '#ffb703', position: 50 },
      { color: '#8338ec', position: 100 },
    ],
  },
];

const state = structuredClone(presets[0]);

const elements = {
  previewSurface: document.getElementById('previewSurface'),
  cssOutput: document.getElementById('cssOutput'),
  stopsList: document.getElementById('stopsList'),
  presetGrid: document.getElementById('presetGrid'),
  angleRange: document.getElementById('angleRange'),
  angleNumber: document.getElementById('angleNumber'),
  angleGroup: document.getElementById('angleGroup'),
  copyBtn: document.getElementById('copyBtn'),
  copySecondaryBtn: document.getElementById('copySecondaryBtn'),
  copyStatus: document.getElementById('copyStatus'),
  addStopBtn: document.getElementById('addStopBtn'),
  randomizeBtn: document.getElementById('randomizeBtn'),
  stopTemplate: document.getElementById('stopTemplate'),
  typeButtons: [...document.querySelectorAll('.segment')],
};

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function gradientString() {
  const orderedStops = [...state.stops].sort((a, b) => a.position - b.position);
  const stopString = orderedStops.map((stop) => `${stop.color} ${stop.position}%`).join(', ');
  return state.type === 'linear'
    ? `linear-gradient(${state.angle}deg, ${stopString})`
    : `radial-gradient(circle, ${stopString})`;
}

function cssString() {
  return `.gradient-preview {\n  background: ${gradientString()};\n}`;
}

function renderTypeButtons() {
  elements.typeButtons.forEach((button) => {
    button.classList.toggle('active', button.dataset.type === state.type);
  });
  elements.angleGroup.style.display = state.type === 'linear' ? 'block' : 'none';
}

function renderStops() {
  elements.stopsList.innerHTML = '';
  state.stops
    .sort((a, b) => a.position - b.position)
    .forEach((stop, index) => {
      const fragment = elements.stopTemplate.content.cloneNode(true);
      const row = fragment.querySelector('.stop-row');
      const colorInput = fragment.querySelector('.stop-color');
      const rangeInput = fragment.querySelector('.stop-position-range');
      const numberInput = fragment.querySelector('.stop-position-number');
      const removeButton = fragment.querySelector('.stop-remove');

      colorInput.value = stop.color;
      rangeInput.value = stop.position;
      numberInput.value = stop.position;
      removeButton.disabled = state.stops.length <= 2;

      colorInput.addEventListener('input', (event) => {
        state.stops[index].color = event.target.value;
        render();
      });

      const syncPosition = (value) => {
        const nextValue = clamp(Number(value) || 0, 0, 100);
        state.stops[index].position = nextValue;
        render();
      };

      rangeInput.addEventListener('input', (event) => syncPosition(event.target.value));
      numberInput.addEventListener('input', (event) => syncPosition(event.target.value));

      removeButton.addEventListener('click', () => {
        if (state.stops.length <= 2) return;
        state.stops.splice(index, 1);
        render();
      });

      row.dataset.index = String(index);
      elements.stopsList.appendChild(fragment);
    });
}

function renderPresets() {
  elements.presetGrid.innerHTML = '';
  presets.forEach((preset) => {
    const button = document.createElement('button');
    button.className = 'preset-card';
    button.type = 'button';
    button.innerHTML = `
      <div class="preset-swatch" style="background:${preset.type === 'linear' ? `linear-gradient(${preset.angle}deg, ${preset.stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})` : `radial-gradient(circle, ${preset.stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ')})`} "></div>
      <div class="preset-name">${preset.name}</div>
    `;
    button.addEventListener('click', () => {
      Object.assign(state, structuredClone(preset));
      render();
    });
    elements.presetGrid.appendChild(button);
  });
}

function renderOutput() {
  const gradient = gradientString();
  elements.previewSurface.style.background = gradient;
  elements.cssOutput.textContent = cssString();
  elements.angleRange.value = state.angle;
  elements.angleNumber.value = state.angle;
}

function render() {
  renderTypeButtons();
  renderStops();
  renderPresets();
  renderOutput();
}

async function copyCss() {
  const text = cssString();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    elements.copyStatus.textContent = 'Copied';
    elements.copyStatus.classList.add('success');
    window.setTimeout(() => {
      elements.copyStatus.textContent = 'Ready';
      elements.copyStatus.classList.remove('success');
    }, 1600);
  } catch (error) {
    elements.copyStatus.textContent = 'Copy failed';
  }
}

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
}

function randomizeGradient() {
  state.type = Math.random() > 0.5 ? 'linear' : 'radial';
  state.angle = Math.floor(Math.random() * 361);
  state.stops = Array.from({ length: 3 + Math.floor(Math.random() * 2) }, (_, index, array) => ({
    color: randomHex(),
    position: Math.round((index / (array.length - 1)) * 100),
  }));
  render();
}

elements.typeButtons.forEach((button) => {
  button.addEventListener('click', () => {
    state.type = button.dataset.type;
    render();
  });
});

elements.angleRange.addEventListener('input', (event) => {
  state.angle = clamp(Number(event.target.value), 0, 360);
  renderOutput();
});

elements.angleNumber.addEventListener('input', (event) => {
  state.angle = clamp(Number(event.target.value), 0, 360);
  renderOutput();
});

elements.addStopBtn.addEventListener('click', () => {
  if (state.stops.length >= 5) return;
  const lastPosition = state.stops[state.stops.length - 1]?.position ?? 100;
  const nextPosition = clamp(lastPosition - 10, 0, 100);
  state.stops.push({ color: randomHex(), position: nextPosition });
  render();
});

elements.randomizeBtn.addEventListener('click', randomizeGradient);

elements.copyBtn.addEventListener('click', copyCss);

elements.copySecondaryBtn.addEventListener('click', copyCss);

render();
