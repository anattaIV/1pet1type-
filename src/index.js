const yakor = document.querySelector('.yakor');
const header = document.getElementById('top-header');

yakor.addEventListener('click', () => {
    header.scrollIntoView({ behavior: 'smooth' });
});
