import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  deleteRoomApi,
  Room,
  searchRoomApi,
} from "../../../redux/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configStore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Modal } from "react-bootstrap";
import {
  getLocationsApi,
  Location,
} from "../../../redux/reducers/locationsReducer";
import SortButton from "../../../components/SortButton/SortButton";
import _ from "lodash";
import RoomAdminForm from "./RoomAdminForm";
import TablePagination from "../../../components/TablePagination/TablePagination";
import { useParams } from "react-router-dom";

let timeout: ReturnType<typeof setTimeout>;

// table header
const tableHeaders: { key: keyof Room; label: string }[] = [
  {
    key: "id",
    label: "Mã phòng",
  },
  {
    key: "tenPhong",
    label: "Tên phòng",
  },
  {
    key: "hinhAnh",
    label: "Hình ảnh",
  },
  {
    key: "maViTri",
    label: "Vị trí",
  },
  {
    key: "moTa",
    label: "Mô tả",
  },
  {
    key: "giaTien",
    label: "Giá tiền",
  },
];

// type for sort table
export type SortKeys = keyof Room;

export type SortOrder = "asc" | "desc" | null;
// ----------------------

type Props = {};

export default function RoomManagement({}: Props) {
  const { arrRooms, totalRow } = useSelector(
    (state: RootState) => state.roomReducer
  );
  console.log(totalRow);

  const { arrLocations } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const [openModal, setOpenModal] = useState<boolean>(false);

  const selectedRoom = useRef<null | Room>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const keyword = useRef("");

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // render room location based on room.maViTri
  const renderRoomLocation = (maViTri: number) => {
    if (arrLocations.length > 0) {
      let index = arrLocations?.findIndex(
        (location: Location) => location.id === maViTri
      );
      let location = arrLocations[index];
      return (
        location?.tenViTri +
        ", " +
        location?.tinhThanh +
        ", " +
        location?.quocGia
      );
    }
  };

  // ------------------ table pagination --------------
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageIndex = useRef<string>("1");

  const pageSize = 10;

  const handlePagination = (page: number) => {
    setCurrentPage(page);
    pageIndex.current = page.toString();
  };
  // -------------------------------------

  // --------------- sort table function ------------------
  const [sortKey, setSortKey] = useState<SortKeys>("id");

  const [sortOrder, setSortOrder] = useState<SortOrder>(null);

  const handleSort = ({
    tableData,
    sortKey,
    reverse,
  }: {
    tableData: Room[];
    sortKey: SortKeys;
    reverse: boolean;
  }) => {
    if (arrRooms.length > 0) {
      if (!sortKey || !sortOrder) return tableData;

      const sortedData = [...arrRooms].sort((a, b) => {
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
      handleSort({
        tableData: arrRooms,
        sortKey,
        reverse: sortOrder === "desc",
      }),
    [arrRooms, sortKey, sortOrder]
  );

  const changeSort = (key: SortKeys) => {
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
  // ------------------------------------

  // onClick edit button
  const handleClickEdit = (room: Room) => {
    setOpenModal(true);
    selectedRoom.current = room;
  };

  // onClick add button
  const handleClickAdd = () => {
    setOpenModal(true);
    selectedRoom.current = null;
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const renderRoomAdminForm = useCallback(() => {
    return (
      <RoomAdminForm
        room={selectedRoom.current ? selectedRoom.current : null}
        handleCloseModal={handleCloseModal}
      />
    );
  }, [selectedRoom.current]);

  const dispatch: AppDispatch = useDispatch();

  const handleDeleteRoom = (roomId: number) => {
    dispatch(deleteRoomApi(roomId));
  };

  useEffect(() => {
    dispatch(searchRoomApi(pageIndex.current, pageSize.toString(), searchTerm));
    console.log("on mounted");
  }, [pageIndex.current, pageSize.toString()]);

  useEffect(() => {
    timeout = setTimeout(() => {
      if (searchTerm.length > 0) {
        dispatch(
          searchRoomApi(pageIndex.current, pageSize.toString(), searchTerm)
        );
        console.log("on search");
      }
    }, 1000);
    return () => {
      if (timeout) {
        clearTimeout(timeout);
        console.log("unmouting");
      }
    };
  }, [pageIndex.current, pageSize, searchTerm]);

  useEffect(() => {
    dispatch(getLocationsApi());
  }, []);

  return (
    <div className="admin-room">
      <h3>Quản lý thông tin phòng</h3>
      <button className="btn btn-outline-secondary" onClick={handleClickAdd}>
        <i className="fa fa-plus me-2"></i>
        Thêm phòng
      </button>
      <form>
        <div className="admin__searchBar input-group mt-2">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchTermChange}
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
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            {tableHeaders.map((header) => (
              <th onClick={() => changeSort(header.key)}>
                <div className="d-flex align-items-center justify-content-between">
                  <span>{header.label}</span>
                  <SortButton
                    colKey={header.key}
                    {...{
                      sortKey,
                      sortOrder,
                    }}
                  />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {arrRooms.length > 0 &&
            sortedData()?.map((room) => (
              <tr key={room.id}>
                <td>{room.id}</td>
                <td>{room.tenPhong}</td>
                <td>
                  <LazyLoadImage
                    src={room.hinhAnh}
                    alt={room.tenPhong}
                    effect="blur"
                    style={{ width: "200px" }}
                  />
                </td>
                <td>
                  {arrLocations.length > 0 && renderRoomLocation(room.maViTri)}
                </td>
                <td>
                  {room.moTa.length > 100
                    ? room.moTa.slice(0, 100) + "..."
                    : room.moTa}
                </td>
                <td>${room.giaTien}</td>
                <td>
                  <div className="d-flex">
                    <div className="btnEdit me-2">
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => {
                          handleClickEdit(room);
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </div>
                    <div className="btnDelete">
                      <button
                        className="btn btn-outline-danger"
                        onClick={() => handleDeleteRoom(room.id)}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      {/* table pagination */}
      {/* <TablePagination
        totalRow={totalRow}
        pageSize={pageSize}
        currentPage={currentPage}
        handlePagination={handlePagination}
      /> */}

      {/* modal */}
      <Modal show={openModal} size="lg" className="modal-dialog-scrollable">
        <Modal.Header>
          <Modal.Title>
            {selectedRoom.current ? "Cập nhật" : "Thêm phòng mới"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderRoomAdminForm()}</Modal.Body>
      </Modal>
    </div>
  );
}
