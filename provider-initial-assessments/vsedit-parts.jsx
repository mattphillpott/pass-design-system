/* View Student — Hidden Initial Assessments EDIT state. 3 patterns (Rows / Toggle / Matrix),
   inheritance-aware: student overrides the organisation default per subject+level, with reset.
   Reuses the exact Hide bodies from ia-parts (HideRowsBody / ToggleListBody / MatrixBody)
   and the summary/preview from vs-parts. Exposes VSEditDirection. */
const { useState: useStateE } = React;

const ECATALOG = [
  { id: 'en-fs', subject: 'English', level: 'Functional Skills' },
  { id: 'en-esol', subject: 'English', level: 'ESOL' },
  { id: 'ma-fs', subject: 'Maths', level: 'Functional Skills' },
  { id: 'ma-ds', subject: 'Maths', level: 'Digital Skills' },
];
const EFIRST = 'Lewis';

/* org default (Set of ids hidden org-wide) + student overrides (map id -> 'hidden'|'visible') */
function editSeed(scenario) {
  const S = {
    mixed: { org: ['en-esol', 'ma-ds'], stu: { 'en-fs': 'hidden', 'en-esol': 'visible' } },
    global: { org: ['en-esol', 'ma-ds'], stu: {} },
    student: { org: [], stu: { 'en-fs': 'hidden', 'ma-fs': 'hidden' } },
    none: { org: [], stu: {} },
  }[scenario] || { org: [], stu: {} };
  return { org: new Set(S.org), stu: { ...S.stu } };
}
const effHidden = (id, org, override) => (id in override ? override[id] === 'hidden' : org.has(id));
function effectiveSet(org, override) {
  return new Set(ECATALOG.filter(c => effHidden(c.id, org, override)).map(c => c.id));
}
function computeCounts(effSet, org) {
  const hidden = ECATALOG.filter(c => effSet.has(c.id));
  const overridden = ECATALOG.filter(c => effSet.has(c.id) !== org.has(c.id));
  return {
    total: ECATALOG.length, hidden: hidden.length, visible: ECATALOG.length - hidden.length,
    hiddenOrg: hidden.filter(c => !overridden.includes(c)).length,
    hiddenStudent: hidden.filter(c => overridden.includes(c)).length,
    overrides: overridden.length,
  };
}
const previewRows = (effSet) => ECATALOG.map(c => ({ ...c, hidden: effSet.has(c.id) }));

/* ---------------- shared edit shell ---------------- */
function EditShell({ children }) {
  return (
    <div className="vs-sec">
      <div className="vs-sec-head">
        <div className="ht">
          <div className="vs-sec-title"><span className="si"><Ico name="EyeSlash" size={19} /></span>Hide Initial Assessments <span className="ia-rec" style={{ background: 'var(--blue)' }}><Ico name="Pen" size={12} />Editing</span></div>
          <p className="vs-sec-sub">Choose which initial assessments {EFIRST} sees on their learning portal. Anything you don’t change here inherits your organisation default.</p>
        </div>
        <div className="vs-editbtn"><Btn variant="secondary" size="sm" icon="Close">Cancel</Btn></div>
      </div>
      <hr className="vs-divider" />
      <div className="vs-sec-body">{children}</div>
      <div className="vse-foot">
        <a className="vs-managelink"><Ico name="Building" size={15} />Manage organisation default<Ico name="ArrowRightLong" size={15} /></a>
        <span style={{ flex: 1 }} />
        <button className="cancel">Cancel</button>
        <Btn variant="primary" icon="Check">Save changes</Btn>
      </div>
    </div>
  );
}
function EditBanner({ c }) {
  return (
    <div className="vse-banner"><Ico name="InfoCircle" size={18} />
      <div><b>You’re editing for {EFIRST} only.</b> {c.overrides ? c.overrides + ' item' + (c.overrides === 1 ? '' : 's') + ' now differ' + (c.overrides === 1 ? 's' : '') + ' from your organisation default' : 'No changes yet — everything follows your organisation default'}. Use <b>Reset</b> to send an item back to the organisation setting.</div>
    </div>
  );
}
function EditBlock({ effSet, org, mode, setMode, preview, children }) {
  const c = computeCounts(effSet, org);
  return (
    <>
      <window.VSSummary c={c} />
      <EditBanner c={c} />
      {children}
      {preview && <window.VSPreview rows={previewRows(effSet)} mode={mode} setMode={setMode} />}
    </>
  );
}

