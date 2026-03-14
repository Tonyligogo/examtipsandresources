import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Trash2, Plus, Building2, Package } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { supabase } from "@/supabase/client";
import DocumentCard from "@/components/DocumentCard";
import { useAdminDocuments } from "@/hooks/useDocuments";
import { useDeletePackage, usePackages } from "@/hooks/usePackages";
import { useInstitutions } from "@/hooks/useInstitutions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import CreatePackageModal from "@/components/CreatePackageModal";
import CreateInstitutionModal from "@/components/CreateInstitution";
import type { User } from "@supabase/supabase-js";

interface FileInputProps {
  label: string;
  files: File[];
  setFiles: (files: File[]) => void;
}

const FileInput = ({ label, files, setFiles }: FileInputProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    const fileToRemove = files[index];
    if (fileToRemove) {
      URL.revokeObjectURL(URL.createObjectURL(fileToRemove));
    }
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-semibold text-gray-700">
        {label}
      </label>
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-4 transition-colors hover:border-gray-300">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {files.map((file, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border bg-white shadow-sm">
              <img
                src={URL.createObjectURL(file)}
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
                alt="preview"
              />
              <button
                type="button"
                onClick={() => removeFile(i)}
                className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform hover:scale-110 active:scale-95"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <div className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white backdrop-blur-sm">
                {(file.size / 1024).toFixed(0)} KB
              </div>
            </div>
          ))}
          <label className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-white text-gray-500 transition-all hover:border-secondary hover:bg-secondary/5 hover:text-secondary">
            <Plus className="h-6 w-6" />
            <span className="text-xs font-medium">Add Image</span>
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>
        {files.length === 0 && (
          <p className="mt-4 text-center text-xs text-gray-400">
            No images selected. PNG, JPG or WebP allowed.
          </p>
        )}
      </div>
    </div>
  );
};

