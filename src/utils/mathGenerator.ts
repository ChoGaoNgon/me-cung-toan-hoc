import { MathOperator, GradeLevel, MathQuestion, QuestionCategory } from '../types';
import { getRandomWordProblem } from '../data/wordProblemsBank';

export interface MathConfig {
  grade?: GradeLevel;
  operator?: MathOperator;
  category?: QuestionCategory;
  maxNumber?: number;
  allowNegative?: boolean;
}

export function generateMathQuestion(
  grade: GradeLevel = 1,
  forcedOperator?: MathOperator,
  maxCustomNumber?: number,
  category?: QuestionCategory
): MathQuestion {
  const id = `q_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

  // If category is Word Problem
  if (category === 'word_problem') {
    const wp = getRandomWordProblem(grade);
    return {
      id,
      expression: wp.shortQuestion,
      correctAnswer: wp.correctAnswer,
      options: wp.options,
      explanation: wp.explanation,
      category: 'word_problem',
      wordProblemText: wp.story,
      unit: wp.unit
    };
  }

  // If category is Predecessor / Successor
  if (category === 'predecessor_successor') {
    const isPredecessor = Math.random() < 0.5;
    const base = grade === 1 
      ? Math.floor(Math.random() * 18) + 2
      : grade === 2
      ? Math.floor(Math.random() * 85) + 15
      : Math.floor(Math.random() * 400) + 100;
    
    const ans = isPredecessor ? base - 1 : base + 1;
    const exp = isPredecessor 
      ? `Số liền trước của ${base} là:` 
      : `Số liền sau của ${base} là:`;
    
    const opts = [ans, ans + 2, ans - 2, ans + 10].filter(x => x > 0 && x !== base);
    const uniqueOpts = Array.from(new Set([ans, ...opts])).slice(0, 3).sort(() => Math.random() - 0.5);

    return {
      id,
      expression: exp,
      correctAnswer: ans,
      options: uniqueOpts,
      explanation: isPredecessor ? `Số liền trước của ${base} là ${base} - 1 = ${ans}` : `Số liền sau của ${base} là ${base} + 1 = ${ans}`,
      category: 'predecessor_successor'
    };
  }

  // If category is Measurement
  if (category === 'measurement') {
    const conversions = [
      { q: '1 m = ? cm', ans: 100, unit: 'cm', opts: [100, 10, 1000] },
      { q: '1 km = ? m', ans: 1000, unit: 'm', opts: [1000, 100, 10000] },
      { q: '1 kg = ? g', ans: 1000, unit: 'g', opts: [1000, 100, 500] },
      { q: '1 giờ = ? phút', ans: 60, unit: 'phút', opts: [60, 100, 24] },
      { q: '1 ngày = ? giờ', ans: 24, unit: 'giờ', opts: [24, 12, 60] },
      { q: '1 dm = ? cm', ans: 10, unit: 'cm', opts: [10, 100, 1] },
      { q: '1 lít = ? ml', ans: 1000, unit: 'ml', opts: [1000, 100, 500] },
      { q: '2 m = ? cm', ans: 200, unit: 'cm', opts: [200, 20, 2000] },
      { q: '3 kg = ? g', ans: 3000, unit: 'g', opts: [3000, 300, 30] },
      { q: '2 giờ = ? phút', ans: 120, unit: 'phút', opts: [120, 200, 60] }
    ];
    const item = conversions[Math.floor(Math.random() * conversions.length)];
    return {
      id,
      expression: item.q,
      correctAnswer: item.ans,
      options: item.opts.sort(() => Math.random() - 0.5),
      explanation: `Quy đổi chuẩn: ${item.q.replace('?', item.ans.toString())}`,
      category: 'measurement',
      unit: item.unit
    };
  }

  // Standard Arithmetic Operations
  let operator: MathOperator = forcedOperator || '+';
  if (!forcedOperator) {
    if (grade === 1) {
      operator = Math.random() < 0.6 ? '+' : '-';
    } else if (grade === 2) {
      const r = Math.random();
      if (r < 0.45) operator = '+';
      else if (r < 0.8) operator = '-';
      else operator = '×';
    } else if (grade === 3) {
      const r = Math.random();
      if (r < 0.25) operator = '+';
      else if (r < 0.5) operator = '-';
      else if (r < 0.75) operator = '×';
      else operator = '÷';
    } else {
      const ops: MathOperator[] = ['+', '-', '×', '÷'];
      operator = ops[Math.floor(Math.random() * ops.length)];
    }
  }

  let num1 = 1;
  let num2 = 1;
  let correctAnswer = 0;
  let explanation = '';

  const limit = maxCustomNumber || (grade === 1 ? 20 : grade === 2 ? 100 : grade === 3 ? 200 : 500);

  if (operator === '+') {
    if (limit <= 20) {
      num1 = Math.floor(Math.random() * (limit - 4)) + 2;
      num2 = Math.floor(Math.random() * (limit - num1)) + 1;
      if (num2 <= 0) num2 = 1;
    } else if (limit <= 100) {
      const minN = Math.floor(limit * 0.1) + 2;
      const maxN = Math.floor(limit * 0.6);
      num1 = Math.floor(Math.random() * (maxN - minN)) + minN;
      num2 = Math.floor(Math.random() * (limit - num1 - 2)) + 2;
    } else {
      const minN = Math.floor(limit * 0.15) + 10;
      const maxN = Math.floor(limit * 0.55);
      num1 = Math.floor(Math.random() * (maxN - minN)) + minN;
      const remaining = limit - num1;
      num2 = Math.floor(Math.random() * (remaining - 10)) + 10;
    }
    correctAnswer = num1 + num2;
    explanation = `${num1} cộng ${num2} bằng ${correctAnswer}`;
  } else if (operator === '-') {
    if (limit <= 20) {
      correctAnswer = Math.floor(Math.random() * (limit - 3)) + 1;
      num2 = Math.floor(Math.random() * (limit - correctAnswer)) + 1;
      num1 = correctAnswer + num2;
    } else if (limit <= 100) {
      num1 = Math.floor(Math.random() * (limit - 15)) + 15;
      num2 = Math.floor(Math.random() * (num1 - 5)) + 3;
      correctAnswer = num1 - num2;
    } else {
      num1 = Math.floor(Math.random() * (limit - 50)) + 50;
      num2 = Math.floor(Math.random() * (num1 - 20)) + 10;
      correctAnswer = num1 - num2;
    }
    explanation = `${num1} trừ ${num2} bằng ${correctAnswer}`;
  } else if (operator === '×') {
    if (limit <= 20) {
      const multipliers = [2, 3, 4, 5];
      num1 = multipliers[Math.floor(Math.random() * multipliers.length)];
      num2 = Math.floor(Math.random() * Math.floor(20 / num1)) + 1;
    } else if (limit <= 100) {
      num1 = Math.floor(Math.random() * 8) + 2;
      num2 = Math.floor(Math.random() * 8) + 2;
    } else {
      const options = [
        { min1: 12, max1: 35, min2: 3, max2: 12 },
        { min1: 20, max1: 50, min2: 2, max2: 9 },
        { min1: 15, max1: 25, min2: 10, max2: 20 }
      ];
      const opt = options[Math.floor(Math.random() * options.length)];
      num1 = Math.floor(Math.random() * (opt.max1 - opt.min1)) + opt.min1;
      num2 = Math.floor(Math.random() * (opt.max2 - opt.min2)) + opt.min2;
    }
    correctAnswer = num1 * num2;
    explanation = `${num1} nhân ${num2} bằng ${correctAnswer}`;
  } else if (operator === '÷') {
    if (limit <= 20) {
      const divisor = Math.floor(Math.random() * 4) + 2;
      const quotient = Math.floor(Math.random() * Math.floor(20 / divisor)) + 1;
      num1 = divisor * quotient;
      num2 = divisor;
      correctAnswer = quotient;
    } else if (limit <= 100) {
      const divisor = Math.floor(Math.random() * 8) + 2;
      const quotient = Math.floor(Math.random() * 8) + 2;
      num1 = divisor * quotient;
      num2 = divisor;
      correctAnswer = quotient;
    } else {
      const divisors = [3, 4, 5, 6, 7, 8, 9, 12, 15, 20, 25];
      num2 = divisors[Math.floor(Math.random() * divisors.length)];
      const maxQuotient = Math.min(60, Math.floor(limit / num2));
      const quotient = Math.floor(Math.random() * (maxQuotient - 5)) + 5;
      num1 = num2 * quotient;
      correctAnswer = quotient;
    }
    explanation = `${num1} chia ${num2} bằng ${correctAnswer}`;
  }

  // Generate options
  const optionsSet = new Set<number>();
  optionsSet.add(correctAnswer);

  const potentialOffsets = limit > 100 
    ? [-20, -10, -5, -2, -1, 1, 2, 5, 10, 20, 50, -50]
    : [-5, -3, -2, -1, 1, 2, 3, 5, 10, -10];
  let tries = 0;
  while (optionsSet.size < 3 && tries < 30) {
    tries++;
    const offset = potentialOffsets[Math.floor(Math.random() * potentialOffsets.length)];
    const candidate = correctAnswer + offset;
    if (candidate >= 0 && candidate !== correctAnswer) {
      optionsSet.add(candidate);
    }
  }

  while (optionsSet.size < 3) {
    const candidate = correctAnswer + optionsSet.size + 1;
    optionsSet.add(candidate);
  }

  const options = Array.from(optionsSet).sort(() => Math.random() - 0.5);
  const expression = `${num1} ${operator} ${num2} = ?`;

  return {
    id,
    num1,
    num2,
    operator,
    expression,
    correctAnswer,
    options,
    explanation
  };
}
