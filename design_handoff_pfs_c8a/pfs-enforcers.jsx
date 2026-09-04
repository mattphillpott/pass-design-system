// Enforcers, reinstated as a ranked system rather than five competing alarms.
// Semantic colour: green = pass/selection, amber = time, blue = information,
// emerald = guarantee, red = the cost of failing. No decorative colour.
// succ carries icons and borders (3:1 non-text threshold); succText carries any
// text on a light surface — #0E9F6E is only 3.39:1 on white.
const A = { amber:'#D97706', amberBg:'#FFF7ED', amberBd:'#FED7AA', info:'#1C64F2', infoBg:'#EEF6FF', infoBd:'#C3DDFD', succ:'#0E9F6E', succText:'#047857', succBg:'#ECFDF5', succBd:'#A7F3D0', dang:'#C70036', dangBg:'#FDF2F2', dangBd:'#FBD5D5' };

const DEADLINE = new Date('2026-08-28T23:59:59');

function useCountdown() {
  const [t,setT] = React.useState(() => DEADLINE - new Date());
  React.useEffect(() => { const i = setInterval(() => setT(DEADLINE - new Date()), 1000); return () => clearInterval(i); }, []);
  const s = Math.max(0, Math.floor(t/1000));
  return { d:Math.floor(s/86400), h:Math.floor(s%86400/3600), m:Math.floor(s%3600/60), s:s%60 };
}

function Countdown({ tone = 'amber', label = 'Offer ends' }) {
  const c = useCountdown();
  const pal = tone === 'amber' ? [A.amberBg,A.amberBd,A.amber] : [A.dangBg,A.dangBd,A.dang];
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,background:pal[0],border:`1px solid ${pal[1]}`,borderRadius:12,padding:'12px 16px'}}>
    <div style={{display:'flex',alignItems:'center',gap:9,fontSize:14,fontWeight:600,color:pal[2]}}><Clock s={16} c={pal[2]}/>{label}</div>
    <div style={{display:'flex',gap:6}}>
      {[[c.d,'days'],[c.h,'hrs'],[c.m,'min'],[c.s,'sec']].map(([v,l]) => <div key={l} style={{textAlign:'center',minWidth:42}}>
        <div style={{background:'#fff',border:`1px solid ${pal[1]}`,borderRadius:8,padding:'4px 0',fontSize:17,fontWeight:800,color:pal[2],letterSpacing:'-.02em',fontVariantNumeric:'tabular-nums'}}>{String(v).padStart(2,'0')}</div>
        <div style={{fontSize:9.5,color:pal[2],marginTop:2,textTransform:'uppercase',letterSpacing:'.05em',opacity:.8}}>{l}</div>
      </div>)}
    </div>
  </div>;
}

function SpacesBar({ left = 8, of = 40 }) {
  const pct = Math.round((1 - left/of) * 100);
  return <div style={{background:A.amberBg,border:`1px solid ${A.amberBd}`,borderRadius:12,padding:'12px 16px'}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',marginBottom:7}}>
      <span style={{fontSize:13.5,fontWeight:600,color:A.amber}}>{left} places left at this price</span>
      <span style={{fontSize:12,color:A.amber,opacity:.85}}>{pct}% taken</span>
    </div>
    <div style={{height:6,background:'#fff',borderRadius:999,overflow:'hidden',border:`1px solid ${A.amberBd}`}}>
      <div style={{width:pct+'%',height:'100%',background:A.amber,borderRadius:999}}/>
    </div>
  </div>;
}

function SecureStrip() {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,border:`1px solid ${G.line}`,borderRadius:12,padding:'12px 16px',background:'#fff',flexWrap:'wrap'}}>
    <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:G.fg3,fontWeight:600}}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={A.succ} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
      Secure checkout
    </div>
    <PayMarks/>
  </div>;
}

