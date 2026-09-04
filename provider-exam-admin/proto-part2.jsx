/* Provider prototype — assignment, detail, student view, app shell */
const { useState: uS } = React;

/* ---------- assignment: the provider just labels the exam with a student's name ---------- */

const SetupStepper = () => (
  <Stepper title="Maths Level 1" nextLabel={null} steps={[
    { state: 'current', num: 1, label: 'Set up exam' },
    { state: 'todo', num: 2, label: 'Learner Information' },
    { state: 'todo', num: 3, label: 'Instruction Form' },
    { state: 'todo', num: 4, label: 'Choose Exam Date' },
    { state: 'todo', num: 5, label: 'View Results' },
  ]} />
);

function Assign({ format, onFinish, onBack }) {
  const [first, setFirst] = uS('');
  const [last, setLast] = uS('');
  const [step, setStep] = uS(0);
  const full = [first.trim(), last.trim()].filter(Boolean).join(' ');

  const nameFields = (
    <div className="stack" style={{ gap: 16 }} data-why={4}>
      <div className="row" style={{ gap: 14, alignItems: 'flex-start' }}>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student first name</label><input className="input" placeholder="Amelia" value={first} onChange={(e) => setFirst(e.target.value)} /></div>
        <div className="field" style={{ flex: 1, marginBottom: 0 }}><label>Student last name</label><input className="input" placeholder="Hughes" value={last} onChange={(e) => setLast(e.target.value)} /></div>
      </div>
      <div className="note"><Ico name="InfoCircle" size={15} />This name only labels the exam. The student doesn't log in and isn't notified — you complete every step for them.</div>
    </div>
  );

  const confirmBlock = (
    <>
      <Banner variant="amber" icon="ExclamationCircle" title={full ? `You're setting up this exam for ${full}` : 'Enter the student’s name first'}>
        Check the spelling now — this can’t easily be changed once setup is done, and the student can’t log in to correct it themselves.
      </Banner>
      <div className="card card-pad" style={{ marginTop: 16 }} data-why={6}>
        <div className="section-h" style={{ fontSize: 15 }}>Setup summary</div>
        <DRow icon="Clipboard" label="Exam:" value="Maths Level 1 · TQUK" />
        <DRow icon="GraduationCap" label="Student:" value={full || '—'} />
        <DRow icon="Eye" label="Administered by:" value="You — the student can’t log in or be notified" valueStrong={false} />
      </div>
    </>
  );

  const wizSeq = ['name', 'confirm'];
  const cur = wizSeq[Math.min(step, wizSeq.length - 1)];
  const onLast = step >= wizSeq.length - 1;
  const wizLabels = ['Student name', 'Confirm'];
  const Wizbar = () => (
    <div className="wizbar">
      {wizLabels.map((l, i) => (
        <React.Fragment key={i}>
          {i > 0 && <div className={'wsep' + (i <= step ? ' is-on' : '')} />}
          <div className={'wd' + (i === step ? ' is-on' : i < step ? ' is-done' : '')}>
            <div className="wn">{i < step ? <Ico name="Check" size={13} /> : i + 1}</div>{l}
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  const inner = format === 'wizard' ? (
    <div className="card card-pad" style={{ maxWidth: 720 }}>
      <Wizbar />
      {cur === 'name' && <><h2 className="content-h" style={{ fontSize: 20 }}>Who is this exam for?</h2><p className="content-sub" style={{ marginBottom: 18 }}>You bought Maths Level 1. Enter the student who'll sit it — you run every step on their behalf.</p>{nameFields}</>}
      {cur === 'confirm' && <><h2 className="content-h" style={{ fontSize: 20 }}>Check the details</h2><p className="content-sub" style={{ marginBottom: 18 }}>Make sure this is right before you finish.</p>{confirmBlock}</>}
      <div className="spread" style={{ marginTop: 24 }}>
        <Btn variant="secondary" icon="ArrowLeft" onClick={() => (step === 0 ? onBack() : setStep(step - 1))}>Back</Btn>
        <Btn variant="primary" iconRight="ArrowRight" onClick={() => (onLast ? onFinish({ first, last }) : setStep(step + 1))}>{onLast ? 'Confirm & finish' : 'Continue'}</Btn>
      </div>
    </div>
  ) : (
    <div className="card card-pad stack" style={{ gap: 24, maxWidth: 760 }}>
      <div><div className="section-h" style={{ fontSize: 15 }}>1 · Who is this exam for?</div>{nameFields}</div>
      <hr className="hr" />
      <div><div className="section-h" style={{ fontSize: 15 }}>2 · Confirm</div>{confirmBlock}</div>
      <div className="spread"><span className="note"><Ico name="InfoCircle" size={15} />You complete everything on the student's behalf.</span><Btn variant="primary" iconRight="ArrowRight" onClick={() => onFinish({ first, last })}>Confirm & finish</Btn></div>
    </div>
  );

  return (
    <Screen w="100%">
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams' }, { icon: 'Home', label: '#12345' }, { icon: 'CheckCircle', label: 'Set up exam', active: true }]} />
      <PageTitle>Next Step</PageTitle>
      <div className="grid"><SetupStepper /><div>
        <BackLink onClick={onBack} />
        {format === 'single' && <><h2 className="content-h">Set up this exam</h2><p className="content-sub">Tell us which student Maths Level 1 is for. You administer the exam on their behalf.</p></>}
        {inner}
      </div></div>
    </Screen>
  );
}

/* ---------- provider detail ---------- */
function ProviderDetail({ studentName = 'Amelia Hughes', released }) {
  const initials = studentName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() || 'AH';
  return (
    <div className="stack">
      <BackLink />
      <Banner variant="amber" icon="ExclamationCircle" title={'You are completing this exam on behalf of ' + studentName} why={5}>
        Everything you do here is recorded against <b>{studentName}</b>. Check this is the right student before you continue — they can’t log in or be notified, so only you can catch a mistake.
      </Banner>
      <DetailCard head={
        <div className="dcard-head"><div className="exam-ava">{initials}</div>
          <div className="exam-id"><div className="exam-title">Maths Level 1</div><div className="exam-board">TQUK | Automated Invigilation</div><div className="exam-for"><Ico name="GraduationCap" size={15} />For student: <b>{studentName}</b></div></div>
        </div>}>
        <DRow icon="CalendarMonth" label="Exam Date:" value="15/03/2026" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">Change date</Btn>} />
        <DRow icon="Pen" label="Exam Subject:" value="Functional Skills Maths Level 1" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View curriculum</Btn>} />
        <DRow icon="Hourglass" label="Exam Expiry:" value="Expires in 27 days" />
        <DRow icon="Clipboard" label="Order Number:" value="12345" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View order</Btn>} />
        <DRow icon="Book" label="Course:" value="Available" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Login to course</Btn>} />
      </DetailCard>
      <DetailCard why={7} head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Results</div><div className="exam-board" style={{ fontSize: 14 }}>Results appear here for you. The student isn’t notified — you share them directly.</div></div></div>}>
        {released ? <>
          <DRow icon="Award" label="Result:" value={<Badge variant="released" icon="CheckCircle">Pass</Badge>} action={<Btn variant="primary" size="sm" icon="Download">Download result</Btn>} />
          <DRow icon="Eye" label="Sharing:" value="Only you can see this — pass it on to the student yourself." valueStrong={false} />
        </> : <>
          <DRow icon="Award" label="Result:" value={<Badge variant="withheld" icon="Hourglass">Awaiting result</Badge>} action={<span className="tiny">Appears here once marked</span>} />
          <DRow icon="InfoCircle" label="What happens:" value="When the exam is marked, the result shows here in your dashboard." valueStrong={false} />
        </>}
      </DetailCard>
      <DetailCard head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Additional Actions</div></div></div>}>
        <DRow icon="Archive" label="Archive Exam" action={<Btn variant="secondary" size="sm">Archive</Btn>} />
      </DetailCard>
    </div>
  );
}

