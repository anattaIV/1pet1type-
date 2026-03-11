interface ProfileUser {
  id: number;
  email: string;
  role: "user" | "admin" | "banned";
  phone?: string | null;
}

const PROFILE_PAGE_ID = "profilePage";
const MAIN_CONTENT_ID = "mainContent";
const PROFILE_USERNAME_ID = "profileUsername";
const PROFILE_ROLE_ID = "profileRole";
const LOGOUT_BUTTON_ID = "logoutBtn";
const AVATAR_STORAGE_PREFIX = "avatar:user:";

function getAvatarKey(userId: number): string {
  return `${AVATAR_STORAGE_PREFIX}${userId}`;
}

function generateRandomAvatarBackground(): string {
  const patterns = [
    () => {
      const angle = Math.floor(Math.random() * 360);
      return `linear-gradient(${angle}deg, #000000 0%, #ffffff 100%)`;
    },
    () => {
      const angle = Math.floor(Math.random() * 360);
      return `linear-gradient(${angle}deg, #ffffff 0%, #000000 50%, #ffffff 100%)`;
    },
    () => {
      return "radial-gradient(circle at 30% 30%, #ffffff 0%, #ffffff 18%, #000000 18%, #000000 35%, #ffffff 35%, #ffffff 52%, #000000 52%, #000000 70%)";
    },
    () => {
      const angle = Math.floor(Math.random() * 360);
      return `conic-gradient(from ${angle}deg, #000000, #ffffff, #000000)`;
    },
    () => {
      return "repeating-linear-gradient(45deg, #000000 0, #000000 8px, #ffffff 8px, #ffffff 16px)";
    },
  ];
  const pick = patterns[Math.floor(Math.random() * patterns.length)];
  return pick();
}

function applyAvatarBackground(background: string | null) {
  const avatar = document.querySelector<HTMLDivElement>(".profile-avatar");
  if (!avatar || !background) return;
  avatar.style.background = background;
  avatar.style.backgroundSize = "cover";
}

