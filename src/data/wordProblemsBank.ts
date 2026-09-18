import { GradeLevel } from '../types';

export interface WordProblemItem {
  id: string;
  grade: GradeLevel;
  type: 
    | 'sum_diff'              // 1. Dạng tổng - hiệu
    | 'multi_step'             // 2. Dạng nhiều bước
    | 'unknown_number'        // 3. Dạng tìm số chưa biết & chia có dư
    | 'age_problem'           // 4. Dạng tuổi
    | 'work_backwards'        // 5. Dạng suy luận ngược
    | 'multiple_quantities'   // 6. Dạng gấp nhiều lần / chuỗi đại lượng
    | 'conditional_division'  // 7. Dạng chia có điều kiện / xếp hàng
    | 'money_shopping'        // 8. Dạng tiền & mua sắm
    | 'productivity_rate'     // 9. Dạng năng suất & công việc
    | 'advanced_age'          // 10. Dạng tuổi nâng cao
    | 'pattern_three_numbers' // 11. Dạng số có quy luật / Tổng 3 số
    | 'snail_climb_logic'     // 12. Dạng ốc sên leo tường / Game bẫy
    | 'deductive_distribution'// 13. Dạng suy luận / chia kẹo bánh
    | 'digit_structure'       // 14. Dạng nhiều điều kiện / cấu tạo số
    | 'more_less'            // Nhiều hơn / Ít hơn
    | 'times_factor'          // Gấp lên / Giảm đi số lần
    | 'unit_rate'             // Rút về đơn vị
    | 'sum_ratio'             // Tổng - Tỉ
    | 'diff_ratio'            // Hiệu - Tỉ
    | 'speed_motion'          // Chuyển động đều (s = v * t)
    | 'geometry_area'         // Chu vi & Diện tích thực tế
    | 'percentage_shopping'   // Mua sắm & Tỉ số phần trăm
    | 'measurement_story';    // Đơn vị đo thực tế

  story: string;             // Đề bài lời văn
  shortQuestion: string;     // Câu hỏi vắn tắt
  correctAnswer: number;     // Đáp án chính xác
  unit: string;              // Đơn vị (kg, quyển, tuổi, viên bi, con, học sinh, đồng, cây, ngày, cái...)
  options: number[];         // 3-4 lựa chọn trắc nghiệm
  explanation: string;       // Lời giải chi tiết từng bước
  hint?: string;             // Gợi ý tóm tắt sơ đồ
  tag?: string;              // Nhãn phân loại bài toán nâng cao
}

// =========================================================================
// KHO BÀI TOÁN CÓ LỜI VĂN & TOÁN NÂNG CAO CHO HỌC SINH TIỂU HỌC (LỚP 1 - 5)
// =========================================================================

