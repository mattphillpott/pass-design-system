/* Add Student page — top nav, footer, 3 layout directions, canvas + tweaks. */
const { useState: useStateP } = React;

/* ---------------- top nav ---------------- */
function TopNav() {
  const links = ['Dashboard', 'Students', 'Teachers', 'Groups', 'Reports', 'Resources', 'Settings', 'Help'];
  return (
    <div className="asnav">
      <div className="brand"><span className="mk"><Ico name="Check" size={17} /></span><span className="nm">PASS</span></div>
      <div className="org"><span className="p">+</span>TQUK</div>
      <div className="links">{links.map(l => <a key={l} href="#" className={l === 'Students' ? 'active' : ''} onClick={(e) => e.preventDefault()}>{l}</a>)}</div>
      <div className="spacer" />
      <button className="loginbtn">Log into Student Platform</button>
      <button className="ibtn"><Ico name="Plus" size={18} /></button>
      <div className="avatar">CP</div>
    </div>
  );
}

/* ---------------- footer ---------------- */
function FooterBits() {
  return (
    <div className="as-legal">
      <div>Emails are sent from <b>noreply@pass.tech</b>. If you or your students don’t find an email you expected, add this to trusted senders and check the junk folder.</div>
      <div>Students are created when <b>Create Student</b> is clicked. They remain in the system even if they don’t set a password or accept their invitation.</div>
    </div>
  );
}
function FooterActions({ sticky }) {
  return (
    <div className={'as-foot' + (sticky ? ' sticky' : '')}>
      <button className="discard">Discard</button>
      <Btn variant="primary" size="lg" icon="UserPlus">Create student</Btn>
    </div>
  );
}

/* ---------------- section builders ---------------- */
const GCOLS = [{ key: 'title', label: 'Title', type: 'text' }, { key: 'desc', label: 'Description', type: 'text' }, { key: 'students', label: 'Number of Students', type: 'num' }];
const TCOLS = [{ key: 'first', label: 'First Name', type: 'text' }, { key: 'last', label: 'Last Name', type: 'text' }, { key: 'email', label: 'Email', type: 'text' }, { key: 'students', label: 'Number of Students', type: 'num' }];

/* Organisation default for Initial Assessment visibility (example, driven by a tweak). */
function orgSetFromCfg(cfg) { return cfg.orgDefault === 'shows-all' ? new Set(window.IA.ALL_IDS) : new Set(['en-fs', 'ma-fs']); }
function orgRulesFromCfg(cfg) { return cfg.orgDefault === 'shows-all' ? [] : [{ id: 'h1', subject: 'English', level: 'Functional Skills' }, { id: 'h2', subject: 'Maths', level: 'Functional Skills' }]; }

