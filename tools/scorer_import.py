"""Turn a 'Send to Dan' message from scorer.html into ArtifactData batch writes for the Pumas tracker.
Usage: python3 tools/scorer_import.py message.txt out.json  -> list of {op,collection,doc_id,data}"""
import json, sys, re
txt = open(sys.argv[1]).read()
m = re.search(r'PUMAS-DATA (\{.*\})', txt, re.S)
d = json.loads(m.group(1))
P = ['Eryk','Fletcher','George','Hudson','Joshua','Kyan','Luke','Noah','Oscar','Zac']
mid = 'sc' + d['id']
match = dict(d['m']); match['id'] = mid; match.setdefault('against', 0); match['src'] = 'scorer'
W = [{'op': 'set', 'collection': 'matches', 'doc_id': mid, 'data': match}]
for i, (pi, st, half, mn, add) in enumerate(d['e']):
    ev = {'match': mid, 'player': P[pi], 'stat': st, 'at': match.get('createdAt', 0) + i}
    if mn >= 0: ev.update(half=half, min=mn); ev.update({'add': add} if add else {})
    W.append({'op': 'set', 'collection': 'events', 'doc_id': '%s-%03d' % (mid, i), 'data': ev})
k = 0
for p, c in (d.get('votes') or {}).items():
    for _ in range(c):
        W.append({'op': 'set', 'collection': 'ballots', 'doc_id': '%s-v%02d' % (mid, k), 'data': {'match': mid, 'player': p, 'at': 0, 'src': 'poll'}}); k += 1
json.dump(W, open(sys.argv[2], 'w'), indent=0)
print(len(W), 'writes;', match.get('opp'), match.get('date'))
