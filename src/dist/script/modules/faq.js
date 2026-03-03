export function initFAQ() {
    const faqLink = document.getElementById('faqLink');
    const faqModal = document.getElementById('faqModal');
    const closeFaqModal = document.getElementById('closeFaqModal');
    const faqHeaders = document.querySelectorAll('.faq-header');
    faqLink === null || faqLink === void 0 ? void 0 : faqLink.addEventListener('click', (e) => {
        e.preventDefault();
        faqModal === null || faqModal === void 0 ? void 0 : faqModal.classList.add('active');
    });
    closeFaqModal === null || closeFaqModal === void 0 ? void 0 : closeFaqModal.addEventListener('click', () => faqModal === null || faqModal === void 0 ? void 0 : faqModal.classList.remove('active'));
    faqModal === null || faqModal === void 0 ? void 0 : faqModal.addEventListener('click', (e) => { if (e.target === faqModal)
        faqModal.classList.remove('active'); });
    faqHeaders.forEach((header) => {
        header.addEventListener('click', () => {
            const faqItem = header.parentElement;
            document.querySelectorAll('.faq-item').forEach((item) => {
                if (item !== faqItem)
                    item.classList.remove('active');
            });
            faqItem === null || faqItem === void 0 ? void 0 : faqItem.classList.toggle('active');
        });
    });
}
//# sourceMappingURL=faq.js.map