/* 3D + pointer effects. Desktop/fine-pointer only; skipped for reduced motion. */
(function () {
  var rm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s) };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)) };
  /* clock (not motion) */
  var lg = $("#lagos");
  function clk() { if (lg) lg.textContent = "Lagos, Nigeria · " + new Date().toLocaleTimeString("en-GB", { timeZone: "Africa/Lagos", hour: "2-digit", minute: "2-digit" }) }
  clk(); setInterval(clk, 30000);
  if (rm) return;

  /* header: hide on scroll down, return on scroll up */
  var hd = $("header"), ly = scrollY;
  addEventListener("scroll", function () { var y = scrollY; if (hd) { hd.classList.toggle("sc", y > 40); hd.classList.toggle("hd", y > ly && y > 260); } ly = y }, { passive: true });

  /* pinned horizontal scroll for the project gallery (desktop) */
  var hz = $("#work.hz"), gal = $("#gal"), pgi = $("#pgi"), dist = 0;
  function sizeHz() {
    if (!hz || !gal) return;
    if (innerWidth < 900) { hz.classList.remove("on"); gal.style.transform = ""; return }
    hz.classList.add("on"); gal.style.transform = "";
    dist = Math.max(0, gal.scrollWidth - innerWidth + 40);
    hz.style.setProperty("--hh", (dist + innerHeight) + "px");
    moveHz();
  }
  function moveHz() {
    if (!hz || !hz.classList.contains("on")) return;
    var p = Math.min(1, Math.max(0, (scrollY - hz.offsetTop) / Math.max(1, dist)));
    gal.style.transform = "translate3d(" + (-p * dist).toFixed(1) + "px,0,0)";
    if (pgi) pgi.style.width = (12 + p * 88) + "%";
    flow();
  }
  addEventListener("scroll", moveHz, { passive: true });
  addEventListener("resize", sizeHz);

  /* 1. coverflow: cards in the gallery rotate in 3D by distance from the centre */
  var g = $("#gal");
  var cards = $$(".cd");
  function flow() {
    if (!g) return;
    var pin = hz && hz.classList.contains("on"), gr = pin ? { left: 0, width: innerWidth } : g.getBoundingClientRect(), mid = gr.left + gr.width / 2;
    cards.forEach(function (c) {
      var r = c.getBoundingClientRect(), d = ((r.left + r.width / 2) - mid) / (gr.width * .75);
      d = Math.max(-1, Math.min(1, d));
      c.style.setProperty("--ry", (-d * 16).toFixed(2) + "deg");
      c.style.setProperty("--sc", (1 - Math.abs(d) * .07).toFixed(3));
      c.style.setProperty("--tz", (-Math.abs(d) * 60).toFixed(1) + "px");
    });
  }
  if (g) { g.addEventListener("scroll", flow, { passive: true }); addEventListener("resize", flow); flow(); }
  addEventListener("load", function () { sizeHz() }); setTimeout(sizeHz, 600);

  if (!fine) return;

  /* 2. card tilt with a moving glare, content floats on its own layer */
  cards.forEach(function (c) {
    var im = $(".im", c), gl = document.createElement("i"); gl.className = "gl"; im.appendChild(gl);
    c.addEventListener("pointermove", function (e) {
      var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.setProperty("--tx", (-y * 14).toFixed(2) + "deg"); c.style.setProperty("--ty", (x * 14).toFixed(2) + "deg");
      gl.style.background = "radial-gradient(circle at " + ((x + .5) * 100) + "% " + ((y + .5) * 100) + "%,rgba(255,255,255,.28),transparent 55%)";
    });
    c.addEventListener("pointerleave", function () { c.style.setProperty("--tx", "0deg"); c.style.setProperty("--ty", "0deg"); gl.style.background = "none" });
  });

  /* 3. pointer parallax on the full-screen animation: the portrait leans toward the cursor */
  var cv = $("#seq"), mx = 0, my = 0, px = 0, py = 0;
  addEventListener("pointermove", function (e) { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5 }, { passive: true });

  /* 4. custom cursor ring */
  var ring = document.createElement("div"); ring.id = "cur"; ring.setAttribute("aria-hidden", "true"); ring.innerHTML = "<span></span>";
  document.body.appendChild(ring); var lab = ring.firstChild, cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
  addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; ring.classList.add("on") }, { passive: true });
  document.addEventListener("pointerleave", function () { ring.classList.remove("on") });
  document.addEventListener("pointerover", function (e) {
    var t = e.target.closest("a,button,.gal"); var card = e.target.closest(".cd,.wl a");
    ring.classList.toggle("lk", !!t && !card && !e.target.closest(".gal"));
    ring.classList.toggle("vw", !!card);
    ring.classList.toggle("dr", !card && !!e.target.closest(".gal"));
    lab.textContent = card ? "View" : (e.target.closest(".gal") ? "Drag" : "");
  });

  /* 5. magnetic buttons */
  $$(".talk,.ct .row a,.ct .em").forEach(function (b) {
    b.addEventListener("pointermove", function (e) { var r = b.getBoundingClientRect(); b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .22).toFixed(1) + "px," + ((e.clientY - r.top - r.height / 2) * .3).toFixed(1) + "px)" });
    b.addEventListener("pointerleave", function () { b.style.transform = "" });
  });

  /* 6. projects page: the preview follows the cursor */
  $$(".wl a").forEach(function (a) {
    var im = $("img", a);
    a.addEventListener("pointermove", function (e) {
      var r = a.getBoundingClientRect();
      im.style.left = (e.clientX - r.left + 28) + "px"; im.style.top = (e.clientY - r.top) + "px"; im.style.right = "auto";
      im.style.setProperty("--rx", (((e.clientX - r.left) / r.width - .5) * 10).toFixed(1) + "deg");
    });
  });

  (function loop() {
    cx += (tx - cx) * .2; cy += (ty - cy) * .2; ring.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)";
    px += (mx - px) * .06; py += (my - py) * .06;
    if (cv) cv.style.transform = "translate3d(" + (-px * 34).toFixed(1) + "px," + (-py * 22).toFixed(1) + "px,0) scale(1.07) rotateY(" + (px * 3).toFixed(2) + "deg)";
    requestAnimationFrame(loop);
  })();
})();
