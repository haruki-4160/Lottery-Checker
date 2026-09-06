import React from 'react';
import { FileText, ExternalLink, X, Download, ShieldCheck } from 'lucide-react';

interface PdfViewerModalProps {
  pdfUrl: string;
  drawId: string;
  lotteryName: string;
  onClose: () => void;
  lang: 'en' | 'ml';
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  pdfUrl,
  drawId,
  lotteryName,
  onClose,
  lang,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md">
      <div className="relative w-full max-w-4xl h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-slate-900/95">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>{lotteryName} ({drawId})</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Official Gazette
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Official Publication by Directorate of Kerala State Lotteries'
                  : 'കേരള സംസ്ഥാന ലോട്ടറി ഡയറക്ടറേറ്റ് ഔദ്യോഗിക ഗസറ്റ്'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
              title="Open or Download Official PDF in new tab"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Download PDF' : 'ഡൗൺലോഡ്'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source info note */}
        <div className="px-4 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Government Source: result.keralalotteries.com</span>
          </div>
          <a
            href="https://statelottery.kerala.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-amber-300 underline flex items-center gap-1"
          >
            <span>statelottery.kerala.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* PDF Embedded Frame with fallback notice */}
        <div className="flex-1 w-full bg-slate-950 relative">
          <iframe
            src={pdfUrl}
            title={`Kerala Lottery Gazette PDF ${drawId}`}
            className="w-full h-full border-none"
          />

          {/* Fallback overlay in case of browser iframe security restriction */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-300 text-xs shadow-lg flex items-center gap-3 backdrop-blur-md">
            <span>{lang === 'en' ? 'If PDF does not preview in your browser:' : 'പിഡിഎഫ് സ്ക്രീനിൽ കാണുന്നില്ലെങ്കിൽ:'}</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1 transition-colors"
            >
              <span>{lang === 'en' ? 'Open PDF directly' : 'നേരിട്ട് തുറക്കുക'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
