import React from 'react';
import { ShieldCheck, FileCheck2, AlertTriangle, Building2, MapPin, Phone } from 'lucide-react';

interface ClaimGuideProps {
  lang: 'en' | 'ml';
}

export const ClaimGuide: React.FC<ClaimGuideProps> = ({ lang }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'en' ? 'Official Prize Claiming Guidelines' : 'സമ്മാനം കൈപ്പറ്റുന്നതിനുള്ള വിവരങ്ങൾ'}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {lang === 'en'
            ? 'Prizes must be claimed within 30 days of the draw date. Keep the original ticket undamaged.'
            : 'നറുക്കെടുപ്പ് തീയതി മുതൽ 30 ദിവസത്തിനകം സമ്മാനം കൈപ്പറ്റണം. ടിക്കറ്റിൽ കേടുപാടുകൾ വരുത്തരുത്.'}
        </p>
      </div>

      {/* Prize Brackets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tier 1: Up to 5,000 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'en' ? 'Up to ₹5,000' : '₹5,000 വരെ'}
            </span>
            <h3 className="text-lg font-bold text-white mt-3">
              {lang === 'en' ? 'Any Lottery Retailer' : 'ലോട്ടറി ഏജൻസി / കടകൾ'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Can be surrendered directly at any authorized retail lottery shop or distributor across Kerala. The agent will verify and pay cash immediately.'
                : 'കേരളത്തിലെ ഏത് അംഗീകൃത ലോട്ടറി കടകളിലും ടിക്കറ്റ് നൽകി തുക നേരിട്ട് വാങ്ങാവുന്നതാണ്.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            {lang === 'en' ? 'Requirements: Original Ticket' : 'ആവശ്യമുള്ളവ: ഒറിജിനൽ ടിക്കറ്റ്'}
          </div>
        </div>

        {/* Tier 2: 5,000 to 1 Lakh */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'en' ? '₹5,001 to ₹1 Lakh' : '₹5,001 മുതൽ ₹1 ലക്ഷം വരെ'}
            </span>
            <h3 className="text-lg font-bold text-white mt-3">
              {lang === 'en' ? 'District Lottery Office' : 'ജില്ലാ ലോട്ടറി ഓഫീസ് / ട്രഷറി'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Claim from any District Lottery Office (DLO) or Sub-Treasury in Kerala. Nationalized banks also process claims on your behalf.'
                : 'ജില്ലാ ലോട്ടറി ഓഫീസിലോ സബ് ട്രഷറിയിലോ അപേക്ഷ നൽകാം. ബാങ്കുകൾ വഴിയും ചെയ്യാം.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            {lang === 'en' ? 'Requirements: Ticket + ID Proof + Photo' : 'ആവശ്യമുള്ളവ: ടിക്കറ്റ്, തിരിച്ചറിയൽ കാർഡ്, ഫോട്ടോ'}
          </div>
        </div>

        {/* Tier 3: Above 1 Lakh */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-wider">
              {lang === 'en' ? 'Above ₹1 Lakh & Bumpers' : '₹1 ലക്ഷത്തിന് മുകളിൽ'}
            </span>
            <h3 className="text-lg font-bold text-white mt-3">
              {lang === 'en' ? 'Lottery Directorate' : 'ഡയറക്ടറേറ്റ്, തിരുവനന്തപുരം'}
            </h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {lang === 'en'
                ? 'Submit directly to the Directorate of State Lotteries, Thiruvananthapuram, or through nationalized banks with signed claim documentation.'
                : 'സംസ്ഥാന ലോട്ടറി ഡയറക്ടറേറ്റിൽ നേരിട്ടോ ബാങ്കുകൾ വഴിയോ സമർപ്പിക്കുക.'}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
            {lang === 'en' ? 'Requirements: PAN + Aadhaar + 2 Photos + Bank Details' : 'ആവശ്യമുള്ളവ: പാൻ, ആധാർ, 2 ഫോട്ടോ, ബാങ്ക് രേഖകൾ'}
          </div>
        </div>

      </div>

      {/* Mandatory Checklist & Directorate Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Checklist */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <FileCheck2 className="w-4 h-4 text-amber-400" />
            <span>{lang === 'en' ? 'Essential Checklist for Winners' : 'സമ്മാനാർഹർ ശ്രദ്ധിക്കേണ്ട കാര്യങ്ങൾ'}</span>
          </h3>

          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Write your full name, signature, and address on the backside of the ticket.' : 'ടിക്കറ്റിന്റെ പിൻഭാഗത്ത് പൂർണ്ണ പേരും ഒപ്പും വിലാസവും രേഖപ്പെടുത്തുക.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Self-attested copy of PAN Card (mandatory for TDS deduction).' : 'പാൻ കാർഡിന്റെ സാക്ഷ്യപ്പെടുത്തിയ പകർപ്പ് (നികുതി കുറയ്ക്കാൻ നിർബന്ധം).'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Valid proof of identity: Aadhaar Card / Voter ID / Passport.' : 'തിരിച്ചറിയൽ രേഖ: ആധാർ / വോട്ടർ ഐഡി / പാസ്പോർട്ട്.'}</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0"></span>
              <span>{lang === 'en' ? 'Cancelled bank cheque or passbook copy for NEFT prize credit.' : 'ബാങ്ക് പാസ്ബുക്കിന്റെ കോപ്പി അല്ലെങ്കിൽ കാൻസൽ ചെയ്ത ചെക്ക്.'}</span>
            </li>
          </ul>
        </div>

        {/* Directorate Address */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h3 className="font-bold text-white text-sm flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-400" />
            <span>{lang === 'en' ? 'Official Directorate Contact' : 'ഔദ്യോഗിക മേൽവിലാസം'}</span>
          </h3>

          <div className="space-y-2 text-xs text-slate-300">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>
                Directorate of Kerala State Lotteries<br />
                Vikas Bhavan, P.O., Thiruvananthapuram - 695033, Kerala.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-slate-400 shrink-0" />
              <span>0471-2305230 / 0471-2305193</span>
            </div>
            <div className="pt-2">
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
                <span>
                  {lang === 'en'
                    ? 'Beware of counterfeit lottery scams. Kerala lotteries are not sold online or via WhatsApp.'
                    : 'വ്യാജ ലോട്ടറി തട്ടിപ്പുകളിൽ വഞ്ചിതരാകാതിരിക്കുക. ഓൺലൈനായോ വാട്സാപ്പ് വഴിയോ ലോട്ടറി വിൽക്കാറില്ല.'}
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
