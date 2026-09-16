function buildSlide(row, index) {
  const [imageCell, captionCell] = [...row.children];

  const figure = document.createElement('figure');
  figure.className = 'carousel-slide';
  if (index === 0) figure.classList.add('is-active');

  const picture = imageCell?.querySelector('picture');
  if (picture) figure.append(picture);

  const captionText = captionCell?.textContent.trim();
  if (captionText) {
    const figcaption = document.createElement('figcaption');
    figcaption.textContent = captionText;
    figure.append(figcaption);
  }

  return figure;
}

export default function decorate(block) {
  const autoplay = block.dataset.autoplay || '5000';
  const slides = [...block.children].map(buildSlide);

  block.textContent = '';

  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'carousel-btn prev';
  prevBtn.setAttribute('aria-label', 'Previous image');
  prevBtn.innerHTML = '&lsaquo;';

  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'carousel-btn next';
  nextBtn.setAttribute('aria-label', 'Next image');
  nextBtn.innerHTML = '&rsaquo;';

  const track = document.createElement('div');
  track.className = 'carousel-track';
  track.append(...slides);

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 'carousel-dots';
  dotsWrap.setAttribute('role', 'tablist');
  dotsWrap.setAttribute('aria-label', 'Carousel navigation');
  const dots = slides.map((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'carousel-dot';
    if (index === 0) dot.classList.add('is-active');
    dot.setAttribute('aria-label', `Go to image ${index + 1}`);
    dotsWrap.append(dot);
    return dot;
  });

  block.append(prevBtn, track, nextBtn, dotsWrap);

  let current = 0;
  let timer = null;

  const goTo = (index) => {
    if (!slides.length) return;
    const next = (index + slides.length) % slides.length;
    slides[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    slides[next].classList.add('is-active');
    dots[next].classList.add('is-active');
    current = next;
  };

  const resetAutoplay = () => {
    if (timer) clearInterval(timer);
    const delay = parseInt(autoplay, 10);
    if (!Number.isNaN(delay) && delay > 0) {
      timer = setInterval(() => goTo(current + 1), delay);
    }
  };

  prevBtn.addEventListener('click', () => { goTo(current - 1); resetAutoplay(); });
  nextBtn.addEventListener('click', () => { goTo(current + 1); resetAutoplay(); });
  dots.forEach((dot, index) => dot.addEventListener('click', () => { goTo(index); resetAutoplay(); }));
  block.addEventListener('mouseenter', () => { if (timer) clearInterval(timer); });
  block.addEventListener('mouseleave', resetAutoplay);

  resetAutoplay();
}
