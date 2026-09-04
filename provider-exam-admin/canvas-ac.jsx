/* States Canvas — all new screens/states laid out for review */
const F = window;

/* ===== reusable bits ===== */
function MiniList({ dim }) {
  return (
    <div style={{ opacity: dim ? .5 : 1, filter: dim ? 'saturate(.6)' : 'none' }}>
      <div className="section-h">Active Exams</div>
      <div className="stack">
        <ExamCard title="Maths Level 1" next="Choose Exam Date" studentName="Amelia Hughes"
          cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
          meta={<><Meta icon="CalendarMonth">15/03/2026</Meta><Meta icon="Book" tone="green">View Course</Meta></>} />
        <ExamCard title="English Level 2" next="Sit Exam"
          cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
          meta={<><Meta icon="CalendarMonth">22/04/2026</Meta><Meta icon="Book" tone="green">View Course</Meta></>} />
      </div>
    </div>
  );
}

const OptYouStudent = ({ which, set }) => (
  <div className="stack" style={{ gap: 14 }}>
    <div className={'opt' + (which === 'me' ? ' is-on' : '')} onClick={() => set('me')}>
      <div className="radio" />
      <div className="oico"><Ico name="GraduationCap" size={20} /></div>
      <div><div className="otitle">Just myself</div><div className="odesc">I'm sitting these exams. We'll skip the setup step from now on.</div></div>
    </div>
    <div className={'opt' + (which === 'students' ? ' is-on' : '')} onClick={() => set('students')}>
      <div className="radio" />
      <div className="oico"><Ico name="BellActiveAlt" size={20} /></div>
      <div><div className="otitle">For my students</div><div className="odesc">I book and administer exams on behalf of others. We'll add a quick setup step per exam.</div></div>
    </div>
  </div>
);

/* ===== A — Onboarding (3 variants) ===== */
function OnboardA() {
  const [w, setW] = useState('students');
  return (
    <Screen w={1200}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams', active: true }]} />
      <PageTitle>My Exams</PageTitle>
      <div className="grid"><Sidebar /><div><MiniList dim /></div></div>
      <div className="scrim">
        <div className="dialog" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', color: 'var(--mute)' }}><Ico name="Close" size={20} /></div>
          <div className="dialog-body">
            <div className="oico" style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 16 }}><Ico name="GraduationCap" size={26} /></div>
            <h2 style={{ font: '800 22px var(--font)', margin: '0 0 6px', color: 'var(--ink)' }}>Quick question before you start</h2>
            <p className="muted" style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.5 }}>Are you booking exams for yourself, or for your students? This just sets a default — you can change it any time, and it never limits what you can do.</p>
            <OptYouStudent which={w} set={setW} />
            <div className="spread" style={{ marginTop: 24 }}>
              <span className="tiny">Change later in Settings → Booking preferences.</span>
              <Btn variant="primary" iconRight="ArrowRight">Continue</Btn>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

function OnboardB() {
  const [w, setW] = useState('students');
  return (
    <Screen w={1200} minH={760}>
      <div style={{ maxWidth: 620, margin: '40px auto 0', textAlign: 'center' }}>
        <div className="oico" style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px' }}><Ico name="GraduationCap" size={28} /></div>
        <div style={{ font: '700 13px var(--font)', letterSpacing: '.08em', color: 'var(--green-dark)', textTransform: 'uppercase' }}>Welcome to Pass</div>
        <h1 style={{ font: '800 30px var(--font)', margin: '10px 0 10px', color: 'var(--ink)' }}>Who are you booking exams for?</h1>
        <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, margin: '0 0 28px' }}>Pick the option that fits you best. It only sets a default to tailor your setup — you can change it any time and it never restricts you.</p>
        <div style={{ textAlign: 'left' }}><OptYouStudent which={w} set={setW} /></div>
        <Btn variant="primary" size="lg" iconRight="ArrowRight" block>Continue</Btn>
        <div className="tiny" style={{ marginTop: 16, cursor: 'pointer' }}>Skip for now — I'll decide later</div>
      </div>
    </Screen>
  );
}