function ensureAvatarForUser(user: ProfileUser) {
  const key = getAvatarKey(user.id);
  let bg = window.localStorage.getItem(key);
  if (!bg) {
    bg = generateRandomAvatarBackground();
    window.localStorage.setItem(key, bg);
  }
  applyAvatarBackground(bg);
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

function getAccessToken(): string | null {
  return window.localStorage.getItem("accessToken");
}

function setCurrentUser(user: ProfileUser | null) {
  if (user) {
    window.localStorage.setItem("currentUser", JSON.stringify(user));
  } else {
    window.localStorage.removeItem("currentUser");
  }
}

function getCurrentUserFromStorage(): ProfileUser | null {
  try {
    const raw = window.localStorage.getItem("currentUser");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProfileUser>;
    if (!parsed.role) {
      parsed.role = "user";
    }
    return parsed as ProfileUser;
  } catch {
    return null;
  }
}

function updateProfileUsername(user: ProfileUser | null) {
  const el = document.getElementById(PROFILE_USERNAME_ID);
  if (!el) return;
  if (!user) {
    el.textContent = "User";
    return;
  }
  const raw = user.email.trim();
  if (!raw) {
    el.textContent = "User";
    return;
  }
  el.textContent = raw;
}

function updateProfileRole(user: ProfileUser | null) {
  const el = document.getElementById(PROFILE_ROLE_ID);
  if (!el) return;

  let role: ProfileUser["role"] = user?.role ?? "user";

  let label = "USER";
  let suffix: "user" | "admin" | "banned" = "user";

  switch (role) {
    case "admin":
      label = "ADMIN";
      suffix = "admin";
      break;
    case "banned":
      label = "BANNED";
      suffix = "banned";
      break;
    default:
      label = "USER";
      suffix = "user";
  }

  el.textContent = label;
  el.className = `profile-role profile-role--${suffix}`;
}

function setSectionActive(sectionKey: string) {
  const navItems = document.querySelectorAll<HTMLButtonElement>(".profile-nav-item");
  navItems.forEach((btn) => {
    if (btn.dataset.section === sectionKey) {
      btn.classList.add("is-active");
    } else {
      btn.classList.remove("is-active");
    }
  });

  const titleEl = document.getElementById("profileSectionTitle");
  if (!titleEl) return;

  const profileBlock = document.getElementById("profileSectionProfile");
  const personalBlock = document.getElementById("profileSectionPersonal");

  switch (sectionKey) {
    case "profile":
      titleEl.textContent = "Profile";
      if (profileBlock) profileBlock.hidden = false;
      if (personalBlock) personalBlock.hidden = true;
      break;
    case "orders-current":
      titleEl.textContent = "Current orders";
      break;
    case "balance":
      titleEl.textContent = "Balance";
      break;
    case "personal":
      titleEl.textContent = "Personal data";
      if (profileBlock) profileBlock.hidden = true;
      if (personalBlock) personalBlock.hidden = false;
      break;
    case "security":
      titleEl.textContent = "Security";
      break;
    case "orders-history":
      titleEl.textContent = "Order history";
      break;
    case "cart":
      titleEl.textContent = "Cart";
      break;
    case "contacts":
      titleEl.textContent = "Contacts";
      break;
    case "favorites":
      titleEl.textContent = "Bookmarks";
      break;
    default:
      titleEl.textContent = "Profile";
  }
}

function showProfilePage() {
  const profile = document.getElementById(PROFILE_PAGE_ID);
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (profile) {
    profile.classList.add("is-visible");
    profile.setAttribute("aria-hidden", "false");
  }
  if (main) {
    main.style.display = "none";
  }
}

function hideProfilePage() {
  const profile = document.getElementById(PROFILE_PAGE_ID);
  const main = document.getElementById(MAIN_CONTENT_ID);
  if (profile) {
    profile.classList.remove("is-visible");
    profile.setAttribute("aria-hidden", "true");
  }
  if (main) {
    main.style.display = "";
  }
}

async function fetchMeAndOpen(): Promise<void> {
  const token = getAccessToken();
  if (!token) return;

  try {
    const res = await fetch("/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!res.ok) {
      return;
    }

    const data = (await res.json()) as {
      id: number;
      email: string;
      role: "user" | "admin" | "banned";
    };
    const user: ProfileUser = { id: data.id, email: data.email, role: data.role };
    setCurrentUser(user);
    updateProfileUsername(user);
    updateProfileRole(user);
    ensureAvatarForUser(user);
    setSectionActive("profile");
    showProfilePage();
  } catch (err) {
    console.error("Failed to fetch /api/auth/me", err);
  }
}

async function handleLogout(): Promise<void> {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout request failed", err);
  } finally {
    window.localStorage.removeItem("accessToken");
    setCurrentUser(null);
    updateProfileUsername(null);
    hideProfilePage();
    window.dispatchEvent(new CustomEvent("auth:logout"));
  }
}

