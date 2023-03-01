import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";
import { ErrorMessage } from "@hookform/error-message";
import { useForm } from "react-hook-form";
import { FiEye } from "react-icons/fi";

import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    criteriaMode: "all",
  });

  const [password, setPassword] = useState("");
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const [error, setError] = useState(false);
  const { createUser, signInWithGoogle } = UserAuth();
  

  const handleRegister = async (data) => {
    setError("");
    try {
      await createUser(data.email, data.password, data.displayName);
    } catch (e) {
      setError(e.message);
      console.log(e.message);
    }
  };

  const handleGoogleBtn = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signInWithGoogle();
    } catch (err) {
      setError(e.message);
      console.log(e.message);
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="row align-items-center">
        <div className="col-lg-6 col-md-12 p-0">
          <img
            className="img-fluid icon"
            src="/img/bg.png"
            alt=""
            width="100%"
            style={{ height: "967px" }}
          />
        </div>
        <div className="col-lg-6 col-md-12 col-xs-12 pt-5 pb-5">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-6 col-xs-12">
              <Form className="sign" onSubmit={handleSubmit(handleRegister)}>
                <h4 className="pb-2 fw-bold">Daftar</h4>
                <fieldset>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Nama</Form.Label>
                    <Form.Control
                      {...register("displayName", {
                        required: "Tolong Masukkan Nama Anda",
                        maxLength: {
                          value: 40,
                          message: "Nama Tidak Boleh Lebih Dari 40 Huruf",
                        },
                        minLength: {
                          value: 3,
                          message: "Nama Tidak Boleh Kurang Dari 3 Huruf",
                        },
                        pattern: {
                          value: /^[a-zA-Z][a-zA-Z ]*$/,
                          message: "Nama Tidak Boleh Mengandung Angka",
                        },
                      })}
                      className="inputBasic"
                      id="displayName"
                      placeholder="Contoh: John Doe"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="displayName"
                      render={({ messages }) =>
                        messages
                          ? Object.entries(messages).map(([type, message]) => (
                              <p key={type}>{message}</p>
                            ))
                          : null
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Email</Form.Label>
                    <Form.Control
                      {...register("email", {
                        required: "Tolong Masukkan Email Anda",
                        pattern: {
                          value: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Tolong Masukkan Email yang Valid"
                        }
                      })}
                      className="inputBasic"
                      id="email"
                      placeholder="Contoh: johndee@gmail.com"
                    />
                    <ErrorMessage
                      errors={errors}
                      name="email"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type}>{message}</p>
                        ))
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="textInput">Password</Form.Label>
                    <div className="d-flex">
                    <Form.Control
                      {...register('password', {
                        required: "Tolong Masukkan Password Anda",
                        minLength: {
                          value: 5,
                          message: "Password Terlalu Pendek"
                        },
                        maxLength: {
                          value: 25,
                          message: "Password Terlalu Panjang"
                        }
                      })}
                      className="inputBasic"
                      id="password"
                      type={passwordShown ? "text" : "password"}
                      placeholder="Masukkan password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                        type="button"
                        className="btn"
                        onClick={togglePassword}
                      >
                        <FiEye />
                      </button>
                      </div>
                    <ErrorMessage
                      errors={errors}
                      name="password"
                      render={({ messages }) =>
                        messages &&
                        Object.entries(messages).map(([type, message]) => (
                          <p key={type}>{message}</p>
                        ))
                      }
                    />
                  </Form.Group>
                  <div className="d-grid gap-2 mb-4">
                    <Button disabled={isSubmitting} type="submit" className="btn-sign text-center">
                      Daftar
                    </Button>
                  </div>
                  <div className="text-center mb-4">
                    Sudah punya akun?{" "}
                    <Link to='/login' className="text-link text-decoration-none fw-bold">
                      Masuk di sini
                    </Link>
                  </div>
                  <div className="d-grid gap-2">
                    <Button
                      type="submit"
                      className="btn-sign-google text-center"
                      onClick={handleGoogleBtn}
                    >
                      <img
                        src="/img/google.png"
                        alt=""
                        width={24}
                        className="me-2"
                      />
                      Sign In With Google
                    </Button>
                  </div>
                </fieldset>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
