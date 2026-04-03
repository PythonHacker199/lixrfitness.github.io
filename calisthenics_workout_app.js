const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const program = [
  {
    day: "Mon",
    label: "Push Power",
    badge: "power",
    badgeLabel: "Power",
    duration: "45-55 min",
    focus: "Chest, shoulders, triceps",
    note: "Explosive push quality matters more than rushing reps. Keep your core tight and stop ugly sets early.",
    exercises: [
      { name: "Skipping rope warm-up", sets: "3 min" },
      { name: "Push-up (standard)", sets: "4 x 12" },
      { name: "Wide push-up", sets: "3 x 10" },
      { name: "Diamond push-up", sets: "3 x 8" },
      { name: "Pike push-up", sets: "3 x 10" },
      { name: "Dips (chair or edge)", sets: "4 x 10" },
      { name: "Skipping rope (fast)", sets: "5 x 1 min" }
    ]
  },
  {
    day: "Tue",
    label: "Pull and Core",
    badge: "strength",
    badgeLabel: "Strength",
    duration: "40-50 min",
    focus: "Back, biceps, trunk",
    note: "If pulling strength is limited, slow the lowering phase and squeeze hard at peak contraction.",
    exercises: [
      { name: "Skipping rope warm-up", sets: "3 min" },
      { name: "Doorframe rows or Australian pull-up", sets: "4 x 10" },
      { name: "Towel curl", sets: "3 x 12" },
      { name: "Plank hold", sets: "4 x 45s" },
      { name: "Hollow body hold", sets: "3 x 30s" },
      { name: "Leg raises", sets: "4 x 12" },
      { name: "Dead bugs", sets: "3 x 10 each" }
    ]
  },
  {
    day: "Wed",
    label: "Legs and Explosive",
    badge: "power",
    badgeLabel: "Power",
    duration: "45-55 min",
    focus: "Quads, glutes, calves",
    note: "Land softly on explosive work. Quality jumps beat sloppy volume.",
    exercises: [
      { name: "Skipping rope warm-up", sets: "3 min" },
      { name: "Squat", sets: "4 x 15" },
      { name: "Bulgarian split squat", sets: "3 x 10 each" },
      { name: "Jump squat", sets: "4 x 10" },
      { name: "Glute bridge", sets: "4 x 15" },
      { name: "Calf raise", sets: "4 x 20" },
      { name: "Skipping rope double-under attempts", sets: "5 x 1 min" }
    ]
  },
  {
    day: "Thu",
    label: "Endurance Circuit",
    badge: "endurance",
    badgeLabel: "Endurance",
    duration: "35-45 min",
    focus: "Conditioning and repeat effort",
    note: "Stay controlled. The goal is sustained output, not reckless pacing in the first round.",
    exercises: [
      { name: "Skipping rope", sets: "10 min steady" },
      { name: "Burpees", sets: "5 x 10" },
      { name: "Mountain climbers", sets: "4 x 30s" },
      { name: "Jump lunges", sets: "4 x 10 each" },
      { name: "Push-up to downward dog", sets: "3 x 10" },
      { name: "Skipping rope intervals", sets: "8 x 30s on / 15s off" }
    ]
  },
  {
    day: "Fri",
    label: "Full Body Strength",
    badge: "strength",
    badgeLabel: "Strength",
    duration: "45-60 min",
    focus: "Integrated full-body control",
    note: "Use strict movement standards. This day should feel like controlled strength, not random fatigue.",
    exercises: [
      { name: "Skipping rope warm-up", sets: "3 min" },
      { name: "Archer push-up", sets: "3 x 8 each" },
      { name: "Pistol squat progression", sets: "3 x 5 each" },
      { name: "Pike push-up", sets: "3 x 10" },
      { name: "L-sit hold", sets: "4 x 15s" },
      { name: "Plank shoulder taps", sets: "3 x 20" },
      { name: "Skipping rope mixed pace", sets: "6 x 1 min" }
    ]
  },
  {
    day: "Sat",
    label: "Cardio and Skills",
    badge: "cardio",
    badgeLabel: "Cardio",
    duration: "35-50 min",
    focus: "Rope engine and skill control",
    note: "Treat this as practice. Skill work should be sharp, patient, and repeatable.",
    exercises: [
      { name: "Skipping rope", sets: "15 min continuous" },
      { name: "Handstand wall hold", sets: "5 x 20s" },
      { name: "Pseudo planche lean", sets: "4 x 20s" },
      { name: "Skin the cat progression", sets: "3 x 5" },
      { name: "Wrist conditioning circles", sets: "3 x 30s" },
      { name: "Cool down stretch", sets: "10 min" }
    ]
  },
  {
    day: "Sun",
    label: "Rest and Recovery",
    rest: true
  }
];

