const { seg, eo, eio, eob, lerp } = kit;
const R = window.RES, C = window.CARD;
const tally = (list) => { const m = new Map(); list.forEach((n) => m.set(n, (m.get(n) || 0) + 1)); return [...m]; };
const best = (k) => { const max = Math.max(0, ...Object.values(R.game).map((p) => p[k])); return max ? Object.keys(R.game).filter((n) => R.game[n][k] === max).map((n) => [n, max]) : []; };
const mins = (nm) => (R.goalMins || []).filter((m, i) => R.goals[i] === nm && m).map((m) => m.min + (m.add ? '+' + m.add : '') + '\u2019').join(', ');
const groups = [];
if (R.goals.length) groups.push(['Goals', tally(R.goals), 'GLS']);
if (R.assists.length) groups.push(['Assists', tally(R.assists), 'AST']);
const bw = best('w'); if (bw.length) groups.push(['Ball wins', bw, 'B.WINS']);
const sv = best('s'); if (sv.length) groups.push(['Saves', sv, 'SAVES']);
if (R.them === 0 && groups.length) { const g = groups.find((x) => x[0] === 'Saves'); if (g) g[0] = 'Saves \u00b7 Clean sheet'; }
// lay groups out in rows: a group with 3+ players gets a full-width row, smaller groups pair up side by side
const LAY = [];
{ let pend = null;
  groups.forEach((g) => {
    if (g[1].length > 2) { if (pend) { LAY.push([pend]); pend = null; } LAY.push([g]); }
    else if (pend) { LAY.push([pend, g]); pend = null; } else pend = g;
  });
  if (pend) LAY.push([pend]);
}
const cardW = (g, width) => Math.min(220, Math.floor((width - 60 - (g[1].length - 1) * 18) / g[1].length));
const ROWH = LAY.map((row) => 66 + Math.max(...row.map((g) => Math.round(1040 * cardW(g, row.length === 1 ? 1080 : 540) / 720))) + (row.some((g) => g[2] === 'GLS') ? 56 : 0));
const GAP_R = 34, TOTAL = ROWH.reduce((a, b) => a + b, 0) + GAP_R * (LAY.length - 1);
const TOP0 = Math.max(470, 470 + (1860 - 470 - TOTAL) / 2);
const mini = (kit, name, val, lab, w, cap) => {
  const s = w / 720, h = Math.round(1040 * s);
  const badge = '<svg viewBox="-290 -280 580 580" style="width:100%;height:100%">' + window.PUMA.markup(16) + '</svg>';
  return '<div class="stats-card" style="position:relative;width:' + w + 'px;height:' + h + 'px;flex:none">' +
    '<div style="position:absolute;left:0;top:0;width:720px;height:1040px;transform:scale(' + s + ');transform-origin:0 0">' +
    '<div class="uc-face uc-front uc-img" style="filter:drop-shadow(0 18px 30px rgba(0,0,0,.45))"><img class="uc-bg" src="' + kit.assets.url('ucfront.webp') + '">' +
    '<img class="uc-photo" src="' + kit.assets.url('cut_' + name.toLowerCase() + '.webp') + '">' +
    '<div class="uc-corner"><p class="uc-num" style="margin:0">' + C.NUMS[name] + '</p><div class="uc-badge">' + badge + '</div></div>' +
    '<div class="uc-namebar"><p class="uc-name" style="margin:0">' + name + '</p></div>' +
    '<div style="position:absolute;left:0;right:0;top:690px;display:flex;justify-content:center;align-items:baseline;gap:22px">' +
    '<p class="uc-sv" style="margin:0;font-size:170px">' + val + '</p><p class="uc-sl" style="margin:0;font-size:56px">' + lab + '</p></div>' +
    C.glintBox(kit, 'stats-shine') + '</div></div>' +
    (cap ? '<p class="eyebrow" style="position:absolute;left:-20px;right:-20px;top:' + (h + 10) + 'px;margin:0;text-align:center;font-size:30px;letter-spacing:.08em;color:var(--second)">' + cap + '</p>' : '') + '</div>';
};
kit.scene('stats', {
  init(kit) {
    let y = TOP0;
    const cells = LAY.map((row, ri) => {
      const top = y; y += ROWH[ri] + GAP_R;
      return row.map((g, j) => {
        const width = row.length === 1 ? 1080 : 540, left = row.length === 1 ? 0 : j * 540, w = cardW(g, width);
        return '<div class="stats-block" style="position:absolute;left:' + left + 'px;top:' + top + 'px;width:' + width + 'px;display:flex;flex-direction:column;align-items:center;gap:26px">' +
          '<div style="display:flex;align-items:center;gap:16px"><span class="stats-rule" style="width:40px;height:6px;border-radius:3px;background:var(--main)"></span>' +
          '<p class="eyebrow stats-label" style="margin:0;font-size:32px">' + g[0] + '</p><span class="stats-rule" style="width:40px;height:6px;border-radius:3px;background:var(--main)"></span></div>' +
          '<div style="display:flex;gap:18px;justify-content:center">' + g[1].map(([nm, v]) => mini(kit, nm, v, g[2], w, g[2] === 'GLS' ? mins(nm) : '')).join('') + '</div></div>';
      }).join('');
    }).join('');
    kit.stage.append(kit.h('<div class="ground"><div class="uc-rays stats-rays"></div>' +
      '<div class="words center" style="top:270px"><p class="eyebrow">Pumas ' + R.us + '–' + R.them + ' ' + R.opp + '</p></div>' +
      '<div class="words center" style="top:314px"><h2 class="line plate">Match stats</h2></div>' + cells + '</div>'));
    this.rays = kit.stage.querySelector('.stats-rays').style;
    this.blocks = [...kit.stage.querySelectorAll('.stats-block')].map((b) => ({
      label: b.querySelector('.stats-label').style,
      rules: [...b.querySelectorAll('.stats-rule')].map((r) => r.style),
      cards: [...b.querySelectorAll('.stats-card')].map((e) => ({ st: e.style, shine: e.querySelector('.stats-shine').style })),
    }));
  },
  render(t, kit) {
    this.rays.opacity = 0.18 * eo(seg(t, 0, 0.8));
    this.rays.transform = 'rotate(' + (t * 12) + 'deg)';
    this.blocks.forEach((b, i) => {
      const t0 = 0.2 + i * 0.45;
      const p = eo(seg(t, t0, t0 + 0.4));
      b.label.opacity = p;
      b.label.transform = 'translateY(' + lerp(20, 0, p) + 'px)';
      b.rules.forEach((r) => { r.transform = 'scaleX(' + eob(seg(t, t0, t0 + 0.4), 1.6) + ')'; });
      b.cards.forEach((c, j) => {
        const s0 = t0 + 0.12 + j * 0.14;
        const q = eob(seg(t, s0, s0 + 0.5), 1.6);
        const f = eio(seg(t, s0, s0 + 0.4));
        c.st.opacity = eo(seg(t, s0, s0 + 0.15));
        c.st.transform = 'translateY(' + lerp(120, 0, q) + 'px) rotate(' + lerp(-6, 0, q) + 'deg) scale(' + (Math.max(0.05, f) * kit.breathe(t, 0.006, 3 + j)) + ',' + kit.breathe(t, 0.006, 3 + j) + ')';
        const sh = seg(t, s0 + 0.5, s0 + 1.1);
        c.shine.transform = 'translateX(' + lerp(-300, 900, eio(sh)) + 'px) skewX(-18deg)';
        c.shine.opacity = sh > 0 && sh < 1 ? 1 : 0;
      });
    });
  },
});
