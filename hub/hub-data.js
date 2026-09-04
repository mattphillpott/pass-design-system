// Pass Revise — Hub template data (Qualification → Subject → Board → Course).
// One template serves all four levels; this file supplies each level's children
// plus the single active drill-path used by the demo. Ports cleanly to Vue data.
window.HUB = {
  // the active drill path the demo walks down
  path: { qual: 'GCSE', subject: 'Chemistry', board: 'AQA', course: 'AQA GCSE Chemistry', spec: '8462' },

  // ── level 1: qualifications (children of the site root) ──
  quals: [
    { name: 'GCSE',        note: 'Ages 14–16',     subjects: 38 },
    { name: 'A-Level',     note: 'Ages 16–18',     subjects: 31 },
    { name: 'IGCSE',       note: 'International',   subjects: 24 },
    { name: 'AS-Level',    note: 'Ages 16–17',     subjects: 20 },
    { name: 'National 5',  note: 'Scotland',       subjects: 16 },
    { name: 'IB',          note: 'Diploma',        subjects: 14 }
  ],

  // ── level 2: subjects under the active qualification (GCSE) ──
  // tone drives the monogram tile colour (brand/accent/success/sky/neutral)
  subjects: [
    { name: 'Biology',            group: 'Sciences',   boards: 5, tone: 'success' },
    { name: 'Chemistry',          group: 'Sciences',   boards: 5, tone: 'brand'   },
    { name: 'Physics',            group: 'Sciences',   boards: 5, tone: 'sky'     },
    { name: 'Combined Science',   group: 'Sciences',   boards: 4, tone: 'brand'   },
    { name: 'Mathematics',        group: 'Maths',      boards: 4, tone: 'accent'  },
    { name: 'Statistics',         group: 'Maths',      boards: 3, tone: 'accent'  },
    { name: 'English Language',   group: 'English',    boards: 4, tone: 'neutral' },
    { name: 'English Literature', group: 'English',    boards: 4, tone: 'neutral' },
    { name: 'Geography',          group: 'Humanities', boards: 4, tone: 'success' },
    { name: 'History',            group: 'Humanities', boards: 4, tone: 'accent'  },
    { name: 'Psychology',         group: 'Humanities', boards: 3, tone: 'sky'     },
    { name: 'Business',           group: 'Humanities', boards: 4, tone: 'brand'   },
    { name: 'Economics',          group: 'Humanities', boards: 2, tone: 'success' },
    { name: 'Computer Science',   group: 'Sciences',   boards: 3, tone: 'sky'     },
    { name: 'Religious Studies',  group: 'Humanities', boards: 4, tone: 'neutral' },
    { name: 'Sociology',          group: 'Humanities', boards: 2, tone: 'accent'  }
  ],
  popularSubjects: ['Biology', 'Chemistry', 'Physics', 'Mathematics', 'English Literature', 'Geography'],

  // ── level 3: exam boards for the active subject (GCSE Chemistry) ──
  boards: [
    { name: 'AQA',           spec: '8462', courses: 2, note: 'Most-taught board' },
    { name: 'Edexcel',       spec: '1CH0', courses: 2, note: 'Pearson Edexcel'   },
    { name: 'OCR Gateway',   spec: 'J248', courses: 2, note: 'OCR (A)'           },
    { name: 'OCR Twenty First Century', spec: 'J258', courses: 1, note: 'OCR (B)' },
    { name: 'WJEC Eduqas',   spec: 'C420', courses: 2, note: 'England'           }
  ],

  // ── level 4 children: courses for the active board+subject (AQA GCSE Chemistry) ──
  courses: [
    { name: 'AQA GCSE Chemistry', spec: '8462', tier: 'Single science', topics: 10, notes: 92, questions: 1440, papers: 18, primary: true },
    { name: 'AQA GCSE Combined Science: Trilogy', spec: '8464', tier: 'Double award', topics: 21, notes: 168, questions: 2600, papers: 24, primary: false }
  ],

  // ── the Course-landing content (money page) ──
  resourceTypes: [
    { id: 'notes',      label: 'Revision Notes',  icon: 'book',   count: '92 notes',        access: 'Free to read',    tone: 'free' },
    { id: 'questions',  label: 'Exam Questions',  icon: 'pencil', count: '1,440 questions', access: 'Smart Mark',      tone: 'premium' },
    { id: 'papers',     label: 'Past Papers',     icon: 'doc',    count: '18 papers',       access: 'Papers free',     tone: 'free' },
    { id: 'flashcards', label: 'Flashcards',      icon: 'cards',  count: '640 cards',       access: 'Free + Premium',  tone: 'premium' },
    { id: 'mock',       label: 'Mock Exams',      icon: 'doc',    count: '6 mocks',         access: 'Premium',         tone: 'premium' },
    { id: 'resources',  label: 'Course resources',icon: 'folder', count: 'Spec & guides',   access: 'Free',            tone: 'free' }
  ],

  // top spec topics (indexable internal links) — mirrors the exam-question tree
  topics: [
    { n: 1,  name: 'Atomic structure & the periodic table', q: 73 },
    { n: 2,  name: 'Bonding, structure & the properties of matter', q: 80 },
    { n: 3,  name: 'Quantitative chemistry', q: 73 },
    { n: 4,  name: 'Chemical changes', q: 82 },
    { n: 5,  name: 'Energy changes', q: 35 },
    { n: 6,  name: 'The rate & extent of chemical change', q: 46 },
    { n: 7,  name: 'Organic chemistry', q: 42 },
    { n: 8,  name: 'Chemical analysis', q: 26 },
    { n: 9,  name: 'Chemistry of the atmosphere', q: 34 },
    { n: 10, name: 'Using resources', q: 26 }
  ],

  included: [
    { icon: 'check', title: 'Matched to the 8462 spec', body: 'Every note and question is mapped to the exact AQA specification point.' },
    { icon: 'spark', title: 'Instant Smart Mark',        body: 'Type an answer and get examiner-style marking against the mark scheme.' },
    { icon: 'doc',   title: 'Real past papers',          body: 'Full question papers with mark schemes and model solutions.' },
    { icon: 'refresh', title: 'Progress that syncs',     body: 'Pick up exactly where you left off across every device.' }
  ],

  stats: {
    qual:    [['38', 'subjects'], ['9', 'exam boards'], ['54k+', 'exam questions']],
    subject: [['5', 'exam boards'], ['10', 'topics'], ['1,440', 'exam questions']],
    board:   [['2', 'courses'], ['10', 'topics'], ['18', 'past papers']]
  }
};
