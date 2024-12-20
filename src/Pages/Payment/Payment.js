import React, { useContext,useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import {useStripe, useElements,CardElement} from '@stripe/react-stripe-js';
import { colors } from "@mui/material";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";


function Payment() {

  const [{user, basket }] = useContext(DataContext)
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

   const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
   }, 0);
  
const[CardError,setCardError]=useState(null)
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    // console.log(e)
    e.error?.message?setCardError(e.error?.message):setCardError("")
  }
  return (
    <LayOut>
      {/* header */}

      <div className={classes.Payment_header}>Checkout({totalItem}) items</div>

      {/* payment method */}
      <section className={classes.Payment}>
        {/* address */}
        <div className={classes.flex}> 
          <h3>Delivery Address</h3>
          <div>
            <div>
             { user?.email}
            </div>
            <div>
              123 React Line
            </div>
            <div>
              Chicago,IL
            </div>
          </div>
        </div>
          <hr />
          {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => <ProductCard product={ item} flex={true} />)}
          </div>
        </div>
        <hr />
        {/* card form */}
        <div className={classes.flex}>
          <h3> Payment methods</h3>
          <div className={classes.Payment_card_container}>
            <div className={classes.Payment_details}>
              <form action="">
                {/* error */}
                {CardError && <small style={{ color: "red" }}>{CardError}</small>}
                {/* card elements */}
                <CardElement onChange={handleChange} /> 
                {/* price */}
               <div>
                    <div className={classes.Payment_price}>
                      <span>
                        <p>
                          Total Order | <CurrencyFormat amount={total || 0} />
                        </p>
                      </span>
                    </div>
                    <button >
                     
                      Pay Now
                    </button>
                  </div>

              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
}
export default Payment;
