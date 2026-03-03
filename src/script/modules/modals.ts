export function initModal(triggerId: string, modalId: string, closeId: string) {
  const trigger = document.getElementById(triggerId);
  const modal = document.getElementById(modalId);
  const closeBtn = document.getElementById(closeId);

  trigger?.addEventListener('click', (e) => {
    e.preventDefault();
    modal?.classList.add('active');
  });

  closeBtn?.addEventListener('click', () => modal?.classList.remove('active'));
  modal?.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
}