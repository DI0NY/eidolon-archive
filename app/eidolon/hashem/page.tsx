import NavBar from "../../components/NavBar";

export default function Hashem() {
  return (
    <div className="min-h-screen bg-neutral-100 text-black">
      <NavBar />
      <div className="p-10">
        <h1 className="text-3xl font-mono mb-6">Hashem — Landing</h1>
        <p className="max-w-2xl leading-8">
          He opened his eyes. The surface was white. The structure beneath
          remained unresolved.
        </p>
      </div>
    </div>
  );
}