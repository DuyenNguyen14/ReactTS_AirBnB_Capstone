import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { clearLocalStorage, getStoreJSON, setStoreJSON } from "../util/setting";

/*
    Usage:
        + Khi component vừa mới mount --> lưu path của page vào localstorage, tên là currLocation
        + Khi component will unmount --> đổi currLocation thành prevLocation đồng thời xoá prevLocation của page được truy cập trước đó

        + Dùng hook này khi user chưa login và đang thực hiện thao tác dở dang ở 1 page nào đó thì khi điều hướng user tới trang login, sau khi user login thành công có thể điều hướng trở lại trang trước đó
*/
export default function useLocationPathname() {
  const location = useLocation();

  useEffect(() => {
    setStoreJSON("currLocation", location.pathname);
    return () => {
      const prevLocation = getStoreJSON("prevLocation");
      const currLocation = getStoreJSON("currLocation");
      if (currLocation === "/signup") {
        console.log(currLocation);
      }
      if (
        prevLocation !== location.pathname &&
        currLocation !== "/signin" &&
        currLocation !== "/signup"
      ) {
        clearLocalStorage("currLocation");
        setStoreJSON("prevLocation", location.pathname);
      }
    };
  }, [location.pathname]);

  return location;
}
