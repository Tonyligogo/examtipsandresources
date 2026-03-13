import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/supabase/client";
import { createInstitution, updateInstitution } from "@/api/institutions";

export const useInstitutions = () => {
  return useQuery({
    queryKey: ["institutions"],
    queryFn: async () => {
      const { data } = await supabase
        .from("institutions")
        .select("*")
        .throwOnError()
        .order("created_at", { ascending: false });

      return data;
    },
  });
};

export const useCreateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInstitution,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institutions"],
      });
    },
  });
};

export const useUpdateInstitution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) => updateInstitution(id, { title }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["institutions"],
      });
    },
  });
};