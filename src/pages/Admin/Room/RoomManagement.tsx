import React, { useEffect, useRef, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { getAllRoomsApi, Room } from "../../../redux/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configStore";
import FormViewDetailRoom from "./RoomEditForm";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal } from "react-bootstrap";
import { useFormikContext } from "formik";
import RoomAddNewForm from "./RoomAddNewForm";
import RoomEditForm from "./RoomEditForm";
import { getLocationsApi } from "../../../redux/reducers/locationsReducer";

const columnHelper = createColumnHelper<Room>();

const columns = [
  columnHelper.accessor("id", {
    header: () => "ID",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("tenPhong", {
    header: () => "Tên phòng",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor("hinhAnh", {
    header: () => "Hình ảnh",
    cell: (info) => (
      <LazyLoadImage
        src={`${info.renderValue()}`}
        alt={info.row.original.tenPhong}
        style={{ width: "250px" }}
        effect="blur"
      />
    ),
  }),
  columnHelper.accessor("moTa", {
    header: () => "Mô tả",
    cell: (info) => {
      const moTa = info.renderValue();
      return moTa?.slice(0, 100) + "...";
    },
  }),
  columnHelper.accessor("giaTien", {
    header: () => "Giá tiền",
    cell: (info) => `$${info.renderValue()}`,
  }),
];

type Props = {};

export default function RoomManagement({}: Props) {
  const { arrRooms, room } = useSelector(
    (state: RootState) => state.roomReducer
  );

  const [openModal, setOpenModal] = useState(false);

  const [isAddNew, setIsAddNew] = useState(false);

  const [sorting, setSorting] = useState<SortingState>([]);

  const selectedRoom = useRef<null | Room>(null);

  const table = useReactTable({
    data: arrRooms,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
  });

  const handleEdit = (room: Room) => {
    setOpenModal(true);
    setIsAddNew(false);
    selectedRoom.current = room;
  };

  const onClickAddNew = () => {
    setOpenModal(true);
    setIsAddNew(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRoomsApi());
  }, []);

  return (
    <div className="admin-room">
      <h3>Quản lý thông tin phòng</h3>
      <button className="btn btn-outline-secondary" onClick={onClickAddNew}>
        <i className="fa fa-plus me-2"></i>
        Thêm phòng
      </button>
      <div className="admin__searchBar input-group mt-2">
        <input
          type="text"
          className="form-control"
          placeholder="Start your search"
          aria-label="Start your search"
          aria-describedby="basic-addon2"
        />
        <div className="input-group-append">
          <button className="btn btn-outline-secondary" type="button">
            <i className="fa fa-search"></i>
          </button>
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
              <th></th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <>
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    </>
                  );
                })}
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-outline-warning"
                      onClick={() => handleEdit({ ...row.original })}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                    <button className="btn btn-outline-danger">
                      <i className="fa fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="d-flex align-items-center justify-content-end gap-2">
        <div className="tbl-pagination-btns">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>
        </div>
        <span className="flex items-center">
          Page{" "}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center gap-1">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="form-control w-25 d-inline"
          />
        </span>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>

      <Modal show={openModal} size="lg" className="modal-dialog-scrollable">
        <Modal.Header>
          <Modal.Title>
            {selectedRoom.current ? "Cập nhật" : "Thêm phòng mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isAddNew ? (
            <RoomAddNewForm handleCloseModal={handleCloseModal} />
          ) : (
            <RoomEditForm
              room={selectedRoom.current}
              handleCloseModal={handleCloseModal}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
