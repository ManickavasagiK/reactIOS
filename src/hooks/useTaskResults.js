import React,{ useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";
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
  useTheme,
  Divider,
  Menu,
} from "react-native-paper";

function useTaskResults () {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);
  //28/9/23 snackbar using inside hook
 
  const [errorMessage, setErrorMessage] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [pictureList, setPictureList] = useState([]);
  const [taskUpdateResponse, setTaskUpdateResponse] = useState({});
  const [checklistList, setChecklistList] = useState([]);
  
  const [employeesBySupervisorResponse, setEmployeesBySupervisorResponse] =
    useState({});

  // Function that gets tasks assigned to the logged in user
  const getTasksBySupervisor = async (token) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/getTaskListFromChecklistWorkbench",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
    //  console.log('task assigned supervisor')
      setTaskList(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Fetch tasks by supervisor failed");
    }
  };

  const getPicturesByTask = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    try {
    //  console.log(token,checklistWorkbenchNumber,lineNumber)
      console.log("hook called getPicturesByTask ")
      let args = {
        params: {
          checklistWorkbenchNumber: checklistWorkbenchNumber,
          lineNumber: lineNumber,
        },
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/getPicturesByChecklistNumberAndLineNumberThenSendThemToApp",
        args
      );
     // console.log('hook response',response.data);
      // .then((response) => setPictureList(response.data));
      setPictureList(response.data);
       
    } catch (err) {
      console.log(err);
      setErrorMessage("Fetch pictures by task / checklist failed");
    }
  };

  const updateTask = async (token, formData) => {
    var cms = Math.round(new Date().getTime() / 1000);
    console.log("update task called");
  //  console.log(formData)
    // console.log(JSON.stringify(formData));
    
    try {
      let args = {
        headers: {
          "Content-Type": "multipart/form-data",

          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          requestTimeInMilliseconds: cms,
          lastUpdatedMachine: Device.modelName,
          Accept: "application/json",
        },
      };

      // console.log(args);

      const response = await opsxApi.post(
        "/ckBuster/checkWorkbench/updateChecklistWorkbenchAndPictures",
        formData,
        args
      );
       console.log(response.data);
     let tempResponse = {
      data: response.data,
      status: response.status,
    };
    
    console.log("Task update complete");
  //  setSnackBarMode("SUCCESS");
   // setSnackBarVisible(true);
      setTaskUpdateResponse(tempResponse.data);
     // setSnackBarVisible(false);
     // console.log(tempResponse.data);
      
    } catch (err) {
      console.log("Task update error");
      console.log(err);
      setErrorMessage("Task update failed");
    }
 
 

  };

  const getChecklistBySupervisor = async (token) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/getQuestionListFromChecklistWorkbench",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log('get checklist by supervisor')
      setChecklistList(tempResponse);
    
    } catch (err) {
      console.log(err);
      setErrorMessage("Fetch checklists by supervisor failed");
    }
  };

  const getEmployeesBySupervisor = async (token, supervisorNumber) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      // console.log(args);
      const response = await opsxApi.get(
        "/hr/employees/getEmployeeIdAndNameBySupervisor",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
     // console.log('get supervisor response')
      setEmployeesBySupervisorResponse(tempResponse);
      
    } catch (err) {
      console.log(err);
      setErrorMessage("Can't get employees list");
    }
  };
//console.log('Tasklist hook screen')
  return [
    getTasksBySupervisor,
    taskList,
    getPicturesByTask,
    pictureList,
    updateTask,
    taskUpdateResponse,
    getChecklistBySupervisor,
    checklistList,
    getEmployeesBySupervisor,
    employeesBySupervisorResponse,
   // errorMessage,
  ];
  
};
export default useTaskResults