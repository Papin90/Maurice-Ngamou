import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Plot, Booking, Invoice, Mission, CropType } from '../../types';
import { CROP_DETAILS } from '../../data/mockData';
import { InteractiveMap } from '../common/InteractiveMap';
import { MissionReportModal } from '../common/MissionReportModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { 
  LayoutDashboard, 
  MapPin, 
  Calendar, 
  Receipt, 
  FileCheck, 
  User, 
  Plus, 
  Trash2, 
  Edit3, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Download,
  ExternalLink,
  Smartphone,
  Eye
} from 'lucide-react';

export const FarmerDashboard: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { currentUser, plots, bookings, invoices, missions, addPlot, deletePlot } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'plots' | 'bookings' | 'invoices' | 'reports' | 'profile'>('overview');
  const [showAddPlotModal, setShowAddPlotModal] = useState(false);
  const [selectedReportMission, setSelectedReportMission] = useState<Mission | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // New plot form state
  const [plotName, setPlotName] = useState('');
  const [plotRegion, setPlotRegion] = useState('Ouest');
  const [plotDepartment, setPlotDepartment] = useState('Noun');
  const [plotLocality, setPlotLocality] = useState('Foumbot');
  const [plotSurface, setPlotSurface] = useState<number>(2.5);
  const [plotCrop, setPlotCrop] = useState<CropType>('tomate');
  const [plotDate, setPlotDate] = useState(new Date().toISOString().split('T')[0]);
  const [plotLat, setPlotLat] = useState<number>(5.5123);
  const [plotLng, setPlotLng] = useState<number>(10.6318);
  const [plotNotes, setPlotNotes] = useState('');

  // Filter farmer data
  const myPlots = plots.filter(p => p.user_id === currentUser.id);
  const myBookings = bookings.filter(b => b.client_id === currentUser.id);
  const myInvoices = invoices.filter(inv => myBookings.some(b => b.id === inv.booking_id) || inv.client_name.includes(currentUser.name));
  const myMissions = missions.filter(m => myBookings.some(b => b.id === m.booking_id));

  // Computed metrics
  const totalHectares = myPlots.reduce((acc, p) => acc + p.surface_ha, 0);
  const totalSpent = myInvoices
    .filter(i => i.status === 'payee' || i.status === 'acompte_verse')
    .reduce((acc, i) => acc + (i.status === 'payee' ? i.amount : i.deposit_amount), 0);
  const pendingInterventions = myBookings.filter(b => b.status !== 'terminee' && b.status !== 'rapport_disponible' && b.status !== 'annulee');
  const completedInterventions = myBookings.filter(b => b.status === 'terminee' || b.status === 'rapport_disponible');

  const handleCreatePlot = (e: React.FormEvent) => {
    e.preventDefault();
    addPlot({
      name: plotName || `Parcelle ${plotLocality}`,
      region: plotRegion,
      department: plotDepartment,
      locality: plotLocality,
      surface_ha: Number(plotSurface),
      crop: plotCrop,
      planting_date: plotDate,
      coordinates: { lat: Number(plotLat), lng: Number(plotLng) },
      status: 'active',
      notes: plotNotes,
      user_id: currentUser.id,
    });
    setShowAddPlotModal(false);
    setPlotName('');
  };

  const getStatusBadge = (status: Booking['status']) => {
    const map: Record<string, { label: string; color: string }> = {
      demande_envoyee: { label: 'Demande envoyée', color: 'bg-stone-100 text-stone-800' },
      en_attente_devis: { label: 'En attente de devis', color: 'bg-amber-100 text-amber-800' },
      devis_envoye: { label: 'Devis envoyé', color: 'bg-sky-100 text-sky-800' },
      acompte_demande: { label: 'Acompte demandé', color: 'bg-amber-100 text-amber-800' },
      confirmee: { label: 'Confirmée', color: 'bg-emerald-100 text-emerald-800' },
      operateur_affecte: { label: 'Opérateur affecté', color: 'bg-teal-100 text-teal-800' },
      en_cours: { label: 'En cours d’intervention', color: 'bg-blue-100 text-blue-800 animate-pulse' },
      terminee: { label: 'Intervention terminée', color: 'bg-emerald-100 text-emerald-800' },
      rapport_disponible: { label: 'Rapport disponible ✓', color: 'bg-emerald-600 text-white font-bold' },
      annulee: { label: 'Annulée', color: 'bg-rose-100 text-rose-800' },
    };
    const s = map[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${s.color}`}>{s.label}</span>;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-xs text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Dashboard Top Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👨‍🌾</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
                Espace Agriculteur : {currentUser.name}
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {currentUser.organization || 'Exploitation agricole'} • {currentUser.locality} ({currentUser.region})
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddPlotModal(true)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter une parcelle</span>
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Demander une intervention</span>
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar font-semibold">
          {[
            { id: 'overview', label: 'Vue Générale', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'plots', label: `Mes Parcelles (${myPlots.length})`, icon: <MapPin className="w-4 h-4" /> },
            { id: 'bookings', label: `Mes Réservations (${myBookings.length})`, icon: <Calendar className="w-4 h-4" /> },
            { id: 'invoices', label: `Mes Factures (${myInvoices.length})`, icon: <Receipt className="w-4 h-4" /> },
            { id: 'reports', label: `Mes Rapports (${myMissions.length})`, icon: <FileCheck className="w-4 h-4" /> },
            { id: 'profile', label: 'Profil & Coordonnées', icon: <User className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-emerald-800 text-white shadow-xs'
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
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Parcelles Enregistrées</span>
                <span className="text-2xl font-black text-gray-900 font-display mt-1 block">
                  {myPlots.length}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  {totalHectares.toFixed(1)} ha sous gestion
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Interventions Terminées</span>
                <span className="text-2xl font-black text-emerald-800 font-display mt-1 block">
                  {completedInterventions.length}
                </span>
                <span className="text-[10px] text-gray-500">
                  Avec rapport d’intervention certifié
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Missions en Attente</span>
                <span className="text-2xl font-black text-amber-700 font-display mt-1 block">
                  {pendingInterventions.length}
                </span>
                <span className="text-[10px] text-gray-500">
                  Planifiées sous 48h à 72h
                </span>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Montant Réglé</span>
                <span className="text-xl font-black text-gray-900 font-display mt-1 block">
                  {totalSpent.toLocaleString()} FCFA
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">
                  Règlements sécurisés Mobile Money
                </span>
              </div>
            </div>

            {/* Map & Recent Reservations */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Plot Map Preview (7 cols) */}
              <div className="lg:col-span-7">
                <InteractiveMap showAllData={false} />
              </div>

              {/* Recent Bookings Activity (5 cols) */}
              <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 font-display text-sm">
                    Interventions Récientes & Statuts
                  </h3>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className="text-emerald-700 font-bold text-[11px] hover:underline"
                  >
                    Voir tout
                  </button>
                </div>

                {myBookings.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    Aucune réservation en cours. Cliquez sur "Demander une intervention".
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myBookings.slice(0, 4).map((bkg) => (
                      <div
                        key={bkg.id}
                        className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col gap-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{bkg.plot_name}</span>
                          {getStatusBadge(bkg.status)}
                        </div>

                        <div className="flex justify-between text-gray-500 text-[11px]">
                          <span>
                            {CROP_DETAILS[bkg.crop]?.emoji} {bkg.surface_ha} ha • {bkg.service}
                          </span>
                          <span className="font-bold text-gray-800">
                            {bkg.total_price.toLocaleString()} FCFA
                          </span>
                        </div>

                        {bkg.status === 'rapport_disponible' && bkg.mission_id && (
                          <button
                            onClick={() => {
                              const targetMission = missions.find(m => m.id === bkg.mission_id);
                              if (targetMission) setSelectedReportMission(targetMission);
                            }}
                            className="mt-1 w-full py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-lg font-bold flex items-center justify-center gap-1.5 transition"
                          >
                            <FileCheck className="w-3.5 h-3.5" /> Voir le Rapport d'Intervention
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PLOTS */}
        {activeTab === 'plots' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-gray-900 font-display">Mes Parcelles Agricoles</h3>
                <p className="text-xs text-gray-500">Gérez vos coordonnées cadastrales et cultures en place</p>
              </div>
              <button
                onClick={() => setShowAddPlotModal(true)}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" /> Nouvelle parcelle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myPlots.map((plot) => (
                <div
                  key={plot.id}
                  className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-2xl">{CROP_DETAILS[plot.crop]?.emoji || '🌱'}</span>
                        <h4 className="font-bold text-sm text-gray-900 mt-1">{plot.name}</h4>
                        <p className="text-[11px] text-emerald-800 font-semibold">{plot.locality} ({plot.region})</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold text-[10px]">
                        {plot.surface_ha} ha
                      </span>
                    </div>

                    <div className="p-2.5 bg-stone-50 rounded-xl space-y-1 text-[11px] text-gray-600">
                      <div className="flex justify-between">
                        <span>Culture :</span>
                        <span className="font-semibold text-gray-800">{CROP_DETAILS[plot.crop]?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date de semis :</span>
                        <span>{plot.planting_date || 'Non renseignée'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Coordonnées GPS :</span>
                        <span className="font-mono text-[10px]">
                          {plot.coordinates.lat.toFixed(4)}, {plot.coordinates.lng.toFixed(4)}
                        </span>
                      </div>
                    </div>

                    {plot.notes && (
                      <p className="text-[11px] text-gray-500 italic bg-amber-50/50 p-2 rounded border border-amber-100">
                        "{plot.notes}"
                      </p>
                    )}
                  </div>

                  <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between">
                    <button
                      onClick={onOpenBooking}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800"
                    >
                      Traiter cette parcelle →
                    </button>
                    <button
                      onClick={() => deletePlot(plot.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
                      title="Supprimer la parcelle"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: BOOKINGS */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-gray-900 font-display">Historique de mes Réservations</h3>
                <p className="text-xs text-gray-500">Suivi en temps réel de l'affectation des télépilotes et des vols</p>
              </div>
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Réserver
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">Réf & Date</th>
                    <th className="p-3.5">Parcelle & Culture</th>
                    <th className="p-3.5">Service</th>
                    <th className="p-3.5">Opérateur / Drone</th>
                    <th className="p-3.5">Tarif Total</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myBookings.map((bkg) => (
                    <tr key={bkg.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-3.5 font-medium">
                        <span className="font-bold text-gray-900 block">#{bkg.id}</span>
                        <span className="text-[11px] text-gray-500">{bkg.preferred_date}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-900 block">{bkg.plot_name}</span>
                        <span className="text-[11px] text-gray-500">
                          {CROP_DETAILS[bkg.crop]?.emoji} {bkg.surface_ha} ha ({bkg.locality})
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-emerald-900">
                        {bkg.service.toUpperCase()}
                      </td>
                      <td className="p-3.5 text-gray-600">
                        {bkg.operator_name ? (
                          <>
                            <span className="font-semibold text-gray-800 block">{bkg.operator_name}</span>
                            <span className="text-[10px] text-gray-400">{bkg.drone_model || 'Drone agricole'}</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic">En cours d'affectation</span>
                        )}
                      </td>
                      <td className="p-3.5 font-bold text-gray-900">
                        {bkg.total_price.toLocaleString()} FCFA
                      </td>
                      <td className="p-3.5">
                        {getStatusBadge(bkg.status)}
                      </td>
                      <td className="p-3.5 text-right">
                        {bkg.status === 'rapport_disponible' && (
                          <button
                            onClick={() => {
                              const targetMission = missions.find(m => m.id === bkg.mission_id) || missions[0];
                              setSelectedReportMission(targetMission);
                            }}
                            className="px-2.5 py-1 bg-emerald-600 text-white rounded-lg font-bold hover:bg-emerald-500 transition text-[11px]"
                          >
                            Rapport PDF
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

        {/* TAB 4: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-sm text-gray-900 font-display">Mes Factures & Règlements</h3>
              <p className="text-xs text-gray-500">Paiements sécurisés MTN Mobile Money & Orange Money Cameroun</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">Facture N°</th>
                    <th className="p-3.5">Dossier</th>
                    <th className="p-3.5">Montant Total</th>
                    <th className="p-3.5">Acompte / Solde</th>
                    <th className="p-3.5">Statut</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {myInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-stone-50/50 transition">
                      <td className="p-3.5 font-bold text-gray-900">
                        #{inv.id}
                        <span className="block text-[10px] text-gray-400 font-normal">Émise le {inv.issue_date}</span>
                      </td>
                      <td className="p-3.5 text-gray-700">
                        Réservation #{inv.booking_id}
                      </td>
                      <td className="p-3.5 font-black text-gray-900">
                        {inv.amount.toLocaleString()} FCFA
                      </td>
                      <td className="p-3.5">
                        <span className="text-emerald-700 font-semibold block">Acompte : {inv.deposit_amount.toLocaleString()} FCFA</span>
                        <span className="text-gray-500 text-[10px]">Solde dû : {inv.balance_due.toLocaleString()} FCFA</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          inv.status === 'payee'
                            ? 'bg-emerald-100 text-emerald-800'
                            : inv.status === 'acompte_verse'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {inv.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold hover:bg-emerald-700 transition"
                        >
                          {inv.status === 'payee' ? 'Voir Facture' : 'Payer MoMo'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS */}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-gray-900 font-display">Mes Rapports d'Intervention Numériques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myMissions.filter(m => m.status === 'terminee').map((msn) => (
                <div key={msn.id} className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-black text-sm text-emerald-950 font-display">{msn.plot_name}</span>
                      <p className="text-xs text-gray-500">Date de survol : {msn.date}</p>
                    </div>
                    <span className="px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg font-bold text-[10px]">
                      {msn.actual_treated_ha || msn.surface_ha} ha traités
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-28 rounded-lg overflow-hidden relative bg-stone-100">
                      <img src={msn.before_photo} alt="Avant" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] px-1 rounded">Avant</span>
                    </div>
                    <div className="h-28 rounded-lg overflow-hidden relative bg-stone-100">
                      <img src={msn.after_photo} alt="Après" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 left-1 bg-emerald-800 text-white text-[9px] px-1 rounded">Après</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-gray-600 bg-stone-50 p-2.5 rounded-xl">
                    <p><strong>Pilote :</strong> {msn.operator_name}</p>
                    <p><strong>Drone :</strong> {msn.drone_model}</p>
                    <p className="line-clamp-2 mt-1 italic">"{msn.observations}"</p>
                  </div>

                  <button
                    onClick={() => setSelectedReportMission(msn)}
                    className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center justify-center gap-1.5 transition"
                  >
                    <FileCheck className="w-4 h-4" /> Télécharger / Imprimer le Rapport Officiel
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: PROFILE */}
        {activeTab === 'profile' && (
          <div className="bg-white max-w-2xl mx-auto p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display">Informations Personnelles & Préférences</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Nom / Exploitation</label>
                <input type="text" readOnly value={currentUser.name} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Email</label>
                <input type="text" readOnly value={currentUser.email} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Téléphone d'appel</label>
                <input type="text" readOnly value={currentUser.phone} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Numéro WhatsApp</label>
                <input type="text" readOnly value={currentUser.whatsapp} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Région</label>
                <input type="text" readOnly value={currentUser.region} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Localité</label>
                <input type="text" readOnly value={currentUser.locality} className="w-full px-3 py-2 bg-stone-50 border border-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Add Plot Modal */}
      {showAddPlotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl border border-stone-200 animate-fadeIn space-y-4">
            <h3 className="text-base font-bold text-gray-900 font-display">
              Ajouter une nouvelle parcelle agricole
            </h3>

            <form onSubmit={handleCreatePlot} className="space-y-3">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nom de la parcelle *</label>
                <input
                  type="text"
                  required
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="Ex: Champ de Tomate - Noun Ouest"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Culture *</label>
                  <select
                    value={plotCrop}
                    onChange={(e) => setPlotCrop(e.target.value as CropType)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="tomate">🍅 Tomate</option>
                    <option value="pomme_de_terre">🥔 Pomme de terre</option>
                    <option value="mais">🌽 Maïs</option>
                    <option value="piment">🌶️ Piment</option>
                    <option value="maraichage">🥬 Maraîchage</option>
                    <option value="banane_plantain">🍌 Banane / Plantain</option>
                    <option value="oignon">🧅 Oignon</option>
                    <option value="autre">🌱 Autre</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Superficie (ha) *</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={plotSurface}
                    onChange={(e) => setPlotSurface(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Région</label>
                  <select
                    value={plotRegion}
                    onChange={(e) => setPlotRegion(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg bg-white text-xs"
                  >
                    <option value="Ouest">Ouest</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Centre">Centre</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Département</label>
                  <input
                    type="text"
                    value={plotDepartment}
                    onChange={(e) => setPlotDepartment(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Localité</label>
                  <input
                    type="text"
                    value={plotLocality}
                    onChange={(e) => setPlotLocality(e.target.value)}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPlotModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-bold"
                >
                  Enregistrer la parcelle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modals for report & invoice */}
      {selectedReportMission && (
        <MissionReportModal
          mission={selectedReportMission}
          onClose={() => setSelectedReportMission(null)}
        />
      )}

      {selectedInvoice && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}
    </div>
  );
};
