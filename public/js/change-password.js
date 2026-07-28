async function changePassword() {
  const oldPassword = document.getElementById("oldPassword").value.trim();

  const newPassword = document.getElementById("newPassword").value.trim();

  const confirmPassword = document
    .getElementById("confirmPassword")
    .value.trim();

  const message = document.getElementById("message");

  message.className = "";
  message.innerHTML = "";

  // Validation

  if (!oldPassword || !newPassword || !confirmPassword) {
    message.className = "text-danger";
    message.innerHTML = "Please fill all fields.";
    return;
  }

  if (newPassword.length < 6) {
    message.className = "text-danger";
    message.innerHTML = "New password must contain at least 6 characters.";
    return;
  }

  if (oldPassword === newPassword) {
    message.className = "text-danger";
    message.innerHTML =
      "New password must be different from the current password.";
    return;
  }

  if (newPassword !== confirmPassword) {
    message.className = "text-danger";
    message.innerHTML = "Passwords do not match.";
    return;
  }

  try {
    const response = await fetch("/api/auth/change-password", {
      method: "PUT",

      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      message.className = "text-danger";
      message.innerHTML = data.message;
      return;
    }

    message.className = "text-success";
    message.innerHTML =
      "Password changed successfully. Redirecting to login...";

    setTimeout(async () => {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/login.html";
    }, 1500);
  } catch (err) {
    message.className = "text-danger";
    message.innerHTML = "Unable to change password. Please try again.";
  }
}
