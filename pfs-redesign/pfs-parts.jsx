const { packages, dates, fastTrack, proof, bodies, objections, money } = window.PFS;

const G = { line:'#E5E7EB', bg:'#F3F4F6', fg1:'#101828', fg2:'#344054', fg3:'#4A5565', fg4:'#6A7282', fg5:'#98A2B3', pri:'#0FBC0F', priD:'#0F8610', priDD:'#116A12', priBg:'#F0FEEF', priBd:'#B8FBB7', sunk:'#F9FAFB', warn:'#D97706', warnBg:'#FFF7ED', dang:'#C70036', dangBg:'#FDF2F2' };

// Icon geometry lifted verbatim from assets/icons/*.svg (the curated Flowbite subset).
function Check({ s = 18, c = G.pri }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none'}}><polyline points="20 6 9 17 4 12"/></svg>;
}
function Clock({ s = 14, c = 'currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
}
function Phone({ s = 16, c = 'currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none'}}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>;
}
function Chevron({ s = 16, c = 'currentColor', dir = 'down' }) {
  const r = { down:0, up:180, right:270, left:90 }[dir];
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none',transform:`rotate(${r}deg)`}}><polyline points="6 9 12 15 18 9"/></svg>;
}
function XIcon({ s = 18, c = 'currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{flex:'none'}}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
}
function Play({ s = 18, c = 'currentColor' }) {
  return <svg width={s} height={s} viewBox="0 0 24 24" fill={c} stroke="none" style={{flex:'none'}}><polygon points="5 3 19 12 5 21 5 3"/></svg>;
}
function Wordmark({ h = 26 }) {
  return <img src="assets/pass-wordmark.svg" alt="Pass" style={{height:h,display:'block'}}/>;
}
function Stars({ s = 15 }) {
  return <span style={{display:'inline-flex',gap:2,alignItems:'center'}}>{[0,1,2,3,4].map(i => <img key={i} src="assets/trustpilot-star.png" alt="" style={{height:s,width:s,display:'block'}}/>)}</span>;
}
function TrustLine() {
  return <div style={{display:'flex',alignItems:'center',gap:8}}><Stars s={14}/><span style={{fontSize:13,color:G.fg4}}>4.7 from 258 reviews on</span><img src="assets/trustpilot.png" alt="Trustpilot" style={{height:13,display:'block'}}/></div>;
}
function PayMarks() {
  return <div style={{display:'flex',alignItems:'center',gap:12,flexWrap:'wrap'}}>
    <span style={{fontSize:12,color:G.fg4}}>Spread the cost with</span>
    <img src="assets/klarna.png" alt="Klarna" style={{height:15,display:'block'}}/>
    <img src="assets/clearpay.png" alt="Clearpay" style={{height:14,display:'block'}}/>
    <img src="assets/paypal.png" alt="PayPal" style={{height:15,display:'block'}}/>
  </div>;
}

function Placeholder({ h = 300, label = 'course photography', r = 12 }) {
  return <div style={{height:h,borderRadius:r,border:`1px solid ${G.line}`,background:`repeating-linear-gradient(135deg,${G.sunk} 0 10px,#F1F3F6 10px 20px)`,display:'grid',placeItems:'center'}}>
    <span style={{fontFamily:'ui-monospace,SFMono-Regular,Menlo,monospace',fontSize:11.5,letterSpacing:'.06em',textTransform:'uppercase',color:G.fg5}}>{label}</span>
  </div>;
}

function Eyebrow({ children, style }) {
  return <p style={{fontSize:12,fontWeight:600,letterSpacing:'.06em',textTransform:'uppercase',color:G.fg4,margin:'0 0 10px',...style}}>{children}</p>;
}

function PkgRow({ p, on, onPick, compact }) {
  return <div onClick={onPick} role="radio" aria-checked={on} tabIndex={0}
    onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onPick(); } }}
    style={{display:'grid',gridTemplateColumns:'22px 1fr auto',gap:14,alignItems:'start',background:'#fff',
      border:`${on?2:1}px solid ${on?G.pri:G.line}`,borderRadius:12,padding:on?(compact?'13px 15px':'17px 19px'):(compact?'14px 16px':'18px 20px'),
      cursor:'pointer',position:'relative',boxShadow:on?'0 0 0 3px rgba(15,188,15,.12)':'none',transition:'border-color .15s,box-shadow .15s'}}>
    {p.tag && <span style={{position:'absolute',top:-10,right:16,background:G.pri,color:'#fff',fontSize:11,fontWeight:700,letterSpacing:'.03em',textTransform:'uppercase',padding:'3px 10px',borderRadius:999,whiteSpace:'nowrap'}}>{p.tag}</span>}
    <span style={{width:20,height:20,borderRadius:999,border:`${on?6:1.5}px solid ${on?G.pri:'#D1D5DB'}`,marginTop:2,flex:'none',background:'#fff',boxSizing:'border-box'}}/>
    <div>
      <p style={{fontSize:compact?16:17,fontWeight:700,color:G.fg1,margin:'0 0 4px'}}>{p.name}</p>
      <p style={{fontSize:13.5,color:G.fg3,lineHeight:1.5,margin:0}}>{p.blurb}</p>
      {!compact && <p style={{fontSize:12.5,color:G.fg4,lineHeight:1.5,margin:'6px 0 0',fontStyle:'italic'}}>{p.for}</p>}
    </div>
    <div style={{textAlign:'right',whiteSpace:'nowrap'}}>
      <div style={{fontSize:13,color:G.fg5,textDecoration:'line-through'}}>{money(p.was)}</div>
      <div style={{fontSize:compact?20:22,fontWeight:800,color:G.fg1,letterSpacing:'-.02em'}}>{money(p.now)}</div>
    </div>
  </div>;
}

