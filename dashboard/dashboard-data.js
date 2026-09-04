// Pass Revise — Dashboard data (authed home). Framework-agnostic; ports to Vue data.
window.DASH = {
  user: { name: 'Amara' },

  // grade scales by qualification (drives the current/target selectors)
  gradeScales: {
    'GCSE':    ['9','8','7','6','5','4','3','2','1','U'],
    'A-Level': ['A*','A','B','C','D','E','U'],
    'AS-Level':['A','B','C','D','E','U'],
    'IGCSE':   ['9','8','7','6','5','4','3','2','1','U']
  },

  // seeded courses (My Courses)
  courses: [
    { id:'chem', subject:'Chemistry', board:'AQA', qual:'GCSE', spec:'8462', tone:'brand',
      current:'5', target:'7', notes:64, questions:38,
      last:{ topic:'Electrolysis', type:'Exam Questions', detail:'Question 3 of 5', pct:60 } },
    { id:'bio', subject:'Biology', board:'AQA', qual:'GCSE', spec:'8461', tone:'success',
      current:'6', target:'8', notes:81, questions:52,
      last:{ topic:'Cell biology', type:'Revision Notes', detail:'Mitosis', pct:40 } },
    { id:'maths', subject:'Mathematics', board:'Edexcel', qual:'GCSE', spec:'1MA1', tone:'accent',
      current:'4', target:'6', notes:47, questions:29,
      last:{ topic:'Quadratic equations', type:'Exam Questions', detail:'Question 1 of 8', pct:12 } },
    { id:'psych', subject:'Psychology', board:'AQA', qual:'A-Level', spec:'7182', tone:'sky',
      current:'C', target:'A', notes:33, questions:21,
      last:{ topic:'Memory', type:'Flashcards', detail:'12 of 40 cards', pct:30 } }
  ],

  // "Jump back in" — most-recent resource across courses
  continue: { courseId:'chem', subject:'Chemistry', board:'AQA', qual:'GCSE',
    topic:'Electrolysis', type:'Exam Questions', detail:'Question 3 of 5', pct:60, tone:'brand' },

  weekly: { done:4, target:5, streak:12, minutes:210 },

  // recommended next steps (derived; no mastery scoring in R1 — these are simple nudges)
  recommended: [
    { courseId:'chem',  subject:'Chemistry', tone:'brand',   type:'Exam Questions', title:'Electrolysis of solutions', reason:'Your lowest-scoring topic', access:'premium' },
    { courseId:'bio',   subject:'Biology',   tone:'success', type:'Revision Notes',  title:'Required practical: Osmosis', reason:'Not started yet', access:'free' },
    { courseId:'maths', subject:'Maths',     tone:'accent',  type:'Past Paper',      title:'2023 Paper 1 (Higher)', reason:'New past paper added', access:'free' }
  ],

  // Add Course / onboarding option lists
  quals: ['GCSE','A-Level','IGCSE','AS-Level'],
  subjectsByQual: {
    'GCSE': ['Biology','Chemistry','Physics','Combined Science','Mathematics','English Language','English Literature','Geography','History','Psychology','Business','Computer Science'],
    'A-Level': ['Biology','Chemistry','Physics','Mathematics','Psychology','Economics','Business','Geography','History','Sociology'],
    'IGCSE': ['Biology','Chemistry','Physics','Mathematics','English','Geography'],
    'AS-Level': ['Biology','Chemistry','Physics','Mathematics','Psychology','Economics']
  },
  boards: ['AQA','Edexcel','OCR','WJEC Eduqas','CIE'],

  // subject → monogram tone (for badges added via modal/wizard)
  toneFor: { Chemistry:'brand', Biology:'success', Physics:'sky', 'Combined Science':'brand',
    Mathematics:'accent', Maths:'accent', Statistics:'accent', 'English Language':'neutral',
    'English Literature':'neutral', English:'neutral', Geography:'success', History:'accent',
    Psychology:'sky', Business:'brand', Economics:'success', 'Computer Science':'sky', Sociology:'accent' },

  // What's new / coming soon — marketed to users on the dashboard
  whatsNew: [
    { id:'smartmark2', status:'new',  icon:'spark',  title:'Smart Mark 2.0',        body:'Faster marking with clearer, step-by-step feedback on every answer.',       cta:'Try it now' },
    { id:'spaced',     status:'beta', icon:'cards',  title:'Spaced-repetition cards', body:'Flashcards resurface right before you\u2019d forget them, so revision sticks.', cta:'Try the beta' },
    { id:'predicted',  status:'soon', icon:'target', title:'Predicted grades',       body:'See the grade you\u2019re on track for, based on your activity across each course.' },
    { id:'planner',    status:'soon', icon:'clock',  title:'AI study planner',       body:'Auto-build a revision timetable that works back from your real exam dates.' }
  ]
};