function buildSections({ s, set, cfg, forcedList, status, orgShownSet, pfx, setPrev }) {
  const { GROUPS, TEACHERS } = window.AS_DATA;
  const hiddenCount = status.filter(x => x.hidden).length;
  const shownCount = status.length - hiddenCount;
  const onCustomise = () => {
    if (s.iaCustomise) set({ iaCustomise: false, showShown: new Set(orgShownSet), showRules: orgRulesFromCfg(cfg) });
    else set({ iaCustomise: true });
  };

  const forceNode = (
    <SectionCard id={pfx + 'force'} icon="Clipboard" iconTone="amber" title="Force Initial Assessments"
      count={s.forceRules.filter(r => r.subject).length ? s.forceRules.filter(r => r.subject).length + ' forced' : null}
      desc="Force a student to sit an initial assessment before they’re able to enrol on any course. Select which initial assessments to force below.">
      <ForceRows s={s} set={set} />
    </SectionCard>
  );
  const hideBody = <HideIABody s={s} set={set} pattern={cfg.hidePattern} forcedList={forcedList}
    orgShownSet={orgShownSet} customise={s.iaCustomise} onCustomise={onCustomise} provenance={cfg.provenance} firstName={s.firstName}
    showPreview={cfg.studentPreview} setPrevMode={(m) => set({ prevMode: m })} />;
  const hideNode = (
    <SectionCard id={pfx + 'hide'} icon="Eye" iconTone="slate" title="Show Initial Assessments"
      count={s.iaCustomise ? shownCount + ' of ' + status.length + ' shown · custom' : 'Organisation default'}
      desc="Choose which initial assessments this student sees on their learning portal. By default this follows your organisation-wide setting.">
      {hideBody}
    </SectionCard>
  );

  let ia;
  if (cfg.placement === 'merged') {
    ia = [{
      id: 'ia', icon: 'Clipboard', label: 'Initial assessments', node: (
        <SectionCard id={pfx + 'ia'} icon="Clipboard" title="Initial Assessments"
          desc="Control which initial assessments this student must sit, and which are hidden from their portal.">
          <div className="as-sublabel">Force — must be sat before enrolling</div>
          <ForceRows s={s} set={set} />
          <hr className="ia-divider" style={{ margin: '24px 0' }} />
          <div className="as-sublabel">Show — what appears on the student’s portal ({shownCount} of {status.length} shown)</div>
          {hideBody}
        </SectionCard>
      )
    }];
  } else {
    const force = { id: 'force', icon: 'Clipboard', label: 'Force initial assessments', node: forceNode };
    const hide = { id: 'hide', icon: 'Eye', label: 'Show initial assessments', node: hideNode };
    ia = cfg.placement === 'after' ? [force, hide] : [hide, force];
  }

  return [
    { id: 'details', icon: 'User', label: 'Student details', node: <StudentDetails s={s} set={set} showErrors={cfg.showErrors} /> },
    { id: 'courses', icon: 'Book', label: 'Courses', node: <Courses s={s} set={set} /> },
    ...ia,
    { id: 'knowledge', icon: 'ChartBar', label: 'Knowledge assessments', node: <Knowledge s={s} set={set} /> },
    {
      id: 'groups', icon: 'Users', label: 'Add to groups', node: (
        <SectionCard id={pfx + 'groups'} icon="Users" iconTone="slate" title="Add to groups" count={s.groups.size ? s.groups.size + ' selected' : null} desc="Select one or more groups to add this student to.">
          <PickerTable columns={GCOLS} rows={GROUPS} selected={s.groups} variant={cfg.tableStyle} searchKey="title" entity="group"
            onToggle={(id) => set({ groups: toggleSet(s.groups, id) })} onToggleAll={(ids, on) => set({ groups: manySet(s.groups, ids, on) })} />
        </SectionCard>
      )
    },
    {
      id: 'teachers', icon: 'UserPlus', label: 'Attach to teachers', node: (
        <SectionCard id={pfx + 'teachers'} icon="UserPlus" iconTone="slate" title="Attach to teachers" count={s.teachers.size ? s.teachers.size + ' selected' : null} desc="Attach this student to one or more teachers.">
          <PickerTable columns={TCOLS} rows={TEACHERS} selected={s.teachers} variant={cfg.tableStyle} searchKey="first" entity="teacher"
            onToggle={(id) => set({ teachers: toggleSet(s.teachers, id) })} onToggleAll={(ids, on) => set({ teachers: manySet(s.teachers, ids, on) })} />
        </SectionCard>
      )
    },
  ];
}

/* ---------------- section nav (layout 2) ---------------- */
function SectionNav({ secs, active, setActive, s, forcedList }) {
  const hasContent = {
    details: !!(s.firstName || s.lastName || s.email || s.username),
    courses: s.courses.length > 0,
    force: forcedList.length > 0, hide: false, ia: forcedList.length > 0,
    knowledge: s.knowledge.size > 0, groups: s.groups.size > 0, teachers: s.teachers.size > 0,
  };
  return (
    <nav className="as-secnav">
      <div className="snh">On this page</div>
      {secs.map(sec => (
        <a key={sec.id} className={active === sec.id ? 'active' : ''} onClick={() => setActive(sec.id)}>
          <Ico name={sec.icon} size={17} />{sec.label}
          {hasContent[sec.id] && <span className="dn" />}
        </a>
      ))}
    </nav>
  );
}

