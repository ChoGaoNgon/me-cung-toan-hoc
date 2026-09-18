import { MazeData, MazeGate, GateChoice, CollectibleItem, GradeLevel, MathOperator } from '../types';
import { generateMathQuestion } from './mathGenerator';

interface Point {
  x: number;
  y: number;
}

export function generateMaze(
  width: number = 13, // must be odd
  height: number = 13, // must be odd
  grade: GradeLevel = 1,
  forcedOperator?: MathOperator,
  levelIndex: number = 1,
  title?: string,
  subtitle?: string,
  maxNumber?: number
): MazeData {
  // Ensure odd dimensions
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;

  // 1 = wall, 0 = path
  const grid: number[][] = Array(h).fill(0).map(() => Array(w).fill(1));

  // Recursive backtracker
  const stack: Point[] = [];
  const startX = 1;
  const startY = h - 2; // bottom-left
  grid[startY][startX] = 0;
  stack.push({ x: startX, y: startY });

  const directions = [
    { dx: 0, dy: -2 }, // Up
    { dx: 2, dy: 0 },  // Right
    { dx: 0, dy: 2 },  // Down
    { dx: -2, dy: 0 }  // Left
  ];

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors: { x: number; y: number; wallX: number; wallY: number }[] = [];

    // Shuffle directions
    const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

    for (const dir of shuffledDirs) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;

      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === 1) {
        neighbors.push({
          x: nx,
          y: ny,
          wallX: current.x + dir.dx / 2,
          wallY: current.y + dir.dy / 2
        });
      }
    }

    if (neighbors.length > 0) {
      const next = neighbors[0];
      grid[next.wallY][next.wallX] = 0;
      grid[next.y][next.x] = 0;
      stack.push({ x: next.x, y: next.y });
    } else {
      stack.pop();
    }
  }

  // Create subtle loops (braiding) so there are multiple paths / fork branches like a real game
  const loopCandidates: Point[] = [];
  for (let y = 2; y < h - 2; y += 2) {
    for (let x = 2; x < w - 2; x += 2) {
      if (grid[y][x] === 1) {
        // Check if removing this wall connects two open paths
        const horiz = grid[y][x - 1] === 0 && grid[y][x + 1] === 0;
        const vert = grid[y - 1][x] === 0 && grid[y + 1][x] === 0;
        if (horiz || vert) {
          loopCandidates.push({ x, y });
        }
      }
    }
  }

  // Open up 15-20% of loop candidates
  const loopsToOpen = Math.min(loopCandidates.length, Math.floor((w * h) / 40));
  loopCandidates.sort(() => Math.random() - 0.5).slice(0, loopsToOpen).forEach(p => {
    grid[p.y][p.x] = 0;
  });

  const finishX = w - 2;
  const finishY = 1; // top-right
  grid[finishY][finishX] = 0;

  // Compute solution path from Start to Finish using BFS
  const queue: { x: number; y: number; path: [number, number][] }[] = [
    { x: startX, y: startY, path: [[startX, startY]] }
  ];
  const visited = new Set<string>();
  visited.add(`${startX},${startY}`);

  let solutionPath: [number, number][] = [];

  while (queue.length > 0) {
    const { x, y, path } = queue.shift()!;

    if (x === finishX && y === finishY) {
      solutionPath = path;
      break;
    }

    const nextDirs = [
      { dx: 0, dy: -1 },
      { dx: 1, dy: 0 },
      { dx: 0, dy: 1 },
      { dx: -1, dy: 0 }
    ];

    for (const d of nextDirs) {
      const nx = x + d.dx;
      const ny = y + d.dy;
      const key = `${nx},${ny}`;

      if (nx >= 0 && nx < w && ny >= 0 && ny < h && grid[ny][nx] === 0 && !visited.has(key)) {
        visited.add(key);
        queue.push({ x: nx, y: ny, path: [...path, [nx, ny]] });
      }
    }
  }

  // If BFS didn't reach finish, fallback straight
  if (solutionPath.length === 0) {
    solutionPath = [[startX, startY], [finishX, finishY]];
  }

  // Embed Math Gates along the solution path
  const numGates = Math.max(3, Math.min(7, Math.floor(solutionPath.length / 5)));
  const gates: MazeGate[] = [];
  const gateIndices: number[] = [];

  // Space gates somewhat evenly along path
  const step = Math.floor(solutionPath.length / (numGates + 1));
  for (let i = 1; i <= numGates; i++) {
    const idx = i * step;
    if (idx > 0 && idx < solutionPath.length - 1) {
      gateIndices.push(idx);
    }
  }

  gateIndices.forEach((pathIdx, gateNum) => {
    const [gx, gy] = solutionPath[pathIdx];
    const question = generateMathQuestion(grade, forcedOperator, maxNumber);
    
    // Find adjacent path cells to make 3 door choices
    const adjCandidates = [
      { dx: 0, dy: -1, label: 'Bắc' },
      { dx: 1, dy: 0, label: 'Đông' },
      { dx: 0, dy: 1, label: 'Nam' },
      { dx: -1, dy: 0, label: 'Tây' }
    ];

    const nextOnPath = solutionPath[pathIdx + 1];
    const choices: GateChoice[] = [];

    // Correct choice leads along solution path
    choices.push({
      answer: question.correctAnswer,
      isCorrect: true,
      targetX: nextOnPath ? nextOnPath[0] : gx,
      targetY: nextOnPath ? nextOnPath[1] : gy,
      directionLabel: 'Cửa Đúng'
    });

    // Wrong choices
    const wrongOptions = question.options.filter(o => o !== question.correctAnswer);
    wrongOptions.forEach((opt) => {
      choices.push({
        answer: opt,
        isCorrect: false,
        targetX: gx,
        targetY: gy,
        directionLabel: 'Cửa Khóa'
      });
    });

    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);

    gates.push({
      id: `gate_${gateNum}_${gx}_${gy}`,
      x: gx,
      y: gy,
      question,
      passed: false,
      choices
    });
  });

  // Spawn Collectibles in dead ends & side cells
  const collectibles: CollectibleItem[] = [];
  let colId = 0;

  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      if (grid[y][x] === 0) {
        // Don't spawn on start or finish
        if ((x === startX && y === startY) || (x === finishX && y === finishY)) continue;

        // Count open neighbors
        let openNeighbors = 0;
        if (grid[y - 1][x] === 0) openNeighbors++;
        if (grid[y + 1][x] === 0) openNeighbors++;
        if (grid[y][x - 1] === 0) openNeighbors++;
        if (grid[y][x + 1] === 0) openNeighbors++;

        const isGatePos = gates.some(g => g.x === x && g.y === y);
        if (isGatePos) continue;

        // If dead end or rare lucky spot
        if (openNeighbors === 1 || Math.random() < 0.08) {
          const rand = Math.random();
          let type: 'coin' | 'gem' | 'star' | 'potion' = 'coin';
          let val = 10;
          if (rand > 0.88) {
            type = 'gem';
            val = 5;
          } else if (rand > 0.7) {
            type = 'star';
            val = 1;
          }

          collectibles.push({
            id: `col_${colId++}`,
            x,
            y,
            type,
            value: val,
            collected: false
          });
        }
      }
    }
  }

  const defaultTitle = title || `Mê Cung Số Học ${levelIndex}`;
  const defaultSubtitle = subtitle || (grade === 1 ? 'Phép Tính Cộng Trừ Trong Phạm Vi 20' : grade === 2 ? 'Phép Tính Trong Phạm Vi 100' : 'Bảng Nhân Chia Nhanh');

  return {
    width: w,
    height: h,
    grid,
    startX,
    startY,
    finishX,
    finishY,
    gates,
    collectibles,
    solutionPath,
    title: defaultTitle,
    subtitle: defaultSubtitle,
    grade,
    operationType: forcedOperator || '+'
  };
}
