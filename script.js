
let loginRole = "admin";

// GANTI HALAMAN LOGIN
function showLogin(role) {
  loginRole = role;

  document.getElementById("adminTab")
    .classList.toggle("active", role === "admin");

  document.getElementById("customerTab")
    .classList.toggle("active", role === "customer");

  document.getElementById("loginButton").textContent =
    role === "admin" ? "LOGIN ADMIN" : "LOGIN PELANGGAN";

  document.getElementById("loginMessage").textContent = "";
  document.getElementById("loginForm").reset();
}

// PROSES LOGIN
document.getElementById("loginForm")
  .addEventListener("submit", function(e) {

  e.preventDefault();

  const username =
    document.getElementById("username").value;

  const password =
    document.getElementById("password").value;

  let valid = false;

  if (loginRole === "admin") {
    valid = username === "admin" && password === "admin123";
  } else {
    valid = username === "pelanggan" && password === "user123";
  }

  if (valid) {
    document.getElementById("loginPage")
      .classList.add("hidden");

    document.getElementById("editorPage")
      .classList.remove("hidden");

    alert(
      loginRole === "admin"
      ? "Selamat datang Admin!"
      : "Selamat datang Pelanggan!"
    );

  } else {
    document.getElementById("loginMessage").textContent =
      "Username atau password salah!";
  }
});

// LOGOUT
document.getElementById("logoutBtn")
  .addEventListener("click", function() {

  document.getElementById("editorPage")
    .classList.add("hidden");

  document.getElementById("loginPage")
    .classList.remove("hidden");

  document.getElementById("loginForm").reset();

  showLogin("admin");
});
