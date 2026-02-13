const items = document.querySelectorAll('.grid > div');

const hoverTexts = [
  "Collaboration", "Collaboration", "Sponsor",
  "Child project", "Friendly Project", "Sponsor",
  "Friendly Project", "Sponsor", "Friendly Project",
  "Friendly Project", "Child project", "Friendly Project"
];

items.forEach((item, index) => {
  item.dataset.original = item.textContent;
  item.dataset.hover = hoverTexts[index];
  
  // Создаем контейнер для плавной смены текста
  const textContainer = document.createElement('span');
  textContainer.textContent = item.textContent;
  textContainer.style.transition = 'opacity 0.3s ease';
  textContainer.style.display = 'block';
  textContainer.style.width = '100%';
  textContainer.style.textAlign = 'center';
  
  // Очищаем элемент и добавляем контейнер
  item.innerHTML = '';
  item.appendChild(textContainer);
  
  item.addEventListener('mouseenter', () => {
    // Плавно исчезаем
    textContainer.style.opacity = '0';
    
    setTimeout(() => {
      if (item.matches(':hover')) {
        // Меняем текст и плавно появляемся
        textContainer.textContent = item.dataset.hover;
        textContainer.style.opacity = '1';
      }
    }, 150);
  });

  item.addEventListener('mouseleave', () => {
    // Плавно исчезаем
    textContainer.style.opacity = '0';
    
    setTimeout(() => {
      if (!item.matches(':hover')) {
        // Возвращаем оригинальный текст и плавно появляемся
        textContainer.textContent = item.dataset.original;
        textContainer.style.opacity = '1';
      }
    }, 150);
  });
});

document.querySelector('.yakor').addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});