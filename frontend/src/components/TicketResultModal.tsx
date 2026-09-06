import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Frown, X, CheckCircle2, ShieldCheck, Share2, ArrowRight, FileText, ExternalLink, Calculator } from 'lucide-react';
import type { TicketCheckResponse } from '../types';
import { PdfViewerModal } from './PdfViewerModal';
import { playWinningChime } from '../utils/audio';

interface TicketResultModalProps {
  result: TicketCheckResponse | null;
  onClose: () => void;
  lang: 'en' | 'ml';
}

export const TicketResultModal: React.FC<TicketResultModalProps> = ({
  result,
  onClose,
  lang,
}) => {
  const [showPdfModal, setShowPdfModal] = useState(false);

  useEffect(() => {
    if (result && result.is_winner) {
      // Play synthesized pleasant victory chime
      playWinningChime();

      // Trigger festive orange and gold confetti explosion
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        zIndex: 9999,
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#ea580c', '#f97316', '#fbbf24'] });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }
  }, [result]);

  if (!result) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Indian Income Tax Section 194B: 30% TDS on lottery winnings above ₹10,000
  const grossAmount = result.total_prize_amount;
  const isTaxApplicable = grossAmount > 10000;
  const tdsDeduction = isTaxApplicable ? Math.round(grossAmount * 0.3) : 0;
  const netTakeHome = grossAmount - tdsDeduction;

  const handleShare = async () => {
    const text = result.is_winner
      ? `🎉 My Kerala Lottery Ticket ${result.ticket_full} for ${result.lottery_name} (${result.draw_id}) won ${formatCurrency(result.total_prize_amount)}! Verified on BhagyaCheck.`
      : `Checked Kerala Lottery Ticket ${result.ticket_full} for ${result.lottery_name} on BhagyaCheck.`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Kerala Lottery Verification Result',
          text,
          url: window.location.href,
        });
      } catch {
        // Ignored or canceled
      }
    } else {
      navigator.clipboard.writeText(text);
      alert(lang === 'en' ? 'Result copied to clipboard!' : 'ഫലം ക്ലിപ്പ്ബോർഡിലേക്ക് പകർത്തി!');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
        
        {/* Papercut Stamped Certificate Modal Card */}
        <div 
          className={`relative w-full max-w-lg rounded-2xl border-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden bg-[#16181f] ${
            result.is_winner
              ? 'border-orange-500 shadow-orange-950/40'
              : 'border-slate-700 shadow-black'
          }`}
        >
          {/* Top Banner (Papercut Header Stamp) */}
          <div 
            className={`px-6 py-5 text-center relative border-b-2 ${
              result.is_winner
                ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 text-white border-orange-700'
                : 'bg-[#1e222d] text-slate-200 border-slate-700'
            }`}
          >
            <button
              onClick={onClose}
              className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-black/20 text-current transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex p-3 rounded-2xl bg-black/20 border border-white/20 mb-2 shadow-inner">
              {result.is_winner ? (
                <Trophy className="w-9 h-9 text-amber-200 animate-bounce" />
              ) : (
                <Frown className="w-9 h-9 text-slate-400" />
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {result.is_winner
                ? (lang === 'en' ? 'CONGRATULATIONS! YOU WON!' : 'അഭിനന്ദനങ്ങൾ! സമ്മാനം ലഭിച്ചു!')
                : (lang === 'en' ? 'BETTER LUCK NEXT DRAW' : 'ഈ ടിക്കറ്റിന് സമ്മാനമില്ല')}
            </h3>

            <p className="text-xs font-bold mt-1 opacity-90 font-mono tracking-wide">
              {result.lottery_name} &bull; {result.draw_id} &bull; {result.draw_date}
            </p>
          </div>

          {/* Modal Body */}
          <div className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            
            {/* Ticket Card Paper Cutout */}
            <div className="bg-[#0f1115] p-4 rounded-xl border-2 border-dashed border-orange-500/40 flex items-center justify-between shadow-inner">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  {lang === 'en' ? 'Checked Ticket' : 'പരിശോധിച്ച ടിക്കറ്റ്'}
                </span>
                <div className="text-2xl font-mono font-black tracking-widest text-orange-400 mt-0.5">
                  {result.ticket_full}
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">
                  {lang === 'en' ? 'Total Prize' : 'ആകെ സമ്മാനം'}
                </span>
                <div className={`text-2xl font-black mt-0.5 ${result.is_winner ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {formatCurrency(result.total_prize_amount)}
                </div>
              </div>
            </div>

            {/* TDS Prize Tax Calculator (Section 194B) */}
            {result.is_winner && (
              <div className="bg-[#101217] p-4 rounded-xl border border-orange-500/30 space-y-2.5">
                <div className="flex items-center justify-between border-b border-orange-500/20 pb-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400 uppercase tracking-wider">
                    <Calculator className="w-4 h-4" />
                    <span>{lang === 'en' ? 'Prize Money & Tax Breakdown' : 'സമ്മാന തുകയും നികുതിയും'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Section 194B</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{lang === 'en' ? 'Gross Prize Amount:' : 'ആകെ സമ്മാന തുക:'}</span>
                    <span className="font-mono font-bold text-slate-100">{formatCurrency(grossAmount)}</span>
                  </div>

                  {isTaxApplicable ? (
                    <>
                      <div className="flex justify-between text-rose-400">
                        <span>{lang === 'en' ? '30% Govt TDS Deduction:' : '30% നികുതി കുറവ് (TDS):'}</span>
                        <span className="font-mono font-bold">- {formatCurrency(tdsDeduction)}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-bold pt-1 border-t border-slate-800 text-sm">
                        <span>{lang === 'en' ? 'Net In-Hand (Bank/Cash):' : 'ലഭിക്കുന്ന തുക (കൈയിൽ):'}</span>
                        <span className="font-mono font-black">{formatCurrency(netTakeHome)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-[11px] text-emerald-400 font-semibold pt-1">
                      {lang === 'en'
                        ? '✓ No tax deduction applicable for prizes up to ₹10,000 (100% full cash).'
                        : '✓ ₹10,000 വരെയുള്ള സമ്മാനങ്ങൾക്ക് നികുതി കുറവില്ല (മുഴുവൻ തുകയും ലഭിക്കും).'}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Matched Prize Tiers */}
            {result.is_winner && result.winning_tiers.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {lang === 'en' ? 'Matched Official Prize Tiers' : 'ലഭിച്ച സമ്മാനങ്ങൾ'}
                </h4>

                <div className="space-y-1.5">
                  {result.winning_tiers.map((tier, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#0e1014] border border-emerald-500/30 flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-emerald-300 text-xs sm:text-sm">
                          {tier.tier_name}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {tier.match_reason}
                        </div>
                      </div>
                      <div className="font-mono font-bold text-emerald-400 text-sm sm:text-base">
                        {formatCurrency(tier.prize_amount)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Direct Official PDF Gazette Link */}
            {result.pdf_url && (
              <div className="p-3 rounded-xl bg-[#0f1115] border border-orange-500/30 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-orange-400 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-200 block">
                      {lang === 'en' ? 'Kerala Govt Gazette PDF' : 'ഔദ്യോഗിക സർക്കാർ ഗസറ്റ് രേഖ'}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      result.keralalotteries.com
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setShowPdfModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold flex items-center gap-1 transition-colors shrink-0 cursor-pointer text-xs"
                >
                  <span>{lang === 'en' ? 'View PDF' : 'പിഡിഎഫ്'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Claim Instructions */}
            <div className="bg-[#101217] p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1.5 text-orange-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{lang === 'en' ? 'Claiming Guidelines' : 'സമ്മാനം കൈപ്പറ്റാൻ'}</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                {result.claim_instructions}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1e222d] hover:bg-[#272d3b] text-slate-200 font-bold text-xs border border-orange-500/20 transition-colors cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{lang === 'en' ? 'Share' : 'പങ്കുവെക്കുക'}</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-slate-950 font-black text-xs shadow-md shadow-orange-500/30 transition-all cursor-pointer"
              >
                <span>{lang === 'en' ? 'Check Another' : 'മറ്റൊന്ന് നോക്കുക'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* Embedded PDF Modal */}
      {showPdfModal && result.pdf_url && (
        <PdfViewerModal
          pdfUrl={result.pdf_url}
          drawId={result.draw_id}
          lotteryName={result.lottery_name}
          onClose={() => setShowPdfModal(false)}
          lang={lang}
        />
      )}
    </>
  );
};
