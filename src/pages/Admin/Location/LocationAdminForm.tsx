import { Button } from "antd";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/configStore";
import {
  addLocation,
  editLocation,
  Location,
} from "../../../redux/reducers/locationsReducer";
import { setOpen, setTitle } from "../../../redux/reducers/modalReducer";
import * as Yup from "yup";
import useUploadImage from "../../../Hooks/useUploadImage";

type Props = {
  location: null | Location;
};

export default function LocationAdminForm({ location }: Props) {
  const dispatch: AppDispatch = useDispatch();

  const formik = useFormik<Location>({
    initialValues: location
      ? location
      : {
          id: 0,
          tenViTri: "",
          tinhThanh: "",
          quocGia: "",
          hinhAnh: "",
        },
    validationSchema: Yup.object({
      hinhAnh: Yup.mixed().required("Hãy thêm ảnh cho vị trí!"),
      tenViTri: Yup.string().required("Không được bỏ trống trường này!"),
      tinhThanh: Yup.string().required("Không được bỏ trống trường này!"),
      quocGia: Yup.string().required("Không được bỏ trống trường này!"),
    }),
    onSubmit: async (values) => {
      if (location) {
        if (selectedImg) {
          setFieldValue("hinhAnh", selectedImg);
        }
        dispatch(editLocation(values.id, values));
      } else {
        dispatch(addLocation(values));
      }
    },
  });

  const {
    handleSubmit,
    handleBlur,
    handleChange,
    errors,
    values,
    setFieldValue,
  } = formik;

  const {
    selectedImg,
    handleFileChange,
    handleCancelUploadImg,
    imgRef,
    hideBtn,
    setHideBtn,
  } = useUploadImage();

  //   trường hợp upload ảnh cho vị trí mới
  const handleUploadImg = () => {
    setFieldValue("hinhAnh", selectedImg);
    setHideBtn(true);
  };

  useEffect(() => {
    if (location) {
      dispatch(setTitle("Chi tiết"));
    } else {
      dispatch(setTitle("Thêm mới"));
    }
  }, [location]);

  return (
    <form autoComplete="off" onSubmit={handleSubmit}>
      <input
        autoComplete="false"
        name="hidden"
        type="text"
        style={{ display: "none" }}
      ></input>
      <div className="container-sm">
        <div className="location-img">
          <h4>Hình ảnh</h4>
          <img
            src={selectedImg ? (selectedImg as string) : values.hinhAnh}
            alt={values.tenViTri}
            hidden={values.hinhAnh !== "" ? false : selectedImg ? false : true}
          />
          {errors.hinhAnh && (
            <span className="mt-2 text-danger">{errors.hinhAnh}</span>
          )}
          {!location && (
            <div className="d-flex mt-2">
              <button
                className="btn btn--underline"
                type="button"
                onClick={() => document.getElementById("hinhAnh")?.click()}
              >
                Thêm ảnh vị trí
              </button>
              <input
                ref={imgRef}
                type="file"
                name="hinhAnh"
                hidden
                id="hinhAnh"
                onChange={handleFileChange}
                onBlur={handleBlur}
              />
              <div className="location-img__" hidden={hideBtn}>
                <button
                  className="btn--primary ms-2"
                  type="button"
                  onClick={handleUploadImg}
                >
                  <i className="fa fa-check"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary ms-2"
                  onClick={handleCancelUploadImg}
                >
                  <i className="fa fa-times"></i>
                </button>
              </div>
            </div>
          )}
        </div>
        {/* tenViTri */}
        <div className="form-group mt-3">
          <label htmlFor="tenViTri" className="required">
            Tên vị trí
          </label>
          <input
            name="tenViTri"
            type="text"
            className="form-control"
            value={values.tenViTri}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.tenViTri && (
            <span className="text-danger mt-2">{errors.tenViTri}</span>
          )}
        </div>
        {/* tinhThanh */}
        <div className="form-group mt-3">
          <label htmlFor="tinhThanh" className="required">
            Tỉnh thành
          </label>
          <input
            name="tinhThanh"
            type="text"
            className="form-control"
            value={values.tinhThanh}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.tinhThanh && (
            <span className="text-danger mt-2">{errors.tinhThanh}</span>
          )}
        </div>
        {/* quocGia */}
        <div className="form-group mt-3">
          <label htmlFor="quocGia" className="required">
            Quốc gia
          </label>
          <input
            name="quocGia"
            type="text"
            className="form-control"
            value={values.quocGia}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          {errors.quocGia && (
            <span className="text-danger mt-2">{errors.quocGia}</span>
          )}
        </div>
        <hr />
        <div className="form-btns d-flex justify-content-end gap-2">
          <Button type="default" onClick={() => dispatch(setOpen(false))}>
            Đóng
          </Button>
          <button type="submit" className="btn p-0">
            <Button type="primary">{location ? "Cập nhật" : "Thêm mới"}</Button>
          </button>
        </div>
      </div>
    </form>
  );
}
