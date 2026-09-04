/* Hide Initial Assessments — student learning-portal reflection.
   Shows the SAME catalog rendered two ways: hidden = absent, or hidden = locked.
   Exposes StudentPortal to window. */

function RequiredBadge() {
  return <span className="badge badge--student" style={{ marginLeft: 10, verticalAlign: 'middle' }}><Ico name="ExclamationCircle" size={13} />Required</span>;
}

function StudentPortal({ mode, rules, forcedOn }) {
  const rows = window.IA.computeShownStatus(rules, forcedOn);
  const visible = rows.filter(r => !r.hidden);
  const hiddenRows = rows.filter(r => r.hidden);

  const AvailItem = (c) => (
    <div className="sp-item avail" key={c.id}>
      <div className="sico"><Ico name="GraduationCap" size={24} /></div>
      <div className="si">
        <div className="t">{c.subject} · {c.level}{c.forced && <RequiredBadge />}</div>
        <div className="d">{c.desc}</div>
        <div className="meta"><Ico name="Clock" size={14} />{c.mins} min · Multiple choice · No time pressure</div>
      </div>
      <div className="sp-start"><Btn variant="primary" iconRight="ArrowRightLong">Start</Btn></div>
    </div>
  );

  const LockedItem = (c) => (
    <div className="sp-item locked" key={c.id}>
      <div className="sico"><Ico name="Lock" size={22} /></div>
      <div className="si">
        <div className="t">{c.subject} · {c.level}</div>
        <div className="d">Not part of your learning plan</div>
      </div>
      <span className="sp-lockbadge"><Ico name="Lock" size={14} />Not available</span>
    </div>
  );

  return (
    <div className="pass" style={{ background: 'var(--bg-soft)', padding: 26 }}>
      <div className="sp-wrap card" style={{ borderRadius: 16, overflow: 'hidden' }}>
        <div className="sp-top">
          <div className="sp-eyebrow"><Ico name="GraduationCap" size={15} />Your learning portal</div>
          <h2>Initial assessments</h2>
          <p>Complete these short check-ins so we can pitch your course at the right level. Give each one your best go — there’s nothing to revise for.</p>
        </div>
        <div className="sp-list">
          {visible.map(AvailItem)}
          {mode === 'locked' && hiddenRows.map(LockedItem)}
          {visible.length === 0 && mode === 'absent' && (
            <div className="sp-empty"><Ico name="CheckCircle" size={28} /><div style={{ fontWeight: 700, color: 'var(--ink)' }}>You’re all set</div><div>There are no initial assessments to complete right now.</div></div>
          )}
        </div>
        <div className="sp-note">
          <Ico name="InfoCircle" size={17} />
          {mode === 'absent'
            ? <div><b>Hidden = absent.</b> Hidden assessments are removed entirely — the student sees only what’s available to them and never knows the others existed.{forcedOn && ' A required assessment is flagged so they know it must be done.'}</div>
            : <div><b>Hidden = locked.</b> Hidden assessments still appear but are greyed out and can’t be started, with a “not available” note.{forcedOn && ' Required assessments stay open and are flagged.'}</div>}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StudentPortal });
