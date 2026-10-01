/* ==========================================================
   LUXORA HOTEL — AUTH.JS
   Login / Signup / Password / Toast
   Safe Version
   ========================================================== */

(function () {
  "use strict";

  /* ========================================================
     WAIT UNTIL DOM IS READY
  ======================================================== */

  function initializeAuth() {
    const body = document.body;

    if (!body) {
      return;
    }
    /* ======================================================
   THEM, this part handle the dark mode and light mode of page.
====================================================== */

    const themeTgl = document.getElementById("themeTgl");

    function applyThemeTgl(theme) {
      body.classList.toggle("dark", theme === "dark");
      body.classList.toggle("dark-theme", theme === "dark");

      body.dataset.theme = theme;

      if (themeTgl) {
        themeTgl.textContent = theme === "dark" ? "☀" : "☾";
      }
    }

    /* GET SAVED THEME */

    const saveTheme = localStorage.getItem("login-theme") || "light";

    applyThemeTgl(saveTheme);

    /* THEME TOGGLE */

    if (themeTgl) {
      themeTgl.addEventListener("click", function () {
        const isDarkMode = body.classList.contains("dark");

        const newTheme = isDarkMode ? "light" : "dark";

        localStorage.setItem("login-theme", newTheme);

        applyThemeTgl(newTheme);
      });
    }
    /* ======================================================
       TOAST, this part appear a toast notification in page for tiny second,
    ===================================================== */

    const toastNotify = document.getElementById("toast");

    let toastTimer = null;

    function showToastMsg(message) {
      if (!toastNotify) {
        return;
      }

      const toastMsg = document.getElementById("toastMessage");

      if (toastMsg) {
        toastMsg.textContent = message;
      } else {
        toastNotify.textContent = message;
      }

      toastNotify.classList.add("show");

      clearTimeout(toastTimer);

      toastTimer = setTimeout(function () {
        toastNotify.classList.remove("show");
      }, 2600);
    }

    /* ======================================================
       SHOW / HIDE PASSWORD, this part can show and hide the password text for us
    ====================================================== */

    const passwordBtn = document.querySelectorAll(".show-password");

    passwordBtn.forEach(function (button) {
      button.addEventListener("click", function () {
        const targetId = button.dataset.target;

        const inputPass = document.getElementById(targetId);

        if (!inputPass) {
          return;
        }

        if (inputPass.type === "password") {
          inputPass.type = "text";

          button.textContent = "Hide";
        } else {
          inputPass.type = "password";

          button.textContent = "Show";
        }
      });
    });

    /* ======================================================
       SIGN UP, this part handle the sign up form to use strong password 
    ====================================================== */

    const signupForms = document.getElementById("signupForm");

    if (signupForms) {
      const passInput = document.getElementById("signupPassword");

      const strengthBar = document.querySelectorAll(".strength-bars span");

      const strengthTexts = document.getElementById("strengthText");

      /* PASSWORD STRENGTH */

      if (passInput) {
        passInput.addEventListener("input", function () {
          const myPassword = passInput.value;

          let strengths = 0;

          if (myPassword.length >= 6) {
            strengths++;
          }

          if (myPassword.length >= 8) {
            strengths++;
          }

          if (/[A-Z]/.test(myPassword)) {
            strengths++;
          }

          if (/[0-9]/.test(myPassword)) {
            strengths++;
          }

          strengthBar.forEach(function (bar, index) {
            if (index < strengths) {
              bar.style.background = "#a78a57";
            } else {
              bar.style.background = "";
            }
          });

          if (strengths === 0) {
            if (strengthTexts) {
              strengthTexts.textContent = "Password strength";
            }
          } else if (strengths <= 1) {
            if (strengthTexts) {
              strengthTexts.textContent = "Weak password";
            }
          } else if (strengths <= 3) {
            if (strengthTexts) {
              strengthTexts.textContent = "Good password";
            }
          } else {
            if (strengthTexts) {
              strengthTexts.textContent = "Strong password";
            }
          }
        });
      }

      /* SIGNUP SUBMIT, this part handles the sign up form submission */

      signupForms.addEventListener("submit", function (event) {
        event.preventDefault();

        const userFirstName = document.getElementById("firstName");

        const userLastName = document.getElementById("lastName");

        const userEmail = document.getElementById("signupEmail");

        const userPassword = document.getElementById("signupPassword");

        const userTermsInput = document.getElementById("terms");

        if (
          !userFirstName ||
          !userLastName ||
          !userEmail ||
          !userPassword ||
          !userTermsInput
        ) {
          return;
        }

        const firstName = userFirstName.value.trim();

        const lastName = userLastName.value.trim();

        const email = userEmail.value.trim().toLowerCase();

        const password = userPassword.value;

        const terms = userTermsInput.checked;

        /* VALIDATION, this part checks the validity of the input values */

        if (!firstName || !lastName || !email || !password) {
          showToastMsg("sorry, you must complete all fields.");

          return;
        }

        if (password.length < 6) {
          showToastMsg("Your password must be at least 6 characters long.");

          return;
        }

        if (!terms) {
          showToastMsg("Please, first accept the Terms and Privacy Policy.");

          return;
        }

        /* CHECK EXISTING USER, this part checks if a user with the provided email already exists */

        let existingUserAccount = null;

        try {
          existingUserAccount = JSON.parse(localStorage.getItem("luxorUser"));
        } catch (error) {
          existingUserAccount = null;
        }

        if (existingUserAccount && existingUserAccount.email === email) {
          showToastMsg("Sorry, an account with this email already exists.");

          return;
        }

        /* CREATE USER, this part creates a new user account */

        const luxorUser = {
          firstName: firstName,

          lastName: lastName,

          email: email,

          password: password,

          createdAt: new Date().toISOString(),
        };

        localStorage.setItem("luxorUser", JSON.stringify(luxorUser));

        /* RESET LOGIN, this part resets the login status */

        localStorage.removeItem("guestLoggedIn");

        localStorage.removeItem("luxorCurrentUser");

        showToastMsg(
          "Congratulations! Your account has been created successfully!",
        );

        setTimeout(function () {
          window.location.href = "login.html";
        }, 1800);
      });
    }

    /* ======================================================
       LOGIN, this part handles the login form submission and user authentication
    ====================================================== */

    const userLoginForm = document.getElementById("loginForm");

    if (userLoginForm) {
      userLoginForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const userLoginEmail = document.getElementById("loginEmail");

        const userLoginPassword = document.getElementById("loginPassword");

        if (!userLoginEmail || !userLoginPassword) {
          return;
        }

        const email = userLoginEmail.value.trim().toLowerCase();

        const password = userLoginPassword.value;

        /* GET SAVED USER, this part retrieves the stored user data */

        let savedUser = null;

        try {
          savedUser = JSON.parse(localStorage.getItem("luxorUser"));
        } catch (error) {
          savedUser = null;
        }

        /* NO ACCOUNT, this part handles the case where no user account is found */

        if (!savedUser) {
          showToastMsg(
            "No account exists with this email. Please sign up first.",
          );

          return;
        }

        /* WRONG LOGIN, this part handles incorrect login credentials */

        if (savedUser.email !== email || savedUser.password !== password) {
          showToastMsg("Your email or password is incorrect.");

          return;
        }

        /* =================================================
           LOGIN SUCCESS, this part handles successful login and redirects the user to the appropriate page
        ================================================= */

        localStorage.setItem("guestLoggedIn", "true");

        localStorage.setItem(
          "luxorCurrentUser",
          JSON.stringify({
            firstName: savedUser.firstName,

            lastName: savedUser.lastName,

            email: savedUser.email,
          }),
        );

        showToastMsg("Welcome back to your wishes LUXORA hotel!");

        /* =================================================
           REDIRECT, this part handles the redirection after successful login
        ================================================= */

        const redirectPages = localStorage.getItem("guestRedirectAfterLogin");

        setTimeout(function () {
          if (redirectPages) {
            localStorage.removeItem("guestRedirectAfterLogin");

            window.location.href = redirectPages;
          } else {
            window.location.href = "index.html";
          }
        }, 1500);
      });
    }

    /* ======================================================
       FORGOT PASSWORD, this part handles the forgot password functionality
    ====================================================== */

    const userForgotPassword = document.getElementById("forgotPassword");

    if (userForgotPassword) {
      userForgotPassword.addEventListener("click", function (event) {
        event.preventDefault();

        showToastMsg("Password recovery will be available soon.");
      });
    }
  }

  /* ========================================================
     DOM READY, this part ensures that the DOM is fully loaded before initializing the authentication functionality
  ======================================================== */

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeAuth, {
      once: true,
    });
  } else {
    initializeAuth();
  }
})();
