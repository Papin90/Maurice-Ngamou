import React from 'react';
import { useStore } from '../../lib/store';
import { ServiceType } from '../../types';
import { 
  Droplet, 
  Sprout, 
  ScatterChart, 
  Map, 
  Eye, 
  ClipboardList, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectService: (service: ServiceType) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectService }) => {
  const { pricing } = useStore();

  const servicesData: Array<{
    id: ServiceType;
    title: string;
    icon: React.ReactNode;
    image: string;
    summary: string;
    details: string[];
  }> = [
    {
      id: 'pulverisation',
      title: 'Pulvérisation Agricole',
      icon: <Droplet className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=800&q=80',
      summary: 'Traitement ultra-précis des cultures vivrières et maraîchères contre champignons, insectes et bactérioses.',
      details: [
        'Effet vortex des hélices déposant le produit sous les feuilles',
        'Zéro compaction du sol, même en saison des pluies',
        'Vitesse : 1 hectare traité en 12 à 15 minutes',
      ],
    },
    {
      id: 'fertilisation',
      title: 'Fertilisation Foliaire',
      icon: <Sprout className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
      summary: 'Application ciblée d’engrais solubles et biostimulants homologués pour booster la vigueur végétative.',
      details: [
        'Assimilation foliaire immédiate par les stomates',
        'Correction rapide des carences en azote, phosphore, potasse',
        'Dosage métrique uniforme sans surdosage',
      ],
    },
    {
      id: 'epandage',
      title: 'Épandage Granulaire',
      icon: <ScatterChart className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=800&q=80',
      summary: 'Épandage de granulés solides, engrais de fond et semences de couverture sur grandes superficies.',
      details: [
        'Trémie de 40L à 50L pour fort débit',
        'Disque centrifuge à largeur de semis réglable (jusqu’à 7m)',
        'Idéal pour maïs, riz et légumineuses',
      ],
    },
    {
      id: 'cartographie',
      title: 'Cartographie & NDVI',
      icon: <Map className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80',
      summary: 'Orthophotographie haute définition et analyse par capteurs multispectraux pour évaluer la santé des parcelles.',
      details: [
        'Cartes d’indices de végétation (NDVI, NDRE)',
        'Détection précoce du stress hydrique et zones malades',
        'Fichiers de prescription compatibles avec épandage modulé',
      ],
    },
    {
      id: 'inspection',
      title: 'Inspection des Parcelles',
      icon: <Eye className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=800&q=80',
      summary: 'Surveillance visuelle 4K de parcelles inaccessibles, comptage de peuplement et contrôle de clôtures.',
      details: [
        'Repérage des foyers de ravageurs avant propagation',
        'Comptage de plants d’arbres fruitiers et bananiers',
        'Évaluation des dégâts climatiques (inondations, vents forts)',
      ],
    },
    {
      id: 'suivi',
      title: 'Suivi Agricole Récurrent',
      icon: <ClipboardList className="w-5 h-5 text-emerald-700" />,
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80',
      summary: 'Carnet sanitaire numérique saisonnier et accompagnement agronomique avec nos experts partenaires.',
      details: [
        'Historique complet des passages et dosages',
        'Rapports comparatifs avant/après archivés',
        'Alertes personnalisées selon le cycle de vos cultures',
      ],
    },
  ];

  return (
    <section id="services" className="py-20 bg-stone-50 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
            Nos Prestations Par Drone
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-900 font-display tracking-tight">
            Des services technologiques pour booster vos rendements
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Interventions rapides, précises et respectueuses des sols camerounais, réalisées par des télépilotes agréés avec du matériel de pointe.
          </p>
        </div>

        {/* Services Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((service) => {
            const pricingItem = pricing.find(p => p.service_id === service.id);
            const price = pricingItem ? pricingItem.price_per_hectare : 20000;

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md hover:border-emerald-300 transition flex flex-col justify-between"
              >
                <div>
                  {/* Service Image */}
                  <div className="relative h-48 bg-stone-200 overflow-hidden">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    
                    {/* Floating Price Pill */}
                    <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs px-3 py-1 rounded-lg shadow-sm">
                      <span className="text-xs font-black text-emerald-900">
                        {price.toLocaleString()} FCFA
                      </span>
                      <span className="text-[10px] text-gray-500"> / ha</span>
                    </div>

                    <div className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-sm">
                      {service.icon}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 font-display">
                        {service.title}
                      </h3>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {service.summary}
                      </p>
                    </div>

                    <ul className="space-y-2 text-xs text-gray-700">
                      {service.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectService(service.id)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-stone-900 hover:bg-emerald-700 text-white transition flex items-center justify-center gap-2 shadow-xs"
                  >
                    <span>Demander ce service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Regulatory note */}
        <div className="mt-12 p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-center max-w-2xl mx-auto text-xs text-emerald-900">
          <p>
            <strong>Note importante :</strong> Les produits phytosanitaires sont appliqués conformément aux préconisations légales du MINADER. AgriFly Cameroun privilégie la réduction des doses grâce à l'efficacité de ciblage métrique des buses à centrifugation.
          </p>
        </div>
      </div>
    </section>
  );
};
