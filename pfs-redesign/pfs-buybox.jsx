const { packages: PKG, dates: DATES, fastTrack: FT, money: M, objections: OBJ } = window.PFS;

function usePlan(initPkg = 'premium') {
  const [pkgId,setPkg] = React.useState(initPkg);
  const [slotId,setSlot] = React.useState(null); // null = book now, choose date later
  const [ft,setFt] = React.useState(false);
  const pkg = PKG.find(p => p.id === pkgId);
  const slot = SLOTS.find(s => s.id === slotId) || null;
  const dateAdd = slot ? slot.price - 157.60 : 0;
  const total = pkg.now + dateAdd + (ft ? FT.add : 0);
  const dateLabel = slot ? `${slot.day} ${slot.mon}` : 'Choose later';
  return { pkgId, setPkg, slotId, setSlot, slot, dateAdd, dateLabel, ft, setFt, pkg, total };
}

function ModeOpt({ on, onPick, t, d, p }) {
  return <div onClick={onPick} role="radio" aria-checked={on} tabIndex={0}
    onKeyDown={e => { if (e.key===' '||e.key==='Enter') { e.preventDefault(); onPick(); } }}
    style={{border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:12,padding:on?'13px 15px':'14px 16px',background:on?G.priBg:'#fff',cursor:'pointer'}}>
    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10,marginBottom:3}}>
      <span style={{display:'flex',alignItems:'center',gap:9}}>
        <span style={{width:18,height:18,borderRadius:999,border:`${on?5:1.5}px solid ${on?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box',flex:'none'}}/>
        <b style={{fontSize:14.5,fontWeight:600,color:G.fg1}}>{t}</b>
      </span>
      <span style={{fontSize:13.5,fontWeight:700,color:on?G.priDD:G.fg3,whiteSpace:'nowrap'}}>{p}</span>
    </div>
    <p style={{fontSize:12.5,color:G.fg4,margin:0,lineHeight:1.45,paddingLeft:27}}>{d}</p>
  </div>;
}

function Title({ sub }) {
  return <div style={{marginBottom:20}}>
    <TrustLine/>
    <h1 style={{fontSize:34,fontWeight:800,letterSpacing:'-.025em',lineHeight:1.12,margin:'10px 0 10px',color:G.fg1}}>Functional Skills Maths Level 2</h1>
    <p style={{fontSize:15.5,color:G.fg3,lineHeight:1.6,margin:0,textWrap:'pretty'}}>{sub}</p>
  </div>;
}

function DateStep({ plan, num = 2 }) {
  const [mode,setMode] = React.useState(plan.slot ? 'now' : 'later');
  return <div>
    <Eyebrow>{num} · When do you want to sit it?</Eyebrow>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:mode==='now'?10:0}}>
      <ModeOpt on={mode==='later'} onPick={()=>{setMode('later');plan.setSlot(null);}} t="Decide later" p="£0" d="Book today, choose your date any time in the next 12 months."/>
      <ModeOpt on={mode==='now'} onPick={()=>{setMode('now'); if(!plan.slot) plan.setSlot('d29');}} t="Pick a date now" p="from +£58" d="Six sittings in the next three weeks."/>
    </div>
    {mode==='now' && <DatePanel value={plan.slotId} onPick={plan.setSlot}/>}
    {mode==='later' && <p style={{fontSize:12.5,color:G.fg4,margin:'10px 0 0',lineHeight:1.5}}>Most people choose later. You book the exam now and pick the date from your account once your learner details are in — no extra cost, no deadline.</p>}
  </div>;
}

// ── Concept 1 — Straight answer ────────────────────────────────────────────
function BuyBox1() {
  const plan = usePlan();
  return <div>
    <Title sub="Ofqual-regulated and GCSE grade 4/C equivalent. Sat at home, with no exam centre and no travel. Two choices and you're done."/>
    <Eyebrow>1 · Choose what you need</Eyebrow>
    <div style={{display:'grid',gap:10,marginBottom:26}}>
      {PKG.map(p => <PkgRow key={p.id} p={p} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)}/>)}
    </div>
    <div style={{marginBottom:26}}><DateStep plan={plan}/></div>
    <div style={{marginBottom:12}}>
      <TotalBlock total={plan.total} rows={[[plan.pkg.name,M(plan.pkg.now)],['Exam pack (worth £119.99)','Included'],['Exam date',plan.dateLabel]]}/>
    </div>
    <Cta label={`Add to basket · ${M(plan.total)}`} sub={`or from ${M(plan.total/12)}/month with Klarna, Clearpay or Payl8r`}/>
    <UrgencyLine/>
    <div style={{borderTop:`1px solid ${G.line}`,marginTop:26,paddingTop:22}}><ProofGrid/></div>
    <div style={{borderTop:`1px solid ${G.line}`,marginTop:20,paddingTop:18}}><BodyChips/></div>
  </div>;
}

// ── Concept 2 — Outcome-led, guarantee first ───────────────────────────────
function BuyBox2() {
  const plan = usePlan();
  const isPrem = plan.pkgId === 'premium';
  return <div>
    <div style={{marginBottom:18}}>
      <TrustLine/>
      <h1 style={{fontSize:34,fontWeight:800,letterSpacing:'-.025em',lineHeight:1.12,margin:'10px 0 10px',color:G.fg1}}>Pass Level 2 maths — or sit it again, free</h1>
      <p style={{fontSize:15.5,color:G.fg3,lineHeight:1.6,margin:0,textWrap:'pretty'}}>Functional Skills Maths Level 2. Ofqual-regulated, GCSE grade 4/C equivalent, sat at home. <b style={{color:G.fg1,fontWeight:600}}>93% of people who complete our course pass</b> — measured across 5,399 sittings, not a marketing figure.</p>
    </div>
    <div style={{display:'flex',gap:10,marginBottom:24}}>
      {[['93%','pass rate'],['5,399','sittings measured'],['2–6 days','to your result']].map(([n,l]) => <div key={l} style={{flex:1,border:`1px solid ${G.line}`,borderRadius:10,padding:'12px 14px',background:'#fff'}}>
        <div style={{fontSize:22,fontWeight:800,letterSpacing:'-.02em',color:G.fg1,lineHeight:1.1}}>{n}</div>
        <div style={{fontSize:12,color:G.fg4,marginTop:2}}>{l}</div>
      </div>)}
    </div>
    <Eyebrow>1 · How much support do you want?</Eyebrow>
    <div style={{display:'grid',gap:10,marginBottom:16}}>
      {PKG.map(p => <PkgRow key={p.id} p={p} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)}/>)}
    </div>
    <div style={{border:`1px solid ${isPrem?G.priBd:G.line}`,background:isPrem?G.priBg:G.sunk,borderRadius:12,padding:'16px 18px',marginBottom:26,display:'grid',gridTemplateColumns:'20px 1fr',gap:12,alignItems:'start'}}>
      <span style={{marginTop:2}}><Check s={20} c={isPrem?G.priDD:G.fg4}/></span>
      <div>
        <p style={{fontSize:14.5,fontWeight:700,color:isPrem?G.priDD:G.fg2,margin:'0 0 3px'}}>{isPrem ? 'Free resit included — you cannot lose the fee' : 'No free resit on this package'}</p>
        <p style={{fontSize:13,color:isPrem?G.priDD:G.fg4,margin:0,lineHeight:1.5,opacity:isPrem?.9:1}}>{isPrem ? 'If you do not pass first time, your second exam costs nothing. 7% of learners use it; the other 93% never need to.' : 'A resit would be charged at £157.60. Upgrading costs £100 and removes that risk entirely.'}</p>
      </div>
    </div>
    <div style={{marginBottom:26}}><DateStep plan={plan}/></div>
    <div style={{marginBottom:12}}><TotalBlock total={plan.total} rows={[[plan.pkg.name,M(plan.pkg.now)],['Exam pack (worth £119.99)','Included'],[isPrem?'Free resit':'Resit cover',isPrem?'Included':'Not included']]}/></div>
    <Cta label={`Add to basket · ${M(plan.total)}`} sub={`or from ${M(plan.total/12)}/month with Klarna, Clearpay or Payl8r`}/>
    <UrgencyLine/>
    <div style={{marginTop:22,display:'grid',gap:10}}>
      <Testimonial name="Dan H." line="Passed after failing GCSE twice" quote="I hadn't done maths in eighteen years. The course started where I actually was, not where they assumed I was."/>
      <Testimonial name="Priya S." line="Nursing applicant, Sheffield" quote="Sat it on a Tuesday, had the certificate the following Monday. The trust accepted it without a question."/>
    </div>
    <div style={{borderTop:`1px solid ${G.line}`,marginTop:22,paddingTop:18}}><BodyChips/></div>
  </div>;
}

// ── Concept 3 — Deadline-led ───────────────────────────────────────────────
const DEADLINES = [
  { id:'soon', label:'Within 2 weeks', sub:'A course start, an offer or an employer deadline', pkg:'premium', slot:'d25', ft:true },
  { id:'month', label:'Within a month or two', sub:'Time to prepare properly, but not open-ended', pkg:'premium', slot:null, ft:false },
  { id:'none', label:'No fixed deadline', sub:'I want to pass, whenever I am ready', pkg:'course', slot:null, ft:false }
];
function BuyBox3() {
  const [dl,setDl] = React.useState(null);
  const plan = usePlan('premium');
  const pick = d => { setDl(d.id); plan.setPkg(d.pkg); plan.setSlot(d.slot); plan.setFt(d.ft); };
  return <div>
    <Title sub="Ofqual-regulated, GCSE grade 4/C equivalent, sat at home. Tell us when you need the result and we will assemble the right option — the deadline is what everything else follows from."/>
    <Eyebrow>1 · When do you need your result?</Eyebrow>
    <div style={{display:'grid',gap:8,marginBottom:dl?22:26}}>
      {DEADLINES.map(d => <div key={d.id} onClick={()=>pick(d)} tabIndex={0} role="radio" aria-checked={dl===d.id}
        onKeyDown={e => { if (e.key===' '||e.key==='Enter') { e.preventDefault(); pick(d); } }}
        style={{display:'grid',gridTemplateColumns:'20px 1fr',gap:12,alignItems:'center',border:`${dl===d.id?2:1}px solid ${dl===d.id?G.pri:G.line}`,borderRadius:12,padding:dl===d.id?'15px 17px':'16px 18px',background:dl===d.id?G.priBg:'#fff',cursor:'pointer'}}>
        <span style={{width:18,height:18,borderRadius:999,border:`${dl===d.id?5:1.5}px solid ${dl===d.id?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box'}}/>
        <div><p style={{fontSize:15.5,fontWeight:600,color:G.fg1,margin:0}}>{d.label}</p><p style={{fontSize:13,color:G.fg4,margin:'2px 0 0'}}>{d.sub}</p></div>
      </div>)}
    </div>
    {!dl && <div style={{border:`1px dashed ${G.line}`,borderRadius:12,padding:'28px 20px',textAlign:'center',background:G.sunk}}>
      <p style={{fontSize:14,color:G.fg4,margin:0,lineHeight:1.6}}>Pick a timescale and we will show you one option, one price, and the date your result would land.</p>
    </div>}
    {dl && <div>
      <div style={{border:`2px solid ${G.pri}`,borderRadius:14,overflow:'hidden',boxShadow:'0 0 0 4px rgba(15,188,15,.1)',marginBottom:14}}>
        <div style={{background:G.priBg,borderBottom:`1px solid ${G.priBd}`,padding:'11px 20px',display:'flex',alignItems:'center',gap:8}}>
          <Check s={15} c={G.priDD}/><b style={{fontSize:12.5,fontWeight:700,color:G.priDD,letterSpacing:'.02em'}}>{dl==='soon'?'FASTEST ROUTE TO A CERTIFICATE':dl==='month'?'BEST BALANCE OF TIME AND COST':'MOST ECONOMICAL ROUTE'}</b>
        </div>
        <div style={{padding:20}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:12,marginBottom:4}}>
            <span style={{fontSize:42,fontWeight:800,letterSpacing:'-.03em',lineHeight:1,color:G.fg1}}>{M(plan.total)}</span>
            <span style={{fontSize:17,color:G.fg5,textDecoration:'line-through',paddingBottom:5}}>{M(plan.pkg.was + plan.dateAdd + (plan.ft?FT.add:0))}</span>
          </div>
          <p style={{fontSize:13.5,color:G.fg4,margin:'0 0 18px'}}>or from {M(plan.total/12)}/month with Klarna, Clearpay or Payl8r</p>
          <div style={{display:'grid',gap:9,marginBottom:18}}>
            {[[plan.pkg.name,plan.pkg.blurb],[plan.slot?`Exam date: ${plan.slot.day} ${plan.slot.mon}`:'Date: choose later',plan.slot?`Remote invigilation · result by ${plan.slot.res}`:'Book today, pick your date any time in the next 12 months'],plan.ft?['Fast Track results','Marked in 2 working days — your result lands before your deadline']:['Standard results','2–6 working days after you sit it']].map(([t,d]) => <div key={t} style={{display:'grid',gridTemplateColumns:'18px 1fr',gap:11,alignItems:'start'}}>
              <span style={{marginTop:3}}><Check/></span><div><b style={{fontSize:14,fontWeight:600,color:G.fg1}}>{t}</b><span style={{display:'block',fontSize:12.5,color:G.fg4,lineHeight:1.45}}>{d}</span></div>
            </div>)}
          </div>
          {dl==='soon' && <div style={{background:G.warnBg,border:'1px solid #FED7AA',borderRadius:10,padding:'12px 14px',marginBottom:16,fontSize:13,color:'#9A3412',lineHeight:1.5}}>
            <b>Sit it Tue 25 Aug, certificate by 1 Sep.</b> That is the last sitting that clears before September course starts.
          </div>}
          <Cta label={`Add to basket · ${M(plan.total)}`}/>
          <UrgencyLine/>
        </div>
      </div>
      <button onClick={()=>setDl(null)} style={{width:'100%',background:'none',border:'none',fontFamily:'inherit',fontSize:14,fontWeight:600,color:G.fg3,textDecoration:'underline',cursor:'pointer',padding:'6px 0 18px'}}>Change my timescale or build it myself</button>
    </div>}
    <div style={{borderTop:`1px solid ${G.line}`,paddingTop:22}}><ProofGrid/></div>
    <div style={{borderTop:`1px solid ${G.line}`,marginTop:20,paddingTop:18}}><BodyChips/></div>
  </div>;
}

