const { packages: P2, fastTrack: FT2, money: M2, objections: OBJ2 } = window.PFS;

// Full-width layouts (1470px). The narrow column is right for reading prose;
// it is wrong for comparing options and wrong for a calendar. These three use
// the width for the thing that actually needs it.

function WideHeader({ children, sub, h1 }) {
  return <div style={{display:'grid',gridTemplateColumns:'1fr auto',gap:40,alignItems:'end',paddingBottom:22,marginBottom:26,borderBottom:`1px solid ${G.line}`}}>
    <div>
      <TrustLine/>
      <h1 style={{fontSize:40,fontWeight:800,letterSpacing:'-.03em',lineHeight:1.08,margin:'10px 0 10px',color:G.fg1}}>{h1}</h1>
      <p style={{fontSize:16,color:G.fg3,lineHeight:1.6,margin:0,maxWidth:'72ch',textWrap:'pretty'}}>{sub}</p>
    </div>
    {children}
  </div>;
}

function StatTiles({ items, invert }) {
  return <div style={{display:'flex',gap:10}}>
    {items.map(([n,l,s]) => <div key={l} style={{minWidth:132,border:`1px solid ${invert?'rgba(255,255,255,.35)':G.line}`,borderRadius:12,padding:'13px 16px',background:invert?'rgba(255,255,255,.1)':'#fff'}}>
      <div style={{fontSize:22,fontWeight:800,letterSpacing:'-.025em',color:invert?'#fff':G.fg1,lineHeight:1.1}}>{n}</div>
      <div style={{fontSize:12.5,color:invert?'#fff':G.fg3,marginTop:2,fontWeight:500}}>{l}</div>
      {s && <div style={{fontSize:11.5,color:invert?'rgba(255,255,255,.85)':G.fg5}}>{s}</div>}
    </div>)}
  </div>;
}

// ── C5 — Full enforcer, three columns ─────────────────────────────────────
// Everything the live page has, but the enforcers get their own rail instead
// of interrupting the decision. Nothing scrolls out of reach.
function BuyBox5() {
  const plan = usePlan();
  return <div>
    <WideHeader h1="Functional Skills Maths Level 2"
      sub={<>Ofqual-regulated, GCSE grade 4/C equivalent, sat at home with no exam centre and no travel. <b style={{color:G.fg1,fontWeight:600}}>93% of learners who complete the course pass</b> — measured across 5,399 sittings of this exam.</>}>
      <StatTiles items={[['93%','pass rate','5,399 sittings'],['2–6 days','to your result','Fast Track: 2'],['£119.99','exam pack','included free']]}/>
    </WideHeader>

    <div style={{display:'grid',gridTemplateColumns:'360px minmax(0,1fr) 360px',gap:36,alignItems:'start'}}>
      <div style={{display:'grid',gap:16}}>
        <Placeholder h={190} label="learner sitting the exam at home"/>
        <button style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,height:44,borderRadius:12,border:`1px solid ${A.infoBd}`,background:A.infoBg,fontFamily:'inherit',fontSize:13.5,fontWeight:600,color:'#1A56DB',cursor:'pointer'}}>
          <Play s={13} c="#1A56DB"/>Watch the 90-second setup
        </button>
        <FeatureChecklist tone="green"/>
        <ReviewStrip n={2}/>
      </div>

      <div>
        <Eyebrow>1 · Choose what you need</Eyebrow>
        <div style={{display:'grid',gap:10,marginBottom:24}}>
          {P2.map(p => <PkgRow key={p.id} p={p} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)}/>)}
        </div>
        <div style={{marginBottom:24}}><DateStep plan={plan}/></div>
        <div style={{marginBottom:12}}>
          <TotalBlock total={plan.total} rows={[[plan.pkg.name,M2(plan.pkg.now)],['Exam pack (worth £119.99)','Included'],['Exam date',plan.dateLabel],['You save',M2(plan.pkg.was - plan.pkg.now)]]}/>
        </div>
        <Cta label={`Add to basket · ${M2(plan.total)}`} sub={`or from ${M2(plan.total/12)}/month — 0% interest over 3 months`}/>
        <div style={{marginTop:22}}><ProofGrid cols={2}/></div>
      </div>

      <div style={{display:'grid',gap:12}}>
        <Countdown/>
        <SpacesBar/>
        <div style={{background:A.succBg,border:`1px solid ${A.succBd}`,borderRadius:12,padding:'16px 18px'}}>
          <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:6}}><Check s={17} c={A.succ}/><b style={{fontSize:14.5,fontWeight:700,color:'#03543F'}}>Free resit included</b></div>
          <p style={{fontSize:13,color:'#03543F',margin:0,lineHeight:1.5}}>On this package you cannot lose the fee. 7% of learners use the resit; the other 93% never need it.</p>
        </div>
        <SecureStrip/>
        <CallPanel/>
        <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:'16px 18px',background:'#fff'}}>
          <BodyChips/>
        </div>
      </div>
    </div>
  </div>;
}

