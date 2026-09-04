// SidebarVariants.jsx — five explorations of the course-nav sidebar.
// All five use the same COURSE_OUTLINE data; they differ only in HOW they
// communicate progress from top to bottom. In every variant only the active
// unit (Reading) shows its sub-topics inline — every other unit stays
// collapsed.

const OUTLINE = window.COURSE_OUTLINE;
const ACTIVE = '1'; // Reading is the in-progress unit across all variants

// ---------- shared helpers ----------
const CheckIcon = ({ size = 10, color = '#fff', stroke = 3.5 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
);

// Parse "6 / 10" → 0.6. Done units → 1, todo → 0.
function fractionOf(u) {
  if (u.state === 'done') return 1;
  if (u.state === 'todo') return 0;
  const m = (u.meta || '').match(/(\d+)\s*\/\s*(\d+)/);
  if (m) return parseInt(m[1], 10) / parseInt(m[2], 10);
  return u.state === 'inprogress' ? 0.4 : 0;
}

// Mini topic-row used by 4 of the 5 variants
function TopicRow({ t, accent = '#1447E6' }) {
  const done = t.state === 'done';
  const active = t.state === 'inprogress';
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 10, padding: '5px 0', fontSize: 12}}>
      <span style={{
        width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? '#0E9F6E' : '#fff',
        border: active ? `2px solid ${accent}` : done ? '0' : '1.5px solid #D1D5DB',
        color: '#fff',
      }}>
        {done && <CheckIcon size={9} stroke={4}/>}
        {active && <span style={{width: 5, height: 5, borderRadius: '50%', background: accent}}/>}
      </span>
      <span style={{color: '#98A2B3', fontWeight: 500, fontSize: 10, minWidth: 26, flexShrink: 0}}>{t.n}</span>
      <span style={{
        flex: 1, color: done ? '#6A7282' : '#344054',
        textDecoration: done ? 'line-through' : 'none', textDecorationColor: '#D1D5DB',
        fontWeight: active ? 600 : 400,
      }}>{t.title}</span>
      {active && <span style={{fontSize: 9, fontWeight: 700, color: accent, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Now</span>}
    </div>
  );
}

