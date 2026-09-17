import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, X, Star, Clock, Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { getSpinCooldown, SpinCooldownStatus } from '../utils/spinCooldown';

interface SpinWheelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSpinWin: (rewardStars: number, streakBonus: number, label: string) => void;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  lastSpinDate?: string;
}

interface Segment {
  label: string;
  color: string;
  textColor: string;
  type: 'stars' | 'streak';
  value: number;
}

export const SpinWheelModal: React.FC<SpinWheelModalProps> = ({
  isOpen,
  onClose,
  onSpinWin,
  showToast,
  lastSpinDate
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [winMessage, setWinMessage] = useState<string>('');
  const currentRotationRef = useRef<number>(0);

  // 24-hour live cooldown state
  const [cooldown, setCooldown] = useState<SpinCooldownStatus>(() => getSpinCooldown(lastSpinDate));

  useEffect(() => {
    if (!isOpen) return;
    setCooldown(getSpinCooldown(lastSpinDate));

    const interval = setInterval(() => {
      setCooldown(getSpinCooldown(lastSpinDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, lastSpinDate]);

  const segments: Segment[] = [
    { label: '+10 Stars', color: '#06b6d4', textColor: '#ffffff', type: 'stars', value: 10 },
    { label: '+25 Stars', color: '#6366f1', textColor: '#ffffff', type: 'stars', value: 25 },
    { label: '2x Streak Boost', color: '#f43f5e', textColor: '#ffffff', type: 'streak', value: 1 },
    { label: '+50 Stars', color: '#f59e0b', textColor: '#ffffff', type: 'stars', value: 50 },
    { label: '+5 Stars', color: '#475569', textColor: '#ffffff', type: 'stars', value: 5 },
    { label: 'Mystery +35', color: '#a855f7', textColor: '#ffffff', type: 'stars', value: 35 },
    { label: 'Stationery Voucher', color: '#10b981', textColor: '#ffffff', type: 'stars', value: 20 },
    { label: 'JACKPOT 100', color: '#eab308', textColor: '#000000', type: 'stars', value: 100 }
  ];

  const drawWheel = (angleOffset: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = width / 2 - 12;
    const sliceAngle = (2 * Math.PI) / segments.length;

    ctx.clearRect(0, 0, width, height);

    // Draw Slices
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const startAngle = i * sliceAngle + angleOffset;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Text label
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.textColor;
      ctx.font = 'bold 12px Plus Jakarta Sans, sans-serif';
      ctx.fillText(seg.label, radius - 18, 4);
      ctx.restore();
    }

    // Outer wheel rim
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#cbd5e1';
    ctx.stroke();

    // Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 26, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#fbbf24';
    ctx.stroke();

    // Center Star Symbol
    ctx.fillStyle = '#fbbf24';
    ctx.font = '16px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', centerX, centerY);
  };

  useEffect(() => {
    if (isOpen) {
      setWinMessage('');
      setTimeout(() => {
        drawWheel(currentRotationRef.current);
      }, 50);
    }
  }, [isOpen]);

  const executeSpin = () => {
    if (isSpinning) return;

    // Strict 24-hour verification
    const currentStatus = getSpinCooldown(lastSpinDate);
    if (!currentStatus.canSpin) {
      showToast(`Daily spin is limited to once every 24 hours. Next spin unlocks in ${currentStatus.formattedRemaining}!`, 'warning');
      return;
    }

    setIsSpinning(true);
    setWinMessage('Wheel spinning... Best of luck!');

    // Weighted selection
    const weights = [30, 22, 14, 12, 10, 8, 3, 1];
    let sum = 0;
    const r = Math.random() * 100;
    let winIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += weights[i];
      if (r <= sum) {
        winIndex = i;
        break;
      }
    }

    const sliceAngle = (2 * Math.PI) / segments.length;
    // Pointer is at top (1.5 * PI)
    const targetAngle = 1.5 * Math.PI - (winIndex + 0.5) * sliceAngle;
    const extraSpins = 6 * 2 * Math.PI;
    const currentRot = currentRotationRef.current;
    const totalRotation = currentRot + extraSpins + (targetAngle - (currentRot % (2 * Math.PI)));

    const startTime = performance.now();
    const duration = 3800; // 3.8 seconds

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);

      // Easing: cubic out
      const ease = 1 - Math.pow(1 - progress, 3);
      const angle = currentRot + (totalRotation - currentRot) * ease;

      drawWheel(angle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        currentRotationRef.current = totalRotation % (2 * Math.PI);
        setIsSpinning(false);

        const won = segments[winIndex];
        const starsToAdd = won.type === 'stars' ? won.value : 10;
        const streakBonus = won.type === 'streak' ? 1 : 0;

        onSpinWin(starsToAdd, streakBonus, won.label);

        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });

        setWinMessage(`🎉 Awesome! You won ${won.label}! Next free spin in 24 hours.`);
        showToast(`🎰 Lucky Wheel Win: ${won.label}!`, 'success');
      }
    };

    requestAnimationFrame(animate);
  };

  if (!isOpen) return null;

  return (
    <div 
      id="daily-spin-modal-overlay"
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div className="w-full max-w-sm bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 relative my-auto shadow-2xl text-center text-slate-800">
        <button
          id="close-spin-modal-btn"
          onClick={() => !isSpinning && onClose()}
          disabled={isSpinning}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg disabled:opacity-30 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>Daily Habit Reward Wheel</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
          Lucky Scholar Wheel
        </h3>
        <p className="text-xs text-slate-500 mt-1 mb-3">
          Spin <strong className="text-purple-700 font-semibold">once every 24 hours</strong> to claim free Stars, vouchers, & revision streak bonuses!
        </p>

        {/* 24-Hour Cooldown Banner */}
        {!cooldown.canSpin ? (
          <div className="mb-3 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-1">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>24-Hour Cooldown Active</span>
              </span>
              <span className="font-mono text-amber-800 bg-white px-2 py-0.5 rounded-lg border border-amber-200 shadow-2xs text-[11px]">
                {cooldown.formattedRemaining}
              </span>
            </div>
            <p className="text-[11px] text-amber-700 leading-snug">
              You have already spun today. Next free spin unlocks at <strong className="font-semibold">{cooldown.nextAvailableText}</strong>.
            </p>
            <div className="w-full bg-amber-200/60 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-1000"
                style={{ width: `${cooldown.percentElapsed}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-amber-700 mt-1 font-medium">
              <span>Cooldown: 24 Hours</span>
              <span>{cooldown.percentElapsed}% elapsed</span>
            </div>
          </div>
        ) : (
          <div className="mb-3 p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs text-emerald-800">
            <span className="flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>1 Free Spin Available Today</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-bold border border-emerald-200">
              Ready!
            </span>
          </div>
        )}

        {/* Wheel graphic with top pointer */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-1 flex items-center justify-center">
          {/* Pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 drop-shadow-md"></div>

          <canvas
            ref={canvasRef}
            width={288}
            height={288}
            className={`w-full h-full rounded-full shadow-lg transition duration-300 ${
              !cooldown.canSpin ? 'filter grayscale-30 opacity-90' : ''
            }`}
          />
        </div>

        <div className="mt-3">
          <button
            id="spin-action-button"
            onClick={executeSpin}
            disabled={isSpinning || !cooldown.canSpin}
            className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition transform flex items-center justify-center gap-2 ${
              isSpinning
                ? 'bg-purple-100 text-purple-700 border border-purple-300 cursor-not-allowed'
                : !cooldown.canSpin
                  ? 'bg-slate-100 text-slate-500 border border-slate-300 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-600/25 active:scale-95 cursor-pointer'
            }`}
          >
            {isSpinning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin text-purple-600" />
                <span>SPINNING WHEEL...</span>
              </>
            ) : !cooldown.canSpin ? (
              <>
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Next Spin in {cooldown.formattedRemaining}</span>
              </>
            ) : (
              <>
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>SPIN TO WIN STARS!</span>
              </>
            )}
          </button>

          {winMessage && (
            <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-2 mt-2.5">
              {winMessage}
            </p>
          )}

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Policy: Strictly limited to 1 spin per student every 24 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};
