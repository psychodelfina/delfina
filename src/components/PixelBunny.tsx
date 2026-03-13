import { useEffect, useRef } from 'preact/hooks';

// =============================================================================
// НАСТРОЙКИ ЗАЙЦА (можно изменять для настройки поведения)
// =============================================================================

/** Размер одного "пикселя" спрайта в реальных пикселях экрана */
const PIXEL_SIZE = 4;

/** Размер спрайта в "пикселях" (32x32) */
const SPRITE_SIZE = 32;

/** Итоговый размер зайца на экране (PIXEL_SIZE * SPRITE_SIZE) */
const BUNNY_SIZE = PIXEL_SIZE * SPRITE_SIZE;

/** Базовая скорость перемещения зайца */
const SPEED = 0.5;

/** Расстояние (в пикселях), на котором заяц начинает убегать от курсора */
const FLEE_DISTANCE = 150;

/** Скорость убегания от курсора (должна быть выше базовой скорости) */
const FLEE_SPEED = 5;

/** Вероятность того, что заяц проявит смелость и НЕ убежит при клике (0.0 - 1.0) */
const BRAVERY_CHANCE_CLICK = 0.10;

/** Вероятность того, что заяц проявит смелость и НЕ убежит при приближении курсора (90%) */
const BRAVERY_CHANCE = 0.80;

/** Минимальное время бега (в кадрах) перед возможной остановкой */
const MIN_RUN_TIME = 300;

/** Дополнительное случайное время бега (0 - MAX_RUN_TIME_BONUS кадров) */
const MAX_RUN_TIME_BONUS = 200;

/** Вероятность начать есть после остановки (0.0 - 1.0) */
const EAT_CHANCE = 0.4;

/** Продолжительность поедания морковки (в кадрах, ~60 = 1 секунда) */
const EATING_DURATION = 120;

/** Вероятность смены направления каждый кадр (0.0 - 1.0) */
const DIRECTION_CHANGE_CHANCE = 0.01;

/** Минимальное время простоя (idle) перед началом бега (в кадрах) */
const MIN_IDLE_TIME = 60;

/** Дополнительное случайное время простоя (в кадрах) */
const MAX_IDLE_TIME_BONUS = 60;

/** Насколько заяц может выбегать за границу экрана по горизонтали */
const X_OUT_BOUNDS = 100;

/** Отступ от верхней и нижней границ экрана */
const BOUNDARY_PADDING = 20;

/** Скорость анимации бега (чем больше значение, тем медленнее) */
const RUN_ANIMATION_SPEED = 22;

/** Скорость анимации жевания (чем больше значение, тем медленнее) */
const EAT_ANIMATION_SPEED = 26;

// =============================================================================
// СПРАЙТЫ ЗАЙЦА
// =============================================================================

/**
 * Цветовая палитра спрайтов:
 * 0 = прозрачный
 * 1 = белый (основной цвет)
 * 2 = розовый (внутренняя часть ушей)
 * 3 = черный (глаза и нос)
 * 4 = оранжевый (морковка)
 * 5 = зеленый (ботва морковки)
 * 6 = тёмный контур
 * 7 = синий (слёзы)
 */

/**
 * Вспомогательная функция для выравнивания спрайтов до размера 32x32.
 * Спрайт выравнивается по нижнему краю и центрируется горизонтально.
 */
const padSprite = (sprite: number[][], targetSize: number = 32): number[][] => {
  const height = sprite.length;
  const width = sprite[0].length;
  const padTop = targetSize - height; // Выравнивание по нижнему краю
  const padLeft = Math.floor((targetSize - width) / 2); // Центрирование по горизонтали
  
  const newSprite: number[][] = Array(targetSize).fill(null).map(() => Array(targetSize).fill(0));
  
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (r + padTop < targetSize && c + padLeft < targetSize) {
        newSprite[r + padTop][c + padLeft] = sprite[r][c];
      }
    }
  }
  return newSprite;
};