function TotalBlock({ rows, total }) {
  return <div style={{background:G.sunk,border:`1px solid ${G.line}`,borderRadius:12,padding:'18px 20px'}}>
    {rows.map((r,i) => <div key={i} style={{display:'flex',justifyContent:'space-between',fontSize:14,color:G.fg3,padding:'3px 0'}}><span>{r[0]}</span><span style={{fontWeight:r[1]==='Included'?600:400,color:r[1]==='Included'?G.priDD:G.fg3}}>{r[1]}</span></div>)}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',borderTop:`1px solid ${G.line}`,marginTop:10,paddingTop:12}}>
      <span style={{fontSize:15,fontWeight:600,color:G.fg1}}>Total today</span>
      <span style={{fontSize:30,fontWeight:800,letterSpacing:'-.025em',color:G.fg1}}>{money(total)}</span>
    </div>
  </div>;
}

function Cta({ label, onClick, sub }) {
  const [h,setH] = React.useState(false);
  return <div>
    <button onClick={onClick} onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)}
      style={{width:'100%',height:56,border:'none',borderRadius:12,background:h?G.priD:G.pri,color:'#fff',fontFamily:'inherit',fontSize:18,fontWeight:700,cursor:'pointer',transition:'background .15s'}}>{label}</button>
    {sub && <p style={{textAlign:'center',fontSize:13,color:G.fg4,margin:'10px 0 0'}}>{sub}</p>}
    <div style={{display:'flex',justifyContent:'center',marginTop:10}}><PayMarks/></div>
  </div>;
}

function UrgencyLine() {
  return <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:13,color:G.warn,fontWeight:600,marginTop:12}}>
    <Clock/> 8 places left at this price · offer ends Friday 28 August
  </div>;
}

function ProofGrid({ cols = 2, items = proof }) {
  return <div style={{display:'grid',gridTemplateColumns:`repeat(${cols},1fr)`,gap:'14px 24px'}}>
    {items.map((p,i) => <div key={i} style={{display:'grid',gridTemplateColumns:'18px 1fr',gap:10,alignItems:'start'}}>
      <span style={{marginTop:3}}><Check/></span>
      <div><b style={{display:'block',fontSize:13.5,fontWeight:600,color:G.fg1}}>{p.t}</b><span style={{fontSize:12.5,color:G.fg4,lineHeight:1.45}}>{p.d}</span></div>
    </div>)}
  </div>;
}

function BodyChips() {
  return <div>
    <div style={{display:'flex',gap:14,alignItems:'center',flexWrap:'wrap',marginBottom:10}}>
      <img src="assets/open-awards.png" alt="Open Awards" style={{height:30,display:'block'}}/>
      <img src="assets/city-and-guilds.png" alt="City &amp; Guilds" style={{height:26,display:'block'}}/>
      <span style={{fontSize:11.5,fontWeight:600,color:G.fg4,border:`1px solid ${G.line}`,borderRadius:6,padding:'5px 9px',background:'#fff'}}>TQUK</span>
      <span style={{fontSize:11.5,fontWeight:600,color:G.fg4,border:`1px solid ${G.line}`,borderRadius:6,padding:'5px 9px',background:'#fff'}}>Ofqual regulated</span>
      <span style={{fontSize:11.5,fontWeight:600,color:G.fg5,border:`1px dashed ${G.line}`,borderRadius:6,padding:'5px 9px',background:'#fff'}}>Accepted by 140+ UK universities †</span>
    </div>
    <p style={{fontSize:11,color:G.fg5,margin:0}}>† Acceptance list to be verified before launch. TQUK and Ofqual marks pending asset supply — the repo holds Open Awards and City &amp; Guilds only.</p>
  </div>;
}

