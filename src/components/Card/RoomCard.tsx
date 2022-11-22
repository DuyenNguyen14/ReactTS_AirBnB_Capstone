import React from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink } from "react-router-dom";
import { Location } from "../../redux/reducers/locationsReducer";
import { Room } from "../../redux/reducers/roomReducer";

type Props = {
  room: Room;
  location: Location;
};

export default function RoomCard({ room, location }: Props) {
  return (
    <div className="card">
      <NavLink to={`/roomdetail/${room.id}`}>
        <div className="card-img">
          <LazyLoadImage src={room.hinhAnh} alt={room.tenPhong} effect="blur" />
          <div className="card-img__icon">
            <i className="far fa-heart"></i>
          </div>
        </div>
        <div className="card-info">
          <div className="d-flex justify-content-between">
            <div className="card-title">
              <h4>
                {room.tenPhong.toLowerCase().length > 25
                  ? room.tenPhong.slice(0, 25) + "..."
                  : room.tenPhong}
              </h4>
            </div>
            <div className="room-ratings">
              <i className="fa fa-star me-2"></i>
              <span>5.0 (55)</span>
            </div>
          </div>
          <div className="room-info__sub">
            <p>
              {location.tenViTri} - {location.tinhThanh}
            </p>
            <p>{room.giuong} giường</p>
          </div>
          <div className="room-info__price">
            <strong>${room.giaTien}</strong> <span> night</span>
          </div>
        </div>
      </NavLink>
    </div>
  );
}
