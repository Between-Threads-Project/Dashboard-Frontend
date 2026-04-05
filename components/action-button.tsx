import { ReactNode, MouseEventHandler } from "react";

interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
  color?: string;
  disabled?: boolean;
}

export default function ActionButton({
  label,
  icon,
  onClick,
  color,
  disabled,
}: ActionButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-200 group
        ${color || "text-white"}
        ${
          disabled
            ? "bg-slate-900/20 border-white/5 opacity-50 cursor-not-allowed grayscale-[0.5]"
            : "bg-slate-800/40 border-white/10 hover:translate-x-1 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        }
      `}
    >
      <span className="font-medium text-left">{label}</span>
      <div
        className={`
          p-2 rounded-lg bg-slate-700/50 transition-transform
          ${!disabled ? "group-hover:scale-110" : ""}
        `}
      >
        {icon}
      </div>
    </button>
  );
}
