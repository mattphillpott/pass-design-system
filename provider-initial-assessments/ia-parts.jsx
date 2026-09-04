/* Initial Assessments visibility — provider-side building blocks + 3 directions.
   MODEL (Phase 1): providers choose which initial assessments to SHOW. Anything not
   chosen is hidden from the student learning portal. Forced assessments are always shown.

   Exposes: IA (data/helpers), IaSelect, SettingsCard,
   controlled bodies: ShowRowsBody, ToggleListBody, MatrixBody,
   stateful wrappers (standalone canvas): ShowRows, ToggleList, Matrix.

   The bodies run in SHOW mode by default. Passing `orgHidden` switches a body to the
   legacy inheritance (hide/override) semantics used by the View Student edit state. */
const { useState } = React;

/* ---------------- data ---------------- */
const SUBJECTS = ['English', 'Maths'];
const LEVELS = ['Functional Skills', 'ESOL', 'Digital Skills'];

const CATALOG = [
  { id: 'en-fs', subject: 'English', level: 'Functional Skills', desc: 'Reading, writing & SPaG', mins: 30 },
  { id: 'en-esol', subject: 'English', level: 'ESOL', desc: 'Speaking, listening & reading', mins: 35 },
  { id: 'ma-fs', subject: 'Maths', level: 'Functional Skills', desc: 'Number, measures & handling data', mins: 40 },
  { id: 'ma-ds', subject: 'Maths', level: 'Digital Skills', desc: 'Working with numbers digitally', mins: 30 },
];
const ALL_IDS = CATALOG.map(c => c.id);

const isForcedBy = (c, forcedList) => (forcedList || []).some(f => f.subject === c.subject && (f.level == null || f.level === c.level));
const matchesRule = (c, r) => r.subject === c.subject && (r.level == null || r.level === c.level);

/* Example SHOW rules for the "filled" state — show only the Functional Skills assessments. */
function makeRules() {
  return [{ id: 'r1', subject: 'English', level: 'Functional Skills' }, { id: 'r2', subject: 'Maths', level: 'Functional Skills' }];
}

/* SHOW model — rows representation. `showRules` lists what to show; an EMPTY list means
   show everything (no restriction). Forced assessments are always shown. */
function computeShownStatus(showRules, forced) {
  const forcedList = forced === true ? [{ subject: 'English', level: 'Functional Skills' }] : (forced || []);
  const showAll = !showRules || showRules.length === 0;
  return CATALOG.map(c => {
    const isF = isForcedBy(c, forcedList);
    const shownByRule = showAll || showRules.some(r => matchesRule(c, r));
    return { ...c, forced: isF, hidden: !(shownByRule || isF) };
  });
}

/* SHOW model — set representation (toggle / matrix). `shownSet` holds the ids that are shown. */
function shownSetToStatus(shownSet, forced) {
  const forcedList = forced === true ? [{ subject: 'English', level: 'Functional Skills' }] : (forced || []);
  return CATALOG.map(c => {
    const isF = isForcedBy(c, forcedList);
    return { ...c, forced: isF, hidden: !(shownSet.has(c.id) || isF) };
  });
}

/* Legacy HIDE model — kept for the inheritance (View/Edit) surfaces until their phase. */
function computeStatus(rules, forced) {
  const forcedList = forced === true ? [{ subject: 'English', level: 'Functional Skills' }] : (forced || []);
  return CATALOG.map(c => {
    const isF = isForcedBy(c, forcedList);
    const ruleHidden = (rules || []).some(r => matchesRule(c, r));
    return { ...c, forced: isF, hidden: ruleHidden && !isF };
  });
}

window.IA = { SUBJECTS, LEVELS, CATALOG, ALL_IDS, isForcedBy, makeRules, computeShownStatus, shownSetToStatus, computeStatus };

let __idc = 100;
const uid = () => 'r' + (++__idc);
window.IA.uid = uid;

