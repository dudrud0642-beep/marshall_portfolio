(() => {
  const sec = document.querySelector("[data-feature-focus]");
  if (!sec) return;
  const frames = [...sec.querySelectorAll("[data-focus-frame]")],
    copies = [...sec.querySelectorAll("[data-focus-copy]")],
    nav = [...sec.querySelectorAll("[data-focus-nav]")],
    count = sec.querySelector("[data-focus-current]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let last = -1;
  const clamp = (v) => Math.max(0, Math.min(1, v));
  function set(i) {
    if (i === last) return;
    last = i;
    frames.forEach((x, n) => x.classList.toggle("active", n === i));
    copies.forEach((x, n) => x.classList.toggle("active", n === i));
    nav.forEach((x, n) => x.classList.toggle("active", n === i));
    if (count) count.textContent = "0" + (i + 1);
  }
  function update() {
    const r = sec.getBoundingClientRect(),
      travel = Math.max(1, r.height - innerHeight),
      p = clamp(-r.top / travel),
      i = Math.min(2, Math.floor(p * 3));
    set(i);
  }
  nav.forEach((b, i) =>
    b.addEventListener("click", () => {
      const top =
        scrollY +
        sec.getBoundingClientRect().top +
        (sec.offsetHeight - innerHeight) * (i / 2);
      scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    }),
  );
  addEventListener("scroll", () => requestAnimationFrame(update), {
    passive: true,
  });
  addEventListener("resize", update);
  update();
})();
