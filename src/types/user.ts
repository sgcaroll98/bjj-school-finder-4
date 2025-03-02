export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'school_owner' | 'admin';
}

export interface UserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  bio?: string;
  website?: string;
  created_at?: string;
  updated_at?: string;
}
