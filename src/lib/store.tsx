import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Plot, 
  Booking, 
  Drone, 
  Operator, 
  Mission, 
  Invoice, 
  ServicePricing, 
  CooperativeMember, 
  BlogArticle, 
  CameroonRegion,
  UserRole,
  ServiceType,
  BookingStatus
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PLOTS, 
  INITIAL_PRICING, 
  INITIAL_DRONES, 
  INITIAL_OPERATORS, 
  INITIAL_BOOKINGS, 
  INITIAL_MISSIONS, 
  INITIAL_INVOICES, 
  INITIAL_COOP_MEMBERS, 
  CAMEROON_REGIONS, 
  BLOG_ARTICLES 
} from '../data/mockData';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
}

interface StoreContextType {
  currentUser: UserProfile;
  allUsers: UserProfile[];
  switchUser: (role: UserRole) => void;
  language: 'fr' | 'en';
  setLanguage: (lang: 'fr' | 'en') => void;

  plots: Plot[];
  addPlot: (plot: Omit<Plot, 'id' | 'created_at'>) => Plot;
  updatePlot: (id: string, updates: Partial<Plot>) => void;
  deletePlot: (id: string) => void;

  pricing: ServicePricing[];
  updatePricing: (id: string, updates: Partial<ServicePricing>) => void;

  bookings: Booking[];
  createBooking: (newBooking: Omit<Booking, 'id' | 'created_at' | 'status' | 'deposit_paid'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, extra?: Partial<Booking>) => void;
  assignOperatorAndDrone: (bookingId: string, operatorId: string, droneId: string, scheduledDate: string) => void;

  drones: Drone[];
  addDrone: (drone: Omit<Drone, 'id'>) => void;
  updateDroneStatus: (id: string, status: Drone['status']) => void;

  operators: Operator[];
  updateOperatorStatus: (id: string, status: Operator['verification_status']) => void;
  addOperatorApplication: (operator: Omit<Operator, 'id' | 'completed_missions' | 'rating' | 'drones_count'>) => void;

  missions: Mission[];
  updateMissionStatus: (id: string, status: Mission['status']) => void;
  completeMissionProof: (missionId: string, proofData: {
    before_photo: string;
    after_photo: string;
    start_time: string;
    end_time: string;
    actual_treated_ha: number;
    observations: string;
    weather_condition: 'ensoleille' | 'nuageux' | 'vent_faible' | 'vent_modere';
  }) => void;

  invoices: Invoice[];
  markInvoicePaid: (invoiceId: string, paymentMethod: 'mtn_momo' | 'orange_money' | 'virement', ref: string) => void;

  coopMembers: CooperativeMember[];
  addCoopMember: (member: Omit<CooperativeMember, 'id'>) => void;

  articles: BlogArticle[];
  regions: CameroonRegion[];
  updateRegionStatus: (regionId: string, status: CameroonRegion['status']) => void;

