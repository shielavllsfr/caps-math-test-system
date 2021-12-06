import { 
    Button,
    Grid,
    Box,
    Typography,
    Tabs,
    Tab,
    TextField,
    Snackbar,
    CircularProgress
 } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import { useState, forwardRef } from "react";
import Navigation from "../../component/Navigation";
import PropTypes from 'prop-types';
import { makeStyles } from "@mui/styles";
import firebase from "../../utils/firebase";



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
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }

  const useStyle = makeStyles(() => ({

    tabLabel:{
        fontSize: '20px !important',
        fontWeight: 'bold !important',
    },

    profileHover: {
        opacity: '0 !important'
    },

    fieldSize:{
        width: '85%',
        marginBottom: '2vh !important'
    },

    cyWidth:{
        width: '7%'
    },

  }))

export default function AdminSettings() {

    const classes = useStyle();

    const [value, setValue] = useState(0)
    
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    const [open, setOpen] = useState(false);

    
  const [snackMessage, setSnackMessage] = useState({
    type: '',
    message: ''
  })

  const handleSnack = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState({
    currentValue: '',
    currentError: false,
    currentMessage: '',
    newPassValue: '',
    newPassError: false,
    newPassMessage: '',
    confirmValue: '',
    confirmError: false,
    confirmMessage: '',
  })

  
  const passwordChanged = (e) => {
    const id = e.target.id
    if (id === 'current') {
      setPassword({
        ...password, 
        currentValue: e.target.value,
        currentError: false,
        currentMessage: ''
      })
    }else if (id === 'newPass'){

      if (e.target.value.length < 6) {
        setPassword({
          ...password, 
          newPassValue: e.target.value,
          newPassError: true,
          newPassMessage: 'password must be at least 6 characters',
          confirmError: true,
          confirmMessage: 'password must be at least 6 characters',
        })
      }else {
        setPassword({
          ...password, 
          newPassValue: e.target.value,
          newPassError: false,
          newPassMessage: '',
          confirmError: false,
          confirmMessage: '',
        })
      }
    }else if (id === 'confirm'){

      if (e.target.value.length < 6) {
        setPassword({
          ...password, 
          confirmValue: e.target.value,
          newPassError: true,
          newPassMessage: 'password must be at least 6 characters',
          confirmError: true,
          confirmMessage: 'password must be at least 6 characters',
        })
      }else {
        setPassword({
          ...password, 
          confirmValue: e.target.value,
          newPassError: false,
          newPassMessage: '',
          confirmError: false,
          confirmMessage: '',
        })
      }
    }
  }

  
  const submitChanges = () => {
    setLoading(true)
    firebase
    .firestore()
    .collection('admin')
    .doc('current-password')
    .get()
    .then((adminData) => {

        if (password.currentValue === adminData.data().password){
          if (password.newPassValue === password.confirmValue && !password.newPassError && !password.confirmError) {
            setPassword({
              ...password,
              newPassError: false,
              newPassMessage: '',
              confirmError: false,
              confirmMessage: ''
            })
            const credential = firebase.auth.EmailAuthProvider.credential('admin@bulsu.edu.ph', adminData.data().password)
            console.log(credential)
            firebase.auth().currentUser.reauthenticateWithCredential(credential).then(() => {
              firebase.auth().currentUser.updatePassword(password.newPassValue).then(() => {
                  firebase
                  .firestore()
                  .collection('admin')
                  .doc('current-password')
                  .set({ password: password.newPassValue })
                  .then(() => {
                    setSnackMessage({ type: 'success', message: 'Saved' })
                    handleSnack()
                    setLoading(false)
                  })
                  .catch((e) => {
                    setSnackMessage({ type: 'error', message: e.message })
                    handleSnack()
                    setLoading(false)
                  })
              }).catch((e) => {
                setSnackMessage({ type: 'error', message: e.message})
                handleSnack()
                setLoading(false)
              })
            }).catch((e) => {
              setSnackMessage({ type: 'error', message: e.message})
              handleSnack()
              setLoading(false)
            })
          }else if (password.newPassValue.length < 6 || password.confirmValue.length < 6){
            setPassword({
              ...password,
              newPassError: true,
              newPassMessage: 'password must be at least 6 characters',
              confirmError: true,
              confirmMessage: 'password must be at least 6 characters'
            })
            setLoading(false)
          }else {
            setPassword({
              ...password,
              newPassError: true,
              newPassMessage: 'New password does not match',
              confirmError: true,
              confirmMessage: 'New password does not match'
            })
            setLoading(false)
          }
        }else {
          setPassword({
            ...password,
            currentError: true,
            currentMessage: 'Wrong current password'
          })
          setLoading(false)
        }


    })

    }
  



    return(
        <Grid>
            <Navigation page='SETTINGS' admin={true}/>

            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: '100%', marginTop: '15vh' }}>

                <Tabs
                  orientation="vertical"
                  variant="scrollable"
                  value={value}
                  onChange={handleChange}
                  aria-label="Vertical tabs example"
                  sx={{ borderRight: 1, borderColor: 'divider', width: '30vh', height: '75vh', marginTop: '5vh' }}
                >
                  <Tab label="CHANGE PASSWORD" className={classes.tabLabel} {...a11yProps(0)} />
                </Tabs>
                <TabPanel value={value} index={0}>
                  <Grid style={{ display: 'flex', width: '160vh', height: '78vh', border: '1px solid black' }}>
                    <Grid style={{ width: 'inherit'  }}>
                        <Typography variant='h5' style={{ margin: '3vh 0vh', textAlign: 'center' }}><b>CHANGE PASSWORD</b></Typography>
                        <Grid style={{ marginLeft: '20vh', marginTop: '15vh' }}>
                          <Typography><b>Current Password</b></Typography>

                          <TextField 
                          className={classes.fieldSize} 
                          onChange={passwordChanged}
                          value={password.currentValue}
                          error={password.currentError}
                          helperText={password.currentMessage}
                          id='current'/>

                          <Typography><b>New Password</b></Typography>

                          <TextField 
                          className={classes.fieldSize} 
                          onChange={passwordChanged}
                          value={password.newPassValue}
                          error={password.newPassError}
                          helperText={password.newPassMessage}
                          id='newPass'/>

                          <Typography><b>Confirm New Password</b></Typography>

                          <TextField 
                          className={classes.fieldSize} 
                          onChange={passwordChanged}
                          value={password.confirmValue}
                          error={password.confirmError}
                          helperText={password.confirmMessage}
                          id='confirm'/>

                        </Grid>
                        <Grid style={{ display: 'flex', justifyContent: 'center' }}>
                          <Button variant='contained' color='success' id='password' onClick={submitChanges}>
                              {loading ? <CircularProgress color='secondary' size={20} sx={{ marginRight: '2vh' }}/> : null}
                              SUBMIT
                              </Button>
                        </Grid>
                    </Grid>
                  </Grid>
                </TabPanel>
            </Box>
            
        
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={snackMessage.type} sx={{ width: '100%' }}>
                {snackMessage.message}
              </Alert>
            </Snackbar>
        </Grid>
    )


}