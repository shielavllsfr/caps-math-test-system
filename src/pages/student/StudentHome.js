import { 
    Button,
    Grid,
    Typography,
    Box,
    LinearProgress,
    CircularProgress
 } from "@mui/material";
import firebase from "../../utils/firebase"

import { makeStyles } from "@mui/styles";

import Navigation from "../../component/Navigation";
import ImageImporter from '../../resources/ImageImporter';
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from 'prop-types';


function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value,
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }
  
  LinearProgressWithLabel.propTypes = {
    /**
     * The value of the progress indicator for the determinate and buffer variants.
     * Value between 0 and 100.
     */
    value: PropTypes.number.isRequired,
  };

const useStyle = makeStyles(() => ({

    flex:{
        display: 'flex',
        marginTop: '25vh',
        justifyContent: 'center',
    },

    rightFlex:{
        backgroundImage: `url(${ImageImporter.std_home1})`,
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: "top center",
        height: '65vh',
        width: '110vh',

    },

    leftFlex:{
        border: '4px solid green',
        padding: '4vh 4vh 4vh 3.5vh',
        margin: '0vh 10vh 0vh 0vh',
        height: '70vh',
        width: '70vh'
    },

    spans:{
        fontSize: '4vh',
        marginLeft: '6vh'
    },

    vButton:{
        marginLeft: '7vh !important',
        marginTop: '2vh !important',
        borderRadius: '15px !important',
        width: '8vh',
    },

    rightMath:{ 
        borderLeft: '1px solid green', 
        padding: '2vh' 
    },

    leftMath:{ 
        borderRight: '1px solid green',
        padding: '2vh',
    },

}))


