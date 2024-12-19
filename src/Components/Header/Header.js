import React, { useContext } from "react";
import classes from "./header.module.css";
import { SlLocationPin } from "react-icons/sl";
import { BiCart } from "react-icons/bi";
import { BsSearch } from "react-icons/bs";
import LowerHeader from "./LowerHeader";
import { Link } from "react-router-dom";
import { DataContext } from "../DataProvider/DataProvider";
import { auth } from "../../Utility/firebase/firebase";

function Header() {
  const [{ user, basket }] = useContext(DataContext);
  const totalItem = basket?.reduce((amount, item) => item.amount + amount, 0);

  return (
    <>
      <section className={classes.fixed}>
        <section>
          <div className={classes.header_container}>
            {/* Logo Section */}
            <div className={classes.logo_container}>
              <Link to="/">
                <img
                  src="https://mui.com/static/branding/companies/amazon-dark.svg"
                  alt="Amazon Logo"
                />
              </Link>
              {/* Delivery Info */}
              <div className={classes.delivery}>
                <span>
                  <SlLocationPin />
                </span>
                <div>
                  <p>Delivered to</p>
                  <span>Ethiopia</span>
                </div>
              </div>
            </div>

            {/* Search Section */}
            <div className={classes.search}>
              <select name="category" id="category" aria-label="Category">
                <option value="">All</option>
              </select>
              <input
                type="text"
                name="search"
                id="search"
                placeholder="Search product"
                aria-label="Search"
              />
              <button aria-label="Search">
                <BsSearch size={32} />
              </button>
            </div>

            {/* User Options */}
            <div className={classes.order_container}>
              {/* Language Selector */}
              <div className={classes.language}>
                <img
                  src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
                  alt="USA Flag"
                />
                <select name="language" id="language" aria-label="Language">
                  <option value="EN">EN</option>
                  {/* Add more languages if needed */}
                </select>
              </div>

              {/* Sign In */}
              <Link to={!user && "/auth"}>
                <div>
                  {user ? (
                    <>
                      <p>Hello, {user?.email?.split("@")[0]}</p>
                      <span onClick={() => auth.signOut()}>Sign Out</span>
                    </>
                  ) : (
                    <>
                      <p>Hello, Sign In</p>
                      <span>Account & Lists</span>
                    </>
                  )}
                </div>
              </Link>

              {/* Orders */}
              <Link to="/orders">
                <p>Returns</p>
                <span>& Orders</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className={classes.cart}>
                <BiCart size={35} />
                <span>{totalItem}</span>
              </Link>
            </div>
          </div>
        </section>
        <LowerHeader />
      </section>
    </>
  );
}

export default Header;
