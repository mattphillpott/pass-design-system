// Shared PLP data & helpers ── used by both PLP variations.

const PLP_TOPICS = [
  { n: '1.1',  area: 'Reading', title: 'Audience',                              test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 22 },
  { n: '1.2',  area: 'Reading', title: 'Connecting Texts',                      test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 18 },
  { n: '1.3',  area: 'Reading', title: 'Context',                               test: null, practice: 47,   pass: 60, status: 'inprogress', date: null,                est: 25 },
  { n: '1.4',  area: 'Reading', title: 'Detail and Navigating Sources',         test: null, practice: 40,   pass: 60, status: 'inprogress', date: null,                est: 28 },
  { n: '1.5',  area: 'Reading', title: 'Fact or Opinion',                       test: null, practice: 70,   pass: 60, status: 'done',       date: 'Tue 25 Apr 2023 22:00', est: 20 },
  { n: '1.6',  area: 'Reading', title: 'Formality and Bias',                    test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 22 },
  { n: '1.7',  area: 'Reading', title: 'Formatting, Organisational and Language Features', test: null, practice: null, pass: 60, status: 'incomplete', date: null, est: 30 },
  { n: '1.8',  area: 'Reading', title: 'Grammar',                               test: 95,   practice: 65,   pass: 60, status: 'inprogress', date: null,                est: 18 },
  { n: '1.9',  area: 'Reading', title: 'Language Features',                     test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 22 },
  { n: '1.10', area: 'Reading', title: 'Organisational Features',               test: null, practice: 55,   pass: 60, status: 'done',       date: 'Mon 23 Oct 2023 19:43', est: 15 },
  { n: '1.11', area: 'Reading', title: 'Organisational Markers',                test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 18 },
  { n: '1.12', area: 'Reading', title: 'Point of View and Line of Argument',    test: null, practice: null, pass: 60, status: 'inprogress', date: null,                est: 30 },
  { n: '2.1',  area: 'Writing', title: 'Sentence Structure',                    test: 78,   practice: 72,   pass: 60, status: 'done',       date: 'Fri 12 Apr 2024 14:10', est: 25 },
  { n: '2.2',  area: 'Writing', title: 'Punctuation',                           test: 55,   practice: 50,   pass: 60, status: 'inprogress', date: null,                est: 28 },
  { n: '2.3',  area: 'Writing', title: 'Spelling',                              test: null, practice: null, pass: 60, status: 'incomplete', date: null,                est: 20 },
];

const STATUS_META = {
  inprogress: { label: 'Needs work',  fg: '#9A3412', bg: '#FFF7ED', border: '#FED7AA', dot: '#D97706', order: 0 },
  incomplete: { label: 'Not started', fg: '#4A5565', bg: '#F9FAFB', border: '#E5E7EB', dot: '#98A2B3', order: 1 },
  done:       { label: 'Got it',      fg: '#0F8610', bg: '#F0FEEF', border: '#B8FBB7', dot: '#0FBC0F', order: 2 },
};

function plpBuckets(topics = PLP_TOPICS) {
  const order = ['inprogress', 'incomplete', 'done'];
  const groups = order.map(k => ({ key: k, ...STATUS_META[k], topics: topics.filter(t => t.status === k) }));
  const counts = {
    inprogress: topics.filter(t => t.status === 'inprogress').length,
    incomplete: topics.filter(t => t.status === 'incomplete').length,
    done:       topics.filter(t => t.status === 'done').length,
    total:      topics.length,
  };
  return { groups, counts };
}

function ScorePill({ value, pass }) {
  if (value == null) return <span style={{color: '#98A2B3', fontSize: 13}}>—</span>;
  const passed = value >= pass;
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 700, color: passed ? '#0F8610' : '#9B1C1C', padding: '2px 8px', borderRadius: 999, background: passed ? '#F0FEEF' : '#FDF2F2', border: '1px solid ' + (passed ? '#B8FBB7' : '#FBD5D5')}}>
      {value}%
    </span>
  );
}

function StatusChip({ status }) {
  const m = STATUS_META[status];
  return (
    <span style={{display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11, fontWeight: 700, color: m.fg, background: m.bg, border: '1px solid ' + m.border, padding: '4px 10px', borderRadius: 999, textTransform: 'uppercase', letterSpacing: '0.04em'}}>
      <span style={{width: 6, height: 6, borderRadius: '50%', background: m.dot}}/>
      {m.label}
    </span>
  );
}

window.PLP_TOPICS  = PLP_TOPICS;
window.STATUS_META = STATUS_META;
window.plpBuckets  = plpBuckets;
window.ScorePill   = ScorePill;
window.StatusChip  = StatusChip;
