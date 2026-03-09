import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import { useAllDocuments } from "@/hooks/useDocuments";
import { Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

const Catalog = () => {
  const { data: documents = [], isPending } = useAllDocuments();
  const docs = documents?.map((doc) => ({
  ...doc,
  packages: doc.package_documents?.[0]?.packages ?? null
}));
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
const subject = params.get("subject") || "";
const type = params.get("type") || "";
  const [searchTerm, setSearchTerm] = useState(search);

  const debouncedSearch = useDebounce(searchTerm, 500);

 useEffect(() => {
  const newParams = new URLSearchParams(params);

  if (debouncedSearch) {
    newParams.set("search", debouncedSearch);
  } else {
    newParams.delete("search");
  }

  setParams(newParams);
}, [debouncedSearch]);

  // ---------- Filtering ----------
  const filtered = useMemo(() => {
  return docs.filter((doc) => {
    const matchesSearch =
      !search ||
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      (doc.description ?? "").toLowerCase().includes(search.toLowerCase());

    const matchesSubject =
      !subject || doc.subject.toLowerCase() === subject.toLowerCase();

    const matchesType =
      !type || doc.doc_type.toLowerCase() === type.toLowerCase();

    return matchesSearch && matchesSubject && matchesType;
  });
}, [docs, search, subject, type]);

const subjects = [...new Set(docs.map((d) => d.subject))];

const types = [...new Set(docs.map((d) => d.doc_type))];

const updateParam = (key: string, value: string) => {
  const newParams = new URLSearchParams(params);

  if (value) {
    newParams.set(key, value);
  } else {
    newParams.delete(key);
  }

  setParams(newParams);
};

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="px-6 lg:px-16 flex-1 py-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          Browse Materials
        </h1>

        <p className="mb-6 text-muted-foreground">
          {isPending
            ?  <Loader2 className="animate-spin"/>
            : `${filtered.length} document${filtered.length !== 1 ? "s" : ""} available`}
        </p>

        {/* Filters */}
        <div className="mb-8 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">
              Search
            </label>
            <SearchBar
  value={searchTerm}
  onChange={(value) => setSearchTerm(value)}
/>
          </div>

          <FilterSelect
  label="Subject"
  value={subject}
  options={subjects}
  onChange={(value) => updateParam("subject", value)}
/>
<FilterSelect
  label="Type"
  value={type}
  options={types}
  onChange={(value) => updateParam("type", value)}
/>
        </div>

        {/* Results */}
        {isPending ? (
          <div className="py-20 text-center text-muted-foreground">
            <Loader2 className="animate-spin"/>
          </div>
        ) : filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              No documents found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;