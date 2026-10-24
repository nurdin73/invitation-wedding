export interface InvitationRecord {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeConfig: Record<string, unknown>;
  content: Record<string, unknown>;
  sections: unknown[];
  isPublished: boolean;
  version: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateInvitationPayload {
  themeConfig?: Record<string, unknown>;
  content?: Record<string, unknown>;
  sections?: unknown[];
}

export interface IInvitationRepository {
  findById(id: string): Promise<InvitationRecord | null>;
  findBySlug(slug: string): Promise<InvitationRecord | null>;
  findByUserId(userId: string): Promise<InvitationRecord[]>;
  countByUserId(userId: string): Promise<number>;
  findPublishedByUserId(userId: string): Promise<InvitationRecord | null>;
  unpublishAllByUserId(userId: string): Promise<void>;
  create(data: Omit<InvitationRecord, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<InvitationRecord>;
  updatePayload(id: string, payload: UpdateInvitationPayload): Promise<InvitationRecord>;
  setPublishStatus(id: string, isPublished: boolean): Promise<InvitationRecord>;
  delete(id: string): Promise<boolean>;
}

