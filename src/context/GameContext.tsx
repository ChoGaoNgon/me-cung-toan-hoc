import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PlayerProfile, GradeLevel, DailyQuest, CustomPracticeConfig, MathOperator, QuestionCategory, TeacherLessonScript } from '../types';
import { INITIAL_DAILY_QUESTS } from '../data/campaignData';
import { DEFAULT_TEACHER_SCRIPTS } from '../data/defaultTeacherScripts';
import { soundManager } from '../utils/audio';

const STORAGE_KEY = 'math_maze_player_profile_v2';
const QUESTS_KEY = 'math_maze_daily_quests_v2';
const CUSTOM_CONFIG_KEY = 'math_maze_custom_practice_v2';
const TEACHER_SCRIPTS_KEY = 'math_maze_teacher_scripts_v1';

const DEFAULT_CUSTOM_CONFIG: CustomPracticeConfig = {
  operator: '+',
  maxNumber: 20,
  grade: 1,
  mazeSize: 13,
  isActive: false
};

const DEFAULT_PROFILE: PlayerProfile = {
  name: 'Bé Học Giỏi',
  grade: 1,
  coins: 100, // Starter bonus!
  gems: 15,
  customization: {
    avatarId: 'avatar_cat',
    hatId: 'hat_none',
    accessoryId: 'acc_none',
    petId: 'pet_none',
    trailId: 'trail_none'
  },
  unlockedItems: ['avatar_cat', 'hat_none', 'acc_none', 'pet_none', 'trail_none'],
  levelProgress: {
    world_addition_1: { stars: 0, bestTime: 0, highScore: 0, completed: false }
  },
  streakDays: 1,
  lastLoginDate: new Date().toISOString().split('T')[0],
  lastDailySpinDate: '',
  lastDailyRewardClaimDate: '',
  dailyRewardDay: 1,
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 0.8,
  totalQuestionsSolved: 0,
  totalCorrectAnswers: 0,
  completedMazesCount: 0
};

