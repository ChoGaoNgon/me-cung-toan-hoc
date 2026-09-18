import React from 'react';
import { ArrowLeft, Gamepad2 } from 'lucide-react';

/**
 * Thanh quay về kho trò chơi CenStu — CHỈ hiện khi game chạy độc lập (ở trong portal thì portal đã
 * có thanh công cụ riêng). Đặt NGOÀI `<header>` sticky để không chiếm chỗ khi cuộn.
 *
 * `target="_top"`: mặc định `_self` sẽ nạp trang đích vào trong khung game.
 */
export const ThanhVeKhoTroChoi: React.FC = () => (
  <div className="bg-amber-950 text-amber-100 px-2 sm:px-4 py-1 text-xs">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
      <a
        id="btn-back-to-censtu-store"
        href="https://game.censtu.com"
        target="_top"
        className="flex items-center gap-1.5 hover:text-white font-fredoka font-bold transition-colors group"
        title="Quay lại kho trò chơi tại game.censtu.com"
      >
        <ArrowLeft className="w-3.5 h-3.5 text-amber-300 group-hover:-translate-x-0.5 transition-transform" />
        <Gamepad2 className="w-3.5 h-3.5 text-yellow-300" />
        <span>Kho trò chơi CenStu</span>
      </a>
      <a href="https://censtu.com" target="_top" className="font-bold text-amber-200 hover:text-white">
        censtu.com
      </a>
    </div>
  </div>
);
