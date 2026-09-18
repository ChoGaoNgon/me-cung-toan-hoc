import {
  GradeLevel,
  QuestionCategory,
  MazeDifficulty,
  MathChallengeRule,
  TileMazeData,
  GridTileCell
} from '../types';
import { generateChallengeRule, generateValidItem, generateInvalidItem } from './questionEngine';

interface Point {
  x: number;
  y: number;
}

export function generateTileMaze(
  category: QuestionCategory = 'comparison',
  grade: GradeLevel = 1,
  difficulty: MazeDifficulty = 'medium',
  customTarget?: number
): TileMazeData {
  // Dimensions based on difficulty
  let width = 4;
  let height = 4;

  if (difficulty === 'easy') {
    width = 4;
    height = 4;
  } else if (difficulty === 'medium') {
    width = 5;
    height = 5;
  } else {
    width = 6;
    height = 6;
  }

  const startX = 0;
  const startY = 0;
  const goalX = width - 1;
  const goalY = height - 1;

  const challenge = generateChallengeRule(category, grade, difficulty, customTarget);

  // Generate a random self-avoiding path from (0,0) to (goalX, goalY)
  let solutionPath: Point[] = [];
  let attempts = 0;

  while (solutionPath.length === 0 && attempts < 100) {
    attempts++;
    const path: Point[] = [{ x: startX, y: startY }];
    const visited = new Set<string>([`${startX},${startY}`]);

    let curr = { x: startX, y: startY };
    let pathFound = false;

    for (let step = 0; step < width * height; step++) {
      if (curr.x === goalX && curr.y === goalY) {
        pathFound = true;
        break;
      }

      const neighbors: Point[] = [
        { x: curr.x + 1, y: curr.y }, // Right (prioritized towards goal)
        { x: curr.x, y: curr.y + 1 }, // Down (prioritized towards goal)
        { x: curr.x - 1, y: curr.y }, // Left
        { x: curr.x, y: curr.y - 1 }  // Up
      ].filter(
        p =>
          p.x >= 0 &&
          p.x < width &&
          p.y >= 0 &&
          p.y < height &&
          !visited.has(`${p.x},${p.y}`)
      );

      if (neighbors.length === 0) break;

      // Weight towards moving closer to goal
      neighbors.sort((a, b) => {
        const distA = Math.hypot(goalX - a.x, goalY - a.y);
        const distB = Math.hypot(goalX - b.x, goalY - b.y);
        return (distA - distB) + (Math.random() - 0.5) * 1.5;
      });

      const next = neighbors[0];
      visited.add(`${next.x},${next.y}`);
      path.push(next);
      curr = next;
    }

    if (pathFound && path.length >= width + height - 2) {
      solutionPath = path;
    }
  }

  // Fallback manhattan path if random walk fails
  if (solutionPath.length === 0) {
    solutionPath = [];
    let cx = startX;
    let cy = startY;
    solutionPath.push({ x: cx, y: cy });
    while (cx < goalX) {
      cx++;
      solutionPath.push({ x: cx, y: cy });
    }
    while (cy < goalY) {
      cy++;
      solutionPath.push({ x: cx, y: cy });
    }
  }

  // Create a map of path cells
  const pathSet = new Set<string>(solutionPath.map(p => `${p.x},${p.y}`));

  // Add 1 or 2 small decoy valid branches (braiding for game challenge)
  const validBranchSet = new Set<string>();
  for (let i = 1; i < solutionPath.length - 1; i++) {
    if (Math.random() < 0.3) {
      const p = solutionPath[i];
      const adjacents = [
        { x: p.x + 1, y: p.y },
        { x: p.x - 1, y: p.y },
        { x: p.x, y: p.y + 1 },
        { x: p.x, y: p.y - 1 }
      ].filter(
        c =>
          c.x >= 0 &&
          c.x < width &&
          c.y >= 0 &&
          c.y < height &&
          !pathSet.has(`${c.x},${c.y}`) &&
          !validBranchSet.has(`${c.x},${c.y}`)
      );
      if (adjacents.length > 0) {
        validBranchSet.add(`${adjacents[0].x},${adjacents[0].y}`);
      }
    }
  }

  // Build grid
  const grid: GridTileCell[][] = [];

  for (let y = 0; y < height; y++) {
    const row: GridTileCell[] = [];
    for (let x = 0; x < width; x++) {
      const isStart = x === startX && y === startY;
      const isGoal = x === goalX && y === goalY;
      const isOnMainPath = pathSet.has(`${x},${y}`);
      const isOnBranch = validBranchSet.has(`${x},${y}`);
      const isValid = isOnMainPath || isOnBranch;

      let cellContent;
      if (isStart) {
        cellContent = {
          value: 'START',
          display: '🚩',
          isValid: true
        };
      } else if (isGoal) {
        cellContent = {
          value: 'GOAL',
          display: '💎',
          isValid: true
        };
      } else if (isValid) {
        cellContent = generateValidItem(challenge);
      } else {
        cellContent = generateInvalidItem(challenge);
      }

      // Add bonus collectible to dead-end or branch
      const hasBonusCoin = isOnBranch && Math.random() < 0.7;
      const hasBonusGem = !isStart && !isGoal && isOnMainPath && Math.random() < 0.15;

      row.push({
        x,
        y,
        value: cellContent.value,
        display: cellContent.display,
        subtitle: cellContent.subtitle,
        fraction: cellContent.fraction,
        isValid: isStart || isGoal || cellContent.isValid,
        isStart,
        isGoal,
        bonusCoin: hasBonusCoin,
        bonusGem: hasBonusGem
      });
    }
    grid.push(row);
  }

  const solutionCoords: [number, number][] = solutionPath.map(p => [p.x, p.y]);

  return {
    id: `maze_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    width,
    height,
    grid,
    startX,
    startY,
    goalX,
    goalY,
    challenge,
    solutionPath: solutionCoords,
    totalValidSteps: solutionPath.length - 1
  };
}
