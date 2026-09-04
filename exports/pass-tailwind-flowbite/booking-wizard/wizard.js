/* Pass Booking Wizard — vanilla JS state + renderers
 * No framework. No build step. Tailwind v4 utility classes + Flowbite JS.
 *
 * State shape:
 *   {
 *     step: 0..4, maxReached: 0..4, direction: 1 | -1,
 *     stepNav: 'numbered' | 'bar' | 'chips',
 *     dateLayout: 'split' | 'heatmap' | 'list',
 *     firstName, lastName, email, phone,
 *     invigilation: 'human' | 'auto',
 *     date: 'YYYY-MM-DD' | null, time: 'HH:MM' | null,
 *     course: 'none' | 'standard' | 'premium',
 *     portalEmail, portalPassword,
 *     payment: 'card' | 'paypal' | 'klarna' | 'clearpay' | 'applepay' | 'googlepay',
 *     errors: {...},
 *     calendarView: Date (start of month),
 *   }
 */

// ════════════════════════════════════════════════════════════════
//   PRICING MODEL
// ════════════════════════════════════════════════════════════════

const BASE_PRICE = 179.00;
const AUTO_DISCOUNT = -16;
const COURSE_STANDARD = 184;
const COURSE_PREMIUM = 284;

function dayDiscount(iso) {
  const d = new Date(iso);
  const day = d.getDay();      // 0 Sun … 6 Sat
  const dom = d.getDate();
  let pct = 0.20;
  if (day === 0 || day === 6) pct = 0.05;
  else if (day === 2 || day === 3) pct = 0.30;
  else if (day === 1 || day === 4) pct = 0.22;
  else if (day === 5) pct = 0.10;
  if (dom >= 24) pct = Math.max(0.04, pct - 0.10);
  return pct;
}
function timeDiscount(slot) {
  const h = parseInt(slot.split(':')[0], 10);
  if (h <= 9 || h >= 17) return 0.05;
  if (h >= 13 && h <= 14) return 0.20;
  return 0.10;
}
function priceFor(iso, slot, invigilation, course) {
  const day = dayDiscount(iso);
  const time = slot ? timeDiscount(slot) : 0;
  const blend = Math.min(0.35, day * 0.7 + time * 0.5);
  const examPrice = BASE_PRICE * (1 - blend);
  const inv = invigilation === 'auto' ? AUTO_DISCOUNT : 0;
  const c = course === 'standard' ? COURSE_STANDARD : course === 'premium' ? COURSE_PREMIUM : 0;
  return Math.round((examPrice + inv + c) * 100) / 100;
}
function gbp(n) { return '£' + n.toFixed(2); }

function spacesLeft(iso, slot) {
  const d = new Date(iso);
  const seed = (d.getDate() * 31 + d.getMonth() * 7 + (slot ? parseInt(slot, 10) : 0)) % 12;
  return 2 + seed;
}

// ════════════════════════════════════════════════════════════════
//   DATE UTILITIES
// ════════════════════════════════════════════════════════════════

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const TIME_SLOTS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

function isoDate(d) {
  const y = d.getFullYear(), m = String(d.getMonth() + 1).padStart(2, '0'), day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function fromIso(iso) { const [y,m,d] = iso.split('-').map(Number); return new Date(y, m - 1, d); }
function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function startOfMonth(d) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function daysInMonth(d) { return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate(); }
function mondayIndex(d) { return (d.getDay() + 6) % 7; }
function prettyDate(iso) {
  const d = fromIso(iso);
  return `${DAYS_SHORT[mondayIndex(d)]} ${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`;
}
function nextWeekday() { return isoDate(addDays(new Date(), 7)); }

function monthCells(view) {
  const today = new Date();
  const dim = daysInMonth(view);
  const lead = mondayIndex(view);
  const arr = [];
  for (let i = 0; i < lead; i++) arr.push(null);
  for (let day = 1; day <= dim; day++) {
    const d = new Date(view.getFullYear(), view.getMonth(), day);
    arr.push({ day, iso: isoDate(d), past: d < new Date(today.getFullYear(), today.getMonth(), today.getDate()) });
  }
  return arr;
}

// Tailwind classes per price tier (greener = cheaper)
function heatClasses(pct) {
  if (pct >= 0.25) return { bg: 'bg-primary-600', fg: 'text-white', label: 'Cheapest' };
  if (pct >= 0.18) return { bg: 'bg-primary-400', fg: 'text-primary-950', label: 'Great' };
  if (pct >= 0.12) return { bg: 'bg-primary-100', fg: 'text-primary-800', label: 'Good' };
  if (pct >= 0.07) return { bg: 'bg-yellow-100', fg: 'text-yellow-800', label: 'Average' };
  if (pct >= 0.03) return { bg: 'bg-orange-200', fg: 'text-orange-900', label: 'High' };
  return { bg: 'bg-red-100', fg: 'text-red-800', label: 'Most expensive' };
}

// ════════════════════════════════════════════════════════════════
//   VALIDATION
// ════════════════════════════════════════════════════════════════

const validators = {
  firstName: v => (v || '').trim().length >= 2 ? '' : 'Please enter your first name.',
  lastName:  v => (v || '').trim().length >= 2 ? '' : 'Please enter your last name.',
  email:     v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v || '') ? '' : 'Enter a valid email address.',
  phone:     v => /^[0-9 +()-]{9,}$/.test((v || '').trim()) ? '' : 'Enter a valid UK phone number.',
};

function passwordStrength(pw) {
  if (!pw) return { score: 0, label: 'Enter a password', cls: 'bg-gray-200', text: 'text-gray-500' };
  let s = 0;
  if (pw.length >= 12) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  if (pw.length >= 16) s++;
  const map = [
    { label: 'Too weak',   cls: 'bg-red-600',     text: 'text-red-700' },
    { label: 'Weak',       cls: 'bg-red-500',     text: 'text-red-700' },
    { label: 'Fair',       cls: 'bg-yellow-500',  text: 'text-yellow-700' },
    { label: 'Good',       cls: 'bg-green-500',   text: 'text-green-700' },
    { label: 'Strong',     cls: 'bg-primary-600', text: 'text-primary-700' },
    { label: 'Very strong',cls: 'bg-primary-700', text: 'text-primary-700' },
  ];
  return { score: s, ...map[s] };
}
function validatePassword(pw) {
  if (!pw || pw.length < 12) return 'Password must be at least 12 characters.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must include a special character.';
  return '';
}

