import { cn } from "@/lib/utils";

const licenseTypes = [
  { id: 1, name: "Telecommunications", icon: "📡", color: "from-blue-500/20" },
  { id: 2, name: "Radio & Spectrum", icon: "📻", color: "from-cyan-500/20" },
  { id: 3, name: "Postal Services", icon: "📦", color: "from-indigo-500/20" },
  { id: 4, name: "Broadcasting", icon: "📺", color: "from-purple-500/20" },
];

export default function LicensingPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-8">
      {/* Background Gradient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto py-12">
        <h1 className="text-4xl font-bold mb-2">Licensing Portal</h1>
        <p className="text-slate-400 mb-12">Select a sector to view available licenses and application forms.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {licenseTypes.map((item) => (
            <div 
              key={item.id}
              className="relative group p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="text-5xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold mb-2">{item.name}</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                Apply for {item.name.toLowerCase()} certificates and regulatory permits.
              </p>
              <button className="px-4 py-2 bg-blue-600/20 border border-blue-500/50 rounded-full text-blue-400 text-xs font-bold uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
                Select Sector
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}