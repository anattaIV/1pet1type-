export function initTelegram() {
    const telegramLink = document.getElementById('telegramLink');
    const telegramModal = document.getElementById('telegramModal');
    const closeTelegramModal = document.getElementById('closeTelegramModal');
    telegramLink === null || telegramLink === void 0 ? void 0 : telegramLink.addEventListener('click', (e) => { e.preventDefault(); telegramModal === null || telegramModal === void 0 ? void 0 : telegramModal.classList.add('active'); });
    closeTelegramModal === null || closeTelegramModal === void 0 ? void 0 : closeTelegramModal.addEventListener('click', () => telegramModal === null || telegramModal === void 0 ? void 0 : telegramModal.classList.remove('active'));
    telegramModal === null || telegramModal === void 0 ? void 0 : telegramModal.addEventListener('click', (e) => { if (e.target === telegramModal)
        telegramModal.classList.remove('active'); });
}
//# sourceMappingURL=telegram.js.map