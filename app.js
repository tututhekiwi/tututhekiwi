// Update copyright year
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

// Optional: Progressive enhancement to upgrade any <img data-base="...">
// into a <picture> that prefers .webp then falls back to .jpg/.png.
//
// Usage in your HTML if you want auto-upgrade:
//   <img data-base="/images/books/cookie-cloud" data-type="jpg" alt="..." width="600" height="800" loading="lazy" />
//
// This will render:
//   <picture>
//     <source srcset="/images/books/cookie-cloud.webp" type="image/webp">
//     <img src="/images/books/cookie-cloud.jpg" ...>
//   </picture>
(function upgradeImages(){
  const imgs = Array.from(document.querySelectorAll('img[data-base]'));
  imgs.forEach(img => {
    const base = img.getAttribute('data-base');
    const fallbackType = (img.getAttribute('data-type') || 'jpg').toLowerCase();
    const transparent = img.hasAttribute('data-transparent'); // if true, prefer png fallback
    const fallbackExt = transparent ? 'png' : fallbackType;

    const picture = document.createElement('picture');
    const srcWebp = document.createElement('source');
    srcWebp.setAttribute('srcset', `${base}.webp`);
    srcWebp.setAttribute('type','image/webp');
    picture.appendChild(srcWebp);

    const clone = img.cloneNode(true);
    clone.removeAttribute('data-base');
    clone.removeAttribute('data-type');
    clone.removeAttribute('data-transparent');
    clone.setAttribute('src', `${base}.${fallbackExt}`);

    picture.appendChild(clone);
    img.replaceWith(picture);
  });
})();
