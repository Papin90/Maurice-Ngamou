import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { UserRole } from '../types';
import { SUPABASE_SQL_SCHEMA, isSupabaseConfigured } from '../lib/supabase';
import { 
  RotateCcw, 
  Database, 
  Check, 
  Copy, 
  X, 
  UserCheck, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

export const DemoModeBanner: React.FC = () => {
  const { currentUser, switchUser, resetToDemoData } = useStore();
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const rolesList: Array<{ role: UserRole; label: string; icon: string; name: string }> = [
    { role: 'farmer', label: 'Agriculteur', icon: '👨‍🌾', name: 'J-P. Kamga' },
    { role: 'cooperative', label: 'Coopérative', icon: '🤝', name: 'COOPMAN' },
    { role: 'operator', label: 'Opérateur Drone', icon: '🚁', name: 'AeroDrone SARL' },
    { role: 'super_admin', label: 'Super Admin', icon: '🛡️', name: 'Admin HQ' },
  ];

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <>
      <div className="bg-stone-900 text-stone-200 border-b border-stone-800 text-xs px-4 py-2 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-40">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-900/80 text-emerald-300 border border-emerald-700/60">
            🇨🇲 AGRIFLY CAMEROUN
          </span>
          <span className="text-stone-400 hidden md:inline">
            Tester les 4 parcours métiers :
          </span>
          <div className="inline-flex items-center gap-1 bg-stone-800 p-0.5 rounded-lg border border-stone-700">
            {rolesList.map((r) => {
              const isActive = currentUser.role === r.role || (r.role === 'super_admin' && currentUser.role === 'admin');
              return (
                <button
                  key={r.role}
                  onClick={() => switchUser(r.role)}
                  className={`px-2 py-1 rounded-md text-[11px] font-semibold transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-stone-300 hover:text-white hover:bg-stone-700'
                  }`}
                >
                  <span>{r.icon}</span>
                  <span>{r.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Supabase Status & SQL Schema Viewer */}
          <button
            onClick={() => setShowSqlModal(true)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium border transition ${
              isSupabaseConfigured
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
                : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-700'
            }`}
            title="Consulter le schéma SQL Supabase prêt à l'emploi"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isSupabaseConfigured ? 'Supabase Connecté' : 'Schéma Supabase SQL'}</span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetToDemoData}
            className="inline-flex items-center gap-1 px-2 py-1 text-stone-400 hover:text-stone-200 text-[11px] transition"
            title="Réinitialiser les données locales de démonstration"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">Réinitialiser</span>
          </button>
        </div>
      </div>

      {/* Supabase SQL Schema Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-stone-900 text-stone-100 max-w-3xl w-full rounded-2xl shadow-2xl border border-stone-800 overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">
                  Architecture & Schéma SQL Supabase (PostgreSQL + RLS)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedSql ? 'Copié !' : 'Copier le SQL'}
                </button>
                <button
                  onClick={() => setShowSqlModal(false)}
                  className="text-stone-400 hover:text-white p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-4 overflow-y-auto font-mono text-xs text-stone-300 bg-stone-950/80 leading-relaxed">
              <pre className="whitespace-pre-wrap">{SUPABASE_SQL_SCHEMA}</pre>
            </div>

            <div className="p-3 bg-stone-900 border-t border-stone-800 text-[11px] text-stone-400 flex justify-between items-center">
              <span>
                Collez ce script directement dans l'éditeur SQL de votre projet Supabase pour déployer toutes les tables et règles RLS.
              </span>
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-md text-xs"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
