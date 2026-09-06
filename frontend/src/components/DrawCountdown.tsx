import React, { useState, useEffect } from 'react';
import { Clock, Radio, CheckCircle2 } from 'lucide-react';

interface DrawCountdownProps {
  lang: 'en' | 'ml';
}

export const DrawCountdown: React.FC<DrawCountdownProps> = ({ lang }) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    status: 'countdown' | 'in_progress' | 'published';
  }>({ hours: 0, minutes: 0, seconds: 0, status: 'countdown' });

  useEffect(() => {
    function calculateCountdown() {
      // Current date in IST
      const now = new Date();
      
      // Calculate IST time
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istTime = new Date(utc + 3600000 * 5.5);

      const istHours = istTime.getHours();
      const istMinutes = istTime.getMinutes();

      // Today 3:00 PM IST (15:00:00)
      const drawToday = new Date(istTime);
      drawToday.setHours(15, 0, 0, 0);

      // Today 4:30 PM IST (16:30:00)
      const certifyToday = new Date(istTime);
      certifyToday.setHours(16, 30, 0, 0);

      let targetTime: Date;
      let currentStatus: 'countdown' | 'in_progress' | 'published' = 'countdown';

      if (istHours === 15 || (istHours === 16 && istMinutes <= 30)) {
        currentStatus = 'in_progress';
        // Target is tomorrow 3 PM
        targetTime = new Date(drawToday);
        targetTime.setDate(targetTime.getDate() + 1);
      } else if (istTime > certifyToday) {
        currentStatus = 'published';
        // Target is tomorrow 3 PM
        targetTime = new Date(drawToday);
        targetTime.setDate(targetTime.getDate() + 1);
      } else {
        currentStatus = 'countdown';
        targetTime = drawToday;
      }

      const diffMs = Math.max(0, targetTime.getTime() - istTime.getTime());
      const totalSeconds = Math.floor(diffMs / 1000);
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ hours, minutes, seconds, status: currentStatus });
    }

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="bg-[#181a20] border-2 border-orange-500/30 rounded-2xl p-4 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.6)] relative overflow-hidden">
      {/* Decorative top-right paper cut corner tab */}
      <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl pointer-events-none"></div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status info */}
        <div>
          <div className="flex items-center gap-2">
            {timeLeft.status === 'in_progress' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-rose-950/80 border border-rose-500/40 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
                {lang === 'en' ? 'Draw In Progress' : 'നറുക്കെടുപ്പ് നടക്കുന്നു'}
              </span>
            ) : timeLeft.status === 'published' ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {lang === 'en' ? "Today's Result Live" : 'ഇന്നത്തെ ഫലം പ്രസിദ്ധീകരിച്ചു'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                {lang === 'en' ? 'Next Daily Draw' : 'അടുത്ത നറുക്കെടുപ്പ്'}
              </span>
            )}

            <span className="text-xs font-bold text-slate-400">
              3:00 PM IST Daily
            </span>
          </div>

          <h3 className="text-sm font-bold text-slate-200 mt-1">
            {timeLeft.status === 'in_progress'
              ? (lang === 'en' ? 'Results live soon from Gorky Bhavan' : 'ഗോർക്കി ഭവനിൽ നിന്നും ഫലങ്ങൾ ഉടൻ')
              : timeLeft.status === 'published'
              ? (lang === 'en' ? 'Countdown to Tomorrow’s 3:00 PM Draw' : 'നാളത്തെ നറുക്കെടുപ്പിലേക്കുള്ള സമയം')
              : (lang === 'en' ? 'Countdown to Today’s 3:00 PM Draw' : 'ഇന്നത്തെ 3:00 മണി നറുക്കെടുപ്പിലേക്ക്')}
          </h3>
        </div>

        {/* Papercut Countdown Flip Boxes */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          {/* Hours Box */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-14 h-12 bg-[#101216] border-2 border-orange-500/50 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_4px_rgba(249,115,22,0.1)] flex items-center justify-center relative">
              {/* Paper horizontal fold line */}
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40"></div>
              <span className="font-mono font-black text-xl sm:text-2xl text-orange-400 tracking-wider">
                {pad(timeLeft.hours)}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
              {lang === 'en' ? 'Hours' : 'മണിക്കൂർ'}
            </span>
          </div>

          <span className="font-mono font-black text-xl text-orange-500/70 -mt-4">:</span>

          {/* Minutes Box */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-14 h-12 bg-[#101216] border-2 border-orange-500/50 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_4px_rgba(249,115,22,0.1)] flex items-center justify-center relative">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40"></div>
              <span className="font-mono font-black text-xl sm:text-2xl text-orange-400 tracking-wider">
                {pad(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">
              {lang === 'en' ? 'Mins' : 'മിനിറ്റ്'}
            </span>
          </div>

          <span className="font-mono font-black text-xl text-orange-500/70 -mt-4">:</span>

          {/* Seconds Box */}
          <div className="flex flex-col items-center">
            <div className="w-13 sm:w-14 h-12 bg-[#101216] border-2 border-orange-500/80 rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.6),0_2px_6px_rgba(249,115,22,0.25)] flex items-center justify-center relative bg-gradient-to-b from-[#14171d] to-[#0e1014]">
              <div className="absolute inset-x-0 top-1/2 h-[1px] bg-black/40"></div>
              <span className="font-mono font-black text-xl sm:text-2xl text-orange-300 tracking-wider animate-pulse">
                {pad(timeLeft.seconds)}
              </span>
            </div>
            <span className="text-[10px] uppercase font-bold text-orange-400 mt-1">
              {lang === 'en' ? 'Secs' : 'സെക്കന്റ്'}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
