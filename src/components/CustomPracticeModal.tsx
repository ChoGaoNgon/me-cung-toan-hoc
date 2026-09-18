import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { MathOperator, GradeLevel, QuestionCategory } from '../types';
import { soundManager } from '../utils/audio';
import { Play, X, Settings2, Sparkles, Check, BookOpen, Scale, ArrowLeftRight, Ruler, Divide } from 'lucide-react';

interface CustomPracticeModalProps {
  onClose: () => void;
}

export const CustomPracticeModal: React.FC<CustomPracticeModalProps> = ({ onClose }) => {
  const { profile, customPracticeConfig, startCustomPractice, updateGrade } = useGame();

  const [practiceType, setPracticeType] = useState<'operation' | 'topic'>('operation');
  const [selectedOp, setSelectedOp] = useState<MathOperator>(customPracticeConfig?.operator || '+');
  const [selectedCategory, setSelectedCategory] = useState<QuestionCategory>(customPracticeConfig?.category || 'word_problem');
  const [selectedRange, setSelectedRange] = useState<number>(customPracticeConfig?.maxNumber || 20);
  const [mazeSize, setMazeSize] = useState<number>(customPracticeConfig?.mazeSize || 13);

  const operations: { op: MathOperator; label: string; icon: string }[] = [
    { op: '+', label: 'Phép Cộng', icon: '➕' },
    { op: '-', label: 'Phép Trừ', icon: '➖' },
    { op: '×', label: 'Phép Nhân', icon: '✖️' },
    { op: '÷', label: 'Phép Chia', icon: '➗' }
  ];

  const specialTopics: { cat: QuestionCategory; label: string; icon: string; desc: string }[] = [
    { cat: 'word_problem', label: 'Toán Có Lời Văn', icon: '📜', desc: 'Bài toán đố thực tế phong phú' },
    { cat: 'comparison', label: 'So Sánh Số', icon: '⚖️', desc: 'Lớn hơn, bé hơn, dấu >, <' },
    { cat: 'predecessor_successor', label: 'Số Liền Trước/Sau', icon: '🔢', desc: 'Số liền trước (N-1), liền sau (N+1)' },
    { cat: 'measurement', label: 'Đơn Vị Đo Lường', icon: '📏', desc: 'Độ dài (m, cm), Khối lượng, Thời gian' },
    { cat: 'find_x', label: 'Tìm X Bí Ẩn', icon: '🧩', desc: 'Tìm ẩn số x trong phương trình' },
    { cat: 'fraction', label: 'Phân Số Trực Quan', icon: '🍕', desc: 'Nhận biết 1/2, 1/4, 3/4 qua hình tròn' }
  ];

  const ranges = [
    { limit: 10, label: 'Trong phạm vi 10 (Lớp 1)' },
    { limit: 20, label: 'Trong phạm vi 20 (Lớp 1-2)' },
    { limit: 50, label: 'Trong phạm vi 50 (Lớp 2)' },
    { limit: 100, label: 'Trong phạm vi 100 (Lớp 2-3)' },
    { limit: 500, label: 'Nâng cao đến 500 (Lớp 4-5)' }
  ];

  const sizes = [
    { size: 9, label: 'Nhỏ (Nhanh)' },
    { size: 13, label: 'Vừa (Chuẩn)' },
    { size: 17, label: 'Lớn (Thử Thách)' }
  ];

  const handleStartCustomGame = () => {
    soundManager.playClick();
    const effectiveGrade: GradeLevel = selectedRange >= 500 ? 5 : selectedRange >= 100 ? 3 : selectedRange >= 50 ? 2 : 1;
    updateGrade(effectiveGrade);

    if (practiceType === 'operation') {
      startCustomPractice({
        operator: selectedOp,
        maxNumber: selectedRange,
        grade: effectiveGrade,
        mazeSize: mazeSize
      });
    } else {
      startCustomPractice({
        category: selectedCategory,
        maxNumber: selectedRange,
        grade: effectiveGrade,
        mazeSize: mazeSize
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border-4 border-indigo-400 overflow-hidden max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-yellow-300" />
            <h3 className="font-fredoka font-black text-xl">
              TÙY CHỌN BÀI TẬP TOÁN
            </h3>
          </div>
          <button
            onClick={() => {
              soundManager.playClick();
              onClose();
            }}
            className="p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body (Scrollable) */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto">
          
          {/* Tab Selector: Phép tính cơ bản vs Chủ đề toán học */}
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setPracticeType('operation');
              }}
              className={`flex-1 py-2 rounded-xl font-fredoka font-bold text-xs sm:text-sm transition-all ${
                practiceType === 'operation'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Phép Tính (+, -, ×, ÷)
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playClick();
                setPracticeType('topic');
              }}
              className={`flex-1 py-2 rounded-xl font-fredoka font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
                practiceType === 'topic'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>📜 Chủ Đề Toán Học</span>
              <span className="bg-amber-400 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-full font-black">MỚI</span>
            </button>
          </div>

          {/* 1. Chọn phép toán hoặc Chủ đề */}
          {practiceType === 'operation' ? (
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                1. Chọn Phép Tính Muốn Luyện
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {operations.map(item => (
                  <button
                    key={item.op}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedOp(item.op);
                    }}
                    className={`p-3 rounded-2xl font-fredoka font-bold text-xs sm:text-sm border-2 flex flex-col items-center gap-1 transition-all ${
                      selectedOp === item.op
                        ? 'bg-indigo-600 text-white border-indigo-800 shadow-md scale-105'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
                1. Chọn Chủ Đề Toán Học
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {specialTopics.map(item => (
                  <button
                    key={item.cat}
                    type="button"
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedCategory(item.cat);
                    }}
                    className={`p-2.5 rounded-2xl font-fredoka border-2 text-left flex items-start gap-2.5 transition-all ${
                      selectedCategory === item.cat
                        ? 'bg-purple-50 border-purple-600 shadow-sm text-purple-950'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-2xl shrink-0 mt-0.5">{item.icon}</span>
                    <div className="min-w-0">
                      <div className="font-bold text-xs sm:text-sm flex items-center justify-between">
                        <span>{item.label}</span>
                        {selectedCategory === item.cat && <Check className="w-4 h-4 text-purple-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 font-sans line-clamp-1">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Chọn phạm vi số */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              2. Phạm Vi Số Học / Khối Lớp
            </label>
            <div className="space-y-1.5">
              {ranges.map(item => (
                <button
                  key={item.limit}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setSelectedRange(item.limit);
                  }}
                  className={`w-full p-2.5 rounded-xl font-fredoka font-bold text-xs sm:text-sm border-2 flex items-center justify-between px-3 transition-all ${
                    selectedRange === item.limit
                      ? 'bg-amber-100 border-amber-500 text-amber-950'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span>{item.label}</span>
                  {selectedRange === item.limit && <Check className="w-4 h-4 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Kích thước mê cung */}
          <div>
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-2">
              3. Độ Rộng Mê Cung
            </label>
            <div className="grid grid-cols-3 gap-2">
              {sizes.map(item => (
                <button
                  key={item.size}
                  type="button"
                  onClick={() => {
                    soundManager.playClick();
                    setMazeSize(item.size);
                  }}
                  className={`p-2.5 rounded-xl font-fredoka font-bold text-xs text-center border-2 transition-all ${
                    mazeSize === item.size
                      ? 'bg-purple-600 text-white border-purple-800 shadow-sm'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Start Game Button */}
          <button
            onClick={handleStartCustomGame}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-fredoka font-bold text-base rounded-2xl shadow-lg border-b-4 border-teal-800 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Bắt Đầu Thử Thách Ngay!</span>
          </button>

        </div>
      </div>
    </div>
  );
};
