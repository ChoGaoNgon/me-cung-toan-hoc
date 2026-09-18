import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MOCK_CLASSMATES } from '../data/campaignData';
import { LeaderboardUser } from '../types';
import { soundManager } from '../utils/audio';
import {
  Trophy,
  Medal,
  Star
} from 'lucide-react';

export const LeaderboardModal: React.FC = () => {
  const { profile } = useGame();
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'achievements'>('leaderboard');

  // Total stars
  const totalStars = Object.values(profile.levelProgress).reduce(
    (acc, lvl) => acc + (lvl.stars || 0),
    0
  );

  // Calculate player total score
  const playerScore =
    totalStars * 200 +
    profile.totalCorrectAnswers * 50 +
    profile.coins +
    profile.gems * 20;

  const playerAccuracy =
    profile.totalQuestionsSolved > 0
      ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsSolved) * 100)
      : 100;

  // Insert current player into leaderboard list and sort
  const currentPlayerEntry: LeaderboardUser = {
    id: 'current_player',
    name: `${profile.name} (Em)`,
    avatarEmoji: '🐱',
    hatEmoji: '👑',
    score: playerScore,
    stars: totalStars,
    solvedCount: profile.totalCorrectAnswers,
    accuracy: playerAccuracy,
    rank: 1,
    isCurrentPlayer: true
  };

  const combinedLeaderboard = [...MOCK_CLASSMATES, currentPlayerEntry]
    .sort((a, b) => b.score - a.score)
    .map((user, idx) => ({ ...user, rank: idx + 1 }));

  // Achievements List
  const achievements = [
    {
      id: 'ach_1',
      title: 'Bước Chân Đầu Tiên',
      desc: 'Hoàn thành mê cung đầu tiên',
      icon: '👣',
      unlocked: profile.completedMazesCount >= 1
    },
    {
      id: 'ach_2',
      title: 'Vua Phép Cộng',
      desc: 'Giải đúng 20 bài phép cộng',
      icon: '➕',
      unlocked: profile.totalCorrectAnswers >= 20
    },
    {
      id: 'ach_3',
      title: 'Nhà Thám Hiểm 3 Sao',
      desc: 'Thu thập được ít nhất 15 Ngôi Sao',
      icon: '⭐',
      unlocked: totalStars >= 15
    },
    {
      id: 'ach_4',
      title: 'Bé Chăm Chỉ',
      desc: 'Đạt chuỗi 3 ngày đăng nhập liên tiếp',
      icon: '🔥',
      unlocked: profile.streakDays >= 3
    },
    {
      id: 'ach_5',
      title: 'Đại Gia Số Học',
      desc: 'Sở hữu trên 500 Tiền Vàng',
      icon: '💰',
      unlocked: profile.coins >= 500
    },
    {
      id: 'ach_6',
      title: 'Bậc Thầy Tính Nhẩm',
      desc: 'Giải đúng trên 50 bài toán',
      icon: '🧠',
      unlocked: profile.totalCorrectAnswers >= 50
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5 space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 rounded-3xl p-4 sm:p-6 text-slate-950 shadow-xl border-4 border-amber-400 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/80 text-amber-950 font-fredoka font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">
            Thi Đua & Danh Hiệu
          </span>
          <h1 className="font-fredoka font-black text-2xl sm:text-4xl">
            BẢNG XẾP HẠNG TOÁN HỌC
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-amber-950 max-w-xl mt-1">
            Cùng bạn bè thi đua giải toán, tích lũy điểm số và thu thập các danh hiệu vinh dự!
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/90 px-4 py-3 rounded-2xl shadow-md border-2 border-amber-300">
          <Trophy className="w-8 h-8 text-amber-500 fill-amber-400" />
          <div>
            <span className="text-xs text-slate-500 font-bold block">Thứ Hạng Của Em</span>
            <span className="font-fredoka font-black text-2xl text-slate-900">
              Hạng #{combinedLeaderboard.find(u => u.isCurrentPlayer)?.rank || 1}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-amber-300">
        <div className="flex border-b border-slate-200 pb-3 mb-4 gap-2">
          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('leaderboard');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-fredoka font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'leaderboard'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-b-2 border-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Bảng Thi Đua Lớp Học</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setActiveTab('achievements');
            }}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-fredoka font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'achievements'
                ? 'bg-amber-400 text-amber-950 shadow-md scale-102 border-b-2 border-amber-600'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-100'
            }`}
          >
            <Medal className="w-4 h-4 text-purple-600" />
            <span>Bộ Huy Chương</span>
          </button>
        </div>

        {/* TAB 1: LEADERBOARD LIST */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-2.5">
            <div className="grid grid-cols-12 text-xs font-bold text-slate-500 uppercase px-3 py-1.5 bg-slate-50 rounded-xl">
              <span className="col-span-2 sm:col-span-1 text-center">Hạng</span>
              <span className="col-span-6 sm:col-span-5">Học Sinh</span>
              <span className="col-span-2 text-center">Sao ⭐</span>
              <span className="col-span-2 sm:col-span-2 text-center">Chính Xác</span>
              <span className="hidden sm:inline sm:col-span-2 text-right">Tổng Điểm</span>
            </div>

            {combinedLeaderboard.map(user => {
              const isTop1 = user.rank === 1;
              const isTop2 = user.rank === 2;
              const isTop3 = user.rank === 3;

              return (
                <div
                  key={user.id}
                  className={`grid grid-cols-12 items-center px-3 py-3 rounded-2xl border-2 transition-all ${
                    user.isCurrentPlayer
                      ? 'bg-amber-100/90 border-amber-500 shadow-md scale-101 ring-2 ring-amber-300'
                      : isTop1
                      ? 'bg-yellow-50/80 border-yellow-400'
                      : 'bg-white border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {/* Rank Badge */}
                  <div className="col-span-2 sm:col-span-1 flex justify-center font-fredoka font-black text-sm sm:text-base">
                    {isTop1 ? (
                      <span className="text-xl">🥇</span>
                    ) : isTop2 ? (
                      <span className="text-xl">🥈</span>
                    ) : isTop3 ? (
                      <span className="text-xl">🥉</span>
                    ) : (
                      <span className="text-slate-600">#{user.rank}</span>
                    )}
                  </div>

                  {/* Name & Avatar */}
                  <div className="col-span-6 sm:col-span-5 flex items-center gap-2">
                    <span className="text-2xl">{user.avatarEmoji}</span>
                    <div className="truncate">
                      <span
                        className={`font-fredoka font-bold text-sm sm:text-base block truncate ${
                          user.isCurrentPlayer ? 'text-amber-950 font-black' : 'text-slate-800'
                        }`}
                      >
                        {user.name}
                      </span>
                      <span className="text-[11px] text-slate-500 font-semibold">
                        Đã giải đúng {user.solvedCount} bài
                      </span>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="col-span-2 flex items-center justify-center gap-1 font-fredoka font-bold text-xs sm:text-sm text-amber-800">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-500" />
                    <span>{user.stars}</span>
                  </div>

                  {/* Accuracy */}
                  <div className="col-span-2 sm:col-span-2 text-center font-fredoka font-bold text-xs sm:text-sm text-emerald-700">
                    {user.accuracy}%
                  </div>

                  {/* Total Score */}
                  <div className="hidden sm:block sm:col-span-2 text-right font-fredoka font-black text-sm text-indigo-900">
                    {user.score.toLocaleString()} đ
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {achievements.map(ach => (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border-2 flex items-start gap-3 transition-all ${
                  ach.unlocked
                    ? 'bg-amber-50 border-amber-400 shadow-sm'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="text-3xl p-2 bg-white rounded-2xl border border-amber-200 shadow-xs">
                  {ach.icon}
                </div>
                <div>
                  <h4 className="font-fredoka font-bold text-sm sm:text-base text-slate-900">
                    {ach.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{ach.desc}</p>
                  <span
                    className={`inline-block mt-2 text-[10px] font-fredoka font-bold px-2 py-0.5 rounded-full ${
                      ach.unlocked
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {ach.unlocked ? 'Đã Mở Khóa ✓' : 'Chưa Đạt'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
