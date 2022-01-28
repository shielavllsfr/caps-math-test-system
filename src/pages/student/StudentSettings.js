import {
  Button,
  Grid,
  Box,
  Typography,
  Tabs,
  Tab,
  Avatar,
  Link,
  TextField,
  MenuItem,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useEffect, useState, forwardRef } from "react";
import Navigation from "../../component/Navigation";
import PropTypes from "prop-types";
import { makeStyles } from "@mui/styles";
import firebase from "../../utils/firebase";

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

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyle = makeStyles(() => ({
  tabLabel: {
    fontSize: "20px !important",
    fontWeight: "bold !important",
  },

  profileHover: {
    opacity: "0 !important",
  },

  fieldSize: {
    width: "85%",
    marginBottom: "2vh !important",
  },

  cyWidth: {
    width: "7%",
  },
}));

export default function StudentSettings() {
  const classes = useStyle();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [open, setOpen] = useState(false);

  const [snackMessage, setSnackMessage] = useState({
    type: "",
    message: "",
  });

  const handleSnack = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const [userInfoValues, setUserInfo] = useState({
    avatarUrl: "",
    name: "",
    id: "",
    email: "",
    course: "",
    contact: "",
    address: "",
    year: "",
    avatarChanged: false,
    avatarFile: null,
  });

  const [password, setPassword] = useState({
    currentValue: "",
    currentError: false,
    currentMessage: "",
    newPassValue: "",
    newPassError: false,
    newPassMessage: "",
    confirmValue: "",
    confirmError: false,
    confirmMessage: "",
  });

  const [loading, setLoading] = useState(true);

  const handleCourse = (e) => {
    setUserInfo({ ...userInfoValues, course: e.target.value });
  };

  const handleYear = (e) => {
    setUserInfo({ ...userInfoValues, year: e.target.value });
  };

  useEffect(() => {
    const fetchUserInfo = () => {
      firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("userInfo")
        .doc("info")
        .get()
        .then((userData) => {
          const data = userData.data().userInfo;
          let contact = data.contact;
          let address = data.address;
          if (contact === undefined) contact = "";
          if (address === undefined) address = "";

          setUserInfo({
            ...userInfoValues,
            avatarUrl: data.avatarUrl,
            name: data.name,
            id: data.studentID,
            email: data.email,
            course: data.course,
            contact: contact,
            address: address,
            year: data.year,
          });
          setLoading(false);
        });
    };
    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddAndCont = (e) => {
    if (e.target.id === "contact") {
      setUserInfo({ ...userInfoValues, contact: e.target.value });
    } else if (e.target.id === "address") {
      setUserInfo({ ...userInfoValues, address: e.target.value });
    }
  };

  const submitChanges = (e) => {
    const id = e.target.id;

    firebase
      .firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection("userInfo")
      .doc("info")
      .get()
      .then((userData) => {
        const data = userData.data().userInfo;

        if (id === "profile") {
          let userInfo = {
            ...data,
            address: userInfoValues.address,
            contact: userInfoValues.contact,
            course: userInfoValues.course,
            year: userInfoValues.year,
          };

          if (userInfoValues.avatarChanged) {
            let storageRef = firebase.storage().ref();
            let uploadTask = storageRef
              .child("profiles/" + firebase.auth().currentUser.uid + " profile")
              .put(userInfoValues.avatarFile);

            uploadTask.on(
              firebase.storage.TaskEvent.STATE_CHANGED,
              (snapshot) => {
                console.log(
                  Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                  )
                );
              },
              (error) => {
                throw error;
              },
              () => {
                uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                  console.log(url);
                  setUserInfo({
                    ...userInfoValues,
                    avatarUrl: url,
                    avatarFile: null,
                    avatarChanged: false,
                  });
                  userInfo = {
                    ...userInfo,
                    avatarUrl: url,
                  };
                  firebase
                    .firestore()
                    .collection("users")
                    .doc(firebase.auth().currentUser.uid)
                    .collection("userInfo")
                    .doc("info")
                    .set({ userInfo })
                    .then(() => {
                      setSnackMessage({ type: "success", message: "Saved" });
                      handleSnack();
                    })
                    .catch((e) => {
                      setSnackMessage({
                        type: "error",
                        message:
                          "Something went wrong, check the console for more info",
                      });
                      handleSnack();
                      console.log(e);
                    });
                });
              }
            );
          } else {
            firebase
              .firestore()
              .collection("users")
              .doc(firebase.auth().currentUser.uid)
              .collection("userInfo")
              .doc("info")
              .set({ userInfo })
              .then(() => {
                setSnackMessage({ type: "success", message: "Saved" });
                handleSnack();
              })
              .catch((e) => {
                setSnackMessage({
                  type: "error",
                  message:
                    "Something went wrong, check the console for more info",
                });
                handleSnack();
                console.log(e);
              });
          }
        } else if (id === "password") {
          if (password.currentValue === userData.data().userInfo.password) {
            if (
              password.newPassValue === password.confirmValue &&
              !password.newPassError &&
              !password.confirmError
            ) {
              setPassword({
                ...password,
                newPassError: false,
                newPassMessage: "",
                confirmError: false,
                confirmMessage: "",
              });
              const credential = firebase.auth.EmailAuthProvider.credential(
                data.email,
                data.password
              );
              console.log(credential);
              firebase
                .auth()
                .currentUser.reauthenticateWithCredential(credential)
                .then(() => {
                  firebase
                    .auth()
                    .currentUser.updatePassword(password.newPassValue)
                    .then(() => {
                      const userInfo = {
                        ...data,
                        password: password.newPassValue,
                      };
                      firebase
                        .firestore()
                        .collection("users")
                        .doc(firebase.auth().currentUser.uid)
                        .collection("userInfo")
                        .doc("info")
                        .set({ userInfo })
                        .then(() => {
                          setSnackMessage({
                            type: "success",
                            message: "Saved",
                          });
                          handleSnack();
                        });
                    })
                    .catch((e) => {
                      setSnackMessage({ type: "error", message: e.message });
                      handleSnack();
                    });
                })
                .catch((e) => {
                  setSnackMessage({ type: "error", message: e.message });
                  handleSnack();
                });
            } else if (
              password.newPassValue.length < 6 ||
              password.confirmValue.length < 6
            ) {
              setPassword({
                ...password,
                newPassError: true,
                newPassMessage: "password must be at least 6 characters",
                confirmError: true,
                confirmMessage: "password must be at least 6 characters",
              });
            } else {
              setPassword({
                ...password,
                newPassError: true,
                newPassMessage: "New password does not match",
                confirmError: true,
                confirmMessage: "New password does not match",
              });
            }
          } else {
            setPassword({
              ...password,
              currentError: true,
              currentMessage: "Wrong current password",
            });
          }
        }
      });
  };

  const passwordChanged = (e) => {
    const id = e.target.id;
    if (id === "current") {
      setPassword({
        ...password,
        currentValue: e.target.value,
        currentError: false,
        currentMessage: "",
      });
    } else if (id === "newPass") {
      if (e.target.value.length < 6) {
        setPassword({
          ...password,
          newPassValue: e.target.value,
          newPassError: true,
          newPassMessage: "password must be at least 6 characters",
          confirmError: true,
          confirmMessage: "password must be at least 6 characters",
        });
      } else {
        setPassword({
          ...password,
          newPassValue: e.target.value,
          newPassError: false,
          newPassMessage: "",
          confirmError: false,
          confirmMessage: "",
        });
      }
    } else if (id === "confirm") {
      if (e.target.value.length < 6) {
        setPassword({
          ...password,
          confirmValue: e.target.value,
          newPassError: true,
          newPassMessage: "password must be at least 6 characters",
          confirmError: true,
          confirmMessage: "password must be at least 6 characters",
        });
      } else {
        setPassword({
          ...password,
          confirmValue: e.target.value,
          newPassError: false,
          newPassMessage: "",
          confirmError: false,
          confirmMessage: "",
        });
      }
    }
  };

  const displayAvatar = (e) => {
    if (e.target.files[0] !== undefined) {
      var file = e.target.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUserInfo({
          ...userInfoValues,
          avatarUrl: reader.result,
          avatarFile: e.target.files[0],
          avatarChanged: true,
        });
      };
      reader.onerror = function (error) {
        console.log("Error: ", error);
      };
    }
  };

  return (
    <Grid>
      <Navigation page="SETTINGS" admin={false} />

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100%",
          marginTop: "15vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            width: "30vh",
            height: "75vh",
            marginTop: "5vh",
          }}
        >
          <Tab
            label="EDIT PROFILE"
            className={classes.tabLabel}
            {...a11yProps(0)}
          />
          <Tab
            label="CHANGE PASSWORD"
            className={classes.tabLabel}
            {...a11yProps(1)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          {loading ? (
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "78vh",
                width: "150vh",
              }}
            >
              <CircularProgress color="success" size={200} />
            </Grid>
          ) : (
            <Grid
              style={{
                width: "160vh",
                height: "78vh",
                border: "1px solid black",
              }}
            >
              <Grid
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "3vh",
                }}
              >
                <Typography variant="h5">PERSONAL PROFILE</Typography>
              </Grid>

              <Grid
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: "5vh",
                  marginBottom: "5vh",
                }}
              >
                <Grid style={{ marginRight: "50vh" }}>
                  <Typography variant="h3">{userInfoValues.name}</Typography>
                  <Typography variant="h5">{userInfoValues.id}</Typography>
                  <Typography variant="h5">{userInfoValues.email}</Typography>
                </Grid>
                <Grid>
                  <Link
                    href="#"
                    variant="body2"
                    component="label"
                    className={classes.profileHover}
                  >
                    <Avatar
                      src={userInfoValues.avatarUrl}
                      style={{
                        height: "17vh",
                        width: "17vh",
                        border: "3px solid #2e2e2e",
                        marginRight: "3vh",
                      }}
                      onMouseOver={(e) => (e.target.style.cursor = "pointer")}
                    />
                    <input hidden type="file" onChange={displayAvatar}></input>
                  </Link>
                </Grid>
              </Grid>

              <Grid style={{ marginLeft: "20vh" }}>
                <Typography>
                  <b>Contact Number:</b>
                </Typography>
                <TextField
                  variant="outlined"
                  className={classes.fieldSize}
                  value={userInfoValues.contact}
                  id="contact"
                  onChange={handleAddAndCont}
                />
                <Typography>
                  <b>Address:</b>
                </Typography>
                <TextField
                  variant="outlined"
                  className={classes.fieldSize}
                  value={userInfoValues.address}
                  id="address"
                  onChange={handleAddAndCont}
                />

                <Grid className={classes.leftSide} sx={{ display: "flex" }}>
                  <Typography style={{ marginRight: "6.5vh" }}>
                    <b>Course:</b>
                  </Typography>
                  <Typography>
                    <b>Year:</b>
                  </Typography>
                </Grid>
                <Grid className={classes.leftSide} sx={{ display: "flex" }}>
                  <TextField
                    select
                    value={userInfoValues.course}
                    onChange={handleCourse}
                    className={classes.cyWidth}
                    style={{ marginRight: "3vh" }}
                  >
                    {course.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    value={userInfoValues.year}
                    onChange={handleYear}
                    className={classes.cyWidth}
                  >
                    {year.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
              </Grid>

              <Grid
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "3vh",
                }}
              >
                <Button
                  variant="contained"
                  color="success"
                  id="profile"
                  onClick={submitChanges}
                >
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Grid
            style={{
              display: "flex",
              width: "160vh",
              height: "78vh",
              border: "1px solid black",
            }}
          >
            <Grid style={{ width: "inherit" }}>
              <Typography
                variant="h5"
                style={{ margin: "3vh 0vh", textAlign: "center" }}
              >
                <b>CHANGE PASSWORD</b>
              </Typography>
              <Grid style={{ marginLeft: "20vh", marginTop: "15vh" }}>
                <Typography>
                  <b>Current Password</b>
                </Typography>

                <TextField
                  error={password.currentError}
                  helperText={password.currentMessage}
                  className={classes.fieldSize}
                  onChange={passwordChanged}
                  value={password.currentValue}
                  id="current"
                />

                <Typography>
                  <b>New Password</b>
                </Typography>

                <TextField
                  error={password.newPassError}
                  helperText={password.newPassMessage}
                  className={classes.fieldSize}
                  onChange={passwordChanged}
                  value={password.newPassValue}
                  id="newPass"
                />

                <Typography>
                  <b>Confirm New Password</b>
                </Typography>

                <TextField
                  error={password.confirmError}
                  helperText={password.confirmMessage}
                  className={classes.fieldSize}
                  onChange={passwordChanged}
                  value={password.confirmValue}
                  id="confirm"
                />
              </Grid>
              <Grid style={{ display: "flex", justifyContent: "center" }}>
                <Button
                  variant="contained"
                  color="success"
                  id="password"
                  onClick={submitChanges}
                >
                  SUBMIT
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </TabPanel>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snackMessage.type}
          sx={{ width: "100%" }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
