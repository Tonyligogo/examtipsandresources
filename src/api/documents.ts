import { supabase } from "@/supabase/client";

export const fetchAdminDocuments = async (userId: string) => {
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("author_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data;
};

export const fetchAllDocuments = async () => {
  const { data, error } = await supabase
    .from("documents")
    .select("*");

  if (error) throw new Error(error.message);
  return data;
};

export const fetchDocumentById = async (id:string) => {
  const { data, error } = await supabase
        .from("documents")
        .select("*")
        .eq("id", id)
        .single();

  if (error) throw new Error(error.message);
  return data;
};

export const fetchFeaturedDocuments = async () => {
  const { data, error } = await supabase
        .from("documents")
        .select("*")
        .limit(8);

  if (error) throw new Error(error.message);
  return data;
};