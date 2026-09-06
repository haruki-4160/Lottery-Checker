import React, { useState } from 'react';
import type { DrawDetail, TicketCheckResponse } from '../types';
import { checkTicketAPI } from '../api';
import { Camera, Upload, Sparkles, AlertCircle, ArrowRight, Dices, Award, Zap } from 'lucide-react';
import { CameraScanner } from './CameraScanner';
import { UploadScanner } from './UploadScanner';
import { TicketResultModal } from './TicketResultModal';

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

  const activeDraw = draws.find((d) => d.draw_id === selectedDrawId) || latestDraw || draws[0];

  const handleSeriesChange = (val: string) => {
    // Only allow uppercase letters, maximum 3 chars
    const clean = val.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3);
    setSeries(clean);
    setErrorMsg('');
  };

  const handleNumberChange = (val: string) => {
    // Only allow digits, maximum 6 chars
    const clean = val.replace(/[^0-9]/g, '').slice(0, 6);
    setNumber(clean);
    setErrorMsg('');
  };

  const handleCheck = async (s = series, n = number, drawId = selectedDrawId) => {
    if (!s.trim()) {
      setErrorMsg(lang === 'en' ? 'Please enter a 2-letter series code (e.g. WA).' : 'സീരീസ് നൽകുക (ഉദാ: WA).');
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
      
      {/* Top Banner / Draw Summary */}
      <div className="relative overflow-hidden bg-gradient-to-r from-amber-500/20 via-orange-500/10 to-transparent border border-amber-500/30 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                {lang === 'en' ? 'Official Results Available' : 'ഔദ്യോഗിക ഫലങ്ങൾ ലഭ്യമാണ്'}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activeDraw?.draw_date}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white mt-1">
              {activeDraw?.lottery_name} &bull; {activeDraw?.draw_id}
            </h2>
            {activeDraw?.malayalam_name && (
              <p className="text-sm font-semibold text-amber-300">
                {activeDraw.malayalam_name}
              </p>
            )}
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl px-4 py-3 self-start sm:self-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              {lang === 'en' ? 'First Prize' : 'ഒന്നാം സമ്മാനം'}
            </span>
            <div className="text-xl font-mono font-black text-amber-400">
              ₹{activeDraw ? (activeDraw.prizes[0]?.amount / 100000).toLocaleString('en-IN') : '75'} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* Main Checker Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
        
        {/* Draw Selector */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            {lang === 'en' ? 'Select Draw / Lottery' : 'ലോട്ടറി തിരഞ്ഞെടുക്കുക'}
          </label>
          <select
            value={selectedDrawId}
            onChange={(e) => setSelectedDrawId(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-slate-200 text-sm font-semibold focus:outline-none focus:border-amber-500 transition-colors"
          >
            {draws.map((d) => (
              <option key={d.draw_id} value={d.draw_id}>
                {d.lottery_name} ({d.draw_id}) &mdash; {d.draw_date}
              </option>
            ))}
          </select>
        </div>

        {/* Scanning Shortcuts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowCamera(true)}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all hover:border-amber-500/50 group"
          >
            <Camera className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            <span>{lang === 'en' ? 'Scan Ticket with Camera' : 'ക്യാമറ വഴി സ്കാൻ ചെയ്യുക'}</span>
          </button>

          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-slate-200 font-semibold text-sm transition-all hover:border-amber-500/50 group"
          >
            <Upload className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>{lang === 'en' ? 'Upload Ticket Photo' : 'ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-xs font-semibold uppercase tracking-wider text-slate-500">
            {lang === 'en' ? 'or enter ticket manually' : 'അല്ലെങ്കിൽ നമ്പർ ടൈപ്പ് ചെയ്യുക'}
          </span>
          <div className="border-t border-slate-800 w-full"></div>
        </div>

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Series Code */}
          <div className="space-y-1.5 sm:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? 'Series (2 Letters)' : 'സീരീസ് (2 അക്ഷരം)'}
            </label>
            <input
              type="text"
              value={series}
              onChange={(e) => handleSeriesChange(e.target.value)}
              placeholder="WA"
              maxLength={3}
              className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-slate-100 font-mono font-black text-xl tracking-widest text-center focus:outline-none focus:border-amber-500 transition-colors uppercase placeholder-slate-600"
            />
          </div>

          {/* 6-Digit Number */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
              {lang === 'en' ? '6-Digit Ticket Number' : '6 അക്ക ടിക്കറ്റ് നമ്പർ'}
            </label>
            <input
              type="text"
              inputMode="numeric"
              value={number}
              onChange={(e) => handleNumberChange(e.target.value)}
              placeholder="745821"
              maxLength={6}
              className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-xl text-amber-400 font-mono font-black text-xl tracking-widest text-center focus:outline-none focus:border-amber-500 transition-colors placeholder-slate-600"
            />
          </div>

        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/40 flex items-center gap-2 text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Check Button */}
        <button
          onClick={() => handleCheck()}
          disabled={isLoading}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:via-orange-400 hover:to-amber-400 text-slate-950 font-black text-base shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60 group cursor-pointer"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Sparkles className="w-5 h-5 fill-slate-950 group-hover:rotate-12 transition-transform" />
              <span>{lang === 'en' ? 'CHECK RESULT NOW' : 'ഫലം പരിശോധിക്കുക'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

      </div>

      {/* Try Winning Samples Section */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <Dices className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Instant Test Samples (Try Winning Scenarios)' : 'ടെസ്റ്റ് ചെയ്യാനുള്ള മാതൃകകൾ'}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
          <button
            onClick={() => loadSample('WN', '745821', 'W-780')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <Award className="w-3 h-3" />
              {lang === 'en' ? '1st Prize Winner' : 'ഒന്നാം സമ്മാനം'}
            </div>
            <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">
              WN 745821 &bull; ₹75 Lakhs
            </div>
          </button>

          <button
            onClick={() => loadSample('WA', '745821', 'W-780')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {lang === 'en' ? 'Consolation Prize' : 'സമാശ്വാസ സമ്മാനം'}
            </div>
            <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">
              WA 745821 &bull; ₹8,000
            </div>
          </button>

          <button
            onClick={() => loadSample('WA', '991245', 'W-780')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-blue-400 flex items-center gap-1">
              <Zap className="w-3 h-3" />
              {lang === 'en' ? '4th Prize Suffix' : 'നാലാം സമ്മാനം'}
            </div>
            <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">
              WA 991245 &bull; ₹5,000
            </div>
          </button>

          <button
            onClick={() => loadSample('TE', '230620', 'BR-99')}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-left transition-all group"
          >
            <div className="text-[11px] font-bold text-purple-400 flex items-center gap-1">
              <Award className="w-3 h-3" />
              {lang === 'en' ? 'Onam ₹25Cr Bumper' : 'ഓണം ബമ്പർ'}
            </div>
            <div className="font-mono font-bold text-slate-200 text-xs mt-0.5">
              TE 230620 &bull; ₹25 Crores
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

    </div>
  );
};
