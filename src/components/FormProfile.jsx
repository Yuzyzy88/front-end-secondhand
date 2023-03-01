import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { UserAuth } from "../context/AuthContext";
import { useForm } from "react-hook-form";
import { auth } from "../firebase";
import { ErrorMessage } from "@hookform/error-message";
import { FiArrowLeft } from "react-icons/fi";
import {
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import "bootstrap/dist/css/bootstrap.min.css";
import { Alert, Stack } from "@mui/material";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const FormProfile = () => {
  const thumbsContainer = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
  };

  const thumb = {
    display: "inline-flex",
    borderRadius: 2,
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
  const [alert, setAlert] = useState(true);
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps } = useDropzone({
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
    onDrop: (acceptedFiles) => {
      setFiles([
        ...files,
        ...acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    },
  });

  const thumbs = files.map((file) => (
    <div style={thumb} key={file.name} className="p-0 inputBasic">
      <div style={thumbInner} className=" inputBasic">
        <img
          src={file.preview}
          style={img}
          alt=""
          // Revoke data uri after image is loaded
          onLoad={() => {
            URL.revokeObjectURL(file.preview);
          }}
        />
      </div>
    </div>
  ));

  const { updateAccountProfile, getUserDatabase, messageAcc } = UserAuth();
  const [userData, setUserData] = useState(getUserDatabase());
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = useForm({
    defaultValues: userData,
    criteriaMode: "all",
  });

  const handleUpdate = async (data) => {
    setOpen(true);
    try {
      await updateAccountProfile(
        data.name,
        data.city,
        data.address,
        data.phone,
        files[0]
      );
  
      const updatedUserData = {
        ...userData,
        name: data.name,
        city: data.city,
        address: data.address,
        phone: data.phone,
        image: auth.currentUser.photoURL,
      };

      localStorage.setItem("User Data", JSON.stringify(updatedUserData));
      localStorage.setItem("IsEmptyProfile", "false");
    } catch (e) {
      console.log(e);
    }
  };

  const handleValidate = (value) => {
    const isValid = value
      ? isPossiblePhoneNumber(value)
      : isPossiblePhoneNumber("12");
    return isValid;
  };

  const isProfileEmpty =
    localStorage.getItem("IsEmptyProfile") === "true" ? true : false;

  return (
    <div className="row justify-content-center g-0 form">
      <div className="alert">
        <Stack
          position={"absolute"}
          sx={{
            display: messageAcc ? "block" : "none",
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
            {messageAcc}
          </Alert>
        </Stack>
      </div>
      <div className="col-xs-1 col-md-2 col-lg-1">
        <Link to="/">
          <FiArrowLeft
            className="me-2"
            style={{ fontSize: "25px", color: "black" }}
          />
        </Link>
      </div>
      <div className="col-xs-12 col-md-7 col-lg-4">
        <Form className="sign pt-10" onSubmit={handleSubmit(handleUpdate)}>
          <fieldset>
            <section className="container pb-4">
              <center>
              <div {...getRootProps({ className: "dropzone" })}>
                <input
                  {...register("fotoprofile", {
                    required: (!getUserDatabase().image && files.length === 0) ? "Tolong Masukkan Gambar Anda" : false,
                  })} 
                  {...getInputProps()} 
                />
                {Object.keys(files).length === 0 ? (
                  <img
                    src={
                      getUserDatabase().image
                        ? getUserDatabase().image
                        : "/img/upload-img.png"
                    }
                    alt="..."
                    className="img-thumbnail border-0 inputBasic mx-auto d-block p-2"
                  />
                ) : (
                  <div style={thumbsContainer}className="inputBasic">{thumbs}</div>
                )}
              </div>
              </center>
            </section>
            <ErrorMessage
                errors={errors}
                name="fotoprofile"
                render={({ messages }) =>
                  messages
                    ? Object.entries(messages).map(([type, message]) => (
                        <p className="red" key={type}>{message}</p>
                      ))
                    : null
                }
            />

            <Form.Group className="mb-3">
              <Form.Label className="form-label">Nama</Form.Label>
              <Form.Control
                {...register("name", {
                  required: "Tolong Masukkan Nama Anda",
                  maxLength: {
                    value: 40,
                    message: "Nama Tidak Boleh Lebih Dari 40 Huruf",
                  },
                  minLength: {
                    value: 5,
                    message: "Nama Tidak Boleh Kurang Dari 5 Huruf",
                  },
                  pattern: {
                    value: /^[a-zA-Z][a-zA-Z ]*$/,
                    message: "Nama Tidak Boleh Mengandung Angka",
                  },
                })}
                id="name"
                className="inputBasic"
                placeholder="Nama"
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
              <Form.Label className="form-label">Kota</Form.Label>
              <Form.Select
                {...register("city", {
                  required: "Tolong Masukkan Kota Anda",
                })}
                id="city"
                className="inputBasic"
              >
                <option selected disabled>
                  Pilih Kota
                </option>
                <option>Banda Aceh</option>
                <option>Balikpapan</option>
                <option>Bandung</option>
                <option>Bekasi</option>
                <option>Bengkulu</option>
                <option>Cirebon</option>
                <option>Depok</option>
                <option>Kupang</option>
                <option>Madiun</option>
                <option>Magelang</option>
                <option>Semarang</option>
                <option>Surabaya</option>
                <option>Surakarta</option>
                <option>Pekalongan</option>
                <option>Pontianak</option>
                <option>Tegal</option>
                <option>Yogyakarta</option>
              </Form.Select>
              <ErrorMessage
                errors={errors}
                name="city"
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
              <Form.Label className="form-label">Alamat</Form.Label>
              <Form.Control
                {...register("address", {
                  required: "Tolong Masukkan Alamat Anda",
                  minLength: {
                    value: 5,
                    message: "Alamat Tidak Boleh Kurang Dari 5 Huruf",
                  },
                })}
                className="inputBasic text-input"
                as="textarea"
                rows={3}
                id="address"
                placeholder="Contoh: Jalan Ikan Hiu 33"
              />
              <ErrorMessage
                errors={errors}
                name="address"
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
              <Form.Label className="form-label">No. Handphone</Form.Label>
              <Form.Control
                {...register("phone", {
                  required: "Tolong Masukkan Nomor HP Anda",
                  validate: (value) =>
                    handleValidate(value) ||
                    "Tolong Masukkan Nomor HP Yang Valid",
                })}
                control={control}
                className="inputBasic text-input"
                id="phone"
                placeholder="Contoh: +628123456789"
              />
            </Form.Group>
            <ErrorMessage
              errors={errors}
              name="phone"
              render={({ messages }) =>
                messages &&
                Object.entries(messages).map(([type, message]) => (
                  <p className="red" key={type}>
                    {message}
                  </p>
                ))
              }
            />

            <div className="d-grid gap-2 mb-3 mt-4">
              {isProfileEmpty ? (
                <Button
                  disabled={isSubmitting}
                  type="submit"
                  className="btn-sign text-center"
                >
                  Simpan
                </Button>
              ) : (
                <>
                  <Button
                    disabled={!isDirty || isSubmitting}
                    type="submit"
                    className="btn-sign text-center"
                  >
                    Simpan
                  </Button>
                </>
              )}
            </div>
          </fieldset>
        </Form>
      </div>
      <div className="col-xs-1 col-md-2 col-lg-1 me-2"></div>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
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

export default FormProfile;
