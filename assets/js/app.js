document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const video = document.getElementById('heroVideo');
    const control = document.getElementById('heroControl');
    const cta = document.querySelector('.hero--cta');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let userPaused = false;

    const setControlIcon = (isPaused) => {
        if (!control) {
            return;
        }
        const icon = control.querySelector('path');
        if (!icon) {
            return;
        }
        if (isPaused) {
            icon.setAttribute('d', 'M6 4l10 6-10 6V4z');
            control.setAttribute('aria-label', 'Запустить видео');
        } else {
            icon.setAttribute('d', 'M7 4h2v12H7zm4 0h2v12h-2z');
            control.setAttribute('aria-label', 'Поставить видео на паузу');
        }
    };

    const pauseVideo = () => {
        if (!video) return;
        video.pause();
        hero?.classList.add('is-paused');
        setControlIcon(true);
    };

    const playVideo = () => {
        if (!video) return;
        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay might be blocked; keep state paused.
                hero?.classList.add('is-paused');
                setControlIcon(true);
            });
        }
        hero?.classList.remove('is-paused');
        setControlIcon(false);
    };

    control?.addEventListener('click', () => {
        if (!video) return;
        if (video.paused) {
            playVideo();
            userPaused = false;
        } else {
            pauseVideo();
            userPaused = true;
        }
    });

    const handleMotionPreference = (event) => {
        if (event.matches) {
            pauseVideo();
        } else if (!userPaused) {
            playVideo();
        }
    };

    if (prefersReducedMotion.matches) {
        pauseVideo();
    } else {
        setControlIcon(false);
    }
    prefersReducedMotion.addEventListener('change', handleMotionPreference);

    video?.addEventListener('loadeddata', () => {
        hero?.classList.add('is-loaded');
    });

    cta?.addEventListener('click', (event) => {
        const targetId = cta.getAttribute('href');
        if (!targetId || !targetId.startsWith('#')) {
            return;
        }
        const target = document.querySelector(targetId);
        if (!target) {
            return;
        }
        event.preventDefault();
        const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
        target.scrollIntoView({ behavior, block: 'start' });
    });

    if (prefersReducedMotion.matches) {
        setControlIcon(true);
    } else {
        setControlIcon(video?.paused ?? false);
    }
});