export const WORD_PROBLEMS_BANK: WordProblemItem[] = [
  // =======================================================================
  // 🌟 14 DẠNG TOÁN NÂNG CAO & OLYMPIC CHUẨN ĐẶC SẮC
  // =======================================================================

  // 1. DẠNG TỔNG – HIỆU (Bài 1)
  {
    id: 'wp_adv_01',
    grade: 4,
    type: 'sum_diff',
    tag: '1. Dạng Tổng - Hiệu',
    story: 'Hai kho có tất cả 156 kg gạo. Nếu chuyển 18 kg gạo từ kho thứ nhất sang kho thứ hai thì hai kho có số gạo bằng nhau. Hỏi lúc đầu kho thứ nhất có bao nhiêu ki-lô-gam gạo?',
    shortQuestion: 'Lúc đầu kho thứ nhất có bao nhiêu kg gạo?',
    correctAnswer: 96,
    unit: 'kg',
    options: [96, 60, 88, 102],
    explanation: 'Khi chuyển 18 kg từ kho 1 sang kho 2 thì 2 kho bằng nhau, tức kho 1 hơn kho 2 là: 18 × 2 = 36 (kg). Số gạo kho 1 lúc đầu là: (156 + 36) ÷ 2 = 96 (kg). (Kho 2 lúc đầu có: 156 - 96 = 60 kg).',
    hint: 'Kho 1 hơn kho 2 là: 18 × 2 = 36 kg. Số lớn = (Tổng + Hiệu) ÷ 2.'
  },
  {
    id: 'wp_adv_01_b',
    grade: 4,
    type: 'sum_diff',
    tag: '1. Dạng Tổng - Hiệu',
    story: 'Hai thùng dầu có tất cả 120 lít dầu. Nếu rót 15 lít từ thùng thứ nhất sang thùng thứ hai thì số dầu hai thùng bằng nhau. Hỏi lúc đầu thùng thứ hai có bao nhiêu lít dầu?',
    shortQuestion: 'Lúc đầu thùng thứ hai có bao nhiêu lít dầu?',
    correctAnswer: 45,
    unit: 'lít',
    options: [45, 75, 50, 60],
    explanation: 'Hiệu số dầu giữa 2 thùng là: 15 × 2 = 30 (lít). Thùng thứ hai (số bé) lúc đầu có: (120 - 30) ÷ 2 = 45 (lít).',
    hint: 'Thùng 1 hơn thùng 2: 15 × 2 = 30 lít. Thùng bé = (Tổng - Hiệu) ÷ 2.'
  },

  // 2. DẠNG NHIỀU BƯỚC (Bài 2)
  {
    id: 'wp_adv_02',
    grade: 3,
    type: 'multi_step',
    tag: '2. Dạng Nhiều Bước',
    story: 'Một cửa hàng có 245 quyển vở. Buổi sáng bán được 68 quyển. Buổi chiều bán số vở gấp đôi buổi sáng. Hỏi cửa hàng còn lại bao nhiêu quyển vở?',
    shortQuestion: 'Cửa hàng còn lại bao nhiêu quyển vở?',
    correctAnswer: 41,
    unit: 'quyển',
    options: [41, 136, 109, 39],
    explanation: 'Buổi chiều bán được: 68 × 2 = 136 (quyển). Cả 2 buổi bán được: 68 + 136 = 204 (quyển). Cửa hàng còn lại: 245 - 204 = 41 (quyển).',
    hint: 'Bước 1: Tính buổi chiều (68 × 2). Bước 2: Tính tổng 2 buổi. Bước 3: Lấy tổng ban đầu trừ đi.'
  },
  {
    id: 'wp_adv_02_b',
    grade: 3,
    type: 'multi_step',
    tag: '2. Dạng Nhiều Bước',
    story: 'Một tiệm bánh có 180 cái bánh kem. Buổi sáng bán được 45 cái bánh. Buổi chiều bán được số bánh gấp 2 lần buổi sáng. Hỏi tiệm còn lại bao nhiêu cái bánh kem?',
    shortQuestion: 'Tiệm còn lại bao nhiêu cái bánh kem?',
    correctAnswer: 45,
    unit: 'cái bánh',
    options: [45, 90, 135, 50],
    explanation: 'Buổi chiều bán: 45 × 2 = 90 (cái). Cả ngày bán: 45 + 90 = 135 (cái). Còn lại: 180 - 135 = 45 (cái).',
    hint: 'Buổi chiều = 45 × 2 = 90. Còn lại = 180 - (45 + 90).'
  },

  // 3. DẠNG TÌM SỐ CHƯA BIẾT & CHIA CÓ DƯ (Bài 3)
  {
    id: 'wp_adv_03',
    grade: 3,
    type: 'unknown_number',
    tag: '3. Dạng Tìm Số Chưa Biết',
    story: 'Một số khi chia cho 6 thì được thương là 35 và số dư là 4. Nếu lấy số đó cộng với 17 rồi chia cho 7 thì được thương là bao nhiêu?',
    shortQuestion: 'Thương của phép chia mới là bao nhiêu?',
    correctAnswer: 33,
    unit: '',
    options: [33, 35, 31, 37],
    explanation: 'Số ban đầu là: 6 × 35 + 4 = 214. Lấy số đó cộng 17: 214 + 17 = 231. Phép chia mới: 231 ÷ 7 = 33 (dư 0). Vậy thương là 33.',
    hint: 'Bước 1: Số bị chia = Thương × Số chia + Số dư. Bước 2: Cộng 17 rồi chia 7.'
  },
  {
    id: 'wp_adv_03_b',
    grade: 3,
    type: 'unknown_number',
    tag: '3. Dạng Tìm Số Chưa Biết',
    story: 'Một số chia cho 8 được thương là 24 và dư 5. Hỏi nếu lấy số đó trừ đi 21 rồi chia cho 7 thì được kết quả là bao nhiêu?',
    shortQuestion: 'Kết quả của phép chia mới là bao nhiêu?',
    correctAnswer: 25,
    unit: '',
    options: [25, 24, 27, 23],
    explanation: 'Số ban đầu là: 8 × 24 + 5 = 197. Sau khi trừ 21: 197 - 21 = 175. Lấy 175 ÷ 7 = 25.',
    hint: 'Số ban đầu = 24 × 8 + 5 = 197. Sau đó: (197 - 21) ÷ 7.'
  },

  // 4. DẠNG TUỔI (Bài 4)
  {
    id: 'wp_adv_04',
    grade: 3,
    type: 'age_problem',
    tag: '4. Dạng Tuổi',
    story: 'Năm nay mẹ 36 tuổi, tuổi con bằng 1/4 tuổi mẹ. Hỏi sau 4 năm nữa, tổng số tuổi của hai mẹ con là bao nhiêu tuổi?',
    shortQuestion: 'Sau 4 năm nữa, tổng số tuổi 2 mẹ con là bao nhiêu?',
    correctAnswer: 53,
    unit: 'tuổi',
    options: [53, 49, 45, 58],
    explanation: 'Tuổi con hiện nay là: 36 ÷ 4 = 9 (tuổi). Sau 4 năm nữa, tuổi mẹ là: 36 + 4 = 40 (tuổi), tuổi con là: 9 + 4 = 13 (tuổi). Tổng số tuổi hai mẹ con sau 4 năm là: 40 + 13 = 53 (tuổi).',
    hint: 'Tuổi con hiện nay = 36 ÷ 4 = 9. Sau 4 năm mỗi người tăng thêm 4 tuổi.'
  },
  {
    id: 'wp_adv_04_b',
    grade: 3,
    type: 'age_problem',
    tag: '4. Dạng Tuổi',
    story: 'Hiện nay bố 40 tuổi, tuổi con bằng 1/5 tuổi bố. Hỏi sau 3 năm nữa, cả hai bố con có tất cả bao nhiêu tuổi?',
    shortQuestion: 'Sau 3 năm nữa, tổng tuổi hai bố con là bao nhiêu?',
    correctAnswer: 54,
    unit: 'tuổi',
    options: [54, 48, 51, 56],
    explanation: 'Tuổi con hiện nay: 40 ÷ 5 = 8 (tuổi). Sau 3 năm: Bố 43 tuổi, con 11 tuổi. Tổng tuổi: 43 + 11 = 54 (tuổi).',
    hint: 'Con hiện nay = 40 ÷ 5 = 8. Sau 3 năm: (40+3) + (8+3) = 54.'
  },

  // 5. DẠNG SUY LUẬN NGƯỢC (Bài 5)
  {
    id: 'wp_adv_05',
    grade: 2,
    type: 'work_backwards',
    tag: '5. Dạng Suy Luận Ngược',
    story: 'An có một số viên bi. An cho Bình 12 viên, sau đó được mẹ cho thêm 8 viên thì An có 35 viên. Hỏi lúc đầu An có bao nhiêu viên bi?',
    shortQuestion: 'Lúc đầu An có bao nhiêu viên bi?',
    correctAnswer: 39,
    unit: 'viên bi',
    options: [39, 31, 43, 27],
    explanation: 'Tính ngược từ cuối: Trước khi mẹ cho thêm 8 viên, An có: 35 - 8 = 27 (viên). Trước khi cho Bình 12 viên (lúc đầu), An có: 27 + 12 = 39 (viên).',
    hint: 'Tính ngược lại: Lấy 35 trừ 8 rồi cộng 12.'
  },
  {
    id: 'wp_adv_05_b',
    grade: 2,
    type: 'work_backwards',
    tag: '5. Dạng Suy Luận Ngược',
    story: 'Bà có một rổ cam. Bà biếu bác hàng xóm 15 quả, sau đó bà hái thêm 6 quả ở vườn vào rổ thì trong rổ có 28 quả. Hỏi lúc đầu rổ cam có bao nhiêu quả?',
    shortQuestion: 'Lúc đầu rổ cam có bao nhiêu quả?',
    correctAnswer: 37,
    unit: 'quả cam',
    options: [37, 33, 41, 29],
    explanation: 'Tính ngược lại: 28 - 6 = 22 (quả). Lúc đầu bà có: 22 + 15 = 37 (quả).',
    hint: 'Tính ngược từ kết quả: 28 - 6 + 15 = 37 quả.'
  },

  // 6. DẠNG GẤP NHIỀU LẦN / CHUỖI ĐỐI TƯỢNG (Bài 6)
  {
    id: 'wp_adv_06',
    grade: 3,
    type: 'multiple_quantities',
    tag: '6. Dạng Gấp Nhiều Lần',
    story: 'Một trang trại có 24 con gà. Số vịt gấp 3 lần số gà. Số ngan ít hơn số vịt 17 con. Hỏi trang trại có tất cả bao nhiêu con gà, vịt và ngan?',
    shortQuestion: 'Trang trại có tất cả bao nhiêu con gia cầm?',
    correctAnswer: 151,
    unit: 'con',
    options: [151, 127, 144, 168],
    explanation: 'Số vịt là: 24 × 3 = 72 (con). Số ngan là: 72 - 17 = 55 (con). Tổng số gia cầm là: 24 (gà) + 72 (vịt) + 55 (ngan) = 151 (con).',
    hint: 'Bước 1: Vịt = 24 × 3 = 72. Bước 2: Ngan = 72 - 17 = 55. Bước 3: Tổng = 24 + 72 + 55.'
  },
  {
    id: 'wp_adv_06_b',
    grade: 3,
    type: 'multiple_quantities',
    tag: '6. Dạng Gấp Nhiều Lần',
    story: 'Cửa hàng có 18 chiếc xe đạp đỏ. Số xe đạp xanh gấp 4 lần số xe đạp đỏ. Số xe đạp đen ít hơn xe đạp xanh 15 chiếc. Hỏi cửa hàng có bao nhiêu xe đạp đen?',
    shortQuestion: 'Cửa hàng có bao nhiêu xe đạp đen?',
    correctAnswer: 57,
    unit: 'chiếc xe',
    options: [57, 72, 60, 54],
    explanation: 'Số xe đạp xanh là: 18 × 4 = 72 (chiếc). Số xe đạp đen là: 72 - 15 = 57 (chiếc).',
    hint: 'Xe xanh = 18 × 4 = 72. Xe đen = 72 - 15.'
  },

  // 7. DẠNG CHIA CÓ ĐIỀU KIỆN / XẾP HÀNG (Bài 7)
  {
    id: 'wp_adv_07',
    grade: 3,
    type: 'conditional_division',
    tag: '7. Dạng Chia Có Điều Kiện',
    story: 'Có 87 học sinh xếp thành các hàng, mỗi hàng 8 học sinh. Hỏi xếp được nhiều nhất bao nhiêu hàng đầy đủ và cần thêm ít nhất bao nhiêu học sinh để tất cả các hàng đều đủ 8 bạn?',
    shortQuestion: 'Cần thêm ít nhất bao nhiêu học sinh để đủ hàng?',
    correctAnswer: 1,
    unit: 'học sinh',
    options: [1, 7, 2, 3],
    explanation: 'Thực hiện phép chia: 87 ÷ 8 = 10 (dư 7). Như vậy xếp được 10 hàng đầy đủ và dư 7 bạn. Để hàng cuối đủ 8 bạn, cần thêm ít nhất: 8 - 7 = 1 (học sinh).',
    hint: '87 ÷ 8 = 10 (dư 7). Hàng đang có 7 bạn, cần thêm 8 - 7 = 1 bạn.'
  },
  {
    id: 'wp_adv_07_b',
    grade: 3,
    type: 'conditional_division',
    tag: '7. Dạng Chia Có Điều Kiện',
    story: 'Có 65 quyển truyện xếp vào các ngăn giá sách, mỗi ngăn chứa tối đa 9 quyển. Hỏi cần thêm ít nhất bao nhiêu quyển truyện nữa để tất cả các ngăn đều xếp đầy?',
    shortQuestion: 'Cần thêm ít nhất bao nhiêu quyển truyện?',
    correctAnswer: 7,
    unit: 'quyển',
    options: [7, 2, 4, 5],
    explanation: 'Ta có: 65 ÷ 9 = 7 (dư 2). Ngăn cuối mới có 2 quyển, vậy cần thêm ít nhất: 9 - 2 = 7 (quyển).',
    hint: '65 chia 9 dư 2 quyển. Cần thêm 9 - 2 = 7 quyển.'
  },

  // 8. DẠNG TIỀN & MUA SẮM (Bài 8)
  {
    id: 'wp_adv_08',
    grade: 3,
    type: 'money_shopping',
    tag: '8. Dạng Tiền',
    story: 'Lan có 100.000 đồng. Lan mua 3 quyển vở, mỗi quyển 12.000 đồng và một hộp bút giá 35.000 đồng. Sau đó Lan được mẹ cho thêm 20.000 đồng. Hỏi Lan còn lại bao nhiêu tiền?',
    shortQuestion: 'Lan còn lại bao nhiêu tiền?',
    correctAnswer: 49000,
    unit: 'đồng',
    options: [49000, 29000, 51000, 45000],
    explanation: 'Số tiền mua 3 quyển vở: 3 × 12.000 = 36.000 (đồng). Tổng tiền đã tiêu: 36.000 + 35.000 = 71.000 (đồng). Số tiền còn lại: 100.000 - 71.000 + 20.000 = 49.000 (đồng).',
    hint: 'Tiền đã mua = 3 × 12.000 + 35.000 = 71.000 đồng. Tiền còn lại = 100.000 - 71.000 + 20.000.'
  },
  {
    id: 'wp_adv_08_b',
    grade: 3,
    type: 'money_shopping',
    tag: '8. Dạng Tiền',
    story: 'Minh có 80.000 đồng. Minh mua 2 chiếc compa giá 18.000 đồng/chiếc và một thước kẻ giá 14.000 đồng. Sau đó bố thưởng thêm 15.000 đồng. Hỏi Minh còn bao nhiêu tiền?',
    shortQuestion: 'Minh còn lại bao nhiêu tiền?',
    correctAnswer: 45000,
    unit: 'đồng',
    options: [45000, 30000, 48000, 42000],
    explanation: 'Tiền mua đồ: 2 × 18.000 + 14.000 = 50.000 (đồng). Tiền còn lại: 80.000 - 50.000 + 15.000 = 45.000 (đồng).',
    hint: 'Đã mua: 36.000 + 14.000 = 50.000. Còn lại: 80.000 - 50.000 + 15.000 = 45.000 đồng.'
  },

  // 9. DẠNG NĂNG SUẤT (Bài 9)
  {
    id: 'wp_adv_09',
    grade: 3,
    type: 'productivity_rate',
    tag: '9. Dạng Năng Suất',
    story: 'Một đội trồng cây. Ngày thứ nhất trồng được 125 cây. Ngày thứ hai trồng nhiều hơn ngày thứ nhất 37 cây. Ngày thứ ba trồng ít hơn ngày thứ hai 28 cây. Hỏi cả ba ngày đội đó trồng được bao nhiêu cây?',
    shortQuestion: 'Cả ba ngày đội đó trồng được bao nhiêu cây?',
    correctAnswer: 421,
    unit: 'cây',
    options: [421, 393, 449, 415],
    explanation: 'Ngày thứ hai trồng được: 125 + 37 = 162 (cây). Ngày thứ ba trồng được: 162 - 28 = 134 (cây). Cả ba ngày trồng được: 125 + 162 + 134 = 421 (cây).',
    hint: 'Ngày 2 = 125 + 37 = 162 cây. Ngày 3 = 162 - 28 = 134 cây. Tổng 3 ngày = 125 + 162 + 134.'
  },
  {
    id: 'wp_adv_09_b',
    grade: 3,
    type: 'productivity_rate',
    tag: '9. Dạng Năng Suất',
    story: 'Bác thợ may. Tuần 1 may được 140 chiếc áo. Tuần 2 may nhiều hơn tuần 1 là 25 chiếc. Tuần 3 may ít hơn tuần 2 là 18 chiếc. Hỏi cả 3 tuần may được bao nhiêu chiếc áo?',
    shortQuestion: 'Cả 3 tuần may được bao nhiêu chiếc áo?',
    correctAnswer: 452,
    unit: 'chiếc áo',
    options: [452, 445, 460, 430],
    explanation: 'Tuần 2 may: 140 + 25 = 165 (chiếc). Tuần 3 may: 165 - 18 = 147 (chiếc). Cả 3 tuần may: 140 + 165 + 147 = 452 (chiếc).',
    hint: 'Tuần 2 = 165, Tuần 3 = 147. Tổng = 140 + 165 + 147 = 452.'
  },

  // 10. DẠNG TUỔI NÂNG CAO (Bài 10)
  {
    id: 'wp_adv_10',
    grade: 4,
    type: 'advanced_age',
    tag: '10. Dạng Tuổi Nâng Cao',
    story: 'Hiện nay bố 38 tuổi, con 10 tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi bố gấp 3 lần tuổi con?',
    shortQuestion: 'Sau bao nhiêu năm nữa tuổi bố gấp 3 lần tuổi con?',
    correctAnswer: 4,
    unit: 'năm',
    options: [4, 3, 5, 2],
    explanation: 'Hiệu số tuổi của 2 bố con luôn không đổi: 38 - 10 = 28 (tuổi). Khi tuổi bố gấp 3 lần tuổi con, hiệu số phần là: 3 - 1 = 2 (phần). Tuổi con khi đó là: 28 ÷ 2 = 14 (tuổi). Số năm cần thêm là: 14 - 10 = 4 (năm). (Thử lại: sau 4 năm bố 42 tuổi, con 14 tuổi; 42 = 14 × 3).',
    hint: 'Hiệu số tuổi không đổi: 38 - 10 = 28 tuổi. Khi bố gấp 3 lần con, con = 28 ÷ (3-1) = 14 tuổi.'
  },
  {
    id: 'wp_adv_10_b',
    grade: 4,
    type: 'advanced_age',
    tag: '10. Dạng Tuổi Nâng Cao',
    story: 'Hiện nay anh 12 tuổi, em 7 tuổi. Hỏi cách đây bao nhiêu năm thì tuổi anh gấp 2 lần tuổi em?',
    shortQuestion: 'Cách đây bao nhiêu năm tuổi anh gấp đôi tuổi em?',
    correctAnswer: 2,
    unit: 'năm trước',
    options: [2, 3, 1, 4],
    explanation: 'Hiệu số tuổi giữa anh và em là: 12 - 7 = 5 (tuổi). Khi tuổi anh gấp đôi tuổi em, tuổi em lúc đó bằng hiệu số tuổi là 5 tuổi. Số năm trước đây là: 7 - 5 = 2 (năm trước).',
    hint: 'Hiệu tuổi không đổi = 5 tuổi. Khi anh gấp đôi em thì em 5 tuổi, tức cách đây 7 - 5 = 2 năm.'
  },

  // 11. DẠNG SỐ CÓ QUY LUẬT / TỔNG 3 SỐ (Bài 11)
  {
    id: 'wp_adv_11',
    grade: 4,
    type: 'pattern_three_numbers',
    tag: '11. Dạng Số Quy Luật',
    story: 'Tổng của ba số là 180. Số thứ nhất gấp đôi số thứ hai. Số thứ ba hơn số thứ hai 20 đơn vị. Tìm số thứ hai.',
    shortQuestion: 'Số thứ hai có giá trị là bao nhiêu?',
    correctAnswer: 40,
    unit: '',
    options: [40, 80, 60, 50],
    explanation: 'Coi số thứ hai là 1 phần, số thứ nhất là 2 phần, số thứ ba là 1 phần + 20 đơn vị. Tổng 3 số tương ứng với: 1 + 2 + 1 = 4 (phần) cộng 20. Giá trị của 4 phần là: 180 - 20 = 160. Số thứ hai (1 phần) là: 160 ÷ 4 = 40. (Số thứ nhất = 80, số thứ ba = 60).',
    hint: 'Coi số 2 là 1 phần -> Số 1 là 2 phần, Số 3 là 1 phần + 20. Tổng 4 phần = 180 - 20 = 160.'
  },
  {
    id: 'wp_adv_11_b',
    grade: 4,
    type: 'pattern_three_numbers',
    tag: '11. Dạng Số Quy Luật',
    story: 'Tổng ba số là 125. Số thứ nhất gấp 3 lần số thứ hai. Số thứ ba ít hơn số thứ nhất 15 đơn vị. Hỏi số thứ nhất là bao nhiêu?',
    shortQuestion: 'Số thứ nhất có giá trị là bao nhiêu?',
    correctAnswer: 60,
    unit: '',
    options: [60, 20, 45, 75],
    explanation: 'Coi số thứ hai là 1 phần, số thứ nhất là 3 phần, số thứ ba là 3 phần - 15. Tổng 3 số là: 1 + 3 + 3 = 7 (phần) bớt 15. Giá trị 7 phần là: 125 + 15 = 140. Số thứ hai (1 phần) là: 140 ÷ 7 = 20. Số thứ nhất là: 20 × 3 = 60. (Số thứ ba là: 60 - 15 = 45. Thử lại: 60 + 20 + 45 = 125).',
    hint: 'Coi số 2 là 1 phần -> Số 1 là 3 phần, Số 3 là 3 phần - 15. Giá trị 7 phần = 125 + 15 = 140.'
  },

  // 12. DẠNG CỰC HAY ĐỂ LÀM GAME: ỐC SÊN LEO TƯỜNG (Bài 12)
  {
    id: 'wp_adv_12',
    grade: 3,
    type: 'snail_climb_logic',
    tag: '12. Dạng Ốc Sên Leo Tường',
    story: 'Một con ốc sên muốn bò lên một bức tường cao 10 m. Ban ngày nó bò lên được 3 m, nhưng ban đêm lúc ngủ lại bị tụt xuống 2 m. Hỏi sau bao nhiêu ngày con ốc sên lên được đỉnh tường?',
    shortQuestion: 'Sau bao nhiêu ngày con ốc sên lên đến đỉnh tường?',
    correctAnswer: 8,
    unit: 'ngày',
    options: [8, 10, 7, 9],
    explanation: 'Mỗi ngày và đêm, ốc sên tiến thực tế: 3 - 2 = 1 (m). Sau 7 ngày và 7 đêm, ốc sên lên được: 7 × 1 = 7 (m). Sang ngày thứ 8, ban ngày ốc sên bò thêm 3 m: 7 + 3 = 10 (m), đã chạm đỉnh tường và hoàn thành ngay ban ngày! (Chú ý bẫy: Tính 10 ÷ 1 = 10 là sai vì đã lên đỉnh thì không bị tụt nữa).',
    hint: 'Bẫy kinh điển: Sau 7 ngày đêm được 7m. Sang ngày thứ 8 ban ngày bò thêm 3m là tới đỉnh 10m!'
  },
  {
    id: 'wp_adv_12_b',
    grade: 3,
    type: 'snail_climb_logic',
    tag: '12. Dạng Ốc Sên Leo Tường',
    story: 'Một chú khỉ leo lên cây dừa cao 15 m. Mỗi phút chú leo lên 4 m, nhưng vì trơn nên trượt xuống 2 m. Hỏi sau bao nhiêu phút chú khỉ chạm đến ngọn dừa?',
    shortQuestion: 'Sau bao nhiêu phút chú khỉ chạm đến ngọn dừa?',
    correctAnswer: 7,
    unit: 'phút',
    options: [7, 8, 6, 10],
    explanation: 'Mỗi chu kỳ chú tiến được: 4 - 2 = 2 (m). Sau 5 phút, chú lên được: 5 × 2 = 10 (m). Sang phút thứ 6, chú leo thêm 4m được 14m, trượt 2m còn 12m. Đến phút thứ 7, chú leo tiếp 4m: 12 + 4 = 16m > 15m => Chạm đỉnh ở phút thứ 7.',
    hint: 'Sau 5 chu kỳ = 10m. Phút 6 = 12m. Phút 7 leo 4m đạt 16m chạm đỉnh.'
  },

  // 13. DẠNG SUY LUẬN / CHIA KẸO BÁNH (Bài 13)
  {
    id: 'wp_adv_13',
    grade: 3,
    type: 'deductive_distribution',
    tag: '13. Dạng Suy Luận',
    story: 'Có 3 hộp bánh. Hộp thứ nhất có 24 cái. Hộp thứ hai có số bánh gấp đôi hộp thứ nhất. Hộp thứ ba có ít hơn hộp thứ hai 15 cái. Người ta lấy tổng số bánh của hộp thứ nhất và thứ ba chia đều cho 3 bạn. Hỏi mỗi bạn nhận được bao nhiêu cái bánh?',
    shortQuestion: 'Mỗi bạn nhận được bao nhiêu cái bánh?',
    correctAnswer: 19,
    unit: 'cái bánh',
    options: [19, 21, 18, 24],
    explanation: 'Hộp thứ hai có: 24 × 2 = 48 (cái). Hộp thứ ba có: 48 - 15 = 33 (cái). Tổng số bánh của hộp 1 và hộp 3 là: 24 + 33 = 57 (cái). Chia đều cho 3 bạn, mỗi bạn được: 57 ÷ 3 = 19 (cái bánh).',
    hint: 'Hộp 2 = 24 × 2 = 48. Hộp 3 = 48 - 15 = 33. Tổng hộp 1 + 3 = 24 + 33 = 57. Chia 3 bạn = 57 ÷ 3.'
  },
  {
    id: 'wp_adv_13_b',
    grade: 3,
    type: 'deductive_distribution',
    tag: '13. Dạng Suy Luận',
    story: 'Có 3 giỏ táo. Giỏ A có 18 quả. Giỏ B có gấp 3 lần giỏ A. Giỏ C có ít hơn giỏ B là 12 quả. Lấy toàn bộ số táo giỏ A và C chia đều cho 6 em nhỏ. Hỏi mỗi em nhận được bao nhiêu quả táo?',
    shortQuestion: 'Mỗi em nhận được bao nhiêu quả táo?',
    correctAnswer: 10,
    unit: 'quả táo',
    options: [10, 8, 12, 9],
    explanation: 'Giỏ B = 18 × 3 = 54 quả. Giỏ C = 54 - 12 = 42 quả. Tổng giỏ A và C = 18 + 42 = 60 quả. Chia đều 6 em = 60 ÷ 6 = 10 quả.',
    hint: 'Giỏ B = 54. Giỏ C = 42. Tổng A + C = 60. Mỗi em = 60 ÷ 6 = 10 quả.'
  },

  // 14. DẠNG NHIỀU ĐIỀU KIỆN / CẤU TẠO SỐ (Bài 14)
  {
    id: 'wp_adv_14',
    grade: 2,
    type: 'digit_structure',
    tag: '14. Dạng Cấu Tạo Số',
    story: 'Một số có hai chữ số. Tổng hai chữ số bằng 9. Chữ số hàng chục lớn hơn chữ số hàng đơn vị 3 đơn vị. Tìm số có hai chữ số đó.',
    shortQuestion: 'Số có hai chữ số cần tìm là số nào?',
    correctAnswer: 63,
    unit: '',
    options: [63, 72, 54, 81],
    explanation: 'Chữ số hàng chục là: (9 + 3) ÷ 2 = 6. Chữ số hàng đơn vị là: 6 - 3 = 3. Vậy số có hai chữ số cần tìm là 63 (6 + 3 = 9 và 6 - 3 = 3).',
    hint: 'Hàng chục = (Tổng + Hiệu) ÷ 2 = (9 + 3) ÷ 2 = 6. Hàng đơn vị = 3.'
  },
  {
    id: 'wp_adv_14_b',
    grade: 2,
    type: 'digit_structure',
    tag: '14. Dạng Cấu Tạo Số',
    story: 'Tìm một số có hai chữ số, biết tổng hai chữ số của nó bằng 8 và chữ số hàng chục gấp 3 lần chữ số hàng đơn vị.',
    shortQuestion: 'Số có hai chữ số cần tìm là số nào?',
    correctAnswer: 62,
    unit: '',
    options: [62, 71, 53, 44],
    explanation: 'Tổng số phần bằng nhau: 3 + 1 = 4 (phần). Chữ số hàng đơn vị là: 8 ÷ 4 = 2. Chữ số hàng chục là: 2 × 3 = 6. Số cần tìm là 62.',
    hint: 'Hàng đơn vị = 8 ÷ (3 + 1) = 2. Hàng chục = 6. Số là 62.'
  },

  // -----------------------------------------------------------------------
  // LỚP 1: BÀI TOÁN CÓ LỜI VĂN ĐƠN GIẢN (PHẠM VI 20)
  // -----------------------------------------------------------------------
  {
    id: 'wp_g1_01',
    grade: 1,
    type: 'more_less',
    story: 'Bạn An có 9 quả bóng bay màu đỏ. Bạn Bình tặng thêm cho An 5 quả bóng bay màu vàng. Hỏi bạn An có tất cả bao nhiêu quả bóng bay?',
    shortQuestion: 'An có tất cả bao nhiêu quả bóng bay?',
    correctAnswer: 14,
    unit: 'quả bóng',
    options: [14, 13, 15, 12],
    explanation: 'Ta thực hiện phép cộng: 9 + 5 = 14 (quả bóng). Đáp số: 14 quả bóng.',
    hint: 'Lấy số bóng ban đầu cộng thêm số bóng được tặng.'
  },
  {
    id: 'wp_g1_02',
    grade: 1,
    type: 'more_less',
    story: 'Trên cành cây có 15 chú chim đang hót líu lo. Sau đó có 6 chú chim bay đi tìm mồi. Hỏi trên cành cây còn lại bao nhiêu chú chim?',
    shortQuestion: 'Trên cành cây còn lại bao nhiêu chú chim?',
    correctAnswer: 9,
    unit: 'chú chim',
    options: [9, 8, 10, 11],
    explanation: 'Ta thực hiện phép trừ: 15 - 6 = 9 (chú chim). Đáp số: 9 chú chim.',
    hint: 'Số chim bay đi thì ta làm phép tính trừ.'
  },
  {
    id: 'wp_g1_03',
    grade: 1,
    type: 'more_less',
    story: 'Lớp 1A có 8 bạn nam và 9 bạn nữ tham gia đồng diễn thể dục. Hỏi lớp 1A có tất cả bao nhiêu bạn tham gia?',
    shortQuestion: 'Có tất cả bao nhiêu bạn tham gia?',
    correctAnswer: 17,
    unit: 'bạn',
    options: [17, 16, 18, 15],
    explanation: 'Ta lấy số bạn nam cộng số bạn nữ: 8 + 9 = 17 (bạn).',
    hint: 'Tính tổng số bạn nam và nữ.'
  },
  {
    id: 'wp_g1_04',
    grade: 1,
    type: 'more_less',
    story: 'Bác nông dân nuôi 18 con thỏ trắng và thỏ xám. Trong đó có 8 con thỏ xám. Hỏi bác có bao nhiêu con thỏ trắng?',
    shortQuestion: 'Bác có bao nhiêu con thỏ trắng?',
    correctAnswer: 10,
    unit: 'con thỏ',
    options: [10, 9, 11, 8],
    explanation: 'Số thỏ trắng là: 18 - 8 = 10 (con thỏ).',
    hint: 'Lấy tổng số thỏ trừ đi số thỏ xám.'
  },
  {
    id: 'wp_g1_05',
    grade: 1,
    type: 'more_less',
    story: 'Mai hái được 7 bông hoa cúc, Lan hái được nhiều hơn Mai 4 bông hoa cúc. Hỏi Lan hái được bao nhiêu bông hoa cúc?',
    shortQuestion: 'Lan hái được bao nhiêu bông hoa cúc?',
    correctAnswer: 11,
    unit: 'bông hoa',
    options: [11, 10, 12, 13],
    explanation: 'Số hoa Lan hái được là: 7 + 4 = 11 (bông hoa).',
    hint: 'Nhiều hơn thì làm phép cộng (+).'
  },

  // -----------------------------------------------------------------------
  // LỚP 2: BÀI TOÁN VỀ NHIỀU HƠN, ÍT HƠN, ĐƠN VỊ ĐO (PHẠM VI 100)
  // -----------------------------------------------------------------------
  {
    id: 'wp_g2_01',
    grade: 2,
    type: 'more_less',
    story: 'Tổ Một gấp được 38 ngôi sao may mắn. Tổ Hai gấp được nhiều hơn Tổ Một 14 ngôi sao. Hỏi Tổ Hai gấp được bao nhiêu ngôi sao?',
    shortQuestion: 'Tổ Hai gấp được bao nhiêu ngôi sao?',
    correctAnswer: 52,
    unit: 'ngôi sao',
    options: [52, 48, 54, 50],
    explanation: 'Số ngôi sao Tổ Hai gấp được là: 38 + 14 = 52 (ngôi sao).',
    hint: 'Nhiều hơn 14 tức là lấy 38 cộng 14.'
  },
  {
    id: 'wp_g2_02',
    grade: 2,
    type: 'more_less',
    story: 'Vườn nhà bà có 65 cây ăn quả, trong đó có 28 cây cam, còn lại là cây bưởi. Hỏi vườn nhà bà có bao nhiêu cây bưởi?',
    shortQuestion: 'Vườn nhà bà có bao nhiêu cây bưởi?',
    correctAnswer: 37,
    unit: 'cây bưởi',
    options: [37, 35, 47, 39],
    explanation: 'Số cây bưởi là: 65 - 28 = 37 (cây bưởi).',
    hint: 'Lấy tổng số cây ăn quả trừ đi số cây cam.'
  },
  {
    id: 'wp_g2_03',
    grade: 2,
    type: 'measurement_story',
    story: 'Một cuộn băng dính dài 85 cm. Chị Lan cắt đi một đoạn dài 38 cm để bọc quà. Hỏi cuộn băng dính còn lại dài bao nhiêu xăng-ti-mét?',
    shortQuestion: 'Cuộn băng dính còn lại bao nhiêu cm?',
    correctAnswer: 47,
    unit: 'cm',
    options: [47, 45, 57, 43],
    explanation: 'Chiều dài còn lại là: 85 - 38 = 47 (cm).',
    hint: 'Cắt bớt đi thì làm phép tính trừ: 85 - 38.'
  },
  {
    id: 'wp_g2_04',
    grade: 2,
    type: 'measurement_story',
    story: 'Can thứ nhất đựng 18 lít mật ong, can thứ hai đựng 25 lít mật ong. Hỏi cả hai can đựng tất cả bao nhiêu lít mật ong?',
    shortQuestion: 'Cả hai can đựng tất cả bao nhiêu lít mật ong?',
    correctAnswer: 43,
    unit: 'lít',
    options: [43, 41, 45, 33],
    explanation: 'Tổng số lít mật ong là: 18 + 25 = 43 (lít).',
    hint: 'Tính tổng số mật ong của cả 2 can.'
  },
  {
    id: 'wp_g2_05',
    grade: 2,
    type: 'more_less',
    story: 'Năm nay anh Nam 15 tuổi, em Hà ít hơn anh Nam 6 tuổi. Hỏi năm nay em Hà bao nhiêu tuổi?',
    shortQuestion: 'Năm nay em Hà bao nhiêu tuổi?',
    correctAnswer: 9,
    unit: 'tuổi',
    options: [9, 8, 10, 11],
    explanation: 'Tuổi của em Hà là: 15 - 6 = 9 (tuổi).',
    hint: 'Ít hơn thì làm phép trừ: 15 - 6.'
  },

  // -----------------------------------------------------------------------
  // LỚP 3: GẤP LÊN SỐ LẦN, RÚT VỀ ĐƠN VỊ, CHU VI HÌNH CHỮ NHẬT
  // -----------------------------------------------------------------------
  {
    id: 'wp_g3_01',
    grade: 3,
    type: 'times_factor',
    story: 'Đội Một trồng được 8 cây bóng mát. Đội Hai trồng được số cây gấp 4 lần Đội Một. Hỏi Đội Hai trồng được bao nhiêu cây?',
    shortQuestion: 'Đội Hai trồng được bao nhiêu cây?',
    correctAnswer: 32,
    unit: 'cây',
    options: [32, 28, 36, 24],
    explanation: 'Số cây Đội Hai trồng được là: 8 × 4 = 32 (cây).',
    hint: 'Gấp 4 lần tức là nhân với 4: 8 × 4.'
  },
  {
    id: 'wp_g3_02',
    grade: 3,
    type: 'times_factor',
    story: 'Trong kho có 48 kg gạo tẻ. Số gạo nếp bằng số gạo tẻ giảm đi 6 lần. Hỏi trong kho có bao nhiêu ki-lô-gam gạo nếp?',
    shortQuestion: 'Trong kho có bao nhiêu kg gạo nếp?',
    correctAnswer: 8,
    unit: 'kg',
    options: [8, 7, 9, 6],
    explanation: 'Số gạo nếp là: 48 ÷ 6 = 8 (kg).',
    hint: 'Giảm đi 6 lần tức là lấy 48 chia cho 6.'
  },
  {
    id: 'wp_g3_03',
    grade: 3,
    type: 'unit_rate',
    story: 'Có 35 bông hoa cúc chia đều cắm vào 5 lọ hoa. Hỏi 3 lọ hoa như thế cắm được bao nhiêu bông hoa cúc?',
    shortQuestion: '3 lọ hoa cắm được bao nhiêu bông hoa?',
    correctAnswer: 21,
    unit: 'bông hoa',
    options: [21, 20, 24, 18],
    explanation: 'Bước 1: Mỗi lọ có: 35 ÷ 5 = 7 (bông). Bước 2: 3 lọ có: 7 × 3 = 21 (bông).',
    hint: 'Bước 1: Tìm 1 lọ có mấy bông. Bước 2: Nhân với 3 lọ.'
  },
  {
    id: 'wp_g3_04',
    grade: 3,
    type: 'geometry_area',
    story: 'Một sân bóng mini hình chữ nhật có chiều dài 25 m, chiều rộng 15 m. Hỏi chu vi của sân bóng mini đó là bao nhiêu mét?',
    shortQuestion: 'Chu vi sân bóng mini là bao nhiêu mét?',
    correctAnswer: 80,
    unit: 'm',
    options: [80, 40, 75, 90],
    explanation: 'Chu vi hình chữ nhật = (Dài + Rộng) × 2 = (25 + 15) × 2 = 40 × 2 = 80 (m).',
    hint: 'Chu vi = (Chiều dài + Chiều rộng) × 2.'
  },
  {
    id: 'wp_g3_05',
    grade: 3,
    type: 'unit_rate',
    story: 'Mua 4 quyển vở cùng loại hết 36 000 đồng. Hỏi nếu mua 6 quyển vở như thế thì phải trả bao nhiêu tiền?',
    shortQuestion: 'Mua 6 quyển vở hết bao nhiêu tiền?',
    correctAnswer: 54000,
    unit: 'đồng',
    options: [54000, 48000, 60000, 52000],
    explanation: 'Giá tiền 1 quyển vở là: 36 000 ÷ 4 = 9 000 (đồng). Mua 6 quyển hết: 9 000 × 6 = 54 000 (đồng).',
    hint: 'Rút về đơn vị: Tính giá tiền 1 quyển vở trước rồi nhân với 6.'
  },

  // -----------------------------------------------------------------------
  // LỚP 4: TỔNG - HIỆU, TỔNG - TỈ, HIỆU - TỈ, DIỆN TÍCH THỰC TẾ
  // -----------------------------------------------------------------------
  {
    id: 'wp_g4_01',
    grade: 4,
    type: 'sum_diff',
    story: 'Tổng số tuổi của hai bố con là 48 tuổi. Bố hơn con 26 tuổi. Hỏi năm nay bố bao nhiêu tuổi?',
    shortQuestion: 'Năm nay bố bao nhiêu tuổi?',
    correctAnswer: 37,
    unit: 'tuổi',
    options: [37, 36, 38, 35],
    explanation: 'Số lớn (tuổi bố) = (Tổng + Hiệu) ÷ 2 = (48 + 26) ÷ 2 = 74 ÷ 2 = 37 (tuổi). Con: 37 - 26 = 11 tuổi.',
    hint: 'Công thức: Số lớn = (Tổng + Hiệu) ÷ 2.'
  },
  {
    id: 'wp_g4_02',
    grade: 4,
    type: 'sum_diff',
    story: 'Hai thùng chứa tất cả 150 lít dầu. Thùng thứ nhất chứa nhiều hơn thùng thứ hai 30 lít dầu. Hỏi thùng thứ hai chứa bao nhiêu lít dầu?',
    shortQuestion: 'Thùng thứ hai chứa bao nhiêu lít dầu?',
    correctAnswer: 60,
    unit: 'lít',
    options: [60, 55, 65, 90],
    explanation: 'Số bé (thùng 2) = (Tổng - Hiệu) ÷ 2 = (150 - 30) ÷ 2 = 120 ÷ 2 = 60 (lít).',
    hint: 'Công thức: Số bé = (Tổng - Hiệu) ÷ 2.'
  },
  {
    id: 'wp_g4_03',
    grade: 4,
    type: 'sum_ratio',
    story: 'Khối 4 có tất cả 160 học sinh, trong đó số học sinh nữ gấp 3 lần số học sinh nam. Hỏi khối 4 có bao nhiêu học sinh nam?',
    shortQuestion: 'Khối 4 có bao nhiêu học sinh nam?',
    correctAnswer: 40,
    unit: 'học sinh',
    options: [40, 35, 45, 120],
    explanation: 'Tổng số phần bằng nhau: 1 + 3 = 4 (phần). Số học sinh nam là: 160 ÷ 4 × 1 = 40 (học sinh).',
    hint: 'Tìm tổng số phần bằng nhau: Nam 1 phần, Nữ 3 phần => 4 phần.'
  },
  {
    id: 'wp_g4_04',
    grade: 4,
    type: 'diff_ratio',
    story: 'Mẹ hơn con 28 tuổi. Tuổi mẹ gấp 5 lần tuổi con. Hỏi năm nay mẹ bao nhiêu tuổi?',
    shortQuestion: 'Năm nay mẹ bao nhiêu tuổi?',
    correctAnswer: 35,
    unit: 'tuổi',
    options: [35, 32, 40, 36],
    explanation: 'Hiệu số phần bằng nhau: 5 - 1 = 4 (phần). Giá trị 1 phần (tuổi con): 28 ÷ 4 = 7 (tuổi). Tuổi mẹ: 7 × 5 = 35 (tuổi).',
    hint: 'Hiệu số phần = 5 - 1 = 4 phần. Tuổi mẹ = (28 ÷ 4) × 5.'
  },
  {
    id: 'wp_g4_05',
    grade: 4,
    type: 'geometry_area',
    story: 'Một mảnh đất hình chữ nhật có chu vi là 120 m. Chiều dài hơn chiều rộng 10 m. Tính diện tích của mảnh đất đó.',
    shortQuestion: 'Diện tích mảnh đất đó là bao nhiêu m²?',
    correctAnswer: 875,
    unit: 'm²',
    options: [875, 850, 900, 800],
    explanation: 'Nửa chu vi = 120 ÷ 2 = 60 m. Chiều dài = (60 + 10) ÷ 2 = 35 m. Chiều rộng = 60 - 35 = 25 m. Diện tích = 35 × 25 = 875 m².',
    hint: 'Bước 1: Nửa chu vi = Dài + Rộng. Bước 2: Tìm Dài và Rộng (Tổng - Hiệu). Bước 3: S = Dài × Rộng.'
  },

  // -----------------------------------------------------------------------
  // LỚP 5: CHUYỂN ĐỘNG ĐỀU, TỈ SỐ PHẦN TRĂM, NĂNG SUẤT, THỰC TẾ
  // -----------------------------------------------------------------------
  {
    id: 'wp_g5_01',
    grade: 5,
    type: 'speed_motion',
    story: 'Một ô tô khởi hành lúc 7 giờ sáng và đi với vận tốc 48 km/giờ. Đến 9 giờ 30 phút thì ô tô tới nơi. Hỏi quãng đường ô tô đã đi dài bao nhiêu ki-lô-mét?',
    shortQuestion: 'Quãng đường ô tô đã đi là bao nhiêu km?',
    correctAnswer: 120,
    unit: 'km',
    options: [120, 115, 125, 96],
    explanation: 'Thời gian đi: 9h30 - 7h = 2,5 giờ. Quãng đường: s = v × t = 48 × 2,5 = 120 (km).',
    hint: 'Quãng đường = Vận tốc × Thời gian (s = v × t).'
  },
  {
    id: 'wp_g5_02',
    grade: 5,
    type: 'speed_motion',
    story: 'Hai thành phố A và B cách nhau 135 km. Một người đi xe máy từ A đến B với vận tốc 45 km/giờ. Hỏi người đó đi hết bao nhiêu giờ?',
    shortQuestion: 'Người đó đi từ A đến B mất bao nhiêu giờ?',
    correctAnswer: 3,
    unit: 'giờ',
    options: [3, 2.5, 3.5, 4],
    explanation: 'Thời gian đi là: t = s ÷ v = 135 ÷ 45 = 3 (giờ).',
    hint: 'Thời gian = Quãng đường ÷ Vận tốc (t = s ÷ v).'
  },
  {
    id: 'wp_g5_03',
    grade: 5,
    type: 'percentage_shopping',
    story: 'Một chiếc áo khoác mùa đông có giá niêm yết là 400 000 đồng. Nhân dịp Tết, cửa hàng giảm giá 15%. Hỏi số tiền được giảm giá là bao nhiêu đồng?',
    shortQuestion: 'Số tiền được giảm giá là bao nhiêu đồng?',
    correctAnswer: 60000,
    unit: 'đồng',
    options: [60000, 50000, 75000, 40000],
    explanation: 'Số tiền được giảm = 400 000 × 15 ÷ 100 = 60 000 (đồng).',
    hint: 'Tính 15% của 400 000 đồng: (400 000 × 15) ÷ 100.'
  },
  {
    id: 'wp_g5_04',
    grade: 5,
    type: 'percentage_shopping',
    story: 'Một trường tiểu học có 800 học sinh, trong đó số học sinh giỏi chiếm 65% toàn trường. Hỏi trường đó có bao nhiêu học sinh giỏi?',
    shortQuestion: 'Trường đó có bao nhiêu học sinh giỏi?',
    correctAnswer: 520,
    unit: 'học sinh',
    options: [520, 500, 540, 480],
    explanation: 'Số học sinh giỏi của trường là: 800 × 65 ÷ 100 = 520 (học sinh).',
    hint: 'Số học sinh giỏi = 800 × 65% = 520 học sinh.'
  },
  {
    id: 'wp_g5_05',
    grade: 5,
    type: 'geometry_area',
    story: 'Một thửa ruộng hình thang có đáy lớn 40 m, đáy bé 20 m và chiều cao 15 m. Tính diện tích của thửa ruộng hình thang đó.',
    shortQuestion: 'Diện tích thửa ruộng hình thang là bao nhiêu m²?',
    correctAnswer: 450,
    unit: 'm²',
    options: [450, 400, 500, 900],
    explanation: 'Diện tích hình thang = (Đáy lớn + Đáy bé) × Chiều cao ÷ 2 = (40 + 20) × 15 ÷ 2 = 60 × 15 ÷ 2 = 450 (m²).',
    hint: 'S hình thang = (a + b) × h ÷ 2.'
  }
];

