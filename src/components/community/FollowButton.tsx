import React from 'react';
import { UserCheck, UserPlus } from 'lucide-react';
import { useSocialStore } from '@/store/useSocialStore';

interface FollowButtonProps {
  artisanId: string;
  size?: 'sm' | 'md';
}

export const FollowButton: React.FC<FollowButtonProps> = ({ artisanId, size = 'md' }) => {
  const { isFollowing, toggleFollow } = useSocialStore();
  const following = isFollowing(artisanId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFollow(artisanId);
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 rounded-xl font-bold transition-all ${
        size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3.5 py-1.5 text-xs'
      } ${
        following
          ? 'bg-cream-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200 border border-cream-300 dark:border-stone-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300'
          : 'bg-terracotta-500 hover:bg-terracotta-600 text-white shadow-sm shadow-terracotta-500/20'
      }`}
    >
      {following ? (
        <>
          <UserCheck className="w-3.5 h-3.5 text-sage-600" />
          <span>Seguindo</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Seguir</span>
        </>
      )}
    </button>
  );
};
