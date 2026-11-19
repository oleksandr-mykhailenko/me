/* Ambient sea life: low-poly creatures drift in at random spots, swim a little, then fade away. */
(() => {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const C = {
    fish: (a, b, c) => `<svg viewBox="0 0 80 44">
      <polygon points="8,22 26,6 40,22" fill="${a}"/><polygon points="8,22 40,22 26,38" fill="${b}"/>
      <polygon points="26,6 58,10 40,22" fill="${b}"/><polygon points="40,22 58,10 64,22" fill="${a}"/>
      <polygon points="40,22 64,22 54,34" fill="${c}"/><polygon points="26,38 40,22 54,34" fill="${a}"/>
      <polygon points="64,22 78,8 74,22" fill="${c}"/><polygon points="64,22 74,22 78,36" fill="${b}"/>
      <circle cx="18" cy="19" r="2.6" fill="#1d2b45"/></svg>`,

    whale: () => `<svg viewBox="0 0 220 90">
      <polygon points="6,30 40,14 46,48" fill="#c7dcef"/><polygon points="6,30 46,48 10,58" fill="#a9c6e3"/>
      <polygon points="40,14 100,12 46,48" fill="#b6d0ea"/><polygon points="46,48 100,12 120,46" fill="#9ebcdc"/>
      <polygon points="10,58 46,48 60,72" fill="#8fb0d4"/><polygon points="46,48 120,46 60,72" fill="#a2c0df"/>
      <polygon points="100,12 150,26 120,46" fill="#9cb9da"/><polygon points="120,46 150,26 176,44" fill="#8aa9cf"/>
      <polygon points="60,72 120,46 140,66" fill="#89a8cd"/><polygon points="120,46 176,44 140,66" fill="#7f9fc6"/>
      <polygon points="176,44 214,18 200,46" fill="#9cb9da"/><polygon points="176,44 200,46 214,72" fill="#7f9fc6"/>
      <polygon points="70,66 92,82 98,62" fill="#7896bf"/>
      <circle cx="26" cy="32" r="3.2" fill="#1d2b45"/></svg>`,

    jelly: (a, b) => `<svg viewBox="0 0 60 90">
      <polygon points="4,30 16,8 30,4 30,32" fill="${a}"/><polygon points="30,4 44,8 56,30 30,32" fill="${b}"/>
      <polygon points="4,30 30,32 56,30 30,38" fill="${a}" opacity=".85"/>
      <g fill="none" stroke="${a}" stroke-width="2.4" stroke-linecap="round" opacity=".9">
        <path class="t" d="M14 36 q-5 12 0 24 q5 12 0 24"/><path class="t" d="M30 38 q5 12 0 24 q-5 12 0 24"/>
        <path class="t" d="M46 36 q-5 12 0 24 q5 12 0 24"/></g></svg>`,

    turtle: () => `<svg viewBox="0 0 90 70">
      <polygon points="8,20 18,12 22,24" fill="#8fc9a5"/><polygon points="8,50 22,46 18,58" fill="#8fc9a5"/>
      <polygon points="70,22 84,16 80,30" fill="#8fc9a5"/><polygon points="70,48 80,40 84,54" fill="#8fc9a5"/>
      <polygon points="20,35 40,14 46,35" fill="#c3a26b"/><polygon points="40,14 64,18 46,35" fill="#b08e58"/>
      <polygon points="20,35 46,35 40,56" fill="#a98752"/><polygon points="46,35 64,52 40,56" fill="#c3a26b"/>
      <polygon points="46,35 64,18 72,35" fill="#c9ab76"/><polygon points="46,35 72,35 64,52" fill="#b08e58"/>
      <polygon points="4,35 14,28 20,35 14,42" fill="#9fd6b4"/><circle cx="10" cy="33" r="1.6" fill="#1d2b45"/></svg>`,

    bubbles: () => `<svg viewBox="0 0 40 90" fill="none" stroke="#fff" stroke-width="2" opacity=".8">
      <circle cx="20" cy="78" r="7"/><circle cx="12" cy="52" r="5"/><circle cx="24" cy="30" r="4"/><circle cx="16" cy="10" r="3"/></svg>`
  };

  const FISH = [["#ff8a75","#ffb19f","#e86f5a"],["#ffd36e","#ffe49b","#f2b94a"],["#a8e0d8","#cdeee9","#7fc8bd"],["#c9b8f5","#ddd2fa","#a993ea"]];
  const JELLY = [["#f6b8d1","#fbd3e3"],["#c9b8f5","#e0d6fb"],["#a8e0e6","#cdeff2"]];
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rnd = (a, b) => a + Math.random() * (b - a);

  const layer = document.createElement("div");
  layer.className = "sea";
  layer.setAttribute("aria-hidden", "true");
  document.body.prepend(layer);

  const MAX = innerWidth < 700 ? 2 : 4;
  let live = 0;

  function spawn() {
    if (document.hidden || live >= MAX) return;
    const roll = Math.random();
    const type = roll < .42 ? "fish" : roll < .62 ? "jelly" : roll < .76 ? "whale" : roll < .88 ? "turtle" : "bubbles";
    const el = document.createElement("div");
    el.className = "critter " + type;
    const dir = Math.random() < .5 ? 1 : -1;           // 1 = swims right
    const size = { fish: rnd(46, 74), jelly: rnd(40, 62), whale: rnd(150, 220), turtle: rnd(60, 84), bubbles: rnd(22, 32) }[type];
    el.innerHTML = type === "fish" ? C.fish(...pick(FISH)) : type === "jelly" ? C.jelly(...pick(JELLY)) : C[type]();
    el.style.width = size + "px";
    el.style.left = rnd(-4, 92) + "vw";
    el.style.top = rnd(type === "whale" ? 30 : 8, 86) + "vh";

    const horizontal = type === "fish" || type === "whale" || type === "turtle";
    const dist = horizontal ? rnd(120, 320) * dir : 0;
    const rise = type === "jelly" ? -rnd(60, 140) : type === "bubbles" ? -rnd(120, 220) : rnd(-30, 30);
    const flip = horizontal && dir === 1 ? -1 : 1;     // art faces left
    const dur = { fish: rnd(6, 9), jelly: rnd(8, 12), whale: rnd(11, 15), turtle: rnd(10, 13), bubbles: rnd(4, 6) }[type] * 1000;

    layer.appendChild(el); live++;
    const anim = el.animate([
      { opacity: 0, transform: `translate(0,0) scaleX(${flip}) scale(.85)` },
      { opacity: 1, offset: .18, transform: `translate(${dist * .18}px,${rise * .18}px) scaleX(${flip}) scale(1)` },
      { opacity: 1, offset: .78, transform: `translate(${dist * .78}px,${rise * .78}px) scaleX(${flip}) scale(1)` },
      { opacity: 0, transform: `translate(${dist}px,${rise}px) scaleX(${flip}) scale(.9)` }
    ], { duration: dur, easing: "ease-in-out", fill: "forwards" });
    anim.onfinish = () => { el.remove(); live--; };
  }

  setTimeout(spawn, 600);
  setTimeout(spawn, 1800);
  setInterval(spawn, 2600);
})();
