import React, { useState } from "react";
import "antd/dist/antd.css";
import { UserOutlined, CompassOutlined, HomeOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu } from "antd";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { User } from "../redux/reducers/userReducer";
import { getStoreJSON, USER_LOGIN, handleLogout } from "../util/setting";

const logo = require("../assets/img/airbnb-logo(white).png");

const { Header, Content, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items = [
  getItem("Quản lý người dùng", "/admin/users", <UserOutlined />),
  getItem("Quản lý vị trí", "/admin/locations", <CompassOutlined />),
  getItem("Quản lý thông tin phòng", "/admin/rooms", <HomeOutlined />),
];

type Props = {};

export default function AdminTemplate({}: Props) {
  const [collapsed, setCollapsed] = useState(true);

  const userLogin: User = getStoreJSON(USER_LOGIN);

  const location = useLocation();

  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", position: "relative" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{ position: "absolute", minHeight: "100%", zIndex: "150" }}
      >
        <NavLink to="/" className="logo" style={{ height: "60px" }}>
          <img
            src={logo}
            alt="logo"
            style={{
              width: "100px",
              padding: "15px 0 15px 15px",
              cursor: "pointer",
            }}
          />
        </NavLink>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          onClick={({ key }) => {
            navigate(key);
            setCollapsed(true);
          }}
          selectedKeys={[location.pathname]}
        ></Menu>
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Menu
            mode="inline"
            theme="dark"
            className="d-flex justify-content-end"
          >
            <button
              className="btn admin-toggles"
              onClick={() => navigate("/admin")}
            >
              <img
                src={userLogin.avatar}
                alt={userLogin.name}
                style={{ width: "50px", height: "50px", borderRadius: "50%" }}
              />
            </button>
            <button className="btn text-light" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </Menu>
        </Header>
        <Content style={{ margin: "0 16px" }}>
          <div style={{ padding: "0 80px" }}>
            <div
              className="site-layout-background"
              style={{ padding: 24, minHeight: 360 }}
            >
              <Outlet />
            </div>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}
