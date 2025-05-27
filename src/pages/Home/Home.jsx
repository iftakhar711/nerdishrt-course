import React from "react";
import Slider from "../Componenets/Slider";
import Roadmap from "../Componenets/Roadmap";
import CourseList from "../Componenets/CourseList";
import SIATrainingHero from "../Componenets/SIATrainingHero";
import Testimonial from "../Componenets/Testimonial";
// import BlogList from "../Componenets/BlogList";
import ConstructionModal from "../Componenets/ConstructionModal";

const Home = () => {
  return (
    <>
      <Slider></Slider>
      <Roadmap></Roadmap>
      <CourseList></CourseList>

      <ConstructionModal />
      {/* Your other content */}

      <SIATrainingHero></SIATrainingHero>
      {/* <BlogList></BlogList> */}
      <Testimonial></Testimonial>
    </>
  );
};

export default Home;
