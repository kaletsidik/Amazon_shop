import React from "react";
import { FadeLoader } from "react-spinners";
import classes from "./Loader.module.css";
function Loader() {
  return (
    <div className={classes.Loader}>
      <FadeLoader color="#0d5ec1" />
    </div>
  );
}

export default Loader;
