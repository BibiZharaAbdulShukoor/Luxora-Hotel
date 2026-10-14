/* =========================================================
   LUXORA CONTACT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTS, this section retrieves references to various DOM elements used in the contact form and modal functionality
  ======================================================= */

  const contactForm = document.getElementById("contactForm");

  const firstName = document.getElementById("firstName");
  const lastName = document.getElementById("lastName");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const subject = document.getElementById("subject");
  const message = document.getElementById("message");
  const contactTerms = document.getElementById("contactTerms");

  const characterCount = document.getElementById("characterCount");

  const successModals = document.getElementById("successModal");

  const successNames = document.getElementById("successName");

  const modalCloseIcon = document.getElementById("modalClose");

  const successBtn = document.getElementById("successButton");

  const toast = document.getElementById("toast");

  const toastMessage = document.getElementById("toastMessage");

  /* =======================================================
     LOAD USER INFORMATION, this section retrieves the current user's information from localStorage and populates the contact form fields if available
  ======================================================= */

  function loadUserInform() {
    let currentUser = null;

    try {
      const storedCurrentUser = localStorage.getItem("luxorCurrentUser");

      const storedUser = localStorage.getItem("luxorUser");

      if (storedCurrentUser) {
        currentUser = JSON.parse(storedCurrentUser);
      } else if (storedUser) {
        currentUser = JSON.parse(storedUser);
      }
    } catch (error) {
      console.error("Could not read Luxora user information:", error);
    }

    if (!currentUser) {
      return;
    }

    if (currentUser.firstName && firstName && !firstName.value) {
      firstName.value = currentUser.firstName;
    }

    if (currentUser.lastName && lastName && !lastName.value) {
      lastName.value = currentUser.lastName;
    }

    if (currentUser.email && email && !email.value) {
      email.value = currentUser.email;
    }
  }

  loadUserInform();

  /* =======================================================
     CHARACTER COUNT, this section updates the character count display for the message textarea as the user types, ensuring it does not exceed 500 characters
  ======================================================= */

  if (message && characterCount) {
    function updateCharactersCount() {
      const length = message.value.length;

      characterCount.textContent = `${length} / 500`;
    }

    message.addEventListener(
      "input",
      updateCharactersCount,
    ); /*when the user types in the message textarea, update the character count display*/

    updateCharactersCount();
  }

  /* =======================================================
     VALIDATION HELPERS, this section provides helper functions to set and clear error messages for form fields, as well as validate email and phone number formats
  ======================================================= */

  function setErrors(field, errorId, text) {
    if (!field) {
      return;
    }

    field.classList.add("input-error");

    const errorElements = document.getElementById(errorId);

    if (errorElements) {
      errorElements.textContent = text;
    }
  }

  function clearErrors(field, errorId) {
    if (!field) {
      return;
    }

    field.classList.remove("input-error");

    const errorElements = document.getElementById(errorId);

    if (errorElements) {
      errorElements.textContent = "";
    }
  }

  function clearAllErrors() {
    clearErrors(firstName, "firstNameError");

    clearErrors(lastName, "lastNameError");

    clearErrors(email, "emailError");

    clearErrors(phone, "phoneError");

    clearErrors(subject, "subjectError");

    clearErrors(message, "messageError");

    const termsErrors = document.getElementById("termsError");

    if (termsErrors) {
      termsErrors.textContent = "";
    }
  }

  function validateEmailAdd(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhoneNum(value) {
    if (!value.trim()) {
      return true;
    }

    return /^[+0-9\s\-()]{7,20}$/.test(value);
  }

  /* =======================================================
     FORM VALIDATION, this section validates the contact form fields, checking for required inputs, proper formats, and length constraints, and sets error messages accordingly
  ======================================================= */

  function validationForm() {
    clearAllErrors();

    let validate = true;

    const first = firstName.value.trim();

    const last = lastName.value.trim();

    const mailAdd = email.value.trim();

    const phoneValues = phone.value.trim();

    const selectedSubject = subject.value;

    const messageValues = message.value.trim();

    if (!first) {
      setErrors(firstName, "firstNameError", "Please enter your first name.");

      validate = false;
    }

    if (!last) {
      setErrors(lastName, "lastNameError", "Please enter your last name.");

      validate = false;
    }

    if (!mailAdd) {
      setErrors(email, "emailError", "Please enter your email address.");

      validate = false;
    } else if (!validateEmailAdd(mailAdd)) {
      setErrors(email, "emailError", "Please enter a valid email address.");

      validate = false;
    }

    if (!validatePhoneNum(phoneValues)) {
      setErrors(phone, "phoneError", "Please enter a valid phone number.");

      validate = false;
    }

    if (!selectedSubject) {
      setErrors(subject, "subjectError", "Please select a topic.");

      validate = false;
    }

    if (!messageValues) {
      setErrors(message, "messageError", "Please enter your message.");

      validate = false;
    } else if (messageValues.length < 10) {
      setErrors(
        message,
        "messageError",
        "Please write at least 10 characters.",
      );

      validate = false;
    } else if (messageValues.length > 500) {
      setErrors(
        message,
        "messageError",
        "Message cannot exceed 500 characters.",
      );

      validate = false;
    }

    if (contactTerms && !contactTerms.checked) {
      const termsError = document.getElementById("termsError");

      if (termsError) {
        termsError.textContent = "Please agree before sending your message.";
      }

      validate = false;
    }

    return validate;
  }

  /* =======================================================
     SAVE CONTACT MESSAGE, this section saves the contact form submission to localStorage, creating a message object with relevant details and storing it in an array of messages
  ======================================================= */

  function saveMessages() {
    let existingMessage = [];

    try {
      existingMessage = JSON.parse(
        localStorage.getItem("luxoraMessages") || "[]",
      );

      if (!Array.isArray(existingMessage)) {
        existingMessage = [];
      }
    } catch (error) {
      existingMessage = [];
    }

    const contactMessages = {
      id: `MSG-${Date.now()}` /*MSG- is a prefix used to indicate that the ID belongs to a message, and Date.now() provides a unique timestamp for each message*/,

      firstName: firstName.value.trim(),

      lastName: lastName.value.trim(),

      email: email.value.trim(),

      phone: phone.value.trim(),

      subject: subject.value,

      message: message.value.trim(),

      createdAt: new Date().toISOString(),

      status: "Received",
    };

    existingMessage.push(
      contactMessages,
    ); /*push adds the new contact message object to the existingMessage array, which holds all previously saved messages. This allows for multiple messages to be stored in localStorage as an array of objects.*/

    localStorage.setItem("luxoraMessages", JSON.stringify(existingMessage));
  }

  /* =======================================================
     TOAST, this section handles the display of toast notifications for user feedback
  ======================================================= */

  let toastTimer;

  function showToast(text) {
    if (!toast) {
      return;
    }

    if (toastMessage) {
      toastMessage.textContent = text;
    } else {
      toast.textContent = text;
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3500);
  }

  /* =======================================================
     SUCCESS MODAL, this section manages the display and behavior of the success modal that appears after a successful form submission
  ======================================================= */

  function openSuccessModalBox() {
    if (!successModals) {
      return;
    }

    if (successNames) {
      successNames.textContent = firstName.value.trim() || "Guest";
    }

    successModals.classList.add("show");

    document.body.style.overflow = "hidden";
  }

  function closeSuccessModalBox() {
    if (!successModals) {
      return;
    }

    successModals.classList.remove("show");

    document.body.style.overflow = "";
  }

  if (modalCloseIcon) {
    modalCloseIcon.addEventListener("click", closeSuccessModalBox);
  }

  if (successBtn) {
    successBtn.addEventListener("click", () => {
      closeSuccessModalBox();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (successModals) {
    successModals.addEventListener("click", (event) => {
      if (event.target.classList.contains("success-backdrop")) {
        closeSuccessModalBox();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSuccessModalBox();
    }
  });

  /* =======================================================
     FORM SUBMIT, this section handles the form submission event, performing validation, saving the message, showing feedback, and resetting the form
  ======================================================= */

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validationForm()) {
        showToast("Please check the highlighted fields.");

        return;
      }

      saveMessages();

      showToast("Your message has been received.");

      openSuccessModalBox();

      contactForm.reset();

      if (characterCount) {
        characterCount.textContent = "0 / 500";
      }
    });
  }

  /* =======================================================
     LIVE ERROR REMOVAL, this section adds event listeners to form fields to clear error messages as the user types or changes input, providing immediate feedback and improving user experience
  ======================================================= */

  const ClearFieldsErrorMsgs = [
    [firstName, "firstNameError"],
    [lastName, "lastNameError"],
    [email, "emailError"],
    [phone, "phoneError"],
    [subject, "subjectError"],
    [message, "messageError"],
  ];

  ClearFieldsErrorMsgs.forEach(([field, errorId]) => {
    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      if (field.value.trim()) {
        clearErrors(field, errorId);
      }
    });

    field.addEventListener("change", () => {
      if (field.value.trim()) {
        clearErrors(field, errorId);
      }
    });
  });

  if (contactTerms) {
    contactTerms.addEventListener("change", () => {
      if (contactTerms.checked) {
        const termsError = document.getElementById("termsError");

        if (termsError) {
          termsError.textContent = "";
        }
      }
    });
  }

  /* =======================================================
     SCROLL REVEAL, This section uses IntersectionObserver to reveal elements with the "reveal" class when they come into view.
  ======================================================= */

  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      /*intersectionObserver is a built-in browser API that allows you to observe changes in the intersection of a target element with an ancestor element or with a top-level document's viewport. 
      It is used here to detect when elements with the "reveal" class come into view, allowing for animations or other effects to be triggered as the user scrolls through the page.*/ (
        entries,
      ) => {
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
});
