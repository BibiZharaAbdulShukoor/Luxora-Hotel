/* ==========================================================
   LUXORA HOTEL — AUTH GUARD
========================================================== */

(function () {
  const isGuestLoggedIn = localStorage.getItem("guestLoggedIn") === "true";

  if (!isGuestLoggedIn) {
    const currentPageName =
      window.location.pathname.split("/").pop() || "index.html";

    const currentQueryName = window.location.search || "";

    /* Save requested protected page */

    if (currentPageName !== "login.html" && currentPageName !== "signup.html") {
      localStorage.setItem(
        "guestRedirectAfterLogin",
        currentPageName + currentQueryName,
      );
    }

    /* Redirect to login */

    window.location.replace("login.html");
  }
})();
