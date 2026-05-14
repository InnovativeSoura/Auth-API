// ================= TOGGLE FORMS =================

const signupBox = document.getElementById("signupBox");
const loginBox = document.getElementById("loginBox");

const showLogin = document.getElementById("showLogin");
const showSignup = document.getElementById("showSignup");

showLogin.addEventListener("click", () => {

  signupBox.classList.add("hidden");

  loginBox.classList.remove("hidden");

});

showSignup.addEventListener("click", () => {

  loginBox.classList.add("hidden");

  signupBox.classList.remove("hidden");

});

// ================= PASSWORD TOGGLE =================

function togglePassword(inputId, eyeId) {

  const input = document.getElementById(inputId);

  const eye = document.getElementById(eyeId);

  eye.addEventListener("click", () => {

    if (input.type === "password") {

      input.type = "text";

      eye.innerText = "🙈";

    } else {

      input.type = "password";

      eye.innerText = "👁️";

    }

  });

}

togglePassword("signupPassword", "signupEye");
togglePassword("loginPassword", "loginEye");

// ================= SIGNUP =================

const signupForm = document.getElementById("signupForm");

const signupMessage = document.getElementById("signupMessage");

signupForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const userData = {

    name: document.getElementById("signupName").value,

    email: document.getElementById("signupEmail").value,

    password: document.getElementById("signupPassword").value,

  };

  try {

    const response = await fetch("/signup", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(userData),

    });

    const data = await response.json();

    if (data.success) {

      signupMessage.style.color = "green";

      signupForm.reset();

    } else {

      signupMessage.style.color = "red";

    }

    signupMessage.innerText = data.message;

  } catch (error) {

    signupMessage.style.color = "red";

    signupMessage.innerText = "Server Error";

  }

});

// ================= LOGIN =================

const loginForm = document.getElementById("loginForm");

const loginMessage = document.getElementById("loginMessage");

loginForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const loginData = {

    email: document.getElementById("loginEmail").value,

    password: document.getElementById("loginPassword").value,

  };

  try {

    const response = await fetch("/login", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(loginData),

    });

    const data = await response.json();

    if (data.success) {

      localStorage.setItem("token", data.token);

      loginMessage.style.color = "green";

      loginMessage.innerText =
        `Welcome ${data.name}`;

    } else {

      loginMessage.style.color = "red";

      loginMessage.innerText = data.message;

    }

  } catch (error) {

    loginMessage.style.color = "red";

    loginMessage.innerText = "Server Error";

  }

});

// ================= LOGOUT =================

const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async () => {

  const token = localStorage.getItem("token");

  if (!token) {

    loginMessage.style.color = "red";

    loginMessage.innerText = "Please Login First";

    return;

  }

  try {

    const response = await fetch("/logout", {

      method: "POST",

      headers: {
        authorization: token,
      },

    });

    const data = await response.json();

    if (data.success) {

      localStorage.removeItem("token");

      loginMessage.style.color = "green";

    } else {

      loginMessage.style.color = "red";

    }

    loginMessage.innerText = data.message;

  } catch (error) {

    loginMessage.style.color = "red";

    loginMessage.innerText = "Server Error";

  }

});

// ================= PROFILE =================

const profileBtn = document.getElementById("profileBtn");

profileBtn.addEventListener("click", async () => {

  const token = localStorage.getItem("token");

  if (!token) {

    loginMessage.style.color = "red";

    loginMessage.innerText = "Please Login First";

    return;

  }

  try {

    const response = await fetch("/profile", {

      method: "GET",

      headers: {
        authorization: token,
      },

    });

    const data = await response.json();

    if (data.success) {

      loginMessage.style.color = "green";

    } else {

      loginMessage.style.color = "red";

    }

    loginMessage.innerText = data.message;

  } catch (error) {

    loginMessage.style.color = "red";

    loginMessage.innerText = "Server Error";

  }

});