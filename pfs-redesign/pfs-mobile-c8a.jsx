const { packages: P5, money: M5, objections: OBJ5 } = window.PFS;

// C8-A mobile. Deliberately NOT the sheet pattern used by C1–C4: C8-A's whole
// premise is a low-change A/B test, and moving a composite form into a modal is
// a large JS job. So the steps stay inline in document order — the same
// components, stacked — with a sticky bar carrying the live total.

function MStepRow({ num, label, help, options, value, onPick, disabled }) {
  return <div style={{marginBottom:16,opacity:disabled?.5:1,pointerEvents:disabled?'none':'auto'}}>
    <p style={{fontSize:13.5,fontWeight:700,color:G.fg1,margin:'0 0 3px'}}><span style={{color:G.fg4,fontWeight:600,marginRight:6}}>{num}</span>{label}</p>
    {help && <p style={{fontSize:12,color:G.fg4,margin:'0 0 8px',lineHeight:1.45}}>{help}</p>}
    <div style={{display:'grid',gap:7}}>
      {options.map(o => { const on = value===o.id; return <button key={o.id} onClick={()=>onPick(o.id)} aria-pressed={on}
        style={{display:'grid',gridTemplateColumns:'18px 1fr auto',gap:10,alignItems:'center',width:'100%',border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:10,padding:on?'11px 12px':'12px 13px',background:on?G.priBg:'#fff',cursor:'pointer',fontFamily:'inherit',textAlign:'left'}}>
        <span style={{width:16,height:16,borderRadius:999,border:`${on?4.5:1.5}px solid ${on?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box'}}/>
        <span>
          <span style={{display:'block',fontSize:14,fontWeight:on?700:500,color:on?G.priDD:G.fg1,lineHeight:1.3}}>{o.label}
            {o.flag && <span style={{fontSize:9.5,fontWeight:700,letterSpacing:'.04em',textTransform:'uppercase',color:'#fff',background:G.pri,borderRadius:999,padding:'1px 7px',marginLeft:6,verticalAlign:'1px',whiteSpace:'nowrap'}}>{o.flag}</span>}
          </span>
          {o.sub && <span style={{display:'block',fontSize:11.5,color:on?G.priDD:G.fg4,marginTop:2,lineHeight:1.4,opacity:on?.85:1}}>{o.sub}</span>}
        </span>
        {o.price && <span style={{fontSize:13.5,fontWeight:700,color:on?G.priDD:G.fg1,whiteSpace:'nowrap'}}>{o.price}</span>}
      </button>; })}
    </div>
  </div>;
}

// Compact month: day + price only. The result date moves to the summary line
// below, because six characters of "result 19 Sep" will not fit a 51px cell.
function MMonthGrid({ value, onPick }) {
  return <div style={{border:`1px solid ${G.line}`,borderRadius:12,overflow:'hidden',background:'#fff'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',borderBottom:`1px solid ${G.line}`,background:G.sunk}}>
      <button aria-label="Previous month" style={{width:28,height:28,borderRadius:7,border:`1px solid ${G.line}`,background:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Chevron s={13} dir="left" c={G.fg4}/></button>
      <b style={{fontSize:14,fontWeight:700,color:G.fg1}}>September 2026</b>
      <button aria-label="Next month" style={{width:28,height:28,borderRadius:7,border:`1px solid ${G.line}`,background:'#fff',display:'grid',placeItems:'center',cursor:'pointer'}}><Chevron s={13} dir="right" c={G.fg4}/></button>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',borderBottom:`1px solid ${G.line}`}}>
      {['M','T','W','T','F','S','S'].map((d,i) => <div key={i} style={{padding:'6px 0',textAlign:'center',fontSize:10.5,fontWeight:600,color:G.fg4}}>{d}</div>)}
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:1,background:G.line}}>
      <div style={{background:'#fff'}}/>
      {MONTH.map(m => { const on = value===m.d; return <button key={m.d} disabled={!m.open} onClick={()=>onPick(m.d)}
        style={{border:'none',background:!m.open?G.sunk:on?G.priBg:'#fff',padding:'7px 2px 8px',minHeight:52,cursor:m.open?'pointer':'default',fontFamily:'inherit',outline:on?`2px solid ${G.pri}`:'none',outlineOffset:-2}}>
        <div style={{fontSize:12.5,fontWeight:m.open?700:400,color:m.open?G.fg1:G.fg5}}>{m.d}</div>
        {m.open && <div style={{fontSize:10.5,fontWeight:700,color:on?G.priDD:G.fg3,marginTop:2}}>£{m.price}</div>}
      </button>; })}
    </div>
  </div>;
}

function MobileC8A() {
  const [invig,setInvig] = React.useState('remote');
  const [dateMode,setDateMode] = React.useState('later');
  const [day,setDay] = React.useState(null);
  const [courseOpt,setCourseOpt] = React.useState('both');
  const [bundle,setBundle] = React.useState('premium');

  const inv = INVIG.find(i => i.id===invig);
  const cell = dateMode==='now' && day ? MONTH.find(m => m.d===day) : null;
  const dateAdd = cell ? cell.price - 157.60 : 0;
  const pkgId = courseOpt==='exam' ? 'exam' : bundle==='basic' ? 'course' : 'premium';
  const pkg = P5.find(p => p.id===pkgId);
  const unit = pkg.now + dateAdd;
  const was = pkg.was + dateAdd;
  const needsDate = dateMode==='now' && !day;

  return <div style={{position:'relative',width:390,height:844,background:'#fff',overflow:'hidden',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{height:52,background:'#fff',borderBottom:`1px solid ${G.line}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:7}}><Wordmark h={17}/><span style={{fontWeight:500,fontSize:13,color:G.fg3}}>Functional Skills</span></div>
      <div style={{display:'flex',alignItems:'center',gap:14}}><Phone c={G.pri}/><span style={{fontSize:20,color:G.fg2,lineHeight:1}}>≡</span></div>
    </div>

    <div style={{height:844-52-108,overflow:'auto'}}>
      <div style={{padding:'14px 16px 0'}}>
        <div style={{display:'flex',gap:8,alignItems:'stretch'}}>
          <button style={{position:'relative',flex:'none',width:36,height:36,borderRadius:8,border:`1px solid ${G.line}`,background:`repeating-linear-gradient(135deg,${G.sunk} 0 6px,#F1F3F6 6px 12px)`,cursor:'pointer',padding:0,overflow:'hidden'}}>
            <span style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(16,24,40,.72)',color:'#fff',fontSize:8,fontWeight:600,padding:'1px 0'}}>+5</span>
          </button>
          <button style={{flex:1,display:'flex',alignItems:'center',gap:8,height:36,padding:'0 12px',borderRadius:8,border:`1px solid ${A.infoBd}`,background:A.infoBg,fontFamily:'inherit',cursor:'pointer',textAlign:'left'}}>
            <Play s={11} c="#1A56DB"/>
            <span style={{fontSize:12.5,fontWeight:600,color:'#1A56DB',lineHeight:1.2}}>Watch the 90-second setup</span>
          </button>
        </div>
      </div>

      <div style={{padding:'14px 16px 0'}}>
        <h1 style={{fontSize:20,fontWeight:600,letterSpacing:'-.01em',lineHeight:1.28,margin:'0 0 6px',color:G.fg1,textWrap:'pretty'}}>Functional Skills Maths Level 2 — Ofqual-regulated exam, sat at home</h1>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
          <Stars s={13}/><a href="#r" style={{fontSize:12.5,textDecoration:'none'}}>4.7 · 258 ratings</a>
        </div>
        <p style={{fontSize:11.5,color:G.fg4,margin:'0 0 12px'}}>Awarded by {inv.board} · 5,399 sittings to date</p>

        <div style={{borderTop:`1px solid ${G.line}`,borderBottom:`1px solid ${G.line}`,padding:'12px 0',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:9}}>
            <span style={{fontSize:14,color:G.dang,fontWeight:600,paddingBottom:5}}>-{Math.round((1-unit/was)*100)}%</span>
            <span style={{fontSize:30,fontWeight:700,letterSpacing:'-.025em',lineHeight:1,color:G.fg1}}>{M5(unit)}</span>
          </div>
          <p style={{fontSize:12,color:G.fg4,margin:'5px 0 0'}}>RRP <span style={{textDecoration:'line-through'}}>{M5(was)}</span> · save {M5(was-unit)} · from {M5(unit/12)}/mth</p>
        </div>

        <div style={{background:G.sunk,borderRadius:10,padding:'11px 13px',marginBottom:18}}>
          <p style={{fontSize:12.5,color:G.fg2,margin:'0 0 2px'}}>Sitting <b style={{fontWeight:700,color:G.fg1}}>{cell ? `${cell.d} September` : dateMode==='now' ? 'not chosen yet' : 'chosen later'}</b></p>
          <p style={{fontSize:13.5,color:A.succText,margin:0,fontWeight:700}}>{cell ? `Result by ${cell.res}` : `Result ${invig==='remote'?'2–6':'6–16'} working days after you sit it`}</p>
        </div>

        <MStepRow num="1" label="Choose invigilation style" value={invig} onPick={setInvig}
          options={INVIG.map(i => ({ id:i.id, label:i.label.replace('Online ',''), sub:i.turn }))}/>

        <MStepRow num="2" label="Choose date" value={dateMode} onPick={m=>{setDateMode(m); if(m==='later') setDay(null);}}
          options={[{ id:'later', label:'Choose date later', sub:'Book now, decide within 12 months', price:'£0' },{ id:'now', label:'Choose date now', sub:'Pick from the calendar', price:'from +£42' }]}/>
        {dateMode==='now' && <div style={{margin:'-4px 0 16px'}}>
          <MMonthGrid value={day} onPick={setDay}/>
          <p style={{fontSize:11.5,color:needsDate?G.dang:G.fg4,fontWeight:needsDate?600:400,margin:'8px 0 0',lineHeight:1.45}}>{needsDate ? 'Choose a sitting to see your result date.' : `Result by ${cell.res}. Free date change up to 7 days before.`}</p>
        </div>}

        <MStepRow num="3" label="Choose course option" value={courseOpt} onPick={setCourseOpt}
          help="93% of learners who complete the course pass, across 5,399 sittings."
          options={[{ id:'exam', label:'Exam Only', price:M5(157.60) },{ id:'both', label:'Exam & Course', flag:'Most popular', price:'+£184' }]}/>

        <MStepRow num="4" label="Choose course bundle option" value={courseOpt==='both'?bundle:null} onPick={setBundle}
          disabled={courseOpt!=='both'}
          help={courseOpt==='both' ? 'Premium adds 12 months instead of 3, and a free resit.' : 'Available once you add the course.'}
          options={BUNDLES.map(b => ({ id:b.id, label:b.label, sub:b.desc, flag:b.flag, price:`+${M5(b.add)}` }))}/>

        <div style={{marginTop:18,marginBottom:16}}><SecureStrip/></div>
        <p style={{fontSize:14,fontWeight:700,color:G.fg1,margin:'0 0 8px'}}>About this exam</p>
        <div style={{display:'grid',gap:6,marginBottom:18}}>
          {FEATURES.slice(0,6).map(f => <div key={f} style={{display:'grid',gridTemplateColumns:'14px 1fr',gap:8,alignItems:'start'}}>
            <span style={{marginTop:6,width:4,height:4,borderRadius:999,background:G.fg4}}/>
            <span style={{fontSize:12.5,color:G.fg2,lineHeight:1.5}}>{f}</span>
          </div>)}
        </div>
        <div style={{borderTop:`1px solid ${G.line}`,paddingTop:14,marginBottom:16}} id="r">
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <Stars s={14}/><b style={{fontSize:14,color:G.fg1}}>4.7</b><span style={{fontSize:12,color:G.fg4}}>258 reviews</span>
          </div>
          {REVIEWS.slice(0,2).map(r => <div key={r.n} style={{borderTop:`1px solid ${G.line}`,padding:'10px 0'}}>
            <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:4}}>
              <Stars s={11}/><b style={{fontSize:12,fontWeight:600,color:G.fg1}}>{r.n}</b>
              <span style={{fontSize:10.5,color:A.succText,background:A.succBg,border:`1px solid ${A.succBd}`,borderRadius:4,padding:'1px 5px',fontWeight:600}}>Verified</span>
            </div>
            <p style={{fontSize:12.5,color:G.fg2,lineHeight:1.5,margin:0}}>{r.q}</p>
          </div>)}
        </div>
        <Faq items={OBJ5.slice(0,4)} open={-1}/>
        <div style={{marginTop:16,marginBottom:8}}><BodyChips/></div>
      </div>
    </div>

    <div style={{position:'absolute',left:0,right:0,bottom:0,height:108,background:'#fff',borderTop:`1px solid ${G.line}`,boxShadow:'0 -4px 12px rgba(0,0,0,.06)',padding:'10px 16px',boxSizing:'border-box',zIndex:10}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:7}}>
        <div>
          <div style={{fontSize:19,fontWeight:800,letterSpacing:'-.02em',color:G.fg1,lineHeight:1.1}}>{M5(unit)}</div>
          <div style={{fontSize:11,color:G.fg4}}>or {M5(unit/12)}/mth · {courseOpt==='both'&&bundle==='premium'?'free resit':'no resit cover'}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:11,color:G.fg4,lineHeight:1.2}}>{cell?'Result by':'Result'}</div>
          <div style={{fontSize:12.5,fontWeight:700,color:A.succText,lineHeight:1.2}}>{cell?cell.res:`${invig==='remote'?'2–6':'6–16'} days`}</div>
        </div>
      </div>
      <button disabled={needsDate} style={{width:'100%',height:44,borderRadius:999,border:'none',background:needsDate?G.fg5:G.pri,color:'#fff',fontFamily:'inherit',fontSize:15.5,fontWeight:700,cursor:needsDate?'not-allowed':'pointer'}}>{needsDate?'Choose a sitting first':'Add to basket'}</button>
    </div>
  </div>;
}

Object.assign(window, { MobileC8A, MStepRow, MMonthGrid });
