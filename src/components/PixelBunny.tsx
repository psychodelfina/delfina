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
}

// =============================================================================
// ОСНОВНОЙ КОМПОНЕНТ
// =============================================================================

export default function PixelBunny() {
  // Рефы для хранения состояния между рендерами
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  /** Состояние зайца (позиция, скорость, анимация) */
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
  });
  
  /** Текущая позиция курсора/пальца */
  const pointerRef = useRef({ x: -1000, y: -1000 });
  
  /** ID текущей анимации для отмены при unmount */
  const animationRef = useRef<number>(0);
  
  /** Флаг, что заяц сейчас удерживается (для предотвращения выделения текста) */
  const isDraggingRef = useRef(false);

  /**
   * Отрисовка спрайта на canvas.
   * @param ctx - Контекст canvas
   * @param sprite - Двумерный массив спрайта
   * @param x - X-координата
   * @param y - Y-координата
   * @param flipX - Отзеркалить по горизонтали
   */
  const drawSprite = (ctx: CanvasRenderingContext2D, sprite: number[][], x: number, y: number, flipX: boolean = false) => {
    for (let row = 0; row < sprite.length; row++) {
      for (let col = 0; col < sprite[row].length; col++) {
        const color = colors[sprite[row][col]];
        if (color !== 'transparent') {
          ctx.fillStyle = color;
          // Если нужно отзеркалить - рисуем с конца
          const drawX = flipX 
            ? x + (SPRITE_SIZE - 1 - col) * PIXEL_SIZE 
            : x + col * PIXEL_SIZE;
          ctx.fillRect(drawX, y + row * PIXEL_SIZE, PIXEL_SIZE, PIXEL_SIZE);
        }
      }
    }
  };

  /**
   * Получение текущего спрайта в зависимости от состояния зайца.
   * @param bunny - Текущее состояние зайца
   * @returns Объект со спрайтом и флагом отзеркаливания
   */
  const getCurrentSprite = (bunny: BunnyPosition): { sprite: number[][], flipX: boolean } => {
    // Пойманный заяц - плачет
    if (bunny.state === 'caught') {
      return { sprite: bunnyFrontCry, flipX: false };
    }

    // Жуёт морковку - чередуем кадры
    if (bunny.state === 'eating') {
      const eatingFrame = Math.floor(bunny.frame / EAT_ANIMATION_SPEED) % 2;
      return { sprite: eatingFrame === 0 ? bunnyEating1 : bunnyEating2, flipX: false };
    }
    
    // Простой (idle) - просто стоит
    if (bunny.state === 'idle') {
      return { sprite: bunnyFront, flipX: false };
    }
    
    // Бежит - чередуем кадры бега, отзеркаливаем если бежит влево
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

    /**
     * Установка размера canvas на весь документ.
     * Canvas должен покрывать всю прокручиваемую область.
     */
    const resizeCanvas = () => {
      canvas.width = Math.max(document.documentElement.scrollWidth, window.innerWidth);
      canvas.height = Math.max(document.documentElement.scrollHeight, window.innerHeight);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

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
    
    const gameLoop = () => {
      const bunny = bunnyRef.current;
      const pointer = pointerRef.current;
      
      // Очистка canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Расстояние до курсора/пальца
      const dx = pointer.x - (bunny.x + BUNNY_SIZE / 2);
      const dy = pointer.y - (bunny.y + BUNNY_SIZE / 2);
      const distToPointer = Math.sqrt(dx * dx + dy * dy);
      
      // Обновление счётчиков
      bunny.frame++;
      bunny.stateTimer++;
      
      // -----------------------------------------------------------------------
      // ЛОГИКА ПОВЕДЕНИЯ ЗАЙЦА
      // -----------------------------------------------------------------------
      
      if (bunny.state === 'caught') {
        // Пойманный заяц следует за курсором/пальцем
        bunny.x = pointer.x - BUNNY_SIZE / 2;
        bunny.y = pointer.y - BUNNY_SIZE / 2;
      } else {
        // Проверка на смелость при приближении курсора
        if (distToPointer < FLEE_DISTANCE) {
          if (!bunny.braveryCheckDone) {
            bunny.braveryCheckDone = true;
            bunny.isBrave = Math.random() < BRAVERY_CHANCE;
          }
        } else {
          // Сброс состояния смелости, когда курсор далеко
          bunny.braveryCheckDone = false;
          bunny.isBrave = false;
        }

        // Убегание от курсора (если не смелый и не ест)
        if (distToPointer < FLEE_DISTANCE && !bunny.isBrave && bunny.state !== 'eating') {
          bunny.state = 'running';
          const angle = Math.atan2(dy, dx);
          bunny.vx = -Math.cos(angle) * FLEE_SPEED;
          bunny.vy = -Math.sin(angle) * FLEE_SPEED;
          bunny.direction = bunny.vx > 0 ? 'right' : 'left';
          bunny.stateTimer = 0;
        } else if (bunny.state === 'eating') {
          // Жуём морковку
          bunny.eatingTimer++;
          if (bunny.eatingTimer > EATING_DURATION) {
            // Закончили есть - начинаем бежать
            bunny.state = 'running';
            bunny.eatingTimer = 0;
            const angle = Math.random() * Math.PI * 2;
            bunny.vx = Math.cos(angle) * SPEED;
            bunny.vy = Math.sin(angle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
          }
        } else if (bunny.state === 'running') {
          // Периодически останавливаемся и едим
          if (bunny.stateTimer > MIN_RUN_TIME + Math.random() * MAX_RUN_TIME_BONUS) {
            if (Math.random() < EAT_CHANCE) {
              bunny.state = 'eating';
              bunny.vx = 0;
              bunny.vy = 0;
              bunny.eatingTimer = 0;
            }
            bunny.stateTimer = 0;
          }
          
          // Случайное изменение направления для более естественного движения
          if (Math.random() < DIRECTION_CHANGE_CHANCE) {
            const angleChange = (Math.random() - 0.5) * Math.PI / 2;
            const currentAngle = Math.atan2(bunny.vy, bunny.vx);
            const newAngle = currentAngle + angleChange;
            bunny.vx = Math.cos(newAngle) * SPEED;
            bunny.vy = Math.sin(newAngle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
          }
        } else {
          // Idle - иногда начинаем бежать
          if (bunny.stateTimer > MIN_IDLE_TIME + Math.random() * MAX_IDLE_TIME_BONUS) {
            bunny.state = 'running';
            const angle = Math.random() * Math.PI * 2;
            bunny.vx = Math.cos(angle) * SPEED;
            bunny.vy = Math.sin(angle) * SPEED;
            bunny.direction = bunny.vx > 0 ? 'right' : 'left';
            bunny.stateTimer = 0;
          }
        }
      }

      // Обновление позиции
      bunny.x += bunny.vx;
      bunny.y += bunny.vy;
      
      // -----------------------------------------------------------------------
      // ГРАНИЦЫ ЭКРАНА С ОТСКОКОМ
      // -----------------------------------------------------------------------
      
      // Левая граница
      if (bunny.x < -X_OUT_BOUNDS) {
        bunny.x = -X_OUT_BOUNDS;
        bunny.vx = Math.abs(bunny.vx);
        bunny.direction = 'right';
      }
      // Правая граница
      if (bunny.x > canvas.width - BUNNY_SIZE + X_OUT_BOUNDS) {
        bunny.x = canvas.width - BUNNY_SIZE + X_OUT_BOUNDS;
        bunny.vx = -Math.abs(bunny.vx);
        bunny.direction = 'left';
      }
      // Верхняя граница
      if (bunny.y < BOUNDARY_PADDING) {
        bunny.y = BOUNDARY_PADDING;
        bunny.vy = Math.abs(bunny.vy);
      }
      // Нижняя граница
      if (bunny.y > canvas.height - BUNNY_SIZE - BOUNDARY_PADDING) {
        bunny.y = canvas.height - BUNNY_SIZE - BOUNDARY_PADDING;
        bunny.vy = -Math.abs(bunny.vy);
      }
      
      // -----------------------------------------------------------------------
      // ОТРИСОВКА
      // -----------------------------------------------------------------------
      
      // Отрисовка спрайта зайца
      const { sprite, flipX } = getCurrentSprite(bunny);
      drawSprite(ctx, sprite, bunny.x, bunny.y, flipX);
      
      // Добавляем тень под зайцем для объёма
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.beginPath();
      ctx.ellipse(
        bunny.x + BUNNY_SIZE / 2, 
        bunny.y + BUNNY_SIZE - 2, 
        BUNNY_SIZE / 3, 
        4, 
        0, 0, Math.PI * 2
      );
      ctx.fill();
      
      // Запланировать следующий кадр
      animationRef.current = requestAnimationFrame(gameLoop);
    };
    
    // Начальная позиция - случайная в пределах экрана
    bunnyRef.current.x = Math.random() * (canvas.width - BUNNY_SIZE - 100) + 50;
    bunnyRef.current.y = Math.random() * (canvas.height - BUNNY_SIZE - 100) + 50;
    
    // Запуск игрового цикла
    gameLoop();

    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('touchcancel', handleTouchEnd);
      cancelAnimationFrame(animationRef.current);
      
      // Восстанавливаем выделение текста на случай если было заблокировано
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      class="absolute top-0 left-0 pointer-events-none z-50"
      style={{ 
        imageRendering: 'pixelated',
        // Отключаем touch-action чтобы браузер не обрабатывал касания
        touchAction: 'none'
      }}
    />
  );
}
