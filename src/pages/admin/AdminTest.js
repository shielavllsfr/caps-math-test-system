import {
  Grid,
  Box,
  Tabs,
  Tab,
  Typography,
  Button,
  TextField,
  IconButton,
  Container,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { useRef, useState, forwardRef, useEffect } from "react";
import Navigation from "../../component/Navigation";
import PropTypes from "prop-types";
import ImageImporter from "../../resources/ImageImporter";
import { makeStyles } from "@mui/styles";
import Chart from "react-google-charts";
import reactDom, { unmountComponentAtNode } from "react-dom";
import firebase from "../../utils/firebase";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const useStyle = makeStyles(() => ({
  iconSize: {
    height: "35%",
    width: "35%",
  },

  tabLabel: {
    fontSize: "20px !important",
    fontWeight: "bold !important",
  },

  choicesWidth: {
    width: "45vh",
    marginBottom: "1vh !important",
  },

  recommendationPanel: {
    width: "60vh",
  },
}));

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function AdminTest() {
  const [open, setOpen] = useState(false);

  const [disableTab, setDisableTab] = useState(false);

  const [snackMessage, setSnackMessage] = useState({
    type: "",
    message: "",
  });

  const handleSnack = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const classes = useStyle();

  const [value, setValue] = useState(0);

  const questionContainer = useRef();
  const testQuestionContainer = useRef();
  const sufficientContainer = useRef();
  const insufficientContainer = useRef();

  const [loading, setLoading] = useState(false);
  const [initLoad, setInitLoad] = useState(true);

  const [survey, setSurvey] = useState({
    questions: [],
    fieldValue: [],
    fieldValueLength: [],
    IDS: [],
  });

  const [sufficientReco, setSufficientReco] = useState({
    recommendationObj: [],
    recommendationValue: [],
    recommendationValueLength: [],
    id: [],
  });

  const [insufficientReco, setInsufficientReco] = useState({
    recommendationObj: [],
    recommendationValue: [],
    recommendationValueLength: [],
    id: [],
  });

  const [test, setTest] = useState({
    question: [],
    questionField: [],
    questionStatement: [],
    questionFieldLength: [],
    a: [],
    b: [],
    c: [],
    d: [],
    aLength: [],
    bLength: [],
    cLength: [],
    dLength: [],
    correctAnswer: [],
    prevCorrectAnswer: [],
    id: [],
  });

  let questions = [];
  let fieldValue = [];
  let fieldValueLength = [];
  let IDS = [];

  let sufiObj = [];
  let sufiValue = [];
  let sufiValueLength = [];

  let insuObj = [];
  let InsuValue = [];
  let InsuValueLength = [];
  let insuID = [];

  let question = [];
  let questionField = [];
  let questionStatement = [];
  let questionFieldLength = [];
  let a = [];
  let b = [];
  let c = [];
  let d = [];
  let aLength = [];
  let bLength = [];
  let cLength = [];
  let dLength = [];
  let correctAnswer = [];
  let prevCorrectAnswer = [];

  const handleChange = (event, newValue) => {
    if (value !== newValue) {
      setValue(newValue);
    }
  };

  const deleteQuestion = (e) => {
    const questionRoot = e.target.parentElement.parentElement.parentElement;
    console.log(e.target.id);
    if (e.target.id === "surveyDelete") {
      questions.splice(IDS.indexOf(questionRoot.id), 1);
      fieldValue.splice(IDS.indexOf(questionRoot.id), 1);
      fieldValueLength.splice(IDS.indexOf(questionRoot.id), 1);
      IDS.splice(IDS.indexOf(questionRoot.id), 1);
      renderElements(questions, questionContainer.current);
      asignSurveyValues("survey", "");
      updateSurveyState(questions, fieldValue, fieldValueLength, IDS);
    } else if (e.target.id === "sufficientDelete") {
      sufiObj.splice(IDS.indexOf(questionRoot.id), 1);
      sufiValue.splice(IDS.indexOf(questionRoot.id), 1);
      sufiValueLength.splice(IDS.indexOf(questionRoot.id), 1);
      IDS.splice(IDS.indexOf(questionRoot.id), 1);
      renderElements(sufiObj, sufficientContainer.current);
      asignSurveyValues("recommendation", "sufficient");
      updateSufficientRecoState(sufiObj, sufiValue, sufiValueLength, IDS);
    } else if (e.target.id === "insufficientDelete") {
      insuObj.splice(insuID.indexOf(questionRoot.id), 1);
      InsuValue.splice(insuID.indexOf(questionRoot.id), 1);
      InsuValueLength.splice(insuID.indexOf(questionRoot.id), 1);
      insuID.splice(insuID.indexOf(questionRoot.id), 1);
      renderElements(insuObj, insufficientContainer.current);
      asignSurveyValues("recommendation", "insufficient");
      updateInsufficientRecoState(insuObj, InsuValue, InsuValueLength, insuID);
    }
  };

  const deleteTestQuestion = (e) => {
    const questionRoot = e.target.parentElement.parentElement.parentElement;
    const index = IDS.indexOf(questionRoot.id);
    question.splice(index, 1);
    questionField.splice(index, 1);
    questionStatement.splice(index, 1);
    questionFieldLength.splice(index, 1);
    a.splice(index, 1);
    b.splice(index, 1);
    c.splice(index, 1);
    d.splice(index, 1);
    aLength.splice(index, 1);
    bLength.splice(index, 1);
    cLength.splice(index, 1);
    dLength.splice(index, 1);
    correctAnswer.splice(index, 1);
    prevCorrectAnswer.splice(index, 1);
    IDS.splice(index, 1);
    renderElements(question, testQuestionContainer.current);
    asignTestValues();
    updateTestState(
      question,
      questionField,
      questionFieldLength,
      IDS,
      correctAnswer,
      a,
      b,
      c,
      d,
      aLength,
      bLength,
      cLength,
      dLength,
      prevCorrectAnswer,
      questionStatement
    );
  };

  const valueChanged = (e) => {
    const container =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement;
    let index = IDS.indexOf(container.id);
    const choicesIndex = IDS.indexOf(container.parentElement.id);
    if (e.target.id === "statement") {
      fieldValue[index] = e.target.value;
      fieldValueLength[index] = e.target.value.length;
      updateSurveyState(questions, fieldValue, fieldValueLength, IDS);
    } else if (e.target.id === "question") {
      console.log(test);
      console.log(index);
      questionField[index] = e.target.value;
      questionFieldLength[index] = e.target.value.length;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "question-statement") {
      console.log(test);
      console.log(index);
      questionStatement[index] = e.target.value;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "a") {
      a[choicesIndex] = e.target.value;
      aLength[choicesIndex] = e.target.value.length;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "b") {
      b[choicesIndex] = e.target.value;
      bLength[choicesIndex] = e.target.value.length;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "c") {
      c[choicesIndex] = e.target.value;
      cLength[choicesIndex] = e.target.value.length;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "d") {
      d[choicesIndex] = e.target.value;
      dLength[choicesIndex] = e.target.value.length;
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "sufficient") {
      sufiValue[index] = e.target.value;
      sufiValueLength[index] = e.target.value.length;
      updateSufficientRecoState(sufiObj, sufiValue, sufiValueLength, IDS);
    } else if (e.target.id === "insufficient") {
      index = insuID.indexOf(container.id);
      InsuValue[index] = e.target.value;
      InsuValueLength[index] = e.target.value.length;
      updateInsufficientRecoState(insuObj, InsuValue, InsuValueLength, insuID);
    }
  };

  const correctAnsChanged = (e) => {
    console.log(question);
    const questionRoot =
      e.target.parentElement.parentElement.parentElement.parentElement
        .parentElement.parentElement.parentElement;
    if (prevCorrectAnswer[IDS.indexOf(questionRoot.id)] !== null) {
      prevCorrectAnswer[IDS.indexOf(questionRoot.id)].firstChild.checked = true;
      prevCorrectAnswer[IDS.indexOf(questionRoot.id)].setAttribute(
        "class",
        "MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root css-vqmohf-MuiButtonBase-root-MuiRadio-root"
      );
      prevCorrectAnswer[
        IDS.indexOf(questionRoot.id)
      ].children[1].lastChild.setAttribute(
        "class",
        "MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1hhw7if-MuiSvgIcon-root"
      );
    }
    correctAnswer[IDS.indexOf(questionRoot.id)] = e.target.value;
    updateTestState(
      question,
      questionField,
      questionFieldLength,
      IDS,
      correctAnswer,
      a,
      b,
      c,
      d,
      aLength,
      bLength,
      cLength,
      dLength,
      prevCorrectAnswer
    );
    asignTestValues();
  };

  const generateSurveyObj = (randomID) => {
    const newQuestion = (
      <Grid key={randomID} id={randomID} style={{ marginBottom: "2vh" }}>
        <Grid style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            label="Statement"
            id="statement"
            style={{ width: "110vh" }}
            onChange={valueChanged}
          ></TextField>
          <IconButton
            style={{ marginTop: "-0.5vh", marginLeft: "1vh" }}
            onClick={deleteQuestion}
          >
            <img
              src={ImageImporter.delete_icon}
              alt="delete icon"
              id="surveyDelete"
              style={{ height: "5vh", width: "4vh" }}
            />
          </IconButton>
        </Grid>
      </Grid>
    );
    return newQuestion;
  };

  const generateTestObj = (randomID) => {
    const newTestQuestion = (
      <Grid key={randomID} id={randomID} style={{ marginBottom: "5vh" }}>
        <Grid style={{ display: "flex" }}>
          <Grid>
            <TextField
              variant="outlined"
              label="Question"
              id="question"
              style={{ width: "110vh" }}
              onChange={valueChanged}
            ></TextField>
          </Grid>
          <IconButton
            style={{ marginTop: "-0.5vh", marginLeft: "1vh" }}
            onClick={deleteTestQuestion}
          >
            <img
              src={ImageImporter.delete_icon}
              alt="delete icon"
              style={{ height: "5vh", width: "4vh" }}
            />
          </IconButton>
        </Grid>
        <Grid>
          <Grid>
            <TextField
              variant="outlined"
              label="Feedback"
              id="question-statement"
              style={{ width: "110vh", marginTop: "2vh" }}
              onChange={valueChanged}
            ></TextField>
          </Grid>
        </Grid>
        <Typography style={{ marginTop: "2vh" }}>CHOICES:</Typography>
        <Grid style={{ display: "flex", width: "90%" }}>
          <Grid>
            <TextField
              variant="outlined"
              label="A:"
              id="a"
              className={classes.choicesWidth}
              onChange={valueChanged}
            ></TextField>
            <TextField
              variant="outlined"
              label="B:"
              id="b"
              className={classes.choicesWidth}
              onChange={valueChanged}
            ></TextField>
          </Grid>
          <Grid>
            <TextField
              variant="outlined"
              label="C:"
              id="c"
              className={classes.choicesWidth}
              onChange={valueChanged}
            ></TextField>
            <TextField
              variant="outlined"
              label="D:"
              id="d"
              className={classes.choicesWidth}
              onChange={valueChanged}
            ></TextField>
          </Grid>
          <Grid>
            <FormControl component="fieldset">
              <FormLabel component="legend">Correct Answer:</FormLabel>
              <RadioGroup
                row
                aria-label="correct-answer"
                name="controlled-radio-buttons-group"
                onChange={correctAnsChanged}
              >
                <FormControlLabel value="a" control={<Radio />} label="A" />
                <FormControlLabel value="c" control={<Radio />} label="C" />
                <FormControlLabel value="b" control={<Radio />} label="B" />
                <FormControlLabel value="d" control={<Radio />} label="D" />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
      </Grid>
    );
    return newTestQuestion;
  };

  const generateRecommendationObj = (id, from) => {
    const obj = (
      <Grid key={id} id={id} style={{ marginBottom: "2vh" }}>
        <Grid style={{ display: "flex" }}>
          <TextField
            variant="outlined"
            label="Recommendation"
            id={from}
            style={{ width: "50vh" }}
            onChange={valueChanged}
          ></TextField>
          <IconButton
            style={{ marginTop: "-0.5vh", marginLeft: "1vh" }}
            onClick={deleteQuestion}
          >
            <img
              src={ImageImporter.delete_icon}
              alt="delete icon"
              id={from + "Delete"}
              style={{ height: "5vh", width: "4vh" }}
            />
          </IconButton>
        </Grid>
      </Grid>
    );
    return obj;
  };

  const updateSufficientRecoState = (obj, value, length, id) => {
    setSufficientReco({
      recommendationObj: obj,
      recommendationValue: value,
      recommendationValueLength: length,
      id: id,
    });
  };

  const updateInsufficientRecoState = (obj, value, length, id) => {
    setInsufficientReco({
      recommendationObj: obj,
      recommendationValue: value,
      recommendationValueLength: length,
      id: id,
    });
  };

  const updateSurveyState = (question, field, fieldLength, id) => {
    setSurvey({
      questions: question,
      fieldValue: field,
      fieldValueLength: fieldLength,
      IDS: id,
    });
  };

  const updateTestState = (
    questionObj,
    question,
    questionLength,
    id,
    correctAns,
    a,
    b,
    c,
    d,
    aLength,
    bLength,
    cLength,
    dLength,
    prevCorrectAnswer,
    questionStatement
  ) => {
    setTest({
      question: questionObj,
      questionStatement: questionStatement,
      questionField: question,
      questionFieldLength: questionLength,
      a: a,
      b: b,
      c: c,
      d: d,
      aLength: aLength,
      bLength: bLength,
      cLength: cLength,
      dLength: dLength,
      correctAnswer: correctAns,
      prevCorrectAnswer: prevCorrectAnswer,
      id: id,
    });
  };

  const addQuestion = (e) => {
    let randomID = Math.random();

    if (e.target.id === "survey-statement") {
      questions = survey.questions;
      fieldValue = survey.fieldValue;
      fieldValueLength = survey.fieldValueLength;
      IDS = survey.IDS;

      let newQuestion = generateSurveyObj(randomID);
      IDS.push("" + randomID);
      fieldValue.push("");
      fieldValueLength.push(0);
      questions.push(newQuestion);
      renderElements(questions, questionContainer.current);
      asignSurveyValues("survey", "");
      updateSurveyState(questions, fieldValue, fieldValueLength, IDS);
    } else if (e.target.id === "test-question") {
      question = test.question;
      questionField = test.questionField;
      questionFieldLength = test.questionFieldLength;
      questionStatement = test.questionStatement;
      a = test.a;
      b = test.b;
      c = test.c;
      d = test.d;
      aLength = test.aLength;
      bLength = test.bLength;
      cLength = test.cLength;
      dLength = test.dLength;
      correctAnswer = test.correctAnswer;
      prevCorrectAnswer = test.prevCorrectAnswer;
      IDS = test.id;

      let newQuestion = generateTestObj(randomID);

      a.push("");
      b.push("");
      c.push("");
      d.push("");
      aLength.push(0);
      bLength.push(0);
      cLength.push(0);
      dLength.push(0);
      question.push(newQuestion);
      questionField.push("");
      questionStatement.push("Wrong Answer");
      questionFieldLength.push(0);
      correctAnswer.push("");
      prevCorrectAnswer.push(null);
      IDS.push("" + randomID);
      renderElements(question, testQuestionContainer.current);
      asignTestValues();
      updateTestState(
        question,
        questionField,
        questionFieldLength,
        IDS,
        correctAnswer,
        a,
        b,
        c,
        d,
        aLength,
        bLength,
        cLength,
        dLength,
        prevCorrectAnswer,
        questionStatement
      );
    } else if (e.target.id === "sufficient") {
      sufiObj = sufficientReco.recommendationObj;
      sufiValue = sufficientReco.recommendationValue;
      sufiValueLength = sufficientReco.recommendationValueLength;
      IDS = sufficientReco.id;

      let newReco = generateRecommendationObj(randomID, "sufficient");

      IDS.push("" + randomID);
      sufiValue.push("");
      sufiValueLength.push(0);
      sufiObj.push(newReco);
      renderElements(sufiObj, sufficientContainer.current);
      asignSurveyValues("recommendation", "sufficient");
      updateSufficientRecoState(sufiObj, sufiValue, sufiValueLength, IDS);
    } else if (e.target.id === "insufficient") {
      insuObj = insufficientReco.recommendationObj;
      InsuValue = insufficientReco.recommendationValue;
      InsuValueLength = insufficientReco.recommendationValueLength;
      insuID = insufficientReco.id;

      let newReco = generateRecommendationObj(randomID, "insufficient");

      insuID.push("" + randomID);
      InsuValue.push("");
      InsuValueLength.push(0);
      insuObj.push(newReco);
      renderElements(insuObj, insufficientContainer.current);
      asignSurveyValues("recommendation", "insufficient");
      updateInsufficientRecoState(insuObj, InsuValue, InsuValueLength, insuID);
    }
  };

  const asignSurveyValues = (from, panel) => {
    if (from === "survey") {
      for (let i = 0; i < IDS.length; i++) {
        let inputRoot =
          questionContainer.current.children[i].firstChild.firstChild
            .children[1].firstChild;
        inputRoot.value =
          fieldValue[IDS.indexOf(questionContainer.current.children[i].id)];
      }
    } else if (from === "recommendation") {
      if (panel === "sufficient") {
        for (let i = 0; i < IDS.length; i++) {
          let inputRoot =
            sufficientContainer.current.children[i].firstChild.firstChild
              .children[1].firstChild;
          inputRoot.value =
            sufiValue[IDS.indexOf(sufficientContainer.current.children[i].id)];
        }
      } else if (panel === "insufficient")
        for (let i = 0; i < insuID.length; i++) {
          let inputRoot =
            insufficientContainer.current.children[i].firstChild.firstChild
              .children[1].firstChild;
          inputRoot.value =
            InsuValue[
              insuID.indexOf(insufficientContainer.current.children[i].id)
            ];
        }
    }
  };

  const asignTestValues = () => {
    let choiceRuntimes = 0;
    for (let i = 0; i < IDS.length; i++) {
      let inputRoot =
        testQuestionContainer.current.children[i].firstChild.firstChild
          .children[0].lastChild.firstChild;
      let statementRoot =
        testQuestionContainer.current.children[i].children[1].firstChild
          .firstChild.lastChild.firstChild;
      let index = IDS.indexOf(testQuestionContainer.current.children[i].id);
      inputRoot.value = questionField[index];
      statementRoot.value = questionStatement[index];
      let choicesRoot = testQuestionContainer.current.children[i].lastChild;
      for (let x = 0; x < choicesRoot.children.length; x++) {
        let choiceDiv = choicesRoot.children[x];
        for (let z = 0; z < choiceDiv.children.length; z++) {
          choiceRuntimes++;
          const choiceContainer = choiceDiv.children[z].lastChild;
          if (choiceRuntimes < 5) {
            if (choiceRuntimes === 1)
              choiceContainer.firstChild.value = a[index];
            else if (choiceRuntimes === 2)
              choiceContainer.firstChild.value = b[index];
            else if (choiceRuntimes === 3)
              choiceContainer.firstChild.value = c[index];
            else if (choiceRuntimes === 4)
              choiceContainer.firstChild.value = d[index];
          } else {
            if (correctAnswer[index] === "a") {
              prevCorrectAnswer[index] = choiceContainer.children[0].firstChild;
              choiceContainer.children[0].firstChild.firstChild.checked = true;
              choiceContainer.children[0].firstChild.setAttribute(
                "class",
                "MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root Mui-checked css-vqmohf-MuiButtonBase-root-MuiRadio-root"
              );
              choiceContainer.children[0].firstChild.children[1].lastChild.setAttribute(
                "class",
                "MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-11zohuh-MuiSvgIcon-root"
              );
            } else if (correctAnswer[index] === "b") {
              prevCorrectAnswer[index] = choiceContainer.children[2].firstChild;
              choiceContainer.children[2].firstChild.firstChild.checked = true;
              choiceContainer.children[2].firstChild.setAttribute(
                "class",
                "MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root Mui-checked css-vqmohf-MuiButtonBase-root-MuiRadio-root"
              );
              choiceContainer.children[2].firstChild.children[1].lastChild.setAttribute(
                "class",
                "MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-11zohuh-MuiSvgIcon-root"
              );
            } else if (correctAnswer[index] === "c") {
              prevCorrectAnswer[index] = choiceContainer.children[1].firstChild;
              choiceContainer.children[1].firstChild.firstChild.checked = true;
              choiceContainer.children[1].firstChild.setAttribute(
                "class",
                "MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root Mui-checked css-vqmohf-MuiButtonBase-root-MuiRadio-root"
              );
              choiceContainer.children[1].firstChild.children[1].lastChild.setAttribute(
                "class",
                "MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-11zohuh-MuiSvgIcon-root"
              );
            } else if (correctAnswer[index] === "d") {
              prevCorrectAnswer[index] = choiceContainer.children[3].firstChild;
              choiceContainer.children[3].firstChild.firstChild.checked = true;
              choiceContainer.children[3].firstChild.setAttribute(
                "class",
                "MuiRadio-root MuiRadio-colorPrimary MuiButtonBase-root MuiRadio-root MuiRadio-colorPrimary PrivateSwitchBase-root Mui-checked css-vqmohf-MuiButtonBase-root-MuiRadio-root"
              );
              choiceContainer.children[3].firstChild.children[1].lastChild.setAttribute(
                "class",
                "MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-11zohuh-MuiSvgIcon-root"
              );
            }
            choiceRuntimes = 0;
          }
        }
      }
    }
  };

  const submitData = (e) => {
    setLoading(true);
    if (e.target.id === "submit-survey") {
      let send = true;
      for (const field of survey.fieldValue) {
        if (field.length === 0) {
          send = false;
        }
        console.log(field.length);
      }

      if (send) {
        fieldValue = survey.fieldValue;
        console.log(fieldValue);
        firebase
          .firestore()
          .collection("survey")
          .doc("questions")
          .set({ fieldValue })
          .then(() => {
            console.log("survey questions saved");
            setSnackMessage({ type: "success", message: "Saved" });
            handleSnack();
            setLoading(false);
          })
          .catch((e) => {
            setSnackMessage({
              type: "error",
              message:
                "Something went wrong, check out the console for more info",
            });
            handleSnack();
            console.log(e);
            setLoading(false);
          });
      } else {
        setSnackMessage({
          type: "error",
          message: "Please don't leave any field empty",
        });
        handleSnack();
        setLoading(false);
      }
    } else if (e.target.id === "submit-test-questions") {
      let send = true;
      console.log("test");
      IDS = test.id;
      for (let i = 0; i < IDS.length; i++) {
        if (
          test.questionFieldLength[i] === 0 ||
          test.aLength[i] === 0 ||
          test.bLength[i] === 0 ||
          test.cLength[i] === 0 ||
          test.dLength[i] === 0 ||
          test.correctAnswer[i] === ""
        ) {
          send = false;
        }
        console.log("loop");
      }

      if (send) {
        console.log(test);
        question = test.questionField;
        questionStatement = test.questionStatement;
        a = test.a;
        b = test.b;
        c = test.c;
        d = test.d;
        correctAnswer = test.correctAnswer;
        console.log("send");
        firebase
          .firestore()
          .collection("test")
          .doc("question-data")
          .set({
            question,
            questionStatement,
            a,
            b,
            c,
            d,
            correctAnswer,
          })
          .then(() => {
            setSnackMessage({ type: "success", message: "Saved" });
            handleSnack();
            setLoading(false);
          })
          .catch((e) => {
            setSnackMessage({
              type: "error",
              message: "Something went wrong, check the console for more info",
            });
            handleSnack();
            console.log(e);
            setLoading(false);
          });
      } else {
        setSnackMessage({
          type: "error",
          message: "Please don't leave any field empty",
        });
        handleSnack();
        setLoading(false);
      }
    } else if (e.target.id === "submit-recommendations") {
      let send = true;
      for (const sufi of sufficientReco.recommendationValue) {
        if (sufi.length === 0) {
          send = false;
        }
      }

      for (const insu of insufficientReco.recommendationValue) {
        if (insu.length === 0) {
          send = false;
        }
      }

      if (send) {
        const sufficientValues = sufficientReco.recommendationValue;
        const insufficientValues = insufficientReco.recommendationValue;
        firebase
          .firestore()
          .collection("recommendations")
          .doc("sufficient")
          .set({ sufficientValues })
          .then(() => {
            firebase
              .firestore()
              .collection("recommendations")
              .doc("insufficient")
              .set({ insufficientValues })
              .then(() => {
                setSnackMessage({ type: "success", message: "Saved" });
                handleSnack();
                setLoading(false);
              })
              .catch((e) => {
                setSnackMessage({
                  type: "error",
                  message:
                    "Something went wrong trying to save the 'insufficient' recommendations, check the console for more details",
                });
                handleSnack();
                console.error(e.message);
                setLoading(false);
              });
          })
          .catch((e) => {
            setSnackMessage({
              type: "error",
              message:
                "Something went wrong trying to save the 'sufficient' recommendations, check the console for more details",
            });
            handleSnack();
            console.error(e.message);
            setLoading(false);
          });
      } else {
        setSnackMessage({
          type: "error",
          message: "Please don't leave any field empty",
        });
        handleSnack();
        setLoading(false);
      }
    }
  };

  const initSurvey = () => {
    if (value !== 1) {
      setDisableTab(true);
      setInitLoad(true);
      firebase
        .firestore()
        .collection("survey")
        .doc("questions")
        .get()
        .then((statements) => {
          if (statements.data() !== undefined) {
            statements.data().fieldValue.forEach((statement) => {
              let randomID = Math.random();
              let newQuestion = generateSurveyObj(randomID);
              questions.push(newQuestion);
              IDS.push("" + randomID);
              fieldValue.push(statement);
              fieldValueLength.push(statement.length);
            });
            setInitLoad(false);
            renderElements(questions, questionContainer.current);
            asignSurveyValues("survey", "");
            updateSurveyState(questions, fieldValue, fieldValueLength, IDS);
          } else {
            setInitLoad(false);
            setDisableTab(false);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const initTest = () => {
    if (value !== 2) {
      setDisableTab(true);
      setInitLoad(true);
      firebase
        .firestore()
        .collection("test")
        .doc("question-data")
        .get()
        .then((questions) => {
          if (questions.data() !== undefined) {
            let index = 0;
            questions.data().question.forEach((data) => {
              let randomID = Math.random();
              let newQuestion = generateTestObj(randomID);
              a = questions.data().a;
              b = questions.data().b;
              c = questions.data().c;
              d = questions.data().d;
              aLength.push(questions.data().a[index].length);
              bLength.push(questions.data().b[index].length);
              cLength.push(questions.data().c[index].length);
              dLength.push(questions.data().d[index].length);
              correctAnswer = questions.data().correctAnswer;
              questionField.push(data);
              questionStatement.push(questions.data().questionStatement[index]);
              questionFieldLength.push(data.length);
              question.push(newQuestion);
              IDS.push("" + randomID);
              index++;
            });
            setInitLoad(false);
            renderElements(question, testQuestionContainer.current);
            asignTestValues();
            updateTestState(
              question,
              questionField,
              questionFieldLength,
              IDS,
              correctAnswer,
              a,
              b,
              c,
              d,
              aLength,
              bLength,
              cLength,
              dLength,
              prevCorrectAnswer,
              questionStatement
            );
          } else {
            setInitLoad(false);
            setDisableTab(false);
          }
        });
    }
  };

  const initRecommendation = () => {
    if (value !== 3) {
      setDisableTab(true);
      setInitLoad(true);
      firebase
        .firestore()
        .collection("recommendations")
        .doc("sufficient")
        .get()
        .then((sufficientData) => {
          firebase
            .firestore()
            .collection("recommendations")
            .doc("insufficient")
            .get()
            .then((insufficientData) => {
              if (sufficientData.data() !== undefined) {
                sufficientData
                  .data()
                  .sufficientValues.forEach((sufficientValue) => {
                    let suffiID = Math.random();
                    let newRecoObj = generateRecommendationObj(
                      suffiID,
                      "sufficient"
                    );
                    sufiObj.push(newRecoObj);
                    sufiValue.push(sufficientValue);
                    sufiValueLength.push(sufficientValue.length);
                    IDS.push("" + suffiID);
                  });
              }
              if (insufficientData.data() !== undefined) {
                insufficientData
                  .data()
                  .insufficientValues.forEach((insufficientValue) => {
                    let insuId = Math.random();
                    let newRecoObj = generateRecommendationObj(
                      insuId,
                      "insufficient"
                    );
                    insuObj.push(newRecoObj);
                    InsuValue.push(insufficientValue);
                    InsuValueLength.push(insufficientValue.length);
                    insuID.push("" + insuId);
                  });
              }

              setInitLoad(false);
              renderElements(insuObj, insufficientContainer.current);
              renderElements(sufiObj, sufficientContainer.current);
              updateInsufficientRecoState(
                insuObj,
                InsuValue,
                InsuValueLength,
                insuID
              );
              updateSufficientRecoState(
                sufiObj,
                sufiValue,
                sufiValueLength,
                IDS
              );
              asignSurveyValues("recommendation", "sufficient");
              asignSurveyValues("recommendation", "insufficient");
            })
            .catch((e) => {
              setSnackMessage({
                type: "error",
                message: "Something went wrong fetching 'insufficient' values",
              });
              handleSnack();
              console.log(e);
            });
        })
        .catch((e) => {
          setSnackMessage({
            type: "error",
            message: "Something went wrong fetching 'sufficient' values",
          });
          handleSnack();
        });
    }
  };

  const renderElements = (elements, container) => {
    if (container !== undefined) {
      unmountComponentAtNode(container);
      reactDom.render(elements, container);
      setDisableTab(false);
    }
  };

  const [surveyResult, setSurveyResult] = useState({
    data: [],
  });

  const initSurveyRes = () => {
    let statement = [];
    let sAgree = [];
    let agree = [];
    let disagree = [];
    let sDisagree = [];
    firebase
      .firestore()
      .collection("survey")
      .doc("questions")
      .get()
      .then((statements) => {
        if (statements.data() !== undefined) {
          statements.data().fieldValue.forEach((statementValue) => {
            statement.push(statementValue);
            sAgree.push(0);
            agree.push(0);
            disagree.push(0);
            sDisagree.push(0);
          });
          firebase
            .firestore()
            .collection("survey")
            .doc("responses")
            .collection("user-responses")
            .get()
            .then((responses) => {
              responses.docs.forEach((responseData) => {
                for (let i = 0; i < statement.length; i++) {
                  const response = responseData.data().response[i];
                  let newValue = 0;
                  if (response === "Strongly Agree") {
                    newValue = sAgree[i] + 1;
                    sAgree[i] = newValue;
                  } else if (response === "Agree") {
                    newValue = agree[i] + 1;
                    agree[i] = newValue;
                  } else if (response === "Disagree") {
                    newValue = disagree[i] + 1;
                    disagree[i] = newValue;
                  } else if (response === "Strongly Disagree") {
                    newValue = sDisagree[i] + 1;
                    sDisagree[i] = newValue;
                  }
                }
              });
              let surveyObj = [];
              for (let i = 0; i < statement.length; i++) {
                surveyObj.push({
                  statement: statement[i],
                  count: i + 1,
                  sAgree: sAgree[i],
                  agree: agree[i],
                  disagree: disagree[i],
                  sDisagree: sDisagree[i],
                });
              }
              setSurveyResult({ data: surveyObj });
            });
        }
      });
  };

  useEffect(() => {
    initSurveyRes();
  }, []);

  return (
    <Grid>
      <Navigation page="A-TEST" admin={true} />

      <Box
        sx={{
          flexGrow: 1,
          bgcolor: "background.paper",
          display: "flex",
          height: "100%",
          marginTop: "15vh",
        }}
      >
        <Tabs
          orientation="vertical"
          variant="standard"
          value={value}
          onChange={handleChange}
          aria-label="Vertical tabs example"
          sx={{
            borderRight: 1,
            borderColor: "divider",
            width: "30vh",
            height: "75vh",
            marginTop: "5vh",
          }}
        >
          <Tab
            disabled={disableTab}
            className={classes.tabLabel}
            label="SURVEY RESULT"
            onClick={initSurveyRes}
            {...a11yProps(0)}
          />
          <Tab
            disabled={disableTab}
            className={classes.tabLabel}
            label="UPDATE SURVEY"
            onClick={initSurvey}
            {...a11yProps(1)}
          />
          <Tab
            disabled={disableTab}
            className={classes.tabLabel}
            label="UPDATE TEST"
            onClick={initTest}
            {...a11yProps(2)}
          />
          <Tab
            disabled={disableTab}
            className={classes.tabLabel}
            label="UPDATE RECOMMENDATION"
            onClick={initRecommendation}
            {...a11yProps(3)}
          />
        </Tabs>
        <TabPanel value={value} index={0}>
          <Grid
            style={{
              width: "160vh",
              height: "78vh",
              overflow: "auto",
              border: "1px solid black",
            }}
          >
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2vh",
              }}
            >
              <Typography variant="h5">
                <b>SURVEY RESULT</b>
              </Typography>
            </Grid>
            {surveyResult.data.map((data) => (
              <Grid key={data.count}>
                <Chart
                  width={"100vh"}
                  height={"100vh"}
                  chartType="PieChart"
                  loader={<div>Loading Chart</div>}
                  data={[
                    ["survey", "responses"],
                    ["Strongly Agree", data.sAgree],
                    ["Agree", data.agree],
                    ["Disagree", data.disagree],
                    ["Strongly Disagree", data.sDisagree],
                  ]}
                  options={{
                    title: `${data.count}. ${data.statement}`,
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          {initLoad ? (
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "78vh",
                width: "150vh",
              }}
            >
              <CircularProgress color="success" size={200} />
            </Grid>
          ) : (
            <Grid
              style={{
                textAlign: "center",
                height: "78vh",
                width: "150vh",
                border: "1px solid black",
                marginLeft: "8vh",
                overflow: "auto",
              }}
            >
              <Typography variant="h5" style={{ marginTop: "3vh" }}>
                <b>SURVEY</b>
              </Typography>
              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "2vh" }}
                onClick={addQuestion}
                id="survey-statement"
              >
                ADD SURVEY STATEMENT
              </Button>

              <Container
                style={{
                  marginTop: "5vh",
                  textAlign: "left",
                  marginLeft: "20vh",
                }}
                ref={questionContainer}
              ></Container>

              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "1vh", marginBottom: "3vh" }}
                id="submit-survey"
                onClick={submitData}
              >
                {loading ? (
                  <CircularProgress
                    color="secondary"
                    size={20}
                    sx={{ marginRight: "2vh" }}
                  />
                ) : null}
                SUBMIT
              </Button>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={value} index={2}>
          {initLoad ? (
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "78vh",
                width: "150vh",
              }}
            >
              <CircularProgress color="success" size={200} />
            </Grid>
          ) : (
            <Grid
              style={{
                textAlign: "center",
                height: "78vh",
                width: "150vh",
                border: "1px solid black",
                marginLeft: "8vh",
                overflow: "auto",
              }}
            >
              <Typography variant="h5" style={{ marginTop: "3vh" }}>
                <b>TEST QUESTIONS</b>
              </Typography>
              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "2vh" }}
                onClick={addQuestion}
                id="test-question"
              >
                ADD NEW QUESTION
              </Button>

              <Container
                style={{
                  marginTop: "5vh",
                  textAlign: "left",
                  marginLeft: "20vh",
                }}
                ref={testQuestionContainer}
              ></Container>

              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "1vh", marginBottom: "3vh" }}
                id="submit-test-questions"
                onClick={submitData}
              >
                {loading ? (
                  <CircularProgress
                    color="secondary"
                    size={20}
                    sx={{ marginRight: "2vh" }}
                  />
                ) : null}
                SUBMIT
              </Button>
            </Grid>
          )}
        </TabPanel>
        <TabPanel value={value} index={3}>
          {initLoad ? (
            <Grid
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "78vh",
                width: "150vh",
              }}
            >
              <CircularProgress color="success" size={200} />
            </Grid>
          ) : (
            <Grid
              style={{
                textAlign: "center",
                height: "78vh",
                width: "150vh",
                border: "1px solid black",
                marginLeft: "8vh",
                overflow: "auto",
              }}
            >
              <Typography variant="h5" style={{ marginTop: "3vh" }}>
                <b>RECOMMENDATION</b>
              </Typography>

              <Grid
                style={{
                  marginTop: "5vh",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Grid
                  className={classes.recommendationPanel}
                  style={{ marginRight: "10vh" }}
                >
                  <Typography variant="h6">
                    Sufficient Knowledge Reccomendation/s:
                  </Typography>
                  <Button
                    variant="contained"
                    id="sufficient"
                    onClick={addQuestion}
                    color="success"
                    style={{ marginTop: "1vh", marginBottom: "4vh" }}
                  >
                    New Recommendation
                  </Button>

                  <Container ref={sufficientContainer}></Container>
                </Grid>
                <Grid className={classes.recommendationPanel}>
                  <Typography variant="h6">
                    Insufficient Knowledge Reccomendation/s:
                  </Typography>
                  <Button
                    variant="contained"
                    id="insufficient"
                    onClick={addQuestion}
                    color="success"
                    style={{ marginTop: "1vh", marginBottom: "4vh" }}
                  >
                    New Recommendation
                  </Button>

                  <Container ref={insufficientContainer}></Container>
                </Grid>
              </Grid>

              <Button
                variant="contained"
                color="success"
                style={{ marginTop: "1vh", marginBottom: "3vh" }}
                id="submit-recommendations"
                onClick={submitData}
              >
                {loading ? (
                  <CircularProgress
                    color="secondary"
                    size={20}
                    sx={{ marginRight: "2vh" }}
                  />
                ) : null}
                SUBMIT
              </Button>
            </Grid>
          )}
        </TabPanel>
      </Box>

      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={snackMessage.type}
          sx={{ width: "100%" }}
        >
          {snackMessage.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
}
