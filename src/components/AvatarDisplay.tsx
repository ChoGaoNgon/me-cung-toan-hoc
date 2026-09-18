import React from 'react';
import { PlayerCustomization } from '../types';
import { SHOP_ITEMS } from '../data/shopData';

interface AvatarDisplayProps {
  customization: PlayerCustomization;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showPet?: boolean;
  showTrail?: boolean;
  animate?: boolean;
  className?: string;
}

export const AvatarDisplay: React.FC<AvatarDisplayProps> = ({
  customization,
  size = 'md',
  showPet = true,
  showTrail = false,
  animate = true,
  className = ''
}) => {
  const avatarItem = SHOP_ITEMS.find(i => i.id === customization.avatarId) || SHOP_ITEMS[0];
  const hatItem = SHOP_ITEMS.find(i => i.id === customization.hatId);
  const accessoryItem = SHOP_ITEMS.find(i => i.id === customization.accessoryId);
  const petItem = SHOP_ITEMS.find(i => i.id === customization.petId);
  const trailItem = SHOP_ITEMS.find(i => i.id === customization.trailId);

  const isMythic = avatarItem.rarity === 'mythic';
  const isLegendary = avatarItem.rarity === 'legendary';

  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-14 h-14 text-3xl',
    lg: 'w-20 h-20 text-5xl',
    xl: 'w-28 h-28 text-7xl'
  };

  const hatSizeClasses = {
    sm: 'text-sm -top-2',
    md: 'text-xl -top-3',
    lg: 'text-3xl -top-5',
    xl: 'text-4xl -top-7'
  };

  const accSizeClasses = {
    sm: 'text-xs -right-1 bottom-0',
    md: 'text-base -right-2 bottom-1',
    lg: 'text-xl -right-3 bottom-2',
    xl: 'text-2xl -right-4 bottom-3'
  };

  const petSizeClasses = {
    sm: 'text-xs -left-2 bottom-0',
    md: 'text-sm -left-3 bottom-1',
    lg: 'text-lg -left-4 bottom-2',
    xl: 'text-2xl -left-5 bottom-3'
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Mythic Radiant Background Pulse Aura */}
      {isMythic && (
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 blur-md opacity-70 animate-pulse pointer-events-none scale-125" />
      )}

      {/* Legendary Golden Aura */}
      {isLegendary && !isMythic && (
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-300 to-yellow-400 blur-xs opacity-60 pointer-events-none scale-110" />
      )}

      {/* Trail preview effect behind */}
      {showTrail && trailItem && trailItem.id !== 'trail_none' && (
        <div className="absolute -left-3 -bottom-1 opacity-80 animate-pulse pointer-events-none text-base z-0">
          {trailItem.emoji}
        </div>
      )}

      {/* Main Avatar Container */}
      <div
        className={`relative z-10 ${sizeClasses[size]} rounded-2xl flex items-center justify-center shadow-md transition-all ${
          isMythic
            ? 'border-3 border-amber-300 ring-2 ring-yellow-400 shadow-amber-300/50'
            : isLegendary
            ? 'border-2 border-yellow-400 ring-1 ring-amber-300'
            : 'border-2 border-amber-200'
        } ${animate ? 'hover:scale-110 active:scale-95' : ''}`}
        style={{
          backgroundColor: avatarItem.color ? `${avatarItem.color}20` : '#fffbeb'
        }}
      >
        {/* Avatar Emoji */}
        <span className={`${animate ? 'animate-float' : ''} select-none drop-shadow-sm`}>
          {avatarItem.emoji}
        </span>

        {/* Hat */}
        {hatItem && hatItem.id !== 'hat_none' && (
          <div className={`absolute ${hatSizeClasses[size]} left-1/2 -translate-x-1/2 select-none pointer-events-none filter drop-shadow-md z-20`}>
            {hatItem.emoji}
          </div>
        )}

        {/* Accessory / Shield / Cape */}
        {accessoryItem && accessoryItem.id !== 'acc_none' && (
          <div className={`absolute ${accSizeClasses[size]} select-none pointer-events-none filter drop-shadow z-20`}>
            {accessoryItem.emoji}
          </div>
        )}

        {/* Pet Companion */}
        {showPet && petItem && petItem.id !== 'pet_none' && (
          <div className={`absolute ${petSizeClasses[size]} select-none pointer-events-none filter drop-shadow animate-wiggle z-20`}>
            {petItem.emoji}
          </div>
        )}
      </div>
    </div>
  );
};
