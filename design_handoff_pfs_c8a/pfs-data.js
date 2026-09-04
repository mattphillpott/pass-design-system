window.PFS = (function(){
const packages = [
  { id:'exam', name:'Just the exam', tag:null,
    blurb:'The Ofqual-regulated exam plus the £119.99 exam pack. No course, no resit.',
    for:'For people who already know the material and just need the certificate.',
    now:157.60, was:197.00,
    includes:['The Level 2 Maths exam, sat at home','Exam pack — workbook, past papers, formula sheets','Certificate on pass, accepted by UK universities and employers'] },
  { id:'course', name:'Exam + course', tag:null,
    blurb:'3 months of course access, tutor-marked assignments and practice papers.',
    for:'For people who need a refresher but are confident they will get there.',
    now:341.60, was:427.00,
    includes:['Everything in Just the exam','3 months of course access — video lessons, topic tests','Email tutor support and marked assignments','One 1-to-1 tutorial with a qualified tutor'] },
  { id:'premium', name:'Exam + course + free resit', tag:'93% of these learners pass',
    blurb:'12 months of access, everything above, and a second exam free if you do not pass.',
    for:'For people who cannot afford to fail, or have failed maths before.',
    now:441.60, was:552.00, recommended:true,
    includes:['Everything in Exam + course','12 months of access instead of 3','A free resit if you do not pass first time','Tailored learning plan and unlimited assignment marking'] }
];

const dates = [
  { id:'later', label:'Decide later', sub:'Book today, choose your date any time in the next 12 months.', add:0, note:'included' },
  { id:'d29',   label:'Sat 29 August', sub:'Remote invigilation · results by 5 September', add:82,  note:'£240 slot' },
  { id:'d27',   label:'Wed 27 August', sub:'Remote invigilation · results by 3 September', add:98,  note:'£256 slot' },
  { id:'d25',   label:'Tue 25 August', sub:'Soonest available · results by 1 September', add:114, note:'£272 slot' }
];

const fastTrack = { add:39, label:'Fast Track my result', sub:'Marked in 2 working days instead of 2–6. Needed if you have a deadline.' };

const proof = [
  { t:'93% pass rate', d:'Across 5,399 sittings of this exact exam.' },
  { t:'Sat entirely at home', d:'No exam centre, no travel. Watch the 90-second setup.' },
  { t:'Ofqual regulated', d:'Awarded by TQUK and Open Awards. GCSE grade 4/C equivalent.' },
  { t:'Results in 2–6 working days', d:'Remote invigilation. Fast Track guarantees 2 days.' },
  { t:'Free resit on the top package', d:'Do not pass, sit it again at no cost.' },
  { t:'Price-match guarantee', d:'On like-for-like Level 2 Maths exams.' }
];

const bodies = ['Ofqual regulated','TQUK','Open Awards','City & Guilds','Accepted by 140+ UK universities'];

const objections = [
  { q:'Will my university or employer accept it?', a:'It is Ofqual-regulated and sits at GCSE grade 4/C equivalence. Universities, NHS trusts and apprenticeship providers accept it in place of GCSE maths. We list 140+ institutions that have accepted ours.' },
  { q:'Can I really sit it at home?', a:'Yes. You need a laptop with a webcam and a quiet room. The session is recorded and invigilated — either live by a person, or reviewed afterwards. No exam centre, no travel.' },
  { q:'What happens if I fail?', a:'On the top package your resit is free. On the others a resit is charged at the exam-only price. 93% of people who complete the course pass first time.' },
  { q:'Can I spread the cost?', a:'Yes — Klarna, Clearpay, Payl8r and PayPal all offer instalments at checkout, from three payments upwards. There is no interest on the three-month plans.' },
  { q:'Do I need the course, or just the exam?', a:'If you were within a grade of passing GCSE maths recently, the exam alone is usually enough. If it has been years, or maths has always been the problem, take the course — the 93% pass rate is measured on people who complete it.' },
  { q:'How fast do I get my result?', a:'2–6 working days with remote invigilation, 6–16 with a live human invigilator. Fast Track guarantees the 2-day end if you are against a deadline.' }
];

const personas = [
  { id:'priya', name:'Priya, 27', role:'Nursing applicant', need:'Needs Level 2 maths before her offer deadline.', fear:'Will it arrive in time, and will the trust accept it?' },
  { id:'dan', name:'Dan, 34', role:'Career changer', need:'Failed GCSE maths twice, wants a teaching assistant role.', fear:'Am I actually capable of passing this?' },
  { id:'alisha', name:'Alisha, 19', role:'Apprentice', need:'Must pass Level 2 to complete her apprenticeship.', fear:'Paying for it herself, on a phone, on a budget.' },
  { id:'mark', name:'Mark, 49', role:'Parent', need:'Buying for his 17-year-old after a GCSE resit failure.', fear:'Is this company legitimate, or a diploma mill?' }
];

const money = n => '£' + n.toFixed(2);
return { packages, dates, fastTrack, proof, bodies, objections, personas, money };
})();
