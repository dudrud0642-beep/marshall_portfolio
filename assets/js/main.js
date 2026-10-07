// Page reset ---------------------------------------------------------------
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash)
  history.replaceState(null, "", location.pathname + location.search);
const resetScroll = () => {
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
};
resetScroll();
document.addEventListener("DOMContentLoaded", resetScroll);
window.addEventListener("load", () => requestAnimationFrame(resetScroll));
window.addEventListener("pageshow", (event) => {
  resetScroll();
  if (event.persisted) requestAnimationFrame(resetScroll);
});
window.addEventListener("beforeunload", resetScroll);

// Navigation ---------------------------------------------------------------
const header = document.querySelector("[data-header]");
const menuButton = document.querySelector("[data-menu-button]");
const mobileMenu = document.querySelector("[data-mobile-menu]");
const megaTriggers = [...document.querySelectorAll("[data-mega-trigger]")];

// This renewal is a visual prototype. Keep navigation and content links static.
document
  .querySelectorAll(".site-header a, main a, .event-popup a, .site-footer a")
  .forEach((link) => {
    link.setAttribute("aria-disabled", "true");
    link.addEventListener("click", (event) => event.preventDefault());
  });

document.querySelectorAll("a[aria-disabled='true']").forEach((link) => {
  link.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") event.preventDefault();
  });
});

const closeMenu = () => {
  header?.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "전체 메뉴 열기");
};

menuButton?.addEventListener("click", () => {
  const willOpen = !header.classList.contains("is-open");
  header.classList.toggle("is-open", willOpen);
  document.body.classList.toggle("menu-open", willOpen);
  menuButton.setAttribute("aria-expanded", String(willOpen));
  menuButton.setAttribute(
    "aria-label",
    willOpen ? "전체 메뉴 닫기" : "전체 메뉴 열기",
  );
});

mobileMenu
  ?.querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener(
  "keydown",
  (event) =>
    event.key === "Escape" &&
    (closeMenu(), header?.classList.remove("has-mega")),
);

megaTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const willOpen = !header.classList.contains("has-mega");
    header.classList.toggle("has-mega", willOpen);
    header.classList.toggle("is-scrolled", willOpen || window.scrollY > 24);
  });
});
header?.addEventListener("mouseleave", () =>
  header.classList.remove("has-mega"),
);

const updateHeader = () =>
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

// Shared scroll reveal -----------------------------------------------------
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.14 },
);

document
  .querySelectorAll(".reveal")
  .forEach((element) => revealObserver.observe(element));

// Hero carousel ------------------------------------------------------------
const heroSlider = document.querySelector("[data-hero-slider]");
if (heroSlider) {
  const slides = [...heroSlider.querySelectorAll("[data-hero-slide]")];
  const dots = [...document.querySelectorAll("[data-hero-dot]")];
  let heroIndex = 0;
  let heroTimer;

  const showHero = (nextIndex) => {
    heroIndex = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, index) => {
      const active = index === heroIndex;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
      slide.querySelectorAll("a, button").forEach((control) => {
        control.setAttribute("tabindex", active ? "0" : "-1");
      });
    });
    dots.forEach((dot, index) => {
      const active = index === heroIndex;
      dot.classList.toggle("is-active", active);
      dot.setAttribute("aria-selected", String(active));
      dot.setAttribute("tabindex", active ? "0" : "-1");
    });
  };
  slides.forEach((slide, index) => {
    slide.setAttribute("role", "group");
    slide.setAttribute("aria-roledescription", "슬라이드");
    slide.setAttribute("aria-label", `${index + 1} / ${slides.length}`);
  });
  dots.forEach((dot) => dot.setAttribute("role", "tab"));
  showHero(0);
  const startHero = () => {
    clearInterval(heroTimer);
    heroTimer = setInterval(() => showHero(heroIndex + 1), 5200);
  };

  document
    .querySelector("[data-hero-prev]")
    ?.addEventListener("click", () => (showHero(heroIndex - 1), startHero()));
  document
    .querySelector("[data-hero-next]")
    ?.addEventListener("click", () => (showHero(heroIndex + 1), startHero()));
  dots.forEach((dot, index) =>
    dot.addEventListener("click", () => (showHero(index), startHero())),
  );
  heroSlider.addEventListener("mouseenter", () => clearInterval(heroTimer));
  heroSlider.addEventListener("mouseleave", startHero);
  heroSlider.addEventListener("focusin", () => clearInterval(heroTimer));
  heroSlider.addEventListener("focusout", startHero);
  startHero();
}

