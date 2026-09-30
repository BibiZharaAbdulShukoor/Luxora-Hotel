/* ==========================================================
   LUXORA ABOUT PAGE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ========================================================
     SCROLL REVEAL, this is a custom implementation of scroll reveal, not using any libraries
     ======================================================== */

  const revealElement = document.querySelectorAll(
    ".about-intro__content, " +
      ".about-story__content, " +
      ".philosophy-card, " +
      ".about-quote, " +
      ".number-item, " +
      ".value-row, " +
      ".about-cta__content",
  );

  revealElement.forEach((element) => {
    element.style.opacity = "0";

    element.style.transform = "translateY(32px)";

    element.style.transition =
      "opacity .7s ease, transform .7s cubic-bezier(.2,.75,.25,1)";
  });

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.style.opacity = "1";

        entry.target.style.transform = "translateY(0)";

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.14,
    },
  );

  revealElement.forEach((element) => {
    revealObserver.observe(element);
  });

  /* ========================================================
     NUMBER COUNTER, this is a custom implementation of number counter, not using any libraries
     ======================================================== */

  const counterOfNum = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const counterNum = entry.target;

        const target = Number(counterNum.dataset.count);

        const durationOfCounting = 1350; // in milliseconds

        const startTime = performance.now();

        function animate(time) {
          const progress = Math.min((time - startTime) / durationOfCounting, 1);

          const eased = 1 - Math.pow(1 - progress, 3);

          const current = Math.floor(target * eased);

          counterNum.textContent = current;

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            counterNum.textContent = target;
          }
        }

        requestAnimationFrame(animate);

        observer.unobserve(counterNum);
      });
    },
    {
      threshold: 0.4,
    },
  );

  counterOfNum.forEach((counterNum) => {
    counterObserver.observe(counterNum);
  });

  /* ========================================================
     HERO PARALLAX, this is a custom implementation of parallax effect, not using any libraries
     ======================================================== */

  const heroPicture = document.querySelector(".about-hero__image");

  if (heroPicture) {
    window.addEventListener(
      "scroll",
      () => {
        const scrollPage = window.scrollY;

        if (scrollPage < window.innerHeight) {
          heroPicture.style.transform = `scale(1.03) translateY(${scrollPage * 0.08}px)`;
        }
      },
      {
        passive: true,
      },
    );
  }

  /* ========================================================
     CTA PARALLAX, this is a custom implementation of parallax effect, not using any libraries
     ======================================================== */

  const ctaImage = document.querySelector(".about-cta__image");

  if (ctaImage) {
    window.addEventListener(
      "scroll",
      () => {
        const rect = ctaImage.parentElement.getBoundingClientRect();

        const offset = (window.innerHeight - rect.top) * 0.035;

        ctaImage.style.transform = `translateY(${offset}px) scale(1.04)`;
      },
      {
        passive: true,
      },
    );
  }
});
