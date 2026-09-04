// Three variations of the right-column product page.
// Width-locked to ~640px to match the original page (left column = product images).

const { PRODUCT, gbp, TrustpilotRow, AwardingBodies, BnplCompactRow,
        SecureFooter, BulletList, PassRateStrip, CountdownChip } = window.PRODUCT_SHARED;

const COL_WIDTH = 640;

// Shared CTA button
function BookNowCta({ size = 'lg', label = 'Book your exam' }) {
  const lg = size === 'lg';
  return (
    <a href="../wizard/Booking Wizard.html" className="pass-btn pass-btn--primary" style={{
      height: lg ? 56 : 48,
      width: '100%',
      justifyContent: 'center',
      fontSize: lg ? 17 : 15,
      fontWeight: 700,
      borderRadius: 12,
      letterSpacing: '-0.01em',
      background: '#0FBC0F',
      boxShadow: '0 8px 20px -8px rgba(15,134,16,0.5)',
      gap: 10,
      textDecoration: 'none',
    }}>
      {label}
      <PFSIcon name="arrow-right" size={lg ? 20 : 18} color="#fff"/>
    </a>
  );
}

// Sub-CTA helpers
function SmallReassurance() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
      {[
        ['lock', '256-bit SSL'],
        ['rotate-ccw', '14-day refund'],
        ['shield-check', 'Price-match guarantee'],
      ].map(([icon, label]) => (
        <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6A7282', fontWeight: 500 }}>
          <PFSIcon name={icon} size={13} color="#6A7282"/> {label}
        </span>
      ))}
    </div>
  );
}