// Good-sleep panels --------------------------------------------------------
const introPanels = document.querySelectorAll(".intro-panel");
introPanels.forEach((panel) => {
  const activate = () => {
    introPanels.forEach((item) => item.classList.remove("is-active"));
    panel.classList.add("is-active");
  };
  panel.addEventListener("mouseenter", activate);
  panel.addEventListener("focus", activate);
});

const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)")
  .matches;

// Product carousel ---------------------------------------------------------
const collection = document.querySelector("[data-collection]");
if (collection) {
  const slides = [...collection.querySelectorAll("[data-slide]")];
  const counter = collection.querySelector("[data-counter]");
  let index = 0;

  const showSlide = (nextIndex) => {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => {
      const active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };

  collection
    .querySelector("[data-prev]")
    .addEventListener("click", () => showSlide(index - 1));
  collection
    .querySelector("[data-next]")
    .addEventListener("click", () => showSlide(index + 1));
  collection.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showSlide(index - 1);
    if (event.key === "ArrowRight") showSlide(index + 1);
  });
}

// Store carousel -----------------------------------------------------------
const storeGallery = document.querySelector("[data-store-gallery]");
if (storeGallery) {
  const storeCards = [...storeGallery.querySelectorAll(".store-card")];
  const storeMobile = window.matchMedia("(max-width: 900px)");
  let storeIndex = 0;
  let storeTimer;
  let storeDragging = false;
  let storeDragStart = 0;
  let storeScrollStart = 0;
  let storeDragDistance = 0;

  const cardLeft = (card) => card.offsetLeft - storeCards[0].offsetLeft;
  const showStore = (nextIndex) => {
    if (!storeMobile.matches) return;
    storeIndex = (nextIndex + storeCards.length) % storeCards.length;
    storeGallery.scrollTo({
      left: cardLeft(storeCards[storeIndex]),
      behavior: motionAllowed ? "smooth" : "auto",
    });
  };
  const stopStoreAuto = () => clearInterval(storeTimer);
  const startStoreAuto = () => {
    stopStoreAuto();
    if (!storeMobile.matches) return;
    storeTimer = setInterval(() => showStore(storeIndex + 1), 3800);
  };
  const syncStoreIndex = () => {
    const currentLeft = storeGallery.scrollLeft;
    storeIndex = storeCards.reduce((closest, card, index) => {
      const closestDistance = Math.abs(
        currentLeft - cardLeft(storeCards[closest]),
      );
      return Math.abs(currentLeft - cardLeft(card)) < closestDistance
        ? index
        : closest;
    }, 0);
  };

  storeGallery.addEventListener("pointerdown", (event) => {
    if (!storeMobile.matches || event.button > 0) return;
    stopStoreAuto();
    storeDragging = true;
    storeDragStart = event.clientX;
    storeScrollStart = storeGallery.scrollLeft;
    storeDragDistance = 0;
    storeGallery.classList.add("is-dragging");
    storeGallery.setPointerCapture(event.pointerId);
  });
  storeGallery.addEventListener("pointermove", (event) => {
    if (!storeDragging) return;
    storeDragDistance = event.clientX - storeDragStart;
    storeGallery.scrollLeft = storeScrollStart - storeDragDistance;
  });
  const endStoreDrag = (event) => {
    if (!storeDragging) return;
    storeDragging = false;
    storeGallery.classList.remove("is-dragging");
    syncStoreIndex();
    showStore(storeIndex);
    if (storeGallery.hasPointerCapture(event.pointerId)) {
      storeGallery.releasePointerCapture(event.pointerId);
    }
    startStoreAuto();
  };
  storeGallery.addEventListener("pointerup", endStoreDrag);
  storeGallery.addEventListener("pointercancel", endStoreDrag);
  storeGallery.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") showStore(storeIndex - 1);
    if (event.key === "ArrowRight") showStore(storeIndex + 1);
  });
  storeGallery.addEventListener(
    "click",
    (event) => {
      if (Math.abs(storeDragDistance) > 8) {
        event.preventDefault();
        event.stopPropagation();
        storeDragDistance = 0;
      }
    },
    true,
  );
  storeMobile.addEventListener("change", () => {
    storeIndex = 0;
    storeGallery.scrollTo({ left: 0, behavior: "auto" });
    startStoreAuto();
  });

  startStoreAuto();
}

// Forms --------------------------------------------------------------------
document
  .querySelector(".newsletter form")
  ?.addEventListener("submit", (event) => event.preventDefault());

