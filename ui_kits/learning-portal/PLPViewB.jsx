// PLP Variation B — Bold redesign.
// "Do this next" hero rail + condensed status sections + AI strengths/weaknesses.

function PLPViewB({ topics = PLP_TOPICS, locked = false }) {
  const [view, setView] = React.useState('cards');
  const { groups, counts } = plpBuckets(topics);
  const next = topics.filter(t => t.status === 'inprogress').slice(0, 3);

  return (
    <div style={{display: 'flex', height: '100%', background: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', color: '#101828'}}>
      <CourseSidebar density="cosy"/>
      <main style={{flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative'}}>

        {/* Sticky compact header */}
        <div style={{padding: '14px 28px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Personal Learning Plan</div>
            <div style={{fontSize: 14, fontWeight: 600, color: '#101828'}}>Functional Skills English L2 · {counts.total} topics</div>
          </div>
          <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
            <span style={{fontSize: 12, color: '#6A7282'}}>{counts.done}/{counts.total} nailed</span>
            <div style={{width: 140, height: 8, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden'}}>
              <div style={{width: ((counts.done/counts.total)*100).toFixed(0)+'%', height: '100%', background: '#0FBC0F', borderRadius: 999}}/>
            </div>
            <button className="pass-btn pass-btn--secondary pass-btn--sm">Export ↓</button>
          </div>
        </div>

        <div style={{padding: 28, display: 'flex', flexDirection: 'column', gap: 20}}>

          {/* Hero — Do this next rail */}
          <section>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12}}>
              <div>
                <h2 style={{margin: 0, fontSize: 22, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em'}}>Do this next.</h2>
                <p style={{margin: '4px 0 0', fontSize: 13, color: '#4A5565'}}>Three high-impact topics — knock these out and your Chance of Passing jumps ~12 points.</p>
              </div>
              <button className="pass-btn pass-btn--ghost pass-btn--sm">Why these? ⓘ</button>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14}}>
              {next.map((t, i) => <NextCardB key={t.n} t={t} order={i+1}/>)}
            </div>
          </section>

          {/* Strength radar */}
          <section style={{display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14}}>
            <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20}}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12}}>
                <div>
                  <div style={{fontSize: 11, fontWeight: 700, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Where you stand</div>
                  <h3 style={{margin: '4px 0 0', fontSize: 16, fontWeight: 700, color: '#101828'}}>Strength by topic area</h3>
                </div>
                <div style={{display: 'flex', gap: 8, fontSize: 11, color: '#6A7282'}}>
                  <span><span style={{display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#0FBC0F', marginRight: 4}}/>You</span>
                  <span><span style={{display: 'inline-block', width: 8, height: 8, borderRadius: 2, background: '#D1D5DB', marginRight: 4}}/>Pass mark</span>
                </div>
              </div>
              <StrengthBars/>
            </div>
            <div style={{background: 'linear-gradient(135deg, #105712 0%, #0F8610 100%)', color: '#fff', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden'}}>
              <DotField/>
              <div style={{position: 'relative'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
                  <div style={{width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11}}>AI</div>
                  <div style={{fontSize: 13, fontWeight: 700}}>Pass coach insight</div>
                </div>
                <p style={{margin: 0, fontSize: 14, lineHeight: 1.55, color: '#DBFEDA'}}>You're <strong style={{color: '#fff'}}>strongest in Grammar</strong> — 95% on the topic test. Your weakest is <strong style={{color: '#fff'}}>Detail and Navigating Sources</strong> at 40%. A 28-min focused session would close the gap.</p>
                <div style={{marginTop: 14, display: 'flex', gap: 8}}>
                  <button style={{height: 36, padding: '0 14px', background: '#fff', color: '#0F8610', border: 0, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'}}>Build me a session</button>
                  <button style={{height: 36, padding: '0 14px', background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit'}}>Ask why</button>
                </div>
              </div>
            </div>
          </section>

          {/* Toolbar + groups */}
          <section>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12}}>
              <div>
                <h3 style={{margin: 0, fontSize: 18, fontWeight: 700, color: '#101828'}}>All topics</h3>
                <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>Grouped by status. Tap a topic to start.</div>
              </div>
              <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                <input placeholder="Search topics…" className="pass-input" style={{height: 36, fontSize: 12, padding: '0 12px', width: 200}}/>
                <select className="pass-input" style={{height: 36, fontSize: 12, padding: '0 10px'}}>
                  <option>All areas</option><option>Reading</option><option>Writing</option>
                </select>
                <div style={{display: 'inline-flex', background: '#F3F4F6', padding: 3, borderRadius: 10}}>
                  <ToggleBtn active={view==='cards'} onClick={()=>setView('cards')}>◫ Cards</ToggleBtn>
                  <ToggleBtn active={view==='table'} onClick={()=>setView('table')}>≡ Table</ToggleBtn>
                </div>
              </div>
            </div>

            {view === 'cards' ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: 18}}>
                {groups.map(g => (
                  <div key={g.key} style={{background: '#fff', borderRadius: 14, border: '1px solid #E5E7EB', overflow: 'hidden'}}>
                    <div style={{padding: '14px 18px', background: g.bg, borderBottom: '1px solid ' + g.border, display: 'flex', alignItems: 'center', gap: 10}}>
                      <span style={{width: 10, height: 10, borderRadius: '50%', background: g.dot}}/>
                      <h4 style={{margin: 0, fontSize: 14, fontWeight: 700, color: g.fg, textTransform: 'uppercase', letterSpacing: '0.04em'}}>{g.label}</h4>
                      <span style={{fontSize: 12, color: g.fg, fontWeight: 600, marginLeft: 'auto'}}>{g.topics.length} topics</span>
                    </div>
                    <div style={{padding: 14, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10}}>
                      {g.topics.map(t => <TopicRowB key={t.n} t={t}/>)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PLPTable topics={topics}/>
            )}
          </section>
        </div>

        {locked && <PLPLockB total={counts.total} unlocked={3}/>}
      </main>
    </div>
  );
}

function NextCardB({ t, order }) {
  return (
    <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20, position: 'relative', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: 0, left: 0, height: 4, width: '100%', background: 'linear-gradient(90deg, #18CF18 0%, #0FBC0F 100%)'}}/>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <div style={{width: 36, height: 36, borderRadius: 10, background: '#F0FEEF', color: '#0F8610', fontWeight: 800, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{order}</div>
          <div>
            <div style={{fontSize: 11, fontWeight: 700, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{t.area} · {t.n}</div>
            <h4 style={{margin: '2px 0 0', fontSize: 15, fontWeight: 700, color: '#101828', lineHeight: 1.3}}>{t.title}</h4>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14}}>
        <div style={{flex: 1}}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#6A7282', marginBottom: 4}}>
            <span>Last score</span><span style={{fontWeight: 600, color: '#9B1C1C'}}>{t.practice ?? 0}% · pass {t.pass}%</span>
          </div>
          <div style={{height: 6, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: t.pass + '%', top: -2, width: 1, height: 10, background: '#101828'}}/>
            <div style={{height: '100%', width: (t.practice ?? 0) + '%', background: '#D97706', borderRadius: 999}}/>
          </div>
        </div>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 12, color: '#6A7282', display: 'inline-flex', alignItems: 'center', gap: 4}}>⏱ ~{t.est} min</div>
        <button className="pass-btn pass-btn--primary pass-btn--sm">Start now →</button>
      </div>
    </div>
  );
}

function TopicRowB({ t }) {
  const m = STATUS_META[t.status];
  return (
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: '#F9FAFB', borderRadius: 10, border: '1px solid #F3F4F6'}}>
      <div style={{width: 28, height: 28, borderRadius: '50%', background: m.bg, color: m.fg, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{t.n.split('.')[0]}.{t.n.split('.')[1]}</div>
      <div style={{flex: 1, minWidth: 0}}>
        <div style={{fontSize: 13, fontWeight: 600, color: '#101828', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>{t.title}</div>
        <div style={{fontSize: 11, color: '#6A7282', marginTop: 2, display: 'flex', alignItems: 'center', gap: 8}}>
          <span>{t.area}</span>
          {t.test != null && <span>· Test {t.test}%</span>}
          {t.practice != null && <span>· Practice {t.practice}%</span>}
          {t.date && <span>· {t.date.split(' ').slice(1,4).join(' ')}</span>}
        </div>
      </div>
      <button className="pass-btn pass-btn--ghost pass-btn--sm" style={{color: '#0F8610'}}>{t.status === 'done' ? 'Review' : t.status === 'inprogress' ? 'Continue' : 'Start'} →</button>
    </div>
  );
}

function StrengthBars() {
  const data = [
    { area: 'Reading',   you: 58, pass: 60 },
    { area: 'Writing',   you: 75, pass: 60 },
    { area: 'Listening', you: 0,  pass: 60 },
    { area: 'SLC',       you: 42, pass: 60 },
  ];
  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
      {data.map(d => (
        <div key={d.area}>
          <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6}}>
            <span style={{fontWeight: 600, color: '#101828'}}>{d.area}</span>
            <span style={{color: d.you >= d.pass ? '#0F8610' : d.you === 0 ? '#98A2B3' : '#9A3412', fontWeight: 700, fontVariantNumeric: 'tabular-nums'}}>
              {d.you === 0 ? 'Not started' : d.you + '%'}
            </span>
          </div>
          <div style={{height: 10, background: '#F3F4F6', borderRadius: 999, overflow: 'hidden', position: 'relative'}}>
            <div style={{position: 'absolute', left: d.pass + '%', top: -2, width: 2, height: 14, background: '#101828', zIndex: 2}}/>
            <div style={{height: '100%', width: d.you + '%', background: d.you >= d.pass ? '#0FBC0F' : '#D97706', borderRadius: 999, transition: 'width .3s'}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

window.PLPViewB = PLPViewB;
