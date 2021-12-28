import Navigation from "../../component/Navigation";
import {
  Grid,
  Typography,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Button,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useEffect, useState } from "react";
import ImageImporter from "../../resources/ImageImporter";
import Chart from "react-google-charts";
import firebase from "../../utils/firebase";

const useStyle = makeStyles(() => ({
  flex: {
    display: "flex",
  },

  margin: {
    marginTop: "15vh",
    display: "flex",
    justifyContent: "center",
  },

  border: {
    border: "2px solid gray",
    height: "40vh",
    width: "35vh",
    marginRight: "3vh",
  },

  leaderboardBorder: {
    borderRight: "2px solid gray",
    padding: "0.5vh 1vh",
  },

  title: {
    marginTop: "3vh !important",
  },

  percentage: {
    marginTop: "1vh !important",
    marginBottom: "4vh !important",
  },
}));

export default function AdminDashboard() {
  const classes = useStyle();

  const [totalStd, setTotal] = useState(0);
  const [pollRes, setPollRes] = useState({
    abuse: 0,
    drugs: 0,
  });
  const [testResults, setTestResults] = useState({
    passed: 0,
    failed: 0,
  });

  const [resByDept, setResByDept] = useState({
    citePassed: 0,
    citeFailed: 0,
    citPassed: 0,
    citFailed: 0,
    cbaPassed: 0,
    cbaFailed: 0,
    coedPassed: 0,
    coedFailed: 0,
  });

  const [resByYear, setResByYear] = useState({
    firstYearPassed: 0,
    firstYearFailed: 0,
    secondYearPassed: 0,
    secondYearFailed: 0,
    thirdYearPassed: 0,
    thirdYearFailed: 0,
    forthYearPassed: 0,
    forthYearFailed: 0,
  });

  const [cbaTotal, setCbaTotal] = useState({
    total: 0,
    firstY: 0,
    secondY: 0,
    thirdY: 0,
    forthY: 0,
    fyPassed: 0,
    fyFailed: 0,
    syPassed: 0,
    syFailed: 0,
    tyPassed: 0,
    tyFailed: 0,
    foyPassed: 0,
    foyFailed: 0,
  });

  const [citeTotal, setCiteTotal] = useState({
    total: 0,
    firstY: 0,
    secondY: 0,
    thirdY: 0,
    forthY: 0,
    fyPassed: 0,
    fyFailed: 0,
    syPassed: 0,
    syFailed: 0,
    tyPassed: 0,
    tyFailed: 0,
    foyPassed: 0,
    foyFailed: 0,
  });

  const [citTotal, setCitTotal] = useState({
    total: 0,
    firstY: 0,
    secondY: 0,
    thirdY: 0,
    forthY: 0,
    fyPassed: 0,
    fyFailed: 0,
    syPassed: 0,
    syFailed: 0,
    tyPassed: 0,
    tyFailed: 0,
    foyPassed: 0,
    foyFailed: 0,
  });

  const [coedTotal, setCoedTotal] = useState({
    total: 0,
    firstY: 0,
    secondY: 0,
    thirdY: 0,
    forthY: 0,
    fyPassed: 0,
    fyFailed: 0,
    syPassed: 0,
    syFailed: 0,
    tyPassed: 0,
    tyFailed: 0,
    foyPassed: 0,
    foyFailed: 0,
  });

  useEffect(() => {
    const fetchData = () => {
      firebase
        .firestore()
        .collection("users")
        .get()
        .then((users) => {
          let citeTotalCount = 0;
          let citeYears = [0, 0, 0, 0];
          let citTotalCount = 0;
          let citYears = [0, 0, 0, 0];
          let cbaTotalCount = 0;
          let cbaYears = [0, 0, 0, 0];
          let coedTotalCount = 0;
          let coedYears = [0, 0, 0, 0];
          users.docs.forEach((userData) => {
            firebase
              .firestore()
              .collection("users")
              .doc(userData.id)
              .collection("userInfo")
              .doc("info")
              .get()
              .then((userInfoData) => {
                const course = userInfoData.data().userInfo.course;
                const year = userInfoData.data().userInfo.year;

                if (course === "CBA") {
                  cbaTotalCount++;
                  if (year === "1st") {
                    cbaYears[0] = cbaYears[0] + 1;
                  } else if (year === "2nd") {
                    cbaYears[1] = cbaYears[1] + 1;
                  } else if (year === "3rd") {
                    cbaYears[2] = cbaYears[2] + 1;
                  } else if (year === "4th") {
                    cbaYears[3] = cbaYears[3] + 1;
                  }
                } else if (course === "CITE") {
                  citeTotalCount++;
                  if (year === "1st") {
                    citeYears[0] = citeYears[0] + 1;
                  } else if (year === "2nd") {
                    citeYears[1] = citeYears[1] + 1;
                  } else if (year === "3rd") {
                    citeYears[2] = citeYears[2] + 1;
                  } else if (year === "4th") {
                    citeYears[3] = citeYears[3] + 1;
                  }
                } else if (course === "CIT") {
                  citTotalCount++;
                  if (year === "1st") {
                    citYears[0] = citYears[0] + 1;
                  } else if (year === "2nd") {
                    citYears[1] = citYears[1] + 1;
                  } else if (year === "3rd") {
                    citYears[2] = citYears[2] + 1;
                  } else if (year === "4th") {
                    citYears[3] = citYears[3] + 1;
                  }
                } else if (course === "CoED") {
                  coedTotalCount++;
                  if (year === "1st") {
                    coedYears[0] = coedYears[0] + 1;
                  } else if (year === "2nd") {
                    coedYears[1] = coedYears[1] + 1;
                  } else if (year === "3rd") {
                    coedYears[2] = coedYears[2] + 1;
                  } else if (year === "4th") {
                    coedYears[3] = coedYears[3] + 1;
                  }
                }
              });
          });
          setTotal(users.docs.length);
          firebase
            .firestore()
            .collection("test")
            .doc("test-responds")
            .collection("user-responses")
            .get()
            .then((testResults) => {
              let passed = 0;
              let failed = 0;
              let citePassed = 0;
              let citeFailed = 0;
              let citPassed = 0;
              let citFailed = 0;
              let cbaPassed = 0;
              let cbaFailed = 0;
              let coedPassed = 0;
              let coedFailed = 0;
              let firstYearPassed = 0;
              let firstYearFailed = 0;
              let secondYearPassed = 0;
              let secondYearFailed = 0;
              let thirdYearPassed = 0;
              let thirdYearFailed = 0;
              let forthYearPassed = 0;
              let forthYearFailed = 0;

              let cbaPassByYear = [0, 0, 0, 0];
              let citPassByYear = [0, 0, 0, 0];
              let citePassByYear = [0, 0, 0, 0];
              let coedPassByYear = [0, 0, 0, 0];
              let cbaFailByYear = [0, 0, 0, 0];
              let citFailByYear = [0, 0, 0, 0];
              let citeFailByYear = [0, 0, 0, 0];
              let coedFailByYear = [0, 0, 0, 0];
              testResults.docs.forEach((resData) => {
                if (resData.data().passed) {
                  passed++;
                  if (resData.data().userCourse === "CBA") {
                    cbaPassed++;
                    if (resData.data().userYear === "1st") {
                      firstYearPassed++;
                      cbaPassByYear[0] = cbaPassByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearPassed++;
                      cbaPassByYear[1] = cbaPassByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearPassed++;
                      cbaPassByYear[2] = cbaPassByYear[2] + 1;
                      console.log("wasd");
                    } else if (resData.data().userYear === "4th") {
                      forthYearPassed++;
                      cbaPassByYear[3] = cbaPassByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CITE") {
                    citePassed++;
                    if (resData.data().userYear === "1st") {
                      firstYearPassed++;
                      citePassByYear[0] = citePassByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearPassed++;
                      citePassByYear[1] = citePassByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearPassed++;
                      citePassByYear[2] = citePassByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearPassed++;
                      citePassByYear[3] = citePassByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CIT") {
                    citPassed++;
                    if (resData.data().userYear === "1st") {
                      firstYearPassed++;
                      citPassByYear[0] = citPassByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearPassed++;
                      citPassByYear[1] = citPassByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearPassed++;
                      citPassByYear[2] = citPassByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearPassed++;
                      citPassByYear[3] = citPassByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CoED") {
                    coedPassed++;
                    if (resData.data().userYear === "1st") {
                      firstYearPassed++;
                      coedPassByYear[0] = coedPassByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearPassed++;
                      coedPassByYear[1] = coedPassByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearPassed++;
                      coedPassByYear[2] = coedPassByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearPassed++;
                      coedPassByYear[3] = coedPassByYear[3] + 1;
                    }
                  }
                } else {
                  failed++;
                  if (resData.data().userCourse === "CBA") {
                    cbaFailed++;
                    if (resData.data().userYear === "1st") {
                      firstYearFailed++;
                      cbaFailByYear[0] = cbaFailByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearFailed++;
                      cbaFailByYear[1] = cbaFailByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearFailed++;
                      cbaFailByYear[2] = cbaFailByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearFailed++;
                      cbaFailByYear[3] = cbaFailByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CITE") {
                    citeFailed++;
                    if (resData.data().userYear === "1st") {
                      firstYearFailed++;
                      citeFailByYear[0] = citeFailByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearFailed++;
                      citeFailByYear[1] = citeFailByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearFailed++;
                      citeFailByYear[2] = citeFailByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearFailed++;
                      citeFailByYear[3] = citeFailByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CIT") {
                    citFailed++;
                    if (resData.data().userYear === "1st") {
                      firstYearFailed++;
                      citFailByYear[0] = citFailByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearFailed++;
                      citFailByYear[1] = citFailByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearFailed++;
                      citFailByYear[2] = citFailByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearFailed++;
                      citFailByYear[3] = citFailByYear[3] + 1;
                    }
                  } else if (resData.data().userCourse === "CoED") {
                    coedFailed++;
                    if (resData.data().userYear === "1st") {
                      firstYearFailed++;
                      coedFailByYear[0] = coedFailByYear[0] + 1;
                    } else if (resData.data().userYear === "2nd") {
                      secondYearFailed++;
                      coedFailByYear[1] = coedFailByYear[1] + 1;
                    } else if (resData.data().userYear === "3rd") {
                      thirdYearFailed++;
                      coedFailByYear[2] = coedFailByYear[2] + 1;
                    } else if (resData.data().userYear === "4th") {
                      forthYearFailed++;
                      coedFailByYear[3] = coedFailByYear[3] + 1;
                    }
                  }
                }
              });
              setTestResults({ passed: passed, failed: failed });
              setResByDept({
                citePassed: citePassed,
                citeFailed: citeFailed,
                citPassed: citPassed,
                citFailed: citFailed,
                cbaPassed: cbaPassed,
                cbaFailed: cbaFailed,
                coedPassed: coedPassed,
                coedFailed: coedFailed,
              });
              setResByYear({
                firstYearPassed: firstYearPassed,
                firstYearFailed: firstYearFailed,
                secondYearPassed: secondYearPassed,
                secondYearFailed: secondYearFailed,
                thirdYearPassed: thirdYearPassed,
                thirdYearFailed: thirdYearFailed,
                forthYearPassed: forthYearPassed,
                forthYearFailed: forthYearFailed,
              });
              setCbaTotal({
                total: cbaTotalCount,
                firstY: cbaYears[0],
                secondY: cbaYears[1],
                thirdY: cbaYears[2],
                forthY: cbaYears[3],
                fyPassed: cbaPassByYear[0],
                fyFailed: cbaFailByYear[0],
                syPassed: cbaPassByYear[1],
                syFailed: cbaFailByYear[1],
                tyPassed: cbaPassByYear[2],
                tyFailed: cbaFailByYear[2],
                foyPassed: cbaPassByYear[3],
                foyFailed: cbaFailByYear[3],
              });
              setCiteTotal({
                total: citeTotalCount,
                firstY: citeYears[0],
                secondY: citeYears[1],
                thirdY: citeYears[2],
                forthY: citeYears[3],
                fyPassed: citePassByYear[0],
                fyFailed: citeFailByYear[0],
                syPassed: citePassByYear[1],
                syFailed: citeFailByYear[1],
                tyPassed: citePassByYear[2],
                tyFailed: citeFailByYear[2],
                foyPassed: citePassByYear[3],
                foyFailed: citeFailByYear[3],
              });
              setCitTotal({
                total: citTotalCount,
                firstY: citYears[0],
                secondY: citYears[1],
                thirdY: citYears[2],
                forthY: citYears[3],
                fyPassed: citPassByYear[0],
                fyFailed: citFailByYear[0],
                syPassed: citPassByYear[1],
                syFailed: citFailByYear[1],
                tyPassed: citPassByYear[2],
                tyFailed: citFailByYear[2],
                foyPassed: citPassByYear[3],
                foyFailed: citFailByYear[3],
              });
              setCoedTotal({
                total: coedTotalCount,
                firstY: coedYears[0],
                secondY: coedYears[1],
                thirdY: coedYears[2],
                forthY: coedYears[3],
                fyPassed: coedPassByYear[0],
                fyFailed: coedFailByYear[0],
                syPassed: coedPassByYear[1],
                syFailed: coedFailByYear[1],
                tyPassed: coedPassByYear[2],
                tyFailed: coedFailByYear[2],
                foyPassed: coedPassByYear[3],
                foyFailed: coedFailByYear[3],
              });
              firebase
                .firestore()
                .collection("poll")
                .get()
                .then((pollData) => {
                  let drugVotes = 0;
                  let abuseVotes = 0;
                  pollData.docs.forEach((pollVotesData) => {
                    if (pollVotesData.id === "abuse")
                      abuseVotes = pollVotesData.data().votes;
                    else if (pollVotesData.id === "drugs")
                      drugVotes = pollVotesData.data().votes;
                  });
                  setPollRes({
                    abuse: Math.round(
                      (abuseVotes / (drugVotes + abuseVotes)) * 100
                    ),
                    drugs: Math.round(
                      (drugVotes / (drugVotes + abuseVotes)) * 100
                    ),
                  });
                });
            });
        });
    };
    fetchData();
  }, []);

  const [dataControl, setDataControls] = useState({
    selectAll: true,
    cite: true,
    cit: true,
    cba: true,
    coed: true,
    firstYear: true,
    secondYear: true,
    thirdYear: true,
    forthYear: true,
  });

  const dataControlChanged = (e) => {
    const id = e.target.id;

    switch (id) {
      case "SELECT ALL":
        if (dataControl.selectAll) {
          setDataControls({
            selectAll: false,
            cite: false,
            cit: false,
            cba: false,
            coed: false,
            firstYear: false,
            secondYear: false,
            thirdYear: false,
            forthYear: false,
          });
        } else
          setDataControls({
            selectAll: true,
            cite: true,
            cit: true,
            cba: true,
            coed: true,
            firstYear: true,
            secondYear: true,
            thirdYear: true,
            forthYear: true,
          });
        break;
      case "CBA":
        if (dataControl.cba) {
          setDataControls({ ...dataControl, cba: false });
        } else {
          setDataControls({ ...dataControl, cba: true });
        }
        break;
      case "CITE":
        if (dataControl.cite) {
          setDataControls({ ...dataControl, cite: false });
        } else {
          setDataControls({ ...dataControl, cite: true });
        }
        break;
      case "CIT":
        if (dataControl.cit) {
          setDataControls({ ...dataControl, cit: false });
        } else {
          setDataControls({ ...dataControl, cit: true });
        }
        break;
      case "COED":
        if (dataControl.coed) {
          setDataControls({ ...dataControl, coed: false });
        } else {
          setDataControls({ ...dataControl, coed: true });
        }
        break;
      case "1ST":
        if (dataControl.firstYear) {
          setDataControls({ ...dataControl, firstYear: false });
        } else {
          setDataControls({ ...dataControl, firstYear: true });
        }
        break;
      case "2ND":
        if (dataControl.secondYear) {
          setDataControls({ ...dataControl, secondYear: false });
        } else {
          setDataControls({ ...dataControl, secondYear: true });
        }
        break;
      case "3RD":
        if (dataControl.thirdYear) {
          setDataControls({ ...dataControl, thirdYear: false });
        } else {
          setDataControls({ ...dataControl, thirdYear: true });
        }
        break;
      case "4TH":
        if (dataControl.forthYear) {
          setDataControls({ ...dataControl, forthYear: false });
        } else {
          setDataControls({ ...dataControl, forthYear: true });
        }
        break;

      default:
        break;
    }
  };

  const applyControlChanges = () => {
    let currentTotal = 0;
    let newPassedValue = 0;
    let newFailedValue = 0;

    if (
      dataControl.cba ||
      dataControl.cite ||
      dataControl.cit ||
      dataControl.coed
    ) {
      if (dataControl.cba) {
        if (
          dataControl.firstYear ||
          dataControl.secondYear ||
          dataControl.thirdYear ||
          dataControl.forthYear
        ) {
          if (dataControl.firstYear) {
            currentTotal += cbaTotal.firstY;
            newPassedValue += cbaTotal.fyPassed;
            newFailedValue += cbaTotal.fyFailed;
          }
          if (dataControl.secondYear) {
            currentTotal += cbaTotal.secondY;
            newPassedValue += cbaTotal.syPassed;
            newFailedValue += cbaTotal.syFailed;
          }
          if (dataControl.thirdYear) {
            currentTotal += cbaTotal.thirdY;
            newPassedValue += cbaTotal.tyPassed;
            newFailedValue += cbaTotal.tyFailed;
          }
          if (dataControl.forthYear) {
            currentTotal += cbaTotal.forthY;
            newPassedValue += cbaTotal.foyPassed;
            newFailedValue += cbaTotal.foyFailed;
          }
        } else {
          currentTotal += cbaTotal.total;
          newPassedValue +=
            cbaTotal.fyPassed +
            cbaTotal.syPassed +
            cbaTotal.tyPassed +
            cbaTotal.foyPassed;
          newFailedValue +=
            cbaTotal.fyFailed +
            cbaTotal.syFailed +
            cbaTotal.tyFailed +
            cbaTotal.foyFailed;
        }
      }

      if (dataControl.cite) {
        if (
          dataControl.firstYear ||
          dataControl.secondYear ||
          dataControl.thirdYear ||
          dataControl.forthYear
        ) {
          if (dataControl.firstYear) {
            currentTotal += citeTotal.firstY;
            newPassedValue += citeTotal.fyPassed;
            newFailedValue += citeTotal.fyFailed;
          }
          if (dataControl.secondYear) {
            currentTotal += citeTotal.secondY;
            newPassedValue += citeTotal.syPassed;
            newFailedValue += citeTotal.syFailed;
          }
          if (dataControl.thirdYear) {
            currentTotal += citeTotal.thirdY;
            newPassedValue += citeTotal.tyPassed;
            newFailedValue += citeTotal.tyFailed;
          }
          if (dataControl.forthYear) {
            currentTotal += citeTotal.forthY;
            newPassedValue += citeTotal.foyPassed;
            newFailedValue += citeTotal.foyFailed;
          }
        } else {
          currentTotal += citeTotal.total;
          newPassedValue +=
            citeTotal.fyPassed +
            citeTotal.syPassed +
            citeTotal.tyPassed +
            citeTotal.foyPassed;
          newFailedValue +=
            citeTotal.fyFailed +
            citeTotal.syFailed +
            citeTotal.tyFailed +
            citeTotal.foyFailed;
        }
      }

      if (dataControl.cit) {
        if (
          dataControl.firstYear ||
          dataControl.secondYear ||
          dataControl.thirdYear ||
          dataControl.forthYear
        ) {
          if (dataControl.firstYear) {
            currentTotal += citTotal.firstY;
            newPassedValue += citTotal.fyPassed;
            newFailedValue += citTotal.fyFailed;
          }
          if (dataControl.secondYear) {
            currentTotal += citTotal.secondY;
            newPassedValue += citTotal.syPassed;
            newFailedValue += citTotal.syFailed;
          }
          if (dataControl.thirdYear) {
            currentTotal += citTotal.thirdY;
            newPassedValue += citTotal.tyPassed;
            newFailedValue += citTotal.tyFailed;
          }
          if (dataControl.forthYear) {
            currentTotal += citTotal.forthY;
            newPassedValue += citTotal.foyPassed;
            newFailedValue += citTotal.foyFailed;
          }
        } else {
          currentTotal += citTotal.total;
          newPassedValue +=
            citTotal.fyPassed +
            citTotal.syPassed +
            citTotal.tyPassed +
            citTotal.foyPassed;
          newFailedValue +=
            citTotal.fyFailed +
            citTotal.syFailed +
            citTotal.tyFailed +
            citTotal.foyFailed;
        }
      }

      if (dataControl.coed) {
        if (
          dataControl.firstYear ||
          dataControl.secondYear ||
          dataControl.thirdYear ||
          dataControl.forthYear
        ) {
          if (dataControl.firstYear) {
            currentTotal += coedTotal.firstY;
            newPassedValue += coedTotal.fyPassed;
            newFailedValue += coedTotal.fyFailed;
          }
          if (dataControl.secondYear) {
            currentTotal += coedTotal.secondY;
            newPassedValue += coedTotal.syPassed;
            newFailedValue += coedTotal.syFailed;
          }
          if (dataControl.thirdYear) {
            currentTotal += coedTotal.thirdY;
            newPassedValue += coedTotal.tyPassed;
            newFailedValue += coedTotal.tyFailed;
          }
          if (dataControl.forthYear) {
            currentTotal += coedTotal.forthY;
            newPassedValue += coedTotal.foyPassed;
            newFailedValue += coedTotal.foyFailed;
          }
        } else {
          currentTotal += coedTotal.total;
          newPassedValue +=
            coedTotal.fyPassed +
            coedTotal.syPassed +
            coedTotal.tyPassed +
            coedTotal.foyPassed;
          newFailedValue +=
            coedTotal.fyFailed +
            coedTotal.syFailed +
            coedTotal.tyFailed +
            coedTotal.foyFailed;
        }
      }
    } else {
      if (dataControl.firstYear) {
        currentTotal +=
          cbaTotal.firstY +
          citeTotal.firstY +
          citTotal.firstY +
          coedTotal.firstY;
        newPassedValue +=
          cbaTotal.fyPassed +
          citeTotal.fyPassed +
          citTotal.fyPassed +
          coedTotal.fyPassed;
        newFailedValue +=
          cbaTotal.fyFailed +
          citeTotal.fyFailed +
          citTotal.fyFailed +
          coedTotal.fyFailed;
      }
      if (dataControl.secondYear) {
        currentTotal +=
          cbaTotal.secondY +
          citeTotal.secondY +
          citTotal.secondY +
          coedTotal.secondY;
        newPassedValue +=
          cbaTotal.syPassed +
          citeTotal.syPassed +
          citTotal.syPassed +
          coedTotal.syPassed;
        newFailedValue +=
          cbaTotal.syFailed +
          citeTotal.syFailed +
          citTotal.syFailed +
          coedTotal.syFailed;
      }
      if (dataControl.thirdYear) {
        currentTotal +=
          cbaTotal.thirdY +
          citeTotal.thirdY +
          citTotal.thirdY +
          coedTotal.thirdY;
        newPassedValue +=
          cbaTotal.tyPassed +
          citeTotal.tyPassed +
          citTotal.tyPassed +
          coedTotal.tyPassed;
        newFailedValue +=
          cbaTotal.tyFailed +
          citeTotal.tyFailed +
          citTotal.tyFailed +
          coedTotal.tyFailed;
      }
      if (dataControl.forthYear) {
        currentTotal +=
          cbaTotal.forthY +
          citeTotal.forthY +
          citTotal.forthY +
          coedTotal.forthY;
        newPassedValue +=
          cbaTotal.foyPassed +
          citeTotal.foyPassed +
          citTotal.foyPassed +
          coedTotal.foyPassed;
        newFailedValue +=
          cbaTotal.foyFailed +
          citeTotal.foyFailed +
          citTotal.foyFailed +
          coedTotal.foyFailed;
      }
    }

    setTotal(currentTotal);
    setTestResults({
      passed: newPassedValue,
      failed: newFailedValue,
    });
  };

  return (
    <Grid>
      <Navigation page="DASHBOARD" admin={true} />
      <Grid className={classes.margin}>
        <Grid>
          <Grid className={classes.flex} style={{ marginLeft: "4vh" }}>
            <Grid className={classes.border} style={{ textAlign: "center" }}>
              <Typography variant="h5" style={{ marginTop: "3vh" }}>
                Total Students
              </Typography>
              <img
                alt="std_icon"
                src={ImageImporter.std_icon}
                style={{ margin: "2vh 0vh" }}
              />
              <Typography variant="h2">{totalStd}</Typography>
            </Grid>
            {testResults.passed !== 0 || testResults.failed !== 0 ? (
              <Chart
                className={classes.border}
                style={{ marginRight: "3vh" }}
                width={"50vh"}
                height={"39.5vh"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[
                  ["survey", "responses"],
                  ["PASSES", testResults.passed],
                  ["FAILED", testResults.failed],
                ]}
                options={{
                  title: "OVERALL PERCENTAGE",
                }}
                rootProps={{ "data-testid": "1" }}
              />
            ) : (
              <Chart
                className={classes.border}
                style={{ marginRight: "3vh" }}
                width={"50vh"}
                height={"39.5vh"}
                chartType="PieChart"
                loader={<div>Loading Chart</div>}
                data={[["survey", "responses"]]}
                options={{
                  title: "Currently no result/s for this group/s",
                }}
                rootProps={{ "data-testid": "1" }}
              />
            )}
            <Grid className={classes.border} style={{ textAlign: "center" }}>
              <Grid style={{ borderBottom: "1px solid gray" }}>
                <Typography className={classes.title}>MATH IS</Typography>
                <Typography>More Addictive than Heroin</Typography>
                <Typography variant="h3" className={classes.percentage}>
                  {pollRes.drugs}%
                </Typography>
              </Grid>
              <Grid style={{ borderTop: "1px solid gray" }}>
                <Typography className={classes.title}>MATH IS</Typography>
                <Typography>Mental Abuse To Humans</Typography>
                <Typography variant="h3" className={classes.percentage}>
                  {pollRes.abuse}%
                </Typography>
              </Grid>
            </Grid>
            <Grid className={classes.border} style={{ overflow: "auto" }}>
              <Grid style={{ display: "flex", marginTop: "1vh" }}>
                <Button
                  size="small"
                  color="success"
                  style={{ height: "2.5vh" }}
                  onClick={applyControlChanges}
                >
                  Apply
                </Button>
                <Typography variant="subtitle2" style={{ marginLeft: "5.5vh" }}>
                  Data Control
                </Typography>
              </Grid>
              <FormGroup style={{ marginLeft: "2vh" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.selectAll}
                      id="SELECT ALL"
                      onClick={dataControlChanged}
                    />
                  }
                  label="Select All"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.cba}
                      id="CBA"
                      onClick={dataControlChanged}
                    />
                  }
                  label="CBA"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.cite}
                      id="CITE"
                      onClick={dataControlChanged}
                    />
                  }
                  label="CITE"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.cit}
                      id="CIT"
                      onClick={dataControlChanged}
                    />
                  }
                  label="CIT"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.coed}
                      id="COED"
                      onClick={dataControlChanged}
                    />
                  }
                  label="CoED"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.firstYear}
                      id="1ST"
                      onClick={dataControlChanged}
                    />
                  }
                  label="1st year"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.secondYear}
                      id="2ND"
                      onClick={dataControlChanged}
                    />
                  }
                  label="2nd year"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.thirdYear}
                      id="3RD"
                      onClick={dataControlChanged}
                    />
                  }
                  label="3rd year"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={dataControl.forthYear}
                      id="4TH"
                      onClick={dataControlChanged}
                    />
                  }
                  label="4th year"
                />
              </FormGroup>
            </Grid>
          </Grid>
          <Grid
            className={classes.flex}
            style={{ marginTop: "-2vh", justifyContent: "center" }}
          >
            <Grid style={{ marginRight: "3vh" }}>
              <Chart
                className={classes.border}
                style={{
                  padding: "4vh",
                }}
                width={"500px"}
                height={"300px"}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                  ["COURSES", "PASSED", "FAILED"],
                  [
                    "1st Year",
                    resByYear.firstYearPassed,
                    resByYear.firstYearFailed,
                  ],
                  [
                    "2nd Year",
                    resByYear.secondYearPassed,
                    resByYear.secondYearFailed,
                  ],
                  [
                    "3rd Year",
                    resByYear.thirdYearPassed,
                    resByYear.thirdYearFailed,
                  ],
                  [
                    "4th Year",
                    resByYear.forthYearPassed,
                    resByYear.forthYearFailed,
                  ],
                ]}
                options={{
                  chart: {
                    title: "STUDENT BY YEAR",
                  },
                }}
                rootProps={{ "data-testid": "1" }}
              />
            </Grid>
            <Grid>
              <Chart
                className={classes.border}
                style={{
                  padding: "4vh",
                }}
                width={"500px"}
                height={"300px"}
                chartType="Bar"
                loader={<div>Loading Chart</div>}
                data={[
                  ["COURSES", "PASSED", "FAILED"],
                  ["CITE", resByDept.citePassed, resByDept.citeFailed],
                  ["CIT", resByDept.citPassed, resByDept.citFailed],
                  ["CBA", resByDept.cbaPassed, resByDept.cbaFailed],
                  ["CoED", resByDept.coedPassed, resByDept.coedFailed],
                ]}
                options={{
                  chart: {
                    title: "STUDENT BY DEPARTMENT",
                  },
                }}
                rootProps={{ "data-testid": "1" }}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
