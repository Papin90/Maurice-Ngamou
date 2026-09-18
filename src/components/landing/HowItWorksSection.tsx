import React from 'react';
import { 
  MapPin, 
  Settings2, 
  Calculator, 
  CalendarCheck, 
  FileCheck,
  ArrowRight
} from 'lucide-react';

export const HowItWorksSection: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const steps = [
    {
      num: '01',
      title: 'Enregistrez votre parcelle',
      desc: 'Indiquez la superficie en hectares, la culture en place et la localisation GPS (Foumbot, Loum, Dschang, etc.).',
      icon: <MapPin className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: '02',
      title: 'Choisissez le service',
      desc: 'Sélectionnez pulvérisation, fertilisation foliaire, épandage, cartographie NDVI ou inspection par drone.',
      icon: <Settings2 className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: '03',
      title: 'Recevez votre devis instantané',
      desc: 'La plateforme calcule automatiquement l’estimation en FCFA selon la superficie, le service et les barèmes configurés.',
      icon: <Calculator className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: '04',
      title: 'Planifiez l’intervention',
      desc: 'Choisissez la date et le créneau. Un opérateur partenaire certifié et son drone agricole sont immédiatement réservés.',
      icon: <CalendarCheck className="w-5 h-5 text-emerald-700" />,
    },
    {
      num: '05',
      title: 'Recevez votre rapport certifié',
      desc: 'Dès le vol achevé, téléchargez votre rapport officiel avec photos avant/après, météo et preuve de conformité MINADER.',
      icon: <FileCheck className="w-5 h-5 text-emerald-700" />,
    },
  ];

  return (
    <section id="comment-ca-marche" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Processus Simple & Sécurisé
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Comment fonctionne AgriFly Cameroun ?
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            De la demande en ligne au survol de vos plantations, un parcours clair pensé pour les exploitants camerounais.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <div
              key={step.num}
              className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black text-emerald-800 font-display">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-sm font-bold text-gray-900 font-display mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-stone-300">
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="text-center mt-12">
          <button
            onClick={onOpenBooking}
            className="px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition shadow-md inline-flex items-center gap-2"
          >
            <span>Démarrer une réservation en 2 minutes</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
