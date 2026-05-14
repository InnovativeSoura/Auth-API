// script.js

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

// Signup Form Submit
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userData = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: password.value,
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
      message.innerText = data.message;

      signupForm.reset();

      // Reset password field state
      password.type = "password";
      togglePassword.innerText = "👁️";

    } else {

      message.style.color = "red";
      message.innerText = data.message;

    }

  } catch (error) {

    message.style.color = "red";
    message.innerText = "Something went wrong";

  }
});