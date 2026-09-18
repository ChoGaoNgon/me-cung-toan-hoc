import { WorldInfo, DailyQuest, LeaderboardUser } from '../types';

export const CAMPAIGN_WORLDS: WorldInfo[] = [
  {
    id: 'world_addition',
    name: 'Jungle Addition',
    vietnameseName: 'Rừng Phép Cộng 🌿',
    description: 'Bắt đầu cuộc hành trình cùng các phép cộng cơ bản và tính nhẩm nhanh.',
    icon: '🌴',
    color: '#10b981',
    gradient: 'from-emerald-400 to-teal-600',
    borderTheme: 'border-emerald-500',
    recommendedGrade: 'Lớp 1 - 2',
    operations: ['+'],
    levelsCount: 10,
    requiredStars: 0
  },
  {
    id: 'world_subtraction',
    name: 'Canyon Subtraction',
    vietnameseName: 'Thung Lũng Phép Trừ 🏜️',
    description: 'Thử thách trừ không nhớ và có nhớ để vượt qua các vách đá hiểm trở.',
    icon: '🌵',
    color: '#f59e0b',
    gradient: 'from-amber-400 to-orange-600',
    borderTheme: 'border-amber-500',
    recommendedGrade: 'Lớp 1 - 2',
    operations: ['-'],
    levelsCount: 10,
    requiredStars: 6
  },
  {
    id: 'world_word_problems',
    name: 'Story Math Realm',
    vietnameseName: 'Vùng Đất Toán Lời Văn 📜',
    description: 'Giải các bài toán đố thực tế siêu thú vị về bạn bè, gia đình, mua sắm và chuyển động.',
    icon: '📚',
    color: '#3b82f6',
    gradient: 'from-blue-500 to-indigo-700',
    borderTheme: 'border-blue-500',
    recommendedGrade: 'Lớp 1 - 5',
    operations: ['+', '-', '×', '÷'],
    levelsCount: 12,
    requiredStars: 10
  },
  {
    id: 'world_comparison',
    name: 'Valley of Comparison',
    vietnameseName: 'Thung Lũng So Sánh Số ⚖️',
    description: 'Rèn luyện khả năng so sánh lớn hơn, bé hơn, dấu >, < và dãy số.',
    icon: '⚖️',
    color: '#14b8a6',
    gradient: 'from-teal-400 to-emerald-600',
    borderTheme: 'border-teal-500',
    recommendedGrade: 'Lớp 1 - 3',
    operations: ['+', '-'],
    levelsCount: 10,
    requiredStars: 15
  },
  {
    id: 'world_pred_succ',
    name: 'Forest of Numbers',
    vietnameseName: 'Rừng Số Liền Trước & Sau 🔢',
    description: 'Luyện phản xạ tìm số liền trước (N-1), số liền sau (N+1) và số tròn chục.',
    icon: '🌲',
    color: '#06b6d4',
    gradient: 'from-cyan-400 to-teal-600',
    borderTheme: 'border-cyan-500',
    recommendedGrade: 'Lớp 1 - 3',
    operations: ['+'],
    levelsCount: 10,
    requiredStars: 20
  },
  {
    id: 'world_measurement',
    name: 'Academy of Measurements',
    vietnameseName: 'Vương Quốc Đơn Vị Đo 📏',
    description: 'Khám phá bí mật quy đổi độ dài (cm, m, km), khối lượng (g, kg), dung tích (l, ml) và thời gian.',
    icon: '⏱️',
    color: '#f97316',
    gradient: 'from-orange-400 to-red-600',
    borderTheme: 'border-orange-500',
    recommendedGrade: 'Lớp 2 - 5',
    operations: ['+', '-', '×', '÷'],
    levelsCount: 10,
    requiredStars: 25
  },
  {
    id: 'world_multiplication',
    name: 'Castle Multiplication',
    vietnameseName: 'Lâu Đài Phép Nhân 🏰',
    description: 'Khám phá các căn phòng bí mật với bảng cửu chương nhân từ 2 đến 9.',
    icon: '⚔️',
    color: '#8b5cf6',
    gradient: 'from-purple-400 to-indigo-600',
    borderTheme: 'border-purple-500',
    recommendedGrade: 'Lớp 2 - 3',
    operations: ['×'],
    levelsCount: 10,
    requiredStars: 30
  },
  {
    id: 'world_division',
    name: 'Pirate Division',
    vietnameseName: 'Đảo Hải Tặc Phép Chia 🏴‍☠️',
    description: 'Chia kho báu kim cương và giải các phép chia hết cùng thuyền trưởng toán học.',
    icon: '⚓',
    color: '#0284c7',
    gradient: 'from-sky-400 to-blue-600',
    borderTheme: 'border-sky-500',
    recommendedGrade: 'Lớp 3 - 4',
    operations: ['÷'],
    levelsCount: 10,
    requiredStars: 40
  },
  {
    id: 'world_galaxy',
    name: 'Cosmic Master',
    vietnameseName: 'Vũ Trụ Siêu Tính Nhẩm 🚀',
    description: 'Đỉnh cao tính toán kết hợp cộng, trừ, nhân, chia với mê cung khổng lồ.',
    icon: '🌌',
    color: '#ec4899',
    gradient: 'from-pink-500 to-rose-700',
    borderTheme: 'border-pink-500',
    recommendedGrade: 'Lớp 4 - 5',
    operations: ['+', '-', '×', '÷'],
    levelsCount: 10,
    requiredStars: 50
  }
];

