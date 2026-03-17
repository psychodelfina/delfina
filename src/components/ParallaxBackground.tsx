import { useEffect, useRef, useState } from 'preact/hooks';

interface CanvasStar {
  x: number;
  y: number;
  size: number;
  baseOpacity: number;
  isDot: boolean;
  rayLengths: number[];
  rotation: number;
  depth: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

interface CanvasParticle {
  x: number;
  y: number;
  baseOpacity: number;
  depth: number;
  twinkleOffset: number;
  twinkleSpeed: number;
}

function createStars(count: number, size: number, opacity: number, depth: number): CanvasStar[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    size,
    baseOpacity: opacity + (Math.random() * 0.2 - 0.1),
    isDot: Math.random() < 0.3 && size <= 3,
    rayLengths: Array.from({ length: 5 }, () => 6 + Math.random() * 5),
    rotation: Math.random() * Math.PI * 2,
    depth,
    twinkleOffset: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.4 + Math.random() * 0.4,
  }));
}

function createParticles(count: number): CanvasParticle[] {
  return Array.from({ length: count }, () => ({
    x: Math.random(),
    y: Math.random(),
    baseOpacity: 0.3 + Math.random() * 0.4,
    depth: 0.6,
    twinkleOffset: Math.random() * Math.PI * 2,
    twinkleSpeed: 0.4 + Math.random() * 0.4,
  }));
}

export default function ParallaxBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef(0);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const dataRef = useRef<{ stars: CanvasStar[]; particles: CanvasParticle[] } | null>(null);

  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const stars = [
      ...createStars(isMobile ? 10 : 30, 1, 0.3, 0.3),
      ...createStars(isMobile ? 8 : 25, 5, 0.5, 0.5),
      ...createStars(isMobile ? 5 : 15, 7, 0.7, 0.8),
    ];
    const particles = createParticles(isMobile ? 2 : 10);
    dataRef.current = { stars, particles };

    let dpr = 1;

    const resize = () => {
      dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    if (!isMobile) {
      const onMouseMove = (e: MouseEvent) => {
        mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
      };
      window.addEventListener('mousemove', onMouseMove, { passive: true });
      var removeMouseMove = () => window.removeEventListener('mousemove', onMouseMove);
    }

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetInterval = isMobile ? 1000 / 20 : 0;
    let lastFrameTime = 0;

    const drawStar = (x: number, y: number, star: CanvasStar, opacity: number) => {
      if (star.isDot) {
        ctx.beginPath();
        ctx.arc(x, y, star.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${opacity})`;
        ctx.fill();
        return;
      }

      const scale = (star.size * 4) / 24;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(star.rotation);
      ctx.scale(scale, scale);

      ctx.beginPath();
      const inner = 4;
      for (let i = 0; i < 5; i++) {
        const oA = (i * 72 - 90) * (Math.PI / 180);
        const iA = (i * 72 + 36 - 90) * (Math.PI / 180);
        const ox = star.rayLengths[i] * Math.cos(oA);
        const oy = star.rayLengths[i] * Math.sin(oA);
        const ix = inner * Math.cos(iA);
        const iy = inner * Math.sin(iA);
        if (i === 0) ctx.moveTo(ox, oy);
        else ctx.lineTo(ox, oy);
        ctx.lineTo(ix, iy);
      }
      ctx.closePath();
      ctx.fillStyle = `rgba(255,255,255,${opacity})`;
      ctx.fill();
      ctx.restore();
    };

    const animate = (time: number) => {
      rafRef.current = requestAnimationFrame(animate);

      if (targetInterval > 0 && time - lastFrameTime < targetInterval) return;
      lastFrameTime = time;

      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const timeSec = time / 1000;
      const fieldW = w * 1.4;
      const fieldH = h * 1.4;
      const offX = (fieldW - w) * 0.5;
      const offY = (fieldH - h) * 0.5;
      const parallaxScale = w * 0.15;

      if (!isMobile && nebulaRef.current) {
        const nx = mouse.x * 0.2 * parallaxScale * 0.3;
        const ny = mouse.y * 0.2 * parallaxScale * 0.3;
        nebulaRef.current.style.transform = `translate(${nx}px, ${ny}px)`;
      }

      for (const star of stars) {
        const twinkle = reducedMotion
          ? star.baseOpacity
          : star.baseOpacity * (0.3 + 0.7 * ((Math.sin(timeSec * star.twinkleSpeed + star.twinkleOffset) + 1) * 0.5));

        const px = star.x * fieldW - offX + mouse.x * star.depth * parallaxScale;
        const py = star.y * fieldH - offY + mouse.y * star.depth * parallaxScale;
        drawStar(px, py, star, twinkle);
      }

      for (const p of particles) {
        const twinkle = reducedMotion
          ? p.baseOpacity
          : p.baseOpacity * (0.3 + 0.7 * ((Math.sin(timeSec * p.twinkleSpeed + p.twinkleOffset) + 1) * 0.5));

        const px = p.x * fieldW - offX + mouse.x * p.depth * parallaxScale;
        const py = p.y * fieldH - offY + mouse.y * p.depth * parallaxScale;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,45,149,${twinkle})`;
        ctx.fill();
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(rafRef.current);
      } else {
        lastFrameTime = 0;
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
      removeMouseMove?.();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [isMobile]);

  const nb = isMobile
    ? { big: 300, med: 250, sm: 200, bBlur: 40, mBlur: 40, sBlur: 30 }
    : { big: 600, med: 500, sm: 400, bBlur: 150, mBlur: 150, sBlur: 120 };

  return (
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={nebulaRef} class="absolute inset-0" style={{ willChange: 'transform' }}>
        <div
          class="absolute top-1/4 left-1/4 rounded-full bg-neon-pink/10"
          style={{ width: `${nb.big}px`, height: `${nb.big}px`, filter: `blur(${nb.bBlur}px)` }}
        />
        <div
          class="absolute bottom-1/4 right-1/4 rounded-full bg-neon-purple/10"
          style={{ width: `${nb.med}px`, height: `${nb.med}px`, filter: `blur(${nb.mBlur}px)` }}
        />
        <div
          class="absolute top-1/2 left-1/2 rounded-full bg-neon-cyan/5"
          style={{ width: `${nb.sm}px`, height: `${nb.sm}px`, filter: `blur(${nb.sBlur}px)` }}
        />
      </div>
      <canvas ref={canvasRef} class="absolute inset-0" />
    </div>
  );
}
