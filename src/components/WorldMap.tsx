import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { CAMPAIGN_WORLDS } from '../data/campaignData';
import { soundManager } from '../utils/audio';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Star,
  Lock,
  Play,
  CheckCircle2,
  Target,
  BarChart3,
  X,
  Sparkles,
  Flame,
  Check,
  Compass,
  Ship,
  Flag,
  ChevronRight,
  ShieldAlert,
  Crown,
  Trophy,
  Swords,
  Scroll
} from 'lucide-react';
import { WorldInfo } from '../types';

interface LandCoordinate {
  worldId: string;
  x: number; // percentage 0-100 on map
  y: number; // percentage 0-100 on map
  stageNumber: number;
  label: string;
  islandType: 'jungle' | 'canyon' | 'scroll' | 'pirate' | 'measurement' | 'scale' | 'forest' | 'treasure';
  icon: string;
}

const LAND_COORDINATES: LandCoordinate[] = [
  {
    worldId: 'world_addition',
    x: 72,
    y: 20,
    stageNumber: 1,
    label: 'Chặng 1: Rừng Phép Cộng',
    islandType: 'jungle',
    icon: '🌴'
  },
  {
    worldId: 'world_subtraction',
    x: 35,
    y: 18,
    stageNumber: 2,
    label: 'Chặng 2: Thung Lũng Phép Trừ',
    islandType: 'canyon',
    icon: '🏜️'
  },
  {
    worldId: 'world_word_problems',
    x: 18,
    y: 45,
    stageNumber: 3,
    label: 'Chặng 3: Vùng Đất Lời Văn',
    islandType: 'scroll',
    icon: '📜'
  },
  {
    worldId: 'world_multiplication',
    x: 48,
    y: 42,
    stageNumber: 4,
    label: 'Chặng 4: Lâu Đài Phép Nhân',
    islandType: 'pirate',
    icon: '🏰'
  },
  {
    worldId: 'world_division',
    x: 75,
    y: 52,
    stageNumber: 5,
    label: 'Chặng 5: Đảo Hải Tặc Phép Chia',
    islandType: 'pirate',
    icon: '🏴‍☠️'
  },
  {
    worldId: 'world_measurement',
    x: 22,
    y: 75,
    stageNumber: 6,
    label: 'Chặng 6: Vương Quốc Đơn Vị Đo',
    islandType: 'measurement',
    icon: '📏'
  },
  {
    worldId: 'world_comparison',
    x: 52,
    y: 68,
    stageNumber: 7,
    label: 'Chặng 7: Thung Lũng So Sánh',
    islandType: 'scale',
    icon: '⚖️'
  },
  {
    worldId: 'world_pred_succ',
    x: 80,
    y: 80,
    stageNumber: 8,
    label: 'Chặng 8: Rừng Số Liền Trước/Sau',
    islandType: 'forest',
    icon: '🔢'
  },
  {
    worldId: 'world_galaxy',
    x: 48,
    y: 88,
    stageNumber: 9,
    label: 'Đích Đến: Kho Báu Hoàng Kim',
    islandType: 'treasure',
    icon: '👑'
  }
];

