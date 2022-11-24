import React from "react";
import { NavLink } from "react-router-dom";
import { Booking } from "../../redux/reducers/bookingReducer";
import { Room } from "../../redux/reducers/roomReducer";

type Props = {
  room: Room;
  booking: Booking;
};

export default function RentedRoomItem({ room, booking }: Props) {
  return (
    <NavLink className="rented-room__content" to={`/roomdetail/${room.id}`}>
      <div className="row gap-2">
        <div className="col-4 rented-room-img">
          <img src={room.hinhAnh} alt={room.tenPhong} />
        </div>
        <div className="col-7">ksjdfksjd</div>
      </div>
    </NavLink>
  );
}
