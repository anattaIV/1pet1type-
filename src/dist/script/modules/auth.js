export function initAuth() {
    var _a;
    const accountBtn = document.getElementById('accountBtn');
    const authModal = document.getElementById('authModal');
    const closeModal = document.getElementById('closeModal');
    const authForm = document.querySelector('.auth-form');
    accountBtn === null || accountBtn === void 0 ? void 0 : accountBtn.addEventListener('click', () => authModal === null || authModal === void 0 ? void 0 : authModal.classList.add('active'));
    closeModal === null || closeModal === void 0 ? void 0 : closeModal.addEventListener('click', () => authModal === null || authModal === void 0 ? void 0 : authModal.classList.remove('active'));
    authModal === null || authModal === void 0 ? void 0 : authModal.addEventListener('click', (e) => { if (e.target === authModal)
        authModal.classList.remove('active'); });
    authForm === null || authForm === void 0 ? void 0 : authForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        console.log('Login attempt:', { email, password });
        authModal === null || authModal === void 0 ? void 0 : authModal.classList.remove('active');
        authForm.reset();
    });
    (_a = document.getElementById('toggleSignup')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('Toggle to sign up');
    });
}
//# sourceMappingURL=auth.js.map