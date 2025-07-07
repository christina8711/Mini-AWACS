export function attachLoginHandler() {
  const form = document.getElementById("loginForm");

  // 🔑 Hard-coded login credentials
  const adminEmail = "admin@gmail.com";
  const adminPass = "miniawacs2025";

  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    if (email === adminEmail && password === adminPass) {
      window.location.href = "/dashboard";
    } else {
      alert("❌ Incorrect email or password. Please try again.");
    }
  });
}
