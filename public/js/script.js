/* =============================================
   Canada Development Opportunities Portal
   script.js — Frontend Logic
   ============================================= */

// ─── STATE ──────────────────────────────────────────────────────────────────
const state = {
  lang: 'en',
  currentUser: null,
  applicants: [
    { uic:'UIC-CA-2026-108421', name:'Abebe Bekele',     email:'abebe@example.com',   type:'Individual Consultant', country:'Ethiopia',     status:'Under Review',         fee:'CAD 150' },
    { uic:'UIC-CA-2026-209833', name:'Amina Hassan',     email:'amina@ngo.org',        type:'NGO / Civil Society',   country:'Sudan',        status:'Approved',             fee:'CAD 300' },
    { uic:'UIC-CA-2026-317552', name:'James Oduya',      email:'james@firm.co',        type:'Research Firm',         country:'Kenya',        status:'Documents Submitted',  fee:'CAD 500' },
    { uic:'UIC-CA-2026-422198', name:'Fatima Al-Rashid', email:'fatima@example.sd',    type:'Contractor',            country:'South Sudan',  status:'Registered',           fee:'Not assigned' },
    { uic:'UIC-CA-2026-531047', name:'Tigist Yohannes',  email:'tigist@example.et',    type:'Individual Consultant', country:'Ethiopia',     status:'Rejected',             fee:'CAD 150' },
  ]
};

const docTypes = [
  { id:'passport',    label:'Passport Copy',              req:true,  status:'pending' },
  { id:'cv',          label:'CV / Resume',                req:true,  status:'pending' },
  { id:'certificates',label:'Academic Certificates',      req:true,  status:'pending' },
  { id:'company_reg', label:'Company Registration',       req:false, status:'pending' },
  { id:'support',     label:'Supporting Documents',       req:false, status:'pending' },
];

const statusTimeline = [
  { label:'Registered',                    done:true,  date:'June 22, 2026', note:'Account created and UIC assigned' },
  { label:'Documents Submitted',           done:false, date:'—',             note:'Upload passport, CV and certificates' },
  { label:'Under Review',                  done:false, date:'—',             note:'Admin reviews submitted documents' },
  { label:'Additional Information Required',done:false,date:'—',             note:'If more information is needed' },
  { label:'Approved',                      done:false, date:'—',             note:'Application approved for FSS roster' },
  { label:'Completed',                     done:false, date:'—',             note:'Welcome to the FSS program' },
];

const translations = {
  en: {
    'site-h1':'Canada Development Opportunities Portal',
    'site-sub':'Field Support Services (FSS) Program · Global Affairs Canada',
    'hero-h':'Field Support Services Program',
    'hero-p':"Canada's premier development cooperation program supporting sustainable growth in Ethiopia, Sudan, South Sudan, and Pan-African initiatives.",
    'ab-title':'Program Overview',
    'el-title':'Eligibility Requirements',
    'proc-title':'Application Process',
    'faq-title':'Frequently Asked Questions',
  },
  fr: {
    'site-h1':'Portail des opportunités de développement du Canada',
    'site-sub':'Programme FSS · Affaires mondiales Canada',
    'hero-h':'Programme de services de soutien sur le terrain',
    'hero-p':"Le programme phare de coopération au développement du Canada soutenant la croissance durable en Éthiopie, au Soudan, au Soudan du Sud et dans les initiatives panafricaines.",
    'ab-title':'Aperçu du programme',
    'el-title':"Conditions d'admissibilité",
    'proc-title':'Processus de candidature',
    'faq-title':'Questions fréquemment posées',
  }
};

const statusClasses = {
  'Registered':                   'status-registered',
  'Documents Submitted':          'status-submitted',
  'Under Review':                 'status-review',
  'Approved':                     'status-approved',
  'Rejected':                     'status-rejected',
  'Additional Information Required':'status-additional',
  'Completed':                    'status-completed',
};

// ─── PAGE NAVIGATION ────────────────────────────────────────────────────────
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById(id);
  if (pg) pg.classList.add('active');
  window.scrollTo(0, 0);
}

function scrollSec(id) {
  showPage('page-home');
  setTimeout(() => { const el = document.getElementById(id); if (el) el.scrollIntoView({ behavior: 'smooth' }); }, 120);
}

