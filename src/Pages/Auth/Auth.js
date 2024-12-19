import React, { useState, useContext } from "react";
import classes from "./Signup.module.css";
import { Link, navigate, useNavigate } from "react-router-dom";
import { auth } from "../../Utility/firebase/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import { Type } from "../../Utility/ActionType";
import { ClipLoader } from "react-spinners";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [{ user }, dispatch] = useContext(DataContext);
  const [loading, setLoading] = useState({ signIn: false, signUp: false });

  const navigate = useNavigate();
  const authHandler = async (e) => {
    e.preventDefault();
    const action = e.target.name;

    if (action === "signin") {
      setLoading((prev) => ({ ...prev, signIn: true }));
      try {
        const userInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed in:", userInfo.user);
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        navigate("/");
      } catch (err) {
        setError(err.message);
        console.error("Sign in error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, signIn: false }));
      }
    } else if (action === "signup") {
      setLoading((prev) => ({ ...prev, signUp: true }));
      try {
        const userInfo = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        console.log("User signed up:", userInfo.user);
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        navigate("/");
      } catch (err) {
        setError(err.message);
        console.error("Sign up error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, signUp: false }));
      }
    }
  };

  return (
    <section className={classes.login}>
      {/* Logo */}
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png"
          alt="Amazon Logo"
          className={classes.logo}
        />
      </Link>

      {/* Form */}
      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {error && <p className={classes.error}>{error}</p>}
        {/* Show error messages */}
        <form>
          <div>
            <label htmlFor="email">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="email"
              required
            />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="password"
              required
            />
          </div>
          <button
            type="submit"
            onClick={authHandler}
            name="signin"
            className={classes.login_signInButton}
            disabled={loading.signIn}
          >
            {loading.signIn ? <ClipLoader color="#000" size={15} /> : "Sign In"}
          </button>
        </form>
        {/* Agreement */}
        <p>
          By signing in, you agree to AMAZON FAKE CLONE's Conditions of Use &
          Sale. Please see our Privacy Notice.
        </p>
        {/* Create Account */}
        <button
          type="button"
          onClick={authHandler}
          name="signup"
          className={classes.login_registerButton}
          disabled={loading.signUp}
        >
          {loading.signUp ? (
            <ClipLoader color="#000" size={15} />
          ) : (
            "Create your Amazon Account"
          )}
        </button>
        {error && (
          <small style={{ paddingTop: "5px", color: "red" }}>{error}</small>
        )}
      </div>
    </section>
  );
}

export default Auth;
