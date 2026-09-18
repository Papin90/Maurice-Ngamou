import React, { useState } from 'react';
import { CropType, ServiceType } from '../../types';
import { CROP_DETAILS } from '../../data/mockData';
import { 
  ArrowRight, 
  Sparkles, 
  Calendar, 
  ShieldAlert, 
  MapPin, 
  ChevronRight,
  Calculator,
  CheckCircle
} from 'lucide-react';

interface CropsSectionProps {
  onOpenBookingWithCrop: (crop: CropType) => void;
}

export const CropsSection: React.FC<CropsSectionProps> = ({ onOpenBookingWithCrop }) => {
  const [selectedCropKey, setSelectedCropKey] = useState<CropType>('tomate');

  const cropKeys: CropType[] = [
    'tomate',
    'pomme_de_terre',
    'mais',
    'piment',
    'maraichage',
    'oignon',
    'aubergine',
    'banane_plantain',
    'autre'
  ];

  const currentCrop = CROP_DETAILS[selectedCropKey];

  return (
    <section id="cultures" className="py-20 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Expertise Agronomique par Culture
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Des protocoles de vol adaptés à chaque spéculation
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Chaque culture présente une architecture foliaire et des sensibilités spécifiques. Nos paramètres de vol (altitude, vortex, micronisation) sont calibrés sur mesure.
          </p>
        </div>

        {/* Crops Selector Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {cropKeys.map((k) => {
            const item = CROP_DETAILS[k];
            const isSelected = selectedCropKey === k;
            return (
              <button
                key={k}
                onClick={() => setSelectedCropKey(k)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-stone-100 text-gray-700 hover:bg-stone-200'
                }`}
              >
                <span className="text-base">{item.emoji}</span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>

        {/* Crop Detail Spotlight Card */}
        <div className="bg-gradient-to-br from-stone-50 to-emerald-50/40 rounded-3xl border border-emerald-200/80 p-6 sm:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-4xl">{currentCrop.emoji}</span>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 font-display">
                    Culture de {currentCrop.name} au Cameroun
                  </h3>
                  <p className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Principaux bassins : {currentCrop.regions}
                  </p>
                </div>
              </div>

              {/* Agronomic Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] text-gray-500 font-medium block">Cycle Végétatif</span>
                  <span className="font-bold text-gray-800">{currentCrop.cycle}</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs">
                  <span className="text-[11px] text-gray-500 font-medium block">Surfaces Typiques</span>
                  <span className="font-bold text-gray-800">{currentCrop.typical_surface}</span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-stone-200 shadow-xs sm:col-span-2">
                  <span className="text-[11px] text-gray-500 font-medium block">Ravageurs & Pathologies Fréquentes</span>
                  <span className="font-bold text-rose-900">{currentCrop.common_pests}</span>
                </div>
              </div>

              {/* Drone Benefit Highlight */}
              <div className="p-4 bg-emerald-100/60 rounded-2xl border border-emerald-300/80 text-xs">
                <h4 className="font-bold text-emerald-950 flex items-center gap-2 mb-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-700" />
                  Pourquoi le drone surpasse les méthodes traditionnelles sur {currentCrop.name} :
                </h4>
                <p className="text-emerald-900 leading-relaxed font-medium">
                  {currentCrop.drone_benefit}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onOpenBookingWithCrop(selectedCropKey)}
                  className="px-6 py-3 rounded-xl font-bold text-xs bg-emerald-700 hover:bg-emerald-800 text-white transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Réserver un traitement pour {currentCrop.name}</span>
                </button>
              </div>
            </div>

            {/* Right Card: Services Recommended (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-stone-200 shadow-md space-y-4">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2 font-display">
                <CheckCircle className="w-4 h-4 text-emerald-600" /> Prestations recommandées pour {currentCrop.name}
              </h4>
              
              <div className="space-y-2.5 text-xs">
                {currentCrop.recommended_services.map((srvKey) => {
                  const srvTitles: Record<string, string> = {
                    pulverisation: 'Pulvérisation phytosanitaire anti-fongique & insecticide',
                    fertilisation: 'Fertilisation foliaire par biostimulants d’assimilation rapide',
                    cartographie: 'Cartographie NDVI de détection de stress précoce',
                    epandage: 'Épandage granulaire de fond & semences',
                    inspection: 'Inspection aérienne haute résolution des lignes de culture',
                    suivi: 'Suivi régulier du carnet sanitaire',
                  };
                  return (
                    <div key={srvKey} className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                      <span className="font-semibold text-gray-800">{srvTitles[srvKey] || srvKey}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gray-100 text-[11px] text-gray-500 leading-relaxed">
                🛡️ <em>Engagement de sécurité :</em> AgriFly Cameroun n'effectue aucun traitement sans vérification préalable de la conformité des intrants homologués par le MINADER et le respect des Délais Avant Récolte (DAR).
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
