/* Local presentation only. No storage, uploads, analytics or network calls. */
(() => {
  'use strict';
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.querySelector('#folder-film');
  if (video) {
    video.muted = true;
    // Reduced-motion and data-saving visitors get the poster and native Play control.
    if (!motion.matches && !navigator.connection?.saveData) {
      video.play().catch(() => { /* Browser autoplay policy leaves native controls available. */ });
    }
    motion.addEventListener('change', () => { if (motion.matches) video.pause(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) video.pause(); });
  }
  const track = document.querySelector('.preview-track');
  if (!track) return;
  const slides = [...track.querySelectorAll('.preview-page')];
  const prev = document.querySelector('[data-preview-prev]');
  const next = document.querySelector('[data-preview-next]');
  const count = document.querySelector('[data-preview-count]');
  const slider = document.querySelector('#preview-slider');
  let current = 0;
  slider.max = String(slides.length);
  function update() {
    current = Math.max(0, Math.min(slides.length - 1, Math.round(track.scrollLeft / track.clientWidth)));
    count.textContent = `${current + 1} / ${slides.length}`;
    slider.value = String(current + 1);
    slider.setAttribute('aria-valuetext', `${current + 1} of ${slides.length}: ${slides[current].dataset.title}`);
    prev.disabled = current === 0; next.disabled = current === slides.length - 1;
  }
  function go(index, animate = true) {
    const bounded = Math.max(0, Math.min(slides.length - 1, index));
    track.scrollTo({left: bounded * track.clientWidth, behavior: animate && !motion.matches ? 'smooth' : 'instant'});
  }
  prev.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  slider.addEventListener('input', () => go(Number(slider.value) - 1, false));
  track.addEventListener('scroll', update, {passive: true});
  track.addEventListener('keydown', event => {
    if (event.target !== track) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      event.preventDefault(); go(current + (event.key === 'ArrowRight' ? 1 : -1));
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault(); go(event.key === 'Home' ? 0 : slides.length - 1);
    }
  });
  let width = track.clientWidth;
  new ResizeObserver(() => {
    if (width !== track.clientWidth) {width = track.clientWidth;go(current, false);}
  }).observe(track);
  update();
})();
