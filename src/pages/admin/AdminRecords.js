import {
  Grid,
  Typography,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import Navigation from "../../component/Navigation";
import firebase from "../../utils/firebase";
import { useHistory } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 170 },
  { id: "course", label: "Course", minWidth: 100 },
  {
    id: "year",
    label: "Year",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "score",
    label: "Score",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "status",
    label: "Status",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
];

function createData(name, course, year, score, status, surveyId) {
  return { name, course, year, score, status, surveyId };
}

export default function AdminRecords() {
  const history = useHistory();

  const [rows, setRows] = useState({ survRows: [] });

  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchInfo = () => {
      let tempArr = [];
      firebase
        .firestore()
        .collection("survey")
        .doc("responses")
        .collection("user-responses")
        .get()
        .then((surveyResponseData) => {
          surveyResponseData.docs.forEach((surveyResponse) => {
            firebase
              .firestore()
              .collection("users")
              .doc(surveyResponse.data().from)
              .collection("test-status")
              .doc("response-status")
              .get()
              .then((testStatus) => {
                firebase
                  .firestore()
                  .collection("test")
                  .doc("test-responds")
                  .collection("user-responses")
                  .doc(testStatus.data().testResponseId)
                  .get()
                  .then((testResponseData) => {
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(testResponseData.data().from)
                      .collection("userInfo")
                      .doc("info")
                      .get()
                      .then((userInfo) => {
                        let status = "FAILED";
                        if (testResponseData.data().passed) status = "PASSED";
                        tempArr.push(
                          createData(
                            userInfo.data().userInfo.name,
                            userInfo.data().userInfo.course,
                            userInfo.data().userInfo.year,
                            testResponseData.data().score,
                            status,
                            surveyResponse.id
                          )
                        );
                        setRows({ survRows: tempArr });
                      })
                      .catch((e) => {
                        console.log(e.message);
                      });
                  })
                  .catch((e) => {
                    console.log(e.message);
                  });
              })
              .catch((e) => {
                console.log(e.message);
              });
          });
        })
        .catch((e) => {
          console.log(e.message);
        });
    };
    fetchInfo();
  }, []);

  const searchValue = (e) => {
    setSearch(e.target.value.toLowerCase());
  };

  const filterNames = (data) => {
    const name = data.name.toLowerCase();
    if (name.includes(search)) {
      return data.name;
    }
  };

  const rowClicked = (e) => {
    localStorage.setItem("survey-response-id", e.target.parentElement.id);
    history.push("/admin-survey-record");
  };

  return (
    <Grid>
      <Navigation page="RECORDS" admin={true} />
      <Grid style={{ marginTop: "15vh" }}>
        <Typography variant="h5" style={{ textAlign: "center" }}>
          STUDENT'S RECORDS
        </Typography>
        <Grid
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5vh",
          }}
        >
          <TextField
            onChange={searchValue}
            placeholder="Search"
            style={{ width: "80%", borderWidth: "10px" }}
          />
        </Grid>
        <Grid style={{ display: "flex", justifyContent: "center" }}>
          <Paper sx={{ width: "80%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{
                          minWidth: column.minWidth,
                          backgroundColor: "#d9d9d9",
                        }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.survRows.filter(filterNames).map((row) => {
                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={row.name}
                        onClick={rowClicked}
                        id={row.surveyId}
                      >
                        {columns.map((column) => {
                          const value = row[column.id];
                          return (
                            <TableCell key={column.id} align={column.align}>
                              {column.format && typeof value === "number"
                                ? column.format(value)
                                : value}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Grid>
  );
}