const todayIndex = getProgramIndexForToday();
let currentDay = todayIndex;
let doneDays = readStorage("calisthenics_done_days", []);
let currentWeek = readStorage("calisthenics_week_num", 1);

const tabsEl = document.getElementById("day-tabs");
const contentEl = document.getElementById("workout-content");
const dayDoneEl = document.getElementById("day-done");
const weekNumEl = document.getElementById("week-num");
const streakNumEl = document.getElementById("streak-num");
const aiInput = document.getElementById("ai-input");
const aiResponse = document.getElementById("ai-response");
const askButton = document.getElementById("ask-button");
const jumpTodayButton = document.getElementById("jump-today");

buildTabs();
renderWorkout();
updateProgress();

jumpTodayButton.addEventListener("click", () => switchDay(todayIndex));
askButton.addEventListener("click", askCoach);
aiInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") askCoach();
});

document.querySelectorAll(".quick-prompt").forEach((button) => {
  button.addEventListener("click", () => {
    aiInput.value = button.textContent;
    askCoach();
  });
});

function buildTabs() {
  tabsEl.innerHTML = "";

  program.forEach((day, index) => {
    const button = document.createElement("button");
    button.className = `day-tab${index === currentDay ? " active" : ""}${day.rest ? " rest" : ""}`;
    button.type = "button";
    button.innerHTML = `
      <span class="day-name">${day.day}</span>
      <span class="day-label">${day.rest ? "Recover" : day.label}</span>
    `;
    button.addEventListener("click", () => switchDay(index));
    tabsEl.appendChild(button);
  });
}

function switchDay(index) {
  currentDay = index;
  document.querySelectorAll(".day-tab").forEach((button, buttonIndex) => {
    button.classList.toggle("active", buttonIndex === index);
  });
  renderWorkout();
}

function renderWorkout() {
  const day = program[currentDay];

  if (day.rest) {
    contentEl.innerHTML = `
      <article class="rest-card">
        <div class="rest-icon">Recover</div>
        <h4>Rest Day</h4>
        <p class="rest-subcopy">
          Walk, stretch, hydrate, and sleep. If you feel wrecked, that is not weakness. That is feedback. Recover properly and come back ready.
        </p>
      </article>
    `;
    return;
  }

  const isDone = doneDays.includes(currentDay);

  contentEl.innerHTML = `
    <article class="workout-card">
      <div class="section-label">${daysOfWeek[(currentDay + 1) % 7]} Session</div>
      <div class="workout-header">
        <h4 class="workout-title">${day.label}</h4>
        <span class="badge badge-${day.badge}">${day.badgeLabel}</span>
      </div>
      <div class="meta-row">
        <span class="meta-pill">${day.duration}</span>
        <span class="meta-pill">${day.focus}</span>
      </div>
      <div class="exercise-list">
        ${day.exercises.map((exercise, index) => `
          <div class="exercise-row">
            <div class="ex-num">${index + 1}</div>
            <div class="ex-name">${exercise.name}</div>
            <div class="ex-sets">${exercise.sets}</div>
          </div>
        `).join("")}
      </div>
      <p class="exercise-note">${day.note}</p>
      <div class="action-row">
        <button class="complete-btn ${isDone ? "done" : ""}" id="mark-done-btn" type="button">
          ${isDone ? "Completed" : "Mark Session Done"}
        </button>
        <button class="reset-btn" id="reset-week-btn" type="button">Reset Progress</button>
      </div>
    </article>
  `;

  document.getElementById("mark-done-btn").addEventListener("click", markDone);
  document.getElementById("reset-week-btn").addEventListener("click", resetProgress);
}

