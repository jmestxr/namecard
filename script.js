const params = new URLSearchParams(window.location.search);
const staffId = params.get("staff") || "elizabeth";
console.log(staffId)

const contacts = {
  elizabeth: {
    name: "Elizabeth Oh",
    title: "Manager",
    company: "Kian Shen Trading & Plumbing Services",
    mobile: "9646 2445",
    companyPhone: "6458 1255",
    customerWhatsapp: "9117 1255",
    email: "kianshen1988@gmail.com",
    website: "https://kianshen.sg/",
    address: "Blk 443 Ang Mo Kio Ave 10, #01-1255, Singapore 560443",
  },

  kianseng: {
    name: "Tan Kian Seng",
    title: "Director",
    company: "Kian Shen Trading & Plumbing Services",
    mobile: "9780 5003",
    companyPhone: "6458 1255",
    customerWhatsapp: "9117 1255",
    email: "kianshen1988@gmail.com",
    website: "https://kianshen.sg/",
    address: "Blk 443 Ang Mo Kio Ave 10, #01-1255, Singapore 560443",
  },

  angel: {
    name: "Angel Lee",
    title: "Designer",
    company: "Kian Shen Trading & Plumbing Services",
    mobile: "9117 1255",
    companyPhone: "6458 1255",
    customerWhatsapp: "9117 1255",
    email: "kianshen1988@gmail.com",
    website: "https://kianshen.sg/",
    address: "Blk 443 Ang Mo Kio Ave 10, #01-1255, Singapore 560443",
  },

  james: {
    name: "James Tan",
    title: "陈星融",
    company: "Kian Shen Trading & Plumbing Services",
    mobile: "9742 8002",
    companyPhone: "6458 1255",
    customerWhatsapp: "9742 8002",
    email: "kianshen1988@gmail.com",
    website: "https://kianshen.sg/",
    address: "Blk 443 Ang Mo Kio Ave 10, #01-1255, Singapore 560443",
    // profilePic: "assets/james.jpg",
  }
};

const contact = contacts[staffId] || contacts.elizabeth;

const CLOUDINARY_CLOUD_NAME = "wzzu3in8";

// Order here = display order in the carousel. Fill in public IDs after uploading to Cloudinary.
const carouselImages = [
  { publicId: "txr-vehicles", objectPosition: "62% 55%" },
  { publicId: "9483" },
  { publicId: "9486" },
  { publicId: "112538" },
  { publicId: "122719" },
  { publicId: "104511" },
  { publicId: "20180829-WA0028" },
  { publicId: "9494" },
  { publicId: "103117" },
  { publicId: "155953" },
  { publicId: "9501" },
  { publicId: "9490" },
  { publicId: "9496" },
  { publicId: "9491" },
  { publicId: "9459" },
  { publicId: "9506" },
];

function cloudinaryUrl(publicId) {
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,w_1600/${publicId}`;
}

function buildCarousel() {
  const track = document.querySelector("#carouselTrack");
  const dotsContainer = document.querySelector("#carouselDots");

  carouselImages.forEach((image, index) => {
    const img = document.createElement("img");
    img.className = index === 0 ? "carousel__slide is-active" : "carousel__slide";
    img.src = cloudinaryUrl(image.publicId);
    img.alt = "";
    if (image.objectPosition) {
      img.style.objectPosition = image.objectPosition;
    }
    track.append(img);

    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show image ${index + 1}`);
    if (index === 0) {
      dot.className = "is-active";
      dot.setAttribute("aria-current", "true");
    }
    dotsContainer.append(dot);
  });
}

buildCarousel();

const toast = document.querySelector("#toast");
const shareButton = document.querySelector("#shareButton");
const saveButton = document.querySelector("#saveButton");
// const whatsappForm = document.querySelector("#whatsappForm");
const whatsappNumber = document.querySelector("#whatsappNumber");
const qrCode = document.querySelector("#qrCode");
const slides = Array.from(document.querySelectorAll(".carousel__slide"));
const dots = Array.from(document.querySelectorAll("#carouselDots button"));
const previousSlide = document.querySelector("#previousSlide");
const nextSlide = document.querySelector("#nextSlide");
const carouselTrack = document.querySelector("#carouselTrack");
const lightbox = document.querySelector("#lightbox");
const lightboxImage = document.querySelector("#lightboxImage");
const lightboxClose = document.querySelector("#lightboxClose");
const lightboxPrevious = document.querySelector("#lightboxPrevious");
const lightboxNext = document.querySelector("#lightboxNext");
let activeSlide = 0;
let carouselTimer;

