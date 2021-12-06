import { 
    Button,
    Grid,
    Typography,
    FormControlLabel,
    Radio,
    Container,
    Snackbar,
    FormControl,
    RadioGroup
 } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Navigation from "../../component/Navigation";
import { makeStyles } from "@mui/styles";
import ImageImporter from "../../resources/ImageImporter";
import { useEffect, useState, forwardRef } from "react";
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
  
  

export default function Test() {

    const classes = useStyle();
    
    const history = useHistory();

    const [open, setOpen] = useState(false);

    const [snackMessage, setSnackMessage] = useState({
        type: '',
        message: ''
    })

    const [questions, setQuestion] = useState({
        questions: [],
        answers: [],
    });

    const [responded, setResponded] = useState(false)

    const handleSnack = () => {
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      setOpen(false);
    };
    
    let answers = [];

    useEffect(() => {
        const retrieveQuestionData = () => {
            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('test-status')
            .doc('response-status')
            .get()
            .then((responseData) => {
                if (responseData.data() === undefined) {
                    fetchTestInfo()
                }else if (!responseData.data().responded) {
                    setResponded(responseData.data().responded)
                    fetchTestInfo()
                }
            })

        }
        retrieveQuestionData();
    }, [])

    const fetchTestInfo = () => {
        let newQuestionData = [];
        let count = 1;
        firebase
        .firestore()
        .collection('test')
        .doc('question-data')
        .get()
        .then((questionData) => {
            let index = 0;
            questionData.data().question.forEach((question) => {
                newQuestionData[index] = {
                    question: question,
                    questionCount: count,
                    a : questionData.data().a[index],
                    b : questionData.data().b[index],
                    c : questionData.data().c[index],
                    d : questionData.data().d[index],
                }
                answers.push(' ');
                count++;
                index++;
            })
            setQuestion({ questions: newQuestionData, answers: answers})
            console.log(questions)
        }).catch((e) => {
            setSnackMessage({ type: 'error', message: 'Something went wrong trying to load the test, please notify the admin' });
            handleSnack()
        })
    }


    const selectAnswer = (e) => {
        answers = questions.answers;
        answers[e.target.id - 1] = e.target.value
        setQuestion({...questions, answers: answers});
    }

    const checkAnswers = (e) => {
        console.log('checking answers')
        localStorage.setItem('user-answers', questions.answers)
        history.push('/test-result')
    }

    if (responded) {
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
                    <Button className={classes.view} id='survey' variant='text' disabled>MATH TEST</Button>
                    <Grid style={{ border: '1px solid black', height: '58vh', margin: '2vh 30vh', overflow: 'auto'}}>
                        <Typography variant='h3' style={{ textAlign: 'left', margin: '5vh' }}>Solve the Following</Typography>
                        {questions.questions.map((data) => (
                            <Container style={{ margin: '3vh 8vh', textAlign: 'left' }} key={data.questionCount}>
                                <Typography variant='h6'>
                                    {data.questionCount}. {data.question}
                                </Typography>

                                <FormControl component="fieldset">
                                    <RadioGroup
                                      row
                                      aria-label="user-answer"
                                      name="controlled-radio-buttons-group"
                                      onChange={selectAnswer}
                                    >
                                    <FormControlLabel value="a" control={<Radio  id={data.questionCount + ''}/>} style={{ marginRight: '5vh' }} label={data.a} />
                                    <FormControlLabel value="b" control={<Radio  id={data.questionCount + ''}/>} style={{ marginRight: '5vh' }} label={data.b} />
                                    <FormControlLabel value="c" control={<Radio  id={data.questionCount + ''}/>} style={{ marginRight: '5vh' }} label={data.c} />
                                    <FormControlLabel value="d" control={<Radio  id={data.questionCount + ''}/>} style={{ marginRight: '5vh' }} label={data.d} />
                                  </RadioGroup>
                                </FormControl>
                            </Container> 
                        ))}
                    </Grid>
                        <Grid style={{display: 'flex', justifyContent: 'right' }}>
                            <Button variant='contained' color='success' onClick={checkAnswers} style={{ margin: '2vh 30vh', height: '5vh', width: '20vh', fontSize: '30px', borderRadius: '15px' }}>Submit</Button>
                        </Grid>
                    
                </Grid>
            <Grid>

            </Grid>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={snackMessage.type} sx={{ width: '100%' }}>
                {snackMessage.message}
              </Alert>
            </Snackbar>

        </Grid>
    );
}



