import React, { useState } from 'react';
import { StudentUser } from '../types';
import { 
  ShieldCheck, 
  Star, 
  Flame, 
  HelpCircle, 
  Sparkles, 
  ShoppingBag, 
  BarChart3, 
  Brain, 
  PieChart, 
  ArrowRight, 
  CheckCircle2, 
  Award,
  Zap,
  BookOpen,
  Code2,
  Clock
} from 'lucide-react';
import { getSpinCooldown } from '../utils/spinCooldown';
import { DailyStreakCard } from './DailyStreakCard';

interface DashboardViewProps {
  currentUser: StudentUser;
  onTabChange: (tab: string) => void;
  onOpenSpinModal: () => void;
  onClaimDailyStreak: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentUser,
  onTabChange,
  onOpenSpinModal,
  onClaimDailyStreak
}) => {
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  // Weekly study data for the responsive chart
  const weeklyData = [
    { day: 'Mon', hours: 3.5, doubts: 2 },
    { day: 'Tue', hours: 4.2, doubts: 3 },
    { day: 'Wed', hours: 5.0, doubts: 4 },
    { day: 'Thu', hours: 3.8, doubts: 1 },
    { day: 'Fri', hours: 4.6, doubts: 3 },
    { day: 'Sat', hours: 6.0, doubts: 5 },
    { day: 'Sun', hours: 4.5, doubts: 2 },
  ];

  // Subject competency data tailored for CBSE, JEE, NEET, and Coding Skills
  const subjectScores = [
    { name: 'Physics (Mechanics/Optics)', score: 94, color: 'bg-indigo-500' },
    { name: 'Chemistry (Organic/Inorganic)', score: 90, color: 'bg-purple-500' },
    { name: 'Mathematics (Calculus/Algebra)', score: 96, color: 'bg-cyan-500' },
    { name: 'Biology (NEET NCERT Line-by-Line)', score: 88, color: 'bg-emerald-500' },
    { name: 'Coding Skills (Python, C++, Java)', score: 95, color: 'bg-teal-400' },
    { name: 'CBSE Board Derivation Step Mastery', score: 92, color: 'bg-amber-500' },
  ];

  // 100-Point Formula Pillars for current user
  const formulaPillars = [
    {
      title: 'Modules Completed',
      maxPts: 30,
      currentPts: Math.min(30, Math.round(currentUser.modules_completed * 1.6)),
      desc: `${currentUser.modules_completed} modules completed with quizzes`,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-400'
    },
    {
      title: 'Peer Doubts Solved',
      maxPts: 25,
      currentPts: Math.min(25, Math.round(currentUser.doubts_solved * 1.2)),
      desc: `${currentUser.doubts_solved} solutions posted for peers`,
      color: 'bg-cyan-500',
      textColor: 'text-cyan-400'
    },
    {
      title: 'Daily Login Streak',
      maxPts: 20,
      currentPts: Math.min(20, Math.round(currentUser.streak_days * 1.5)),
      desc: `${currentUser.streak_days} days continuous revision`,
      color: 'bg-rose-500',
      textColor: 'text-rose-400'
    },
    {
      title: 'Peer Upvotes',
      maxPts: 15,
      currentPts: Math.min(15, Math.round(currentUser.upvotes_received * 0.3)),
      desc: `${currentUser.upvotes_received} community upvotes received`,
      color: 'bg-amber-500',
      textColor: 'text-amber-400'
    },
    {
      title: 'Quiz Accuracy',
      maxPts: 10,
      currentPts: Math.min(10, Math.round((currentUser.quiz_accuracy_pct / 100) * 10)),
      desc: `${currentUser.quiz_accuracy_pct}% average quiz mastery`,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-400'
    }
  ];

  return (
    <div className="space-y-6">
      
      {/* Welcome & Study Hero Banner */}
      <div 
        id="dashboard-hero-banner"
        className="relative overflow-hidden rounded-3xl p-5 sm:p-8 border border-indigo-100 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-pink-50/80 shadow-sm"
      >
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-200/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Exam Mission: {currentUser.target_exam}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentUser.school}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Welcome back, <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">{currentUser.name.split(' ')[0]}</span>! 🎯
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed">
              Solve peer doubts in Physics, Chemistry, Maths & Biology, master NCERT syllabus units & in-demand coding skills (Python, C++, Java, Web JS), and earn <strong className="text-amber-600 font-semibold">Stars</strong> to redeem rewards!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-coding-skills-btn"
              onClick={() => onTabChange('modules')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 flex items-center gap-2 transition transform active:scale-95 cursor-pointer"
            >
              <Code2 className="w-4 h-4 text-cyan-100" />
              <span>Explore Coding Skills</span>
            </button>
            {(() => {
              const spinCooldown = getSpinCooldown(currentUser.last_spin_date);
              return (
                <button
                  id="hero-spin-wheel-btn"
                  onClick={onOpenSpinModal}
                  className={`px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center gap-2 transition transform active:scale-95 cursor-pointer ${
                    spinCooldown.canSpin
                      ? 'bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-md shadow-indigo-600/25'
                      : 'bg-white hover:bg-slate-50 border border-purple-200 text-purple-700 shadow-xs'
                  }`}
                >
                  {spinCooldown.canSpin ? (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Spin Daily Wheel</span>
                    </>
                  ) : (
                    <>
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span>Spin in {spinCooldown.hours}h {spinCooldown.minutes}m</span>
                    </>
                  )}
                </button>
              );
            })()}
            <button
              id="hero-redeem-stars-btn"
              onClick={() => onTabChange('store')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-2 transition shadow-xs cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Redeem Stars ({currentUser.stars})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* Card 1: Rating Out of 100 */}
        <div 
          id="metric-card-rating" 
          className="bg-white glass-panel-hover rounded-2xl p-4 sm:p-5 border border-emerald-200/80 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Buddy Rating</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              {currentUser.rating_score}
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-emerald-700 mt-1 font-medium">
            Top 5% Partner Reliability
          </p>
        </div>

        {/* Card 2: Star Wallet Balance */}
        <div 
          id="metric-card-stars" 
          onClick={() => onTabChange('store')}
          className="bg-white glass-panel-hover rounded-2xl p-4 sm:p-5 border border-amber-200/80 shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Star Wallet</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-200">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
              {currentUser.stars}
            </span>
            <span className="text-xs text-amber-700 font-medium">Stars</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-amber-700 mt-1 font-medium truncate">
            Ready for OMR or Pen Stand
          </p>
        </div>

        {/* Card 3: Daily Streak Days */}
        <div 
          id="metric-card-streak" 
          onClick={() => {
            const elem = document.getElementById('educational-consistency-streak-card');
            if (elem) {
              elem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
          }}
          className="bg-white glass-panel-hover rounded-2xl p-4 sm:p-5 border border-rose-200/80 shadow-xs cursor-pointer group"
          title="Click to view daily consistency habit calendar"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Revision Streak</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200 group-hover:scale-110 transition-transform">
              <Flame className="w-4 h-4 text-rose-500 fire-glow" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600 font-mono">
              {currentUser.streak_days}
            </span>
            <span className="text-xs text-slate-400 font-medium">Days</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-rose-700 mt-1 font-medium flex items-center justify-between">
            <span>1.5x Star multiplier</span>
            <span className="text-[10px] text-rose-500 underline font-semibold">View Habit →</span>
          </p>
        </div>

        {/* Card 4: Peer Doubts Solved */}
        <div 
          id="metric-card-doubts" 
          onClick={() => onTabChange('doubts')}
          className="bg-white glass-panel-hover rounded-2xl p-4 sm:p-5 border border-cyan-200/80 shadow-xs cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Doubts Solved</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center border border-cyan-200">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-cyan-600 font-mono">
              {currentUser.doubts_solved}
            </span>
            <span className="text-xs text-slate-400 font-medium">Peers Helped</span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-cyan-700 mt-1 font-medium truncate">
            +{currentUser.doubts_solved * 10} Bounty Stars won
          </p>
        </div>

      </div>

      {/* Educational Consistency & Daily Login Streak Component */}
      <DailyStreakCard 
        currentUser={currentUser}
        onClaimDailyStreak={onClaimDailyStreak}
        onTabChange={onTabChange}
      />

      {/* Analytics Charts Section (Weekly Activity Bar Chart + Subject Competency Progress) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weekly Study Hours & Consistency SVG Bar Chart */}
        <div 
          id="weekly-activity-chart-card"
          className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-indigo-600" />
                  Weekly Study Hours & Consistency
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tracks hours logged across learning modules & peer collaboration
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span> Study Hours
                </span>
                <span className="flex items-center gap-1.5 text-cyan-600 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-500"></span> Doubt Solves
                </span>
              </div>
            </div>

            {/* Interactive SVG Bar Visualization */}
            <div className="h-56 w-full flex items-end justify-between gap-2 pt-6 px-2 pb-2 border-b border-slate-100">
              {weeklyData.map((d, index) => {
                const hourHeightPct = (d.hours / 7.0) * 100;
                const doubtHeightPct = (d.doubts / 6.0) * 100;
                const isHovered = hoveredDay === index;

                return (
                  <div 
                    key={d.day}
                    className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
                    onMouseEnter={() => setHoveredDay(index)}
                    onMouseLeave={() => setHoveredDay(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-[10px] text-white whitespace-nowrap shadow-xl">
                        <p className="font-bold text-indigo-300">{d.hours} hrs study</p>
                        <p className="text-cyan-300">{d.doubts} doubts solved</p>
                      </div>
                    )}

                    <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                      {/* Hours bar */}
                      <div 
                        className="w-2 sm:w-3.5 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${hourHeightPct}%` }}
                      ></div>
                      {/* Doubt solves bar */}
                      <div 
                        className="w-2 sm:w-3.5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-300 group-hover:brightness-110"
                        style={{ height: `${doubtHeightPct}%` }}
                      ></div>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 mt-2">
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Target: 25 hrs/week (Currently at 31.6 hrs • 126% achieved)</span>
            </span>
            <span className="text-slate-500 font-medium">Avg: 4.5 hrs/day</span>
          </div>
        </div>

        {/* Subject Competency Card */}
        <div 
          id="subject-competency-card"
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Subject Competency
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Multi-domain diagnostic mastery
                </p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                NCERT + JEE/NEET
              </span>
            </div>

            <div className="space-y-3.5 my-2">
              {subjectScores.map((s) => (
                <div key={s.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-700 truncate pr-2">{s.name}</span>
                    <span className="font-mono text-indigo-600 font-bold">{s.score}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className={`h-full rounded-full ${s.color} transition-all duration-500`}
                      style={{ width: `${s.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Diagnostic Score</span>
            <span className="font-bold font-mono text-emerald-600 text-sm">92.4%</span>
          </div>
        </div>

      </div>

      {/* 100-Point Rating Formula Detailed Explainer Card */}
      <div 
        id="rating-formula-explainer-card"
        className="bg-white rounded-3xl p-5 sm:p-7 border border-indigo-100 shadow-xs"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              100-Point Study Partner Reliability Rating
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Transparent 5-pillar algorithm designed by AICTE to pair reliable, active study buddies
            </p>
          </div>
          <button 
            id="browse-buddies-cta-btn"
            onClick={() => onTabChange('buddies')}
            className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            <span>Match with Top Aspirants</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 5 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 my-4">
          {formulaPillars.map((p) => {
            const pct = Math.round((p.currentPts / p.maxPts) * 100);
            return (
              <div 
                key={p.title} 
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 hover:border-indigo-300 transition"
              >
                <div className="flex justify-between items-baseline mb-1">
                  <span className={`text-xs font-bold ${p.textColor}`}>{p.title}</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{p.currentPts}/{p.maxPts}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden my-2">
                  <div 
                    className={`h-full rounded-full ${p.color}`} 
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
              Current Rating: {currentUser.rating_score}/100
            </span>
            <span className="text-[11px] text-slate-500">
              Formula: Modules (30%) + Doubts (25%) + Streak (20%) + Upvotes (15%) + Accuracy (10%)
            </span>
          </div>
          <span className="text-slate-400 font-medium">Auto-updated in real-time</span>
        </div>
      </div>

    </div>
  );
};
