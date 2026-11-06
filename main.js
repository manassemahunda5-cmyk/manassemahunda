(function () {
  var $ = function (s, r) { return (r || document).querySelector(s); };
  $("#yr").textContent = new Date().getFullYear();

  // marquee: duplicate content for a seamless loop
  var t = $("#track");
  t.innerHTML = t.innerHTML + t.innerHTML;

  // scroll reveal (content stays visible at rest)
  var els = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add("in"); }); }

  // active nav link
  var links = document.querySelectorAll(".pill a");
  var secs = ["about", "work", "process", "contact"].map(function (id) { return document.getElementById(id); });
  window.addEventListener("scroll", function () {
    var y = window.scrollY + 200, cur = null;
    secs.forEach(function (s) { if (s && s.offsetTop <= y) cur = s.id; });
    links.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }, { passive: true });

  // work hover preview
  var grads = {
    a: "linear-gradient(135deg,#1455B5,#0B3A82)",
    b: "linear-gradient(135deg,#0B3A82,#000000)",
    c: "linear-gradient(135deg,#2F72D0,#0B3A82)",
    d: "linear-gradient(135deg,#1455B5,#041433)"
  };
  var peek = $("#peek"), lbl = $("#peekLbl");
  document.querySelectorAll(".row").forEach(function (r) {
    r.addEventListener("mouseenter", function () { peek.style.background = grads[r.dataset.g]; lbl.textContent = r.dataset.l; peek.classList.add("on"); });
    r.addEventListener("mouseleave", function () { peek.classList.remove("on"); });
    r.addEventListener("mousemove", function (e) { peek.style.left = (e.clientX + 120) + "px"; peek.style.top = e.clientY + "px"; });
  });

  // pin-a-note board (visitor notes live in this viewer's browser)
  var KEY = "mm-notes2", board = $("#board"), form = $("#noteForm"), notes = [];
  var PIN = '<svg class="pin" viewBox="0 0 30 36" aria-hidden="true"><circle cx="15" cy="12" r="10" fill="#1455B5"/><circle cx="11.5" cy="8.5" r="3" fill="#8DB4F0" opacity=".85"/><path d="M15 21v13" stroke="#555" stroke-width="2.4" stroke-linecap="round"/></svg>';
  try { notes = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch (e) { notes = []; }
  function add(n, animate) {
    var el = document.createElement("div");
    el.className = "sticky v";
    el.style.setProperty("--c", n.c); el.style.setProperty("--r", n.r + "deg");
    el.style.setProperty("--x", n.x + "%"); el.style.setProperty("--y", n.y + "%");
    if (!animate) el.style.animation = "none";
    el.innerHTML = PIN;
    var p = document.createElement("p"); p.textContent = n.t;
    var s = document.createElement("small"); s.textContent = "— " + (n.n || "a visitor");
    el.appendChild(p); el.appendChild(s); board.appendChild(el);
    var all = board.querySelectorAll(".sticky.v"); if (all.length > 12) all[0].remove();
  }
  notes.forEach(function (n) { add(n, false); });
  form.addEventListener("change", function (e) {
    if (e.target.name === "c") form.style.setProperty("--sel", e.target.value);
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var v = $("#noteText").value.trim(); if (!v) return;
    var c = ($("input[name=c]:checked") || {}).value || "#CFE0F7";
    var n = { t: v, n: $("#noteName").value.trim(), c: c, r: (Math.random() * 10 - 5).toFixed(1), x: Math.round(3 + Math.random() * 74), y: Math.round(4 + Math.random() * 68) };
    notes.push(n); notes = notes.slice(-12); add(n, true);
    try { localStorage.setItem(KEY, JSON.stringify(notes)); } catch (er) {}
    $("#noteText").value = "";
  });

  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  // nav hides on scroll down, returns on scroll up
  var nav = $(".nav"), lastY = window.scrollY;
  window.addEventListener("scroll", function () {
    var y = window.scrollY;
    if (y > lastY + 8 && y > 240) nav.classList.add("hide");
    else if (y < lastY - 8 || y < 120) nav.classList.remove("hide");
    lastY = y;
  }, { passive: true });

  // hero pointer parallax
  var hero = $(".hero");
  if (!reduce && window.matchMedia("(hover: hover)").matches) {
    hero.addEventListener("mousemove", function (e) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - .5) * 2);
      hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - .5) * 2);
    });
    hero.addEventListener("mouseleave", function () { hero.style.setProperty("--px", 0); hero.style.setProperty("--py", 0); });
    // magnetic buttons
    document.querySelectorAll(".btn.pri").forEach(function (b) {
      b.addEventListener("mousemove", function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = "translate(" + ((e.clientX - r.left - r.width / 2) * .22) + "px," + ((e.clientY - r.top - r.height / 2) * .32) + "px)";
      });
      b.addEventListener("mouseleave", function () { b.style.transform = ""; });
    });
  }

  // word-by-word heading reveal
  document.querySelectorAll(".h-xl, .cta h2").forEach(function (h) {
    var i = 0, nodes = Array.prototype.slice.call(h.childNodes);
    h.textContent = "";
    nodes.forEach(function (n) {
      if (n.nodeType === 3) {
        n.textContent.split(/\s+/).filter(Boolean).forEach(function (word) {
          var w = document.createElement("span"); w.className = "w";
          var wi = document.createElement("span"); wi.className = "wi"; wi.style.setProperty("--i", i++); wi.textContent = word;
          w.appendChild(wi); h.appendChild(w); h.appendChild(document.createTextNode(" "));
        });
      } else { h.appendChild(n); }
    });
    h.classList.add("split");
    if ("IntersectionObserver" in window) {
      var o = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { h.classList.add("in"); o.disconnect(); } }); }, { threshold: .2 });
      o.observe(h);
    } else { h.classList.add("in"); }
  });

  // footer: pills fall and stack, drag them around
  var pile = $("#pile");
  var tags = [["Product thinking", "✦"], ["UI / UX", "◐"], ["Design systems", "◆"], ["Visual design", "✺"], ["System thinking", "↗"], ["AI workflows", "✧"], ["Prototyping", "◎"], ["Web design", "▣"], ["Interaction design", "✢"], ["Mobile apps", "◍"], ["Improving UX", "☺"], ["Accessibility", "◉"], ["User research", "❋"]];
  var cols = [["#1455B5", "#fff"], ["#8DB4F0", "#000000"], ["#E4EDFB", "#000000"], ["#0B3A82", "#fff"], ["#CFE0F7", "#000000"], ["#3F7FD8", "#000000"]];
  var els = tags.map(function (t, i) {
    var e = document.createElement("div");
    e.className = "ptag";
    e.style.setProperty("--bg-t", cols[i % cols.length][0]);
    e.style.setProperty("--fg-t", cols[i % cols.length][1]);
    var s = document.createElement("span"); s.textContent = t[0];
    var ic = document.createElement("i"); ic.textContent = t[1]; ic.setAttribute("aria-hidden", "true");
    e.appendChild(s); e.appendChild(ic); pile.appendChild(e);
    return e;
  });

  function startPhysics() {
    var M = window.Matter;
    var W = pile.clientWidth, H = pile.clientHeight, wall = 80;
    var engine = M.Engine.create(); engine.gravity.y = 1.15;
    var o = { isStatic: true };
    var floor = M.Bodies.rectangle(W / 2, H + wall / 2, W * 4, wall, o);
    var left = M.Bodies.rectangle(-wall / 2, H / 2, wall, H * 8, o);
    var right = M.Bodies.rectangle(W + wall / 2, H / 2, wall, H * 8, o);
    M.Composite.add(engine.world, [floor, left, right]);
    var items = [], visible = true;

    els.forEach(function (el, i) {
      setTimeout(function () {
        var w = el.offsetWidth, h = el.offsetHeight;
        var b = M.Bodies.rectangle(Math.max(w / 2 + 4, Math.min(W - w / 2 - 4, W * (.12 + Math.random() * .76))), -h - 20, w, h, { chamfer: { radius: h / 2 }, restitution: .32, friction: .45, frictionAir: .012, angle: (Math.random() - .5) * 1.3 });
        M.Composite.add(engine.world, b);
        items.push({ el: el, b: b, w: w, h: h });
        el.style.opacity = 1;
      }, i * 170);
    });

    // kick: sweeping the cursor through the pills pushes them the way it moves; a click pops them up
    var last = null;
    function near(p, it) {
      var dx = p.x - it.b.position.x, dy = p.y - it.b.position.y;
      return Math.sqrt(dx * dx + dy * dy) < Math.max(it.h * .95, 42) + it.w * .12;
    }
    function push(it, vx, vy, p) {
      var b = it.b, nx = b.velocity.x + vx, ny = b.velocity.y + vy, m = Math.sqrt(nx * nx + ny * ny);
      if (m > 34) { nx *= 34 / m; ny *= 34 / m; }
      M.Body.setVelocity(b, { x: nx, y: ny });
      var side = p.x < b.position.x ? 1 : -1;
      M.Body.setAngularVelocity(b, b.angularVelocity + (vx * .004 + vy * .002 * side) * (side));
    }
    function local(e) { var r = pile.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; }
    pile.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var p = local(e);
      if (last) {
        var vx = (p.x - last.x) * .55, vy = (p.y - last.y) * .55;
        if (Math.abs(vx) + Math.abs(vy) > 1.5) items.forEach(function (it) { if (near(p, it)) push(it, vx, vy, p); });
      }
      last = p;
    });
    pile.addEventListener("pointerleave", function () { last = null; });
    pile.addEventListener("pointerdown", function (e) {
      var p = local(e);
      items.forEach(function (it) { if (near(p, it)) push(it, (it.b.position.x - p.x) * .08 + (Math.random() - .5) * 4, -14 - Math.random() * 6, p); });
    });

    new IntersectionObserver(function (es) { visible = es[0].isIntersecting; }).observe(pile);
    window.addEventListener("resize", function () {
      W = pile.clientWidth; H = pile.clientHeight;
      M.Body.setPosition(floor, { x: W / 2, y: H + wall / 2 });
      M.Body.setPosition(right, { x: W + wall / 2, y: H / 2 });
      M.Body.setPosition(left, { x: -wall / 2, y: H / 2 });
    });

    (function tick() {
      if (visible) {
        M.Engine.update(engine, 1000 / 60);
        items.forEach(function (it) {
          it.el.style.transform = "translate(" + (it.b.position.x - it.w / 2) + "px," + (it.b.position.y - it.h / 2) + "px) rotate(" + it.b.angle + "rad)";
        });
      }
      requestAnimationFrame(tick);
    })();
  }

  if (window.Matter && !reduce && "IntersectionObserver" in window) {
    var started = false;
    new IntersectionObserver(function (es, ob) {
      if (!started && es[0].isIntersecting) { started = true; ob.disconnect(); startPhysics(); }
    }, { threshold: .3 }).observe(pile);
  } else {
    pile.classList.add("static");
  }
})();
