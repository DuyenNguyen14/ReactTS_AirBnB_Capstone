import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "./../../../redux/configStore";
import {
  deleteUserAction,
  getUserPaginationAction,
  searchUserAction,
  setArrUser,
  User,
} from "../../../redux/reducers/userReducer";
import { Modal } from "react-bootstrap";
import TablePagination from "../../../components/TablePagination/TablePagination";
import LoadingHorizontal from "../../../components/Loading/LoadingHorizontal";
import useSortTable from "../../../Hooks/useSortTable";
import SortButton from "../../../components/SortButton/SortButton";
import UserAdminForm from "./UserAdminForm";

// table header
const tableHeaders: { key: keyof User; label: string }[] = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "name",
    label: "Tên người dùng",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "avatar",
    label: "Avatar",
  },
  {
    key: "phone",
    label: "SĐT",
  },
  {
    key: "role",
    label: "Vai trò",
  },
];

type Props = {};

let timeout: ReturnType<typeof setTimeout>;

export default function UserManagement({}: Props) {
  const { arrUsers, totalRow } = useSelector(
    (state: RootState) => state.userReducer
  );

  const [loading, setLoading] = useState(true);

  const { sortedData, changeSort, handleSort, sortOrder, sortKey } =
    useSortTable(arrUsers);

  // ------------------ table pagination --------------
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = 15;
  // -------------------------------------

  const userRef = useRef<null | User>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const [username, setUserName] = useState("");
  const [deletAction, setDeleteAction] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openPopUp, setOpenPopUp] = useState<boolean>(false);
  const [idUser, setIDUser] = useState<number>(1);
  const [editAction, setEditAction] = useState<boolean>(false);
  const pageIndex = useRef("1");
  const keyword = useRef("");
  const dispatch: AppDispatch = useDispatch();

  const renderUserAdminForm = useCallback(() => {
    return <UserAdminForm user={userRef.current ? userRef.current : null} />;
  }, [userRef.current]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    console.log("UserName: ", value.toLocaleLowerCase());
    setUserName(value);
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

  const handleDelete = (id: number) => {
    const deleteAction = deleteUserAction(id);
    dispatch(deleteAction);
    setDeleteAction(true);
  };

  const handleEdit = (user: User) => {
    userRef.current = user;
    setOpenModal(true);
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
    setSearchParams({
      pageIndex: currentPage.toString(),
      pageSize: pageSize.toString(),
    });

    dispatch(
      getUserPaginationAction(currentPage.toString(), pageSize.toString(), null)
    );
    return () => {
      dispatch(setArrUser([]));
    };
  }, [currentPage]);

  useEffect(() => {
    if (arrUsers.length > 0) {
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [arrUsers, currentPage]);

  return (
    <div>
      <h3 className="tilte my-3 ">Users Management</h3>
      <div className="addAdminPage mb-3" style={{ cursor: "pointer" }}>
        <h5 onClick={handleAdd}>Add administrators Page</h5>
      </div>
      <div className="row">
        <form className="search col-lg-4">
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
                arrUsers.length > 0 &&
                (sortedData() as User[])?.map((user: User, index: number) => {
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
                          onClick={() => handleEdit(user)}
                        >
                          <i className="fas fa-user-edit"></i>
                        </button>
                        <button
                          className="btn btn-danger btn-sm rounded-5"
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            handleDelete(user.id);
                          }}
                        >
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="pagination d-flex justify-content-center">
          <TablePagination
            totalRow={totalRow}
            pageSize={pageSize}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
      <Modal show={openModal} size="lg" className="modal-dialog-scrollable">
        <Modal.Header>
          <Modal.Title>
            {openPopUp ? "Edit Users Infor" : "Add Users Infor"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>{renderUserAdminForm()}</Modal.Body>
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
