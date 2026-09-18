import React from 'react';
import { Plane, ShieldCheck, MessageSquare, Phone, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC<{ onOpenBooking: () => void; onSelectTab: (t: any) => void }> = ({
  onOpenBooking,
  onSelectTab,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs mt-20">
      {/* Regulatory Banner */}
      <div className="bg-emerald-950/80 border-b border-emerald-900/60 py-4 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-emerald-200">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <p className="text-xs leading-relaxed">
              <strong className="text-white">Conformité Réglementaire Camerounaise :</strong> Les produits phytosanitaires sont appliqués dans le strict respect de la réglementation du MINADER. Tous les vols sont opérés par des télépilotes formés et assurés, en accord avec l'Autorité Aéronautique du Cameroun (CCAA).
            </p>
          </div>
          <button
            onClick={onOpenBooking}
            className="whitespace-nowrap px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-sm"
          >
            Réserver maintenant
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1: Brand & Slogan */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <Plane className="w-5 h-5 rotate-45 text-emerald-200" />
              </div>
              <span className="text-xl font-black tracking-tight text-white font-display">
                AGRIFLY CAMEROUN
              </span>
            </div>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Plateforme AgriTech pionnière au Cameroun. Nous connectons producteurs, coopératives et exploitants aux meilleurs opérateurs de drones agricoles pour des traitements ultra-rapides, économiques et sans tassement du sol.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="text-[11px] font-bold text-stone-400">Paiements acceptés :</span>
              <span className="px-2 py-1 rounded bg-amber-400 text-stone-950 font-black text-[10px]">
                MTN MoMo
              </span>
              <span className="px-2 py-1 rounded bg-orange-600 text-white font-black text-[10px]">
                Orange Money
              </span>
              <span className="px-2 py-1 rounded bg-stone-800 text-stone-300 font-semibold text-[10px]">
                Virement Bancaire
              </span>
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Services Agricoles</h4>
            <ul className="space-y-2 text-stone-400">
              <li><a href="#services" className="hover:text-emerald-400 transition">Pulvérisation de précision</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition">Fertilisation foliaire ciblée</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition">Épandage granulaire métrique</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition">Cartographie NDVI & Diagnostic</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition">Inspection aérienne de parcelles</a></li>
              <li><a href="#services" className="hover:text-emerald-400 transition">Suivi sanitaire récurrent</a></li>
            </ul>
          </div>

          {/* Col 3: Cultures */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Bassins & Cultures</h4>
            <ul className="space-y-2 text-stone-400">
              <li>🍅 Tomate (Foumbot, Kouoptamo)</li>
              <li>🥔 Pomme de terre (Dschang, Santa)</li>
              <li>🍌 Banane & Plantain (Moungo, Loum)</li>
              <li>🌶️ Piment doux & Piquant</li>
              <li>🌽 Maïs vivrier & Semencier</li>
              <li>🥬 Maraîchage péri-urbain</li>
            </ul>
          </div>

          {/* Col 4: Contact & WhatsApp */}
          <div>
            <h4 className="text-white font-bold mb-3 text-xs uppercase tracking-wider">Contact Direct</h4>
            <div className="space-y-2.5 text-stone-400">
              <a 
                href="https://wa.me/237690001122" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp : +237 6 90 00 11 22
              </a>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-stone-400" /> Appel : +237 6 77 12 34 56
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-stone-400" /> Email : contact@agrifly.cm
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400" /> Douala • Bafoussam • Yaoundé
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-500 gap-3">
          <p>© {new Date().getFullYear()} AGRIFLY CAMEROUN SARL — Tous droits réservés.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onSelectTab('faq')} className="hover:text-stone-300">FAQ</button>
            <button onClick={() => onSelectTab('coverage')} className="hover:text-stone-300">Disponibilité par région</button>
            <button onClick={() => onSelectTab('academy')} className="hover:text-stone-300">Conseils agronomiques</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
