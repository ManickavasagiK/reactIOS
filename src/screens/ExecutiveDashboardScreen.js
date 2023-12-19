import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TouchableHighlight,
  BackHandler,
  RefreshControl,
  Platform,
  Appearance,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Modal,
  Portal,
  Provider,
  Caption,
  Switch,
  TextInput,
  Snackbar,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { navigate } from "../navigationRef";
import { Ionicons } from "@expo/vector-icons";
import useExecutiveDashResults from "../hooks/useExecutiveDashResults";
import ProgressCircle from "react-native-progress-circle";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";

//colors
const cardHeaderBackgroundColor = "#e1ccff";
const cardHeaderBorderColor = "#e1ccff";
const cardHeaderTextColor = "#8833ff"; // Old #a666ff";
const progressCircleGreenStatusColor = "#aeeaae"; // Old #85e085";
const progressCircleYellowStatusColor = "#ffbd66"; // Old #FF9712";
const progressCircleRedStatusColor = "#fd7768"; // Old #FC1B04";
const progressCircleShadowColor = "#f2e6d9";
const progressCircleBackgroundColor = "#fff";
const getCurrentAppearanceMode = () => Appearance.getColorScheme(); //ADDED ON 27/11/2023 BY POOBALAN
const ExecutiveDashboardScreen = (props) => {
  //   console.log(props);

  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  // Executive Dashboard results
  const [
    getExecutiveDashboardSummaryInformationForNumberOfDays,
    executiveDashboardHistorySummaryForNumberOfDays,
    getExecutiveDashboardSummaryInformationForADay,
    executiveDashboardHistorySummaryForADay,
    getExecutiveDashboardSummaryInformationFromWorkbench,
    executiveDashboardSummaryFromWorkbench,
    errorMessage,
  ] = useExecutiveDashResults();

  // other variables
  const today = new Date();
  let opsxProps = {};

  // tooltip variables
  const [showWorkbenchSummaryTip, setShowWorkbenchSummaryTip] = useState(false);
  const [showHistorySummaryTip, setShowHistorySummaryTip] = useState(false);
  const [showHistorySummaryByDateTip, setShowHistorySummaryByDateTip] =
    useState(false);

  // State variables for this component
  const [numberOfDays, setNumberOfDays] = useState("7"); // Treating this variable as text and not number. Will change to number while calling API
  const [refreshing, setRefreshing] = useState(false);
  const [tempDate, setTempDate] = useState(today);
  const [dateTimePickerDisplayMode, setDateTimePickerDisplayMode] =
    useState("date");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  // counts and percentagesof tasks and checklists - history dashboard for number of days
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [incompleteTasks, setIncompleteTasks] = useState(0);
  const [tasksCompletedInTime, setTasksCompletedInTime] = useState(0);
  const [tasksNotCompletedInTime, setTasksNotCompletedInTime] = useState(0);
  const [unassignedTasks, setUnassignedTasks] = useState(0);
  const [totalChecklists, setTotalChecklists] = useState(0);
  const [completedChecklists, setCompletedChecklists] = useState(0);
  const [incompleteChecklists, setIncompleteChecklists] = useState(0);
  const [checklistsCompletedInTime, setChecklistsCompletedInTime] = useState(0);
  const [checklistsNotCompletedInTime, setChecklistsNotCompletedInTime] =
    useState(0);
  const [unassignedChecklists, setUnassignedChecklists] = useState(0);
  const [percentageOfCompletedTasks, setPercentageOfCompletedTasks] =
    useState(0);
  const [percentageOfIncompleteTasks, setPercentageOfIncompleteTasks] =
    useState(0);
  const [
    percentageOfTasksCompletedInTime,
    setPercentageOfTasksCompletedInTime,
  ] = useState(0);
  const [
    percentageOfTasksNotCompletedInTime,
    setPercentageOfTasksNotCompletedInTime,
  ] = useState(0);
  const [percentageOfUnassignedTasks, setPercentageOfUnassignedTasks] =
    useState(0);
  const [percentageOfCompletedChecklists, setPercentageOfCompletedChecklists] =
    useState(0);
  const [
    percentageOfIncompleteChecklists,
    setPercentageOfIncompleteChecklists,
  ] = useState(0);
  const [
    percentageOfChecklistsCompletedInTime,
    setPercentageOfChecklistsCompletedInTime,
  ] = useState(0);
  const [
    percentageOfChecklistsNotCompletedInTime,
    setPercentageOfChecklistsNotCompletedInTime,
  ] = useState(0);
  const [
    percentageOfUnassignedChecklists,
    setPercentageOfUnassignedChecklists,
  ] = useState(0);
   const [errMsg,setErrmsg]=useState("")
  // variables - history dashboard for task date
  const [taskDate, setTaskDate] = useState("");
  const [totalTasksByDate, setTotalTasksByDate] = useState(0);
  const [completedTasksByDate, setCompletedTasksByDate] = useState(0);
  const [incompleteTasksByDate, setIncompleteTasksByDate] = useState(0);
  const [tasksCompletedInTimeByDate, setTasksCompletedInTimeByDate] =
    useState(0);
  const [tasksNotCompletedInTimeByDate, setTasksNotCompletedInTimeByDate] =
    useState(0);
  const [unassignedTasksByDate, setUnassignedTasksByDate] = useState(0);
  const [totalChecklistsByDate, setTotalChecklistsByDate] = useState(0);
  const [completedChecklistsByDate, setCompletedChecklistsByDate] = useState(0);
  const [incompleteChecklistsByDate, setIncompleteChecklistsByDate] =
    useState(0);
  const [checklistsCompletedInTimeByDate, setChecklistsCompletedInTimeByDate] =
    useState(0);
  const [
    checklistsNotCompletedInTimeByDate,
    setChecklistsNotCompletedInTimeByDate,
  ] = useState(0);
  const [unassignedChecklistsByDate, setUnassignedChecklistsByDate] =
    useState(0);
  const [
    percentageOfCompletedTasksByDate,
    setPercentageOfCompletedTasksByDate,
  ] = useState(0);
  const [
    percentageOfIncompleteTasksByDate,
    setPercentageOfIncompleteTasksByDate,
  ] = useState(0);
  const [
    percentageOfTasksCompletedInTimeByDate,
    setPercentageOfTasksCompletedInTimeByDate,
  ] = useState(0);
  const [
    percentageOfTasksNotCompletedInTimeByDate,
    setPercentageOfTasksNotCompletedInTimeByDate,
  ] = useState(0);
  const [
    percentageOfUnassignedTasksByDate,
    setPercentageOfUnassignedTasksByDate,
  ] = useState(0);
  const [
    percentageOfCompletedChecklistsByDate,
    setPercentageOfCompletedChecklistsByDate,
  ] = useState(0);
  const [
    percentageOfIncompleteChecklistsByDate,
    setPercentageOfIncompleteChecklistsByDate,
  ] = useState(0);
  const [
    percentageOfChecklistsCompletedInTimeByDate,
    setPercentageOfChecklistsCompletedInTimeByDate,
  ] = useState(0);
  const [
    percentageOfChecklistsNotCompletedInTimeByDate,
    setPercentageOfChecklistsNotCompletedInTimeByDate,
  ] = useState(0);
  const [
    percentageOfUnassignedChecklistsByDate,
    setPercentageOfUnassignedChecklistsByDate,
  ] = useState(0);

  // state variables for checklist workbnch data

  const [totalTasksFromWorkbench, setTotalTasksFromWorkbench] = useState(0);
  const [completedTasksFromWorkbench, setCompletedTasksFromWorkbench] =
    useState(0);
  const [pendingTasksFromWorkbench, setPendingTasksFromWorkbench] = useState(0);
  const [
    tasksCompletedInTimeFromWorkbench,
    setTasksCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    tasksNotCompletedInTimeFromWorkbench,
    setTasksNotCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    countOfOverdueTasksFromWorkbench,
    setCountOfOverdueTasksFromWorkbench,
  ] = useState(0);
  const [unassignedTasksFromWorkbench, setUnassignedTasksFromWorkbench] =
    useState(0);
  const [totalChecklistsFromWorkbench, setTotalChecklistsFromWorkbench] =
    useState(0);
  const [
    completedChecklistsFromWorkbench,
    setCompletedChecklistsFromWorkbench,
  ] = useState(0);
  const [pendingChecklistsFromWorkbench, setPendingChecklistsFromWorkbench] =
    useState(0);
  const [
    checklistsCompletedInTimeFromWorkbench,
    setChecklistsCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    checklistsNotCompletedInTimeFromWorkbench,
    setChecklistsNotCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    countOfOverdueChecklistsFromWorkbench,
    setCountOfOverdueChecklistsFromWorkbench,
  ] = useState(0);
  const [
    unassignedChecklistsFromWorkbench,
    setUnassignedChecklistsFromWorkbench,
  ] = useState(0);
  const [
    percentageOfCompletedTasksFromWorkbench,
    setPercentageOfCompletedTasksFromWorkbench,
  ] = useState(0);
  const [
    percentageOfPendingTasksFromWorkbench,
    setPercentageOfPendingTasksFromWorkbench,
  ] = useState(0);
  const [
    percentageOfTasksCompletedInTimeFromWorkbench,
    setPercentageOfTasksCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    percentageOfTasksNotCompletedInTimeFromWorkbench,
    setPercentageOfTasksNotCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    percentageOfOverdueTasksFromWorkbench,
    setPercentageOfOverdueTasksFromWorkbench,
  ] = useState(0);
  const [
    percentageOfTasksUnassignedFromWorkbench,
    setPercentageOfTasksUnassignedFromWorkbench,
  ] = useState(0);
  const [
    percentageOfCompletedChecklistsFromWorkbench,
    setPercentageOfCompletedChecklistsFromWorkbench,
  ] = useState(0);
  const [
    percentageOfPendingChecklistsFromWorkbench,
    setPercentageOfPendingChecklistsFromWorkbench,
  ] = useState(0);
  const [
    percentageOfChecklistsCompletedInTimeFromWorkbench,
    setPercentageOfChecklistsCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    percentageOfChecklistsNotCompletedInTimeFromWorkbench,
    setPercentageOfChecklistsNotCompletedInTimeFromWorkbench,
  ] = useState(0);
  const [
    percentageOfOverdueChecklistsFromWorkbench,
    setPercentageOfOverdueChecklistsFromWorkbench,
  ] = useState(0);
  const [
    percentageOfChecklistsUnassignedFromWorkbench,
    setPercentageOfChecklistsUnassignedFromWorkbench,
  ] = useState(0);

  // useEffects

  useEffect(() => {
    console.log("Executive dashboard UE1 - back handler");
    validateToken();
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Executive dashboard UE2 - Get data required for dashboard");
    getExecutiveDashboardSummaryInformationForNumberOfDays(
      numberOfDays !== "" ? parseInt(numberOfDays) : 7,
      token.jwt
    );
    getExecutiveDashboardSummaryInformationForADay(
      convertDatetoYYYYMMDD(today),
      token.jwt
    );
    getExecutiveDashboardSummaryInformationFromWorkbench(token.jwt);
  }, []);

  // get summary dashboard information from history

  useEffect(() => {
    console.log("Executive dashboard UE3 - Received summary response");
    if (executiveDashboardHistorySummaryForNumberOfDays.status === 200) {
      //   console.log(executiveDashboardHistorySummaryForNumberOfDays.data);
      setTotalTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data.totalTasks
      );
      setCompletedTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data.completedTasks
      );
      setIncompleteTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data.incompleteTasks
      );
      setTasksCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .tasksCompletedInTime
      );
      setTasksNotCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .tasksNotCompletedInTime
      );
      setUnassignedTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data.unassignedTasks
      );
      setTotalChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data.totalChecklists
      );
      setCompletedChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data.completedChecklists
      );
      setIncompleteChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .incompleteChecklists
      );
      setChecklistsCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .checklistsCompletedInTime
      );
      setChecklistsNotCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .checklistsNotCompletedInTime
      );
      setUnassignedChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .unassignedChecklists
      );
      setPercentageOfCompletedTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfCompletedTasks
      );
      setPercentageOfIncompleteTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfIncompleteTasks
      );
      setPercentageOfTasksCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfTasksCompletedInTime
      );
      setPercentageOfTasksNotCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfTasksNotCompletedInTime
      );
      setPercentageOfUnassignedTasks(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfUnassignedTasks
      );
      setPercentageOfCompletedChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfCompletedChecklists
      );
      setPercentageOfIncompleteChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfIncompleteChecklists
      );
      setPercentageOfChecklistsCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfChecklistsCompletedInTime
      );
      setPercentageOfChecklistsNotCompletedInTime(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfChecklistsNotCompletedInTime
      );
      setPercentageOfUnassignedChecklists(
        executiveDashboardHistorySummaryForNumberOfDays.data
          .percentageOfUnassignedChecklists
      );
    }
  }, [executiveDashboardHistorySummaryForNumberOfDays]);

  useEffect(() => {
    if (executiveDashboardHistorySummaryForADay.status === 200) {
      console.log(
        "Executive dashboard U4 - Received summary response for a day"
      );
      // console.log(executiveDashboardHistorySummaryForADay.data);
      setTotalTasksByDate(
        executiveDashboardHistorySummaryForADay.data.totalTasks
      );
      setCompletedTasksByDate(
        executiveDashboardHistorySummaryForADay.data.completedTasks
      );
      setIncompleteTasksByDate(
        executiveDashboardHistorySummaryForADay.data.incompleteTasks
      );
      setTasksCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data.tasksCompletedInTime
      );
      setTasksNotCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data.tasksNotCompletedInTime
      );
      setUnassignedTasksByDate(
        executiveDashboardHistorySummaryForADay.data.unassignedTasks
      );
      setTotalChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data.totalChecklists
      );
      setCompletedChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data.completedChecklists
      );
      setIncompleteChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data.incompleteChecklists
      );
      setChecklistsCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data.checklistsCompletedInTime
      );
      setChecklistsNotCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data
          .checklistsNotCompletedInTime
      );
      setUnassignedChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data.unassignedChecklists
      );
      setPercentageOfCompletedTasksByDate(
        executiveDashboardHistorySummaryForADay.data.percentageOfCompletedTasks
      );
      setPercentageOfIncompleteTasksByDate(
        executiveDashboardHistorySummaryForADay.data.percentageOfIncompleteTasks
      );
      setPercentageOfTasksCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfTasksCompletedInTime
      );
      setPercentageOfTasksNotCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfTasksNotCompletedInTime
      );
      setPercentageOfUnassignedTasksByDate(
        executiveDashboardHistorySummaryForADay.data.percentageOfUnassignedTasks
      );
      setPercentageOfCompletedChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfCompletedChecklists
      );
      setPercentageOfIncompleteChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfIncompleteChecklists
      );
      setPercentageOfChecklistsCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfChecklistsCompletedInTime
      );
      setPercentageOfChecklistsNotCompletedInTimeByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfChecklistsNotCompletedInTime
      );
      setPercentageOfUnassignedChecklistsByDate(
        executiveDashboardHistorySummaryForADay.data
          .percentageOfUnassignedChecklists
      );
    }
  }, [executiveDashboardHistorySummaryForADay]);

  useEffect(() => {
    if (executiveDashboardSummaryFromWorkbench.status === 200) {
      // console.log(executiveDashboardSummaryFromWorkbench.data);

      setTotalTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.totalTasks
      );
      setCompletedTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.completedTasks
      );
      setPendingTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.pendingTasks
      );
      setTasksCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.tasksCompletedInTime
      );
      setTasksNotCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.tasksNotCompletedInTime
      );
      setCountOfOverdueTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.countOfOverdueTasks
      );
      setUnassignedTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.unassignedTasks
      );
      setTotalChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.totalChecklists
      );
      setCompletedChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.completedChecklists
      );
      setPendingChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.pendingChecklists
      );
      setChecklistsCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.checklistsCompletedInTime
      );
      setChecklistsNotCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.checklistsNotCompletedInTime
      );
      setCountOfOverdueChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.countOfOverdueChecklists
      );
      setUnassignedChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.unassignedChecklists
      );
      setPercentageOfCompletedTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.percentageOfCompletedTasks
      );
      setPercentageOfPendingTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.percentageOfPendingTasks
      );
      setPercentageOfTasksCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfTasksCompletedInTime
      );
      setPercentageOfTasksNotCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfTasksNotCompletedInTime
      );
      setPercentageOfOverdueTasksFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.percentageOfOverdueTasks
      );
      setPercentageOfTasksUnassignedFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data.percentageOfTasksUnassigned
      );
      setPercentageOfCompletedChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfCompletedChecklists
      );
      setPercentageOfPendingChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfPendingChecklists
      );
      setPercentageOfChecklistsCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfChecklistsCompletedInTime
      );
      setPercentageOfChecklistsNotCompletedInTimeFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfChecklistsNotCompletedInTime
      );
      setPercentageOfOverdueChecklistsFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfOverdueChecklists
      );
      setPercentageOfChecklistsUnassignedFromWorkbench(
        executiveDashboardSummaryFromWorkbench.data
          .percentageOfChecklistsUnassigned
      );
    }
    setRefreshing(false);
  }, [executiveDashboardSummaryFromWorkbench]);

  // Functions
  const onRefresh = () => {
    setRefreshing(true);
    console.log("Refreshing...");
    // Refresh history info
    if (numberOfDays !== "") {
      getExecutiveDashboardSummaryInformationForNumberOfDays(
        numberOfDays,
        token.jwt
      );
    } else {
      setNumberOfDays("7");
      getExecutiveDashboardSummaryInformationForNumberOfDays(
        numberOfDays,
        token.jwt
      );
    }

    if (taskDate !== "") {
      getExecutiveDashboardSummaryInformationForADay(
        convertDatetoYYYYMMDD(taskDate),
        token.jwt
      );
    } else {
      setTaskDate(convertDatetoYYYYMMDD(today));
      getExecutiveDashboardSummaryInformationForADay(
        convertDatetoYYYYMMDD(today),
        token.jwt
      );
    }

    // Workbench info
    getExecutiveDashboardSummaryInformationFromWorkbench(token.jwt);
  };

  const checkTime = (i) => {
    return i < 10 ? "0" + i : i;
  };

  const convertDatetoYYYYMMDD = (date) => {
    try {
      let dd = checkTime(date.getDate()),
        mm = checkTime(date.getMonth() + 1),
        yyyy = date.getFullYear();
      console.log(yyyy + "-" + mm + "-" + dd);
      return yyyy + "-" + mm + "-" + dd;
    } catch (err) {
      console.log(err);
    }
  };

  // Date picker function STARTS

  // New date time function - STARTS - 05-AUG-2022
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    if (activeDateTimeField === "TASK_DATE") {
      setTaskDate(convertDatetoYYYYMMDD(date));
    }
    hideDatePicker();
  };

  // New date time function - ENDS - 05-AUG-2022

  const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    // Following line of code prevents date picker being triggered
    // for another time even after clicking on OK
    setShowDateTimePicker(Platform.OS === "ios");
    if (currentDate !== undefined) {
      if (activeDateTimeField === "TASK_DATE") {
        setTaskDate(convertDatetoYYYYMMDD(currentDate));
      }
      console.log("Before: selected date = " + currentDate);
      setTempDate(currentDate);
      console.log("After: selected date = " + currentDate);
    } else {
      setShowDateTimePicker(false);
    }
  };
  
