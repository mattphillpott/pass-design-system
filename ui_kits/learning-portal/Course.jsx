// Course detail — topics list with progress & AI tutor panel

function PassCourse({ courseId, onOpenMock }) {
  const [activeTopic, setActiveTopic] = React.useState(0);

  const topics = [
    { n: 1,  title: 'Using number operations',        mins: 45, state: 'done'   },
    { n: 2,  title: 'Working with fractions',         mins: 50, state: 'done'   },
    { n: 3,  title: 'Percentages & proportion',       mins: 55, state: 'active' },
    { n: 4,  title: 'Ratios in real contexts',        mins: 40, state: 'todo'   },
    { n: 5,  title: 'Measures, shape & space',        mins: 60, state: 'todo'   },
    { n: 6,  title: 'Interpreting statistics',        mins: 45, state: 'todo'   },
    { n: 7,  title: 'Probability basics',             mins: 35, state: 'todo'   },
    { n: 8,  title: 'Mock exam — Paper 1',            mins: 90, state: 'locked', isMock: true },
  ];

  return (
    <div style={cs.page}>
      {/* Hero */}
      <div style={cs.hero}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 12, fontWeight: 600, color: '#0FBC0F', letterSpacing: '0.04em', textTransform: 'uppercase'}}>Functional Skills · Maths · Level 2</div>
          <h2 style={{margin: '8px 0 4px', fontSize: 30, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em'}}>Percentages, ratio & proportion</h2>
          <p style={{margin: 0, color: '#4A5565', fontSize: 14, maxWidth: 540}}>Apply percentages, ratios and proportion to real-life contexts. Includes 8 topic tests, 24 practice problems, and a paper-1 mock against Pearson standards.</p>
          <div style={{display: 'flex', gap: 14, marginTop: 16, flexWrap: 'wrap'}}>
            <span className="pass-badge pass-badge--brand"><PassIcon name="book-open" size={12} color="#0FBC0F"/>8 topics</span>
            <span className="pass-badge"><PassIcon name="clock" size={12} color="#4A5565"/>~6 hours</span>
            <span className="pass-badge pass-badge--success"><PassIcon name="check-circle" size={12} color="#047857"/>AI-marked</span>
          </div>
        </div>
        <div style={cs.progressRing}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#E5E7EB" strokeWidth="10"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="#0FBC0F" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={`${2*Math.PI*52*0.67} ${2*Math.PI*52}`}
              transform="rotate(-90 60 60)"/>
          </svg>
          <div style={cs.ringLabel}>
            <div style={{fontSize: 28, fontWeight: 700, color: '#101828'}}>67%</div>
            <div style={{fontSize: 11, color: '#6A7282'}}>complete</div>
          </div>
        </div>
      </div>

      <div style={cs.split}>
        {/* Topic list */}
        <div>
          <h3 style={cs.sectionTitle}>Topics</h3>
          <div style={{display: 'grid', gap: 8}}>
            {topics.map((t, i) => (
              <button key={t.n} onClick={() => {
                if (t.isMock) { onOpenMock && onOpenMock(); } else { setActiveTopic(i); }
              }} style={{
                ...cs.topicRow,
                ...(i === activeTopic && !t.isMock ? cs.topicRowActive : {}),
                ...(t.state === 'locked' ? cs.topicRowLocked : {})
              }}>
                <div style={{...cs.topicBadge,
                  background: t.state === 'done' ? '#ECFDF5' : t.state === 'active' ? '#F0FEEF' : t.isMock ? '#FFF7ED' : '#F3F4F6',
                  color:      t.state === 'done' ? '#047857' : t.state === 'active' ? '#0FBC0F' : t.isMock ? '#D97706' : '#6A7282'
                }}>
                  {t.state === 'done' ? <PassIcon name="check" size={16}/> : t.isMock ? <PassIcon name="file-text" size={16}/> : t.n}
                </div>
                <div style={{flex: 1, textAlign: 'left'}}>
                  <div style={{fontSize: 14, fontWeight: 500, color: '#101828'}}>{t.title}</div>
                  <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>{t.mins} min · {t.isMock ? 'Mock exam · 40 marks' : t.state === 'done' ? 'Completed · 92%' : t.state === 'active' ? 'In progress' : 'Not started'}</div>
                </div>
                {t.isMock ? (
                  <span className="pass-badge pass-badge--warning">Mock</span>
                ) : t.state === 'active' ? (
                  <PassIcon name="play" size={16} color="#0FBC0F"/>
                ) : (
                  <PassIcon name="chevron-right" size={16} color="#98A2B3"/>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* AI tutor panel */}
        <aside style={cs.tutor}>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14}}>
            <div style={{width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #0FBC0F, #105712)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <PassIcon name="sparkles" size={16} color="#fff"/>
            </div>
            <div>
              <div style={{fontSize: 14, fontWeight: 600, color: '#101828'}}>Ask the AI tutor</div>
              <div style={{fontSize: 11, color: '#6A7282'}}>Topic-aware · cites Pearson spec</div>
            </div>
          </div>
          <div style={cs.bubble}>
            <div style={{fontSize: 13, color: '#344054', lineHeight: 1.55}}>I'm stuck on Q4. How do I work out a percentage increase when the starting value is given as a fraction?</div>
          </div>
          <div style={{...cs.bubble, background: '#F0FEEF', border: '1px solid #B8FBB7'}}>
            <div style={{fontSize: 13, color: '#105712', lineHeight: 1.55}}>Good question. Start by converting the fraction to a decimal — e.g. 3/4 becomes 0.75. Multiply by the percentage increase (say, 20% → 1.2) to get the new value. Want me to walk through Q4 step-by-step?</div>
            <div style={{display: 'flex', gap: 6, marginTop: 10}}>
              <button style={cs.chip}>Walk me through</button>
              <button style={cs.chip}>Try a similar question</button>
            </div>
          </div>
          <div style={cs.composer}>
            <input placeholder="Ask anything about this topic…" style={cs.composerInput}/>
            <button style={cs.composerSend}><PassIcon name="arrow-right" size={16} color="#fff"/></button>
          </div>
        </aside>
      </div>
    </div>
  );
}

const cs = {
  page: { padding: 32, display: 'flex', flexDirection: 'column', gap: 24 },
  hero: { display: 'flex', alignItems: 'center', gap: 24, background: 'linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 100%)', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28 },
  progressRing: { position: 'relative', width: 120, height: 120, flexShrink: 0 },
  ringLabel: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
  split: { display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 24 },
  sectionTitle: { margin: '0 0 12px', fontSize: 17, fontWeight: 600, color: '#101828' },
  topicRow: { display: 'flex', alignItems: 'center', gap: 14, width: '100%', padding: 14, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  topicRowActive: { borderColor: '#0FBC0F', boxShadow: '0 0 0 3px rgba(22,163,74,0.12)' },
  topicRowLocked: { opacity: 0.95 },
  topicBadge: { width: 32, height: 32, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 },
  tutor: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 20, display: 'flex', flexDirection: 'column' },
  bubble: { background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 12, padding: 14, marginBottom: 10 },
  chip: { border: '1px solid #B8FBB7', background: '#fff', color: '#0FBC0F', fontSize: 12, fontWeight: 500, padding: '6px 12px', borderRadius: 9999, cursor: 'pointer', fontFamily: 'inherit' },
  composer: { display: 'flex', gap: 8, marginTop: 'auto', paddingTop: 10 },
  composerInput: { flex: 1, height: 42, border: '1px solid #E5E7EB', borderRadius: 10, padding: '0 14px', fontSize: 13, fontFamily: 'inherit', outline: 'none' },
  composerSend: { width: 42, height: 42, borderRadius: 10, background: '#0FBC0F', border: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
};

window.PassCourse = PassCourse;
