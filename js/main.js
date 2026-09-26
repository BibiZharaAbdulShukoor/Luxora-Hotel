/* ==========================================================
   LUXORA HOTEL — FINAL HOME PAGE
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  /* ==========================================================
     LOADING ANIMATION WILL SHOW UNTIL THE PAGE IS FULLY LOADED
  ========================================================== */

  const loader = document.getElementById("loading");

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader?.classList.add("is-hidden");
    }, 500);
  });

  /* ==========================================================
     SMOOTH ANCHOR NAVIGATION, this part can handle the smooth scrolling to anchor links when clicked.
  ========================================================== */

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetIds = anchor.getAttribute("href");

      if (!targetIds || targetIds === "#") {
        return;
      }

      const targets = document.querySelector(targetIds);

      if (!targets) {
        return;
      }

      event.preventDefault();

      /*
        Navbar will load dynamically by navbar.js.
      */

      const myHeader =
        document.getElementById("luxHotel-Header") ||
        document.querySelector(".luxora-hotel-header");

      const offset = myHeader?.offsetHeight || 0;

      const topSec =
        targets.getBoundingClientRect().top + window.scrollY - offset + 1;

      window.scrollTo({
        top: topSec,
        behavior: "smooth",
      });
    });
  });

  /* ==========================================================
     ACTIVE NAVIGATION, this part can handle the active state of the navbar links based on the current page and scroll position.
  ========================================================== */

  const sections = [...document.querySelectorAll("main section[id]")];

  /*
    The shared navbar.js just can handles page-based active states.

    So, this section can help us about the Home page navbar that 
    contains anchor links such as #home, #experience, etc.
  */

  const navbarLinks = [
    ...document.querySelectorAll(
      ".lux-nav-link[href^='#'], .lux-mobile-links a[href^='#']",
    ),
  ];

  const updateActiveLinks = () => {
    if (!navbarLinks.length) {
      return;
    }

    const myHeader =
      document.getElementById("luxHotel-Header") ||
      document.querySelector(".luxora-hotel-header");

    const markerOne = window.scrollY + (myHeader?.offsetHeight || 80) + 100;

    let activeId = "home";

    sections.forEach((section) => {
      if (markerOne >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navbarLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${activeId}`,
      );
    });
  };

  updateActiveLinks();

  window.addEventListener("scroll", updateActiveLinks, {
    passive: true,
  });

  /* ==========================================================
     BOOKING DATES, this part can handle the check-in and check-out dates, guests selection, and review availability button.
  ========================================================== */

  const checkIn = document.getElementById("checkIn");

  const checkOut = document.getElementById("checkOut");

  const guests = document.getElementById("guests");

  const reviewAvailabilityBtn = document.getElementById(
    "reviewAvailabilityBtn",
  );

  const bookingMsgs = document.getElementById("bookingMsg");

  const today = new Date();

  const todayISO = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
    .toISOString()
    .split("T")[0];

  if (checkIn && checkOut) {
    checkIn.min = todayISO;

    checkOut.min = todayISO;

    checkIn.addEventListener("change", () => {
      if (!checkIn.value) {
        return;
      }

      checkOut.min = checkIn.value;

      if (checkOut.value && checkOut.value <= checkIn.value) {
        checkOut.value = "";
      }
    });
  }

  reviewAvailabilityBtn?.addEventListener("click", () => {
    if (!checkIn?.value || !checkOut?.value) {
      showToast(
        "Please select the exact dates for your check-in and check-out.",
      );

      return;
    }

    const startDate = new Date(`${checkIn.value}T00:00:00`);

    const endDate = new Date(`${checkOut.value}T00:00:00`);

    const nights = Math.round((endDate - startDate) / 86400000);

    if (nights <= 0) {
      showToast("Check-out must be after check-in.");

      return;
    }

    const guestText = guests?.value || "2 Guests";

    if (bookingMsgs) {
      bookingMsgs.textContent = `${nights} night${
        nights === 1 ? "" : "s"
      } · ${guestText} selected.`;
    }

    showToast(
      "Your stay dates have been set. Explore our rooms to continue your booking.",
    );
  });

  /* ==========================================================
     SCROLL REVEAL, this part can visible the elements slowly when we scroll down.
  ========================================================== */

  const revealElm = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealView = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");

            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
      },
    );

    revealElm.forEach((el) => revealView.observe(el));
  } else {
    revealElm.forEach((el) => el.classList.add("visible"));
  }

  /* ==========================================================
     TESTIMONIALS, this part can show the testimonials of clients.
  ========================================================== */

  const reviews = [...document.querySelectorAll(".testimonial")];

  const prevReview = document.getElementById("prevReviewBtn");

  const nextReview = document.getElementById("nextReviewBtn");

  const reviewCountPart = document.getElementById("reviewCountPart");

  let reviewIndex = 0;

  let reviewTimer;

  const renderReview = () => {
    if (!reviews.length) {
      return;
    }

    reviews.forEach((review, index) => {
      review.classList.toggle("active", index === reviewIndex);
    });

    if (reviewCountPart) {
      reviewCountPart.textContent = `${String(reviewIndex + 1).padStart(
        2,
        "0",
      )} / ${String(reviews.length).padStart(2, "0")}`;
    }
  };

  const next = () => {
    if (!reviews.length) {
      return;
    }

    reviewIndex = (reviewIndex + 1) % reviews.length;

    renderReview();
  };

  const previous = () => {
    if (!reviews.length) {
      return;
    }

    reviewIndex = (reviewIndex - 1 + reviews.length) % reviews.length;

    renderReview();
  };

  prevReview?.addEventListener("click", previous);

  nextReview?.addEventListener("click", next);

  const startReviewTimer = () => {
    if (!reviews.length) {
      return;
    }

    clearInterval(reviewTimer);

    reviewTimer = setInterval(next, 6000);
  };

  renderReview();

  startReviewTimer();

  document.getElementById("Slider")?.addEventListener("mouseenter", () => {
    clearInterval(reviewTimer);
  });

  document
    .getElementById("testimonialSliders")
    ?.addEventListener("mouseleave", startReviewTimer);

  /* ==========================================================
     GALLERY LIGHTBOX, this part can show the gallery images in a lightbox modal.
  ========================================================== */

  const galleryCase = [...document.querySelectorAll(".gallery-item")];

  const lightboxPart = document.getElementById("lightbox");

  const lightboxImg = document.getElementById("lightboxImage");

  const lightboxCaptions = document.getElementById("lightboxCaption");

  const lightboxCounter = document.getElementById("lightboxCounter");

  const lightboxClosePart = document.getElementById("lightboxClose");

  const lightboxPreview = document.getElementById("lightboxPrev");

  const lightboxNext = document.getElementById("lightboxNext");

  const openGallerySection = document.getElementById("openGallery");

  let galleryList = 0;

  const renderOfLightbox = () => {
    const items = galleryCase[galleryList];

    if (!items || !lightboxImg) {
      return;
    }

    lightboxImg.src = items.dataset.image;

    lightboxImg.alt = items.dataset.alt || "LUXORA gallery";

    if (lightboxCaptions) {
      lightboxCaptions.textContent = items.dataset.alt || "";
    }

    if (lightboxCounter) {
      lightboxCounter.textContent = `${String(galleryList + 1).padStart(
        2,
        "0",
      )} / ${String(galleryCase.length).padStart(2, "0")}`;
    }
  };

  const openGallery = (index) => {
    if (!galleryCase.length) {
      return;
    }

    galleryList = index;

    renderOfLightbox();

    lightboxPart?.classList.add("open");

    lightboxPart?.setAttribute("aria-hidden", "false");

    body.classList.add("locked");
  };

  const closeGallery = () => {
    lightboxPart?.classList.remove("open");

    lightboxPart?.setAttribute("aria-hidden", "true");

    body.classList.remove("locked");
  };

  galleryCase.forEach((item, index) => {
    item.addEventListener("click", () => {
      openGallery(index);
    });
  });

  openGallerySection?.addEventListener("click", () => {
    openGallery(0);
  });

  lightboxClosePart?.addEventListener("click", closeGallery);

  lightboxPreview?.addEventListener("click", () => {
    if (!galleryCase.length) {
      return;
    }

    galleryList = (galleryList - 1 + galleryCase.length) % galleryCase.length;

    renderOfLightbox();
  });

  lightboxNext?.addEventListener("click", () => {
    if (!galleryCase.length) {
      return;
    }

    galleryList = (galleryList + 1) % galleryCase.length;

    renderOfLightbox();
  });

  lightboxPart?.addEventListener("click", (event) => {
    if (event.target === lightboxPart) {
      closeGallery();
    }
  });

  /* ==========================================================
     KEYBOARD, this part can handle the keyboard events for the gallery lightbox.
  ========================================================== */

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeGallery();
    }

    if (lightboxPart?.classList.contains("open")) {
      if (event.key === "ArrowLeft") {
        if (!galleryCase.length) {
          return;
        }

        galleryList =
          (galleryList - 1 + galleryCase.length) % galleryCase.length;

        renderOfLightbox();
      }

      if (event.key === "ArrowRight") {
        if (!galleryCase.length) {
          return;
        }

        galleryList = (galleryList + 1) % galleryCase.length;

        renderOfLightbox();
      }
    }
  });

  /* ==========================================================
     TOAST, this part can show the toast message when the user clicks the review availability button without selecting the check-in and check-out dates.
  ========================================================== */

  let toastTimer;

  function showToast(message) {
    const toastMsg = document.getElementById("toast");

    if (!toastMsg) {
      return;
    }

    clearTimeout(toastTimer);

    toastMsg.textContent = message;

    toastMsg.classList.add("show");

    toastTimer = setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 4000);
  }
});
