// Mock exam result screen — AI-marked feedback

function PassMockResult({ onBack }) {
  const breakdown = [
    { topic: 'Number operations',      learnerPct: 95, avgPct: 82, marks: '9/10' },
    { topic: 'Fractions & decimals',   learnerPct: 88, avgPct: 74, marks: '7/8' },
    { topic: 'Percentages & ratio',    learnerPct: 72, avgPct: 68, marks: '5/7' },
    { topic: 'Measures & shape',       learnerPct: 60, avgPct: 71, marks: '3/5' },
    { topic: 'Interpreting data',      learnerPct: 90, avgPct: 79, marks: '9/10' },
  ];

  return (
    <div style={mr.page}>
      <button onClick={onBack} style={mr.backBtn}><PassIcon name="chevron-right" size={14} color="#4A5565" style={{transform:'rotate(180deg)'}}/> Back to course</button>

      {/* Result hero */}
      <div style={mr.hero}>
        <div style={{flex: 1}}>
          <div style={{fontSize: 12, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Mock result · Aisha Khan</div>
          <h2 style={{margin: '8px 0 4px', fontSize: 30, fontWeight: 700, color: '#101828', letterSpacing: '-0.02em'}}>Functional Skills Maths L2 — Paper 1</h2>
          <p style={{margin: 0, color: '#4A5565', fontSize: 14}}>AI-marked to Pearson examiner standard · Submitted 24 Jan · Marked in 47 seconds</p>
          <div style={{display: 'flex', gap: 10, marginTop: 18}}>
            <button className="pass-btn pass-btn--primary">Download feedback PDF</button>
            <button className="pass-btn pass-btn--secondary">Share with learner</button>
          </div>
        </div>
        <div style={mr.scoreTile}>
          <div style={{fontSize: 12, color: '#047857', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Pass</div>
          <div style={{fontSize: 56, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em', lineHeight: 1}}>33<span style={{color:'#98A2B3'}}>/40</span></div>
          <div style={{fontSize: 14, color: '#047857', fontWeight: 600, marginTop: 4}}>82% · Grade L2 Pass</div>
        </div>
      </div>

      {/* Summary cards */}
      <div style={mr.summary}>
        {[
          { label: 'Time taken',        value: '1h 12m', sub: 'of 1h 30m' },
          { label: 'Questions answered', value: '18/18', sub: 'All attempted' },
          { label: 'Marks above avg',   value: '+11%',   sub: 'vs cohort' },
          { label: 'Confidence',        value: 'High',   sub: 'AI-assessed' },
        ].map(s => (
          <div key={s.label} style={mr.sumCard}>
            <div style={{fontSize: 12, color: '#6A7282', fontWeight: 500}}>{s.label}</div>
            <div style={{fontSize: 22, fontWeight: 700, color: '#101828', marginTop: 6, letterSpacing: '-0.015em'}}>{s.value}</div>
            <div style={{fontSize: 12, color: '#98A2B3', marginTop: 2}}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={mr.split}>
        {/* Breakdown */}
        <section>
          <h3 style={mr.sectionTitle}>Topic breakdown</h3>
          <div className="pass-card" style={{padding: 0, overflow: 'hidden'}}>
            {breakdown.map((r, i) => (
              <div key={r.topic} style={{...mr.row, borderTop: i === 0 ? 0 : '1px solid #F3F4F6'}}>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 14, fontWeight: 500, color: '#101828'}}>{r.topic}</div>
                  <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>Cohort avg: {r.avgPct}%</div>
                </div>
                <div style={{width: 180, height: 8, background: '#F3F4F6', borderRadius: 9999, overflow: 'hidden', position: 'relative'}}>
                  <div style={{position: 'absolute', top: -1, left: `${r.avgPct}%`, width: 2, height: 10, background: '#98A2B3'}}/>
                  <div style={{height: '100%', width: `${r.learnerPct}%`, background: r.learnerPct >= 70 ? '#0E9F6E' : r.learnerPct >= 50 ? '#D97706' : '#C70036', borderRadius: 9999}}/>
                </div>
                <div style={{width: 70, textAlign: 'right'}}>
                  <div style={{fontSize: 14, fontWeight: 600, color: '#101828'}}>{r.learnerPct}%</div>
                  <div style={{fontSize: 11, color: '#6A7282', fontFamily: 'ui-monospace, monospace'}}>{r.marks}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI feedback */}
        <aside>
          <h3 style={mr.sectionTitle}>AI-generated feedback</h3>
          <div style={mr.feedback}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10}}>
              <PassIcon name="sparkles" size={16} color="#0FBC0F"/>
              <div style={{fontSize: 12, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Examiner-standard</div>
            </div>
            <p style={{margin: '0 0 10px', color: '#344054', fontSize: 14, lineHeight: 1.6}}><strong style={{color:'#101828'}}>Strong overall performance</strong> with clear working shown throughout. Aisha's approach to data interpretation is a standout — Q17 demonstrates full understanding of median vs mean in context.</p>
            <p style={{margin: '0 0 10px', color: '#344054', fontSize: 14, lineHeight: 1.6}}><strong style={{color:'#101828'}}>Focus area:</strong> Measures & shape (60%). Q11 and Q14 both lost method marks — practise setting out volume calculations with clear units at each stage.</p>
            <p style={{margin: 0, color: '#344054', fontSize: 14, lineHeight: 1.6}}><strong style={{color:'#101828'}}>Next step:</strong> The platform has auto-assigned 3 targeted practice questions on compound measures. Expected to take 25 minutes.</p>
            <div style={{marginTop: 16, paddingTop: 16, borderTop: '1px dashed #E5E7EB', display: 'flex', gap: 8}}>
              <button className="pass-btn pass-btn--secondary pass-btn--sm">Accept plan</button>
              <button className="pass-btn pass-btn--ghost pass-btn--sm">Edit plan</button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

const mr = {
  page: { padding: 32, display: 'flex', flexDirection: 'column', gap: 20 },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: 0, color: '#4A5565', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', padding: 0, alignSelf: 'flex-start' },
  hero: { display: 'flex', alignItems: 'center', gap: 24, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, padding: 28 },
  scoreTile: { background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: 16, padding: '20px 28px', minWidth: 220, textAlign: 'center' },
  summary: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 },
  sumCard: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 18 },
  split: { display: 'grid', gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)', gap: 24 },
  sectionTitle: { margin: '0 0 12px', fontSize: 17, fontWeight: 600, color: '#101828' },
  row: { display: 'flex', alignItems: 'center', gap: 16, padding: 16 },
  feedback: { background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12, padding: 20 },
};

window.PassMockResult = PassMockResult;
