import React from "react";
import { useNavigate } from "react-router-dom";
import { User } from "../../redux/reducers/userReducer";
import { getStoreJSON, USER_LOGIN, handleLogout } from "../../util/setting";

const airbnbIcon = require("../../assets/img/Airbnb-icon.png");

type Props = {};

export default function BottomNav({}: Props) {
  const navigate = useNavigate();

  const userLogin: User = getStoreJSON(USER_LOGIN);

  return (
    <div className="bottom-nav d-flex justify-content-around">
      <button className="btn btnHome" onClick={() => navigate("/")}>
        <img src={airbnbIcon} alt="Home" />
        <p>Home</p>
      </button>
      <button
        className="btn btnProfile"
        onClick={() => navigate(`/profile/${userLogin.id}`)}
      >
        <i className="fa fa-user"></i>
        <p>Profile</p>
      </button>
      <button className="btn btnAdmin" onClick={() => navigate("/admin")}>
        <i className="fas fa-user-cog"></i>
        <p>Admin</p>
      </button>
      <button className="btn btnLogout" onClick={handleLogout}>
        <i className="fas fa-sign-out-alt"></i>
        <p>Logout</p>
      </button>
    </div>
  );
}
