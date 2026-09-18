import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import {
  TileMazeData,
  QuestionCategory,
  MazeDifficulty,
  GradeLevel
} from '../types';
import { generateTileMaze } from '../utils/tileMazeGenerator';
import { FractionDisplay } from './FractionDisplay';
import { AvatarDisplay } from './AvatarDisplay';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Map,
  Clock,
  Coins,
  Star,
  Zap,
  HelpCircle,
  Footprints,
  AlertTriangle,
  Trophy,
  CheckCircle2,
  ChevronRight,
  Share2
} from 'lucide-react';

interface MathTileMazeViewProps {
  category?: QuestionCategory;
  grade?: GradeLevel;
  difficulty?: MazeDifficulty;
  customTarget?: number;
  levelTitle?: string;
  onBackToMenu?: () => void;
  onNextLevel?: () => void;
}

export const MathTileMazeView: React.FC<MathTileMazeViewProps> = ({
  category = 'comparison',
  grade: propGrade,
  difficulty = 'medium',
  customTarget,
  levelTitle,
  onBackToMenu,
  onNextLevel
}) => {
  const {
    profile,
    activeWorldId,
    activeLevelId,
    setActiveLevelId,
    setCurrentMode,
    saveLevelResult,
    recordQuestionAnswered,
    addCoinsAndGems
  } = useGame();

  const currentGrade = propGrade || profile.grade;

  // Maze State
  const [maze, setMaze] = useState<TileMazeData | null>(null);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [invalidCellShake, setInvalidCellShake] = useState<{ x: number; y: number } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintStepsCount, setHintStepsCount] = useState<number>(0);

  // Performance Stats
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [comboCount, setComboCount] = useState<number>(0);
  const [floatingText, setFloatingText] = useState<{ id: number; text: string; x: number; y: number } | null>(null);
  const [coinsGathered, setCoinsGathered] = useState<number>(0);
  const [gemsGathered, setGemsGathered] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  const timerRef = useRef<number | null>(null);

  // Initialize or Regenerate Maze
  const initMaze = useCallback(() => {
    const newMaze = generateTileMaze(category, currentGrade, difficulty, customTarget);
    setMaze(newMaze);
    setPlayerPos({ x: newMaze.startX, y: newMaze.startY });
    setVisitedCells(new Set([`${newMaze.startX},${newMaze.startY}`]));
    setInvalidCellShake(null);
    setShowHint(false);
    setHintStepsCount(0);
    setTimeElapsed(0);
    setMistakesCount(0);
    setComboCount(0);
    setFloatingText(null);
    setCoinsGathered(0);
    setGemsGathered(0);
    setIsCompleted(false);
    setShowVictoryModal(false);
  }, [category, currentGrade, difficulty, customTarget]);

  useEffect(() => {
    initMaze();
  }, [initMaze]);

  // Timer Tick
  useEffect(() => {
    if (isCompleted) return;

    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted]);

  // Handle Player Movement
  const attemptMove = useCallback(
    (dx: number, dy: number) => {
      if (!maze || isCompleted) return;

      const targetX = playerPos.x + dx;
      const targetY = playerPos.y + dy;

      // Check bounds
      if (targetX < 0 || targetX >= maze.width || targetY < 0 || targetY >= maze.height) {
        return;
      }

      const targetCell = maze.grid[targetY][targetX];

      // Check if target is valid or goal
      if (targetCell.isValid || targetCell.isGoal) {
        // Success step
        setPlayerPos({ x: targetX, y: targetY });
        setVisitedCells(prev => new Set(prev).add(`${targetX},${targetY}`));
        soundManager.playMove();

        // Increment Combo
        setComboCount(prev => {
          const next = prev + 1;
          if (next >= 3) {
            setFloatingText({
              id: Date.now(),
              text: `🔥 COMBO x${next}!`,
              x: targetX,
              y: targetY
            });
          }
          return next;
        });

        // Check for bonus items
        if (targetCell.bonusCoin) {
          targetCell.bonusCoin = false;
          setCoinsGathered(prev => prev + 15);
          soundManager.playCoin();
          setFloatingText({
            id: Date.now() + 1,
            text: '+15 🪙',
            x: targetX,
            y: targetY
          });
        }
        if (targetCell.bonusGem) {
          targetCell.bonusGem = false;
          setGemsGathered(prev => prev + 5);
          soundManager.playCoin();
          setFloatingText({
            id: Date.now() + 2,
            text: '+5 💎',
            x: targetX,
            y: targetY
          });
        }

        recordQuestionAnswered(true);

        // Check Goal
        if (targetCell.isGoal || (targetX === maze.goalX && targetY === maze.goalY)) {
          handleVictory();
        }
      } else {
        // Invalid step: reset combo, soft shake & audio feedback
        soundManager.playWrong();
        setComboCount(0);
        setInvalidCellShake({ x: targetX, y: targetY });
        setMistakesCount(prev => prev + 1);
        recordQuestionAnswered(false);

        setFloatingText({
          id: Date.now(),
          text: '💥 Ô chưa đúng!',
          x: targetX,
          y: targetY
        });

        setTimeout(() => {
          setInvalidCellShake(null);
        }, 650);
      }
    },
    [maze, playerPos, isCompleted, recordQuestionAnswered]
  );

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        attemptMove(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        attemptMove(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        attemptMove(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        attemptMove(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [attemptMove, isCompleted]);

  // Handle Level Victory
  const handleVictory = () => {
    setIsCompleted(true);
    soundManager.playVictory();

    // Calculate stars: 0 mistakes = 3 stars, 1-2 mistakes = 2 stars, 3+ mistakes = 1 star
    let stars = 3;
    if (mistakesCount >= 3) stars = 1;
    else if (mistakesCount >= 1) stars = 2;

    setEarnedStars(stars);

    const timeBonus = Math.max(0, 200 - timeElapsed * 3);
    const score = stars * 400 + coinsGathered * 10 + gemsGathered * 30 + timeBonus;

    const totalCoinsEarned = coinsGathered + stars * 25 + 40;
    const totalGemsEarned = gemsGathered + (stars === 3 ? 3 : 1);

    addCoinsAndGems(totalCoinsEarned, totalGemsEarned);
    saveLevelResult(activeWorldId, activeLevelId, stars, timeElapsed, score);

    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setShowVictoryModal(true);
  };

  // Hint activation
  const handleTriggerHint = () => {
    if (!maze) return;
    soundManager.playClick();
    setShowHint(true);
    setHintStepsCount(prev => prev + 2);
  };

  if (!maze) return null;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto p-2 sm:p-4 space-y-4 select-none">
      {/* Top Banner: Mission & Stats HUD */}
      <div className="bg-white/95 rounded-3xl p-3 sm:p-5 shadow-2xl border-4 border-amber-400 space-y-3.5">
        
        {/* Navigation & Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <button
              id="btn-back-to-overview"
              onClick={() => {
                soundManager.playClick();
                if (onBackToMenu) onBackToMenu();
                else setCurrentMode('world_map');
              }}
              className="game-btn-gold px-4 py-2 rounded-2xl font-fredoka font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Map className="w-4 h-4" />
              <span>Bản Đồ</span>
            </button>

            <div>
              <h2 className="font-fredoka font-black text-lg sm:text-2xl text-slate-900 flex items-center gap-2">
                <span>{levelTitle || maze.challenge.title}</span>
                <span className="text-xs font-black bg-amber-100 text-amber-900 px-3 py-0.5 rounded-full border border-amber-300">
                  Lớp {currentGrade}
                </span>
              </h2>
            </div>
          </div>

          {/* Realtime stats badge: Hearts, Combo, Timer */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 font-fredoka">
            {/* Lives Heart Bar (3 Hearts) */}
            <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-2xl border-2 border-rose-200 shadow-xs">
              {[0, 1, 2].map(heartIdx => {
                const isLost = mistakesCount > heartIdx;
                return (
                  <span
                    key={heartIdx}
                    className={`text-base transition-transform ${
                      isLost ? 'opacity-30 grayscale scale-75' : 'animate-pulse-subtle scale-100'
                    }`}
                  >
                    ❤️
                  </span>
                );
              })}
            </div>

            {/* Combo Multiplier Badge */}
            {comboCount >= 2 && (
              <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black border-2 border-orange-300 shadow-md animate-bounce">
                <span>🔥 COMBO x{comboCount}</span>
              </div>
            )}

            {/* Timer */}
            <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-2xl text-slate-700 text-xs sm:text-sm font-black border border-slate-300 shadow-xs">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{formatTime(timeElapsed)}</span>
            </div>

            {/* Steps */}
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-900 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-black border-2 border-emerald-300 shadow-xs">
              <Footprints className="w-4 h-4 text-emerald-600" />
              <span>{visitedCells.size} bước</span>
            </div>

            {/* Restart */}
            <button
              id="btn-quick-restart"
              onClick={() => {
                soundManager.playClick();
                initMaze();
              }}
              className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl border-2 border-slate-300 shadow-xs transition-transform active:scale-95 cursor-pointer"
              title="Chơi lại mê cung này"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Big Highlighted Mission Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-2xl p-3.5 sm:p-4 text-white shadow-lg flex items-center justify-between gap-3 border-3 border-amber-600">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0 animate-bounce border border-white/30">
              🎯
            </div>
            <div>
              <span className="text-[11px] sm:text-xs font-fredoka font-black uppercase tracking-wider text-amber-100 block">
                Quy Luật Thần Bí Cần Đi Theo
              </span>
              <p className="font-fredoka font-black text-base sm:text-xl text-white drop-shadow-md">
                {maze.challenge.prompt}
              </p>
            </div>
          </div>

          {/* Hint button */}
          <button
            id="btn-use-hint-wand"
            onClick={handleTriggerHint}
            className="flex items-center gap-1.5 game-btn-gold font-fredoka font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-900 animate-spin" />
            <span className="hidden sm:inline">Gợi Ý Thần Kỳ</span>
          </button>
        </div>

      </div>

      {/* Main Playing Area: Grid + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Left 3 cols: Tile Grid Canvas */}
        <div className="lg:col-span-3 bg-white/95 rounded-3xl p-3 sm:p-5 shadow-2xl border-4 border-amber-400 flex flex-col items-center justify-center relative overflow-hidden">
          
          {/* Subtle Background Rune Circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-200/20 rounded-full blur-xl pointer-events-none" />

          {/* Floating Toast / Combo Notifications */}
          {floatingText && (
            <div
              key={floatingText.id}
              className="absolute top-6 z-40 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-fredoka font-black text-sm sm:text-base px-4 py-1.5 rounded-full shadow-2xl border-2 border-white animate-bounce pointer-events-none"
            >
              {floatingText.text}
            </div>
          )}

          <div
            className="grid gap-2.5 sm:gap-3.5 p-3 sm:p-5 bg-gradient-to-br from-amber-100/60 to-amber-200/40 rounded-3xl border-3 border-amber-300 shadow-inner w-full"
            style={{
              gridTemplateColumns: `repeat(${maze.width}, minmax(0, 1fr))`,
              maxWidth: maze.width <= 4 ? '460px' : maze.width === 5 ? '540px' : '620px'
            }}
          >
            {maze.grid.map((row, y) =>
              row.map((cell, x) => {
                const isPlayer = playerPos.x === x && playerPos.y === y;
                const isVisited = visitedCells.has(`${x},${y}`);
                const isShaking = invalidCellShake?.x === x && invalidCellShake?.y === y;
                const isAdjacent =
                  Math.abs(x - playerPos.x) + Math.abs(y - playerPos.y) === 1;

                // Solution hint visual
                const isHintCell =
                  showHint &&
                  maze.solutionPath
                    .slice(0, Math.min(maze.solutionPath.length, hintStepsCount + 3))
                    .some(([sx, sy]) => sx === x && sy === y);

                return (
                  <div
                    key={`tile-${x}-${y}`}
                    id={`tile-cell-${x}-${y}`}
                    onClick={() => {
                      if (isAdjacent) {
                        attemptMove(x - playerPos.x, y - playerPos.y);
                      }
                    }}
                    className={`aspect-square relative rounded-2xl flex flex-col items-center justify-center p-1 sm:p-2 transition-all duration-200 border-3 select-none ${
                      isShaking
                        ? 'bg-rose-200 border-rose-600 scale-95 animate-shake ring-4 ring-rose-400 z-20'
                        : cell.isStart
                        ? 'bg-gradient-to-br from-emerald-100 to-teal-200 border-emerald-500 shadow-md ring-2 ring-emerald-300'
                        : cell.isGoal
                        ? 'bg-gradient-to-br from-yellow-300 via-amber-300 to-yellow-400 border-yellow-600 shadow-xl animate-pulse-subtle ring-2 ring-yellow-400'
                        : isPlayer
                        ? 'bg-amber-300 border-amber-600 shadow-lg ring-4 ring-amber-400/80 z-20'
                        : isVisited
                        ? 'bg-emerald-50/90 border-emerald-300 shadow-xs'
                        : isHintCell
                        ? 'bg-cyan-100 border-cyan-400 shadow-md ring-4 ring-cyan-300 animate-pulse-subtle'
                        : isAdjacent
                        ? 'bg-white hover:bg-amber-100/90 border-amber-400 hover:border-amber-600 cursor-pointer shadow-md active:scale-95'
                        : 'bg-white/90 border-amber-200/80 shadow-xs'
                    }`}
                  >
                    {/* Bonus Coin / Gem with Sparkle */}
                    {cell.bonusCoin && !isPlayer && (
                      <span className="absolute top-1 right-1 text-xs animate-coin-spin">🪙</span>
                    )}
                    {cell.bonusGem && !isPlayer && (
                      <span className="absolute top-1 right-1 text-xs animate-wiggle">💎</span>
                    )}

                    {/* Start Flag */}
                    {cell.isStart && !isPlayer && (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-2xl sm:text-3xl animate-bounce">🚩</span>
                        <span className="text-[10px] sm:text-xs font-fredoka font-black text-emerald-900 uppercase mt-0.5">
                          Khởi Đầu
                        </span>
                      </div>
                    )}

                    {/* Goal Golden Portal */}
                    {cell.isGoal && !isPlayer && (
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-3xl sm:text-4xl animate-bounce">👑</span>
                        <span className="text-[10px] sm:text-xs font-fredoka font-black text-amber-950 uppercase mt-0.5">
                          Kho Báu
                        </span>
                      </div>
                    )}

                    {/* Regular Cell Content (Number / Equation / Fraction) */}
                    {!cell.isStart && !cell.isGoal && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-center">
                        {cell.fraction ? (
                          <FractionDisplay fraction={cell.fraction} size="sm" showVisual={true} />
                        ) : (
                          <span
                            className={`font-fredoka font-black leading-tight break-words max-w-full px-1 ${
                              cell.display.length > 7
                                ? 'text-xs sm:text-sm text-slate-800'
                                : cell.display.length > 4
                                ? 'text-sm sm:text-lg text-slate-800'
                                : 'text-base sm:text-2xl text-slate-900'
                            }`}
                          >
                            {cell.display}
                          </span>
                        )}

                        {cell.subtitle && (
                          <span className="text-[10px] text-slate-500 font-bold mt-0.5">
                            {cell.subtitle}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Player Character Sprite */}
                    {isPlayer && (
                      <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none scale-110 sm:scale-125">
                        <AvatarDisplay
                          customization={profile.customization}
                          size="sm"
                          showPet={false}
                          animate={true}
                        />
                      </div>
                    )}

                  </div>
                );
              })
            )}
          </div>

          {/* D-Pad on-screen controller with 3D Arcade Buttons */}
          <div className="w-full mt-4 pt-3 border-t-2 border-amber-300/80 flex flex-wrap items-center justify-between gap-3">
            <div className="text-xs text-amber-900 font-bold hidden sm:block">
              💡 Bấm phím mũi tên ⬆️ ⬇️ ⬅️ ➡️ hoặc nhấp vào ô cạnh bên để di chuyển
            </div>

            <div className="flex flex-col items-center gap-1.5 mx-auto sm:mx-0">
              <button
                id="btn-move-up"
                onClick={() => attemptMove(0, -1)}
                className="w-12 h-12 game-btn-gold rounded-2xl flex items-center justify-center font-bold text-slate-900 cursor-pointer"
              >
                <ArrowUp className="w-6 h-6 stroke-[3]" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  id="btn-move-left"
                  onClick={() => attemptMove(-1, 0)}
                  className="w-12 h-12 game-btn-gold rounded-2xl flex items-center justify-center font-bold text-slate-900 cursor-pointer"
                >
                  <ArrowLeft className="w-6 h-6 stroke-[3]" />
                </button>
                <button
                  id="btn-move-down"
                  onClick={() => attemptMove(0, 1)}
                  className="w-12 h-12 game-btn-gold rounded-2xl flex items-center justify-center font-bold text-slate-900 cursor-pointer"
                >
                  <ArrowDown className="w-6 h-6 stroke-[3]" />
                </button>
                <button
                  id="btn-move-right"
                  onClick={() => attemptMove(1, 0)}
                  className="w-12 h-12 game-btn-gold rounded-2xl flex items-center justify-center font-bold text-slate-900 cursor-pointer"
                >
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 col: Character RPG Card & Rule Helper */}
        <div className="space-y-4">
          
          {/* Character Card */}
          <div className="bg-white/95 rounded-3xl p-4 shadow-xl border-3 border-amber-300 text-center">
            <div className="flex justify-center mb-2">
              <AvatarDisplay customization={profile.customization} size="md" showTrail={true} />
            </div>
            <h3 className="font-fredoka font-black text-lg text-slate-900">{profile.name}</h3>
            <p className="text-xs text-amber-800 font-bold mb-3">Hiệp Sĩ Mê Cung</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-fredoka">
              <div className="bg-amber-50 p-2.5 rounded-2xl border-2 border-amber-200">
                <span className="text-slate-500 font-bold block">Bước Đi</span>
                <span className="text-base font-black text-amber-900">{visitedCells.size} ô</span>
              </div>
              <div className="bg-emerald-50 p-2.5 rounded-2xl border-2 border-emerald-200">
                <span className="text-slate-500 font-bold block">Vàng Lượm</span>
                <span className="text-base font-black text-emerald-800">+{coinsGathered} 🪙</span>
              </div>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 rounded-3xl p-4 text-white shadow-xl space-y-2.5 border-2 border-indigo-400">
            <div className="flex items-center gap-2 font-fredoka font-black text-base">
              <Zap className="w-5 h-5 text-yellow-300 animate-pulse-subtle" />
              <span>Bí Kíp Qua Màn</span>
            </div>
            <p className="text-xs text-indigo-100 font-semibold leading-relaxed">
              {maze.challenge.ruleDescription}. Hãy nhẩm tính thật nhanh ô nào đúng quy tắc ở cạnh bên để bước tới!
            </p>
            <div className="bg-white/15 rounded-2xl p-2.5 text-xs font-black text-yellow-200 border border-white/20">
              ⭐ Mẹo 3 Sao: Hoàn thành không phạm lỗi sai nào để đạt trọn vẹn 3 sao danh giá!
            </div>
          </div>

        </div>

      </div>

      {/* Victory Level Celebration Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-500 text-center relative overflow-hidden animate-in zoom-in-95">
            
            <div className="text-6xl mb-2 animate-bounce">🏆</div>
            <h3 className="font-fredoka font-black text-2xl sm:text-3xl text-amber-950 mb-1">
              CHIẾN THẮNG HOANH TRÁNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-bold mb-4">
              Em đã hoàn thành xuất sắc mê cung số học!
            </p>

            {/* Stars Rating with animation */}
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3].map(starNum => (
                <div
                  key={starNum}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg transition-all ${
                    starNum <= earnedStars
                      ? 'bg-gradient-to-b from-yellow-300 to-amber-500 border-2 border-yellow-200 scale-110 animate-bounce'
                      : 'bg-slate-200 text-slate-400 border border-slate-300'
                  }`}
                >
                  <Star className={`w-9 h-9 ${starNum <= earnedStars ? 'fill-yellow-100 text-yellow-100 drop-shadow-md' : 'text-slate-400'}`} />
                </div>
              ))}
            </div>

            {/* Summary Statistics */}
            <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 grid grid-cols-3 gap-2 mb-3 font-fredoka">
              <div>
                <span className="text-xs text-slate-500 font-bold block">Thời gian</span>
                <span className="text-base font-black text-slate-800">{formatTime(timeElapsed)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Số lỗi</span>
                <span className="text-base font-black text-rose-600">{mistakesCount} lần</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 font-bold block">Thưởng</span>
                <span className="text-base font-black text-amber-700">+{coinsGathered + earnedStars * 25 + 40} 🪙</span>
              </div>
            </div>

            {/* Star Vault Notice */}
            <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-300 rounded-xl p-2.5 mb-5 flex items-center justify-center gap-2 font-fredoka text-xs sm:text-sm font-black text-amber-950 shadow-xs">
              <Star className="w-4 h-4 fill-yellow-500 text-yellow-600 animate-wiggle" />
              <span>+{earnedStars} ⭐ Đã thêm vào Kho Sao mở khóa bản đồ!</span>
            </div>

            {/* Navigation buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5">
              <button
                id="btn-modal-replay"
                onClick={() => {
                  soundManager.playClick();
                  initMaze();
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-fredoka font-black text-sm transition-colors border-2 border-slate-300 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại</span>
              </button>

              <button
                id="btn-modal-menu"
                onClick={() => {
                  soundManager.playClick();
                  if (onBackToMenu) onBackToMenu();
                  else setCurrentMode('world_map');
                }}
                className="flex-1 py-3 game-btn-gold rounded-2xl font-fredoka font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Map className="w-4 h-4" />
                <span>Bản Đồ</span>
              </button>

              <button
                id="btn-modal-next"
                onClick={() => {
                  soundManager.playClick();
                  if (onNextLevel) onNextLevel();
                  else initMaze();
                }}
                className="flex-1 py-3 game-btn-green rounded-2xl font-fredoka font-black text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Màn Kế Tiếp ➡️</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
