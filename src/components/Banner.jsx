import React from "react";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

const Banner = () => {
  return (
    <div>
      <OwlCarousel items={2}  className="owl-theme" loop center margin={100}>
        <div className="item">
            <img src="img/banner.png" alt=""/>
        </div>
        <div className="item">
            <img src="img/banner.png" alt=""/>
        </div>
        <div className="item">
            <img src="img/banner.png" alt=""/>
        </div>
      </OwlCarousel>
    </div>
  );
};

export default Banner;
