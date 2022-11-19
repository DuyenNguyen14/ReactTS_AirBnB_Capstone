import React, { useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../components/Pagination/Pagination";
import { AppDispatch, RootState } from "./../../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import {
  deleteLocationApi,
  getLocationPaginationApi,
  getLocationByIdApi,
} from "../../../redux/reducers/locationsReducer";
import EditLocation from "../../../components/Admin/Location/EditLocation";
import UploadPicure from "../../../components/Admin/Location/UploadPicutre";

type Props = {};
let timeout: ReturnType<typeof setTimeout>;

export default function LocationManagement({}: Props) {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPopUp, setOpenPopUp] = useState<boolean>(true);
  const [editAction, setEditAction] = useState<boolean>(false);
  const [reload, setReload] = useState<boolean>(false);
  const [idLocation, setIdLocation] = useState<number>(1);
  const [id, setId] = useState<string>("");
  const { arrLocationPageIndex, totalRow } = useSelector(
    (state: RootState) => state.locationsReducer
  );
  /**
   * currentPage: trang hiện tại đang được trỏ tới
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  /**
   * postsPerPage: là số danh sách sản phẩm được hiển thị trên page
   */
  const [postsPerPage, setPostPerPage] = useState<number>(5);

  const getLocationPageIndexAction = () => {
    const action = getLocationPaginationApi(currentPage, postsPerPage, null);
    dispatch(action);
  };

  const handleAdd = () => {
    navigate("/addLocation");
  };

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { value, id } = e.target;
  //   console.log("ID: ", value.toLocaleLowerCase());
  //   setId(value);
  // };

  // const handleSearchID = () => {
  //   const actionSearch = getLocationByIdApi(Number(id));
  //   dispatch(actionSearch);
  // }

  const handleEdit = (id: number) => {
    setOpenModal(true);
    setOpenPopUp(false);
    setIdLocation(id);
  };

  const handlePicture = (id: number) => {
    setOpenModal(true);
    setOpenPopUp(true);
    setIdLocation(id);
  };

  const handleDelete = (id: number) => {
    const deleteAction = deleteLocationApi(id);
    dispatch(deleteAction);
    setReload(true);
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      getLocationPageIndexAction();
    }, 500);
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        setReload(false);
      }
    };
  }, [currentPage, reload]);

  useEffect(() => {
    timeout = setTimeout(() => {
      getLocationPageIndexAction();
    }, 500);
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        setEditAction(false);
      }
    };
  }, [editAction]);

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditAction(true);
  };

  return (
    <div>
      <h3 className="tilte my-3 ">Location Management</h3>
      <div className="addAdminPage mb-3" style={{ cursor: "pointer" }}>
        <h5 onClick={handleAdd}>Add New Position</h5>
      </div>
      <div className="row">
        <form className="search col-lg-4">
          <div className="input-group mb-3">
            <input
              className="form-control"
              placeholder="Locations Name"
              // onChange={handleChange}
              // value={id}
            />
            <button className="btn btn-outline-danger">Search</button>
          </div>
        </form>
        <div className="table-responsive">
          <table className="table table-hover">
            {/* <caption>List of users</caption> */}
            <thead>
              <tr>
                <th scope="col">ID</th>
                <th scope="col">Location</th>
                <th scope="col">City</th>
                <th scope="col">Picture</th>
                <th scope="col">Country</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {arrLocationPageIndex?.map((locate: any, index: React.Key) => {
                return (
                  <tr key={index}>
                    <td>{locate?.id}</td>
                    <td>{locate?.tenViTri}</td>
                    <td>{locate?.tinhThanh}</td>
                    <td>
                      {locate?.hinhAnh !== "" ? (
                        <img
                          src={locate?.hinhAnh}
                          alt="...."
                          style={{ height: "50px", width: "50px" }}
                        />
                      ) : (
                        "No avatar"
                      )}
                      <button
                        className="btn btn-light btn-sm rounded-5 mx-1"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          handlePicture(locate?.id);
                        }}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                    </td>
                    <td>{locate?.quocGia}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm rounded-5 mx-1"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          handleEdit(locate?.id);
                        }}
                      >
                        <i className="fas fa-map-marker-alt"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm rounded-5"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          handleDelete(locate?.id);
                        }}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="pagination d-flex justify-content-center">
          <Pagination
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            totalRow={totalRow}
          />
        </div>
        <Modal show={openModal} size="lg" className="modal-dialog-scrollable">
          <Modal.Header>
            <Modal.Title>
              {openPopUp ? "Upload Picture" : "Edit Location Infor"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {openPopUp ? (
              <UploadPicure id={String(idLocation)} />
            ) : (
              <EditLocation id={idLocation} />
            )}
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-secondary"
              onClick={() => handleCloseModal()}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
