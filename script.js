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

// PHOTO EDITOR
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const imageInput = document.getElementById("imageInput");

let originalImage = null;
let rotation = 0;
let flipped = false;

// UPLOAD FOTO
imageInput.addEventListener("change", function(e) {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("Silakan pilih file gambar!");
    return;
  }

  const image = new Image();
  const imageURL = URL.createObjectURL(file);

  image.onload = function() {
    originalImage = image;
    rotation = 0;
    flipped = false;

    document.getElementById("emptyMessage").style.display = "none";
    canvas.style.display = "block";

    resetFilters();
    drawImage();

    URL.revokeObjectURL(imageURL);
  };

  image.onerror = function() {
    alert("Gambar gagal dibuka.");
    URL.revokeObjectURL(imageURL);
  };

  image.src = imageURL;
});

// FILTER FOTO
function getFilter() {
  const brightness = document.getElementById("brightness").value;
  const contrast = document.getElementById("contrast").value;
  const saturation = document.getElementById("saturation").value;
  const grayscale = document.getElementById("grayscale").value;
  const sepia = document.getElementById("sepia").value;
  const blur = document.getElementById("blur").value;

  return `
    brightness(${brightness}%)
    contrast(${contrast}%)
    saturate(${saturation}%)
    grayscale(${grayscale}%)
    sepia(${sepia}%)
    blur(${blur}px)
  `;
}

// GAMBAR KE CANVAS
function drawImage() {
  if (!originalImage) return;

  const width = originalImage.naturalWidth;
  const height = originalImage.naturalHeight;

  const sideways = Math.abs(rotation) % 180 === 90;

  canvas.width = sideways ? height : width;
  canvas.height = sideways ? width : height;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.save();

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotation * Math.PI / 180);
  ctx.scale(flipped ? -1 : 1, 1);

  ctx.filter = getFilter();

  ctx.drawImage(
    originalImage,
    -width / 2,
    -height / 2,
    width,
    height
  );

  ctx.restore();
  ctx.filter = "none";
}

// AKTIFKAN SEMUA FILTER
document.querySelectorAll('input[type="range"]').forEach(function(input) {
  input.addEventListener("input", drawImage);
});

// ROTATE
document.getElementById("rotateBtn").addEventListener("click", function() {
  if (!originalImage) return;

  rotation = (rotation + 90) % 360;
  drawImage();
});

// FLIP
document.getElementById("flipBtn").addEventListener("click", function() {
  if (!originalImage) return;

  flipped = !flipped;
  drawImage();
});

// RESET FILTER
function resetFilters() {
  document.getElementById("brightness").value = 100;
  document.getElementById("contrast").value = 100;
  document.getElementById("saturation").value = 100;
  document.getElementById("grayscale").value = 0;
  document.getElementById("sepia").value = 0;
  document.getElementById("blur").value = 0;
}

document.getElementById("resetBtn").addEventListener("click", function() {
  if (!originalImage) return;

  rotation = 0;
  flipped = false;

  resetFilters();
  drawImage();
});

// DOWNLOAD FOTO
document.getElementById("downloadBtn").addEventListener("click", function() {
  if (!originalImage) {
    alert("Upload foto terlebih dahulu!");
    return;
  }

  const link = document.createElement("a");

  link.download = "photo-art-studio.png";
  link.href = canvas.toDataURL("image/png");

  link.click();
});
