export function initDonate() {
  const donateLink = document.getElementById('donateLink');
  const donateModal = document.getElementById('donateModal');
  const closeDonateModal = document.getElementById('closeDonateModal');
  const donateHeaders = document.querySelectorAll<HTMLDivElement>('.donate-header');

  donateLink?.addEventListener('click', (e) => { e.preventDefault(); donateModal?.classList.add('active'); });
  closeDonateModal?.addEventListener('click', () => donateModal?.classList.remove('active'));
  donateModal?.addEventListener('click', (e) => { if (e.target === donateModal) donateModal.classList.remove('active'); });

  donateHeaders.forEach((header) => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      document.querySelectorAll<HTMLElement>('.donate-item').forEach((it) => { if (it !== item) it.classList.remove('active'); });
      item?.classList.toggle('active');
    });
  });
}