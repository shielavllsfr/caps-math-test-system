import { 
    Button,
    Grid,
    Typography,
    FormControlLabel,
    Radio,
    Container,
    TableContainer,
    Table,
    Paper,
    TableHead,
    TableBody,
    TableCell,
    TableRow,
    Snackbar
 } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Navigation from "../../component/Navigation";
import { makeStyles } from "@mui/styles";
import ImageImporter from "../../resources/ImageImporter";
import { useEffect, useRef, useState, forwardRef } from "react";
import firebase from '../../utils/firebase';
import { useHistory } from "react-router-dom";

const useStyle = makeStyles(({

    view:{
        backgroundImage: `url(${ImageImporter.test_btn})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '10vh',
        width: '25vh',
        color: 'black !important',
        fontSize: '30px !important'
    },

}));

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  
  

export default function Survey() {

    const [open, setOpen] = useState(false);

    const history = useHistory();

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
    
    const classes = useStyle();

    const container = useRef();

    const [survey, setSurvey] = useState({
        questions: [],
        response: [],
        prevResponse: [],
        responseValue: [],
        responded: false
    });

    let survQuestions = [];
    let responses = [];
    let prevResponse = [];
    let responseValue = [];

    useEffect(() => {
        const initSurvey = () => {

          firebase
          .firestore()
          .collection('users')
          .doc(firebase.auth().currentUser.uid)
          .collection('test-status')
          .doc('response-status')
          .get()
          .then((responseData) => {
            console.log(responseData.data())

            if (responseData.data() === undefined) {
              fetchSurveyInfo()
            }else if(!responseData.data().responded){
              setSurvey({...survey, responded: responseData.data().responded})
              fetchSurveyInfo()
            }
            

          })
        }
        initSurvey();
    }, [])

    const fetchSurveyInfo = () => {
      firebase
      .firestore()
      .collection('survey')
      .doc('questions')
      .get()
      .then((questions) => {
        if (questions.data() !== undefined) {
          questions.data().fieldValue.forEach((question) => {
              survQuestions.push(question);
              responses.push(null);
              prevResponse.push(null);
              responseValue.push('');
          })
          setSurvey({ 
            ...survey,
              questions: survQuestions,
              response: responses,
              prevResponse: prevResponse,
              responseValue: responseValue
           })
        }else {
          setSnackMessage({type: 'error', message: 'There are currently no survey'})
          handleSnack()
        }
      })
    }

    const radioChanged = (e) => {
        responses = survey.response;
        prevResponse = survey.prevResponse;
        survQuestions = survey.questions;
        responseValue = survey.responseValue;
        const questionRoot = e.target.parentElement.parentElement.parentElement.parentElement;
        const index = survQuestions.indexOf(questionRoot.id)
        if (responses[index] == null) {
            responses[index] = e.target;
            prevResponse[index] = e.target;
        }else{
            if (responses[index] !== e.target) {
                prevResponse[index] = responses[index]
                responses[index] = e.target
                prevResponse[index].checked = false;
                prevResponse[index].parentElement.setAttribute('class', 'MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root css-vqmohf-MuiButtonBase-root-MuiRadio-root');
                prevResponse[index].parentElement.children[1].lastChild.setAttribute('class', 'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1hhw7if-MuiSvgIcon-root');
                responses[index].checked = true;
                responses[index].parentElement.setAttribute('class', 'MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root Mui-checked css-vqmohf-MuiButtonBase-root-MuiRadio-root');
                responses[index].parentElement.children[1].lastChild.setAttribute('class', 'MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-11zohuh-MuiSvgIcon-root');
            }
        }
        responseValue[index] = e.target.value;
        setSurvey({...survey, response: responses, prevResponse: prevResponse, responseValue: responseValue })
    }

    const nextClicked = () => {
        responses = survey.response;
        responseValue = survey.responseValue;
        let notEmpty = responses.length;
        for (let i = 0; i < responses.length; i++) {
            if (responses[i] === null) {
                notEmpty--;
            }
        }

        if (notEmpty === responses.length) {
          localStorage.setItem('survey-respond', responseValue)
          history.push('/test-test')
        }else {
            setSnackMessage({ type: 'error', message: 'Please don\'t leave any question empty' });
            handleSnack();
        }
    }

    if (survey.responded) {
      return(
        <Grid style={{ marginTop: '15vh' }}>
          <Navigation page='TEST' admin={false}/>
                <Grid style={{ textAlign: 'center' }}>
                    <Button className={classes.view} id='survey' variant='text' disabled>SURVEY</Button>
                    <Grid style={{ border: '1px solid black', height: '68vh', margin: '2vh 30vh', overflow: 'auto'}}>
                        <Typography variant='h5' style={{ textAlign: 'left', margin: '5vh' }}>You've already responded to the survey and test. You can go the the "RESULT" section to see your test result again</Typography>
                        
                    </Grid>
            </Grid>
        </Grid>
      )    
    }

    return(
        <Grid style={{ marginTop: '15vh' }}>
            <Navigation page='TEST' admin={false}/>
                <Grid style={{ textAlign: 'center' }}>
                    <Button className={classes.view} id='survey' variant='text' disabled>SURVEY</Button>
                    <Grid style={{ border: '1px solid black', height: '68vh', margin: '2vh 30vh', overflow: 'auto'}}>
                        <Typography variant='h5' style={{ textAlign: 'left', margin: '5vh' }}>Below is the list of statements that measires your attitude towards Mathematics. Please indicate how strongly you agree or disagree with each statement.</Typography>
                        <Container style={{ justifyContent: 'left', margin: '3vh 8vh' }} ref={container}>
                        
                            <TableContainer component={Paper}>
                              <Table aria-label="simple table">
                                <TableHead>
                                  <TableRow>
                                    <TableCell></TableCell>
                                    <TableCell align="right">Strongly Agree</TableCell>
                                    <TableCell align="right">Agree</TableCell>
                                    <TableCell align="right">Disagree</TableCell>
                                    <TableCell align="right">Strongly Disagree</TableCell>
                                  </TableRow>
                                </TableHead>
                                <TableBody>
                                  {survey.questions.map((question) => (
                                    <TableRow
                                      key={question}
                                      id={question}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {question}
                                      </TableCell>
                                        <TableCell align="right">
                                          <FormControlLabel value="Strongly Agree" onClick={radioChanged} control={<Radio />} label=''/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControlLabel value="Agree" onClick={radioChanged} control={<Radio />} label='' />
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControlLabel value="Disagree" onClick={radioChanged} control={<Radio />} label=''/>
                                        </TableCell>
                                        <TableCell align="right">
                                            <FormControlLabel value="Strongly Disagree" onClick={radioChanged} control={<Radio />} label=''/>
                                        </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </TableContainer>
                        </Container>
                    </Grid>
                        <Grid style={{display: 'flex', justifyContent: 'right' }}>
                            <Button variant='contained' color='success' onClick={nextClicked} style={{ margin: '2vh 30vh', height: '5vh', width: '20vh', fontSize: '30px', borderRadius: '15px' }}>Next</Button>
                        </Grid>
                    
                </Grid>
            <Grid>

            </Grid>
            <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={snackMessage.type} sx={{ width: '100%' }}>
                {snackMessage.message}
              </Alert>
            </Snackbar>

        </Grid>
    );
}



