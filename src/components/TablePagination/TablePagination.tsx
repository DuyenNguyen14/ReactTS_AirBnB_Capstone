import React, { useState } from "react";
import _ from "lodash";

type Props = {
  totalRow: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  pageSize: number;
};

export default function TablePagination({
  totalRow,
  currentPage,
  setCurrentPage,
  pageSize,
}: Props) {
  const pageCount = totalRow > 0 ? Math.ceil(totalRow / pageSize) : 0;

  const pages = _.range(1, pageCount + 1);

  return (
    <nav className="d-flex justify-content-end">
      <ul className="pagination">
        <li className="page-item">
          <button
            className={currentPage - 1 <= 0 ? "d-none" : "page-link"}
            onClick={() => setCurrentPage(1)}
          >
            {"<<"}
          </button>
        </li>
        <li className="page-item">
          <button
            className={currentPage - 1 <= 0 ? "d-none" : "page-link"}
            onClick={() =>
              setCurrentPage(
                currentPage - 1 <= 0 ? currentPage : currentPage - 1
              )
            }
          >
            {"<"}
          </button>
        </li>
        {pages.map((page) => (
          <li
            className={page === currentPage ? "page-item active" : "page-item"}
            key={page}
            style={{ cursor: "pointer" }}
            onClick={() => setCurrentPage(page)}
          >
            <button className="page-link">{page}</button>
          </li>
        ))}
        <li className="page-item">
          <button
            className={pages.length - currentPage <= 0 ? "d-none" : "page-link"}
            onClick={() =>
              setCurrentPage(
                currentPage + 1 > pageCount ? currentPage : currentPage + 1
              )
            }
          >
            {">"}
          </button>
        </li>
        <li className="page-item">
          <button
            className={pages.length - currentPage <= 0 ? "d-none" : "page-link"}
            onClick={() => setCurrentPage(pages.slice(-1)[0])}
          >
            {">>"}
          </button>
        </li>
      </ul>
    </nav>
  );
}
