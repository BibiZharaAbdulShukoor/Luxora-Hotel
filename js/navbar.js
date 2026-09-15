/* ==========================================================
   LUXORA HOTEL
   SHARED NAVBAR
   ========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  const navbarContainer = document.getElementById("navbar");

  if (!navbarContainer) {
    console.warn("LUXORA: #navbar container was not found.");
    return;
  }

  /* ========================================================
     LOAD NAVBAR HTML
     ======================================================== */

  try {
    const response = await fetch("components/navbar.html");

    if (!response.ok) {
      throw new Error(`Navbar could not be loaded: ${response.status}`);
    }

    const navbarHTML = await response.text();

    navbarContainer.innerHTML = navbarHTML;
  } catch (error) {
    console.error("LUXORA Navbar Error:", error);
    return;
  }

  /* ========================================================
     ELEMENTS
     ======================================================== */

  const header = document.getElementById("luxoraHotel-Header");

  const themeToggle = document.getElementById("luxoraThemeToggle");

  const menuToggle = document.getElementById("luxoraMenuToggle");

  const mobileMenu = document.getElementById("luxoraMobileMenu");

  const auth = document.getElementById("luxoraAuth");

  const mobileAuth = document.getElementById("luxoraMobileAuth");

  const login = document.getElementById("luxoraLogin");

  const signup = document.getElementById("luxoraSignup");

  const mobileLogin = document.getElementById("luxoraMobileLogin");

  const mobileSignup = document.getElementById("luxoraMobileSignup");

  /* ========================================================
     AUTH STATE
     ======================================================== */

  const isLoggedIn = localStorage.getItem("luxoraLoggedIn") === "true";

  /* ========================================================
     LOGGED-IN USER
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

    /* MOBILE */

    if (mobileLogin) {
      mobileLogin.remove();
    }

    if (mobileSignup) {
      mobileSignup.remove();
    }

    if (mobileAuth) {
      const mobileAccount = document.createElement("a");

      mobileAccount.href = "profile.html";

      mobileAccount.className = "luxora-mobile-account";

      mobileAccount.textContent = "My Account";

      mobileAuth.appendChild(mobileAccount);

      const mobileLogout = document.createElement("button");

      mobileLogout.type = "button";

      mobileLogout.className = "luxora-mobile-logout";

      mobileLogout.textContent = "Logout";

      mobileAuth.appendChild(mobileLogout);

      mobileLogout.addEventListener("click", () => {
        localStorage.removeItem("luxoraLoggedIn");

        localStorage.removeItem("luxoraCurrentUser");

        localStorage.removeItem("luxoraRedirectAfterLogin");

        window.location.replace("landing.html");
      });
    }
  }

  /* ========================================================
     ACTIVE PAGE
     ======================================================== */

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document
    .querySelectorAll(".lux-nav-link[data-page], .lux-mobile-linksa[data-page]")
    .forEach((link) => {
      const page = link.getAttribute("data-page");

      if (page === currentPage) {
        link.classList.add("active");
      }
    });

  /* ========================================================
     SCROLL NAVBAR
     ======================================================== */

  const updateHeader = () => {
    if (!header) {
      return;
    }

    if (window.scrollY > 30) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  updateHeader();

  window.addEventListener("scroll", updateHeader, { passive: true });

  /* ========================================================
     MOBILE MENU
     ======================================================== */

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("open");

      menuToggle.classList.toggle("open", isOpen);

      menuToggle.setAttribute("aria-expanded", String(isOpen));

      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu",
      );
    });

    mobileMenu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mobileMenu.classList.remove("open");

        menuToggle.classList.remove("open");

        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ========================================================
     THEME
     ======================================================== */

  const savedTheme = localStorage.getItem("luxora-theme");

  const applyTheme = (theme) => {
    document.body.classList.toggle("dark", theme === "dark");

    document.body.classList.toggle("dark-theme", theme === "dark");

    document.body.setAttribute("data-theme", theme);

    if (themeToggle) {
      themeToggle.textContent = theme === "dark" ? "☀" : "☾";
    }
  };

  const initialTheme = savedTheme === "dark" ? "dark" : "light";

  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.classList.contains("dark");

      const newTheme = isDark ? "light" : "dark";

      localStorage.setItem("luxora-theme", newTheme);

      applyTheme(newTheme);
    });
  }

  /* ========================================================
     CLOSE MENU WHEN RESIZING TO DESKTOP
     ======================================================== */

  window.addEventListener("resize", () => {
    if (window.innerWidth > 900 && mobileMenu && menuToggle) {
      mobileMenu.classList.remove("open");

      menuToggle.classList.remove("open");

      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
});
