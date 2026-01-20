interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQ({ items }: Props) {
  return (
    <section class="py-6 relative z-[1]" id="faq" aria-labelledby="faq-heading">
      <div class="max-w-[1200px] mx-auto px-6">
        <h2 id="faq-heading" class="font-heading text-3xl md:text-4xl text-center mb-4 flex items-center justify-center gap-4">
          <span class="text-3xl" aria-hidden="true">❓</span>
          Частые вопросы
        </h2>
        <p class="text-center text-text-muted text-lg mb-16">Ответы на популярные вопросы о тату</p>
        
        <div class="max-w-[800px] mx-auto flex flex-col gap-4">
          {items.map((item, index) => (
            <details 
              key={index}
              class="faq-item bg-bg-card rounded-2xl border border-neon-pink/10 overflow-hidden opacity-0 animate-fade-in-up hover:border-neon-pink/30 transition-colors duration-300 group open:border-neon-pink"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <summary class="p-6 cursor-pointer flex items-center justify-between font-semibold text-lg list-none">
                <span>{item.question}</span>
                <span class="faq-icon text-2xl text-neon-pink transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p class="px-6 pb-6 text-text-muted leading-relaxed">{item.answer}</p>
            </details>
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
        
        summary::-webkit-details-marker {
          display: none;
        }
      `}</style>
    </section>
  );
}
