import clsx from "clsx";

import "./index.css";

export type ChipProps = {
  active: boolean;
  value: string[];
  label: string;
  onClick: (value: any) => any;
};
export function Chip({ active, value, label, onClick }: ChipProps) {
  return (
    <div className={clsx("chip-root", { active })}>
      <button
        type="button"
        className="chip-label"
        onClick={() => onClick(value)}
      >
        {label}
      </button>
    </div>
  );
}
