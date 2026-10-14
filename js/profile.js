document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     ELEMENTS, the elements are selected from the DOM and stored in variables for later use
  ========================================================= */

  const cancelBookingButton = document.getElementById("cancelBookingBtn");

  const bookingContents = document.getElementById("bookingContent");

  const emptyBooking = document.getElementById("emptyBooking");

  const toastMsg = document.getElementById("toast");

  /* =========================================================
     AUTH CHECK, if the user is not logged in, they will be redirected to the login page
  ========================================================= */

  const loggedInPart =
    localStorage.getItem("guestLoggedIn") ===
    "true"; /* get the login status from local storage */

  if (!loggedInPart) {
    window.location.href = "login.html";
    return;
  }

  /* =========================================================
     USER DATA, the user data is retrieved from local storage and parsed into a JavaScript object
  ========================================================= */

  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("luxorCurrentUser"));
  } catch (error) {
    currentUser = null;
  }

  const storedUsers = localStorage.getItem("luxorUser");

  /* =========================================================
     LOAD USER, if the user data is not found in local storage, a default user object is created
  ========================================================= */

  let userInfo = currentUser;

  if (!userInfo && storedUsers) {
    try {
      userInfo = JSON.parse(storedUsers);
      /* json.parse changes the string into a JavaScript object */
    } catch (error) {
      userInfo = null;
    }
  }

  if (!userInfo) {
    userInfo = {
      firstName: "Guest",
      lastName: "" /* if the last name exist use it not let it be empty */,
      email: "guest@example.com",
    };
  }

  const firstName = userInfo.firstName || "Guest";

  const lastName = userInfo.lastName || "";

  const fullName = `${firstName} ${lastName}`.trim();

  const email = userInfo.email || "guest@example.com";

  /* =========================================================
     DISPLAY USER, the user data is displayed in the profile page
  ========================================================= */

  const userName = document.getElementById("userName");

  const userEmail = document.getElementById("userEmail");

  const accountAvatar = document.getElementById("accountAvatar");

  const sideUserName = document.getElementById("sideUserName");

  const sideUserEmail = document.getElementById("sideUserEmail");

  const memberSince = document.getElementById("memberSince");

  if (userName) {
    /* if the userName element exists, set its text content to the full name of the user */
    userName.textContent =
      fullName; /* it puts the full name of the user in the profile page */
  }

  if (userEmail) {
    userEmail.textContent = email;
  }

  if (sideUserName) {
    sideUserName.textContent = fullName;
  }

  if (sideUserEmail) {
    sideUserEmail.textContent = email;
  }

  if (accountAvatar) {
    accountAvatar.textContent = firstName.charAt(0).toUpperCase();
  }

  /* =========================================================
     MEMBER SINCE, the date the user created their account is displayed in the profile page
  ========================================================= */

  let createdDate = null;

  if (
    userInfo.createdAt
  ) /* if the userInfo object has a createdAt property, create a new Date object from it */ {
    createdDate = new Date(userInfo.createdAt);
  }

  if (!createdDate || Number.isNaN(createdDate.getTime())) {
    createdDate = new Date();
  }

  if (memberSince) {
    memberSince.textContent = createdDate.toLocaleDateString("en-US", {
      /* tolocaleDateString formats the date into a human-readable string */
      month: "long",
      year: "numeric",
    });
  }

  /* =========================================================
     BOOKING DATA , the booking data is retrieved from local storage and parsed into a JavaScript object
  ========================================================= */

  let booking = null;

  try {
    const storedBooking =
      localStorage.getItem(
        "luxoraBooking",
      ); /* get the booking data from local storage */

    if (storedBooking) {
      booking = JSON.parse(storedBooking);
    }
  } catch (error) {
    booking = null;
  }

  /* =========================================================
     ROOM IMAGES, the images for each room type are stored in an object for easy access
  ========================================================= */

  const roomImages = {
    "grand-suite": "../images/landing-page-photo/room-2.jpeg",

    "terrace-room": "../images/landing-page-photo/room-3.jpeg",

    "city-residence": "../images/landing-page-photo/room-4.jpeg",

    "presidential-suite": "../images/landing-page-photo/room-6.jpeg",

    "deluxe-room": "../images/landing-page-photo/room-1.jpeg",

    "family-residence": "../images/landing-page-photo/room-5.jpeg",
  };

  /* =========================================================
     FORMAT DATE, the date is formatted into a human-readable string for display in the booking details
  ========================================================= */

  function formatDate(dateValue) {
    /*when we call this function we pass in a date value and it returns a formatted date string */
    if (!dateValue) {
      return "—";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      /* if the date is invalid, return the original value */
      return dateValue;
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
  /* =======================================================
       DATES, the check-in and check-out dates are displayed in the booking details
    ======================================================= */

  const bookingCheckIn = document.getElementById("bookingCheckIn");

  const bookingCheckOut = document.getElementById("bookingCheckOut");

  if (bookingCheckIn) {
    bookingCheckIn.textContent = formatDate(booking.checkIn);
  }

  if (bookingCheckOut) {
    bookingCheckOut.textContent = formatDate(booking.checkOut);
  }

  /* =========================================================
     FORMAT MONEY, the price is formatted into a currency string for display in the booking details
  ========================================================= */

  function formatMoney(value) {
    const number = Number(value) || 0;

    return `$${number.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  }

  /* =======================================================
       PRICE, the nightly rate and total price are displayed in the booking details
    ======================================================= */

  const nightlyRate = Number(
    booking.nightlyRate || booking.price || booking.roomPrice || 0,
  );

  const total = Number(
    booking.total || booking.totalPrice || nightlyRate * nights,
  );

  const bookingNightlyRate = document.getElementById("bookingNightlyRate");

  const bookingTotal = document.getElementById("bookingTotal");

  if (bookingNightlyRate) {
    bookingNightlyRate.textContent = formatMoney(nightlyRate);
  }

  if (bookingTotal) {
    bookingTotal.textContent = formatMoney(total);
  }
  /* =========================================================
     DISPLAY BOOKING, the booking details are displayed in the profile page, if there is no booking, a message is shown instead
  ========================================================= */

  function displayBooking() {
    if (!booking) {
      if (bookingContents) {
        bookingContents.hidden = true;
      }

      if (emptyBooking) {
        emptyBooking.hidden = false;
      }

      return;
    }

    if (bookingContents) {
      bookingContents.hidden = false;
    }

    if (emptyBooking) {
      emptyBooking.hidden = true;
    }

    /* =======================================================
       ROOM NAME, the name of the room is displayed in the booking details
    ======================================================= */

    const roomName = booking.roomName || booking.room || "Luxury Suite";

    const roomNameElement = document.getElementById("bookingRoomName");

    if (roomNameElement) {
      roomNameElement.textContent = roomName;
    }

    /* =======================================================
       CONFIRMATION, the confirmation number is displayed in the booking details
    ======================================================= */

    const confirmation =
      booking.confirmation || booking.confirmationNumber || "LUX-000000";

    const confirmationElement = document.getElementById("bookingConfirmation");

    if (confirmationElement) {
      confirmationElement.textContent = `Confirmation: ${confirmation}`;
    }

    /* =======================================================
       IMAGE, the image of the room is displayed in the booking details, if there is no image, a default image is used
    ======================================================= */

    const roomImage = document.getElementById("bookingRoomImage");

    const image =
      booking.image ||
      roomImages[booking.roomId] ||
      roomImages[booking.room] ||
      roomImages["grand-suite"];

    if (roomImage) {
      roomImage.src = image;
      roomImage.alt = roomName;
    }

    /* =======================================================
       GUESTS, the number of guests is displayed in the booking details
    ======================================================= */

    const adults = Number(booking.adults) || 0;

    const children = Number(booking.children) || 0;

    let guestText = `${adults} Adult`;

    if (adults !== 1) {
      guestText = `${adults} Adults`;
    }

    if (children > 0) {
      guestText += `, ${children} ${children === 1 ? "Child" : "Children"}`;
    }

    const bookingGuests = document.getElementById("bookingGuests");

    if (bookingGuests) {
      bookingGuests.textContent = guestText;
    }

    /* =======================================================
       NIGHTS, the number of nights is calculated and displayed in the booking details, if the check-in and check-out dates are provided
    ======================================================= */

    let nights = Number(booking.nights) || 0;

    if (nights <= 0 && booking.checkIn && booking.checkOut) {
      const checkIn = new Date(booking.checkIn);

      const checkOut = new Date(booking.checkOut);

      const difference = checkOut - checkIn;

      nights = Math.ceil(
        difference / (1000 * 60 * 60 * 24),
      ); /* math.ceil is a method that rounds up the number of nights to the nearest whole number */
    }

    if (nights < 1) {
      nights = 1;
    }

    const bookingNights = document.getElementById("bookingNights");

    if (bookingNights) {
      bookingNights.textContent = `${nights} ${
        nights === 1 ? "Night" : "Nights"
      }`;
    }

    /* =======================================================
       SPECIAL REQUEST, the special requests are displayed in the booking details, if there are no special requests, a message is shown instead
    ======================================================= */

    const request = booking.specialRequests || booking.specialRequest || "";

    const requestElement = document.getElementById("bookingRequest");

    if (requestElement) {
      if (request.trim()) {
        requestElement.textContent = request;
      } else {
        requestElement.textContent = "No special requests.";
      }
    }

    /* =======================================================
       STATUS, the status of the booking is displayed in the booking details, if there is no status, a default status is used
    ======================================================= */

    const status = document.getElementById("bookingStatus");

    if (status) {
      status.textContent = booking.status || "Confirmed";
    }
  }
  /* PAYMENT DETAILS */

  const paymentTotalElement = document.getElementById("profilePaymentTotal");

  const depositElement = document.getElementById("profileDepositAmount");

  const remainingElement = document.getElementById("profileRemainingAmount");

  const paymentStatusElement = document.getElementById("profilePaymentStatus");

  /* GET SAVED PAYMENT AMOUNTS */

  const totalAmount = Number(booking.total || booking.totalPrice || 0);

  const deposit = Number(booking.depositAmount ?? totalAmount * 0.1);

  const remaining = Number(booking.remainingAmount ?? totalAmount - deposit);

  /* FORMAT AND DISPLAY AMOUNTS */

  if (paymentTotalElement) {
    paymentTotalElement.textContent = formatMoney(totalAmount);
  }

  if (depositElement) {
    depositElement.textContent = formatMoney(deposit);
  }

  if (remainingElement) {
    remainingElement.textContent = formatMoney(remaining);
  }

  /* PAYMENT STATUS */

  if (paymentStatusElement) {
    paymentStatusElement.textContent = booking.paymentStatus || "Pending";
  }
  displayBooking();

  /* =========================================================
     CANCEL BOOKING, the cancel booking button removes the booking data from local storage and updates the display, if there is no booking, the button does nothing
  ========================================================= */
  if (cancelBookingButton) {
    cancelBookingButton.addEventListener("click", async () => {
      if (!booking) {
        return;
      }

      const result = await Swal.fire({
        /*fire is a method from the sweetalert2 library that creates a popup modal */
        title: "Cancel Reservation?",
        text: "Are you sure you want to cancel this reservation?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, cancel it",
        cancelButtonText: "Keep Reservation",
        confirmButtonColor: "#d33",
        cancelButtonColor: "#c5a469",
      });

      if (!result.isConfirmed) {
        return;
      }

      localStorage.removeItem("luxoraBooking");

      booking = null;

      displayBooking();

      Swal.fire({
        title: "Cancelled!",
        text: "Your reservation has been cancelled.",
        icon: "success",
        confirmButtonColor: "#b08d57",
      });
    });
  }

  /* =========================================================
     TOAST, the toast message will appear when the user cancels a booking
  ========================================================= */

  let toastTimer;

  function showToast(message) {
    if (!toastMsg) {
      return;
    }

    toastMsg.textContent = message;

    toastMsg.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastMsg.classList.remove("show");
    }, 2500);
  }

  /* =========================================================
     SCROLL REVEAL, the elements will appear with a fade-in effect when the user scrolls down the page
  ========================================================= */

  const revealElm = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
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

    revealElm.forEach((element) => {
      observer.observe(element);
    });
  } else {
    revealElm.forEach((element) => {
      element.classList.add("visible");
    });
  }
});
