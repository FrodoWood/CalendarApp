const apiUrl = "https://localhost:7271/api/events";
const apiAuthUrl = "https://localhost:7271/api/account";
let token =
  "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyOTc0MGQxNC02NWE4LTRkMjMtYjIyYy0wNDAyNmUzYzQzYzQiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJnaXZlbl9uYW1lIjoidGVzdCIsIm5iZiI6MTcyOTIxNTIxNSwiZXhwIjoxNzI5ODIwMDE1LCJpYXQiOjE3MjkyMTUyMTUsImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0OjcyNzEiLCJhdWQiOiJodHRwczovL2xvY2FsaG9zdDo3MjcxIn0.HSOBfalfa2q-eXLOl3QrSs43Fw92oo2lH-eIryqUL7OZMTdlsjpPk0oOg2Ej6Zzr67a7Q8MRo19RVcAzx1U3Zw";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

let events = [];
let date = new Date();
let month = date.getMonth();
let year = date.getFullYear();

let days = document.querySelector(".days");
let currentDate = document.querySelector(".current-date");
let controlButtons = document.querySelectorAll(".calendar-controls button");
let modal = document.getElementById("staticBackdrop");
let modalInput = document.getElementById("newEventInput");
let allEvents = document.getElementById("all-events");

// create all the days to show
updateDates();
showBoxEvents();

async function fetchEvents() {
  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    data = await response.json();
    return data;
  } catch (error) {
    console.log("Failed to fetch data", error);
  }
}

async function createEvent(event) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(event),
  });

  if (!response.ok) {
    throw new Error("Failed to create new event");
  }

  return await response.json();
}

