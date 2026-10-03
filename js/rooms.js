/* =========================================================
   LUXORA ROOMS JAVASCRIPT
   ========================================================= */

/* =========================================================
   FILTER, this is a simple filter implementation for the room cards.
   ========================================================= */

const filterBtns = document.querySelectorAll(".filter-btn");

const hotelRoomCards = document.querySelectorAll(".room-card");

filterBtns.forEach((button) => {
  button.addEventListener("click", () => {
    const dataFilter = button.dataset.filter;

    filterBtns.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    hotelRoomCards.forEach((card) => {
      const category = card.dataset.category;

      if (dataFilter === "all" || category === dataFilter) {
        card.classList.remove("hidden");
      } else {
        card.classList.add("hidden");
      }
    });
  });
});

/* =========================================================
   SCROLL REVEAL, this is a simple implementation for the scroll reveal effect on the room cards.
   ========================================================= */

const revealElm = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
    },
  );

  revealElm.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElm.forEach((element) => {
    element.classList.add("visible");
  });
}
