/* =========================================================
   LUXORA BOOKING
========================================================= */

/* =========================================================
   ELEMENTS, this section contains all the elements used in the booking form and summary
========================================================= */

const bookingForm = document.getElementById("bookingForm");

const ourRoom = document.getElementById("room");

const checkInPart = document.getElementById("checkIn");

const checkOutPart = document.getElementById("checkOut");

const adults = document.getElementById("adults");

const children = document.getElementById("children");

const guestFirstName = document.getElementById("firstName");

const guestLastName = document.getElementById("lastName");

const guestEmail = document.getElementById("email");

const guestPhone = document.getElementById("phone");

const requests = document.getElementById("requests");

/* =========================================================
 This function try to get the name, last name and email from login information to fill out in the form of reservation 
========================================================= */

function loadBookingUserInformation() {
  const isLoggedIn = localStorage.getItem("guestLoggedIn");

  const savedUser = localStorage.getItem("luxorCurrentUser");

  if (isLoggedIn !== "true" || !savedUser) {
    window.location.href = "login.html";
    return;
  }

  const user = JSON.parse(savedUser);

  if (guestFirstName) {
    guestFirstName.value = user.firstName || "";
    guestFirstName.readOnly = true;
  }

  if (guestLastName) {
    guestLastName.value = user.lastName || "";
    guestLastName.readOnly = true;
  }

  if (guestEmail) {
    guestEmail.value = user.email || "";
    guestEmail.readOnly = true;
  }
}

loadBookingUserInformation();

/* =========================================================
   SUMMARY ELEMENTS, this section contains all the elements used in the booking summary
========================================================= */

const summaryOfRoom = document.getElementById("summaryRoom");

const summaryOfImage = document.getElementById("summaryImage");

const summaryOfCheckIn = document.getElementById("summaryCheckIn");

const summaryOfCheckOut = document.getElementById("summaryCheckOut");

const summaryOfGuests = document.getElementById("summaryGuests");

const nightlyPrice = document.getElementById("nightlyPrice");

const totalOfNights = document.getElementById("totalNights");

const totalOfPrice = document.getElementById("totalPrice");
/* =========================================================
Deposit 
========================================================= */

const paymentTotal = document.getElementById("paymentTotal");

const depositAmount = document.getElementById("depositAmount");

const remainingAmount = document.getElementById("remainingAmount");

const paymentMethod = document.querySelector(
  'input[name="paymentMethod"]:checked',
);

/* =========================================================
   ROOM IMAGES, in this section we define the images for each room type
========================================================= */

const roomImgs = {
  "Grand Luxury Suite": "../images/landing-page-photo/room-2.jpeg",

  "Terrace Room": "../images/landing-page-photo/room-3.jpeg",

  "City Residence": "../images/landing-page-photo/room-4.jpeg",

  "Presidential Suite": "../images/landing-page-photo/room-6.jpeg",

  "Deluxe King Room": "../images/landing-page-photo/room-1.jpeg",

  "Family Residence": "../images/landing-page-photo/room-5.jpeg",
};

/* =========================================================
   ROOM IDs, in this section we define the IDs for each room type
========================================================= */

const roomIds = {
  "Grand Luxury Suite": "grand-suite",

  "Terrace Room": "terrace-room",

  "City Residence": "city-residence",

  "Presidential Suite": "presidential-suite",

  "Deluxe King Room": "deluxe-room",

  "Family Residence": "family-residence",
};

/* =========================================================
   DATE SETUP, this section sets the minimum date for check-in and check-out to today
========================================================= */

const todayDate = new Date();

const todayString = todayDate.toISOString().split("T")[0];

if (checkInPart) {
  checkInPart.min = todayString;
}

if (checkOutPart) {
  checkOutPart.min = todayString;
}

/* =========================================================
   URL ROOM, this section checks the URL for a room parameter and sets the room selection accordingly
========================================================= */

const parameter = new URLSearchParams(window.location.search);

const roomParameter = parameter.get("room");

const roomMaps = {
  "grand-suite": "Grand Luxury Suite",

  "terrace-room": "Terrace Room",

  "city-residence": "City Residence",

  "presidential-suite": "Presidential Suite",

  "deluxe-room": "Deluxe King Room",

  "family-residence": "Family Residence",
};

if (roomParameter && roomMaps[roomParameter] && ourRoom) {
  ourRoom.value = roomMaps[roomParameter];
}

