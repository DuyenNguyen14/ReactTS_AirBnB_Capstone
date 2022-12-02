import { useFormik } from "formik";
import React, { ChangeEvent } from "react";
import { editUserAction, User } from "../../redux/reducers/userReducer";
import * as Yup from "yup";
import { AppDispatch, RootState } from "../../redux/configStore";
import { useDispatch, useSelector } from "react-redux";
import { setStoreJSON, USER_LOGIN } from "../../util/setting";
import moment from "moment";

type Props = {
  userInfo: User;
  setClickEdit: React.Dispatch<React.SetStateAction<boolean>>;
};

function EditInfoForm({ userInfo, setClickEdit }: Props) {
  const { isSucceed } = useSelector((state: RootState) => state.userReducer);

  const birthday = () => {
    if (userInfo.birthday) {
      const dateStr = userInfo.birthday;
      const [day, month, year] = dateStr.split("/");
      return `${year}-${month}-${day}`;
    }
  };

  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik<User>({
    initialValues: userInfo,
    validationSchema: Yup.object({
      name: Yup.string().required("Không được để trống trường này!"),
      email: Yup.string()
        .required("Không được để trống trường này!")
        .email("Email không hợp lệ!"),
      phone: Yup.string()
        .required("Không được để trống trường này!")
        .min(10, "Số điện thoại phải bao gồm 10 số!"),
      birthday: Yup.string().required("Không được để trống trường này!"),
    }),
    onSubmit: async (values) => {
      console.log(values);
      await dispatch(editUserAction(userInfo.id, values));
      if (isSucceed) {
        setStoreJSON(USER_LOGIN, values);
      }
    },
  });

  const { values, handleChange, handleBlur, errors, handleSubmit } = formik;
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="name">Tên</label>
        <input
          autoFocus
          id="name"
          type="text"
          className="form-control"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.name && <span className="text-danger">{errors.name}</span>}
      </div>
      <div className="form-group mt-3">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className="form-control"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.email && <span className="text-danger">{errors.email}</span>}
      </div>
      <div className="form-group mt-3">
        <label htmlFor="birthday">Ngày sinh</label>
        <input
          id="birthday"
          type="date"
          className="form-control"
          value={values.birthday}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.birthday && (
          <span className="text-danger">{errors.birthday}</span>
        )}
      </div>
      <div className="form-group mt-3">
        <label htmlFor="phone">Số điện thoại</label>
        <input
          id="phone"
          type="tel"
          className="form-control"
          value={values.phone}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        {errors.phone && <span className="text-danger">{errors.phone}</span>}
      </div>
      <div className="d-flex mt-3 justify-content-between">
        <button
          className="btn btn--underline"
          onClick={() => setClickEdit(false)}
          type="button"
        >
          Đóng
        </button>
        <button className="btn--primary" type="submit">
          Lưu
        </button>
      </div>
    </form>
  );
}

export const EditInfoFormMemo = React.memo(EditInfoForm);
