import React, { useState } from 'react';
import { MazeMapTemplate, WorksheetGate } from './WorksheetMazeView';
import { GradeLevel, TeacherLessonScript } from '../types';
import { soundManager } from '../utils/audio';
import {
  Printer,
  X
} from 'lucide-react';

interface PrintableWorksheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  map: MazeMapTemplate;
  gates: WorksheetGate[];
  topicTitle: string;
  grade: GradeLevel;
  activeTeacherScript?: TeacherLessonScript | null;
}

export const PrintableWorksheetModal: React.FC<PrintableWorksheetModalProps> = ({
  isOpen,
  onClose,
  map,
  gates,
  topicTitle,
  grade,
  activeTeacherScript
}) => {
  const [schoolName, setSchoolName] = useState('Trường Tiểu Học: ......................................................');
  const [customTitle, setCustomTitle] = useState(
    activeTeacherScript
      ? `PHIẾU BÀI TẬP: ${activeTeacherScript.title.toUpperCase()}`
      : `PHIẾU BÀI TẬP MÊ CUNG TOÁN HỌC - ${topicTitle.toUpperCase()}`
  );
  const [selectedGrade, setSelectedGrade] = useState<GradeLevel>(
    activeTeacherScript?.grade || grade || 2
  );
  const [printAnswerFormat, setPrintAnswerFormat] = useState<'choice' | 'input'>('choice');
  const [includeAnswerKey, setIncludeAnswerKey] = useState<boolean>(true);

  if (!isOpen) return null;

  const handlePrintTrigger = () => {
    soundManager.playClick();
    window.print();
  };

  const toPercentX = (px: number) => (px / 400) * 100;
  const toPercentY = (py: number) => (py / 480) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/70 backdrop-blur-xs print-modal-backdrop select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[96vh] flex flex-col shadow-2xl border-4 border-slate-900 overflow-hidden print-modal-dialog">
        
        {/* Modal Top Control Bar (Screen Only - Hidden in Print) */}
        <div className="no-print p-3.5 sm:p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b-2 border-indigo-500">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-400 text-amber-950 rounded-2xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-fredoka font-black text-base sm:text-lg text-white">
                In Phiếu Bài Tập Mê Cung Khổ A4
              </h3>
              <p className="text-xs text-indigo-200 font-semibold">
                Định dạng chuẩn trang in học đường kèm đề bài đầy đủ và mê cung vẽ tay
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="btn-trigger-a4-print"
              onClick={handlePrintTrigger}
              className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-fredoka font-black text-xs sm:text-sm rounded-xl shadow-lg border border-emerald-300 flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>In Ngay (Print / PDF)</span>
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              title="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Toolbar Settings for Printing (Screen Only) */}
        <div className="no-print p-3 sm:p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-fredoka font-bold text-slate-700">
          <div className="flex flex-wrap items-center gap-3">
            {/* Format choice */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-300 shadow-xs">
              <button
                onClick={() => setPrintAnswerFormat('choice')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  printAnswerFormat === 'choice'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Trắc Nghiệm (Khoanh A, B, C)
              </button>
              <button
                onClick={() => setPrintAnswerFormat('input')}
                className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                  printAnswerFormat === 'input'
                    ? 'bg-amber-500 text-amber-950'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Tự Luận (Điền Đáp Số)
              </button>
            </div>

            {/* Answer Key Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-xs hover:bg-slate-100">
              <input
                type="checkbox"
                checked={includeAnswerKey}
                onChange={e => setIncludeAnswerKey(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
              <span>In kèm Trang Đáp Án (Cho Giáo Viên)</span>
            </label>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500">Khối Lớp:</span>
            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(parseInt(e.target.value, 10) as GradeLevel)}
              className="bg-white border border-slate-300 rounded-xl px-2.5 py-1 text-xs font-bold text-slate-900 cursor-pointer"
            >
              <option value={1}>Lớp 1</option>
              <option value={2}>Lớp 2</option>
              <option value={3}>Lớp 3</option>
              <option value={4}>Lớp 4</option>
              <option value={5}>Lớp 5</option>
            </select>
          </div>
        </div>

        {/* Scrollable A4 Document Preview Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-200 print-modal-scroll-area">
          
          {/* THE PRINTABLE WORKSHEET DOCUMENT (This exact container prints onto A4) */}
          <div
            id="printable-worksheet-document"
            className="max-w-[210mm] mx-auto bg-white text-black p-4 sm:p-6 rounded-2xl shadow-xl border border-slate-300 text-xs font-nunito leading-tight space-y-3"
          >
            
            {/* ========================================================
                📄 PAGE 1: THE WORKSHEET (Fits on exactly 1 single A4 page)
                ======================================================== */}
            <div className="print-page-1 flex flex-col justify-between">
              
              {/* 1. School & Student Header */}
              <div className="border-b-2 border-slate-900 pb-2 mb-2">
                <div className="flex justify-between items-start text-[11px] font-semibold leading-tight">
                  <div className="space-y-0.5">
                    <p className="font-bold uppercase tracking-wider">{schoolName}</p>
                    <p>Họ và tên học sinh: ................................................................</p>
                    <p>Lớp: .........................   Ngày: ......./......./ 2026</p>
                  </div>
                  <div className="text-right border-2 border-slate-900 p-1.5 rounded-lg min-w-[110px] text-center">
                    <div className="font-black text-[10px] uppercase border-b border-slate-900 pb-0.5">
                      ĐIỂM SỐ
                    </div>
                    <div className="text-base font-black pt-0.5">
                      ....... / 10
                    </div>
                  </div>
                </div>

                {/* Title & Topic */}
                <div className="text-center mt-1.5">
                  <h1 className="font-black text-base uppercase tracking-wide text-slate-900">
                    {customTitle}
                  </h1>
                  <p className="text-[10px] font-bold text-slate-600">
                    Dành cho học sinh Lớp {selectedGrade} • Mẫu Bản Đồ: {map.name}
                  </p>
                </div>

                {/* Student Instructions */}
                <div className="mt-1.5 p-1.5 bg-slate-100 rounded border border-slate-300 text-[10px] leading-snug text-slate-800">
                  <span className="font-bold">★ Hướng dẫn:</span> Giải {gates.length} câu hỏi ở phần bên dưới, khoanh đáp án đúng (hoặc điền số), sau đó dùng bút chì <strong>vẽ đường đi qua mê cung</strong> từ <strong>XUẤT PHÁT (START 🚩)</strong> đến <strong>VỀ ĐÍCH (FINISH 🏆)</strong>!
                </div>
              </div>

              {/* 2. Maze Puzzle Map Block (Compact size ~250px wide, fits perfectly on page 1) */}
              <div className="print-avoid-break flex flex-col items-center justify-center my-1.5">
                <div className="w-full max-w-[260px] relative aspect-[400/480] bg-white border-2 border-black rounded-lg overflow-hidden">
                  
                  {/* SVG Vector Walls */}
                  <svg className="absolute inset-0 w-full h-full bg-white" viewBox={map.viewBox} fill="none">
                    {/* Clean SVG maze walls */}
                    {map.svgWalls}

                    {/* Corridor center guide line */}
                    <polyline
                      points={map.guidePath}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points={map.guidePath}
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  {/* Printed Gate Markers with Clear Question Labels */}
                  {gates.map((gate, idx) => (
                    <div
                      key={`print-gate-${gate.id}`}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none"
                      style={{
                        left: `${toPercentX(gate.x)}%`,
                        top: `${toPercentY(gate.y)}%`
                      }}
                    >
                      <div className="bg-white border border-black rounded px-1 py-0.2 shadow-2xs flex items-center justify-center gap-0.5 whitespace-nowrap text-[8px] font-black text-black">
                        <span className="bg-black text-white px-1 py-0.2 rounded-2xs font-bold text-[7px]">
                          Ải {idx + 1}
                        </span>
                        <span>{gate.question}</span>
                      </div>
                    </div>
                  ))}

                  {/* START Marker */}
                  <div
                    className="absolute transform -translate-x-1/2 flex items-center gap-0.5 font-black text-[9px] text-black bg-white border border-black px-1.5 py-0.2 rounded-full"
                    style={{
                      left: `${toPercentX(map.startLabelPos.x)}%`,
                      top: `${toPercentY(map.startLabelPos.y)}%`
                    }}
                  >
                    <span>🚩 START</span>
                  </div>

                  {/* FINISH Marker */}
                  <div
                    className="absolute transform -translate-x-1/2 flex items-center gap-0.5 font-black text-[9px] text-black bg-white border border-black px-1.5 py-0.2 rounded-full"
                    style={{
                      left: `${toPercentX(map.finishLabelPos.x)}%`,
                      top: `${toPercentY(map.finishLabelPos.y)}%`
                    }}
                  >
                    <span>🏆 FINISH</span>
                  </div>
                </div>
                <p className="text-[9px] text-slate-500 font-semibold mt-0.5">
                  (Hình 1: Bản đồ hành lang mê cung số học)
                </p>
              </div>

              {/* 3. Detailed Questions Section (Formatted in responsive column grid for space efficiency) */}
              <div className="print-avoid-break pt-1.5 border-t-2 border-slate-900">
                <h2 className="font-black text-xs uppercase tracking-wider text-slate-900 mb-1.5 flex items-center justify-between">
                  <span>PHẦN BÀI TẬP: CÁC CÂU HỎI VƯỢT ẢI ({gates.length} CÂU)</span>
                  <span className="text-[9px] font-normal text-slate-600">
                    {printAnswerFormat === 'choice' ? 'Khoanh tròn vào đáp án đúng' : 'Ghi đáp số vào chỗ trống'}
                  </span>
                </h2>

                {/* Question Cards Grid */}
                <div className={`grid ${gates.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 text-[10px] leading-tight`}>
                  {gates.map((gate, idx) => (
                    <div
                      key={`print-q-${gate.id}`}
                      className="p-1.5 bg-slate-50 rounded border border-slate-400 print-avoid-break flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="font-black bg-slate-900 text-white px-1 py-0.2 rounded text-[8px]">
                            Ải {idx + 1}
                          </span>
                          <span className="font-bold text-[10px] text-slate-900">
                            {gate.question} = ?
                          </span>
                        </div>
                        <p className="text-[9.5px] font-semibold text-slate-800 mb-1 line-clamp-3">
                          {gate.storyText || `Tính kết quả: ${gate.question}`}
                        </p>
                      </div>

                      {printAnswerFormat === 'choice' ? (
                        <div className="flex items-center justify-between gap-1 mt-0.5 pt-0.5 border-t border-slate-200 text-[9.5px] font-bold text-slate-900">
                          {gate.options.map((opt, oIdx) => {
                            const label = String.fromCharCode(65 + oIdx); // A, B, C
                            return (
                              <div key={`opt-${opt}`} className="flex items-center gap-0.5">
                                <span className="font-extrabold text-slate-950">
                                  {label}.
                                </span>
                                <span className="font-medium">{opt}</span>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="mt-0.5 pt-0.5 border-t border-dashed border-slate-300 flex items-center justify-between text-[9px]">
                          <span className="font-semibold text-slate-600">Đáp số:</span>
                          <span className="font-bold text-slate-800">............</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Teacher's Evaluation & Parent Signature */}
              <div className="print-avoid-break mt-2 pt-1.5 border-t border-slate-400 flex justify-between items-start text-[10px]">
                <div className="flex-1 pr-3">
                  <p className="font-bold">Nhận xét của giáo viên:</p>
                  <p className="text-slate-400 mt-0.5">.................................................................................................................................</p>
                </div>
                <div className="text-center min-w-[130px]">
                  <p className="font-bold">Chữ ký phụ huynh</p>
                  <p className="text-[9px] text-slate-500 italic">(Ký, ghi rõ họ tên)</p>
                  <div className="h-6"></div>
                </div>
              </div>

            </div>

            {/* ========================================================
                📄 PAGE 2: TEACHER ANSWER KEY & GRADING GUIDE (OPTIONAL)
                ======================================================== */}
            {includeAnswerKey && (
              <div className="print-page-2 pt-4 border-t-4 border-slate-900 mt-4 print-avoid-break">
                <div className="text-center mb-2.5">
                  <h2 className="font-black text-xs sm:text-sm uppercase text-slate-900">
                    BẢNG ĐÁP ÁN & HƯỚNG DẪN CHẤM ({gates.length} CÂU HỎI)
                  </h2>
                  <p className="text-[10px] text-slate-600 font-semibold">
                    Phiếu bài tập: {customTitle}
                  </p>
                </div>

                <table className="w-full border-collapse border border-slate-900 text-[10px]">
                  <thead>
                    <tr className="bg-slate-200 font-bold">
                      <th className="border border-slate-900 p-1 text-center w-10">Ải</th>
                      <th className="border border-slate-900 p-1 text-left">Đề Bài / Biểu Thức</th>
                      <th className="border border-slate-900 p-1 text-center w-20">Đáp Số Đúng</th>
                      <th className="border border-slate-900 p-1 text-center w-16">Điểm</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gates.map((gate, idx) => {
                      const pt = gates.length > 0 ? (9.0 / gates.length).toFixed(1) : '1.0';
                      return (
                        <tr key={`ans-row-${gate.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="border border-slate-900 p-1 text-center font-bold">Ải {idx + 1}</td>
                          <td className="border border-slate-900 p-1">
                            {gate.storyText || `${gate.question} = ?`}
                          </td>
                          <td className="border border-slate-900 p-1 text-center font-black text-emerald-800">
                            {gate.correctAnswer}
                          </td>
                          <td className="border border-slate-900 p-1 text-center font-semibold">{pt} điểm</td>
                        </tr>
                      );
                    })}
                    <tr className="bg-slate-100 font-bold">
                      <td colSpan={3} className="border border-slate-900 p-1 text-right">
                        Vẽ đúng đường đi xuyên qua mê cung từ START đến FINISH:
                      </td>
                      <td className="border border-slate-900 p-1 text-center">1.0 điểm</td>
                    </tr>
                    <tr className="bg-slate-200 font-black">
                      <td colSpan={3} className="border border-slate-900 p-1 text-right">
                        TỔNG ĐIỂM:
                      </td>
                      <td className="border border-slate-900 p-1 text-center text-slate-900">10 / 10</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
