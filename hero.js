document.querySelectorAll('.hero').forEach(carousel => {
 
    const track   = carousel.querySelector('.carouselTrack');
    const slides  = Array.from(track.querySelectorAll('.carouselCard'));
    const prevBtn = carousel.querySelector('.prevBtn');
    const nextBtn = carousel.querySelector('.nextBtn');
 
    // Match dots + counter by carousel id
    // e.g. id="carouselHero" → suffix "Hero" → looks for id="dotsHero", id="counterHero"
    const carouselId = carousel.id;
    const suffix     = carouselId.replace('carousel', '');
    const dotsWrap   = document.getElementById('dots'    + suffix);
    const counter    = document.getElementById('counter' + suffix);
 
    let current = 0;
 
    // ── Build dots ──────────────────────────────────────────
    slides.forEach((_, i) => {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
    });
 
    const dots = Array.from(dotsWrap.querySelectorAll('.dot'));
 
    // ── Core navigation ──────────────────────────────────────
    function goTo(index) {
        slides[current].classList.remove('active');
        dots[current].classList.remove('active');
 
        current = (index + slides.length) % slides.length;
 
        slides[current].classList.add('active');
        dots[current].classList.add('active');
 
        updateCounter();
        updateButtons();
    }
 
    function updateCounter() {
        if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }
 
    function updateButtons() {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === slides.length - 1;
    }
 
    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));
 
    // ── Touch / swipe ────────────────────────────────────────
    let touchStartX = 0;
    let touchStartY = 0;
    const SWIPE_THRESHOLD = 40;
 
    track.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
 
    track.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].screenX - touchStartX;
        const dy = e.changedTouches[0].screenY - touchStartY;
 
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
            dx < 0 ? goTo(current + 1) : goTo(current - 1);
        }
    }, { passive: true });
 
    // ── Keyboard accessibility ───────────────────────────────
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft')  goTo(current - 1);
        if (e.key === 'ArrowRight') goTo(current + 1);
    });
 
    // ── Init ─────────────────────────────────────────────────
    updateCounter();
    updateButtons();
});
 