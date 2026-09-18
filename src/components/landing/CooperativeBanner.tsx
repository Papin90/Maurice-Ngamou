import React from 'react';
import { Users, Building2, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useStore } from '../../lib/store';

export const CooperativeBanner: React.FC<{ onOpenBooking: () => void; onSwitchToCoop: () => void }> = ({
  onOpenBooking,
  onSwitchToCoop,
}) => {
  return (
    <section className="py-16 bg-gradient-to-r from-emerald-950 via-stone-900 to-emerald-900 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/60 border border-emerald-600/50 text-emerald-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Espace Dédié aux Coopératives & GICs Agricoles</span>
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
              Modernisez le traitement de vos exploitations groupées
            </h2>
            
            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
              Vous gérez une union de producteurs, une coopérative maraîchère ou un GIC ? Regroupez vos surfaces (20, 50, 100+ hectares) pour bénéficier d'un tarif préférentiel, d'un calendrier coordonné et d'une facturation centralisée.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-emerald-300 block">Tarification Dégressive</span>
                <span className="text-stone-400 text-[11px]">Économies d’échelle sur les grands terroirs</span>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-emerald-300 block">Carnet Sanitaire Global</span>
                <span className="text-stone-400 text-[11px]">Traçabilité parcelle par parcelle pour l'export</span>
              </div>
              <div className="p-3 bg-stone-800/80 rounded-xl border border-stone-700">
                <span className="font-bold text-emerald-300 block">Coordination de Flotte</span>
                <span className="text-stone-400 text-[11px]">Déploiement synchronisé multi-drones</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-3">
            <button
              onClick={onSwitchToCoop}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-stone-950 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Users className="w-4 h-4" />
              <span>Explorer le Dashboard Coopérative</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="w-full py-3 px-6 rounded-xl font-semibold text-xs bg-stone-800 hover:bg-stone-700 text-white border border-stone-700 transition flex items-center justify-center gap-2"
            >
              <span>Demander un devis coopératif groupé</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

        </div>
      </div>
    </section>
  );
};
