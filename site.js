/* ============================================================================
 * Pass Revise — shared PUBLIC chrome behaviours + injector.
 * Pages set window.SITE = { active, authed, name, plan } BEFORE this script,
 * then include <script src="site.js"> (or ../site.js from a subfolder).
 * Injects header / footer / AI FAB / cookie banner / mobile drawer and wires
 * theme toggle, Start-Studying mega-menu, account dropdown, drawer, CMP.
 * Exposes window.PRSite = { QUALS, SUBJECTS, BOARDS, TONES, initials, base }.
 * ==========================================================================*/
(function(){
  var cfg = window.SITE || {};
  var authed = !!cfg.authed;
  var active = cfg.active || '';
  var name = cfg.name || 'Amara Okafor';
  var plan = cfg.plan || 'free'; // 'free' | 'premium'
  // path prefix so subfolder pages (auth/, exam-question/, dashboard/) link correctly
  var base = cfg.base != null ? cfg.base : '';

  var QUALS = ['GCSE','A-Level','IGCSE','AS-Level'];
  var BOARDS = ['AQA','Edexcel','OCR','WJEC Eduqas','CIE'];
  var SUBJECTS = {
    'GCSE': ['Biology','Chemistry','Physics','Combined Science','Mathematics','English Language','English Literature','Geography','History','Psychology','Business','Computer Science'],
    'A-Level': ['Biology','Chemistry','Physics','Mathematics','Psychology','Economics','Business','Geography','History','Sociology'],
    'IGCSE': ['Biology','Chemistry','Physics','Mathematics','English','Geography'],
    'AS-Level': ['Biology','Chemistry','Physics','Mathematics','Psychology','Economics']
  };
  var TONES = ['#6C3BF4','#0FA968','#2A6FDB','#E5388A','#F5B301','#00B3C4','#FF5A3C','#8F66F6'];
  function initials(s){ return s.replace(/[^A-Za-z ]/g,'').split(/\s+/).map(function(w){return w[0]||'';}).join('').slice(0,2).toUpperCase(); }
  var LOGO = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>';
  function on(p){ return active===p?' on':''; }

  /* ---------- header ---------- */
  var right = authed
    ? '<button class="icon-btn" id="prTheme" aria-label="Toggle theme"><svg id="prThemeIc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg></button>'
      + '<div class="acct"><button class="acct-btn" id="acctBtn" aria-expanded="false" aria-haspopup="true"><span class="av">'+initials(name)+'</span><span class="desktop-cta">'+name.split(' ')[0]+'</span>'
      + '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>'
      + '<div class="acct-menu" id="acctMenu" role="menu">'
      + '<div class="acct-head"><b>'+name+'</b><span>Signed in</span><br><span class="plan">'+(plan==='premium'?'Premium':'Free plan')+'</span></div>'
      + '<a href="'+base+'dashboard/Dashboard.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>Dashboard</a>'
      + '<a href="'+base+'hub/Course Hub.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>My courses</a>'
      + '<a href="'+base+'Search.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>Saved</a>'
      + '<div class="sep"></div>'
      + '<a href="'+base+'Account.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>Account settings</a>'
      + '<a href="'+base+'Subscription.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8l4 3 6-7 6 7 4-3v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/></svg>Subscription</a>'
      + '<div class="sep"></div>'
      + '<a href="'+base+'Homepage.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>Log out</a>'
      + '</div></div>'
    : '<button class="icon-btn" id="prTheme" aria-label="Toggle theme"><svg id="prThemeIc" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"></svg></button>'
      + '<a class="btn btn-ghost desktop-cta" href="'+base+'auth/Auth.html">Log in</a>'
      + '<a class="btn btn-primary desktop-cta" href="'+base+'auth/Auth.html">Get started</a>';

  var headerHTML =
    '<header class="site"><div class="wrap nav">'
    + '<a class="brand" href="'+base+'Homepage.html" aria-label="Pass Revise home"><span class="logo">'+LOGO+'</span>Pass <em>revise</em></a>'
    + '<div class="nav-links">'
    + '<div><button class="navbtn'+on('study')+'" id="megaBtn" aria-expanded="false" aria-haspopup="true">Start studying'
    + '<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></button>'
    + '<div class="mega" id="mega" role="menu" aria-label="Choose a course"><div class="mega-tabs" id="megaTabs"></div><div class="mega-grid" id="megaGrid"></div>'
    + '<div class="mega-foot"><span style="color:var(--fg-4)">Can\u2019t find your course?</span><a href="'+base+'Search.html">Search all courses \u2192</a></div></div></div>'
    + '<a class="navbtn'+on('subjects')+'" href="'+base+'hub/Course Hub.html">Subjects</a>'
    + '<a class="navbtn'+on('pricing')+'" href="'+base+'Subscription.html">Pricing</a>'
    + '<a class="navbtn'+on('search')+'" href="'+base+'Search.html">Search</a>'
    + '</div><div class="nav-right">'+right
    + '<button class="icon-btn hamburger" id="menuBtn" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg></button>'
    + '</div></div></header>';

  /* ---------- footer ---------- */
  var footerHTML =
    '<footer class="site"><div class="wrap"><div class="foot-grid">'
    + '<div class="foot-brand"><a class="brand" href="'+base+'Homepage.html"><span class="logo">'+LOGO+'</span>Pass <em>revise</em></a>'
    + '<p>Board-specific revision for GCSE and A-Level, built to get you exam-ready.</p></div>'
    + '<div class="foot-col"><h4>Study</h4><a href="'+base+'exam-question/Exam Question.html">Revision Notes</a><a href="'+base+'exam-question/Exam Question.html">Exam Questions</a><a href="'+base+'exam-question/Exam Question.html">Past Papers</a><a href="'+base+'Search.html">Search</a></div>'
    + '<div class="foot-col"><h4>Qualifications</h4><a href="'+base+'hub/Course Hub.html">GCSE</a><a href="'+base+'hub/Course Hub.html">IGCSE</a><a href="'+base+'hub/Course Hub.html">AS-Level</a><a href="'+base+'hub/Course Hub.html">A-Level</a></div>'
    + '<div class="foot-col"><h4>Company</h4><a href="#">About</a><a href="'+base+'Subscription.html">Pricing</a><a href="#">Contact</a><a href="#">Careers</a></div>'
    + '<div class="foot-col"><h4>Legal</h4><a href="#">Privacy</a><a href="#">Terms</a><a href="#" data-cookie-open>Manage cookies</a><a href="#">Safeguarding</a></div>'
    + '</div><div class="foot-bar"><span class="credit">\u00A9 2025 Pass Revise \u2014 <b>by Complete Tuition</b></span>'
    + '<span class="fb-right"><a href="#">Privacy</a><a href="#">Terms</a><button class="navbtn" id="prTheme2" style="height:32px;padding:0 10px">Theme</button></span></div></div></footer>';

  /* ---------- FAB ---------- */
  var fabHTML = '<button class="fab" id="aiFab" aria-label="AI study assistant — coming soon"><span class="orb"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg></span>Ask AI <span class="soon">Soon</span></button>';

  /* ---------- cookie ---------- */
  var cookieHTML = '<div class="cookie" id="cookie" role="dialog" aria-live="polite" aria-label="Cookie choices"><h3>Your privacy</h3>'
    + '<p>We use essential cookies to make Pass Revise work. With your consent we\u2019d also use analytics cookies to improve it. No non-essential cookies are set until you choose. <a href="#" data-cookie-open>Manage choices</a>.</p>'
    + '<div class="cookie-actions"><button class="btn btn-outline" id="ckReject">Essential only</button><button class="btn btn-primary" id="ckAccept">Accept all</button></div></div>';

  /* ---------- drawer ---------- */
  var drawerCta = authed
    ? '<a class="btn btn-outline" href="'+base+'dashboard/Dashboard.html">Dashboard</a><a class="btn btn-primary" href="'+base+'Account.html">Account</a>'
    : '<a class="btn btn-outline" href="'+base+'auth/Auth.html">Log in</a><a class="btn btn-primary" href="'+base+'auth/Auth.html">Get started free</a>';
  var drawerHTML = '<div class="drawer-scrim" id="scrim"></div><aside class="drawer" id="drawer" aria-label="Menu">'
    + '<div class="drawer-top"><a class="brand" href="'+base+'Homepage.html"><span class="logo">'+LOGO+'</span>Pass <em>revise</em></a>'
    + '<button class="icon-btn" id="drawerClose" aria-label="Close menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button></div>'
    + '<nav><a href="'+base+'hub/Course Hub.html">Start studying</a><a href="'+base+'hub/Course Hub.html">Subjects</a><a href="'+base+'Subscription.html">Pricing</a><a href="'+base+'Search.html">Search</a>'
    + (authed?'<a href="'+base+'dashboard/Dashboard.html">Dashboard</a><a href="'+base+'Account.html">Account</a>':'')
    + '</nav><div class="dr-cta">'+drawerCta+'</div></aside>';

  /* ---------- inject ---------- */
  document.body.insertAdjacentHTML('afterbegin', headerHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML + fabHTML + cookieHTML + drawerHTML);

  /* ---------- theme ---------- */
  var root = document.documentElement;
  function themeIcon(dark){ var el=document.getElementById('prThemeIc'); if(el) el.innerHTML = dark
    ? '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>'
    : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'; }
  function applyTheme(t){ if(t==='dark'){root.setAttribute('data-theme','dark');}else{root.removeAttribute('data-theme');} themeIcon(t==='dark'); try{localStorage.setItem('pr-theme',t);}catch(e){} }
  var saved; try{ saved=localStorage.getItem('pr-theme'); }catch(e){}
  applyTheme(saved || (window.matchMedia && matchMedia('(prefers-color-scheme:dark)').matches ? 'dark':'light'));
  function toggleTheme(){ applyTheme(root.hasAttribute('data-theme')?'light':'dark'); }
  ['prTheme','prTheme2'].forEach(function(id){ var b=document.getElementById(id); if(b) b.addEventListener('click',toggleTheme); });

  /* ---------- mega-menu ---------- */
  var mega=document.getElementById('mega'), megaBtn=document.getElementById('megaBtn');
  var megaTabs=document.getElementById('megaTabs'), megaGrid=document.getElementById('megaGrid'), megaQual='GCSE';
  function renderMega(){
    megaTabs.innerHTML = QUALS.map(function(q){ return '<button class="mega-tab'+(q===megaQual?' on':'')+'" data-mq="'+q+'">'+q+'</button>'; }).join('');
    megaGrid.innerHTML = (SUBJECTS[megaQual]||[]).map(function(s,i){ return '<a class="mega-item" href="'+base+'hub/Course Hub.html"><span class="dot" style="background:'+TONES[i%TONES.length]+'"></span>'+s+'</a>'; }).join('');
  }
  renderMega();
  function openMega(o){ mega.classList.toggle('open',o); megaBtn.setAttribute('aria-expanded',o?'true':'false'); }
  megaBtn.addEventListener('click', function(e){ e.stopPropagation(); openMega(!mega.classList.contains('open')); });
  megaTabs.addEventListener('click', function(e){ var b=e.target.closest('[data-mq]'); if(b){ megaQual=b.getAttribute('data-mq'); renderMega(); } });

  /* ---------- account dropdown ---------- */
  var acctBtn=document.getElementById('acctBtn'), acctMenu=document.getElementById('acctMenu');
  if(acctBtn){ acctBtn.addEventListener('click', function(e){ e.stopPropagation(); var o=!acctMenu.classList.contains('open'); acctMenu.classList.toggle('open',o); acctBtn.setAttribute('aria-expanded',o?'true':'false'); }); }

  document.addEventListener('click', function(e){
    if(mega && !mega.contains(e.target) && e.target!==megaBtn && !megaBtn.contains(e.target)) openMega(false);
    if(acctMenu && !acctMenu.contains(e.target) && acctBtn && !acctBtn.contains(e.target)){ acctMenu.classList.remove('open'); acctBtn.setAttribute('aria-expanded','false'); }
  });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape'){ openMega(false); if(acctMenu) acctMenu.classList.remove('open'); closeDrawer(); } });

  /* ---------- drawer ---------- */
  var scrim=document.getElementById('scrim'), drawer=document.getElementById('drawer');
  function openDrawer(){ scrim.classList.add('show'); drawer.classList.add('show'); }
  function closeDrawer(){ if(scrim) scrim.classList.remove('show'); if(drawer) drawer.classList.remove('show'); }
  var menuBtn=document.getElementById('menuBtn'); if(menuBtn) menuBtn.addEventListener('click', openDrawer);
  var dc=document.getElementById('drawerClose'); if(dc) dc.addEventListener('click', closeDrawer);
  if(scrim) scrim.addEventListener('click', closeDrawer);

  /* ---------- AI fab ---------- */
  var fab=document.getElementById('aiFab');
  if(fab) fab.addEventListener('click', function(){ var s=fab.querySelector('.soon'); var old=s.textContent; s.textContent='Coming soon'; setTimeout(function(){ s.textContent=old; },1500); });

  /* ---------- cookie CMP ---------- */
  var cookie=document.getElementById('cookie'); var choice;
  try{ choice=localStorage.getItem('pr-cookie-consent'); }catch(e){}
  if(!choice){ setTimeout(function(){ cookie.classList.add('show'); }, 700); }
  function setConsent(v){ try{localStorage.setItem('pr-cookie-consent',v);}catch(e){} cookie.classList.remove('show'); }
  document.getElementById('ckAccept').addEventListener('click', function(){ setConsent('all'); });
  document.getElementById('ckReject').addEventListener('click', function(){ setConsent('essential'); });
  document.addEventListener('click', function(e){ var t=e.target.closest('[data-cookie-open]'); if(t){ e.preventDefault(); cookie.classList.add('show'); } });

  window.PRSite = { QUALS:QUALS, SUBJECTS:SUBJECTS, BOARDS:BOARDS, TONES:TONES, initials:initials, base:base };
})();
