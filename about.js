document.addEventListener('DOMContentLoaded', () => {
  // ===== ШАПКА: тень при скролле =====
  const header = document.querySelector('.site-header');
  if (header) {
    const toggleHeaderShadow = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 4);
    };
    toggleHeaderShadow();
    window.addEventListener('scroll', toggleHeaderShadow, { passive: true });
  }

  // ===== БУРГЕР-МЕНЮ =====
  const nav = document.querySelector('.main-nav');
  const burger = document.querySelector('.burger');

  if (nav && burger) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('is-open');
      nav.classList.toggle('is-open');
    });
  }
  // ===== Аккордеон для цен (открыта только одна услуга в карточке) =====
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.ps-card').forEach(card => {
    const detailsList = card.querySelectorAll('.ps-item--more details');
    if (!detailsList.length) return;

    detailsList.forEach(dtl => {
      dtl.addEventListener('toggle', () => {
        if (!dtl.open) return; // реагируем только на открытие
        detailsList.forEach(other => {
          if (other !== dtl) other.open = false;
        });
      });
    });
  });
});


  // ===== ДИПЛОМЫ — ЛАЙТБОКС =====
  const diplomaItems = document.querySelectorAll('.diploma-item');
  const lightbox = document.getElementById('diplomaLightbox');
  const lightboxImg = document.getElementById('diplomaLargeImage');
  const lightboxCaption = document.getElementById('diplomaCaption');
  const btnPrev = document.getElementById('diplomaPrev');
  const btnNext = document.getElementById('diplomaNext');
  const btnClose = document.getElementById('diplomaClose');
  const backdrop = document.getElementById('diplomaBackdrop');

  let currentDiplomaIndex = 0;

  if (diplomaItems.length && lightbox && lightboxImg && lightboxCaption) {
    const itemsArray = Array.from(diplomaItems);

    function openLightbox(index) {
      currentDiplomaIndex = index;
      const item = itemsArray[currentDiplomaIndex];
      if (!item) return;

      const href = item.getAttribute('href');
      const caption =
        item.dataset.caption ||
        (item.querySelector('span') ? item.querySelector('span').textContent : '');
      const alt = item.querySelector('img')?.alt || 'Диплом';

      lightboxImg.src = href;
      lightboxImg.alt = alt;
      lightboxCaption.textContent = caption;

      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightboxImg.src = '';
      document.body.style.overflow = '';
    }

    function showNext(step) {
      const total = itemsArray.length;
      currentDiplomaIndex = (currentDiplomaIndex + step + total) % total;
      openLightbox(currentDiplomaIndex);
    }

    // клик по карточке
    itemsArray.forEach((item, index) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(index);
      });
    });

    // кнопки
    btnPrev?.addEventListener('click', () => showNext(-1));
    btnNext?.addEventListener('click', () => showNext(1));
    btnClose?.addEventListener('click', closeLightbox);
    backdrop?.addEventListener('click', closeLightbox);

    // клавиатура
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        showNext(-1);
      } else if (e.key === 'ArrowRight') {
        showNext(1);
      }
    });
  }

  // ===== ПАРАЛЛАКС-TILT для карточки с фото =====
  const tilt = document.querySelector('.tilt-card');
  if (tilt) {
    const max = 10; // градусов
    tilt.addEventListener('mousemove', (e) => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(
        x * max
      ).toFixed(2)}deg)`;
    });
    tilt.addEventListener('mouseleave', () => {
      tilt.style.transform = 'rotateX(0) rotateY(0)';
    });
  }
});
lightbox.addEventListener('click', (e) => {
  // Кликаем только если НЕ нажали на картинку или стрелки
  if (e.target === lightbox || e.target === backdrop) {
    closeLightbox();
  }
});
