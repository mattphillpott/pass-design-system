// Product page right-column — shared bits

const PRODUCT = {
  title: 'Functional Skills Maths Level 2 Exam',
  blurb: "Our Functional Skills Maths Level 2 exam & course can help you gain access to university or careers such as nursing, policing and teaching. The UK's number 1 Functional Skills course is designed to help you pass first time.",
  rrp: 179.00,
  price: 143.20,
  discountPct: 20,
  examCourseAddOn: 184, // "+£184 Extra" course bundle add-on, per the live site's step-3 bundle option
  spacesLeft: 8,
  passRate: 93,
  sittings: 5399,
  trustpilotRating: 4.7,
  trustpilotCount: 2148,
  bullets: [
    { icon: 'shield-check', text: 'Official Functional Skills Maths Level 2 — Ofqual-regulated' },
    { icon: 'award',        text: "UK's #1 course — highest pass rates, best-rated service" },
    { icon: 'home',         text: 'Sit the exam from home — fast-track results' },
    { icon: 'rotate-ccw',   text: 'FREE resit included with our Premium Course Bundle' },
    { icon: 'tag',          text: 'Price-match guarantee on like-for-like exams †' },
    { icon: 'gift',         text: 'Exam pack worth £119.99 included with every exam' },
  ],
};

function gbp(n, decimals = 2) {
  return '£' + n.toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

// ───────── Countdown ─────────
function useCountdown(targetMs) {
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, targetMs - now);
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
    secs: Math.floor((diff % 60000) / 1000),
  };
}
function getOfferTarget() {
  const k = 'pfsOfferTarget';
  const stored = sessionStorage.getItem(k);
  if (stored) return parseInt(stored, 10);
  const t = Date.now() + (2 * 86400000) + (8 * 3600000) + (42 * 60000);
  sessionStorage.setItem(k, String(t));
  return t;
}

// ───────── Trustpilot row ─────────
function TrustpilotRow({ compact = false }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: compact ? 12 : 13 }}>
      <span style={{ fontWeight: 700, color: '#101828' }}>Excellent</span>
      <span style={{ display: 'inline-flex', gap: 2 }}>
        {[0,1,2,3,4].map(i => (
          <span key={i} style={{
            width: compact ? 18 : 20, height: compact ? 18 : 20,
            background: '#00B67A', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: compact ? 12 : 14, fontWeight: 800, lineHeight: 1,
          }}>★</span>
        ))}
      </span>
      <span style={{ color: '#4A5565' }}>
        <strong style={{ color: '#101828' }}>{PRODUCT.trustpilotRating}</strong> · {PRODUCT.trustpilotCount.toLocaleString('en-GB')} reviews
      </span>
      <span style={{
        fontSize: 11, fontWeight: 800, color: '#00B67A', letterSpacing: -0.2,
        paddingLeft: 8, borderLeft: '1px solid #E5E7EB',
      }}>
        ★ Trustpilot
      </span>
    </div>
  );
}

// ───────── Awarding bodies row ─────────
function AwardingBodies({ size = 'md' }) {
  const h = size === 'sm' ? 22 : 28;
  const Body = ({ name, sub, color, mono }) => (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 8 }}>
      <span style={{
        width: h, height: h, borderRadius: 6, background: color, color: '#fff',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 800, fontSize: size === 'sm' ? 9 : 10, letterSpacing: 0.3,
        fontFamily: mono ? "'JetBrains Mono', monospace" : 'inherit',
      }}>{name}</span>
      <span style={{ fontSize: size === 'sm' ? 10 : 11, color: '#6A7282', fontWeight: 500, lineHeight: 1.2 }}>{sub}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      <Body name="Ofqual" sub="Regulated" color="#0B3D91"/>
      <Body name="Open" sub="Awards" color="#7C3AED"/>
      <Body name="TQUK" sub="Approved" color="#0E9F6E"/>
    </div>
  );
}

// ───────── BNPL compact row ─────────
function BnplCompactRow() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 14px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E5E7EB',
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 12, color: '#4A5565', fontWeight: 500, lineHeight: 1.4 }}>
        Spread the cost. <strong style={{ color: '#101828' }}>0% interest.</strong>
      </span>
      <div style={{ display: 'inline-flex', gap: 6, marginLeft: 'auto', flexWrap: 'wrap' }}>
        <BnplPill brand="klarna"/>
        <BnplPill brand="clearpay"/>
        <BnplPill brand="paypal"/>
        <BnplPill brand="laybuy"/>
      </div>
    </div>
  );
}
function BnplPill({ brand }) {
  const cfg = {
    klarna:   { bg: '#FFA8CD', fg: '#0B051D', label: 'Klarna.' },
    clearpay: { bg: '#B2FCE4', fg: '#0E1F1F', label: 'Clearpay' },
    paypal:   { bg: '#003087', fg: '#fff',   label: <>Pay<span style={{ color: '#009CDE' }}>Pal</span></> },
    laybuy:   { bg: '#5C2E91', fg: '#fff',   label: 'Laybuy' },
  }[brand];
  return (
    <span style={{
      padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 800,
      background: cfg.bg, color: cfg.fg, lineHeight: 1.2, letterSpacing: -0.2,
    }}>{cfg.label}</span>
  );
}

