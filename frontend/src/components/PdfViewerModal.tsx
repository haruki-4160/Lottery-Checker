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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl h-[90vh] bg-[#14171e] border-3 border-orange-500/50 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b-2 border-orange-500/30 bg-[#181a22]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/40">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-100 text-sm sm:text-base flex items-center gap-2">
                <span>{lotteryName} ({drawId})</span>
                <span className="hidden sm:inline-block text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  Official Gazette
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 font-medium">
                {lang === 'en'
                  ? 'Official Publication &bull; Directorate of Kerala State Lotteries'
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-black text-xs transition-colors shadow-[0_2px_8px_rgba(249,115,22,0.3)] cursor-pointer"
              title="Download Official PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'en' ? 'Download PDF' : 'ഡൗൺലോഡ്'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#0e1014] hover:bg-[#1a1d24] text-slate-300 border border-orange-500/30 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Source info note */}
        <div className="px-4 py-2 bg-[#0d0f14] border-b border-orange-500/20 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Direct Govt Server: result.keralalotteries.com</span>
          </div>
          <a
            href="https://statelottery.kerala.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-400 hover:underline font-bold flex items-center gap-1"
          >
            <span>statelottery.kerala.gov.in</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* PDF Embedded Frame */}
        <div className="flex-1 w-full bg-[#0a0b0e] relative">
          <iframe
            src={pdfUrl}
            title={`Kerala Lottery Gazette PDF ${drawId}`}
            className="w-full h-full border-none"
          />

          {/* Fallback prompt */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl bg-[#14171e] border-2 border-orange-500/40 text-slate-300 text-xs shadow-xl flex items-center gap-3">
            <span className="font-medium">{lang === 'en' ? 'If PDF does not preview in your browser:' : 'പിഡിഎഫ് സ്ക്രീനിൽ കാണുന്നില്ലെങ്കിൽ:'}</span>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-orange-500 hover:bg-orange-400 text-slate-950 font-black flex items-center gap-1 transition-colors cursor-pointer"
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
