import React from "react";

import {
  Badge,
  CardBody,
  CardGroup,
  CardImg,
  CardSubtitle,
  CardTitle,
} from "reactstrap";

const Card = ({ title, available, subtitle, text, imageUrl }) => {
  return (
    <>
      <CardGroup className="inputBasic2 card-product1 shadow-sm">
        <CardImg src={imageUrl} className="border-0 w-100 inputBasic img-produk1 p-2"/>
        <CardBody>
          <CardTitle className="textCard fit-text">{title}</CardTitle>
          <CardSubtitle className="textCard mb-2 text-muted">
            <small>{subtitle}</small>
          </CardSubtitle>
          <h6 className="textCard">{text}</h6>
          <Badge className="w-100 soldout">{available}</Badge>
        </CardBody>
      </CardGroup>
    </>
  );
};

export default Card;
