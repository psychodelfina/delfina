import { useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();

    mm.add('(min-width: 768px)', () => {
      document.querySelectorAll('[data-scroll-float]').forEach((el) => {
        const speed = parseFloat((el as HTMLElement).dataset.scrollFloat || '0.5');
        gsap.to(el, {
          yPercent: speed * 100,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        });
      });

      document.querySelectorAll<HTMLElement>('[data-horizontal-scroll]').forEach((section) => {
        const track = section.querySelector<HTMLElement>('[data-horizontal-track]');
        if (!track) return;

        const getScrollAmount = () => track.scrollWidth - track.clientWidth;

        if (getScrollAmount() <= 0) return;

        gsap.to(track, {
          x: () => -getScrollAmount(),
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: () => `+=${getScrollAmount()}`,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        });
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    });

    const progressBar = document.querySelector<HTMLElement>('[data-scroll-progress]');
    let rafId = 0;

    const updateProgress = () => {
      if (!progressBar) return;
      const scrollTop = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      progressBar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateProgress);
    };

    let resizeObserver: ResizeObserver | null = null;
    if (progressBar) {
      window.addEventListener('scroll', onScroll, { passive: true });
      resizeObserver = new ResizeObserver(updateProgress);
      resizeObserver.observe(document.body);
      updateProgress();
    }

    const onBfcacheRestore = () => {
      ScrollTrigger.refresh();
      updateProgress();
    };
    window.addEventListener('bfcache-restore', onBfcacheRestore);

    return () => {
      mm.revert();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('bfcache-restore', onBfcacheRestore);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
