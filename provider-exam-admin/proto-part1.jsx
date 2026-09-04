/* Provider student-exam admin — interactive prototype (key flow) */
const { useState, useEffect } = React;

const LS = 'pass_provider_proto_v1';
const load = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch (e) { return {}; } };
const save = (s) => { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} };

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "onboarding": "modal",
  "assignFormat": "wizard",
  "studentView": "summary",
  "setupStyle": "amber"
}/*EDITMODE-END*/;

const PRESETS = window.PRESETS || [];

/* ---------- onboarding ---------- */
function Onboarding({ format, onPick }) {
  const [w, setW] = useState('students');
  const opts = (
    <div className="stack" style={{ gap: 14 }}>
      <div className={'opt' + (w === 'me' ? ' is-on' : '')} onClick={() => setW('me')} data-why={format !== 'modal' ? 11 : undefined}>
        <div className="radio" /><div className="oico"><Ico name="GraduationCap" size={20} /></div>
        <div><div className="otitle">Just myself</div><div className="odesc">I'm sitting these exams. We'll skip the setup step from now on.</div></div>
      </div>
      <div className={'opt' + (w === 'students' ? ' is-on' : '')} onClick={() => setW('students')}>
        <div className="radio" /><div className="oico"><Ico name="BellActiveAlt" size={20} /></div>
        <div><div className="otitle">For my students</div><div className="odesc">I book and administer exams for others. We'll add a quick setup step per exam.</div></div>
      </div>
    </div>
  );
  if (format === 'fullscreen') {
    return (
      <Screen w="100%">
        <div style={{ maxWidth: 620, margin: '24px auto 0', textAlign: 'center' }}>
          <div className="oico" style={{ width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px' }}><Ico name="GraduationCap" size={28} /></div>
          <div style={{ font: '700 13px var(--font)', letterSpacing: '.08em', color: 'var(--green-dark)', textTransform: 'uppercase' }}>Welcome to Pass</div>
          <h1 style={{ font: '800 30px var(--font)', margin: '10px 0', color: 'var(--ink)' }} data-why={11}>Who are you booking exams for?</h1>
          <p className="muted" style={{ fontSize: 16, lineHeight: 1.55, margin: '0 0 28px' }}>This only sets a default — you can change it any time and it never restricts you.</p>
          <div style={{ textAlign: 'left' }}>{opts}</div>
          <Btn variant="primary" size="lg" iconRight="ArrowRight" block onClick={() => onPick(w)}>Continue</Btn>
          <div className="tiny" style={{ marginTop: 16, cursor: 'pointer' }} onClick={() => onPick('me')} data-why={3}>Skip — I'll decide later</div>
        </div>
      </Screen>
    );
  }
  // modal: dashboard behind + dialog
  return (
    <div style={{ position: 'relative' }}>
      <Dashboard preview />
      <div className="scrim">
        <div className="dialog" style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', top: 16, right: 16, cursor: 'pointer', color: 'var(--mute)' }} onClick={() => onPick('me')}><Ico name="Close" size={20} /></div>
          <div className="dialog-body">
            <div className="oico" style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 16 }}><Ico name="GraduationCap" size={26} /></div>
            <h2 style={{ font: '800 22px var(--font)', margin: '0 0 6px', color: 'var(--ink)' }} data-why={1}>Quick question before you start</h2>
            <p className="muted" style={{ margin: '0 0 22px', fontSize: 15, lineHeight: 1.5 }}>Are you booking exams for yourself, or for your students? It just sets a default — change it any time, and it never limits what you can do.</p>
            {opts}
            <div className="spread" style={{ marginTop: 24 }}>
              <span className="tiny" data-why={3}>Change later in Settings.</span>
              <Btn variant="primary" iconRight="ArrowRight" onClick={() => onPick(w)}>Continue</Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- dashboard / list ---------- */
function Dashboard({ preview, showBanner, onSetup, onView, assigned, onDismissBanner, onBannerPick, userType, released }) {
  const T = window.__tweaks || {};
  const isSelf = userType === 'self';
  const isStudent = userType === 'student';
  return (
    <Screen w="100%">
      <Crumbs items={[{ icon: 'Home', label: 'Home' }, { icon: 'GraduationCap', label: 'My Exams', active: true }]} />
      <PageTitle>My Exams</PageTitle>
      <div className="grid">
        {isStudent
          ? <Sidebar name="Amelia Hughes" email="amelia.hughes@email.com" initials="AH" />
          : <Sidebar />}
        <div style={preview ? { opacity: .55 } : null}>
        {showBanner && (
          <div className="banner banner--success" style={{ marginBottom: 22, alignItems: 'center' }}>
            <Ico name="InfoCircle" size={22} cls="bi" />
            <div><h4>Set how you usually book</h4><p>Are these exams for you, or for your students? Choose a default so we can tailor each setup.</p></div>
            <div className="ba row" style={{ gap: 10 }}>
              <Btn variant="secondary" size="sm" onClick={() => onBannerPick && onBannerPick('me')}>For myself</Btn>
              <Btn variant="primary" size="sm" onClick={() => onBannerPick && onBannerPick('students')}>For my students</Btn>
            </div>
          </div>
        )}
        {isStudent && (
          <div className="dep-bar" data-why={5}>
            <Ico name="ExclamationCircle" size={18} />
            <div>Reference only — <b>students no longer log in</b>. In the current model the provider does everything and the student isn't notified. Kept to show the old flow.</div>
            <span className="tag">Deprecated</span>
          </div>
        )}
        <div className="section-h">{isStudent ? 'Your Exams' : 'Active Exams'}</div>
        {!isSelf && !isStudent && <FilterBar />}
        <div className="stack">
          {isStudent ? (
            /* ---- Linked student a provider administers: read-only, provider-managed, results gated ---- */
            <>
              <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="View your exam" initials="AH"
                cta={<Btn variant="primary" size="sm" icon="Eye" onClick={onView}>View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">15/03/2026</Meta><Meta icon="Clock">2:00pm</Meta><Meta icon="Award" tone={released ? 'green' : 'amber'}>{released ? 'Result ready' : 'Result pending'}</Meta></>}
                foot={<Badge variant="neutral" icon="GraduationCap">Managed by your provider</Badge>} />
              <ExamCard title="English Level 2" board="TQUK | Automated Invigilation" next="Awaiting exam date" initials="AH"
                cta={<Btn variant="secondary" size="sm" icon="Eye" disabled>View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">No date yet</Meta><Meta icon="InfoCircle">Your provider will set the date</Meta></>}
                foot={<Badge variant="neutral" icon="GraduationCap">Managed by your provider</Badge>} />
            </>
          ) : isSelf ? (
            /* ---- 'For myself' learner: own exams only, no student labels / setup / admin badges ---- */
            <>
              <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="Choose Exam Date"
                cta={<Btn variant="primary" size="sm" icon="Eye" onClick={onView}>View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">No Exam Date</Meta><Meta icon="Book">No Course</Meta></>} />
              <ExamCard title="English Level 2" board="TQUK | Automated Invigilation" next="Sit Exam"
                cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">22/04/2026</Meta><Meta icon="Clock">2:00pm</Meta><Meta icon="Book" tone="green">View Course</Meta></>} />
            </>
          ) : (
            <>
              {!assigned ? <NeedsSetupCard style={T.setupStyle} onSetup={onSetup} />
                : <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="Choose Exam Date" studentName="Amelia Hughes"
                    cta={<Btn variant="primary" size="sm" icon="Eye" onClick={onView}>View Exam</Btn>}
                    meta={<><Meta icon="CalendarMonth">No Exam Date</Meta><Meta icon="Book">No Course</Meta></>} />}
              <ExamCard title="English Level 2" board="TQUK | Automated Invigilation" next="Choose Exam Date" studentName="Daniel Okafor"
                cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">22/04/2026</Meta><Meta icon="Clock">2:00pm</Meta><Meta icon="Book" tone="green">View Course</Meta></>} />
              <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" next="View Results" studentName="Priya Shah"
                cta={<Btn variant="primary" size="sm" icon="Eye">View Exam</Btn>}
                meta={<><Meta icon="CalendarMonth">02/03/2026</Meta><Meta icon="Award" tone={released ? 'green' : 'amber'}>{released ? 'Result ready' : 'Awaiting result'}</Meta></>} />
            </>
          )}
        </div>
      </div></div>
    </Screen>
  );
}

function FilterBar() {
  return (
    <div className="spread" style={{ marginBottom: 18, gap: 14, flexWrap: 'wrap' }} data-why={9}>
      <div style={{ position: 'relative', flex: 1, minWidth: 240 }}>
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

function NeedsSetupCard({ style, onSetup }) {
  if (style === 'subtle') {
    return (
      <div className="card exam" data-why={2}>
        <div className="exam-top">
          <div className="exam-ava">PH</div>
          <div className="exam-id">
            <div className="exam-title">Maths Level 1 <Badge variant="neutral" icon="Minus">Not set up</Badge></div>
            <div className="exam-board">TQUK | Automated Invigilation</div>
            <div className="exam-next">Next Step: Add the student's name</div>
          </div>
          <div className="exam-cta"><Btn variant="primary" size="sm" iconRight="ArrowRight" onClick={onSetup}>Set up</Btn></div>
        </div>
        <div className="exam-foot"><div className="left"><Meta icon="InfoCircle">Booking opens once setup is complete</Meta></div></div>
      </div>
    );
  }
  return (
    <ExamCard title="Maths Level 1" board="TQUK | Automated Invigilation" initials="PH" setup why={2}
      cta={<Btn variant="amber" size="sm" iconRight="ArrowRight" onClick={onSetup}>Set up exam</Btn>}
      meta={<Meta icon="ExclamationCircle" tone="amber">Add the student's name before booking</Meta>} />
  );
}

function WhoOpts({ which, set }) {
  return (
    <div className="stack" style={{ gap: 14 }}>
      <div className={'opt' + (which === 'me' ? ' is-on' : '')} onClick={() => set('me')}>
        <div className="radio" /><div className="oico"><Ico name="GraduationCap" size={20} /></div>
        <div><div className="otitle">I'll sit it myself</div><div className="odesc">This exam is for me — administer and sit it as normal.</div></div>
      </div>
      <div className={'opt' + (which === 'students' ? ' is-on' : '')} onClick={() => set('students')}>
        <div className="radio" /><div className="oico"><Ico name="BellActiveAlt" size={20} /></div>
        <div><div className="otitle">A student sits it</div><div className="odesc">I'm setting this exam up on behalf of someone else.</div></div>
      </div>
    </div>
  );
}

window.ProtoParts1 = { Onboarding, Dashboard, FilterBar, NeedsSetupCard, WhoOpts, PRESETS };
