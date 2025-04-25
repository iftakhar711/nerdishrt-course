import React from "react";
import Slider from "../Componenets/Slider";
import Roadmap from "../Componenets/Roadmap";
import CourseList from "../Componenets/CourseList";
import SIATrainingHero from "../Componenets/SIATrainingHero";
import Testimonial from "../Componenets/Testimonial";

const Home = () => {
  return (
    <>
      <Slider></Slider>
      <Roadmap></Roadmap>
      <CourseList></CourseList>
      <SIATrainingHero></SIATrainingHero>
      <Testimonial></Testimonial>
    </>
  );
};

export default Home;
