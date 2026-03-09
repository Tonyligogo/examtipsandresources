import { supabase } from "@/supabase/client";

export const createPackage = async (pkg: {
  title: string;
  description?: string;
}) => {
  const { data, error } = await supabase
    .from("packages")
    .insert(pkg)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updatePackage = async (id: string, updates: {
  title?: string;
  description?: string;
  price?: number;
  author_id?: string;
}) => {
  const { data, error } = await supabase
    .from("packages")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deletePackage = async (id: string) => {
  const { error } = await supabase
    .from("packages")
    .delete()
    .eq("id", id);

  if (error) throw error;
};