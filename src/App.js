import "./App.css";
import { useEffect, useState } from "react";
import firebase from "./utils/firebase";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import PrivateRoute from "./router/PrivateRoute";
import PublicRoute from "./router/PublicRoute";
import AdminRoute from "./router/AdminRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTest from "./pages/admin/AdminTest";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminRecords from "./pages/admin/AdminRecords";
import AdminRecordData from "./pages/admin/AdminRecordData";

import StudentHome from "./pages/student/StudentHome";
import Survey from "./pages/student/Survey";
import Test from "./pages/student/Test";
import TestResult from "./pages/student/TestResult";
import ReviewTest from "./pages/student/ReviewTest";
import StudentSettings from "./pages/student/StudentSettings";

function App() {
  const [values, setValues] = useState({
    isAuth: false,
    isAdmin: false,
    isLoading: true,
    user: null,
  });

  useEffect(() => {
    firebase.auth().onAuthStateChanged(function (signInUser) {
      if (signInUser) {
        let admin = false;
        if (signInUser.uid === "8XjaEXBOuATikvqtg2nJEy1UWWt1") admin = true;
        setValues({
          isAuth: true,
          user: signInUser,
          isLoading: false,
          isAdmin: admin,
        });
      } else {
        setValues({
          isAuth: false,
          user: signInUser,
          isLoading: false,
          isAdmin: false,
        });
      }
      console.log(signInUser);
    });
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/" exact>
          <Redirect to="/home" />
        </Route>

        <PublicRoute component={Home} path="/home" exact />

        <PublicRoute
          component={Login}
          path="/login"
          restricted={false}
          isAuth={values.isAuth}
          exact
        />

        <PublicRoute
          component={Register}
          path="/register"
          restricted={false}
          isAuth={values.isAuth}
          exact
        />

        <AdminRoute
          component={AdminDashboard}
          isAuth={values.isAuth}
          isAdmin={values.isAdmin}
          user={values.user}
          path="/admin-dashboard"
        />

        <AdminRoute
          component={AdminTest}
          isAuth={values.isAuth}
          isAdmin={values.isAdmin}
          user={values.user}
          path="/admin-test"
        />

        <AdminRoute
          component={AdminRecords}
          isAuth={values.isAuth}
          isAdmin={values.isAdmin}
          user={values.user}
          path="/admin-records"
        />

        <AdminRoute
          component={AdminRecordData}
          isAuth={values.isAuth}
          isAdmin={values.isAdmin}
          user={values.user}
          path="/admin-survey-record"
        />

        <AdminRoute
          component={AdminSettings}
          isAuth={values.isAuth}
          isAdmin={values.isAdmin}
          user={values.user}
          path="/admin-settings"
        />

        <PrivateRoute
          component={StudentHome}
          isAuth={values.isAuth}
          user={values.user}
          path="/std-home"
        />

        <PrivateRoute
          component={Survey}
          isAuth={values.isAuth}
          user={values.user}
          path="/test-survey"
        />

        <PrivateRoute
          component={Test}
          isAuth={values.isAuth}
          user={values.user}
          path="/test-test"
        />

        <PrivateRoute
          component={TestResult}
          isAuth={values.isAuth}
          user={values.user}
          path="/test-result"
        />

        <PrivateRoute
          component={ReviewTest}
          isAuth={values.isAuth}
          user={values.user}
          path="/review-test"
        />

        <PrivateRoute
          component={StudentSettings}
          isAuth={values.isAuth}
          user={values.user}
          path="/std-settings"
        />
      </Switch>
    </Router>
  );
}

export default App;
