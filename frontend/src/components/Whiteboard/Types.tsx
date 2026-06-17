import React from 'react';

export type BoardType = 'flowchart' | 'mindmap' | 'kanban' | 'wireframe' | 'brainstorm';

interface BoardThumbnailProps {
  type: BoardType;
}

export const BoardThumbnail: React.FC<BoardThumbnailProps> = ({ type }) => {
  switch (type) {
    case 'flowchart':
      return (
        <div className="w-full h-full bg-[#111c18] flex items-center justify-center p-4 border-b border-zinc-800/60">
          <svg className="w-full h-full text-emerald-500/30" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="15" y="35" width="45" height="25" rx="4" />
            <path d="M60 47.5 h25" strokeWidth="1.5" />
            <polygon points="85,47.5 79,44 79,51" fill="currentColor" className="opacity-40" />
            <polygon points="120,20 145,50 120,80 95,50" strokeWidth="2" />
            <path d="M145 50 h25" strokeWidth="1.5" />
            <polygon points="170,50 164,46.5 164,53.5" fill="currentColor" className="opacity-40" />
            <rect x="170" y="35" width="20" height="25" rx="2" />
          </svg>
        </div>
      );

    case 'mindmap':
      return (
        <div className="w-full h-full bg-[#181224] flex items-center justify-center p-4 border-b border-zinc-800/60">
          <svg className="w-full h-full text-purple-500/30" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="75" y="38" width="50" height="24" rx="12" fill="currentColor" opacity="0.05" />
            <circle cx="35" cy="25" r="12" />
            <circle cx="30" cy="70" r="10" />
            <circle cx="165" cy="28" r="14" />
            <circle cx="160" cy="72" r="11" />
            <path d="M75 50 C 50 50, 55 25, 47 25 M75 50 C 50 50, 50 70, 40 70 M125 50 C 150 50, 145 28, 151 28 M125 50 C 150 50, 145 72, 149 72" strokeWidth="1.5" strokeDasharray="3 3" />
          </svg>
        </div>
      );

    case 'kanban':
      return (
        <div className="w-full h-full bg-[#121622] flex items-center justify-center p-4 border-b border-zinc-800/60">
          <svg className="w-full h-full text-slate-500/30" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="15" y="10" width="45" height="80" rx="4" />
            <rect x="75" y="10" width="45" height="80" rx="4" />
            <rect x="135" y="10" width="45" height="80" rx="4" />
            <rect x="22" y="20" width="31" height="12" rx="2" fill="currentColor" opacity="0.1" />
            <rect x="22" y="38" width="31" height="12" rx="2" fill="currentColor" opacity="0.1" />
            <rect x="82" y="20" width="31" height="12" rx="2" fill="currentColor" opacity="0.1" />
            <rect x="142" y="20" width="31" height="12" rx="2" fill="currentColor" opacity="0.1" />
            <path d="M30 72 h15 M37.5 64.5 v15" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'wireframe':
      return (
        <div className="w-full h-full bg-[#121926] flex items-center justify-center p-4 border-b border-zinc-800/60">
          <svg className="w-full h-full text-blue-500/20" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="15" y="12" width="170" height="76" rx="4" />
            <line x1="15" y1="32" x2="185" y2="32" strokeWidth="1" />
            <circle cx="30" cy="22" r="4" />
            <line x1="45" y1="22" x2="85" y2="22" strokeWidth="1" />
            <rect x="25" y="44" width="45" height="32" rx="2" />
            <line x1="25" y1="44" x2="70" y2="76" strokeWidth="1" />
            <line x1="70" y1="44" x2="25" y2="76" strokeWidth="1" />
            <line x1="85" y1="48" x2="170" y2="48" strokeWidth="1" />
            <line x1="85" y1="58" x2="155" y2="58" strokeWidth="1" />
            <line x1="85" y1="68" x2="130" y2="68" strokeWidth="1" />
          </svg>
        </div>
      );

    case 'brainstorm':
      return (
        <div className="w-full h-full bg-[#1c1912] flex items-center justify-center p-4 border-b border-zinc-800/60">
          <svg className="w-full h-full text-amber-500/25" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="25" y="15" width="35" height="30" rx="3" fill="currentColor" opacity="0.05" transform="rotate(-5 42 30)" />
            <rect x="80" y="22" width="38" height="32" rx="3" fill="currentColor" opacity="0.05" transform="rotate(3 99 38)" />
            <rect x="140" y="12" width="34" height="28" rx="3" fill="currentColor" opacity="0.05" transform="rotate(-8 157 26)" />
            <rect x="40" y="56" width="36" height="30" rx="3" fill="currentColor" opacity="0.05" transform="rotate(6 58 71)" />
            <rect x="115" y="52" width="40" height="34" rx="3" fill="currentColor" opacity="0.05" transform="rotate(-2 135 69)" />
            <line x1="45" y1="25" x2="55" y2="25" strokeWidth="1" transform="rotate(-5 42 30)" />
            <line x1="45" y1="32" x2="52" y2="32" strokeWidth="1" transform="rotate(-5 42 30)" />
            <line x1="88" y1="32" x2="105" y2="32" strokeWidth="1" transform="rotate(3 99 38)" />
            <line x1="123" y1="62" x2="145" y2="62" strokeWidth="1" transform="rotate(-2 135 69)" />
          </svg>
        </div>
      );
  }
};