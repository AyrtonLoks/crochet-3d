import React, { useState, useEffect } from 'react';
import { Camera, Heart, Plus, Sparkles, MessageCircle } from 'lucide-react';
import { CommunityMake } from '@/types/crochet';
import { CommunityService } from '@/core/services/CommunityService';
import { useProfileStore } from '@/store/useProfileStore';

interface CommunityMakesSectionProps {
  projectId?: string;
}

export const CommunityMakesSection: React.FC<CommunityMakesSectionProps> = ({ projectId }) => {
  const { profile } = useProfileStore();
  const [makes, setMakes] = useState<CommunityMake[]>([]);
  const [isAddingPhoto, setIsAddingPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');

  const loadMakes = async () => {
    const list = await CommunityService.getCommunityMakes(projectId);
    setMakes(list);
  };

  useEffect(() => {
    loadMakes();
  }, [projectId]);

  const handleAddMake = async () => {
    if (!photoUrl.trim()) return;

    await CommunityService.addCommunityMake({
      projectId: projectId || 'project-polvo-amigurumi',
      makerId: profile.id,
      makerName: profile.name,
      makerHandle: profile.handle,
      makerAvatar: profile.avatarUrl,
      photoUrl: photoUrl.trim(),
      notes: notes.trim(),
    });

    setPhotoUrl('');
    setNotes('');
    setIsAddingPhoto(false);
    await loadMakes();
  };

  const handleLike = async (makeId: string) => {
    const count = await CommunityService.likeMake(makeId);
    setMakes((prev) =>
      prev.map((m) => (m.id === makeId ? { ...m, likesCount: count } : m))
    );
  };

  return (
    <div className="space-y-4 pt-4 border-t border-cream-200 dark:border-stone-800">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-stone-900 dark:text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-terracotta-500" />
            <span>Feito pela Comunidade ({makes.length})</span>
          </h3>
          <p className="text-xs text-stone-500">
            Fotos reais de peças físicas tecidas pelos artesãos da comunidade
          </p>
        </div>

        <button
          onClick={() => setIsAddingPhoto(!isAddingPhoto)}
          className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-xl bg-cream-100 dark:bg-stone-800 hover:bg-cream-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 transition-colors border border-cream-300 dark:border-stone-700"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Postar Minha Foto</span>
        </button>
      </div>

      {isAddingPhoto && (
        <div className="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-terracotta-300 dark:border-stone-700 space-y-3 shadow-sm">
          <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
            Adicionar Foto da sua Peça Física
          </div>
          <input
            type="url"
            placeholder="URL da foto (ex: https://images.unsplash.com/...)"
            value={photoUrl}
            onChange={(e) => setPhotoUrl(e.target.value)}
            className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
          />
          <textarea
            placeholder="Conte como foi tecer essa peça (fio utilizado, agulha, dicas)..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-900 text-stone-800 dark:text-stone-200 focus:outline-none focus:ring-1 focus:ring-terracotta-400 resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setIsAddingPhoto(false)}
              className="text-xs px-3 py-1.5 rounded-xl text-stone-500 hover:bg-stone-100"
            >
              Cancelar
            </button>
            <button
              onClick={handleAddMake}
              disabled={!photoUrl.trim()}
              className="text-xs px-4 py-1.5 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white font-bold disabled:opacity-50"
            >
              Publicar Foto
            </button>
          </div>
        </div>
      )}

      {/* Grid de Fotos da Comunidade */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {makes.map((make) => (
          <div
            key={make.id}
            className="bg-white dark:bg-stone-800 rounded-2xl border border-cream-200 dark:border-stone-700 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div className="relative h-44 w-full bg-stone-100 dark:bg-stone-900">
              <img
                src={make.photoUrl}
                alt="Peça tecida"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => handleLike(make.id)}
                className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-bold hover:scale-110 active:scale-95 transition-transform"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                <span>{make.likesCount}</span>
              </button>
            </div>

            <div className="p-3 space-y-2">
              <div className="flex items-center gap-2">
                <img
                  src={
                    make.makerAvatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'
                  }
                  alt={make.makerName}
                  className="w-6 h-6 rounded-full object-cover ring-1 ring-terracotta-400"
                />
                <div className="min-w-0">
                  <div className="text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                    {make.makerName}
                  </div>
                  <div className="text-[10px] text-terracotta-600 dark:text-terracotta-400">
                    {make.makerHandle}
                  </div>
                </div>
              </div>

              {make.notes && (
                <p className="text-xs text-stone-600 dark:text-stone-300 italic line-clamp-2 leading-relaxed">
                  "{make.notes}"
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
