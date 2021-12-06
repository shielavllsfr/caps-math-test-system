import { 
    Avatar,
    Grid,
    Typography,
    TableContainer,
    Paper,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,   
    Button
 } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Navigation from "../../component/Navigation";
import firebase from '../../utils/firebase';
import Pdf from 'react-to-pdf';

 function createData(statement, answer) {
    return { statement, answer};
  }
  
 
export default function AdminRecordData() { 
    
    const pdfRef = useRef();
    
    const [rows, setRows] = useState({ rowsData: [] })
    const [profile, setProfile] = useState({
        avatarSrc: '',
        name: '',
        id: '',
        email: ''
    })

    useEffect(() => {

    const fetchRecordData = () => {
        const id = localStorage.getItem('survey-response-id');
        let tempArr = [];
        firebase
        .firestore()
        .collection('survey')
        .doc('responses')
        .collection('user-responses')
        .doc(id)
        .get()
        .then((responseData) => {
            firebase
            .firestore()
            .collection('users')
            .doc(responseData.data().from)
            .collection('userInfo')
            .doc('info')
            .get()
            .then((userInfo) => {
                firebase
                .firestore()
                .collection('survey')
                .doc('questions')
                .get()
                .then((surveyStatements) => {
                    setProfile({
                        avatarSrc: userInfo.data().userInfo.avatarUrl.replace('https://firebasestorage.googleapis.com', ''),
                        name: userInfo.data().userInfo.name,
                        id: userInfo.data().userInfo.studentID,
                        email: userInfo.data().userInfo.email
                    })
                    let index = 0;
                    surveyStatements.data().fieldValue.forEach((statement) => {
                        tempArr.push(createData(statement, responseData.data().response[index]))
                        index++
                    })
                    console.log(tempArr)
                    setRows({ rowsData: tempArr })
                })
            })
        })
    }
    fetchRecordData()
  }, [])


    return(
        <Grid>
            <Navigation page='RECORDS' admin={true}/>
            <Grid style={{ marginTop: '15vh' }} ref={pdfRef}>
                <Typography variant='h5' style={{ textAlign: 'center' }}>STUDENT RECORDS</Typography>

                <Grid style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5vh' }}>
                    <Avatar
                    src={profile.avatarSrc}
                    style={{ 
                        height: '17vh',
                        width: '17vh',
                        border: '3px solid #2e2e2e',
                        marginRight: '20vh',
                    }} />
                    <Grid>
                        <Typography variant='h3'>{profile.name}</Typography>
                        <Typography variant='h5'>{profile.id}</Typography>
                        <Typography variant='h5'>{profile.email}</Typography>
                    </Grid>
                </Grid>

                <Grid style={{ display: 'flex', justifyContent: 'center', marginTop: '7vh' }}>
                    <Grid>
                        <Typography style={{ textAlign: 'center' }} variant='h5'>SURVEY</Typography>

                        <TableContainer component={Paper} sx={{ width: 800 }} >
                          <Table aria-label="simple table">
                            <TableHead>
                              <TableRow>
                                <TableCell><b>STATEMENT</b></TableCell>
                                <TableCell><b>CHOICE</b></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.rowsData.map((row) => (
                                <TableRow
                                  key={row.statemnet}
                                >
                                  <TableCell component="th" scope="row">
                                    {row.statement}
                                  </TableCell>
                                  <TableCell>{row.answer}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>

                        <Grid style={{ display: 'flex', justifyContent: 'center', marginTop: '3vh' }}>
                            <Pdf targetRef={pdfRef} scale={0.5} x={-20} y={20} filename={profile.name + ' survey response.pdf'}>
                                {({ toPdf }) => <Button variant='contained' onClick={toPdf} color='success'>Print</Button>}
                            </Pdf>
                        </Grid>

                    </Grid>
                </Grid>

            </Grid>
        </Grid>
    )
}