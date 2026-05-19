function tick() {
  const diff = new Date('2026-08-24T00:00:00') - new Date();
  if (diff <= 0) return;
  document.getElementById('cd-d').textContent = Math.floor(diff / 86400000);
  document.getElementById('cd-h').textContent = String(Math.floor((diff % 86400000) / 3600000)).padStart(2,'0');
  document.getElementById('cd-m').textContent = String(Math.floor((diff % 3600000) / 60000)).padStart(2,'0');
  document.getElementById('cd-s').textContent = String(Math.floor((diff % 60000) / 1000)).padStart(2,'0');
}
tick(); setInterval(tick, 1000);

/* SCHEDULE TABS */
document.getElementById('tabs').addEventListener('click', e => {
  const tab = e.target.closest('.sd'); if (!tab) return;
  const i = tab.dataset.i;
  document.querySelectorAll('.sd').forEach(t => t.classList.remove('on'));
  document.querySelectorAll('.sched-panel').forEach(p => p.classList.remove('on'));
  tab.classList.add('on');
  document.querySelector(`.sched-panel[data-p="${i}"]`).classList.add('on');
});

/* SCROLL REVEAL */
const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('shown'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

/* EMBER PARTICLES */
(function() {
  const wrap = document.getElementById('embers-wrap');
  const MAX = 60;
  let count = 0;

  function spawnEmber() {
    if (count >= MAX) return;
    count++;
    const el = document.createElement('div');
    el.className = 'ember';
    const left = 10 + Math.random() * 80;
    const dur  = 4 + Math.random() * 8;
    const delay = Math.random() * 3;
    const size = 1 + Math.random() * 3;
    const drift = (Math.random() - 0.5) * 200;

    el.style.cssText = `
      left: ${left}%;
      width: ${size}px; height: ${size}px;
      animation-duration: ${dur}s;
      animation-delay: ${delay}s;
      --drift: ${drift}px;
    `;
    el.addEventListener('animationend', () => {
      el.remove();
      count--;
    });
    wrap.appendChild(el);
  }

  setInterval(spawnEmber, 150);
})();