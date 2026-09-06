import { useState, useEffect } from 'react';
import type { DrawDetail, LotteryTypeInfo } from './types';
import { fetchDraws, fetchLotteries, fetchLatestDraw } from './api';
import { Navbar } from './components/Navbar';
import { TicketChecker } from './components/TicketChecker';
import { ResultsExplorer } from './components/ResultsExplorer';
import { ScheduleViewer } from './components/ScheduleViewer';
import { ClaimGuide } from './components/ClaimGuide';
import { ShieldCheck, Info } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'checker' | 'results' | 'schedule' | 'guide'>('checker');
  const [lang, setLang] = useState<'en' | 'ml'>('en');
  const [draws, setDraws] = useState<DrawDetail[]>([]);
  const [lotteries, setLotteries] = useState<LotteryTypeInfo[]>([]);
  const [latestDraw, setLatestDraw] = useState<DrawDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [dList, lList, lDraw] = await Promise.all([
          fetchDraws(),
          fetchLotteries(),
          fetchLatestDraw(),
        ]);
        setDraws(dList);
        setLotteries(lList);
        setLatestDraw(lDraw);
      } catch (err) {
        console.error('Error loading initial data:', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1015] text-slate-100 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-orange-400 font-bold uppercase tracking-wider">
              {lang === 'en' ? 'Loading Kerala Lottery Data...' : 'വിവരങ്ങൾ ലഭ്യമാക്കുന്നു...'}
            </p>
          </div>
        ) : (
          <div>
            {activeTab === 'checker' && (
              <TicketChecker
                draws={draws}
                latestDraw={latestDraw}
                lang={lang}
              />
            )}

            {activeTab === 'results' && (
              <ResultsExplorer
                draws={draws}
                lang={lang}
              />
            )}

            {activeTab === 'schedule' && (
              <ScheduleViewer
                lotteries={lotteries}
                lang={lang}
              />
            )}

            {activeTab === 'guide' && (
              <ClaimGuide
                lang={lang}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t-2 border-orange-500/20 bg-[#12141a] mt-12 py-8 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-3 text-xs text-slate-400">
          <div className="flex items-center justify-center gap-2 text-orange-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>
              {lang === 'en'
                ? 'Official Results should be verified with the Kerala State Government Gazette'
                : 'ഫലങ്ങൾ കേരള ഗസറ്റുമായി ഒത്തുനോക്കി ഉറപ്പുവരുത്തുക'}
            </span>
          </div>

          <p className="max-w-2xl mx-auto leading-relaxed text-slate-400 text-[11px] font-medium">
            {lang === 'en'
              ? 'BhagyaCheck is an independent result verification utility designed for lottery ticket buyers in Kerala. This application is not an official sales agency or direct subsidiary of the Directorate of Kerala State Lotteries.'
              : 'ലോട്ടറി ഫലങ്ങൾ വേഗത്തിൽ പരിശോധിക്കാൻ സഹായിക്കുന്ന സ്വതന്ത്ര പ്ലാറ്റ്ഫോമാണിത്. ഇത് ഔദ്യോഗിക വിൽപന കേന്ദ്രമല്ല.'}
          </p>

          <div className="pt-2 text-slate-500 flex items-center justify-center gap-4 text-[11px] font-medium">
            <span>&copy; {new Date().getFullYear()} BhagyaCheck Kerala</span>
            <span>&bull;</span>
            <span className="flex items-center gap-1 text-orange-400/90 font-bold">
              <Info className="w-3 h-3" />
              {lang === 'en' ? 'Live Camera OCR & Barcode Verified' : 'ക്യാമറ & OCR സാങ്കേതികവിദ്യ'}
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
