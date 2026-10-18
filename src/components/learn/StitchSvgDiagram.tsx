import React from 'react';
import { StitchType } from '@/types/crochet';

interface StitchSvgDiagramProps {
  stitchId: StitchType;
  stepIndex?: number;
  isLeftHanded?: boolean;
  className?: string;
}

export const StitchSvgDiagram: React.FC<StitchSvgDiagramProps> = ({
  stitchId,
  stepIndex = 1,
  isLeftHanded = false,
  className = 'w-full h-40',
}) => {
  const mirrorStyle: React.CSSProperties = isLeftHanded
    ? { transform: 'scaleX(-1)', transformOrigin: 'center' }
    : {};

  // Renderiza diagramas vetoriais nítidos e didáticos para cada tipo de ponto
  const renderDiagramContent = () => {
    switch (stitchId) {
      case 'am': // Anel Mágico
        return (
          <g>
            {/* Círculo do Anel */}
            <circle cx="100" cy="80" r="45" fill="none" stroke="#ea580c" strokeWidth="4" strokeDasharray="6 3" />
            {/* Ponta solta e fio do novelo cruzados */}
            <path d="M 60 120 C 70 100, 95 40, 100 40 C 110 40, 140 90, 150 130" fill="none" stroke="#ea580c" strokeWidth="4" />
            <path d="M 50 70 L 150 70" fill="none" stroke="#f97316" strokeWidth="3" strokeDasharray="4 2" />
            {/* Agulha de Crochê */}
            <path d="M 140 30 L 95 75 L 88 78 L 92 84 L 98 80" fill="none" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <circle cx="92" cy="78" r="3" fill="#3b82f6" />
            {/* Seta de direção puxando a laçada */}
            <path d="M 85 95 Q 100 110 115 95" fill="none" stroke="#10b981" strokeWidth="3" markerEnd="url(#arrow)" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              Passo {stepIndex}: Puxe a laçada central
            </text>
          </g>
        );

      case 'corr': // Correntinha
        return (
          <g>
            {/* Elo anterior da corrente */}
            <ellipse cx="60" cy="80" rx="14" ry="24" fill="none" stroke="#ea580c" strokeWidth="4" transform="rotate(-20 60 80)" />
            <ellipse cx="90" cy="75" rx="14" ry="24" fill="none" stroke="#ea580c" strokeWidth="4" transform="rotate(-15 90 75)" />
            {/* Laçada na agulha */}
            <ellipse cx="120" cy="70" rx="12" ry="22" fill="none" stroke="#f97316" strokeWidth="4" />
            {/* Fio laçando sobre a agulha (yarn over) */}
            <path d="M 115 45 C 130 35, 145 50, 135 65" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="4 2" />
            {/* Agulha */}
            <line x1="160" y1="35" x2="110" y2="85" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <path d="M 110 85 Q 104 88 108 92" fill="none" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              Laçada no gancho e puxe por dentro
            </text>
          </g>
        );

      case 'pb': // Ponto Baixo
        return (
          <g>
            {/* Base da Carreira (pontos em "V") */}
            <path d="M 30 110 L 50 120 L 70 110 L 90 120 L 110 110 L 130 120 L 150 110 L 170 120" fill="none" stroke="#d6d3d1" strokeWidth="4" strokeLinecap="round" />
            {/* Ponto sendo trabalhado */}
            <path d="M 90 120 L 90 85" fill="none" stroke="#ea580c" strokeWidth="4" />
            <path d="M 110 110 L 95 85" fill="none" stroke="#ea580c" strokeWidth="4" />
            {/* Duas laçadas na haste da agulha */}
            <circle cx="95" cy="70" r="7" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="107" cy="62" r="7" fill="none" stroke="#3b82f6" strokeWidth="3" />
            {/* Agulha entrando e pescando o fio */}
            <line x1="145" y1="35" x2="85" y2="85" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <path d="M 85 85 Q 80 88 84 93" fill="none" stroke="#64748b" strokeWidth="4" />
            {/* Seta indicadora */}
            <path d="M 80 50 Q 60 70 82 85" fill="none" stroke="#10b981" strokeWidth="2.5" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              2 laçadas na agulha → Lace e feche juntas
            </text>
          </g>
        );

      case 'mpa': // Meio Ponto Alto
        return (
          <g>
            {/* Base da Carreira */}
            <path d="M 30 115 L 60 120 L 90 115 L 120 120 L 150 115 L 180 120" fill="none" stroke="#d6d3d1" strokeWidth="4" />
            {/* Haste do ponto com laçada prévia */}
            <path d="M 90 115 L 90 75" fill="none" stroke="#ea580c" strokeWidth="4" />
            {/* 3 Laçadas na agulha */}
            <circle cx="85" cy="65" r="6" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="97" cy="58" r="6" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="109" cy="51" r="6" fill="none" stroke="#3b82f6" strokeWidth="3" />
            {/* Agulha */}
            <line x1="150" y1="30" x2="75" y2="80" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            {/* Arco englobando as 3 laçadas */}
            <path d="M 75 40 Q 100 25 125 45" fill="none" stroke="#10b981" strokeWidth="2.5" strokeDasharray="3 2" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              3 laçadas na agulha → Puxe o fio por todas de uma vez
            </text>
          </g>
        );

      case 'pa': // Ponto Alto
        return (
          <g>
            {/* Base da Carreira */}
            <path d="M 30 120 L 60 125 L 90 120 L 120 125 L 150 120 L 180 125" fill="none" stroke="#d6d3d1" strokeWidth="4" />
            {/* Haste longa do Ponto Alto com anéis */}
            <line x1="90" y1="120" x2="90" y2="55" stroke="#ea580c" strokeWidth="4" />
            <line x1="86" y1="85" x2="94" y2="85" stroke="#f97316" strokeWidth="3" />
            {/* Agulha e laçadas parciais */}
            <circle cx="88" cy="50" r="6" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <circle cx="100" cy="44" r="6" fill="none" stroke="#3b82f6" strokeWidth="3" />
            <line x1="140" y1="20" x2="75" y2="65" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              Tire 2 laçadas, lace novamente e tire as 2 últimas
            </text>
          </g>
        );

      case 'pbx': // Ponto Baixíssimo
        return (
          <g>
            <path d="M 40 100 L 70 105 L 100 100 L 130 105 L 160 100" fill="none" stroke="#d6d3d1" strokeWidth="4" />
            {/* Fio atravessando o ponto raso */}
            <path d="M 100 100 Q 115 80 105 65 Q 95 65 98 85" fill="none" stroke="#ea580c" strokeWidth="4" />
            <line x1="145" y1="35" x2="90" y2="85" stroke="#64748b" strokeWidth="5" strokeLinecap="round" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              Deslize o fio direto sem nova laçada
            </text>
          </g>
        );

      case 'aum': // Aumento
        return (
          <g>
            {/* Um único ponto na base que bifurca em dois */}
            <circle cx="100" cy="115" r="6" fill="#f97316" />
            <path d="M 40 115 L 160 115" fill="none" stroke="#d6d3d1" strokeWidth="3" />
            {/* Dois pontos baixos saindo do mesmo buraco */}
            <path d="M 100 115 Q 85 90 75 60" fill="none" stroke="#ea580c" strokeWidth="4" />
            <path d="M 100 115 Q 115 90 125 60" fill="none" stroke="#ea580c" strokeWidth="4" />
            {/* Badges dos dois pontos resultantes */}
            <circle cx="75" cy="55" r="9" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
            <text x="75" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#c2410c">1</text>
            <circle cx="125" cy="55" r="9" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
            <text x="125" y="59" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#c2410c">2</text>
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              2 pontos no mesmo ponto de base = +1 ponto
            </text>
          </g>
        );

      case 'dim':
      case 'dim_inv': // Diminuição Invisível
      default:
        return (
          <g>
            {/* Base com 2 pontos adjacentes */}
            <path d="M 40 115 L 160 115" fill="none" stroke="#d6d3d1" strokeWidth="3" />
            {/* Apenas as alças da frente (FLO) destacadas */}
            <ellipse cx="80" cy="110" rx="8" ry="4" fill="#60a5fa" />
            <ellipse cx="120" cy="110" rx="8" ry="4" fill="#60a5fa" />
            {/* Agulha passando exclusivamente pelas duas alças frontais */}
            <line x1="150" y1="75" x2="65" y2="115" stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
            {/* Junção no topo em 1 único ponto */}
            <path d="M 80 110 Q 100 80 100 55" fill="none" stroke="#ea580c" strokeWidth="4" />
            <path d="M 120 110 Q 100 80 100 55" fill="none" stroke="#ea580c" strokeWidth="4" />
            <circle cx="100" cy="55" r="8" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
            <text x="100" y="145" textAnchor="middle" fontSize="11" fill="#78716c" fontWeight="bold">
              Pegue apenas as 2 alças da frente (FLO) e teça como 1 pb
            </text>
          </g>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl bg-cream-50/80 dark:bg-stone-900/80 border border-cream-200 dark:border-stone-800 ${className}`}>
      <svg
        viewBox="0 0 200 160"
        className="w-full h-full max-h-48 drop-shadow-sm transition-transform duration-300"
        style={mirrorStyle}
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#10b981" />
          </marker>
        </defs>
        {renderDiagramContent()}
      </svg>
      {isLeftHanded && (
        <span className="text-[10px] font-semibold text-terracotta-600 dark:text-terracotta-400 mt-1">
          🖐️ Ilustração espelhada para canhotos
        </span>
      )}
    </div>
  );
};