// Segmented plan toggle for Variation D — defaults to the bundle (pre-selected upsell)
function BundleToggle({ value, onChange }) {
  const opts = [
    { k: 'exam', label: 'Exam only' },
    { k: 'bundle', label: 'Exam + Course' },
  ];
  return (
    <div style={{ display: 'flex', gap: 6, padding: 4, background: '#F3F4F6', borderRadius: 12 }}>
      {opts.map(o => {
        const active = value === o.k;
        return (
          <button key={o.k} onClick={() => onChange(o.k)} style={{
            flex: 1, padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
            background: active ? '#fff' : 'transparent',
            boxShadow: active ? '0 1px 3px rgba(0,0,0,.14)' : 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, fontFamily: 'inherit',
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: active ? '#101828' : '#6A7282' }}>{o.label}</span>
            {o.k === 'bundle' && (
              <span style={{ fontSize: 9.5, fontWeight: 800, letterSpacing: '0.02em', color: active ? '#0F8610' : '#98A2B3' }}>
                RECOMMENDED · {PRODUCT.passRate}% PASS
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  VARIATION A — "Magazine"
//  Eyebrow → big H1 → blurb → price card → strip with awarding bodies
//  → green pass-rate hero → tidy 2-col bullets → BNPL → footer
// ════════════════════════════════════════════════════════════════════
function VariationA() {
  return (
    <div style={{
      width: COL_WIDTH, fontFamily: 'var(--font-sans)',
      background: '#fff', display: 'flex', flexDirection: 'column', gap: 24,
    }}>
      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: '#0F8610',
          textTransform: 'uppercase', letterSpacing: '0.08em',
        }}>Functional Skills · Maths · Level 2</span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: '#D1D5DB' }}/>
        <span style={{ fontSize: 12, color: '#6A7282' }}>Equivalent to GCSE grade C/4</span>
      </div>

      {/* H1 */}
      <h1 style={{
        margin: 0, fontSize: 40, fontWeight: 800, color: '#101828',
        letterSpacing: '-0.03em', lineHeight: 1.1,
      }}>Functional Skills<br/>Maths Level 2 Exam</h1>

      {/* Blurb */}
      <p style={{ margin: 0, fontSize: 15, color: '#4A5565', lineHeight: 1.6, maxWidth: 560 }}>
        {PRODUCT.blurb}
      </p>

      {/* Trustpilot */}
      <TrustpilotRow/>

      {/* Price card */}
      <div style={{
        padding: 24, borderRadius: 18,
        background: 'linear-gradient(180deg, #F0FEEF 0%, #fff 60%)',
        border: '1px solid #B8FBB7',
        boxShadow: '0 8px 24px -16px rgba(15,134,16,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 14, color: '#6A7282', fontWeight: 500 }}>from</span>
            <span style={{ fontSize: 18, color: '#98A2B3', textDecoration: 'line-through', fontWeight: 600 }}>
              {gbp(PRODUCT.rrp)}
            </span>
            <span style={{ fontSize: 44, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.03em', lineHeight: 1 }}>
              {gbp(PRODUCT.price)}
            </span>
          </div>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', borderRadius: 999,
            background: '#0FBC0F', color: '#fff',
            fontSize: 12, fontWeight: 800, letterSpacing: 0.2,
          }}>
            <PFSIcon name="tag" size={13} color="#fff"/> {PRODUCT.discountPct}% OFF
          </span>
        </div>

        {/* Stand-out scarcity bar */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14,
          padding: '12px 14px', borderRadius: 10,
          background: 'linear-gradient(95deg, #FEF2F2 0%, #FFEDD5 100%)',
          border: '1.5px solid #FCA5A5',
          color: '#991B1B', fontSize: 14, fontWeight: 700,
        }}>
          <span style={{
            width: 24, height: 24, borderRadius: 999, background: '#C70036', color: '#fff',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <PFSIcon name="alert-circle" size={14} color="#fff"/>
          </span>
          <span>Hurry — only <span style={{ fontSize: 17, fontWeight: 800 }}>{PRODUCT.spacesLeft} spaces</span> left at this price</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <CountdownChip tone="amber"/>
        </div>

        <div style={{ marginTop: 14 }}>
          <BookNowCta/>
          <SmallReassurance/>
        </div>

        {/* Pay-later breakdown */}
        <div style={{
          marginTop: 14, padding: '10px 12px', borderRadius: 10,
          background: '#fff', border: '1px solid #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap',
        }}>
          <span style={{ fontSize: 13, color: '#101828' }}>
            or 3× <strong>{gbp(PRODUCT.price / 3)}</strong> <span style={{ color: '#6A7282', fontWeight: 500 }}>· 0% interest</span>
          </span>
          <span style={{ display: 'inline-flex', gap: 4 }}>
            <span style={{ padding: '3px 7px', borderRadius: 4, fontSize: 10, fontWeight: 800, background: '#FFA8CD', color: '#0B051D' }}>Klarna.</span>
            <span style={{ padding: '3px 7px', borderRadius: 4, fontSize: 10, fontWeight: 800, background: '#B2FCE4', color: '#0E1F1F' }}>Clearpay</span>
            <span style={{ padding: '3px 7px', borderRadius: 4, fontSize: 10, fontWeight: 800, background: '#003087', color: '#fff' }}>Pay<span style={{ color: '#009CDE' }}>Pal</span></span>
          </span>
        </div>
      </div>

      {/* Bullets — moved up under price card per request (was below) */}
      <div>
        <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em' }}>
          What's included
        </h2>
        <BulletList/>
      </div>

      {/* Pass-rate hero */}
      <PassRateStrip/>

      {/* BNPL */}
      <BnplCompactRow/>

      {/* Footer */}
      <SecureFooter/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  VARIATION B — "Sticky price card on the right"
//  H1 + blurb + bullets + pass rate stack on the LEFT;
//  price card with CTA pinned to the RIGHT (uses 2-col grid INSIDE the
//  640-px column so it still fits the original constraint).
// ════════════════════════════════════════════════════════════════════
function VariationB() {
  return (
    <div style={{ width: COL_WIDTH, fontFamily: 'var(--font-sans)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header zone */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Functional Skills · Maths · Level 2
          </span>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '3px 8px', borderRadius: 999, background: '#FEF2F2',
            color: '#991B1B', fontSize: 11, fontWeight: 700,
          }}>
            <PFSIcon name="flame" size={11} color="#C70036"/> {PRODUCT.spacesLeft} left
          </span>
        </div>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 800, color: '#101828', letterSpacing: '-0.025em', lineHeight: 1.15 }}>
          Functional Skills Maths Level 2 Exam
        </h1>
        <p style={{ margin: '12px 0 0', fontSize: 14, color: '#4A5565', lineHeight: 1.6 }}>
          {PRODUCT.blurb}
        </p>
      </div>

      {/* 2-col split: bullets/proof on left, price card on right */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 20, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <TrustpilotRow compact/>
          <BulletList compact/>
        </div>

        <aside style={{
          padding: 18, borderRadius: 14,
          background: '#fff', border: '2px solid #0FBC0F',
          boxShadow: '0 12px 28px -16px rgba(15,134,16,0.3)',
          display: 'flex', flexDirection: 'column', gap: 14,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#6A7282', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Today's price
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {gbp(PRODUCT.price)}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 13, color: '#98A2B3', textDecoration: 'line-through' }}>{gbp(PRODUCT.rrp)}</span>
              <span style={{ fontSize: 11, fontWeight: 800, color: '#0F8610', background: '#DBFEDA', padding: '2px 6px', borderRadius: 4 }}>
                SAVE {PRODUCT.discountPct}%
              </span>
            </div>
          </div>

          <BookNowCta size="md" label="Book now"/>

          <div style={{
            padding: '10px 12px', borderRadius: 10,
            background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412',
            fontSize: 11, lineHeight: 1.4,
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 700, marginBottom: 4 }}>
              <PFSIcon name="clock" size={13} color="#D97706"/> Offer ends in
            </div>
            <CountdownInline/>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 11, color: '#6A7282' }}>
            {[
              ['lock', '256-bit SSL secure'],
              ['rotate-ccw', '14-day money-back'],
              ['shield-check', 'Price-match guarantee'],
            ].map(([icon, label]) => (
              <span key={label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                <PFSIcon name={icon} size={12} color="#0F8610"/> {label}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {/* Pass-rate strip full-width */}
      <PassRateStrip/>

      {/* BNPL */}
      <BnplCompactRow/>

      {/* Footer */}
      <SecureFooter/>
    </div>
  );
}

function CountdownInline() {
  const { useCountdown, getOfferTarget } = window;
  // simpler inline:
  const [now, setNow] = React.useState(Date.now());
  React.useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id); }, []);
  const stored = sessionStorage.getItem('pfsOfferTarget');
  const target = stored ? parseInt(stored, 10) : (() => {
    const t = Date.now() + (2 * 86400000) + (8 * 3600000) + (42 * 60000);
    sessionStorage.setItem('pfsOfferTarget', String(t)); return t;
  })();
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff/86400000), h = Math.floor((diff%86400000)/3600000), m = Math.floor((diff%3600000)/60000), s = Math.floor((diff%60000)/1000);
  const pad = n => String(n).padStart(2,'0');
  return (
    <div style={{ display: 'flex', gap: 6, fontFamily: 'var(--font-sans)' }}>
      {[
        [d, 'days'], [h, 'hrs'], [m, 'min'], [s, 'sec'],
      ].map(([v, l]) => (
        <span key={l} style={{ flex: 1, textAlign: 'center', background: '#fff', borderRadius: 6, padding: '4px 0' }}>
          <span style={{ display: 'block', fontSize: 14, fontWeight: 800, color: '#9A3412', fontVariantNumeric: 'tabular-nums' }}>{pad(v)}</span>
          <span style={{ display: 'block', fontSize: 9, color: '#9A3412', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{l}</span>
        </span>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════
//  VARIATION C — "Editorial / outcomes-led"
//  De-emphasises discount; leads with outcomes ("get into university")
//  via a careers strip; price card is calm, confident, grey-bordered.
//  Single urgency element only (countdown ribbon at top).
// ════════════════════════════════════════════════════════════════════
function VariationC() {
  return (
    <div style={{ width: COL_WIDTH, fontFamily: 'var(--font-sans)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Single urgency ribbon at the top */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        padding: '10px 14px', borderRadius: 10,
        background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412',
        fontSize: 13, fontWeight: 600,
      }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <PFSIcon name="zap" size={14} color="#D97706"/>
          Limited release · {PRODUCT.discountPct}% off · only {PRODUCT.spacesLeft} spaces left
        </span>
        <CountdownChip tone="amber"/>
      </div>

      {/* Eyebrow */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{
          padding: '4px 10px', borderRadius: 999, background: '#F0FEEF',
          color: '#0F8610', fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
        }}>FUNCTIONAL SKILLS · LEVEL 2</span>
        <span style={{ fontSize: 12, color: '#6A7282' }}>Equivalent to GCSE grade C/4</span>
      </div>

      {/* H1 */}
      <h1 style={{ margin: 0, fontSize: 36, fontWeight: 800, color: '#101828', letterSpacing: '-0.025em', lineHeight: 1.15, textWrap: 'pretty' }}>
        Maths Level 2 — pass first time, open up your future
      </h1>

      <p style={{ margin: 0, fontSize: 15, color: '#4A5565', lineHeight: 1.65, maxWidth: 560 }}>
        {PRODUCT.blurb}
      </p>

      <TrustpilotRow compact/>

      {/* Calm price card */}
      <div style={{
        padding: 22, borderRadius: 16,
        background: '#fff', border: '1px solid #E5E7EB',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6A7282' }}>Price today</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {gbp(PRODUCT.price)}
              </span>
              <span style={{ fontSize: 14, color: '#98A2B3', textDecoration: 'line-through' }}>{gbp(PRODUCT.rrp)}</span>
              <span style={{
                fontSize: 11, fontWeight: 800, color: '#0F8610',
                background: '#F0FEEF', padding: '3px 8px', borderRadius: 999,
              }}>SAVE {gbp(PRODUCT.rrp - PRODUCT.price)}</span>
            </div>
            <div style={{ fontSize: 12, color: '#6A7282', marginTop: 6 }}>
              or 3× {gbp(PRODUCT.price / 3)} with Klarna · 0% interest
            </div>
          </div>
          <div style={{ minWidth: 220, flex: 1 }}>
            <BookNowCta label="Book your exam"/>
          </div>
        </div>

        <div style={{ height: 1, background: '#E5E7EB', margin: '18px 0' }}/>

        <BulletList compact/>
      </div>

      {/* Pass rate */}
      <PassRateStrip/>

      {/* BNPL */}
      <BnplCompactRow/>

      {/* Footer */}
      <SecureFooter/>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
//  VARIATION D — "Conversion max"
//  Sharper than A/B/C, not calmer: live activity ticker, bundle pre-selected
//  as the default plan (single price anchor, no crossed-price clutter),
//  one dominant CTA. Same urgency intensity as the live site (kept, not toned
//  down). Mobile gets a persistent sticky CTA bar — noted, not built this round.
// ═════════════════════════════════════════════════════════════
function VariationD() {
  const [plan, setPlan] = React.useState('bundle'); // pre-selected: the upsell, per request
  const isBundle = plan === 'bundle';
  const price = isBundle ? PRODUCT.price + PRODUCT.examCourseAddOn : PRODUCT.price;
  const rrp = isBundle ? PRODUCT.rrp + PRODUCT.examCourseAddOn : PRODUCT.rrp;

  return (
    <div style={{ width: COL_WIDTH, fontFamily: 'var(--font-sans)', background: '#fff', display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Eyebrow + compact trust chip, one line — fewer competing signals */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#0F8610', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Functional Skills · Maths · Level 2
        </span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: '#D1D5DB' }}/>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: '#101828' }}>
          <span style={{ color: '#00B67A' }}>★</span> {PRODUCT.trustpilotRating} <span style={{ color: '#6A7282', fontWeight: 500 }}>Trustpilot</span>
        </span>
        <span style={{ width: 4, height: 4, borderRadius: 999, background: '#D1D5DB' }}/>
        <span style={{ fontSize: 12, color: '#6A7282' }}>Ofqual regulated</span>
      </div>

      <h1 style={{ margin: 0, fontSize: 38, fontWeight: 800, color: '#101828', letterSpacing: '-0.03em', lineHeight: 1.1, textWrap: 'pretty' }}>
        Functional Skills Maths Level 2 Exam
      </h1>

      <div><LiveActivityTicker/></div>

      {/* Price card — single anchor, bundle pre-selected */}
      <div style={{
        padding: 22, borderRadius: 18,
        background: '#fff', border: '2px solid #0FBC0F',
        boxShadow: '0 10px 28px -14px rgba(15,134,16,0.35)',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        <BundleToggle value={plan} onChange={setPlan}/>

        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontSize: 17, color: '#98A2B3', textDecoration: 'line-through', fontWeight: 600 }}>{gbp(rrp)}</span>
            <span style={{ fontSize: 42, fontWeight: 800, color: '#0F8610', letterSpacing: '-0.03em', lineHeight: 1 }}>{gbp(price)}</span>
          </div>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, background: '#0FBC0F', color: '#fff', fontSize: 12, fontWeight: 800 }}>
            <PFSIcon name="tag" size={13} color="#fff"/> {PRODUCT.discountPct}% OFF
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '11px 14px', borderRadius: 10, background: 'linear-gradient(95deg,#FEF2F2 0%,#FFEDD5 100%)', border: '1.5px solid #FCA5A5', color: '#991B1B', fontSize: 13, fontWeight: 700 }}>
          <span style={{ width: 22, height: 22, borderRadius: 999, background: '#C70036', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PFSIcon name="alert-circle" size={13} color="#fff"/>
          </span>
          Only <span style={{ fontSize: 15, fontWeight: 800 }}>{PRODUCT.spacesLeft} spaces</span> left at this price
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <CountdownChip tone="amber"/>
        </div>

        <BookNowCta label={isBundle ? 'Book exam + course' : 'Book your exam'}/>
        <SmallReassurance/>
      </div>

      <div>
        <h2 style={{ margin: '0 0 14px', fontSize: 18, fontWeight: 700, color: '#101828', letterSpacing: '-0.01em' }}>What's included</h2>
        <BulletList/>
      </div>

      <PassRateStrip/>
      <BnplCompactRow/>

      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', borderRadius: 10, border: '1px dashed #D1D5DB', color: '#6A7282', fontSize: 12, lineHeight: 1.5 }}>
        <PFSIcon name="smartphone" size={14} color="#98A2B3"/>
        <span><strong style={{ color: '#4A5565' }}>Mobile spec:</strong> this price card becomes a persistent sticky bar pinned to the bottom of the screen on mobile, so the CTA stays one tap away while scrolling.</span>
      </div>

      <SecureFooter/>
    </div>
  );
}

window.PRODUCT_VARIATIONS = { VariationA, VariationB, VariationC, VariationD };
