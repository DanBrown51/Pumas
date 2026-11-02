const { seg, eo, eob, lerp } = kit;
const R = window.RES;
const HOME = R.venue !== 'Away';
const TL = R.timeline || R.goals.map((g) => ({ us: true, who: g, min: null }));
const nameBox = (cls, x, text) => '<div class="words ' + cls + '" style="left:' + x + 'px;top:560px;width:440px;height:140px;justify-content:flex-end;align-items:center"><p class="team">' + text + '</p></div>';
const GOAL0 = 0.7, GAP = Math.min(0.6, 2.1 / Math.max(1, TL.length));
const WIN = GOAL0 + TL.length * GAP + 0.25;
const WON = R.us > R.them;
const RESULT = WON ? 'Win!' : R.us === R.them ? 'Draw' : 'Full time';
const FORM = R.form || [];
const FORM_T = WIN + 0.75;
// deterministic confetti for a win
const CONF = [];
{ let seed = 7; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const cols = ['var(--main)', 'var(--second)', 'var(--accent)', 'var(--main)'];
  for (let i = 0; i < 70; i++) CONF.push({ x: rnd() * 1080, vx: (rnd() - 0.5) * 520, vy: -900 - rnd() * 700, rot: rnd() * 360, vr: (rnd() - 0.5) * 900, w: 14 + rnd() * 16, h: 8 + rnd() * 10, c: cols[i % 4], d: rnd() * 0.25 });
}
const fmt = (t) => t ? t.min + (t.add ? '+' + t.add : '') + '\u2019' : '';
kit.scene('score', {
  init(kit) {
    const us = 'Rayleigh Pumas', them = R.opp;
    const lab = (cls, x, color) => '<div class="words score-' + cls + '" style="left:' + x + 'px;top:1052px;width:360px;align-items:center;gap:8px"><p class="name score-' + cls + 't" style="font-size:46px;color:' + color + '"></p><p class="role score-' + cls + 'm" style="font-size:30px;color:var(--second)"></p></div>';
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words center" style="top:300px"><p class="eyebrow">Rayleigh FC · Pumas</p></div>' +
      '<div class="words center" style="top:344px"><h2 class="line plate">Full time</h2></div>' +
      '<div class="score-pitch" style="position:absolute;inset:0"></div>' +
      nameBox('score-lname', 70, HOME ? us : them) + nameBox('score-rname', 570, HOME ? them : us) +
      '<p class="goal score-us" style="left:' + (HOME ? 187 : 593) + 'px;top:840px">0</p>' +
      '<p class="goal score-them" style="left:' + (HOME ? 593 : 187) + 'px;top:840px">0</p>' +
      lab('ul', HOME ? 110 : 600, 'var(--main)') + lab('tl', HOME ? 600 : 110, 'color-mix(in srgb, var(--second) 70%, var(--ground))') +
      (WON ? '<div class="score-glow" style="position:absolute;left:-100px;top:500px;width:1280px;height:1000px;border-radius:50%;background:radial-gradient(closest-side, color-mix(in srgb, var(--main) 55%, transparent), transparent);opacity:0"></div>' : '') +
      '<div class="words center score-win" style="top:1250px"><p class="chip"' + (WON ? ' style="font-size:72px;padding:12px 56px;box-shadow:0 0 60px color-mix(in srgb, var(--main) 70%, transparent)"' : '') + '>' + RESULT + '</p></div>' +
      (FORM.length ? '<div class="words center score-form" style="top:1400px;gap:22px"><p class="eyebrow">2026-27 form guide</p>' +
        '<div style="display:flex;gap:16px;justify-content:center">' + FORM.map((r, i) => '<div class="score-ft" style="position:relative;width:104px;height:104px;border-radius:16px;display:flex;align-items:center;justify-content:center;font-family:var(--display, var(--sans, system-ui, sans-serif));font-weight:800;font-size:78px;line-height:1;' +
          (r === 'W' ? 'background:var(--main);color:var(--ground)' : r === 'D' ? 'background:color-mix(in srgb, var(--second) 35%, var(--ground));color:var(--second)' : 'background:var(--second);color:var(--ground)') +
          (i === FORM.length - 1 ? ';outline:6px solid var(--second);outline-offset:6px' : '') + '">' + r + '</div>').join('') + '</div>' +
        '<p class="sub score-rec">Played ' + FORM.length + ' \u00b7 Won ' + FORM.filter((r) => r === 'W').length + (FORM.some((r) => r === 'D') ? ' \u00b7 Drawn ' + FORM.filter((r) => r === 'D').length : '') + (FORM.some((r) => r === 'L') ? ' \u00b7 Lost ' + FORM.filter((r) => r === 'L').length : '') + '</p></div>' : '') +
      (WON ? '<div class="score-conf" style="position:absolute;inset:0;overflow:hidden;pointer-events:none">' + CONF.map((p) => '<i style="position:absolute;left:0;top:0;width:' + p.w + 'px;height:' + p.h + 'px;background:' + p.c + ';border-radius:2px;opacity:0"></i>').join('') + '</div>' : '') +
      '</div>'));
    this.p = window.PITCH.build(kit, kit.stage.querySelector('.score-pitch'));
    this.p.draw(this.p.centre.concat(this.p.rest), 1);
    const q = (c) => kit.stage.querySelector('.score-' + c);
    this.names = [q('lname').style, q('rname').style];
    this.us = q('us'); this.them = q('them');
    this.ul = q('ul').style; this.ult = q('ult'); this.ulm = q('ulm'); this.tl = q('tl').style; this.tlt = q('tlt'); this.tlm = q('tlm');
    this.win = q('win').style;
    this.glow = WON ? q('glow').style : null;
    this.conf = WON ? [...q('conf').children].map((e) => e.style) : [];
    this.form = FORM.length ? q('form').style : null;
    this.fts = [...kit.stage.querySelectorAll('.score-ft')].map((e) => e.style);
    this.rec = FORM.length ? q('rec').style : null;
  },
  render(t) {
    this.p.cam(lerp(1, 1.015, seg(t, 0, 5.76)));
    this.names.forEach((st, i) => {
      const p = eo(seg(t, i * 0.12, i * 0.12 + 0.45));
      st.opacity = p;
      st.transform = 'translateY(' + lerp(24, 0, p) + 'px)';
    });
    let a = 0, b = 0, la = -1, lb = -1, wa = '', wb = '', ma = '', mb = '';
    TL.forEach((g, i) => {
      const tt = GOAL0 + i * GAP; if (t < tt) return;
      if (g.us) { a += 1; la = tt; wa = g.who; ma = fmt(g.t); } else { b += 1; lb = tt; wb = g.who; mb = fmt(g.t); }
    });
    this.us.textContent = String(a); this.them.textContent = String(b);
    const gi = eo(seg(t, 0.2, 0.45));
    const pa = la >= 0 ? eob(seg(t, la, la + 0.32), 1.8) : 1, pb = lb >= 0 ? eob(seg(t, lb, lb + 0.32), 1.8) : 1;
    this.us.style.opacity = gi; this.them.style.opacity = gi;
    this.us.style.transform = 'translateY(' + lerp(-40, 0, pa) + 'px) scale(' + lerp(1.15, 1, pa) + ')';
    this.them.style.transform = 'translateY(' + lerp(-40, 0, pb) + 'px) scale(' + lerp(1.15, 1, pb) + ')';
    this.ult.textContent = wa; this.tlt.textContent = wb; this.ulm.textContent = ma; this.tlm.textContent = mb;
    this.ul.opacity = la >= 0 ? eo(seg(t, la, la + 0.12)) : 0;
    this.ul.transform = 'scale(' + (la >= 0 ? lerp(1.35, 1, pa) : 1) + ')';
    this.tl.opacity = lb >= 0 ? eo(seg(t, lb, lb + 0.12)) : 0;
    this.tl.transform = 'scale(' + (lb >= 0 ? lerp(1.2, 1, pb) : 1) + ')';
    const w = eob(seg(t, WIN, WIN + 0.45), 1.8);
    this.win.opacity = eo(seg(t, WIN, WIN + 0.15));
    const pulse = WON && t > WIN + 0.45 ? 1 + 0.05 * Math.sin((t - WIN - 0.45) * 2 * Math.PI * 0.9) : 1;
    this.win.transform = 'scale(' + lerp(0.4, 1, w) * pulse + ')';
    if (WON) {
      const g = eo(seg(t, WIN, WIN + 0.3)) * (1 - 0.55 * eo(seg(t, WIN + 0.3, WIN + 1.4)));
      this.glow.opacity = g;
      this.glow.transform = 'scale(' + lerp(0.6, 1.1, eo(seg(t, WIN, WIN + 1.2))) + ')';
      CONF.forEach((p, i) => {
        const st = this.conf[i], u = t - WIN - p.d;
        if (u <= 0) { st.opacity = 0; return; }
        const x = 540 + (p.x - 540) * 0.15 + p.vx * u, y = 1290 + p.vy * u + 1100 * u * u;
        st.opacity = u < 0.08 ? u / 0.08 : Math.max(0, 1 - Math.max(0, u - 1.8) / 0.6);
        st.transform = 'translate(' + x + 'px,' + y + 'px) rotate(' + (p.rot + p.vr * u) + 'deg) scaleX(' + Math.cos(u * 9 + i) + ')';
      });
    }
    if (this.form) {
      const f = eo(seg(t, FORM_T, FORM_T + 0.4));
      this.form.opacity = f;
      this.form.transform = 'translateY(' + lerp(30, 0, f) + 'px)';
      this.fts.forEach((st, i) => {
        const last = i === this.fts.length - 1;
        const t0 = FORM_T + 0.1 + i * 0.1 + (last ? 0.35 : 0);
        const k = eob(seg(t, t0, t0 + 0.3), last ? 2.2 : 1.6);
        st.opacity = eo(seg(t, t0, t0 + 0.08));
        st.transform = 'scale(' + lerp(last ? 2.4 : 1.6, 1, k) + ') rotate(' + lerp(last ? -14 : -6, 0, k) + 'deg)';
      });
      this.rec.opacity = eo(seg(t, FORM_T + 1.3, FORM_T + 1.6));
    }
  },
});