// =========================================================================
// HÀM TẠO BÀI TOÁN CÓ LỜI VĂN ĐỘNG (VÔ HẠN ĐỀ THEO MẪU ĐA DẠNG & NÂNG CAO)
// =========================================================================

export function generateDynamicWordProblem(grade: GradeLevel): WordProblemItem {
  const names = ['Minh', 'Hoa', 'Nam', 'Lan', 'Bảo', 'Vy', 'Huy', 'Nhi', 'Hùng', 'Trang'];
  const items = ['viên bi', 'quả táo', 'bông hoa', 'ngôi sao giấy', 'quyển sách', 'cái kẹo', 'nhãn vở'];
  
  const name1 = names[Math.floor(Math.random() * names.length)];
  let name2 = names[Math.floor(Math.random() * names.length)];
  while (name2 === name1) {
    name2 = names[Math.floor(Math.random() * names.length)];
  }
  const item = items[Math.floor(Math.random() * items.length)];

  // Pick an advanced archetype randomly
  const r = Math.random();

  if (grade === 1) {
    if (r < 0.35) {
      // Dạng 14: Cấu tạo số lớp 1-2
      const unitD = Math.floor(Math.random() * 4) + 1; // 1..4
      const tensD = unitD + Math.floor(Math.random() * 4) + 1; // tens > unit
      const sumD = tensD + unitD;
      const diffD = tensD - unitD;
      const targetNum = tensD * 10 + unitD;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 1,
        type: 'digit_structure',
        tag: 'Cấu Tạo Số',
        story: `Tìm một số có hai chữ số, biết tổng hai chữ số bằng ${sumD} và chữ số hàng chục hơn chữ số hàng đơn vị ${diffD} đơn vị.`,
        shortQuestion: `Số có hai chữ số đó là số nào?`,
        correctAnswer: targetNum,
        unit: '',
        options: generateOptions(targetNum),
        explanation: `Hàng chục: (${sumD} + ${diffD}) ÷ 2 = ${tensD}. Hàng đơn vị: ${tensD} - ${diffD} = ${unitD}. Số cần tìm là ${targetNum}.`
      };
    } else if (r < 0.65) {
      // Dạng 5: Suy luận ngược
      const finalVal = Math.floor(Math.random() * 10) + 10; // 10..19
      const addVal = Math.floor(Math.random() * 5) + 2;
      const giveVal = Math.floor(Math.random() * 5) + 3;
      const initVal = finalVal - addVal + giveVal;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 1,
        type: 'work_backwards',
        tag: 'Suy Luận Ngược',
        story: `Bạn ${name1} có một số ${item}. ${name1} cho bạn ${name2} ${giveVal} ${item}, sau đó mẹ cho thêm ${addVal} ${item} thì ${name1} có ${finalVal} ${item}. Hỏi lúc đầu ${name1} có bao nhiêu ${item}?`,
        shortQuestion: `Lúc đầu ${name1} có bao nhiêu ${item}?`,
        correctAnswer: initVal,
        unit: item,
        options: generateOptions(initVal),
        explanation: `Tính ngược lại: ${finalVal} - ${addVal} + ${giveVal} = ${initVal} (${item}).`
      };
    } else {
      const a = Math.floor(Math.random() * 8) + 4;
      const b = Math.floor(Math.random() * 7) + 2;
      const ans = a + b;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 1,
        type: 'more_less',
        story: `Bạn ${name1} có ${a} ${item}. Bạn ${name2} cho ${name1} thêm ${b} ${item}. Hỏi ${name1} có tất cả bao nhiêu ${item}?`,
        shortQuestion: `${name1} có tất cả bao nhiêu ${item}?`,
        correctAnswer: ans,
        unit: item,
        options: generateOptions(ans),
        explanation: `Phép tính: ${a} + ${b} = ${ans} (${item}). Đáp số: ${ans} ${item}.`
      };
    }
  } else if (grade === 2) {
    if (r < 0.3) {
      // Dạng 14: Cấu tạo số
      const unitD = Math.floor(Math.random() * 4) + 1;
      const tensD = unitD + Math.floor(Math.random() * 4) + 2;
      const sumD = tensD + unitD;
      const diffD = tensD - unitD;
      const targetNum = tensD * 10 + unitD;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 2,
        type: 'digit_structure',
        tag: 'Cấu Tạo Số',
        story: `Một số có hai chữ số. Tổng hai chữ số bằng ${sumD}. Chữ số hàng chục lớn hơn chữ số hàng đơn vị ${diffD} đơn vị. Tìm số đó.`,
        shortQuestion: `Số có hai chữ số cần tìm là số nào?`,
        correctAnswer: targetNum,
        unit: '',
        options: generateOptions(targetNum),
        explanation: `Chữ số hàng chục: (${sumD} + ${diffD}) ÷ 2 = ${tensD}. Chữ số hàng đơn vị: ${tensD} - ${diffD} = ${unitD}. Số cần tìm là ${targetNum}.`
      };
    } else if (r < 0.6) {
      // Dạng 5: Suy luận ngược
      const finalCount = Math.floor(Math.random() * 20) + 25; // 25..44
      const added = Math.floor(Math.random() * 8) + 5;
      const given = Math.floor(Math.random() * 10) + 8;
      const startCount = finalCount - added + given;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 2,
        type: 'work_backwards',
        tag: 'Suy Luận Ngược',
        story: `Bác nông dân có một sọt ${item}. Bác đem biếu ${given} ${item}, sau đó thu hoạch thêm ${added} ${item} bỏ vào sọt thì có ${finalCount} ${item}. Hỏi lúc đầu trong sọt có bao nhiêu ${item}?`,
        shortQuestion: `Lúc đầu trong sọt có bao nhiêu ${item}?`,
        correctAnswer: startCount,
        unit: item,
        options: generateOptions(startCount),
        explanation: `Tính ngược lại: ${finalCount} - ${added} + ${given} = ${startCount} (${item}).`
      };
    } else {
      const a = Math.floor(Math.random() * 30) + 20;
      const diff = Math.floor(Math.random() * 15) + 5;
      const ans = a + diff;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 2,
        type: 'more_less',
        story: `Bạn ${name1} sưu tầm được ${a} con tem. Bạn ${name2} sưu tầm được nhiều hơn ${name1} ${diff} con tem. Hỏi ${name2} sưu tầm được bao nhiêu con tem?`,
        shortQuestion: `${name2} sưu tầm được bao nhiêu con tem?`,
        correctAnswer: ans,
        unit: 'con tem',
        options: generateOptions(ans),
        explanation: `Số tem của ${name2} là: ${a} + ${diff} = ${ans} (con tem).`
      };
    }
  } else if (grade === 3) {
    if (r < 0.2) {
      // Dạng 12: Ốc sên leo tường
      const wallHeight = [8, 10, 12, 15][Math.floor(Math.random() * 4)];
      const up = wallHeight >= 12 ? 4 : 3;
      const down = up - 1; // Net progress per full day-night = 1m
      // Days needed: (wallHeight - up) / (up - down) + 1 = (wallHeight - up) + 1 = wallHeight - up + 1
      const totalDays = (wallHeight - up) + 1;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 3,
        type: 'snail_climb_logic',
        tag: '12. Ốc Sên Leo Tường',
        story: `Một chú ốc sên muốn bò lên bức tường cao ${wallHeight} m. Ban ngày ốc sên bò lên được ${up} m, ban đêm lúc ngủ lại tụt xuống ${down} m. Hỏi sau bao nhiêu ngày ốc sên lên được đỉnh tường?`,
        shortQuestion: `Sau bao nhiêu ngày ốc sên lên đến đỉnh tường?`,
        correctAnswer: totalDays,
        unit: 'ngày',
        options: generateOptions(totalDays),
        explanation: `Mỗi ngày đêm tiến được ${up} - ${down} = 1 m. Sau ${wallHeight - up} ngày đêm, ốc sên đã lên được ${wallHeight - up} m. Đến ngày thứ ${totalDays}, ban ngày bò thêm ${up} m đạt đúng ${wallHeight} m chạm đỉnh tường!`
      };
    } else if (r < 0.38) {
      // Dạng 2: Nhiều bước (cửa hàng bán vở)
      const totalBooks = Math.floor(Math.random() * 100) + 150; // 150..249
      const morning = Math.floor(Math.random() * 20) + 30; // 30..49
      const afternoon = morning * 2;
      const remain = totalBooks - morning - afternoon;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 3,
        type: 'multi_step',
        tag: '2. Dạng Nhiều Bước',
        story: `Một cửa hàng có ${totalBooks} quyển vở. Buổi sáng bán được ${morning} quyển. Buổi chiều bán gấp đôi buổi sáng. Hỏi cửa hàng còn lại bao nhiêu quyển vở?`,
        shortQuestion: `Cửa hàng còn lại bao nhiêu quyển vở?`,
        correctAnswer: remain,
        unit: 'quyển',
        options: generateOptions(remain),
        explanation: `Buổi chiều bán: ${morning} × 2 = ${afternoon} (quyển). Cả ngày bán: ${morning} + ${afternoon} = ${morning + afternoon} (quyển). Còn lại: ${totalBooks} - ${morning + afternoon} = ${remain} (quyển).`
      };
    } else if (r < 0.55) {
      // Dạng 7: Chia có điều kiện (xếp hàng)
      const perRow = [6, 7, 8, 9][Math.floor(Math.random() * 4)];
      const numRows = Math.floor(Math.random() * 5) + 6;
      const remainder = Math.floor(Math.random() * (perRow - 1)) + 1; // 1..(perRow-1)
      const totalStudents = numRows * perRow + remainder;
      const needMore = perRow - remainder;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 3,
        type: 'conditional_division',
        tag: '7. Chia Có Điều Kiện',
        story: `Có ${totalStudents} học sinh xếp thành các hàng, mỗi hàng ${perRow} học sinh. Hỏi cần thêm ít nhất bao nhiêu học sinh để tất cả các hàng đều đầy đủ ${perRow} bạn?`,
        shortQuestion: `Cần thêm ít nhất bao nhiêu học sinh?`,
        correctAnswer: needMore,
        unit: 'học sinh',
        options: generateOptions(needMore),
        explanation: `Ta có: ${totalStudents} ÷ ${perRow} = ${numRows} (dư ${remainder}). Hàng cuối cùng đã có ${remainder} bạn, nên cần thêm ít nhất: ${perRow} - ${remainder} = ${needMore} (học sinh).`
      };
    } else if (r < 0.75) {
      // Dạng 8: Tiền mua sắm
      const startMoney = [80000, 100000, 120000, 150000][Math.floor(Math.random() * 4)];
      const bookCount = 3;
      const bookPrice = [10000, 12000, 15000][Math.floor(Math.random() * 3)];
      const penBoxPrice = [25000, 30000, 35000][Math.floor(Math.random() * 3)];
      const extraMoney = [15000, 20000, 25000][Math.floor(Math.random() * 3)];
      const spent = bookCount * bookPrice + penBoxPrice;
      const finalMoney = startMoney - spent + extraMoney;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 3,
        type: 'money_shopping',
        tag: '8. Dạng Tiền',
        story: `Bạn ${name1} có ${startMoney.toLocaleString()} đồng. ${name1} mua ${bookCount} quyển vở giá ${bookPrice.toLocaleString()} đồng/quyển và một hộp bút giá ${penBoxPrice.toLocaleString()} đồng. Sau đó được mẹ cho thêm ${extraMoney.toLocaleString()} đồng. Hỏi ${name1} còn lại bao nhiêu tiền?`,
        shortQuestion: `${name1} còn lại bao nhiêu tiền?`,
        correctAnswer: finalMoney,
        unit: 'đồng',
        options: generateOptions(finalMoney),
        explanation: `Tiền mua đồ: ${bookCount} × ${bookPrice.toLocaleString()} + ${penBoxPrice.toLocaleString()} = ${spent.toLocaleString()} (đồng). Số tiền còn lại: ${startMoney.toLocaleString()} - ${spent.toLocaleString()} + ${extraMoney.toLocaleString()} = ${finalMoney.toLocaleString()} (đồng).`
      };
    } else {
      // Dạng 9: Năng suất 3 ngày
      const day1 = Math.floor(Math.random() * 30) + 110; // 110..139
      const moreDay2 = Math.floor(Math.random() * 15) + 20; // 20..34
      const day2 = day1 + moreDay2;
      const lessDay3 = Math.floor(Math.random() * 12) + 15; // 15..26
      const day3 = day2 - lessDay3;
      const totalTrees = day1 + day2 + day3;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 3,
        type: 'productivity_rate',
        tag: '9. Dạng Năng Suất',
        story: `Một đội trồng rừng. Ngày thứ nhất trồng được ${day1} cây. Ngày thứ hai trồng nhiều hơn ngày thứ nhất ${moreDay2} cây. Ngày thứ ba trồng ít hơn ngày thứ hai ${lessDay3} cây. Hỏi cả ba ngày đội đó trồng được bao nhiêu cây?`,
        shortQuestion: `Cả ba ngày đội đó trồng được bao nhiêu cây?`,
        correctAnswer: totalTrees,
        unit: 'cây',
        options: generateOptions(totalTrees),
        explanation: `Ngày 2: ${day1} + ${moreDay2} = ${day2} (cây). Ngày 3: ${day2} - ${lessDay3} = ${day3} (cây). Tổng 3 ngày: ${day1} + ${day2} + ${day3} = ${totalTrees} (cây).`
      };
    }
  } else if (grade === 4) {
    if (r < 0.25) {
      // Dạng 1: Tổng - Hiệu chuyển đổi giữa 2 kho
      const transfer = Math.floor(Math.random() * 8) + 10; // 10..17
      const diff = transfer * 2;
      const small = Math.floor(Math.random() * 20) + 40; // 40..59
      const big = small + diff;
      const sum = small + big;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 4,
        type: 'sum_diff',
        tag: '1. Dạng Tổng - Hiệu',
        story: `Hai kho có tất cả ${sum} kg gạo. Nếu chuyển ${transfer} kg gạo từ kho thứ nhất sang kho thứ hai thì hai kho có số gạo bằng nhau. Hỏi lúc đầu kho thứ nhất có bao nhiêu ki-lô-gam gạo?`,
        shortQuestion: `Lúc đầu kho thứ nhất có bao nhiêu kg gạo?`,
        correctAnswer: big,
        unit: 'kg',
        options: generateOptions(big),
        explanation: `Chuyển ${transfer} kg thì bằng nhau => Kho 1 hơn kho 2 là: ${transfer} × 2 = ${diff} (kg). Kho thứ nhất có: (${sum} + ${diff}) ÷ 2 = ${big} (kg).`
      };
    } else if (r < 0.5) {
      // Dạng 11: Tổng ba số có quy luật
      const part2 = Math.floor(Math.random() * 15) + 25; // 25..39
      const part1 = part2 * 2;
      const extra3 = Math.floor(Math.random() * 10) + 15;
      const part3 = part2 + extra3;
      const totalSum = part1 + part2 + part3;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 4,
        type: 'pattern_three_numbers',
        tag: '11. Dạng Số Quy Luật',
        story: `Tổng của ba số là ${totalSum}. Số thứ nhất gấp đôi số thứ hai. Số thứ ba hơn số thứ hai ${extra3} đơn vị. Tìm số thứ hai.`,
        shortQuestion: `Số thứ hai có giá trị là bao nhiêu?`,
        correctAnswer: part2,
        unit: '',
        options: generateOptions(part2),
        explanation: `Coi số thứ hai là 1 phần, số thứ nhất là 2 phần, số thứ ba là 1 phần + ${extra3}. Tổng 4 phần là: ${totalSum} - ${extra3} = ${totalSum - extra3}. Số thứ hai là: ${totalSum - extra3} ÷ 4 = ${part2}.`
      };
    } else if (r < 0.75) {
      // Dạng 10: Tuổi nâng cao (Hiệu tuổi không đổi)
      const diffAge = (Math.floor(Math.random() * 6) + 12) * 2; // chẵn: 24, 26, 28, 30, 32
      const childNow = Math.floor(Math.random() * 4) + 8; // 8..11
      const dadNow = childNow + diffAge;
      // When dad is 3 times child: childAgeWhen3x = diffAge / (3 - 1) = diffAge / 2
      const childAgeWhen3x = diffAge / 2;
      const yearsNeeded = childAgeWhen3x - childNow;
      if (yearsNeeded > 0) {
        return {
          id: `wp_dyn_${Date.now()}_${Math.random()}`,
          grade: 4,
          type: 'advanced_age',
          tag: '10. Dạng Tuổi Nâng Cao',
          story: `Hiện nay bố ${dadNow} tuổi, con ${childNow} tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi bố gấp 3 lần tuổi con?`,
          shortQuestion: `Sau bao nhiêu năm nữa tuổi bố gấp 3 lần tuổi con?`,
          correctAnswer: yearsNeeded,
          unit: 'năm',
          options: generateOptions(yearsNeeded),
          explanation: `Hiệu số tuổi không đổi: ${dadNow} - ${childNow} = ${diffAge} (tuổi). Khi bố gấp 3 lần con, tuổi con khi đó là: ${diffAge} ÷ (3 - 1) = ${childAgeWhen3x} (tuổi). Số năm cần thêm là: ${childAgeWhen3x} - ${childNow} = ${yearsNeeded} (năm).`
        };
      } else {
        return {
          id: `wp_dyn_${Date.now()}_${Math.random()}`,
          grade: 4,
          type: 'sum_ratio',
          story: `Một thư viện có ${diffAge * 5} quyển sách gồm Văn và Toán. Số sách Toán gấp 4 lần số sách Văn. Hỏi có bao nhiêu quyển sách Văn?`,
          shortQuestion: `Có bao nhiêu quyển sách Văn?`,
          correctAnswer: diffAge,
          unit: 'quyển sách',
          options: generateOptions(diffAge),
          explanation: `Số sách Văn là: (${diffAge * 5}) ÷ (1 + 4) = ${diffAge} (quyển).`
        };
      }
    } else {
      // Dạng 13: Suy luận chia kẹo bánh
      const box1 = 24;
      const box2 = box1 * 2;
      const lessBox3 = 15;
      const box3 = box2 - lessBox3;
      const sum13 = box1 + box3; // 24 + 33 = 57
      const perFriend = sum13 / 3; // 19
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 4,
        type: 'deductive_distribution',
        tag: '13. Dạng Suy Luận',
        story: `Có 3 hộp bánh. Hộp thứ nhất có ${box1} cái. Hộp thứ hai gấp đôi hộp thứ nhất. Hộp thứ ba ít hơn hộp thứ hai ${lessBox3} cái. Lấy tổng số bánh của hộp thứ nhất và thứ ba chia đều cho 3 bạn. Hỏi mỗi bạn nhận được bao nhiêu cái bánh?`,
        shortQuestion: `Mỗi bạn nhận được bao nhiêu cái bánh?`,
        correctAnswer: perFriend,
        unit: 'cái bánh',
        options: generateOptions(perFriend),
        explanation: `Hộp 2 = ${box1} × 2 = ${box2}. Hộp 3 = ${box2} - ${lessBox3} = ${box3}. Tổng hộp 1 và 3 = ${box1} + ${box3} = ${sum13}. Chia 3 bạn: ${sum13} ÷ 3 = ${perFriend} (cái).`
      };
    }
  } else {
    // Grade 5: Speed motion, percentage shopping, complex multi-step
    const isMotion = Math.random() < 0.5;
    if (isMotion) {
      const v = [35, 40, 45, 50, 60][Math.floor(Math.random() * 5)];
      const t = [2, 3, 4, 2.5][Math.floor(Math.random() * 4)];
      const s = v * t;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 5,
        type: 'speed_motion',
        tag: 'Chuyển Động Đều',
        story: `Một chiếc xe máy chạy với vận tốc trung bình ${v} km/giờ trong ${t} giờ. Hỏi quãng đường xe máy đã đi được là bao nhiêu ki-lô-mét?`,
        shortQuestion: `Quãng đường xe máy đi được là bao nhiêu km?`,
        correctAnswer: s,
        unit: 'km',
        options: generateOptions(s),
        explanation: `Quãng đường s = v × t = ${v} × ${t} = ${s} (km).`
      };
    } else {
      const basePrice = [150000, 200000, 250000, 300000, 400000][Math.floor(Math.random() * 5)];
      const percent = [10, 15, 20, 25][Math.floor(Math.random() * 4)];
      const discount = (basePrice * percent) / 100;
      return {
        id: `wp_dyn_${Date.now()}_${Math.random()}`,
        grade: 5,
        type: 'percentage_shopping',
        tag: 'Tỉ Số Phần Trăm',
        story: `Một bộ đồ chơi xếp hình có giá ${basePrice.toLocaleString()} đồng. Cửa hàng khuyến mại giảm giá ${percent}%. Hỏi người mua được giảm giá bao nhiêu đồng?`,
        shortQuestion: `Người mua được giảm bao nhiêu đồng?`,
        correctAnswer: discount,
        unit: 'đồng',
        options: generateOptions(discount),
        explanation: `Số tiền được giảm là: (${basePrice.toLocaleString()} × ${percent}) ÷ 100 = ${discount.toLocaleString()} (đồng).`
      };
    }
  }
}

