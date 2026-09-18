import React from 'react';
import { useStore } from '../../lib/store';
import { Layers, Users, Building2, Plane, CheckCircle } from 'lucide-react';

export const StatsSection: React.FC = () => {
  const { stats } = useStore();

  const statCards = [
    {
      icon: <Layers className="w-6 h-6 text-emerald-600" />,
      value: `${stats.totalHectaresTreated.toLocaleString(undefined, { maximumFractionDigits: 1 })} ha`,
      label: 'Hectares traités',
      sublabel: 'Surveillance et pulvérisation de précision',
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      value: `${stats.totalFarmersSupported}+`,
      label: 'Agriculteurs accompagnés',
      sublabel: 'Petites et moyennes exploitations',
    },
    {
      icon: <Building2 className="w-6 h-6 text-emerald-600" />,
      value: `${stats.totalPartnerCooperatives}`,
      label: 'Coopératives partenaires',
      sublabel: 'Traitements mutualisés & groupés',
    },
    {
      icon: <Plane className="w-6 h-6 text-emerald-600" />,
      value: `${stats.totalPartnerOperators}`,
      label: 'Opérateurs certifiés',
      sublabel: 'Pilotes et flottes partenaires',
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-emerald-600" />,
      value: `${stats.totalCompletedMissions}`,
      label: 'Interventions réalisées',
      sublabel: 'Rapports avant/après certifiés',
    },
  ];

  return (
    <section className="bg-white border-b border-stone-200 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-4">
          {statCards.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 rounded-2xl bg-stone-50/60 border border-stone-100 hover:border-emerald-200 transition"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100/70 flex items-center justify-center mb-3">
                {item.icon}
              </div>
              <span className="text-2xl sm:text-3xl font-black text-gray-900 font-display">
                {item.value}
              </span>
              <span className="text-xs font-bold text-emerald-950 mt-1">
                {item.label}
              </span>
              <span className="text-[11px] text-gray-500 mt-0.5">
                {item.sublabel}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
