const { packages: P4, money: M4, objections: OBJ4 } = window.PFS;

// C8-A — C8's skeleton, with every selection kept in the shape the live page
// already renders. Verified against the repo: the buy box is a WooCommerce
// Composite Product (`composite_form`, navigation_style 'single'), so each step
// is a composite COMPONENT — not a variation attribute — and the options are
// already radio buttons in a segmented row via mme-core's override of
// single-product/js/options-radio-buttons.php (note its own
// `first-of-type rounded-left` / `last-of-type rounded-right` classes).
// Each component resolves to a separate product carrying `_aem_product_type`
// (exam / invigilation-type / exam-date / book-later-date / course / fasttrack),
// which is why the basket ends up with several line items.
// Selected fill is #0F8610 (the dark end of the ramp) so 14.5px white text
// clears AA at 4.62:1 — the bright primary cannot carry text this size.

const INVIG = [
  { id:'remote', label:'Online Remote Invigilation', board:'TQUK', turn:'Results in 2–6 working days', note:'Sit it any time, day or night. Your session is recorded and reviewed afterwards.' },
  { id:'human',  label:'Online Human Invigilation',  board:'Open Awards', turn:'Results in 6–16 working days', note:'A person walks you through setup and stays on the call. Fixed appointment times.' }
];
const COURSE_OPT = [{ id:'exam', label:'Exam Only' },{ id:'both', label:'Exam & Course', flag:'Most popular' }];
const BUNDLES = [
  { id:'basic', label:'Basic Bundle', add:184, desc:'Exam + 3 months of course access' },
  { id:'premium', label:'Premium Bundle', add:284, desc:'Exam + 12 months + free resit included', flag:'Most popular' }
];

// Selection style matches the rest of the system: outlined, not filled — a 2px
// brand border with the pale tint behind it, so #116A12 text sits on #F0FEEF
// (very high contrast) and the bright primary is never asked to carry text.
function StepRow({ num, label, help, options, value, onPick, disabled, cols }) {
  const hasFlag = options.some(o => o.flag);
  return <div style={{marginBottom:18,opacity:disabled?.5:1,pointerEvents:disabled?'none':'auto'}}>
    <p style={{fontSize:13.5,fontWeight:700,color:G.fg1,margin:'0 0 3px'}}><span style={{color:G.fg4,fontWeight:600,marginRight:6}}>{num}</span>{label}</p>
    {help && <p style={{fontSize:12.5,color:G.fg4,margin:'0 0 9px',lineHeight:1.45}}>{help}</p>}
    <div style={{display:'grid',gridTemplateColumns:`repeat(${cols||options.length},1fr)`,gap:8,paddingTop:hasFlag?9:0}}>
      {options.map(o => { const on = value===o.id; return <button key={o.id} onClick={()=>onPick(o.id)} aria-pressed={on}
        style={{position:'relative',border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:10,padding:on?'11px 13px':'12px 14px',background:on?G.priBg:'#fff',cursor:'pointer',fontFamily:'inherit',textAlign:'center',transition:'border-color .15s,background .15s'}}>
        {o.flag && <span style={{position:'absolute',top:-9,left:'50%',transform:'translateX(-50%)',background:G.pri,color:'#fff',fontSize:10,fontWeight:700,letterSpacing:'.05em',textTransform:'uppercase',padding:'2px 9px',borderRadius:999,whiteSpace:'nowrap'}}>{o.flag}</span>}
        <span style={{display:'block',fontSize:14.5,fontWeight:on?700:500,color:on?G.priDD:G.fg2,lineHeight:1.3}}>{o.label}</span>
        {o.sub && <span style={{display:'block',fontSize:12,color:on?G.priDD:G.fg4,marginTop:3,opacity:on?.85:1}}>{o.sub}</span>}
      </button>; })}
    </div>
  </div>;
}

