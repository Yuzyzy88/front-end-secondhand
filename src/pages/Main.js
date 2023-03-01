import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import Banner from "../components/Banner";
import Card from "../components/Card";
import Cater from "../components/Cater";
import NavbarMenu from "../components/Navbar";
import "../App.css";
import { axiosInstance } from '../axios';

import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from 'react-redux'
import { selectFilteredProducts } from "../slices/ProductSlice";
import { shallowEqual } from 'react-redux'

const Main = () => {
  const navigate = useNavigate();

  const clickSell = async () => {
    navigate("/sell");
  };

  const products = useSelector(selectFilteredProducts, (a, b) => a.length === b.length)

  return (
    <div>
      <NavbarMenu />
      <Banner />
      <Cater />
      <div className="container">
        <button type="button" className="btn tombol jual" style={{ zIndex: "1" }} onClick={clickSell}>
          <FiPlus style={{ fontSize: "20px", marginRight: "5px" }} />
          Jual
        </button>
      </div>
      <div className="container" style={{ marginTop: "1.5rem"}}>
        <div className="row">
          {
            products.map((product, key) => (
              <div className="col-md-3 col-lg-2 mb-3" key={key}>
                <div className="card">
                  <Link to={`/product/${product.id}`}>
                    <Card
                      title={product.name}
                      available={!product.isAvailable && "Sudah Terjual"}
                      subtitle={product.category}
                      text={"Rp " + product.price.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                      imageUrl={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "/img/jam1.png"
                      }
                    ></Card>
                  </Link>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};
export default Main;