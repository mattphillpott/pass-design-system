// Pass Revise — Exam Question screen logic (framework-agnostic vanilla JS).
// State-driven render; ports cleanly to a Vue SFC (state → data, render → template).
(function () {
  'use strict';
  var SET = window.QUESTION_SET;

  // app navigation model (content types + topics + subjects)
  var NAV = {
    course: { board:'AQA', qual:'GCSE', subject:'Chemistry' },
    contentTypes: [
      { id:'resources',  label:'Course resources', icon:'folder', group:'Course' },
      { id:'notes',      label:'Revision Notes',  icon:'book',   group:'Revision' },
      { id:'flashcards', label:'Flashcards',      icon:'cards',  group:'Revision' },
      { id:'questions',  label:'Exam Questions',  icon:'pencil', group:'Exam practice' },
      { id:'papers',     label:'Past Papers',     icon:'doc',    group:'Exam practice' },
      { id:'mock',       label:'Mock Exams',      icon:'doc',    group:'Exam practice' }
    ],
    subjects: ['Biology','Chemistry','Physics','Maths','Combined Science','Geography','Psychology','Business'],
    // topics → concepts (the left-hand navigation tree)
    topics: [
      { n:1, name:'Atomic structure & the periodic table', concepts:[
        {name:'Atoms, elements & compounds',q:24},{name:'The periodic table',q:31},{name:'Development of the atomic model',q:18}] },
      { n:2, name:'Bonding, structure & properties', concepts:[
        {name:'Ionic bonding',q:22},{name:'Covalent bonding',q:28},{name:'Metallic bonding',q:14},{name:'States of matter',q:16}] },
      { n:3, name:'Quantitative chemistry', concepts:[
        {name:'Conservation of mass',q:19},{name:'Moles & masses',q:33},{name:'Concentration of solutions',q:21}] },
      { n:4, name:'Chemical changes', concepts:[
        {name:'Reactivity of metals',q:26},{name:'Reactions of acids',q:34},{name:'Electrolysis',q:22}] },
      { n:5, name:'Energy changes', concepts:[
        {name:'Exothermic & endothermic reactions',q:20},{name:'Cells & fuel cells',q:15}] },
      { n:6, name:'The rate & extent of chemical change', concepts:[
        {name:'Rate of reaction',q:29},{name:'Reversible reactions & equilibrium',q:17}] },
      { n:7, name:'Organic chemistry', concepts:[
        {name:'Crude oil & hydrocarbons',q:23},{name:'Alkenes & alcohols',q:19}] },
      { n:8, name:'Chemical analysis', concepts:[
        {name:'Purity & formulations',q:14},{name:'Chromatography',q:12}] },
      { n:9, name:'Chemistry of the atmosphere', concepts:[
        {name:'The Earth’s atmosphere',q:16},{name:'Greenhouse gases & climate change',q:18}] },
      { n:10, name:'Using resources', concepts:[
        {name:'Sustainable development',q:15},{name:'Life cycle assessments',q:11}] }
    ]
  };

  // ─────────────────────────── state ───────────────────────────
  var state = {
    visitor: 'guest',        // guest | free | subscriber
    confidence: 'high',      // high | low  (prototype: Smart Mark certainty)
    device: 'desktop',       // desktop | mobile
    tier: 'medium',          // easy | medium | hard  (instant toggle)
    contentType: 'questions',// notes | questions | flashcards | papers
    level: 'course',         // browsing level: 'course' | 'topic' | 'concept' — the rail mirrors this
    noteOpen: {},            // notes index: topic.n -> collapsed flag (default open)
    paperTier: 'all',        // past papers filter: all | foundation | higher
    paperScores: {},         // "your score" per paper: 'no|tier' -> {score,total}
    noteDone: false,
    submitted: {},           // per-question submit flag (multi-part answering)
    attach: {},              // per-part uploaded-image filenames
    regwall: null,           // qid whose reg-wall modal is open (guest attempt)         // manual “Mark as complete” on the revision note
    topic: 'Electrolysis',   // the active concept (leaf of the topic tree)
    openMenu: null,          // null | 'browse'
    navCollapsed: false,     // desktop: hide the left topic menu
    openTopics: {},          // topic.n -> expanded in the accordion
    mobileSheet: null,       // mobile bottom-sheet: null | 'tools' | 'topics' | 'course'
    fcIdx: 0,                // flashcards: current card index
    fcFlipped: false,        // flashcards: is the current card flipped
    fcRating: {},            // flashcards: idx -> 'got' | 'again'
    qid: 'qm',               // start on the multi-part answering flagship (dual-gate hook)
    answers: {},             // qid -> text
    marks: {},               // qid -> {mode:'auto'|'self', score}
    ticks: {},               // qid -> {index:true} self-assess
    modelOpen: {},           // qid -> bool
    pending: {},             // reveal keys to animate on next paint
    exam: null               // active “sit paper online” session (see startExam)
  };
  // prefill a plausible answer on the hook question so marking is meaningful
  state.answers.q2 = 'Pb²⁺ + 2e⁻ → Pb. It is reduction because the lead ions gain electrons.';
  // expand the topic that contains the active concept
  NAV.topics.forEach(function(t){ if (t.concepts.some(function(c){return c.name===state.topic;})) state.openTopics[t.n]=true; });
  // demo completion % per concept (the active concept is computed live from marks)
  var DEMO_P = {
    'Atoms, elements & compounds':100,'The periodic table':60,'Development of the atomic model':0,
    'Ionic bonding':100,'Covalent bonding':100,'Metallic bonding':100,'States of matter':100,
    'Conservation of mass':45,'Moles & masses':0,'Concentration of solutions':0,
    'Reactivity of metals':100,'Reactions of acids':35
  };
  NAV.topics.forEach(function(t){ t.concepts.forEach(function(c){ c.p = DEMO_P[c.name] || 0; }); });

  // ── Exam Questions course index: one-line "what's inside" per concept + exam codes ──
  var BLURBS = {
    'Atoms, elements & compounds':'Atoms, Elements & Compounds, Mixtures & Separating Techniques, Filtration & Crystallisation, Chromatography',
    'The periodic table':'The Periodic Table, Development of the Table, Metals & Non-Metals, Groups 1, 7 & 0, Transition Metals',
    'Development of the atomic model':'The Atom, Sub-Atomic Particles, Isotopes, The Bohr Model, Electronic Structure',
    'Ionic bonding':'Ions, Ionic Bonding, Ionic Compounds, Properties of Ionic Compounds, Dot & Cross Diagrams',
    'Covalent bonding':'Covalent Bonds, Simple Molecules, Giant Covalent Structures, Polymers, Allotropes of Carbon',
    'Metallic bonding':'Metallic Bonding, Properties of Metals, Alloys',
    'States of matter':'States of Matter, Changes of State, State Symbols, Nanoparticles',
    'Conservation of mass':'Conservation of Mass, Balanced Equations, Relative Formula Mass, Mass Changes',
    'Moles & masses':'The Mole, Avogadro Constant, Reacting Masses, Limiting Reactants, Percentage Yield',
    'Concentration of solutions':'Concentration (g/dm³ & mol/dm³), Titration Calculations, Volumes of Gases',
    'Reactivity of metals':'Metal Oxides, The Reactivity Series, Extraction of Metals, Redox Reactions',
    'Reactions of acids':'Acids & Alkalis, The pH Scale, Neutralisation, Making Salts, Required Practical: Titrations',
    'Electrolysis':'Electrolysis, Electrolysis of Molten Compounds, Electrolysis of Aqueous Solutions, Half Equations, Required Practical',
    'Exothermic & endothermic reactions':'Exothermic & Endothermic Reactions, Reaction Profiles, Bond Energy Calculations, Required Practical',
    'Cells & fuel cells':'Cells & Batteries, Fuel Cells, Hydrogen Fuel Cells',
    'Rate of reaction':'Rate of Reaction, Collision Theory, Catalysts, Required Practical: Rates',
    'Reversible reactions & equilibrium':'Reversible Reactions, Le Chatelier’s Principle, Dynamic Equilibrium, Effect of Changing Conditions',
    'Crude oil & hydrocarbons':'Crude Oil, Alkanes, Fractional Distillation, Combustion, Cracking',
    'Alkenes & alcohols':'Alkenes, Alcohols, Carboxylic Acids, Addition Polymers, Condensation Polymers',
    'Purity & formulations':'Pure Substances, Formulations, Flame Tests, Testing for Gases & Ions',
    'Chromatography':'Chromatography, Rf Values, Required Practical: Chromatography',
    'The Earth’s atmosphere':'The Early Atmosphere, Evolution of the Atmosphere, Greenhouse Gases',
    'Greenhouse gases & climate change':'The Greenhouse Effect, Climate Change, Carbon Footprint, Atmospheric Pollutants',
    'Sustainable development':'Using the Earth’s Resources, Potable Water, Waste Water Treatment, Required Practical',
    'Life cycle assessments':'Life Cycle Assessments, Reduce/Reuse/Recycle, Corrosion, Alloys & Composites'
  };
  var EXAM_CODES = { Chemistry:'8462', Biology:'8461', Physics:'8463', 'Combined Science':'8464', Maths:'8300', Geography:'8035', Psychology:'7182', Business:'8132' };
  function examCode(){ return EXAM_CODES[NAV.course.subject] || '8462'; }
  function topicHours(t){ return Math.max(2, Math.round(topicQCount(t)/6.5)); }

  // ─────────────────────────── icons ───────────────────────────
  var I = {
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    spark: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>',
    crown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-7 5 7 4-3-1.6 11H4.6L3 8z"/></svg>',
    warn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15V4h13l-2 4 2 4H4M4 22v-7"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5A2.5 2.5 0 0 1 6.5 3z"/></svg>',
    dl: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    layers: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 2 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 17l9 5 9-5"/></svg>',
    signal: '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="14" width="4" height="7" rx="1"/><rect x="10" y="9" width="4" height="12" rx="1"/><rect x="17" y="4" width="4" height="17" rx="1"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    chev: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    cards: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    collapse: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/><path d="m14 9-2 3 2 3"/></svg>',
    folder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
    shuffle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h5v5"/><path d="M4 20 21 3"/><path d="M21 16v5h-5"/><path d="m15 15 6 6"/><path d="M4 4l5 5"/></svg>',
    tools: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a4 4 0 0 1-5.4 5.4L4 17v3h3l5.3-5.3a4 4 0 0 0 5.4-5.4l-2.3 2.3-2-2 2.3-2.3z"/></svg>',
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4"/><path d="M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.3 1 2.5h6c0-1.2.3-1.8 1-2.5A6 6 0 0 0 12 3Z"/></svg>'
  };
  var MARK_SVG = '<svg class="mk" viewBox="0 0 295 325" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M193.03,174.82l-9.48,12.3c-15.05,19.53-43.07,23.15-62.6,8.1l-62.6-48.26c-13.16-10.15-15.61-29.04-5.46-42.19,10.15-13.16,29.04-15.6,42.2-5.46l50.3,38.77L236.08,20.43C216.07,7.52,192.26,0,166.68,0H30C13.43,0,0,13.43,0,30v264.81c0,16.57,13.43,30,30,30,33.05,0,62.07-21.98,71.03-53.79l4.11-14.59h61.53c70.81,0,128.22-57.41,128.22-128.22h0c0-23.16-6.17-44.86-16.91-63.61l-84.96,110.21Z" fill="var(--color-primary)"/></svg>';

  // ─────────────────────────── helpers ───────────────────────────
  function esc(s){ return String(s).replace(/[&<>]/g, function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function activeTier(){ return SET.tiers[state.tier]; }
  function QS(){ return activeTier().questions; }
  function q(id){ return QS().find(function(x){return x.id===id;}); }
  function idx(id){ return QS().findIndex(function(x){return x.id===id;}); }
  function fmtDur(min){ if(min<60) return min+' min'; var h=Math.floor(min/60), r=min%60; return r? h+' h '+r+' min' : h+' h'; }
  function partsTotal(){ return QS().reduce(function(s,x){return s+(x.parts||1);},0); }
  function isLogged(){ return state.visitor !== 'guest'; }
  function isSub(){ return state.visitor === 'subscriber'; }
  function canSee(qq){ return qq.contentFree || isSub(); }
  function canMark(qq){ return isSub() || (qq.markFree && isLogged()); }
  function done(qq){ return !!state.marks[qq.id]; }

  // allow a small whitelist of inline formatting tags in authored content
  function safeInline(s){
    return esc(s).replace(/&lt;(\/?)(strong|em|sub|sup|b|i)&gt;/g, '<$1$2>');
  }
  // inline-math renderer: turns "$...$" segments into KaTeX (falls back to raw)
  function m(str){
    if (str == null) return '';
    var parts = String(str).split('$'), out = '';
    for (var i=0;i<parts.length;i++){
      if (i % 2 === 1){
        if (window.katex){ try { out += katex.renderToString(parts[i], {throwOnError:false}); continue; } catch(e){} }
        out += '<span class="rawmath">'+esc(parts[i])+'</span>';
      } else { out += safeInline(parts[i]); }
    }
    return out;
  }

  // ─────────────────────────── header (row 1) ───────────────────────────
  function accountHTML(){
    if (state.visitor === 'guest'){
      return '<button class="btn btn-ghost" data-act="login">Log in</button>'+
             '<button class="btn btn-primary" data-act="createfree">Get started</button>';
    }
    if (state.visitor === 'free'){
      return '<a class="btn btn-ghost dash-link" href="../dashboard/Dashboard.html">Dashboard</a>'+
             '<span class="tier free">Free</span>'+
             '<button class="btn btn-accent" data-act="subscribe">'+I.crown+'Upgrade</button>'+
             '<span class="avatar">A</span>';
    }
    return '<a class="btn btn-ghost dash-link" href="../dashboard/Dashboard.html">Dashboard</a>'+
           '<span class="tier premium">'+I.crown+'Premium</span>'+
           '<span class="avatar">A</span>';
  }
  function headerHTML(){
    return '<header class="hdr"><div class="hdr-in">'+
      '<button class="icon-btn mob-menu" data-menu="browse" aria-label="Open menu">'+I.menu+'</button>'+
      '<a class="brand" href="#">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'+
      '<nav class="mainnav">'+
        '<button class="navlink'+(state.openMenu==='browse'?' on':'')+'" data-menu="browse">Browse all courses '+I.chev+'</button>'+
      '</nav>'+
      '<label class="search"><span class="s-ic">'+I.search+'</span><input type="text" placeholder="Search topics & questions\u2026" aria-label="Search"></label>'+
      '<div class="hdr-sp"></div>'+
      '<div class="hdr-actions">'+accountHTML()+'</div>'+
    '</div></header>';
  }

  // ─────────────────────────── content-type rail (far left) ───────────────────────────
  function railGroupsHTML(){
    var groups = {}, order = ['Course','Revision','Exam practice'];
    NAV.contentTypes.forEach(function(ct){ (groups[ct.group]=groups[ct.group]||[]).push(ct); });
    return order.filter(function(g){return groups[g];}).map(function(g){
      var items = groups[g].map(function(ct){
        var on = ct.id===state.contentType;
        var soon = (ct.id==='flashcards'||ct.id==='mock');
        return '<button class="rail-item'+(on?' on':'')+(soon?' soon':'')+'" data-ct="'+ct.id+'" aria-current="'+on+'">'+I[ct.icon]+'<span>'+ct.label+'</span>'+(soon?'<em class="rail-soon">Soon</em>':'')+'</button>';
      }).join('');
      return '<div class="rail-group"><div class="rail-lbl">'+g+'</div>'+items+'</div>';
    }).join('');
  }
  function railHTML(){
    var c = NAV.course;
    return '<nav class="rail" aria-label="Study tools">'+
      '<button class="rail-course" data-menu="browse">'+I.book+'<span class="rc-t"><b>'+esc(c.subject)+'</b><em>'+esc(c.board+' '+c.qual)+'</em></span>'+I.chev+'</button>'+
      railGroupsHTML()+
    '</nav>';
  }

  // ─────────────────────────── title bar (row 3) ───────────────────────────
  function ctLabel(){
    var ct = NAV.contentTypes.find(function(x){return x.id===state.contentType;});
    return ct ? ct.label : 'Exam Questions';
  }
  function titleBarHTML(){
    var c = NAV.course;
    var papers = state.contentType==='papers';
    if (state.contentType==='questions'){
      if (state.level==='course') return examIndexHeaderHTML();
      if (state.level==='topic')  return topicScopedHeaderHTML('questions');
    }
    if (state.contentType==='notes'){
      if (state.level==='course') return notesIndexHeaderHTML();
      if (state.level==='topic')  return topicScopedHeaderHTML('notes');
    }
    if (state.contentType==='resources'){
      if (state.level==='course') return resourcesCourseHeaderHTML();
      return resourcesHeaderHTML();
    }
    var leaf = papers ? 'Past Papers' : state.topic;
    var title = papers ? (c.subject + ' Past Papers') : state.topic;
    var crumb = [c.board, c.qual, c.subject].map(function(x,i){
      return (i?'<span class="sep">\u203a</span>':'')+'<span>'+esc(x)+'</span>';
    }).join('') + qxLink() + '<span class="sep">\u203a</span><b>'+esc(leaf)+'</b>';
    var actions = papers ? papersActionsHTML()
      : state.contentType==='flashcards' ? fcActionsHTML()
      : state.contentType==='notes' ? notesActionsHTML()
      : downloadsHTML();
    return '<section class="titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<div class="eyebrow">'+esc(papers ? 'Past Papers' : ctLabel())+'</div>'+
        '<h1 class="page-title">'+esc(title)+'</h1>'+
      '</div>'+
      '<div class="titlebar-actions">'+actions+'</div>'+
    '</div></section>';
  }

  // ─────────────────────────── navigator ───────────────────────────
  function flagFor(qq){
    if (!qq.contentFree) return '<span class="qflag premium" title="Premium question">'+I.lock+'</span>';
    if (qq.markFree)      return '<span class="qflag free" title="Free to mark">'+I.check+'</span>';
    return '<span class="qflag premium" title="Smart Mark is Premium">'+I.spark+'</span>';
  }
  function difftabsHTML(){
    return '<div class="difftabs" role="tablist" aria-label="Difficulty">'+
      ['easy','medium','hard'].map(function(k){
        return '<button role="tab" aria-selected="'+(state.tier===k)+'" class="difftab '+(state.tier===k?'on':'')+'" data-tier="'+k+'">'+SET.tiers[k].label+'</button>';
      }).join('')+'</div>';
  }
  function setmetaHTML(){
    var t = activeTier();
    return '<div class="setmeta">'+
      '<span>'+I.list+'<b>'+QS().length+'</b> questions</span>'+
      '<span>'+I.layers+'<b>'+partsTotal()+'</b> parts</span>'+
      '<span>'+I.clock+'<b>'+fmtDur(t.durationMin)+'</b></span>'+
    '</div>';
  }
  function downloadsHTML(){
    var lead = isSub() ? I.dl : I.lock;
    return '<div class="setdl">'+
      '<button class="btn btn-secondary sm" data-dl="pdf">'+lead+'Download PDF</button>'+
      '<button class="btn btn-secondary sm" data-dl="answers">'+lead+'Download all answers</button>'+
    '</div>';
  }

  // ─────────────────────────── left topic sidebar (accordion) ───────────────────────────
  function topicQCount(t){ return t.concepts.reduce(function(s,c){return s+c.q;},0); }
  // completion: the active concept is live (from marks); others use demo values
  function conceptProgress(c){
    if (c.name===state.topic){ var qs=QS(); return qs.length ? Math.round(qs.filter(done).length/qs.length*100) : 0; }
    return c.p || 0;
  }
  function topicProgress(t){
    var a = t.concepts.map(conceptProgress);
    return Math.round(a.reduce(function(s,x){return s+x;},0)/a.length);
  }
  function topicDone(t){ return t.concepts.every(function(c){ return conceptProgress(c)>=100; }); }
  function ring(pct, size, sw){
    pct = Math.max(0, Math.min(100, pct));
    var r=(size-sw)/2, c=2*Math.PI*r, off=c*(1-pct/100), s=size/2;
    var col = pct>=100 ? 'var(--success)' : 'var(--color-primary)';
    return '<svg class="ring" width="'+size+'" height="'+size+'" viewBox="0 0 '+size+' '+size+'" aria-hidden="true">'+
      '<circle cx="'+s+'" cy="'+s+'" r="'+r+'" fill="none" stroke="var(--border-strong)" stroke-width="'+sw+'"></circle>'+
      (pct>0 ? '<circle cx="'+s+'" cy="'+s+'" r="'+r+'" fill="none" stroke="'+col+'" stroke-width="'+sw+'" stroke-linecap="round" stroke-dasharray="'+c.toFixed(2)+'" stroke-dashoffset="'+off.toFixed(2)+'" transform="rotate(-90 '+s+' '+s+')"></circle>' : '')+
    '</svg>';
  }
  function topicRowsHTML(){
    return NAV.topics.map(function(t){
      var open = !!state.openTopics[t.n];
      var tp = topicProgress(t), tdone = topicDone(t);
      var concepts = t.concepts.map(function(c){
        var on = c.name===state.topic;
        var cp = conceptProgress(c), cdone = cp>=100;
        return '<button class="concept'+(on?' on':'')+(cdone?' done':'')+'" data-concept="'+esc(c.name)+'" title="'+cp+'% complete \u00b7 '+c.q+' questions">'+
          '<span class="c-mark">'+(cdone ? I.check : ring(cp,18,2.5))+'</span>'+
          '<span class="c-name">'+esc(c.name)+'</span>'+
          '<span class="c-q">'+cp+'%</span></button>';
      }).join('');
      return '<div class="topic'+(open?' open':'')+(tdone?' done':'')+'">'+
        '<button class="topic-hd" data-topic-toggle="'+t.n+'" aria-expanded="'+open+'">'+
          '<span class="t-idx'+(tdone?' done':'')+'">'+ring(tp,30,3)+'<span class="t-idx-c">'+(tdone?I.check:t.n)+'</span></span>'+
          '<span class="t-main"><span class="t-name">'+esc(t.name)+'</span>'+
            '<span class="t-meta">'+(tdone?'Completed':tp+'% complete')+' \u00b7 '+topicQCount(t)+' questions</span></span>'+
          '<span class="t-chev">'+I.chev+'</span>'+
        '</button>'+
        '<div class="concepts"><div class="concepts-in">'+concepts+'</div></div>'+
      '</div>';
    }).join('');
  }
  function sidebarHTML(drawer){
    var rows = topicRowsHTML();
    var topBtn = drawer
      ? '<button class="icon-btn" data-act="closetopics" aria-label="Close menu">'+I.close+'</button>'
      : '<button class="icon-btn sb-collapse" data-act="collapsenav" title="Hide menu" aria-label="Hide menu">'+I.collapse+'</button>';
    return '<aside class="sidebar">'+
      '<div class="sb-hd"><span class="sb-title">'+I.pencil+ctLabel()+'</span>'+topBtn+'</div>'+
      '<button class="sb-all" data-act="alltopics">View all topics '+I.right+'</button>'+
      '<div class="topics-list">'+rows+'</div>'+
    '</aside>';
  }

  // ─────────────────────────── sub-bar (row 4): topic + difficulty + meta ───────────────────────────
  function setmetaInlineHTML(){
    var t = activeTier();
    return '<div class="setmeta-inline">'+
      '<span>'+I.list+'<b>'+QS().length+'</b> questions</span>'+
      '<span>'+I.layers+'<b>'+partsTotal()+'</b> parts</span>'+
      '<span>'+I.clock+'<b>'+fmtDur(t.durationMin)+'</b></span>'+
    '</div>';
  }
  function topicDropdownHTML(){
    var items = NAV.topics.map(function(tp){
      var on = tp===state.topic;
      return '<button class="topicitem'+(on?' on':'')+'" data-topic="'+esc(tp)+'">'+(on?I.check:'<span class="ti-dot"></span>')+'<span>'+esc(tp)+'</span></button>';
    }).join('');
    return '<div class="topicmenu" role="menu">'+
      '<div class="tm-h">Topics \u00b7 '+esc(NAV.course.subject)+'</div>'+items+'</div>';
  }
  function subBarHTML(){
    return '<div class="subbar"><div class="subbar-in">'+
      difftabsHTML()+
      setmetaInlineHTML()+
    '</div></div>';
  }

  // ─────────────────────────── question strip (row 5) ───────────────────────────
  function qstripHTML(){
    var qs = QS(), i = idx(state.qid), total = qs.length;
    var answered = qs.filter(done).length;
    var pct = total ? Math.round(answered/total*100) : 0;
    var pills = qs.map(function(qq){
      var cls = 'qpill'+(qq.id===state.qid?' active':'')+(done(qq)?' done':'');
      return '<button class="'+cls+'" data-q="'+qq.id+'" title="Question '+qq.n+' \u00b7 '+esc(qq.type)+' \u00b7 '+qq.marks+' marks">'+
        '<span class="qp-n">'+(done(qq)?I.check:qq.n)+'</span>'+
        '<span class="qp-l">Q'+qq.n+'</span>'+
        flagFor(qq)+
      '</button>';
    }).join('');
    return '<div class="qstrip-wrap"><div class="qstrip-in">'+
      '<button class="icon-btn strip-nav" data-step="-1"'+(i===0?' disabled':'')+' aria-label="Previous question">'+I.left+'</button>'+
      '<div class="qstrip">'+pills+'</div>'+
      '<button class="icon-btn strip-nav" data-step="1"'+(i===total-1?' disabled':'')+' aria-label="Next question">'+I.right+'</button>'+
      '<div class="qstrip-prog"><div class="progress"><i style="width:'+pct+'%"></i></div><span>'+answered+'/'+total+'</span></div>'+
    '</div></div>';
  }

  // ─────────────────────────── main menu (mega) + backdrops ───────────────────────────
  function megaMenuHTML(){
    if (state.openMenu !== 'browse') return '';
    var subjects = NAV.subjects.map(function(s){
      var on = s===NAV.course.subject;
      return '<button class="mm-item'+(on?' on':'')+'" data-subject="'+esc(s)+'">'+esc(s)+(on?' '+I.check:'')+'</button>';
    }).join('');
    var cts = NAV.contentTypes.map(function(ct){
      var on = ct.id===state.contentType;
      return '<button class="mm-item mm-ct'+(on?' on':'')+'" data-ct="'+ct.id+'">'+I[ct.icon]+'<span>'+ct.label+'</span></button>';
    }).join('');
    return '<div class="menu-backdrop" data-menu="close"></div>'+
      '<div class="megamenu" role="menu" aria-label="Browse">'+
        '<button class="mm-close icon-btn" data-menu="close" aria-label="Close menu">'+I.close+'</button>'+
        '<div class="mm-col"><div class="mm-h">Subject</div><div class="mm-list">'+subjects+'</div></div>'+
        '<div class="mm-col"><div class="mm-h">'+esc(NAV.course.board+' '+NAV.course.qual+' '+NAV.course.subject)+'</div><div class="mm-list mm-cts">'+cts+'</div></div>'+
      '</div>';
  }

  // ─────────────────────────── content region ───────────────────────────
  function placeholderHTML(){
    return '<div class="content"><main><section class="placeholder">'+
      '<span class="ph-ic">'+I[NAV.contentTypes.find(function(x){return x.id===state.contentType;}).icon]+'</span>'+
      '<h2>'+esc(ctLabel())+'</h2>'+
      '<p>This is where <b>'+esc(ctLabel())+'</b> for '+esc(state.topic)+' would live. In this prototype the <b>Exam Questions</b> screen is the one that\u2019s built out.</p>'+
      '<button class="btn btn-primary" data-ct="questions">'+I.pencil+'Go to Exam Questions</button>'+
    '</section></main></div>';
  }
  // ────────────────────── exam questions · course index ──────────────────────
  var I_HELP = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.2 9a2.8 2.8 0 0 1 5.5.9c0 1.9-2.7 2.5-2.7 2.5"/><path d="M12 17h.01"/></svg>';
  function examIndexHeaderHTML(){
    var c = NAV.course, name = c.board+' '+c.qual+' '+c.subject;
    var crumb = [c.board, c.qual, c.subject].map(function(x,i){
      return (i?'<span class="sep">›</span>':'')+'<span>'+esc(x)+'</span>';
    }).join('') + '<span class="sep">›</span><b>Exam Questions</b>';
    return '<section class="titlebar idx-titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<h1 class="page-title idx-title">'+esc(name)+' <span class="tt-sub">Exam Questions</span></h1>'+
        '<div class="idx-code">Exam code: <b>'+esc(examCode())+'</b></div>'+
        '<p class="idx-desc">'+esc(name)+' exam questions and answers, organised by topic. Downloadable PDFs written by teachers and examiners.</p>'+
      '</div>'+
    '</div></section>';
  }
  function qxLink(){
    var t = currentTopic();
    var topicCrumb = '<span class="sep">›</span><button class="crumb-link" data-act="gototopic">'+esc(t.name)+'</button>';
    if (state.contentType==='questions') return '<span class="sep">›</span><button class="crumb-link" data-act="examindex">Exam Questions</button>'+topicCrumb;
    if (state.contentType==='notes') return '<span class="sep">›</span><button class="crumb-link" data-act="notesindex">Revision Notes</button>'+topicCrumb;
    return '';
  }
  function conceptCardHTML(c){
    var blurb = BLURBS[c.name] || (c.name+' — key concepts and exam-style questions.');
    var ms = isSub()
      ? '<button class="idx-ms" data-dlm="'+esc(c.name)+'">'+I.dl+'Mark scheme</button>'
      : '<button class="idx-ms locked" data-act="subscribe" title="Mark scheme is Premium">'+I.lock+'Mark scheme</button>';
    return '<article class="idx-card">'+
      '<button class="idx-card-open" data-concept="'+esc(c.name)+'">'+
        '<span class="idx-card-title">'+esc(c.name)+'</span>'+
        '<span class="idx-card-go" aria-hidden="true">'+I.right+'</span>'+
      '</button>'+
      '<p class="idx-card-blurb">'+esc(blurb)+'</p>'+
      '<div class="idx-card-foot">'+
        '<button class="btn btn-secondary sm idx-dlq" data-dlq="'+esc(c.name)+'">'+I.dl+'Download PDF</button>'+
        ms+
      '</div>'+
    '</article>';
  }
  function topicSectionHTML(t){
    return '<section class="idx-topic">'+
      '<div class="idx-topic-hd">'+
        '<h2 class="idx-topic-name">'+esc(t.name)+'</h2>'+
        '<span class="idx-chip time">'+I.clock+topicHours(t)+' hours</span>'+
        '<span class="idx-chip q">'+I_HELP+topicQCount(t)+' questions</span>'+
      '</div>'+
      '<div class="idx-grid">'+t.concepts.map(conceptCardHTML).join('')+'</div>'+
    '</section>';
  }
  function examIndexHTML(){
    return '<div class="content exam-index"><main>'+ NAV.topics.map(topicSectionHTML).join('') +'</main></div>';
  }

  // ─────────────────── revision notes · topic index ───────────────────
  function notesIndexHeaderHTML(){
    var c = NAV.course, name = c.board+' '+c.qual+' '+c.subject;
    var crumb = [c.board, c.qual, c.subject].map(function(x,i){
      return (i?'<span class="sep">›</span>':'')+'<span>'+esc(x)+'</span>';
    }).join('') + '<span class="sep">›</span><b>Revision Notes</b>';
    return '<section class="titlebar idx-titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<h1 class="page-title idx-title">'+esc(name)+' <span class="tt-sub">Revision Notes</span></h1>'+
        '<p class="idx-desc">Everything you need to revise '+esc(c.subject)+' for '+esc(c.board+' '+c.qual)+', organised by topic. Every set of notes is written by teachers and examiners and matched to the latest specification.</p>'+
      '</div>'+
    '</div></section>';
  }
  function noteRowHTML(cpt){
    return '<button class="note-row" data-concept="'+esc(cpt.name)+'">'+
      '<span class="note-row-title">'+esc(cpt.name)+'</span>'+
      '<span class="note-row-go" aria-hidden="true">'+I.right+'</span>'+
    '</button>';
  }
  function noteGroupHTML(t){
    var open = state.noteOpen[t.n] !== false;
    return '<section class="note-group'+(open?' open':'')+'">'+
      '<button class="note-group-hd" data-note-toggle="'+t.n+'" aria-expanded="'+open+'">'+
        '<span class="ng-ic">'+I.book+'</span>'+
        '<h2 class="ng-title">'+esc(t.name)+' Revision Notes</h2>'+
        '<span class="ng-count">'+t.concepts.length+' sets</span>'+
        '<span class="ng-chev" aria-hidden="true">'+I.chev+'</span>'+
      '</button>'+
      (open ? '<div class="note-rows">'+t.concepts.map(noteRowHTML).join('')+'</div>' : '')+
    '</section>';
  }
  function notesIndexHTML(){
    return '<div class="content notes-index"><main>'+ NAV.topics.map(noteGroupHTML).join('') +'</main></div>';
  }
  function currentTopic(){
    return NAV.topics.find(function(t){ return t.concepts.some(function(c){return c.name===state.topic;}); }) || NAV.topics[0];
  }
  function conceptBlurb(c){
    var raw = BLURBS[c.name] || '';
    var parts = raw.split(',').map(function(s){return s.trim();}).filter(function(p){ return p && p.toLowerCase()!==c.name.toLowerCase(); });
    var lead = parts.slice(0,3).join(', ');
    return lead ? (lead + (parts.length>3 ? '…' : '')) : (c.name + ' — key ideas, worked examples and exam-style questions.');
  }
  function resourcesHeaderHTML(){
    var c = NAV.course, t = currentTopic(), prog = topicProgress(t);
    var crumb = [c.board, c.qual, c.subject].map(function(x,i){
      return (i?'<span class="sep">›</span>':'')+'<span>'+esc(x)+'</span>';
    }).join('') + '<span class="sep">›</span><button class="crumb-link" data-act="rescourse">Course resources</button>' + '<span class="sep">›</span><b>'+esc(t.name)+'</b>';
    return '<section class="titlebar idx-titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<h1 class="page-title idx-title">'+esc(t.name)+' <span class="tt-sub">Course resources</span></h1>'+
        '<div class="rz-meta">'+
          '<span class="rz-prog">'+ring(prog,20,2.6)+'<b>'+prog+'%</b> complete</span>'+
          '<span class="idx-dot">·</span>'+
          '<span>'+t.concepts.length+' concepts</span>'+
          '<span class="idx-dot">·</span>'+
          '<span>'+topicQCount(t)+' exam questions</span>'+
        '</div>'+
        '<p class="idx-desc">Everything for '+esc(t.name)+' in one place — jump straight to the revision notes, exam questions and flashcards for each concept below.</p>'+
      '</div>'+
    '</div></section>';
  }
  function rzLink(type, label, icon, count, concept){
    var cnt = (count!=null) ? '<span class="rz-link-n">'+count+'</span>' : '';
    return '<button class="rz-link" data-goto="'+type+'|'+esc(concept)+'">'+
      '<span class="rz-link-ic">'+icon+'</span>'+
      '<span class="rz-link-lb">'+label+'</span>'+
      cnt+
      '<span class="rz-link-go" aria-hidden="true">'+I.right+'</span>'+
    '</button>';
  }
  function resourceConceptCardHTML(c, idx){
    var cp = conceptProgress(c), done = cp>=100, premium = idx>0;
    var badge = !premium ? '<span class="rz-badge free">Free</span>'
      : isSub() ? '<span class="rz-badge unlocked">'+I.check+'Unlocked</span>'
      : '<span class="rz-badge prem">'+I.lock+'Premium</span>';
    var fc = Math.max(8, Math.round(c.q*0.8));
    return '<article class="rz-card'+((!state.rzTopicLand && c.name===state.topic)?' active':'')+'">'+
      '<div class="rz-card-hd">'+
        '<span class="rz-ring'+(done?' done':'')+'">'+(done?I.check:ring(cp,34,3))+'</span>'+
        '<div class="rz-card-tt">'+
          '<h3 class="rz-card-name">'+esc(c.name)+'</h3>'+
          '<p class="rz-card-blurb">'+esc(conceptBlurb(c))+'</p>'+
        '</div>'+
        badge+
      '</div>'+
      '<div class="rz-links">'+
        rzLink('notes','Revision Notes',I.book,null,c.name)+
        rzLink('questions','Exam Questions',I.pencil,c.q,c.name)+
        rzLink('flashcards','Flashcards',I.cards,fc,c.name)+
      '</div>'+
    '</article>';
  }
  function resourcesHTML(){
    var t = currentTopic();
    return '<div class="content resource-hub"><main>'+
      t.concepts.map(function(c,i){ return resourceConceptCardHTML(c,i); }).join('')+
    '</main></div>';
  }
  // ───── topic-scoped views: the rail keeps you on a topic when you switch content type ─────
  function topicScopedHeaderHTML(kind){
    var c = NAV.course, t = currentTopic(), prog = topicProgress(t);
    var label = kind==='questions' ? 'Exam Questions' : 'Revision Notes';
    var back  = kind==='questions' ? 'examindex' : 'notesindex';
    var crumb = [c.board, c.qual, c.subject].map(function(x){ return '<span>'+esc(x)+'</span>'; }).join('<span class="sep">›</span>')
      + '<span class="sep">›</span><button class="crumb-link" data-act="'+back+'">'+label+'</button>'
      + '<span class="sep">›</span><b>'+esc(t.name)+'</b>';
    var metaExtra = kind==='questions'
      ? '<span>'+topicQCount(t)+' exam questions</span>'
      : '<span>'+t.concepts.length+' sets of notes</span>';
    return '<section class="titlebar idx-titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<h1 class="page-title idx-title">'+esc(t.name)+' <span class="tt-sub">'+label+'</span></h1>'+
        '<div class="rz-meta">'+
          '<span class="rz-prog">'+ring(prog,20,2.6)+'<b>'+prog+'%</b> complete</span>'+
          '<span class="idx-dot">·</span>'+
          '<span>'+t.concepts.length+' concepts</span>'+
          '<span class="idx-dot">·</span>'+ metaExtra +
        '</div>'+
        '<p class="idx-desc">'+esc(t.name)+' '+ (kind==='questions'?'exam questions':'revision notes') +' for '+esc(c.board+' '+c.qual+' '+c.subject)+', organised by concept.</p>'+
      '</div>'+
    '</div></section>';
  }
  function examTopicHTML(){
    return '<div class="content exam-index"><main>'+ topicSectionHTML(currentTopic()) +'</main></div>';
  }
  function notesTopicHTML(){
    return '<div class="content notes-index"><main>'+ noteGroupHTML(currentTopic()) +'</main></div>';
  }
  // course-level resources: a directory of every topic area
  function resourcesCourseHeaderHTML(){
    var c = NAV.course, name = c.board+' '+c.qual+' '+c.subject;
    var crumb = [c.board, c.qual, c.subject].map(function(x){ return '<span>'+esc(x)+'</span>'; }).join('<span class="sep">›</span>')
      + '<span class="sep">›</span><b>Course resources</b>';
    return '<section class="titlebar idx-titlebar"><div class="titlebar-in">'+
      '<div class="titlebar-main">'+
        '<nav class="crumb" aria-label="Breadcrumb">'+crumb+'</nav>'+
        '<h1 class="page-title idx-title">'+esc(name)+' <span class="tt-sub">Course resources</span></h1>'+
        '<p class="idx-desc">Every topic in the course. Open a topic to see its concepts, then jump straight to the revision notes, exam questions and flashcards for each.</p>'+
      '</div>'+
    '</div></section>';
  }
  function resTopicCardHTML(t){
    var prog = topicProgress(t), done = prog>=100;
    return '<button class="rztopic-card" data-restopic="'+t.n+'">'+
      '<span class="rztopic-ring'+(done?' done':'')+'">'+(done?I.check:ring(prog,32,3))+'</span>'+
      '<span class="rztopic-tx"><b>'+esc(t.name)+'</b><em>'+t.concepts.length+' concepts · '+topicQCount(t)+' exam questions</em></span>'+
      '<span class="rztopic-go" aria-hidden="true">'+I.right+'</span>'+
    '</button>';
  }
  function resourcesCourseHTML(){
    return '<div class="content resource-hub res-course"><main>'+ NAV.topics.map(resTopicCardHTML).join('') +'</main></div>';
  }
  function isIndexView(){
    return state.level !== 'concept';   // course & topic levels are full-width index/hub pages (no topic sidebar)
  }

  function contentHTML(){
    if (state.contentType === 'questions'){
      if (state.level === 'concept') return subBarHTML() + qstripHTML() + '<div class="content"><main>'+ cardHTML() +'</main></div>';
      if (state.level === 'topic')   return examTopicHTML();
      return examIndexHTML();
    }
    if (state.contentType === 'flashcards') return flashcardsHTML();
    if (state.contentType === 'notes'){
      if (state.level === 'concept') return notesHTML();
      if (state.level === 'topic')   return notesTopicHTML();
      return notesIndexHTML();
    }
    if (state.contentType === 'papers') return papersHTML();
    if (state.contentType === 'resources'){
      if (state.level === 'course') return resourcesCourseHTML();
      return resourcesHTML();
    }
    return placeholderHTML();
  }

  // ───────────────────────── past papers library ─────────────────────────
  function PAPERS(){ return window.PAPERS || {groups:[]}; }
  function papersActionsHTML(){
    var lead = isSub() ? I.dl : I.lock;
    return '<div class="setdl"><button class="btn btn-secondary sm" data-paper-dl="zip" data-free="0">'+lead+'Download all (ZIP)</button></div>';
  }
  function paperResBtn(kind, label, free){
    var unlocked = free || isSub();
    return '<button class="paper-res'+(unlocked?'':' locked')+'" data-paper-dl="'+kind+'" data-free="'+(free?1:0)+'" title="'+(unlocked?'Secure, time-limited download link':'Premium — unlock to download')+'">'+(unlocked?I.dl:I.lock)+'<span>'+label+'</span></button>';
  }
  function paperRowHTML(p, year){
    var tierCls = p.tier==='Higher' ? 'higher' : 'foundation';
    var sc = state.paperScores[year+'|'+p.no+'|'+p.tier];
    return '<div class="paper-row">'+
      '<div class="paper-main">'+
        '<span class="paper-ic">'+I.doc+'</span>'+
        '<div class="paper-tx">'+
          '<div class="paper-name">Paper '+p.no+'<span class="tier-chip '+tierCls+'">'+esc(p.tier)+'</span></div>'+
          '<div class="paper-meta"><span>'+I.list+p.marks+' marks</span><span>'+I.clock+fmtDur(p.mins)+'</span>'+(sc?'<span class="paper-score"><svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>Your score '+sc.score+'/'+sc.total+'</span>':'')+'</div>'+
        '</div>'+
      '</div>'+
      '<div class="paper-res-wrap">'+
        '<button class="paper-sit" data-act="exam-start" data-no="'+p.no+'" data-year="'+esc(year)+'" data-ptier="'+esc(p.tier)+'" data-marks="'+p.marks+'" data-mins="'+p.mins+'">'+I.pencil+'<span>'+(sc?'Sit again':'Sit paper online')+'</span></button>'+
        paperResBtn('qp','Question paper',true)+
        paperResBtn('ms','Mark scheme',false)+
        paperResBtn('sol','Model solutions',false)+
      '</div>'+
    '</div>';
  }
  function paperGroupHTML(g){
    var ps = g.papers.filter(function(p){ return state.paperTier==='all' || p.tier.toLowerCase()===state.paperTier; });
    if (!ps.length) return '';
    return '<section class="paper-group">'+
      '<div class="pg-hd"><h2>'+esc(g.year)+'</h2><span class="pg-sub">'+esc(g.session)+'</span><span class="pg-count">'+ps.length+' papers</span></div>'+
      '<div class="paper-list">'+ ps.map(function(p){ return paperRowHTML(p, g.year); }).join('') +'</div>'+
    '</section>';
  }
  function papersFilterHTML(){
    var tiers = [['all','All'],['foundation','Foundation'],['higher','Higher']];
    var shield='<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:5px"><path d="M12 2l8 4v6c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z"/></svg>';
    return '<div class="papers-filter">'+
      '<div class="pf-tabs" role="tablist" aria-label="Tier">'+ tiers.map(function(t){
        return '<button role="tab" aria-selected="'+(state.paperTier===t[0])+'" class="'+(state.paperTier===t[0]?'on':'')+'" data-paper-tier="'+t[0]+'">'+t[1]+'</button>';
      }).join('') +'</div>'+
      '<span class="pf-note">'+I.lock+'Question papers are free · mark schemes &amp; solutions are Premium</span>'+
      '<span class="pf-note">'+shield+'Secure, expiring download links · licensed for personal revision use ('+esc(NAV.course.board)+')</span>'+
    '</div>';
  }
  function papersPromoHTML(){
    return '<div class="papers-promo">'+
      '<span class="pp-ic">'+I.crown+'</span>'+
      '<div class="pp-tx"><b>Unlock every mark scheme &amp; model solution</b><span>Attempt any past paper for free. Premium adds instant mark schemes, examiner-style model answers and full ZIP downloads.</span></div>'+
      '<button class="btn btn-accent" data-act="subscribe">'+I.crown+'Get Premium</button>'+
    '</div>';
  }
  function papersHTML(){
    if(!state._seededScore){ state._seededScore=true; try{ var g0=(PAPERS().groups||[])[0]; var p0=g0&&g0.papers&&g0.papers[0]; if(p0 && !state.paperScores[g0.year+'|'+p0.no+'|'+p0.tier]) state.paperScores[g0.year+'|'+p0.no+'|'+p0.tier]={score:Math.round(p0.marks*0.72),total:p0.marks}; }catch(e){} }
    var groups = PAPERS().groups.map(paperGroupHTML).join('');
    return '<div class="content"><main><div class="papers">'+
      papersFilterHTML() + (isSub() ? '' : papersPromoHTML()) + groups +
    '</div></main></div>';
  }

  // ───────────────────────── revision notes (SEO / paywall page) ─────────────────────
  function NOTE(){ return window.NOTE || {sections:[]}; }
  function notesActionsHTML(){
    var lead = isSub() ? I.dl : I.lock;
    return '<div class="setdl">'+
      '<button class="btn btn-secondary sm" data-act="save">'+I.book+'Save note</button>'+
      '<button class="btn btn-secondary sm" data-dl="pdf">'+lead+'Download PDF</button>'+
    '</div>';
  }
  function noteBlockHTML(b){
    if (b.t==='p')   return '<p>'+m(b.x)+'</p>';
    if (b.t==='h')   return '<h3 class="note-h3">'+esc(b.x)+'</h3>';
    if (b.t==='key') return '<div class="note-key"><span class="nk-ic">'+I.bulb+'</span><div>'+m(b.x)+'</div></div>';
    if (b.t==='tip') return '<div class="note-tip"><span class="nt-ic"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.6 6.3L21 9l-5 4.2L17.5 20 12 16.5 6.5 20 8 13.2 3 9l6.4-.7z"/></svg></span><div><b>Exam tip</b><span>'+m(b.x)+'</span></div></div>';
    if (b.t==='eq')  return '<div class="note-eq">'+m('$'+b.x+'$')+'</div>';
    if (b.t==='ex')  return '<div class="note-ex"><div class="nx-h">'+I.pencil+'Worked example</div><p class="nx-q">'+m(b.q)+'</p><p class="nx-a"><b>Answer.</b> '+m(b.a)+'</p></div>';
    if (b.t==='img') return '<figure class="note-fig"><div class="note-img" role="img" aria-label="'+esc(b.alt||b.cap||'Diagram')+'"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="8.5" cy="9.5" r="1.6"/><path d="m4 18 5-5 4 4 3-3 4 4"/></svg><span>'+esc(b.label||'Diagram')+'</span></div>'+(b.cap?'<figcaption>'+esc(b.cap)+'</figcaption>':'')+'</figure>';
    if (b.t==='video') return '<figure class="note-video"><button class="nv-thumb" data-act="playvideo" aria-label="Play video: '+esc(b.title||'lesson')+'"><span class="nv-play"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></span><span class="nv-dur">'+esc(b.dur||'')+'</span></button>'+(b.title?'<figcaption>'+esc(b.title)+'</figcaption>':'')+'</figure>';
    if (b.t==='link') return '<a class="note-link" href="#" data-act="reslink"><span class="nl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5"/></svg></span><span class="nl-tx"><b>'+esc(b.title)+'</b>'+(b.desc?'<em>'+esc(b.desc)+'</em>':'')+'</span><span class="nl-go"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></a>';
    return '';
  }
  function noteSectionHTML(s){
    return '<section class="note-sec" id="note-'+s.id+'"><h2>'+esc(s.title)+'</h2>'+ s.blocks.map(noteBlockHTML).join('') +'</section>';
  }
  function notePaywallHTML(premium){
    var first = premium[0];
    return '<div class="note-paywall">'+
      '<div class="np-peek"><h2>'+esc(first.title)+'</h2><p>'+m(first.blocks[0].x)+'</p><span class="ln"></span><span class="ln s"></span><span class="ln"></span></div>'+
      '<div class="np-fade"></div>'+
      '<div class="np-gate">'+
        '<span class="lk">'+I.lock+'</span>'+
        '<h3>Keep reading with Premium</h3>'+
        '<p>Unlock the full revision note — '+premium.length+' more sections including worked examples, aqueous electrolysis and the required practical.</p>'+
        '<button class="btn btn-accent lg" data-act="subscribe">'+I.crown+'Unlock full note</button>'+
        '<span class="np-sub">Already a member? It appears here automatically.</span>'+
      '</div>'+
    '</div>';
  }
  function notesHTML(){
    var secs = NOTE().sections;
    var toc = '<nav class="note-toc"><span class="toc-h">In this note · '+(NOTE().readMins||5)+' min read</span>'+
      secs.map(function(s){ var lock=(!s.free && !isSub()); return '<a href="#note-'+s.id+'" class="toc-item'+(lock?' lock':'')+'"><span>'+esc(s.title)+'</span>'+(lock?I.lock:'')+'</a>'; }).join('') +'</nav>';
    var freeParts = secs.filter(function(s){return s.free;}).map(noteSectionHTML).join('');
    var body;
    if (isSub()){
      var premParts = secs.filter(function(s){return !s.free;}).map(noteSectionHTML).join('');
      body = freeParts + wrapReveal('notes', premParts);
    } else {
      body = freeParts + notePaywallHTML(secs.filter(function(s){return !s.free;}));
    }
    var complete = '<div class="note-complete'+(state.noteDone?' done':'')+'">'+
      '<button class="btn '+(state.noteDone?'btn-secondary':'btn-primary')+' sm" data-act="notedone">'+(state.noteDone?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Completed':'Mark as complete')+'</button>'+
      '<span>'+(state.noteDone?'Nice work — this note is marked complete.':'Mark this note as complete when you’ve finished reading.')+'</span>'+
    '</div>';
    return '<div class="content"><main><article class="note">'+ toc + body + complete +'</article></main></div>';
  }

  // ───────────────────────── revision cards (flashcards) ─────────────────────────
  function FC(){ return window.FLASHCARDS || []; }
  function canSeeCard(c){ return c.free || isSub(); }
  function fcActionsHTML(){
    var lead = isSub() ? I.dl : I.lock;
    return '<div class="setdl">'+
      '<button class="btn btn-secondary sm" data-act="fcshuffle">'+I.shuffle+'Shuffle</button>'+
      '<button class="btn btn-secondary sm" data-dl="pdf">'+lead+'Download deck</button>'+
    '</div>';
  }
  function flashcardsHTML(){
    var cards = FC(), total = cards.length;
    var known = Object.keys(state.fcRating).filter(function(k){return state.fcRating[k]==='got';}).length;
    var review = Object.keys(state.fcRating).filter(function(k){return state.fcRating[k]==='again';}).length;
    var pct = total ? Math.round(known/total*100) : 0;

    if (state.fcIdx >= total){
      return '<div class="content"><main><section class="fc-summary">'+
        '<span class="fc-sum-ic">'+I.cards+'</span>'+
        '<h2>Deck complete</h2>'+
        '<p><b>'+known+'</b> mastered \u00b7 <b>'+review+'</b> to review \u00b7 '+total+' cards</p>'+
        '<div class="progress fc-sum-bar"><i style="width:'+pct+'%"></i></div>'+
        '<div class="fc-sum-actions"><button class="btn btn-primary" data-act="fcrestart">'+I.refresh+'Restart deck</button>'+
          (review ? '<button class="btn btn-secondary" data-act="fcreview">Review again</button>' : '')+'</div>'+
      '</section></main></div>';
    }

    var card = cards[state.fcIdx];
    var locked = !canSeeCard(card);
    var flipped = state.fcFlipped && !locked;
    var badge = card.free ? '<span class="chip chip-free">'+I.check+'Free</span>' : '<span class="chip chip-premium">'+I.crown+'Premium</span>';

    var faceFront = '<div class="fc-face fc-front">'+
        '<div class="fc-face-top">'+badge+'<span class="fc-side">Term</span></div>'+
        '<div class="fc-q">'+m(card.front)+'</div>'+
        '<div class="fc-hint">'+(locked?'&nbsp;':'Tap to reveal answer')+'</div>'+
      '</div>';
    var faceBack = '<div class="fc-face fc-back">'+
        '<div class="fc-face-top"><span class="chip chip-brand">'+I.spark+'Answer</span><span class="fc-side">Answer</span></div>'+
        '<div class="fc-a">'+m(card.back)+'</div>'+
        '<div class="fc-hint">Tap to flip back</div>'+
      '</div>';

    var lockOverlay = locked ? '<div class="fc-lock">'+
        '<span class="lk">'+I.lock+'</span>'+
        '<h4>Premium card</h4>'+
        '<p>Unlock the full revision deck with Premium.</p>'+
        '<button class="btn btn-accent" data-act="subscribe">'+I.crown+'Unlock deck</button>'+
      '</div>' : '';

    var mid;
    if (locked) mid = '<div class="fc-rate-hint">This card is part of Premium</div>';
    else if (flipped) mid = '<div class="fc-rate">'+
        '<button class="btn fc-again" data-rate="again">'+I.refresh+'Still learning</button>'+
        '<button class="btn fc-got" data-rate="got">'+I.check+'Got it</button></div>';
    else mid = '<div class="fc-rate-hint">Tap the card to see the answer</div>';

    var controls = '<div class="fc-controls">'+
      '<button class="icon-btn strip-nav" data-act="fcprev"'+(state.fcIdx===0?' disabled':'')+' aria-label="Previous card">'+I.left+'</button>'+
      mid+
      '<button class="icon-btn strip-nav" data-act="fcnext" aria-label="Next card">'+I.right+'</button>'+
    '</div>';

    return '<div class="content"><main>'+
      '<div class="fc-top">'+
        '<div class="fc-count">Card '+(state.fcIdx+1)+' of '+total+'</div>'+
        '<div class="fc-progress"><span>'+known+' mastered</span><div class="progress"><i style="width:'+pct+'%"></i></div></div>'+
      '</div>'+
      '<div class="fcard-wrap">'+
        '<div class="fcard'+(flipped?' flipped':'')+'" '+(locked?'':'data-act="fcflip"')+'>'+ faceFront + faceBack +'</div>'+
        lockOverlay +
      '</div>'+
      controls +
    '</div></main></div>';
  }

  function fcRate(r){ state.fcRating[state.fcIdx]=r; state.fcFlipped=false; state.fcIdx++; render(); }

  // ─────────────────────────── question card ───────────────────────────
  function diffDots(n){
    var s=''; for(var i=1;i<=3;i++){ s+='<i class="'+(i<=n?'on':'')+'"></i>'; } return '<span class="diff" title="Difficulty">'+s+'</span>';
  }

  function stemHTML(qq){
    if (canSee(qq)){
      var html = '<div class="qstem">'+m(qq.stem)+'</div>';
      return wrapReveal(qq.id+':content', html);
    }
    // premium content — structural paywall, unlock-in-place target
    return '<div class="qstem"><div class="paywall">'+
      '<div class="peek">'+m(qq.stem.slice(0,90))+'…<span class="ln" style="width:92%"></span><span class="ln" style="width:80%"></span><span class="ln" style="width:60%"></span></div>'+
      '<div class="pw-over">'+
        '<span class="lk">'+I.lock+'</span>'+
        '<h4>Premium question</h4>'+
        '<p>This 6-mark extended question, its model answer and Smart Mark are part of Premium.</p>'+
        '<button class="btn btn-accent" data-act="subscribe">'+I.crown+'Unlock with Premium</button>'+
      '</div>'+
    '</div></div>';
  }

  function markGateHTML(qq){
    var signup = (!isLogged() && qq.markFree);
    if (signup){
      return '<div class="mark-gate">'+
        '<span class="ic">'+I.spark+'</span>'+
        '<span class="tx"><b>Create a free account to mark this</b><p>This question\u2019s Smart Mark is free — sign up (no card needed) and get instant marking against the mark scheme.</p></span>'+
        '<span class="cta"><button class="btn btn-primary" data-act="createfree">Sign up free</button></span>'+
      '</div>';
    }
    return '<div class="mark-gate">'+
      '<span class="ic">'+I.spark+'</span>'+
      '<span class="tx"><b>Smart Mark is Premium</b><p>You can read and attempt this question for free. Instant AI marking against the exam mark scheme is part of Premium.</p></span>'+
      '<span class="cta"><button class="btn btn-accent" data-act="subscribe">'+I.crown+'Unlock Smart Mark</button></span>'+
    '</div>';
  }

  function highResultHTML(qq){
    var score = qq.marks<=2 ? qq.marks : qq.marks-1;
    var full = score===qq.marks;
    var fb = full
      ? '<b>Full marks.</b> Clear, complete and uses the correct terminology.'
      : '<b>Nearly there — '+score+' of '+qq.marks+'.</b> To earn the last mark, make sure you: '+qq.scheme[qq.scheme.length-1].toLowerCase()+'.';
    return '<div class="result high" data-reveal-anim>'+
      '<div class="result-hd">'+
        '<span class="score"><span class="big">'+score+'</span><span class="den">/ '+qq.marks+'</span></span>'+
        '<span class="rlbl"><b>Marked</b><span>graded against the AQA mark scheme</span></span>'+
        '<span class="smk">'+I.spark+'Smart Mark</span>'+
        '<span class="result-sp"></span>'+
        '<button class="report" data-act="report">Report this mark</button>'+
      '</div>'+
      '<div class="result-body"><p class="fb">'+fb+'</p>'+rubricHitMiss(qq,score)+modelHTML(qq)+'</div>'+
    '</div>';
  }

  function lowResultHTML(qq){
    var ticks = state.ticks[qq.id] || {};
    var awarded = Object.keys(ticks).filter(function(k){return ticks[k];}).length;
    var rubric = qq.scheme.map(function(pt,i){
      var on = ticks[i];
      return '<li class="'+(on?'ticked':'')+'" data-tick="'+i+'"><span class="box">'+I.check+'</span><span class="rtext">'+esc(pt)+'</span></li>';
    }).join('');
    return '<div class="result low" data-reveal-anim>'+
      '<div class="result-hd">'+
        '<span class="score"><span class="big">?</span></span>'+
        '<span class="rlbl"><b>Smart Mark isn\u2019t sure</b><span>low confidence — please self-assess</span></span>'+
        '<span class="smk">'+I.spark+'Smart Mark</span>'+
        '<span class="result-sp"></span>'+
        '<button class="report" data-act="report">'+I.flag+'Report</button>'+
      '</div>'+
      '<div class="result-body">'+
        '<div class="uncertain-note">'+I.warn+'<span>We couldn\u2019t confidently mark this answer. Check it against the mark scheme below and award your own marks — tap each point you\u2019ve met.</span></div>'+
        '<ul class="rubric">'+rubric+'</ul>'+
        '<div class="selfscore"><span>Your self-assessed mark</span><b>'+awarded+' / '+qq.marks+'</b></div>'+
        modelHTML(qq)+
      '</div>'+
    '</div>';
  }

  function modelHTML(qq){
    if (isSub()){
      var open = state.modelOpen[qq.id];
      var body = open ? wrapReveal(qq.id+':model', '<div class="modbox">'+m(qq.model)+'</div>') : '';
      return '<div class="model">'+
        '<div class="modhd" data-act="togglemodel">'+I.book+(open?'Hide model answer':'Show model answer')+'</div>'+
        body+
      '</div>';
    }
    return '<div class="model"><div class="modhd" style="color:var(--fg-4);cursor:default">'+I.lock+'Model answer available with Premium</div></div>';
  }

  function markAreaHTML(qq){
    if (!canSee(qq)) return ''; // premium content: nothing to mark until unlocked
    if (!canMark(qq)) return markGateHTML(qq);
    if (state.marks[qq.id]){
      return state.marks[qq.id].mode==='self' ? lowResultHTML(qq) : highResultHTML(qq);
    }
    return '<div class="actions">'+
      '<button class="btn btn-primary lg" data-act="mark">'+I.spark+'Mark my answer</button>'+
      '<button class="btn btn-ghost" data-act="save">Save for later</button>'+
      '<span class="sp"></span>'+
      '<span class="chip chip-brand">'+I.spark+'Smart Mark</span>'+
    '</div>';
  }

  function cardHTML(){
    var qq = q(state.qid);
    if (qq.items) return multiPartCardHTML(qq);
    var contentBadge = qq.contentFree
      ? '<span class="chip chip-free">'+I.check+'Free to read</span>'
      : '<span class="chip chip-premium">'+I.crown+'Premium</span>';
    var markBadge = qq.markFree
      ? '<span class="chip chip-neutral">Free marking</span>'
      : '<span class="chip chip-premium">'+I.spark+'Smart Mark · Premium</span>';
    var answerBlock = canSee(qq) ? (
      '<div class="ans-label"><span>Your answer</span><span class="hint">Autosaves as you type</span></div>'+
      '<textarea class="ans" data-ans placeholder="'+esc(qq.placeholder)+'">'+esc(state.answers[qq.id]||'')+'</textarea>'
    ) : '';

    return '<section class="qcard">'+
      '<div class="qcard-hd">'+
        '<div class="qtags">'+contentBadge+markBadge+'<span class="chip chip-marks">'+qq.marks+' marks</span></div>'+
        '<div class="qtitle-row"><span class="qtitle">Question '+qq.n+' · '+esc(qq.type)+'</span><span class="diff-label">'+I.signal+'Difficulty · '+activeTier().label+'</span></div>'+
      '</div>'+
      stemHTML(qq)+
      '<div class="qbody">'+
        answerBlock+
        markAreaHTML(qq)+
      '</div>'+
    '</section>';
  }

  // ─────────────────────────── reveal (unlock-in-place) ───────────────────────────
  function wrapReveal(key, html){
    if (state.pending[key]){
      return '<div class="reveal-grid sweep" data-reveal="'+key+'"><div class="rg-in">'+html+'</div></div>';
    }
    return html;
  }
  function playReveals(){
    var keys = Object.keys(state.pending);
    if (!keys.length) return;
    keys.forEach(function(key){
      var el = document.querySelector('[data-reveal="'+key+'"]');
      if (el){ requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.classList.add('open'); }); }); }
    });
    state.pending = {};
  }

  // ─────────────────────────── sit paper online / mock exam runner ───────────────────────────
  var examTimer;
  function examQuestions(tier){
    var pick = tier==='Foundation' ? ['easy','medium'] : ['medium','hard'];
    var arr = [];
    pick.forEach(function(k){ var t=SET.tiers[k]; if(t) t.questions.forEach(function(qq){ arr.push(qq); }); });
    return arr;
  }
  function examQObj(id){
    var found=null;
    ['easy','medium','hard'].forEach(function(k){ var t=SET.tiers[k]; if(t) t.questions.forEach(function(qq){ if(qq.id===id) found=qq; }); });
    return found;
  }
  function fmtClock(s){
    var h=Math.floor(s/3600), mm=Math.floor((s%3600)/60), ss=s%60;
    function p(n){ return (n<10?'0':'')+n; }
    return h>0 ? h+':'+p(mm)+':'+p(ss) : p(mm)+':'+p(ss);
  }
  function gradeFor(p){ return p>=85?'9':p>=75?'8':p>=67?'7':p>=57?'6':p>=47?'5':p>=37?'4':p>=27?'3':p>=17?'2':'1'; }
  function examScore(){
    var ex=state.exam, awarded=0, total=0, rows=[];
    ex.qids.forEach(function(id){
      var qq=examQObj(id); if(!qq) return;
      var ans=(ex.ans[id]||'').trim();
      var got = ans ? qq.marks : 0;              // prototype: an attempted answer earns full marks
      awarded+=got; total+=qq.marks;
      rows.push({ q:qq, ans:ans, got:got });
    });
    return { awarded:awarded, total:total, rows:rows };
  }
  function examAnswered(){ return state.exam.qids.filter(function(id){ return (state.exam.ans[id]||'').trim(); }).length; }
  function startExam(no, tier, marks, mins, year){
    var qs = examQuestions(tier);
    state.exam = {
      no:no, tier:tier, marks:marks, mins:mins, year:year,
      phase:'intro', qi:0,
      qids: qs.map(function(qq){ return qq.id; }),
      ans:{}, flags:{}, remaining: mins*60, autoSubmit:false
    };
    render();
  }
  function examSubmit(auto){
    clearInterval(examTimer);
    state.exam.phase='results';
    state.exam.autoSubmit=!!auto;
    if (state.exam && state.exam.no!=null){ var ex=state.exam; var awarded=Math.round(ex.marks*(examAnswered()/Math.max(1,ex.qids.length))); state.paperScores[ex.year+'|'+ex.no+'|'+ex.tier]={score:awarded,total:ex.marks}; }
    render();
    toast(auto ? 'Time\u2019s up \u2014 paper submitted' : 'Paper submitted for marking');
  }
  function examTick(){
    clearInterval(examTimer);
    var ex=state.exam;
    if (!ex || ex.phase!=='running') return;
    examTimer = setInterval(function(){
      var e2=state.exam;
      if (!e2 || e2.phase!=='running'){ clearInterval(examTimer); return; }
      e2.remaining--;
      if (e2.remaining<=0){ e2.remaining=0; clearInterval(examTimer); return examSubmit(true); }
      var t=document.getElementById('exam-timer-t'), w=document.getElementById('exam-timer');
      if (t) t.textContent=fmtClock(e2.remaining);
      if (w) w.className='exam-timer'+(e2.remaining<120?' danger':e2.remaining<600?' warn':'');
    }, 1000);
  }

  function examRunnerHTML(){
    var p=state.exam;
    var body = p.phase==='intro' ? examIntroHTML()
      : p.phase==='review' ? examReviewHTML()
      : p.phase==='results' ? examResultsHTML()
      : examRunHTML();
    return '<div class="exam-shell">'+body+'</div>';
  }
  function examTopbar(){
    var p=state.exam, ans=examAnswered(), pct=Math.round(ans/p.qids.length*100);
    return '<div class="exam-topbar">'+
      '<button class="exam-quit" data-act="exam-exit" title="Leave exam">'+I.close+'</button>'+
      '<div class="exam-title">Paper '+p.no+' \u00b7 '+esc(p.tier)+'</div>'+
      '<div class="exam-prog"><div class="exam-prog-bar"><i style="width:'+pct+'%"></i></div><span>'+ans+'/'+p.qids.length+' answered</span></div>'+
      '<div class="exam-timer'+(p.remaining<120?' danger':p.remaining<600?' warn':'')+'" id="exam-timer">'+I.clock+'<span id="exam-timer-t">'+fmtClock(p.remaining)+'</span></div>'+
      '<button class="btn btn-primary sm" data-act="exam-review">Submit</button>'+
    '</div>';
  }
  function examIntroHTML(){
    var p=state.exam, c=NAV.course, sc=examScore();
    return '<div class="exam-topbar minimal">'+
        '<button class="exam-quit" data-act="exam-exit">'+I.left+'Back to papers</button>'+
        '<div class="exam-brand">'+I.pencil+'Exam mode</div>'+
      '</div>'+
      '<div class="exam-cover-wrap"><div class="exam-cover">'+
        '<div class="ec-board">'+esc(c.board+' '+c.qual+' \u00b7 '+c.subject)+'</div>'+
        '<h1 class="ec-title">Paper '+p.no+'<span class="tier-chip '+(p.tier==='Higher'?'higher':'foundation')+'">'+esc(p.tier)+'</span></h1>'+
        '<p class="ec-sub">Online attempt \u00b7 timed and marked like the real thing</p>'+
        '<div class="ec-meta">'+
          '<div class="ecm"><span class="ecm-k">Time allowed</span><span class="ecm-v">'+fmtDur(p.mins)+'</span></div>'+
          '<div class="ecm"><span class="ecm-k">Questions</span><span class="ecm-v">'+p.qids.length+'</span></div>'+
          '<div class="ecm"><span class="ecm-k">Marks available</span><span class="ecm-v">'+sc.total+'</span></div>'+
        '</div>'+
        '<div class="ec-inst"><h2>Instructions</h2><ul>'+
          '<li>Answer <b>all</b> questions in the spaces provided.</li>'+
          '<li>Show your working \u2014 you may lose marks if you don\u2019t.</li>'+
          '<li>The number of marks is shown in brackets after each question.</li>'+
          '<li>The timer starts when you begin; the paper is submitted automatically at zero.</li>'+
        '</ul></div>'+
        '<div class="ec-note">'+I.spark+'<span>Smart Mark grades every answer the moment you submit.'+(isSub()?'':' Model answers &amp; the mark scheme are part of Premium.')+'</span></div>'+
        '<div class="ec-actions"><button class="btn btn-primary btn-xl" data-act="exam-begin">Start exam'+I.right+'</button>'+
          '<button class="btn btn-secondary btn-xl" data-act="exam-exit">Cancel</button></div>'+
      '</div></div>';
  }
  function examRunHTML(){
    var p=state.exam, id=p.qids[p.qi], qq=examQObj(id);
    var ans=p.ans[id]||'', flagged=!!p.flags[id];
    return examTopbar()+
      '<div class="exam-body">'+
        '<div class="exam-q">'+
          '<div class="eq-head"><div class="eq-no">Question '+(p.qi+1)+'</div><div class="eq-marks">['+qq.marks+' mark'+(qq.marks>1?'s':'')+']</div></div>'+
          '<div class="eq-stem">'+m(qq.stem)+'</div>'+
          '<textarea class="eq-input" data-exam-ans="'+id+'" placeholder="'+esc(qq.placeholder||'Write your answer\u2026')+'">'+esc(ans)+'</textarea>'+
          '<div class="eq-tools"><button class="eq-flag'+(flagged?' on':'')+'" data-act="exam-flag">'+I.flag+(flagged?'Flagged for review':'Flag for review')+'</button></div>'+
        '</div>'+
        examNavigatorHTML()+
      '</div>'+
      '<div class="exam-footer">'+
        '<button class="btn btn-secondary" data-act="exam-prev"'+(p.qi===0?' disabled':'')+'>'+I.left+'Previous</button>'+
        '<div class="ef-count">'+(p.qi+1)+' / '+p.qids.length+'</div>'+
        (p.qi===p.qids.length-1
          ? '<button class="btn btn-primary" data-act="exam-review">Review &amp; submit'+I.right+'</button>'
          : '<button class="btn btn-primary" data-act="exam-next">Next'+I.right+'</button>')+
      '</div>';
  }
  function examNavigatorHTML(){
    var p=state.exam;
    var cells=p.qids.map(function(id,i){
      var ans=(p.ans[id]||'').trim(), cls='eqn';
      if(i===p.qi) cls+=' cur'; if(ans) cls+=' done'; if(p.flags[id]) cls+=' flag';
      return '<button class="'+cls+'" data-act="exam-jump" data-qi="'+i+'">'+(i+1)+(p.flags[id]?'<i class="eqn-flag">'+I.flag+'</i>':'')+'</button>';
    }).join('');
    return '<aside class="exam-nav"><div class="exam-nav-hd">Questions</div><div class="exam-nav-grid">'+cells+'</div>'+
      '<div class="exam-nav-key"><span><i class="k done"></i>Answered</span><span><i class="k flag"></i>Flagged</span><span><i class="k"></i>Not answered</span></div>'+
    '</aside>';
  }
  function examReviewHTML(){
    var p=state.exam, ans=examAnswered(), flagged=p.qids.filter(function(id){return p.flags[id];}).length, unans=p.qids.length-ans;
    var grid=p.qids.map(function(id,i){var a=(p.ans[id]||'').trim(),cls='eqn';if(a)cls+=' done';if(p.flags[id])cls+=' flag';return '<button class="'+cls+'" data-act="exam-jump" data-qi="'+i+'">'+(i+1)+'</button>';}).join('');
    return examTopbar()+'<div class="exam-review">'+
      '<h1>Review your paper</h1>'+
      '<p class="er-sub">Check your answers before submitting \u2014 tap any question to jump back.</p>'+
      '<div class="er-stats">'+
        '<div class="ers"><b>'+ans+'</b><span>Answered</span></div>'+
        '<div class="ers warn"><b>'+unans+'</b><span>Unanswered</span></div>'+
        '<div class="ers flag"><b>'+flagged+'</b><span>Flagged</span></div>'+
      '</div>'+
      '<div class="exam-nav-grid big">'+grid+'</div>'+
      (unans>0?'<div class="er-warn">'+I.warn+'You have '+unans+' unanswered question'+(unans>1?'s':'')+'. You can still submit.</div>':'')+
      '<div class="er-actions"><button class="btn btn-secondary" data-act="exam-resume">'+I.left+'Keep working</button><button class="btn btn-primary" data-act="exam-submit">Submit paper</button></div>'+
    '</div>';
  }
  function examResultsHTML(){
    var p=state.exam, sc=examScore(), used=p.mins*60-p.remaining, ans=examAnswered();
    var pct=sc.total?Math.round(sc.awarded/sc.total*100):0;
    var top='<div class="exam-topbar minimal"><button class="exam-quit" data-act="exam-exit">'+I.left+'Back to papers</button><div class="exam-brand">'+I.pencil+'Results \u00b7 Paper '+p.no+' '+esc(p.tier)+'</div></div>';
    if (!isSub()){
      return top+'<div class="exam-results">'+
        '<div class="rs-hero locked">'+I.check+'<h1>Paper submitted</h1><p>You answered '+ans+' of '+p.qids.length+' questions in '+fmtClock(used)+'.</p></div>'+
        '<div class="rs-paywall"><span class="pp-ic">'+I.crown+'</span><div class="pp-tx"><b>Unlock your Smart Mark result</b><span>See your total score, a mark for every question, the mark scheme and examiner-style model answers.</span></div><button class="btn btn-accent" data-act="subscribe">'+I.crown+'Get Premium</button></div>'+
        '<div class="rs-actions"><button class="btn btn-secondary" data-act="exam-restart">'+I.refresh+'Retake paper</button><button class="btn btn-secondary" data-act="exam-exit">Back to papers</button></div>'+
      '</div>';
    }
    var rows=sc.rows.map(function(r,i){
      var mkCls=r.got===r.q.marks?'full':r.got>0?'part':'zero';
      return '<div class="rq">'+
        '<div class="rq-hd"><span class="rq-no">Q'+(i+1)+'</span><span class="rq-mk '+mkCls+'">'+r.got+'/'+r.q.marks+' marks</span><span class="rq-type">'+esc(r.q.type||'')+'</span><button class="rq-report" data-act="report">Report a mark</button></div>'+
        '<div class="rq-stem">'+m(r.q.stem)+'</div>'+
        '<div class="rq-ans'+(r.ans?'':' empty')+'"><span class="rq-ans-k">Your answer</span>'+(r.ans?esc(r.ans):'Not answered')+'</div>'+
        '<details class="rq-model"><summary>'+I.book+'Model answer &amp; mark scheme</summary><div class="rq-model-b"><div class="rq-model-ans">'+m(r.q.model||'')+'</div>'+
          (r.q.scheme?'<ul class="rq-scheme">'+r.q.scheme.map(function(s){return '<li>'+I.check+m(s)+'</li>';}).join('')+'</ul>':'')+'</div></details>'+
      '</div>';
    }).join('');
    return top+'<div class="exam-results">'+
      '<div class="rs-hero">'+
        '<div class="rs-ring" style="--p:'+pct+'"><span>'+sc.awarded+'<i>/'+sc.total+'</i></span></div>'+
        '<div class="rs-headline"><div class="rs-grade">Indicative grade '+gradeFor(pct)+'</div><h1>'+pct+'%</h1><p>Smart Mark graded your paper in '+fmtClock(used)+'. Open any question to see the mark scheme and model answer.</p></div>'+
      '</div>'+
      '<div class="rs-list">'+rows+'</div>'+
      '<div class="rs-actions"><button class="btn btn-secondary" data-act="exam-restart">'+I.refresh+'Retake paper</button><button class="btn btn-primary" data-act="exam-exit">Back to papers</button></div>'+
    '</div>';
  }

  // ─────────────────────────── render ───────────────────────────
  function render(){
    var app = document.getElementById('app');
    var mob = state.device==='mobile';
    if (state.exam){
      app.className = 'app exam-mode' + (mob ? ' is-mobile' : '');
      document.body.classList.toggle('proto-mobile', mob);
      app.innerHTML = examRunnerHTML();
      var oX = document.getElementById('pr-overlay'); if (oX) oX.innerHTML='';
      examTick();
      return;
    }
    app.className = 'app' + (mob ? ' is-mobile' : '');
    var mainTop = (!mob && state.navCollapsed && !isIndexView()) ? '<button class="nav-reopen" data-act="expandnav">'+I.menu+'Show topics</button>' : '';
    var shellMain = '<main class="shell-main">'+ mainTop + titleBarHTML() + contentHTML() +'</main>';
    var cols = '';
    if (!mob){
      cols += railHTML();
      if (!state.navCollapsed && state.contentType!=='papers' && !isIndexView()) cols += sidebarHTML(false);
    }
    var workspace = '<div class="workspace'+(state.navCollapsed?' nav-collapsed':'')+'">'+ cols + shellMain +'</div>';
    document.body.classList.toggle('proto-mobile', mob);
    app.innerHTML = headerHTML() + workspace + (mob ? bottomNavHTML() : '');
    var ov = document.getElementById('pr-overlay');
    if (!ov){ ov = document.createElement('div'); ov.id='pr-overlay'; document.body.appendChild(ov); ov.addEventListener('click', onClick); }
    ov.className = 'app' + (mob ? ' is-mobile' : '');
    ov.innerHTML = overlayHTML();
    playReveals();
  }
  function overlayHTML(){
    if (state.openMenu==='browse') return megaMenuHTML();
    if (state.mobileSheet) return sheetHTML(state.mobileSheet);
    return '';
  }
  function bottomNavHTML(){
    var tabs = [
      { sheet:'course', icon:'grid',   label:'Course' },
      { sheet:'tools',  icon:'tools',  label:'Study tools' },
      { sheet:'topics', icon:'folder', label:'All topics' }
    ];
    return '<nav class="bottomnav" aria-label="Primary">'+ tabs.map(function(t){
      var on = state.mobileSheet===t.sheet;
      return '<button class="bn-item'+(on?' on':'')+'" data-sheet="'+t.sheet+'">'+I[t.icon]+'<span>'+t.label+'</span></button>';
    }).join('') +'</nav>';
  }
  function courseSheetHTML(){
    var c = NAV.course;
    var subs = NAV.subjects.map(function(s){
      var on = s===c.subject;
      return '<button class="mm-item'+(on?' on':'')+'" data-subject="'+esc(s)+'">'+esc(s)+(on?' '+I.check:'')+'</button>';
    }).join('');
    return '<div class="course-cur">'+I.book+'<div><b>'+esc(c.subject)+'</b><span>'+esc(c.board+' '+c.qual)+'</span></div></div>'+
      '<div class="sheet-lbl">Switch subject</div><div class="mm-list">'+subs+'</div>';
  }
  function sheetHTML(kind){
    var title, body;
    if (kind==='tools'){ title='Study tools'; body='<div class="tools-list">'+railGroupsHTML()+'</div>'; }
    else if (kind==='topics'){ title=ctLabel(); body='<button class="sb-all" data-act="alltopics">View all topics '+I.right+'</button><div class="topics-list">'+topicRowsHTML()+'</div>'; }
    else { title='Course'; body=courseSheetHTML(); }
    return '<div class="menu-backdrop" data-act="closesheet"></div>'+
      '<div class="sheet" role="dialog" aria-label="'+esc(title)+'">'+
        '<div class="sheet-hd"><h3>'+esc(title)+'</h3><button class="icon-btn" data-act="closesheet" aria-label="Close">'+I.close+'</button></div>'+
        '<div class="sheet-body">'+body+'</div>'+
      '</div>';
  }

  // ─────────────────────────── actions ───────────────────────────
  function unlockInPlace(newVisitor){
    var qq = q(state.qid);
    var wasSee = canSee(qq), wasMark = canMark(qq);
    state.visitor = newVisitor;
    if (canSee(qq) && !wasSee) state.pending[qq.id+':content'] = true;
    if (canMark(qq) && !wasMark) state.pending['mark'] = true; // (mark area anim handled by result css)
    state.pending['notes'] = true; // reveal premium note sections in place on unlock
    render();
  }

  function selectQ(id){ state.qid = id; render(); }

  function switchTier(t){
    if (state.tier === t) return;
    state.tier = t;
    state.qid = activeTier().questions[0].id; // land on the tier's first question
    render();
  }

  function stepQ(dir){
    var i = idx(state.qid) + dir;
    if (i>=0 && i<QS().length) selectQ(QS()[i].id);
  }

  function openMenu(which){ state.openMenu = (state.openMenu===which ? null : which); render(); }
  function closeMenu(){ if(state.openMenu){ state.openMenu=null; render(); } }
  function selectContentType(id){
    state.openMenu = null;
    state.mobileSheet = null;
    // the rail MIRRORS the current level: do NOT reset it — contentHTML renders `id` at state.level
    state.rzTopicLand = false;
    if (id === state.contentType){ return render(); }
    state.contentType = id;
    render();
  }
  function selectConcept(name){
    state.rzTopicLand = false;
    state.topic = name;
    state.level = 'concept';   // clicking a concept drops into that concept's material (reader / answering view)
    NAV.topics.forEach(function(t){ if (t.concepts.some(function(c){return c.name===name;})) state.openTopics[t.n]=true; });
    state.mobileSheet = null;
    state.qid = activeTier().questions[0].id;
    render();
  }
  function gotoResource(type, concept){ state.contentType = type; selectConcept(concept); }
  function toggleTopic(n){ state.openTopics[n] = !state.openTopics[n]; render(); }
  function selectSubject(s){
    NAV.course.subject = s;
    state.openMenu = null;
    state.mobileSheet = null;
    render();
    toast('Course set to '+NAV.course.board+' '+NAV.course.qual+' '+s);
  }

  function markAnswer(){
    var qq = q(state.qid);
    if (state.confidence==='low'){ state.marks[qq.id] = {mode:'self'}; }
    else { state.marks[qq.id] = {mode:'auto'}; }
    render();
  }

  function toggleTick(i){
    var qq = q(state.qid);
    state.ticks[qq.id] = state.ticks[qq.id] || {};
    state.ticks[qq.id][i] = !state.ticks[qq.id][i];
    render();
  }

  // ═══════════════════════ multi-part answering engine (A2) ═══════════════════════
  var IK_OK='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';
  var IK_NO='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
  var IK_FX='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 20V7a3 3 0 0 1 3-3h1M4 12h6M13 20l6-8M19 20l-6-8"/></svg>';
  var IK_CLIP='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 11.5 12.5 20a5 5 0 0 1-7-7l8.5-8.5a3.3 3.3 0 0 1 4.7 4.7L10 12"/></svg>';
  var IK_WARN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 9v4M12 17h.01M10.3 3.7 2 18a2 2 0 0 0 1.7 3h16.6A2 2 0 0 0 22 18L13.7 3.7a2 2 0 0 0-3.4 0z"/></svg>';
  var IK_GOOG='<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.29 5.29 0 0 1-2.3 3.47v2.88h3.72C21.94 18.66 23 15.7 23 12.25z"/><path fill="#34A853" d="M12 24c3.12 0 5.74-1.03 7.65-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.93 1.1-3.02 0-5.58-2.04-6.5-4.79H1.66v3.01A11.99 11.99 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.5 14.64a7.2 7.2 0 0 1 0-4.6V7.03H1.66a12 12 0 0 0 0 10.62l3.84-3.01z"/><path fill="#EA4335" d="M12 4.77c1.7 0 3.22.59 4.42 1.73l3.3-3.3C17.73 1.2 15.11 0 12 0 7.34 0 3.31 2.69 1.66 6.6L5.5 9.62C6.42 6.87 8.98 4.77 12 4.77z"/></svg>';

  function mpLetter(i){ return '('+String.fromCharCode(97+i)+')'; }
  function mpKey(qq,i){ return qq.id+'::'+i; }
  function sameSet(a,b){ if(a.length!==b.length) return false; return a.slice().sort().join(',')===b.slice().sort().join(','); }
  function kindLabel(k){ return {mcq:'Multiple choice',multi:'Select all that apply',numeric:'Numeric answer',short:'Short answer',extended:'Extended response'}[k]||k; }

  function mpInput(qq,it,i){
    var key=mpKey(qq,i), v=state.answers[key], submitted=!!state.submitted[qq.id];
    if(it.kind==='mcq'||it.kind==='multi'){
      var multi=it.kind==='multi', sel=multi?(Array.isArray(v)?v:[]):v;
      return '<div class="opts" role="'+(multi?'group':'radiogroup')+'">'+it.options.map(function(o){
        var on=multi?sel.indexOf(o.k)>=0:sel===o.k, cls='opt'+(on?' sel':''), mk='';
        if(submitted){ var corr=multi?it.correct.indexOf(o.k)>=0:it.correct===o.k;
          if(corr){ cls+=' correct'; mk='<span class="opt-mk ok">'+IK_OK+'</span>'; }
          else if(on){ cls+=' wrong'; mk='<span class="opt-mk no">'+IK_NO+'</span>'; } }
        return '<button class="'+cls+'"'+(submitted?' disabled':'')+' data-opt="'+i+'|'+o.k+'"><span class="opt-k">'+esc(o.k)+'</span><span class="opt-t">'+m(o.t)+'</span>'+mk+'</button>';
      }).join('')+'</div>';
    }
    if(it.kind==='numeric') return '<div class="num-wrap"><input class="input num-in" type="text" inputmode="decimal" data-pa="'+i+'" value="'+esc(v||'')+'" placeholder="Answer"'+(submitted?' disabled':'')+'>'+(it.unit?'<span class="num-unit">'+esc(it.unit)+'</span>':'')+'</div>';
    if(it.kind==='short') return '<input class="input short-in" type="text" data-pa="'+i+'" value="'+esc(v||'')+'" placeholder="Your answer"'+(submitted?' disabled':'')+'>';
    var att=state.attach[key];
    var tools=submitted?'':'<div class="ans-tools"><button class="tool" data-ins="'+i+'|\u2192">\u2192</button><button class="tool" data-ins="'+i+'|\u00b2">x\u00b2</button><button class="tool" data-ins="'+i+'|\u207b">x\u207b</button><button class="tool wide" data-eq="'+i+'">'+IK_FX+'Insert equation</button><button class="tool wide" data-attach="'+i+'">'+IK_CLIP+'Attach image</button><input type="file" accept="image/*" data-file="'+i+'" hidden></div>';
    return tools+'<textarea class="ans" data-pa="'+i+'" placeholder="Write your answer\u2026 use $\u2026$ for equations"'+(submitted?' disabled':'')+'>'+esc(v||'')+'</textarea>'+(att?'<div class="attach-chip">'+IK_CLIP+'<span>'+esc(att)+'</span>'+(submitted?'':'<button class="ax" data-unattach="'+i+'" aria-label="Remove attachment">'+IK_NO+'</button>')+'</div>':'');
  }

  function resWrap(cls,score,title,sub,smart,i,body){
    return '<div class="pres '+cls+'"><div class="pres-hd"><span class="pl">'+mpLetter(i)+'</span>'+
      '<span class="pscore">'+score+'</span><span class="plbl"><b>'+esc(title)+'</b><span>'+esc(sub)+'</span></span>'+
      (smart?'<span class="smk">'+I.spark+'Smart Mark</span><button class="report" data-act="report">Report</button>':'<span class="smk auto">Auto-marked</span>')+
      '</div><div class="pres-body">'+body+'</div></div>';
  }
  function mpModel(it){
    if(!it.model) return '';
    if(isSub()) return '<div class="modbox sm">'+I.book+'<b>Model.</b> '+m(it.model)+'</div>';
    return '<div class="model"><div class="modhd" style="color:var(--fg-4);cursor:default">'+I.lock+'Model answer with Premium</div></div>';
  }
  function rubricHitMiss(qq,score){
    return '<ul class="rubric hitmiss">'+qq.scheme.map(function(pt,j){ var hit=j<score; return '<li class="'+(hit?'hit':'miss')+'"><span class="box">'+(hit?IK_OK:IK_NO)+'</span><span class="rtext">'+esc(pt)+'</span></li>'; }).join('')+'</ul>';
  }
  function mpSmartMark(qq,it,i){
    var key=mpKey(qq,i), low=state.confidence==='low', scheme=it.scheme||[];
    if(low){
      var ticks=state.ticks[key]||{}, aw=Object.keys(ticks).filter(function(k){return ticks[k];}).length;
      var rub=scheme.map(function(pt,j){ return '<li class="'+(ticks[j]?'ticked':'')+'" data-ptick="'+i+'|'+j+'"><span class="box">'+IK_OK+'</span><span class="rtext">'+esc(pt)+'</span></li>'; }).join('');
      return resWrap('low','?','Smart Mark isn\u2019t sure','low confidence \u2014 self-assess',true,i,'<div class="uncertain-note">'+IK_WARN+'<span>We couldn\u2019t confidently mark this part. Check it against the scheme below and award your own marks \u2014 tap each point you\u2019ve met.</span></div><ul class="rubric">'+rub+'</ul><div class="selfscore"><span>Your self-assessed mark</span><b>'+aw+' / '+it.marks+'</b></div>'+mpModel(it));
    }
    var s=it.marks<=2?it.marks:it.marks-1;
    var rub2=scheme.map(function(pt,j){ var hit=j<s; return '<li class="'+(hit?'hit':'miss')+'"><span class="box">'+(hit?IK_OK:IK_NO)+'</span><span class="rtext">'+esc(pt)+'</span></li>'; }).join('');
    var fb=s===it.marks?'<b>Full marks.</b> Clear, complete and well linked.':'<b>'+s+' of '+it.marks+'.</b> To earn the last mark: '+esc((scheme[scheme.length-1]||'').toLowerCase())+'.';
    return resWrap('high',s+' / '+it.marks,'Marked','graded against the mark scheme',true,i,'<p class="fb">'+fb+'</p>'+ '<ul class="rubric hitmiss">'+rub2+'</ul>'+mpModel(it));
  }
  function mpResult(qq,it,i){
    var key=mpKey(qq,i), v=state.answers[key];
    if(it.kind==='mcq'){ var ok=v===it.correct; return resWrap(ok?'ok':'no',(ok?it.marks:0)+' / '+it.marks,ok?'Correct':'Incorrect','multiple choice',false,i,'<p class="fb">'+(ok?'Well done. ':'The correct answer is <b>'+esc(it.correct)+'</b>. ')+esc(it.explain||'')+'</p>'); }
    if(it.kind==='multi'){ var sel=Array.isArray(v)?v:[], ok2=sameSet(sel,it.correct); return resWrap(ok2?'ok':'no',(ok2?it.marks:0)+' / '+it.marks,ok2?'Correct':'Not quite','select all that apply',false,i,'<p class="fb">'+(ok2?'All correct options selected. ':'Correct options: <b>'+it.correct.map(esc).join(', ')+'</b>. ')+esc(it.explain||'')+'</p>'); }
    if(it.kind==='numeric'){ var num=parseFloat(String(v||'').replace(/[^0-9.eE\-]/g,'')); var ok3=isFinite(num)&&Math.abs(num-it.answer)<=(it.tol||0); return resWrap(ok3?'ok':'no',(ok3?it.marks:0)+' / '+it.marks,ok3?'Correct':'Not quite','numeric answer',false,i,'<p class="fb">'+(ok3?'Correct. ':'Expected <b>'+esc(String(it.answer))+(it.unit?' '+esc(it.unit):'')+'</b>. ')+esc(it.explain||'')+'</p>'+(it.model?'<div class="modbox sm">'+m(it.model)+'</div>':'')); }
    return mpSmartMark(qq,it,i);
  }
  function mpMarkGate(it,i){
    return resWrap('gate','\u2013 / '+it.marks,'Smart Mark is Premium','instant AI marking',false,i,'<p class="fb">Your answer is saved. Instant Smart Mark against the exam mark scheme is part of Premium.</p><button class="btn btn-accent" data-act="subscribe">'+I.crown+'Unlock Smart Mark</button>');
  }
  function legacyLockedCard(qq,cb,mb){
    return '<section class="qcard"><div class="qcard-hd"><div class="qtags">'+cb+mb+'<span class="chip chip-marks">'+qq.marks+' marks</span></div><div class="qtitle-row"><span class="qtitle">Question '+qq.n+'</span></div></div>'+stemHTML(qq)+'</section>';
  }
  function regwallModalHTML(qq){
    return '<div class="rw-scrim"><div class="rw-modal" role="dialog" aria-modal="true" aria-label="Create a free account">'+
      '<button class="rw-x" data-act="rw-close" aria-label="Close">'+I.close+'</button>'+
      '<span class="rw-ic">'+I.spark+'</span>'+
      '<h2>Create a free account to mark this</h2>'+
      '<p>Your answer is saved. Sign up free \u2014 no card needed \u2014 and Smart Mark grades it instantly against the mark scheme.</p>'+
      '<button class="btn btn-primary lg block gbtn" data-act="rw-createfree">'+IK_GOOG+'Continue with Google</button>'+
      '<div class="rw-or"><span>or</span></div>'+
      '<button class="btn btn-secondary block" data-act="rw-createfree">Sign up with email</button>'+
      '<p class="rw-fine">'+I.lock+'Free forever \u00b7 Your answer stays exactly as you left it</p>'+
      '<p class="rw-switch">Already have an account? <a href="#" data-act="rw-createfree">Log in</a></p>'+
    '</div></div>';
  }
  function multiPartCardHTML(qq){
    var submitted=!!state.submitted[qq.id];
    var cb=qq.contentFree?'<span class="chip chip-free">'+I.check+'Free to read</span>':'<span class="chip chip-premium">'+I.crown+'Premium</span>';
    var mb=qq.markFree?'<span class="chip chip-neutral">Free marking</span>':'<span class="chip chip-premium">'+I.spark+'Smart Mark \u00b7 Premium</span>';
    if(!canSee(qq)) return legacyLockedCard(qq,cb,mb);
    var parts=qq.items.map(function(it,i){
      return '<div class="mp-part"><div class="mp-phd"><span class="mp-pl">'+mpLetter(i)+'</span><span class="mp-kind">'+kindLabel(it.kind)+'</span><span class="mp-pm">'+it.marks+' mark'+(it.marks>1?'s':'')+'</span></div><div class="mp-prompt">'+m(it.prompt)+'</div>'+mpInput(qq,it,i)+'</div>';
    }).join('');
    var submitBar=submitted?'':'<div class="mp-submit"><button class="btn btn-primary lg" data-act="submitq">'+I.spark+'Submit question</button><span class="mp-note">'+(qq.markFree?'Instant marking \u2014 free':'Auto-marked parts are free \u00b7 Smart Mark is Premium')+'</span></div>';
    var feedback;
    if(!submitted){ feedback='<div class="mp-fb-empty">'+I.spark+'<p>Answer the parts, then submit \u2014 your marks and feedback appear here.</p></div>'; }
    else { feedback=qq.items.map(function(it,i){ var auto=(it.kind==='mcq'||it.kind==='multi'||it.kind==='numeric'); return (auto||canMark(qq))?mpResult(qq,it,i):mpMarkGate(it,i); }).join(''); }
    return '<section class="qcard mp">'+
      '<div class="qcard-hd"><div class="qtags">'+cb+mb+'<span class="chip chip-marks">'+qq.marks+' marks</span></div>'+
      '<div class="qtitle-row"><span class="qtitle">Question '+qq.n+'</span><span class="diff-label">'+I.signal+'Difficulty \u00b7 '+activeTier().label+'</span></div></div>'+
      '<div class="mp-grid'+(submitted?' marked':'')+'">'+
        '<div class="mp-answer"><div class="qstem">'+m(qq.stem)+'</div>'+parts+submitBar+'</div>'+
        '<div class="mp-feedback">'+feedback+'</div>'+
      '</div>'+
      (state.regwall===qq.id?regwallModalHTML(qq):'')+
    '</section>';
  }
  function mpSelect(sv){ var p=sv.split('|'), i=parseInt(p[0],10), k=p[1]; var qq=q(state.qid); if(state.submitted[qq.id]) return; var it=qq.items[i], key=mpKey(qq,i);
    if(it.kind==='multi'){ var arr=Array.isArray(state.answers[key])?state.answers[key].slice():[]; var at=arr.indexOf(k); if(at>=0) arr.splice(at,1); else arr.push(k); state.answers[key]=arr; }
    else state.answers[key]=k; render(); }
  function mpTick(sv){ var p=sv.split('|'), i=parseInt(p[0],10), j=parseInt(p[1],10); var qq=q(state.qid), key=mpKey(qq,i); state.ticks[key]=state.ticks[key]||{}; state.ticks[key][j]=!state.ticks[key][j]; render(); }
  function mpInsert(sv){ var bar=sv.indexOf('|'); var i=parseInt(sv.slice(0,bar),10), sym=sv.slice(bar+1); var qq=q(state.qid), key=mpKey(qq,i); state.answers[key]=(state.answers[key]||'')+sym; render(); }
  function mpEq(i){ var qq=q(state.qid), key=mpKey(qq,i); state.answers[key]=(state.answers[key]||'')+' $x^{2}$ '; toast('Equation added \u2014 edit inside the $\u2026$'); render(); }
  function submitQuestion(){ var qq=q(state.qid); if(!isLogged()){ state.regwall=qq.id; return render(); } state.submitted[qq.id]=true; state.marks[qq.id]={mode:'mp'}; render(); }

  document.getElementById('app').addEventListener('input', function(e){
    var t=e.target; if(!t.matches) return;
    if(t.matches('[data-pa]')){ var qq=q(state.qid); state.answers[mpKey(qq,parseInt(t.getAttribute('data-pa'),10))]=t.value; }
  });
  document.getElementById('app').addEventListener('change', function(e){
    var t=e.target; if(t.matches&&t.matches('input[data-file]')){ var f=t.files&&t.files[0]; if(f){ var qq=q(state.qid); state.attach[mpKey(qq,parseInt(t.getAttribute('data-file'),10))]=f.name; render(); } }
  });
  document.getElementById('app').addEventListener('mousedown', function(e){
    if(e.target.classList&&e.target.classList.contains('rw-scrim')){ state.regwall=null; render(); }
  });

  var toastTimer;
  function toast(msg){
    var t = document.getElementById('toast');
    if (!t){ t = document.createElement('div'); t.id='toast'; t.className='toast'; document.body.appendChild(t); }
    t.innerHTML = I.check + '<span>'+msg+'</span>';
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function(){ t.classList.remove('show'); }, 2400);
  }

  // ─────────────────────────── events ───────────────────────────
  function onClick(e){
    var el = e.target.closest('[data-act],[data-q],[data-step],[data-tick],[data-tier],[data-dl],[data-menu],[data-sheet],[data-ct],[data-concept],[data-topic-toggle],[data-subject],[data-rate],[data-paper-tier],[data-paper-dl],[data-opt],[data-ptick],[data-ins],[data-eq],[data-attach],[data-unattach],[data-dlq],[data-dlm],[data-note-toggle],[data-goto],[data-restopic]');
    if (!el) return;
    if (el.hasAttribute('data-paper-tier')){ state.paperTier=el.getAttribute('data-paper-tier'); return render(); }
    if (el.hasAttribute('data-paper-dl')){
      var pfree = el.getAttribute('data-free')==='1';
      if (!pfree && !isSub()) return toast('Mark schemes &amp; model solutions are part of Premium');
      var pk = el.getAttribute('data-paper-dl');
      var pmsg = pk==='qp' ? 'Preparing the question paper PDF…'
        : pk==='ms' ? 'Preparing the mark scheme PDF…'
        : pk==='zip' ? 'Preparing every paper (ZIP)…'
        : 'Preparing Pass Revise model solutions…';
      return toast(pmsg);
    }
    if (el.hasAttribute('data-sheet')){ var sk=el.getAttribute('data-sheet'); state.mobileSheet=(state.mobileSheet===sk?null:sk); state.openMenu=null; return render(); }
    if (el.hasAttribute('data-rate')) return fcRate(el.getAttribute('data-rate'));
    if (el.hasAttribute('data-menu')){
      var mm = el.getAttribute('data-menu');
      return mm==='close' ? closeMenu() : openMenu(mm);
    }
    if (el.hasAttribute('data-ct')) return selectContentType(el.getAttribute('data-ct'));
    if (el.hasAttribute('data-concept')) return selectConcept(el.getAttribute('data-concept'));
    if (el.hasAttribute('data-topic-toggle')) return toggleTopic(parseInt(el.getAttribute('data-topic-toggle'),10));
    if (el.hasAttribute('data-note-toggle')){ var nt=el.getAttribute('data-note-toggle'); state.noteOpen[nt]=(state.noteOpen[nt]===false); return render(); }
    if (el.hasAttribute('data-restopic')){ var rt=el.getAttribute('data-restopic'); var _rtT=NAV.topics.find(function(t){return String(t.n)===String(rt);}); if(_rtT&&_rtT.concepts[0]){ state.contentType='resources'; state.topic=_rtT.concepts[0].name; state.level='topic'; state.rzTopicLand=true; } return render(); }
    if (el.hasAttribute('data-goto')){ var gp=el.getAttribute('data-goto').split('|'); return gotoResource(gp[0], gp[1]); }
    if (el.hasAttribute('data-subject')) return selectSubject(el.getAttribute('data-subject'));
    if (el.hasAttribute('data-tier')) return switchTier(el.getAttribute('data-tier'));
    if (el.hasAttribute('data-dl')){
      var kind = el.getAttribute('data-dl');
      if (!isSub()) return toast('Downloads are part of Premium');
      return toast(kind==='pdf' ? 'Preparing the question paper PDF…' : 'Preparing all answers & mark scheme…');
    }
    if (el.hasAttribute('data-dlq')) return toast('Downloading question paper — '+el.getAttribute('data-dlq')+' (PDF)');
    if (el.hasAttribute('data-dlm')) return toast('Downloading mark scheme — '+el.getAttribute('data-dlm')+' (PDF)');
    if (el.hasAttribute('data-q')) return selectQ(el.getAttribute('data-q'));
    if (el.hasAttribute('data-step')) return stepQ(parseInt(el.getAttribute('data-step'),10));
    if (el.hasAttribute('data-tick')) return toggleTick(parseInt(el.getAttribute('data-tick'),10));
    if (el.hasAttribute('data-opt')) return mpSelect(el.getAttribute('data-opt'));
    if (el.hasAttribute('data-ptick')) return mpTick(el.getAttribute('data-ptick'));
    if (el.hasAttribute('data-ins')) return mpInsert(el.getAttribute('data-ins'));
    if (el.hasAttribute('data-eq')) return mpEq(parseInt(el.getAttribute('data-eq'),10));
    if (el.hasAttribute('data-attach')){ var fin=el.parentNode.querySelector('input[data-file]'); if(fin) fin.click(); return; }
    if (el.hasAttribute('data-unattach')){ var qqu=q(state.qid); delete state.attach[mpKey(qqu,parseInt(el.getAttribute('data-unattach'),10))]; return render(); }
    var act = el.getAttribute('data-act');
    if (act==='exam-start') return startExam(parseInt(el.dataset.no,10), el.dataset.ptier, parseInt(el.dataset.marks,10), parseInt(el.dataset.mins,10), el.dataset.year);
    if (act==='exam-begin'){ state.exam.phase='running'; state.exam.qi=0; return render(); }
    if (act==='exam-prev'){ if(state.exam.qi>0){ state.exam.qi--; render(); } return; }
    if (act==='exam-next'){ if(state.exam.qi<state.exam.qids.length-1){ state.exam.qi++; render(); } return; }
    if (act==='exam-jump'){ state.exam.qi=parseInt(el.dataset.qi,10); state.exam.phase='running'; return render(); }
    if (act==='exam-flag'){ var fid=state.exam.qids[state.exam.qi]; state.exam.flags[fid]=!state.exam.flags[fid]; return render(); }
    if (act==='exam-review'){ state.exam.phase='review'; return render(); }
    if (act==='exam-resume'){ state.exam.phase='running'; return render(); }
    if (act==='exam-submit') return examSubmit(false);
    if (act==='exam-restart'){ state.exam.ans={}; state.exam.flags={}; state.exam.remaining=state.exam.mins*60; state.exam.phase='intro'; state.exam.qi=0; return render(); }
    if (act==='exam-exit'){ if((state.exam&&(state.exam.phase==='running'||state.exam.phase==='review')) && !confirm('Leave the exam? Answers in this attempt will be lost.')) return; clearInterval(examTimer); state.exam=null; return render(); }
    if (act==='mark') return markAnswer();
    if (act==='submitq') return submitQuestion();
    if (act==='rw-close'){ state.regwall=null; return render(); }
    if (act==='rw-createfree'){ e.preventDefault(); var rid=state.regwall; state.regwall=null; state.visitor='free'; if(rid){ state.submitted[rid]=true; state.marks[rid]={mode:'mp'}; } toast('Free account created — marking your answer'); return render(); }
    if (act==='save') return toast('Saved for later');
    if (act==='notedone'){ state.noteDone=!state.noteDone; return render(); }
    if (act==='playvideo') return toast('Video player coming soon');
    if (act==='reslink'){ e.preventDefault(); return toast('Opening resource…'); }
    if (act==='report') return toast('Thanks — this mark has been flagged for review');
    if (act==='togglemodel'){ var id=state.qid; state.modelOpen[id]=!state.modelOpen[id]; if(state.modelOpen[id]) state.pending[id+':model']=true; return render(); }
    if (act==='collapsenav'){ state.navCollapsed=true; return render(); }
    if (act==='expandnav'){ state.navCollapsed=false; return render(); }
    if (act==='examindex' || act==='notesindex' || act==='rescourse'){ state.level='course'; return render(); }
    if (act==='gototopic'){ state.level='topic'; return render(); }
    if (act==='opentopics'){ state.mobileSheet='topics'; return render(); }
    if (act==='closesheet'){ state.mobileSheet=null; return render(); }
    if (act==='alltopics'){ NAV.topics.forEach(function(t){ state.openTopics[t.n]=true; }); return render(); }
    if (act==='fcflip'){ state.fcFlipped=!state.fcFlipped; return render(); }
    if (act==='fcnext'){ state.fcIdx=Math.min(state.fcIdx+1, FC().length); state.fcFlipped=false; return render(); }
    if (act==='fcprev'){ state.fcIdx=Math.max(0, state.fcIdx-1); state.fcFlipped=false; return render(); }
    if (act==='fcshuffle'){ for(var i=FC().length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=window.FLASHCARDS[i];window.FLASHCARDS[i]=window.FLASHCARDS[j];window.FLASHCARDS[j]=t;} state.fcIdx=0;state.fcFlipped=false;state.fcRating={}; toast('Deck shuffled'); return render(); }
    if (act==='fcrestart'){ state.fcIdx=0;state.fcFlipped=false;state.fcRating={}; return render(); }
    if (act==='fcreview'){ state.fcIdx=0;state.fcFlipped=false; return render(); }
    if (act==='login'){ state.visitor='free'; toast('Logged in — Free account'); return render(); }
    if (act==='createfree'){ state.visitor='free'; toast('Free account created — mark away'); return render(); }
    if (act==='subscribe'){ toast('Premium unlocked'); return unlockInPlace('subscriber'); }
  }
  document.getElementById('app').addEventListener('click', onClick);
  document.getElementById('app').addEventListener('input', function(e){
    if (e.target.matches('[data-exam-ans]')){ if(state.exam) state.exam.ans[e.target.getAttribute('data-exam-ans')]=e.target.value; return; }
    if (e.target.matches('[data-ans]')) state.answers[state.qid] = e.target.value;
  });

  // close the topic dropdown when clicking outside it
  document.addEventListener('click', function(e){
    if (state.openMenu==='topic' && !e.target.closest('.topicsel-wrap')) closeMenu();
  });

  // cockpit
  document.getElementById('cockpit').addEventListener('click', function(e){
    var b = e.target.closest('button'); if(!b) return;
    var seg = b.parentElement.getAttribute('data-seg');
    [].forEach.call(b.parentElement.children, function(c){ c.classList.remove('on'); });
    b.classList.add('on');
    if (seg==='visitor'){
      var v = b.getAttribute('data-v');
      // switching visitor uses the SAME unlock-in-place path (cold-load reveal)
      if (v==='subscriber' && !isSub()) return unlockInPlace('subscriber');
      state.visitor = v; render();
    } else if (seg==='confidence'){
      state.confidence = b.getAttribute('data-c');
      // re-mark current question if already marked, to reflect the new certainty
      if (state.marks[state.qid]) markAnswer(); else render();
    } else if (seg==='device'){
      state.device = b.getAttribute('data-d'); render();
    } else if (seg==='theme'){
      document.documentElement.setAttribute('data-theme', b.getAttribute('data-t'));
    }
  });

  // KaTeX may load after first paint (deferred) — re-render once ready
  window.addEventListener('load', function(){ setTimeout(render, 30); });

  try {
    var _qp = new URLSearchParams(location.search);
    var _view=_qp.get('view');
    if (_view==='resources') state.contentType='resources';
    var _cc = _qp.get('concept'), _hit=null;
    if (_cc){ NAV.topics.forEach(function(t){ t.concepts.forEach(function(c){ if(c.name===_cc) _hit=c.name; }); }); if(_hit){ state.topic=_hit; NAV.topics.forEach(function(t){ if(t.concepts.some(function(c){return c.name===_hit;})) state.openTopics[t.n]=true; }); state.level = (_view==='resources') ? 'topic' : 'concept'; } }
    var _tn = _qp.get('topicn');
    if (_tn){ var _t = NAV.topics.find(function(t){ return String(t.n)===String(_tn); }); if(_t && _t.concepts[0]){ state.topic=_t.concepts[0].name; state.openTopics[_t.n]=true; state.level='topic'; state.rzTopicLand=true; if(!_view) state.contentType='resources'; } }
    if (_view==='resources' && !_cc && !_tn) state.level='course';
  } catch(e){}
  render();
})();
