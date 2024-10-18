window.onload = function () {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "./calendar.html";
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
        window.location.href = "./calendar.html";
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
        window.location.href = "./calendar.html";
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

  const loginErrorElement = document.getElementById("login-error-message");
  if (!response.ok) {
    loginErrorElement.textContent = "*Username or password not found/incorrect";
    loginErrorElement.classList.add(
      "bg-danger",
      "text-light",
      "rounded-2",
      "mt-2",
      "px-2"
    );
    loginErrorElement.style.display = "block";
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

  const registerErrorElement = document.getElementById(
    "register-error-message"
  );
  if (!response.ok) {
    registerErrorElement.textContent =
      "*Failed to create new account. Please try again with different username and/or email.";
    registerErrorElement.classList.add(
      "bg-danger",
      "text-light",
      "rounded-2",
      "mt-2",
      "px-2"
    );
    registerErrorElement.style.display = "block";
    throw new Error("Failed to register");
  }

  const data = await response.json();
  return data;
}
