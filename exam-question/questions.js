// Pass Revise — Exam Question set (Chemistry · Electrolysis)
// Three difficulty tiers, each its own exam: questions, sub-part count and duration.
// Per-question gates are independent: contentFree (readable) vs markFree (Smart Mark free).
window.QUESTION_SET = {
  crumb: ['GCSE', 'AQA', 'Chemistry', 'Paper 1'],
  topic: 'Electrolysis',
  paper: 'Combined Science · Higher',

  tiers: {
    easy: {
      label: 'Easy', durationMin: 25,
      questions: [
        { id:'e1', n:1, marks:1, parts:1, type:'State', contentFree:true, markFree:true,
          stem:'State what is meant by the term <em>electrolysis</em>.',
          placeholder:'Your answer…',
          model:'Electrolysis is the breaking down (decomposition) of an ionic compound into its elements using electricity.',
          scheme:['Decomposition of a compound using an electric current'] },
        { id:'e2', n:2, marks:2, parts:2, type:'Name', contentFree:true, markFree:true,
          stem:'Name the electrode that is <strong>positive</strong> and the electrode that is <strong>negative</strong> in an electrolysis cell.',
          placeholder:'Positive electrode: …   Negative electrode: …',
          model:'The anode is the positive electrode; the cathode is the negative electrode.',
          scheme:['Anode is positive','Cathode is negative'] },
        { id:'e3', n:3, marks:1, parts:1, type:'State', contentFree:true, markFree:false,
          stem:'State what is meant by the term <em>electrolyte</em>.',
          placeholder:'Your answer…',
          model:'An electrolyte is a molten or dissolved ionic compound that conducts electricity.',
          scheme:['A molten or dissolved ionic compound that conducts electricity'] },
        { id:'e4', n:4, marks:1, parts:1, type:'State', contentFree:true, markFree:false,
          stem:'During electrolysis, to which electrode do the positive ions (cations) move?',
          placeholder:'Your answer…',
          model:'They move to the negative electrode — the cathode.',
          scheme:['The (negative) cathode'] },
        { id:'e5', n:5, marks:2, parts:2, type:'Explain', contentFree:true, markFree:false,
          stem:'At the cathode, do positive ions gain or lose electrons? Name this type of reaction.',
          placeholder:'Your answer…',
          model:'They gain electrons. This is reduction.',
          scheme:['Ions gain electrons','This is reduction'] },
        { id:'e6', n:6, marks:1, parts:1, type:'State', contentFree:true, markFree:true,
          stem:'Give one industrial use of electrolysis.',
          placeholder:'Your answer…',
          model:'For example: extracting aluminium, electroplating, or purifying copper.',
          scheme:['Any valid use, e.g. extracting aluminium / electroplating / purifying copper'] }
      ]
    },

    medium: {
      label: 'Medium', durationMin: 45,
      questions: [
        { id:'qm', n:1, marks:11, parts:5, type:'Structured', contentFree:true, markFree:false,
          stem:'This question is about the electrolysis of lead(II) bromide and of aqueous solutions.',
          items:[
            {kind:'mcq', marks:1, prompt:'Which electrode is the <strong>cathode</strong>?', options:[{k:'A',t:'The positive electrode'},{k:'B',t:'The negative electrode'},{k:'C',t:'The electrode where oxidation happens'},{k:'D',t:'Always the carbon electrode'}], correct:'B', explain:'The cathode is the negative electrode; positive ions (cations) are attracted to it.'},
            {kind:'multi', marks:2, prompt:'When <strong>aqueous sodium chloride</strong> is electrolysed, which products can form at the <strong>anode</strong>? Select all that apply.', options:[{k:'A',t:'Chlorine'},{k:'B',t:'Hydrogen'},{k:'C',t:'Oxygen'},{k:'D',t:'Sodium metal'}], correct:['A','C'], explain:'Chlorine forms from the concentrated Cl⁻ ions; a little oxygen also forms from OH⁻. Hydrogen forms at the cathode, and sodium stays in solution.'},
            {kind:'numeric', marks:2, prompt:'A current of $0.50$ A flows for $20$ minutes. Calculate the charge that passes, in coulombs. (charge = current × time)', answer:600, tol:1, unit:'C', explain:'Convert 20 minutes to 1200 seconds, then charge = 0.50 × 1200.', model:'Q = I t = 0.50 × 1200 = 600 C'},
            {kind:'short', marks:2, prompt:'State what is meant by the term <em>electrolyte</em>.', scheme:['A compound that is molten or dissolved in water','Conducts electricity because its ions are free to move'], model:'An electrolyte is a molten or dissolved ionic compound that conducts electricity because its ions can move.'},
            {kind:'extended', marks:4, prompt:'Explain why the reaction at the cathode during the electrolysis of molten lead(II) bromide is described as <strong>reduction</strong>. Refer to electrons in your answer.', scheme:['Correct half-equation: Pb²⁺ + 2e⁻ → Pb','States that electrons are gained','Defines reduction as the gain of electrons (OIL RIG)','Clear, correct use of terminology throughout'], model:'At the cathode Pb²⁺ + 2e⁻ → Pb. The lead ions gain electrons, and reduction is the gain of electrons (OIL RIG).'}
          ] },
        { id:'q1', n:1, marks:2, parts:1, type:'State', contentFree:true, markFree:true,
          stem:'Name the products formed at the electrodes when molten lead(II) bromide, $PbBr_2$, is electrolysed.',
          placeholder:'e.g. lead forms at the …, bromine forms at the …',
          model:'Lead (Pb) forms at the cathode; bromine (Br₂) forms at the anode.',
          scheme:['Lead (Pb) at the negative cathode','Bromine (Br₂) at the positive anode'] },
        { id:'q2', n:2, marks:4, parts:2, type:'Explain', contentFree:true, markFree:false,
          stem:'Write the half-equation for the reaction at the cathode during the electrolysis of molten $PbBr_2$, and explain why this reaction is described as reduction.',
          placeholder:'Write your half-equation and explanation…',
          model:'At the cathode: $Pb^{2+} + 2e^- \\rightarrow Pb$. This is reduction because the lead ions gain electrons (OIL RIG — Reduction Is Gain of electrons).',
          scheme:['Correct species and product: Pb²⁺ … → Pb','Balanced number of electrons (2e⁻)','States that electrons are gained','Links gain of electrons to reduction (OIL RIG)'] },
        { id:'q3', n:3, marks:3, parts:1, type:'Calculate', contentFree:true, markFree:false,
          stem:'During electrolysis a current of $0.50\\ \\text{A}$ flows for $20$ minutes. Calculate the charge, in coulombs, that passes. Use $Q = I\\,t$.',
          placeholder:'Show your working…',
          model:'$Q = I t = 0.50 \\times (20 \\times 60) = 0.50 \\times 1200 = 600\\ \\text{C}$',
          scheme:['Converts time to seconds (20 × 60 = 1200 s)','Correct substitution: Q = 0.50 × 1200','Answer = 600 C, with unit'] },
        { id:'q4', n:4, marks:6, parts:2, type:'Extended', contentFree:false, markFree:false,
          stem:'Compare the electrolysis of molten lead(II) bromide with the electrolysis of aqueous copper(II) sulfate solution. Refer to the products formed at each electrode and explain the differences.',
          placeholder:'Write your extended response…',
          model:'Molten PbBr₂ contains only Pb²⁺ and Br⁻ ions, so lead forms at the cathode and bromine at the anode. In aqueous CuSO₄ the water also provides H⁺ and OH⁻ ions: copper (less reactive than hydrogen) is deposited at the cathode, while oxygen is released at the anode because the sulfate ion stays in solution.',
          scheme:['Molten PbBr₂: Pb at cathode','Molten PbBr₂: Br₂ at anode','Aqueous CuSO₄: Cu at cathode (less reactive than H)','Aqueous CuSO₄: O₂ at anode','Explains role of water / competing ions','Clear comparative structure'] },
        { id:'q5', n:5, marks:2, parts:1, type:'State', contentFree:true, markFree:false,
          stem:'Explain why an ionic compound must be molten or dissolved in water before it can be electrolysed.',
          placeholder:'Your answer…',
          model:'When molten or dissolved, the ions are free to move. The mobile ions can then carry charge to the electrodes, allowing the compound to conduct and be electrolysed.',
          scheme:['Ions become free to move','Mobile ions carry charge / current to electrodes'] }
      ]
    },

    hard: {
      label: 'Hard', durationMin: 75,
      questions: [
        { id:'h1', n:1, marks:4, parts:2, type:'Half-equations', contentFree:true, markFree:false,
          stem:'Write the half-equations for the reactions at <strong>(a)</strong> the cathode and <strong>(b)</strong> the anode during the electrolysis of molten $PbBr_2$.',
          placeholder:'(a) cathode: …   (b) anode: …',
          model:'(a) Cathode: $Pb^{2+} + 2e^- \\rightarrow Pb$.  (b) Anode: $2Br^- \\rightarrow Br_2 + 2e^-$.',
          scheme:['Cathode species correct: Pb²⁺ → Pb','Cathode electrons balanced (2e⁻)','Anode species correct: Br⁻ → Br₂','Anode electrons balanced (2Br⁻ → Br₂ + 2e⁻)'] },
        { id:'h2', n:2, marks:4, parts:3, type:'Calculate', contentFree:true, markFree:false,
          stem:'A current of $2.0\\ \\text{A}$ passes through molten $PbBr_2$ for $30$ minutes. <strong>(a)</strong> Calculate the charge passed. <strong>(b)</strong> Given $96500\\ \\text{C}$ carries $1$ mol of electrons, find the moles of electrons. <strong>(c)</strong> Hence calculate the mass of lead deposited. ($A_r\\,(Pb) = 207$.)',
          placeholder:'Show your working for (a), (b) and (c)…',
          model:'(a) $Q = It = 2.0 \\times 1800 = 3600\\ \\text{C}$. (b) moles e⁻ $= 3600 / 96500 = 0.0373\\ \\text{mol}$. (c) $Pb^{2+} + 2e^- \\rightarrow Pb$, so mol Pb $= 0.0373/2 = 0.0187$; mass $= 0.0187 \\times 207 \\approx 3.9\\ \\text{g}$.',
          scheme:['Charge Q = 3600 C','Moles of electrons = 0.0373 mol','Divides by 2 (2e⁻ per Pb)','Mass ≈ 3.9 g'] },
        { id:'h3', n:3, marks:6, parts:3, type:'Explain', contentFree:false, markFree:false,
          stem:'Explain the products formed at each electrode when <strong>concentrated</strong> aqueous copper(II) chloride is electrolysed, and explain why they differ from those formed using a <strong>dilute</strong> solution.',
          placeholder:'Write your extended response…',
          model:'Concentrated CuCl₂: copper at the cathode (less reactive than H); chlorine at the anode because the high concentration of Cl⁻ ions is preferentially discharged. Dilute CuCl₂: copper still at the cathode, but oxygen forms at the anode because with few Cl⁻ ions the OH⁻ from water is discharged instead.',
          scheme:['Cathode: copper deposited (both cases)','Concentrated anode: chlorine','Dilute anode: oxygen','Concentration of Cl⁻ affects anode product','Role of water / OH⁻ ions','Clear, structured explanation'] },
        { id:'h4', n:4, marks:6, parts:4, type:'Evaluate', contentFree:false, markFree:false,
          stem:'Evaluate the use of electrolysis, rather than reduction with carbon, for extracting aluminium from its ore. Refer to reactivity, cost and energy in your answer.',
          placeholder:'Write your evaluation…',
          model:'Aluminium is more reactive than carbon, so it cannot be reduced by carbon and must be extracted by electrolysis of molten aluminium oxide. Electrolysis needs very high temperatures and large amounts of electricity, making it expensive and energy-intensive, but it is the only viable method for such a reactive metal. A balanced conclusion weighs the necessity against the high energy cost.',
          scheme:['Al more reactive than carbon','Cannot be reduced by carbon → electrolysis required','Electrolysis is energy-intensive / high temperature','High electricity cost','Considers necessity vs cost','Reaches a justified conclusion'] }
      ]
    }
  }
};

