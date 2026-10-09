export interface NewCollaboratorFormData {
  fullName: string;
  department: string;
  period: string;
  vanguardLogin: string;
  vanguardPassword: string;
  vanguardLink: string;
  argusLogin: string;
  argusPassword: string;
  benhubName: string;
  benhubEmail: string;
  benhubPassword: string;
  team: string;
}

export interface PeriodShortcut {
  id: string;
  label: string;
  isCustom?: boolean;
}

export interface EncryptedDraftPayload {
  version: number;
  salt: string; // hex
  iv: string; // hex
  ciphertext: string; // hex
  updatedAt: string;
}

export type TemplateId = 'novo-colaborador';

export interface QuickTemplateMeta {
  id: TemplateId;
  title: string;
  badge: string;
  description: string;
  iconName: string;
}
