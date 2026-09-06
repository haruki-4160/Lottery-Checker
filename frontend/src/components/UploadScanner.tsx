import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, Zap } from 'lucide-react';
import { recognizeTicketImage, preprocessImageForOcr } from '../utils/ocr';

interface UploadScannerProps {
  onTicketDetected: (data: { series?: string; number?: string; drawCode?: string }) => void;
  onClose: () => void;
  lang: 'en' | 'ml';
}

export const UploadScanner: React.FC<UploadScannerProps> = ({
  onTicketDetected,
  onClose,
  lang,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string>('');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [detectedData, setDetectedData] = useState<{ series?: string; number?: string; drawCode?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMsg(lang === 'en' ? 'Please select a valid image file.' : 'ഒരു ഫോട്ടോ ഫയൽ തിരഞ്ഞെടുക്കുക.');
      return;
    }

    setErrorMsg('');
    setDetectedData(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      setImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const processImage = async () => {
    if (!imageSrc) return;

    setIsProcessing(true);
    setProgressStatus(lang === 'en' ? 'Preprocessing ticket...' : 'ചിത്രം ക്രമീകരിക്കുന്നു...');
    setProgressPercent(10);
    setErrorMsg('');

    try {
      // Load image into HTMLImageElement
      const img = new Image();
      img.src = imageSrc;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const processedDataUrl = preprocessImageForOcr(img);

      const result = await recognizeTicketImage(processedDataUrl, (status, progress) => {
        setProgressStatus(status);
        setProgressPercent(Math.round(progress * 100));
      });

      if (result.series && result.number) {
        setDetectedData(result);
        onTicketDetected(result);
      } else if (result.number) {
        const partial = { series: result.series || 'WA', number: result.number, drawCode: result.drawCode };
        setDetectedData(partial);
        onTicketDetected(partial);
      } else {
        setErrorMsg(
          lang === 'en'
            ? 'No lottery ticket number recognized. Make sure the ticket is clearly visible with sharp focus, or enter numbers manually.'
            : 'ടിക്കറ്റ് നമ്പർ കണ്ടെത്താൻ കഴിഞ്ഞില്ല. ചിത്രം വ്യക്തമാണെന്ന് ഉറപ്പാക്കുക.'
        );
      }
    } catch (err) {
      console.error('OCR Error:', err);
      setErrorMsg(
        lang === 'en'
          ? 'Failed to scan ticket image. Please retry or enter manually.'
          : 'ചിത്രം സ്കാൻ ചെയ്യുന്നതിൽ പിഴവ് സംഭവിച്ചു.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-slate-100 text-base">
              {lang === 'en' ? 'Upload Ticket Photo' : 'ടിക്കറ്റ് ഫോട്ടോ അപ്‌ലോഡ് ചെയ്യുക'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          {!imageSrc ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-700 hover:border-amber-500/70 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors bg-slate-950/40 hover:bg-slate-950/70 text-center group"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800 group-hover:bg-amber-500/20 text-slate-400 group-hover:text-amber-400 flex items-center justify-center mb-3 transition-colors">
                <ImageIcon className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {lang === 'en' ? 'Click to browse or take photo' : 'ഫോട്ടോ തിരഞ്ഞെടുക്കാൻ ക്ലിക്ക് ചെയ്യുക'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                {lang === 'en' ? 'Supports JPG, PNG, WEBP' : 'JPG, PNG, WEBP ഫോർമാറ്റുകൾ'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-slate-800 max-h-56 flex items-center justify-center bg-black">
                <img src={imageSrc} alt="Uploaded ticket" className="w-full h-full object-contain" />
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setDetectedData(null);
                    setErrorMsg('');
                  }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 hover:bg-slate-900 text-slate-300 backdrop-blur-sm"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!detectedData && (
                <button
                  onClick={processImage}
                  disabled={isProcessing}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>
                    {isProcessing
                      ? (lang === 'en' ? 'Scanning Image...' : 'സ്കാൻ ചെയ്യുന്നു...')
                      : (lang === 'en' ? 'Run OCR Extraction' : 'ടിക്കറ്റ് വിവരങ്ങൾ വേർതിരിക്കുക')}
                  </span>
                </button>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{progressStatus}</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 flex items-start gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success / Detected Details */}
          {detectedData && (
            <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'en' ? 'Ticket Detected Successfully!' : 'ടിക്കറ്റ് കണ്ടെത്തി!'}</span>
              </div>
              <div className="flex items-center justify-between text-slate-200">
                <span>{lang === 'en' ? 'Series & Number:' : 'സീരീസും നമ്പറും:'}</span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  {detectedData.series || '??'} {detectedData.number}
                </span>
              </div>
              <button
                onClick={onClose}
                className="w-full mt-2 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors"
              >
                {lang === 'en' ? 'Apply to Checker' : 'പരിശോധനയിലേക്ക് മാറ്റുക'}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
