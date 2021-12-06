import React from "react";
import { Route, Redirect } from "react-router-dom";

export default function PublicRoute({
  component: Component,
  isAuth,
  restricted,
  ...rest
}) {
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuth && restricted ? (
          <Redirect to="/home" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
}
