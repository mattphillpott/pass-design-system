// Dashboard — tutor view. Stat tiles, active cohort, learner progress, upcoming mocks.

function PassDashboard({ onOpenCourse }) {
  return (
    <div style={dl.page}>
      {/* Welcome strip */}
      <div style={dl.welcome}>
        <div>
          <div style={{fontSize: 13, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.02em', textTransform: 'uppercase', marginBottom: 4}}>Tuesday, 27 Jan</div>
          <h2 style={{margin: 0, fontSize: 26, fontWeight: 700, color: '#101828', letterSpacing: '-0.015em'}}>Welcome back, Sarah</h2>
          <p style={{margin: '6px 0 0', color: '#4A5565', fontSize: 14}}>Your cohort sat their Maths L2 mock on Friday — 23 of 28 have now been AI-marked.</p>
        </div>
        <div style={{display: 'flex', gap: 10}}>
          <button className="pass-btn pass-btn--secondary">Export report</button>
          <button className="pass-btn pass-btn--primary"><PassIcon name="sparkles" size={16} color="#fff"/>Assign diagnostic</button>
        </div>
      </div>

      {/* Stat tiles */}
      <div style={dl.stats}>
        {[
          { label: 'Active learners', value: '142',  delta: '+12', sub: 'this week',    icon: 'users',        tint: '#F0FEEF', fg: '#0FBC0F' },
          { label: 'Pass rate (L2)', value: '87%',  delta: '+4pt', sub: 'vs last cohort', icon: 'trending-up', tint: '#ECFDF5', fg: '#047857' },
          { label: 'Mocks marked',    value: '312',  delta: null,   sub: 'this month',   icon: 'file-text',    tint: '#FFF7ED', fg: '#D97706' },
          { label: 'Avg study time',  value: '4.2h', delta: null,   sub: 'per learner · week', icon: 'clock', tint: '#F3F4F6', fg: '#344054' },
        ].map(s => (
          <div key={s.label} style={dl.statCard}>
            <div style={{...dl.statIcon, background: s.tint, color: s.fg}}>
              <PassIcon name={s.icon} size={18} color={s.fg}/>
            </div>
            <div style={{fontSize: 13, color: '#6A7282', fontWeight: 500}}>{s.label}</div>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4}}>
              <div style={{fontSize: 28, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em'}}>{s.value}</div>
              {s.delta && <div style={{fontSize: 12, color: '#047857', fontWeight: 600}}>{s.delta}</div>}
            </div>
            <div style={{fontSize: 12, color: '#98A2B3', marginTop: 2}}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Two-col main */}
      <div style={dl.split}>
        {/* Active courses */}
        <section>
          <div style={dl.sectionHead}>
            <h3 style={dl.sectionTitle}>Active courses</h3>
            <a href="#" style={dl.linkMore}>View all <PassIcon name="arrow-right" size={14} color="#0FBC0F"/></a>
          </div>
          <div style={{display: 'grid', gap: 12}}>
            {[
              { id: 'm-l2', title: 'Functional Skills · Maths L2', sub: 'Cohort JAN-26 · 28 learners', progress: 67, colour: '#0FBC0F', status: 'In progress', eyebrow: 'MATHS' },
              { id: 'e-l2', title: 'Functional Skills · English L2', sub: 'Cohort JAN-26 · 24 learners', progress: 41, colour: '#0FBC0F', status: 'In progress', eyebrow: 'ENGLISH' },
              { id: 'gcse', title: 'GCSE Maths Resit — Spring', sub: 'Cohort SPR-26 · 18 learners · Mock due 14 Feb', progress: 22, colour: '#D97706', status: 'Mock due', eyebrow: 'GCSE' },
            ].map(c => (
              <button key={c.id} onClick={() => onOpenCourse && onOpenCourse(c.id)} style={dl.courseRow}>
                <div style={{flex: 1, textAlign: 'left'}}>
                  <div style={{fontSize: 11, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.04em', marginBottom: 4}}>{c.eyebrow}</div>
                  <div style={{fontSize: 15, fontWeight: 600, color: '#101828', marginBottom: 2}}>{c.title}</div>
                  <div style={{fontSize: 12, color: '#6A7282'}}>{c.sub}</div>
                  <div style={dl.progBar}><div style={{...dl.progFill, width: `${c.progress}%`, background: c.colour}}/></div>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, minWidth: 80}}>
                  <div style={{fontSize: 20, fontWeight: 700, color: '#101828'}}>{c.progress}%</div>
                  <span className={`pass-badge ${c.status === 'Mock due' ? 'pass-badge--warning' : 'pass-badge--brand'}`}>{c.status}</span>
                </div>
                <PassIcon name="chevron-right" size={16} color="#98A2B3"/>
              </button>
            ))}
          </div>
        </section>

        {/* Right rail */}
        <aside style={{display: 'grid', gap: 16, alignContent: 'start'}}>
          {/* Upcoming */}
          <div className="pass-card" style={{padding: 20}}>
            <div style={dl.sectionHead}>
              <h3 style={{...dl.sectionTitle, fontSize: 15}}>Upcoming</h3>
            </div>
            {[
              { when: 'Tomorrow · 10:00', what: 'Maths L2 mock — Paper 1', sub: '28 learners', tag: 'MOCK' },
              { when: 'Thu · 14:30',      what: '1-to-1 with Aisha Khan',   sub: 'Diagnostic review', tag: '1:1' },
              { when: 'Fri · all day',    what: 'English L2 revision week', sub: 'Reading + writing', tag: 'COHORT' },
            ].map((u, i) => (
              <div key={i} style={dl.upcomingItem}>
                <div style={dl.upDate}>{u.when}</div>
                <div style={{fontSize: 14, fontWeight: 500, color: '#101828', marginTop: 2}}>{u.what}</div>
                <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>{u.sub}</div>
              </div>
            ))}
          </div>

          {/* Powered by Pass callout */}
          <div style={dl.callout}>
            <div style={{fontSize: 11, color: '#81F580', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase'}}>Powered by Pass</div>
            <div style={{fontSize: 16, color: '#fff', fontWeight: 600, margin: '8px 0 4px', lineHeight: 1.35}}>Your AI marker has saved 42 hours this month.</div>
            <div style={{fontSize: 13, color: '#B8FBB7', marginBottom: 14}}>Across 312 mock papers returned to examiner standard.</div>
            <button style={dl.calloutBtn}>View marking report <PassIcon name="arrow-right" size={14} color="#0FBC0F"/></button>
          </div>
        </aside>
      </div>
    </div>
  );
}

const dl = {
  page: { padding: 32, display: 'flex', flexDirection: 'column', gap: 24 },
  welcome: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' },
  stats: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 },
  statCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 },
  statIcon: { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  split: { display: 'grid', gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)', gap: 24 },
  sectionHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { margin: 0, fontSize: 17, fontWeight: 600, color: '#101828' },
  linkMore: { fontSize: 13, color: '#0FBC0F', fontWeight: 500, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 },
  courseRow: { display: 'flex', alignItems: 'center', gap: 16, width: '100%', padding: 16, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left' },
  progBar: { height: 6, background: '#F3F4F6', borderRadius: 9999, marginTop: 10, overflow: 'hidden' },
  progFill: { height: '100%', borderRadius: 9999 },
  upcomingItem: { padding: '12px 0', borderTop: '1px solid #F3F4F6' },
  upDate: { fontSize: 11, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' },
  callout: { background: 'linear-gradient(135deg, #0FBC0F 0%, #105712 100%)', borderRadius: 12, padding: 20, color: '#fff' },
  calloutBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: '#fff', color: '#0FBC0F', border: 0, borderRadius: 8, padding: '8px 14px', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
};

window.PassDashboard = PassDashboard;
