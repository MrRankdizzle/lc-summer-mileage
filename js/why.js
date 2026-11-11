/* The Why: renders the science library from data/why.js, with search and filters. */
(function(){
  "use strict";
  var LC = window.LC, W = window.WHY, esc = LC.esc;
  function $(id){ return document.getElementById(id); }
  var EV = { strong:"Strong research", good:"Some research", coach:"Coaching practice" };
  var group = "all", query = "";

  function strip(s){ return String(s).replace(/<[^>]+>/g, " "); }
  W.topics.forEach(function(t){
    t._text = [t.q, t.short, t.doing, t.why, strip((t.more || []).join(" ")), t.voice ? t.voice.join(" ") : "",
               (t.src || []).map(function(s){ return s[0]; }).join(" ")].join(" ").toLowerCase();
  });

  function topicHtml(t){
    var src = (t.src || []).map(function(s){
      var u = LC.safeUrl(s[1]);
      return "<li>" + esc(s[0]) + (u ? ' <a href="' + esc(u) + '" target="_blank" rel="noopener">Read it</a>' : "") + "</li>";
    }).join("");
    var used = (t.used || []).map(function(u){ return '<a href="' + esc(u[1]) + '">' + esc(u[0]) + "</a>"; }).join("");
    return '<details class="topic" id="' + t.id + '">' +
      '<summary><span><span class="q">' + esc(t.q) + '</span><span class="short">' + esc(t.short) + "</span>" +
      '<span class="evid ' + t.ev + '">' + EV[t.ev] + "</span></span></summary>" +
      '<div class="topic-body"><div class="topic-grid">' +
      '<div class="wbox"><h3>What we do</h3><p>' + esc(t.doing) + "</p></div>" +
      '<div class="wbox"><h3>Why</h3><p>' + esc(t.why) + "</p></div></div>" +
      '<div class="long">' + (t.more || []).map(function(p){ return "<p>" + p + "</p>"; }).join("") + "</div>" +
      (t.voice ? '<div class="voice"><b>' + esc(t.voice[0]) + "</b><p>" + esc(t.voice[1]) + "</p></div>" : "") +
      (used ? '<div class="usedin" aria-label="Where this shows up">' + used + "</div>" : "") +
      (src ? '<div class="srcs"><h3>Sources</h3><ol>' + src + "</ol></div>" : "") +
      "</div></details>";
  }

  function render(){
    var words = query.toLowerCase().split(/\s+/).filter(Boolean), html = "", n = 0;
    W.groups.forEach(function(g){
      if (group !== "all" && group !== g.id) return;
      var list = W.topics.filter(function(t){
        return t.g === g.id && words.every(function(w){ return t._text.indexOf(w) >= 0; });
      });
      if (!list.length) return;
      n += list.length;
      html += '<h2 class="why-group">' + esc(g.title) + "</h2>" + list.map(topicHtml).join("");
    });
    $("whyList").innerHTML = html || '<div class="empty"><b>Nothing matches that</b><p>Try a different word, or ask your coaches. If it\'s a good question, it belongs in here.</p></div>';
    $("whyCount").textContent = (query || group !== "all") ? n + (n === 1 ? " answer" : " answers") : W.topics.length + " questions answered";
  }

  var f = $("whyFilters");
  [{ id:"all", title:"All" }].concat(W.groups).forEach(function(g){
    var b = document.createElement("button");
    b.type = "button"; b.className = "chipbtn"; b.textContent = g.title;
    b.setAttribute("aria-pressed", g.id === group ? "true" : "false");
    b.addEventListener("click", function(){
      group = g.id;
      Array.prototype.forEach.call(f.children, function(c){ c.setAttribute("aria-pressed", c === b ? "true" : "false"); });
      render();
    });
    f.appendChild(b);
  });
  var timer;
  $("whySearch").addEventListener("input", function(){
    var v = this.value; clearTimeout(timer);
    timer = setTimeout(function(){ query = v; render(); }, 120);
  });

  $("books").innerHTML = W.books.map(function(b){
    return '<div class="book"><p class="by">' + esc(b.by) + "</p><h3>" + esc(b.title) + "</h3><p>" + esc(b.note) + "</p></div>";
  }).join("");

  function openHash(){
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    var el = document.getElementById(id);
    if (!el && W.topics.some(function(t){ return t.id === id; })){
      group = "all"; query = ""; $("whySearch").value = "";
      Array.prototype.forEach.call(f.children, function(c, i){ c.setAttribute("aria-pressed", i === 0 ? "true" : "false"); });
      render(); el = document.getElementById(id);
    }
    if (el && el.tagName === "DETAILS"){ el.open = true; el.scrollIntoView({ block:"start" }); }
  }
  window.addEventListener("hashchange", openHash);
  render();
  openHash();
})();
