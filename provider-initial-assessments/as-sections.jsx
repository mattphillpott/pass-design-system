/* Add Student page — section components. Presentational; state lives in the page.
   Exposes section pieces + PickerTable + StudentPreview + StudentSummary to window. */
const { useState: useStateS } = React;

/* ---------------- data ---------------- */
const GROUPS = [
  { id: 'g-new', title: 'A new group here', desc: '', students: 6 },
  { id: 'g-chloe', title: "Chloe’s group", desc: '', students: 0 },
  { id: 'g-cohort', title: 'Cohort 2022/2023', desc: 'Autumn intake', students: 1 },
  { id: 'g-1', title: 'Group 1', desc: '', students: 1 },
  { id: 'g-2', title: 'Group 2', desc: '', students: 1 },
  { id: 'g-teach', title: 'Teacher Owned Group', desc: '', students: 0 },
  { id: 'g-test', title: 'Test', desc: '', students: 0 },
];
const TEACHERS = [
  { id: 't-chloe', first: 'Chloe', last: 'Provider', email: 'chloe@pass.tech', students: 5 },
  { id: 't-matt', first: 'Matthew', last: 'Teacher', email: 'm.teacher@pass.tech', students: 36 },
  { id: 't-mattn', first: 'Matthew', last: 'Teacher New', email: 'm.new@pass.tech', students: 0 },
  { id: 't-phil', first: 'Matthew', last: 'Phillpott', email: 'm.phillpott@pass.tech', students: 0 },
  { id: 't-ryan', first: 'Ryan', last: 'Hague', email: 'r.hague@pass.tech', students: 11 },
];
const COURSE_LIB = [
  { id: 'c-fsm1', name: 'Functional Skills Maths', level: 'Level 1' },
  { id: 'c-fse1', name: 'Functional Skills English', level: 'Level 1' },
  { id: 'c-esol', name: 'ESOL Skills for Life', level: 'Entry 3' },
];
window.AS_DATA = { GROUPS, TEACHERS, COURSE_LIB };

/* ---------------- shared bits ---------------- */
function SectionCard({ icon, iconTone, title, tag, count, desc, id, children }) {
  return (
    <section className="as-sec" id={id}>
      <div className="as-sec-h">
        <div className={'as-sec-ico' + (iconTone ? ' ' + iconTone : '')}><Ico name={icon} size={22} /></div>
        <div className="as-sec-htext">
          <div className="as-sec-title">{title}{tag && <span className="as-tag-new">{tag}</span>}{count != null && <span className="as-count">{count}</span>}</div>
          {desc && <p className="as-sec-desc">{desc}</p>}
        </div>
      </div>
      <div className="as-sec-body">{children}</div>
    </section>
  );
}

function OptCard({ on, onClick, radio, icon, title, desc }) {
  return (
    <div className={'opt' + (on ? ' is-on' : '')} onClick={onClick} style={{ alignItems: 'flex-start' }}>
      {radio
        ? <div className="radio" />
        : <div className="kbox">{on && <Ico name="Check" size={13} />}</div>}
      {icon && <div className="oico"><Ico name={icon} size={20} /></div>}
      <div>
        <div className="otitle">{title}</div>
        <div className="odesc">{desc}</div>
      </div>
    </div>
  );
}

