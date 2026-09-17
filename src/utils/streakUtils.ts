import { StudentUser } from '../types';
import { calculateRating } from './rating';

export interface DayStreakStatus {
  dateStr: string;
  dayName: string; // e.g. 'Mon', 'Tue'
  dayNumber: number; // e.g. 17
  isToday: boolean;
  isCompleted: boolean;
  studyHoursEstimated: number;
}

export interface StreakMilestone {
  currentTier: string;
  badgeColor: string;
  nextMilestoneDays: number;
  daysRemaining: number;
  progressPct: number;
  perks: string[];
}

/**
 * Format local date as YYYY-MM-DD
 */
export function formatDateToLocalISO(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTodayDateStr(): string {
  return formatDateToLocalISO(new Date());
}

export function getYesterdayDateStr(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return formatDateToLocalISO(yesterday);
}

/**
 * Evaluates login streak for a student based on calendar day.
 */
export function evaluateLoginStreak(user: StudentUser): {
  updatedUser: StudentUser;
  isNewDay: boolean;
  streakIncremented: boolean;
  streakReset: boolean;
  bonusStars: number;
  message: string;
} {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();
  const lastLogin = user.last_login_date ? user.last_login_date.trim() : '';

  // Already checked in today
  if (lastLogin === today) {
    return {
      updatedUser: user,
      isNewDay: false,
      streakIncremented: false,
      streakReset: false,
      bonusStars: 0,
      message: `Your Day ${user.streak_days} study streak is already secured for today! Keep revising consistently.`
    };
  }

  // Consecutive day login (Yesterday -> Today)
  if (lastLogin === yesterday) {
    const newStreak = user.streak_days + 1;
    const bonusStars = 15 + Math.min(25, newStreak * 2);
    const newRating = calculateRating(
      user.modules_completed,
      user.doubts_solved,
      newStreak,
      user.upvotes_received,
      user.quiz_accuracy_pct
    );

    const history = user.login_history ? [...user.login_history] : [];
    if (!history.includes(today)) {
      history.push(today);
    }

    const updatedUser: StudentUser = {
      ...user,
      streak_days: newStreak,
      stars: user.stars + bonusStars,
      rating_score: newRating,
      last_login_date: today,
      login_history: history
    };

    return {
      updatedUser,
      isNewDay: true,
      streakIncremented: true,
      streakReset: false,
      bonusStars,
      message: `🔥 Awesome consistency! Day ${newStreak} login streak confirmed. You earned +${bonusStars} bonus Stars!`
    };
  }

  // Missed one or more days (or first ever login)
  const isFirstTime = !lastLogin;
  const newStreak = 1;
  const bonusStars = 10;
  const newRating = calculateRating(
    user.modules_completed,
    user.doubts_solved,
    newStreak,
    user.upvotes_received,
    user.quiz_accuracy_pct
  );

  const history = user.login_history ? [...user.login_history] : [];
  if (!history.includes(today)) {
    history.push(today);
  }

  const updatedUser: StudentUser = {
    ...user,
    streak_days: newStreak,
    stars: user.stars + bonusStars,
    rating_score: newRating,
    last_login_date: today,
    login_history: history
  };

  const message = isFirstTime
    ? `Welcome! Day 1 academic streak initiated. +${bonusStars} check-in Stars earned.`
    : `Welcome back! Fresh Day 1 consistency streak started today. +${bonusStars} revival Stars awarded!`;

  return {
    updatedUser,
    isNewDay: true,
    streakIncremented: false,
    streakReset: !isFirstTime,
    bonusStars,
    message
  };
}

/**
 * Returns streak milestone tiers and benefits
 */
export function getStreakMilestones(streakDays: number): StreakMilestone {
  const tiers = [
    { threshold: 3, name: 'Igniter Aspirant', color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { threshold: 7, name: 'Consistent Scholar', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { threshold: 14, name: 'Habit Champion', color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { threshold: 21, name: '21-Day Habit Master', color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { threshold: 30, name: 'Unstoppable Ranker', color: 'text-cyan-700 bg-cyan-50 border-cyan-200' },
    { threshold: 60, name: 'Legendary Aspirant', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  ];

  let currentTier = 'Foundation Builder';
  let badgeColor = 'text-slate-700 bg-slate-50 border-slate-200';

  for (const t of tiers) {
    if (streakDays >= t.threshold) {
      currentTier = t.name;
      badgeColor = t.color;
    }
  }

  const nextTierObj = tiers.find(t => t.threshold > streakDays) || {
    threshold: streakDays + 15,
    name: 'Infinity Consistency'
  };

  const nextMilestoneDays = nextTierObj.threshold;
  const daysRemaining = Math.max(0, nextMilestoneDays - streakDays);

  const prevThreshold = tiers
    .filter(t => t.threshold <= streakDays)
    .reduce((max, t) => Math.max(max, t.threshold), 0);

  const progressPct = Math.min(
    100,
    Math.round(((streakDays - prevThreshold) / (nextMilestoneDays - prevThreshold)) * 100)
  );

  return {
    currentTier,
    badgeColor,
    nextMilestoneDays,
    daysRemaining,
    progressPct: isNaN(progressPct) ? 50 : Math.max(5, progressPct),
    perks: [
      `1.5x Star multiplier active on all quizzes & solves`,
      `+${Math.min(20, Math.round(streakDays * 1.5))} points added to 100-pt reliability rating`,
      `${streakDays >= 7 ? 'Eligible for Peer Match Leaderboard' : 'Reach 7 days for Verified Study Buddy badge'}`
    ]
  };
}

/**
 * Generates the last 7 calendar days to show daily consistency in education
 */
export function getPast7DaysConsistency(user: StudentUser): DayStreakStatus[] {
  const result: DayStreakStatus[] = [];
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Construct a set of logged in dates
  const loggedSet = new Set<string>();
  if (user.login_history && user.login_history.length > 0) {
    user.login_history.forEach(d => loggedSet.add(d));
  } else {
    // Generate backwards based on current streak_days from last_login_date
    const refDate = user.last_login_date ? new Date(user.last_login_date) : today;
    for (let i = 0; i < user.streak_days; i++) {
      const d = new Date(refDate);
      d.setDate(d.getDate() - i);
      loggedSet.add(formatDateToLocalISO(d));
    }
  }

  // Generate 7 days ending with today
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = formatDateToLocalISO(d);
    const dayName = dayNames[d.getDay()];
    const dayNumber = d.getDate();
    const isToday = i === 0;

    const isCompleted = loggedSet.has(dateStr);

    // Realistic study hours estimate based on day & streak
    const seed = (dayNumber * 7 + (isCompleted ? 3 : 0)) % 5;
    const studyHoursEstimated = isCompleted ? 3.0 + seed * 0.5 : 0;

    result.push({
      dateStr,
      dayName,
      dayNumber,
      isToday,
      isCompleted,
      studyHoursEstimated
    });
  }

  return result;
}
