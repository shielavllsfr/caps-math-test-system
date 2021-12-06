import React from "react";
import { Route } from "react-router-dom";

export default function PrivateRoute({
  component: Component,
  isAuth,
  user,
  ...rest
}) {
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuth ? <Component {...props} user={user} /> : null
      }
    />
  );
}
