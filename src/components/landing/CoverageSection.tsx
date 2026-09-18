import React from 'react';
import { useStore } from '../../lib/store';
import { InteractiveMap } from '../common/InteractiveMap';
import { MapPin, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export const CoverageSection: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { regions, operators } = useStore();

  return (
    <section id="regions" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Couverture Géographique Nationale
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Où intervenons-nous au Cameroun ?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            La disponibilité de nos interventions dépend du réseau d'opérateurs certifiés. Une région n'est affichée active que lorsqu'au moins un télépilote professionnel y est déployé.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Interactive Map (7 cols) */}
          <div className="lg:col-span-7">
            <InteractiveMap showAllData={true} />
          </div>

          {/* Regions Dynamic Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wider">
              Statut par Région Agricole :
            </h3>

            <div className="space-y-3">
              {regions.map((reg) => {
                const activeOpsInRegion = operators.filter(
                  o => o.region === reg.name.replace('Région de l’', '').replace('Région du ', '') && o.verification_status === 'verifie'
                ).length;
                const isAvailable = activeOpsInRegion > 0 || reg.active_operators > 0;

                return (
                  <div
                    key={reg.id}
                    className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex items-center justify-between gap-3 hover:border-emerald-300 transition"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900 text-xs sm:text-sm">{reg.name}</span>
                        {isAvailable ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Disponible
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" /> En déploiement
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">
                        Chef-lieu : {reg.capital} • Spéculations : {reg.key_crops.slice(0, 3).join(', ')}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-black text-emerald-800 block">
                        {isAvailable ? `${reg.active_operators} télépilotes` : '0 actif'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {reg.total_parcels} parcelles
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <p className="font-bold mb-1">Votre région n'est pas encore couverte ?</p>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                Contactez-nous pour pré-enregistrer votre exploitation ou proposer des opérateurs locaux. Dès 10 hectares regroupés, nous organisons un convoi de drones dédié.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