// ============================================================
// 1 — TIMELINE  (safe refresh of current design)
//   Vertical connected line; done = solid green node, current = blue
//   ringed node with halo, future = empty. "Now" pill on active row.
// ============================================================
function SidebarTimeline() {
  const active = OUTLINE.find(u => u.n === ACTIVE);
  return (
    <aside style={{width: 340, height: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', display: 'flex', flexDirection: 'column', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div style={{padding: '22px 22px 18px', borderBottom: '1px solid #F3F4F6'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Your course</div>
        <div style={{fontSize: 17, fontWeight: 700, color: '#101828', marginTop: 4, letterSpacing: '-0.01em'}}>Functional Skills English L2</div>
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{flex: 1, height: 4, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden'}}>
            <div style={{width: '28%', height: '100%', background: '#1447E6'}}/>
          </div>
          <div style={{fontSize: 11, fontWeight: 700, color: '#1447E6'}}>28%</div>
        </div>
      </div>

      <div style={{padding: '14px 0 24px', position: 'relative', flex: 1}}>
        <div style={{position: 'absolute', left: 36, top: 28, bottom: 24, width: 2, background: '#E5E7EB'}}/>

        {OUTLINE.map(u => {
          const isActive = u.n === ACTIVE;
          const isDone = u.state === 'done';
          return (
            <React.Fragment key={u.n}>
              <div style={{position: 'relative', padding: '8px 22px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer'}}>
                <div style={{position: 'relative', zIndex: 1, width: 24, display: 'flex', justifyContent: 'center'}}>
                  {isActive ? (
                    <div style={{width: 22, height: 22, borderRadius: '50%', background: '#fff', border: '3px solid #1447E6', boxShadow: '0 0 0 4px #EEF6FF, 0 0 0 5px rgba(20,71,230,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span style={{width: 6, height: 6, borderRadius: '50%', background: '#1447E6'}}/>
                    </div>
                  ) : isDone ? (
                    <div style={{width: 22, height: 22, borderRadius: '50%', background: '#0E9F6E', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff'}}>
                      <CheckIcon size={11}/>
                    </div>
                  ) : (
                    <div style={{width: 18, height: 18, borderRadius: '50%', background: '#fff', border: '2px solid #E5E7EB'}}/>
                  )}
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13, fontWeight: isActive ? 700 : 600, color: isActive ? '#1447E6' : isDone ? '#6A7282' : '#101828', display: 'flex', alignItems: 'baseline', gap: 6}}>
                    <span style={{color: '#98A2B3', fontWeight: 500, fontSize: 11, flexShrink: 0}}>{u.n}.</span>
                    <span style={{textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: '#D1D5DB'}}>{u.title}</span>
                  </div>
                  <div style={{fontSize: 11, color: isActive ? '#1447E6' : '#6A7282', marginTop: 2, fontWeight: isActive ? 600 : 400}}>
                    {isDone ? `Completed · ${u.meta}` : u.state === 'inprogress' ? `${u.meta} done · keep going` : `${u.meta} topics`}
                  </div>
                </div>
                {isActive && <span style={{fontSize: 9, fontWeight: 700, color: '#fff', background: '#1447E6', padding: '3px 7px', borderRadius: 999, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Now</span>}
              </div>

              {isActive && active.topics && (
                <div style={{margin: '4px 22px 12px 60px', position: 'relative', paddingLeft: 14}}>
                  <div style={{position: 'absolute', left: 0, top: 4, bottom: 4, width: 2, background: '#E1EFFE'}}/>
                  {active.topics.map(t => <TopicRow key={t.n} t={t}/>)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
window.SidebarTimeline = SidebarTimeline;

// ============================================================
// 2 — SPINE  (continuous fill bar)
//   Big % up top. A single thick spine on the left fills from top to the
//   current row; the boundary cap circle is the "you are here" marker.
// ============================================================
function SidebarSpine() {
  const active = OUTLINE.find(u => u.n === ACTIVE);
  const activeIdx = OUTLINE.findIndex(u => u.n === ACTIVE);
  const activeFrac = fractionOf(active); // 0.6 for Reading

  return (
    <aside style={{width: 340, height: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div style={{padding: '22px 22px 22px', borderBottom: '1px solid #F3F4F6'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Course progress</div>
        <div style={{fontSize: 15, fontWeight: 700, color: '#101828', marginTop: 4}}>Functional Skills English L2</div>
        <div style={{marginTop: 14, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'baseline'}}>
            <span style={{fontSize: 40, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em', lineHeight: 1}}>28</span>
            <span style={{fontSize: 18, color: '#6A7282', fontWeight: 600, marginLeft: 2}}>%</span>
          </div>
          <div style={{fontSize: 11, color: '#6A7282', textAlign: 'right', lineHeight: 1.4}}>
            <div><strong style={{color: '#101828', fontWeight: 700}}>14h</strong> remaining</div>
            <div style={{color: '#98A2B3'}}>Target: end of term</div>
          </div>
        </div>
      </div>

      <div style={{padding: '8px 0 24px'}}>
        {OUTLINE.map((u, i) => {
          const isActive = u.n === ACTIVE;
          const isDone = u.state === 'done';
          const isPast = i < activeIdx;
          // Spine segment colouring
          let bgTop = '#F3F4F6', bgBot = '#F3F4F6';
          if (isPast) { bgTop = '#1447E6'; bgBot = '#1447E6'; }
          else if (isActive) { bgTop = '#1447E6'; bgBot = '#F3F4F6'; }

          return (
            <React.Fragment key={u.n}>
              <div style={{display: 'flex', alignItems: 'stretch', minHeight: 56, cursor: 'pointer'}}>
                <div style={{width: 56, position: 'relative', flexShrink: 0}}>
                  {/* Spine segment for this row */}
                  <div style={{position: 'absolute', left: 24, top: 0, bottom: 0, width: 8, background: `linear-gradient(180deg, ${bgTop} 0%, ${bgTop} ${isActive ? activeFrac * 100 : 100}%, ${bgBot} ${isActive ? activeFrac * 100 : 100}%)`, borderRadius: i === 0 ? '999px 999px 0 0' : i === OUTLINE.length - 1 ? '0 0 999px 999px' : '0'}}/>
                  {/* Cap circle on active row */}
                  {isActive && (
                    <div style={{position: 'absolute', left: 14, top: `calc(${activeFrac * 100}% - 14px)`, width: 28, height: 28, borderRadius: '50%', background: '#fff', border: '4px solid #1447E6', boxShadow: '0 0 0 4px rgba(20,71,230,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <span style={{width: 6, height: 6, borderRadius: '50%', background: '#1447E6'}}/>
                    </div>
                  )}
                  {/* Tick for done rows */}
                  {isDone && !isActive && (
                    <div style={{position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, borderRadius: '50%', background: '#fff', border: '2px solid #1447E6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1447E6'}}>
                      <CheckIcon size={10} color="#1447E6" stroke={3.5}/>
                    </div>
                  )}
                </div>
                <div style={{flex: 1, minWidth: 0, padding: '14px 22px 14px 4px', background: isActive ? 'linear-gradient(90deg, #EEF6FF 0%, #fff 100%)' : 'transparent'}}>
                  <div style={{fontSize: 13, fontWeight: isActive ? 700 : 600, color: isActive ? '#1447E6' : isDone ? '#6A7282' : '#101828', display: 'flex', alignItems: 'baseline', gap: 6}}>
                    <span style={{color: '#98A2B3', fontWeight: 500, fontSize: 11, flexShrink: 0}}>{u.n}.</span>
                    <span>{u.title}</span>
                  </div>
                  <div style={{fontSize: 11, color: '#6A7282', marginTop: 2}}>
                    {isDone ? 'Complete' : u.state === 'inprogress' ? `${u.meta} done` : u.meta}
                  </div>
                </div>
              </div>

              {isActive && active.topics && (
                <div style={{margin: '0 22px 14px 60px', padding: '10px 12px', background: '#FAFBFC', border: '1px solid #F3F4F6', borderRadius: 8}}>
                  {active.topics.map(t => <TopicRow key={t.n} t={t}/>)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
window.SidebarSpine = SidebarSpine;

// ============================================================
// 3 — STEPPER  (large numbered steps, current = hero card)
//   Big 48-px chip per step. Connector pills between. The active step
//   blooms into a coloured card with its topics inside.
// ============================================================
function SidebarStepper() {
  const active = OUTLINE.find(u => u.n === ACTIVE);
  const activeIdx = OUTLINE.findIndex(u => u.n === ACTIVE);

  return (
    <aside style={{width: 360, height: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div style={{padding: '22px 22px 18px', borderBottom: '1px solid #F3F4F6'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Functional Skills English L2</div>
        <div style={{fontSize: 22, fontWeight: 800, color: '#101828', marginTop: 4, letterSpacing: '-0.025em'}}>
          Step <span style={{color: '#1447E6'}}>{activeIdx + 1}</span><span style={{color: '#98A2B3', fontWeight: 600}}> / {OUTLINE.length}</span>
        </div>
      </div>

      <div style={{padding: '18px 18px 24px'}}>
        {OUTLINE.map((u, i) => {
          const isActive = u.n === ACTIVE;
          const isDone = u.state === 'done';
          const stepNum = String(i + 1).padStart(2, '0');
          const passed = i <= activeIdx;
          return (
            <React.Fragment key={u.n}>
              {i > 0 && (
                <div style={{height: 14, width: 3, background: passed ? '#1447E6' : '#E5E7EB', marginLeft: 22, borderRadius: 2}}/>
              )}
              <div style={{display: 'flex', alignItems: 'flex-start', gap: 14}}>
                <div style={{width: 48, height: 48, borderRadius: 12, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14, letterSpacing: '-0.01em',
                  background: isActive ? '#1447E6' : isDone ? '#fff' : '#F3F4F6',
                  color: isActive ? '#fff' : isDone ? '#0E9F6E' : '#98A2B3',
                  border: isDone && !isActive ? '2px solid #0E9F6E' : '0',
                  boxShadow: isActive ? '0 6px 16px rgba(20,71,230,0.30)' : 'none',
                }}>
                  {isDone && !isActive ? <CheckIcon size={20} color="#0E9F6E" stroke={3}/> : stepNum}
                </div>
                {isActive ? (
                  <div style={{flex: 1, minWidth: 0, background: '#EEF6FF', border: '1.5px solid #BEDBFF', borderRadius: 12, padding: 14, marginTop: -2}}>
                    <div style={{fontSize: 10, fontWeight: 700, color: '#1447E6', letterSpacing: '0.06em', textTransform: 'uppercase'}}>In progress</div>
                    <div style={{fontSize: 16, fontWeight: 700, color: '#101828', marginTop: 2, letterSpacing: '-0.01em'}}>{u.title}</div>
                    <div style={{fontSize: 12, color: '#1447E6', fontWeight: 600, marginTop: 2}}>{u.meta} topics complete</div>
                    {active.topics && (
                      <div style={{marginTop: 12, paddingTop: 10, borderTop: '1px solid #BEDBFF'}}>
                        {active.topics.map(t => <TopicRow key={t.n} t={t}/>)}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{flex: 1, minWidth: 0, paddingTop: 6, cursor: 'pointer'}}>
                    <div style={{fontSize: 10, color: '#98A2B3', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em'}}>{isDone ? 'Complete' : u.state === 'inprogress' ? 'Started' : i === activeIdx + 1 ? 'Up next' : 'Not started'}</div>
                    <div style={{fontSize: 14, fontWeight: 600, color: isDone ? '#6A7282' : '#101828', marginTop: 2, textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: '#D1D5DB'}}>{u.title}</div>
                    <div style={{fontSize: 11, color: '#6A7282', marginTop: 2}}>{u.meta}</div>
                  </div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
window.SidebarStepper = SidebarStepper;

// ============================================================
// 4 — STACKED BARS  (each unit has its own mini progress bar)
//   Data-dense. Ring chart in the header for overall %. Each row is a
//   little progress card you can scan in a glance.
// ============================================================
function SidebarBars() {
  const active = OUTLINE.find(u => u.n === ACTIVE);
  const r = 22, circ = 2 * Math.PI * r;

  return (
    <aside style={{width: 360, height: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif'}}>
      <div style={{padding: '20px 22px 18px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: 16}}>
        <div style={{width: 56, height: 56, position: 'relative', flexShrink: 0}}>
          <svg width="56" height="56" viewBox="0 0 56 56">
            <circle cx="28" cy="28" r={r} fill="none" stroke="#F3F4F6" strokeWidth="6"/>
            <circle cx="28" cy="28" r={r} fill="none" stroke="#1447E6" strokeWidth="6"
              strokeDasharray={`${0.28 * circ} ${circ}`}
              transform="rotate(-90 28 28)" strokeLinecap="round"/>
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em'}}>28%</div>
        </div>
        <div style={{flex: 1, minWidth: 0}}>
          <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Functional Skills</div>
          <div style={{fontSize: 16, fontWeight: 700, color: '#101828', marginTop: 2}}>English L2</div>
          <div style={{fontSize: 11, color: '#6A7282', marginTop: 2}}>3 of 9 units underway</div>
        </div>
      </div>

      <div style={{padding: '12px 12px 24px', display: 'flex', flexDirection: 'column', gap: 4}}>
        {OUTLINE.map(u => {
          const isActive = u.n === ACTIVE;
          const isDone = u.state === 'done';
          const pct = fractionOf(u);
          return (
            <React.Fragment key={u.n}>
              <div style={{padding: '12px 14px', borderRadius: 10, background: isActive ? '#EEF6FF' : 'transparent', cursor: 'pointer', border: isActive ? '1.5px solid #BEDBFF' : '1.5px solid transparent'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8}}>
                  <span style={{color: '#98A2B3', fontWeight: 600, fontSize: 11, minWidth: 24}}>{u.n}</span>
                  <span style={{flex: 1, fontSize: 13, fontWeight: isActive ? 700 : 600, color: isActive ? '#1447E6' : isDone ? '#6A7282' : '#101828'}}>{u.title}</span>
                  {isDone ? (
                    <span style={{display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, fontWeight: 700, color: '#0E9F6E', letterSpacing: '0.04em', textTransform: 'uppercase'}}>
                      <CheckIcon size={9} color="#0E9F6E" stroke={4}/> Done
                    </span>
                  ) : (
                    <span style={{fontSize: 11, fontWeight: 700, color: isActive ? '#1447E6' : '#98A2B3', flexShrink: 0}}>
                      {u.meta}
                    </span>
                  )}
                </div>
                <div style={{height: 6, background: isActive ? '#fff' : '#F3F4F6', borderRadius: 999, overflow: 'hidden'}}>
                  <div style={{width: `${Math.max(pct * 100, isDone ? 100 : 0)}%`, height: '100%', background: isDone ? '#0E9F6E' : '#1447E6', borderRadius: 999, transition: 'width .3s'}}/>
                </div>
              </div>
              {isActive && active.topics && (
                <div style={{margin: '2px 14px 8px', padding: '12px 14px', background: '#fff', border: '1px solid #E5E7EB', borderRadius: 10}}>
                  {active.topics.map(t => <TopicRow key={t.n} t={t}/>)}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </aside>
  );
}
window.SidebarBars = SidebarBars;

// ============================================================
// 5 — MAP / PATH  (playful but restrained)
//   A gentle S-curve snakes down the rail. Each unit is a stop along the
//   path. Active stop has a "YOU'RE HERE" pin and a halo. Active unit's
//   topics live in a card pinned to the bottom of the rail.
// ============================================================
function SidebarMap() {
  const active = OUTLINE.find(u => u.n === ACTIVE);
  const activeIdx = OUTLINE.findIndex(u => u.n === ACTIVE);

  const W = 380;
  const padTop = 30;
  const stopSpacing = 50;
  const stops = OUTLINE.map((u, i) => {
    // Gentle horizontal wave between x ~ 60 and x ~ 220
    const x = 140 + Math.sin(i * 0.85) * 75;
    const y = padTop + i * stopSpacing;
    return { x, y, u, i };
  });
  const H = padTop * 2 + (OUTLINE.length - 1) * stopSpacing;

  // Smooth path through stops via cubic bezier (control points reflect the slope)
  const buildPath = (pts) => {
    if (pts.length === 0) return '';
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1], p1 = pts[i];
      const midY = (p0.y + p1.y) / 2;
      d += ` C ${p0.x} ${midY}, ${p1.x} ${midY}, ${p1.x} ${p1.y}`;
    }
    return d;
  };

  const dFull = buildPath(stops);
  const dDone = buildPath(stops.slice(0, activeIdx + 1));

  return (
    <aside style={{width: 400, height: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', fontFamily: 'Inter, system-ui, sans-serif', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '22px 22px 16px', borderBottom: '1px solid #F3F4F6'}}>
        <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Your journey</div>
        <div style={{fontSize: 17, fontWeight: 700, color: '#101828', marginTop: 4, letterSpacing: '-0.01em'}}>Functional Skills English L2</div>
        <div style={{fontSize: 12, color: '#6A7282', marginTop: 4}}>Stop {activeIdx + 1} of {OUTLINE.length} · 28% of the way</div>
      </div>

      <div style={{position: 'relative', flex: '0 0 auto'}}>
        <svg width={W} height={H} style={{display: 'block'}}>
          {/* Background dashed path = full route */}
          <path d={dFull} fill="none" stroke="#E5E7EB" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 6"/>
          {/* Solid completed portion */}
          <path d={dDone} fill="none" stroke="#1447E6" strokeWidth="3" strokeLinecap="round"/>

          {/* Stops */}
          {stops.map(({x, y, u, i}) => {
            const isActive = u.n === ACTIVE;
            const isDone = u.state === 'done';
            const labelLeft = x > W / 2;
            return (
              <g key={u.n}>
                {/* Halo on active */}
                {isActive && (
                  <>
                    <circle cx={x} cy={y} r="22" fill="#1447E6" opacity="0.10"/>
                    <circle cx={x} cy={y} r="16" fill="#1447E6" opacity="0.18"/>
                  </>
                )}
                {/* Node */}
                <circle cx={x} cy={y} r={isActive ? 11 : 9}
                  fill={isDone && !isActive ? '#0E9F6E' : isActive ? '#1447E6' : '#fff'}
                  stroke={isDone && !isActive ? '#0E9F6E' : isActive ? '#fff' : '#D1D5DB'}
                  strokeWidth={isActive ? 3 : 2}/>
                {isDone && !isActive && (
                  <path d={`M ${x-3.5} ${y-0.5} L ${x-1} ${y+2.5} L ${x+4} ${y-2.5}`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                )}
                {isActive && <circle cx={x} cy={y} r="4" fill="#fff"/>}

                {/* "YOU'RE HERE" pin */}
                {isActive && (
                  <g transform={`translate(${x}, ${y - 22})`}>
                    <rect x="-44" y="-18" width="88" height="20" rx="4" fill="#1447E6"/>
                    <text x="0" y="-4" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle" letterSpacing="0.06em" fontFamily="Inter, sans-serif">YOU'RE HERE</text>
                    <path d="M -4 2 L 0 6 L 4 2 Z" fill="#1447E6"/>
                  </g>
                )}

                {/* Label */}
                <foreignObject
                  x={labelLeft ? 12 : x + 20}
                  y={y - 18}
                  width={labelLeft ? x - 30 : W - x - 28}
                  height="40">
                  <div xmlns="http://www.w3.org/1999/xhtml" style={{
                    fontFamily: 'Inter, sans-serif',
                    textAlign: labelLeft ? 'right' : 'left',
                    lineHeight: 1.25,
                  }}>
                    <div style={{fontSize: 10, color: '#98A2B3', fontWeight: 500}}>{u.n}</div>
                    <div style={{fontSize: 12, fontWeight: isActive ? 700 : 600, color: isActive ? '#1447E6' : isDone ? '#6A7282' : '#344054', textDecoration: isDone ? 'line-through' : 'none', textDecorationColor: '#D1D5DB'}}>{u.title}</div>
                  </div>
                </foreignObject>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Active card pinned below */}
      <div style={{margin: '4px 16px 20px', padding: '14px 16px', background: '#fff', border: '1.5px solid #BEDBFF', borderRadius: 12, boxShadow: '0 4px 14px rgba(20,71,230,0.08)'}}>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8}}>
          <div>
            <div style={{fontSize: 10, fontWeight: 700, color: '#1447E6', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Continue here</div>
            <div style={{fontSize: 14, fontWeight: 700, color: '#101828', marginTop: 2}}>{active.n} · {active.title}</div>
          </div>
          <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282'}}>{active.meta}</div>
        </div>
        <div style={{marginTop: 10, paddingTop: 8, borderTop: '1px solid #F3F4F6'}}>
          {active.topics && active.topics.slice(0, 5).map(t => <TopicRow key={t.n} t={t}/>)}
          {active.topics && active.topics.length > 5 && (
            <div style={{fontSize: 11, color: '#1447E6', fontWeight: 600, marginTop: 6, cursor: 'pointer'}}>+ {active.topics.length - 5} more topics →</div>
          )}
        </div>
      </div>
    </aside>
  );
}
window.SidebarMap = SidebarMap;
