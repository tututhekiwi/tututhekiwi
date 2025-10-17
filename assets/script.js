/* =============================================
FILE: script.js
Purpose: Global JS for Tutu the Kiwi
Features:
- Injects current year into footer
- Handles mobile nav toggle
- Highlights active links
============================================= */

(function(){
  // inject year into footer
  const y = document.getElementById('y');
  if(y){
    y.textContent = new Date().getFullYear();
  }

  // mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if(toggle && nav){
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // highlight active link
  const path = location.pathname.replace(/\/index\.html$/, '');
  document.querySelectorAll('.site-nav a, .footer-nav a').forEach(a => {
    try {
      const href = new URL(a.getAttribute('href'), location.origin)
        .pathname.replace(/\/index\.html$/, '');
      if(href === path){
        a.classList.add('active');
      }
    } catch(e){}
  });
})();
