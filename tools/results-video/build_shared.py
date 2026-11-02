s=open('/home/claude/gc/src/shared.js').read()
def rep(a,b):
    global s; assert a in s,a; s=s.replace(a,b)
a=s.index('  S6: {'); b=s.index('  SHAPE:')
s=s[:a]+'''  stats(name) {
    const R = window.RES, S = R.season[name], G = R.game[name];
    const keys = name === 'Zac' ? [['s', 'SAV'], ['w', 'WINS'], ['g', 'GLS'], ['mgr', 'MGR'], ['par', 'PAR']] : [['g', 'GLS'], ['a', 'AST'], ['w', 'WINS'], ['mgr', 'MGR'], ['par', 'PAR']];
    return keys.map(([k, l]) => [l, S[k], G[k]]);
  },
  awards() {
    const A = window.RES.awards, out = [];
    [['mgr', 'Manager\\u2019s player'], ['par', 'Parents\\u2019 player']].forEach(([k, l]) => {
      if (!A[k]) return;
      const hit = out.find((o) => o.name === A[k]);
      if (hit) hit.label = 'Manager\\u2019s & Parents\\u2019 player'; else out.push({ name: A[k], label: l });
    });
    return out;
  },
'''+s[b:]
rep("  frame(kit) {","  frame(kit, label) {")
rep("<p class=\"eyebrow\">Rayleigh FC \\u00b7 Pumas</p><h2 class=\"line\">Squad 2026-27</h2>",
    "<p class=\"eyebrow\">Pumas ' + window.RES.us + '\\u2013' + window.RES.them + ' ' + window.RES.opp + '</p><h2 class=\"line\"' + (label.length > 20 ? ' style=\"font-size:64px\"' : '') + '>' + label + '</h2>")
rep("        C.frame(kit);\n        C.dots(kit, data.idx);","        C.frame(kit, data.label);")
rep("const stats = C.S6[data.name].map((s) => '<div class=\"uc-stat\"><p class=\"uc-sl\" style=\"margin:0\">' + s[0] + '</p><p class=\"uc-sv\" style=\"margin:0\">' + s[1] + '</p></div>').join('');",
    "const stats = C.stats(data.name).map((s) => '<div class=\"uc-stat\"><p class=\"uc-sl\" style=\"margin:0\">' + s[0] + '</p><p class=\"uc-sv\" style=\"margin:0\">' + s[1] + '</p>' + (s[2] ? '<p class=\"uc-dl\" style=\"margin:0\">+' + s[2] + '</p>' : '') + '</div>').join('');")
rep("2025-26 season stats \\u00b7 Rayleigh FC","2026-27 season to date \\u00b7 <b class=\"uc-fdl\">+n</b> v ' + window.RES.opp + '")
rep("this.stats = [...card.querySelectorAll('.uc-stat')].map((r) => r.style);","this.stats = [...card.querySelectorAll('.uc-stat')].map((r) => r.style);\n        this.dls = [...card.querySelectorAll('.uc-stat')].map((r) => { const d = r.querySelector('.uc-dl'); return d && d.style; });")
old="          st.transform = 'scale(' + kit.lerp(1.6, 1, k) + ')';\n        });"
rep(old,old+"""
        this.dls.forEach((d, i) => {
          if (!d) return;
          const t0 = T.stamp[4] + 0.25 + i * 0.12;
          const k = kit.eob(kit.seg(t, t0, t0 + 0.3), 2);
          d.opacity = kit.eo(kit.seg(t, t0, t0 + 0.1));
          d.transform = 'scale(' + kit.lerp(0.3, 1, k) + ')';
        });""")
ft=open('/home/claude/ft/src/shared.js').read(); ft=ft[:ft.index('window.FT')]
open('src/shared.js','w').write(open('src/res.js').read()+ft+s)
