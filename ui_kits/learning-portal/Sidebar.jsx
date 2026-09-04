// Pass Learning Portal — Sidebar component
// Left nav with logo, primary sections, and user chip at bottom.
// Matches Flowbite sidebar proportions: 256px wide, 1px right border, white bg.

function PassSidebar({ active, onNav }) {
  const { useState } = React;
  const sections = [
    {
      label: 'Learn',
      items: [
        { id: 'dashboard',   icon: 'home',            label: 'Dashboard' },
        { id: 'courses',     icon: 'book-open',       label: 'My courses', badge: '4' },
        { id: 'diagnostics', icon: 'clipboard-list',  label: 'Diagnostics' },
        { id: 'mocks',       icon: 'file-text',       label: 'Mock exams', badge: 'NEW' },
      ]
    },
    {
      label: 'Teach',
      items: [
        { id: 'learners',    icon: 'users',           label: 'Learners' },
        { id: 'reporting',   icon: 'chart-bar',       label: 'Reporting' },
        { id: 'schemes',     icon: 'calculator',      label: 'Schemes of work' },
      ]
    },
    {
      label: 'Account',
      items: [
        { id: 'settings',    icon: 'settings',        label: 'Settings' },
      ]
    }
  ];

  return (
    <aside style={sb.root}>
      <div style={sb.head}>
        <img src="../../assets/logos/pass-wordmark.svg" style={{height: 28}} alt="Pass"/>
      </div>

      <nav style={sb.nav}>
        {sections.map(sec => (
          <div key={sec.label} style={{marginBottom: 20}}>
            <div style={sb.sectionLabel}>{sec.label}</div>
            {sec.items.map(it => {
              const isActive = it.id === active;
              return (
                <button
                  key={it.id}
                  onClick={() => onNav && onNav(it.id)}
                  style={{
                    ...sb.item,
                    ...(isActive ? sb.itemActive : {})
                  }}
                >
                  <PassIcon name={it.icon} size={18} color={isActive ? '#0FBC0F' : '#4A5565'} />
                  <span style={{flex: 1, textAlign: 'left'}}>{it.label}</span>
                  {it.badge && (
                    <span style={{
                      ...sb.badge,
                      background: it.badge === 'NEW' ? '#F0FEEF' : '#F3F4F6',
                      color:      it.badge === 'NEW' ? '#0FBC0F' : '#4A5565',
                    }}>{it.badge}</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div style={sb.footer}>
        <div style={sb.userChip}>
          <div style={sb.avatar}>SH</div>
          <div style={{flex: 1, minWidth: 0}}>
            <div style={{fontSize: 13, fontWeight: 600, color: '#101828', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>Sarah Hughes</div>
            <div style={{fontSize: 11, color: '#6A7282'}}>Tutor · Bradford FE</div>
          </div>
          <PassIcon name="chevron-right" size={16} color="#6A7282"/>
        </div>
      </div>
    </aside>
  );
}

const sb = {
  root: { width: 256, minHeight: '100%', background: '#fff', borderRight: '1px solid #E5E7EB', display: 'flex', flexDirection: 'column', flexShrink: 0 },
  head: { height: 64, display: 'flex', alignItems: 'center', padding: '0 20px', borderBottom: '1px solid #F3F4F6' },
  nav:  { flex: 1, padding: '20px 12px', overflowY: 'auto' },
  sectionLabel: { fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#98A2B3', padding: '0 12px 8px' },
  item: { display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '8px 12px', border: 0, background: 'transparent', borderRadius: 8, fontFamily: 'inherit', fontSize: 14, fontWeight: 500, color: '#344054', cursor: 'pointer', marginBottom: 2 },
  itemActive: { background: '#F0FEEF', color: '#0FBC0F' },
  badge: { fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 9999 },
  footer: { padding: 12, borderTop: '1px solid #F3F4F6' },
  userChip: { display: 'flex', alignItems: 'center', gap: 10, padding: 10, borderRadius: 10, cursor: 'pointer' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#0FBC0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600, flexShrink: 0 },
};

window.PassSidebar = PassSidebar;
