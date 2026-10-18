import { ProjectShareEntry, SharePermissionLevel, CrochetProject } from '@/types/crochet';
import { db } from '@/core/storage/db';

export class ShareService {
  /**
   * Gera um link seguro com token único revogável para compartilhamento de projeto privado.
   */
  static async createShareLink(
    projectId: string,
    permission: SharePermissionLevel = 'viewer',
    allowPdfDownload: boolean = true
  ): Promise<ProjectShareEntry> {
    const token = 'CR3D_' + Math.random().toString(36).substring(2, 9).toUpperCase() + '_' + Date.now().toString(36).toUpperCase();
    const entry: ProjectShareEntry = {
      id: 'share-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      projectId,
      permission,
      allowPdfDownload,
      accessToken: token,
      createdAt: Date.now(),
    };

    // Atualiza no projeto
    const project = await db.projects.get(projectId);
    if (project) {
      const currentShares = project.sharedWith || [];
      project.sharedWith = [...currentShares, entry];
      await db.projects.put(project);
    }

    await db.sharedProjects.put(entry);
    return entry;
  }

  /**
   * Concede acesso direto para o @handle de um artesão.
   */
  static async inviteArtisanByHandle(
    projectId: string,
    granteeHandle: string,
    permission: SharePermissionLevel = 'viewer',
    allowPdfDownload: boolean = true
  ): Promise<ProjectShareEntry> {
    const formattedHandle = granteeHandle.startsWith('@') ? granteeHandle : `@${granteeHandle}`;
    const token = 'INV_' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const entry: ProjectShareEntry = {
      id: 'share-handle-' + Date.now(),
      projectId,
      granteeHandle: formattedHandle,
      permission,
      allowPdfDownload,
      accessToken: token,
      createdAt: Date.now(),
    };

    const project = await db.projects.get(projectId);
    if (project) {
      const currentShares = project.sharedWith || [];
      project.sharedWith = [...currentShares, entry];
      await db.projects.put(project);
    }

    await db.sharedProjects.put(entry);
    return entry;
  }

  /**
   * Revoga a chave de acesso ou convite.
   */
  static async revokeAccess(projectId: string, shareId: string): Promise<void> {
    const project = await db.projects.get(projectId);
    if (project && project.sharedWith) {
      project.sharedWith = project.sharedWith.filter((s) => s.id !== shareId);
      await db.projects.put(project);
    }
    await db.sharedProjects.delete(shareId);
  }

  /**
   * Valida e resgata um projeto através do token de convite fornecido pelo usuário.
   */
  static async redeemToken(token: string): Promise<{ project: CrochetProject; share: ProjectShareEntry } | null> {
    const cleanToken = token.trim().toUpperCase();
    const allProjects = await db.projects.toArray();

    for (const project of allProjects) {
      if (project.sharedWith && project.sharedWith.length > 0) {
        const found = project.sharedWith.find(
          (s) => s.accessToken && s.accessToken.toUpperCase() === cleanToken
        );
        if (found) {
          return { project, share: found };
        }
      }
    }

    return null;
  }
}
