const params = new URLSearchParams(window.location.search);
const staffId = params.get("staff") || "elizabeth";

const contacts = {
  elizabeth: {
    name: "Elizabeth Oh",
    title: "Manager",
    company: "Kian Shen Trading & Plumbing Services",
    mobile: "9646 2445",
    companyPhone: "6458 1255",
    customerWhatsapp: "9117 1255",
    email: "kianshen1988@gmail.com",
    website: "https://www.kianshen.com/",
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
    website: "https://www.kianshen.com/",
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
    website: "https://www.kianshen.com/",
    address: "Blk 443 Ang Mo Kio Ave 10, #01-1255, Singapore 560443",
  }
};

const contact = contacts[staffId] || contacts.elizabeth;

const toast = document.querySelector("#toast");
const shareButton = document.querySelector("#shareButton");
const saveButton = document.querySelector("#saveButton");
const whatsappForm = document.querySelector("#whatsappForm");
const whatsappNumber = document.querySelector("#whatsappNumber");
const qrCode = document.querySelector("#qrCode");
const slides = Array.from(document.querySelectorAll(".carousel__slide"));
const dots = Array.from(document.querySelectorAll("#carouselDots button"));
const previousSlide = document.querySelector("#previousSlide");
const nextSlide = document.querySelector("#nextSlide");
let activeSlide = 0;
let carouselTimer;

function currentUrl() {
  if (window.location.protocol === "file:") {
    return "https://www.kianshen.com/";
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
    `N:Oh;Elizabeth;;;`,
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
}

shareButton.addEventListener("click", shareCard);
saveButton.addEventListener("click", downloadContact);
whatsappForm.addEventListener("submit", submitWhatsApp);
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => setSlide(index));
});
previousSlide.addEventListener("click", () => setSlide(activeSlide - 1));
nextSlide.addEventListener("click", () => setSlide(activeSlide + 1));
renderContact();
renderQrCode();
startCarousel();
