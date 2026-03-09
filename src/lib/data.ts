export interface Document {
  id: string
  title: string
  description: string | null
  subject: string
  doc_type: string
  price: number
  pages: number | null
  preview_urls: string[] | null
  created_at: string

  packages?: {
    id: string
    title: string
  } | null
}

export interface PackageDocumentJoin {
  documents: Document;
}

export interface PackageWithJoin {
  id: string;
  title: string;
  description: string | null;
  package_documents: PackageDocumentJoin[];
}