import json,glob,datetime,sys
root=sys.argv[1]
def load(p):
    j=json.load(open(p)); return j.get('data',j)
matches=[load(p) for p in glob.glob(root+'/matches/*.json')]
events=[load(p) for p in glob.glob(root+'/events/*.json')]
matches.sort(key=lambda m:(m['date'],m.get('createdAt',0)))
last=matches[-1]
PL=['Luke','Oscar','Kyan','George','Fletcher','Hudson','Noah','Joshua','Eryk','Zac']
z=lambda:{'g':0,'a':0,'w':0,'s':0}
season={p:z() for p in PL}; game={p:z() for p in PL}
played={p:set() for p in PL}
for e in events:
    if e['player'] not in season: continue
    season[e['player']][e['stat']]+=1; played[e['player']].add(e['match'])
    if e['match']==last['id']: game[e['player']][e['stat']]+=1
awards={'mgr':last.get('mgr') or '', 'par':last.get('par') or ''}
opts=dict(a.split('=') for a in sys.argv[3:])
for k in ('mgr','par'):
    if not awards[k] and opts.get(k): awards[k]=opts[k]   # test placeholder only when tracker has none
aw={p:{'mgr':0,'par':0} for p in PL}
for m in matches:
    for k in ('mgr','par'):
        if m.get(k) in aw: aw[m[k]][k]+=1
if last['id'] not in [m['id'] for m in matches if m.get('mgr') or m.get('par')]:
    for k,v in awards.items():
        if v: aw[v][k]+=1
for p in PL:
    season[p]['mgr']=aw[p]['mgr']; season[p]['par']=aw[p]['par']
    game[p]['mgr']=int(awards['mgr']==p); game[p]['par']=int(awards['par']==p)
ev=sorted([e for e in events if e['match']==last['id']],key=lambda e:e['at'])
gev=[e for e in ev if e['stat']=='g']
goals=[e['player'] for e in gev]
def parse(v):  # "half:min" or "half:min+add"
    h,m=v.split(':'); a=0
    if '+' in m: m,a=m.split('+')
    return {'half':int(h),'min':int(m),'add':int(a)}
tmins=[parse(x) for x in opts.get('mins','').split(',') if x]   # test placeholders, only for goals with no recorded minute
def emin(e):
    if e.get('min') is None: return None
    return {'half':e.get('half'),'min':e['min'],'add':e.get('add') or 0}
gmins=[emin(e) or (tmins[i] if i<len(tmins) else None) for i,e in enumerate(gev)]
am=list(last.get('againstMins') or [])
topp=[parse(x) for x in opts.get('opp','').split(',') if x]
them=last.get('against',0)
def amin(v):
    if v is None: return None
    if isinstance(v,(int,float)): return {'half':None,'min':int(v),'add':0}
    return {'half':v.get('half'),'min':v['min'],'add':v.get('add') or 0}
amins=[(amin(am[i]) if i<len(am) and am[i] is not None else (topp[i] if i<len(topp) else None)) for i in range(them)]
def skey(t): return (t is None, (t or {}).get('half') or 0, (t or {}).get('min') or 0, (t or {}).get('add') or 0)
tl=[{'us':True,'who':g,'t':m,'k':i} for i,(g,m) in enumerate(zip(goals,gmins))]+[{'us':False,'who':last['opp'],'t':m,'k':100+i} for i,m in enumerate(amins)]
tl.sort(key=lambda x:skey(x['t'])+(x['k'],))
for x in tl: x.pop('k')
d=datetime.date.fromisoformat(last['date'])
res={'opp':last['opp'],'venue':last['venue'],'date':d.strftime('%A ')+str(d.day)+d.strftime(' %B %Y'),
 'us':len(goals),'them':last.get('against',0),'goals':goals,'goalMins':gmins,'timeline':tl,
 'assists':[e['player'] for e in ev if e['stat']=='a'],
 'season':season,'awards':awards,'game':game,'games':len(matches)}
# card order: biggest contributors this game first, keeper last
def key(p):
    g=game[p]; return (p=='Zac', -(g['g']*100+g['a']*10+g['w']), PL.index(p))
res['order']=sorted(PL,key=key)
def outcome(m):
    a=sum(1 for e in events if e['match']==m['id'] and e['stat']=='g'); b=m.get('against',0)
    return 'W' if a>b else 'D' if a==b else 'L'
res['form']=[outcome(m) for m in matches]
open(sys.argv[2],'w').write('window.RES = '+json.dumps(res)+';\n')
print(json.dumps(res,indent=1))
