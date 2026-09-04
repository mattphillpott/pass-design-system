// Booking Wizard — main shell + page surround + price chip + tweaks integration

const { PHONE, HOURS, BASE_PRICE, priceFor, gbp, validators, PassLogo, TrustPill } = window.WIZ;
const { StepNav, STEP_LABELS, Step1Details, Step2Invigilation } = window.WIZ_STEPS_A;
const { Step3DateTime, Step4Course, Step5Checkout, validatePassword } = window.WIZ_STEPS_B;

// ───────── Page surround ─────────
function PageHeader({ compact }) {
  return (
    <header style={{
      background: '#fff', borderBottom: '1px solid #E5E7EB',
      padding: compact ? '14px 28px' : '18px 32px',
      display: 'flex', alignItems: 'center', gap: 24,
      position: 'sticky', top: 0, zIndex: 30,
    }} className="wiz-pageheader">
      <a href="#" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
        <PassLogo height={compact ? 26 : 30}/>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#0F8610',
          textTransform: 'uppercase', letterSpacing: '0.08em',
          paddingLeft: 12, borderLeft: '1px solid #E5E7EB', lineHeight: 1.2,
        }}>Functional<br/>Skills</span>
      </a>

      <a href="#" className="pass-btn pass-btn--ghost pass-btn--sm" style={{ marginLeft: 'auto', color: '#4A5565' }}>
        <PFSIcon name="arrow-left" size={14}/> Back to main site
      </a>

      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '6px 12px', borderRadius: 999,
        background: '#F0FEEF', border: '1px solid #B8FBB7',
      }} className="wiz-secure-pill">
        <PFSIcon name="lock" size={14} color="#0F8610"/>
        <span style={{ fontSize: 12, fontWeight: 600, color: '#0F8610' }}>Secure SSL booking</span>
      </div>

      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }} className="wiz-secure-marks">
        <MastercardSecureCode/>
        <VerifiedByVisa/>
      </div>

      <a href={`tel:${PHONE.replace(/\s/g,'')}`} style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none',
      }} className="wiz-phone-cta">
        <span style={{
          width: 36, height: 36, borderRadius: 999, background: '#0FBC0F',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <PFSIcon name="phone" size={16} color="#fff"/>
        </span>
        <span>
          <span style={{ display: 'block', fontSize: 11, color: '#6A7282', fontWeight: 500 }}>Need help?</span>
          <span style={{ display: 'block', fontSize: 15, fontWeight: 800, color: '#101828', letterSpacing: '-0.01em' }}>{PHONE}</span>
        </span>
      </a>
    </header>
  );
}

function MastercardSecureCode() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', borderRadius: 6,
      background: '#fff', border: '1px solid #E5E7EB',
    }} title="Mastercard SecureCode">
      <span style={{ display: 'inline-flex', gap: 1 }}>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: '#EB001B' }}/>
        <span style={{ width: 12, height: 12, borderRadius: 999, background: '#F79E1B', marginLeft: -4 }}/>
      </span>
      <span style={{ fontSize: 9, fontWeight: 700, color: '#101828', lineHeight: 1.1 }}>
        SecureCode<br/><span style={{ fontWeight: 500, color: '#6A7282' }}>by Mastercard</span>
      </span>
    </span>
  );
}

function VerifiedByVisa() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 8px', borderRadius: 6,
      background: '#1A1F71', color: '#fff',
    }} title="Verified by Visa">
      <span style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 11, color: '#F7B600' }}>VISA</span>
      <span style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.1 }}>
        Verified<br/>by Visa
      </span>
    </span>
  );
}

// Countdown component
function CountdownTimer() {
  const target = React.useMemo(() => {
    const stored = sessionStorage.getItem('wizCountdownTarget');
    if (stored) return parseInt(stored, 10);
    const t = Date.now() + (2 * 24 * 60 * 60 * 1000) + (8 * 60 * 60 * 1000) + (42 * 60 * 1000);
    sessionStorage.setItem('wizCountdownTarget', String(t));
    return t;
  }, []);
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  const pad = n => String(n).padStart(2, '0');
  const Block = ({ v, label }) => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', minWidth: 32 }}>
      <span style={{
        fontSize: 14, fontWeight: 800, color: '#9A3412',
        background: '#fff', borderRadius: 4,
        padding: '2px 6px', minWidth: 26, textAlign: 'center',
        fontVariantNumeric: 'tabular-nums',
      }}>{pad(v)}</span>
      <span style={{ fontSize: 8, color: '#9A3412', textTransform: 'uppercase', fontWeight: 600, marginTop: 1 }}>{label}</span>
    </div>
  );
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#FFEDD5', border: '1px solid #FED7AA', color: '#9A3412', fontSize: 12, fontWeight: 600 }}>
      <PFSIcon name="clock" size={14} color="#D97706"/> Offer ends in
      <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
        <Block v={days} label="d"/><Block v={hours} label="h"/><Block v={mins} label="m"/><Block v={secs} label="s"/>
      </span>
    </span>
  );
}

