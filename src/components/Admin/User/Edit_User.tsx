import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { Formik, useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { http } from "../../../util/setting";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "./../../../redux/configStore";
import { editUserByIDAction } from "../../../redux/reducers/userReducer";

type Props = {
  idUser: number;
};

export default function Edit_User({ idUser }: Props) {
  const { userInfo } = useSelector((state: RootState) => state.userReducer);

  const dispatch: AppDispatch = useDispatch();
  const formik = useFormik<{
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
    birthday: string;
    gender: boolean;
    role: string;
  }>({
    initialValues: {
      id: 0,
      name: "",
      email: "",
      password: "",
      phone: "",
      birthday: "",
      gender: false,
      role: "user",
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required!"),
      email: Yup.string()
        .required("Email is required!")
        .email("Invalid email!"),
      password: Yup.string()
        .required("Password is required!")
        .min(8, "Password must have at least 8 characters"),
      phone: Yup.string()
        .required("Phone is required!")
        .min(10, "Phone must have at least 10 number"),
      birthday: Yup.string().required("birthday is required!"),
      role: Yup.string().required("role is required!"),
    }),
    onSubmit: async (values) => {
      console.log("User: ", values);
      try {
        let result = await http.put(`/users/${idUser}`, values);
        console.log(result.data.content);
        alert("Update User Successfully !");
      } catch (err) {
        console.log(err);
      }
    },
  });

  const loadUserFromAPI = (id: number) => {
    const action = editUserByIDAction(id);
    dispatch(action);
  };

  const setFieldValue = () => {
    formik.setFieldValue("id", userInfo?.id);
    formik.setFieldValue("name", userInfo?.name);
    formik.setFieldValue("email", userInfo?.email);
    formik.setFieldValue("password", userInfo?.password);
    formik.setFieldValue("phone", userInfo?.phone);
    formik.setFieldValue("birthday", userInfo?.birthday);
    formik.setFieldValue("role", userInfo?.role);
  };

  useEffect(() => {
    loadUserFromAPI(idUser);
    setFieldValue();
    renderEditUser();
  }, [idUser, userInfo?.id]);

  const renderEditUser = () => {
    return (
      <>
        <form onSubmit={formik.handleSubmit}>
          <div className="row">
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="form-group my-1">
                <label className="form-label">ID</label>
                <input
                  type="id"
                  className="form-control"
                  placeholder="User's ID"
                  id="id"
                  value={formik.values?.id}
                  readOnly
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group my-1">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  aria-describedby="emailHelp"
                  placeholder="Email adrress"
                  value={formik.values?.email}
                  // onChange={formik.handleChange}
                  onChange={formik.handleChange}
                />
                {formik.errors.email && formik.touched.email && (
                  <p className="text-danger my-1">Email Invalid</p>
                )}
              </div>
              <div className="form-group my-1">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  aria-describedby="emailHelp"
                  placeholder="Phone number"
                  value={formik.values?.phone}
                  onChange={formik.handleChange}
                />
                {formik.errors.phone && formik.touched.phone && (
                  <p className="text-danger my-1">Phone Invalid</p>
                )}
              </div>
              <div className="form-group my-1">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  className="form-control"
                  id="role"
                  placeholder="Your role"
                  value={formik.values?.role?.toLocaleUpperCase()}
                  onChange={formik.handleChange}
                />
              </div>
            </div>
            <div className="col-lg-6 col-md-12 col-sm-12">
              <div className="form-group my-1">
                <label className="form-label">Birth Day</label>
                <input
                  type="birthday"
                  className="form-control"
                  id="birthday"
                  aria-describedby="emailHelp"
                  placeholder="Your birthday"
                  value={formik.values?.birthday}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group my-1">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  aria-describedby="emailHelp"
                  placeholder="Your name"
                  value={formik.values?.name}
                  onChange={formik.handleChange}
                />
              </div>
              <div className="form-group my-1">
                <label className="form-label">Password</label>
                <input
                  type="text"
                  className="form-control"
                  id="password"
                  aria-describedby="emailHelp"
                  placeholder="Type your password"
                  value={formik.values?.password}
                  onChange={formik.handleChange}
                />
              </div>
              {/* <div className="form-group mb-3">
              <div className="gender-title my-2">Gender</div>

              <label className="gender-label me-2" htmlFor="">
                Male
                <input
                  className="gender-input me-1"
                  name="gender"
                  defaultChecked
                  type="radio"
                  value="true"
                />
                <span className="checkmark"></span>
              </label>

              <label className="gender-label" htmlFor="">
                Female
                <input
                  className="gender-input me-1"
                  name="gender"
                  type="radio"
                  value="false"
                />
                <span className="checkmark"></span>
              </label>
            </div> */}
            </div>
            <div className="btnSubmit d-md-flex justify-content-md-end">
              <button
                className="btn btn-outline-primary btn-md me-4 rounded-pill px-4"
                type="submit"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </>
    );
  };

  return (
    <div className="update-user container my-3 p-4 rounded-4">
      <div className="title">
        <h3>Information's User</h3>
      </div>
      {renderEditUser()}
    </div>
  );
}
