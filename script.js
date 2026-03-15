/* =============================================
   InternBridge — Full App Script
   ============================================= */

// ── Mock Data ────────────────────────────────
const mockInternships = [
  { id:1, title:"Frontend Developer Intern", company:"TechFlow", logo:"TF", transparency:"green", matchScore:92, urgencyDays:2, tags:["React","JavaScript","Remote"], reqSkills:["React","CSS","TypeScript","Figma"], stipend:"₹25,000/mo", location:"Remote", probability:89, scamReports:0, responseRate:94, jd:"Build modern web interfaces using React. Collaborate with design and backend teams to create seamless user experiences. Work on real production features shipped to thousands of users.", graduates:120, openings:3 },
  { id:2, title:"Data Science Intern", company:"Analytica", logo:"AN", transparency:"yellow", matchScore:78, urgencyDays:5, tags:["Python","SQL","Hybrid"], reqSkills:["Python","Machine Learning","SQL","Tableau"], stipend:"₹18,000/mo", location:"Hybrid – Bangalore", probability:65, scamReports:2, responseRate:58, jd:"Analyze large datasets to extract business insights. Build predictive models using scikit-learn and TensorFlow. Present findings to stakeholders.", graduates:80, openings:5 },
  { id:3, title:"UX Design Intern", company:"Creativ", logo:"CR", transparency:"red", matchScore:45, urgencyDays:14, tags:["Figma","UI/UX","On-site"], reqSkills:["Figma","User Research","Prototyping","Sketch"], stipend:"Unpaid", location:"On-site – Mumbai", probability:30, scamReports:15, responseRate:22, jd:"Design user interfaces and conduct usability testing. Create wireframes, prototypes, and design specs for mobile and web applications.", graduates:40, openings:2 },
  { id:4, title:"Backend Engineer Intern", company:"CloudBase", logo:"CB", transparency:"green", matchScore:85, urgencyDays:7, tags:["Node.js","MongoDB","Remote"], reqSkills:["Node.js","REST APIs","MongoDB","Docker"], stipend:"₹22,000/mo", location:"Remote", probability:81, scamReports:0, responseRate:88, jd:"Design and build scalable REST APIs. Work on microservices architecture and cloud deployments using AWS and Docker. Code review participation.", graduates:95, openings:4 },
  { id:5, title:"AI/ML Research Intern", company:"NeuraLabs", logo:"NL", transparency:"green", matchScore:70, urgencyDays:10, tags:["Python","Deep Learning","Remote"], reqSkills:["Python","TensorFlow","Research Writing","Linear Algebra"], stipend:"₹30,000/mo", location:"Remote", probability:72, scamReports:0, responseRate:91, jd:"Assist senior researchers in building and evaluating deep learning models. Contribute to published research papers and open-source ML projects.", graduates:55, openings:2 },
  { id:6, title:"Product Management Intern", company:"Startify", logo:"ST", transparency:"yellow", matchScore:60, urgencyDays:3, tags:["Strategy","Agile","Hybrid"], reqSkills:["Product Roadmap","Agile","Data Analysis","Communication"], stipend:"₹15,000/mo", location:"Hybrid – Pune", probability:55, scamReports:4, responseRate:47, jd:"Own the product roadmap for a key feature area. Work closely with engineering, design, and marketing. Conduct user interviews and analyse product metrics.", graduates:30, openings:1 }
];

const userSkills = ["React","JavaScript","CSS","Python","SQL","Git"];
const userSkillLevels = { React:80, JavaScript:90, CSS:75, Python:60, SQL:55, Git:85 };

const mockKanban = {
  applied: [
    { id:2, title:"Data Science Intern", company:"Analytica", daysAgo:16, logo:"AN" },
    { id:6, title:"Product Management Intern", company:"Startify", daysAgo:8, logo:"ST" }
  ],
  interview: [
    { id:1, title:"Frontend Developer Intern", company:"TechFlow", daysAgo:12, logo:"TF" }
  ],
  offer: [
    { id:4, title:"Backend Engineer Intern", company:"CloudBase", daysAgo:20, logo:"CB" }
  ],
  rejected: []
};

const mockAlumni = [
  { name:"Priya Sharma", batch:"Batch 2023", company:"Google", role:"SWE Intern", avatarColor:"#6366f1", initials:"PS", tip:"\"Start with DSA in July. Apply early — Google closes in September. Cold email the recruiter on LinkedIn.\"" },
  { name:"Rahul Mehta", batch:"Batch 2022", company:"Microsoft", role:"PM Intern", avatarColor:"#059669", initials:"RM", tip:"\"Build a side project before applying. They love initiative. Practice PM case studies on prepfully.com.\"" },
  { name:"Sneha Gupta", batch:"Batch 2023", company:"Flipkart", role:"Data Science Intern", avatarColor:"#dc2626", initials:"SG", tip:"\"Kaggle competitions helped me a lot. Make sure your resume shows impact numbers, not just tasks.\"" },
  { name:"Arjun Kapoor", batch:"Batch 2022", company:"Zomato", role:"Frontend Intern", avatarColor:"#ea580c", initials:"AK", tip:"\"Build a portfolio site. They Googled me before the interview! React + TypeScript is their stack.\"" },
  { name:"Meera Patel", batch:"Batch 2023", company:"Accenture", role:"UX Design Intern", avatarColor:"#7c3aed", initials:"MP", tip:"\"Case study presentation skills are key. Practice presenting your Figma work to non-designers.\"" },
  { name:"Dev Nair", batch:"Batch 2022", company:"Razorpay", role:"Backend Intern", avatarColor:"#0891b2", initials:"DN", tip:"\"Know system design basics. The interview had a distributed systems question. LLD was also asked.\"" }
];

