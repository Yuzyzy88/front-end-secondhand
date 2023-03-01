import { Routes, Route, useParams, Link } from "react-router-dom";
import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Main from "./pages/Main";
import Sell from "./pages/Sell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import LupaPassword from "./pages/LupaPassword";
import List from "./pages/List"

import Negotiation from "./components/Negotiation";
import NavbarMenu from "./components/Navbar";
import NavbarMenu1 from "./components/Navbar1";
import Form from "./components/FormProduct";
import FormUpdateProduct from "./components/FormProductUpdate";
import Product from "./components/Product";
import { AuthContextProvider } from "./context/AuthContext";
import {
  ProtectedRoute,
  PublicRoute,
  SpecialRoute,
} from "./context/ProtectedRoute";
import InfoPenawar from "./pages/InfoPenawar";


function App() {
  const PageNotFound = () => {

    return (
      <div>
        <NavbarMenu />
        <div className="container">
          <div className="row justify-content-center center-page">
            <div className=" col-7 align-self-center text-center">
              <img
                src="/img/eror404.svg"
                alt=""
                className="w-100 p-4"
              ></img>
              <p className="h2 text-link pt-2">There's nothing here!</p>
              <p className="pb-4">Oopss! Halaman yang Anda cari tidak ditemukan.</p>
              <Link to="/">
                <button className="btn-sign">Homepage</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/lupa-password"
            element={
              <PublicRoute>
                <LupaPassword />
              </PublicRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile compNav={<NavbarMenu />} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SpecialRoute>
                  <Sell compNav={<NavbarMenu />} compForm={<Form />} />
                </SpecialRoute>
              </ProtectedRoute>
            }
          />

          <Route path="/product/:id" element={
            <ProtectedRoute>
              <SpecialRoute>
                <Product />
              </SpecialRoute>
            </ProtectedRoute>}
          />

          <Route path="/penawar/:id" element={
            <ProtectedRoute>
              <SpecialRoute>
                <InfoPenawar compNav={<NavbarMenu />} />
              </SpecialRoute>
            </ProtectedRoute>}
          />

          <Route path="/product/update/:id" element={
            <ProtectedRoute>
              <SpecialRoute>
                <FormUpdateProduct compNav1={<NavbarMenu1 />}/>
              </SpecialRoute>
            </ProtectedRoute>}
          />

          <Route path="/notification" />

          <Route
            path="/list"
            element={
              <ProtectedRoute>
                <SpecialRoute>
                  <List/>
                </SpecialRoute>
              </ProtectedRoute>
            }
          />

          <Route
            path="/penawaran/:id"
            element={
              <ProtectedRoute>
                <SpecialRoute>
                  <Negotiation />
                </SpecialRoute>
              </ProtectedRoute>
            }
          />
          <Route path="/:pageName" element={<PageNotFound />} />
        </Routes>
      </AuthContextProvider>
    </div>
  );
}

export default App;
