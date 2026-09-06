import React from 'react';
import { Ticket, Sparkles, Globe, Calendar, FileText, Info, ExternalLink } from 'lucide-react';

interface NavbarProps {
  activeTab: 'checker' | 'results' | 'schedule' | 'guide';
  setActiveTab: (tab: 'checker' | 'results' | 'schedule' | 'guide') => void;
  lang: 'en' | 'ml';
  setLang: (lang: 'en' | 'ml') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  lang,
  setLang,
}) => {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-800 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Title */}
          <div 
            onClick={() => setActiveTab('checker')} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Ticket className="w-6 h-6 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-amber-200 to-amber-400 bg-clip-text text-transparent">
                  BhagyaCheck
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Kerala
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                {lang === 'en' ? 'Kerala Lottery Results & Scanner' : 'കേരള ലോട്ടറി ഫലങ്ങൾ & സ്കാനർ'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'checker'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              {lang === 'en' ? 'Check Ticket' : 'ടിക്കറ്റ് പരിശോധിക്കുക'}
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'results'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <FileText className="w-4 h-4" />
              {lang === 'en' ? 'Latest Results' : 'ഏറ്റവും പുതിയ ഫലങ്ങൾ'}
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'schedule'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Calendar className="w-4 h-4" />
              {lang === 'en' ? 'Draw Schedule' : 'നറുക്കെടുപ്പ് ഷെഡ്യൂൾ'}
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Info className="w-4 h-4" />
              {lang === 'en' ? 'How to Claim' : 'സമ്മാനം കൈപ്പറ്റാൻ'}
            </button>
          </nav>

          {/* Language Toggle & Official Portal */}
          <div className="flex items-center gap-2">
            <a
              href="https://statelottery.kerala.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-800/50 transition-colors shadow-inner"
              title="Official Directorate of Kerala State Lotteries"
            >
              <span>Govt Portal</span>
              <ExternalLink className="w-3 h-3 text-emerald-400" />
            </a>

            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors shadow-inner"
              title="Toggle English / Malayalam"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 py-2">
          <button
            onClick={() => setActiveTab('checker')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'checker' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Check' : 'പരിശോധന'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'results' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Results' : 'ഫലങ്ങൾ'}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'schedule' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Schedule' : 'ഷെഡ്യൂൾ'}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'guide' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Info className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Claims' : 'വിവരങ്ങൾ'}
          </button>
        </div>

      </div>
    </header>
  );
};