function OnboardC() {
  return (
    <Screen w={1200}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams', active: true }]} />
      <PageTitle>My Exams</PageTitle>
      <div className="grid"><Sidebar /><div>
        <div className="banner banner--success" style={{ marginBottom: 24, alignItems: 'center' }}>
          <Ico name="InfoCircle" size={22} cls="bi" />
          <div><h4>Set how you usually book</h4><p>Are these exams for you, or for your students? Choose a default so we can tailor each setup.</p></div>
          <div className="ba row" style={{ gap: 10 }}>
            <Btn variant="secondary" size="sm">For myself</Btn>
            <Btn variant="primary" size="sm">For my students</Btn>
          </div>
        </div>
        <MiniList />
      </div></div>
    </Screen>
  );
}

/* ===== C — Exam list ===== */
function FilterBar() {
  return (
    <div className="spread" style={{ marginBottom: 18, gap: 14, flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
        <span style={{ position: 'absolute', left: 13, top: 11, color: 'var(--mute)' }}><Ico name="MessageCaption" size={18} /></span>
        <input className="input" style={{ paddingLeft: 40 }} placeholder="Search by student name…" />
      </div>
      <div className="row" style={{ gap: 10 }}>
        <button className="btn btn--secondary"><Ico name="GraduationCap" size={16} />All students<Ico name="AngleDown" size={14} /></button>
        <button className="btn btn--secondary">Status: Active<Ico name="AngleDown" size={14} /></button>
      </div>
    </div>
  );
}

function ExamListFull() {
  return (
    <Screen w={1240}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams', active: true }]} />
      <PageTitle>My Exams</PageTitle>
      <div className="grid"><Sidebar /><div>
        <div className="section-h">Active Exams</div>
        <FilterBar />
        <div className="stack">
          <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" initials="PH" setup
            cta={<Btn variant="amber" size="sm" iconRight="ArrowRight">Set up exam</Btn>}
            meta={<Meta icon="ExclamationCircle" tone="amber">Add the student's name before booking</Meta>} />
          <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="Choose Exam Date" studentName="Amelia Hughes"
            cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
            meta={<><Meta icon="CalendarMonth">No Exam Date</Meta><Meta icon="Book">No Course</Meta></>} />
          <ExamCard title="English Level 2" board="TQUK | Automated Invigilation" next="Choose Exam Date" studentName="Daniel Okafor"
            cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
            meta={<><Meta icon="CalendarMonth">22/04/2026</Meta><Meta icon="Clock">2:00pm</Meta><Meta icon="Book" tone="green">View Course</Meta></>} />
          <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="View Results" studentName="Priya Shah"
            cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
            meta={<><Meta icon="CalendarMonth">02/03/2026</Meta><Meta icon="Award" tone="green">Result ready</Meta></>} />
        </div>
      </div></div>
    </Screen>
  );
}

function NeedsSetupA() {
  return (
    <div className="pass" style={{ padding: 24, background: 'var(--bg-soft)' }}>
      <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" initials="PH" setup
        cta={<Btn variant="amber" size="sm" iconRight="ArrowRight">Set up exam</Btn>}
        meta={<Meta icon="ExclamationCircle" tone="amber">Add the student's name before booking</Meta>} />
    </div>
  );
}
function NeedsSetupB() {
  return (
    <div className="pass" style={{ padding: 24, background: 'var(--bg-soft)' }}>
      <div className="card exam">
        <div className="exam-top">
          <div className="exam-ava">PH</div>
          <div className="exam-id">
            <div className="exam-title">Maths Level 1 <Badge variant="neutral" icon="Minus">Not set up</Badge></div>
            <div className="exam-board">TQUK | Automated Invigilation</div>
            <div className="exam-next">Next Step: Add the student's name</div>
          </div>
          <div className="exam-cta"><Btn variant="primary" size="sm" iconRight="ArrowRight">Set up</Btn></div>
        </div>
        <div className="exam-foot"><div className="left"><Meta icon="InfoCircle">Booking opens once setup is complete</Meta></div></div>
      </div>
    </div>
  );
}

/* ===== exports collected in host ===== */
Object.assign(window, { OnboardA, OnboardB, OnboardC, ExamListFull, NeedsSetupA, NeedsSetupB, FilterBar, OptYouStudent, MiniList });
