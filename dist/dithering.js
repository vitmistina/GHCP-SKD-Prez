// SVG compositing filters process the live DOM and WebGL canvas together.
// No screenshots, animation polling, external libraries or network are needed.
export function initDithering() {
  const ns = 'http://www.w3.org/2000/svg';
  // A new preset version adopts the requested defaults without stale v1 settings.
  const key = 'ghcp-dithering-v2';
  const palettes = {
    mono: ['Ink & paper', ['#20251f', '#f5f1e8']],
    gameboy: ['Game Boy', ['#0f380f', '#306230', '#8bac0f', '#9bbc0f']],
    sepia: ['Sepia archive', ['#30251e', '#785840', '#bb976b', '#f5e7c6']],
    phosphor: ['Green phosphor', ['#071b13', '#164d35', '#3e9360', '#a8f0b0']],
    sunset: ['Sunset print', ['#292344', '#754462', '#c77572', '#edb890', '#fff0c9']],
    pastel: ['Pastel paper', ['#343747', '#797995', '#ada9c2', '#d9c6ca', '#f6eee0']],
    cga: ['CGA · cyan / magenta', ['#000000', '#aa00aa', '#00aaaa', '#ffffff']],
  };
  const defaults = { enabled: true, scope: 'slide', palette: 'mono', bits: 4,
    pattern: 'noise', size: 1, strength: .81, mix: 1, contrast: 1, brightness: -.06,
    excludeText: false, excludePhotos: false };
  const booleanSettings = ['enabled', 'excludeText', 'excludePhotos'];
  const limits = { bits: [1, 8, 1], size: [1, 16, 1], strength: [0, 1, .01],
    mix: [0, 1, .01], contrast: [.5, 2, .01], brightness: [-.4, .4, .01] };
  let state = { ...defaults };
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    if (saved && typeof saved === 'object') {
      for (const name of booleanSettings) if (typeof saved[name] === 'boolean') state[name] = saved[name];
      for (const name of ['scope', 'palette', 'pattern']) {
        const allowed = name === 'scope' ? ['slide', 'scene'] : name === 'pattern'
          ? ['bayer2', 'bayer4', 'bayer8', 'noise'] : [...Object.keys(palettes), 'rgb', 'gray'];
        if (allowed.includes(saved[name])) state[name] = saved[name];
      }
      for (const [name, [min, max, step]] of Object.entries(limits)) {
        if (typeof saved[name] === 'number' && Number.isFinite(saved[name])) {
          state[name] = Math.max(min, Math.min(max, saved[name]));
          if (step === 1) state[name] = Math.round(state[name]);
        }
      }
    }
  } catch { /* Storage can be unavailable when opened as a local file. */ }

  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.position = 'absolute';
  document.body.append(svg);
  const make = (tag, attrs, parent = svg) => {
    const el = document.createElementNS(ns, tag);
    for (const [name, value] of Object.entries(attrs)) el.setAttribute(name, value);
    parent.append(el); return el;
  };
  const filter = make('filter', { id: 'dither-filter', x: '0%', y: '0%', width: '100%', height: '100%',
    'color-interpolation-filters': 'sRGB' });
  // Flatten transparency against the slide's paper before quantising colors.
  make('feFlood', { 'flood-color': '#f5f1e8', result: 'paper' }, filter);
  make('feComposite', { in: 'SourceGraphic', in2: 'paper', operator: 'over', result: 'opaque' }, filter);
  const tone = make('feComponentTransfer', { in: 'opaque', result: 'tone' }, filter);
  const toneChannels = ['R', 'G', 'B'].map(c => make('feFunc' + c, { type: 'linear' }, tone));
  const luminance = make('feColorMatrix', { in: 'tone', type: 'matrix', result: 'base' }, filter);
  const patternImage = make('feImage', { x: 0, y: 0, preserveAspectRatio: 'none', result: 'tile' }, filter);
  make('feTile', { in: 'tile', result: 'threshold' }, filter);
  const noise = make('feComposite', { in: 'base', in2: 'threshold', operator: 'arithmetic',
    k1: 0, k2: 1, result: 'dithered' }, filter);
  const quantize = make('feComponentTransfer', { in: 'dithered', result: 'quantized' }, filter);
  const channels = ['R', 'G', 'B'].map(c => make('feFunc' + c, { type: 'discrete' }, quantize));
  const blend = make('feComposite', { in: 'quantized', in2: 'opaque', operator: 'arithmetic', k1: 0, k4: 0, result: 'mixed' }, filter);
  // Keep transparent corners/text edges when filtering separate page layers.
  make('feComposite', { in: 'mixed', in2: 'SourceAlpha', operator: 'in' }, filter);

  const panel = document.createElement('aside');
  panel.id = 'dither-panel'; panel.hidden = true;
  panel.setAttribute('aria-labelledby', 'dither-title');
  panel.innerHTML = `
    <div class="dither-head"><div><span>LIVE POSTPROCESSING</span><h2 id="dither-title">Dither studio</h2></div><button id="dither-close" aria-label="Close effects panel">×</button></div>
    <label class="dither-switch" for="dither-enabled"><span>Enable effect<small>Toggle anytime with D</small></span><input id="dither-enabled" type="checkbox" role="switch"></label>
    <label class="dither-field" for="dither-scope">Apply to<select id="dither-scope"><option value="slide">Entire slide</option><option value="scene">3D illustration only</option></select></label>
    <fieldset class="dither-exclusions"><legend>Keep original</legend>
      <label><input id="dither-excludeText" type="checkbox"> Exclude all text</label>
      <label><input id="dither-excludePhotos" type="checkbox"> Exclude all photos</label>
      <p class="dither-help">Includes 3D labels and photos. Screenshots count as photos; their embedded text stays with the image. The DSKY display is preserved as a whole with text.</p>
    </fieldset>
    <label class="dither-field" for="dither-palette">Color palette<select id="dither-palette">${Object.entries(palettes).map(([id, [label]]) => `<option value="${id}">${label}</option>`).join('')}<option value="rgb">RGB · 1–8 bit</option><option value="gray">Grayscale · 1–8 bit</option></select></label>
    <div id="dither-swatches" aria-label="Palette preview"></div><p id="dither-color-count" class="dither-help"></p>
    <label class="dither-field" for="dither-pattern">Dither pattern<select id="dither-pattern"><option value="bayer2">Bayer 2 × 2</option><option value="bayer4">Bayer 4 × 4</option><option value="bayer8">Bayer 8 × 8</option><option value="noise">Static noise</option></select></label>
    <div id="dither-sliders"></div>
    <div class="dither-actions"><button id="dither-compare" aria-pressed="false">Show original</button><button id="dither-reset">Reset</button></div>
    <p class="dither-help">Settings are saved in this browser. D: effect on/off · Shift+D: panel · Esc: close. At 100% mix, filtered content uses the selected palette. Excluded content keeps its original colors.</p>`;
  document.body.append(panel);
  const $ = id => document.getElementById('dither-' + id);
  const labels = { bits: 'Bit depth', size: 'Raster cell', strength: 'Dither strength', mix: 'Effect mix', contrast: 'Contrast', brightness: 'Brightness' };
  for (const [name, [min, max, step]] of Object.entries(limits)) {
    const label = document.createElement('label'); label.className = 'dither-range'; label.htmlFor = 'dither-' + name;
    label.innerHTML = `<span>${labels[name]}<output id="dither-value-${name}" for="dither-${name}"></output></span><input type="range" id="dither-${name}" min="${min}" max="${max}" step="${step}">`;
    $('sliders').append(label);
  }
  const launcher = document.createElement('button');
  launcher.id = 'dither-launcher'; launcher.textContent = '◩ Effects';
  launcher.setAttribute('aria-controls', panel.id); launcher.setAttribute('aria-expanded', 'false');
  launcher.title = 'Dithering settings (Shift+D)'; document.body.append(launcher);
  let comparing = false, previousFocus, lastPattern = '';
  const surface = document.getElementById('presentation-surface');
  const background = document.createElement('div');
  background.id = 'dither-background'; background.setAttribute('aria-hidden', 'true');
  surface.prepend(background);
  const filteredElements = new Set();
  const target = el => { el.style.filter = 'url(#dither-filter)'; filteredElements.add(el); };
  // A child cannot opt out of its parent's filter. Split at image boundaries
  // instead, preserving the original DOM, layout, focus and event handlers.
  function applyTargets() {
    for (const el of filteredElements) el.style.filter = '';
    filteredElements.clear();
    const active = state.enabled && !comparing;
    const world = document.getElementById('world');
    if (!active) return;
    if (state.scope === 'scene') { target(world); return; }
    if (!state.excludeText && !state.excludePhotos) { target(surface); return; }
    target(background); target(world);
    if (state.excludeText) {
      if (!state.excludePhotos) surface.querySelectorAll('img').forEach(target);
      return;
    }
    const visit = el => {
      if (el === background || el === world || el.id === 'world-preserved' || el.tagName === 'IMG' || el.tagName === 'DIALOG') return;
      if (!el.querySelector('img')) { target(el); return; }
      // Existing photo containers hold their copy in child elements.
      for (const child of el.children) visit(child);
    };
    for (const child of surface.children) visit(child);
  }
  // Slide copy/photos are replaced in place; reassign only filter targets.
  new MutationObserver(() => applyTargets()).observe(surface, { childList: true, subtree: true });
  const open = value => {
    if (value) previousFocus = document.activeElement;
    panel.hidden = !value; launcher.setAttribute('aria-expanded', String(value));
    if (value) $('close').focus();
    else { comparing = false; apply(); (previousFocus?.isConnected ? previousFocus : launcher).focus(); }
  };
  launcher.onclick = () => open(panel.hidden);
  $('close').onclick = () => open(false);
  $('compare').onclick = () => { comparing = !comparing; apply(); };
  $('reset').onclick = () => { state = { ...defaults }; comparing = false; sync(); apply(); save(); };
  const save = () => { try { localStorage.setItem(key, JSON.stringify(state)); } catch {} };
  const levels = count => Array.from({ length: count }, (_, i) => i / (count - 1));
  function colorTables() {
    if (palettes[state.palette]) return [0, 1, 2].map(c => palettes[state.palette][1].map(hex => parseInt(hex.slice(c * 2 + 1, c * 2 + 3), 16) / 255));
    if (state.palette === 'gray' || state.bits < 3) return [0, 1, 2].map(() => levels(2 ** state.bits));
    // Total bits per pixel: 3=1/1/1, 4=1/2/1, ..., 8=3/3/2.
    const b = Math.floor(state.bits / 3), remainder = state.bits % 3;
    return [b + (remainder === 2 ? 1 : 0), b + (remainder >= 1 ? 1 : 0), b].map(n => levels(2 ** n));
  }
  function updatePattern() {
    const signature = state.pattern + ':' + state.size;
    if (signature === lastPattern) return;
    lastPattern = signature;
    const n = state.pattern === 'noise' ? 32 : Number(state.pattern.slice(5));
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = n * state.size;
    const ctx = canvas.getContext('2d');
    let seed = 1977;
    function bayer(x, y, size) {
      if (size === 1) return 0;
      return 4 * bayer(x >> 1, y >> 1, size >> 1) + [[0, 2], [3, 1]][y & 1][x & 1];
    }
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
      const v = Math.round(255 * (state.pattern === 'noise' ? seed / 4294967296 : (bayer(x, y, n) + .5) / (n * n)));
      ctx.fillStyle = `rgb(${v},${v},${v})`; ctx.fillRect(x * state.size, y * state.size, state.size, state.size);
    }
    patternImage.setAttribute('width', canvas.width); patternImage.setAttribute('height', canvas.height);
    patternImage.setAttribute('href', canvas.toDataURL());
  }
  function sync() {
    for (const name of booleanSettings) $(name).checked = state[name];
    for (const name of ['scope', 'palette', 'pattern', ...Object.keys(limits)]) $(name).value = state[name];
    const custom = !palettes[state.palette];
    $('bits').closest('label').hidden = !custom;
    for (const name of Object.keys(limits)) {
      $('value-' + name).value = name === 'size' ? `${state[name]} px` : name === 'bits' ? `${state.bits} bit` : name === 'contrast' ? `${state[name].toFixed(2)}×` : `${Math.round(state[name] * 100)}%`;
    }
    const tables = colorTables();
    let colors = palettes[state.palette]?.[1];
    const gray = state.palette === 'gray' || (state.palette === 'rgb' && state.bits < 3);
    const count = colors ? colors.length : 2 ** state.bits;
    if (!colors) {
      colors = [];
      if (gray) colors = tables[0].map(v => `rgb(${v * 255},${v * 255},${v * 255})`);
      else for (const r of tables[0]) for (const g of tables[1]) for (const b of tables[2]) colors.push(`rgb(${r * 255},${g * 255},${b * 255})`);
    }
    $('swatches').replaceChildren(...colors.map(color => { const swatch = document.createElement('i'); swatch.style.background = color; swatch.title = color; return swatch; }));
    $('color-count').textContent = `${count} colors${state.palette === 'rgb' && state.bits < 3 ? ' · neutral grayscale at 1–2 bit' : custom && !gray ? ' · RGB ' + tables.map(t => Math.log2(t.length)).join('/') : ' · luminance mapped'}`;
  }
  function apply() {
    applyTargets();
    launcher.dataset.enabled = String(state.enabled);
    $('compare').setAttribute('aria-pressed', String(comparing));
    $('compare').textContent = comparing ? 'Return to effect' : 'Show original';
    $('compare').disabled = !state.enabled;
    for (const channel of toneChannels) {
      channel.setAttribute('slope', state.contrast);
      channel.setAttribute('intercept', .5 - .5 * state.contrast + state.brightness);
    }
    const rgb = state.palette === 'rgb' && state.bits >= 3;
    luminance.setAttribute('values', rgb ? '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 1 0' : '.2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 .2126 .7152 .0722 0 0 0 0 0 1 0');
    const tables = colorTables();
    const amplitude = state.strength / (Math.min(...tables.map(t => t.length)) - 1);
    noise.setAttribute('k3', amplitude); noise.setAttribute('k4', -amplitude / 2);
    channels.forEach((channel, c) => channel.setAttribute('tableValues', tables[c].join(' ')));
    blend.setAttribute('k2', state.mix); blend.setAttribute('k3', 1 - state.mix);
    updatePattern();
  }
  for (const name of [...booleanSettings, 'scope', 'palette', 'pattern', ...Object.keys(limits)]) {
    $(name).addEventListener('input', () => {
      state[name] = booleanSettings.includes(name) ? $(name).checked : limits[name] ? Number($(name).value) : $(name).value;
      comparing = false; sync(); apply(); save();
    });
  }
  // Capture panel events before the presentation's Space / arrow navigation.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) { e.preventDefault(); e.stopImmediatePropagation(); open(false); return; }
    const editing = e.target.closest('input,select,textarea,[contenteditable="true"]');
    if (e.key.toLowerCase() === 'd' && !editing && !e.ctrlKey && !e.metaKey && !e.altKey && !document.querySelector('dialog[open]')) {
      e.preventDefault(); e.stopImmediatePropagation();
      if (e.repeat) return;
      if (e.shiftKey) open(panel.hidden);
      else { state.enabled = !state.enabled; comparing = false; sync(); apply(); save(); }
    } else if (panel.contains(e.target) || (e.target === launcher && [' ', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key))) e.stopImmediatePropagation();
  }, true);
  sync(); apply();
  return { getExclusions: () => ({
    text: state.enabled && !comparing && state.excludeText,
    photos: state.enabled && !comparing && state.excludePhotos,
  }) };
}
