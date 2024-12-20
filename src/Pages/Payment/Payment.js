import React, { useContext,useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import {useStripe, useElements,CardElement} from '@stripe/react-stripe-js';
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";

import ClipLoader from "react-spinners/ClipLoader";


function Payment() {

  const [{user, basket }] = useContext(DataContext)
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

   const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
   }, 0);
  
const[CardError,setCardError]=useState(null)
  const stripe = useStripe();
  const elements = useElements();
  const [processing,setProcessing]=useState(false)

  const handleChange = (e) => {
    // console.log(e)
    e.error?.message?setCardError(e.error?.message):setCardError("")
  }
  const handlePayment = async(e) => {
    e.preventDefault()
    if (typeof total !== 'number' || total <= 0) {
        console.error("Invalid total amount"); 
    }
    // 1.backend || function --->contact to the client secrete
    try {
      setProcessing(true)
    const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
    });
    console.log(response.data); // Log the response data

    const clientSecret = response.data?.clientSecret;
    if (!clientSecret) {
        throw new Error("Client secret is missing from the response.");
      }
       // 2. client side (react side confirmation)

    const [paymentIntent] = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: elements.getElement(CardElement),
        },
    });
      // console.log(paymentIntent);
      setProcessing(false)
} catch (error) {
    console.log("Error processing payment:", error);
    setProcessing(false)
    }
     

    // 3.after the confirmation -->order fire store database save,clear backend


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
              <form action="" onSubmit={handlePayment}>
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
                  <button type="submit">
                    {
                      processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12}/>
                        <p> Please Wait...
                        </p>
                      </div>
                    ):
                      "Pay Now"
                      }
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
