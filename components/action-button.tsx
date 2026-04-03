import { ReactNode, MouseEventHandler } from "react";

interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: string;
}

export default function ActionButton({
  label,
  icon,
  onClick,
  color,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 bg-slate-800/40 border border-white/5 rounded-xl transition-all duration-200 group ${color} hover:translate-x-1`}
    >
      <span className="font-medium">{label}</span>
      <div
        className={`p-2 rounded-lg bg-slate-700/50 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
    </button>
  );
}
