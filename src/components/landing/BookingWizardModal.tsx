import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { CropType, ServiceType, Booking } from '../../types';
import { CROP_DETAILS } from '../../data/mockData';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  MapPin, 
  Calendar, 
  Clock, 
  Zap, 
  ShieldAlert, 
  MessageSquare,
  Sparkles,
  Calculator
} from 'lucide-react';

interface BookingWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCrop?: CropType;
  initialService?: ServiceType;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  isOpen,
  onClose,
  initialCrop = 'tomate',
  initialService = 'pulverisation',
}) => {
  const { currentUser, plots, pricing, createBooking, addPlot } = useStore();

  const [step, setStep] = useState<number>(1);

  // Form State
  // Step 1: Client Info
  const [clientName, setClientName] = useState(currentUser.name || '');
  const [clientPhone, setClientPhone] = useState(currentUser.phone || '+237 6 ');
  const [clientWhatsapp, setClientWhatsapp] = useState(currentUser.whatsapp || '+237 6 ');
  const [clientEmail, setClientEmail] = useState(currentUser.email || '');
  const [clientType, setClientType] = useState<'particulier' | 'cooperative' | 'entreprise' | 'grande_exploitation'>('particulier');

  // Step 2: Plot Info
  const [selectedExistingPlotId, setSelectedExistingPlotId] = useState<string>('');
  const [plotName, setPlotName] = useState('');
  const [region, setRegion] = useState('Ouest');
  const [department, setDepartment] = useState('Noun');
  const [locality, setLocality] = useState('Foumbot');
  const [surfaceHa, setSurfaceHa] = useState<number>(3.0);
  const [gpsLat, setGpsLat] = useState<number>(5.5123);
  const [gpsLng, setGpsLng] = useState<number>(10.6318);

  // Step 3: Crop
  const [crop, setCrop] = useState<CropType>(initialCrop);

  // Step 4: Service
  const [service, setService] = useState<ServiceType>(initialService);

  // Step 5: Planning
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<'matin_06h_10h' | 'apres_midi_15h_18h' | 'indifferent'>('matin_06h_10h');
  const [urgency, setUrgency] = useState<'normale' | 'urgente'>('normale');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  // Pricing calculations
  const currentPricing = pricing.find(p => p.service_id === service) || pricing[0];
  const unitPrice = currentPricing ? currentPricing.price_per_hectare : 20000;
  const baseEstimated = Math.round(surfaceHa * unitPrice);
  const travelFee = currentPricing ? currentPricing.travel_fee_base : 5000;
  const emergencyFee = urgency === 'urgente' ? Math.round(baseEstimated * 0.2) : 0;
  const totalPrice = baseEstimated + travelFee + emergencyFee;
  const depositAmount = Math.round(totalPrice * 0.3); // 30% deposit standard

  // When choosing an existing plot
  const handleSelectExistingPlot = (pId: string) => {
    setSelectedExistingPlotId(pId);
    const found = plots.find(p => p.id === pId);
    if (found) {
      setPlotName(found.name);
      setRegion(found.region);
      setDepartment(found.department);
      setLocality(found.locality);
      setSurfaceHa(found.surface_ha);
      setCrop(found.crop);
      setGpsLat(found.coordinates.lat);
      setGpsLng(found.coordinates.lng);
    }
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    // If new plot was entered, also register it in plots
    let targetPlotId = selectedExistingPlotId;
    if (!targetPlotId) {
      const created = addPlot({
        name: plotName || `Parcelle ${locality} (${surfaceHa} ha)`,
        region,
        department,
        locality,
        surface_ha: Number(surfaceHa),
        crop,
        coordinates: { lat: Number(gpsLat), lng: Number(gpsLng) },
        status: 'active',
        user_id: currentUser.id,
      });
      targetPlotId = created.id;
    }

    createBooking({
      client_id: currentUser.id,
      client_name: clientName,
      client_phone: clientPhone,
      client_whatsapp: clientWhatsapp,
      client_type: clientType,
      plot_id: targetPlotId,
      plot_name: plotName || `Parcelle ${locality}`,
      region,
      locality,
      surface_ha: Number(surfaceHa),
      crop,
      service,
      preferred_date: preferredDate,
      time_slot: timeSlot,
      urgency,
      estimated_price: baseEstimated,
      travel_fee: travelFee,
      emergency_fee: emergencyFee,
      total_price: totalPrice,
      deposit_amount: depositAmount,
      notes,
    });

    onClose();
  };

  const cropsList: CropType[] = [
    'tomate',
    'pomme_de_terre',
    'mais',
    'piment',
    'maraichage',
    'oignon',
    'aubergine',
    'banane_plantain',
    'autre'
  ];

  const servicesList: Array<{ id: ServiceType; title: string; desc: string }> = [
    { id: 'pulverisation', title: 'Pulvérisation par Drone', desc: 'Traitement précis des cultures, gouttelettes ciblées' },
    { id: 'fertilisation', title: 'Fertilisation Foliaire', desc: 'Application ciblée de biostimulants et engrais' },
    { id: 'epandage', title: 'Épandage Granulaire', desc: 'Semis et micro-granulés solides métriques' },
    { id: 'cartographie', title: 'Cartographie Multispectrale', desc: 'Indices NDVI, vigueur végétale et diagnostic' },
    { id: 'inspection', title: 'Inspection Aérienne 4K', desc: 'Surveillance des ravageurs et comptage' },
    { id: 'suivi', title: 'Suivi Agricole Récurrent', desc: 'Carnet sanitaire et rapports comparatifs' },
  ];

  const whatsappMessage = encodeURIComponent(
    `Bonjour AgriFly Cameroun ! Je souhaite réserver une intervention par drone :
- Culture : ${CROP_DETAILS[crop]?.name}
- Superficie : ${surfaceHa} ha
- Localité : ${locality} (${region})
- Service : ${service.toUpperCase()}
- Date souhaitée : ${preferredDate}
- Estimation : ${totalPrice.toLocaleString()} FCFA`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-6 animate-fadeIn">
        {/* Header with step progress */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-300">
                Réservation Intelligente • Étape {step} sur 6
              </span>
              <h2 className="text-lg font-black tracking-tight font-display text-white">
                {step === 1 && "1. Vos coordonnées de contact"}
                {step === 2 && "2. Localisation de votre parcelle"}
                {step === 3 && "3. Culture concernée"}
                {step === 4 && "4. Choix du service drone"}
                {step === 5 && "5. Date & Urgence"}
                {step === 6 && "6. Devis estimatif & Validation"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper dots */}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i === step
                    ? 'bg-emerald-300 ring-2 ring-emerald-400/40'
                    : i < step
                    ? 'bg-emerald-500'
                    : 'bg-emerald-950/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Wizard Step Body */}
        <div className="p-6 text-xs text-gray-700 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: CLIENT INFO */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Renseignez vos informations de contact afin que notre coordinateur d'interventions puisse vous joindre rapidement.
              </p>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Nom complet ou Raison Sociale *</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Ex: Jean-Paul Kamga ou Coopérative du Noun"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Téléphone d'appel *</label>
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="+237 6 77 00 00 00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Numéro WhatsApp *</label>
                  <input
                    type="tel"
                    value={clientWhatsapp}
                    onChange={(e) => setClientWhatsapp(e.target.value)}
                    placeholder="+237 6 77 00 00 00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Adresse Email (optionnelle)</label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="votre.email@domaine.cm"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-2">Vous êtes :</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'particulier', label: 'Agriculteur' },
                    { id: 'cooperative', label: 'Coopérative' },
                    { id: 'entreprise', label: 'Entreprise' },
                    { id: 'grande_exploitation', label: 'Plantation' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setClientType(t.id as any)}
                      className={`py-2 px-3 rounded-xl border text-center font-semibold transition ${
                        clientType === t.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: PLOT INFO */}
          {step === 2 && (
            <div className="space-y-4">
              {plots.length > 0 && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block font-bold text-gray-800 mb-1">Choisir une parcelle déjà enregistrée :</label>
                  <select
                    value={selectedExistingPlotId}
                    onChange={(e) => handleSelectExistingPlot(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="">-- Ou saisir une nouvelle parcelle ci-dessous --</option>
                    {plots.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.surface_ha} ha - {p.locality})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block font-bold text-gray-800 mb-1">Nom / Référence de la parcelle *</label>
                <input
                  type="text"
                  value={plotName}
                  onChange={(e) => setPlotName(e.target.value)}
                  placeholder="Ex: Champ de Tomates Noun Sud"
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Région *</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white"
                  >
                    <option value="Ouest">Ouest</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Centre">Centre</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Sud-Ouest">Sud-Ouest</option>
                    <option value="Adamaoua">Adamaoua</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Département</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: Noun, Moungo, Mifi"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-800 mb-1">Localité / Village *</label>
                  <input
                    type="text"
                    value={locality}
                    onChange={(e) => setLocality(e.target.value)}
                    placeholder="Ex: Foumbot, Loum, Obala"
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <label className="block font-bold text-emerald-900 mb-1">
                    Superficie à traiter (en Hectares) *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      value={surfaceHa}
                      onChange={(e) => setSurfaceHa(Math.max(0.5, parseFloat(e.target.value) || 0.5))}
                      className="w-32 px-3 py-2 text-base font-bold text-emerald-900 border border-emerald-300 rounded-lg bg-white"
                    />
                    <span className="font-semibold text-emerald-800">Hectares (ha)</span>
                  </div>
                  <p className="text-[11px] text-emerald-700 mt-1">
                    1 hectare = 10 000 m². Traitement groupé possible.
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                  <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" /> Coordonnées GPS estimées
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <span className="text-gray-500">Lat :</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={gpsLat}
                        onChange={(e) => setGpsLat(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded mt-0.5 bg-white"
                      />
                    </div>
                    <div>
                      <span className="text-gray-500">Lng :</span>
                      <input
                        type="number"
                        step="0.0001"
                        value={gpsLng}
                        onChange={(e) => setGpsLng(parseFloat(e.target.value) || 0)}
                        className="w-full px-2 py-1 border border-gray-300 rounded mt-0.5 bg-white"
                      />
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-1.5">
                    L'opérateur affinera les limites de vol sur place à l'arrivée.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: CROP */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Sélectionnez la culture présente sur votre parcelle pour calibrer l'altitude de vol et les buses atomiseurs :
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {cropsList.map((cKey) => {
                  const info = CROP_DETAILS[cKey];
                  const isSelected = crop === cKey;
                  return (
                    <button
                      key={cKey}
                      type="button"
                      onClick={() => setCrop(cKey)}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-600'
                          : 'border-gray-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="text-2xl mb-1">{info?.emoji || '🌱'}</div>
                      <span className="font-bold text-xs">{info?.name || cKey}</span>
                      <span className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                        {info?.regions}
                      </span>
                    </button>
                  );
                })}
              </div>

              {crop && CROP_DETAILS[crop] && (
                <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200">
                  <h4 className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Avantage Drone sur {CROP_DETAILS[crop].name} :
                  </h4>
                  <p className="text-emerald-800 text-[11px] leading-relaxed">
                    {CROP_DETAILS[crop].drone_benefit}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SERVICE */}
          {step === 4 && (
            <div className="space-y-3">
              <p className="text-gray-600">
                Choisissez le type de prestation agricole par drone souhaité :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesList.map((srv) => {
                  const priceObj = pricing.find(p => p.service_id === srv.id);
                  const isSelected = service === srv.id;
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => setService(srv.id)}
                      className={`p-4 rounded-xl border text-left transition relative ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50 ring-2 ring-emerald-600'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-gray-900 text-xs">{srv.title}</h4>
                        <span className="font-bold text-emerald-700 text-xs">
                          {priceObj?.price_per_hectare.toLocaleString()} FCFA/ha
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 mt-1">{srv.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: PLANNING */}
          {step === 5 && (
            <div className="space-y-4">
              <div>
                <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700" /> Date d'intervention souhaitée *
                </label>
                <input
                  type="date"
                  value={preferredDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl bg-white font-medium"
                  required
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Sous réserve de conditions météorologiques favorables le jour du vol (absence de pluie battante et vent modéré).
                </p>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-emerald-700" /> Créneau horaire préférentiel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'matin_06h_10h', label: 'Matin (06h - 10h)', badge: 'Recommandé' },
                    { id: 'apres_midi_15h_18h', label: 'Après-midi (15h - 18h)', badge: 'Optimal' },
                    { id: 'indifferent', label: 'Indifférent', badge: 'Flexible' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setTimeSlot(s.id as any)}
                      className={`p-3 rounded-xl border text-center font-medium transition ${
                        timeSlot === s.id
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">{s.label}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold">{s.badge}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Degré d'urgence :</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUrgency('normale')}
                    className={`p-3 rounded-xl border text-left transition ${
                      urgency === 'normale'
                        ? 'border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-bold text-gray-900 block text-xs">Normale (standard)</span>
                    <span className="text-[10px] text-gray-500">Planification sous 48h à 72h</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgente')}
                    className={`p-3 rounded-xl border text-left transition ${
                      urgency === 'urgente'
                        ? 'border-amber-600 bg-amber-50 ring-1 ring-amber-600'
                        : 'border-gray-200'
                    }`}
                  >
                    <span className="font-bold text-amber-900 block text-xs flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-amber-600" /> Urgente (attaque ravageurs)
                    </span>
                    <span className="text-[10px] text-amber-700">Sous 24h (+20% majoration)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-800 mb-1">Notes ou instructions particulières</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ex: Tuteurs hauts sur tomates, présence d'un point d'eau à 200m..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl h-16 resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 6: ESTIMATION BREAKDOWN */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="w-4 h-4 text-emerald-700" />
                  <h4 className="font-bold text-emerald-950 text-sm">Calcul du devis indicatif</h4>
                </div>

                <div className="space-y-2 text-xs divide-y divide-emerald-200/60">
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-600">
                      {surfaceHa} ha × {unitPrice.toLocaleString()} FCFA ({currentPricing.service_name}) :
                    </span>
                    <span className="font-bold text-gray-900">{baseEstimated.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">Frais de déplacement équipe & drone :</span>
                    <span className="font-bold text-gray-900">{travelFee.toLocaleString()} FCFA</span>
                  </div>

                  {emergencyFee > 0 && (
                    <div className="flex justify-between pt-2 text-amber-800 font-semibold">
                      <span>Frais d'urgence (intervention prioritaire 24h) :</span>
                      <span>+{emergencyFee.toLocaleString()} FCFA</span>
                    </div>
                  )}

                  <div className="flex justify-between pt-3 text-sm font-black text-emerald-900">
                    <span>Montant total estimatif :</span>
                    <span className="text-base text-emerald-700">{totalPrice.toLocaleString()} FCFA</span>
                  </div>

                  <div className="flex justify-between pt-2 text-xs text-stone-600">
                    <span>Acompte de confirmation (30%) :</span>
                    <span className="font-bold text-stone-800">{depositAmount.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <p className="font-semibold text-gray-800">
                  📍 Récapitulatif : {surfaceHa} ha de {CROP_DETAILS[crop]?.name} à {locality} ({region})
                </p>
                <p className="text-gray-600">
                  📅 Date retenue : {preferredDate} • Créneau : {timeSlot.replace(/_/g, ' ')}
                </p>
                <p className="text-[11px] text-gray-500">
                  Le prix affiché est configurable par l'administration AgriFly. Aucun prélèvement immédiat n'est effectué avant la validation du devis par nos coordinateurs.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <a
                  href={`https://wa.me/237690001122?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-300" />
                  Finaliser directement sur WhatsApp
                </a>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-md"
                >
                  <Check className="w-4 h-4" />
                  Enregistrer & Recevoir le devis
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Wizard Footer Nav */}
        <div className="bg-stone-50 p-4 border-t border-gray-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-gray-700 hover:text-gray-900 transition"
            >
              <ChevronLeft className="w-4 h-4" /> Retour
            </button>
          ) : (
            <div />
          )}

          {step < 6 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