// ════════════════════════════════════════════════════════════════
//   STATE
// ════════════════════════════════════════════════════════════════

const STEP_LABELS = ['Your details', 'Invigilation', 'Date & time', 'Course', 'Checkout'];
const STEP_DESCRIPTIONS = [
  "We need a few quick details so we can email and text your booking confirmation.",
  "Choose how you'd like to be invigilated. Both methods are Ofqual-regulated.",
  "Pick the day and time that suits you. Prices vary — pick a green day to save more.",
  "Boost your pass rate with a course bundle. 93% pass first-time with Premium.",
  "Pay securely. Your booking is locked in the moment payment is confirmed.",
];

const initialView = (() => {
  const d = fromIso(nextWeekday());
  return startOfMonth(d);
})();

const wizState = (() => {
  const subscribers = [];
  let state = {
    step: 0, maxReached: 0, direction: 1,
    stepNav: 'numbered', dateLayout: 'split',
    firstName: '', lastName: '', email: '', phone: '',
    invigilation: 'human',
    date: null, time: null,
    course: 'none',
    portalEmail: '', portalPassword: '',
    payment: 'card',
    errors: {},
    calendarView: initialView,
  };
  return {
    get: () => state,
    set: (patch) => { state = { ...state, ...patch }; subscribers.forEach(fn => fn(state)); },
    subscribe: (fn) => { subscribers.push(fn); return () => { const i = subscribers.indexOf(fn); if (i >= 0) subscribers.splice(i, 1); }; },
  };
})();
window.wizState = wizState;

// ════════════════════════════════════════════════════════════════
//   STEP NAVIGATION
// ════════════════════════════════════════════════════════════════

function canAdvance(state) {
  if (state.step === 0) {
    return !validators.firstName(state.firstName)
      && !validators.lastName(state.lastName)
      && !validators.email(state.email)
      && !validators.phone(state.phone);
  }
  if (state.step === 1) return !!state.invigilation;
  if (state.step === 2) return !!state.date && !!state.time;
  if (state.step === 3) {
    if (state.course === 'standard' || state.course === 'premium') {
      if (validators.email(state.portalEmail || state.email)) return false;
      if (validatePassword(state.portalPassword || '')) return false;
    }
    return !!state.course;
  }
  if (state.step === 4) return !!state.payment;
  return true;
}

function gotoStep(n) {
  const s = wizState.get();
  const next = Math.max(0, Math.min(STEP_LABELS.length - 1, n));
  wizState.set({
    step: next,
    direction: next > s.step ? 1 : -1,
    maxReached: Math.max(s.maxReached, next),
  });
}

function nextStep() {
  const s = wizState.get();
  if (s.step === 0) {
    const errors = {
      firstName: validators.firstName(s.firstName),
      lastName: validators.lastName(s.lastName),
      email: validators.email(s.email),
      phone: validators.phone(s.phone),
    };
    wizState.set({ errors });
    if (Object.values(errors).some(Boolean)) return;
  }
  if (!canAdvance(s)) return;
  gotoStep(s.step + 1);
}
function prevStep() { gotoStep(wizState.get().step - 1); }

// ════════════════════════════════════════════════════════════════
//   STEP NAV VARIANTS
// ════════════════════════════════════════════════════════════════

function renderStepNavNumbered(s) {
  return `<ol class="flex items-center w-full text-xs sm:text-sm font-medium text-gray-500">
  ${STEP_LABELS.map((label, i) => {
    const isActive = i === s.step;
    const isDone = i < s.step;
    const reachable = i <= s.maxReached;
    const dotCls = isActive
      ? 'bg-primary-600 text-white ring-2 ring-primary-600'
      : isDone
        ? 'bg-primary-100 text-primary-700'
        : 'bg-gray-100 text-gray-500';
    const txtCls = isActive ? 'text-gray-900' : isDone ? 'text-primary-700' : 'text-gray-500';
    return `<li class="flex md:w-full items-center ${i < STEP_LABELS.length - 1 ? `after:content-[''] after:w-full after:h-px after:border-b after:hidden sm:after:inline-block after:mx-3 xl:after:mx-6 ${i < s.step ? 'after:border-primary-600' : 'after:border-gray-200'}` : ''}">
      <button type="button" data-action="goto-step" data-step="${i}" ${reachable ? '' : 'disabled'}
        class="flex items-center gap-2 ${reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'} hover:opacity-90 transition">
        <span class="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${dotCls}">
          ${isDone
            ? `<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>`
            : i + 1}
        </span>
        <span class="hidden sm:inline ${txtCls} whitespace-nowrap">${label}</span>
      </button>
    </li>`;
  }).join('')}
</ol>`;
}
function renderStepNavBar(s) {
  const pct = ((s.step + 1) / STEP_LABELS.length) * 100;
  return `<div>
    <div class="flex justify-between items-baseline mb-2">
      <div>
        <div class="text-xs font-bold uppercase tracking-wide text-primary-700">Step ${s.step + 1} of ${STEP_LABELS.length}</div>
        <div class="text-base font-bold text-gray-900 mt-0.5">${STEP_LABELS[s.step]}</div>
      </div>
      <div class="flex gap-1.5">
        ${STEP_LABELS.map((_, i) => {
          const reachable = i <= s.maxReached;
          const cls = i === s.step
            ? 'bg-primary-600 text-white ring-2 ring-primary-600 ring-offset-1'
            : i < s.step ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400';
          return `<button data-action="goto-step" data-step="${i}" ${reachable ? '' : 'disabled'}
            class="w-5 h-5 rounded-full text-[10px] font-bold ${cls} ${reachable ? 'cursor-pointer' : 'cursor-not-allowed'}">${i + 1}</button>`;
        }).join('')}
      </div>
    </div>
    <div class="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
      <div class="h-full rounded-full bg-gradient-to-r from-primary-600 to-primary-500 transition-all duration-500" style="width: ${pct}%"></div>
    </div>
  </div>`;
}
function renderStepNavChips(s) {
  return `<div class="flex flex-wrap gap-2">
    ${STEP_LABELS.map((label, i) => {
      const reachable = i <= s.maxReached;
      const active = i === s.step;
      const done = i < s.step;
      const cls = active
        ? 'bg-primary-600 border-primary-600 text-white'
        : done
          ? 'bg-primary-50 border-primary-200 text-primary-700'
          : 'bg-white border-gray-200 text-gray-600';
      const dot = active
        ? 'bg-white/25 text-white'
        : done ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-500';
      return `<button type="button" data-action="goto-step" data-step="${i}" ${reachable ? '' : 'disabled'}
        class="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-semibold border-2 transition ${cls} ${reachable ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}">
        <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full text-[10px] font-bold ${dot}">${done ? '✓' : i + 1}</span>
        ${label}
      </button>`;
    }).join('')}
  </div>`;
}
function renderStepNav(s) {
  if (s.stepNav === 'bar') return renderStepNavBar(s);
  if (s.stepNav === 'chips') return renderStepNavChips(s);
  return renderStepNavNumbered(s);
}

