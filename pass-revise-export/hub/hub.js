// Pass Revise — Hub template (Qualification → Subject → Board → Course).
// ONE render pipeline serves all four levels; state.level flexes which sections
// show and what the shared "children grid" lists. Framework-agnostic vanilla JS,
// state-driven render → ports cleanly to a Vue SFC (state→data, render→template).
(function () {
  'use strict';
  var HUB = window.HUB, P = HUB.path;

  var state = {
    level: 'qual',        // qual | subject | board | course  (the Tweak the demo drives)
    visitor: 'guest',     // guest | free | subscriber
    device: 'desktop',    // desktop | mobile
    theme: 'light',
    menuOpen: false,      // mobile nav drawer
    acctOpen: false       // account dropdown
  };

  // ─────────────────────────── icons + logo ───────────────────────────
  var I = {
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>',
    crown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-7 5 7 4-3-1.6 11H4.6L3 8z"/></svg>',
    right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5A2.5 2.5 0 0 1 6.5 3z"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    cards:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/></svg>',
    refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/><path d="M3 21v-5h5"/></svg>',
    grad:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m22 10-10-5L2 10l10 5 10-5Z"/><path d="M6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/></svg>',
    check2:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'
  };
  var MARK_SVG = '<svg class="mk" viewBox="0 0 295 325" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M193.03,174.82l-9.48,12.3c-15.05,19.53-43.07,23.15-62.6,8.1l-62.6-48.26c-13.16-10.15-15.61-29.04-5.46-42.19,10.15-13.16,29.04-15.6,42.2-5.46l50.3,38.77L236.08,20.43C216.07,7.52,192.26,0,166.68,0H30C13.43,0,0,13.43,0,30v264.81c0,16.57,13.43,30,30,30,33.05,0,62.07-21.98,71.03-53.79l4.11-14.59h61.53c70.81,0,128.22-57.41,128.22-128.22h0c0-23.16-6.17-44.86-16.91-63.61l-84.96,110.21Z" fill="var(--color-primary)"/></svg>';

  // ─────────────────────────── helpers ───────────────────────────
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function isLogged(){ return state.visitor !== 'guest'; }
  function isSub(){ return state.visitor === 'subscriber'; }
  function initials(name){
    var w = name.split(/\s+/);
    return (w.length>1 ? (w[0][0]+w[1][0]) : name.slice(0,2)).toUpperCase();
  }
  var EXAM = '../exam-question/Exam Question.html';

  // per-level copy + config — the single source that flexes the shared template
  function levels(){
    return {
      qual: {
        eyebrow:'Qualification', title:P.qual, kicker:'Free ' + P.qual + ' revision',
        lede:'Free revision notes, exam questions and past papers for every '+P.qual+' subject and exam board — mapped to the latest specifications and marked the way examiners do.',
        childTitle:'Choose your subject', childSub:'Spec-matched revision for every '+P.qual+' subject and board.'
      },
      subject: {
        eyebrow:P.qual+' · Subject', title:P.qual+' '+P.subject, kicker:P.qual+' '+P.subject,
        lede:'Pick your exam board to get '+P.subject+' revision matched to your exact specification — notes, questions, past papers and mock exams.',
        childTitle:'Choose your exam board', childSub:'We cover every major board for '+P.qual+' '+P.subject+'.'
      },
      board: {
        eyebrow:P.qual+' '+P.subject+' · Exam board', title:P.board+' '+P.qual+' '+P.subject, kicker:P.board+' '+P.subject,
        lede:P.board+'-specific '+P.subject+' courses, matched to the latest '+P.board+' specification. Choose the course that matches your school’s entry.',
        childTitle:'Courses', childSub:'Choose your '+P.board+' '+P.subject+' entry.'
      },
      course: {
        eyebrow:'Course', title:P.board+' '+P.qual+' '+P.subject, kicker:P.board+' '+P.subject,
        lede:'Everything for '+P.board+' '+P.qual+' '+P.subject+' — revision notes, exam questions with instant Smart Mark, past papers and mock exams, all mapped to specification '+P.spec+'.',
        childTitle:'Study materials', childSub:'Pick up where you left off, or start something new.'
      }
    };
  }

  // ─────────────────────────── header ───────────────────────────
  function acctMenuHTML(){
    return '<div class="acct-menu" role="menu">'+
      '<div class="acct-head"><b>Amara Okafor</b><span>Signed in'+(isSub()?' \u00b7 Premium':'')+'</span></div>'+
      '<a role="menuitem" href="../dashboard/Dashboard.html">'+I.grad+'Dashboard</a>'+
      '<a role="menuitem" href="../dashboard/Dashboard.html">'+I.folder+'My courses</a>'+
      '<a role="menuitem" href="../Account.html">'+I.doc+'Saved</a>'+
      '<div class="acct-sep"></div>'+
      '<a role="menuitem" href="../Account.html">'+I.pencil+'Account settings</a>'+
      '<a role="menuitem" href="../Subscription.html">'+I.crown+'Subscription</a>'+
      '<div class="acct-sep"></div>'+
      '<button role="menuitem" data-act="logout">'+I.arrow+'Log out</button>'+
    '</div>';
  }
  function accountHTML(){
    if (state.visitor==='guest') return '<button class="btn btn-ghost" data-act="login">Log in</button><button class="btn btn-primary" data-act="login">Get started</button>';
    var tier = state.visitor==='free' ? '<span class="tier free">Free</span>' : '<span class="tier premium">'+I.crown+'Premium</span>';
    var upgrade = state.visitor==='free' ? '<button class="btn btn-accent" data-act="subscribe">'+I.crown+'Upgrade</button>' : '';
    return '<a class="btn btn-ghost dash-link" href="../dashboard/Dashboard.html">Dashboard</a>'+tier+upgrade+
      '<details class="acct"><summary class="acct-btn" aria-haspopup="true"><span class="avatar">A</span>'+I.chev+'</summary>'+acctMenuHTML()+'</details>';
  }
  function headerHTML(){
    return '<header class="hdr"><div class="hdr-in">'+
      '<button class="icon-btn mob-menu" aria-label="Open menu">'+I.menu+'</button>'+
      '<a class="brand" href="#" data-goto="qual">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'+
      '<nav class="mainnav"><button class="navlink" data-goto="qual">Browse all courses '+I.chev+'</button></nav>'+
      '<label class="search"><span class="s-ic">'+I.search+'</span><input type="text" placeholder="Search topics & questions…" aria-label="Search"></label>'+
      '<div class="hdr-sp"></div>'+
      '<div class="hdr-actions">'+accountHTML()+'</div>'+
    '</div></header>';
  }
  function drawerHTML(){
    var closeSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    var auth = isLogged()
      ? '<a class="btn btn-secondary" href="../dashboard/Dashboard.html">Dashboard</a><a class="btn btn-primary" href="../Account.html">Account</a>'
      : '<button class="btn btn-secondary" data-act="login">Log in</button><button class="btn btn-primary" data-act="login">Get started free</button>';
    return '<div class="hub-scrim'+(state.menuOpen?' show':'')+'" data-drawer-close></div>'+
      '<aside class="hub-drawer'+(state.menuOpen?' show':'')+'" aria-label="Menu">'+
        '<div class="drawer-top"><span class="wm">Pass<em>revise</em></span><button class="icon-btn" data-drawer-close aria-label="Close menu">'+closeSvg+'</button></div>'+
        '<nav class="drawer-nav"><button data-goto="qual">Browse all courses</button><a href="../Search.html">Search</a><a href="../Subscription.html">Pricing</a></nav>'+
        '<div class="drawer-theme"><span>Theme</span><div class="seg-mini"><button data-theme="light" class="'+(state.theme==='light'?'on':'')+'">Light</button><button data-theme="dark" class="'+(state.theme==='dark'?'on':'')+'">Dark</button></div></div>'+
        '<div class="drawer-cta">'+auth+'</div>'+
      '</aside>';
  }
  function fabHTML(){
    var spark='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>';
    return '<button class="hub-fab" data-act="ai" aria-label="AI study assistant — coming soon"><span class="orb">'+spark+'</span>Ask AI<span class="fab-soon">Soon</span></button>';
  }

  // ─────────────────────────── breadcrumb ───────────────────────────
  function crumbHTML(){
    var seg = [{t:'Home', g:'qual'}];
    if (state.level==='qual')    seg.push({t:P.qual, cur:true});
    if (state.level==='subject') { seg.push({t:P.qual, g:'qual'}, {t:P.subject, cur:true}); }
    if (state.level==='board')   { seg.push({t:P.qual, g:'qual'}, {t:P.subject, g:'subject'}, {t:P.board, cur:true}); }
    if (state.level==='course')  { seg.push({t:P.qual, g:'qual'}, {t:P.subject, g:'subject'}, {t:P.board, g:'board'}, {t:P.course, cur:true}); }
    var html = seg.map(function(s,i){
      var sep = i ? '<span class="sep">›</span>' : '';
      if (s.cur) return sep+'<b>'+esc(s.t)+'</b>';
      return sep+'<a href="#" data-goto="'+s.g+'">'+esc(s.t)+'</a>';
    }).join('');
    return '<nav class="crumb" aria-label="Breadcrumb">'+html+'</nav>';
  }

  // ─────────────────────────── hero ───────────────────────────
  function statRowHTML(){
    var s = HUB.stats[state.level]; if (!s) return '';
    return '<div class="hero-stats">'+s.map(function(x){
      return '<div class="hs"><b>'+x[0]+'</b><span>'+x[1]+'</span></div>';
    }).join('')+'</div>';
  }
  function courseCtaHTML(){
    if (isSub())      return '<a class="btn btn-primary lg" href="'+EXAM+'">'+I.arrow+'Go to course</a><a class="btn btn-secondary lg" href="'+EXAM+'">Past papers</a>';
    if (isLogged())   return '<a class="btn btn-primary lg" href="'+EXAM+'">'+I.arrow+'Continue revising</a><button class="btn btn-accent lg" data-act="subscribe">'+I.crown+'Upgrade to Premium</button>';
    return '<a class="btn btn-primary lg" href="'+EXAM+'">'+I.arrow+'Start revising free</a><button class="btn btn-accent lg" data-act="subscribe">'+I.crown+'Get Premium</button>';
  }
  function heroHTML(){
    var L = levels()[state.level], course = state.level==='course';
    var spec = course ? '<span class="spec-chip">'+I.check2+'Specification '+esc(P.spec)+'</span>' : '';
    var right = course
      ? '<div class="hero-cta">'+courseCtaHTML()+'<span class="hero-fine">No card needed to start · Cancel anytime</span></div>'
      : statRowHTML();
    return '<section class="hero'+(course?' hero-course':'')+'"><div class="hero-in">'+
      '<div class="hero-copy">'+
        '<div class="eyebrow">'+esc(L.eyebrow)+'</div>'+
        (spec ? '<div class="hero-spec">'+spec+'</div>' : '')+
        '<h1 class="hero-title">'+esc(L.title)+'</h1>'+
        '<p class="hero-lede">'+esc(L.lede)+'</p>'+
        (course ? '' : '<div class="hero-actions"><a class="btn btn-primary lg" href="#" data-goto="'+nextLevel()+'">'+I.arrow+childCtaLabel()+'</a></div>')+
      '</div>'+
      (right ? '<div class="hero-side">'+right+'</div>' : '')+
    '</div></section>';
  }
  function nextLevel(){ return {qual:'subject', subject:'board', board:'course', course:'course'}[state.level]; }
  function childCtaLabel(){ return {qual:'Browse subjects', subject:'Choose exam board', board:'View course'}[state.level] || 'Explore'; }

  // ─────────────────────────── children grid (the flexing section) ───────────────────────────
  function subjectsGridHTML(){
    var pop = '<div class="pop-row"><span class="pop-lbl">Popular</span>'+HUB.popularSubjects.map(function(n){
      return '<a href="#" class="pop-pill" data-goto="subject">'+esc(n)+'</a>';
    }).join('')+'</div>';
    var cards = HUB.subjects.map(function(s){
      return '<a href="#" class="scard subject-card" data-goto="subject">'+
        '<span class="mono tile-'+s.tone+'">'+esc(initials(s.name))+'</span>'+
        '<span class="scard-tx"><b>'+esc(s.name)+'</b><em>'+s.boards+' exam boards</em></span>'+
        '<span class="scard-go">'+I.right+'</span>'+
      '</a>';
    }).join('');
    return pop + '<div class="grid grid-subjects">'+cards+'</div>';
  }
  function boardsGridHTML(){
    var cards = HUB.boards.map(function(b){
      return '<a href="#" class="scard board-card" data-goto="board">'+
        '<span class="board-badge">'+esc(b.name.split(' ')[0])+'</span>'+
        '<span class="scard-tx"><b>'+esc(b.name)+'</b><em>Spec '+esc(b.spec)+' · '+b.courses+' course'+(b.courses>1?'s':'')+'</em></span>'+
        '<span class="scard-go">'+I.right+'</span>'+
      '</a>';
    }).join('');
    return '<div class="grid grid-boards">'+cards+'</div>';
  }
  function coursesGridHTML(){
    var cards = HUB.courses.map(function(c){
      return '<a href="#" class="ccard'+(c.primary?' ccard-primary':'')+'" data-goto="course">'+
        '<div class="ccard-hd">'+
          '<div class="ccard-tt"><b>'+esc(c.name)+'</b><span class="spec-chip sm">Spec '+esc(c.spec)+'</span></div>'+
          (c.primary?'<span class="ccard-flag">Most popular</span>':'')+
        '</div>'+
        '<div class="ccard-tier">'+esc(c.tier)+'</div>'+
        '<div class="ccard-meta"><span>'+I.list+c.topics+' topics</span><span>'+I.book+c.notes+' notes</span><span>'+I.pencil+c.questions.toLocaleString()+' questions</span><span>'+I.doc+c.papers+' papers</span></div>'+
        '<span class="ccard-go">View course '+I.right+'</span>'+
      '</a>';
    }).join('');
    return '<div class="grid grid-courses">'+cards+'</div>';
  }
  function resourceGridHTML(){
    var cards = HUB.resourceTypes.map(function(r){
      return '<a href="'+EXAM+'" class="rcard">'+
        '<span class="rcard-ic">'+I[r.icon]+'</span>'+
        '<span class="rcard-tx"><b>'+esc(r.label)+'</b><em>'+esc(r.count)+'</em></span>'+
        '<span class="chip chip-'+(r.tone==='free'?'free':'premium')+'">'+esc(r.access)+'</span>'+
      '</a>';
    }).join('');
    return '<div class="grid grid-resources">'+cards+'</div>';
  }
  function childrenSectionHTML(){
    var L = levels()[state.level];
    var grid = state.level==='qual' ? subjectsGridHTML()
      : state.level==='subject' ? boardsGridHTML()
      : state.level==='board' ? coursesGridHTML()
      : resourceGridHTML();
    return '<section class="sec"><div class="sec-in">'+
      '<div class="sec-hd"><h2>'+esc(L.childTitle)+'</h2><p>'+esc(L.childSub)+'</p></div>'+
      grid+
    '</div></section>';
  }

  // ─────────────────────────── course-only sections ───────────────────────────
  function topicsSectionHTML(){
    var items = HUB.topics.map(function(t){
      return '<a href="'+EXAM+'" class="topic-link"><span class="tl-n">'+t.n+'</span><span class="tl-tx">'+esc(t.name)+'</span><span class="tl-q">'+t.q+' questions</span></a>';
    }).join('');
    return '<section class="sec sec-alt"><div class="sec-in">'+
      '<div class="sec-hd row"><div><h2>Topics in this course</h2><p>Mapped to the '+esc(P.board)+' '+esc(P.spec)+' specification.</p></div><a class="btn btn-secondary" href="'+EXAM+'">View all topics'+I.right+'</a></div>'+
      '<div class="topic-list">'+items+'</div>'+
    '</div></section>';
  }
  function includedSectionHTML(){
    var cards = HUB.included.map(function(x){
      return '<div class="inc"><span class="inc-ic">'+I[x.icon]+'</span><div><b>'+esc(x.title)+'</b><p>'+esc(x.body)+'</p></div></div>';
    }).join('');
    return '<section class="sec"><div class="sec-in"><div class="sec-hd"><h2>What’s included</h2></div><div class="grid grid-inc">'+cards+'</div></div></section>';
  }

  // ─────────────────────────── related / internal-link section (intermediate hubs) ───────────────────────────
  function relatedSectionHTML(){
    var title, links;
    if (state.level==='qual'){
      title='Other qualifications';
      links=HUB.quals.filter(function(q){return q.name!==P.qual;}).map(function(q){return {t:q.name+' revision', g:'qual'};});
    } else if (state.level==='subject'){
      title='Popular '+P.qual+' subjects';
      links=HUB.popularSubjects.filter(function(n){return n!==P.subject;}).map(function(n){return {t:P.qual+' '+n, g:'subject'};});
    } else if (state.level==='board'){
      title='Other exam boards for '+P.qual+' '+P.subject;
      links=HUB.boards.filter(function(b){return b.name!==P.board;}).map(function(b){return {t:b.name+' '+P.qual+' '+P.subject, g:'board'};});
    } else return '';
    return '<section class="sec sec-alt"><div class="sec-in"><div class="sec-hd"><h2>'+esc(title)+'</h2></div>'+
      '<div class="linkwrap">'+links.map(function(l){return '<a href="#" class="xlink" data-goto="'+l.g+'">'+esc(l.t)+I.right+'</a>';}).join('')+'</div>'+
    '</div></section>';
  }

  // ─────────────────────────── cta band ───────────────────────────
  function ctaBandHTML(){
    var head, sub, btns;
    if (state.level==='course'){
      head = isLogged()?'Ready to hit your target grade?':'Start revising '+P.board+' '+P.qual+' '+P.subject+' free';
      sub  = 'Join thousands of students revising smarter with Pass Revise.';
      btns = courseCtaHTML();
    } else {
      head = 'Revise smarter, not harder';
      sub  = 'Spec-matched notes, instant Smart Mark and real past papers — free to start.';
      btns = isLogged()
        ? '<a class="btn btn-primary lg" href="'+EXAM+'">'+I.arrow+'Go to my courses</a>'
        : '<button class="btn btn-primary lg" data-act="login">'+I.arrow+'Create free account</button><button class="btn btn-accent lg" data-act="subscribe">'+I.crown+'Get Premium</button>';
    }
    return '<section class="cta-band"><div class="cta-in"><div class="cta-tx"><h2>'+esc(head)+'</h2><p>'+esc(sub)+'</p></div><div class="cta-btns">'+btns+'</div></div></section>';
  }

  // ─────────────────────────── footer ───────────────────────────
  function footerHTML(){
    var col = function(h, arr){ return '<div class="fcol"><h4>'+h+'</h4>'+arr.map(function(t){return '<a href="#" data-goto="qual">'+esc(t)+'</a>';}).join('')+'</div>'; };
    return '<footer class="foot"><div class="foot-in">'+
      '<div class="foot-brand"><a class="brand" href="#" data-goto="qual">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'+
        '<p>Spec-matched revision for GCSE &amp; A-Level. Notes, exam questions, past papers and mocks — marked the way examiners do.</p></div>'+
      '<div class="foot-cols">'+
        col('Qualifications', ['GCSE','A-Level','IGCSE','AS-Level']) +
        col('Popular subjects', ['Biology','Chemistry','Physics','Maths']) +
        col('Company', ['About','Careers','Contact','Blog']) +
        col('Legal', ['Terms','Privacy','Cookies']) +
      '</div>'+
    '</div><div class="foot-base"><span>© 2026 Pass Revise · by Complete Tuition</span><span>Made for UK students</span></div></footer>';
  }

  // ─────────────────────────── render ───────────────────────────
  function render(){
    var app = document.getElementById('app');
    var mob = state.device==='mobile';
    app.className = 'app'+(mob?' is-mobile':'');
    document.documentElement.setAttribute('data-theme', state.theme);

    var mid = '';
    if (state.level==='course'){
      mid = childrenSectionHTML() + topicsSectionHTML() + includedSectionHTML();
    } else {
      mid = childrenSectionHTML() + relatedSectionHTML();
    }
    app.innerHTML =
      headerHTML() +
      '<div class="hubwrap">'+
        '<div class="crumb-bar"><div class="crumb-bar-in">'+crumbHTML()+'</div></div>'+
        heroHTML() +
        mid +
        ctaBandHTML() +
        footerHTML() +
      '</div>' + drawerHTML() + fabHTML();
    window.scrollTo(0,0);
    syncCockpit();   // keep the "Hub level" tweak in sync with in-page navigation
  }

  // ─────────────────────────── events ───────────────────────────
  function go(level){ if(HUB && state.level!==level){ state.level=level; render(); } }
  document.getElementById('app').addEventListener('click', function(e){
    if (e.target.closest('.mob-menu')){ state.menuOpen=true; return render(); }
    if (e.target.closest('[data-drawer-close]')){ state.menuOpen=false; return render(); }
    var th = e.target.closest('[data-theme]');
    if (th){ state.theme=th.getAttribute('data-theme'); syncCockpit(); return render(); }
    var g = e.target.closest('[data-goto]');
    if (g){ e.preventDefault(); state.menuOpen=false; if(HUB){ state.level=g.getAttribute('data-goto'); } return render(); }
    var a = e.target.closest('[data-act]');
    if (a){
      var act=a.getAttribute('data-act');
      if (act==='login'){ state.visitor = state.visitor==='guest'?'free':state.visitor; state.menuOpen=false; state.acctOpen=false; syncCockpit(); return render(); }
      if (act==='subscribe'){ state.visitor='subscriber'; state.menuOpen=false; syncCockpit(); return render(); }
      if (act==='acct-toggle'){ e.stopPropagation(); state.acctOpen=!state.acctOpen; return render(); }
      if (act==='logout'){ state.visitor='guest'; state.acctOpen=false; syncCockpit(); return render(); }
      if (act==='ai'){ var f=e.target.closest('.hub-fab'); if(f){ var s=f.querySelector('.fab-soon'); if(s){ s.textContent='Coming soon'; setTimeout(function(){ s.textContent='Soon'; },1500); } } return; }
    }
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && (state.menuOpen||state.acctOpen)){ state.menuOpen=false; state.acctOpen=false; render(); } });
  document.addEventListener('click', function(e){ if(state.acctOpen && !e.target.closest('.acct-wrap')){ state.acctOpen=false; render(); } });

  // cockpit (prototype controls, not product UI)
  function syncCockpit(){
    document.querySelectorAll('#cockpit .seg').forEach(function(seg){
      var key = seg.getAttribute('data-seg');
      seg.querySelectorAll('button').forEach(function(b){
        var v = b.getAttribute('data-v')||b.getAttribute('data-l')||b.getAttribute('data-d')||b.getAttribute('data-t');
        var on = (key==='visitor'&&v===state.visitor)||(key==='level'&&v===state.level)||(key==='device'&&v===state.device)||(key==='theme'&&v===state.theme);
        b.classList.toggle('on', on);
      });
    });
  }
  document.getElementById('cockpit').addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    if (b.dataset.l){ state.level=b.dataset.l; }
    else if (b.dataset.v){ state.visitor=b.dataset.v; }
    else if (b.dataset.d){ state.device=b.dataset.d; }
    else if (b.dataset.t){ state.theme=b.dataset.t; }
    else return;
    syncCockpit(); render();
  });

  render();
})();
