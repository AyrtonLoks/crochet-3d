import React, { useState } from 'react';
import { X, User, Save, Sparkles, Check } from 'lucide-react';
import { useProfileStore } from '@/store/useProfileStore';
import { HandDominanceSelector } from './HandDominanceSelector';
import { StatsBadgesCard } from './StatsBadgesCard';
import { SkillLevel } from '@/types/crochet';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile } = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [skillLevel, setSkillLevel] = useState<SkillLevel>(profile.skillLevel);
  const [savedFeedback, setSavedFeedback] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({
      name: name.trim(),
      handle: handle.trim().startsWith('@') ? handle.trim() : `@${handle.trim()}`,
      avatarUrl: avatarUrl.trim() || undefined,
      bio: bio.trim() || undefined,
      skillLevel,
    });
    setSavedFeedback(true);
    setTimeout(() => {
      setSavedFeedback(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 w-full max-w-xl rounded-3xl border border-cream-300 dark:border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-cream-200 dark:border-stone-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-terracotta-500 to-terracotta-400 text-white flex items-center justify-center shadow-md shadow-terracotta-500/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-white">
                Perfil do Artesão
              </h2>
              <p className="text-xs text-stone-500">
                Configure seus dados, ergonomia e acompanhe suas conquistas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Estatísticas e Insígnias */}
        <StatsBadgesCard />

        {/* Formulário de Edição */}
        <form onSubmit={handleSave} className="space-y-4 pt-2 border-t border-cream-200 dark:border-stone-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                Nome do Artesão / Marca
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                @Handle Único
              </label>
              <input
                type="text"
                value={handle}
                onChange={(e) => setHandle(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500 font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              URL do Avatar
            </label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Biografia do Criador
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Fale sobre seu estilo de crochê, amigurumis favoritos..."
              className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 focus:outline-none focus:ring-1 focus:ring-terracotta-500 resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
              Nível de Experiência
            </label>
            <select
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value as SkillLevel)}
              className="w-full text-xs px-3 py-2 rounded-xl border border-cream-300 dark:border-stone-700 bg-cream-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
            >
              <option value="beginner">Iniciante (Primeiras peças)</option>
              <option value="intermediate">Intermediário (Domina aumentos e diminuições)</option>
              <option value="advanced">Avançado (Criação e modelagem própria)</option>
            </select>
          </div>

          {/* Seletor de Ergonomia Destro / Canhoto */}
          <HandDominanceSelector />

          {/* Rodapé de Ações */}
          <div className="flex justify-end gap-2 pt-3 border-t border-cream-200 dark:border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2 rounded-xl bg-terracotta-600 hover:bg-terracotta-700 text-white text-xs font-bold shadow-md shadow-terracotta-500/20 transition-all"
            >
              {savedFeedback ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Salvo com Sucesso!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
