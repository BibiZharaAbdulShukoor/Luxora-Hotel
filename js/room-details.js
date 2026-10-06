/* =========================================================
   LUXORA ROOM DETAILS JAVASCRIPT
   ========================================================= */

/* =========================================================
   ROOM DATA, this is a placeholder for room data, in a real application this would be fetched from a server or database
   ========================================================= */

const ourRooms = {
  "grand-suite": {
    title: "Grand Luxury Suite",
    subtitle: "An elegant private sanctuary designed for unforgettable stays.",
    image: "../images/room-page-photo/photo-1611892440504-42a792e24d32.avif",
    description:
      "Step into an expansive sanctuary where refined interiors, natural textures and contemporary comforts create an atmosphere of effortless luxury. The Grand Luxury Suite offers generous living space and beautiful views for a truly exceptional stay.",
    size: "78 m²",
    guests: "1 — 2 Guests",
    bed: "King Bed",
    price: "480",
  },

  "terrace-room": {
    title: "Terrace Room",
    subtitle: "A sophisticated retreat opening onto a private terrace.",
    image: "../images/room-page-photo/photo-1566665797739-1674de7a421a.avif",
    description:
      "A warm and sophisticated room opening onto a private terrace with beautiful city views. Designed with soft textures and refined details for a peaceful escape.",
    size: "46 m²",
    guests: "1 — 2 Guests",
    bed: "King Bed",
    price: "320",
  },

  "city-residence": {
    title: "City Residence",
    subtitle: "A spacious residential-style retreat for effortless living.",
    image: "../images/room-page-photo/photo-1600607687939-ce8a6c25118c.avif",
    description:
      "A spacious residential-style retreat designed for extended stays and effortless living, combining generous space, contemporary elegance and the comfort of a private home.",
    size: "96 m²",
    guests: "1 — 4 Guests",
    bed: "2 Bedrooms",
    price: "620",
  },

  "presidential-suite": {
    title: "Presidential Suite",
    subtitle: "Our most prestigious suite for an extraordinary stay.",
    image: "../images/room-page-photo/photo-1590490360182-c33d57733427.avif",
    description:
      "Our most prestigious suite combines extraordinary space, private dining and exceptional panoramic views. Every detail has been designed around privacy and sophisticated comfort.",
    size: "142 m²",
    guests: "1 — 4 Guests",
    bed: "King Bed",
    price: "980",
  },

  "deluxe-room": {
    title: "Deluxe King Room",
    subtitle: "A refined retreat with contemporary elegance.",
    image: "../images/room-page-photo/photo-1618221195710-dd6b41faaea6.avif",
    description:
      "A refined retreat with contemporary details, soft textures and everything you need for a restful stay. Elegant simplicity meets thoughtful comfort.",
    size: "38 m²",
    guests: "1 — 2 Guests",
    bed: "King Bed",
    price: "260",
  },

  "family-residence": {
    title: "Family Residence",
    subtitle: "A generous private residence designed for families.",
    image: "../images/room-page-photo/photo-1600607687920-4e2a09cf159d.avif",
    description:
      "A generous private residence designed for families, featuring multiple bedrooms, a comfortable living area and everything needed for a relaxing extended stay.",
    size: "118 m²",
    guests: "1 — 5 Guests",
    bed: "2 Bedrooms",
    price: "740",
  },
};

/* =========================================================
   GET ROOM FROM URL, this section retrieves the room key from the URL parameters and selects the corresponding room data from ourRooms. 
   If no valid room key is found, it defaults to the "grand-suite".
   ========================================================= */
const parameter = new URLSearchParams(window.location.search);

const roomKeys = parameter.get("room") || "grand-suite";

const selectedRoom = ourRooms[roomKeys] || ourRooms["grand-suite"];

// UPDATE BOOKING BUTTONS, this section updates the booking buttons on the page to link to the booking page with the selected room key as a URL parameter.

const bookRoomButton = document.getElementById("bookRoomBtn");
const bookCtaButton = document.querySelector(".cta-btn");

if (bookRoomButton) {
  bookRoomButton.href = `booking.html?room=${roomKeys}`;
}

if (bookCtaButton) {
  bookCtaButton.href = `booking.html?room=${roomKeys}`;
}

/* =========================================================
   UPDATE ROOM CONTENT, this function updates the room details on the page based on the selectedRoom data. 
   It sets the title, subtitle, description, size, guests, bed type, price, and main image. 
   It also updates the document title to reflect the selected room.
   ========================================================= */

