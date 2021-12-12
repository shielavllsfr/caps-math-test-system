import {
  Button,
  Grid,
  TextField,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  CircularProgress,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";

import ImageImporter from "../resources/ImageImporter";
import firebase from "../utils/firebase";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
  },

  loading: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  flex: {
    display: "flex",
  },

  img: {
    height: "98vh",
    width: "90vh",
    marginLeft: "10vh",
  },

  border: {
    borderStyle: "solid",
    borderWidth: "5px",
    borderRadius: "50px",
    height: "73vh",
    width: "75vh",
    textAlign: "center",
  },

  center: {
    textAlign: "center",
  },

  leftText: {
    textAlign: "left",
    paddingLeft: "7.5%",
  },

  fieldSize: {
    width: "85%",
  },

  borderPos: {
    marginTop: "10vh",
    marginLeft: "10vh",
  },

  button: {
    width: "20vh",
    height: "5vh",
  },
}));

export default function Login() {
  const classes = useStyles();

  const history = useHistory();

  const [emailState, setEmailState] = useState({
    error: false,
    message: "",
  });

  const [passState, setPassState] = useState({
    error: false,
    message: "",
  });

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
    signing: false,
    disabled: false,
    admin: false,
    remember: false,
  });

  const [rememberState, setRememberState] = useState({ loading: true });

  useEffect(() => {
    const checkRememberState = () => {
      if (localStorage.getItem("uid") !== "") {
        firebase
          .firestore()
          .collection("users")
          .doc(localStorage.getItem("uid"))
          .get()
          .then((user) => {
            if (user.data().rememberCredential) {
              firebase
                .auth()
                .signInWithEmailAndPassword(
                  localStorage.getItem("email"),
                  localStorage.getItem("pass")
                )
                .then(() => {
                  history.push("/std-home");
                });
            }
          });
      } else {
        setRememberState({ loading: false });
      }
    };
    checkRememberState();
  }, [history]);

  const inputChanged = (e) => {
    if (e.target.id === "email") {
      setLoginInfo({ ...loginInfo, email: e.target.value });
      setEmailState({
        error: true,
        message: "Email must ends with @bulsu.edu.ph",
      });
      if (e.target.value.endsWith("@bulsu.edu.ph" || e.target.value === "")) {
        setEmailState({ error: false, message: "" });
      }
    } else if (e.target.id === "password") {
      setLoginInfo({ ...loginInfo, password: e.target.value });
      if (e.target.value.length < 6) {
        setPassState({
          error: true,
          message: "Password must be at least 6 characters",
        });
      } else {
        setPassState({ error: false, message: "" });
      }
    }
  };

  const login = (e) => {
    setLoginInfo({ ...loginInfo, signing: true });
    if (loginInfo.email === "admin@bulsu.edu.ph") {
      firebase
        .auth()
        .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
        .then(() => {
          history.push("/admin-dashboard");
        });
    } else {
      console.log("student");
      firebase
        .auth()
        .signInWithEmailAndPassword(loginInfo.email, loginInfo.password)
        .then((user) => {
          const uid = firebase.auth().currentUser.uid;
          if (loginInfo.remember) {
            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .set({ rememberCredential: true })
              .then(() => {
                localStorage.setItem("email", loginInfo.email);
                localStorage.setItem("pass", loginInfo.password);
                localStorage.setItem("uid", uid);
              })
              .catch((e) => {
                console.log(e);
              });
          } else {
            firebase
              .firestore()
              .collection("users")
              .doc(uid)
              .set({ rememberCredential: false })
              .then(() => {
                localStorage.setItem("email", "");
                localStorage.setItem("pass", "");
                localStorage.setItem("uid", "");
              })
              .catch((e) => {
                console.log(e);
              });
          }
          console.log(user);
          history.push("/std-home");
          setLoginInfo({ ...loginInfo, signing: false });
        })
        .catch((e) => {
          console.log(e.message);
          setLoginInfo({ ...loginInfo, signing: false });
          if (e.message.includes("identifier")) {
            setEmailState({ error: true, message: "Email cannot be found" });
          } else if (e.message.includes("password")) {
            setPassState({ error: true, message: "Wrong password" });
          }
        });
    }
  };

  const rememberUser = (e) => {
    setLoginInfo({ ...loginInfo, remember: e.target.checked });
  };

  if (rememberState.loading) {
    return (
      <Grid className={classes.loading}>
        <CircularProgress color="success" size={150} />
      </Grid>
    );
  }
  return (
    <Grid className={classes.root}>
      <Grid>
        <img
          className={classes.img}
          src={ImageImporter.login_img1}
          alt="login_img1"
        />
      </Grid>
      <Grid className={classes.borderPos}>
        <Grid className={classes.border}>
          <Typography variant="h2" style={{ margin: "3vh" }}>
            LOGIN
          </Typography>

          <Typography variant="h5" className={classes.leftText}>
            <b>Email Address</b>
          </Typography>

          <TextField
            error={emailState.error}
            helperText={emailState.message}
            onChange={inputChanged}
            type="email"
            id="email"
            variant="outlined"
            className={classes.fieldSize}
          />

          <Typography
            variant="h5"
            style={{ marginTop: "3vh" }}
            className={classes.leftText}
          >
            <b>Password</b>
          </Typography>

          <TextField
            error={passState.error}
            helperText={passState.message}
            onChange={inputChanged}
            id="password"
            type="password"
            variant="outlined"
            className={classes.fieldSize}
          />

          <Grid
            sx={{ display: "flex", alignItems: "center", marginTop: "1vh" }}
          >
            <FormGroup className={classes.leftText}>
              <FormControlLabel
                control={<Checkbox onClick={rememberUser} />}
                label="Remember me"
              />
            </FormGroup>
          </Grid>
          <Grid className={classes.center} style={{ marginTop: "10vh" }}>
            <Button
              disabled={loginInfo.disabled}
              variant="contained"
              className={classes.button}
              onClick={login}
            >
              {loginInfo.signing ? (
                <CircularProgress
                  color="secondary"
                  size={20}
                  sx={{ marginRight: "2vh" }}
                />
              ) : null}
              LOGIN
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
