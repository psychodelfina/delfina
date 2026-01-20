import { useEffect, useRef, useState } from 'preact/hooks';

interface Star {
  id: number;
  left: string;
  top: string;
  delay: string;
  size: number;
  opacity: number;
  isDot: boolean;
  rayLengths: number[]; // длины 5 лучей
  rotation: number;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  delay: string;
  opacity: number;
}

// Генерация случайных звёзд
function generateStars(count: number, size: number, opacity: number): Star[] {
  return Array.from({ length: count }, (_, i) => {
    // 30% шанс что это точка, 70% - пятиконечная звезда
    const isDot = (Math.random() < 0.3) && size <= 3;
    
    // Генерируем 5 уникальных длин лучей (от 6 до 11)
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

// Генерация SVG пути для звезды с уникальными длинами лучей
function generateStarPath(rayLengths: number[]): string {
  const cx = 12; // центр X
  const cy = 12; // центр Y
  const innerRadius = 4; // радиус внутренних точек (между лучами)
  
  const points: string[] = [];
  
  for (let i = 0; i < 5; i++) {
    // Угол для внешней точки (вершина луча)
    const outerAngle = (i * 72 - 90) * (Math.PI / 180);
    // Угол для внутренней точки (впадина между лучами)
    const innerAngle = (i * 72 + 36 - 90) * (Math.PI / 180);
    
    // Внешняя точка с индивидуальной длиной луча
    const outerX = cx + rayLengths[i] * Math.cos(outerAngle);
    const outerY = cy + rayLengths[i] * Math.sin(outerAngle);
    
    // Внутренняя точка
    const innerX = cx + innerRadius * Math.cos(innerAngle);
    const innerY = cy + innerRadius * Math.sin(innerAngle);
    
    points.push(`${outerX.toFixed(1)},${outerY.toFixed(1)}`);
    points.push(`${innerX.toFixed(1)},${innerY.toFixed(1)}`);
  }
  
  return `M${points[0]} L${points.slice(1).join(' L')} Z`;
}

// Компонент звезды
function StarElement({ star, key }: { star: Star; key?: number }) {
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
  
  // Генерируем уникальный путь для этой звезды
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

  // Генерируем звёзды один раз при монтировании компонента
  const [starsFar] = useState<Star[]>(() => generateStars(30, 1, 0.3));
  const [starsMedium] = useState<Star[]>(() => generateStars(25, 5, 0.5));
  const [starsClose] = useState<Star[]>(() => generateStars(15, 7, 0.7));
  const [particles] = useState<Particle[]>(() => generateParticles(10));

  useEffect(() => {
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
  }, []);

  return (
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div ref={sceneRef} id="parallax-scene" class="w-full h-full">
        {/* Layer 1: Deep space gradient */}
        <div data-depth="0.1" class="absolute inset-0">
          <div class="w-full h-full bg-gradient-to-b from-bg-dark via-[#0f0820] to-bg-dark" />
        </div>
        
        {/* Layer 2: Nebula effect */}
        <div data-depth="0.2" class="absolute inset-0">
          <div class="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[150px]" />
          <div class="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[150px]" />
          <div class="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[120px]" />
        </div>
        
        {/* Layer 3: Stars far */}
        <div data-depth="0.3" class="absolute inset-0">
          {starsFar.map((star) => (
            <StarElement key={star.id} star={star} />
          ))}
        </div>
        
        {/* Layer 4: Stars medium */}
        <div data-depth="0.5" class="absolute inset-0">
          {starsMedium.map((star) => (
            <StarElement key={star.id} star={star} />
          ))}
        </div>
        
        {/* Layer 5: Stars close */}
        <div data-depth="0.8" class="absolute inset-0">
          {starsClose.map((star) => (
            <StarElement key={star.id} star={star} />
          ))}
        </div>
        
        {/* Layer 6: Floating particles */}
        <div data-depth="0.6" class="absolute inset-0">
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
      
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        
        #parallax-scene > div {
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
}
