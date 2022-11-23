import { ChangeEvent, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  NavLink,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { AppDispatch } from "../../redux/configStore";
import Button from "../Button/Button";
import Dropdown from "./Dropdown";

const logo = require("../../assets/img/airbnb-logo.png");

let timeout: ReturnType<typeof setTimeout>;

type Props = {};

export default function Header({}: Props) {
  const [searchParams, setSearchParams] = useSearchParams();
  let keyword = searchParams.get("keyword");

  const navigate = useNavigate();

  const location = useLocation();

  const dispatch: AppDispatch = useDispatch();

  const [isClicked, setIsClicked] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setSearchParams({ keyword: value });
  };

  const handleSearch = () => {
    navigate(`/search?keyword=${keyword}`);
  };

  useEffect(() => {
    timeout = setTimeout(() => {
      if (keyword) {
        navigate(`/search?keyword=${keyword}`);
      }
    }, 1000);
    return () => timeout && clearTimeout(timeout);
  }, [keyword]);

  useEffect(() => {
    if (!location.pathname.includes("/search")) {
      const searchInp = document.getElementById("search") as HTMLInputElement;
      searchInp.value = "";
    }
  }, [location.pathname]);

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
              id="search"
            />
            <button
              className="btn--primary btnSearch"
              type="button"
              onClick={handleSearch}
            >
              <i className="fas fa-search"></i>
            </button>
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
