import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { 
  Plane, 
  Menu, 
  X, 
  Phone, 
  Calendar, 
  MessageSquare, 
  ChevronDown, 
  User, 
  Layers, 
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'landing' | 'dashboard' | 'academy' | 'faq' | 'coverage';
  onSelectTab: (tab: 'landing' | 'dashboard' | 'academy' | 'faq' | 'coverage') => void;
  onOpenBooking: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenBooking,
}) => {
  const { currentUser, language, setLanguage } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const roleLabels: Record<string, string> = {
    farmer: 'Espace Agriculteur',
    cooperative: 'Espace Coopérative',
    operator: 'Espace Opérateur Drone',
    admin: 'Espace Administration',
    super_admin: 'Super Admin HQ',
  };

  const roleColors: Record<string, string> = {
    farmer: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    cooperative: 'bg-teal-100 text-teal-800 border-teal-300',
    operator: 'bg-sky-100 text-sky-800 border-sky-300',
    admin: 'bg-amber-100 text-amber-900 border-amber-300',
    super_admin: 'bg-purple-100 text-purple-900 border-purple-300',
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-[37px] z-30 border-b border-stone-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectTab('landing')}>
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-emerald-900 via-emerald-800 to-emerald-700 flex items-center justify-center text-white shadow-md">
              <Plane className="w-6 h-6 rotate-45 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-emerald-950 font-display">
                  AGRIFLY
                </span>
                <span className="text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded bg-amber-400 text-stone-950 tracking-wider">
                  CAMEROUN
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-medium hidden sm:block">
                L'agriculture de précision accessible à tous
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-semibold text-gray-700">
            <button
              onClick={() => onSelectTab('landing')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'landing'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Accueil
            </button>
            <a
              href="#services"
              onClick={() => onSelectTab('landing')}
              className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-stone-50 transition"
            >
              Services
            </a>
            <a
              href="#cultures"
              onClick={() => onSelectTab('landing')}
              className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-stone-50 transition"
            >
              Cultures
            </a>
            <a
              href="#comment-ca-marche"
              onClick={() => onSelectTab('landing')}
              className="px-3 py-2 rounded-lg hover:text-emerald-700 hover:bg-stone-50 transition"
            >
              Comment ça marche
            </a>
            <button
              onClick={() => onSelectTab('coverage')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'coverage'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              Régions couvertes
            </button>
            <button
              onClick={() => onSelectTab('academy')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'academy'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              AgriFly Academy
            </button>
            <button
              onClick={() => onSelectTab('faq')}
              className={`px-3 py-2 rounded-lg transition ${
                currentTab === 'faq'
                  ? 'text-emerald-800 bg-emerald-50 font-bold'
                  : 'hover:text-emerald-700 hover:bg-stone-50'
              }`}
            >
              FAQ
            </button>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* WhatsApp Quick Link */}
            <a
              href="https://wa.me/237690001122?text=Bonjour%20AgriFly%20Cameroun%20!%20Je%20souhaite%20des%20informations%20sur%20vos%20prestations%20drone."
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              title="Contacter AgriFly Cameroun sur WhatsApp"
            >
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              <span className="hidden xl:inline">+237 6 90 00 11 22</span>
              <span className="xl:hidden">WhatsApp</span>
            </a>

            {/* Role Dashboard Access Button */}
            <button
              onClick={() => onSelectTab('dashboard')}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition shadow-xs ${
                currentTab === 'dashboard'
                  ? 'bg-stone-900 text-white border-stone-900'
                  : roleColors[currentUser.role] || 'bg-emerald-50 text-emerald-900 border-emerald-200'
              }`}
              title="Accéder au tableau de bord métier"
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden md:inline">{roleLabels[currentUser.role]}</span>
              <span className="md:hidden">Dashboard</span>
            </button>

            {/* Primary CTA: Book an intervention */}
            <button
              onClick={onOpenBooking}
              className="flex items-center gap-1.5 px-4 py-2 sm:py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-emerald-700 to-emerald-600 hover:from-emerald-800 hover:to-emerald-700 transition shadow-md shadow-emerald-900/15"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Réserver</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 text-xs font-semibold animate-fadeIn">
          <button
            onClick={() => { onSelectTab('landing'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            Accueil
          </button>
          <a
            href="#services"
            onClick={() => { onSelectTab('landing'); setMobileMenuOpen(false); }}
            className="block py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            Nos Services
          </a>
          <a
            href="#cultures"
            onClick={() => { onSelectTab('landing'); setMobileMenuOpen(false); }}
            className="block py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            Cultures prises en charge
          </a>
          <button
            onClick={() => { onSelectTab('coverage'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            Régions & Disponibilités
          </button>
          <button
            onClick={() => { onSelectTab('academy'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            AgriFly Academy
          </button>
          <button
            onClick={() => { onSelectTab('faq'); setMobileMenuOpen(false); }}
            className="w-full text-left py-2 px-3 rounded-lg hover:bg-stone-100"
          >
            Questions Fréquentes (FAQ)
          </button>
          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            <button
              onClick={() => { onSelectTab('dashboard'); setMobileMenuOpen(false); }}
              className="w-full py-2.5 px-3 bg-stone-900 text-white rounded-xl font-bold text-center"
            >
              Accéder à {roleLabels[currentUser.role]}
            </button>
            <a
              href="https://wa.me/237690001122"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3 bg-emerald-600 text-white rounded-xl font-bold text-center flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" /> Discuter sur WhatsApp (+237)
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
