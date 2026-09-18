import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { DAILY_REWARDS_TABLE } from '../data/campaignData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Gift,
  Sparkles,
  CheckCircle2,
  Lock,
  X,
  RotateCw,
  Coins,
  Trophy,
  Flame
} from 'lucide-react';

interface DailyRewardsModalProps {
  onClose: () => void;
}

export const DailyRewardsModal: React.FC<DailyRewardsModalProps> = ({ onClose }) => {
  const {
    profile,
    quests,
    claimDailyAttendance,
    claimDailySpin,
    claimQuestReward
  } = useGame();

  const [activeTab, setActiveTab] = useState<'calendar' | 'wheel' | 'quests'>('calendar');
  const [claimMessage, setClaimMessage] = useState<string | null>(null);

  // Spin Wheel State
  const [isSpinning, setIsSpinning] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [spinResult, setSpinResult] = useState<{ label: string; coins: number; gems: number } | null>(null);

  const today = new Date().toISOString().split('T')[0];
  const canClaimAttendance = profile.lastDailyRewardClaimDate !== today;
  const canSpinToday = profile.lastDailySpinDate !== today;

  const wheelPrizes = [
    { label: '+50 Xu', coins: 50, gems: 0, color: '#f59e0b' },
    { label: '+10 KC', coins: 0, gems: 10, color: '#8b5cf6' },
    { label: '+100 Xu', coins: 100, gems: 0, color: '#10b981' },
    { label: '+25 KC', coins: 0, gems: 25, color: '#ec4899' },
    { label: '+200 Xu', coins: 200, gems: 0, color: '#3b82f6' },
    { label: '🎁 500 Xu', coins: 500, gems: 20, color: '#ef4444' }
  ];

  const handleClaimAttendance = () => {
    const result = claimDailyAttendance();
    if (result) {
      setClaimMessage(`Chúc mừng em nhận được +${result.coins} Xu ${result.gems > 0 ? `và +${result.gems} Kim Cương` : ''} 🎉`);
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }
  };

  const handleSpinWheel = () => {
    if (isSpinning || !canSpinToday) return;

    setIsSpinning(true);
    soundManager.playSpinWheel();

    // Random prize
    const prizeIndex = Math.floor(Math.random() * wheelPrizes.length);
    const prize = wheelPrizes[prizeIndex];

    const sliceAngle = 360 / wheelPrizes.length;
    const targetAngle = 360 * 5 + (360 - (prizeIndex * sliceAngle + sliceAngle / 2));

    setWheelRotation(prev => prev + targetAngle);

    setTimeout(() => {
      setIsSpinning(false);
      setSpinResult(prize);
      claimDailySpin(prize.coins, prize.gems);
      soundManager.playVictory();

      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-4 text-slate-950 flex items-center justify-between border-b-3 border-amber-500">
          <div className="flex items-center gap-2">
            <Gift className="w-6 h-6 text-yellow-100 fill-yellow-200" />
            <h2 className="font-fredoka font-black text-xl sm:text-2xl">
              PHẦN THƯỞNG MỖI NGÀY
            </h2>
          </div>

          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-amber-50/50 p-2 gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('calendar');
            }}
            className={`flex-1 py-2.5 rounded-2xl font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-b-2 border-amber-600'
                : 'bg-white text-slate-600 hover:bg-amber-100'
            }`}
          >
            <Flame className="w-4 h-4 text-red-500" />
            <span>Điểm Danh 7 Ngày</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('wheel');
            }}
            className={`flex-1 py-2.5 rounded-2xl font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'wheel'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-b-2 border-amber-600'
                : 'bg-white text-slate-600 hover:bg-amber-100'
            }`}
          >
            <RotateCw className="w-4 h-4 text-purple-600" />
            <span>Vòng Quay May Mắn</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('quests');
            }}
            className={`flex-1 py-2.5 rounded-2xl font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'quests'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-b-2 border-amber-600'
                : 'bg-white text-slate-600 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>Nhiệm Vụ Ngày</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* TAB 1: 7-DAY CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-600">
                  Chuỗi học tập liên tục của em:{' '}
                  <span className="text-red-600 font-bold font-fredoka text-base">
                    🔥 {profile.streakDays} Ngày
                  </span>
                </p>
                <p className="text-xs text-slate-400">
                  Chăm chỉ đăng nhập mỗi ngày để nhận quà lớn vào ngày thứ 7!
                </p>
              </div>

              {/* 7 Days Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 my-4">
                {DAILY_REWARDS_TABLE.map(item => {
                  const isCurrentDay = profile.dailyRewardDay === item.day;
                  const isPast = item.day < profile.dailyRewardDay;
                  const isClaimedToday = isCurrentDay && !canClaimAttendance;

                  return (
                    <div
                      key={item.day}
                      className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                        isCurrentDay
                          ? 'bg-amber-100 border-amber-500 ring-2 ring-amber-300 shadow-md scale-105'
                          : isPast || isClaimedToday
                          ? 'bg-emerald-50 border-emerald-300 opacity-80'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="font-fredoka font-bold text-xs text-slate-700 mb-1">
                        {item.title}
                      </span>
                      <div className="text-3xl my-1">{item.icon}</div>
                      <span className="text-[11px] font-fredoka font-bold text-slate-900">
                        {item.label}
                      </span>

                      {isPast || isClaimedToday ? (
                        <span className="mt-2 text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                          Đã Nhận ✓
                        </span>
                      ) : isCurrentDay ? (
                        <span className="mt-2 text-[10px] bg-amber-500 text-amber-950 px-2 py-0.5 rounded-full font-bold animate-pulse">
                          Hôm Nay
                        </span>
                      ) : (
                        <span className="mt-2 text-[10px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold">
                          Khóa
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Claim Button */}
              <div className="pt-2 text-center">
                {canClaimAttendance ? (
                  <button
                    onClick={handleClaimAttendance}
                    className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fredoka font-bold text-base rounded-2xl shadow-lg border-b-4 border-teal-800 transition-all active:scale-95 animate-bounce"
                  >
                    🎁 Nhận Quà Ngày Hôm Nay!
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-6 py-3 rounded-2xl font-fredoka font-bold text-sm border border-emerald-300">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Em đã nhận phần thưởng hôm nay rồi! Hẹn gặp lại ngày mai nhé!</span>
                  </div>
                )}

                {claimMessage && (
                  <p className="text-sm font-fredoka font-bold text-emerald-700 mt-3 animate-in fade-in">
                    {claimMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: LUCKY SPIN WHEEL */}
          {activeTab === 'wheel' && (
            <div className="flex flex-col items-center space-y-4">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold text-center">
                Mỗi ngày em có 1 lượt quay miễn phí để rinh về quà khủng!
              </p>

              {/* Wheel Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 my-2">
                {/* Pointer arrow at top */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-red-600 drop-shadow-md" />

                {/* Spinning Wheel */}
                <div
                  className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl relative overflow-hidden transition-transform duration-[4000ms] ease-out"
                  style={{
                    transform: `rotate(${wheelRotation}deg)`,
                    background: 'conic-gradient(#f59e0b 0% 16.66%, #8b5cf6 16.66% 33.33%, #10b981 33.33% 50%, #ec4899 50% 66.66%, #3b82f6 66.66% 83.33%, #ef4444 83.33% 100%)'
                  }}
                >
                  {/* Wheel Slice Labels */}
                  {wheelPrizes.map((p, idx) => {
                    const angle = idx * 60 + 30;
                    return (
                      <div
                        key={idx}
                        className="absolute w-full h-full flex justify-center pt-4 font-fredoka font-black text-xs sm:text-sm text-white drop-shadow select-none pointer-events-none"
                        style={{
                          transform: `rotate(${angle}deg)`
                        }}
                      >
                        <span className="transform -rotate-90 origin-center bg-black/30 px-2 py-0.5 rounded-md">
                          {p.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Center Spin Hub Button */}
                <button
                  onClick={handleSpinWheel}
                  disabled={isSpinning || !canSpinToday}
                  className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4 border-white font-fredoka font-black text-sm flex items-center justify-center shadow-xl z-10 transition-transform ${
                    isSpinning
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : canSpinToday
                      ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-amber-950 hover:scale-110 active:scale-95 animate-pulse-subtle'
                      : 'bg-slate-300 text-slate-600 cursor-not-allowed'
                  }`}
                >
                  {isSpinning ? '...' : canSpinToday ? 'QUAY' : 'HẾT'}
                </button>
              </div>

              {/* Spin Result Feedback */}
              {spinResult && (
                <div className="bg-amber-100 border-2 border-amber-400 p-3 rounded-2xl font-fredoka font-bold text-center text-amber-950 animate-in zoom-in">
                  🎉 Chúc mừng em đã quay trúng: <span className="text-purple-700 text-base">{spinResult.label}</span>!
                </div>
              )}

              {!canSpinToday && !spinResult && (
                <p className="text-xs text-slate-500 font-semibold text-center">
                  Em đã quay hôm nay rồi. Hãy quay lại vào ngày mai nhé!
                </p>
              )}
            </div>
          )}

          {/* TAB 3: DAILY QUESTS */}
          {activeTab === 'quests' && (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-3">
                Hoàn thành nhiệm vụ rèn luyện toán học để nhận thêm vàng và kim cương!
              </p>

              {quests.map(quest => (
                <div
                  key={quest.id}
                  className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3"
                >
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-2">
                      <h4 className="font-fredoka font-bold text-sm sm:text-base text-slate-800">
                        {quest.title}
                      </h4>
                      {quest.completed && !quest.claimed && (
                        <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold">
                          Hoàn Thành!
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{quest.description}</p>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (quest.current / quest.target) * 100)}%`
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 font-semibold mt-1 inline-block">
                      Tiến độ: {quest.current}/{quest.target}
                    </span>
                  </div>

                  {/* Reward & Claim Button */}
                  <div className="flex items-center gap-2">
                    <div className="text-right text-xs font-fredoka font-bold">
                      <div className="text-amber-700">+{quest.rewardCoins} 🪙</div>
                      <div className="text-purple-700">+{quest.rewardGems} 💎</div>
                    </div>

                    {quest.claimed ? (
                      <span className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-xl text-xs font-bold font-fredoka">
                        Đã Nhận
                      </span>
                    ) : quest.completed ? (
                      <button
                        onClick={() => claimQuestReward(quest.id)}
                        className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold font-fredoka shadow-md animate-bounce"
                      >
                        Nhận Quà
                      </button>
                    ) : (
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-400 rounded-xl text-xs font-semibold">
                        Chưa xong
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