export const WorldMap: React.FC = () => {
  const {
    profile,
    quests,
    activeWorldId,
    setActiveWorldId,
    setActiveLevelId,
    setCurrentMode,
    claimQuestReward
  } = useGame();

  const [showQuests, setShowQuests] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [selectedWorldForModal, setSelectedWorldForModal] = useState<WorldInfo | null>(null);
  const [viewMode, setViewMode] = useState<'parchment' | 'list'>('parchment');

  // Calculate total stars collected across all levels
  const totalStars = Object.values(profile.levelProgress).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );
  const totalPossibleStars = CAMPAIGN_WORLDS.reduce((acc, w) => acc + w.levelsCount * 3, 0);
  const nextLockedWorld = CAMPAIGN_WORLDS.find(w => totalStars < w.requiredStars);

  const claimableQuestsCount = quests ? quests.filter(q => q.completed && !q.claimed).length : 0;

  const handleSelectLevel = (worldId: string, levelNum: number) => {
    soundManager.playClick();
    setActiveWorldId(worldId);
    setActiveLevelId(levelNum);
    setSelectedWorldForModal(null);
    setCurrentMode('maze_play');
  };

  const accuracy = profile.totalQuestionsSolved > 0
    ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsSolved) * 100)
    : 100;

  // Open the conquest modal for a specific land
  const handleOpenWorldConquest = (world: WorldInfo) => {
    soundManager.playClick();
    setActiveWorldId(world.id);
    setSelectedWorldForModal(world);
  };

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-3 select-none">
      {/* Top Pirate Adventure HUD & Quick Toggles */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-900 rounded-3xl px-3 py-2.5 sm:px-5 sm:py-3.5 text-amber-100 shadow-2xl border-3 border-amber-950 flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        {/* Left: Map Title & Total Stars */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3.5">
          <div className="flex items-center gap-1.5 sm:gap-2 bg-amber-950/70 backdrop-blur-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl sm:rounded-2xl border border-yellow-500/40 text-yellow-300 font-fredoka font-black text-xs sm:text-base shadow-inner">
            <Compass className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-amber-400 animate-spin-slow" />
            <span>CHINH PHỤC BẢN ĐỒ KHO BÁU</span>
          </div>

          {/* Prominent Golden Star Vault */}
          <div
            className="flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-400 text-amber-950 px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl sm:rounded-2xl border-2 border-yellow-200 shadow-lg ring-2 ring-yellow-500/50 font-fredoka font-black text-xs sm:text-sm animate-pulse-subtle"
            title={`Tổng số sao: ${totalStars} / ${totalPossibleStars} ⭐`}
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-amber-950 text-amber-950 drop-shadow-xs animate-wiggle" />
            <div className="flex items-center gap-1 leading-tight">
              <span className="text-xs sm:text-base font-black">{totalStars} / {totalPossibleStars}</span>
              <span className="text-[10px] sm:text-[11px] font-bold opacity-90">⭐ Thu Thập</span>
            </div>
          </div>

          {/* Next Unlock Milestone Indicator */}
          {nextLockedWorld ? (
            <div className="hidden lg:flex items-center gap-1.5 bg-amber-950/80 px-3 py-1 rounded-xl border border-amber-600/60 text-xs font-fredoka">
              <span className="text-yellow-400 font-bold">Mục tiêu:</span>
              <span className="text-amber-200 truncate max-w-[130px]">{nextLockedWorld.vietnameseName.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}</span>
              <span className="bg-rose-500/80 text-white text-[10px] font-black px-1.5 py-0.2 rounded-md">
                Thiếu {nextLockedWorld.requiredStars - totalStars} ⭐
              </span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1 bg-emerald-950/80 px-3 py-1 rounded-xl border border-emerald-500/60 text-xs font-fredoka text-emerald-300 font-bold">
              👑 Đã mở khóa tất cả các vùng đất!
            </div>
          )}

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-amber-950/60 p-1 rounded-xl border border-amber-700/50 text-xs font-fredoka">
            <button
              onClick={() => setViewMode('parchment')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'parchment'
                  ? 'bg-yellow-500 text-amber-950 shadow-xs'
                  : 'text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              📜 Hải Đồ
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-yellow-500 text-amber-950 shadow-xs'
                  : 'text-amber-300 hover:bg-amber-900/60'
              }`}
            >
              📋 Danh Sách
            </button>
          </div>
        </div>

        {/* Right: Quick Action Buttons (Toggles for Quests & Stats) */}
        <div className="flex items-center gap-2">
          {/* Daily Quests Toggle */}
          <button
            id="btn-toggle-quests"
            onClick={() => {
              soundManager.playClick();
              setShowQuests(prev => !prev);
              setShowStats(false);
            }}
            className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fredoka font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              showQuests
                ? 'bg-amber-100 text-amber-950 shadow-md ring-2 ring-yellow-400'
                : 'bg-amber-950/50 hover:bg-amber-950/80 text-yellow-200 border border-yellow-400/30'
            }`}
          >
            <Target className="w-4 h-4 text-rose-400" />
            <span>Nhiệm vụ</span>
            {claimableQuestsCount > 0 && (
              <span className="bg-rose-500 text-white font-fredoka font-black text-[10px] px-1.5 py-0.2 rounded-full animate-bounce shadow-md">
                +{claimableQuestsCount}
              </span>
            )}
          </button>

          {/* Stats Toggle */}
          <button
            id="btn-toggle-stats"
            onClick={() => {
              soundManager.playClick();
              setShowStats(prev => !prev);
              setShowQuests(false);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fredoka font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              showStats
                ? 'bg-amber-100 text-amber-950 shadow-md ring-2 ring-yellow-400'
                : 'bg-amber-950/50 hover:bg-amber-950/80 text-yellow-200 border border-yellow-400/30'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-cyan-300" />
            <span>Chiến tích</span>
          </button>
        </div>
      </div>

      {/* Quests Dropdown Drawer (Toggled) */}
      {showQuests && (
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xl border-3 border-amber-400 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
            <h3 className="font-fredoka font-black text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-rose-500" />
              <span>Nhiệm Vụ Hàng Ngày</span>
            </h3>
            <button
              onClick={() => setShowQuests(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {quests && quests.map(quest => {
              const progressPct = Math.min(100, Math.round((quest.current / quest.target) * 100));
              const canClaim = quest.completed && !quest.claimed;

              return (
                <div
                  key={quest.id}
                  className={`p-2.5 rounded-xl border-2 flex flex-col justify-between ${
                    quest.claimed
                      ? 'bg-slate-50 border-slate-200 opacity-70'
                      : quest.completed
                      ? 'bg-emerald-50/80 border-emerald-400 shadow-xs'
                      : 'bg-amber-50/50 border-amber-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-fredoka font-bold text-xs text-slate-900 truncate">
                      {quest.title}
                    </span>
                    <span className="text-[11px] font-fredoka font-bold text-amber-800">
                      {quest.current}/{quest.target}
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mb-2">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="text-[11px] font-fredoka font-black text-amber-700">
                      +{quest.rewardCoins} 🪙 {quest.rewardGems > 0 ? `+${quest.rewardGems} 💎` : ''}
                    </div>

                    {canClaim ? (
                      <button
                        id={`btn-claim-quest-${quest.id}`}
                        onClick={() => {
                          soundManager.playCoin();
                          claimQuestReward(quest.id);
                        }}
                        className="game-btn-green font-fredoka font-black text-[11px] px-2.5 py-0.5 rounded-lg cursor-pointer"
                      >
                        Nhận 🎁
                      </button>
                    ) : quest.claimed ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Đã nhận
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-slate-400">Chưa xong</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Stats Dropdown Drawer (Toggled) */}
      {showStats && (
        <div className="bg-white rounded-2xl p-3.5 sm:p-4 shadow-xl border-3 border-amber-400 animate-in fade-in duration-150">
          <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-100">
            <h3 className="font-fredoka font-black text-sm sm:text-base text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-cyan-600" />
              <span>Chỉ Số Chiến Tích</span>
            </h3>
            <button
              onClick={() => setShowStats(false)}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Đã Giải Đúng</span>
              <span className="font-fredoka font-black text-lg text-amber-900">
                {profile.totalCorrectAnswers} bài
              </span>
            </div>
            <div className="bg-emerald-50 p-2.5 rounded-xl border border-emerald-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Độ Chính Xác</span>
              <span className="font-fredoka font-black text-lg text-emerald-700">
                {accuracy}%
              </span>
            </div>
            <div className="bg-purple-50 p-2.5 rounded-xl border border-purple-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Mê Cung Vượt Qua</span>
              <span className="font-fredoka font-black text-lg text-purple-900">
                {profile.completedMazesCount} màn
              </span>
            </div>
            <div className="bg-orange-50 p-2.5 rounded-xl border border-orange-200 text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Chuỗi Ngày</span>
              <span className="font-fredoka font-black text-lg text-orange-600 flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                {profile.streakDays} ngày
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📜 MODE 1: PARCHMENT TREASURE MAP VIEW (Matching Uploaded Image)          */}
      {/* ========================================================================= */}
      {viewMode === 'parchment' && (
        <div className="relative w-full overflow-hidden p-1 sm:p-3 bg-amber-950/20 rounded-3xl border-4 border-amber-900/40 shadow-2xl space-y-2">
          
          {/* Mobile Swiping Hint Bar */}
          <div className="flex md:hidden items-center justify-between px-3 py-1.5 bg-amber-950/80 border border-amber-500/40 rounded-xl text-xs text-amber-200 font-fredoka shadow-inner">
            <span className="flex items-center gap-1.5">
              <span>👉</span>
              <span className="font-bold">Vuốt ngang để xem toàn bộ hải đồ</span>
              <span>↔️</span>
            </span>
            <button
              onClick={() => setViewMode('list')}
              className="text-yellow-400 font-black underline hover:text-yellow-300 cursor-pointer"
            >
              📋 Danh Sách
            </button>
          </div>

          {/* Horizontally Scrollable Map Wrapper on Small Phones */}
          <div className="w-full overflow-x-auto overflow-y-hidden rounded-2xl pb-1 touch-pan-x">
            {/* Outer Ancient Rolled Scroll Frame with Minimum Width for Breathable Islands */}
            <div className="relative min-w-[720px] md:min-w-full aspect-[16/10] bg-[#fdf6e2] rounded-2xl border-4 border-[#c29b62] shadow-2xl overflow-hidden select-none">
              
              {/* Scroll Rolled Left & Right Border Visuals */}
              <div className="absolute top-0 bottom-0 left-0 w-8 sm:w-12 bg-gradient-to-r from-[#d4a86a] via-[#f7e6c4] to-[#ebd29f] border-r-3 border-[#ab8147] shadow-xl z-10 pointer-events-none opacity-90" />
              <div className="absolute top-0 bottom-0 right-0 w-8 sm:w-12 bg-gradient-to-l from-[#d4a86a] via-[#f7e6c4] to-[#ebd29f] border-l-3 border-[#ab8147] shadow-xl z-10 pointer-events-none opacity-90" />

              {/* Parchment Textured SVG Background: Archipelago Islands, Water Waves, Ships, Sharks */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 1000 650"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Paper Texture Overlay & Vintage Map Contours */}
                <rect width="1000" height="650" fill="#faeed1" />
                
                {/* Soft Oceanic Topographic Curves */}
                <path d="M 50 120 Q 250 80 450 140 T 950 100" stroke="#ebd29f" strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M 50 320 Q 300 280 600 340 T 950 300" stroke="#ebd29f" strokeWidth="3" fill="none" opacity="0.6" />
                <path d="M 50 520 Q 350 480 700 540 T 950 500" stroke="#ebd29f" strokeWidth="3" fill="none" opacity="0.6" />

                {/* Island Landmass Shapes (Archipelago) */}
                {/* Island 1 (Top-Right): Rừng Phép Cộng */}
                <path d="M 640 90 Q 760 60 840 120 Q 880 180 810 240 Q 710 260 660 190 Z" fill="#edd6a4" stroke="#c89f5d" strokeWidth="4" />
                {/* Island 2 (Top-Left/Center): Thung Lũng Phép Trừ */}
                <path d="M 260 80 Q 400 70 450 140 Q 420 220 330 230 Q 230 200 260 80 Z" fill="#e8cf9b" stroke="#c89f5d" strokeWidth="4" />
                {/* Island 3 (Center-Left): Vùng Đất Lời Văn */}
                <path d="M 120 280 Q 260 260 280 360 Q 250 440 160 430 Q 90 380 120 280 Z" fill="#f0dbad" stroke="#c89f5d" strokeWidth="4" />
                {/* Island 4 & 5 (Center Archipelago): Lâu Đài & Đảo Hải Tặc */}
                <path d="M 400 270 Q 560 240 620 340 Q 580 440 450 450 Q 360 380 400 270 Z" fill="#e5cb93" stroke="#c89f5d" strokeWidth="4" />
                <path d="M 680 320 Q 820 300 850 400 Q 800 480 710 470 Q 640 420 680 320 Z" fill="#edd6a4" stroke="#c89f5d" strokeWidth="4" />
                {/* Island 6 & 7 (Bottom Islands): Vương Quốc Đo Lường & So Sánh */}
                <path d="M 140 480 Q 280 460 300 560 Q 240 620 150 590 Q 100 540 140 480 Z" fill="#ebd29f" stroke="#c89f5d" strokeWidth="4" />
                <path d="M 680 500 Q 840 480 860 590 Q 780 640 700 620 Q 640 560 680 500 Z" fill="#ebd29f" stroke="#c89f5d" strokeWidth="4" />
                {/* Central Treasure Island (Bottom Center): Kho Báu Hoàng Kim */}
                <path d="M 380 490 Q 580 470 600 590 Q 540 640 420 630 Q 340 570 380 490 Z" fill="#f3dfb3" stroke="#c89f5d" strokeWidth="5" />

                {/* Red Dashed Voyage Line connecting the expedition stages */}
                <path
                  d="M 720 180 Q 550 140 370 170 Q 230 280 200 370 Q 320 350 490 350 Q 650 380 750 420 Q 580 470 250 520 Q 420 540 500 570"
                  stroke="#dc2626"
                  strokeWidth="4"
                  strokeDasharray="9 9"
                  fill="none"
                />

                {/* Swimming Shark Graphic in ocean waters */}
                <g transform="translate(360, 95) scale(0.9)">
                  <path d="M 0 15 Q 25 -5 60 10 Q 50 25 35 25 Q 15 30 0 15 Z" fill="#60a5fa" />
                  <path d="M 25 5 L 35 -15 L 42 7 Z" fill="#3b82f6" />
                  <circle cx="12" cy="12" r="2" fill="#1e293b" />
                </g>
                <g transform="translate(610, 350) scale(0.75)">
                  <path d="M 0 15 Q 25 -5 60 10 Q 50 25 35 25 Q 15 30 0 15 Z" fill="#60a5fa" />
                  <path d="M 25 5 L 35 -15 L 42 7 Z" fill="#3b82f6" />
                  <circle cx="12" cy="12" r="2" fill="#1e293b" />
                </g>

                {/* Sailing Pirate Ships on the ocean */}
                <g transform="translate(510, 240) scale(0.85)">
                  {/* Ship Hull */}
                  <path d="M 0 25 Q 25 40 55 25 L 45 45 Q 20 48 5 45 Z" fill="#854d0e" stroke="#583101" strokeWidth="2" />
                  {/* Masts & Sails */}
                  <line x1="25" y1="5" x2="25" y2="40" stroke="#583101" strokeWidth="3" />
                  <path d="M 25 8 Q 45 15 25 25 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  {/* Pirate Flag */}
                  <path d="M 25 5 L 12 0 L 25 -3 Z" fill="#1e293b" />
                </g>
                <g transform="translate(730, 370) scale(0.7)">
                  <path d="M 0 25 Q 25 40 55 25 L 45 45 Q 20 48 5 45 Z" fill="#854d0e" stroke="#583101" strokeWidth="2" />
                  <line x1="25" y1="5" x2="25" y2="40" stroke="#583101" strokeWidth="3" />
                  <path d="M 25 8 Q 45 15 25 25 Z" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
                  <path d="M 25 5 L 12 0 L 25 -3 Z" fill="#1e293b" />
                </g>

                {/* Nautical Compass Rose at Bottom Right */}
                <g transform="translate(860, 520) scale(1.1)">
                  <circle cx="0" cy="0" r="40" stroke="#b48c48" strokeWidth="2" fill="none" opacity="0.7" />
                  <circle cx="0" cy="0" r="32" stroke="#b48c48" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.6" />
                  {/* 8-pointed star */}
                  <polygon points="0,-35 8,-8 35,0 8,8 0,35 -8,8 -35,0 -8,-8" fill="#c69f53" stroke="#8c621d" strokeWidth="1.5" />
                  <polygon points="0,-35 0,0 35,0" fill="#9a6e21" />
                  <polygon points="0,35 0,0 -35,0" fill="#9a6e21" />
                  <text x="-4" y="-38" fontSize="11" fontWeight="bold" fill="#71480c" fontFamily="Fredoka">N</text>
                  <text x="38" y="4" fontSize="11" fontWeight="bold" fill="#71480c" fontFamily="Fredoka">E</text>
                  <text x="-4" y="48" fontSize="11" fontWeight="bold" fill="#71480c" fontFamily="Fredoka">S</text>
                  <text x="-48" y="4" fontSize="11" fontWeight="bold" fill="#71480c" fontFamily="Fredoka">W</text>
                </g>
              </svg>

              {/* Interactive Clickable Land Hotspots overlaid on the Map */}
              {LAND_COORDINATES.map((land) => {
                const world = CAMPAIGN_WORLDS.find(w => w.id === land.worldId) || CAMPAIGN_WORLDS[0];
                const isUnlocked = totalStars >= world.requiredStars;
                const isSelected = activeWorldId === world.id;

                // Calculate stars & progress in this world
                let worldStars = 0;
                let completedLevels = 0;
                for (let l = 1; l <= world.levelsCount; l++) {
                  const lvl = profile.levelProgress[`${world.id}_${l}`];
                  worldStars += lvl?.stars || 0;
                  if (lvl?.completed) completedLevels++;
                }
                const isFullyConquered = completedLevels >= world.levelsCount;
                const isCurrentlyExploring = isUnlocked && !isFullyConquered;

                return (
                  <div
                    key={land.worldId}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 group-hover:z-20 flex flex-col items-center group cursor-pointer"
                    style={{
                      left: `${land.x}%`,
                      top: `${land.y}%`
                    }}
                    onClick={() => handleOpenWorldConquest(world)}
                  >
                    {/* Pirate Flag / Standing Character when Conquered or Exploring */}
                    {isFullyConquered ? (
                      <div className="flex flex-col items-center -mb-1 animate-bounce-subtle">
                        <div className="bg-slate-950 text-yellow-300 border-2 border-yellow-500 rounded-xl px-2 py-0.5 text-[9px] sm:text-[11px] font-fredoka font-black shadow-md flex items-center gap-1 whitespace-nowrap">
                          <span>🚩 Chặng {land.stageNumber}</span>
                          <span className="text-yellow-400 font-bold bg-amber-900/60 px-1 rounded-md">{worldStars}⭐</span>
                        </div>
                        <div className="text-xl sm:text-2xl filter drop-shadow-md">🏴‍☠️</div>
                      </div>
                    ) : isCurrentlyExploring ? (
                      <div className="flex flex-col items-center -mb-1">
                        {/* Avatar standing on current quest line */}
                        <div className="relative flex flex-col items-center animate-bounce">
                          <span className="bg-rose-600 text-white font-fredoka font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md whitespace-nowrap border border-white">
                            ⚔️ Đang khám phá ({completedLevels}/{world.levelsCount})
                          </span>
                          <div className="scale-75 sm:scale-90 -my-1">
                            <AvatarDisplay customization={profile.customization} size="sm" showPet={false} animate={false} />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center -mb-1">
                        <span className="bg-gradient-to-r from-red-700 via-rose-700 to-amber-800 text-yellow-200 font-fredoka font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md border border-yellow-400/80 flex items-center gap-1 whitespace-nowrap">
                          <Lock className="w-2.5 h-2.5 text-yellow-300" />
                          <span>Cần {world.requiredStars} ⭐</span>
                        </span>
                      </div>
                    )}

                    {/* Main Land Island Badge Button */}
                    <button
                      id={`btn-land-${land.worldId}`}
                      className={`relative p-2 sm:p-2.5 rounded-2xl font-fredoka transition-all flex flex-col items-center shadow-lg border-2 sm:border-3 group-hover:scale-105 active:scale-95 ${
                        !isUnlocked
                          ? 'bg-[#e2d0a8]/90 border-[#a88a56] text-slate-700 opacity-90 hover:opacity-100'
                          : isFullyConquered
                          ? 'bg-gradient-to-b from-amber-100 to-yellow-200 border-amber-600 text-amber-950 ring-2 ring-yellow-400'
                          : 'bg-gradient-to-b from-white to-amber-50 border-amber-600 text-slate-900 ring-2 ring-rose-400 animate-pulse-subtle'
                      }`}
                    >
                      {/* Land Icon */}
                      <span className="text-2xl sm:text-3xl filter drop-shadow-sm mb-0.5">
                        {land.icon}
                      </span>

                      {/* Land Title Banner */}
                      <span className="font-black text-[10px] sm:text-xs text-center max-w-[85px] sm:max-w-[120px] leading-tight text-slate-900 line-clamp-2">
                        {world.vietnameseName.replace(/[\u{1F300}-\u{1F9FF}]/gu, '')}
                      </span>

                      {/* Star Badge */}
                      {isUnlocked ? (
                        <div className="mt-1 flex items-center gap-1 bg-amber-950/15 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black text-amber-950 border border-amber-600/30">
                          <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-yellow-500 text-yellow-500" />
                          <span>{worldStars}/{world.levelsCount * 3} ⭐</span>
                        </div>
                      ) : (
                        <div className="mt-1 flex items-center gap-1 bg-red-950/20 px-1.5 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black text-red-900 border border-red-500/30">
                          <Lock className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-red-700" />
                          <span>{totalStars}/{world.requiredStars}⭐</span>
                        </div>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Map Helper Callout */}
          <div className="bg-amber-900/60 rounded-2xl px-3 py-1.5 text-center text-amber-200 font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-2">
            <span>🗺️ Nhấn vào từng vùng đất để mở các cửa ải và tiến hành xâm chiếm!</span>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 📋 MODE 2: CLASSIC LIST/GRID VIEW                                         */}
      {/* ========================================================================= */}
      {viewMode === 'list' && (
        <div className="space-y-3 sm:space-y-3.5">
          {CAMPAIGN_WORLDS.map(world => {
            const isUnlocked = totalStars >= world.requiredStars;
            const isSelected = activeWorldId === world.id;

            // Calculate world completed stars
            let worldStars = 0;
            let completedCount = 0;
            let highestUnlockedLevel = 1;

            for (let l = 1; l <= world.levelsCount; l++) {
              const key = `${world.id}_${l}`;
              const lvl = profile.levelProgress[key];
              worldStars += lvl?.stars || 0;
              if (lvl?.completed) {
                completedCount++;
                highestUnlockedLevel = Math.min(world.levelsCount, l + 1);
              }
            }

            return (
              <div
                key={world.id}
                className={`bg-white rounded-2xl p-3 sm:p-4 shadow-md border-3 transition-all ${
                  isSelected
                    ? `${world.borderTheme} ring-2 ring-amber-400 shadow-amber-100`
                    : 'border-slate-200 hover:border-amber-300'
                } ${!isUnlocked ? 'opacity-75 bg-slate-50/90' : ''}`}
              >
                {/* World Header */}
                <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-2xl border border-amber-300 shadow-xs shrink-0">
                      {world.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-fredoka font-black text-base sm:text-lg text-slate-900">
                          {world.vietnameseName}
                        </h2>
                        <span className="text-[11px] font-fredoka font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full border border-amber-200">
                          {world.recommendedGrade}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium line-clamp-1">{world.description}</p>
                    </div>
                  </div>

                  {/* Stars and Lock Progress */}
                  <div className="flex items-center gap-2">
                    {isUnlocked ? (
                      <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 px-3 py-1.5 rounded-xl font-fredoka font-black text-xs sm:text-sm text-amber-950 border border-amber-300 shadow-xs">
                        <Star className="w-4 h-4 text-yellow-600 fill-yellow-400" />
                        <span>{worldStars}/{world.levelsCount * 3} Sao</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 bg-rose-50 text-rose-800 px-3 py-1.5 rounded-xl text-xs font-black font-fredoka border border-rose-300 shadow-xs">
                        <Lock className="w-3.5 h-3.5 text-rose-600" />
                        <span>Cần {world.requiredStars} ⭐ (Thiếu {world.requiredStars - totalStars})</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Level Nodes Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5 sm:gap-2">
                  {Array.from({ length: world.levelsCount }).map((_, idx) => {
                    const levelNum = idx + 1;
                    const levelKey = `${world.id}_${levelNum}`;
                    const levelData = profile.levelProgress[levelKey];
                    const prevLevelKey = `${world.id}_${levelNum - 1}`;
                    const isLevelUnlocked =
                      isUnlocked &&
                      (levelNum === 1 || profile.levelProgress[prevLevelKey]?.completed || levelData?.completed);
                    const stars = levelData?.stars || 0;
                    const isBossLevel = levelNum === 10;
                    const isMiniBossLevel = levelNum === 5;

                    return (
                      <button
                        key={levelKey}
                        id={`btn-level-list-${world.id}-${levelNum}`}
                        disabled={!isLevelUnlocked}
                        onClick={() => handleSelectLevel(world.id, levelNum)}
                        className={`w-full group relative flex flex-col items-center justify-center p-2 rounded-xl font-fredoka transition-all border-2 cursor-pointer ${
                          !isLevelUnlocked
                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                            : levelData?.completed
                            ? 'game-btn-green text-white'
                            : isBossLevel
                            ? 'game-btn-purple text-white animate-pulse-subtle'
                            : 'game-btn-gold text-amber-950 animate-pulse-subtle'
                        }`}
                      >
                        <span className="font-black text-base leading-none">{levelNum}</span>
                        <div className="flex gap-0.5 my-0.5">
                          {[1, 2, 3].map(s => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= stars ? 'fill-yellow-200 text-yellow-100' : 'text-white/40'
                              }`}
                            />
                          ))}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚔️ INTERACTIVE CONQUEST GATES MODAL (BẢNG XÂM CHIẾM CỬA ẢI VÙNG ĐẤT)       */}
      {/* ========================================================================= */}
      {selectedWorldForModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-gradient-to-b from-white via-amber-50/50 to-white w-full max-w-2xl rounded-3xl border-4 border-amber-600 shadow-2xl p-4 sm:p-6 relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header Banner */}
            <div className="flex items-start justify-between gap-3 pb-3 mb-3 border-b-2 border-amber-200">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-md shrink-0">
                  {selectedWorldForModal.icon}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-fredoka font-black text-lg sm:text-2xl text-slate-900 truncate">
                      {selectedWorldForModal.vietnameseName}
                    </h3>
                    <span className="bg-amber-200 text-amber-950 text-xs font-fredoka font-bold px-2.5 py-0.5 rounded-full border border-amber-400">
                      {selectedWorldForModal.recommendedGrade}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-fredoka font-medium mt-0.5">
                    {selectedWorldForModal.description}
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="btn-close-conquest-modal"
                onClick={() => setSelectedWorldForModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-amber-100 transition-colors cursor-pointer shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Conquest Status Progress Bar */}
            {(() => {
              const world = selectedWorldForModal;
              const isUnlocked = totalStars >= world.requiredStars;
              let worldStars = 0;
              let completedCount = 0;
              let highestUnlockedLevel = 1;

              for (let l = 1; l <= world.levelsCount; l++) {
                const key = `${world.id}_${l}`;
                const lvl = profile.levelProgress[key];
                worldStars += lvl?.stars || 0;
                if (lvl?.completed) {
                  completedCount++;
                  highestUnlockedLevel = Math.min(world.levelsCount, l + 1);
                }
              }

              const progressPct = Math.round((completedCount / world.levelsCount) * 100);
              const unlockProgressPct = Math.min(100, Math.round((totalStars / world.requiredStars) * 100));

              return (
                <div className="space-y-4 overflow-y-auto pr-1">
                  {/* If Locked: Prominent Unlock Star Requirement Card */}
                  {!isUnlocked ? (
                    <div className="bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50 border-3 border-rose-400 rounded-2xl p-4 shadow-md space-y-3">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-2 text-rose-800 font-fredoka font-black text-base sm:text-lg">
                          <Lock className="w-5 h-5 text-rose-600 animate-bounce" />
                          <span>VÙNG ĐẤT CHƯA ĐƯỢC MỞ KHÓA</span>
                        </div>
                        <span className="bg-rose-600 text-white font-fredoka font-black text-xs px-3 py-1 rounded-full shadow-xs">
                          Cần thêm {world.requiredStars - totalStars} ⭐
                        </span>
                      </div>

                      {/* 3-Col Star Comparison */}
                      <div className="grid grid-cols-3 gap-2 text-center font-fredoka">
                        <div className="bg-white p-2.5 rounded-xl border-2 border-amber-300 shadow-xs">
                          <span className="text-[11px] text-slate-500 font-bold block">Sao Hiện Có</span>
                          <span className="text-base sm:text-lg font-black text-amber-900 flex items-center justify-center gap-1">
                            ⭐ {totalStars}
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border-2 border-rose-300 shadow-xs">
                          <span className="text-[11px] text-slate-500 font-bold block">Yêu Cầu Mở</span>
                          <span className="text-base sm:text-lg font-black text-rose-700 flex items-center justify-center gap-1">
                            🎯 {world.requiredStars} ⭐
                          </span>
                        </div>

                        <div className="bg-white p-2.5 rounded-xl border-2 border-orange-300 shadow-xs">
                          <span className="text-[11px] text-slate-500 font-bold block">Còn Thiếu</span>
                          <span className="text-base sm:text-lg font-black text-orange-600 flex items-center justify-center gap-1">
                            ⏳ {world.requiredStars - totalStars} ⭐
                          </span>
                        </div>
                      </div>

                      {/* Unlock Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-xs font-fredoka font-bold text-amber-950 mb-1">
                          <span>Tiến độ tích lũy sao mở khóa</span>
                          <span>{totalStars}/{world.requiredStars} ⭐ ({unlockProgressPct}%)</span>
                        </div>
                        <div className="w-full bg-slate-200 h-3 rounded-full overflow-hidden border border-slate-300">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-yellow-500 h-full rounded-full transition-all duration-300"
                            style={{ width: `${unlockProgressPct}%` }}
                          />
                        </div>
                      </div>

                      <p className="text-xs text-amber-900 font-medium bg-amber-100/80 p-2 rounded-xl border border-amber-300/80 leading-relaxed">
                        💡 <strong>Bí kíp:</strong> Hãy quay lại các vùng đất trước và vượt qua các ải với thành tích 3 sao trọn vẹn để gom đủ sao mở khóa vùng đất này nhé!
                      </p>
                    </div>
                  ) : (
                    /* Conquest Stats Card for Unlocked World */
                    <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-xs">
                      <div className="flex items-center gap-2">
                        <Swords className="w-5 h-5 text-rose-600" />
                        <span className="font-fredoka font-black text-sm sm:text-base text-amber-950">
                          Tiến độ xâm chiếm: {completedCount}/{world.levelsCount} Ải ({progressPct}%)
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 font-fredoka font-black text-xs sm:text-sm text-amber-950 bg-amber-200/90 px-3 py-1.5 rounded-xl border border-amber-400 shadow-xs">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-600 animate-wiggle" />
                          <span>{worldStars}/{world.levelsCount * 3} Sao Đạt Được</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Gates Grid (10-12 Cửa Ải Cần Vượt Qua) */}
                  <div>
                    <h4 className="font-fredoka font-black text-sm sm:text-base text-slate-800 mb-2.5 flex items-center gap-1.5">
                      <span>🏰 Các Cửa Ải Cần Vượt Qua:</span>
                    </h4>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                      {Array.from({ length: world.levelsCount }).map((_, idx) => {
                        const levelNum = idx + 1;
                        const levelKey = `${world.id}_${levelNum}`;
                        const levelData = profile.levelProgress[levelKey];
                        const prevLevelKey = `${world.id}_${levelNum - 1}`;
                        const isLevelUnlocked =
                          isUnlocked &&
                          (levelNum === 1 || profile.levelProgress[prevLevelKey]?.completed || levelData?.completed);
                        const stars = levelData?.stars || 0;
                        const isBoss = levelNum === world.levelsCount;
                        const isMiniBoss = levelNum === Math.floor(world.levelsCount / 2);
                        const isCurrent = isUnlocked && levelNum === highestUnlockedLevel && !levelData?.completed;

                        return (
                          <button
                            key={levelKey}
                            id={`btn-modal-gate-${levelNum}`}
                            disabled={!isLevelUnlocked}
                            onClick={() => handleSelectLevel(world.id, levelNum)}
                            className={`p-3 rounded-2xl font-fredoka border-3 transition-all flex flex-col items-center justify-between text-center relative cursor-pointer shadow-md ${
                              !isLevelUnlocked
                                ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60'
                                : levelData?.completed
                                ? 'game-btn-green text-white hover:scale-102'
                                : isCurrent
                                ? 'bg-gradient-to-b from-amber-300 to-yellow-400 border-amber-600 text-amber-950 ring-3 ring-amber-400 animate-pulse-subtle hover:scale-105'
                                : isBoss
                                ? 'game-btn-purple text-white hover:scale-102'
                                : 'game-btn-gold text-amber-950 hover:scale-102'
                            }`}
                          >
                            {/* Boss Badge */}
                            {isBoss && (
                              <span className="absolute -top-2.5 -right-1 bg-purple-950 text-yellow-300 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-yellow-400 shadow-xs flex items-center gap-0.5">
                                <Crown className="w-3 h-3" /> Đại Boss
                              </span>
                            )}
                            {isMiniBoss && !isBoss && (
                              <span className="absolute -top-2.5 -right-1 bg-amber-950 text-yellow-200 text-[10px] font-black px-1.5 py-0.2 rounded-full border border-amber-300 shadow-xs flex items-center gap-0.5">
                                🛡️ Trùm Phụ
                              </span>
                            )}

                            {/* Gate Number */}
                            <div className="font-black text-lg sm:text-xl">
                              Ải {levelNum}
                            </div>

                            {/* Stars Display */}
                            <div className="flex gap-1 my-1">
                              {[1, 2, 3].map(s => (
                                <Star
                                  key={s}
                                  className={`w-3.5 h-3.5 ${
                                    s <= stars
                                      ? 'fill-yellow-300 text-yellow-200 drop-shadow-xs'
                                      : isLevelUnlocked
                                      ? 'text-white/40'
                                      : 'text-slate-300'
                                  }`}
                                />
                              ))}
                            </div>

                            {/* Status text */}
                            <div className="text-[11px] font-bold mt-0.5">
                              {!isLevelUnlocked ? (
                                <span className="flex items-center gap-0.5 text-slate-400">
                                  <Lock className="w-3 h-3" /> Khóa
                                </span>
                              ) : levelData?.completed ? (
                                <span className="text-emerald-100 flex items-center gap-0.5">
                                  <Check className="w-3 h-3" /> Đã chiếm
                                </span>
                              ) : isCurrent ? (
                                <span className="text-amber-950 font-black flex items-center gap-0.5">
                                  <Play className="w-3 h-3 fill-amber-950" /> Chiến ngay
                                </span>
                              ) : (
                                <span className="text-amber-900">Mở</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Modal Action CTA */}
                  <div className="pt-2 flex items-center justify-between gap-3 border-t border-amber-200">
                    <button
                      onClick={() => setSelectedWorldForModal(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-fredoka font-bold text-xs sm:text-sm rounded-xl cursor-pointer"
                    >
                      Đóng
                    </button>

                    {isUnlocked && (
                      <button
                        id="btn-conquer-next-gate"
                        onClick={() => handleSelectLevel(world.id, highestUnlockedLevel)}
                        className="game-btn-green px-5 py-2.5 rounded-2xl font-fredoka font-black text-sm sm:text-base flex items-center gap-2 shadow-lg hover:scale-102 active:scale-95 cursor-pointer"
                      >
                        <Swords className="w-4 h-4" />
                        <span>Xâm Chiếm Ải Số {highestUnlockedLevel} ➔</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
};
