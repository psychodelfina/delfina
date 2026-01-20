import type { SiteConfig } from '../config/site.config';

interface Props {
  config: SiteConfig;
}

export default function Contacts({ config }: Props) {
  const { contacts } = config;
  
  return (
    <section 
      class="py-8 relative z-[1]" 
      id="contacts"
      aria-labelledby="contacts-heading"
      style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(153, 69, 255, 0.05) 50%, transparent 100%)' }}
    >
      <div class="max-w-[1200px] mx-auto px-6">
        <h2 id="contacts-heading" class="font-heading text-3xl md:text-4xl text-center mb-4 flex items-center justify-center gap-4">
          <span class="text-3xl" aria-hidden="true">📱</span>
          Контакты
        </h2>
        <p class="text-center text-text-muted text-lg mb-16">Найдите меня в социальных сетях</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-[400px] md:max-w-none mx-auto">
          {/* Instagram */}
          <div class="bg-bg-card rounded-3xl p-6 border border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(225,48,108,0.2)] transition-all duration-300">
            <div class="flex items-center gap-3 mb-5 font-semibold text-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Instagram</span>
            </div>
            <a href={contacts.instagram} target="_blank" rel="noopener noreferrer" aria-label="Подписаться на Instagram @psychodelfina" class="block rounded-2xl overflow-hidden">
              <div class="bg-instagram py-10 px-6 text-center flex flex-col gap-3 hover:opacity-90 transition-opacity">
                <span class="text-xl font-bold">@psychodelfina</span>
                <span class="text-sm opacity-90">Подписаться →</span>
              </div>
            </a>
          </div>

          {/* VK */}
          <div class="bg-bg-card rounded-3xl p-6 border border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,119,255,0.2)] transition-all duration-300">
            <div class="flex items-center gap-3 mb-5 font-semibold text-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.684 0H8.316C1.592 0 0 1.592 0 8.316v7.368C0 22.408 1.592 24 8.316 24h7.368C22.408 24 24 22.408 24 15.684V8.316C24 1.592 22.408 0 15.684 0zm3.692 17.123h-1.744c-.66 0-.864-.525-2.05-1.727-1.033-1-1.49-1.135-1.744-1.135-.356 0-.458.102-.458.593v1.575c0 .424-.135.678-1.253.678-1.846 0-3.896-1.12-5.339-3.202-2.17-3.042-2.763-5.32-2.763-5.785 0-.254.102-.491.593-.491h1.744c.44 0 .61.203.78.677.863 2.49 2.303 4.675 2.896 4.675.22 0 .322-.102.322-.66V9.721c-.068-1.186-.695-1.287-.695-1.71 0-.204.17-.407.44-.407h2.744c.373 0 .508.203.508.643v3.473c0 .372.17.508.271.508.22 0 .407-.136.814-.542 1.27-1.422 2.17-3.61 2.17-3.61.119-.254.305-.491.745-.491h1.744c.525 0 .644.27.525.643-.22 1.017-2.354 4.031-2.354 4.031-.186.305-.254.44 0 .78.186.254.796.779 1.203 1.253.745.847 1.32 1.558 1.473 2.05.17.49-.085.744-.576.744z"/>
              </svg>
              <span>ВКонтакте</span>
            </div>
            <a href={contacts.vk} target="_blank" rel="noopener noreferrer" aria-label="Подписаться на ВКонтакте psychodelfina" class="block rounded-2xl overflow-hidden">
              <div class="bg-vk py-10 px-6 text-center flex flex-col gap-3 hover:opacity-90 transition-opacity">
                <span class="text-xl font-bold">psychodelfina</span>
                <span class="text-sm opacity-90">Подписаться →</span>
              </div>
            </a>
          </div>

          {/* TikTok */}
          <div class="bg-bg-card rounded-3xl p-6 border border-white/10 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(255,0,80,0.2)] transition-all duration-300">
            <div class="flex items-center gap-3 mb-5 font-semibold text-lg">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
              </svg>
              <span>TikTok</span>
            </div>
            <a href={contacts.tiktok} target="_blank" rel="noopener noreferrer" aria-label="Подписаться на TikTok @psychodelfina" class="block rounded-2xl overflow-hidden">
              <div class="bg-tiktok py-10 px-6 text-center flex flex-col gap-3 hover:opacity-90 transition-opacity">
                <span class="text-xl font-bold">@psychodelfina</span>
                <span class="text-sm opacity-90">Подписаться →</span>
              </div>
            </a>
          </div>
        </div>

        {/* Main CTA */}
        <div class="flex justify-center">
          <div class="text-center p-10 md:p-16 bg-gradient-to-br from-neon-pink/10 to-neon-purple/10 rounded-[32px] border border-neon-pink/30 max-w-[600px]">
            <h3 class="font-heading text-2xl md:text-3xl mb-4 bg-gradient-neon bg-clip-text text-transparent">
              Готовы к яркой татуировке?
            </h3>
            <p class="text-text-muted text-lg mb-8">Напишите мне в Telegram — обсудим вашу идею и запишемся на сеанс!</p>
            <a 
              href={contacts.telegram}
              class="inline-flex items-center justify-center gap-3 px-12 py-5 bg-gradient-neon rounded-full text-xl font-semibold hover:-translate-y-1 hover:shadow-glow-pink transition-all duration-300"
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Написать в Telegram для записи на тату"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
              </svg>
              Написать в Telegram
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
