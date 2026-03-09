import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { useCreateInstitution, useUpdateInstitution } from "@/hooks/useInstitutions";

interface Institution {
  id: string;
  title: string;
  created_at?: string;
}

interface CreateInstitutionModalProps {
  onClose: () => void;
  onCreated?: (institution: Institution) => void;
  onUpdated?: (institution: Institution) => void;
  existing?: Institution;
}

const CreateInstitutionModal = ({
  onClose,
  onCreated,
  onUpdated,
  existing,
}: CreateInstitutionModalProps) => {
  const isEditing = !!existing;

  const { mutateAsync: createInstitution, isPending: isCreating } = useCreateInstitution();
  const { mutateAsync: updateInstitution, isPending: isUpdating } = useUpdateInstitution();

  const isPending = isCreating || isUpdating;

  const [title, setTitle] = useState(existing?.title ?? "");

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error("Institution name is required");
      return;
    }

    try {
      if (isEditing) {
        const updated = await updateInstitution({ id: existing.id, title: title.trim() });
        toast.success("Institution updated!");
        onUpdated?.(updated);
      } else {
        console.log('this called')
        const created = await createInstitution({ title: title.trim() });
        toast.success("Institution created!");
        onCreated?.(created);
      }
      onClose();
    } catch (err) {
      console.error(err);
      toast.error(isEditing ? "Failed to update institution" : "Failed to create institution");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-105 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">
          {isEditing ? "Edit Institution" : "Create Institution"}
        </h2>

        <Input
          placeholder="Institution name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isPending
              ? isEditing ? "Saving..." : "Creating..."
              : isEditing ? "Save" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateInstitutionModal;