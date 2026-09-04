/* View Student — Hidden Initial Assessments (read-only). 3 source-display directions.
   Model: granular per subject+level. A student rule overrides only that item; everything
   else inherits the organisation default. Exposes VSDirection to window. */
const { useState: useStateV } = React;

const STUDENT = { first: 'Lewis', name: 'Lewis Wilding', initials: 'LW', email: 'lewisfs@gmail.com', org: 'Demo Organisation' };

/* per scenario: each item has a global default + optional student setting ('hidden'|'visible'|undefined=inherit) */
function scenarioData(scenario) {
  const base = [
    { id: 'en-fs', subject: 'English', level: 'Functional Skills' },
    { id: 'en-esol', subject: 'English', level: 'ESOL' },
    { id: 'ma-fs', subject: 'Maths', level: 'Functional Skills' },
    { id: 'ma-ds', subject: 'Maths', level: 'Digital Skills' },
  ];
  const map = {
    mixed: { 'en-fs': ['visible', 'hidden'], 'en-esol': ['hidden', 'visible'], 'ma-fs': ['visible', undefined], 'ma-ds': ['hidden', undefined] },
    global: { 'en-fs': ['visible', undefined], 'en-esol': ['hidden', undefined], 'ma-fs': ['visible', undefined], 'ma-ds': ['hidden', undefined] },
    student: { 'en-fs': ['visible', 'hidden'], 'en-esol': ['visible', undefined], 'ma-fs': ['visible', 'hidden'], 'ma-ds': ['visible', undefined] },
    none: { 'en-fs': ['visible', undefined], 'en-esol': ['visible', undefined], 'ma-fs': ['visible', undefined], 'ma-ds': ['visible', undefined] },
  }[scenario] || {};
  return base.map(b => ({ ...b, global: map[b.id][0], student: map[b.id][1] }));
}
function resolve(items) {
  return items.map(it => {
    const effective = it.student !== undefined ? it.student : it.global;
    const changed = it.student !== undefined && it.student !== it.global;
    const source = it.student !== undefined ? 'student' : 'org';
    return { ...it, effective, changed, source, hidden: effective === 'hidden' };
  });
}
function counts(rows) {
  const hidden = rows.filter(r => r.hidden);
  return {
    total: rows.length, visible: rows.length - hidden.length, hidden: hidden.length,
    hiddenOrg: hidden.filter(r => r.source === 'org').length,
    hiddenStudent: hidden.filter(r => r.source === 'student').length,
    overrides: rows.filter(r => r.changed).length,
  };
}
function rowNote(r) {
  if (r.changed) return r.student === 'hidden' ? 'Hidden for this student' : 'Shown for this student';
  return r.global === 'hidden' ? 'Hidden for everyone in your organisation' : 'Visible — organisation default';
}
function globalWas(r) { return r.global === 'hidden' ? 'Organisation: Hidden' : 'Organisation: Visible'; }

/* ---------------- shared shell ---------------- */
function SourceBadge({ source }) {
  return source === 'student'
    ? <span className="vs-src student"><Ico name="User" size={13} />Student override</span>
    : <span className="vs-src org"><Ico name="Building" size={13} />Organisation default</span>;
}

function StatePill({ hidden }) {
  return <span className={'ia-state ' + (hidden ? 'hid' : 'vis')}><Ico name={hidden ? 'EyeSlash' : 'Eye'} size={13} />{hidden ? 'Hidden' : 'Visible'}</span>;
}

function VSHero() {
  return (
    <>
      <div className="vs-crumbs"><a href="#" onClick={e => e.preventDefault()}>My Students</a><Ico name="AngleRight" size={13} />{STUDENT.name}</div>
      <h1 className="vs-h1">View Student</h1>
      <div className="vs-hero">
        <div className="vs-hero-ava">{STUDENT.initials}</div>
        <div className="vs-hero-id">
          <h2>{STUDENT.name}</h2>
          <div className="vs-hero-meta">
            <span><Ico name="User" size={14} />Student</span>
            <span><Ico name="Building" size={14} />{STUDENT.org}</span>
            <span><Ico name="Envelope" size={14} />{STUDENT.email}</span>
          </div>
        </div>
        <span className="vs-active"><Ico name="CheckCircle" size={14} />Active</span>
      </div>
    </>
  );
}

