import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { AvatarDisplay } from './AvatarDisplay';
import {
  Coins,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Music,
  Trophy,
  ShoppingBag,
  Map,
  FileText,
  Gift,
  HelpCircle,
  Edit3,
  Zap,
  Settings,
  X,
  Check,
  Calculator,
  UserCheck,
  GraduationCap,
  ArrowLeft,
  Gamepad2,
  ExternalLink
} from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NavbarProps {
  onOpenDailyModal: () => void;
  onOpenCustomModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDailyModal, onOpenCustomModal }) => {
  const {
    profile,
    currentMode,
    setCurrentMode,
    toggleSound,
    toggleMusic,
    updateProfileName,
    updateGrade
  } = useGame();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profile.name);
  const [editGrade, setEditGrade] = useState(profile.grade);

  const today = new Date().toISOString().split('T')[0];
  const hasUnclaimedDailyReward = profile.lastDailyRewardClaimDate !== today;

  // Calculate RPG Level and XP
  const totalStars = Object.values(profile.levelProgress).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );
  const totalXp = totalStars * 40 + (profile.totalQuestionsSolved || 0) * 15;
  const currentLevel = Math.floor(totalXp / 120) + 1;
  const xpInCurrentLevel = totalXp % 120;
  const xpPercent = Math.min(100, Math.round((xpInCurrentLevel / 120) * 100));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileName(editName);
    updateGrade(editGrade);
    setIsEditingProfile(false);
    soundManager.playClick();
  };

  const navItems = [
    { id: 'world_map', label: 'Bản Đồ', icon: Map, color: 'game-btn-green' },
    { id: 'quick_play', label: 'Chơi Nhanh ⚡', icon: Zap, color: 'game-btn-gold' },
    { id: 'worksheet_play', label: 'Phiếu Mê Cung', icon: FileText, color: 'game-btn-blue' },
    { id: 'shop', label: 'Cửa Hàng', icon: ShoppingBag, color: 'game-btn-rose' },
    { id: 'leaderboard', label: 'Xếp Hạng', icon: Trophy, color: 'game-btn-gold' },
    { id: 'teacher_studio', label: 'Soạn Đề', icon: GraduationCap, color: 'teacher-studio-special' }
  ] as const;

  return (
    <>
      <header className="sticky top-0 z-40 bg-gradient-to-r from-amber-500 via-yellow-400 to-orange-500 text-slate-900 shadow-lg border-b-3 border-amber-700 px-2 sm:px-4 py-1.5 sm:py-2 select-none">
        {/* CenStu Top Bar: Back to Game Store + Branding */}
        <div className="max-w-7xl mx-auto mb-1.5 pb-1 border-b border-amber-600/30 flex items-center justify-between gap-2 text-xs">
          <a
            id="btn-back-to-censtu-store"
            href="https://game.censtu.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-amber-950/80 hover:bg-amber-950 text-amber-100 hover:text-white px-2.5 py-1 rounded-lg font-fredoka font-bold text-[11px] sm:text-xs transition-all border border-amber-400/40 hover:scale-105 active:scale-95 shadow-xs group"
            title="Quay lại kho game học tập tại game.censtu.com"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-300 group-hover:-translate-x-0.5 transition-transform" />
            <Gamepad2 className="w-3.5 h-3.5 text-yellow-300" />
            <span>Kho Game CenStu</span>
            <ExternalLink className="w-3 h-3 text-amber-300/80 opacity-70 group-hover:opacity-100" />
          </a>

          <div className="flex items-center gap-1 text-[11px] sm:text-xs font-bold text-amber-950/90">
            <span className="hidden xs:inline">Game được phát triển bởi</span>
            <a
              href="https://censtu.com"
              target="_blank"
              rel="noopener noreferrer"
              className="font-black text-purple-950 hover:text-purple-800 bg-white/70 hover:bg-white px-2 py-0.5 rounded-md border border-amber-400/60 shadow-2xs inline-flex items-center gap-1 transition-colors"
              title="Truy cập CenStu.com"
            >
              <span>CenStu.com</span>
              <Sparkles className="w-3 h-3 text-amber-600" />
            </a>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-3 flex-nowrap">
          
          {/* Left: Player Avatar, Level & Daily Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              id="btn-edit-profile"
              onClick={() => {
                setEditName(profile.name);
                setEditGrade(profile.grade);
                setIsEditingProfile(true);
                soundManager.playClick();
              }}
              className="flex items-center gap-1.5 sm:gap-2 bg-white/95 hover:bg-white px-2 py-1.5 sm:px-2.5 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-xs border-2 border-amber-400 transition-transform active:scale-95 group text-left cursor-pointer overflow-visible"
              title="Nhấn để đổi tên và khối lớp"
            >
              <div className="relative shrink-0 overflow-visible">
                <AvatarDisplay customization={profile.customization} size="sm" showPet={false} animate={false} />
                <span className="absolute -bottom-1 -right-1 z-20 bg-gradient-to-r from-amber-600 to-orange-600 text-white font-fredoka font-black text-[9px] px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm ring-1 ring-amber-400 leading-none">
                  Lv.{currentLevel}
                </span>
              </div>
              <div className="flex flex-col min-w-[70px] sm:min-w-[100px]">
                <div className="flex items-center justify-between gap-1 font-fredoka font-bold text-xs text-slate-800 leading-tight">
                  <span className="truncate max-w-[65px] sm:max-w-[95px]">{profile.name}</span>
                  <Edit3 className="w-2.5 h-2.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline" />
                </div>
                {/* XP Bar in HUD */}
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-0.5 overflow-hidden border border-slate-300">
                  <div
                    className="bg-gradient-to-r from-emerald-400 to-teal-500 h-full rounded-full transition-all duration-300"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-[9px] font-bold text-amber-900">
                  <span>Lớp {profile.grade}</span>
                  <span className="text-emerald-700 hidden sm:inline">{xpPercent}%</span>
                </div>
              </div>
            </button>

            {/* Daily Streak Badge */}
            <div className="hidden xs:flex items-center gap-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-fredoka font-black text-[11px] sm:text-xs px-2 py-1 rounded-xl shadow-xs border border-red-300">
              <Flame className="w-3.5 h-3.5 text-yellow-200 fill-yellow-200 animate-bounce" />
              <span>{profile.streakDays}N</span>
            </div>
          </div>

          {/* Center: Star Vault, Coins, Gems & Daily Gift Button */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Golden Star Pouch */}
            <div
              className="flex items-center gap-1 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-500 text-amber-950 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl font-fredoka font-black text-xs sm:text-sm border-2 border-yellow-200 shadow-xs"
              title={`Tổng số sao: ${totalStars} ⭐`}
            >
              <span className="text-sm sm:text-base filter drop-shadow-xs animate-wiggle">⭐</span>
              <span className="font-black">{totalStars}</span>
            </div>

            {/* Coins Pouch */}
            <div className="flex items-center gap-1 bg-amber-900/80 text-amber-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl font-fredoka font-black text-xs sm:text-sm border border-amber-400 shadow-inner">
              <span className="text-xs sm:text-sm animate-coin-spin">🪙</span>
              <span className="text-amber-100">{profile.coins.toLocaleString()}</span>
            </div>

            {/* Gems Pouch */}
            <div className="hidden sm:flex items-center gap-1 bg-purple-950/80 text-purple-200 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl font-fredoka font-black text-xs sm:text-sm border border-purple-400 shadow-inner">
              <span className="text-xs sm:text-sm animate-wiggle">💎</span>
              <span className="text-cyan-100">{profile.gems}</span>
            </div>

            {/* Daily Gift Box Loot Button */}
            <button
              id="btn-daily-rewards"
              onClick={() => {
                soundManager.playClick();
                onOpenDailyModal();
              }}
              className="relative flex items-center gap-1 game-btn-rose font-fredoka font-black text-[11px] sm:text-xs px-2.5 py-1 rounded-xl cursor-pointer shadow-xs"
            >
              <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-wiggle" />
              <span className="hidden sm:inline">Quà</span>
              {hasUnclaimedDailyReward && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-300 rounded-full border-2 border-white animate-ping" />
              )}
            </button>
          </div>

          {/* Right: Consolidated Settings ⚙️ Button */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              id="btn-settings-toggle"
              onClick={() => {
                soundManager.playClick();
                setIsSettingsOpen(true);
              }}
              className="flex items-center gap-1.5 bg-white/90 hover:bg-white text-slate-800 hover:text-amber-950 font-fredoka font-black text-xs sm:text-sm px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl shadow-xs border-2 border-amber-400 active:scale-95 transition-all cursor-pointer group"
              title="Cài đặt âm thanh, nhạc nền & Tự chọn phép tính"
            >
              <Settings className="w-4 h-4 text-amber-700 group-hover:rotate-45 transition-transform" />
              <span className="hidden md:inline">Cài Đặt</span>
            </button>
          </div>

        </div>

        {/* Sub-Navigation: Arcade 3D Game Tabs (Ultra Compact for Tablets & Mobile) */}
        <div className="max-w-7xl mx-auto mt-1 pt-1 border-t border-amber-600/30 flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;
            const isTeacherStudio = item.id === 'teacher_studio';

            if (isTeacherStudio) {
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentMode(item.id);
                  }}
                  className={`flex items-center gap-1.5 font-fredoka font-black text-[11px] sm:text-xs rounded-full px-3 sm:px-3.5 py-1 sm:py-1 transition-all whitespace-nowrap cursor-pointer ml-1 sm:ml-2 shadow-xs ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-800 via-indigo-700 to-purple-900 text-white border-2 border-amber-300 ring-2 ring-purple-400/80 scale-105 shadow-md'
                      : 'bg-purple-950/30 hover:bg-purple-900/60 text-purple-950 hover:text-white border-2 border-dashed border-purple-800/60 hover:border-purple-300'
                  }`}
                  title="Soạn Đề Mê Cung & Xuất Bản Bài Học Dành Cho Giáo Viên"
                >
                  <div className={`p-0.5 rounded-full ${isActive ? 'bg-amber-400 text-amber-950' : 'bg-purple-900/50 text-amber-200'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span>{item.label}</span>
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
                    isActive ? 'bg-amber-300 text-purple-950' : 'bg-purple-900/60 text-amber-300 border border-purple-700/50'
                  }`}>
                    GV
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                id={`nav-tab-${item.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setCurrentMode(item.id);
                }}
                className={`flex items-center gap-1.5 font-fredoka font-black text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? `${item.color} scale-102 ring-2 ring-white shadow-xs`
                    : 'bg-amber-950/20 hover:bg-amber-950/30 text-amber-950 border border-amber-600/20'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* ⚙️ UNIFIED SETTINGS MODAL (ÂM THANH, NHẠC, TỰ CHỌN PHÉP TÍNH, HỒ SƠ)        */}
      {/* ========================================================================= */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-3 sm:p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-3.5 sm:p-4 text-slate-950 flex items-center justify-between border-b-3 border-amber-600">
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-yellow-200 fill-amber-700 animate-spin-slow" />
                <h2 className="font-fredoka font-black text-lg sm:text-xl text-white drop-shadow-xs">
                  CÀI ĐẶT & TÙY CHỈNH
                </h2>
              </div>
              <button
                id="btn-close-settings"
                onClick={() => {
                  soundManager.playClick();
                  setIsSettingsOpen(false);
                }}
                className="p-1.5 bg-white/80 hover:bg-white text-slate-800 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Options */}
            <div className="p-4 sm:p-5 space-y-3.5 font-fredoka">
              
              {/* Option 1: Sound FX Toggle */}
              <div className="flex items-center justify-between p-3 bg-amber-50/80 rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${profile.soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                    {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">Hiệu Ứng Âm Thanh</h4>
                    <p className="text-xs text-slate-500 font-medium">Tiếng bước chân, tiếng giải đúng và mở hòm</p>
                  </div>
                </div>

                <button
                  id="btn-modal-toggle-sound"
                  onClick={() => {
                    toggleSound();
                    soundManager.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                    profile.soundEnabled
                      ? 'bg-emerald-500 border-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 border-slate-300 text-slate-600'
                  }`}
                >
                  {profile.soundEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>

              {/* Option 2: Music Toggle */}
              <div className="flex items-center justify-between p-3 bg-amber-50/80 rounded-2xl border-2 border-amber-200 hover:border-amber-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2.5 rounded-xl ${profile.musicEnabled ? 'bg-purple-100 text-purple-700' : 'bg-slate-200 text-slate-500'}`}>
                    <Music className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm sm:text-base text-slate-900">Nhạc Nền Phiêu Lưu</h4>
                    <p className="text-xs text-slate-500 font-medium">Giai điệu vui tươi khi làm nhiệm vụ</p>
                  </div>
                </div>

                <button
                  id="btn-modal-toggle-music"
                  onClick={() => {
                    toggleMusic();
                    soundManager.playClick();
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-bold text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                    profile.musicEnabled
                      ? 'bg-purple-500 border-purple-600 text-white shadow-xs'
                      : 'bg-slate-200 border-slate-300 text-slate-600'
                  }`}
                >
                  {profile.musicEnabled ? 'ĐANG BẬT' : 'ĐÃ TẮT'}
                </button>
              </div>

              {/* Option 3: Custom Practice Sandbox */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
                      <Calculator className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">Tự Chọn Phép Tính</h4>
                      <p className="text-xs text-slate-500 font-medium">Luyện tập tùy ý (+, -, ×, ÷) theo phạm vi số</p>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-modal-custom-practice"
                  onClick={() => {
                    soundManager.playClick();
                    setIsSettingsOpen(false);
                    onOpenCustomModal();
                  }}
                  className="w-full py-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mở Bảng Tự Chọn Phép Tính 🎯</span>
                </button>
              </div>

              {/* Option 3.5: Teacher Studio Shortcut */}
              <div className="p-3.5 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-300">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-amber-200 text-amber-900 rounded-xl">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-slate-900">Studio Soạn Đề Giáo Viên</h4>
                      <p className="text-xs text-slate-500 font-medium">Tạo kịch bản bài dạy, nhập/xuất JSON câu hỏi</p>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-modal-teacher-studio"
                  onClick={() => {
                    soundManager.playClick();
                    setIsSettingsOpen(false);
                    setCurrentMode('teacher_studio');
                  }}
                  className="w-full py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-black text-xs sm:text-sm shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Mở Studio Soạn Đề & Kịch Bản 🎓</span>
                </button>
              </div>

              {/* Option 4: Quick Profile Edit Shortcut */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border-2 border-slate-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900">Hồ Sơ: {profile.name} (Lớp {profile.grade})</h4>
                    <p className="text-[11px] text-slate-500 font-medium">Đổi tên nhân vật & chọn khối lớp</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsSettingsOpen(false);
                    setEditName(profile.name);
                    setEditGrade(profile.grade);
                    setIsEditingProfile(true);
                  }}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-bold text-xs border border-amber-500 transition-colors cursor-pointer"
                >
                  Đổi Tên
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 bg-amber-50/70 border-t border-amber-200 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-600 font-bold">
                <span>Phát triển bởi</span>
                <a
                  href="https://censtu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-900 hover:text-amber-700 underline font-black"
                >
                  CenStu.com
                </a>
              </div>

              <div className="flex items-center gap-2">
                <a
                  href="https://game.censtu.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-950 rounded-xl font-bold text-xs border border-amber-300 transition-colors inline-flex items-center gap-1"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-amber-700" />
                  <span>Kho Game</span>
                </a>

                <button
                  onClick={() => {
                    soundManager.playClick();
                    setIsSettingsOpen(false);
                  }}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-fredoka font-bold text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Profile Edit Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-amber-400 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="font-fredoka text-xl font-bold text-slate-800 mb-4 text-center">
              ✏️ Hồ Sơ Của Em
            </h3>

            <div className="flex justify-center mb-4">
              <AvatarDisplay customization={profile.customization} size="lg" />
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Tên của em
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  maxLength={20}
                  className="w-full px-3 py-2 border-2 border-amber-300 rounded-xl font-semibold focus:outline-hidden focus:border-amber-500"
                  placeholder="Nhập tên của em..."
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Khối Lớp
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {([1, 2, 3, 4, 5] as const).map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setEditGrade(g)}
                      className={`py-2 rounded-xl font-fredoka font-bold text-sm border-2 transition-all ${
                        editGrade === g
                          ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-sm scale-105'
                          : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold text-sm transition-colors cursor-pointer"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors cursor-pointer"
                >
                  Lưu Lại
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

