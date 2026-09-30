/* =========================================================
   LUXORA CONTACT PAGE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  /* =======================================================
     ELEMENTS
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

  const successModal = document.getElementById("successModal");

  const successName = document.getElementById("successName");

  const modalClose = document.getElementById("modalClose");

  const successButton = document.getElementById("successButton");

  const toast = document.getElementById("toast");

  const toastMessage = document.getElementById("toastMessage");

  /* =======================================================
     LOAD USER INFORMATION
  ======================================================= */

  function loadUserInformation() {
    let currentUser = null;

    try {
      const storedCurrentUser = localStorage.getItem("luxoraCurrentUser");

      const storedUser = localStorage.getItem("luxoraUser");

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

  loadUserInformation();

  /* =======================================================
     CHARACTER COUNT
  ======================================================= */

  if (message && characterCount) {
    function updateCharacterCount() {
      const length = message.value.length;

      characterCount.textContent = `${length} / 500`;
    }

    message.addEventListener("input", updateCharacterCount);

    updateCharacterCount();
  }

  /* =======================================================
     VALIDATION HELPERS
  ======================================================= */

  function setError(field, errorId, text) {
    if (!field) {
      return;
    }

    field.classList.add("input-error");

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = text;
    }
  }

  function clearError(field, errorId) {
    if (!field) {
      return;
    }

    field.classList.remove("input-error");

    const errorElement = document.getElementById(errorId);

    if (errorElement) {
      errorElement.textContent = "";
    }
  }

  function clearAllErrors() {
    clearError(firstName, "firstNameError");

    clearError(lastName, "lastNameError");

    clearError(email, "emailError");

    clearError(phone, "phoneError");

    clearError(subject, "subjectError");

    clearError(message, "messageError");

    const termsError = document.getElementById("termsError");

    if (termsError) {
      termsError.textContent = "";
    }
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validatePhone(value) {
    if (!value.trim()) {
      return true;
    }

    return /^[+0-9\s\-()]{7,20}$/.test(value);
  }

  /* =======================================================
     FORM VALIDATION
  ======================================================= */

  function validateForm() {
    clearAllErrors();

    let valid = true;

    const first = firstName.value.trim();

    const last = lastName.value.trim();

    const mail = email.value.trim();

    const phoneValue = phone.value.trim();

    const selectedSubject = subject.value;

    const messageValue = message.value.trim();

    if (!first) {
      setError(firstName, "firstNameError", "Please enter your first name.");

      valid = false;
    }

    if (!last) {
      setError(lastName, "lastNameError", "Please enter your last name.");

      valid = false;
    }

    if (!mail) {
      setError(email, "emailError", "Please enter your email address.");

      valid = false;
    } else if (!validateEmail(mail)) {
      setError(email, "emailError", "Please enter a valid email address.");

      valid = false;
    }

    if (!validatePhone(phoneValue)) {
      setError(phone, "phoneError", "Please enter a valid phone number.");

      valid = false;
    }

    if (!selectedSubject) {
      setError(subject, "subjectError", "Please select a topic.");

      valid = false;
    }

    if (!messageValue) {
      setError(message, "messageError", "Please enter your message.");

      valid = false;
    } else if (messageValue.length < 10) {
      setError(message, "messageError", "Please write at least 10 characters.");

      valid = false;
    } else if (messageValue.length > 500) {
      setError(
        message,
        "messageError",
        "Message cannot exceed 500 characters.",
      );

      valid = false;
    }

    if (contactTerms && !contactTerms.checked) {
      const termsError = document.getElementById("termsError");

      if (termsError) {
        termsError.textContent = "Please agree before sending your message.";
      }

      valid = false;
    }

    return valid;
  }

  /* =======================================================
     SAVE CONTACT MESSAGE
  ======================================================= */

  function saveMessage() {
    let existingMessages = [];

    try {
      existingMessages = JSON.parse(
        localStorage.getItem("luxoraMessages") || "[]",
      );

      if (!Array.isArray(existingMessages)) {
        existingMessages = [];
      }
    } catch (error) {
      existingMessages = [];
    }

    const contactMessage = {
      id: `MSG-${Date.now()}`,

      firstName: firstName.value.trim(),

      lastName: lastName.value.trim(),

      email: email.value.trim(),

      phone: phone.value.trim(),

      subject: subject.value,

      message: message.value.trim(),

      createdAt: new Date().toISOString(),

      status: "Received",
    };

    existingMessages.push(contactMessage);

    localStorage.setItem("luxoraMessages", JSON.stringify(existingMessages));
  }

  /* =======================================================
     TOAST
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
     SUCCESS MODAL
  ======================================================= */

  function openSuccessModal() {
    if (!successModal) {
      return;
    }

    if (successName) {
      successName.textContent = firstName.value.trim() || "Guest";
    }

    successModal.classList.add("show");

    document.body.style.overflow = "hidden";
  }

  function closeSuccessModal() {
    if (!successModal) {
      return;
    }

    successModal.classList.remove("show");

    document.body.style.overflow = "";
  }

  if (modalClose) {
    modalClose.addEventListener("click", closeSuccessModal);
  }

  if (successButton) {
    successButton.addEventListener("click", () => {
      closeSuccessModal();

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  if (successModal) {
    successModal.addEventListener("click", (event) => {
      if (event.target.classList.contains("success-backdrop")) {
        closeSuccessModal();
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeSuccessModal();
    }
  });

  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateForm()) {
        showToast("Please check the highlighted fields.");

        return;
      }

      saveMessage();

      showToast("Your message has been received.");

      openSuccessModal();

      contactForm.reset();

      if (characterCount) {
        characterCount.textContent = "0 / 500";
      }
    });
  }

  /* =======================================================
     LIVE ERROR REMOVAL
  ======================================================= */

  const fields = [
    [firstName, "firstNameError"],
    [lastName, "lastNameError"],
    [email, "emailError"],
    [phone, "phoneError"],
    [subject, "subjectError"],
    [message, "messageError"],
  ];

  fields.forEach(([field, errorId]) => {
    if (!field) {
      return;
    }

    field.addEventListener("input", () => {
      if (field.value.trim()) {
        clearError(field, errorId);
      }
    });

    field.addEventListener("change", () => {
      if (field.value.trim()) {
        clearError(field, errorId);
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
     SCROLL REVEAL
  ======================================================= */

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
});
