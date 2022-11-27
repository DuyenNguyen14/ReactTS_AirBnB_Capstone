import { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import Button from "../Button/Button";
import { DateRangePicker, DateRangePickerValue } from "@mantine/dates";
import { MantineProvider } from "@mantine/core";
import { useWindowWidth } from "../../Hooks/useWindowWidth";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/configStore";
import moment from "moment";
import { ACCESS_TOKEN, getStoreJSON, USER_LOGIN } from "../../util/setting";
import {
  Booking,
  bookingApi,
  editBooking,
} from "../../redux/reducers/bookingReducer";
import Swal from "sweetalert2";
import { User } from "../../redux/reducers/authReducer";

type Props = {};

export default function BookingBox({}: Props) {
  const bookingInfo: Booking = getStoreJSON("bookingInfo");

  // format ngayDen, ngayDi trong obj bookingInfo để phù hợp với type của state DateRangePickerValue
  const checkinDate = bookingInfo && moment(bookingInfo.ngayDen).toDate();
  const checkoutDate = bookingInfo && moment(bookingInfo.ngayDi).toDate();

  const { room } = useSelector((state: RootState) => state.roomReducer);

  const { roomId } = useParams();

  // state của DateRangePicker: nếu có bookingInfo ở localStorage thì initital value là ngayDen và ngayDi trong obj bookingInfo, nếu không thì 2 giá trị là null
  const [value, setValue] = useState<DateRangePickerValue>(
    bookingInfo && roomId && bookingInfo.maPhong === Number(roomId)
      ? [checkinDate, checkoutDate]
      : [null, null]
  );
  const checkinCalendar = value[0] && moment(value[0]).format("DD-MM-YYYY");
  const checkoutCalendar = value[1] && moment(value[1]).format("DD-MM-YYYY");

  const [guestNum, setGuestNum] = useState(
    bookingInfo && bookingInfo.maPhong === room.id
      ? bookingInfo.soLuongKhach
      : 1
  );

  const navigate = useNavigate();

  // function của nút tăng/ giảm số lượng khách
  const handleChangeGuestNum = (increOrDecre: boolean) => {
    if (increOrDecre) {
      setGuestNum((prevState) => prevState + 1);
    } else {
      setGuestNum((prevState) => prevState - 1);
    }
  };

  // tính số ngày tính từ ngày check-in đến ngày check-out
  let startDateTime = value[0]?.getTime();
  let endDateTime = value[1]?.getTime();

  const calNumOfDays = () => {
    if (startDateTime && endDateTime) {
      return Math.round((endDateTime - startDateTime) / (1000 * 3600 * 24));
    }
  };

  let numOfDays = calNumOfDays();
  //  ----------------------

  // tính tổng tiền dựa trên tổng số ngày book phòng
  const calTotalPrice = () =>
    numOfDays !== undefined ? room.giaTien * numOfDays : 0;

  let width = useWindowWidth();

  const user: User = getStoreJSON(USER_LOGIN);
  const accessToken: string = getStoreJSON(ACCESS_TOKEN);

  const dispatch: AppDispatch = useDispatch();

  const handleBooking = async () => {
    const bookingValue: Booking = {
      maPhong: room.id,
      ngayDen: moment(value[0]).format("L").toString(),
      ngayDi: moment(value[1]).format("L").toString(),
      soLuongKhach: guestNum,
      maNguoiDung: user.id as number,
    };
    // trường hợp sửa thông tin đặt phòng
    if (user) {
      if (bookingInfo && bookingInfo.maPhong === room.id) {
        console.log(bookingValue);
        await dispatch(
          editBooking(bookingInfo.id as number, {
            ...bookingValue,
            id:
              bookingInfo && bookingInfo.maPhong === room.id
                ? bookingInfo.id
                : undefined,
          })
        );
      }
      // trường hợp đặt phòng mới
      if (value[0] && value[1]) {
        await dispatch(bookingApi(bookingValue, user.id as number));
      }
    }
  };

  const handleClick = () => {
    if (user && accessToken) {
      Swal.fire({
        title: "Xác nhận đặt phòng?",
        icon: "question",
        html:
          `<div class="checkinInfo"><strong>Ngày check-in: </strong><span>${checkinCalendar}</span></div>` +
          `<div class="checkoutInfo"><strong>Ngày check-out: </strong><span>${checkoutCalendar}</span></div>` +
          `<div class="guestsInfo"><strong>Số lượng khách: </strong><span>${guestNum}</span></div>` +
          `<div class="priceInfo"><strong>Tổng tiền: </strong><span>$${calTotalPrice()}</span></div>`,
        showCancelButton: true,
        confirmButtonText: "Xác nhận",
      }).then((result) => {
        console.log(result);
        if (result.isConfirmed) {
          handleBooking();
        }
      });
    } else if (!user && !accessToken) {
      Swal.fire({
        title: "Vui lòng đăng nhập để tiếp tục đặt phòng!",
        icon: "warning",
        html: `<a href="/signin">Đi tới trang đăng nhập!</a>`,
        showCancelButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }
  };

  return (
    <div className="booking-box">
      <div className="booking-box__title d-flex justify-content-between">
        <div className="room-price">
          <strong>${room.giaTien}</strong>
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
          hidden={
            bookingInfo && bookingInfo.maPhong === room.id
              ? false
              : value[0] === null || value[1] === null
              ? true
              : false
          }
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
            onClick={() => handleClick()}
            disabled={
              bookingInfo && bookingInfo.maPhong === room.id
                ? false
                : value[0] === null || value[1] === null
                ? true
                : false
            }
          >
            {bookingInfo && bookingInfo.maPhong === room.id
              ? "Sửa thông tin đặt phòng"
              : "Đặt phòng"}
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
