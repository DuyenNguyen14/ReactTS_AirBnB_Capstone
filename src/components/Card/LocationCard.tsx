import React, { useEffect, useRef, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { NavLink } from "react-router-dom";
import { useWindowWidth } from "../../Hooks/useWindowWidth";
import { Location } from "../../redux/reducers/locationsReducer";

type Props = {
  location: Location;
};

export default function LocationCard({ location }: Props) {
  const [isHover, setIsHover] = useState(false);

  return (
    <div className="card">
      <NavLink to={`/roomlist/${location.id}`}>
        <div className="card-img">
          <LazyLoadImage
            src={location.hinhAnh}
            alt={location.tenViTri}
            effect="blur"
          />
          <div
            className="card-img__icon"
            onMouseOver={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            {isHover ? (
              <i className="fa fa-heart"></i>
            ) : (
              <i className="far fa-heart"></i>
            )}
          </div>
        </div>
        <div className="card-info">
          <div className="card-title">
            <h4>{location.tenViTri}</h4>
          </div>
          <p>
            {location.tinhThanh} - {location.quocGia}
          </p>
        </div>
      </NavLink>
    </div>
  );
}
