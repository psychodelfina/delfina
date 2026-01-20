import type { SiteConfig } from '../config/site.config';

interface Props {
  config: SiteConfig;
}

export default function Hero({ config }: Props) {
  const { hero } = config;
  
  return (
    <header class="min-h-screen flex items-center pt-[120px] pb-20 px-6 relative z-[1] overflow-hidden" id="hero" role="banner" itemScope itemType="https://schema.org/Person">
      {/* Background glow effect */}
      <div 
        class="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] animate-hero-glow -z-[1]"
        style={{
          background: 'radial-gradient(circle at 20% 50%, rgba(255, 45, 149, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(153, 69, 255, 0.15) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(0, 217, 255, 0.1) 0%, transparent 50%)'
        }}
      />

      <div class="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
        {/* Image */}
        <div class="relative flex justify-center lg:order-none order-first">
          <div class="absolute -inset-5 bg-gradient-neon blur-[60px] opacity-50 rounded-full animate-pulse-glow" />
<img 
            src={hero.image}
            alt={`${hero.name} - ${hero.tagline} - тату мастер в ${hero.location}`}
            class="parallax-image w-full max-w-[400px] aspect-[3/4] object-cover rounded-3xl border-[3px] border-transparent relative z-[1]"
            style={{
              background: 'linear-gradient(#0a0612, #0a0612) padding-box, linear-gradient(135deg, #ff2d95 0%, #e930ff 50%, #9945ff 100%) border-box'
            }}
            data-parallax-speed="0.1"
            itemProp="image"
            width="400"
            height="533"
          />
          {hero.bookingOpen && (
            <a 
              href={config.contacts.telegram}
              class="absolute -top-4 -right-4 bg-gradient-warm px-6 py-3 rounded-full text-sm font-bold z-[2] animate-bounce-slow"
              target="_blank" 
              rel="noopener"
            >
              ✨ Открыта запись
            </a>
          )}
        </div>

        {/* Content */}
        <div class="flex flex-col gap-6 text-center lg:text-left">
          <h1 class="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight" itemProp="name">
            <span class="bg-gradient-neon bg-clip-text text-transparent">{hero.name}</span>
          </h1>
          <p class="text-xl md:text-2xl text-neon-cyan font-semibold">
            <span itemProp="jobTitle">{hero.tagline}</span> • <span itemProp="workLocation">{hero.location}</span>
          </p>
          <p class="text-lg text-text-muted leading-relaxed whitespace-pre-line" itemProp="description">
            {hero.description}
          </p>
          <div class="flex gap-4 flex-wrap mt-4 justify-center lg:justify-start">
            <a 
              href={hero.telegramUrl}
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-neon rounded-full text-base font-semibold hover:-translate-y-1 hover:shadow-glow-pink transition-all duration-300"
              target="_blank" 
              rel="noopener"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              {hero.telegramChannel}
            </a>
            <a 
              href="#portfolio" 
              class="inline-flex items-center justify-center gap-3 px-8 py-4 bg-transparent border-2 border-neon-pink text-neon-pink rounded-full text-base font-semibold hover:bg-neon-pink hover:text-white transition-all duration-300"
            >
              Смотреть работы
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
