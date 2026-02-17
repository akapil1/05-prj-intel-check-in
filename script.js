// ===============================
// INTEL SUSTAINABILITY SUMMIT
// Check-In App Logic
// ===============================

// Attendance goal
const ATTENDANCE_GOAL = 50;

// DOM Elements
const form = document.getElementById("checkInForm");
const nameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");

const attendeeCountDisplay = document.getElementById("attendeeCount");
const waterCountDisplay = document.getElementById("waterCount");
const zeroCountDisplay = document.getElementById("zeroCount");
const powerCountDisplay = document.getElementById("powerCount");
const progressBar = document.getElementById("progressBar");

// ===============================
// STATE VARIABLES
// ===============================
let totalAttendees = 0;
let teamCounts = {
  water: 0,
  zero: 0,
  power: 0
};

let attendees = [];

// ===============================
// LOAD FROM LOCAL STORAGE
// ===============================
function loadFromStorage() {
  const storedTotal = localStorage.getItem("totalAttendees");
  const storedTeams = localStorage.getItem("teamCounts");
  const storedAttendees = localStorage.getItem("attendeeList");

  if (storedTotal) totalAttendees = JSON.parse(storedTotal);
  if (storedTeams) teamCounts = JSON.parse(storedTeams);
  if (storedAttendees) attendees = JSON.parse(storedAttendees);

  updateUI();
  renderAttendeeList();
}

// ===============================
// SAVE TO LOCAL STORAGE
// ===============================
function saveToStorage() {
  localStorage.setItem("totalAttendees", JSON.stringify(totalAttendees));
  localStorage.setItem("teamCounts", JSON.stringify(teamCounts));
  localStorage.setItem("attendeeList", JSON.stringify(attendees));
}

// ===============================
// UPDATE UI
// ===============================
function updateUI() {
  attendeeCountDisplay.textContent = totalAttendees;
  waterCountDisplay.textContent = teamCounts.water;
  zeroCountDisplay.textContent = teamCounts.zero;
  powerCountDisplay.textContent = teamCounts.power;

  // Update progress bar
  const progressPercent = (totalAttendees / ATTENDANCE_GOAL) * 100;
  progressBar.style.width = `${Math.min(progressPercent, 100)}%`;

  // Celebration when goal reached
  if (totalAttendees >= ATTENDANCE_GOAL) {
    const winningTeam = getWinningTeam();
    greeting.textContent = `🎉 Goal reached! Congratulations ${winningTeam}!`;
    greeting.classList.add("success-message");
    greeting.style.display = "block";
  }
}

// ===============================
// DETERMINE WINNING TEAM
// ===============================
function getWinningTeam() {
  let maxTeam = "Team Water Wise";
  let maxCount = teamCounts.water;

  if (teamCounts.zero > maxCount) {
    maxTeam = "Team Net Zero";
    maxCount = teamCounts.zero;
  }

  if (teamCounts.power > maxCount) {
    maxTeam = "Team Renewables";
  }

  return maxTeam;
}

// ===============================
// RENDER ATTENDEE LIST
// ===============================
function renderAttendeeList() {
  let listContainer = document.getElementById("attendeeList");

  if (!listContainer) {
    listContainer = document.createElement("div");
    listContainer.id = "attendeeList";
    listContainer.style.marginTop = "25px";
    document.querySelector(".team-stats").appendChild(listContainer);
  }

  listContainer.innerHTML = "<h4 style='margin-bottom:10px;'>Checked-In Attendees</h4>";

  attendees.forEach(attendee => {
    const entry = document.createElement("p");
    entry.style.fontSize = "14px";
    entry.style.color = "#475569";

    let teamName = "";
    if (attendee.team === "water") teamName = "🌊 Team Water Wise";
    if (attendee.team === "zero") teamName = "🌿 Team Net Zero";
    if (attendee.team === "power") teamName = "⚡ Team Renewables";

    entry.textContent = `${attendee.name} — ${teamName}`;
    listContainer.appendChild(entry);
  });
}

// ===============================
// CHECK-IN EVENT
// ===============================
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const team = teamSelect.value;

  if (!name || !team) return;

  // Update totals
  totalAttendees++;
  teamCounts[team]++;

  // Save attendee
  attendees.push({ name, team });

  // Greeting message
  greeting.textContent = `Welcome, ${name}! You're checked in for ${
    team === "water"
      ? "🌊 Team Water Wise"
      : team === "zero"
      ? "🌿 Team Net Zero"
      : "⚡ Team Renewables"
  }.`;
  greeting.classList.add("success-message");
  greeting.style.display = "block";

  updateUI();
  renderAttendeeList();
  saveToStorage();

  // Reset form
  form.reset();
});

// ===============================
// INITIAL LOAD
// ===============================
loadFromStorage();
