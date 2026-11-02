const { seg, eo, ei, eio, eob, eox, lerp } = kit;
const SLASH = { at: 4.0, gap: 0.06, draw: 0.18, open: 0.3, openDur: 0.5 };
const CLAWS = ['M881 -152 Q458 924 -39 1968', 'M1000 -100 Q577 976 80 2020', 'M1119 -48 Q696 1028 199 2072'];
kit.scene('outro', {
  init(kit) {
    kit.stage.append(kit.h('<div class="ground">' +
      '<svg class="art" viewBox="0 0 1080 1920"><g class="outro-head"></g></svg>' +
      '<div class="words center" style="top:1200px;gap:14px"><p class="eyebrow outro-eyebrow">Rayleigh FC · 2026-27</p>' +
      '<h2 class="line title outro-call">Let’s go Pumas</h2></div>' +
      '<svg class="art outro-claws" viewBox="0 0 1080 1920"></svg>' +
      '<div class="outro-black" style="position:absolute;inset:0;background:var(--ground);opacity:0"></div>' +
      '</div>'));
    const NS = 'http://www.w3.org/2000/svg', P = window.PUMA;
    const head = this.head = kit.stage.querySelector('.outro-head');
    const mirror = document.createElementNS(NS, 'g');
    mirror.setAttribute('transform', 'scale(-1 1)');
    head.append(mirror);
    const mk = (d, parent, cls) => {
      const p = document.createElementNS(NS, 'path');
      p.setAttribute('d', d);
      p.setAttribute('class', cls || 'chalk');
      parent.append(p);
      return { el: p, len: p.getTotalLength() };
    };
    const both = (d, cls) => [mk(d, head, cls), mk(d, mirror, cls)];
    this.out = [mk(P.out, head)];
    this.lines = P.half.flatMap((d) => both(d)).concat([mk(P.fore, head)]);
    this.face = P.face.map((d) => mk(d, head));
    this.eyes = both(P.eye, 'eye');
    this.pupils = both(P.pupil, 'pupil');
    this.out.concat(this.lines, this.face, this.eyes).forEach((o) => { o.el.style.strokeWidth = 5.4; });
    this.pupils.forEach((o) => { o.el.style.strokeWidth = 7; });
    const claws = kit.stage.querySelector('.outro-claws');
    this.dark = CLAWS.map((d) => mk(d, claws));
    this.tear = CLAWS.map((d) => mk(d, claws));
    this.dark.forEach((o) => { o.el.style.stroke = 'var(--ground)'; o.el.style.strokeOpacity = 1; o.el.style.strokeLinecap = 'butt'; });
    this.tear.forEach((o) => { o.el.style.stroke = 'var(--main)'; o.el.style.strokeOpacity = 1; o.el.style.strokeWidth = 30; });
    this.eyebrow = kit.stage.querySelector('.outro-eyebrow').style;
    this.call = kit.stage.querySelector('.outro-call').style;
    this.black = kit.stage.querySelector('.outro-black').style;
  },
  render(t, kit) {
    const draw = (list, p) => list.forEach((o) => { o.el.style.strokeDasharray = o.len + ' ' + o.len; o.el.style.strokeDashoffset = o.len * (1 - p); });
    draw(this.out, eio(seg(t, 0.05, 1.1)));
    draw(this.lines, eio(seg(t, 0.6, 1.4)));
    draw(this.face, eio(seg(t, 0.9, 1.6)));
    draw(this.eyes, eio(seg(t, 1.0, 1.4)));
    this.eyes.forEach((o) => { o.el.style.fillOpacity = eo(seg(t, 1.4, 1.7)); });
    draw(this.pupils, eo(seg(t, 1.6, 1.85)));
    const s = lerp(1.22, 1.3, eob(seg(t, 0, 1.2), 1.4)) * kit.breathe(t, 0.01, 3);
    this.head.setAttribute('transform', 'translate(540 820) scale(' + s + ')');
    const w = eo(seg(t, 1.5, 1.9));
    this.eyebrow.opacity = w;
    this.eyebrow.transform = 'translateY(' + lerp(20, 0, w) + 'px)';
    const c = eob(seg(t, 2.0, 2.45), 1.7);
    this.call.opacity = eo(seg(t, 2.0, 2.15));
    this.call.transform = 'scale(' + lerp(1.4, 1, c) * lerp(1, 1.03, seg(t, 2.45, 4.0)) + ')';
    this.tear.forEach((o, i) => {
      const t0 = SLASH.at + i * SLASH.gap;
      const p = eox(seg(t, t0, t0 + SLASH.draw));
      o.el.style.strokeDasharray = o.len + ' ' + o.len;
      o.el.style.strokeDashoffset = o.len * (1 - p);
      o.el.style.opacity = t < t0 ? 0 : 1 - ei(seg(t, SLASH.at + SLASH.open + 0.15, SLASH.at + SLASH.open + SLASH.openDur));
    });
    this.dark.forEach((o, i) => {
      const t0 = SLASH.at + SLASH.open + i * SLASH.gap;
      const p = ei(seg(t, t0, t0 + SLASH.openDur));
      o.el.style.opacity = t < t0 ? 0 : 1;
      o.el.style.strokeWidth = lerp(30, 2300, p);
    });
    this.black.opacity = eo(seg(t, SLASH.at + SLASH.open + SLASH.openDur, SLASH.at + SLASH.open + SLASH.openDur + 0.1));
  },
});