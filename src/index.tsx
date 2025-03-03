import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/scss/style.scss";
import { Provider } from "react-redux";
import { store } from "./redux/configStore";
import { createBrowserHistory } from "history";
import {
  unstable_HistoryRouter as HistoryRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomeTemplate from "./templates/HomeTemplate";
import Loading from "./components/Loading/Loading";
import AdminTemplate from "./templates/AdminTemplate";
import UserManagement from "./pages/Admin/User/UserManagement";
import LocationManagement from "./pages/Admin/Location/LocationManagement";
import RoomManagement from "./pages/Admin/Room/RoomManagement";
import AddLocation from "./components/Admin/Location/AddLocation";
import HomeAdmin from "./pages/Admin/HomeAdmin/HomeAdmin";
import ModalHOC from "./HOC/ModalHoc";

const Home = React.lazy(() => import("./pages/Home/Home"));
const SignIn = React.lazy(() => import("./pages/SignIn/SignIn"));
const SignUp = React.lazy(() => import("./pages/SignUp/SignUp"));
const Profile = React.lazy(() => import("./pages/Profile/Profile"));
const RoomList = React.lazy(() => import("./pages/RoomList/RoomList"));
const RoomTemplate = React.lazy(() => import("./templates/RoomTemplate"));
const Search = React.lazy(() => import("./pages/Search/Search"));

export const history = createBrowserHistory({ window });

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <HistoryRouter history={history as any}>
      <ModalHOC />
      <Routes>
        {/* home template */}
        <Route path="" element={<HomeTemplate />}>
          <Route
            index
            element={
              <React.Suspense fallback={<Loading />}>
                <Home />
              </React.Suspense>
            }
          ></Route>
          <Route
            path="search"
            element={
              <React.Suspense fallback={<Loading />}>
                <Search />
              </React.Suspense>
            }
          ></Route>
          <Route
            path="signin"
            element={
              <React.Suspense fallback={<Loading />}>
                <SignIn />
              </React.Suspense>
            }
          ></Route>
          <Route
            path="signup"
            element={
              <React.Suspense fallback={<Loading />}>
                <SignUp />
              </React.Suspense>
            }
          ></Route>
          <Route path="profile">
            <Route
              path=":userid"
              element={
                <React.Suspense fallback={<Loading />}>
                  <Profile />
                </React.Suspense>
              }
            ></Route>
          </Route>
          <Route path="roomlist">
            <Route
              path=":locationid"
              element={
                <React.Suspense fallback={<Loading />}>
                  <RoomList />
                </React.Suspense>
              }
            ></Route>
          </Route>
        </Route>
        {/* home template */}

        {/* room template */}
        <Route path="roomdetail">
          <Route
            path=":roomId"
            element={
              <React.Suspense fallback={<Loading />}>
                <RoomTemplate />
              </React.Suspense>
            }
          ></Route>
        </Route>
        {/* room template */}

        {/* admin template */}
        <Route>
          <Route path="admin" element={<AdminTemplate />}>
            <Route index element={<HomeAdmin />}></Route>
            <Route path="users" element={<UserManagement />}></Route>
            <Route path="locations" element={<LocationManagement />}></Route>
            <Route path="rooms" element={<RoomManagement />}></Route>
          </Route>
        </Route>
        {/* admin template */}
        <Route
          path="addLocation"
          element={
            <React.Suspense fallback={<Loading />}>
              <AddLocation />
            </React.Suspense>
          }
        ></Route>

        <Route path="*" element={<Navigate to="" />}></Route>
      </Routes>
    </HistoryRouter>
  </Provider>
);
