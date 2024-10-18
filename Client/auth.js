window.onload = function () {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "/calendar.html";
    return;
  }
};

const apiAuthUrl = "https://localhost:7271/api/account";

// LOGIN
document
  .getElementById("login-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      await login(username, password).then((data) => {
        let token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "/calendar.html";
      });
    } catch (error) {
      console.error(error);
    }
  });

// REGISTER
document
  .getElementById("register-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("reg-username").value;
    const email = document.getElementById("reg-email").value;
    const password = document.getElementById("reg-password").value;

    try {
      await register(username, email, password).then((data) => {
        let token = data.token;
        localStorage.setItem("token", token);
        window.location.href = "/calendar.html";
      });
    } catch (error) {
      console.error(error);
    }
  });

async function login(username, password) {
  const response = await fetch(`${apiAuthUrl}/login`, {
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
  return data;
}

async function register(username, email, password) {
  const response = await fetch(`${apiAuthUrl}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, email, password }),
  });

  if (!response.ok) {
    throw new Error("Failed to log in");
  }

  const data = await response.json();
  return data;
}
