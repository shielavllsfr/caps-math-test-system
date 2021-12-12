import {
  Button,
  Grid,
  Typography,
  TextField,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { makeStyles } from "@mui/styles";

import ImageImporter from "../resources/ImageImporter";
import firebase from "../utils/firebase";
import { useHistory } from "react-router-dom";

const course = [
  {
    value: "CITE",
    label: "CITE",
  },
  {
    value: "CBA",
    label: "CBA",
  },
  {
    value: "CoED",
    label: "CoED",
  },
  {
    value: "CIT",
    label: "CIT",
  },
];

const year = [
  {
    value: "1st",
    label: "1st",
  },
  {
    value: "2nd",
    label: "2nd",
  },
  {
    value: "3rd",
    label: "3rd",
  },
  {
    value: "4th",
    label: "4th",
  },
];

const useStyle = makeStyles(() => ({
  root: {
    display: "flex",
  },

  imgPos: {
    marginTop: "5vh",
    marginLeft: "11vh",
  },

  border: {
    borderStyle: "solid",
    borderWidth: "5px",
    borderRadius: "50px",
    height: "85vh",
    width: "75vh",
    textAlign: "center",
  },

  borderPos: {
    marginTop: "7vh",
    marginLeft: "17vh",
  },

  flex: {
    display: "flex",
  },

  leftSide: {
    textAlign: "left",
    paddingLeft: "5%",
  },

  enpWidth: {
    width: "90%",
  },

  cyWidth: {
    width: "20%",
  },

  button: {
    width: "20vh",
    height: "5vh",
  },
}));

export default function Register() {
  const classes = useStyle();
  const history = useHistory();

  const [passStat, setPassStat] = useState({
    error: false,
    message: "",
  });

  const [emailState, setEmailState] = useState({
    error: false,
    message: "",
  });

  const [nameState, setNameState] = useState({
    error: false,
    message: "",
  });

  const [stdState, setStdState] = useState({
    error: false,
    message: "",
  });

  const [courseState, setCourseState] = useState({
    error: false,
    message: "",
  });

  const [yearState, setYearState] = useState({
    error: false,
    message: "",
  });

  const [cPass, setCPass] = useState("");

  const [registerState, setRegisterState] = useState({
    disabled: true,
    registering: false,
  });

  const [userInfo, setInfo] = useState({
    email: "",
    name: "",
    studentID: "",
    course: "",
    year: "",
    password: "",
    termsAgree: false,
    avatarUrl: "",
  });

  const handleCourse = (e) => {
    setInfo({ ...userInfo, course: e.target.value });
    setCourseState({ error: false, message: "" });
  };

  const handleYear = (e) => {
    setInfo({ ...userInfo, year: e.target.value });
    setYearState({ error: false, message: "" });
  };

  const handleTerms = (e) => {
    setInfo({ ...userInfo, termsAgree: e.target.checked });
    if (e.target.checked) {
      setRegisterState({ ...registerState, disabled: false });
    } else {
      setRegisterState({ ...registerState, disabled: true });
    }
  };

  const handleOtherInfo = (e) => {
    const inputID = e.target.id;

    if (inputID === "email") {
      setInfo({ ...userInfo, email: e.target.value });
      setEmailState({
        error: true,
        message: "Email must end with @bulsu.edu.ph",
      });

      if (e.target.value.endsWith("@bulsu.edu.ph")) {
        setEmailState({ error: false, message: "" });
      }
    } else if (inputID === "name") {
      setInfo({ ...userInfo, name: e.target.value });
      setNameState({ error: false, message: "" });
    } else if (inputID === "stdID") {
      setInfo({ ...userInfo, studentID: e.target.value });
      setStdState({ error: false, message: "" });
    } else if (inputID === "password") {
      setInfo({ ...userInfo, password: e.target.value });
      if (e.target.value === cPass) setPassStat({ error: false, message: "" });
      else setPassStat({ error: true, message: "Password does not match" });

      if (e.target.value.length < 6)
        setPassStat({
          error: true,
          message: "password must be at least 6 characters",
        });
      else setPassStat({ error: false, message: "" });
    }
  };

  const checkPass = (e) => {
    if (
      userInfo.password === e.target.value ||
      (userInfo.password === "" && e.target.value === "")
    )
      setPassStat({ error: false, message: "" });
    else setPassStat({ error: true, message: "Password does not match" });
    setCPass(e.target.value);
  };

  const register = (e) => {
    const emptyFieldMessage = "Please don't leave any field empty";
    let validated = 6;

    if (userInfo.email === "") {
      setEmailState({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (userInfo.name === "") {
      setNameState({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (userInfo.studentID === "") {
      setStdState({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (userInfo.course === "") {
      setCourseState({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (userInfo.year === "") {
      setYearState({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (userInfo.password === "") {
      setPassStat({ error: true, message: emptyFieldMessage });
      validated--;
    }

    if (validated === 6) {
      setRegisterState({ ...registerState, registering: true });
      firebase
        .auth()
        .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
        .then((userCredential) => {
          const user = userCredential.user;
          console.log("acc created");

          firebase
            .firestore()
            .collection("users")
            .doc(user.uid)
            .set({ exists: true })
            .then(() => {
              console.log("doc created");
              firebase
                .firestore()
                .collection("users")
                .doc(user.uid)
                .collection("userInfo")
                .doc("info")
                .set({ userInfo })
                .then(() => {
                  console.log("registered");
                  firebase.auth().signOut();
                  history.push("/login");
                });
            });
        })
        .catch((e) => {
          setEmailState({ error: true, message: e.message });
          setRegisterState({ ...registerState, registering: false });
        });
    }
  };

  return (
    <Grid className={classes.root}>
      <Grid>
        <img
          src={ImageImporter.register_img1}
          className={classes.imgPos}
          alt="register_img1"
        />
      </Grid>

      <Grid className={classes.borderPos}>
        <Grid className={classes.border}>
          <Typography variant="h4" style={{ margin: "3vh" }}>
            REGISTRATION FORM
          </Typography>

          <Typography variant="h5" className={classes.leftSide}>
            BulSU E-mail
          </Typography>
          <TextField
            error={emailState.error}
            helperText={emailState.message}
            onChange={handleOtherInfo}
            variant="outlined"
            type="email"
            id="email"
            className={classes.enpWidth}
          />

          <Typography
            variant="h5"
            className={classes.leftSide}
            sx={{ marginTop: "2.5vh" }}
          >
            Name
          </Typography>
          <TextField
            error={nameState.error}
            helperText={nameState.message}
            variant="outlined"
            id="name"
            onChange={handleOtherInfo}
            className={classes.enpWidth}
          />

          <Grid
            className={classes.leftSide}
            sx={{ display: "flex", marginTop: "2.5vh" }}
          >
            <Typography variant="h5">Student ID</Typography>
            <Typography variant="h5" sx={{ marginLeft: "20vh" }}>
              Course
            </Typography>
            <Typography variant="h5" sx={{ marginLeft: "12vh" }}>
              Year
            </Typography>
          </Grid>
          <Grid className={classes.leftSide} sx={{ display: "flex" }}>
            <TextField
              error={stdState.error}
              helperText={stdState.message}
              variant="outlined"
              id="stdID"
              onChange={handleOtherInfo}
            />
            <TextField
              select
              error={courseState.error}
              helperText={courseState.message}
              value={userInfo.course}
              onChange={handleCourse}
              className={classes.cyWidth}
              sx={{ marginLeft: "8vh" }}
            >
              {course.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              error={yearState.error}
              helperText={yearState.message}
              value={userInfo.year}
              onChange={handleYear}
              className={classes.cyWidth}
              sx={{ marginLeft: "6.5vh" }}
            >
              {year.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Typography
            variant="h5"
            className={classes.leftSide}
            sx={{ marginTop: "2.5vh" }}
          >
            Password
          </Typography>
          <TextField
            error={passStat.error}
            helperText={passStat.message}
            onChange={handleOtherInfo}
            variant="outlined"
            type="password"
            id="password"
            className={classes.enpWidth}
          />

          <Typography
            variant="h5"
            className={classes.leftSide}
            sx={{ marginTop: "2.5vh" }}
          >
            Confirm Password
          </Typography>
          <TextField
            error={passStat.error}
            helperText={passStat.message}
            onChange={checkPass}
            variant="outlined"
            type="password"
            id="confirmPass"
            className={classes.enpWidth}
          />

          <FormGroup className={classes.leftSide}>
            <FormControlLabel
              control={<Checkbox onClick={handleTerms} />}
              label="I agree that all information above is true and accurate."
            />
          </FormGroup>
          <Button
            disabled={registerState.disabled}
            onClick={register}
            variant="contained"
            component={Link}
            to="/login"
            className={classes.button}
            sx={{ marginTop: "2.5vh" }}
          >
            {registerState.registering ? (
              <CircularProgress
                color="secondary"
                size={20}
                sx={{ marginRight: "2vh" }}
              />
            ) : null}
            REGISTER
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