// Revision cards (flashcards) for the active concept. free:true = preview; the rest are Premium.
window.FLASHCARDS = [
  { front:'What is <strong>electrolysis</strong>?', back:'The breaking down of an ionic compound (the electrolyte) into its elements using electricity.', free:true },
  { front:'The <strong>cathode</strong> — what charge is it, and which ions move to it?', back:'The negative electrode. Positive ions (cations) are attracted to it.', free:true },
  { front:'The <strong>anode</strong> — what charge is it, and which ions move to it?', back:'The positive electrode. Negative ions (anions) are attracted to it.', free:true },
  { front:'What does <strong>OIL RIG</strong> stand for?', back:'Oxidation Is Loss, Reduction Is Gain — of electrons.', free:true },
  { front:'Cathode half-equation for molten $PbBr_2$', back:'$Pb^{2+} + 2e^- \\rightarrow Pb$', free:false },
  { front:'Anode half-equation for molten $PbBr_2$', back:'$2Br^- \\rightarrow Br_2 + 2e^-$', free:false },
  { front:'Why must an ionic compound be <strong>molten or dissolved</strong> to be electrolysed?', back:'So the ions are free to move and can carry charge to the electrodes.', free:false },
  { front:'In an <strong>aqueous</strong> solution, what is usually produced at the cathode?', back:'Hydrogen — unless the metal is less reactive than hydrogen, in which case the metal is deposited.', free:false }
];

