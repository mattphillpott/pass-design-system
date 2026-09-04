// Hero, logos, features, stats, testimonial, CTA sections for pass.tech

function MktHero() {
  return (
    <section style={ms.heroWrap}>
      <div style={ms.heroInner}>
        <div style={{maxWidth: 620}}>
          <span className="pass-badge pass-badge--brand" style={{marginBottom: 18}}>
            <span style={{width: 6, height: 6, borderRadius: '50%', background: '#0E9F6E'}}/>
            New · AI marking now live for English L2
          </span>
          <h1 className="pass-h1" style={{fontSize: 60, lineHeight: 1.08, letterSpacing: '-0.03em', margin: 0}}>
            Improving maths & English <span style={{color: '#0FBC0F'}}>pass rates.</span>
          </h1>
          <p style={{margin: '22px 0 0', color: '#344054', fontSize: 18, lineHeight: 1.6, maxWidth: 560}}>
            AI-powered learning & teaching platform for educators looking to improve outcomes — from Functional Skills to GCSE resits. Save time, personalise learning, and prove progress.
          </p>
          <div style={{display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap'}}>
            <button className="pass-btn pass-btn--primary pass-btn--lg">Book a demo</button>
            <button className="pass-btn pass-btn--secondary pass-btn--lg">Access free diagnostics →</button>
          </div>
          <div style={{marginTop: 22, fontSize: 13, color: '#6A7282'}}>Trusted by 140+ FE colleges & apprenticeship providers across the UK.</div>
        </div>
        <div style={ms.heroCard}>
          {/* fake portal preview */}
          <div style={ms.browserChrome}>
            <div style={{display: 'flex', gap: 6}}>
              <span style={{width: 10, height: 10, borderRadius: '50%', background: '#FBD5D5'}}/>
              <span style={{width: 10, height: 10, borderRadius: '50%', background: '#FED7AA'}}/>
              <span style={{width: 10, height: 10, borderRadius: '50%', background: '#A7F3D0'}}/>
            </div>
            <div style={ms.urlBar}>pass.tech/portal</div>
          </div>
          <div style={{padding: 24}}>
            <div style={{fontSize: 11, color: '#0FBC0F', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase'}}>Cohort JAN-26</div>
            <div style={{fontSize: 18, fontWeight: 700, color: '#101828', marginTop: 4}}>Functional Skills Maths L2</div>
            <div style={{fontSize: 12, color: '#6A7282', marginTop: 2}}>28 learners · AI-marked</div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginTop: 18}}>
              {[['87%','Pass rate'],['+4pt','vs last'],['312','Mocks']].map(([v,l])=>(
                <div key={l} style={{background: '#F9FAFB', borderRadius: 10, padding: '12px 14px'}}>
                  <div style={{fontSize: 20, fontWeight: 700, color: '#101828'}}>{v}</div>
                  <div style={{fontSize: 11, color: '#6A7282'}}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{marginTop: 18}}>
              {['Using number operations','Fractions & decimals','Percentages & ratio'].map((t,i)=>(
                <div key={t} style={{display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i===0?0:'1px solid #F3F4F6'}}>
                  <div style={{width: 24, height: 24, borderRadius: 8, background: i<2?'#ECFDF5':'#F0FEEF', color: i<2?'#047857':'#0FBC0F', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700}}>{i<2?'✓':i+1}</div>
                  <div style={{flex: 1, fontSize: 13, color: '#101828', fontWeight: 500}}>{t}</div>
                  <div style={{fontSize: 11, color: '#6A7282'}}>{i<2?'Complete':'In progress'}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MktLogos() {
  return (
    <section style={ms.logos}>
      <div style={ms.heroInner}>
        <div style={{fontSize: 13, color: '#6A7282', letterSpacing: '0.04em', textTransform: 'uppercase', fontWeight: 600, textAlign: 'center', marginBottom: 24}}>Powered by Pass · 140+ providers</div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, flexWrap: 'wrap', opacity: 0.7}}>
          {['BRADFORD FE','LEEDS CITY','MANCHESTER ADULT','SOUTH YORKS','NORTH CUMBRIA','APPRENTICE+','EDUCATIONWISE'].map(n=>(
            <div key={n} style={{fontFamily: 'Inter', fontWeight: 800, letterSpacing: '0.08em', color: '#4A5565', fontSize: 13}}>{n}</div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MktFeatures() {
  const feats = [
    { icon: 'clipboard-list', title: 'Free diagnostics',   body: 'Initial Assessment and Subject Knowledge Assessment with AI marking. Identify gaps in minutes.' },
    { icon: 'sparkles',       title: 'AI-marked mocks',    body: 'Automatically marked mock exams to examiner standard. Feedback in under a minute.' },
    { icon: 'book-open',      title: 'Self-paced courses', body: 'Topic tests, video tutorials and adaptive practice — mapped to Pearson and City & Guilds specs.' },
    { icon: 'chart-bar',      title: 'Ofsted-ready reports', body: 'Full reporting suite with LMS & e-portfolio integration. Export in one click.' },
    { icon: 'graduation-cap', title: 'Awarding centre',    body: 'Pass is a registered Ofqual exam centre across four awarding organisations.' },
    { icon: 'users',          title: 'Personalised plans', body: 'Every learner gets a plan tailored to their diagnostic — not a one-size-fits-all curriculum.' },
  ];
  return (
    <section id="product" style={ms.section}>
      <div style={ms.heroInner}>
        <div style={{textAlign: 'center', maxWidth: 680, margin: '0 auto 56px'}}>
          <div className="pass-eyebrow">The platform</div>
          <h2 className="pass-h2" style={{margin: '10px 0 16px', fontSize: 40, letterSpacing: '-0.02em'}}>Everything your maths & English provision needs.</h2>
          <p style={{margin: 0, fontSize: 17, color: '#4A5565', lineHeight: 1.6}}>From diagnostic to pass mark — one platform, one data layer, no spreadsheets.</p>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20}}>
          {feats.map(f => (
            <div key={f.title} className="pass-card pass-card--hover" style={{padding: 28}}>
              <div style={{width: 44, height: 44, borderRadius: 12, background: '#F0FEEF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18}}>
                <PassIcon name={f.icon} size={22} color="#0FBC0F"/>
              </div>
              <div style={{fontSize: 17, fontWeight: 600, color: '#101828', marginBottom: 6}}>{f.title}</div>
              <div style={{fontSize: 14, color: '#4A5565', lineHeight: 1.6}}>{f.body}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MktStats() {
  return (
    <section style={{...ms.section, background: '#0FBC0F', color: '#fff', padding: '80px 0'}}>
      <div style={ms.heroInner}>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, textAlign: 'center'}}>
          {[
            ['87%',  'Average L2 pass rate on Pass'],
            ['90%',  'Of Educationwise learners now ahead of target'],
            ['42h',  'Saved per tutor · monthly'],
            ['140+', 'Providers "Powered by Pass"'],
          ].map(([v,l])=>(
            <div key={l}>
              <div style={{fontSize: 56, fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1}}>{v}</div>
              <div style={{fontSize: 14, color: '#B8FBB7', marginTop: 10, maxWidth: 180, margin: '10px auto 0', lineHeight: 1.4}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MktTestimonial() {
  return (
    <section style={ms.section}>
      <div style={{...ms.heroInner, display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 60, alignItems: 'center'}}>
        <div>
          <div className="pass-eyebrow">Case study</div>
          <h3 style={{margin: '10px 0 0', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', color: '#101828', lineHeight: 1.2}}>"Pass is the first platform that gave our tutors back their evenings."</h3>
          <div style={{marginTop: 28, display: 'flex', alignItems: 'center', gap: 14}}>
            <div style={{width: 48, height: 48, borderRadius: '50%', background: '#0FBC0F', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600}}>JR</div>
            <div>
              <div style={{fontSize: 15, fontWeight: 600, color: '#101828'}}>Jenny Robbins</div>
              <div style={{fontSize: 13, color: '#6A7282'}}>Head of Maths, Bradford FE</div>
            </div>
          </div>
          <button className="pass-btn pass-btn--secondary" style={{marginTop: 28}}>View case study →</button>
        </div>
        <div style={{background: 'linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 100%)', borderRadius: 20, padding: 32, border: '1px solid #E5E7EB'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20}}>
            {[['↑ 23%','Pass rate'],['42 hrs','Tutor time saved'],['98%','Tutor approval']].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize: 28, fontWeight: 700, color: '#0FBC0F', letterSpacing: '-0.02em'}}>{v}</div>
                <div style={{fontSize: 13, color: '#344054', marginTop: 4}}>{l}</div>
              </div>
            ))}
          </div>
          <hr style={{border: 0, borderTop: '1px solid #E5E7EB', margin: '24px 0'}}/>
          <div style={{fontSize: 14, color: '#344054', lineHeight: 1.65}}>"The AI marker handles the first pass so our tutors can focus on the learners who need the most help. Ofsted called our reporting 'exemplary' — that's Pass's reporting suite."</div>
        </div>
      </div>
    </section>
  );
}

function MktCTA() {
  return (
    <section style={{padding: '48px 0 80px'}}>
      <div style={{...ms.heroInner, background: '#101828', borderRadius: 20, padding: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap', color: '#fff'}}>
        <div>
          <h3 style={{margin: 0, fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2}}>See Pass in action.</h3>
          <p style={{margin: '10px 0 0', color: '#D1D5DB', fontSize: 16, maxWidth: 520}}>30-minute walkthrough with our education team — tailored to your cohort, your awarding body, your reporting needs.</p>
        </div>
        <div style={{display: 'flex', gap: 12}}>
          <button className="pass-btn pass-btn--primary pass-btn--lg">Book a demo</button>
          <button className="pass-btn pass-btn--lg" style={{background: 'transparent', color: '#fff', border: '1px solid #344054'}}>Contact us</button>
        </div>
      </div>
    </section>
  );
}

const ms = {
  heroWrap: { position: 'relative', background: 'linear-gradient(180deg, #F0FEEF 0%, #FFFFFF 100%)', paddingTop: 72, paddingBottom: 72 },
  heroInner: { maxWidth: 1200, margin: '0 auto', padding: '0 40px', display: 'flex', gap: 48, alignItems: 'center' },
  heroCard: { flex: 1, minWidth: 360, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)', overflow: 'hidden' },
  browserChrome: { height: 40, background: '#F9FAFB', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px' },
  urlBar: { flex: 1, height: 24, background: '#fff', border: '1px solid #E5E7EB', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#6A7282', fontFamily: 'ui-monospace, monospace' },
  logos: { padding: '56px 0', borderBottom: '1px solid #F3F4F6' },
  section: { padding: '96px 0' },
};

window.MktHero = MktHero;
window.MktLogos = MktLogos;
window.MktFeatures = MktFeatures;
window.MktStats = MktStats;
window.MktTestimonial = MktTestimonial;
window.MktCTA = MktCTA;
