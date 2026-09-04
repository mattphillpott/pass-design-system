// Booking Wizard — step components (1-5) and step nav variants

const { priceFor, gbp, validators, spacesLeft, TIME_SLOTS, DAY_LABELS_SHORT, MONTH_LABELS,
        isoDate, fromIso, addDays, startOfMonth, daysInMonth, mondayIndex,
        dayDiscount, timeDiscount, BASE_PRICE,
        Field, TrustPill, SaveBadge } = window.WIZ;

// ═══════════════════════════════════════════════════════════════════
//  STEP NAV VARIANTS
// ═══════════════════════════════════════════════════════════════════
const STEP_LABELS = ['Your details', 'Invigilation', 'Date & time', 'Course', 'Checkout'];

function StepNavNumbered({ step, setStep, maxReached }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '4px 0' }}>
      {STEP_LABELS.map((label, i) => {
        const isActive = i === step;
        const isDone = i < step;
        const reachable = i <= maxReached;
        return (
          <React.Fragment key={i}>
            <button
              type="button"
              onClick={() => reachable && setStep(i)}
              disabled={!reachable}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                background: 'transparent', border: 'none', padding: '8px 6px',
                cursor: reachable ? 'pointer' : 'not-allowed',
                opacity: reachable ? 1 : 0.4, fontFamily: 'inherit',
              }}>
              <span style={{
                width: 28, height: 28, borderRadius: 999,
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700,
                background: isActive ? '#0FBC0F' : isDone ? '#DBFEDA' : '#F3F4F6',
                color: isActive ? '#fff' : isDone ? '#0F8610' : '#6A7282',
                border: isActive ? '2px solid #0FBC0F' : '2px solid transparent',
                transition: 'all .2s',
              }}>
                {isDone ? <PFSIcon name="check" size={14} color="#0F8610"/> : i + 1}
              </span>
              <span style={{
                fontSize: 13, fontWeight: isActive ? 700 : 500,
                color: isActive ? '#101828' : isDone ? '#0F8610' : '#6A7282',
                whiteSpace: 'nowrap'
              }} className="wiz-step-label">{label}</span>
            </button>
            {i < STEP_LABELS.length - 1 && (
              <div style={{
                flex: 1, height: 2, background: i < step ? '#0FBC0F' : '#E5E7EB',
                margin: '0 4px', minWidth: 16, transition: 'background .3s'
              }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function StepNavBar({ step, setStep, maxReached }) {
  const pct = ((step + 1) / STEP_LABELS.length) * 100;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Step {step + 1} of {STEP_LABELS.length}
          </div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#101828', marginTop: 2 }}>{STEP_LABELS[step]}</div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {STEP_LABELS.map((_, i) => (
            <button key={i} type="button" disabled={i > maxReached} onClick={() => i <= maxReached && setStep(i)}
              style={{
                width: 22, height: 22, borderRadius: 999, border: 'none', cursor: i <= maxReached ? 'pointer' : 'not-allowed',
                background: i === step ? '#0FBC0F' : i < step ? '#DBFEDA' : '#F3F4F6',
                color: i === step ? '#fff' : i < step ? '#0F8610' : '#98A2B3',
                fontSize: 11, fontWeight: 700, opacity: i > maxReached ? 0.4 : 1,
              }}>{i+1}</button>
          ))}
        </div>
      </div>
      <div style={{ height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #0FBC0F, #18CF18)', borderRadius: 999, transition: 'width .4s cubic-bezier(.4,0,.2,1)' }}/>
      </div>
    </div>
  );
}

function StepNavChips({ step, setStep, maxReached }) {
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {STEP_LABELS.map((label, i) => {
        const reachable = i <= maxReached;
        const active = i === step;
        return (
          <button key={i} type="button" onClick={() => reachable && setStep(i)} disabled={!reachable}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '8px 14px', borderRadius: 999, fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600,
              background: active ? '#0FBC0F' : i < step ? '#F0FEEF' : '#fff',
              color: active ? '#fff' : i < step ? '#0F8610' : '#4A5565',
              border: active ? '1.5px solid #0FBC0F' : i < step ? '1.5px solid #B8FBB7' : '1.5px solid #E5E7EB',
              cursor: reachable ? 'pointer' : 'not-allowed', opacity: reachable ? 1 : 0.5,
              transition: 'all .2s',
            }}>
            <span style={{
              width: 18, height: 18, borderRadius: 999, fontSize: 11, fontWeight: 700,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              background: active ? 'rgba(255,255,255,0.25)' : i < step ? '#DBFEDA' : '#F3F4F6',
              color: active ? '#fff' : i < step ? '#0F8610' : '#6A7282',
            }}>{i < step ? '✓' : i+1}</span>
            {label}
          </button>
        );
      })}
    </div>
  );
}

