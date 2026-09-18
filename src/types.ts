export type UserRole = 'farmer' | 'cooperative' | 'operator' | 'admin' | 'super_admin';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  whatsapp: string;
  role: UserRole;
  avatar?: string;
  organization?: string;
  region: string;
  department?: string;
  locality?: string;
  verified?: boolean;
}

export type CropType = 
  | 'tomate' 
  | 'pomme_de_terre' 
  | 'mais' 
  | 'piment' 
  | 'maraichage' 
  | 'oignon' 
  | 'aubergine' 
  | 'banane_plantain' 
  | 'autre';

export type ServiceType = 
  | 'pulverisation' 
  | 'fertilisation' 
  | 'epandage' 
  | 'cartographie' 
  | 'inspection' 
  | 'suivi';

export interface ServicePricing {
  id: string;
  service_id: ServiceType;
  service_name: string;
  price_per_hectare: number; // in FCFA
  minimum_surface: number; // in hectares
  travel_fee_base: number; // in FCFA
  emergency_fee_percent: number; // e.g. 20%
  description: string;
  active: boolean;
}

export interface Plot {
  id: string;
  user_id: string;
  farmer_name?: string;
  name: string;
  region: string;
  department: string;
  arrondissement?: string;
  locality: string;
  surface_ha: number;
  crop: CropType;
  planting_date?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  boundary_points?: Array<[number, number]>;
  status: 'active' | 'en_jachere' | 'recolte';
  notes?: string;
  created_at: string;
}

export type BookingStatus = 
  | 'demande_envoyee'
  | 'en_attente_devis'
  | 'devis_envoye'
  | 'acompte_demande'
  | 'confirmee'
  | 'operateur_affecte'
  | 'en_cours'
  | 'terminee'
  | 'rapport_disponible'
  | 'annulee';

export interface Booking {
  id: string;
  client_id: string;
  client_name: string;
  client_phone: string;
  client_whatsapp: string;
  client_type: 'particulier' | 'cooperative' | 'entreprise' | 'grande_exploitation';
  plot_id: string;
  plot_name: string;
  region: string;
  locality: string;
  surface_ha: number;
  crop: CropType;
  service: ServiceType;
  preferred_date: string;
  time_slot: 'matin_06h_10h' | 'apres_midi_15h_18h' | 'indifferent';
  urgency: 'normale' | 'urgente';
  estimated_price: number;
  travel_fee: number;
  emergency_fee: number;
  total_price: number;
  deposit_amount: number; // 30% or total
  deposit_paid: boolean;
  status: BookingStatus;
  operator_id?: string;
  operator_name?: string;
  drone_id?: string;
  drone_model?: string;
  scheduled_date?: string;
  mission_id?: string;
  notes?: string;
  created_at: string;
}

export interface Drone {
  id: string;
  operator_id: string;
  operator_name: string;
  brand: string; // e.g. DJI, XAG
  model: string; // e.g. Agras T40, Agras T30, P100 Pro
  serial_number: string;
  tank_capacity_liters: number;
  battery_count: number;
  status: 'disponible' | 'en_mission' | 'maintenance' | 'hors_service';
  acquisition_date: string;
  last_maintenance: string;
  next_maintenance: string;
  photo_url?: string;
}

export interface Operator {
  id: string;
  name: string;
  company_name: string;
  phone: string;
  whatsapp: string;
  email: string;
  region: string;
  intervention_zones: string[];
  certifications: string[];
  insurance_number: string;
  verification_status: 'verifie' | 'en_verification' | 'suspendu';
  drones_count: number;
  completed_missions: number;
  rating: number;
  commission_rate_percent: number; // Default 75% for operator, 25% for AgriFly
  payout_method: 'mtn_momo' | 'orange_money' | 'virement';
  payout_account: string;
}

export interface Mission {
  id: string;
  booking_id: string;
  plot_name: string;
  client_name: string;
  client_phone: string;
  locality: string;
  region: string;
  surface_ha: number;
  crop: CropType;
  service: ServiceType;
  date: string;
  time_slot: string;
  operator_id: string;
  operator_name: string;
  drone_id: string;
  drone_model: string;
  total_amount: number;
  agrifly_commission: number; // 25%
  operator_payout: number; // 75%
  status: 'nouvelle' | 'acceptee' | 'programmee' | 'en_cours' | 'terminee' | 'refusee';
  // Proof of intervention
  before_photo?: string;
  after_photo?: string;
  start_time?: string;
  end_time?: string;
  gps_lat?: number;
  gps_lng?: number;
  actual_treated_ha?: number;
  observations?: string;
  weather_condition?: 'ensoleille' | 'nuageux' | 'vent_faible' | 'vent_modere';
  regulatory_compliance_check?: boolean;
}

export interface Invoice {
  id: string;
  booking_id: string;
  client_name: string;
  client_type: string;
  amount: number;
  deposit_amount: number;
  balance_due: number;
  status: 'en_attente' | 'acompte_verse' | 'payee' | 'remboursee';
  payment_method?: 'mtn_momo' | 'orange_money' | 'virement' | 'especes';
  transaction_ref?: string;
  issue_date: string;
  due_date: string;
}

export interface CooperativeMember {
  id: string;
  cooperative_id: string;
  name: string;
  phone: string;
  locality: string;
  crop: CropType;
  surface_ha: number;
  plot_id: string;
}

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: 'precision' | 'drones' | 'traitements' | 'innovations';
  author: string;
  date: string;
  read_time_min: number;
  image_url: string;
  published: boolean;
}

export interface CameroonRegion {
  id: string;
  name: string;
  capital: string;
  active_operators: number;
  total_parcels: number;
  status: 'disponible' | 'en_deploiement' | 'bientot_disponible';
  key_crops: string[];
}
