export interface Project {
  id: string;
  user_id: string;
  title: string;
  effort: number;
  benefit: number;
  discovery_scope?: string;
  complexity_factors?: string;
  blockers?: string;
  needs_dependencies?: string;
  next_steps?: string;
  research_focus?: string;
  assigned_date?: string;
  color_index: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  user_id: string;
  filename: string;
  file_type: string;
  file_size?: number;
  storage_path: string;
  is_image: boolean;
  created_at: string;
}

export const PROJECT_COLORS = [
  'hsl(220, 100%, 60%)', // Blue
  'hsl(160, 100%, 40%)', // Green
  'hsl(30, 100%, 50%)',  // Orange
  'hsl(280, 100%, 60%)', // Purple
  'hsl(0, 100%, 60%)',   // Red
  'hsl(50, 100%, 50%)',  // Yellow
  'hsl(190, 100%, 50%)', // Cyan
  'hsl(320, 100%, 60%)', // Pink
  'hsl(120, 100%, 40%)', // Lime
  'hsl(260, 100%, 70%)', // Violet
];