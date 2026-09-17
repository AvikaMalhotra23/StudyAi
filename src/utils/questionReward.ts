import { QuestionDifficulty } from '../types';

export const DIFFICULTY_STARS_REWARD: Record<QuestionDifficulty, number> = {
  Tough: 5,        // 5 Little Stars for solving Tough questions
  Intermediate: 3, // 3 Little Stars for solving Intermediate questions
  Foundation: 1    // 1 Little Star for solving Foundation questions
};

export const getQuestionSolveReward = (difficulty?: QuestionDifficulty | string): number => {
  if (!difficulty) return 3;
  const key = difficulty.charAt(0).toUpperCase() + difficulty.slice(1).toLowerCase();
  if (key === 'Tough' || key === 'Hard' || key === 'Advanced') return 5;
  if (key === 'Intermediate' || key === 'Medium') return 3;
  return 1;
};
