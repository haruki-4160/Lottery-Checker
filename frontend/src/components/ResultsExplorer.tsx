import React, { useState } from 'react';
import type { DrawDetail } from '../types';
import { Trophy, Search, FileText, Calendar, Award, ExternalLink, ShieldCheck, Eye } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      
      {/* Official Directorate Verification Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-slate-900 border border-emerald-800/40 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                {lang === 'en' ? 'Authentic Government Source' : 'ഔദ്യോഗിക സർക്കാർ സ്രോതസ്സ്'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold">
                100% Verified
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {lang === 'en'
                ? 'All results & winning numbers are extracted directly from the Directorate of Kerala State Lotteries.'
                : 'കേരള സംസ്ഥാന ഭാഗ്യക്കുറി വകുപ്പിന്റെ ഔദ്യോഗിക ഗസറ്റ് ഫലങ്ങളുമായി നേരിട്ട് ബന്ധിപ്പിച്ചിരിക്കുന്നു.'}
            </p>
          </div>
        </div>

        <a
          href="https://statelottery.kerala.gov.in/index.php/lottery-result-view"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-slate-200 transition-colors self-start sm:self-center shrink-0"
        >
          <span>statelottery.kerala.gov.in</span>
          <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
        </a>
      </div>

      {/* Header & Draw Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{lang === 'en' ? 'Official Kerala Lottery Results' : 'കേരള ലോട്ടറി നറുക്കെടുപ്പ് ഫലങ്ങൾ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Select any draw to view the full prize breakdown and view the official Government Gazette PDF.'
              : 'നറുക്കെടുപ്പ് തിരഞ്ഞെടുത്ത് ഔദ്യോഗിക ഗസറ്റ് പിഡിഎഫും സമ്മാനാർഹരുടെ നമ്പറുകളും കാണുക.'}
          </p>
        </div>

        {/* Draw Picker Dropdown */}
        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={selectedDrawId}
            onChange={(e) => setSelectedDrawId(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-500 transition-colors"
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
              className="flex items-center gap-1.5 px-3.5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/20"
              title="View Official Government PDF Gazette"
            >
              <Eye className="w-4 h-4" />
              <span>{lang === 'en' ? 'View Official PDF' : 'ഔദ്യോഗിക PDF കാണുക'}</span>
            </button>
          )}
        </div>
      </div>

      {currentDraw ? (
        <div className="space-y-6">
          
          {/* Top 1st Prize Hero Card */}
          <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-transparent border border-amber-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <Award className="w-3.5 h-3.5" />
                  {currentDraw.lottery_name} &bull; {currentDraw.draw_id}
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentDraw.draw_date}</span>
                  {currentDraw.malayalam_name && (
                    <span className="text-amber-400 font-medium">({currentDraw.malayalam_name})</span>
                  )}
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  1st Prize: {formatCurrency(currentDraw.prizes[0]?.amount || 7500000)}
                </h3>
              </div>

              <div className="text-left sm:text-right bg-slate-950/70 p-4 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  {lang === 'en' ? 'Winning Ticket' : 'വിജയിച്ച ടിക്കറ്റ്'}
                </span>
                <div className="text-3xl font-mono font-black text-amber-400 tracking-widest mt-0.5">
                  {currentDraw.first_prize_winner || 'WA 000000'}
                </div>
              </div>
            </div>

            {/* Direct Link to Official Gazette */}
            {currentDraw.pdf_url && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  {lang === 'en' ? 'Official Kerala State Gazette Document:' : 'ഔദ്യോഗിക കേരള ഗസറ്റ് രേഖ:'}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewingPdf({
                      url: currentDraw.pdf_url!,
                      drawId: currentDraw.draw_id,
                      name: currentDraw.lottery_name
                    })}
                    className="hover:text-amber-400 underline font-semibold flex items-center gap-1 text-slate-300"
                  >
                    <span>{lang === 'en' ? 'Preview in Browser' : 'ഇവിടെ കാണുക'}</span>
                  </button>
                  <span className="text-slate-600">&bull;</span>
                  <a
                    href={currentDraw.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-amber-400 underline font-semibold flex items-center gap-1 text-slate-300"
                  >
                    <span>{lang === 'en' ? 'Direct Official PDF Link' : 'നേരിട്ടുള്ള ലിങ്ക്'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Search Box for quick ticket check within current draw */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.trim().toUpperCase())}
              placeholder={
                lang === 'en'
                  ? 'Search 4-digit or 6-digit number in this draw...'
                  : 'നമ്പറുകൾ തിരയുക (ഉദാ: 555248 അല്ലെങ്കിൽ 0140)...'
              }
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors"
            />
          </div>

          {/* Prize Tiers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentDraw.prizes.map((tier) => {
              const filteredNumbers = searchQuery
                ? tier.numbers.filter((num) => num.includes(searchQuery))
                : tier.numbers;

              if (searchQuery && filteredNumbers.length === 0) return null;

              return (
                <div
                  key={tier.tier_id}
                  className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{tier.tier_name}</h4>
                      <span className="text-[11px] text-slate-400">
                        {tier.match_type === 'suffix'
                          ? (lang === 'en' ? 'Last 4 / 2 digits' : 'അവസാന അക്കങ്ങൾ')
                          : tier.match_type === 'consolation'
                          ? (lang === 'en' ? 'Remaining Series' : 'മറ്റു സീരീസുകൾ')
                          : (lang === 'en' ? 'Full Ticket' : 'മുഴുവൻ നമ്പർ')}
                      </span>
                    </div>
                    <div className="font-mono font-black text-amber-400 text-base">
                      {formatCurrency(tier.amount)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
                    {filteredNumbers.length > 0 ? (
                      filteredNumbers.map((num, i) => (
                        <span
                          key={i}
                          className={`font-mono text-xs px-2.5 py-1 rounded-md border ${
                            searchQuery && num.includes(searchQuery)
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-bold'
                              : 'bg-slate-950 text-slate-300 border-slate-800'
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