function VSSummary({ c }) {
  const chips = [];
  if (c.hiddenOrg) chips.push(<span key="o" className="vs-provchip org"><Ico name="Building" size={13} />{c.hiddenOrg + ' by organisation'}</span>);
  if (c.overrides) chips.push(<span key="s" className="vs-provchip student"><Ico name="User" size={13} />{c.overrides + ' student override' + (c.overrides === 1 ? '' : 's')}</span>);
  return (
    <div className="vs-sum">
      <div className="big">{c.visible}<span style={{ fontSize: 13, color: 'var(--mute)', fontWeight: 700 }}>/{c.total}</span></div>
      <div className="st">
        <div className="l">{STUDENT.first} sees {c.visible} of {c.total} initial assessments</div>
        <div className="s">{c.hidden ? c.hidden + ' hidden' + (c.hiddenStudent ? ' · ' + c.hiddenStudent + ' set for this student' : '') : 'Nothing is hidden for this student'}</div>
      </div>
      {chips.length > 0 && <div className="vs-provchips">{chips}</div>}
    </div>
  );
}

function VSPreview({ rows, mode, setMode }) {
  const visible = rows.filter(r => !r.hidden);
  const hidden = rows.filter(r => r.hidden);
  return (
    <div className="as-prev" style={{ marginTop: 20 }}>
      <div className="as-prev-h"><Ico name="GraduationCap" size={16} />What {STUDENT.first} sees on their learning portal
        <span className="tog">
          <button className={mode === 'absent' ? 'on' : ''} onClick={() => setMode('absent')}>Absent</button>
          <button className={mode === 'locked' ? 'on' : ''} onClick={() => setMode('locked')}>Locked</button>
        </span>
      </div>
      <div className="as-prev-grid">
        {visible.map(c => (
          <div className="as-pv" key={c.id}><div className="pvi"><Ico name="FileLines" size={16} /></div><div className="pvt"><div className="n">{c.subject} · {c.level}</div><div className="s">No time limit</div></div></div>
        ))}
        {mode === 'locked' && hidden.map(c => (
          <div className="as-pv gone" key={c.id}><div className="pvi"><Ico name="Lock" size={16} /></div><div className="pvt"><div className="n">{c.subject} · {c.level}</div><div className="s">Not available</div></div></div>
        ))}
      </div>
      {visible.length === 0 && mode === 'absent' && <div className="as-prev-empty">Every assessment is hidden — {STUDENT.first} sees an empty list.</div>}
    </div>
  );
}

function SectionShell({ children, footNote }) {
  return (
    <div className="vs-sec">
      <div className="vs-sec-head">
        <div className="ht">
          <div className="vs-sec-title"><span className="si"><Ico name="EyeSlash" size={19} /></span>Hidden Initial Assessments</div>
          <p className="vs-sec-sub">Which initial assessments are hidden from {STUDENT.first} on their learning portal — and whether each was set for this student or inherited from your organisation.</p>
        </div>
        <div className="vs-editbtn"><Btn variant="secondary" size="sm" icon="Pen">Edit for this student</Btn></div>
      </div>
      <hr className="vs-divider" />
      <div className="vs-sec-body">{children}</div>
      <div className="vs-foot">
        <span className="fm">{footNote}</span>
        <span style={{ flex: 1 }} />
        <a className="vs-managelink"><Ico name="Building" size={15} />Manage organisation default<Ico name="ArrowRightLong" size={15} /></a>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="vs-empty">
      <div className="ei"><Ico name="Eye" size={23} /></div>
      <h4>No initial assessments are hidden</h4>
      <p>Your <span className="org">organisation default</span> shows every initial assessment to students, and nothing has been changed for {STUDENT.first}. You can hide some just for this student.</p>
      <Btn variant="secondary" size="sm" icon="Pen">Hide some for this student</Btn>
    </div>
  );
}

