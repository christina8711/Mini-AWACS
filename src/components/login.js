export function attachLoginHandler() {
  const form = document.getElementById("loginForm");
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASS;

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
