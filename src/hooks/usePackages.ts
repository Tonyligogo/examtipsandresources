import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { createPackage, deletePackage } from "@/api/packages";

export const usePackages = () => {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select(`
      id,
      title,
      description,
      package_documents(
        documents(*)
      )
    `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      return data;
    },
  });
};

export const useCreatePackage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPackage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["packages"],
      });
    },
  });
};

export const useDeletePackage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["packages"] });
    },
  });
};