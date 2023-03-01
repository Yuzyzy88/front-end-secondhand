import { UserAuth } from "../context/AuthContext";
import { CardImg } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import "../pages/ProductUpdate.scss";
import NavbarMenu from "./Navbar";

const ListProduct = ({ setList }) => {
  const { getUserDatabase } = UserAuth();

  return (
    <div>
      <NavbarMenu />
      <div className="container mt-5">
        <div className="list-2">
          <h3 className="mb-4 list-21">Daftar Jual Saya</h3>

          {/* user card */}
          <div className="card" style={{ borderRadius: "16px" }}>
            <CardBody>
              <div className="col-12 p-2 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <CardImg
                    src={
                      getUserDatabase().image
                        ? getUserDatabase().image
                        : "https://icon-library.com/images/anonymous-person-icon/anonymous-person-icon-18.jpg"
                    }
                    className="img-user inputBasic"
                  />
                  <CardBody className="pt-0 pb-0 m-0">
                    <CardTitle tag="h5">{getUserDatabase().name}</CardTitle>
                    <CardSubtitle className="text-muted" tag="h6">
                      {getUserDatabase().city}
                    </CardSubtitle>
                  </CardBody>
                </div>
                <div style={{ padding: "0.3rem", marginTop: "1rem" }}>
                  <Link to="/profile">
                    <button type="button" className="btn tombol1 ">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </CardBody>
          </div>

          <div className="over list-3 mt-3">
            <button
              type="button"
              className="btn kategori"
              style={{ marginRight: "10px", minWidth: "fit-content" }}
            >
              <div className=""  onClick={() => setList("produk")}>
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Produk
              </div>
            </button>
            <button
              type="button"
              className="btn kategori"
              style={{ marginRight: "10px", minWidth: "fit-content" }}
            >
              <div className="" onClick={() => setList("diminati")}>
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Diminati
              </div>
            </button>
            <button
              type="button"
              className="btn kategori"
              style={{ marginRight: "10px", minWidth: "fit-content" }}
            >
              <div className="" onClick={() => setList("terjual")}>
              <FiSearch className="me-2" style={{ fontSize: "20px" }} />
              Terjual
              </div>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ListProduct;
