// Pass Revise — Dashboard (authed home): populated / empty / first-run states,
// a full onboarding wizard, an Add Course modal, and interactive grade selectors.
// State-driven render → ports cleanly to a Vue SFC. Framework-agnostic vanilla JS.
(function () {
  'use strict';
  var D = window.DASH;
  var EXAM = '../exam-question/Exam Question.html';

  var state = {
    view: 'populated',   // populated | empty | firstrun   (Tweak)
    visitor: 'free',     // free | subscriber              (dashboard is authed)
    device: 'desktop',
    theme: 'light',
    nav: 'dashboard',    // left-nav: dashboard | courses | progress | account
    modal: null,         // null | 'addcourse'
    notified: {},        // whatsNew feature id -> user asked to be notified
    courses: D.courses.map(function(c){ return Object.assign({}, c); }),
    wiz: { step:0, qual:'GCSE', subjects:[], board:null },
    add: { step:0, qual:null, subject:null, board:null }
  };

  // ─────────────────────────── icons + logo ───────────────────────────
  var I = {
    grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5A2.5 2.5 0 0 1 6.5 3z"/></svg>',
    chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>',
    user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',
    crown:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M3 8l4 3 5-7 5 7 4-3-1.6 11H4.6L3 8z"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    right:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg>',
    left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    pencil:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    cards:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="13" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2h-2"/></svg>',
    flame:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2s5 4.5 5 10a5 5 0 0 1-10 0c0-1.5.5-2.7 1-3.5C8 10 8.5 12 10 12c1 0 1.4-1 1-2.5C10.5 7.5 12 5 12 2z"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    chev:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',
    search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
    menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
    target:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.4" fill="currentColor"/></svg>',
    folder:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2Z"/></svg>',
    bookmark:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z"/></svg>'
  };
  var MARK_SVG = '<svg class="mk" viewBox="0 0 295 325" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M193.03,174.82l-9.48,12.3c-15.05,19.53-43.07,23.15-62.6,8.1l-62.6-48.26c-13.16-10.15-15.61-29.04-5.46-42.19,10.15-13.16,29.04-15.6,42.2-5.46l50.3,38.77L236.08,20.43C216.07,7.52,192.26,0,166.68,0H30C13.43,0,0,13.43,0,30v264.81c0,16.57,13.43,30,30,30,33.05,0,62.07-21.98,71.03-53.79l4.11-14.59h61.53c70.81,0,128.22-57.41,128.22-128.22h0c0-23.16-6.17-44.86-16.91-63.61l-84.96,110.21Z" fill="var(--color-primary)"/></svg>';
  var typeIcon = { 'Exam Questions':'pencil','Revision Notes':'book','Past Paper':'doc','Past Papers':'doc','Flashcards':'cards','Mock Exams':'doc' };

  // ─────────────────────────── helpers ───────────────────────────
  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }
  function isSub(){ return state.visitor==='subscriber'; }
  function initials(n){ var w=n.split(/\s+/); return (w.length>1?(w[0][0]+w[1][0]):n.slice(0,2)).toUpperCase(); }
  function greeting(){ var h=new Date().getHours(); return h<12?'Good morning':h<18?'Good afternoon':'Good evening'; }
  function overallPct(){ if(!state.courses.length) return 0; var s=0; state.courses.forEach(function(c){ s+=(c.notes+c.questions)/2; }); return Math.round(s/state.courses.length); }

  // ─────────────────────────── header ───────────────────────────
  function acctMenuHTML(){
    return '<div class="acct-menu" role="menu">'+
      '<div class="acct-head"><b>Amara Okafor</b><span>Signed in'+(isSub()?' \u00b7 Premium':'')+'</span></div>'+
      '<button role="menuitem" data-nav="dashboard">'+I.grid+'<span>Dashboard</span></button>'+
      '<button role="menuitem" data-nav="courses">'+I.book+'<span>My courses</span></button>'+
      '<button role="menuitem" data-nav="saved">'+I.bookmark+'<span>Saved</span></button>'+
      '<div class="acct-sep"></div>'+
      '<a role="menuitem" href="../Account.html">'+I.user+'<span>Account settings</span></a>'+
      '<a role="menuitem" href="../Subscription.html">'+I.crown+'<span>Subscription</span></a>'+
      '<div class="acct-sep"></div>'+
      '<a role="menuitem" href="../Homepage.html">'+I.right+'<span>Log out</span></a>'+
    '</div>';
  }
  function accountHTML(){
    var tier = isSub() ? '<span class="tier premium">'+I.crown+'Premium</span>' : '<span class="tier free">Free</span><button class="btn btn-accent" data-act="subscribe">'+I.crown+'Upgrade</button>';
    return tier+'<details class="acct"><summary class="acct-btn" aria-haspopup="true"><span class="avatar">A</span>'+I.chev+'</summary>'+acctMenuHTML()+'</details>';
  }
  function headerHTML(){
    return '<header class="hdr"><div class="hdr-in">'+
      '<button class="icon-btn mob-menu" aria-label="Menu">'+I.menu+'</button>'+
      '<a class="brand" href="#" data-nav="dashboard">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'+
      '<nav class="mainnav"><a class="navlink" href="../hub/Course Hub.html">Browse all courses '+I.chev+'</a></nav>'+
      '<label class="search"><span class="s-ic">'+I.search+'</span><input type="text" placeholder="Search topics & questions…" aria-label="Search"></label>'+
      '<div class="hdr-sp"></div>'+
      '<div class="hdr-actions">'+accountHTML()+'</div>'+
    '</div></header>';
  }
  function drawerHTML(){
    var items = [['dashboard','Dashboard','grid'],['courses','My courses','book'],['progress','Progress','chart'],['saved','Saved','bookmark'],['account','Account','user']];
    var links = items.map(function(it){ var on=state.nav===it[0]; return '<button class="drawer-item'+(on?' on':'')+'" data-nav="'+it[0]+'">'+I[it[2]]+'<span>'+it[1]+'</span></button>'; }).join('');
    var closeSvg='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>';
    return '<div class="dash-scrim" data-drawer-close></div><aside class="dash-drawer" aria-label="Menu">'+
      '<div class="drawer-top"><span class="wm">Pass<em>revise</em></span><button class="icon-btn" data-drawer-close aria-label="Close menu">'+closeSvg+'</button></div>'+
      '<nav class="drawer-nav">'+links+'<a class="drawer-item" href="../hub/Course Hub.html">'+I.search+'<span>Browse all courses</span></a></nav>'+
    '</aside>';
  }
  function fabHTML(){
    var spark='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>';
    return '<button class="dash-fab" data-act="ai" aria-label="AI study assistant — coming soon"><span class="orb">'+spark+'</span>Ask AI<span class="fab-soon">Soon</span></button>';
  }

  // ─────────────────────────── global left nav ───────────────────────────
  function sideNavHTML(){
    var items = [['dashboard','Dashboard','grid'],['courses','My courses','book'],['progress','Progress','chart'],['saved','Saved','bookmark'],['account','Account','user']];
    var links = items.map(function(it){
      var on = state.nav===it[0];
      return '<button class="snav-item'+(on?' on':'')+'" data-nav="'+it[0]+'" aria-current="'+on+'">'+I[it[2]]+'<span>'+it[1]+'</span></button>';
    }).join('');
    var upsell = isSub() ? '' :
      '<div class="snav-up"><span class="snav-up-ic">'+I.crown+'</span><b>Go Premium</b><p>Unlock Smart Mark, mocks &amp; model answers.</p><button class="btn btn-accent block sm" data-act="subscribe">Upgrade</button></div>';
    return '<aside class="snav"><nav class="snav-nav">'+links+'</nav>'+upsell+'</aside>';
  }

  // ─────────────────────────── populated dashboard ───────────────────────────
  function continueHTML(){
    var c = D.continue;
    return '<a class="jump" href="'+EXAM+'">'+
      '<div class="jump-l">'+
        '<span class="jump-eyebrow">'+I.clock+'Jump back in</span>'+
        '<div class="jump-badge mono tile-'+c.tone+'">'+esc(initials(c.subject))+'</div>'+
        '<div class="jump-tx"><b>'+esc(c.subject)+' · '+esc(c.topic)+'</b>'+
          '<em>'+esc(c.board+' '+c.qual)+' · '+esc(c.type)+' · '+esc(c.detail)+'</em></div>'+
      '</div>'+
      '<div class="jump-r"><div class="jump-prog"><div class="progress"><i style="width:'+c.pct+'%"></i></div><span>'+c.pct+'%</span></div>'+
        '<span class="btn btn-primary">'+I.arrow+'Continue</span></div>'+
    '</a>';
  }
  function weeklyHTML(){
    var w = D.weekly;
    return '<div class="card mini weekly">'+
      '<div class="mini-hd"><span class="mini-t">This week</span></div>'+
      '<div class="ov-big">'+w.minutes+'<i> min</i></div>'+
      '<p class="ov-sub">Time revised across your courses — no targets, just steady progress.</p>'+
    '</div>';
  }
  function overallHTML(){
    var pct = overallPct();
    return '<div class="card mini overall">'+
      '<div class="mini-hd"><span class="mini-t">Overall progress</span></div>'+
      '<div class="ov-big">'+pct+'<i>%</i></div>'+
      '<div class="progress lg"><i style="width:'+pct+'%"></i></div>'+
      '<p class="ov-sub">Across '+state.courses.length+' courses · derived from what you\u2019ve completed</p>'+
    '</div>';
  }
  function gradeSelHTML(course, kind){
    var scale = D.gradeScales[course.qual] || D.gradeScales.GCSE;
    var val = kind==='current' ? course.current : course.target;
    var opts = scale.map(function(g){ return '<option value="'+g+'"'+(g===val?' selected':'')+'>'+g+'</option>'; }).join('');
    return '<label class="grade '+kind+'"><span>'+(kind==='current'?'Now':'Target')+'</span>'+
      '<select class="grade-sel" data-grade="'+kind+'" data-course="'+course.id+'" aria-label="'+(kind==='current'?'Current':'Target')+' grade">'+opts+'</select></label>';
  }
  function courseCardHTML(c){
    return '<div class="ccard">'+
      '<div class="ccard-top">'+
        '<span class="mono tile-'+c.tone+'">'+esc(initials(c.subject))+'</span>'+
        '<div class="ccard-id"><b>'+esc(c.board+' '+c.qual+' '+c.subject)+'</b>'+
          '<span class="spec-chip sm">Spec '+esc(c.spec)+'</span></div>'+
      '</div>'+
      '<div class="grades">'+gradeSelHTML(c,'current')+'<span class="grade-arrow">'+I.arrow+'</span>'+gradeSelHTML(c,'target')+'</div>'+
      '<div class="cbars">'+
        barHTML('Revision Notes', c.notes) +
        barHTML('Exam Questions', c.questions) +
      '</div>'+
      '<a class="ccard-cont" href="'+EXAM+'"><span class="cc-ic">'+I[typeIcon[c.last.type]]+'</span><span class="cc-tx">Continue · '+esc(c.last.topic)+'<em>'+esc(c.last.type)+' · '+esc(c.last.detail)+'</em></span>'+I.right+'</a>'+
    '</div>';
  }
  function barHTML(label, pct){
    return '<div class="bar"><div class="bar-hd"><span>'+label+'</span><b>'+pct+'%</b></div><div class="progress"><i style="width:'+pct+'%"></i></div></div>';
  }
  function myCoursesHTML(){
    return '<section class="dsec"><div class="dsec-hd"><h2>My courses</h2>'+
      '<button class="btn btn-secondary" data-act="addcourse">'+I.plus+'Add course</button></div>'+
      '<div class="course-grid">'+state.courses.map(courseCardHTML).join('')+'</div></section>';
  }
  function recommendedHTML(){
    var cards = D.recommended.map(function(r){
      var lock = r.access==='premium' && !isSub();
      return '<a class="rec" href="'+EXAM+'"><span class="mono sm tile-'+r.tone+'">'+esc(initials(r.subject))+'</span>'+
        '<div class="rec-tx"><span class="rec-type">'+I[typeIcon[r.type]]+esc(r.type)+(lock?' · Premium':'')+'</span>'+
        '<b>'+esc(r.title)+'</b><em>'+esc(r.reason)+'</em></div>'+I.right+'</a>';
    }).join('');
    return '<section class="dsec"><div class="dsec-hd"><h2>Recommended next</h2></div><div class="rec-grid">'+cards+'</div></section>';
  }
  function whatsNewHTML(){
    var badge = { new:['New','fbadge-new'], beta:['Beta','fbadge-beta'], soon:['Coming soon','fbadge-soon'] };
    var cards = D.whatsNew.map(function(f){
      var b = badge[f.status] || badge.soon;
      var cta;
      if (f.status==='soon'){
        cta = state.notified[f.id]
          ? '<span class="feat-cta done">'+I.check+'We\u2019ll let you know</span>'
          : '<button class="feat-cta ghost" data-act="notify" data-feat="'+f.id+'">Notify me'+I.right+'</button>';
      } else {
        cta = '<a class="feat-cta" href="'+EXAM+'">'+esc(f.cta||'Try it')+I.right+'</a>';
      }
      return '<div class="feat">'+
        '<div class="feat-top"><span class="feat-ic">'+I[f.icon]+'</span><span class="fbadge '+b[1]+'">'+b[0]+'</span></div>'+
        '<b class="feat-t">'+esc(f.title)+'</b>'+
        '<p class="feat-b">'+esc(f.body)+'</p>'+
        cta+
      '</div>';
    }).join('');
    return '<section class="dsec whatsnew"><div class="dsec-hd"><div class="dsec-hd-tx"><h2>What\u2019s new</h2><span class="dsec-sub">Fresh features &amp; what\u2019s coming next</span></div></div>'+
      '<div class="feat-grid">'+cards+'</div></section>';
  }
  function upgradeBandHTML(){    if (isSub()) return '';
    var feats = ['Instant Smart Mark on every question','Full mark schemes &amp; model answers','Timed mock exams','Download notes as PDF'];
    return '<section class="upsell"><div class="upsell-in">'+
      '<div class="upsell-tx"><span class="upsell-eyebrow">'+I.crown+'Pass Revise Premium</span>'+
        '<h2>Unlock everything for '+esc(D.user.name)+'</h2>'+
        '<ul class="upsell-feats">'+feats.map(function(f){return '<li>'+I.check+f+'</li>';}).join('')+'</ul></div>'+
      '<div class="upsell-cta"><div class="price"><b>from {price}</b><span>/mo</span></div>'+
        '<button class="btn btn-accent lg block" data-act="subscribe">'+I.crown+'Get Premium</button>'+
        '<span class="upsell-fine">Cancel anytime</span></div>'+
    '</div></section>';
  }
  function dashboardMainHTML(){
    return '<main class="dmain"><div class="dmain-in">'+
      '<div class="greet"><div><h1>'+greeting()+', '+esc(D.user.name)+' 👋</h1><p>'+(isSub()?'You\u2019re all set — pick up where you left off.':'Pick up where you left off — your notes and questions are ready.')+'</p></div></div>'+
      '<div class="top-row">'+continueHTML()+'<div class="top-mini">'+weeklyHTML()+overallHTML()+'</div></div>'+
      myCoursesHTML()+
      recommendedHTML()+
      whatsNewHTML()+
      upgradeBandHTML()+
    '</div></main>';
  }

  // ─────────────────────────── empty state ───────────────────────────
  function emptyMainHTML(){
    var pop = D.subjectsByQual.GCSE.slice(0,6).map(function(s){
      return '<button class="pop-pill" data-act="addcourse">'+esc(s)+'</button>';
    }).join('');
    return '<main class="dmain"><div class="dmain-in">'+
      '<div class="greet"><div><h1>'+greeting()+', '+esc(D.user.name)+' 👋</h1><p>Let\u2019s set up your first course.</p></div></div>'+
      '<div class="empty"><div class="empty-ic">'+I.book+'</div>'+
        '<h2>Add your first course</h2>'+
        '<p>Pick your qualification, subject and exam board — we\u2019ll match your revision to the exact specification.</p>'+
        '<button class="btn btn-primary lg" data-act="addcourse">'+I.plus+'Add a course</button>'+
        '<div class="empty-pop"><span class="pop-lbl">Popular</span>'+pop+'</div>'+
      '</div>'+
    '</div></main>';
  }

  // ─────────────────────────── first-run onboarding wizard ───────────────────────────
  var WIZ_STEPS = ['Qualification','Subjects','Exam board','Target grades'];
  function wizPickGrid(opts, selected, act, multi){
    return '<div class="pick-grid">'+opts.map(function(o){
      var on = multi ? selected.indexOf(o)>=0 : selected===o;
      return '<button class="pick'+(on?' on':'')+'" data-'+act+'="'+esc(o)+'">'+
        (multi?'<span class="pick-check">'+I.check+'</span>':'')+esc(o)+'</button>';
    }).join('')+'</div>';
  }
  function wizGradesHTML(){
    var scale = D.gradeScales[state.wiz.qual] || D.gradeScales.GCSE;
    return '<div class="wiz-grades">'+state.wiz.subjects.map(function(s){
      var g = state.wiz.grades && state.wiz.grades[s];
      var opts = scale.map(function(x){ return '<option'+(x===g?' selected':'')+'>'+x+'</option>'; }).join('');
      return '<div class="wg-row"><span class="mono sm tile-'+(D.toneFor[s]||'neutral')+'">'+esc(initials(s))+'</span><b>'+esc(s)+'</b>'+
        '<label class="grade target"><span>Target</span><select class="grade-sel" data-wizgrade="'+esc(s)+'">'+opts+'</select></label></div>';
    }).join('')+'</div>';
  }
  function wizBodyHTML(){
    var w = state.wiz;
    if (w.step===0) return '<h2>Which qualification?</h2><p class="wiz-sub">You can add more later.</p>'+wizPickGrid(D.quals, w.qual, 'wizqual', false);
    if (w.step===1){ var subs=D.subjectsByQual[w.qual]||[]; return '<h2>Pick your subjects</h2><p class="wiz-sub">Choose all the '+esc(w.qual)+' subjects you\u2019re studying.</p>'+wizPickGrid(subs, w.subjects, 'wizsubject', true); }
    if (w.step===2) return '<h2>Your exam board</h2><p class="wiz-sub">We\u2019ll match every resource to this board\u2019s spec.</p>'+wizPickGrid(D.boards, w.board, 'wizboard', false);
    return '<h2>Set your target grades</h2><p class="wiz-sub">A target keeps your dashboard focused. You can change these anytime.</p>'+wizGradesHTML();
  }
  function wizCanNext(){
    var w=state.wiz;
    return w.step===0?!!w.qual : w.step===1?w.subjects.length>0 : w.step===2?!!w.board : true;
  }
  function wizardHTML(){
    var w = state.wiz;
    var dots = WIZ_STEPS.map(function(s,i){
      return '<div class="wstep'+(i===w.step?' on':'')+(i<w.step?' done':'')+'"><span class="wstep-n">'+(i<w.step?I.check:(i+1))+'</span><em>'+s+'</em></div>';
    }).join('<span class="wstep-line"></span>');
    var last = w.step===WIZ_STEPS.length-1;
    return '<div class="wiz-shell"><div class="wiz-top"><a class="brand" href="#">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'+
      '<button class="wiz-skip" data-act="wiz-skip">Skip for now</button></div>'+
      '<div class="wiz-card">'+
        '<div class="wsteps">'+dots+'</div>'+
        '<div class="wiz-body">'+wizBodyHTML()+'</div>'+
        '<div class="wiz-foot">'+
          (w.step>0?'<button class="btn btn-secondary" data-act="wiz-back">'+I.left+'Back</button>':'<span></span>')+
          '<button class="btn btn-primary'+(wizCanNext()?'':' is-disabled')+'" data-act="wiz-next">'+(last?'Finish setup':'Continue')+I.right+'</button>'+
        '</div>'+
      '</div>'+
      '<p class="wiz-fine">Step '+(w.step+1)+' of '+WIZ_STEPS.length+'</p>'+
    '</div>';
  }

  // ─────────────────────────── add course modal ───────────────────────────
  var ADD_STEPS = ['Qualification','Subject','Exam board'];
  function addBodyHTML(){
    var a = state.add;
    if (a.step===0) return wizPickGrid(D.quals, a.qual, 'addqual', false);
    if (a.step===1){ var subs=D.subjectsByQual[a.qual]||[]; return wizPickGrid(subs, a.subject, 'addsubject', false); }
    return wizPickGrid(D.boards, a.board, 'addboard', false);
  }
  function addCanNext(){ var a=state.add; return a.step===0?!!a.qual:a.step===1?!!a.subject:!!a.board; }
  function modalHTML(){
    if (state.modal!=='addcourse') return '';
    var a=state.add, last=a.step===ADD_STEPS.length-1;
    var dots = ADD_STEPS.map(function(s,i){ return '<span class="mdot'+(i===a.step?' on':'')+(i<a.step?' done':'')+'"></span>'; }).join('');
    var heads = ['Choose your qualification','Choose your subject','Choose your exam board'];
    return '<div class="modal-scrim" data-act="add-close"><div class="modal" role="dialog" aria-modal="true" aria-label="Add a course">'+
      '<div class="modal-hd"><b>Add a course</b><button class="icon-btn" data-act="add-close" aria-label="Close">'+I.close+'</button></div>'+
      '<div class="modal-dots">'+dots+'</div>'+
      '<div class="modal-body"><h3>'+heads[a.step]+'</h3>'+addBodyHTML()+'</div>'+
      '<div class="modal-foot">'+
        (a.step>0?'<button class="btn btn-secondary" data-act="add-back">'+I.left+'Back</button>':'<span></span>')+
        '<button class="btn btn-primary'+(addCanNext()?'':' is-disabled')+'" data-act="add-next">'+(last?'Add course':'Continue')+I.right+'</button>'+
      '</div>'+
    '</div></div>';
  }

  // ─────────────────────────── render ───────────────────────────
  function render(){
    var app = document.getElementById('app');
    var mob = state.device==='mobile';
    document.documentElement.setAttribute('data-theme', state.theme);
    if (state.view==='firstrun'){
      app.className = 'app onboarding'+(mob?' is-mobile':'');
      app.innerHTML = wizardHTML();
      syncCockpit();
      return;
    }
    app.className = 'app'+(mob?' is-mobile':'');
    var main = state.view==='empty' ? emptyMainHTML() : dashboardMainHTML();
    app.innerHTML = headerHTML() + '<div class="shell">'+ sideNavHTML() + main +'</div>' + modalHTML() + drawerHTML() + fabHTML();
    syncCockpit();
  }

  // ─────────────────────────── events ───────────────────────────
  function seedCourse(qual, subject, board){
    var scale = D.gradeScales[qual]||D.gradeScales.GCSE;
    state.courses.push({ id:subject.toLowerCase()+Date.now(), subject:subject, board:board, qual:qual, spec:'—',
      tone:D.toneFor[subject]||'neutral', current:scale[Math.floor(scale.length/2)], target:scale[Math.max(0,Math.floor(scale.length/2)-2)],
      notes:0, questions:0, last:{topic:'Get started', type:'Revision Notes', detail:'Not started', pct:0} });
  }
  document.getElementById('app').addEventListener('click', function(e){
    if (e.target.closest('.mob-menu')){ document.getElementById('app').classList.toggle('menu-open'); return; }
    if (e.target.closest('[data-drawer-close]')){ document.getElementById('app').classList.remove('menu-open'); return; }
    var el = e.target.closest('[data-nav],[data-act],[data-wizqual],[data-wizsubject],[data-wizboard],[data-addqual],[data-addsubject],[data-addboard]');
    if (!el) return;
    if (el.hasAttribute('data-nav')){ state.nav=el.getAttribute('data-nav'); return render(); }
    // wizard picks
    if (el.hasAttribute('data-wizqual')){ state.wiz.qual=el.getAttribute('data-wizqual'); state.wiz.subjects=[]; return render(); }
    if (el.hasAttribute('data-wizsubject')){ var s=el.getAttribute('data-wizsubject'); var i=state.wiz.subjects.indexOf(s); if(i>=0)state.wiz.subjects.splice(i,1); else state.wiz.subjects.push(s); return render(); }
    if (el.hasAttribute('data-wizboard')){ state.wiz.board=el.getAttribute('data-wizboard'); return render(); }
    // add-course picks
    if (el.hasAttribute('data-addqual')){ state.add.qual=el.getAttribute('data-addqual'); state.add.subject=null; return render(); }
    if (el.hasAttribute('data-addsubject')){ state.add.subject=el.getAttribute('data-addsubject'); return render(); }
    if (el.hasAttribute('data-addboard')){ state.add.board=el.getAttribute('data-addboard'); return render(); }
    var act = el.getAttribute('data-act'); if(!act) return;
    if (act==='subscribe'){ state.visitor='subscriber'; return render(); }
    if (act==='ai'){ var f=e.target.closest('.dash-fab'); if(f){ var s=f.querySelector('.fab-soon'); if(s){ s.textContent='Coming soon'; setTimeout(function(){ s.textContent='Soon'; },1500); } } return; }
    if (act==='notify'){ state.notified[el.getAttribute('data-feat')]=true; return render(); }
    if (act==='addcourse'){ state.add={step:0,qual:null,subject:null,board:null}; state.modal='addcourse'; return render(); }
    if (act==='add-close'){ if(e.target.closest('.modal')&&!e.target.closest('[data-act=add-close]')) return; state.modal=null; return render(); }
    if (act==='add-back'){ if(state.add.step>0) state.add.step--; return render(); }
    if (act==='add-next'){ if(!addCanNext()) return; if(state.add.step<ADD_STEPS.length-1){ state.add.step++; } else { seedCourse(state.add.qual,state.add.subject,state.add.board); state.modal=null; state.view='populated'; } return render(); }
    // wizard nav
    if (act==='wiz-skip'){ state.view='empty'; return render(); }
    if (act==='wiz-back'){ if(state.wiz.step>0) state.wiz.step--; return render(); }
    if (act==='wiz-next'){ if(!wizCanNext()) return; if(state.wiz.step<WIZ_STEPS.length-1){ if(state.wiz.step===1&&!state.wiz.grades) state.wiz.grades={}; state.wiz.step++; } else { finishWizard(); } return render(); }
  });
  function finishWizard(){
    // seed courses from wizard choices, then land on the populated dashboard
    var made = state.wiz.subjects.map(function(s){
      var scale=D.gradeScales[state.wiz.qual]||D.gradeScales.GCSE;
      return { id:s.toLowerCase()+Date.now()+Math.random(), subject:s, board:state.wiz.board, qual:state.wiz.qual, spec:'—',
        tone:D.toneFor[s]||'neutral', current:scale[Math.floor(scale.length/2)], target:(state.wiz.grades&&state.wiz.grades[s])||scale[Math.max(0,Math.floor(scale.length/2)-2)],
        notes:0, questions:0, last:{topic:'Get started',type:'Revision Notes',detail:'Not started',pct:0} };
    });
    if (made.length) state.courses = made;
    state.view='populated'; state.nav='dashboard';
  }
  // grade selects (change)
  document.getElementById('app').addEventListener('change', function(e){
    var g=e.target.closest('[data-grade]');
    if (g){ var c=state.courses.find(function(x){return x.id===g.getAttribute('data-course');}); if(c){ c[g.getAttribute('data-grade')]=e.target.value; } return; }
    var wg=e.target.closest('[data-wizgrade]');
    if (wg){ state.wiz.grades=state.wiz.grades||{}; state.wiz.grades[wg.getAttribute('data-wizgrade')]=e.target.value; }
  });

  // ─────────────────────────── cockpit ───────────────────────────
  function syncCockpit(){
    document.querySelectorAll('#cockpit .seg').forEach(function(seg){
      var key=seg.getAttribute('data-seg');
      seg.querySelectorAll('button').forEach(function(b){
        var v=b.dataset.view||b.dataset.v||b.dataset.d||b.dataset.t;
        var on=(key==='view'&&v===state.view)||(key==='visitor'&&v===state.visitor)||(key==='device'&&v===state.device)||(key==='theme'&&v===state.theme);
        b.classList.toggle('on', on);
      });
    });
  }
  document.getElementById('cockpit').addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    if (b.dataset.view){ state.view=b.dataset.view; if(b.dataset.view==='firstrun'){ state.wiz={step:0,qual:'GCSE',subjects:[],board:null,grades:{}}; } }
    else if (b.dataset.v){ state.visitor=b.dataset.v; }
    else if (b.dataset.d){ state.device=b.dataset.d; }
    else if (b.dataset.t){ state.theme=b.dataset.t; }
    else return;
    render();
  });

  render();
})();
