// Pass Functional Skills — conversion-optimised landing page sections
// Built on the Pass Design System (green primary, Inter, 12px radii).

const PFS_PHONE = '020 4574 9155';
const PFS_HOURS = 'Mon–Fri 08:45–20:00 · Sat 09:30–16:00';

// ───────────────────────── Trust strip (very top) ─────────────────────────
function PFSTopStrip() {
  return (
    <div style={{ background: '#033005', color: '#DBFEDA', fontSize: 13, fontWeight: 500 }}>
      <div style={pfsStyles.inner1200} className="pfs-top-strip">
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <PFSIcon name="check-circle" size={14} color="#42E741"/> Ofqual-regulated · equivalent to GCSE grade C/4
        </span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 16 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#FDBA8C' }}>★★★★★</span> 4.7 · 1,252 reviews
          </span>
          <span style={{ opacity: 0.85 }}>{PFS_HOURS}</span>
        </span>
      </div>
    </div>
  );
}

// ───────────────────────── Sticky nav ─────────────────────────
function PFSNav() {
  return (
    <header style={pfsStyles.nav}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', height: 84 }}>
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 14, textDecoration: 'none' }}>
          <img src="assets/logos/pass-wordmark.svg" alt="Pass" style={{ height: 36, display: 'block' }}/>
          <span style={{ fontWeight: 600, fontSize: 12, color: '#0F8610', letterSpacing: '0.08em', textTransform: 'uppercase', borderLeft: '1px solid #DBFEDA', paddingLeft: 14, lineHeight: 1.2 }}>Functional<br/>Skills</span>
        </a>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', minWidth: 0, padding: '0 24px' }} className="pfs-nav-tagline">
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: '#F0FEEF', border: '1px solid #B8FBB7', color: '#0F8610', padding: '8px 18px', borderRadius: 999, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
            <PFSIcon name="award" size={18} color="#0FBC0F"/> The UK's #1 Functional Skills service
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} style={pfsStyles.navPhone}>
            <PFSIcon name="phone" size={16}/> {PFS_PHONE}
          </a>
          <a href="#hero-form" className="pass-btn pass-btn--primary">Get free advice</a>
        </div>
      </div>
    </header>
  );
}

