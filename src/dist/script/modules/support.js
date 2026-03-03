export function initSupport() {
    const supportLink = document.getElementById('supportLink');
    const supportModal = document.getElementById('supportModal');
    const closeSupportModal = document.getElementById('closeSupportModal');
    const supportForm = document.querySelector('.support-form');
    supportLink === null || supportLink === void 0 ? void 0 : supportLink.addEventListener('click', (e) => {
        e.preventDefault();
        supportModal === null || supportModal === void 0 ? void 0 : supportModal.classList.add('active');
    });
    closeSupportModal === null || closeSupportModal === void 0 ? void 0 : closeSupportModal.addEventListener('click', () => supportModal === null || supportModal === void 0 ? void 0 : supportModal.classList.remove('active'));
    supportModal === null || supportModal === void 0 ? void 0 : supportModal.addEventListener('click', (e) => { if (e.target === supportModal)
        supportModal.classList.remove('active'); });
    supportForm === null || supportForm === void 0 ? void 0 : supportForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('supportEmail').value;
        const message = document.getElementById('supportMessage').value;
        if (!email || !message) {
            alert('Please fill in email and message.');
            return;
        }
        console.log('Support request:', { email, message });
        supportForm.classList.add('submitted');
        supportModal === null || supportModal === void 0 ? void 0 : supportModal.classList.remove('active');
        supportForm.reset();
        setTimeout(() => supportForm.classList.remove('submitted'), 900);
        setTimeout(() => alert('Сообщение отправлено. Мы ответим на почту.'), 200);
    });
}
//# sourceMappingURL=support.js.map