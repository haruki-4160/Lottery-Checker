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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            <span>{lang === 'en' ? 'Weekly Kerala Lottery Draw Schedule' : 'കേരള ലോട്ടറി പ്രതിവാര ഷെഡ്യൂൾ'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'en'
              ? 'Draws are conducted daily at 3:00 PM at Gorky Bhavan, Thiruvananthapuram.'
              : 'എല്ലാ ദിവസവും ഉച്ചകഴിഞ്ഞ് 3:00 മണിക്ക് തിരുവനന്തപുരത്ത് വെച്ച് നറുക്കെടുപ്പ് നടക്കുന്നു.'}
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold self-start sm:self-center">
          <Clock className="w-4 h-4" />
          <span>{lang === 'en' ? 'Draw Time: 3:00 PM IST' : 'സമയം: ഉച്ചയ്ക്ക് 3:00'}</span>
        </div>
      </div>

      {/* Lotteries Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {lotteries.map((l) => (
          <div
            key={l.code}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider border border-slate-700">
                  {l.code}
                </span>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  {l.draw_day}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                {l.name}
              </h3>
              <p className="text-xs text-amber-300 font-medium mt-0.5">
                {l.malayalam_name}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-emerald-400" />
                  {lang === 'en' ? '1st Prize:' : 'ഒന്നാം സമ്മാനം:'}
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {formatCurrency(l.first_prize_amount)}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {lang === 'en' ? 'Ticket Price:' : 'ടിക്കറ്റ് വില:'}
                </span>
                <span className="font-mono font-semibold text-slate-200">
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