function StepNav({ variant, ...props }) {
  if (variant === 'bar') return <StepNavBar {...props}/>;
  if (variant === 'chips') return <StepNavChips {...props}/>;
  return <StepNavNumbered {...props}/>;
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 1 — Your details
// ═══════════════════════════════════════════════════════════════════
function Step1Details({ data, setData, errors, setErrors }) {
  const fields = [
    { key: 'firstName', label: 'First name', placeholder: 'Jordan', type: 'text', col: 1 },
    { key: 'lastName',  label: 'Last name',  placeholder: 'Mitchell', type: 'text', col: 1 },
    { key: 'email',     label: 'Email address', placeholder: 'you@email.com', type: 'email', col: 2, hint: "Booking confirmation and joining link will be sent here." },
    { key: 'phone',     label: 'Mobile number',  placeholder: '07…', type: 'tel', col: 2, hint: "We'll text you a reminder 24h before your exam." },
  ];
  const onBlur = (k) => setErrors(prev => ({ ...prev, [k]: validators[k](data[k]) }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0,1fr))', gap: 16 }} className="wiz-grid-2">
        {fields.filter(f => f.col === 1).map(f => (
          <Field key={f.key} label={f.label} required error={errors[f.key]}>
            <input className="pass-input" type={f.type} placeholder={f.placeholder}
              value={data[f.key] || ''}
              onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
              onBlur={() => onBlur(f.key)}
              style={{ borderColor: errors[f.key] ? '#C70036' : undefined }}
            />
          </Field>
        ))}
      </div>
      {fields.filter(f => f.col === 2).map(f => (
        <Field key={f.key} label={f.label} required error={errors[f.key]} hint={f.hint}>
          <input className="pass-input" type={f.type} placeholder={f.placeholder}
            value={data[f.key] || ''}
            onChange={e => setData(d => ({ ...d, [f.key]: e.target.value }))}
            onBlur={() => onBlur(f.key)}
            style={{ borderColor: errors[f.key] ? '#C70036' : undefined }}
          />
        </Field>
      ))}

      <div style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: 14, background: '#F0FEEF',
        border: '1px solid #B8FBB7', borderRadius: 12,
      }}>
        <span style={{ width: 32, height: 32, borderRadius: 999, background: '#0FBC0F', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
          <PFSIcon name="lock" size={16} color="#fff"/>
        </span>
        <div style={{ fontSize: 13, color: '#0F8610', lineHeight: 1.4 }}>
          Your details are encrypted and never shared. We only use them to confirm your booking and exam invigilation.
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
//  STEP 2 — Invigilation
// ═══════════════════════════════════════════════════════════════════
function Step2Invigilation({ data, setData }) {
  const options = [
    {
      id: 'human',
      title: 'Online human invigilation',
      tag: 'Most popular',
      tagTone: 'brand',
      priceLabel: 'No extra charge',
      delta: 0,
      blurb: 'A real exam invigilator joins you live via webcam. Best for first-time learners or anyone who wants 1-to-1 reassurance during setup.',
      bullets: [
        ['users', 'Real person on the call'],
        ['clock', 'Results in 6–16 working days'],
        ['shield-check', 'Awarded by Open Awards'],
        ['headphones', 'Live setup support'],
      ],
    },
    {
      id: 'auto',
      title: 'Online remote invigilation',
      tag: `Save ${gbp(16)}`,
      tagTone: 'success',
      priceLabel: '−£16.00',
      delta: -16,
      blurb: 'AI-monitored exam recording reviewed afterwards. Sit any time, anywhere — perfect if you want maximum flexibility on date, time and location.',
      bullets: [
        ['video', 'Recorded and reviewed later'],
        ['zap', 'Results in 2–6 working days'],
        ['shield-check', 'Awarded by TQUK'],
        ['globe', 'Sit from anywhere, any time'],
      ],
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="wiz-grid-2">
        {options.map(o => {
          const active = data.invigilation === o.id;
          return (
            <button
              key={o.id} type="button"
              onClick={() => setData(d => ({ ...d, invigilation: o.id }))}
              style={{
                position: 'relative', textAlign: 'left', cursor: 'pointer',
                padding: 22, borderRadius: 16, fontFamily: 'inherit',
                background: active ? '#F0FEEF' : '#fff',
                border: active ? '2px solid #0FBC0F' : '2px solid #E5E7EB',
                transition: 'all .2s',
                boxShadow: active ? '0 8px 24px -8px rgba(15,188,15,0.25)' : 'none',
              }}>
              {/* tag */}
              <span style={{
                position: 'absolute', top: -10, right: 16,
                fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999,
                background: o.tagTone === 'success' ? '#0FBC0F' : '#101828',
                color: '#fff',
              }}>{o.tag}</span>

              {/* radio + title */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: 999,
                  border: active ? '6px solid #0FBC0F' : '2px solid #D1D5DB',
                  background: '#fff', flexShrink: 0, marginTop: 2,
                  transition: 'all .2s',
                }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em' }}>{o.title}</div>
                  <div style={{ fontSize: 13, color: '#0F8610', fontWeight: 600, marginTop: 2 }}>{o.priceLabel}</div>
                </div>
              </div>

              <p style={{ margin: '14px 0 16px', fontSize: 14, color: '#344054', lineHeight: 1.5 }}>{o.blurb}</p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 8 }}>
                {o.bullets.map(([icon, text]) => (
                  <li key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#344054' }}>
                    <span style={{ width: 22, height: 22, borderRadius: 6, background: active ? '#DBFEDA' : '#F3F4F6', color: '#0F8610', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PFSIcon name={icon} size={13} color="#0F8610"/>
                    </span>
                    {text}
                  </li>
                ))}
              </ul>
            </button>
          );
        })}
      </div>

      <div style={{
        background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412',
        padding: 12, borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <PFSIcon name="alert-triangle" size={16} color="#D97706"/>
        Both methods are Ofqual-regulated. The qualification is identical — only the invigilation differs.
      </div>
    </div>
  );
}

window.WIZ_STEPS_A = {
  StepNav, STEP_LABELS,
  Step1Details, Step2Invigilation,
};
