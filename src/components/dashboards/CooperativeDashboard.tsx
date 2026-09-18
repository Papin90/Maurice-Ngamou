import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Plot, Booking, Invoice, Mission } from '../../types';
import { InteractiveMap } from '../common/InteractiveMap';
import { MissionReportModal } from '../common/MissionReportModal';
import { InvoiceModal } from '../common/InvoiceModal';
import { 
  Building2, 
  Users, 
  Layers, 
  Receipt, 
  Calendar, 
  CheckCircle2, 
  Plus, 
  MapPin, 
  Download,
  FileCheck,
  TrendingUp,
  Percent
} from 'lucide-react';

export const CooperativeDashboard: React.FC<{ onOpenBooking: () => void }> = ({ onOpenBooking }) => {
  const { currentUser, plots, bookings, invoices, missions, addPlot } = useStore();

  const [activeTab, setActiveTab] = useState<'overview' | 'producers' | 'group_bookings' | 'invoices' | 'map'>('overview');
  const [showAddProducerModal, setShowAddProducerModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Mission | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  // Group booking calculator state
  const [groupSurface, setGroupSurface] = useState<number>(35);
  const [groupProducersCount, setGroupProducersCount] = useState<number>(14);

  // Cooperative Producers state
  const [producers, setProducers] = useState([
    { id: 'prod-1', name: 'Jean-Paul Kamga', locality: 'Foumbot', crop: 'Tomate', surface: 4.5, phone: '+237 6 77 12 34 56', status: 'Traité' },
    { id: 'prod-2', name: 'Mamadou Oumarou', locality: 'Kouoptamo', crop: 'Maïs', surface: 12.0, phone: '+237 6 99 22 33 44', status: 'En attente' },
    { id: 'prod-3', name: 'Félicité Nguemo', locality: 'Foumbot Centre', crop: 'Piment', surface: 3.2, phone: '+237 6 55 44 33 22', status: 'Traité' },
    { id: 'prod-4', name: 'Ernest Tagne', locality: 'Baïgom', crop: 'Pomme de terre', surface: 6.0, phone: '+237 6 70 88 99 00', status: 'Planifié' },
    { id: 'prod-5', name: 'Honorine Mbianda', locality: 'Foumbot', crop: 'Tomate', surface: 5.8, phone: '+237 6 71 23 45 67', status: 'Traité' },
  ]);

  const [newProdName, setNewProdName] = useState('');
  const [newProdLocality, setNewProdLocality] = useState('Foumbot');
  const [newProdCrop, setNewProdCrop] = useState('Tomate');
  const [newProdSurface, setNewProdSurface] = useState(3);
  const [newProdPhone, setNewProdPhone] = useState('+237 6 ');

  const totalMembers = producers.length + 47; // Representing a full cooperative roster
  const totalSurface = producers.reduce((acc, p) => acc + p.surface, 0) + 180;
  const completedMissions = 18;

  const handleAddProducer = (e: React.FormEvent) => {
    e.preventDefault();
    setProducers([
      ...producers,
      {
        id: `prod-${Date.now()}`,
        name: newProdName,
        locality: newProdLocality,
        crop: newProdCrop,
        surface: Number(newProdSurface),
        phone: newProdPhone,
        status: 'Enregistré',
      },
    ]);
    setShowAddProducerModal(false);
    setNewProdName('');
  };

  return (
    <div className="min-h-screen bg-stone-50 py-8 text-xs text-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🤝</span>
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 font-display">
                Espace Coopérative : COOPMAN Foumbot
              </h1>
            </div>
            <p className="text-xs text-teal-800 font-semibold mt-0.5">
              Coopérative des Maraîchers du Noun • Département du Noun, Région de l'Ouest
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddProducerModal(true)}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl font-bold transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Adhérent
            </button>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold transition shadow-xs flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Commande Groupée (-15%)</span>
            </button>
          </div>
        </div>

        {/* Coop Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto no-scrollbar font-semibold">
          {[
            { id: 'overview', label: 'Tableau de Bord', icon: <Building2 className="w-4 h-4" /> },
            { id: 'producers', label: `Producteurs Membres (${producers.length})`, icon: <Users className="w-4 h-4" /> },
            { id: 'group_bookings', label: 'Commandes Groupées & Tarifs Dégressifs', icon: <Calendar className="w-4 h-4" /> },
            { id: 'map', label: 'Cartographie des Adhérents', icon: <MapPin className="w-4 h-4" /> },
            { id: 'invoices', label: 'Facturation Consolidée', icon: <Receipt className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-teal-800 text-white shadow-xs'
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
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Producteurs Adhérents</span>
                <span className="text-2xl font-black text-gray-900 font-display mt-1 block">{totalMembers}</span>
                <span className="text-[10px] text-teal-700 font-medium">Bassin Foumbot, Kouoptamo, Baïgom</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Superficie Consolidée</span>
                <span className="text-2xl font-black text-teal-900 font-display mt-1 block">{totalSurface.toFixed(0)} ha</span>
                <span className="text-[10px] text-gray-500">Tomate (60%), Pomme (25%), Piment (15%)</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Interventions Réalisées</span>
                <span className="text-2xl font-black text-emerald-800 font-display mt-1 block">{completedMissions}</span>
                <span className="text-[10px] text-emerald-700 font-medium">Zéro retard en saison des pluies</span>
              </div>
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                <span className="text-[11px] text-gray-500 font-semibold block">Économies Réalisées</span>
                <span className="text-xl font-black text-teal-950 font-display mt-1 block">1 850 000 FCFA</span>
                <span className="text-[10px] text-emerald-700 font-medium">Grâce aux remises groupées de 15%</span>
              </div>
            </div>

            {/* Group Order Simulator & Banner */}
            <div className="bg-gradient-to-r from-teal-900 to-stone-900 text-white p-6 rounded-3xl border border-teal-800 space-y-4">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <Percent className="w-5 h-5" />
                <span>Programme Mutualisé Coopérative Cameroun</span>
              </div>
              <h3 className="text-lg font-black font-display">
                Regroupez vos parcelles de Tomate et Pomme de terre pour le traitement de la semaine
              </h3>
              <p className="text-stone-300 text-xs max-w-2xl leading-relaxed">
                Lorsque la coopérative commande une intervention collective de plus de 15 hectares sur un même terroir, AgriFly dépêche 2 à 3 drones en simultané et applique une remise immédiate de 15% sur le tarif à l'hectare.
              </p>
              <button
                onClick={onOpenBooking}
                className="px-6 py-2.5 bg-teal-500 hover:bg-teal-400 text-stone-950 font-black rounded-xl text-xs transition inline-flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Lancer une réservation collective
              </button>
            </div>

            {/* Interactive Map */}
            <div className="space-y-2">
              <h3 className="font-bold text-gray-900 text-sm font-display">Répartition Géographique des Parcelles Adhérentes</h3>
              <InteractiveMap showAllData={false} />
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCERS */}
        {activeTab === 'producers' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-sm text-gray-900 font-display">Registre des Producteurs Adhérents</h3>
                <p className="text-xs text-gray-500">Coopérative COOPMAN - Gestion des superficies et des contacts</p>
              </div>
              <button
                onClick={() => setShowAddProducerModal(true)}
                className="px-4 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Ajouter un producteur
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-stone-50 border-b border-stone-200 text-gray-500 font-semibold">
                    <th className="p-3.5">Producteur</th>
                    <th className="p-3.5">Localité</th>
                    <th className="p-3.5">Culture Principale</th>
                    <th className="p-3.5">Superficie</th>
                    <th className="p-3.5">Téléphone</th>
                    <th className="p-3.5">Statut Campagne</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {producers.map((prod) => (
                    <tr key={prod.id} className="hover:bg-stone-50/50">
                      <td className="p-3.5 font-bold text-gray-900">{prod.name}</td>
                      <td className="p-3.5 text-gray-600">{prod.locality}</td>
                      <td className="p-3.5 font-semibold text-emerald-800">{prod.crop}</td>
                      <td className="p-3.5 font-black text-gray-900">{prod.surface} ha</td>
                      <td className="p-3.5 text-gray-600">{prod.phone}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                          {prod.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={onOpenBooking}
                          className="px-2.5 py-1 bg-stone-100 hover:bg-teal-100 text-teal-900 font-bold rounded-lg transition"
                        >
                          Programmer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: GROUP BOOKINGS */}
        {activeTab === 'group_bookings' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="font-bold text-base text-gray-900 font-display">
                Calculateur de Commande Groupée Coopérative
              </h3>
              <p className="text-xs text-gray-600">
                Simulez le tarif dégressif pour l’ensemble des producteurs de votre secteur avant de soumettre la demande.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Nombre d'adhérents regroupés :</label>
                  <input
                    type="number"
                    min="2"
                    value={groupProducersCount}
                    onChange={(e) => setGroupProducersCount(parseInt(e.target.value) || 2)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold text-gray-700 block mb-1">Superficie totale cumulée (ha) :</label>
                  <input
                    type="number"
                    min="5"
                    value={groupSurface}
                    onChange={(e) => setGroupSurface(parseFloat(e.target.value) || 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-bold"
                  />
                </div>
              </div>

              {/* Discount Box */}
              <div className="p-4 bg-teal-50 rounded-xl border border-teal-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div>
                  <span className="text-xs font-bold text-teal-900 block">
                    Tarif standard : {(groupSurface * 20000).toLocaleString()} FCFA (20 000 FCFA/ha)
                  </span>
                  <span className="text-sm font-black text-emerald-800">
                    Tarif coopératif remisé (-15%) : {(groupSurface * 17000).toLocaleString()} FCFA (17 000 FCFA/ha)
                  </span>
                  <p className="text-[10px] text-teal-700 mt-0.5">
                    Soit une économie directe de {(groupSurface * 3000).toLocaleString()} FCFA pour la coopérative !
                  </p>
                </div>
                <button
                  onClick={onOpenBooking}
                  className="px-6 py-2.5 bg-teal-800 hover:bg-teal-900 text-white rounded-xl font-bold text-xs shadow-xs"
                >
                  Valider ce dossier groupé
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MAP */}
        {activeTab === 'map' && (
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-gray-900 font-display">Vue Aérienne et Cadastre des Parcelles du Bassin de Foumbot</h3>
            <InteractiveMap showAllData={true} />
          </div>
        )}

        {/* TAB 5: INVOICES */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="p-5 border-b border-stone-100">
              <h3 className="font-bold text-sm text-gray-900 font-display">Facturation Centralisée Coopérative</h3>
              <p className="text-xs text-gray-500">Bordereaux de paiement groupés et quittances MINADER</p>
            </div>
            <div className="p-6 text-center text-gray-500">
              Toutes les factures de vos producteurs sont agrégées ici avec possibilité de virement bancaire ou paiement échelonné Mobile Money.
            </div>
          </div>
        )}

      </div>

      {/* Add Producer Modal */}
      {showAddProducerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl border border-stone-200 space-y-4 animate-fadeIn">
            <h3 className="text-base font-bold text-gray-900 font-display">Enregistrer un producteur adhérent</h3>
            <form onSubmit={handleAddProducer} className="space-y-3">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nom complet *</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  placeholder="Ex: Paulin Fotso"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Localité *</label>
                  <input
                    type="text"
                    required
                    value={newProdLocality}
                    onChange={(e) => setNewProdLocality(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Culture *</label>
                  <input
                    type="text"
                    required
                    value={newProdCrop}
                    onChange={(e) => setNewProdCrop(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Superficie (ha) *</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={newProdSurface}
                    onChange={(e) => setNewProdSurface(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={newProdPhone}
                    onChange={(e) => setNewProdPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddProducerModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-800 hover:bg-teal-900 text-white rounded-lg font-bold"
                >
                  Enregistrer l'adhérent
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
