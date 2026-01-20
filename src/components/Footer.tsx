import type { SiteConfig } from '../config/site.config';

interface Props {
  config: SiteConfig;
}

export default function Footer({ config }: Props) {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="py-2 px-6 text-center border-t border-neon-pink/10 relative z-[1]" role="contentinfo">
      <div class="max-w-[1200px] mx-auto">
        <p class="text-sm text-white/40">
          <span itemProp="copyrightYear">{currentYear}</span> © <span itemProp="copyrightHolder">{config.hero.name}</span> — Создаю татуировки с любовью <span aria-hidden="true">💖</span>
        </p>
      </div>
    </footer>
  );
}
