import { TeacherLessonScript } from '../types';

export const DEFAULT_TEACHER_SCRIPTS: TeacherLessonScript[] = [
  {
    id: 'script_olympiad_grade4',
    title: 'Thử Thách 7 Ải: Toán Olympic & Lời Văn Nâng Cao',
    description: 'Bộ kịch bản 7 câu hỏi tư duy logic, tổng - hiệu, hiệu tỉ, bài toán tuổi và ốc sên leo tường.',
    author: 'Cô Thu Hà - Giáo viên Toán Tiểu Học',
    grade: 4,
    createdAt: '2025-09-18',
    questions: [
      {
        id: 'q1',
        tag: '1. Dạng Tổng - Hiệu',
        story: 'Hai kho có tất cả 156 kg gạo. Nếu chuyển 18 kg gạo từ kho thứ nhất sang kho thứ hai thì hai kho có số gạo bằng nhau. Hỏi lúc đầu kho thứ nhất có bao nhiêu kg gạo?',
        shortQuestion: 'Lúc đầu kho 1 có bao nhiêu kg gạo?',
        correctAnswer: 96,
        unit: 'kg',
        options: [96, 60, 84, 102],
        explanation: 'Chuyển 18 kg sang kho 2 thì bằng nhau => Kho 1 hơn kho 2 là: 18 × 2 = 36 (kg). Lúc đầu kho 1 có: (156 + 36) ÷ 2 = 96 (kg).',
        hint: 'Khi chuyển gạo giữa 2 kho, tổng không đổi. Tìm hiệu số gạo lúc đầu (18 x 2).'
      },
      {
        id: 'q2',
        tag: '2. Dạng Nhiều Bước',
        story: 'Một cửa hàng có 245 quyển vở. Buổi sáng bán được 68 quyển. Buổi chiều bán số vở gấp đôi buổi sáng. Hỏi cửa hàng còn lại bao nhiêu quyển vở?',
        shortQuestion: 'Cửa hàng còn lại bao nhiêu quyển vở?',
        correctAnswer: 41,
        unit: 'quyển',
        options: [41, 45, 53, 39],
        explanation: 'Buổi chiều bán: 68 × 2 = 136 (quyển). Cả ngày bán: 68 + 136 = 204 (quyển). Còn lại: 245 - 204 = 41 (quyển).',
        hint: 'Bước 1: Tính số vở bán buổi chiều. Bước 2: Trừ cả sáng và chiều.'
      },
      {
        id: 'q3',
        tag: '3. Tìm Số & Chia Có Dư',
        story: 'Một số khi chia cho 6 thì được thương là 35 và số dư là 4. Nếu lấy số đó cộng với 17 rồi chia cho 7 thì được thương bao nhiêu?',
        shortQuestion: 'Thương của phép chia mới là bao nhiêu?',
        correctAnswer: 33,
        unit: '',
        options: [33, 34, 32, 35],
        explanation: 'Số cần tìm: 35 × 6 + 4 = 214. Cộng thêm 17: 214 + 17 = 231. Chia cho 7: 231 ÷ 7 = 33 (dư 0).',
        hint: 'Số bị chia = Thương × Số chia + Số dư.'
      },
      {
        id: 'q4',
        tag: '4. Dạng Tuổi',
        story: 'Năm nay mẹ 36 tuổi, tuổi con bằng 1/4 tuổi mẹ. Hỏi sau 4 năm nữa, tổng số tuổi của hai mẹ con là bao nhiêu tuổi?',
        shortQuestion: 'Sau 4 năm nữa tổng số tuổi là bao nhiêu?',
        correctAnswer: 53,
        unit: 'tuổi',
        options: [53, 49, 55, 51],
        explanation: 'Tuổi con hiện nay: 36 ÷ 4 = 9 (tuổi). Sau 4 năm: Mẹ 40 tuổi, con 13 tuổi. Tổng: 40 + 13 = 53 (tuổi).',
        hint: 'Sau 4 năm cả mẹ và con đều tăng thêm 4 tuổi (tổng tăng 8 tuổi).'
      },
      {
        id: 'q5',
        tag: '5. Suy Luận Ngược',
        story: 'An có một số viên bi. An cho Bình 12 viên bi, sau đó mẹ cho thêm 8 viên bi nữa thì An có tất cả 35 viên bi. Hỏi lúc đầu An có bao nhiêu viên bi?',
        shortQuestion: 'Lúc đầu An có bao nhiêu viên bi?',
        correctAnswer: 39,
        unit: 'viên bi',
        options: [39, 31, 42, 35],
        explanation: 'Làm ngược từ cuối: Trước khi mẹ cho thêm, An có: 35 - 8 = 27 (viên). Trước khi cho Bình, An có: 27 + 12 = 39 (viên).',
        hint: 'Lấy số bi cuối cùng bớt đi 8 rồi cộng lại 12 viên.'
      },
      {
        id: 'q6',
        tag: '12. Ốc Sên Leo Tường',
        story: 'Một con ốc sên leo lên một bức tường cao 10 mét. Ban ngày nó bò lên được 3 mét, ban đêm khi ngủ nó lại bị tụt xuống 2 mét. Hỏi sau bao nhiêu ngày ốc sên sẽ lên tới đỉnh bức tường?',
        shortQuestion: 'Sau bao nhiêu ngày ốc sên lên tới đỉnh?',
        correctAnswer: 8,
        unit: 'ngày',
        options: [8, 10, 7, 9],
        explanation: 'Mỗi ngày đêm tiến được: 3 - 2 = 1 (m). Sau 7 ngày đêm tiến được: 1 × 7 = 7 (m). Sang ngày thứ 8: ban ngày bò lên 3m là tới đỉnh (7 + 3 = 10m) và không bị tụt nữa.',
        hint: 'Chú ý: Khi đã chạm đỉnh vào ban ngày thì không bị tụt lại vào ban đêm!'
      },
      {
        id: 'q7',
        tag: '14. Cấu Tạo Số',
        story: 'Tìm một số tự nhiên có hai chữ số, biết tổng hai chữ số của nó bằng 9 và chữ số hàng chục lớn hơn chữ số hàng đơn vị là 3 đơn vị.',
        shortQuestion: 'Số tự nhiên có hai chữ số đó là gì?',
        correctAnswer: 63,
        unit: '',
        options: [63, 54, 72, 36],
        explanation: 'Đưa về bài toán Tổng - Hiệu: Chữ số hàng chục là: (9 + 3) ÷ 2 = 6. Chữ số hàng đơn vị là: 6 - 3 = 3. Vậy số đó là 63.',
        hint: 'Tổng = 9, Hiệu = 3. Áp dụng công thức Tổng - Hiệu tìm 2 chữ số.'
      }
    ]
  },
  {
    id: 'script_multiplication_grade3',
    title: 'Bài Dạy: Bảng Nhân Chia & Rút Về Đơn Vị (Lớp 3)',
    description: 'Kịch bản luyện tập tính nhẩm bảng cửu chương và bài toán có lời văn rút về đơn vị trong đời sống.',
    author: 'Thầy Minh Tuấn',
    grade: 3,
    createdAt: '2025-09-18',
    questions: [
      {
        id: 'qm1',
        tag: 'Bảng Nhân Chia',
        story: 'Mỗi bàn học có 2 học sinh ngồi. Hỏi 8 bàn học như thế có tất cả bao nhiêu học sinh ngồi?',
        shortQuestion: 'Có tất cả bao nhiêu học sinh?',
        correctAnswer: 16,
        unit: 'học sinh',
        options: [16, 14, 18, 12],
        explanation: 'Số học sinh ở 8 bàn là: 2 × 8 = 16 (học sinh).',
        hint: 'Lấy số học sinh 1 bàn nhân với 8 bàn.'
      },
      {
        id: 'qm2',
        tag: 'Rút Về Đơn Vị',
        story: 'Có 35 bông hoa cúc chia đều cắm vào 5 lọ hoa. Hỏi 3 lọ hoa như thế cắm được bao nhiêu bông hoa cúc?',
        shortQuestion: '3 lọ hoa cắm được bao nhiêu bông hoa?',
        correctAnswer: 21,
        unit: 'bông hoa',
        options: [21, 20, 24, 18],
        explanation: 'Mỗi lọ hoa cắm được: 35 ÷ 5 = 7 (bông). 3 lọ hoa cắm được: 7 × 3 = 21 (bông).',
        hint: 'Bước 1: Tìm 1 lọ có mấy bông. Bước 2: Nhân với 3.'
      },
      {
        id: 'qm3',
        tag: 'Gấp Lên Số Lần',
        story: 'Một trang trại có 24 con gà. Số con vịt gấp 3 lần số con gà. Hỏi trang trại có bao nhiêu con vịt?',
        shortQuestion: 'Trang trại có bao nhiêu con vịt?',
        correctAnswer: 72,
        unit: 'con vịt',
        options: [72, 68, 76, 80],
        explanation: 'Số con vịt là: 24 × 3 = 72 (con vịt).',
        hint: 'Gấp 3 lần tức là lấy 24 nhân 3.'
      },
      {
        id: 'qm4',
        tag: 'Chu Vi Hình Học',
        story: 'Một mảnh vườn hình chữ nhật có chiều dài 25 m, chiều rộng 15 m. Hỏi chu vi mảnh vườn đó bằng bao nhiêu mét?',
        shortQuestion: 'Chu vi mảnh vườn là bao nhiêu mét?',
        correctAnswer: 80,
        unit: 'm',
        options: [80, 75, 40, 90],
        explanation: 'Chu vi = (Chiều dài + Chiều rộng) × 2 = (25 + 15) × 2 = 40 × 2 = 80 (m).',
        hint: 'Chu vi hình chữ nhật = (Dài + Rộng) × 2.'
      },
      {
        id: 'qm5',
        tag: 'Chia Có Dư',
        story: 'Cô giáo có 46 quyển vở thưởng đều cho 5 bạn học sinh giỏi. Hỏi mỗi bạn được mấy quyển và cô giáo còn thừa mấy quyển?',
        shortQuestion: 'Mỗi bạn được bao nhiêu quyển vở?',
        correctAnswer: 9,
        unit: 'quyển',
        options: [9, 8, 10, 7],
        explanation: 'Thực hiện phép chia: 46 ÷ 5 = 9 (dư 1). Vậy mỗi bạn được 9 quyển vở.',
        hint: 'Lấy 46 chia cho 5.'
      }
    ]
  },
  {
    id: 'script_fast_math_grade2',
    title: 'Khởi Động Lớp 2: Phép Cộng Trừ Có Nhớ & Tiền Việt Nam',
    description: 'Giáo án 5 câu hỏi nhanh củng cố kĩ năng tính nhẩm trong phạm vi 100 và phân biệt tiền tệ.',
    author: 'Cô Mai Lan',
    grade: 2,
    createdAt: '2025-09-18',
    questions: [
      {
        id: 'qg1',
        tag: 'Phép Cộng Có Nhớ',
        story: 'Bác nông dân nuôi 38 con gà trắng và 27 con gà nâu. Hỏi bác có tất cả bao nhiêu con gà?',
        shortQuestion: 'Có tất cả bao nhiêu con gà?',
        correctAnswer: 65,
        unit: 'con gà',
        options: [65, 55, 63, 67],
        explanation: 'Tổng số gà là: 38 + 27 = 65 (con gà).',
        hint: 'Đặt tính: 38 + 27 = 65.'
      },
      {
        id: 'qg2',
        tag: 'Nhiều Hơn / Ít Hơn',
        story: 'Đoạn dây màu xanh dài 85 cm. Đoạn dây màu đỏ ngắn hơn đoạn dây màu xanh 28 cm. Hỏi đoạn dây màu đỏ dài bao nhiêu cm?',
        shortQuestion: 'Đoạn dây đỏ dài bao nhiêu cm?',
        correctAnswer: 57,
        unit: 'cm',
        options: [57, 67, 53, 63],
        explanation: 'Đoạn dây màu đỏ dài: 85 - 28 = 57 (cm).',
        hint: 'Ngắn hơn thì lấy chiều dài dây xanh trừ đi 28.'
      },
      {
        id: 'qg3',
        tag: 'Tiền Việt Nam',
        story: 'Nam có tờ tiền 50.000 đồng. Nam mua một cây kem hết 18.000 đồng. Hỏi cô bán hàng phải trả lại Nam bao nhiêu tiền?',
        shortQuestion: 'Nam nhận lại bao nhiêu tiền thừa?',
        correctAnswer: 32000,
        unit: 'đồng',
        options: [32000, 38000, 28000, 35000],
        explanation: 'Số tiền thừa là: 50.000 - 18.000 = 32.000 (đồng).',
        hint: 'Lấy 50.000 trừ đi 18.000.'
      },
      {
        id: 'qg4',
        tag: 'Đo Lường - Lít',
        story: 'Can thứ nhất chứa 18 lít dầu, can thứ hai chứa 25 lít dầu. Hỏi cả hai can chứa bao nhiêu lít dầu?',
        shortQuestion: 'Cả hai can chứa bao nhiêu lít dầu?',
        correctAnswer: 43,
        unit: 'lít',
        options: [43, 33, 45, 41],
        explanation: 'Tổng số lít dầu: 18 + 25 = 43 (lít).',
        hint: 'Cộng số lít của hai can lại với nhau.'
      }
    ]
  }
];
