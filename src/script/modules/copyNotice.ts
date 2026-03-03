export function showCopyNotice(x: number, y: number) {
  const notice = document.createElement('div');
  notice.className = 'copy-notice show';
  notice.textContent = 'Copied';
  notice.style.position = 'fixed';
  notice.style.left = x + 'px';
  notice.style.top = y + 'px';
  document.body.appendChild(notice);
  setTimeout(() => {
    notice.classList.remove('show');
    setTimeout(() => notice.remove(), 300);
  }, 900);
}

export function initCopyList() {
  document.querySelectorAll<HTMLLIElement>('.donate-list li').forEach((li) => {
    li.style.cursor = 'pointer';
    li.addEventListener('click', () => {
      const text = li.textContent?.trim();
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        const rect = li.getBoundingClientRect();
        showCopyNotice(rect.left + rect.width / 2, rect.top);
      }).catch((err) => console.error('copy failed', err));
    });
  });
}