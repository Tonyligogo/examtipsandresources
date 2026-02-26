import { useQuery } from "@tanstack/react-query";
import { fetchAdminDocuments, fetchDocumentById, fetchAllDocuments, fetchFeaturedDocuments } from "@/api/documents";

export const useAdminDocuments = (userId?: string) => {
  return useQuery({
    queryKey: ["adminDocuments", userId],
    queryFn: () => fetchAdminDocuments(userId!),
    enabled: !!userId,
  });
};

export const useSingleDocument = (id?: string) => {
  return useQuery({
    queryKey: ["document", id],
    queryFn: () => fetchDocumentById(id!),
    enabled: !!id,
  });
};

export const useAllDocuments = () => {
  return useQuery({
    queryKey: ["allDocuments"],
    queryFn: () => fetchAllDocuments(),
  });
};

export const useFeaturedDocuments = () => {
  return useQuery({
    queryKey: ["featuredDocuments"],
    queryFn: () => fetchFeaturedDocuments(),
  });
};