/* My Courses page — Pass DS rebuild + persistent forced-IA banner.
   3 directions differ by banner style: A compact bar · B scrollable chips · C collapsible list.
   The banner is designed to sit on every page (persistent global bar); here it heads My Courses.
   Exposes window.MyCoursesPage. */
const { useState: useStateM } = React;

const IA_ALL = [
  { id: 'fs-en', name: 'Functional Skills English', subject: 'English', mins: 30 },
  { id: 'fs-ma', name: 'Functional Skills Maths', subject: 'Maths', mins: 40 },
  { id: 'gcse-en', name: 'GCSE English', subject: 'English', mins: 35 },
  { id: 'gcse-ma', name: 'GCSE Maths', subject: 'Maths', mins: 45 },
  { id: 'esol', name: 'ESOL English', subject: 'English', mins: 35 },
  { id: 'ds', name: 'Digital Skills', subject: 'Maths', mins: 25 },
];

const COURSES = [
  { id: 'fsm2', name: 'Functional Skills Maths Level 2', subject: 'Maths', level: 'Level 2', enrolled: true, plan: 'Free', completion: 0, topics: 35, practice: 105, mocks: 60 },
  { id: 'fse1', name: 'Functional Skills English Level 1', subject: 'English', level: 'Level 1', enrolled: true, plan: 'Free', completion: 62, topics: 31, practice: 28, mocks: 24 },
  { id: 'fse2', name: 'Functional Skills English Level 2', subject: 'English', level: 'Level 2', enrolled: false, topics: 35, practice: 28, mocks: 78 },
  { id: 'fsm1', name: 'Functional Skills Maths Level 1', subject: 'Maths', level: 'Level 1', enrolled: false, topics: 38, practice: 104, mocks: 26 },
  { id: 'fsme3', name: 'Functional Skills Maths Entry Level 3', subject: 'Maths', level: 'Entry 3', enrolled: false, topics: 24, practice: 72, mocks: 5 },
  { id: 'gme-f', name: 'GCSE Maths Edexcel Foundation', subject: 'Maths', level: 'GCSE', enrolled: false, topics: 100, practice: 294, mocks: 21 },
  { id: 'gme-h', name: 'GCSE Maths Edexcel Higher', subject: 'Maths', level: 'GCSE', enrolled: false, topics: 145, practice: 427, mocks: 9 },
  { id: 'gma-f', name: 'GCSE Maths AQA Foundation', subject: 'Maths', level: 'GCSE', enrolled: false, topics: 100, practice: 294, mocks: 21 },
  { id: 'gma-h', name: 'GCSE Maths AQA Higher', subject: 'Maths', level: 'GCSE', enrolled: false, topics: 145, practice: 427, mocks: 9 },
  { id: 'gce-en', name: 'GCSE English Language AQA', subject: 'English', level: 'GCSE', enrolled: false, topics: 42, practice: 96, mocks: 12 },
];

const sc = (s) => (s === 'Maths' ? 'maths' : 'english');

/* =============== forced-IA banner (3 styles) =============== */
function BannerCompact({ forced }) {
  const n = forced.length;
  return (
    <div className="iab">
      <div className="iab-row">
        <div className="iab-ic"><Ico name="Lock" size={22} /></div>
        <div className="iab-t">
          <div className="t">{n} initial assessment{n > 1 ? 's' : ''} required before you can enrol on a course</div>
          <div className="s">Your Learning Provider needs {n > 1 ? 'these' : 'this'} completed to unlock course enrolment.</div>
        </div>
        <span className="iab-count"><Ico name="Clipboard" size={13} />0 of {n} done</span>
        <button className="iab-btn"><Ico name="ArrowRightLong" size={15} />{n > 1 ? 'Complete assessments' : 'Complete assessment'}</button>
      </div>
    </div>
  );
}