function generateOptions(correct: number): number[] {
  const set = new Set<number>();
  set.add(correct);
  
  let diffs: number[];
  if (correct >= 1000) {
    diffs = [-20000, -10000, -5000, -2000, 2000, 5000, 10000, 20000, 30000, -30000];
  } else if (correct <= 10) {
    diffs = [-3, -2, -1, 1, 2, 3, 4, 5];
  } else {
    diffs = [-20, -15, -10, -5, -2, -1, 1, 2, 5, 10, 15, 20];
  }

  let attempts = 0;
  while (set.size < 4 && attempts < 50) {
    attempts++;
    const delta = diffs[Math.floor(Math.random() * diffs.length)];
    const candidate = correct + delta;
    if (candidate > 0 && candidate !== correct) {
      set.add(candidate);
    }
  }

  // Fallback if needed
  let offset = 1;
  while (set.size < 4) {
    if (correct + offset > 0 && !set.has(correct + offset)) {
      set.add(correct + offset);
    } else if (correct - offset > 0 && !set.has(correct - offset)) {
      set.add(correct - offset);
    }
    offset++;
  }

  return Array.from(set).sort(() => Math.random() - 0.5);
}

// Get a random word problem suitable for grade (from bank or procedural)
export function getRandomWordProblem(grade: GradeLevel): WordProblemItem {
  const matchingFromBank = WORD_PROBLEMS_BANK.filter(wp => wp.grade === grade || (grade >= 3 && wp.tag));
  if (matchingFromBank.length > 0 && Math.random() < 0.7) {
    return matchingFromBank[Math.floor(Math.random() * matchingFromBank.length)];
  }
  return generateDynamicWordProblem(grade);
}

