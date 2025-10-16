// Minimal enhancements + safety nets

// Add error fallback text if any lazy image fails to load
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", () => {
      if (!img.dataset.triedFallback) {
        img.dataset.triedFallback = "1";
        img.alt = (img.alt || "Image") + " (unavailable)";
      }
    });
  });
});

// Smooth-scroll focus fix for accessibility (anchors -> focus section heading)
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", e => {
    const id = link.getAttribute("href").slice(1);
    const el = document.getElementById(id);
    if (el) {
      el.setAttribute("tabindex", "-1");
      el.addEventListener("blur", () => el.removeAttribute("tabindex"), { once: true });
      el.focus({ preventScroll: true });
    }
  });
});
