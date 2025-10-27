document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero');
    const heroLink = document.querySelector('.hero--link');
    const video = document.getElementById('heroVideo');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const channelsSection = document.getElementById('channels');

    if (!video) {
        return;
    }

    const scrollToChannels = () => {
        if (!channelsSection) {
            return;
        }
        const behavior = prefersReducedMotion.matches ? 'auto' : 'smooth';
        channelsSection.scrollIntoView({ behavior, block: 'start' });
    };

    const applyMotionPreference = () => {
        if (prefersReducedMotion.matches) {
            video.pause();
            hero?.classList.add('is-paused');
            return;
        }

        const playPromise = video.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Автовоспроизведение может быть заблокировано.
                hero?.classList.add('is-paused');
            });
        }
    };

    video.addEventListener('loadeddata', () => {
        hero?.classList.add('is-loaded');
    });

    video.addEventListener('play', () => {
        hero?.classList.remove('is-paused');
    });

    video.addEventListener('pause', () => {
        hero?.classList.add('is-paused');
    });

    prefersReducedMotion.addEventListener('change', applyMotionPreference);

    heroLink?.addEventListener('click', (event) => {
        event.preventDefault();
        scrollToChannels();
    });

    heroLink?.addEventListener('keydown', (event) => {
        if (event.key !== ' ') {
            return;
        }
        event.preventDefault();
        scrollToChannels();
    });

    applyMotionPreference();
});