function TrustSidebar() {
  return (
    <aside style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ padding: 18, background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Need help?</div>
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            width: 44, height: 44, borderRadius: 999, background: '#F0FEEF',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PFSIcon name="phone" size={20} color="#0F8610"/>
          </span>
          <div style={{ minWidth: 0 }}>
            <a href={`tel:${PHONE.replace(/\s/g,'')}`} style={{ fontSize: 18, fontWeight: 800, color: '#101828', textDecoration: 'none', letterSpacing: '-0.01em', display: 'block' }}>{PHONE}</a>
            <div style={{ fontSize: 11, color: '#6A7282', marginTop: 2 }}>{HOURS}</div>
          </div>
        </div>
      </div>

      <TrustPill icon="shield-check" title="Ofqual-regulated" sub="Equivalent to GCSE grade C/4"/>
      <TrustPill icon="award" title="UK's #1 service" sub="93% first-time pass rate"/>
      <TrustPill icon="lock" title="256-bit SSL secure" sub="Card data never stored"/>
      <TrustPill icon="rotate-ccw" title="14-day refund" sub="Full refund if you change your mind"/>

      {/* BNPL */}
      <div style={{ padding: 16, background: '#fff', borderRadius: 16, border: '1px solid #E5E7EB' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Buy now, pay later
        </div>
        <div style={{ fontSize: 12, color: '#4A5565', marginTop: 4, lineHeight: 1.4 }}>
          Spread the cost with 0% interest. Subject to status.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <BnplLogo brand="klarna"/>
          <BnplLogo brand="clearpay"/>
          <BnplLogo brand="paypal3"/>
          <BnplLogo brand="laybuy"/>
        </div>
      </div>

      <div style={{ padding: 16, background: '#101828', color: '#fff', borderRadius: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#42E741', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Trustpilot</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <span style={{ color: '#FDBA8C', fontSize: 16, letterSpacing: 1 }}>★★★★★</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>4.7</span>
          <span style={{ fontSize: 12, color: '#98A2B3' }}>1,252 reviews</span>
        </div>
        <p style={{ margin: '10px 0 0', fontSize: 12, color: '#D1D5DB', lineHeight: 1.5 }}>
          "Booking was effortless. Sat my exam from home, passed first time, results in 4 days."
        </p>
        <div style={{ fontSize: 11, color: '#98A2B3', marginTop: 8 }}>— Sarah M., Manchester</div>
      </div>
    </aside>
  );
}

// ───────── Main wizard body ─────────
function BookingWizard({ tweaks }) {
  const { stepNav, dateLayout, density } = tweaks;
  const [step, setStep] = React.useState(0);
  const [maxReached, setMaxReached] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [data, setData] = React.useState({
    firstName: '', lastName: '', email: '', phone: '',
    invigilation: 'human',
    date: null, time: null,
    course: 'standard',
    payment: 'card',
  });
  const [errors, setErrors] = React.useState({});

  const total = priceFor(data.date || nextWeekday(), data.time || '14:00', data.invigilation, data.course);
  const originalPrice = BASE_PRICE + (data.course === 'standard' ? 184 : data.course === 'premium' ? 284 : 0);

  const canAdvance = React.useMemo(() => {
    if (step === 0) {
      const e = {
        firstName: validators.firstName(data.firstName),
        lastName: validators.lastName(data.lastName),
        email: validators.email(data.email),
        phone: validators.phone(data.phone),
      };
      return !e.firstName && !e.lastName && !e.email && !e.phone;
    }
    if (step === 1) return !!data.invigilation;
    if (step === 2) return !!data.date && !!data.time;
    if (step === 3) {
      if (!data.course) return false;
      if (data.course === 'standard' || data.course === 'premium') {
        if (!data.portalEmail || !validators.email(data.portalEmail) === false) {
          if (validators.email(data.portalEmail)) return false;
        }
        if (validatePassword(data.portalPassword || '')) return false;
      }
      return true;
    }
    if (step === 4) return !!data.payment;
    return true;
  }, [step, data]);

  function next() {
    if (step === 0) {
      const e = {
        firstName: validators.firstName(data.firstName),
        lastName: validators.lastName(data.lastName),
        email: validators.email(data.email),
        phone: validators.phone(data.phone),
      };
      setErrors(e);
      if (e.firstName || e.lastName || e.email || e.phone) return;
    }
    if (!canAdvance) return;
    setDirection(1);
    setStep(s => {
      const n = Math.min(STEP_LABELS.length - 1, s + 1);
      setMaxReached(m => Math.max(m, n));
      return n;
    });
  }
  function prev() {
    setDirection(-1);
    setStep(s => Math.max(0, s - 1));
  }
  function jumpStep(s) {
    setDirection(s > step ? 1 : -1);
    setStep(s);
  }

  const stepDesc = [
    "We need a few quick details so we can email and text your booking confirmation.",
    "Choose how you'd like to be invigilated. Both methods are Ofqual-regulated.",
    "Pick the day and time that suits you. Prices vary — pick a green day to save more.",
    "Boost your pass rate with a course bundle. 93% pass first-time with Premium.",
    "Pay securely. Your booking is locked in the moment payment is confirmed.",
  ];

  const containerPad = density === 'compact' ? 24 : 32;

  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '1px solid #E5E7EB',
      boxShadow: '0 24px 48px -16px rgba(15,134,16,0.10), 0 8px 16px -8px rgba(0,0,0,0.04)',
      overflow: 'hidden',
    }}>
      {/* Top — step nav + price */}
      <div style={{
        padding: `${containerPad - 8}px ${containerPad}px`,
        borderBottom: '1px solid #F3F4F6',
        background: 'linear-gradient(180deg, #FAFEF9 0%, #fff 100%)',
      }}>
        <StepNav variant={stepNav} step={step} setStep={jumpStep} maxReached={maxReached}/>
      </div>

      {/* Step header */}
      <div style={{ padding: `${containerPad - 4}px ${containerPad}px 0` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Step {step + 1} of {STEP_LABELS.length}
        </div>
        <h2 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em' }}>
          {STEP_LABELS[step]}
        </h2>
        <p style={{ margin: 0, fontSize: 14, color: '#4A5565', lineHeight: 1.5 }}>{stepDesc[step]}</p>
      </div>

      {/* Step body */}
      <div style={{
        padding: containerPad, paddingTop: containerPad - 8,
        position: 'relative', minHeight: 360,
      }}>
        <div key={step} className="wiz-step-anim" style={{ animation: `wizSlideIn${direction > 0 ? 'R' : 'L'} .35s cubic-bezier(.4,0,.2,1) both` }}>
          {step === 0 && <Step1Details data={data} setData={setData} errors={errors} setErrors={setErrors}/>}
          {step === 1 && <Step2Invigilation data={data} setData={setData}/>}
          {step === 2 && <Step3DateTime data={data} setData={setData} layout={dateLayout}/>}
          {step === 3 && <Step4Course data={data} setData={setData} errors={errors} setErrors={setErrors}/>}
          {step === 4 && <Step5Checkout data={data} setData={setData} total={total}/>}
        </div>
      </div>

      {/* Footer with prev / next + animated price chip */}
      <div style={{
        padding: `${containerPad - 8}px ${containerPad}px`,
        borderTop: '1px solid #F3F4F6',
        background: '#FAFAFA',
        display: 'flex', alignItems: 'center', gap: 16,
      }}>
        <button type="button" onClick={prev} disabled={step === 0}
          className="pass-btn pass-btn--secondary pass-btn--lg" style={{ opacity: step === 0 ? 0.4 : 1 }}>
          <PFSIcon name="arrow-left" size={14}/> Back
        </button>

        <div style={{ flex: 1 }}/>

        <PriceChip total={total} original={originalPrice} step={step}/>

        <button type="button" onClick={next} disabled={!canAdvance}
          className="pass-btn pass-btn--primary pass-btn--lg"
          style={{
            paddingLeft: 22, paddingRight: 22, fontSize: 15, fontWeight: 600,
            opacity: canAdvance ? 1 : 0.55,
          }}>
          {step === 4 ? <>Complete booking <PFSIcon name="lock" size={14}/></> : <>Continue <PFSIcon name="arrow-right" size={14}/></>}
        </button>
      </div>
    </div>
  );
}

function nextWeekday() {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString().slice(0,10);
}

// ───────── Animated price chip near Next button ─────────
function PriceChip({ total, original, step }) {
  const [bump, setBump] = React.useState(false);
  const prev = React.useRef(total);
  React.useEffect(() => {
    if (Math.abs(prev.current - total) > 0.01) {
      setBump(true);
      const id = setTimeout(() => setBump(false), 380);
      prev.current = total;
      return () => clearTimeout(id);
    }
  }, [total]);

  const save = Math.max(0, original - total);
  const savePct = original > 0 ? Math.round((save / original) * 100) : 0;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '8px 16px', borderRadius: 999,
      background: '#fff', border: '1px solid #B8FBB7',
      boxShadow: bump ? '0 0 0 6px rgba(15,188,15,0.15)' : '0 1px 2px rgba(0,0,0,0.04)',
      transform: bump ? 'scale(1.04)' : 'scale(1)',
      transition: 'transform .35s cubic-bezier(.34,1.56,.64,1), box-shadow .35s',
    }} className="wiz-price-chip">
      <div style={{ textAlign: 'right', lineHeight: 1.1 }}>
        <div style={{ fontSize: 10, color: '#6A7282', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          {step === 4 ? 'Total today' : 'Running total'}
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, justifyContent: 'flex-end', marginTop: 2 }}>
          {save > 0 && <span style={{ fontSize: 12, color: '#98A2B3', textDecoration: 'line-through', fontWeight: 500 }}>{gbp(original)}</span>}
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.02em' }}>{gbp(total)}</span>
        </div>
      </div>
      {save > 0 && (
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: '#0FBC0F', color: '#fff',
          fontSize: 11, fontWeight: 800, padding: '4px 8px', borderRadius: 999, whiteSpace: 'nowrap',
        }}>
          <PFSIcon name="trending-down" size={12} color="#fff"/> {savePct}% off
        </span>
      )}
    </div>
  );
}

