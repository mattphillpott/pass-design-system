/* Org Settings page — Pass DS rebuild + Initial Assessment Visibility card.
   3 directions for the destructive "reset all students" action:
     A — apply-to-all checkbox beside Save
     B — separate danger zone with its own button
     C — save-time choice modal (new students only vs all students)
   warnStyle tweak (modal | type | inline) sets how the destructive step is confirmed.
   Exposes window.OrgSettingsPage. */
const { useState: useStateO } = React;

const OVERRIDE_COUNT = 23;           // students that currently have custom IA settings
const nset = (s) => new Set(s);
const tog = (s, id) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; };
const many = (s, ids, on) => { const n = new Set(s); ids.forEach(i => on ? n.add(i) : n.delete(i)); return n; };

/* ---------------- nav (reuses .asnav from as.css) ---------------- */
function OSNav() {
  const links = ['Dashboard', 'Students', 'Teachers', 'Groups', 'Reports', 'Resources', 'Settings', 'Help'];
  return (
    <div className="asnav">
      <div className="brand"><span className="mk"><Ico name="Check" size={17} /></span><span className="nm">PASS</span></div>
      <div className="org"><span className="p">+</span>TQUK</div>
      <div className="links">{links.map(l => <a key={l} href="#" className={l === 'Settings' ? 'active' : ''} onClick={(e) => e.preventDefault()}>{l}</a>)}</div>
      <div className="spacer" />
      <button className="loginbtn">Log into Student Platform</button>
      <button className="ibtn"><Ico name="Plus" size={18} /></button>
      <div className="avatar">CP</div>
    </div>
  );
}

function Check({ on, onClick, children }) {
  return (
    <div className={'os-check' + (on ? ' on' : '')} onClick={onClick}>
      <span className="os-cb">{on && <Ico name="Check" size={14} />}</span>
      <span className="cl">{children}</span>
    </div>
  );
}

function OSCard({ icon, brand, title, badge, desc, focus, children, foot }) {
  return (
    <div className={'os-card' + (focus ? ' focus' : '')}>
      <div className="os-head">
        <div className={'hi' + (brand ? ' brand' : '')}><Ico name={icon} size={21} /></div>
        <div className="ht">
          <div className="os-htitle">{title}{badge}</div>
          {desc && <p className="os-hsub">{desc}</p>}
        </div>
      </div>
      <div className="os-body">{children}</div>
      {foot && <div className="os-foot">{foot}</div>}
    </div>
  );
}

/* ---------------- the four existing cards, rebuilt ---------------- */
function EmailCard() {
  const [v, setV] = useStateO({ a: true, b: true, c: true });
  const [saved, setSaved] = useStateO(false);
  const t = (k) => { setV(x => ({ ...x, [k]: !x[k] })); setSaved(false); };
  return (
    <OSCard icon="BellActiveAlt" title="Email Notification Preferences"
      desc="You can choose whether you receive certain email notifications. Select which notifications you wish to receive:"
      foot={<><button className="os-btn primary" onClick={() => setSaved(true)}>Save Email Preferences</button>{saved && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved</span>}</>}>
      <div className="os-checks">
        <Check on={v.a} onClick={() => t('a')}>Student Subject Knowledge Assessment Completed</Check>
        <Check on={v.b} onClick={() => t('b')}>Student Initial Assessment Completed</Check>
        <Check on={v.c} onClick={() => t('c')}>Student Personal Learning Plan Completed</Check>
      </div>
    </OSCard>
  );
}
function OneFileCard() {
  return (
    <OSCard icon="ArrowPath" title="OneFile Integration"
      foot={<button className="os-btn primary"><Ico name="ArrowPath" size={16} />Bulk Match My Students</button>}>
      <div className="os-synced">Last Synced At: <b>Never</b></div>
    </OSCard>
  );
}
function FeaturesCard() {
  const [v, setV] = useStateO({ a: true, b: true });
  const [saved, setSaved] = useStateO(false);
  const t = (k) => { setV(x => ({ ...x, [k]: !x[k] })); setSaved(false); };
  return (
    <OSCard icon="Sliders" title="Features" desc="You can opt-in or out of certain site features."
      foot={<><button className="os-btn primary" onClick={() => setSaved(true)}>Save</button>{saved && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved</span>}</>}>
      <div className="os-checks">
        <Check on={v.a} onClick={() => t('a')}>Student Exam Readiness</Check>
        <Check on={v.b} onClick={() => t('b')}>Limit The Courses Students Can Personally Enrol On Based On Their Initial Assessment Results</Check>
      </div>
    </OSCard>
  );
}
function MFACard() {
  const [v, setV] = useStateO({ s: false, t: false, o: false });
  const [saved, setSaved] = useStateO(false);
  const t = (k) => { setV(x => ({ ...x, [k]: !x[k] })); setSaved(false); };
  return (
    <OSCard icon="Lock" title="Multifactor Authentication" desc="Enable MFA on the following user types:"
      foot={<><button className="os-btn primary" onClick={() => setSaved(true)}>Save</button>{saved && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved</span>}</>}>
      <div className="os-checks">
        <Check on={v.s} onClick={() => t('s')}>Enable for Student</Check>
        <Check on={v.t} onClick={() => t('t')}>Enable for Teacher</Check>
        <Check on={v.o} onClick={() => t('o')}>Enable for Organisation Manager</Check>
      </div>
    </OSCard>
  );
}

