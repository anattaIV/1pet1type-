export function initDonate() {
    const donateLink = document.getElementById('donateLink');
    const donateModal = document.getElementById('donateModal');
    const closeDonateModal = document.getElementById('closeDonateModal');
    const donateHeaders = document.querySelectorAll('.donate-header');
    donateLink === null || donateLink === void 0 ? void 0 : donateLink.addEventListener('click', (e) => { e.preventDefault(); donateModal === null || donateModal === void 0 ? void 0 : donateModal.classList.add('active'); });
    closeDonateModal === null || closeDonateModal === void 0 ? void 0 : closeDonateModal.addEventListener('click', () => donateModal === null || donateModal === void 0 ? void 0 : donateModal.classList.remove('active'));
    donateModal === null || donateModal === void 0 ? void 0 : donateModal.addEventListener('click', (e) => { if (e.target === donateModal)
        donateModal.classList.remove('active'); });
    donateHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            document.querySelectorAll('.donate-item').forEach((it) => { if (it !== item)
                it.classList.remove('active'); });
            item === null || item === void 0 ? void 0 : item.classList.toggle('active');
        });
    });
}
//# sourceMappingURL=donate.js.map