/* ============================================================================
   PFS — C8-A variation script
   Paste into your A/B tool's JS box. Pairs with variation.css.

   THE ONE THING THAT MATTERS ARCHITECTURALLY
   WooCommerce Composite Products re-renders a component's options with an
   Underscore template (tmpl-wc_cp_options_radio_buttons) every time a selection
   changes or a scenario re-evaluates. Anything injected into .component_selections
   is therefore DESTROYED on the next click. A single DOMContentLoaded pass gives
   you a variation that looks right until the user interacts, then silently
   degrades — which would corrupt the test rather than fail it.
   So: every injection below is IDEMPOTENT and re-driven by a MutationObserver.
   ============================================================================ */
(function () {
  'use strict';

  var FORM = '#composite-product-form';

  /* Component titles are the only stable way to identify steps — component IDs
     are per-product. Match on the rendered title text, lowercased. */
  var STEP = {
    invigilation: 'choose invigilation style',
    date:         'choose date',
    course:       'choose course option',
    bundle:       'choose course bundle option'
  };

  /* Copy edits. Left side matches the START of the existing option label, so
     admin-side wording tweaks do not silently break the match.
     `sub` is the consequence line — the single biggest comprehension win, since
     "invigilation" means nothing to a first-time buyer. */
  var OPTION_COPY = [
    { match: 'online remote invigilation',
      title: 'Online Remote Invigilation',
      sub:   'Results in 2–6 working days · sit it any time · TQUK' },
    { match: 'online human invigilation',
      title: 'Online Human Invigilation',
      sub:   'Results in 6–16 working days · guided setup · Open Awards' },
    { match: 'exam only',
      title: 'Exam Only',
      sub:   'For learners already prepared' },
    { match: 'exam & course',
      title: 'Exam & Course',
      sub:   '93% of learners who complete the course pass',
      popular: true },
    { match: 'exam and course',
      title: 'Exam & Course',
      sub:   '93% of learners who complete the course pass',
      popular: true },
    { match: 'basic bundle',
      title: 'Basic Bundle',
      sub:   '+£184 · exam + 3 months of course access' },
    { match: 'premium bundle',
      title: 'Premium Bundle',
      sub:   '+£284 · exam + 12 months + free resit',
      popular: true }
  ];

  /* ---- helpers ---------------------------------------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function norm(s) { return (s || '').replace(/\s+/g, ' ').trim().toLowerCase(); }

  function components() { return $$(FORM + ' > [id^="component_"]'); }

  function titleOf(comp) {
    var t = $('.component_title', comp);
    if (!t) return '';
    /* strip the step index so "1 Choose Date" matches "choose date" */
    return norm(t.textContent).replace(/^\d+\s*/, '').replace(/^(step\s*)?\d+[.:)]?\s*/, '');
  }

  function componentFor(key) {
    var want = STEP[key];
    for (var i = 0; i < components().length; i++) {
      var c = components()[i];
      if (titleOf(c).indexOf(want) === 0) return c;
    }
    return null;
  }

  /* ---- 1 · option copy + badges ---------------------------------------- */
  function decorateOptions() {
    $$(FORM + ' .component_option_radio_button_container').forEach(function (li) {
      var label = $('label.component_option_radio_button_select', li);
      var span  = label && label.querySelector('span');
      if (!span) return;

      /* already done and still correct? leave it. */
      if (span.querySelector('.pfs-opt-title')) return;

      var raw = norm(span.textContent);
      var rule = null;
      for (var i = 0; i < OPTION_COPY.length; i++) {
        if (raw.indexOf(OPTION_COPY[i].match) === 0) { rule = OPTION_COPY[i]; break; }
      }
      if (!rule) return;

      span.textContent = '';
      var t = document.createElement('span');
      t.className = 'pfs-opt-title';
      t.textContent = rule.title;
      span.appendChild(t);

      if (rule.sub) {
        var s = document.createElement('span');
        s.className = 'pfs-opt-sub';
        s.textContent = rule.sub;
        span.appendChild(s);
      }

      if (rule.popular) {
        li.classList.add('pfs-popular');
        var host = $('.component_option_radio_button', li) || li;
        if (!host.querySelector('.pfs-badge')) {
          var b = document.createElement('span');
          b.className = 'pfs-badge';
          b.textContent = 'Most popular';
          b.setAttribute('aria-hidden', 'true'); /* decorative; not read twice */
          host.insertBefore(b, host.firstChild);
        }
      }
    });
  }

  /* ---- 2 · date step: later / now -------------------------------------- */
  /* IMPORTANT, and the one thing I cannot resolve without your product config:
     "Choose date later" must resolve to a REAL purchasable option. The repo has
     a `book-later-date` product type, so if it exists as an option inside this
     component, set BOOK_LATER_MATCH to the start of its label and the toggle
     will select it properly. If it is NOT an option here, leave it null — the
     toggle then only gates the calendar's visibility, and you must confirm with
     the team that submitting with no date is a valid path before shipping. */
  var BOOK_LATER_MATCH = null; /* e.g. 'book now, choose date later' */

  function buildDateToggle() {
    var comp = componentFor('date');
    if (!comp) return;

    var inner = $('.component_inner', comp);
    if (!inner) return;

    /* wrap the calendar once so CSS can hide it */
    var selections = $('.component_selections', comp);
    if (selections && !selections.classList.contains('pfs-calendar-host')) {
      selections.classList.add('pfs-calendar-host');
    }

    if ($('.pfs-date-toggle', comp)) return; /* already built */

    var wrap = document.createElement('div');
    wrap.className = 'pfs-date-toggle';
    wrap.setAttribute('role', 'group');
    wrap.setAttribute('aria-label', 'When do you want to sit the exam?');

    [
      { id: 'later', title: 'Choose date later', sub: 'Book now, decide within 12 months' },
      { id: 'now',   title: 'Choose date now',   sub: 'Pick from the calendar' }
    ].forEach(function (o) {
      var b = document.createElement('button');
      b.type = 'button';                 /* never submit the composite form */
      b.dataset.mode = o.id;
      b.setAttribute('aria-pressed', o.id === 'later' ? 'true' : 'false');
      b.innerHTML = '<span class="pfs-opt-title"></span><span class="pfs-opt-sub"></span>';
      b.querySelector('.pfs-opt-title').textContent = o.title;
      b.querySelector('.pfs-opt-sub').textContent = o.sub;
      b.addEventListener('click', function () { setDateMode(o.id); });
      wrap.appendChild(b);
    });

    inner.insertBefore(wrap, inner.firstChild);
    comp.classList.add('pfs-date-collapsed');
  }

  function setDateMode(mode) {
    var comp = componentFor('date');
    if (!comp) return;

    $$('.pfs-date-toggle button', comp).forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.mode === mode));
    });
    comp.classList.toggle('pfs-date-collapsed', mode !== 'now');

    if (mode === 'later' && BOOK_LATER_MATCH) {
      var input = $$('.component_option_radio_button_container', comp).filter(function (li) {
        var s = li.querySelector('label span');
        return s && norm(s.textContent).indexOf(BOOK_LATER_MATCH) === 0;
      }).map(function (li) { return li.querySelector('input.radio_button'); })[0];
      if (input && !input.checked) {
        input.checked = true;
        /* Woo CP listens on change; dispatch natively so its handler runs. */
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
    updateRail();
  }

  /* ---- 3 · lock step 4 until the course is added ----------------------- */
  function syncBundleLock() {
    var course = componentFor('course');
    var bundle = componentFor('bundle');
    if (!course || !bundle) return;

    var checked = $$('input.radio_button:checked', course).map(function (i) {
      var l = i.parentNode.querySelector('label span');
      return norm(l ? l.textContent : '');
    })[0] || '';

    var examOnly = checked.indexOf('exam only') === 0;
    bundle.classList.toggle('pfs-step-locked', examOnly);

    var desc = $('.component_description_wrapper', bundle);
    if (desc) {
      desc.textContent = examOnly
        ? 'Available once you add the course.'
        : 'Premium adds 12 months instead of 3, and a free resit if you don’t pass.';
    }
  }

  /* ---- 4 · buy rail ---------------------------------------------------- */
  /* (VERIFY) .composite_wrap — confirm the block that holds price + button. */
  function railHost() { return $('.composite_wrap') || $(FORM); }

  function buildRail() {
    var host = railHost();
    if (!host || $('.pfs-rail-summary', host)) return;

    var summary = document.createElement('div');
    summary.className = 'pfs-rail-summary';
    summary.innerHTML =
      '<p class="pfs-sitting">Sitting <b data-pfs="sitting">chosen later</b></p>' +
      '<p class="pfs-result" data-pfs="result"></p>';

    var specs = document.createElement('dl');
    specs.className = 'pfs-rail-specs';
    specs.innerHTML =
      '<div class="pfs-spec"><dt>Exam centre</dt><dd>Pass Functional Skills</dd></div>' +
      '<div class="pfs-spec"><dt>Awarded by</dt><dd data-pfs="board">—</dd></div>' +
      '<div class="pfs-spec"><dt>Resit</dt><dd data-pfs="resit">—</dd></div>' +
      '<div class="pfs-spec"><dt>Exam pack</dt><dd>Included (£119.99)</dd></div>';

    var secure = document.createElement('p');
    secure.className = 'pfs-secure';
    secure.textContent = 'Secure transaction';

    var price = $('.composite_price', host);
    if (price && price.parentNode === host) host.insertBefore(summary, price.nextSibling);
    else host.insertBefore(summary, host.firstChild);

    host.appendChild(specs);
    host.appendChild(secure);
  }

  function updateRail() {
    var host = railHost();
    if (!host) return;

    var inv = componentFor('invigilation');
    var invLabel = inv ? ($$('input.radio_button:checked', inv).map(function (i) {
      var l = i.parentNode.querySelector('label span');
      return norm(l ? l.textContent : '');
    })[0] || '') : '';
    var remote = invLabel.indexOf('online remote') === 0;

    var board = remote ? 'TQUK' : (invLabel ? 'Open Awards' : '—');
    var turnaround = remote ? '2–6' : '6–16';

    var bundle = componentFor('bundle');
    var bundleLabel = bundle ? ($$('input.radio_button:checked', bundle).map(function (i) {
      var l = i.parentNode.querySelector('label span');
      return norm(l ? l.textContent : '');
    })[0] || '') : '';
    var premium = bundleLabel.indexOf('premium bundle') === 0
      && !bundle.classList.contains('pfs-step-locked');

    var set = function (key, text, good) {
      var el = $('[data-pfs="' + key + '"]', host);
      if (!el) return;
      el.textContent = text;
      if (good !== undefined) el.classList.toggle('is-good', !!good);
    };

    set('board', board);
    set('resit', premium ? 'Free if you don’t pass' : '£157.60', premium);

    /* The result date is the highest-value thing the rail can say, and the page
       already computes business days server-side (BusinessLogic.php). Until it
       is exposed to the front end, state the range rather than invent a date. */
    var chosen = $('.pfs-calendar-host .selected, .pfs-calendar-host .is-selected', host.ownerDocument);
    set('sitting', chosen ? norm(chosen.textContent) : 'chosen later');
    set('result', 'Result ' + turnaround + ' working days after you sit it');

    syncStickyBar();
  }

  /* ---- 5 · mobile sticky bar ------------------------------------------- */
  function buildStickyBar() {
    if (window.matchMedia('(min-width: 1200px)').matches) return;
    if ($('.pfs-sticky-bar')) return;

    var bar = document.createElement('div');
    bar.className = 'pfs-sticky-bar';
    bar.innerHTML =
      '<div class="pfs-sticky-row">' +
        '<div><div class="pfs-sticky-price" data-pfs="sticky-price"></div>' +
        '<div class="pfs-sticky-sub" data-pfs="sticky-sub"></div></div>' +
        '<div class="pfs-sticky-result" data-pfs="sticky-result"></div>' +
      '</div>' +
      '<button type="button">Add to basket</button>';

    /* Proxy the real button rather than duplicating a submit control — one
       source of truth for validation, and no second POST path. */
    bar.querySelector('button').addEventListener('click', function () {
      var real = $('.single_add_to_cart_button') || $('.composite_add_to_cart_button');
      if (real) real.click();
    });

    document.body.appendChild(bar);
    syncStickyBar();
  }

  function syncStickyBar() {
    var bar = $('.pfs-sticky-bar');
    if (!bar) return;

    var priceEl = $('.composite_price .amount') || $('.composite_price ins') || $('.composite_price');
    var p = bar.querySelector('[data-pfs="sticky-price"]');
    if (p && priceEl) p.textContent = norm(priceEl.textContent).replace(/^from\s*/, '');

    var res = $('[data-pfs="result"]');
    var sr = bar.querySelector('[data-pfs="sticky-result"]');
    if (sr && res) sr.textContent = res.textContent.replace(/^Result\s*/, '');

    var real = $('.single_add_to_cart_button') || $('.composite_add_to_cart_button');
    var btn = bar.querySelector('button');
    if (real && btn) {
      var off = real.disabled || real.classList.contains('disabled');
      btn.disabled = off;
      btn.textContent = off ? 'Complete your choices' : 'Add to basket';
    }
  }

  /* ---- 6 · hide the duplicates ----------------------------------------- */
  /* Each of these is a second copy of something the buy box already says.
     Fill in the real selectors from the rendered page — I have deliberately
     left them empty rather than guessing and hiding the wrong node. */
  var HIDE = [
    /* '.pfs-sale-banner-desktop',            duplicate of the urgency line */
    /* '#course-option-comparison',           duplicate of steps 3 and 4    */
    /* '.pfs-93-band',                        4th repeat of the 93% claim   */
    /* '.pfs-payment-badges-secondary'        2nd payment row               */
  ];
  function hideDuplicates() {
    HIDE.forEach(function (sel) {
      $$(sel).forEach(function (el) { el.classList.add('pfs-hide'); });
    });
  }

  /* ---- 7 · apply + observe -------------------------------------------- */
  var applying = false;
  function apply() {
    if (applying) return;          /* our own writes must not re-trigger us */
    applying = true;
    try {
      decorateOptions();
      buildDateToggle();
      syncBundleLock();
      buildRail();
      updateRail();
      buildStickyBar();
      hideDuplicates();
    } catch (e) {
      /* Never let the variation throw into the host page: a JS error here
         would break add-to-cart and invalidate the test. */
      if (window.console) console.warn('[pfs-v2]', e);
    }
    applying = false;
  }

  function start() {
    var form = $(FORM);
    if (!form) return false;

    apply();

    var pending = null;
    var obs = new MutationObserver(function () {
      clearTimeout(pending);
      pending = setTimeout(apply, 60);   /* coalesce Woo CP's re-render bursts */
    });
    obs.observe(form, { childList: true, subtree: true });

    /* Selection changes fire on the real inputs, whatever re-renders around them. */
    form.addEventListener('change', function (e) {
      if (e.target && e.target.classList.contains('radio_button')) setTimeout(apply, 0);
    });

    window.addEventListener('resize', function () { buildStickyBar(); syncStickyBar(); });
    return true;
  }

  /* Woo CP builds the options client-side, so the form can exist before its
     contents do. Poll briefly, then give up rather than hang. */
  if (!start()) {
    var tries = 0;
    var iv = setInterval(function () {
      if (start() || ++tries > 60) clearInterval(iv);
    }, 250);
  }
})();
