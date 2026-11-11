/* Home page: the "right now" card, the year track, and the photo slideshow. */
(function(){
  "use strict";
  var LC = window.LC, S = window.SEASON || {}, today = LC.today(), season = LC.season(today);
  function $(id){ return document.getElementById(id); }

  // ----- year track (June to May) -----
  var order = ["summer","summer","fall","fall","fall","winter","winter","winter","winter","spring","spring","spring"];
  var track = $("yearTrack");
  order.forEach(function(s){ var i = document.createElement("i"); i.className = "s-" + s; track.appendChild(i); });
  var idx = (today.getMonth() + 7) % 12;   // June = 0
  var dim = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  var here = document.createElement("div");
  here.className = "year-here";
  here.style.left = Math.min(97, Math.max(3, (idx + (today.getDate() - 0.5) / dim) / 12 * 100)) + "%";
  here.innerHTML = "<span>Today</span>";
  track.appendChild(here);

  var card = document.querySelector('.season[data-season="' + season + '"]');
  if (card){
    card.classList.add("is-now");
    var tag = document.createElement("span"); tag.className = "nowtag"; tag.textContent = "Now"; card.appendChild(tag);
  }

  // ----- next event from the season file -----
  function upcoming(){
    var all = [];
    (S.meets || []).forEach(function(m){ var d = LC.date(m.date); if (d) all.push({ d:d, title:m.name, meet:true, where:m.location }); });
    (S.calendar || []).forEach(function(e){ var d = LC.date(e.date); if (d) all.push({ d:d, title:e.title, where:e.where }); });
    return all.filter(function(e){ return e.d >= today; }).sort(function(a, b){ return a.d - b.d; })[0];
  }
  var next = upcoming();

  $("nowBadge").innerHTML = LC.MONTHS[today.getMonth()] + "<b>" + today.getDate() + "</b>";
  var copy = {
    fall:   ["It's race season", "Calendar, meet details, and everything families need are in the season hub.", "Fall season hub", "fall.html"],
    winter: ["It's the off-season", "Rest first, then rebuild. Build your personal winter plan in about two minutes.", "Build my winter plan", "winter.html"],
    spring: ["Spring: sharpen up", "Race on the track or keep the winter habits going. Summer mileage starts in June.", "Preview summer mileage", "summer.html"],
    summer: ["Summer mileage is on", "Pick your club and follow the eleven weeks. The season is won in June and July.", "Summer mileage plan", "summer.html"]
  }[season];
  $("nowTitle").textContent = copy[0];
  $("nowText").textContent = copy[1];
  $("nowLink").textContent = copy[2];
  $("nowLink").href = copy[3];

  if (next){
    var days = Math.round((next.d - today) / 864e5);
    var when = days === 0 ? "Today" : days === 1 ? "Tomorrow" : LC.longDate(next.d);
    $("nowEyebrow").textContent = "Next up";
    $("nowTitle").textContent = next.title;
    $("nowText").textContent = when + (next.where ? " · " + next.where : "") + (days > 1 ? " · in " + days + " days" : "");
    $("nowLink").textContent = next.meet ? "Meet details" : "See the calendar";
    $("nowLink").href = next.meet ? "fall.html#meets" : "fall.html#calendar";
  }

  // ----- photos -----
  if (window.PHOTOS && window.PHOTOS.length){
    $("photos").removeAttribute("hidden");
    LC.slideshow($("show"), window.PHOTOS);
  }
})();
