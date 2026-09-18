import React, { useState } from 'react';
import { FAQ_ITEMS } from '../../data/mockData';
import { ChevronDown, HelpCircle, MessageSquare } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Foire Aux Questions
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Tout ce que vous devez savoir avant de réserver
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Tarifs, matériel, conformité légale et organisation des missions drone au Cameroun.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs transition"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-gray-900 hover:text-emerald-800 transition"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0" />
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-emerald-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-gray-600 leading-relaxed border-t border-gray-100 animate-fadeIn">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Box */}
        <div className="mt-10 p-5 rounded-2xl bg-emerald-100/70 border border-emerald-300 text-center text-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-bold text-emerald-950">Vous avez une question spécifique sur vos parcelles ?</h4>
            <p className="text-emerald-800 mt-0.5">Nos coordinateurs agronomes vous répondent directement sur WhatsApp.</p>
          </div>
          <a
            href="https://wa.me/237690001122?text=Bonjour%20AgriFly%20!%20J'ai%20une%20question%20concernant%20mes%20cultures."
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-2 transition shadow-xs"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Discuter avec un agronome</span>
          </a>
        </div>
      </div>
    </section>
  );
};