/* ---------------- 1 · Student details ---------------- */
function StudentDetails({ s, set, showErrors }) {
  const emailErr = showErrors && s.accountType === 'email' && !/.+@.+\..+/.test(s.email || '');
  const userErr = showErrors && s.accountType === 'username' && !(s.username || '').trim();
  const nameErr = (k) => showErrors && !((s[k] || '').trim());
  return (
    <SectionCard icon="User" title="Student details"
      desc={<>You can only enrol students on the <b>Free</b> version of courses from this page. To request a Premium upgrade, create the account first, then choose ‘Request Upgrade’ on the student. <span className="ok">Attaching a student who already has an account? Contact your account manager.</span></>}>
      <div className="as-optgrid">
        <OptCard radio on={s.accountType === 'email'} onClick={() => set({ accountType: 'email' })}
          title="Email based account" desc="Create a standard user with an email address." />
        <OptCard radio on={s.accountType === 'username'} onClick={() => set({ accountType: 'username' })}
          title="Username based account" desc="No emails sent. Managers reset passwords manually on request." />
      </div>

      {s.accountType === 'email' ? (
        <div className={'field' + (emailErr ? ' err' : '')}>
          <label>Email address <span className="req">*</span></label>
          <div className="inputwrap">
            <input className="input" type="email" placeholder="student@example.com"
              value={s.email || ''} onChange={(e) => set({ email: e.target.value })} />
            {!emailErr && /.+@.+\..+/.test(s.email || '') && <span className="tick"><Ico name="CheckCircle" size={18} /></span>}
          </div>
          {emailErr && <div className="errmsg"><Ico name="ExclamationCircle" size={14} />Enter a valid email address.</div>}
          {!emailErr && /.+@.+\..+/.test(s.email || '') && <div className="okmsg"><Ico name="CheckCircle" size={14} />Looks good — an invite will be sent here.</div>}
        </div>
      ) : (
        <div className={'field' + (userErr ? ' err' : '')}>
          <label>Username <span className="req">*</span></label>
          <input className="input" placeholder="e.g. jordan.blake" value={s.username || ''} onChange={(e) => set({ username: e.target.value })} />
          {userErr && <div className="errmsg"><Ico name="ExclamationCircle" size={14} />Choose a username.</div>}
        </div>
      )}

      <div className="as-2col">
        <div className={'field' + (nameErr('firstName') ? ' err' : '')}>
          <label>First name <span className="req">*</span></label>
          <input className="input" placeholder="First name" value={s.firstName || ''} onChange={(e) => set({ firstName: e.target.value })} />
          {nameErr('firstName') && <div className="errmsg"><Ico name="ExclamationCircle" size={14} />Required.</div>}
        </div>
        <div className={'field' + (nameErr('lastName') ? ' err' : '')}>
          <label>Last name <span className="req">*</span></label>
          <input className="input" placeholder="Last name" value={s.lastName || ''} onChange={(e) => set({ lastName: e.target.value })} />
          {nameErr('lastName') && <div className="errmsg"><Ico name="ExclamationCircle" size={14} />Required.</div>}
        </div>
      </div>

      <div className="as-sublabel" style={{ marginTop: 8 }}>Password</div>
      <div className="as-optgrid" style={{ marginBottom: s.pwMode === 'set' ? 16 : 0 }}>
        <OptCard radio on={s.pwMode === 'self'} onClick={() => set({ pwMode: 'self' })} icon="Envelope"
          title="Let the student set their own password" desc="They’re emailed a link to set it. The link expires in 24 hours." />
        <OptCard radio on={s.pwMode === 'set'} onClick={() => set({ pwMode: 'set' })} icon="Key"
          title="Set a password for the student" desc="You set it and let the student know manually." />
      </div>
      {s.pwMode === 'set' && (
        <div className="as-2col">
          <div className="field"><label>Password</label><input className="input" type="password" placeholder="••••••••" value={s.pw || ''} onChange={(e) => set({ pw: e.target.value })} /></div>
          <div className="field"><label>Confirm password</label><input className="input" type="password" placeholder="••••••••" value={s.pw2 || ''} onChange={(e) => set({ pw2: e.target.value })} /></div>
        </div>
      )}
    </SectionCard>
  );
}

/* ---------------- 2 · Courses ---------------- */
function Courses({ s, set }) {
  const add = () => {
    const next = COURSE_LIB.find(c => !s.courses.some(x => x.id === c.id));
    if (next) set({ courses: [...s.courses, next] });
  };
  return (
    <SectionCard icon="Book" title="Courses" count={s.courses.length ? s.courses.length + ' selected' : null}
      desc="You’re no longer required to choose a course when creating a student — they can sit an Initial Assessment and enrol on their recommended course instead.">
      {s.courses.map(c => (
        <div className="as-crow" key={c.id}>
          <div className="ci"><Ico name="Book" size={20} /></div>
          <div className="ct"><div className="n">{c.name}</div><div className="m">{c.level} · Free version</div></div>
          <button className="cx" aria-label="Remove" onClick={() => set({ courses: s.courses.filter(x => x.id !== c.id) })}><Ico name="Close" size={18} /></button>
        </div>
      ))}
      {s.courses.length < COURSE_LIB.length &&
        <button className={'as-addbtn' + (s.courses.length ? ' mt' : '')} onClick={add}><Ico name="Plus" size={17} />Add course</button>}
    </SectionCard>
  );
}

