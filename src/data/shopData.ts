import { CosmeticItem } from '../types';

export const SHOP_ITEMS: CosmeticItem[] = [
  // ==========================================
  // 1. AVATARS (NHÂN VẬT)
  // ==========================================
  // --- Common & Free ---
  {
    id: 'avatar_cat',
    name: 'Mèo Bác Học',
    category: 'avatar',
    emoji: '🐱',
    color: '#f59e0b',
    price: 0,
    currency: 'coins',
    description: 'Chú mèo thông minh thích giải toán siêu tốc!',
    unlockedByDefault: true,
    rarity: 'common'
  },
  {
    id: 'avatar_dog',
    name: 'Cún Dũng Cảm',
    category: 'avatar',
    emoji: '🐶',
    color: '#3b82f6',
    price: 50,
    currency: 'coins',
    description: 'Luôn sẵn sàng vượt qua mọi mê cung khó nhằn.',
    rarity: 'common'
  },
  {
    id: 'avatar_penguin',
    name: 'Cánh Cụt Băng Giá',
    category: 'avatar',
    emoji: '🐧',
    color: '#0284c7',
    price: 90,
    currency: 'coins',
    description: 'Lướt băng siêu mượt qua mọi khúc cua lắt léo.',
    rarity: 'common'
  },

  // --- Rare ---
  {
    id: 'avatar_dino',
    name: 'Khủng Long Con',
    category: 'avatar',
    emoji: '🦖',
    color: '#10b981',
    price: 180,
    currency: 'coins',
    description: 'Khủng long tí hon với sức mạnh tính nhẩm vô địch.',
    rarity: 'rare'
  },
  {
    id: 'avatar_superkid',
    name: 'Siêu Nhân Nhí',
    category: 'avatar',
    emoji: '🦸',
    color: '#ef4444',
    price: 350,
    currency: 'coins',
    description: 'Mang trên mình chiếc áo choàng công lý số học!',
    rarity: 'rare'
  },
  {
    id: 'avatar_bunny',
    name: 'Thỏ Trắng Nhanh Nhẹn',
    category: 'avatar',
    emoji: '🐰',
    color: '#ec4899',
    price: 25,
    currency: 'gems',
    description: 'Nhảy thoăn thoắt qua các lối rẽ mê cung.',
    rarity: 'rare'
  },
  {
    id: 'avatar_fox_snow',
    name: 'Cáo Tuyết Tinh Khôn',
    category: 'avatar',
    emoji: '🦊',
    color: '#f97316',
    price: 450,
    currency: 'coins',
    description: 'Trực giác nhạy bén, phát hiện đáp án chính xác trong chớp mắt.',
    rarity: 'rare'
  },

  // --- Epic ---
  {
    id: 'avatar_wizard',
    name: 'Phù Thủy Nhỏ',
    category: 'avatar',
    emoji: '🧙',
    color: '#8b5cf6',
    price: 800,
    currency: 'coins',
    description: 'Sử dụng đũa phép toán học mở mọi cánh cổng bí ẩn.',
    rarity: 'epic'
  },
  {
    id: 'avatar_robot',
    name: 'Robot Thông Minh AI',
    category: 'avatar',
    emoji: '🤖',
    color: '#06b6d4',
    price: 1200,
    currency: 'coins',
    description: 'Chip xử lý lượng tử siêu nhanh, tính toán chỉ trong 1 giây.',
    rarity: 'epic'
  },
  {
    id: 'avatar_fairy',
    name: 'Tiên Nữ Hoa Rừng',
    category: 'avatar',
    emoji: '🧚‍♀️',
    color: '#10b981',
    price: 1500,
    currency: 'coins',
    description: 'Bảo hộ các mầm non toán học với phép thuật thiên nhiên êm dịu.',
    rarity: 'epic'
  },
  {
    id: 'avatar_ninja',
    name: 'Ninja Bóng Đêm Siêu Tốc',
    category: 'avatar',
    emoji: '🥷',
    color: '#334155',
    price: 1800,
    currency: 'coins',
    description: 'Phi thân qua mê cung không một tiếng động, tốc độ xuất quỷ nhập thần.',
    rarity: 'epic'
  },
  {
    id: 'avatar_panda_master',
    name: 'Gấu Trúc Kungfu Đại Sư',
    category: 'avatar',
    emoji: '🐼',
    color: '#475569',
    price: 2200,
    currency: 'coins',
    description: 'Điềm tĩnh suy nghĩ, ra chiêu tính nhẩm chuẩn xác từng con số.',
    rarity: 'epic'
  },
  {
    id: 'avatar_astronaut',
    name: 'Phi Hành Gia Vũ Trụ',
    category: 'avatar',
    emoji: '👨‍🚀',
    color: '#6366f1',
    price: 2800,
    currency: 'coins',
    description: 'Khám phá bí mật các vì sao và hố đen toán học vô tận.',
    rarity: 'epic'
  },

  // --- Legendary ---
  {
    id: 'avatar_dragon',
    name: 'Rồng Lửa Huyền Bí',
    category: 'avatar',
    emoji: '🐲',
    color: '#f97316',
    price: 60,
    currency: 'gems',
    description: 'Thần thú dũng mãnh phun lửa thiêu rụi mọi cạm bẫy toán học.',
    rarity: 'legendary'
  },
  {
    id: 'avatar_poseidon',
    name: 'Hải Vương Thần Atlantis',
    category: 'avatar',
    emoji: '🧜‍♂️',
    color: '#0284c7',
    price: 5000,
    currency: 'coins',
    description: 'Chủ nhân đại dương, nắm giữ dòng chảy logic và trí tuệ thâm sâu.',
    rarity: 'legendary'
  },
  {
    id: 'avatar_cyber_valkyrie',
    name: 'Chiến Thần Robot Cyberpunk',
    category: 'avatar',
    emoji: '🦾',
    color: '#ec4899',
    price: 8500,
    currency: 'coins',
    description: 'Người máy chiến binh công nghệ tối tân từ năm 3000.',
    rarity: 'legendary'
  },

  // --- 🌟 MYTHIC (THẦN THOẠI TỐI THƯỢNG - GIÁ ĐẮT ĐẲNG CẤP) ---
  {
    id: 'avatar_wukong',
    name: 'Tôn Ngộ Không (Tề Thiên Đại Thánh)',
    category: 'avatar',
    emoji: '🐵',
    color: '#eab308',
    price: 12000,
    currency: 'coins',
    description: '72 phép thần thông, cưỡi Cân Đẩu Vân vượt vạn dặm mê cung trong chớp mắt!',
    rarity: 'mythic',
    mythicAura: 'from-amber-400 via-yellow-300 to-orange-500'
  },
  {
    id: 'avatar_phoenix_immortal',
    name: 'Phượng Hoàng Niết Bàn Vĩnh Cửu',
    category: 'avatar',
    emoji: '🪶',
    color: '#ef4444',
    price: 250,
    currency: 'gems',
    description: 'Linh điểu thần thánh tái sinh từ ngọn lửa tri thức bất diệt, tỏa ánh hào quang rực rỡ.',
    rarity: 'mythic',
    mythicAura: 'from-rose-500 via-amber-400 to-red-600'
  },
  {
    id: 'avatar_golden_qilin',
    name: 'Kỳ Lân Hoàng Kim Thần Giới',
    category: 'avatar',
    emoji: '🦄',
    color: '#facc15',
    price: 20000,
    currency: 'coins',
    description: 'Bảo vật thánh thú mang lại vận may tột đỉnh và trí tuệ vô cực cho thần đồng toán.',
    rarity: 'mythic',
    mythicAura: 'from-yellow-300 via-amber-400 to-yellow-500'
  },
  {
    id: 'avatar_dark_cosmic_dragon',
    name: 'Hắc Long Thần Vũ Trụ Vô Cực',
    category: 'avatar',
    emoji: '🐉',
    color: '#7c3aed',
    price: 500,
    currency: 'gems',
    description: 'Rồng thần tối thượng nắm giữ toàn bộ bí mật toán học của đa vũ trụ ngân hà!',
    rarity: 'mythic',
    mythicAura: 'from-purple-600 via-indigo-500 to-pink-500'
  },

  // ==========================================
  // 2. HATS & CROWNS (MŨ, VƯƠNG MIỆN & HÀO QUANG)
  // ==========================================
  // --- Common & Free ---
  {
    id: 'hat_none',
    name: 'Không đội mũ',
    category: 'hat',
    emoji: '✨',
    price: 0,
    currency: 'coins',
    description: 'Phong cách tự nhiên năng động.',
    unlockedByDefault: true,
    rarity: 'common'
  },
  {
    id: 'hat_party',
    name: 'Mũ Tiệc Vui Nhộn',
    category: 'hat',
    emoji: '🥳',
    price: 80,
    currency: 'coins',
    description: 'Lúc nào cũng sẵn sàng ăn mừng chiến thắng!',
    rarity: 'common'
  },
  {
    id: 'hat_vietnam_conical',
    name: 'Nón Lá Việt Nam',
    category: 'hat',
    emoji: '👒',
    price: 150,
    currency: 'coins',
    description: 'Nét đẹp truyền thống của học sinh Việt Nam chăm ngoan, hiếu học.',
    rarity: 'common'
  },

  // --- Rare ---
  {
    id: 'hat_chef',
    name: 'Mũ Đầu Bếp Nhí',
    category: 'hat',
    emoji: '🧑‍🍳',
    price: 300,
    currency: 'coins',
    description: 'Nấu những công thức toán học thơm ngon chuẩn vị.',
    rarity: 'rare'
  },
  {
    id: 'hat_sunglasses',
    name: 'Kính Râm Cool Ngầu',
    category: 'hat',
    emoji: '🕶️',
    price: 400,
    currency: 'coins',
    description: 'Trông cực kỳ phong cách trong mọi khung hình.',
    rarity: 'rare'
  },
  {
    id: 'hat_safari',
    name: 'Mũ Thám Hiểm',
    category: 'hat',
    emoji: '🤠',
    price: 20,
    currency: 'gems',
    description: 'Trang bị chuẩn cho những chuyến phiêu lưu mê cung.',
    rarity: 'rare'
  },

  // --- Epic ---
  {
    id: 'hat_grad',
    name: 'Nón Cử Nhân Trạng Nguyên',
    category: 'hat',
    emoji: '🎓',
    price: 1200,
    currency: 'coins',
    description: 'Chứng nhận học sinh giỏi xuất sắc toàn diện!',
    rarity: 'epic'
  },
  {
    id: 'hat_wizard',
    name: 'Mũ Phù Thủy Tím',
    category: 'hat',
    emoji: '🧙‍♂️',
    price: 1500,
    currency: 'coins',
    description: 'Tỏa ra ánh sáng ma thuật mỗi khi giải đúng bài.',
    rarity: 'epic'
  },
  {
    id: 'hat_headphones',
    name: 'Tai Nghe Gaming RGB',
    category: 'hat',
    emoji: '🎧',
    price: 1800,
    currency: 'coins',
    description: 'Vừa chơi vừa nghe giai điệu nhạc toán học cực bốc.',
    rarity: 'epic'
  },
  {
    id: 'hat_pirate',
    name: 'Mũ Vua Hải Tặc',
    category: 'hat',
    emoji: '🏴‍☠️',
    price: 2200,
    currency: 'coins',
    description: 'Thống trị hải trình và săn lùng kho báu tri thức.',
    rarity: 'epic'
  },
  {
    id: 'hat_ice_queen',
    name: 'Vương Miện Băng Giá Elsa',
    category: 'hat',
    emoji: '❄️',
    price: 2800,
    currency: 'coins',
    description: 'Pha lê tuyết lấp lánh, làm dịu mát tâm trí khi tính nhẩm.',
    rarity: 'epic'
  },

  // --- Legendary ---
  {
    id: 'hat_crown',
    name: 'Vương Miện Vàng Hoàng Gia',
    category: 'hat',
    emoji: '👑',
    price: 4500,
    currency: 'coins',
    description: 'Dành riêng cho vị vua tính nhẩm đại tài của vương quốc.',
    rarity: 'legendary'
  },
  {
    id: 'hat_spartan',
    name: 'Mũ Giáp Chiến Binh Spartan',
    category: 'hat',
    emoji: '🪖',
    price: 5500,
    currency: 'coins',
    description: 'Ý chí sắt đá không bao giờ chịu khuất phục trước bài toán khó.',
    rarity: 'legendary'
  },
  {
    id: 'hat_cyber_vr',
    name: 'Kính Thực Tế Ảo Cyber-Matrix',
    category: 'hat',
    emoji: '🥽',
    price: 75,
    currency: 'gems',
    description: 'Quét và phân tích toàn bộ đáp án với thuật toán siêu nhanh.',
    rarity: 'legendary'
  },

  // --- 🌟 MYTHIC (THẦN THOẠI TỐI THƯỢNG) ---
  {
    id: 'hat_sun_god_crown',
    name: 'Vương Miện Thần Mặt Trời Helios',
    category: 'hat',
    emoji: '☀️',
    price: 10000,
    currency: 'coins',
    description: 'Ánh dương rực rỡ tỏa muôn tia sáng thiêu rụi mọi sai sót số học.',
    rarity: 'mythic',
    mythicAura: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'hat_wukong_circlet',
    name: 'Vòng Kim Cô Đại Thánh',
    category: 'hat',
    emoji: '💫',
    price: 180,
    currency: 'gems',
    description: 'Bảo vật định tâm Phật gia giúp học sinh tập trung 100% không dao động.',
    rarity: 'mythic',
    mythicAura: 'from-yellow-400 to-orange-400'
  },
  {
    id: 'hat_divine_halo',
    name: 'Hào Quang Thánh Thần Tối Cao',
    category: 'hat',
    emoji: '😇',
    price: 16000,
    currency: 'coins',
    description: 'Vòng hào quang thiên thần rực rỡ đại diện cho trí tuệ thông tuệ tối thượng!',
    rarity: 'mythic',
    mythicAura: 'from-cyan-300 via-yellow-200 to-amber-400'
  },

  // ==========================================
  // 3. ACCESSORIES / WEAPONS / CAPES (PHỤ KIỆN & VŨ KHÍ)
  // ==========================================
  // --- Common & Free ---
  {
    id: 'acc_none',
    name: 'Không phụ kiện',
    category: 'accessory',
    emoji: '❌',
    price: 0,
    currency: 'coins',
    description: 'Gọn gàng nhẹ nhàng khi di chuyển.',
    unlockedByDefault: true,
    rarity: 'common'
  },
  {
    id: 'acc_backpack',
    name: 'Cặp Sách Tinh Anh',
    category: 'accessory',
    emoji: '🎒',
    price: 120,
    currency: 'coins',
    description: 'Chứa đựng tập vở và bí kíp giải toán điểm 10.',
    rarity: 'common'
  },

  // --- Rare ---
  {
    id: 'acc_shield',
    name: 'Khiên Hiệp Sĩ',
    category: 'accessory',
    emoji: '🛡️',
    price: 350,
    currency: 'coins',
    description: 'Bảo vệ bạn khỏi những chiếc bẫy tính sai.',
    rarity: 'rare'
  },
  {
    id: 'acc_cape',
    name: 'Áo Choàng Đỏ Siêu Anh Hùng',
    category: 'accessory',
    emoji: '🦸‍♂️',
    price: 500,
    currency: 'coins',
    description: 'Bay phấp phới mỗi bước chân chạy trong mê cung.',
    rarity: 'rare'
  },
  {
    id: 'acc_wand',
    name: 'Trượng Ngôi Sao May Mắn',
    category: 'accessory',
    emoji: '⭐',
    price: 650,
    currency: 'coins',
    description: 'Vẫy trượng tỏa ra bụi phép thuật lấp lánh.',
    rarity: 'rare'
  },

  // --- Epic ---
  {
    id: 'acc_bow',
    name: 'Cung Tên Thần Ánh Sáng',
    category: 'accessory',
    emoji: '🏹',
    price: 1800,
    currency: 'coins',
    description: 'Bắn trúng hồng tâm đáp án chính xác 100%.',
    rarity: 'epic'
  },
  {
    id: 'acc_wings',
    name: 'Cánh Thiên Thần Pha Lê',
    category: 'accessory',
    emoji: '🪽',
    price: 2500,
    currency: 'coins',
    description: 'Đôi cánh lấp lánh nâng đỡ từng bước tính nhẹ tựa lông hồng.',
    rarity: 'epic'
  },
  {
    id: 'acc_ice_shield',
    name: 'Khiên Băng Rồng Cổ Đại',
    category: 'accessory',
    emoji: '❄️',
    price: 3000,
    currency: 'coins',
    description: 'Đóng băng mọi lỗi sai và vững vàng trước mọi bài toán khó.',
    rarity: 'epic'
  },

  // --- Legendary ---
  {
    id: 'acc_jetpack',
    name: 'Balo Tên Lửa Lực Đẩy',
    category: 'accessory',
    emoji: '🚀',
    price: 60,
    currency: 'gems',
    description: 'Phản lực tên lửa giúp tăng tốc vèo vèo về đích.',
    rarity: 'legendary'
  },
  {
    id: 'acc_ruyi_jingu_bang',
    name: 'Gậy Như Ý Đại Thánh',
    category: 'accessory',
    emoji: '🥢',
    price: 6500,
    currency: 'coins',
    description: 'Biến hóa dài ngắn khôn lường, đập tan mọi cánh cổng gian nan.',
    rarity: 'legendary'
  },
  {
    id: 'acc_cosmic_cape',
    name: 'Áo Choàng Tinh Vân Ngân Hà',
    category: 'accessory',
    emoji: '🌌',
    price: 8000,
    currency: 'coins',
    description: 'Dệt từ bụi sao vũ trụ, lấp lánh huyền ảo trong bóng đêm.',
    rarity: 'legendary'
  },

  // --- 🌟 MYTHIC (THẦN THOẠI TỐI THƯỢNG) ---
  {
    id: 'acc_excalibur',
    name: 'Thánh Kiếm Excalibur Ánh Sáng',
    category: 'accessory',
    emoji: '🗡️',
    price: 14000,
    currency: 'coins',
    description: 'Thanh kiếm hoàng gia trong truyền thuyết, chém đứt mọi thử thách số học hóc búa nhất!',
    rarity: 'mythic',
    mythicAura: 'from-amber-300 via-yellow-200 to-indigo-500'
  },
  {
    id: 'acc_trident_poseidon',
    name: 'Đinh Ba Thần Hải Vương Poseidon',
    category: 'accessory',
    emoji: '🔱',
    price: 18000,
    currency: 'coins',
    description: 'Triệu hồi những cơn sóng thần tri thức mở toang mọi lối đi trong mê cung!',
    rarity: 'mythic',
    mythicAura: 'from-cyan-400 via-blue-500 to-indigo-600'
  },
  {
    id: 'acc_dragon_wings_fire',
    name: 'Cánh Thần Long Hỏa Diệm',
    category: 'accessory',
    emoji: '🔥',
    price: 280,
    currency: 'gems',
    description: 'Đôi cánh lửa thần thoại bay vượt trên mọi quy luật trọng lực!',
    rarity: 'mythic',
    mythicAura: 'from-orange-500 via-red-500 to-yellow-400'
  },

  // ==========================================
  // 4. PETS (THÚ CƯNG ĐỒNG HÀNH)
  // ==========================================
  // --- Common & Free ---
  {
    id: 'pet_none',
    name: 'Không có thú cưng',
    category: 'pet',
    emoji: '🐾',
    price: 0,
    currency: 'coins',
    description: 'Tự mình bước đi độc lập.',
    unlockedByDefault: true,
    rarity: 'common'
  },
  {
    id: 'pet_bee',
    name: 'Bé Ong Chăm Học',
    category: 'pet',
    emoji: '🐝',
    price: 150,
    currency: 'coins',
    description: 'Bay theo sau cổ vũ bạn chăm chỉ học toán mỗi ngày.',
    rarity: 'common'
  },

  // --- Rare ---
  {
    id: 'pet_turtle',
    name: 'Rùa Nhí Siêu Tốc',
    category: 'pet',
    emoji: '🐢',
    price: 350,
    currency: 'coins',
    description: 'Tuy là rùa nhưng tốc độ tính nhẩm nhanh như chớp.',
    rarity: 'rare'
  },
  {
    id: 'pet_shiba',
    name: 'Cún Shiba Vui Vẻ',
    category: 'pet',
    emoji: '🐕',
    price: 600,
    currency: 'coins',
    description: 'Luôn tươi cười vẫy đuôi ăn mừng mỗi khi bạn làm đúng.',
    rarity: 'rare'
  },
  {
    id: 'pet_polar_bear',
    name: 'Gấu Trắng Bắc Cực',
    category: 'pet',
    emoji: '🐻‍❄️',
    price: 850,
    currency: 'coins',
    description: 'Người bạn ấm áp xua tan sự căng thẳng khi học bài.',
    rarity: 'rare'
  },

  // --- Epic ---
  {
    id: 'pet_fox',
    name: 'Cáo Con Tinh Nghịch',
    category: 'pet',
    emoji: '🦊',
    price: 35,
    currency: 'gems',
    description: 'Cực kỳ tinh khôn trong việc tìm đường đi ngắn nhất.',
    rarity: 'epic'
  },
  {
    id: 'pet_owl',
    name: 'Cú Mèo Bác Học',
    category: 'pet',
    emoji: '🦉',
    price: 1500,
    currency: 'coins',
    description: 'Người bạn đồng hành thông tuệ mọi phép tính cổ kim.',
    rarity: 'epic'
  },
  {
    id: 'pet_fortune_cat',
    name: 'Mèo Thần Tài Maneki-Neko',
    category: 'pet',
    emoji: '🐱',
    price: 2500,
    currency: 'coins',
    description: 'Vẫy tay rước tài lộc, nhân đôi may mắn khi vượt mê cung.',
    rarity: 'epic'
  },
  {
    id: 'pet_golden_lion',
    name: 'Sư Tử Vàng Dũng Mãnh',
    category: 'pet',
    emoji: '🦁',
    price: 3500,
    currency: 'coins',
    description: 'Chúa tể thảo nguyên mang lại sự tự tin tuyệt đối.',
    rarity: 'epic'
  },

  // --- Legendary ---
  {
    id: 'pet_unicorn',
    name: 'Kỳ Lân Cầu Vồng',
    category: 'pet',
    emoji: '🦄',
    price: 80,
    currency: 'gems',
    description: 'Mang lại phép màu may mắn và niềm vui ngập tràn.',
    rarity: 'legendary'
  },
  {
    id: 'pet_dolphin',
    name: 'Cá Heo Đại Dương Trí Tuệ',
    category: 'pet',
    emoji: '🐬',
    price: 6000,
    currency: 'coins',
    description: 'Dẫn lối bạn vượt qua mê cung êm ả như lướt trên sóng nước.',
    rarity: 'legendary'
  },
  {
    id: 'pet_pegasus',
    name: 'Ngựa Thần Pegasus Thiên Hà',
    category: 'pet',
    emoji: '🐎',
    price: 120,
    currency: 'gems',
    description: 'Ngựa thần có cánh lấp lánh ánh sao đưa bạn bay qua mọi ải gian nan.',
    rarity: 'legendary'
  },

  // --- 🌟 MYTHIC (THẦN THOẠI TỐI THƯỢNG) ---
  {
    id: 'pet_phoenix_spirit',
    name: 'Phượng Hoàng Lửa Cực Quang',
    category: 'pet',
    emoji: '🦅',
    price: 15000,
    currency: 'coins',
    description: 'Linh điểu thần thánh hộ thể, thắp sáng cả bầu trời trí tuệ bằng đôi cánh lửa!',
    rarity: 'mythic',
    mythicAura: 'from-amber-400 via-rose-500 to-red-500'
  },
  {
    id: 'pet_white_tiger',
    name: 'Bạch Hổ Thần Thánh Phương Đông',
    category: 'pet',
    emoji: '🐯',
    price: 18000,
    currency: 'coins',
    description: 'Linh thú huyền thoại phương Đông bảo vệ ngôi vị Trạng Nguyên số học.',
    rarity: 'mythic',
    mythicAura: 'from-slate-200 via-amber-300 to-yellow-400'
  },
  {
    id: 'pet_baby_cosmic_dragon',
    name: 'Rồng Con Vũ Trụ Thần Giới',
    category: 'pet',
    emoji: '🐲',
    price: 350,
    currency: 'gems',
    description: 'Bé rồng sinh ra từ năng lượng các vì sao, trung thành tuyệt đối với chủ nhân!',
    rarity: 'mythic',
    mythicAura: 'from-cyan-400 via-purple-500 to-pink-500'
  },

  // ==========================================
  // 5. TRAILS (HIỆU ỨNG VỆT BƯỚC CHÂN)
  // ==========================================
  // --- Common & Free ---
  {
    id: 'trail_none',
    name: 'Vệt bình thường',
    category: 'trail',
    emoji: '👣',
    price: 0,
    currency: 'coins',
    description: 'Dấu chân bước đi nhẹ nhàng.',
    unlockedByDefault: true,
    rarity: 'common'
  },
  {
    id: 'trail_music',
    name: 'Vệt Nốt Nhạc Rộn Ràng',
    category: 'trail',
    emoji: '🎵',
    price: 200,
    currency: 'coins',
    description: 'Mỗi bước chân phát ra những giai điệu vui tai.',
    rarity: 'common'
  },

  // --- Rare ---
  {
    id: 'trail_bubbles',
    name: 'Vệt Bong Bóng Nước',
    category: 'trail',
    emoji: '🫧',
    price: 450,
    currency: 'coins',
    description: 'Bong bóng nổi bồng bềnh êm dịu.',
    rarity: 'rare'
  },
  {
    id: 'trail_stars',
    name: 'Vệt Sao Lấp Lánh',
    category: 'trail',
    emoji: '✨',
    price: 600,
    currency: 'coins',
    description: 'Tỏa sáng rực rỡ theo mỗi bước chân.',
    rarity: 'rare'
  },

  // --- Epic ---
  {
    id: 'trail_hearts',
    name: 'Vệt Trái Tim Yêu Thương',
    category: 'trail',
    emoji: '💖',
    price: 40,
    currency: 'gems',
    description: 'Lan tỏa tình yêu toán học đến mọi ngóc ngách.',
    rarity: 'epic'
  },
  {
    id: 'trail_rainbow',
    name: 'Vệt Cầu Vồng 7 Sắc',
    category: 'trail',
    emoji: '🌈',
    price: 1500,
    currency: 'coins',
    description: 'Đường đi ngập tràn 7 sắc cầu vồng huyền diệu.',
    rarity: 'epic'
  },
  {
    id: 'trail_snow_crystal',
    name: 'Vệt Băng Tuyết Pha Lê',
    category: 'trail',
    emoji: '❄️',
    price: 2200,
    currency: 'coins',
    description: 'Những bông tuyết pha lê phát sáng theo mỗi bước chân.',
    rarity: 'epic'
  },

  // --- Legendary ---
  {
    id: 'trail_fire',
    name: 'Vệt Lửa Hỏa Diệm Sơn',
    category: 'trail',
    emoji: '🔥',
    price: 4500,
    currency: 'coins',
    description: 'Ngọn lửa nhiệt huyết bùng cháy mãnh liệt thể hiện ý chí chiến thắng.',
    rarity: 'legendary'
  },
  {
    id: 'trail_lotus_sacred',
    name: 'Vệt Hoa Sen Thần Khí',
    category: 'trail',
    emoji: '🪷',
    price: 6000,
    currency: 'coins',
    description: 'Mỗi bước chân nở rộ đóa sen vàng thanh cao, tỏa ngát hương thơm trí tuệ.',
    rarity: 'legendary'
  },

  // --- 🌟 MYTHIC (THẦN THOẠI TỐI THƯỢNG) ---
  {
    id: 'trail_golden_lightning',
    name: 'Vệt Sấm Sét Hoàng Kim',
    category: 'trail',
    emoji: '⚡',
    price: 12000,
    currency: 'coins',
    description: 'Tia sét vàng hoàng gia giáng xuống mặt đất theo từng bước di chuyển uy phong!',
    rarity: 'mythic',
    mythicAura: 'from-amber-400 to-yellow-300'
  },
  {
    id: 'trail_cosmic_galaxy',
    name: 'Vệt Dải Ngân Hà Đa Vũ Trụ',
    category: 'trail',
    emoji: '🌌',
    price: 200,
    currency: 'gems',
    description: 'Dấu chân để lại cả một dải ngân hà rực sáng với hàng triệu vì sao băng!',
    rarity: 'mythic',
    mythicAura: 'from-purple-500 via-indigo-600 to-pink-500'
  }
];