// ───────── Main page (1 wizard) ─────────
function WizardPage({ tweaks }) {
  return (
    <div style={{ minHeight: '100%', background: '#FAFAF9' }}>
      <PageHeader/>
      {/* Sub-bar with exam title */}
      <div style={{ background: '#fff', borderBottom: '1px solid #F3F4F6', padding: '16px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span className="pass-badge pass-badge--brand"><PFSIcon name="calculator" size={12} color="#0FBC0F"/> Maths Level 2</span>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em' }}>
              Functional Skills Maths Level 2 Exam
            </h1>
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', fontSize: 12, fontWeight: 700 }}>
              <PFSIcon name="alert-circle" size={14} color="#C70036"/> Only 8 spaces left at this price
            </span>
            <CountdownTimer/>
          </div>
          <p style={{ margin: '10px 0 0', fontSize: 13, color: '#4A5565', lineHeight: 1.55, maxWidth: 880 }}>
            The official Ofqual-regulated Functional Skills Maths Level 2 exam — equivalent to GCSE grade C/4. Sit from home with online invigilation, get fast-track results, and unlock access to university, nursing, teaching and apprenticeship pathways. The UK's #1 Functional Skills service with a 93% first-time pass rate when bundled with our Premium course.
          </p>
        </div>
      </div>

      <main style={{ padding: '28px 32px 64px' }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24,
        }} className="wiz-main-grid">
          <BookingWizard tweaks={tweaks}/>
          <TrustSidebar/>
        </div>
      </main>
    </div>
  );
}

function BnplLogo({ brand }) {
  const styles = {
    klarna: { bg: '#FFA8CD', fg: '#0B051D', label: 'Klarna.', sub: 'Pay in 3' },
    clearpay: { bg: '#B2FCE4', fg: '#0E1F1F', label: 'Clearpay', sub: 'Up to 6 months' },
    paypal3: { bg: '#003087', fg: '#fff', label: 'PayPal', sub: 'Pay in 3', accent: '#009CDE' },
    laybuy: { bg: '#5C2E91', fg: '#fff', label: 'Laybuy', sub: '6 weekly payments' },
  };
  const s = styles[brand];
  return (
    <div style={{
      padding: '10px 8px', borderRadius: 8, textAlign: 'center',
      background: s.bg, color: s.fg,
    }}>
      <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: -0.2 }}>
        {brand === 'paypal3' ? <>Pay<span style={{ color: s.accent }}>Pal</span></> : s.label}
      </div>
      <div style={{ fontSize: 9, fontWeight: 600, opacity: 0.8, marginTop: 2 }}>{s.sub}</div>
    </div>
  );
}

window.WIZ_APP = { WizardPage, BookingWizard, PageHeader, TrustSidebar };