/* ---------------- Force IA rows ---------------- */
function ForceRows({ s, set }) {
  const add = () => set({ forceRules: [...s.forceRules, { id: window.IA.uid(), subject: undefined, level: undefined }] });
  const patch = (id, p) => set({ forceRules: s.forceRules.map(x => x.id === id ? { ...x, ...p } : x) });
  const remove = (id) => set({ forceRules: s.forceRules.filter(x => x.id !== id) });
  if (!s.forceRules.length) {
    return <button className="as-addbtn" onClick={add}><Ico name="Plus" size={17} />Add additional initial assessment</button>;
  }
  return (
    <>
      <div className="ia-rules">
        {s.forceRules.map((row, i) => (
          <div key={row.id}>
            <div className="ia-row">
              <div>
                <div className="ia-flabel">Subject <span className="req">*</span></div>
                <IaSelect value={row.subject} placeholder="Select subject" clearable options={window.IA.SUBJECTS} onChange={(v) => patch(row.id, { subject: v })} />
              </div>
              <div>
                <div className="ia-flabel">Level group <span className="optn">(optional)</span></div>
                <IaSelect value={row.level} emptyLabel="All levels" clearable options={window.IA.LEVELS} onChange={(v) => patch(row.id, { level: v })} />
              </div>
              <button className="ia-del" aria-label="Remove" onClick={() => remove(row.id)}><Ico name="Close" size={20} /></button>
            </div>
            {i < s.forceRules.length - 1 && <hr className="ia-rowsep" />}
          </div>
        ))}
      </div>
      <button className="as-addbtn mt" onClick={add}><Ico name="Plus" size={17} />Add another</button>
    </>
  );
}

/* ---------------- Show IA body (pattern A/B/C + preview) ----------------
   SHOW model: providers choose which initial assessments students see.
   Organisation inheritance is ALL-OR-NONE: while locked, the student follows the org
   default (read-only). Turning on "Customise for this student" makes the section fully
   independent — only what's shown here applies, the org default no longer counts. */
function OrgReadout({ orgStatus }) {
  return (
    <div className="ia-orglist">
      {orgStatus.map(c => (
        <div className="ia-orgrow" key={c.id}>
          <div className="oi"><Ico name={c.hidden ? 'EyeSlash' : 'GraduationCap'} size={18} /></div>
          <div className="ot"><div className="n">{c.subject} · {c.level}</div></div>
          {c.forced
            ? <span className="ia-state forced"><Ico name="Lock" size={13} />Always shown</span>
            : <span className={'ia-state ' + (c.hidden ? 'hid' : 'vis')}><Ico name={c.hidden ? 'EyeSlash' : 'Eye'} size={13} />{c.hidden ? 'Hidden' : 'Shown'}</span>}
        </div>
      ))}
    </div>
  );
}

function HideIABody({ s, set, pattern, forcedList, orgShownSet, customise, onCustomise, provenance, firstName, showPreview, setPrevMode }) {
  const who = (firstName || '').trim() || 'this student';
  const orgStatus = window.IA.shownSetToStatus(orgShownSet, forcedList);
  const custStatus = pattern === 'rows'
    ? window.IA.computeShownStatus(s.showRules, forcedList)
    : window.IA.shownSetToStatus(s.showShown, forcedList);
  const effStatus = customise ? custStatus : orgStatus;

  const editor = pattern === 'rows'
    ? <ShowRowsBody rules={s.showRules} forcedList={forcedList} mode="show"
        onAdd={() => set({ showRules: [...s.showRules, { id: window.IA.uid(), subject: undefined, level: undefined }] })}
        onPatch={(id, p) => set({ showRules: s.showRules.map(x => x.id === id ? { ...x, ...p } : x) })}
        onRemove={(id) => set({ showRules: s.showRules.filter(x => x.id !== id) })} />
    : pattern === 'toggle'
      ? <ToggleListBody hidden={s.showShown} forcedList={forcedList}
          onToggle={(id) => set({ showShown: toggleSet(s.showShown, id) })}
          onToggleMany={(ids, on) => set({ showShown: manySet(s.showShown, ids, on) })} />
      : <MatrixBody hidden={s.showShown} forcedList={forcedList}
          onToggle={(id) => set({ showShown: toggleSet(s.showShown, id) })} />;

  return (
    <>
      {provenance === 'banner' && (customise
        ? <div className="ia-custombanner">
            <Ico name="ExclamationCircle" size={18} />
            <div><b>Customised for {who}.</b> Your organisation default no longer applies here — <b>only</b> the assessments shown below will be visible to {who}. Turn this off to go back to following the organisation default.</div>
          </div>
        : <div className="ia-inhbanner">
            <Ico name="Building" size={18} />
            <div><b>Following your organisation default.</b> {who} will see exactly what your organisation shows to everyone. Turn on <b>Customise</b> to set visibility for {who} only.</div>
          </div>)}

      <div className={'ia-customrow' + (customise ? ' is-on' : '')}>
        <div className="cl"><Ico name={customise ? 'User' : 'Building'} size={18} /></div>
        <div className="ct">
          <div className="n">Customise for {who}</div>
          <div className="m">{customise ? 'This student’s visibility is set independently of your organisation default.' : 'Override the organisation default for this student only (all settings, not just some).'}</div>
        </div>
        <button className="ia-sw" data-on={customise ? 1 : 0} onClick={onCustomise} aria-label="Customise for this student"><i /></button>
      </div>

      {customise ? editor : <OrgReadout orgStatus={orgStatus} />}

      <div className="ia-inhfoot">
        <a className="ia-managelink"><Ico name="Building" size={15} />Manage organisation default<Ico name="ArrowRightLong" size={15} /></a>
      </div>

      {showPreview && <StudentPreview status={effStatus} mode={s.prevMode} setMode={setPrevMode} />}
    </>
  );
}
function toggleSet(set, id) { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); return n; }
function manySet(set, ids, on) { const n = new Set(set); ids.forEach(i => on ? n.add(i) : n.delete(i)); return n; }

