// PLP Variation A — Safe redesign.
// Grouped-by-status cards (Needs work / Not started / Got it) with a Table toggle.
// Same data as the original spreadsheet, but readable.

function PLPViewA({ topics = PLP_TOPICS, locked = false }) {
  const [view, setView] = React.useState('cards'); // 'cards' | 'table'
  const { groups, counts } = plpBuckets(topics);

  return (
    <div style={{display: 'flex', height: '100%', background: '#F9FAFB', fontFamily: 'Inter, system-ui, sans-serif', color: '#101828'}}>
      <CourseSidebar density="cosy"/>
      <main style={{flex: 1, minWidth: 0, overflowY: 'auto', position: 'relative'}}>

        {/* Header */}
        <header style={{padding: '20px 28px', background: '#fff', borderBottom: '1px solid #E5E7EB'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#6A7282'}}>
            <span>Pass</span><span>›</span><span>English L2</span><span>›</span><span style={{color: '#101828', fontWeight: 600}}>Personal Learning Plan</span>
          </div>
          <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 8}}>
            <div>
              <h1 style={{margin: 0, fontSize: 24, fontWeight: 700, letterSpacing: '-0.01em'}}>Your Personal Learning Plan</h1>
              <p style={{margin: '4px 0 0', fontSize: 14, color: '#4A5565', maxWidth: 720}}>Built from your Subject Knowledge Assessment. We'll keep this updated as you go — focus on <strong>Needs work</strong> first to lift your Chance of Passing.</p>
            </div>
            <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
              <button className="pass-btn pass-btn--secondary pass-btn--sm">Reset filters</button>
              <button className="pass-btn pass-btn--secondary pass-btn--sm">Export ↓</button>
            </div>
          </div>
        </header>

        {/* Summary strip */}
        <section style={{padding: '20px 28px 0', display: 'grid', gridTemplateColumns: '1.6fr repeat(3, 1fr)', gap: 14}}>
          <div style={{background: 'linear-gradient(135deg, #F0FEEF 0%, #FFFFFF 100%)', border: '1px solid #B8FBB7', borderRadius: 14, padding: 18, display: 'flex', alignItems: 'center', gap: 16}}>
            <RingProgress pct={Math.round((counts.done/counts.total)*100)} size={64} stroke={8}/>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Plan progress</div>
              <div style={{fontSize: 18, fontWeight: 700, color: '#101828', marginTop: 2}}>{counts.done} of {counts.total} topics nailed</div>
              <div style={{fontSize: 12, color: '#4A5565', marginTop: 2}}>{counts.inprogress} need more work · {counts.incomplete} not yet started</div>
            </div>
          </div>
          {[
            { label: 'Needs work',  v: counts.inprogress, sub: '15-25 min each', tint: '#FFF7ED', border: '#FED7AA', fg: '#9A3412' },
            { label: 'Not started', v: counts.incomplete, sub: 'next up after',  tint: '#F9FAFB', border: '#E5E7EB', fg: '#344054' },
            { label: 'Got it',      v: counts.done,       sub: 'pass mark cleared', tint: '#F0FEEF', border: '#B8FBB7', fg: '#0F8610' },
          ].map(s => (
            <div key={s.label} style={{background: s.tint, border: '1px solid ' + s.border, borderRadius: 14, padding: 18}}>
              <div style={{fontSize: 11, fontWeight: 700, color: s.fg, letterSpacing: '0.06em', textTransform: 'uppercase'}}>{s.label}</div>
              <div style={{fontSize: 28, fontWeight: 800, color: '#101828', letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1}}>{s.v}</div>
              <div style={{fontSize: 12, color: '#6A7282', marginTop: 6}}>{s.sub}</div>
            </div>
          ))}
        </section>

        {/* Toolbar */}
        <section style={{padding: '20px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16}}>
          <div style={{display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap'}}>
            <span style={{fontSize: 12, fontWeight: 600, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em', marginRight: 4}}>Filter</span>
            {['All areas', 'Reading', 'Writing', 'Listening', 'SLC'].map((f, i) => (
              <button key={f} style={{height: 32, padding: '0 12px', borderRadius: 999, border: '1px solid ' + (i===0 ? '#0F8610' : '#E5E7EB'), background: i===0 ? '#F0FEEF' : '#fff', fontSize: 12, fontWeight: 600, color: i===0 ? '#0F8610' : '#344054', cursor: 'pointer', fontFamily: 'inherit'}}>{f}</button>
            ))}
            <span style={{width: 1, height: 20, background: '#E5E7EB', marginInline: 8}}/>
            <input placeholder="Search topics…" className="pass-input" style={{height: 32, fontSize: 12, padding: '0 10px', width: 200}}/>
          </div>
          <div style={{display: 'inline-flex', background: '#F3F4F6', padding: 3, borderRadius: 10}}>
            <ToggleBtn active={view==='cards'} onClick={() => setView('cards')}>◫ Cards</ToggleBtn>
            <ToggleBtn active={view==='table'} onClick={() => setView('table')}>≡ Table</ToggleBtn>
          </div>
        </section>

        {/* Body */}
        <section style={{padding: '20px 28px 32px'}}>
          {view === 'cards' ? (
            groups.map(g => (
              <div key={g.key} style={{marginBottom: 24}}>
                <div style={{display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12}}>
                  <span style={{width: 8, height: 8, borderRadius: '50%', background: g.dot}}/>
                  <h3 style={{margin: 0, fontSize: 15, fontWeight: 700, color: '#101828'}}>{g.label}</h3>
                  <span style={{fontSize: 12, color: '#6A7282', background: '#F3F4F6', padding: '2px 8px', borderRadius: 999, fontWeight: 600}}>{g.topics.length}</span>
                  <div style={{flex: 1, height: 1, background: '#F3F4F6'}}/>
                </div>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
                  {g.topics.map(t => <TopicCardA key={t.n} t={t}/>)}
                </div>
              </div>
            ))
          ) : (
            <PLPTable topics={topics}/>
          )}
        </section>

        {locked && <PLPLockA total={counts.total} unlocked={3}/>}
      </main>
    </div>
  );
}

function ToggleBtn({ active, onClick, children }) {
  return <button onClick={onClick} style={{height: 28, padding: '0 12px', border: 0, borderRadius: 7, fontSize: 12, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', background: active ? '#fff' : 'transparent', color: active ? '#101828' : '#4A5565', boxShadow: active ? '0 1px 2px rgba(0,0,0,0.06)' : 'none'}}>{children}</button>;
}

function TopicCardA({ t }) {
  const m = STATUS_META[t.status];
  return (
    <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 16, display: 'flex', flexDirection: 'column', gap: 12}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12}}>
        <div style={{minWidth: 0, flex: 1}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
            <span style={{fontSize: 11, fontWeight: 700, color: '#6A7282', background: '#F3F4F6', padding: '2px 6px', borderRadius: 4}}>{t.n}</span>
            <span style={{fontSize: 11, color: '#6A7282', fontWeight: 500}}>{t.area}</span>
          </div>
          <h4 style={{margin: '6px 0 0', fontSize: 15, fontWeight: 600, color: '#101828', lineHeight: 1.3}}>{t.title}</h4>
        </div>
        <StatusChip status={t.status}/>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: '10px 12px', background: '#F9FAFB', borderRadius: 8}}>
        <KV label="Topic test"     val={<ScorePill value={t.test} pass={t.pass}/>}/>
        <KV label="Practice qs"    val={<ScorePill value={t.practice} pass={t.pass}/>}/>
        <KV label="Pass mark"      val={<span style={{fontSize: 12, fontWeight: 600, color: '#101828'}}>{t.pass}%</span>}/>
      </div>

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12}}>
        <div style={{fontSize: 12, color: '#6A7282'}}>
          {t.date ? <>Completed {t.date.split(' ').slice(0,4).join(' ')}</> : <>~{t.est} min</>}
        </div>
        <button className={'pass-btn pass-btn--sm ' + (t.status === 'inprogress' ? 'pass-btn--primary' : 'pass-btn--secondary')}>
          {t.status === 'done' ? 'Review' : t.status === 'inprogress' ? 'Continue →' : 'Start'}
        </button>
      </div>
    </div>
  );
}

function KV({ label, val }) {
  return (
    <div>
      <div style={{fontSize: 10, fontWeight: 600, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.04em'}}>{label}</div>
      <div style={{marginTop: 4}}>{val}</div>
    </div>
  );
}

function PLPTable({ topics }) {
  return (
    <div style={{background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, overflow: 'hidden'}}>
      <table style={{width: '100%', borderCollapse: 'collapse', fontSize: 13}}>
        <thead style={{background: '#F9FAFB'}}>
          <tr>
            {['#','Topic','Area','Topic test','Practice qs','Pass mark','Status','Completed',''].map(h => (
              <th key={h} style={{textAlign: 'left', padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#4A5565', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #E5E7EB'}}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {topics.map((t,i) => (
            <tr key={t.n} style={{borderBottom: i === topics.length-1 ? 0 : '1px solid #F3F4F6'}}>
              <td style={{padding: '12px 16px', color: '#6A7282', fontWeight: 600}}>{t.n}</td>
              <td style={{padding: '12px 16px', color: '#101828', fontWeight: 500}}>{t.title}</td>
              <td style={{padding: '12px 16px', color: '#4A5565'}}>{t.area}</td>
              <td style={{padding: '12px 16px'}}><ScorePill value={t.test} pass={t.pass}/></td>
              <td style={{padding: '12px 16px'}}><ScorePill value={t.practice} pass={t.pass}/></td>
              <td style={{padding: '12px 16px', color: '#4A5565'}}>{t.pass}%</td>
              <td style={{padding: '12px 16px'}}><StatusChip status={t.status}/></td>
              <td style={{padding: '12px 16px', color: '#6A7282', fontSize: 12}}>{t.date ? t.date.split(' ').slice(0,4).join(' ') : '—'}</td>
              <td style={{padding: '12px 16px', textAlign: 'right'}}><button className="pass-btn pass-btn--ghost pass-btn--sm" style={{color: '#0F8610'}}>{t.status === 'done' ? 'Review' : 'Open'} →</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RingProgress({ pct = 50, size = 60, stroke = 6 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{flexShrink: 0}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#F3F4F6" strokeWidth={stroke}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#0FBC0F" strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (pct/100)*c} transform={`rotate(-90 ${size/2} ${size/2})`}/>
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="central" fontSize="14" fontWeight="800" fill="#101828">{pct}%</text>
    </svg>
  );
}

window.PLPViewA = PLPViewA;
window.RingProgress = RingProgress;
