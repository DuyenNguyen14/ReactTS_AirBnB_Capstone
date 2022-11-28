import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import {
  deleteRoomApi,
  Room,
  searchRoomApi,
  setArrRooms,
} from "../../../redux/reducers/roomReducer";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configStore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  getLocationsApi,
  Location,
} from "../../../redux/reducers/locationsReducer";
import SortButton from "../../../components/SortButton/SortButton";
import _ from "lodash";
import RoomAdminForm from "./RoomAdminForm";
import TablePagination from "../../../components/TablePagination/TablePagination";
import { useSearchParams } from "react-router-dom";
import useSortTable from "../../../Hooks/useSortTable";
import LoadingHorizontal from "../../../components/Loading/LoadingHorizontal";
import { Modal } from "react-bootstrap";

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

type Props = {};

export default function RoomManagement({}: Props) {
  const { arrRooms, totalRow } = useSelector(
    (state: RootState) => state.roomReducer
  );

  const [loading, setLoading] = useState(true);

  const { sortedData, changeSort, handleSort, sortOrder, sortKey } =
    useSortTable(arrRooms);

  const { arrLocations } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const [openModal, setOpenModal] = useState(false);

  const selectedRoom = useRef<null | Room>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

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

  const pageSize = 10;
  // -------------------------------------

  // onClick edit button
  const handleClickEdit = (room: Room) => {
    selectedRoom.current = room;
    setOpenModal(true);
  };

  // onClick add button
  const handleClickAdd = () => {
    setOpenModal(true);
    selectedRoom.current = null;
  };

  const renderRoomAdminForm = useCallback(() => {
    return (
      <RoomAdminForm
        setOpen={setOpenModal}
        room={selectedRoom.current ? selectedRoom.current : null}
      />
    );
  }, [selectedRoom.current]);

  const dispatch: AppDispatch = useDispatch();

  const handleDeleteRoom = (roomId: number) => {
    dispatch(deleteRoomApi(roomId));
  };

  useEffect(() => {
    setSearchParams({
      pageIndex: currentPage.toString(),
      pageSize: pageSize.toString(),
    });

    dispatch(
      searchRoomApi(currentPage.toString(), pageSize.toString(), searchTerm)
    );

    return () => {
      dispatch(setArrRooms([]));
    };
  }, [currentPage.toString(), pageSize.toString()]);

  useEffect(() => {
    if (arrRooms.length > 0 && currentPage.toString()) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [arrRooms, currentPage]);

  useEffect(() => {
    if (searchTerm.length > 0) {
      setSearchParams({
        ...searchParams,
        keyword: searchTerm,
      });

      timeout = setTimeout(() => {
        dispatch(
          searchRoomApi(currentPage.toString(), pageSize.toString(), searchTerm)
        );
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentPage, pageSize, searchTerm]);

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
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              {tableHeaders.map((header) => (
                <th key={header.key} onClick={() => changeSort(header.key)}>
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
            {loading ? (
              <LoadingHorizontal />
            ) : (
              arrRooms.length > 0 &&
              (sortedData() as Room[])?.map((room: Room) => (
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
                    {arrLocations.length > 0 &&
                      renderRoomLocation(room.maViTri)}
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
                          onClick={() => handleDeleteRoom(room.id as number)}
                        >
                          <i className="fa fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <TablePagination
        totalRow={totalRow}
        pageSize={pageSize}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
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
