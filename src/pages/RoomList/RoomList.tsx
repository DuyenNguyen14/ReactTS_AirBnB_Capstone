import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import RoomCard from "../../components/Card/RoomCard";
import useLocationPathname from "../../Hooks/useLocationPathname";
import { AppDispatch, RootState } from "../../redux/configStore";
import { getLocationByIdApi } from "../../redux/reducers/locationsReducer";
import { getRoomsByLocationId } from "../../redux/reducers/roomReducer";

type Props = {};

export default function RoomList({}: Props) {
  const { arrRooms } = useSelector((state: RootState) => state.roomReducer);
  const { location } = useSelector(
    (state: RootState) => state.locationsReducer
  );

  const { locationid } = useParams();

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(getRoomsByLocationId(locationid));
    dispatch(getLocationByIdApi(locationid));
  }, [locationid]);

  useLocationPathname();

  return (
    <div className="container py-5">
      <strong>{arrRooms.length} nhà trong khu vực</strong>
      <div className="room-list row py-3">
        {arrRooms?.map((room) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3">
            <RoomCard room={room} location={location} />
          </div>
        ))}
      </div>
    </div>
  );
}
