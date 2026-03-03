export function initScrollTop() {
    const yakor = document.querySelector('.yakor');
    yakor === null || yakor === void 0 ? void 0 : yakor.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}
//# sourceMappingURL=scrollTop.js.map