import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { UserAuth } from "../context/AuthContext";
import {
  Navbar,
  NavbarBrand,
  Collapse,
  Nav,
  FormGroup,
  Input,
} from "reactstrap";
import Badge from "@mui/material/Badge";
import { FiBell, FiList, FiLogOut, FiUser } from "react-icons/fi";
import { productSearch, productSlice } from "../slices/ProductSlice";
import store from "../store/store";
import { fetchNotification, unreadNotificationSelector, updateNotification } from "../slices/notificationSlice";
import { useSelector, useDispatch } from "react-redux";
import { Dropdown } from "react-bootstrap";
import TemporaryDrawer from "./Sidebar";


const NotificationItem  = ({ notification }) => {
  const dispatch = useDispatch();

  const handleUpdate = () => {
    try {
      dispatch(updateNotification({
        id: notification.id,
        "readStatus": true,
      }))
  
    } catch (err) {
      console.error(err);
    }
  };  

  console.log("nego",notification.negotiatePrice)
  if(!notification.negotiatePrice){
    return  (
      <Dropdown.Item
        href="#"
        className="card pt-2 m-2 inputBasic border-0"
        style={{ width: "400px" }}
        onClick={handleUpdate}
      >
        <div className="row align-items-start">
          <div className="col-3">
            <img
              src={notification.imgurl}
              className="img-produk3 border-0 inputBasic"
              alt=""
            ></img>
          </div>
          <div className="col-9">
            <div className="card-body p-0">
              <div className="row">
                <div className="col auto small">
                  <p className="text-muted  m-0">
                    <small>Berhasil diterbitkan</small>
                  </p>
                </div>
                <div className="col auto text-end small">
                  <p className="text-muted m-0">
                    <small>{notification.date}</small>
                  </p>
                </div>
              </div>
              <p className="h6 m-0">{notification.productName}</p>
              <p className="h6">Rp {notification.productPrice}</p>
            </div>
          </div>
        </div>
      </Dropdown.Item>
    ) 
  }else {
    return  (
      <Dropdown.Item
        href="#"
        className="card pt-2 m-2 inputBasic border-0"
        style={{ width: "400px" }}
        onClick={handleUpdate}
      >
        <div className="row align-items-start">
          <div className="col-3">
            <img
              src={notification.imgurl}
              className="img-produk3 border-0 inputBasic"
              alt=""
            ></img>
          </div>
          <div className="col-9">
            <div className="card-body p-0">
              <div className="row">
                <div className="col auto small">
                  <p className="text-muted  m-0">
                    <small>Penawaran produk</small>
                  </p>
                </div>
                <div className="col auto text-end small">
                  <p className="text-muted m-0">
                    <small>{notification.date}</small>
                  </p>
                </div>
              </div>
              <p className="h6 m-0">{notification.productName}</p>
              <p className="h6">Rp {notification.productPrice}</p>
              <p className="h6">Ditawar Rp {notification.negotiatePrice}</p>
            </div>
          </div>
        </div>
      </Dropdown.Item>
    ) 
  }
}

const NavbarMenu = () => {
  const dispatch = useDispatch();
  const { logout, getToken } = UserAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (e) {
      console.log(e.message);
    }
  };

  const changeSearchTerm = async (e) => {
    dispatch(productSlice.actions.setSearchTerm(e.target.value));
    setLocalSearchTerm(e.target.value);
  };
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const { searchTerm } = store.getState().product;
  useEffect(() => {
    setLocalSearchTerm(searchTerm);
    dispatch(productSearch());
  }, [searchTerm]);

  
  const [ loadedNotifications, setLoadedNotification ] = useState(false)
  useEffect(() => {
    async function load() {
      dispatch(fetchNotification());
    }
    if (loadedNotifications === false) {
      load()
      setLoadedNotification(true)
    }
  });

  const unreadNotifications = useSelector(unreadNotificationSelector, (a,b) => a.length === b.length) 

  return (
    <header>
      <div>
        <Navbar color="" expand="md" light container header className="barnav">
          <Link to="/" className="logo">
            <NavbarBrand>
              <img
                src="../../img/logo.svg"
                style={{ width: "100px" }}
                className="icon"
                alt=""
              />
            </NavbarBrand>
          </Link>

          <TemporaryDrawer/>

          <p style={{ marginLeft: "28rem" }} className="lengkapi">
            Lengkapi Info Akun
          </p>

          <p style={{ marginLeft: "28rem" }} className="tambahkan">
            Tambahkan Produk
          </p>

          <p style={{ marginLeft: "28rem" }} className="update">
            Edit Product
          </p>

          <p style={{ marginLeft: "28rem" }} className="infoPenawar">
            Info Penawar
          </p>


          {/* search bar here */}
          <FormGroup className="grupform">
            <Input
              id="exampleSearch"
              name="search"
              placeholder="Cari di sini ..."
              type="search"
              className="search"
              style={{ marginTop: "15px" }}
              value={localSearchTerm}
              onChange={changeSearchTerm}
            />
          </FormGroup>
          <Collapse navbar className="collapse">
            {getToken() ? (
              <Nav className="ms-auto collapse1" navbar-nav>
                <ul className="navbar-nav ms-auto collapse2">
                  <li className="nav-item">
                    <Link to="/list">
                      <button type="button" className="btn btn-nav">
                        <FiList style={{ fontSize: "25px" }} />
                      </button>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto collapse2">
                  <li className="nav-item">
                    <Link to="">
                      <Dropdown autoClose="inside">
                        <Dropdown.Toggle
                          // drop="start"
                          className="btn notification btn-clear btn-nav"
                        >
                         {
                          unreadNotifications.length >= 0 &&
                          <Badge badgeContent={unreadNotifications.length} color="error">
                            <FiBell style={{ fontSize: "25px" }} />
                          </Badge>
                        }
                        </Dropdown.Toggle>
                        <Dropdown.Menu className="inputBasic dropdown-menu-right p-0 m-0 g-0">
                          {
                            unreadNotifications.map((notification, index) => (
                             
                                <NotificationItem notification={notification} key={index}/>
                             
                            ))
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto collapse2">
                  <li className="nav-item">
                    <Link to="/profile">
                      <button type="button" className="btn btn-nav">
                        <FiUser style={{ fontSize: "25px" }} />
                      </button>
                    </Link>
                  </li>
                </ul>

                <ul className="navbar-nav ms-auto collapse2">
                  <li className="nav-item">
                    <Link to="/">
                      <button
                        type="button"
                        className="btn btn-nav"
                        onClick={handleLogout}
                      >
                        <FiLogOut style={{ fontSize: "25px" }} />
                      </button>
                    </Link>
                  </li>
                </ul>
              </Nav>
            ) : (
              <Nav className="ms-auto collapse1" navbar-nav>
                <ul className="navbar-nav ms-auto collapse2">
                  <li className="nav-item">
                    <Link to="/login">
                      <button type="button" className="btn tombol masuk">
                        <img src="img/masuk.png" className="me-2" alt="" />
                        Masuk
                      </button>
                    </Link>
                  </li>
                </ul>
              </Nav>
            )}
          </Collapse>
        </Navbar>
      </div>
    </header>
  );
};

export default NavbarMenu;
