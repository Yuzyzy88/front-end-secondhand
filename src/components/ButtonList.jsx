import React from "react";
import {
  FiBox,
  FiChevronRight,
  FiDollarSign,
  FiHeart,
} from "react-icons/fi";
import {
  Button,
  ButtonGroup,
  CardGroup,
  CardText,  
  Label,
} from "reactstrap";

const ButtonList = ({ setList }) => {
  return (
    <>
    
    <div className="col-3 pe-4 cardd-1">
      <div className="card" style={{ borderRadius: "16px" }}>
        <CardGroup>
          <ButtonGroup vertical className="w-100 ">
            <Label className="fw-bold pt-4 ps-4 pb-2 pe-2">Kategori</Label>
            <Button
              className="btn w-100 d-flex justify-content-between btn-all"
              onClick={() => setList("produk")}
            >
              <div className="d-flex justify-content-start">
                <FiBox className="me-2" style={{ fontSize: "24px" }} />
                <CardText className="text-start ">Semua Produk</CardText>
              </div>
              <div className="d-flex">
                <FiChevronRight style={{ fontSize: "24px" }} />
              </div>
            </Button>
            <Button
              type="button"
              className="btn w-100 d-flex justify-content-between btn-all"
              onClick={() => setList("diminati")}
            >
              <div className="d-flex">
                <FiHeart className="me-2" style={{ fontSize: "24px" }} />
                <CardText className="text-start">Diminati</CardText>
              </div>
              <FiChevronRight style={{ fontSize: "24px" }} />
            </Button>
            <Button
              type="button"
              className="btn w-100 d-flex justify-content-between btn-all"
              onClick={() => setList("terjual")}
            >
              <div className="d-flex">
                <FiDollarSign className="me-2 " style={{ fontSize: "24px" }} />
                <CardText className="text-start">Terjual</CardText>
              </div>
              <FiChevronRight style={{ fontSize: "24px" }} />
            </Button>
          </ButtonGroup>
        </CardGroup>
      </div>
    </div>
    </>
  );
};

export default ButtonList;
