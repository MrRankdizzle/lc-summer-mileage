/* Fall Season page. All content comes from data/season.js (window.SEASON). */
(function(){
  "use strict";
  var LC = window.LC, S = window.SEASON || {}, esc = LC.esc, today = LC.today();
  function $(id){ return document.getElementById(id); }
  function empty(title, text){
    return '<div class="empty"><b>' + esc(title) + "</b><p>" + esc(text) + "</p></div>";
  }
  function link(url, label){
    var u = LC.safeUrl(url);
    return u ? '<a href="' + esc(u) + '"' + (/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "") + ">" + esc(label) + "</a>" : "";
  }
  function daysTo(d){ return Math.round((d - today) / 864e5); }

  // ----- hero -----
  if (S.tagline) $("heroSub").textContent = S.tagline;
  if (S.year) $("heroKicker").textContent = S.year + " season · Mid-August to early November";

  var meets = (S.meets || []).map(function(m){ return { m:m, d:LC.date(m.date) }; })
    .filter(function(x){ return x.d; }).sort(function(a, b){ return a.d - b.d; });

  (function(){
    var boxes = [], fp = LC.date(S.firstPractice);
    var nextMeet = meets.filter(function(x){ return x.d >= today; })[0];
    if (fp && fp >= today){
      boxes.push([daysTo(fp), daysTo(fp) === 1 ? "day to first practice" : "days to first practice"]);
    } else if (nextMeet){
      var n = daysTo(nextMeet.d);
      boxes.push([n === 0 ? "Today" : n, n === 0 ? nextMeet.m.name : (n === 1 ? "day to " : "days to ") + nextMeet.m.name]);
    }
    if (meets.length){
      var left = meets.filter(function(x){ return x.d >= today; }).length;
      boxes.push([left, left === 1 ? "meet to go" : "meets to go"]);
    }
    if (!boxes.length) return;
    var c = $("count");
    c.innerHTML = boxes.map(function(b){ return "<div><b>" + esc(b[0]) + "</b><span>" + esc(b[1]) + "</span></div>"; }).join("");
    c.removeAttribute("hidden");
  })();

  // ----- practice + announcements -----
  (function(){
    var p = S.practice || {}, html = "";
    if (p.when || p.where || p.note){
      html = '<div class="notice" style="border-left-color:var(--mustang)"><time>Regular practice</time>' +
        (p.when ? "<h3>" + esc(p.when) + "</h3>" : "") +
        "<p>" + esc([p.where, p.note].filter(Boolean).join(" · ")) + "</p></div>";
    }
    $("practice").innerHTML = html;
    var list = (S.announcements || []).slice().sort(function(a, b){ return String(b.date).localeCompare(String(a.date)); });
    $("announcements").innerHTML = list.length ? list.map(function(a){
      var d = LC.date(a.date);
      return '<div class="notice">' + (d ? "<time>" + esc(LC.longDate(d)) + "</time>" : "") +
        "<h3>" + esc(a.title) + "</h3>" + (a.body ? "<p>" + esc(a.body) + "</p>" : "") + "</div>";
    }).join("") : (html ? "" : empty("Nothing posted yet", "Practice times and announcements from the coaches will show up here as the season gets closer."));
  })();

  // ----- calendar -----
  var KIND = { meet:"Meet", practice:"Practice", team:"Team event", fundraiser:"Fundraiser", deadline:"Deadline" };
  var events = meets.map(function(x){
    return { d:x.d, type:"meet", title:x.m.name, time:x.m.times, where:x.m.location, note:x.m.bus ? "Bus: " + x.m.bus : "" };
  });
  (S.calendar || []).forEach(function(e){
    var d = LC.date(e.date);
    if (d) events.push({ d:d, end:LC.date(e.end), type:KIND[e.type] ? e.type : "team", title:e.title, time:e.time, where:e.where, note:e.note });
  });
  events.sort(function(a, b){ return a.d - b.d; });
  var filter = "all";

  function renderCal(){
    var box = $("calList");
    if (!events.length){
      box.innerHTML = empty("The schedule isn't posted yet", "As soon as meets and team events are set, they'll be listed here, and you'll be able to add them to your phone's calendar.");
      return;
    }
    var shown = events.filter(function(e){ return filter === "all" || e.type === filter; });
    var html = "", month = "";
    shown.forEach(function(e){
      var mk = LC.MONTHS_FULL[e.d.getMonth()] + " " + e.d.getFullYear();
      if (mk !== month){ month = mk; html += '<p class="month">' + mk + "</p>"; }
      var last = e.end || e.d;
      var bits = [LC.DAYS_FULL[e.d.getDay()] + (e.end ? " to " + LC.DAYS_FULL[e.end.getDay()] + ", " + LC.MONTHS[e.end.getMonth()] + " " + e.end.getDate() : ""), e.time, e.where].filter(Boolean);
      html += '<div class="ev t-' + e.type + (last < today ? " past" : "") + '">' +
        '<div class="ev-date"><span>' + LC.MONTHS[e.d.getMonth()] + "</span><b>" + e.d.getDate() + "</b></div>" +
        "<div><h3>" + esc(e.title) + "</h3><p>" + esc(bits.join(" · ")) + "</p>" + (e.note ? "<p>" + esc(e.note) + "</p>" : "") + "</div>" +
        '<span class="kind">' + KIND[e.type] + "</span></div>";
    });
    box.innerHTML = html || empty("Nothing in this category", "Try a different filter.");
  }
  if (events.length){
    var used = {}; events.forEach(function(e){ used[e.type] = 1; });
    var f = $("calFilters");
    [["all","Everything"]].concat(Object.keys(KIND).filter(function(k){ return used[k]; }).map(function(k){ return [k, KIND[k] + "s"]; }))
      .forEach(function(o){
        var b = document.createElement("button");
        b.type = "button"; b.className = "chipbtn"; b.textContent = o[1];
        b.setAttribute("aria-pressed", o[0] === filter ? "true" : "false");
        b.addEventListener("click", function(){
          filter = o[0];
          Array.prototype.forEach.call(f.children, function(c){ c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
          renderCal();
        });
        f.appendChild(b);
      });
    if (Object.keys(used).length > 1) f.removeAttribute("hidden");
    $("icsBtn").removeAttribute("hidden");
  }
  renderCal();

  // calendar file for phones and computers
  function ymd(d){ return d.getFullYear() + ("0" + (d.getMonth() + 1)).slice(-2) + ("0" + d.getDate()).slice(-2); }
  function icsText(s){ return String(s || "").replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\r?\n/g, "\\n"); }
  $("icsBtn").addEventListener("click", function(){
    var lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Little Chute Cross Country//Season//EN", "CALSCALE:GREGORIAN", "X-WR-CALNAME:Little Chute Cross Country"];
    events.forEach(function(e, i){
      var end = new Date((e.end || e.d).getTime()); end.setDate(end.getDate() + 1);
      lines.push("BEGIN:VEVENT", "UID:lcxc-" + ymd(e.d) + "-" + i + "@lc-cross-country", "DTSTAMP:" + ymd(today) + "T120000Z",
        "DTSTART;VALUE=DATE:" + ymd(e.d), "DTEND;VALUE=DATE:" + ymd(end),
        "SUMMARY:" + icsText("LC XC: " + e.title),
        "DESCRIPTION:" + icsText([e.time, e.note].filter(Boolean).join("\n")));
      if (e.where) lines.push("LOCATION:" + icsText(e.where));
      lines.push("END:VEVENT");
    });
    lines.push("END:VCALENDAR");
    var blob = new Blob([lines.join("\r\n")], { type:"text/calendar" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = "little-chute-cross-country.ics";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(function(){ URL.revokeObjectURL(a.href); }, 2000);
  });

  // ----- meets -----
  $("meetList").innerHTML = meets.length ? '<div class="meets">' + meets.map(function(x){
    var m = x.m, rows = [];
    function row(k, v){ if (v) rows.push("<dt>" + k + "</dt><dd>" + esc(v) + "</dd>"); }
    row("Where", [m.location, m.address].filter(Boolean).join(", "));
    row("Races", m.times); row("Bus", m.bus); row("Levels", m.levels); row("Host", m.host);
    var links = [];
    if (m.address || m.location) links.push(link("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(m.address || m.location), "Directions"));
    if (m.resultsUrl) links.push(link(m.resultsUrl, "Results"));
    if (m.infoUrl) links.push(link(m.infoUrl, "Meet info"));
    return '<article class="meet' + (x.d < today ? " past" : "") + '"><div class="meet-top"><time>' + esc(LC.longDate(x.d)) + "</time><h3>" + esc(m.name) + "</h3></div>" +
      '<div class="meet-body"><dl>' + rows.join("") + "</dl>" + (m.note ? '<p class="note">' + esc(m.note) + "</p>" : "") +
      (links.length ? '<div class="links">' + links.join("") + "</div>" : "") + "</div></article>";
  }).join("") + "</div>" : empty("Meet schedule coming soon", "Each meet will get a card here with race times, bus times, the address, and a link to results.");

  // ----- fundraising -----
  var funds = S.fundraising || [];
  $("fundList").innerHTML = funds.length ? funds.map(function(f){
    var meter = "";
    if (f.goal > 0 && f.raised >= 0){
      var pct = Math.max(0, Math.min(100, Math.round(f.raised / f.goal * 100)));
      meter = '<div class="meter" role="img" aria-label="' + pct + ' percent of goal"><i style="width:' + pct + '%"></i></div>' +
        '<div class="meter-l"><span>$' + Number(f.raised).toLocaleString() + " raised</span><span>Goal $" + Number(f.goal).toLocaleString() + "</span></div>";
    }
    return '<div class="fund">' + (f.when ? '<p class="when">' + esc(f.when) + "</p>" : "") + "<h3>" + esc(f.title) + "</h3>" +
      (f.body ? "<p>" + esc(f.body) + "</p>" : "") + meter +
      (f.url ? '<p style="font-family:var(--display);font-size:1.0625rem;font-weight:700">' + link(f.url, "How to take part") + "</p>" : "") + "</div>";
  }).join("") : empty("No fundraisers posted yet", "When a fundraiser is running, you'll find the dates, the goal, and how to help right here.");

  // ----- contacts + links -----
  var people = S.contacts || [];
  $("people").innerHTML = people.length ? '<div class="people">' + people.map(function(p){
    return '<div class="person">' + (p.role ? '<p class="role">' + esc(p.role) + "</p>" : "") + "<h3>" + esc(p.name) + "</h3>" +
      (p.email ? link("mailto:" + p.email, p.email) : "") + (p.phone ? link("tel:" + String(p.phone).replace(/[^\d+]/g, ""), p.phone) : "") + "</div>";
  }).join("") + "</div>" : empty("Contacts coming soon", "Coach names and the best way to reach them will be listed here.");
  var links = (S.links || []).filter(function(l){ return LC.safeUrl(l.url); });
  if (links.length){
    $("linksHead").removeAttribute("hidden");
    $("links").innerHTML = links.map(function(l){
      var u = LC.safeUrl(l.url);
      return '<a href="' + esc(u) + '"' + (/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : "") + "><span>" + esc(l.label) + (l.note ? "<small>" + esc(l.note) + "</small>" : "") + "</span></a>";
    }).join("");
  }

  // ----- packing checklist (remembered on this device) -----
  var KEY = "lc-raceday-check-v1", state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch(e){ state = {}; }
  var boxes = document.querySelectorAll("#check input");
  Array.prototype.forEach.call(boxes, function(b){
    b.checked = !!state[b.dataset.k];
    b.addEventListener("change", function(){
      state[b.dataset.k] = b.checked;
      try { localStorage.setItem(KEY, JSON.stringify(state)); } catch(e){}
    });
  });
  $("checkReset").addEventListener("click", function(){
    state = {};
    Array.prototype.forEach.call(boxes, function(b){ b.checked = false; });
    try { localStorage.removeItem(KEY); } catch(e){}
  });
})();
