import React, { useState } from 'react';
import { useStore } from '../../lib/store';
import { Phone, MessageSquare, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { addToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+237 6 ');
  const [whatsapp, setWhatsapp] = useState('+237 6 ');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Demande d’informations générales');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    addToast({
      type: 'success',
      title: 'Message transmis',
      message: 'Notre équipe AgriFly Cameroun a bien reçu votre demande et vous contactera rapidement.'
    });
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/70 px-3 py-1 rounded-full">
                Nous Contacter
              </span>
              <h2 className="text-3xl font-black text-gray-900 font-display tracking-tight mt-3">
                Parlez à l'équipe AgriFly Cameroun
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm mt-2 leading-relaxed">
                Que vous soyez exploitant indépendant, président de coopérative ou détenteur de drones agricoles, nos bureaux sont à votre écoute.
              </p>
            </div>

            <div className="space-y-3 text-xs text-gray-700">
              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">WhatsApp Commercial & Devis</h4>
                  <a href="https://wa.me/237690001122" target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold hover:underline">
                    +237 6 90 00 11 22 (Réponse sous 15 min)
                  </a>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Assistance Téléphonique</h4>
                  <p className="text-gray-600">+237 6 77 12 34 56 (Lundi - Samedi 07h à 19h)</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Courrier Électronique</h4>
                  <p className="text-gray-600">contact@agrifly.cm • partenariats@agrifly.cm</p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800 flex-shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Bureaux & Antennes Régionales</h4>
                  <p className="text-gray-600">Siège : Douala Bonanjo • Antenne Ouest : Bafoussam / Foumbot</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form (7 cols) */}
          <div className="lg:col-span-7 bg-stone-50 p-6 sm:p-8 rounded-3xl border border-stone-200 text-xs">
            {sent ? (
              <div className="p-8 text-center space-y-3 bg-white rounded-2xl border border-emerald-200">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-base font-bold text-gray-900">Merci pour votre message !</h3>
                <p className="text-gray-600 text-xs max-w-sm mx-auto">
                  Notre équipe AgriFly Cameroun a bien reçu votre demande et vous recontactera sur {phone} ou par WhatsApp.
                </p>
                <button
                  onClick={() => setSent(false)}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
                >
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Votre nom ou coopérative *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Jean-Paul Kamga"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Téléphone d'appel *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+237 6 7X XX XX XX"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Numéro WhatsApp</label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+237 6 9X XX XX XX"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contact@exemple.cm"
                      className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Objet de la demande</label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl"
                  >
                    <option value="Demande d’informations générales">Demande d’informations générales</option>
                    <option value="Devis pour coopérative ou grande superficie">Devis pour coopérative ou grande superficie (&gt; 20 ha)</option>
                    <option value="Proposition de partenariat opérateur drone">Proposition de partenariat opérateur drone</option>
                    <option value="Assistance sur une réservation en cours">Assistance sur une réservation en cours</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Votre message / Détails de l'exploitation *</label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Précisez votre culture, votre localité au Cameroun et vos attentes..."
                    className="w-full px-3 py-2.5 bg-white border border-gray-300 rounded-xl resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl transition shadow-xs flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Envoyer mon message</span>
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};
