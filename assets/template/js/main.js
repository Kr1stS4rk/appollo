
const langItem = document.querySelector('.menu__item-sub');
const langBtn = langItem.querySelector('.lang-btn');
const langMenu = langItem.querySelector('.lang-menu');
const currentLang = langItem.querySelector('.lang-current');

// Открыть / закрыть меню
langBtn.addEventListener('click', (e) => {
  e.stopPropagation(); // чтобы не закрывалось сразу
  const expanded = langBtn.getAttribute('aria-expanded') === 'true';
  langBtn.setAttribute('aria-expanded', String(!expanded));
  langMenu.hidden = expanded; // скрываем/показываем
  langMenu.style.visibility = expanded ? 'hidden' : 'visible';
  langMenu.style.opacity = expanded ? '0' : '1';
});

// Выбор языка
langMenu.addEventListener('click', (e) => {
  if (e.target.tagName === 'LI' && !e.target.classList.contains('is-active')) {
    // Меняем активный пункт
    langMenu.querySelector('.is-active').classList.remove('is-active');
    e.target.classList.add('is-active');

    // Меняем текст кнопки
    currentLang.textContent = e.target.textContent;

    // Закрываем меню
    langBtn.setAttribute('aria-expanded', 'false');
    langMenu.hidden = true;
    langMenu.style.visibility = 'hidden';
    langMenu.style.opacity = '0';
  }
});

// Закрытие при клике вне меню
document.addEventListener('click', (e) => {
  if (!langItem.contains(e.target)) {
    langBtn.setAttribute('aria-expanded', 'false');
    langMenu.hidden = true;
    langMenu.style.visibility = 'hidden';
    langMenu.style.opacity = '0';
  }
});

