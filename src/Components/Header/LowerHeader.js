import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import classes from "./header.module.css";
const LowerHeader = () => {
  return (
    <div className={classes.lower_container}>
      <ul>
        <li>
          <AiOutlineMenu />
          All
        </li>
        <li>today's Deals</li>
        <li>Customer Service</li>
        <li>Registry</li>
        <li>Gift Card</li>
        <li>Sell</li>
      </ul>
    </div>
  );
};
export default LowerHeader;
