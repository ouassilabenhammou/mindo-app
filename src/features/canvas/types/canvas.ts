export interface Deadline {
  id: number;
  title: string;
  course_id: number;
  course_name: string;
  course_code: string;
  due_at: string | null;
  points_possible: number | null;
  url: string;
  submission_types: string[];
  submitted: boolean;
  overdue: boolean;
}

export interface CanvasResponse {
  deadlines: Deadline[];
  fetched_at: string;
  total: number;
}
