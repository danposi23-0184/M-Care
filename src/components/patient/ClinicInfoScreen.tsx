import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  Phone,
  Mail,
  Navigation,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  Building,
  Car,
  Compass,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { useClinic } from '../../context/ClinicContext';

export const ClinicInfoScreen: React.FC = () => {
  const { clinicSettings } = useClinic();
  const [copied, setCopied] = useState(false);
  const [activeStartingPoint, setActiveStartingPoint] = useState<string>('Angeles City Hall (Pulung Maragul)');

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${clinicSettings.address}, ${clinicSettings.barangay}, ${clinicSettings.city}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const startingPoints = [
    { name: 'Angeles City Hall (Pulung Maragul)', distance: '4.8 km', eta: '12-15 mins via MacArthur Hwy' },
    { name: 'Nepo Center / Holy Angel Univ.', distance: '3.6 km', eta: '10-12 mins via Rizal Ext.' },
    { name: 'Clark Freeport Friendship Gate', distance: '5.2 km', eta: '14-18 mins via Don Juico Ave' },
    { name: 'Dau Bus Terminal (Mabalacat)', distance: '2.9 km', eta: '8-10 mins via MacArthur Hwy' },
  ];

  return (
    <div className="p-4 space-y-4 pb-20 bg-[#F4F8FD] dark:bg-[#061524] transition-colors duration-200">
      {/* Clinic Hero Profile */}
      <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-5 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-3 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0057B8] dark:text-[#60A5FA] bg-[#E1EFFF] dark:bg-[#10243E] px-2.5 py-0.5 rounded-full border border-[#B9DBFE] dark:border-[#1E3A5F]">
              {clinicSettings.branch}
            </span>
            <h2 className="text-lg font-black text-[#0A2540] dark:text-white leading-tight">
              {clinicSettings.name}
            </h2>
            <p className="text-xs text-[#475E7B] dark:text-[#94A3B8] font-medium">{clinicSettings.subTitle}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0057B8] to-[#003366] flex items-center justify-center text-white shadow-xs shrink-0">
            <Building className="w-6 h-6" />
          </div>
        </div>

        {/* Doctor In Charge */}
        <div className="p-3.5 bg-[#F8FAFD] dark:bg-[#081525] rounded-2xl border border-[#E2ECF8] dark:border-[#1E3A5F] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E1EFFF] dark:bg-[#10243E] text-[#0057B8] dark:text-[#60A5FA] flex items-center justify-center font-black text-sm shrink-0 border border-[#B9DBFE] dark:border-[#1E3A5F]">
            Dr.
          </div>
          <div className="space-y-0.5 flex-1">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#0A2540] dark:text-white">{clinicSettings.doctorName}</h4>
              <span className="text-[10px] font-mono text-[#0057B8] dark:text-[#60A5FA] font-bold bg-white dark:bg-[#0F233A] px-1.5 py-0.5 rounded-md border border-[#D6E4F5] dark:border-[#1E3A5F]">
                {clinicSettings.doctorCredentials}
              </span>
            </div>
            <p className="text-[11px] text-[#475E7B] dark:text-[#94A3B8]">{clinicSettings.specialization}</p>
          </div>
        </div>
      </div>

      {/* Interactive Map & GPS Navigation Section */}
      <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Navigation className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#0A2540] dark:text-white">
              Interactive Clinic Map & GPS
            </h3>
          </div>
          <span className="text-[10px] bg-[#E6F7F5] dark:bg-[#0D9488]/20 text-[#0D9488] dark:text-[#34D399] font-bold px-2 py-0.5 rounded-full border border-[#99F6E4] dark:border-[#0D9488]">
            GPS Geocoded
          </span>
        </div>

        {/* Map Visualizer Container */}
        <div className="relative rounded-2xl overflow-hidden border border-[#D6E4F5] dark:border-[#1E3A5F] bg-[#E1EFFF] dark:bg-[#081525] shadow-inner h-52 flex items-center justify-center group">
          {/* Stylized Angeles City Map Graphic */}
          <div className="absolute inset-0 bg-[#F4F8FD] dark:bg-[#081525] bg-[radial-gradient(#b9dbfe_1.5px,transparent_1.5px)] dark:bg-[radial-gradient(#1E3A5F_1.5px,transparent_1.5px)] [background-size:16px_16px]">
            {/* Roads & highway paths */}
            <svg className="w-full h-full text-[#B9DBFE] dark:text-[#1E3A5F] stroke-current" fill="none">
              <path d="M0 80 Q 150 110 400 60" stroke="currentColor" strokeWidth="8" />
              <path d="M120 0 Q 140 120 220 220" stroke="#0057B8" strokeWidth="6" strokeDasharray="6 3" />
              <path d="M40 220 L 300 30" stroke="#93C5FD" strokeWidth="5" />
            </svg>

            {/* Landmark Tags */}
            <div className="absolute top-6 left-6 bg-white/95 dark:bg-[#0F233A]/95 px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] shadow-xs border border-[#D6E4F5] dark:border-[#1E3A5F]">
              SM City Clark
            </div>
            <div className="absolute bottom-6 left-8 bg-white/95 dark:bg-[#0F233A]/95 px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] shadow-xs border border-[#D6E4F5] dark:border-[#1E3A5F]">
              MacArthur Hwy
            </div>
            <div className="absolute top-12 right-6 bg-white/95 dark:bg-[#0F233A]/95 px-2 py-0.5 rounded-lg text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] shadow-xs border border-[#D6E4F5] dark:border-[#1E3A5F]">
              Fields Ave
            </div>

            {/* Clinic Pin Marker */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="px-2.5 py-1 rounded-xl bg-[#0057B8] text-white text-[11px] font-black shadow-lg flex items-center gap-1 animate-bounce">
                <MapPin className="w-3.5 h-3.5" />
                <span>M-Care Balibago Clinic</span>
              </div>
              <div className="w-3 h-3 bg-[#0057B8] rotate-45 -mt-1.5 shadow-md"></div>
              <div className="w-6 h-6 bg-[#0057B8]/30 rounded-full animate-ping -mt-2"></div>
            </div>
          </div>

          <div className="absolute bottom-2 right-2 flex gap-1.5 z-10">
            <a
              href="https://maps.google.com/?q=Balibago+Angeles+City+Pampanga"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/95 dark:bg-[#0F233A]/95 backdrop-blur-xs text-[#0A2540] dark:text-white text-xs font-bold rounded-xl shadow-md border border-[#D6E4F5] dark:border-[#1E3A5F] hover:bg-[#F4F8FD] dark:hover:bg-[#152E4D] flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
              <span>Google Maps</span>
            </a>
            <a
              href="https://waze.com/ul?q=Balibago+Angeles+City"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-[#0A2540] dark:bg-[#10243E] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#003366] dark:hover:bg-[#1A3A60] flex items-center gap-1 transition-colors"
            >
              <Compass className="w-3.5 h-3.5 text-[#BAE6FD]" />
              <span>Waze</span>
            </a>
          </div>
        </div>

        {/* Route Estimator Selector */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-bold text-[#0057B8] dark:text-[#60A5FA] uppercase flex items-center gap-1">
            <Car className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
            <span>Estimated Travel Times within Angeles City</span>
          </label>
          <div className="space-y-1.5">
            {startingPoints.map((pt) => (
              <div
                key={pt.name}
                onClick={() => setActiveStartingPoint(pt.name)}
                className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-center justify-between ${
                  activeStartingPoint === pt.name
                    ? 'bg-[#E1EFFF] dark:bg-[#10243E] border-[#0057B8] dark:border-[#38BDF8] ring-1 ring-[#0057B8]'
                    : 'bg-[#F8FAFD] dark:bg-[#081525] border-[#E2ECF8] dark:border-[#1E3A5F] hover:bg-[#E1EFFF]/50 dark:hover:bg-[#10243E]/50'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#0A2540] dark:text-white">{pt.name}</div>
                  <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8]">{pt.eta}</div>
                </div>
                <span className="font-bold text-xs text-[#0057B8] dark:text-[#60A5FA] bg-white dark:bg-[#0F233A] px-2 py-0.5 rounded-lg border border-[#D6E4F5] dark:border-[#1E3A5F]">
                  {pt.distance}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Address & Direct Contact Card */}
      <div className="bg-white dark:bg-[#0F233A] rounded-3xl p-4 border border-[#D6E4F5] dark:border-[#1E3A5F] shadow-xs space-y-3 text-xs">
        <div className="flex items-center justify-between border-b border-[#E2ECF8] dark:border-[#1A365D] pb-2">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#0057B8] dark:text-[#60A5FA]" />
            <h4 className="font-bold text-[#0A2540] dark:text-white uppercase tracking-wide text-xs">Clinic Address & Landmark</h4>
          </div>
          <button
            onClick={handleCopyAddress}
            className="flex items-center gap-1 text-[11px] text-[#0057B8] dark:text-[#60A5FA] font-bold hover:text-[#0047A0] bg-[#E1EFFF] dark:bg-[#10243E] px-2.5 py-1 rounded-xl border border-[#B9DBFE] dark:border-[#1E3A5F] cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-[#0D9488] dark:text-[#34D399]" /> : <Copy className="w-3 h-3" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <div className="space-y-1.5 text-[#0A2540] dark:text-slate-200 leading-relaxed">
          <p className="font-bold text-[#0A2540] dark:text-white">{clinicSettings.address}</p>
          <p className="text-[#475E7B] dark:text-[#94A3B8]">{clinicSettings.barangay}, {clinicSettings.city}, {clinicSettings.province}</p>
          <p className="text-[#475E7B] dark:text-[#94A3B8] text-[11px] flex items-center gap-1">
            <span className="font-bold text-[#0A2540] dark:text-white">Landmark:</span>
            <span>{clinicSettings.landmark}</span>
          </p>
        </div>

        <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
              <span>Operating Hours:</span>
            </span>
            <span className="font-bold text-[#0A2540] dark:text-white">
              Mon–Sat: {clinicSettings.operatingHours.start} – {clinicSettings.operatingHours.end}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
              <span>Reception Landline:</span>
            </span>
            <a href={`tel:${clinicSettings.phone.replace(/\D/g, '')}`} className="font-mono font-bold text-[#0057B8] dark:text-[#60A5FA] hover:underline">
              {clinicSettings.phone}
            </a>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
              <span>Mobile / SMS Hotline:</span>
            </span>
            <a href={`tel:${clinicSettings.mobile.replace(/\D/g, '')}`} className="font-mono font-bold text-[#0057B8] dark:text-[#60A5FA] hover:underline">
              {clinicSettings.mobile}
            </a>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#0057B8] dark:text-[#60A5FA]" />
              <span>Official Email:</span>
            </span>
            <a href={`mailto:${clinicSettings.email}`} className="text-[#0A2540] dark:text-white font-semibold hover:underline">
              {clinicSettings.email}
            </a>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D] flex items-center gap-2">
          <a
            href={`tel:${clinicSettings.mobile.replace(/\D/g, '')}`}
            className="flex-1 py-3 bg-[#0057B8] hover:bg-[#0047A0] text-white rounded-2xl font-bold text-center flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Receptionist</span>
          </a>
          <a
            href={`sms:${clinicSettings.mobile.replace(/\D/g, '')}`}
            className="flex-1 py-3 bg-[#E1EFFF] dark:bg-[#10243E] hover:bg-[#D6E4F5] dark:hover:bg-[#1A365D] text-[#0057B8] dark:text-[#60A5FA] rounded-2xl font-bold text-center flex items-center justify-center gap-1.5 border border-[#B9DBFE] dark:border-[#1E3A5F] transition-colors cursor-pointer"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Send SMS</span>
          </a>
        </div>
      </div>
    </div>
  );
};