function CallPanel({ tone = 'info' }) {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,background:tone==='info'?A.infoBg:G.sunk,border:`1px solid ${tone==='info'?A.infoBd:G.line}`,borderRadius:12,padding:'14px 18px'}}>
    <div>
      <p style={{fontSize:14.5,fontWeight:700,color:tone==='info'?'#1A56DB':G.fg1,margin:'0 0 2px'}}>Not sure? Talk to a course adviser</p>
      <p style={{fontSize:12.5,color:tone==='info'?'#1E429F':G.fg4,margin:0}}>Open until 8pm. They'll tell you if you don't need the course.</p>
    </div>
    <a href="tel:02045749155" style={{display:'flex',alignItems:'center',gap:8,flex:'none',height:40,padding:'0 16px',borderRadius:12,background:'#fff',border:`1px solid ${tone==='info'?A.infoBd:G.line}`,fontSize:14,fontWeight:700,color:tone==='info'?'#1A56DB':G.fg1,textDecoration:'none'}}>
      <Phone s={15} c={tone==='info'?'#1A56DB':G.pri}/>020 4574 9155
    </a>
  </div>;
}

const FEATURES = [
  'The Ofqual-regulated exam, sat at home',
  'Exam pack worth £119.99 included',
  'Video lessons, topic tests and practice papers',
  'Tutor-marked assignments with written feedback',
  'One 1-to-1 tutorial with a qualified tutor',
  'Free resit if you don\'t pass first time',
  'Certificate accepted in place of GCSE maths',
  'Results in 2–6 working days'
];

function FeatureChecklist({ items = FEATURES, cols = 1, tone = 'plain' }) {
  return <div style={{background:tone==='green'?G.priBg:'#fff',border:`1px solid ${tone==='green'?G.priBd:G.line}`,borderRadius:12,padding:'16px 18px'}}>
    <p style={{fontSize:12,fontWeight:700,letterSpacing:'.06em',textTransform:'uppercase',color:tone==='green'?G.priDD:G.fg4,margin:'0 0 12px'}}>What's included</p>
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:'9px 20px'}}>
      {items.map(f => <div key={f} style={{display:'grid',gridTemplateColumns:'18px 1fr',gap:10,alignItems:'start'}}>
        <span style={{marginTop:2}}><Check s={16} c={tone==='green'?G.priDD:G.pri}/></span>
        <span style={{fontSize:13.5,color:tone==='green'?'#0F5C13':G.fg2,lineHeight:1.45}}>{f}</span>
      </div>)}
    </div>
  </div>;
}

const REVIEWS = [
  { n:'Priya S.', l:'Nursing applicant', q:'Sat it on a Tuesday, had the certificate the following Monday. The trust accepted it without a question.' },
  { n:'Dan H.', l:'Passed after failing GCSE twice', q:'I hadn\'t done maths in eighteen years. The course started where I actually was.' },
  { n:'Alisha K.', l:'Apprentice, Manchester', q:'Paid it off in three instalments. Nobody made me feel stupid for asking.' }
];

function ReviewStrip({ n = 3 }) {
  return <div>
    <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
      <Stars s={15}/>
      <span style={{fontSize:14,fontWeight:700,color:G.fg1}}>4.7 / 5</span>
      <span style={{fontSize:13,color:G.fg4}}>from 258 reviews on</span>
      <img src="assets/trustpilot.png" alt="Trustpilot" style={{height:13,display:'block'}}/>
    </div>
    <div style={{display:'grid',gap:8}}>
      {REVIEWS.slice(0,n).map(r => <div key={r.n} style={{border:`1px solid ${G.line}`,borderRadius:10,padding:'12px 14px',background:'#fff'}}>
        <Stars s={12}/>
        <p style={{fontSize:13,color:G.fg2,lineHeight:1.5,margin:'5px 0 5px'}}>“{r.q}”</p>
        <p style={{fontSize:11.5,color:G.fg4,margin:0}}><b style={{fontWeight:600,color:G.fg2}}>{r.n}</b> · {r.l}</p>
      </div>)}
    </div>
  </div>;
}

// ── The date step, made explicit ───────────────────────────────────────────
// Answers "where does the calendar go": behind one binary, as a compact strip
// of real slots ordered by date, with the cheapest flagged rather than
// colour-graded. Never 36 prices on arrival.
const SLOTS = [
  { id:'d25', day:'Tue 25', mon:'Aug', price:272, res:'1 Sep', soonest:true },
  { id:'d27', day:'Wed 27', mon:'Aug', price:256, res:'3 Sep' },
  { id:'d29', day:'Sat 29', mon:'Aug', price:240, res:'5 Sep' },
  { id:'d02', day:'Tue 2',  mon:'Sep', price:232, res:'9 Sep' },
  { id:'d05', day:'Fri 5',  mon:'Sep', price:216, res:'12 Sep', cheapest:true },
  { id:'d09', day:'Tue 9',  mon:'Sep', price:216, res:'16 Sep', cheapest:true }
];

