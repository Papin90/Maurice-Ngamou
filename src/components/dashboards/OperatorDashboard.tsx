import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Drone, Mission, Booking } from '../../types';
import { CROP_DETAILS } from '../../data/mockData';
import { MissionReportModal } from '../common/MissionReportModal';
import { 
  Plane, 
  BatteryCharging, 
  Wrench, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Camera, 
  DollarSign,
  ShieldCheck,
  AlertTriangle,
  Play,
  Check
} from 'lucide-react';

export const OperatorDashboard: React.FC = () => {
  const { 
    currentUser, 
    drones, 
    missions, 
    bookings, 
    operators,
    addDrone, 
    updateMissionStatus, 
    completeMissionProof 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'missions' | 'fleet' | 'profile' | 'payouts'>('missions');
  const [missionFilter, setMissionFilter] = useState<'all' | 'nouvelles' | 'en_cours' | 'terminee'>('all');
  
  // Proof of execution modal state
  const [proofMission, setProofMission] = useState<Mission | null>(null);
  const [treatedSurface, setTreatedSurface] = useState<number>(2.5);
  const [weatherCondition, setWeatherCondition] = useState<'ensoleille' | 'nuageux' | 'vent_faible' | 'vent_modere'>('ensoleille');
  const [windSpeed, setWindSpeed] = useState('4 km/h (optimal)');
  const [temperature, setTemperature] = useState('24°C');
  const [observations, setObservations] = useState('Excellente micronisation. Dérive nulle. Couverture foliaire intégrale.');
  const [beforePhoto, setBeforePhoto] = useState('https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=600&q=80');
  const [afterPhoto, setAfterPhoto] = useState('https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80');

  // Add Drone modal state
  const [showAddDroneModal, setShowAddDroneModal] = useState(false);
  const [droneModel, setDroneModel] = useState('DJI Agras T40');
  const [droneBrand, setDroneBrand] = useState('DJI Enterprise');
  const [droneSerial, setDroneSerial] = useState('AGR-T40-CM-99');
  const [droneTank, setDroneTank] = useState(40);
  const [droneBatteries, setDroneBatteries] = useState(4);
  const [droneStatus, setDroneStatus] = useState<'disponible' | 'en_mission' | 'maintenance'>('disponible');

  // View printable report state
  const [viewReportMission, setViewReportMission] = useState<Mission | null>(null);

  // Current operator record
  const currentOperator = operators.find(o => o.id === currentUser.id || o.name.includes(currentUser.name)) || operators[0];
  const myDrones = drones.filter(d => d.operator_id === currentOperator.id || d.operator_id === 'user-op-1');
  const myMissions = missions.filter(m => m.operator_id === currentOperator.id || m.operator_id === 'user-op-1');

  // Payout computations
  const totalEarnings = myMissions
    .filter(m => m.status === 'terminee')
    .reduce((acc, m) => acc + m.operator_payout, 0);

  const pendingEarnings = myMissions
    .filter(m => m.status === 'en_cours' || m.status === 'nouvelle' || m.status === 'acceptee' || m.status === 'programmee')
    .reduce((acc, m) => acc + m.operator_payout, 0);

  const handleCreateDrone = (e: React.FormEvent) => {
    e.preventDefault();
    addDrone({
      operator_id: currentOperator.id,
      operator_name: currentOperator.company_name,
      brand: droneBrand,
      model: droneModel,
      serial_number: droneSerial,
      tank_capacity_liters: Number(droneTank),
      battery_count: Number(droneBatteries),
      last_maintenance: new Date().toISOString().split('T')[0],
      acquisition_date: new Date().toISOString().split('T')[0],
      next_maintenance: '2025-12-31',
      status: droneStatus,
    });
    setShowAddDroneModal(false);
  };

  const handleOpenProofModal = (msn: Mission) => {
    setProofMission(msn);
    setTreatedSurface(msn.surface_ha);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofMission) return;
    completeMissionProof(proofMission.id, {
      actual_treated_ha: Number(treatedSurface),
      weather_condition: weatherCondition,
      observations: observations,
      before_photo: beforePhoto,
      after_photo: afterPhoto,
      start_time: '07:15',
      end_time: '08:45',
    });
    setProofMission(null);
  };

  const filteredMissions = myMissions.filter(m => {
    if (missionFilter === 'all') return true;
    if (missionFilter === 'nouvelles') return m.status === 'nouvelle';
    if (missionFilter === 'en_cours') return m.status === 'en_cours' || m.status === 'acceptee' || m.status === 'programmee';
    if (missionFilter === 'terminee') return m.status === 'terminee';
    return true;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-xs text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🚁</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
                Espace Opérateur Drone : {currentOperator.company_name}
              </h1>
            </div>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-600 flex-wrap">
              <span className="font-semibold text-sky-800">Responsable : {currentOperator.name}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600" /> {currentOperator.region} ({currentOperator.intervention_zones.join(', ')})
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Télépilote Agréé CCAA
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddDroneModal(true)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Ajouter un drone
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar font-semibold">
          {[
            { id: 'missions', label: `Missions Déployées (${myMissions.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'fleet', label: `Flotte de Drones (${myDrones.length})`, icon: <Plane className="w-4 h-4" /> },
            { id: 'payouts', label: 'Rémunérations & Retraits MoMo (75%)', icon: <DollarSign className="w-4 h-4" /> },
            { id: 'profile', label: 'Agréments & Police d’Assurance', icon: <ShieldCheck className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sky-900 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-stone-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: MISSIONS BOARD */}
        {activeTab === 'missions' && (
          <div className="space-y-6">
            {/* Quick Metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Missions Réalisées</span>
                <span className="text-2xl font-black text-gray-900 font-display mt-1 block">
                  {myMissions.filter(m => m.status === 'terminee').length}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">100% conformité MINADER</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Hectares Traités au Total</span>
                <span className="text-2xl font-black text-sky-900 font-display mt-1 block">
                  {myMissions.filter(m => m.status === 'terminee').reduce((acc, m) => acc + (m.actual_treated_ha || m.surface_ha), 0).toFixed(1)} ha
                </span>
                <span className="text-[10px] text-gray-500">Tomate, maïs, plantain</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Gains Débloqués (75%)</span>
                <span className="text-xl font-black text-emerald-800 font-display mt-1 block">
                  {totalEarnings.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Versé sur MTN Mobile Money</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Gains en Cours de Vol</span>
                <span className="text-xl font-black text-amber-700 font-display mt-1 block">
                  {pendingEarnings.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-gray-500">En attente de rapport certifié</span>
              </div>
            </div>

            {/* Sub-filters */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-600">Filtrer les missions :</span>
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'nouvelles', label: 'Nouvelles demandes' },
                { id: 'en_cours', label: 'En cours / Acceptées' },
                { id: 'terminee', label: 'Terminées avec rapport' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setMissionFilter(f.id as any)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                    missionFilter === f.id
                      ? 'bg-sky-800 text-white'
                      : 'bg-white text-gray-600 border border-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Missions List Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMissions.map((msn) => (
                <div
                  key={msn.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-sky-800 uppercase tracking-wider block">
                          Mission #{msn.id} • {msn.service.toUpperCase()}
                        </span>
                        <h4 className="font-bold text-sm text-gray-900 mt-0.5">{msn.plot_name}</h4>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {msn.locality} • {msn.surface_ha} hectares de {CROP_DETAILS[msn.crop]?.name}
                        </p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        msn.status === 'terminee'
                          ? 'bg-emerald-100 text-emerald-800'
                          : msn.status === 'en_cours'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {msn.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    {/* Client & Booking details */}
                    <div className="mt-3 p-3 bg-stone-50 rounded-xl space-y-1.5 text-[11px] text-gray-700">
                      <div className="flex justify-between">
                        <span>Client :</span>
                        <span className="font-bold text-gray-900">{msn.client_name}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Téléphone & WhatsApp :</span>
                        <div className="flex items-center gap-2">
                          <a href={`tel:${msn.client_phone}`} className="font-semibold text-sky-700 hover:underline flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {msn.client_phone}
                          </a>
                          <a href={`https://wa.me/${msn.client_phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-emerald-700">
                            <MessageSquare className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Drone assigné :</span>
                        <span className="font-semibold text-gray-800">{msn.drone_model}</span>
                      </div>
                    </div>

                    {/* Financial Split Box (25% / 75%) */}
                    <div className="mt-3 p-3 bg-sky-50/70 border border-sky-100 rounded-xl flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] text-gray-500 block">Facturé au client : {msn.total_amount.toLocaleString()} FCFA</span>
                        <span className="text-[10px] text-gray-500">Commission plateforme (25%) : {msn.agrifly_commission.toLocaleString()} FCFA</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-sky-800 block">Votre Rémunération (75%) :</span>
                        <span className="text-sm font-black text-emerald-800">
                          {msn.operator_payout.toLocaleString()} FCFA
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions according to status */}
                  <div className="pt-2 border-t border-gray-100 flex items-center justify-between gap-2">
                    {msn.status === 'nouvelle' && (
                      <button
                        onClick={() => updateMissionStatus(msn.id, 'acceptee')}
                        className="w-full py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" /> Accepter la mission
                      </button>
                    )}

                    {msn.status === 'acceptee' && (
                      <button
                        onClick={() => updateMissionStatus(msn.id, 'en_cours')}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                      >
                        <Play className="w-4 h-4" /> Démarrer le vol sur le terrain
                      </button>
                    )}

                    {msn.status === 'en_cours' && (
                      <button
                        onClick={() => handleOpenProofModal(msn)}
                        className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        <Camera className="w-4 h-4" /> Valider la Preuve d'Intervention
                      </button>
                    )}

                    {msn.status === 'terminee' && (
                      <button
                        onClick={() => setViewReportMission(msn)}
                        className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition flex items-center justify-center gap-1.5"
                      >
                        Voir le Rapport Certifié
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: FLEET */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-display">Ma Flotte de Drones Agricoles</h3>
                <p className="text-xs text-gray-500">Matériel enregistré et homologué par l'Autorité Aéronautique du Cameroun</p>
              </div>
              <button
                onClick={() => setShowAddDroneModal(true)}
                className="px-4 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Enregistrer un drone
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myDrones.map((drn) => (
                <div key={drn.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-gray-400 block">{drn.brand}</span>
                      <h4 className="font-bold text-sm text-gray-900">{drn.model}</h4>
                      <span className="font-mono text-[10px] text-sky-800">{drn.serial_number}</span>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      drn.status === 'disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {drn.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 bg-stone-50 p-3 rounded-xl">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Capacité Cuve :</span>
                      <span className="font-bold text-gray-800">{drn.tank_capacity_liters} Litres</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Packs Batteries :</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1">
                        <BatteryCharging className="w-3.5 h-3.5 text-emerald-600" /> {drn.battery_count} packs
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-gray-200">
                      <span className="text-gray-400 block text-[10px]">Dernière Révision CCAA :</span>
                      <span className="font-semibold text-gray-700">{drn.last_maintenance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: PAYOUTS */}
        {activeTab === 'payouts' && (
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display">Rémunérations & Virements Opérateur</h3>
            <p className="text-xs text-gray-600">
              Chaque intervention certifiée donne droit à 75% du montant hors taxes versé directement sous 24h par Mobile Money.
            </p>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-emerald-950">Compte de versement enregistré :</span>
                <span className="font-mono font-bold text-emerald-900">MTN Mobile Money ({currentOperator.phone})</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-emerald-800">Total déjà reversé :</span>
                <span className="font-black text-emerald-950">{totalEarnings.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white max-w-2xl mx-auto p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display">Agréments & Conformité de l'Opérateur</h3>
            <div className="space-y-3">
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Licence Télépilote :</span>
                <span className="font-bold text-gray-800">Licence Professionnelle CCAA N° 2024/CCAA/OPS-044</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Agrément Phytosanitaire :</span>
                <span className="font-bold text-gray-800">Conforme directive MINADER Traitement Aérien 2023</span>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl">
                <span className="text-[10px] text-gray-400 block">Assurance Responsabilité Civile Aérienne :</span>
                <span className="font-bold text-gray-800">Police AXA Cameroun N° RC-AERO-77189</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Proof of Intervention Modal */}
      {proofMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-stone-200 p-6 space-y-4 my-8 animate-fadeIn text-xs text-gray-800">
            <div className="border-b border-gray-100 pb-3">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Validation Terrain</span>
              <h3 className="text-base font-black font-display text-gray-900 mt-0.5">
                Valider la preuve d'intervention #{proofMission.id}
              </h3>
              <p className="text-gray-500 text-[11px]">
                {proofMission.plot_name} • Client : {proofMission.client_name}
              </p>
            </div>

            <form onSubmit={handleSubmitProof} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Superficie réelle traitée (ha) *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={treatedSurface}
                    onChange={(e) => setTreatedSurface(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Vitesse du vent au vol *</label>
                  <input
                    type="text"
                    required
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(e.target.value)}
                    placeholder="Ex: 4 km/h"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Météo constatée *</label>
                  <select
                    required
                    value={weatherCondition}
                    onChange={(e) => setWeatherCondition(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="ensoleille">Ensoleillé (optimal)</option>
                    <option value="nuageux">Nuageux (favorable)</option>
                    <option value="vent_faible">Vent faible (&lt; 10 km/h)</option>
                    <option value="vent_modere">Vent modéré (&lt; 15 km/h)</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Température ambiante *</label>
                  <input
                    type="text"
                    required
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Observations agronomiques & techniques *</label>
                <textarea
                  rows={2}
                  required
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none"
                />
              </div>

              {/* Photos upload preview */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Photo Avant Traitement</label>
                  <div className="h-24 rounded-lg overflow-hidden border border-stone-300 bg-stone-100">
                    <img src={beforePhoto} alt="Avant" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Photo Après Traitement</label>
                  <div className="h-24 rounded-lg overflow-hidden border border-stone-300 bg-stone-100">
                    <img src={afterPhoto} alt="Après" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-[11px] text-emerald-900">
                ✓ La validation génère immédiatement le rapport PDF numérique avec preuve photographique et débloque le paiement de <strong>{proofMission.operator_payout.toLocaleString()} FCFA</strong>.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProofMission(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Valider et Émettre le Rapport
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Drone Modal */}
      {showAddDroneModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-gray-900 font-display">Enregistrer un drone agricole</h3>
            <form onSubmit={handleCreateDrone} className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Modèle de drone *</label>
                <input
                  type="text"
                  required
                  value={droneModel}
                  onChange={(e) => setDroneModel(e.target.value)}
                  placeholder="Ex: DJI Agras T40 / T30 / XAG"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="font-bold text-gray-700 block mb-1">Numéro de série / Immatriculation CCAA *</label>
                <input
                  type="text"
                  required
                  value={droneSerial}
                  onChange={(e) => setDroneSerial(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Capacité cuve (L) *</label>
                  <input
                    type="number"
                    required
                    value={droneTank}
                    onChange={(e) => setDroneTank(parseFloat(e.target.value) || 20)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Packs Batteries *</label>
                  <input
                    type="number"
                    required
                    value={droneBatteries}
                    onChange={(e) => setDroneBatteries(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddDroneModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-800 hover:bg-sky-900 text-white rounded-lg font-bold"
                >
                  Enregistrer l'aéronef
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View report modal */}
      {viewReportMission && (
        <MissionReportModal
          mission={viewReportMission}
          onClose={() => setViewReportMission(null)}
        />
      )}
    </div>
  );
};
