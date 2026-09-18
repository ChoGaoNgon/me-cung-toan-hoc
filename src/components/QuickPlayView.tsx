import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { QuestionCategory, GradeLevel, MazeDifficulty } from '../types';
import { MathTileMazeView } from './MathTileMazeView';
import { soundManager } from '../utils/audio';
import {
  Play,
  Sparkles,
  Layers,
  ArrowRight,
  BookOpen,
  Calculator,
  Grid,
  ChevronLeft,
  GraduationCap
} from 'lucide-react';

export const QuickPlayView: React.FC = () => {
  const { profile, updateGrade, setCurrentMode, activeTeacherScript, stopTeacherScript } = useGame();

  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(profile.grade);
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>('comparison');
  const [selectedDifficulty, setSelectedDifficulty] = useState<MazeDifficulty>('medium');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [quickLevelIndex, setQuickLevelIndex] = useState<number>(1);

  const categories: {
    id: QuestionCategory;
    name: string;
    description: string;
    icon: string;
    color: string;
    grades: GradeLevel[];
  }[] = [
    {
      id: 'comparison',
      name: 'So Sánh Số',
      description: 'Lớn hơn, bé hơn, nằm giữa hai số',
      icon: '⚖️',
      color: 'from-amber-400 to-orange-500',
      grades: [1, 2, 3, 4, 5]
    },
    {
      id: 'addition',
      name: 'Phép Cộng',
      description: 'Tính tổng nhẩm nhanh & tìm ô bằng kết quả',
      icon: '➕',
      color: 'from-emerald-400 to-green-500',
      grades: [1, 2, 3, 4, 5]
    },
    {
      id: 'subtraction',
      name: 'Phép Trừ',
      description: 'Tính hiệu & tìm đường về đích',
      icon: '➖',
      color: 'from-sky-400 to-blue-500',
      grades: [1, 2, 3, 4, 5]
    },
    {
      id: 'multiplication',
      name: 'Bảng Cửu Chương',
      description: 'Bảng nhân 2, 3, 4, 5, 6, 7, 8, 9',
      icon: '✖️',
      color: 'from-purple-400 to-indigo-500',
      grades: [2, 3, 4, 5]
    },
    {
      id: 'division',
      name: 'Số Chia Hết',
      description: 'Bảng chia & tìm số chia hết',
      icon: '➗',
      color: 'from-pink-400 to-rose-500',
      grades: [2, 3, 4, 5]
    },
    {
      id: 'find_x',
      name: 'Tìm Ẩn Số X',
      description: 'Giải phương trình đơn giản tìm X',
      icon: '🔍',
      color: 'from-cyan-400 to-teal-500',
      grades: [2, 3, 4, 5]
    },
    {
      id: 'even_odd',
      name: 'Số Chẵn & Số Lẻ',
      description: 'Nhận biết quy luật chẵn lẻ',
      icon: '🔢',
      color: 'from-yellow-400 to-amber-500',
      grades: [1, 2, 3, 4, 5]
    },
    {
      id: 'fraction',
      name: 'Phân Số Trực Quan',
      description: 'Hình tròn, thanh phân số 1/2, 1/4, 3/4...',
      icon: '🍕',
      color: 'from-violet-400 to-purple-600',
      grades: [3, 4, 5]
    }
  ];

  if (isPlaying) {
    const currentCatObj = categories.find(c => c.id === selectedCategory);
    return (
      <MathTileMazeView
        key={`quick-play-${selectedCategory}-${selectedGrade}-${selectedDifficulty}-${quickLevelIndex}`}
        category={selectedCategory}
        grade={selectedGrade}
        difficulty={selectedDifficulty}
        levelTitle={`⚡ Luyện Tập Nhanh - Màn ${quickLevelIndex}: ${currentCatObj?.name || 'Toán Học'}`}
        onBackToMenu={() => {
          setIsPlaying(false);
          setQuickLevelIndex(1);
        }}
        onNextLevel={() => {
          soundManager.playGateUnlock();
          setQuickLevelIndex(prev => prev + 1);
        }}
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-3 sm:p-5 space-y-6 select-none">
      {/* 🎓 Active Teacher Script Banner if applicable */}
      {activeTeacherScript && (
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white p-3.5 sm:p-4 rounded-3xl shadow-lg border-3 border-amber-300 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Kịch bản giáo viên đang kích hoạt ({activeTeacherScript.grade ? `Lớp ${activeTeacherScript.grade}` : 'Đề Tự Chọn'})
              </div>
              <div className="font-fredoka font-black text-sm sm:text-base text-white">
                {activeTeacherScript.title} ({activeTeacherScript.questions.length} câu)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                stopTeacherScript();
              }}
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-fredoka font-bold px-3 py-1.5 rounded-xl border border-white/30 cursor-pointer active:scale-95"
            >
              Dừng Kịch Bản
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setCurrentMode('teacher_studio');
              }}
              className="text-xs game-btn-gold text-slate-950 font-fredoka font-black px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer active:scale-95"
            >
              Vào Studio 🎓
            </button>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 sm:p-6 shadow-2xl border-4 border-amber-700 flex items-center justify-between text-white">
        <div>
          <h2 className="font-fredoka font-black text-2xl sm:text-3xl flex items-center gap-2 drop-shadow-md">
            <span>⚡ Chế Độ Thử Thách Nhanh</span>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-amber-100 mt-1 drop-shadow-xs">
            Tự do chọn lớp học, chủ đề toán học và kích thước bản đồ để so tài!
          </p>
        </div>
        <button
          onClick={() => {
            soundManager.playClick();
            setCurrentMode('world_map');
          }}
          className="game-btn-gold px-4 py-2.5 rounded-2xl font-fredoka font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Bản Đồ</span>
        </button>
      </div>

      {/* Step 1: Choose Grade */}
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl border-3 border-amber-300 space-y-3">
        <label className="font-fredoka font-black text-sm text-slate-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <span>1. Chọn Khối Lớp Học:</span>
        </label>
        <div className="grid grid-cols-5 gap-2.5">
          {([1, 2, 3, 4, 5] as GradeLevel[]).map(g => (
            <button
              key={g}
              id={`quick-grade-${g}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedGrade(g);
                updateGrade(g);
              }}
              className={`py-3.5 rounded-2xl font-fredoka font-black text-sm sm:text-base transition-all border-3 cursor-pointer ${
                selectedGrade === g
                  ? 'bg-gradient-to-b from-yellow-300 to-amber-500 text-amber-950 border-amber-600 shadow-lg scale-105 ring-2 ring-yellow-400'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-amber-50 hover:border-amber-300'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* Step 2: Choose Topic / Question Category */}
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl border-3 border-amber-300 space-y-3">
        <label className="font-fredoka font-black text-sm text-slate-900 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-500" />
          <span>2. Chọn Chủ Đề Toán Học:</span>
        </label>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {categories.map(cat => {
            const isAvailable = cat.grades.includes(selectedGrade);
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                id={`quick-cat-${cat.id}`}
                disabled={!isAvailable}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`p-4 rounded-2xl text-left transition-all border-3 flex flex-col justify-between cursor-pointer ${
                  !isAvailable
                    ? 'opacity-40 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : isSelected
                    ? 'bg-gradient-to-br from-amber-100 to-orange-100 border-amber-600 shadow-xl ring-4 ring-amber-300 scale-102'
                    : 'bg-white border-slate-300 hover:border-amber-400 hover:bg-amber-50/50 shadow-xs'
                }`}
              >
                <div className="text-3xl mb-2">{cat.icon}</div>
                <div>
                  <h4 className="font-fredoka font-black text-sm text-slate-900">{cat.name}</h4>
                  <p className="text-[11px] font-semibold text-slate-600 line-clamp-2 mt-0.5">{cat.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 3: Choose Maze Grid Size / Difficulty */}
      <div className="bg-white/95 rounded-3xl p-5 shadow-xl border-3 border-amber-300 space-y-3">
        <label className="font-fredoka font-black text-sm text-slate-900 flex items-center gap-2">
          <Grid className="w-5 h-5 text-indigo-500" />
          <span>3. Chọn Kích Thước Bản Đồ Mê Cung:</span>
        </label>

        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'easy' as MazeDifficulty, name: '🟢 Dễ (4 × 4)', desc: 'Phù hợp làm quen' },
            { id: 'medium' as MazeDifficulty, name: '🟡 Vừa (5 × 5)', desc: 'Thử thách cân bằng' },
            { id: 'hard' as MazeDifficulty, name: '🔴 Khó (6 × 6)', desc: 'Mê cung lớn & nhiều ngã rẽ' }
          ].map(diff => (
            <button
              key={diff.id}
              id={`quick-diff-${diff.id}`}
              onClick={() => {
                soundManager.playClick();
                setSelectedDifficulty(diff.id);
              }}
              className={`p-3.5 rounded-2xl text-center border-3 transition-all font-fredoka cursor-pointer ${
                selectedDifficulty === diff.id
                  ? 'bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-950 border-indigo-500 shadow-lg ring-3 ring-indigo-300 scale-102'
                  : 'bg-white text-slate-800 border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="font-black text-sm sm:text-base block">{diff.name}</span>
              <span className="text-[11px] text-slate-600 font-bold">{diff.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Start Game Action Button */}
      <button
        id="btn-start-quick-maze"
        onClick={() => {
          soundManager.playClick();
          setQuickLevelIndex(1);
          setIsPlaying(true);
        }}
        className="w-full py-4.5 game-btn-green font-fredoka font-black text-xl sm:text-2xl rounded-3xl shadow-2xl flex items-center justify-center gap-3 active:scale-98 transition-transform cursor-pointer"
      >
        <Play className="w-7 h-7 fill-white" />
        <span>BẮT ĐẦU VÀO MÊ CUNG!</span>
        <ArrowRight className="w-7 h-7 stroke-[3]" />
      </button>
    </div>
  );
};
