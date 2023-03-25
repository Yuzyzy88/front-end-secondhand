import { UserAuth } from "../context/AuthContext";
import { CardImg } from "react-bootstrap";
import { FiSearch } from "react-icons/fi";
import { CardBody, CardSubtitle, CardTitle } from "reactstrap";
import { Link } from "react-router-dom";
import "../pages/ProductUpdate.scss";
import NavbarMenu from "./Navbar";
import { axiosInstance } from "../axios";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState } from "react";
import Form from 'react-bootstrap/Form';

const ListProduct = ({ setList }) => {
  const { getUserDatabase } = UserAuth();
  const downloadPDF = () => axiosInstance.get(`download`, {params: {month}}).then(res => {
    const filepath = res.data.filepath;
    setTimeout(() => {
      window.open(filepath, '_blank').focus();
    }, 1000);
    setShow(false);
  });

  const [month, setMonth] = useState("1");
  const onChange = (event) => {
    console.log(event);
    const value = event.target.value;
    setMonth(value)
  }

  const [show, setShow] = useState(false);

  const handleClose = () => { setShow(false) };
  const handleShow = () => { setShow(true) };

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
                  <button type="button" className="btn tombol1" onClick={handleShow}>
                    Report
                  </button>
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
              <div className="" onClick={() => setList("produk")}>
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

      <Modal show={show} onHide={handleClose}>
        <Modal.Dialog>
          <Modal.Header closeButton>
            <Modal.Title>Generate Report</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Select Month</p>
            <Form.Select aria-label="Default select example" onChange={onChange} value={month}>
              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </Form.Select>
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary">Close</Button>
            <Button onClick={downloadPDF} variant="primary">Generate</Button>
          </Modal.Footer>
        </Modal.Dialog>
      </Modal>
    </div>
  );
};

export default ListProduct;
