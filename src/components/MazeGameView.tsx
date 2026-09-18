import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { MazeData, MazeGate } from '../types';
import { generateMaze } from '../utils/mazeEngine';
import { CAMPAIGN_WORLDS } from '../data/campaignData';
import { soundManager } from '../utils/audio';
import { AvatarDisplay } from './AvatarDisplay';
import confetti from 'canvas-confetti';
import {
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  RotateCcw,
  Map,
  Volume2,
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Star,
  Zap,
  HelpCircle,
  Compass
} from 'lucide-react';

export const MazeGameView: React.FC = () => {
  const {
    profile,
    activeWorldId,
    activeLevelId,
    customPracticeConfig,
    exitCustomPractice,
    setActiveLevelId,
    setCurrentMode,
    saveLevelResult,
    recordQuestionAnswered,
    addCoinsAndGems
  } = useGame();

  const isCustomMode = Boolean(customPracticeConfig && customPracticeConfig.isActive);
  const currentWorld = CAMPAIGN_WORLDS.find(w => w.id === activeWorldId) || CAMPAIGN_WORLDS[0];

  // Maze State
  const [maze, setMaze] = useState<MazeData | null>(null);
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [visitedCells, setVisitedCells] = useState<Set<string>>(new Set());
  const [activeGate, setActiveGate] = useState<MazeGate | null>(null);
  const [gateFeedback, setGateFeedback] = useState<{ type: 'correct' | 'wrong'; message: string } | null>(null);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [hintIndex, setHintIndex] = useState<number>(0);

  // Stats & Progress
  const [coinsGathered, setCoinsGathered] = useState<number>(0);
  const [gemsGathered, setGemsGathered] = useState<number>(0);
  const [mistakes, setMistakes] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [earnedStars, setEarnedStars] = useState<number>(3);
  const [showVictoryModal, setShowVictoryModal] = useState<boolean>(false);

  // Timer Ref
  const timerRef = useRef<number | null>(null);

  // Generate Maze on Level / World Change or Custom Practice
  const initLevel = useCallback(() => {
    if (isCustomMode && customPracticeConfig) {
      const mazeDim = customPracticeConfig.mazeSize || 13;
      const op = customPracticeConfig.operator || '+';
      const maxNum = customPracticeConfig.maxNumber || 20;
      const grade = customPracticeConfig.grade || profile.grade;
      const opName = op === '+' ? 'Cộng' : op === '-' ? 'Trừ' : op === '×' ? 'Nhân' : 'Chia';

      const newMaze = generateMaze(
        mazeDim,
        mazeDim,
        grade,
        op,
        1,
        `Tự Chọn: Phép ${opName}`,
        `Phạm vi số: ${maxNum} • Lớp ${grade} • Cỡ ${mazeDim}x${mazeDim}`,
        maxNum
      );

      setMaze(newMaze);
      setPlayerPos({ x: newMaze.startX, y: newMaze.startY });
      setVisitedCells(new Set([`${newMaze.startX},${newMaze.startY}`]));
      setActiveGate(null);
      setGateFeedback(null);
      setShowHint(false);
      setHintIndex(0);
      setCoinsGathered(0);
      setGemsGathered(0);
      setMistakes(0);
      setTimeElapsed(0);
      setIsCompleted(false);
      setShowVictoryModal(false);
      return;
    }

    // Maze size scales slightly with level index
    const mazeDim = Math.min(19, 11 + Math.floor((activeLevelId - 1) / 2) * 2);
    const op = currentWorld.operations[Math.floor(Math.random() * currentWorld.operations.length)];

    const newMaze = generateMaze(
      mazeDim,
      mazeDim,
      profile.grade,
      op,
      activeLevelId,
      `${currentWorld.vietnameseName} - Màn ${activeLevelId}`,
      `Khám phá và giải các phép tính ${op} để mở cửa về đích!`
    );

    setMaze(newMaze);
    setPlayerPos({ x: newMaze.startX, y: newMaze.startY });
    setVisitedCells(new Set([`${newMaze.startX},${newMaze.startY}`]));
    setActiveGate(null);
    setGateFeedback(null);
    setShowHint(false);
    setHintIndex(0);
    setCoinsGathered(0);
    setGemsGathered(0);
    setMistakes(0);
    setTimeElapsed(0);
    setIsCompleted(false);
    setShowVictoryModal(false);
  }, [activeLevelId, currentWorld, profile.grade, isCustomMode, customPracticeConfig]);

  useEffect(() => {
    initLevel();
  }, [initLevel]);

  // Timer Interval
  useEffect(() => {
    if (isCompleted || activeGate !== null) return;

    timerRef.current = window.setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted, activeGate]);

  // Move Player Function
  const movePlayer = useCallback(
    (dx: number, dy: number) => {
      if (!maze || isCompleted || activeGate !== null) return;

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Check boundary & walls
      if (newX < 0 || newX >= maze.width || newY < 0 || newY >= maze.height) return;
      if (maze.grid[newY][newX] === 1) {
        soundManager.playWrong();
        return;
      }

      // Check if entering an unsolved Gate
      const gate = maze.gates.find(g => g.x === newX && g.y === newY && !g.passed);
      if (gate) {
        setActiveGate(gate);
        soundManager.playMove();
        return;
      }

      // Check collectibles
      const colIdx = maze.collectibles.findIndex(c => c.x === newX && c.y === newY && !c.collected);
      if (colIdx !== -1) {
        const item = maze.collectibles[colIdx];
        item.collected = true;
        if (item.type === 'coin') {
          setCoinsGathered(prev => prev + item.value);
          soundManager.playCoin();
        } else if (item.type === 'gem') {
          setGemsGathered(prev => prev + item.value);
          soundManager.playCoin();
        }
      }

      // Move player
      setPlayerPos({ x: newX, y: newY });
      setVisitedCells(prev => new Set(prev).add(`${newX},${newY}`));
      soundManager.playMove();

      // Check Finish
      if (newX === maze.finishX && newY === maze.finishY) {
        handleLevelComplete();
      }
    },
    [maze, isCompleted, activeGate, playerPos]
  );

  // Keyboard Movement Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeGate !== null || isCompleted) return;

      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        movePlayer(0, -1);
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        movePlayer(0, 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        movePlayer(-1, 0);
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        movePlayer(1, 0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, activeGate, isCompleted]);

  // Handle Gate Answer Choice
  const handleAnswerGate = (choiceAnswer: number) => {
    if (!activeGate || !maze) return;

    const isCorrect = choiceAnswer === activeGate.question.correctAnswer;
    recordQuestionAnswered(isCorrect);

    if (isCorrect) {
      soundManager.playCorrect();
      soundManager.playGateUnlock();
      setGateFeedback({
        type: 'correct',
        message: `Chính xác! ${activeGate.question.explanation || ''} 🎉`
      });

      // Award bonus coins for correct answer
      setCoinsGathered(prev => prev + 20);

      setTimeout(() => {
        // Mark gate as passed
        activeGate.passed = true;
        setPlayerPos({ x: activeGate.x, y: activeGate.y });
        setVisitedCells(prev => new Set(prev).add(`${activeGate.x},${activeGate.y}`));
        setActiveGate(null);
        setGateFeedback(null);

        // Check if gate was on finish
        if (activeGate.x === maze.finishX && activeGate.y === maze.finishY) {
          handleLevelComplete();
        }
      }, 900);
    } else {
      soundManager.playWrong();
      setMistakes(prev => prev + 1);
      setGateFeedback({
        type: 'wrong',
        message: 'Chưa đúng rồi! Hãy suy nghĩ thật kỹ và thử lại nhé!'
      });
    }
  };

  // Level Complete Celebration
  const handleLevelComplete = () => {
    setIsCompleted(true);
    soundManager.playVictory();

    // Calculate stars
    let stars = 3;
    if (mistakes >= 3) stars = 1;
    else if (mistakes >= 1) stars = 2;

    setEarnedStars(stars);

    // Calculate score
    const timeBonus = Math.max(0, 300 - timeElapsed * 2);
    const score = stars * 500 + coinsGathered * 10 + gemsGathered * 50 + timeBonus;

    const totalCoinsEarned = coinsGathered + stars * 30 + 50;
    const totalGemsEarned = gemsGathered + (stars === 3 ? 5 : 2);

    addCoinsAndGems(totalCoinsEarned, totalGemsEarned);
    saveLevelResult(activeWorldId, activeLevelId, stars, timeElapsed, score);

    // Confetti
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch {
      // ignore
    }

    setShowVictoryModal(true);
  };

  // Hint wand button
  const handleUseHint = () => {
    if (!maze) return;
    soundManager.playClick();
    setShowHint(true);
    setHintIndex(prev => prev + 3);
  };

  if (!maze) return null;

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const solvedGatesCount = maze.gates.filter(g => g.passed).length;

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-4">
      {/* Top Level Info Bar */}
      <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-lg border-3 border-amber-300 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Level Title & World Badge */}
        <div className="flex items-center gap-3">
          <button
            id="btn-back-to-map"
            onClick={() => {
              soundManager.playClick();
              if (isCustomMode) {
                exitCustomPractice();
              } else {
                setCurrentMode('world_map');
              }
            }}
            className="flex items-center gap-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-2 rounded-2xl font-fredoka font-bold text-xs sm:text-sm transition-all"
          >
            <Map className="w-4 h-4" />
            <span className="hidden sm:inline">{isCustomMode ? 'Về Bản Đồ' : 'Bản Đồ'}</span>
          </button>

          {isCustomMode && (
            <button
              id="btn-change-custom-settings"
              onClick={() => {
                soundManager.playClick();
                setCurrentMode('custom_practice');
              }}
              className="flex items-center gap-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 px-3 py-2 rounded-2xl font-fredoka font-bold text-xs sm:text-sm transition-all"
            >
              <span>⚙️ Đổi Đề Bài</span>
            </button>
          )}

          <div>
            <h2 className="font-fredoka font-bold text-base sm:text-xl text-slate-800 flex items-center gap-2">
              <span>{maze.title}</span>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isCustomMode ? 'bg-purple-100 text-purple-800' : 'bg-emerald-100 text-emerald-800'
              }`}>
                {isCustomMode ? `Phạm vi ${customPracticeConfig?.maxNumber || 20}` : currentWorld.vietnameseName}
              </span>
            </h2>
            <p className="text-xs text-slate-500 hidden sm:block">{maze.subtitle}</p>
          </div>
        </div>

        {/* Right: Live Game Stats */}
        <div className="flex items-center gap-2 sm:gap-4 font-fredoka">
          {/* Time */}
          <div className="flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-2xl text-slate-700 text-xs sm:text-sm font-bold">
            <Clock className="w-4 h-4 text-indigo-500" />
            <span>{formatTime(timeElapsed)}</span>
          </div>

          {/* Gates Progress */}
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border border-purple-200">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>
              Cổng: {solvedGatesCount}/{maze.gates.length}
            </span>
          </div>

          {/* Level Coins */}
          <div className="flex items-center gap-1 bg-amber-50 text-amber-800 px-3 py-1.5 rounded-2xl text-xs sm:text-sm font-bold border border-amber-200">
            <Coins className="w-4 h-4 text-yellow-500 fill-yellow-400" />
            <span>+{coinsGathered}</span>
          </div>

          {/* Restart Level */}
          <button
            id="btn-restart-level"
            onClick={() => {
              soundManager.playClick();
              initLevel();
            }}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition-colors"
            title="Chơi lại màn này"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        
        {/* Left 3 Cols: Interactive Maze Canvas */}
        <div className="lg:col-span-3 bg-white rounded-3xl p-3 sm:p-5 shadow-xl border-4 border-amber-400 relative overflow-hidden flex flex-col items-center">
          
          {/* Maze Grid View */}
          <div className="w-full flex justify-center overflow-x-auto py-2">
            <div
              className="grid gap-0.5 sm:gap-1 bg-amber-900/80 p-2 sm:p-3 rounded-2xl shadow-inner border-2 border-amber-800"
              style={{
                gridTemplateColumns: `repeat(${maze.width}, minmax(0, 1fr))`,
                maxWidth: '620px',
                width: '100%'
              }}
            >
              {maze.grid.map((row, y) =>
                row.map((cellType, x) => {
                  const isPlayer = playerPos.x === x && playerPos.y === y;
                  const isStart = maze.startX === x && maze.startY === y;
                  const isFinish = maze.finishX === x && maze.finishY === y;
                  const isGate = maze.gates.find(g => g.x === x && g.y === y);
                  const isCollectible = maze.collectibles.find(c => c.x === x && c.y === y && !c.collected);
                  const isVisited = visitedCells.has(`${x},${y}`);
                  const isSolutionHint =
                    showHint &&
                    maze.solutionPath
                      .slice(0, Math.min(maze.solutionPath.length, hintIndex + 5))
                      .some(([sx, sy]) => sx === x && sy === y);

                  // Wall cell
                  if (cellType === 1) {
                    return (
                      <div
                        key={`cell-${x}-${y}`}
                        className="aspect-square bg-amber-950 rounded-sm sm:rounded-md border border-amber-900/60 shadow-xs flex items-center justify-center text-[9px] text-amber-700/40 select-none"
                      >
                        🧱
                      </div>
                    );
                  }

                  // Path cell
                  return (
                    <div
                      key={`cell-${x}-${y}`}
                      onClick={() => {
                        // Click to move if adjacent
                        const dx = x - playerPos.x;
                        const dy = y - playerPos.y;
                        if (Math.abs(dx) + Math.abs(dy) === 1) {
                          movePlayer(dx, dy);
                        }
                      }}
                      className={`aspect-square relative rounded-sm sm:rounded-md flex items-center justify-center cursor-pointer transition-colors duration-150 ${
                        isFinish
                          ? 'bg-gradient-to-tr from-rose-500 to-amber-400 animate-pulse-subtle ring-2 ring-yellow-300'
                          : isStart
                          ? 'bg-emerald-400/90 ring-1 ring-emerald-600'
                          : isSolutionHint
                          ? 'bg-cyan-200 ring-2 ring-cyan-400 animate-pulse'
                          : isVisited
                          ? 'bg-amber-100/90'
                          : 'bg-amber-50 hover:bg-amber-100'
                      }`}
                    >
                      {/* Trail particles */}
                      {isVisited && !isPlayer && !isGate && !isCollectible && !isStart && !isFinish && (
                        <div className="w-1.5 h-1.5 bg-amber-300 rounded-full opacity-60" />
                      )}

                      {/* Start Badge */}
                      {isStart && !isPlayer && (
                        <span className="text-[9px] sm:text-xs font-fredoka font-black text-emerald-950 drop-shadow">
                          VÀO
                        </span>
                      )}

                      {/* Finish Castle / Portal */}
                      {isFinish && !isPlayer && (
                        <span className="text-xs sm:text-base animate-bounce select-none">
                          🏰
                        </span>
                      )}

                      {/* Gate Lock */}
                      {isGate && (
                        <div
                          className={`w-full h-full rounded-sm sm:rounded-md flex flex-col items-center justify-center text-[10px] sm:text-xs font-bold font-fredoka select-none ${
                            isGate.passed
                              ? 'bg-emerald-200 text-emerald-800 border border-emerald-400'
                              : 'bg-purple-600 text-white shadow-sm ring-2 ring-purple-300 animate-pulse-subtle'
                          }`}
                        >
                          {isGate.passed ? '🔓' : '🔒'}
                        </div>
                      )}

                      {/* Collectible item */}
                      {isCollectible && !isPlayer && (
                        <span className="text-xs sm:text-sm animate-float select-none">
                          {isCollectible.type === 'coin' ? '🪙' : isCollectible.type === 'gem' ? '💎' : '⭐'}
                        </span>
                      )}

                      {/* Player Sprite */}
                      {isPlayer && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none scale-110 sm:scale-125">
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
          </div>

          {/* Quick Controls & Mobile Virtual D-Pad */}
          <div className="w-full mt-3 pt-3 border-t border-amber-200 flex flex-wrap items-center justify-between gap-3">
            
            {/* Left: Hint Spell Button */}
            <button
              id="btn-magic-hint"
              onClick={handleUseHint}
              className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-fredoka font-bold text-xs sm:text-sm px-3.5 py-2 rounded-2xl shadow-md hover:brightness-110 active:scale-95 transition-all"
            >
              <Compass className="w-4 h-4 animate-spin" />
              <span>Phép Dẫn Đường ✨</span>
            </button>

            {/* Center: Instruction hint */}
            <div className="text-center text-xs text-slate-500 font-semibold hidden md:block">
              Sử dụng các phím mũi tên ⬆️ ⬇️ ⬅️ ➡️ hoặc chạm các ô để di chuyển
            </div>

            {/* Right: On-screen D-Pad for Touch / Mouse */}
            <div className="flex flex-col items-center gap-1 mx-auto sm:mx-0">
              <button
                id="btn-dpad-up"
                onClick={() => movePlayer(0, -1)}
                className="w-10 h-10 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 rounded-xl shadow-md border-b-2 border-amber-600 flex items-center justify-center font-bold active:translate-y-0.5"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <button
                  id="btn-dpad-left"
                  onClick={() => movePlayer(-1, 0)}
                  className="w-10 h-10 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 rounded-xl shadow-md border-b-2 border-amber-600 flex items-center justify-center font-bold active:translate-y-0.5"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <button
                  id="btn-dpad-down"
                  onClick={() => movePlayer(0, 1)}
                  className="w-10 h-10 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 rounded-xl shadow-md border-b-2 border-amber-600 flex items-center justify-center font-bold active:translate-y-0.5"
                >
                  <ArrowDown className="w-5 h-5" />
                </button>
                <button
                  id="btn-dpad-right"
                  onClick={() => movePlayer(1, 0)}
                  className="w-10 h-10 bg-amber-400 hover:bg-amber-500 active:bg-amber-600 text-slate-900 rounded-xl shadow-md border-b-2 border-amber-600 flex items-center justify-center font-bold active:translate-y-0.5"
                >
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Right 1 Col: Character Status & Mini Tasks */}
        <div className="space-y-4">
          {/* Character Showcase Card */}
          <div className="bg-white rounded-3xl p-4 shadow-lg border-3 border-amber-300 text-center">
            <div className="flex justify-center mb-2">
              <AvatarDisplay customization={profile.customization} size="lg" showTrail={true} />
            </div>
            <h3 className="font-fredoka font-bold text-lg text-slate-800">{profile.name}</h3>
            <p className="text-xs text-amber-700 font-semibold mb-3">Hiệp Sĩ Mê Cung</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-fredoka">
              <div className="bg-amber-50 p-2 rounded-xl border border-amber-200">
                <span className="text-slate-500 block">Số bước đi</span>
                <span className="text-base font-bold text-amber-800">{visitedCells.size}</span>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200">
                <span className="text-slate-500 block">Cổng đã mở</span>
                <span className="text-base font-bold text-emerald-800">
                  {solvedGatesCount}/{maze.gates.length}
                </span>
              </div>
            </div>
          </div>

          {/* Math Rules & Encouragement */}
          <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-4 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2 font-fredoka font-bold text-base">
              <Zap className="w-5 h-5 text-yellow-300" />
              <span>Bí Kíp Tính Nhanh</span>
            </div>
            <p className="text-xs text-indigo-100 leading-relaxed mb-3">
              Mỗi cánh cổng đòi hỏi một phép toán chính xác. Hãy nhẩm kỹ trước khi chọn cánh cửa để nhận trọn vẹn 3 ngôi sao sáng lấp lánh!
            </p>
            <div className="bg-white/10 rounded-xl p-2.5 flex items-center gap-2 text-xs font-semibold">
              <span>💡 Gợi ý:</span>
              <span>Đừng quên nhặt các hòm vàng trên đường nhé!</span>
            </div>
          </div>
        </div>

      </div>

      {/* Interactive Math Gate Dialogue Modal */}
      {activeGate && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border-4 border-purple-500 text-center relative overflow-hidden animate-in zoom-in-95">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-1.5 bg-purple-100 text-purple-800 font-fredoka font-bold text-sm px-4 py-1.5 rounded-full mb-3">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>CÁNH CỔNG PHÉP TOÁN</span>
            </div>

            <p className="text-xs text-slate-500 font-semibold mb-4">
              Chọn đáp án đúng để mở khóa con đường tiếp theo!
            </p>

            {/* Big Math Question Expression */}
            <div className="bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-3 border-amber-400 rounded-2xl py-5 px-4 mb-6 shadow-inner">
              <span className="font-fredoka font-black text-4xl sm:text-5xl text-slate-900 tracking-wider">
                {activeGate.question.num1} {activeGate.question.operator} {activeGate.question.num2} = ?
              </span>
            </div>

            {/* Answer Choice Doors */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {activeGate.choices.map((choice, idx) => (
                <button
                  key={`choice-${idx}-${choice.answer}`}
                  id={`btn-gate-choice-${choice.answer}`}
                  onClick={() => handleAnswerGate(choice.answer)}
                  className="group relative bg-gradient-to-b from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-fredoka font-black text-2xl sm:text-3xl py-4 rounded-2xl shadow-lg border-b-4 border-indigo-900 transition-all hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
                >
                  <span className="text-xs text-indigo-200 font-semibold uppercase mb-1">Cửa {idx + 1}</span>
                  <span>{choice.answer}</span>
                </button>
              ))}
            </div>

            {/* Feedback Message */}
            {gateFeedback && (
              <div
                className={`p-3 rounded-2xl font-fredoka font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in ${
                  gateFeedback.type === 'correct'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-400'
                    : 'bg-rose-100 text-rose-800 border border-rose-400'
                }`}
              >
                {gateFeedback.type === 'correct' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>{gateFeedback.message}</span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Victory Level Celebration Modal */}
      {showVictoryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border-4 border-amber-400 text-center relative overflow-hidden animate-in zoom-in-95">
            
            <div className="text-5xl mb-2 animate-bounce">🏆</div>
            <h3 className="font-fredoka font-black text-2xl sm:text-3xl text-amber-900 mb-1">
              XUẤT SẮC! CHIẾN THẮNG!
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 font-semibold mb-4">
              Em đã chinh phục hoàn toàn mê cung số học!
            </p>

            {/* Stars Rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3].map(starNum => (
                <div
                  key={starNum}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl shadow-md transition-all ${
                    starNum <= earnedStars
                      ? 'bg-amber-400 text-yellow-100 border-2 border-amber-500 scale-110 animate-pulse-subtle'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  <Star className={`w-8 h-8 ${starNum <= earnedStars ? 'fill-yellow-200 text-yellow-300' : 'text-slate-300'}`} />
                </div>
              ))}
            </div>

            {/* Rewards Summary */}
            <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 grid grid-cols-3 gap-2 mb-6 font-fredoka">
              <div>
                <span className="text-xs text-slate-500 block">Thời gian</span>
                <span className="text-base font-bold text-slate-800">{formatTime(timeElapsed)}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Tiền Vàng</span>
                <span className="text-base font-bold text-amber-700">+{coinsGathered + earnedStars * 30 + 50} 🪙</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Kim Cương</span>
                <span className="text-base font-bold text-purple-700">+{gemsGathered + (earnedStars === 3 ? 5 : 2)} 💎</span>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                id="btn-victory-replay"
                onClick={() => {
                  soundManager.playClick();
                  initLevel();
                }}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-fredoka font-bold text-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Chơi Lại</span>
              </button>

              <button
                id="btn-victory-worldmap"
                onClick={() => {
                  soundManager.playClick();
                  if (isCustomMode) {
                    exitCustomPractice();
                  } else {
                    setCurrentMode('world_map');
                  }
                }}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-2xl font-fredoka font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <Map className="w-4 h-4" />
                <span>Bản Đồ</span>
              </button>

              <button
                id="btn-victory-next-level"
                onClick={() => {
                  soundManager.playClick();
                  if (isCustomMode) {
                    initLevel();
                  } else {
                    setActiveLevelId(activeLevelId + 1);
                  }
                }}
                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-fredoka font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{isCustomMode ? 'Mê Cung Mới 🎲' : 'Màn Tiếp Theo ➡️'}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
