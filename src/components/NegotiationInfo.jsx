import React, { useState, useEffect } from "react";
import { UserAuth } from "../context/AuthContext";
import { axiosInstance } from "../axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Modal, Form, Button } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { FiArrowLeft } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { Badge } from "reactstrap";

const NegotiationInfo = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    criteriaMode: "all",
  });

  const handleClose = () => {
    setShow(false);
    navigate("/list");
  };
  const handleShow = () => {
    setShowConfirmation(false);
    try {
      updateNegotiation(idNegosiasi.idnego, 2);
    } catch (err) {
      console.log(err);
    }
    setShow(true);
  };

  const handleCloseConfirmation = () => setShowConfirmation(false);
  let handleShowConfirmation;

  const handleCloseRejection = () => setShowRejectedConfirmation(false);
  let handleRejectedConfirmation;

  const handleCloseProductStatus = () => setShowProductStatus(false);
  let handleStatus;

  const handleSoldProduct = () => {
    try {
      if (negotiationStatus === "approved") {
        UpdateProductStatus(product.id);
        window.alert("Status Produk Berhasil Diperbarui");
        navigate("/");
      } else {
        updateNegotiation(idNegosiasi.idnego, 3);
        window.alert("Status Produk Berhasil Diperbarui");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejection = () => {
    try {
      updateNegotiation(idNegosiasi.idnego, 3);
      window.alert(`Penawaran ${idNegosiasi.name} Berhasil Ditolak`);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const { id } = useParams();
  const { updateNegotiation, UpdateProductStatus, getUserDatabase, getToken } =
    UserAuth();
  const [show, setShow] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showRejectedConfirmation, setShowRejectedConfirmation] =
    useState(false);
  const [showProductStatus, setShowProductStatus] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [negotiator, setNegotiator] = useState([]);
  const [product, setProduct] = useState([]);
  const [idNegosiasi, setIdNegosiasi] = useState({});
  const [negotiationStatus, setNegotationStatus] = useState();

  useEffect(() => {
    if (!loaded) {
      const loadData = async () => {
        const negotiatedProduct = (await axiosInstance.get(`product/${id}`))
          .data;

        if (!negotiatedProduct) {
          navigate("/");
          window.alert("Penawaran Tidak Ditemukan");
        } else {
          const negotiationData = (
            await axiosInstance.get(`negotiation`, {
              headers: {
                productid: id,
              },
            })
          ).data;

          if (negotiationData.length > 0) {
            if (getUserDatabase().uid === negotiationData[0].seller_uid) {
              setProduct(negotiatedProduct);
              for (let i = 0; i < negotiationData.length; i++) {
                const negotiatorData = (
                  await axiosInstance.get(`profile`, {
                    headers: {
                      product: negotiationData[i].buyer_uid,
                      authorization: getToken(),
                    },
                  })
                ).data;
                negotiatorData.price = negotiationData[i].price;
                negotiatorData.idnego = negotiationData[i].id;
                negotiatorData.isApproved = negotiationData[i].isApproved;
                setNegotiator((current) => [negotiatorData, ...current]);
              }
            } else {
              navigate("/");
              window.alert("You Are Not Supposed To Be Here");
            }
          } else {
            navigate("/");
            window.alert("You Are Not Supposed To Be Here");
          }
        }
      };
      loadData().then(() => {
        setLoaded(true);
      });
    }
  }, [loaded]);

  return (
    <>
      {!loaded ? (
        <Backdrop
          sx={{
            backgroundColor: "#FFFFFF",
            color: "#7126b5",
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={!loaded}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <CircularProgress color="inherit" sx={{ margin: "auto", mb: 1 }} />
            <Typography variant="h5">Loading</Typography>
          </Box>
        </Backdrop>
      ) : (
        <>
          <div className="row justify-content-center g-0 pt-4">
            <div className="col-md-1 col-xs-1">
              <Link to="/list">
                <FiArrowLeft
                  className="me-2"
                  style={{ fontSize: "25px", color: "black" }}
                />
              </Link>
            </div>
            <div div className="col-md-4 col-xs-12">
              <p className="h6 fw-bold pb-2">Detail Produk</p>
              <div className="card mb-3 border-0 inputBasic">
                <div class="row no-gutters align-items-center">
                  <div className="col-3">
                    <img
                      src={
                        product.images && product.images.length > 0
                          ? product.images[0]
                          : "/img/img1.png"
                      }
                      alt="Foto Barang Yang Ditawar"
                      className="card-img border-0 inputBasic img-user"
                    ></img>
                  </div>
                  <div className="col-8 ">
                    <div className="card-body">
                      <p className="card-text h6">{product.name}</p>
                      <p className="m-0">Rp {product.price},00</p>
                    </div>
                  </div>
                </div>
                <div className="row">
                  {!product.isAvailable && (
                    <strong>
                      <Badge className="w-100 soldout pb-0">
                        <h6>Sudah Terjual</h6>
                      </Badge>
                    </strong>
                  )}
                </div>
              </div>
              <div>
              <p className="h6 fw-bold pb-2 pt-2">Daftar Penawar</p>
              {Object.entries(negotiator).map(([key, item]) => (
                <div className="card mb-3 inputBasic p-3">
                  <div class="row align-items-start">
                    <div className="col-3">
                      <img
                        src={item.image}
                        alt="Foto Penawar"
                        className="img-produk3 border-0 inputBasic"
                      ></img>
                    </div>
                    <div className="col-9">
                      <div className="card-body p-0">
                        <div className="row">
                          <div className="col auto small">
                            <p className="text-muted pb-2 m-0">
                              Penawaran produk
                            </p>
                          </div>
                          <div className="col auto text-end">
                            <p className="text-muted m-0">
                              <small>22 March</small>
                            </p>
                          </div>
                        </div>
                        <p className="h6 m-0">{item.name}</p>
                        <p className="h6 text-muted">
                          <small>{item.city}</small>
                        </p>
                        <p className="h6">Di tawar Rp {item.price},00</p>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-4"></div>
                    {product.isAvailable && (
                      <div className="col-8">
                        {item.isApproved === 2 ? (
                          <div
                            className="d-flex mb-2"
                            style={{ width: "100%", gap: "1rem" }}
                          >
                            <Button
                              type="submit"
                              className="btn-sign-google text-center"
                              style={{ width: "50%", borderColor: "#7126b5" }}
                              onClick={
                                (handleStatus = () => {
                                  setIdNegosiasi(item);
                                  setShowProductStatus(true);
                                })
                              }
                              size="sm"
                            >
                              Status
                            </Button>
                            &nbsp;
                            <Button
                              type="submit"
                              className="btn-sign text-center"
                              style={{ width: "50%" }}
                              size="sm"
                              href={`https://wa.me/${item.phone}`}
                              target="_blank"
                            >
                              Hubungi di
                              <FaWhatsapp style={{ marginLeft: "0.5rem" }} />
                            </Button>
                          </div>
                        ) : (
                          <div>
                            {item.isApproved === 3 ? (
                              <strong>
                                <Badge className="w-100 rejected pb-0">
                                  <h6>Ditolak</h6>
                                </Badge>
                              </strong>
                            ) : (
                              <div
                                className="d-flex mb-2"
                                style={{ width: "100%" }}
                              >
                                <Button
                                  type="submit"
                                  className="btn-sign-google text-center"
                                  style={{
                                    width: "50%",
                                    borderColor: "#7126b5",
                                  }}
                                  size="sm"
                                  onClick={
                                    (handleRejectedConfirmation = () => {
                                      setIdNegosiasi(item);
                                      setShowRejectedConfirmation(true);
                                    })
                                  }
                                >
                                  Tolak
                                </Button>
                                &nbsp;
                                <Button
                                  type="submit"
                                  className="btn-sign text-center"
                                  style={{ width: "50%" }}
                                  size="sm"
                                  onClick={
                                    (handleShowConfirmation = () => {
                                      setIdNegosiasi(item);
                                      setShowConfirmation(true);
                                    })
                                  }
                                >
                                  Terima
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            </div>
            
            <div className="col-md-1 col-xs-1 me-2"></div>
          </div>

          <Modal show={showConfirmation} centered>
            <Modal.Body>
              <div className="card-body">
                <h6 className="card-title ">PERINGATAN</h6>
                <p className="text-muted">
                  Apakah Anda Yakin Ingin Menerima Penawaran Ini?
                </p>
                <div className="button-container d-flex justify-content-end">
                  <button
                    onClick={handleCloseConfirmation}
                    className="btn-sign-google text-center"
                    style={{ width: "100px" }}
                  >
                    Batal
                  </button>
                  &nbsp;
                  <button
                    className="btn-sign text-center nextButton"
                    onClick={handleShow}
                    style={{ color: "white", width: "100px" }}
                  >
                    Terima
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <Modal show={showRejectedConfirmation} onHide={handleClose} centered>
            <Modal.Body>
              <div className="card-body">
                <h6 className="card-title ">PERINGATAN</h6>
                <p className="text-muted">
                  Apakah Anda Yakin Ingin Menolak Penawaran Ini?
                </p>
                <div className="button-container d-flex justify-content-end">
                  <button
                    onClick={handleCloseRejection}
                    className="btn-sign-google text-center"
                    style={{ width: "100px" }}
                  >
                    Batal
                  </button>
                  &nbsp;
                  <button
                    className="btn-sign text-center nextButton"
                    onClick={handleRejection}
                    style={{ color: "white", width: "100px" }}
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
          <Modal
            show={showProductStatus}
            onHide={handleCloseProductStatus}
            centered
          >
            <Modal.Header closeButton className="border-0"></Modal.Header>
            <Modal.Body>
              <div className="card-body">
                <h6 className="card-title ">
                  Perbarui Status Penjualan Produkmu
                </h6>
                <Form style={{ paddingTop: "1rem" }}>
                  {["radio"].map((type) => (
                    <div key={`reverse-${type}`} className="mb-3">
                      <div className="row">
                        <div className="col-1">
                          <Form.Check
                            reverse
                            {...register("statusNego", {
                              required: "Tolong Pilih Status",
                            })}
                            value="approved"
                            name="flexRadioDefault"
                            onChange={(e) =>
                              setNegotationStatus(e.target.value)
                            }
                            // id="flexRadioDefault1"
                            type={type}
                            id={`reverse-${type}-1`}
                            inline
                          />
                        </div>
                        <div className="col-11">
                          <p className="h6">Berhasil terjual</p>
                          <p className="text-muted ">
                            Kamu telah sepakat menjual produk ini kepada pembeli
                          </p>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-1">
                          <Form.Check
                            reverse
                            {...register("statusNego", {
                              required: "Tolong Pilih Status",
                            })}
                            type={type}
                            value="rejected"
                            name="flexRadioDefault"
                            onChange={(e) =>
                              setNegotationStatus(e.target.value)
                            }
                            id={`reverse-${type}-2`}
                            // id="flexRadioDefault2"
                            inline
                          />
                        </div>
                        <div className="col-11">
                          <p className="h6">Batalkan transaksi</p>
                          <p className="text-muted ">
                            Kamu membatalkan transaksi produk ini dengan pembeli
                          </p>
                        </div>
                      </div>
                      <ErrorMessage
                        errors={errors}
                        name="statusNego"
                        render={({ messages }) =>
                          messages &&
                          Object.entries(messages).map(([type, message]) => (
                            <p className="red" key={type}>
                              {message}
                            </p>
                          ))
                        }
                      />
                    </div>
                  ))}
                </Form>
                <Button
                  type="submit"
                  className="btn-sign text-center w-100"
                  onClick={handleSubmit(handleSoldProduct)}
                  disabled={isSubmitting}
                >
                  Kirim
                </Button>
              </div>
            </Modal.Body>
          </Modal>
          <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton className="border-0"></Modal.Header>
            <Modal.Body>
              <div className="card-body">
                <h6 className="card-title ">
                  Yeay kamu berhasil mendapatkan harga yang sesuai
                </h6>
                <p className="text-muted">
                  Segera hubungi pembeli melalui whatsapp untuk transaksi
                  selanjutnya
                </p>
                <div className="card mb-3 inputBasic bg-light border-0">
                  <div class="row no-gutters align-items-center ">
                    <h5
                      className="card-title text-center"
                      style={{ marginTop: "0.5rem" }}
                    >
                      Product Match
                    </h5>
                    <div className="row">
                      <div className="col-4">
                        <div className="card-body">
                          <img
                            src={idNegosiasi.image}
                            alt="Foto Penawar"
                            className="card-img border-0 inputBasic img-produk2 "
                          ></img>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="card-body">
                          <p className="card-text p-0 m-0">
                            {idNegosiasi.name}
                          </p>
                          <p className="card-text p-0 m-0 text-muted">
                            {idNegosiasi.city}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-4">
                        <div className="card-body">
                          <img
                            src={
                              product.images && product.images.length > 0
                                ? product.images[0]
                                : "/img/img1.png"
                            }
                            alt="Foto Barang Yang Ditawar"
                            className="card-img border-0 inputBasic img-produk2 "
                          ></img>
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="card-body">
                          <p className="card-text p-0 m-0">{product.name}</p>
                          <p className="card-text p-0 m-0">
                            <del>Rp {product.price},00</del>
                          </p>
                          <p className="card-text p-0 m-0">
                            Ditawar Rp {idNegosiasi.price},00
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="btn-sign text-center w-100"
                  href={`https://wa.me/${idNegosiasi.phone}`}
                  target="_blank"
                >
                  Hubungi via Whatsapp
                  <FaWhatsapp style={{ marginLeft: "2rem" }} />
                </Button>
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </>
  );
};

export default NegotiationInfo;