const validate=(number)=>{
 // const validated = text.match(/^(\d*\.{0,1}\d{0,2}$)/)
 const isNumber =number.match(/\./g);
 //console.log(isNumber)
  if (!isNaN(number) && !isNumber ) {
    
      setErrmsg("")
      setNumberOfDays(number); 
  
}
else{
  
  console.log("false")
  setErrmsg("Enter Valid Number")

}
}

// useEffect (()=>{
//  validate()
// },[numberOfDays])
  // Date picker function ENDS
  const currentMode = getCurrentAppearanceMode(); //ADDED ON 27/11/2023 BY POOBALAN
  return (
    <>
      <Appbar.Header>
        <TouchableOpacity
          onPress={() => {
            navigate("HomePage");
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24}  color={currentMode === "dark" ? "white" : "black"} //ADDED ON 27/11/2023 BY POOBALAN
           />
        </TouchableOpacity>

        <Appbar.Content title="Executive Dashboard" />
      </Appbar.Header>
      {/* Date time picker component */}
      {/* {showDateTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode={dateTimePickerDisplayMode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
        />
      )} */}

      {/* New component to support ios - 05-AUG-2022 */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={dateTimePickerDisplayMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {/* Actual page content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: currentMode === "dark" ? "#424242" : "white", //ADDED
          //REMOVE,//Added by poobalan for Dark and light Mode Theme
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Parent view for dashboard card for workbench data */}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            borderWidth: 0.5,
            borderBottomWidth: 3,
            borderColor:
            currentMode === "dark" ? "#1d1b1e" : cardHeaderBorderColor, ////Added by poobalan for Dark and light Mode Theme
         //   backgroundColor: "#FFFFFF",
            marginVertical: 3,
            borderRadius: 10,
            marginHorizontal: 8,
            height: 310,
          }}
        >
          <View
            style={{
              flex: 0.08,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
              currentMode === "dark" ? "#1d1b1e" : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED//Added by poobalan for Dark and light Mode Theme
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 0.9,
                alignItems: "center",
              }}
            >
              <Text style={{  color: currentMode === "dark" ? "white" : cardHeaderTextColor, ////Added by poobalan for Dark and light Mode ThemecardHeaderTextColor
              }}>
                Workbench summary
              </Text>
            </View>
            <View style={{ flex: 0.1, alignItems: "center" }}>
              <Tooltip
                isVisible={showWorkbenchSummaryTip}
                content={
                  <>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Workbench summary:
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Workbench summary can be used to track progress of all
                        the tasks active at the moment.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Click each of the charts in this section to get detailed
                        information.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                  </>
                }
                onClose={() => setShowWorkbenchSummaryTip(false)}
                placement="bottom"
              >
                <TouchableOpacity
                  onPress={() => {
                    console.log("Show tool tip for workbench summary");
                    setShowWorkbenchSummaryTip(true);
                  }}
                >
                  <Avatar.Icon
                    size={20}
                    icon="information-outline"
                    color={currentMode === "dark" ? "" : "white"} //color={cardHeaderBackgroundColor} ADDED//Added by poobalan for Dark and light Mode Theme
                    backgroundColor={
                      currentMode === "dark" ? "gray" : "#8833ff"
                    }
                  />
                </TouchableOpacity>
              </Tooltip>
            </View>
          </View>

          {/* View to display progress circles for tasks */}

          <View
            style={{
              flex: 0.46,
              flexDirection: "row",
              //   backgroundColor: "yellow",
            }}
          >
            {/* View for completed tasks progress circle */}
            {/* <View style={{ flexDirection: "row" }}> */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_FROM_WORKBENCH",
                      appBarTitle: "Completed tasks from workbench",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfCompletedTasksFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // //Added by poobalan for Dark and light Mode Theme
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED //Added by poobalan for Dark and light Mode Theme
                        },
                      ]}
                    >
                      {percentageOfCompletedTasksFromWorkbench + "%"}
                    </Text>
                    <Text style={[styles.tasksAndChecklistsInnerText,
                    {
                      color: currentMode === "dark" ? "white" : "black", // ADDED //Added by poobalan for Dark and light Mode Theme
                    },
                    
                   ] }>
                      {completedTasksFromWorkbench}/{totalTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}

                 
                >
                  Completed {"\n"} tasks
                </Text>
              </View>
              {/* Pending Tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_PENDING_TASKS_FROM_WORKBENCH",
                      appBarTitle: "Pending tasks from workbench",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfPendingTasksFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} ////Added by poobalan for Dark and light Mode Theme
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfPendingTasksFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {pendingTasksFromWorkbench}/{totalTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Pending {"\n"} tasks
                </Text>
              </View>
              {/* overdue tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_OVERDUE_TASKS_FROM_WORKBENCH",
                      appBarTitle: "Overdue tasks from workbench",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfOverdueTasksFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}//Added by poobalan for Dark and light Mode Theme
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfOverdueTasksFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {countOfOverdueTasksFromWorkbench}/
                      {pendingTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Overdue {"\n"} tasks
                </Text>
              </View>
              {/* Tasks completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_FROM_WORKBENCH",
                      appBarTitle: "Tasks completed in time",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfTasksCompletedInTimeFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                    //Added by poobalan for Dark and light Mode Theme
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfTasksCompletedInTimeFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {tasksCompletedInTimeFromWorkbench}/
                      {completedTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks completed {"\n"} in time
                </Text>
              </View>
              {/* Tasks not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH",
                      appBarTitle: "Tasks - Delayed completion",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfTasksNotCompletedInTimeFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfTasksNotCompletedInTimeFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {tasksNotCompletedInTimeFromWorkbench}/
                      {completedTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks not {"\n"} completed in time
                </Text>
              </View>
              {/* Unassigned tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_FROM_WORKBENCH",
                      appBarTitle: "Unassigned tasks",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfTasksUnassignedFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                    >
                  
                  <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfTasksUnassignedFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {unassignedTasksFromWorkbench}/{totalTasksFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} tasks
                </Text>
              </View>
            </ScrollView>
            {/* </View> */}
          </View>

          {/* View to display progress circles for checklists */}

          <View
            style={{
              flex: 0.46,
              flexDirection: "row",
              //   backgroundColor: "cyan",
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_FROM_WORKBENCH",
                      appBarTitle: "Completed checklists",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfCompletedChecklistsFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                      <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfCompletedChecklistsFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {completedChecklistsFromWorkbench}/
                      {totalChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Completed {"\n"} checklists
                </Text>
              </View>
              {/* Pending checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_PENDING_CHECKLISTS_FROM_WORKBENCH",
                      appBarTitle: "Pending checklists",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfPendingChecklistsFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfPendingChecklistsFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {pendingChecklistsFromWorkbench}/
                      {totalChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Pending {"\n"} checklists
                </Text>
              </View>
              {/* Overdue checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_OVERDUE_CHECKLISTS_FROM_WORKBENCH",
                      appBarTitle: "Overdue checklists",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfOverdueChecklistsFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                   <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfOverdueChecklistsFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {countOfOverdueChecklistsFromWorkbench}/
                      {pendingChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Overdue {"\n"} checklists
                </Text>
              </View>
              {/* Checklists completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_FROM_WORKBENCH",
                      appBarTitle: "Completed in time",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfChecklistsCompletedInTimeFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfChecklistsCompletedInTimeFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {checklistsCompletedInTimeFromWorkbench}/
                      {completedChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} completed {"\n"} in time
                </Text>
              </View>
              {/* Checklists not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH",
                      appBarTitle: "Not completed in time",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={
                      percentageOfChecklistsNotCompletedInTimeFromWorkbench
                    }
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfChecklistsNotCompletedInTimeFromWorkbench +
                        "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}>
                      {checklistsNotCompletedInTimeFromWorkbench}/
                      {completedChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} not completed {"\n"} in time
                </Text>
              </View>
              {/* Unassigned checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_FROM_WORKBENCH",
                      appBarTitle: "Unassigned checklists",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfChecklistsUnassignedFromWorkbench}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfChecklistsUnassignedFromWorkbench + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {unassignedChecklistsFromWorkbench}/
                      {totalChecklistsFromWorkbench}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} checklists
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Parent view for dashboard card for number of days */}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            borderWidth: 0.5,
            borderBottomWidth: 3,
            borderColor:
              currentMode === "dark" ? "#1d1b1e" : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED
            // backgroundColor: currentMode === "dark" ? "grey" : "white", //"#FFFFFF",
            marginVertical: 3,
            borderRadius: 10,
            marginHorizontal: 8,
            height: 380,
          }}
        >
          <View
            style={{
              flex: 0.06,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
                currentMode === "dark" ? "#1d1b1e" : cardHeaderBackgroundColor, // cardHeaderBackgroundColor, ADDED
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 0.9,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: currentMode === "dark" ? "white" : cardHeaderTextColor, //cardHeaderTextColor
                }}
              >
                History summary - Last {numberOfDays} days
              </Text>
            </View>
            <View style={{ flex: 0.1, alignItems: "center" }}>
              <Tooltip
                isVisible={showHistorySummaryTip}
                content={
                  <>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Workbench history summary:
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Workbench history summary displays data from history.
                        This helps to assess performance of employees or to look
                        back on any completed task.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        To view information for a larger period, enter number of
                        days and click REFRESH.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Progress circle in this section is only informative and
                        cannot take you to detail screen.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                  </>
                }
                onClose={() => setShowHistorySummaryTip(false)}
                placement="top"
              >
                <TouchableOpacity
                  onPress={() => {
                    // console.log("Show tool tip for workbench summary");
                    setShowHistorySummaryTip(true);
                  }}
                >
                  <Avatar.Icon
                    size={20}
                    icon="information-outline"
                    color={currentMode === "dark" ? "" : "white"} //color={cardHeaderBackgroundColor} ADDED
                    backgroundColor={
                      currentMode === "dark" ? "gray" : "#8833ff"
                    }
                    //color={cardHeaderBackgroundColor}
                  />
                </TouchableOpacity>
              </Tooltip>
            </View>
          </View>
          {/* Filter field and refresh button */}
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              //   backgroundColor: "#CCE6FF",
            }}
          >
            <View
              style={{
                flex: 0.5,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                dense="true"
                label="Number of days"
                keyboardType={
                  Platform.OS === "android"
                    ? "numeric"
                    : Platform.OS === "ios"
                    ? "number-pad"
                    : "default"
                }
                value={numberOfDays}
                onChangeText={
                 validate
               // }
                  // (text) => {
                  
                  // numberOfDays<=0 && numberOfDays !=""?setNumberOfDays(text):setErrmsg("Enter Valid number");setNumberOfDays("")
                //}
              }
              />
            </View>
           
            <View
              style={{
                flex: 0.5,
                padding: 10,
              }}
            >
              <TouchableOpacity
                mode="contained"
                
                
               
                onPress={() => {
                  setErrmsg("")
                  console.log("Refresh history summary");
                 
                  getExecutiveDashboardSummaryInformationForNumberOfDays(
                    numberOfDays !== "" ? parseInt(numberOfDays) : 7,
                    token.jwt
                  );
                  numberOfDays === "" ? setNumberOfDays(7) : null; // if refresh is clicked when field is blank. Auto assign 7 to number of days.
                }}
              >
                
               <Text style={{backgroundColor:'blue', color:'white',height:50, borderRadius:20, textAlign:'center', padding:15, fontWeight:'500'}}>Refresh</Text> 
              </TouchableOpacity>
            </View>
          </View>
          
          <View >
              <Text style={{color:'red',paddingLeft:12 }}>
              {// numberOfDays? 
              errMsg
              //:null
              
             }
              </Text>
             </View>
             {/* View to display progress circles for tasks */}
          <View
            style={{
              flex: 0.37,
              flexDirection: "row",
             // marginTop:2
              //   backgroundColor: "yellow",
            }}
          >
            {/* View for completed tasks progress circle */}
            {/* <View style={{ flexDirection: "row" }}> */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfCompletedTasks}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleGreenStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfCompletedTasks + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {completedTasks}/{totalTasks}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Completed {"\n"} tasks
                </Text>
              </View>
              {/* Incomplete Tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfIncompleteTasks}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleRedStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfIncompleteTasks + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {incompleteTasks}/{totalTasks}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Incomplete {"\n"} tasks
                </Text>
              </View>
              {/* Tasks completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfTasksCompletedInTime}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleGreenStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                 <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfTasksCompletedInTime + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {tasksCompletedInTime}/{completedTasks}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks completed {"\n"} in time
                </Text>
              </View>
              {/* Tasks not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfTasksNotCompletedInTime}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleRedStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                 <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfTasksNotCompletedInTime + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {tasksNotCompletedInTime}/{completedTasks}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks not {"\n"} completed in time
                </Text>
              </View>
              {/* Unassigned tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfUnassignedTasks}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleYellowStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCi
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfUnassignedTasks + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {unassignedTasks}/{totalTasks}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} tasks
                </Text>
              </View>
            </ScrollView>
            {/* </View> */}
          </View>

          {/* View to display progress circles for checklists */}

          <View
            style={{
              flex: 0.37,
              flexDirection: "row",
              //   backgroundColor: "cyan",
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfCompletedChecklists}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleGreenStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                 <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfCompletedChecklists + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {completedChecklists}/{totalChecklists}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Completed {"\n"} checklists
                </Text>
              </View>
              {/* Incomplete checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfIncompleteChecklists}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleRedStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfIncompleteChecklists + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {incompleteChecklists}/{totalChecklists}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Incomplete {"\n"} checklists
                </Text>
              </View>
              {/* Checklists completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfChecklistsCompletedInTime}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleGreenStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfChecklistsCompletedInTime + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {checklistsCompletedInTime}/{completedChecklists}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} completed {"\n"} in time
                </Text>
              </View>
              {/* Checklists not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfChecklistsNotCompletedInTime}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleRedStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                  <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfChecklistsNotCompletedInTime + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {checklistsNotCompletedInTime}/{completedChecklists}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} not completed {"\n"} in time
                </Text>
              </View>
              {/* Unassigned checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <ProgressCircle
                  percent={percentageOfUnassignedChecklists}
                  radius={45}
                  borderWidth={5}
                  color={progressCircleYellowStatusColor}
                  shadowColor={progressCircleShadowColor}
                  bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                >
                 <Text
                    style={[
                      styles.tasksAndChecklistsPercentText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {percentageOfUnassignedChecklists + "%"}
                  </Text>
                  <Text
                    style={[
                      styles.tasksAndChecklistsInnerText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >
                    {unassignedChecklists}/{totalChecklists}
                  </Text>
                </ProgressCircle>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} checklists
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
        {/* Parent view for dashboard card for selected date */}
        <View
          style={{
            flexDirection: "column",
            flex: 1,
            borderWidth: 0.5,
            borderBottomWidth: 3,
            borderColor:
              currentMode === "dark" ? "#1d1b1e" : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED
            //backgroundColor: currentMode === "dark" ? "grey" : "white", // "#FFFFFF",
            marginVertical: 3,
            borderRadius: 10,
            marginHorizontal: 8,
            height: 380,
          }}
        >
          <View
            style={{
              flex: 0.06,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor:
              currentMode === "dark" ? "#1d1b1e" : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 0.9,
                alignItems: "center",
              }}
            >
               <Text
                style={{
                  color:
                    currentMode === "dark"
                      ? "white"
                      :  cardHeaderTextColor, //cardHeaderTextColor
                }}
              >
                History summary - For selected date
              </Text>
            </View>
            <View style={{ flex: 0.1, alignItems: "center" }}>
              <Tooltip
                isVisible={showHistorySummaryByDateTip}
                content={
                  <>
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Workbench history summary for selected date:
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Using this section history data for any date can be
                        fetched.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Use the date input field to select a date and click
                        REFRESH to get required information.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Then, Click on desired chart to see detailed
                        information.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                  </>
                }
                onClose={() => setShowHistorySummaryByDateTip(false)}
                placement="top"
              >
                <TouchableOpacity
                  onPress={() => {
                    // console.log("Show tool tip for workbench summary");
                    setShowHistorySummaryByDateTip(true);
                  }}
                >
                  <Avatar.Icon
                    size={20}
                    icon="information-outline"
                    color={currentMode === "dark" ? "" : "white"} //color={cardHeaderBackgroundColor} ADDED
                    backgroundColor={
                      currentMode === "dark" ? "gray" : "#8833ff"
                    }
                    //color={cardHeaderBackgroundColor}
                  />
                </TouchableOpacity>
              </Tooltip>
            </View>
          </View>
          {/* Filter field and refresh button */}
          <View
            style={{
              flex: 0.2,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              //   backgroundColor: "#CCE6FF",
            }}
          >
            <View
              style={{
                flex: 0.5,
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                // style={styles.textInputStyle}
                // mode={textInputMode}
                dense={true}
                // maxLength={textInputMaxLength}
                label="Task Date"
                // placeholder="Checklist Number"
                value={taskDate}
                editable={false}
                right={
                  <TextInput.Icon
                  
                    icon="calendar-range"
                    onPressIn={() => {
                      setActiveDateTimeField("TASK_DATE");
                      setDateTimePickerDisplayMode("date");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setPromisedDeliveryDate(text)}
                outlineColor="#6200ee"
              />
            </View>
            <View
              style={{
                flex: 0.5,
                padding: 10,
              }}
            >
              <TouchableOpacity
                mode="contained"
               
                onPress={() => {
                  console.log("Refresh history summary by date");
                  getExecutiveDashboardSummaryInformationForADay(
                    taskDate !== "" ? taskDate : convertDatetoYYYYMMDD(today),
                    token.jwt
                  );
                  numberOfDays === ""
                    ? setTaskDate(convertDatetoYYYYMMDD(today))
                    : null; // if refresh is clicked when field is blank. Auto assign today's date.
                }}
              >
                
              <Text style={{backgroundColor:'blue', color:'white',height:50, borderRadius:20, textAlign:'center', padding:15, fontWeight:'500'}}>Refresh</Text> 
              </TouchableOpacity>
            </View>
          </View>
          {/* View to display progress circles for tasks */}

          <View
            style={{
              flex: 0.37,
              flexDirection: "row",
              //   backgroundColor: "yellow",
            }}
          >
            {/* View for completed tasks progress circle */}
            {/* <View style={{ flexDirection: "row" }}> */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Completed tasks from history",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfCompletedTasksByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfCompletedTasksByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {completedTasksByDate}/{totalTasksByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Completed {"\n"} tasks
                </Text>
              </View>
              {/* Incomplete Tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_INCOMPLETE_TASKS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Incomplete tasks",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfIncompleteTasksByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                   <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfIncompleteTasksByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {incompleteTasksByDate}/{totalTasksByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Incomplete {"\n"} tasks
                </Text>
              </View>
              {/* Tasks completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Completed in time",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfTasksCompletedInTimeByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfTasksCompletedInTimeByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {tasksCompletedInTimeByDate}/{completedTasksByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks completed {"\n"} in time
                </Text>
              </View>
              {/* Tasks not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Not completed in time",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfTasksNotCompletedInTimeByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                   <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfTasksNotCompletedInTimeByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {tasksNotCompletedInTimeByDate}/{completedTasksByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Tasks not {"\n"} completed in time
                </Text>
              </View>
              {/* Unassigned tasks */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Unassigned tasks",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "TASK",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfUnassignedTasksByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfUnassignedTasksByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {unassignedTasksByDate}/{totalTasksByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} tasks
                </Text>
              </View>
            </ScrollView>
            {/* </View> */}
          </View>

          {/* View to display progress circles for checklists */}

          <View
            style={{
              flex: 0.37,
              flexDirection: "row",
              //   backgroundColor: "cyan",
            }}
          >
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ flexDirection: "row" }}
            >
              {/* Completed checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Completed tasks from history",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfCompletedChecklistsByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                  <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfCompletedChecklistsByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {completedChecklistsByDate}/{totalChecklistsByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Completed {"\n"} checklists
                </Text>
              </View>
              {/* Incomplete checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_INCOMPLETE_CHECKLISTS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Incomplete checklists",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfIncompleteChecklistsByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfIncompleteChecklistsByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {incompleteChecklistsByDate}/{totalChecklistsByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Incomplete {"\n"} checklists
                </Text>
              </View>
              {/* Checklists completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Completed in time",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfChecklistsCompletedInTimeByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleGreenStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                    <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfChecklistsCompletedInTimeByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {checklistsCompletedInTimeByDate}/
                      {completedChecklistsByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} completed {"\n"} in time
                </Text>
              </View>
              {/* Checklists not completed in time */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Not completed in time",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfChecklistsNotCompletedInTimeByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleRedStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor={progressCircleBackgroundColor}
                  >
                     <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfChecklistsNotCompletedInTimeByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {checklistsNotCompletedInTimeByDate}/
                      {completedChecklistsByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Checklists {"\n"} not completed {"\n"} in time
                </Text>
              </View>
              {/* Unassigned checklists */}
              <View style={{ padding: 3, width: 100 }}>
                <TouchableOpacity
                  // style={{ backgroundColor: "#CCFFCC" }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      dashboardDetailType:
                        "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_BY_DATE_FROM_HISTORY",
                      appBarTitle: "Unassigned checklists",
                      taskDate: taskDate,
                      sourceOfData: "HISTORY",
                      mode: "READ_ONLY",
                      formType: "CHECKLIST",
                    };
                    navigate("DashboardDetail", opsxProps);
                  }}
                >
                  <ProgressCircle
                    percent={percentageOfUnassignedChecklistsByDate}
                    radius={45}
                    borderWidth={5}
                    color={progressCircleYellowStatusColor}
                    shadowColor={progressCircleShadowColor}
                    bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor={progressCircleBackgroundColor}
                  >
                   <Text
                      style={[
                        styles.tasksAndChecklistsPercentText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {percentageOfUnassignedChecklistsByDate + "%"}
                    </Text>
                    <Text
                      style={[
                        styles.tasksAndChecklistsInnerText,
                        {
                          color: currentMode === "dark" ? "white" : "black", // ADDED
                        },
                      ]}
                    >
                      {unassignedChecklistsByDate}/{totalChecklistsByDate}
                    </Text>
                  </ProgressCircle>
                </TouchableOpacity>
                <Text
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    margin: 5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                  Unassigned {"\n"} checklists
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  tasksAndChecklistsPercentText: {
    fontSize: 18,
  },
  tasksAndChecklistsInnerText: {
    fontSize: 12,
  },
  tasksAndChecklistsOuterText: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: 10,
  },
  btn:{
    backgroundColor:'#CCFFCC'

  }
});

export default ExecutiveDashboardScreen;
