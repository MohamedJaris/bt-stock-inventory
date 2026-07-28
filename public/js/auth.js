async function checkLogin() {

    try {
  
      const response = await fetch(
        "/api/auth/check",
        {
          credentials:"include"
        }
      );
  
  
      if(!response.ok){
  
        alert(
          "Session expired. Please login again."
        );
  
        window.location.href="/login.html";
  
        return;
      }
  
  
      const data = await response.json();
  
  
      if(!data.authenticated){
  
        alert(
          "Session expired. Please login again."
        );
  
        window.location.href="/login.html";
  
        return;
      }
  
  
      const usernameElement =
      document.getElementById("welcomeUser");
  
  
      if(usernameElement){
  
        usernameElement.innerHTML =
        "Welcome, " + data.user.username;
  
      }
  
  
    }
    catch(err){
  
      alert(
        "Session expired. Please login again."
      );
  
      window.location.href="/login.html";
  
    }
  
  }
async function logout() {
  const confirmLogout = confirm("Are you sure you want to logout?");

  if (!confirmLogout) {
    return;
  }

  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login.html";
  } catch (err) {
    alert("Logout failed.");
  }
}
// Run immediately
checkLogin();
