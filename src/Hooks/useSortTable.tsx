import React, { ReactPropTypes, useCallback, useState } from "react";
import { User } from "../redux/reducers/authReducer";
import { Room } from "../redux/reducers/roomReducer";

export type SortKeys = string;

export type SortOrder = "asc" | "desc" | null;

type Props = {
  tableData: any;
};

export default function useSortTable(tableData: any) {
  const [sortKey, setSortKey] = useState<any>("id");

  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = ({
    tableData,
    sortKey,
    reverse,
  }: {
    tableData: any;
    sortKey: SortKeys;
    reverse: boolean;
  }) => {
    if (tableData.length > 0) {
      if (!sortKey || !sortOrder) return tableData;

      const sortedData = [...tableData].sort((a, b) => {
        if (sortKey === "tenPhong" || sortKey === "moTa") {
          return a[sortKey].toLowerCase() > b[sortKey].toLowerCase() ? 1 : -1;
        }

        return a[sortKey] > b[sortKey] ? 1 : -1;
      });

      if (reverse) {
        return sortedData.reverse();
      }

      return sortedData;
    }
  };

  const sortedData = useCallback(
    () =>
      tableData.length > 0 &&
      handleSort({
        tableData: tableData,
        sortKey,
        reverse: sortOrder === "desc",
      }),
    [tableData, sortKey, sortOrder]
  );

  const changeSort = (key: string) => {
    if (sortKey !== key && sortOrder) {
      setSortOrder("asc");
      setSortKey(key);
    } else {
      if (!sortOrder) {
        setSortOrder("asc");
      }

      if (sortOrder) {
        setSortOrder(sortOrder === "asc" ? "desc" : null);
      }
    }
    setSortKey(key);
  };

  return { sortedData, changeSort, handleSort, sortOrder, sortKey };
}
