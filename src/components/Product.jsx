import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Carousel, Button, Modal, Form } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import { axiosInstance } from "../axios";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import NavbarMenu1 from "./Navbar1";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { createNotification } from "../slices/notificationSlice";

export default function InfoModal() {
  const deleteProduct = () => axiosInstance.delete(`product/${params.id}`);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const navigate = useNavigate();
  const params = useParams();
  const { getUserDatabase, createNegotiation, getToken } = UserAuth();

  const [show, setShow] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [productDetail, setProductDetail] = useState({});
  const [productImages, setProductImages] = useState({});
  const [productOwner, setProductOwner] = useState();
  const [productOwnerCity, setProductOwnerCity] = useState();
  const [productOwnerPhoto, setProductOwnerPhoto] = useState();
  const [productID, setProductID] = useState("");
  const [productUID, setProductUID] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [isNegotiate, setIsNegotiate] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    criteriaMode: "all",
  });

  const dispatch = useDispatch();
  const handleNegotiation = (data) => {
    try {
      createNegotiation(
        getUserDatabase().uid,
        productUID,
        productID,
        data.hargatawar
      );

      const today = new Date();
      dispatch(
        createNotification({
          toId: productUID,
          readStatus: false,
          date: today.toISOString(),
          productName: productDetail.name,
          productPrice: productDetail.price,
          negotiatePrice: data.hargatawar,
          imgurl: productImages[0],
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!loaded) {
      const loadData = async () => {
        const _product = (await axiosInstance.get(`product/${params.id}`)).data;
        const _negotiation = (await axiosInstance.get(`negotiation`)).data;

        if (_product === null) {
          navigate("/");
          window.alert("Barang Tidak Ditemukan");
        } else {
          const _productImages = (
            await axiosInstance.get(`product/${params.id}`)
          ).data.images;
          const _productOwner = (
            await axiosInstance.get(`profile`, {
              headers: {
                product: _product.uid,
                authorization: getToken(),
              },
            })
          ).data;

          setProductImages(_productImages);
          setProductOwner(_productOwner.name);
          setProductOwnerCity(_productOwner.city);
          setProductOwnerPhoto(_productOwner.image);
          setProductDetail(_product);
          setProductID(_product.id);
          setProductUID(_product.uid);
          setIsAllowed(getUserDatabase().uid === _product.uid);

          let i = 0;

          // YOU'VE CHANGED THIS
          while (i < _negotiation.length) {
            if (
              getUserDatabase().uid === _negotiation[i].buyer_uid &&
              _product.uid === _negotiation[i].seller_uid
            ) {
              const isSame = true;
              if (isSame) {
                if (_product.id == _negotiation[i].product_id) {
                  setIsNegotiate(
                    _negotiation[i].isApproved === 1 ||
                      _negotiation[i].isApproved === 2
                  );
                }
              }
            }
            i++;
          }
        }
      };
      loadData().then(() => {
        setLoaded(true);
      });
    }
  }, [loaded]);

  return (
    <div className="product">
      <NavbarMenu1 />
      <div className="container pt-4">
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
              <CircularProgress
                color="inherit"
                sx={{ margin: "auto", mb: 1 }}
              />
              <Typography variant="h5">Loading</Typography>
            </Box>
          </Backdrop>
        ) : (
          <div className="row">
            <div className="col-md-8 carousel-product">
              <Carousel>
                {Object.entries(productImages).map(([key, image]) => (
                  <Carousel.Item>
                    <img
                      className="d-block w-100 rounded-carousel img-produk"
                      src={image}
                      alt={key}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </div>
            <div className="col-12 col-md-4">
              <div className="card inputBasic card-position">
                <div className="card-body">
                  <h5 className="card-title">{productDetail.name}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {productDetail.category}
                  </h6>
                  <p className="card-text">Rp {productDetail.price}</p>
                  <div className="d-grid gap-2">
                    {isAllowed ? (
                      <div>
                        <Link to={`/product/update/${params.id}`}>
                          <Button className="btn-sign-google text-center w-100 nextButton mb-2">
                            Edit
                          </Button>
                        </Link>
                        
                        <Button
                          className="btn-sign text-center w-100 nextButton"
                          onClick={deleteProduct}
                        >
                          Delete
                        </Button>
                      </div>
                    ) : (
                      <div>
                        {productDetail.isAvailable ? (
                          <div className="d-grid gap-2 mb-3">
                            {isNegotiate ? (
                              <Button
                                disabled
                                className="btn-sign text-center nextButton"
                              >
                                Menunggu Respon Penjual
                              </Button>
                            ) : (
                              <Button
                                type="submit"
                                className="btn-sign text-center nextButton"
                                onClick={handleShow}
                              >
                                Saya tertarik dan ingin nego
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="d-grid gap-2 mb-3">
                            <Button
                              disabled
                              className="btn-sign text-center nextButton"
                            >
                              Sudah Terjual
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    <Modal show={show} onHide={handleClose} centered>
                      <Modal.Header
                        closeButton
                        className="border-0"
                      ></Modal.Header>
                      <Modal.Body>
                        <div className="card-body">
                          <h6 className="card-title ">
                            Masukkan Harga Tawarmu
                          </h6>
                          <p className="text-muted">
                            Harga tawaranmu akan diketahui penjual, jika penjual
                            cocok kamu akan segera dihubungi penjual.
                          </p>
                          <div className="card mb-3 inputBasic">
                            <div className="row no-gutters align-items-center">
                              <div className="col-4">
                                <div className="card-body">
                                  <img
                                    src={productImages[0]}
                                    className="card-img border-0 inputBasic img-produk2"
                                    alt=""
                                  ></img>
                                </div>
                              </div>
                              <div className="col-8">
                                <div className="card-body p-0">
                                  <p className="card-text p-0 m-0">
                                    {productDetail.name}
                                  </p>
                                  <p className="card-text">
                                    <small>Rp {productDetail.price}</small>
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Form.Group className="mb-3">
                            <Form.Label htmlFor="textInput">
                              Harga Tawar
                            </Form.Label>
                            <Form.Control
                              {...register("hargatawar", {
                                required: "Tolong Masukkan Harga Tawar",
                                minLength: {
                                  value: 4,
                                  message:
                                    "Harga Yang Anda Masukkan Terlalu Kecil",
                                },
                                pattern: {
                                  value: /^[0-9]*$/,
                                  message: "Tolong Masukkan Hanya Angka",
                                },
                                max: {
                                  value: productDetail.price,
                                  message:
                                    "Harga Yang Anda Masukkan Terlalu Tinggi",
                                },
                              })}
                              // > parseInt(productDetail.price)
                              className="inputBasic"
                              placeholder="Rp 0,00"
                            />
                            <ErrorMessage
                              errors={errors}
                              name="hargatawar"
                              render={({ messages }) =>
                                messages
                                  ? Object.entries(messages).map(
                                      ([type, message]) => (
                                        <p className="red" key={type}>
                                          {message}
                                        </p>
                                      )
                                    )
                                  : null
                              }
                            />
                          </Form.Group>
                          <Button
                            type="submit"
                            className="btn-sign text-center w-100"
                            onClick={handleSubmit(handleNegotiation)}
                            disabled={isSubmitting}
                          >
                            Kirim
                          </Button>
                        </div>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
              <div className="pt-4">
                <div className="card mb-3 card2-position inputBasic">
                  <div className="row no-gutters align-items-center">
                    <div className="col-4">
                      <div className="card-body">
                        <img
                          src={productOwnerPhoto}
                          className="card-img border-0 inputBasic img-user"
                          alt=""
                        ></img>
                      </div>
                    </div>
                    <div className="col-8 p-0">
                      <div className="card-body p-0">
                        <p className="card-text p-0 m-0">{productOwner}</p>
                        <p className="card-text">
                          <small className="text-muted">
                            {productOwnerCity}
                          </small>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row pe-0">
              <div className="col-12 col-md-8 pt-4 pe-0">
                <div className="card inputBasic card3-position pe-0">
                  <div className="card-body">
                    <h4 className="card-title">Deskripsi</h4>
                    <p className="card-text">{productDetail.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
