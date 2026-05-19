let currentStep = 1;
let qrInstance = null;

function goTo(step) {
  if (step === 4) buildReview();
  document.querySelectorAll('.form-panel').forEach(p => p.classList.remove('active'));
  document.getElementById('panel-' + step).classList.add('active');
  document.querySelectorAll('.step').forEach((s, i) => {
    s.classList.remove('active', 'done');
    const n = i + 1;
    if (n < step) s.classList.add('done');
    if (n === step) s.classList.add('active');
  });
  currentStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* Radio & checkbox custom styling */
document.querySelectorAll('.opt-item').forEach(item => {
  const input = item.querySelector('input');
  if (!input) return;
  input.addEventListener('change', () => {
    const name = input.name;
    if (input.type === 'radio') {
      document.querySelectorAll(`input[name="${name}"]`).forEach(r => {
        r.closest('.opt-item').classList.remove('selected');
      });
    }
    item.classList.toggle('selected', input.checked || input.type === 'radio');
  });
});

/* Show group count */
document.querySelectorAll('input[name="attend-type"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('group-count-row').style.display =
      r.value !== 'individual' ? 'grid' : 'none';
  });
});

/* Show transport detail */
document.querySelectorAll('input[name="transport"]').forEach(r => {
  r.addEventListener('change', () => {
    document.getElementById('transport-detail').style.display =
      r.value === 'needed' ? 'block' : 'none';
  });
});

/* Consent checkbox */
document.getElementById('consent').addEventListener('change', function() {
  const wrap = this.closest('.opt-item');
  const box = wrap.querySelector('.opt-box');
  wrap.classList.toggle('selected', this.checked);
  if (this.checked) {
    box.style.cssText = 'border-color:var(--crimson);background:var(--crimson);border-radius:0;';
    box.innerHTML = '<svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  } else {
    box.style.cssText = '';
    box.innerHTML = '';
  }
});

/* Build Review */
function val(id) {
  const el = document.getElementById(id);
  return el ? (el.value || '—') : '—';
}
function radioVal(name) {
  const checked = document.querySelector(`input[name="${name}"]:checked`);
  return checked ? checked.value : '—';
}
function reviewRow(label, value) {
  return `<div style="display:flex;justify-content:space-between;align-items:flex-start;padding:0.65rem 0;border-bottom:1px solid var(--light-gray);font-size:0.88rem;gap:1rem;">
    <span style="color:var(--text-muted);font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;flex-shrink:0;">${label}</span>
    <span style="color:var(--text-dark);text-align:right;">${value}</span>
  </div>`;
}
function buildReview() {
  document.getElementById('rev-personal').innerHTML =
    reviewRow('Full Name', `${val('first-name')} ${val('last-name')}`) +
    reviewRow('Email', val('email')) +
    reviewRow('Phone', val('phone')) +
    reviewRow('Gender', val('gender')) +
    reviewRow('Attending As', radioVal('attend-type'));
  document.getElementById('rev-church').innerHTML =
    reviewRow('Country', val('country')) +
    reviewRow('Province', val('province')) +
    reviewRow('City / Town', val('city')) +
    reviewRow('Church', val('church')) +
    reviewRow('Role', val('church-role'));
  document.getElementById('rev-logistics').innerHTML =
    reviewRow('Accommodation', radioVal('accom')) +
    reviewRow('Transport', radioVal('transport')) +
    reviewRow('Dietary / Medical', val('dietary') || '—') +
    reviewRow('Emergency Contact', val('emergency') || '—');
}

/* ── SUBMIT & GENERATE TICKET ── */
function submitForm() {
  if (!document.getElementById('consent').checked) {
    alert('Please confirm your consent before submitting.');
    return;
  }

  const ref = 'CTF2026-' + Math.floor(1000 + Math.random() * 9000);
  const firstName = val('first-name');
  const lastName  = val('last-name');
  const fullName  = `${firstName} ${lastName}`;
  const church    = val('church') || 'Not specified';
  const country   = val('country') || 'Zimbabwe';
  const attendType = radioVal('attend-type');
  const email     = val('email');
  const phone     = val('phone');

  /* Populate ticket fields */
  document.getElementById('ticket-id-display').textContent = 'ID: ' + ref;
  document.getElementById('t-name').textContent    = fullName;
  document.getElementById('t-church').textContent  = church;
  document.getElementById('t-country').textContent = country;
  document.getElementById('t-type').textContent    = attendType.charAt(0).toUpperCase() + attendType.slice(1);

  /* Generate QR code */
  const qrData = [
    'CATCH THE FIRE 2026',
    'Ref: ' + ref,
    'Name: ' + fullName,
    'Church: ' + church,
    'Country: ' + country,
    'Email: ' + email,
    'Phone: ' + phone,
    'Dates: 24-30 Aug 2026',
    'Venue: Richland City, Mhondoro'
  ].join('\n');

  const qrEl = document.getElementById('qr-code');
  qrEl.innerHTML = '';
  qrInstance = new QRCode(qrEl, {
    text: qrData,
    width: 180,
    height: 180,
    colorDark: '#0d1a35',
    colorLight: '#f7f4ef',
    correctLevel: QRCode.CorrectLevel.M
  });

  /* Show success, hide form UI */
  document.getElementById('panel-4').classList.remove('active');
  document.getElementById('success-panel').classList.add('active');
  document.getElementById('sidebar').style.display = 'none';
  document.querySelector('.stepper-wrap').style.display = 'none';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── DOWNLOAD TICKET ── */
function downloadTicket() {
  const ticket = document.getElementById('ticket-card');
  const btn = document.querySelector('.btn-download');
  btn.textContent = 'Generating…';
  btn.disabled = true;

  html2canvas(ticket, {
    scale: 3,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  }).then(canvas => {
    const link = document.createElement('a');
    const id = document.getElementById('ticket-id-display').textContent.replace('ID: ', '');
    link.download = id + '-ticket.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
    btn.textContent = '⬇ Download / Print Ticket';
    btn.disabled = false;
  });
}

/* ── SHARE TICKET ── */
function shareTicket() {
  const ticket = document.getElementById('ticket-card');
  html2canvas(ticket, { scale: 3, backgroundColor: '#ffffff', useCORS: true, logging: false }).then(canvas => {
    canvas.toBlob(blob => {
      const id = document.getElementById('ticket-id-display').textContent.replace('ID: ', '');
      const file = new File([blob], id + '-ticket.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({
          title: 'Catch The Fire 2026 — My Ticket',
          text: 'I\'m registered for Catch The Fire 2026! 🔥 Join me at Richland City, Mhondoro, 24–30 August.',
          files: [file]
        }).catch(() => {});
      } else {
        /* Fallback: just trigger download */
        downloadTicket();
      }
    }, 'image/png');
  });
}