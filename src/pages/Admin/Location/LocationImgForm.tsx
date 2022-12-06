import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import useUploadImage from "../../../Hooks/useUploadImage";
import { AppDispatch } from "../../../redux/configStore";
import {
  Location,
  uploadLocationImg,
} from "../../../redux/reducers/locationsReducer";
import { setOpen } from "../../../redux/reducers/modalReducer";

type Props = {
  location: Location;
};

export default function LocationImgForm({ location }: Props) {
  const {
    selectedImg,
    handleFileChange,
    handleCancelUploadImg,
    imgRef,
    hideBtn,
    setHideBtn,
  } = useUploadImage();

  const dispatch: AppDispatch = useDispatch();

  const handleUploadImg = (locationId: number | null) => {
    if (locationId) {
      if (imgRef.current.files.length > 0 && imgRef.current.files[0]) {
        const formData = new FormData();
        formData.append("formFile", imgRef.current.files[0]);
        dispatch(uploadLocationImg(formData, locationId));
        setHideBtn(true);
      }
    }
  };

  return (
    <div className="container-sm">
      <div className="location-img">
        <h4>Hình ảnh</h4>
        <img
          src={selectedImg ? (selectedImg as string) : location.hinhAnh}
          alt="Hình vị trí"
          hidden={location.hinhAnh !== "" ? false : selectedImg ? false : true}
        />

        <div className="d-flex mt-2">
          <button
            className="btn btn--underline"
            type="button"
            onClick={() => document.getElementById("hinhAnh")?.click()}
          >
            Sửa ảnh vị trí
          </button>
          <input
            ref={imgRef}
            type="file"
            name="hinhAnh"
            hidden
            id="hinhAnh"
            onChange={handleFileChange}
          />
          <div className="location-img__" hidden={hideBtn}>
            <button
              className="btn--primary ms-2"
              type="button"
              onClick={() => handleUploadImg(location.id)}
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
      </div>
      <hr />
      <div className="form-btns d-flex justify-content-end gap-2">
        <Button type="default" onClick={() => dispatch(setOpen(false))}>
          Đóng
        </Button>
      </div>
    </div>
  );
}
