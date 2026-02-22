import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentCard from "@/components/DocumentCard";
import SearchBar from "@/components/SearchBar";
import FilterSelect from "@/components/FilterSelect";
import { documents, courses, subjects, levels } from "@/lib/data";

const Catalog = () => {
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [subject, setSubject] = useState("");
  const [level, setLevel] = useState("");

  const filtered = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        !search ||
        doc.title.toLowerCase().includes(search.toLowerCase()) ||
        doc.description.toLowerCase().includes(search.toLowerCase()) ||
        doc.author.toLowerCase().includes(search.toLowerCase());
      const matchesCourse = !course || doc.course === course;
      const matchesSubject = !subject || doc.subject === subject;
      const matchesLevel = !level || doc.level === level;
      return matchesSearch && matchesCourse && matchesSubject && matchesLevel;
    });
  }, [search, course, subject, level]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="px-6 lg:px-16 flex-1 py-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">Browse Materials</h1>
        <p className="mb-6 text-muted-foreground">
          {filtered.length} document{filtered.length !== 1 ? "s" : ""} available
        </p>

        {/* Filters */}
        <div className="mb-8 grid gap-4 rounded-xl border bg-card p-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Search</label>
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <FilterSelect label="Course" value={course} options={courses} onChange={setCourse} />
          <FilterSelect label="Subject" value={subject} options={subjects} onChange={setSubject} />
          <FilterSelect label="Level" value={level} options={levels} onChange={setLevel} />
        </div>

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((doc) => (
              <DocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-foreground">No documents found</p>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Catalog;
