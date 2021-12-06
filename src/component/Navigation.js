import { 
    AppBar,
    Toolbar,
    Typography
 } from "@mui/material";

import ImageImporter from '../resources/ImageImporter';
import { Link } from 'react-router-dom';
import { makeStyles } from "@mui/styles";
import firebase from '../utils/firebase';
import { useEffect, useState } from "react";

const useStyles = makeStyles(({
        links:{
            paddingRight: '5vh',
            textDecoration: 'none',
            color: 'white'
        }
}))
export default function Navigation({ page, admin }) {
    
    const classes = useStyles();

    const [uid, setUid] = useState('');

    useEffect(() => {
        const getUid = () => {
            if (!admin) {
                setUid(firebase.auth().currentUser.uid);
            }
        }
        getUid();
    }, [admin])
    
    const logout = () => {
        firebase
        .firestore()
        .collection('users')
        .doc(uid)
        .set({ rememberCredential: false })
        .then(() => {
            firebase
            .auth()
            .signOut()
            .then(() => {
                localStorage.setItem('email', '');
                localStorage.setItem('pass', '');
                localStorage.setItem('uid', '');
            })
        })
    }

    if (admin) {
        return(
            <AppBar style={{ backgroundColor: 'darkgreen' }}>
                <Toolbar>
                    <img src={ImageImporter.BSUB_logo} alt='school_logo' height={100} width={100} style={{ margin: '1vh' }}/>
    
                    {page === 'DASHBOARD' ? 
                        <Typography variant='h4' component={Link} to='/admin-dashboard' style={{ marginLeft: '75vh', color: 'orange'  }} className={classes.links}>DASHBOARD</Typography> :
                        <Typography variant='h4' component={Link} to='/admin-dashboard' style={{ marginLeft: '75vh'}} className={classes.links}>DASHBOARD</Typography>
                    }
                    
                    {page === 'A-TEST' ? 
                        <Typography variant='h4' component={Link} to='/admin-test' className={classes.links} style={{ color: 'orange' }}>TEST</Typography>:
                        <Typography variant='h4' component={Link} to='/admin-test' className={classes.links}>TEST</Typography>
                    }
    
                    {page === 'RECORDS' ? 
                        <Typography variant='h4' component={Link} to='/admin-records' className={classes.links} style={{ color: 'orange' }}>RECORDS</Typography>:
                        <Typography variant='h4' component={Link} to='/admin-records' className={classes.links}>RECORDS</Typography>
                    }
    
                    {page === 'SETTINGS' ?
                        <Typography variant='h4' component={Link} to='/admin-settings' className={classes.links} style={{ color: 'orange' }}>SETTINGS</Typography>:
                        <Typography variant='h4' component={Link} to='/admin-settings' className={classes.links}>SETTINGS</Typography>
                    }
    
                    <Typography
                    variant='h4'
                    component={Link}
                    to='/home'
                    className={classes.links}>
                        LOGOUT
                    </Typography>
                </Toolbar>
            </AppBar>
        );
    }else{
    return(
        <AppBar style={{ backgroundColor: 'darkgreen' }}>
            <Toolbar>
                <img src={ImageImporter.BSUB_logo} alt='school_logo' height={100} width={100} style={{ margin: '1vh' }}/>

                {page === 'HOME' ? 
                    <Typography variant='h4' component={Link} to='/std-home' style={{ marginLeft: '95vh', color: 'orange'  }} className={classes.links}>HOME</Typography> :
                    <Typography variant='h4' component={Link} to='/std-home' style={{ marginLeft: '95vh'}} className={classes.links}>HOME</Typography>
                }

                {page === 'TEST' ? 
                    <Typography variant='h4' component={Link} to='/test-survey' className={classes.links} style={{ color: 'orange' }}>TEST</Typography>:
                    <Typography variant='h4' component={Link} to='/test-survey' className={classes.links}>TEST</Typography>
                }

                {page === 'RESULT' ? 
                <Typography variant='h4' component={Link} to='/test-result' className={classes.links} style={{ color: 'orange' }}>RESULT</Typography>:
                <Typography variant='h4' component={Link} to='/test-result' className={classes.links}>RESULT</Typography>
                }

                {page === 'SETTINGS' ?
                    <Typography variant='h4' component={Link} to='/std-settings' className={classes.links} style={{ color: 'orange' }}>SETTINGS</Typography>:
                    <Typography variant='h4' component={Link} to='/std-settings' className={classes.links}>SETTINGS</Typography>
                }

                <Typography
                variant='h4'
                component={Link}
                to=''
                onClick={logout}
                className={classes.links}>
                    LOGOUT
                </Typography>
            </Toolbar>
        </AppBar>
        
    );

    }

}