function Faq({ items = objections, open: openInit = 0 }) {
  const [open,setOpen] = React.useState(openInit);
  return <div style={{border:`1px solid ${G.line}`,borderRadius:12,overflow:'hidden',background:'#fff'}}>
    {items.map((o,i) => <div key={i} style={{borderTop:i?`1px solid ${G.line}`:'none'}}>
      <button onClick={()=>setOpen(open===i?-1:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',gap:16,background:'none',border:'none',fontFamily:'inherit',fontSize:15,fontWeight:600,color:G.fg1,textAlign:'left',padding:'16px 20px',cursor:'pointer'}}>
        {o.q}<Chevron dir={open===i?'up':'down'} c={G.fg4}/>
      </button>
      {open===i && <p style={{fontSize:14,color:G.fg3,lineHeight:1.6,margin:0,padding:'0 20px 18px'}}>{o.a}</p>}
    </div>)}
  </div>;
}

function Testimonial({ name, line, quote }) {
  return <div style={{border:`1px solid ${G.line}`,borderRadius:12,padding:16,background:'#fff',display:'grid',gridTemplateColumns:'44px 1fr',gap:12,alignItems:'start'}}>
    <div style={{width:44,height:44,borderRadius:999,background:`repeating-linear-gradient(135deg,${G.sunk} 0 6px,#EDF0F3 6px 12px)`,border:`1px solid ${G.line}`}}/>
    <div>
      <Stars s={13}/>
      <p style={{fontSize:13.5,color:G.fg2,lineHeight:1.55,margin:'4px 0 6px'}}>“{quote}”</p>
      <p style={{fontSize:12,color:G.fg4,margin:0,fontWeight:600}}>{name} · <span style={{fontWeight:400}}>{line}</span></p>
    </div>
  </div>;
}

// Nav row transcribed from partial-navbar.php: the xl-and-up item set in source order.
// Items marked d-xl-none there (Past Papers, My Account, the call-now button) are
// correctly absent at this width; the phone lives in the utility bar above.
function TopBar({ wide }) {
  const top = ['Book a Tutor','020 4574 9155','help@passfunctionalskills.co.uk','Live Chat','Contact Us','My Account'];
  const nav = [['Book Exams',true],['Courses',true],['Revise',true],['Shop',false],['Training Providers',true],['Testimonials',false],['Book a Tutor',false]];
  const inner = { maxWidth: wide ? 1470 : 'none', margin:'0 auto', width:'100%', display:'flex', alignItems:'center', padding:'0 32px', boxSizing:'border-box' };
  return <div>
    <div style={{background:G.sunk,borderBottom:`1px solid ${G.line}`,height:36,display:'flex',justifyContent:'center'}}>
      <div style={{...inner,justifyContent:'flex-end',gap:20}}>
        {top.map(t => <span key={t} style={{fontSize:12.5,color:G.fg3,display:'flex',alignItems:'center',gap:6}}>{t === '020 4574 9155' && <Phone s={13} c={G.fg4}/>}{t}</span>)}
      </div>
    </div>
    <div style={{background:'#fff',borderBottom:`1px solid ${G.line}`,height:64,display:'flex',justifyContent:'center'}}>
      <div style={{...inner,justifyContent:'space-between',gap:24}}>
        <div style={{display:'flex',alignItems:'baseline',gap:9,flex:'none'}}>
          <Wordmark h={24}/>
          <span style={{fontWeight:500,fontSize:17,color:G.fg3,letterSpacing:'-.01em'}}>Functional Skills</span>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:18}}>
          {nav.map(([label,hasMenu]) => <span key={label} style={{display:'flex',alignItems:'center',gap:4,fontSize:13.5,color:G.fg2,fontWeight:500,whiteSpace:'nowrap'}}>{label}{hasMenu && <Chevron s={13} c={G.fg5}/>}</span>)}
          <button style={{height:38,padding:'0 18px',borderRadius:12,border:'none',background:G.pri,color:'#fff',fontFamily:'inherit',fontSize:13.5,fontWeight:600,cursor:'pointer',flex:'none'}}>Login</button>
          <a href="#basket" aria-label="Shopping Cart" style={{width:38,height:38,borderRadius:12,background:G.bg,border:`1px solid ${G.line}`,display:'grid',placeItems:'center',flex:'none',color:G.fg2}}>
            <svg width="16" height="16" viewBox="0 0 576 512" style={{display:'block'}}><path fill="currentColor" d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/></svg>
          </a>
        </div>
      </div>
    </div>
  </div>;
}