// ───────────────────────── HERO with form (the conversion engine) ─────────────────────────
function PFSHero() {
  return (
    <section style={pfsStyles.heroWrap}>
      <div style={pfsStyles.heroBgPattern} aria-hidden="true"/>
      <div style={{ ...pfsStyles.inner1200, padding: '64px 32px 80px', alignItems: 'flex-start', gap: 56 }} className="pfs-hero-grid">

        {/* LEFT — pitch */}
        <div style={{ flex: '1 1 540px', minWidth: 0 }}>
          <h1 style={{ margin: '0', fontWeight: 800, fontSize: 64, lineHeight: 1.05, letterSpacing: '-0.035em', color: '#101828' }}>
            Need maths or English<br/>to <span style={{ color: '#0FBC0F' }}>unlock your career?</span>
          </h1>
          <p style={{ margin: '22px 0 0', fontSize: 19, lineHeight: 1.55, color: '#344054', maxWidth: 580 }}>
            Not sure whether you need a <strong>GCSE</strong>, <strong>Functional Skills</strong>, or a <strong>GCSE Equivalency</strong>? The answer depends on your career — and our specialists will tell you exactly what you need <strong>in one free call.</strong>
          </p>

          {/* Trust pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 12, marginTop: 32, maxWidth: 560 }}>
            {[
              ['93%', 'first-time pass rate'],
              ['1,252', 'verified reviews'],
              ['Ofqual', 'regulated qualifications'],
              ['2 days', 'to your results'],
            ].map(([v, l]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', background: '#fff', border: '1px solid #B8FBB7', borderRadius: 12, boxShadow: '0 1px 2px rgba(15,134,16,0.06)' }}>
                <span style={{ width: 24, height: 24, borderRadius: 6, background: '#0FBC0F', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PFSIcon name="check" size={16} color="#fff"/>
                </span>
                <span style={{ minWidth: 0, lineHeight: 1.2 }}>
                  <span style={{ display: 'block', fontWeight: 800, color: '#0F8610', fontSize: 18, letterSpacing: '-0.01em' }}>{v}</span>
                  <span style={{ display: 'block', color: '#4A5565', fontSize: 13, fontWeight: 500 }}>{l}</span>
                </span>
              </div>
            ))}
          </div>

          {/* Phone block — alternate CTA */}
          <div style={{ marginTop: 32, padding: '20px 24px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 20, maxWidth: 560 }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PFSIcon name="phone" size={24} color="#0FBC0F"/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: '#6A7282', fontWeight: 500 }}>Prefer to speak straight away?</div>
              <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} style={{ fontSize: 22, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em', textDecoration: 'none', display: 'block', marginTop: 2 }}>{PFS_PHONE}</a>
              <div style={{ fontSize: 12, color: '#6A7282', marginTop: 2 }}>{PFS_HOURS}</div>
            </div>
          </div>
        </div>

        {/* RIGHT — lead form (the money) */}
        <div style={{ flex: '0 1 460px', minWidth: 380, position: 'relative' }} id="hero-form">
          <PFSLeadForm/>
        </div>
      </div>
    </section>
  );
}

function PFSLeadForm({ compact = false }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 20, boxShadow: '0 24px 48px -16px rgba(15,134,16,0.18), 0 8px 16px -8px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
      {/* Form header */}
      <div style={{ background: '#0FBC0F', color: '#fff', padding: '20px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#DBFEDA' }}>Free · No obligation</div>
          <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4, letterSpacing: '-0.01em' }}>Find your right qualification</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: 8, padding: '6px 10px', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' }}>⏱ Reply in ~1 hr</div>
      </div>

      {/* Form body */}
      <form style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }} onSubmit={e => { e.preventDefault(); alert('Demo form — no submission.'); }}>
        <PFSField label="Your full name" required>
          <input className="pass-input" placeholder="e.g. Jordan Mitchell" required/>
        </PFSField>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <PFSField label="Phone number" required>
            <input className="pass-input" type="tel" placeholder="07…" required/>
          </PFSField>
          <PFSField label="Email" required>
            <input className="pass-input" type="email" placeholder="you@email.com" required/>
          </PFSField>
        </div>
        <PFSField label="What career are you working towards?" required>
          <PFSSelect>
            <option>Select your career goal…</option>
            <option>Nursing / Midwifery</option>
            <option>Teaching (PGCE / QTS)</option>
            <option>Paramedic</option>
            <option>Police / Firefighter</option>
            <option>University entry</option>
            <option>Apprenticeship</option>
            <option>Social work</option>
            <option>Dental nurse</option>
            <option>Armed forces</option>
            <option>Other / not listed</option>
          </PFSSelect>
        </PFSField>
        <PFSField label="Maths, English or both?" required>
          <PFSSelect>
            <option>Select…</option>
            <option>Maths</option>
            <option>English</option>
            <option>Both maths & English</option>
            <option>Not sure yet</option>
          </PFSSelect>
        </PFSField>

        <button type="submit" className="pass-btn pass-btn--primary pass-btn--lg" style={{ width: '100%', justifyContent: 'center', height: 54, fontSize: 16, fontWeight: 600, marginTop: 6 }}>
          Get my free callback →
        </button>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 12, color: '#6A7282' }}>
          <PFSIcon name="check-circle" size={14} color="#0F8610"/>
          We'll never share your details. <a href="#" style={{ color: '#0F8610', textDecoration: 'underline' }}>Privacy policy</a>
        </div>
      </form>
    </div>
  );
}

function PFSField({ label, required, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>
        {label} {required && <span style={{ color: '#C70036' }}>*</span>}
      </span>
      {children}
    </label>
  );
}

function PFSSelect({ children }) {
  return (
    <div style={{ position: 'relative' }}>
      <select className="pass-input" style={{ appearance: 'none', paddingRight: 42, width: '100%', cursor: 'pointer' }}>
        {children}
      </select>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6A7282' }}>
        <PFSIcon name="chevron-down" size={16}/>
      </span>
    </div>
  );
}

