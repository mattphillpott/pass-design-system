// Booking Wizard — shared utilities, mock data, base UI primitives
// Pass Design System (green primary #0FBC0F, Inter, 12px radii)

const PHONE = '020 4574 9155';
const HOURS = 'Mon–Fri 08:45–20:00 · Sat 09:30–16:00';

// ───────── Pricing model ─────────
const BASE_PRICE = 179.00;          // original price shown crossed-out
const HUMAN_PREMIUM = 0;            // human invigilation = base
const AUTO_DISCOUNT = -16;          // automated saves £16
const COURSE_NONE = 0;
const COURSE_STANDARD = 184;        // bundle add-on
const COURSE_PREMIUM = 284;         // includes free resit

// Discount ladder — different days have different demand pricing.
// Returns a number 0..0.32 representing % off
function dayDiscount(date) {
  const d = new Date(date);
  const day = d.getDay();          // 0 Sun … 6 Sat
  const dom = d.getDate();
  // Cheaper midweek and earlier-in-month
  let pct = 0.20;
  if (day === 0 || day === 6) pct = 0.05;       // weekends — barely any
  else if (day === 2 || day === 3) pct = 0.30;  // Tue/Wed — best value
  else if (day === 1 || day === 4) pct = 0.22;  // Mon/Thu
  else if (day === 5) pct = 0.10;               // Fri
  if (dom >= 24) pct = Math.max(0.04, pct - 0.10); // end-of-month nearly full price (urgency)
  return pct;
}
function timeDiscount(slot) {
  // slot is HH:MM 24h. Off-peak = bigger discount
  const h = parseInt(slot.split(':')[0], 10);
  if (h <= 9 || h >= 17) return 0.05;     // popular slots — small discount
  if (h >= 13 && h <= 14) return 0.20;    // lunchtime — best
  return 0.10;
}
function priceFor(date, slot, invigilation, course) {
  const day = dayDiscount(date);
  const time = slot ? timeDiscount(slot) : 0;
  const blend = Math.min(0.35, day * 0.7 + time * 0.5);
  const examPrice = BASE_PRICE * (1 - blend);
  const inv = invigilation === 'auto' ? AUTO_DISCOUNT : HUMAN_PREMIUM;
  const c = course === 'standard' ? COURSE_STANDARD : course === 'premium' ? COURSE_PREMIUM : 0;
  return Math.round((examPrice + inv + c) * 100) / 100;
}
function gbp(n) {
  return '£' + n.toFixed(2);
}
// Validation helpers
const validators = {
  firstName: v => (v || '').trim().length >= 2 ? '' : 'Please enter your first name.',
  lastName:  v => (v || '').trim().length >= 2 ? '' : 'Please enter your last name.',
  email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '') ? '' : 'Enter a valid email address.',
  phone:     v => /^[0-9 +()-]{9,}$/.test((v || '').trim()) ? '' : 'Enter a valid UK phone number.',
};

// ───────── Spaces remaining heuristic ─────────
function spacesLeft(date, slot) {
  // Deterministic-ish from the date
  const d = new Date(date);
  const seed = (d.getDate() * 31 + d.getMonth() * 7 + (slot ? parseInt(slot) : 0)) % 12;
  return 2 + seed;  // 2..13
}

// ───────── Date utilities ─────────
const DAY_LABELS_SHORT = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const MONTH_LABELS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth()+1).padStart(2,'0'), day = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${day}`;
}
function fromIso(iso) { const [y,m,d] = iso.split('-').map(Number); return new Date(y, m-1, d); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate()+n); return x; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth()+1, 0).getDate(); }
// Mon=0..Sun=6 weekday index
function mondayIndex(d) { return (d.getDay() + 6) % 7; }

// ───────── Time slots ─────────
const TIME_SLOTS = [
  '08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'
];

// ───────── Logo ─────────
function PassLogo({ height = 32, dark = false }) {
  return (
    <img
      src={dark ? "../assets/logos/pass-wordmark-on-dark.svg" : "../assets/logos/pass-wordmark.svg"}
      alt="Pass"
      style={{ height, display: 'block' }}
    />
  );
}

// ───────── Reusable Field with on-blur validation ─────────
function Field({ label, error, hint, required, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: '#101828' }}>
        {label} {required && <span style={{ color: '#C70036' }}>*</span>}
      </span>
      {children}
      {error
        ? <span style={{ fontSize: 12, color: '#C70036', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <PFSIcon name="x-circle" size={14} color="#C70036"/>{error}
          </span>
        : hint
          ? <span style={{ fontSize: 12, color: '#6A7282' }}>{hint}</span>
          : null}
    </label>
  );
}

// ───────── Trust pill ─────────
function TrustPill({ icon, title, sub }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 14px', background: '#fff',
      border: '1px solid #E5E7EB', borderRadius: 12,
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 8, flexShrink: 0,
        background: '#F0FEEF', color: '#0F8610',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <PFSIcon name={icon} size={18} color="#0F8610"/>
      </span>
      <div style={{ minWidth: 0, lineHeight: 1.25 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#101828' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#4A5565', marginTop: 2 }}>{sub}</div>
      </div>
    </div>
  );
}

// ───────── Saving badge ─────────
function SaveBadge({ amount }) {
  if (!amount || amount <= 0) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: '#0FBC0F', color: '#fff',
      fontSize: 11, fontWeight: 700, padding: '3px 8px',
      borderRadius: 999, letterSpacing: 0.2,
    }}>
      <PFSIcon name="trending-down" size={12} color="#fff"/> Save {gbp(amount)}
    </span>
  );
}

window.WIZ = {
  PHONE, HOURS, BASE_PRICE,
  priceFor, gbp, validators, spacesLeft,
  DAY_LABELS_SHORT, MONTH_LABELS,
  isoDate, fromIso, addDays, startOfMonth, daysInMonth, mondayIndex,
  TIME_SLOTS,
  dayDiscount, timeDiscount,
  PassLogo, Field, TrustPill, SaveBadge,
};