/* ---------------- Knowledge assessments ---------------- */
const KSUBJECTS = [
  { k: 'Maths', d: 'Force a Knowledge Assessment on Maths courses of any level.' },
  { k: 'English', d: 'Force a Knowledge Assessment on English courses of any level.' },
  { k: 'Digital Skills', d: 'Force a Knowledge Assessment on Digital Skills courses of any level.' },
];
function Knowledge({ s, set }) {
  const toggle = (k) => set({ knowledge: toggleSet(s.knowledge, k) });
  return (
    <SectionCard icon="ChartBar" iconTone="blue" title="Force Knowledge Assessments" tag="New"
      count={s.knowledge.size ? s.knowledge.size + ' selected' : null}
      desc="Force a student to sit a Knowledge Assessment before completing any topics after enrolling. They must complete one or more when enrolling on any course within that subject.">
      <div className="as-note"><Ico name="InfoCircle" size={16} /><div>If you force an Initial Assessment and a Knowledge Assessment, the <b>Initial Assessment must be done first</b>.</div></div>
      <div className="as-optgrid wide">
        {KSUBJECTS.map(o => (
          <OptCard key={o.k} on={s.knowledge.has(o.k)} onClick={() => toggle(o.k)} title={o.k} desc={o.d} />
        ))}
      </div>
    </SectionCard>
  );
}

