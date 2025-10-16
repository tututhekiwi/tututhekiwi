document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Upgrade data-base images to WebP-first <picture>
  (function upgradeImages(){
    const imgs = Array.from(document.querySelectorAll('img[data-base]'));
    imgs.forEach(img => {
      const base = img.getAttribute('data-base');
      const fallbackType = (img.getAttribute('data-type') || 'jpg').toLowerCase();
      const transparent = img.hasAttribute('data-transparent');
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

  // Highlight any broken images on the page
  (function watchBrokenImages(){
    function mark(el){
      el.style.outline = '3px solid #c21c2c';
      el.title = `Image failed to load: ${el.currentSrc || el.src}`;
      console.warn('Missing image:', el.currentSrc || el.src);
    }
    document.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => mark(img), { once: true });
    });
  })();
});
