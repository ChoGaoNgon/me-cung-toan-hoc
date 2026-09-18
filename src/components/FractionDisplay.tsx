import React from 'react';
import { FractionRepresentation } from '../types';

interface FractionDisplayProps {
  fraction: FractionRepresentation;
  size?: 'sm' | 'md' | 'lg';
  showVisual?: boolean;
}

export const FractionDisplay: React.FC<FractionDisplayProps> = ({
  fraction,
  size = 'md',
  showVisual = true
}) => {
  const { numerator, denominator, visualType = 'pie' } = fraction;

  const getPieSlicePath = (index: number, total: number, radius: number = 18, cx: number = 20, cy: number = 20) => {
    if (total === 1) return `M ${cx - radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx + radius} ${cy} A ${radius} ${radius} 0 1 0 ${cx - radius} ${cy}`;
    const startAngle = (index / total) * 2 * Math.PI - Math.PI / 2;
    const endAngle = ((index + 1) / total) * 2 * Math.PI - Math.PI / 2;

    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);

    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div className="flex flex-col items-center justify-center select-none pointer-events-none">
      {/* Visual representation */}
      {showVisual && (
        <div className="mb-1">
          {visualType === 'pie' ? (
            <svg width="38" height="38" viewBox="0 0 40 40" className="drop-shadow-xs">
              <circle cx="20" cy="20" r="18" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1.5" />
              {Array.from({ length: denominator }).map((_, i) => (
                <path
                  key={i}
                  d={getPieSlicePath(i, denominator)}
                  fill={i < numerator ? '#f59e0b' : '#f8fafc'}
                  stroke="#b45309"
                  strokeWidth="1"
                />
              ))}
            </svg>
          ) : (
            <div className="flex border border-amber-600 rounded overflow-hidden bg-slate-100 shadow-xs h-4 w-12">
              {Array.from({ length: denominator }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r border-amber-600 last:border-r-0 ${
                    i < numerator ? 'bg-amber-400' : 'bg-white'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Numerator / Denominator Fraction Bar */}
      <div className="flex flex-col items-center justify-center font-fredoka font-black leading-none text-slate-800">
        <span className={size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'}>
          {numerator}
        </span>
        <div className="w-5 h-0.5 bg-slate-800 my-0.5" />
        <span className={size === 'lg' ? 'text-lg' : size === 'sm' ? 'text-xs' : 'text-sm'}>
          {denominator}
        </span>
      </div>
    </div>
  );
};