function Breadcrumb() {
  return <div style={{fontSize:13,color:G.fg4,padding:'18px 0 22px'}}>Home <span style={{color:G.fg5}}>/</span> Exams <span style={{color:G.fg5}}>/</span> <span style={{color:G.fg2}}>Functional Skills Maths Level 2</span></div>;
}

function Gallery() {
  return <div style={{display:'grid',gap:12}}>
    <Placeholder h={340} label="learner sitting the exam at home"/>
    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
      {['exam pack','93% stat card','setup video','certificate'].map(l => <Placeholder key={l} h={72} label={l} r={8}/>)}
    </div>
    <div style={{display:'flex',alignItems:'center',gap:12,border:`1px solid ${G.line}`,borderRadius:12,padding:'12px 16px',background:'#fff'}}>
      <Stars s={16}/><span style={{fontSize:14,fontWeight:700,color:G.fg1}}>4.7/5</span><span style={{fontSize:13,color:G.fg4}}>Excellent · 258 reviews on</span><img src="assets/trustpilot.png" alt="Trustpilot" style={{height:14,display:'block'}}/>
    </div>
  </div>;
}

// Below-the-fold section order, shown once as the recommended page skeleton.
function BelowFold() {
  const secs = [
    ['How the at-home exam actually works','Four steps with the 90-second setup video. Answers the biggest single objection.'],
    ['Which package do I need?','The comparison table — moved here, out of the buy box, where it aids a considered choice.'],
    ['Is it accepted?','Awarding bodies, the 140+ institution list, and what to tell an employer.'],
    ['Learner stories','Named people from the four buying situations, with the outcome they got.'],
    ['Reviews','Trustpilot feed with rating distribution.'],
    ['Questions','The six objections, answered plainly.']
  ];
  return <div style={{display:'grid',gap:10}}>
    {secs.map(([t,d],i) => <div key={t} style={{display:'grid',gridTemplateColumns:'28px 1fr',gap:14,alignItems:'start',border:`1px solid ${G.line}`,borderRadius:12,padding:'16px 18px',background:'#fff'}}>
      <span style={{width:26,height:26,borderRadius:999,background:G.priBg,color:G.priDD,fontSize:12.5,fontWeight:700,display:'grid',placeItems:'center'}}>{i+1}</span>
      <div><p style={{fontSize:15,fontWeight:600,color:G.fg1,margin:'2px 0 3px'}}>{t}</p><p style={{fontSize:13,color:G.fg4,margin:0,lineHeight:1.5}}>{d}</p></div>
    </div>)}
  </div>;
}

function PageShell({ children, note, gallery = 'full' }) {
  const noteBox = note ? <div style={{border:`1px solid ${G.line}`,borderLeft:`3px solid ${G.pri}`,borderRadius:'0 10px 10px 0',padding:'14px 16px',background:G.priBg}}><p style={{fontSize:12.5,color:G.priDD,margin:0,lineHeight:1.55,fontWeight:500}}>{note}</p></div> : null;
  if (gallery === 'full') return <div style={{background:'#fff',minHeight:'100%'}}>
    <TopBar/>
    <div style={{maxWidth:1216,margin:'0 auto',padding:'0 32px 40px'}}>
      <Breadcrumb/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 640px',gap:48,alignItems:'start'}}>
        <div style={{position:'sticky',top:24}}><Gallery/>{note && <div style={{marginTop:20}}>{noteBox}</div>}</div>
        <div>{children}</div>
      </div>
    </div>
  </div>;
  const w = gallery === 'wide' ? 1470 : gallery === 'thin' ? 880 : 780;
  return <div style={{background:'#fff',minHeight:'100%'}}>
    <TopBar wide={gallery === 'wide'}/>
    <div style={{maxWidth:w,margin:'0 auto',padding:'0 32px 40px'}}>
      <Breadcrumb/>
      {gallery === 'thin' && <div style={{marginBottom:24}}><ThinGallery/></div>}
      {children}
      {note && <div style={{marginTop:24}}>{noteBox}</div>}
    </div>
  </div>;
}

Object.assign(window, { G, Check, Clock, Phone, Chevron, XIcon, Play, Wordmark, Stars, TrustLine, PayMarks, Placeholder, Eyebrow, PkgRow, TotalBlock, Cta, UrgencyLine, ProofGrid, BodyChips, Faq, Testimonial, TopBar, Breadcrumb, Gallery, BelowFold, PageShell });
