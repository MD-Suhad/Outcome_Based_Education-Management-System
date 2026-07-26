export interface Tenant {
  id: string;
  name: string;
  code: string;
  description?: string;
  logo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TenantConfig {
  tenantId: string;
  features: Feature[];
  settings: Record<string, any>;
}

export interface Feature {
  name: string;
  enabled: boolean;
  tier: 'free' | 'premium' | 'enterprise';
}