// ─── LANGUAGE TOGGLE ────────────────────────────────────────────────────────
function toggleLang() {
  state.lang = state.lang === 'en' ? 'fr' : 'en';
  const t = translations[state.lang];
  Object.entries(t).forEach(([k, v]) => { const el = document.getElementById(k); if (el) el.textContent = v; });
  document.querySelectorAll('.lang-btn').forEach(b => b.textContent = state.lang === 'en' ? 'FR' : 'EN');
}

// ─── TOAST ──────────────────────────────────────────────────────────────────
function toast(msg, type = '') {
  const c = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = 'toast-msg ' + (type || '');
  el.textContent = msg;
  c.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

// ─── MODALS ─────────────────────────────────────────────────────────────────
function showAdminLogin() { document.getElementById('modal-admin-login').style.display = 'flex'; }
function closeModal(id)   { document.getElementById(id).style.display = 'none'; }

// ─── UIC GENERATOR ──────────────────────────────────────────────────────────
function genUIC() {
  return 'UIC-CA-2026-' + String(Math.floor(100000 + Math.random() * 900000));
}

// ─── REGISTRATION ───────────────────────────────────────────────────────────
function doRegister() {
  const name    = document.getElementById('reg-name').value.trim();
  const dob     = document.getElementById('reg-dob').value;
  const nat     = document.getElementById('reg-nat').value;
  const passport= document.getElementById('reg-passport').value.trim();
  const email   = document.getElementById('reg-email').value.trim();
  const phone   = document.getElementById('reg-phone').value.trim();
  const country = document.getElementById('reg-country').value;
  const org     = document.getElementById('reg-org').value.trim();
  const type    = document.getElementById('reg-type').value;
  const pw      = document.getElementById('reg-pw').value;
  const pw2     = document.getElementById('reg-pw2').value;
  const terms   = document.getElementById('reg-terms').checked;

  if (!name || !dob || !nat || !passport || !email || !phone || !country || !type || !pw) {
    toast('Please fill in all required fields.', 'error'); return;
  }
  if (pw.length < 8)  { toast('Password must be at least 8 characters.', 'error'); return; }
  if (pw !== pw2)     { toast('Passwords do not match.', 'error'); return; }
  if (!terms)         { toast('Please accept the Terms & Conditions.', 'error'); return; }

  const uic = genUIC();
  const today = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });
  state.currentUser = { name, dob, nat, passport, email, phone, country, org, type, uic, status:'Registered', regDate: today };
  state.applicants.unshift({ uic, name, email, type, country, status:'Registered', fee:'Not assigned' });

  toast('Registration successful! Your UIC: ' + uic, 'success');
  setupDashboard();
  setTimeout(() => showPage('page-dashboard'), 1200);
}

// ─── LOGIN ───────────────────────────────────────────────────────────────────
function doLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pw    = document.getElementById('login-pw').value;
  if (!email || !pw) { toast('Please enter your email/UIC and password.', 'error'); return; }

  if (!state.currentUser) {
    state.currentUser = {
      name:'Abebe Bekele', email, phone:'+251 911 234567', nat:'Ethiopian',
      passport:'A1234567', country:'Ethiopia', org:'Development Consulting Ethiopia',
      type:'Individual Consultant', uic:'UIC-CA-2026-108421', status:'Under Review', regDate:'June 15, 2026'
    };
  }
  toast('Login successful. Welcome back!', 'success');
  setupDashboard();
  setTimeout(() => showPage('page-dashboard'), 800);
}

function doLogout() {
  state.currentUser = null;
  toast('You have been securely logged out.');
  showPage('page-home');
}

// ─── ADMIN LOGIN ─────────────────────────────────────────────────────────────
function doAdminLogin() {
  const u = document.getElementById('adm-user').value;
  const p = document.getElementById('adm-pw').value;
  if (!u || !p) { toast('Enter admin credentials.', 'error'); return; }
  closeModal('modal-admin-login');
  toast('Admin authenticated successfully.', 'success');
  setupAdminTable();
  setTimeout(() => showPage('page-admin'), 800);
}

function doAdminLogout() { showPage('page-home'); toast('Admin session ended.'); }