/* ---------------- the page ---------------- */
function seedState(cfg) {
  const { COURSE_LIB } = window.AS_DATA;
  const filled = cfg.form === 'filled';
  const forceRules = filled ? [{ id: 'f1', subject: 'English', level: 'Functional Skills' }] : [];
  // Initial Assessment visibility seeds from the organisation default; unlocking "Customise"
  // lets the provider edit it independently (all-or-none) for this student.
  const showRules = orgRulesFromCfg(cfg);
  const showShown = orgSetFromCfg(cfg);
  return {
    accountType: cfg.account || 'email',
    email: filled ? 'jordan.blake@student.pass.tech' : '',
    username: filled ? 'jordan.blake' : '',
    firstName: filled ? 'Jordan' : '', lastName: filled ? 'Blake' : '',
    pwMode: filled ? 'self' : null, pw: '', pw2: '',
    courses: filled ? [COURSE_LIB[0]] : [],
    forceRules, showRules, showShown, iaCustomise: cfg.iaStart === 'custom',
    knowledge: new Set(filled ? ['Maths'] : []),
    groups: new Set(filled ? ['g-cohort'] : []),
    teachers: new Set(filled ? ['t-matt'] : []),
    prevMode: 'absent',
  };
}

function AddStudentPage({ layout, cfg }) {
  const [s, setS] = useStateP(() => seedState(cfg));
  const [active, setActive] = useStateP('details');
  const set = (patch) => setS(prev => ({ ...prev, ...patch }));

  const forcedList = s.forceRules.filter(r => r.subject).map(r => ({ subject: r.subject, level: r.level }));
  const orgShownSet = orgSetFromCfg(cfg);
  const status = !s.iaCustomise
    ? window.IA.shownSetToStatus(orgShownSet, forcedList)
    : (cfg.hidePattern === 'rows'
      ? window.IA.computeShownStatus(s.showRules, forcedList)
      : window.IA.shownSetToStatus(s.showShown, forcedList));
  const pfx = layout + '-';
  const secs = buildSections({ s, set, cfg, forcedList, status, orgShownSet, pfx });

  const header = <><TopNav /></>;

  if (layout === 'l1') {
    return (
      <div className="aspage">
        {header}
        <div className="aswrap" style={{ maxWidth: 960 }}>
          <div className="as-crumbs"><a href="#" onClick={e => e.preventDefault()}>My Students</a><Ico name="AngleRight" size={14} />Add Student</div>
          <h1 className="as-title">Add new student</h1>
          {secs.map(sec => <div key={sec.id} style={{ marginBottom: 22 }}>{sec.node}</div>)}
          <FooterBits />
          <FooterActions sticky />
        </div>
      </div>
    );
  }

  if (layout === 'l2') {
    return (
      <div className="aspage">
        {header}
        <div className="aswrap" style={{ maxWidth: 1180 }}>
          <div className="as-crumbs"><a href="#" onClick={e => e.preventDefault()}>My Students</a><Ico name="AngleRight" size={14} />Add Student</div>
          <h1 className="as-title">Add new student</h1>
          <div className="as-l2">
            <SectionNav secs={secs} active={active} setActive={setActive} s={s} forcedList={forcedList} />
            <div>
              {secs.map(sec => <div key={sec.id} style={{ marginBottom: 22 }}>{sec.node}</div>)}
              <FooterBits />
              <FooterActions sticky />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // l3 — live summary
  return (
    <div className="aspage">
      {header}
      <div className="aswrap" style={{ maxWidth: 1300 }}>
        <div className="as-crumbs"><a href="#" onClick={e => e.preventDefault()}>My Students</a><Ico name="AngleRight" size={14} />Add Student</div>
        <h1 className="as-title">Add new student</h1>
        <div className="as-l3">
          <div>
            {secs.map(sec => <div key={sec.id} style={{ marginBottom: 22 }}>{sec.node}</div>)}
            <FooterBits />
            <FooterActions />
          </div>
          <StudentSummary s={s} forcedList={forcedList} status={status} />
        </div>
      </div>
    </div>
  );
}

window.AddStudentPage = AddStudentPage;
