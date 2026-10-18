// Tipos fundamentais e interfaces do Crochê 3D Interativo

export type StitchType =
  | 'corr'    // correntinha (ch)
  | 'pb'      // ponto baixo (sc)
  | 'pa'      // ponto alto (dc)
  | 'mpa'     // meio ponto alto (hdc)
  | 'pbx'     // ponto baixíssimo (sl st)
  | 'pad'     // ponto alto duplo (tr)
  | 'aum'     // aumento (inc)
  | 'dim'     // diminuição (dec)
  | 'dim_inv' // diminuição invisível (inv dec)
  | 'am';     // anel mágico (magic ring)

export interface StitchInfo {
  type: StitchType;
  namePt: string;
  nameUs: string;
  abbreviationPt: string;
  abbreviationUs: string;
  descriptionPt: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  heightMultiplier: number; // Altura relativa (pb=1, mpa=1.5, pa=2, etc.)
  yarnFactor: number;       // Consumo relativo de fio em cm
}

export type DominantHand = 'right' | 'left';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProjectCategory = 'amigurumi' | 'clothing' | 'bags' | 'home' | 'other';
export type ProjectDifficulty = 'beginner' | 'intermediate' | 'advanced';
export type ProjectVisibility = 'private' | 'public';
export type SharePermissionLevel = 'viewer' | 'editor';

export interface TensionCalibration {
  customGaugeEnabled: boolean;
  stitchesPer10cm: number;
  rowsPer10cm: number;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  handle: string; // ex: '@maria_amigurumi'
  avatarUrl?: string;
  bio?: string;
  dominantHand: DominantHand;
  skillLevel: SkillLevel;
  tensionCalibration: TensionCalibration;
  socialLinks?: {
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  stats: {
    totalStitchesCrocheted: number;
    totalMetersUsed: number;
    completedProjectsCount: number;
    followersCount: number;
    followingCount: number;
    earnedBadges: string[];
  };
  createdAt: number;
  updatedAt: number;
}

export interface ProjectShareEntry {
  id: string;
  projectId: string;
  granteeUserId?: string;
  granteeHandle?: string;
  permission: SharePermissionLevel;
  allowPdfDownload: boolean;
  accessToken?: string;
  createdAt: number;
}

export interface ProjectLicense {
  allowSellingFinishedItems: boolean;
  allowSharingPattern: boolean;
  licenseText: string;
}

export interface MakerJournal {
  userId: string;
  userHandle: string;
  startedAt?: number;
  finishedAt?: number;
  notes?: string;
  hookUsedMm?: number;
  customYarnUsed?: string;
  realPhotos?: string[];
}

export interface CommunityMake {
  id: string;
  projectId: string;
  makerId: string;
  makerName: string;
  makerHandle: string;
  makerAvatar?: string;
  photoUrl: string;
  notes?: string;
  createdAt: number;
  likesCount: number;
}

export interface StitchStep {
  type: StitchType;
  count: number;
  color?: string;
}

export interface PatternRow {
  rowNumber: number;
  instructionText: string;
  stitchCount: number;
  type: 'round' | 'linear';
  stitches: StitchStep[];
  notes?: string;
  color?: string;
}

export type PrimitiveShape = 'sphere' | 'cylinder' | 'capsule' | 'cone' | 'box' | 'torus' | 'imported';

export interface PartTransform {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
}

export interface ProjectPart {
  id: string;
  name: string;
  color: string;
  yarnTypeId: string;
  hookSizeMm: number;
  primitiveType?: PrimitiveShape;
  dimensionsCm?: {
    width: number;
    height: number;
    depth: number;
  };
  transform: PartTransform;
  rows: PatternRow[];
  meshData?: {
    customGeometry?: boolean;
    vertices?: number[];
    indices?: number[];
  };
}

export interface YarnSpecification {
  id: string;
  name: string;
  type: 'cotton' | 'chenille' | 'wool' | 'tshirt';
  diameterMm: number;
  tex?: number;
  roughness: number;
  fuzziness: number;
  defaultHookMm: number;
  descriptionPt: string;
  recommendedUses: string[];
}

export interface CrochetProject {
  id: string;
  title: string;
  description?: string;
  category: ProjectCategory;
  difficulty: ProjectDifficulty;
  visibility: ProjectVisibility;
  createdAt: number;
  updatedAt: number;
  thumbnailUrl?: string;

  designer: {
    userId: string;
    name: string;
    handle: string;
    avatarUrl?: string;
    license: ProjectLicense;
  };

  journal: MakerJournal;
  sharedWith: ProjectShareEntry[];

  social: {
    likesCount: number;
    isLikedByCurrentUser?: boolean;
    isBookmarkedByCurrentUser?: boolean;
    makesCount: number;
  };

  parts: ProjectPart[];
  materials: {
    yarns: {
      yarnId: string;
      color: string;
      estimatedMeters: number;
      estimatedGrams: number;
    }[];
    hooks: number[];
    accessories: string[];
  };
  progress: {
    activePartId: string;
    currentRowIndex: number;
    currentStitchIndex: number;
    completedPercentage: number;
  };
}

export interface StitchTutorial {
  id: StitchType;
  namePt: string;
  nameUs: string;
  shortPt: string;
  shortUs: string;
  difficulty: 'iniciante' | 'intermediario' | 'avancado';
  category: 'basico' | 'altos' | 'modificadores' | 'inicio';
  description: string;
  rightHandInstructions: string[];
  leftHandInstructions: string[];
  tips: string[];
  videoOrAnimKey: string;
}

export interface ValidationIssue {
  rowIndex: number;
  rowNumber: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  expectedCount?: number;
  actualCount?: number;
  suggestion?: string;
}