// Revision note for the active concept. free:true sections preview; the rest are the paywall.
window.NOTE = {
  readMins: 6,
  sections: [
    { id:'intro', title:'What is electrolysis?', free:true, blocks:[
      {t:'p', x:'Electrolysis is the process of using an electric current to break down an ionic compound into its elements. The compound that is broken down is called the <strong>electrolyte</strong>.'},
      {t:'p', x:'For a substance to be electrolysed its ions must be free to move, so the electrolyte must be either <strong>molten</strong> or <strong>dissolved in water</strong>.'},
      {t:'img', label:'Electrolysis cell', alt:'Diagram of an electrolysis cell: a beaker of electrolyte with a negative cathode and a positive anode connected to a DC power supply.', cap:'A simple electrolysis cell — ions move to the oppositely charged electrode.'},
      {t:'tip', x:'The electrolyte must be <strong>molten or dissolved in water</strong> — a solid ionic compound will not conduct, because its ions are locked in place.'},
      {t:'key', x:'Electrolysis only works when the ions are mobile — the compound must be molten or in solution so the ions can carry charge to the electrodes.'}
    ]},
    { id:'electrodes', title:'The electrodes', free:true, blocks:[
      {t:'p', x:'Two electrodes are placed in the electrolyte and connected to a power supply. The <strong>cathode</strong> is the negative electrode and the <strong>anode</strong> is the positive electrode.'},
      {t:'h', x:'Which ion goes where?'},
      {t:'p', x:'Positive ions (cations) are attracted to the cathode; negative ions (anions) are attracted to the anode — opposite charges attract.'},
      {t:'video', title:'Electrode reactions explained', dur:'4:12'},
      {t:'link', title:'Electrolysis — key definitions (PDF)', desc:'One-page glossary: anode, cathode, cations and anions.'},
      {t:'key', x:'Cathode = negative, attracts cations. Anode = positive, attracts anions.'}
    ]},
    { id:'molten', title:'Electrolysis of molten compounds', free:false, blocks:[
      {t:'p', x:'When a molten ionic compound is electrolysed, the <strong>metal</strong> forms at the cathode and the <strong>non-metal</strong> forms at the anode.'},
      {t:'p', x:'For molten lead(II) bromide, $PbBr_2$, the half-equations are:'},
      {t:'eq', x:'Pb^{2+} + 2e^- \\rightarrow Pb'},
      {t:'eq', x:'2Br^- \\rightarrow Br_2 + 2e^-'},
      {t:'tip', x:'In a molten compound there is <strong>no water</strong>, so the products are simply the metal (at the cathode) and the non-metal (at the anode).'},
      {t:'ex', q:'Predict the products of electrolysing molten zinc chloride, $ZnCl_2$.', a:'Zinc metal forms at the cathode; chlorine gas forms at the anode.'}
    ]},
    { id:'aqueous', title:'Electrolysis of aqueous solutions', free:false, blocks:[
      {t:'p', x:'In solution, water also provides $H^+$ and $OH^-$ ions, so there is competition at each electrode.'},
      {t:'key', x:'At the cathode, hydrogen forms unless the metal is less reactive than hydrogen. At the anode, oxygen forms unless a halide (Cl⁻, Br⁻, I⁻) is present — then the halogen forms.'},
      {t:'p', x:'For example, electrolysing copper(II) sulfate solution gives copper at the cathode and oxygen at the anode.'}
    ]},
    { id:'practical', title:'Required practical', free:false, blocks:[
      {t:'p', x:'You should be able to investigate the products of electrolysing aqueous solutions using inert electrodes.'},
      {t:'p', x:'Test the gases: a lit splint gives a squeaky pop for hydrogen; a glowing splint relights in oxygen; damp litmus paper is bleached white by chlorine.'}
    ]}
  ]
};