export const DAILY_REWARDS_TABLE = [
  { day: 1, title: 'Ngày 1', type: 'coins', amount: 50, icon: '🪙', label: '+50 Xu' },
  { day: 2, title: 'Ngày 2', type: 'coins', amount: 80, icon: '🪙', label: '+80 Xu' },
  { day: 3, title: 'Ngày 3', type: 'gems', amount: 10, icon: '💎', label: '+10 Kim Cương' },
  { day: 4, title: 'Ngày 4', type: 'coins', amount: 150, icon: '🪙', label: '+150 Xu' },
  { day: 5, title: 'Ngày 5', type: 'gems', amount: 20, icon: '💎', label: '+20 Kim Cương' },
  { day: 6, title: 'Ngày 6', type: 'coins', amount: 250, icon: '🪙', label: '+250 Xu' },
  { day: 7, title: 'Ngày 7', type: 'special', amount: 50, icon: '🎁', label: '+50 KC + Thỏ Bunny' }
];

export const INITIAL_DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'quest_1',
    title: 'Khởi Động Ngày Mới',
    description: 'Giải đúng 5 câu hỏi toán học trong mê cung',
    target: 5,
    current: 0,
    rewardCoins: 60,
    rewardGems: 5,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_2',
    title: 'Nhà Thám Hiểm Nhí',
    description: 'Vượt qua thành công 2 màn mê cung bất kỳ',
    target: 2,
    current: 0,
    rewardCoins: 100,
    rewardGems: 10,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_3',
    title: 'Cao Thủ Hoàn Hảo',
    description: 'Đạt 3 sao trong 1 màn chơi mà không trả lời sai lần nào',
    target: 1,
    current: 0,
    rewardCoins: 120,
    rewardGems: 15,
    completed: false,
    claimed: false
  },
  {
    id: 'quest_4',
    title: 'Thợ Săn Kho Báu',
    description: 'Thu thập 15 đồng tiền vàng trong mê cung',
    target: 15,
    current: 0,
    rewardCoins: 80,
    rewardGems: 5,
    completed: false,
    claimed: false
  }
];

export const MOCK_CLASSMATES: LeaderboardUser[] = [
  {
    id: 'user_1',
    name: 'Bảo Anh (Lớp Trưởng)',
    avatarEmoji: '🐱',
    hatEmoji: '👑',
    score: 4280,
    stars: 58,
    solvedCount: 164,
    accuracy: 98,
    rank: 1
  },
  {
    id: 'user_2',
    name: 'Gia Huy (Thần Tốc)',
    avatarEmoji: '🤖',
    hatEmoji: '🎧',
    score: 3950,
    stars: 52,
    solvedCount: 150,
    accuracy: 95,
    rank: 2
  },
  {
    id: 'user_3',
    name: 'Minh Khang (Vua Phép Nhân)',
    avatarEmoji: '🦖',
    hatEmoji: '🎓',
    score: 3620,
    stars: 48,
    solvedCount: 138,
    accuracy: 93,
    rank: 3
  },
  {
    id: 'user_4',
    name: 'Tuệ Nhi (Học Siêu Nhanh)',
    avatarEmoji: '🐰',
    hatEmoji: '🧙‍♂️',
    score: 3210,
    stars: 42,
    solvedCount: 120,
    accuracy: 96,
    rank: 4
  },
  {
    id: 'user_5',
    name: 'Đăng Khoa (Siêu Nhân Nhí)',
    avatarEmoji: '🦸',
    hatEmoji: '🕶️',
    score: 2890,
    stars: 38,
    solvedCount: 110,
    accuracy: 91,
    rank: 5
  },
  {
    id: 'user_6',
    name: 'Phương Linh (Bé Ong Chăm)',
    avatarEmoji: '🐱',
    hatEmoji: '🤠',
    score: 2450,
    stars: 32,
    solvedCount: 95,
    accuracy: 94,
    rank: 6
  },
  {
    id: 'user_7',
    name: 'Hoàng Long',
    avatarEmoji: '🐶',
    hatEmoji: '🥳',
    score: 2100,
    stars: 28,
    solvedCount: 82,
    accuracy: 89,
    rank: 7
  },
  {
    id: 'user_8',
    name: 'Khánh An',
    avatarEmoji: '🐲',
    hatEmoji: '👑',
    score: 1850,
    stars: 24,
    solvedCount: 75,
    accuracy: 92,
    rank: 8
  }
];
