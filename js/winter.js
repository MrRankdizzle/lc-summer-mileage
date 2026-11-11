
(function(){
  "use strict";

  var STORE = "lc-winter-plan-v1";
  var SITE = "https://lc-summer-mileage.vercel.app/winter.html";
  var DAYS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  var DAYFULL = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];
  var MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  function $(id){ return document.getElementById(id); }
  function esc(s){
    return String(s).replace(/[&<>"']/g, function(c){
      return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c];
    });
  }
  function half(n){ return Math.round(n * 2) / 2; }
  function fmt(n){ return String(half(n)).replace(/\.0$/, ""); }

  // ---------- dates ----------
  function iso(d){
    var m = d.getMonth() + 1, day = d.getDate();
    return d.getFullYear() + "-" + (m < 10 ? "0" : "") + m + "-" + (day < 10 ? "0" : "") + day;
  }
  function parseDate(s){
    var p = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || "");
    if (!p) return null;
    var d = new Date(+p[1], +p[2] - 1, +p[3], 12);
    return isNaN(d.getTime()) ? null : d;
  }
  function addDays(d, n){ var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x; }
  function toMonday(d){ return addDays(d, -((d.getDay() + 6) % 7)); }
  function nextMonday(){
    var d = new Date(); d.setHours(12, 0, 0, 0);
    return addDays(d, (8 - d.getDay()) % 7);
  }
  function shortDate(d){ return MONTHS[d.getMonth()] + " " + d.getDate(); }

  // ---------- the model ----------
  var LEVELS = {
    starter:  { i:0, label:"Starter",  peak:14, maxDays:5, days:4 },
    builder:  { i:1, label:"Builder",  peak:22, maxDays:6, days:5 },
    varsity:  { i:2, label:"Varsity",  peak:32, maxDays:6, days:6 },
    advanced: { i:3, label:"Advanced", peak:42, maxDays:6, days:6 }
  };

  var PHASES = {
    recharge: { label:"Recharge",         color:"#8AA0B4" },
    rebuild:  { label:"Rebuild",          color:"#8CC4EE" },
    base:     { label:"Base",             color:"#2575B5" },
    bridge:   { label:"Bridge to spring", color:"#16244A" },
    maintain: { label:"In season",        color:"#2575B5" }
  };

  // which day does what, for each number of running days (index 0 = Monday)
  var TEMPLATES = {
    6: { roles:["easyS","qual","easy","easyS","easy","long","rest"], str:[1,3], hill:3 },
    5: { roles:["easyS","qual","off","easyS","easy","long","rest"],  str:[1,3], hill:3 },
    4: { roles:["easyS","off","qual","off","easyS","long","rest"],   str:[0,2], hill:4 },
    3: { roles:["off","easyS","off","qual","off","long","rest"],     str:[1,3], hill:1 }
  };
  var LONGPCT = { 3:0.40, 4:0.33, 5:0.28, 6:0.25 };

  var XT = { bike:"bike", pool:"pool", ski:"skis or snowshoes", court:"open gym" };

  var A = {
    name:"", level:null, state:null,
    sport:"no", weeks:"12", start:iso(nextMonday()),
    days:null, where:"both", xt:[], gym:"home",
    partners:"some", buddy:["long"],
    runTime:"after", diet:"all"
  };
  var plan = null;
  var sel = 0;
  var step = 0;
  var gymView = "home";

  // ---------- quality sessions ----------
  function quality(q, i, per){
    var n, t, s, lead = per + " mi total. ", g;
    switch (q){
      case "hills":
        n = [4,6,8,8][i]; t = "Hill sprints"; s = "Hill sprints " + n + " x 8 sec";
        lead = per + " mi easy, then ";
        g = n + " × 8-second hill sprints. Fast and smooth, walk back down, and wait until you feel fully recovered before the next one. These build power; they shouldn't leave you tired.";
        break;
      case "fartlek":
        n = [5,6,8,10][i]; t = "Fartlek"; s = "Fartlek " + n + " x 1 min";
        g = "In the middle of the run, " + n + " × 1 minute quick, 1 minute easy jog. Quick means 5K effort, not a sprint.";
        break;
      case "progression":
        n = [5,8,10,15][i]; t = "Progression run"; s = "Progression, last " + n + " min";
        lead = per + " mi. ";
        g = "Start easy, and run the last " + n + " minutes at a steady, strong effort. You should finish feeling good, not wrecked.";
        break;
      case "steady":
        n = [10,15,20,25][i]; t = "Steady run"; s = "Steady " + n + " min";
        g = "In the middle of the run, " + n + " minutes at steady effort: a notch quicker than easy, still able to say a short sentence.";
        break;
      case "tempo":
        n = ["2 × 5","12","16","20"][i]; t = "Tempo"; s = "Tempo " + n.replace("×","x") + " min";
        g = "After an easy mile, " + n + " minutes at tempo effort: comfortably hard, a pace you could hold for about an hour." +
            (i === 0 ? " Take 2 minutes easy between the two." : "") + " Easy jog to finish.";
        break;
      case "hillreps":
        n = [4,5,6,8][i]; t = "Hill repeats"; s = "Hills " + n + " x 60 sec";
        g = "After an easy mile, " + n + " × 60 seconds up a steady hill at a hard but smooth effort. Jog down for recovery. Easy jog to finish.";
        break;
      case "tune":
        n = [4,5,6,6][i]; t = "Light fartlek"; s = "Light fartlek " + n + " x 1 min";
        g = "In the middle of the run, " + n + " × 1 minute quick, 2 minutes easy. Keep it snappy and short. You should finish wanting more.";
        break;
      default: return null;
    }
    return { t:t, s:s, d:lead + g, g:g };
  }
  function qualityName(q){
    return { hills:"Hill sprints", fartlek:"Fartlek", progression:"Progression run", steady:"Steady run",
             tempo:"Tempo", hillreps:"Hill repeats", tune:"Light fartlek" }[q] || "";
  }

  // ---------- build the plan from the answers ----------
  function buildPlan(a){
    var L = LEVELS[a.level], N = parseInt(a.weeks, 10), weeks = [], i;
    var start = toMonday(parseDate(a.start) || nextMonday());
    var inSport = a.sport === "yes";
    var D = inSport ? 2 : Math.max(3, Math.min(L.maxDays, parseInt(a.days, 10) || L.days));

    if (inSport){
      var per = [2, 2.5, 3, 4][L.i];
      for (i = 0; i < N; i++){
        var off = (a.state === "ended" && i === 0);
        weeks.push({
          phase: off ? "recharge" : "maintain", kind: off ? "recharge" : "maintain",
          m: off ? 0 : per * 2, long:0, per:per, q:null, sportOff:off,
          key: off ? "No extra running" : "1–2 easy runs"
        });
      }
    } else {
      var re = a.state === "ended" ? 2 : 0;
      var R = N - re;
      var nRebuild = a.state === "running" ? 1 : (R >= 10 ? 3 : 2);
      var nBridge = R >= 10 ? 3 : 2;
      var nBase = R - nRebuild - nBridge;
      var P = nRebuild + nBase - 1;
      var s0 = a.state === "running" ? 0.6 : 0.45;
      var stp = Math.min((1 - s0) / P, 0.08);
      var top = s0 + stp * P;
      var BASEQ = ["fartlek","progression","steady"], bq = 0;
      var hillMax = [6,8,8,10][L.i], hillWk = 0;
      var BRIDGEQ = nBridge === 3 ? ["tempo","hillreps","tune"] : ["tempo","tune"];
      var BRIDGEF = nBridge === 3 ? [0.92, 0.92, 0.82] : [0.92, 0.82];

      for (i = 0; i < re; i++){
        weeks.push({ phase:"recharge", kind:"recharge", m:0, long:0, per:0, q:null, second:i === 1,
                     key: i === 0 ? "No running" : "Optional easy jogs" });
      }
      for (i = 0; i <= P; i++){
        var f = s0 + stp * i, ph = i < nRebuild ? "rebuild" : "base";
        var cut = (i % 4 === 3 && i !== P && ph === "base");
        if (cut) f *= 0.8;
        var w = { phase:ph, kind: cut ? "cut" : ph, f:f, q:null, first:i === 0, strides:i > 0 };
        if (ph === "base" && !cut){ w.q = BASEQ[bq % BASEQ.length]; bq++; }
        // short hill sprints after one easy run a week, starting small (Magness)
        if (ph === "base" || (ph === "rebuild" && i === nRebuild - 1 && i > 0)){ w.hills = Math.min(hillMax, 4 + hillWk); hillWk++; }
        weeks.push(w);
      }
      for (i = 0; i < nBridge; i++){
        weeks.push({ phase:"bridge", kind:"bridge", f:top * BRIDGEF[i], q:BRIDGEQ[i], strides:true, last:i === nBridge - 1,
                     hills: i === nBridge - 1 ? 4 : Math.min(hillMax, 4 + hillWk) });
      }
      // turn fractions into real numbers that add up
      weeks.forEach(function(w){
        if (w.phase === "recharge") return;
        var target = Math.max(D + 1, L.peak * w.f);
        var lng = half(target * LONGPCT[D]);
        var p = Math.max(1, half((target - lng) / (D - 1)));
        if (lng < p + 0.5) lng = p + 0.5;
        w.long = lng; w.per = p; w.m = lng + p * (D - 1);
        w.key = w.q ? qualityName(w.q) : (w.strides ? "Easy miles + strides" : "Easy miles only");
      });
      // biggest week
      var max = 0, at = -1;
      weeks.forEach(function(w, j){ if (w.m >= max && w.phase === "base"){ max = w.m; at = j; } });
      if (at >= 0 && weeks[at].kind === "base") weeks[at].kind = "peak";
    }

    weeks.forEach(function(w, j){ w.n = j + 1; w.start = addDays(start, 7 * j); });
    return { a:a, L:L, D:D, weeks:weeks, start:start, end:addDays(start, 7 * N - 1), inSport:inSport,
             peak: Math.max.apply(null, weeks.map(function(w){ return w.m; })) };
  }

  function buddyFor(a){ return a.partners === "solo" ? [] : a.buddy; }
  function xtName(a){
    var names = a.xt.filter(function(k){ return XT[k]; }).map(function(k){ return XT[k]; });
    return names.length ? names.slice(0, 2).join(" or ") : "";
  }

  // ---------- one week, day by day ----------
  function weekDays(w){
    var a = plan.a, L = plan.L, out = [], buddy = buddyFor(a), xt = xtName(a), i;
    function add(i, t, s, d, tags, rest){
      out.push({ i:i, name:DAYS[i], date:addDays(w.start, i), t:t, s:s, d:d, tags:tags || [], rest:!!rest });
    }
    var B = function(k){ return buddy.indexOf(k) >= 0 ? ["buddy"] : []; };

    if (plan.inSport){
      for (i = 0; i < 5; i++){
        var extra = (i === 2 && !w.sportOff)
          ? " No practice or a light day? Optional " + fmt(w.per) + " mi easy with 4 strides."
          : "";
        add(i, "Practice or game", "Practice", "Your sport is your training today. No extra running needed." + extra);
      }
      if (w.sportOff){
        add(5, "Off", "Off", "No running this week. Your cross country season just ended; let your legs catch up.", [], true);
      } else {
        add(5, "Easy run", "Easy " + fmt(w.per) + " + strides",
          fmt(w.per) + " mi easy, then 4 × 100m strides. If you have a game or tournament today, skip it.", B("long"));
      }
      add(6, "Rest", "Rest", "Full rest. One day a week with nothing on it.", [], true);
      return out;
    }

    if (w.phase === "recharge"){
      var R1 = [
        ["Off", "No running this week. That is the assignment."],
        ["Off", "Catch up on sleep and schoolwork."],
        ["Off, or play", "Something fun that isn't running: open gym, a hike, sledding."],
        ["Off", "Still off. You are not losing anything that matters."],
        ["Off", "Eat well, sleep in tomorrow."],
        ["Play", "Do something active with friends that is not running."],
        ["Off", "Write down two things that went well this fall and one thing to work on."]
      ];
      var R2 = [
        ["Off", "One more easy week."],
        ["Optional jog", "15–20 minutes very easy, only if you want to."],
        ["Learn the strength routine", "One easy round of the early-weeks column. Perfect form, no rush."],
        ["Optional jog", "15–20 minutes very easy, only if you want to."],
        ["Off", "Rest up."],
        ["Play", "Something active with friends."],
        ["Off", "Real training starts tomorrow. Lay out your gear."]
      ];
      (w.second ? R2 : R1).forEach(function(r, j){
        var tags = [];
        if (w.second && j === 2){ tags.push("strength"); if (buddy.indexOf("strength") >= 0) tags.push("buddy"); }
        if (j === 5 && buddy.length) tags.push("buddy");
        add(j, r[0], r[0], r[1], tags, r[0] === "Off");
      });
      return out;
    }

    var T = TEMPLATES[plan.D], per = fmt(w.per);
    T.roles.forEach(function(role, j){
      var t, s, d, tags = [], rest = false;
      if (role === "qual" && !w.q) role = "easyS";
      if (role === "easyS" && !w.strides) role = "easy";
      if (role === "easyS" && j === T.hill && w.hills) role = "easyH";

      if (role === "easy"){
        t = "Easy run"; s = "Easy " + per;
        d = per + " mi easy. Full sentences the whole way.";
      } else if (role === "easyS"){
        t = "Easy run + strides"; s = "Easy " + per + " + strides";
        d = per + " mi easy, then 4 × 100m strides: fast, relaxed, full walk-back recovery.";
      } else if (role === "easyH"){
        t = "Easy run + hill sprints"; s = "Easy " + per + " + " + w.hills + " hill sprints";
        d = per + " mi easy, then " + w.hills + " \u00d7 8-second sprints up a steep hill. Fast and smooth, walk back down, and take at least two minutes before the next one. These build power; they shouldn't leave you tired.";
      } else if (role === "qual"){
        var q = quality(w.q, L.i, per);
        t = q.t; s = q.s; d = q.d; tags = tags.concat(B("workout"));
      } else if (role === "long"){
        t = "Long run"; s = "Long run " + fmt(w.long);
        d = fmt(w.long) + " mi at easy effort. The most valuable run of your week. If you finish wrecked, it was too fast, not too far.";
        tags = tags.concat(B("long"));
      } else if (role === "off"){
        if (xt){
          t = "Cross-train or rest"; s = "Cross-train 30 min or rest";
          d = "30–40 minutes easy on the " + xt + ", at the same conversational effort as an easy run. Or take the day off.";
        } else {
          t = "Rest"; s = "Rest"; d = "Rest day. A walk is fine."; rest = true;
        }
      } else {
        t = "Rest"; s = "Rest"; d = "Full rest. This is when the training sinks in."; rest = true;
      }
      if (T.str.indexOf(j) >= 0){
        tags.push("strength");
        if (buddy.indexOf("strength") >= 0 && tags.indexOf("buddy") < 0) tags.push("buddy");
        s += " + strength";
        d += " Strength routine afterward.";
      }
      add(j, t, s, d, tags, rest);
    });
    return out;
  }

  function whyWeek(w){
    if (plan.inSport){
      return w.sportOff
        ? "One season just ended and another is starting. No extra running at all this week."
        : "Your sport is your training. One or two short, easy runs keep the feel for running without piling a second season on top of the first.";
    }
    if (w.phase === "recharge"){
      return w.second
        ? "Still resting. A short jog or two if you miss it, and a first look at the strength routine. Nothing this week should feel like training."
        : "No running this week, on purpose. Your bones, tendons, and head all need the break more than your lungs do. You'll lose a little fitness and get all of it back.";
    }
    if (w.phase === "rebuild"){
      return w.first
        ? "Back to running. Everything is easy, and nothing should feel like work yet. Finish every run feeling like you could have kept going."
        : "Still rebuilding. A few more miles than last week, all of them easy, with strides back in to wake your legs up.";
    }
    if (w.kind === "cut"){
      return "A lighter week on purpose. This is where the last few weeks turn into fitness. No workout, just easy miles and strides. Don't add to it because you feel good.";
    }
    if (w.kind === "peak"){
      return "Your biggest week of the winter. Sleep, eat, and keep the easy days honestly easy. Everything else this week depends on that.";
    }
    if (w.phase === "base"){
      return "Base building. Mostly easy miles, one light quality session, and a long run. Add distance to the easy days first.";
    }
    return w.last
      ? "Last week of the plan, and a little lighter so you finish fresh. Take a day or two easy afterward, then you're ready for whatever spring brings."
      : "Bridge to spring. Mileage levels off and the quality session gets a bit more focused, so the first week of the next season isn't a shock.";
  }

  var KINDLABEL = { recharge:"Recharge", rebuild:"Rebuild", base:"Base", cut:"Lighter week", peak:"Biggest week",
                    bridge:"Bridge to spring", maintain:"In season" };

  // ---------- personal cards ----------
  function fuelCard(a){
    var out = [];
    if (a.runTime === "before"){
      out.push(["Morning runs:", "eat something small first (half a banana, a piece of toast, a few sips of juice), then a real breakfast with protein right after. Running on empty every morning adds up."]);
    } else if (a.runTime === "evening"){
      out.push(["Evening runs:", "give dinner two to three hours to settle, or run first and eat after. Have a snack with protein before bed, like cereal and milk, yogurt, or a sandwich, so you recover overnight."]);
    } else {
      out.push(["After-school runs:", "lunch was hours ago. Eat a carbohydrate snack around last period, like a granola bar, banana, pretzels, or a bagel, and have dinner or a real snack within an hour of finishing."]);
    }
    if (a.sport === "yes"){
      out.push(["Practice plus a run:", "on days with both, eat like it's a hard day. Half your plate grains and starches, plus a snack between school and practice."]);
    }
    out.push(["Build your plate to the day:", "easy or rest day, half fruits and vegetables. Long run or workout day, half grains and starches. Protein on the plate every time."]);
    out.push(["Protein at every meal:", "a palm-sized portion, spread across the day, instead of one big serving at dinner."]);
    if (a.diet === "veg"){
      out.push(["No meat:", "beans, lentils, tofu, eggs, and fortified cereal for iron and protein, with vitamin C at the same meal. Fully vegan? You need a reliable source of B12. Ask your doctor about checking iron and vitamin D."]);
    } else if (a.diet === "nodairy"){
      out.push(["No dairy:", "fortified soy or oat milk, calcium-set tofu, and canned salmon for calcium and vitamin D. Check labels and aim for about 1,300 mg of calcium a day."]);
    } else {
      out.push(["Bone and blood:", "about four servings of milk, yogurt, or cheese a day for calcium; iron-rich foods like red meat, beans, and fortified cereal most days; and vitamin D from food, because the winter sun here can't make it for you."]);
    }
    out.push(["Drink through the day:", "keep a water bottle at school. Cold air hides thirst."]);
    out.push(["Never diet in the off-season:", "tired or cold all the time, missed periods, or one injury after another means tell a coach, parent, or doctor."]);
    return out;
  }

  function dayOf(role){
    var T = TEMPLATES[plan.D];
    if (!T) return "";
    return DAYFULL[T.roles.indexOf(role)];
  }
  function strengthDays(){
    var T = TEMPLATES[plan.D];
    if (!T) return "";
    return T.str.map(function(i){ return DAYFULL[i]; }).join(" and ");
  }

  function teamCard(a){
    var out = [];
    if (a.partners === "solo"){
      out.push(["Flying solo:", "that works. Before every run, tell someone your route and when you'll be back."]);
      out.push(["Stay connected:", "text a teammate when you finish, or log it on Strava. Knowing someone will notice makes it easier to get out the door."]);
      out.push(["Leave the door open:", "one shared run a month still helps. The invite further down this page is ready when you are."]);
      return out;
    }
    var who = a.partners === "group" ? "your group" : "your teammate";
    if (plan.inSport){
      out.push(["Weekend easy run:", "meet " + who + " on Saturday when there's no game. Easy pace, strides after."]);
    } else {
      if (a.buddy.indexOf("long") >= 0){
        out.push(["Long run:", "Saturdays with " + who + ". Same time and place every week, at an easy pace for the slowest runner."]);
      }
      if (a.buddy.indexOf("workout") >= 0){
        out.push(["Quality day:", dayOf("qual") + "s with " + who + ". Warm up and cool down together even if you split up for the fast parts."]);
      }
      if (a.buddy.indexOf("strength") >= 0){
        out.push(["Strength:", strengthDays() + " with " + who + ". Watch each other's form and count reps out loud."]);
      }
      if (!a.buddy.length){
        out.push(["Pick one:", "choose one run a week to share with " + who + ". The long run is the easiest place to start."]);
      }
    }
    out.push(["Different paces?", "Run out and back. Everyone goes out for half their time, then turns around, so you start and finish together."]);
    if (a.partners === "group"){
      out.push(["Keep it simple:", "one person sends the time and place each week. Rotate who that is."]);
    }
    out.push(["Can't meet up?", "Text each other when you're done. That still counts."]);
    return out;
  }

  function inviteText(){
    var url = /^https?:/.test(location.protocol) ? location.href.split("#")[0].split("?")[0] : SITE;
    var what = "some runs";
    if (plan && !plan.inSport){
      var b = buddyFor(plan.a), bits = [];
      if (b.indexOf("long") >= 0) bits.push("Saturday long runs");
      if (b.indexOf("workout") >= 0) bits.push("the " + dayOf("qual") + " workout");
      if (b.indexOf("strength") >= 0) bits.push("strength days");
      if (bits.length) what = bits.length > 1 ? bits.slice(0, -1).join(", ") + " and " + bits[bits.length - 1] : bits[0];
    } else if (plan && plan.inSport){
      what = "an easy run on Saturdays";
    }
    var when = plan ? " starting " + shortDate(plan.start) : "";
    return "Hey! I'm doing the Little Chute winter training plan" + when + ". Want to do " + what +
      " together? It takes two minutes to build yours: " + url;
  }

  // ---------- wizard ----------
  var STEPS = [
    { title:"About you", sub:"So the plan starts where you actually are.", qs:[
      { key:"name", type:"text", label:"First name", hint:"Optional. It goes at the top of your PDF.", ph:"Your first name" },
      { key:"level", type:"single", label:"Which sounds most like your fall?", hint:"When it's close, pick the smaller one.", opts:[
        { v:"starter",  b:"Starter",  s:"New to running, or my weeks were under 15 miles" },
        { v:"builder",  b:"Builder",  s:"I ran about 15–25 miles a week" },
        { v:"varsity",  b:"Varsity",  s:"I ran about 25–35 miles a week" },
        { v:"advanced", b:"Advanced", s:"35 or more miles a week, with a few years behind me" }
      ]},
      { key:"state", type:"single", label:"Where are you right now?", opts:[
        { v:"ended",   b:"Season just ended",  s:"I haven't taken a real break yet" },
        { v:"rested",  b:"I've had my break",  s:"Not running much at the moment" },
        { v:"running", b:"Already running",    s:"A few easy runs a week for the last few weeks" }
      ]}
    ]},
    { title:"Your winter", sub:"A winter sport changes the plan, in a good way.", qs:[
      { key:"sport", type:"single", label:"Are you playing a winter sport?", opts:[
        { v:"no",  b:"No, running is my focus", s:"I can follow a running plan all winter" },
        { v:"yes", b:"Yes, I'm in a winter sport", s:"Basketball, wrestling, hockey, swimming, skiing, dance..." }
      ]},
      { key:"weeks", type:"single", tight:true, label:"How many weeks until your next season starts?", hint:"Count from when you'll start this plan to the first spring practice. Twelve is a good default.", opts:[
        { v:"8", b:"8 weeks" }, { v:"12", b:"12 weeks" }, { v:"16", b:"16 weeks" }
      ]},
      { key:"start", type:"date", label:"When does week 1 start?", hint:"Weeks run Monday to Sunday. Pick any day and the plan starts on that week's Monday." }
    ]},
    { title:"Your week", sub:"Be honest about your schedule. A plan you can actually follow beats a bigger one you can't.", qs:[
      { key:"days", type:"single", tight:true, label:"How many days a week can you run?", hint:"School, a job, family: count the days that really work.",
        show:function(a){ return a.sport !== "yes"; },
        opts:function(a){
          var max = a.level ? LEVELS[a.level].maxDays : 6, o = [];
          for (var d = 3; d <= max; d++) o.push({ v:String(d), b:d + " days" });
          return o;
        }},
      { key:"where", type:"single", label:"Where will you run?", opts:[
        { v:"out",  b:"Outside", s:"Roads, trails, the track if it's clear" },
        { v:"mill", b:"Treadmill", s:"At home, school, or a gym" },
        { v:"both", b:"A mix", s:"Outside when I can, inside when I can't" }
      ]},
      { key:"xt", type:"multi", label:"Anything you can cross-train on?", hint:"Pick any that apply, or none. These fill your non-running days.", opts:[
        { v:"bike",  b:"Bike or trainer" },
        { v:"pool",  b:"Pool" },
        { v:"ski",   b:"Skis or snowshoes" },
        { v:"court", b:"Open gym" }
      ]},
      { key:"gym", type:"single", label:"Where will you do strength work?", opts:[
        { v:"home", b:"At home", s:"Bodyweight and a backpack" },
        { v:"room", b:"Weight room", s:"School or a gym, with someone to teach the lifts" }
      ]}
    ]},
    { title:"Your people", sub:"Winter running sticks better with company. Even one shared run a week helps.", qs:[
      { key:"partners", type:"single", label:"Who could you train with?", opts:[
        { v:"some",  b:"A teammate or two", s:"I can think of someone to ask" },
        { v:"group", b:"A group", s:"Several of us want to do this together" },
        { v:"solo",  b:"Mostly on my own", s:"That's what works for me right now" }
      ]},
      { key:"buddy", type:"multi", label:"Which sessions would you share?", hint:"Pick any. Your plan will mark these days.",
        show:function(a){ return a.partners !== "solo" && a.sport !== "yes"; },
        opts:[
          { v:"long",     b:"Long run", s:"The easiest one to share" },
          { v:"workout",  b:"Quality day", s:"Fartleks, hills, tempo" },
          { v:"strength", b:"Strength", s:"A partner to check form" }
        ]}
    ]},
    { title:"Your fuel", sub:"Last step. This shapes the nutrition card in your plan.", qs:[
      { key:"runTime", type:"single", label:"When will you usually train?", opts:[
        { v:"before",  b:"Before school" },
        { v:"after",   b:"After school" },
        { v:"evening", b:"In the evening" }
      ]},
      { key:"diet", type:"single", label:"Anything about how you eat we should know?", opts:[
        { v:"all",     b:"I eat pretty much everything" },
        { v:"veg",     b:"Vegetarian or vegan" },
        { v:"nodairy", b:"No dairy" }
      ]}
    ]}
  ];

  function renderStep(focusKey, focusVal){
    var S = STEPS[step];
    var dots = $("wizSteps"); dots.innerHTML = "";
    STEPS.forEach(function(_, i){
      var d = document.createElement("i");
      d.className = i < step ? "done" : (i === step ? "on" : "");
      dots.appendChild(d);
    });
    $("wizCount").textContent = "Step " + (step + 1) + " of " + STEPS.length;
    $("wizTitle").textContent = S.title;
    $("wizSub").textContent = S.sub;
    $("wizErr").setAttribute("hidden", "");

    var box = $("wizQs"); box.innerHTML = "";
    S.qs.forEach(function(q){
      if (q.show && !q.show(A)) return;
      var wrap = document.createElement("div"); wrap.className = "q";
      var lab = document.createElement(q.type === "text" || q.type === "date" ? "label" : "p");
      lab.className = "q-label"; lab.textContent = q.label;
      wrap.appendChild(lab);
      if (q.hint){
        var h = document.createElement("p"); h.className = "q-hint"; h.textContent = q.hint; wrap.appendChild(h);
      }
      if (q.type === "text" || q.type === "date"){
        var inp = document.createElement("input");
        inp.type = q.type; inp.id = "q_" + q.key; lab.setAttribute("for", inp.id);
        inp.value = A[q.key] || "";
        if (q.ph) inp.placeholder = q.ph;
        if (q.type === "text"){ inp.maxLength = 30; inp.autocomplete = "given-name"; }
        inp.addEventListener("input", function(){ A[q.key] = inp.value; save(); });
        wrap.appendChild(inp);
      } else {
        var opts = typeof q.opts === "function" ? q.opts(A) : q.opts;
        var g = document.createElement("div");
        g.className = "opts" + (q.tight ? " tight" : "");
        g.setAttribute("role", "group"); g.setAttribute("aria-label", q.label);
        opts.forEach(function(o){
          var b = document.createElement("button");
          b.type = "button"; b.className = "opt";
          b.dataset.key = q.key; b.dataset.val = o.v;
          var on = q.type === "multi" ? A[q.key].indexOf(o.v) >= 0 : String(A[q.key]) === o.v;
          b.setAttribute("aria-pressed", on ? "true" : "false");
          b.innerHTML = "<b>" + esc(o.b) + "</b>" + (o.s ? "<span>" + esc(o.s) + "</span>" : "");
          b.addEventListener("click", function(){
            if (q.type === "multi"){
              var at = A[q.key].indexOf(o.v);
              if (at >= 0) A[q.key].splice(at, 1); else A[q.key].push(o.v);
            } else {
              A[q.key] = o.v;
              if (q.key === "level"){
                var L = LEVELS[o.v];
                if (!A.days || +A.days > L.maxDays || !A.daysTouched) A.days = String(L.days);
              }
              if (q.key === "days") A.daysTouched = true;
            }
            save();
            renderStep(q.key, o.v);
          });
          g.appendChild(b);
        });
        wrap.appendChild(g);
      }
      box.appendChild(wrap);
    });

    $("wizBack").hidden = step === 0;
    $("wizNext").textContent = step === STEPS.length - 1 ? "Build my plan" : "Next";

    if (focusKey){
      var again = box.querySelector('.opt[data-key="' + focusKey + '"][data-val="' + focusVal + '"]');
      if (again) again.focus();
    }
  }

  function validate(){
    if (step === 0){
      if (!A.level) return "Pick the option that sounds most like your fall.";
      if (!A.state) return "Tell us where you are right now.";
    }
    if (step === 1 && !parseDate(A.start)) return "Pick a start date for week 1.";
    return "";
  }

  $("wizNext").addEventListener("click", function(){
    var err = validate();
    if (err){
      var e = $("wizErr"); e.textContent = err; e.removeAttribute("hidden");
      return;
    }
    if (step < STEPS.length - 1){
      step++; renderStep(); $("wizTitle").focus();
      $("build").scrollIntoView({ block:"start" });
    } else {
      finish(true);
    }
  });
  $("wizBack").addEventListener("click", function(){
    if (step > 0){ step--; renderStep(); $("wizTitle").focus(); }
  });

  function finish(scroll){
    if (!A.days) A.days = String(LEVELS[A.level].days);
    plan = buildPlan(A);
    A.built = true; save();
    sel = currentWeekIndex();
    gymView = A.gym;
    $("build").setAttribute("hidden", "");
    $("build").style.display = "none";
    $("plan").removeAttribute("hidden");
    renderPlan();
    renderStrength();
    $("inviteText").value = inviteText();
    if (scroll){
      $("plan").scrollIntoView({ block:"start" });
      $("planTitle").setAttribute("tabindex", "-1"); $("planTitle").focus({ preventScroll:true });
    }
  }

  function currentWeekIndex(){
    var now = new Date(); now.setHours(12, 0, 0, 0);
    var diff = Math.floor((now - plan.start) / (7 * 864e5));
    return diff >= 0 && diff < plan.weeks.length ? diff : 0;
  }

  // ---------- plan rendering ----------
  var SVG_NS = "http://www.w3.org/2000/svg";
  function el(name, attrs){
    var n = document.createElementNS(SVG_NS, name);
    for (var k in attrs){ n.setAttribute(k, attrs[k]); }
    return n;
  }

  function drawChart(){
    var svg = $("pChart");
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    var weeks = plan.weeks, n = weeks.length;
    var avail = (svg.parentNode && svg.parentNode.clientWidth) || 0;
    var W = Math.max(320, Math.min(1120, avail ? avail - 16 : 660));
    var H = 190, padX = 6, top = 36, bottom = 164;
    svg.setAttribute("viewBox", "0 0 " + W + " " + H);
    var max = Math.max(1, plan.peak);
    var stepW = (W - padX * 2) / n, bw = Math.min(46, stepW * 0.62);

    svg.appendChild(el("line", { x1:padX, y1:bottom, x2:W - padX, y2:bottom, stroke:"#D6E2EF", "stroke-width":1 }));
    weeks.forEach(function(w, i){
      var cx = padX + stepW * (i + 0.5), on = i === sel;
      var h = w.m > 0 ? Math.max(8, (w.m / max) * (bottom - top)) : 5;
      var color = w.kind === "cut" ? "#8CC4EE" : PHASES[w.phase].color;
      if (on) svg.appendChild(el("rect", { x:cx - stepW / 2 + 1, y:6, width:stepW - 2, height:bottom - 6, rx:8, fill:"#2575B5", "fill-opacity":".07" }));
      svg.appendChild(el("rect", { x:cx - bw / 2, y:bottom - h, width:bw, height:h, rx:Math.min(5, h / 2), fill:color, "fill-opacity": on ? 1 : .62 }));
      var t = el("text", {
        x:cx, y:bottom - h - 8, "text-anchor":"middle",
        "font-family":"Archivo, Helvetica Neue, Arial, sans-serif",
        "font-size": on ? (stepW < 30 ? 14 : 17) : (stepW < 30 ? 8.5 : 12), "font-weight": on ? 800 : 600,
        fill: on ? "#233766" : "#6A7B95"
      });
      t.textContent = w.m > 0 ? fmt(w.m) : "off";
      svg.appendChild(t);
      var hit = el("rect", { x:cx - stepW / 2, y:0, width:stepW, height:H, fill:"transparent", style:"cursor:pointer" });
      hit.addEventListener("click", function(){ sel = i; renderPlan(); });
      svg.appendChild(hit);
    });

    var px = $("pX"); px.innerHTML = "";
    px.style.gridTemplateColumns = "repeat(" + n + ",1fr)";
    weeks.forEach(function(_, i){
      var s = document.createElement("span");
      s.textContent = (n > 12 ? "" : "W") + (i + 1);
      if (i === sel) s.className = "on";
      px.appendChild(s);
    });
  }

  function renderPlan(){
    var a = plan.a, weeks = plan.weeks, w = weeks[sel];
    var nm = a.name.trim();
    $("planTitle").textContent = nm ? nm + "'s winter plan" : "Your winter plan";
    $("planLede").textContent = plan.inSport
      ? "Built around your winter sport: practices and games do the heavy lifting, with a little easy running to keep the feel. Tap any week to see it day by day."
      : "Rest first, rebuild easy, then build a base with one light quality day a week. Tap any week to see it day by day.";

    $("pBig").textContent = fmt(plan.peak);
    $("pBigCap").textContent = plan.inSport ? "Easy miles a week" : "Miles in your biggest week";
    $("pMeta").innerHTML =
      "<b>" + esc(plan.L.label) + "</b> &middot; " + weeks.length + " weeks<br>" +
      "<b>" + shortDate(plan.start) + "</b> to <b>" + shortDate(plan.end) + "</b><br>" +
      (plan.inSport ? "Your sport, plus <b>1–2 easy runs</b>" : "Running <b>" + plan.D + " days</b> a week") +
      " &middot; strength <b>" + (plan.inSport ? "with your team" : "2 days") + "</b>";

    drawChart();

    var used = {}; weeks.forEach(function(x){ used[x.phase] = 1; });
    $("pLegend").innerHTML = ["recharge","rebuild","base","bridge","maintain"].filter(function(k){ return used[k]; })
      .map(function(k){ return '<span><i style="background:' + PHASES[k].color + '"></i>' + PHASES[k].label + "</span>"; }).join("") +
      (weeks.some(function(x){ return x.kind === "cut"; }) ? '<span><i style="background:#8CC4EE;outline:1.5px solid #2575B5;outline-offset:1px"></i>Lighter week</span>' : "");

    $("pWeek").textContent = "Week " + w.n + " of " + weeks.length + " · " + shortDate(w.start) + " to " + shortDate(addDays(w.start, 6));
    var tag = $("pTag");
    tag.className = "tag " + (w.kind === "cut" ? "rebuild" : w.kind === "peak" ? "bridge" : w.phase);
    tag.textContent = KINDLABEL[w.kind];
    $("pMiles").innerHTML = w.m > 0 ? fmt(w.m) + "<small>mi</small>" : "Off";
    $("pLong").innerHTML = w.long > 0 ? fmt(w.long) + "<small>mi</small>" : "—";
    $("pKey").textContent = w.key;
    $("pWhy").textContent = whyWeek(w);

    var list = $("pDays"); list.innerHTML = "";
    weekDays(w).forEach(function(d){
      var li = document.createElement("li");
      if (d.rest) li.className = "restday";
      var chips = d.tags.map(function(t){
        return t === "buddy" ? '<span class="chip buddy">With a teammate</span>' : '<span class="chip strength">Strength</span>';
      }).join("");
      li.innerHTML =
        '<div class="dn">' + d.name + "<small>" + shortDate(d.date) + "</small></div>" +
        '<div><p class="dt">' + esc(d.t) + '</p><p class="dd">' + esc(d.d) + "</p>" + chips + "</div>";
      list.appendChild(li);
    });
    $("pPrev").disabled = sel === 0;
    $("pNext").disabled = sel === weeks.length - 1;

    var tb = $("pTbody"); tb.innerHTML = "";
    weeks.forEach(function(x, i){
      var tr = document.createElement("tr");
      if (i === sel) tr.className = "on";
      tr.innerHTML =
        '<td class="wk">Week ' + x.n + "</td>" +
        "<td>" + shortDate(x.start) + "</td>" +
        '<td class="note">' + KINDLABEL[x.kind] + "</td>" +
        '<td class="mi">' + (x.m > 0 ? fmt(x.m) : "Off") + "</td>" +
        "<td>" + (x.long > 0 ? fmt(x.long) + " mi" : "—") + "</td>" +
        "<td>" + esc(x.key) + "</td>";
      tr.addEventListener("click", function(){
        sel = i; renderPlan();
        $("pDetail").scrollIntoView({ block:"nearest" });
      });
      tb.appendChild(tr);
    });

    function fill(id, rows){
      $(id).innerHTML = rows.map(function(r){ return "<li><strong>" + esc(r[0]) + "</strong> " + esc(r[1]) + "</li>"; }).join("");
    }
    fill("pFuel", fuelCard(a));
    fill("pTeam", teamCard(a));
  }

  $("pPrev").addEventListener("click", function(){ if (sel > 0){ sel--; renderPlan(); } });
  $("pNext").addEventListener("click", function(){ if (plan && sel < plan.weeks.length - 1){ sel++; renderPlan(); } });

  $("editBtn").addEventListener("click", function(){
    step = 0;
    $("build").removeAttribute("hidden"); $("build").style.display = "";
    renderStep();
    $("build").scrollIntoView({ block:"start" });
    $("wizTitle").focus({ preventScroll:true });
  });
  $("resetBtn").addEventListener("click", function(){
    if (!window.confirm("Start over? This clears your answers and your plan on this device.")) return;
    try { localStorage.removeItem(STORE); } catch(e){}
    A = { name:"", level:null, state:null, sport:"no", weeks:"12", start:iso(nextMonday()), days:null,
          where:"both", xt:[], gym:"home", partners:"some", buddy:["long"], runTime:"after", diet:"all" };
    plan = null; step = 0; sel = 0;
    $("plan").setAttribute("hidden", "");
    $("build").removeAttribute("hidden"); $("build").style.display = "";
    renderStep();
    $("inviteText").value = inviteText();
    $("build").scrollIntoView({ block:"start" });
  });

  // ---------- strength ----------
  var STRENGTH = {
    home: {
      rows: [
        ["Squat", "Sit back and down, stand up tall", "2 × 10, bodyweight", "3 × 8 each leg as a split squat, back foot on a chair"],
        ["Reverse lunge", "Step back, front knee tracks over your foot", "2 × 8 each leg", "3 × 10 each leg, wearing a loaded backpack"],
        ["Glute bridge", "Squeeze at the top for two seconds", "2 × 12", "3 × 8 each leg, one leg at a time"],
        ["Single-leg deadlift", "Hinge at the hip with a flat back and reach for the floor", "2 × 6 each leg", "3 × 8 each leg, holding a backpack"],
        ["Calf raise", "On a stair, slow on the way down", "2 × 15, both legs", "3 × 12 each leg, one leg at a time"],
        ["Side plank", "Straight line from ear to ankle", "2 × 20 sec each side", "3 × 30 sec each side, top leg lifted"],
        ["Dead bug", "Low back stays pressed into the floor", "2 × 8 each side", "3 × 10 each side, slower"],
        ["Pogo hops", "Quick and springy, stiff ankles", "Skip these for now", "2 × 15, then 2 × 6 squat jumps"]
      ],
      note: "<strong>How hard should it be?</strong> Finish every set knowing you could have done two or three more good reps. If your form changes, the set is over. The single-leg versions in the second column are the ones that matter most for runners, so earn your way there."
    },
    room: {
      rows: [
        ["Goblet squat", "One dumbbell held at your chest", "2 × 10, light", "3 × 6–8, heavier"],
        ["Romanian deadlift", "Dumbbells, hinge at the hip, flat back", "2 × 10, light", "3 × 8"],
        ["Split squat", "Dumbbells at your sides", "2 × 8 each leg", "3 × 8 each leg, back foot on a bench"],
        ["Step-up", "Knee-high box, drive up, lower slowly", "2 × 8 each leg", "3 × 8 each leg, holding dumbbells"],
        ["Calf raise", "Slow on the way down", "2 × 15, both legs", "3 × 10 each leg, holding a dumbbell"],
        ["Pull-up or row", "Assisted pull-up, or a dumbbell row", "2 × 8", "3 × 8"],
        ["Side plank", "Straight line from ear to ankle", "2 × 20 sec each side", "3 × 30 sec each side"],
        ["Box jump", "Land soft and quiet, step down", "Skip these for now", "3 × 5 on a low box"]
      ],
      note: "<strong>Weight room rules.</strong> Learn every lift from a coach before you add weight to it. Technique first, load second. Finish each set with two or three good reps left, never max out, and never lift alone. Barbell squats and deadlifts are great later on, once a coach has taught you and says you're ready."
    }
  };

  function renderStrength(){
    var S = STRENGTH[gymView];
    $("sBody").innerHTML = S.rows.map(function(r){
      return '<tr><td class="ex">' + esc(r[0]) + "<small>" + esc(r[1]) + "</small></td><td>" + esc(r[2]) + "</td><td>" + esc(r[3]) + "</td></tr>";
    }).join("");
    $("sNote").innerHTML = S.note;
    Array.prototype.forEach.call(document.querySelectorAll(".seg button"), function(b){
      b.setAttribute("aria-pressed", b.dataset.gym === gymView ? "true" : "false");
    });
  }
  Array.prototype.forEach.call(document.querySelectorAll(".seg button"), function(b){
    b.addEventListener("click", function(){ gymView = b.dataset.gym; renderStrength(); });
  });

  // ---------- invite ----------
  function say(id, msg){
    var m = $(id); m.textContent = msg; m.removeAttribute("hidden");
    clearTimeout(m._t); m._t = setTimeout(function(){ m.setAttribute("hidden", ""); }, 6000);
  }
  function copyInvite(){
    var ta = $("inviteText");
    function fallback(){
      ta.focus(); ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch(e){}
      say("shareMsg", ok ? "Copied. Paste it into a text or group chat." : "Select the message and copy it, then paste it into a text.");
    }
    if (navigator.clipboard && navigator.clipboard.writeText){
      navigator.clipboard.writeText(ta.value).then(function(){
        say("shareMsg", "Copied. Paste it into a text or group chat.");
      }, fallback);
    } else { fallback(); }
  }
  $("copyBtn").addEventListener("click", copyInvite);
  $("shareBtn").addEventListener("click", function(){
    if (navigator.share){
      navigator.share({ text:$("inviteText").value }).catch(function(){});
    } else { copyInvite(); }
  });

  // ---------- storage ----------
  function save(){
    try { localStorage.setItem(STORE, JSON.stringify(A)); } catch(e){}
  }
  function load(){
    try {
      var raw = localStorage.getItem(STORE);
      if (!raw) return;
      var o = JSON.parse(raw);
      if (!o || typeof o !== "object") return;
      Object.keys(A).concat(["built","daysTouched"]).forEach(function(k){
        if (o[k] !== undefined && o[k] !== null) A[k] = o[k];
      });
      if (!Array.isArray(A.xt)) A.xt = [];
      if (!Array.isArray(A.buddy)) A.buddy = ["long"];
      if (typeof A.name !== "string") A.name = "";
      if (!LEVELS[A.level]){ A.level = null; A.built = false; }
      if (["ended","rested","running"].indexOf(A.state) < 0){ A.state = null; A.built = false; }
      if (["8","12","16"].indexOf(String(A.weeks)) < 0) A.weeks = "12";
      if (!parseDate(A.start)) A.start = iso(nextMonday());
    } catch(e){}
  }

  // ---------- PDF ----------
  var pdfLoading = null;
  function loadScript(src){
    return new Promise(function(res, rej){
      var s = document.createElement("script");
      s.src = src; s.onload = res; s.onerror = function(){ rej(new Error("load " + src)); };
      document.head.appendChild(s);
    });
  }
  function ensurePdf(){
    if (window.jspdf && window.jspdf.jsPDF && window.jspdf.jsPDF.API.autoTable) return Promise.resolve();
    if (!pdfLoading){
      pdfLoading = loadScript("vendor/jspdf.umd.min.js")
        .then(function(){ return loadScript("vendor/jspdf.plugin.autotable.min.js"); })
        .then(loadLogo)
        .catch(function(e){ pdfLoading = null; throw e; });
    }
    return pdfLoading;
  }

  var logo = null;
  function loadLogo(){
    return new Promise(function(res){
      var im = new Image();
      im.onload = function(){
        try {
          var c = document.createElement("canvas");
          c.width = im.naturalWidth; c.height = im.naturalHeight;
          c.getContext("2d").drawImage(im, 0, 0);
          logo = { data:c.toDataURL("image/png"), ratio:im.naturalHeight / im.naturalWidth };
        } catch(e){ logo = null; }
        res();
      };
      im.onerror = function(){ res(); };
      im.src = "img/lc-logo-sm.png";
    });
  }

  // the built-in PDF fonts only cover basic Latin, so keep the text inside it
  function P(s){
    return String(s)
      .replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
      .replace(/[–—]/g, "-").replace(/×/g, "x").replace(/·/g, "-")
      .replace(/−/g, "-").replace(/[^\x20-\x7E -ÿ]/g, "");
  }

  function buildPdf(){
    var J = window.jspdf.jsPDF;
    var doc = new J({ unit:"pt", format:"letter", orientation:"portrait" });
    var a = plan.a, weeks = plan.weeks, M = 44;
    var NAVY = [35,55,102], INK = [16,35,58], INK2 = [74,95,118], INK3 = [132,151,168], LINE = [216,227,236], TINT = [241,246,250];
    var y = M;
    function PW(){ return doc.internal.pageSize.getWidth(); }
    function PH(){ return doc.internal.pageSize.getHeight(); }
    function need(h){ if (y + h > PH() - M - 14){ doc.addPage("letter", "portrait"); y = M; } }
    function color(c){ doc.setTextColor(c[0], c[1], c[2]); }
    function kicker(t){
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); color(INK3);
      doc.text(P(t).toUpperCase(), M, y + 8, { charSpace:1.2 }); y += 18;
    }
    function h1(t){
      doc.setFont("helvetica", "bold"); doc.setFontSize(24); color(NAVY);
      doc.text(P(t), M, y + 20); y += 32;
    }
    function h2(t){
      need(60);
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); color(NAVY);
      doc.text(P(t), M, y + 12); y += 22;
    }
    function para(t, c){
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); color(c || INK2);
      var lines = doc.splitTextToSize(P(t), PW() - M * 2);
      need(lines.length * 13.5 + 6);
      doc.text(lines, M, y + 9); y += lines.length * 13.5 + 6;
    }
    function bullets(rows){
      var indent = 12, width = PW() - M * 2 - indent;
      rows.forEach(function(r){
        doc.setFontSize(10);
        var lead = P(r[0]) + " ";
        doc.setFont("helvetica", "bold");
        var lw = doc.getTextWidth(lead);
        doc.setFont("helvetica", "normal");
        var lines = doc.splitTextToSize(P(r[1]), width);
        // first line shares the row with the bold lead-in
        var first = doc.splitTextToSize(P(r[1]), width - lw);
        var rest = first.length > 1 ? doc.splitTextToSize(first.slice(1).join(" "), width) : [];
        lines = rest;
        var h = (1 + lines.length) * 13.5 + 4;
        need(h);
        doc.setFillColor(75, 156, 211); doc.circle(M + 3, y + 6, 1.8, "F");
        doc.setFont("helvetica", "bold"); color(INK);
        doc.text(lead, M + indent, y + 9);
        doc.setFont("helvetica", "normal"); color(INK2);
        doc.text(first[0] || "", M + indent + lw, y + 9);
        if (lines.length) doc.text(lines, M + indent, y + 9 + 13.5);
        y += h;
      });
      y += 6;
    }
    function table(opts){
      var base = {
        startY:y, margin:{ left:M, right:M, top:M, bottom:M + 10 }, theme:"grid",
        styles:{ font:"helvetica", fontSize:9, cellPadding:{ top:5, right:6, bottom:5, left:6 }, textColor:INK, lineColor:LINE, lineWidth:.5, overflow:"linebreak", valign:"middle" },
        headStyles:{ fillColor:NAVY, textColor:255, fontSize:7.5, fontStyle:"bold", cellPadding:{ top:5, right:6, bottom:5, left:6 } },
        alternateRowStyles:{ fillColor:[250,252,253] }
      };
      for (var k in opts) base[k] = opts[k];
      doc.autoTable(base);
      y = doc.lastAutoTable.finalY + 18;
    }

    // ----- page 1: overview -----
    var nm = a.name.trim();
    if (logo){ try { doc.addImage(logo.data, "PNG", PW() - M - 78, M - 10, 78, 78 * logo.ratio); } catch(e){} }
    kicker("Little Chute Mustangs - Cross Country");
    h1(nm ? nm + "'s Winter Training Plan" : "Winter Training Plan");
    doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); color(INK2);
    doc.text(P(plan.L.label + " level  |  " + weeks.length + " weeks  |  " + shortDate(plan.start) + " to " + shortDate(plan.end) + ", " + plan.end.getFullYear() +
      "  |  " + (plan.inSport ? "winter sport + 1-2 easy runs" : plan.D + " running days a week") + (plan.inSport ? "" : "  |  strength 2 days")), M, y + 8);
    y += 26;

    para(plan.inSport
      ? "How this plan works: during your winter sport, practices and games are your training. One or two short, easy runs a week keep the feel for running. Do not stack a full running plan on top of your season. When your sport ends, take a few easy days, then build a new plan at lc-summer-mileage.vercel.app/winter.html."
      : "How this plan works: rest first, rebuild with easy running, then build a base with one light quality session a week and a long run. Every few weeks is lighter on purpose - that is when training turns into fitness. Nearly all of your running should be easy enough to talk in full sentences.");

    table({
      head:[["Week", "Starts", "Phase", "Miles", "Long run", "Key session", "Done"]],
      body: weeks.map(function(w){
        return ["Week " + w.n, shortDate(w.start), KINDLABEL[w.kind], w.m > 0 ? fmt(w.m) : "Off",
                w.long > 0 ? fmt(w.long) + " mi" : "-", P(w.key), ""];
      }),
      columnStyles:{ 0:{ fontStyle:"bold", cellWidth:54 }, 1:{ cellWidth:52 }, 2:{ cellWidth:92 }, 3:{ fontStyle:"bold", textColor:NAVY, cellWidth:44 }, 4:{ cellWidth:58 }, 6:{ cellWidth:40 } },
      didParseCell:function(d){
        if (d.section !== "body") return;
        var k = weeks[d.row.index].kind;
        if (k === "cut" || k === "recharge") d.cell.styles.fillColor = [244,250,253];
        if (k === "peak") d.cell.styles.fillColor = [232,241,248];
      }
    });
    para("Snow, ice, or a treadmill day? Go by time instead of distance: multiply the miles by your normal easy pace and run that many minutes. Missed a week? Do not make it up. Pick up at the last week you finished.", INK3);

    // ----- calendar (landscape) -----
    doc.addPage("letter", "landscape"); y = M;
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); color(NAVY);
    doc.text("Day by day", M, y + 12); y += 22;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); color(INK2);
    doc.text(P("Numbers are miles. Strides are 4 x 100m, fast and relaxed. * = a session to share with a teammate."), M, y + 6); y += 16;

    var cal = weeks.map(function(w){
      var row = ["Week " + w.n + "\n" + shortDate(w.start)];
      weekDays(w).forEach(function(d){
        row.push(P(d.s) + (d.tags.indexOf("buddy") >= 0 ? " *" : ""));
      });
      return row;
    });
    table({
      head:[["Week"].concat(DAYFULL)],
      body:cal,
      styles:{ font:"helvetica", fontSize: weeks.length > 12 ? 7 : 7.6, cellPadding:{ top:3.5, right:4, bottom:3.5, left:4 }, textColor:INK, lineColor:LINE, lineWidth:.5, overflow:"linebreak", valign:"middle" },
      columnStyles:{ 0:{ fontStyle:"bold", cellWidth:50 } },
      didParseCell:function(d){
        if (d.section !== "body") return;
        var k = weeks[d.row.index].kind;
        if (k === "cut" || k === "recharge") d.cell.styles.fillColor = [244,250,253];
        if (k === "peak") d.cell.styles.fillColor = [232,241,248];
        if (d.column.index > 0 && /^(Rest|Off)$/.test(d.cell.raw)) d.cell.styles.textColor = INK3;
      }
    });

    // ----- details (portrait) -----
    doc.addPage("letter", "portrait"); y = M;
    h2("Your quality sessions");
    var seen = {}, qrows = [];
    weeks.forEach(function(w){
      if (w.q && !seen[w.q]){
        seen[w.q] = 1;
        var q = quality(w.q, plan.L.i, fmt(w.per));
        qrows.push([q.t + ":", q.g]);
      }
    });
    if (weeks.some(function(w){ return w.hills; })){
      qrows.unshift(["Hill sprints:", "After an easy run, 8-second sprints up a steep hill. Fast and smooth, walk back down, and recover fully between each. They build power and shouldn't leave you tired."]);
    }
    if (qrows.length){ bullets(qrows); }
    else { para("No workouts in this plan. Your sport provides the hard days. Keep every run easy and finish with strides."); }

    h2(plan.inSport ? "Strength - if your team doesn't lift" : "Strength - 2 days a week, about 20 minutes");
    if (plan.inSport) para("If your winter sport has its own lifting program, that is your strength work; do not add this on top. If it doesn't, do this routine once a week on a lighter day.");
    var S = STRENGTH[a.gym] || STRENGTH.home;
    table({
      head:[["Exercise", "How", "Early weeks", "Once it's easy"]],
      body:S.rows.map(function(r){ return [P(r[0]), P(r[1]), P(r[2]), P(r[3])]; }),
      styles:{ font:"helvetica", fontSize:8.5, cellPadding:{ top:4, right:6, bottom:4, left:6 }, textColor:INK, lineColor:LINE, lineWidth:.5, overflow:"linebreak", valign:"middle" },
      columnStyles:{ 0:{ fontStyle:"bold", cellWidth:96 }, 1:{ textColor:INK2 }, 2:{ cellWidth:108 } }
    });
    y -= 6;
    para(a.gym === "room"
      ? "Learn every lift from a coach before adding weight. Finish each set with two or three good reps left. Never max out and never lift alone."
      : "Finish every set knowing you could have done two or three more good reps. Move to the next column only when every rep looks the same as the first.", INK3);

    h2("Your fuel card");
    bullets(fuelCard(a));

    h2("Your training partners");
    bullets(teamCard(a));

    h2("Winter rules");
    var rules = [
      ["Cold:", "layers, no cotton, mittens. Wind chill below zero, cover all skin and shorten it, or go inside. Below about -18 F wind chill, train indoors."],
      ["Dark and ice:", "light, reflective gear, run facing traffic, shorten your stride on anything slick."],
      ["Sick:", "symptoms above the neck only, easy running is fine. Fever, body aches, or chest cough, rest."],
      ["Sleep:", "eight to ten hours. It is the best recovery tool you have."],
      ["Pain:", "sharp, in one spot, or changing your stride means stop and tell a coach."]
    ];
    if (a.where === "mill" || a.where === "both"){
      rules.splice(2, 0, ["Treadmill:", "set a 1% incline and go by time and effort. For strides, speed up for 20 seconds, ease off for a minute, four times."]);
    }
    bullets(rules);

    // ----- footers -----
    var pages = doc.internal.getNumberOfPages();
    for (var p = 1; p <= pages; p++){
      doc.setPage(p);
      doc.setFont("helvetica", "normal"); doc.setFontSize(8); color(INK3);
      doc.text("Little Chute Cross Country - Winter training plan. General guidance, not medical advice. Your coaches have the final say.", M, PH() - 26);
      doc.text(p + " / " + pages, PW() - M, PH() - 26, { align:"right" });
    }
    return doc;
  }

  function pdfName(){
    var nm = (plan.a.name || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    return "winter-training-plan" + (nm ? "-" + nm : "") + ".pdf";
  }

  $("pdfBtn").addEventListener("click", function(){
    var btn = $("pdfBtn");
    if (!plan || btn.disabled) return;
    btn.disabled = true;
    say("pdfMsg", "Building your PDF...");
    ensurePdf().then(function(){
      var doc = buildPdf();
      doc.save(pdfName());
      say("pdfMsg", "Done. Check your downloads for " + pdfName() + ".");
    }).catch(function(err){
      if (window.console) console.error(err);
      say("pdfMsg", "Couldn't build the PDF here, so the print window is opening instead. Choose “Save as PDF”.");
      setTimeout(function(){ try { window.print(); } catch(e){} }, 400);
    }).then(function(){ btn.disabled = false; });
  });

  // hooks for automated checks
  window.__winter = {
    buildPlan:buildPlan, buildPdf:function(){ return ensurePdf().then(buildPdf); },
    getPlan:function(){ return plan; }, weekDays:function(i){ return weekDays(plan.weeks[i]); }
  };

  // ---------- go ----------
  var resizeTimer;
  window.addEventListener("resize", function(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function(){ if (plan) drawChart(); }, 160);
  });

  load();
  renderStep();
  renderStrength();
  $("inviteText").value = inviteText();
  if (A.built && A.level && A.state){
    try { finish(false); } catch(e){ if (window.console) console.error(e); }
  }
})();
