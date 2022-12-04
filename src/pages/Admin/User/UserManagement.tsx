import React, { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { AppDispatch, RootState } from "./../../../redux/configStore";
import {
  deleteUserAction,
  getUserPaginationAction,
  setArrUser,
  setIsFetching,
  User,
} from "../../../redux/reducers/userReducer";
import TablePagination from "../../../components/TablePagination/TablePagination";
import LoadingHorizontal from "../../../components/Loading/LoadingHorizontal";
import useSortTable from "../../../Hooks/useSortTable";
import SortButton from "../../../components/SortButton/SortButton";
import UserAdminForm from "./UserAdminForm";
import {
  setBodyComponent,
  setOpen,
} from "../../../redux/reducers/modalReducer";

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
  const { arrUsers, totalRow, isFetching } = useSelector(
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
  const [searchTerms, setSearchTerms] = useState("");
  const dispatch: AppDispatch = useDispatch();

  const handleSearchTermsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerms(e.target.value);
  };

  const handleSearchUser = () => {
    if (searchTerms.length > 0) {
      dispatch(
        getUserPaginationAction(
          currentPage.toString(),
          pageSize.toString(),
          searchTerms
        )
      );
    }
  };

  const handleDeleteUser = (userId: number) => {
    dispatch(deleteUserAction(userId));
  };

  // onclick add and edit user
  const handleOpenModal = useCallback(
    (user: User | null) => {
      if (user) {
        userRef.current = user;
      } else {
        userRef.current = null;
      }
      dispatch(setBodyComponent(<UserAdminForm user={userRef.current} />));
      dispatch(setOpen(true));
    },
    [userRef.current]
  );

  useEffect(() => {
    setSearchParams({
      pageIndex: currentPage.toString(),
      pageSize: pageSize.toString(),
      keyword: searchTerms,
    });

    if (searchTerms === "") {
      dispatch(
        getUserPaginationAction(
          currentPage.toString(),
          pageSize.toString(),
          searchTerms
        )
      );
    } else if (searchTerms.length > 0) {
      dispatch(setIsFetching(true));
      timeout = setTimeout(() => {
        dispatch(
          getUserPaginationAction(
            currentPage.toString(),
            pageSize.toString(),
            searchTerms
          )
        );
      }, 1000);
    }

    return () => {
      setArrUser([]);
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [currentPage, pageSize, searchTerms]);

  useEffect(() => {
    if (!isFetching) {
      if (arrUsers.length === 0) {
        setCurrentPage(1);
      }
      setLoading(false);
    }

    return () => {
      setLoading(true);
    };
  }, [arrUsers, isFetching]);

  useEffect(() => {
    return () => {
      dispatch(setIsFetching(true));
    };
  }, [currentPage]);

  return (
    <div>
      <h3 className="tilte my-3 ">Quản lý thông tin người dùng</h3>
      <form>
        <div className="admin__searchBar input-group mt-2 w-25">
          <input
            type="text"
            value={searchTerms}
            onChange={handleSearchTermsChange}
            className="form-control position-relative"
            placeholder="Start your search"
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
              onClick={handleSearchUser}
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
            ) : arrUsers.length > 0 ? (
              (sortedData() as User[])?.map((user: User, index: number) => {
                return (
                  <tr key={index}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      {user.avatar !== "" ? (
                        <img
                          src={user?.avatar}
                          alt="...."
                          style={{ height: "50px", width: "50px" }}
                        />
                      ) : (
                        "No avatar"
                      )}
                    </td>
                    <td>{user.phone}</td>
                    <td>
                      {user.role === "ADMIN" ? (
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
                        onClick={() => handleOpenModal(user)}
                      >
                        <i className="fas fa-user-edit"></i>
                      </button>
                      <button
                        className="btn btn-danger btn-sm rounded-5"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              "Không có dữ liệu"
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
  );
}
