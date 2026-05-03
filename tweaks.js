/* SteinzSecurity — vanilla Tweaks panel
   Hooked into the host's edit-mode protocol. */
(function () {
  'use strict';

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentHue": 200,
    "accentHue2": 290,
    "showNetworkNodes": true,
    "showLiveFeed": true,
    "headlineSize": 100,
    "gridOpacity": 4,
    "compactSpacing": false
  }/*EDITMODE-END*/;

  let state = { ...TWEAK_DEFAULTS };
  let panel = null;

  /* ---- Apply tweaks to live page ---- */
  const apply = () => {
    const r = document.documentElement.style;
    r.setProperty('--accent', `oklch(80% 0.14 ${state.accentHue})`);
    r.setProperty('--accent-2', `oklch(72% 0.16 ${state.accentHue2})`);
    r.setProperty('--tweak-headline-scale', state.headlineSize / 100);
    r.setProperty('--tweak-grid-opacity', state.gridOpacity / 100);

    document.body.classList.toggle('hide-nodes', !state.showNetworkNodes);
    document.body.classList.toggle('hide-feed', !state.showLiveFeed);
    document.body.classList.toggle('compact', state.compactSpacing);
  };

  const setTweak = (k, v) => {
    state = { ...state, [k]: v };
    apply();
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };

  /* ---- Build panel ---- */
  const STYLE = `
.twk{position:fixed;right:16px;bottom:16px;z-index:9999;width:280px;display:none;flex-direction:column;
  background:oklch(15% 0.018 250 / 0.92);color:#fff;border:1px solid oklch(100% 0 0 / 0.1);
  border-radius:14px;font:12px/1.4 "Inter",system-ui,sans-serif;overflow:hidden;
  backdrop-filter:blur(20px);box-shadow:0 20px 50px rgba(0,0,0,.5)}
.twk.is-open{display:flex}
.twk__hd{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;
  border-bottom:1px solid oklch(100% 0 0 / 0.08)}
.twk__hd b{font-size:13px;font-weight:600;letter-spacing:-0.01em}
.twk__x{background:none;border:0;color:rgba(255,255,255,.5);width:24px;height:24px;border-radius:6px;cursor:pointer;font-size:16px;line-height:1}
.twk__x:hover{background:oklch(100% 0 0 / 0.08);color:#fff}
.twk__body{padding:14px 16px;display:flex;flex-direction:column;gap:14px;max-height:70vh;overflow-y:auto}
.twk__sec{font-family:"JetBrains Mono",monospace;font-size:10px;text-transform:uppercase;letter-spacing:.16em;color:rgba(255,255,255,.45);margin-top:4px}
.twk__row{display:flex;flex-direction:column;gap:6px}
.twk__row label{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.85)}
.twk__row label b{font-family:"JetBrains Mono",monospace;font-size:11px;color:oklch(80% 0.14 200)}
.twk input[type=range]{appearance:none;width:100%;height:4px;background:oklch(100% 0 0 / 0.1);border-radius:4px;outline:none}
.twk input[type=range]::-webkit-slider-thumb{appearance:none;width:14px;height:14px;border-radius:50%;background:oklch(80% 0.14 200);cursor:pointer}
.twk input[type=range]::-moz-range-thumb{width:14px;height:14px;border-radius:50%;background:oklch(80% 0.14 200);cursor:pointer;border:0}
.twk__toggle{display:flex;justify-content:space-between;align-items:center;font-size:12px;color:rgba(255,255,255,.85);cursor:pointer}
.twk__sw{position:relative;width:32px;height:18px;background:oklch(100% 0 0 / 0.12);border-radius:999px;transition:background .2s;flex:none}
.twk__sw::after{content:"";position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;background:#fff;transition:transform .2s}
.twk__toggle input{display:none}
.twk__toggle input:checked + .twk__sw{background:linear-gradient(135deg,oklch(80% 0.14 200),oklch(72% 0.16 290))}
.twk__toggle input:checked + .twk__sw::after{transform:translateX(14px)}
`;

  const buildPanel = () => {
    const style = document.createElement('style');
    style.textContent = STYLE;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.className = 'twk';
    panel.innerHTML = `
      <div class="twk__hd">
        <b>Tweaks</b>
        <button class="twk__x" aria-label="Close">×</button>
      </div>
      <div class="twk__body">
        <div class="twk__sec">Color</div>
        <div class="twk__row">
          <label>Accent hue <b id="t-h1v">${state.accentHue}</b></label>
          <input type="range" min="0" max="360" value="${state.accentHue}" data-k="accentHue">
        </div>
        <div class="twk__row">
          <label>Secondary hue <b id="t-h2v">${state.accentHue2}</b></label>
          <input type="range" min="0" max="360" value="${state.accentHue2}" data-k="accentHue2">
        </div>

        <div class="twk__sec">Layout</div>
        <div class="twk__row">
          <label>Headline scale <b id="t-hsv">${state.headlineSize}%</b></label>
          <input type="range" min="70" max="130" value="${state.headlineSize}" data-k="headlineSize">
        </div>
        <div class="twk__row">
          <label>Grid intensity <b id="t-gov">${state.gridOpacity}</b></label>
          <input type="range" min="0" max="12" value="${state.gridOpacity}" data-k="gridOpacity">
        </div>
        <label class="twk__toggle">Compact spacing
          <input type="checkbox" data-k="compactSpacing" ${state.compactSpacing ? 'checked':''}>
          <span class="twk__sw"></span>
        </label>

        <div class="twk__sec">Hero</div>
        <label class="twk__toggle">Network nodes
          <input type="checkbox" data-k="showNetworkNodes" ${state.showNetworkNodes ? 'checked':''}>
          <span class="twk__sw"></span>
        </label>
        <label class="twk__toggle">Live SOC feed card
          <input type="checkbox" data-k="showLiveFeed" ${state.showLiveFeed ? 'checked':''}>
          <span class="twk__sw"></span>
        </label>
      </div>`;
    document.body.appendChild(panel);

    panel.querySelector('.twk__x').addEventListener('click', closePanel);
    panel.querySelectorAll('input[type=range]').forEach(inp => {
      inp.addEventListener('input', e => {
        const k = e.target.dataset.k;
        const v = parseInt(e.target.value, 10);
        const labelEl = panel.querySelector(`#t-${k === 'accentHue' ? 'h1v' : k === 'accentHue2' ? 'h2v' : k === 'headlineSize' ? 'hsv' : 'gov'}`);
        if (labelEl) labelEl.textContent = k === 'headlineSize' ? v + '%' : v;
        setTweak(k, v);
      });
    });
    panel.querySelectorAll('input[type=checkbox]').forEach(inp => {
      inp.addEventListener('change', e => setTweak(e.target.dataset.k, e.target.checked));
    });
  };

  const openPanel = () => { if (!panel) buildPanel(); panel.classList.add('is-open'); };
  const closePanel = () => {
    if (panel) panel.classList.remove('is-open');
    window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*');
  };

  /* ---- Host protocol — register listener BEFORE announcing ---- */
  window.addEventListener('message', (e) => {
    const t = e.data && e.data.type;
    if (t === '__activate_edit_mode') openPanel();
    else if (t === '__deactivate_edit_mode') closePanel();
  });
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  apply();
})();
