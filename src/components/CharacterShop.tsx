import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { SHOP_ITEMS } from '../data/shopData';
import { CosmeticItem } from '../types';
import { AvatarDisplay } from './AvatarDisplay';
import { soundManager } from '../utils/audio';
import { Coins, Sparkles, Check, Crown, Flame, Trophy, X } from 'lucide-react';

export const CharacterShop: React.FC = () => {
  const {
    profile,
    unlockItem,
    equipItem
  } = useGame();

  const [activeCategory, setActiveCategory] = useState<CosmeticItem['category']>('avatar');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');
  const [previewCustomization, setPreviewCustomization] = useState(profile.customization);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [celebrationItem, setCelebrationItem] = useState<CosmeticItem | null>(null);

  const categories: { id: CosmeticItem['category']; label: string; icon: string }[] = [
    { id: 'avatar', label: 'Nhân Vật', icon: '🐱' },
    { id: 'hat', label: 'Mũ & Vương Miện', icon: '👑' },
    { id: 'accessory', label: 'Vũ Khí & Phụ Kiện', icon: '⚔️' },
    { id: 'pet', label: 'Thú Cưng Đồng Hành', icon: '🐾' },
    { id: 'trail', label: 'Hiệu Ứng Vệt Chân', icon: '✨' }
  ];

  const rarityFilters = [
    { id: 'all', label: 'Tất Cả', icon: '🌈' },
    { id: 'mythic', label: '🌟 Thần Thoại', icon: '🌟' },
    { id: 'legendary', label: '👑 Huyền Thoại', icon: '👑' },
    { id: 'epic', label: '🔮 Sử Thi', icon: '🔮' },
    { id: 'rare', label: '💎 Hiếm', icon: '💎' },
    { id: 'common', label: '✨ Phổ Thông', icon: '✨' }
  ];

  const filteredItems = SHOP_ITEMS.filter(i => {
    if (i.category !== activeCategory) return false;
    if (selectedRarity !== 'all' && i.rarity !== selectedRarity) return false;
    return true;
  });

  const handlePreview = (item: CosmeticItem) => {
    soundManager.playClick();
    const keyMap: Record<string, keyof typeof previewCustomization> = {
      avatar: 'avatarId',
      hat: 'hatId',
      accessory: 'accessoryId',
      pet: 'petId',
      trail: 'trailId'
    };
    const key = keyMap[item.category];
    setPreviewCustomization(prev => ({ ...prev, [key]: item.id }));
  };

  const handleEquip = (item: CosmeticItem) => {
    soundManager.playClick();
    equipItem(item.category, item.id);
    const keyMap: Record<string, keyof typeof previewCustomization> = {
      avatar: 'avatarId',
      hat: 'hatId',
      accessory: 'accessoryId',
      pet: 'petId',
      trail: 'trailId'
    };
    const key = keyMap[item.category];
    setPreviewCustomization(prev => ({ ...prev, [key]: item.id }));
  };

  const handleBuy = (item: CosmeticItem) => {
    const success = unlockItem(item.id, item.price, item.currency);
    if (success) {
      soundManager.playCorrect();
      equipItem(item.category, item.id);
      setPurchaseError(null);
      if (item.rarity === 'mythic' || item.rarity === 'legendary') {
        soundManager.playVictory();
        setCelebrationItem(item);
      }
    } else {
      soundManager.playWrong();
      setPurchaseError(
        item.currency === 'coins'
          ? `Em còn thiếu ${(item.price - profile.coins).toLocaleString()} Xu! Hãy giải thêm nhiều mê cung để tích lũy nhé!`
          : `Em còn thiếu ${item.price - profile.gems} Kim Cương! Hãy hoàn thành nhiệm vụ và chuyên cần mỗi ngày nhé!`
      );
      setTimeout(() => setPurchaseError(null), 5000);
    }
  };

  // Preview item breakdown for display in mirror
  const currentAvatarItem = SHOP_ITEMS.find(i => i.id === previewCustomization.avatarId) || SHOP_ITEMS[0];

  return (
    <div className="max-w-6xl mx-auto p-2 sm:p-4 space-y-4 select-none">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-amber-800 rounded-3xl p-4 sm:p-6 text-white shadow-2xl border-4 border-amber-400 relative overflow-hidden flex flex-wrap items-center justify-between gap-4">
        {/* Background cosmic glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -top-10 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-fredoka font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
              <Crown className="w-3.5 h-3.5" /> Kho Báu Thời Trang & Thần Thoại
            </span>
            <span className="bg-purple-950/80 text-purple-200 border border-purple-400/40 font-fredoka font-bold text-xs px-2.5 py-0.5 rounded-full hidden sm:inline-flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-400" /> Cực Phẩm Đắt Giá
            </span>
          </div>

          <h1 className="font-fredoka font-black text-2xl sm:text-4xl tracking-wide bg-gradient-to-r from-amber-200 via-yellow-100 to-white bg-clip-text text-transparent">
            TIỆM TRANG BỊ & THẦN THÚ TOÁN HỌC
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-amber-100/90 max-w-xl mt-1">
            Giải mê cung và tính nhẩm chuẩn xác để tích lũy Xu & Kim Cương, chinh phục các vật phẩm <span className="text-yellow-300 font-bold">Thần Thoại Tối Thượng</span> danh giá nhất!
          </p>
        </div>

        {/* Player Currency Balance */}
        <div className="relative z-10 flex items-center gap-2.5">
          <div className="flex items-center gap-2 bg-amber-400/95 text-amber-950 px-4 py-2.5 rounded-2xl font-fredoka font-black text-base shadow-lg border-2 border-amber-300">
            <Coins className="w-5 h-5 text-amber-800 fill-amber-700" />
            <span>{profile.coins.toLocaleString()} Xu</span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 py-2.5 rounded-2xl font-fredoka font-black text-base shadow-lg border-2 border-purple-300">
            <Sparkles className="w-5 h-5 text-cyan-200 fill-cyan-300 animate-pulse" />
            <span>{profile.gems} KC</span>
          </div>
        </div>
      </div>

      {/* Main Shop Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left 1 Col: Dressing Room Avatar Mirror */}
        <div className="bg-white rounded-3xl p-5 shadow-xl border-4 border-amber-300 flex flex-col items-center text-center">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              🪞 Gương Thử Đồ Ma Thuật
            </span>
          </div>

          {/* Mirror Visual Frame */}
          <div className="my-3 py-6 px-8 bg-gradient-to-b from-indigo-900 via-slate-900 to-purple-950 rounded-3xl border-4 border-amber-300/80 flex flex-col items-center justify-center relative w-full shadow-2xl overflow-hidden">
            {/* Ambient stars */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff22_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 py-2">
              <AvatarDisplay customization={previewCustomization} size="xl" showTrail={true} animate={true} />
            </div>

            {/* Rarity tag of previewed avatar */}
            {currentAvatarItem.rarity && (
              <div className="relative z-10 mt-3">
                <span
                  className={`text-[11px] font-fredoka font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                    currentAvatarItem.rarity === 'mythic'
                      ? 'bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 text-white animate-pulse ring-2 ring-yellow-300'
                      : currentAvatarItem.rarity === 'legendary'
                      ? 'bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 ring-1 ring-amber-500'
                      : currentAvatarItem.rarity === 'epic'
                      ? 'bg-purple-600 text-purple-100'
                      : currentAvatarItem.rarity === 'rare'
                      ? 'bg-blue-600 text-blue-100'
                      : 'bg-slate-700 text-slate-200'
                  }`}
                >
                  {currentAvatarItem.rarity === 'mythic'
                    ? '🌟 THẦN THOẠI TỐI THƯỢNG'
                    : currentAvatarItem.rarity === 'legendary'
                    ? '👑 HUYỀN THOẠI'
                    : currentAvatarItem.rarity === 'epic'
                    ? '🔮 SỬ THI'
                    : currentAvatarItem.rarity === 'rare'
                    ? '💎 HIẾM'
                    : '✨ PHỔ THÔNG'}
                </span>
              </div>
            )}
          </div>

          <h3 className="font-fredoka font-black text-xl text-slate-800 mt-1">
            {profile.name}
          </h3>
          <p className="text-xs text-slate-500 font-bold mb-4">
            Lớp {profile.grade} • Hiệp Sĩ Mê Cung
          </p>

          {/* Quick Apply / Reset Preview Button */}
          <button
            onClick={() => {
              soundManager.playClick();
              setPreviewCustomization(profile.customization);
            }}
            className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-fredoka font-bold text-xs transition-colors border border-slate-300 cursor-pointer"
          >
            Khôi Phục Trang Phục Đang Mặc ↺
          </button>

          {/* Motivation Quote Box */}
          <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-200 text-left w-full">
            <div className="flex items-center gap-1.5 text-xs font-fredoka font-black text-amber-900 mb-1">
              <Trophy className="w-3.5 h-3.5 text-amber-600" />
              <span>Mục Tiêu Thần Thoại:</span>
            </div>
            <p className="text-[11px] text-amber-800 font-semibold leading-relaxed">
              Hãy nỗ lực giải đúng các cửa ải để kiếm thêm nhiều Xu và Kim Cương đổi lấy trang phục Tôn Ngộ Không, Thánh Kiếm Excalibur, và Rồng Thần Vũ Trụ!
            </p>
          </div>
        </div>

        {/* Right 2 Cols: Shop Items Grid with Category & Rarity Tabs */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-4 sm:p-5 shadow-xl border-4 border-amber-300 flex flex-col">
          
          {/* Main Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 border-b border-slate-100 scrollbar-none">
            {categories.map(cat => (
              <button
                key={cat.id}
                id={`shop-tab-${cat.id}`}
                onClick={() => {
                  soundManager.playClick();
                  setActiveCategory(cat.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-fredoka font-black text-xs sm:text-sm whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Rarity Sub-Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-3 border-b border-slate-100 scrollbar-none">
            <span className="text-[11px] font-fredoka font-bold text-slate-400 uppercase tracking-wide shrink-0 mr-1">
              Phẩm Cấp:
            </span>
            {rarityFilters.map(filter => (
              <button
                key={filter.id}
                onClick={() => {
                  soundManager.playClick();
                  setSelectedRarity(filter.id);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-fredoka font-black transition-all whitespace-nowrap cursor-pointer ${
                  selectedRarity === filter.id
                    ? filter.id === 'mythic'
                      ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600 text-white shadow-md ring-2 ring-amber-300'
                      : filter.id === 'legendary'
                      ? 'bg-amber-400 text-amber-950 shadow-md ring-2 ring-amber-500'
                      : filter.id === 'epic'
                      ? 'bg-purple-600 text-white shadow-md'
                      : filter.id === 'rare'
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-800 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Purchase Error Banner */}
          {purchaseError && (
            <div className="bg-rose-100 border-2 border-rose-400 text-rose-900 px-4 py-2.5 rounded-2xl font-fredoka font-black text-xs sm:text-sm mb-3 animate-in fade-in flex items-center gap-2">
              <span className="text-lg">⚠️</span>
              <span>{purchaseError}</span>
            </div>
          )}

          {/* Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[520px] p-1">
            {filteredItems.map(item => {
              const isUnlocked = profile.unlockedItems.includes(item.id) || item.unlockedByDefault;
              const isEquipped =
                profile.customization[
                  item.category === 'avatar'
                    ? 'avatarId'
                    : item.category === 'hat'
                    ? 'hatId'
                    : item.category === 'accessory'
                    ? 'accessoryId'
                    : item.category === 'pet'
                    ? 'petId'
                    : 'trailId'
                ] === item.id;

              const isMythic = item.rarity === 'mythic';
              const isLegendary = item.rarity === 'legendary';
              const isEpic = item.rarity === 'epic';
              const isRare = item.rarity === 'rare';

              return (
                <div
                  key={item.id}
                  id={`shop-item-${item.id}`}
                  onClick={() => handlePreview(item)}
                  className={`group relative p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center cursor-pointer select-none ${
                    isEquipped
                      ? 'bg-emerald-50 border-emerald-500 ring-3 ring-emerald-300 shadow-lg'
                      : isMythic
                      ? 'bg-gradient-to-b from-amber-50/80 via-purple-50/50 to-pink-50/80 border-amber-400 hover:border-amber-500 shadow-md hover:shadow-xl hover:scale-102 ring-1 ring-amber-300'
                      : isLegendary
                      ? 'bg-amber-50/60 hover:bg-amber-50 border-amber-300 hover:border-amber-500 shadow-sm hover:shadow-md hover:scale-102'
                      : isEpic
                      ? 'bg-purple-50/40 hover:bg-purple-50 border-purple-200 hover:border-purple-400 shadow-sm'
                      : isRare
                      ? 'bg-blue-50/40 hover:bg-blue-50 border-blue-200 hover:border-blue-400 shadow-sm'
                      : 'bg-slate-50/70 hover:bg-slate-50 border-slate-200 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  {/* Top Rarity Badge */}
                  <div className="w-full flex items-center justify-between mb-1">
                    <span
                      className={`text-[9px] font-fredoka font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                        isMythic
                          ? 'bg-gradient-to-r from-rose-500 via-amber-500 to-purple-600 text-white shadow-xs animate-pulse'
                          : isLegendary
                          ? 'bg-amber-400 text-amber-950'
                          : isEpic
                          ? 'bg-purple-100 text-purple-800'
                          : isRare
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isMythic ? '🌟 Thần Thoại' : isLegendary ? '👑 Huyền Thoại' : isEpic ? '🔮 Sử Thi' : isRare ? '💎 Hiếm' : '✨ Phổ Thông'}
                    </span>

                    {/* Preview hint icon */}
                    <span className="text-[10px] text-slate-400 font-bold group-hover:text-amber-600 transition-colors">
                      Thử 🪞
                    </span>
                  </div>

                  {/* Item Emoji Display with Glow */}
                  <div className="relative my-2">
                    {isMythic && (
                      <div className="absolute inset-0 bg-amber-400/30 rounded-full blur-md animate-pulse" />
                    )}
                    <div className="text-4xl relative z-10 group-hover:scale-115 transition-transform duration-200 drop-shadow-sm">
                      {item.emoji}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h4 className="font-fredoka font-black text-xs sm:text-sm text-slate-900 leading-snug">
                    {item.name}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium line-clamp-2 my-1 leading-tight">
                    {item.description}
                  </p>

                  {/* Price or Action Button */}
                  <div className="mt-auto w-full pt-2">
                    {isEquipped ? (
                      <span className="w-full py-1.5 bg-emerald-600 text-white rounded-xl font-fredoka font-black text-xs flex items-center justify-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" /> Đang Dùng
                      </span>
                    ) : isUnlocked ? (
                      <button
                        id={`btn-equip-${item.id}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleEquip(item);
                        }}
                        className="w-full py-1.5 game-btn-gold text-amber-950 rounded-xl font-fredoka font-black text-xs shadow-sm transition-transform active:scale-95 cursor-pointer"
                      >
                        Trang Bị
                      </button>
                    ) : (
                      <button
                        id={`btn-buy-${item.id}`}
                        onClick={e => {
                          e.stopPropagation();
                          handleBuy(item);
                        }}
                        className={`w-full py-1.5 text-white rounded-xl font-fredoka font-black text-xs shadow-md flex items-center justify-center gap-1 transition-all active:scale-95 cursor-pointer ${
                          isMythic
                            ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 ring-2 ring-amber-300'
                            : isLegendary
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                            : 'bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600'
                        }`}
                      >
                        <span>Mua:</span>
                        <span>{item.price.toLocaleString()}</span>
                        <span>{item.currency === 'coins' ? '🪙' : '💎'}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-slate-400 font-fredoka">
              <span className="text-3xl mb-2 block">🔍</span>
              <p className="text-sm font-bold">Không có vật phẩm nào phù hợp với bộ lọc này.</p>
            </div>
          )}

        </div>

      </div>

      {/* 🌟 MYTHIC / LEGENDARY ACQUISITION CELEBRATION MODAL */}
      {celebrationItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in zoom-in duration-200">
          <div className="bg-gradient-to-b from-purple-900 via-slate-900 to-amber-950 rounded-3xl max-w-md w-full p-6 text-white text-center shadow-2xl border-4 border-amber-400 relative overflow-hidden space-y-4">
            <button
              onClick={() => setCelebrationItem(null)}
              className="absolute top-3 right-3 p-1.5 text-slate-400 hover:text-white bg-white/10 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-5xl animate-bounce">🌟 👑 💎</div>

            <div>
              <span className="bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 font-fredoka font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                MỞ KHÓA THÀNH CÔNG
              </span>
              <h3 className="font-fredoka font-black text-2xl text-yellow-300 mt-2">
                CHÚC MỪNG BẠN SỞ HỮU!
              </h3>
              <p className="text-xs text-amber-100 font-semibold mt-0.5">
                Vật phẩm cấp {celebrationItem.rarity === 'mythic' ? 'Thần Thoại Tối Thượng' : 'Huyền Thoại'} đã được trang bị!
              </p>
            </div>

            <div className="py-4 bg-white/10 rounded-2xl border border-amber-300/40 flex flex-col items-center">
              <div className="text-6xl mb-2 animate-pulse">{celebrationItem.emoji}</div>
              <h4 className="font-fredoka font-black text-xl text-white">
                {celebrationItem.name}
              </h4>
              <p className="text-xs text-amber-200 px-4 font-semibold mt-1">
                {celebrationItem.description}
              </p>
            </div>

            <button
              onClick={() => setCelebrationItem(null)}
              className="w-full py-3 game-btn-gold text-amber-950 font-fredoka font-black text-base rounded-2xl shadow-xl cursor-pointer"
            >
              TIẾP TỤC KHÁM PHÁ ⭐
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