function BannerChips({ forced }) {
  const n = forced.length;
  return (
    <div className="iab">
      <div className="iab-row">
        <div className="iab-ic"><Ico name="Lock" size={22} /></div>
        <div className="iab-t">
          <div className="t">{n} initial assessment{n > 1 ? 's' : ''} required before you can enrol</div>
          <div className="s">Complete each one below — course enrolment unlocks when they’re done.</div>
        </div>
        <span className="iab-count"><Ico name="Clipboard" size={13} />0 of {n} done</span>
      </div>
      <div className="iab-chips">
        {forced.map(f => (
          <div className="iab-chip" key={f.id}>
            <div className="ci"><Ico name="FileLines" size={17} /></div>
            <div className="cc"><div className="n">{f.name}</div><div className="m">Initial assessment · {f.mins} min</div></div>
            <span className="cg"><Ico name="ArrowRightLong" size={16} /></span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BannerCollapsible({ forced }) {
  const [open, setOpen] = useStateM(forced.length <= 3);
  const n = forced.length;
  return (
    <div className="iab">
      <div className="iab-row">
        <div className="iab-ic"><Ico name="Lock" size={22} /></div>
        <div className="iab-t">
          <div className="t">{n} initial assessment{n > 1 ? 's' : ''} required before you can enrol on a course</div>
          <div className="s">Your Learning Provider needs {n > 1 ? 'these' : 'this'} completed to unlock course enrolment.</div>
        </div>
        <span className="iab-count"><Ico name="Clipboard" size={13} />0 of {n} done</span>
        <button className={'iab-toggle' + (open ? ' open' : '')} onClick={() => setOpen(o => !o)} aria-label="Toggle list"><Ico name="AngleDown" size={17} /></button>
      </div>
      {open && (
        <div className="iab-list">
          {forced.map(f => (
            <div className="iab-li" key={f.id}>
              <div className="li-ic"><Ico name="FileLines" size={16} /></div>
              <div className="li-t"><div className="n">{f.name}</div><div className="m">Initial assessment · {f.mins} min · {f.subject}</div></div>
              <button className="li-btn"><Ico name="ArrowPath" size={14} />Start</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AllClear() {
  return (
    <div className="iab ok">
      <div className="iab-row">
        <div className="iab-ic"><Ico name="CheckCircle" size={22} /></div>
        <div className="iab-t">
          <div className="t">You’re all set — no required assessments outstanding</div>
          <div className="s">You can enrol on any course below.</div>
        </div>
      </div>
    </div>
  );
}

function Banner({ direction, forced }) {
  if (forced.length === 0) return <AllClear />;
  if (direction === 'B') return <BannerChips forced={forced} />;
  if (direction === 'C') return <BannerCollapsible forced={forced} />;
  return <BannerCompact forced={forced} />;
}

/* =============== course presentation =============== */
function StatusPill({ enrolled }) {
  return enrolled
    ? <span className="statuspill enrolled"><Ico name="CheckCircle" size={12} />Enrolled</span>
    : <span className="statuspill not">Not enrolled</span>;
}
function Comp({ v }) {
  return <div className="compwrap"><div className="compbar"><i style={{ width: v + '%' }} /></div><span className="comppct">{v}%</span></div>;
}
function EnrolAction({ c, locked }) {
  if (c.enrolled) return <button className="mc-start"><Ico name="ArrowRightLong" size={14} />Start learning</button>;
  if (locked) return (
    <div style={{ textAlign: 'right' }}>
      <button className="mc-enrol locked" disabled title="Complete your required initial assessments to enrol"><Ico name="Lock" size={14} />Enrol</button>
      <div className="mc-locknote"><Ico name="Lock" size={12} />Assessment required</div>
    </div>
  );
  return <button className="mc-enrol"><Ico name="Plus" size={14} />Enrol</button>;
}

function CourseTable({ rows, locked }) {
  return (
    <table className="ct2">
      <thead><tr><th>Course</th><th>Subject</th><th>Status</th><th>Completion</th><th style={{ textAlign: 'right' }}>Action</th></tr></thead>
      <tbody>
        {rows.map(c => (
          <tr key={c.id}>
            <td>
              <div className="cname">{c.name}</div>
              <div className="cmeta"><span><Ico name="Book" size={13} />{c.topics} topics</span><span><Ico name="FileLines" size={13} />{c.practice} practice</span><span><Ico name="Award" size={13} />{c.mocks} mocks</span></div>
            </td>
            <td><span className={'subjchip ' + sc(c.subject)}><Ico name="Book" size={12} />{c.subject}</span></td>
            <td><StatusPill enrolled={c.enrolled} /></td>
            <td><Comp v={c.completion || 0} /></td>
            <td><div className="mc-act"><EnrolAction c={c} locked={locked} /></div></td>
          </tr>
        ))}
        {rows.length === 0 && <tr><td colSpan={5} className="mc-empty">No courses match your filters.</td></tr>}
      </tbody>
    </table>
  );
}

function CourseCards({ rows, locked }) {
  if (rows.length === 0) return <div className="mc-empty">No courses match your filters.</div>;
  return (
    <div className="cc-grid">
      {rows.map(c => (
        <div className="cc" key={c.id}>
          <div className="cc-top"><span className={'subjchip ' + sc(c.subject)}><Ico name="Book" size={12} />{c.subject}</span><StatusPill enrolled={c.enrolled} /></div>
          <h3 className="cc-name">{c.name}</h3>
          <div className="cc-meta"><span><Ico name="Book" size={13} />{c.topics} topics</span><span><Ico name="FileLines" size={13} />{c.practice} practice</span><span><Ico name="Award" size={13} />{c.mocks} mocks</span></div>
          <div className="cc-foot">{c.enrolled ? <Comp v={c.completion || 0} /> : <span style={{ font: '600 13px var(--font)', color: 'var(--mute)' }}>{c.level}</span>}<span className="sp" /><EnrolAction c={c} locked={locked} /></div>
        </div>
      ))}
    </div>
  );
}

/* =============== nav =============== */
function MCNav() {
  const links = ['My Courses', 'My Subscriptions', 'Initial Assessments', 'Useful Links'];
  return (
    <div className="asnav">
      <div className="brand"><span className="mk"><Ico name="Check" size={17} /></span><span className="nm">PASS</span></div>
      <div className="links">{links.map(l => <a key={l} href="#" className={l === 'My Courses' ? 'active' : ''} onClick={(e) => e.preventDefault()}>{l}</a>)}</div>
      <div className="spacer" />
      <button className="ibtn"><Ico name="BellActiveAlt" size={18} /></button>
      <div className="avatar">JL</div>
    </div>
  );
}

/* =============== page =============== */
function MyCoursesPage({ direction, cfg }) {
  const forced = IA_ALL.slice(0, cfg.forcedCount);
  const locked = cfg.enrolLock && forced.length > 0;
  const [subject, setSubject] = useStateM('All');
  const [enrolledOnly, setEnrolledOnly] = useStateM(!!cfg.enrolledOnly);
  const [q, setQ] = useStateM('');
  const view = cfg.view;

  const enrolled = COURSES.filter(c => c.enrolled);
  const match = (c) => (subject === 'All' || c.subject === subject) && (!q.trim() || c.name.toLowerCase().includes(q.trim().toLowerCase()));
  const browse = COURSES.filter(c => match(c) && (!enrolledOnly || c.enrolled));

  return (
    <div className="mc-page">
      <MCNav />
      <div className="mc-wrap">
        <h1 className="mc-h1">My Courses</h1>

        <Banner direction={direction} forced={forced} />

        {/* My enrolled courses */}
        <div className="mc-sec">
          <div className="mc-sec-h"><h2>Continue learning</h2><span className="cnt">{enrolled.length} enrolled</span></div>
          {enrolled.length === 0
            ? <div className="mc-empty">You’re not enrolled on any courses yet.</div>
            : <div className="mc-enrolled-cards">
                {enrolled.map(c => (
                  <div className="ec" key={c.id}>
                    <div className="ec-sub"><span className={'subjchip ' + sc(c.subject)}><Ico name="Book" size={12} />{c.subject}</span></div>
                    <h3 className="ec-name">{c.name}</h3>
                    <Comp v={c.completion || 0} />
                    <div className="ec-foot"><button className="mc-start"><Ico name="ArrowRightLong" size={14} />Start learning</button><span className="sp" /><button className="mc-enrol" style={{ color: 'var(--red)', borderColor: 'var(--red-stroke)' }}><Ico name="Trash" size={14} />Unenrol</button></div>
                  </div>
                ))}
              </div>}
        </div>

        {/* All courses */}
        <div className="mc-sec">
          <div className="mc-sec-h">
            <h2>All courses</h2><span className="cnt">{browse.length}</span><span className="sp" />
            <div className="mc-filters">
              <div className="mc-search"><Ico name="Search" size={16} /><input placeholder="Search courses…" value={q} onChange={e => setQ(e.target.value)} /></div>
              <div className="mc-seg">{['All', 'Maths', 'English'].map(s => <button key={s} className={subject === s ? 'on' : ''} onClick={() => setSubject(s)}>{s}</button>)}</div>
              <div className="mc-seg"><button className={enrolledOnly ? 'on' : ''} onClick={() => setEnrolledOnly(e => !e)}>Enrolled only</button></div>
              <div className="mc-viewbtns">
                <button className={view === 'table' ? 'on' : ''} onClick={() => cfg.setView('table')} aria-label="Table"><Ico name="ListBullet" size={17} /></button>
                <button className={view === 'cards' ? 'on' : ''} onClick={() => cfg.setView('cards')} aria-label="Cards"><Ico name="Grid" size={17} /></button>
              </div>
            </div>
          </div>
          {view === 'cards' ? <CourseCards rows={browse} locked={locked} /> : <CourseTable rows={browse} locked={locked} />}
        </div>
      </div>
    </div>
  );
}
window.MyCoursesPage = MyCoursesPage;
Object.assign(window, { Banner, IA_CATALOG: IA_ALL });
