import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../pages/Componenets/Navbar";
import TopBar from "../pages/Componenets/TopBar";
import Footer from "../pages/Componenets/Footer";

const Main = () => {
  return (
    <div>
      <TopBar></TopBar>
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default Main;
