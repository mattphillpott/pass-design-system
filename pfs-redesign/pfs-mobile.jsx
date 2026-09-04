const { packages: MPKG, fastTrack: MFT, money: MM } = window.PFS;

function Sheet({ open, onClose, title, children, footer }) {
  return <div style={{position:'absolute',inset:0,pointerEvents:open?'auto':'none',zIndex:20}}>
    <div onClick={onClose} style={{position:'absolute',inset:0,background:'rgba(17,24,39,.5)',backdropFilter:'blur(4px)',opacity:open?1:0,transition:'opacity .3s cubic-bezier(.4,0,.2,1)'}}/>
    <div style={{position:'absolute',left:0,right:0,bottom:0,top:52,background:'#fff',borderRadius:'16px 16px 0 0',display:'flex',flexDirection:'column',
      transform:open?'translateY(0)':'translateY(100%)',transition:'transform .3s cubic-bezier(.4,0,.2,1)',overflow:'hidden'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'14px 16px',borderBottom:`1px solid ${G.line}`,flex:'none'}}>
        <b style={{fontSize:16,fontWeight:700,color:G.fg1}}>{title}</b>
        <button onClick={onClose} aria-label="Close" style={{width:36,height:36,borderRadius:999,border:'none',background:G.sunk,display:'grid',placeItems:'center',cursor:'pointer'}}><XIcon s={18} c={G.fg3}/></button>
      </div>
      <div style={{flex:1,overflow:'auto',padding:16}}>{children}</div>
      {footer && <div style={{flex:'none',borderTop:`1px solid ${G.line}`,padding:'12px 16px 16px',background:'#fff'}}>{footer}</div>}
    </div>
  </div>;
}

