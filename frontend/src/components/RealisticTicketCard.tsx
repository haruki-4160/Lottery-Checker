import { ShieldCheck } from 'lucide-react';

interface RealisticTicketCardProps {
  series: string;
  number: string;
  lotteryName: string;
  drawId: string;
  drawDate: string;
  prizeAmount?: number;
  lang: 'en' | 'ml';
}

export const RealisticTicketCard: React.FC<RealisticTicketCardProps> = ({
  series,
  number,
  lotteryName,
  drawId,
  drawDate,
  prizeAmount,
  lang,
}) => {
  const displaySeries = series.trim().toUpperCase() || '??';
  const paddedNumber = number.padEnd(6, '•');
  const digits = paddedNumber.split('');

  const formatLakhs = (amt?: number) => {
    if (!amt) return '₹1 Crore';
    if (amt >= 10000000) return `₹${(amt / 10000000).toFixed(0)} Crore`;
    return `₹${(amt / 100000).toFixed(0)} Lakhs`;
  };

  return (
    <div className="relative select-none max-w-md mx-auto w-full transition-transform hover:-translate-y-0.5 duration-200">
      
      {/* Physical Ticket Body with Papercut Shadow and Notched Perforations */}
      <div className="relative bg-gradient-to-br from-[#fffdfa] via-[#fdf8f0] to-[#f7eedc] text-slate-900 rounded-xl border-2 border-orange-400 shadow-[0_12px_30px_-6px_rgba(249,115,22,0.15),0_6px_12px_-2px_rgba(0,0,0,0.4)] overflow-hidden">
        
        {/* Left and Right Perforation Semi-Circle Punch Notches */}
        <div className="absolute top-1/2 -left-3 w-6 h-6 bg-[#0f1115] rounded-full border-r-2 border-orange-400 -translate-y-1/2 z-10"></div>
        <div className="absolute top-1/2 -right-3 w-6 h-6 bg-[#0f1115] rounded-full border-l-2 border-orange-400 -translate-y-1/2 z-10"></div>

        {/* Decorative Top Stamp Band */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-orange-600 px-4 py-2 text-white flex items-center justify-between border-b-2 border-orange-700">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-white text-orange-600 flex items-center justify-center font-black text-xs shadow-xs">
              ★
            </div>
            <span className="font-extrabold text-xs tracking-wider uppercase">
              KERALA STATE LOTTERIES
            </span>
          </div>

          <span className="text-[10px] font-bold bg-black/25 px-2 py-0.5 rounded text-orange-100 uppercase tracking-widest border border-white/20">
            GOVT. OF KERALA
          </span>
        </div>

        {/* Ticket Content */}
        <div className="p-4 sm:p-5 space-y-3">
          
          {/* Lottery Name & Draw Info */}
          <div className="flex items-start justify-between border-b border-orange-200 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase text-orange-700 tracking-wider">
                {lang === 'en' ? 'OFFICIAL LOTTERY DRAW' : 'ഔദ്യോഗിക നറുക്കെടുപ്പ്'}
              </span>
              <h4 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                {lotteryName || 'SAMRUDHI'}
              </h4>
              <div className="text-xs font-bold text-orange-800 font-mono">
                NO. {drawId || 'SM-71'} &bull; {drawDate || '06/09/2026'}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase text-slate-600 tracking-wider">
                1st Prize
              </span>
              <div className="text-base font-black text-orange-700 font-mono">
                {formatLakhs(prizeAmount)}
              </div>
            </div>
          </div>

          {/* Stamped Number Area with Paper Perforation Separator */}
          <div className="py-2">
            <div className="text-center mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {lang === 'en' ? 'TICKET SERIES & NUMBER' : 'ടിക്കറ്റ് സീരീസും നമ്പറും'}
              </span>
            </div>

            {/* Stamped Digits Grid */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2">
              {/* Series Box */}
              <div className="px-3 py-2 bg-orange-100/80 border-2 border-orange-400 rounded-lg shadow-inner flex items-center justify-center">
                <span className="font-mono font-black text-2xl sm:text-3xl text-orange-800 tracking-widest">
                  {displaySeries}
                </span>
              </div>

              {/* Digits Boxes */}
              <div className="flex items-center gap-1">
                {digits.map((digit, i) => (
                  <div
                    key={i}
                    className={`w-7 sm:w-8 h-10 sm:h-11 rounded-lg border-2 flex items-center justify-center font-mono font-black text-xl sm:text-2xl shadow-inner ${
                      digit !== '•'
                        ? 'bg-orange-50 border-orange-500 text-slate-950 font-bold'
                        : 'bg-orange-50/40 border-orange-200 text-orange-300'
                    }`}
                  >
                    {digit}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Barcode & Security Strip */}
          <div className="pt-2 border-t-2 border-dashed border-orange-200 flex items-center justify-between">
            {/* Pseudo Barcode Visual */}
            <div className="flex items-end gap-[2px] h-6 w-36 overflow-hidden opacity-80">
              {[3, 1, 4, 2, 5, 2, 1, 4, 3, 2, 5, 1, 2, 4, 2, 3, 1, 5, 2, 4, 1, 3, 2, 4, 3, 1, 2].map((h, idx) => (
                <div
                  key={idx}
                  className="bg-slate-800"
                  style={{ width: `${(idx % 3) + 1.5}px`, height: `${h * 4 + 4}px` }}
                ></div>
              ))}
            </div>

            {/* Security Guarantee Seal */}
            <div className="flex items-center gap-1 text-[10px] font-bold text-orange-800 uppercase tracking-wider bg-orange-200/60 px-2 py-0.5 rounded border border-orange-300">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-700" />
              <span>Verified Draw</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
