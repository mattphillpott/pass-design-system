/* Pass Learner Dashboard v2 — shared React components (window globals) */
const { useState, useMemo } = React;

function Ico({ name, size = 18, color, style, cls }) {
  const ic = (window.PASS_ICONS || {})[name];
  if (!ic) return null;
  return (
    <svg viewBox={ic.viewBox} width={size} height={size} fill="none"
      className={cls} aria-hidden="true"
      style={{ color, flex: '0 0 auto', display: 'block', ...style }}
      dangerouslySetInnerHTML={{ __html: ic.body }} />
  );
}

function Deco() {
  return <div className="deco" dangerouslySetInnerHTML={{ __html: window.PASS_DECO || '' }} />;
}

function Screen({ children, w, minH, style, flush }) {
  return (
    <div className="pass screen" style={{ width: w, minHeight: minH, ...style }}>
      <Deco />
      <div className="pad" style={flush ? { padding: 0 } : undefined}>{children}</div>
    </div>
  );
}

function Crumbs({ items }) {
  return (
    <div className="crumbs">
      {items.map((it, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="sep"><Ico name="AngleRight" size={14} /></span>}
          <span className={'c' + (it.active ? ' is-active' : '')}>
            {it.icon && <Ico name={it.icon} size={16} />}{it.label}
          </span>
        </React.Fragment>
      ))}
    </div>
  );
}

function PageTitle({ children }) {
  return <h1 className="page-h1"><span className="hl">{children}</span></h1>;
}

function BackLink({ children = 'Back to My Exams Dashboard', onClick }) {
  return <div className="backlink" onClick={onClick}><Ico name="ArrowLeft" size={16} />{children}</div>;
}

function Btn({ variant = 'primary', size, icon, iconRight, block, disabled, onClick, children }) {
  const cls = ['btn', 'btn--' + variant, size && 'btn--' + size, block && 'btn--block'].filter(Boolean).join(' ');
  return (
    <button className={cls} disabled={disabled} onClick={onClick}>
      {icon && <Ico name={icon} size={16} />}{children}{iconRight && <Ico name={iconRight} size={16} />}
    </button>
  );
}

function Badge({ variant = 'neutral', icon, children }) {
  return <span className={'badge badge--' + variant}>{icon && <Ico name={icon} size={13} />}{children}</span>;
}

function Meta({ icon, tone, children }) {
  return <span className={'meta' + (tone ? ' is-' + tone : '')}>{icon && <Ico name={icon} size={18} />}{children}</span>;
}

/* ---- account sidebar ---- */
const NAV = [
  { icon: 'GraduationCap', label: 'My Exams', active: true },
  { icon: 'Book', label: 'Courses', tag: 'New' },
  { icon: 'Clipboard', label: 'Orders' },
  { icon: 'CreditCard', label: 'Billing' },
  { icon: 'Home', label: 'Addresses' },
  { icon: 'Cog', label: 'Settings', sub: ['Profile', 'Booking preferences', 'Notifications'] },
];
function Sidebar({ activeSettingsSub, name = 'Jesse Leos', email = 'jesse@flowbite.com', initials = 'JL' }) {
  return (
    <div className="card sidebar">
      <div className="sb-profile">
        <div className="sb-avatar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green-dark)', fontWeight: 700 }}>{initials}</div>
        <div>
          <div className="sb-name">{name}</div>
          <div className="sb-mail">{email}</div>
        </div>
      </div>
      <div className="sb-div" />
      {NAV.map((n, i) => (
        <React.Fragment key={i}>
          <div className={'navitem' + (n.active ? ' is-active' : '')}>
            <Ico name={n.icon} size={18} />{n.label}
            {n.tag && <span className="tag">{n.tag}</span>}
            {n.sub && <Ico name="AngleDown" size={16} cls="chev" />}
          </div>
          {n.sub && n.sub.map((s, j) => (
            <div key={j} className={'navitem is-sub' + (s === activeSettingsSub ? ' is-active' : '')}>{s}</div>
          ))}
        </React.Fragment>
      ))}
      <div className="sb-div" />
      <div className="navitem is-danger"><Ico name="ArrowRightToBracket" size={18} />Log out</div>
    </div>
  );
}

