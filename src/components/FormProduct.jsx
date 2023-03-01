import React, { useState, useMemo } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { UserAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { FiArrowLeft } from "react-icons/fi";
import { Alert, Stack } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const FormProduct = () => {
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

  const [alert, setAlert] = useState(true);
  const [open, setOpen] = useState(false);

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

  const { createProduct, messageProduct } = UserAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    criteriaMode: "all",
  });

  const handleCreate = async (data) => {
    console.log(data);
    try {
      setOpen(true);
      await createProduct(
        data.name,
        data.price,
        data.category,
        data.description,
        files
      );
    } catch (e) {
      console.log(e.message);
    }
  };

  const removeNewImg = (index) => {
    const tempNewFiles = [...files];
    tempNewFiles.splice(index, 1);
    setFiles(tempNewFiles);
  };

  const myfiles = useMemo(
    () =>
      files.map((file, index) => (
        <div style={thumb} key={index}>
          <button
            onClick={(e) => {
              e.preventDefault();
              removeNewImg(index);
            }}
          >
            X
          </button>
          <div style={thumbInner}>
            <img src={file.preview} style={img} alt="" />
          </div>
        </div>
      )),
    [files]
  );

  console.log(files.length);

  return (
    <div className="row justify-content-center g-0 form">
      <div className="alert">
        <Stack
          position={"absolute"}
          sx={{
            display: messageProduct ? "block" : "none",
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
            {messageProduct}
          </Alert>
        </Stack>
      </div>
      <div className="col-md-1 col-xs-1">
        <Link to="/">
          <FiArrowLeft
            className="me-2"
            style={{ fontSize: "25px", color: "black" }}
          />
        </Link>
      </div>
      <div className="col-md-4 col-xs-12">
        <section>
          <Form className="sign pt-10" onSubmit={handleSubmit(handleCreate)}>
            <Form.Group className="mb-3">
              <Form.Label for="product_name">Nama Produk</Form.Label>
              <Form.Control
                {...register("name", {
                  required: "Tolong Masukkan Nama Barang",
                  maxLength: {
                    value: 60,
                    message: "Nama Barang Tidak Boleh Lebih Dari 60 Huruf",
                  },
                  minLength: {
                    value: 5,
                    message: "Nama Barang Tidak Boleh Kurang Dari 5 Huruf",
                  },
                })}
                id="product_name"
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
              <Form.Label for="price">Harga Produk</Form.Label>
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
                id="price"
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
              <Form.Label className="form-label">Kategori</Form.Label>
              <Form.Select
                {...register("category", {
                  required: "Tolong Masukkan Kategori",
                })}
                id="category"
                className="inputBasic"
              >
                <option selected disabled value="">
                  Pilih Kategori
                </option>
                <option>Hobi</option>
                <option>Kendaraan</option>
                <option>Baju</option>
                <option>Elektronik</option>
                <option>Kesehatan</option>
              </Form.Select>
              <ErrorMessage
                errors={errors}
                name="category"
                render={({ messages }) =>
                  messages &&
                  Object.entries(messages).map(([type, message]) => (
                    <p className="red" key={type}>
                      {message}
                    </p>
                  ))
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label for="deskrisi">Deskripsi</Form.Label>
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
                id="description"
                as="textarea"
                rows={3}
                className="inputBasic text-input"
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
            <Form.Group>
              <Form.Label for="fotoProduk">Foto Produk</Form.Label>
              <aside style={thumbsContainer}>
                {myfiles}
                <div {...getRootProps({ className: "dropzone" })}>
                  <input
                    {...register("fotoproduk", {
                      required:
                        files.length === 0 ? "Tolong Masukkan Gambar" : false,
                    })}
                    {...getInputProps()}
                  />
                  <div>
                    {files.length >= 4 ? (
                      <div></div>
                    ) : (
                      <img
                        src="/img/Group1.png"
                        style={{ width: "100px" }}
                        className="iconn"
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
            </Form.Group>
            <div className="d-flex mt-4" style={{ width: "100%", gap: "1rem" }}>
              <Button
                type="submit"
                className="btn-sign text-center w-100"
                disabled={isSubmitting}
              >
                Terbitkan
              </Button>
            </div>
          </Form>
        </section>
      </div>
      <div className="col-md-1 col-xs-1 me-2"></div>
      <Backdrop
        sx={{ backgroundColor: "#FFFFFF", color: "#7126b5", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <Box display={'flex'} flexDirection={'column'}>
            <CircularProgress color="inherit" sx={{ margin: 'auto', mb: 1 }} />
            <Typography variant='h5'>Loading...</Typography>
        </Box>
      </Backdrop>
    </div>
  );
};

export default FormProduct;