// ─── DASHBOARD SETUP ─────────────────────────────────────────────────────────
function setupDashboard() {
  const u = state.currentUser;
  if (!u) return;

  const initials = u.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  document.getElementById('dash-avatar').textContent    = initials;
  document.getElementById('dash-name').textContent      = u.name;
  document.getElementById('dash-uic-small').textContent = u.uic;
  document.getElementById('dash-uic-main').textContent  = u.uic;
  document.getElementById('dash-uic-stat').textContent  = u.uic;
  document.getElementById('dash-status-stat').textContent = u.status || 'Registered';

  // Profile grid
  const fields = [
    ['Full Name', u.name], ['Email', u.email], ['Phone', u.phone], ['Nationality', u.nat],
    ['Passport', u.passport], ['Country', u.country], ['Organization', u.org || '—'], ['Type', u.type]
  ];
  const pg = document.getElementById('profile-grid');
  if (pg) pg.innerHTML = fields.map(([l,v]) => `<div><div class="profile-field-label">${l}</div><div class="profile-field-val">${v}</div></div>`).join('');
  const profUic = document.getElementById('prof-uic');
  if (profUic) profUic.textContent = u.uic;

  // Status steps
  const steps = [
    { icon:'✓', label:'Registration Complete', sub: u.regDate || 'June 22, 2026', done:true },
    { icon:'⬆', label:'Documents Pending',      sub:'Upload passport, CV and certificates', done:false },
    { icon:'🔍',label:'Under Review',            sub:'Waiting for document submission', done:false },
    { icon:'✓', label:'Approved',               sub:'Pending', done:false },
  ];
  const ss = document.getElementById('dash-status-steps');
  if (ss) ss.innerHTML = steps.map(s => `<div style="display:flex;align-items:center;gap:12px;padding:8px 0;${s.done?'':'opacity:.5'}">
    <div style="width:32px;height:32px;border-radius:50%;background:${s.done?'var(--success)':'var(--border)'};color:${s.done?'#fff':'var(--muted)'};display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:13px">${s.icon}</div>
    <div><div style="font-size:13px;font-weight:${s.done?'600':'400'}">${s.label}</div><div style="font-size:11px;color:var(--muted)">${s.sub}</div></div></div>`).join('');

  // Doc list
  renderDocList();

  // Status timeline
  const tl = document.getElementById('status-timeline');
  if (tl) tl.innerHTML = statusTimeline.map(s =>
    `<div class="timeline-row"><div class="timeline-dot ${s.done?'done':'pending'}">${s.done?'✓':'○'}</div>
    <div><div class="timeline-label ${s.done?'':'pending'}">${s.label}</div><div class="timeline-meta">${s.date} · ${s.note}</div></div></div>`
  ).join('');

  showDashTab('overview');
}

function renderDocList() {
  const dl = document.getElementById('doc-upload-list');
  if (!dl) return;
  dl.innerHTML = docTypes.map(d => `
    <div class="doc-row">
      <div class="doc-info">
        <span>📄</span>
        <div>
          <div class="doc-name">${d.label} ${d.req ? '<span style="color:var(--red)">*</span>' : ''}</div>
          <div class="doc-status ${d.status==='uploaded'?'uploaded':''}">${d.status==='uploaded'?'✓ Uploaded':'Pending upload'}</div>
        </div>
      </div>
      <button class="btn btn-outline btn-sm" onclick="uploadDoc('${d.id}')">Upload</button>
    </div>`).join('');
}

// ─── DASHBOARD TABS ───────────────────────────────────────────────────────────
function showDashTab(tab) {
  ['overview','profile','documents','payment','status','messages','settings'].forEach(t => {
    const el = document.getElementById('dtab-' + t);
    if (el) el.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.sidebar-item').forEach(el => {
    el.classList.toggle('active', el.getAttribute('onclick') && el.getAttribute('onclick').includes("'" + tab + "'"));
  });
}

// ─── DOCUMENT UPLOAD ─────────────────────────────────────────────────────────
function uploadDoc(id) {
  const d = docTypes.find(x => x.id === id);
  if (d) { d.status = 'uploaded'; toast(d.label + ' uploaded successfully.', 'success'); renderDocList(); }
}

function simulateUpload() {
  const pending = docTypes.find(d => d.status === 'pending');
  if (pending) uploadDoc(pending.id);
  else toast('All documents have been uploaded.', 'success');
}

// ─── FLUTTERWAVE PAYMENT ─────────────────────────────────────────────────────

// Stored after initiation for verify step
let _flwTxRef = null;
let _flwPaymentId = null;

