/* States Canvas — sections D–G */

/* ===== D — Assignment step ===== */
const SetupStepper = ({ current }) => (
  <Stepper title="Maths Level 1" nextLabel={null} steps={[
    { state: 'current', num: 1, label: 'Set up exam' },
    { state: 'todo', num: 2, label: 'Learner Information' },
    { state: 'todo', num: 3, label: 'Instruction Form' },
    { state: 'todo', num: 4, label: 'Choose Exam Date' },
    { state: 'todo', num: 5, label: 'View Results' },
  ]} />
);

function Wizbar({ step }) {
  const labels = ['Student name', 'Confirm'];
  return (
    <div className="wizbar">
      {labels.map((l, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className={'wsep' + (i <= step ? ' is-on' : '')} />}
          <div className={'wd' + (i === step ? ' is-on' : i < step ? ' is-done' : '')}>
            <div className="wn">{i < step ? <Ico name="Check" size={13} /> : i + 1}</div>{l}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* (capability presets removed — a student's exam is now just labelled with a name) */

function WizCard({ step, children, title, sub, back, next = 'Continue' }) {
  return (
    <div className="card card-pad">
      <Wizbar step={step} />
      <h2 className="content-h" style={{ fontSize: 20 }}>{title}</h2>
      {sub && <p className="content-sub" style={{ marginBottom: 20 }}>{sub}</p>}
      {children}
      <div className="spread" style={{ marginTop: 24 }}>
        {back ? <Btn variant="secondary" icon="ArrowLeft">Back</Btn> : <span />}
        <Btn variant="primary" iconRight="ArrowRight">{next}</Btn>
      </div>
    </div>
  );
}

function WizName() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  return (
    <WizCard step={0} title="Who is this exam for?" sub="You bought Maths Level 1. Enter the student who'll sit it — you run every step on their behalf.">
      <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student first name</label><input className="input" placeholder="Amelia" value={first} onChange={(e) => setFirst(e.target.value)} /></div>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student last name</label><input className="input" placeholder="Hughes" value={last} onChange={(e) => setLast(e.target.value)} /></div>
      </div>
      <div className="note" style={{ marginTop: 16 }}><Ico name="InfoCircle" size={15} />This name only labels the exam. The student doesn't log in and isn't notified.</div>
    </WizCard>
  );
}
function WizConfirm() {
  return (
    <WizCard step={1} title="Check the details" sub="Make sure this is right before you finish." back next="Confirm & finish">
      <div className="banner banner--amber" style={{ marginBottom: 16 }}>
        <Ico name="ExclamationCircle" size={22} cls="bi" />
        <div><h4>You're setting up this exam for Amelia Hughes</h4><p>This can't easily be changed once setup is done, and the student can't log in to correct it themselves.</p></div>
      </div>
      <div style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '6px 16px' }}>
        <DRow icon="Clipboard" label="Exam:" value="Maths Level 1 · TQUK" />
        <DRow icon="GraduationCap" label="Student:" value="Amelia Hughes" />
        <DRow icon="Eye" label="Administered by:" value="You — the student can't log in or be notified" valueStrong={false} />
      </div>
    </WizCard>
  );
}

function AssignSingle() {
  const [first, setFirst] = useState('');
  const [last, setLast] = useState('');
  const full = [first.trim(), last.trim()].filter(Boolean).join(' ');
  return (
    <Screen w={1180}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams' }, { icon: 'Home', label: '#12345' }, { icon: 'CheckCircle', label: 'Set up exam', active: true }]} />
      <PageTitle>Next Step</PageTitle>
      <div className="grid"><SetupStepper /><div>
        <BackLink />
        <h2 className="content-h">Set up this exam</h2>
        <p className="content-sub">Tell us which student Maths Level 1 is for. You administer the exam on their behalf.</p>
        <div className="card card-pad stack" style={{ gap: 24 }}>
          <div>
            <div className="section-h" style={{ fontSize: 15 }}>1 · Who is this exam for?</div>
            <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student first name</label><input className="input" placeholder="Amelia" value={first} onChange={(e) => setFirst(e.target.value)} /></div>
              <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student last name</label><input className="input" placeholder="Hughes" value={last} onChange={(e) => setLast(e.target.value)} /></div>
            </div>
            <div className="note" style={{ marginTop: 16 }}><Ico name="InfoCircle" size={15} />This name only labels the exam. The student doesn't log in and isn't notified.</div>
          </div>
          <hr className="hr" />
          <div>
            <div className="section-h" style={{ fontSize: 15 }}>2 · Confirm</div>
            <div className="banner banner--amber">
              <Ico name="ExclamationCircle" size={22} cls="bi" />
              <div><h4>{full ? `You're setting up this exam for ${full}` : "Enter the student's name above"}</h4><p>This can't easily be changed once setup is done, and the student can't log in to correct it themselves.</p></div>
            </div>
          </div>
          <div className="spread"><span className="note"><Ico name="InfoCircle" size={15} />You complete everything on the student's behalf.</span><Btn variant="primary" iconRight="ArrowRight">Confirm & finish</Btn></div>
        </div>
      </div></div>
    </Screen>
  );
}

/* ===== E — Provider detail ===== */
function ProviderDetail({ released }) {
  return (
    <Screen w={1240}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams' }, { icon: 'Home', label: '#12345' }, { icon: 'CheckCircle', label: 'View Exam', active: true }]} />
      <PageTitle>View Exam</PageTitle>
      <div className="grid">
        <Stepper steps={[
          { state: 'done', num: 1, label: 'View Exam Details' },
          { state: 'done', num: 2, label: 'View Learner Information' },
          { state: 'done', num: 3, label: 'View Instruction Form' },
          { state: 'current', num: 4, label: 'Choose Exam Date' },
          { state: 'todo', num: 5, label: 'View Results' },
        ]} />
        <div className="stack">
          <BackLink />
          <Banner variant="amber" icon="ExclamationCircle" title="You are completing this exam on behalf of Amelia Hughes">
            Everything you do here is recorded against <b>Amelia Hughes</b>. Check this is the right student before you continue — they can't log in or be notified, so only you can catch a mistake.
          </Banner>
          <DetailCard head={
            <div className="dcard-head">
              <div className="exam-ava">AH</div>
              <div className="exam-id"><div className="exam-title">Maths Level 1</div><div className="exam-board">TQUK | Automated Invigilation</div><div className="exam-for"><Ico name="GraduationCap" size={15} />For student: <b>Amelia Hughes</b></div></div>
            </div>}>
            <DRow icon="CalendarMonth" label="Exam Date:" value="15/03/2026" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">Change date</Btn>} />
            <DRow icon="Pen" label="Exam Subject:" value="Functional Skills Maths Level 1" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View curriculum</Btn>} />
            <DRow icon="Hourglass" label="Exam Expiry:" value="Expires in 27 days" />
            <DRow icon="Clipboard" label="Order Number:" value="12345" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View order</Btn>} />
            <DRow icon="Book" label="Course:" value="Available" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Login to course</Btn>} />
          </DetailCard>

          {/* results — provider-viewable, no release to student */}
          <DetailCard head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Results</div><div className="exam-board" style={{ fontSize: 14 }}>Results appear here for you. The student isn't notified — you share them directly.</div></div></div>}>
            {released ? (
              <>
                <DRow icon="Award" label="Result:" value={<Badge variant="released" icon="CheckCircle">Pass</Badge>} action={<Btn variant="primary" size="sm" icon="Download">Download result</Btn>} />
                <DRow icon="Eye" label="Sharing:" value="Only you can see this — pass it on to the student yourself." valueStrong={false} />
              </>
            ) : (
              <>
                <DRow icon="Award" label="Result:" value={<Badge variant="withheld" icon="Hourglass">Awaiting result</Badge>} action={<span className="tiny">Appears here once marked</span>} />
                <DRow icon="InfoCircle" label="What happens:" value="When the exam is marked, the result shows here in your dashboard." valueStrong={false} />
              </>
            )}
          </DetailCard>

          <DetailCard head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Additional Actions</div></div></div>}>
            <DRow icon="Archive" label="Archive Exam" action={<Btn variant="secondary" size="sm">Archive</Btn>} />
          </DetailCard>
        </div>
      </div>
    </Screen>
  );
}

