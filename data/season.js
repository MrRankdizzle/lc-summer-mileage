/* SEASON — everything on the Fall Season page comes from this one file.
   Change something here, and the page (and the "next up" card on the home page) updates.

   Dates are always written "YYYY-MM-DD". Anything you leave out is simply not shown.
   A section with nothing in it shows a friendly "coming soon" note instead. */
window.SEASON = {

  year: 2027,

  /* One line under the big title on the Fall Season page. */
  tagline: "Everything athletes and families need for the season, in one place.",

  /* First official practice. Drives the countdown before the season starts. */
  firstPractice: "",            // e.g. "2027-08-16"

  /* Regular practice details, shown near the top. */
  practice: {
    when: "",                   // e.g. "Monday to Friday, 3:30 to 5:15 pm"
    where: "",                  // e.g. "Meet at the track"
    note: ""                    // e.g. "Saturday long runs at 8:00 am when there is no meet."
  },

  /* Short announcements, newest first.
     { date:"2027-08-10", title:"Parent meeting", body:"Thursday at 6:30 pm in the commons." } */
  announcements: [
  ],

  /* Meets. These also appear on the calendar automatically.
     {
       date:"2027-09-04", name:"Mustang Invitational", host:"Little Chute",
       location:"Doyle Park", address:"100 Van Buren St, Little Chute, WI",
       times:"Girls 9:00 am, Boys 9:40 am", bus:"Leaves 7:15 am, back about 12:30 pm",
       levels:"Varsity and JV", note:"Home meet. Parents needed for the finish chute.",
       resultsUrl:"https://..."
     } */
  meets: [
  ],

  /* Everything else on the calendar. type is one of: practice, team, fundraiser, deadline.
     { date:"2027-08-16", title:"First practice", type:"practice", time:"8:00 am", where:"Track", note:"Bring water and running shoes." }
     { date:"2027-08-20", end:"2027-08-22", title:"Team camp", type:"team" } */
  calendar: [
  ],

  /* Fundraisers. goal and raised are optional; with both, a progress bar is shown.
     { title:"Mustang Mile-a-thon", when:"September 12 to 26", goal:3000, raised:1250,
       body:"Athletes collect pledges per mile. Funds cover meet entries and team gear.", url:"https://..." } */
  fundraising: [
  ],

  /* Coaches and contacts.
     { name:"Coach Name", role:"Head coach", email:"name@school.org", phone:"920-555-0100" } */
  contacts: [
  ],

  /* Forms and handy links.
     { label:"WIAA physical card", note:"Due before the first practice", url:"https://..." } */
  links: [
  ]
};
