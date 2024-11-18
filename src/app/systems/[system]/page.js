import Link from "next/link";

export default function SystemPage({ params, searchParams }) {
  const { system } = params;
  const selected = searchParams.selected || "";

  return (
    <div className="p-52  ">
      <h1>Details for {system.replace(/\+/g, " ")}</h1>
      <Link href={`/systems/${system}/add-another?selected=${selected}`}>
        <button>Add Another System</button>
      </Link>
    </div>
  );
}
