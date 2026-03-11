export function initCustomCursor() {
  if (typeof window === "undefined" || typeof document === "undefined") return;

  const setup = () => {
    if (document.querySelector(".custom-cursor")) return;

    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.appendChild(cursor);

    let lastTrailTime = 0;
    const trailInterval = 35; // ms

    const interactiveSelector =
      "a, button, [role='button'], input, textarea, select, .knop, .account-btn, .yakor, .yakor-dummy, .faq-header, .donate-header, .telegram-btn, .modal-close";

    const updatePosition = (clientX: number, clientY: number) => {
      cursor.style.left = `${clientX}px`;
      cursor.style.top = `${clientY}px`;
      const now = performance.now();
      if (now - lastTrailTime > trailInterval) {
        lastTrailTime = now;
        const trail = document.createElement("div");
        trail.className = "custom-cursor-trail";
        (trail.style as CSSStyleDeclaration).left = `${clientX}px`;
        (trail.style as CSSStyleDeclaration).top = `${clientY}px`;
        document.body.appendChild(trail);
        trail.addEventListener("animationend", () => {
          trail.remove();
        });
      }
    };

    window.addEventListener("mousemove", (event) => {
      const { clientX, clientY } = event;
      updatePosition(clientX, clientY);

      const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      if (el && el.closest(interactiveSelector)) {
        cursor.classList.add("is-clickable");
      } else {
        cursor.classList.remove("is-clickable");
      }
    });

    window.addEventListener("mouseleave", () => {
      cursor.style.opacity = "0";
    });

    window.addEventListener("mouseenter", () => {
      cursor.style.opacity = "1";
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
}