function markDone() {
  if (!doneDays.includes(currentDay) && !program[currentDay].rest) {
    doneDays.push(currentDay);
    doneDays.sort((a, b) => a - b);
    writeStorage("calisthenics_done_days", doneDays);
    if (doneDays.filter((day) => !program[day].rest).length === 6) {
      currentWeek += 1;
      writeStorage("calisthenics_week_num", currentWeek);
    }
  }

  updateProgress();
  renderWorkout();
}

function resetProgress() {
  doneDays = [];
  currentWeek = 1;
  writeStorage("calisthenics_done_days", doneDays);
  writeStorage("calisthenics_week_num", currentWeek);
  updateProgress();
  renderWorkout();
}

function updateProgress() {
  const completed = doneDays.filter((day) => !program[day].rest).length;
  const completionRate = Math.round((completed / 6) * 100);

  dayDoneEl.textContent = String(completed);
  weekNumEl.textContent = String(currentWeek);
  streakNumEl.textContent = `${completionRate}%`;
}

function askCoach() {
  const question = aiInput.value.trim();
  if (!question) return;

  const day = program[currentDay];
  aiResponse.textContent = buildCoachReply(question, day);
  aiInput.value = "";
}

function buildCoachReply(question, day) {
  const q = question.toLowerCase();

  if (q.includes("push-up") || q.includes("push up")) {
    return "Use a tighter plank, lower under control, and stop letting your hips sag. If standard reps are weak, do more clean incline or knee push-ups and add a slow three-second lowering phase. Practice push-ups two or three times a week, but leave a rep or two in reserve so you can recover and actually improve.";
  }

  if (q.includes("rest") || q.includes("recover") || q.includes("sore")) {
    return "Rest day is not laziness. Walk, stretch lightly, drink water, and sleep longer. If soreness is high, skip extra ego work and come back fresh because recovery is what lets the next hard session do its job.";
  }

  if (q.includes("rope") || q.includes("skip") || q.includes("warm-up")) {
    return "Start with one minute easy, one minute footwork changes, then one minute faster rhythm. Keep elbows close, wrists relaxed, and jumps low. If you trip often, slow down and own the timing before trying speed.";
  }

  if (q.includes("diet") || q.includes("eat") || q.includes("protein")) {
    return "If you want a stronger physique, eat enough to recover from training. Get protein in each meal, keep hydration high, and stop under-eating if your bodyweight is not moving and your energy stays flat. Training cannot outwork poor recovery and weak nutrition.";
  }

  if (q.includes("pull") || q.includes("row") || q.includes("back")) {
    return "On pulling work, do not yank with loose shoulders. Start by setting the shoulder blades, pull the chest toward the anchor point, and lower slowly. If rows are too easy, pause at the top and extend the lowering phase to make the set honest.";
  }

  if (q.includes("leg") || q.includes("squat") || q.includes("jump")) {
    return "Your leg day should look powerful, not sloppy. Own full squat depth, keep the knee tracking clean, and land softly on jump work. If your reps get noisy or unstable, the set is too hard or you are too tired.";
  }

  if (day.rest) {
    return "Today is a rest day, so stop trying to turn recovery into another hard workout. Use the day to restore energy, mobilize tight areas, and prepare for the next real session.";
  }

  return `Today's focus is ${day.label.toLowerCase()}. Keep your technique strict on ${day.focus.toLowerCase()}, do not rush the early sets, and finish the session with a little left in the tank instead of turning it into random fatigue. If you want better advice, ask about one exercise or one problem at a time.`;
}

function getProgramIndexForToday() {
  const jsDay = new Date().getDay();
  if (jsDay === 0) return 6;
  return jsDay - 1;
}

function readStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
}