// ───────────────────────── Logos / trust bar ─────────────────────────
function PFSLogos() {
  // Placeholder "logo" marks: a glyph + wordmark in different shapes/styles
  // so the strip reads as real-but-redacted partner logos.
  const logos = [
    { name: 'NHS England', glyph: <div style={{ background: '#005EB8', color: '#fff', fontWeight: 800, fontSize: 14, padding: '4px 10px', borderRadius: 4, letterSpacing: '0.05em' }}>NHS</div>, label: 'England' },
    { name: 'Avon & Somerset Police', glyph: <div style={{ width: 26, height: 26, background: '#1F2937', color: '#fff', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11 }}>A&amp;S</div>, label: 'Police' },
    { name: 'Bournemouth University', glyph: <div style={{ width: 28, height: 28, background: '#6A7282', clipPath: 'polygon(50% 0, 100% 38%, 82% 100%, 18% 100%, 0 38%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 11 }}>BU</div>, label: 'Bournemouth Uni.' },
    { name: 'Accenture', glyph: <div style={{ color: '#A100FF', fontWeight: 800, fontSize: 18, letterSpacing: '-0.04em' }}>&gt;</div>, label: 'accenture' },
    { name: 'Ford Motor Co.', glyph: <div style={{ background: '#1F2937', color: '#fff', fontStyle: 'italic', fontWeight: 700, fontSize: 13, padding: '4px 10px', borderRadius: 999, letterSpacing: '0.04em' }}>Ford</div>, label: '' },
    { name: 'Siemens', glyph: <div style={{ color: '#009999', fontWeight: 800, fontSize: 16, letterSpacing: '0.02em' }}>SIEMENS</div>, label: '' },
  ];
  return (
    <section style={{ padding: '40px 0', borderBottom: '1px solid #F3F4F6' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ fontSize: 12, color: '#6A7282', letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginBottom: 24 }}>
          Trusted by learners working at &amp; applying to
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', gap: 28, flexWrap: 'wrap', filter: 'grayscale(0.4)', opacity: 0.85 }}>
          {logos.map(l => (
            <div key={l.name} title={l.name} style={{ display: 'flex', alignItems: 'center', gap: 10, height: 36 }}>
              {l.glyph}
              {l.label && <span style={{ fontFamily: 'Inter', fontWeight: 600, fontSize: 14, color: '#344054', letterSpacing: '-0.01em' }}>{l.label}</span>}
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 14, fontSize: 11, color: '#98A2B3' }}>Logos shown as illustrative placeholders</div>
      </div>
    </section>
  );
}

// ───────────────────────── Three routes (the core decision) ─────────────────────────
function PFSRoutes() {
  const routes = [
    {
      tag: 'MOST POPULAR',
      tagStyle: 'popular',
      title: 'Functional Skills Level 2',
      sub: 'Ofqual-regulated · equivalent to GCSE grade C/4',
      desc: 'Fully online — study at your own pace and sit the exam when you\'re ready.',
      bestFor: 'Nursing, paramedics, police, apprenticeships, most universities, career progression.',
      bullets: [
        'Results in as little as 2 working days',
        'Accepted by most employers & universities',
        'Study online — no classroom required',
        '93% pass rate with the Pass course',
        'Lowest cost available',
      ],
      price: 'From £149',
      cta: 'Start with Functional Skills',
    },
    {
      tag: 'TRADITIONAL ROUTE',
      tagStyle: 'neutral',
      title: 'GCSE',
      sub: 'The traditional school qualification',
      desc: 'Some universities and competitive degrees specify a GCSE rather than an equivalent.',
      bestFor: 'Specific competitive degrees (medicine, dentistry), institutions explicitly requiring GCSE.',
      bullets: [
        'Universally recognised',
        'Required by some competitive courses',
        'Graded 1–9 (grade 4+ = pass)',
        'Exam sittings throughout the year',
      ],
      price: 'From £299',
      cta: 'Ask about GCSE',
    },
    {
      tag: 'ALTERNATIVE ROUTE',
      tagStyle: 'neutral',
      title: 'GCSE Equivalency',
      sub: 'Often required for teacher training (PGCE/QTS)',
      desc: 'Faster than re-sitting a full GCSE — and accepted by most teacher training providers.',
      bestFor: 'PGCE/QTS teacher training and specific nursing degree entry requirements.',
      bullets: [
        'Accepted by many teacher training providers',
        'Some nursing programmes require this route',
        'Faster than re-sitting a full GCSE',
        'We check acceptance before you enrol',
      ],
      price: 'From £199',
      cta: 'Check equivalency',
    },
  ];
  return (
    <section id="options" style={{ padding: '88px 0 56px', background: '#F9FAFB' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 44px' }}>
          <div className="pass-eyebrow" style={{ color: '#0FBC0F' }}>Understanding your options</div>
          <h2 style={{ margin: '10px 0 14px', fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1, color: '#101828' }}>
            Three routes. <span style={{ color: '#0FBC0F' }}>One right answer</span> — for you.
          </h2>
          <p style={{ margin: 0, fontSize: 17, color: '#4A5565', lineHeight: 1.6 }}>
            The qualification you need depends entirely on your career goal and where you're applying. Here's a plain-English breakdown.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'stretch' }} className="pfs-routes-grid">
          {routes.map((r, i) => {
            const isPopular = r.tagStyle === 'popular';
            return (
              <div key={r.title} style={{
                background: '#fff',
                border: isPopular ? '2px solid #0FBC0F' : '1px solid #E5E7EB',
                borderRadius: 16,
                padding: 28,
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                boxShadow: isPopular ? '0 24px 48px -16px rgba(15,188,15,0.25)' : 'none',
              }}>
                {isPopular && (
                  <div style={{ position: 'absolute', top: -14, left: 28, background: '#0FBC0F', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '6px 12px', borderRadius: 8 }}>
                    {r.tag}
                  </div>
                )}
                {!isPopular && (
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#6A7282', marginBottom: 8 }}>{r.tag}</div>
                )}
                <div style={{ marginTop: isPopular ? 12 : 0 }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em' }}>{r.title}</div>
                  <div style={{ fontSize: 14, color: '#0F8610', fontWeight: 600, marginTop: 4 }}>{r.sub}</div>
                  <p style={{ margin: '14px 0 0', fontSize: 14, color: '#4A5565', lineHeight: 1.6 }}>{r.desc}</p>
                </div>

                <div style={{ marginTop: 20, padding: 14, background: '#F0FEEF', borderRadius: 10, border: '1px solid #DBFEDA' }}>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#0F8610' }}>Best for</div>
                  <div style={{ fontSize: 13, color: '#101828', marginTop: 4, lineHeight: 1.5 }}>{r.bestFor}</div>
                </div>

                <ul style={{ listStyle: 'none', padding: 0, margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {r.bullets.map(b => (
                    <li key={b} style={{ display: 'flex', gap: 10, fontSize: 14, color: '#344054', lineHeight: 1.5 }}>
                      <span style={{ flexShrink: 0, marginTop: 2 }}><PFSIcon name="check-circle" size={16} color="#0FBC0F"/></span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ flex: 1 }}/>
                <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ fontSize: 14, color: '#6A7282' }}>{r.price}</div>
                  <a href="#hero-form" className={isPopular ? 'pass-btn pass-btn--primary' : 'pass-btn pass-btn--secondary'} style={{ flex: 1, justifyContent: 'center' }}>{r.cta}</a>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 36, padding: 24, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PFSIcon name="lightbulb" size={22} color="#0FBC0F"/>
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#101828' }}>Not sure which is right for you?</div>
              <div style={{ fontSize: 14, color: '#4A5565', marginTop: 2 }}>One free call and our specialists will tell you exactly what you need.</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} className="pass-btn pass-btn--secondary"><PFSIcon name="phone" size={16}/> Call us free</a>
            <a href="#hero-form" className="pass-btn pass-btn--primary">Request callback</a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── 4-step process ─────────────────────────
function PFSProcess() {
  const steps = [
    { n: '01', title: 'Tell us your goal', body: 'Call us or fill in the form. Tell us your career path and any requirements you\'ve been given.', icon: 'message-circle' },
    { n: '02', title: 'Get expert advice', body: 'A specialist confirms which qualification your employer, training provider or university will accept.', icon: 'lightbulb' },
    { n: '03', title: 'Study & prepare', body: 'Access our online course and free revision materials. 93% pass when they complete the course.', icon: 'book-open' },
    { n: '04', title: 'Pass & progress', body: 'Sit your online exam, get results in days, and take the next step in your career.', icon: 'graduation-cap' },
  ];
  return (
    <section id="process" style={{ padding: '88px 0' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 56px' }}>
          <div className="pass-eyebrow" style={{ color: '#0FBC0F' }}>Simple process</div>
          <h2 style={{ margin: '10px 0 14px', fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
            From <em style={{ fontStyle: 'normal', color: '#0FBC0F' }}>"which qualification?"</em> to certified — fast.
          </h2>
          <p style={{ margin: 0, fontSize: 17, color: '#4A5565', lineHeight: 1.6 }}>
            Our advisors speak to hundreds of learners every week across every career path. One quick call and we'll tell you exactly what you need — completely free.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, position: 'relative' }} className="pfs-process-grid">
          {/* connector line */}
          <div style={{ position: 'absolute', top: 32, left: '12%', right: '12%', height: 2, background: 'repeating-linear-gradient(90deg, #DBFEDA 0 8px, transparent 8px 16px)', zIndex: 0 }}/>
          {steps.map(s => (
            <div key={s.n} style={{ background: '#fff', position: 'relative', zIndex: 1, padding: '0 4px' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, background: '#fff', border: '2px solid #0FBC0F', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0FBC0F' }}>
                <PFSIcon name={s.icon} size={28} color="#0FBC0F"/>
              </div>
              <div style={{ marginTop: 16, fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', color: '#0F8610' }}>STEP {s.n}</div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#101828', marginTop: 4, letterSpacing: '-0.01em' }}>{s.title}</div>
              <p style={{ margin: '10px 0 0', fontSize: 14, color: '#4A5565', lineHeight: 1.6 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── Career paths ─────────────────────────
function PFSCareers() {
  const careers = [
    { icon: 'graduation-cap', title: 'Nurse / Midwife', need: 'Maths & English needed for nursing degree entry', tag: 'Functional Skills or GCSE Equiv.' },
    { icon: 'book-open', title: 'Teacher / TA', need: 'GCSE equivalent typically needed for QTS / PGCE', tag: 'GCSE Equivalency' },
    { icon: 'award', title: 'Paramedic', need: 'Level 2 qualifications required for degree entry', tag: 'Functional Skills L2' },
    { icon: 'users', title: 'Police / Firefighter', need: 'Functional Skills widely accepted by UK forces', tag: 'Functional Skills L2' },
    { icon: 'graduation-cap', title: 'University entry', need: 'Most universities accept Functional Skills L2', tag: 'Depends on uni & course' },
    { icon: 'clipboard-list', title: 'Apprenticeship', need: 'Level 2 maths & English required for most frameworks', tag: 'Functional Skills L2' },
    { icon: 'message-circle', title: 'Social worker', need: 'Degree entry requires a recognised qualification', tag: 'Functional Skills L2' },
    { icon: 'check-circle', title: 'Dental nurse', need: 'Maths & English required for dental nursing', tag: 'Functional Skills L2' },
    { icon: 'award', title: 'Armed forces', need: 'Army, Navy and RAF accept Functional Skills', tag: 'Functional Skills L2' },
  ];
  return (
    <section id="careers" style={{ padding: '88px 0', background: '#F9FAFB' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <div className="pass-eyebrow" style={{ color: '#0FBC0F' }}>Career paths we support</div>
          <h2 style={{ margin: '10px 0 14px', fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>Whatever your goal — we know what you need.</h2>
          <p style={{ margin: 0, fontSize: 17, color: '#4A5565', lineHeight: 1.6 }}>
            We've helped thousands of people across every profession. Here are just some of the careers we support.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="pfs-careers-grid">
          {careers.map(c => (
            <div key={c.title} className="pass-card pass-card--hover" style={{ padding: 22, display: 'flex', gap: 16, alignItems: 'flex-start', cursor: 'pointer', transition: 'all 150ms cubic-bezier(0.4,0,0.2,1)' }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PFSIcon name={c.icon} size={22} color="#0FBC0F"/>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: '#101828' }}>{c.title}</div>
                <div style={{ fontSize: 13, color: '#4A5565', marginTop: 4, lineHeight: 1.5 }}>{c.need}</div>
                <div style={{ marginTop: 10, display: 'inline-block', background: '#fff', border: '1px solid #DBFEDA', color: '#0F8610', fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999 }}>{c.tag}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ margin: '0 0 16px', fontSize: 16, color: '#4A5565' }}>Don't see your career? Our specialists cover every profession.</p>
          <a href="#hero-form" className="pass-btn pass-btn--primary pass-btn--lg">Ask a specialist →</a>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── Testimonials ─────────────────────────
function PFSReviews() {
  const reviews = [
    { stars: 5, body: '"I had no idea whether I needed a GCSE or Functional Skills for my nursing degree. The team called me back within the hour and explained everything clearly. I passed my Level 2 maths first time and started my course in September."', name: 'Jordan M.', role: 'Nursing student', initials: 'JM' },
    { stars: 5, body: '"My university said they\'d accept Functional Skills Level 2. Pass confirmed this before I enrolled — that reassurance was everything. Got my results in 3 days and my place is confirmed."', name: 'Dumitra A.', role: 'University applicant', initials: 'DA' },
    { stars: 5, body: '"One phone call to Pass and they sorted everything — told me exactly what my PGCE course needed and walked me through the whole process. Passed my English exam within 2 weeks."', name: 'Manasa T.', role: 'PGCE teacher training', initials: 'MT' },
  ];
  return (
    <section id="reviews" style={{ padding: '88px 0' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ textAlign: 'center', maxWidth: 720, margin: '0 auto 48px' }}>
          <div className="pass-eyebrow" style={{ color: '#0FBC0F' }}>Real learner stories</div>
          <h2 style={{ margin: '10px 0 14px', fontSize: 44, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.1 }}>People just like you — goals achieved.</h2>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 14, padding: '10px 18px', background: '#F0FEEF', border: '1px solid #DBFEDA', borderRadius: 999, marginTop: 6 }}>
            <span style={{ color: '#FDBA8C', fontSize: 18, letterSpacing: 1 }}>★★★★★</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#101828' }}>4.7 average · 1,252 verified reviews</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }} className="pfs-reviews-grid">
          {reviews.map(r => (
            <div key={r.name} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column' }}>
              <div style={{ color: '#FDBA8C', fontSize: 18, letterSpacing: 2 }}>★★★★★</div>
              <p style={{ margin: '14px 0 0', fontSize: 16, color: '#101828', lineHeight: 1.6, flex: 1 }}>{r.body}</p>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#0FBC0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: 14 }}>{r.initials}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#101828' }}>{r.name}</div>
                  <div style={{ fontSize: 12, color: '#6A7282' }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── Why Pass ─────────────────────────
function PFSWhy() {
  const items = [
    { icon: 'award', title: 'Ofqual regulated', body: 'Every qualification is regulated by Ofqual — universally accepted by employers, universities, and training providers across the UK.' },
    { icon: 'message-circle', title: 'Specialist support team', body: 'Our advisors speak to learners across every career sector daily. We know exactly which qualification each provider will accept.' },
    { icon: 'play', title: 'Fully online & flexible', body: 'Study around your life. Access your course on any device, sit your exam from home, and receive your certificate digitally.' },
    { icon: 'clock', title: 'Fastest turnaround', body: 'Results in as little as 2 working days. We offer the fastest exam booking of any major provider — next working day available.' },
    { icon: 'trending-up', title: '93% pass rate', body: 'Students who complete the Pass Functional Skills course pass at 93% — far above the 36% national average.' },
    { icon: 'check-circle', title: 'No hidden fees', body: 'The price you see is the price you pay. Lowest cost exams available with flexible payment options including Klarna and Clearpay.' },
  ];
  return (
    <section style={{ padding: '88px 0', background: '#033005', color: '#fff' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', display: 'block' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 64, alignItems: 'flex-start' }} className="pfs-why-grid">
          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#42E741' }}>Why Pass Functional Skills</div>
            <h2 style={{ margin: '12px 0 0', fontSize: 48, fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.05 }}>You're in safe hands.</h2>
            <p style={{ margin: '20px 0 0', fontSize: 17, color: '#B8FBB7', lineHeight: 1.6, maxWidth: 380 }}>
              The UK's #1 Functional Skills service — built for adult learners who need a clear answer and a fast result.
            </p>
            <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, maxWidth: 380 }}>
              {[['93%','First-time pass'],['1,252','Verified reviews'],['2 days','Avg. results'],['£149','From price']].map(([v,l])=>(
                <div key={l} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(66,231,65,0.25)', borderRadius: 12, padding: '14px 16px' }}>
                  <div style={{ fontSize: 24, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>{v}</div>
                  <div style={{ fontSize: 12, color: '#B8FBB7', marginTop: 2 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {items.map(i => (
              <div key={i.title} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(66,231,65,0.18)', borderRadius: 16, padding: 24 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(66,231,65,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <PFSIcon name={i.icon} size={22} color="#42E741"/>
                </div>
                <div style={{ fontSize: 17, fontWeight: 600, color: '#fff', marginBottom: 6 }}>{i.title}</div>
                <div style={{ fontSize: 14, color: '#B8FBB7', lineHeight: 1.6 }}>{i.body}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── FINAL CTA — big form repeat ─────────────────────────
function PFSFinalCTA() {
  return (
    <section style={{ padding: '88px 0', background: 'linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 100%)' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '0 32px', alignItems: 'flex-start', gap: 56 }} className="pfs-final-grid">
        <div style={{ flex: '1 1 540px', minWidth: 0 }}>
          <div className="pass-eyebrow" style={{ color: '#0FBC0F' }}>Free, no-obligation guidance</div>
          <h2 style={{ margin: '10px 0 0', fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.05, color: '#101828' }}>
            Let's find your right qualification — <span style={{ color: '#0FBC0F' }}>together.</span>
          </h2>
          <p style={{ margin: '22px 0 0', fontSize: 18, color: '#344054', lineHeight: 1.55, maxWidth: 560 }}>
            One quick conversation with our specialist team is all it takes. Tell us your career goal and the institution you're applying to, and we'll confirm exactly which qualification you need — and how to get it fast.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, margin: '32px 0 0', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              ['No obligation — just expert advice tailored to you', 'check-circle'],
              ['We\'ll check your specific university or employer requirements', 'check-circle'],
              ['We won\'t push you to buy — just point you the right way', 'check-circle'],
            ].map(([t, ic]) => (
              <li key={t} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ width: 28, height: 28, borderRadius: 8, background: '#0FBC0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <PFSIcon name="check" size={16} color="#fff"/>
                </span>
                <span style={{ fontSize: 16, color: '#101828', lineHeight: 1.5, paddingTop: 4 }}>{t}</span>
              </li>
            ))}
          </ul>

          <div style={{ marginTop: 32, padding: 24, background: '#101828', color: '#fff', borderRadius: 16, display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ width: 56, height: 56, borderRadius: 12, background: '#0FBC0F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <PFSIcon name="phone" size={28} color="#fff"/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: '#98A2B3', fontWeight: 500 }}>Prefer to speak straight away?</div>
              <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} style={{ fontSize: 26, fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', textDecoration: 'none', display: 'block' }}>{PFS_PHONE}</a>
              <div style={{ fontSize: 12, color: '#98A2B3', marginTop: 2 }}>{PFS_HOURS}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: '0 1 460px', minWidth: 380 }}>
          <PFSLeadForm/>
        </div>
      </div>
    </section>
  );
}

// ───────────────────────── Footer ─────────────────────────
function PFSFooter() {
  return (
    <footer style={{ background: '#F9FAFB', borderTop: '1px solid #E5E7EB' }}>
      <div style={{ ...pfsStyles.inner1200, padding: '56px 32px 32px', alignItems: 'flex-start', gap: 48 }} className="pfs-footer-grid">
        <div style={{ flex: '1 1 320px', minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img src="assets/logos/pass-wordmark.svg" alt="Pass" style={{ height: 28, display: 'block' }}/>
            <span style={{ fontWeight: 600, fontSize: 11, color: '#0F8610', letterSpacing: '0.08em', textTransform: 'uppercase', borderLeft: '1px solid #DBFEDA', paddingLeft: 10, lineHeight: 1.2 }}>Functional<br/>Skills</span>
          </div>
          <p style={{ margin: '18px 0 0', color: '#4A5565', fontSize: 14, lineHeight: 1.6, maxWidth: 320 }}>
            The UK's #1 Functional Skills service. All qualifications are regulated by Ofqual and equivalent to GCSE grade C/4.
          </p>
          <div style={{ marginTop: 18, fontSize: 13, color: '#6A7282', lineHeight: 1.7 }}>
            Evans Business Centre, Hartwith Way,<br/>Harrogate HG3 2XA
          </div>
        </div>
        <div style={{ flex: '1 1 200px', minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 14 }}>Get in touch</div>
          <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} style={{ display: 'block', fontSize: 16, color: '#101828', fontWeight: 600, textDecoration: 'none' }}>{PFS_PHONE}</a>
          <a href="mailto:help@passfunctionalskills.co.uk" style={{ display: 'block', fontSize: 14, color: '#0F8610', textDecoration: 'none', marginTop: 6 }}>help@passfunctionalskills.co.uk</a>
          <div style={{ fontSize: 12, color: '#6A7282', marginTop: 10 }}>{PFS_HOURS}</div>
        </div>
        {[
          { head: 'Qualifications', items: ['Functional Skills L2', 'Functional Skills L1', 'GCSE', 'GCSE Equivalency'] },
          { head: 'Company', items: ['Home', 'Contact us', 'Reviews', 'Privacy policy', 'Terms'] },
        ].map(c => (
          <div key={c.head} style={{ flex: '1 1 160px', minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 14 }}>{c.head}</div>
            {c.items.map(i => <a key={i} href="#" style={{ display: 'block', fontSize: 14, color: '#4A5565', textDecoration: 'none', padding: '6px 0' }}>{i}</a>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: '1px solid #E5E7EB' }}>
        <div style={{ ...pfsStyles.inner1200, padding: '20px 32px', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 12, color: '#6A7282' }}>© 2026 Pass Functional Skills. All rights reserved.</div>
          <div style={{ fontSize: 12, color: '#6A7282' }}>Ofqual regulated · UK-based · Made for adult learners.</div>
        </div>
      </div>
    </footer>
  );
}

// ───────────────────────── Sticky mobile CTA bar ─────────────────────────
function PFSStickyBar() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      background: '#fff', borderTop: '1px solid #E5E7EB', boxShadow: '0 -8px 24px rgba(0,0,0,0.08)',
      padding: '12px 20px', display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between',
      zIndex: 50,
      transform: show ? 'translateY(0)' : 'translateY(120%)',
      transition: 'transform 300ms cubic-bezier(0.4,0,0.2,1)',
    }} className="pfs-sticky-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <PFSIcon name="phone" size={18} color="#0FBC0F"/>
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12, color: '#6A7282', fontWeight: 500 }}>Free expert advice</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#101828', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{PFS_PHONE}</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        <a href={`tel:${PFS_PHONE.replace(/\s/g,'')}`} className="pass-btn pass-btn--secondary pass-btn--sm">Call</a>
        <a href="#hero-form" className="pass-btn pass-btn--primary pass-btn--sm">Free callback →</a>
      </div>
    </div>
  );
}

// ───────────────────────── shared styles ─────────────────────────
const pfsStyles = {
  inner1200: { maxWidth: 1200, margin: '0 auto', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 },
  nav: { position: 'sticky', top: 0, zIndex: 40, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB' },
  navLink: { fontSize: 14, fontWeight: 500, color: '#344054', textDecoration: 'none' },
  navPhone: { fontSize: 14, fontWeight: 600, color: '#0F8610', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 },
  logoMark: { width: 36, height: 36, borderRadius: 10, background: '#0FBC0F', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' },
  heroWrap: { position: 'relative', background: 'linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 70%)', overflow: 'hidden' },
  heroBgPattern: { position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(15,134,16,0.08) 1px, transparent 0)', backgroundSize: '24px 24px', maskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 65%)', WebkitMaskImage: 'radial-gradient(ellipse at top right, black 0%, transparent 65%)', pointerEvents: 'none' },
  heroPill: { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 14px', background: '#fff', border: '1px solid #DBFEDA', borderRadius: 999, fontSize: 13, fontWeight: 500 },
};

Object.assign(window, {
  PFSTopStrip, PFSNav, PFSHero, PFSLeadForm, PFSField, PFSSelect,
  PFSLogos, PFSRoutes, PFSProcess, PFSCareers, PFSReviews, PFSWhy,
  PFSFinalCTA, PFSFooter, PFSStickyBar,
});