// ── Concept 4 — Assisted ───────────────────────────────────────────────────
function BuyBox4() {
  const plan = usePlan();
  const [helper,setHelper] = React.useState(false);
  const [ans,setAns] = React.useState({});
  const rec = ans.q1 && ans.q2 ? (ans.q1==='recent' && ans.q2==='confident' ? 'exam' : ans.q1==='years' || ans.q2==='nervous' ? 'premium' : 'course') : null;
  return <div>
    <Title sub="Ofqual-regulated, GCSE grade 4/C equivalent, sat at home. If you are not sure which option you need, take thirty seconds to check — or talk to a course adviser before you spend anything."/>
    <div style={{border:`1px solid ${G.line}`,borderRadius:12,background:G.sunk,padding:helper?20:'14px 18px',marginBottom:22}}>
      {!helper && <button onClick={()=>setHelper(true)} style={{display:'flex',alignItems:'center',justifyContent:'space-between',width:'100%',background:'none',border:'none',fontFamily:'inherit',cursor:'pointer',padding:0,textAlign:'left'}}>
        <span><b style={{fontSize:14.5,fontWeight:600,color:G.fg1,display:'block'}}>Not sure whether you need the course?</b><span style={{fontSize:13,color:G.fg4}}>Two questions, thirty seconds.</span></span>
        <Chevron dir="right" c={G.fg4}/>
      </button>}
      {helper && <div>
        <p style={{fontSize:14.5,fontWeight:600,color:G.fg1,margin:'0 0 12px'}}>When did you last study maths?</p>
        <div style={{display:'flex',gap:8,marginBottom:18}}>
          {[['recent','In the last 2 years'],['years','More than 2 years ago']].map(([v,l]) => <button key={v} onClick={()=>setAns({...ans,q1:v})} style={{flex:1,padding:'11px 12px',borderRadius:10,border:`${ans.q1===v?2:1}px solid ${ans.q1===v?G.pri:G.line}`,background:ans.q1===v?G.priBg:'#fff',fontFamily:'inherit',fontSize:13.5,fontWeight:600,color:ans.q1===v?G.priDD:G.fg2,cursor:'pointer'}}>{l}</button>)}
        </div>
        <p style={{fontSize:14.5,fontWeight:600,color:G.fg1,margin:'0 0 12px'}}>How do you feel about sitting it right now?</p>
        <div style={{display:'flex',gap:8}}>
          {[['confident','I could pass today'],['nervous','I need to prepare']].map(([v,l]) => <button key={v} onClick={()=>setAns({...ans,q2:v})} style={{flex:1,padding:'11px 12px',borderRadius:10,border:`${ans.q2===v?2:1}px solid ${ans.q2===v?G.pri:G.line}`,background:ans.q2===v?G.priBg:'#fff',fontFamily:'inherit',fontSize:13.5,fontWeight:600,color:ans.q2===v?G.priDD:G.fg2,cursor:'pointer'}}>{l}</button>)}
        </div>
        {rec && <div style={{marginTop:16,paddingTop:16,borderTop:`1px solid ${G.line}`}}>
          <p style={{fontSize:13.5,color:G.fg2,margin:'0 0 10px',lineHeight:1.55}}>Based on that, we would put you on <b>{PKG.find(p=>p.id===rec).name}</b>. {rec==='premium'?'The free resit matters most for people in your position.':rec==='exam'?'You do not need to pay for a course you would not use.':'Three months is enough to close the gap.'}</p>
          <button onClick={()=>{plan.setPkg(rec);setHelper(false);}} style={{padding:'9px 16px',borderRadius:10,border:'none',background:G.pri,color:'#fff',fontFamily:'inherit',fontSize:13.5,fontWeight:600,cursor:'pointer'}}>Select that option</button>
        </div>}
      </div>}
    </div>
    <Eyebrow>1 · Choose what you need</Eyebrow>
    <div style={{display:'grid',gap:10,marginBottom:26}}>
      {PKG.map(p => <PkgRow key={p.id} p={p} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)} compact/>)}
    </div>
    <div style={{marginBottom:26}}><DateStep plan={plan}/></div>
    <div style={{marginBottom:12}}><TotalBlock total={plan.total} rows={[[plan.pkg.name,M(plan.pkg.now)],['Exam pack (worth £119.99)','Included'],['Exam date',plan.dateLabel]]}/></div>
    <Cta label={`Add to basket · ${M(plan.total)}`} sub={`or from ${M(plan.total/12)}/month with Klarna, Clearpay or Payl8r`}/>
    <UrgencyLine/>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginTop:22}}>
      <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:'14px 16px',background:'#fff'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><Phone c={G.pri}/><b style={{fontSize:14,fontWeight:600,color:G.fg1}}>Speak to an adviser</b></div>
        <p style={{fontSize:12.5,color:G.fg4,margin:0,lineHeight:1.45}}>020 4574 9155 · open until 8pm. They will tell you if you do not need the course.</p>
      </div>
      <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:'14px 16px',background:'#fff'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}><Clock s={16} c={G.pri}/><b style={{fontSize:14,fontWeight:600,color:G.fg1}}>Ask us to call you</b></div>
        <p style={{fontSize:12.5,color:G.fg4,margin:0,lineHeight:1.45}}>Leave a number and a good time. No sales script, no obligation.</p>
      </div>
    </div>
    <div style={{borderTop:`1px solid ${G.line}`,marginTop:22,paddingTop:20}}><ProofGrid/></div>
    <div style={{marginTop:20}}><Faq items={OBJ.slice(0,3)} open={-1}/></div>
  </div>;
}

Object.assign(window, { usePlan, ModeOpt, Title, DateStep, BuyBox1, BuyBox2, BuyBox3, BuyBox4, DEADLINES });
