import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { User } from "../../redux/reducers/userReducer";
import {
  ACCESS_TOKEN,
  clearLocalStorage,
  getStoreJSON,
  USER_LOGIN,
} from "../../util/setting";

type Props = {};

export default function Dropdown({}: Props) {
  const userLogin = getStoreJSON(USER_LOGIN);

  const handleLogout = () => {
    clearLocalStorage(USER_LOGIN);
    clearLocalStorage(ACCESS_TOKEN);
  };

  const renderDropdown = () => {
    if (userLogin) {
      return (
        <>
          <li>
            <NavLink to="/profile" className="dropdown__item">
              Profile
            </NavLink>
          </li>
          <hr />
          {userLogin.role === "ADMIN" && (
            <li>
              <NavLink to="/admin" className="dropdown__item">
                Admin Management
              </NavLink>
            </li>
          )}
          <li>
            <a href="#" className="dropdown__item">
              Host your home
            </a>
          </li>
          <li>
            <a href="#" className="dropdown__item">
              Host an experience
            </a>
          </li>
          <li>
            <a href="#" className="dropdown__item">
              Help
            </a>
          </li>
          <hr />
          <li onClick={handleLogout}>
            <NavLink to="/" className="dropdown__item">
              Logout
            </NavLink>
          </li>
        </>
      );
    } else {
      return (
        <>
          <li>
            <NavLink to="/signin" className="dropdown__item">
              Sign in
            </NavLink>
          </li>
          <li>
            <NavLink to="/signup" className="dropdown__item">
              Sign up
            </NavLink>
          </li>
          <hr />
          <li>
            <a href="#" className="dropdown__item">
              Host your home
            </a>
          </li>
          <li>
            <a href="#" className="dropdown__item">
              Host an experience
            </a>
          </li>
          <li>
            <a href="#" className="dropdown__item">
              Help
            </a>
          </li>
        </>
      );
    }
  };
  return <>{renderDropdown()}</>;
}
