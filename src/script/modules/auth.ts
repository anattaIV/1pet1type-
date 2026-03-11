export function initAuth() {
  const accountBtn = document.getElementById("accountBtn");
  const authModal = document.getElementById("authModal");
  const closeModal = document.getElementById("closeModal");
  const authForm = document.querySelector<HTMLFormElement>(".auth-form");
  const toggleSignupLink = document.getElementById("toggleSignup");

  const titleEl = authModal?.querySelector("h2");
  const submitBtn = authModal?.querySelector<HTMLButtonElement>(".auth-submit");
  const toggleText = authModal?.querySelector<HTMLParagraphElement>(".auth-toggle");
  const confirmWrapperId = "confirmPasswordWrapper";

  let mode: "login" | "signup" = "login";

  function hasAccessToken(): boolean {
    return !!window.localStorage.getItem("accessToken");
  }

  function ensureConfirmPasswordField() {
    let existing = document.getElementById(confirmWrapperId) as HTMLDivElement | null;
    if (!existing && authForm) {
      existing = document.createElement("div");
      existing.id = confirmWrapperId;
      existing.className = "form-group";
      existing.innerHTML = `
        <label for="confirmPassword">Confirm password</label>
        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat your password" required>
      `;
      const passwordField = authForm.querySelector("#password")?.parentElement;
      if (passwordField && passwordField.nextSibling) {
        authForm.insertBefore(existing, passwordField.nextSibling);
      } else {
        authForm.appendChild(existing);
      }
    }
    if (existing) existing.style.display = mode === "signup" ? "block" : "none";
  }

  function setMode(next: "login" | "signup") {
    mode = next;
    ensureConfirmPasswordField();

    if (titleEl) titleEl.textContent = mode === "login" ? "Authorization" : "Registration";
    if (submitBtn) submitBtn.textContent = mode === "login" ? "Login" : "Sign up";
    if (toggleText) {
      toggleText.innerHTML =
        mode === "login"
          ? `Don't have an account? <a href="#" id="toggleSignup">Sign up</a>`
          : `Already have an account? <a href="#" id="toggleSignup">Login</a>`;
    }

    const newToggle = authModal?.querySelector("#toggleSignup");
    if (newToggle) {
      newToggle.addEventListener("click", (e) => {
        e.preventDefault();
        setMode(mode === "login" ? "signup" : "login");
      });
    }
  }

  accountBtn?.addEventListener("click", () => {
    if (hasAccessToken()) {
      window.dispatchEvent(new CustomEvent("auth:openProfile"));
      return;
    }
    authModal?.classList.add("active");
  });

  closeModal?.addEventListener("click", () => authModal?.classList.remove("active"));
  authModal?.addEventListener("click", (e) => {
    if (e.target === authModal) authModal.classList.remove("active");
  });

  authForm?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const identifier = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    const confirm = (document.getElementById("confirmPassword") as HTMLInputElement | null)?.value;

    if (mode === "signup" && password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    try {
      const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (data.error === "account_banned") {
          const bannedModal = document.getElementById("bannedModal");
          bannedModal?.classList.add("active");
        } else {
          alert(`Auth failed: ${data.error || res.statusText}`);
        }
        return;
      }

      const accessToken = data.accessToken as string | undefined;
      if (accessToken) {
        window.localStorage.setItem("accessToken", accessToken);
      }

      const user = data.user as
        | {
            id: number;
            email: string;
            role?: "user" | "admin" | "banned";
            phone?: string | null;
          }
        | undefined;
      if (user) {
        const normalizedUser = {
          id: user.id,
          email: user.email,
          role: user.role ?? "user",
          phone: user.phone ?? null,
        };
        window.dispatchEvent(new CustomEvent("auth:login", { detail: { user: normalizedUser } }));
      }

      authModal?.classList.remove("active");
      authForm.reset();
    } catch (err) {
      console.error("Auth error", err);
      alert("Network error, please try again");
    }
  });

  toggleSignupLink?.addEventListener("click", (e) => {
    e.preventDefault();
    setMode("signup");
  });

  setMode("login");
}