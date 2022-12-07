import { useEffect } from "react";
import Swal from "sweetalert2";
import { User } from "../../../redux/reducers/userReducer";
import { getStoreJSON, handleLogout } from "../../../util/setting";

type Props = {};

export default function HomeAdmin({}: Props) {
  const userLogin: User = getStoreJSON("userLogin");

  useEffect(() => {
    if (userLogin.role !== "ADMIN") {
      Swal.fire({
        title: "Bạn không có quyền truy cập vào trang này!",
        icon: "warning",
        html: "Vui lòng đăng nhập với tài khoản có chức năng phù hợp!",
      });
    }
  }, [userLogin.role]);

  return (
    <>
      <div className="row justify-content-between">
        <div className="admin-profile-box col-5 col-lg-4">
          <div className="admin-avatar">
            <div className="admin-avatar__img">
              <img
                src={
                  userLogin.avatar !== ""
                    ? userLogin.avatar
                    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB_roDFHBOdtmmw28enuqKNnxrhlvnap8bloQeefIiYA&s"
                }
                alt={userLogin.name}
              />
            </div>
          </div>
          <div className="admin-info">
            <strong>{userLogin.name}</strong>
            <div className="admin-info__item">
              <i className="fas fa-envelope-open me-2"></i>
              <span>{userLogin.email}</span>
            </div>
            <div className="admin-info__item">
              <i className="fas fa-phone me-2"></i>
              <span>{userLogin.phone}</span>
            </div>
          </div>
          <div className="admin-profile-function mt-3">
            <button className="btn btn-secondary" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