/* ---------------- Direction A — source badges ---------------- */
function DirA({ rows, showGlobal }) {
  return (
    <div className="vs-list">
      {rows.map(r => (
        <div key={r.id} className={'vs-row ' + (r.hidden ? 'hidden' : 'visible') + (r.changed ? ' override' : '')}>
          <div className="rico"><Ico name={r.hidden ? 'EyeSlash' : 'GraduationCap'} size={20} /></div>
          <div className="rt">
            <div className="n">{r.subject} · {r.level}</div>
            <div className="m">{rowNote(r)}{r.changed && showGlobal && <span className="vs-was">{globalWas(r)}</span>}</div>
          </div>
          <div className="rr"><StatePill hidden={r.hidden} /><SourceBadge source={r.source} /></div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Direction B — grouped by source ---------------- */
function GroupRow({ r, showGlobal }) {
  return (
    <div className={'vs-row flat ' + (r.hidden ? 'hidden' : 'visible') + (r.changed ? ' override' : '')}>
      <div className="rico"><Ico name={r.hidden ? 'EyeSlash' : 'GraduationCap'} size={20} /></div>
      <div className="rt">
        <div className="n">{r.subject} · {r.level}</div>
        <div className="m">{rowNote(r)}{r.changed && showGlobal && <span className="vs-was">{globalWas(r)}</span>}</div>
      </div>
      <div className="rr"><StatePill hidden={r.hidden} /></div>
    </div>
  );
}
function DirB({ rows, showGlobal }) {
  const orgHidden = rows.filter(r => !r.changed && r.hidden);
  const studentSet = rows.filter(r => r.changed);
  return (
    <>
      <div className="vs-group">
        <div className="vs-ghead org"><span className="gi"><Ico name="Building" size={17} /></span><span className="gt">Inherited from your organisation</span><span className="gc">· applies to all students</span></div>
        <div className="vs-gbody">
          {orgHidden.length ? orgHidden.map(r => <GroupRow key={r.id} r={r} showGlobal={showGlobal} />) : <div className="vs-gnone">Your organisation isn’t hiding any initial assessments by default.</div>}
        </div>
      </div>
      <div className="vs-group">
        <div className="vs-ghead student"><span className="gi"><Ico name="User" size={17} /></span><span className="gt">Set for {STUDENT.first}</span><span className="gc">· overrides the organisation default</span></div>
        <div className="vs-gbody">
          {studentSet.length ? studentSet.map(r => <GroupRow key={r.id} r={r} showGlobal={showGlobal} />) : <div className="vs-gnone">Nothing has been changed for this student — they follow the organisation default.</div>}
        </div>
      </div>
    </>
  );
}

/* ---------------- Direction C — provenance table ---------------- */
function DirC({ rows, showGlobal }) {
  return (
    <div className="vs-tbl-wrap">
      <table className="vs-tbl">
        <thead><tr><th>Initial assessment</th><th>Visibility</th><th>Set at</th><th>Organisation default</th></tr></thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id}>
              <td><span className="asmt"><span className={'ti ' + (r.hidden ? 'hidden' : 'visible')}><Ico name={r.hidden ? 'EyeSlash' : 'GraduationCap'} size={17} /></span>{r.subject} · {r.level}</span></td>
              <td><StatePill hidden={r.hidden} /></td>
              <td><SourceBadge source={r.source} /></td>
              <td className="orgcol">
                {r.changed
                  ? (showGlobal ? <span className="was">{r.global === 'hidden' ? 'Hidden' : 'Visible'}</span> : <span className="same">—</span>)
                  : <span className="same">{r.global === 'hidden' ? 'Hidden' : 'Visible'} (inherited)</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------------- one direction (hero + section) ---------------- */
function VSDirection({ variant, cfg }) {
  const [mode, setMode] = useStateV('absent');
  const rows = resolve(scenarioData(cfg.scenario));
  const c = counts(rows);
  const empty = cfg.scenario === 'none';
  const footNote = empty ? 'Set for all students at once?' : 'Changes here apply to ' + STUDENT.first + ' only.';

  const body = variant === 'A' ? <DirA rows={rows} showGlobal={cfg.showGlobal} />
    : variant === 'B' ? <DirB rows={rows} showGlobal={cfg.showGlobal} />
      : <DirC rows={rows} showGlobal={cfg.showGlobal} />;

  return (
    <div className="pass vs-page">
      <VSHero />
      <SectionShell footNote={footNote}>
        {empty ? <EmptyState /> : <><VSSummary c={c} />{body}{cfg.preview && <VSPreview rows={rows} mode={mode} setMode={setMode} />}</>}
      </SectionShell>
    </div>
  );
}

window.VSDirection = VSDirection;
Object.assign(window, { VSSummary, VSPreview, VSHero, SourceBadge, StatePill, VS_STUDENT: STUDENT });
