const { seg, eo, ei, eio, eob, lerp, TextFx } = kit;
kit.scene('fulltime', {
  init(kit) {
    const R = window.RES;
    kit.stage.append(kit.h('<div class="ground">' +
      '<div class="fulltime-pitch" style="position:absolute;inset:0"></div>' +
      '<div class="fulltime-big" style="position:absolute;inset:0">' +
      '<div class="words center" style="top:420px"><p class="eyebrow plate fulltime-eyebrow">Rayleigh FC · Pumas</p></div>' +
      '<div class="words center" style="top:480px;left:40px;width:1000px"><h1 class="line hero fulltime-line">Full time</h1></div>' +
      '<div class="fulltime-bar" style="position:absolute;left:390px;top:700px;width:300px;height:10px;border-radius:5px;background:var(--main)"></div>' +
      '<div class="words center" style="top:736px"><p class="opp plate fulltime-opp">v ' + R.opp + '</p></div>' +
      '<div class="words center" style="top:816px"><p class="sub plate fulltime-date">' + R.date + ' · ' + R.venue + ' · Rayleigh derby</p></div>' +
      '</div>' +
      '<div class="fulltime-head" style="position:absolute;inset:0">' +
      '<div class="words center" style="top:300px"><p class="eyebrow">Rayleigh FC · Pumas</p></div>' +
      '<div class="words center" style="top:344px"><h2 class="line plate">Full time</h2></div>' +
      '</div></div>'));
    this.p = window.PITCH.build(kit, kit.stage.querySelector('.fulltime-pitch'));
    const q = (c) => kit.stage.querySelector('.fulltime-' + c);
    this.line = q('line');
    for (const k of ['big', 'head', 'eyebrow', 'bar', 'opp', 'date']) this[k] = q(k).style;
  },
  render(t) {
    const P = this.p;
    const out = eio(seg(t, 1.8, 2.6));
    P.cam(lerp(lerp(4, 4.08, seg(t, 0, 1.8)), 1, out), lerp(340, 0, out));
    P.draw([P.centre[1]], eio(seg(t, 0.15, 1.05)));
    P.cdot.style.opacity = eo(seg(t, 0.8, 1.0));
    P.draw([P.centre[0]].concat(P.rest), eio(seg(t, 1.85, 2.55)));
    P.spots.forEach((s) => { s.style.opacity = eo(seg(t, 2.3, 2.55)); });
    TextFx.fadeFromRight(this.line, t, -0.55, { stagger: 0.12, dur: 0.5, dx: 30 });
    this.eyebrow.opacity = eo(seg(t, -0.5, 0));
    const o = eo(seg(t, -0.45, 0));
    this.opp.opacity = o;
    this.opp.transform = 'translateY(' + lerp(16, 0, o) + 'px)';
    this.bar.transform = 'scaleX(' + eob(seg(t, 0.25, 0.7), 1.7) + ')';
    const d = eo(seg(t, 0.45, 0.9));
    this.date.opacity = d;
    this.date.transform = 'translateY(' + lerp(18, 0, d) + 'px)';
    const away = ei(seg(t, 1.5, 1.85));
    this.big.opacity = 1 - away;
    this.big.transform = 'translateY(' + lerp(0, -40, away) + 'px) scale(' + lerp(1, 1.02, seg(t, 0, 1.5)) + ')';
    const h = eo(seg(t, 1.95, 2.35));
    this.head.opacity = h;
    this.head.transform = 'translateY(' + lerp(20, 0, h) + 'px)';
  },
});
