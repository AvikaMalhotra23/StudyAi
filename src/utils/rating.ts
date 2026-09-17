export function calculateRating(
  modulesCompleted: number,
  doubtsSolved: number,
  streakDays: number,
  upvotesReceived: number,
  quizAccuracyPct: number
): number {
  // Objective 5-pillar study reliability formula (0 - 100)
  // 1. Modules Completed (30 pts max)
  const modulesScore = Math.min(30, modulesCompleted * 1.6);
  // 2. Doubts Solved (25 pts max)
  const doubtsScore = Math.min(25, doubtsSolved * 1.2);
  // 3. Streak Consistency (20 pts max)
  const streakScore = Math.min(20, streakDays * 1.5);
  // 4. Peer Upvotes (15 pts max)
  const upvotesScore = Math.min(15, upvotesReceived * 0.3);
  // 5. Quiz Accuracy (10 pts max)
  const accuracyScore = Math.min(10, (quizAccuracyPct / 100) * 10);

  const total = modulesScore + doubtsScore + streakScore + upvotesScore + accuracyScore;
  return Math.max(40, Math.min(100, Math.round(total)));
}

export interface RatingBadge {
  label: string;
  color: string;
  bgBadge: string;
  textBadge: string;
  borderBadge: string;
}

export function getRatingBadge(score: number): RatingBadge {
  if (score >= 93) {
    return {
      label: 'AIR Master Mentor',
      color: 'text-emerald-400',
      bgBadge: 'bg-emerald-500/15',
      textBadge: 'text-emerald-300',
      borderBadge: 'border-emerald-500/30'
    };
  } else if (score >= 85) {
    return {
      label: 'Top Rank Collaborator',
      color: 'text-indigo-400',
      bgBadge: 'bg-indigo-500/15',
      textBadge: 'text-indigo-300',
      borderBadge: 'border-indigo-500/30'
    };
  } else if (score >= 75) {
    return {
      label: 'Consistent Aspirant',
      color: 'text-cyan-400',
      bgBadge: 'bg-cyan-500/15',
      textBadge: 'text-cyan-300',
      borderBadge: 'border-cyan-500/30'
    };
  } else {
    return {
      label: 'Foundation Scholar',
      color: 'text-amber-400',
      bgBadge: 'bg-amber-500/15',
      textBadge: 'text-amber-300',
      borderBadge: 'border-amber-500/30'
    };
  }
}
