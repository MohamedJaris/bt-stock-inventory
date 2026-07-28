async function login() {
  const username = document.getElementById("username").value.trim();

  const password = document.getElementById("password").value.trim();

  const message = document.getElementById("message");

  message.innerHTML = "";

  const response = await fetch("/api/auth/login", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      username,
      password,
    }),
  });

  const data = await response.json();

  if (data.success) {
    window.location.href = "index.html";
  } else {
    message.innerHTML = "<span class='text-danger'>" + data.message + "</span>";
  }
}
