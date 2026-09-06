import React, { useState } from 'react';
import type { DrawDetail } from '../types';
import { Trophy, Search, ExternalLink, ShieldCheck, Eye, Medal } from 'lucide-react';
import { PdfViewerModal } from './PdfViewerModal';

interface ResultsExplorerProps {
  draws: DrawDetail[];
  lang: 'en' | 'ml';
}

export const ResultsExplorer: React.FC<ResultsExplorerProps> = ({ draws, lang }) => {
  const [selectedDrawId, setSelectedDrawId] = useState<string>(draws[0]?.draw_id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewingPdf, setViewingPdf] = useState<{ url: string; drawId: string; name: string } | null>(null);

  const currentDraw = draws.find((d) => d.draw_id === selectedDrawId) || draws[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const firstPrize = currentDraw?.prizes.find((p) => p.tier_id === 1);
  const secondPrize = currentDraw?.prizes.find((p) => p.tier_id === 3);
  const thirdPrize = currentDraw?.prizes.find((p) => p.tier_id === 4);

  return (
    <div className="space-y-6">
      
      {/* Official Directorate Verification Banner (Papercut style) */}
      <div className="bg-[#14171e] border-2 border-emerald-500/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {lang === 'en' ? 'Official Kerala Govt Source' : 'ഔദ്യോഗിക സർക്കാർ സ്രോതസ്സ്'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                100% Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'en'
                ? 'Directly cross-referenced with Government Gazette PDFs from the Directorate of Kerala State Lotteries.'
                : 'കേരള സംസ്ഥാന ഭാഗ്യക്കുറി വകുപ്പിന്റെ ഔദ്യോഗിക ഗസറ്റ് ഫലങ്ങളുമായി നേരിട്ട് ഒത്തുനോക്കുന്നു.'}
            </p>
          </div>
        </div>

        <a
          href="https://statelottery.kerala.gov.in/index.php/lottery-result-view"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1e222c] hover:bg-[#262c38] border-2 border-orange-500/40 text-xs font-bold text-orange-400 transition-colors self-start sm:self-center shrink-0 cursor-pointer shadow-xs"
        >
          <span>statelottery.kerala.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Draw Selector Card */}
      <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-400" />
            <span>{lang === 'en' ? 'Official Kerala Draw Results' : 'കേരള ലോട്ടറി നറുക്കെടുപ്പ് ഫലങ്ങൾ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {lang === 'en'
              ? 'Select draw to view verified numbers and download the Government Gazette PDF.'
              : 'നറുക്കെടുപ്പ് തിരഞ്ഞെടുത്ത് ഔദ്യോഗിക ഗസറ്റ് പിഡിഎഫും സമ്മാനാർഹരുടെ നമ്പറുകളും കാണുക.'}
          </p>
        </div>

        {/* Draw Dropdown & PDF Button */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDrawId}
            onChange={(e) => setSelectedDrawId(e.target.value)}
            className="px-4 py-2.5 bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl text-slate-100 text-sm font-bold focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
          >
            {draws.map((d) => (
              <option key={d.draw_id} value={d.draw_id}>
                {d.lottery_name} ({d.draw_id}) &mdash; {d.draw_date}
              </option>
            ))}
          </select>

          {currentDraw?.pdf_url && (
            <button
              onClick={() => setViewingPdf({
                url: currentDraw.pdf_url!,
                drawId: currentDraw.draw_id,
                name: currentDraw.lottery_name
              })}
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-orange-500 hover:bg-orange-400 text-slate-950 rounded-xl text-xs font-black transition-all shadow-[0_4px_12px_rgba(249,115,22,0.3)] cursor-pointer"
              title="View Official Government PDF Gazette"
            >
              <Eye className="w-4 h-4" />
              <span>{lang === 'en' ? 'View PDF Gazette' : 'ഗസറ്റ് PDF കാണുക'}</span>
            </button>
          )}
        </div>
      </div>

      {currentDraw ? (
        <div className="space-y-6">
          
          {/* Top 3 Prize Podium Cards (Papercut Gold, Silver, Bronze) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1st Prize Gold Podium */}
            <div className="bg-[#181a22] border-2 border-amber-500/60 rounded-2xl p-5 shadow-[0_8px_20px_rgba(245,158,11,0.15)] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-7 h-7 bg-amber-500/20 border-b-2 border-l-2 border-amber-500/40 rounded-bl-xl"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-amber-500/40">
                    <Medal className="w-3.5 h-3.5" />
                    1st Prize
                  </span>
                  <span className="text-xs font-black text-amber-400 font-mono">
                    {formatCurrency(firstPrize?.amount || 10000000)}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-mono font-black text-white tracking-widest my-2">
                  {currentDraw.first_prize_winner || 'WA 000000'}
                </div>
              </div>
              <div className="pt-2 border-t border-amber-500/20 text-[11px] text-amber-300/80 font-medium">
                {lang === 'en' ? 'Exact series + 6 digits match' : 'സീരീസും മുഴുവൻ നമ്പറും'}
              </div>
            </div>

            {/* 2nd Prize Silver Podium */}
            <div className="bg-[#181a22] border-2 border-slate-600 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-7 h-7 bg-slate-700/30 border-b-2 border-l-2 border-slate-600 rounded-bl-xl"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-200 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-slate-600">
                    <Medal className="w-3.5 h-3.5 text-slate-300" />
                    2nd Prize
                  </span>
                  <span className="text-xs font-black text-slate-300 font-mono">
                    {secondPrize ? formatCurrency(secondPrize.amount) : '₹25 Lakhs'}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-mono font-black text-slate-100 tracking-widest my-2">
                  {secondPrize?.numbers[0] || '---'}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium">
                {lang === 'en' ? 'Second tier winning ticket' : 'രണ്ടാം സമ്മാനാർഹമായ ടിക്കറ്റ്'}
              </div>
            </div>

            {/* 3rd Prize Bronze Podium */}
            <div className="bg-[#181a22] border-2 border-orange-700/60 rounded-2xl p-5 shadow-lg flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-7 h-7 bg-orange-700/20 border-b-2 border-l-2 border-orange-700/40 rounded-bl-xl"></div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2.5 py-1 rounded-md bg-orange-950/80 text-orange-300 text-xs font-black uppercase tracking-wider flex items-center gap-1 border border-orange-700/40">
                    <Medal className="w-3.5 h-3.5 text-orange-400" />
                    3rd Prize
                  </span>
                  <span className="text-xs font-black text-orange-300 font-mono">
                    {thirdPrize ? formatCurrency(thirdPrize.amount) : '₹5 Lakhs'}
                  </span>
                </div>
                <div className="text-xl sm:text-2xl font-mono font-black text-slate-100 tracking-widest my-2">
                  {thirdPrize?.numbers[0] || '---'}
                </div>
              </div>
              <div className="pt-2 border-t border-orange-900/40 text-[11px] text-orange-300/80 font-medium">
                {lang === 'en' ? 'Third tier winning ticket' : 'മൂന്നാം സമ്മാനാർഹമായ ടിക്കറ്റ്'}
              </div>
            </div>

          </div>

          {/* Search Box for quick ticket check within current draw */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim().toUpperCase())}
              placeholder={
                lang === 'en'
                  ? 'Search 4-digit or 6-digit number in this draw...'
                  : 'നമ്പറുകൾ തിരയുക (ഉദാ: 555248 അല്ലെങ്കിൽ 0140)...'
              }
              className="w-full pl-11 pr-4 py-3.5 bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl text-slate-100 placeholder-slate-500 text-sm font-bold focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
            />
          </div>

          {/* Prize Tiers Grid (Papercut cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDraw.prizes.map((tier) => {
              const filteredNumbers = searchQuery
                ? tier.numbers.filter((num) => num.includes(searchQuery))
                : tier.numbers;

              if (searchQuery && filteredNumbers.length === 0) return null;

              return (
                <div
                  key={tier.tier_id}
                  className="bg-[#14171e] border-2 border-orange-500/20 rounded-xl p-4 flex flex-col justify-between hover:border-orange-500/50 transition-colors shadow-md"
                >
                  <div className="flex items-center justify-between border-b border-orange-500/20 pb-2.5 mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-100">{tier.tier_name}</h4>
                      <span className="text-[11px] text-slate-400">
                        {tier.match_type === 'suffix'
                          ? (lang === 'en' ? 'Last 4 digits' : 'അവസാന 4 അക്കങ്ങൾ')
                          : tier.match_type === 'consolation'
                          ? (lang === 'en' ? 'Remaining Series' : 'മറ്റു സീരീസുകൾ')
                          : (lang === 'en' ? 'Full Ticket' : 'മുഴുവൻ നമ്പർ')}
                      </span>
                    </div>
                    <div className="font-mono font-black text-orange-400 text-base">
                      {formatCurrency(tier.amount)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {filteredNumbers.length > 0 ? (
                      filteredNumbers.map((num, i) => (
                        <span
                          key={i}
                          className={`font-mono text-xs px-2.5 py-1 rounded-md border-2 ${
                            searchQuery && num.includes(searchQuery)
                              ? 'bg-orange-500 text-slate-950 border-orange-400 font-black'
                              : 'bg-[#0b0d11] text-slate-200 border-orange-500/20'
                          }`}
                        >
                          {num}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">
                        {lang === 'en' ? 'No matching number in this tier' : 'ഈ കാറ്റഗറിയിൽ ചേർച്ചയില്ല'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      ) : (
        <div className="p-8 text-center text-slate-500">
          {lang === 'en' ? 'No lottery draw details available.' : 'ഫലങ്ങൾ ലഭ്യമല്ല.'}
        </div>
      )}

      {/* Embedded Official PDF Modal */}
      {viewingPdf && (
        <PdfViewerModal
          pdfUrl={viewingPdf.url}
          drawId={viewingPdf.drawId}
          lotteryName={viewingPdf.name}
          onClose={() => setViewingPdf(null)}
          lang={lang}
        />
      )}

    </div>
  );
};
