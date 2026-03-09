import { useState } from "react";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { useCreatePackage } from "@/hooks/usePackages";

interface Package {
  id: string;
  title: string;
  description: string | null;
  created_at?: string;
}

interface CreatePackageModalProps {
  onClose: () => void;
  onCreated?: (pkg: Package) => void;
}

const CreatePackageModal = ({ onClose, onCreated }: CreatePackageModalProps) => {
  const { mutateAsync: createPackageMutation, isPending } = useCreatePackage();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleCreatePackage = async () => {
    if (!name.trim()) {
      toast.error("Package name is required");
      return;
    }
    
    try {
      console.log('called')
        const pkg = await createPackageMutation({
            title: name.trim(),
            description: description.trim() || undefined,
        });

      toast.success("Package created!");

      setName("");
      setDescription("");

      onCreated?.(pkg);
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Failed to create package");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40">
      <div className="w-105 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-lg font-semibold">Create Package</h2>

        <Input
          placeholder="Package name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          placeholder="Package description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-3"
        />

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleCreatePackage}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm text-white disabled:opacity-50"
          >
            {isPending ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePackageModal;