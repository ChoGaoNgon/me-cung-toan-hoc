import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { TeacherLessonScript } from '../types';
import { soundManager } from '../utils/audio';
import { AvatarDisplay } from './AvatarDisplay';
import { PrintableWorksheetModal } from './PrintableWorksheetModal';
import confetti from 'canvas-confetti';
import { baoBatDauVan, baoKetThucVan, CauTraLoi, dangNhungTrongPortal } from '../censtu/sdk';
import {
  Printer,
  RotateCcw,
  Trophy,
  ArrowUp,
  Pause,
  Bot,
  Shuffle,
  Sparkles,
  Footprints,
  Compass,
  MapPin,
  Gauge,
  X,
  ChevronDown,
  GraduationCap
} from 'lucide-react';

export interface WorksheetGate {
  id: number;
  question: string;
  storyText?: string;
  correctAnswer: number;
  options: number[];
  x: number;
  y: number;
  standX: number;
  standY: number;
  solved: boolean;
}

export interface Point {
  x: number;
  y: number;
}

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  rotation: number;
}

export interface MazeMapTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  startPoint: Point;
  finishPoint: Point;
  finishLabelPos: { x: number; y: number };
  startLabelPos: { x: number; y: number };
  viewBox: string;
  svgWalls: React.ReactNode;
  guidePath: string;
  corridorLegs: Point[][];
  initialGates: { id: number; x: number; y: number; standX: number; standY: number }[];
}

// Convert 400x480 pixel coords to percentage for CSS placement
const toPercentX = (px: number) => (px / 400) * 100;
const toPercentY = (py: number) => (py / 480) * 100;

/* =========================================================================
   4 100% UNBLOCKABLE, PURE WHITE MAZE MAPS (ĐƯỜNG THÔNG THOÁNG TRẮNG TINH)
   ========================================================================= */

export const MAZE_MAPS: MazeMapTemplate[] = [
  // -----------------------------------------------------------------------
  // MAP 1: Mê Cung Rồng Uốn Lượn (5 Tầng Hành Lang Uốn Chữ S)
  // -----------------------------------------------------------------------
  {
    id: 'serpentine',
    name: 'Rồng Uốn Lượn (5 Tầng)',
    description: '5 tầng hành lang uốn lượn trắng tinh từ đáy lên đỉnh',
    icon: '🐉',
    startPoint: { x: 50, y: 465 },
    finishPoint: { x: 350, y: 25 },
    startLabelPos: { x: 50, y: 472 },
    finishLabelPos: { x: 350, y: 12 },
    viewBox: '0 0 400 480',
    guidePath: '50,470 50,430 350,430 350,345 50,345 50,260 350,260 350,175 50,175 50,90 350,90 350,15',
    svgWalls: (
      <>
        {/* Background pure white fill */}
        <rect x="0" y="0" width="400" height="480" fill="#ffffff" />

        {/* Outer Perimeter Walls with Open Doors (No blocking lines at Start & Finish) */}
        {/* Top wall: gap at x=315..385 */}
        <path d="M 10 10 H 315 M 385 10 H 390 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom wall: gap at x=15..85 */}
        <path d="M 390 470 H 85 M 15 470 H 10 V 10" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* 4 Clean Dividing Walls (Leaving generous 80px open turns at each end) */}
        {/* Divider 1 (between Row 1 & 2): opens at right */}
        <path d="M 10 388 H 310" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Divider 2 (between Row 2 & 3): opens at left */}
        <path d="M 90 303 H 390" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Divider 3 (between Row 3 & 4): opens at right */}
        <path d="M 10 218 H 310" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Divider 4 (between Row 4 & 5): opens at left */}
        <path d="M 90 133 H 390" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
      </>
    ),
    corridorLegs: [
      // Leg 0: Start -> Gate 1
      [{ x: 50, y: 465 }, { x: 50, y: 430 }, { x: 85, y: 430 }],
      // Leg 1: Gate 1 -> Gate 2
      [{ x: 85, y: 430 }, { x: 130, y: 430 }, { x: 175, y: 430 }, { x: 215, y: 430 }],
      // Leg 2: Gate 2 -> Gate 3 (right turn up & left)
      [{ x: 215, y: 430 }, { x: 260, y: 430 }, { x: 350, y: 430 }, { x: 350, y: 345 }, { x: 305, y: 345 }],
      // Leg 3: Gate 3 -> Gate 4
      [{ x: 305, y: 345 }, { x: 260, y: 345 }, { x: 215, y: 345 }, { x: 175, y: 345 }],
      // Leg 4: Gate 4 -> Gate 5 (left turn up & right)
      [{ x: 175, y: 345 }, { x: 130, y: 345 }, { x: 50, y: 345 }, { x: 50, y: 260 }, { x: 85, y: 260 }],
      // Leg 5: Gate 5 -> Gate 6
      [{ x: 85, y: 260 }, { x: 130, y: 260 }, { x: 175, y: 260 }, { x: 215, y: 260 }],
      // Leg 6: Gate 6 -> Gate 7 (right turn up & left)
      [{ x: 215, y: 260 }, { x: 260, y: 260 }, { x: 350, y: 260 }, { x: 350, y: 175 }, { x: 305, y: 175 }],
      // Leg 7: Gate 7 -> Gate 8
      [{ x: 305, y: 175 }, { x: 260, y: 175 }, { x: 215, y: 175 }, { x: 175, y: 175 }],
      // Leg 8: Gate 8 -> Gate 9 (left turn up & right)
      [{ x: 175, y: 175 }, { x: 130, y: 175 }, { x: 50, y: 175 }, { x: 50, y: 90 }, { x: 140, y: 90 }],
      // Leg 9: Gate 9 -> FINISH 🏆
      [{ x: 140, y: 90 }, { x: 200, y: 90 }, { x: 280, y: 90 }, { x: 350, y: 90 }, { x: 350, y: 25 }]
    ],
    initialGates: [
      { id: 1, x: 130, y: 430, standX: 85, standY: 430 },
      { id: 2, x: 260, y: 430, standX: 215, standY: 430 },
      { id: 3, x: 260, y: 345, standX: 305, standY: 345 },
      { id: 4, x: 130, y: 345, standX: 175, standY: 345 },
      { id: 5, x: 130, y: 260, standX: 85, standY: 260 },
      { id: 6, x: 260, y: 260, standX: 215, standY: 260 },
      { id: 7, x: 260, y: 175, standX: 305, standY: 175 },
      { id: 8, x: 130, y: 175, standX: 175, standY: 175 },
      { id: 9, x: 200, y: 90, standX: 140, standY: 90 }
    ]
  },

  // -----------------------------------------------------------------------
  // MAP 2: Mê Cung Ziczac Hẻm Núi (Lên Xuống Hoàn Toàn Thông Thoáng)
  // -----------------------------------------------------------------------
  {
    id: 'zigzag_vertical',
    name: 'Ziczac Hẻm Núi (Lên Xuống)',
    description: 'Hành lang đứng dốc LÊN - XUỐNG uốn lượn không vật cản',
    icon: '⚡',
    startPoint: { x: 35, y: 465 },
    finishPoint: { x: 365, y: 25 },
    startLabelPos: { x: 35, y: 472 },
    finishLabelPos: { x: 365, y: 12 },
    viewBox: '0 0 400 480',
    guidePath: '35,470 35,65 90,65 90,415 145,415 145,65 200,65 200,415 255,415 255,65 310,65 310,415 365,415 365,15',
    svgWalls: (
      <>
        {/* Background pure white fill */}
        <rect x="0" y="0" width="400" height="480" fill="#ffffff" />

        {/* Outer Perimeter with Open Doors at Start (bottom left) & Finish (top right) */}
        {/* Top outer line: gap at x=335..390 */}
        <path d="M 10 10 H 335 M 390 10 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom outer line: gap at x=10..60 */}
        <path d="M 390 470 H 60 M 10 470 V 10" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* 6 Vertical Partitions: Exactly open at top (y=10..115) OR bottom (y=365..470) */}
        {/* Wall 1 (between Col 1 & 2 at x=62): Open at TOP (y=10..115) -> wall spans y=115 to 470 */}
        <path d="M 62 115 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Wall 2 (between Col 2 & 3 at x=118): Open at BOTTOM (y=365..470) -> wall spans y=10 to 365 */}
        <path d="M 118 10 V 365" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Wall 3 (between Col 3 & 4 at x=172): Open at TOP (y=10..115) -> wall spans y=115 to 470 */}
        <path d="M 172 115 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Wall 4 (between Col 4 & 5 at x=228): Open at BOTTOM (y=365..470) -> wall spans y=10 to 365 */}
        <path d="M 228 10 V 365" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Wall 5 (between Col 5 & 6 at x=282): Open at TOP (y=10..115) -> wall spans y=115 to 470 */}
        <path d="M 282 115 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        {/* Wall 6 (between Col 6 & 7 at x=338): Open at BOTTOM (y=365..470) -> wall spans y=10 to 365 */}
        <path d="M 338 10 V 365" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
      </>
    ),
    corridorLegs: [
      // Leg 0: Start -> Col 1 Gate 1 (going UP)
      [{ x: 35, y: 465 }, { x: 35, y: 340 }, { x: 35, y: 290 }],
      // Leg 1: Gate 1 (pass y=240) -> top bend -> Col 2 Gate 2 (going DOWN)
      [{ x: 35, y: 290 }, { x: 35, y: 240 }, { x: 35, y: 65 }, { x: 90, y: 65 }, { x: 90, y: 160 }, { x: 90, y: 200 }],
      // Leg 2: Gate 2 (pass y=250) -> bottom bend -> Col 3 Gate 3 (going UP)
      [{ x: 90, y: 200 }, { x: 90, y: 250 }, { x: 90, y: 415 }, { x: 145, y: 415 }, { x: 145, y: 350 }, { x: 145, y: 300 }],
      // Leg 3: Gate 3 (pass y=240) -> top bend -> Col 4 Gate 4 (going DOWN)
      [{ x: 145, y: 300 }, { x: 145, y: 240 }, { x: 145, y: 65 }, { x: 200, y: 65 }, { x: 200, y: 160 }, { x: 200, y: 200 }],
      // Leg 4: Gate 4 (pass y=250) -> bottom bend -> Col 5 Gate 5 (going UP)
      [{ x: 200, y: 200 }, { x: 200, y: 250 }, { x: 200, y: 415 }, { x: 255, y: 415 }, { x: 255, y: 350 }, { x: 255, y: 300 }],
      // Leg 5: Gate 5 (pass y=240) -> top bend -> Col 6 Gate 6 (going DOWN)
      [{ x: 255, y: 300 }, { x: 255, y: 240 }, { x: 255, y: 65 }, { x: 310, y: 65 }, { x: 310, y: 160 }, { x: 310, y: 200 }],
      // Leg 6: Gate 6 (pass y=250) -> bottom bend -> Col 7 Gate 7 (going UP)
      [{ x: 310, y: 200 }, { x: 310, y: 250 }, { x: 310, y: 415 }, { x: 365, y: 415 }, { x: 365, y: 350 }, { x: 365, y: 300 }],
      // Leg 7: Gate 7 (pass y=250) -> Col 7 Gate 8 (going UP)
      [{ x: 365, y: 300 }, { x: 365, y: 250 }, { x: 365, y: 200 }, { x: 365, y: 160 }],
      // Leg 8: Gate 8 (pass y=120) -> Col 7 Gate 9 (going UP near finish)
      [{ x: 365, y: 160 }, { x: 365, y: 120 }, { x: 365, y: 80 }],
      // Leg 9: Gate 9 (pass y=50) -> FINISH 🏆 (x=365, y=25)
      [{ x: 365, y: 80 }, { x: 365, y: 50 }, { x: 365, y: 25 }]
    ],
    initialGates: [
      { id: 1, x: 35, y: 240, standX: 35, standY: 290 },
      { id: 2, x: 90, y: 250, standX: 90, standY: 200 },
      { id: 3, x: 145, y: 240, standX: 145, standY: 300 },
      { id: 4, x: 200, y: 250, standX: 200, standY: 200 },
      { id: 5, x: 255, y: 240, standX: 255, standY: 300 },
      { id: 6, x: 310, y: 250, standX: 310, standY: 200 },
      { id: 7, x: 365, y: 250, standX: 365, standY: 300 },
      { id: 8, x: 365, y: 120, standX: 365, standY: 160 },
      { id: 9, x: 365, y: 50, standX: 365, standY: 80 }
    ]
  },

  // -----------------------------------------------------------------------
  // MAP 3: Mê Cung Xoắn Ốc Bí Mật (Vòng Xoáy Huyền Bí Trắng Tinh)
  // -----------------------------------------------------------------------
  {
    id: 'spiral_vortex',
    name: 'Xoắn Ốc Bí Mật (Vòng Xoáy)',
    description: 'Xoắn ốc liên tục từ vành ngoài vào tâm vũ trụ',
    icon: '🌀',
    startPoint: { x: 45, y: 465 },
    finishPoint: { x: 200, y: 220 },
    startLabelPos: { x: 45, y: 472 },
    finishLabelPos: { x: 200, y: 195 },
    viewBox: '0 0 400 480',
    guidePath: '45,470 45,435 355,435 355,55 45,55 45,365 305,365 305,125 115,125 115,295 240,295 240,220 200,220',
    svgWalls: (
      <>
        {/* Background pure white fill */}
        <rect x="0" y="0" width="400" height="480" fill="#ffffff" />

        {/* Outer border with bottom-left entrance */}
        <path d="M 80 470 H 390 V 10 H 10 V 470 H 20" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Continuous single spiral wall dividing the nested winding rings */}
        <path
          d="
            M 80 470 V 400 H 325 V 90 H 80 V 330 H 260 V 160 H 150 V 260 H 200
          "
          stroke="#0f172a"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
    corridorLegs: [
      // Leg 0: Start -> Gate 1 on Bottom Outer Ring
      [{ x: 45, y: 465 }, { x: 45, y: 435 }, { x: 120, y: 435 }, { x: 155, y: 435 }],
      // Leg 1: Gate 1 (pass x=200) -> turn corner up East Ring to Gate 2
      [{ x: 155, y: 435 }, { x: 200, y: 435 }, { x: 355, y: 435 }, { x: 355, y: 320 }, { x: 355, y: 280 }],
      // Leg 2: Gate 2 (pass y=240) -> turn top North Ring to Gate 3
      [{ x: 355, y: 280 }, { x: 355, y: 240 }, { x: 355, y: 55 }, { x: 260, y: 55 }, { x: 220, y: 55 }],
      // Leg 3: Gate 3 (pass x=170) -> turn down West Ring to Gate 4
      [{ x: 220, y: 55 }, { x: 170, y: 55 }, { x: 45, y: 55 }, { x: 45, y: 180 }, { x: 45, y: 220 }],
      // Leg 4: Gate 4 (pass y=260) -> enter Ring 2 Bottom to Gate 5
      [{ x: 45, y: 220 }, { x: 45, y: 260 }, { x: 45, y: 365 }, { x: 140, y: 365 }, { x: 175, y: 365 }],
      // Leg 5: Gate 5 (pass x=215) -> enter Ring 2 East to Gate 6
      [{ x: 175, y: 365 }, { x: 215, y: 365 }, { x: 305, y: 365 }, { x: 305, y: 280 }, { x: 305, y: 240 }],
      // Leg 6: Gate 6 (pass y=200) -> enter Ring 2 North to Gate 7
      [{ x: 305, y: 240 }, { x: 305, y: 200 }, { x: 305, y: 125 }, { x: 240, y: 125 }, { x: 200, y: 125 }],
      // Leg 7: Gate 7 (pass x=160) -> enter Ring 3 West & Bottom to Gate 8
      [{ x: 200, y: 125 }, { x: 160, y: 125 }, { x: 115, y: 125 }, { x: 115, y: 295 }, { x: 155, y: 295 }, { x: 185, y: 295 }],
      // Leg 8: Gate 8 (pass x=210) -> enter Inner Sanctuary to Gate 9
      [{ x: 185, y: 295 }, { x: 210, y: 295 }, { x: 240, y: 295 }, { x: 240, y: 255 }, { x: 240, y: 220 }],
      // Leg 9: Gate 9 (pass y=220) -> VORTEX CORE FINISH 🏆 (x=200, y=220)
      [{ x: 240, y: 220 }, { x: 200, y: 220 }]
    ],
    initialGates: [
      { id: 1, x: 200, y: 435, standX: 155, standY: 435 },
      { id: 2, x: 355, y: 240, standX: 355, standY: 280 },
      { id: 3, x: 170, y: 55, standX: 220, standY: 55 },
      { id: 4, x: 45, y: 260, standX: 45, standY: 220 },
      { id: 5, x: 215, y: 365, standX: 175, standY: 365 },
      { id: 6, x: 305, y: 200, standX: 305, standY: 240 },
      { id: 7, x: 160, y: 125, standX: 200, standY: 125 },
      { id: 8, x: 210, y: 295, standX: 185, standY: 295 },
      { id: 9, x: 240, y: 235, standX: 240, standY: 255 }
    ]
  },

  // -----------------------------------------------------------------------
  // MAP 4: Mê Cung Kim Tự Tháp Ma Thuật (Lâu Đài Cổ Tích 100% Thông Thoáng)
  // -----------------------------------------------------------------------
  {
    id: 'pyramid_labyrinth',
    name: 'Kim Tự Tháp Cổ Đại (Đa Ngã Rẽ)',
    description: 'Mê cung lâu đài cổ với các góc rẽ 90° thông thoáng hoàn toàn',
    icon: '🏛️',
    startPoint: { x: 45, y: 465 },
    finishPoint: { x: 200, y: 25 },
    startLabelPos: { x: 45, y: 472 },
    finishLabelPos: { x: 200, y: 15 },
    viewBox: '0 0 400 480',
    guidePath: '45,470 45,420 355,420 355,340 230,340 230,370 120,370 120,340 45,340 45,250 160,250 160,200 280,200 280,250 355,250 355,100 45,100 45,45 200,45 200,15',
    svgWalls: (
      <>
        {/* Background pure white fill */}
        <rect x="0" y="0" width="400" height="480" fill="#ffffff" />

        {/* Outer Perimeter with Open Doors at Start (bottom-left) and Summit (top-center) */}
        {/* Top wall: gap at x=165..235 */}
        <path d="M 10 10 H 165 M 235 10 H 390 V 470" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        {/* Bottom wall: gap at x=15..80 */}
        <path d="M 390 470 H 80 M 15 470 H 10 V 10" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interlocking Partitions with NO lines cutting across open paths */}
        {/* Divider 1 (above bottom row): M 10 380 H 310 */}
        <path d="M 10 380 H 310" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />

        {/* Middle Castle Gate & U-turn pocket wall: below row 2 */}
        <path d="M 80 380 V 305 H 175 M 275 305 H 390" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Level 3 Bridge Wall: shapes the zigzag castle bridge */}
        <path d="M 10 295 H 315" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 160 H 115 V 215 H 225 V 160 H 390" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Top Pyramid Chamber Wall: leaves central corridor up to Summit */}
        <path d="M 90 70 H 390" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" />
        <path d="M 10 70 H 50 V 25 H 155" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 245 25 H 350 V 70" stroke="#0f172a" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
    corridorLegs: [
      // Leg 0: Start -> Gate 1 on Bottom Floor
      [{ x: 45, y: 465 }, { x: 45, y: 420 }, { x: 120, y: 420 }, { x: 145, y: 420 }],
      // Leg 1: Gate 1 (pass x=175) -> Gate 2
      [{ x: 145, y: 420 }, { x: 175, y: 420 }, { x: 230, y: 420 }, { x: 260, y: 420 }],
      // Leg 2: Gate 2 (pass x=290) -> Right Turn Up to Level 2 -> Gate 3
      [{ x: 260, y: 420 }, { x: 290, y: 420 }, { x: 355, y: 420 }, { x: 355, y: 340 }, { x: 310, y: 340 }],
      // Leg 3: Gate 3 (pass x=280) -> Castle Loop U-turn -> Gate 4
      [{ x: 310, y: 340 }, { x: 280, y: 340 }, { x: 230, y: 340 }, { x: 230, y: 370 }, { x: 180, y: 370 }],
      // Leg 4: Gate 4 (pass x=150) -> Turn up left to Level 3 -> Gate 5
      [{ x: 180, y: 370 }, { x: 150, y: 370 }, { x: 120, y: 370 }, { x: 120, y: 340 }, { x: 45, y: 340 }, { x: 45, y: 250 }, { x: 80, y: 250 }],
      // Leg 5: Gate 5 (pass x=110) -> Castle Bridge -> Gate 6
      [{ x: 80, y: 250 }, { x: 110, y: 250 }, { x: 160, y: 250 }, { x: 160, y: 200 }, { x: 190, y: 200 }],
      // Leg 6: Gate 6 (pass x=220) -> Bridge East -> Gate 7
      [{ x: 190, y: 200 }, { x: 220, y: 200 }, { x: 280, y: 200 }, { x: 280, y: 250 }, { x: 355, y: 250 }, { x: 355, y: 180 }],
      // Leg 7: Gate 7 (pass y=140) -> Turn left to Top Corridor -> Gate 8
      [{ x: 355, y: 180 }, { x: 355, y: 140 }, { x: 355, y: 100 }, { x: 290, y: 100 }, { x: 250, y: 100 }],
      // Leg 8: Gate 8 (pass x=210) -> West Chamber -> Gate 9
      [{ x: 250, y: 100 }, { x: 210, y: 100 }, { x: 140, y: 100 }, { x: 100, y: 100 }],
      // Leg 9: Gate 9 (pass x=60) -> SUMMIT SANCTUARY FINISH 🏆 (x=200, y=25)
      [{ x: 100, y: 100 }, { x: 60, y: 100 }, { x: 45, y: 100 }, { x: 45, y: 45 }, { x: 140, y: 45 }, { x: 200, y: 45 }, { x: 200, y: 25 }]
    ],
    initialGates: [
      { id: 1, x: 175, y: 420, standX: 145, standY: 420 },
      { id: 2, x: 290, y: 420, standX: 260, standY: 420 },
      { id: 3, x: 280, y: 340, standX: 310, standY: 340 },
      { id: 4, x: 150, y: 370, standX: 180, standY: 370 },
      { id: 5, x: 110, y: 250, standX: 80, standY: 250 },
      { id: 6, x: 220, y: 200, standX: 190, standY: 200 },
      { id: 7, x: 355, y: 140, standX: 355, standY: 180 },
      { id: 8, x: 210, y: 100, standX: 250, standY: 100 },
      { id: 9, x: 60, y: 100, standX: 100, standY: 100 }
    ]
  }
];

// Helpers to compute points & corridors dynamically along any map guidePath polyline
function parsePolyline(pathStr: string): Point[] {
  return pathStr
    .trim()
    .split(/\s+/)
    .map(coord => {
      const [x, y] = coord.split(',').map(Number);
      return { x, y };
    })
    .filter(p => !isNaN(p.x) && !isNaN(p.y));
}

function getPolylineCumulativeDistances(pts: Point[]): number[] {
  const dists = [0];
  for (let i = 0; i < pts.length - 1; i++) {
    const d = Math.hypot(pts[i + 1].x - pts[i].x, pts[i + 1].y - pts[i].y);
    dists.push(dists[i] + d);
  }
  return dists;
}

function getPointAtDistanceOnPolyline(pts: Point[], cumDists: number[], targetDist: number): Point {
  const total = cumDists[cumDists.length - 1];
  const clamped = Math.max(0, Math.min(total, targetDist));
  for (let i = 0; i < cumDists.length - 1; i++) {
    if (clamped <= cumDists[i + 1]) {
      const segLen = cumDists[i + 1] - cumDists[i];
      if (segLen === 0) return { ...pts[i] };
      const t = (clamped - cumDists[i]) / segLen;
      return {
        x: Math.round(pts[i].x + t * (pts[i + 1].x - pts[i].x)),
        y: Math.round(pts[i].y + t * (pts[i + 1].y - pts[i].y))
      };
    }
  }
  return { ...pts[pts.length - 1] };
}

function getSubsegmentBetween(pts: Point[], cumDists: number[], dStart: number, dEnd: number): Point[] {
  const pStart = getPointAtDistanceOnPolyline(pts, cumDists, dStart);
  const pEnd = getPointAtDistanceOnPolyline(pts, cumDists, dEnd);
  const result: Point[] = [pStart];

  for (let i = 0; i < pts.length; i++) {
    if (cumDists[i] > dStart + 0.5 && cumDists[i] < dEnd - 0.5) {
      result.push({ ...pts[i] });
    }
  }

  result.push(pEnd);
  return result;
}

export const WorksheetMazeView: React.FC = () => {
  const {
    profile,
    addCoinsAndGems,
    recordQuestionAnswered,
    activeTeacherScript,
    stopTeacherScript,
    setCurrentMode
  } = useGame();

  // Selected Map & Math Topic
  const [selectedMapId, setSelectedMapId] = useState<string>('serpentine');
  const [worksheetTopic, setWorksheetTopic] = useState<'word_problem' | 'comparison' | 'pred_succ' | 'measurement' | 'add_20' | 'sub_20' | 'mult_table' | 'find_x' | 'mixed_math'>('word_problem');

  // Walking speed configuration (Default: 'slow' = 550ms for leisurely slow walk)
  const [walkSpeed, setWalkSpeed] = useState<'slow' | 'normal' | 'fast'>('slow');
  // Answer Mode: 'choice' (Chọn đáp án) or 'input' (Điền đáp số)
  const [answerMode, setAnswerMode] = useState<'choice' | 'input'>('choice');
  const [showMapModal, setShowMapModal] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const currentMap = MAZE_MAPS.find(m => m.id === selectedMapId) || MAZE_MAPS[0];

  const [gates, setGates] = useState<WorksheetGate[]>([]);
  const [corridorLegs, setCorridorLegs] = useState<Point[][]>(currentMap.corridorLegs);
  const [activeGateIndex, setActiveGateIndex] = useState<number>(0);
  const [characterPos, setCharacterPos] = useState<Point>(currentMap.startPoint);
  const [isWalking, setIsWalking] = useState<boolean>(false);
  const [visitedPoints, setVisitedPoints] = useState<Point[]>([currentMap.startPoint]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [wrongShake, setWrongShake] = useState<number | null>(null);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [characterThought, setCharacterThought] = useState<string>('Xuất phát nào!');

  // Celebratory flower petals & applause state
  const [flowers, setFlowers] = useState<FlowerParticle[]>([]);
  const [showApplauseBanner, setShowApplauseBanner] = useState<boolean>(false);

  // Cartoon Hammer Bonk State
  const [bonkActive, setBonkActive] = useState<boolean>(false);
  const [typedAnswer, setTypedAnswer] = useState<string>('');

  const moveIntervalRef = useRef<number | null>(null);
  const autoPlayTimerRef = useRef<number | null>(null);

  // Trong khung portal (cao 100dvh − 44px): ở màn rộng, bản đồ dọc sang cột trái với cạnh lấy theo
  // chiều cao khung, thanh công cụ + câu hỏi sang cột phải — cả vòng chơi vừa khung không cuộn.
  const [gon] = useState(dangNhungTrongPortal);
  const cotPhai = gon ? 'lg:col-start-2' : '';

  // Nhật ký trả lời của phiếu đang chơi (bằng chứng nộp portal). Ref, không state.
  const traLoiRef = useRef<CauTraLoi[]>([]);
  const mocBatDauRef = useRef<number | null>(null);
  // Phiếu có bật Bot tự giải lúc nào đó thì không phải thành tích của người chơi -> không nộp.
  const daDungBotRef = useRef<boolean>(false);
  const datLaiNhatKy = () => {
    traLoiRef.current = [];
    mocBatDauRef.current = null;
    daDungBotRef.current = false;
  };

  // Determine ms per step based on selected speed
  const getStepDuration = () => {
    if (walkSpeed === 'slow') return 550; // Lò rò chậm rãi
    if (walkSpeed === 'normal') return 350;
    return 200; // Nhanh
  };

  // Generate dynamic, randomized math questions and matching corridor legs for gates
  const generateDynamicGatesAndLegs = (
    topic: string,
    mapTemplate: MazeMapTemplate,
    script?: TeacherLessonScript | null
  ): { gates: WorksheetGate[]; corridorLegs: Point[][] } => {
    // 🎓 1. Ưu tiên Kịch bản Giáo viên: Sinh ĐÚNG số câu hỏi cô soạn (Không lặp, không thừa)
    if (script && Array.isArray(script.questions) && script.questions.length > 0) {
      const rawQs = script.questions;
      const N = rawQs.length;

      const waypoints = parsePolyline(mapTemplate.guidePath);
      const cumDists = getPolylineCumulativeDistances(waypoints);
      const totalPathLen = cumDists[cumDists.length - 1];

      const standDists: number[] = [];
      const gatesList: WorksheetGate[] = [];

      for (let i = 0; i < N; i++) {
        const scriptQ = rawQs[i];
        // Evenly space N gates from START to FINISH
        const gateDist = ((i + 1) / (N + 1)) * totalPathLen;
        const standDist = Math.max(0, gateDist - 22);
        standDists.push(standDist);

        const gatePos = getPointAtDistanceOnPolyline(waypoints, cumDists, gateDist);
        const standPos = getPointAtDistanceOnPolyline(waypoints, cumDists, standDist);

        const q = scriptQ.shortQuestion || `Ải ${i + 1}`;
        const story = scriptQ.story || `Câu hỏi số ${i + 1}`;
        const a = scriptQ.correctAnswer;
        const validOpts = Array.isArray(scriptQ.options) && scriptQ.options.length >= 2
          ? [...scriptQ.options]
          : [a, a + 1, a - 1, a + 2];

        gatesList.push({
          id: i + 1,
          x: gatePos.x,
          y: gatePos.y,
          standX: standPos.x,
          standY: standPos.y,
          question: q,
          storyText: story,
          correctAnswer: a,
          options: validOpts.slice(0, 4),
          solved: false
        });
      }

      // Generate N + 1 corridor walking legs
      const legs: Point[][] = [];
      // Leg 0: Start to Stand 0
      legs.push(getSubsegmentBetween(waypoints, cumDists, 0, standDists[0]));
      // Leg 1 to N-1: Stand i-1 to Stand i
      for (let i = 1; i < N; i++) {
        legs.push(getSubsegmentBetween(waypoints, cumDists, standDists[i - 1], standDists[i]));
      }
      // Leg N: Stand N-1 to Finish
      legs.push(getSubsegmentBetween(waypoints, cumDists, standDists[N - 1], totalPathLen));

      return { gates: gatesList, corridorLegs: legs };
    }

    // 2. Chế độ Mặc định Theo Chủ Đề: Sinh 9 câu hỏi cho bản đồ mẫu
    const totalGates = mapTemplate.initialGates.length;
    const questions: { q: string; story?: string; a: number; opts: number[] }[] = [];

    for (let i = 0; i < totalGates; i++) {
      let q = '';
      let story = '';
      let a = 0;

      if (topic === 'word_problem') {
        const names = ['An', 'Bình', 'Lan', 'Mai', 'Nam', 'Minh', 'Hà', 'Quân', 'Vy', 'Linh', 'Dũng', 'Khánh'];
        const n1 = names[Math.floor(Math.random() * names.length)];
        let n2 = names[Math.floor(Math.random() * names.length)];
        while (n2 === n1) {
          n2 = names[Math.floor(Math.random() * names.length)];
        }

        const generators = [
          // 1. Thêm vào (Cộng)
          () => {
            const a1 = Math.floor(Math.random() * 18) + 6;
            const a2 = Math.floor(Math.random() * 15) + 4;
            return {
              q: `Ải ${i + 1}`,
              story: `${n1} có ${a1} viên bi, ${n2} cho ${n1} thêm ${a2} viên bi. Hỏi ${n1} có tất cả bao nhiêu viên bi?`,
              a: a1 + a2
            };
          },
          // 2. Bớt đi (Trừ)
          () => {
            const a1 = Math.floor(Math.random() * 20) + 15;
            const a2 = Math.floor(Math.random() * (a1 - 5)) + 4;
            return {
              q: `Ải ${i + 1}`,
              story: `Trong rổ có ${a1} quả táo, ${n1} ăn hết ${a2} quả. Hỏi trong rổ còn lại bao nhiêu quả táo?`,
              a: a1 - a2
            };
          },
          // 3. Nhiều hơn (Cộng)
          () => {
            const a1 = Math.floor(Math.random() * 15) + 5;
            const a2 = Math.floor(Math.random() * 12) + 3;
            return {
              q: `Ải ${i + 1}`,
              story: `${n1} sưu tầm được ${a1} con tem, ${n2} có nhiều hơn ${n1} ${a2} con tem. Hỏi ${n2} có bao nhiêu con tem?`,
              a: a1 + a2
            };
          },
          // 4. Ít hơn (Trừ)
          () => {
            const a1 = Math.floor(Math.random() * 25) + 15;
            const a2 = Math.floor(Math.random() * 10) + 3;
            return {
              q: `Ải ${i + 1}`,
              story: `Đội Một trồng được ${a1} cây, đội Hai trồng ít hơn đội Một ${a2} cây. Hỏi đội Hai trồng được bao nhiêu cây?`,
              a: a1 - a2
            };
          },
          // 5. Nhân (Nhóm đều)
          () => {
            const boxes = Math.floor(Math.random() * 5) + 3;
            const itemsPerBox = Math.floor(Math.random() * 6) + 3;
            return {
              q: `Ải ${i + 1}`,
              story: `Có ${boxes} hộp bút chì màu, mỗi hộp đựng ${itemsPerBox} cây bút. Hỏi có tất cả bao nhiêu cây bút chì màu?`,
              a: boxes * itemsPerBox
            };
          },
          // 6. Chia đều
          () => {
            const friends = Math.floor(Math.random() * 4) + 2; // 2 to 5
            const candiesEach = Math.floor(Math.random() * 6) + 3; // 3 to 8
            const total = friends * candiesEach;
            return {
              q: `Ải ${i + 1}`,
              story: `Có ${total} cái kẹo chia đều cho ${friends} bạn nhỏ. Hỏi mỗi bạn được chia mấy cái kẹo?`,
              a: candiesEach
            };
          },
          // 7. Gấp lên nhiều lần
          () => {
            const base = Math.floor(Math.random() * 7) + 3;
            const times = Math.floor(Math.random() * 4) + 2;
            return {
              q: `Ải ${i + 1}`,
              story: `Gấp số ${base} lên ${times} lần thì được kết quả là số nào?`,
              a: base * times
            };
          },
          // 8. Giảm đi nhiều lần
          () => {
            const divisor = Math.floor(Math.random() * 4) + 2;
            const res = Math.floor(Math.random() * 7) + 3;
            const original = divisor * res;
            return {
              q: `Ải ${i + 1}`,
              story: `Giảm số ${original} đi ${divisor} lần thì ta được kết quả là số nào?`,
              a: res
            };
          },
          // 9. Chu vi hình vuông
          () => {
            const side = Math.floor(Math.random() * 9) + 3;
            return {
              q: `Ải ${i + 1}`,
              story: `Tính chu vi của một hình vuông có độ dài cạnh bằng ${side} cm.`,
              a: side * 4
            };
          },
          // 10. Chu vi hình chữ nhật
          () => {
            const w = Math.floor(Math.random() * 6) + 3;
            const l = w + Math.floor(Math.random() * 5) + 2;
            return {
              q: `Ải ${i + 1}`,
              story: `Một hình chữ nhật có chiều dài ${l} cm và chiều rộng ${w} cm. Tính chu vi hình chữ nhật đó.`,
              a: (l + w) * 2
            };
          },
          // 11. Tuổi mẹ và con
          () => {
            const diff = Math.floor(Math.random() * 6) + 24; // 24 to 29
            const childAge = Math.floor(Math.random() * 5) + 7; // 7 to 11
            const momAge = childAge + diff;
            return {
              q: `Ải ${i + 1}`,
              story: `Mẹ ${momAge} tuổi, con kém mẹ ${diff} tuổi. Hỏi năm nay con bao nhiêu tuổi?`,
              a: childAge
            };
          },
          // 12. Gà và chân gà
          () => {
            const chickens = Math.floor(Math.random() * 7) + 4;
            return {
              q: `Ải ${i + 1}`,
              story: `Mỗi con gà có 2 cái chân. Hỏi một đàn gồm ${chickens} con gà có tất cả bao nhiêu cái chân?`,
              a: chickens * 2
            };
          },
          // 13. Tuần lễ và ngày
          () => {
            const weeks = Math.floor(Math.random() * 4) + 2;
            return {
              q: `Ải ${i + 1}`,
              story: `Mỗi tuần lễ có 7 ngày. Hỏi ${weeks} tuần lễ có tất cả bao nhiêu ngày?`,
              a: weeks * 7
            };
          },
          // 14. Bán gạo ngày sáng và chiều
          () => {
            const kg1 = Math.floor(Math.random() * 25) + 20;
            const kg2 = Math.floor(Math.random() * 20) + 15;
            return {
              q: `Ải ${i + 1}`,
              story: `Buổi sáng cửa hàng bán được ${kg1} kg đường, buổi chiều bán được ${kg2} kg đường. Hỏi cả ngày cửa hàng bán được bao nhiêu kg đường?`,
              a: kg1 + kg2
            };
          },
          // 15. Lớp học nam và nữ
          () => {
            const totalStudents = Math.floor(Math.random() * 11) + 30; // 30 to 40
            const girls = Math.floor(Math.random() * 6) + 15; // 15 to 20
            return {
              q: `Ải ${i + 1}`,
              story: `Lớp 3A có ${totalStudents} học sinh, trong đó có ${girls} bạn nữ. Hỏi lớp 3A có bao nhiêu bạn nam?`,
              a: totalStudents - girls
            };
          },
          // 16. [NÂNG CAO 1] Tổng - Hiệu chuyển đổi giữa 2 kho
          () => {
            const transfer = Math.floor(Math.random() * 6) + 12; // 12..17
            const diff = transfer * 2;
            const small = Math.floor(Math.random() * 20) + 40;
            const big = small + diff;
            const sum = small + big;
            return {
              q: `Ải ${i + 1}`,
              story: `Hai kho có tất cả ${sum} kg gạo. Nếu chuyển ${transfer} kg từ kho 1 sang kho 2 thì hai kho bằng nhau. Hỏi lúc đầu kho 1 có bao nhiêu kg gạo?`,
              a: big
            };
          },
          // 17. [NÂNG CAO 2] Dạng nhiều bước bán vở
          () => {
            const totalBooks = Math.floor(Math.random() * 60) + 200;
            const morning = Math.floor(Math.random() * 20) + 40;
            const afternoon = morning * 2;
            const remain = totalBooks - morning - afternoon;
            return {
              q: `Ải ${i + 1}`,
              story: `Cửa hàng có ${totalBooks} quyển vở. Buổi sáng bán ${morning} quyển, buổi chiều bán gấp đôi buổi sáng. Hỏi cửa hàng còn lại bao nhiêu quyển vở?`,
              a: remain
            };
          },
          // 18. [NÂNG CAO 3] Tìm số chưa biết & chia có dư
          () => {
            const divisor = 6;
            const quotient = 35;
            const remainder = 4;
            const num = divisor * quotient + remainder; // 214
            const newDiv = 7;
            const added = 17;
            const newQuotient = (num + added) / newDiv; // 33
            return {
              q: `Ải ${i + 1}`,
              story: `Một số chia cho 6 được thương là 35 dư 4. Nếu lấy số đó cộng với 17 rồi chia cho 7 thì được thương là bao nhiêu?`,
              a: newQuotient
            };
          },
          // 19. [NÂNG CAO 4] Dạng tuổi
          () => {
            const momAge = 36;
            const childAge = momAge / 4; // 9
            const futureYears = 4;
            const sumFuture = (momAge + futureYears) + (childAge + futureYears); // 40 + 13 = 53
            return {
              q: `Ải ${i + 1}`,
              story: `Năm nay mẹ ${momAge} tuổi, con bằng 1/4 tuổi mẹ. Hỏi sau ${futureYears} năm nữa, tổng số tuổi của hai mẹ con là bao nhiêu?`,
              a: sumFuture
            };
          },
          // 20. [NÂNG CAO 5] Suy luận ngược
          () => {
            const give = 12;
            const receive = 8;
            const finalCount = 35;
            const initCount = finalCount - receive + give; // 39
            return {
              q: `Ải ${i + 1}`,
              story: `An có một số viên bi. An cho Bình ${give} viên, sau đó mẹ cho thêm ${receive} viên thì An có ${finalCount} viên. Hỏi lúc đầu An có bao nhiêu viên bi?`,
              a: initCount
            };
          },
          // 21. [NÂNG CAO 6] Gấp nhiều lần chuỗi gà, vịt, ngan
          () => {
            const chickens = 24;
            const ducks = chickens * 3; // 72
            const geese = ducks - 17; // 55
            const totalPoultry = chickens + ducks + geese; // 151
            return {
              q: `Ải ${i + 1}`,
              story: `Trang trại có ${chickens} con gà. Số vịt gấp 3 lần số gà. Số ngan ít hơn số vịt 17 con. Hỏi trang trại có tất cả bao nhiêu con gà, vịt và ngan?`,
              a: totalPoultry
            };
          },
          // 22. [NÂNG CAO 7] Chia có điều kiện (xếp hàng)
          () => {
            const totalStudents = 87;
            const perRow = 8;
            const remainder = totalStudents % perRow; // 7
            const needMore = perRow - remainder; // 1
            return {
              q: `Ải ${i + 1}`,
              story: `Có ${totalStudents} học sinh xếp thành các hàng, mỗi hàng ${perRow} bạn. Hỏi cần thêm ít nhất bao nhiêu bạn để tất cả các hàng đều đủ ${perRow} người?`,
              a: needMore
            };
          },
          // 23. [NÂNG CAO 8] Dạng tiền mua sắm
          () => {
            return {
              q: `Ải ${i + 1}`,
              story: `Lan có 100.000đ. Lan mua 3 quyển vở giá 12.000đ/quyển và 1 hộp bút 35.000đ. Sau đó mẹ cho thêm 20.000đ. Hỏi Lan còn lại bao nhiêu tiền? (nghìn đồng)`,
              a: 49
            };
          },
          // 24. [NÂNG CAO 9] Dạng năng suất trồng cây
          () => {
            const d1 = 125;
            const d2 = d1 + 37; // 162
            const d3 = d2 - 28; // 134
            const total = d1 + d2 + d3; // 421
            return {
              q: `Ải ${i + 1}`,
              story: `Đội trồng cây: Ngày 1 trồng 125 cây, Ngày 2 nhiều hơn Ngày 1 là 37 cây, Ngày 3 ít hơn Ngày 2 là 28 cây. Cả 3 ngày trồng được bao nhiêu cây?`,
              a: total
            };
          },
          // 25. [NÂNG CAO 10] Dạng tuổi nâng cao
          () => {
            const dadAge = 38;
            const childAge = 10;
            // Diff = 28. When 3x: child = 14 => years = 4
            return {
              q: `Ải ${i + 1}`,
              story: `Hiện nay bố ${dadAge} tuổi, con ${childAge} tuổi. Hỏi sau bao nhiêu năm nữa thì tuổi bố gấp 3 lần tuổi con?`,
              a: 4
            };
          },
          // 26. [NÂNG CAO 11] Dạng số có quy luật / Tổng 3 số
          () => {
            return {
              q: `Ải ${i + 1}`,
              story: `Tổng 3 số là 180. Số thứ nhất gấp đôi số thứ hai. Số thứ ba hơn số thứ hai 20 đơn vị. Tìm số thứ hai.`,
              a: 40
            };
          },
          // 27. [NÂNG CAO 12] Dạng ốc sên leo tường
          () => {
            return {
              q: `Ải ${i + 1}`,
              story: `Một con ốc sên leo bức tường cao 10m. Ban ngày bò lên 3m, ban đêm tụt xuống 2m. Hỏi sau bao nhiêu ngày ốc sên lên đến đỉnh tường?`,
              a: 8
            };
          },
          // 28. [NÂNG CAO 13] Dạng suy luận chia bánh kẹo
          () => {
            // Box 1: 24, Box 2: 48, Box 3: 33. Sum 1+3 = 57. Per friend = 19
            return {
              q: `Ải ${i + 1}`,
              story: `Có 3 hộp bánh. Hộp 1 có 24 cái. Hộp 2 gấp đôi hộp 1. Hộp 3 ít hơn hộp 2 là 15 cái. Lấy tổng hộp 1 và 3 chia đều 3 bạn. Mỗi bạn được mấy cái?`,
              a: 19
            };
          },
          // 29. [NÂNG CAO 14] Dạng cấu tạo số
          () => {
            return {
              q: `Ải ${i + 1}`,
              story: `Một số có 2 chữ số. Tổng 2 chữ số bằng 9. Chữ số hàng chục lớn hơn hàng đơn vị 3 đơn vị. Tìm số đó.`,
              a: 63
            };
          }
        ];

        // Random generator selection ensuring distinct styles
        const gen = generators[Math.floor(Math.random() * generators.length)];
        const generated = gen();
        q = generated.q;
        story = generated.story;
        a = generated.a;
      } else if (topic === 'comparison') {
        const randType = Math.floor(Math.random() * 5);
        if (randType === 0) {
          const target = Math.floor(Math.random() * 40) + 30;
          const diff = Math.floor(Math.random() * 15) + 5;
          a = target + diff;
          q = `> ${target} ?`;
          story = `Trong các đáp án sau, số nào lớn hơn ${target}?`;
        } else if (randType === 1) {
          const target = Math.floor(Math.random() * 40) + 30;
          const diff = Math.floor(Math.random() * 15) + 5;
          a = target - diff;
          q = `< ${target} ?`;
          story = `Trong các đáp án sau, số nào bé hơn ${target}?`;
        } else if (randType === 2) {
          const lower = (Math.floor(Math.random() * 6) + 2) * 10;
          const upper = lower + 20;
          a = lower + 10;
          q = `${lower} < ? < ${upper}`;
          story = `Số tròn chục nằm ở giữa ${lower} và ${upper} là số nào?`;
        } else if (randType === 3) {
          a = 99;
          q = 'Max 2 số ?';
          story = 'Số lớn nhất có hai chữ số là số nào?';
        } else {
          a = 10;
          q = 'Min 2 số ?';
          story = 'Số bé nhất có hai chữ số là số nào?';
        }
      } else if (topic === 'pred_succ') {
        const baseNum = Math.floor(Math.random() * 85) + 12;
        const isPred = Math.random() > 0.5;
        if (isPred) {
          a = baseNum - 1;
          q = `Trước ${baseNum} =`;
          story = `Tìm số liền trước của số ${baseNum}.`;
        } else {
          a = baseNum + 1;
          q = `Sau ${baseNum} =`;
          story = `Tìm số liền sau của số ${baseNum}.`;
        }
      } else if (topic === 'measurement') {
        const mTypes = Math.floor(Math.random() * 5);
        if (mTypes === 0) {
          const val = Math.floor(Math.random() * 8) + 1;
          a = val * 100;
          q = `${val}m = ? cm`;
          story = `Đổi đơn vị độ dài: ${val} mét (m) bằng bao nhiêu xăng-ti-mét (cm)?`;
        } else if (mTypes === 1) {
          const val = Math.floor(Math.random() * 6) + 1;
          a = val * 1000;
          q = `${val}km = ? m`;
          story = `Đổi đơn vị độ dài: ${val} ki-lô-mét (km) bằng bao nhiêu mét (m)?`;
        } else if (mTypes === 2) {
          const val = Math.floor(Math.random() * 7) + 1;
          a = val * 1000;
          q = `${val}kg = ? g`;
          story = `Đổi đơn vị khối lượng: ${val} ki-lô-gam (kg) bằng bao nhiêu gam (g)?`;
        } else if (mTypes === 3) {
          const val = Math.floor(Math.random() * 4) + 1;
          a = val * 60;
          q = `${val} giờ = ? ph`;
          story = `Đổi đơn vị thời gian: ${val} giờ bằng bao nhiêu phút?`;
        } else {
          const val = Math.floor(Math.random() * 3) + 1;
          a = val * 24;
          q = `${val} ngày = ? h`;
          story = `Đổi đơn vị thời gian: ${val} ngày bằng bao nhiêu giờ?`;
        }
      } else if (topic === 'add_20') {
        const num1 = Math.floor(Math.random() * 11) + 4; // 4 to 14
        const num2 = Math.floor(Math.random() * (20 - num1)) + 1; // sum <= 20
        a = num1 + num2;
        q = `${num1} + ${num2} =`;
        story = `Thực hiện phép tính cộng: ${num1} + ${num2} = ?`;
      } else if (topic === 'sub_20') {
        const num1 = Math.floor(Math.random() * 11) + 10; // 10 to 20
        const num2 = Math.floor(Math.random() * (num1 - 2)) + 2; // result >= 2
        a = num1 - num2;
        q = `${num1} - ${num2} =`;
        story = `Thực hiện phép tính trừ: ${num1} - ${num2} = ?`;
      } else if (topic === 'mult_table') {
        const table = [2, 3, 4, 5, 6, 7, 8, 9];
        const num1 = table[Math.floor(Math.random() * table.length)];
        const num2 = Math.floor(Math.random() * 9) + 2; // 2 to 10
        a = num1 * num2;
        q = `${num1} × ${num2} =`;
        story = `Tính nhẩm bảng nhân: ${num1} × ${num2} = ?`;
      } else if (topic === 'find_x') {
        const xVal = Math.floor(Math.random() * 12) + 2; // 2 to 13
        const pattern = Math.floor(Math.random() * 3);
        if (pattern === 0) {
          const k = Math.floor(Math.random() * 8) + 3;
          a = xVal;
          q = `x + ${k} = ${xVal + k}`;
          story = `Tìm giá trị của x biết: x + ${k} = ${xVal + k}`;
        } else if (pattern === 1) {
          const k = Math.floor(Math.random() * 7) + 2;
          a = xVal;
          q = `${xVal + k} - x = ${k}`;
          story = `Tìm giá trị của x biết: ${xVal + k} - x = ${k}`;
        } else {
          const m = Math.floor(Math.random() * 4) + 2;
          a = xVal;
          q = `${m} × x = ${m * xVal}`;
          story = `Tìm giá trị của x biết: ${m} × x = ${m * xVal}`;
        }
      } else {
        // Mixed math
        const type = Math.floor(Math.random() * 3);
        if (type === 0) {
          const n1 = Math.floor(Math.random() * 12) + 3;
          const n2 = Math.floor(Math.random() * (20 - n1)) + 1;
          a = n1 + n2;
          q = `${n1} + ${n2} =`;
          story = `Tính nhẩm: ${n1} + ${n2} = ?`;
        } else if (type === 1) {
          const n1 = Math.floor(Math.random() * 10) + 11;
          const n2 = Math.floor(Math.random() * 8) + 2;
          a = n1 - n2;
          q = `${n1} - ${n2} =`;
          story = `Tính nhẩm: ${n1} - ${n2} = ?`;
        } else {
          const n1 = Math.floor(Math.random() * 6) + 2;
          const n2 = Math.floor(Math.random() * 6) + 2;
          a = n1 * n2;
          q = `${n1} × ${n2} =`;
          story = `Tính nhẩm: ${n1} × ${n2} = ?`;
        }
      }

      // Generate 3 unique, plausible distractors
      const wrong1 = a + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 2) + 1);
      let wrong2 = a + (Math.random() > 0.5 ? 2 : -2) * (Math.floor(Math.random() * 2) + 1);
      if (wrong2 === wrong1 || wrong2 === a || wrong2 < 0) {
        wrong2 = a + 3;
      }

      const rawOpts = [a, Math.max(0, wrong1), Math.max(0, wrong2)];
      const uniqueOpts = Array.from(new Set(rawOpts));
      while (uniqueOpts.length < 3) {
        uniqueOpts.push(a + uniqueOpts.length + 1);
      }
      uniqueOpts.sort(() => Math.random() - 0.5);

      questions.push({ q, story, a, opts: uniqueOpts });
    }

    const builtGates = mapTemplate.initialGates.map((cfg, idx) => ({
      ...cfg,
      question: questions[idx].q,
      storyText: questions[idx].story,
      correctAnswer: questions[idx].a,
      options: questions[idx].opts,
      solved: false
    }));

    return { gates: builtGates, corridorLegs: mapTemplate.corridorLegs };
  };

  // Trigger celebratory flowers & applause
  const triggerFlowerCelebration = (centerX: number, centerY: number) => {
    const flowerEmojis = ['🌸', '🌺', '🌻', '💐', '🌷', '✨', '👏', '🎉', '🌟'];
    const newFlowers: FlowerParticle[] = [];

    for (let i = 0; i < 16; i++) {
      const angle = (Math.PI * 2 * i) / 16 + (Math.random() - 0.5) * 0.4;
      const speed = 25 + Math.random() * 35;
      newFlowers.push({
        id: Date.now() + i,
        x: centerX,
        y: centerY,
        emoji: flowerEmojis[Math.floor(Math.random() * flowerEmojis.length)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 20,
        rotation: Math.random() * 360
      });
    }

    setFlowers(newFlowers);
    setShowApplauseBanner(true);

    try {
      confetti({
        particleCount: 40,
        spread: 65,
        origin: { x: centerX / 400, y: centerY / 480 },
        colors: ['#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#a78bfa']
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      setFlowers([]);
      setShowApplauseBanner(false);
    }, 1300);
  };

  // Step-by-step corridor walker runner
  const walkAlongPoints = (points: Point[], onComplete?: () => void) => {
    if (points.length === 0) {
      if (onComplete) onComplete();
      return;
    }

    if (moveIntervalRef.current) {
      window.clearInterval(moveIntervalRef.current);
      moveIntervalRef.current = null;
    }

    setIsWalking(true);
    let stepIndex = 0;
    const intervalTime = getStepDuration();

    moveIntervalRef.current = window.setInterval(() => {
      if (stepIndex < points.length) {
        const nextPt = points[stepIndex];
        setCharacterPos(nextPt);
        setVisitedPoints(prev => [...prev, nextPt]);
        soundManager.playMove();
        stepIndex++;
      } else {
        if (moveIntervalRef.current) {
          window.clearInterval(moveIntervalRef.current);
          moveIntervalRef.current = null;
        }
        setIsWalking(false);
        if (onComplete) onComplete();
      }
    }, intervalTime);
  };

  // Reset or initialize when Map or Topic or Teacher Script changes
  useEffect(() => {
    const { gates: initialGates, corridorLegs: initialLegs } = generateDynamicGatesAndLegs(
      worksheetTopic,
      currentMap,
      activeTeacherScript
    );
    setGates(initialGates);
    datLaiNhatKy();
    setCorridorLegs(initialLegs);
    setActiveGateIndex(0);
    setCharacterPos(currentMap.startPoint);
    setVisitedPoints([currentMap.startPoint]);
    setIsCompleted(false);
    setIsAutoPlaying(false);
    setCharacterThought('Xuất phát nào!');

    const timer = setTimeout(() => {
      if (initialLegs[0]) {
        walkAlongPoints(initialLegs[0], () => {
          setCharacterThought('💭 Cố lên nào!');
        });
      }
    }, 450);

    return () => {
      clearTimeout(timer);
      if (moveIntervalRef.current) window.clearInterval(moveIntervalRef.current);
      if (autoPlayTimerRef.current) window.clearTimeout(autoPlayTimerRef.current);
    };
  }, [selectedMapId, worksheetTopic, activeTeacherScript?.id, activeTeacherScript?.updatedAt]);

  const activeGate = gates[activeGateIndex];

  // Handle answering gate
  const handleSelectOption = (gateId: number, selectedAnswer: number) => {
    if (isWalking) return;
    const gate = gates.find(g => g.id === gateId);
    if (!gate || gate.solved) return;

    const isCorrect = selectedAnswer === gate.correctAnswer;
    recordQuestionAnswered(isCorrect);

    if (mocBatDauRef.current === null) {
      mocBatDauRef.current = performance.now();
      baoBatDauVan('phieu-me-cung');
    }
    traLoiRef.current.push({
      c: gateId,
      a: selectedAnswer,
      ok: isCorrect,
      t: Math.round(performance.now() - mocBatDauRef.current)
    });

    if (isCorrect) {
      // 🌸 TUNG HOA VỖ TAY 👏
      soundManager.playCorrect();
      soundManager.playApplause();
      triggerFlowerCelebration(gate.x, gate.y);

      setGates(prev =>
        prev.map(g => (g.id === gateId ? { ...g, solved: true } : g))
      );
      setCharacterThought(`🌸 Đúng rồi! 👏`);

      const currentLegIndex = activeGateIndex + 1;

      if (currentLegIndex < corridorLegs.length - 1) {
        setTimeout(() => {
          walkAlongPoints(corridorLegs[currentLegIndex], () => {
            const nextIdx = activeGateIndex + 1;
            setActiveGateIndex(nextIdx);
            setCharacterThought('🐾 Tiếp tục thôi!');
          });
        }, 850);
      } else {
        // Final Gate Solved -> Walk smoothly to FINISH!
        setTimeout(() => {
          walkAlongPoints(corridorLegs[corridorLegs.length - 1], () => {
            setIsCompleted(true);
            soundManager.playVictory();
            soundManager.playApplause();
            addCoinsAndGems(200, 15);
            if (!daDungBotRef.current) {
              baoKetThucVan('phieu-me-cung', {
                chuDe: activeTeacherScript ? `kich-ban:${activeTeacherScript.id}` : worksheetTopic,
                cong: gates.map(g => ({ c: g.id, dapAn: g.correctAnswer })),
                traLoi: traLoiRef.current
              });
            }
            setCharacterThought('Hoan hô! Về đích rồi! 🏆');
            try {
              confetti({
                particleCount: 180,
                spread: 100,
                origin: { y: 0.6 }
              });
            } catch {
              // ignore
            }
          });
        }, 850);
      }
    } else {
      // 🔨 GÕ VÀO ĐẦU NHÂN VẬT 😵
      soundManager.playWrong();
      soundManager.playBonk();
      setWrongShake(selectedAnswer);
      setBonkActive(true);
      setCharacterThought('Ui da! 😵 Tính lại nhé!');

      setTimeout(() => {
        setWrongShake(null);
        setBonkActive(false);
      }, 1000);
    }
  };

  // Bot Auto Play Handler
  useEffect(() => {
    if (!isAutoPlaying || isCompleted || isWalking) return;

    autoPlayTimerRef.current = window.setTimeout(() => {
      if (activeGateIndex < gates.length && !gates[activeGateIndex].solved) {
        const curGate = gates[activeGateIndex];
        setCharacterThought(`🤔 Đang tính...`);

        setTimeout(() => {
          handleSelectOption(curGate.id, curGate.correctAnswer);
        }, 1400);
      }
    }, 1200);

    return () => {
      if (autoPlayTimerRef.current) window.clearTimeout(autoPlayTimerRef.current);
    };
  }, [isAutoPlaying, activeGateIndex, gates, isCompleted, isWalking]);

  const handleReset = () => {
    soundManager.playClick();
    setTypedAnswer('');
    if (moveIntervalRef.current) window.clearInterval(moveIntervalRef.current);
    if (autoPlayTimerRef.current) window.clearTimeout(autoPlayTimerRef.current);

    const { gates: newGates, corridorLegs: newLegs } = generateDynamicGatesAndLegs(
      worksheetTopic,
      currentMap,
      activeTeacherScript
    );
    setGates(newGates);
    datLaiNhatKy();
    setCorridorLegs(newLegs);
    setActiveGateIndex(0);
    setCharacterPos(currentMap.startPoint);
    setVisitedPoints([currentMap.startPoint]);
    setIsCompleted(false);
    setIsAutoPlaying(false);
    setCharacterThought('Xuất phát lại nào!');

    setTimeout(() => {
      if (newLegs[0]) {
        walkAlongPoints(newLegs[0], () => {
          setCharacterThought('💭 Cố lên nhé!');
        });
      }
    }, 350);
  };

  const handleTypedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isWalking || !activeGate) return;
    const num = parseInt(typedAnswer.trim(), 10);
    if (isNaN(num)) return;
    handleSelectOption(activeGate.id, num);
    setTypedAnswer('');
  };

  const handleShuffleNewQuestions = () => {
    soundManager.playClick();
    handleReset();
  };

  const handlePrint = () => {
    soundManager.playClick();
    setShowPrintModal(true);
  };

  return (
    <div className={`mx-auto select-none ${gon ? 'max-w-6xl p-2 space-y-2' : 'max-w-4xl p-2 sm:p-4 space-y-3'}`}>
      {/* 🎓 Active Teacher Script Banner */}
      {activeTeacherScript && (
        <div className="no-print bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 text-white p-3.5 sm:p-4 rounded-3xl shadow-lg border-3 border-amber-300 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-2xl">
              <GraduationCap className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-purple-200">
                Đang phát kịch bản giáo viên ({activeTeacherScript.grade ? `Lớp ${activeTeacherScript.grade}` : 'Đề Tùy Chọn'})
              </div>
              <div className="font-fredoka font-black text-sm sm:text-base text-white">
                {activeTeacherScript.title} ({activeTeacherScript.questions.length} câu hỏi)
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                soundManager.playClick();
                stopTeacherScript();
              }}
              className="text-xs bg-white/20 hover:bg-white/30 text-white font-fredoka font-bold px-3 py-1.5 rounded-xl border border-white/30 cursor-pointer active:scale-95"
            >
              Dừng Kịch Bản
            </button>
            <button
              onClick={() => {
                soundManager.playClick();
                setCurrentMode('teacher_studio');
              }}
              className="text-xs game-btn-gold text-slate-950 font-fredoka font-black px-3.5 py-1.5 rounded-xl shadow-xs cursor-pointer active:scale-95"
            >
              Vào Studio 🎓
            </button>
          </div>
        </div>
      )}

      {/* Main Worksheet Maze Frame (Elevated right to the top for immediate gameplay) */}
      <div
        className={`no-print bg-white rounded-3xl shadow-2xl border-4 border-slate-900 relative overflow-hidden flex flex-col items-center ${
          gon
            ? 'p-2 sm:p-3 lg:grid lg:grid-cols-[var(--rong-ban-do)_minmax(0,1fr)] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-4 lg:items-start'
            : 'p-3 sm:p-5'
        }`}
        // Bản đồ 400:480 ⇒ rộng = cao × 5/6; cao = khung trừ header + đệm.
        style={gon ? ({ '--rong-ban-do': 'calc((100dvh - 170px) * 5 / 6)' } as React.CSSProperties) : undefined}
      >
        
        {/* In-Frame Top Action Ribbon */}
        <div className={`w-full flex flex-wrap items-center justify-between gap-2 pb-3 mb-2.5 border-b-3 border-slate-200 ${cotPhai}`}>
          {/* Left: Map Selector Trigger Button + Speed Pill + Answer Mode Selector */}
          <div className="flex items-center flex-wrap gap-2">
            <button
              id="btn-open-map-modal"
              onClick={() => {
                soundManager.playClick();
                setShowMapModal(true);
              }}
              className="game-btn-gold px-3 py-1.5 rounded-2xl font-fredoka font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Nhấn để đổi bản đồ mê cung"
            >
              <span className="text-base sm:text-lg">{currentMap.icon}</span>
              <span className="truncate max-w-[120px] sm:max-w-none">{currentMap.name}</span>
              <span className="bg-amber-950/20 text-amber-950 text-[10px] px-1.5 py-0.5 rounded-md font-bold flex items-center gap-0.5">
                Đổi <ChevronDown className="w-3 h-3" />
              </span>
            </button>

            {/* Answer Mode Selector (Chọn đáp án / Điền đáp số) */}
            <div className="flex items-center gap-1 text-xs font-fredoka bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-xs">
              <button
                id="btn-mode-choice"
                onClick={() => {
                  soundManager.playClick();
                  setAnswerMode('choice');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  answerMode === 'choice'
                    ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="Chế độ chọn đáp án (Trắc nghiệm)"
              >
                <span>🔘</span>
                <span>Chọn đáp án</span>
              </button>
              <button
                id="btn-mode-input"
                onClick={() => {
                  soundManager.playClick();
                  setAnswerMode('input');
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-black transition-all cursor-pointer ${
                  answerMode === 'input'
                    ? 'bg-amber-400 text-amber-950 shadow-sm ring-2 ring-amber-300'
                    : 'text-slate-600 hover:bg-slate-200'
                }`}
                title="Chế độ điền đáp số (Tự luận)"
              >
                <span>✍️</span>
                <span>Điền đáp số</span>
              </button>
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 text-xs font-fredoka bg-slate-100 px-2 py-1 rounded-xl border border-slate-200">
              <Gauge className="w-3.5 h-3.5 text-indigo-600" />
              {[
                { id: 'slow', label: '🐢 Chậm' },
                { id: 'normal', label: '🚶 Vừa' },
                { id: 'fast', label: '⚡ Nhanh' }
              ].map(spd => (
                <button
                  key={spd.id}
                  onClick={() => setWalkSpeed(spd.id as any)}
                  className={`px-1.5 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-black transition-all cursor-pointer ${
                    walkSpeed === spd.id
                      ? 'bg-amber-400 text-amber-950 shadow-xs'
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {spd.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Embedded Action Buttons directly in game frame */}
          <div className="flex items-center gap-1.5 sm:gap-2 font-fredoka">
            {/* Auto Run Bot Toggle */}
            <button
              id="btn-toggle-bot-autoplay"
              onClick={() => {
                soundManager.playClick();
                setIsAutoPlaying(prev => !prev);
                if (!isAutoPlaying) {
                  daDungBotRef.current = true;
                  setCharacterThought('Tớ sẽ tự động giải và vượt mê cung!');
                }
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs shadow-md transition-all active:scale-95 border-2 cursor-pointer ${
                isAutoPlaying
                  ? 'bg-amber-400 border-amber-600 text-amber-950 animate-pulse-subtle'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white border-indigo-800'
              }`}
              title="Tự động giải và di chuyển"
            >
              {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              <span>{isAutoPlaying ? 'Tạm Dừng' : '🤖 Tự Đi'}</span>
            </button>

            {/* New Random Sheet */}
            <button
              id="btn-shuffle-worksheet"
              onClick={handleShuffleNewQuestions}
              className="game-btn-green flex items-center gap-1 px-3 py-1.5 rounded-xl font-black text-xs cursor-pointer shadow-md"
              title="Đổi bộ số ngẫu nhiên mới"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Đổi Số</span>
            </button>

            {/* Print */}
            <button
              id="btn-print-worksheet"
              onClick={handlePrint}
              className="flex items-center gap-1 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs px-2.5 py-1.5 rounded-xl shadow-md transition-all cursor-pointer"
              title="In phiếu bài tập"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">In</span>
            </button>

            {/* Reset */}
            <button
              id="btn-reset-worksheet"
              onClick={handleReset}
              className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors border border-slate-300 cursor-pointer"
              title="Làm lại từ đầu"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Math Topic Selector Bar inside Game Frame */}
        <div className={`w-full flex items-center justify-between flex-wrap gap-2 pb-2.5 mb-2.5 border-b border-slate-100 ${cotPhai}`}>
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'word_problem', label: '📜 Toán Lời Văn' },
              { id: 'comparison', label: '⚖️ So Sánh Số' },
              { id: 'pred_succ', label: '🔢 Liền Trước/Sau' },
              { id: 'measurement', label: '📏 Đơn Vị Đo' },
              { id: 'add_20', label: '➕ Cộng ≤ 20' },
              { id: 'sub_20', label: '➖ Trừ ≤ 20' },
              { id: 'mult_table', label: '✖️ Bảng Nhân' },
              { id: 'find_x', label: '🔍 Tìm X' },
              { id: 'mixed_math', label: '🎲 Hỗn Hợp' }
            ].map(t => (
              <button
                key={t.id}
                id={`topic-btn-${t.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setWorksheetTopic(t.id as any);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-fredoka font-black transition-all whitespace-nowrap cursor-pointer border-2 ${
                  worksheetTopic === t.id
                    ? 'bg-gradient-to-r from-amber-400 to-yellow-400 border-amber-600 text-amber-950 shadow-xs scale-102'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-amber-50 hover:border-amber-300'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 font-fredoka font-black text-sm sm:text-base text-slate-900 uppercase">
            <span>ĐÍCH 🏆</span>
            <ArrowUp className="w-4 h-4 animate-bounce text-indigo-600" />
          </div>
        </div>

        {/* Maze Graphic Canvas with Pure White Background & No Intersecting Lines */}
        <div
          className={`w-full max-w-2xl relative aspect-[400/480] bg-white border-4 border-slate-900 rounded-2xl overflow-hidden shadow-inner select-none ${
            gon ? 'lg:col-start-1 lg:row-start-1 lg:row-span-4' : ''
          }`}
          style={gon ? { maxWidth: 'min(42rem, var(--rong-ban-do))' } : undefined}
        >
          
          {/* Maze Wall Background SVG */}
          <svg className="absolute inset-0 w-full h-full bg-white" viewBox={currentMap.viewBox} fill="none">
            {/* Template dynamic walls */}
            {currentMap.svgWalls}

            {/* Subtle Corridor Center Track Guide (Soft dashed hint) */}
            <polyline
              points={currentMap.guidePath}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={currentMap.guidePath}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
              strokeDasharray="4 6"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.7"
            />

            {/* Glowing Neon Blue Footpath Trail of Visited Waypoints */}
            {visitedPoints.length > 1 && (
              <polyline
                points={visitedPoints.map(p => `${p.x},${p.y}`).join(' ')}
                fill="none"
                stroke="#0284c7"
                strokeWidth="7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="5 5"
                opacity="0.9"
              />
            )}
          </svg>

          {/* Interactive Gate Nodes Placed Accurately Across the Open Corridor */}
          {gates.map((gate, index) => {
            const isCurrent = activeGateIndex === index && !gate.solved;
            return (
              <div
                key={gate.id}
                id={`worksheet-gate-${gate.id}`}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-auto ${
                  isCurrent ? 'z-30' : 'z-20'
                }`}
                style={{
                  left: `${toPercentX(gate.x)}%`,
                  top: `${toPercentY(gate.y)}%`
                }}
              >
                {/* 1. ACTIVE GATE INTERACTIVE CARD DIRECTLY ON MAZE */}
                {isCurrent && (
                  <div
                    className={`absolute z-40 bg-gradient-to-b from-white to-amber-50/95 border-3 border-amber-500 rounded-2xl p-2 sm:p-2.5 shadow-2xl backdrop-blur-xs flex flex-col items-center max-w-[230px] sm:max-w-[280px] min-w-[190px] animate-in zoom-in-95 duration-150 ${
                      gate.y < 120 ? 'top-full mt-2' : 'bottom-full mb-2'
                    } ${
                      gate.x < 120
                        ? 'left-0 transform-none'
                        : gate.x > 280
                        ? 'right-0 transform-none'
                        : 'left-1/2 -translate-x-1/2'
                    }`}
                  >
                    {/* Story Text / Question Prompt */}
                    <div className="w-full text-center">
                      <div className="inline-flex items-center gap-1 bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-md mb-1 shadow-2xs uppercase">
                        <span>ẢI SỐ {index + 1}</span>
                      </div>
                      <p className="font-fredoka font-black text-[11px] sm:text-xs text-slate-900 leading-snug text-center">
                        {gate.storyText || `${gate.question} = ?`}
                      </p>
                    </div>

                    {/* Mode-Specific Interaction directly on Gate */}
                    {answerMode === 'choice' ? (
                      /* Choice Mode: Click option buttons right on the gate */
                      <div className="flex items-center justify-center gap-1.5 mt-2 w-full">
                        {gate.options.map(opt => (
                          <button
                            key={`maze-choice-${opt}`}
                            id={`btn-maze-door-${gate.id}-${opt}`}
                            disabled={isWalking}
                            onClick={() => handleSelectOption(gate.id, opt)}
                            className={`min-w-[36px] sm:min-w-[42px] px-2.5 py-1 rounded-xl font-fredoka font-black text-xs sm:text-sm flex items-center justify-center border-2 transition-all shadow-md cursor-pointer ${
                              wrongShake === opt
                                ? 'bg-rose-500 border-rose-700 text-white animate-wiggle'
                                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white border-indigo-950 hover:scale-105 active:scale-95'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      /* Input Mode: Type number directly into gate card */
                      <form
                        onSubmit={handleTypedSubmit}
                        className="flex items-center justify-center gap-1 mt-2 w-full"
                      >
                        <input
                          id="input-maze-gate-answer"
                          type="number"
                          inputMode="numeric"
                          value={typedAnswer}
                          onChange={e => setTypedAnswer(e.target.value)}
                          placeholder="Đáp số..."
                          disabled={isWalking}
                          autoFocus
                          className="w-20 sm:w-24 px-2 py-1 bg-white border-2 border-amber-400 rounded-xl font-fredoka font-black text-xs sm:text-sm text-slate-900 text-center placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                        />
                        <button
                          type="submit"
                          id="btn-maze-submit-typed"
                          disabled={isWalking || !typedAnswer.trim()}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-fredoka font-black text-xs rounded-xl shadow-md border-b-2 border-emerald-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-0.5"
                        >
                          <span>Mở</span>
                          <span>↵</span>
                        </button>
                      </form>
                    )}

                    {/* Speech Bubble Arrow Pointer */}
                    <div
                      className={`absolute w-3 h-3 bg-amber-50 border-r-2 border-b-2 border-amber-500 transform rotate-45 ${
                        gate.y < 120
                          ? '-top-1.5 border-r-0 border-b-0 border-l-2 border-t-2'
                          : '-bottom-1.5'
                      } ${
                        gate.x < 120
                          ? 'left-6'
                          : gate.x > 280
                          ? 'right-6'
                          : 'left-1/2 -translate-x-1/2'
                      }`}
                    />
                  </div>
                )}

                {/* 2. GATE NODE PIN / ARCHWAY */}
                <div
                  className={`px-1.5 py-0.5 sm:px-2 sm:py-0.5 rounded-lg font-fredoka font-black text-[10px] sm:text-xs border shadow-xs transition-all flex items-center justify-center gap-1 whitespace-nowrap max-w-[95px] sm:max-w-[110px] ${
                    gate.solved
                      ? 'bg-emerald-100 border-emerald-500 text-emerald-900 ring-1 ring-emerald-300'
                      : isCurrent
                      ? 'bg-amber-300 border-amber-600 text-slate-950 scale-105 ring-2 ring-amber-400 z-30 shadow-md animate-pulse-subtle'
                      : 'bg-white/95 border-slate-700 text-slate-900 opacity-90'
                  }`}
                >
                  <span className="truncate">{gate.question}</span>
                  {gate.solved ? (
                    <span className="text-emerald-700 font-black shrink-0"> {gate.correctAnswer} ✓</span>
                  ) : (
                    <span className="text-amber-800 font-bold shrink-0">?</span>
                  )}
                </div>

                {/* Non-Active Unsolved Gates Mini Choices Hint (if choice mode) */}
                {!gate.solved && !isCurrent && answerMode === 'choice' && (
                  <div className="flex gap-0.5 sm:gap-1 mt-0.5 opacity-75">
                    {gate.options.map(opt => (
                      <span
                        key={opt}
                        className="w-4 h-4 sm:w-5 sm:h-5 rounded-md font-fredoka font-black text-[9px] sm:text-[10px] flex items-center justify-center border bg-slate-100 text-slate-700 border-slate-300"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* START Indicator at bottom */}
          <div
            className="absolute transform -translate-x-1/2 flex flex-col items-center font-fredoka font-black text-slate-950 pointer-events-none"
            style={{
              left: `${toPercentX(currentMap.startLabelPos.x)}%`,
              top: `${toPercentY(currentMap.startLabelPos.y)}%`
            }}
          >
            <ArrowUp className="w-4 h-4 animate-bounce text-emerald-600" />
            <span className="text-[10px] sm:text-xs uppercase tracking-wider bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full border border-emerald-400">
              START 🚩
            </span>
          </div>

          {/* FINISH Indicator Badge */}
          <div
            className="absolute transform -translate-x-1/2 flex items-center gap-1 font-fredoka font-black text-slate-950 pointer-events-none"
            style={{
              left: `${toPercentX(currentMap.finishLabelPos.x)}%`,
              top: `${toPercentY(currentMap.finishLabelPos.y)}%`
            }}
          >
            <span className="text-[10px] sm:text-xs uppercase tracking-wider bg-amber-200 text-amber-950 px-2 py-0.5 rounded-full border border-amber-500 shadow-sm animate-pulse">
              FINISH 🏆
            </span>
          </div>

          {/* Animated Flower Burst Particles on Correct Answer */}
          {flowers.map(flower => (
            <div
              key={flower.id}
              className="absolute pointer-events-none text-xl sm:text-2xl animate-fade-out z-50 transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${toPercentX(flower.x + flower.vx)}%`,
                top: `${toPercentY(flower.y + flower.vy)}%`,
                transform: `rotate(${flower.rotation}deg)`
              }}
            >
              {flower.emoji}
            </div>
          ))}

          {/* Floating Applause & Cheer Banner */}
          {showApplauseBanner && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-500 text-white font-fredoka font-black text-lg sm:text-2xl px-6 py-2.5 rounded-full shadow-2xl border-4 border-white animate-bounce flex items-center gap-2 pointer-events-none">
              <span>🌸</span>
              <span>TUNG HOA! 👏 VỖ TAY HOAN HÔ!</span>
              <span>🎉</span>
            </div>
          )}

          {/* Animated Walking Character Sprite (Slow leisurely step-by-step transition) */}
          <div
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none flex flex-col items-center ${
              isWalking ? 'transition-all duration-500 ease-in-out' : 'transition-all duration-300 ease-out'
            }`}
            style={{
              left: `${toPercentX(characterPos.x)}%`,
              top: `${toPercentY(characterPos.y)}%`
            }}
          >
            {/* Cartoon Hammer Bonking on Head Animation (when answer is wrong) */}
            {bonkActive && (
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-50 flex flex-col items-center animate-bounce">
                <span className="text-3xl filter drop-shadow-md animate-spin-slow">🔨</span>
                <span className="text-xs font-black text-rose-600 bg-white/95 px-2 py-0.5 rounded-full border-2 border-rose-500 shadow-md">
                  BONK! 💥
                </span>
                <span className="text-xs text-amber-500 animate-pulse font-bold">💫 😵 💫</span>
              </div>
            )}

            {/* Small subtle thought bubble placed high above character */}
            {!bonkActive && characterThought && (
              <div className="mb-0.5 bg-slate-900/90 text-white border border-amber-300 shadow-md px-2 py-0.5 rounded-full text-[10px] font-fredoka font-bold whitespace-nowrap">
                {characterThought}
              </div>
            )}

            {/* Avatar display with walking bobbing animation or bonked squash */}
            <div
              className={`scale-100 sm:scale-110 drop-shadow-md transition-transform duration-150 ${
                bonkActive
                  ? 'scale-y-75 scale-x-110 rotate-6'
                  : isWalking
                  ? 'animate-bounce'
                  : 'animate-float'
              }`}
            >
              <AvatarDisplay
                customization={profile.customization}
                size="sm"
                showPet={true}
                animate={true}
              />
            </div>
          </div>

        </div>

        {/* Current Question Focus Banner (Dedicated area below maze - never overlaps the canvas!) */}
        {activeGate && !isCompleted && (
          <div className={`w-full mt-3 ${cotPhai} bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-3 border-amber-400 rounded-2xl p-3 sm:p-4.5 flex flex-col gap-3.5 shadow-md`}>
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-10 h-10 bg-amber-400 text-amber-950 rounded-2xl flex items-center justify-center text-lg font-black shadow-inner shrink-0 mt-0.5">
                #{activeGateIndex + 1}
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-xs font-fredoka font-bold text-amber-900 uppercase block">
                  {isWalking ? '🐾 Nhân vật đang bước tới...' : `Cửa Ải Số ${activeGateIndex + 1}/${gates.length}`}
                </span>
                <div className="font-fredoka font-black text-base sm:text-xl text-slate-950 leading-relaxed break-words">
                  {activeGate.storyText || `${activeGate.question} ?`}
                </div>
              </div>
            </div>

            {/* Answer Input & Fast Choices Row */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2.5 border-t-2 border-amber-200/80">
              {/* Option A: Direct Numerical Typing */}
              <form onSubmit={handleTypedSubmit} className="flex items-center gap-2">
                <span className="text-xs font-fredoka font-bold text-slate-700 hidden sm:inline">
                  Nhập kết quả:
                </span>
                <input
                  id="input-typed-answer"
                  type="number"
                  inputMode="numeric"
                  value={typedAnswer}
                  onChange={e => setTypedAnswer(e.target.value)}
                  placeholder="Điền đáp số..."
                  disabled={isWalking}
                  className="w-32 sm:w-36 px-3 py-1.5 bg-white border-2 border-amber-400 rounded-xl font-fredoka font-black text-base sm:text-lg text-slate-900 text-center placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
                />
                <button
                  type="submit"
                  id="btn-submit-typed-answer"
                  disabled={isWalking || !typedAnswer.trim()}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-fredoka font-black text-sm sm:text-base rounded-xl shadow-md border-b-2 border-emerald-900 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1"
                >
                  <span>Mở Cửa</span>
                  <span>🚀</span>
                </button>
              </form>

              {/* Option B: Fast Multiple Choice Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-fredoka font-bold text-slate-600">
                  Hoặc chọn nhanh:
                </span>
                <div className="flex gap-1.5 sm:gap-2">
                  {activeGate.options.map(opt => (
                    <button
                      key={`banner-${opt}`}
                      id={`btn-bottom-door-${opt}`}
                      disabled={isWalking}
                      onClick={() => handleSelectOption(activeGate.id, opt)}
                      className="min-w-[42px] sm:min-w-[48px] px-3 py-1.5 bg-gradient-to-b from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white font-fredoka font-black text-base sm:text-lg rounded-xl shadow-md border-b-2 border-indigo-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Victory Celebration Box */}
        {isCompleted && (
          <div className={`w-full mt-3 ${cotPhai} bg-gradient-to-r from-emerald-100 to-teal-100 border-3 border-emerald-500 rounded-3xl p-5 text-center font-fredoka shadow-lg animate-in zoom-in`}>
            <div className="text-4xl mb-2 animate-bounce">🏆 🌟 🎁</div>
            <h3 className="font-black text-xl sm:text-2xl text-emerald-950 mb-1">
              CHÚC MỪNG EM ĐÃ ĐƯA NHÂN VẬT VỀ ĐÍCH THÀNH CÔNG!
            </h3>
            <p className="text-xs sm:text-sm text-emerald-800 font-semibold mb-3">
              Nhân vật đã chạy qua toàn bộ {gates.length} cửa ải theo đúng hành lang của bản đồ "{currentMap.name}" và nhận thưởng +200 Xu 🪙 & +15 Kim Cương 💎!
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleReset}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Chơi Lại Mê Cung Này 🔄
              </button>
              <button
                onClick={handleShuffleNewQuestions}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-amber-950 rounded-2xl font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95"
              >
                Đổi Đề Bài Mới 🎲
              </button>
            </div>
          </div>
        )}

      </div>

      {/* 🗺️ MAP SELECTION MODAL POPUP */}
      {showMapModal && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl border-4 border-amber-500 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">🗺️</span>
                <div>
                  <h3 className="font-fredoka font-black text-lg sm:text-xl text-slate-900">
                    CHỌN BẢN ĐỒ MÊ CUNG
                  </h3>
                  <p className="text-xs font-bold text-slate-500">
                    Chọn 1 trong 4 mẫu bản đồ để chuyển màn chơi ngay lập tức
                  </p>
                </div>
              </div>

              <button
                id="btn-close-map-modal"
                onClick={() => {
                  soundManager.playClick();
                  setShowMapModal(false);
                }}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors"
                title="Đóng bảng chọn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 4 Maps Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-fredoka">
              {MAZE_MAPS.map((map, idx) => {
                const isSelected = selectedMapId === map.id;
                return (
                  <button
                    key={map.id}
                    id={`map-select-${map.id}`}
                    onClick={() => {
                      soundManager.playClick();
                      setSelectedMapId(map.id);
                      setShowMapModal(false);
                    }}
                    className={`group relative p-3 sm:p-3.5 rounded-2xl text-left transition-all border-3 flex flex-col justify-between cursor-pointer active:scale-98 ${
                      isSelected
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 text-slate-900 border-amber-500 shadow-xl ring-4 ring-amber-300'
                        : 'bg-white hover:bg-amber-50/50 border-slate-300 hover:border-amber-400 shadow-md'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider ${
                            isSelected
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          Bản Đồ {idx + 1}
                        </span>
                        <span className="text-2xl drop-shadow-xs group-hover:scale-110 transition-transform">
                          {map.icon}
                        </span>
                      </div>

                      {/* Mini Schematic Thumbnail of the Maze Path */}
                      <div
                        className={`w-full h-16 sm:h-20 rounded-xl mb-2 flex items-center justify-center p-2 border-2 overflow-hidden ${
                          isSelected
                            ? 'bg-white border-amber-300'
                            : 'bg-slate-50 border-slate-200'
                        }`}
                      >
                        <svg viewBox="0 0 100 80" className="w-full h-full" fill="none">
                          {idx === 0 && (
                            <>
                              <path
                                d="M 15 70 H 85 V 55 H 15 V 40 H 85 V 25 H 15 V 10 H 85"
                                stroke="#f59e0b"
                                strokeWidth="6"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="15" cy="70" r="4" fill="#10b981" />
                              <circle cx="85" cy="10" r="4" fill="#ef4444" />
                            </>
                          )}
                          {idx === 1 && (
                            <>
                              <path
                                d="M 10 70 V 10 H 26 V 70 H 42 V 10 H 58 V 70 H 74 V 10 H 90"
                                stroke="#0ea5e9"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="10" cy="70" r="4" fill="#10b981" />
                              <circle cx="90" cy="10" r="4" fill="#ef4444" />
                            </>
                          )}
                          {idx === 2 && (
                            <>
                              <path
                                d="M 15 70 H 85 V 15 H 25 V 60 H 75 V 25 H 35 V 50 H 65 V 35 H 45"
                                stroke="#a855f7"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="15" cy="70" r="4" fill="#10b981" />
                              <circle cx="45" cy="35" r="4" fill="#ef4444" />
                            </>
                          )}
                          {idx === 3 && (
                            <>
                              <path
                                d="M 15 70 H 85 V 55 H 25 V 40 H 75 V 25 H 35 V 10 H 50"
                                stroke="#ec4899"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <circle cx="15" cy="70" r="4" fill="#10b981" />
                              <circle cx="50" cy="10" r="4" fill="#ef4444" />
                            </>
                          )}
                        </svg>
                      </div>

                      <h4 className="font-black text-sm leading-tight text-slate-900 mb-0.5">
                        {map.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-semibold line-clamp-1 mb-2.5">
                        {map.description}
                      </p>
                    </div>

                    <div className="w-full">
                      {isSelected ? (
                        <div className="w-full py-1.5 bg-emerald-500 text-white rounded-xl text-center font-black text-xs shadow-md border-b-2 border-emerald-700 flex items-center justify-center gap-1.5">
                          <span>ĐANG CHƠI ✓</span>
                        </div>
                      ) : (
                        <div className="w-full py-1.5 game-btn-gold text-amber-950 rounded-xl text-center font-black text-xs shadow-sm">
                          ▶ CHỌN MÀN NÀY
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 🖨️ A4 PRINTABLE WORKSHEET PREVIEW & PRINT MODAL */}
      <PrintableWorksheetModal
        isOpen={showPrintModal}
        onClose={() => setShowPrintModal(false)}
        map={currentMap}
        gates={gates}
        topicTitle={
          worksheetTopic === 'word_problem'
            ? 'Toán Lời Văn Thực Tế'
            : worksheetTopic === 'comparison'
            ? 'So Sánh Số & Thứ Tự'
            : worksheetTopic === 'pred_succ'
            ? 'Số Liền Trước & Liền Sau'
            : worksheetTopic === 'measurement'
            ? 'Đơn Vị Đo Lường (cm, dm, kg, l)'
            : worksheetTopic === 'add_20'
            ? 'Phép Cộng Trong Phạm Vi 20'
            : worksheetTopic === 'sub_20'
            ? 'Phép Trừ Trong Phạm Vi 20'
            : worksheetTopic === 'mult_table'
            ? 'Bảng Nhân 2 Đến 9'
            : worksheetTopic === 'find_x'
            ? 'Tìm Thành Phần Chưa Biết (Tìm X)'
            : 'Toán Học Hỗn Hợp'
        }
        grade={profile.grade}
        activeTeacherScript={activeTeacherScript}
      />
    </div>
  );
};
