import { useState } from "react";
import PackageCard from "@/components/PackageCard";
import { usePackages } from "@/hooks/usePackages";
import type { PackageWithJoin } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


export default function PackagesPage() {
    const {data:packages} = usePackages();
  const [search, setSearch] = useState("");
  const formatted = packages?.map((pkg: PackageWithJoin) => ({
      ...pkg,
      documents: pkg.package_documents.map((pd) => pd.documents),
    }));

  const filtered = formatted?.filter((pkg) =>
    pkg.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <div className="px-6 lg:px-16 flex-1 py-8 space-y-3">
        <h1 className="text-3xl font-bold text-foreground">
          Packages
        </h1>
      {/* Search */}
      <input
        placeholder="Search packages..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border rounded-md p-2 w-full max-w-md"
      />

      {/* Packages */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

        {filtered?.map((pkg) => (
          <PackageCard key={pkg.id} pkg={pkg} />
        ))}

      </div>
        </div>

      <Footer />
    </div>
  );
}