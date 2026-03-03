export function initTelegram() {
  const telegramLink = document.getElementById('telegramLink');
  const telegramModal = document.getElementById('telegramModal');
  const closeTelegramModal = document.getElementById('closeTelegramModal');

  telegramLink?.addEventListener('click', (e) => { e.preventDefault(); telegramModal?.classList.add('active'); });
  closeTelegramModal?.addEventListener('click', () => telegramModal?.classList.remove('active'));
  telegramModal?.addEventListener('click', (e) => { if (e.target === telegramModal) telegramModal.classList.remove('active'); });
}