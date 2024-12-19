import React, { useContext } from "react";
import { Rating } from "@mui/material";
import CurrencyFormat from "../CurrencyFormat/CurrencyFormat";
import classes from "./Product.module.css";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { Type } from "../../Utility/ActionType";

function ProductCard({ product, flex, renderDescription, renderAdd }) {
  const [state, dispatch] = useContext(DataContext);
  if (!product) {
    return <div>Product not found</div>;
  }
  const { image, title, id, rating, price, description } = product;

  const addToCart = () => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item: {
        image,
        title,
        id,
        rating,
        price,
        description,
      },
    });
  };
  return (
    <div
      className={`${classes.card_container} ${
        flex ? classes.product_flexed : ""
      }`}
    >
      <Link to={`/products/${id}`}>
        <img src={image} alt="" />
      </Link>
      <div>
        <h3>{title}</h3>
        {renderDescription && (
          <div className={classes.description}>{description}</div>
        )}
        <div className={classes.rating}>
          {/*rating*/}
          <Rating value={rating?.rate} precision={0.1} />
          {/*count*/}
          <small>{rating?.count}</small>
        </div>
        <div>
          {/*price*/}
          <CurrencyFormat amount={price} />
        </div>
        {renderAdd && (
          <button className={classes.button} onClick={addToCart}>
            add to cart
          </button>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
