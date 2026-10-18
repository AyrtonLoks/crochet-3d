import React, { useState } from 'react';
import { X, UserCheck, Plus, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { ArtisanProfile, DominantHand } from '@/types/crochet';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_ARTISANS: Partial<ArtisanProfile>[] = [
  {
    id: 'current-user',
    name: 'Artesão Criativo',
    handle: '@artesao_criativo',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    bio: 'Apaixonado por modelagem 3D e amigurumis modernos.',
    dominantHand: 'right',
    skillLevel: 'intermediate',
  },
  {
    id: 'artisan-clara',
    name: 'Clara Fios & Amor',
    handle: '@clara_amigurumi',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    bio: 'Especialista em polvos terapêuticos e bichinhos fofos.',
    dominantHand: 'right',
    skillLevel: 'advanced',
  },
  {
    id: 'artisan-lucas',
    name: 'Lucas Ponto a Ponto',
    handle: '@lucas_croche',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    bio: 'Artesão canhoto, criador de chaveiros e corações volumosos.',
    dominantHand: 'left',
    skillLevel: 'intermediate',
  },
  {
    id: 'artisan-mariana',
    name: 'Mariana Design Têxtil',
    handle: '@mariana_crochet',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    bio: 'Bolsas estruturadas e acessórios de decoração.',
    dominantHand: 'right',
    skillLevel: 'advanced',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useProfileStore();
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [newName, setNewName] = useState('');
  const [newHandle, setNewHandle] = useState('');
  const [newAvatar, setNewAvatar] = useState('');
  const [newHand, setNewHand] = useState<DominantHand>('right');

  if (!isOpen) return null;

  const handleSelectPreset = async (artisan: Partial<ArtisanProfile>) => {
    await updateProfile({
      name: artisan.name,
      handle: artisan.handle,
      avatarUrl: artisan.avatarUrl,
      bio: artisan.bio,
      dominantHand: artisan.dominantHand || 'right',
      skillLevel: artisan.skillLevel || 'intermediate',
    });
    onClose();
  };

  const handleCreateNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newHandle.trim()) return;

    const handleFormatted = newHandle.trim().startsWith('@') ? newHandle.trim() : `@${newHandle.trim()}`;
    await updateProfile({
      name: newName.trim(),
      handle: handleFormatted,
      avatarUrl: newAvatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      dominantHand: newHand,
      bio: 'Novo artesão na comunidade Crochê 3D.',
      skillLevel: 'beginner',
    });
    setIsCreatingNew(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-md rounded-3xl border border-cream-300 dark:border-stone-800 p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-cream-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-terracotta-500" />
            <h2 className="text-base font-bold text-stone-900 dark:text-white">
              {isCreatingNew ? 'Criar Novo Perfil de Artesão' : 'Alternar Conta de Artesão'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCreatingNew ? (
          <div className="space-y-4">
            <p className="text-xs text-stone-500">
              Escolha uma conta para alternar instantaneamente sem senhas, ou crie seu próprio perfil:
            </p>

            <div className="space-y-2">
              {PRESET_ARTISANS.map((artisan) => {
                const isCurrent = profile.handle === artisan.handle;
                return (
                  <div
                    key={artisan.id}
                    onClick={() => handleSelectPreset(artisan)}
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-terracotta-50 dark:bg-terracotta-950/40 border-terracotta-400 ring-2 ring-terracotta-400/20'
                        : 'bg-cream-50/60 dark:bg-stone-800/60 border-cream-200 dark:border-stone-700 hover:bg-cream-100 dark:hover:bg-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={artisan.avatarUrl}
                        alt={artisan.name}
                        className="w-10 h-10 rounded-xl object-cover ring-1 ring-terracotta-400"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900 dark:text-white">
                          {artisan.name}
                        </div>
                        <div className="text-[11px] text-terracotta-600 dark:text-terracotta-400 font-medium">
                          {artisan.handle} • {artisan.dominantHand === 'left' ? 'Canhoto 🖐️' : 'Destro ✋'}
                        </div>
                      </div>
                    </div>

                    {isCurrent ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-terracotta-600 dark:text-terracotta-400">
                        <Check className="w-4 h-4" /> Ativo
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold text-stone-400 group-hover:text-stone-600">
                        Entrar ➔
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setIsCreatingNew(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-terracotta-300 dark:border-terracotta-700 text-terracotta-600 dark:text-terracotta-400 hover:bg-terracotta-50 dark:hover:bg-terracotta-950/30 text-xs font-bold transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Criar Novo Perfil de Artesão</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateNew} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Nome do Artesão / Ateliê
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Beatriz Crochê"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                @Handle Único
              </label>
              <input
                type="text"
                required
                placeholder="@bia_croche"
                value={newHandle}
                onChange={(e) => setNewHandle(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-900 dark:text-white font-mono focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                URL da Foto de Perfil (Opcional)
              </label>
              <input
                type="url"
                placeholder="https://..."
                value={newAvatar}
                onChange={(e) => setNewAvatar(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Mão Dominante
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewHand('right')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    newHand === 'right'
                      ? 'bg-terracotta-500 text-white border-terracotta-600'
                      : 'bg-cream-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-cream-300'
                  }`}
                >
                  ✋ Destro
                </button>
                <button
                  type="button"
                  onClick={() => setNewHand('left')}
                  className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                    newHand === 'left'
                      ? 'bg-terracotta-500 text-white border-terracotta-600'
                      : 'bg-cream-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-cream-300'
                  }`}
                >
                  🖐️ Canhoto
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="flex-1 py-2 rounded-xl border border-cream-300 dark:border-stone-700 text-xs font-semibold text-stone-600 dark:text-stone-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md transition-all"
              >
                Salvar & Entrar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
