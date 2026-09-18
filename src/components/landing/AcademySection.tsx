import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { BlogArticle } from '../../types';
import { BookOpen, Clock, ArrowRight, User, X } from 'lucide-react';

export const AcademySection: React.FC = () => {
  const { articles } = useStore();
  const [activeArticle, setActiveArticle] = useState<BlogArticle | null>(null);

  return (
    <section id="academy" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            AgriFly Academy • Conseils & Innovations
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Comprendre et adopter l'agriculture de précision
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Articles pratiques, comparatifs économiques et guides réglementaires rédigés par nos agronomes partenaires au Cameroun.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art) => (
            <div
              key={art.id}
              className="bg-stone-50 rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-stone-200 overflow-hidden relative">
                  <img
                    src={art.image_url}
                    alt={art.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 bg-stone-900/80 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    {art.category.toUpperCase()}
                  </span>
                </div>

                <div className="p-5 space-y-2.5">
                  <div className="flex items-center gap-3 text-[11px] text-gray-500">
                    <span>{art.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {art.read_time_min} min de lecture
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => setActiveArticle(art)}
                  className="text-xs font-bold text-emerald-800 hover:text-emerald-700 flex items-center gap-1.5 transition"
                >
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Article Reader Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-2xl w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn text-gray-800">
            <div className="relative h-56 bg-stone-900">
              <img
                src={activeArticle.image_url}
                alt={activeArticle.title}
                className="w-full h-full object-cover opacity-85"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-3 right-3 p-1 rounded-full bg-black/60 text-white hover:bg-black"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-3 left-4 right-4">
                <span className="px-2 py-0.5 rounded bg-emerald-600 text-white font-bold text-[10px] uppercase">
                  {activeArticle.category}
                </span>
                <h3 className="text-base sm:text-lg font-black text-white font-display mt-1">
                  {activeArticle.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto text-xs sm:text-sm text-gray-700 leading-relaxed">
              <div className="flex items-center justify-between text-xs text-gray-500 pb-3 border-b border-gray-100">
                <span>Auteur : {activeArticle.author}</span>
                <span>Publié le : {activeArticle.date}</span>
              </div>

              <div className="whitespace-pre-line">
                {activeArticle.content}
              </div>

              <div className="pt-4 border-t border-gray-200 text-right">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-bold"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
