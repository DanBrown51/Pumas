window.RES = {"opp": "Rayleigh Yellows", "venue": "Home", "date": "Sunday 1 November 2026", "us": 4, "them": 2, "goals": ["Noah", "Fletcher", "Oscar", "Joshua"], "goalMins": [{"half": 1, "min": 15, "add": 0}, {"half": 2, "min": 32, "add": 0}, {"half": 2, "min": 39, "add": 0}, {"half": 2, "min": 42, "add": 0}], "timeline": [{"us": false, "who": "Rayleigh Yellows", "t": {"half": 1, "min": 7, "add": 0}}, {"us": false, "who": "Rayleigh Yellows", "t": {"half": 1, "min": 8, "add": 0}}, {"us": true, "who": "Noah", "t": {"half": 1, "min": 15, "add": 0}}, {"us": true, "who": "Fletcher", "t": {"half": 2, "min": 32, "add": 0}}, {"us": true, "who": "Oscar", "t": {"half": 2, "min": 39, "add": 0}}, {"us": true, "who": "Joshua", "t": {"half": 2, "min": 42, "add": 0}}], "assists": ["Joshua", "Joshua", "Noah", "Oscar"], "season": {"Luke": {"g": 1, "a": 0, "w": 32, "s": 0, "mgr": 0, "par": 0}, "Oscar": {"g": 5, "a": 1, "w": 17, "s": 0, "mgr": 0, "par": 1}, "Kyan": {"g": 1, "a": 1, "w": 13, "s": 0, "mgr": 0, "par": 0}, "George": {"g": 4, "a": 0, "w": 14, "s": 0, "mgr": 0, "par": 0}, "Fletcher": {"g": 5, "a": 0, "w": 20, "s": 0, "mgr": 1, "par": 0}, "Hudson": {"g": 0, "a": 0, "w": 21, "s": 0, "mgr": 1, "par": 0}, "Noah": {"g": 7, "a": 1, "w": 26, "s": 0, "mgr": 0, "par": 0}, "Joshua": {"g": 3, "a": 3, "w": 12, "s": 0, "mgr": 1, "par": 1}, "Eryk": {"g": 0, "a": 0, "w": 26, "s": 0, "mgr": 0, "par": 1}, "Zac": {"g": 0, "a": 0, "w": 1, "s": 12, "mgr": 0, "par": 0}}, "awards": {"mgr": "Joshua", "par": "Joshua"}, "game": {"Luke": {"g": 0, "a": 0, "w": 14, "s": 0, "mgr": 0, "par": 0}, "Oscar": {"g": 1, "a": 1, "w": 8, "s": 0, "mgr": 0, "par": 0}, "Kyan": {"g": 0, "a": 0, "w": 5, "s": 0, "mgr": 0, "par": 0}, "George": {"g": 0, "a": 0, "w": 7, "s": 0, "mgr": 0, "par": 0}, "Fletcher": {"g": 1, "a": 0, "w": 13, "s": 0, "mgr": 0, "par": 0}, "Hudson": {"g": 0, "a": 0, "w": 11, "s": 0, "mgr": 0, "par": 0}, "Noah": {"g": 1, "a": 1, "w": 14, "s": 0, "mgr": 0, "par": 0}, "Joshua": {"g": 1, "a": 2, "w": 9, "s": 0, "mgr": 1, "par": 1}, "Eryk": {"g": 0, "a": 0, "w": 15, "s": 0, "mgr": 0, "par": 0}, "Zac": {"g": 0, "a": 0, "w": 0, "s": 6, "mgr": 0, "par": 0}}, "games": 6, "order": ["Joshua", "Noah", "Oscar", "Fletcher", "Eryk", "Luke", "Hudson", "George", "Kyan", "Zac"]};
window.PITCH = {
  build(kit, root) {
    const NS = 'http://www.w3.org/2000/svg';
    const svg = kit.h('<svg class="pitch" viewBox="0 0 1080 1920"><g></g></svg>');
    root.append(svg);
    const g = svg.querySelector('g');
    const mk = (d) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', 'chalk');
      g.append(p);
      return { el: p, len: p.getTotalLength() };
    };
    const centre = ['M540 720 V1200', 'M464 960 A76 76 0 1 0 616 960 A76 76 0 1 0 464 960'].map(mk);
    const rest = ['M60 720 H1020 V1200 H60 Z', 'M60 823 H210 V1097 H60', 'M60 898 H108 V1022 H60', 'M210 895.4 A76 76 0 0 1 210 1024.6',
      'M1020 823 H870 V1097 H1020', 'M1020 898 H972 V1022 H1020', 'M870 895.4 A76 76 0 0 0 870 1024.6'].map(mk);
    const dot = (x, y) => {
      const c = document.createElementNS(NS, 'circle');
      c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', 5); c.setAttribute('class', 'chalk-dot');
      g.append(c);
      return c;
    };
    const cdot = dot(540, 960);
    const spots = [dot(170, 960), dot(910, 960)];
    const all = centre.concat(rest);
    return {
      svg, g, centre, rest, cdot, spots,
      cam(z, dy) {
        g.setAttribute('transform', 'translate(540 ' + (960 + (dy || 0)) + ') scale(' + z + ') translate(-540 -960)');
        all.forEach((o) => { o.el.style.strokeWidth = 6 / z; });
        const r = 5 / Math.sqrt(z);
        [cdot].concat(spots).forEach((c) => c.setAttribute('r', r));
      },
      draw(list, p) {
        list.forEach((o) => { o.el.style.strokeDasharray = o.len + ' ' + o.len; o.el.style.strokeDashoffset = o.len * (1 - kit.clamp01(p)); });
      },
      fade(list, a) { list.forEach((o) => { (o.el || o).style.opacity = a; }); },
    };
  },
};
window.PUMA = {
  out: 'M150 -240 L215 -120 L230 -60 L245 30 L180 140 L70 215 L0 230 L-70 215 L-180 140 L-245 30 L-230 -60 L-215 -120 L-150 -240 L-85 -150 L0 -170 L85 -150 Z',
  half: ['M140 -195 L190 -125 L105 -150', 'M18 -78 L105 -84 L150 -52', 'M132 -32 L245 30 L95 95 M180 140 L92 128', 'M25 -62 L38 56'],
  fore: 'M0 -170 L0 -100',
  eye: 'M45 -20 Q85 -52 132 -32 Q92 -2 45 -20 Z',
  pupil: 'M90 -38 L90 -12',
  face: ['M-42 58 L42 58 L0 92 Z', 'M42 58 Q100 80 92 128 Q80 168 0 175 Q-80 168 -92 128 Q-100 80 -42 58', 'M0 92 L0 118 Q30 140 60 128 M0 118 Q-30 140 -60 128'],
  markup(sw) {
    const P = window.PUMA, s = 'stroke-width:' + sw;
    const half = P.half.concat([P.eye]).map((d) => '<path class="chalk" style="' + s + '" d="' + d + '"/>').join('');
    const eyes = '<path class="eye" style="' + s + '" d="' + P.eye + '"/><path class="pupil" style="stroke-width:' + (sw * 1.3) + '" d="' + P.pupil + '"/>';
    return '<path class="chalk" style="' + s + '" d="' + P.out + '"/><path class="chalk" style="' + s + '" d="' + P.fore + '"/>' +
      P.face.map((d) => '<path class="chalk" style="' + s + '" d="' + d + '"/>').join('') +
      half + eyes + '<g transform="scale(-1 1)">' + half + eyes + '</g>';
  },
};
window.CARD = {
  N: 10,
  NUMS: { Eryk: 15, Fletcher: 7, George: 6, Hudson: 9, Joshua: 11, Kyan: 5, Luke: 2, Noah: 10, Oscar: 4, Zac: 'GK' },
  stats(name) {
    const R = window.RES, S = R.season[name], G = R.game[name];
    const keys = name === 'Zac' ? [['s', 'SAV'], ['w', 'WINS'], ['g', 'GLS'], ['mgr', 'MGR'], ['par', 'PAR']] : [['g', 'GLS'], ['a', 'AST'], ['w', 'WINS'], ['mgr', 'MGR'], ['par', 'PAR']];
    return keys.map(([k, l]) => [l, S[k], G[k]]);
  },
  awards() {
    const A = window.RES.awards, out = [];
    [['mgr', 'Manager\u2019s player'], ['par', 'Parents\u2019 player']].forEach(([k, l]) => {
      if (!A[k]) return;
      const hit = out.find((o) => o.name === A[k]);
      if (hit) hit.label = 'Manager\u2019s & Parents\u2019 player'; else out.push({ name: A[k], label: l });
    });
    return out;
  },
  SHAPE: 'M60 40 Q360 92 660 40 Q706 34 708 84 C688 300 688 700 708 850 Q712 902 660 932 L400 1024 Q360 1044 320 1024 L60 932 Q8 902 12 850 C32 700 32 300 12 84 Q14 34 60 40 Z',
  SHARDS: [[520, 300, -60, 0, 140, 0], [520, 300, 140, 0, 720, 120], [520, 300, 720, 120, 720, 520], [520, 300, 720, 520, 420, 700], [520, 300, 420, 700, 0, 560], [520, 300, 0, 560, 0, 180], [520, 300, 0, 180, -60, 0]],
  T: { inEnd: 0.5, flip: 0.96, flipEnd: 1.44, stamp: [1.5, 1.6, 1.7, 1.8, 1.9, 2.0], out: 3.36, end: 3.84 },
  shards(cls) {
    const fills = ['color-mix(in srgb, var(--second) 30%, transparent)', 'color-mix(in srgb, var(--main) 35%, transparent)', 'color-mix(in srgb, var(--ground) 14%, transparent)', 'color-mix(in srgb, var(--second) 18%, transparent)', 'color-mix(in srgb, var(--main) 25%, transparent)', 'color-mix(in srgb, var(--ground) 10%, transparent)', 'color-mix(in srgb, var(--second) 24%, transparent)'];
    return '<svg class="uc-dyn" viewBox="0 0 720 1040"><g class="' + cls + '">' + window.CARD.SHARDS.map((p, i) => '<polygon points="' + p[0] + ',' + p[1] + ' ' + p[2] + ',' + p[3] + ' ' + p[4] + ',' + p[5] + '" style="fill:' + fills[i] + '"/>').join('') +
      '<circle cx="520" cy="300" r="170" style="fill:color-mix(in srgb, var(--second) 30%, transparent)"/></g></svg>';
  },
  outline(color) {
    return '<svg class="uc-outline" viewBox="0 0 720 1040"><path d="' + window.CARD.SHAPE + '" transform="translate(18 26) scale(0.95)" style="fill:none;stroke:' + color + ';stroke-width:4"/></svg>';
  },
  backMarkup(kit) {
    return '<div class="uc-face uc-back uc-img"><img class="uc-bg" src="' + kit.assets.url('ucback.webp') + '">' +
      '<svg class="uc-backpuma" viewBox="-290 -280 580 580">' + window.PUMA.markup(12) + '</svg><p class="uc-backtxt" style="margin:0">Pumas</p></div>';
  },
  glintBox(kit, cls) {
    const u = kit.assets.url('ucfront.webp');
    return '<div class="uc-glintbox" style="-webkit-mask-image:url(' + u + ');mask-image:url(' + u + ');-webkit-mask-size:100% 100%;mask-size:100% 100%"><div class="uc-glint ' + cls + '"></div></div>';
  },
  frame(kit, label) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="words center" style="top:200px;gap:14px"><p class="eyebrow">Pumas ' + window.RES.us + '\u2013' + window.RES.them + ' ' + window.RES.opp + '</p><h2 class="line"' + (label.length > 20 ? ' style="font-size:64px"' : '') + '>' + label + '</h2></div>' +
      '<div class="uc-rays"></div></div>'));
  },
  dots(kit, idx) {
    const W = 16, G = 18, wide = 56, total = 9 * (W + G) + wide;
    let x = 540 - total / 2;
    for (let i = 0; i < window.CARD.N; i++) {
      const w = i === idx ? wide : W;
      const bg = i === idx ? 'var(--main)' : i < idx ? 'color-mix(in srgb, var(--second) 70%, var(--ground))' : 'color-mix(in srgb, var(--second) 22%, var(--ground))';
      kit.stage.append(kit.h('<div class="dot" style="left:' + x + 'px;width:' + w + 'px;background:' + bg + '"></div>'));
      x += w + G;
    }
  },
  dyn(el, t, k) {
    if (!el) return;
    el.setAttribute('transform', 'rotate(' + (Math.sin(t * 0.9 + k) * 8) + ' 520 300) translate(' + (Math.sin(t * 0.7 + k) * 18) + ' ' + (Math.cos(t * 0.6 + k) * 14) + ')');
  },
  make(data) {
    const C = window.CARD;
    return {
      init(kit) {
        C.frame(kit, data.label);
        const num = C.NUMS[data.name];
        const stats = C.stats(data.name).map((s) => '<div class="uc-stat"><p class="uc-sl" style="margin:0">' + s[0] + '</p><p class="uc-sv" style="margin:0">' + s[1] + '</p>' + (s[2] ? '<p class="uc-dl" style="margin:0">+' + s[2] + '</p>' : '') + '</div>').join('');
        const badge = '<svg viewBox="-290 -280 580 580" style="width:100%;height:100%">' + window.PUMA.markup(16) + '</svg>';
        const ph = 'cut_' + data.name.toLowerCase() + '.webp';
        const art = ph
          ? '<img class="uc-photo" src="' + kit.assets.url(ph) + '">'
          : '<svg class="uc-emblem" viewBox="-290 -280 580 580">' + window.PUMA.markup(10) + '</svg>';
        const card = kit.h('<div class="uc-wrap">' +
          '<div class="uc-glow"></div>' + C.backMarkup(kit) +
          '<div class="uc-face uc-front uc-img"><img class="uc-bg" src="' + kit.assets.url('ucfront.webp') + '">' + art + C.glintBox(kit, 'uc-loop') +
          '<div class="uc-corner"><p class="uc-num" style="margin:0">' + num + '</p><div class="uc-badge">' + badge + '</div></div>' +
          '<div class="uc-namebar"><p class="uc-name" style="margin:0">' + data.name + '</p></div>' +
          '<div class="uc-stats">' + stats + '</div>' +
          '<p class="uc-foot" style="margin:0">2026-27 season to date \u00b7 <b class="uc-fdl">+n</b> v ' + window.RES.opp + '</p>' + C.glintBox(kit, 'uc-shine') + '</div>' +
          '</div>');
        kit.stage.append(card);
        this.card = card.style;
        this.front = card.querySelector('.uc-front').style;
        this.back = card.querySelector('.uc-back').style;
        this.glow = card.querySelector('.uc-glow').style;
        this.shine = card.querySelector('.uc-shine').style;
        this.loop = card.querySelector('.uc-loop').style;
        this.stats = [...card.querySelectorAll('.uc-stat')].map((r) => r.style);
        this.dls = [...card.querySelectorAll('.uc-stat')].map((r) => { const d = r.querySelector('.uc-dl'); return d && d.style; });
        this.rays = kit.stage.querySelector('.uc-rays').style;
        this.card.transformOrigin = '50% 55%';
      },
      render(t, kit) {
        const T = C.T;
        const inn = kit.eob(kit.seg(t, 0, T.inEnd), 1.5);
        const out = kit.ei(kit.seg(t, T.out, T.end));
        const p = kit.eio(kit.seg(t, T.flip, T.flipEnd));
        const lift = Math.sin(p * Math.PI);
        const sx = Math.abs(Math.cos(p * Math.PI));
        const x = kit.lerp(0, -820, out);
        const y = kit.lerp(900, 0, inn);
        const rz = kit.lerp(-8, 0, inn) + kit.lerp(0, -10, out);
        const s = kit.lerp(0.8, 1, inn) * (1 + 0.08 * lift) * kit.lerp(1, 1.02, kit.seg(t, T.flipEnd, T.out)) * kit.breathe(t, 0.004, 3);
        this.card.transform = 'translate(' + x + 'px,' + (y - 40 * lift) + 'px) rotate(' + rz + 'deg) scale(' + (s * Math.max(0.02, sx)) + ',' + s + ')';
        this.back.visibility = p < 0.5 ? 'visible' : 'hidden';
        this.front.visibility = p < 0.5 ? 'hidden' : 'visible';
        const lp = ((t + data.idx * 0.4) % 2.4) / 2.4;
        this.loop.transform = 'translateX(' + kit.lerp(-400, 1000, lp) + 'px) skewX(-20deg)';
        const g = kit.eo(kit.seg(t, 0.4, 0.96)) * (1 - out);
        this.glow.opacity = g * (0.6 + 0.4 * lift);
        this.glow.transform = 'scale(' + kit.lerp(0.7, 1.15, g) + ')';
        this.rays.opacity = 0.3 * g;
        this.rays.transform = 'rotate(' + (t * 18) + 'deg) scale(' + kit.lerp(0.8, 1, g) + ')';
        const sh = kit.seg(t, T.flipEnd, T.flipEnd + 0.7);
        this.shine.transform = 'translateX(' + kit.lerp(-300, 900, kit.eio(sh)) + 'px) skewX(-18deg)';
        this.shine.opacity = sh > 0 && sh < 1 ? 1 : 0;
        this.stats.forEach((st, i) => {
          const t0 = T.stamp[i];
          const k = kit.eob(kit.seg(t, t0, t0 + 0.3), 1.8);
          st.opacity = kit.eo(kit.seg(t, t0, t0 + 0.1));
          st.transform = 'scale(' + kit.lerp(1.6, 1, k) + ')';
        });
        this.dls.forEach((d, i) => {
          if (!d) return;
          const t0 = T.stamp[4] + 0.25 + i * 0.12;
          const k = kit.eob(kit.seg(t, t0, t0 + 0.3), 2);
          d.opacity = kit.eo(kit.seg(t, t0, t0 + 0.1));
          d.transform = 'scale(' + kit.lerp(0.3, 1, k) + ')';
        });
      },
    };
  },
};