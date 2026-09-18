import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Navbar } from './components/Navbar';
import { WorldMap } from './components/WorldMap';
import { MathTileMazeView } from './components/MathTileMazeView';
import { QuickPlayView } from './components/QuickPlayView';
import { WorksheetMazeView } from './components/WorksheetMazeView';
import { TeacherStudioView } from './components/TeacherStudioView';
import { CharacterShop } from './components/CharacterShop';
import { LeaderboardModal } from './components/LeaderboardModal';
import { DailyRewardsModal } from './components/DailyRewardsModal';
import { CustomPracticeModal } from './components/CustomPracticeModal';
import { CAMPAIGN_WORLDS } from './data/campaignData';
import { QuestionCategory } from './types';
import { WifiOff, Heart } from 'lucide-react';

const MainContent: React.FC = () => {
  const {
    currentMode,
    setCurrentMode,
    activeWorldId,
    activeLevelId,
    setActiveLevelId,
    profile,
    customPracticeConfig,
    exitCustomPractice
  } = useGame();
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);

  const isCustom = Boolean(customPracticeConfig && customPracticeConfig.isActive);
  const currentWorld = CAMPAIGN_WORLDS.find(w => w.id === activeWorldId) || CAMPAIGN_WORLDS[0];

  const getWorldCategory = (worldId: string): QuestionCategory => {
    if (worldId === 'world_word_problems') return 'word_problem';
    if (worldId === 'world_comparison') return 'comparison';
    if (worldId === 'world_pred_succ') return 'predecessor_successor';
    if (worldId === 'world_measurement') return 'measurement';
    if (worldId === 'world_addition') return 'addition';
    if (worldId === 'world_subtraction') return 'subtraction';
    if (worldId === 'world_multiplication') return 'multiplication';
    if (worldId === 'world_division') return 'division';
    // Galaxy world mixes multiple advanced topics
    const topics: QuestionCategory[] = ['word_problem', 'comparison', 'measurement', 'predecessor_successor', 'find_x', 'fraction', 'even_odd'];
    return topics[(activeLevelId - 1) % topics.length];
  };

  const getCustomCategory = (): QuestionCategory => {
    if (!customPracticeConfig) return 'addition';
    if (customPracticeConfig.category) return customPracticeConfig.category;
    if (customPracticeConfig.operator === '+') return 'addition';
    if (customPracticeConfig.operator === '-') return 'subtraction';
    if (customPracticeConfig.operator === '×') return 'multiplication';
    return 'division';
  };

  const difficulty = activeLevelId <= 3 ? 'easy' : activeLevelId <= 7 ? 'medium' : 'hard';
  const customDifficulty = (customPracticeConfig?.mazeSize || 13) > 13 ? 'hard' : (customPracticeConfig?.mazeSize || 13) > 9 ? 'medium' : 'easy';

  return (
    <div className="min-h-screen bg-[#fdfaf3] text-slate-800 flex flex-col selection:bg-amber-300">
      {/* Top Navbar */}
      <Navbar
        onOpenDailyModal={() => setShowDailyModal(true)}
        onOpenCustomModal={() => setShowCustomModal(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 w-full pb-12">
        {currentMode === 'world_map' && <WorldMap />}
        {currentMode === 'quick_play' && <QuickPlayView />}
        {currentMode === 'maze_play' && (
          <MathTileMazeView
            key={`campaign-maze-${activeWorldId}-${activeLevelId}-${isCustom ? 'custom' : 'std'}`}
            category={isCustom ? getCustomCategory() : getWorldCategory(activeWorldId)}
            grade={isCustom ? (customPracticeConfig?.grade || profile.grade) : profile.grade}
            difficulty={isCustom ? customDifficulty : difficulty}
            customTarget={isCustom ? customPracticeConfig?.maxNumber : undefined}
            levelTitle={
              isCustom
                ? `Tự Chọn: Phép ${customPracticeConfig?.operator} (Phạm vi ${customPracticeConfig?.maxNumber})`
                : `${currentWorld.vietnameseName} - Màn ${activeLevelId}`
            }
            onBackToMenu={() => {
              if (isCustom) {
                exitCustomPractice();
              } else {
                setCurrentMode('world_map');
              }
            }}
            onNextLevel={() => {
              if (isCustom) {
                // In custom mode, staying on maze_play will re-generate next maze challenge
                setCurrentMode('world_map');
                setTimeout(() => setCurrentMode('maze_play'), 50);
              } else {
                if (activeLevelId < currentWorld.levelsCount) {
                  setActiveLevelId(activeLevelId + 1);
                } else {
                  setCurrentMode('world_map');
                }
              }
            }}
          />
        )}
        {currentMode === 'worksheet_play' && <WorksheetMazeView />}
        {currentMode === 'teacher_studio' && <TeacherStudioView />}
        {currentMode === 'shop' && <CharacterShop />}
        {currentMode === 'leaderboard' && <LeaderboardModal />}
      </main>

      {/* Global Modals */}
      {showDailyModal && <DailyRewardsModal onClose={() => setShowDailyModal(false)} />}
      {(showCustomModal || currentMode === 'custom_practice') && (
        <CustomPracticeModal
          onClose={() => {
            setShowCustomModal(false);
            if (currentMode === 'custom_practice') {
              setCurrentMode('world_map');
            }
          }}
        />
      )}

      {/* Footer */}
      <footer className="bg-amber-100 border-t-2 border-amber-300/80 py-4 px-4 text-center text-xs text-amber-900 font-semibold">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full text-[11px] font-bold">
            <WifiOff className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chế độ chơi ngoại tuyến đã sẵn sàng</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Thiết kế dành cho học sinh tiểu học rèn luyện tính nhẩm nhanh</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <GameProvider>
      <MainContent />
    </GameProvider>
  );
}