function currentUrl() {
  if (window.location.protocol === "file:") {
    return "https://kianshen.sg/";
  }

  return window.location.href;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function makeVCard() {
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${contact.name || ""};;;`,
    `FN:${contact.name}`,
    `ORG:${contact.company}`,
    `TITLE:${contact.title}`,
    `TEL;TYPE=CELL:${contact.mobile}`,
    `TEL;TYPE=WORK:${contact.companyPhone}`,
    `EMAIL;TYPE=INTERNET:${contact.email}`,
    `ADR;TYPE=WORK:;;${contact.address};;;;`,
    `URL:${contact.website}`,
    "END:VCARD",
  ].join("\r\n");
}

function downloadContact() {
  const file = new Blob([makeVCard()], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");

  link.href = url;
link.download =
  `${contact.name.toLowerCase().replace(/\s+/g, "-")}-kian-shen.vcf`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("Contact file downloaded");
}

async function copyUrl() {
  try {
    await navigator.clipboard.writeText(currentUrl());
    showToast("Card link copied");
  } catch {
    showToast("Share this page URL from your browser");
  }
}

async function shareCard() {
  const data = {
    title: `${contact.name} | Kian Shen`,
    text: `${contact.name}, ${contact.title} at ${contact.company}`,
    url: currentUrl(),
  };

  if (navigator.share) {
    try {
      await navigator.share(data);
      return;
    } catch (error) {
      if (error.name === "AbortError") {
        return;
      }
    }
  }

  await copyUrl();
}

function submitWhatsApp(event) {
  event.preventDefault();
  const digits = whatsappNumber.value.replace(/\D/g, "");

  if (digits.length < 8) {
    showToast("Enter a valid WhatsApp number");
    whatsappNumber.focus();
    return;
  }

  const singaporeNumber = digits.startsWith("65") ? digits : `65${digits}`;
  const message = encodeURIComponent(`Digital namecard of ${contact.name}: ${currentUrl()}`);
  window.open(`https://wa.me/${singaporeNumber}?text=${message}`, "_blank", "noopener");
}

function renderQrCode() {
  const data = encodeURIComponent(currentUrl());
  qrCode.src = `https://api.qrserver.com/v1/create-qr-code/?size=264x264&margin=12&data=${data}`;
}

function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;

  slides.forEach((slide, slideIndex) => {
    slide.classList.toggle("is-active", slideIndex === activeSlide);
  });

  dots.forEach((dot, dotIndex) => {
    const isCurrent = dotIndex === activeSlide;
    dot.classList.toggle("is-active", isCurrent);
    dot.setAttribute("aria-current", isCurrent ? "true" : "false");
  });
}

function startCarousel() {
  window.clearInterval(carouselTimer);
  carouselTimer = window.setInterval(() => {
    showSlide(activeSlide + 1);
  }, 4200);
}

function setSlide(index) {
  showSlide(index);
  startCarousel();
}

function updateLightboxImage() {
  lightboxImage.src = slides[activeSlide].src;
}

function openLightbox(index) {
  showSlide(index);
  window.clearInterval(carouselTimer);
  updateLightboxImage();
  lightbox.hidden = false;
}

function closeLightbox() {
  lightbox.hidden = true;
  startCarousel();
}

function showLightboxSlide(index) {
  showSlide(index);
  updateLightboxImage();
}

function renderContact() {
  document.querySelector("#card-name").textContent =
    contact.name;

  document.querySelector("#card-role").textContent =
    contact.title;

  document.querySelector("#callLink").href =
    `tel:${contact.mobile}`;

  document.querySelector("#whatsappLink").href =
    `https://wa.me/65${contact.mobile.replace(/\s+/g, '')}`;

  document.querySelector("#emailLink").href =
    `mailto:${contact.email}`;

  document.querySelector("#mobileLink").href =
    `tel:${contact.mobile}`;

  document.querySelector("#mobileLink").textContent =
    contact.mobile;

  document.querySelector("#staffEmailLink").href =
    `mailto:${contact.email}`;

  document.querySelector("#staffEmailLink").textContent =
    contact.email;

  document.querySelector("#companyPhoneLink").href =
    `tel:${contact.companyPhone}`;

  document.querySelector("#companyPhoneLink").textContent =
    contact.companyPhone;

  document.querySelector("#companyWhatsappLink").href =
    `https://wa.me/65${contact.customerWhatsapp.replace(/\s+/g, '')}`;

  document.querySelector("#companyWhatsappLink").textContent =
    contact.customerWhatsapp;

  const profilePicEl = document.querySelector("#profile-pic");
  const profileHeader = document.querySelector(".profile__header");
  if (contact.profilePic) {
    profilePicEl.src = contact.profilePic;
    profilePicEl.style.display = "";
    profileHeader.classList.add("profile__header--centered");
  } else {
    profilePicEl.style.display = "none";
    profileHeader.classList.remove("profile__header--centered");
  }
}

shareButton.addEventListener("click", shareCard);
saveButton.addEventListener("click", downloadContact);
// whatsappForm.addEventListener("submit", submitWhatsApp);
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => setSlide(index));
});
previousSlide.addEventListener("click", () => setSlide(activeSlide - 1));
nextSlide.addEventListener("click", () => setSlide(activeSlide + 1));
carouselTrack.addEventListener("click", (event) => {
  if (event.target.classList.contains("carousel__slide")) {
    openLightbox(slides.indexOf(event.target));
  }
});
lightboxClose.addEventListener("click", closeLightbox);
lightboxPrevious.addEventListener("click", () => showLightboxSlide(activeSlide - 1));
lightboxNext.addEventListener("click", () => showLightboxSlide(activeSlide + 1));
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
renderContact();
renderQrCode();
startCarousel();
