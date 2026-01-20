interface PortfolioImage {
  src: string;
  alt: string;
}

interface Props {
  images: PortfolioImage[];
}

export default function Portfolio({ images }: Props) {
  return (
    <section class="py-24 relative z-[1]" id="portfolio" aria-labelledby="portfolio-heading">
      <div class="max-w-[1200px] mx-auto px-6">
        <h2 id="portfolio-heading" class="font-heading text-3xl md:text-4xl text-center mb-4 flex items-center justify-center gap-4">
          <span class="text-3xl" aria-hidden="true">🎨</span>
          Мои работы
        </h2>
        <p class="text-center text-text-muted text-lg mb-16">Яркие татуировки, которые расскажут вашу историю</p>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" role="list" aria-label="Галерея работ">
          {images.map((image, index) => (
            <figure 
              key={index}
              class="portfolio-item relative rounded-2xl overflow-hidden aspect-square cursor-pointer group opacity-0 animate-fade-in-up m-0"
              style={{ animationDelay: `${index * 0.1}s` }}
              role="listitem"
              itemScope
              itemType="https://schema.org/ImageObject"
            >
              <img 
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
                class="parallax-gallery w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                data-parallax-speed="0.05"
                itemProp="contentUrl"
                width="400"
                height="400"
              />
              <meta itemProp="name" content={image.alt} />
            </figure>
          ))}
        </div>
      </div>
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.6s ease forwards;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
}
