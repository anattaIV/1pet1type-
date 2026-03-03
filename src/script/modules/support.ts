export function initSupport() {
  const supportLink = document.getElementById('supportLink');
  const supportModal = document.getElementById('supportModal');
  const closeSupportModal = document.getElementById('closeSupportModal');
  const supportForm = document.querySelector<HTMLFormElement>('.support-form');

  supportLink?.addEventListener('click', (e) => {
    e.preventDefault();
    supportModal?.classList.add('active');
  });

  closeSupportModal?.addEventListener('click', () => supportModal?.classList.remove('active'));
  supportModal?.addEventListener('click', (e) => { if (e.target === supportModal) supportModal.classList.remove('active'); });

  supportForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = (document.getElementById('supportEmail') as HTMLInputElement).value;
    const message = (document.getElementById('supportMessage') as HTMLInputElement).value;
    if (!email || !message) { alert('Please fill in email and message.'); return; }
    console.log('Support request:', { email, message });
    supportForm.classList.add('submitted');
    supportModal?.classList.remove('active');
    supportForm.reset();
    setTimeout(() => supportForm.classList.remove('submitted'), 900);
    setTimeout(() => alert('Сообщение отправлено. Мы ответим на почту.'), 200);
  });
}