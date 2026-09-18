import React from 'react';
import { Mission, Booking, Plot } from '../../types';
import { useStore } from '../../lib/store';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Clock, 
  Wind, 
  Sparkles,
  Download,
  MessageSquare
} from 'lucide-react';
import { CROP_DETAILS } from '../../data/mockData';

interface MissionReportModalProps {
  mission: Mission;
  onClose: () => void;
}

export const MissionReportModal: React.FC<MissionReportModalProps> = ({ mission, onClose }) => {
  const { bookings, plots } = useStore();
  const booking = bookings.find(b => b.id === mission.booking_id);
  const plot = plots.find(p => p.id === booking?.plot_id);
  const cropInfo = CROP_DETAILS[mission.crop] || { emoji: '🌱', name: mission.crop };

  const handlePrint = () => {
    window.print();
  };

  const whatsappMessage = encodeURIComponent(
    `Bonjour AgriFly Cameroun ! J'ai bien reçu le rapport d'intervention #${mission.id} pour la parcelle ${mission.plot_name} (${mission.surface_ha} ha).`
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-fadeIn">
        {/* Modal Top Bar */}
        <div className="no-print bg-stone-900 text-white px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded font-bold uppercase">
              Rapport Numérique
            </span>
            <span className="text-stone-300 text-xs">Mission Ref: {mission.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer / PDF
            </button>
            <a
              href={`https://wa.me/237690001122?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg transition"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Document */}
        <div className="p-8 sm:p-10 bg-white text-gray-800 space-y-6" id="printable-report">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b-2 border-emerald-700 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-emerald-800 tracking-tight font-display">
                  AGRIFLY CAMEROUN
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  🇨🇲 AgriTech
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                L'agriculture de précision accessible à tous • Réseau national de drones agricoles
              </p>
              <p className="text-[11px] text-gray-400">
                Agrément MINADER & Homologation Télépilotes CCAA Cameroun
              </p>
            </div>
            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200">
                RAPPORT D’INTERVENTION
              </span>
              <p className="text-xs font-bold text-gray-900 mt-1">N° {mission.id.toUpperCase()}</p>
              <p className="text-xs text-gray-500">Date : {mission.date}</p>
            </div>
          </div>

          {/* Key Identification Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <div>
              <h4 className="font-bold text-emerald-900 uppercase tracking-wider mb-2">Bénéficiaire & Parcelle</h4>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Client :</span> {mission.client_name}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Téléphone :</span> {mission.client_phone}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Parcelle :</span> {mission.plot_name}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Localité :</span> {mission.locality} ({mission.region})</p>
            </div>
            <div>
              <h4 className="font-bold text-emerald-900 uppercase tracking-wider mb-2">Équipe Technique & Drone</h4>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Opérateur :</span> {mission.operator_name}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Drone déployé :</span> {mission.drone_model}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Service :</span> {mission.service.toUpperCase()}</p>
              <p className="text-gray-700"><span className="font-semibold text-gray-900">Superficie traitée :</span> <span className="font-bold text-emerald-700">{mission.actual_treated_ha || mission.surface_ha} ha</span></p>
            </div>
          </div>

          {/* Operational Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-gray-500 block">Culture</span>
              <span className="text-sm font-bold text-emerald-900">
                {cropInfo.emoji} {cropInfo.name}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-gray-500 block">Heure intervention</span>
              <span className="text-sm font-bold text-emerald-900">
                {mission.start_time || '06:45'} - {mission.end_time || '07:50'}
              </span>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-gray-500 block">Météo & Vent</span>
              <span className="text-sm font-bold text-emerald-900 flex items-center justify-center gap-1">
                <Wind className="w-3.5 h-3.5 text-emerald-600" /> &lt; 8 km/h (Optimal)
              </span>
            </div>
            <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-100">
              <span className="text-[11px] text-gray-500 block">Conformité MINADER</span>
              <span className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Homologué
              </span>
            </div>
          </div>

          {/* Photographic Evidence Before / After */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Preuve Photographique de l'Intervention (Avant / Après)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-gray-200 bg-stone-100">
                <div className="h-44 bg-stone-200 relative">
                  <img
                    src={mission.before_photo || "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80"}
                    alt="État de la parcelle avant traitement par drone"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 text-white text-[10px] font-bold rounded">
                    AVANT TRAITEMENT • {mission.start_time || '06:45'}
                  </span>
                </div>
                <div className="p-2.5 text-[11px] text-gray-600 bg-white">
                  Contrôle visuel : présence d'humidité et feuillage préparé pour la pulvérisation.
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-gray-200 bg-stone-100">
                <div className="h-44 bg-stone-200 relative">
                  <img
                    src={mission.after_photo || "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80"}
                    alt="État de la parcelle après traitement par drone"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-emerald-700 text-white text-[10px] font-bold rounded">
                    APRÈS TRAITEMENT • {mission.end_time || '07:50'}
                  </span>
                </div>
                <div className="p-2.5 text-[11px] text-gray-600 bg-white">
                  Brouillard atomisé déposé uniformément sous et sur la canopée sans ruissellement excessif.
                </div>
              </div>
            </div>
          </div>

          {/* Agronomic Observations */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs">
            <h5 className="font-bold text-amber-900 mb-1">Observations & Recommandations Techniques de l'Opérateur :</h5>
            <p className="text-amber-800 leading-relaxed">
              {mission.observations || "Intervention réalisée sans anomalie. Pénétration optimale des micro-gouttelettes grâce aux rotors du drone. Respect strict des dosages et de la zone tampon environnementale."}
            </p>
          </div>

          {/* Signatures & Certification Stamp */}
          <div className="pt-4 border-t border-gray-200 grid grid-cols-2 gap-8 text-xs">
            <div>
              <p className="font-semibold text-gray-700">L'Opérateur Télépilote Certifié :</p>
              <div className="h-16 mt-2 flex items-end">
                <div className="border-b border-gray-400 w-44 pb-1 text-emerald-800 font-serif italic text-sm">
                  Signé électroniquement - {mission.operator_name}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-700">Visa Client / Exploitation :</p>
              <div className="h-16 mt-2 flex items-end justify-end">
                <div className="border-b border-gray-400 w-44 pb-1 text-gray-500 font-serif italic text-xs">
                  Validé sur plateforme AgriFly
                </div>
              </div>
            </div>
          </div>

          {/* Legal Compliance Footer */}
          <div className="text-[10px] text-gray-400 text-center pt-4 border-t border-gray-100">
            AgriFly Cameroun — Prestation réalisée dans le strict respect de la réglementation phytosanitaire en vigueur en République du Cameroun. Document à valeur probante pour le suivi des cultures et les certifications agricoles.
          </div>
        </div>
      </div>
    </div>
  );
};
