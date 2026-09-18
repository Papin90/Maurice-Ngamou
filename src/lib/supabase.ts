import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http'));

export const supabase: SupabaseClient | null = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * SQL DDL Schema ready to execute directly into the Supabase SQL Editor.
 */
export const SUPABASE_SQL_SCHEMA = `
-- ============================================================
-- AGRIFLY CAMEROUN: SUPABASE POSTGRESQL PRODUCTION SCHEMA
-- ============================================================

-- 1. Profiles & Roles
CREATE TYPE user_role AS ENUM ('farmer', 'cooperative', 'operator', 'admin', 'super_admin');

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  role user_role DEFAULT 'farmer',
  organization TEXT,
  region TEXT NOT NULL,
  department TEXT,
  locality TEXT,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Service Pricing
CREATE TABLE IF NOT EXISTS service_pricing (
  id TEXT PRIMARY KEY,
  service_id TEXT NOT NULL,
  service_name TEXT NOT NULL,
  price_per_hectare NUMERIC NOT NULL,
  minimum_surface NUMERIC DEFAULT 1,
  travel_fee_base NUMERIC DEFAULT 5000,
  emergency_fee_percent NUMERIC DEFAULT 20,
  description TEXT,
  active BOOLEAN DEFAULT TRUE,
  effective_date TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Plots (Parcelles)
CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  region TEXT NOT NULL,
  department TEXT NOT NULL,
  arrondissement TEXT,
  locality TEXT NOT NULL,
  surface_ha NUMERIC NOT NULL,
  crop TEXT NOT NULL,
  planting_date DATE,
  latitude NUMERIC NOT NULL,
  longitude NUMERIC NOT NULL,
  boundary_geojson JSONB,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Operators & Drones
CREATE TABLE IF NOT EXISTS operators (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  company_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  email TEXT,
  region TEXT NOT NULL,
  intervention_zones TEXT[],
  certifications TEXT[],
  insurance_number TEXT,
  verification_status TEXT DEFAULT 'en_verification',
  commission_rate_percent NUMERIC DEFAULT 75,
  payout_method TEXT DEFAULT 'mtn_momo',
  payout_account TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS drones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  operator_id UUID REFERENCES operators(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  serial_number TEXT UNIQUE NOT NULL,
  tank_capacity_liters NUMERIC NOT NULL,
  battery_count INT DEFAULT 4,
  status TEXT DEFAULT 'disponible',
  acquisition_date DATE,
  last_maintenance DATE,
  next_maintenance DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bookings (Réservations)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES profiles(id),
  plot_id UUID REFERENCES plots(id),
  crop TEXT NOT NULL,
  service TEXT NOT NULL,
  preferred_date DATE NOT NULL,
  time_slot TEXT NOT NULL,
  urgency TEXT DEFAULT 'normale',
  surface_ha NUMERIC NOT NULL,
  estimated_price NUMERIC NOT NULL,
  travel_fee NUMERIC DEFAULT 0,
  emergency_fee NUMERIC DEFAULT 0,
  total_price NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  deposit_paid BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'demande_envoyee',
  operator_id UUID REFERENCES operators(id),
  drone_id UUID REFERENCES drones(id),
  scheduled_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Missions & Proof of Execution
CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  operator_id UUID REFERENCES operators(id),
  drone_id UUID REFERENCES drones(id),
  scheduled_date DATE NOT NULL,
  time_slot TEXT,
  total_amount NUMERIC NOT NULL,
  agrifly_commission NUMERIC NOT NULL,
  operator_payout NUMERIC NOT NULL,
  status TEXT DEFAULT 'programmee',
  before_photo TEXT,
  after_photo TEXT,
  start_time TIME,
  end_time TIME,
  gps_lat NUMERIC,
  gps_lng NUMERIC,
  actual_treated_ha NUMERIC,
  observations TEXT,
  weather_condition TEXT,
  regulatory_compliance_check BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Invoices & Payments
CREATE TABLE IF NOT EXISTS invoices (
  id TEXT PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id),
  client_name TEXT NOT NULL,
  client_type TEXT,
  amount NUMERIC NOT NULL,
  deposit_amount NUMERIC NOT NULL,
  balance_due NUMERIC NOT NULL,
  status TEXT DEFAULT 'en_attente',
  payment_method TEXT,
  transaction_ref TEXT,
  issue_date DATE DEFAULT CURRENT_DATE,
  due_date DATE
);

-- 8. Row Level Security (RLS) policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Farmers can manage their own plots" ON plots
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Clients can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = client_id);
`;