const mockCourses = [
  { icon:"⚛️", title:"React – The Complete Guide", provider:"Udemy • Maximilian", tag:"Skill Gap: TypeScript", color:"blue" },
  { icon:"🐍", title:"Python for Data Science Bootcamp", provider:"Coursera • IBM", tag:"Skill Gap: ML", color:"green" },
  { icon:"🎨", title:"UI/UX Design Foundations", provider:"Google UX Certificate", tag:"Boosts Profile", color:"purple" },
  { icon:"☁️", title:"AWS Solutions Architect", provider:"A Cloud Guru", tag:"High Demand", color:"yellow" }
];

let currentInternshipId = null;
let currentCompanyId = null;
let ghostStep = 1;
let activePrepTab = "questions";

// ── Router ────────────────────────────────────
function initApp() {
  document.querySelectorAll('[data-route]').forEach(el => {
    el.addEventListener('click', e => {
      const route = e.currentTarget.getAttribute('data-route');
      navigate(route);
    });
  });

  document.getElementById('modal-close-btn').addEventListener('click', closeModal);
  document.getElementById('apply-modal').addEventListener('click', e => {
    if (e.target === document.getElementById('apply-modal')) closeModal();
  });

  navigate('home');
}

function navigate(route, extra = null) {
  document.querySelectorAll('[data-route]').forEach(el => el.classList.remove('active'));
  document.querySelectorAll(`[data-route="${route}"]`).forEach(el => el.classList.add('active'));

  const main = document.getElementById('main-content');
  main.innerHTML = '';

  if (route === 'detail') currentInternshipId = extra;
  if (route === 'company') currentCompanyId = extra;

  const views = { home: renderHome, tracker: renderTracker, profile: renderProfile, detail: renderDetail, company: renderCompany, senior: renderSenior, ghost: renderGhost, prep: renderPrep };
  (views[route] || renderHome)(main);

  main.scrollTo(0, 0);
}

// ── Helpers ───────────────────────────────────
function tbadge(transparency) {
  const map = {
    green: ['green', 'ph-check-circle', '🟢 Verified Responsive'],
    yellow: ['yellow', 'ph-warning-circle', '🟡 Low Response'],
    red: ['red', 'ph-warning-octagon', '🔴 Community Flagged']
  };
  const [cls, icon, label] = map[transparency];
  return `<span class="badge ${cls}"><i class="ph ${icon}"></i>${label}</span>`;
}

function openModal(title) {
  document.getElementById('modal-title').textContent = `Applied to ${title}`;
  document.getElementById('apply-modal').style.display = 'flex';
  document.getElementById('go-tracker-btn').onclick = () => { closeModal(); navigate('tracker'); };
}

function closeModal() {
  document.getElementById('apply-modal').style.display = 'none';
}

