import { useQuery } from "@tanstack/react-query";
import { fetchAdminDocuments, fetchDocumentById, fetchAllDocuments } from "@/api/documents";

export const useAdminDocuments = (userId?: string) => {
  return useQuery({
    queryKey: ["admin-documents", userId],
    queryFn: () => fetchAdminDocuments(userId!),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
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
    queryKey: ["all-documents"],
    queryFn: () => fetchAllDocuments(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};