// Booking Wizard — Step 3 (date+time, 3 layouts), Step 4 (course), Step 5 (checkout)

const { priceFor, gbp, spacesLeft, TIME_SLOTS, DAY_LABELS_SHORT, MONTH_LABELS,
        isoDate, fromIso, addDays, startOfMonth, daysInMonth, mondayIndex,
        dayDiscount, timeDiscount, BASE_PRICE,
        Field, SaveBadge } = window.WIZ;

// ───────── Day cell shared ─────────
function dayCellPrice(iso, invig) {
  return priceFor(iso, null, invig, 'none');
}

// ───────── Heat map color scale (red→amber→green by discount %) ─────────
function heatColor(pct) {
  // pct 0..0.35 → red (most expensive) → green (cheapest)
  if (pct >= 0.25) return { bg: '#0F8610', fg: '#fff', label: 'Cheapest' };
  if (pct >= 0.18) return { bg: '#42E741', fg: '#033005', label: 'Great' };
  if (pct >= 0.12) return { bg: '#DBFEDA', fg: '#0F8610', label: 'Good' };
  if (pct >= 0.07) return { bg: '#FEF3C7', fg: '#92400E', label: 'Average' };
  if (pct >= 0.03) return { bg: '#FED7AA', fg: '#9A3412', label: 'High' };
  return { bg: '#FECACA', fg: '#991B1B', label: 'Most expensive' };
}

