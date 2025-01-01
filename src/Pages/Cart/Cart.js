import React, { useContext } from "react";
import classes from "./Cart.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { Link } from "react-router-dom";
import { Type } from "../../Utility/ActionType";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";

function Cart() {
  const [{ basket, user }, dispatch] = useContext(DataContext);

  // Calculate total price of items in the basket
  const total = basket.reduce(
    (amount, item) => item.price * item.amount + amount,
    0
  );

  // Increment item amount
  const increment = (item) => {
    dispatch({
      type: Type.ADD_TO_BASKET,
      item,
    });
  };

  // Decrement item amount
  const decrement = (id) => {
    dispatch({
      type: Type.REMOVE_FROM_BASKET,
      id,
    });
  };

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.cart_container}>
          <h2>Hello {user ? user.name : "Guest"}</h2>
          <h3>Your Shopping Basket</h3>
          <hr />

          {/* Display message if basket is empty */}
          {basket.length === 0 ? (
            <p>Oops! No items in your cart.</p>
          ) : (
            basket.map((item, i) => (
              <section className={classes.cart_product} key={item.id || i}>
                <ProductCard
                  product={item}
                  renderDesc={true}
                  renderAdd={false}
                  flex={true}
                />
                <div className={classes.btn_container}>
                  <button
                    className={classes.btn}
                    onClick={() => increment(item)}
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <IoIosArrowUp size={20} />
                  </button>
                  <span>{item.amount}</span>
                  <button
                    className={classes.btn}
                    onClick={() => decrement(item.id)}
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <IoIosArrowDown size={20} />
                  </button>
                </div>
              </section>
            ))
          )}
        </div>

        {/* Subtotal and Checkout */}
        {basket.length !== 0 && (
          <div className={classes.subtotal}>
            <div>
              <p>
                Subtotal ({basket.length} item{basket.length > 1 ? "s" : ""}):
              </p>
              <CurrencyFormat amount={total} />
            </div>
            <span>
              <input type="text" placeholder="Enter a gift message" />
              <small>This order contains a gift</small>
            </span>
            <Link to="/payment">Continue to checkout</Link>
          </div>
        )}
      </section>
    </LayOut>
  );
}

export default Cart;