/* ---------------- custom select (matches the Force screenshot) ---------------- */
function IaSelect({ value, options, placeholder, emptyLabel, clearable, onChange }) {
  const [open, setOpen] = useState(false);
  const opts = options.map(o => (typeof o === 'object' ? o : { value: o, label: o }));
  const cur = opts.find(o => o.value === value);
  const label = cur ? cur.label : (emptyLabel || placeholder);
  const muted = !cur && !emptyLabel;
  return (
    <div className={'ia-select' + (open ? ' is-open' : '')}>
      {open && <div className="ia-backdrop" onClick={() => setOpen(false)} />}
      <button type="button" className="ia-select-btn" onClick={() => setOpen(o => !o)}>
        <span className={'val' + (muted ? ' is-ph' : '')}>{label}</span>
        {clearable && cur && (
          <span className="clr" role="button" aria-label="Clear"
            onClick={(e) => { e.stopPropagation(); onChange(undefined); setOpen(false); }}>
            <Ico name="Close" size={16} />
          </span>
        )}
        <span className="chev"><Ico name="AngleDown" size={18} /></span>
      </button>
      {open && (
        <div className="ia-menu">
          {opts.map(o => (
            <div key={String(o.value)} className={'ia-opt' + (o.value === value ? ' is-sel' : '')}
              onClick={() => { onChange(o.value); setOpen(false); }}>
              <span>{o.label}</span>
              {o.note && <span className="allnote">{o.note}</span>}
              {o.value === value && <span className="oc"><Ico name="Check" size={16} /></span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- settings card shell (standalone canvas only) ---------------- */
function SettingsCard({ title, subtitle, badge, children }) {
  return (
    <div className="ia-card pass">
      <div className="ia-head">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <h3>{title}</h3>{badge}
        </div>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <hr className="ia-divider" />
      <div className="ia-body">{children}</div>
    </div>
  );
}

/* ===================================================================
   Controlled bodies — no card chrome, state lifted to the caller.
   =================================================================== */

/* A — repeatable subject + level rows (SHOW model, or HIDE when mode="hide"). */
function ShowRowsBody({ rules, onAdd, onPatch, onRemove, forcedList, mode = 'show',
  addLabel, emptyAddLabel, emptyLead }) {
  const show = mode !== 'hide';
  const dAdd = addLabel || (show ? 'Add another to show' : 'Add another assessment to hide');
  const dEmptyAdd = emptyAddLabel || (show ? 'Choose an assessment to show' : 'Add an assessment to hide');
  if (!rules || rules.length === 0) {
    return (
      <div className="ia-empty">
        <div className="ico"><Ico name={show ? 'Eye' : 'EyeSlash'} size={22} /></div>
        <h4>{show ? 'Showing every initial assessment' : 'Nothing hidden yet'}</h4>
        <p>{emptyLead || (show
          ? 'Students currently see all initial assessments. Choose specific ones below to limit them to only the assessments you select — everything else is then hidden.'
          : 'By default students see every initial assessment. Add one below to hide it — for a whole subject, or narrowed to a single level group.')}</p>
        <button className="ia-add" style={{ marginTop: 14 }} onClick={onAdd}><Ico name="Plus" size={18} />{dEmptyAdd}</button>
      </div>
    );
  }
  return (
    <>
      {show && (
        <div className="ia-note-info">
          <Ico name="InfoCircle" size={17} />
          <div>Students will see <b>only</b> the assessments listed here. Leave a level group blank to show every level of that subject.</div>
        </div>
      )}
      <div className="ia-rules">
        {rules.map((row, i) => (
          <div key={row.id}>
            <div className="ia-row">
              <div>
                <div className="ia-flabel">Subject <span className="req">*</span></div>
                <IaSelect value={row.subject} placeholder="Select subject" clearable
                  options={SUBJECTS} onChange={(v) => onPatch(row.id, { subject: v })} />
              </div>
              <div>
                <div className="ia-flabel">Level group <span className="optn">(optional)</span></div>
                <IaSelect value={row.level} emptyLabel="All levels" clearable
                  options={LEVELS} onChange={(v) => onPatch(row.id, { level: v })} />
              </div>
              <button className="ia-del" aria-label="Remove" onClick={() => onRemove(row.id)}><Ico name="Close" size={20} /></button>
            </div>
            {i < rules.length - 1 && <hr className="ia-rowsep" />}
          </div>
        ))}
      </div>
      <button className="ia-add mt" onClick={onAdd}><Ico name="Plus" size={18} />{dAdd}</button>
    </>
  );
}

/* B — visibility toggle list. SHOW mode by default; passing `orgHidden` switches to the
   legacy inheritance (hide/override) semantics used by the View Student edit state. */
function ToggleListBody({ hidden, onToggle, onToggleMany, forcedList, orgHidden, onReset, showOrg }) {
  const inh = !!orgHidden;
  const showMode = !inh;
  const groups = SUBJECTS.map(s => ({ s, items: CATALOG.filter(c => c.subject === s) }));
  return (
    <div className="ia-tl">
      {groups.map(({ s, items }) => {
        const toggleable = items.filter(c => !window.IA.isForcedBy(c, forcedList));
        const allInSet = toggleable.length > 0 && toggleable.every(c => hidden.has(c.id));
        return (
          <div className="ia-tgroup" key={s}>
            <div className="ia-tghead">
              <span className="sub">{s}</span>
              <span className="cnt">· {items.length} assessments</span>
              <span className="all">{showMode ? 'Show all levels' : 'Hide all levels'}
                <button className="ia-sw" data-on={showMode ? (allInSet ? 1 : 0) : (allInSet ? 0 : 1)}
                  onClick={() => onToggleMany(toggleable.map(c => c.id), !allInSet)}><i /></button>
              </span>
            </div>
            {items.map(c => {
              const forced = window.IA.isForcedBy(c, forcedList);
              const inSet = hidden.has(c.id);
              const hid = showMode ? !(forced || inSet) : (!forced && inSet);
              const overridden = inh && !forced && (hid !== orgHidden.has(c.id));
              return (
                <div className={'ia-titem' + (hid ? ' is-hidden' : '')} key={c.id}>
                  <div className="tico"><Ico name={hid ? 'EyeSlash' : 'GraduationCap'} size={20} /></div>
                  <div className="tt">
                    <div className="n">{c.subject} · {c.level}</div>
                    <div className="m">{c.desc} · {c.mins} min{inh && showOrg && overridden && <span className="vs-was" style={{ marginLeft: 6 }}>Organisation: {orgHidden.has(c.id) ? 'Hidden' : 'Visible'}</span>}</div>
                  </div>
                  <div className="right">
                    {forced
                      ? <span className="ia-state forced"><Ico name="Lock" size={13} />{showMode ? 'Always shown' : 'Forced'}</span>
                      : <span className={'ia-state ' + (hid ? 'hid' : 'vis')}><Ico name={hid ? 'EyeSlash' : 'Eye'} size={13} />{hid ? 'Hidden' : 'Shown'}</span>}
                    {inh && !forced && (overridden
                      ? <span className="vs-src student"><Ico name="User" size={13} />Student override</span>
                      : <span className="vs-src org"><Ico name="Building" size={13} />Org default</span>)}
                    {overridden && <button className="ia-resetbtn" title="Reset to organisation default" onClick={() => onReset(c.id)}><Ico name="ArrowPath" size={14} /></button>}
                    <button className="ia-sw" data-on={hid ? 0 : 1} data-dis={forced ? 1 : 0}
                      title={forced ? 'Forced assessments are always shown' : ''}
                      onClick={forced ? undefined : () => onToggle(c.id)}><i /></button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

/* C — coverage matrix. SHOW mode by default; `orgHidden` switches to legacy inheritance. */
function MatrixBody({ hidden, onToggle, forcedList, orgHidden, onReset }) {
  const inh = !!orgHidden;
  const showMode = !inh;
  const cols = '210px repeat(' + LEVELS.length + ', 1fr)';
  return (
    <div className="ia-matrix">
      <div className="ia-mgrid" style={{ gridTemplateColumns: cols }}>
        <div className="ia-mcell ia-mhead">Subject</div>
        {LEVELS.map(l => <div key={l} className="ia-mcell ia-mhead lvl">{l}</div>)}
        {SUBJECTS.map(s => (
          <React.Fragment key={s}>
            <div className="ia-mcell ia-mrowhead"><span className="s">{s}</span></div>
            {LEVELS.map(l => {
              const c = CATALOG.find(x => x.subject === s && x.level === l);
              if (!c) return <div key={l} className="ia-mcell ia-mcheck is-na"><div className="ia-box">–</div></div>;
              const forced = window.IA.isForcedBy(c, forcedList);
              if (forced) return (
                <div key={l} className="ia-mcell ia-mcheck is-forced" title={showMode ? 'Forced — always shown' : 'Forced — can’t be hidden'}>
                  <div className="ia-box"><Ico name="Lock" size={16} /></div><span className="cap" style={{ color: 'var(--blue)' }}>{showMode ? 'Always' : 'Forced'}</span>
                </div>
              );
              const inSet = hidden.has(c.id);
              const overridden = inh && (inSet !== orgHidden.has(c.id));
              const cap = inh ? (overridden ? 'Student' : 'Org default') : (showMode ? (inSet ? 'Shown' : 'Hidden') : (inSet ? 'Hidden' : 'Visible'));
              return (
                <div key={l} className={'ia-mcell ia-mcheck' + (inSet ? ' on' : '') + (overridden ? ' is-ovr' : '')} onClick={() => onToggle(c.id)}>
                  {overridden && <button className="ia-mreset" title="Reset to organisation default" onClick={(e) => { e.stopPropagation(); onReset(c.id); }}><Ico name="ArrowPath" size={12} /></button>}
                  <div className="ia-box">{inSet && <Ico name={showMode ? 'Check' : 'EyeSlash'} size={16} />}</div>
                  <span className="cap">{cap}</span>
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="ia-mfoot">
        {showMode ? (
          <>
            <span className="ia-leg"><span className="sq hid" />Shown to students</span>
            <span className="ia-leg"><span className="sq" />Hidden</span>
            <span className="ia-leg"><span className="sq forced" />Forced (always shown)</span>
            <span className="ia-leg" style={{ color: 'var(--mute)' }}>–&nbsp; Not offered</span>
          </>
        ) : (
          <>
            <span className="ia-leg"><span className="sq" />Visible to students</span>
            <span className="ia-leg"><span className="sq hid" />Hidden</span>
            <span className="ia-leg"><span className="sq forced" />Forced (locked)</span>
            <span className="ia-leg" style={{ color: 'var(--mute)' }}>–&nbsp; Not offered</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ===================================================================
   Stateful wrappers used by the standalone control canvas.
   =================================================================== */
function ShowRows({ seedRules, forcedOn, badge }) {
  const [rules, setRules] = useState(seedRules);
  const forcedList = forcedOn ? [{ subject: 'English', level: 'Functional Skills' }] : [];
  return (
    <SettingsCard badge={badge} title="Show Initial Assessments"
      subtitle="Choose which initial assessments students see on their learning portal. Leave this empty to show them all, or list specific ones to limit students to only those.">
      <ShowRowsBody rules={rules} forcedList={forcedList} mode="show"
        onAdd={() => setRules(r => [...r, { id: uid(), subject: undefined, level: undefined }])}
        onPatch={(id, p) => setRules(r => r.map(x => (x.id === id ? { ...x, ...p } : x)))}
        onRemove={(id) => setRules(r => r.filter(x => x.id !== id))} />
    </SettingsCard>
  );
}

function ToggleList({ seedShown, forcedOn }) {
  const [shown, setShown] = useState(() => new Set(seedShown));
  const forcedList = forcedOn ? [{ subject: 'English', level: 'Functional Skills' }] : [];
  const toggle = (id) => setShown(h => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const toggleMany = (ids, on) => setShown(h => { const n = new Set(h); ids.forEach(i => on ? n.add(i) : n.delete(i)); return n; });
  return (
    <SettingsCard title="Show Initial Assessments"
      subtitle="Turn assessments on to show them on students’ learning portal. Use the subject switch to show or hide every level at once."
      badge={<span className="ia-rec"><Ico name="Eye" size={13} />Visibility</span>}>
      <ToggleListBody hidden={shown} onToggle={toggle} onToggleMany={toggleMany} forcedList={forcedList} />
    </SettingsCard>
  );
}

function Matrix({ seedShown, forcedOn }) {
  const [shown, setShown] = useState(() => new Set(seedShown));
  const forcedList = forcedOn ? [{ subject: 'English', level: 'Functional Skills' }] : [];
  const toggle = (id) => setShown(h => { const n = new Set(h); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <SettingsCard title="Show Initial Assessments"
      subtitle="Tick a cell to show that subject and level group to students. Empty cells aren’t offered; forced assessments are locked and always shown."
      badge={<span className="ia-rec" style={{ background: 'var(--ink2)' }}><Ico name="Grid" size={13} />Coverage view</span>}>
      <MatrixBody hidden={shown} onToggle={toggle} forcedList={forcedList} />
    </SettingsCard>
  );
}

Object.assign(window, {
  IaSelect, SettingsCard,
  ShowRowsBody, ToggleListBody, MatrixBody,
  ShowRows, ToggleList, Matrix,
  // Back-compat aliases (older files may still reference the Hide* names):
  HideRowsBody: ShowRowsBody, HideRows: ShowRows,
});
