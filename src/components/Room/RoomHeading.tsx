import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { AppDispatch, RootState } from "../../redux/configStore";
import { getLocationByIdApi } from "../../redux/reducers/locationsReducer";
import Comment from "./Comment/Comment";

type Props = {
  maViTri: number;
};

export default function RoomHeading({ maViTri }: Props) {
  const { tinhThanh, tenViTri } = useSelector(
    (state: RootState) => state.locationsReducer.location
  );

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    maViTri && dispatch(getLocationByIdApi(maViTri));
  }, [maViTri]);

  return (
    <div className="room__heading">
      <h1 className="room-title">{tenViTri}</h1>
      <div className="room__heading--details d-flex">
        <div className="ratings">
          <i className="fa fa-star me-2"></i>
          <span>5.0</span>
        </div>
        <div className="dot">
          <i className="fas fa-circle"></i>
        </div>
        <NavLink
          to=""
          className="reviews"
          data-bs-toggle="modal"
          data-bs-target="#comment"
        >
          <u>7 reviews</u>
        </NavLink>
        <div className="dot">
          <i className="fas fa-circle"></i>
        </div>
        <div className="host-badge">
          <i className="fas fa-user-shield me-2"></i>
          <span>Superhost</span>
        </div>
        <div className="dot">
          <i className="fas fa-circle"></i>
        </div>
        <NavLink to="" className="cityName">
          <u>{tinhThanh}</u>
        </NavLink>
      </div>
    </div>
  );
}
