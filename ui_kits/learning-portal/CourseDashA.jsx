// Variation A — "Safe" redesign of the Course Dashboard.
// Goal: keep all existing modules, but give the page a clear hierarchy,
// warmer tone, and better visual rhythm.

function CourseDashA({ density = 'cosy' }) {
  const cardPad = density === 'compact' ? 18 : 24;
  const gridGap = density === 'compact' ? 14 : 18;

  return (
    <div style={{display: 'flex', height: '100%', background: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', color: '#101828'}}>
      <CourseSidebar density={density}/>

      <main style={{flex: 1, minWidth: 0, overflowY: 'auto'}}>
        {/* Top bar */}
        <header style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 28px', background: '#fff', borderBottom: '1px solid #E5E7EB'}}>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Course dashboard</div>
            <h1 style={{margin: '2px 0 0', fontSize: 22, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em'}}>Hi Aisha — let's do 25 minutes today.</h1>
            <div style={{fontSize: 13, color: '#6A7282', marginTop: 2}}>Functional Skills English Level 2 · Cohort JAN-26</div>
          </div>
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <button className="pass-btn pass-btn--secondary"><span style={{fontSize: 14}}>📅</span>Exam in 47 days</button>
            <button className="pass-btn pass-btn--primary">Resume Reading 1.2 →</button>
          </div>
        </header>

        <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap: gridGap}}>

          {/* Top stat strip — 4 KPIs */}
          <section style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: gridGap}}>
            {[
              { label: 'Exam-Ready',       value: '1/8',     hint: 'milestones complete', tint: '#F0FEEF', fg: '#0F8610', dot: '#0FBC0F' },
              { label: 'Course Progress',  value: '27%',     hint: '· +4% this week',     tint: '#F0FEEF', fg: '#0F8610', dot: '#0FBC0F' },
              { label: 'Current Level',    value: '0.55',    hint: 'of 2.5 target',       tint: '#FFF7ED', fg: '#9A3412', dot: '#D97706' },
              { label: 'Chance of Passing',value: '62%',     hint: 'more work needed',    tint: '#FDF2F2', fg: '#9B1C1C', dot: '#C70036' },
            ].map(s => (
              <div key={s.label} style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: cardPad, position: 'relative', overflow: 'hidden'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: s.dot}}/>
                  <span style={{fontSize: 12, fontWeight: 600, color: '#4A5565', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{s.label}</span>
                </div>
                <div style={{fontSize: 36, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em', marginTop: 10, lineHeight: 1}}>{s.value}</div>
                <div style={{fontSize: 12, color: s.fg, fontWeight: 500, marginTop: 6}}>{s.hint}</div>
              </div>
            ))}
          </section>

          {/* Two-up: Exam-Ready Progress checklist + Revision Time dial */}
          <section style={{display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: gridGap}}>
            {/* Exam-Ready Progress */}
            <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: cardPad}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Exam-Ready Progress</div>
                  <h3 style={{margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: '#101828'}}>Your path to ready</h3>
                  <div style={{fontSize: 13, color: '#6A7282', marginTop: 2}}>Complete all 8 to be ready for your exam.</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 11, color: '#6A7282'}}>1 of 8 complete</div>
                  <div style={{width: 120, height: 8, background: '#F3F4F6', borderRadius: 999, marginTop: 6, overflow: 'hidden'}}>
                    <div style={{width: '12.5%', height: '100%', background: '#0FBC0F'}}/>
                  </div>
                </div>
              </div>

              <div style={{marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8}}>
                {[
                  { state: 'done',   title: 'Subject Knowledge Assessment', cta: 'View result' },
                  { state: 'active', title: 'Complete Personal Learning Plan', cta: 'View topics' },
                  { state: 'todo',   title: 'Speaking, Listening and Communicating', cta: null },
                  { state: 'todo',   title: 'Complete a Reading Mock Exam and score over 60%', cta: 'Start' },
                  { state: 'todo',   title: 'Complete a Writing Mock Exam and score over 60%', cta: 'Start' },
                  { state: 'todo',   title: 'Above Recommended Current Level', cta: null },
                ].map((row, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 16px',
                    background: row.state === 'active' ? '#F0FEEF' : '#fff',
                    border: '1px solid ' + (row.state === 'active' ? '#B8FBB7' : '#F3F4F6'),
                    borderRadius: 10,
                  }}>
                    <StateDot state={row.state === 'active' ? 'inprogress' : row.state}/>
                    <div style={{flex: 1, fontSize: 14, fontWeight: row.state === 'active' ? 600 : 500, color: row.state === 'done' ? '#6A7282' : '#101828', textDecoration: row.state === 'done' ? 'line-through' : 'none'}}>{row.title}</div>
                    {row.cta && <button className={'pass-btn ' + (row.state === 'active' ? 'pass-btn--primary' : 'pass-btn--secondary') + ' pass-btn--sm'}>{row.cta}</button>}
                  </div>
                ))}
              </div>
            </div>

            {/* Revision Time dial */}
            <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: cardPad, display: 'flex', flexDirection: 'column'}}>
              <div style={{fontSize: 11, fontWeight: 700, color: '#9A3412', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Revision Time Required</div>
              <h3 style={{margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: '#101828'}}>Until exam-ready</h3>

              <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '20px 0'}}>
                <Dial value={0.55} target={2.5} hours={33} mins={48}/>
              </div>

              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#4A5565', borderTop: '1px solid #F3F4F6', paddingTop: 12}}>
                <div>You are here<br/><strong style={{color: '#101828', fontSize: 14}}>Level 0.55</strong></div>
                <div style={{textAlign: 'right'}}>Your Target<br/><strong style={{color: '#101828', fontSize: 14}}>Level 2.5</strong></div>
              </div>
              <div style={{fontSize: 12, color: '#6A7282', marginTop: 12, lineHeight: 1.5}}>On average, Pass students like you go from your current level (0.55) to the Exam-Ready level of 2.5 in about <strong style={{color: '#101828'}}>33h 48m</strong>.</div>
            </div>
          </section>

          {/* Skill cards — Reading / Writing / Speaking */}
          <section>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
              <h3 style={{margin: 0, fontSize: 16, fontWeight: 700, color: '#101828'}}>Pick a skill to practise</h3>
              <a href="#" style={{fontSize: 13, color: '#0F8610', fontWeight: 600, textDecoration: 'none'}}>View all topics →</a>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: gridGap}}>
              {[
                { title: 'Reading',   pct: 43, accent: '#C70036', tint: '#FDF2F2', topics: 10, body: 'You\'re moving fast — finish 1.2 Text Type next.' },
                { title: 'Writing',   pct: 18, accent: '#D97706', tint: '#FFF7ED', topics: 10, body: 'Best win today: a 12-min punctuation drill.' },
                { title: 'Speaking, Listening & Communicating', pct: 16, accent: '#0F8610', tint: '#F0FEEF', topics: 10, body: 'Your group session is Wednesday at 10:00.' },
              ].map(s => (
                <div key={s.title} style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  <div style={{padding: cardPad, paddingBottom: 12, background: s.tint, borderBottom: '1px solid #F3F4F6'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                      <div>
                        <div style={{fontSize: 11, fontWeight: 700, color: s.accent, letterSpacing: '0.06em', textTransform: 'uppercase'}}>{s.topics} topics</div>
                        <h4 style={{margin: '4px 0 0', fontSize: 18, fontWeight: 700, color: '#101828', lineHeight: 1.2}}>{s.title}</h4>
                      </div>
                      <div style={{fontSize: 22, fontWeight: 800, color: s.accent, letterSpacing: '-0.02em'}}>{s.pct}%</div>
                    </div>
                    <div style={{height: 6, background: 'rgba(255,255,255,0.6)', borderRadius: 999, overflow: 'hidden', marginTop: 14}}>
                      <div style={{height: '100%', width: s.pct + '%', background: s.accent, borderRadius: 999}}/>
                    </div>
                  </div>
                  <div style={{padding: cardPad, display: 'flex', flexDirection: 'column', gap: 12, flex: 1}}>
                    <p style={{margin: 0, fontSize: 13, color: '#4A5565', lineHeight: 1.5}}>{s.body}</p>
                    <button className="pass-btn pass-btn--primary" style={{justifyContent: 'center', marginTop: 'auto'}}>Start learning →</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// SVG dial — Pass-styled, with a needle
function Dial({ value = 0.55, target = 2.5, hours = 33, mins = 48 }) {
  const size = 220;
  const r = 92;
  const cx = size/2, cy = size/2;
  const startAngle = -210, endAngle = 30;       // sweep range
  const t = Math.max(0, Math.min(1, value/target));
  const angle = startAngle + (endAngle - startAngle) * t;

  const arc = (a1, a2, color, width) => {
    const rad = (a) => (a * Math.PI) / 180;
    const x1 = cx + r * Math.cos(rad(a1)), y1 = cy + r * Math.sin(rad(a1));
    const x2 = cx + r * Math.cos(rad(a2)), y2 = cy + r * Math.sin(rad(a2));
    const large = Math.abs(a2 - a1) > 180 ? 1 : 0;
    return <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`} stroke={color} strokeWidth={width} fill="none" strokeLinecap="round"/>;
  };
  const rad = (a) => (a * Math.PI) / 180;
  const nx = cx + (r - 6) * Math.cos(rad(angle));
  const ny = cy + (r - 6) * Math.sin(rad(angle));

  return (
    <svg width={size} height={size - 30} viewBox={`0 0 ${size} ${size}`} style={{display: 'block'}}>
      {/* track */}
      {arc(startAngle, endAngle, '#F3F4F6', 14)}
      {/* segments */}
      {arc(-210, -150, '#C70036', 14)}
      {arc(-150, -90,  '#D97706', 14)}
      {arc(-90,   30,  '#0FBC0F', 14)}
      {/* tick marks */}
      {[-210, -150, -90, -30, 30].map((a,i) => {
        const x1 = cx + (r+10) * Math.cos(rad(a)), y1 = cy + (r+10) * Math.sin(rad(a));
        const x2 = cx + (r+18) * Math.cos(rad(a)), y2 = cy + (r+18) * Math.sin(rad(a));
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round"/>;
      })}
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#101828" strokeWidth="4" strokeLinecap="round"/>
      <circle cx={cx} cy={cy} r="8" fill="#101828"/>
      <circle cx={cx} cy={cy} r="3" fill="#fff"/>
      {/* labels */}
      <text x={cx} y={cy + 30} textAnchor="middle" fontSize="32" fontWeight="800" fill="#101828" style={{letterSpacing: '-0.03em'}}>{hours}h {mins}m</text>
      <text x={cx} y={cy + 52} textAnchor="middle" fontSize="12" fill="#6A7282">to go</text>
    </svg>
  );
}

window.CourseDashA = CourseDashA;
