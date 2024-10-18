window.onload = function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/auth.html";
    return;
  }
};

const apiUrl = "https://localhost:7271/api/events";
const apiAuthUrl = "https://localhost:7271/api/account";
let token = localStorage.getItem("token");

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

updateDates(); // Creates the grid of dates
refreshEvents(); // Fetches the data and renders the box events and
// showBoxEvents();

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
  const response = await fetch(apiUrl, {
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

async function removeEvent(eventId) {
  const response = await fetch(`${apiUrl}/${eventId}`, {
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
      // console.log(events);
      // Re-render all events in boxes
      showBoxEvents();
      // let storedEvents = events.filter((event) => event.date === "2024-10-17");
      // console.log(storedEvents);
    })
    .catch((error) => console.log("Caught error", error));
}
function refreshEventsData() {
  fetchEvents()
    .then((data) => {
      events = data;
      // console.log(events);
      // Re-render all events in boxes
      // let storedEvents = events.filter((event) => event.date === "2024-10-17");
      // console.log(storedEvents);
    })
    .catch((error) => console.log("Caught error", error));
}

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  events = [];
  window.location.href = "/auth.html";
});

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
  let allEvents = document.getElementById("all-events");
  allEvents.innerHTML = "";
  let dayBox = document.querySelector(
    `.days li[data-date='${key}'] .day-box-events`
  );
  // console.log(dayBox);
  // Clear day box in calendar grid
  dayBox.innerHTML = "";

  // let storedEvents = localStorage.getItem(key);
  let storedEvents = events.filter((event) => event.date === key);
  // console.log(key, storedEvents);
  if (storedEvents == null || storedEvents.length == 0) {
    allEvents.innerHTML = "<h3>No events added.</h3>";
    return;
  }

  allEvents.innerHTML += "<h4>Your Events<h4?>";

  // console.log(storedEvents);

  storedEvents.forEach((event, index) => {
    eventElement = `<div class="card">
    <div class="row card-body m-0 py-2">
      <div class="col-10 align-content-center">
        <p class="m-0">${event.title}</p>
      </div>
      <div class="col-2 p-0 align-content-center">
        <button onclick="deleteEvent(event)" data-date="${key}" data-event-index="${index}"
          class="btn btn-outline-danger">Delete</button>
      </div>
    </div>
  </div>`;
    // console.log(event.title);
    allEvents.innerHTML += eventElement;
    // let dayBox = document.querySelector(`.days li[data-date='${key}']`);
    dayBox.innerHTML += `<p class="day-box-event bg-primary text-light px-1 mb-1">${
      event.title.length > 40 ? event.title.slice(0, 40) + "..." : event.title
    }</p>`;
  });
}

function addEvent() {
  let title = modalInput.value;
  if (title === "") return;
  let key = modal.getAttribute("data-date");

  let newEvent = {
    title: modalInput.value,
    date: key,
  };

  createEvent(newEvent)
    .then(() => {
      events.push(newEvent);
      refreshEventsData();
      showEvents(key);
    })
    .catch((error) => {
      console.log(error);
    });

  // let storedEvents = localStorage.getItem(key);
  // storedEvents = storedEvents ? JSON.parse(storedEvents) : [];
  // storedEvents.push(newEvent);
  // localStorage.setItem(key, JSON.stringify(storedEvents));

  modalInput.value = "";
}

function deleteEvent(event) {
  button = event.target;
  key = button.getAttribute("data-date");
  eventIndex = button.getAttribute("data-event-index");
  let storedEvents = events.filter((event) => event.date === key);
  let eventToDelete = storedEvents[eventIndex];
  // console.log(eventToDelete);

  removeEvent(eventToDelete.id)
    .then(() => {
      events = events.filter((e) => e.id !== eventToDelete.id);
      refreshEventsData();
      showEvents(key);
    })
    .catch((error) => {
      console.log(error);
    });

  // let storedEvents = localStorage.getItem(key);
  // storedEvents = storedEvents ? JSON.parse(storedEvents) : [];
  // storedEvents.splice(eventIndex, 1);
  // if (storedEvents.length == 0) {
  //   localStorage.removeItem(key);
  // } else {
  //   localStorage.setItem(key, JSON.stringify(storedEvents));
  // }
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
    key = formatDateString(key);
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
    key = formatDateString(key);
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
    key = formatDateString(key);
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

function formatDateString(dateString) {
  const [year, month, day] = dateString.split("-");

  const fixedMonth = month.padStart(2, "0");
  const fixedDay = day.padStart(2, "0");

  return `${year}-${fixedMonth}-${fixedDay}`;
}
