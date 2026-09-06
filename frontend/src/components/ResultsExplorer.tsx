import React, { useState } from 'react';
import type { DrawDetail } from '../types';
import { Trophy, Search, FileDown, Calendar, Award } from 'lucide-react';

interface ResultsExplorerProps {
  draws: DrawDetail[];
  lang: 'en' | 'ml';
}

export const ResultsExplorer: React.FC<ResultsExplorerProps> = ({ draws, lang }) => {
  const [selectedDrawId, setSelectedDrawId] = useState<string>(draws[0]?.draw_id || '');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      
      {/* Header & Draw Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>{lang === 'en' ? 'Kerala Lottery Draw Results' : 'കേരള ലോട്ടറി നറുക്കെടുപ്പ് ഫലങ്ങൾ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Browse verified winning numbers for all official weekly and bumper draws.'
              : 'ഔദ്യോഗിക നറുക്കെടുപ്പ് ഫലങ്ങളും വിജയികളുടെ നമ്പറുകളും പരിശോധിക്കുക.'}
          </p>
        </div>

        {/* Draw Picker Dropdown */}
        <div className="flex items-center gap-3">
          <select
            value={selectedDrawId}
            onChange={(e) => setSelectedDrawId(e.target.value)}
            className="px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-500 transition-colors"
          >
            {draws.map((d) => (
              <option key={d.draw_id} value={d.draw_id}>
                {d.lottery_name} ({d.draw_id}) - {d.draw_date}
              </option>
            ))}
          </select>

          {currentDraw?.pdf_url && (
            <a
              href={currentDraw.pdf_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              title="Download Official PDF Gazette"
            >
              <FileDown className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">PDF</span>
            </a>
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

              <div className="text-left sm:text-right bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  {lang === 'en' ? 'Winning Ticket' : 'വിജയിച്ച ടിക്കറ്റ്'}
                </span>
                <div className="text-3xl font-mono font-black text-amber-400 tracking-widest mt-0.5">
                  {currentDraw.first_prize_winner || 'WA 000000'}
                </div>
              </div>
            </div>
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
                  : 'നമ്പറുകൾ തിരയുക (ഉദാ: 745821 അല്ലെങ്കിൽ 1245)...'
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

    </div>
  );
};
