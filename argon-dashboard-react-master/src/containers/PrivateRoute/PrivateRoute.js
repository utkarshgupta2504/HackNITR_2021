import React from "react";
import { Redirect, Route } from "react-router-dom";

// Utils
import auth from "../../utils/auth";

const PrivateRoute = ({
  component: Component,
  redirectPath: redirectPath,
  ...rest
}) => (
  <Route
    {...rest}
    render={(props) => {
      // console.log(auth);
      // sessionStorage.setItem("test", "value");
      // console.log(sessionStorage);
      // console.log(localStorage);
      return auth.getToken() !== null ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: redirectPath,
            state: { from: props.location },
          }}
        />
      );
    }}
  />
);

export default PrivateRoute;
