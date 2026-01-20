import { useState, useEffect } from 'preact/hooks';

export default function Lightbox() {
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState('');
  const [imageAlt, setImageAlt] = useState('');

  useEffect(() => {
    const handleImageClick = (e: Event) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const parent = target.closest('.portfolio-item, .certificate-item');
      if (!parent) return;

      const img = parent.querySelector('img') as HTMLImageElement | null;
      if (!img) return;

      setImageSrc(img.src);
      setImageAlt(img.alt);
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('click', handleImageClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('click', handleImageClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const closeLightbox = () => {
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  const handleBackdropClick = (e: Event) => {
    if ((e.target as HTMLElement).classList.contains('lightbox')) {
      closeLightbox();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      class="lightbox fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <button 
        class="absolute top-6 right-6 bg-transparent border-none text-white text-5xl cursor-pointer leading-none hover:text-neon-pink transition-colors duration-300"
        onClick={closeLightbox}
        aria-label="Закрыть"
      >
        ×
      </button>
      <img 
        src={imageSrc}
        alt={imageAlt}
        class="max-w-[90vw] max-h-[90vh] object-contain rounded-2xl"
      />
    </div>
  );
}