// Event popup carousel -----------------------------------------------------
const eventPopup = document.querySelector("[data-event-popup]");
const popupCloseButton = document.querySelector("[data-popup-close]");
const popupModalMedia = window.matchMedia("(max-width: 900px)");
let popupTimer;
const updatePopupAccessibility = () => {
  if (!eventPopup) return;
  const modal =
    popupModalMedia.matches && !eventPopup.classList.contains("is-hidden");
  eventPopup.setAttribute("aria-modal", String(modal));
  eventPopup.setAttribute(
    "aria-hidden",
    String(eventPopup.classList.contains("is-hidden")),
  );
};
const closePopup = () => {
  eventPopup?.classList.add("is-hidden");
  document.body.classList.remove("has-event-popup");
  clearInterval(popupTimer);
  updatePopupAccessibility();
};
if (eventPopup) {
  document.body.classList.add("has-event-popup");
  updatePopupAccessibility();
}
popupCloseButton?.addEventListener("click", closePopup);
popupModalMedia.addEventListener("change", updatePopupAccessibility);
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !eventPopup?.classList.contains("is-hidden")) {
    closePopup();
  }
});

const popupTrack = document.querySelector("[data-popup-track]");
if (eventPopup && popupTrack) {
  const popupSlides = [...popupTrack.children];
  const popupDots = [...eventPopup.querySelectorAll(".popup-dots i")];
  const popupCount = eventPopup.querySelector("[data-popup-count]");
  let popupIndex = 0;
  let dragStart = 0;
  let dragOffset = 0;
  let isDragging = false;

  const showPopupSlide = (nextIndex) => {
    popupIndex = (nextIndex + popupSlides.length) % popupSlides.length;
    popupTrack.style.transform = `translateX(-${popupIndex * eventPopup.clientWidth}px)`;
    popupCount.textContent = `${popupIndex + 1} / ${popupSlides.length}`;
    popupDots.forEach((dot, index) =>
      dot.classList.toggle("is-active", index === popupIndex),
    );
  };
  const startPopupAuto = () => {
    clearInterval(popupTimer);
    popupTimer = setInterval(() => showPopupSlide(popupIndex + 1), 4200);
  };

  eventPopup.addEventListener("pointerdown", (event) => {
    if (event.target.closest("[data-popup-close]")) return;
    event.preventDefault();
    clearInterval(popupTimer);
    isDragging = true;
    dragStart = event.clientX;
    dragOffset = 0;
    eventPopup.classList.add("is-dragging");
    eventPopup.setPointerCapture(event.pointerId);
  });
  eventPopup.addEventListener("pointermove", (event) => {
    if (!isDragging) return;
    event.preventDefault();
    dragOffset = event.clientX - dragStart;
    const base = -popupIndex * eventPopup.clientWidth;
    popupTrack.style.transform = `translateX(${base + dragOffset}px)`;
  });
  const endPopupDrag = (event) => {
    if (!isDragging) return;
    isDragging = false;
    eventPopup.classList.remove("is-dragging");
    if (Math.abs(dragOffset) > eventPopup.clientWidth * 0.18) {
      showPopupSlide(popupIndex + (dragOffset < 0 ? 1 : -1));
    } else {
      showPopupSlide(popupIndex);
    }
    if (eventPopup.hasPointerCapture(event.pointerId)) {
      eventPopup.releasePointerCapture(event.pointerId);
    }
    startPopupAuto();
  };
  eventPopup.addEventListener("pointerup", endPopupDrag);
  eventPopup.addEventListener("pointercancel", endPopupDrag);
  popupTrack.addEventListener("dragstart", (event) => event.preventDefault());
  popupTrack.addEventListener("click", (event) => {
    if (Math.abs(dragOffset) > 8) event.preventDefault();
  });
  eventPopup.addEventListener("mouseenter", () => clearInterval(popupTimer));
  eventPopup.addEventListener("mouseleave", startPopupAuto);
  eventPopup.addEventListener("focusin", () => clearInterval(popupTimer));
  eventPopup.addEventListener("focusout", startPopupAuto);
  startPopupAuto();
}

// Quick-service buttons (prototype: no external navigation) ---------------
document.querySelectorAll("[data-quick]").forEach((button) => {
  button.addEventListener("click", (event) => event.preventDefault());
});

// Closing statement --------------------------------------------------------
const closingSection = document.querySelector("[data-closing-section]");
if (closingSection) {
  const closingObserver = new IntersectionObserver(
    ([entry], observer) => {
      if (!entry.isIntersecting) return;
      closingSection.classList.add("is-counted");
      observer.disconnect();
    },
    { threshold: 0.45 },
  );
  closingObserver.observe(closingSection);
}

// Back to top --------------------------------------------------------------
document
  .querySelector("[data-scroll-top]")
  ?.addEventListener("click", () =>
    window.scrollTo({ top: 0, behavior: "smooth" }),
  );
