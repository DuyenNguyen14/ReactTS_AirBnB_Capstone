import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "./../../../redux/configStore";
import Add_User from "../../../components/Admin/User/Add_User";
import Edit_User from "../../../components/Admin/User/Edit_User";
import {
  deleteUserAction,
  getUserPaginationAction,
  searchUserAction,
  User,
} from "../../../redux/reducers/userReducer";
import { Modal } from "react-bootstrap";

type Props = {};
const logo = require("./../../../assets/img/airbnb-logo.png");
let timeout: ReturnType<typeof setTimeout>;

export default function UserManagement({}: Props) {
  const { arrUsers, totalRow } = useSelector(
    (state: RootState) => state.userReducer
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUserName] = useState("");
  const [deletAction, setDeleteAction] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [idUser, setIDUser] = useState<number>(1);
  const [editAction, setEditAction] = useState<boolean>(false);
  const pageIndex = useRef("1");
  const pageSize = useRef("1");
  const keyword = useRef("");
  const dispatch: AppDispatch = useDispatch();

  /**
   * currentPage: trang hiện tại đang được trỏ tới
   */
  const [currentPage, setCurrentPage] = useState<number>(1);
  /**
   * postsPerPage: là số danh sách sản phẩm được hiển thị trên page
   */
  const [postsPerPage, setPostPerPage] = useState<number>(15);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    console.log("UserName: ", value.toLocaleLowerCase());
    setUserName(value);
  };

  const handleSunmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pageIndex.current = String(currentPage);
    pageSize.current = String(postsPerPage);
    keyword.current = String(username);
    setSearchParams({
      pageIndex: pageIndex.current,
      pageSize: pageSize.current,
      keyword: keyword.current,
    });
    setUserName("");
  };

  const getParamsOnUrl = () => {
    if (searchParams.get("keyword") === null) {
      const action = getUserPaginationAction(
        searchParams.get("pageIndex"),
        searchParams.get("pageSize"),
        null
      );
      dispatch(action);
    }
  };

  const handleSearchUser = () => {
    const searchAction = searchUserAction(username);
    dispatch(searchAction);
  };

  useEffect(() => {
    pageIndex.current = String(currentPage);
    pageSize.current = String(postsPerPage);
    setSearchParams({
      pageIndex: pageIndex.current,
      pageSize: pageSize.current,
    });
  }, [currentPage]);

  useEffect(() => {
    timeout = setTimeout(() => {
      getParamsOnUrl();
    }, 1000);
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        setDeleteAction(false);
      }
    };
  }, [pageIndex.current, keyword.current, deletAction]);

  useEffect(() => {
    timeout = setTimeout(() => {
      handleSearchUser();
    }, 1000);
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        getParamsOnUrl();
      }
    };
  }, [username]);

  const handleDelete = (id: number) => {
    const deleteAction = deleteUserAction(id);
    dispatch(deleteAction);
    setDeleteAction(true);
  };

  const handleEdit = (id: number) => {
    setOpenModal(true);
    setOpenPopUp(true);
    setIDUser(id);
  };

  const handleAdd = () => {
    setOpenModal(true);
    setOpenPopUp(false);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditAction(true);
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      getParamsOnUrl();
    }, 1000);
    return () => {
      if (timeout !== null) {
        clearTimeout(timeout);
        setEditAction(false);
        console.log("After reload: ", editAction);
      }
    };
  }, [editAction]);

  console.log("Reload Page: ", editAction);

  return (
    <div>
      <h3 className="tilte my-3 ">Users Management</h3>
      <div className="addAdminPage mb-3" style={{ cursor: "pointer" }}>
        <h5 onClick={handleAdd}>Add administrators Page</h5>
      </div>
      <div className="row">
        <form className="search col-lg-4" onSubmit={handleSunmit}>
          <div className="input-group mb-3">
            <input
              className="form-control"
              placeholder="Users Name"
              onChange={handleChange}
              value={username}
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
                <th scope="col">UserName</th>
                <th scope="col">Email</th>
                <th scope="col">Avatar</th>
                <th scope="col">Phone</th>
                <th scope="col">Type</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {arrUsers?.map((user: any, index: number) => {
                return (
                  <tr key={index}>
                    <td>{user?.id}</td>
                    <td>{user?.name}</td>
                    <td>{user?.email}</td>
                    <td>
                      {user?.avatar !== "" ? (
                        <img
                          src={user?.avatar}
                          alt="...."
                          style={{ height: "50px", width: "50px" }}
                        />
                      ) : (
                        "No avatar"
                      )}
                    </td>
                    <td>{user?.phone}</td>
                    <td>
                      {user?.role === "ADMIN" ? (
                        <span className="badge rounded-pill bg-success text-white">
                          Admin
                        </span>
                      ) : (
                        <span className="badge rounded-pill bg-info text-white">
                          User
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm rounded-5 mx-1"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          handleEdit(user?.id);
                        }}
                      >
                        <i className="fas fa-user-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm rounded-5"
                        onClick={(event: React.MouseEvent<HTMLElement>) => {
                          handleDelete(user?.id);
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
          {/* <Pagination
            postsPerPage={postsPerPage}
            setCurrentPage={setCurrentPage}
            totalRow={totalRow}
          /> */}
        </div>
      </div>
      <Modal show={openModal} size="lg" className="modal-dialog-scrollable">
        <Modal.Header>
          <Modal.Title>
            {openPopUp ? "Edit Users Infor" : "Add Users Infor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {openPopUp ? <Edit_User idUser={idUser} /> : <Add_User />}
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
  );
}
