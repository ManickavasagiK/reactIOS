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

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);
  //28/9/23 snackbar using inside hook
  const [snackBarVisible, setSnackBarVisible] =React.useState(false);
 // const [snackBarText, setSnackBarText] =React.useState("");
  const [snackBarMode, setSnackBarMode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [taskList, setTaskList] = useState([]);
  const [pictureList, setPictureList] = useState([]);
  const [taskUpdateResponse, setTaskUpdateResponse] = useState({});
  const [checklistList, setChecklistList] = useState([]);
  
  const [employeesBySupervisorResponse, setEmployeesBySupervisorResponse] =
    useState({});
    const updateTask = async (token, formData) => {
        var cms = Math.round(new Date().getTime() / 1000);
        console.log("update task called");
       // console.log(formData)
         console.log(JSON.stringify(formData));
        
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
         //  console.log(response.data);
         let tempResponse = {
          data: response.data,
          status: response.status,
        };
        
        
      
     //   console.log('hook',tempResponse.data.responseSavedToTable)
          setTaskUpdateResponse(tempResponse.data.responseSavedToTable);
          console.log("Task update complete");
            
          setTaskUpdateResponse("")
          
        } catch (err) {
          console.log("Task update error");
          console.log(err);
          setErrorMessage("Task update failed");
        }
     
     
    
      };
    
  return [
    
    updateTask,
    taskUpdateResponse,
    
    
    
  ];
}