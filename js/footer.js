/* ==========================================================
   LUXORA FOOTER COMPONENT
   ========================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("footer");

  if (!footerContainer) {
    return;
  }

  fetch("components/footer.html")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Footer could not be loaded.");
      }

      return response.text();
    })
    .then((footerHTML) => {
      footerContainer.innerHTML = footerHTML;
    })
    .catch((error) => {
      console.error("Footer error:", error);
    });
});
