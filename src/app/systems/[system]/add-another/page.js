import Link from "next/link";

export default function AddAnotherPage({ params, searchParams }) {
  const { system } = params;
  const selected = searchParams.selected || "";

  return (
    <div className="p-52">
      <h1>Add Another System to {system.replace(/\+/g, " ")}</h1>
      <Link href={`/systems?selected=${selected}`}>
        <button>Back to Systems List</button>
      </Link>
    </div>
  );
}
