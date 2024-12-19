import { useEffect, useContext } from "react";
import "./App.css";
import Routing from "./Routing.js";
import { DataContext } from "./Components/DataProvider/DataProvider.js";
import { auth } from "./Utility/firebase/firebase.js";
import { Type } from "./Utility/ActionType.js";

function App() {
  const [{ user }, dispatch] = useContext(DataContext);

  useEffect(() => {
    // Restore the user's state on refresh
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        dispatch({
          type: Type.SET_USER,
          user: authUser,
        });
      } else {
        dispatch({
          type: Type.SET_USER,
          user: null,
        });
      }
    });
    return () => unsubscribe();
  }, [dispatch]);

  return <Routing />;
}

export default App;
