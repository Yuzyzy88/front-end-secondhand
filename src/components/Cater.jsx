import React, { useState } from "react";

import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import { FiSearch } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { productSlice } from "../slices/ProductSlice";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const Cater = () => {
  const dispatch = useDispatch();
  const [selectedCategory, setSelectedCategory] = useState(() => [
    "selectedCategory",
  ]);

  const handleSelectedCategory = (event, newSelectedCategory) => {
    if (newSelectedCategory.length) {
      setSelectedCategory(newSelectedCategory);
    }
  };

  function toggleFilter(value) {
    dispatch(productSlice.actions.toggleFilter(value));
  }
  return (
    <div>
      <div className="container grid-service grid-service1">
        <div className="row">
          <div className="col-sm">
            <br />
            <p>
              <b>Telusuri Kategori</b>
            </p>
          </div>
        </div>
        <div className="over" style={{ display: "flex" }}>
          <ToggleButtonGroup value={selectedCategory} onChange={handleSelectedCategory}>
            <ToggleButton
              value="Hobi"
              className="btn-sign1 kategori"
              style={{ marginRight: "16px", minWidth: "fit-content" }}
              onClick={() => toggleFilter("Hobi")}
            >
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Hobi
            </ToggleButton>
            <ToggleButton
              value="Kendaraan"
              className="btn-sign1 kategori"
              style={{ marginRight: "16px", minWidth: "fit-content" }}
              onClick={() => toggleFilter("Kendaraan")}
            >
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Kendaraan
            </ToggleButton>
            <ToggleButton
              value="Baju"
              className="btn-sign1 kategori"
              style={{ marginRight: "16px", minWidth: "fit-content" }}
              onClick={() => toggleFilter("Baju")}
            >
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Baju
            </ToggleButton>
            <ToggleButton
              value="Elektronik"
              className="btn-sign1 kategori"
              style={{ marginRight: "16px", minWidth: "fit-content" }}
              onClick={() => toggleFilter("Elektronik")}
            >
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Elektronik
            </ToggleButton>
            <ToggleButton
              value="Kesehatan"
              className="btn-sign1 kategori"
              style={{ minWidth: "fit-content" }}
              onClick={() => toggleFilter("Kesehatan")}
            >
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Kesehatan
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </div>
  );
};

export default Cater;
