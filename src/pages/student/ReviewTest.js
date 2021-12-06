import { 
    Button,
    Grid,
    Typography,
    FormControlLabel,
    Radio,
    Container,
    CircularProgress,
    FormControl,
    RadioGroup
 } from "@mui/material";
import Navigation from "../../component/Navigation";
import { makeStyles } from "@mui/styles";
import ImageImporter from "../../resources/ImageImporter";
import { useEffect, useState } from "react";
import firebase from '../../utils/firebase';
import { Link } from "react-router-dom";

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

    correct:{
        backgroundColor: '#71ff4a !important',
        color: '#114f00 !important'
    },

    wrong:{
        backgroundColor: '#ff5959 !important',
        color: '#ab0000 !important'
    }

}));

export default function Test() {

    const classes = useStyle();
    
    const [snackMessage, setSnackMessage] = useState({
        type: '',
        message: ''
    })

    const [questions, setQuestion] = useState({
        questions: [],
        answers: [],
    });

    const [responded, setResponded] = useState(false)

    const [loading, setLoading] = useState(true)

    let answers = [];

    useEffect(() => {
        const retrieveQuestionData = () => {
            let newQuestionData = [];
            let count = 1;
            let choicesBg = []

            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('test-status')
            .doc('response-status')
            .get()
            .then((responseData) => {
                if (responseData.data().responded) {
                    firebase
                    .firestore()
                    .collection('test')
                    .doc('test-responds')
                    .collection('user-responses')
                    .doc(responseData.data().testResponseId)
                    .get()
                    .then((userResponseData) => {
                        let userAnswers = userResponseData.data().answers.split(',')
                        console.log(userResponseData.data())
                        
                        firebase
                        .firestore()
                        .collection('test')
                        .doc('question-data')
                        .get()
                        .then((questionData) => {
                            console.log(questionData.data().correctAnswer.length)
                            let index = 0;
                            for (let i = 0; i < questionData.data().correctAnswer.length; i++) {
                                
                                choicesBg[i] = {
                                    a: '',
                                    b: '',
                                    c: '',
                                    d: '',
                                    aChecked: false,
                                    bChecked: false,
                                    cChecked: false,
                                    dChecked: false
                                }

                                if (userAnswers[i] === 'a') {
                                    console.log('a')
                                    if (userAnswers[i] === questionData.data().correctAnswer[i]) {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            a: classes.correct,
                                            aChecked: true
                                        }
                                    }else {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            a: classes.wrong,
                                        }
                                        getCorrectAnswer(questionData.data().correctAnswer[i], i, choicesBg)
                                    }
                                    
                                }else if(userAnswers[i] === 'b'){
                                    console.log('b')
                                    if (userAnswers[i] === questionData.data().correctAnswer[i]) {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            b: classes.correct,
                                            bChecked: true
                                        }
                                    }else {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            b: classes.wrong,
                                        }
                                        getCorrectAnswer(questionData.data().correctAnswer[i], i, choicesBg)
                                    }
                                }else if(userAnswers[i] === 'c'){
                                    console.log('c')
                                    if (userAnswers[i] === questionData.data().correctAnswer[i]) {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            c: classes.correct,
                                            cChecked: true
                                        }
                                    }else {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            c: classes.wrong,
                                        }
                                        getCorrectAnswer(questionData.data().correctAnswer[i], i, choicesBg)
                                    }
                                }else if(userAnswers[i] === 'd'){
                                    console.log('d')
                                    if (userAnswers[i] === questionData.data().correctAnswer[i]) {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            d: classes.correct,
                                            dChecked: true
                                        }
                                    }else {
                                        choicesBg[i] = {
                                            ...choicesBg[i],
                                            d: classes.wrong,
                                        }
                                        getCorrectAnswer(questionData.data().correctAnswer[i], i, choicesBg)
                                    }
                                }
                            }

                                console.log(choicesBg)
                            
                            questionData.data().question.forEach((question) => {
                                newQuestionData[index] = {
                                    question: question,
                                    questionCount: count,
                                    a : questionData.data().a[index],
                                    b : questionData.data().b[index],
                                    c : questionData.data().c[index],
                                    d : questionData.data().d[index],
                                    aBG : choicesBg[index].a,
                                    bBG : choicesBg[index].b,
                                    cBG : choicesBg[index].c,
                                    dBG : choicesBg[index].d,
                                    aChecked : choicesBg[index].aChecked,
                                    bChecked : choicesBg[index].bChecked,
                                    cChecked : choicesBg[index].cChecked,
                                    dChecked : choicesBg[index].dChecked,
                                }
                                answers.push(' ');
                                count++;
                                index++;
                            })
                            setQuestion({ questions: newQuestionData, answers: answers})
                            console.log(questions)
                            setLoading(false)
                        }).catch((e) => {
                            console.log(e.message)
                        })
                    })
                }
            })

            

        }
        retrieveQuestionData();
    }, [])

    const getCorrectAnswer = (correctAnswer, index, choicesBG) => {
        console.log(choicesBG)
        if (correctAnswer === 'a') {
            choicesBG[index] = {
                ...choicesBG[index],
                a: classes.correct,
                aChecked: true
            }
        }else if(correctAnswer === 'b'){
            choicesBG[index] = {
                ...choicesBG[index],
                b: classes.correct,
                bChecked: true
            }
        }else if(correctAnswer === 'c'){
            choicesBG[index] = {
                ...choicesBG[index],
                c: classes.correct,
                cChecked: true
            }
        }else if(correctAnswer === 'd'){
            choicesBG[index] = {
                ...choicesBG[index],
                d: classes.correct,
                dChecked: true
            }
        }
    }

    if (loading) {
        return(
    <Grid style={{ marginTop: '15vh' }}>
        <Navigation page='RESULT' admin={false}/>
            <Grid style={{ textAlign: 'center' }}>
                <Button className={classes.view} id='survey' variant='text' disabled>TEST REVIEW</Button>
                <Grid style={{ 
                    border: '1px solid black', 
                    height: '58vh', 
                    margin: '2vh 30vh', 
                    overflow: 'auto',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                    }}>
                    <CircularProgress color='success' size={150}/>
                </Grid>
            </Grid>
    </Grid>
    )
    }

    return(
        <Grid style={{ marginTop: '15vh' }}>
            <Navigation page='RESULT' admin={false}/>
                <Grid style={{ textAlign: 'center' }}>
                    <Button className={classes.view} id='survey' variant='text' disabled>TEST REVIEW</Button>
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
                                    >
                                    <FormControlLabel value="a" control={<Radio className={data.aBG} checked={data.aChecked} id={data.questionCount + ''} disabled/>} style={{ marginRight: '5vh' }} label={data.a} />
                                    <FormControlLabel value="b" control={<Radio className={data.bBG} checked={data.bChecked} id={data.questionCount + ''} disabled/>} style={{ marginRight: '5vh' }} label={data.b} />
                                    <FormControlLabel value="c" control={<Radio className={data.cBG} checked={data.cChecked} id={data.questionCount + ''} disabled/>} style={{ marginRight: '5vh' }} label={data.c} />
                                    <FormControlLabel value="d" control={<Radio className={data.dBG} checked={data.dChecked} id={data.questionCount + ''} disabled/>} style={{ marginRight: '5vh' }} label={data.d} />
                                  </RadioGroup>
                                </FormControl>
                            </Container> 
                        ))}
                    </Grid>
                </Grid>
            <Grid>
                
                <Grid style={{display: 'flex', justifyContent: 'right' }}>
                    <Button 
                    variant='contained'
                    color='success'
                    style={{ 
                        margin: '2vh 30vh', 
                        height: '5vh', 
                        width: '20vh', 
                        fontSize: '30px', 
                        borderRadius: '15px' 
                        }}
                    component={Link}
                    to='/test-result'>Back</Button>
                </Grid>
                    
            </Grid>
        </Grid>
    );
}



