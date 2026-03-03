export function showCopyNotice(x, y) {
    const notice = document.createElement('div');
    notice.className = 'copy-notice show';
    notice.textContent = 'Copied';
    notice.style.position = 'fixed';
    notice.style.left = x + 'px';
    notice.style.top = y + 'px';
    document.body.appendChild(notice);
    setTimeout(() => {
        notice.classList.remove('show');
        setTimeout(() => notice.remove(), 300);
    }, 900);
}
export function initCopyList() {
    document.querySelectorAll('.donate-list li').forEach((li) => {
        li.style.cursor = 'pointer';
        li.addEventListener('click', () => {
            var _a;
            const text = (_a = li.textContent) === null || _a === void 0 ? void 0 : _a.trim();
            if (!text)
                return;
            navigator.clipboard.writeText(text).then(() => {
                const rect = li.getBoundingClientRect();
                showCopyNotice(rect.left + rect.width / 2, rect.top);
            }).catch((err) => console.error('copy failed', err));
        });
    });
}
//# sourceMappingURL=copyNotice.js.map