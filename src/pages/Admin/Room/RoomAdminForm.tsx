import React, { useCallback, useEffect, useState } from "react";
import {
  addRoomApi,
  editRoomApi,
  getAllRoomsApi,
  Room,
  setIsSuccessful,
} from "../../../redux/reducers/roomReducer";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/configStore";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { amenitiesNames, getAmenities } from "../../../util/roomUtil";
import {
  getLocationsApi,
  Location,
} from "../../../redux/reducers/locationsReducer";
import { Button } from "antd";
import { setOpen } from "../../../redux/reducers/modalReducer";

type Props = {
  room: Room | null;
};

export default function RoomAdminForm({ room }: Props) {
  const { isSuccessful } = useSelector((state: RootState) => state.roomReducer);
  const { arrLocations } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const renderRoomLocation = () =>
    room && arrLocations.find((location) => room.maViTri === location.id);

  const location = useCallback(() => {
    return renderRoomLocation();
  }, [room]);

  let locationName =
    location()?.tenViTri +
    ", " +
    location()?.tinhThanh +
    ", " +
    location()?.quocGia;

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
          // đưa dữ liệu file vào formik
          setFieldValue("hinhAnh", e.target?.result);
        };
      }
    }
  };
  // ------------------------

  // --------------- Xử lý tìm vị trí cho phòng --------------
  // state cho input tìm vị trí
  const [locationSearchTerm, setLocationSearchTerm] = useState<string>("");

  const [locationId, setLocationId] = useState<number>(0);

  // func handle onChange cho input tìm vị trí
  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearchTerm(e.target.value);
  };

  const handleSearchLocation = () => {
    return arrLocations?.filter((location) => {
      const searchTerm = locationSearchTerm.toLowerCase();
      const locationName =
        location.tenViTri.toLowerCase() + location.tinhThanh.toLowerCase();

      return (
        searchTerm &&
        (locationName.includes(searchTerm) ||
          locationName.startsWith(searchTerm))
      );
    });
  };
  // ------------------------------

  const renderLocationList = () =>
    handleSearchLocation()?.map((location: Location) => {
      let locationName =
        location.tenViTri + ", " + location.tinhThanh + ", " + location.quocGia;
      return (
        <li
          key={location.id}
          onClick={() => {
            setLocationSearchTerm(locationName);
            setLocationId(location.id);
            setFieldValue("maViTri", locationId);
          }}
        >
          {locationName}
        </li>
      );
    });

  const formik = useFormik<Room>({
    initialValues: room
      ? room
      : {
          id: 0,
          tenPhong: "",
          khach: 0,
          phongNgu: 0,
          giuong: 0,
          phongTam: 0,
          moTa: "",
          giaTien: 0,
          mayGiat: false,
          banLa: false,
          tivi: false,
          dieuHoa: false,
          wifi: false,
          bep: false,
          doXe: false,
          hoBoi: false,
          banUi: false,
          maViTri: locationId,
          hinhAnh: "",
        },
    validationSchema: Yup.object({
      tenPhong: Yup.string()
        .required("Không được bỏ trống trường này!")
        .min(15, "Tên phòng phải chứa hơn 15 kí tự!")
        .max(150, "Tên phòng không được dài hơn 80 kí tự!"),
      giaTien: Yup.number()
        .required("Vui lòng thêm giá tiền cho phòng!")
        .min(1, "Giá tiền không được nhỏ hơn 0!"),
      khach: Yup.number()
        .required("Không được bỏ trống trường này!")
        .min(-1, "Số lượng tối đa không được nhỏ hơn 0!"),
      phongNgu: Yup.number()
        .required("Không được bỏ trống trường này!")
        .min(-1, "Số lượng tối đa không được nhỏ hơn 0!"),
      giuong: Yup.number()
        .required("Không được bỏ trống trường này!")
        .min(-1, "Số lượng tối đa không được nhỏ hơn 0!"),
      phongTam: Yup.number()
        .required("Không được bỏ trống trường này!")
        .min(-1, "Số lượng tối đa không được nhỏ hơn 0!"),
      moTa: Yup.string()
        .required("Không được bỏ trống trường này!")
        .min(50, "Mô tả phải chứa hơn 50 kí tự!"),
      hinhAnh: Yup.mixed().required("Vui lòng thêm hình ảnh cho phòng!"),
      // maViTri: Yup.number().min(1, "Không được bỏ trống trường này!"),
    }),
    onSubmit: async (values) => {
      if (!room) {
        values.maViTri = locationId;
        console.log(values);
        await dispatch(addRoomApi(values));
      }
      if (room) {
        await dispatch(editRoomApi(values));
      }
    },
  });

  const {
    handleChange,
    handleSubmit,
    handleBlur,
    errors,
    values,
    setFieldValue,
  } = formik;

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getLocationsApi());
  }, []);

  useEffect(() => {
    if (isSuccessful) {
      dispatch(setOpen(false));
    }

    return () => {
      dispatch(setIsSuccessful(false));
    };
  }, [isSuccessful]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="container-sm">
        <div className="room-title">
          <h3 className="mb-0">
            <input
              required
              type="text"
              className="form-control"
              name="tenPhong"
              onChange={handleChange}
              placeholder="Nhập tên phòng"
              onBlur={handleBlur}
              value={values.tenPhong}
            />
          </h3>
          {errors.tenPhong && (
            <span className="text-danger">{errors.tenPhong}</span>
          )}
        </div>
        <div className="room-img mt-3">
          <h4>Hình ảnh</h4>
          {room ? (
            <LazyLoadImage
              src={selectedImg ? (selectedImg as string) : values.hinhAnh}
              alt={values.tenPhong}
              effect="blur"
            />
          ) : (
            selectedImg && (
              <LazyLoadImage
                src={selectedImg as string}
                alt={values.tenPhong}
                effect="blur"
              />
            )
          )}
          {errors.hinhAnh && (
            <span className="d-block mt-2 text-danger">{errors.hinhAnh}</span>
          )}
          <input
            className="btn btn-sm btn-outline-dark mt-2"
            type="button"
            value="Thêm ảnh phòng"
            onClick={() => document.getElementById("hinhAnh")?.click()}
          />
          <input
            type="file"
            accept=".jpg, .png, .jpeg"
            onChange={handleChangeFile}
            onBlur={handleBlur}
            id="hinhAnh"
            name="hinhAnh"
            hidden
          />
        </div>
        <div className="row mt-3 justify-content-between">
          <div className="col-6">
            <div className="form-group mb-3">
              <label htmlFor="tenViTri" className="required">
                Vị trí
              </label>
              <input
                type="text"
                className="form-control w-75"
                id="tenViTri"
                name="tenViTri"
                value={room ? locationName : locationSearchTerm}
                disabled={room ? true : false}
                onChange={handleChangeSearch}
              />

              <div className="locations-list">
                <ul>{renderLocationList()}</ul>
              </div>
            </div>
            {/* mã phòng */}
            <div className="form-group mb-3" hidden={!room ? true : false}>
              <label htmlFor="id" className="required">
                Mã phòng
              </label>
              <input
                type="number"
                className="form-control w-75"
                name="id"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.id}
                disabled={room ? true : false}
              />
              {room
                ? ""
                : errors.id && (
                    <span className="text-danger mt-2">{errors.id}</span>
                  )}
            </div>
            {/* giá tiền */}
            <div className="form-group mb-3">
              <label htmlFor="giaTien" className="required">
                Giá tiền
              </label>
              <input
                required
                type="number"
                className="form-control w-75"
                placeholder="Đơn vị: USD"
                id="giaTien"
                name="giaTien"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.giaTien}
              />
              <span className="text-secondary d-block">Đơn vị: USD</span>
              {errors.giaTien && (
                <span className="text-danger">{errors.giaTien}</span>
              )}
            </div>
          </div>
          {/* tiện nghi */}
          <div className="col-6">
            <h4 className="mt-3">Tiện nghi</h4>
            <div className="room-amenities row mt-2">
              {getAmenities(values, values).map((amenity, index) => (
                <div className="col-6" key={index}>
                  <div className="form-check form-switch">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`${amenity.key}`}
                      name={`${amenity.key}`}
                      checked={amenity.value ? true : false}
                      onChange={handleChange}
                    />
                    <label htmlFor="mayGiat">
                      {amenitiesNames[`${amenity.key}`]}
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* số lượng tối đa */}
          <h4 className="mt-3 required">Số lượng tối đa</h4>
          <div className="room-maximum">
            <div className="row mt-2">
              <div className="col-6">
                <div className="form-group row align-items-center">
                  <div className="col-3">
                    <label htmlFor="khach">Khách</label>
                  </div>
                  <div className="col-7">
                    <input
                      required
                      id="khach"
                      type="number"
                      className="form-control ms-2 w-50"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.khach}
                    />
                  </div>
                  {errors.khach && (
                    <span className="text-danger mt-2">{errors.khach}</span>
                  )}
                </div>
                <div className="form-group row align-items-center mt-2">
                  <div className="col-3">
                    <label htmlFor="phongTam" className="text-nowrap">
                      Phòng tắm
                    </label>
                  </div>
                  <div className="col-7">
                    <input
                      required
                      id="phongTam"
                      type="number"
                      className="form-control ms-2 w-50"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phongTam}
                    />
                  </div>
                  {errors.phongTam && (
                    <span className="text-danger mt-2">{errors.phongTam}</span>
                  )}
                </div>
              </div>
              <div className="col-6">
                <div className="form-group row align-items-center">
                  <div className="col-3">
                    <label htmlFor="phongNgu" className="text-nowrap">
                      Phòng ngủ
                    </label>
                  </div>
                  <div className="col-7">
                    <input
                      required
                      id="phongNgu"
                      type="number"
                      className="form-control ms-2 w-50"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phongNgu}
                    />
                  </div>
                  {errors.phongNgu && (
                    <span className="text-danger mt-2">{errors.phongNgu}</span>
                  )}
                </div>
                <div className="form-group row align-items-center mt-2">
                  <div className="col-3">
                    <label htmlFor="giuong" className="text-nowrap">
                      Giường
                    </label>
                  </div>
                  <div className="col-7">
                    <input
                      required
                      id="giuong"
                      type="number"
                      className="form-control ms-2 w-50"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.giuong}
                    />
                  </div>
                  {errors.giuong && (
                    <span className="text-danger mt-2">{errors.giuong}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* mô tả */}
          <h4 className="mt-3">
            <label htmlFor="moTa required">Mô tả</label>
            <textarea
              required
              id="moTa"
              className="form-control mt-2"
              style={{ height: "180px" }}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.moTa}
            ></textarea>
            {errors.moTa && (
              <span
                className="mt-3 text-danger"
                style={{ fontSize: "0.875rem" }}
              >
                {errors.moTa}
              </span>
            )}
          </h4>
        </div>
      </div>
      <hr />
      <div className="form-btns d-flex justify-content-end gap-2">
        <Button type="default" onClick={() => dispatch(setOpen(false))}>
          Đóng
        </Button>
        <button type="submit" className="btn p-0">
          <Button type="primary">{room ? "Cập nhật" : "Thêm mới"}</Button>
        </button>
      </div>
    </form>
  );
}
