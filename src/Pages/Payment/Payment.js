import React, { useContext, useState } from "react";
import classes from "./Payment.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import ProductCard from "../../Components/Product/ProductCard";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CurrencyFormat from "../../Components/CurrencyFormat/CurrencyFormat";
import { axiosInstance } from "../../Api/axios";
import ClipLoader from "react-spinners/ClipLoader";
import { db } from "../../Utility/firebase/firebase";
import { useNavigate } from "react-router-dom";
import { Type } from "../../Utility/ActionType";

function Payment() {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const [CardError, setCardError] = useState(null);
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCardError(e.error ? e.error.message : "");
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (typeof total !== "number" || total <= 0) {
      console.error("Invalid total amount");
      return; // Stop execution if the total is invalid
    }

    try {
      setProcessing(true);

      // Step 1: Get clientSecret from the backend
      const response = await axiosInstance.post(
        `/payment/create?total=${total * 100}`
      ); // Multiply by 100 to convert to cents

      console.log(response.data); // Log the response data
      const clientSecret = response.data?.clientSecret;

      if (!clientSecret) {
        throw new Error("Client secret is missing from the response.");
      }

      // Step 2: Confirm payment on the client side
      const paymentConfirmation = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      const { paymentIntent, error } = paymentConfirmation;

      if (error) {
        throw new Error(error.message);
      }

      if (!paymentIntent) {
        throw new Error("Payment Intent was not created.");
      }

      console.log("Payment succeeded:", paymentIntent);

      // Step 3: Save order to Firestore
      await db
        .collection("users")
        .doc(user.uid) // Use user.uid instead of user.id
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
          status: paymentIntent.status, // Optionally store the payment status
        });

      // Empty the basket
      dispatch({ type: Type.EMPTY_BASKET });

      // Navigate to orders page with success message
      navigate("/orders", { state: { msg: "You have placed a new order" } });
    } catch (error) {
      console.error("Error processing payment:", error);
      setCardError("Payment failed. Please try again.");
    } finally {
      setProcessing(false); // Always reset the processing state
    }
  };

  return (
    <LayOut>
      {/* Header */}
      <div className={classes.Payment_header}>Checkout ({totalItem}) items</div>

      {/* Payment method */}
      <section className={classes.Payment}>
        {/* Address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Line</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />
        {/* Product Review */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>
          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />
        {/* Card Form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.Payment_card_container}>
            <div className={classes.Payment_details}>
              <form onSubmit={handlePayment}>
                {/* Error Message */}
                {CardError && (
                  <small style={{ color: "red" }}>{CardError}</small>
                )}
                {/* Card Elements */}
                <CardElement onChange={handleChange} />
                {/* Price */}
                <div>
                  <div className={classes.Payment_price}>
                    <span>
                      <p>
                        Total Order | <CurrencyFormat amount={total || 0} />
                      </p>
                    </span>
                  </div>
                  <button type="submit" disabled={!stripe || processing}>
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Please Wait...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
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