interface GameContextType {
  profile: PlayerProfile;
  quests: DailyQuest[];
  activeWorldId: string;
  activeLevelId: number;
  currentMode: 'world_map' | 'maze_play' | 'worksheet_play' | 'shop' | 'leaderboard' | 'daily_rewards' | 'custom_practice' | 'quick_play' | 'teacher_studio';
  customPracticeConfig: CustomPracticeConfig;
  savedTeacherScripts: TeacherLessonScript[];
  activeTeacherScript: TeacherLessonScript | null;
  setActiveWorldId: (worldId: string) => void;
  setActiveLevelId: (levelId: number) => void;
  setCurrentMode: (mode: 'world_map' | 'maze_play' | 'worksheet_play' | 'shop' | 'leaderboard' | 'daily_rewards' | 'custom_practice' | 'quick_play' | 'teacher_studio') => void;
  setCustomPracticeConfig: (config: CustomPracticeConfig) => void;
  startCustomPractice: (config: { operator?: MathOperator; category?: QuestionCategory; maxNumber: number; grade: GradeLevel; mazeSize: number }) => void;
  exitCustomPractice: () => void;
  updateProfileName: (name: string) => void;
  updateGrade: (grade: GradeLevel) => void;
  addCoinsAndGems: (coins: number, gems: number) => void;
  unlockItem: (itemId: string, price: number, currency: 'coins' | 'gems') => boolean;
  equipItem: (category: 'avatar' | 'hat' | 'accessory' | 'pet' | 'trail', itemId: string) => void;
  saveLevelResult: (worldId: string, levelId: number, stars: number, timeSpent: number, score: number) => void;
  recordQuestionAnswered: (isCorrect: boolean) => void;
  claimDailyAttendance: () => { coins: number; gems: number; specialReward?: string } | null;
  claimDailySpin: (coins: number, gems: number) => void;
  claimQuestReward: (questId: string) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  resetAllProgress: () => void;
  exportSaveCode: () => string;
  importSaveCode: (code: string) => boolean;
  // Teacher Scripts
  saveTeacherScript: (script: TeacherLessonScript) => void;
  deleteTeacherScript: (scriptId: string) => void;
  playTeacherScript: (script: TeacherLessonScript, targetMode?: 'worksheet_play' | 'quick_play' | 'maze_play') => void;
  stopTeacherScript: () => void;
  importTeacherScriptsJSON: (jsonString: string) => { success: boolean; count: number; error?: string };
  exportTeacherScriptJSON: (script: TeacherLessonScript) => string;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_PROFILE;
  });

  const [quests, setQuests] = useState<DailyQuest[]>(() => {
    try {
      const saved = localStorage.getItem(QUESTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return INITIAL_DAILY_QUESTS;
  });

  const [customPracticeConfig, setCustomPracticeConfig] = useState<CustomPracticeConfig>(() => {
    try {
      const saved = localStorage.getItem(CUSTOM_CONFIG_KEY);
      if (saved) {
        return { ...DEFAULT_CUSTOM_CONFIG, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_CUSTOM_CONFIG;
  });

  const [activeWorldId, setActiveWorldId] = useState<string>('world_addition');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [currentMode, setCurrentMode] = useState<
    'world_map' | 'maze_play' | 'worksheet_play' | 'shop' | 'leaderboard' | 'daily_rewards' | 'custom_practice' | 'quick_play' | 'teacher_studio'
  >('world_map');

  const [savedTeacherScripts, setSavedTeacherScripts] = useState<TeacherLessonScript[]>(() => {
    try {
      const saved = localStorage.getItem(TEACHER_SCRIPTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEFAULT_TEACHER_SCRIPTS;
  });

  const [activeTeacherScript, setActiveTeacherScript] = useState<TeacherLessonScript | null>(null);

  // Sync teacher scripts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TEACHER_SCRIPTS_KEY, JSON.stringify(savedTeacherScripts));
    } catch {
      // ignore
    }
  }, [savedTeacherScripts]);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // ignore
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
    } catch {
      // ignore
    }
  }, [quests]);

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CONFIG_KEY, JSON.stringify(customPracticeConfig));
    } catch {
      // ignore
    }
  }, [customPracticeConfig]);

  // Audio settings sync
  useEffect(() => {
    soundManager.setSoundEnabled(profile.soundEnabled);
    soundManager.setMusicEnabled(profile.musicEnabled);
  }, [profile.soundEnabled, profile.musicEnabled]);

  // Daily streak & attendance check on mount
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastLoginDate !== today) {
      // Check consecutive day
      const lastLogin = new Date(profile.lastLoginDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastLogin.getTime()) / (1000 * 3600 * 24));

      let newStreak = profile.streakDays;
      let newRewardDay = profile.dailyRewardDay;

      if (diffDays === 1) {
        newStreak += 1;
        newRewardDay = newRewardDay >= 7 ? 1 : newRewardDay + 1;
      } else if (diffDays > 1) {
        newStreak = 1;
        newRewardDay = 1;
      }

      setProfile(prev => ({
        ...prev,
        lastLoginDate: today,
        streakDays: newStreak,
        dailyRewardDay: newRewardDay
      }));
    }
  }, []);

  const updateProfileName = (name: string) => {
    setProfile(prev => ({ ...prev, name: name.trim() || 'Bé Học Giỏi' }));
  };

  const updateGrade = (grade: GradeLevel) => {
    setProfile(prev => ({ ...prev, grade }));
  };

  const addCoinsAndGems = (coins: number, gems: number) => {
    setProfile(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins + coins),
      gems: Math.max(0, prev.gems + gems)
    }));
  };

  const unlockItem = (itemId: string, price: number, currency: 'coins' | 'gems'): boolean => {
    if (profile.unlockedItems.includes(itemId)) return true;

    if (currency === 'coins') {
      if (profile.coins < price) return false;
      setProfile(prev => ({
        ...prev,
        coins: prev.coins - price,
        unlockedItems: [...prev.unlockedItems, itemId]
      }));
      soundManager.playBuyItem();
      return true;
    } else {
      if (profile.gems < price) return false;
      setProfile(prev => ({
        ...prev,
        gems: prev.gems - price,
        unlockedItems: [...prev.unlockedItems, itemId]
      }));
      soundManager.playBuyItem();
      return true;
    }
  };

  const equipItem = (category: 'avatar' | 'hat' | 'accessory' | 'pet' | 'trail', itemId: string) => {
    setProfile(prev => {
      const keyMap: Record<string, keyof typeof prev.customization> = {
        avatar: 'avatarId',
        hat: 'hatId',
        accessory: 'accessoryId',
        pet: 'petId',
        trail: 'trailId'
      };
      const customKey = keyMap[category];
      return {
        ...prev,
        customization: {
          ...prev.customization,
          [customKey]: itemId
        }
      };
    });
    soundManager.playClick();
  };

  const saveLevelResult = (worldId: string, levelId: number, stars: number, timeSpent: number, score: number) => {
    const key = `${worldId}_${levelId}`;
    const nextLevelKey = `${worldId}_${levelId + 1}`;

    setProfile(prev => {
      const currentLevel = prev.levelProgress[key] || { stars: 0, bestTime: 9999, highScore: 0, completed: false };
      const newStars = Math.max(currentLevel.stars, stars);
      const newBestTime = currentLevel.bestTime === 0 ? timeSpent : Math.min(currentLevel.bestTime, timeSpent);
      const newHighScore = Math.max(currentLevel.highScore, score);

      const updatedProgress = {
        ...prev.levelProgress,
        [key]: {
          stars: newStars,
          bestTime: newBestTime,
          highScore: newHighScore,
          completed: true
        }
      };

      // Unlock next level if not existing
      if (!updatedProgress[nextLevelKey]) {
        updatedProgress[nextLevelKey] = {
          stars: 0,
          bestTime: 0,
          highScore: 0,
          completed: false
        };
      }

      return {
        ...prev,
        levelProgress: updatedProgress,
        completedMazesCount: prev.completedMazesCount + 1
      };
    });

    // Update daily quests
    setQuests(prev =>
      prev.map(q => {
        if (q.id === 'quest_2') {
          const updated = q.current + 1;
          return { ...q, current: updated, completed: updated >= q.target };
        }
        if (q.id === 'quest_3' && stars === 3) {
          const updated = q.current + 1;
          return { ...q, current: updated, completed: updated >= q.target };
        }
        return q;
      })
    );
  };

  const recordQuestionAnswered = (isCorrect: boolean) => {
    setProfile(prev => ({
      ...prev,
      totalQuestionsSolved: prev.totalQuestionsSolved + 1,
      totalCorrectAnswers: isCorrect ? prev.totalCorrectAnswers + 1 : prev.totalCorrectAnswers
    }));

    if (isCorrect) {
      setQuests(prev =>
        prev.map(q => {
          if (q.id === 'quest_1') {
            const updated = q.current + 1;
            return { ...q, current: updated, completed: updated >= q.target };
          }
          return q;
        })
      );
    }
  };

  const claimDailyAttendance = () => {
    const today = new Date().toISOString().split('T')[0];
    if (profile.lastDailyRewardClaimDate === today) {
      return null;
    }

    const day = profile.dailyRewardDay;
    let coinsEarned = 50;
    let gemsEarned = 0;
    let specialReward: string | undefined = undefined;

    if (day === 1) coinsEarned = 50;
    else if (day === 2) coinsEarned = 80;
    else if (day === 3) gemsEarned = 10;
    else if (day === 4) coinsEarned = 150;
    else if (day === 5) gemsEarned = 20;
    else if (day === 6) coinsEarned = 250;
    else if (day === 7) {
      gemsEarned = 50;
      specialReward = 'avatar_bunny';
    }

    setProfile(prev => {
      const unlocked = [...prev.unlockedItems];
      if (specialReward && !unlocked.includes(specialReward)) {
        unlocked.push(specialReward);
      }
      return {
        ...prev,
        coins: prev.coins + coinsEarned,
        gems: prev.gems + gemsEarned,
        lastDailyRewardClaimDate: today,
        unlockedItems: unlocked
      };
    });

    soundManager.playVictory();
    return { coins: coinsEarned, gems: gemsEarned, specialReward };
  };

  const claimDailySpin = (coins: number, gems: number) => {
    const today = new Date().toISOString().split('T')[0];
    setProfile(prev => ({
      ...prev,
      coins: prev.coins + coins,
      gems: prev.gems + gems,
      lastDailySpinDate: today
    }));
  };

  const claimQuestReward = (questId: string) => {
    const quest = quests.find(q => q.id === questId);
    if (!quest || !quest.completed || quest.claimed) return;

    addCoinsAndGems(quest.rewardCoins, quest.rewardGems);
    setQuests(prev =>
      prev.map(q => (q.id === questId ? { ...q, claimed: true } : q))
    );
    soundManager.playCoin();
  };

  const toggleSound = () => {
    setProfile(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  };

  const toggleMusic = () => {
    setProfile(prev => ({ ...prev, musicEnabled: !prev.musicEnabled }));
  };

  const resetAllProgress = () => {
    setProfile(DEFAULT_PROFILE);
    setQuests(INITIAL_DAILY_QUESTS);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(QUESTS_KEY);
  };

  const exportSaveCode = () => {
    return btoa(unescape(encodeURIComponent(JSON.stringify(profile))));
  };

  const importSaveCode = (code: string): boolean => {
    try {
      const decoded = decodeURIComponent(escape(atob(code)));
      const parsed = JSON.parse(decoded);
      if (parsed && typeof parsed.coins === 'number') {
        setProfile({ ...DEFAULT_PROFILE, ...parsed });
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const startCustomPractice = (config: { operator?: MathOperator; category?: QuestionCategory; maxNumber: number; grade: GradeLevel; mazeSize: number }) => {
    setCustomPracticeConfig({
      operator: config.operator || '+',
      category: config.category,
      maxNumber: config.maxNumber,
      grade: config.grade,
      mazeSize: config.mazeSize,
      isActive: true
    });
    setCurrentMode('maze_play');
  };

  const exitCustomPractice = () => {
    setCustomPracticeConfig(prev => ({
      ...prev,
      isActive: false
    }));
    setCurrentMode('world_map');
  };

  // =========================================================================
  // 🎓 TEACHER LESSON SCRIPT METHODS (SOẠN ĐỀ, KỊCH BẢN, IMPORT/EXPORT)
  // =========================================================================
  const saveTeacherScript = (script: TeacherLessonScript) => {
    setSavedTeacherScripts(prev => {
      const idx = prev.findIndex(s => s.id === script.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...script, updatedAt: new Date().toISOString().split('T')[0] };
        return next;
      } else {
        return [{ ...script, updatedAt: new Date().toISOString().split('T')[0] }, ...prev];
      }
    });
  };

  const deleteTeacherScript = (scriptId: string) => {
    setSavedTeacherScripts(prev => prev.filter(s => s.id !== scriptId));
    if (activeTeacherScript?.id === scriptId) {
      setActiveTeacherScript(null);
    }
  };

  const playTeacherScript = (
    script: TeacherLessonScript,
    targetMode: 'worksheet_play' | 'quick_play' | 'maze_play' = 'worksheet_play'
  ) => {
    setActiveTeacherScript(script);
    setCurrentMode(targetMode);
  };

  const stopTeacherScript = () => {
    setActiveTeacherScript(null);
  };

  const importTeacherScriptsJSON = (jsonString: string): { success: boolean; count: number; error?: string } => {
    try {
      const parsed = JSON.parse(jsonString.trim());
      const scriptsToAdd: TeacherLessonScript[] = [];

      const validateScript = (obj: any): TeacherLessonScript | null => {
        if (!obj || typeof obj !== 'object') return null;
        if (!obj.title || typeof obj.title !== 'string') return null;
        if (!Array.isArray(obj.questions) || obj.questions.length === 0) return null;

        // Clean & ensure valid questions
        const validQuestions = obj.questions
          .filter((q: any) => q && (typeof q.story === 'string' || typeof q.question === 'string') && typeof q.correctAnswer === 'number')
          .map((q: any, i: number) => {
            const storyText = q.story || q.question || `Câu hỏi ${i + 1}`;
            const correct = Number(q.correctAnswer);
            let opts: number[] = Array.isArray(q.options) && q.options.length >= 2 ? q.options.map((o: any) => Number(o)) : [];
            if (!opts.includes(correct)) {
              opts.unshift(correct);
            }
            while (opts.length < 4) {
              const dummy = correct + (opts.length * 2 - 3);
              if (!opts.includes(dummy)) opts.push(dummy);
              else opts.push(correct + opts.length + 10);
            }
            return {
              id: q.id || `q_${Date.now()}_${i}`,
              story: storyText,
              shortQuestion: q.shortQuestion || storyText.slice(0, 45) + '...',
              correctAnswer: correct,
              options: opts.slice(0, 4),
              unit: q.unit || '',
              explanation: q.explanation || `Đáp án đúng là: ${correct}`,
              hint: q.hint || '',
              tag: q.tag || 'Bài Toán'
            };
          });

        if (validQuestions.length === 0) return null;

        return {
          id: obj.id || `script_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          title: obj.title,
          description: obj.description || `Kịch bản gồm ${validQuestions.length} câu hỏi`,
          author: obj.author || 'Giáo viên',
          grade: (obj.grade >= 1 && obj.grade <= 5) ? obj.grade : 3,
          createdAt: obj.createdAt || new Date().toISOString().split('T')[0],
          updatedAt: new Date().toISOString().split('T')[0],
          questions: validQuestions
        };
      };

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          const validated = validateScript(item);
          if (validated) scriptsToAdd.push(validated);
        }
      } else {
        const validated = validateScript(parsed);
        if (validated) scriptsToAdd.push(validated);
      }

      if (scriptsToAdd.length === 0) {
        return { success: false, count: 0, error: 'Dữ liệu JSON không đúng cấu trúc (Cần có title và danh sách questions).' };
      }

      setSavedTeacherScripts(prev => {
        const existingIds = new Set(prev.map(s => s.id));
        const nonDuplicate = scriptsToAdd.filter(s => !existingIds.has(s.id));
        const updatedList = [...scriptsToAdd, ...prev.filter(s => !scriptsToAdd.some(n => n.id === s.id))];
        return updatedList;
      });

      return { success: true, count: scriptsToAdd.length };
    } catch (err: any) {
      return { success: false, count: 0, error: `Lỗi cú pháp JSON: ${err.message || 'Không thể phân tích JSON'}` };
    }
  };

  const exportTeacherScriptJSON = (script: TeacherLessonScript): string => {
    return JSON.stringify(script, null, 2);
  };

  return (
    <GameContext.Provider
      value={{
        profile,
        quests,
        activeWorldId,
        activeLevelId,
        currentMode,
        customPracticeConfig,
        savedTeacherScripts,
        activeTeacherScript,
        setActiveWorldId,
        setActiveLevelId,
        setCurrentMode,
        setCustomPracticeConfig,
        startCustomPractice,
        exitCustomPractice,
        updateProfileName,
        updateGrade,
        addCoinsAndGems,
        unlockItem,
        equipItem,
        saveLevelResult,
        recordQuestionAnswered,
        claimDailyAttendance,
        claimDailySpin,
        claimQuestReward,
        toggleSound,
        toggleMusic,
        resetAllProgress,
        exportSaveCode,
        importSaveCode,
        saveTeacherScript,
        deleteTeacherScript,
        playTeacherScript,
        stopTeacherScript,
        importTeacherScriptsJSON,
        exportTeacherScriptJSON
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