function updateEachRoom() {
  const roomsTitle = document.getElementById("roomTitle");

  const overviewOfTitles = document.getElementById("overviewTitle");

  const roomsSubtitle = document.getElementById("roomSubtitle");

  const roomsDescription = document.getElementById("roomDescription");

  const roomsSize = document.getElementById("roomSize");

  const roomsGuests = document.getElementById("roomGuests");

  const roomsBed = document.getElementById("roomBed");

  const roomsPrice = document.getElementById("roomPrice");

  const mainRoomsImg = document.getElementById("mainRoomImage");

  if (!roomsTitle || !overviewOfTitles || !roomsSubtitle || !roomsDescription) {
    return;
  }

  roomsTitle.innerHTML = formatTitle(selectedRoom.title);

  overviewOfTitles.innerHTML = formatTitle(selectedRoom.title);

  roomsSubtitle.textContent = selectedRoom.subtitle;

  roomsDescription.textContent = selectedRoom.description;

  if (roomsSize) {
    roomsSize.textContent = selectedRoom.size;
  }

  if (roomsGuests) {
    roomsGuests.textContent = selectedRoom.guests;
  }

  if (roomsBed) {
    roomsBed.textContent = selectedRoom.bed;
  }

  if (roomsPrice) {
    roomsPrice.textContent = selectedRoom.price;
  }

  if (mainRoomsImg) {
    mainRoomsImg.src = selectedRoom.image;
    mainRoomsImg.alt = selectedRoom.title;
  }

  document.title = `${selectedRoom.title} | LUXORA`;
}

/* =========================================================
   FORMAT TITLE, this function formats the room title by emphasizing the last word with <em> tags.
   It splits the title into words, joins all but the last word, and wraps the last word in <em> tags for emphasis.
   ========================================================= */

function formatTitle(title) {
  const word = title.split(" ");

  if (word.length <= 1) {
    return title;
  }

  const firstPart = word.slice(0, -1).join(" ");

  const lastWord = word[word.length - 1];

  return `${firstPart} <em>${lastWord}</em>`;
}

updateEachRoom();

/* =========================================================
   GALLERY, this section implements a lightbox gallery for room images. 
   It allows users to click on gallery items to view larger images in a lightbox, navigate between images using next and previous buttons, and close the lightbox. 
   It also supports keyboard navigation with arrow keys and the Escape key.
   ========================================================= */

const galleryCase = document.querySelectorAll(".gallery-item");

const galleryImgs = Array.from(galleryCase).map((item) => item.dataset.image);

const lightboxPart = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightboxImage");

const lightboxClosePart = document.getElementById("lightboxClose");

const lightboxPreview = document.getElementById("lightboxPrev");

const lightboxNext = document.getElementById("lightboxNext");

const openGallerySection = document.getElementById("openGallery");

let galleryList = 0;

function showImage(index) {
  if (!galleryImgs.length || !lightboxPart || !lightboxImg) {
    return;
  }

  currentImage = (index + galleryImgs.length) % galleryImgs.length;

  lightboxImg.src = galleryImgs[currentImage];

  lightboxPart.classList.add("open");

  document.body.style.overflow = "hidden";
}

galleryCase.forEach((item, index) => {
  item.addEventListener("click", () => {
    showImage(index);
  });
});

if (openGallerySection) {
  openGallerySection.addEventListener("click", () => {
    showImage(0);
  });
}

function closeLightbox() {
  if (!lightboxPart) {
    return;
  }

  lightboxPart.classList.remove("open");

  document.body.style.overflow = "";
}

if (lightboxClosePart) {
  lightboxClosePart.addEventListener("click", closeLightbox);
}

if (lightboxPart) {
  lightboxPart.addEventListener("click", (event) => {
    if (event.target === lightboxPart) {
      closeLightbox();
    }
  });
}

if (lightboxPreview) {
  lightboxPreview.addEventListener("click", () => {
    showImage(currentImage - 1);
  });
}

if (lightboxNext) {
  lightboxNext.addEventListener("click", () => {
    showImage(currentImage + 1);
  });
}

/* =========================================================
   KEYBOARD GALLERY, this section adds keyboard navigation for the lightbox gallery.
   It listens for keydown events and allows users to navigate through images using the left and right arrow keys, and close the lightbox with the Escape key.
   ========================================================= */

document.addEventListener("keydown", (event) => {
  if (!lightboxPart || !lightboxPart.classList.contains("open")) {
    return;
  }

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (event.key === "ArrowLeft") {
    showImage(currentImage - 1);
  }

  if (event.key === "ArrowRight") {
    showImage(currentImage + 1);
  }
});

/* =========================================================
   SCROLL REVEAL, this section uses IntersectionObserver to reveal elements with the "reveal" class as they come into view.
   ========================================================= */

const revealElm = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");

          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
    },
  );

  revealElm.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElm.forEach((element) => {
    element.classList.add("visible");
  });
}