/* ---------------- destructive confirm (modal / type / inline) ---------------- */
function ConfirmContent({ warnStyle, typed, setTyped }) {
  return (
    <>
      <p>This clears the custom Initial Assessment visibility saved for <b>{OVERRIDE_COUNT} students</b>. They’ll follow this organisation default from now on.</p>
      <div className="warnbox"><Ico name="ExclamationCircle" size={15} />This can’t be undone — individual student settings will be lost.</div>
      {warnStyle === 'type' && (
        <div className="os-typewrap">
          <label>Type <b>CLEAR</b> to confirm</label>
          <input value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="CLEAR" autoFocus />
        </div>
      )}
    </>
  );
}

function Modal({ title, warnStyle, onCancel, onConfirm, confirmLabel }) {
  const [typed, setTyped] = useStateO('');
  const ok = warnStyle !== 'type' || typed.trim().toUpperCase() === 'CLEAR';
  return (
    <div className="os-overlay" onClick={onCancel}>
      <div className="os-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mh"><div className="ic"><Ico name="ExclamationCircle" size={22} /></div><h3>{title}</h3></div>
        <div className="mb"><ConfirmContent warnStyle={warnStyle} typed={typed} setTyped={setTyped} /></div>
        <div className="mf">
          <button className="os-btn ghost" onClick={onCancel}>Cancel</button>
          <button className="os-btn danger" disabled={!ok} onClick={ok ? onConfirm : undefined}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

function SuccessBanner() {
  return (
    <div className="os-success"><Ico name="CheckCircle" size={19} />
      <div className="st">
        <div className="n">Saved — {OVERRIDE_COUNT} students reset to this default</div>
        <div className="m">Custom Initial Assessment settings were cleared. Every student now follows your organisation default, including the {OVERRIDE_COUNT} that previously had overrides.</div>
      </div>
    </div>
  );
}

/* ---------------- the Initial Assessment Visibility card ---------------- */
function ShowIACard({ direction, cfg }) {
  const [shown, setShown] = useStateO(() => nset(window.IA.ALL_IDS.filter(id => id !== 'ma-ds')));
  const [applyAll, setApplyAll] = useStateO(false);
  const [saved, setSaved] = useStateO(false);
  const [applied, setApplied] = useStateO(cfg.state === 'confirmed');
  const [modal, setModal] = useStateO(null);   // null | 'confirm' | 'choice'
  const [inline, setInline] = useStateO(false);
  const warn = cfg.warnStyle;

  const doClear = () => { setApplied(true); setSaved(true); setModal(null); setInline(false); setApplyAll(false); };
  const justSave = () => { setSaved(true); setModal(null); };

  // trigger the destructive confirmation in whatever style is set
  const triggerDestructive = () => {
    if (warn === 'inline') setInline(true);
    else setModal('confirm');
  };

  const editor = (
    <ToggleListBody hidden={shown} forcedList={[]}
      onToggle={(id) => { setShown(s => tog(s, id)); setSaved(false); }}
      onToggleMany={(ids, on) => { setShown(s => many(s, ids, on)); setSaved(false); }} />
  );

  const impact = <span className="os-impact"><Ico name="User" size={15} /><b>{OVERRIDE_COUNT}</b>&nbsp;students have custom settings</span>;

  // ----- Direction A: checkbox beside save -----
  const footA = (
    <>
      <button className="os-btn primary" onClick={() => applyAll ? triggerDestructive() : justSave()}>Save default</button>
      {saved && !applied && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved for new students</span>}
      <span style={{ flex: 1 }} />{impact}
    </>
  );
  // ----- Direction B: normal save; danger zone below -----
  const footB = (
    <>
      <button className="os-btn primary" onClick={justSave}>Save default</button>
      {saved && !applied && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved for new students</span>}
      <span style={{ flex: 1 }} /><a className="ia-managelink" style={{ fontSize: 13.5 }}>New students follow this automatically</a>
    </>
  );
  // ----- Direction C: save opens a choice modal -----
  const footC = (
    <>
      <button className="os-btn primary" onClick={() => setModal('choice')}>Save default…</button>
      {saved && !applied && <span className="os-savednote"><Ico name="CheckCircle" size={15} />Saved for new students</span>}
      <span style={{ flex: 1 }} />{impact}
    </>
  );

  const desc = "Choose which initial assessments students see on their learning portal by default. This applies across your whole organisation; individual students can be customised on their own record.";

  return (
    <OSCard icon="Eye" brand focus title="Initial Assessment Visibility"
      badge={<span className="badge badge--student"><Ico name="Building" size={13} />Organisation default</span>}
      desc={desc}
      foot={direction === 'A' ? footA : direction === 'B' ? footB : footC}>

      {applied ? <SuccessBanner /> : editor}

      {/* Direction A — apply-to-all checkbox */}
      {direction === 'A' && !applied && (
        <div className={'os-applyrow' + (applyAll ? ' on' : '')} onClick={() => setApplyAll(a => !a)} style={{ marginTop: 18, marginBottom: 0 }}>
          <span className="os-cb">{applyAll && <Ico name="Check" size={14} />}</span>
          <span className="t">Also apply to <b>all {OVERRIDE_COUNT} existing students</b>, clearing their custom settings. Otherwise this only affects new students.</span>
        </div>
      )}

      {/* Direction B — danger zone */}
      {direction === 'B' && !applied && (
        <div className="os-danger">
          <div className="dh"><Ico name="ExclamationCircle" size={16} />Reset existing students</div>
          <p className="dp">Saving above only changes the default for <b>new</b> students. To force <b>all {OVERRIDE_COUNT}</b> students with custom settings onto this default, reset them here.</p>
          {inline ? (
            <div className="os-inline">
              <div className="ih"><Ico name="ExclamationCircle" size={16} />Reset {OVERRIDE_COUNT} students to this default?</div>
              <p className="ip">This clears their custom Initial Assessment settings and can’t be undone.</p>
              <div className="ia"><button className="os-btn ghost" onClick={() => setInline(false)}>Cancel</button><button className="os-btn danger" onClick={doClear}>Yes, reset {OVERRIDE_COUNT} students</button></div>
            </div>
          ) : (
            <button className="os-btn danger-ghost" onClick={triggerDestructive}><Ico name="ArrowPath" size={16} />Reset all students to this default</button>
          )}
        </div>
      )}

      {/* confirm modal (A + B, non-inline) */}
      {modal === 'confirm' && (
        <Modal title={'Reset ' + OVERRIDE_COUNT + ' students to this default?'} warnStyle={warn}
          onCancel={() => setModal(null)} onConfirm={doClear} confirmLabel={'Reset ' + OVERRIDE_COUNT + ' students'} />
      )}

      {/* choice modal (C) */}
      {modal === 'choice' && (
        <div className="os-overlay" onClick={() => setModal(null)}>
          <div className="os-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mh"><div className="ic" style={{ background: 'var(--green-soft)', color: 'var(--green-dark)' }}><Ico name="Eye" size={22} /></div><h3>Apply this default to…</h3></div>
            <div className="os-choice">
              <button className="os-choicebtn" onClick={justSave}>
                <span className="ci safe"><Ico name="UserPlus" size={20} /></span>
                <span className="ct"><span className="n">New students only</span><span className="m">Existing students keep their current settings.</span></span>
                <span className="go"><Ico name="AngleRight" size={18} /></span>
              </button>
              <button className="os-choicebtn danger" onClick={() => { warn === 'type' ? setModal('confirm') : doClear(); }}>
                <span className="ci danger"><Ico name="ArrowPath" size={20} /></span>
                <span className="ct"><span className="n">All students — clear {OVERRIDE_COUNT} overrides</span><span className="m">Resets everyone to this default. Can’t be undone.</span></span>
                <span className="go"><Ico name="AngleRight" size={18} /></span>
              </button>
            </div>
            <div className="mf"><button className="os-btn ghost" onClick={() => setModal(null)}>Cancel</button></div>
          </div>
        </div>
      )}
    </OSCard>
  );
}

/* ---------------- page ---------------- */
function OrgSettingsPage({ direction, cfg }) {
  return (
    <div className="os-page">
      <OSNav />
      <div className="os-wrap">
        <h1 className="os-title">Settings</h1>
        <EmailCard />
        <OneFileCard />
        <FeaturesCard />
        <ShowIACard direction={direction} cfg={cfg} />
        <MFACard />
      </div>
    </div>
  );
}
window.OrgSettingsPage = OrgSettingsPage;
