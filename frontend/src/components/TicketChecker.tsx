import React, { useState } from 'react';
import type { DrawDetail, TicketCheckResponse } from '../types';
import { checkTicketAPI } from '../api';
import { Camera, Upload, Sparkles, AlertCircle, ArrowRight, Dices, Award, Zap, FileText, ExternalLink, RotateCcw } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { UploadScanner } from './UploadScanner';
import { TicketResultModal } from './TicketResultModal';
import { PdfViewerModal } from './PdfViewerModal';
import { DrawCountdown } from './DrawCountdown';
import { RealisticTicketCard } from './RealisticTicketCard';

interface TicketCheckerProps {
  draws: DrawDetail[];
  latestDraw: DrawDetail | null;
  lang: 'en' | 'ml';
}

export const TicketChecker: React.FC<TicketCheckerProps> = ({
  draws,
  latestDraw,
  lang,
}) => {
  const [selectedDrawId, setSelectedDrawId] = useState<string>(
    latestDraw?.draw_id || draws[0]?.draw_id || ''
  );
  const [series, setSeries] = useState<string>('');
  const [number, setNumber] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Modals
  const [showCamera, setShowCamera] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [checkResult, setCheckResult] = useState<TicketCheckResponse | null>(null);
  const [viewingPdf, setViewingPdf] = useState<{ url: string; drawId: string; name: string } | null>(null);

  const activeDraw = draws.find((d) => d.draw_id === selectedDrawId) || latestDraw || draws[0];

  const handleSeriesChange = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setSeries(clean);
    setErrorMsg('');
  };

  const handleNumberChange = (val: string) => {
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setNumber(clean);
    setErrorMsg('');
  };

  const handleClear = () => {
    setSeries('');
    setNumber('');
    setErrorMsg('');
  };

  const handleCheck = async (s = series, n = number, drawId = selectedDrawId) => {
    if (!s.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter a 2-letter series code (e.g. MG).' : 'സീരീസ് നൽകുക (ഉദാ: MG).');
      return;
    }
    if (!n.trim() || n.length < 4) {
      setErrorMsg(lang === 'en' ? 'Please enter a 6-digit ticket number.' : '6 അക്ക ടിക്കറ്റ് നമ്പർ നൽകുക.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const response = await checkTicketAPI({
        draw_id: drawId || undefined,
        series: s,
        number: n,
      });
      setCheckResult(response);
    } catch (err: any) {
      setErrorMsg(err.message || (lang === 'en' ? 'Verification failed' : 'പരിശോധന പരാജയപ്പെട്ടു'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDetectedTicket = (data: { series?: string; number?: string; drawCode?: string }) => {
    if (data.series) setSeries(data.series.toUpperCase());
    if (data.number) setNumber(data.number);
    if (data.drawCode) {
      const matchingDraw = draws.find((d) => d.draw_id.toUpperCase() === data.drawCode?.toUpperCase());
      if (matchingDraw) {
        setSelectedDrawId(matchingDraw.draw_id);
      }
    }
    setShowCamera(false);
    setShowUpload(false);
    if (data.series && data.number) {
      handleCheck(data.series, data.number, data.drawCode || selectedDrawId);
    }
  };

  // Quick sample testers
  const loadSample = (s: string, n: string, drawId: string) => {
    setSeries(s);
    setNumber(n);
    setSelectedDrawId(drawId);
    handleCheck(s, n, drawId);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. Live Daily 3:00 PM Draw Countdown Ticker */}
      <DrawCountdown lang={lang} />

      {/* 2. Top Draw Banner with Papercut Stamped Styling */}
      <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 shadow-[0_8px_20px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        {/* Decorative corner cut tab */}
        <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl pointer-events-none"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
                {lang === 'en' ? 'Official Govt Gazette Results' : 'ഔദ്യോഗിക ഗസറ്റ് ഫലം'}
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">
                {activeDraw?.draw_date}
              </span>
            </div>

            <h2 className="text-2xl font-black text-white mt-1 uppercase tracking-tight">
              {activeDraw?.lottery_name} &bull; {activeDraw?.draw_id}
            </h2>
            {activeDraw?.malayalam_name && (
              <p className="text-xs font-bold text-orange-400">
                {activeDraw.malayalam_name}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl px-4 py-2.5 shadow-inner">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                {lang === 'en' ? 'First Prize' : 'ഒന്നാം സമ്മാനം'}
              </span>
              <div className="text-xl font-mono font-black text-orange-400">
                ₹{activeDraw ? (activeDraw.prizes[0]?.amount / 100000).toLocaleString('en-IN') : '75'} Lakhs
              </div>
            </div>

            {activeDraw?.pdf_url && (
              <button
                onClick={() => setViewingPdf({
                  url: activeDraw.pdf_url!,
                  drawId: activeDraw.draw_id,
                  name: activeDraw.lottery_name
                })}
                className="hidden sm:flex flex-col items-center justify-center px-3.5 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border-2 border-orange-500/40 text-xs font-bold text-orange-300 transition-colors cursor-pointer"
                title="View Government Gazette PDF"
              >
                <FileText className="w-4 h-4 mb-0.5 text-orange-400" />
                <span>PDF Gazette</span>
              </button>
            )}
          </div>
        </div>

        {/* Live official reference link banner */}
        {activeDraw?.pdf_url && (
          <div className="mt-3 pt-3 border-t border-orange-500/20 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <FileText className="w-3.5 h-3.5 text-orange-400" />
              <span>Directorate of Kerala State Lotteries &bull; Official Result Document</span>
            </span>
            <button
              onClick={() => setViewingPdf({
                url: activeDraw.pdf_url!,
                drawId: activeDraw.draw_id,
                name: activeDraw.lottery_name
              })}
              className="text-orange-400 hover:text-orange-300 font-bold underline flex items-center gap-1 cursor-pointer"
            >
              <span>{lang === 'en' ? 'View PDF Gazette' : 'പിഡിഎഫ് കാണുക'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* 3. Interactive Realistic Physical Ticket Visualizer */}
      <div className="py-1">
        <RealisticTicketCard
          series={series}
          number={number}
          lotteryName={activeDraw?.lottery_name || ''}
          drawId={activeDraw?.draw_id || ''}
          drawDate={activeDraw?.draw_date || ''}
          prizeAmount={activeDraw?.prizes[0]?.amount}
          lang={lang}
        />
      </div>

      {/* 4. Main Checker Controls (Papercut Card Style) */}
      <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)] space-y-5">
        
        {/* Draw Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
            {lang === 'en' ? 'Select Draw / Lottery' : 'ലോട്ടറി തിരഞ്ഞെടുക്കുക'}
          </label>
          <select
            value={selectedDrawId}
            onChange={(e) => setSelectedDrawId(e.target.value)}
            className="w-full px-4 py-3 bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl text-slate-100 text-sm font-bold focus:outline-none focus:border-orange-500 transition-colors shadow-inner"
          >
            {draws.map((d) => (
              <option key={d.draw_id} value={d.draw_id}>
                {d.lottery_name} ({d.draw_id}) &mdash; {d.draw_date}
              </option>
            ))}
          </select>
        </div>

        {/* Scanning Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#1e222c] hover:bg-[#262c38] border-2 border-orange-500/40 text-slate-100 font-bold text-sm transition-all hover:border-orange-400 group cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>{lang === 'en' ? 'Scan Ticket with Camera' : 'ക്യാമറ വഴി സ്കാൻ ചെയ്യുക'}</span>
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-[#1e222c] hover:bg-[#262c38] border-2 border-orange-500/40 text-slate-100 font-bold text-sm transition-all hover:border-orange-400 group cursor-pointer shadow-sm"
          >
            <Upload className="w-4 h-4 text-orange-400 group-hover:scale-110 transition-transform" />
            <span>{lang === 'en' ? 'Upload Ticket Photo' : 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t-2 border-dashed border-orange-500/20 w-full"></div>
          <span className="bg-[#14171e] px-3 text-xs font-black uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'or enter ticket digits' : 'അല്ലെങ്കിൽ നമ്പർ ടൈപ്പ് ചെയ്യുക'}
          </span>
          <div className="border-t-2 border-dashed border-orange-500/20 w-full"></div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Series Code */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
              {lang === 'en' ? 'Series (2 Letters)' : 'സീരീസ് (2 അക്ഷരം)'}
            </label>
            <input
              type="text"
              value={series}
              onChange={(e) => handleSeriesChange(e.target.value)}
              placeholder="MG"
              maxLength={3}
              className="w-full px-4 py-3.5 bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl text-orange-400 font-mono font-black text-2xl tracking-widest text-center focus:outline-none focus:border-orange-500 transition-colors uppercase placeholder-slate-600 shadow-inner"
            />
          </div>

          {/* 6-Digit Number */}
          <div className="space-y-1.5 sm:col-span-2">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-300">
                {lang === 'en' ? '6-Digit Ticket Number' : '6 അക്ക ടിക്കറ്റ് നമ്പർ'}
              </label>
              {(series || number) && (
                <button
                  onClick={handleClear}
                  className="text-[11px] font-bold text-slate-400 hover:text-orange-400 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              )}
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="555248"
              maxLength={6}
              className="w-full px-4 py-3.5 bg-[#0c0e12] border-2 border-orange-500/40 rounded-xl text-orange-400 font-mono font-black text-2xl tracking-widest text-center focus:outline-none focus:border-orange-500 transition-colors placeholder-slate-600 shadow-inner"
            />
          </div>

        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border-2 border-rose-500/50 flex items-center gap-2 text-rose-300 text-xs font-bold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Tactile Big Action Button */}
        <button
          onClick={() => handleCheck()}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 via-orange-600 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black text-base shadow-[0_6px_0_#c2410c,0_12px_24px_rgba(234,88,12,0.35)] active:translate-y-1 active:shadow-[0_2px_0_#c2410c] flex items-center justify-center gap-2 transition-all disabled:opacity-60 group cursor-pointer border border-orange-300/40"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-3 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950 group-hover:rotate-12 transition-transform" />
              <span>{lang === 'en' ? 'CHECK RESULT NOW' : 'ഫലം പരിശോധിക്കുക'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </div>

      {/* 5. Real Today's Winning Test Samples */}
      <div className="bg-[#14171e] border-2 border-orange-500/20 rounded-2xl p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-300">
            <Dices className="w-4 h-4 text-orange-400" />
            <span>
              {lang === 'en'
                ? "Test Real Winning Numbers (Today's Official Draw SM-71)"
                : 'യഥാർത്ഥ വിജയിച്ച നമ്പറുകൾ ടെസ്റ്റ് ചെയ്യുക (SM-71)'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => loadSample('MG', '555248', 'SM-71')}
            className="p-3 rounded-xl bg-[#0d0f14] hover:bg-[#1a1d26] border-2 border-orange-500/40 hover:border-orange-400 text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="text-[11px] font-black text-orange-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {lang === 'en' ? '1st Prize Winner' : 'ഒന്നാം സമ്മാനം'}
            </div>
            <div className="font-mono font-black text-white text-xs mt-1">
              MG 555248 &bull; ₹1 Crore
            </div>
          </button>

          <button
            onClick={() => loadSample('MA', '555248', 'SM-71')}
            className="p-3 rounded-xl bg-[#0d0f14] hover:bg-[#1a1d26] border-2 border-orange-500/40 hover:border-orange-400 text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="text-[11px] font-black text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {lang === 'en' ? 'Consolation Prize' : 'സമാശ്വാസ സമ്മാനം'}
            </div>
            <div className="font-mono font-black text-white text-xs mt-1">
              MA 555248 &bull; ₹5,000
            </div>
          </button>

          <button
            onClick={() => loadSample('MB', '562200', 'SM-71')}
            className="p-3 rounded-xl bg-[#0d0f14] hover:bg-[#1a1d26] border-2 border-orange-500/40 hover:border-orange-400 text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="text-[11px] font-black text-purple-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              {lang === 'en' ? '2nd Prize Winner' : 'രണ്ടാം സമ്മാനം'}
            </div>
            <div className="font-mono font-black text-white text-xs mt-1">
              MB 562200 &bull; ₹25 Lakhs
            </div>
          </button>

          <button
            onClick={() => loadSample('MD', '000140', 'SM-71')}
            className="p-3 rounded-xl bg-[#0d0f14] hover:bg-[#1a1d26] border-2 border-orange-500/40 hover:border-orange-400 text-left transition-all group cursor-pointer shadow-xs"
          >
            <div className="text-[11px] font-black text-blue-400 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              {lang === 'en' ? '4th Prize Suffix' : 'നാലാം സമ്മാനം'}
            </div>
            <div className="font-mono font-black text-white text-xs mt-1">
              MD 000140 &bull; ₹5,000
            </div>
          </button>
        </div>
      </div>

      {/* Modals */}
      {showCamera && (
        <CameraScanner
          onTicketDetected={handleDetectedTicket}
          onClose={() => setShowCamera(false)}
          lang={lang}
        />
      )}

      {showUpload && (
        <UploadScanner
          onTicketDetected={handleDetectedTicket}
          onClose={() => setShowUpload(false)}
          lang={lang}
        />
      )}

      {checkResult && (
        <TicketResultModal
          result={checkResult}
          onClose={() => setCheckResult(null)}
          lang={lang}
        />
      )}

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
