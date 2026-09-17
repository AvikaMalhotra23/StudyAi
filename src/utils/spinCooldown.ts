export const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

export interface SpinCooldownStatus {
  canSpin: boolean;
  remainingMs: number;
  formattedRemaining: string;
  hours: number;
  minutes: number;
  seconds: number;
  percentElapsed: number; // 0 to 100
  nextAvailableText: string;
}

export function getSpinCooldown(lastSpinDate?: string): SpinCooldownStatus {
  if (!lastSpinDate || lastSpinDate.trim() === '') {
    return {
      canSpin: true,
      remainingMs: 0,
      formattedRemaining: 'Ready now',
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentElapsed: 100,
      nextAvailableText: 'Available now'
    };
  }

  const lastTime = new Date(lastSpinDate).getTime();
  if (isNaN(lastTime)) {
    return {
      canSpin: true,
      remainingMs: 0,
      formattedRemaining: 'Ready now',
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentElapsed: 100,
      nextAvailableText: 'Available now'
    };
  }

  const now = Date.now();
  const diff = now - lastTime;

  if (diff >= TWENTY_FOUR_HOURS_MS) {
    return {
      canSpin: true,
      remainingMs: 0,
      formattedRemaining: 'Ready now',
      hours: 0,
      minutes: 0,
      seconds: 0,
      percentElapsed: 100,
      nextAvailableText: 'Available now'
    };
  }

  const remainingMs = TWENTY_FOUR_HOURS_MS - diff;
  const hours = Math.floor(remainingMs / (1000 * 60 * 60));
  const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((remainingMs % (1000 * 60)) / 1000);

  const formattedRemaining = `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  const percentElapsed = Math.min(100, Math.max(0, Math.round((diff / TWENTY_FOUR_HOURS_MS) * 100)));

  const nextDate = new Date(lastTime + TWENTY_FOUR_HOURS_MS);
  const timeStr = nextDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return {
    canSpin: false,
    remainingMs,
    formattedRemaining,
    hours,
    minutes,
    seconds,
    percentElapsed,
    nextAvailableText: `Unlocks at ${timeStr}`
  };
}
