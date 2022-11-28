import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { Formik, useFormik, FormikProps } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { http } from "../../../util/setting";
import { User } from "../../../redux/reducers/userReducer";

type Props = {
  user: User | null;
};

export default function UserAdminForm({ user }: Props) {
  console.log(user);

  const formik = useFormik<User>({
    initialValues: user
      ? user
      : {
          id: 0,
          avatar: "",
          name: "",
          email: "",
          password: "",
          phone: "",
          birthday: "",
          gender: false,
          role: "USER",
        },
    validationSchema: Yup.object().shape({
      id: Yup.number().required("ID is required!"),
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
        let result = await http.post("users", values);
        console.log(result.data.content);
        console.log("Add User Successfully !");
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <div className="update-user container my-3 p-4 rounded-4">
      <div className="title">
        <h3>Information's User</h3>
      </div>
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
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group my-1">
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-control"
                id="phone"
                aria-describedby="emailHelp"
                placeholder="Phone number"
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group my-1">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                id="role"
                aria-describedby="emailHelp"
                placeholder="Your role"
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
                onChange={formik.handleChange}
              />
            </div>
            <div className="form-group mb-3">
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
            </div>
            <div className="btnSubmit d-md-flex justify-content-md-end">
              <button
                className="btn btn-outline-success btn-md me-4 rounded-pill px-4"
                type="submit"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
