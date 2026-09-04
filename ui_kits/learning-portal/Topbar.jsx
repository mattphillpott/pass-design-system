// Topbar — search + notifications + help

function PassTopbar({ title, breadcrumbs }) {
  return (
    <header style={tb.root}>
      <div>
        {breadcrumbs && (
          <div style={tb.crumbs}>
            {breadcrumbs.map((c, i) => (
              <React.Fragment key={i}>
                {i > 0 && <PassIcon name="chevron-right" size={12} color="#98A2B3"/>}
                <span style={{color: i === breadcrumbs.length-1 ? '#344054' : '#6A7282', fontWeight: i === breadcrumbs.length-1 ? 500 : 400}}>{c}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 style={tb.title}>{title}</h1>
      </div>
      <div style={tb.right}>
        <div style={tb.search}>
          <PassIcon name="search" size={16} color="#6A7282"/>
          <input placeholder="Search learners, courses, topics…" style={tb.searchInput}/>
          <span style={tb.kbd}>⌘K</span>
        </div>
        <button style={tb.iconBtn}><PassIcon name="bell" size={18} color="#4A5565"/><span style={tb.dot}/></button>
        <button style={tb.iconBtn}><PassIcon name="lightbulb" size={18} color="#4A5565"/></button>
      </div>
    </header>
  );
}

const tb = {
  root: { height: 80, padding: '14px 32px', background: '#fff', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexShrink: 0 },
  crumbs: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, marginBottom: 4 },
  title: { margin: 0, fontSize: 22, fontWeight: 700, color: '#101828', letterSpacing: '-0.015em' },
  right: { display: 'flex', alignItems: 'center', gap: 8 },
  search: { display: 'flex', alignItems: 'center', gap: 8, background: '#F9FAFB', border: '1px solid #E5E7EB', borderRadius: 10, padding: '0 12px', width: 340, height: 40 },
  searchInput: { flex: 1, border: 0, background: 'transparent', outline: 'none', fontSize: 13, fontFamily: 'inherit', color: '#101828' },
  kbd: { fontSize: 11, fontFamily: 'ui-monospace, monospace', color: '#6A7282', border: '1px solid #E5E7EB', borderRadius: 4, padding: '2px 6px', background: '#fff' },
  iconBtn: { position: 'relative', width: 40, height: 40, borderRadius: 10, background: '#F9FAFB', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  dot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: '50%', background: '#C70036', border: '2px solid #F9FAFB' },
};

window.PassTopbar = PassTopbar;
