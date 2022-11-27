import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Booking,
  cancelBookingById,
  setBookingListAfterDeleted,
} from "../../redux/reducers/bookingReducer";
import { Room } from "../../redux/reducers/roomReducer";
import moment from "moment";
import { openNotificationWithIcon } from "../../util/notification";
import { AppDispatch } from "../../redux/configStore";
import { useDispatch } from "react-redux";
import { setStoreJSON } from "../../util/setting";

type Props = {
  room: Room;
  booking: Booking;
};

export default function BookedRoomItem({ room, booking }: Props) {
  const currDate = moment(new Date());

  const checkinDate = moment(booking.ngayDen);
  const checkoutDate = moment(booking.ngayDi);

  let duration = moment.duration(checkinDate.diff(currDate));
  let days = Math.ceil(duration.asDays());

  const navigate = useNavigate();

  const dispatch: AppDispatch = useDispatch();

  const handleCancleBooking = (bookingId: number) => {
    dispatch(cancelBookingById(bookingId));
  };

  const handleEditBooking = () => {
    setStoreJSON("bookingInfo", booking);
    navigate(`/roomdetail/${room.id}`);
  };

  return (
    <div className="booked-room__content">
      <div className="row gap-2">
        <div className="col-4 booked-room-img">
          <img src={room.hinhAnh} alt={room.tenPhong} />
        </div>
        <div className="col-7 booked-room-info py-2">
          <NavLink to={`/roomdetail/${room.id}`}>
            <h4>
              <strong>
                {room.tenPhong.length > 35
                  ? room.tenPhong.slice(0, 35) + "..."
                  : room.tenPhong}
              </strong>
            </h4>
          </NavLink>
          <div className="booked-room__date d-flex gap-3">
            <div className="booked-room__checkin">
              <strong>Check-in: </strong>
              <span>{checkinDate.format("DD-MM-YYYY")}</span>
            </div>
            <div className="booked-room__checkout">
              <strong>Check-out: </strong>
              <span>{checkoutDate.format("DD-MM-YYYY")}</span>
            </div>
          </div>
          <div className="booked-room__guests">
            <strong>Số lượng khách: </strong>
            <span>{booking.soLuongKhach}</span>
          </div>
          <NavLink
            to={`/roomdetail/${room.id}`}
            className="text-primary btn--underline"
          >
            Xem chi tiết phòng
          </NavLink>
          <div className="booked-room__btns d-flex justify-content-end">
            <button
              className="btn btn-sm btn-danger me-2"
              disabled={days <= 1 && true}
              onClick={() =>
                booking && handleCancleBooking(booking.id as number)
              }
              type="button"
            >
              Huỷ
            </button>
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={days <= 0 && true}
              onClick={() => handleEditBooking()}
            >
              Sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
