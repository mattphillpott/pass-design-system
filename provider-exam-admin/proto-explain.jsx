/* Explanation layer — plain-English "why we designed it this way" for non-developers.
   Toggled from the toolbar. Renders numbered pins anchored to real UI ([data-why])
   plus a side drawer that explains each decision. Content is from the exec summary. */
const { useState: uE, useEffect: uEf, useRef: uR, useMemo: uM } = React;

const ONE_LINER = "We let someone buy an exam and run it entirely on behalf of a student — the student never logs in or gets notified. People who buy exams for themselves notice no change at all.";

/* n = the number shown on the pin / chip. screens = where this decision is most relevant.
   anchored = has a pin on the UI (vs. drawer-only background decisions). */
const DECISIONS = [
  { n: 1, anchored: true, screens: ['onboarding', 'assign'],
    title: 'We ask “is this for you or a student?” after they’ve paid — never before.',
    why: 'Nothing should slow down or complicate buying. A question at checkout could put people off, so the buyer sorts out who it’s for once the purchase is done.' },
  { n: 2, anchored: true, screens: ['list'],
    title: 'It’s decided exam-by-exam, not account-by-account.',
    why: 'The same person might buy one exam for themselves and another for a student. Nobody gets labelled a “provider” or “student” for everything — each exam stands alone.' },
  { n: 3, anchored: true, screens: ['onboarding'],
    title: 'There’s no special “provider account”.',
    why: 'Many people buy one exam for a student once and never again. Rather than a sign-up or approval step, anyone becomes a provider simply by choosing “this one’s for a student”. Less friction, nothing to administer.' },
  { n: 4, anchored: true, screens: ['assign'],
    title: 'Setting up a student’s exam is just typing their name.',
    why: 'The student never logs in and gets no notifications — the provider does every step on their behalf. So there’s nothing to invite or configure. We capture a first and last name purely to label whose exam it is.' },
  { n: 5, anchored: true, screens: ['detail'],
    title: 'The provider’s screen names the student on every action.',
    why: 'Because the student can’t log in to check or correct anything, the provider’s “View Exam” screen leads with a clear banner naming whose exam it is — so nothing is recorded against the wrong person. It’s hard to change afterwards, so we make them look before they act.' },
  { n: 6, anchored: true, screens: ['assign'],
    title: 'Setup ends by confirming the name.',
    why: 'The name is hard to change once setup is done, and the student can’t fix it themselves. So the final step echoes back exactly who you typed and asks you to confirm before anything is created.' },
  { n: 7, anchored: true, screens: ['detail'],
    title: 'Results come back to the provider, who shares them.',
    why: 'There’s no student login and no automated emails, so a marked result simply appears on the provider’s own dashboard. The provider passes it on to the student however they like.' },
  { n: 8, anchored: false, screens: ['onboarding', 'assign'],
    title: 'Providers can save their usual choices as defaults.',
    why: 'A provider who always sets things up the same way shouldn’t repeat it every time. They set it once — but we still always ask who the specific student is, so nobody is created by accident.' },
  { n: 9, anchored: true, screens: ['list'],
    title: 'It’s deliberately basic — no bulk tools, no big reporting.',
    why: 'This is meant for providers with only a handful of students. We want it to get a little fiddly past roughly ten students — at that point they should move to our dedicated provider platform. Making the lightweight version too powerful would undercut that platform.' },
  { n: 10, anchored: false, screens: [],
    title: 'We built this fresh inside the exam system, not on the provider platform.',
    why: 'It’s faster and self-contained. The trade-off — this small tool and the big provider platform don’t share data — is one we’ve accepted on purpose, because they serve different sizes of customer.' },
  { n: 11, anchored: true, screens: ['onboarding'],
    title: 'Existing self-service customers see no change whatsoever.',
    why: 'The current experience works well for the many people buying exams for themselves. Everything here only appears for someone who chooses “this is for a student”.' },
];

const OPEN_ITEMS = [
  { t: 'Product ownership', d: 'Who owns this from a product point of view (sign-off).' },
  { t: 'Data protection', d: 'A provider types in another adult’s name to set up an exam they fully administer — our data-protection lead needs to confirm how we record that person’s consent. These are adults, so it’s routine, but it must be signed off.' },
];

const byN = (n) => DECISIONS.find(d => d.n === n);

