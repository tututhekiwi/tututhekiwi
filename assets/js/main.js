// Year stamp
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const nav = document.getElementById('site-nav');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Tiny carousel (no deps)
(function(){
  const root = document.querySelector('[data-carousel]');
  if (!root) return;
  const track = root.querySelector('[data-track]');
  const slides = Array.from(track.children);
  const prev = root.querySelector('[data-prev]');
  const next = root.querySelector('[data-next]');
  const dotsWrap = root.querySelector('[data-dots]');
  let idx = 0;

  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Go to slide ' + (i+1));
    b.addEventListener('click', () => go(i));
    dotsWrap.appendChild(b);
  });

  function updateDots(){
    [...dotsWrap.children].forEach((d,i)=>{
      if (i===idx) d.setAttribute('aria-current','true'); else d.removeAttribute('aria-current');
    });
  }

  function go(i){
    idx = (i + slides.length) % slides.length;
    const w = slides[0].getBoundingClientRect().width + 16;
    track.scrollTo({ left: w * idx, behavior: 'smooth' });
    updateDots();
  }

  if (prev) prev.addEventListener('click', ()=>go(idx-1));
  if (next) next.addEventListener('click', ()=>go(idx+1));
  updateDots();
  window.addEventListener('resize', () => go(idx));
})();
