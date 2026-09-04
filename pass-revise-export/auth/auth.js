// Pass Revise — Auth (login, register, registration-wall modal).
// State-driven render → ports cleanly to Vue. Framework-agnostic vanilla JS.
(function () {
  'use strict';
  var DASH = '../dashboard/Dashboard.html';
  var WIZARD = '../dashboard/Dashboard.html'; // register → first-run onboarding lives here

  var state = {
    screen: 'login',     // login | register | reset | reset-sent | reset-new | pw-updated | verify | blocked | regwall
    form: 'default',      // default | error | loading | success
    ctx: 'mark',          // reg-wall context: mark | note | paper
    device: 'desktop',
    theme: 'light',
    showPw: false,
    email: 'amara@example.com',
    dobError: ''
  };

  // ─────────────────────────── icons ───────────────────────────
  var I = {
    google:'<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="#4285F4" d="M23 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h6.19a5.29 5.29 0 0 1-2.3 3.47v2.88h3.72C21.94 18.66 23 15.7 23 12.25z"/><path fill="#34A853" d="M12 24c3.12 0 5.74-1.03 7.65-2.79l-3.72-2.88c-1.03.69-2.35 1.1-3.93 1.1-3.02 0-5.58-2.04-6.5-4.79H1.66v3.01A11.99 11.99 0 0 0 12 24z"/><path fill="#FBBC05" d="M5.5 14.64a7.2 7.2 0 0 1 0-4.6V7.03H1.66a12 12 0 0 0 0 10.62l3.84-3.01z"/><path fill="#EA4335" d="M12 4.77c1.7 0 3.22.59 4.42 1.73l3.3-3.3C17.73 1.2 15.11 0 12 0 7.34 0 3.31 2.69 1.66 6.6L5.5 9.62C6.42 6.87 8.98 4.77 12 4.77z"/></svg>',
    apple:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.37 12.77c-.02-2.05 1.67-3.03 1.75-3.08-.95-1.4-2.44-1.59-2.97-1.61-1.26-.13-2.47.74-3.11.74-.64 0-1.63-.72-2.68-.7-1.38.02-2.65.8-3.36 2.03-1.43 2.49-.37 6.17 1.03 8.19.68.99 1.49 2.1 2.55 2.06 1.02-.04 1.41-.66 2.65-.66 1.23 0 1.58.66 2.66.64 1.1-.02 1.79-1 2.47-1.99.78-1.14 1.1-2.25 1.12-2.31-.02-.01-2.15-.83-2.18-3.29zM14.33 6.75c.56-.68.94-1.63.84-2.58-.81.03-1.79.54-2.37 1.22-.52.6-.98 1.56-.85 2.48.9.07 1.82-.46 2.38-1.12z"/></svg>',
    eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeoff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 5.1A9.5 9.5 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.2 3M6.1 6.1A17 17 0 0 0 2 12s3.5 7 10 7a9.3 9.3 0 0 0 3.9-.8M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2"/></svg>',
    check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    arrow:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    alert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/></svg>',
    spark:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 6.4L21 11l-6.6 2.6L12 20l-2.4-6.4L3 11l6.6-2.6z"/></svg>',
    lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10.5" width="16" height="10.5" rx="2.5"/><path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/></svg>',
    doc:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/></svg>',
    book:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5V5.5A2.5 2.5 0 0 1 6.5 3z"/></svg>',
    close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    spinner:'<svg class="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9" opacity=".85"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>'
  };
  var MARK_SVG = '<svg class="mk" viewBox="0 0 295 325" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M193.03,174.82l-9.48,12.3c-15.05,19.53-43.07,23.15-62.6,8.1l-62.6-48.26c-13.16-10.15-15.61-29.04-5.46-42.19,10.15-13.16,29.04-15.6,42.2-5.46l50.3,38.77L236.08,20.43C216.07,7.52,192.26,0,166.68,0H30C13.43,0,0,13.43,0,30v264.81c0,16.57,13.43,30,30,30,33.05,0,62.07-21.98,71.03-53.79l4.11-14.59h61.53c70.81,0,128.22-57.41,128.22-128.22h0c0-23.16-6.17-44.86-16.91-63.61l-84.96,110.21Z" fill="var(--color-primary)"/></svg>';

  function esc(s){ return String(s).replace(/[&<>]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;'}[c];}); }

  // ─────────────────────────── shared bits ───────────────────────────
  function brandHTML(){ return '<a class="brand" href="'+DASH+'">'+MARK_SVG+'<span class="wm">Pass<em>revise</em></span></a>'; }
  function socialHTML(verb){
    return '<div class="social">'+
      '<button class="sbtn sbtn-google" data-act="social" data-p="google">'+I.google+'<span>'+verb+' with Google</span></button>'+
    '</div>';
  }
  function dividerHTML(){ return '<div class="divider"><span>or '+ (state.screen==='register'?'sign up':'log in') +' with email</span></div>'; }
  function fieldHTML(o){
    var err = o.error ? '<span class="field-err">'+I.alert+esc(o.error)+'</span>' : '';
    var pw = o.type==='password';
    var input = '<input class="input'+(o.error?' has-err':'')+'" type="'+(pw && state.showPw ? 'text':o.type)+'" id="'+o.id+'" placeholder="'+esc(o.ph)+'" value="'+esc(o.val||'')+'" autocomplete="'+o.ac+'"'+(o.error?' aria-invalid="true"':'')+'>';
    var toggle = pw ? '<button type="button" class="pw-toggle" data-act="togglepw" aria-label="Show password">'+(state.showPw?I.eyeoff:I.eye)+'</button>' : '';
    var top = '<div class="field-top"><label for="'+o.id+'">'+esc(o.label)+'</label>'+(o.aux||'')+'</div>';
    return '<div class="field">'+top+'<div class="input-wrap">'+input+toggle+'</div>'+err+'</div>';
  }
  function formAlertHTML(msg){ return '<div class="form-alert">'+I.alert+'<span>'+esc(msg)+'</span></div>'; }
  function dobFieldHTML(err){
    var days='', months='', years='';
    for (var d=1; d<=31; d++) days += '<option>'+d+'</option>';
    var mn=['January','February','March','April','May','June','July','August','September','October','November','December'];
    for (var m=0; m<12; m++) months += '<option value="'+(m+1)+'">'+mn[m]+'</option>';
    var yNow=new Date().getFullYear();
    for (var y=yNow; y>=yNow-70; y--) years += '<option>'+y+'</option>';
    function sel(id,lbl,opts){ return '<select class="input dob-sel'+(err?' has-err':'')+'" id="'+id+'" aria-label="'+lbl+'"'+(err?' aria-invalid="true"':'')+'><option value="" disabled selected>'+lbl+'</option>'+opts+'</select>'; }
    var e = err ? '<span class="field-err">'+I.alert+esc(err)+'</span>' : '';
    return '<div class="field"><div class="field-top"><label for="dob-day">Date of birth</label></div>'+
      '<div class="dob-row">'+sel('dob-day','Day',days)+sel('dob-month','Month',months)+sel('dob-year','Year',years)+'</div>'+
      '<p class="field-hint">We ask so we can keep younger students safe online.</p>'+ e +
    '</div>';
  }
  function submitBtn(label){
    if (state.form==='loading') return '<button class="btn btn-primary lg block" disabled>'+I.spinner+'Just a sec…</button>';
    return '<button class="btn btn-primary lg block" data-act="submit">'+label+'</button>';
  }

  // ─────────────────────────── success ───────────────────────────
  function successHTML(){
    var reg = state.screen==='register';
    return '<div class="auth-card success"><span class="ok-ic">'+I.check+'</span>'+
      '<h1>'+(reg?'Account created':'Welcome back')+'</h1>'+
      '<p>'+(reg?'Let\u2019s set up your courses — this takes about a minute.':'Taking you to your dashboard…')+'</p>'+
      '<a class="btn btn-primary lg block" href="'+(reg?WIZARD:DASH)+'">'+(reg?'Set up my courses':'Go to dashboard')+I.arrow+'</a>'+
    '</div>';
  }

  // ─────────────────────────── password reset ───────────────────────────
  function resetHTML(){
    var e = state.form==='error';
    return '<div class="auth-card">'+
      '<div class="auth-hd"><h1>Reset your password</h1><p>Enter your email and we’ll send you a link to set a new password.</p></div>'+
      (e?formAlertHTML('Please enter a valid email address.'):'')+
      fieldHTML({id:'resetemail',label:'Email',type:'email',ph:'you@example.com',ac:'email'})+
      submitBtn('Send reset link')+
      '<p class="auth-switch"><a href="#" data-act="to-login">Back to log in</a></p>'+
    '</div>';
  }
  function resetSentHTML(){
    return '<div class="auth-card center">'+
      '<span class="mail-ic">'+I.mail+'</span>'+
      '<h1>Check your inbox</h1>'+
      '<p>If an account exists for <b>'+esc(state.email)+'</b>, we’ve sent a link to reset your password. The link expires in 30 minutes.</p>'+
      '<a class="btn btn-primary lg block" href="#" data-act="to-reset-new">Open reset link</a>'+
      '<button class="btn btn-ghost block" data-act="resend">Resend email</button>'+
      '<p class="auth-switch"><a href="#" data-act="to-login">Back to log in</a></p>'+
    '</div>';
  }
  function resetNewHTML(){
    return '<div class="auth-card">'+
      '<div class="auth-hd"><h1>Set a new password</h1><p>Choose a new password for your account. Make it at least 8 characters.</p></div>'+
      fieldHTML({id:'np',label:'New password',type:'password',ph:'At least 8 characters',ac:'new-password'})+
      fieldHTML({id:'np2',label:'Confirm new password',type:'password',ph:'Re-enter password',ac:'new-password'})+
      submitBtn('Update password')+
    '</div>';
  }
  function pwUpdatedHTML(){
    return '<div class="auth-card success"><span class="ok-ic">'+I.check+'</span><h1>Password updated</h1><p>You can now log in with your new password.</p><a class="btn btn-primary lg block" href="#" data-act="to-login">Back to log in'+I.arrow+'</a></div>';
  }
  // ─────────────────────────── email verification ───────────────────────────
  function verifyHTML(){
    return '<div class="auth-card center">'+
      '<span class="mail-ic">'+I.mail+'</span>'+
      '<h1>Verify your email</h1>'+
      '<p>We’ve sent a verification link to <b>'+esc(state.email)+'</b>. Open it to activate your account and start revising.</p>'+
      '<a class="btn btn-primary lg block" href="'+WIZARD+'">I’ve verified my email'+I.arrow+'</a>'+
      '<button class="btn btn-ghost block" data-act="resend">Resend email</button>'+
      '<p class="auth-switch">Wrong address? <a href="#" data-act="to-register">Go back</a></p>'+
    '</div>';
  }
  // ─────────────────────────── under-13 age gate ───────────────────────────
  function blockedHTML(){
    return '<div class="auth-card center blocked">'+
      '<span class="mail-ic soft">'+I.book+'</span>'+
      '<h1>Pass Revise isn’t available for you just yet</h1>'+
      '<p>Thanks for your interest! Pass Revise is currently built for students aged 13 and over. Please check back when you’re a little older — we’ll be here when you’re ready.</p>'+
      '<p class="blocked-tip">If you entered your date of birth by mistake, you can <a href="#" data-act="to-register">go back and try again</a>.</p>'+
    '</div>';
  }

  // ─────────────────────────── login / register cards ───────────────────────────
  function loginCardHTML(){
    var e = state.form==='error';
    return '<div class="auth-card">'+
      '<div class="auth-hd"><h1>Welcome back</h1><p>Log in to keep revising and track your progress.</p></div>'+
      socialHTML('Continue')+ dividerHTML()+
      (e?formAlertHTML('That email or password isn\u2019t right. Try again.'):'')+
      fieldHTML({id:'email',label:'Email',type:'email',ph:'you@example.com',ac:'email',val:e?'amara@example.com':''})+
      fieldHTML({id:'pw',label:'Password',type:'password',ph:'Your password',ac:'current-password',error:e?'Incorrect password':'',aux:'<a class="field-link" href="#" data-act="to-reset">Forgot?</a>'})+
      '<label class="remember"><input type="checkbox" checked> Keep me logged in</label>'+
      submitBtn('Log in')+
      '<p class="auth-switch">New to Pass Revise? <a href="#" data-act="to-register">Create an account</a></p>'+
    '</div>';
  }
  function registerCardHTML(){
    var e = state.form==='error';
    return '<div class="auth-card">'+
      '<div class="auth-hd"><h1>Create your free account</h1><p>Free revision notes, exam questions and past papers — matched to your spec.</p></div>'+
      socialHTML('Sign up')+ dividerHTML()+
      fieldHTML({id:'remail',label:'Email',type:'email',ph:'you@example.com',ac:'email',error:e?'That email is already registered':'',val:e?'amara@example.com':'',aux:e?'<a class="field-link" href="#" data-act="to-login">Log in instead</a>':''})+
      fieldHTML({id:'rpw',label:'Password',type:'password',ph:'At least 8 characters',ac:'new-password'})+
      dobFieldHTML(state.dobError)+
      submitBtn('Create account')+
      '<p class="auth-legal">By continuing you agree to our <a href="#">Terms</a> &amp; <a href="#">Privacy Policy</a>.</p>'+
      '<p class="auth-switch">Already have an account? <a href="#" data-act="to-login">Log in</a></p>'+
    '</div>';
  }

  function pageHTML(){
    var s = state.screen, card;
    if (state.form==='success' && (s==='login'||s==='register')) card = successHTML();
    else if (s==='register') card = registerCardHTML();
    else if (s==='reset') card = resetHTML();
    else if (s==='reset-sent') card = resetSentHTML();
    else if (s==='reset-new') card = resetNewHTML();
    else if (s==='pw-updated') card = pwUpdatedHTML();
    else if (s==='verify') card = verifyHTML();
    else if (s==='blocked') card = blockedHTML();
    else card = loginCardHTML();
    return '<div class="auth-page">'+
      '<div class="auth-top">'+brandHTML()+'<a class="auth-help" href="#">Need help?</a></div>'+
      '<div class="auth-mid">'+card+'</div>'+
      '<div class="auth-foot">© 2026 Pass Revise · Spec-matched revision for GCSE &amp; A-Level</div>'+
    '</div>';
  }

  // ─────────────────────────── registration-wall modal ───────────────────────────
  var CTX = {
    mark:  { ic:'spark', head:'Create a free account to mark this answer', sub:'Smart Mark grades your answer instantly against the mark scheme — sign up free to see your result.' },
    note:  { ic:'book',  head:'Sign up free to keep reading', sub:'You\u2019ve reached the free preview of this revision note. Create an account to read the full note.' },
    paper: { ic:'doc',   head:'Create a free account to download', sub:'Past papers are free — we just need an account so we can save your progress.' }
  };
  function regwallHTML(){
    var c = CTX[state.ctx]||CTX.mark, e = state.form==='error';
    if (state.form==='success'){
      return backdropHTML()+'<div class="modal-scrim"><div class="rw-modal"><span class="ok-ic">'+I.check+'</span><h2>You\u2019re in!</h2><p>Back to what you were doing…</p><a class="btn btn-primary lg block" href="#" data-act="rw-continue">Continue</a></div></div>';
    }
    return backdropHTML()+
      '<div class="modal-scrim"><div class="rw-modal">'+
        '<button class="rw-close" data-act="rw-close" aria-label="Close">'+I.close+'</button>'+
        '<span class="rw-ic">'+I[c.ic]+'</span>'+
        '<h2>'+esc(c.head)+'</h2><p>'+esc(c.sub)+'</p>'+
        '<div class="rw-social">'+
          '<button class="sbtn sbtn-google" data-act="social" data-p="google">'+I.google+'<span>Continue with Google</span></button>'+
        '</div>'+
        '<div class="divider"><span>or</span></div>'+
        (e?formAlertHTML('That email is already registered — log in instead.'):'')+
        fieldHTML({id:'rwemail',label:'Email',type:'email',ph:'you@example.com',ac:'email',error:e?'Already registered':''})+
        submitBtn('Sign up free &amp; continue')+
        '<p class="rw-fine">'+I.lock+'Free forever · No card needed</p>'+
        '<p class="auth-switch">Already have an account? <a href="#" data-act="to-login-page">Log in</a></p>'+
      '</div></div>';
  }
  function backdropHTML(){
    // a faint, blurred mock of the page the guest was on (so the modal reads as an interstitial)
    return '<div class="rw-bg"><div class="rw-bg-bar"></div>'+
      '<div class="rw-bg-wrap"><div class="rw-bg-main">'+
        '<div class="sk sk-title"></div><div class="sk sk-line"></div><div class="sk sk-line"></div><div class="sk sk-line short"></div>'+
        '<div class="sk sk-block"></div><div class="sk sk-line"></div><div class="sk sk-line short"></div>'+
      '</div><div class="rw-bg-side"><div class="sk sk-card"></div><div class="sk sk-card"></div></div></div></div>';
  }

  // ─────────────────────────── render ───────────────────────────
  function render(){
    var app = document.getElementById('app');
    var mob = state.device==='mobile';
    document.documentElement.setAttribute('data-theme', state.theme);
    app.className = 'app'+(mob?' is-mobile':'')+(state.screen==='regwall'?' is-regwall':'');
    app.innerHTML = state.screen==='regwall' ? regwallHTML() : pageHTML();
    syncCockpit();
  }

  // ─────────────────────────── events ───────────────────────────
  function isEmail(v){ return /.+@.+\..+/.test(v); }
  function ageFrom(y,m,d){ var t=new Date(), a=t.getFullYear()-y; if ((t.getMonth()+1)<m || ((t.getMonth()+1)===m && t.getDate()<d)) a--; return a; }
  function submit(){
    var s = state.screen;
    if (s==='register'){
      var em=document.getElementById('remail');
      if (em && !isEmail(em.value)){ state.form='error'; return render(); }
      if (em && em.value) state.email=em.value;
      var d=document.getElementById('dob-day'), m=document.getElementById('dob-month'), y=document.getElementById('dob-year');
      if (!(d&&d.value) || !(m&&m.value) || !(y&&y.value)){ state.dobError='Please enter your date of birth.'; return render(); }
      state.dobError='';
      if (ageFrom(+y.value, +m.value, +d.value) < 13){ state.screen='blocked'; state.form='default'; return render(); }
      state.form='loading'; render();
      return setTimeout(function(){ state.form='default'; state.screen='verify'; render(); }, 850);
    }
    if (s==='reset'){
      var re=document.getElementById('resetemail');
      if (re && !isEmail(re.value)){ state.form='error'; return render(); }
      if (re && re.value) state.email=re.value;
      state.form='loading'; render();
      return setTimeout(function(){ state.form='default'; state.screen='reset-sent'; render(); }, 800);
    }
    if (s==='reset-new'){
      state.form='loading'; render();
      return setTimeout(function(){ state.form='default'; state.screen='pw-updated'; render(); }, 800);
    }
    var emailEl = document.querySelector('input[type=email]');
    if (emailEl && !isEmail(emailEl.value)){ state.form='error'; render(); return; }
    state.form='loading'; render();
    setTimeout(function(){ state.form='success'; render(); }, 850);
  }
  document.getElementById('app').addEventListener('click', function(e){
    var el = e.target.closest('[data-act]'); if(!el) return;
    var act = el.getAttribute('data-act');
    if (act==='togglepw'){ e.preventDefault(); state.showPw=!state.showPw; return render(); }
    if (act==='submit'){ e.preventDefault(); return submit(); }
    if (act==='social'){ e.preventDefault(); state.form='loading'; render(); setTimeout(function(){ state.form='success'; render(); }, 700); return; }
    if (act==='to-register'){ e.preventDefault(); state.screen='register'; state.form='default'; state.dobError=''; return render(); }
    if (act==='to-login'||act==='to-login-page'){ e.preventDefault(); state.screen='login'; state.form='default'; return render(); }
    if (act==='to-reset'){ e.preventDefault(); state.screen='reset'; state.form='default'; return render(); }
    if (act==='to-reset-new'){ e.preventDefault(); state.screen='reset-new'; state.form='default'; return render(); }
    if (act==='resend'){ e.preventDefault(); el.textContent='Email sent ✓'; el.disabled=true; el.classList.add('sent'); return; }
    if (act==='rw-close'){ e.preventDefault(); if(e.target.closest('.rw-modal')&&!e.target.closest('[data-act=rw-close]')) return; state.screen='login'; state.form='default'; return render(); }
    if (act==='rw-continue'){ e.preventDefault(); state.form='default'; return; }
  });
  // click on scrim closes reg-wall
  document.getElementById('app').addEventListener('mousedown', function(e){
    if (e.target.classList && e.target.classList.contains('modal-scrim')){ state.screen='login'; state.form='default'; render(); }
  });

  // ─────────────────────────── cockpit ───────────────────────────
  function syncCockpit(){
    document.querySelectorAll('#cockpit .seg').forEach(function(seg){
      var key=seg.getAttribute('data-seg');
      seg.querySelectorAll('button').forEach(function(b){
        var v=b.dataset.screen||b.dataset.form||b.dataset.ctx||b.dataset.d||b.dataset.t;
        var on=(key==='screen'&&v===state.screen)||(key==='form'&&v===state.form)||(key==='ctx'&&v===state.ctx)||(key==='device'&&v===state.device)||(key==='theme'&&v===state.theme);
        b.classList.toggle('on', on);
      });
    });
    // context group only relevant to reg-wall
    var ctxGroup = document.querySelector('#cockpit .ck-ctx');
    if (ctxGroup) ctxGroup.style.opacity = state.screen==='regwall' ? '1' : '.4';
  }
  document.getElementById('cockpit').addEventListener('click', function(e){
    var b=e.target.closest('button'); if(!b) return;
    if (b.dataset.screen){ state.screen=b.dataset.screen; state.form='default'; }
    else if (b.dataset.form){ state.form=b.dataset.form; }
    else if (b.dataset.ctx){ state.ctx=b.dataset.ctx; if(state.screen!=='regwall') state.screen='regwall'; }
    else if (b.dataset.d){ state.device=b.dataset.d; }
    else if (b.dataset.t){ state.theme=b.dataset.t; }
    else return;
    render();
  });

  render();
})();