  stats: {
    totalHectaresTreated: number;
    totalFarmersSupported: number;
    totalPartnerCooperatives: number;
    totalPartnerOperators: number;
    totalCompletedMissions: number;
    totalRevenueFCFA: number;
    agriflyCommissionFCFA: number;
    operatorPayoutsFCFA: number;
    pendingBookingsCount: number;
  };

  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
  resetToDemoData: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

const STORAGE_KEY_PREFIX = 'agrifly_cm_';

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error('Storage error:', err);
  }
}

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => 
    loadStorage('current_user', INITIAL_USERS[0])
  );
  const [plots, setPlots] = useState<Plot[]>(() => loadStorage('plots', INITIAL_PLOTS));
  const [pricing, setPricing] = useState<ServicePricing[]>(() => loadStorage('pricing', INITIAL_PRICING));
  const [bookings, setBookings] = useState<Booking[]>(() => loadStorage('bookings', INITIAL_BOOKINGS));
  const [drones, setDrones] = useState<Drone[]>(() => loadStorage('drones', INITIAL_DRONES));
  const [operators, setOperators] = useState<Operator[]>(() => loadStorage('operators', INITIAL_OPERATORS));
  const [missions, setMissions] = useState<Mission[]>(() => loadStorage('missions', INITIAL_MISSIONS));
  const [invoices, setInvoices] = useState<Invoice[]>(() => loadStorage('invoices', INITIAL_INVOICES));
  const [coopMembers, setCoopMembers] = useState<CooperativeMember[]>(() => loadStorage('coop_members', INITIAL_COOP_MEMBERS));
  const [regions, setRegions] = useState<CameroonRegion[]>(() => loadStorage('regions', CAMEROON_REGIONS));
  const [articles] = useState<BlogArticle[]>(() => loadStorage('articles', BLOG_ARTICLES));
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Auto-sync to LocalStorage
  useEffect(() => saveStorage('current_user', currentUser), [currentUser]);
  useEffect(() => saveStorage('plots', plots), [plots]);
  useEffect(() => saveStorage('pricing', pricing), [pricing]);
  useEffect(() => saveStorage('bookings', bookings), [bookings]);
  useEffect(() => saveStorage('drones', drones), [drones]);
  useEffect(() => saveStorage('operators', operators), [operators]);
  useEffect(() => saveStorage('missions', missions), [missions]);
  useEffect(() => saveStorage('invoices', invoices), [invoices]);
  useEffect(() => saveStorage('coop_members', coopMembers), [coopMembers]);
  useEffect(() => saveStorage('regions', regions), [regions]);

  const addToast = (toast: Omit<ToastNotification, 'id'>) => {
    const id = 'toast_' + Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts(prev => [...prev, { ...toast, id }]);
    setTimeout(() => removeToast(id), 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const switchUser = (role: UserRole) => {
    let target = INITIAL_USERS.find(u => u.role === role);
    if (!target) {
      if (role === 'admin') target = INITIAL_USERS.find(u => u.role === 'super_admin');
      else target = INITIAL_USERS[0];
    }
    if (target) {
      setCurrentUser(target);
      addToast({
        type: 'info',
        title: 'Profil actif changé',
        message: `Vous naviguez maintenant en tant que : ${target.name} (${target.role.toUpperCase()})`
      });
    }
  };

  const addPlot = (plotData: Omit<Plot, 'id' | 'created_at'>): Plot => {
    const newPlot: Plot = {
      ...plotData,
      id: 'plt_' + Date.now(),
      created_at: new Date().toISOString(),
      user_id: currentUser.id,
      farmer_name: currentUser.name
    };
    setPlots(prev => [newPlot, ...prev]);
    addToast({
      type: 'success',
      title: 'Parcelle enregistrée',
      message: `La parcelle "${newPlot.name}" (${newPlot.surface_ha} ha) a été ajoutée avec succès.`
    });
    return newPlot;
  };

  const updatePlot = (id: string, updates: Partial<Plot>) => {
    setPlots(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast({
      type: 'success',
      title: 'Parcelle mise à jour',
      message: 'Les modifications de la parcelle ont été enregistrées.'
    });
  };

  const deletePlot = (id: string) => {
    setPlots(prev => prev.filter(p => p.id !== id));
    addToast({
      type: 'info',
      title: 'Parcelle supprimée',
      message: 'La parcelle a été retirée de votre compte.'
    });
  };

  const updatePricing = (id: string, updates: Partial<ServicePricing>) => {
    setPricing(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    addToast({
      type: 'success',
      title: 'Tarif mis à jour',
      message: 'La grille tarifaire a été recalculée pour les prochains devis.'
    });
  };

  const createBooking = (newBookingData: Omit<Booking, 'id' | 'created_at' | 'status' | 'deposit_paid'>): Booking => {
    const id = 'bkg_' + (100 + bookings.length + 1);
    const newBooking: Booking = {
      ...newBookingData,
      id,
      status: 'demande_envoyee',
      deposit_paid: false,
      created_at: new Date().toISOString(),
    };
    setBookings(prev => [newBooking, ...prev]);

    // Create corresponding pending invoice
    const newInvoice: Invoice = {
      id: 'fac_' + new Date().getFullYear() + '_' + String(invoices.length + 1).padStart(3, '0'),
      booking_id: id,
      client_name: newBooking.client_name,
      client_type: newBooking.client_type,
      amount: newBooking.total_price,
      deposit_amount: newBooking.deposit_amount,
      balance_due: newBooking.total_price - (newBooking.deposit_paid ? newBooking.deposit_amount : 0),
      status: 'en_attente',
      issue_date: new Date().toISOString().split('T')[0],
      due_date: newBooking.preferred_date,
    };
    setInvoices(prev => [newInvoice, ...prev]);

    addToast({
      type: 'success',
      title: 'Demande d’intervention envoyée !',
      message: `Votre réservation #${newBooking.id} de ${newBooking.surface_ha} ha à ${newBooking.locality} a été reçue.`
    });
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, extra?: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status, ...(extra || {}) } : b));
    addToast({
      type: 'info',
      title: 'Statut de réservation mis à jour',
      message: `La réservation #${id} est passée à : ${status.replace(/_/g, ' ').toUpperCase()}`
    });
  };

  const assignOperatorAndDrone = (bookingId: string, operatorId: string, droneId: string, scheduledDate: string) => {
    const op = operators.find(o => o.id === operatorId);
    const dr = drones.find(d => d.id === droneId);
    const bkg = bookings.find(b => b.id === bookingId);
    if (!bkg) return;

    // Update booking
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: 'operateur_affecte',
          operator_id: operatorId,
          operator_name: op ? op.name : 'Opérateur Certifié',
          drone_id: droneId,
          drone_model: dr ? dr.model : 'Drone Agricole',
          scheduled_date: scheduledDate,
        };
      }
      return b;
    }));

    // Generate mission entry for operator
    const missionId = 'msn_' + (200 + missions.length + 1);
    const totalAmount = bkg.total_price;
    const agriflyCommission = Math.round(totalAmount * 0.25);
    const operatorPayout = totalAmount - agriflyCommission;

    const newMission: Mission = {
      id: missionId,
      booking_id: bookingId,
      plot_name: bkg.plot_name,
      client_name: bkg.client_name,
      client_phone: bkg.client_phone,
      locality: bkg.locality,
      region: bkg.region,
      surface_ha: bkg.surface_ha,
      crop: bkg.crop,
      service: bkg.service,
      date: scheduledDate,
      time_slot: bkg.time_slot === 'matin_06h_10h' ? '06h30 - 09h30' : '15h30 - 18h00',
      operator_id: operatorId,
      operator_name: op ? op.name : 'Opérateur',
      drone_id: droneId,
      drone_model: dr ? dr.model : 'Drone',
      total_amount: totalAmount,
      agrifly_commission: agriflyCommission,
      operator_payout: operatorPayout,
      status: 'programmee',
      weather_condition: 'ensoleille',
      regulatory_compliance_check: true,
    };

    setMissions(prev => [newMission, ...prev]);

    // Update drone status
    setDrones(prev => prev.map(d => d.id === droneId ? { ...d, status: 'en_mission' } : d));

    addToast({
      type: 'success',
      title: 'Mission programmée et affectée',
      message: `Opérateur ${op?.name} affecté à la mission #${missionId} avec le drone ${dr?.model}.`
    });
  };

  const addDrone = (droneData: Omit<Drone, 'id'>) => {
    const newDrone: Drone = {
      ...droneData,
      id: 'drn_' + Date.now(),
    };
    setDrones(prev => [newDrone, ...prev]);
    addToast({
      type: 'success',
      title: 'Drone enregistré',
      message: `${newDrone.brand} ${newDrone.model} (S/N: ${newDrone.serial_number}) ajouté à la flotte.`
    });
  };

  const updateDroneStatus = (id: string, status: Drone['status']) => {
    setDrones(prev => prev.map(d => d.id === id ? { ...d, status } : d));
  };

  const updateOperatorStatus = (id: string, status: Operator['verification_status']) => {
    setOperators(prev => prev.map(o => o.id === id ? { ...o, verification_status: status } : o));
    addToast({
      type: 'info',
      title: 'Statut opérateur actualisé',
      message: `Opérateur mis à jour : ${status.toUpperCase()}`
    });
  };

  const addOperatorApplication = (opData: Omit<Operator, 'id' | 'completed_missions' | 'rating' | 'drones_count'>) => {
    const newOp: Operator = {
      ...opData,
      id: 'op_appl_' + Date.now(),
      completed_missions: 0,
      rating: 5.0,
      drones_count: 1,
    };
    setOperators(prev => [newOp, ...prev]);
    addToast({
      type: 'success',
      title: 'Candidature enregistrée !',
      message: 'Votre dossier partenaire a été transmis à l’équipe AgriFly pour validation.'
    });
  };

  const updateMissionStatus = (id: string, status: Mission['status']) => {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, status } : m));
  };

  const completeMissionProof = (
    missionId: string, 
    proofData: {
      before_photo: string;
      after_photo: string;
      start_time: string;
      end_time: string;
      actual_treated_ha: number;
      observations: string;
      weather_condition: 'ensoleille' | 'nuageux' | 'vent_faible' | 'vent_modere';
    }
  ) => {
    const targetMission = missions.find(m => m.id === missionId);
    if (!targetMission) return;

    setMissions(prev => prev.map(m => {
      if (m.id === missionId) {
        return {
          ...m,
          ...proofData,
          status: 'terminee',
          regulatory_compliance_check: true,
        };
      }
      return m;
    }));

    // Update booking status
    if (targetMission.booking_id) {
      setBookings(prev => prev.map(b => {
        if (b.id === targetMission.booking_id) {
          return {
            ...b,
            status: 'rapport_disponible',
            mission_id: missionId,
          };
        }
        return b;
      }));
    }

    // Set drone back to disponible
    if (targetMission.drone_id) {
      setDrones(prev => prev.map(d => d.id === targetMission.drone_id ? { ...d, status: 'disponible' } : d));
    }

    // Increment completed missions for operator
    setOperators(prev => prev.map(o => o.id === targetMission.operator_id ? { ...o, completed_missions: o.completed_missions + 1 } : o));

    addToast({
      type: 'success',
      title: 'Intervention terminée & Rapport généré !',
      message: `Preuve d’intervention validée pour ${proofData.actual_treated_ha} ha. Le rapport client est disponible au téléchargement.`
    });
  };

  const markInvoicePaid = (invoiceId: string, paymentMethod: 'mtn_momo' | 'orange_money' | 'virement', ref: string) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        return {
          ...inv,
          status: 'payee',
          balance_due: 0,
          payment_method: paymentMethod,
          transaction_ref: ref,
        };
      }
      return inv;
    }));

    // Update corresponding booking
    const invoice = invoices.find(i => i.id === invoiceId);
    if (invoice && invoice.booking_id) {
      setBookings(prev => prev.map(b => {
        if (b.id === invoice.booking_id) {
          return {
            ...b,
            deposit_paid: true,
            status: b.status === 'demande_envoyee' || b.status === 'devis_envoye' ? 'confirmee' : b.status
          };
        }
        return b;
      }));
    }

    addToast({
      type: 'success',
      title: 'Paiement confirmé',
      message: `Facture #${invoiceId} réglée via ${paymentMethod.replace('_', ' ').toUpperCase()} (Réf: ${ref}).`
    });
  };

  const addCoopMember = (memberData: Omit<CooperativeMember, 'id'>) => {
    const newMember: CooperativeMember = {
      ...memberData,
      id: 'mbr_' + Date.now(),
    };
    setCoopMembers(prev => [...prev, newMember]);
    addToast({
      type: 'success',
      title: 'Producteur ajouté',
      message: `${newMember.name} (${newMember.surface_ha} ha de ${newMember.crop}) rattaché à la coopérative.`
    });
  };

  const updateRegionStatus = (regionId: string, status: CameroonRegion['status']) => {
    setRegions(prev => prev.map(r => r.id === regionId ? { ...r, status } : r));
    addToast({
      type: 'info',
      title: 'Couverture régionale mise à jour',
      message: 'Statut de disponibilité géographique actualisé.'
    });
  };

  const resetToDemoData = () => {
    setPlots(INITIAL_PLOTS);
    setPricing(INITIAL_PRICING);
    setBookings(INITIAL_BOOKINGS);
    setDrones(INITIAL_DRONES);
    setOperators(INITIAL_OPERATORS);
    setMissions(INITIAL_MISSIONS);
    setInvoices(INITIAL_INVOICES);
    setCoopMembers(INITIAL_COOP_MEMBERS);
    setRegions(CAMEROON_REGIONS);
    setCurrentUser(INITIAL_USERS[0]);
    addToast({
      type: 'info',
      title: 'Données réinitialisées',
      message: 'Toutes les données de démonstration camerounaises ont été remises à zéro.'
    });
  };

  // Dynamic calculated statistics
  const completedMissionsList = missions.filter(m => m.status === 'terminee');
  const baseHistoricalHa = 348.5; // realistic historical base
  const totalHectaresTreated = baseHistoricalHa + completedMissionsList.reduce((acc, m) => acc + (m.actual_treated_ha || m.surface_ha), 0);
  
  const totalFarmersSupported = 68 + plots.length;
  const totalPartnerCooperatives = 12;
  const totalPartnerOperators = operators.filter(o => o.verification_status === 'verifie').length;
  const totalCompletedMissions = 74 + completedMissionsList.length;

  const totalRevenueFCFA = invoices.filter(i => i.status === 'payee' || i.status === 'acompte_verse')
    .reduce((acc, i) => acc + (i.status === 'payee' ? i.amount : i.deposit_amount), 1480000);
  
  const agriflyCommissionFCFA = Math.round(totalRevenueFCFA * 0.25);
  const operatorPayoutsFCFA = totalRevenueFCFA - agriflyCommissionFCFA;
  const pendingBookingsCount = bookings.filter(b => b.status === 'demande_envoyee' || b.status === 'en_attente_devis' || b.status === 'confirmee').length;

  return (
    <StoreContext.Provider value={{
      currentUser,
      allUsers: INITIAL_USERS,
      switchUser,
      language,
      setLanguage,
      plots,
      addPlot,
      updatePlot,
      deletePlot,
      pricing,
      updatePricing,
      bookings,
      createBooking,
      updateBookingStatus,
      assignOperatorAndDrone,
      drones,
      addDrone,
      updateDroneStatus,
      operators,
      updateOperatorStatus,
      addOperatorApplication,
      missions,
      updateMissionStatus,
      completeMissionProof,
      invoices,
      markInvoicePaid,
      coopMembers,
      addCoopMember,
      articles,
      regions,
      updateRegionStatus,
      stats: {
        totalHectaresTreated,
        totalFarmersSupported,
        totalPartnerCooperatives,
        totalPartnerOperators,
        totalCompletedMissions,
        totalRevenueFCFA,
        agriflyCommissionFCFA,
        operatorPayoutsFCFA,
        pendingBookingsCount
      },
      toasts,
      addToast,
      removeToast,
      resetToDemoData,
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
