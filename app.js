// existing JS here ...

// Reveal sections on scroll
const observer = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ? null
  : new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = 1;
          e.target.style.transform = "translateY(0)";
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });

document.querySelectorAll("main section").forEach((sec) => {
  sec.style.opacity = 0;
  sec.style.transform = "translateY(12px)";
  sec.style.transition = "opacity .6s ease, transform .6s ease";
  if (observer) observer.observe(sec);
});