export function initProfile() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const setup = () => {
    const storedUser = getCurrentUserFromStorage();
    updateProfileUsername(storedUser);
    updateProfileRole(storedUser);

    const nameEl = document.getElementById(PROFILE_USERNAME_ID);
    if (nameEl) {
      nameEl.classList.add("is-blurred");
      nameEl.addEventListener("click", () => {
        nameEl.classList.toggle("is-blurred");
      });
    }

    if (getAccessToken()) {
      fetchMeAndOpen();
    }

    const avatarInput = document.getElementById(
      "avatarUpload"
    ) as HTMLInputElement | null;
    if (avatarInput) {
      avatarInput.addEventListener("change", async () => {
        try {
          const currentUser = getCurrentUserFromStorage();
          if (!currentUser) {
            alert("You need to be logged in to change avatar.");
            avatarInput.value = "";
            return;
          }
          const file = avatarInput.files?.[0];
          if (!file) return;
          const dataUrl = await readFileAsDataURL(file);
          const key = getAvatarKey(currentUser.id);
          const bg = `url("${dataUrl}") center/cover no-repeat`;
          window.localStorage.setItem(key, bg);
          applyAvatarBackground(bg);
          avatarInput.value = "";
        } catch (err) {
          console.error("Failed to update avatar", err);
          alert("Failed to update avatar. Please try another image.");
        }
      });
    }

    const logoutBtn = document.getElementById(LOGOUT_BUTTON_ID);
    if (logoutBtn) {
      logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        handleLogout();
      });
    }

    const contactForm = document.getElementById(
      "personalContactForm"
    ) as HTMLFormElement | null;
    const passwordForm = document.getElementById(
      "personalPasswordForm"
    ) as HTMLFormElement | null;

    const emailInput = document.getElementById(
      "personalEmail"
    ) as HTMLInputElement | null;
    const phoneInput = document.getElementById(
      "personalPhone"
    ) as HTMLInputElement | null;

    if (storedUser && emailInput) {
      emailInput.value = storedUser.email;
    }
    if (storedUser && phoneInput && storedUser.phone) {
      phoneInput.value = storedUser.phone;
    }

    contactForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = getAccessToken();
      if (!token) {
        alert("You need to be logged in to edit personal data.");
        return;
      }

      const email = emailInput?.value.trim() ?? "";
      const phone = phoneInput?.value.trim() ?? "";
      const pwdInput = document.getElementById(
        "personalPasswordConfirm"
      ) as HTMLInputElement | null;
      const currentPassword = pwdInput?.value ?? "";

      if (!email || !currentPassword) {
        alert("Email and current password are required.");
        return;
      }

      try {
        const res = await fetch("/api/user/update-profile", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            email,
            phone: phone || null,
            currentPassword,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          alert(
            `Failed to update profile: ${
              data.error || res.statusText || "Unknown error"
            }`
          );
          return;
        }

        const updatedUser: ProfileUser = {
          id: data.id,
          email: data.email,
          role: data.role,
          phone: data.phone ?? null,
        };
        setCurrentUser(updatedUser);
        updateProfileUsername(updatedUser);
        updateProfileRole(updatedUser);

        if (pwdInput) pwdInput.value = "";

        alert("Profile updated successfully.");
      } catch (err) {
        console.error("Failed to update profile", err);
        alert("Network error, please try again.");
      }
    });

    passwordForm?.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = getAccessToken();
      if (!token) {
        alert("You need to be logged in to change password.");
        return;
      }

      const currentPasswordInput = document.getElementById(
        "currentPassword"
      ) as HTMLInputElement | null;
      const newPasswordInput = document.getElementById(
        "newPassword"
      ) as HTMLInputElement | null;

      const currentPassword = currentPasswordInput?.value ?? "";
      const newPassword = newPasswordInput?.value ?? "";

      if (!currentPassword || !newPassword) {
        alert("Both current and new password are required.");
        return;
      }

      try {
        const res = await fetch("/api/user/update-password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          alert(
            `Failed to change password: ${
              data.error || res.statusText || "Unknown error"
            }`
          );
          return;
        }

        if (currentPasswordInput) currentPasswordInput.value = "";
        if (newPasswordInput) newPasswordInput.value = "";

        alert("Password changed successfully.");
      } catch (err) {
        console.error("Failed to change password", err);
        alert("Network error, please try again.");
      }
    });

    const nav = document.querySelector(".profile-nav");
    if (nav) {
      nav.addEventListener("click", (event) => {
        const target = event.target as HTMLElement | null;
        if (!target) return;
        const btn = target.closest<HTMLButtonElement>(".profile-nav-item");
        if (!btn) return;

        const section = btn.dataset.section;
        if (!section) return;

        if (section === "back") {
          hideProfilePage();
          return;
        }

        if (section === "logout") {
          return;
        }

        setSectionActive(section);
      });
    }

    window.addEventListener("auth:openProfile", () => {
      if (getAccessToken()) {
        if (!getCurrentUserFromStorage()) {
          fetchMeAndOpen();
        } else {
          showProfilePage();
        }
      }
    });

    window.addEventListener("auth:login", (event: Event) => {
      const custom = event as CustomEvent<{ user: ProfileUser }>;
      const user = custom.detail?.user;
      if (!user) return;
      setCurrentUser(user);
      updateProfileUsername(user);
      updateProfileRole(user);
      ensureAvatarForUser(user);
      setSectionActive("profile");
      showProfilePage();
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
}

