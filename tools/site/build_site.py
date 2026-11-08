"""Update the Pumas site (index.html) with the current season from a tracker export.
usage: python3 build_site.py <tracker export dir> <index.html in> <index.html out>"""
import json, glob, re, sys, datetime, collections
src, fin, fout = sys.argv[1:4]
SEASON = '2026/27'
L = lambda p: (lambda j: j.get('data', j))(json.load(open(p)))
matches = sorted([L(p) for p in glob.glob(src + '/matches/*.json')], key=lambda m: (m['date'], m.get('createdAt', 0)))
events = [L(p) for p in glob.glob(src + '/events/*.json')]
PL = ['Eryk', 'Fletcher', 'George', 'Hudson', 'Joshua', 'Kyan', 'Luke', 'Noah', 'Oscar', 'Zac']
def dlabel(d): x = datetime.date.fromisoformat(d); return '%d %s %d' % (x.day, x.strftime('%b'), x.year)
live = lambda m: (m.get('clock') or {}).get('phase') not in (None, 'pre', 'ft')
MD, SD, AD, LSm = [], {}, [], []
tot = {p: dict(apps=0, g=0, a=0, w=0, s=0, mgr=0, par=0) for p in PL}
for m in matches:
    if live(m): continue
    ev = sorted([e for e in events if e['match'] == m['id']], key=lambda e: e['at'])
    us = sum(1 for e in ev if e['stat'] == 'g'); them = m.get('against', 0)
    r = 'W' if us > them else 'D' if us == them else 'L'
    d = dlabel(m['date'])
    MD.append({'s': SEASON, 'd': d, 'op': m['opp'], 'v': 'A' if m.get('venue') == 'Away' else 'H', 'r': r, 'p': us, 'o': them})
    c = collections.Counter(e['player'] for e in ev if e['stat'] == 'g')
    SD[d] = [{'n': n, 'g': g} for n, g in c.items()]
    if m.get('mgr') or m.get('par'): AD.append({'s': SEASON, 'd': d, 'm': m.get('mgr') or 'No one', 'p': m.get('par') or 'No one'})
    miss = set(m.get('missing') or [])
    for p in PL:
        if p not in miss: tot[p]['apps'] += 1
    for e in ev:
        if e['player'] in tot and e['stat'] in 'gaws': tot[e['player']][e['stat']] += 1
    for k in ('mgr', 'par'):
        if m.get(k) in tot: tot[m[k]][k] += 1
    st = {}
    for e in ev:
        if e['player'] in tot and e['stat'] in 'gaws':
            st.setdefault(e['player'], [0, 0, 0, 0])['gaws'.index(e['stat'])] += 1
    def fm(v):
        if v is None: return None
        if isinstance(v, (int, float)): return str(int(v))
        return str(v['min']) + ('+' + str(v['add']) if v.get('add') else '')
    am = list(m.get('againstMins') or [])
    ag = [fm(am[i]) if i < len(am) else None for i in range(them)]
    goals = [{'n': e['player'], 'min': (str(e['min']) + ('+' + str(e['add']) if e.get('add') else '')) if e.get('min') is not None else None} for e in ev if e['stat'] == 'g']
    LSm.append({'d': d, 'op': m['opp'], 'v': 'A' if m.get('venue') == 'Away' else 'H', 'r': r, 'p': us, 'o': them, 'goals': goals, 'mgr': m.get('mgr') or '', 'par': m.get('par') or ''})
    LSm[-1]['st'] = st
    LSm[-1]['ag'] = ag
    LSm[-1]['miss'] = sorted(miss)
    LSm[-1]['tr'] = any(e['stat'] in 'aws' for e in ev)
first_tracked = next((dlabel(m['date']) for m in matches if any(e['match'] == m['id'] and e['stat'] in 'aws' for e in events)), None)
LS = {'season': SEASON, 'updated': datetime.date.today().isoformat(), 'tracked': first_tracked, 'matches': LSm, 'players': tot}

html = open(fin).read()
def block(i): m = re.search(r'(<script id="' + i + r'" type="application/json">\n?)(.*?)(\n?</script>)', html, re.S); return m
def setblock(i, val):
    global html
    m = block(i)
    if m: html = html[:m.start(2)] + json.dumps(val, ensure_ascii=False, separators=(',', ':')) + html[m.end(2):]
    else: raise SystemExit('missing block ' + i)
md = [x for x in json.loads(block('MD').group(2)) if x.get('s') != SEASON] + MD
sd = json.loads(block('SD').group(2)); sd = {k: v for k, v in sd.items() if not k.endswith(SEASON[:4]) and not k.endswith('20' + SEASON[5:])} if False else sd
for x in json.loads(block('MD').group(2)):
    if x.get('s') == SEASON: sd.pop(x['d'], None)
sd.update(SD)
ad = [x for x in json.loads(block('AD').group(2)) if x.get('s') != SEASON] + AD
ap = json.loads(block('AP').group(2))
for p in PL: ap.setdefault(p, {})[SEASON] = tot[p]['apps']
setblock('MD', md); setblock('SD', sd); setblock('AD', ad); setblock('AP', ap); setblock('LS', LS)
open(fout, 'w').write(html)
print('matches', len(MD), 'updated', LS['updated'])
