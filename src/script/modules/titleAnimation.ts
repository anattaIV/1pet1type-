export function initTitleAnimation() {
  if (typeof document === "undefined") return;

  const originalTitle = document.title;
  if (!originalTitle) return;

  const typeSpeed = 140;
  const eraseSpeed = 90;
  const pauseAtFull = 1200;
  const pauseAtEmpty = 800;

  // не допускаем полностью пустого title, чтобы не показывался URL вкладки
  let index = 1;
  let direction: "forward" | "backward" = "forward";
  let stopped = false;

  window.addEventListener("beforeunload", () => {
    stopped = true;
  });

  const step = () => {
    if (stopped) return;

    if (direction === "forward") {
      index++;
      if (index > originalTitle.length) {
        direction = "backward";
        setTimeout(step, pauseAtFull);
        return;
      }
    } else {
      index--;
      if (index <= 1) {
        direction = "forward";
        index = 1;
        setTimeout(step, pauseAtEmpty);
        return;
      }
    }

    document.title = originalTitle.slice(0, index);
    const delay = direction === "forward" ? typeSpeed : eraseSpeed;
    setTimeout(step, delay);
  };

  // стартуем с первого символа
  document.title = originalTitle.slice(0, index);
  setTimeout(step, 800);
}