function priceColor(pct) {
  return heatColor(pct);
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 3a — LIST: "Next 14 available days" with price chips
// ═══════════════════════════════════════════════════════════════════
function Step3List({ data, setData }) {
  const start = React.useMemo(() => addDays(new Date(), 1), []);
  const days = Array.from({ length: 14 }, (_, i) => addDays(start, i));
  const [selectedDay, setSelectedDay] = React.useState(data.date || isoDate(days[0]));
  const slot = data.time;

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {days.map(d => {
          const iso = isoDate(d);
          const pct = dayDiscount(iso);
          const price = dayCellPrice(iso, data.invigilation);
          const save = BASE_PRICE - price;
          const tag = priceColor(pct);
          const active = selectedDay === iso;
          const left = spacesLeft(iso);
          return (
            <button key={iso} type="button"
              onClick={() => { setSelectedDay(iso); setData(x => ({ ...x, date: iso })); }}
              style={{
                display: 'grid', gridTemplateColumns: '64px 1fr auto auto', gap: 16,
                alignItems: 'center', padding: '14px 16px', borderRadius: 12,
                background: active ? '#F0FEEF' : '#fff',
                border: active ? '2px solid #0FBC0F' : '1px solid #E5E7EB',
                fontFamily: 'inherit', cursor: 'pointer', textAlign: 'left',
                transition: 'all .15s',
              }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{DAY_LABELS_SHORT[mondayIndex(d)]}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#101828', lineHeight: 1, marginTop: 2 }}>{d.getDate()}</div>
                <div style={{ fontSize: 11, color: '#6A7282', marginTop: 2 }}>{MONTH_LABELS[d.getMonth()].slice(0,3)}</div>
              </div>
              <div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 8px', borderRadius: 999, background: tag.bg, color: tag.fg, fontSize: 11, fontWeight: 700 }}>{tag.label}</div>
                <div style={{ fontSize: 12, color: '#6A7282', marginTop: 6 }}>
                  {left <= 4 ? <span style={{ color: '#C70036', fontWeight: 600 }}>Only {left} spaces left</span> : `${left} spaces remaining`}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#98A2B3', textDecoration: 'line-through' }}>{gbp(BASE_PRICE)}</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.01em' }}>{gbp(price)}</div>
                <SaveBadge amount={save}/>
              </div>
              <div style={{
                width: 28, height: 28, borderRadius: 999,
                border: active ? '8px solid #0FBC0F' : '2px solid #D1D5DB',
                background: '#fff',
              }}/>
            </button>
          );
        })}
      </div>

      <TimeSlotPicker selectedDay={selectedDay} data={data} setData={setData}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 3b — HEAT-MAP: month grid, color = cheapness
// ═══════════════════════════════════════════════════════════════════
function Step3HeatMap({ data, setData }) {
  const today = React.useMemo(() => new Date(), []);
  const [view, setView] = React.useState(startOfMonth(data.date ? fromIso(data.date) : addDays(today, 7)));
  const selected = data.date;

  const cells = monthCells(view, today);

  return (
    <div>
      <CalendarHeader view={view} setView={setView}/>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {DAY_LABELS_SHORT.map(d => (
          <div key={d} style={{ fontSize: 11, fontWeight: 700, color: '#6A7282', textAlign: 'center', padding: '6px 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d}</div>
        ))}
        {cells.map((c, i) => {
          if (!c) return <div key={i}/>;
          const iso = c.iso;
          const past = c.past;
          const price = dayCellPrice(iso, data.invigilation);
          const pct = dayDiscount(iso);
          const tag = priceColor(pct);
          const active = selected === iso;
          return (
            <button key={iso} type="button" disabled={past}
              onClick={() => setData(x => ({ ...x, date: iso }))}
              style={{
                position: 'relative', aspectRatio: '1 / 1',
                padding: 6, borderRadius: 10, fontFamily: 'inherit', cursor: past ? 'not-allowed' : 'pointer',
                background: past ? '#FAFAFA' : tag.bg,
                color: past ? '#D1D5DB' : tag.fg,
                border: active ? '2.5px solid #033005' : '1px solid rgba(0,0,0,0.04)',
                opacity: past ? 0.45 : 1,
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                textAlign: 'left', transition: 'transform .12s',
              }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.day}</div>
              {!past && (
                <>
                  <div style={{ fontSize: 11, fontWeight: 700, lineHeight: 1.2 }}>{gbp(Math.round(price))}</div>
                  <div style={{ fontSize: 9, opacity: 0.7, lineHeight: 1, textDecoration: 'line-through' }}>{gbp(Math.round(BASE_PRICE))}</div>
                </>
              )}
            </button>
          );
        })}
      </div>
      <HeatLegend/>
      <TimeSlotPicker selectedDay={selected} data={data} setData={setData}/>
    </div>
  );
}

function HeatLegend() {
  const stops = [
    ['Most expensive', '#FECACA', '#991B1B'],
    ['High', '#FED7AA', '#9A3412'],
    ['Average', '#FEF3C7', '#92400E'],
    ['Good', '#DBFEDA', '#0F8610'],
    ['Great', '#42E741', '#033005'],
    ['Cheapest', '#0F8610', '#fff'],
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, padding: '10px 12px', background: '#FAFAFA', borderRadius: 10, border: '1px solid #E5E7EB', gap: 12, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#991B1B' }}>← Higher price</span>
      <div style={{ display: 'flex', gap: 4, flex: 1, justifyContent: 'center' }}>
        {stops.map(([l, bg, fg]) => (
          <span key={l} style={{ fontSize: 10, padding: '3px 7px', borderRadius: 999, background: bg, color: fg, fontWeight: 700 }}>{l}</span>
        ))}
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: '#0F8610' }}>Lower price →</span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 3c — TWO-COLUMN: classic month grid LEFT, time slots RIGHT
// ═══════════════════════════════════════════════════════════════════
function Step3Split({ data, setData }) {
  const today = React.useMemo(() => new Date(), []);
  const [view, setView] = React.useState(startOfMonth(data.date ? fromIso(data.date) : addDays(today, 7)));
  const selected = data.date;
  const cells = monthCells(view, today);

  function selectEarliest() {
    const c = cells.find(c => c && !c.past);
    if (c) setData(x => ({ ...x, date: c.iso }));
  }
  function selectCheapest() {
    let best = null, bestPct = -1;
    for (const c of cells) {
      if (!c || c.past) continue;
      const pct = dayDiscount(c.iso);
      if (pct > bestPct) { bestPct = pct; best = c; }
    }
    if (best) setData(x => ({ ...x, date: best.iso }));
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 24 }} className="wiz-split">
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button type="button" onClick={selectEarliest}
            className="pass-btn pass-btn--secondary pass-btn--sm" style={{ flex: 1, height: 38, justifyContent: 'center' }}>
            <PFSIcon name="zap" size={14}/> Select earliest date
          </button>
          <button type="button" onClick={selectCheapest}
            style={{
              flex: 1, height: 38, padding: '0 14px', borderRadius: 12,
              fontFamily: 'inherit', fontWeight: 600, fontSize: 13,
              background: '#F0FEEF', color: '#0F8610',
              border: '1px solid #B8FBB7', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
            <PFSIcon name="trending-down" size={14} color="#0F8610"/> Select cheapest date
          </button>
        </div>
        <CalendarHeader view={view} setView={setView}/>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {DAY_LABELS_SHORT.map(d => (
            <div key={d} style={{ fontSize: 11, fontWeight: 600, color: '#6A7282', textAlign: 'center', padding: '6px 0' }}>{d}</div>
          ))}
          {cells.map((c, i) => {
            if (!c) return <div key={i}/>;
            const past = c.past;
            const price = dayCellPrice(c.iso, data.invigilation);
            const pct = dayDiscount(c.iso);
            const tag = heatColor(pct);
            const active = selected === c.iso;
            return (
              <button key={c.iso} type="button" disabled={past}
                onClick={() => setData(x => ({ ...x, date: c.iso }))}
                style={{
                  aspectRatio: '1 / 1', padding: 4, borderRadius: 10, fontFamily: 'inherit',
                  cursor: past ? 'not-allowed' : 'pointer',
                  background: past ? '#FAFAFA' : tag.bg,
                  color: past ? '#D1D5DB' : tag.fg,
                  border: active ? '2.5px solid #033005' : '1px solid rgba(0,0,0,0.04)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1,
                  opacity: past ? 0.5 : 1,
                  transition: 'all .15s',
                  boxShadow: active ? '0 4px 12px rgba(15,134,16,0.3)' : 'none',
                }}>
                <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.75, lineHeight: 1 }}>{c.day}</div>
                {!past && (
                  <>
                    <div style={{ fontSize: 9, fontWeight: 500, opacity: 0.6, lineHeight: 1, textDecoration: 'line-through' }}>{gbp(Math.round(BASE_PRICE))}</div>
                    <div style={{ fontSize: 14, fontWeight: 800, lineHeight: 1, letterSpacing: '-0.02em' }}>{gbp(Math.round(price))}</div>
                  </>
                )}
              </button>
            );
          })}
        </div>
        <HeatLegend/>
      </div>

      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#101828', marginBottom: 10 }}>
          {selected ? `Slots for ${prettyDate(selected)}` : 'Select a date first'}
        </div>
        {selected
          ? <TimeSlotList day={selected} data={data} setData={setData} compact/>
          : <div style={{ padding: 20, textAlign: 'center', color: '#98A2B3', fontSize: 13, border: '1px dashed #E5E7EB', borderRadius: 12 }}>Slots, prices and availability will appear here.</div>}
      </div>
    </div>
  );
}

// ───────── Calendar utilities ─────────
function monthCells(view, today) {
  const dim = daysInMonth(view);
  const lead = mondayIndex(view);
  const arr = [];
  for (let i = 0; i < lead; i++) arr.push(null);
  for (let day = 1; day <= dim; day++) {
    const d = new Date(view.getFullYear(), view.getMonth(), day);
    arr.push({
      day, iso: isoDate(d),
      past: d < new Date(today.getFullYear(), today.getMonth(), today.getDate()),
    });
  }
  return arr;
}
function CalendarHeader({ view, setView }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
      <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}
        className="pass-btn pass-btn--secondary pass-btn--sm" style={{ height: 36, width: 36, padding: 0, justifyContent: 'center' }}>
        <PFSIcon name="chevron-left" size={16}/>
      </button>
      <div style={{ fontSize: 18, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em' }}>
        {MONTH_LABELS[view.getMonth()]} {view.getFullYear()}
      </div>
      <button type="button" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}
        className="pass-btn pass-btn--secondary pass-btn--sm" style={{ height: 36, width: 36, padding: 0, justifyContent: 'center' }}>
        <PFSIcon name="chevron-right" size={16}/>
      </button>
    </div>
  );
}
function prettyDate(iso) {
  const d = fromIso(iso);
  return `${DAY_LABELS_SHORT[mondayIndex(d)]} ${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`;
}

// ───────── Time slot picker (shared) ─────────
function TimeSlotPicker({ selectedDay, data, setData }) {
  if (!selectedDay) return null;
  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #E5E7EB' }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#101828', marginBottom: 10 }}>
        Select your time on {prettyDate(selectedDay)}
      </div>
      <TimeSlotList day={selectedDay} data={data} setData={setData}/>
    </div>
  );
}
function TimeSlotList({ day, data, setData, compact = false }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : 'repeat(3, 1fr)', gap: 8 }}>
      {TIME_SLOTS.map(slot => {
        const price = priceFor(day, slot, data.invigilation, 'none');
        const save = BASE_PRICE - price;
        const pct = timeDiscount(slot);
        const active = data.time === slot;
        const left = spacesLeft(day, slot);
        const sold = left === 0;
        return (
          <button key={slot} type="button" disabled={sold}
            onClick={() => setData(x => ({ ...x, time: slot }))}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              padding: compact ? '10px 12px' : '12px 14px', borderRadius: 10, fontFamily: 'inherit',
              background: active ? '#F0FEEF' : '#fff',
              border: active ? '2px solid #0FBC0F' : '1px solid #E5E7EB',
              cursor: sold ? 'not-allowed' : 'pointer', opacity: sold ? 0.5 : 1,
              textAlign: 'left', transition: 'all .15s',
            }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#101828' }}>{slot}</div>
              <div style={{ fontSize: 11, color: left <= 3 ? '#C70036' : '#6A7282', fontWeight: 500, marginTop: 2 }}>
                {sold ? 'Sold out' : left <= 3 ? `Only ${left} left` : `${left} spaces`}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0F8610' }}>{gbp(price)}</div>
              {save > 0 && <div style={{ fontSize: 10, color: '#98A2B3', textDecoration: 'line-through' }}>{gbp(BASE_PRICE)}</div>}
            </div>
          </button>
        );
      })}
    </div>
  );
}