// ── C6 — No imagery, full-bleed comparison ────────────────────────────────
// The gallery is gone and the width goes to the one job width is good for:
// comparing three options side by side, at full size, with no scrolling.
function BuyBox6() {
  const plan = usePlan();
  return <div>
    <div style={{borderRadius:16,overflow:'hidden',border:`1px solid ${G.line}`,marginBottom:22}}>
      <div style={{background:`linear-gradient(120deg,${G.priDD} 0%,${G.priD} 100%)`,padding:'28px 32px 26px',display:'grid',gridTemplateColumns:'minmax(0,1fr) auto',gap:40,alignItems:'end'}}>
        <div>
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <span style={{fontSize:11.5,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:G.priDD,background:'#fff',borderRadius:999,padding:'4px 11px'}}>Ofqual regulated</span>
            <span style={{fontSize:13,color:'#fff'}}>GCSE grade 4/C equivalent · sat at home</span>
          </div>
          <h1 style={{fontSize:38,fontWeight:800,letterSpacing:'-.03em',lineHeight:1.08,margin:'0 0 14px',color:'#fff'}}>Functional Skills Maths Level 2</h1>
          <p style={{fontSize:15,color:'#fff',margin:0,maxWidth:'62ch',lineHeight:1.55}}>One exam, three levels of support. No photography, no filler — the decision is the page.</p>
        </div>
        <div style={{textAlign:'right'}}>
          <p style={{fontSize:13,color:'#fff',margin:'0 0 4px'}}>Your selection</p>
          <div style={{display:'flex',alignItems:'flex-end',gap:12,justifyContent:'flex-end'}}>
            <span style={{fontSize:52,fontWeight:800,letterSpacing:'-.035em',lineHeight:1,color:'#fff'}}>{M2(plan.total)}</span>
            <span style={{fontSize:19,color:'#fff',textDecoration:'line-through',paddingBottom:7}}>{M2(plan.pkg.was + plan.dateAdd)}</span>
          </div>
          <p style={{fontSize:14,color:'#fff',margin:'6px 0 0'}}>or from {M2(plan.total/12)}/month with Klarna, Clearpay or Payl8r</p>
        </div>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',background:'#fff'}}>
        {[['93%','pass rate','across 5,399 sittings'],['2–6 days','to your result','Fast Track guarantees 2'],['£119.99','exam pack','included with every exam']].map(([n,l,s],i) => <div key={l} style={{padding:'15px 22px',borderRight:i<2?`1px solid ${G.line}`:'none'}}>
          <div style={{fontSize:21,fontWeight:800,letterSpacing:'-.02em',color:G.fg1,lineHeight:1.1}}>{n}</div>
          <div style={{fontSize:13,color:G.fg3,marginTop:2,fontWeight:500}}>{l} <span style={{color:G.fg5,fontWeight:400}}>— {s}</span></div>
        </div>)}
      </div>
    </div>

    <Eyebrow>1 · Choose what you need</Eyebrow>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:26,alignItems:'start'}}>
      {P2.map(p => { const on = plan.pkgId===p.id; return <div key={p.id} onClick={()=>plan.setPkg(p.id)} role="radio" aria-checked={on} tabIndex={0}
        onKeyDown={e => { if(e.key===' '||e.key==='Enter'){e.preventDefault();plan.setPkg(p.id);} }}
        style={{position:'relative',border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:14,padding:on?23:24,background:'#fff',cursor:'pointer',boxShadow:on?'0 0 0 4px rgba(15,188,15,.12)':'none'}}>
        {p.tag && <span style={{position:'absolute',top:-11,left:24,background:G.pri,color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'.03em',textTransform:'uppercase',padding:'4px 11px',borderRadius:999}}>{p.tag}</span>}
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
          <span style={{width:20,height:20,borderRadius:999,border:`${on?6:1.5}px solid ${on?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box',flex:'none'}}/>
          <b style={{fontSize:18,fontWeight:700,color:G.fg1}}>{p.name}</b>
        </div>
        <div style={{display:'flex',alignItems:'flex-end',gap:9,marginBottom:12}}>
          <span style={{fontSize:30,fontWeight:800,letterSpacing:'-.025em',color:G.fg1,lineHeight:1}}>{M2(p.now)}</span>
          <span style={{fontSize:14,color:G.fg5,textDecoration:'line-through',paddingBottom:2}}>{M2(p.was)}</span>
        </div>
        <p style={{fontSize:13.5,color:G.fg3,lineHeight:1.5,margin:'0 0 14px',minHeight:60}}>{p.for}</p>
        <div style={{display:'grid',gap:8,paddingTop:14,borderTop:`1px solid ${G.line}`}}>
          {p.includes.map(f => <div key={f} style={{display:'grid',gridTemplateColumns:'17px 1fr',gap:9,alignItems:'start'}}>
            <span style={{marginTop:2}}><Check s={15}/></span><span style={{fontSize:13,color:G.fg2,lineHeight:1.45}}>{f}</span>
          </div>)}
        </div>
        {p.id==='premium' && <div style={{marginTop:14,background:A.succBg,border:`1px solid ${A.succBd}`,borderRadius:10,padding:'10px 12px',fontSize:12.5,color:'#03543F',lineHeight:1.45}}><b style={{fontWeight:700}}>You cannot lose the fee.</b> Don't pass, sit it again free.</div>}
      </div>; })}
    </div>

    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 440px',gap:36,alignItems:'start'}}>
      <div>
        <DateStep plan={plan}/>
        <div style={{marginTop:22}}><CallPanel/></div>
        <div style={{marginTop:16}}><Faq items={OBJ2.slice(0,4)} open={-1}/></div>
      </div>
      <div style={{display:'grid',gap:12}}>
        <TotalBlock total={plan.total} rows={[[plan.pkg.name,M2(plan.pkg.now)],['Exam pack','Included'],['Exam date',plan.dateLabel]]}/>
        <Cta label={`Add to basket · ${M2(plan.total)}`}/>
        <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12,padding:'12px 16px',background:A.amberBg,border:`1px solid ${A.amberBd}`,borderRadius:12}}>
          <span style={{display:'flex',alignItems:'center',gap:8,fontSize:13,fontWeight:600,color:A.amber}}><Clock s={15} c={A.amber}/>8 places left</span>
          <CountdownInline/>
        </div>
        <SecureStrip/>
        <BodyChips/>
      </div>
    </div>
  </div>;
}

function CountdownInline() {
  const c = useCountdown();
  return <span style={{fontSize:13,fontWeight:700,color:A.amber,fontVariantNumeric:'tabular-nums'}}>{String(c.d).padStart(2,'0')}d {String(c.h).padStart(2,'0')}h {String(c.m).padStart(2,'0')}m {String(c.s).padStart(2,'0')}s</span>;
}

// ── C7 — Booking-first, calendar at full width ────────────────────────────
// The date was the worst thing on the live page because it was crammed into a
// 640px rail. Given the full width it becomes the clearest thing on the page:
// a real month, every sitting priced, the result date on every cell.
const MONTH = (() => {
  const out = [];
  for (let d = 1; d <= 30; d++) {
    const wd = (d + 1) % 7; // Sept 1 2026 is a Tuesday -> wd 2
    const open = [2,3,5,6].includes(wd);
    const price = Math.max(200, 240 - Math.floor((d-1)/7) * 8);
    out.push({ d, wd, open, price, res: d + 4 <= 30 ? `${d+4} Sep` : `${d+4-30} Oct` });
  }
  return out;
})();
const MIN_PRICE = Math.min(...MONTH.filter(m=>m.open).map(m=>m.price));

function MonthGrid({ value, onPick }) {
  const firstOpen = MONTH.find(m => m.open);
  return <div style={{border:`1px solid ${G.line}`,borderRadius:14,overflow:'hidden',background:'#fff'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 18px',borderBottom:`1px solid ${G.line}`,background:G.sunk}}>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <button aria-label="Previous month" style={{width:32,height:32,borderRadius:8,border:`1px solid ${G.line}`,background:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Chevron s={15} dir="left" c={G.fg4}/></button>
        <b style={{fontSize:16,fontWeight:700,color:G.fg1}}>September 2026</b>
        <button aria-label="Next month" style={{width:32,height:32,borderRadius:8,border:`1px solid ${G.line}`,background:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Chevron s={15} dir="right" c={G.fg4}/></button>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:16,fontSize:12,color:G.fg4}}>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:11,height:11,borderRadius:3,background:G.priBg,border:`1px solid ${G.priBd}`}}/>cheapest · £{MIN_PRICE}</span>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:11,height:11,borderRadius:3,background:A.amberBg,border:`1px solid ${A.amberBd}`}}/>soonest</span>
        <span style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:11,height:11,borderRadius:3,background:G.sunk,border:`1px solid ${G.line}`}}/>no sitting</span>
      </div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`1px solid ${G.line}`}}>
      {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => <div key={d} style={{padding:'9px 0',textAlign:'center',fontSize:11.5,fontWeight:600,letterSpacing:'.04em',textTransform:'uppercase',color:G.fg4}}>{d}</div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:1,background:G.line}}>
      <div style={{background:'#fff'}}/>
      {MONTH.map(m => {
        const on = value === m.d;
        const cheapest = m.open && m.price === MIN_PRICE;
        const soonest = m.open && m.d === (MONTH.find(x=>x.open)||{}).d;
        const bg = !m.open ? G.sunk : on ? G.priBg : '#fff';
        return <button key={m.d} disabled={!m.open} onClick={()=>onPick(m.d)}
          style={{position:'relative',border:'none',background:bg,padding:'10px 8px 11px',minHeight:78,cursor:m.open?'pointer':'default',fontFamily:'inherit',textAlign:'left',outline:on?`2px solid ${G.pri}`:'none',outlineOffset:-2}}>
          <div style={{fontSize:13.5,fontWeight:m.open?700:400,color:m.open?G.fg1:G.fg5,marginBottom:3}}>{m.d}</div>
          {m.open ? <>
            <div style={{fontSize:15,fontWeight:800,letterSpacing:'-.02em',color:on?G.priDD:G.fg1,lineHeight:1.1}}>£{m.price}</div>
            <div style={{fontSize:10,color:G.fg5,marginTop:1}}>result {m.res}</div>
            {cheapest && <span style={{position:'absolute',top:7,right:7,fontSize:8.5,fontWeight:700,color:G.priDD,background:G.priBg,border:`1px solid ${G.priBd}`,borderRadius:3,padding:'1px 4px'}}>LOW</span>}
            {soonest && <span style={{position:'absolute',top:7,right:7,fontSize:8.5,fontWeight:700,color:A.amber,background:A.amberBg,border:`1px solid ${A.amberBd}`,borderRadius:3,padding:'1px 4px'}}>SOON</span>}
          </> : <div style={{fontSize:11,color:G.fg5}}>—</div>}
        </button>;
      })}
    </div>
  </div>;
}

function BuyBox7() {
  const plan = usePlan('premium');
  const [day,setDay] = React.useState(5);
  const cell = MONTH.find(m => m.d === day) || null;
  const dateAdd = cell ? cell.price - 157.60 : 0;
  const total = plan.pkg.now + dateAdd + (plan.ft ? FT2.add : 0);
  return <div>
    <WideHeader h1="Book your Functional Skills Maths Level 2 exam"
      sub="Ofqual-regulated, sat at home, invigilated remotely. Pick the sitting first — the price, the result date and everything else follows from it.">
      <StatTiles items={[['30','sittings this month'],['2–6 days','to your result','Fast Track: 2'],['£200','cheapest sitting','later dates cost less']]}/>
    </WideHeader>

    <div style={{display:'flex',alignItems:'flex-start',gap:12,background:A.infoBg,border:`1px solid ${A.infoBd}`,borderRadius:12,padding:'14px 18px',marginBottom:24}}>
      <span style={{marginTop:1}}><Clock s={17} c="#1A56DB"/></span>
      <p style={{fontSize:13.5,color:'#1E429F',margin:0,lineHeight:1.5}}><b style={{fontWeight:700,color:'#1A56DB'}}>Every cell shows the date your result is due.</b> Bank holidays are excluded from the working-day count, so the date on the cell is the date to plan around — not an estimate.</p>
    </div>

    <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 440px',gap:36,alignItems:'start'}}>
      <div>
        <Eyebrow>1 · Choose your sitting</Eyebrow>
        <MonthGrid value={day} onPick={setDay}/>
        <button onClick={()=>setDay(null)} style={{width:'100%',marginTop:12,background:day?'#fff':G.priBg,border:`${day?1:2}px solid ${day?G.line:G.pri}`,borderRadius:12,padding:day?'14px 18px':'13px 17px',fontFamily:'inherit',cursor:'pointer',textAlign:'left'}}>
          <span style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
            <span style={{display:'flex',alignItems:'center',gap:11}}>
              <span style={{width:18,height:18,borderRadius:999,border:`${day?1.5:5}px solid ${day?'#D1D5DB':G.pri}`,background:'#fff',boxSizing:'border-box',flex:'none'}}/>
              <span><b style={{fontSize:15,fontWeight:600,color:G.fg1,display:'block'}}>I'd rather decide later</b><span style={{fontSize:13,color:G.fg4}}>Book now, pick your date from your account any time in the next 12 months</span></span>
            </span>
            <b style={{fontSize:14.5,fontWeight:700,color:day?G.fg3:G.priDD,whiteSpace:'nowrap'}}>{day?`save ${M2(dateAdd)}`:'£0'}</b>
          </span>
        </button>
        <div style={{marginTop:24}}><FeatureChecklist cols={2}/></div>
        <div style={{marginTop:16}}><ReviewStrip n={2}/></div>
      </div>

      <div style={{display:'grid',gap:12}}>
        <div>
          <Eyebrow>2 · Add the course?</Eyebrow>
          <div style={{display:'grid',gap:9}}>
            {P2.map(p => <PkgRow key={p.id} p={p} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)} compact/>)}
          </div>
        </div>
        <div>
          <Eyebrow>3 · Need it faster?</Eyebrow>
          <div onClick={()=>plan.setFt(!plan.ft)} style={{display:'grid',gridTemplateColumns:'22px 1fr auto',gap:12,alignItems:'start',border:`${plan.ft?2:1}px solid ${plan.ft?A.amber:G.line}`,borderRadius:12,padding:plan.ft?'14px 16px':'15px 17px',background:plan.ft?A.amberBg:'#fff',cursor:'pointer'}}>
            <span style={{width:20,height:20,borderRadius:5,border:`${plan.ft?0:1.5}px solid #D1D5DB`,background:plan.ft?A.amber:'#fff',display:'grid',placeItems:'center',marginTop:1,boxSizing:'border-box'}}>{plan.ft && <Check s={14} c="#fff"/>}</span>
            <div>
              <p style={{fontSize:14.5,fontWeight:600,color:plan.ft?'#9A3412':G.fg1,margin:'0 0 3px'}}>{FT2.label}</p>
              <p style={{fontSize:12.5,color:plan.ft?'#9A3412':G.fg4,margin:0,lineHeight:1.45}}>{FT2.sub}</p>
            </div>
            <b style={{fontSize:15,fontWeight:800,color:plan.ft?'#9A3412':G.fg1,whiteSpace:'nowrap'}}>+{M2(FT2.add)}</b>
          </div>
        </div>
        <TotalBlock total={total} rows={[
          ['Exam' + (cell?` — ${cell.d} Sep`:' — date later'), M2(157.60 + dateAdd)],
          [plan.pkgId==='exam'?'No course':plan.pkg.name.replace('Exam + ',''), plan.pkgId==='exam'?'—':'+'+M2(plan.pkg.now-157.60)],
          ['Fast Track results', plan.ft?'+'+M2(FT2.add):'Not added'],
          ['Exam pack (worth £119.99)','Included']
        ]}/>
        <Cta label={`Add to basket · ${M2(total)}`} sub={cell?`Result due by ${cell.res}${plan.ft?' — Fast Track brings that forward':''}`:'Pick your date any time in the next 12 months'}/>
        <SpacesBar/>
        <SecureStrip/>
        <CallPanel/>
        <BodyChips/>
      </div>
    </div>
  </div>;
}

Object.assign(window, { BuyBox5, BuyBox6, BuyBox7, CountdownInline, WideHeader, StatTiles, MonthGrid, MONTH });
