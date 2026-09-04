// Pass.tech marketing — shared nav + footer

function MktNav() {
  return (
    <header style={mn.nav}>
      <div style={mn.inner}>
        <a href="#" style={{display: 'flex', alignItems: 'center'}}><img src="../../assets/logos/pass-wordmark.svg" style={{height: 26}} alt="Pass"/></a>
        <nav style={mn.links}>
          <a href="#product" style={mn.link}>Platform</a>
          <a href="#solutions" style={mn.link}>For colleges</a>
          <a href="#pricing" style={mn.link}>Pricing</a>
          <a href="#resources" style={mn.link}>Resources</a>
          <a href="#company" style={mn.link}>Company</a>
        </nav>
        <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
          <a href="#signin" style={{...mn.link, color: '#4A5565'}}>Sign in</a>
          <button className="pass-btn pass-btn--primary">Book a demo</button>
        </div>
      </div>
    </header>
  );
}

function MktFooter() {
  const cols = [
    { head: 'Platform', items: ['Diagnostics', 'Courses', 'Mock exams', 'Reporting', 'Integrations'] },
    { head: 'Solutions', items: ['FE colleges', 'Apprenticeships', 'Universities', 'Schools', 'Public sector'] },
    { head: 'Resources', items: ['Case studies', 'Blog', 'Help centre', 'Webinars', 'Ofsted toolkit'] },
    { head: 'Company',   items: ['About', 'Careers', 'Contact', 'Terms', 'Privacy'] },
  ];
  return (
    <footer style={mn.footer}>
      <div style={{...mn.inner, alignItems: 'flex-start', paddingTop: 72, paddingBottom: 48, display: 'grid', gridTemplateColumns: '1.4fr repeat(4, 1fr)', gap: 40}}>
        <div>
          <img src="../../assets/logos/pass-wordmark.svg" style={{height: 26, marginBottom: 16}}/>
          <p style={{margin: 0, color: '#4A5565', fontSize: 14, lineHeight: 1.6, maxWidth: 280}}>AI-powered learning & teaching platform for educators looking to improve maths and English outcomes.</p>
          <div style={{fontSize: 12, color: '#98A2B3', marginTop: 18}}>Registered Ofqual exam centre.</div>
        </div>
        {cols.map(c => (
          <div key={c.head}>
            <div style={mn.footHead}>{c.head}</div>
            {c.items.map(i => <a key={i} href="#" style={mn.footLink}>{i}</a>)}
          </div>
        ))}
      </div>
      <div style={{borderTop: '1px solid #E5E7EB'}}>
        <div style={{...mn.inner, padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 12, color: '#6A7282'}}>© 2026 Pass Learning Ltd. All rights reserved.</div>
          <div style={{fontSize: 12, color: '#6A7282'}}>Made in the UK · Functional Skills · GCSE · Apprenticeships</div>
        </div>
      </div>
    </footer>
  );
}

const mn = {
  nav: { position: 'sticky', top: 0, zIndex: 30, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(8px)', borderBottom: '1px solid #E5E7EB' },
  inner: { maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, height: 72 },
  links: { display: 'flex', alignItems: 'center', gap: 28 },
  link: { fontSize: 14, fontWeight: 500, color: '#101828', textDecoration: 'none' },
  footer: { background: '#F9FAFB', borderTop: '1px solid #E5E7EB' },
  footHead: { fontSize: 13, fontWeight: 600, color: '#101828', marginBottom: 14 },
  footLink: { display: 'block', fontSize: 14, color: '#4A5565', textDecoration: 'none', padding: '6px 0' },
};

window.MktNav = MktNav;
window.MktFooter = MktFooter;