/* ---------------- A · Rows (student-added hides + inherited overrides) ---------------- */
function matchRule(rule) { return ECATALOG.filter(c => rule.subject === c.subject && (rule.level == null || rule.level === c.level)); }
function EditRows({ scenario, showGlobal, preview }) {
  const seed = React.useMemo(() => editSeed(scenario), [scenario]);
  const org = seed.org;
  // student-added hides expressed as rules for items org does NOT already hide
  const seedRules = Object.entries(seed.stu).filter(([id, v]) => v === 'hidden' && !org.has(id))
    .map(([id]) => { const c = ECATALOG.find(x => x.id === id); return { id: window.IA.uid(), subject: c.subject, level: c.level }; });
  const seedShown = new Set(Object.entries(seed.stu).filter(([id, v]) => v === 'visible' && org.has(id)).map(([id]) => id));
  const [rules, setRules] = useStateE(seedRules);
  const [shown, setShown] = useStateE(seedShown);
  const [mode, setMode] = useStateE('absent');

  const ruleHidden = new Set(rules.flatMap(r => matchRule(r)).map(c => c.id));
  const effSet = new Set(ECATALOG.filter(c => (org.has(c.id) && !shown.has(c.id)) || ruleHidden.has(c.id)).map(c => c.id));
  const orgList = ECATALOG.filter(c => org.has(c.id));
  const toggleShown = (id) => setShown(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <EditBlock effSet={effSet} org={org} mode={mode} setMode={setMode} preview={preview}>
      {orgList.length > 0 && (
        <div className="vse-inh">
          <div className="vse-inh-h"><Ico name="Building" size={16} />Inherited from your organisation<span className="c">· {orgList.length} hidden by default</span></div>
          <div className="vse-inh-b">
            {orgList.map(c => {
              const isShown = shown.has(c.id);
              return (
                <div className={'vse-ichip' + (isShown ? ' shown' : '')} key={c.id}>
                  <div className="ii"><Ico name={isShown ? 'Eye' : 'EyeSlash'} size={16} /></div>
                  <div className="it"><div className="n">{c.subject} · {c.level}</div><div className="m">{isShown ? 'Shown for ' + EFIRST + ' — overrides the organisation default' : 'Hidden by your organisation'}</div></div>
                  {isShown && <span className="vs-src student"><Ico name="User" size={13} />Student override</span>}
                  <Btn variant={isShown ? 'ghost' : 'secondary'} size="sm" icon={isShown ? 'ArrowPath' : 'Eye'} onClick={() => toggleShown(c.id)}>{isShown ? 'Reset' : 'Show for ' + EFIRST}</Btn>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="vse-sublabel"><Ico name="User" size={16} />Hide more, just for {EFIRST}</div>
      <ShowRowsBody rules={rules} forcedList={[]} mode="hide"
        addLabel={'Add another to hide for ' + EFIRST} emptyAddLabel={'Hide an assessment for ' + EFIRST}
        emptyLead={'Nothing extra is hidden for ' + EFIRST + ' beyond the organisation default.'}
        onAdd={() => setRules(r => [...r, { id: window.IA.uid(), subject: undefined, level: undefined }])}
        onPatch={(id, p) => setRules(r => r.map(x => x.id === id ? { ...x, ...p } : x))}
        onRemove={(id) => setRules(r => r.filter(x => x.id !== id))} />
    </EditBlock>
  );
}

/* ---------------- B · Toggle list (inheritance-aware) ---------------- */
function EditToggle({ scenario, showGlobal, preview }) {
  const seed = React.useMemo(() => editSeed(scenario), [scenario]);
  const org = seed.org;
  const seedOverride = {};
  Object.entries(seed.stu).forEach(([id, v]) => { if ((v === 'hidden') !== org.has(id)) seedOverride[id] = v; });
  const [override, setOverride] = useStateE(seedOverride);
  const [mode, setMode] = useStateE('absent');
  const effSet = effectiveSet(org, override);

  const setEff = (id, hide) => setOverride(o => {
    const n = { ...o };
    if (hide === org.has(id)) delete n[id]; else n[id] = hide ? 'hidden' : 'visible';
    return n;
  });
  const onToggle = (id) => setEff(id, !effHidden(id, org, override));
  const onToggleMany = (ids, on) => setOverride(o => { const n = { ...o }; ids.forEach(id => { if (on === org.has(id)) delete n[id]; else n[id] = on ? 'hidden' : 'visible'; }); return n; });
  const onReset = (id) => setOverride(o => { const n = { ...o }; delete n[id]; return n; });

  return (
    <EditBlock effSet={effSet} org={org} mode={mode} setMode={setMode} preview={preview}>
      <ToggleListBody hidden={effSet} onToggle={onToggle} onToggleMany={onToggleMany} forcedList={[]} orgHidden={org} onReset={onReset} showOrg={showGlobal} />
    </EditBlock>
  );
}

/* ---------------- C · Matrix (inheritance-aware) ---------------- */
function EditMatrix({ scenario, showGlobal, preview }) {
  const seed = React.useMemo(() => editSeed(scenario), [scenario]);
  const org = seed.org;
  const seedOverride = {};
  Object.entries(seed.stu).forEach(([id, v]) => { if ((v === 'hidden') !== org.has(id)) seedOverride[id] = v; });
  const [override, setOverride] = useStateE(seedOverride);
  const [mode, setMode] = useStateE('absent');
  const effSet = effectiveSet(org, override);

  const onToggle = (id) => setOverride(o => {
    const n = { ...o }; const hide = !effHidden(id, org, override);
    if (hide === org.has(id)) delete n[id]; else n[id] = hide ? 'hidden' : 'visible';
    return n;
  });
  const onReset = (id) => setOverride(o => { const n = { ...o }; delete n[id]; return n; });

  return (
    <EditBlock effSet={effSet} org={org} mode={mode} setMode={setMode} preview={preview}>
      <MatrixBody hidden={effSet} onToggle={onToggle} forcedList={[]} orgHidden={org} onReset={onReset} />
      <div className="as-prev-empty" style={{ marginTop: 12, color: 'var(--gray)' }}>Click a cell to hide/show for {EFIRST}. Cells marked <b>Student</b> override the organisation default — use the ↺ to reset.</div>
    </EditBlock>
  );
}

/* ---------------- one direction (hero + editable section) ---------------- */
function VSEditDirection({ variant, cfg }) {
  const body = variant === 'A' ? <EditRows scenario={cfg.scenario} showGlobal={cfg.showGlobal} preview={cfg.preview} />
    : variant === 'B' ? <EditToggle scenario={cfg.scenario} showGlobal={cfg.showGlobal} preview={cfg.preview} />
      : <EditMatrix scenario={cfg.scenario} showGlobal={cfg.showGlobal} preview={cfg.preview} />;
  return (
    <div className="pass vs-page">
      <window.VSHero />
      <EditShell>{body}</EditShell>
    </div>
  );
}
window.VSEditDirection = VSEditDirection;
