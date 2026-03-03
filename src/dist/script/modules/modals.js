export function initModal(triggerId, modalId, closeId) {
    const trigger = document.getElementById(triggerId);
    const modal = document.getElementById(modalId);
    const closeBtn = document.getElementById(closeId);
    trigger === null || trigger === void 0 ? void 0 : trigger.addEventListener('click', (e) => {
        e.preventDefault();
        modal === null || modal === void 0 ? void 0 : modal.classList.add('active');
    });
    closeBtn === null || closeBtn === void 0 ? void 0 : closeBtn.addEventListener('click', () => modal === null || modal === void 0 ? void 0 : modal.classList.remove('active'));
    modal === null || modal === void 0 ? void 0 : modal.addEventListener('click', (e) => { if (e.target === modal)
        modal.classList.remove('active'); });
}
//# sourceMappingURL=modals.js.map