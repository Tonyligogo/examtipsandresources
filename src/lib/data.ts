export interface Document {
   id: string;
  title: string;
  description: string | null;
  subject: string;
  university: string | null;
  doc_type: string;
  price: number;
  pages: number | null;
  preview_url: string | null;
  thumbnail_url: string | null;
  created_at: string;
}
