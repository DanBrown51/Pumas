kit.score(function (S, T) {
  S.tempo(125, { t0: T.score });
  [0, 0.48, 0.96, 1.44].forEach((d, i) => S.drum('tom', { t: d, vel: 60 + i * 9 }));
  S.drum('kick', { t: 0, vel: 80 });
  S.fx('whoosh', T.fulltime + 1.8, { dur: 0.8, vel: 46 });
  S.drums({ snare: 'xxxxxxxx' }, { from: -1, step: 0.125, repeat: 1, vel: 60 });

  // result: score + match stats (16 beats)
  S.drums({ kick: 'x.x.x.x.', hat: '.x.x.x.x' }, { from: 0, repeat: 1, vel: 66 });
  S.drums({ kick: 'x.x.x.x.', clap: '..x...x.', openhat: '.x.x.x.x' }, { from: 8, repeat: 1, vel: 76 });
  S.drums({ hat: 'xoxoxoxoxoxoxoxo' }, { from: 8, step: 0.25, repeat: 2, vel: 34 });
  const sc = T.score;
  S.fx('thud', sc + 0.3, { vel: 70 });
  const EV = [[0.7, 0], [1.05, 0], [1.4, 1], [1.75, 1], [2.1, 1], [2.45, 1]]; // [time, pumas goal?]
  let k = 0;
  EV.forEach(([d, us]) => {
    if (!us) { S.fx('thud', sc + d, { vel: 70 }); S.drum('tom', { t: sc + d, vel: 64 }); return; }
    S.drum('kick', { t: sc + d, vel: 100 + k * 2 });
    S.drum('clap', { t: sc + d, vel: 84 + k * 3 });
    S.drum('crash', { t: sc + d, vel: 68 + k * 5 });
    S.fx('pop', sc + d + 0.02, { vel: 60, pitch: 1.1 + k * 0.05 });
    k++;
  });
  const win = sc + 3.05;
  [-0.4, -0.32, -0.24, -0.18, -0.12, -0.07, -0.03].forEach((d, i) => S.drum('snare', { t: win + d, vel: 56 + i * 7 }));
  S.drum('crash', { t: win, vel: 100 });
  S.drum('kick', { t: win, vel: 108 });
  S.drum('tom', { t: win, vel: 100 });
  if (EV.filter((e) => e[1]).length > EV.filter((e) => !e[1]).length) {
    // win celebration: claps, sparkle, then the form guide slams
    S.fx('sparkle', win + 0.05, { vel: 70 });
    S.fx('whoosh', win + 0.02, { dur: 0.8, vel: 50, pitch: 1.4 });
    [0.24, 0.48, 0.6, 0.72, 0.96].forEach((d, i) => S.drum('clap', { t: win + d, vel: 80 + i * 3 }));
    S.drums({ kick: 'x.x.x.x.', clap: '..x...x.', openhat: '.x.x.x.x', tamb: 'xxxxxxxx' }, { from: Math.ceil(S.toBeat(win + 0.3)), repeat: 1, vel: 74 });
    const ft = win + 0.75;
    [0.1, 0.2, 0.3, 0.4, 0.5].forEach((d, i) => { S.drum('tom', { t: ft + d, vel: 74 + i * 3 }); });
    S.drum('crash', { t: ft + 0.85, vel: 96 }); S.drum('kick', { t: ft + 0.85, vel: 108 }); S.fx('thud', ft + 0.85, { vel: 84 });
    S.drums({ kick: 'x.x.x.x.', clap: '..x...x.', hat: 'xoxoxoxo' }, { from: Math.ceil(S.toBeat(ft + 1.0)), repeat: 1, vel: 72 });
  }
  // match stats frame
  S.fx('whoosh', T.stats + 0.05, { dur: 0.6, vel: 44 });
  [0.4, 0.9, 1.4, 1.9].forEach((d, i) => { S.drum('tom', { t: T.stats + d, vel: 70 + i * 6 }); S.fx('pop', T.stats + d + 0.05, { vel: 50, pitch: 1 + i * 0.08 }); });
  S.drums({ snare: 'xxxxxxxx' }, { from: 19, step: 0.125, repeat: 1, vel: 66 });

  // players of the match cards (2 x 8 beats from beat 16)
  const B = 20, N = 1;
  S.drum('crash', { beat: B, vel: 82 });
  S.drums({ kick: 'x.x.x.x.', clap: '..x...x.' }, { from: B, repeat: N, vel: 82 });
  S.drums({ hat: 'xoxoxoxoxoxoxoxo' }, { from: B, step: 0.25, repeat: N * 2, vel: 40 });
  S.drums({ openhat: '.x.x.x.x' }, { from: B + 8, repeat: Math.max(0, N - 1), vel: 52 });
  for (let k = 0; k < N; k++) {
    const b = B + 8 * k;
    if (k) S.drum('crash', { beat: b, vel: 70 });
    S.fx('whoosh', S.beat(b), { dur: 0.45, vel: 54, pan: 0.6 });
    S.fx('whoosh', S.beat(b + 2), { dur: 0.4, vel: 58, pitch: 1.3 });
    [3, 3.5, 4].forEach((o, i) => { S.drum('tom', { beat: b + o, vel: 84 + i * 6 }); S.fx('thud', S.beat(b + o), { vel: 52 }); });
    S.fx('sparkle', S.beat(b + 4.5), { vel: 44 });
    S.fx('whoosh', S.beat(b + 7), { dur: 0.4, vel: 48, pan: -0.6 });
  }
  S.drums({ snare: 'xxxxxxxxxxxxxxxx' }, { from: B + 8 * N - 2, step: 0.125, repeat: 1, vel: 74 });
  S.drums({ tom: 'x.x.xxxx' }, { from: B + 8 * N - 1, step: 0.125, repeat: 1, vel: 84 });

  const p = T.outro;
  S.drum('kick', { t: p, vel: 100 });
  S.drum('crash', { t: p, vel: 86 });
  S.drum('tom', { t: p, vel: 92 });
  S.fx('whoosh', p + 0.05, { dur: 1.0, vel: 30 });
  [0.48, 0.96, 1.44].forEach((d) => { S.drum('kick', { t: p + d, vel: 74 }); S.drum('tom', { t: p + d + 0.24, vel: 60 }); });
  [1.5, 1.6, 1.68, 1.75, 1.81, 1.86, 1.9, 1.94, 1.97].forEach((d, i) => S.drum('snare', { t: p + d, vel: 52 + i * 6 }));
  const call = p + 2.0;
  S.drum('crash', { t: call, vel: 100 });
  S.drum('tom', { t: call, vel: 100 });
  [0, 0.48, 0.96, 1.44].forEach((d) => S.drum('kick', { t: call + d, vel: 104 }));
  [0.48, 1.44].forEach((d) => { S.drum('clap', { t: call + d, vel: 92 }); S.drum('snare', { t: call + d, vel: 84 }); });
  [0.24, 0.72, 1.2, 1.68].forEach((d) => S.drum('openhat', { t: call + d, vel: 68 }));
  [0.96, 1.08, 1.2].forEach((d, i) => S.drum('tom', { t: call + d, vel: 80 + i * 6 }));
  [1.68, 1.76, 1.84, 1.9].forEach((d, i) => S.drum('snare', { t: call + d, vel: 70 + i * 8 }));
  const slash = p + 4.0;
  S.fx('revswell', slash, { dur: 0.6, vel: 50 });
  [0.6, 0.15, -0.35].forEach((pan, i) => S.fx('whoosh', slash + i * 0.06, { dur: 0.22, vel: 100, pitch: 1.6, pan }));
  S.fx('thud', slash + 0.3, { vel: 100 });
  S.drum('tom', { t: slash + 0.3, vel: 100 });
  S.drum('kick', { t: slash + 0.3, vel: 104 });
  S.fx('whoosh', slash + 0.32, { dur: 0.5, vel: 70, pitch: 0.6 });
  S.master({ gain: -6, fadeOut: 0.5 });
});
