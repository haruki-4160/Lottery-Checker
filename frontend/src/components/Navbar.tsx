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
    <header className="sticky top-0 z-40 bg-[#12141a] border-b-2 border-orange-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with tactile papercut stamp look */}
          <div 
            onClick={() => setActiveTab('checker')} 
            className="flex items-center space-x-3 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center shadow-[0_4px_12px_rgba(234,88,12,0.35)] border border-orange-400/40 group-hover:scale-105 transition-transform">
              <Ticket className="w-5 h-5 text-white font-black" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xl tracking-tight text-white">
                  Bhagya<span className="text-orange-500">Check</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/40">
                  Kerala
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                {lang === 'en' ? 'Kerala Lottery Results & Scanner' : 'കേരള ലോട്ടറി ഫലങ്ങൾ & സ്കാനർ'}
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Tactile paper cutout style) */}
          <nav className="hidden md:flex items-center space-x-1.5 bg-[#0b0d11] p-1.5 rounded-xl border border-orange-500/20 shadow-inner">
            <button
              onClick={() => setActiveTab('checker')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'checker'
                  ? 'bg-orange-500 text-slate-950 shadow-[0_2px_8px_rgba(249,115,22,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Check Ticket' : 'പരിശോധന'}</span>
            </button>

            <button
              onClick={() => setActiveTab('results')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'results'
                  ? 'bg-orange-500 text-slate-950 shadow-[0_2px_8px_rgba(249,115,22,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Official Results' : 'ഫലങ്ങൾ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-orange-500 text-slate-950 shadow-[0_2px_8px_rgba(249,115,22,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Draw Schedule' : 'ഷെഡ്യൂൾ'}</span>
            </button>

            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'guide'
                  ? 'bg-orange-500 text-slate-950 shadow-[0_2px_8px_rgba(249,115,22,0.35)]'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'How to Claim' : 'വിവരങ്ങൾ'}</span>
            </button>
          </nav>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2">
            <a
              href="https://statelottery.kerala.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1b1f29] hover:bg-[#232836] text-orange-400 border border-orange-500/30 transition-colors shadow-xs"
              title="Official Directorate of Kerala State Lotteries"
            >
              <span>Govt Portal</span>
              <ExternalLink className="w-3 h-3 text-orange-400" />
            </a>

            <button
              onClick={() => setLang(lang === 'en' ? 'ml' : 'en')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1b1f29] hover:bg-[#232836] text-slate-200 border border-orange-500/30 transition-colors shadow-xs"
              title="Toggle English / Malayalam"
            >
              <Globe className="w-3.5 h-3.5 text-orange-400" />
              <span>{lang === 'en' ? 'മലയാളം' : 'English'}</span>
            </button>
          </div>

        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around border-t border-orange-500/20 py-2">
          <button
            onClick={() => setActiveTab('checker')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'checker' ? 'text-orange-400 font-black' : 'text-slate-400'
            }`}
          >
            <Sparkles className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Check' : 'പരിശോധന'}
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'results' ? 'text-orange-400 font-black' : 'text-slate-400'
            }`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Results' : 'ഫലങ്ങൾ'}
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'schedule' ? 'text-orange-400 font-black' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-4 h-4 mb-0.5" />
            {lang === 'en' ? 'Schedule' : 'ഷെഡ്യൂൾ'}
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex flex-col items-center text-xs py-1 px-2 rounded-md ${
              activeTab === 'guide' ? 'text-orange-400 font-black' : 'text-slate-400'
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