function DatePanel({ value, onPick, base = 157.60 }) {
  return <div style={{border:`1px solid ${G.line}`,borderRadius:12,overflow:'hidden',background:'#fff'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 16px',borderBottom:`1px solid ${G.line}`,background:G.sunk}}>
      <span style={{fontSize:13.5,fontWeight:700,color:G.fg1}}>Next available sittings</span>
      <span style={{fontSize:12.5,color:G.fg4}}>Priced by demand · later is cheaper</span>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:1,background:G.line}}>
      {SLOTS.map(s => {
        const on = value === s.id;
        return <button key={s.id} onClick={()=>onPick(s.id)} style={{position:'relative',border:'none',background:on?G.priBg:'#fff',padding:'14px 10px 12px',cursor:'pointer',fontFamily:'inherit',textAlign:'center',outline:on?`2px solid ${G.pri}`:'none',outlineOffset:-2}}>
          {s.soonest && <span style={{position:'absolute',top:5,right:5,fontSize:9,fontWeight:700,letterSpacing:'.04em',color:A.amber,background:A.amberBg,border:`1px solid ${A.amberBd}`,borderRadius:4,padding:'1px 4px'}}>SOONEST</span>}
          {s.cheapest && <span style={{position:'absolute',top:5,right:5,fontSize:9,fontWeight:700,letterSpacing:'.04em',color:G.priDD,background:G.priBg,border:`1px solid ${G.priBd}`,borderRadius:4,padding:'1px 4px'}}>CHEAPEST</span>}
          <div style={{fontSize:15,fontWeight:700,color:G.fg1,marginTop:6}}>{s.day}</div>
          <div style={{fontSize:11.5,color:G.fg4,marginBottom:6}}>{s.mon}</div>
          <div style={{fontSize:16,fontWeight:800,color:on?G.priDD:G.fg1,letterSpacing:'-.02em'}}>£{s.price}</div>
          <div style={{fontSize:10.5,color:G.fg5,marginTop:2}}>result by {s.res}</div>
        </button>;
      })}
    </div>
    <div style={{padding:'11px 16px',borderTop:`1px solid ${G.line}`,display:'flex',justifyContent:'space-between',alignItems:'center',gap:12}}>
      <span style={{fontSize:12,color:G.fg4}}>Free date change up to 7 days before.</span>
      <button style={{background:'none',border:'none',fontFamily:'inherit',fontSize:12.5,fontWeight:600,color:G.fg3,textDecoration:'underline',cursor:'pointer'}}>See all dates to March 2027</button>
    </div>
  </div>;
}

function ThinGallery() {
  return <div style={{display:'flex',gap:8,alignItems:'center'}}>
    {['exam at home','exam pack','setup video','certificate'].map(l => <div key={l} style={{flex:1,height:56,borderRadius:8,border:`1px solid ${G.line}`,background:`repeating-linear-gradient(135deg,${G.sunk} 0 8px,#F1F3F6 8px 16px)`,display:'grid',placeItems:'center'}}>
      <span style={{fontFamily:'ui-monospace,Menlo,monospace',fontSize:8.5,letterSpacing:'.05em',textTransform:'uppercase',color:G.fg5}}>{l}</span>
    </div>)}
    <button style={{flex:'none',display:'flex',alignItems:'center',gap:7,height:56,padding:'0 14px',borderRadius:8,border:`1px solid ${A.infoBd}`,background:A.infoBg,fontFamily:'inherit',fontSize:12.5,fontWeight:600,color:'#1A56DB',cursor:'pointer'}}>
      <Play s={12} c="#1A56DB"/>Watch the 90-second setup
    </button>
  </div>;
}

Object.assign(window, { A, Countdown, SpacesBar, SecureStrip, CallPanel, FeatureChecklist, FEATURES, ReviewStrip, REVIEWS, DatePanel, SLOTS, ThinGallery, useCountdown });
