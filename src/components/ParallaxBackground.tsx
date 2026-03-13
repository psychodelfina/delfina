import { useEffect, useRef, useState } from 'preact/hooks';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: string;
  size: number;
  opacity: number;
  isDot: boolean;
  rayLengths: number[];
  rotation: number;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  delay: string;
  opacity: number;
}

function generateStars(count: number, size: number, opacity: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    const isDot = (Math.random() < 0.3) && size <= 3;
    const rayLengths = Array.from({ length: 5 }, () => 6 + Math.random() * 5);
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      size,
      opacity: opacity + (Math.random() * 0.2 - 0.1),
      isDot,
      rayLengths,
      rotation: Math.random() * 360,
    };
  });
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`,
    opacity: 0.3 + Math.random() * 0.4,
  }));
}

function generateStarPath(rayLengths: number[]): string {
  const cx = 12;
  const cy = 12;
  const innerRadius = 4;
  const points: string[] = [];

  for (let i = 0; i < 5; i++) {
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    const innerAngle = (i * 72 + 36 - 90) * (Math.PI / 180);
    const outerX = cx + rayLengths[i] * Math.cos(outerAngle);
    const outerY = cy + rayLengths[i] * Math.sin(outerAngle);
    const innerX = cx + innerRadius * Math.cos(innerAngle);
    const innerY = cy + innerRadius * Math.sin(innerAngle);
    points.push(`${outerX.toFixed(1)},${outerY.toFixed(1)}`);
    points.push(`${innerX.toFixed(1)},${innerY.toFixed(1)}`);
  }

  return `M${points[0]} L${points.slice(1).join(' L')} Z`;
}

function StarElement({ star }: { star: Star; key?: number }) {
  const baseSize = star.size * (star.isDot ? 1 : 4);

  if (star.isDot) {
    return (
      <span
        class="star absolute bg-white rounded-full animate-twinkle"
        style={{
          left: star.left,
          top: star.top,
          width: `${star.size}px`,
          height: `${star.size}px`,
          opacity: star.opacity,
          animationDelay: star.delay,
        }}
      />
    );
  }

  const starPath = generateStarPath(star.rayLengths);

  return (
    <svg
      class="star absolute animate-twinkle"
      style={{
        left: star.left,
        top: star.top,
        width: `${baseSize}px`,
        height: `${baseSize}px`,
        opacity: star.opacity,
        animationDelay: star.delay,
        transform: `rotate(${star.rotation}deg)`,
      }}
      viewBox="0 0 24 24"
      fill="white"
    >
      <path d={starPath} />
    </svg>
  );
}

export default function ParallaxBackground() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<any>(null);

  const [isMobile] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768
  );

  const [starsFar] = useState<Star[]>(() => generateStars(isMobile ? 15 : 30, 1, 0.3));
  const [starsMedium] = useState<Star[]>(() => generateStars(isMobile ? 12 : 25, 5, 0.5));
  const [starsClose] = useState<Star[]>(() => generateStars(isMobile ? 8 : 15, 7, 0.7));
  const [particles] = useState<Particle[]>(() => generateParticles(isMobile ? 4 : 10));

  useEffect(() => {
    if (isMobile) return;

    const initParallax = async () => {
      if (sceneRef.current && typeof window !== 'undefined') {
        // @ts-ignore
        const Parallax = (await import('parallax-js')).default;
        parallaxRef.current = new Parallax(sceneRef.current, {
          relativeInput: true,
          hoverOnly: false,
          pointerEvents: false,
          scalarX: 15,
          scalarY: 15,
          frictionX: 0.1,
          frictionY: 0.1,
        });
      }
    };

    initParallax();

    return () => {
      if (parallaxRef.current) {
        parallaxRef.current.destroy();
      }
    };
  }, [isMobile]);

  const fieldStyle = {
    position: 'absolute' as const,
    width: '140%',
    height: '140%',
    minWidth: '1400px',
    minHeight: '1000px',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={sceneRef} id="parallax-scene" class="w-full h-full">
        {/* Layer 1: Deep space gradient */}
        <div data-depth="0.1" class="absolute inset-0">
          <div style={fieldStyle}>
            <div class="w-full h-full bg-gradient-to-b from-bg-dark via-[#0f0820] to-bg-dark" />
          </div>
        </div>
        
        {/* Layer 2: Nebula effect */}
        <div data-depth="0.2" class="absolute inset-0">
          <div style={fieldStyle}>
            <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[150px]" />
            <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px]" />
            <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />
          </div>
        </div>
        
        {/* Layer 3: Stars far */}
        <div data-depth="0.3" class="absolute inset-0">
          <div style={fieldStyle}>
            {starsFar.map((star) => (
              <StarElement key={star.id} star={star} />
            ))}
          </div>
        </div>
        
        {/* Layer 4: Stars medium */}
        <div data-depth="0.5" class="absolute inset-0">
          <div style={fieldStyle}>
            {starsMedium.map((star) => (
              <StarElement key={star.id} star={star} />
            ))}
          </div>
        </div>
        
        {/* Layer 5: Stars close */}
        <div data-depth="0.8" class="absolute inset-0">
          <div style={fieldStyle}>
            {starsClose.map((star) => (
              <StarElement key={star.id} star={star} />
            ))}
          </div>
        </div>
        
        {/* Layer 6: Floating particles */}
        <div data-depth="0.6" class="absolute inset-0">
          <div style={fieldStyle}>
            {particles.map((particle) => (
              <span
                key={particle.id}
                class="particle absolute w-1 h-1 bg-neon-pink rounded-full animate-twinkle"
                style={{
                  left: particle.left,
                  top: particle.top,
                  opacity: particle.opacity,
                  animationDelay: particle.delay,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      <style>{`
        #parallax-scene > div {
          width: 100% !important;
          height: 100% !important;
        }
        @media (max-width: 767px) {
          .star, .particle {
            animation-name: twinkle-light !important;
          }
          @keyframes twinkle-light {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        }
      `}</style>
    </div>
  );
}