// ── 1. HOME FEED ───────────────────────────────
function renderHome(container) {
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Discovery Feed 🔍</h1>
          <p>AI-matched internships based on your skills and profile.</p>
        </div>
        <button class="btn-primary" onclick="navigate('profile')"><i class="ph ph-sparkle"></i>Update Profile</button>
      </div>

      <div class="stats-row">
        <div class="stat-card"><div class="stat-icon blue"><i class="ph-fill ph-briefcase"></i></div><div class="stat-value">247</div><div class="stat-label">Live Openings</div><div class="stat-change">↑ 18 today</div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="ph-fill ph-check-circle"></i></div><div class="stat-value">92%</div><div class="stat-label">Top Match</div></div>
        <div class="stat-card"><div class="stat-icon yellow"><i class="ph-fill ph-clock"></i></div><div class="stat-value">3</div><div class="stat-label">Applied</div></div>
        <div class="stat-card"><div class="stat-icon red"><i class="ph-fill ph-ghost"></i></div><div class="stat-value">1</div><div class="stat-label">Ghost Alert</div></div>
      </div>

      <div class="filters-row">
        <div class="search-bar-wrapper" style="flex:1;min-width:200px;">
          <i class="ph ph-magnifying-glass"></i>
          <input class="search-input" id="search-input" type="text" placeholder="Search roles, companies, skills…" oninput="filterFeed()">
        </div>
        <button class="filter-chip active" data-filter="all" onclick="setFilter(this,'all')"><i class="ph ph-squares-four"></i>All</button>
        <button class="filter-chip" data-filter="remote" onclick="setFilter(this,'remote')"><i class="ph ph-globe"></i>Remote</button>
        <button class="filter-chip" data-filter="green" onclick="setFilter(this,'green')"><i class="ph ph-check-circle"></i>Verified</button>
        <button class="filter-chip" data-filter="high" onclick="setFilter(this,'high')"><i class="ph ph-trend-up"></i>High Match</button>
      </div>

      <div class="feed-grid" id="feed-grid">${mockInternships.map(j => jobCardHtml(j)).join('')}</div>
    </div>`;
}

function jobCardHtml(job) {
  const urgency = job.urgencyDays <= 3 ? `<span class="badge red"><i class="ph ph-clock"></i>${job.urgencyDays}d left</span>` : `<span class="badge gray"><i class="ph ph-calendar"></i>${job.urgencyDays}d left</span>`;
  const scam = job.scamReports > 5 ? `<div class="scam-warning"><i class="ph ph-warning"></i>${job.scamReports} ghost/scam reports from students</div>` : '';
  return `
    <div class="card job-card" onclick="navigate('detail',${job.id})">
      <div class="job-card-header">
        <div>
          <div class="company-logo">${job.logo}</div>
          <div class="job-title">${job.title}</div>
          <div class="job-company">${job.company} · ${job.location}</div>
        </div>
        <div class="match-score-badge">${job.matchScore}%<small>Match</small></div>
      </div>
      <div style="display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem;">
        ${tbadge(job.transparency)}
        ${urgency}
      </div>
      <div class="probability-bar-wrap">
        <div class="probability-bar-label"><span>Selection Probability</span><span>${job.probability}%</span></div>
        <div class="probability-bar-bg"><div class="probability-bar-fill" style="width:${job.probability}%"></div></div>
      </div>
      ${scam}
      <div class="job-meta">${job.tags.map(t => `<span class="badge blue">${t}</span>`).join('')}<span class="badge gray">${job.stipend}</span></div>
    </div>`;
}

function setFilter(el, filter) {
  document.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  const grid = document.getElementById('feed-grid');
  if (!grid) return;
  let filtered = mockInternships;
  if (filter === 'remote') filtered = filtered.filter(j => j.tags.includes('Remote'));
  if (filter === 'green') filtered = filtered.filter(j => j.transparency === 'green');
  if (filter === 'high') filtered = filtered.filter(j => j.matchScore >= 75);
  grid.innerHTML = filtered.map(j => jobCardHtml(j)).join('');
}

function filterFeed() {
  const q = document.getElementById('search-input').value.toLowerCase();
  const grid = document.getElementById('feed-grid');
  if (!grid) return;
  const filtered = mockInternships.filter(j =>
    j.title.toLowerCase().includes(q) || j.company.toLowerCase().includes(q) || j.tags.some(t => t.toLowerCase().includes(q))
  );
  grid.innerHTML = filtered.map(j => jobCardHtml(j)).join('');
}

// ── 2. INTERNSHIP DETAIL ───────────────────────
function renderDetail(container) {
  const job = mockInternships.find(j => j.id === currentInternshipId) || mockInternships[0];
  const userHas = skill => userSkills.includes(skill);
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <button class="btn-ghost" onclick="navigate('home')" style="margin-bottom:1rem;"><i class="ph ph-arrow-left"></i>Back to Feed</button>
      <div class="detail-header">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;">
          <div>
            <div class="company-logo-lg" style="width:52px;height:52px;font-size:1.1rem;">${job.logo}</div>
            <h1 style="font-size:1.5rem;margin-bottom:0.2rem;">${job.title}</h1>
            <p style="opacity:0.85;">${job.company} · ${job.location} · ${job.stipend}</p>
            <div style="margin-top:0.75rem;display:flex;gap:0.5rem;flex-wrap:wrap;">
              ${tbadge(job.transparency)}
              <span class="badge" style="background:rgba(255,255,255,0.2);color:white;"><i class="ph ph-users"></i>${job.graduates} hired total</span>
              <span class="badge" style="background:rgba(255,255,255,0.2);color:white;"><i class="ph ph-briefcase"></i>${job.openings} openings</span>
            </div>
          </div>
          <div style="text-align:center;">
            <div class="match-score-badge" style="font-size:1.5rem;padding:0.75rem 1.25rem;">${job.matchScore}%<small>AI Match</small></div>
            <div style="margin-top:0.5rem;color:rgba(255,255,255,0.8);font-size:0.8rem;">Selection Prob: <strong>${job.probability}%</strong></div>
          </div>
        </div>
      </div>

      <div class="detail-grid">
        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          <div class="card">
            <div class="section-title"><i class="ph ph-article"></i>Job Description</div>
            <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.7;">${job.jd}</p>
          </div>
          <div class="card">
            <div class="section-title"><i class="ph ph-code"></i>Required Skills</div>
            <div class="skill-gap-list">
              ${job.reqSkills.map(s => `
                <div class="skill-gap-item ${userHas(s) ? 'has' : 'missing'}">
                  <span>${s}</span>
                  ${userHas(s)
                    ? '<span class="badge green"><i class="ph ph-check"></i>You have this</span>'
                    : '<span class="badge red"><i class="ph ph-x"></i>Skill Gap</span>'}
                </div>`).join('')}
            </div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:1.25rem;">
          <div class="card">
            <div class="section-title"><i class="ph ph-chart-bar"></i>Company Transparency</div>
            <div style="text-align:center;margin-bottom:1rem;">
              <div style="font-size:2.5rem;font-weight:800;color:var(--primary);">${job.responseRate}%</div>
              <div style="font-size:0.8rem;color:var(--text-muted);">Response Rate</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:0.5rem;">
              ${['Jan','Feb','Mar','Apr','May','Jun'].map((m,i) => `
                <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;">
                  <span style="width:28px;color:var(--text-muted);">${m}</span>
                  <div style="flex:1;background:var(--border-light);border-radius:999px;height:6px;">
                    <div style="width:${[70,65,80,job.responseRate,job.responseRate-5,job.responseRate+3][i]}%;height:100%;border-radius:999px;background:var(--primary);"></div>
                  </div>
                </div>`).join('')}
            </div>
            <div style="margin-top:1rem;">${tbadge(job.transparency)}</div>
          </div>

          <div class="card">
            <div class="section-title"><i class="ph ph-target"></i>Probability Score</div>
            <div style="text-align:center;">
              <div style="font-size:2.5rem;font-weight:800;background:linear-gradient(135deg,var(--primary),#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">${job.probability}%</div>
              <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:1rem;">Chance of Selection</div>
              <p style="font-size:0.78rem;color:var(--text-muted);">Based on your skills, resume score, and competition level.</p>
            </div>
          </div>

          <button class="btn-primary" style="width:100%;padding:1rem;" onclick="openModal('${job.title}')"><i class="ph ph-paper-plane-tilt"></i>Apply Now</button>
          <button class="btn-ghost" style="width:100%;" onclick="navigate('company',${job.id})"><i class="ph ph-buildings"></i>View Company Profile</button>
        </div>
      </div>
    </div>`;
}

// ── 3. APPLICATION TRACKER ─────────────────────
function renderTracker(container) {
  const cols = [
    { key:'applied', label:'Applied', cls:'applied', icon:'ph-paper-plane-tilt' },
    { key:'interview', label:'Interview', cls:'interview', icon:'ph-microphone' },
    { key:'offer', label:'Offer 🎉', cls:'offer', icon:'ph-confetti' },
    { key:'rejected', label:'Rejected', cls:'rejected', icon:'ph-x-circle' }
  ];

  const totalActive = mockKanban.applied.length + mockKanban.interview.length;

  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Application Tracker 📋</h1>
          <p>Monitoring the 21-Day Ghosting Timer for ${totalActive} active applications.</p>
        </div>
        <button class="btn-primary" onclick="navigate('ghost')"><i class="ph ph-ghost"></i>Report Ghost</button>
      </div>

      <div class="stats-row" style="margin-bottom:1.5rem;">
        <div class="stat-card"><div class="stat-icon blue"><i class="ph-fill ph-paper-plane-tilt"></i></div><div class="stat-value">${mockKanban.applied.length}</div><div class="stat-label">Applied</div></div>
        <div class="stat-card"><div class="stat-icon yellow"><i class="ph-fill ph-microphone"></i></div><div class="stat-value">${mockKanban.interview.length}</div><div class="stat-label">Interview</div></div>
        <div class="stat-card"><div class="stat-icon green"><i class="ph-fill ph-confetti"></i></div><div class="stat-value">${mockKanban.offer.length}</div><div class="stat-label">Offer</div></div>
        <div class="stat-card"><div class="stat-icon red"><i class="ph-fill ph-x-circle"></i></div><div class="stat-value">${mockKanban.rejected.length}</div><div class="stat-label">Rejected</div></div>
      </div>

      <div class="kanban-board">
        ${cols.map(col => `
          <div class="kanban-col">
            <div class="kanban-col-header ${col.cls}">
              <i class="ph ${col.icon}"></i>${col.label}
              <span class="col-count">${mockKanban[col.key].length}</span>
            </div>
            <div class="kanban-cards">
              ${mockKanban[col.key].length === 0
                ? `<div style="text-align:center;padding:2rem;color:var(--text-muted);font-size:0.8rem;">No applications here</div>`
                : mockKanban[col.key].map(card => kanbanCardHtml(card)).join('')}
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function kanbanCardHtml(card) {
  const days = card.daysAgo;
  let timerCls = 'safe', timerLabel = `Day ${days}/21`, timerIcon = 'ph-timer';
  if (days >= 18) { timerCls = 'danger'; timerLabel = `⚠️ Day ${days}/21 – Ghost Risk!`; timerIcon = 'ph-warning'; }
  else if (days >= 12) { timerCls = 'warning'; timerLabel = `Day ${days}/21 – Watch`; timerIcon = 'ph-clock'; }
  return `
    <div class="kanban-card" onclick="navigate('detail',${card.id})">
      <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.5rem;">
        <div class="company-logo" style="width:32px;height:32px;font-size:0.7rem;margin:0;flex-shrink:0;">${card.logo}</div>
        <div>
          <div class="kanban-card-title">${card.title}</div>
          <div class="kanban-card-company">${card.company}</div>
        </div>
      </div>
      <div class="ghost-timer ${timerCls}"><i class="ph ${timerIcon}"></i>${timerLabel}</div>
    </div>`;
}

// ── 4. SKILL PROFILE ──────────────────────────
function renderProfile(container) {
  const missingSkills = ["TypeScript","Machine Learning","Docker","Figma"];
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Skill Profile 🎯</h1>
          <p>Your skills, gaps, and resume analysis.</p>
        </div>
        <button class="btn-primary"><i class="ph ph-upload-simple"></i>Upload Resume</button>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card" style="display:flex;gap:1.5rem;align-items:center;">
          <div class="resume-score-ring">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border-light)" stroke-width="10"/>
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--primary)" stroke-width="10" stroke-dasharray="314" stroke-dashoffset="${314 - 314 * 0.85}" stroke-linecap="round"/>
            </svg>
            <div class="ring-text"><div class="ring-number">85</div><div class="ring-label">ATS Score</div></div>
          </div>
          <div>
            <h3 style="margin-bottom:0.5rem;">Resume Analysis</h3>
            <p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:0.75rem;">Strong profile! A few improvements can boost your score to 95+.</p>
            <div style="display:flex;flex-direction:column;gap:0.35rem;">
              <div style="font-size:0.78rem;color:var(--danger-text);"><i class="ph ph-x-circle"></i> Missing: GitHub link</div>
              <div style="font-size:0.78rem;color:var(--danger-text);"><i class="ph ph-x-circle"></i> Add TypeScript projects</div>
              <div style="font-size:0.78rem;color:var(--success);"><i class="ph ph-check-circle"></i> Keywords look great</div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="section-title"><i class="ph ph-chart-bar"></i>Application Analytics</div>
          <div style="display:flex;flex-direction:column;gap:0.6rem;">
            ${[['Applied','20','blue'],['Responses','7','green'],['Interviews','3','yellow'],['Response Rate','35%','purple']].map(([l,v,c]) => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.4rem 0;border-bottom:1px solid var(--border-light);">
                <span style="font-size:0.83rem;color:var(--text-muted);">${l}</span>
                <span class="badge ${c}">${v}</span>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="section-title"><i class="ph ph-lightning"></i>Your Skills</div>
        <div class="skills-grid">
          ${Object.entries(userSkillLevels).map(([sk, pct]) => `
            <div class="skill-item">
              <div class="skill-item-top"><span class="skill-name">${sk}</span><span class="skill-pct">${pct}%</span></div>
              <div class="skill-bar-bg"><div class="skill-bar-fill" style="width:${pct}%"></div></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="section-title"><i class="ph ph-warning"></i>Skill Gaps</div>
        <p style="font-size:0.83rem;color:var(--text-muted);margin-bottom:1rem;">Based on top internship requirements in your field:</p>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;">
          ${missingSkills.map(s => `<span class="skill-gap-tag"><i class="ph ph-x"></i>${s}</span>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="section-title"><i class="ph ph-graduation-cap"></i>Recommended Courses</div>
        <div class="courses-grid">
          ${mockCourses.map(c => `
            <div class="course-card">
              <div class="course-icon">${c.icon}</div>
              <div>
                <div class="course-title">${c.title}</div>
                <div class="course-provider">${c.provider}</div>
                <span class="badge ${c.color}" style="margin-top:0.5rem;">${c.tag}</span>
              </div>
            </div>`).join('')}
        </div>
      </div>
    </div>`;
}

// ── 5. COMPANY PROFILE ────────────────────────
function renderCompany(container) {
  const job = mockInternships.find(j => j.id === currentCompanyId) || mockInternships[0];
  const reviews = [
    { name:"Riya S.", stars:"★★★★★", text:"Great mentorship program. My manager was very supportive and I shipped real features.", rating:5 },
    { name:"Karan M.", stars:"★★★★☆", text:"Work was interesting but onboarding was a bit slow. Overall a good experience.", rating:4 },
    { name:"Anjali T.", stars:"★★★☆☆", text:"Response rate was slow before joining. After joining, team was fine.", rating:3 }
  ];
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <button class="btn-ghost" style="margin-bottom:1rem;" onclick="navigate('detail',${job.id})"><i class="ph ph-arrow-left"></i>Back to Internship</button>
      <div class="company-hero">
        <div class="company-logo-lg">${job.logo}</div>
        <h1>${job.company}</h1>
        <p>Technology · ${job.graduates} total interns hired · ${job.openings} openings now</p>
        <div style="margin-top:0.75rem;display:flex;gap:0.5rem;flex-wrap:wrap;">${tbadge(job.transparency)}</div>
        <div class="transparency-meter">
          <div class="trans-label"><span>Response Rate</span><span>${job.responseRate}%</span></div>
          <div class="trans-bar-bg"><div class="trans-bar-fill" style="width:${job.responseRate}%"></div></div>
        </div>
      </div>

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div class="card">
          <div class="section-title"><i class="ph ph-chart-line"></i>Monthly Response Rate</div>
          <div class="response-chart">
            ${[70,65,80,job.responseRate,job.responseRate-5,job.responseRate+3].map((h,i) => `
              <div class="bar-wrap">
                <div class="bar-item" style="height:${h * 0.7}px;" title="${h}%"></div>
                <div class="bar-month">${['J','F','M','A','M','J'][i]}</div>
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="section-title"><i class="ph ph-shield-check"></i>Platform Badges</div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;">
            ${job.transparency === 'green'
              ? '<div class="badge green" style="font-size:0.85rem;padding:0.5rem 1rem;">🏅 Verified Responsive</div><div class="badge green" style="font-size:0.85rem;padding:0.5rem 1rem;">✅ Fair Stipend</div><div class="badge green" style="font-size:0.85rem;padding:0.5rem 1rem;">🟢 No Scam Reports</div>'
              : job.transparency === 'yellow'
              ? '<div class="badge yellow" style="font-size:0.85rem;padding:0.5rem 1rem;">🟡 Low Response</div><div class="badge yellow" style="font-size:0.85rem;padding:0.5rem 1rem;">⚠️ Slow Replies</div>'
              : '<div class="badge red" style="font-size:0.85rem;padding:0.5rem 1rem;">🔴 Community Flagged</div><div class="badge red" style="font-size:0.85rem;padding:0.5rem 1rem;">💀 Ghost Reports: '+job.scamReports+'</div>'}
          </div>
        </div>
      </div>

      <div class="card" style="margin-bottom:1.5rem;">
        <div class="section-title"><i class="ph ph-star"></i>Student Reviews</div>
        ${reviews.map(r => `
          <div class="review-card">
            <div class="review-header"><span class="reviewer-name">${r.name}</span><span class="review-stars">${r.stars}</span></div>
            <p class="review-text">${r.text}</p>
          </div>`).join('')}
      </div>

      ${job.scamReports > 0 ? `
        <div class="card" style="border-color:var(--danger);background:var(--danger-bg);">
          <div class="section-title" style="color:var(--danger-text);"><i class="ph ph-warning-octagon"></i>Ghost / Scam Reports</div>
          <p style="font-size:0.875rem;color:var(--danger-text);">⚠️ ${job.scamReports} students have reported ghosting or stipend issues with this company. Proceed with caution.</p>
          <button class="btn-ghost" style="margin-top:1rem;" onclick="navigate('ghost')"><i class="ph ph-ghost"></i>File a Report</button>
        </div>` : ''}
    </div>`;
}

// ── 6. SENIOR CONNECT ─────────────────────────
function renderSenior(container) {
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Senior Connect 🤝</h1>
          <p>Learn from alumni of NIET Business School who've been there.</p>
        </div>
      </div>
      <div class="card" style="margin-bottom:1.5rem;background:linear-gradient(135deg,var(--primary-light),#ede9fe);border:none;">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
          <div>
            <h2 style="margin-bottom:0.35rem;">🏆 College Leaderboard</h2>
            <p style="font-size:0.85rem;color:var(--text-muted);">Top Internship Achievers — NIET Business School</p>
          </div>
          <button class="btn-primary">View Full Leaderboard</button>
        </div>
        <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:0.5rem;">
          ${[["🥇","Priya Sharma","Google · 3 Offers","6366f1"],["🥈","Rahul Mehta","Microsoft + Flipkart","059669"],["🥉","You (Aditya)","TechFlow Offer","2563eb"]].map(([medal,name,detail,color]) => `
            <div style="display:flex;align-items:center;gap:0.75rem;padding:0.6rem 0.85rem;background:rgba(255,255,255,0.6);border-radius:var(--radius-sm);">
              <span style="font-size:1.2rem;">${medal}</span>
              <div style="flex:1;"><div style="font-weight:600;font-size:0.875rem;">${name}</div><div style="font-size:0.75rem;color:var(--text-muted);">${detail}</div></div>
            </div>`).join('')}
        </div>
      </div>

      <div class="alumni-grid">
        ${mockAlumni.map(a => `
          <div class="alumni-card">
            <div class="alumni-header">
              <div class="alumni-avatar" style="background:${a.avatarColor};">${a.initials}</div>
              <div>
                <div class="alumni-name">${a.name}</div>
                <div class="alumni-batch">${a.batch} · NIET</div>
                <div class="alumni-company">${a.company}</div>
                <div class="alumni-role">${a.role}</div>
              </div>
            </div>
            <div class="alumni-tip">${a.tip}</div>
            <button class="btn-outline" style="width:100%;"><i class="ph ph-paper-plane-tilt"></i>Message for Advice</button>
          </div>`).join('')}
      </div>
    </div>`;
}

// ── 7. GHOST REPORT FLOW ──────────────────────
function renderGhost(container) {
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Ghost Report 👻</h1>
          <p>Report companies that didn't respond within 21 days.</p>
        </div>
      </div>

      <div class="ghost-flow">
        <div class="card" style="margin-bottom:1.5rem;border-color:var(--warning);background:var(--warning-bg);">
          <div style="display:flex;align-items:center;gap:0.75rem;">
            <i class="ph ph-info" style="font-size:1.5rem;color:var(--warning);flex-shrink:0;"></i>
            <p style="font-size:0.85rem;color:var(--warning-text);">InternBridge tracks a <strong>21-Day Ghosting Rule</strong>. If a company doesn't respond within 21 days, you can officially report them. Reports are public and affect their transparency score.</p>
          </div>
        </div>

        <div class="flow-steps">
          <div class="flow-step done"><div class="step-dot"><i class="ph ph-check"></i></div><div class="step-label">Applied</div></div>
          <div class="flow-step done"><div class="step-dot"><i class="ph ph-check"></i></div><div class="step-label">Waited 21 Days</div></div>
          <div class="flow-step active"><div class="step-dot">3</div><div class="step-label">Report</div></div>
          <div class="flow-step"><div class="step-dot">4</div><div class="step-label">Submitted</div></div>
        </div>

        <div class="card">
          <h2 style="margin-bottom:1.25rem;">File a Ghost Report</h2>
          <div class="ghost-report-form">
            <div class="form-group">
              <label class="form-label">Company Name</label>
              <select class="form-select">
                <option>Select a company you applied to…</option>
                ${mockInternships.map(j => `<option>${j.company} – ${j.title}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Application Date</label>
              <input class="form-input" type="date">
            </div>
            <div class="form-group">
              <label class="form-label">Type of Issue</label>
              <select class="form-select">
                <option>No response after 21+ days (Ghosting)</option>
                <option>Fake internship / Scam</option>
                <option>Stipend not paid</option>
                <option>Misleading job description</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Your Experience (optional)</label>
              <textarea class="form-textarea" placeholder="Describe what happened. This helps other students…"></textarea>
            </div>
            <button class="btn-primary" style="width:100%;" onclick="submitGhostReport()"><i class="ph ph-ghost"></i>Submit Ghost Report</button>
          </div>
        </div>

        <div class="card" style="margin-top:1.25rem;">
          <div class="section-title"><i class="ph ph-chart-bar"></i>Ghost Reports This Month</div>
          <div style="display:flex;flex-direction:column;gap:0.5rem;">
            ${mockInternships.filter(j => j.scamReports > 0).map(j => `
              <div style="display:flex;justify-content:space-between;align-items:center;padding:0.5rem 0;border-bottom:1px solid var(--border-light);">
                <span style="font-weight:600;font-size:0.875rem;">${j.company}</span>
                <span class="badge red"><i class="ph ph-ghost"></i>${j.scamReports} reports</span>
              </div>`).join('')}
          </div>
        </div>
      </div>
    </div>`;
}

function submitGhostReport() {
  const btn = document.querySelector('.ghost-report-form .btn-primary');
  btn.innerHTML = '<i class="ph ph-check"></i>Report Submitted!';
  btn.style.background = 'var(--success)';
  btn.disabled = true;
  setTimeout(() => navigate('home'), 2000);
}

// ── 8. PREP HUB ───────────────────────────────
function renderPrep(container) {
  container.innerHTML = `
    <div class="page-wrapper fade-in">
      <div class="page-header">
        <div class="page-header-left">
          <h1>Preparation Hub 📚</h1>
          <p>Interview questions, success stories, and your career roadmap.</p>
        </div>
      </div>

      <div class="prep-tabs">
        <button class="prep-tab active" onclick="switchPrepTab(this,'questions')"><i class="ph ph-question"></i> Interview Q&A</button>
        <button class="prep-tab" onclick="switchPrepTab(this,'stories')"><i class="ph ph-star"></i> How I Got In</button>
        <button class="prep-tab" onclick="switchPrepTab(this,'roadmap')"><i class="ph ph-map-trifold"></i> Roadmap</button>
      </div>

      <div id="prep-content"></div>
    </div>`;
  renderPrepQuestions();
}

function switchPrepTab(el, tab) {
  document.querySelectorAll('.prep-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  activePrepTab = tab;
  if (tab === 'questions') renderPrepQuestions();
  else if (tab === 'stories') renderPrepStories();
  else renderPrepRoadmap();
}

function renderPrepQuestions() {
  const questions = [
    { q:"Tell me about yourself and your projects.", tag:"HR", company:"All Companies" },
    { q:"Explain the virtual DOM in React.", tag:"Technical", company:"TechFlow" },
    { q:"How would you handle a data pipeline failure in production?", tag:"Technical", company:"Analytica" },
    { q:"Design a URL shortener like bit.ly.", tag:"System Design", company:"Backend Roles" },
    { q:"What is your biggest weakness?", tag:"HR", company:"All Companies" },
    { q:"Explain gradient descent in simple terms.", tag:"Conceptual", company:"NeuraLabs" },
    { q:"Walk me through your resume project end-to-end.", tag:"Technical", company:"All Companies" },
    { q:"How do you prioritize features on a product roadmap?", tag:"PM", company:"Startify" }
  ];
  const tagColor = { HR:'purple', Technical:'blue', 'System Design':'yellow', Conceptual:'green', PM:'red' };
  document.getElementById('prep-content').innerHTML = `
    <div class="question-list">
      ${questions.map((q,i) => `
        <div class="question-item">
          <div class="q-number">${i+1}</div>
          <div>
            <div class="q-text">${q.q}</div>
            <div class="q-tag"><span class="badge ${tagColor[q.tag]}">${q.tag}</span> <span class="badge gray">${q.company}</span></div>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderPrepStories() {
  const stories = [
    { name:"Priya S.", company:"Google", color:"#6366f1", initials:"PS", role:"SWE Intern 2023", excerpt:"I started preparing for Google in July with LeetCode medium problems. Solved 180+ problems. The interview had 3 rounds — DSA, OOP design, and HR. The key was consistency — 3 problems a day, no skipping.", tip:"Pro tip: Focus on trees, graphs, and dynamic programming." },
    { name:"Rahul M.", company:"Microsoft", color:"#059669", initials:"RM", role:"PM Intern 2022", excerpt:"Coming from a non-tech background, I prepared PM case studies for 2 months. Read 'Cracking the PM Interview'. My portfolio had 2 product teardowns which impressed the interviewer.", tip:"Pro tip: Know the product you're interviewing for, inside out." },
    { name:"Sneha G.", company:"Flipkart", color:"#dc2626", initials:"SG", role:"Data Science Intern 2023", excerpt:"My Kaggle profile got me noticed. I had a top 5% ranking in a competition. They asked about my models in the interview. SQL and statistics are must-knows — they asked 4 SQL questions!", tip:"Pro tip: Kaggle + GitHub is your resume game-changer." }
  ];
  document.getElementById('prep-content').innerHTML = stories.map(s => `
    <div class="story-card">
      <div class="story-header">
        <div class="story-avatar" style="background:${s.color};">${s.initials}</div>
        <div>
          <div class="story-name">${s.name} → ${s.company}</div>
          <div class="story-meta">${s.role}</div>
        </div>
        <span class="badge green" style="margin-left:auto;">How I Got In</span>
      </div>
      <p class="story-excerpt">${s.excerpt}</p>
      <div class="badge blue" style="margin-top:0.75rem;">${s.tip}</div>
    </div>`).join('');
}

function renderPrepRoadmap() {
  const steps = [
    { year:"Year 1 → Foundation", title:"Learn the Basics", desc:"Python / JavaScript basics, Git, Data Structures. Build 2 small side projects and put them on GitHub." },
    { year:"Year 2 → Build", title:"Build Real Projects", desc:"Create 3–4 portfolio projects. Contribute to open source. Start competitive programming on LeetCode." },
    { year:"Year 3 → Apply", title:"Apply for Internships", desc:"Target 20+ companies. Use InternBridge filters. Cold email alumni. Polish your resume to 90+ ATS score." },
    { year:"Year 3+ → Land It", title:"Ace Interviews", desc:"Practice mock interviews. Use the prep hub questions. Join community challenges. Leverage Senior Connect for referrals." }
  ];
  document.getElementById('prep-content').innerHTML = `
    <div class="card" style="margin-bottom:1.25rem;background:var(--primary-light);border:none;">
      <div style="display:flex;gap:0.75rem;align-items:center;">
        <i class="ph ph-map-trifold" style="font-size:1.5rem;color:var(--primary);"></i>
        <div>
          <h3>AI Roadmap Generator</h3>
          <p style="font-size:0.83rem;color:var(--text-muted);">Personalized for: <strong>Full-Stack Development</strong> (based on your profile)</p>
        </div>
      </div>
    </div>
    <div class="roadmap-container">
      ${steps.map(s => `
        <div class="roadmap-item">
          <div class="roadmap-line"><div class="roadmap-dot"></div><div class="roadmap-connector"></div></div>
          <div class="roadmap-content">
            <div class="roadmap-year">${s.year}</div>
            <div class="roadmap-title">${s.title}</div>
            <div class="roadmap-desc">${s.desc}</div>
          </div>
        </div>`).join('')}
    </div>`;
}

// Boot
document.addEventListener('DOMContentLoaded', initApp);
