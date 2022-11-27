import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useWindowWidth } from "../Hooks/useWindowWidth";
import { AppDispatch, RootState } from "../redux/configStore";
import { getRoomByIdApi } from "../redux/reducers/roomReducer";
import RoomMediumScreen from "../pages/Room/RoomMediumScreen";
import RoomSmallScreen from "../pages/Room/RoomSmallScreen";
import useLocationPathname from "../Hooks/useLocationPathname";
import { clearLocalStorage } from "../util/setting";

interface Amenities {
  [key: string]: string;
}

const amenitiesIcons: Amenities = {
  banLa: "fas fa-tshirt",
  bep: "fas fa-utensils",
  doXe: "fas fa-parking",
  hoBoi: "fas fa-swimming-pool",
  mayGiat: "fas fa-tshirt",
  tivi: "fas fa-tv",
  wifi: "fas fa-wifi",
  dieuHoa: "fas fa-wind",
};

const amenitiesNames: Amenities = {
  banLa: "Bàn là",
  bep: "Bếp",
  dieuHoa: "Điều hoà",
  doXe: "Chỗ đậu xe",
  hoBoi: "Hồ bơi",
  mayGiat: "Máy giặt",
  tivi: "Tivi",
  wifi: "Wifi",
};

type Props = {};

export default function Room({}: Props) {
  const { room } = useSelector((state: RootState) => state.roomReducer);

  const { roomId } = useParams();

  const dispatch: AppDispatch = useDispatch();

  const renderRoomAmenities = (amenity: boolean, key: string) =>
    amenity ? (
      <div className="room-amenity__item row">
        <div className="room-amenity__item--icon col-6">
          <i className={`${amenitiesIcons[key]} stroke-transparent`}></i>
        </div>
        <span className="ms-3">{amenitiesNames[key]}</span>
      </div>
    ) : (
      ""
    );

  const location = useLocationPathname();

  const width = useWindowWidth();

  useEffect(() => {
    dispatch(getRoomByIdApi(roomId));
  }, [roomId]);

  useEffect(() => {
    return () => clearLocalStorage('bookingInfo')
  }, [])

  if (width <= 767.98) {
    return <RoomSmallScreen room={room} />;
  }

  return <RoomMediumScreen room={room} />;
}