function MobileFrame({ variant = 1 }) {
  const plan = usePlan();
  const [open,setOpen] = React.useState(false);
  const [dl,setDl] = React.useState(null);
  const pickDl = d => { setDl(d.id); plan.setPkg(d.pkg); plan.setSlot(d.slot); plan.setFt(d.ft); };
  const head = variant === 2
    ? 'Pass Level 2 maths — or sit it again, free'
    : 'Functional Skills Maths Level 2';
  const bullets = variant === 2
    ? [['93% pass rate','Across 5,399 sittings of this exam'],['Free resit included','You cannot lose the fee'],['Sat at home','No exam centre, no travel']]
    : variant === 3
    ? [['Results in 2–6 working days','Fast Track guarantees 2 days'],['Sat at home, any weekday','Choose your date now or later'],['93% pass rate','Across 5,399 sittings']]
    : [['Ofqual regulated','GCSE grade 4/C equivalent'],['Sat at home','No exam centre, no travel'],['93% pass rate','Across 5,399 sittings']];

  return <div style={{position:'relative',width:390,height:844,background:'#fff',overflow:'hidden',fontFamily:'Inter,system-ui,sans-serif'}}>
    <div style={{height:52,background:'#fff',borderBottom:`1px solid ${G.line}`,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 16px'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:7}}>
        <Wordmark h={17}/>
        <span style={{fontWeight:500,fontSize:13,color:G.fg3}}>Functional Skills</span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:14}}><Phone c={G.pri}/><span style={{fontSize:20,color:G.fg2,lineHeight:1}}>≡</span></div>
    </div>

    <div style={{height:792 - 76,overflow:'auto',padding:'0 0 20px'}}>
      <div style={{padding:16}}><Placeholder h={180} label="learner sitting the exam at home"/></div>
      <div style={{padding:'0 16px'}}>
        <TrustLine/>
        <h1 style={{fontSize:24,fontWeight:800,letterSpacing:'-.02em',lineHeight:1.18,margin:'8px 0 10px',color:G.fg1,textWrap:'pretty'}}>{head}</h1>
        <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:14}}>
          <span style={{fontSize:15,color:G.fg4}}>from</span>
          <span style={{fontSize:26,fontWeight:800,letterSpacing:'-.02em',color:G.fg1}}>£157.60</span>
          <span style={{fontSize:14,color:G.fg5,textDecoration:'line-through'}}>£197.00</span>
        </div>
        <div style={{display:'grid',gap:11,marginBottom:16}}>
          {bullets.map(([t,d]) => <div key={t} style={{display:'grid',gridTemplateColumns:'18px 1fr',gap:10,alignItems:'start'}}>
            <span style={{marginTop:2}}><Check/></span>
            <div><b style={{fontSize:14,fontWeight:600,color:G.fg1,display:'block'}}>{t}</b><span style={{fontSize:12.5,color:G.fg4,lineHeight:1.4}}>{d}</span></div>
          </div>)}
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,fontSize:12.5,color:G.warn,fontWeight:600,marginBottom:18}}><Clock/> 8 places left · offer ends Fri 28 Aug</div>
        <div style={{marginBottom:16}}><BodyChips/></div>
        <div style={{borderTop:`1px solid ${G.line}`,paddingTop:16}}>
          <Eyebrow style={{marginBottom:12}}>What people ask before buying</Eyebrow>
          <Faq items={window.PFS.objections.slice(0,4)} open={-1}/>
        </div>
      </div>
    </div>

    <div style={{position:'absolute',left:0,right:0,bottom:0,height:76,background:'#fff',borderTop:`1px solid ${G.line}`,boxShadow:'0 -4px 12px rgba(0,0,0,.06)',display:'flex',alignItems:'center',gap:12,padding:'0 16px',zIndex:10}}>
      <div style={{flex:'none'}}>
        <div style={{fontSize:11.5,color:G.fg4,lineHeight:1.2}}>{plan.pkg.id==='premium'?'With free resit':plan.pkg.name}</div>
        <div style={{fontSize:20,fontWeight:800,letterSpacing:'-.02em',color:G.fg1,lineHeight:1.2}}>{MM(plan.total)}</div>
      </div>
      <button onClick={()=>setOpen(true)} style={{flex:1,height:50,borderRadius:12,border:'none',background:G.pri,color:'#fff',fontFamily:'inherit',fontSize:16,fontWeight:700,cursor:'pointer'}}>
        {variant===3 ? 'Choose my date' : 'Choose options'}
      </button>
    </div>

    <Sheet open={open} onClose={()=>setOpen(false)}
      title={variant===3 ? 'When do you need it?' : 'Build your booking'}
      footer={<div>
        <button style={{width:100+'%',height:52,borderRadius:12,border:'none',background:G.pri,color:'#fff',fontFamily:'inherit',fontSize:16.5,fontWeight:700,cursor:'pointer'}}>Add to basket · {MM(plan.total)}</button>
        <p style={{textAlign:'center',fontSize:12,color:G.fg4,margin:'8px 0 6px'}}>or from {MM(plan.total/12)}/month</p>
        <div style={{display:'flex',justifyContent:'center'}}><PayMarks/></div>
      </div>}>
      {variant===3 && <div style={{marginBottom:20}}>
        <Eyebrow>1 · When do you need your result?</Eyebrow>
        <div style={{display:'grid',gap:8}}>
          {DEADLINES.map(d => <div key={d.id} onClick={()=>pickDl(d)} style={{display:'grid',gridTemplateColumns:'18px 1fr',gap:11,alignItems:'center',border:`${dl===d.id?2:1}px solid ${dl===d.id?G.pri:G.line}`,borderRadius:10,padding:dl===d.id?'12px 13px':'13px 14px',background:dl===d.id?G.priBg:'#fff'}}>
            <span style={{width:16,height:16,borderRadius:999,border:`${dl===d.id?4.5:1.5}px solid ${dl===d.id?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box'}}/>
            <div><p style={{fontSize:14.5,fontWeight:600,color:G.fg1,margin:0}}>{d.label}</p><p style={{fontSize:12,color:G.fg4,margin:'1px 0 0'}}>{d.sub}</p></div>
          </div>)}
        </div>
      </div>}
      <Eyebrow>{variant===3?'2 · Your package':'1 · What you need'}</Eyebrow>
      <div style={{display:'grid',gap:8,marginBottom:22}}>
        {MPKG.map(p => <div key={p.id} onClick={()=>plan.setPkg(p.id)} style={{position:'relative',display:'grid',gridTemplateColumns:'18px 1fr auto',gap:11,alignItems:'start',border:`${plan.pkgId===p.id?2:1}px solid ${plan.pkgId===p.id?G.pri:G.line}`,borderRadius:12,padding:plan.pkgId===p.id?'13px 14px':'14px 15px',background:'#fff'}}>
          {p.tag && <span style={{position:'absolute',top:-9,right:12,background:G.pri,color:'#fff',fontSize:10,fontWeight:700,textTransform:'uppercase',padding:'2px 8px',borderRadius:999,whiteSpace:'nowrap'}}>{p.tag}</span>}
          <span style={{width:16,height:16,borderRadius:999,border:`${plan.pkgId===p.id?4.5:1.5}px solid ${plan.pkgId===p.id?G.pri:'#D1D5DB'}`,marginTop:2,background:'#fff',boxSizing:'border-box'}}/>
          <div><p style={{fontSize:14.5,fontWeight:700,color:G.fg1,margin:'0 0 2px'}}>{p.name}</p><p style={{fontSize:12,color:G.fg4,margin:0,lineHeight:1.4}}>{p.blurb}</p></div>
          <div style={{textAlign:'right',whiteSpace:'nowrap'}}><div style={{fontSize:11.5,color:G.fg5,textDecoration:'line-through'}}>{MM(p.was)}</div><div style={{fontSize:16,fontWeight:800,color:G.fg1}}>{MM(p.now)}</div></div>
        </div>)}
      </div>
      <Eyebrow>{variant===3?'3 · Your date':'2 · When do you want to sit it?'}</Eyebrow>
      <div style={{display:'grid',gap:8,marginBottom:20}}>
        <div onClick={()=>plan.setSlot(null)} style={{display:'grid',gridTemplateColumns:'18px 1fr auto',gap:11,alignItems:'center',border:`${!plan.slot?2:1}px solid ${!plan.slot?G.pri:G.line}`,borderRadius:10,padding:!plan.slot?'11px 13px':'12px 14px',background:!plan.slot?G.priBg:'#fff'}}>
          <span style={{width:16,height:16,borderRadius:999,border:`${!plan.slot?4.5:1.5}px solid ${!plan.slot?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box'}}/>
          <div><p style={{fontSize:14,fontWeight:600,color:G.fg1,margin:0}}>Decide later</p><p style={{fontSize:11.5,color:G.fg4,margin:'1px 0 0'}}>Pick your date from your account within 12 months</p></div>
          <span style={{fontSize:14,fontWeight:700,color:G.fg1,whiteSpace:'nowrap'}}>£0</span>
        </div>
        {SLOTS.slice(0, variant===3?5:3).map(s => { const on = plan.slotId===s.id; return <div key={s.id} onClick={()=>plan.setSlot(s.id)} style={{display:'grid',gridTemplateColumns:'18px 1fr auto',gap:11,alignItems:'center',border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:10,padding:on?'11px 13px':'12px 14px',background:on?G.priBg:'#fff'}}>
          <span style={{width:16,height:16,borderRadius:999,border:`${on?4.5:1.5}px solid ${on?G.pri:'#D1D5DB'}`,background:'#fff',boxSizing:'border-box'}}/>
          <div><p style={{fontSize:14,fontWeight:600,color:G.fg1,margin:0}}>{s.day} {s.mon}{s.cheapest && <span style={{fontSize:9.5,fontWeight:700,color:G.priDD,background:G.priBg,borderRadius:4,padding:'1px 5px',marginLeft:5}}>CHEAPEST</span>}{s.soonest && <span style={{fontSize:9.5,fontWeight:700,color:A.amber,background:A.amberBg,borderRadius:4,padding:'1px 5px',marginLeft:5}}>SOONEST</span>}</p><p style={{fontSize:11.5,color:G.fg4,margin:'1px 0 0'}}>result by {s.res}</p></div>
          <span style={{fontSize:14,fontWeight:700,color:G.fg1,whiteSpace:'nowrap'}}>+{MM(s.price-157.60)}</span>
        </div>; })}
      </div>
      <div style={{background:G.sunk,border:`1px solid ${G.line}`,borderRadius:12,padding:'14px 16px'}}>
        {[[plan.pkg.name,MM(plan.pkg.now)],['Exam pack','Included'],['Exam date',plan.dateLabel],plan.ft?['Fast Track results','+'+MM(MFT.add)]:null].filter(Boolean).map(([a,b]) => <div key={a} style={{display:'flex',justifyContent:'space-between',fontSize:13,color:G.fg3,padding:'3px 0'}}><span>{a}</span><span style={{color:b==='Included'?G.priDD:G.fg3,fontWeight:b==='Included'?600:400}}>{b}</span></div>)}
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',borderTop:`1px solid ${G.line}`,marginTop:9,paddingTop:10}}>
          <span style={{fontSize:14,fontWeight:600,color:G.fg1}}>Total today</span>
          <span style={{fontSize:24,fontWeight:800,letterSpacing:'-.02em',color:G.fg1}}>{MM(plan.total)}</span>
        </div>
      </div>
    </Sheet>
  </div>;
}

Object.assign(window, { Sheet, MobileFrame });
