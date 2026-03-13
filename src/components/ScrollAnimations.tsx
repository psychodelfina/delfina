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

    return () => {
      mm.revert();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
