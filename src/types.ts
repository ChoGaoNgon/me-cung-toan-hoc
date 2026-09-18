export type MathOperator = '+' | '-' | '×' | '÷';

export type GradeLevel = 1 | 2 | 3 | 4 | 5;

export type QuestionCategory =
  | 'comparison'            // So sánh số (lớn hơn, bé hơn, nằm giữa, dấu >, <)
  | 'predecessor_successor' // Số liền trước / liền sau
  | 'measurement'           // Đơn vị đo lường (chiều dài, khối lượng, thời gian, dung tích)
  | 'word_problem'          // Bài toán có lời văn (nhiều hơn/ít hơn, gấp lần, rút về đơn vị, tổng-hiệu, tổng-tỉ)
  | 'addition'              // Phép cộng
  | 'subtraction'           // Phép trừ
  | 'multiplication'        // Bảng nhân
  | 'division'              // Phép chia & Số chia hết
  | 'find_x'                // Tìm X
  | 'even_odd'              // Chẵn / Lẻ
  | 'fraction';             // Phân số

export type MazeDifficulty = 'easy' | 'medium' | 'hard';

export interface FractionRepresentation {
  numerator: number;
  denominator: number;
  visualType?: 'pie' | 'bar';
}

export interface GridTileCell {
  x: number;
  y: number;
  value: number | string;
  display: string;
  subtitle?: string;
  fraction?: FractionRepresentation;
  isValid: boolean;        // True if satisfies math challenge rule
  isStart?: boolean;       // 🚩 Start tile
  isGoal?: boolean;        // 💎/🏆 Goal tile
  isDeadEnd?: boolean;
  bonusCoin?: boolean;     // 🪙 Extra collectible
  bonusGem?: boolean;      // 💎 Extra diamond
}

export interface MathChallengeRule {
  id: string;
  category: QuestionCategory;
  grade: GradeLevel;
  difficulty: MazeDifficulty;
  title: string;           // E.g. "So sánh số lớn hơn 50"
  prompt: string;          // E.g. "🔎 Hãy đi qua các ô có số LỚN HƠN 50"
  shortHint: string;       // E.g. "Số > 50"
  ruleDescription: string;
  targetValue?: number;
  secondTargetValue?: number;
  targetFraction?: { num: number; den: number };
}

export interface TileMazeData {
  id: string;
  width: number;           // 4, 5, 6, 7
  height: number;          // 4, 5, 6, 7
  grid: GridTileCell[][];
  startX: number;
  startY: number;
  goalX: number;
  goalY: number;
  challenge: MathChallengeRule;
  solutionPath: [number, number][];
  totalValidSteps: number;
}

export interface MathQuestion {
  id: string;
  num1?: number;
  num2?: number;
  operator?: MathOperator;
  expression: string;
  correctAnswer: number;
  options: number[];
  explanation?: string;
  category?: QuestionCategory;
  wordProblemText?: string;
  unit?: string;
}

export type CellType = 'wall' | 'path' | 'start' | 'finish' | 'gate' | 'coin' | 'star' | 'chest' | 'powerup';

export interface GateChoice {
  answer: number;
  isCorrect: boolean;
  targetX: number;
  targetY: number;
  directionLabel?: string;
}

export interface MazeGate {
  id: string;
  x: number;
  y: number;
  question: MathQuestion;
  passed: boolean;
  choices: GateChoice[];
}

export interface CollectibleItem {
  id: string;
  x: number;
  y: number;
  type: 'coin' | 'gem' | 'star' | 'potion';
  value: number;
  collected: boolean;
}

export interface MazeData {
  width: number;
  height: number;
  grid: number[][];
  startX: number;
  startY: number;
  finishX: number;
  finishY: number;
  gates: MazeGate[];
  collectibles: CollectibleItem[];
  solutionPath: [number, number][];
  title: string;
  subtitle: string;
  grade: GradeLevel;
  operationType: string;
}

export interface CosmeticItem {
  id: string;
  name: string;
  category: 'avatar' | 'hat' | 'accessory' | 'pet' | 'trail';
  emoji: string;
  color?: string;
  price: number;
  currency: 'coins' | 'gems';
  description: string;
  unlockedByDefault?: boolean;
  levelRequired?: number;
  svgIcon?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  mythicAura?: string;
}

export interface PlayerCustomization {
  avatarId: string;
  hatId: string;
  accessoryId: string;
  petId: string;
  trailId: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  rewardCoins: number;
  rewardGems: number;
  completed: boolean;
  claimed: boolean;
}

export interface LevelProgress {
  stars: number; // 0, 1, 2, 3
  bestTime: number; // seconds
  highScore: number;
  completed: boolean;
}

export interface PlayerProfile {
  name: string;
  grade: GradeLevel;
  coins: number;
  gems: number;
  customization: PlayerCustomization;
  unlockedItems: string[];
  levelProgress: Record<string, LevelProgress>; // key: `${worldId}_${levelId}`
  streakDays: number;
  lastLoginDate: string;
  lastDailySpinDate: string;
  lastDailyRewardClaimDate: string;
  dailyRewardDay: number; // 1 to 7
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundVolume: number;
  totalQuestionsSolved: number;
  totalCorrectAnswers: number;
  completedMazesCount: number;
}

export interface WorldInfo {
  id: string;
  name: string;
  vietnameseName: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
  borderTheme: string;
  recommendedGrade: string;
  operations: MathOperator[];
  levelsCount: number;
  requiredStars: number;
  category?: QuestionCategory;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatarEmoji: string;
  hatEmoji: string;
  score: number;
  stars: number;
  solvedCount: number;
  accuracy: number;
  rank: number;
  isCurrentPlayer?: boolean;
}

export interface CustomPracticeConfig {
  operator: MathOperator;
  category?: QuestionCategory;
  maxNumber: number;
  grade: GradeLevel;
  mazeSize: number;
  isActive: boolean;
}

export interface TeacherQuestionItem {
  id: string;
  story: string;             // Đề bài hoặc câu hỏi
  shortQuestion?: string;     // Câu hỏi rút gọn nếu có
  correctAnswer: number;     // Đáp án đúng
  options: number[];         // 4 lựa chọn trắc nghiệm
  unit?: string;             // Đơn vị (kg, lít, học sinh, ...)
  explanation?: string;      // Lời giải chi tiết
  hint?: string;             // Gợi ý
  tag?: string;              // Phân loại / Dạng toán (ví dụ: "Dạng Tổng - Hiệu", "Dạng Tuổi")
}

export interface TeacherLessonScript {
  id: string;
  title: string;
  description: string;
  author?: string;
  grade: GradeLevel;
  createdAt: string;
  updatedAt?: string;
  questions: TeacherQuestionItem[];
}

