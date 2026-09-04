// Premium-locked overlays for PLP A & B.
// Pattern: blurred content underneath, summary card + upsell on top.
// Two flavours so each variation gets a treatment that matches its tone.

// Local DotField — Babel scripts don't share scope across <script> tags,
// and we need this inside PLPViewB too. Defining here means both PLPViewB
// and PLPLockB can use it (PLPViewB.jsx loads after PLPLock.jsx).
function DotField({ dark = false }) {
  return (
    <svg style={{position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: dark ? 0.08 : 0.18}} aria-hidden>
      <defs>
        <pattern id={'dotsLock' + (dark ? 'D' : 'L')} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="1.2" fill="#fff"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={'url(#dotsLock' + (dark ? 'D' : 'L') + ')'}/>
    </svg>
  );
}
window.DotField = DotField;

const PREMIUM_FEATURES = [
  { icon: '📚', title: 'Full topic library',          body: 'All 30+ topics for English L2 — written tutorials, video walk-throughs, drills.' },
  { icon: '📝', title: 'Mock exams (AI-marked)',      body: 'Sit unlimited Reading & Writing mocks. Examiner-grade feedback in under a minute.' },
  { icon: '🎯', title: 'Exam-Ready feature',          body: 'See exactly which 8 milestones you need to be ready on exam day.' },
  { icon: '📈', title: 'Chance of Passing',           body: 'Live prediction of your pass likelihood — updated after every drill.' },
  { icon: '⏱',  title: 'Revision Time Required',     body: 'Personalised forecast of the hours you need before you\'re ready.' },
  { icon: '💬', title: 'AI tutor (24/7)',             body: 'Ask anything — get worked solutions, hints, and explanations on demand.' },
  { icon: '✍️', title: 'AI-marked essay questions',   body: 'Write a Section A response, get a band score and rubric in seconds.' },
  { icon: '🎬', title: 'Written + video solutions',   body: 'Every question has both — read it, watch it, ask the AI to clarify.' },
  { icon: '📊', title: 'Current level tracker',       body: 'Watch your level move from where you are now (0.55) up to exam-ready (2.5).' },
];

