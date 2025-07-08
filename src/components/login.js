export function attachLoginHandler() {
  const form = document.getElementById("loginForm");

  if (!form) return;

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email")?.value.trim();
    const password = document.getElementById("password")?.value;

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        const error = await res.json();
        alert(`❌ ${error.message || "Login failed"}`);
      }
    } catch (err) {
      console.error(err);
      alert("❌ An error occurred. Please try again.");
    }
  });
}
