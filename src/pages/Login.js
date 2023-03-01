import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { UserAuth } from "../context/AuthContext";

import "bootstrap/dist/css/bootstrap.min.css"
import { Link } from "react-router-dom"
import { FiEye } from "react-icons/fi";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, signInWithGoogle } = UserAuth();

  const [passwordShown, setPasswordShown] = useState(false);
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await signIn(email, password);
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
    <div className="container-fluid">
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
              <Form className="sign" onSubmit={handleSubmit}>
                <h4 className="pb-2 fw-bold">Masuk</h4>
                <fieldset>
                  <Form.Group className="mb-3">
                    <Form.Label className="form-label">Email</Form.Label>
                    <Form.Control
                      className="inputBasic"
                      id="email"
                      placeholder="Contoh: johndee@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-1">
                    <Form.Label htmlFor="textInput">Password</Form.Label>
                    <div className="d-flex">
                      <Form.Control
                        className="inputBasic"
                        id="password"
                        type={passwordShown ? "text" : "password"}
                        placeholder="Masukkan password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={togglePassword}
                      >
                        <FiEye />
                      </button>
                    </div>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <div className="row">
                      <div className="col auto text-end small">
                        <Link to='/lupa-password' className="text-link text-decoration-none">
                          Lupa Password
                        </Link>
                        {/* <a
                          href="/lupa-password"
                          className="link-primary text-link text-decoration-none"
                        >
                          Lupa Password
                        </a> */}
                      </div>
                    </div>
                  </Form.Group>
                  <div className="d-grid gap-2 mb-4">
                    <Button type="submit" className="btn-sign text-center">
                      Masuk
                    </Button>
                  </div>
                  <div className="text-center mb-4">
                    Belum punya akun?{" "}
                    <Link to='/register' className="text-link text-decoration-none fw-bold ">
                      Daftar di sini
                    </Link>
                    <a
                      href="/register"
                    >
                    </a>
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
                      Sign Up With Google
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

export default Login;
