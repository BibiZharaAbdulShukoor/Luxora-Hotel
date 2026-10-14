/* ==========================================================
   LUXORA HOTEL — REVIEWS & FEEDBACK
   File: js/reviews.js
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const reviewForm = document.getElementById("feedbackForm");
  const reviewsList = document.getElementById("reviewsList");
  const ratingPicker = document.getElementById("ratingPicker");
  const ratingHint = document.getElementById("ratingHint");
  const feedbackMessage = document.getElementById("feedbackMessage");
  const averageRating = document.getElementById("averageRating");
  const averageStars = document.getElementById("averageStars");
  const reviewCount = document.getElementById("reviewCount");

  if (
    !reviewForm ||
    !reviewsList ||
    !ratingPicker ||
    !ratingHint ||
    !feedbackMessage
  ) {
    console.error("LUXORA: Reviews form elements were not found.");
    return;
  }

  const STORAGE_KEYS = "luxoraGuestReviews";
  const ratingButtons = [...ratingPicker.querySelectorAll("[data-rating]")];

  let selectedRating = 0;

  // The three example reviews already in about.html.
  const exampleReviews = [
    {
      name: "Sarah M.",
      rating: 5,
      text: "The atmosphere was beautiful, the room was comfortable, and every detail made the stay feel special.",
      date: "Example review",
    },
    {
      name: "Daniel R.",
      rating: 5,
      text: "A peaceful and elegant place to stay. The thoughtful service made the whole experience memorable.",
      date: "Example review",
    },
    {
      name: "Alex T.",
      rating: 5,
      text: "Beautiful interiors, a welcoming atmosphere and a wonderful place to relax and recharge.",
      date: "Example review",
    },
  ];

  //==== This function tries to get the users' feedback from localStorage.

  function getSavedReviews() {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS);

      if (!saved) return [];

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed)) return [];

      return parsed.filter(
        (review) =>
          review &&
          typeof review.name === "string" &&
          typeof review.text === "string" &&
          Number.isInteger(review.rating) &&
          review.rating >= 1 &&
          review.rating <= 5 &&
          typeof review.date === "string",
      );
    } catch (error) {
      console.error("LUXORA: Could not load saved reviews.", error);
      return [];
    }
  }
  // ====This function try to save the review of users in localstorage
  function saveReviews(reviews) {
    try {
      localStorage.setItem(STORAGE_KEYS, JSON.stringify(reviews));
      return true;
    } catch (error) {
      console.error("LUXORA: Could not save reviews.", error);
      return false;
    }
  }

  //====== This function creates five stars based on the user's rating, adds them to a container, and returns the container.

  function createStars(rating) {
    const container = document.createElement("div");
    container.className = "review-card-stars";

    container.setAttribute("aria-label", `${rating} out of 5 stars`);

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("i");

      star.className = i <= rating ? "fa-solid fa-star" : "fa-regular fa-star";

      container.appendChild(star);
    }

    return container;
  }

  //=====This function creates a review card displaying the guest's initial, name, label, quote icon, review text, and date.

  function createReviewCard(review) {
    const card = document.createElement("article");
    card.className = "review-card";

    const top = document.createElement("div");
    top.className = "review-card-top";

    const avatar = document.createElement("div");
    avatar.className = "review-avatar";
    avatar.textContent = review.name.trim().charAt(0).toUpperCase();
    avatar.setAttribute("aria-hidden", "true");

    const guest = document.createElement("div");
    guest.className = "review-guest";

    const guestName = document.createElement("h3");
    guestName.textContent = review.name;

    const guestLabel = document.createElement("span");
    guestLabel.textContent = "Guest review";

    guest.append(guestName, guestLabel);

    const quoteIcon = document.createElement("i");
    quoteIcon.className = "fa-solid fa-quote-right review-quote-icon";
    quoteIcon.setAttribute("aria-hidden", "true");

    top.append(avatar, guest, quoteIcon);

    const reviewText = document.createElement("p");
    reviewText.className = "review-text";
    reviewText.textContent = review.text;

    const date = document.createElement("span");
    date.className = "review-date";
    date.textContent = review.date;

    // Create the delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "review-delete-btn";
    deleteButton.innerHTML = '<i class="fa-solid fa-trash"></i> Delete';
    deleteButton.setAttribute("aria-label", "Delete this review");

    // Handle the delete button click
    deleteButton.addEventListener("click", async () => {
      const result = await Swal.fire({
        title: "Delete Review?",
        text: "Are you sure you want to delete this review?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#b08d57",
        cancelButtonColor: "#777777",
        reverseButtons: true,
      });

      if (!result.isConfirmed) return;

      // Get all saved reviews from localStorage
      const savedReviews = getSavedReviews();

      // Find the selected review in the saved reviews

      const index = savedReviews.findIndex(
        (item) =>
          item.name === review.name &&
          item.text === review.text &&
          item.rating === review.rating &&
          item.date === review.date,
      );

      if (index === -1) {
        await Swal.fire({
          title: "Not Found",
          text: "This review could not be found.",
          icon: "error",
          confirmButtonColor: "#b08d57",
        });
        return;
      }

      savedReviews.splice(index, 1);

      if (!saveReviews(savedReviews)) {
        await Swal.fire({
          title: "Error",
          text: "Could not delete this review.",
          icon: "error",
          confirmButtonColor: "#b08d57",
        });
        return;
      }

      renderReviews();

      await Swal.fire({
        title: "Deleted!",
        text: "Review deleted successfully.",
        icon: "success",
        confirmButtonColor: "#b08d57",
        timer: 2000,
        showConfirmButton: false,
      });
    });

    // Add all review elements to the review card
    card.append(
      top,
      createStars(review.rating),
      reviewText,
      date,
      deleteButton,
    );

    return card;
  }

  //===Update the average rating, review count, and average stars

  function updateSummary(reviews) {
    if (!averageRating || !averageStars || !reviewCount) return;

    if (reviews.length === 0) {
      averageRating.textContent = "0.0";
      reviewCount.textContent = "No reviews yet";
    } else {
      const total = reviews.reduce((sum, review) => sum + review.rating, 0);

      averageRating.textContent = (total / reviews.length).toFixed(1);

      reviewCount.textContent = `${reviews.length} ${reviews.length === 1 ? "review" : "reviews"}`;
    }

    const roundedAverage =
      reviews.length === 0
        ? 0
        : Math.round(
            reviews.reduce((sum, review) => sum + review.rating, 0) /
              reviews.length,
          );

    averageStars.replaceChildren();

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("i");

      star.className =
        i <= roundedAverage ? "fa-solid fa-star" : "fa-regular fa-star";

      averageStars.appendChild(star);
    }
  }

  // RENDER ALL REVIEWS, DISPLAY SAVED USER REVIEWS, AND UPDATE THE REVIEW SUMMARY.
  function renderReviews() {
    const savedReviews = getSavedReviews();

    // Keep the existing example cards in the HTML.
    // Add saved reviews safely using DOM elements and textContent.
    reviewsList
      .querySelectorAll(".review-card.user-review")
      .forEach((card) => card.remove());

    savedReviews.forEach((review) => {
      const card = createReviewCard(review);
      card.classList.add("user-review");
      reviewsList.appendChild(card);
    });

    updateSummary([...exampleReviews, ...savedReviews]);
  }
  // SET THE SELECTED RATING AND UPDATE THE STAR BUTTONS AND RATING HINT.
  function setRating(rating) {
    selectedRating = rating;

    ratingButtons.forEach((button) => {
      const buttonRating = Number(button.dataset.rating); //give the each button rate and change it to number
      const isActive = buttonRating <= rating;

      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(buttonRating === rating));
    });

    ratingHint.textContent = `${rating} out of 5 stars selected`;

    ratingHint.style.color = "#a7834e";
  }
  // Feedback msg تا اینجا
  function showMessage(message, type) {
    feedbackMessage.textContent = message;
    feedbackMessage.className = `feedback-message ${type}`;
  }

  ratingButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const rating = Number(button.dataset.rating);

      if (rating >= 1 && rating <= 5) {
        setRating(rating);
      }
    });
  });

  reviewForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const nameInput = document.getElementById("guestName");
    const emailInput = document.getElementById("guestEmail");
    const textInput = document.getElementById("guestFeedback");

    if (!nameInput || !emailInput || !textInput) {
      showMessage(
        "The form is incomplete. Please check the HTML fields.",
        "error",
      );
      return;
    }

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const text = textInput.value.trim();

    if (!name || !email || !text) {
      showMessage("Please complete all required fields.", "error");
      return;
    }

    if (!emailInput.validity.valid) {
      showMessage("Please enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (selectedRating < 1 || selectedRating > 5) {
      showMessage("Please select a star rating before submitting.", "error");
      ratingPicker.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      return;
    }

    const savedReviews = getSavedReviews();

    const newReview = {
      name,
      rating: selectedRating,
      text,
      date: new Date().toLocaleDateString("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    savedReviews.unshift(newReview);

    if (!saveReviews(savedReviews)) {
      showMessage(
        "Your review could not be saved in this browser. Please try again.",
        "error",
      );
      return;
    }

    renderReviews();
    reviewForm.reset();

    selectedRating = 0;

    ratingButtons.forEach((button) => {
      button.classList.remove("active");
      button.setAttribute("aria-pressed", "false");
    });

    ratingHint.textContent = "Select your rating";
    ratingHint.style.color = "";

    showMessage(
      "Thank you! Your feedback has been saved in this browser.",
      "success",
    );

    document.getElementById("reviews").scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });

  renderReviews();
});
