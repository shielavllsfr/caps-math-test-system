import React from "react";
import { Route } from "react-router-dom";

export default function PrivateRoute({
  component: Component,
  isAuth,
  isAdmin,
  user,
  ...rest
}) {
  return (
    <Route
      {...rest}
      component={(props) =>
        isAuth && isAdmin ? <Component {...props} user={user} /> : null
      }
    />
  );
}
