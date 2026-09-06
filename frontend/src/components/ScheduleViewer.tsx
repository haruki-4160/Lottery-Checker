import React from 'react';
import type { LotteryTypeInfo } from '../types';
import { Calendar, Tag, Gift, Clock } from 'lucide-react';

interface ScheduleViewerProps {
  lotteries: LotteryTypeInfo[];
  lang: 'en' | 'ml';
}

export const ScheduleViewer: React.FC<ScheduleViewerProps> = ({ lotteries, lang }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      
      {/* Title Card */}
      <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl pointer-events-none"></div>

        <div>
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />
            <span>{lang === 'en' ? 'Kerala Weekly Lottery Schedule' : 'കേരള ലോട്ടറി പ്രതിവാര ഷെഡ്യൂൾ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5 font-medium">
            {lang === 'en'
              ? 'Draws are conducted daily at 3:00 PM at Gorky Bhavan, Thiruvananthapuram.'
              : 'എല്ലാ ദിവസവും ഉച്ചകഴിഞ്ഞ് 3:00 മണിക്ക് തിരുവനന്തപുരത്ത് വെച്ച് നറുക്കെടുപ്പ് നടക്കുന്നു.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-orange-500/15 border-2 border-orange-500/30 text-orange-300 text-xs font-bold self-start sm:self-center shadow-xs">
          <Clock className="w-4 h-4 text-orange-400" />
          <span>{lang === 'en' ? 'Draw: 3:00 PM IST Daily' : 'സമയം: ഉച്ചയ്ക്ക് 3:00'}</span>
        </div>
      </div>

      {/* Lotteries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotteries.map((l) => (
          <div
            key={l.code}
            className="bg-[#14171e] border-2 border-orange-500/20 rounded-2xl p-5 hover:border-orange-500/60 transition-all shadow-md flex flex-col justify-between group relative overflow-hidden"
          >
            {/* Corner notch papercut */}
            <div className="absolute top-0 right-0 w-6 h-6 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/20 rounded-bl-lg"></div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-[#0b0d11] text-orange-400 font-mono text-xs font-black uppercase tracking-wider border-2 border-orange-500/40">
                  {l.code}
                </span>
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-orange-500" />
                  {l.draw_day}
                </span>
              </div>

              <h3 className="text-lg font-black text-white group-hover:text-orange-400 transition-colors">
                {l.name}
              </h3>
              <p className="text-xs text-orange-400/90 font-bold mt-0.5">
                {l.malayalam_name}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t-2 border-dashed border-orange-500/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'en' ? '1st Prize:' : 'ഒന്നാം സമ്മാനം:'}
                </span>
                <span className="font-mono font-black text-emerald-400 text-sm">
                  {formatCurrency(l.first_prize_amount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-orange-400" />
                  {lang === 'en' ? 'Ticket Price:' : 'ടിക്കറ്റ് വില:'}
                </span>
                <span className="font-mono font-bold text-slate-100">
                  ₹{l.ticket_price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
