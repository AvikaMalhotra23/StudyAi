import React, { useState } from 'react';
import { 
  Flame, 
  Calendar, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  Sparkles, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  ChevronRight,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { StudentUser } from '../types';
import { 
  getTodayDateStr, 
  getPast7DaysConsistency, 
  getStreakMilestones 
} from '../utils/streakUtils';

interface DailyStreakCardProps {
  currentUser: StudentUser;
  onClaimDailyStreak: () => void;
  onTabChange: (tab: string) => void;
}

export const DailyStreakCard: React.FC<DailyStreakCardProps> = ({
  currentUser,
  onClaimDailyStreak,
  onTabChange
}) => {
  const [showScienceInfo, setShowScienceInfo] = useState(false);
  const today = getTodayDateStr();
  const isCheckedInToday = currentUser.last_login_date === today;
  const past7Days = getPast7DaysConsistency(currentUser);
  const milestone = getStreakMilestones(currentUser.streak_days);

  const handleManualCheckIn = () => {
    if (isCheckedInToday) {
      return;
    }
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.6 }
    });
    onClaimDailyStreak();
  };

  return (
    <div 
      id="educational-consistency-streak-card"
      className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-200/90 shadow-sm relative overflow-hidden transition-all"
    >
      {/* Background soft ambient glowing accents */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-gradient-to-bl from-rose-200/30 via-amber-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-10 w-40 h-40 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />

      {/* Header section: Title, Subtitle, & Badge */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
              <Flame className="w-7 h-7 text-white animate-pulse" />
            </div>
            {isCheckedInToday && (
              <span 
                title="Today's revision logged"
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight flex items-center gap-1.5">
                Educational Consistency & Daily Login Streak
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${milestone.badgeColor}`}>
                {milestone.currentTier}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Every day you log in and revise builds cumulative academic momentum. Consistent daily engagement is weighted at <strong className="text-slate-700 font-semibold">20 points</strong> in your AICTE Study Partner Reliability Rating.
            </p>
          </div>
        </div>

        {/* Action Button: Checked In vs Check In Now */}
        <div className="flex-shrink-0 flex items-center gap-2">
          {isCheckedInToday ? (
            <div 
              id="streak-status-active-badge"
              className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Today's Login Active & Secured</span>
            </div>
          ) : (
            <button
              id="claim-daily-login-streak-btn"
              onClick={handleManualCheckIn}
              className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-white animate-spin" />
              <span>Log Today's Consistency (+15 Stars)</span>
            </button>
          )}

          <button
            id="streak-science-info-btn"
            onClick={() => setShowScienceInfo(!showScienceInfo)}
            title="Why daily consistency matters"
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Science of Habit Banner (Collapsible) */}
      {showScienceInfo && (
        <div className="relative z-10 mt-4 p-4 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border border-indigo-100 text-xs text-slate-700 space-y-2">
          <div className="flex items-center gap-2 font-bold text-indigo-900">
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>The Science of Educational Consistency (Spaced Repetition & Habit Loops)</span>
          </div>
          <p className="leading-relaxed text-slate-600">
            Cognitive psychology shows that <strong>30 minutes of daily revision</strong> beats a 6-hour weekend cramming session by <strong className="text-indigo-700">3.2x in long-term memory retention</strong>. EduQuest tracks daily logins to keep you disciplined across JEE, NEET, and CBSE preparation schedules.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
            <div className="p-2 rounded-xl bg-white/80 border border-indigo-100">
              <span className="font-bold text-slate-900 block">🧠 +84% Retention</span>
              <span className="text-slate-500">Continuous spaced repetition prevents forgetting curve drop-offs.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/80 border border-indigo-100">
              <span className="font-bold text-slate-900 block">🤝 Top 5% Buddy Match</span>
              <span className="text-slate-500">High-streak aspirants get matched with serious, top-ranking peers.</span>
            </div>
            <div className="p-2 rounded-xl bg-white/80 border border-indigo-100">
              <span className="font-bold text-slate-900 block">⭐ 1.5x Reward Multiplier</span>
              <span className="text-slate-500">Bonus Stars earned on quizzes, doubt upvotes, & spin wheels.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: 7-Day Consistency Tracker + Stats & Next Milestone */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
        
        {/* Left Column (7 cols): 7-Day Rolling Calendar Tracker */}
        <div className="lg:col-span-7 bg-slate-50/90 rounded-2xl p-4 sm:p-5 border border-slate-200/90 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-slate-800">7-Day Study & Login Habit Tracker</span>
              </div>
              <span className="text-[11px] font-medium text-slate-500">
                {currentUser.streak_days} consecutive active days
              </span>
            </div>

            {/* 7 Day Pills */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 pt-1">
              {past7Days.map((day) => {
                return (
                  <div
                    key={day.dateStr}
                    className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${
                      day.isToday
                        ? day.isCompleted
                          ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20'
                          : 'bg-white border-dashed border-rose-400 text-slate-800 ring-2 ring-rose-200 ring-offset-1'
                        : day.isCompleted
                        ? 'bg-white border-rose-200 text-slate-800 shadow-xs'
                        : 'bg-white/60 border-slate-200 text-slate-400'
                    }`}
                  >
                    <span className={`text-[10px] font-semibold uppercase ${day.isToday && day.isCompleted ? 'text-rose-100' : 'text-slate-400'}`}>
                      {day.dayName}
                    </span>

                    <span className={`text-sm sm:text-base font-extrabold my-1 font-mono ${day.isToday && day.isCompleted ? 'text-white' : 'text-slate-800'}`}>
                      {day.dayNumber}
                    </span>

                    <div className="my-0.5">
                      {day.isCompleted ? (
                        <Flame className={`w-4 h-4 ${day.isToday && day.isCompleted ? 'text-amber-200 fill-amber-200 animate-bounce' : 'text-rose-500 fill-rose-500'}`} />
                      ) : day.isToday ? (
                        <span className="text-[10px] font-bold text-rose-600">Active</span>
                      ) : (
                        <span className="w-2 h-2 rounded-full bg-slate-200 block my-1" />
                      )}
                    </div>

                    <span className={`text-[9px] font-medium truncate w-full ${day.isToday && day.isCompleted ? 'text-rose-100' : day.isCompleted ? 'text-slate-500' : 'text-slate-300'}`}>
                      {day.isCompleted ? `${day.studyHoursEstimated}h` : 'Rest'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom streak metrics summary line */}
          <div className="mt-4 pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Daily Streak Shield: <strong className="text-slate-800 font-semibold">Active</strong></span>
            </div>
            <span className="text-[11px] text-slate-500">
              Log in every 24 hours to keep the chain unbroken!
            </span>
          </div>
        </div>

        {/* Right Column (5 cols): Milestone Progress & Habit Multipliers */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-3 bg-gradient-to-br from-slate-50 to-indigo-50/40 rounded-2xl p-4 sm:p-5 border border-slate-200/90">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                Next Milestone Progress
              </span>
              <span className="text-xs font-mono font-bold text-indigo-600">
                {currentUser.streak_days} / {milestone.nextMilestoneDays} Days
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden p-0.5 border border-slate-300/60">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500 transition-all duration-500"
                style={{ width: `${milestone.progressPct}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5">
              <span>Current: {currentUser.streak_days}d</span>
              <span className="font-semibold text-indigo-700">
                {milestone.daysRemaining > 0 ? `${milestone.daysRemaining} days until next tier unlock` : 'Milestone achieved!'}
              </span>
              <span>Target: {milestone.nextMilestoneDays}d</span>
            </div>

            {/* Active Educational Perks from Consistency */}
            <div className="mt-3 space-y-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Active Consistency Perks
              </span>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {milestone.perks.map((perk, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                    <span className="leading-tight">{perk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick link to Peer Study Buddies */}
          <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Consistent learners rank higher
            </span>
            <button
              id="study-streak-view-buddies-btn"
              onClick={() => onTabChange('buddies')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
            >
              <span>View Leaderboard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
