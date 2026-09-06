import React from 'react';
import { ShieldCheck, FileCheck2, AlertTriangle, Building2, MapPin, Phone } from 'lucide-react';

interface ClaimGuideProps {
  lang: 'en' | 'ml';
}

export const ClaimGuide: React.FC<ClaimGuideProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-8 h-8 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/30 rounded-bl-xl pointer-events-none"></div>

        <h2 className="text-xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Official Prize Claiming Rules' : 'സമ്മാനം കൈപ്പറ്റുന്നതിനുള്ള വിവരങ്ങൾ'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          {lang === 'en'
            ? 'Prizes must be claimed within 30 days of the draw date. Keep the original ticket clean and undamaged.'
            : 'നറുക്കെടുപ്പ് തീയതി മുതൽ 30 ദിവസത്തിനകം സമ്മാനം കൈപ്പറ്റണം. ടിക്കറ്റിൽ കേടുപാടുകൾ വരുത്തരുത്.'}
        </p>
      </div>

      {/* Prize Brackets (Papercut cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1: Up to 5,000 */}
        <div className="bg-[#14171e] border-2 border-emerald-500/30 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-6 h-6 bg-emerald-500/10 border-b-2 border-l-2 border-emerald-500/20 rounded-bl-lg"></div>

          <div>
            <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider">
              {lang === 'en' ? 'Up to ₹5,000' : '₹5,000 വരെ'}
            </span>
            <h3 className="text-base font-black text-white mt-3">
              {lang === 'en' ? 'Authorized Lottery Agents' : 'ലോട്ടറി ഏജൻസി / കടകൾ'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              {lang === 'en'
                ? 'Can be surrendered directly at any authorized retail lottery shop across Kerala for instant cash payout.'
                : 'കേരളത്തിലെ ഏത് അംഗീകൃത ലോട്ടറി കടകളിലും ടിക്കറ്റ് നൽകി തുക നേരിട്ട് വാങ്ങാവുന്നതാണ്.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-dashed border-emerald-500/20 text-[11px] text-slate-400 font-bold">
            {lang === 'en' ? 'Required: Original Ticket' : 'ആവശ്യമുള്ളവ: ഒറിജിനൽ ടിക്കറ്റ്'}
          </div>
        </div>

        {/* Tier 2: 5,000 to 1 Lakh */}
        <div className="bg-[#14171e] border-2 border-orange-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-6 h-6 bg-orange-500/10 border-b-2 border-l-2 border-orange-500/20 rounded-bl-lg"></div>

          <div>
            <span className="px-2.5 py-1 rounded-md bg-orange-500/20 border-2 border-orange-500/40 text-orange-400 text-xs font-black uppercase tracking-wider">
              {lang === 'en' ? '₹5,001 to ₹1 Lakh' : '₹5,001 മുതൽ ₹1 ലക്ഷം വരെ'}
            </span>
            <h3 className="text-base font-black text-white mt-3">
              {lang === 'en' ? 'District Lottery Office' : 'ജില്ലാ ലോട്ടറി ഓഫീസ് / ട്രഷറി'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              {lang === 'en'
                ? 'Claim from any District Lottery Office (DLO) or Sub-Treasury in Kerala. Nationalized banks also process claims.'
                : 'ജില്ലാ ലോട്ടറി ഓഫീസിലോ സബ് ട്രഷറിയിലോ അപേക്ഷ നൽകാം. ബാങ്കുകൾ വഴിയും ചെയ്യാം.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-dashed border-orange-500/20 text-[11px] text-slate-400 font-bold">
            {lang === 'en' ? 'Required: Ticket + ID Proof + Photo' : 'ആവശ്യമുള്ളവ: ടിക്കറ്റ്, തിരിച്ചറിയൽ കാർഡ്, ഫോട്ടോ'}
          </div>
        </div>

        {/* Tier 3: Above 1 Lakh */}
        <div className="bg-[#14171e] border-2 border-purple-500/40 rounded-2xl p-5 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-6 h-6 bg-purple-500/10 border-b-2 border-l-2 border-purple-500/20 rounded-bl-lg"></div>

          <div>
            <span className="px-2.5 py-1 rounded-md bg-purple-500/20 border-2 border-purple-500/40 text-purple-300 text-xs font-black uppercase tracking-wider">
              {lang === 'en' ? 'Above ₹1 Lakh & Bumpers' : '₹1 ലക്ഷത്തിന് മുകളിൽ'}
            </span>
            <h3 className="text-base font-black text-white mt-3">
              {lang === 'en' ? 'Lottery Directorate' : 'ഡയറക്ടറേറ്റ്, തിരുവനന്തപുരം'}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed font-medium">
              {lang === 'en'
                ? 'Submit directly to the Directorate of State Lotteries, Thiruvananthapuram, or via nationalized banks.'
                : 'സംസ്ഥാന ലോട്ടറി ഡയറക്ടറേറ്റിൽ നേരിട്ടോ ബാങ്കുകൾ വഴിയോ സമർപ്പിക്കുക.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t-2 border-dashed border-purple-500/20 text-[11px] text-slate-400 font-bold">
            {lang === 'en' ? 'Required: PAN + Aadhaar + 2 Photos + Bank Details' : 'ആവശ്യമുള്ളവ: പാൻ, ആധാർ, 2 ഫോട്ടോ, ബാങ്ക് രേഖകൾ'}
          </div>
        </div>

      </div>

      {/* Mandatory Checklist & Directorate Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Checklist */}
        <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 space-y-3 shadow-md">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-orange-400" />
            <span>{lang === 'en' ? 'Essential Checklist for Claimants' : 'സമ്മാനാർഹർ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ'}</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-300 font-medium">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Write full name, signature, and address on the backside of the ticket.' : 'ടിക്കറ്റിന്റെ പിൻഭാഗത്ത് പൂർണ്ണ പേരും ഒപ്പും വിലാസവും രേഖപ്പെടുത്തുക.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Self-attested PAN Card copy (mandatory for 30% TDS deduction on >₹10,000).' : 'പാൻ കാർഡിന്റെ സാക്ഷ്യപ്പെടുത്തിയ പകർപ്പ് (നികുതി കുറയ്ക്കാൻ നിർബന്ധം).'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Valid proof of identity: Aadhaar Card / Voter ID / Passport.' : 'തിരിച്ചറിയൽ രേഖ: ആധാർ / വോട്ടർ ഐഡി / പാസ്പോർട്ട്.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Cancelled cheque or passbook copy for direct bank NEFT credit.' : 'ബാങ്ക് പാസ്ബുക്കിന്റെ കോപ്പി അല്ലെങ്കിൽ കാൻസൽ ചെയ്ത ചെക്ക്.'}</span>
            </li>
          </ul>
        </div>

        {/* Directorate Address */}
        <div className="bg-[#14171e] border-2 border-orange-500/30 rounded-2xl p-5 space-y-3 shadow-md">
          <h3 className="font-black text-white text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-400" />
            <span>{lang === 'en' ? 'Directorate of State Lotteries' : 'ഔദ്യോഗിക മേൽവിലാസം'}</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-300 font-medium">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                Directorate of Kerala State Lotteries<br />
                Vikas Bhavan, P.O., Thiruvananthapuram - 695033, Kerala.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-orange-400 shrink-0" />
              <span className="font-mono">0471-2305230 / 0471-2305193</span>
            </div>
            <div className="pt-1">
              <div className="p-3 rounded-xl bg-orange-500/10 border-2 border-orange-500/30 text-orange-300 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-orange-400" />
                <span>
                  {lang === 'en'
                    ? 'Always verify with the official Kerala Government Gazette before claim submission.'
                    : 'സമ്മാന തുക വാങ്ങുന്നതിന് മുൻപ് യഥാർത്ഥ ഗസറ്റ് ഫലവുമായി ഒത്തുനോക്കുക.'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
