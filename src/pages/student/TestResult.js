import { 
    Button,
    Grid,
    Typography,
    Snackbar,
    Box,
    CircularProgress,
    Avatar,
    Container
 } from "@mui/material";
import MuiAlert from '@mui/material/Alert';
import Navigation from "../../component/Navigation";
import { makeStyles } from "@mui/styles";
import ImageImporter from "../../resources/ImageImporter";
import { useEffect, useState, forwardRef, useRef } from "react";
import firebase from '../../utils/firebase';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import Pdf from 'react-to-pdf';
import reactDom from 'react-dom';

const useStyle = makeStyles(({

    view:{
        backgroundImage: `url(${ImageImporter.test_btn})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        height: '10vh',
        width: '25vh',
        color: 'black !important',
        fontSize: '30px !important',
    },

    buttons:{
        height: '4vh',
        fontSize: '2vh !important',
        fontWeight: 'bold !important',
        borderRadius: '10px !important',
        margin: '1vh !important'
    },

    paraMargin:{
        margin: '3vh !important'
    },

    recoMargin:{
        margin: '0vh 3vh !important'
    }

}));

const Alert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  function CircularProgressWithLabel(props) {
    return (
      <Box sx={{ position: 'relative', display: 'inline-flex'}}>
        <CircularProgress variant="determinate" thickness={6} {...props} />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography variant="caption" component="div" color="text.secondary" sx={{ fontSize: '3vh' }} >
            {`${Math.round(props.value)}%`}
          </Typography>
        </Box>
      </Box>
    );
  }
  
  CircularProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate variant.
     * Value between 0 and 100.
     * @default 0
     */
    value: PropTypes.number.isRequired,
  };
  
  

export default function Test() {

    const classes = useStyle();

    const [open, setOpen] = useState(false);

    const ref = useRef();
    const recommendationContainer = useRef();
    

    const [snackMessage, setSnackMessage] = useState({
        type: '',
        message: ''
    })

    const [stdInfo, setStdInfo] = useState({
        id: '',
        name: '',
        course: '',
        year: '',
        avatarUrl: ""
    });

    const [testRes, setTestRes] = useState({
        score: '0',
        totalItems: '0',
        percentage: 0,
        sufficient: false
    });

    const [disableBtn, setDisableBtn] = useState(true)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const generatePageData = () => {
            let userAnswers = localStorage.getItem('user-answers').trim().split(',')  
            
            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('userInfo')
            .doc('info')
            .get()
            .then((userInfo) => {
                const data = userInfo.data().userInfo
             
                setStdInfo({ 
                    id: data.studentID,
                    name: data.name,
                    course: data.course,
                    year: data.year,
                    avatarUrl: data.avatarUrl.replace('https://firebasestorage.googleapis.com', '')
                 })
            })
            .catch((e) => {
                setSnackMessage({ type: 'error', message: 'Error: ' + e.message });
                handleSnack();
            }); 

            if (localStorage.getItem('user-answers') !== '' && localStorage.getItem('survey-respond') !== '') {
                firebase
                .firestore()
                .collection('test')
                .doc('question-data')
                .get()
                .then((questionData) => {
                    let correctAnswers = 0
                    let index = 0;
                    questionData.data().correctAnswer.forEach((correctAns) => {
                        if (userAnswers[index] === correctAns) {
                            correctAnswers++;
                        }
                        index++;
                    })
                    setTestRes({ 
                        score: correctAnswers + '', 
                        totalItems: questionData.data().correctAnswer.length,
                        percentage: (correctAnswers/questionData.data().correctAnswer.length) * 100,
                        sufficient: checkSufficientPercentage((correctAnswers/questionData.data().correctAnswer.length) * 100)
                    })
                
                    if (localStorage.getItem('survey-respond') !== '') {
                        firebase
                        .firestore()
                        .collection('survey')
                        .doc('responses')
                        .collection('user-responses')
                        .add({
                            from: firebase.auth().currentUser.uid,
                            response: localStorage.getItem('survey-respond').split(',')
                        }).then(() => {
                            localStorage.setItem('survey-respond', '');
                            console.log('survey-respond cleared')

                            if (localStorage.getItem('user-answers') !== '') {
                                console.log('dhdgb')
                                firebase
                                .firestore()
                                .collection('users')
                                .doc(firebase.auth().currentUser.uid)
                                .collection('userInfo')
                                .doc('info')
                                .get()
                                .then((userInfo) => {
                                    firebase
                                    .firestore()
                                    .collection('test')
                                    .doc('test-responds')
                                    .collection('user-responses')
                                    .add({
                                        from: firebase.auth().currentUser.uid,
                                        answers: localStorage.getItem('user-answers'),
                                        score: correctAnswers + '',
                                        totalItems: questionData.data().correctAnswer.length,
                                        percentage: (correctAnswers/questionData.data().correctAnswer.length) * 100,
                                        passed: (((correctAnswers/questionData.data().correctAnswer.length) * 100) >= 50),
                                        userYear: userInfo.data().userInfo.year,
                                        userCourse: userInfo.data().userInfo.course
                                    })
                                    .then((test) => {
                                        console.log('gj,nvnb')
                                        localStorage.setItem('user-answers', '');
                                        console.log('user-answers cleared')
                                        console.log(test.id)

                                        firebase
                                        .firestore()
                                        .collection('users')
                                        .doc(firebase.auth().currentUser.uid)
                                        .collection('test-status')
                                        .doc('response-status')
                                        .set({ 
                                            responded: true,
                                            testResponseId: test.id
                                         })
                                        .then(() => {
                                            console.log('updated response status')
                                            const recommendationsCollection = firebase.firestore().collection('recommendations');
                                            let count = 1;
                                            let tempReco = [];

                                            if (((correctAnswers/questionData.data().correctAnswer.length) * 100) > 50) {
                                                recommendationsCollection
                                                .doc('sufficient')
                                                .get()
                                                .then((suffiData) => {
                                                    suffiData.data().sufficientValues.forEach((suffiValue) => {
                                                        const recommendationObj = (
                                                            <Typography variant='h5' key={count} className={classes.recoMargin}>{count}. {suffiValue}</Typography>
                                                        )
                                                        tempReco.push(recommendationObj)
                                                        count++
                                                    })
                                                    setLoading(false)
                                                    setDisableBtn(false)
                                                    renderRecommendation(tempReco)
                                                })
                                            }else{
                                                recommendationsCollection
                                                .doc('insufficient')
                                                .get()
                                                .then((insuData) => {
                                                    insuData.data().insufficientValues.forEach((insuValue) => {
                                                        const recommendationObj = (
                                                            <Typography variant='h5' key={count} className={classes.recoMargin}>{count}. {insuValue}</Typography>
                                                        )
                                                        tempReco.push(recommendationObj)
                                                        count++
                                                    })
                                                    setLoading(false)
                                                    setDisableBtn(false)
                                                    renderRecommendation(tempReco)
                                                })
                                            }

                                            setLoading(false)
                                        })
                                        .catch((e) => {
                                            setSnackMessage({ type: 'error', message: 'Failed to update user response status' })
                                            handleSnack();
                                        })
                                    })
                                    .catch((e) => {
                                        setSnackMessage({ type: 'error', message: 'Error ' + e.message })
                                        handleSnack()
                                    }) 

                                })
                                .catch((e) => {
                                    setSnackMessage({ type: 'error', message: 'Error: ' + e.message})
                                    handleSnack()
                                })
                            }else{
                                console.log('wasd')
                            }
                        })
                        .catch((e) => {
                            setSnackMessage({ type: 'error', message: 'Error: ' + e.message })
                            handleSnack();
                        })
                    }
                })
                .catch((e) => {
                    setSnackMessage({type: 'error', message: 'Error: ' + e.message});
                    handleSnack();
                }) 
            }else {
                firebase
                .firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('test-status')
                .doc('response-status')
                .get()
                .then((response) => {
                    console.log(response.data())
                    if (response.data() === undefined) {
                        setSnackMessage({ type: 'error', message: 'No result for this user is found' });
                        handleSnack()
                        setLoading(false)
                    }else {
                        firebase
                        .firestore()
                        .collection('test')
                        .doc('test-responds')
                        .collection('user-responses')
                        .doc(response.data().testResponseId)
                        .get()
                        .then((responseData) => {
                            setTestRes({
                                score: responseData.data().score,
                                totalItems: responseData.data().totalItems,
                                percentage: responseData.data().percentage,
                                sufficient: checkSufficientPercentage(responseData.data().percentage)
                            })

                            const recommendationsCollection = firebase.firestore().collection('recommendations');
                            let count = 1;
                            let tempReco = [];
                            if (checkSufficientPercentage(responseData.data().percentage)) {
                                recommendationsCollection
                                .doc('sufficient')
                                .get()
                                .then((suffiData) => {
                                    suffiData.data().sufficientValues.forEach((suffiValue) => {
                                        const recommendationObj = (
                                            <Typography variant='h5' key={count} className={classes.recoMargin}>{count}. {suffiValue}</Typography>
                                        )
                                        tempReco.push(recommendationObj)
                                        count++
                                    })
                                    setLoading(false)
                                    setDisableBtn(false)
                                    renderRecommendation(tempReco)
                                })
                            }else{
                                recommendationsCollection
                                .doc('insufficient')
                                .get()
                                .then((insuData) => {
                                    insuData.data().insufficientValues.forEach((insuValue) => {
                                        const recommendationObj = (
                                            <Typography variant='h5' key={count} className={classes.recoMargin}>{count}. {insuValue}</Typography>
                                        )
                                        tempReco.push(recommendationObj)
                                        count++
                                    })
                                    setLoading(false)
                                    setDisableBtn(false)
                                    renderRecommendation(tempReco)
                                })
                            }
                        })  
                    }
                    
                })
            }
        }
        generatePageData();
    }, [])

    const renderRecommendation = (elements) => {
        if (recommendationContainer.current !== undefined) reactDom.render(elements, recommendationContainer.current)
    }


    const handleSnack = () => {
      setOpen(true);
    };

    const handleClose = (event, reason) => {
      setOpen(false);
    };

    const checkSufficientPercentage = (percentage) => {
        if (percentage >= 50) return true
        else return false
    }

    if(loading) {
        return(
            <Grid style={{ marginTop: '15vh' }}>
            <Navigation page='RESULT' admin={false}/>
                <Grid style={{ textAlign: 'center' }}>
                    <Button className={classes.view} id='survey' variant='text' disabled>TEST RESULT</Button>
                </Grid>

                <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20vh' }}>
                    <CircularProgress color='success' size={150}/>
                </Grid>
            </Grid>
        )
    }

    return(
        <Grid style={{ marginTop: '15vh' }}>
            <Navigation page='RESULT' admin={false}/>
            <Grid ref={ref}>
                <Grid style={{ textAlign: 'center' }}>
                    <Button className={classes.view} id='survey' variant='text' disabled>TEST RESULT</Button>
                </Grid>

                <Grid>
                    <Grid style={{ display: 'flex', justifyContent: 'center' }}>
                        <Grid style={{ display: 'flex', alignItems: 'center', marginRight: '40vh' }}>
                            <Avatar src={stdInfo.avatarUrl}
                            style={{ 
                                height: '15vh',
                                width: '15vh',
                                border: '3px solid #2e2e2e',
                                marginRight: '3vh',
                            }} />
                            <Grid>
                                <Typography variant='h5'>STUDENT ID: {stdInfo.id}</Typography>
                                <Typography variant='h5'>NAME: {stdInfo.name}</Typography>
                                <Typography variant='h5'>COURSE & YEAR: {stdInfo.year} - {stdInfo.course}</Typography>
                            </Grid>
                        </Grid>
                        <Grid 
                        style={{ 
                            textAlign: 'center', 
                            border: '2px solid gray', 
                            height: '35vh', 
                            width: '30vh' 
                            }}>
                            <Typography variant='h6' style={{ marginTop: '2vh' }}>SCORE</Typography>
                            <CircularProgressWithLabel value={testRes.percentage} style={{ height: '15vh', width: '15vh', color: '#00b890', margin: '2vh 0vh' }}/>
                            <Typography variant='h4'>{testRes.score}/{testRes.totalItems}</Typography>
                            <Typography variant='h5'>Good Job! keep it up</Typography>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid style={{
                    border: '2px solid gray',
                    margin: '5vh 39.5vh',
                }}>

                    <Typography variant='h5' className={classes.paraMargin}>You have {testRes.sufficient ? 'sufficient' : 'insufficient'} knowledge in Mathematics. You may improve your knowledge more by following these steps:</Typography>
                    
                    <Container ref={recommendationContainer}>

                    </Container>
                    
                    <Typography variant='h5' className={classes.paraMargin}>Review your test by clicking the review button and you may download it by clicking the download button. Thank you for participating, we appreciated it.</Typography>

                    <Grid style={{ display: 'flex', justifyContent: 'center', paddingBottom: '3vh' }}>
                        <Button disabled={disableBtn} variant='contained' color='success' className={classes.buttons} component={Link} to='/review-test'>Review</Button>
                        <Pdf targetRef={ref} scale={0.5} x={-20} y={20} filename={stdInfo.name + ' results.pdf'}>
                          {({ toPdf }) => <Button disabled={disableBtn} variant='contained' onClick={toPdf} color='success' className={classes.buttons}>Download</Button>}
                        </Pdf>
                    </Grid>

                </Grid>
                </Grid>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
              <Alert onClose={handleClose} severity={snackMessage.type} sx={{ width: '100%' }}>
                {snackMessage.message}
              </Alert>
            </Snackbar>

        </Grid>
    );
}