// Past papers library. Question papers are free; mark schemes & model solutions are Premium.
window.PAPERS = {
  groups: [
    { year:'2024', session:'June series', papers:[
      { no:1, tier:'Higher',     marks:100, mins:105 },
      { no:1, tier:'Foundation', marks:100, mins:105 },
      { no:2, tier:'Higher',     marks:100, mins:105 },
      { no:2, tier:'Foundation', marks:100, mins:105 }
    ]},
    { year:'2023', session:'June series', papers:[
      { no:1, tier:'Higher',     marks:100, mins:105 },
      { no:1, tier:'Foundation', marks:100, mins:105 },
      { no:2, tier:'Higher',     marks:100, mins:105 },
      { no:2, tier:'Foundation', marks:100, mins:105 }
    ]},
    { year:'2022', session:'June series', papers:[
      { no:1, tier:'Higher',     marks:100, mins:105 },
      { no:1, tier:'Foundation', marks:100, mins:105 },
      { no:2, tier:'Higher',     marks:100, mins:105 },
      { no:2, tier:'Foundation', marks:100, mins:105 }
    ]},
    { year:'2021', session:'November resit', papers:[
      { no:1, tier:'Higher',     marks:100, mins:105 },
      { no:2, tier:'Higher',     marks:100, mins:105 }
    ]},
    { year:'Specimen', session:'Sample assessment material', papers:[
      { no:1, tier:'Higher',     marks:100, mins:105 },
      { no:1, tier:'Foundation', marks:100, mins:105 },
      { no:2, tier:'Higher',     marks:100, mins:105 },
      { no:2, tier:'Foundation', marks:100, mins:105 }
    ]}
  ]
};