/* ---------------- Picker table (groups / teachers) ---------------- */
function PickerTable({ columns, rows, selected, onToggle, onToggleAll, variant, searchKey, entity }) {
  const [filters, setFilters] = useStateS({});
  const [sort, setSort] = useStateS({ key: columns[0].key, dir: 1 });
  const [q, setQ] = useStateS('');

  let view = rows.filter(r => columns.every(c => {
    const f = (filters[c.key] || '').trim().toLowerCase();
    return !f || String(r[c.key] ?? '').toLowerCase().includes(f);
  }));
  if (variant === 'simple' && q.trim()) {
    const qq = q.trim().toLowerCase();
    view = view.filter(r => String(r[searchKey] ?? '').toLowerCase().includes(qq));
  }
  view = [...view].sort((a, b) => {
    const av = a[sort.key], bv = b[sort.key];
    const cmp = typeof av === 'number' ? av - bv : String(av).localeCompare(String(bv));
    return cmp * sort.dir;
  });
  const allSel = view.length > 0 && view.every(r => selected.has(r.id));
  const toggleSort = (k) => setSort(s => s.key === k ? { key: k, dir: -s.dir } : { key: k, dir: 1 });

  if (variant === 'chips') {
    return (
      <div className="pchips">
        {rows.map(r => {
          const on = selected.has(r.id);
          const label = entity === 'teacher' ? r.first + ' ' + r.last : r.title;
          return (
            <div key={r.id} className={'pchip' + (on ? ' on' : '')} onClick={() => onToggle(r.id)}>
              <span className="pc-cb">{on && <Ico name="Check" size={12} />}</span>
              {label}<span className="pc-n">{r.students}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="ptbl">
      <div className="ptbl-tools">
        {variant === 'simple' && (
          <div className="ptbl-search"><Ico name="Search" size={16} /><input placeholder={'Search ' + entity + 's…'} value={q} onChange={(e) => setQ(e.target.value)} /></div>
        )}
        <span className="sel-n">{selected.size} selected</span>
        <span className="spring" />
        <Btn variant="secondary" size="sm" onClick={() => onToggleAll(view.map(r => r.id), !allSel)}>{allSel ? 'Clear all' : 'Select all'}</Btn>
      </div>
      <div className="ptbl-scroll">
        <table className="ptbl-t">
          <thead>
            <tr>
              <th style={{ width: 1 }}><div className="ptbl-cb" onClick={() => onToggleAll(view.map(r => r.id), !allSel)} style={allSel ? { background: 'var(--green)', borderColor: 'var(--green)' } : undefined}>{allSel && <Ico name="Check" size={13} style={{ color: '#fff' }} />}</div></th>
              {columns.map(c => (
                <th key={c.key} className={c.type === 'num' ? 'num' : ''}>
                  <div className="thc">{c.label}
                    <span className="srt" onClick={() => toggleSort(c.key)}><Ico name={sort.key === c.key ? (sort.dir === 1 ? 'AngleUp' : 'AngleDown') : 'ArrowUpDown'} size={sort.key === c.key ? 13 : 14} /></span>
                    {variant === 'full' && <span className="men"><Ico name="EllipsisV" size={14} /></span>}
                  </div>
                </th>
              ))}
              <th className="act">Action</th>
            </tr>
            {variant === 'full' && (
              <tr className="filt">
                <td />
                {columns.map(c => (
                  <td key={c.key}><input placeholder="Filter…" value={filters[c.key] || ''} onChange={(e) => setFilters(f => ({ ...f, [c.key]: e.target.value }))} /></td>
                ))}
                <td className="act"><span className="men" style={{ color: 'var(--mute)', display: 'inline-flex' }}><Ico name="Funnel" size={14} /></span></td>
              </tr>
            )}
          </thead>
          <tbody>
            {view.map(r => {
              const on = selected.has(r.id);
              return (
                <tr key={r.id} className={on ? 'is-sel' : ''}>
                  <td><div className={'ptbl-cb' + (on ? ' on' : '')} onClick={() => onToggle(r.id)}>{on && <Ico name="Check" size={13} />}</div></td>
                  {columns.map((c, i) => (
                    <td key={c.key} className={(i === 0 ? 'name ' : '') + (c.type === 'num' ? 'students' : '')}>{r[c.key] === '' || r[c.key] == null ? <span style={{ color: 'var(--mute)' }}>—</span> : r[c.key]}</td>
                  ))}
                  <td className="act">
                    <span className={'ptbl-selbtn ' + (on ? 'on' : 'pick')} onClick={() => onToggle(r.id)}>
                      {on ? <><Ico name="Check" size={14} />Selected</> : <><Ico name="Plus" size={14} />Select</>}
                    </span>
                  </td>
                </tr>
              );
            })}
            {view.length === 0 && <tr><td colSpan={columns.length + 2} style={{ textAlign: 'center', color: 'var(--mute)', padding: '26px' }}>No matches</td></tr>}
          </tbody>
        </table>
      </div>
      <div className="ptbl-foot"><span>Rows: {view.length}</span><span>{selected.size} selected</span></div>
    </div>
  );
}

/* ---------------- Student-side preview (embedded) ---------------- */
function StudentPreview({ status, mode, setMode }) {
  const visible = status.filter(r => !r.hidden);
  const hiddenRows = status.filter(r => r.hidden);
  return (
    <div className="as-prev">
      <div className="as-prev-h"><Ico name="GraduationCap" size={16} />What the student sees on their portal
        <span className="tog">
          <button className={mode === 'absent' ? 'on' : ''} onClick={() => setMode('absent')}>Absent</button>
          <button className={mode === 'locked' ? 'on' : ''} onClick={() => setMode('locked')}>Locked</button>
        </span>
      </div>
      <div className="as-prev-grid">
        {visible.map(c => (
          <div className="as-pv" key={c.id}>
            <div className="pvi"><Ico name="FileLines" size={16} /></div>
            <div className="pvt"><div className="n">{c.subject} · {c.level}</div><div className="s">{c.forced ? 'Required · No time limit' : 'No time limit'}</div></div>
          </div>
        ))}
        {mode === 'locked' && hiddenRows.map(c => (
          <div className="as-pv gone" key={c.id}>
            <div className="pvi"><Ico name="Lock" size={16} /></div>
            <div className="pvt"><div className="n">{c.subject} · {c.level}</div><div className="s">Not available</div></div>
          </div>
        ))}
      </div>
      {visible.length === 0 && mode === 'absent' && <div className="as-prev-empty">Every assessment is hidden — the student sees an empty list.</div>}
      <div className="as-prev-empty" style={{ marginTop: 10 }}>
        {mode === 'absent'
          ? 'Hidden assessments are removed entirely — the student never knows they existed.'
          : 'Hidden assessments stay listed but greyed out and can’t be started.'}
      </div>
    </div>
  );
}

/* ---------------- Live summary (layout 3) ---------------- */
function StudentSummary({ s, forcedList, status }) {
  const name = [s.firstName, s.lastName].filter(Boolean).join(' ') || 'New student';
  const idLine = s.accountType === 'email' ? (s.email || 'No email yet') : (s.username ? '@' + s.username : 'No username yet');
  const hiddenRows = status.filter(r => r.hidden);
  const rows = [
    { icon: s.accountType === 'email' ? 'AtSign' : 'User', k: 'Account', v: s.accountType === 'email' ? 'Email based' : 'Username based' },
    { icon: 'Key', k: 'Password', v: s.pwMode === 'set' ? 'Set by provider' : s.pwMode === 'self' ? 'Student sets their own' : <span className="dim">Not chosen</span> },
    { icon: 'Book', k: 'Courses', v: s.courses.length ? s.courses.map(c => c.name).join(', ') : <span className="dim">None — recommended after IA</span> },
  ];
  return (
    <div className="as-sum">
      <div className="as-sum-h">
        <div className="eye">Creating</div>
        <h3>{name}</h3>
        <div className="who">{idLine}</div>
      </div>
      <div className="as-sum-b">
        {rows.map((r, i) => (
          <div className="as-sr" key={i}>
            <div className="si"><Ico name={r.icon} size={16} /></div>
            <div style={{ minWidth: 0 }}><div className="sk">{r.k}</div><div className="sv">{r.v}</div></div>
          </div>
        ))}
        <div className="as-sr">
          <div className="si"><Ico name="Clipboard" size={16} /></div>
          <div style={{ minWidth: 0 }}>
            <div className="sk">Initial assessments</div>
            <div className="sv">
              {forcedList.length ? forcedList.length + ' forced' : 'None forced'}{hiddenRows.length ? ' · ' + hiddenRows.length + ' hidden' : ''}
              <div className="as-chipline">
                {forcedList.map((f, i) => <span key={'f' + i} className="as-minichip force">{f.subject}{f.level ? ' · ' + f.level : ' · all'}</span>)}
                {hiddenRows.map(h => <span key={h.id} className="as-minichip hide">{h.subject} · {h.level}</span>)}
                {!forcedList.length && !hiddenRows.length && <span className="as-minichip">All visible, none forced</span>}
              </div>
            </div>
          </div>
        </div>
        <div className="as-sr">
          <div className="si"><Ico name="ChartBar" size={16} /></div>
          <div style={{ minWidth: 0 }}><div className="sk">Knowledge assessments</div><div className="sv">{s.knowledge.size ? [...s.knowledge].join(', ') : <span className="dim">None forced</span>}</div></div>
        </div>
        <div className="as-sr">
          <div className="si"><Ico name="Users" size={16} /></div>
          <div style={{ minWidth: 0 }}><div className="sk">Groups & teachers</div><div className="sv">{s.groups.size} group{s.groups.size === 1 ? '' : 's'} · {s.teachers.size} teacher{s.teachers.size === 1 ? '' : 's'}</div></div>
        </div>
      </div>
      <div className="as-sum-foot"><Btn variant="primary" block icon="UserPlus">Create student</Btn></div>
    </div>
  );
}

Object.assign(window, { SectionCard, OptCard, StudentDetails, Courses, ForceRows, HideIABody, Knowledge, PickerTable, StudentPreview, StudentSummary, toggleSet, manySet });
