export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  roles?: string[];
  permissions?: string[];
  department?: string;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  phone?: string;
  address?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  darkMode: boolean;
  language: string;
  notifications: boolean;
  emailAlerts: boolean;
}
