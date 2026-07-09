import { useEffect } from 'preact/hooks';

export default function ScrollAnimations() {
  useEffect(() => {
    let disposed = false;
    let mm: any = null;
    let scrollTriggerRef: any = null;

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
      scrollTriggerRef?.refresh();
      updateProgress();
    };
    window.addEventListener('bfcache-restore', onBfcacheRestore);

    const desktopMql = window.matchMedia('(min-width: 768px) and (min-height: 501px)');
    let gsapInitStarted = false;

    const initGsap = async () => {
      if (gsapInitStarted || disposed) return;
      gsapInitStarted = true;

      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import('gsap'),
        import('gsap/ScrollTrigger'),
      ]);

      if (disposed) return;

      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.config({ ignoreMobileResize: true });
      scrollTriggerRef = ScrollTrigger;

      mm = gsap.matchMedia();

      mm.add('(min-width: 768px) and (min-height: 501px)', () => {
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
    };

    // Грузим GSAP при первом совпадении desktop-медиазапроса, а не один раз на
    // загрузке. Если окно стартовало узким (или планшет был в portrait) и его
    // растянули до desktop, горизонтальный скролл появится без перезагрузки
    // (LIMIT-01). После инициализации gsap.matchMedia сам реагирует на смену
    // медиа, поэтому слушатель снимает себя.
    const onDesktopChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        desktopMql.removeEventListener('change', onDesktopChange);
        initGsap();
      }
    };

    if (desktopMql.matches) {
      initGsap();
    } else {
      desktopMql.addEventListener('change', onDesktopChange);
    }

    return () => {
      disposed = true;
      mm?.revert();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('bfcache-restore', onBfcacheRestore);
      desktopMql.removeEventListener('change', onDesktopChange);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