export default function StudentHome(){

    const classes = useStyle();

    const [vote, setVote] = useState(false)

    const [voteCount, setVoteCounts] = useState({
        abusePercentage: 0,
        drugsPercentage: 0
    })

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const checkPollStatus = () => {
            firebase
            .firestore()
            .collection('users')
            .doc(firebase.auth().currentUser.uid)
            .collection('poll-state')
            .doc('status')
            .get()
            .then((pollStatus) => {
                if (pollStatus.data() !== undefined) {
                    getPercentage();
                }else {
                    setLoading(false)
                }
            })
            .catch((e) => {
                console.log(e.message)
            })
        }
        checkPollStatus()
    }, [])

    const voteClicked = (e) => {
        if (e.target.id === 'abuse') {
            registerVote('abuse')
        }else if(e.target.id === 'drugs'){
            registerVote('drugs')
        }
    }

    const registerVote = (vote) => {
        firebase
        .firestore()
        .collection('poll')
        .doc(vote)
        .get()
        .then((voteData) => {
            if (voteData.data() === undefined) {
                firebase
                .firestore()
                .collection('poll')
                .doc(vote)
                .set({ votes: 1 })
                .then(() => {
                    console.log('voted')
                    getPercentage()
                })
                .catch((e) => {
                    console.log(e.message)
                })
            }else {
                firebase
                .firestore()
                .collection('poll')
                .doc(vote)
                .set({ votes: voteData.data().votes + 1 })
                .then(() => {
                    console.log('vote updated')
                    getPercentage()
                })
                .catch((e) => {
                    console.log(e.message)
                })
            }
        })
        .catch((e) => {
            console.log(e.message)
        })
    }

    const getPercentage = () => {
        let drugCount = 0;
        let abuseCount = 0;
        firebase
        .firestore()
        .collection('poll')
        .doc('drugs')
        .get()
        .then((drugsVoteCount) => {
            firebase
            .firestore()
            .collection('poll')
            .doc('abuse')
            .get()
            .then((abuseVoteCount) => {

                firebase
                .firestore()
                .collection('users')
                .doc(firebase.auth().currentUser.uid)
                .collection('poll-state')
                .doc('status')
                .set({ voted: true })
                .then(() => {
                    if (drugsVoteCount.data() !== undefined) {
                        drugCount = drugsVoteCount.data().votes
                    }

                    if (abuseVoteCount.data() !== undefined) {
                        abuseCount = abuseVoteCount.data().votes
                    }

                    const total = drugCount + abuseCount;

                    setVoteCounts({
                        abusePercentage: (abuseCount/total) * 100,
                        drugsPercentage: (drugCount/total) * 100
                    })

                    setVote(true)
                    setLoading(false)
                })
                .catch((e) => {
                    console.log(e.message)
                })
            })
            .catch((e) => {
                console.log(e.message)
            })
        })
        .catch((e) => {
            console.log(e.message)
        })
    }

    if(loading) {
        return(
            <Grid>
                <Navigation page='HOME' admin={false}/>
                <Grid className={classes.flex}>
                    <Grid className={classes.leftFlex}>
                        <img src={ImageImporter.std_home2} alt='std_home2' style={{ paddingLeft: '12vh' }}/>
                        <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress size={100} color='success' style={{ marginTop: '10vh' }}/>
                        </Grid>
                    </Grid>
                    <Grid className={classes.rightFlex}>
                        <Typography variant='h2' style={{ margin: '17vh 0vh 2vh 15vh' }} >We want to measure your mathematical skill in able to help you!</Typography>
                        <Button
                        component={Link}
                        to="/test-survey"
                        variant='contained'
                        color='success' 
                        style={{ 
                            marginLeft: '40vh', 
                            height: '6vh', 
                            width: '18vh', 
                            borderRadius: '10px', 
                            fontSize: '2vh', 
                            fontWeight: 'bold'
                            }}>
                                TEST NOW</Button>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return(
        <Grid>
            <Navigation page='HOME' admin={false}/>
            <Grid className={classes.flex}>
                <Grid className={classes.leftFlex}>
                    <img src={ImageImporter.std_home2} alt='std_home2' style={{ paddingLeft: '12vh' }}/>
                    <Grid style={{ display: 'flex', marginLeft: '2vh' }}>
                        <Grid className={classes.leftMath}>
                            <Typography variant='h3'>MATH IS...</Typography>
                            <Typography variant='h5'><span className={classes.spans}>M</span>ental</Typography>
                            <Typography variant='h5'><span className={classes.spans}>A</span>buse</Typography>
                            <Typography variant='h5'><span className={classes.spans}>T</span>o</Typography>
                            <Typography variant='h5'><span className={classes.spans}>H</span>umans</Typography>
                            {vote ? <LinearProgressWithLabel value={voteCount.abusePercentage}/> : <Button variant='contained' color='success' onClick={voteClicked} id='abuse' className={classes.vButton}>VOTE</Button>}
                        </Grid>
                        <Grid className={classes.rightMath}>
                            <Typography variant='h3'>MATH IS...</Typography>
                            <Typography variant='h5'><span className={classes.spans}>M</span>ore</Typography>
                            <Typography variant='h5'><span className={classes.spans}>A</span>ddictive</Typography>
                            <Typography variant='h5'><span className={classes.spans}>T</span>han</Typography>
                            <Typography variant='h5'><span className={classes.spans}>H</span>eroin</Typography>
                            {vote ? <LinearProgressWithLabel value={voteCount.drugsPercentage}/> : <Button variant='contained' color='success' onClick={voteClicked} id='drugs' className={classes.vButton}>VOTE</Button>}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid className={classes.rightFlex}>
                    <Typography variant='h2' style={{ margin: '17vh 0vh 2vh 15vh' }} >We want to measure your mathematical skill in able to help you!</Typography>
                    <Button
                    component={Link}
                    to="/test-survey"
                    variant='contained'
                    color='success' 
                    style={{ 
                        marginLeft: '40vh', 
                        height: '6vh', 
                        width: '18vh', 
                        borderRadius: '10px', 
                        fontSize: '2vh', 
                        fontWeight: 'bold'
                        }}>
                            TEST NOW</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}