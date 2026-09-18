import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { CropType, ServiceType } from '../../types';
import { 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Calculator, 
  Zap, 
  ShieldCheck,
  TrendingUp,
  MapPin
} from 'lucide-react';
import { CROP_DETAILS } from '../../data/mockData';

interface HeroSectionProps {
  onOpenBooking: (crop?: CropType, service?: ServiceType) => void;
  onExploreServices: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenBooking,
  onExploreServices,
}) => {
  const { pricing } = useStore();

  // Quick estimator form states
  const [quickCrop, setQuickCrop] = useState<CropType>('tomate');
  const [quickSurface, setQuickSurface] = useState<number>(2.5);
  const [quickRegion, setQuickRegion] = useState<string>('Ouest');
  const [quickService, setQuickService] = useState<ServiceType>('pulverisation');
  const [quickEstimation, setQuickEstimation] = useState<number | null>(null);

  const handleCalculateQuick = (e: React.FormEvent) => {
    e.preventDefault();
    const servicePrice = pricing.find(p => p.service_id === quickService)?.price_per_hectare || 20000;
    const travel = 5000;
    const estimated = Math.round(quickSurface * servicePrice + travel);
    setQuickEstimation(estimated);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-stone-900 via-stone-900 to-emerald-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background radial highlight */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-radial from-emerald-600/20 via-emerald-800/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Réseau d'opérateurs de drones agricoles au Cameroun</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white font-display leading-[1.15]">
              Vos champs. <br />
              <span className="text-emerald-400">Notre technologie.</span> <br />
              De meilleures interventions.
            </h1>

            {/* Subtitle */}
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Réservez des prestations agricoles par drone partout où nos opérateurs partenaires sont disponibles au Cameroun. Pulvérisation ultra-précise, fertilisation, épandage et cartographie sans aucun tassement de vos sols.
            </p>

            {/* Key Advantages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-left">
              <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-xs">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4" /> 12 min / Hectare
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Traitement 20x plus rapide que le pulvérisateur à dos</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-xs">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" /> -30% à -40% de Bouillie
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Micronisation vortex : zéro gaspillage de produit</p>
              </div>
              <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60 backdrop-blur-xs">
                <div className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> 100% Homologué
                </div>
                <p className="text-[11px] text-stone-400 mt-0.5">Télépilotes CCAA & normes MINADER respectées</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <button
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm text-stone-950 bg-gradient-to-r from-emerald-400 to-emerald-300 hover:from-emerald-300 hover:to-emerald-200 transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Réserver une intervention</span>
              </button>
              <button
                onClick={onExploreServices}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm text-white bg-stone-800/80 hover:bg-stone-700/80 border border-stone-700 transition flex items-center justify-center gap-2"
              >
                <span>Découvrir nos services</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Right Column: Quick Estimator Widget (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-stone-800/90 border border-emerald-500/30 rounded-3xl p-6 sm:p-7 shadow-2xl backdrop-blur-md relative">
              {/* Drone imagery banner */}
              <div className="relative rounded-2xl overflow-hidden mb-5 h-36 bg-stone-900 border border-stone-700">
                <img
                  src="https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80"
                  alt="Drone agricole en intervention sur plantation camerounaise"
                  className="w-full h-full object-cover opacity-85"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-900/40 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                  <span className="font-bold text-white flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-lg">
                    🚁 DJI Agras T40 en vol
                  </span>
                  <span className="text-emerald-300 text-[11px] font-semibold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
                    Bassin Foumbot & Moungo
                  </span>
                </div>
              </div>

              {/* Form Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2 font-display">
                    <Calculator className="w-4 h-4 text-emerald-400" /> De quoi avez-vous besoin ?
                  </h3>
                  <p className="text-xs text-stone-400">
                    Estimez le coût de votre traitement en 30 secondes
                  </p>
                </div>
              </div>

              <form onSubmit={handleCalculateQuick} className="space-y-3.5 text-xs">
                {/* Culture */}
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Culture :</label>
                  <select
                    value={quickCrop}
                    onChange={(e) => {
                      setQuickCrop(e.target.value as CropType);
                      setQuickEstimation(null);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-medium focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="tomate">🍅 Tomate (Noun, Foumbot, Ouest)</option>
                    <option value="pomme_de_terre">🥔 Pomme de terre (Dschang, Santa)</option>
                    <option value="banane_plantain">🍌 Banane / Plantain (Moungo, Loum)</option>
                    <option value="mais">🌽 Maïs (Centre, Ouest, Adamaoua)</option>
                    <option value="piment">🌶️ Piment (Foumbot, Moungo)</option>
                    <option value="maraichage">🥬 Maraîchage diversifié</option>
                    <option value="oignon">🧅 Oignon</option>
                    <option value="aubergine">🍆 Aubergine</option>
                    <option value="autre">🌱 Autre culture</option>
                  </select>
                </div>

                {/* Superficie & Région */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Superficie (ha) :</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={quickSurface}
                        onChange={(e) => {
                          setQuickSurface(parseFloat(e.target.value) || 1);
                          setQuickEstimation(null);
                        }}
                        className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-bold"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-stone-300 font-semibold mb-1">Région :</label>
                    <select
                      value={quickRegion}
                      onChange={(e) => {
                        setQuickRegion(e.target.value);
                        setQuickEstimation(null);
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-medium"
                    >
                      <option value="Ouest">Ouest (Actif)</option>
                      <option value="Littoral">Littoral (Actif)</option>
                      <option value="Centre">Centre (Actif)</option>
                      <option value="Nord-Ouest">Nord-Ouest</option>
                      <option value="Sud-Ouest">Sud-Ouest</option>
                    </select>
                  </div>
                </div>

                {/* Type de Service */}
                <div>
                  <label className="block text-stone-300 font-semibold mb-1">Type de service :</label>
                  <select
                    value={quickService}
                    onChange={(e) => {
                      setQuickService(e.target.value as ServiceType);
                      setQuickEstimation(null);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-700 text-white font-medium"
                  >
                    <option value="pulverisation">Pulvérisation par drone (20 000 FCFA/ha)</option>
                    <option value="fertilisation">Fertilisation foliaire ciblée (22 000 FCFA/ha)</option>
                    <option value="epandage">Épandage granulaire (25 000 FCFA/ha)</option>
                    <option value="cartographie">Cartographie multispectrale (15 000 FCFA/ha)</option>
                    <option value="inspection">Inspection aérienne 4K (12 000 FCFA/ha)</option>
                  </select>
                </div>

                {/* Button Calculate or Estimation Output */}
                {quickEstimation === null ? (
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition shadow-md flex items-center justify-center gap-2"
                  >
                    <Calculator className="w-4 h-4" />
                    Obtenir une estimation
                  </button>
                ) : (
                  <div className="p-3.5 bg-emerald-950/80 border border-emerald-600/70 rounded-xl space-y-2 animate-fadeIn">
                    <div className="flex justify-between items-baseline">
                      <span className="text-stone-300">Estimation indicative :</span>
                      <span className="text-lg font-black text-emerald-300">
                        {quickEstimation.toLocaleString()} FCFA
                      </span>
                    </div>
                    <p className="text-[10px] text-stone-400">
                      Pour {quickSurface} ha de {CROP_DETAILS[quickCrop]?.name} dans la région {quickRegion} (frais de déplacement inclus).
                    </p>
                    <button
                      type="button"
                      onClick={() => onOpenBooking(quickCrop, quickService)}
                      className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black rounded-lg transition text-xs flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Demander ce devis définitif
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
