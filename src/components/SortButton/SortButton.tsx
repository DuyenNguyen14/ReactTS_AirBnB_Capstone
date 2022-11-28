import React, { MouseEventHandler } from "react";
import { SortKeys, SortOrder } from "../../Hooks/useSortTable";

const defaultStyle = {
  opacity: "0",
};

const sortAscStyles = {
  opacity: "1",
};

const sortDescStyles = {
  opacity: "1",
  transform: "rotate(180deg)",
};

type Props = {
  sortOrder: SortOrder;
  colKey: SortKeys;
  sortKey: SortKeys;
};

export default function SortButton({ sortOrder, colKey, sortKey }: Props) {
  const renderStyles = () => {
    if (!sortOrder || colKey !== sortKey) {
      return defaultStyle;
    }

    if (sortOrder === "asc") {
      return sortAscStyles;
    }
    return sortDescStyles;
  };
  renderStyles();
  return (
    <button style={renderStyles()} className="btn">
      ▲
    </button>
  );
}