/* =========================================================
   DATE FORMAT, this section formats the date to a more readable format for the summary section
========================================================= */

function formatDate(myDate) {
  if (!myDate) {
    return "—";
  }

  const date = new Date(myDate + "T00:00:00");

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/* =========================================================
   CALCULATE NIGHTS, this section calculates the number of nights between check-in and check-out dates and show for us in the summary section
========================================================= */

function calculatingNight() {
  if (
    !checkInPart ||
    !checkOutPart ||
    !checkInPart.value ||
    !checkOutPart.value
  ) {
    return 0;
  }

  const startDate = new Date(checkInPart.value + "T00:00:00");

  const endDate = new Date(checkOutPart.value + "T00:00:00");

  const difference = endDate.getTime() - startDate.getTime();

  const totalNights = Math.ceil(difference / (1000 * 60 * 60 * 24));

  return totalNights > 0 ? totalNights : 0;
}

/* =========================================================
   GET SELECTED ROOM, this section retrieves the selected room data including name, price, and ID for use in the summary and booking process
========================================================= */

function catchSelectedRoomData() {
  if (!ourRoom) {
    return {
      name: "Select a suite",
      price: 0,
      id: "",
    };
  }

  const selected = ourRoom.options[ourRoom.selectedIndex];

  if (!selected || !selected.value) {
    return {
      name: "Select a suite",
      price: 0,
      id: "",
    };
  }

  const roomNames = selected.value;

  const price = selected.dataset.price ? Number(selected.dataset.price) : 0;

  const findIdRooms = roomIds[roomNames] || roomParameter || "";

  return {
    name: roomNames,
    price: price,
    id: findIdRooms,
  };
}

/* =========================================================
   UPDATE SUMMARY, this section updates the booking summary with the selected room, dates, guests, and total price
========================================================= */

function updateSummaryPart() {
  if (!ourRoom) {
    return;
  }

  const selectedRooms = catchSelectedRoomData();

  const nights = calculatingNight();

  /* ROOM */

  if (summaryOfRoom) {
    summaryOfRoom.textContent = selectedRooms.name;
  }

  /* DATES */

  if (summaryOfCheckIn) {
    summaryOfCheckIn.textContent = formatDate(
      checkInPart ? checkInPart.value : "",
    );
  }

  if (summaryOfCheckOut) {
    summaryOfCheckOut.textContent = formatDate(
      checkOutPart ? checkOutPart.value : "",
    );
  }

  /* GUESTS */

  const adultCount = Number(adults?.value) || 0;

  const childCount = Number(children?.value) || 0;

  let guestsText = `${adultCount} Adult${adultCount !== 1 ? "s" : ""}`;

  if (childCount > 0) {
    guestsText += `, ${childCount} Child${childCount !== 1 ? "ren" : ""}`;
  }

  if (summaryOfGuests) {
    summaryOfGuests.textContent = guestsText;
  }

  /* NIGHTLY PRICE */

  if (nightlyPrice) {
    nightlyPrice.textContent = selectedRooms.price.toLocaleString("en-US");
  }

  /* NIGHTS */

  if (totalOfNights) {
    totalOfNights.textContent = nights;
  }

  /* TOTAL */

  const totalAmount = selectedRooms.price * nights;

  /* PAYMENT CALCULATION */

  const deposit = Math.round(totalAmount * 10) / 100;

  const remaining = totalAmount - deposit;

  /* DISPLAY PAYMENT AMOUNTS */

  if (paymentTotal) {
    paymentTotal.textContent = `$${totalAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (depositAmount) {
    depositAmount.textContent = `$${deposit.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (remainingAmount) {
    remainingAmount.textContent = `$${remaining.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  if (totalOfPrice) {
    totalOfPrice.textContent = totalAmount.toLocaleString("en-US");
  }

  /* IMAGE */

  if (summaryOfImage && roomImgs[selectedRooms.name]) {
    summaryOfImage.src = roomImgs[selectedRooms.name];

    summaryOfImage.alt = selectedRooms.name;
  }
}

/* =========================================================
   ROOM CHANGE, this section listens for changes in the room selection and updates the summary accordingly
========================================================= */

if (ourRoom) {
  ourRoom.addEventListener("change", updateSummaryPart);
}

/* =========================================================
   CHECK-IN CHANGE, this section listens for changes in the check-in date and 
   updates the summary and check-out minimum date accordingly inn the summary section
========================================================= */

if (checkInPart) {
  checkInPart.addEventListener("change", () => {
    if (checkInPart.value && checkOutPart) {
      checkOutPart.min = checkInPart.value;

      if (checkOutPart.value && checkOutPart.value <= checkInPart.value) {
        checkOutPart.value = "";
      }
    }

    updateSummaryPart();
  });
}

/* =========================================================
   CHECK-OUT CHANGE, this section listens for changes in the check-out date and updates the summary accordingly
========================================================= */

if (checkOutPart) {
  checkOutPart.addEventListener("change", updateSummaryPart);
}

/* =========================================================
   GUEST CHANGE, this section listens for changes in the number of adults and children and updates the summary accordingly
========================================================= */

if (adults) {
  adults.addEventListener("change", updateSummaryPart);
}

if (children) {
  children.addEventListener("change", updateSummaryPart);
}

/* =========================================================
   VALIDATION, this section handles the validation of the booking form inputs and displays error messages accordingly
========================================================= */

function clearErrors() {
  document.querySelectorAll(".error").forEach((error) => {
    error.textContent = "";
  });

  document.querySelectorAll(".input-error").forEach((input) => {
    input.classList.remove("input-error");
  });
}

function showError(input, errorElement, message) {
  if (input) {
    input.classList.add("input-error");
  }

  if (errorElement) {
    errorElement.textContent = message;
  }
}

function validateForms() {
  clearErrors();

  let valid = true;

  /* ROOM */

  if (!ourRoom || !ourRoom.value) {
    showError(
      ourRoom,
      document.getElementById("roomError"),
      "Please select a suite.",
    );

    valid = false;
  }

  /* CHECK-IN */

  if (!checkInPart || !checkInPart.value) {
    showError(
      checkInPart,
      document.getElementById("checkInError"),
      "Please select your check-in date.",
    );

    valid = false;
  }

  /* CHECK-OUT */

  if (!checkOutPart || !checkOutPart.value) {
    showError(
      checkOutPart,
      document.getElementById("checkOutError"),
      "Please select your check-out date.",
    );

    valid = false;
  }

  /* DATE ORDER */

  const nights = calculatingNight();

  if (
    checkInPart &&
    checkOutPart &&
    checkInPart.value &&
    checkOutPart.value &&
    nights <= 0
  ) {
    showError(
      checkOutPart,
      document.getElementById("checkOutError"),
      "Check-out must be after check-in.",
    );

    valid = false;
  }

  /* FIRST NAME */

  if (!guestFirstName || !guestFirstName.value.trim()) {
    showError(
      guestFirstName,
      document.getElementById("firstNameError"),
      "Please enter your first name.",
    );

    valid = false;
  }

  /* LAST NAME */

  if (!guestLastName || !guestLastName.value.trim()) {
    showError(
      guestLastName,
      document.getElementById("lastNameError"),
      "Please enter your last name.",
    );

    valid = false;
  }

  /* EMAIL */

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!guestEmail || !guestEmail.value.trim()) {
    showError(
      guestEmail,
      document.getElementById("emailError"),
      "Please enter your email address.",
    );

    valid = false;
  } else if (!emailPattern.test(guestEmail.value.trim())) {
    showError(
      guestEmail,
      document.getElementById("emailError"),
      "Please enter a valid email address.",
    );

    valid = false;
  }

  /* PHONE */

  if (!guestPhone || !guestPhone.value.trim()) {
    showError(
      guestPhone,
      document.getElementById("phoneError"),
      "Please enter your phone number in the format (XXX) XXX-XXXX.",
    );

    valid = false;
  }

  /* TERMS */

  const termBox = document.getElementById("terms");

  if (termBox && !termBox.checked) {
    const termsError = document.getElementById("termsError");

    if (termsError) {
      termsError.textContent = "Please check mark the reservation terms.";
    }

    valid = false;
  }

  return valid;
}

/* =========================================================
   CONFIRMATION NUMBER, this section generates a random confirmation number for the booking
========================================================= */

function generateConfirmationNumber() {
  const random = Math.floor(100000 + Math.random() * 900000);

  return `LUX-${random}`;
}

/* =========================================================
   SUBMIT BOOKING, this section handles the submission of the booking form, validates the inputs, 
   saves the booking and user information to localStorage, and displays a confirmation modal
========================================================= */

if (bookingForm) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForms()) {
      showToast("Please first complete the required fields.");

      return;
    }
    /* CHECK PAYMENT METHOD */

    const selectedPaymentMethod = document.querySelector(
      'input[name="paymentMethod"]:checked',
    );

    if (!selectedPaymentMethod) {
      showToast("Please select a payment method.");
      return;
    }

    const selectedRooms = catchSelectedRoomData();

    const nights = calculatingNight();

    /* CALCULATE PAYMENT*/

    const totalAmount = selectedRooms.price * nights;

    const deposit = Math.round(totalAmount * 10) / 100;

    const remaining = totalAmount - deposit;

    /* DEMO PAYMENT STATUS */

    const paymentStatus = "Demo Paid";

    const balanceStatus = "Pay at Hotel";

    const confirmation = generateConfirmationNumber();

    const adultCount =
      Number(adults?.value) || 0; /*change the value of adults to number*/

    const childrenCount = Number(children?.value) || 0;

    const booking = {
      /* IDENTIFICATION */

      confirmation: confirmation,

      status: "Confirmed",

      /* ROOM */

      roomId: selectedRooms.id,

      room: selectedRooms.name,

      roomName: selectedRooms.name,

      image:
        roomImgs[selectedRooms.name] ||
        "" /*if the room name is not found in the roomImgs object, it will return an empty string*/,

      /* PRICE */

      price: selectedRooms.price,

      nightlyRate: selectedRooms.price,

      /* DATES */

      checkIn: checkInPart.value,

      checkOut: checkOutPart.value,

      nights: nights,

      /* GUESTS */

      adults: adultCount,

      children: childrenCount,

      /* GUEST INFORMATION */

      firstName: guestFirstName.value.trim(),

      lastName: guestLastName.value.trim(),

      email: guestEmail.value.trim(),

      phone: guestPhone.value.trim(),

      /* REQUESTS */

      requests: requests ? requests.value.trim() : "",

      specialRequests: requests ? requests.value.trim() : "",

      /* TOTAL AND PAYMENT این */

      total: totalAmount,

      depositPercentage: 10,

      depositAmount: deposit,

      remainingAmount: remaining,

      paymentMethod: selectedPaymentMethod.value,

      paymentStatus: paymentStatus,

      balanceStatus: balanceStatus,

      paidAt: new Date().toISOString(),

      /* CREATED */

      createdAt:
        new Date().toISOString() /* Store the current date and time in ISO format */,
    };

    /* =====================================================
       SAVE BOOKING, this section saves the booking information to localStorage for later retrieval
    ====================================================== */

    localStorage.setItem(
      "luxoraBooking",
      JSON.stringify(booking),
    ); /* json.stringify() is used to convert the booking object into a JSON string before storing it in localStorage */

    /* =====================================================
       LOGGED-IN STATE, this section sets a flag in localStorage to indicate that the guest is logged in
    ====================================================== */

    localStorage.setItem("guestLoggedIn", "true");

    /* =====================================================
       CONFIRMATION Page, this section displays a confirmation modal with the booking confirmation number and prevents scrolling on the main page
    ====================================================== */

    const confirmationNum = document.getElementById("confirmationNumber");

    if (confirmationNum) {
      confirmationNum.textContent = confirmation;
    }

    const successModals = document.getElementById("successModal");

    if (successModals) {
      successModals.classList.add("open");

      document.body.style.overflow =
        "hidden"; /* Prevent scrolling on the main page when the modal is open */
    }
  });
}

/* =========================================================
   MODAL, this section handles the opening and closing of the confirmation modal, including clicking outside the modal to close it
========================================================= */

const successModals = document.getElementById("successModal");

const modalClose = document.getElementById("modalClose");

function closeModal() {
  if (successModals) {
    successModals.classList.remove("open");
  }

  document.body.style.overflow =
    ""; /* Restore scrolling on the main page when the modal is closed */
}

if (modalClose) {
  modalClose.addEventListener("click", closeModal);
}

if (successModals) {
  successModals.addEventListener("click", (event) => {
    if (event.target === successModals) {
      /* Check if the click is outside the modal content */
      closeModal();
    }
  });
}

/* =========================================================
   TOAST, this section handles the toast notifications for user feedback
========================================================= */

const toastMsg = document.getElementById("toast");

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
   SCROLL REVEAL, this section handles the reveal animations for elements as they come into view 
========================================================= */

const revealElements = document.querySelectorAll(".reveal");

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

  revealElements.forEach((element) => {
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("visible");
  });
}

/* =========================================================
   INITIALIZE
========================================================= */

updateSummaryPart();
