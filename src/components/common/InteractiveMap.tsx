import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Plot, Operator } from '../../types';
import { MapPin, Navigation, ShieldCheck, Layers, Eye, EyeOff, Radio } from 'lucide-react';
import { CROP_DETAILS } from '../../data/mockData';

interface InteractiveMapProps {
  interactive?: boolean;
  selectedPlotId?: string;
  onSelectPlot?: (plot: Plot) => void;
  showAllData?: boolean;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  interactive = true,
  selectedPlotId,
  onSelectPlot,
  showAllData = false,
}) => {
  const { plots, operators, currentUser } = useStore();
  const [activeFilter, setActiveFilter] = useState<'all' | 'plots' | 'operators'>('all');
  const [selectedEntity, setSelectedEntity] = useState<{
    type: 'plot' | 'operator';
    item: Plot | Operator;
  } | null>(null);
  const [protectPrivacy, setProtectPrivacy] = useState(true);

  // Filter plots: farmers only see their own plots unless showAllData is true or admin/operator
  const visiblePlots = plots.filter(plot => {
    if (showAllData || currentUser.role === 'admin' || currentUser.role === 'super_admin' || currentUser.role === 'operator') {
      return true;
    }
    return plot.user_id === currentUser.id;
  });

  // Map coordinates normalized to SVG viewBox 0 0 800 650
  // Cameroon bounds approx: Lat 2.0 to 7.0, Lng 8.5 to 12.5 (Focusing on South-West-Littoral-Centre agricultural belt)
  const projectToMap = (lat: number, lng: number) => {
    // Cameroon agricultural corridor mapping (lat ~ 3.5 to 6.2, lng ~ 9.0 to 11.8)
    const minLat = 3.5;
    const maxLat = 6.4;
    const minLng = 8.8;
    const maxLng = 12.2;

    const x = ((lng - minLng) / (maxLng - minLng)) * 700 + 50;
    const y = ((maxLat - lat) / (maxLat - minLat)) * 520 + 60;
    return { x: Math.max(40, Math.min(760, x)), y: Math.max(40, Math.min(600, y)) };
  };

  return (
    <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header controls */}
      <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-stone-50/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              Cartographie Agricole du Cameroun
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Radio className="w-3 h-3 mr-1 text-emerald-600 animate-pulse" /> Réseau Actif
              </span>
            </h3>
            <p className="text-xs text-gray-500">
              Supervision des bassins de production et opérateurs partenaires
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer Filter */}
          <div className="inline-flex bg-white rounded-lg p-1 border border-gray-200 text-xs shadow-xs">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeFilter === 'all' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => setActiveFilter('plots')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeFilter === 'plots' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Parcelles ({visiblePlots.length})
            </button>
            <button
              onClick={() => setActiveFilter('operators')}
              className={`px-2.5 py-1 rounded-md font-medium transition ${
                activeFilter === 'operators' ? 'bg-emerald-700 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Opérateurs ({operators.length})
            </button>
          </div>

          {/* Privacy protection toggle */}
          <button
            onClick={() => setProtectPrivacy(!protectPrivacy)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
            title="Conformité RGPD/MINADER : Protège les coordonnées cadastrales privées"
          >
            {protectPrivacy ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">GPS Anonymisé</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">GPS Précis</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* SVG Interactive Map Container */}
      <div className="relative w-full h-[380px] sm:h-[460px] bg-gradient-to-b from-stone-100 via-emerald-50/30 to-stone-100 overflow-hidden select-none">
        <svg
          viewBox="0 0 800 650"
          className="w-full h-full object-contain filter drop-shadow-xs"
        >
          {/* Subtle Grid Lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(22, 101, 52, 0.05)" strokeWidth="1" />
            </pattern>
            {/* Region Gradients */}
            <linearGradient id="regionWest" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#86efac" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="regionLittoral" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.5" />
            </linearGradient>
          </defs>

          <rect width="800" height="650" fill="url(#grid)" />

          {/* Regional Polygons approximation for Cameroon West/Littoral/Centre agricultural corridor */}
          {/* OUEST REGION (Noun, Mifi, Menoua, Bamboutos) */}
          <g>
            <path
              d="M 380,120 L 530,110 L 610,180 L 590,270 L 460,290 L 390,220 Z"
              fill="url(#regionWest)"
              stroke="#16a34a"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="transition hover:opacity-80"
            />
            <text x="470" y="190" className="text-[13px] font-bold fill-emerald-900/80 pointer-events-none tracking-wide">
              RÉGION DE L'OUEST
            </text>
            <text x="470" y="206" className="text-[10px] fill-emerald-700/80 pointer-events-none">
              Noun • Mifi • Menoua (Bassin Tomate & Pomme)
            </text>
          </g>

          {/* LITTORAL REGION (Moungo, Wouri, Loum, Penja, Douala) */}
          <g>
            <path
              d="M 180,240 L 390,220 L 450,340 L 320,440 L 160,370 Z"
              fill="url(#regionLittoral)"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              className="transition hover:opacity-80"
            />
            <text x="240" y="320" className="text-[13px] font-bold fill-sky-950/80 pointer-events-none tracking-wide">
              LITTORAL
            </text>
            <text x="240" y="336" className="text-[10px] fill-sky-800/80 pointer-events-none">
              Moungo • Loum • Douala (Banane & Poivre)
            </text>
          </g>

          {/* CENTRE REGION (Obala, Soa, Yaoundé) */}
          <g>
            <path
              d="M 460,290 L 590,270 L 680,390 L 560,520 L 450,420 Z"
              fill="#fef08a"
              fillOpacity="0.35"
              stroke="#ca8a04"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <text x="540" y="380" className="text-[13px] font-bold fill-amber-950/80 pointer-events-none tracking-wide">
              CENTRE
            </text>
            <text x="540" y="396" className="text-[10px] fill-amber-800/80 pointer-events-none">
              Obala • Yaoundé • Mfoundi (Maïs & Maraîchers)
            </text>
          </g>

          {/* Key Reference Cities */}
          {[
            { name: 'Foumbot (Noun)', lat: 5.5123, lng: 10.6318 },
            { name: 'Bafoussam (Mifi)', lat: 5.4831, lng: 10.4215 },
            { name: 'Dschang (Menoua)', lat: 5.4430, lng: 10.0530 },
            { name: 'Loum (Moungo)', lat: 4.7183, lng: 9.7351 },
            { name: 'Douala (Wouri)', lat: 4.0511, lng: 9.7679 },
            { name: 'Yaoundé / Obala', lat: 3.8480, lng: 11.5021 },
          ].map((city) => {
            const pos = projectToMap(city.lat, city.lng);
            return (
              <g key={city.name} className="pointer-events-none">
                <circle cx={pos.x} cy={pos.y} r="3.5" fill="#475569" stroke="#fff" strokeWidth="1" />
                <text x={pos.x + 6} y={pos.y + 3} className="text-[10px] font-semibold fill-stone-700">
                  {city.name}
                </text>
              </g>
            );
          })}

          {/* PLOT MARKERS */}
          {(activeFilter === 'all' || activeFilter === 'plots') &&
            visiblePlots.map((plot) => {
              const pos = projectToMap(plot.coordinates.lat, plot.coordinates.lng);
              const isSelected = selectedPlotId === plot.id || (selectedEntity?.type === 'plot' && selectedEntity.item.id === plot.id);
              const cropInfo = CROP_DETAILS[plot.crop] || { emoji: '🌱', name: plot.crop };

              return (
                <g
                  key={plot.id}
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => {
                    setSelectedEntity({ type: 'plot', item: plot });
                    onSelectPlot?.(plot);
                  }}
                >
                  {/* Privacy Radius or Exact Marker */}
                  {protectPrivacy ? (
                    <circle
                      cx={pos.x}
                      cy={pos.y}
                      r={Math.max(14, Math.min(30, plot.surface_ha * 4))}
                      fill="#16a34a"
                      fillOpacity="0.22"
                      stroke="#16a34a"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  ) : null}

                  {/* Marker Pin */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? '16' : '13'}
                    fill={isSelected ? '#15803d' : '#ffffff'}
                    stroke={isSelected ? '#ffffff' : '#166534'}
                    strokeWidth="2.5"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 4}
                    textAnchor="middle"
                    fontSize="12"
                    className="pointer-events-none select-none"
                  >
                    {cropInfo.emoji}
                  </text>
                </g>
              );
            })}

          {/* OPERATOR DRONE MARKERS */}
          {(activeFilter === 'all' || activeFilter === 'operators') &&
            operators.map((op) => {
              // Position operator based on headquarters
              let lat = 5.4831;
              let lng = 10.4215;
              if (op.region === 'Littoral') {
                lat = 4.7183;
                lng = 9.7351;
              } else if (op.company_name.includes('Noun')) {
                lat = 5.5123;
                lng = 10.6318;
              } else if (op.name.includes('Fotso')) {
                lat = 5.4430;
                lng = 10.0530;
              }

              const pos = projectToMap(lat, lng);
              const isSelected = selectedEntity?.type === 'operator' && selectedEntity.item.id === op.id;

              return (
                <g
                  key={op.id}
                  className="cursor-pointer transition-transform duration-200 hover:scale-110"
                  onClick={() => setSelectedEntity({ type: 'operator', item: op })}
                >
                  {/* Operational radius circle */}
                  <circle
                    cx={pos.x + 12}
                    cy={pos.y - 10}
                    r="24"
                    fill="#0284c7"
                    fillOpacity="0.12"
                    stroke="#0284c7"
                    strokeWidth="1"
                  />
                  {/* Drone operator badge */}
                  <circle
                    cx={pos.x + 12}
                    cy={pos.y - 10}
                    r={isSelected ? '14' : '11'}
                    fill={isSelected ? '#0369a1' : '#0284c7'}
                    stroke="#ffffff"
                    strokeWidth="2"
                    className="filter drop-shadow-md"
                  />
                  <text
                    x={pos.x + 12}
                    y={pos.y - 6}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9"
                    fontWeight="bold"
                    className="pointer-events-none select-none"
                  >
                    🚁
                  </text>
                </g>
              );
            })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-gray-200 text-xs shadow-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-600 border border-white"></span>
            <span className="text-gray-700 font-medium">Parcelles agricoles répertoriées</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sky-600 border border-white"></span>
            <span className="text-gray-700 font-medium">Opérateurs certifiés disponibles</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 pt-0.5 border-t border-gray-100">
            <span>🛡️ Rayon protecteur conforme MINADER</span>
          </div>
        </div>

        {/* Selected Entity Card Modal Overlay */}
        {selectedEntity && (
          <div className="absolute top-3 right-3 max-w-xs w-full bg-white rounded-xl shadow-xl border border-emerald-100 p-3.5 animate-fadeIn z-10">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {selectedEntity.type === 'plot' ? 'Parcelle Agricole' : 'Opérateur Partenaire'}
                </span>
                <h4 className="text-sm font-bold text-gray-900 mt-1">
                  {selectedEntity.type === 'plot' 
                    ? (selectedEntity.item as Plot).name 
                    : (selectedEntity.item as Operator).company_name}
                </h4>
              </div>
              <button
                onClick={() => setSelectedEntity(null)}
                className="text-gray-400 hover:text-gray-700 text-xs p-1"
              >
                ✕
              </button>
            </div>

            {selectedEntity.type === 'plot' ? (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Culture :</span>
                  <span className="font-semibold text-emerald-800">
                    {CROP_DETAILS[(selectedEntity.item as Plot).crop]?.emoji}{' '}
                    {CROP_DETAILS[(selectedEntity.item as Plot).crop]?.name}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Superficie :</span>
                  <span className="font-semibold text-gray-800">{(selectedEntity.item as Plot).surface_ha} ha</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Localité :</span>
                  <span className="text-gray-800">{(selectedEntity.item as Plot).locality} ({(selectedEntity.item as Plot).region})</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Statut :</span>
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-medium">
                    {(selectedEntity.item as Plot).status}
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-xs text-gray-600 space-y-1">
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Pilote :</span>
                  <span className="font-semibold text-gray-800">{(selectedEntity.item as Operator).name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Drones certifiés :</span>
                  <span className="font-semibold text-sky-800">{(selectedEntity.item as Operator).drones_count} appareils</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-500">Missions réalisées :</span>
                  <span className="font-semibold text-emerald-700">{(selectedEntity.item as Operator).completed_missions} interventions</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-gray-500">Note :</span>
                  <span className="font-semibold text-amber-600">★ {(selectedEntity.item as Operator).rating} / 5</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