// ════════════════════════════════════════════════════════════════
//   STEP 1 — DETAILS
// ════════════════════════════════════════════════════════════════

function field(label, name, type, placeholder, value, error, hint, required = true) {
  return `<label class="block">
    <span class="block text-sm font-semibold text-gray-900 mb-1.5">${label} ${required ? '<span class="text-red-600">*</span>' : ''}</span>
    <input type="${type}" name="${name}" value="${value || ''}" placeholder="${placeholder}"
      data-action="field-input" data-field="${name}"
      class="block w-full h-10 px-4 text-sm bg-white text-gray-900 rounded-lg
             ${error ? 'border-2 border-red-600 bg-red-50' : 'border border-gray-200 focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25'}
             placeholder:text-gray-400 focus:outline-none transition">
    ${error
      ? `<span class="mt-1.5 inline-flex items-center gap-1.5 text-xs text-red-700"><svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M11 7h2v6h-2zm0 8h2v2h-2z" fill="white"/></svg>${error}</span>`
      : hint ? `<span class="mt-1.5 block text-xs text-gray-500">${hint}</span>` : ''}
  </label>`;
}

function renderStep1Details(s) {
  return `<div class="flex flex-col gap-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${field('First name', 'firstName', 'text', 'Jordan', s.firstName, s.errors.firstName)}
      ${field('Last name', 'lastName', 'text', 'Mitchell', s.lastName, s.errors.lastName)}
    </div>
    ${field('Email address', 'email', 'email', 'you@email.com', s.email, s.errors.email, "Booking confirmation and joining link will be sent here.")}
    ${field('Mobile number', 'phone', 'tel', '07…', s.phone, s.errors.phone, "We'll text you a reminder 24h before your exam.")}

    <div class="flex items-center gap-3 p-3.5 bg-primary-50 border border-primary-200 rounded-xl">
      <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white shrink-0">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M8 11V7a4 4 0 018 0v4"/></svg>
      </span>
      <p class="text-sm text-primary-800 leading-relaxed">Your details are encrypted and never shared. We only use them to confirm your booking and exam invigilation.</p>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
//   STEP 2 — INVIGILATION
// ════════════════════════════════════════════════════════════════

const INVIG_OPTIONS = [
  {
    id: 'human',
    title: 'Online human invigilation',
    priceLabel: 'No extra charge',
    tag: 'Most popular', tagCls: 'bg-gray-900 text-white',
    blurb: 'A real exam invigilator joins you live via webcam. Best for first-time learners or anyone who wants 1-to-1 reassurance during setup.',
    bullets: [
      ['M16 11c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm-8 0c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm8 0c-.3 0-.6 0-.9.1 1.2.8 2.1 2 2.1 3.4V19h6v-2.5c0-2.3-4.7-3.5-7.2-3.5z', 'Real person on the call'],
      ['M12 8v5l4 2-.7 1.4L11 14V8zm0-6a10 10 0 100 20 10 10 0 000-20z', 'Results in 6–16 working days'],
      ['M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5z', 'Awarded by Open Awards'],
      ['M18 8a3 3 0 100-6 3 3 0 000 6zM2 19v2h4v-2c0-3.3 2.7-6 6-6s6 2.7 6 6v2h4v-2c0-5.5-4.5-10-10-10S2 13.5 2 19z', 'Live setup support'],
    ],
  },
  {
    id: 'auto',
    title: 'Online remote invigilation',
    priceLabel: '−£16.00',
    tag: 'Save £16', tagCls: 'bg-primary-600 text-white',
    blurb: 'AI-monitored exam recording reviewed afterwards. Sit any time, anywhere — perfect if you want maximum flexibility on date, time and location.',
    bullets: [
      ['M17 10.5V7c0-.6-.4-1-1-1H4c-.6 0-1 .4-1 1v10c0 .6.4 1 1 1h12c.6 0 1-.4 1-1v-3.5l4 4v-11z', 'Recorded and reviewed later'],
      ['M11 21h-1l1-7H7l5-9h1l-1 7h4z', 'Results in 2–6 working days'],
      ['M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5z', 'Awarded by TQUK'],
      ['M12 2a10 10 0 110 20 10 10 0 010-20zm0 2C7 4 4 7 4 12s3 8 8 8 8-3 8-8-3-8-8-8zm-1 4h2v6h-2zm0 7h2v2h-2z', 'Sit from anywhere, any time'],
    ],
  },
];

