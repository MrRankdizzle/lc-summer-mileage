/* THE WHY — the science library.
   Each topic: what we do, why, the longer explanation, and the sources.
   "ev" says how solid the evidence is:
     strong = reviews of many studies, or expert consensus statements
     good   = individual studies, usually observational (shows a link, not proof)
     coach  = established coaching practice more than formal research
   Coach viewpoints are paraphrased, not quoted, and link to where they said it. */
(function(){
  var PM = "https://pubmed.ncbi.nlm.nih.gov/";
  window.WHY = {
    groups: [
      { id:"training", title:"Training" },
      { id:"body",     title:"Strength and body" },
      { id:"recovery", title:"Rest and recovery" },
      { id:"fuel",     title:"Fuel" },
      { id:"mind",     title:"Mind and team" }
    ],
    topics: [

    /* ------------------------------ TRAINING ------------------------------ */
    { id:"easy", g:"training", ev:"strong",
      q:"Why are easy days so slow?",
      short:"Easy running builds the aerobic system at a low cost, and it's what lets the hard days be hard.",
      doing:"Most of our running is at a pace where you can talk in full sentences. That's true in summer, in winter, and in season.",
      why:"Easy running grows the things endurance is made of: more capillaries, more mitochondria, a stronger heart. It does that without the recovery cost of hard running.",
      more:[
        "When researchers look at how the best endurance athletes in the world actually train, across running, rowing, skiing and cycling, they find the same pattern: about 80% of sessions are easy and about 20% are hard. That's a description of elite adults, not a law, but it has held up across sports and decades.",
        "The usual high school mistake is running the easy days medium-hard. Everything drifts to one gray middle pace, the easy days stop being restorative, and the workouts have nowhere left to go."
      ],
      voice:["Steve Magness", "He's skeptical of treating 80/20 as a magic ratio, but lands in the same place: you need all of it in varying amounts, and a mix that is mostly easy works best for the great majority of runners. He also notes that easy training simply takes longer to pay off, which is why patience matters."],
      src:[
        ["Seiler S. What is best practice for training intensity and duration distribution in endurance athletes? Int J Sports Physiol Perform. 2010.", PM + "20861519/"],
        ["Magness S. The debate over easy vs. high-intensity training is a waste of time. 2025.", "https://www.stevemagness.org/p/the-debate-over-easy-vs-high-intensity"]
      ],
      used:[["Summer mileage","summer.html#faq"],["Winter plan","winter.html#idea"]] },

    { id:"feel", g:"training", ev:"coach",
      q:"Why do we run by effort instead of by pace?",
      short:"Your body doesn't know what the watch says. Heat, hills, snow and a bad night's sleep all change the pace that a given effort produces.",
      doing:"Easy means conversational. Tempo means comfortably hard. We describe runs by how they should feel, and the watch is there to check, not to give orders.",
      why:"The training effect comes from the effort, not the number. The same effort can be a minute per mile slower on a hot day or on snow, and it's still the right run.",
      more:[
        "Learning to read your own effort is a skill, and it's the one that matters most in a race, where there are hills, mud, and no one calling splits. Runners who only know how to follow a watch tend to go out too fast and have no way to adjust."
      ],
      voice:["Steve Magness", "He describes GPS as a secondary check rather than the thing in charge, and warns that leaning on it too heavily weakens the link between what you feel and what you do. His high school athletes ran threshold work by feel and breathing. Arthur Lydiard taught the same idea decades earlier as listening to your inner coach."],
      src:[
        ["Magness S. A case for running by feel. Science of Running, 2016.", "https://www.scienceofrunning.com/2016/02/a-case-for-running-by-feel-ditching.html"],
        ["Lydiard Foundation. The Lydiard training principles.", "https://www.lydiardfoundation.org/about"]
      ],
      used:[["Summer heat","summer.html#faq"],["Winter snow days","winter.html#plan"]] },

    { id:"longrun", g:"training", ev:"good",
      q:"Why one long run a week?",
      short:"It's the single most valuable aerobic session, and mixing longer and shorter days appears to protect against injury.",
      doing:"One run a week is noticeably longer than the others, about a quarter of the week's miles, at the same easy effort.",
      why:"Time on your feet drives aerobic development and toughens bones, tendons and muscles for the back half of a 5K.",
      more:[
        "A study of 421 high school cross country runners looked at what they did over the summer. Among those who ran, the ones who did <strong>not</strong> regularly alternate short and long days were about three times more likely to be injured in the first month of the season. Running for eight weeks or fewer over the summer was also linked with more early-season injuries.",
        "It's one study and it shows a link rather than proof, but it matches what coaches have long seen: variety in the week, and enough weeks of it, is protective."
      ],
      src:[
        ["Rauh MJ. Summer training factors and risk of musculoskeletal injury among high school cross-country runners. J Orthop Sports Phys Ther. 2014.", PM + "25193436/"]
      ],
      used:[["Long run calculator","summer.html#longrun"]] },

    { id:"speed", g:"training", ev:"coach",
      q:"Why strides and hill sprints all year?",
      short:"Speed is a skill. If you stop practicing it for months, you have to rebuild it from scratch.",
      doing:"Strides two or three times a week, and short hill sprints once a week once you have a base. They come after easy runs, with full recovery between each.",
      why:"Short, fast, relaxed running trains the nervous system and the fast-twitch fibers that easy miles never reach, and it improves how you move. Done with full rest, it doesn't make you tired.",
      more:[
        "The hill sprints are 8 seconds up a steep hill, starting with four or five and building by about one a week toward eight to ten, with at least two minutes of walking recovery. They go uphill first because it's very hard to get hurt sprinting up a hill."
      ],
      voice:["Steve Magness", "This is the heart of his approach: never leave anything behind. A base isn't only aerobic; it also has to be built in the nervous system, in your mechanics, and in your tissues. He has high school runners start short hill sprints during the base period, once a week, and argues that sprinting is the most specific strength work a distance runner can do. Jay Johnson puts it as building the aerobic engine, strengthening the chassis, and revving the engine with strides."],
      src:[
        ["Magness S. Base training is NOT just easy running. Science of Running, 2010.", "https://www.scienceofrunning.com/2010/01/base-training-is-not-just-easy-running.html"],
        ["Magness S. HS training: summer cross country training. Science of Running, 2008.", "https://www.scienceofrunning.com/getting-ready-for-bostonhs-summer/"],
        ["Johnson J. Strides for cross country.", "https://www.coachjayjohnson.com/blog/strides-cross-country"]
      ],
      used:[["Summer weekly rhythm","summer.html#rhythm"],["Winter plan","winter.html#build"]] },

    { id:"seasons", g:"training", ev:"coach",
      q:"How do the seasons fit together?",
      short:"Training moves from general to specific. The off-season builds broad fitness; the season sharpens it into racing a 5K.",
      doing:"Winter and summer are mostly easy miles, strides, hill sprints and strength. As the season gets close, workouts gradually look more and more like the race.",
      why:"You can't sharpen something that hasn't been built. A wide base of endurance and speed gives the race-specific work something to stand on.",
      more:[
        "There are no sudden switches. A little bit of everything is present all year; what changes is the emphasis. In summer a fartlek might be a few 30-second pickups. By October the same idea has grown into repeat 1000s at race pace.",
        "Spring fits the same way. Track season sharpens speed, and for runners not on the track team it's a stretch to keep the winter habits going before summer mileage begins."
      ],
      voice:["Steve Magness", "He calls this funnel periodization: build endurance and speed at the two extremes, then bring both toward race pace, moving from general to specific with no abrupt changes. He plans backward from the final race-specific workout. Arthur Lydiard's version, from the 1960s, is that aerobic training is the training for all other training."],
      src:[
        ["Magness S. Interview with Mladen Jovanovic. Complementary Training, 2013.", "http://complementarytraining.com/interview-with-steve-magness/"],
        ["Magness S. CC training: specific endurance development. Science of Running, 2008.", "https://www.scienceofrunning.com/2008/10/hs-trainingspecific-endurance.html"],
        ["Lydiard Foundation. The Lydiard training principles.", "https://www.lydiardfoundation.org/about"]
      ],
      used:[["The year","index.html#year"]] },

    { id:"cutback", g:"training", ev:"coach",
      q:"Why do some weeks get easier on purpose?",
      short:"Training is the stress. The fitness shows up during the recovery.",
      doing:"Every few weeks, mileage drops on purpose. Those weeks are part of the plan, and we don't add to them.",
      why:"Your heart and lungs adapt in weeks. Bones, tendons and connective tissue take much longer. Planned lighter weeks let the slow tissues catch up with the fast ones.",
      more:[
        "Feeling good is not the same as being ready for more. The runners who get hurt in October are very often the ones who felt great in July and skipped the easy weeks."
      ],
      voice:["Steve Magness and Brad Stulberg", "Their book Peak Performance boils this down to an equation: stress plus rest equals growth. Too much stress without rest leads to injury and burnout; too little stress leads to a plateau. Our cut-back weeks are how we apply that idea. Jay Johnson makes the tissue point directly: metabolic changes happen faster than structural ones."],
      src:[
        ["Stulberg B, Magness S. Peak Performance. Rodale, 2017.", "https://www.penguinrandomhouse.ca/books/593398/peak-performance-by-brad-stulberg-and-steve-magness/9781623367930/excerpt"],
        ["Johnson J. A comprehensive cross country training plan.", "https://www.coachjayjohnson.com/blog/a-comprehensive-cross-country-training-plan"]
      ],
      used:[["Summer cut-back weeks","summer.html#pick"],["Winter lighter weeks","winter.html#build"]] },

    { id:"build", g:"training", ev:"good",
      q:"Why does mileage go up so slowly, and why don't we make up missed days?",
      short:"Injuries follow big jumps in how much you're doing compared with what your body is used to.",
      doing:"Weekly mileage climbs in small steps. If you miss days, you pick up where you are. If you miss a week or more, you go back to the last week you finished.",
      why:"Cramming a lost week into three days is exactly the kind of sudden jump that gets runners hurt.",
      more:[
        "Here's the honest version of the evidence. The popular 10% rule has never been proven, and the acute-to-chronic workload ratio that some teams track has been seriously challenged by researchers. What does hold up is the general principle. In a study of 874 new runners, those who increased their weekly distance by more than 30% over two weeks had more injuries, though the difference fell just short of statistical significance.",
        "So we don't follow a formula. We build gradually, avoid big jumps, and treat a long, steady build as protective in itself."
      ],
      src:[
        ["Nielsen RO, et al. Excessive progression in weekly running distance and risk of running-related injuries. J Orthop Sports Phys Ther. 2014.", PM + "25155475/"],
        ["Gabbett TJ. The training-injury prevention paradox. Br J Sports Med. 2016.", PM + "26758673/"],
        ["Impellizzeri FM, et al. Acute:chronic workload ratio: conceptual issues and fundamental pitfalls. Int J Sports Physiol Perform. 2020.", PM + "32502973/"]
      ],
      used:[["Missed days","summer.html#faq"],["Missed a week","winter.html#faq"]] },

    { id:"hard", g:"training", ev:"coach",
      q:"Why only one hard workout a week in the off-season?",
      short:"Because the goal of the off-season is to build, and you can't build if you're always recovering.",
      doing:"One quality run a week in summer and winter: a fartlek, a progression run, a tempo or a steady run. Never on a long-run day.",
      why:"A little faster running keeps the high end of your aerobic system working. More than that in the off-season adds fatigue without adding much fitness.",
      more:[
        "These sessions start small and grow. A progression run might begin as five to ten quicker minutes at the end of an easy run. Tempo work starts around ten minutes and builds toward twenty to twenty-five, often broken into pieces. All of it is run by feel: if your breathing tips over the edge, you back off."
      ],
      voice:["Steve Magness", "For high school runners he favors a stretch of just mileage and strides early in the summer, both for general fitness and as a mental break from structure, then adds faster work in small steps: surges inside easy runs, short progressions, and threshold running that he usually caps around 25 minutes, split up."],
      src:[
        ["Magness S. HS training: summer cross country training. Science of Running, 2008.", "https://www.scienceofrunning.com/getting-ready-for-bostonhs-summer/"],
        ["Magness S. Not hard, not easy: the in-between training day. Science of Running, 2019.", "https://www.scienceofrunning.com/2019/07/not-hard-not-easy-the-in-between-training-day.html"]
      ],
      used:[["Summer quality run","summer.html#rhythm"],["Winter workouts","winter.html#faq"]] },

    /* ------------------------------ BODY ------------------------------ */
    { id:"strength", g:"body", ev:"strong",
      q:"Why do runners lift?",
      short:"Strength training is the best-supported injury prevention there is, and it makes each stride cost less energy.",
      doing:"Strength work twice a week, all year. Technique first, weight second.",
      why:"Running is thousands of single-leg landings. Stronger muscles and tendons absorb and return that force instead of passing it on to bone.",
      more:[
        "<strong>Injury:</strong> a review of 25 trials and more than 26,000 athletes found that strength training cut sports injuries to less than a third. Exercise programs overall nearly halved overuse injuries. A follow-up found that more strength work kept bringing more protection.",
        "<strong>Performance:</strong> a review of 24 studies in distance runners found that adding strength training improved running economy by 2 to 8% in most studies, and tended to improve time-trial results too, without adding body mass.",
        "<strong>Safety:</strong> the international consensus on youth resistance training is that it's safe and beneficial for children and teenagers when it's well coached and technique comes first."
      ],
      voice:["Steve Magness", "He keeps strength work secondary to the running, warns against trying to imitate running in the weight room, and puts sprinting and simple plyometrics at the center, because they prepare the legs for the fast loading and unloading that running demands."],
      src:[
        ["Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries. Br J Sports Med. 2014.", PM + "24100287/"],
        ["Lauersen JB, Andersen TE, Andersen LB. Strength training as superior, dose-dependent and safe prevention of acute and overuse sports injuries. Br J Sports Med. 2018.", PM + "30131332/"],
        ["Blagrove RC, Howatson G, Hayes PR. Effects of strength training on the physiological determinants of middle- and long-distance running performance. Sports Med. 2018.", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5889786/"],
        ["Lloyd RS, et al. Position statement on youth resistance training: the 2014 International Consensus. Br J Sports Med. 2014.", PM + "24055781/"]
      ],
      used:[["Strength routine","winter.html#strength"],["Summer weekly rhythm","summer.html#rhythm"]] },

    { id:"stretch", g:"body", ev:"strong",
      q:"Why a dynamic warm-up instead of static stretching?",
      short:"Stretching hasn't been shown to prevent injuries. Moving through a warm-up prepares you to run.",
      doing:"Leg swings, lunges and skips before every run, and ten minutes of core and mobility work after three runs a week.",
      why:"A dynamic warm-up raises muscle temperature and takes your joints through the ranges you're about to use.",
      more:[
        "In the same review that found strength training so protective, stretching programs showed no significant effect on injury risk at all. That doesn't make stretching bad. Stretch after a run if it feels good. Just don't count on it to keep you healthy."
      ],
      voice:["Jay Johnson", "He has high school runners do strength and mobility work right after every run, and uses a lunge matrix and leg swings to get the body moving in all three planes before running. It takes about five minutes."],
      src:[
        ["Lauersen JB, Bertelsen DM, Andersen LB. The effectiveness of exercise interventions to prevent sports injuries. Br J Sports Med. 2014.", PM + "24100287/"],
        ["Johnson J. A better pre-run warm-up. Active.com.", "https://www.active.com/running/articles/a-better-pre-run-warm-up-5-moves-in-20-minutes"]
      ],
      used:[["Summer questions","summer.html#faq"]] },

    { id:"multisport", g:"body", ev:"good",
      q:"Why is playing another sport good for a runner?",
      short:"Jumping and cutting build bone that running alone doesn't, and specializing early is linked with more injuries.",
      doing:"We encourage winter and spring sports. During another sport's season, that sport is your training.",
      why:"Bone responds most to high-impact, change-of-direction loading during the teenage years, when most of the adult skeleton is built.",
      more:[
        "Among elite distance runners, those who had played ball sports like basketball and soccer growing up had almost half the rate of stress fractures later. In a study that followed 748 high school runners, having played basketball was protective for boys.",
        "On the other side, a study of nearly 1,200 young athletes found that those who specialized in one sport were more likely to have serious overuse injuries, regardless of age or hours trained. The American Academy of Pediatrics recommends at least three months a year away from your main sport, in one-month blocks, and one to two days off a week.",
        "These are links seen in groups of athletes, not guarantees for any one person."
      ],
      voice:["Steve Magness", "He points to research on thousands of athletes showing that world-class performers tended to play more sports as kids, start their main sport later, and improve more slowly early on. Early results mostly measure training age and opportunity, not talent."],
      src:[
        ["Fredericson M, Ngo J, Cobb K. Effects of ball sports on future risk of stress fracture in runners. Clin J Sport Med. 2005.", PM + "15867555/"],
        ["Tenforde AS, et al. Identifying sex-specific risk factors for stress fractures in adolescent runners. Med Sci Sports Exerc. 2013.", PM + "23584402/"],
        ["Jayanthi NA, et al. Sports-specialized intensive training and the risk of injury in young athletes. Am J Sports Med. 2015.", PM + "25646361/"],
        ["Brenner JS; AAP Council on Sports Medicine and Fitness. Sports specialization and intensive training in young athletes. Pediatrics. 2016.", PM + "27573090/"],
        ["Magness S. Let kids be kids: the science behind Norway's dominance in sport. 2026.", "https://www.stevemagness.org/p/let-kids-be-kids-the-science-behind"]
      ],
      used:[["Winter sport athletes","winter.html#faq"]] },

    { id:"heat", g:"body", ev:"strong",
      q:"Why do we train in the heat instead of avoiding it?",
      short:"Your body adapts to heat within one to two weeks, and September meets can be hot.",
      doing:"In summer we run easy days in the heat by effort, and keep the longest and hardest runs for the morning.",
      why:"Repeated heat exposure expands blood plasma, starts you sweating sooner, and lowers your heart rate at a given pace.",
      more:[
        "The international consensus is that most of the adaptation arrives within the first week, the heart and sweating changes are nearly complete in six to ten days, and it takes about two weeks to get the full performance benefit. It's kept for two to four weeks.",
        "The limit matters just as much. Chills, goosebumps, headache, confusion, nausea, or suddenly not sweating are signs of heat illness. Stop, get cool, and tell someone immediately."
      ],
      src:[
        ["Racinais S, et al. Consensus recommendations on training and competing in the heat. Br J Sports Med. 2015.", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4602249/"],
        ["Periard JD, Racinais S, Sawka MN. Adaptations and mechanisms of human heat acclimation. Scand J Med Sci Sports. 2015.", PM + "25943654/"]
      ],
      used:[["Summer heat","summer.html#faq"]] },

    { id:"cold", g:"body", ev:"strong",
      q:"How cold is too cold?",
      short:"With the right clothes, most winter days are fine. The real risks are frostbite on bare skin and getting wet.",
      doing:"Layers, no cotton, mittens. Below zero wind chill, cover all skin and shorten the run or move inside. Below about -18°F wind chill, we train indoors.",
      why:"The American College of Sports Medicine sets -18°F wind chill as the point for heightened caution, and the National Weather Service chart shows exposed skin can freeze in about 30 minutes around there.",
      more:[
        "A treadmill is a complete substitute. A 1% incline best matches the energy cost of running outside at faster paces; at easy paces the difference is too small to matter."
      ],
      src:[
        ["Castellani JW, et al. ACSM position stand: prevention of cold injuries during exercise. Med Sci Sports Exerc. 2006.", PM + "17095937/"],
        ["National Weather Service. Wind chill chart.", "https://www.weather.gov/safety/cold-wind-chill-chart"],
        ["Jones AM, Doust JH. A 1% treadmill grade most accurately reflects the energetic cost of outdoor running. J Sports Sci. 1996.", PM + "8887211/"]
      ],
      used:[["Winter questions","winter.html#faq"]] },

    { id:"shoes", g:"body", ev:"good",
      q:"Do shoes matter? Should I have two pairs?",
      short:"Pick by comfort, replace them when they feel flat, and rotating two pairs is linked with fewer injuries.",
      doing:"One pair of real running shoes fitted at a running store, and a second pair to rotate if you can.",
      why:"Slightly different shoes spread the stress across slightly different tissues.",
      more:[
        "In a study that followed 264 recreational runners for 22 weeks, those who rotated more than one pair of shoes had about 39% lower injury risk. In the same study, spending more time each week on other sports was protective as well. It was an observational study of adults, so treat it as a good hint rather than proof."
      ],
      src:[
        ["Malisoux L, et al. Can parallel use of different running shoes decrease running-related injury risk? Scand J Med Sci Sports. 2015.", PM + "24286345/"]
      ],
      used:[["Summer questions","summer.html#faq"]] },

    /* ------------------------------ RECOVERY ------------------------------ */
    { id:"sleep", g:"recovery", ev:"good",
      q:"Why does sleep matter so much?",
      short:"Teenagers need 8 to 10 hours, and athletes who get less are hurt more often.",
      doing:"We ask for eight to ten hours a night, and we treat a bad sleep week as a reason to keep the running easy.",
      why:"Sleep is when growth hormone is released, muscle is repaired, and what you practiced gets locked in.",
      more:[
        "The American Academy of Sleep Medicine's consensus is that 13- to 18-year-olds should sleep 8 to 10 hours a night. In a study of middle and high school athletes, those sleeping less than 8 hours were 1.7 times more likely to have been injured. It was one school and 112 athletes, so it shows a link, but it's a striking one.",
        "On the upside, when Stanford basketball players extended their sleep toward ten hours, their sprint times and shooting accuracy both improved. That was a small study with no comparison group, but it points the same direction."
      ],
      src:[
        ["Paruthi S, et al. Recommended amount of sleep for pediatric populations: a consensus statement of the American Academy of Sleep Medicine. J Clin Sleep Med. 2016.", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4877308/"],
        ["Milewski MD, et al. Chronic lack of sleep is associated with increased sports injuries in adolescent athletes. J Pediatr Orthop. 2014.", PM + "25028798/"],
        ["Mah CD, et al. The effects of sleep extension on the athletic performance of collegiate basketball players. Sleep. 2011.", PM + "21731144/"]
      ],
      used:[["Summer questions","summer.html#faq"],["Race week","fall.html#raceday"]] },

    { id:"break", g:"recovery", ev:"good",
      q:"Why take time off after the season?",
      short:"A real break lets your body finish repairing and gives your head a rest from structure.",
      doing:"One to two weeks with no planned running after the last race. Stay active if you want to. Then rebuild gradually.",
      why:"You lose a little fitness quickly, and you get it back quickly. What a break protects is harder to rebuild: healthy bones and tendons, and wanting to run.",
      more:[
        "Research on detraining shows aerobic fitness and blood volume do drop within a few weeks in highly trained athletes, with smaller changes in people who are newer to training. That's the cost. The American Academy of Pediatrics weighs it against injury and burnout and recommends that young athletes spend at least three months a year away from their main sport, in one-month blocks, while staying active in other ways."
      ],
      voice:["Steve Magness", "He usually has athletes take about a week off, or a week of doing whatever they like, and longer for some. He's candid that it's a balance between losing fitness and refreshing the mind, and that the mental side is the main reason. Our two weeks sit at the cautious end of that, on purpose, because our athletes are still growing."],
      src:[
        ["Mujika I, Padilla S. Detraining: loss of training-induced physiological and performance adaptations. Part I. Sports Med. 2000.", PM + "10966148/"],
        ["Brenner JS; AAP Council on Sports Medicine and Fitness. Sports specialization and intensive training in young athletes. Pediatrics. 2016.", PM + "27573090/"],
        ["Magness S. What happens when we take a break from running? Science of Running, 2014.", "https://www.scienceofrunning.com/2014/08/what-happens-when-we-take-break-from.html"]
      ],
      used:[["Winter recharge weeks","winter.html#idea"]] },

    /* ------------------------------ FUEL ------------------------------ */
    { id:"fuel", g:"fuel", ev:"strong",
      q:"Why does “eat enough” come before everything else?",
      short:"Under-fueling harms bones, hormones, immunity, mood and performance together. Fueled is faster.",
      doing:"We never talk about weight. We talk about eating enough, often enough, to cover growing and training.",
      why:"When an athlete takes in less energy than they use for weeks at a time, the body starts shutting systems down to cope.",
      more:[
        "The International Olympic Committee calls this Relative Energy Deficiency in Sport, or REDs. It affects boys as well as girls. In teenagers the bone effects can be lasting, because these are the years when most of the adult skeleton is built. In a study that followed high school runners, a low body mass index and late or missing periods were among the risk factors for stress fractures in girls.",
        "Warning signs: missed or irregular periods, being tired or cold all the time, repeated injuries or illnesses, and running that gets worse despite training. Those are reasons to talk to a doctor, not signs of weakness."
      ],
      src:[
        ["Mountjoy M, et al. 2023 International Olympic Committee's consensus statement on Relative Energy Deficiency in Sport (REDs). Br J Sports Med. 2023.", PM + "37752011/"],
        ["Tenforde AS, et al. Identifying sex-specific risk factors for stress fractures in adolescent runners. Med Sci Sports Exerc. 2013.", PM + "23584402/"],
        ["Desbrow B, et al. Sports Dietitians Australia position statement: sports nutrition for the adolescent athlete. Int J Sport Nutr Exerc Metab. 2014.", PM + "24668620/"]
      ],
      used:[["Winter nutrition","winter.html#fuel"],["Summer questions","summer.html#faq"]] },

    { id:"plate", g:"fuel", ev:"strong",
      q:"What should my plate look like?",
      short:"The harder the day, the more of your plate is carbohydrate. Protein every time.",
      doing:"Easy day: half fruits and vegetables. Hard day or long run: half grains and starches. Protein and some fat on every plate.",
      why:"Carbohydrate is the main fuel for running. Protein spread through the day repairs muscle. Real food supplies the vitamins and minerals along with them.",
      more:[
        "The plate model was created by U.S. Olympic Committee sport dietitians with the University of Colorado's sport nutrition program, and has been tested against sports nutrition guidelines. The joint position of the American College of Sports Medicine and dietitians' associations is the same idea in more detail: match carbohydrate to the day's training.",
        "Around training: a carbohydrate snack 30 to 60 minutes before, and carbohydrate plus protein within about an hour after."
      ],
      src:[
        ["Reguant-Closa A, et al. Validation of the Athlete's Plate nutrition educational tool. Int J Sport Nutr Exerc Metab. 2019.", PM + "31141408/"],
        ["Thomas DT, Erdman KA, Burke LM. ACSM joint position statement: nutrition and athletic performance. Med Sci Sports Exerc. 2016.", PM + "26891166/"],
        ["Desbrow B, et al. Sports nutrition for the adolescent athlete. Int J Sport Nutr Exerc Metab. 2014.", PM + "24668620/"]
      ],
      used:[["Winter plates","winter.html#fuel"],["Race morning","fall.html#raceday"]] },

    { id:"iron", g:"fuel", ev:"strong",
      q:"Why do coaches keep bringing up iron, calcium and vitamin D?",
      short:"Iron carries oxygen. Calcium and vitamin D build bone. Runners, and girls especially, often run short.",
      doing:"Iron-rich foods most days, about four servings of dairy or fortified alternatives, and a conversation with your doctor if you're tired all the time.",
      why:"Low iron means less oxygen delivered to working muscles, which feels like easy runs suddenly becoming hard.",
      more:[
        "Reviews find iron deficiency in roughly 15 to 35% of female athletes and 5 to 11% of male athletes, most often in endurance sports. It's diagnosed with a blood test that includes ferritin. Never take iron pills on your own; too much is harmful.",
        "Teenagers need about 1,300 mg of calcium and 600 IU of vitamin D a day. And in a Wisconsin winter, food has to supply the vitamin D: a classic study found that skin exposed to sunlight in Boston made none from November through February. Little Chute is farther north than Boston."
      ],
      src:[
        ["Sim M, et al. Iron considerations for the athlete: a narrative review. Eur J Appl Physiol. 2019.", PM + "31055680/"],
        ["Webb AR, Kline L, Holick MF. Influence of season and latitude on the cutaneous synthesis of vitamin D3. J Clin Endocrinol Metab. 1988.", PM + "2839537/"],
        ["NIH Office of Dietary Supplements. Calcium fact sheet.", "https://ods.od.nih.gov/factsheets/Calcium-HealthProfessional/"],
        ["NIH Office of Dietary Supplements. Vitamin D fact sheet.", "https://ods.od.nih.gov/factsheets/VitaminD-HealthProfessional/"]
      ],
      used:[["Winter nutrition","winter.html#fuel"]] },

    { id:"supps", g:"fuel", ev:"strong",
      q:"What about energy drinks and supplements?",
      short:"Skip them. Food does the job, and energy drinks aren't for teenagers.",
      doing:"No energy drinks, no pre-workout, no supplements unless a doctor recommends one for you after a blood test.",
      why:"Nothing in a canister beats sleep, enough food, and consistent training, and supplements aren't tested for what's really in them.",
      more:[
        "The American Academy of Pediatrics states plainly that the caffeine and other stimulants in energy drinks have no place in the diet of children and adolescents. Sports dietitians who work with teenage athletes say nutrient needs should be met by regular foods rather than supplements.",
        "Sports drinks are a different thing. For ordinary runs, water is enough. On long or hot runs, a drink with carbohydrate and sodium can help."
      ],
      src:[
        ["AAP Committee on Nutrition and Council on Sports Medicine and Fitness. Sports drinks and energy drinks for children and adolescents: are they appropriate? Pediatrics. 2011.", PM + "21624882/"],
        ["Desbrow B, et al. Sports nutrition for the adolescent athlete. Int J Sport Nutr Exerc Metab. 2014.", PM + "24668620/"]
      ],
      used:[["Winter nutrition","winter.html#fuel"]] },

    /* ------------------------------ MIND ------------------------------ */
    { id:"tough", g:"mind", ev:"coach",
      q:"What does “tough” actually mean?",
      short:"Not gritting your teeth and ignoring pain. Real toughness is staying clear-headed and making a good choice when it gets hard.",
      doing:"We talk honestly about how races feel. We practice noticing discomfort and responding to it, instead of pretending it isn't there.",
      why:"Every 5K hurts in the middle. The runners who handle it best aren't the ones who feel less; they're the ones who expect it and have a plan.",
      more:[
        "This changes how we coach, too. Yelling and fear make athletes act tough for a while and perform worse over time. Giving athletes real choices and honest information makes them tougher."
      ],
      voice:["Steve Magness", "His book Do Hard Things is built on four ideas: drop the act and be honest about what you're facing; listen to your body; respond instead of reacting; and find meaning that carries you through discomfort. He argues that acting tough and being tough are different things, and that toughness grows when people have a choice and feel they can make a difference."],
      src:[
        ["Magness S. Do Hard Things. HarperOne, 2022.", "https://www.stevemagness.com/do-hard-things/"],
        ["Magness S. Why we get resilience wrong. Next Big Idea Club, 2022.", "https://nextbigideaclub.com/magazine/hard-things-get-resilience-wrong-surprising-science-real-toughness-bookbite/35029/"]
      ],
      used:[["The race","fall.html#raceday"]] },

    { id:"together", g:"mind", ev:"good",
      q:"Why train with teammates?",
      short:"People keep going longer when someone is counting on them, and tight teams perform better.",
      doing:"We encourage shared long runs, lifting partners, and checking in with each other when you can't meet up.",
      why:"Knowing a teammate is waiting gets you out the door on the days you'd otherwise skip, and in this sport the days you don't skip are everything.",
      more:[
        "In one experiment, people exercising with a partner lasted about twice as long as people exercising alone, and longest of all when the team's result depended on them. That study used college-age women on stationary bikes with a virtual partner, so it isn't a study of runners, but the effect was large.",
        "Cross country rewards this more than most sports. Five runners score, so a team that trains and races as a pack beats a team with one star. A review of 46 studies found a meaningful link between how united a team is and how well it performs."
      ],
      src:[
        ["Irwin BC, et al. Aerobic exercise is promoted when individual performance affects the group. Ann Behav Med. 2012.", PM + "22576339/"],
        ["Carron AV, et al. Cohesion and performance in sport: a meta-analysis. J Sport Exerc Psychol. 2002.", "https://doi.org/10.1123/jsep.24.2.168"]
      ],
      used:[["Winter teammates","winter.html#together"],["How scoring works","fall.html#parents"]] },

    { id:"raceday", g:"mind", ev:"coach",
      q:"Why the same race-day routine every time?",
      short:"A routine takes decisions off your plate, so your energy goes into the race.",
      doing:"Same meal timing, same warm-up, same start plan at every meet.",
      why:"A warm-up with easy running, drills and strides raises muscle temperature and gets your nervous system ready to run fast from the gun. Eating three to four hours before leaves time to digest and tops up your fuel.",
      more:[
        "The race plan is get out, settle, then compete. Starting much faster than you can sustain feels fine for a minute and costs far more than it gained by the second mile. Running by effort in training is what teaches you where that line is."
      ],
      voice:["Steve Magness", "He points to research showing that goals about the process, the things you control, improve performance far more than goals about the outcome. That's why our race plans are about effort and position, not about a time or a place."],
      src:[
        ["Thomas DT, Erdman KA, Burke LM. ACSM joint position statement: nutrition and athletic performance. Med Sci Sports Exerc. 2016.", PM + "26891166/"],
        ["Magness S. Let kids be kids. 2026.", "https://www.stevemagness.org/p/let-kids-be-kids-the-science-behind"]
      ],
      used:[["Race day","fall.html#raceday"]] },

    { id:"young", g:"mind", ev:"strong",
      q:"Why are we patient with young runners?",
      short:"Because the goal is a runner who is still improving, healthy, and still loves it at eighteen and beyond.",
      doing:"Freshmen run less than seniors. Mileage grows year over year, not month over month. Nobody is pushed to train like someone older.",
      why:"Kids develop at very different rates, and early results say more about who matured first than about who will be good.",
      more:[
        "The International Olympic Committee's consensus on youth athletes says the aim should be healthy, capable, resilient young people, with variety and enjoyment, and warns against judging talent early. That is exactly how we want to run this program."
      ],
      voice:["Steve Magness", "He describes his goal for high school runners as kids who run well and stay runners for life. A first-year runner might spend an entire summer on mileage and strides alone, and race-specific work only fills the last couple of months before the key races."],
      src:[
        ["Bergeron MF, et al. International Olympic Committee consensus statement on youth athletic development. Br J Sports Med. 2015.", PM + "26084524/"],
        ["Magness S. HS training: summer cross country training. Science of Running, 2008.", "https://www.scienceofrunning.com/getting-ready-for-bostonhs-summer/"]
      ],
      used:[["Pick your club","summer.html#pick"],["Winter levels","winter.html#build"]] }
    ],

    books: [
      { by:"Steve Magness", title:"The Science of Running", note:"The training bible behind much of what we do: how the body adapts, and how to build a season from general to specific." },
      { by:"Brad Stulberg and Steve Magness", title:"Peak Performance", note:"Stress plus rest equals growth. Useful for school and life as much as running." },
      { by:"Steve Magness", title:"Do Hard Things", note:"What real toughness is, and why the old yell-and-grind version doesn't work." },
      { by:"Jack Daniels", title:"Daniels' Running Formula", note:"The classic on training paces and why each type of run exists." },
      { by:"Jay Johnson", title:"Consistency Is Key", note:"Written for high school runners: fifteen ways to stay healthy and keep improving." }
    ]
  };
})();
