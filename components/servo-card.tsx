export default function ServoCard({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  // Calcul du pourcentage (0-180° par défaut pour un servo standard)
  const percentage = Math.min(Math.max((value / 180) * 100, 0), 100);

  return (
    <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
      <div className="flex justify-between items-end mb-2">
        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          {name}
        </span>
        <span className="text-xl font-mono font-semibold text-white">
          {value}°
        </span>
      </div>
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-linear-to-r from-blue-600 to-blue-400 transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
