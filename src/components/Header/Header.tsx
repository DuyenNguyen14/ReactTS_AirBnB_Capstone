import { useRef, useState } from "react";
import { NavLink, useSearchParams } from "react-router-dom";
import Button from "../Button/Button";
import Dropdown from "./Dropdown";

const logo = require("../../assets/img/airbnb-logo.png");
type Props = {};

export default function Header({}: Props) {
  const [isClicked, setIsClicked] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();

  const keywordRef = useRef<string>("");

  const handleChange = (e: { target: HTMLInputElement }) => {
    const { value, id } = e.target;
    keywordRef.current = value;
    setSearchParams({ maViTri: keywordRef.current });
  };

  const showDropdown = () => setIsClicked(!isClicked);

  return (
    <header className="header bg-white shadow-sm">
      <div className="container d-flex justify-content-between align-items-center">
        {/* left section - logo */}
        <div className="header__logo">
          <NavLink to="/">
            <img src={logo} alt="airbnb-logo" />
          </NavLink>
        </div>
        {/* right section - logo */}

        {/* middle section - search bar */}
        <div className="header__search-bar">
          <div className="search-bar d-flex align-items-center justify-content-between">
            <input
              type="text"
              placeholder="Start your search"
              onChange={handleChange}
              id="maViTri"
            />
            <Button
              path="#"
              className="btn--primary btnSearch"
              onClick={() => {}}
            >
              <i className="fas fa-search"></i>
            </Button>
          </div>
        </div>
        {/* middle section - search bar */}

        {/* right section */}
        <div className="header__right d-flex">
          <Button path="#" className="btn--light btnHost" onClick={() => {}}>
            Become a host
          </Button>
          <Button
            path="#"
            className="btn--light btnLanguage"
            onClick={() => {}}
          >
            <i className="fas fa-globe"></i>
          </Button>
          <div className="user">
            <Button
              path="#"
              className="btn--light btn-border-black btnUser"
              onClick={showDropdown}
            >
              <>
                <i className="fa fa-bars"></i>
                <i className="fa fa-user"></i>
                <div className="notification d-inline-block">1</div>
              </>
            </Button>
            <div
              id="user__dropdown"
              className={`dropdown__content ${
                isClicked ? "d-block" : "d-none"
              }`}
              onClick={showDropdown}
            >
              <ul onClick={() => setIsClicked(false)}>
                <Dropdown />
              </ul>
            </div>
          </div>
        </div>
        {/* right section */}
      </div>
    </header>
  );
}