/* ---------- self (learner managing their own exam) — full exam view ---------- */
function SelfDetail({ released }) {
  return (
    <div className="stack">
      <BackLink>Back to My Exams</BackLink>
      <DetailCard head={
        <div className="dcard-head"><div className="exam-ava">JL</div>
          <div className="exam-id"><div className="exam-title">Maths Level 1</div><div className="exam-board">TQUK | Automated Invigilation</div></div>
        </div>}>
        <DRow icon="CalendarMonth" label="Exam Date:" value="15/03/2026" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">Change date</Btn>} />
        <DRow icon="Clock" label="Exam Time:" value="2:00pm" />
        <DRow icon="ArrowRightToBracket" label="Join exam:" value="Opens at 2:00pm on exam day" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Join exam</Btn>} />
        <DRow icon="Pen" label="Exam Subject:" value="Functional Skills Maths Level 1" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View curriculum</Btn>} />
        <DRow icon="Hourglass" label="Exam Expiry:" value="Expires in 27 days" />
        <DRow icon="Clipboard" label="Order Number:" value="12345" action={<Btn variant="ghost" size="sm" iconRight="ArrowRight">View order</Btn>} />
        <DRow icon="Book" label="Course:" value="Available" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Login to course</Btn>} />
      </DetailCard>
      <DetailCard head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Results</div><div className="exam-board" style={{ fontSize: 14 }}>Available once your exam is marked.</div></div></div>}>
        <DRow icon="Award" label="Result:" value={released ? <Badge variant="released" icon="CheckCircle">Pass — view result</Badge> : <Badge variant="withheld" icon="Hourglass">Pending</Badge>}
          action={released ? <Btn variant="primary" size="sm" iconRight="ArrowRight">View result</Btn> : <span className="tiny">Marked after your exam</span>} />
      </DetailCard>
      <DetailCard head={<div className="dcard-head" style={{ paddingBottom: 16 }}><div className="exam-id"><div className="exam-title" style={{ fontSize: 16 }}>Additional Actions</div><div className="exam-board" style={{ fontSize: 14 }}>Available until the exam starts.</div></div></div>}>
        <DRow icon="Archive" label="Archive Exam" action={<Btn variant="secondary" size="sm">Archive</Btn>} />
      </DetailCard>
    </div>
  );
}

