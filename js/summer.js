
(function(){
  "use strict";

  var CLUBS = {
    "150": { total:150, days:"5 days a week", weeks:[
      {m:10, d:"2",   l:"3"},
      {m:15, d:"3",   l:"4"},
      {m:18, d:"3.6", l:"4–5"},
      {m:12, d:"2.4", l:"3–4"},
      {m:20, d:"4",   l:"5–6"},
      {m:14, d:"2.8", l:"3–4"},
      {m:16, d:"3.2", l:"4–5"},
      {m:18, d:"3.6", l:"4–5"},
      {m:20, d:"4",   l:"6"},
      {m:7,  runs:2},
      {m:14, d:"2.8", l:"4–5"}
    ]},
    "200": { total:200, days:"6 days a week", weeks:[
      {m:15, d:"2.5", l:"3–4"},
      {m:18, d:"3",   l:"4–5"},
      {m:24, d:"4",   l:"6–7"},
      {m:15, d:"2.5", l:"4–5"},
      {m:22, d:"3.6", l:"5–6"},
      {m:26, d:"4.3", l:"6–7"},
      {m:16, d:"2.6", l:"4–5"},
      {m:24, d:"4",   l:"6–7"},
      {m:30, d:"5",   l:"8"},
      {m:10, runs:3},
      {m:24, d:"4",   l:"6–7"}
    ]},
    "300": { total:300, days:"6 days a week", weeks:[
      {m:25, d:"4.1", l:"6–7"},
      {m:28, d:"4.6", l:"7–8"},
      {m:34, d:"5.6", l:"8–9"},
      {m:25, d:"4.1", l:"6–7"},
      {m:32, d:"5.3", l:"8–9"},
      {m:36, d:"6",   l:"9–10"},
      {m:28, d:"4.6", l:"7–8"},
      {m:40, d:"6.6", l:"10"},
      {m:34, d:"5.6", l:"9"},
      {m:20, runs:3},
      {m:34, d:"5.6", l:"9"}
    ]},
    "400": { total:400, days:"6 days a week", weeks:[
      {m:26, d:"4.3", l:"6–7"},
      {m:34, d:"5.6", l:"7–8"},
      {m:42, d:"7",   l:"10"},
      {m:40, d:"6.6", l:"10"},
      {m:36, d:"6",   l:"8"},
      {m:40, d:"6.6", l:"10"},
      {m:40, d:"6.6", l:"10"},
      {m:40, d:"6.6", l:"10"},
      {m:40, d:"6.6", l:"10"},
      {m:21, runs:3},
      {m:40, d:"6.6", l:"10"}
    ]},
    "500": { total:500, days:"6 days a week", weeks:[
      {m:34, d:"5.66",l:"7–8"},
      {m:40, d:"6.6", l:"8"},
      {m:48, d:"8",   l:"10"},
      {m:44, d:"7.3", l:"10"},
      {m:48, d:"8",   l:"8"},
      {m:46, d:"7.6", l:"9"},
      {m:50, d:"8.3", l:"11"},
      {m:46, d:"7.6", l:"10"},
      {m:52, d:"8.6", l:"12"},
      {m:38, runs:4},
      {m:54, d:"9",   l:"12"}
    ]}
  };

  var ORDER = ["150","200","300","400","500"];
  var state = { club:"150", week:0 };
  var detailOpen = false;
  var ridgeDrawn = false;

  // ---------- classify each week from the data itself ----------
  function classify(weeks, i){
    var w = weeks[i];
    if (w.runs) return "rest";
    var max = Math.max.apply(null, weeks.map(function(x){ return x.m; }));
    var lastMax = -1;
    weeks.forEach(function(x, j){ if (x.m === max) lastMax = j; });
    if (i === lastMax) return "peak";
    if (i > 0 && w.m < weeks[i-1].m) return "cut";
    return "build";
  }

  var TAGLABEL = { build:"Build", cut:"Cut back", peak:"Biggest week", rest:"Rest week" };

  function why(weeks, i){
    var w = weeks[i], k = classify(weeks, i), prev = i > 0 ? weeks[i-1] : null;
    if (k === "rest"){
      return "A built-in break. Run " + w.runs + " times, keep them short and easy, and let everything catch up. Vacation, camp, and family trips land here on purpose \u2014 take it.";
    }
    if (i === 0){
      return "Week one sets the tone. Start conservatively and finish every run feeling like you had another mile in you. Nothing this week should hurt.";
    }
    if (k === "cut"){
      return "Down from " + prev.m + " miles on purpose. This is where the last few weeks of work actually turn into fitness \u2014 hold the line and don't add miles just because you feel good.";
    }
    if (k === "peak"){
      return "The biggest week of the summer. Sleep, eat, and keep the easy days honestly easy \u2014 everything else this week depends on that.";
    }
    if (i === 10){
      return "Last week before we're together. Come back sharp: hold the mileage, keep the strides in, and get one solid long run done.";
    }
    if (w.m === prev.m){
      return "Same mileage as last week \u2014 hold it right there. Repeating a week is how a number stops feeling hard and starts feeling normal.";
    }
    return "A step up from " + prev.m + " miles. Add the distance to your easy days first, not to the quality run.";
  }

  // ---------- club buttons ----------
  var clubsEl = document.getElementById("clubs");
  ORDER.forEach(function(key){
    var b = document.createElement("button");
    b.className = "club";
    b.type = "button";
    b.setAttribute("aria-pressed", key === state.club ? "true" : "false");
    b.dataset.club = key;
    b.innerHTML = '<span class="n">' + key + '</span><span class="t">Club</span>';
    b.addEventListener("click", function(){ state.club = key; state.week = 0; render(); });
    clubsEl.appendChild(b);
  });

  // ---------- ridgeline ----------
  var SVG_NS = "http://www.w3.org/2000/svg";
  function el(name, attrs){
    var n = document.createElementNS(SVG_NS, name);
    for (var a in attrs){ n.setAttribute(a, attrs[a]); }
    return n;
  }
  var COLOR = { build:"#1D66A5", cut:"#8CC4EE", peak:"#16244A", rest:"#8AA0B4" };

  function drawRidge(weeks){
    var svg = document.getElementById("ridge");
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    // size the chart to the space it actually has, so type and strokes stay
    // the right size instead of scaling up like an image on big screens
    var avail = (svg.parentNode && svg.parentNode.clientWidth) || 0;
    var W = Math.max(320, Math.min(1120, avail ? avail - 16 : 660));
    var H = 190, padX = 26, top = 34, bottom = 154;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var max = Math.max.apply(null, weeks.map(function(w){ return w.m; }));
    var step = (W - padX*2) / (weeks.length - 1);
    var pts = weeks.map(function(w, i){
      return { x: padX + i*step, y: bottom - (w.m / max) * (bottom - top), w:w, i:i };
    });

    // baseline
    svg.appendChild(el("line", {x1:padX-10, y1:bottom, x2:W-padX+10, y2:bottom, stroke:"#D6E2EF", "stroke-width":1}));

    // filled terrain
    var d = "M" + padX + "," + bottom;
    pts.forEach(function(p){ d += " L" + p.x.toFixed(1) + "," + p.y.toFixed(1); });
    d += " L" + (W-padX) + "," + bottom + " Z";
    svg.appendChild(el("path", {d:d, fill:"#1D66A5", "fill-opacity":".09"}));

    // ridge line
    var dl = pts.map(function(p, i){ return (i?"L":"M") + p.x.toFixed(1) + "," + p.y.toFixed(1); }).join(" ");
    var line = el("path", {d:dl, fill:"none", stroke:"#1D66A5", "stroke-width":2, "stroke-linejoin":"round", "stroke-linecap":"round"});
    svg.appendChild(line);

    pts.forEach(function(p){
      var kind = classify(weeks, p.i);
      var on = p.i === state.week;

      // stem
      svg.appendChild(el("line", {
        x1:p.x, y1:p.y, x2:p.x, y2:bottom,
        stroke: on ? COLOR[kind] : "#D6E2EF",
        "stroke-width": on ? 2 : 1,
        "stroke-opacity": on ? .5 : 1
      }));

      // value label
      var t = el("text", {
        x:p.x, y:p.y - 13, "text-anchor":"middle",
        "font-family":'Archivo, Helvetica Neue, Arial, sans-serif',
        "font-size": on ? 20 : 14, "paint-order":"stroke", stroke:"#fff", "stroke-width":3.5, "stroke-linejoin":"round",
        "font-weight": on ? 800 : 600,
        fill: on ? COLOR[kind] : "#566782"
      });
      t.textContent = p.w.m;
      svg.appendChild(t);

      // dot
      if (on) svg.appendChild(el("circle", {cx:p.x, cy:p.y, r:10, fill:COLOR[kind], "fill-opacity":".18"}));
      svg.appendChild(el("circle", {cx:p.x, cy:p.y, r: on ? 5.5 : 4, fill:COLOR[kind], stroke:"#fff", "stroke-width":2}));

      // tap target
      var hit = el("rect", {x:p.x - step/2, y:0, width:step, height:H, fill:"transparent", style:"cursor:pointer"});
      hit.addEventListener("click", function(){ state.week = p.i; render(); });
      svg.appendChild(hit);
    });

    // draw-on animation
    if (!ridgeDrawn && (!window.matchMedia || !window.matchMedia("(prefers-reduced-motion: reduce)").matches)){
      ridgeDrawn = true;
      try {
        var len = line.getTotalLength();
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        line.style.transition = "stroke-dashoffset .9s cubic-bezier(.22,.61,.36,1)";
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ line.style.strokeDashoffset = 0; }); });
      } catch(e){}
    }
  }

  // ---------- render ----------
  function render(){
    var club = CLUBS[state.club];
    var weeks = club.weeks;
    var w = weeks[state.week];
    var kind = classify(weeks, state.week);

    // buttons
    Array.prototype.forEach.call(clubsEl.children, function(b){
      b.setAttribute("aria-pressed", b.dataset.club === state.club ? "true" : "false");
    });

    // bib + meta
    document.getElementById("bibNum").textContent = state.club;
    var sum = weeks.reduce(function(a,x){ return a + x.m; }, 0);
    document.getElementById("ridgeMeta").innerHTML =
      "<b>" + club.days + "</b><br>11 weeks &middot; <b>" + sum + "</b> total miles<br>Biggest week: <b>" +
      Math.max.apply(null, weeks.map(function(x){return x.m;})) + " mi</b>";

    drawRidge(weeks);

    // x axis
    var rx = document.getElementById("ridgeX");
    rx.innerHTML = "";
    weeks.forEach(function(_, i){
      var s = document.createElement("span");
      s.textContent = "W" + (i+1);
      if (i === state.week) s.className = "on";
      rx.appendChild(s);
    });

    // expandable week detail
    var kind = classify(weeks, state.week);
    document.getElementById("discloseLabel").textContent =
      (detailOpen ? "Hide the detail for Week " : "See what Week ") + (state.week + 1) + (detailOpen ? "" : " looks like");
    document.getElementById("wdWeek").textContent = "Week " + (state.week + 1) + " of 11";
    var tg = document.getElementById("wdTag");
    tg.className = "tag " + kind;
    tg.textContent = TAGLABEL[kind];
    document.getElementById("wdMiles").innerHTML = w.m + '<small>mi</small>';
    document.getElementById("wdMpd").innerHTML = w.runs ? w.runs + '<small>runs</small>' : w.d + '<small>mi</small>';
    document.getElementById("wdLong").innerHTML = w.runs ? '\u2014' : w.l + '<small>mi</small>';
    document.getElementById("wdMpdK").textContent = w.runs ? "Times to run" : "Per day";
    document.getElementById("wdWhy").textContent = why(weeks, state.week);

    var banked = 0;
    for (var bi = 0; bi <= state.week; bi++) banked += weeks[bi].m;
    document.getElementById("wdBanked").innerHTML =
      "Miles banked through this week: <b>" + banked + "</b> of " + sum;

    document.getElementById("prevBtn").disabled = state.week === 0;
    document.getElementById("nextBtn").disabled = state.week === weeks.length - 1;

    // table
    document.getElementById("tableTitle").textContent = "All 11 weeks — " + state.club + " Mile Club";
    var tb = document.getElementById("tbody");
    tb.innerHTML = "";
    var run = 0;
    weeks.forEach(function(wk, i){
      run += wk.m;
      var k = classify(weeks, i);
      var tr = document.createElement("tr");
      if (i === state.week) tr.className = "on";
      tr.innerHTML =
        '<td class="wk">Week ' + (i+1) + '</td>' +
        '<td class="mi">' + wk.m + '</td>' +
        '<td>' + (wk.runs ? "Run " + wk.runs + "×" : wk.d + " /day") + '</td>' +
        '<td>' + (wk.runs ? "—" : wk.l + " mi") + '</td>' +
        '<td>' + run + '</td>' +
        '<td class="note">' + TAGLABEL[k] + '</td>';
      tr.addEventListener("click", function(){ state.week = i; render(); });
      tb.appendChild(tr);
    });

    // sync calculator to the selected week
    var mpwInput = document.getElementById("mpw");
    if (!mpwInput.dataset.touched){ mpwInput.value = w.m; calc(); }
  }

  // week detail disclosure
  var detailBtn = document.getElementById("detailBtn");
  var detailBox = document.getElementById("weekDetail");
  detailBtn.addEventListener("click", function(){
    detailOpen = !detailOpen;
    if (detailOpen) detailBox.removeAttribute("hidden"); else detailBox.setAttribute("hidden","");
    detailBtn.setAttribute("aria-expanded", detailOpen ? "true" : "false");
    render();
  });

  document.getElementById("prevBtn").addEventListener("click", function(){
    if (state.week > 0){ state.week--; render(); }
  });
  document.getElementById("nextBtn").addEventListener("click", function(){
    if (state.week < 10){ state.week++; render(); }
  });

  // helper toggle
  var hb = document.getElementById("helperBtn"), hx = document.getElementById("helperBox");
  hb.addEventListener("click", function(){
    var open = hx.hasAttribute("hidden");
    if (open){ hx.removeAttribute("hidden"); } else { hx.setAttribute("hidden",""); }
    hb.setAttribute("aria-expanded", open ? "true" : "false");
    hb.textContent = open ? "Hide" : "Which one is mine?";
  });

  // calculator
  function calc(){
    var mpw = parseFloat(document.getElementById("mpw").value) || 0;
    var pace = parseFloat(document.getElementById("pace").value);
    var miles = mpw * 0.25;
    document.getElementById("lrMiles").textContent = (Math.round(miles*10)/10) + " mi";
    var mins = Math.round(miles * pace);
    document.getElementById("lrTime").textContent = mins > 0
      ? "about " + mins + " minutes at that pace"
      : "enter your weekly miles";
  }
  document.getElementById("mpw").addEventListener("input", function(){
    this.dataset.touched = "1"; calc();
  });
  document.getElementById("pace").addEventListener("change", calc);

  /* ================= PRINT THE SCHEDULE ================= */
  // Three routes, tried in order, so the button always does something:
  //  1. open a clean standalone tab (best result, and prints correctly when the
  //     guide is embedded in an iframe, where window.print() would print the host page)
  //  2. if popups are blocked, show the schedule in an in-page preview
  //  3. printing from that preview falls back to window.print()
  function scheduleMarkup(){
    var club = CLUBS[state.club], weeks = club.weeks;
    var sum = weeks.reduce(function(a,x){ return a + x.m; }, 0);
    var run = 0;

    var rows = weeks.map(function(wk, i){
      run += wk.m;
      var k = classify(weeks, i);
      return '<tr class="' + k + '">' +
        '<td class="wk">Week ' + (i+1) + '</td>' +
        '<td class="mi">' + wk.m + '</td>' +
        '<td>' + (wk.runs ? "Run " + wk.runs + "\u00d7" : wk.d + " /day") + '</td>' +
        '<td>' + (wk.runs ? "\u2014" : wk.l + " mi") + '</td>' +
        '<td class="note">' + TAGLABEL[k] + '</td>' +
        '<td class="blank"></td>' +
      '</tr>';
    }).join("");

    return '<h4>' + state.club + ' Mile Club</h4>' +
      '<p class="pv-sub">Little Chute Cross Country \u00b7 Summer mileage \u00b7 ' +
      '<b>' + club.days + '</b> \u00b7 11 weeks \u00b7 <b>' + sum + ' total miles</b></p>' +
      '<table><thead><tr><th>Week</th><th>Miles</th><th>Per day</th><th>Long run</th>' +
      '<th>Week type</th><th>What I actually ran</th></tr></thead><tbody>' + rows + '</tbody></table>' +
      '<div class="pv-box"><h5>Every week, no matter the mileage</h5><ul>' +
      '<li>Run 5\u20136 days \u2014 easy enough to hold a conversation</li>' +
      '<li>One long run, about 25% of the week</li>' +
      '<li>Strides 3\u00d7 a week: 4 \u00d7 100m, or 4 \u00d7 30m flys</li>' +
      '<li>One quality run: fartlek, progression, tempo, or stamina</li>' +
      '<li>Strength 2\u00d7 a week \u2014 the best injury prevention there is</li>' +
      '<li>Core X, hurdle mobility, and bands 3\u00d7 a week</li>' +
      '<li>8\u201310 hours of sleep, and eat enough to cover the miles</li>' +
      '</ul></div>' +
      '<p class="pv-foot">Log every run on Strava. Cut-back weeks are part of the plan \u2014 do not add to them.<br>' +
      'Questions about mileage, soreness, or which club to run: ask your coaches.</p>';
  }

  function standaloneDoc(){
    return '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">' +
      '<title>' + state.club + ' Mile Club \u2014 Summer Mileage</title><style>' +
      'body{font-family:Archivo,Helvetica,Arial,sans-serif;color:#101C36;margin:32px;background:#fff}' +
      'h4{font-size:25px;margin:0 0 3px;color:#233766;letter-spacing:-.015em}' +
      '.pv-sub{font-size:13px;color:#3A4963;margin:0 0 18px}.pv-sub b{color:#101C36}' +
      'table{border-collapse:collapse;width:100%;margin-bottom:22px}' +
      'th{text-align:left;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#566782;' +
      'padding:7px 9px;border-bottom:1.5px solid #233766}' +
      'td{padding:9px;border-bottom:1px solid #D6E2EF;font-size:13.5px}' +
      'td.wk{font-weight:700;white-space:nowrap}td.mi{font-weight:800;color:#233766}' +
      'td.note{font-size:12.5px;color:#3A4963;white-space:nowrap}td.blank{width:88px}' +
      'tr.cut td,tr.rest td{background:#F4FAFD}tr.peak td{background:#E8F1F8}' +
      '.pv-box{border:1px solid #D6E2EF;border-radius:8px;padding:14px 16px;margin-bottom:14px}' +
      '.pv-box h5{font-size:11.5px;letter-spacing:.09em;text-transform:uppercase;color:#566782;margin:0 0 8px}' +
      '.pv-box ul{margin:0;padding-left:17px;font-size:13.5px;line-height:1.75}' +
      '.pv-foot{font-size:12px;color:#566782;line-height:1.6;margin:0}' +
      '@media print{body{margin:12mm}.pv-box,table{page-break-inside:avoid}}' +
      '</style></head><body>' + scheduleMarkup() + '</body></html>';
  }

  var pvOverlay = document.getElementById("pvOverlay");

  function openPreview(msg){
    document.getElementById("pvDoc").innerHTML = scheduleMarkup();
    document.getElementById("pvNote").textContent = msg;
    pvOverlay.removeAttribute("hidden");
    document.body.classList.add("pv-open");
    document.getElementById("pvPrint").focus();
  }
  function closePreview(){
    pvOverlay.setAttribute("hidden", "");
    document.body.classList.remove("pv-open");
    document.getElementById("printBtn").focus();
  }

  document.getElementById("printBtn").addEventListener("click", function(){
    var wnd = null;
    try { wnd = window.open("", "_blank"); } catch(e){ wnd = null; }
    if (wnd && wnd.document){
      wnd.document.open(); wnd.document.write(standaloneDoc()); wnd.document.close();
      wnd.focus();
      setTimeout(function(){ try { wnd.print(); } catch(e){} }, 350);
    } else {
      openPreview("Your browser blocked the print tab. Here is your schedule \u2014 print it below, or open the guide in its own tab and try again.");
    }
  });

  document.getElementById("pvPrint").addEventListener("click", function(){
    try { window.print(); } catch(e){}
  });
  document.getElementById("pvClose").addEventListener("click", closePreview);
  pvOverlay.addEventListener("click", function(e){ if (e.target === pvOverlay) closePreview(); });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && !pvOverlay.hasAttribute("hidden")) closePreview();
  });

  window.addEventListener("afterprint", function(){ document.body.classList.remove("print-week"); });

  var resizeTimer;
  window.addEventListener("resize", function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(render, 160);
  });

  render();
})();
