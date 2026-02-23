import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-full flex items-center gap-3 p-4">
      <Link
        href="/eidolon"
        className="font-mono text-sm px-3 py-1 border border-current hover:bg-black hover:text-white transition"
      >
        INDEX
      </Link>

      <Link
        href="/eidolon/expedition"
        className="font-mono text-sm px-3 py-1 border border-current hover:bg-black hover:text-white transition"
      >
        EXPEDITION
      </Link>

      <Link
        href="/eidolon/hashem"
        className="font-mono text-sm px-3 py-1 border border-current hover:bg-black hover:text-white transition"
      >
        HASHEM
      </Link>
    </div>
  );
}