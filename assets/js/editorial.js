(() => {
  const track = document.querySelector("[data-lives-track]"),
    prev = document.querySelector("[data-lives-prev]"),
    next = document.querySelector("[data-lives-next]");
  if (track) {
    const step = () => {
      const card = track.querySelector(".lives-card");
      return card ? card.getBoundingClientRect().width + 18 : 500;
    };
    prev?.addEventListener("click", () =>
      track.scrollBy({ left: -step(), behavior: "smooth" }),
    );
    next?.addEventListener("click", () =>
      track.scrollBy({ left: step(), behavior: "smooth" }),
    );
    let down = false,
      x = 0,
      start = 0,
      pid = null;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      down = true;
      pid = e.pointerId;
      x = e.clientX;
      start = track.scrollLeft;
      track.classList.add("dragging");
      track.setPointerCapture?.(pid);
    });
    track.addEventListener("pointermove", (e) => {
      if (!down || e.pointerId !== pid) return;
      track.scrollLeft = start - (e.clientX - x);
    });
    const end = () => {
      down = false;
      track.classList.remove("dragging");
      pid = null;
    };
    track.addEventListener("pointerup", end);
    track.addEventListener("pointercancel", end);
  }
  const stories = [...document.querySelectorAll("[data-feature-story]")];
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const tick = () => {
      stories.forEach((story) => {
        const media = story.querySelector(
          ".feature-media img,.feature-bass-bg img",
        );
        if (!media) return;
        const r = story.getBoundingClientRect();
        const p = Math.max(
          -1,
          Math.min(1, (innerHeight / 2 - (r.top + r.height / 2)) / innerHeight),
        );
        media.style.setProperty("--feature-y", (p * 18).toFixed(1) + "px");
      });
    };
    addEventListener("scroll", () => requestAnimationFrame(tick), {
      passive: true,
    });
    tick();
  }
})();
