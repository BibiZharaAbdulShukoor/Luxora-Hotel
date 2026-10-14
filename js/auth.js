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
   THEME TOGGLE, this part handle the dark mode and light mode of page.
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
     HASH PASSWORD, this part can hash the password for us to store it securely in local storage
      ======================================================*/
    async function hashPass(password) {
      const encoder =
        new TextEncoder(); /* textencoder can make and object that convert password to UTF-8 bits */

      const salt = crypto.getRandomValues(
        new Uint8Array(16),
      ); /* generate a random salt for password hashing */

      const keyMaterials = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
      );

      const hashBuffer = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 600000 /*600,000 iterations of the PBKDF2 algorithm to make the hashing process more secure and resistant to brute-force attacks. */,
          hash: "SHA-256",
        },
        keyMaterials,
        256,
      );

      const hashArrays = Array.from(new Uint8Array(hashBuffer));
      const saltArrays = Array.from(salt);

      const hashHex = hashArrays
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      const saltHex = saltArrays
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return `${saltHex}:${hashHex}`;
    }
    /* ======================================================
     VERIFY PASSWORD, this part can verify the password by comparing the hashed password with the stored hashed password in local storage
      ======================================================*/
    async function verifyPassword(password, storedPassword) {
      const [saltHex, originalHash] = storedPassword.split(":");

      const encoder = new TextEncoder();

      const salt = new Uint8Array(
        saltHex.match(/.{2}/g).map((byte) => parseInt(byte, 16)),
      );

      const keyMaterials = await crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        "PBKDF2",
        false,
        ["deriveBits"],
      );

      const hashBuffer = await crypto.subtle.deriveBits(
        {
          name: "PBKDF2",
          salt: salt,
          iterations: 600000,
          hash: "SHA-256",
        },
        keyMaterials,
        256,
      );

      const newHash = Array.from(new Uint8Array(hashBuffer))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

      return newHash === originalHash;
    }
    /* ======================================================
       SIGN UP, this part handle the sign up form to use strong password 
    ====================================================== */
    const signupForms = document.getElementById("signupForm");

    if (signupForms) {
      const passInput = document.getElementById("signupPassword");

      const strengthBar = document.querySelectorAll(".strength-bars span");

      const strengthTexts = document.getElementById("strengthText");
      const confirmPasswordInput = document.getElementById("confirmPassword");

      /* PASSWORD STRENGTH */

      if (passInput) {
        passInput.addEventListener("input", function () {
          const myPassword = passInput.value;

          let strengths = 0;

          if (myPassword.length >= 8) {
            strengths++;
          }

          if (/[A-Z]/.test(myPassword)) {
            strengths++;
          }

          if (/[0-9]/.test(myPassword)) {
            strengths++;
          }

          if (/[@#$%^]/.test(myPassword)) {
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
          } else if (strengths === 1) {
            if (strengthTexts) {
              strengthTexts.textContent = "Weak password";
            }
          } else if (strengths === 2) {
            if (strengthTexts) {
              strengthTexts.textContent = "Fair password";
            }
          } else if (strengths === 3) {
            if (strengthTexts) {
              strengthTexts.textContent = "Good password";
            }
          } else if (strengths === 4) {
            if (strengthTexts) {
              strengthTexts.textContent = "Strong password";
            }
          }
        });
      }

      /* SIGNUP SUBMIT, this part handles the sign up form submission */

      signupForms.addEventListener("submit", async function (event) {
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

        const confirmPassword = confirmPasswordInput?.value || "";

        /* VALIDATION, this part checks the validity of the input values */

        if (!firstName || !lastName || !email || !password) {
          showToastMsg("sorry, you must complete all fields.");

          return;
        }
        // CHECK CONFIRM PASSWORD
        if (!confirmPasswordInput || !confirmPassword) {
          showToastMsg("Please confirm your password.");
          return;
        }

        if (password !== confirmPassword) {
          showToastMsg("Passwords do not match!");
          return;
        }
        // CHECK EMAIL FORMAT
        const emailPattern =
          /^[a-zA-Z0-9._%+-]{6,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(email)) {
          showToastMsg("Please enter a valid email address.");
          return;
        }

        // Check password requirements
        if (password.length < 8) {
          showToastMsg("Password must contain at least 8 characters.");
          return;
        }

        if (!/[A-Z]/.test(password)) {
          showToastMsg("Password must contain at least one uppercase letter.");
          return;
        }

        if (!/[0-9]/.test(password)) {
          showToastMsg("Password must contain at least one number.");
          return;
        }

        if (!/[@#$%^]/.test(password)) {
          showToastMsg(
            "Password must contain at least one special character (@#$%^).",
          );
          return;
        }
        //check the terms
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

        /* CREATE USER, this part save the new user information in local storage  */
        const hashedPassword = await hashPass(password);

        const luxorUser = {
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: hashedPassword,
          createdAt:
            new Date().toISOString() /*toISOString() method converts the date to a string in ISO format, which is a standard format for representing dates and times. */,
        };
        localStorage.setItem(
          "luxorUser",
          JSON.stringify(luxorUser),
        ); /*JSON.stringify() method converts the JavaScript object into a JSON string, which can be stored in localStorage. */

        /* RESET LOGIN, this part resets the login status */

        localStorage.removeItem("guestLoggedIn");

        localStorage.removeItem("luxorCurrentUser");
        await Swal.fire({
          icon: "success",
          title: "Account Created Successfully!",
          text: "Welcome to LUXORA! Your account has been created successfully.",
          confirmButtonText: "Continue to Login",
          confirmButtonColor: "#b08d57",
          allowOutsideClick: false,
        });

        window.location.href = "login.html";
      });
    }

    /* ======================================================
       LOGIN, this part handles the login form submission and user authentication
    ====================================================== */

    const userLoginForm = document.getElementById("loginForm");

    if (userLoginForm) {
      userLoginForm.addEventListener("submit", async function (event) {
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

        let passwordIsCorrect = false;

        try {
          passwordIsCorrect = await verifyPassword(
            password,
            savedUser.password,
          );
        } catch (error) {
          passwordIsCorrect = false;
        }

        if (savedUser.email !== email || !passwordIsCorrect) {
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
   FORGOT PASSWORD WITH SWEETALERT2, this part handles the forgot password functionality using SweetAlert2 for user interaction
====================================================== */

    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
      forgotPassword.addEventListener("click", async function (event) {
        event.preventDefault();

        // STEP 1: Ask for email
        const { value: email, isConfirmed: emailConfirmed } = await Swal.fire({
          title: "Forgot Password?",
          text: "Enter your registered email address.",
          input: "email",
          inputPlaceholder: "you@example.com",
          showCancelButton: true,
          confirmButtonText: "Continue",
          cancelButtonText: "Cancel",
          confirmButtonColor: "#b08d57",
          cancelButtonColor: "#777777",
          inputValidator: (value) => {
            if (!value) {
              return "Please enter your email address.";
            }
          },
        });

        if (!emailConfirmed) {
          return;
        }

        const userEmailAdd = email.trim().toLowerCase();

        // STEP 2: Get saved user
        let savedUser = null;

        try {
          savedUser = JSON.parse(localStorage.getItem("luxorUser"));
        } catch (error) {
          savedUser = null;
        }

        // STEP 3: Check email
        if (!savedUser || savedUser.email !== userEmailAdd) {
          await Swal.fire({
            icon: "error",
            title: "Account Not Found",
            text: "No account found with this email address.",
            confirmButtonColor: "#b08d57",
          });

          return;
        }

        // STEP 4: Ask for new password
        const { value: newPassword, isConfirmed: passwordConfirmed } =
          await Swal.fire({
            title: "Reset Password",
            text: "Enter your new password.",
            input: "password",
            inputPlaceholder: "Enter new password",
            inputAttributes: {
              minlength: 8,
              maxlength: 100,
              autocapitalize: "off",
              autocorrect: "off",
            },
            showCancelButton: true,
            confirmButtonText: "Reset Password",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#b08d57",
            cancelButtonColor: "#777777",
            inputValidator: (value) => {
              if (!value) {
                return "Please enter your new password.";
              }

              if (value.length < 8) {
                return "Password must be at least 8 characters long.";
              }
            },
          });

        if (!passwordConfirmed) {
          return;
        }

        // STEP 5: Save new password
        savedUser.password = await hashPass(newPassword);

        localStorage.setItem("luxorUser", JSON.stringify(savedUser));

        // STEP 6: Success message
        await Swal.fire({
          icon: "success",
          title: "Password Reset Successfully!",
          text: "You can now log in with your new password.",
          confirmButtonText: "Continue",
          confirmButtonColor: "#b08d57",
        });
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
