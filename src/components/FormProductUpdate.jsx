import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, FormGroup } from "react-bootstrap";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { UserAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../axios";
import { ErrorMessage } from "@hookform/error-message";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FiArrowLeft } from "react-icons/fi";
import { Alert, Stack } from "@mui/material";
import NavbarMenu from "./Navbar";

const FormProductUpdate = () => {
  const [alert, setAlert] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  };    

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
    border: "1px solid #eaeaea",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
  };

  const thumbInner = {
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
  };

  const img = {
    display: "block",
    width: "auto",
    height: "100%",
  };

  const [open, setOpen] = useState(false);
  const [oldFiles, setOldFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 4,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length <= 4) {
        return setFiles([
          ...files,
          ...acceptedFiles.map((file) =>
            Object.assign(file, {
              preview: URL.createObjectURL(file),
            })
          ),
        ]);
      }
    },
  });

  const removeOldImg = (index) => {
    const tempOldFiles = [...oldFiles];
    tempOldFiles.splice(index, 1);
    setOldFiles(tempOldFiles);
  };

  const removeNewImg = (index) => {
    const tempNewFiles = [...files];
    tempNewFiles.splice(index, 1);
    setFiles(tempNewFiles);
  };

  const oldThumbs = useMemo(
    () =>
      oldFiles.map((file, index) => (
        <div style={thumb} key={index}>
          <button
            onClick={(e) => {
              e.preventDefault();
              removeOldImg(index);
            }}
          >
            X
          </button>
          <div style={thumbInner}>
            <img src={file} style={img} alt="" />
          </div>
        </div>
      )),
    [oldFiles]
  );

  const thumbs = useMemo(
    () =>
      files.map((file, index) => (
        <div style={thumb} key={file.name}>
          <button onClick={() => removeNewImg(index)}>X</button>
          <div style={thumbInner}>
            <img
              src={file.preview}
              style={img}
              alt=""
              onLoad={() => {
                URL.revokeObjectURL(file.preview);
              }}
            />
          </div>
        </div>
      )),
    [files]
  );

  const [loaded, setLoaded] = useState(false);

  const { UpdateProduct, getUserDatabase, messageUpdate } = UserAuth();
  const [error, setError] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    criteriaMode: "all",
  });

  useEffect(() => {
    if (!loaded) {
      const loadData = async () => {
        const data = (await axiosInstance.get(`product/${id}`)).data;

        if (!data) {
          navigate("/");
          window.alert("Barang Tidak Ditemukan");
        } else {
          const isAllowed = getUserDatabase().uid === data.uid;

          if (!isAllowed) {
            navigate("/");
            window.alert("You Are Not Supposed To Be Here");
          } else {
            setOldFiles(data.images ? data.images : []);
            setValue("name", data.name);
            setValue("price", data.price);
            setValue("category", data.category);
            setValue("description", data.description);
          }
        }
      };
      loadData();
      setLoaded(true);
    }
  });

  const handleUpdate = async (data) => {
    setOpen(true);
    try {
      await UpdateProduct(
        id,
        data.name,
        data.price,
        data.category,
        data.description,
        oldFiles,
        files
      );
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  const imageLength = oldFiles.length + files.length;

  return (
    <div className="updateProduct">
      <NavbarMenu />
      <div style={{ marginTop: "3rem" }}>
        <div className="container">
          <div className="alert">
            <Stack
              position={"absolute"}
              sx={{
                display: messageUpdate ? "block" : "none",
                width: "50%",
                left: "25%",
                right: 0,
                top: 0,
                transition: "0.5s",
                marginTop: alert ? { xs: "120px", md: "-25px" } : "-350px",
              }}
              spacing={2}
            >
              <Alert
                variant="filled"
                severity="success"
                onClose={() => setAlert(false)}
              >
                {messageUpdate}
              </Alert>
            </Stack>
          </div>
          <div className="row" style={{ justifyContent: "center" }}>
            <div className="row" style={{ justifyContent: "center" }}>
              <div className="col-1">
                <Link to="/">
                  <FiArrowLeft
                    className="me-2"
                    style={{ fontSize: "25px", color: "black" }}
                  />
                </Link>
              </div>
              <div className="col-6">
                <Form onSubmit={handleSubmit(handleUpdate)}>
                  <Form.Group className="mb-3">
                    <Form.Label>Nama Produk</Form.Label>
                    <Form.Control
                      {...register("name", {
                        required: "Tolong Masukkan Nama Barang",
                        maxLength: {
                          value: 60,
                          message:
                            "Nama Barang Tidak Boleh Lebih Dari 60 Huruf",
                        },
                        minLength: {
                          value: 5,
                          message:
                            "Nama Barang Tidak Boleh Kurang Dari 5 Huruf",
                        },
                      })}
                      id="productName"
                      placeholder="Nama Produk"
                      className="inputBasic"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="name"
                      render={({ messages }) =>
                        messages
                          ? Object.entries(messages).map(([type, message]) => (
                              <p className="red" key={type}>
                                {message}
                              </p>
                            ))
                          : null
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Harga Produk</Form.Label>
                    <Form.Control
                      {...register("price", {
                        required: "Tolong Masukkan Harga",
                        maxLength: {
                          value: 9,
                          message: "Angka Yang Anda Masukkan Terlalu Besar",
                        },
                        minLength: {
                          value: 4,
                          message: "Angka Yang Anda Masukkan Terlalu Kecil",
                        },
                        pattern: {
                          value: /^[0-9]*$/,
                          message: "Tolong Masukkan Hanya Angka",
                        },
                      })}
                      id="productPrice"
                      placeholder="Rp 0,00"
                      className="inputBasic"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="price"
                      render={({ messages }) =>
                        messages
                          ? Object.entries(messages).map(([type, message]) => (
                              <p className="red" key={type}>
                                {message}
                              </p>
                            ))
                          : null
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Kategori</Form.Label>
                    <Form.Select
                      {...register("category")}
                      id="productCategory"
                      className="inputBasic"
                    >
                      <option selected disabled>
                        Piih Kategori
                      </option>
                      <option>Hobi</option>
                      <option>Kendaraan</option>
                      <option>Baju</option>
                      <option>Elektronik</option>
                      <option>Kesehatan</option>
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Deskripsi</Form.Label>
                    <Form.Control
                      {...register("description", {
                        required: "Tolong Masukkan Deskripsi Barang",
                        maxLength: {
                          value: 1000,
                          message: "Deskripsi Anda Terlalu Panjang",
                        },
                        minLength: {
                          value: 4,
                          message: "Deskripsi Anda Terlalu Pendek",
                        },
                      })}
                      id="productDescription"
                      as="textarea"
                      className="inputBasic"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="description"
                      render={({ messages }) =>
                        messages
                          ? Object.entries(messages).map(([type, message]) => (
                              <p className="red" key={type}>
                                {message}
                              </p>
                            ))
                          : null
                      }
                    />
                  </Form.Group>
                  <FormGroup>
                    <Form.Label>Foto Produk</Form.Label>
                    <aside style={thumbsContainer}>
                      {oldThumbs}
                      {thumbs}
                      <div {...getRootProps({ className: "dropzone" })}>
                        <input
                          {...register("fotoproduk", {
                            required:
                              oldFiles.length == 0 && files.length == 0
                                ? "Tolong Masukkan Gambar"
                                : false,
                          })}
                          {...getInputProps()}
                        />
                        <div>
                          {imageLength >= 4 ? (
                            <div></div>
                          ) : (
                            <img
                              src="../../img/Group1.png"
                              style={{ width: "100px" }}
                              className="icon"
                              alt=""
                            />
                          )}
                        </div>
                      </div>
                    </aside>
                    <ErrorMessage
                      errors={errors}
                      name="fotoproduk"
                      render={({ messages }) =>
                        messages
                          ? Object.entries(messages).map(([type, message]) => (
                              <p className="red" key={type}>
                                {message}
                              </p>
                            ))
                          : null
                      }
                    />
                  </FormGroup>

                  <div
                    className="d-flex"
                    style={{ width: "100%", gap: "1rem" }}
                  >
                    <Button
                      type="submit"
                      className="btn-sign text-center w-100"
                      disabled={isSubmitting}
                    >
                      Terbitkan
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-1 col-xs-1 me-2"></div>/
        <Backdrop
          sx={{ backgroundColor: "#FFFFFF", color: "#7126b5", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          <Box display={"flex"} flexDirection={"column"}>
            <CircularProgress color="inherit" sx={{ margin: "auto", mb: 1 }} />
            <Typography variant="h5">Data Is Being Updated</Typography>
          </Box>
        </Backdrop>
      </div>
    </div>
  );
};

export default FormProductUpdate;
