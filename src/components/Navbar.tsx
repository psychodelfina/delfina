import type { SiteConfig } from '../config/site.config';

interface Props {
  config: SiteConfig;
}

export default function Navbar({ config }: Props) {
  return (
    <nav class="fixed top-0 left-0 right-0 z-[1000] bg-bg-dark/85 backdrop-blur-xl border-b border-neon-pink/20">
      <div class="max-w-[1200px] mx-auto px-6 py-4 flex items-center justify-between gap-6">
        <a href="#" class="font-heading text-xl font-bold bg-gradient-neon bg-clip-text text-transparent">
          {config.hero.name}
        </a>
        
        <div class="hidden md:flex gap-8">
          <a href="#portfolio" class="text-sm font-medium text-text-muted hover:text-neon-pink transition-colors duration-300">Работы</a>
          <a href="#certificates" class="text-sm font-medium text-text-muted hover:text-neon-pink transition-colors duration-300">Сертификаты</a>
          <a href="#faq" class="text-sm font-medium text-text-muted hover:text-neon-pink transition-colors duration-300">FAQ</a>
          <a href="#contacts" class="text-sm font-medium text-text-muted hover:text-neon-pink transition-colors duration-300">Контакты</a>
        </div>
        
        <a 
          href={config.contacts.telegram}
          class="flex items-center gap-2 px-5 py-2.5 bg-gradient-neon rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-glow-pink transition-all duration-300"
          target="_blank" 
          rel="noopener"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          Написать
        </a>
      </div>
    </nav>
  );
}