// ── Dashboard ──────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const [user, setUser] = useState<User|null>(null);
  const navigate = useNavigate();
  useEffect(()=>{
      const getUser = async () =>{
          const { data: { user } } = await supabase.auth.getUser()
          console.log('my user',user)
          if(!user){
            navigate('/');
          };
          setUser(user);
      }
      getUser();
    },[]);
  const { data: documents = [], isPending, refetch } = useAdminDocuments(user?.id);
  const { mutate: deletePkg } = useDeletePackage();
  const { data: packages = [], refetch: refetchPackages } = usePackages();
  const { data: institutions = [], refetch: refetchInstitutions } = useInstitutions();
  const docs = documents?.map((doc) => ({
  ...doc,
  packages: doc.package_documents?.[0]?.packages ?? null
}));

  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [openCreatePackage, setOpenCreatePackage] = useState(false);
  const [openCreateInstitution, setOpenCreateInstitution] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSubject, setNewSubject] = useState("General");
  const [newPrice, setNewPrice] = useState("0");
  const [previewFiles, setPreviewFiles] = useState<File[]>([]);
  const [newDocType, setNewDocType] = useState("Notes");
  const [newPages, setNewPages] = useState("0");

  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const handleUpload = async () => {
    if (!user) return;
    const price = Math.max(0, parseFloat(newPrice) || 0);
    const pages = Math.max(0, parseInt(newPages) || 0);
    if (!newTitle.trim()) { toast.error("Title is required"); return; }
    if (previewFiles.length === 0) { toast.error("Add at least one preview image"); return; }
    setUploading(true);
    try {
      const folder = `${user.id}/${slugify(newTitle)}-${crypto.randomUUID()}`;
      const previewUrls: string[] = [];
      for (let i = 0; i < previewFiles.length; i++) {
        const file = previewFiles[i];
        const ext = file.name.split(".").pop();
        const path = `${folder}/preview-${i + 1}.${ext}`;
        const { error } = await supabase.storage.from("examresources").upload(path, file);
        if (error) throw error;
        const { data } = supabase.storage.from("examresources").getPublicUrl(path);
        previewUrls.push(data.publicUrl);
      }
      const {data:newDoc, error: insertError } = await supabase.from("documents").insert({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        subject: newSubject.trim(),
        doc_type: newDocType,
        price,
        pages,
        preview_urls: previewUrls,
        author_id: user.id,
      })
      .select()
      .single();
      if (insertError) throw insertError;
      if (!newDoc) throw new Error("Document creation failed");
      // link to package
      if (selectedPackage) {
        const { error: joinError } = await supabase
          .from("package_documents")
          .insert({
            package_id: selectedPackage,
            document_id: newDoc.id
          });

        if (joinError) throw joinError;
      }
      setNewTitle(""); setNewDescription(""); setNewSubject("General");
      setNewDocType("Notes"); setNewPrice("0");
      setNewPages("0"); setPreviewFiles([]); setShowUpload(false);
      toast.success("Document uploaded!");
      refetch();
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("documents").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Document removed.");
    refetch();
  };

  const handleDeleteInstitution = async (id: string) => {
    const { error } = await supabase.from("institutions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Institution removed.");
    refetchInstitutions();
  };

  if (!user || user.role !== "authenticated") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">Admin access required</h2>
            <p className="mt-2 text-muted-foreground">Only admins can access the dashboard.</p>
            <Link to="/login" className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-6 font-medium text-secondary-foreground">
              Sign In
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="px-4 lg:px-16 flex-1 py-8">

        {/* Header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-sm text-muted-foreground">Welcome, {user.email}</p>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-2">
            <button
              type="button"
              onClick={() => setShowUpload(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md border px-5 text-sm"
            >
              <Plus className="h-4 w-4" />
              Add Document
            </button>
            <button
              type="button"
              onClick={() => setOpenCreatePackage(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md border px-5 text-sm"
            >
              <Package className="h-4 w-4" />
              Add Package
            </button>
            <button
              type="button"
              onClick={() => setOpenCreateInstitution(true)}
              className="inline-flex h-10 items-center gap-2 rounded-md border px-5 text-sm"
            >
              <Building2 className="h-4 w-4" />
              Add Institution
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileText, label: "Documents", value: docs.length },
            { icon: Building2, label: "Institutions", value: institutions.length },
            { icon: Package, label: "Packages", value: packages.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" /> {label}
              </div>
              <p className="font-display text-2xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="mb-6 rounded-xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">Add New Document</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Title</label>
                <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Description</label>
                <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} rows={3} className="w-full rounded-lg border px-3 py-2 text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Subject</label>
                  <input type="text" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Document Type</label>
                  <input type="text" value={newDocType} onChange={(e) => setNewDocType(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Pages</label>
                  <input type="number" min="0" value={newPages} onChange={(e) => setNewPages(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-sm" />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Price</label>
                  <input type="number" min="0" step="0.01" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="h-11 w-full rounded-lg border px-3 text-sm" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Package</label>
                <Select value={selectedPackage || ""} onValueChange={(value) => { if (value === "create-new") { setOpenCreatePackage(true); return; } setSelectedPackage(value); }}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Select package (optional)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Package</SelectItem>
                    {packages.map((pkg) => (<SelectItem key={pkg.id} value={pkg.id}>{pkg.title}</SelectItem>))}
                    <SelectItem value="create-new">+ Create New Package</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-6 lg:flex-row">
                <FileInput label="Preview Images" files={previewFiles} setFiles={setPreviewFiles} />
              </div>
              <div className="flex gap-2">
                <button type="button" disabled={uploading} onClick={handleUpload} className="h-10 rounded-xl bg-secondary px-5 text-sm font-medium disabled:opacity-50">
                  {uploading ? "Uploading…" : "Upload Document"}
                </button>
                <button type="button" onClick={() => setShowUpload(false)} className="h-10 rounded-xl border px-5 text-sm font-medium">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Institutions list */}
        <div className="mb-6 rounded-xl border bg-card shadow-card">
          <div className="flex items-center justify-between border-b px-5 py-3">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <h3 className="font-medium text-foreground">Institutions</h3>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
              {institutions.length}
            </span>
          </div>

          {institutions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No institutions yet.{" "}
              <button
                type="button"
                onClick={() => setOpenCreateInstitution(true)}
                className="underline underline-offset-2 hover:no-underline"
              >
                Add your first one.
              </button>
            </div>
          ) : (
            <ul className="divide-y">
              {institutions.map((inst) => (
                <li key={inst.id} className="flex items-center justify-between px-3 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-foreground">{inst.title}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteInstitution(inst.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mb-6 rounded-xl border bg-card shadow-card">
  <div className="flex items-center justify-between border-b px-5 py-3">
    <div className="flex items-center gap-2">
      <Package className="h-4 w-4 text-muted-foreground" />
      <h3 className="font-medium text-foreground">Packages</h3>
    </div>
    <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
      {packages.length}
    </span>
  </div>

  {packages.length === 0 ? (
    <div className="p-8 text-center text-muted-foreground">
      No packages yet.
    </div>
  ) : (
    <ul className="divide-y">
      {packages.map((pkg) => (
        <li key={pkg.id} className="flex items-center justify-between px-5 py-3">
          <div>
            <p className="text-sm font-medium text-foreground">{pkg.title}</p>
            {pkg.description && (
              <p className="text-xs text-muted-foreground">{pkg.description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => deletePkg(pkg.id)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </li>
      ))}
    </ul>
  )}
</div>

        {/* Document list */}
        <div className="rounded-xl border bg-card shadow-card">
          <div className="border-b px-5 py-3">
            <h3 className="font-medium text-foreground">Your Documents</h3>
          </div>
          {isPending ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No documents yet. Add your first one!</div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
              {docs.map((d) => (
                <div key={d.id} className="relative">
                  <DocumentCard document={d} />
                  <button
                    type="button"
                    onClick={() => handleDelete(d.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-md bg-white/90 text-destructive shadow hover:bg-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />

      {openCreatePackage && (
        <CreatePackageModal
          onClose={() => setOpenCreatePackage(false)}
          onCreated={(pkg) => { refetchPackages(); setSelectedPackage(pkg.id); setOpenCreatePackage(false); }}
        />
      )}

      {openCreateInstitution && (
        <CreateInstitutionModal
          onClose={() => setOpenCreateInstitution(false)}
          onCreated={() => refetchInstitutions()}
        />
      )}
    </div>
  );
};

export default Dashboard;