async function initiateFlutterwavePayment() {
  const u = state.currentUser;
  if (!u) { toast('Please login first.', 'error'); return; }

  const btn = document.getElementById('flw-pay-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Preparing payment...'; }

  try {
    // In production: fetch payload from server
    // const res = await fetch('/api/payments/initiate', { method:'POST', headers:{ Authorization:'Bearer '+getToken() } });
    // const { payload, txRef } = await res.json();

    // Demo: build payload locally (in production, server provides this)
    const txRef = 'FSS-' + u.uic + '-' + Date.now();
    _flwTxRef = txRef;

    const payload = {
      public_key:   'FLWPUBK_TEST-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx-X', // replace with real key
      tx_ref:       txRef,
      amount:       150,
      currency:     'USD',
      payment_options: 'card,mobilemoney,ussd,banktransfer',
      customer: {
        email:       u.email || 'applicant@example.com',
        phonenumber: u.phone || '',
        name:        u.name,
      },
      customizations: {
        title:       'Canada FSS Portal',
        description: 'Application Processing Fee — ' + u.uic,
        logo:        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Flag_of_Canada_%28Pantone%29.svg/200px-Flag_of_Canada_%28Pantone%29.svg.png',
      },
      meta: { uic: u.uic },
      callback: function(response) { onFlutterwaveSuccess(response); },
      onclose:  function() { onFlutterwaveClose(); },
    };

    if (typeof FlutterwaveCheckout === 'undefined') {
      // Flutterwave SDK not loaded (offline demo) — simulate success
      if (btn) { btn.disabled = false; btn.textContent = '🔒 Pay Securely with Flutterwave'; }
      simulateFlutterwaveSuccess(txRef);
      return;
    }

    FlutterwaveCheckout(payload);
    if (btn) { btn.disabled = false; btn.textContent = '🔒 Pay Securely with Flutterwave'; }

  } catch (err) {
    toast('Could not initiate payment. Try again.', 'error');
    if (btn) { btn.disabled = false; btn.textContent = '🔒 Pay Securely with Flutterwave'; }
  }
}

async function onFlutterwaveSuccess(response) {
  // response = { transaction_id, tx_ref, flw_ref, status, amount, currency }
  console.log('Flutterwave callback:', response);
  if (response.status === 'successful') {
    // In production: verify on server
    // const verify = await fetch('/api/payments/verify', { method:'POST', headers:{...}, body: JSON.stringify({ transaction_id: response.transaction_id, tx_ref: response.tx_ref }) });
    // const data = await verify.json();
    showPaymentSuccess(response.tx_ref, response.transaction_id, response.amount, response.currency);
  } else {
    toast('Payment was not completed. Please try again.', 'error');
  }
}

function onFlutterwaveClose() {
  toast('Payment window closed. You can retry anytime.');
}

function simulateFlutterwaveSuccess(txRef) {
  // Demo mode when Flutterwave SDK is unavailable
  toast('Demo mode: Simulating successful Flutterwave payment...', '');
  setTimeout(() => {
    showPaymentSuccess(txRef, 'TXN-' + Date.now(), 150, 'USD');
  }, 1500);
}

function showPaymentSuccess(txRef, transactionId, amount, currency) {
  const receipt = 'RCP-CA-' + Date.now();
  const date = new Date().toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' });

  // Hide pay button, show success
  const actionArea = document.getElementById('pay-action-area');
  const successArea = document.getElementById('pay-success-area');
  const statusBadge = document.getElementById('pay-fee-status');
  if (actionArea) actionArea.style.display = 'none';
  if (successArea) successArea.style.display = 'block';
  if (statusBadge) { statusBadge.textContent = 'Paid'; statusBadge.className = 'status status-approved'; }

  const receiptDisplay = document.getElementById('pay-receipt-display');
  if (receiptDisplay) receiptDisplay.textContent = 'Receipt: ' + receipt + ' · ' + date;

  // Update payment history
  const ph = document.getElementById('payment-history');
  if (ph) ph.innerHTML = `
    <table>
      <thead><tr><th>Date</th><th>Description</th><th>Tx ID</th><th>Amount</th><th>Method</th><th>Receipt</th></tr></thead>
      <tbody><tr>
        <td>${date}</td>
        <td>Application Processing Fee</td>
        <td style="font-family:monospace;font-size:11px">${transactionId}</td>
        <td style="font-weight:600;color:var(--success)">${amount} ${currency}</td>
        <td>Flutterwave</td>
        <td><button class="btn btn-outline btn-sm" onclick="printReceipt('${receipt}','${date}','${transactionId}','${amount}','${currency}')">Download</button></td>
      </tr></tbody>
    </table>`;

  toast('Payment of ' + amount + ' ' + currency + ' confirmed! Receipt: ' + receipt, 'success');

  // Update dashboard status
  if (state.currentUser) state.currentUser.feeStatus = 'paid';
}

function printReceipt(receiptNo, date, txId, amount, currency) {
  const u = state.currentUser || {};
  const win = window.open('', '_blank', 'width=700,height=900');
  win.document.write(`<!DOCTYPE html>
<html><head><title>Payment Receipt — ${receiptNo}</title>
<style>body{font-family:sans-serif;padding:40px;color:#1a1a1a}
.header{background:#CC0000;color:#fff;padding:20px;text-align:center;border-radius:6px}
.receipt-box{border:1px solid #ddd;border-radius:8px;padding:24px;margin-top:24px}
table{width:100%;border-collapse:collapse;margin-top:16px}
td{padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:14px}
td:first-child{color:#666;width:40%}td:last-child{font-weight:600}
.footer{text-align:center;color:#999;font-size:11px;margin-top:32px}
.seal{text-align:center;margin:20px 0;font-size:32px}
</style></head><body>
<div class="header"><h2 style="margin:0">🇨🇦 Canada Development Opportunities Portal</h2>
<p style="margin:4px 0 0;opacity:.85;font-size:12px">Field Support Services Program · Global Affairs Canada · OFFICIAL RECEIPT</p></div>
<div class="receipt-box">
  <div class="seal">&#128274;</div>
  <h3 style="text-align:center;color:#157a3c">✅ Payment Confirmed</h3>
  <table>
    <tr><td>Receipt Number</td><td style="font-family:monospace;color:#CC0000">${receiptNo}</td></tr>
    <tr><td>UIC</td><td style="font-family:monospace">${u.uic || '—'}</td></tr>
    <tr><td>Applicant Name</td><td>${u.name || '—'}</td></tr>
    <tr><td>Email</td><td>${u.email || '—'}</td></tr>
    <tr><td>Payment Date</td><td>${date}</td></tr>
    <tr><td>Amount Paid</td><td style="color:#157a3c;font-size:18px">${amount} ${currency}</td></tr>
    <tr><td>Transaction ID</td><td style="font-family:monospace;font-size:12px">${txId}</td></tr>
    <tr><td>Payment Gateway</td><td>Flutterwave</td></tr>
    <tr><td>Description</td><td>Application Processing Fee — FSS Program</td></tr>
    <tr><td>Status</td><td style="color:#157a3c">✓ PAID</td></tr>
  </table>
</div>
<div class="footer">
  Government of Canada · Global Affairs Canada<br>
  fss-portal@canada.ca · +1 (613) 944-4000<br>
  This is an official computer-generated receipt. No signature required.<br>
  © 2026 Government of Canada
</div>
<script>window.onload=function(){window.print();}<\/script>
</body></html>`);
  win.document.close();
}

function downloadReceipt() {
  toast('Opening receipt for print/download...', '');
  const ph = document.getElementById('payment-history');
  if (ph) {
    const btn = ph.querySelector('button');
    if (btn) btn.click();
  }
}

// Legacy stub (kept for compatibility)
function doPayment() { initiateFlutterwavePayment(); }

// ─── STATUS CHECK ─────────────────────────────────────────────────────────────
function checkStatus() {
  const q = document.getElementById('status-query').value.trim();
  const r = document.getElementById('status-result');
  if (!q) { toast('Please enter a UIC or email.', 'error'); return; }
  const found = state.applicants.find(a =>
    a.uic.toLowerCase() === q.toLowerCase() || a.email.toLowerCase() === q.toLowerCase()
  );
  r.style.display = 'block';
  if (found) {
    r.innerHTML = `<div class="alert alert-success">
      <div><strong>Application Found</strong><br>
      Name: ${found.name}<br>UIC: ${found.uic}<br>
      Status: <span class="status ${statusClasses[found.status] || 'status-registered'}">${found.status}</span></div></div>`;
  } else {
    r.innerHTML = `<div class="alert alert-error">No application found for "<strong>${q}</strong>". Please check your UIC or email address.</div>`;
  }
}

