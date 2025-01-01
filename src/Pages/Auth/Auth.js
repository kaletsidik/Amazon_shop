import React, { useState, useContext } from "react";
import classes from "./Signup.module.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
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
  const navStateData = useLocation();

  const mapFirebaseError = (errorCode) => {
    const errorMessages = {
      "auth/invalid-email": "Please enter a valid email address.",
      "auth/user-not-found": "No user found with this email.",
      "auth/wrong-password": "Incorrect password. Please try again.",
      "auth/email-already-in-use": "This email is already registered.",
      "auth/network-request-failed": "Network error. Please try again later.",
      "auth/weak-password": "Password should be at least 6 characters long.",
    };
    return errorMessages[errorCode] || "An unexpected error occurred.";
  };

  const validateForm = () => {
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    return true;
  };

  const authHandler = async (e) => {
    e.preventDefault();
    const action = e.target.name;

    if (!validateForm()) return;

    if (action === "signin") {
      setLoading((prev) => ({ ...prev, signIn: true }));
      try {
        const userInfo = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        navigate(navStateData?.state?.redirect || "/");
      } catch (err) {
        setError(mapFirebaseError(err.code));
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
        dispatch({
          type: Type.SET_USER,
          user: userInfo.user,
        });
        navigate(navStateData?.state?.redirect || "/");
      } catch (err) {
        setError(mapFirebaseError(err.code));
        console.error("Sign up error:", err);
      } finally {
        setLoading((prev) => ({ ...prev, signUp: false }));
      }
    }
  };

  return (
    <section className={classes.login}>
      <Link to="/">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/905px-Amazon_logo.svg.png"
          alt="Amazon Logo"
          className={classes.logo}
        />
      </Link>

      <div className={classes.login_container}>
        <h1>Sign In</h1>
        {navStateData?.state?.msg && (
          <small
            style={{
              padding: "5px",
              textAlign: "center",
              color: "red",
              fontWeight: "bold",
            }}
          >
            {navStateData.state.msg}
          </small>
        )}
        {error && <p className={classes.error}>{error}</p>}
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
        <p>
          By signing in, you agree to AMAZON FAKE CLONE's Conditions of Use &
          Sale. Please see our Privacy Notice.
        </p>
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
