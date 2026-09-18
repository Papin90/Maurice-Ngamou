import React, { useState } from 'react';
import { Invoice } from '../../types';
import { useStore } from '../../lib/store';
import { 
  Printer, 
  X, 
  CheckCircle2, 
  Smartphone, 
  Building, 
  AlertCircle,
  Receipt,
  FileText
} from 'lucide-react';

interface InvoiceModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ invoice, onClose }) => {
  const { markInvoicePaid } = useStore();
  const [paymentStep, setPaymentStep] = useState<'view' | 'pay_momo' | 'pay_om' | 'pay_bank'>('view');
  const [phoneNumber, setPhoneNumber] = useState('+237 6 ');
  const [transactionRef, setTransactionRef] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulatePayment = (method: 'mtn_momo' | 'orange_money' | 'virement') => {
    setIsProcessing(true);
    setTimeout(() => {
      const generatedRef = method === 'mtn_momo' 
        ? 'MTN-CM-' + Math.floor(10000000 + Math.random() * 90000000)
        : method === 'orange_money'
        ? 'OM-CM-' + Math.floor(10000000 + Math.random() * 90000000)
        : 'VIR-AFRILAND-' + Math.floor(10000 + Math.random() * 90000);

      markInvoicePaid(invoice.id, method, transactionRef || generatedRef);
      setIsProcessing(false);
      setPaymentStep('view');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-100 overflow-hidden my-8 animate-fadeIn">
        {/* Top Control Bar */}
        <div className="no-print bg-stone-900 text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold">Facture N° {invoice.id}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold bg-stone-700 hover:bg-stone-600 text-white rounded-lg transition"
            >
              <Printer className="w-3.5 h-3.5" /> Imprimer / PDF
            </button>
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white p-1 rounded-md transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Sheet */}
        <div className="p-8 bg-white text-gray-800 space-y-6">
          <div className="flex justify-between items-start border-b border-gray-200 pb-6">
            <div>
              <h2 className="text-xl font-black text-emerald-800 font-display">AGRIFLY CAMEROUN</h2>
              <p className="text-xs text-gray-500">SARL au capital de 10 000 000 FCFA</p>
              <p className="text-xs text-gray-500">Douala • Bafoussam • Yaoundé</p>
              <p className="text-xs text-gray-500">RC/DLA/2024/B/1892 • NUI: M032412893041F</p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${
                invoice.status === 'payee' 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                  : invoice.status === 'acompte_verse'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-rose-100 text-rose-800 border border-rose-300'
              }`}>
                {invoice.status === 'payee' ? '✓ RÉGLÉE EN TOTALITÉ' : invoice.status === 'acompte_verse' ? '⚡ ACOMPTE REÇU (30%)' : 'EN ATTENTE DE PAIEMENT'}
              </span>
              <p className="text-sm font-bold text-gray-900 mt-2">Facture #{invoice.id}</p>
              <p className="text-xs text-gray-500">Date d'émission : {invoice.issue_date}</p>
              <p className="text-xs text-gray-500">Échéance : {invoice.due_date}</p>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs">
            <h4 className="font-bold text-gray-900 mb-1">Facturé à :</h4>
            <p className="text-gray-800 font-semibold text-sm">{invoice.client_name}</p>
            <p className="text-gray-600">Catégorie : {invoice.client_type}</p>
            <p className="text-gray-600">Dossier réservation associé : #{invoice.booking_id}</p>
          </div>

          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 text-gray-600 font-semibold bg-stone-100">
                <th className="p-3">Désignation de la prestation</th>
                <th className="p-3 text-right">Montant (FCFA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr>
                <td className="p-3">
                  <p className="font-bold text-gray-800">Prestation agricole par drone de précision</p>
                  <p className="text-gray-500 text-[11px]">Intervention certifiée, télépilote agréé et équipement de vol lourd</p>
                </td>
                <td className="p-3 text-right font-bold text-gray-800">{invoice.amount.toLocaleString()} FCFA</td>
              </tr>
            </tbody>
          </table>

          <div className="border-t border-gray-200 pt-4 flex flex-col items-end text-xs space-y-1.5">
            <div className="flex justify-between w-64 text-gray-600">
              <span>Montant Total HT & TTC :</span>
              <span className="font-semibold text-gray-900">{invoice.amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between w-64 text-gray-600">
              <span>Acompte requis / versé :</span>
              <span className="font-semibold text-emerald-700">{invoice.deposit_amount.toLocaleString()} FCFA</span>
            </div>
            <div className="flex justify-between w-64 text-sm font-bold border-t border-gray-200 pt-2 text-gray-900">
              <span>Solde restant :</span>
              <span className={invoice.balance_due > 0 ? 'text-amber-700' : 'text-emerald-700'}>
                {invoice.balance_due.toLocaleString()} FCFA
              </span>
            </div>
          </div>

          {/* Payment Methods Section (Screen only) */}
          <div className="no-print pt-6 border-t border-gray-200">
            {invoice.status !== 'payee' ? (
              <div className="bg-emerald-50/70 p-5 rounded-xl border border-emerald-200">
                <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-emerald-700" /> Régler instantanément par Mobile Money Cameroun
                </h4>
                <p className="text-xs text-emerald-800 mb-4">
                  Payez votre acompte ou le solde en toute sécurité. Les fonds sont sécurisés jusqu'à la validation du rapport.
                </p>

                {paymentStep === 'view' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => setPaymentStep('pay_momo')}
                      className="flex items-center justify-center gap-2 p-3 bg-amber-400 hover:bg-amber-500 text-stone-900 font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-stone-900 text-amber-400 flex items-center justify-center text-[10px] font-black">M</span>
                      Payer via MTN Mobile Money
                    </button>
                    <button
                      onClick={() => setPaymentStep('pay_om')}
                      className="flex items-center justify-center gap-2 p-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-xs transition shadow-xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center text-[10px] font-black">O</span>
                      Payer via Orange Money
                    </button>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs text-gray-800">
                        {paymentStep === 'pay_momo' ? 'Paiement MTN MoMo Cameroun' : 'Paiement Orange Money Cameroun'}
                      </span>
                      <button onClick={() => setPaymentStep('view')} className="text-gray-400 hover:text-gray-600 text-xs">
                        Annuler
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Numéro Mobile Money :</label>
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full px-3 py-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-emerald-500"
                        placeholder="+237 6 7X XX XX XX"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-700 mb-1">Montant à régler :</label>
                      <p className="text-sm font-black text-emerald-800">
                        {invoice.balance_due > 0 ? invoice.balance_due.toLocaleString() : invoice.amount.toLocaleString()} FCFA
                      </p>
                    </div>

                    <button
                      onClick={() => handleSimulatePayment(paymentStep === 'pay_momo' ? 'mtn_momo' : 'orange_money')}
                      disabled={isProcessing}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      {isProcessing ? 'Envoi du prompt USSD sur le téléphone...' : 'Valider le paiement sur mon téléphone'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <div className="text-xs text-emerald-900">
                  <p className="font-bold">Facture payée avec succès !</p>
                  <p className="text-emerald-700">
                    Mode : {invoice.payment_method?.toUpperCase()} • Réf Transaction : {invoice.transaction_ref}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