/* ---------- student view ---------- */
function StudentDetail({ view, released }) {
  if (view === 'summary') {
    return (
      <div className="summary">
        <div className="eyebrow">Your upcoming exam</div>
        <h2>Maths Level 1</h2>
        <div className="board">TQUK · Functional Skills Maths Level 1</div>
        <div className="summary-grid">
          <div className="sfact"><div className="si"><Ico name="CalendarMonth" size={20} /></div><div><div className="sk">Date</div><div className="sv">15 March 2026</div></div></div>
          <div className="sfact"><div className="si"><Ico name="Clock" size={20} /></div><div><div className="sk">Time</div><div className="sv">2:00pm</div></div></div>
          <div className="sfact"><div className="si"><Ico name="Book" size={20} /></div><div><div className="sk">Course</div><div className="sv" style={{ color: 'var(--green-dark)' }}>Open course →</div></div></div>
          <div className="sfact" data-why={7}><div className="si"><Ico name="Award" size={20} /></div><div><div className="sk">Result</div><div className="sv" style={{ color: released ? 'var(--green-dark)' : 'var(--gray)' }}>{released ? 'Pass — view' : 'Pending'}</div></div></div>
        </div>
        <div style={{ marginTop: 18 }}><Btn variant="primary" block icon="ArrowRightToBracket">Join exam</Btn><div className="tiny" style={{ marginTop: 8, textAlign: 'center' }}>Opens at 2:00pm on 15 March 2026</div></div>
        <div className="note" style={{ marginTop: 18 }} data-why={5}><Ico name="InfoCircle" size={15} />Your provider manages this booking{released ? '' : " — they'll release your result when it's ready"}.</div>
      </div>
    );
  }
  return (
    <>
      <DetailCard why={7} head={<div className="dcard-head"><div className="exam-ava">ML</div><div className="exam-id"><div className="exam-title">Maths Level 1</div><div className="exam-board">TQUK | Automated Invigilation</div></div></div>}>
        <DRow icon="CalendarMonth" label="Exam Date:" value="15/03/2026" />
        <DRow icon="Clock" label="Exam Time:" value="2:00pm" />
        <DRow icon="ArrowRightToBracket" label="Join exam:" value="Opens at 2:00pm on exam day" action={<Btn variant="primary" size="sm" iconRight="ArrowRight">Join exam</Btn>} />
        <DRow icon="Book" label="Course:" value="Available" action={<Btn variant="secondary" size="sm" iconRight="ArrowRight">Login to course</Btn>} />
        <DRow icon="Award" label="Result:" value={released ? <Badge variant="released" icon="CheckCircle">Pass</Badge> : <Badge variant="withheld" icon="Hourglass">Pending</Badge>} />
      </DetailCard>
      <div className="note"><Ico name="InfoCircle" size={15} />Booking and results are managed by your provider.</div>
    </>
  );
}

window.ProtoParts2 = { Assign, ProviderDetail, StudentDetail, SelfDetail, SetupStepper };
