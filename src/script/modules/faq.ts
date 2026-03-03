export function initFAQ() {
  const faqLink = document.getElementById('faqLink');
  const faqModal = document.getElementById('faqModal');
  const closeFaqModal = document.getElementById('closeFaqModal');
  const faqHeaders = document.querySelectorAll<HTMLDivElement>('.faq-header');

  faqLink?.addEventListener('click', (e) => {
    e.preventDefault();
    faqModal?.classList.add('active');
  });
  closeFaqModal?.addEventListener('click', () => faqModal?.classList.remove('active'));
  faqModal?.addEventListener('click', (e) => { if (e.target === faqModal) faqModal.classList.remove('active'); });

  faqHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const faqItem = header.parentElement;
      document.querySelectorAll<HTMLElement>('.faq-item').forEach((item) => {
        if (item !== faqItem) item.classList.remove('active');
      });
      faqItem?.classList.toggle('active');
    });
  });
}