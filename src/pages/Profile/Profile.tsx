import { useEffect, useState } from "react";
import { history } from "../../index";
import useLocationPathname from "../../Hooks/useLocationPathname";
import { openNotificationWithIcon } from "../../util/notification";
import { ACCESS_TOKEN, getStoreJSON, handleLogout } from "../../util/setting";
import { AppDispatch, RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { editUserAction, getUserById } from "../../redux/reducers/userReducer";
import { useParams } from "react-router-dom";
import { EditInfoFormMemo } from "./EditInfoForm";

type Props = {};

export default function Profile({}: Props) {
  const { userInfo } = useSelector((state: RootState) => state.userReducer);

  const [clickEdit, setClickEdit] = useState(false);

  const { userid } = useParams();

  const accessToken: string = getStoreJSON(ACCESS_TOKEN);

  const dispatch: AppDispatch = useDispatch();

  // ------------------- xử lý upload hình -------------------
  const [selectedImg, setSelectedImg] = useState<string | ArrayBuffer | null>();

  let reader = new FileReader();

  const handleChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files?.length > 0) {
      let file = event.target.files[0];
      if (
        file.type === "image/jpeg" ||
        file.type === "image/jpg" ||
        file.type === "image/png"
      ) {
        const src = reader.readAsDataURL(file);
        reader.onload = (e: ProgressEvent<FileReader>) => {
          setSelectedImg(e.target?.result);
        };
      }
    }
  };
  // ------------------------

  const handleUploadAvatar = () => {
    if (selectedImg && userInfo) {
      // dispatch(uploadAvatarApi(selectedImg));
      const values = { ...userInfo, avatar: selectedImg as string };
      console.log({ ...values });
      dispatch(editUserAction(userInfo.id, { ...values }));
    }
  };

  useEffect(() => {
    if (!accessToken) {
      openNotificationWithIcon(
        "error",
        "Vui lòng đăng nhập trước khi truy cập vào trang này!",
        ""
      );
      history.push("/signin");
    }
  }, [accessToken]);

  useEffect(() => {
    userid && dispatch(getUserById(userid));
  }, [userid]);

  useLocationPathname();

  return (
    <div className="container py-5">
      {accessToken && userInfo && (
        <div className="profile__content">
          <div className="row flex-lg-row-reverse justify-content-between">
            <div className="profile-title col-8 col-lg-7">
              <h2>Xin chào, tôi là {userInfo.name}</h2>
              <button
                className="btn btn--underline"
                onClick={(event) => {
                  event.preventDefault();
                  setClickEdit(!clickEdit);
                }}
              >
                Chỉnh sửa hồ sơ
              </button>
            </div>
            <div className="col-3 col-lg-4 user-avatar">
              <div className="user-avatar__img">
                <img
                  src={
                    selectedImg
                      ? (selectedImg as string)
                      : userInfo.avatar === ""
                      ? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB_roDFHBOdtmmw28enuqKNnxrhlvnap8bloQeefIiYA&s"
                      : userInfo.avatar
                  }
                  alt=""
                />
              </div>
              <input
                type="file"
                className="file"
                id="avatar"
                onChange={handleChangeFile}
                hidden
              />
              <div className="d-flex">
                <button
                  className="btn btn--underline"
                  onClick={() => {
                    document.getElementById("avatar")?.click();
                  }}
                >
                  Cập nhật ảnh
                </button>
                <button
                  className="btn--primary"
                  hidden={!selectedImg ? true : false}
                  onClick={handleUploadAvatar}
                >
                  <i className="fa fa-check"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="user-badge col-12 col-lg-4">
              <div className="user-badge__content">
                <i className="fas fa-user-shield"></i>
                <h4>Xác minh danh tính</h4>
                <p>
                  Xác thực danh tính của bạn với huy hiệu xác minh danh tính.
                </p>
                <button className="btn btn-border-black">Nhận huy hiệu</button>
              </div>
            </div>
            <div className="col-12 col-lg-7">
              <div className="edit-info" hidden={!clickEdit && true}>
                <hr />
                <EditInfoFormMemo
                  userInfo={userInfo}
                  setClickEdit={setClickEdit}
                />
              </div>
              <hr />
              <button className="btn btn--underline">
                Xem lịch sử đặt phòng
              </button>
              <hr />
            </div>
          </div>
          <button
            className="btnLogout btn btn-border-black mt-3"
            onClick={handleLogout}
          >
            Đăng xuất
          </button>
        </div>
      )}
    </div>
  );
}