/* ---- exam stepper card (left col of detail/step screens) ---- */
function Stepper({ title = 'Maths Level 1', board = 'TQUK | Automated Invigilation', nextLabel = 'Go to next step', steps }) {
  return (
    <div className="card stepper">
      <div className="st-title">{title}</div>
      <div className="st-sub">{board}</div>
      {nextLabel && <div className="st-next">{nextLabel}<Ico name="ArrowRight" size={16} /></div>}
      <div className="st-box">
        <div className="steps">
          {steps.map((s, i) => (
            <div key={i} className={'step ' + s.state}>
              {i < steps.length - 1 && <div className="line" />}
              <div className="dot">{s.state === 'done' ? <Ico name="Check" size={16} /> : s.num}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="logout">
        <div className="l"><Ico name="ArrowRightToBracket" size={18} />Log out</div>
        <Ico name="AngleDown" size={16} />
      </div>
    </div>
  );
}

/* ---- exam list card ---- */
function ExamCard({ title = 'Maths Level 1', board = 'TQUK | Automated Invigilation', next, initials = 'PH',
  studentName, setup, statusBadge, cta, meta, foot, why }) {
  const ava = studentName ? studentName.trim().split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase() : initials;
  return (
    <div className={'card exam' + (setup ? ' is-setup' : '')} data-why={why}>
      <div className="exam-top">
        <div className="exam-ava">{ava}</div>
        <div className="exam-id">
          <div className="exam-title">{title}
            {setup && <Badge variant="setup" icon="ExclamationCircle">Action needed — set up before booking</Badge>}
          </div>
          <div className="exam-board">{board}</div>
          {studentName && <div className="exam-for"><Ico name="GraduationCap" size={15} />For student: <b>{studentName}</b></div>}
          {next && <div className="exam-next">Next Step: {next}</div>}
        </div>
        <div className="exam-cta">{cta}</div>
      </div>
      {(meta || foot || statusBadge) && (
        <div className="exam-foot">
          <div className="left">
            {statusBadge}
            {meta}
          </div>
          {foot}
        </div>
      )}
    </div>
  );
}

/* ---- detail card stack ---- */
function DetailCard({ head, children, why }) {
  return <div className="card dcard" data-why={why}>{head}{children}</div>;
}
function DRow({ icon, label, value, action, valueStrong = true }) {
  return (
    <div className="drow">
      <div className="k">{icon && <Ico name={icon} size={18} />}<span className="lab">{label}</span>{value && <b style={valueStrong ? undefined : { fontWeight: 500, color: 'var(--gray)' }}>{value}</b>}</div>
      <div className="v">{action}</div>
    </div>
  );
}

function Banner({ variant = 'info', icon = 'InfoCircle', title, children, action, why }) {
  return (
    <div className={'banner banner--' + variant} data-why={why}>
      <Ico name={icon} size={22} cls="bi" />
      <div>
        {title && <h4>{title}</h4>}
        {children && <p>{children}</p>}
      </div>
      {action && <div className="ba">{action}</div>}
    </div>
  );
}

function Frame({ x, y, w = 1200, label, children }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w }}>
      <div data-drags-parent="1" style={{ font: '600 13px var(--font)', color: '#5b6472', marginBottom: 10, letterSpacing: '.01em' }}>{label}</div>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 1px 0 rgba(16,24,40,.04), 0 10px 30px -12px rgba(16,24,40,.12)', overflow: 'hidden', border: '1px solid #eef0f3' }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Ico, Deco, Screen, Crumbs, PageTitle, BackLink, Btn, Badge, Meta, Sidebar, Stepper, ExamCard, DetailCard, DRow, Banner, Frame });
