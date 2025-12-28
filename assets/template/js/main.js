document.addEventListener('DOMContentLoaded', function() {
  const header = document.getElementById('site-header');
  let lastScroll = 0;
  let lastBlurScroll = 0;
  let ticking = false;
  
  window.addEventListener('scroll', function() {
    if (!ticking) {
      window.requestAnimationFrame(function() {
        const currentScroll = window.pageYOffset;
        
        // ВЕРСИЯ 1: Показываем header только в самом верху страницы
        if (currentScroll <= 30) { // Если вверху страницы
          header.classList.remove('header_hide');
        } else {
          // Прячем header при скролле вниз, но НЕ показываем при скролле вверх
          if (currentScroll > lastScroll && currentScroll > 100) {
            header.classList.add('header_hide');
          }
          // Показываем header только если скроллим вверх И дошли до самого верха
          // Этот код не будет автоматически показывать header при скролле вверх
        }
        
        // Плавное размытие
        if (currentScroll > 30) {
          if (!header.classList.contains('header_blur') && currentScroll > lastBlurScroll) {
            header.classList.add('header_blur');
          }
        } else {
          header.classList.remove('header_blur');
        }
        
        lastScroll = currentScroll;
        lastBlurScroll = currentScroll;
        ticking = false;
      });
      
      ticking = true;
    }
  });
  
  // Дополнительно: обработчик для кнопки "Наверх" если есть
  document.addEventListener('click', function(e) {
    if (e.target.closest('a[href="#"]') || e.target.closest('a[href^="#top"]')) {
      setTimeout(() => {
        header.classList.remove('header_hide');
        header.classList.remove('header_blur');
      }, 100);
    }
  });
});