// Variation A — Safe: card-style upsell anchored to bottom of viewport, scrolls with content.
function PLPLockA({ total = 30, unlocked = 3 }) {
  const lockedCount = total - unlocked;
  return (
    <>
      {/* Soft fade over the body to imply gating */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(249,250,251,0) 0%, rgba(249,250,251,0) 30%, rgba(249,250,251,0.95) 55%, #F9FAFB 70%)'}}/>

      {/* Anchored upsell card */}
      <div style={{position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', width: 'calc(100% - 56px)', maxWidth: 920, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', overflow: 'hidden'}}>
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1.4fr'}}>
          {/* Left: pitch */}
          <div style={{padding: 28, background: 'linear-gradient(135deg, #F0FEEF 0%, #FFFFFF 100%)', borderRight: '1px solid #E5E7EB'}}>
            <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#0F8610', background: '#fff', padding: '4px 10px', borderRadius: 999, border: '1px solid #B8FBB7'}}>🔒 PREMIUM</span>
            <h2 style={{margin: '14px 0 0', fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#101828', lineHeight: 1.15}}>{lockedCount} more topics, fully unlocked.</h2>
            <p style={{margin: '8px 0 0', fontSize: 14, color: '#4A5565', lineHeight: 1.6}}>You've seen the first {unlocked}. Upgrade to Pass Premium to unlock the full plan, AI marking, mock exams, and your exam-readiness toolkit.</p>

            <div style={{marginTop: 20, padding: 16, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 12}}>
              <div style={{display: 'flex', alignItems: 'baseline', gap: 6}}>
                <span style={{fontSize: 32, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em'}}>£19</span>
                <span style={{fontSize: 13, color: '#6A7282', fontWeight: 600}}>/ month</span>
                <span style={{marginLeft: 'auto', fontSize: 11, fontWeight: 700, color: '#0F8610', background: '#F0FEEF', padding: '3px 8px', borderRadius: 999}}>Cancel anytime</span>
              </div>
              <div style={{fontSize: 12, color: '#6A7282', marginTop: 4}}>Or £179/year — save 22%.</div>

              <button className="pass-btn pass-btn--primary" style={{width: '100%', justifyContent: 'center', marginTop: 14, height: 44, fontSize: 15}}>Upgrade to Premium →</button>
              <button className="pass-btn pass-btn--ghost" style={{width: '100%', justifyContent: 'center', marginTop: 6, height: 36, fontSize: 12, color: '#6A7282'}}>Talk to your tutor</button>
            </div>
          </div>

          {/* Right: feature list */}
          <div style={{padding: 28}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14}}>What you get</div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12}}>
              {PREMIUM_FEATURES.map(f => (
                <div key={f.title} style={{display: 'flex', gap: 10, alignItems: 'flex-start'}}>
                  <div style={{width: 32, height: 32, borderRadius: 8, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0}}>{f.icon}</div>
                  <div style={{minWidth: 0}}>
                    <div style={{fontSize: 13, fontWeight: 700, color: '#101828'}}>{f.title}</div>
                    <div style={{fontSize: 11, color: '#6A7282', lineHeight: 1.4, marginTop: 2}}>{f.body}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Variation B — Bold: full-bleed dark overlay with hero pricing, scrolls with main.
function PLPLockB({ total = 30, unlocked = 3 }) {
  const lockedCount = total - unlocked;
  return (
    <>
      {/* Hard gate after the preview */}
      <div style={{position: 'absolute', inset: 0, pointerEvents: 'none', background: 'linear-gradient(180deg, rgba(249,250,251,0) 0%, rgba(249,250,251,0) 24%, rgba(249,250,251,0.98) 38%, #F9FAFB 50%)'}}/>

      <div style={{position: 'absolute', left: 28, right: 28, top: 360, bottom: 28, borderRadius: 24, background: '#101828', color: '#fff', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'}}>
        <DotField dark/>
        <div style={{position: 'relative', display: 'grid', gridTemplateColumns: '1.1fr 1fr', height: '100%'}}>

          {/* Pitch */}
          <div style={{padding: '36px 36px 28px', display: 'flex', flexDirection: 'column'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: '#0FBC0F', background: 'rgba(15,188,15,0.14)', padding: '5px 10px', borderRadius: 999, border: '1px solid rgba(15,188,15,0.4)'}}>🔒 PREMIUM</span>
              <span style={{fontSize: 12, color: '#98A2B3'}}>Pass Premium · individual learners</span>
            </div>
            <h2 style={{margin: '14px 0 0', fontSize: 36, fontWeight: 800, letterSpacing: '-0.025em', lineHeight: 1.1, maxWidth: 460}}>Pass faster. <span style={{background: 'linear-gradient(90deg, #42E741 0%, #18CF18 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>With a coach.</span></h2>
            <p style={{margin: '12px 0 0', fontSize: 15, color: '#D1D5DB', lineHeight: 1.55, maxWidth: 460}}>You've previewed {unlocked} topics. <strong style={{color: '#fff'}}>{lockedCount} more</strong> are waiting — plus full mocks, an AI tutor, and your live Chance of Passing.</p>

            <div style={{marginTop: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, paddingTop: 24}}>
              <div style={{padding: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize: 11, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600}}>Average pass rate</div>
                <div style={{fontSize: 22, fontWeight: 800, color: '#42E741', letterSpacing: '-0.02em', marginTop: 4}}>87%</div>
                <div style={{fontSize: 11, color: '#98A2B3'}}>for Premium learners</div>
              </div>
              <div style={{padding: 14, background: 'rgba(255,255,255,0.06)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.08)'}}>
                <div style={{fontSize: 11, color: '#98A2B3', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 600}}>Time to pass</div>
                <div style={{fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginTop: 4}}>~33 hrs</div>
                <div style={{fontSize: 11, color: '#98A2B3'}}>typical for your level</div>
              </div>
            </div>

            <div style={{marginTop: 18, padding: 18, background: '#fff', borderRadius: 14, color: '#101828'}}>
              <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
                <div>
                  <div style={{display: 'flex', alignItems: 'baseline', gap: 4}}>
                    <span style={{fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em'}}>£19</span>
                    <span style={{fontSize: 13, color: '#6A7282', fontWeight: 600}}>/ month</span>
                  </div>
                  <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>or £179/year (save 22%)</div>
                </div>
                <div style={{textAlign: 'right'}}>
                  <div style={{fontSize: 11, fontWeight: 700, color: '#0F8610', background: '#F0FEEF', padding: '4px 8px', borderRadius: 999, display: 'inline-block'}}>Cancel anytime</div>
                </div>
              </div>
              <button className="pass-btn pass-btn--primary" style={{width: '100%', justifyContent: 'center', marginTop: 12, height: 46, fontSize: 15}}>Upgrade to Premium →</button>
              <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: '#6A7282'}}>
                <span>💳 Card · Apple Pay · Google Pay</span>
                <a style={{color: '#0F8610', fontWeight: 600, textDecoration: 'none'}}>Compare plans →</a>
              </div>
            </div>
          </div>

          {/* Feature grid */}
          <div style={{padding: '36px 36px', borderLeft: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column'}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#42E741', letterSpacing: '0.06em', textTransform: 'uppercase'}}>What unlocks</div>
            <h3 style={{margin: '6px 0 18px', fontSize: 18, fontWeight: 700, color: '#fff'}}>Everything Pass can do for you</h3>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, flex: 1}}>
              {PREMIUM_FEATURES.map(f => (
                <div key={f.title} style={{padding: 12, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4}}>
                    <span style={{fontSize: 16}}>{f.icon}</span>
                    <span style={{fontSize: 12, fontWeight: 700, color: '#fff'}}>{f.title}</span>
                  </div>
                  <div style={{fontSize: 11, color: '#98A2B3', lineHeight: 1.4}}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

window.PLPLockA = PLPLockA;
window.PLPLockB = PLPLockB;
window.PREMIUM_FEATURES = PREMIUM_FEATURES;
