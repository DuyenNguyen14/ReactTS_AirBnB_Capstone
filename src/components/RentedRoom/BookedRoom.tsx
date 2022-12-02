import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/configStore";
import {
  getRentedRoomByUserId,
  setFetching,
} from "../../redux/reducers/bookingReducer";
import { getRoomByIdApi, Room } from "../../redux/reducers/roomReducer";
import Loading from "../Loading/Loading";
import LoadingHorizontal from "../Loading/LoadingHorizontal";
import BookedRoomItem from "./BookedRoomItem";

const loadingGif = require("../../assets/img/loading-2.gif");

let timeout: ReturnType<typeof setTimeout>;

type Props = {
  userId: number;
};

export default function BookedRoom({ userId }: Props) {
  const { bookingList, fetching } = useSelector(
    (state: RootState) => state.bookingReducer
  );
  console.log({ fetching });

  const { room } = useSelector((state: RootState) => state.roomReducer);

  const [roomList, setRoomList] = useState<Room[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  console.log({ loading });

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getRentedRoomByUserId(userId));
  }, [userId]);

  useEffect(() => {
    // xét trường hợp đã fetch xong data
    if (!fetching) {
      // nếu bookingList.length > 0 thì thực hiện get roomInfo từ maPhong trong bookingList
      if (bookingList.length > 0) {
        timeout = setTimeout(async () => {
          for (const room of bookingList) {
            await dispatch(getRoomByIdApi(room.maPhong));
            if (bookingList.length === roomList.length) break;
          }
        }, 1000);
      } else if (bookingList.length === 0) {
        setLoading(false);
      }
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
      setRoomList([]);
    };
  }, [bookingList, fetching]);

  useEffect(() => {
    if (room.id) {
      setRoomList((prevState) => [...prevState, room]);
      if (roomList.length === bookingList.length) return;
    }
  }, [room]);

  useEffect(() => {
    if (
      bookingList.length === roomList.length &&
      bookingList.length > 0 &&
      roomList.length > 0 &&
      !fetching
    ) {
      setLoading(false);
    }
  }, [bookingList.length, roomList.length]);

  useEffect(() => {
    return () => {
      dispatch(setFetching(true));
    };
  }, []);

  const render = useCallback(() => {
    if (
      bookingList.length > 0 &&
      roomList.length === bookingList.length &&
      !loading
    ) {
      return bookingList.map((booking, index) => {
        const room = roomList.find((room) => room.id === booking.maPhong);
        if (room) {
          return (
            <div key={booking.id} className="booking-item my-3">
              <BookedRoomItem room={room} booking={booking} />
            </div>
          );
        }
      });
    }
    if (bookingList.length === 0 && !loading) {
      return "Lịch sử đặt phòng trống!";
    }
  }, [bookingList, roomList, loading]);

  return <>{loading ? <LoadingHorizontal /> : render()}</>;
}
