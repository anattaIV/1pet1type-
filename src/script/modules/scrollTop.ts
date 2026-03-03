export function initScrollTop() {
  const yakor = document.querySelector<HTMLDivElement>('.yakor');
  yakor?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}