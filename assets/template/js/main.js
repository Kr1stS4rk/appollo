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
// Инициализация Swiper

const swiper = new Swiper(".swiper", {
  effect:'coverflow',
  slidesPerView: "auto",
  centeredSlides: true,
  coverflowEffect: {
    rotate: 0,
    stretch: 0,
    depth: 100,
    modifier: 1,
    slideShadows: false,
  },
  // чтобы при отрицательном spaceBetween “пятёрка” не уезжала вправо/влево на старте
  centerInsufficientSlides: true,
watchSlidesProgress: true,
  loop: true,
  // мягко помогает не ловить пустоты на некоторых ширинах, без “глюков”

  // 3-й слайд активный при открытии (0-based индекс)


  grabCursor: true,
 
  speed: 600,
slidesOffsetBefore: 0,
  slidesOffsetAfter: 20,
  spaceBetween: -42,

  pagination: {
    el: ".swiper-pagination",
    clickable: true
  },

  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev"
  },

  breakpoints: {
    768: { spaceBetween: -70, centerInsufficientSlides: true },
    1440:{ spaceBetween: -84, centerInsufficientSlides: true,  slidesPerView: "auto", }
  },

 
});
document.addEventListener('DOMContentLoaded', function () {
  var videoWrapper = document.querySelector('.guide__video');
  if (videoWrapper === null) return;

  var video = videoWrapper.querySelector('.guide__video-card');
  var overlay = videoWrapper.querySelector('.video__overlay');
  var playButton = videoWrapper.querySelector('.guide__video-play'); 
  
  if (video === null || overlay === null || playButton === null) return;

  var source = video.querySelector('source');
  if (source === null) return;

  function setPosterByBreakpoint() {
    var width = window.innerWidth;
    var poster = videoWrapper.getAttribute('data-poster');

    if (width >= 1440) {
      poster = videoWrapper.getAttribute('data-poster-1440') || poster;
    } else if (width >= 768) {
      poster = videoWrapper.getAttribute('data-poster-768') || poster;
    }

    if (poster) {
      video.setAttribute('poster', poster);
      video.poster = poster;
    }
  }

  // Функция для клика на ЛЮБУЮ часть видео
  function handleVideoClick(e) {
    e.stopPropagation();
    
    // Если видео еще не загружено
    if (!source.getAttribute('src')) {
      var src = source.getAttribute('data-src');
      if (src) {
        source.setAttribute('src', src);
        video.load();
        
        video.addEventListener('canplay', function() {
          video.play();
        }, { once: true });
        return;
      }
    }
    
    // Переключаем пауза/воспроизведение
    if (video.paused || video.ended) {
      video.play();
    } else {
      video.pause();
    }
  }

  // Вешаем обработчики на ВСЕ элементы видео
  overlay.addEventListener('click', handleVideoClick);
  video.addEventListener('click', handleVideoClick);
  playButton.addEventListener('click', handleVideoClick);

  // Когда видео играет - ПРЯЧЕМ оверлей и кнопку
  video.addEventListener('play', function() {
    overlay.style.display = 'none';
    playButton.style.display = 'none';
    video.removeAttribute('poster');
  });

  // Когда видео на паузе - ПОКАЗЫВАЕМ оверлей и кнопку
  video.addEventListener('pause', function() {
    overlay.style.display = 'block';
    playButton.style.display = 'flex';
  });

  // Когда видео закончилось - ПОКАЗЫВАЕМ оверлей и кнопку
  video.addEventListener('ended', function() {
    overlay.style.display = 'block';
    playButton.style.display = 'flex';
  });

  // Инициализация
  setPosterByBreakpoint();
  window.addEventListener('resize', setPosterByBreakpoint);
  
  // Устанавливаем начальное состояние
  if (video.paused || video.ended) {
    overlay.style.display = 'block';
    playButton.style.display = 'flex';
  } else {
    overlay.style.display = 'none';
    playButton.style.display = 'none';
  }
});

const cards = document.querySelectorAll(".card")
const dotsContainer = document.querySelector(".dots")

let active = 1

/* --- create dots --- */
cards.forEach((_,i)=>{
  const dot = document.createElement("span")
  dot.className="dot"
  dot.onclick = ()=> {
    active = i
    update()
  }
  dotsContainer.appendChild(dot)
})

const dots = document.querySelectorAll(".dot")

/* --- coverflow logic --- */
function update(){
  // Всегда показываем 3 карточки: активную и две соседние
  cards.forEach((card,i)=>{
    // Рассчитываем смещение с учетом бесконечной прокрутки
    let offset = i - active
    
    // Если offset слишком большой, корректируем для бесконечности
    if (offset < -1) offset += cards.length
    if (offset > 1) offset -= cards.length
    
    // Показываем только карточки в пределах ±1 от активной
    if (Math.abs(offset) > 1) {
      card.style.opacity = "0"
      card.style.visibility = "hidden"
      return
    }
    
    card.style.visibility = "visible"

    let abs = Math.abs(offset)
    let scale = 1 - abs * 0.15
    let rotateY = offset * -35
    let zIndex = 100 - abs
    let opacity = 1 - abs * 0.3
    
    // Смещение в процентах от ширины контейнера слайдера
    // slider width = 1200px, card width = 900px
    // Чтобы карточки были наполовину перекрыты, смещаем на 75% ширины слайдера
    // (900px / 1200px = 0.75 = 75%)
    let translateXPercent = offset * 50; // 75% от ширины слайдера

    card.style.transform = `
      translate(-50%,-50%)
      translateX(${translateXPercent}%)
      rotateY(${rotateY}deg)
      scale(${scale})
    `

    card.style.zIndex = zIndex
    card.style.opacity = opacity
  })

  dots.forEach((dot,i)=>{
    dot.classList.toggle("active", i === active)
  })
}

// Инициализация для отображения 3 карточек при загрузке
update()

/* --- click cards --- */
cards.forEach((card,i)=>{
  card.addEventListener("click",()=>{
    active = i
    update()
  })
})

/* --- добавление кнопок навигации --- */
const prevBtn = document.querySelector(".swiper-button-prev")
const nextBtn = document.querySelector(".swiper-button-next")

if (prevBtn) {
  prevBtn.onclick = () => {
    active--
    if (active < 0) active = cards.length - 1
    update()
  }
}

if (nextBtn) {
  nextBtn.onclick = () => {
    active++
    if (active >= cards.length) active = 0
    update()
  }
}

/* --- добавление обработчиков для точек --- */
dots.forEach((dot, i) => {
  dot.addEventListener("click", () => {
    active = i
    update()
  })
})