function renderStep2Invigilation(s) {
  return `<div class="flex flex-col gap-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      ${INVIG_OPTIONS.map(o => {
        const active = s.invigilation === o.id;
        return `<button type="button" data-action="set-invigilation" data-value="${o.id}"
          class="relative text-left p-5 rounded-2xl border-2 transition
                 ${active ? 'border-primary-600 bg-primary-50 shadow-lg shadow-primary-600/15' : 'border-gray-200 bg-white hover:border-gray-300'}">
          <span class="absolute -top-2.5 right-4 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${o.tagCls}">${o.tag}</span>

          <div class="flex items-start gap-3">
            <span class="w-5 h-5 mt-1 rounded-full shrink-0 ${active ? 'bg-white border-[6px] border-primary-600' : 'bg-white border-2 border-gray-300'}"></span>
            <div class="flex-1 min-w-0">
              <div class="text-lg font-bold text-gray-900 -tracking-tight">${o.title}</div>
              <div class="text-sm font-semibold text-primary-700 mt-0.5">${o.priceLabel}</div>
            </div>
          </div>

          <p class="my-3.5 text-sm text-gray-700 leading-relaxed">${o.blurb}</p>

          <ul class="list-none p-0 m-0 grid gap-2">
            ${o.bullets.map(([d, t]) => `<li class="flex items-center gap-2.5 text-sm text-gray-700">
              <span class="inline-flex items-center justify-center w-[22px] h-[22px] rounded-md ${active ? 'bg-primary-100' : 'bg-gray-100'} text-primary-700">
                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="${d}"/></svg>
              </span>${t}
            </li>`).join('')}
          </ul>
        </button>`;
      }).join('')}
    </div>

    <div class="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
      <svg class="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22zm0 6l8 14H4zm-1 4h2v5h-2zm0 7h2v2h-2z"/></svg>
      Both methods are Ofqual-regulated. The qualification is identical — only the invigilation differs.
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
//   STEP 3 — DATE & TIME (split layout)
// ════════════════════════════════════════════════════════════════

function renderCalendarMonth(s) {
  const view = s.calendarView;
  const cells = monthCells(view);
  return `<div>
    <div class="flex items-center justify-between mb-3">
      <button type="button" data-action="cal-prev"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
      </button>
      <div class="text-lg font-bold text-gray-900 -tracking-tight">${MONTHS[view.getMonth()]} ${view.getFullYear()}</div>
      <button type="button" data-action="cal-next"
        class="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-gray-200 bg-white hover:bg-gray-100">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
      </button>
    </div>

    <div class="grid grid-cols-7 gap-1">
      ${DAYS_SHORT.map(d => `<div class="text-[11px] font-semibold text-gray-500 text-center py-1.5">${d}</div>`).join('')}
      ${cells.map((c, i) => {
        if (!c) return `<div></div>`;
        const price = priceFor(c.iso, null, s.invigilation, 'none');
        const pct = dayDiscount(c.iso);
        const tag = heatClasses(pct);
        const active = s.date === c.iso;
        const ring = active ? 'ring-2 ring-offset-1 ring-primary-950 shadow-lg' : 'ring-1 ring-black/5';
        return `<button type="button" data-action="pick-date" data-iso="${c.iso}" ${c.past ? 'disabled' : ''}
          class="aspect-square p-1 rounded-lg flex flex-col items-center justify-center gap-0.5 text-center transition
                 ${c.past ? 'bg-gray-50 text-gray-300 cursor-not-allowed opacity-50' : `${tag.bg} ${tag.fg} ${ring} hover:scale-105`}">
          <div class="text-[10px] font-semibold opacity-75 leading-none">${c.day}</div>
          ${!c.past ? `
            <div class="text-[9px] font-medium opacity-60 leading-none line-through">${gbp(Math.round(BASE_PRICE))}</div>
            <div class="text-sm font-extrabold leading-none -tracking-tight">${gbp(Math.round(price))}</div>
          ` : ''}
        </button>`;
      }).join('')}
    </div>

    <!-- Legend -->
    <div class="flex items-center justify-between flex-wrap gap-2 mt-4 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
      <span class="text-xs font-semibold text-red-700">← Higher price</span>
      <div class="flex gap-1 flex-1 justify-center flex-wrap">
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-bold">Most expensive</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-orange-200 text-orange-900 font-bold">High</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800 font-bold">Average</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-100 text-primary-800 font-bold">Good</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-400 text-primary-950 font-bold">Great</span>
        <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-primary-600 text-white font-bold">Cheapest</span>
      </div>
      <span class="text-xs font-semibold text-primary-700">Lower price →</span>
    </div>
  </div>`;
}

function renderTimeSlots(s) {
  if (!s.date) return `<div class="p-5 text-center text-sm text-gray-400 border border-dashed border-gray-200 rounded-xl">Slots, prices and availability will appear here.</div>`;
  return `<div class="grid grid-cols-1 gap-2">
    ${TIME_SLOTS.map(slot => {
      const price = priceFor(s.date, slot, s.invigilation, 'none');
      const save = BASE_PRICE - price;
      const active = s.time === slot;
      const left = spacesLeft(s.date, slot);
      const sold = left === 0;
      return `<button type="button" data-action="pick-time" data-time="${slot}" ${sold ? 'disabled' : ''}
        class="flex items-center justify-between gap-3 p-3 rounded-lg text-left transition
               ${active ? 'border-2 border-primary-600 bg-primary-50' : 'border border-gray-200 bg-white hover:border-gray-300'}
               ${sold ? 'opacity-50 cursor-not-allowed' : ''}">
        <div>
          <div class="text-sm font-bold text-gray-900">${slot}</div>
          <div class="text-[11px] font-medium mt-0.5 ${left <= 3 && !sold ? 'text-red-600' : 'text-gray-500'}">${sold ? 'Sold out' : left <= 3 ? `Only ${left} left` : `${left} spaces`}</div>
        </div>
        <div class="text-right">
          <div class="text-sm font-extrabold text-primary-700">${gbp(price)}</div>
          ${save > 0 ? `<div class="text-[10px] text-gray-400 line-through">${gbp(BASE_PRICE)}</div>` : ''}
        </div>
      </button>`;
    }).join('')}
  </div>`;
}

function renderStep3DateTime(s) {
  return `<div class="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
    <div>
      <div class="flex gap-2 mb-3">
        <button type="button" data-action="pick-earliest"
          class="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-900 hover:bg-gray-100">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M11 21h-1l1-7H7l5-9h1l-1 7h4z"/></svg>
          Select earliest date
        </button>
        <button type="button" data-action="pick-cheapest"
          class="flex-1 inline-flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-lg text-xs font-semibold bg-primary-50 border border-primary-200 text-primary-700 hover:bg-primary-100">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7l6 6 4-4 8 8v-6h-2v3l-6-6-4 4-6-6z"/></svg>
          Select cheapest date
        </button>
      </div>
      ${renderCalendarMonth(s)}
    </div>

    <div>
      <div class="text-sm font-bold text-gray-900 mb-2.5">
        ${s.date ? `Slots for ${prettyDate(s.date)}` : 'Select a date first'}
      </div>
      ${renderTimeSlots(s)}
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
//   STEP 4 — COURSE
// ════════════════════════════════════════════════════════════════

const COURSE_TIERS = [
  {
    id: 'none', name: 'Exam only', priceDelta: 0,
    blurb: "Just the exam. Best if you're already exam-ready.",
    features: [
      [true, 'Official Functional Skills exam'],
      [false, 'No course access'],
      [false, 'No practice questions'],
      [false, 'No tutor support'],
    ],
  },
  {
    id: 'standard', name: 'Standard course', priceDelta: 184,
    tag: 'Best for most', tagCls: 'bg-gray-900 text-white',
    blurb: '3-month access to the full course + the exam. Pass rate 87%.',
    features: [
      [true, 'Everything in Exam only'],
      [true, '3 months full course access'],
      [true, '500+ practice questions'],
      [true, 'Email tutor support'],
      [false, 'Free resit if you fail'],
    ],
  },
  {
    id: 'premium', name: 'Premium bundle', priceDelta: 284,
    tag: 'Highest pass rate', tagCls: 'bg-primary-600 text-white',
    blurb: '12-month course access + free resit included. Pass rate 93%.',
    features: [
      [true, 'Everything in Standard'],
      [true, '12 months full access'],
      [true, '1-to-1 video tutor sessions'],
      [true, 'Mock exams marked by examiners'],
      [true, 'FREE resit if you don\'t pass'],
    ],
  },
];

function renderStep4Course(s) {
  const showCreds = s.course === 'standard' || s.course === 'premium';
  return `<div class="flex flex-col gap-4">
    <div class="flex items-center gap-3 p-4 rounded-xl bg-primary-700 text-white text-sm">
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 17l6-6 4 4 8-8v6h-2V10l-6 6-4-4-6 6z"/></svg>
      <span><strong>93% of students pass first time</strong> when they bundle the Premium course.</span>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      ${COURSE_TIERS.map(t => {
        const active = s.course === t.id;
        const popular = t.id === 'standard';
        const borderCls = active
          ? 'border-primary-600 bg-primary-50'
          : popular ? 'border-primary-200' : 'border-gray-200';
        return `<button type="button" data-action="set-course" data-value="${t.id}"
          class="relative text-left p-5 rounded-2xl border-2 transition bg-white ${borderCls}
                 ${popular ? '-translate-y-1 shadow-xl shadow-primary-600/15' : ''}
                 hover:border-primary-300 ${popular ? 'pt-7' : ''}">
          ${t.tag ? `<span class="absolute -top-2.5 left-4 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${t.tagCls}">${t.tag}</span>` : ''}
          <div class="text-base font-bold text-gray-900">${t.name}</div>
          <div class="text-xs text-gray-700 mt-1 leading-relaxed min-h-[34px]">${t.blurb}</div>
          <div class="mt-3 flex items-baseline gap-1.5">
            <span class="text-xs text-gray-500">+</span>
            <span class="text-2xl font-extrabold text-primary-700 -tracking-tight">${gbp(t.priceDelta)}</span>
            ${t.id !== 'none' ? '<span class="text-[11px] text-gray-500">added</span>' : ''}
          </div>
          <ul class="list-none p-0 mt-3.5 grid gap-2">
            ${t.features.map(([ok, txt]) => `<li class="flex items-center gap-2 text-xs ${ok ? 'text-gray-900' : 'text-gray-400'}">
              <span class="inline-flex items-center justify-center w-[18px] h-[18px] rounded-full ${ok ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'} font-bold text-[10px]">${ok ? '✓' : '–'}</span>
              ${txt}
            </li>`).join('')}
          </ul>
          <div class="mt-4 px-3 py-2.5 rounded-md text-xs font-semibold text-center transition
                       ${active ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700'}">
            ${active ? '✓ Selected' : 'Choose this'}
          </div>
        </button>`;
      }).join('')}
    </div>

    ${showCreds ? renderPortalCredentials(s) : ''}
  </div>`;
}

function renderPortalCredentials(s) {
  const pw = s.portalPassword || '';
  const strength = passwordStrength(pw);
  const checks = [
    [pw.length >= 12, 'At least 12 characters'],
    [/[^A-Za-z0-9]/.test(pw), 'Special character (!@#$…)'],
    [/[A-Z]/.test(pw) && /[a-z]/.test(pw), 'Mix of upper & lower case'],
    [/[0-9]/.test(pw), 'Contains a number'],
  ];
  return `<div class="p-5 rounded-2xl bg-primary-50 border-2 border-primary-200 flex flex-col gap-3.5">
    <div class="flex items-center gap-2.5">
      <span class="inline-flex items-center justify-center w-8 h-8 rounded-md bg-primary-600 text-white shrink-0">
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17z M12 3L1 9l11 6 9-4.91V17h2V9z"/></svg>
      </span>
      <div>
        <div class="text-sm font-bold text-gray-900">Set up your learning portal</div>
        <div class="text-xs text-gray-700">You'll use these to log in at portal.pass.tech and start learning straight away.</div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <label class="block">
        <span class="block text-xs font-semibold text-gray-900 mb-1.5">Learning portal email <span class="text-red-600">*</span></span>
        <input type="email" value="${s.portalEmail || s.email || ''}" data-action="field-input" data-field="portalEmail"
          class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none">
        <span class="mt-1.5 block text-xs text-gray-600">Pre-filled — change if you want a different login email.</span>
      </label>
      <label class="block">
        <span class="block text-xs font-semibold text-gray-900 mb-1.5">Create password <span class="text-red-600">*</span></span>
        <input type="password" value="${pw}" data-action="field-input" data-field="portalPassword" placeholder="At least 12 characters"
          class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none">
      </label>
    </div>

    <div>
      <div class="flex gap-1">
        ${[0,1,2,3,4].map(i => `<div class="flex-1 h-1.5 rounded-full transition-all ${i < strength.score ? strength.cls : 'bg-gray-200'}"></div>`).join('')}
      </div>
      <div class="mt-2 flex justify-between text-xs">
        <span class="text-gray-500">Password strength</span>
        <span class="${strength.text} font-bold">${strength.label}</span>
      </div>
      <ul class="list-none p-0 mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        ${checks.map(([ok, label]) => `<li class="flex items-center gap-1.5 text-xs ${ok ? 'text-primary-700' : 'text-gray-500'}">
          <span class="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full ${ok ? 'bg-primary-600 text-white' : 'bg-gray-200'} text-[8px] font-bold">${ok ? '✓' : ''}</span>${label}
        </li>`).join('')}
      </ul>
    </div>
  </div>`;
}

// ════════════════════════════════════════════════════════════════
//   STEP 5 — CHECKOUT
// ════════════════════════════════════════════════════════════════

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / debit card', sub: 'Visa · Mastercard · Amex' },
  { id: 'paypal', label: 'PayPal', sub: 'Pay with your PayPal balance' },
  { id: 'klarna', label: 'Klarna', sub: 'Pay in 3 instalments, 0% interest' },
  { id: 'clearpay', label: 'Clearpay', sub: 'Spread cost over up to 6 months' },
];

function renderStep5Checkout(s, total) {
  const method = s.payment || 'card';
  const courseAdd = s.course === 'standard' ? COURSE_STANDARD : s.course === 'premium' ? COURSE_PREMIUM : 0;
  const rrp = BASE_PRICE + courseAdd;
  const save = Math.max(0, rrp - total);
  return `<div class="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-6">
    <div>
      <div class="mb-4">
        <div class="text-xs font-bold uppercase tracking-wide text-primary-700 mb-2">Express checkout</div>
        <div class="grid grid-cols-2 gap-2.5">
          <button type="button" data-action="set-payment" data-value="applepay"
            class="h-12 rounded-lg inline-flex items-center justify-center gap-1.5 transition
                   ${method === 'applepay' ? 'border-2 border-primary-600' : 'border border-gray-900'} bg-black text-white text-base">
            <span class="text-lg leading-none"></span><span class="font-medium">Pay</span>
          </button>
          <button type="button" data-action="set-payment" data-value="googlepay"
            class="h-12 rounded-lg inline-flex items-center justify-center gap-2 transition
                   ${method === 'googlepay' ? 'border-2 border-primary-600' : 'border border-gray-300'} bg-white text-gray-800 text-sm font-medium">
            <span class="-tracking-tight font-semibold">
              <span class="text-blue-600">G</span><span class="text-red-500">o</span><span class="text-yellow-500">o</span><span class="text-blue-600">g</span><span class="text-green-600">l</span><span class="text-red-500">e</span>
            </span> Pay
          </button>
        </div>
        <div class="flex items-center gap-3 my-3.5">
          <div class="flex-1 h-px bg-gray-200"></div>
          <span class="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">or pay another way</span>
          <div class="flex-1 h-px bg-gray-200"></div>
        </div>
      </div>

      <div class="flex flex-col gap-2 mb-4">
        ${PAYMENT_METHODS.map(m => {
          const active = method === m.id;
          return `<button type="button" data-action="set-payment" data-value="${m.id}"
            class="flex items-center gap-3.5 p-3.5 rounded-xl text-left transition
                   ${active ? 'border-2 border-primary-600 bg-primary-50' : 'border border-gray-200 bg-white hover:border-gray-300'}">
            <span class="w-5 h-5 rounded-full shrink-0 ${active ? 'bg-white border-[6px] border-primary-600' : 'bg-white border-2 border-gray-300'}"></span>
            <div class="flex-1">
              <div class="text-sm font-bold text-gray-900">${m.label}</div>
              <div class="text-xs text-gray-500 mt-0.5">${m.sub}</div>
            </div>
            ${paymentMark(m.id)}
          </button>`;
        }).join('')}
      </div>

      ${method === 'card'
        ? `<div class="flex flex-col gap-3.5">
            <label class="block">
              <span class="block text-xs font-semibold text-gray-900 mb-1.5">Card number <span class="text-red-600">*</span></span>
              <input class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none" placeholder="1234 1234 1234 1234">
            </label>
            <div class="grid grid-cols-2 gap-3">
              <label class="block">
                <span class="block text-xs font-semibold text-gray-900 mb-1.5">Expiry <span class="text-red-600">*</span></span>
                <input class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none" placeholder="MM / YY">
              </label>
              <label class="block">
                <span class="block text-xs font-semibold text-gray-900 mb-1.5">CVC <span class="text-red-600">*</span></span>
                <input class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none" placeholder="3 digits">
              </label>
            </div>
            <label class="block">
              <span class="block text-xs font-semibold text-gray-900 mb-1.5">Name on card <span class="text-red-600">*</span></span>
              <input class="block w-full h-10 px-4 text-sm bg-white border border-gray-200 rounded-lg focus:border-primary-600 focus:ring-3 focus:ring-primary-600/25 focus:outline-none" placeholder="As shown on card">
            </label>
          </div>`
        : `<div class="p-4 bg-gray-50 border border-dashed border-gray-200 rounded-xl text-sm text-gray-600">
            You'll be redirected to <strong>${PAYMENT_METHODS.find(m => m.id === method)?.label || method}</strong> to complete payment after confirmation.
          </div>`}

      <div class="mt-4 grid grid-cols-3 gap-2 p-3.5 bg-primary-50 border border-primary-200 rounded-xl text-xs text-primary-800">
        <span class="flex items-center gap-2 font-semibold"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17z M12 3L1 9l11 6 9-4.91V17h2V9z"/></svg>256-bit SSL</span>
        <span class="flex items-center gap-2 font-semibold"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L4 5v6c0 5.5 3.8 10.7 8 12 4.2-1.3 8-6.5 8-12V5z"/></svg>PCI-DSS L1</span>
        <span class="flex items-center gap-2 font-semibold"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 5V1L7 6l5 5V7c3.3 0 6 2.7 6 6 0 1-.2 1.9-.7 2.8l1.5 1.5C19.5 16 20 14.6 20 13c0-4.4-3.6-8-8-8zm0 14c-3.3 0-6-2.7-6-6 0-1 .3-1.9.7-2.8L5.2 8.7C4.5 10 4 11.4 4 13c0 4.4 3.6 8 8 8v4l5-5-5-5z"/></svg>14-day refund</span>
      </div>
    </div>

    <aside class="relative p-5 rounded-2xl bg-white border border-gray-200 shadow-md shadow-black/5 h-fit">
      <div class="text-xs font-bold uppercase tracking-wide text-primary-700">Booking summary</div>
      <div class="text-lg font-bold text-gray-900 mt-1 -tracking-tight">Functional Skills Maths Level 2</div>

      <div class="mt-4 flex flex-col gap-2.5 text-sm">
        ${summaryRow('Invigilation', s.invigilation === 'auto' ? 'Online remote' : 'Online human')}
        ${summaryRow('Date', s.date ? prettyDate(s.date) : '—')}
        ${summaryRow('Time', s.time || '—')}
        ${summaryRow('Course', s.course === 'premium' ? 'Premium bundle' : s.course === 'standard' ? 'Standard course' : 'Exam only')}
      </div>

      <hr class="my-4 border-gray-200">

      <div class="flex justify-between items-baseline">
        <span class="text-sm text-gray-500">RRP</span>
        <span class="text-sm text-gray-400 line-through">${gbp(rrp)}</span>
      </div>
      <div class="flex justify-between items-baseline mt-1">
        <span class="text-sm font-semibold text-primary-700">You save</span>
        <span class="text-sm font-bold text-primary-700">${gbp(save)}</span>
      </div>
      <div class="flex justify-between items-baseline mt-3">
        <span class="text-sm font-bold text-gray-900">Total today</span>
        <span class="text-3xl font-extrabold text-primary-700 -tracking-tight">${gbp(total)}</span>
      </div>

      <div class="mt-3.5 p-2.5 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2 text-xs text-yellow-800">
        <svg class="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8v5l4 2-.7 1.4L11 14V8zm0-6a10 10 0 100 20 10 10 0 000-20z"/></svg>
        ${s.time ? 'This price is held for 8 minutes while you check out.' : 'Pick a date & time to lock this price.'}
      </div>
    </aside>
  </div>`;
}

function summaryRow(label, value) {
  return `<div class="flex justify-between gap-3">
    <span class="text-gray-500">${label}</span>
    <span class="text-gray-900 font-semibold text-right">${value}</span>
  </div>`;
}

function paymentMark(id) {
  const marks = {
    card: `<span class="inline-flex gap-1">
      <span class="bg-[#1A1F71] text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded italic">VISA</span>
      <span class="bg-white border border-gray-200 px-1 py-0.5 rounded inline-flex gap-0.5 items-center">
        <span class="w-2.5 h-2.5 rounded-full bg-[#EB001B]"></span>
        <span class="w-2.5 h-2.5 rounded-full bg-[#F79E1B] -ml-1"></span>
      </span>
    </span>`,
    paypal: `<span class="bg-[#003087] text-white text-[11px] font-extrabold px-2 py-0.5 rounded">Pay<span class="text-[#009CDE]">Pal</span></span>`,
    klarna: `<span class="bg-[#FFA8CD] text-[#0B051D] text-[11px] font-extrabold px-2 py-0.5 rounded">Klarna.</span>`,
    clearpay: `<span class="bg-[#B2FCE4] text-[#0E1F1F] text-[11px] font-extrabold px-2 py-0.5 rounded">Clearpay</span>`,
  };
  return marks[id] || '';
}

// ════════════════════════════════════════════════════════════════
//   WIZARD SHELL
// ════════════════════════════════════════════════════════════════

function renderWizard(s) {
  const total = priceFor(s.date || nextWeekday(), s.time || '14:00', s.invigilation, s.course);
  const courseAdd = s.course === 'standard' ? COURSE_STANDARD : s.course === 'premium' ? COURSE_PREMIUM : 0;
  const rrp = BASE_PRICE + courseAdd;
  const save = Math.max(0, rrp - total);
  const savePct = rrp > 0 ? Math.round((save / rrp) * 100) : 0;
  const allowNext = canAdvance(s);

  let body = '';
  if (s.step === 0) body = renderStep1Details(s);
  else if (s.step === 1) body = renderStep2Invigilation(s);
  else if (s.step === 2) body = renderStep3DateTime(s);
  else if (s.step === 3) body = renderStep4Course(s);
  else body = renderStep5Checkout(s, total);

  return `<div class="bg-white rounded-3xl border border-gray-200 shadow-[0_24px_48px_-16px_rgba(15,134,16,0.10),0_8px_16px_-8px_rgba(0,0,0,0.04)] overflow-hidden">
    <!-- Step nav -->
    <div class="p-6 bg-gradient-to-b from-primary-50/40 to-white border-b border-gray-100">
      ${renderStepNav(s)}
    </div>

    <!-- Step header -->
    <div class="px-7 pt-6">
      <div class="text-xs font-bold uppercase tracking-wide text-primary-700">Step ${s.step + 1} of ${STEP_LABELS.length}</div>
      <h2 class="mt-1 text-2xl md:text-3xl font-extrabold text-gray-900 -tracking-tight">${STEP_LABELS[s.step]}</h2>
      <p class="mt-1.5 text-sm text-gray-700 leading-relaxed">${STEP_DESCRIPTIONS[s.step]}</p>
    </div>

    <!-- Step body -->
    <div class="p-7 pt-6 min-h-[360px]">
      <div class="wiz-step-anim" style="animation: wizSlide${s.direction > 0 ? 'R' : 'L'} .35s cubic-bezier(.4,0,.2,1) both;">
        ${body}
      </div>
    </div>

    <!-- Footer -->
    <div class="px-7 py-5 bg-gray-50 border-t border-gray-100 flex flex-wrap items-center gap-4">
      <button type="button" data-action="prev-step" ${s.step === 0 ? 'disabled' : ''}
        class="inline-flex items-center gap-2 h-12 px-5 rounded-lg text-sm font-medium bg-white border border-gray-200 text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
        Back
      </button>

      <div class="flex-1"></div>

      ${renderPriceChip(total, rrp, save, savePct, s.step)}

      <button type="button" data-action="next-step" ${allowNext ? '' : 'disabled'}
        class="inline-flex items-center gap-2 h-12 px-6 rounded-lg text-sm font-semibold bg-primary-600 text-white hover:bg-primary-700 focus:ring-3 focus:ring-primary-600/25 focus:outline-none transition disabled:opacity-50 disabled:cursor-not-allowed">
        ${s.step === STEP_LABELS.length - 1
          ? `Complete booking <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M5 13.18v4L12 21l7-3.82v-4L12 17z M12 3L1 9l11 6 9-4.91V17h2V9z"/></svg>`
          : `Continue <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M13 5l7 7-7 7"/></svg>`
        }
      </button>
    </div>
  </div>`;
}

function renderPriceChip(total, rrp, save, savePct, step) {
  return `<div id="price-chip" class="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-primary-200 shadow-sm transition-transform duration-300">
    <div class="text-right leading-tight">
      <div class="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">${step === 4 ? 'Total today' : 'Running total'}</div>
      <div class="flex items-baseline gap-1.5 justify-end mt-0.5">
        ${save > 0 ? `<span class="text-xs text-gray-400 line-through font-medium">${gbp(rrp)}</span>` : ''}
        <span class="text-xl font-extrabold text-primary-700 -tracking-tight">${gbp(total)}</span>
      </div>
    </div>
    ${save > 0 ? `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary-600 text-white text-[10px] font-extrabold whitespace-nowrap">
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3 7l6 6 4-4 8 8v-6h-2v3l-6-6-4 4-6-6z"/></svg>${savePct}% off
    </span>` : ''}
  </div>`;
}

// ════════════════════════════════════════════════════════════════
//   EVENT HANDLERS
// ════════════════════════════════════════════════════════════════

function handleClick(e) {
  const t = e.target.closest('[data-action]');
  if (!t || t.disabled) return;
  const action = t.dataset.action;
  const s = wizState.get();

  switch (action) {
    case 'goto-step':       gotoStep(parseInt(t.dataset.step, 10)); break;
    case 'next-step':       nextStep(); break;
    case 'prev-step':       prevStep(); break;
    case 'set-invigilation':wizState.set({ invigilation: t.dataset.value }); break;
    case 'set-course':      wizState.set({ course: t.dataset.value, portalEmail: s.portalEmail || s.email }); break;
    case 'set-payment':     wizState.set({ payment: t.dataset.value }); break;
    case 'pick-date':       wizState.set({ date: t.dataset.iso, time: null }); break;
    case 'pick-time':       wizState.set({ time: t.dataset.time }); break;
    case 'cal-prev': {
      const v = s.calendarView;
      wizState.set({ calendarView: new Date(v.getFullYear(), v.getMonth() - 1, 1) });
      break;
    }
    case 'cal-next': {
      const v = s.calendarView;
      wizState.set({ calendarView: new Date(v.getFullYear(), v.getMonth() + 1, 1) });
      break;
    }
    case 'pick-earliest': {
      const cells = monthCells(s.calendarView);
      const c = cells.find(c => c && !c.past);
      if (c) wizState.set({ date: c.iso });
      break;
    }
    case 'pick-cheapest': {
      const cells = monthCells(s.calendarView);
      let best = null, bestPct = -1;
      for (const c of cells) {
        if (!c || c.past) continue;
        const pct = dayDiscount(c.iso);
        if (pct > bestPct) { bestPct = pct; best = c; }
      }
      if (best) wizState.set({ date: best.iso });
      break;
    }
    case 'change-step-nav':
      // toggled by the dropdown above the wizard
      wizState.set({ stepNav: t.dataset.value });
      break;
  }
}

function handleInput(e) {
  const t = e.target.closest('[data-action="field-input"]');
  if (!t) return;
  const field = t.dataset.field;
  wizState.set({ [field]: t.value });
}

function handleBlur(e) {
  const t = e.target.closest('[data-action="field-input"]');
  if (!t) return;
  const field = t.dataset.field;
  if (!validators[field]) return;
  const s = wizState.get();
  wizState.set({ errors: { ...s.errors, [field]: validators[field](s[field]) } });
}

// ════════════════════════════════════════════════════════════════
//   COUNTDOWN
// ════════════════════════════════════════════════════════════════

function startCountdown() {
  const el = document.getElementById('countdown');
  if (!el) return;
  let target = parseInt(sessionStorage.getItem('wizCountdownTarget') || '0', 10);
  if (!target) {
    target = Date.now() + (2 * 86400000) + (8 * 3600000) + (42 * 60000);
    sessionStorage.setItem('wizCountdownTarget', String(target));
  }
  const pad = n => String(n).padStart(2, '0');
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    el.innerHTML = `<div class="inline-flex flex-col items-center min-w-[28px]"><span class="text-xs font-extrabold text-orange-900 bg-white rounded px-1.5 py-0.5 tabular-nums">${pad(days)}</span><span class="text-[8px] text-orange-900 uppercase font-bold mt-0.5">d</span></div>
      <div class="inline-flex flex-col items-center min-w-[28px]"><span class="text-xs font-extrabold text-orange-900 bg-white rounded px-1.5 py-0.5 tabular-nums">${pad(hours)}</span><span class="text-[8px] text-orange-900 uppercase font-bold mt-0.5">h</span></div>
      <div class="inline-flex flex-col items-center min-w-[28px]"><span class="text-xs font-extrabold text-orange-900 bg-white rounded px-1.5 py-0.5 tabular-nums">${pad(mins)}</span><span class="text-[8px] text-orange-900 uppercase font-bold mt-0.5">m</span></div>
      <div class="inline-flex flex-col items-center min-w-[28px]"><span class="text-xs font-extrabold text-orange-900 bg-white rounded px-1.5 py-0.5 tabular-nums">${pad(secs)}</span><span class="text-[8px] text-orange-900 uppercase font-bold mt-0.5">s</span></div>`;
  }
  tick();
  setInterval(tick, 1000);
}

// ════════════════════════════════════════════════════════════════
//   BOOT
// ════════════════════════════════════════════════════════════════

function mount() {
  const root = document.getElementById('wizard');
  if (!root) return;
  let lastTotal = null;

  function render() {
    const s = wizState.get();
    root.innerHTML = renderWizard(s);
    root.dataset.stepNav = s.stepNav;
    root.dataset.dateLayout = s.dateLayout;

    // Bump price chip if total changed
    const total = priceFor(s.date || nextWeekday(), s.time || '14:00', s.invigilation, s.course);
    if (lastTotal !== null && Math.abs(lastTotal - total) > 0.01) {
      const chip = document.getElementById('price-chip');
      if (chip) {
        chip.style.transform = 'scale(1.06)';
        chip.style.boxShadow = '0 0 0 6px rgba(15,188,15,0.15)';
        setTimeout(() => { chip.style.transform = ''; chip.style.boxShadow = ''; }, 380);
      }
    }
    lastTotal = total;
  }

  wizState.subscribe(render);
  document.addEventListener('click', handleClick);
  document.addEventListener('input', handleInput);
  document.addEventListener('focusout', handleBlur);
  render();
  startCountdown();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
else mount();
