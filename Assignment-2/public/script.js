// ================= SIGNUP =================

const signupForm = document.getElementById("signupForm");
const message = document.getElementById("message");

const password = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");

// Show / Hide Password
togglePassword.addEventListener("click", () => {

  if (password.type === "password") {

    password.type = "text";
    togglePassword.innerText = "🙈";

  } else {

    password.type = "password";
    togglePassword.innerText = "👁️";

  }

});

// Signup Submit
signupForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const userData = {

    name: document.getElementById("name").value,

    email: document.getElementById("email").value,

    password: password.value,

    role: document.getElementById("role").value,

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

      message.style.color = "green";

      signupForm.reset();

      password.type = "password";

      togglePassword.innerText = "👁️";

    } else {

      message.style.color = "red";

    }

    message.innerText = data.message;

  } catch (error) {

    message.style.color = "red";

    message.innerText = "Something went wrong";

  }

});

// ================= ADMIN ACCESS =================

const adminForm = document.getElementById("adminForm");

const adminMessage = document.getElementById("adminMessage");

adminForm.addEventListener("submit", async (e) => {

  e.preventDefault();

  const email = document.getElementById("adminEmail").value;

  try {

    const response = await fetch("/admin", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email }),

    });

    const data = await response.json();

    if (data.success) {

      adminMessage.style.color = "green";

    } else {

      adminMessage.style.color = "red";

    }

    adminMessage.innerText = data.message;

  } catch (error) {

    adminMessage.style.color = "red";

    adminMessage.innerText = "Server Error";

  }

});