import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/configStore";
import { getRentedRoomByUserId } from "../../redux/reducers/bookingReducer";
import { RoomState } from "../../redux/reducers/positionReducer";
import { getRoomByIdApi, Room } from "../../redux/reducers/roomReducer";
import { http } from "../../util/setting";
import Loading from "../Loading/Loading";
import RentedRoomItem from "./RentedRoomItem";

let timeout: ReturnType<typeof setTimeout>;

type Props = {
  userId: number;
};

export default function RentedRoom({ userId }: Props) {
  const { bookedRoomIds, bookingList } = useSelector(
    (state: RootState) => state.bookingReducer
  );

  console.log("mounted");

  const { room } = useSelector((state: RootState) => state.roomReducer);

  const [roomList, setRoomList] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getRentedRoomByUserId(userId));
  }, [userId]);

  useEffect(() => {
    if (bookingList.length > 0) {
      timeout = setTimeout(async () => {
        for (const room of bookingList) {
          await dispatch(getRoomByIdApi(room.maPhong));
        }
      }, 800);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [bookedRoomIds]);

  useEffect(() => {
    setRoomList((prevState) => [...prevState, room]);
  }, [room]);

  useEffect(() => {
    if (bookingList.length === roomList.length) {
      setLoading(false);
    }
  }, [bookingList, roomList]);

  const render = () => {
    if (bookingList.length > 1 && roomList.length > 1) {
      return bookingList.map((booking) => {
        const room = roomList.find((room) => room.id === booking.maPhong);
        if (room) {
          return (
            <div key={booking.id} className="booking-item my-3">
              <RentedRoomItem room={room} booking={booking} />
            </div>
          );
        }
      });
    }
  };
  return <>{loading ? "loading..." : render()}</>;
}
