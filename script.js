(function () {
  "use strict";

  /* =====================================================
     CONFIGURACIÓN
  ====================================================== */

  /* Fotos de la revista (ARCHIVO): una ruta por página.
     La primera es la tapa y la última la contratapa.
     Dejá "" para una página vacía. Ejemplo: "assets/fotos/1.jpg" */
  var FOTOS = [
    "",   // 1  tapa
    "",   // 2
    "",   // 3
    "",   // 4
    "",   // 5
    "",   // 6
    "",   // 7
    ""    // 8  contratapa
  ];

  /* Páginas de la revista con la foto con margen blanco */
  var CON_MARGEN = [2, 4, 5, 8];

  /* Selected Work: un bloque por proyecto.
     fotos: una ruta por imagen, ejemplo "assets/trabajos/1/1.jpg".
     Dejá "" para ver un recuadro vacío. Podés agregar o sacar fotos y proyectos. */
  var PROYECTOS = [
    {
      n: "01",
      titulo: "Project Name",
      sub: "Vivamus sed sapien",
      fecha: "March 2047",
      texto: "Praesent bibendum a elit non efficitur. Etiam et velit vitae quam aliquet fermentum. Quisque sit amet nulla dictum, cursus erat a, tempus est. Sed laoreet, magna eget mattis tincidunt.",
      fotos: ["", "", "", "", "", "", "", ""]
    },
    {
      n: "02",
      titulo: "Project Name",
      sub: "Vivamus sed sapien",
      fecha: "March 2047",
      texto: "Praesent bibendum a elit non efficitur. Etiam et velit vitae quam aliquet fermentum. Quisque sit amet nulla dictum, cursus erat a, tempus est. Sed laoreet, magna eget mattis tincidunt.",
      fotos: ["", "", "", "", "", "", "", ""]
    },
    {
      n: "03",
      titulo: "Project Name",
      sub: "Vivamus sed sapien",
      fecha: "March 2047",
      texto: "Praesent bibendum a elit non efficitur. Etiam et velit vitae quam aliquet fermentum. Quisque sit amet nulla dictum, cursus erat a, tempus est. Sed laoreet, magna eget mattis tincidunt.",
      fotos: ["", "", "", "", "", "", "", ""]
    }
  ];

  /* Experiments: un solo bloque con 20 imágenes (4 columnas).
     Ejemplo: "assets/experimentos/1.jpg" */
  var EXPERIMENTO = {
    titulo: "Lorem Ipsum Dolor",
    sub: "Vivamus sed sapien",
    fecha: "March 2047",
    texto: "Praesent bibendum a elit non efficitur. Etiam et velit vitae quam aliquet fermentum. Quisque sit amet nulla dictum, cursus erat a, tempus est. Sed laoreet, magna eget mattis tincidunt.",
    fotos: [
      "", "", "", "",
      "", "", "", "",
      "", "", "", "",
      "", "", "", "",
      "", "", "", ""
    ]
  };

  /* Posición de los íconos en % del escritorio crema: [x, y] = centro.
     Para acomodarlos: abrí el sitio con ?mover al final de la URL,
     arrastralos, tocá "Copiar posiciones" y pegá acá el resultado. */
  var POS = {
    logo:    [49, 30],
    about:   [19.5, 53],
    archivo: [34.7, 53],
    work:    [50, 53],
    sticker: [65.3, 53],
    exp:     [80.5, 53]
  };

  /* ===================================================== */

  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) { return String(s).replace(/"/g, "&quot;"); }

  var justDragged = 0;


  /* =====================================================
     ARRASTRAR (ventanas y revista)
  ====================================================== */
  function makeDraggable(handle, target, ignore) {
    var st = null;

    handle.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      if (ignore && e.target.closest(ignore)) return;
      st = {
        id: e.pointerId,
        sx: e.clientX,
        sy: e.clientY,
        x: target._x || 0,
        y: target._y || 0,
        moved: false
      };
    });

    window.addEventListener("pointermove", function (e) {
      if (!st || e.pointerId !== st.id) return;
      var dx = e.clientX - st.sx;
      var dy = e.clientY - st.sy;
      if (!st.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      st.moved = true;
      target._x = st.x + dx;
      target._y = st.y + dy;
      target.style.translate = target._x + "px " + target._y + "px";
    });

    function end(e) {
      if (!st || e.pointerId !== st.id) return;
      if (st.moved) justDragged = Date.now();
      st = null;
    }
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  }

  $$(".win").forEach(function (w) {
    makeDraggable($(".win-bar", w), w, ".dots");
  });
  makeDraggable($(".cv-wrap"), $(".cv-wrap"), "button");


  /* =====================================================
     ZOOM DE IMÁGENES
  ====================================================== */
  var lb = $("#lb");
  var lbImg = $("img", lb);

  function openLb(src) {
    lbImg.src = src;
    lb.classList.add("open");
  }
  function closeLb() {
    lb.classList.remove("open");
  }
  lb.addEventListener("click", function (e) {
    e.stopPropagation();
    closeLb();
  });


  /* =====================================================
     OVERLAYS: abrir y cerrar
  ====================================================== */
  var current = null;
  var openedAt = 0;

  function openOv(id) {
    var ov = $("#ov-" + id);
    if (!ov) return;
    if (current) closeOv();
    current = ov;
    openedAt = Date.now();

    var t = $("[data-move]", ov);
    if (t) { t._x = 0; t._y = 0; t.style.translate = ""; }

    ov.classList.add("open");
    ov.setAttribute("aria-hidden", "false");

    if (id === "cv") buildMag();
    if (id === "work") buildWork();
    if (id === "exp") buildExp();
  }

  function closeOv() {
    if (!current) return;
    current.classList.remove("open");
    current.setAttribute("aria-hidden", "true");
    current = null;
  }

  document.addEventListener("click", function (e) {
    var opener = e.target.closest("[data-open]");
    if (opener) { openOv(opener.getAttribute("data-open")); return; }

    if (!current) return;
    if (e.target.closest("[data-close]")) { closeOv(); return; }
    if (Date.now() - openedAt < 300) return;
    if (Date.now() - justDragged < 350) return;
    if (e.target.closest(".win, .cv-wrap, .lb")) return;

    closeOv(); /* clic afuera */
  });


  /* =====================================================
     SELECTED WORK
  ====================================================== */
  var workBuilt = false;

  function figuresHTML(fotos) {
    return fotos.map(function (src, i) {
      var inner = src
        ? '<img src="' + esc(src) + '" alt="" draggable="false">'
        : '<div class="ph"></div>';
      return '<figure>' + inner + '<figcaption>Image ' + (i + 1) + '</figcaption></figure>';
    }).join("");
  }

  function buildWork() {
    if (workBuilt) return;
    workBuilt = true;

    var list = $(".proj-list");
    list.innerHTML = PROYECTOS.map(function (p) {
      return '<section class="proj">' +
        '<div class="proj-head">' +
          '<b>' + p.n + ' &nbsp; ' + p.titulo + '</b>' +
          '<div>' + p.sub + '<br><i>' + p.fecha + '</i></div>' +
          '<p>' + p.texto + '</p>' +
        '</div>' +
        '<div class="gal">' + figuresHTML(p.fotos) + '</div>' +
      '</section>';
    }).join("");

    list.addEventListener("click", function (e) {
      var img = e.target.closest("figure img");
      if (img) openLb(img.getAttribute("src"));
    });
  }


  /* =====================================================
     EXPERIMENTS
  ====================================================== */
  var expBuilt = false;

  function buildExp() {
    if (expBuilt) return;
    expBuilt = true;

    var p = EXPERIMENTO;
    var body = $(".exp-body");
    body.innerHTML =
      '<div class="proj-head">' +
        '<b>' + p.titulo + '</b>' +
        '<div>' + p.sub + '<br><i>' + p.fecha + '</i></div>' +
        '<p>' + p.texto + '</p>' +
      '</div>' +
      '<div class="gal gal-4">' + figuresHTML(p.fotos) + '</div>';

    body.addEventListener("click", function (e) {
      var img = e.target.closest("figure img");
      if (img) openLb(img.getAttribute("src"));
    });
  }


  /* =====================================================
     REVISTA (ARCHIVO)
  ====================================================== */
  var mag = null;
  var STORE_KEY = "revista-flipped";

  function pageHTML(src, n) {
    var inner = src
      ? '<img src="' + esc(src) + '" alt="" draggable="false">'
      : '<div class="cv-empty">página ' + n + '</div>';
    var cls = "cv-page" + (CON_MARGEN.indexOf(n) !== -1 ? " inset" : "");
    return '<div class="' + cls + '">' + inner + '</div><span class="cv-num">' + n + '</span>';
  }

  function buildMag() {
    if (mag) return;

    var root = $(".cv-wrap");
    var book = $(".cv-book", root);
    var prevBtn = $(".cv-prev", root);
    var nextBtn = $(".cv-next", root);
    var foot = $(".cv-foot", root);
    var sheets = [];
    var flipped = 0;

    var pages = FOTOS.slice();
    if (pages.length % 2) pages.push("");

    for (var i = 0; i < pages.length; i += 2) {
      var sheet = document.createElement("div");
      sheet.className = "cv-sheet";
      sheet.innerHTML =
        '<div class="cv-face cv-front">' + pageHTML(pages[i], i + 1) + '</div>' +
        '<div class="cv-face cv-back">'  + pageHTML(pages[i + 1], i + 2) + '</div>';
      book.appendChild(sheet);
      sheets.push(sheet);
    }

    /* recuerda en qué página quedaste */
    try {
      var saved = parseInt(localStorage.getItem(STORE_KEY), 10);
      if (!isNaN(saved)) flipped = Math.max(0, Math.min(sheets.length, saved));
    } catch (e) {}

    function render() {
      var total = sheets.length;
      sheets.forEach(function (s, i) {
        var f = i < flipped;
        s.classList.toggle("is-flipped", f);
        s.style.zIndex = f ? i + 1 : total - i;
      });

      var shift = flipped === 0 ? "-25%" : flipped === total ? "25%" : "0";
      book.style.transform = "translateX(" + shift + ")";

      prevBtn.disabled = flipped === 0;
      nextBtn.disabled = flipped === total;

      var left = flipped * 2, right = left + 1, max = total * 2;
      foot.textContent = flipped === 0 ? "1 / " + max
        : flipped === total ? max + " / " + max
        : left + "–" + right + " / " + max;

      try { localStorage.setItem(STORE_KEY, String(flipped)); } catch (e) {}
    }

    function go(d) {
      var n = Math.max(0, Math.min(sheets.length, flipped + d));
      if (n === flipped) return;
      flipped = n;
      render();
    }

    book.addEventListener("click", function (e) {
      if (Date.now() - justDragged < 350) return;
      var r = book.getBoundingClientRect();
      if (e.clientX > r.left + r.width / 2) go(1); else go(-1);
    });
    prevBtn.addEventListener("click", function () { go(-1); });
    nextBtn.addEventListener("click", function () { go(1); });

    /* primer render sin animación */
    book.style.transition = "none";
    sheets.forEach(function (s) { s.style.transition = "none"; });
    render();
    void book.offsetWidth;
    book.style.transition = "";
    sheets.forEach(function (s) { s.style.transition = ""; });

    mag = { go: go };
  }


  /* =====================================================
     TECLADO
  ====================================================== */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lb.classList.contains("open")) { closeLb(); return; }
    if (!current) return;
    if (e.key === "Escape") { closeOv(); return; }
    if (current.id === "ov-cv" && mag) {
      if (e.key === "ArrowRight") mag.go(1);
      if (e.key === "ArrowLeft") mag.go(-1);
    }
  });


  /* =====================================================
     PHOTO BOOTH: mover y cambiar tamaño
  ====================================================== */
  (function () {
    var win = $("#photobooth");
    var bar = $(".pb-titlebar", win);
    var handle = $(".pb-resize-handle", win);
    var video = $("video", win);
    var x = 0, y = 0, width = win.getBoundingClientRect().width || 270;
    var op = null;

    function render() {
      win.style.translate = x + "px " + y + "px";
      win.style.width = width + "px";
    }

    function begin(e, type) {
      if (e.button !== 0 || op) return;
      e.preventDefault();
      op = { type: type, id: e.pointerId, sx: e.clientX, sy: e.clientY, x: x, y: y, w: width };
      e.currentTarget.setPointerCapture(e.pointerId);
    }

    bar.addEventListener("pointerdown", function (e) { begin(e, "move"); });
    handle.addEventListener("pointerdown", function (e) { begin(e, "resize"); });

    function update(e) {
      if (!op || e.pointerId !== op.id) return;
      if (op.type === "move") {
        x = op.x + e.clientX - op.sx;
        y = op.y + e.clientY - op.sy;
      } else {
        width = Math.max(190, Math.min(650, op.w + e.clientX - op.sx));
      }
      render();
    }
    function stop(e) { if (op && op.id === e.pointerId) op = null; }

    [bar, handle].forEach(function (el) {
      el.addEventListener("pointermove", update);
      el.addEventListener("pointerup", stop);
      el.addEventListener("pointercancel", stop);
    });

    /* reproducción continua */
    if (video) {
      video.muted = true;
      video.loop = true;
      var play = function () {
        if (!video.paused) return;
        var p = video.play();
        if (p && p.catch) p.catch(function () {});
      };
      video.addEventListener("loadeddata", play);
      document.addEventListener("visibilitychange", function () { if (!document.hidden) play(); });
      document.addEventListener("pointerdown", play, { once: true });
      play();
    }
  })();


  /* =====================================================
     ÍCONOS: posición libre
     Solo se pueden mover con ?mover en la URL.
     Sin eso, quedan fijos en las posiciones de POS.
  ====================================================== */
  (function () {
    var desk = $("#desk");
    var items = $$(".ico", desk);
    var mode = /[?&]mover\b/.test(location.search);
    var KEY = "desk-pos-v1";
    var pos = {};
    var saved = null;

    function clamp(v) { return Math.max(0, Math.min(100, v)); }
    function round(v) { return Math.round(v * 10) / 10; }
    function place(el, p) { el.style.left = p[0] + "%"; el.style.top = p[1] + "%"; }

    if (mode) {
      try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
    }

    items.forEach(function (el) {
      var id = el.getAttribute("data-id");
      var p = (saved && saved[id]) || POS[id] || [50, 50];
      pos[id] = [p[0], p[1]];
      place(el, pos[id]);
    });

    if (!mode) return;

    desk.classList.add("desk-edit");

    var drag = null, z = 10, blockClick = 0;

    desk.addEventListener("pointerdown", function (e) {
      if (e.button !== 0) return;
      var el = e.target.closest(".ico");
      if (!el) return;
      var id = el.getAttribute("data-id");
      var r = desk.getBoundingClientRect();
      drag = {
        el: el, id: id, pid: e.pointerId,
        sx: e.clientX, sy: e.clientY,
        x: pos[id][0], y: pos[id][1],
        w: r.width, h: r.height, moved: false
      };
      el.style.zIndex = ++z;
      e.preventDefault();
      try { el.setPointerCapture(e.pointerId); } catch (err) {}
    });

    desk.addEventListener("pointermove", function (e) {
      if (!drag || e.pointerId !== drag.pid) return;
      var dx = e.clientX - drag.sx;
      var dy = e.clientY - drag.sy;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 5) return;
      drag.moved = true;
      pos[drag.id] = [
        round(clamp(drag.x + dx / drag.w * 100)),
        round(clamp(drag.y + dy / drag.h * 100))
      ];
      place(drag.el, pos[drag.id]);
    });

    function end(e) {
      if (!drag || e.pointerId !== drag.pid) return;
      if (drag.moved) {
        blockClick = Date.now();
        try { localStorage.setItem(KEY, JSON.stringify(pos)); } catch (err) {}
      }
      drag = null;
    }
    desk.addEventListener("pointerup", end);
    desk.addEventListener("pointercancel", end);

    /* el clic que termina un arrastre no abre el ícono */
    document.addEventListener("click", function (e) {
      if (Date.now() - blockClick < 300) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    }, true);

    /* botones de ayuda */
    var bar = document.createElement("div");
    bar.className = "desk-tools";
    bar.innerHTML =
      '<button type="button" data-a="copy">Copiar posiciones</button>' +
      '<button type="button" data-a="reset">Reiniciar</button>';
    document.body.appendChild(bar);

    bar.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;

      if (b.getAttribute("data-a") === "copy") {
        var ids = Object.keys(pos);
        var text = "var POS = {\n" + ids.map(function (id) {
          return "    " + id + ": [" + pos[id][0] + ", " + pos[id][1] + "]";
        }).join(",\n") + "\n  };";
        var done = function () {
          b.textContent = "¡Copiado!";
          setTimeout(function () { b.textContent = "Copiar posiciones"; }, 1500);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, function () { window.prompt("Copiá esto:", text); });
        } else {
          window.prompt("Copiá esto:", text);
        }
      } else {
        try { localStorage.removeItem(KEY); } catch (err) {}
        items.forEach(function (el) {
          var id = el.getAttribute("data-id");
          pos[id] = (POS[id] || [50, 50]).slice();
          place(el, pos[id]);
        });
      }
    });
  })();


  /* =====================================================
     RELOJ DEL FOOTER
  ====================================================== */
  (function () {
    var el = $("#clock");
    if (!el) return;
    var months = ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"];

    function tick() {
      var d = new Date();
      var h = d.getHours();
      var period = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      el.textContent =
        ("0" + d.getDate()).slice(-2) + " " + months[d.getMonth()] + " " + d.getFullYear() + " " +
        h + ":" + ("0" + d.getMinutes()).slice(-2) + " " + period;
    }
    tick();
    setInterval(tick, 15000);
  })();

})();
