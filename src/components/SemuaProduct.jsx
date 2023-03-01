import React, { useEffect, useState } from "react";
import Card from "./Card";
import { Link } from "react-router-dom";
import { axiosInstance } from "../axios";
import { UserAuth } from "../context/AuthContext";
import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";

const SemuaProduct = () => {
  const { getUserDatabase } = UserAuth();
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loaded) {
      const loadData = async () => {
        const userUUID = getUserDatabase().uid;
        const _products = (
          await axiosInstance.get(`product/byProfile/${userUUID}`)
        ).data;
        setProducts(_products);
      };
      loadData().then(() => {
        setLoaded(true);
      });
    }
  }, [loaded]);

  return (
    <>
      <div className="col">
        {!loaded ? (
          <Box sx={{ width: "100%", color: "#7126b5" }}>
            <LinearProgress color="inherit" />
          </Box>
        ) : (
          <div className="row">
            {products.map((product, key) => (
              <div className="col-md-4 col-6 col-lg-4 mb-3" key={key}>
                <div className="card">
                  <Link to={`/product/${product.id}`}>
                    <Card
                      title={product.name}
                      subtitle={product.category}
                      text={product.price}
                      imageUrl={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "/img/img1.png"
                      }
                    ></Card>
                  </Link>
                </div>
              </div>
            ))}
            <div className="col-md-4 col-6 col-lg-4 mb-3 addproduct">
              <Link to="/sell">
                <img src="/img/tambahproduk.png" alt="" srcset="" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SemuaProduct;
