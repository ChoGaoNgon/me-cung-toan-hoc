import {
  GradeLevel,
  QuestionCategory,
  MazeDifficulty,
  MathChallengeRule,
  FractionRepresentation
} from '../types';

export interface GeneratedCellContent {
  value: number | string;
  display: string;
  subtitle?: string;
  fraction?: FractionRepresentation;
  isValid: boolean;
}

// Generate Math Challenge Rule
export function generateChallengeRule(
  category: QuestionCategory,
  grade: GradeLevel,
  difficulty: MazeDifficulty = 'medium',
  customTarget?: number
): MathChallengeRule {
  const id = `rule_${category}_${grade}_${Date.now()}`;

  switch (category) {
    case 'comparison': {
      let threshold = 50;
      let compType: 'gt' | 'lt' | 'between' = 'gt';

      if (grade === 1) {
        threshold = [10, 12, 15, 18, 20][Math.floor(Math.random() * 5)];
        compType = Math.random() < 0.6 ? 'gt' : 'lt';
      } else if (grade === 2) {
        threshold = [30, 40, 50, 60, 70, 90][Math.floor(Math.random() * 6)];
        compType = Math.random() < 0.6 ? 'gt' : 'lt';
      } else if (grade === 3) {
        threshold = [50, 75, 100, 150, 200][Math.floor(Math.random() * 5)];
        compType = Math.random() < 0.5 ? 'gt' : Math.random() < 0.8 ? 'lt' : 'between';
      } else {
        // Grade 4-5 (up to 500)
        threshold = [150, 200, 250, 300, 350, 400, 450][Math.floor(Math.random() * 7)];
        compType = Math.random() < 0.4 ? 'gt' : Math.random() < 0.7 ? 'lt' : 'between';
      }

      if (compType === 'gt') {
        return {
          id,
          category,
          grade,
          difficulty,
          title: `So sánh số lớn hơn ${threshold}`,
          prompt: `🔎 Hãy đi qua các ô có số LỚN HƠN ${threshold}`,
          shortHint: `Số > ${threshold}`,
          ruleDescription: `Chỉ bước vào các ô có giá trị lớn hơn ${threshold}`,
          targetValue: threshold
        };
      } else if (compType === 'lt') {
        return {
          id,
          category,
          grade,
          difficulty,
          title: `So sánh số bé hơn ${threshold}`,
          prompt: `🔎 Hãy đi qua các ô có số BÉ HƠN ${threshold}`,
          shortHint: `Số < ${threshold}`,
          ruleDescription: `Chỉ bước vào các ô có giá trị nhỏ hơn ${threshold}`,
          targetValue: threshold
        };
      } else {
        const lower = threshold - 20;
        const upper = threshold + 20;
        return {
          id,
          category,
          grade,
          difficulty,
          title: `Số nằm giữa ${lower} và ${upper}`,
          prompt: `🔎 Hãy đi qua các ô có số TỪ ${lower} ĐẾN ${upper}`,
          shortHint: `${lower} ≤ Số ≤ ${upper}`,
          ruleDescription: `Chỉ bước vào các ô có giá trị trong khoảng [${lower}, ${upper}]`,
          targetValue: lower,
          secondTargetValue: upper
        };
      }
    }

    case 'predecessor_successor': {
      const isPredecessor = Math.random() < 0.5;
      let baseNumber = 20;
      if (grade === 1) {
        baseNumber = Math.floor(Math.random() * 16) + 4; // 4..19
      } else if (grade === 2) {
        baseNumber = Math.floor(Math.random() * 80) + 15; // 15..95
      } else if (grade === 3) {
        baseNumber = Math.floor(Math.random() * 400) + 100; // 100..500
      } else {
        baseNumber = Math.floor(Math.random() * 800) + 200; // 200..1000
      }

      const target = isPredecessor ? baseNumber - 1 : baseNumber + 1;
      const title = isPredecessor ? `Tìm số liền trước của ${baseNumber}` : `Tìm số liền sau của ${baseNumber}`;
      const prompt = isPredecessor 
        ? `🔎 Đi qua các ô là SỐ LIỀN TRƯỚC của ${baseNumber} (Đáp án: ${target})`
        : `🔎 Đi qua các ô là SỐ LIỀN SAU của ${baseNumber} (Đáp án: ${target})`;

      return {
        id,
        category,
        grade,
        difficulty,
        title,
        prompt,
        shortHint: isPredecessor ? `Liền trước ${baseNumber}` : `Liền sau ${baseNumber}`,
        ruleDescription: isPredecessor ? `Số liền trước = ${baseNumber} - 1 = ${target}` : `Số liền sau = ${baseNumber} + 1 = ${target}`,
        targetValue: target,
        secondTargetValue: baseNumber
      };
    }

    case 'measurement': {
      const types = ['length', 'weight', 'time', 'volume'];
      const chosenType = types[Math.floor(Math.random() * types.length)];
      
      let targetVal = 100;
      let title = 'Đổi đơn vị đo độ dài';
      let prompt = '🔎 Đi qua các ô có phép đổi đơn vị đo ĐÚNG CHÍNH XÁC';
      let shortHint = 'Đơn vị đo chuẩn';

      if (chosenType === 'length') {
        targetVal = 100;
        title = 'Quy đổi đơn vị độ dài (m, dm, cm, mm, km)';
        prompt = '🔎 Đi qua các ô có QUY ĐỔI ĐỘ DÀI ĐÚNG (VD: 1m = 100cm)';
        shortHint = 'Đo độ dài';
      } else if (chosenType === 'weight') {
        targetVal = 1000;
        title = 'Quy đổi đơn vị khối lượng (g, kg, tạ, tấn)';
        prompt = '🔎 Đi qua các ô có QUY ĐỔI KHỐI LƯỢNG ĐÚNG (VD: 1kg = 1000g)';
        shortHint = 'Đo khối lượng';
      } else if (chosenType === 'time') {
        targetVal = 60;
        title = 'Quy đổi đơn vị thời gian (giờ, phút, ngày)';
        prompt = '🔎 Đi qua các ô có QUY ĐỔI THỜI GIAN ĐÚNG (VD: 1 giờ = 60 phút)';
        shortHint = 'Đo thời gian';
      } else {
        targetVal = 1000;
        title = 'Quy đổi đơn vị dung tích (lít, mi-li-lít)';
        prompt = '🔎 Đi qua các ô có QUY ĐỔI DUNG TÍCH ĐÚNG (VD: 1 lít = 1000 ml)';
        shortHint = 'Đo dung tích';
      }

      return {
        id,
        category,
        grade,
        difficulty,
        title,
        prompt,
        shortHint,
        ruleDescription: 'Chỉ bước vào các ô có công thức hoặc số đo chính xác',
        targetValue: targetVal
      };
    }

    case 'word_problem': {
      let target = customTarget || (grade === 1 ? 12 : grade === 2 ? 35 : grade === 3 ? 48 : 120);
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Bài toán lời văn kết quả = ${target}`,
        prompt: `🔎 Đi qua các ô là BÀI TOÁN LỜI VĂN có kết quả bằng ${target}`,
        shortHint: `Đáp án = ${target}`,
        ruleDescription: `Chỉ đi qua các ô tình huống toán học có kết quả bằng ${target}`,
        targetValue: target
      };
    }

    case 'addition': {
      if (grade === 1) {
        const target = customTarget || [10, 12, 15, 16, 18, 20][Math.floor(Math.random() * 6)];
        return {
          id,
          category,
          grade,
          difficulty,
          title: `Rừng Phép Cộng: Tìm phép tính = ${target}`,
          prompt: `🔎 Hãy tính nhẩm và đi qua các ô phép tính có KẾT QUẢ BẰNG ${target}`,
          shortHint: `Tính ra ${target}`,
          ruleDescription: `Tự tính nhẩm và chỉ bước vào các ô phép tính có kết quả đúng bằng ${target}`,
          targetValue: target
        };
      } else if (grade <= 3) {
        const target = customTarget || [30, 40, 50, 60, 80, 100, 120, 150, 200, 300][Math.floor(Math.random() * 10)];
        return {
          id,
          category,
          grade,
          difficulty,
          title: `Rừng Phép Cộng: Tìm phép tính = ${target}`,
          prompt: `🔎 Hãy tính nhẩm và đi qua các ô phép tính có KẾT QUẢ BẰNG ${target}`,
          shortHint: `Tính ra ${target}`,
          ruleDescription: `Tự tính nhẩm và chỉ bước vào các ô phép tính có kết quả đúng bằng ${target}`,
          targetValue: target
        };
      } else {
        // Grade 4-5 (up to 1000)
        const target = customTarget || [200, 300, 400, 500, 600, 700, 800, 1000][Math.floor(Math.random() * 8)];
        return {
          id,
          category,
          grade,
          difficulty,
          title: `Rừng Phép Cộng: Tìm phép tính = ${target}`,
          prompt: `🔎 Hãy tính nhẩm và đi qua các ô phép tính có KẾT QUẢ BẰNG ${target}`,
          shortHint: `Tính ra ${target}`,
          ruleDescription: `Tự tính nhẩm và chỉ bước vào các ô phép tính có kết quả đúng bằng ${target}`,
          targetValue: target
        };
      }
    }

    case 'subtraction': {
      let target = customTarget;
      if (!target) {
        if (grade === 1) {
          target = [5, 6, 8, 10, 12, 15][Math.floor(Math.random() * 6)];
        } else if (grade <= 3) {
          target = [15, 20, 25, 35, 40, 50, 75][Math.floor(Math.random() * 7)];
        } else {
          // Grade 4-5
          target = [80, 120, 150, 220, 300, 350, 400][Math.floor(Math.random() * 7)];
        }
      }
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Phép trừ có kết quả bằng ${target}`,
        prompt: `🔎 Đi qua các ô có kết quả phép tính BẰNG ${target}`,
        shortHint: `Hiệu = ${target}`,
        ruleDescription: `Chỉ đi qua ô có hiệu bằng ${target}`,
        targetValue: target
      };
    }

    case 'multiplication': {
      const base = customTarget || (grade <= 2 ? [2, 3, 4, 5][Math.floor(Math.random() * 4)] : [3, 4, 6, 7, 8, 9, 12, 15][Math.floor(Math.random() * 8)]);
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Bảng nhân ${base}`,
        prompt: `🔎 Đi qua các ô là kết quả của BẢNG NHÂN ${base}`,
        shortHint: `Bội số của ${base}`,
        ruleDescription: `Chỉ đi qua các số thuộc bảng nhân ${base} (chia hết cho ${base})`,
        targetValue: base
      };
    }

    case 'division': {
      const divisor = customTarget || (grade <= 3 ? [2, 3, 4, 5, 6][Math.floor(Math.random() * 5)] : [3, 4, 6, 7, 8, 9, 12, 15, 20][Math.floor(Math.random() * 9)]);
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Số chia hết cho ${divisor}`,
        prompt: `🔎 Đi qua các số CHIA HẾT CHO ${divisor}`,
        shortHint: `Chia hết cho ${divisor}`,
        ruleDescription: `Chỉ đi qua các số chia hết cho ${divisor} (không dư)`,
        targetValue: divisor
      };
    }

    case 'find_x': {
      let xVal = customTarget;
      if (!xVal) {
        if (grade === 1) {
          xVal = [4, 5, 6, 7, 8, 9, 10][Math.floor(Math.random() * 7)];
        } else if (grade <= 3) {
          xVal = [12, 15, 17, 20, 24, 30, 45][Math.floor(Math.random() * 7)];
        } else {
          // Grade 4-5
          xVal = [50, 75, 80, 100, 120, 150, 200, 250][Math.floor(Math.random() * 8)];
        }
      }
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Tìm giá trị của X = ${xVal}`,
        prompt: `🔎 Đi qua các ô có đáp án của X = ${xVal}`,
        shortHint: `X = ${xVal}`,
        ruleDescription: `Chỉ đi qua các ô là biểu thức hoặc phương trình có nghiệm x = ${xVal}`,
        targetValue: xVal
      };
    }

    case 'even_odd': {
      const isEven = Math.random() < 0.5;
      return {
        id,
        category,
        grade,
        difficulty,
        title: isEven ? 'Chỉ đi qua số Chẵn' : 'Chỉ đi qua số Lẻ',
        prompt: isEven ? '🔎 Chỉ đi qua các ô có SỐ CHẴN (đuôi 0, 2, 4, 6, 8)' : '🔎 Chỉ đi qua các ô có SỐ LẺ (đuôi 1, 3, 5, 7, 9)',
        shortHint: isEven ? 'Số Chẵn' : 'Số Lẻ',
        ruleDescription: isEven ? 'Chỉ bước vào các số chẵn' : 'Chỉ bước vào các số lẻ',
        targetValue: isEven ? 0 : 1 // 0 for even, 1 for odd (mod 2)
      };
    }

    case 'fraction': {
      const fractions = [
        { num: 1, den: 2, label: '1/2 (Một nửa)' },
        { num: 1, den: 4, label: '1/4 (Một phần tư)' },
        { num: 3, den: 4, label: '3/4 (Ba phần tư)' },
        { num: 1, den: 3, label: '1/3 (Một phần ba)' },
        { num: 2, den: 3, label: '2/3 (Hai phần ba)' }
      ];
      const target = fractions[Math.floor(Math.random() * fractions.length)];
      return {
        id,
        category,
        grade,
        difficulty,
        title: `Phân số ${target.num}/${target.den}`,
        prompt: `🔎 Đi qua các ô biểu diễn PHÂN SỐ ${target.num}/${target.den}`,
        shortHint: `${target.num}/${target.den}`,
        ruleDescription: `Chỉ đi qua các ô có giá trị tương đương phân số ${target.num}/${target.den}`,
        targetFraction: { num: target.num, den: target.den }
      };
    }
  }
}

// Generate a valid cell item that satisfies the challenge rule
export function generateValidItem(rule: MathChallengeRule): GeneratedCellContent {
  const { category, targetValue, secondTargetValue, targetFraction, grade } = rule;

  switch (category) {
    case 'comparison': {
      if (rule.prompt.includes('LỚN HƠN')) {
        const threshold = targetValue || 50;
        const offset = Math.floor(Math.random() * (grade === 1 ? 15 : 40)) + 1;
        const val = threshold + offset;
        return { value: val, display: `${val}`, isValid: true };
      } else if (rule.prompt.includes('BÉ HƠN')) {
        const threshold = targetValue || 50;
        const offset = Math.floor(Math.random() * Math.min(threshold - 1, grade === 1 ? 10 : 35)) + 1;
        const val = Math.max(1, threshold - offset);
        return { value: val, display: `${val}`, isValid: true };
      } else {
        // Between
        const low = targetValue || 30;
        const high = secondTargetValue || 70;
        const val = Math.floor(Math.random() * (high - low + 1)) + low;
        return { value: val, display: `${val}`, isValid: true };
      }
    }

    case 'predecessor_successor': {
      const target = targetValue || 50;
      return {
        value: target,
        display: `${target}`,
        isValid: true
      };
    }

    case 'measurement': {
      // Return accurate conversion pairs
      const validConversions = [
        { d: '1 m = 100 cm', s: '100cm' },
        { d: '1 km = 1000 m', s: '1000m' },
        { d: '1 dm = 10 cm', s: '10cm' },
        { d: '1 kg = 1000 g', s: '1000g' },
        { d: '1 giờ = 60 phút', s: '60p' },
        { d: '1 phút = 60 giây', s: '60s' },
        { d: '1 ngày = 24 giờ', s: '24h' },
        { d: '1 lít = 1000 ml', s: '1000ml' },
        { d: '2 m = 200 cm', s: '200cm' },
        { d: '3 kg = 3000 g', s: '3000g' },
        { d: '2 giờ = 120 phút', s: '120p' },
        { d: '5 dm = 50 cm', s: '50cm' }
      ];
      const item = validConversions[Math.floor(Math.random() * validConversions.length)];
      return {
        value: item.s,
        display: item.d,
        subtitle: '✓ Chuẩn',
        isValid: true
      };
    }

    case 'word_problem': {
      const target = targetValue || 36;
      // Provide situational mini word problem that equals target
      const templates = [
        { d: `Mua 3 bút x ${Math.floor(target / 3)}k`, sub: `= ${target}` },
        { d: `Có ${target - 8} quả + 8 quả`, sub: `= ${target}` },
        { d: `Có ${target + 12} viên - 12 viên`, sub: `= ${target}` },
        { d: `Gấp ${target / 2} lên 2 lần`, sub: `= ${target}` },
        { d: `Chu vi HV cạnh ${Math.floor(target / 4)}m`, sub: `= ${target}m` }
      ];
      const chosen = templates[Math.floor(Math.random() * templates.length)];
      return {
        value: target,
        display: chosen.d,
        subtitle: chosen.sub,
        isValid: true
      };
    }

    case 'addition': {
      const target = targetValue || 42;
      let a = 1;
      let b = target - 1;

      if (target >= 100) {
        // Generate nice multiples of 10 or 50
        const step = target >= 200 ? 50 : 10;
        const maxSteps = Math.floor(target / step) - 1;
        const chosenStep = Math.max(1, Math.floor(Math.random() * maxSteps) + 1);
        a = chosenStep * step;
        b = target - a;
      } else if (target >= 20) {
        const step = 5;
        const maxSteps = Math.floor(target / step) - 1;
        if (Math.random() < 0.7 && maxSteps > 1) {
          a = (Math.floor(Math.random() * maxSteps) + 1) * step;
        } else {
          a = Math.floor(Math.random() * (target - 6)) + 3;
        }
        b = target - a;
      } else {
        a = Math.floor(Math.random() * (target - 2)) + 1;
        b = target - a;
      }

      return {
        value: `${a}+${b}`,
        display: `${a} + ${b} = ?`,
        isValid: true
      };
    }

    case 'subtraction': {
      const target = targetValue || 35;
      let b = 10;
      if (target >= 100) {
        const step = target >= 200 ? 50 : 10;
        b = (Math.floor(Math.random() * 4) + 1) * step;
      } else if (target >= 20) {
        b = (Math.floor(Math.random() * 4) + 1) * 5;
      } else {
        b = Math.floor(Math.random() * 8) + 2;
      }
      const a = target + b;

      return {
        value: `${a}-${b}`,
        display: `${a} - ${b} = ?`,
        isValid: true
      };
    }

    case 'multiplication': {
      const base = targetValue || 6;
      const k = Math.floor(Math.random() * 9) + 1;
      return {
        value: `${base}x${k}`,
        display: `${base} × ${k} = ?`,
        isValid: true
      };
    }

    case 'division': {
      const divisor = targetValue || 4;
      const k = Math.floor(Math.random() * 10) + 1;
      const num = divisor * k;
      return {
        value: `${num}/${divisor}`,
        display: `${num} ÷ ${divisor} = ?`,
        isValid: true
      };
    }

    case 'find_x': {
      const x = targetValue || 17;
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const add = Math.floor(Math.random() * 20) + 5;
        return {
          value: x,
          display: `x + ${add} = ${x + add}`,
          subtitle: `x = ${x}`,
          isValid: true
        };
      } else if (type === 1) {
        const sub = Math.floor(Math.random() * 15) + 3;
        return {
          value: x,
          display: `${x + sub} - x = ${sub}`,
          subtitle: `x = ${x}`,
          isValid: true
        };
      } else {
        return { value: x, display: `${x}`, subtitle: `x`, isValid: true };
      }
    }

    case 'even_odd': {
      const isEvenRequired = targetValue === 0;
      let val = Math.floor(Math.random() * 90) + 10;
      if (isEvenRequired) {
        if (val % 2 !== 0) val += 1;
      } else {
        if (val % 2 === 0) val += 1;
      }
      return { value: val, display: `${val}`, isValid: true };
    }

    case 'fraction': {
      const target = targetFraction || { num: 1, den: 2 };
      const mult = Math.floor(Math.random() * 3) + 1;
      const num = target.num * mult;
      const den = target.den * mult;
      const isPie = Math.random() < 0.6;

      return {
        value: `${num}/${den}`,
        display: `${num}/${den}`,
        fraction: {
          numerator: num,
          denominator: den,
          visualType: isPie ? 'pie' : 'bar'
        },
        isValid: true
      };
    }
  }
}

// Generate an invalid (distractor) item that does NOT satisfy the rule
export function generateInvalidItem(rule: MathChallengeRule): GeneratedCellContent {
  const { category, targetValue, secondTargetValue, targetFraction, grade } = rule;

  switch (category) {
    case 'comparison': {
      if (rule.prompt.includes('LỚN HƠN')) {
        const threshold = targetValue || 50;
        const offset = Math.floor(Math.random() * Math.min(threshold - 1, 30)) + 1;
        const val = Math.max(1, threshold - offset);
        return { value: val, display: `${val}`, isValid: false };
      } else if (rule.prompt.includes('BÉ HƠN')) {
        const threshold = targetValue || 50;
        const offset = Math.floor(Math.random() * (grade === 1 ? 15 : 40)) + 1;
        const val = threshold + offset;
        return { value: val, display: `${val}`, isValid: false };
      } else {
        const low = targetValue || 30;
        const high = secondTargetValue || 70;
        const isBelow = Math.random() < 0.5;
        const val = isBelow ? Math.max(1, low - Math.floor(Math.random() * 15) - 1) : high + Math.floor(Math.random() * 20) + 1;
        return { value: val, display: `${val}`, isValid: false };
      }
    }

    case 'predecessor_successor': {
      const target = targetValue || 50;
      const wrongOffset = (Math.random() < 0.5 ? 2 : -2) + (Math.random() < 0.5 ? 1 : -1);
      const wrong = target + (wrongOffset === 0 ? 3 : wrongOffset);
      return {
        value: wrong,
        display: `${wrong}`,
        subtitle: '✗ Sai',
        isValid: false
      };
    }

    case 'measurement': {
      // Distractor incorrect conversion pairs
      const invalidConversions = [
        { d: '1 m = 10 cm', s: '10cm' },
        { d: '1 km = 100 m', s: '100m' },
        { d: '1 dm = 100 cm', s: '100cm' },
        { d: '1 kg = 100 g', s: '100g' },
        { d: '1 giờ = 100 phút', s: '100p' },
        { d: '1 phút = 100 giây', s: '100s' },
        { d: '1 ngày = 12 giờ', s: '12h' },
        { d: '1 lít = 100 ml', s: '100ml' },
        { d: '2 m = 20 cm', s: '20cm' },
        { d: '3 kg = 300 g', s: '300g' }
      ];
      const item = invalidConversions[Math.floor(Math.random() * invalidConversions.length)];
      return {
        value: item.s,
        display: item.d,
        subtitle: '✗ Sai',
        isValid: false
      };
    }

    case 'word_problem': {
      const target = targetValue || 36;
      const wrongTarget = target + (Math.random() < 0.5 ? 5 : -5);
      return {
        value: wrongTarget,
        display: `Có ${wrongTarget - 4} quả + 4 quả`,
        subtitle: `= ${wrongTarget}`,
        isValid: false
      };
    }

    case 'addition': {
      const target = targetValue || 42;
      let offset = 1;
      if (target >= 100) {
        const step = target >= 200 ? 50 : 10;
        offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * step;
      } else if (target >= 20) {
        offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * 5;
      } else {
        offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1);
      }
      if (offset === 0) offset = 5;
      const wrongTarget = Math.max(2, target + offset);

      let a = Math.floor(Math.random() * (wrongTarget - 1)) + 1;
      let b = wrongTarget - a;
      if (target >= 100) {
        const step = 10;
        a = (Math.floor(Math.random() * Math.floor(wrongTarget / step)) + 1) * step;
        b = wrongTarget - a;
      }

      return {
        value: `${a}+${b}`,
        display: `${a} + ${b} = ?`,
        isValid: false
      };
    }

    case 'subtraction': {
      const target = targetValue || 35;
      let offset = (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 3) + 1) * (target >= 50 ? 10 : 2);
      if (offset === 0) offset = 5;
      const wrongTarget = Math.max(1, target + offset);
      const b = (Math.floor(Math.random() * 4) + 1) * (target >= 50 ? 10 : 2);
      const a = wrongTarget + b;

      return {
        value: `${a}-${b}`,
        display: `${a} - ${b} = ?`,
        isValid: false
      };
    }

    case 'multiplication': {
      const base = targetValue || 6;
      let wrongFactor = Math.floor(Math.random() * 9) + 1;
      let otherFactor = base + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      if (otherFactor <= 1) otherFactor = base + 2;

      return {
        value: `${otherFactor}x${wrongFactor}`,
        display: `${otherFactor} × ${wrongFactor} = ?`,
        isValid: false
      };
    }

    case 'division': {
      const divisor = targetValue || 4;
      let wrongNum = divisor * (Math.floor(Math.random() * 8) + 1) + (Math.floor(Math.random() * (divisor - 1)) + 1);
      if (wrongNum % divisor === 0) wrongNum += 1;

      return {
        value: `${wrongNum}/${divisor}`,
        display: `${wrongNum} ÷ ${divisor} = ?`,
        isValid: false
      };
    }

    case 'find_x': {
      const x = targetValue || 17;
      const wrongX = x + (Math.random() < 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
      if (Math.random() < 0.6) {
        const add = Math.floor(Math.random() * 15) + 3;
        return {
          value: wrongX,
          display: `x + ${add} = ${wrongX + add}`,
          isValid: false
        };
      } else {
        return { value: wrongX, display: `${wrongX}`, isValid: false };
      }
    }

    case 'even_odd': {
      const isEvenRequired = targetValue === 0;
      let val = Math.floor(Math.random() * 90) + 10;
      if (isEvenRequired) {
        if (val % 2 === 0) val += 1;
      } else {
        if (val % 2 !== 0) val += 1;
      }
      return { value: val, display: `${val}`, isValid: false };
    }

    case 'fraction': {
      const target = targetFraction || { num: 1, den: 2 };
      const distractorFractions = [
        { num: 1, den: 3 },
        { num: 1, den: 4 },
        { num: 3, den: 4 },
        { num: 2, den: 5 },
        { num: 3, den: 5 },
        { num: 1, den: 6 }
      ].filter(f => Math.abs(f.num / f.den - target.num / target.den) > 0.05);

      const chosen = distractorFractions[Math.floor(Math.random() * distractorFractions.length)] || { num: 2, den: 7 };
      const isPie = Math.random() < 0.6;

      return {
        value: `${chosen.num}/${chosen.den}`,
        display: `${chosen.num}/${chosen.den}`,
        fraction: {
          numerator: chosen.num,
          denominator: chosen.den,
          visualType: isPie ? 'pie' : 'bar'
        },
        isValid: false
      };
    }
  }
}
