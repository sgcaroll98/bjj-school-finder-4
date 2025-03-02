export interface School {
  id: string;
  place_id: string;
  name: string;
  description: string | null;
  website: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  zipcode: string | null;
  latitude: number | null;
  longitude: number | null;
  featured_image: string | null;
  link: string | null;
  schedule_image: string | null;
  is_premium: boolean;
  premium_until: string | null;
  is_lifetime: boolean;
  
  // Premium fields
  has_gi?: boolean;
  has_nogi?: boolean;
  has_kids?: boolean;
  has_showers?: boolean;
  has_open_mat?: boolean;
  has_competition_training?: boolean;
  has_womens_only_classes?: boolean;
  has_beginner_classes?: boolean;
  has_morning_classes?: boolean;
  has_evening_classes?: boolean;
  has_weekend_classes?: boolean;
  has_weight_room?: boolean;
  has_laundry?: boolean;
  has_air_conditioning?: boolean;
  
  // Complex data
  schedule?: ScheduleData;
  programs?: Program[];
  instructors?: Instructor[];
  gallery?: GalleryImage[];
  youtube_videos?: YouTubeVideo[];
}

export interface Program {
  id: string;
  name: string;
  description: string;
  image_url?: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  image_url: string;
  credentials: string[];
}

export interface ScheduleData {
  [day: string]: ClassSession[];
}

export interface ClassSession {
  start_time: string;
  end_time: string;
  class_name: string;
  instructor: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt_text?: string;
}

export interface YouTubeVideo {
  id: string;
  youtube_id: string;
  title: string;
}
