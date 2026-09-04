const { packages: P3, fastTrack: FT3, money: M3, objections: OBJ3 } = window.PFS;

// C8 — the conventional e-commerce product page: gallery / details / boxed buy
// rail, with the marketplace furniture mapped onto this product.
// Delivery date -> result date. Stock level -> places on the sitting.
// Free returns -> free resit. Sold by / dispatched from -> exam centre and
// awarding body. Quantity -> number of learners.

function RailRow({ label, value, strong }) {
  return <div style={{display:'flex',justifyContent:'space-between',gap:12,padding:'7px 0',fontSize:13}}>
    <span style={{color:G.fg4}}>{label}</span>
    <span style={{color:strong?G.fg1:G.fg2,fontWeight:strong?600:400,textAlign:'right'}}>{value}</span>
  </div>;
}

function Tile({ on, onPick, top, mid, bot, flag }) {
  return <button onClick={onPick} style={{position:'relative',flex:'none',minWidth:96,border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:10,padding:on?'9px 11px':'10px 12px',background:on?G.priBg:'#fff',cursor:'pointer',fontFamily:'inherit',textAlign:'left'}}>
    {flag && <span style={{position:'absolute',top:-8,right:6,fontSize:8.5,fontWeight:700,color:flag[1],background:flag[2],border:`1px solid ${flag[3]}`,borderRadius:3,padding:'1px 4px'}}>{flag[0]}</span>}
    <div style={{fontSize:12.5,fontWeight:600,color:G.fg1}}>{top}</div>
    <div style={{fontSize:14,fontWeight:800,color:on?G.priDD:G.fg1,letterSpacing:'-.02em',marginTop:1}}>{mid}</div>
    {bot && <div style={{fontSize:10.5,color:G.fg5,marginTop:1}}>{bot}</div>}
  </button>;
}

const DIST = [[5,74],[4,16],[3,5],[2,2],[1,3]];

function ReviewDistribution() {
  return <div style={{display:'grid',gridTemplateColumns:'260px minmax(0,1fr)',gap:36,alignItems:'start'}}>
    <div>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
        <Stars s={17}/><span style={{fontSize:19,fontWeight:700,color:G.fg1}}>4.7</span>
      </div>
      <p style={{fontSize:13,color:G.fg4,margin:'0 0 14px'}}>258 verified reviews on <img src="assets/trustpilot.png" alt="Trustpilot" style={{height:12,display:'inline-block',verticalAlign:'-1px'}}/></p>
      <div style={{display:'grid',gap:6}}>
        {DIST.map(([star,pct]) => <div key={star} style={{display:'grid',gridTemplateColumns:'42px 1fr 34px',gap:9,alignItems:'center'}}>
          <span style={{fontSize:12.5,color:G.fg3}}>{star} star</span>
          <span style={{height:14,background:G.bg,borderRadius:3,overflow:'hidden',border:`1px solid ${G.line}`}}><span style={{display:'block',width:pct+'%',height:'100%',background:star>=4?'#F5A623':G.fg5}}/></span>
          <span style={{fontSize:12,color:G.fg4,textAlign:'right'}}>{pct}%</span>
        </div>)}
      </div>
      <button style={{marginTop:16,width:'100%',height:38,borderRadius:10,border:`1px solid ${G.line}`,background:'#fff',fontFamily:'inherit',fontSize:13.5,fontWeight:600,color:G.fg2,cursor:'pointer'}}>Read all 258 reviews</button>
    </div>
    <div style={{display:'grid',gap:10}}>
      {REVIEWS.map(r => <div key={r.n} style={{borderBottom:`1px solid ${G.line}`,paddingBottom:12}}>
        <div style={{display:'flex',alignItems:'center',gap:9,marginBottom:5}}>
          <Stars s={12}/>
          <b style={{fontSize:13,fontWeight:600,color:G.fg1}}>{r.n}</b>
          <span style={{fontSize:11.5,color:A.succText,background:A.succBg,border:`1px solid ${A.succBd}`,borderRadius:4,padding:'1px 6px',fontWeight:600}}>Verified purchase</span>
        </div>
        <p style={{fontSize:13.5,color:G.fg2,lineHeight:1.55,margin:'0 0 4px'}}>{r.q}</p>
        <p style={{fontSize:11.5,color:G.fg5,margin:0}}>{r.l}</p>
      </div>)}
    </div>
  </div>;
}