// Step 3 dispatcher
function Step3DateTime({ data, setData, layout }) {
  if (layout === 'heatmap') return <Step3HeatMap data={data} setData={setData}/>;
  if (layout === 'split') return <Step3Split data={data} setData={setData}/>;
  return <Step3List data={data} setData={setData}/>;
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 4 — Course
// ═══════════════════════════════════════════════════════════════════
function Step4Course({ data, setData, errors, setErrors }) {
  const tiers = [
    {
      id: 'none', name: 'Exam only', priceDelta: 0,
      tag: null, blurb: 'Just the exam. Best if you\'re already exam-ready.',
      features: [
        ['check', 'Official Functional Skills exam'],
        ['x',     'No course access'],
        ['x',     'No practice questions'],
        ['x',     'No tutor support'],
      ],
    },
    {
      id: 'standard', name: 'Standard course', priceDelta: 184,
      tag: 'Best for most', tagTone: 'brand',
      blurb: '3-month access to the full course + the exam. Pass rate 87%.',
      features: [
        ['check', 'Everything in Exam only'],
        ['check', '3 months full course access'],
        ['check', '500+ practice questions'],
        ['check', 'Email tutor support'],
        ['x', 'Free resit if you fail'],
      ],
    },
    {
      id: 'premium', name: 'Premium bundle', priceDelta: 284,
      tag: 'Highest pass rate', tagTone: 'success',
      blurb: '12-month course access + free resit included. Pass rate 93%.',
      features: [
        ['check', 'Everything in Standard'],
        ['check', '12 months full access'],
        ['check', '1-to-1 video tutor sessions'],
        ['check', 'Mock exams marked by examiners'],
        ['check', 'FREE resit if you don\'t pass'],
      ],
    },
  ];

  const showCreds = data.course === 'standard' || data.course === 'premium';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{
        background: '#0F8610', color: '#fff', padding: '14px 18px', borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12, fontSize: 14, fontWeight: 500,
      }}>
        <PFSIcon name="trending-up" size={18} color="#fff"/>
        <span><strong>93% of students pass first time</strong> when they bundle the Premium course.</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }} className="wiz-grid-3">
        {tiers.map(t => {
          const active = data.course === t.id;
          const popular = t.id === 'standard';
          return (
            <button key={t.id} type="button"
              onClick={() => {
                setData(d => {
                  const next = { ...d, course: t.id };
                  // prefill portal email when picking a course
                  if ((t.id === 'standard' || t.id === 'premium') && !d.portalEmail) {
                    next.portalEmail = d.email || '';
                  }
                  return next;
                });
              }}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
                padding: 20, borderRadius: 16, paddingTop: popular ? 28 : 20,
                background: active ? '#F0FEEF' : '#fff',
                border: active ? '2px solid #0FBC0F' : popular ? '2px solid #B8FBB7' : '2px solid #E5E7EB',
                transform: popular ? 'translateY(-4px)' : 'none',
                boxShadow: popular ? '0 12px 32px -12px rgba(15,134,16,0.25)' : 'none',
                transition: 'all .2s',
              }}>
              {t.tag && (
                <span style={{
                  position: 'absolute', top: -10, left: 16,
                  fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                  background: t.tagTone === 'success' ? '#0FBC0F' : t.tagTone === 'brand' ? '#101828' : '#6A7282',
                  color: '#fff',
                }}>{t.tag}</span>
              )}
              <div style={{ fontSize: 16, fontWeight: 700, color: '#101828' }}>{t.name}</div>
              <div style={{ fontSize: 12, color: '#4A5565', marginTop: 4, lineHeight: 1.4, minHeight: 34 }}>{t.blurb}</div>
              <div style={{ marginTop: 12, display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 12, color: '#6A7282' }}>+</span>
                <span style={{ fontSize: 26, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.02em' }}>{gbp(t.priceDelta)}</span>
                {t.id !== 'none' && <span style={{ fontSize: 11, color: '#6A7282' }}>added</span>}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '14px 0 0', display: 'grid', gap: 8 }}>
                {t.features.map(([icon, text], i) => (
                  <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: icon === 'check' ? '#101828' : '#98A2B3' }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: 999, flexShrink: 0,
                      background: icon === 'check' ? '#DBFEDA' : '#F3F4F6',
                      color: icon === 'check' ? '#0F8610' : '#98A2B3',
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11,
                    }}>{icon === 'check' ? '✓' : '–'}</span>
                    {text}
                  </li>
                ))}
              </ul>
              <div style={{
                marginTop: 16, padding: '10px 12px', borderRadius: 8,
                background: active ? '#0FBC0F' : '#F3F4F6',
                color: active ? '#fff' : '#4A5565',
                fontSize: 13, fontWeight: 600, textAlign: 'center',
                transition: 'all .15s',
              }}>
                {active ? '✓ Selected' : 'Choose this'}
              </div>
            </button>
          );
        })}
      </div>

      {showCreds && <PortalCredentials data={data} setData={setData} errors={errors} setErrors={setErrors}/>}
    </div>
  );
}

