export function initAuth() {
  const accountBtn = document.getElementById('accountBtn');
  const authModal = document.getElementById('authModal');
  const closeModal = document.getElementById('closeModal');
  const authForm = document.querySelector<HTMLFormElement>('.auth-form');

  accountBtn?.addEventListener('click', () => authModal?.classList.add('active'));
  closeModal?.addEventListener('click', () => authModal?.classList.remove('active'));
  authModal?.addEventListener('click', (e) => { if (e.target === authModal) authModal.classList.remove('active'); });

  authForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const password = (document.getElementById('password') as HTMLInputElement).value;
    console.log('Login attempt:', { email, password });
    authModal?.classList.remove('active');
    authForm.reset();
  });

  document.getElementById('toggleSignup')?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Toggle to sign up');
  });
}