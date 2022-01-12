import React from "react";
// eslint-disable-next-line import/no-unresolved
import { ChipFilter } from "components/ChipFilter";
import "./index.css";

export type FilterProps = {
  id: string;
  title: string;
  options: any;
  value: any[];
  onChange: () => any;
  style: any;
};

export function Filter({
  id,
  title,
  options,
  value = [],
  onChange,
  ...rest
}: FilterProps) {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div className="filters-container" {...rest}>
      <div className="filters-inner-container">
        <h4 className="filters-label">{title}</h4>
        <ChipFilter
          id={id}
          value={value}
          options={options}
          onChange={onChange}
          className="filters"
        />
      </div>
    </div>
  );
}
