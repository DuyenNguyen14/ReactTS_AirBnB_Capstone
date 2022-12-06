import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppDispatch, RootState } from "../../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  deleteLocationApi,
  getLocationPaginationApi,
  Location,
  setIsFetching,
} from "../../../redux/reducers/locationsReducer";
import useSortTable from "../../../Hooks/useSortTable";
import TablePagination from "../../../components/TablePagination/TablePagination";
import SortButton from "../../../components/SortButton/SortButton";
import LoadingHorizontal from "../../../components/Loading/LoadingHorizontal";
import {
  setBodyComponent,
  setOpen,
} from "../../../redux/reducers/modalReducer";
import LocationAdminForm from "./LocationAdminForm";
import LocationImgForm from "./LocationImgForm";

const tableHeaders: { key: keyof Location; label: string }[] = [
  {
    key: "id",
    label: "Id",
  },
  {
    key: "tenViTri",
    label: "Tên vị trí",
  },
  {
    key: "tinhThanh",
    label: "Tỉnh thành",
  },
  {
    key: "hinhAnh",
    label: "Hình ảnh",
  },
  {
    key: "quocGia",
    label: "Quốc gia",
  },
];

type Props = {};
let timeout: ReturnType<typeof setTimeout>;

export default function LocationManagement({}: Props) {
  const { arrLocations, totalRow, isFetching } = useSelector(
    (state: RootState) => state.locationsReducer
  );
  const [searchTerms, setSearchTerms] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPopUp, setOpenPopUp] = useState<boolean>(true);
  const [editAction, setEditAction] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [idLocation, setIdLocation] = useState<number>(1);
  const [id, setId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const pageSize = 10;
  const selectedLocation = useRef<null | Location>(null);

  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const { sortedData, changeSort, handleSort, sortOrder, sortKey } =
    useSortTable(arrLocations);

  const handleOpenModal = (location: Location | null) => {
    if (location) {
      selectedLocation.current = location;
    } else {
      selectedLocation.current = null;
    }
    dispatch(
      setBodyComponent(
        <LocationAdminForm location={selectedLocation.current} />
      )
    );
    dispatch(setOpen(true));
  };

  const handleOpenEditImgForm = (location: Location) => {
    selectedLocation.current = location;
    dispatch(
      setBodyComponent(<LocationImgForm location={selectedLocation.current} />)
    );
    dispatch(setOpen(true));
  };

  const handleSearchTermChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(event.target.value);
    setLoading(true);
  };

  const handleSearch = () => {
    if (searchTerms.length > 0) {
      dispatch(getLocationPaginationApi(currentPage, pageSize, searchTerms));
    }
  };

  const handleDelete = (id: number) => {
    const deleteAction = deleteLocationApi(id);
    dispatch(deleteAction);
    setReload(true);
  };

  useEffect(() => {
    setSearchParams({
      pageIndex: currentPage.toString(),
      pageSize: pageSize.toString(),
      keyword: searchTerms,
    });

    if (searchTerms === "") {
      dispatch(getLocationPaginationApi(currentPage, pageSize, searchTerms));
    } else if (searchTerms.length > 0) {
      setCurrentPage(1);
      timeout = setTimeout(() => {
        dispatch(getLocationPaginationApi(currentPage, pageSize, searchTerms));
      }, 1000);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentPage, searchTerms]);

  useEffect(() => {
    if (!isFetching) {
      if (arrLocations.length === 0) {
        setCurrentPage(1);
      }
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [arrLocations, isFetching, currentPage]);

  useEffect(() => {
    return () => {
      dispatch(setIsFetching(true));
    };
  }, [currentPage]);

  return (
    <div>
      <h3 className="tilte my-3 ">Location Management</h3>
      <button
        className="btn btn-outline-secondary"
        onClick={() => handleOpenModal(null)}
      >
        <i className="fa fa-plus me-2"></i>
        Thêm phòng
      </button>
      <div className="row">
        <form>
          <div className="admin__searchBar input-group mt-2 w-25">
            <input
              type="text"
              value={searchTerms}
              onChange={handleSearchTermChange}
              className="form-control position-relative"
              placeholder="Start your search"
              aria-label="Start your search"
            />

            <button
              type="button"
              onClick={() => setSearchTerms("")}
              hidden={searchTerms === "" && true}
              className="btn bg-transparent position-absolute"
              style={{ right: "37px", zIndex: "5" }}
            >
              <i className="fa fa-times"></i>
            </button>

            <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleSearch}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-striped">
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
              ) : arrLocations.length > 0 ? (
                (sortedData() as Location[]).map(
                  (location: any, index: React.Key) => {
                    return (
                      <tr key={index}>
                        <td>{location.id}</td>
                        <td>{location.tenViTri}</td>
                        <td>{location.tinhThanh}</td>
                        <td>
                          {location.hinhAnh !== "" ? (
                            <img
                              src={location.hinhAnh}
                              alt="...."
                              style={{ height: "50px", width: "50px" }}
                            />
                          ) : (
                            "No image"
                          )}
                          <button
                            className="btn btn-outline-success ms-1 btn-sm rounded-5"
                            onClick={() => handleOpenEditImgForm(location)}
                          >
                            <i className="far fa-images"></i>
                          </button>
                        </td>
                        <td>{location.quocGia}</td>
                        <td>
                          <button
                            className="btn btn-primary btn-sm rounded-5 me-1"
                            onClick={() => {
                              handleOpenModal(location);
                            }}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn btn-danger btn-sm rounded-5"
                            onClick={() => {
                              handleDelete(location.id);
                            }}
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )
              ) : (
                "Không có dữ liệu"
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination d-flex justify-content-center">
          <TablePagination
            totalRow={totalRow}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
          />
        </div>
      </div>
    </div>
  );
}
