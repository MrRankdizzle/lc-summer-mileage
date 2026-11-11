/* Little Chute Cross Country: shared behavior for every page. */
(function(){
  "use strict";
  var LC = window.LC = {};

  LC.MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  LC.MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  LC.DAYS = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
  LC.DAYS_FULL = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  // "2027-08-16" -> local Date at noon (so time zones never shift the day)
  LC.date = function(s){
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    if (!p) return null;
    var d = new Date(+p[1], +p[2] - 1, +p[3], 12);
    return isNaN(d.getTime()) ? null : d;
  };
  LC.today = function(){ var d = new Date(); d.setHours(12, 0, 0, 0); return d; };
  LC.esc = function(s){
    return String(s == null ? "" : s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  };
  LC.longDate = function(d){
    return LC.DAYS_FULL[d.getDay()] + ", " + LC.MONTHS_FULL[d.getMonth()] + " " + d.getDate();
  };
  // only allow ordinary web, mail and phone links from the data files
  LC.safeUrl = function(u){
    u = String(u || "").trim();
    return /^(https?:\/\/|mailto:|tel:|[\w./#-]+$)/i.test(u) && !/^javascript:/i.test(u) ? u : "";
  };

  // Which part of the year are we in? Fall = mid-August through early November.
  LC.season = function(d){
    d = d || LC.today();
    var m = d.getMonth(), day = d.getDate();
    if ((m === 7 && day >= 15) || m === 8 || m === 9 || (m === 10 && day <= 7)) return "fall";
    if (m === 10 || m === 11 || m === 0 || m === 1) return "winter";
    if (m >= 2 && m <= 4) return "spring";
    return "summer";
  };

  // reveal on scroll
  var els = document.querySelectorAll(".rv");
  if (els.length){
    var showAll = function(){ Array.prototype.forEach.call(els, function(e){ e.classList.add("in"); }); };
    if (!("IntersectionObserver" in window)){
      showAll();
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if (en.isIntersecting){ en.target.classList.add("in"); io.unobserve(en.target); }
        });
      }, { rootMargin:"0px 0px -6% 0px", threshold:0.04 });
      Array.prototype.forEach.call(els, function(e){ io.observe(e); });
      window.addEventListener("beforeprint", showAll);
    }
  }

  // optional hero photo, set in data/photos.js as window.HERO = { home:"img/photos/x.jpg", ... }
  var hp = document.getElementById("heroPhoto"), page = document.body.getAttribute("data-page");
  if (hp && window.HERO && window.HERO[page]){
    hp.style.backgroundImage = 'url("' + window.HERO[page] + '")';
    hp.removeAttribute("hidden");
    document.getElementById("hero").classList.add("has-photo");
  }

  // slideshow: an empty <div class="show"> filled from a list of { src, alt, caption }
  LC.slideshow = function(root, photos){
    if (!root || !photos || !photos.length) return;
    var i = 0, timer = null, playing = true;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.innerHTML = "";
    var figs = photos.map(function(p, n){
      var f = document.createElement("figure");
      var img = document.createElement("img");
      img.alt = p.alt || "Little Chute cross country"; img.decoding = "async";
      if (n < 2) img.src = p.src; else img.dataset.src = p.src;
      f.appendChild(img);
      if (p.caption){ var c = document.createElement("figcaption"); c.textContent = p.caption; f.appendChild(c); }
      root.appendChild(f); return f;
    });
    function btn(cls, label, text, fn){
      var b = document.createElement("button"); b.type = "button"; b.className = cls;
      b.setAttribute("aria-label", label); b.textContent = text; b.addEventListener("click", fn); return b;
    }
    var bar = document.createElement("div"); bar.className = "show-bar";
    var count = document.createElement("span"); count.className = "show-count";
    var pause = btn("show-pause", "Pause slideshow", "Pause", function(){ playing = !playing; sync(); });
    bar.appendChild(count); if (!reduce && photos.length > 1) bar.appendChild(pause);
    root.appendChild(bar);
    if (photos.length > 1){
      root.appendChild(btn("show-btn show-prev", "Previous photo", "‹", function(){ go(i - 1, true); }));
      root.appendChild(btn("show-btn show-next", "Next photo", "›", function(){ go(i + 1, true); }));
    }
    function load(n){
      var img = figs[(n + figs.length) % figs.length].firstChild;
      if (img.dataset.src){ img.src = img.dataset.src; delete img.dataset.src; }
    }
    function go(n, manual){
      i = (n + figs.length) % figs.length;
      figs.forEach(function(f, k){ f.classList.toggle("on", k === i); });
      load(i); load(i + 1);
      count.textContent = (i + 1) + " / " + figs.length;
      if (manual){ playing = false; sync(); }
    }
    function sync(){
      clearInterval(timer);
      pause.textContent = playing ? "Pause" : "Play";
      pause.setAttribute("aria-label", playing ? "Pause slideshow" : "Play slideshow");
      if (playing && !reduce && figs.length > 1) timer = setInterval(function(){ go(i + 1); }, 5000);
    }
    var x0 = null;
    root.addEventListener("touchstart", function(e){ x0 = e.touches[0].clientX; }, { passive:true });
    root.addEventListener("touchend", function(e){
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1), true);
    });
    root.removeAttribute("hidden");
    go(0); sync();
  };
})();
