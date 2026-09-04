// CourseSidebar — shared course-nav rail for the redesigned dashboard.
// Replaces the dense Flowbite-tree look with a warmer, friendlier list.

const COURSE_OUTLINE = [
  { n: 'PLP', title: 'Personal Learning Plan', state: 'inprogress', meta: '0/1' },
  { n: 'SKA', title: 'Subject Knowledge Assessment', state: 'done', meta: '1/1' },
  { n: '1', title: 'Reading', state: 'inprogress', meta: '6 / 10', topics: [
      { n: '1.1', title: 'Purpose', state: 'done' },
      { n: '1.2', title: 'Text Type', state: 'inprogress' },
      { n: '1.3', title: 'Organisational Features', state: 'inprogress' },
      { n: '1.4', title: 'Language Features', state: 'todo' },
      { n: '1.5', title: 'Detail and Navigating Sources', state: 'done' },
      { n: '1.6', title: 'Fact or Opinion', state: 'done' },
      { n: '1.7', title: 'Formality and Bias', state: 'inprogress' },
      { n: '1.8', title: 'Persuasive use of language', state: 'todo' },
      { n: '1.9', title: 'Style, Tone and Voice', state: 'todo' },
      { n: '1.10', title: 'Comparing Texts', state: 'todo' },
  ]},
  { n: '2', title: 'Listening', state: 'todo', meta: '0 / 5' },
  { n: '3', title: 'Speaking, Listening and Communicating', state: 'inprogress', meta: '2 / 5' },
  { n: '4', title: 'Full Mock Exams', state: 'todo', meta: '0 / 4' },
  { n: '5', title: 'Past Papers', state: 'todo', meta: '0 / 6' },
  { n: '6', title: 'Exam Help', state: 'todo', meta: '—' },
  { n: '7', title: 'Extra Revision', state: 'todo', meta: '—' },
];

function StateDot({ state }) {
  if (state === 'done') return <div style={{width: 22, height: 22, borderRadius: '50%', background: '#0FBC0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0}}>✓</div>;
  if (state === 'inprogress') return <div style={{width: 22, height: 22, borderRadius: '50%', border: '2px solid #0FBC0F', background: '#F0FEEF', flexShrink: 0, position: 'relative'}}><div style={{position: 'absolute', inset: 4, borderRadius: '50%', background: '#0FBC0F'}}/></div>;
  return <div style={{width: 22, height: 22, borderRadius: '50%', border: '2px solid #E5E7EB', background: '#fff', flexShrink: 0}}/>;
}

function CourseSidebar({ activeId = '1', onPick, density = 'cosy' }) {
  const [open, setOpen] = React.useState({ '1': true });
  const pad = density === 'compact' ? '8px 12px' : '12px 14px';
  const gap = density === 'compact' ? 4 : 6;

  return (
    <aside style={{width: 320, flexShrink: 0, background: '#fff', borderRight: '1px solid #E5E7EB', overflowY: 'auto', display: 'flex', flexDirection: 'column'}}>
      <div style={{padding: '20px 20px 14px', borderBottom: '1px solid #F3F4F6'}}>
        <div style={{fontSize: 11, fontWeight: 700, color: '#6A7282', letterSpacing: '0.06em', textTransform: 'uppercase'}}>Course navigation</div>
        <div style={{fontSize: 16, fontWeight: 700, color: '#101828', marginTop: 4}}>Functional Skills English L2</div>
        <div style={{display: 'flex', gap: 8, marginTop: 12}}>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#0F8610', background: '#F0FEEF', padding: '4px 8px', borderRadius: 999}}>● Revision</span>
          <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 600, color: '#0F8610', background: '#F0FEEF', padding: '4px 8px', borderRadius: 999}}>● Practice Papers</span>
        </div>
      </div>

      <div style={{padding: '12px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap}}>
        {COURSE_OUTLINE.map(unit => {
          const isOpen = open[unit.n];
          const isActive = unit.n === activeId;
          return (
            <div key={unit.n}>
              <button onClick={() => { setOpen(o => ({...o, [unit.n]: !o[unit.n]})); onPick && onPick(unit.n); }} style={{
                width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12,
                padding: pad, border: 0, background: isActive ? '#F0FEEF' : 'transparent', borderRadius: 10, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <StateDot state={unit.state}/>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 13, fontWeight: 600, color: isActive ? '#0F8610' : '#101828', display: 'flex', alignItems: 'center', gap: 6}}>
                    <span style={{color: '#98A2B3', fontWeight: 500}}>{unit.n}.</span> {unit.title}
                  </div>
                  <div style={{fontSize: 11, color: '#6A7282', marginTop: 2}}>{unit.meta} {unit.state === 'inprogress' && <span style={{color: '#0F8610', fontWeight: 600}}>· in progress</span>}</div>
                </div>
                {unit.topics && <div style={{color: '#98A2B3', fontSize: 12, transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform .15s'}}>▶</div>}
              </button>
              {unit.topics && isOpen && (
                <div style={{marginLeft: 32, paddingLeft: 12, borderLeft: '1px dashed #E5E7EB', marginTop: 2, display: 'flex', flexDirection: 'column', gap: 2}}>
                  {unit.topics.map(t => (
                    <div key={t.n} style={{display: 'flex', alignItems: 'center', gap: 10, padding: density === 'compact' ? '4px 8px' : '6px 8px', borderRadius: 6, fontSize: 12, color: '#344054'}}>
                      <span style={{width: 14, height: 14, borderRadius: '50%', background: t.state === 'done' ? '#0FBC0F' : t.state === 'inprogress' ? '#FED7AA' : '#E5E7EB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 9, fontWeight: 700}}>{t.state === 'done' ? '✓' : ''}</span>
                      <span style={{color: '#98A2B3', fontWeight: 500}}>{t.n}</span>
                      <span style={{flex: 1, color: t.state === 'done' ? '#6A7282' : '#101828'}}>{t.title}</span>
                      {t.state === 'inprogress' && <span style={{fontSize: 10, fontWeight: 600, color: '#9A3412', background: '#FFF7ED', padding: '1px 6px', borderRadius: 999}}>active</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
}

window.CourseSidebar = CourseSidebar;
window.COURSE_OUTLINE = COURSE_OUTLINE;