// ───────── Secure shopping row (footer) ─────────
function SecureFooter() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 16px', background: '#fff',
      borderTop: '1px solid #E5E7EB', flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        Secure shopping
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', borderRadius: 6, background: '#fff', border: '1px solid #E5E7EB',
      }}>
        <span style={{ display: 'inline-flex', gap: 1 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: '#EB001B' }}/>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: '#F79E1B', marginLeft: -4 }}/>
        </span>
        <span style={{ fontSize: 9, fontWeight: 700, color: '#101828', lineHeight: 1.1 }}>
          SecureCode<br/><span style={{ fontWeight: 500, color: '#6A7282' }}>by Mastercard</span>
        </span>
      </span>
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', borderRadius: 6, background: '#1A1F71', color: '#fff',
      }}>
        <span style={{ fontStyle: 'italic', fontWeight: 800, fontSize: 11, color: '#F7B600' }}>VISA</span>
        <span style={{ fontSize: 9, fontWeight: 600, lineHeight: 1.1 }}>Verified<br/>by Visa</span>
      </span>
      <span style={{ marginLeft: 'auto', fontSize: 11, color: '#98A2B3' }}>256-bit SSL · PCI-DSS Level 1</span>
    </div>
  );
}

// ───────── Bullets ─────────
function BulletList({ bullets = PRODUCT.bullets, compact = false }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: compact ? 8 : 10 }}>
      {bullets.map((b, i) => (
        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: compact ? 13 : 14, color: '#101828', lineHeight: 1.5 }}>
          <span style={{
            width: 22, height: 22, borderRadius: 999, flexShrink: 0,
            background: '#DBFEDA', color: '#0F8610',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginTop: 1,
          }}>
            <PFSIcon name="check" size={14} color="#0F8610"/>
          </span>
          <span dangerouslySetInnerHTML={{ __html: b.text.replace(/\b(UK's #1 course|FREE resit|Price-match guarantee|Ofqual-regulated|fast-track results|£119\.99)\b/g, '<strong>$1</strong>') }}/>
        </li>
      ))}
    </ul>
  );
}

// ───────── Pass-rate strip ─────────
function PassRateStrip() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'center',
      padding: '18px 20px', borderRadius: 14,
      background: 'linear-gradient(95deg, #1F2937 0%, #344054 100%)',
      color: '#fff', boxShadow: '0 8px 24px -10px rgba(31,41,55,0.35)',
    }}>
      <div style={{
        fontSize: 44, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.04em',
        color: '#42E741',
      }}>{PRODUCT.passRate}<span style={{ fontSize: 24, color: '#fff' }}>%</span></div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>
          of students pass their exam when completing the PFS Course
        </div>
        <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>
          Based on {PRODUCT.sittings.toLocaleString('en-GB')} Pass Functional Skills Maths Level 2 exam sittings
        </div>
      </div>
    </div>
  );
}

// ───────── Live countdown chip ─────────
function CountdownChip({ tone = 'amber' }) {
  const t = useCountdown(getOfferTarget());
  const pad = n => String(n).padStart(2, '0');
  const colors = tone === 'amber'
    ? { bg: '#FFF7ED', border: '#FED7AA', fg: '#9A3412', tile: '#fff' }
    : { bg: '#FEF2F2', border: '#FECACA', fg: '#991B1B', tile: '#fff' };
  const Tile = ({ v, label }) => (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}>
      <span style={{
        background: colors.tile, padding: '2px 6px', borderRadius: 4,
        fontWeight: 800, fontSize: 13, fontVariantNumeric: 'tabular-nums', minWidth: 26, textAlign: 'center',
      }}>{pad(v)}</span>
      <span style={{ fontSize: 8, marginTop: 1, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</span>
    </span>
  );
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 10px',
      borderRadius: 999, background: colors.bg, border: `1px solid ${colors.border}`, color: colors.fg,
      fontSize: 12, fontWeight: 600,
    }}>
      <PFSIcon name="clock" size={14} color={colors.fg}/>
      Offer ends in
      <span style={{ display: 'inline-flex', gap: 4 }}>
        <Tile v={t.days} label="d"/><Tile v={t.hours} label="h"/><Tile v={t.mins} label="m"/><Tile v={t.secs} label="s"/>
      </span>
    </span>
  );
}

// ───────── Live activity ticker (social proof) ─────────
const TICKER_ITEMS = [
  'Chloe in Bristol booked 6 minutes ago',
  'Jordan in Leeds booked 14 minutes ago',
  'Priya in Manchester booked 22 minutes ago',
  'Sam in Cardiff booked 31 minutes ago',
];
function LiveActivityTicker() {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const id = setInterval(() => setI(v => (v + 1) % TICKER_ITEMS.length), 4000);
    return () => clearInterval(id);
  }, []);
  return (
    <React.Fragment>
      <style>{'@keyframes pfsPulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(2.2);opacity:0}}@keyframes pfsFadeIn{from{opacity:0;transform:translateY(2px)}to{opacity:1;transform:translateY(0)}}'}</style>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: '#F9FAFB', border: '1px solid #E5E7EB', fontSize: 12, color: '#4A5565', fontWeight: 500 }}>
        <span style={{ position: 'relative', width: 8, height: 8, borderRadius: 999, background: '#0FBC0F', flexShrink: 0, display: 'inline-flex' }}>
          <span style={{ position: 'absolute', inset: 0, borderRadius: 999, background: '#0FBC0F', opacity: 0.6, animation: 'pfsPulse 1.8s ease-out infinite' }}/>
        </span>
        <span key={i} style={{ animation: 'pfsFadeIn .3s ease-out' }}>{TICKER_ITEMS[i]}</span>
      </div>
    </React.Fragment>
  );
}

window.PRODUCT_SHARED = {
  PRODUCT, gbp,
  TrustpilotRow, AwardingBodies, BnplCompactRow, SecureFooter,
  BulletList, PassRateStrip, CountdownChip, LiveActivityTicker,
};
