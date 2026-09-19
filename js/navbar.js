/* ==========================================================
   NAVBAR, this script is responsible for loading the navbar HTML, handling the theme toggle, mobile menu toggle, and user authentication state.
   ========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const navContainer = document.getElementById("navbar");

  if (!navContainer) {
    console.warn("LUXORA: #navbar container is not available.");
    return;
  }

  /* ========================================================
     LOAD NAVBAR HTML, this part can load the navbar HTML from the components/navbar.html file and insert it into the #navbar container.
     ======================================================== */

  try {
    const responseMsg = await fetch("components/navbar.html");

    if (!responseMsg.ok) {
      throw new Error(`Navbar loading is failed: ${responseMsg.status}`);
    }

    const navbarHTML = await responseMsg.text();

    navContainer.innerHTML = navbarHTML;
  } catch (error) {
    console.error("LUXORA Navbar took Error:", error);
    return;
  }

  /* ========================================================
     ELEMENTS
     ======================================================== */

  const navHeader = document.getElementById("luxHotel-Header");

  const themeTgl = document.getElementById("luxThemeToggle");

  const menuTgl = document.getElementById("luxMenuToggle");

  const mobileNavMenu = document.getElementById("luxMobileMenu");

  const auth = document.getElementById("luxAuth");

  const mobileAuthentication = document.getElementById("luxMobileAuth");

  const login = document.getElementById("luxLogin");

  const signup = document.getElementById("luxSignup");

  const mobileLogin = document.getElementById("luxMobileLogin");

  const mobileSignup = document.getElementById("luxMobileSignup");

  /* ========================================================
     AUTH STATE, this part checks if the user is logged in by checking the localStorage for a specific key. If the user is logged in, it modifies the navbar to show "My Account" and "Logout" options instead of "Login" and "Sign Up".
     ======================================================== */

  const isLoggedIn = localStorage.getItem("luxoraLoggedIn") === "true";

  /* ========================================================
     LOGGED-IN USER, this part handles the display of user-specific options in the navbar when the user is logged in. It removes the login and signup links and adds "My Account" and "Logout" buttons. The logout button clears the localStorage and redirects to the landing page.
     ======================================================== */

  if (isLoggedIn) {
    /* DESKTOP */

    if (login) {
      login.remove();
    }

    if (signup) {
      signup.remove();
    }

    if (auth) {
      const account = document.createElement("a");

      account.href = "profile.html";

      account.className = "luxora-account";

      account.textContent = "My Account";

      auth.appendChild(account);

      const logout = document.createElement("button");

      logout.type = "button";

      logout.className = "luxora-logout";

      logout.textContent = "Logout";

      auth.appendChild(logout);

      logout.addEventListener("click", () => {
        localStorage.removeItem("luxoraLoggedIn");

        localStorage.removeItem("luxoraCurrentUser");

        localStorage.removeItem("luxoraRedirectAfterLogin");

        window.location.replace("landing.html");
      });
    }

    /* MOBILE, this part handles the display of mobile-specific options in the navbar when the user is logged in. */

    if (mobileLogin) {
      mobileLogin.remove();
    }

    if (mobileSignup) {
      mobileSignup.remove();
    }

    if (mobileAuthentication) {
      const mobile_Account = document.createElement("a");

      mobile_Account.href = "profile.html";

      mobile_Account.className = "luxora-mobile-account";

      mobile_Account.textContent = "My Account";

      mobileAuthentication.appendChild(mobile_Account);

      const mobile_Logout = document.createElement("button");

      mobile_Logout.type = "button";

      mobile_Logout.className = "luxora-mobile-logout";

      mobile_Logout.textContent = "Logout";

      mobileAuthentication.appendChild(mobile_Logout);

      mobile_Logout.addEventListener("click", () => {
        localStorage.removeItem("luxoraLoggedIn");

        localStorage.removeItem("luxoraCurrentUser");

        localStorage.removeItem("luxoraRedirectAfterLogin");

        window.location.replace("landing.html");
      });
    }
  }

  /* ========================================================
     ACTIVE PAGE, this part highlights the current page in the navbar by adding an "active" class to the corresponding link based on the current URL path.
     ======================================================== */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".lux-nav-link[data-page], .lux-mobile-links[data-page]")
    .forEach((link) => {
      const page = link.getAttribute("data-page");

      if (page === currentPage) {
        link.classList.add("active");
      }
    });

  /* ========================================================
     SCROLL NAVBAR, this part adds a "scrolling" class to the navbar when the user scrolls down the page, which can be used to change the navbar's appearance (e.g., background color, shadow) when scrolling.
     ======================================================== */

  const updateNavHeader = () => {
    if (!navHeader) {
      return;
    }

    if (window.scrollY > 50) {
      navHeader.classList.add("scrolling");
    } else {
      navHeader.classList.remove("scrolling");
    }
  };

  updateNavHeader();

  window.addEventListener("scroll", updateNavHeader, { passive: true });

  /* ========================================================
     MOBILE MENU, this part handles the display and functionality of the mobile navigation menu.
     ======================================================== */

  if (menuTgl && mobileNavMenu) {
    menuTgl.addEventListener("click", () => {
      const isOpen = mobileNavMenu.classList.toggle("open");

      menuTgl.classList.toggle("open", isOpen);

      menuTgl.setAttribute("aria-expanded", String(isOpen));

      menuTgl.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
    });

    mobileNavMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileNavMenu.classList.remove("open");

        menuTgl.classList.remove("open");

        menuTgl.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ========================================================
     THEME, this part manages the theme selection and application for the navbar.
     ======================================================== */

  const saveTheme = localStorage.getItem("luxora-theme");
  const performTheme = (theme) => {
    document.body.classList.toggle("dark", theme === "dark");
    document.body.classList.toggle("dark-theme", theme === "dark");
    document.body.setAttribute("data-theme", theme);
    if (themeTgl) {
      themeTgl.textContent = theme === "dark" ? "☀" : "☾";
    }
  };
  const primaryTheme = saveTheme === "dark" ? "dark" : "light";
  performTheme(primaryTheme);
  if (themeTgl) {
    themeTgl.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");
      const newTheme = isDark ? "light" : "dark";
      localStorage.setItem("luxora-theme", newTheme);
      performTheme(newTheme);
    });
  }
  /* ========================================================
     CLOSE MENU WHEN RESIZING TO DESKTOP
     ======================================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 920 && mobileNavMenu && menuTgl) {
      mobileNavMenu.classList.remove("open");

      menuTgl.classList.remove("open");

      menuTgl.setAttribute("aria-expanded", "false");
    }
  });
});