function BuyBox8() {
  const plan = usePlan();
  const [learners,setLearners] = React.useState(1);
  const slot = plan.slot || SLOTS[2];
  const dated = !!plan.slot;
  const unit = plan.pkg.now + (dated ? slot.price - 157.60 : 0) + (plan.ft ? FT3.add : 0);
  const total = unit * learners;
  return <div>
    <div style={{display:'grid',gridTemplateColumns:'64px 300px minmax(0,1fr) 372px',gap:28,alignItems:'start'}}>

      <div style={{display:'grid',gap:8}}>
        {['1','2','3','4','5'].map((t,i) => <div key={t} style={{height:56,borderRadius:6,border:`${i===0?2:1}px solid ${i===0?G.pri:G.line}`,background:`repeating-linear-gradient(135deg,${G.sunk} 0 6px,#F1F3F6 6px 12px)`}}/>)}
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
          <a href="#reviews" style={{fontSize:13.5,textDecoration:'none'}}>4.7 · 258 ratings</a>
          <span style={{color:G.fg5}}>|</span>
          <a href="#questions" style={{fontSize:13.5,textDecoration:'none'}}>Ask a question</a>
        </div>
        <p style={{fontSize:12.5,color:G.fg4,margin:'0 0 14px'}}>Awarded by TQUK and Open Awards · 5,399 sittings to date</p>

        <div style={{borderTop:`1px solid ${G.line}`,borderBottom:`1px solid ${G.line}`,padding:'14px 0',marginBottom:16}}>
          <div style={{display:'flex',alignItems:'flex-end',gap:10}}>
            <span style={{fontSize:15,color:G.dang,fontWeight:600,paddingBottom:6}}>-{Math.round((1-plan.pkg.now/plan.pkg.was)*100)}%</span>
            <span style={{fontSize:34,fontWeight:700,letterSpacing:'-.025em',lineHeight:1,color:G.fg1}}>{M3(unit)}</span>
          </div>
          <p style={{fontSize:12.5,color:G.fg4,margin:'6px 0 0'}}>RRP <span style={{textDecoration:'line-through'}}>{M3(plan.pkg.was)}</span> · you save {M3(plan.pkg.was-plan.pkg.now)} · from {M3(unit/12)}/month with Klarna</p>
        </div>

        <p style={{fontSize:13,fontWeight:700,color:G.fg1,margin:'0 0 8px'}}>Package</p>
        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
          {P3.map(p => <Tile key={p.id} on={plan.pkgId===p.id} onPick={()=>plan.setPkg(p.id)}
            top={p.id==='exam'?'Exam only':p.id==='course'?'+ Course':'+ Course & resit'} mid={M3(p.now)}
            bot={p.id==='premium'?'free resit':p.id==='course'?'3 months':'no course'}
            flag={p.recommended?['POPULAR',G.priDD,G.priBg,G.priBd]:null}/>)}
        </div>

        <p style={{fontSize:13,fontWeight:700,color:G.fg1,margin:'0 0 8px'}}>Sitting</p>
        <div style={{display:'flex',gap:8,marginBottom:18,flexWrap:'wrap'}}>
          <Tile on={!dated} onPick={()=>plan.setSlot(null)} top="Decide later" mid="£0" bot="within 12 months"/>
          {SLOTS.slice(0,4).map(s => <Tile key={s.id} on={plan.slotId===s.id} onPick={()=>plan.setSlot(s.id)}
            top={`${s.day} ${s.mon}`} mid={`+${M3(s.price-157.60)}`} bot={`result ${s.res}`}
            flag={s.cheapest?['LOW',G.priDD,G.priBg,G.priBd]:s.soonest?['SOON',A.amber,A.amberBg,A.amberBd]:null}/>)}
        </div>

        <p style={{fontSize:14.5,fontWeight:700,color:G.fg1,margin:'0 0 9px'}}>About this exam</p>
        <div style={{display:'grid',gap:7,marginBottom:16}}>
          {FEATURES.slice(0,6).map(f => <div key={f} style={{display:'grid',gridTemplateColumns:'16px 1fr',gap:9,alignItems:'start'}}>
            <span style={{marginTop:6,width:5,height:5,borderRadius:999,background:G.fg4}}/>
            <span style={{fontSize:13.5,color:G.fg2,lineHeight:1.5}}>{f}</span>
          </div>)}
        </div>
        <div style={{background:A.infoBg,border:`1px solid ${A.infoBd}`,borderRadius:10,padding:'12px 14px',display:'grid',gridTemplateColumns:'17px 1fr',gap:10}}>
          <span style={{marginTop:1}}><Clock s={16} c="#1A56DB"/></span>
          <p style={{fontSize:13,color:'#1E429F',margin:0,lineHeight:1.5}}>Results arrive 2–6 working days after your sitting. Bank holidays are excluded from that count.</p>
        </div>
      </div>

      <div style={{display:'grid',gap:12}}>
        <div style={{border:`1px solid ${G.border||G.line}`,borderRadius:12,padding:'18px 20px',background:'#fff',boxShadow:'0 1px 3px rgba(0,0,0,.06)'}}>
          <div style={{fontSize:28,fontWeight:700,letterSpacing:'-.025em',color:G.fg1,lineHeight:1.1}}>{M3(unit)}</div>
          <p style={{fontSize:12.5,color:G.fg4,margin:'3px 0 14px'}}>or {M3(unit/12)}/month with Klarna, Clearpay or Payl8r</p>

          <div style={{background:G.sunk,borderRadius:8,padding:'11px 13px',marginBottom:14}}>
            <p style={{fontSize:13,color:G.fg2,margin:'0 0 3px',lineHeight:1.45}}>{dated ? <>Sitting <b style={{fontWeight:700,color:G.fg1}}>{slot.day} {slot.mon}</b></> : <>Sitting <b style={{fontWeight:700,color:G.fg1}}>chosen later</b></>}</p>
            <p style={{fontSize:14,color:A.succText,margin:0,fontWeight:700}}>{dated ? `Result by ${slot.res}` : 'Result 2–6 days after you sit it'}</p>
          </div>

          <p style={{fontSize:14.5,fontWeight:700,color:A.succText,margin:'0 0 3px'}}>In stock</p>
          <p style={{fontSize:12.5,color:A.amber,margin:'0 0 14px',fontWeight:600}}>Only 8 places left at this price</p>

          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:12}}>
            <label style={{fontSize:13,color:G.fg3}}>Learners</label>
            <select value={learners} onChange={e=>setLearners(+e.target.value)} style={{fontFamily:'inherit',fontSize:13.5,padding:'7px 10px',borderRadius:8,border:`1px solid ${G.line}`,background:'#fff',color:G.fg1}}>
              {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            {learners>1 && <span style={{fontSize:13,color:G.fg3}}>Total <b style={{color:G.fg1,fontWeight:700}}>{M3(total)}</b></span>}
          </div>

          <button style={{width:'100%',height:46,borderRadius:999,border:'none',background:G.pri,color:'#fff',fontFamily:'inherit',fontSize:15.5,fontWeight:700,cursor:'pointer',marginBottom:9}}>Add to basket</button>
          <button style={{width:'100%',height:46,borderRadius:999,border:`1px solid ${G.line}`,background:'#fff',fontFamily:'inherit',fontSize:15,fontWeight:600,color:G.fg1,cursor:'pointer',marginBottom:14}}>Book with a £29 deposit</button>

          <div style={{borderTop:`1px solid ${G.line}`,paddingTop:8}}>
            <RailRow label="Exam centre" value="Pass Functional Skills" strong/>
            <RailRow label="Awarded by" value="TQUK · Open Awards"/>
            <RailRow label="Sat at" value="Home, remotely invigilated"/>
            <RailRow label="Resit" value={plan.pkgId==='premium'?'Free if you don\'t pass':'£157.60'} strong={plan.pkgId==='premium'}/>
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
          <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:'0 0 14px',color:G.fg1}} id="reviews">Reviews</h2>
          <ReviewDistribution/>
        </div>
        <div>
          <h2 style={{fontSize:19,fontWeight:700,letterSpacing:'-.02em',margin:'0 0 14px',color:G.fg1}} id="questions">Questions</h2>
          <Faq items={OBJ3.slice(0,5)} open={-1}/>
        </div>
      </div>
    </div>
  </div>;
}

Object.assign(window, { BuyBox8, ReviewDistribution, RailRow, Tile });
