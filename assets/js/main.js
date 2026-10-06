(() => {
  const $ = (s, c = document) => c.querySelector(s),
    $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (n) => Math.max(0, Math.min(1, n));
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const scrim = $("[data-scrim]"),
    mobile = $("[data-mobile]");
  function closeNav() {
    $$(".mega").forEach((x) => x.classList.remove("open"));
    $$("[data-nav]").forEach((x) => x.setAttribute("aria-expanded", "false"));
    scrim?.classList.remove("open");
  }
  $$("[data-nav]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const t = $('[data-mega="' + btn.dataset.nav + '"]');
      if (!t) return;
      const open = t.classList.contains("open");
      closeNav();
      if (!open) {
        t.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        scrim?.classList.add("open");
      }
    }),
  );
  scrim?.addEventListener("click", closeNav);
  function closeMobile() {
    mobile?.classList.remove("open");
    document.body.classList.remove("lock");
  }
  $("[data-mobile-open]")?.addEventListener("click", () => {
    mobile?.classList.add("open");
    document.body.classList.add("lock");
  });
  $("[data-mobile-close]")?.addEventListener("click", closeMobile);
  $$(".mobile-drawer a").forEach((a) =>
    a.addEventListener("click", closeMobile),
  );
  $$(".mega a").forEach((a) => a.addEventListener("click", closeNav));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobile();
      closeNav();
    }
  });
  $$("[data-demo]").forEach((el) =>
    el.addEventListener("click", (e) => {
      e.preventDefault();
      alert(el.dataset.demo + " — This is an unofficial portfolio concept.");
    }),
  );
  $("[data-search]")?.addEventListener("click", () => {
    const q = prompt("Search speakers, Stanmore or live");
    if (!q) return;
    location.hash = /live/i.test(q)
      ? "live"
      : /stanmore/i.test(q)
        ? "featured"
        : "worlds";
  });
  const rail = $("[data-rail]"),
    prev = $("[data-rail-prev]"),
    next = $("[data-rail-next]");
  function step() {
    return (
      $(".rail-item:not([hidden])", rail)?.getBoundingClientRect().width +
        parseFloat(getComputedStyle(rail).gap || "16") || 360
    );
  }
  function syncArrows() {
    if (!rail) return;
    prev.disabled = rail.scrollLeft < 3;
    next.disabled = rail.scrollLeft >= rail.scrollWidth - rail.clientWidth - 3;
  }
  prev?.addEventListener("click", () =>
    rail.scrollBy({
      left: -step() * 1.6,
      behavior: reduce ? "instant" : "smooth",
    }),
  );
  next?.addEventListener("click", () =>
    rail.scrollBy({
      left: step() * 1.6,
      behavior: reduce ? "instant" : "smooth",
    }),
  );
  if (rail) {
    let dragging = false,
      id = null,
      x0 = 0,
      s0 = 0,
      moved = false,
      blockClick = false;
    rail.querySelectorAll("img,a").forEach((el) => {
      el.draggable = false;
      el.addEventListener("dragstart", (e) => e.preventDefault());
    });
    rail.addEventListener("dragstart", (e) => e.preventDefault(), true);
    rail.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      id = e.pointerId;
      x0 = e.clientX;
      s0 = rail.scrollLeft;
      moved = false;
      dragging = true;
      rail.classList.add("dragging");
      rail.setPointerCapture?.(id);
    });
    rail.addEventListener("pointermove", (e) => {
      if (!dragging || e.pointerId !== id) return;
      const dx = e.clientX - x0;
      if (Math.abs(dx) > 4) {
        moved = true;
        rail.scrollLeft = s0 - dx;
      }
    });
    const end = (e) => {
      if (!dragging || e.pointerId !== id) return;
      if (rail.hasPointerCapture?.(id)) rail.releasePointerCapture(id);
      dragging = false;
      id = null;
      rail.classList.remove("dragging");
      if (moved) {
        blockClick = true;
        setTimeout(() => (blockClick = false), 250);
      }
      syncArrows();
    };
    rail.addEventListener("pointerup", end);
    rail.addEventListener("pointercancel", end);
    rail.addEventListener(
      "click",
      (e) => {
        if (blockClick) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );
    rail.addEventListener("scroll", syncArrows, { passive: true });
    new ResizeObserver(syncArrows).observe(rail);
    syncArrows();
  }
  $$("[data-filter]").forEach((btn) =>
    btn.addEventListener("click", () => {
      const kind = btn.dataset.filter;
      $$("[data-filter]").forEach((b) => {
        b.classList.toggle("is-active", b === btn);
        b.setAttribute("aria-pressed", String(b === btn));
      });
      $$(".rail-item").forEach(
        (item) => (item.hidden = kind !== "all" && item.dataset.kind !== kind),
      );
      if (rail) {
        rail.scrollLeft = 0;
        requestAnimationFrame(syncArrows);
      }
    }),
  );
  if (reduce) {
    $$(".reveal,.chapter-image").forEach((el) =>
      el.classList.add("in", "shown"),
    );
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in", "shown");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.13, rootMargin: "0px 0px -25px 0px" },
    );
    $$(".reveal,.chapter-image,.editorial-card").forEach((el) =>
      observer.observe(el),
    );
  } else {
    $$(".reveal,.chapter-image").forEach((el) =>
      el.classList.add("in", "shown"),
    );
  }
  const sound = $("#sound"),
    live = $("#live"),
    rings = $$(".rings i"),
    lines = $$("[data-live-line]"),
    chapters = $$(".chapter");
  const notes = [
    [
      "Wide soundstage.",
      "Upgraded tweeters and waveguides spread music further across the room.",
    ],
    [
      "Enhanced bass.",
      "A redesigned bass port delivers deeper bass with greater control.",
    ],
    [
      "Dynamic Loudness.",
      "Balanced sound at every volume, from quiet listening to full power.",
    ],
  ];
  let lastNote = -1;
  function update() {
    if (!reduce) {
      chapters.forEach((ch) => {
        const im = $(".chapter-image img", ch);
        if (!im) return;
        const r = ch.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        const p = clamp((innerHeight - r.top) / (innerHeight + r.height));
        im.style.setProperty(
          "--media-offset",
          ((0.5 - p) * 42).toFixed(1) + "px",
        );
      });
    }
    if (sound) {
      const r = sound.getBoundingClientRect(),
        p = clamp(-r.top / Math.max(1, r.height - innerHeight));
      rings.forEach((ring, i) => {
        const phase = (p * 1.17 + i / rings.length) % 1;
        ring.style.transform = "scale(" + (0.5 + phase * 6.3).toFixed(3) + ")";
        ring.style.opacity = reduce
          ? ".22"
          : String((0.18 + 0.7 * Math.sin(phase * Math.PI)).toFixed(3));
      });
      const index = Math.min(2, Math.floor(p * 3));
      if (index !== lastNote) {
        lastNote = index;
        $$(".sound-chapter").forEach((el, i) =>
          el.classList.toggle("active", i === index),
        );
      }
    }
    if (live) {
      const r = live.getBoundingClientRect(),
        p = clamp(-r.top / Math.max(1, r.height - innerHeight)),
        idx = Math.min(2, Math.floor(p * 3));
      lines.forEach((line, i) =>
        line.classList.toggle("on", reduce || innerWidth <= 640 || i <= idx),
      );
    }
  }
  let requested = false;
  function tick() {
    if (requested) return;
    requested = true;
    requestAnimationFrame(() => {
      requested = false;
      update();
    });
  }
  window.addEventListener("scroll", tick, { passive: true });
  window.addEventListener("resize", tick);
  update();
})();
