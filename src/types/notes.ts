
export interface Note {
  id: string;
  title: string;
  content: string;
  drawings?: string; // base64 canvas data
  createdAt: Date;
  updatedAt: Date;
}