/* ---- pins anchored to [data-why] elements ---- */
function usePins(on, deps) {
  const [pins, setPins] = uE([]);
  uEf(() => {
    if (!on) { setPins([]); return; }
    let raf = 0, ticks = 0;
    const measure = () => {
      const seen = new Set();
      const out = [];
      document.querySelectorAll('[data-why]').forEach(el => {
        const n = +el.getAttribute('data-why');
        if (seen.has(n)) return;
        const r = el.getBoundingClientRect();
        if ((r.width === 0 && r.height === 0) || r.bottom < 0 || r.top > window.innerHeight) return;
        seen.add(n);
        out.push({ n, x: r.right, y: r.top + 14 });
      });
      out.sort((a, b) => a.n - b.n);
      setPins(out);
    };
    const loop = () => { measure(); if (ticks++ < 30) raf = requestAnimationFrame(loop); };
    loop();
    const onScroll = () => measure();
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onScroll);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('scroll', onScroll, true); window.removeEventListener('resize', onScroll); ro.disconnect(); };
  }, [on, ...deps]);
  return pins;
}

function ExplainLayer({ on, screen, viewAs, onClose }) {
  const [active, setActive] = uE(null);
  const [showAll, setShowAll] = uE(false);
  const scrollRef = uR(null);
  const cardRefs = uR({});
  const scrKey = screen === 'detail' ? (viewAs === 'student' ? 'student' : 'detail') : screen;
  const pins = usePins(on, [screen, viewAs]);

  const here = uM(() => DECISIONS.filter(d => d.screens.includes(scrKey)), [scrKey]);
  const rest = uM(() => DECISIONS.filter(d => !d.screens.includes(scrKey)), [scrKey]);

  uEf(() => { if (!on) { setActive(null); setShowAll(false); } }, [on]);
  uEf(() => { setActive(null); }, [scrKey]);

  const openCard = (n) => {
    if (!here.some(d => d.n === n)) setShowAll(true);
    setActive(n);
    requestAnimationFrame(() => {
      const el = cardRefs.current[n], box = scrollRef.current;
      if (el && box) box.scrollTop = el.offsetTop - 14;
    });
  };

  if (!on) return null;

  const Card = (d, ctx) => (
    <div key={d.n} ref={(el) => { cardRefs.current[d.n] = el; }}
      className={'xp-card' + (active === d.n ? ' is-active' : '') + (d.anchored ? '' : ' is-bg')}>
      <div className="xp-cn">{d.n}</div>
      <div className="xp-ct">
        <div className="xp-tt">{d.title}</div>
        <div className="xp-wy">{d.why}</div>
        {!d.anchored && ctx === 'here' && <div className="xp-flag"><Ico name="InfoCircle" size={12} />Background decision — shapes the whole feature</div>}
      </div>
    </div>
  );

  return (
    <>
      <div className="xp-pins">
        {pins.map(p => (
          <button key={p.n} className={'xp-pin' + (active === p.n ? ' is-active' : '')}
            style={{ left: p.x, top: p.y }} onClick={() => openCard(p.n)} title={byN(p.n).title}>
            {p.n}
          </button>
        ))}
      </div>

      <aside className="xp-drawer">
        <div className="xp-head">
          <div className="xp-eyebrow"><Ico name="InfoCircle" size={14} />Why it’s designed this way</div>
          <button className="xp-x" onClick={onClose} title="Hide explanations"><Ico name="Close" size={18} /></button>
        </div>
        <div className="xp-scroll" ref={scrollRef}>
          <div className="xp-intro">{ONE_LINER}</div>

          <div className="xp-sec">On this screen</div>
          {here.length ? here.map(d => Card(d, 'here'))
            : <div className="xp-empty">No specific call-outs here. See every decision below.</div>}

          <button className="xp-more" onClick={() => setShowAll(s => !s)}>
            <Ico name={showAll ? 'AngleDown' : 'ChevronDoubleRight'} size={15} />
            {showAll ? 'Hide other decisions' : `Show every decision (${rest.length} more)`}
          </button>
          {showAll && <div className="xp-all">{rest.map(d => Card(d, 'rest'))}</div>}

          <div className="xp-open">
            <div className="xp-open-h"><Ico name="Hourglass" size={14} />Still to decide (not technical)</div>
            {OPEN_ITEMS.map((o, i) => (
              <div className="xp-open-row" key={i}><b>{o.t}.</b> {o.d}</div>
            ))}
          </div>
          <div className="xp-foot">Numbered dots <span className="xp-mini">1</span> point to the part of the screen each choice affects. This panel is a demo aid — it isn’t part of the product.</div>
        </div>
      </aside>
    </>
  );
}

window.ProtoExplain = { ExplainLayer, DECISIONS };