async function deleteEvent(eventId) {
  const response = await fetch(`${url}/${eventId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete event");
  }
}

function refreshEvents() {
  fetchEvents()
    .then((data) => {
      events = data;
      // Re-render all events in boxes
    })
    .catch((error) => console.log("Caught error", error));
}

async function login(username, password) {
  const response = await fetch(apiAuthUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  const data = await response.json();
  token = data.token;
}

modal.addEventListener("show.bs.modal", (event) => {
  let button = event.relatedTarget;

  let date = button.getAttribute("data-date");
  modal.setAttribute("data-date", date);
  showEvents(date);
  // console.log(date);
  let dateList = date.split("-");
  dateList.reverse();
  date = dateList.join("-");
  let modalTitle = document.getElementById("staticBackdropLabel");
  modalTitle.textContent = `Events on ${date}`;
  // console.log(dateList);
  document.getElementById("newEventInput").focus();
});

modal.addEventListener("shown.bs.modal", (event) => {
  // console.log(dateList);
  document.getElementById("newEventInput").focus();
});

function showBoxEvents() {
  let boxes = document.querySelectorAll(".days li");
  boxes.forEach((box) => {
    key = box.getAttribute("data-date");
    let todayDate = new Date().toISOString().slice(0, 10);
    if (key == todayDate) {
      box.classList.add("outline");
    }
    showEvents(key);
  });
}

function showEvents(key) {
  // Clear modal
  allEvents.innerHTML = "";
  let dayBox = document.querySelector(
    `.days li[data-date='${key}'] .day-box-events`
  );
  // console.log(dayBox);
  // Clear day box in calendar grid
  dayBox.innerHTML = "";

  let storedEvents = localStorage.getItem(key);
  if (storedEvents == null) {
    allEvents.innerHTML = "<h3>No events added.</h3>";
    return;
  }

  storedEvents = JSON.parse(storedEvents);
  // console.log(storedEvents);
  allEvents.innerHTML += "<h4>Your Events<h4?>";

  storedEvents.forEach((event, index) => {
    eventElement = `<div class="card">
                      <div class="row card-body m-0 py-2">
                        <div class="col-10 align-content-center">
                          <p class="m-0">${event}</p>
                        </div>
                        <div class="col-2 p-0 align-content-center">
                          <button onclick="deleteEvent(event)" data-date="${key}" data-event-index="${index}"
                            class="btn btn-outline-danger">Delete</button>
                        </div>
                      </div>
                    </div>`;
    allEvents.innerHTML += eventElement;
    // let dayBox = document.querySelector(`.days li[data-date='${key}']`);
    dayBox.innerHTML += `<p class="day-box-event bg-primary text-light px-1 mb-1">${
      event.length > 40 ? event.slice(0, 40) + "..." : event
    }</p>`;
  });
}

function addEvent() {
  let newEvent = modalInput.value;
  if (newEvent === "") {
    return;
  }
  let key = modal.getAttribute("data-date");
  let storedEvents = localStorage.getItem(key);
  storedEvents = storedEvents ? JSON.parse(storedEvents) : [];
  storedEvents.push(newEvent);
  modalInput.value = "";

  localStorage.setItem(key, JSON.stringify(storedEvents));
  showEvents(key);
}

function deleteEvent(event) {
  button = event.target;
  key = button.getAttribute("data-date");
  eventIndex = button.getAttribute("data-event-index");

  let storedEvents = localStorage.getItem(key);
  storedEvents = storedEvents ? JSON.parse(storedEvents) : [];
  storedEvents.splice(eventIndex, 1);
  if (storedEvents.length == 0) {
    localStorage.removeItem(key);
  } else {
    localStorage.setItem(key, JSON.stringify(storedEvents));
  }

  showEvents(key);
}

controlButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let todayDate = new Date();
    // console.log(todayDate.toISOString().slice(0, 10));

    month = button.id === "next" ? month + 1 : month - 1;
    if (button.id === "today") {
      month = todayDate.getMonth();
      year = todayDate.getFullYear();
    }

    if (month < 0) year--;
    if (month > 11) year++;
    month = ((month % 12) + 12) % 12;
    // console.log(month);
    updateDates();
    showBoxEvents();
  });
});

function updateDates() {
  days.innerHTML = "";
  // week index of month's first day 0=Sunday 6=Saturday
  let weekIndexFirstDayMonth = new Date(year, month, 1).getDay();
  if (weekIndexFirstDayMonth == 0) weekIndexFirstDayMonth = 7;
  // Get number of days in a month 30/31/28/29
  let noDaysInMonth = new Date(year, month + 1, 0).getDate();

  // week index of month's last day
  let weekIndexLastDayMonth = new Date(year, month, noDaysInMonth).getDay();

  // number of days in previous month
  let noDaysPrevMonth = new Date(year, month, 0).getDate();

  let dayBoxes = [];
  let key = "";

  // Last days of previous month
  currentMonth = month - 1;
  currentYear = year;
  if (currentMonth < 0) currentYear--;
  if (currentMonth > 11) currentYear++;
  currentMonth = ((currentMonth % 12) + 12) % 12;

  for (let i = weekIndexFirstDayMonth - 1; i > 0; i--) {
    let dayBox = document.createElement("li");
    dayBox.className = "inactive";
    dayBox.textContent = noDaysPrevMonth - i + 1;
    key = `${currentYear}-${currentMonth + 1}-${noDaysPrevMonth - i + 1}`;
    dayBox.setAttribute("data-date", key);
    dayBox.setAttribute("data-bs-toggle", "modal");
    dayBox.setAttribute("data-bs-target", "#staticBackdrop");

    let dayBoxEvents = document.createElement("div");
    dayBoxEvents.className = "day-box-events";
    dayBox.appendChild(dayBoxEvents);
    dayBoxes.push(dayBox);
  }

  // Days in current month
  currentMonth += 1;
  if (currentMonth < 0) currentYear--;
  if (currentMonth > 11) currentYear++;
  currentMonth = ((currentMonth % 12) + 12) % 12;

  for (let i = 1; i <= noDaysInMonth; i++) {
    let dayBox = document.createElement("li");
    dayBox.textContent = i;
    key = `${currentYear}-${currentMonth + 1}-${i}`;
    dayBox.setAttribute("data-date", key);
    dayBox.setAttribute("data-bs-toggle", "modal");
    dayBox.setAttribute("data-bs-target", "#staticBackdrop");

    let dayBoxEvents = document.createElement("div");
    dayBoxEvents.className = "day-box-events";
    dayBox.appendChild(dayBoxEvents);
    dayBoxes.push(dayBox);
  }

  // First days in next month
  currentMonth += 1;
  if (currentMonth < 0) currentYear--;
  if (currentMonth > 11) currentYear++;
  currentMonth = ((currentMonth % 12) + 12) % 12;

  for (let i = 1; i <= 14 - weekIndexLastDayMonth; i++) {
    let dayBox = document.createElement("li");
    dayBox.textContent = i;
    key = `${currentYear}-${currentMonth + 1}-${i}`;
    dayBox.setAttribute("data-date", key);
    dayBox.setAttribute("data-bs-toggle", "modal");
    dayBox.setAttribute("data-bs-target", "#staticBackdrop");
    dayBox.className = "inactive";

    let dayBoxEvents = document.createElement("div");
    dayBoxEvents.className = "day-box-events";
    dayBox.appendChild(dayBoxEvents);
    dayBoxes.push(dayBox);
  }

  currentDate.textContent = `${months[month]} ${year}`;

  //Render the days
  dayBoxes.forEach((dayBox, index) => {
    if (index > 41) return;

    days.appendChild(dayBox);
  });
}
