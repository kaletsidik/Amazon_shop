import React, { useContext, useEffect, useState } from "react";
import classes from "./Orders.module.css";
import LayOut from "../../Components/LayOut/LayOut";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { db } from "../../Utility/firebase/firebase";
import ProductCard from "../../Components/Product/ProductCard";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    console.log("Current user:", user);
    if (user) {
      const unsubscribe = db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .orderBy("created", "desc")
        .onSnapshot(
          (snapshot) => {
            setLoading(false); // Stop loading when data is fetched
            if (snapshot.empty) {
              console.log("No matching documents.");
              console.log(snapshot);
              setOrders([]);
              return;
            }
            const fetchedOrders = snapshot.docs.map((doc) => ({
              id: doc.id,
              data: doc.data(),
            }));
            console.log("Fetched orders:", fetchedOrders);
            setOrders(fetchedOrders);
          },
          (error) => {
            console.error("Error fetching orders:", error);
            setLoading(false); // Stop loading on error
          }
        );

      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      setOrders([]);
      setLoading(false); // Stop loading if no user
    }
  }, [user]);

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders_container}>
          <h2>Your Orders</h2>
          {loading ? ( // Show loading state
            <div style={{ padding: "20px" }}>Loading...</div>
          ) : orders.length === 0 ? (
            <div style={{ padding: "20px" }}>You don't have orders yet.</div>
          ) : (
            <div>
              {orders.map((eachOrder) => (
                <div key={eachOrder.id}>
                  <hr />
                  <p>Order ID: {eachOrder.id}</p>
                  {eachOrder.data.basket?.map((order) => (
                    <ProductCard flex={true} product={order} key={order.id} />
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
