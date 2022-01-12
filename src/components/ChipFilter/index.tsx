// eslint-disable-next-line import/no-unresolved
import { Chip } from "components/Chip";

import clsx from "clsx";
import "./index.css";

export type ChipFilterProps = {
  id: string;
  className: string;
  options: [
    {
      value: string[];
      label: string;
    }
  ];
  value: any[];
  onChange: (id: string, value: any) => any;
};

export function ChipFilter({
  id,
  className,
  options,
  value = [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
}: ChipFilterProps) {
  return (
    <div className={clsx("chip-filter-root", className)}>
      {options.map((opt) => (
        <Chip
          key={opt.value[0]}
          label={opt.label}
          value={opt.value}
          active={value.includes(opt.value)}
          onClick={() => onChange(id, opt.value)}
        />
      ))}
    </div>
  );
}
