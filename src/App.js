import "./App.css";
import { Map } from "./components/Map";
import { Error } from "./components/Error";
import { Fragment, useContext } from "react";
import { authContext } from "./contexts/auth";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const { auth } = useContext(authContext);

  return (
    <Fragment>
      {/* <div className="App">{auth === true ? <Map /> : <Error />}</div> */}
      <div className="App">
        <Map />
      </div>
    </Fragment>
  );
}

export default App;