// Заяц фронтально - плачет (пойман)
const _bunnyFrontCry = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,7,3,1,1,1,1,3,7,1,1,0,0],
  [0,0,1,1,7,1,1,1,1,1,1,7,1,1,0,0],
  [0,0,1,1,1,1,3,1,1,3,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,3,3,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyFrontCry = padSprite(_bunnyFrontCry);

// Заяц фронтально (стоит/жуёт) - 16x16 пикселей (исходный)
const _bunnyFront = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,3,1,1,1,1,3,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,3,3,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyFront = padSprite(_bunnyFront);

// Заяц жуёт морковку - фронтально (кадр 1)
const _bunnyEating1 = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,3,1,1,1,1,3,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,3,3,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,4,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,4,5,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,5,5],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,5],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyEating1 = padSprite(_bunnyEating1);

// Заяц жуёт морковку - фронтально (кадр 2)
const _bunnyEating2 = [
  [0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,0,0,1,1,1,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,1,2,1,1,0,0,1,1,2,1,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,1,1,1,3,1,1,1,1,3,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0],
  [0,0,0,1,1,1,1,3,3,1,1,1,1,4,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,4,4,4,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,4,5,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,5,5],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,5],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyEating2 = padSprite(_bunnyEating2);

// Заяц бежит вправо - профиль (кадр 1: вытянут)
const _bunnyRunRight1 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,1,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0],
  [0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyRunRight1 = padSprite(_bunnyRunRight1);

// Заяц бежит вправо - профиль (кадр 2: сгруппирован)
const _bunnyRunRight2 = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,1,2,1,0,1,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,2,1,1,1,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,1,1,1,1,1,1,1,1,1,3,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
  [0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0],
  [0,0,1,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
  [0,0,0,1,1,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0],
  [0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
const bunnyRunRight2 = padSprite(_bunnyRunRight2);

/**
 * Цвета для рисования пикселей спрайтов.
 * Ключ - код цвета из спрайта, значение - CSS-цвет.
 */
const colors: Record<number, string> = {
  0: 'transparent',    // Прозрачный пиксель
  1: '#ffffff',        // Белый - основной цвет тела
  2: '#ffb6c1',        // Розовый - внутренняя часть ушей
  3: '#000000',        // Черный - глаза и нос
  4: '#ff6b35',        // Оранжевый - морковка
  5: '#228b22',        // Зеленый - ботва морковки
  6: '#2a1636',        // Тёмный контур (лучше читается на фоне сайта)
  7: '#02B7FF',        // Синий - слёзы
};

// =============================================================================
// ТИПЫ
// =============================================================================

/** Целевая частота кадров для нормализации delta-time (60 FPS) */
const TARGET_FRAME_MS = 1000 / 60;

/** Возможные состояния зайца */
type BunnyState = 'idle' | 'running' | 'eating' | 'caught';

/** Интерфейс позиции и состояния зайца */
interface BunnyPosition {
  x: number;              // X-координата
  y: number;              // Y-координата
  vx: number;             // Скорость по X
  vy: number;             // Скорость по Y
  state: BunnyState;      // Текущее состояние
  direction: 'left' | 'right'; // Направление взгляда
  frame: number;          // Счётчик кадров для анимации
  stateTimer: number;     // Таймер текущего состояния
  eatingTimer: number;    // Таймер поедания морковки
  isBrave: boolean;       // Флаг смелости (не убегает)
  braveryCheckDone: boolean; // Флаг, что проверка смелости уже сделана
  nextRunThreshold: number;   // Предвычисленный порог для остановки бега
  nextIdleThreshold: number;  // Предвычисленный порог для начала бега из idle
}

// =============================================================================
// КЭШИРОВАНИЕ СПРАЙТОВ В OFFSCREEN CANVAS
// =============================================================================

type SpriteKey = string;
const spriteCache = new Map<SpriteKey, HTMLCanvasElement>();

function renderSpriteToCanvas(sprite: number[][], flipX: boolean): HTMLCanvasElement {
  const key: SpriteKey = `${sprite === bunnyFrontCry ? 'cry' : sprite === bunnyFront ? 'front' : sprite === bunnyEating1 ? 'eat1' : sprite === bunnyEating2 ? 'eat2' : sprite === bunnyRunRight1 ? 'run1' : 'run2'}_${flipX ? 'flip' : 'normal'}`;

  const cached = spriteCache.get(key);
  if (cached) return cached;

  const offscreen = document.createElement('canvas');
  offscreen.width = BUNNY_SIZE;
  offscreen.height = BUNNY_SIZE;
  const octx = offscreen.getContext('2d')!;

  for (let row = 0; row < sprite.length; row++) {
    for (let col = 0; col < sprite[row].length; col++) {
      const color = colors[sprite[row][col]];
      if (color !== 'transparent') {
        octx.fillStyle = color;
        const drawX = flipX
          ? (SPRITE_SIZE - 1 - col) * PIXEL_SIZE
          : col * PIXEL_SIZE;
        octx.fillRect(drawX, row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
      }
    }
  }

  spriteCache.set(key, offscreen);
  return offscreen;
}

// =============================================================================
// ОСНОВНОЙ КОМПОНЕНТ
// =============================================================================

export default function PixelBunny() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const bunnyRef = useRef<BunnyPosition>({
    x: 100,
    y: 100,
    vx: 2,
    vy: 0,
    state: 'running',
    direction: 'right',
    frame: 0,
    stateTimer: 0,
    eatingTimer: 0,
    isBrave: false,
    braveryCheckDone: false,
    nextRunThreshold: MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS,
    nextIdleThreshold: MIN_IDLE_TIME + Math.random() * MAX_IDLE_TIME_BONUS,
  });
  
  const pointerRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>(0);
  const isDraggingRef = useRef(false);
  const lastTimeRef = useRef<number>(0);

  /** Кешированная позиция прокрутки (обновляется через passive listener) */
  const scrollRef = useRef({ x: 0, y: 0 });

  /** Кешированные размеры документа (обновляются при resize) */
  const docSizeRef = useRef({ w: 0, h: 0 });

  /** Предыдущая область отрисовки для dirty rect clearing */
  const prevDrawRect = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const getCurrentSprite = (bunny: BunnyPosition): { sprite: number[][], flipX: boolean } => {
    if (bunny.state === 'caught') {
      return { sprite: bunnyFrontCry, flipX: false };
    }
    if (bunny.state === 'eating') {
      const eatingFrame = Math.floor(bunny.frame / EAT_ANIMATION_SPEED) % 2;
      return { sprite: eatingFrame === 0 ? bunnyEating1 : bunnyEating2, flipX: false };
    }
    if (bunny.state === 'idle') {
      return { sprite: bunnyFront, flipX: false };
    }
    const runFrame = Math.floor(bunny.frame / RUN_ANIMATION_SPEED) % 2;
    const sprite = runFrame === 0 ? bunnyRunRight1 : bunnyRunRight2;
    return { sprite, flipX: bunny.direction === 'left' };
  };

  /**
   * Проверка попадания координат в область зайца.
   * @param clickX - X-координата клика
   * @param clickY - Y-координата клика
   * @returns true если клик попал в зайца
   */
  const isClickOnBunny = (clickX: number, clickY: number): boolean => {
    const bunny = bunnyRef.current;
    const centerX = bunny.x + BUNNY_SIZE / 2;
    const centerY = bunny.y + BUNNY_SIZE / 2;
    const dist = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));
    return dist < BUNNY_SIZE / 2;
  };

  /**
   * Обработка начала захвата зайца (mousedown / touchstart).
   * С вероятностью BRAVERY_CHANCE_CLICK заяц позволяет себя поймать,
   * иначе быстро убегает в случайном направлении.
   * @param x - X-координата
   * @param y - Y-координата
   */
  const handlePointerDown = (x: number, y: number) => {
    if (isClickOnBunny(x, y)) {
      const bunny = bunnyRef.current;
      
      // Проверяем, проявит ли заяц смелость и позволит себя поймать
      const isBrave = Math.random() < BRAVERY_CHANCE_CLICK;
      
      if (isBrave) {
        // Заяц смелый - позволяет себя поймать!
        bunny.state = 'caught';
        bunny.vx = 0;
        bunny.vy = 0;
        isDraggingRef.current = true;
        
        // Предотвращаем выделение текста пока заяц удерживается
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
      } else {
        // Заяц испугался - быстро убегает в случайном направлении!
        bunny.state = 'running';
        const angle = Math.random() * Math.PI * 2;
        bunny.vx = Math.cos(angle) * FLEE_SPEED;
        bunny.vy = Math.sin(angle) * FLEE_SPEED;
        bunny.direction = bunny.vx > 0 ? 'right' : 'left';
        bunny.stateTimer = 0;
      }
    }
  };

  /**
   * Обработка окончания захвата зайца (mouseup / touchend).
   */
  const handlePointerUp = () => {
    const bunny = bunnyRef.current;
    if (bunny.state === 'caught') {
      // Отпускаем зайца - он убегает в случайном направлении
      bunny.state = 'running';
      const angle = Math.random() * Math.PI * 2;
      bunny.vx = Math.cos(angle) * SPEED;
      bunny.vy = Math.sin(angle) * SPEED;
      bunny.direction = bunny.vx > 0 ? 'right' : 'left';
    }
    
    isDraggingRef.current = false;
    
    // Восстанавливаем возможность выделения текста
    document.body.style.userSelect = '';
    document.body.style.webkitUserSelect = '';
  };

  /**
   * Обработка движения указателя (mousemove / touchmove).
   * @param x - X-координата
   * @param y - Y-координата
   */
  const handlePointerMove = (x: number, y: number) => {
    pointerRef.current = { x, y };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const updateDocSize = () => {
      docSizeRef.current.w = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      docSizeRef.current.h = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      updateDocSize();
    };
    resizeCanvas();

    scrollRef.current.x = window.scrollX || 0;
    scrollRef.current.y = window.scrollY || 0;

    const handleScroll = () => {
      scrollRef.current.x = window.scrollX || 0;
      scrollRef.current.y = window.scrollY || 0;
    };

    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // =========================================================================
    // ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ КООРДИНАТ
    // =========================================================================
    
    /**
     * Получение координат относительно документа (с учётом прокрутки).
     * Использует clientX/clientY + scroll для надёжности в production.
     */
    const getPageCoords = (clientX: number, clientY: number) => {
      return {
        x: clientX + (window.scrollX || window.pageXOffset || document.documentElement.scrollLeft || 0),
        y: clientY + (window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0)
      };
    };

    // =========================================================================
    // ОБРАБОТЧИКИ МЫШИ
    // =========================================================================
    
    const handleMouseMove = (e: MouseEvent) => {
      const coords = getPageCoords(e.clientX, e.clientY);
      handlePointerMove(coords.x, coords.y);
    };

    const handleMouseDown = (e: MouseEvent) => {
      const coords = getPageCoords(e.clientX, e.clientY);
      
      if (isClickOnBunny(coords.x, coords.y)) {
        // Предотвращаем стандартное поведение (выделение, drag)
        e.preventDefault();
        handlePointerDown(coords.x, coords.y);
      }
    };

    const handleMouseUp = () => {
      handlePointerUp();
    };

    // =========================================================================
    // ОБРАБОТЧИКИ КАСАНИЙ (TOUCH) ДЛЯ МОБИЛЬНЫХ УСТРОЙСТВ
    // =========================================================================
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = getPageCoords(touch.clientX, touch.clientY);
        
        // Обновляем позицию указателя
        handlePointerMove(coords.x, coords.y);
        
        if (isClickOnBunny(coords.x, coords.y)) {
          // Предотвращаем стандартное поведение (скролл, выделение, drag)
          e.preventDefault();
          handlePointerDown(coords.x, coords.y);
        }
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const coords = getPageCoords(touch.clientX, touch.clientY);
        handlePointerMove(coords.x, coords.y);
        
        // Если заяц пойман - предотвращаем скролл страницы
        if (isDraggingRef.current) {
          e.preventDefault();
        }
      }
    };

    const handleTouchEnd = () => {
      handlePointerUp();
      // Отодвигаем указатель далеко, чтобы заяц не убегал после отпускания
      pointerRef.current = { x: -1000, y: -1000 };
    };

    // Регистрируем обработчики событий на document для лучшей совместимости
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Touch events с passive: false для возможности preventDefault
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
    document.addEventListener('touchcancel', handleTouchEnd);

    // =========================================================================
    // ГЛАВНЫЙ ИГРОВОЙ ЦИКЛ
    // =========================================================================
    
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const rawDelta = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      const delta = Math.min(rawDelta, 100) / TARGET_FRAME_MS;

      const bunny = bunnyRef.current;
      const pointer = pointerRef.current;
      
      const bunnyCX = bunny.x + BUNNY_SIZE / 2;
      const bunnyCY = bunny.y + BUNNY_SIZE / 2;
      const dx = pointer.x - bunnyCX;
      const dy = pointer.y - bunnyCY;
      const distToPointer = Math.sqrt(dx * dx + dy * dy);
      
      bunny.frame += delta;
      bunny.stateTimer += delta;
      
      // -----------------------------------------------------------------------
      // ЛОГИКА ПОВЕДЕНИЯ ЗАЙЦА
      // -----------------------------------------------------------------------
      
      if (bunny.state === 'caught') {
        bunny.x = pointer.x - BUNNY_SIZE / 2;
        bunny.y = pointer.y - BUNNY_SIZE / 2;
      } else {
        if (distToPointer < FLEE_DISTANCE) {
          if (!bunny.braveryCheckDone) {
            bunny.braveryCheckDone = true;
            bunny.isBrave = Math.random() < BRAVERY_CHANCE;
          }
        } else {
          bunny.braveryCheckDone = false;
          bunny.isBrave = false;
        }

        if (distToPointer < FLEE_DISTANCE && !bunny.isBrave && bunny.state !== 'eating') {
          bunny.state = 'running';
          const angle = Math.atan2(dy, dx);
          bunny.vx = -Math.cos(angle) * FLEE_SPEED;
          bunny.vy = -Math.sin(angle) * FLEE_SPEED;
          bunny.direction = bunny.vx > 0 ? 'right' : 'left';
          bunny.stateTimer = 0;
          bunny.nextRunThreshold = MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS;
        } else if (bunny.state === 'eating') {
          bunny.eatingTimer += delta;
          if (bunny.eatingTimer > EATING_DURATION) {
            bunny.state = 'running';
            bunny.eatingTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            bunny.vx = Math.cos(angle) * SPEED;
            bunny.vy = Math.sin(angle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
            bunny.nextRunThreshold = MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS;
          }
        } else if (bunny.state === 'running') {
          if (bunny.stateTimer > bunny.nextRunThreshold) {
            if (Math.random() < EAT_CHANCE) {
              bunny.state = 'eating';
              bunny.vx = 0;
              bunny.vy = 0;
              bunny.eatingTimer = 0;
            }
            bunny.stateTimer = 0;
            bunny.nextRunThreshold = MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS;
          }
          
          if (Math.random() < DIRECTION_CHANGE_CHANCE * delta) {
            const angleChange = (Math.random() - 0.5) * Math.PI / 2;
            const currentAngle = Math.atan2(bunny.vy, bunny.vx);
            const newAngle = currentAngle + angleChange;
            bunny.vx = Math.cos(newAngle) * SPEED;
            bunny.vy = Math.sin(newAngle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
          }
        } else {
          if (bunny.stateTimer > bunny.nextIdleThreshold) {
            bunny.state = 'running';
            const angle = Math.random() * Math.PI * 2;
            bunny.vx = Math.cos(angle) * SPEED;
            bunny.vy = Math.sin(angle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
            bunny.stateTimer = 0;
            bunny.nextRunThreshold = MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS;
            bunny.nextIdleThreshold = MIN_IDLE_TIME + Math.random() * MAX_IDLE_TIME_BONUS;
          }
        }
      }

      bunny.x += bunny.vx * delta;
      bunny.y += bunny.vy * delta;
      
      // -----------------------------------------------------------------------
      // ГРАНИЦЫ ДОКУМЕНТА С ОТСКОКОМ (из кеша, без layout thrashing)
      // -----------------------------------------------------------------------
      
      const { w: docWidth, h: docHeight } = docSizeRef.current;
      
      if (bunny.x < -X_OUT_BOUNDS) {
        bunny.x = -X_OUT_BOUNDS;
        bunny.vx = Math.abs(bunny.vx);
        bunny.direction = 'right';
      }
      if (bunny.x > docWidth - BUNNY_SIZE + X_OUT_BOUNDS) {
        bunny.x = docWidth - BUNNY_SIZE + X_OUT_BOUNDS;
        bunny.vx = -Math.abs(bunny.vx);
        bunny.direction = 'left';
      }
      if (bunny.y < BOUNDARY_PADDING) {
        bunny.y = BOUNDARY_PADDING;
        bunny.vy = Math.abs(bunny.vy);
      }
      if (bunny.y > docHeight - BUNNY_SIZE - BOUNDARY_PADDING) {
        bunny.y = docHeight - BUNNY_SIZE - BOUNDARY_PADDING;
        bunny.vy = -Math.abs(bunny.vy);
      }
      
      // -----------------------------------------------------------------------
      // ОТРИСОВКА (dirty rect + кешированный scroll)
      // -----------------------------------------------------------------------
      
      const prev = prevDrawRect.current;
      ctx.clearRect(prev.x, prev.y, prev.w, prev.h);

      const { x: scrollX, y: scrollY } = scrollRef.current;
      const drawX = bunny.x - scrollX;
      const drawY = bunny.y - scrollY;

      const vw = canvas.width;
      const vh = canvas.height;
      const isVisible = drawX > -BUNNY_SIZE && drawX < vw && drawY > -BUNNY_SIZE && drawY < vh;

      if (isVisible) {
        const { sprite, flipX } = getCurrentSprite(bunny);
        const cachedSprite = renderSpriteToCanvas(sprite, flipX);
        ctx.drawImage(cachedSprite, drawX, drawY);
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
          drawX + BUNNY_SIZE / 2, 
          drawY + BUNNY_SIZE - 2, 
          BUNNY_SIZE / 3, 
          4, 
          0, 0, Math.PI * 2
        );
        ctx.fill();
      }

      const pad = 10;
      prevDrawRect.current = {
        x: drawX - pad,
        y: drawY - pad,
        w: BUNNY_SIZE + pad * 2,
        h: BUNNY_SIZE + pad * 2,
      };
      
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Начальная позиция - случайная в пределах экрана
    bunnyRef.current.x = Math.random() * (window.innerWidth - BUNNY_SIZE - 100) + 50;
    bunnyRef.current.y = Math.random() * (window.innerHeight - BUNNY_SIZE - 100) + 50;
    
    const startLoop = (ts: number) => gameLoop(ts);
    const idle = (window as any).requestIdleCallback;
    if (idle) {
      idle(() => requestAnimationFrame(startLoop));
    } else {
      setTimeout(() => requestAnimationFrame(startLoop), 200);
    }

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationRef.current);
      
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="fixed top-0 left-0 pointer-events-none z-50"
      style={{ 
        imageRendering: 'pixelated',
        touchAction: 'none',
        willChange: 'contents',
        transform: 'translateZ(0)',
      }}
    />
  );
}
