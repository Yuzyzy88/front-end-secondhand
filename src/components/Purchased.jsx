import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { axiosInstance } from "../axios";
import Card from "./Card";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";

const Purchased = () => {
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
    <div className="col">
      {!loaded ? (
        <Box sx={{ width: "100%", color: "#7126b5" }}>
          <LinearProgress color="inherit" />
        </Box>
      ) : (
        <div>
          {products.length === 0 ? (
            <div className="emptyProduct">
              <img src="../../img/terjual.png" alt="" srcset="" />
              <p style={{ padding: "15px" }}>
                Daftar Barangmu Yang Sudah Terjual
              </p>
            </div>
          ) : (
            <div className="row">
              {products.map((product, key) => (
                <div className="col-md-4 col-6 col-lg-4 mb-3">
                  {!product.isAvailable && (
                    <div className="card" key={key}>
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
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Purchased;
