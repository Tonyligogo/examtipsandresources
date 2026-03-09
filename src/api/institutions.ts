import { supabase } from "@/supabase/client";

export const createInstitution = async (institution: {
  title: string;
}) => {
  const { data, error } = await supabase
    .from("institutions")
    .insert(institution)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const updateInstitution = async (id: string, updates: {
  title: string;
}) => {
  const { data, error } = await supabase
    .from("institutions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
};

export const deleteInstitutions = async (id: string) => {
  const { error } = await supabase
    .from("institutions")
    .delete()
    .eq("id", id);

  if (error) throw error;
};