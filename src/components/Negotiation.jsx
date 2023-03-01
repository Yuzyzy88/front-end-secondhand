import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { axiosInstance } from "../axios";
import Card from "./Card";
import { Link } from "react-router-dom";
import { LinearProgress } from "@mui/material";
import Box from "@mui/material/Box";

const Negotiation = () => {
  const { getUserDatabase } = UserAuth();
  const [loaded, setLoaded] = useState(false);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loaded) {
      const loadData = async () => {
        let productArray = [];
        let reducedProductArray = [];
        const data = (
          await axiosInstance.get(`negotiation`, {
            headers: {
              uid: getUserDatabase().uid,
            },
          })
        ).data;

        for (let i = 0; i < data.length; i++) {
          productArray.push(parseInt(data[i].product_id));
          reducedProductArray = [...new Set(productArray)];
        }

        for (let i = 0; i < reducedProductArray.length; i++) {
          const _products = (
            await axiosInstance.get(`product/${reducedProductArray[i]}`)
          ).data;
          setProducts((current) => [_products, ...current]);
        }
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
          <div>
            {products.length === 0 ? (
              <div className="emptyProduct">
                <img src="../../img/diminati.png" alt="" srcset="" />
                <p style={{padding: "15px"}}>Daftar Barangmu Yang Diminati Orang</p>
              </div>
            ) : (
              <div className="row">
                {Object.entries(products).map(([key, product]) => (
                  <div className="col-md-4 col-6 col-lg-4 mb-3" key={key}>
                    <div className="card">
                      <Link to={`/penawar/${product.id}`}>
                        <Card
                          title={product.name}
                          subtitle={product.category}
                          text={!product.isAvailable && "Sudah Terjual"}
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
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Negotiation;
