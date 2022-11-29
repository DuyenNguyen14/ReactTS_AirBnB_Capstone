import { useFormik } from "formik";
import * as Yup from "yup";
import { editUserAction, User } from "../../../redux/reducers/userReducer";
import { AppDispatch } from "../../../redux/configStore";
import { useDispatch } from "react-redux";
import { setOpen } from "../../../redux/reducers/modalReducer";
import moment from "moment";

type Props = {
  user: User | null;
};

export default function UserAdminForm({ user }: Props) {
  const dispatch: AppDispatch = useDispatch();

  const userDOB = () => {
    if (user) {
      const dateStr = moment(user.birthday, "YYYY-MM-DD").format("l");
      const [month, day, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
  };

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
          gender: true,
          role: "USER",
        },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Name is required!"),
      email: Yup.string()
        .required("Email is required!")
        .email("Invalid email!"),
      phone: Yup.string()
        .required("Phone is required!")
        .min(10, "Phone must have at least 10 number"),
      birthday: Yup.string().required("birthday is required!"),
    }),
    onSubmit: async (values) => {
      console.log("User: ", values);
      if (user) {
        dispatch(editUserAction(user.id, values));
      }
      // await dispatch(addUserApi(values));
    },
  });

  const { values, handleChange, handleBlur, errors, setFieldValue } = formik;

  return (
    <div className="update-user container my-3 p-4 rounded-4">
      <div className="title">
        <h3>Information's User</h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <div className="row">
          <div className="col-lg-6 col-sm-12">
            {user && (
              <div className="form-group">
                <label className="form-label" htmlFor="id">
                  ID
                </label>
                <input
                  disabled
                  type="number"
                  className="form-control"
                  placeholder="User's ID"
                  id="id"
                  value={values.id}
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                />
              </div>
            )}
            {/* email */}
            <div className="form-group mt-3">
              <label className="form-label required" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Email adrress"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && (
                <span className="text-danger mt-2">{errors.email}</span>
              )}
            </div>
            {/* phone */}
            <div className="form-group mt-3">
              <label className="form-label required">Phone</label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                placeholder="Phone number"
                onChange={formik.handleChange}
                onBlur={handleBlur}
                value={values.phone}
              />
            </div>
            {/* role */}
            <div className="form-group mt-3">
              <label htmlFor="role" className="form-label required">
                Role
              </label>
              <select
                className="form-select"
                name="role"
                id="role"
                onChange={handleChange}
                defaultValue={values.role}
                value={values.role}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="USER">USER</option>
              </select>
            </div>
          </div>
          {/* birthday */}
          <div className="col-lg-6 col-sm-12">
            <div className="form-group mt-3 mt-lg-0">
              <label className="form-label required" htmlFor="birthday">
                Birthday
              </label>
              <input
                type="date"
                className="form-control"
                id="birthday"
                value={userDOB()}
                placeholder="Your birthday"
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.birthday && (
                <span className="text-danger mt-2">{errors.birthday}</span>
              )}
            </div>
            {/* name */}
            <div className="form-group mt-3">
              <label className="form-label required" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                placeholder="Your name"
                value={values.name}
                onChange={formik.handleChange}
                onBlur={handleBlur}
              />
              {errors.name && (
                <span className="text-danger mt-2">{errors.name}</span>
              )}
            </div>
            <div className="mt-4">
              <p className="m-0 required">Gender</p>
              <div className="d-flex">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="male"
                    checked={values.gender}
                    onChange={(e) => {
                      setFieldValue("gender", true);
                    }}
                  />
                  <label className="form-check-label" htmlFor="male">
                    Male
                  </label>
                </div>
                <div className="form-check ms-3">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="gender"
                    id="female"
                    checked={!values.gender}
                    onChange={(e) => {
                      setFieldValue("gender", false);
                    }}
                  />
                  <label className="form-check-label" htmlFor="female">
                    Female
                  </label>
                </div>
              </div>
            </div>
            <div className="d-md-flex justify-content-md-end mt-3">
              <button
                className="btn btn-outline-success btn-md me-4 rounded-pill px-4"
                type="submit"
              >
                Xác nhận
              </button>
              <button
                className="btn btn-outline-secondary btn-md me-4 rounded-pill px-4"
                type="button"
                onClick={() => dispatch(setOpen(false))}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
