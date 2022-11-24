import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { MantineProvider } from "@mantine/core";
import { useWindowWidth } from "../../Hooks/useWindowWidth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/configStore";
import moment from "moment";
import { getStoreJSON } from "../../util/setting";
import { Booking, bookingApi } from "../../redux/reducers/bookingReducer";
import { openNotificationWithIcon } from "../../util/notification";

type Props = {};

export default function BookingBox({}: Props) {
  const [value, setValue] = useState<DateRangePickerValue>([null, null]);
  console.log(moment(value[0]).format("L"));

  const [guestNum, setGuestNum] = useState(1);

  const { room } = useSelector((state: RootState) => state.roomReducer);

  const navigate = useNavigate();

  const handleChangeGuestNum = (increOrDecre: boolean) => {
    if (increOrDecre) {
      setGuestNum((prevState) => prevState + 1);
    } else {
      setGuestNum((prevState) => prevState - 1);
    }
  };

  let startDateTime = value[0]?.getTime();
  let endDateTime = value[1]?.getTime();
  const calNumOfDays = () => {
    if (startDateTime !== undefined && endDateTime !== undefined) {
      return Math.round((endDateTime - startDateTime) / (1000 * 3600 * 24));
    }
  };

  let numOfDays = calNumOfDays();

  const calTotalPrice = () =>
    numOfDays !== undefined ? room.giaTien * numOfDays : 0;

  let width = useWindowWidth();

  const user = getStoreJSON("userLogin");

  const dispatch: AppDispatch = useDispatch();

  const handleBooking = () => {
    if (user && value[0] && value[1]) {
      const bookingInfo: Booking = {
        maPhong: room.id,
        ngayDen: moment(value[0]).format("L").toString(),
        ngayDi: moment(value[1]).format("L").toString(),
        soLuongKhach: guestNum,
        maNguoiDung: user.id,
      };
      console.log(bookingInfo);
      dispatch(bookingApi(bookingInfo));
      openNotificationWithIcon(
        "success",
        "Đặt phòng thành công",
        <p>
          Tiếp tục đặt phòng hoặc di chuyển tới{" "}
          <a href="/profile">Lịch sử đặt phòng</a>
        </p>
      );
    } else if (!user) {
      openNotificationWithIcon(
        "error",
        "Vui lòng đăng nhập để đặt phòng!",
        <a href="/signin">Đi tới trang đăng nhập</a>
      );
    }
  };

  return (
    <div className="booking-box">
      <div className="booking-box__title d-flex justify-content-between">
        <div className="room-price">
          <strong>$14</strong>
          <span> đêm</span>
        </div>
        <div className="room-ratings d-flex">
          <span>
            <i className="fa fa-star"></i> 4.96
          </span>
          <div className="dot">
            <i className="fa fa-circle"></i>
          </div>
          <NavLink to="#">26 đánh giá</NavLink>
        </div>
      </div>
      <div className="booking-box__content mt-2">
        <MantineProvider
          theme={{ fontFamily: "'Nunito Sans', sans-serif", fontSizes: "1rem" }}
        >
          <DateRangePicker
            label={<strong>CHECK-IN - CHECK-OUT</strong>}
            placeholder="Chọn ngày nhận - trả phòng"
            value={value}
            onChange={setValue}
            amountOfMonths={2}
            icon={<i className="far fa-calendar-alt"></i>}
            minDate={new Date()}
            dropdownType={width <= 767.98 ? "modal" : "popover"}
            required
          />
        </MantineProvider>

        <div
          className="guests-num mt-3"
          hidden={value[0] === null || value[1] === null ? true : false}
        >
          <h5>
            <strong>Số lượng khách</strong>
          </h5>
          <div className="d-flex justify-content-between align-items-center">
            <button
              className="btn--primary py-2 px-3"
              onClick={() => handleChangeGuestNum(false)}
              disabled={guestNum <= 1 ? true : false}
            >
              -
            </button>
            <strong>{guestNum}</strong>
            <button
              className="btn--primary py-2 px-3"
              onClick={() => handleChangeGuestNum(true)}
              disabled={guestNum >= room.khach ? true : false}
            >
              +
            </button>
          </div>
        </div>

        <div className="bookingBtn">
          <Button
            path="#"
            className="btn--primary"
            onClick={() => handleBooking()}
            disabled={value[0] === null || value[1] === null ? true : false}
          >
            Đặt phòng
          </Button>
        </div>
        <div className="booking-bill row justify-content-between">
          <div className="col-8">
            <u>
              ${room.giaTien} x {numOfDays} đêm
            </u>
          </div>
          <div className="col-2">
            <p>${calTotalPrice()}</p>
          </div>
        </div>
        <div className="divider"></div>
        <div className="booking__footer row justify-content-between">
          <div className="col-8">
            <p>Tổng trước thuế</p>
          </div>
          <div className="col-2">
            <p>${calTotalPrice()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
