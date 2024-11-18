"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";

const defaultSystems = [
  { name: "Percona Server for MySQL", slug: "Percona+Server+for+MySQL" },
  { name: "PostgreSQL", slug: "PostgreSQL" },
  { name: "MongoDB", slug: "MongoDB" },
];

export default function SystemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [systems, setSystems] = useState(defaultSystems);

  // Read the selected systems from the query params
  useEffect(() => {
    const selected = searchParams.get("selected");
    if (selected) {
      const selectedSystems = selected
        .split(",")
        .map((slug) => defaultSystems.find((sys) => sys.slug === slug))
        .filter(Boolean);
      setSystems(selectedSystems.length > 0 ? selectedSystems : defaultSystems);
    }
  }, [searchParams]);

  const handleSystemClick = (systemSlug) => {
    router.push(`/systems/${systemSlug}}`);
  };

  return (
    <div className="p-52">
      <h1>Available Database Systems</h1>
      <ul>
        {systems.map((system) => (
          <li key={system.slug}>
            <button onClick={() => handleSystemClick(system.slug)}>
              {system.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