/* ===== F — Student view ===== */
function StudentView({ summary }) {
  return (
    <Screen w={1240}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams' }, { icon: 'CheckCircle', label: 'Your exam', active: true }]} />
      <PageTitle>Your Exam</PageTitle>
      <div className="grid">
        <Stepper title="Maths Level 1" nextLabel={null} steps={[
          { state: 'done', num: 1, label: 'Exam details' },
          { state: 'current', num: 2, label: 'Your exam date' },
          { state: 'todo', num: 3, label: 'Results' },
        ]} />
        <div className="stack">
          {summary ? (
            <div className="summary">
              <div className="eyebrow">Your upcoming exam</div>
              <h2>Maths Level 1</h2>
              <div className="board">TQUK · Functional Skills Maths Level 1</div>
              <div className="summary-grid">
                <div className="sfact"><div className="si"><Ico name="CalendarMonth" size={20} /></div><div><div className="sk">Date</div><div className="sv">15 March 2026</div></div></div>
                <div className="sfact"><div className="si"><Ico name="Clock" size={20} /></div><div><div className="sk">Time</div><div className="sv">2:00pm</div></div></div>
                <div className="sfact"><div className="si"><Ico name="Book" size={20} /></div><div><div className="sk">Course</div><div className="sv" style={{ color: 'var(--green-dark)' }}>Open course →</div></div></div>
                <div className="sfact"><div className="si"><Ico name="Award" size={20} /></div><div><div className="sk">Result</div><div className="sv" style={{ color: 'var(--gray)' }}>Pending</div></div></div>
              </div>
              <div style={{ marginTop: 18 }}><Btn variant="primary" block icon="ArrowRightToBracket">Join exam</Btn><div className="tiny" style={{ marginTop: 8, textAlign: 'center' }}>Opens at 2:00pm on 15 March 2026</div></div>
              <div className="note" style={{ marginTop: 18 }}><Ico name="InfoCircle" size={15} />Your provider manages this booking. They'll release your result when it's ready.</div>
            </div>
          ) : (
            <>
              <DetailCard head={<div className="dcard-head"><div className="exam-ava">ML</div><div className="exam-id"><div className="exam-title">Maths Level 1</div><div className="exam-board">TQUK | Automated Invigilation</div></div></div>}>
                <DRow icon="CalendarMonth" label="Exam Date:" value="15/03/2026" />
                <DRow icon="Clock" label="Exam Time:" value="2:00pm" />
                <DRow icon="ArrowRightToBracket" label="Join exam:" value="Opens at 2:00pm on exam day" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Join exam</Btn>} />
                <DRow icon="Book" label="Course:" value="Available" action={<Btn variant="secondary" size="sm" iconRight="ArrowRight">Login to course</Btn>} />
                <DRow icon="Award" label="Result:" value={<Badge variant="withheld">Pending</Badge>} />
              </DetailCard>
              <div className="note"><Ico name="InfoCircle" size={15} />Booking and results are managed by your provider.</div>
            </>
          )}
        </div>
      </div>
    </Screen>
  );
}

