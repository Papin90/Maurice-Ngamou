import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Plane, CheckCircle2, ArrowRight, ShieldCheck, X, FileText } from 'lucide-react';

export const OperatorPartnerBanner: React.FC<{ onSwitchToOperator: () => void }> = ({ onSwitchToOperator }) => {
  const { addOperatorApplication } = useStore();
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Application form state
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('+237 6 ');
  const [whatsapp, setWhatsapp] = useState('+237 6 ');
  const [email, setEmail] = useState('');
  const [region, setRegion] = useState('Ouest');
  const [interventionZones, setInterventionZones] = useState('Noun, Mifi, Menoua');
  const [droneModel, setDroneModel] = useState('DJI Agras T40');
  const [certifications, setCertifications] = useState('Licence télépilote CCAA, Agrément phytosanitaire MINADER');
  const [insuranceNumber, setInsuranceNumber] = useState('AXA-AGRI-CM');

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    addOperatorApplication({
      name,
      company_name: companyName || name,
      phone,
      whatsapp,
      email,
      region,
      intervention_zones: interventionZones.split(',').map(z => z.trim()),
      certifications: certifications.split(',').map(c => c.trim()),
      insurance_number: insuranceNumber,
      verification_status: 'en_verification',
      commission_rate_percent: 75,
      payout_method: 'mtn_momo',
      payout_account: phone,
    });
    setShowApplyModal(false);
  };

  return (
    <section className="py-16 bg-stone-100 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-8 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                Réseau d'Opérateurs Partenaires
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 font-display tracking-tight">
                Vous possédez un drone agricole ? Rejoignez le réseau AgriFly
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-2xl">
                Rentabilisez vos équipements (DJI Agras T40, T30, XAG) en recevant des missions qualifiées et planifiées près de chez vous. AgriFly gère l'acquisition client, les devis et la facturation : vous vous concentrez sur le pilotage et touchez <strong>75% de chaque prestation</strong>.
              </p>

              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-700 pt-2">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Rétrocession garantie à 75%
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Paiements Mobile Money sous 24h
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Missions géolocalisées sur smartphone
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => setShowApplyModal(true)}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-xs bg-sky-700 hover:bg-sky-800 text-white transition shadow-sm flex items-center justify-center gap-2"
              >
                <Plane className="w-4 h-4" />
                <span>Devenir Opérateur Partenaire</span>
              </button>
              <button
                onClick={onSwitchToOperator}
                className="w-full py-3 px-6 rounded-xl font-bold text-xs bg-stone-50 hover:bg-stone-100 text-stone-800 border border-stone-300 transition flex items-center justify-center gap-2"
              >
                <span>Accéder à l'Espace Opérateur (Demo)</span>
                <ArrowRight className="w-4 h-4 text-sky-700" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Operator Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white max-w-xl w-full rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8 animate-fadeIn text-xs text-gray-800">
            <div className="bg-sky-900 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">Candidature Opérateur</span>
                <h3 className="text-base font-black font-display text-white mt-0.5">
                  Rejoindre le Réseau de Télépilotes AgriFly
                </h3>
              </div>
              <button onClick={() => setShowApplyModal(false)} className="text-sky-300 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleApply} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nom du responsable *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Alain Fotso"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Nom de l'entreprise / SARL</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Ex: Kamer Agtech Solutions"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Téléphone d'appel *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+237 6 7X XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">WhatsApp</label>
                  <input
                    type="tel"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    placeholder="+237 6 7X XX XX XX"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Région principale *</label>
                  <select
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white"
                  >
                    <option value="Ouest">Ouest</option>
                    <option value="Littoral">Littoral</option>
                    <option value="Centre">Centre</option>
                    <option value="Nord-Ouest">Nord-Ouest</option>
                    <option value="Sud-Ouest">Sud-Ouest</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Modèle de drone possédé *</label>
                  <input
                    type="text"
                    required
                    value={droneModel}
                    onChange={(e) => setDroneModel(e.target.value)}
                    placeholder="Ex: DJI Agras T40 / T30 / XAG"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Zones d'intervention (départements/villes)</label>
                <input
                  type="text"
                  value={interventionZones}
                  onChange={(e) => setInterventionZones(e.target.value)}
                  placeholder="Ex: Noun, Mifi, Menoua, Bamboutos"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Certifications / Licence CCAA / Assurance</label>
                <input
                  type="text"
                  value={certifications}
                  onChange={(e) => setCertifications(e.target.value)}
                  placeholder="Ex: Licence télépilote, agrément MINADER"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-[11px] text-gray-600">
                🛡️ Votre dossier sera soumis aux vérifications de notre direction des opérations (vérification de police d'assurance et contrôle des équipements).
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-sky-700 hover:bg-sky-800 text-white font-bold rounded-xl transition flex items-center justify-center gap-2"
              >
                <span>Envoyer ma candidature partenaire</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
