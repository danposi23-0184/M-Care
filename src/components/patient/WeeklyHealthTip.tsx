import React, { useState } from 'react';
import {
  Baby,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Check,
  Stethoscope,
  ArrowRight,
  X,
  Apple,
  AlertCircle,
  ShieldCheck,
} from 'lucide-react';
import {
  PREGNANCY_WEEKLY_TIPS,
  PregnancyTip,
  getTipForCurrentCalendarWeek,
} from '../../data/pregnancyTipsData';

interface WeeklyHealthTipProps {
  onOpenBooking?: () => void;
  onSelectServiceForBooking?: (serviceName: string) => void;
}

export const WeeklyHealthTip: React.FC<WeeklyHealthTipProps> = ({
  onOpenBooking,
  onSelectServiceForBooking,
}) => {
  const autoCurrentTip = getTipForCurrentCalendarWeek();
  const [selectedWeek, setSelectedWeek] = useState<number>(autoCurrentTip.week);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [copiedShare, setCopiedShare] = useState<boolean>(false);
  const [showFullDetails, setShowFullDetails] = useState<boolean>(false);

  const currentTip: PregnancyTip =
    PREGNANCY_WEEKLY_TIPS.find((t) => t.week === selectedWeek) || autoCurrentTip;

  const currentIndex = PREGNANCY_WEEKLY_TIPS.findIndex((t) => t.week === currentTip.week);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex > 0) {
      setSelectedWeek(PREGNANCY_WEEKLY_TIPS[currentIndex - 1].week);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentIndex < PREGNANCY_WEEKLY_TIPS.length - 1) {
      setSelectedWeek(PREGNANCY_WEEKLY_TIPS[currentIndex + 1].week);
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const text = `Week ${currentTip.week} Pregnancy Tip from M-Care:\n${currentTip.title}\n"${currentTip.highlight}"`;
    navigator.clipboard.writeText(text);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  return (
    <>
      {/* Streamlined, airy Weekly Card */}
      <div
        id="weekly-health-tip-card"
        className="bg-white dark:bg-[#0F233A] rounded-2xl border border-[#E2ECF8] dark:border-[#1E3A5F] p-4 shadow-2xs hover:border-[#B9DBFE] dark:hover:border-[#38BDF8] transition-all cursor-pointer"
        onClick={() => setShowFullDetails(true)}
      >
        {/* Top Meta Bar */}
        <div className="flex items-center justify-between text-xs mb-2.5">
          <div className="flex items-center gap-2">
            <span className="font-bold text-[#0057B8] dark:text-[#60A5FA] bg-[#E1EFFF] dark:bg-[#10243E] px-2 py-0.5 rounded-md text-[11px] border border-transparent dark:border-[#1E3A5F]">
              Week {currentTip.week}
            </span>
            <span className="text-[#64748B] dark:text-[#94A3B8] text-[11px]">
              Trimester {currentTip.trimester}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className={`p-1 rounded-md text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#152E4D] transition-colors ${
                currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="Previous week"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono text-[#94A3B8] dark:text-[#64748B]">
              {currentIndex + 1}/{PREGNANCY_WEEKLY_TIPS.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex === PREGNANCY_WEEKLY_TIPS.length - 1}
              className={`p-1 rounded-md text-[#64748B] dark:text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-[#152E4D] transition-colors ${
                currentIndex === PREGNANCY_WEEKLY_TIPS.length - 1 ? 'opacity-20 cursor-not-allowed' : 'cursor-pointer'
              }`}
              aria-label="Next week"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Baby Size & Title */}
        <div className="space-y-1">
          <div className="text-[11px] text-[#475E7B] dark:text-[#94A3B8] flex items-center gap-1.5">
            <span>Size of a</span>
            <span className="font-bold text-[#0A2540] dark:text-white">{currentTip.babySizeComparison}</span>
            <span className="text-[#94A3B8]">•</span>
            <span>{currentTip.babyLengthCm}</span>
          </div>
          <h4 className="font-bold text-sm text-[#0A2540] dark:text-white leading-snug">
            {currentTip.title}
          </h4>
        </div>

        {/* Short Highlight & Read More Prompt */}
        <p className="text-xs text-[#475E7B] dark:text-[#CBD5E1] mt-2 line-clamp-2 leading-relaxed">
          {currentTip.highlight}
        </p>

        <div className="mt-3 pt-2.5 border-t border-[#F1F5F9] dark:border-[#1A365D] flex items-center justify-between text-xs">
          <span className="text-[#0057B8] dark:text-[#60A5FA] font-bold inline-flex items-center gap-1 group">
            <span>Read guide & symptoms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </span>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={toggleSave}
              className="p-1.5 text-[#94A3B8] hover:text-[#D97706] rounded-md transition-colors cursor-pointer"
              title="Save tip"
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#D97706] text-[#D97706]' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 text-[#94A3B8] hover:text-[#0057B8] dark:hover:text-[#60A5FA] rounded-md transition-colors cursor-pointer"
              title="Share tip"
            >
              {copiedShare ? (
                <Check className="w-3.5 h-3.5 text-[#0D9488]" />
              ) : (
                <Share2 className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Clean Detail Modal */}
      {showFullDetails && (
        <div className="fixed inset-0 z-50 bg-[#0A2540]/60 dark:bg-black/80 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div
            className="bg-white dark:bg-[#0F233A] w-full max-w-md rounded-t-3xl sm:rounded-2xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-[#E2ECF8] dark:border-[#1E3A5F] animate-in slide-in-from-bottom duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="p-4 border-b border-[#E2ECF8] dark:border-[#1A365D] flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-[#0057B8] dark:text-[#60A5FA] uppercase tracking-wider">
                  Week {currentTip.week} Milestone
                </span>
                <h3 className="font-bold text-sm text-[#0A2540] dark:text-white">{currentTip.title}</h3>
              </div>
              <button
                onClick={() => setShowFullDetails(false)}
                className="w-8 h-8 rounded-full bg-[#F4F8FD] dark:bg-[#152E4D] hover:bg-[#E2ECF8] dark:hover:bg-[#1A365D] text-[#475E7B] dark:text-[#CBD5E1] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Modal Content */}
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-[#334155] dark:text-[#CBD5E1]">
              {/* Snapshot */}
              <div className="flex items-center justify-between p-3 bg-[#F8FAFD] dark:bg-[#081525] rounded-xl border border-[#E2ECF8] dark:border-[#1E3A5F]">
                <div>
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Baby Size</span>
                  <span className="font-bold text-xs text-[#0A2540] dark:text-white">{currentTip.babySizeComparison}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Length & Weight</span>
                  <span className="font-bold text-xs text-[#0057B8] dark:text-[#60A5FA]">
                    {currentTip.babyLengthCm} • {currentTip.babyWeightG}
                  </span>
                </div>
              </div>

              {/* Fetal & Maternal */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#0A2540] dark:text-white">Fetal Development</h4>
                  <p className="text-[#475E7B] dark:text-[#94A3B8] leading-relaxed">{currentTip.fetalDevelopment}</p>
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-[#0A2540] dark:text-white">Body Changes</h4>
                  <p className="text-[#475E7B] dark:text-[#94A3B8] leading-relaxed">{currentTip.maternalBodyChanges}</p>
                </div>
              </div>

              {/* Nutrition Tip */}
              <div className="p-3 bg-[#F0FDF4] dark:bg-[#062615] rounded-xl border border-[#BBF7D0] dark:border-[#14532D] space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-[#15803D] dark:text-[#4ADE80] text-[11px]">
                  <Apple className="w-3.5 h-3.5" />
                  <span>Nutrition Focus</span>
                </div>
                <p className="text-[#166534] dark:text-[#86EFAC] text-[11px] leading-relaxed">{currentTip.nutritionTip}</p>
              </div>

              {/* Warnings */}
              <div className="p-3 bg-[#FEF2F2] dark:bg-[#2B0E11] rounded-xl border border-[#FECACA] dark:border-[#7F1D1D] space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-[#DC2626] dark:text-[#F87171] text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>When to Call Doctor</span>
                </div>
                <ul className="space-y-1 text-[11px] text-[#B91C1C] dark:text-[#FCA5A5]">
                  {currentTip.warningSigns.map((w, i) => (
                    <li key={i} className="flex items-start gap-1">
                      <span>•</span>
                      <span>{w}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested Scan */}
              {currentTip.recommendedClinicService && (
                <div className="p-3 bg-[#F8FAFD] dark:bg-[#081525] rounded-xl border border-[#D6E4F5] dark:border-[#1E3A5F] flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#0057B8] dark:text-[#60A5FA] font-bold block">Recommended Scan</span>
                    <span className="font-bold text-xs text-[#0A2540] dark:text-white">
                      {currentTip.recommendedClinicService}
                    </span>
                  </div>
                  {onOpenBooking && (
                    <button
                      onClick={() => {
                        setShowFullDetails(false);
                        if (onSelectServiceForBooking && currentTip.recommendedClinicService) {
                          onSelectServiceForBooking(currentTip.recommendedClinicService);
                        }
                        onOpenBooking();
                      }}
                      className="px-3 py-1.5 bg-[#0057B8] hover:bg-[#0047A0] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      Book Scan
                    </button>
                  )}
                </div>
              )}

              {/* Reviewer Note */}
              <div className="pt-2 border-t border-[#E2ECF8] dark:border-[#1A365D] flex items-center justify-between text-[10px] text-[#94A3B8]">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-[#0D9488] dark:text-[#34D399]" />
                  <span>Reviewed by {currentTip.reviewedBy}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
