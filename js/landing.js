/* =========================
   SCROLL REVEAL, when scrolling down the page, the elements will fade in and move up into view
========================= */

const revealElm = document.querySelectorAll(
  ".intro h2, .experience-grid article, .room-card, .story-card, .final-section h2",
);

if (revealElm.length) {
  const revealView = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";

          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElm.forEach((element) => {
    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition = "opacity 0.8s ease, transform 0.8s ease";

    revealView.observe(element);
  });
}
