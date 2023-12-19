import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Card,
  Modal,
  Portal,
  Avatar,
  Badge,
  ActivityIndicator,
  Title,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import { SearchBar } from "react-native-elements";
import useDashDetailResults from "../hooks/useDashDetailResults";
import useEmployeePicResults from "../hooks/useEmployeePicResults";
import useExecDashDetailResults from "../hooks/useExecDashDetailResults";
const getCurrentAppearanceMode = () => Appearance.getColorScheme(); ////ADDED ON 27/11/2023 BY POOBALAN
const DashboardDetailScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);
  //For supervisor dashboard
  const [
    getCompletedTasksByReportingEmployees,
    completedTasksByReportingEmployeesResults,
    getPendingTasksByReportingEmployees,
    pendingTasksByReportingEmployeesResults,
    getUnassignedTasksByReportingEmployees,
    unassignedTasksByReportingEmployeesResults,
    getOverdueTasksByReportingEmployees,
    overdueTasksByReportingEmployeesResults,
    getCompletedChecklistsBySupervisor,
    completedChecklistsBySupervisorResults,
    getChecklistsNotCompletedOnTimeBySuperVisor,
    checklistsBySupervisorNotCompletedOnTimeResults,
    overdueChecklistsBySupervisor,
    overdueChecklistsBySupervisorResult,
    pendingChecklistsBySupervisor,
    pendingChecklistsBySupervisorResult,
    errorMessage,
  ] = useDashDetailResults();

  //For executive dashboard
  const [
    // From workbench
    getCompletedTasksFromWorkbench,
    completedTasksFromWorkbench,
    getPendingTasksFromWorkbench,
    pendingTasksFromWorkbench,
    getOverdueTasksFromWorkbench,
    overdueTasksFromWorkbench,
    getTasksCompletedInTimeFromWorkbench,
    tasksCompletedInTimeFromWorkbench,
    getTasksNotCompletedInTimeFromWorkbench,
    tasksNotCompletedInTimeFromWorkbench,
    getUnassignedTasksFromWorkbench,
    unassignedTasksFromWorkbench,
    getCompletedChecklistsFromWorkbench,
    completedChecklistsFromWorkbench,
    getPendingChecklistsFromWorkbench,
    pendingChecklistsFromWorkbench,
    getOverdueChecklistsFromWorkbench,
    overdueChecklistsFromWorkbench,
    getChecklistsCompletedInTimeFromWorkbench,
    checklistsCompletedInTimeFromWorkbench,
    getChecklistsNotCompletedInTimeFromWorkbench,
    checklistsNotCompletedInTimeFromWorkbench,
    getUnassignedChecklistsFromWorkbench,
    unassignedChecklistsFromWorkbench,
    //From history
    getCompletedTasksByDateFromHistory,
    completedTasksByDateFromHistory,
    getIncompleteTasksByDateFromHistory,
    incompleteTasksByDateFromHistory,
    getTasksCompletedInTimeByDateFromHistory,
    tasksCompletedInTimeByDateFromHistory,
    getTasksNotCompletedInTimeByDateFromHistory,
    tasksNotCompletedInTimeByDateFromHistory,
    getUnassignedTasksByDateFromHistory,
    unassignedTasksByDateFromHistory,
    getCompletedChecklistsByDateFromHistory,
    completedChecklistsByDateFromHistory,
    getIncompleteChecklistsByDateFromHistory,
    incompleteChecklistsByDateFromHistory,
    getChecklistsCompletedInTimeByDateFromHistory,
    checklistsCompletedInTimeByDateFromHistory,
    getChecklistsNotCompletedInTimeByDateFromHistory,
    checklistsNotCompletedInTimeByDateFromHistory,
    getUnassignedChecklistsByDateFromHistory,
    unassignedChecklistsByDateFromHistory,
    // Error message from dash detail hook
    execErrorMessage,
  ] = useExecDashDetailResults();

  // Employee profile pic
  const [
    getEmployeePic,
    employeePicResults,
    getPicsOfMultipleEmployees,
    picsOfMultipleEmployeesResults,
    empPicErrorMessage,
  ] = useEmployeePicResults();

  const [appBarTitle, setAppBarTitle] = useState("");
  const [listData, setListData] = useState([]);
  const [isAccordionExpanded, setIsAccordionExpanded] = useState(false);
  const [uniqueEmployeeNumbers, setUniqueEmployeeNumbers] = useState([]);
  const [preparedListData, setPreparedListData] = useState([]);
  const [flatListData, setFlatListData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  const [employeeBase64PicList, setemployeeBase64PicList] = useState([]);

  // Empty screen message
  const [emptyScreenMessage, setEmptyScreenMessage] = useState("");

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalFlatListData, setModalFlatListData] = useState([]);
  const [activeEmployeeForModal, setActiveEmployeeForModal] = useState("");
  const containerStyle = {
    backgroundColor: "white",
    // padding:10,
    width: "80%",
    height: 500,
    borderRadius: 10,
  
  };

  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(true);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(true);

  var uniqueValues = []; // Can be employee or division or area or  BU
  let opsxProps = {};

  useEffect(() => {
    validateToken();
    // console.log("nav param : " + JSON.stringify(props.navigation.state.params));
    if (props.navigation.state.params.dashboardDetailType) {
      if (
        props.navigation.state.params.dashboardDetailType ===
        "COMPLETED_TASKS_BY_REPORTING_EMPLOYEES"
      ) {
        getCompletedTasksByReportingEmployees(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No completed tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "PENDING_TASKS_BY_REPORTING_EMPLOYEES"
      ) {
        getPendingTasksByReportingEmployees(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No pending tasks");
        // setAppBarTitle(props.navigation.state.params.appBarTitle);
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "OVERDUE_TASKS_BY_REPORTING_EMPLOYEES"
      ) {
        getOverdueTasksByReportingEmployees(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No overdue tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "UNASSIGNED_TASKS_BY_REPORTING_EMPLOYEES"
      ) {
        getUnassignedTasksByReportingEmployees(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No unassigned tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "PENDING_CHECKLISTS_BY_SUPERVISOR"
      ) {
        pendingChecklistsBySupervisor(token.jwt, token.content.employeeNumber);
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "COMPLETED_CHECKLISTS_BY_SUPERVISOR"
      ) {
        getCompletedChecklistsBySupervisor(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No completed checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "CHECKLISTS_BY_SUPERVISOR_NOT_COMPLETED_IN_TIME"
      ) {
        getChecklistsNotCompletedOnTimeBySuperVisor(
          token.jwt,
          token.content.employeeNumber
        );
        setEmptyScreenMessage("No checklists with delayed completion");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "OVERDUE_CHECKLISTS_BY_SUPERVISOR"
      ) {
        overdueChecklistsBySupervisor(token.jwt, token.content.employeeNumber);
        setEmptyScreenMessage("No overdue checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_FROM_WORKBENCH"
      ) {
        getCompletedTasksFromWorkbench(token.jwt);
        setEmptyScreenMessage("No completed tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_PENDING_TASKS_FROM_WORKBENCH"
      ) {
        getPendingTasksFromWorkbench(token.jwt);
        setEmptyScreenMessage("No pending tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_OVERDUE_TASKS_FROM_WORKBENCH"
      ) {
        getOverdueTasksFromWorkbench(token.jwt);
        setEmptyScreenMessage("No overdue tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_FROM_WORKBENCH"
      ) {
        getTasksCompletedInTimeFromWorkbench(token.jwt);
        setEmptyScreenMessage("No tasks completed in time");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH"
      ) {
        getTasksNotCompletedInTimeFromWorkbench(token.jwt);
        setEmptyScreenMessage("No tasks completed after due");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_FROM_WORKBENCH"
      ) {
        getUnassignedTasksFromWorkbench(token.jwt);
        setEmptyScreenMessage("No unassigned tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_FROM_WORKBENCH"
      ) {
        getCompletedChecklistsFromWorkbench(token.jwt);
        setEmptyScreenMessage("No completed checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_PENDING_CHECKLISTS_FROM_WORKBENCH"
      ) {
        getPendingChecklistsFromWorkbench(token.jwt);
        setEmptyScreenMessage("No pending checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_OVERDUE_CHECKLISTS_FROM_WORKBENCH"
      ) {
        getOverdueChecklistsFromWorkbench(token.jwt);
        setEmptyScreenMessage("No overdue checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_FROM_WORKBENCH"
      ) {
        getChecklistsCompletedInTimeFromWorkbench(token.jwt);
        setEmptyScreenMessage("No checklists completed in time");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH"
      ) {
        getChecklistsNotCompletedInTimeFromWorkbench(token.jwt);
        setEmptyScreenMessage("No checklists completed after due");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_FROM_WORKBENCH"
      ) {
        getUnassignedChecklistsFromWorkbench(token.jwt);
        setEmptyScreenMessage("No unassigned checklists");
      } // By date from history table
      else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_BY_DATE_FROM_HISTORY"
      ) {
        getCompletedTasksByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No completed tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_INCOMPLETE_TASKS_BY_DATE_FROM_HISTORY"
      ) {
        getIncompleteTasksByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No incomplete tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
      ) {
        getTasksCompletedInTimeByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No tasks completed in time");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
      ) {
        getTasksNotCompletedInTimeByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No tasks completed after due");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_BY_DATE_FROM_HISTORY"
      ) {
        getUnassignedTasksByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No unassigned tasks");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_BY_DATE_FROM_HISTORY"
      ) {
        getCompletedChecklistsByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No completed checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_INCOMPLETE_CHECKLISTS_BY_DATE_FROM_HISTORY"
      ) {
        getIncompleteChecklistsByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No incomplete checklists");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
      ) {
        getChecklistsCompletedInTimeByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No checklists completed in time");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
      ) {
        getChecklistsNotCompletedInTimeByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No checklists completed after due");
      } else if (
        props.navigation.state.params.dashboardDetailType ===
        "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_BY_DATE_FROM_HISTORY"
      ) {
        getUnassignedChecklistsByDateFromHistory(
          props.navigation.state.params.taskDate,
          token.jwt
        );
        setEmptyScreenMessage("No unassigned checklists");
      }
      // common to all above conditions
      setAppBarTitle(props.navigation.state.params.appBarTitle);
    }
    console.log("UE1");

    //handling backpress - should be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // useEffect to assign supervisor dashboard data

  useEffect(() => {
    console.log("UE2");
    // console.log(pendingTasksByReportingEmployeesResults.data);
    if (
      props.navigation.state.params.dashboardDetailType ===
      "COMPLETED_TASKS_BY_REPORTING_EMPLOYEES"
    ) {
      setListData(completedTasksByReportingEmployeesResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "PENDING_TASKS_BY_REPORTING_EMPLOYEES"
    ) {
      setListData(pendingTasksByReportingEmployeesResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "OVERDUE_TASKS_BY_REPORTING_EMPLOYEES"
    ) {
      setListData(overdueTasksByReportingEmployeesResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "UNASSIGNED_TASKS_BY_REPORTING_EMPLOYEES"
    ) {
      setListData(unassignedTasksByReportingEmployeesResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "PENDING_CHECKLISTS_BY_SUPERVISOR"
    ) {
      console.log("inside pending checlist");
      setListData(pendingChecklistsBySupervisorResult.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "COMPLETED_CHECKLISTS_BY_SUPERVISOR"
    ) {
      setListData(completedChecklistsBySupervisorResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "CHECKLISTS_BY_SUPERVISOR_NOT_COMPLETED_IN_TIME"
    ) {
      setListData(checklistsBySupervisorNotCompletedOnTimeResults.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "OVERDUE_CHECKLISTS_BY_SUPERVISOR"
    ) {
      setListData(overdueChecklistsBySupervisorResult.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_FROM_WORKBENCH"
    ) {
      setListData(completedTasksFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_PENDING_TASKS_FROM_WORKBENCH"
    ) {
      setListData(pendingTasksFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_OVERDUE_TASKS_FROM_WORKBENCH"
    ) {
      setListData(overdueTasksFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_FROM_WORKBENCH"
    ) {
      setListData(tasksCompletedInTimeFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH"
    ) {
      setListData(tasksNotCompletedInTimeFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_FROM_WORKBENCH"
    ) {
      setListData(unassignedTasksFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_FROM_WORKBENCH"
    ) {
      setListData(completedChecklistsFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_PENDING_CHECKLISTS_FROM_WORKBENCH"
    ) {
      setListData(pendingChecklistsFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_OVERDUE_CHECKLISTS_FROM_WORKBENCH"
    ) {
      setListData(overdueChecklistsFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_FROM_WORKBENCH"
    ) {
      setListData(checklistsCompletedInTimeFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_FROM_WORKBENCH"
    ) {
      setListData(checklistsNotCompletedInTimeFromWorkbench.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_FROM_WORKBENCH"
    ) {
      setListData(unassignedChecklistsFromWorkbench.data);
    } // Data by date from history starts
    else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_COMPLETED_TASKS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(completedTasksByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_INCOMPLETE_TASKS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(incompleteTasksByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_TASKS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
    ) {
      setListData(tasksCompletedInTimeByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_TASKS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
    ) {
      setListData(tasksNotCompletedInTimeByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_UNASSIGNED_TASKS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(unassignedTasksByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_COMPLETED_CHECKLISTS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(completedChecklistsByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_INCOMPLETE_CHECKLISTS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(incompleteChecklistsByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_CHECKLISTS_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
    ) {
      setListData(checklistsCompletedInTimeByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_CHECKLISTS_NOT_COMPLETED_IN_TIME_BY_DATE_FROM_HISTORY"
    ) {
      setListData(checklistsNotCompletedInTimeByDateFromHistory.data);
    } else if (
      props.navigation.state.params.dashboardDetailType ===
      "EXECUTIVE_DASHBOARD_UNASSIGNED_CHECKLISTS_BY_DATE_FROM_HISTORY"
    ) {
      setListData(unassignedChecklistsByDateFromHistory.data);
    }

    // hide activity monitor when results are loaded
    hideActivityIndicatorModal();
    setPreparedListData([]);
  }, [
    completedTasksByReportingEmployeesResults,
    pendingTasksByReportingEmployeesResults,
    overdueTasksByReportingEmployeesResults,
    unassignedTasksByReportingEmployeesResults,
    pendingChecklistsBySupervisorResult,
    completedChecklistsBySupervisorResults,
    checklistsBySupervisorNotCompletedOnTimeResults,
    overdueChecklistsBySupervisorResult,
    // Executive dashboard detail from workbench starts
    completedTasksFromWorkbench,
    pendingTasksFromWorkbench,
    overdueTasksFromWorkbench,
    tasksCompletedInTimeFromWorkbench,
    tasksNotCompletedInTimeFromWorkbench,
    unassignedTasksFromWorkbench,
    completedChecklistsFromWorkbench,
    pendingChecklistsFromWorkbench,
    overdueChecklistsFromWorkbench,
    checklistsCompletedInTimeFromWorkbench,
    checklistsNotCompletedInTimeFromWorkbench,
    unassignedChecklistsFromWorkbench,
    // Executive dashboard detail by date from history starts
    completedTasksByDateFromHistory,
    incompleteTasksByDateFromHistory,
    tasksCompletedInTimeByDateFromHistory,
    tasksNotCompletedInTimeByDateFromHistory,
    unassignedTasksByDateFromHistory,
    completedChecklistsByDateFromHistory,
    incompleteChecklistsByDateFromHistory,
    checklistsCompletedInTimeByDateFromHistory,
    checklistsNotCompletedInTimeByDateFromHistory,
    unassignedChecklistsByDateFromHistory,
  ]);

  useEffect(() => {
    console.log("UE3");
    setPreparedListData([]); // This line is very important. Helps Avatar image re-render and stops accumulation of duplicate records in flat list.
    listData ? prepareDataForListAccordion(listData) : null;

    let listOfEmployees = [];
    if (listData !== undefined) {
      if (listData.length !== 0 && !picsOfMultipleEmployeesResults.data) {
        console.log("Inside function to call fetch emp pics");
        for (let i = 0; i < listData.length; i++) {
          let tempEmpObject = {
            employeeId: listData[i].employeeNumber,
            employeeName: "",
          };
          listOfEmployees.push(tempEmpObject);
        }
        getPicsOfMultipleEmployees(token.jwt, listOfEmployees);
      }
    }
    // console.log(listOfEmployees);
  }, [listData, employeeBase64PicList]);

  useEffect(() => {
    console.log("UE4");
    preparedListData ? setSearchFunctionArrayHolder(preparedListData) : null;
    setFlatListData(preparedListData);
   // console.log("flatlist",flatListData)
   //  console.log("preparedListData",preparedListData);
  }, [preparedListData]);

  useEffect(() => {
    console.log("UE5");
    if (picsOfMultipleEmployeesResults.status) {
      if (
        picsOfMultipleEmployeesResults.status === 200 &&
        picsOfMultipleEmployeesResults.data.length > 0
      ) {
        // console.log(picsOfMultipleEmployeesResults.data);
        var tempPictureArray = picsOfMultipleEmployeesResults.data.map(
          (res) => ({
            employeeNumber: res.employeeId,
            title: res.pictureName,
            caption: res.lastUpdatedDate + " " + res.lastUpdatedTime,
            url:
              "data:" +
              res.pictureType +
              ";base64," +
              res.pictureByteArray +
              "",
          })
        );
        setemployeeBase64PicList(tempPictureArray);
      }
    }
  }, [picsOfMultipleEmployeesResults]);

  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
    setActivityIndicatorAnimating(false);
  };

  const getIndex = (employeeNumber) => {
    for (let i = 0; i < uniqueValues.length; i++) {
      if (uniqueValues[i].employeeNumber === employeeNumber) {
        return i;
      }
    }
    return -1; // return -1 if passed employee number is not in array
  };

  const getUniqueEmployees = (arrayListData) => {
    console.log("get unique EE function");
    for (let i = 0; i < arrayListData.length; i++) {
      if (getIndex(arrayListData[i].employeeNumber) === -1) {
        uniqueValues.push({
          employeeNumber: arrayListData[i].employeeNumber,
          employeeAlphaName:
            arrayListData[i].employeeAlphaName !== ""
              ? arrayListData[i].employeeAlphaName
              : "Unassigned tasks",
        });
      }
    }
    // console.log(uniqueValues);
  };

  const prepareDataForListAccordion = (arrayListData) => {
    getUniqueEmployees(arrayListData);
    for (let i = 0; i < uniqueValues.length; i++) {
      let tempObject = {
        employeeNumber: uniqueValues[i].employeeNumber,
        employeeAlphaName: uniqueValues[i].employeeAlphaName,
        taskData: [],
        numberOfTasks: 0,
        url: "",
      };
      for (let j = 0; j < arrayListData.length; j++) {
        if (
          arrayListData[j].employeeNumber === uniqueValues[i].employeeNumber
        ) {
          tempObject.taskData.push(arrayListData[j]);
        }
      }
      tempObject.numberOfTasks = tempObject.taskData.length;
      for (let k = 0; k < employeeBase64PicList.length; k++) {
        if (
          employeeBase64PicList[k].employeeNumber ===
          uniqueValues[i].employeeNumber
        ) {
          tempObject.url = employeeBase64PicList[k].url;
        }
      }
      // console.log("tempObject : " + JSON.stringify(tempObject));
      setPreparedListData((preparedListData) => [
        ...preparedListData,
        tempObject,
      ]);
    }
    // console.log("preparedListData : " + JSON.stringify(preparedListData[0]));
  };

  // item for flatlist implementation
  const Item = ({ id, title, numberOfTasks, url }) => {
    var eId
     if(id===0){
      eId=""

     }
     else
     {
      eId=id
     }
   
    return (
      <TouchableHighlight
        style={styles.item}
        activeOpacity={0.6}
        underlayColor={"#8833ff"}
        onPress={() => {
          loadModalFlatListData(id);
          setActiveEmployeeForModal(title);
          showModal();
        }}
      >
        <Card >
          <Card.Title
            titleStyle={{ fontSize: 17, paddingLeft: 15 }}
            title={title}
            subtitleStyle={{ paddingLeft: 15 }}
           subtitle={eId}
            // left={(props) => {
            //   console.log(url);
            //   url !== "" ? (
            //     <Avatar.Image size={60} source={{ uri: url }} />
            //   ) : (
            //     <Avatar.Icon {...props} icon="account" size={60} />
            //   );
            // }}

            left={(props) =>
              url ? (
                <Avatar.Image {...props} size={60} source={{ uri: url }} />
              ) : (
                <Avatar.Icon {...props} icon="account" size={60} />
              )
            }
            // left={(props) => (
            //   <Avatar.Icon {...props} icon="account" size={60} />
            // )}
           
            right={(props) => <Badge>{numberOfTasks}</Badge>}
            rightStyle={{ paddingRight: 10 }}
          />
          
          {/* <Card.Content>
            <Title>{id}</Title>
            <Paragraph>{title}</Paragraph>
          </Card.Content> */}
        </Card>
      </TouchableHighlight>
    );
  };

  const ModalItem = ({ id, title, checklistWorkbenchNumber, lineNumber }) => {
    return (
      <>
        {/* <Card style={{ ...styles.item, backgroundColor: "#f0e6ff" }}>
          <Card.Content>
            <Title>{id}</Title>
            <Paragraph>{title}</Paragraph>
          </Card.Content>
        </Card> */}
        <TouchableHighlight
          style={styles.item}
          activeOpacity={0.6}
          underlayColor={"#8833ff"}
          onPress={() => {
            console.log(checklistWorkbenchNumber + "_" + lineNumber);
            // Through a loop find the exact checklist workbench record and pass it as props to detail screen
            let tempWorkbenchData = {};
            for (let i = 0; i < modalFlatListData.length; i++) {
              if (
                modalFlatListData[i].checklistWorkbenchNumber ===
                  checklistWorkbenchNumber &&
                modalFlatListData[i].lineNumber === lineNumber
              ) {
                tempWorkbenchData = modalFlatListData[i];
              }
            }
            // console.log(tempWorkbenchData);
            hideModal();
            tempWorkbenchData.hasDetail
              ? ((opsxProps = {
                  workbenchData: tempWorkbenchData,
                  lastRouteName: props.navigation.state.routeName,
                  mode: "ADD",
                  formName: "Checklist Detail",
                  sourceOfData:
                    props.navigation.state.params.sourceOfData != undefined
                      ? props.navigation.state.params.sourceOfData
                      : "CURRENT",
                  formType:
                    props.navigation.state.params.formType != undefined
                      ? props.navigation.state.params.formType
                      : "TASK",
                }),
                navigate("ChecklistDetail", opsxProps))
              : ((opsxProps = {
                  workbenchData: tempWorkbenchData,
                  lastRouteName: props.navigation.state.routeName,
                  mode: "EDIT",
                  formName: "Checklist Detail",
                  sourceOfData:
                    props.navigation.state.params.sourceOfData != undefined
                      ? props.navigation.state.params.sourceOfData
                      : "CURRENT",
                  formType:
                    props.navigation.state.params.formType != undefined
                      ? props.navigation.state.params.formType
                      : "TASK",
                }),
                navigate("ChecklistDetail", opsxProps));
          }}
        >
            <View
            style={{
              backgroundColor: currentMode === "dark" ? "gray" : "#f0e6ff",  borderRadius:10//"#f0e6ff"
            }}
          >
           <Text
              style={{
                paddingHorizontal: 10,
                paddingVertical: 5,
                fontSize: 20,
                color: currentMode === "dark" ? "#1d1b1e" : "black",
              }}
            >
              {id}
            </Text>
            <Text
              style={{
                paddingHorizontal: 10,
                paddingBottom: 5,
                fontSize: 15,
                color: currentMode === "dark" ? "#1d1b1e" : "black",
              }}
            >
              {title}
            </Text>
          </View>
        </TouchableHighlight>
      </>
    );
  };

  const renderItem = ({ item }) => (
    
    <Item
      id={item.employeeNumber}
      title={item.employeeAlphaName}
      numberOfTasks={item.numberOfTasks}
      url={item.url}
    />
  );

  const renderModalItem = ({ item }) =>
    // <ModalItem id={item.facilityCode} title={item.taskInLanguage} />
    props.navigation.state.params.dashboardDetailType ===
      "COMPLETED_TASKS_BY_REPORTING_EMPLOYEES" ||
    props.navigation.state.params.dashboardDetailType ===
      "PENDING_TASKS_BY_REPORTING_EMPLOYEES" ||
    props.navigation.state.params.dashboardDetailType ===
      "OVERDUE_TASKS_BY_REPORTING_EMPLOYEES" ||
    props.navigation.state.params.dashboardDetailType ===
      "UNASSIGNED_TASKS_BY_REPORTING_EMPLOYEES" ? (
      <ModalItem
        id={item.facilityName}
        title={item.taskInLanguage}
        checklistWorkbenchNumber={item.checklistWorkbenchNumber}
        lineNumber={item.lineNumber}
      />
    ) : (
      <ModalItem
        id={item.facilityName}
        title={item.questionInLanguage}
        checklistWorkbenchNumber={item.checklistWorkbenchNumber}
        lineNumber={item.lineNumber}
      />
    );

  const searchFunction = (text) => {
    // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
    const updatedData = searchFunctionArrayHolder.filter((item) => {
      var item_data = [],
        text_data = "";

      if (item) {
        // console.log(item);
        item_data = `${item.employeeAlphaName.toUpperCase()})`;
        text_data = text.toUpperCase();
      } else {
        item_data = `${item.employeeAlphaName}`;
        text_data = text;
      }

      return item_data.indexOf(text_data) > -1;
    });

    setFlatListData(updatedData);
    setSearchValue(text);
  };

  const loadModalFlatListData = (employeeNumber) => {
    for (let i = 0; i < flatListData.length; i++) {
      if (flatListData[i].employeeNumber === employeeNumber) {
        setModalFlatListData(flatListData[i].taskData);
      }
    }
  };

  const showModal = () => {
    console.log("Showing Modal");
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
  };
  const currentMode = getCurrentAppearanceMode(); ////ADDED ON 27/11/2023 BY POOBALAN
  return (
    <>
      <Appbar.Header>
        <TouchableOpacity
          onPress={() => {
            opsxProps = {
              lastRouteName: props.navigation.state.routeName,
              snackBarText: "",
            };
            navigate(props.navigation.state.params.lastRouteName, opsxProps);
            // navigate("HomePage", opsxProps);
          }}
          style={{ paddingLeft: 10 }}
        >
         <Ionicons
            name="ios-arrow-back"
            size={24}
            color={currentMode === "dark" ? "white" : "black"} //ADDED ON 27/11/2023 BY POOBALAN
          />
        </TouchableOpacity>

        <Appbar.Content title={appBarTitle} />
      
      </Appbar.Header>
      <View
        style={{
          backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED ON 06/12/2023
          flex: 1,
        }}
      >
      <Portal>
        {/* Activity indicator modal */}
        <Modal
          visible={activityIndicatorModalVisible}
          onDismiss={hideActivityIndicatorModal}
          theme={{
            colors: {
              backdrop: "transparent",
            },
          }}
        >
          <ActivityIndicator
            animating={activityIndicatorAnimating}
            // size="large"
          />
        </Modal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          dismissable={true}
          contentContainerStyle={[
            containerStyle,
            {
              backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",
            },
          ]}
          style={{
            alignItems: "center",
            borderColor: "#fff",
           
          }}
        >
         <View
              style={{
                height: 40,
                backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff", ADDED
                alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 10,
                marginBottom: 5,
              }}
            >
            <Text style={{ color: "#fff", fontSize: 15 }}>
              {activeEmployeeForModal}
            </Text>
          </View>
          <FlatList
            data={modalFlatListData}
            renderItem={renderModalItem}
            // keyExtractor={(item) => item.employeeId}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          />
        </Modal>
      </Portal>

      <SearchBar
        placeholder="Type here to search"
        lightTheme
       // round
        containerStyle={{
          backgroundColor: "transparent",
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          padding: 5,
          marginLeft:5,
          marginRight:5
        }}
        inputContainerStyle={{
          padding: 0,
          margin: 0,
        }}
        inputStyle={{ fontSize: 14 }}
        value={searchValue}
        onChangeText={(text) => searchFunction(text)}
        autoCorrect={false}
      />
      {flatListData != undefined ? (
       
        flatListData.length > 0 ? (
          <FlatList
            data={flatListData}
            renderItem={renderItem}
            // keyExtractor={(item) => item.employeeId}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          />
        ) : (
          <View
            style={{
              paddingVertical: 20,
              flex: 1,
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Text
                style={{
                  color: currentMode === "dark" ? "white" : "black",
                }}
              >{emptyScreenMessage}</Text>
          </View>
        )
      ) : null}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    // backgroundColor: "transparent",
    paddingHorizontal: 5,
    paddingVertical: 1,
    marginVertical: 2,
    marginHorizontal: 5,
    borderRadius:10,
    marginBottom:2
  },
});

export default DashboardDetailScreen;
