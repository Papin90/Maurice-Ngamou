import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Booking, Operator, Drone, ServicePricing, CameroonRegion } from '../../types';
import { CROP_DETAILS } from '../../data/mockData';
import { 
  ShieldAlert, 
  DollarSign, 
  Users, 
  Plane, 
  Calendar, 
  Layers, 
  Settings, 
  TrendingUp, 
  Download, 
  CheckCircle2, 
  XCircle, 
  Edit, 
  Save, 
  Filter,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    bookings, 
    operators, 
    drones, 
    plots, 
    pricing, 
    regions,
    updateBookingStatus, 
    assignOperatorAndDrone,
    updateOperatorStatus,
    updatePricing
  } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'operators' | 'fleet' | 'pricing' | 'regions'>('overview');
  
  // Status filter for bookings
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Assign modal state
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<Booking | null>(null);
  const [assignOpId, setAssignOpId] = useState('');
  const [assignDroneModel, setAssignDroneModel] = useState('DJI Agras T40');

  // Pricing inline edit state
  const [editingPricing, setEditingPricing] = useState<Record<string, number>>({});

  // Financial aggregates
  const totalRevenue = bookings
    .filter(b => b.status === 'terminee' || b.status === 'rapport_disponible' || b.status === 'confirmee')
    .reduce((acc, b) => acc + b.total_price, 0);

  const agriflyCommissionTotal = Math.round(totalRevenue * 0.25);
  const operatorsPayoutTotal = totalRevenue - agriflyCommissionTotal;
  const totalHectaresTreated = bookings
    .filter(b => b.status === 'terminee' || b.status === 'rapport_disponible')
    .reduce((acc, b) => acc + b.surface_ha, 0);

  const pendingBookings = bookings.filter(b => b.status === 'demande_envoyee' || b.status === 'en_attente_devis');

  const handleSavePricing = (serviceId: string) => {
    const newPrice = editingPricing[serviceId];
    if (newPrice) {
      updatePricing(serviceId, { price_per_hectare: newPrice });
      const copy = { ...editingPricing };
      delete copy[serviceId];
      setEditingPricing(copy);
    }
  };

  const handleConfirmAssign = () => {
    if (!selectedBookingForAssign || !assignOpId) return;
    const targetDrone = drones[0]?.id || 'drn-1';
    assignOperatorAndDrone(
      selectedBookingForAssign.id,
      assignOpId,
      targetDrone,
      selectedBookingForAssign.preferred_date || new Date().toISOString().split('T')[0]
    );
    setSelectedBookingForAssign(null);
  };

  // Export CSV
  const handleExportBookingsCsv = () => {
    const headers = 'ID,Date,Client,Telephone,Parcelle,Region,Culture,Superficie_HA,Service,Statut,Montant_FCFA\n';
    const rows = bookings.map(b => 
      `"${b.id}","${b.preferred_date}","${b.client_name}","${b.client_phone}","${b.plot_name}","${b.region}","${b.crop}",${b.surface_ha},"${b.service}","${b.status}",${b.total_price}`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `agrifly-reservations-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredBookings = bookings.filter(b => {
    if (statusFilter === 'all') return true;
    return b.status === statusFilter;
  });

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-xs text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🛡️</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
                Direction Générale & Supervision : AgriFly HQ
              </h1>
            </div>
            <p className="text-xs text-purple-900 font-semibold mt-0.5">
              Supervision Nationale • Dispatching & Barèmes Tarifaires Cameroun
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleExportBookingsCsv}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" /> Exporter Données (CSV)
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar font-semibold">
          {[
            { id: 'overview', label: 'Vue d’Ensemble Financière', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'bookings', label: `Réservations & Dispatching (${bookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'operators', label: `Opérateurs & Candidatures (${operators.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'fleet', label: `Flotte Nationale (${drones.length} drones)`, icon: <Plane className="w-4 h-4" /> },
            { id: 'pricing', label: 'Configuration des Tarifs (FCFA)', icon: <Settings className="w-4 h-4" /> },
            { id: 'regions', label: 'Régions & Disponibilités', icon: <Layers className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-950 text-white shadow-xs'
                  : 'bg-white text-gray-600 hover:bg-stone-100'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Financial Top KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Volume d'Affaires Brut</span>
                <span className="text-2xl font-black text-gray-900 font-display mt-1 block">
                  {totalRevenue.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Prestations commandées</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Commission AgriFly (25%)</span>
                <span className="text-2xl font-black text-purple-900 font-display mt-1 block">
                  {agriflyCommissionTotal.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-purple-700 font-medium">Revenu net de la plateforme</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Reversé aux Opérateurs (75%)</span>
                <span className="text-2xl font-black text-sky-900 font-display mt-1 block">
                  {operatorsPayoutTotal.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-sky-700 font-medium">Économie locale distribuée</span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Demandes à Traiter</span>
                <span className="text-2xl font-black text-amber-700 font-display mt-1 block">
                  {pendingBookings.length}
                </span>
                <span className="text-[10px] text-amber-800 font-medium">En attente d'affectation</span>
              </div>
            </div>

            {/* Regional breakdown & quick dispatch */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-gray-900 font-display">
                  Répartition Géographique du Traitement Aérien
                </h3>
                <div className="space-y-3">
                  {regions.map((reg) => (
                    <div key={reg.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span>{reg.name}</span>
                        <span>{reg.total_parcels} parcelles ({reg.active_operators} télépilotes)</span>
                      </div>
                      <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-600 rounded-full"
                          style={{ width: `${Math.min(100, reg.total_parcels * 2)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <h3 className="font-bold text-sm text-gray-900 font-display">
                  Spéculations Agricoles les Plus Traitées
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-xl">🍅</span>
                    <span className="font-bold text-gray-900 block mt-1">Tomate (Noun & Ouest)</span>
                    <span className="text-[10px] text-gray-500">45% des volumes traités</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-xl">🥔</span>
                    <span className="font-bold text-gray-900 block mt-1">Pomme de terre (Dschang)</span>
                    <span className="text-[10px] text-gray-500">25% des volumes traités</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-xl">🌽</span>
                    <span className="font-bold text-gray-900 block mt-1">Maïs (Centre & Ouest)</span>
                    <span className="text-[10px] text-gray-500">18% des volumes traités</span>
                  </div>
                  <div className="p-3 bg-stone-50 rounded-xl">
                    <span className="text-xl">🍌</span>
                    <span className="font-bold text-gray-900 block mt-1">Banane (Moungo)</span>
                    <span className="text-[10px] text-gray-500">12% des volumes traités</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS MANAGEMENT & DISPATCH */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-sm text-gray-900 font-display">Supervision et Dispatching des Missions</h3>
                <p className="text-xs text-gray-500">Assignez les opérateurs et approuvez les devis émis</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-gray-300 rounded-lg text-xs"
                >
                  <option value="all">Tous les statuts</option>
                  <option value="demande_envoyee">Demande envoyée</option>
                  <option value="confirmee">Confirmée</option>
                  <option value="operateur_affecte">Opérateur affecté</option>
                  <option value="en_cours">En cours</option>
                  <option value="terminee">Terminée</option>
                  <option value="rapport_disponible">Rapport disponible</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">ID / Date</th>
                    <th className="p-3.5">Client & Contact</th>
                    <th className="p-3.5">Parcelle & Culture</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Opérateur Assigné</th>
                    <th className="p-3.5">Montant Total</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredBookings.map((bkg) => (
                    <tr key={bkg.id} className="hover:bg-stone-50/50">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block">#{bkg.id}</span>
                        <span className="text-[10px] text-gray-400">{bkg.preferred_date}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-900 block">{bkg.client_name}</span>
                        <span className="text-[10px] text-gray-500">{bkg.client_phone}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-900 block">{bkg.plot_name}</span>
                        <span className="text-[10px] text-gray-500">{bkg.surface_ha} ha ({bkg.locality})</span>
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-800">
                        {bkg.service.toUpperCase()}
                      </td>
                      <td className="p-3.5">
                        {bkg.operator_name ? (
                          <span className="font-semibold text-gray-800">{bkg.operator_name}</span>
                        ) : (
                          <span className="text-rose-600 font-bold">Non assigné</span>
                        )}
                      </td>
                      <td className="p-3.5 font-black text-gray-900">
                        {bkg.total_price.toLocaleString()} FCFA
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800">
                          {bkg.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => {
                            setSelectedBookingForAssign(bkg);
                            setAssignOpId(operators[0]?.id || '');
                          }}
                          className="px-2.5 py-1 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-bold text-[11px]"
                        >
                          Dispatcher
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: OPERATORS MANAGEMENT */}
        {activeTab === 'operators' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-sm text-gray-900 font-display">Opérateurs & Candidatures Partenaires</h3>
              <p className="text-xs text-gray-500">Validation des licences de télépilotage CCAA et des assurances professionnelles</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">Entreprise & Responsable</th>
                    <th className="p-3.5">Région & Zones</th>
                    <th className="p-3.5">Téléphone / WhatsApp</th>
                    <th className="p-3.5">Assurance & Certif</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {operators.map((op) => (
                    <tr key={op.id} className="hover:bg-stone-50/50">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-900 block">{op.company_name}</span>
                        <span className="text-[10px] text-gray-500">{op.name}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-800 block">{op.region}</span>
                        <span className="text-[10px] text-gray-500">{op.intervention_zones.join(', ')}</span>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        {op.phone}
                      </td>
                      <td className="p-3.5 text-[10px] text-gray-600">
                        <span>{op.insurance_number || 'En attente'}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          op.verification_status === 'verifie'
                            ? 'bg-emerald-100 text-emerald-800'
                            : op.verification_status === 'en_verification'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {op.verification_status.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        {op.verification_status !== 'verifie' ? (
                          <button
                            onClick={() => updateOperatorStatus(op.id, 'verifie')}
                            className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold text-[10px]"
                          >
                            Valider
                          </button>
                        ) : (
                          <button
                            onClick={() => updateOperatorStatus(op.id, 'suspendu')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px]"
                          >
                            Suspendre
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: FLEET */}
        {activeTab === 'fleet' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drones.map((drn) => (
              <div key={drn.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 block">{drn.brand}</span>
                    <h4 className="font-bold text-sm text-gray-900">{drn.model}</h4>
                    <span className="font-mono text-[10px] text-purple-900">{drn.serial_number}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    {drn.status}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-gray-600 space-y-1">
                  <div>Cuve : <strong>{drn.tank_capacity_liters} Litres</strong></div>
                  <div>Batteries : <strong>{drn.battery_count} packs</strong></div>
                  <div>Dernière maintenance : <strong>{drn.last_maintenance}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: PRICING CONFIGURATION */}
        {activeTab === 'pricing' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-sm text-gray-900 font-display">Barème Tarifaire des Services (FCFA / Hectare)</h3>
              <p className="text-xs text-gray-500">Modifiez en direct les tarifs appliqués dans le Booking Wizard et sur le simulateur</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Tarif Actuel (FCFA / ha)</th>
                    <th className="p-3.5">Surface Minimale</th>
                    <th className="p-3.5">Frais Déplacement Inclus</th>
                    <th className="p-3.5 text-right">Modifier le Tarif</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {pricing.map((item) => (
                    <tr key={item.service_id} className="hover:bg-stone-50/50">
                      <td className="p-3.5 font-bold text-gray-900">
                        {item.service_name}
                      </td>
                      <td className="p-3.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            step="1000"
                            value={editingPricing[item.service_id] ?? item.price_per_hectare}
                            onChange={(e) => {
                              setEditingPricing({
                                ...editingPricing,
                                [item.service_id]: parseFloat(e.target.value) || 0,
                              });
                            }}
                            className="w-32 px-3 py-1.5 border border-gray-300 rounded-lg font-black text-emerald-900"
                          />
                          <span className="font-bold text-gray-600">FCFA</span>
                        </div>
                      </td>
                      <td className="p-3.5 font-semibold text-gray-700">
                        {item.minimum_surface} ha
                      </td>
                      <td className="p-3.5 text-gray-700">
                        {item.travel_fee_base.toLocaleString()} FCFA
                      </td>
                      <td className="p-3.5 text-right">
                        {editingPricing[item.service_id] !== undefined && (
                          <button
                            onClick={() => handleSavePricing(item.service_id)}
                            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold flex items-center gap-1 ml-auto"
                          >
                            <Save className="w-3.5 h-3.5" /> Enregistrer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REGIONS */}
        {activeTab === 'regions' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {regions.map((reg) => (
              <div key={reg.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-sm text-gray-900">{reg.name}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    reg.status === 'disponible' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-gray-500'
                  }`}>
                    {reg.status === 'disponible' ? 'Active' : 'Désactivée'}
                  </span>
                </div>
                <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-gray-600 space-y-1">
                  <div>Chef-lieu : <strong>{reg.capital}</strong></div>
                  <div>Opérateurs certifiés : <strong>{reg.active_operators}</strong></div>
                  <div>Parcelles répertoriées : <strong>{reg.total_parcels}</strong></div>
                  <div>Cultures phares : <strong>{reg.key_crops.join(', ')}</strong></div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Assign Operator Modal */}
      {selectedBookingForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-gray-900 font-display">
              Dispatcher la Réservation #{selectedBookingForAssign.id}
            </h3>
            <p className="text-xs text-gray-600">
              {selectedBookingForAssign.plot_name} ({selectedBookingForAssign.surface_ha} ha de {selectedBookingForAssign.crop}) • Région {selectedBookingForAssign.region}
            </p>

            <div className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Sélectionner l'Opérateur Partenaire :</label>
                <select
                  value={assignOpId}
                  onChange={(e) => setAssignOpId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                >
                  {operators.map((op) => (
                    <option key={op.id} value={op.id}>
                      {op.company_name} ({op.region} - {op.name})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Modèle de Drone Affecté :</label>
                <select
                  value={assignDroneModel}
                  onChange={(e) => setAssignDroneModel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                >
                  <option value="DJI Agras T40">DJI Agras T40 (Cuve 40L)</option>
                  <option value="DJI Agras T30">DJI Agras T30 (Cuve 30L)</option>
                  <option value="DJI Mavic 3 Multispectral">DJI Mavic 3 Multispectral (NDVI)</option>
                  <option value="XAG P100 Pro">XAG P100 Pro (Cuve 50L)</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                onClick={() => setSelectedBookingForAssign(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAssign}
                className="px-5 py-2 bg-purple-900 hover:bg-purple-800 text-white rounded-lg font-bold"
              >
                Confirmer l'Affectation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