// ───────── Password strength + portal credentials ─────────
function passwordStrength(pw) {
  if (!pw) return { score: 0, label: 'Enter a password', color: '#E5E7EB' };
  let score = 0;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (pw.length >= 16) score++;
  const labels = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];
  const colors = ['#C70036', '#E11D48', '#D97706', '#0E9F6E', '#0FBC0F', '#0F8610'];
  return { score, label: labels[score] || labels[5], color: colors[score] || colors[5] };
}
function validatePassword(pw) {
  if (!pw || pw.length < 12) return 'Password must be at least 12 characters.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Password must contain at least one special character.';
  return '';
}
function PortalCredentials({ data, setData, errors, setErrors }) {
  const pw = data.portalPassword || '';
  const strength = passwordStrength(pw);
  const checks = [
    { ok: pw.length >= 12, label: 'At least 12 characters' },
    { ok: /[^A-Za-z0-9]/.test(pw), label: 'Special character (!@#$…)' },
    { ok: /[A-Z]/.test(pw) && /[a-z]/.test(pw), label: 'Mix of upper & lower case' },
    { ok: /[0-9]/.test(pw), label: 'Contains a number' },
  ];
  return (
    <div style={{
      padding: 20, borderRadius: 14,
      background: '#FAFEF9', border: '1.5px solid #B8FBB7',
      display: 'flex', flexDirection: 'column', gap: 14,
      animation: 'wizSlideInR .35s cubic-bezier(.4,0,.2,1) both',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          width: 32, height: 32, borderRadius: 8, background: '#0FBC0F',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <PFSIcon name="graduation-cap" size={16} color="#fff"/>
        </span>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#101828' }}>Set up your learning portal</div>
          <div style={{ fontSize: 12, color: '#4A5565' }}>You'll use these to log in at portal.pass.tech and start learning straight away.</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="wiz-grid-2">
        <Field label="Learning portal email" required hint="Pre-filled — change if you want a different login email.">
          <input className="pass-input" type="email"
            value={data.portalEmail || ''}
            onChange={e => setData(d => ({ ...d, portalEmail: e.target.value }))} />
        </Field>
        <Field label="Create password" required error={errors.portalPassword}>
          <input className="pass-input" type="password" placeholder="At least 12 characters"
            value={pw}
            onChange={e => setData(d => ({ ...d, portalPassword: e.target.value }))}
            onBlur={() => setErrors(prev => ({ ...prev, portalPassword: validatePassword(pw) }))} />
        </Field>
      </div>

      {/* Strength bar */}
      <div>
        <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              flex: 1, height: 6, borderRadius: 999,
              background: i < strength.score ? strength.color : '#E5E7EB',
              transition: 'background .25s',
            }}/>
          ))}
        </div>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span style={{ color: '#6A7282' }}>Password strength</span>
          <span style={{ color: strength.color, fontWeight: 700 }}>{strength.label}</span>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
          {checks.map(c => (
            <li key={c.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: c.ok ? '#0F8610' : '#6A7282' }}>
              <span style={{
                width: 14, height: 14, borderRadius: 999, flexShrink: 0,
                background: c.ok ? '#0FBC0F' : '#E5E7EB', color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 9, fontWeight: 700,
              }}>{c.ok ? '✓' : ''}</span>
              {c.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 5 — Checkout
// ═══════════════════════════════════════════════════════════════════
function Step5Checkout({ data, setData, total }) {
  const methods = [
    { id: 'card',    label: 'Credit / debit card', sub: 'Visa · Mastercard · Amex' },
    { id: 'paypal',  label: 'PayPal', sub: 'Pay with your PayPal balance' },
    { id: 'klarna',  label: 'Klarna', sub: 'Pay in 3 instalments, 0% interest' },
    { id: 'clearpay',label: 'Clearpay', sub: 'Spread cost over up to 6 months' },
  ];
  const method = data.payment || 'card';

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 24 }} className="wiz-checkout-grid">
      <div>
        {/* Express checkout */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
            Express checkout
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button type="button" onClick={() => setData(d => ({ ...d, payment: 'applepay' }))}
              style={{
                height: 48, borderRadius: 10, border: data.payment === 'applepay' ? '2px solid #0FBC0F' : '1px solid #101828',
                background: '#000', color: '#fff', cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 16, fontWeight: 500,
              }}>
              <span style={{ fontSize: 18 }}></span><span style={{ fontWeight: 600 }}>Pay</span>
            </button>
            <button type="button" onClick={() => setData(d => ({ ...d, payment: 'googlepay' }))}
              style={{
                height: 48, borderRadius: 10, border: data.payment === 'googlepay' ? '2px solid #0FBC0F' : '1px solid #DADCE0',
                background: '#fff', color: '#3C4043', cursor: 'pointer', fontFamily: 'inherit',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontSize: 14, fontWeight: 500,
              }}>
              <GooglePayMark/> Pay
            </button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '14px 0 6px' }}>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }}/>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.08em' }}>or pay another way</span>
            <div style={{ flex: 1, height: 1, background: '#E5E7EB' }}/>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
          {methods.map(m => {
            const active = method === m.id;
            return (
              <button key={m.id} type="button"
                onClick={() => setData(d => ({ ...d, payment: m.id }))}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                  borderRadius: 12, fontFamily: 'inherit', textAlign: 'left',
                  background: active ? '#F0FEEF' : '#fff',
                  border: active ? '2px solid #0FBC0F' : '1px solid #E5E7EB',
                  cursor: 'pointer', transition: 'all .15s',
                }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999, flexShrink: 0,
                  border: active ? '6px solid #0FBC0F' : '2px solid #D1D5DB',
                  background: '#fff',
                }}/>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#101828' }}>{m.label}</div>
                  <div style={{ fontSize: 12, color: '#6A7282', marginTop: 2 }}>{m.sub}</div>
                </div>
                <PaymentMark id={m.id}/>
              </button>
            );
          })}
        </div>

        {method === 'card' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Card number" required>
              <input className="pass-input" placeholder="1234 1234 1234 1234"/>
            </Field>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="Expiry" required><input className="pass-input" placeholder="MM / YY"/></Field>
              <Field label="CVC" required><input className="pass-input" placeholder="3 digits"/></Field>
            </div>
            <Field label="Name on card" required><input className="pass-input" placeholder="As shown on card"/></Field>
          </div>
        )}
        {method !== 'card' && (
          <div style={{ padding: 18, background: '#FAFAFA', border: '1px dashed #E5E7EB', borderRadius: 12, fontSize: 13, color: '#4A5565' }}>
            You'll be redirected to <strong>{methods.find(m=>m.id===method).label}</strong> to complete payment after confirmation.
          </div>
        )}

        <div style={{
          marginTop: 18, padding: '14px 16px', background: '#F0FEEF',
          border: '1px solid #B8FBB7', borderRadius: 12,
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, fontSize: 12, color: '#0F8610',
        }}>
          {[
            ['lock', '256-bit SSL'],
            ['shield-check', 'PCI-DSS L1'],
            ['rotate-ccw', '14-day refund'],
          ].map(([icon, label]) => (
            <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
              <PFSIcon name={icon} size={16} color="#0F8610"/> {label}
            </span>
          ))}
        </div>
      </div>

      <aside style={{
        position: 'relative', padding: 22, borderRadius: 16,
        background: '#fff', border: '1px solid #E5E7EB',
        boxShadow: '0 8px 24px -12px rgba(0,0,0,0.08)',
        height: 'fit-content',
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Booking summary</div>
        <div style={{ fontSize: 18, fontWeight: 700, color: '#101828', marginTop: 4, letterSpacing: '-0.01em' }}>Functional Skills Maths Level 2</div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13 }}>
          <SummaryRow label="Invigilation" value={data.invigilation === 'auto' ? 'Online remote' : 'Online human'}/>
          <SummaryRow label="Date" value={data.date ? prettyDate(data.date) : '—'}/>
          <SummaryRow label="Time" value={data.time || '—'}/>
          <SummaryRow label="Course" value={
            data.course === 'premium' ? 'Premium bundle' :
            data.course === 'standard' ? 'Standard course' : 'Exam only'
          }/>
        </div>

        <div style={{ height: 1, background: '#E5E7EB', margin: '16px 0' }}/>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 13, color: '#6A7282' }}>RRP</span>
          <span style={{ fontSize: 13, color: '#98A2B3', textDecoration: 'line-through' }}>{gbp(BASE_PRICE + (data.course === 'standard' ? 184 : data.course === 'premium' ? 284 : 0))}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 4 }}>
          <span style={{ fontSize: 13, color: '#0F8610', fontWeight: 600 }}>You save</span>
          <span style={{ fontSize: 13, color: '#0F8610', fontWeight: 700 }}>{gbp(Math.max(0, BASE_PRICE + (data.course === 'standard' ? 184 : data.course === 'premium' ? 284 : 0) - total))}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#101828' }}>Total today</span>
          <span style={{ fontSize: 32, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.02em' }}>{gbp(total)}</span>
        </div>

        <div style={{
          marginTop: 14, padding: '10px 12px', borderRadius: 10,
          background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412',
          fontSize: 12, display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <PFSIcon name="clock" size={14} color="#D97706"/>
          {data.time ? <>This price is held for 8 minutes while you check out.</> : <>Pick a date & time to lock this price.</>}
        </div>
      </aside>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
      <span style={{ color: '#6A7282' }}>{label}</span>
      <span style={{ color: '#101828', fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function GooglePayMark() {
  return (
    <span style={{ display:'inline-flex', alignItems:'center', fontWeight: 600, fontSize: 13, letterSpacing: -0.2 }}>
      <span style={{ color: '#4285F4' }}>G</span>
      <span style={{ color: '#EA4335' }}>o</span>
      <span style={{ color: '#FBBC04' }}>o</span>
      <span style={{ color: '#4285F4' }}>g</span>
      <span style={{ color: '#34A853' }}>l</span>
      <span style={{ color: '#EA4335' }}>e</span>
    </span>
  );
}

function PaymentMark({ id }) {
  const styles = {
    card: <span style={{ display:'inline-flex', gap: 4 }}>
      <span style={{ background:'#1A1F71', color:'#fff', fontSize:10, fontWeight:800, padding:'3px 6px', borderRadius:4, fontStyle:'italic' }}>VISA</span>
      <span style={{ background:'#fff', border:'1px solid #E5E7EB', padding: '2px 4px', borderRadius:4, display:'inline-flex', gap:1 }}>
        <span style={{ width:10, height:10, borderRadius:999, background:'#EB001B' }}/>
        <span style={{ width:10, height:10, borderRadius:999, background:'#F79E1B', marginLeft:-4 }}/>
      </span>
    </span>,
    paypal: <span style={{ background:'#003087', color:'#fff', fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:4 }}>Pay<span style={{ color:'#009CDE' }}>Pal</span></span>,
    klarna: <span style={{ background:'#FFA8CD', color:'#0B051D', fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:4 }}>Klarna.</span>,
    clearpay: <span style={{ background:'#B2FCE4', color:'#0E1F1F', fontSize:11, fontWeight:800, padding:'3px 8px', borderRadius:4 }}>Clearpay</span>,
  };
  return styles[id] || null;
}

window.WIZ_STEPS_B = {
  Step3DateTime, Step4Course, Step5Checkout, validatePassword,
};
