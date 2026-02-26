import { useState } from "react";
import { Link } from "react-router-dom";
import { FileText, Trash2, Plus } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/supabase/client";
import DocumentCard from "@/components/DocumentCard";
import { useAdminDocuments } from "@/hooks/useDocuments";

interface FileInputProps {
  label: string;
  file: File | null;
  setFile: (file: File | null) => void;
}

const FileInput = ({ label, file, setFile }: FileInputProps) => (
    <div className="flex-1">
      <label className="mb-2 block text-sm font-semibold text-gray-700">{label}</label>
      <div className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 transition-hover hover:border-blue-400 hover:bg-blue-50">
        
        {/* Image Preview Overlay */}
        {file ? (
          <div className="relative h-40 w-full overflow-hidden rounded-md">
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <button
              onClick={() => setFile(null)}
              className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-sm hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg className="mx-auto h-10 w-10 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 10MB</p>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="absolute inset-0 cursor-pointer opacity-0"
        />
      </div>
    </div>
  );

const Dashboard = () => {
  const { user } = useAuth();
  const { data: docs = [], isPending, refetch } = useAdminDocuments(user?.id);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSubject, setNewSubject] = useState("General");
  const [newPrice, setNewPrice] = useState("0");
  const [previewFile, setPreviewFile] = useState<File | null>(null);
const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
const [newUniversity, setNewUniversity] = useState("");
const [newDocType, setNewDocType] = useState("Notes");
const [newPages, setNewPages] = useState("0");

const handleUpload = async () => {
  if (!user) return;

  const price = Math.max(0, parseFloat(newPrice) || 0);
  const pages = Math.max(0, parseInt(newPages) || 0);

  if (!newTitle.trim()) {
    toast.error("Title is required");
    return;
  }

  if (!newSubject.trim()) {
    toast.error("Subject is required");
    return;
  }

  if (!previewFile) {
    toast.error("Preview file is required");
    return;
  }

  if (!thumbnailFile) {
    toast.error("Thumbnail image is required");
    return;
  }

  setUploading(true);

  try {
    // ---------- Upload preview ----------
    const previewExt = previewFile.name.split(".").pop();
    const previewPath = `${user.id}/preview-${crypto.randomUUID()}.${previewExt}`;

    const { error: previewError } = await supabase.storage
      .from("examresources")
      .upload(previewPath, previewFile);

    if (previewError) throw previewError;

    const { data: previewUrlData } = supabase.storage
      .from("examresources")
      .getPublicUrl(previewPath);

    // ---------- Upload thumbnail ----------
    const thumbExt = thumbnailFile.name.split(".").pop();
    const thumbPath = `${user.id}/thumb-${crypto.randomUUID()}.${thumbExt}`;

    const { error: thumbError } = await supabase.storage
      .from("examresources")
      .upload(thumbPath, thumbnailFile);

    if (thumbError) throw thumbError;

    const { data: thumbUrlData } = supabase.storage
      .from("examresources")
      .getPublicUrl(thumbPath);

    // ---------- Insert DB record ----------
    const { error: insertError } = await supabase
      .from("documents")
      .insert({
        title: newTitle.trim(),
        description: newDescription.trim() || null,
        subject: newSubject.trim(),
        university: newUniversity.trim() || null,
        doc_type: newDocType,
        price,
        pages,
        preview_url: previewUrlData.publicUrl,
        thumbnail_url: thumbUrlData.publicUrl,
        author_id: user.id,
      });

    if (insertError) throw insertError;

    // ---------- Reset UI ----------
    setNewTitle("");
    setNewDescription("");
    setNewSubject("General");
    setNewUniversity("");
    setNewDocType("Notes");
    setNewPrice("0");
    setNewPages("0");
    setPreviewFile(null);
    setThumbnailFile(null);
    setShowUpload(false);

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
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Document removed.");
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Navbar />
        <div className="container flex flex-1 items-center justify-center">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold text-foreground">
              Admin access required
            </h2>
            <p className="mt-2 text-muted-foreground">
              Only admins can access the dashboard.
            </p>
            <Link
              to="/login"
              className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-6 font-medium text-secondary-foreground"
            >
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
      <div className="px-6 lg:px-16 flex-1 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome, {user.email}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowUpload(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-secondary px-5 text-sm font-medium text-secondary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Add Document
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {[
            { icon: FileText, label: "Documents", value: docs.length },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-xl border bg-card p-5 shadow-card">
              <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4" /> {label}
              </div>
              <p className="font-display text-2xl font-bold text-foreground">
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Upload form */}
        {showUpload && (
          <div className="mb-6 rounded-xl border bg-card p-6 shadow-card">
            <h3 className="mb-4 font-display text-lg font-bold text-foreground">
              Add New Document
            </h3>

            <div className="space-y-4">

  <div>
    <label className="mb-1 block text-sm font-medium">Title</label>
    <input
      type="text"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
      className="h-11 w-full rounded-lg border px-3 text-sm"
    />
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">Description</label>
    <textarea
      value={newDescription}
      onChange={(e) => setNewDescription(e.target.value)}
      rows={3}
      className="w-full rounded-lg border px-3 py-2 text-sm"
    />
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="mb-1 block text-sm font-medium">Subject</label>
      <input
        type="text"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        className="h-11 w-full rounded-lg border px-3 text-sm"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium">University</label>
      <input
        type="text"
        value={newUniversity}
        onChange={(e) => setNewUniversity(e.target.value)}
        className="h-11 w-full rounded-lg border px-3 text-sm"
      />
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    <div>
      <label className="mb-1 block text-sm font-medium">Document Type</label>
      <input
        type="text"
        value={newDocType}
        onChange={(e) => setNewDocType(e.target.value)}
        className="h-11 w-full rounded-lg border px-3 text-sm"
      />
    </div>

    <div>
      <label className="mb-1 block text-sm font-medium">Pages</label>
      <input
        type="number"
        min="0"
        value={newPages}
        onChange={(e) => setNewPages(e.target.value)}
        className="h-11 w-full rounded-lg border px-3 text-sm"
      />
    </div>
  </div>

  <div>
    <label className="mb-1 block text-sm font-medium">Price</label>
    <input
      type="number"
      min="0"
      step="0.01"
      value={newPrice}
      onChange={(e) => setNewPrice(e.target.value)}
      className="h-11 w-full rounded-lg border px-3 text-sm"
    />
  </div>

  {/* <div>
    <label className="mb-1 block text-sm font-medium">Preview File</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setPreviewFile(e.target.files?.[0] ?? null)}
      className="block w-full text-sm"
    />
  </div> */}

  {/* <div>
    <label className="mb-1 block text-sm font-medium">Thumbnail Image</label>
    <input
      type="file"
      accept="image/*"
      onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
      className="block w-full text-sm"
    />
  </div> */}

  <div className="flex flex-col gap-6 lg:flex-row">
      <FileInput 
        label="Preview File" 
        file={previewFile} 
        setFile={setPreviewFile} 
      />
      <FileInput 
        label="Thumbnail Image" 
        file={thumbnailFile} 
        setFile={setThumbnailFile} 
      />
    </div>

  <div className="flex gap-2">
    <button
      type="button"
      disabled={uploading}
      onClick={handleUpload}
      className="h-10 rounded-xl bg-secondary px-5 text-sm font-medium disabled:opacity-50"
    >
      {uploading ? "Uploading…" : "Upload Document"}
    </button>

    <button
      type="button"
      onClick={() => setShowUpload(false)}
      className="h-10 rounded-xl border px-5 text-sm font-medium"
    >
      Cancel
    </button>
  </div>

</div>
          </div>
        )}

        {/* Document list */}
        <div className="rounded-xl border bg-card shadow-card">
          <div className="border-b px-5 py-3">
            <h3 className="font-medium text-foreground">Your Documents</h3>
          </div>

          {isPending ? (
            <div className="p-8 text-center text-muted-foreground">Loading…</div>
          ) : docs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No documents yet. Add your first one!
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-6">
  {docs.map((d) => (
    <div key={d.id} className="relative">
      <DocumentCard document={d} />

      {/* Delete button overlay */}
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
    </div>
  );
};

export default Dashboard;