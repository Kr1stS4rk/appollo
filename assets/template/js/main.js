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
const adaptiveTexts = document.querySelectorAll('[data-text-desktop]');

// сохраняем mobile-текст
adaptiveTexts.forEach(el => {
  el.dataset.textMobileBase = el.textContent.trim();
});

function getBreakpoint() {
  if (window.matchMedia('(min-width: 1440px)').matches) {
    return 'desktop';
  }
  if (window.matchMedia('(min-width: 768px)').matches) {
    return 'tablet';
  }
  return 'mobile';
}

function updateAdaptiveTexts() {
  const bp = getBreakpoint();

  adaptiveTexts.forEach(el => {
    if (bp === 'desktop') {
      el.textContent = el.dataset.textDesktop;
      return;
    }

    if (bp === 'tablet') {
      // если tablet-текста нет — оставляем mobile
      el.textContent =
        el.dataset.textTablet || el.dataset.textMobileBase;
      return;
    }

    // mobile
    el.textContent = el.dataset.textMobileBase;
  });
}

updateAdaptiveTexts();
window.addEventListener('resize', updateAdaptiveTexts);
