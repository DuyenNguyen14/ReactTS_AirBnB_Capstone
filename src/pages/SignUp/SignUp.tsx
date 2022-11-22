import { ChangeEvent, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NavLink, useLocation } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { setSignUpState, signUp, User } from "../../redux/reducers/authReducer";
import { history } from "../../index";
import { openNotificationWithIcon } from "../../util/notification";
import { clearLocalStorage, setStoreJSON } from "../../util/setting";
import useLocationPathname from "../../Hooks/useLocationPathname";

type Props = {};

export default function SignUp({}: Props) {
  const { signUpState } = useSelector((state: RootState) => state.authReducer);

  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik<User>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: true,
      role: "USER",
    },
    onSubmit: async (values) => {
      console.log(values);
      await dispatch(signUp(values));
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Không được để trống trường này!"),
      email: Yup.string()
        .required("Không được để trống trường này!")
        .email("Email không hợp lệ!"),
      password: Yup.string()
        .required("Không được để trống trường này!")
        .min(8, "Mật khẩu phải bao gồm 8 ký tự trở lên!"),
      phone: Yup.string()
        .required("Không được để trống trường này!")
        .min(10, "Số điện thoại phải bao gồm 10 số!"),
      birthday: Yup.string().required("Không được để trống trường này!"),
    }),
  });

  const { errors, handleChange, handleBlur, handleSubmit, setFieldValue } =
    formik;

  const handleChangeGender = (event: ChangeEvent<HTMLInputElement>) => {
    setFieldValue("gender", event.target.value);
  };

  const handleEmailError = () => {
    const emailInp = document.getElementById("email");
    emailInp?.focus();
  };

  const prevLocation = useLocation();

  useEffect(() => {
    if (signUpState) {
      openNotificationWithIcon("success", "Tạo tài khoản thành công!", "");
      history.push("/signin");
      dispatch(setSignUpState(null));
    } else if (signUpState === false) {
      openNotificationWithIcon(
        "error",
        "Email đã tồn tại!",
        "Vui lòng đăng ký với một email khác."
      );
      handleEmailError();
      dispatch(setSignUpState(null));
    }
  }, [signUpState]);

  useLocationPathname();

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-9 col-md-7 col-lg-5 mx-auto">
          <div className="card border-0 shadow rounded-3 my-5">
            <div className="card-body p-4 p-sm-5">
              <h5 className="card-title text-center mb-2 titleSignIn">
                Chào mừng đến với Airbnb
              </h5>
              <h3 className="text-center mb-2">Tạo Tài Khoản Của Bạn</h3>

              <form onSubmit={handleSubmit}>
                <div className="form-group mb-3">
                  <label className="my-1" htmlFor="name">
                    Tên tài khoản
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Nhập tên tài khoản"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.name && (
                    <p className="text-danger mt-1">{errors.name}</p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="my-1" htmlFor="email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="name@example.com"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.email && (
                    <p className="text-danger mt-1">{errors.email}</p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="my-1" htmlFor="phone">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Nhập số điện thoại"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.phone && (
                    <p className="text text-danger valid-notice">
                      {errors.phone}
                    </p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="my-1" htmlFor="birthday">
                    Ngày tháng năm sinh
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    id="birthday"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.birthday && (
                    <p className="text-danger mt-1">{errors.birthday}</p>
                  )}
                </div>
                <div className="form-group mb-3">
                  <label className="my-1" htmlFor="password">
                    Mật khẩu
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Nhập mật khẩu"
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  {errors.password && (
                    <p className="text-danger mt-1">{errors.password}</p>
                  )}
                </div>

                <p className="my-1">Giới tính</p>
                <div className="form-group mb-3 d-flex">
                  <div className="input-group">
                    <input
                      type="radio"
                      id="male"
                      value="true"
                      name="gender"
                      onChange={handleChangeGender}
                      defaultChecked
                    />
                    <label htmlFor="male" className="ms-2">
                      Nam
                    </label>
                  </div>
                  <div className="input-group">
                    <input
                      type="radio"
                      id="female"
                      value="false"
                      name="gender"
                      onChange={handleChangeGender}
                    />
                    <label htmlFor="male" className="ms-2">
                      Nữ
                    </label>
                  </div>
                </div>

                <div className="d-grid">
                  <button className="btn-login fw-bold" type="submit">
                    Đăng ký
                  </button>
                </div>
                <hr className="my-4" />
                <h4>
                  Đã có tài khoản? Đi đến trang{" "}
                  <NavLink className="d-inline text-primary" to="/signin">
                    Đăng nhập
                  </NavLink>
                </h4>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