/* ===== G — Results states (student-facing) ===== */
function ResultsState({ released }) {
  return (
    <Screen w={1240} minH={620}>
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams' }, { icon: 'Home', label: '#12345' }, { icon: 'CheckCircle', label: released ? 'View Results' : 'Awaiting Results', active: true }]} />
      <PageTitle>{released ? 'Your Results' : 'Awaiting Results'}</PageTitle>
      <div className="grid">
        <Stepper title="Maths Level 1" nextLabel={null} steps={[
          { state: 'done', num: 1, label: 'View Exam Details' },
          { state: 'done', num: 2, label: 'Sit Exam' },
          { state: released ? 'done' : 'current', num: 3, label: released ? 'View Results' : 'Awaiting Results' },
        ]} />
        <div className="stack">
          <h2 className="content-h">Exam Results</h2>
          <p className="content-sub">{released ? 'Your result is ready. A copy has been emailed to you.' : 'Your exam is marked. Results are released by your provider — we\u2019ll email you the moment they\u2019re available.'}</p>
          {released ? (
            <div className="card">
              <div className="banner banner--success" style={{ borderRadius: '12px 12px 0 0', border: 'none', borderBottom: '1px solid var(--green-stroke)' }}>
                <Ico name="Award" size={22} cls="bi" />
                <div><h4>Pass — Functional Skills Maths Level 1</h4><p>Released 12 June 2026</p></div>
              </div>
              <DRow icon="Award" label="Result:" value="Pass" />
              <DRow icon="FileLines" label="Certificate:" value="Ready" action={<Btn variant="primary" size="sm" icon="Download">Download</Btn>} />
              <DRow icon="Envelope" label="Emailed to:" value="you@email.com" valueStrong={false} />
            </div>
          ) : (
            <div className="card">
              <DRow icon="Award" label="Result:" value={<Badge variant="withheld" icon="Hourglass">Pending release</Badge>} />
              <DRow icon="InfoCircle" label="What this means:" value="Your provider reviews and releases results. This isn't a delay on your part — nothing more is needed from you." valueStrong={false} />
              <DRow icon="Envelope" label="Notification:" value="We'll email you as soon as your result is released." valueStrong={false} />
            </div>
          )}
        </div>
      </div>
    </Screen>
  );
}

Object.assign(window, { SetupStepper, Wizbar, WizName, WizConfirm, AssignSingle, ProviderDetail, StudentView, ResultsState });