// ─── ADMIN TABLE ──────────────────────────────────────────────────────────────
function setupAdminTable(filter = '', statusFilter = '') {
  const tbody = document.getElementById('admin-tbody');
  if (!tbody) return;
  const data = state.applicants.filter(a => {
    const q = filter.toLowerCase();
    const sm = !statusFilter || a.status === statusFilter;
    return sm && (!q || (a.name.toLowerCase().includes(q) || a.uic.toLowerCase().includes(q) || a.email.toLowerCase().includes(q)));
  });
  tbody.innerHTML = data.map(a => `<tr>
    <td style="font-family:monospace;font-size:12px">${a.uic}</td>
    <td style="font-weight:500">${a.name}</td>
    <td style="font-size:12px">${a.email}</td>
    <td style="font-size:12px">${a.type}</td>
    <td>${a.country}</td>
    <td><span class="status ${statusClasses[a.status] || 'status-registered'}">${a.status}</span></td>
    <td style="font-size:12px">${a.fee}</td>
    <td><div style="display:flex;gap:4px">
      <button class="btn btn-green btn-sm" onclick="changeStatus('${a.uic}','Approved')" title="Approve">✓</button>
      <button class="btn btn-red btn-sm" onclick="changeStatus('${a.uic}','Rejected')" title="Reject">✗</button>
      <button class="btn btn-outline btn-sm" onclick="toast('Viewing docs for ${a.name}','')" title="Documents">📄</button>
    </div></td>
  </tr>`).join('');
}

function filterApplicants(v) {
  const sel = document.querySelector('#atab-applicants select');
  setupAdminTable(v, sel ? sel.value : '');
}

function filterByStatus(v) {
  const inp = document.querySelector('#atab-applicants input');
  setupAdminTable(inp ? inp.value : '', v);
}

function changeStatus(uic, newStatus) {
  const a = state.applicants.find(x => x.uic === uic);
  if (a) { a.status = newStatus; setupAdminTable(); toast(a.name + ' status updated to ' + newStatus + '.', 'success'); }
}

function assignFee() {
  const uic = document.getElementById('fee-uic').value.trim();
  const cat = document.getElementById('fee-cat').value;
  const a = state.applicants.find(x => x.uic === uic);
  if (a) { a.fee = (cat.split('—')[1] || '').trim(); toast('Fee assigned to ' + a.name + '.', 'success'); }
  else toast('UIC not found.', 'error');
}

// ─── ADMIN TABS ───────────────────────────────────────────────────────────────
function showAdminTab(tab, el) {
  ['applicants','fees','reports'].forEach(t => {
    const d = document.getElementById('atab-' + t);
    if (d) d.style.display = t === tab ? 'block' : 'none';
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  if (el) el.classList.add('active');
  if (tab === 'reports') renderReports();
}

// ─── REPORTS ──────────────────────────────────────────────────────────────────
function renderReports() {
  const countries = [
    { n:'Ethiopia', v:520 }, { n:'Sudan', v:310 }, { n:'South Sudan', v:180 }, { n:'Kenya', v:140 }, { n:'Other', v:90 }
  ];
  const maxC = Math.max(...countries.map(c => c.v));
  const cb = document.getElementById('country-bars');
  if (cb) cb.innerHTML = countries.map(c => `
    <div class="progress-wrap">
      <div class="progress-meta"><span>${c.n}</span><span style="color:var(--muted)">${c.v}</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(c.v/maxC*100)}%"></div></div>
    </div>`).join('');

  const statuses = [
    { n:'Approved', v:876, c:'var(--success)' }, { n:'Under Review', v:342, c:'var(--warn)' },
    { n:'Registered', v:200, c:'var(--info)' },  { n:'Rejected', v:22, c:'var(--red)' }
  ];
  const sb = document.getElementById('status-bars');
  if (sb) sb.innerHTML = statuses.map(s => `
    <div class="progress-wrap">
      <div class="progress-meta"><span>${s.n}</span><span style="color:var(--muted)">${s.v}</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${Math.round(s.v/876*100)}%;background:${s.c}"></div></div>
    </div>`).join('');
}

// ─── FAQ ─────────────────────────────────────────────────────────────────────
function toggleFaq(el) {
  const a = el.nextElementSibling;
  a.classList.toggle('open');
  el.parentElement.classList.toggle('open');
}

// ─── INIT ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupAdminTable();
});
