import { useEffect } from 'preact/hooks';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollAnimations() {
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });

    const mm = gsap.matchMedia();
    const contentWrapper = document.querySelector('.overflow-x-hidden');
    const ctx = gsap.context(() => {

      // =====================================================================
      // HERO SECTION — parallax text layers on scroll (starts later)
      // =====================================================================
      const heroHeading = document.querySelector('#hero h1');
      const heroTagline = document.querySelector('#hero .text-neon-cyan');
      const heroDescription = document.querySelector('#hero [itemprop="description"]');
      const heroButtons = document.querySelector('#hero .flex.gap-4');
      const heroImage = document.querySelector('#hero .parallax-image');

      if (heroHeading) {
        gsap.to(heroHeading, {
          yPercent: -30,
          opacity: 0.3,
          scrollTrigger: {
            trigger: '#hero',
            start: '40% top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
      if (heroTagline) {
        gsap.to(heroTagline, {
          yPercent: -20,
          opacity: 0,
          scrollTrigger: {
            trigger: '#hero',
            start: '50% top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
      if (heroDescription) {
        gsap.to(heroDescription, {
          yPercent: -15,
          opacity: 0,
          scrollTrigger: {
            trigger: '#hero',
            start: '55% top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
      if (heroButtons) {
        gsap.to(heroButtons, {
          yPercent: -10,
          opacity: 0,
          scrollTrigger: {
            trigger: '#hero',
            start: '55% top',
            end: 'bottom top',
            scrub: 0.5,
          },
        });
      }
      if (heroImage) {
        gsap.to(heroImage, {
          yPercent: 10,
          scale: 0.95,
          scrollTrigger: {
            trigger: '#hero',
            start: '30% top',
            end: 'bottom top',
            scrub: 0.3,
          },
        });
      }

      // =====================================================================
      // SECTION HEADINGS — reveal
      // =====================================================================
      document.querySelectorAll('[data-scroll-heading]').forEach((heading) => {
        gsap.from(heading, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: heading,
            start: 'top 90%',
            once: true,
          },
        });
      });

      document.querySelectorAll('[data-scroll-subtitle]').forEach((sub) => {
        gsap.from(sub, {
          y: 20,
          opacity: 0,
          duration: 0.6,
          delay: 0.1,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: sub,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // =====================================================================
      // PORTFOLIO — smooth staggered fade-in, GPU-composited
      // =====================================================================
      const portfolioItems = document.querySelectorAll('[data-scroll-portfolio]');
      if (portfolioItems.length) {
        gsap.from(portfolioItems, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: '#portfolio .grid',
            start: 'top 85%',
            once: true,
          },
        });
      }

      // =====================================================================
      // CERTIFICATES — GPU-accelerated, once: true to avoid reverse recalc
      // =====================================================================
      document.querySelectorAll('[data-scroll-cert]').forEach((item, i) => {
        const fromLeft = i % 2 === 0;
        gsap.from(item, {
          x: fromLeft ? -60 : 60,
          opacity: 0,
          duration: 0.7,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: item,
            start: 'top 95%',
            once: true,
          },
        });
      });

      const certCta = document.querySelector('[data-scroll-cert-cta]');
      if (certCta) {
        gsap.from(certCta, {
          y: 40,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: certCta,
            start: 'top 95%',
            once: true,
          },
        });
      }

      // =====================================================================
      // FAQ — cascade from left with stagger
      // =====================================================================
      const faqItems = document.querySelectorAll('[data-scroll-faq]');
      if (faqItems.length) {
        gsap.from(faqItems, {
          x: -60,
          opacity: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: 'power2.out',
          force3D: true,
          scrollTrigger: {
            trigger: '#faq-list',
            start: 'top 85%',
            once: true,
          },
        });
      }

      // =====================================================================
      // CONTACTS — each card animates individually, once: true
      // =====================================================================
      document.querySelectorAll('[data-scroll-contact]').forEach((card, i) => {
        gsap.from(card, {
          y: 40,
          opacity: 0,
          duration: 0.7,
          delay: i * 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 95%',
            once: true,
          },
        });
      });

      const mainCta = document.querySelector('[data-scroll-cta]');
      if (mainCta) {
        gsap.from(mainCta, {
          y: 50,
          opacity: 0,
          scale: 0.95,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: mainCta,
            start: 'top 95%',
            once: true,
          },
        });
      }

      // =====================================================================
      // FLOATING PARALLAX — subtle movement on scroll for decorative elements
      // =====================================================================
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

      // =====================================================================
      // SCROLL PROGRESS BAR
      // =====================================================================
      // =====================================================================
      // ACCESSIBILITY — respect prefers-reduced-motion
      // =====================================================================
      mm.add('(prefers-reduced-motion: reduce)', () => {
        ScrollTrigger.getAll().forEach((st) => st.kill());
      });
    });

    // =====================================================================
    // SCROLL PROGRESS BAR (native events — reliable with dynamic height)
    // =====================================================================
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
      ctx.revert();
      mm.revert();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
      resizeObserver?.disconnect();
    };
  }, []);

  return null;
}
