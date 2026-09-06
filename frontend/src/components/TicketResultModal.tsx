import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Frown, X, CheckCircle2, ShieldCheck, Share2, ArrowRight } from 'lucide-react';
import type { TicketCheckResponse } from '../types';

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
  useEffect(() => {
    if (result && result.is_winner) {
      // Trigger festive confetti explosion
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

      fire(0.25, { spread: 26, startVelocity: 55, colors: ['#f59e0b', '#10b981', '#3b82f6'] });
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

  const handleShare = async () => {
    const text = result.is_winner
      ? `🎉 My Kerala Lottery Ticket ${result.ticket_full} for ${result.lottery_name} (${result.draw_id}) won ${formatCurrency(result.total_prize_amount)}! Checked on BhagyaCheck.`
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden ${
          result.is_winner
            ? 'bg-slate-900 border-amber-500/50 shadow-amber-500/10'
            : 'bg-slate-900 border-slate-700 shadow-slate-950/50'
        }`}
      >
        {/* Top Banner */}
        <div 
          className={`px-6 py-6 text-center relative overflow-hidden ${
            result.is_winner
              ? 'bg-gradient-to-br from-amber-500 via-orange-600 to-amber-700 text-slate-950'
              : 'bg-slate-800 text-slate-200 border-b border-slate-700'
          }`}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/20 text-current transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex p-3 rounded-full bg-white/20 backdrop-blur-md mb-3 shadow-inner">
            {result.is_winner ? (
              <Trophy className="w-10 h-10 text-amber-100 animate-bounce" />
            ) : (
              <Frown className="w-10 h-10 text-slate-400" />
            )}
          </div>

          <h3 className="text-2xl font-black tracking-tight">
            {result.is_winner
              ? (lang === 'en' ? 'CONGRATULATIONS! YOU WON!' : 'അഭിനന്ദനങ്ങൾ! നിങ്ങൾക്ക് സമ്മാനം ലഭിച്ചു!')
              : (lang === 'en' ? 'NO PRIZE WON' : 'സമ്മാനം ലഭിച്ചില്ല')}
          </h3>

          <p className="text-sm font-medium mt-1 opacity-90">
            {result.lottery_name} &bull; {result.draw_id} &bull; {result.draw_date}
          </p>
        </div>

        {/* Ticket Details & Prizes */}
        <div className="p-6 space-y-6">
          
          {/* Ticket Card View */}
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">
                {lang === 'en' ? 'Verified Ticket' : 'പരിശോധിച്ച ടിക്കറ്റ്'}
              </span>
              <div className="text-2xl font-mono font-bold tracking-widest text-amber-400 mt-0.5">
                {result.ticket_full}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider">
                {lang === 'en' ? 'Total Prize' : 'ആകെ സമ്മാനം'}
              </span>
              <div className={`text-2xl font-black mt-0.5 ${result.is_winner ? 'text-emerald-400' : 'text-slate-500'}`}>
                {formatCurrency(result.total_prize_amount)}
              </div>
            </div>
          </div>

          {/* Winning Breakdown */}
          {result.is_winner && result.winning_tiers.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                {lang === 'en' ? 'Matched Prize Tiers' : 'ലഭിച്ച സമ്മാനങ്ങൾ'}
              </h4>

              <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
                {result.winning_tiers.map((tier, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/40 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-emerald-300 text-sm">
                        {tier.tier_name}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {tier.match_reason}
                      </div>
                    </div>
                    <div className="font-mono font-bold text-emerald-400 text-base">
                      {formatCurrency(tier.prize_amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official Claim Advice */}
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>{lang === 'en' ? 'Official Claim Instructions' : 'സമ്മാനം മാറുന്നതിനുള്ള വിവരങ്ങൾ'}</span>
            </div>
            <p className="leading-relaxed">
              {result.claim_instructions}
            </p>
            <p className="text-[11px] text-slate-400 italic">
              {lang === 'en'
                ? '* Always verify the original ticket with the Kerala Government Gazette before claim submission.'
                : '* സമ്മാന തുക കൈപ്പറ്റുന്നതിന് മുൻപ് യഥാർത്ഥ ഗസറ്റ് ഫലവുമായി ഒത്തുനോക്കുക.'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleShare}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{lang === 'en' ? 'Share Result' : 'പങ്കുവെക്കുക'}</span>
            </button>

            <button
              onClick={onClose}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
            >
              <span>{lang === 'en' ? 'Check Another' : 'മറ്റൊന്ന് പരിശോധിക്കുക'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
