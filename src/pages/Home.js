
import { 
    Button,
    CardMedia,
    Typography,
    Grid,
    Box,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import ImageImporter from '../resources/ImageImporter'

const useStyle = makeStyles(() => ({
    root:{
        display: "flex",
        backgroundImage: `url(${ImageImporter.home_bg})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center",
        backgroundSize: "cover",
        height: "100vh",
    },

    button:{
        width: "20vh",
        height: "5vh",
    },

    buttonAlign:{
        textAlign: 'center',
        marginTop: '8vh'
    },

    schoolLogo:{
        width: '13vh',
        height: '13vh'
    },

    mathPerson:{
        height: '80vh',
        width: '86vh',
        marginLeft: '5vh',
        marginTop: '-8vh'
    },

    logoContainer:{
        marginTop: "2vh",
        marginLeft: "2vh"
    },

    mathPText:{
        textAlign: 'center'
    },

    col2:{
        marginLeft: '25vh',
        marginTop: '18vh'
    },

    writer:{
        textAlign: 'right'
    },

}));

export default function Home() {
    const classes = useStyle();

    useEffect(() => {
        const init = () => {
            if(localStorage.length === 0){
                localStorage.setItem('email', '');
                localStorage.setItem('pass', '');
                localStorage.setItem('uid', '');
            }
        }
        init();
    }, [])

    return(
        <Grid className={classes.root}>
            <Grid id="school">
                <Box className={classes.logoContainer} sx={{ display: 'flex', alignItems: 'center' }}>
                    <img src={ImageImporter.BSUB_logo} alt="school_logo" className={classes.schoolLogo}/>
                    <Typography variant="h4" style={{marginLeft: "2.5vh"}}>
                        BULACAN STATE UNIVERSITY <br/>BUSTOS CAMPUS
                    </Typography>
                </Box>

                <Grid className={classes.mathPText}>
                    <CardMedia>
                        <img src={ImageImporter.home_img1} alt="math_person" className={classes.mathPerson}/>
                    </CardMedia>
                    <Typography variant="h4" style={{ marginTop: "-3vh"}}>
                        MATHEMATICS SKILLS IN BULACAN
                    </Typography>
                </Grid>
            </Grid>
            <Grid className={classes.col2}>
                <Typography variant="h3">
                    "Without mathematics, there's <br/>nothing you can do. Everything <br/>around you is mathematics. <br/>Everything around you is <br/>numbers"
                </Typography>
                <Typography variant="h4" className={classes.writer}>
                    - Shakuntala Dala
                </Typography>
                <Typography variant="h6" className={classes.writer}>
                    Indian Writer and Mental Calculator
                </Typography>
                <Grid className={classes.buttonAlign}>
                    <Button 
                    color="success" 
                    variant="contained" 
                    className={classes.button} 
                    component={Link}
                    to='/login'
                    style={{ marginBottom: "15px" }} LinkComponent={Link}>
                        Log in
                    </Button><br/>
                    <Button 
                    color="success" 
                    variant="contained" 
                    component={Link}
                    to='/register'
                    className={classes.button}>
                        Register
                    </Button>
                </Grid>
                
            </Grid>
        
        </Grid>
    );
}