// Variation B — "Bold" redesign of the Course Dashboard.
// Goal: Duolingo-warm, single hero focus, gamified rails, AI nudge front-and-centre.
// Same modules covered, but reorganised around a "do this now" mental model.

function CourseDashB({ density = 'cosy' }) {
  const cardPad = density === 'compact' ? 18 : 24;
  const gap = density === 'compact' ? 14 : 18;

  return (
    <div style={{display: 'flex', height: '100%', background: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', color: '#101828'}}>
      <CourseSidebar density={density}/>

      <main style={{flex: 1, minWidth: 0, overflowY: 'auto'}}>
        {/* Persistent thin status bar instead of a tall topbar */}
        <div style={{height: 6, background: '#F3F4F6', position: 'relative'}}>
          <div style={{position: 'absolute', inset: 0, width: '27%', background: 'linear-gradient(90deg, #18CF18 0%, #0FBC0F 100%)'}}/>
        </div>
        <div style={{padding: '14px 28px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Functional Skills English L2</div>
              <div style={{fontSize: 14, fontWeight: 600, color: '#101828'}}>27% of course complete · Cohort JAN-26</div>
            </div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <Streak count={12}/>
            <DayBadge label="Exam" days={47}/>
            <button className="pass-btn pass-btn--secondary"><span style={{fontSize: 14}}>📅</span>Schedule mock</button>
          </div>
        </div>

        <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap}}>

          {/* HERO — chance of passing + today's plan */}
          <section style={{display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap, alignItems: 'stretch'}}>

            {/* Today's mission */}
            <div style={{background: 'linear-gradient(135deg, #105712 0%, #0F8610 100%)', borderRadius: 20, padding: cardPad + 4, color: '#fff', position: 'relative', overflow: 'hidden'}}>
              <DotField/>
              <div style={{position: 'relative'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                  <div>
                    <div style={{fontSize: 11, fontWeight: 700, color: '#B8FBB7', letterSpacing: '0.08em', textTransform: 'uppercase'}}>Today's mission · 25 min</div>
                    <h2 style={{margin: '6px 0 0', fontSize: 30, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15, maxWidth: 460}}>Finish Reading 1.2 — Text Type</h2>
                    <p style={{margin: '8px 0 0', color: '#DBFEDA', fontSize: 14, lineHeight: 1.5, maxWidth: 460}}>You're 67% through this topic. Wrap it up and you'll bump your Chance of Passing by ~4 points.</p>
                  </div>
                  <div style={{background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(6px)', borderRadius: 14, padding: '10px 14px', textAlign: 'center', flexShrink: 0}}>
                    <div style={{fontSize: 11, fontWeight: 600, color: '#DBFEDA', textTransform: 'uppercase', letterSpacing: '0.06em'}}>Chance of passing</div>
                    <div style={{fontSize: 38, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginTop: 4}}>62%</div>
                    <div style={{fontSize: 11, color: '#B8FBB7', marginTop: 4}}>↑ 8% this week</div>
                  </div>
                </div>

                <div style={{display: 'flex', gap: 10, marginTop: 24, alignItems: 'center'}}>
                  <button style={{height: 48, padding: '0 22px', background: '#fff', color: '#0F8610', border: 0, borderRadius: 12, fontWeight: 700, fontSize: 15, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'inherit'}}>▶ Resume now</button>
                  <button style={{height: 48, padding: '0 18px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 12, fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit'}}>Pick something else</button>
                  <div style={{marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#DBFEDA'}}>
                    <span style={{display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#42E741'}}/>
                    14 of your cohort are practising right now
                  </div>
                </div>
              </div>
            </div>

            {/* Revision time dial — re-styled */}
            <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 20, padding: cardPad, display: 'flex', flexDirection: 'column'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <div>
                  <div style={{fontSize: 11, fontWeight: 700, color: '#9A3412', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Time until exam-ready</div>
                  <div style={{fontSize: 14, fontWeight: 600, color: '#101828', marginTop: 2}}>You're at Level 0.55 · Target 2.5</div>
                </div>
                <div style={{fontSize: 11, color: '#0F8610', background: '#F0FEEF', padding: '4px 8px', borderRadius: 999, fontWeight: 600}}>On track</div>
              </div>

              <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0'}}>
                <BigCountdown hours={33} mins={48}/>
              </div>

              <div style={{borderTop: '1px solid #F3F4F6', paddingTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, fontSize: 11}}>
                <div><div style={{color: '#6A7282'}}>Daily target</div><div style={{fontWeight: 700, color: '#101828', fontSize: 13}}>25 min</div></div>
                <div><div style={{color: '#6A7282'}}>This week</div><div style={{fontWeight: 700, color: '#0F8610', fontSize: 13}}>2h 10m ✓</div></div>
                <div><div style={{color: '#6A7282'}}>Streak</div><div style={{fontWeight: 700, color: '#101828', fontSize: 13}}>12 days 🔥</div></div>
              </div>
            </div>
          </section>

          {/* Stat strip — flatter, secondary */}
          <section style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap}}>
            {[
              { label: 'Exam-Ready milestones', value: '1', total: '/8',  bar: 12.5,  color: '#0FBC0F' },
              { label: 'Course progress',       value: '27', total: '%',  bar: 27,    color: '#0FBC0F' },
              { label: 'Current level',         value: '0.55', total: '/2.5', bar: 22, color: '#D97706' },
              { label: 'Cohort rank',           value: '11', total: '/28', bar: 60,    color: '#0F8610', sub: 'top 40% of your class' },
            ].map(s => (
              <div key={s.label} style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 14, padding: 16}}>
                <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{s.label}</div>
                <div style={{display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 8}}>
                  <span style={{fontSize: 28, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em', lineHeight: 1}}>{s.value}</span>
                  <span style={{fontSize: 14, fontWeight: 600, color: '#98A2B3'}}>{s.total}</span>
                </div>
                <div style={{height: 4, background: '#F3F4F6', borderRadius: 999, marginTop: 12, overflow: 'hidden'}}>
                  <div style={{height: '100%', width: s.bar + '%', background: s.color, borderRadius: 999}}/>
                </div>
                {s.sub && <div style={{fontSize: 11, color: '#0F8610', fontWeight: 600, marginTop: 8}}>↑ {s.sub}</div>}
              </div>
            ))}
          </section>

          {/* Two-up: Path to ready + AI coach */}
          <section style={{display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap}}>
            <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: cardPad}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16}}>
                <div>
                  <h3 style={{margin: 0, fontSize: 17, fontWeight: 700, color: '#101828'}}>Path to exam-ready</h3>
                  <div style={{fontSize: 13, color: '#6A7282', marginTop: 2}}>Hit all 8 — that's how we know you're ready.</div>
                </div>
                <SegBar steps={8} done={1}/>
              </div>
              <Pathway/>
            </div>

            <div style={{display: 'flex', flexDirection: 'column', gap}}>
              {/* AI nudge */}
              <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: cardPad, position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
                  <div style={{width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #0FBC0F 0%, #0F8610 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14}}>AI</div>
                  <div>
                    <div style={{fontSize: 13, fontWeight: 700, color: '#101828'}}>Pass coach</div>
                    <div style={{fontSize: 11, color: '#6A7282'}}>Updated 2 mins ago</div>
                  </div>
                </div>
                <p style={{margin: 0, fontSize: 14, lineHeight: 1.55, color: '#344054'}}>You scored <strong>8/10</strong> on Fact or Opinion — really nice work. Your weakest area right now is <strong>Persuasive language (1.8)</strong>. Want a 12-min focused drill?</p>
                <div style={{display: 'flex', gap: 8, marginTop: 14}}>
                  <button className="pass-btn pass-btn--primary pass-btn--sm">Yes, drill me</button>
                  <button className="pass-btn pass-btn--ghost pass-btn--sm">Later</button>
                </div>
              </div>

              {/* Achievements */}
              <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: cardPad}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12}}>
                  <h3 style={{margin: 0, fontSize: 15, fontWeight: 700, color: '#101828'}}>Achievements</h3>
                  <span style={{fontSize: 12, color: '#6A7282'}}>4 of 18</span>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8}}>
                  {[
                    { e: '🎯', got: true, label: 'First topic' },
                    { e: '🔥', got: true, label: '7-day streak' },
                    { e: '📚', got: true, label: '5 topics' },
                    { e: '⚡', got: true, label: 'Fast learner' },
                    { e: '🏆', got: false, label: 'First mock' },
                    { e: '🎓', got: false, label: 'L2 ready' },
                  ].map((a,i) => (
                    <div key={i} title={a.label} style={{aspectRatio: '1/1', background: a.got ? '#F0FEEF' : '#F9FAFB', border: '1px solid ' + (a.got ? '#B8FBB7' : '#E5E7EB'), borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, opacity: a.got ? 1 : 0.4}}>{a.e}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Skills rail */}
          <section>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
              <h3 style={{margin: 0, fontSize: 17, fontWeight: 700, color: '#101828'}}>Practise a skill</h3>
              <a href="#" style={{fontSize: 13, color: '#0F8610', fontWeight: 600, textDecoration: 'none'}}>View all 30 topics →</a>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap}}>
              {[
                { title: 'Reading',  pct: 43, accent: '#0FBC0F', icon: '📖', topics: 10, hint: 'Strongest skill — keep going!', best: 'Best score 92%' },
                { title: 'Writing',  pct: 18, accent: '#D97706', icon: '✏️', topics: 10, hint: 'Most growth potential here.',     best: 'Try a 12-min drill' },
                { title: 'Speaking', pct: 16, accent: '#1C64F2', icon: '🎤', topics: 10, hint: 'Group session Wed 10:00.',         best: 'Practise solo first?' },
              ].map(s => (
                <div key={s.title} style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
                  <div style={{padding: cardPad, display: 'flex', alignItems: 'center', gap: 14}}>
                    <div style={{width: 56, height: 56, borderRadius: 14, background: s.accent + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, flexShrink: 0}}>{s.icon}</div>
                    <div style={{flex: 1, minWidth: 0}}>
                      <div style={{fontSize: 11, fontWeight: 600, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{s.topics} topics</div>
                      <h4 style={{margin: '2px 0 0', fontSize: 16, fontWeight: 700, color: '#101828'}}>{s.title}</h4>
                    </div>
                    <div style={{textAlign: 'right'}}>
                      <div style={{fontSize: 22, fontWeight: 800, color: s.accent, letterSpacing: '-0.02em', lineHeight: 1}}>{s.pct}<span style={{fontSize: 12, fontWeight: 600, color: '#98A2B3'}}>%</span></div>
                    </div>
                  </div>
                  <div style={{padding: '0 24px 14px'}}>
                    <div style={{height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden'}}>
                      <div style={{height: '100%', width: s.pct + '%', background: s.accent, borderRadius: 999}}/>
                    </div>
                  </div>
                  <div style={{padding: '0 24px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#6A7282', borderBottom: '1px solid #F3F4F6', paddingBottom: 14}}>
                    <span>{s.hint}</span>
                    <span style={{color: '#0F8610', fontWeight: 600}}>{s.best}</span>
                  </div>
                  <button className="pass-btn pass-btn--primary" style={{margin: 14, justifyContent: 'center'}}>Continue learning →</button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// ─── Local components ───────────────────────────────────────────

function Streak({ count }) {
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 999}}>
      <span style={{fontSize: 14}}>🔥</span>
      <span style={{fontSize: 13, fontWeight: 700, color: '#9A3412'}}>{count}-day streak</span>
    </div>
  );
}

function DayBadge({ label, days }) {
  return (
    <div style={{display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 999}}>
      <span style={{fontSize: 11, fontWeight: 600, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{label}</span>
      <span style={{fontSize: 13, fontWeight: 700, color: '#101828'}}>in {days} days</span>
    </div>
  );
}

function DotField() {
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.18}} aria-hidden>
      <defs>
        <pattern id="dotsB" width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#fff"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotsB)"/>
    </svg>
  );
}

function BigCountdown({ hours, mins }) {
  return (
    <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
      <div>
        <div style={{fontSize: 56, fontWeight: 800, color: '#101828', letterSpacing: '-0.04em', lineHeight: 1, fontVariantNumeric: 'tabular-nums'}}>
          {hours}<span style={{fontSize: 24, fontWeight: 700, color: '#98A2B3', marginLeft: 4}}>h</span> {mins}<span style={{fontSize: 24, fontWeight: 700, color: '#98A2B3', marginLeft: 4}}>m</span>
        </div>
        <div style={{fontSize: 13, color: '#6A7282', marginTop: 6}}>of focused study to go · ~2 hrs/week is enough</div>
      </div>
    </div>
  );
}

function SegBar({ steps, done }) {
  return (
    <div style={{display: 'flex', gap: 4}}>
      {Array.from({length: steps}).map((_, i) => (
        <div key={i} style={{width: 18, height: 8, borderRadius: 3, background: i < done ? '#0FBC0F' : i === done ? '#B8FBB7' : '#F3F4F6'}}/>
      ))}
    </div>
  );
}

function Pathway() {
  const items = [
    { state: 'done',   title: 'Subject Knowledge Assessment', meta: 'Scored 64% · 22 Jan' },
    { state: 'active', title: 'Personal Learning Plan',       meta: 'Almost done — 1 step left' },
    { state: 'todo',   title: 'Speaking, Listening & Communicating', meta: '1.5 hrs · 5 topics' },
    { state: 'todo',   title: 'Reading mock — score 60%+',    meta: 'AI-marked · 60 min' },
    { state: 'todo',   title: 'Writing mock — score 60%+',    meta: 'AI-marked · 90 min' },
    { state: 'todo',   title: 'Reach recommended level',      meta: 'Auto-tracked' },
  ];
  return (
    <div style={{position: 'relative'}}>
      <div style={{position: 'absolute', left: 14, top: 16, bottom: 16, width: 2, background: '#F3F4F6'}}/>
      <div style={{position: 'absolute', left: 14, top: 16, height: 28, width: 2, background: '#0FBC0F'}}/>
      <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
        {items.map((row, i) => (
          <div key={i} style={{display: 'flex', alignItems: 'center', gap: 14, padding: '8px 0 8px 0', position: 'relative'}}>
            <div style={{width: 30, display: 'flex', justifyContent: 'center', flexShrink: 0, zIndex: 1}}>
              <StateDot state={row.state === 'active' ? 'inprogress' : row.state}/>
            </div>
            <div style={{flex: 1, padding: '10px 14px', borderRadius: 10, background: row.state === 'active' ? '#F0FEEF' : 'transparent', border: row.state === 'active' ? '1px solid #B8FBB7' : '1px solid transparent'}}>
              <div style={{fontSize: 14, fontWeight: row.state === 'active' ? 700 : 500, color: row.state === 'done' ? '#6A7282' : '#101828', textDecoration: row.state === 'done' ? 'line-through' : 'none'}}>{row.title}</div>
              <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>{row.meta}</div>
            </div>
            {row.state === 'active' && <button className="pass-btn pass-btn--primary pass-btn--sm">Continue</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

window.CourseDashB = CourseDashB;
