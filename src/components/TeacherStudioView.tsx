import React, { useState, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { TeacherLessonScript, TeacherQuestionItem, GradeLevel } from '../types';
import {
  GraduationCap,
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  Play,
  FileText,
  Zap,
  Save,
  ArrowUp,
  ArrowDown,
  Sparkles,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Edit3,
  X,
  Code2,
  Share2,
  ChevronRight,
  BookOpen,
  Eye
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import { getRandomWordProblem } from '../data/wordProblemsBank';

export const TeacherStudioView: React.FC = () => {
  const {
    savedTeacherScripts,
    activeTeacherScript,
    saveTeacherScript,
    deleteTeacherScript,
    playTeacherScript,
    importTeacherScriptsJSON,
    exportTeacherScriptJSON,
    setCurrentMode
  } = useGame();

  // State
  const [selectedScriptId, setSelectedScriptId] = useState<string>(
    savedTeacherScripts[0]?.id || ''
  );
  const [editingScript, setEditingScript] = useState<TeacherLessonScript | null>(() => {
    return savedTeacherScripts[0] ? JSON.parse(JSON.stringify(savedTeacherScripts[0])) : null;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'library'>('editor');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showSampleModal, setShowSampleModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error' | 'idle'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [previewQuestion, setPreviewQuestion] = useState<TeacherQuestionItem | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch selected script
  const handleSelectScript = (script: TeacherLessonScript) => {
    setSelectedScriptId(script.id);
    setEditingScript(JSON.parse(JSON.stringify(script)));
    setActiveTab('editor');
    soundManager.playClick();
  };

  // Create brand new blank script
  const handleCreateNewScript = () => {
    const newScript: TeacherLessonScript = {
      id: `script_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      title: 'Kịch Bản Bài Giảng Mới',
      description: 'Mô tả mục tiêu bài dạy hoặc dạng toán ôn tập...',
      author: 'Thầy/Cô Giáo',
      grade: 3,
      createdAt: new Date().toISOString().split('T')[0],
      questions: [
        {
          id: `q_${Date.now()}_1`,
          tag: 'Ải 1: Khởi Động',
          story: 'Một cửa hàng có 45 kg gạo, buổi chiều nhập thêm 35 kg gạo nữa. Hỏi cửa hàng có tất cả bao nhiêu kg gạo?',
          shortQuestion: 'Cửa hàng có tất cả bao nhiêu kg gạo?',
          correctAnswer: 80,
          unit: 'kg',
          options: [80, 75, 85, 70],
          explanation: 'Tổng số gạo là: 45 + 35 = 80 (kg).',
          hint: 'Cộng số gạo ban đầu với số gạo nhập thêm.'
        }
      ]
    };
    setEditingScript(newScript);
    setSelectedScriptId(newScript.id);
    setActiveTab('editor');
    soundManager.playClick();
    showToast('✨ Đã tạo kịch bản mới! Hãy thêm các câu hỏi bên dưới.');
  };

  // Save current script changes
  const handleSaveCurrentScript = () => {
    if (!editingScript) return;
    if (!editingScript.title.trim()) {
      showToast('⚠️ Vui lòng nhập tiêu đề kịch bản.');
      return;
    }
    if (editingScript.questions.length === 0) {
      showToast('⚠️ Kịch bản phải có ít nhất 1 câu hỏi.');
      return;
    }
    saveTeacherScript(editingScript);
    soundManager.playCorrect();
    showToast('💾 Đã lưu kịch bản bài giảng thành công!');
  };

  // Add a new question to current script
  const handleAddQuestion = () => {
    if (!editingScript) return;
    const qIndex = editingScript.questions.length + 1;
    const newQ: TeacherQuestionItem = {
      id: `q_${Date.now()}_${qIndex}`,
      tag: `Ải ${qIndex}: Thử Thách`,
      story: `Đề bài câu hỏi số ${qIndex}...`,
      shortQuestion: `Câu hỏi số ${qIndex}?`,
      correctAnswer: 10,
      unit: '',
      options: [10, 8, 12, 15],
      explanation: 'Lời giải chi tiết từng bước...',
      hint: 'Gợi ý giải bài toán...'
    };
    setEditingScript({
      ...editingScript,
      questions: [...editingScript.questions, newQ]
    });
    soundManager.playClick();
  };

  // Add auto question from Word Problems bank
  const handleAddFromBank = () => {
    if (!editingScript) return;
    const sample = getRandomWordProblem(editingScript.grade);
    const qIndex = editingScript.questions.length + 1;
    const newQ: TeacherQuestionItem = {
      id: `q_${Date.now()}_${qIndex}`,
      tag: sample.tag || `Ải ${qIndex}: Toán Lời Văn`,
      story: sample.story,
      shortQuestion: sample.shortQuestion,
      correctAnswer: sample.correctAnswer,
      unit: sample.unit || '',
      options: sample.options,
      explanation: sample.explanation,
      hint: sample.hint || ''
    };
    setEditingScript({
      ...editingScript,
      questions: [...editingScript.questions, newQ]
    });
    soundManager.playClick();
    showToast('🎲 Đã thêm 1 câu hỏi chất lượng từ kho đề!');
  };

  // Auto generate 3 distractor options
  const handleAutoGenerateOptions = (qIndex: number) => {
    if (!editingScript) return;
    const q = editingScript.questions[qIndex];
    const correct = q.correctAnswer;
    const set = new Set<number>();
    set.add(correct);
    const diffs = correct >= 1000 ? [-10000, -5000, 5000, 10000, -2000, 2000] : correct <= 15 ? [-3, -2, -1, 1, 2, 3, 4] : [-10, -5, -2, -1, 1, 2, 5, 10];
    let attempts = 0;
    while (set.size < 4 && attempts < 40) {
      attempts++;
      const d = diffs[Math.floor(Math.random() * diffs.length)];
      if (correct + d > 0 && correct + d !== correct) set.add(correct + d);
    }
    let offset = 1;
    while (set.size < 4) {
      if (correct + offset > 0 && !set.has(correct + offset)) set.add(correct + offset);
      else if (correct - offset > 0 && !set.has(correct - offset)) set.add(correct - offset);
      offset++;
    }
    const newOptions = Array.from(set).sort(() => Math.random() - 0.5);
    updateQuestion(qIndex, { options: newOptions });
    soundManager.playClick();
    showToast('✨ Đã sinh tự động 4 phương án trắc nghiệm hợp lý!');
  };

  // Update a single question field
  const updateQuestion = (index: number, patch: Partial<TeacherQuestionItem>) => {
    if (!editingScript) return;
    const updated = [...editingScript.questions];
    updated[index] = { ...updated[index], ...patch };
    setEditingScript({
      ...editingScript,
      questions: updated
    });
  };

  // Delete a question
  const handleDeleteQuestion = (index: number) => {
    if (!editingScript) return;
    if (editingScript.questions.length <= 1) {
      showToast('⚠️ Kịch bản cần có ít nhất 1 câu hỏi.');
      return;
    }
    const updated = editingScript.questions.filter((_, i) => i !== index);
    setEditingScript({
      ...editingScript,
      questions: updated
    });
    soundManager.playClick();
  };

  // Duplicate a question
  const handleDuplicateQuestion = (index: number) => {
    if (!editingScript) return;
    const target = editingScript.questions[index];
    const clone: TeacherQuestionItem = {
      ...JSON.parse(JSON.stringify(target)),
      id: `q_${Date.now()}_clone`,
      tag: `${target.tag || 'Câu hỏi'} (Bản sao)`
    };
    const updated = [...editingScript.questions];
    updated.splice(index + 1, 0, clone);
    setEditingScript({
      ...editingScript,
      questions: updated
    });
    soundManager.playClick();
    showToast('📑 Đã nhân bản câu hỏi.');
  };

  // Move question up / down
  const handleMoveQuestion = (index: number, dir: -1 | 1) => {
    if (!editingScript) return;
    const targetIndex = index + dir;
    if (targetIndex < 0 || targetIndex >= editingScript.questions.length) return;
    const updated = [...editingScript.questions];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setEditingScript({
      ...editingScript,
      questions: updated
    });
    soundManager.playClick();
  };

  // Export JSON download
  const handleExportJSON = (script: TeacherLessonScript) => {
    const jsonStr = exportTeacherScriptJSON(script);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kich_ban_${script.title.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    soundManager.playCoin();
    showToast('📥 Đã tải file JSON kịch bản về máy tính!');
  };

  // Copy JSON to clipboard
  const handleCopyJSON = (script: TeacherLessonScript) => {
    const jsonStr = exportTeacherScriptJSON(script);
    navigator.clipboard.writeText(jsonStr).then(() => {
      soundManager.playClick();
      showToast('📋 Đã sao chép mã JSON vào bộ nhớ tạm!');
    });
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportJsonText(content);
        processImport(content);
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const processImport = (jsonStr: string) => {
    const res = importTeacherScriptsJSON(jsonStr);
    if (res.success) {
      soundManager.playCorrect();
      soundManager.playApplause();
      setImportStatus({
        type: 'success',
        message: `✅ Đã nhập thành công ${res.count} kịch bản bài giảng!`
      });
      showToast(`🎉 Nhập thành công ${res.count} kịch bản!`);
      setTimeout(() => {
        setShowImportModal(false);
        setImportStatus({ type: 'idle', message: '' });
        setImportJsonText('');
      }, 1500);
    } else {
      soundManager.playWrong();
      setImportStatus({
        type: 'error',
        message: res.error || 'Lỗi nhập dữ liệu JSON.'
      });
    }
  };

  // Play Script
  const handlePlayScript = (
    script: TeacherLessonScript,
    mode: 'worksheet_play' | 'quick_play' | 'maze_play'
  ) => {
    // Save latest before playing if currently editing
    if (editingScript && editingScript.id === script.id) {
      saveTeacherScript(editingScript);
    }
    soundManager.playGateUnlock();
    playTeacherScript(script, mode);
  };

  const sampleJsonCode = JSON.stringify(
    {
      title: 'Đề Ôn Tập Giữa Kì 1 - Toán Lớp 4',
      description: 'Giáo án gồm các bài toán tổng hiệu, phân số và nhiều bước.',
      author: 'Cô Nguyễn Thị Hoa',
      grade: 4,
      questions: [
        {
          tag: '1. Dạng Tổng - Hiệu',
          story: 'Hai thùng dầu có tất cả 120 lít dầu. Nếu rót từ thùng thứ nhất sang thùng thứ hai 15 lít thì số dầu ở hai thùng bằng nhau. Hỏi lúc đầu thùng thứ nhất có bao nhiêu lít dầu?',
          shortQuestion: 'Lúc đầu thùng 1 có bao nhiêu lít dầu?',
          correctAnswer: 75,
          unit: 'lít',
          options: [75, 45, 60, 80],
          explanation: 'Thùng 1 hơn thùng 2 là: 15 × 2 = 30 (lít). Thùng 1 lúc đầu có: (120 + 30) ÷ 2 = 75 (lít).',
          hint: 'Chuyển 15 lít thì bằng nhau tức là thùng 1 hơn thùng 2 là 30 lít.'
        },
        {
          tag: '2. Dạng Nhiều Bước',
          story: 'Một đội công nhân ngày thứ nhất sửa được 145 mét đường. Ngày thứ hai sửa được gấp 2 lần ngày thứ nhất. Hỏi cả hai ngày đội công nhân sửa được bao nhiêu mét đường?',
          shortQuestion: 'Cả hai ngày sửa được bao nhiêu mét đường?',
          correctAnswer: 435,
          unit: 'm',
          options: [435, 290, 420, 380],
          explanation: 'Ngày thứ hai sửa: 145 × 2 = 290 (m). Cả hai ngày sửa: 145 + 290 = 435 (m).',
          hint: 'Tìm số mét đường ngày thứ 2 rồi cộng với ngày thứ nhất.'
        }
      ]
    },
    null,
    2
  );

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-slate-900/95 text-white px-4 py-3 rounded-2xl shadow-2xl border-2 border-amber-400 flex items-center gap-2.5 animate-in slide-in-from-top-5 duration-200">
          <Sparkles className="w-5 h-5 text-amber-300 animate-spin-slow" />
          <span className="font-fredoka font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white p-4 sm:p-6 rounded-3xl shadow-xl border-4 border-amber-400 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-xs">
              <GraduationCap className="w-7 h-7 text-yellow-200" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider bg-amber-900/40 text-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300/30">
                Dành cho Giáo viên & Phụ huynh
              </span>
              <h1 className="font-fredoka font-black text-2xl sm:text-3xl text-white drop-shadow-sm">
                STUDIO SOẠN ĐỀ & KỊCH BẢN BÀI GIẢNG
              </h1>
            </div>
          </div>
          <p className="text-amber-100 text-xs sm:text-sm max-w-2xl mt-1">
            Soạn kịch bản câu hỏi theo ải, nhập xuất file JSON giáo án, và phát trực tiếp cho học sinh trải nghiệm trên Mê Cung hoặc In Phiếu Học Tập.
          </p>
        </div>

        {/* Action Buttons Top */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCreateNewScript}
            className="flex items-center gap-1.5 game-btn-green font-fredoka font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-md cursor-pointer hover:scale-102 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Soạn Đề Mới</span>
          </button>
          
          <button
            onClick={() => {
              soundManager.playClick();
              setShowImportModal(true);
            }}
            className="flex items-center gap-1.5 bg-white text-slate-800 hover:text-amber-900 font-fredoka font-black text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-md border-2 border-amber-400 cursor-pointer hover:scale-102 active:scale-95 transition-all"
          >
            <Upload className="w-4 h-4 text-amber-600" />
            <span>Nhập JSON</span>
          </button>

          <button
            onClick={() => {
              soundManager.playClick();
              setShowSampleModal(true);
            }}
            className="flex items-center gap-1.5 bg-amber-900/40 hover:bg-amber-900/60 text-amber-100 font-fredoka font-bold text-xs sm:text-sm px-3 py-2 rounded-2xl border border-amber-300/30 cursor-pointer transition-all"
            title="Xem cấu trúc và copy mã JSON mẫu"
          >
            <Code2 className="w-4 h-4 text-yellow-300" />
            <span>Mẫu JSON</span>
          </button>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b-2 border-amber-200 pb-3 mb-6">
        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('editor');
          }}
          className={`flex items-center gap-2 font-fredoka font-black text-sm sm:text-base px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'editor'
              ? 'game-btn-gold text-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Soạn & Chỉnh Sửa Kịch Bản</span>
          {editingScript && (
            <span className="bg-amber-800/20 text-slate-900 text-xs px-2 py-0.5 rounded-full font-bold">
              {editingScript.questions.length} câu
            </span>
          )}
        </button>

        <button
          onClick={() => {
            soundManager.playClick();
            setActiveTab('library');
          }}
          className={`flex items-center gap-2 font-fredoka font-black text-sm sm:text-base px-4 py-2 rounded-2xl transition-all cursor-pointer ${
            activeTab === 'library'
              ? 'game-btn-gold text-slate-900 shadow-md scale-102'
              : 'bg-white text-slate-600 hover:bg-amber-50 border border-amber-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Kho Kịch Bản Đã Lưu ({savedTeacherScripts.length})</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: SOẠN & CHỈNH SỬA KỊCH BẢN (SCRIPT EDITOR)                      */}
      {/* ===================================================================== */}
      {activeTab === 'editor' && editingScript && (
        <div className="space-y-6 animate-in fade-in duration-200">
          
          {/* Metadata Card */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-md border-3 border-amber-300">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
              <h2 className="font-fredoka font-black text-lg sm:text-xl text-slate-800 flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-600" />
                <span>Thông Tin Kịch Bản Bài Dạy</span>
              </h2>

              {/* Action Bar on top of editor */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveCurrentScript}
                  className="flex items-center gap-1.5 game-btn-green font-fredoka font-black text-xs sm:text-sm px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu Kịch Bản</span>
                </button>

                <button
                  onClick={() => handleCopyJSON(editingScript)}
                  className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-fredoka font-bold text-xs px-3 py-1.5 rounded-xl border border-slate-300 cursor-pointer"
                  title="Sao chép JSON"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy JSON</span>
                </button>

                <button
                  onClick={() => handleExportJSON(editingScript)}
                  className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 font-fredoka font-bold text-xs px-3 py-1.5 rounded-xl border border-amber-300 cursor-pointer"
                  title="Tải file .json"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải .JSON</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
              <div className="md:col-span-6">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Tên Kịch Bản / Đề Bài Giảng *
                </label>
                <input
                  type="text"
                  value={editingScript.title}
                  onChange={e => setEditingScript({ ...editingScript, title: e.target.value })}
                  placeholder="Ví dụ: Đề Ôn Tập 15 Phút Lớp 3 - Dạng Tổng Hiệu..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-bold text-slate-800 text-sm bg-amber-50/40"
                />
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Khối Lớp
                </label>
                <select
                  value={editingScript.grade}
                  onChange={e => setEditingScript({ ...editingScript, grade: Number(e.target.value) as GradeLevel })}
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-bold text-slate-800 text-sm bg-amber-50/40"
                >
                  <option value={1}>Khối Lớp 1</option>
                  <option value={2}>Khối Lớp 2</option>
                  <option value={3}>Khối Lớp 3</option>
                  <option value={4}>Khối Lớp 4</option>
                  <option value={5}>Khối Lớp 5</option>
                </select>
              </div>

              <div className="md:col-span-3">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Tác Giả / Giáo Viên
                </label>
                <input
                  type="text"
                  value={editingScript.author || ''}
                  onChange={e => setEditingScript({ ...editingScript, author: e.target.value })}
                  placeholder="Tên thầy/cô giáo..."
                  className="w-full px-3.5 py-2.5 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden font-bold text-slate-800 text-sm bg-amber-50/40"
                />
              </div>

              <div className="md:col-span-12">
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                  Mô Tả / Hướng Dẫn Bài Dạy
                </label>
                <input
                  type="text"
                  value={editingScript.description || ''}
                  onChange={e => setEditingScript({ ...editingScript, description: e.target.value })}
                  placeholder="Ghi chú mục tiêu bài học, thời gian làm bài dự kiến..."
                  className="w-full px-3.5 py-2 rounded-2xl border-2 border-amber-200 focus:border-amber-500 focus:outline-hidden text-slate-700 text-xs sm:text-sm bg-amber-50/40"
                />
              </div>
            </div>

            {/* Launch Modes Panel */}
            <div className="mt-5 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 rounded-2xl border-2 border-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <span className="font-fredoka font-black text-amber-950 text-sm flex items-center gap-1.5">
                  <Play className="w-4 h-4 text-amber-700 fill-amber-700" />
                  PHÁT KỊCH BẢN NÀY CHO HỌC SINH:
                </span>
                <p className="text-slate-600 text-xs mt-0.5">
                  Nạp chính xác <strong className="text-amber-900 font-black">{editingScript.questions.length} câu hỏi</strong> vừa soạn vào Phiếu Mê Cung để học sinh giải đố và in ấn khổ A4.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-launch-teacher-script"
                  onClick={() => handlePlayScript(editingScript, 'worksheet_play')}
                  className="flex items-center gap-2 game-btn-green font-fredoka font-black text-sm px-5 py-2.5 rounded-2xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all"
                  title="Phát kịch bản này vào Mê Cung và Phiếu In"
                >
                  <Sparkles className="w-4 h-4 text-yellow-200" />
                  <span>Phát kịch bản này!</span>
                </button>
              </div>
            </div>
          </div>

          {/* Question List Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <h3 className="font-fredoka font-black text-lg sm:text-xl text-slate-800 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>DANH SÁCH CÂU HỎI THEO ẢI ({editingScript.questions.length} CÂU)</span>
            </h3>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAddFromBank}
                className="flex items-center gap-1.5 bg-purple-50 hover:bg-purple-100 text-purple-800 font-fredoka font-black text-xs px-3 py-1.5 rounded-xl border border-purple-300 cursor-pointer active:scale-95"
                title="Lấy 1 bài toán có lời văn từ kho đề có sẵn"
              >
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                <span>+ Lấy Từ Kho Đề Có Sẵn</span>
              </button>

              <button
                onClick={handleAddQuestion}
                className="flex items-center gap-1.5 game-btn-green font-fredoka font-black text-xs px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Thêm Câu Hỏi Tay</span>
              </button>
            </div>
          </div>

          {/* Question Cards Accordion */}
          <div className="space-y-4">
            {editingScript.questions.map((q, idx) => (
              <div
                key={q.id || idx}
                className="bg-white rounded-3xl p-4 sm:p-5 shadow-sm border-2 border-amber-200 hover:border-amber-400 transition-colors relative"
              >
                {/* Question Header Bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-fredoka font-black text-white bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-1 rounded-xl text-xs sm:text-sm shadow-xs">
                      ẢI {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={q.tag || ''}
                      onChange={e => updateQuestion(idx, { tag: e.target.value })}
                      placeholder="Phân loại dạng toán (vd: Dạng Tổng - Hiệu)..."
                      className="text-xs font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 focus:outline-hidden max-w-[220px]"
                    />
                  </div>

                  {/* Ordering & Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleMoveQuestion(idx, -1)}
                      disabled={idx === 0}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Di chuyển lên trước"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveQuestion(idx, 1)}
                      disabled={idx === editingScript.questions.length - 1}
                      className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-slate-700 cursor-pointer"
                      title="Di chuyển xuống sau"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setPreviewQuestion(q)}
                      className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 cursor-pointer ml-1"
                      title="Xem trước hiển thị"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicateQuestion(idx)}
                      className="p-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 cursor-pointer"
                      title="Nhân bản câu này"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                      title="Xóa câu này"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Form Inputs for Question */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                      Đề bài / Câu hỏi lời văn *
                    </label>
                    <textarea
                      rows={2}
                      value={q.story}
                      onChange={e => updateQuestion(idx, { story: e.target.value })}
                      placeholder="Nhập nội dung bài toán đầy đủ..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-sm font-medium text-slate-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Câu hỏi rút gọn (Hiển thị tại cổng mê cung)
                      </label>
                      <input
                        type="text"
                        value={q.shortQuestion || ''}
                        onChange={e => updateQuestion(idx, { shortQuestion: e.target.value })}
                        placeholder="Ví dụ: Lúc đầu kho 1 có bao nhiêu kg gạo?"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-xs text-slate-800 font-semibold"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Đơn vị (kg, lít, học sinh, tuổi...)
                      </label>
                      <input
                        type="text"
                        value={q.unit || ''}
                        onChange={e => updateQuestion(idx, { unit: e.target.value })}
                        placeholder="Ví dụ: kg"
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-xs text-slate-800"
                      />
                    </div>
                  </div>

                  {/* Answers & Options */}
                  <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold text-amber-900 uppercase">
                        Đáp án đúng & 4 Lựa chọn trắc nghiệm *
                      </label>
                      <button
                        onClick={() => handleAutoGenerateOptions(idx)}
                        className="text-[11px] font-bold text-amber-800 hover:text-amber-950 bg-amber-200/80 hover:bg-amber-300 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer"
                      >
                        <Sparkles className="w-3 h-3 text-amber-700" />
                        <span>Sinh tự động 3 đáp án nhiễu</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {q.options.map((opt, optIdx) => {
                        const isCorrect = Number(opt) === Number(q.correctAnswer);
                        return (
                          <div
                            key={optIdx}
                            className={`p-2 rounded-xl border-2 flex items-center justify-between gap-1.5 ${
                              isCorrect
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-300'
                                : 'bg-white border-slate-200'
                            }`}
                          >
                            <div className="flex items-center gap-1.5 flex-1">
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                  isCorrect ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                                }`}
                              >
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <input
                                type="number"
                                value={opt}
                                onChange={e => {
                                  const val = Number(e.target.value);
                                  const newOpts = [...q.options];
                                  newOpts[optIdx] = val;
                                  // If this was the correct answer previously, update correct answer too
                                  if (isCorrect) {
                                    updateQuestion(idx, { options: newOpts, correctAnswer: val });
                                  } else {
                                    updateQuestion(idx, { options: newOpts });
                                  }
                                }}
                                className="w-full text-xs font-bold text-slate-900 bg-transparent focus:outline-hidden"
                              />
                            </div>
                            <button
                              onClick={() => {
                                updateQuestion(idx, { correctAnswer: Number(opt) });
                                soundManager.playClick();
                              }}
                              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md cursor-pointer transition-all ${
                                isCorrect
                                  ? 'bg-emerald-600 text-white shadow-xs'
                                  : 'text-slate-400 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-100'
                              }`}
                              title="Đặt làm đáp án ĐÚNG"
                            >
                              {isCorrect ? 'ĐÚNG ✓' : 'Chọn đúng'}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation & Hint */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Lời giải chi tiết
                      </label>
                      <textarea
                        rows={2}
                        value={q.explanation || ''}
                        onChange={e => updateQuestion(idx, { explanation: e.target.value })}
                        placeholder="Giải thích từng bước cho học sinh hiểu..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-xs text-slate-700"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 uppercase mb-1">
                        Gợi ý giải bài toán (Hint)
                      </label>
                      <textarea
                        rows={2}
                        value={q.hint || ''}
                        onChange={e => updateQuestion(idx, { hint: e.target.value })}
                        placeholder="Gợi ý nhỏ nếu học sinh gặp khó khăn..."
                        className="w-full px-3 py-1.5 rounded-xl border border-slate-300 focus:border-amber-500 focus:outline-hidden text-xs text-slate-700"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Add & Save Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t-2 border-amber-200">
            <button
              onClick={handleAddQuestion}
              className="flex items-center gap-1.5 bg-white hover:bg-amber-50 text-slate-800 font-fredoka font-black text-sm px-4 py-2.5 rounded-2xl border-2 border-amber-300 shadow-sm cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>+ Thêm Câu Hỏi Mới</span>
            </button>

            <button
              onClick={handleSaveCurrentScript}
              className="flex items-center gap-2 game-btn-green font-fredoka font-black text-base px-6 py-2.5 rounded-2xl shadow-lg cursor-pointer hover:scale-102 active:scale-95 transition-all"
            >
              <Save className="w-5 h-5" />
              <span>LƯU KỊCH BẢN BÀI DẠY</span>
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: KHO KỊCH BẢN ĐÃ LƯU (SAVED LESSON SCRIPTS LIBRARY)             */}
      {/* ===================================================================== */}
      {activeTab === 'library' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedTeacherScripts.map((script) => {
              const isSelected = editingScript?.id === script.id;
              return (
                <div
                  key={script.id}
                  className={`bg-white rounded-3xl p-5 shadow-md border-3 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-amber-500 ring-3 ring-amber-300/60'
                      : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  <div>
                    {/* Badge & Grade */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-fredoka font-bold text-xs bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
                        Khối Lớp {script.grade}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400">
                        {script.questions.length} câu hỏi
                      </span>
                    </div>

                    <h4 className="font-fredoka font-black text-base text-slate-900 line-clamp-2 mb-1">
                      {script.title}
                    </h4>

                    <p className="text-slate-500 text-xs line-clamp-2 mb-3">
                      {script.description || 'Kịch bản bài giảng chưa có mô tả'}
                    </p>

                    <div className="text-[11px] text-slate-400 mb-4">
                      Tác giả: <strong className="text-slate-600">{script.author || 'Giáo viên'}</strong>
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="space-y-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handlePlayScript(script, 'worksheet_play')}
                      className="w-full flex items-center justify-center gap-1.5 game-btn-green font-fredoka font-black text-xs py-2 px-3 rounded-xl shadow-xs cursor-pointer active:scale-95 transition-all"
                      title="Phát kịch bản này vào Mê Cung và Phiếu In"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
                      <span>Phát kịch bản này!</span>
                    </button>

                    <div className="flex items-center justify-between gap-1">
                      <button
                        onClick={() => handleSelectScript(script)}
                        className="flex-1 flex items-center justify-center gap-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-fredoka font-bold text-xs py-1.5 rounded-xl border border-amber-300 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-700" />
                        <span>Chỉnh Sửa</span>
                      </button>

                      <button
                        onClick={() => handleExportJSON(script)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-300 cursor-pointer"
                        title="Tải JSON"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      {savedTeacherScripts.length > 1 && (
                        <button
                          onClick={() => {
                            if (confirm(`Bạn có chắc muốn xóa kịch bản "${script.title}"?`)) {
                              deleteTeacherScript(script.id);
                              soundManager.playClick();
                              showToast('🗑️ Đã xóa kịch bản.');
                            }
                          }}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl border border-rose-300 cursor-pointer"
                          title="Xóa kịch bản"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 📥 MODAL NHẬP FILE JSON HOẶC DÁN MÃ (IMPORT MODAL)                     */}
      {/* ===================================================================== */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="w-6 h-6 text-yellow-200" />
                <h3 className="font-fredoka font-black text-lg sm:text-xl">
                  NHẬP KỊCH BẢN TỪ FILE JSON
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 sm:p-6 space-y-4">
              {/* File Upload Box */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-3 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/50 hover:bg-amber-100/50 p-6 rounded-2xl text-center cursor-pointer transition-colors"
              >
                <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2 animate-bounce" />
                <p className="font-fredoka font-bold text-slate-800 text-sm">
                  Nhấn để chọn file <span className="text-amber-700 font-black">.json</span> từ máy tính
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Hỗ trợ cả kịch bản đơn lẻ hoặc danh sách nhiều kịch bản
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="relative flex py-1 items-center">
                <div className="grow border-t border-slate-200"></div>
                <span className="shrink mx-4 text-xs font-bold text-slate-400 uppercase">Hoặc dán trực tiếp mã JSON</span>
                <div className="grow border-t border-slate-200"></div>
              </div>

              {/* Textarea Paste */}
              <div>
                <textarea
                  rows={6}
                  value={importJsonText}
                  onChange={e => setImportJsonText(e.target.value)}
                  placeholder="Dán toàn bộ nội dung JSON kịch bản vào đây..."
                  className="w-full font-mono text-xs p-3 rounded-xl border-2 border-slate-300 focus:border-amber-500 focus:outline-hidden text-slate-800 bg-slate-50"
                />
              </div>

              {/* Status Message */}
              {importStatus.message && (
                <div
                  className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
                    importStatus.type === 'success'
                      ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                      : 'bg-rose-100 text-rose-900 border border-rose-300'
                  }`}
                >
                  {importStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{importStatus.message}</span>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setShowSampleModal(true);
                }}
                className="text-xs font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
              >
                Xem cấu trúc JSON mẫu chuẩn
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  Đóng
                </button>
                <button
                  onClick={() => processImport(importJsonText)}
                  disabled={!importJsonText.trim()}
                  className="game-btn-green font-fredoka font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Xác Nhận Nhập
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 📋 MODAL XEM MẪU JSON CHUẨN (SAMPLE JSON VIEWER)                      */}
      {/* ===================================================================== */}
      {showSampleModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code2 className="w-6 h-6 text-yellow-200" />
                <h3 className="font-fredoka font-black text-lg sm:text-xl">
                  CẤU TRÚC FILE JSON MẪU CHUẨN
                </h3>
              </div>
              <button
                onClick={() => setShowSampleModal(false)}
                className="p-1 rounded-full hover:bg-white/20 text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
              <p className="text-slate-600 text-xs">
                Các thầy cô có thể copy đoạn mã JSON này để chỉnh sửa trên Notepad, Word, Excel hoặc các công cụ soạn thảo rồi nhập vào hệ thống:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 text-emerald-300 p-4 rounded-2xl font-mono text-[11px] sm:text-xs overflow-x-auto border-2 border-slate-800 leading-relaxed select-all max-h-[350px]">
                  {sampleJsonCode}
                </pre>
              </div>
            </div>

            <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sampleJsonCode);
                  soundManager.playCoin();
                  showToast('📋 Đã sao chép JSON mẫu chuẩn!');
                }}
                className="game-btn-gold font-fredoka font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                Sao Chép Mẫu JSON
              </button>

              <button
                onClick={() => setShowSampleModal(false)}
                className="game-btn-rose font-fredoka font-bold text-xs px-4 py-2 rounded-xl shadow-xs cursor-pointer"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 👁️ PREVIEW QUESTION MODAL                                             */}
      {/* ===================================================================== */}
      {previewQuestion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col p-5">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <span className="font-fredoka font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-xl text-xs">
                {previewQuestion.tag || 'Xem Trước Câu Hỏi'}
              </span>
              <button
                onClick={() => setPreviewQuestion(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <p className="font-bold text-slate-900 text-sm leading-relaxed">
                {previewQuestion.story}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2">
                {previewQuestion.options.map((opt, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-2xl text-center font-fredoka font-black text-base border-2 ${
                      Number(opt) === Number(previewQuestion.correctAnswer)
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-950'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <span className="text-xs text-slate-400 block font-normal">Đáp án {String.fromCharCode(65 + i)}</span>
                    {opt} {previewQuestion.unit}
                  </div>
                ))}
              </div>

              {previewQuestion.explanation && (
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-950 mt-2">
                  <strong>💡 Lời giải: </strong>
                  {previewQuestion.explanation}
                </div>
              )}
            </div>

            <button
              onClick={() => setPreviewQuestion(null)}
              className="mt-4 game-btn-gold font-fredoka font-bold text-xs py-2 rounded-xl shadow-xs cursor-pointer"
            >
              Đóng Xem Trước
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