function BuyBox8A() {
  const [invig,setInvig] = React.useState('remote');
  const [dateMode,setDateMode] = React.useState('later');
  const [day,setDay] = React.useState(null);
  const [courseOpt,setCourseOpt] = React.useState('both');
  const [bundle,setBundle] = React.useState('premium');
  const [learners,setLearners] = React.useState(1);

  const inv = INVIG.find(i => i.id===invig);
  const cell = dateMode==='now' && day ? MONTH.find(m => m.d===day) : null;
  const dateAdd = cell ? cell.price - 157.60 : 0;
  // Each package carries its own RRP/now pair in pfs-data.js (a consistent 20%).
  // Deriving `was` from the delta instead would pin the saving at £39.40.
  const pkgId = courseOpt==='exam' ? 'exam' : bundle==='basic' ? 'course' : 'premium';
  const pkg = P4.find(p => p.id===pkgId);
  const unit = pkg.now + dateAdd;
  const total = unit * learners;
  const was = pkg.was + dateAdd;
  const needsDate = dateMode==='now' && !day;
  const resultDays = invig==='remote' ? '2–6 working days' : '6–16 working days';

  return <div>
    <div style={{display:'grid',gridTemplateColumns:'64px 300px minmax(0,1fr) 372px',gap:28,alignItems:'start'}}>

      <div style={{display:'grid',gap:8}}>
        {[0,1,2,3,4].map(i => <div key={i} style={{height:56,borderRadius:6,border:`${i===0?2:1}px solid ${i===0?G.pri:G.line}`,background:`repeating-linear-gradient(135deg,${G.sunk} 0 6px,#F1F3F6 6px 12px)`}}/>)}
        <div style={{height:56,borderRadius:6,border:`1px solid ${A.infoBd}`,background:A.infoBg,display:'grid',placeItems:'center'}}><Play s={14} c="#1A56DB"/></div>
      </div>

      <div>
        <Placeholder h={300} label="exam at home" r={8}/>
        <p style={{fontSize:11.5,color:G.fg5,margin:'10px 0 0',textAlign:'center'}}>Roll over to zoom · 6 images and 1 video</p>
      </div>

      <div>
        <h1 style={{fontSize:26,fontWeight:600,letterSpacing:'-.015em',lineHeight:1.25,margin:'0 0 6px',color:G.fg1}}>Functional Skills Maths Level 2 — Ofqual-regulated exam, sat at home</h1>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
          <Stars s={15}/>
          <a href="#reviews-a" style={{fontSize:13.5,textDecoration:'none'}}>4.7 · 258 ratings</a>
          <span style={{color:G.fg5}}>|</span>
          <a href="#questions-a" style={{fontSize:13.5,textDecoration:'none'}}>Ask a question</a>
        </div>
        <p style={{fontSize:12.5,color:G.fg4,margin:'0 0 14px'}}>Awarded by {inv.board} · 5,399 sittings to date</p>

        <div style={{borderTop:`1px solid ${G.line}`,borderBottom:`1px solid ${G.line}`,padding:'14px 0',marginBottom:18}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
            <span style={{fontSize:15,color:G.dang,fontWeight:600,paddingBottom:6}}>-{Math.round((1-unit/was)*100)}%</span>
            <span style={{fontSize:34,fontWeight:700,letterSpacing:'-.025em',lineHeight:1,color:G.fg1}}>{M4(unit)}</span>
          </div>
          <p style={{fontSize:12.5,color:G.fg4,margin:'6px 0 0'}}>RRP <span style={{textDecoration:'line-through'}}>{M4(was)}</span> · you save {M4(was-unit)} · from {M4(unit/12)}/month with Klarna</p>
        </div>

        <StepRow num="1" label="Choose invigilation style" value={invig} onPick={setInvig}
          options={INVIG.map(i => ({ id:i.id, label:i.label, sub:i.turn }))}/>
        <div style={{background:A.infoBg,border:`1px solid ${A.infoBd}`,borderRadius:10,padding:'11px 13px',margin:'-6px 0 18px',display:'grid',gridTemplateColumns:'16px 1fr',gap:10}}>
          <span style={{marginTop:1}}><Clock s={15} c="#1A56DB"/></span>
          <p style={{fontSize:12.5,color:'#1E429F',margin:0,lineHeight:1.5}}>{inv.note} Awarded by {inv.board}.</p>
        </div>

        <StepRow num="2" label="Choose date" value={dateMode} onPick={m=>{setDateMode(m); if(m==='later') setDay(null);}}
          options={[{ id:'later', label:'Choose date later', sub:'Book now, decide within 12 months' },{ id:'now', label:'Choose date now', sub:'Pick from the calendar' }]}/>
        {dateMode==='now' && <div style={{margin:'-4px 0 18px'}}>
          <MonthGrid value={day} onPick={setDay}/>
          {needsDate && <p style={{fontSize:12.5,color:G.dang,fontWeight:600,margin:'9px 0 0'}}>Choose a sitting to see your price and result date.</p>}
        </div>}

        <StepRow num="3" label="Choose course option" value={courseOpt} onPick={setCourseOpt} options={COURSE_OPT}
          help="93% of learners who complete the course pass, measured across 5,399 sittings. Exam only is for people already prepared."/>

        <StepRow num="4" label="Choose course bundle option" value={courseOpt==='both'?bundle:null} onPick={setBundle}
          disabled={courseOpt!=='both'}
          help={courseOpt==='both' ? 'Premium adds 12 months instead of 3, and a free resit if you don\'t pass.' : 'Available once you add the course.'}
          options={BUNDLES.map(b => ({ id:b.id, label:b.label, sub:`+${M4(b.add)} · ${b.desc}`, flag:b.flag }))}/>

        <p style={{fontSize:14.5,fontWeight:700,color:G.fg1,margin:'20px 0 9px'}}>About this exam</p>
        <div style={{display:'grid',gap:7}}>
          {FEATURES.slice(0,6).map(f => <div key={f} style={{display:'grid',gridTemplateColumns:'16px 1fr',gap:9,alignItems:'start'}}>
            <span style={{marginTop:6,width:5,height:5,borderRadius:999,background:G.fg4}}/>
            <span style={{fontSize:13.5,color:G.fg2,lineHeight:1.5}}>{f}</span>
          </div>)}
        </div>
      </div>

      <div style={{display:'grid',gap:12}}>
        <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:'18px 20px',background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
          <div style={{fontSize:28,fontWeight:700,letterSpacing:'-.025em',color:G.fg1,lineHeight:1.1}}>{M4(unit)}</div>
          <p style={{fontSize:12.5,color:G.fg4,margin:'3px 0 14px'}}>or {M4(unit/12)}/month with Klarna, Clearpay or Payl8r</p>

          <div style={{background:G.sunk,borderRadius:8,padding:'11px 13px',marginBottom:14}}>
            <p style={{fontSize:13,color:G.fg2,margin:'0 0 3px',lineHeight:1.45}}>Sitting <b style={{fontWeight:700,color:G.fg1}}>{cell ? `${cell.d} September` : dateMode==='now' ? 'not chosen yet' : 'chosen later'}</b></p>
            <p style={{fontSize:14,color:A.succText,margin:0,fontWeight:700}}>{cell ? `Result by ${cell.res}` : `Result ${resultDays} after you sit it`}</p>
          </div>

          <p style={{fontSize:14.5,fontWeight:700,color:A.succText,margin:'0 0 3px'}}>In stock</p>
          <p style={{fontSize:12.5,color:A.amber,margin:'0 0 14px',fontWeight:600}}>Only 8 places left at this price</p>

          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <label style={{fontSize:13,color:G.fg3}}>Learners</label>
            <select value={learners} onChange={e=>setLearners(+e.target.value)} style={{fontFamily:'inherit',fontSize:13.5,padding:'7px 10px',borderRadius:8,border:`1px solid ${G.line}`,background:'#fff',color:G.fg1}}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {learners>1 && <span style={{fontSize:13,color:G.fg3}}>Total <b style={{color:G.fg1,fontWeight:700}}>{M4(total)}</b></span>}
          </div>

          <button disabled={needsDate} style={{width:'100%',height:46,borderRadius:999,border:'none',background:needsDate?G.fg5:G.pri,color:'#fff',fontFamily:'inherit',fontSize:15.5,fontWeight:700,cursor:needsDate?'not-allowed':'pointer',marginBottom:9}}>{needsDate?'Choose a sitting first':'Add to basket'}</button>
          <button style={{width:'100%',height:46,borderRadius:999,border:`1px solid ${G.line}`,background:'#fff',fontFamily:'inherit',fontSize:15,fontWeight:600,color:G.fg1,cursor:'pointer',marginBottom:14}}>Book with a £29 deposit</button>

          <div style={{borderTop:`1px solid ${G.line}`,paddingTop:8}}>
            <RailRow label="Exam centre" value="Pass Functional Skills" strong/>
            <RailRow label="Awarded by" value={inv.board}/>
            <RailRow label="Invigilation" value={invig==='remote'?'Remote, any time':'Live, by appointment'}/>
            <RailRow label="Resit" value={courseOpt==='both'&&bundle==='premium'?'Free if you don\'t pass':'£157.60'} strong={courseOpt==='both'&&bundle==='premium'}/>
            <RailRow label="Exam pack" value="Included (£119.99)"/>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginTop:12,paddingTop:12,borderTop:`1px solid ${G.line}`,fontSize:12,color:G.fg4}}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={A.succ} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Secure transaction
          </div>
        </div>
        <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:'14px 18px',background:'#fff'}}>
          <p style={{fontSize:13.5,fontWeight:700,color:G.fg1,margin:'0 0 8px'}}>Buying for a learner?</p>
          <p style={{fontSize:12.5,color:G.fg4,margin:'0 0 10px',lineHeight:1.5}}>Order in their name and we'll send their login straight to them.</p>
          <PayMarks/>
        </div>
        <CallPanel tone="plain"/>
      </div>
    </div>

    <div style={{marginTop:34,paddingTop:26,borderTop:`1px solid ${G.line}`}}>
      <div style={{display:'grid',gridTemplateColumns:'minmax(0,1fr) 440px',gap:44,alignItems:'start'}}>
        <div>
          <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:'0 0 14px',color:G.fg1}} id="reviews-a">Reviews</h2>
          <ReviewDistribution/>
        </div>
        <div>
          <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:'0 0 14px',color:G.fg1}} id="questions-a">Questions</h2>
          <Faq items={OBJ4.slice(0,5)} open={-1}/>
        </div>
      </div>
    </div>
  </div>;
}

Object.assign(window, { BuyBox8A, StepRow, INVIG, BUNDLES });
