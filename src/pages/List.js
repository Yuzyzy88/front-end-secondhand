import React, { useState } from "react";
import ButtonList from "../components/ButtonList";
import ListProduct from "../components/ListProduct";
import Negotiation from "../components/Negotiation";
import Purchased from "../components/Purchased";
import SemuaProduct from "../components/SemuaProduct";

const List = () => {
  const [list, setList] = useState("produk");
  // console.log(list === "product");
  return (
    <div>
      <ListProduct setList={setList} clicked={list} />
      <div className="container mt-4">
        <div className="row" style={{ gap:"3rem" }}>
        <div className="mt-3 d-flex">
          <ButtonList setList={setList} clicked={list} />
          {list === "produk" ? (
            <SemuaProduct />
          ) : list === "diminati" ? (
            <Negotiation />
          ) : list === "terjual" ? (
            <Purchased />
          ) : (
            <SemuaProduct />
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default List;
