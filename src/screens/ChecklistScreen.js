import React, { useCallback, useContext, useEffect,setstate, useState,createContext, useMemo } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Col, Row, Grid } from "react-native-easy-grid";
import CheckItems from "./CheckItems";

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
  SafeAreaView,
  Pressable,
  Appearance
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
  useTheme,
  Divider,
  Menu,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useTaskResults from "../hooks/useTaskResults";
//import useChecklistDetailResults from "../hooks/useChecklistDetailResults";
//import Accordion from "react-native-collapsible/Accordion";
import moment from "moment";
import { SearchBar } from "react-native-elements";
import Slider from '@react-native-community/slider';

import Comment from "./Comment/Comment";

import { SnackbarProvider } from './Snackbarcomp';

import Skeleton from "./Skeletoncard";

const getCurrentAppearanceMode = () => Appearance.getColorScheme(); //ADDED ON 27/11/2023 BY POOBALAN



// Date and time functions
const truncateToDecimals = (num, dec) => {
  const calcDec = Math.pow(10, dec);
  return Math.trunc(num * calcDec) / calcDec;
};
//const { Filter } = useFilter();
const countDownTimer = (dateString, timeString) => {
  // if day or month are single digit, add 0 as prefix and reconstruct date
  var arr = dateString.split("-");
  var newDateString;
  arr[1] < 10 && arr[1].length == 1 ? (arr[1] = "0" + arr[1]) : null;
  arr[2] < 10 && arr[2].length == 1 ? (arr[2] = "0" + arr[2]) : null;
  newDateString = arr[0] + "-" + arr[1] + "-" + arr[2];

  // get milliseconds based on date and time string. Treats local date and time and not UTC
  var dateTime = moment(
    dateString.trim() + " " + timeString.trim(),
    "YYYY-MM-DD HH:mm:ss"
  ).valueOf();

  // milliseconds from current local time
  var timeNow = new Date().getTime();

  // get time remaining
  var timeRemainingInMiliseconds = dateTime - timeNow;

  let h, m, s;

  h = truncateToDecimals(timeRemainingInMiliseconds / 1000 / 60 / 60, 0);
  m = Math.floor((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60);
  s = Math.floor(
    ((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60
  );

  // TODO : minus sign comes in between 0 and hour. This needs to be fixed

  h < 10 ? (h = `0${h}`) : (h = `${h}`);
  m < 10 ? (m = `0${m}`) : (m = `${m}`);
  s < 10 ? (s = `0${s}`) : (s = `${s}`);

  var timeRemaining = `${h}:${m}:${s}`;

  var timeRemainingObject;
  timeRemainingInMiliseconds > 0
    ? (timeRemainingObject = {
        timeRemaining: timeRemaining,
        isOverdue: false,
      })
    : (timeRemainingObject = {
        timeRemaining: timeRemaining,
        isOverdue: true,
      });

  return timeRemainingObject;
};

export const appContext=createContext(null);

const ChecklistScreen = (props) => {
  const {
    state: { token, isTokenValid },
    validateToken,
  } = useContext(AuthContext);
  
  


  const [empId,setEmpid]=useState('')
  const[empName,setEmpname]=useState('')
  const [
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
  ] = useTaskResults();

  
  
  const [taskData, setTaskData] = useState([]);
  const [tempTaskData, setTempTaskDate] = useState([]);
  let opsxProps = {};

  const theme = useTheme();
  
  const [commentsModalVisible, setCommentsModalVisible] = React.useState(false);
  const [snackbar, setSnackbar] = useState(false);
  const [cameraPicData, setCameraPicData] = useState({});

  const [isTaskCompleted, setIsTaskCompleted] = React.useState(false);
  const [isChecklistCompleted, setIsChecklistCompleted] = React.useState(false);
  const [taskComments, setTaskComments] = React.useState(""); // comment on checklist workbench table
  const [checklistComment, setChecklistComment] = React.useState(""); // comments from comments table
  const [taskProgress, setTaskProgress] = useState(0);
  const [checklistProgress, setChecklistProgress] = useState(0);
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(true);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(true);
  const [activeChecklistInfo, setActiveChecklistInfo] = useState({});
  const [checklistWorkbenchCommentsList, setChecklistWorkbenchCommentsList] =
    useState([]);
  const [renderItemType, setRenderItemType] = useState("");
  const [employeeList, setEmployeeList] = useState([]);
  const [modalFlatlistData, setModalFlatlistData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );
 
  const [emptyScreenText, setEmptyScreenText] = useState("");
 const[cmtFlatlist,setCmtflatlist]=useState([])
  // Refresh control
  const [refreshing, setRefreshing] = useState(false);
  const [upDate,setUpDate]=useState(false)
  const [pictureData, setPictureData] = useState('');
  const [picParam,setPicparam]=useState('')
  const [PicAction,setPicAction]=useState('')
  const[picWorkbench,setPicworkbench]=useState([])
  const [checkProps,setCheckprops]=useState('')
  const [headerRoot,setHeaderroot]=useState('')
   const [appTitle,setApptitle]=useState('')
   const [updateModalVisible, setUpdateModalVisible] = React.useState(false);
  // Menu in app bar
  const [menuVisible, setMenuVisible] = useState(false);
  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const [close,setClose]=useState(false)
  // Employee update / change
  var employeeNumberForEEUpdate = 0;
  const [
    indexForEmployeeSupervisorUpdate,
    setIndexForEmployeeSupervisorUpdate,
  ] = useState(0);

  //Hide modal counter
  const [hideModalCounter, setHideModalCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(true); 
  const [loadTask,setLoadtask]=useState(false)

  const currentMode = getCurrentAppearanceMode(); // ADDED ON 27/11/2023 BY POOBALAN
// UseEffect code Skeleton card 
useEffect(() => { 
  
  // Simulating an asynchronous data fetch 
  setTimeout(() => { 

      // Set isLoading to false after  
      // the data is fetched 
      setIsLoading(false); 

      // Adjust the timeout value  
      // according to your needs 
  },10000); 
}, []); 


  useEffect(() => {
    validateToken();
    console.log("Checklist Screen - UE1");

   
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
      
    );

    return () => {
      backHandler.remove();
    };
    
  }, []);

  


  
//UseEffect for Picture Updated response
useEffect(()=>{
  if(props.navigation.state.params.status === "true"){
    console.log("checklist screen picture update status ",props.navigation.state.params.status)

    setSnackbar(true)

  }

},[props.navigation.state.params.status])

//Code commented for picture updated response getting in Newpicture.js  component
        // useEffect(() => {
        //   //console.log("Checklist",props.navigation.state.params.picData) 
        //   // if(props.navigation.state.params.picData){
        //   //   setCameraPicData(props.navigation.state.params.picData);
        //   //   setUpdateModalVisible(true);
        //   //   console.log("modal open")
        //   // }
        //     if (props.navigation.state.params != undefined) {
        //       if (
        //         props.navigation.state.params.picData &&
        //         props.navigation.state.params.action === "COMPLETED" // comes from camera screen
        //       ) {
        //         // TODO - Also check if last route name was 'Camera'
              
              
              
        //       setCameraPicData(props.navigation.state.params.picData);
            
        //       //  console.log(cameraPicData);
        //       // console.log(props.navigation.state.params.picData);
        //      // console.log(props.navigation.state.params.workbenchData)
        //      setActiveChecklistInfo(props.navigation.state.params.workbenchData);
              
        //       setUpdateModalVisible(true);
        //      // modalup()
        //        console.log("Inside if statement to trigger modal to show camera");
        //    // alert("modal open")
                
        //       }
              
        //     }
        //    //console.log(props.navigation.state.params)
        //     console.log("Error message : " + errorMessage);
        //     console.log("Checklist Screen - UE4");
        //   }, [props.navigation.state.params]);

  useEffect(() => {
    if (props.navigation.state.params.formType === "CHECKLIST") {
      getChecklistBySupervisor(token.jwt);
    } else if (props.navigation.state.params.formType === "TASK") {
      console.log("calling tasks by supervisor");
      getTasksBySupervisor(token.jwt);
    }
    // console.log(token.content.employeeNumber);
    getEmployeesBySupervisor(token.jwt, token.content.employeeNumber);
    console.log("Checklist Screen - UE2");
  }, []);
  
  

  useEffect(() => {
    //console.log(checklistList)
    if (props.navigation.state.params.formType === "CHECKLIST") {

      if (checklistList.data && checklistList.status === 200) {
        setRefreshing(true)
        console.log("refresh start")
            console.log("checklist data",checklistList.data.length)
       setTaskData(checklistList.data);

    
       
        setTempTaskDate(checklistList.data);
        setRefreshing(false)
        console.log("refresh stop")
        checklistList.data.length > 0
     
    
          ? setEmptyScreenText("")
          //8-12-2023 vasagi added for animation card
          :setLoadtask(true)
           setEmptyScreenText("No pending checklists");
          
        
      }
    }
    if (props.navigation.state.params.formType === "TASK") {
      if (taskList.data && taskList.status === 200) {
        setRefreshing(true)
     
       setTaskData(taskList.data);
        setTempTaskDate(taskList.data);
        setRefreshing(false)
        console.log("task list",taskList.data.length);
        taskList.data.length > 0
          ? setEmptyScreenText("")
          : //8-12-2023 vasagi added for animation card
          setLoadtask(true)
          setEmptyScreenText("No pending tasks");
          setRefreshing(true);
      }
    }
    setRefreshing(false);
   setActivityIndicatorAnimating(false);
   setActivityIndicatorModalVisible(false);
   //  console.log(taskList.length)
    console.log("Checklist Screen - UE3");
  }, [checklistList, taskList]);



  
  
 //Code commented for taskupdate response getting in Emp.js Child Component
          // useEffect(() => {
          //   //custom hook 
          
            
          //  //console.log(data)
          //  // setUpdateModalVisible(false);
          //   hideModal();
          // //  16-DEC-2022 - Commented the following 2 lines as loader stops before checklist screen is fully loaded
          //   setActivityIndicatorAnimating(false);
          //   setActivityIndicatorModalVisible(false);
          // setIsTaskCompleted(false);
          // setIsChecklistCompleted(false);
          // setTaskProgress(0);
          // setChecklistProgress(0);
          // setTaskComments("");

            
            
          //     if (taskUpdateResponse.picturesSavedToTable === true) {
          //       setSnackBarText("Success! Checklist updated with pic.");
          //     } else {
          //       setSnackBarText("Success! Checklist updated.");
              
          //     }
          //   //  setActivityIndicatorAnimating(false);
          //  //  setActivityIndicatorModalVisible(true);
          //  setSnackBarMode("SUCCESS");
          //  setSnackBarVisible(true);
          
          //   setActivityIndicatorModalVisible(false);
            
          //   //useAxiosHook()
          //   console.log("Checklist Screen - UE5");
          // }, [taskUpdateResponse]);

  
    useEffect(() => {
    console.log("Checklist Screen -  UE8");
    if (
      employeesBySupervisorResponse.data &&
      employeesBySupervisorResponse.status === 200
    ) {
      // console.log(employeesBySupervisorResponse.data);
      setEmployeeList(employeesBySupervisorResponse.data);
      // -- commented following 2 lines as prepareModalFlatlistData is called when employee change is clicked --
      // prepareModalFlatlistData("EMPLOYEE", employeesBySupervisorResponse.data);
      // setModalFlatlistData(employeesBySupervisorResponse.data);
    }
  }, [employeesBySupervisorResponse]);

  useEffect(() => {
    console.log("Modal flatlist data changed");
  }, [prepareCmtFlatlist]);

  
  




//Modal component placed in  Emp.js and Cmt.js component
          // const hideModal = () => {
          //   // setSnackBarText("Checklist update cancelled.");

          //   setHideModalCounter(hideModalCounter + 1);
          // };

  
  const containerStyle = {
    backgroundColor: "white",
    padding: 0,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  };
  

  
 

// Data passing to Comment Component
const prepareCmtFlatlist=(cmtlist)=>{
  setCmtflatlist(cmtlist)
}
//Code commented for employee data passing to child component by props 
        // const prepareModalFlatlistData = (renderItemType, listData) => {
        //   renderItemType === "COMMENTS"
        //     ? setModalFlatlistData(listData)
        //     : renderItemType === "EMPLOYEE"
        //     ? setModalFlatlistData(listData)
        //     : null;
        // };


// Search bar function to search items placed to Emp.js component
        // const searchFunction = (text) => {
        //   // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
        //   const updatedData = searchFunctionArrayHolder.filter((item) => {
        //     var item_data = [],
        //       text_data = "";
        //     if (renderItemType === "EMPLOYEE") {
        //       if (item) {
        //         // console.log(item);
        //         item_data = `${item.employeeName.toUpperCase()})`;
        //         text_data = text.toUpperCase();
        //       } else {
        //         item_data = `${item.employeeName}`;
        //         text_data = text;
        //       }
        //     }

        //     return item_data.indexOf(text_data) > -1;
        //   });

        //   setModalFlatlistData(updatedData);
        //   setSearchValue(text);
        // };

  //Refresh control
  const onRefresh = () => {
   
    setRefreshing(true);
    if (props.navigation.state.params.formType === "CHECKLIST") {
      getChecklistBySupervisor(token.jwt);
    
    } else if (props.navigation.state.params.formType === "TASK") {
      getTasksBySupervisor(token.jwt);
    }
  setRefreshing(false)
  };




//Code commented for Toggleswitch component palced to Newpicture.js component

  // const onToggleTaskSwitch = useCallback(() => setIsTaskCompleted(!isTaskCompleted),[]);
  // const onToggleChecklistSwitch =useCallback( () =>
  //   setIsChecklistCompleted(!isChecklistCompleted),[]);



//CODE COMMENTED FOR SUBMIT CHECKLIST UPDATE MOVING TO COMMENT.JS CHILD COMPONENT
          // const submitChecklistUpdate = () => {
          //   console.log("submit task update function called");
          //   // console.log(activeChecklistInfo);
          //   var formdata = new FormData();
          //   try {
          //     if (activeChecklistInfo) {
          //       var checklistWorkbenchUserActionDto = {
          //         checklistWorkbenchNumber:
          //           activeChecklistInfo.checklistWorkbenchNumber,
          //         lineNumber: activeChecklistInfo.lineNumber,
          //         companyCode: activeChecklistInfo.companyCode,
          //         divisionCode: activeChecklistInfo.divisionCode,
          //         wingCode: activeChecklistInfo.wingCode,
          //         blockCode: activeChecklistInfo.blockCode,
          //         floorCode: activeChecklistInfo.floorCode,
          //         taskCode: activeChecklistInfo.taskCode,
          //         checklistCode: activeChecklistInfo.questionCode,
          //         taskProgress: activeChecklistInfo.taskProgress,
          //         checklistProgress: activeChecklistInfo.checklistProgress,
          //         assetUsed: activeChecklistInfo.assetUsed,
          //         taskStatus: isTaskCompleted ? "COMPLETED" : "PENDING",
          //         checklistStatus: isChecklistCompleted ? "COMPLETED" : "PENDING",
          //         supervisorNumber: activeChecklistInfo.supervisorNumber,
          //         employeeNumber: activeChecklistInfo.employeeNumber,
          //         checklistComments: "", // todo - for future use
          //         taskDate: activeChecklistInfo.taskDate,
          //         taskEndTime: activeChecklistInfo.taskEndTime,
          //         checklistEndTime: activeChecklistInfo.checklistEndTime,
          //         taskStartDate: activeChecklistInfo.taskStartDate,
          //         checklistStartDate: activeChecklistInfo.checklistStartDate,
          //         checklistEndDate: activeChecklistInfo.checklistEndDate,
          //         taskStartTime: activeChecklistInfo.taskStartTime,
          //         checklistStartTime: activeChecklistInfo.checklistStartTime,
          //         belongsToProject: activeChecklistInfo.belongsToProject,
          //         isScheduledTask: activeChecklistInfo.isScheduledTask,
          //       };

          //       formdata.append(
          //         "checklistWorkbenchUserActionDto",
          //         JSON.stringify(checklistWorkbenchUserActionDto)
          //       );

          //       // 24-01-2023 ; Delete following commente block aftet 3 months if pic update works well

          //       // if (
          //       //   // props.navigation.state.params.workbenchData
          //       //   activeChecklistInfo.doesQuestionRequirePicture === "YES"
          //       // ) {
          //       //   var today = new Date();
          //       //   var pictureName =
          //       //     (props.navigation.state.params.formType === "CHECKLIST"
          //       //       ? activeChecklistInfo.questionCode
          //       //       : activeChecklistInfo.taskCode) +
          //       //     "_" +
          //       //     (props.navigation.state.params.formType === "CHECKLIST"
          //       //       ? activeChecklistInfo.supervisorNumber
          //       //       : activeChecklistInfo.employeeNumber) +
          //       //     "_" +
          //       //     today.toISOString().substring(0, 19) +
          //       //     ".jpg";
          //       //   formdata.append("pictureFileList", {
          //       //     uri: cameraPicData.uri,
          //       //     type: "image/jpeg",
          //       //     name: pictureName,
          //       //     created: today,
          //       //   });
          //       // }

          //       // 24-JAN-2023
          //       // prepare picture data for checklist update

          //       if (
          //         activeChecklistInfo.doesQuestionRequirePicture === "YES" &&
          //         props.navigation.state.params.formType === "CHECKLIST"
          //       ) {
          //         var today = new Date();
          //         var pictureName =
          //           activeChecklistInfo.questionCode +
          //           "_" +
          //           activeChecklistInfo.supervisorNumber +
          //           "_" +
          //           today.toISOString().substring(0, 19) +
          //           ".jpg";
          //         formdata.append("pictureFileList", {
          //           uri: cameraPicData.uri,
          //           type: "image/jpeg",
          //           name: pictureName,
          //           created: today,
          //         });
          //       }
          //       // 24-JAN-2023
          //       // prepare picture data for task update

          //       if (
          //         activeChecklistInfo.doesTaskRequirePicture === "YES" &&
          //         props.navigation.state.params.formType === "TASK"
          //       ) {
          //         var today = new Date();
          //         var pictureName =
          //           activeChecklistInfo.taskCode +
          //           "_" +
          //           activeChecklistInfo.employeeNumber +
          //           "_" +
          //           today.toISOString().substring(0, 19) +
          //           ".jpg";
          //         formdata.append("pictureFileList", {
          //           uri: cameraPicData.uri,
          //           type: "image/jpeg",
          //           name: pictureName,
          //           created: today,
          //         });
          //       }
                
          //       // console.log(formdata);
          //       updateTask(token.jwt, formdata);
              
          //     }
          //   } catch (err) {
          //     console.log(err);
          //   }
          // };

//Filter code commented          
        // const assignAllTasksToTaskData = () => {
        //   // props.navigation.state.params.formType === "TASK"
        //   //   ? setTaskData(taskList.data)
        //   //   : props.navigation.state.params.formType === "CHECKLIST"
        //   //   ? setTaskData(checklistList.data)
        //   //   : null;
        //   setTaskData(tempTaskData);
        // };

  // const showAllTasks = () => {
  //   assignAllTasksToTaskData();
  //   closeMenu();
  // };

  // const showCompletedTasks = () => {
  //   console.log("task competed")
  //   assignAllTasksToTaskData();
  //   const filteredData = tempTaskData.filter((task) => {
  //     return task.taskStatus === "COMPLETED";
  //   });
  //   setTaskData(filteredData);
  //   closeMenu();
  // };

  // const showChecklistsWithAttachments = () => {
  //   assignAllTasksToTaskData();
  //   const filteredData = tempTaskData.filter((task) => {
  //     return task.pictureMetaDataDtoList.length > 0;
  //   });
  //   setTaskData(filteredData);
  //   closeMenu();
  // };

  // const showOverdueChecklists = () => {
  //   assignAllTasksToTaskData();
  //   const filteredData = tempTaskData.filter((task) => {
  //     return (
  //       countDownTimer(task.taskDate, task.checklistEndTime).isOverdue === true
  //     );
  //   });
  //   setTaskData(filteredData);
  //   closeMenu();
  // };

  // const showOverdueTasks = () => {
  //   assignAllTasksToTaskData();
  //   const filteredData = tempTaskData.filter((task) => {
  //     return countDownTimer(task.taskDate, task.taskEndTime).isOverdue === true;
  //   });
  //   setTaskData(filteredData);
  //   closeMenu();
  // };

//Code Commented for submitchecklistcoment placed in Comment.js component  
          // const submitChecklistComment = () => {
          //   let checklistWorkbenchComments = {
          //     commentId: null, // DB auto generates id. do not sepcify one.
          //     checklistWorkbenchNumber: activeChecklistInfo.checklistWorkbenchNumber,
          //     lineNumber: activeChecklistInfo.lineNumber,
          //     employeeNumber: activeChecklistInfo.employeeNumber,
          //     commentText: checklistComment,
          //     parentCommentId: 0,
          //     lastUpdatedBy: "",
          //     lastUpdatedDate: "",
          //     lastUpdatedTime: "",
          //     lastUpdatedApplication: "",
          //     lastUpdatedMachine: "",
          //   };

          //   if (checklistComment !== "") {
          //     addCommentToTask(token.jwt, checklistWorkbenchComments);
          //   } else {
          //     setSnackBarText("Comment cannot be blank");
          //     setSnackBarMode("WARNING");
          //     setSnackBarVisible(true);
          //   }
          // };

          
 
 
 
  const _renderChecklistItem = ({ item }) => (
    //Flatlist Rendering Component Is renderd seperate Child component 
   <CheckItems workbenchData={item} employeeList={employeeList}
   token={token}
   props={props}  cmtFlatlist={cmtFlatlist}/>
   
  // <ChecklistItem workbenchData={item} />

  )



//var alphName;
  // const ChecklistItem =({ workbenchData }) => {
 
  //   const [employeeAlphaName, setEmployeeAlphaName] = useState(
  //     workbenchData.employeeAlphaName
  //   );
  //   return (
  //     <View>
     
  //     <Card
  //       style={{
  //         marginHorizontal: 10,
  //         marginTop: 10,
  //         backgroundColor: "#e6e6ff",
  //         // backgroundColor: "#f0e6ff",
  //       }}
  //     >
  //       <Card.Content
  //         style={{
  //           backgroundColor: "transparent",
  //           paddingTop: 0,
  //           marginTop: 0,
  //         }}
  //       >
  //         <Title style={{ color: theme.colors.onPrimaryContainer }}>
  //           {workbenchData.facilityName}
  //         </Title>
  //         <Paragraph>{workbenchData.taskInLanguage}</Paragraph>

  //         <View style={{ marginTop: 2, marginBottom: 2, flexDirection: "row" }}>
  //           <View style={{ flex: 0.4 }}>
  //             <Text style={{ color: theme.colors.onPrimaryContainer }}>
  //               Time Remaining:
  //             </Text>
  //           </View>
  //           <View
  //             style={{
  //               flex: 0.44,
  //             }}
  //           >
  //             {props.navigation.state.params.formType === "CHECKLIST" ? (
  //               <Text
  //                 style={{
  //                   color:
  //                     workbenchData.checklistStatus !== "COMPLETED" &&
  //                     countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.checklistEndTime
  //                     ).isOverdue === true
  //                       ? "red"
  //                       : "#6200ee",
  //                 }}
  //               >
  //                 {workbenchData.checklistStatus === "COMPLETED"
  //                   ? "DONE"
  //                   : countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.checklistEndTime
  //                     ).isOverdue === false
  //                   ? countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.checklistEndTime
  //                     ).timeRemaining
  //                   : "OVERDUE"}
  //               </Text>
  //             ) : props.navigation.state.params.formType === "TASK" ? (
  //               <Text
  //                 style={{
  //                   color:
  //                     workbenchData.taskStatus !== "COMPLETED" &&
  //                     countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.taskEndTime
  //                     ).isOverdue === true
  //                       ? "red"
  //                       : "#6200ee",
  //                 }}
  //               >
  //                 {workbenchData.taskStatus === "COMPLETED"
  //                   ? "DONE"
  //                   : countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.taskEndTime
  //                     ).isOverdue === false
  //                   ? countDownTimer(
  //                       workbenchData.taskDate,
  //                       workbenchData.taskEndTime
  //                     ).timeRemaining
  //                   : "OVERDUE"}
  //               </Text>
  //             ) : null}
  //           </View>
  //           <View
  //             style={{
  //               flex: 0.16,
  //               flexDirection: "row",
  //               justifyContent: "flex-end",
  //             }}
  //           >
  //             <MaterialCommunityIcons
  //               name="alpha-t-circle"
  //               size={20}
  //               color={
  //                 workbenchData.isTaskCompletedOnTime === "YES" &&
  //                 workbenchData.taskStatus === "COMPLETED"
  //                   ? "green"
  //                   : workbenchData.isTaskCompletedOnTime === "NO" &&
  //                     workbenchData.taskStatus === "COMPLETED"
  //                   ? "red"
  //                   : "transparent"
  //               }
  //             />
  //             <MaterialCommunityIcons
  //               name="alpha-c-circle"
  //               size={20}
  //               color={
  //                 workbenchData.isCompletedOnTime === "YES" &&
  //                 workbenchData.checklistStatus === "COMPLETED"
  //                   ? "green"
  //                   : workbenchData.isCompletedOnTime === "NO" &&
  //                     workbenchData.checklistStatus === "COMPLETED"
  //                   ? "red"
  //                   : "transparent"
  //               }
  //             />
  //           </View>
  //         </View>

  //         <View style={{ marginBottom: 2, flexDirection: "row" }}>
  //           <View style={{ flex: 0.4 }}>
  //             <Text style={{ color: theme.colors.onPrimaryContainer }}>
  //               Task End Date:
  //             </Text>
  //           </View>
  //           <View style={{ flex: 0.44 }}>
  //             <Text>{workbenchData.taskDate}</Text>
  //           </View>
  //           <View style={{ flex: 0.16 }}></View>
  //         </View>

  //         <View style={{ marginBottom: 2, flexDirection: "row" }}>
  //           <View style={{ flex: 0.4 }}>
  //             <Text style={{ color: theme.colors.onPrimaryContainer }}>
  //               Task End Time:
  //             </Text>
  //           </View>
  //           <View style={{ flex: 0.44 }}>
  //             <Text>{workbenchData.taskEndTime}</Text>
  //           </View>
  //           <View style={{ flex: 0.16 }}></View>
  //         </View>

  //         {props.navigation.state.params.formType === "CHECKLIST" ? (
  //           <View style={{ marginBottom: 2, flexDirection: "row" }}>
  //             <View style={{ flex: 0.4 }}>
  //               <Text style={{ color: theme.colors.onPrimaryContainer }}>
  //                 Employee:
  //               </Text>
  //             </View>
  //             <View style={{ flex: 0.44 }}>
  //               <Text>{employeeAlphaName} </Text>
  //             </View>
  //             <View
  //               style={{ flex: 0.16, alignItems: "flex-end", marginBottom: 3 }}
  //             >
                
               
               
  //                <Emp employeeList={employeeList} token={token}
  //                setEmployeeAlphaName={setEmployeeAlphaName}
                 
  //                workbenchData={workbenchData}/>
                 
  //             </View>
  //           </View>
  //         ) : null}
  //       </Card.Content>

  //       <Divider style={{ backgroundColor: "#8080ff" }} />

  //       <Card.Actions style={{ justifyContent: "flex-end" }}>
         
  //         <Comment token={token} 
         
  //           workbenchData={workbenchData}
            
  //          cmtFlatlist={cmtFlatlist}

  //         />


           
  //         {workbenchData.pictureMetaDataDtoList != null &&
  //         workbenchData.pictureMetaDataDtoList.length > 0 ? (
  //           <TouchableOpacity
  //             style={{ marginHorizontal: 5 }}
  //             onPress={() => {
  //               opsxProps = {
  //                 pictureMetaDataDtoList: workbenchData.pictureMetaDataDtoList,
  //                 lastRouteName: props.navigation.state.routeName,
  //                 sourceOfData: "CURRENT",
  //               };
  //            // console.log(opsxProps)
  //               navigate("Pictures", opsxProps);
  //             }}
  //           >
  //             <Avatar.Icon icon="paperclip" size={30} />
  //           </TouchableOpacity>
  //         ) : null}
  //         <TouchableOpacity
  //           style={{ marginHorizontal: 5 }}
  //           onPress={() => {
  //             props.navigation.state.params.formType === "CHECKLIST"
  //               ? workbenchData.hasDetail
  //                 ? ((opsxProps = {
  //                     workbenchData: workbenchData,
  //                     lastRouteName: props.navigation.state.routeName,
  //                     mode: "EDIT",
  //                     sourceOfData: "CURRENT",
  //                     formType: "CHECKLIST",
  //                     formName: "Checklist Detail",
  //                   }),
  //                   navigate("ChecklistDetail", opsxProps))
  //                 : ((opsxProps = {
  //                     workbenchData: workbenchData,
  //                     lastRouteName: props.navigation.state.routeName,
  //                     mode: "ADD",
  //                     sourceOfData: "CURRENT",
  //                     formType: "CHECKLIST",
  //                     formName: "Checklist Detail",
  //                   }),
  //                   navigate("ChecklistDetail", opsxProps))
  //               : props.navigation.state.params.formType === "TASK"
  //               ? workbenchData.hasDetail
  //                 ? ((opsxProps = {
  //                     workbenchData: workbenchData,
  //                     lastRouteName: props.navigation.state.routeName,
  //                     mode: "EDIT",
  //                     sourceOfData: "CURRENT",
  //                     formType: "TASK",
  //                     formName: "Task Detail",
  //                   }),
  //                   navigate("ChecklistDetail", opsxProps))
  //                 : ((opsxProps = {
  //                     workbenchData: workbenchData,
  //                     lastRouteName: props.navigation.state.routeName,
  //                     mode: "ADD",
  //                     sourceOfData: "CURRENT",
  //                     formType: "TASK",
  //                     formName: "Task Detail",
  //                   }),
  //                   navigate("ChecklistDetail", opsxProps))
  //               : null;
  //           }}
  //         >
  //           <Avatar.Icon icon="format-list-bulleted" size={30} />
  //         </TouchableOpacity>

          
  //         {/* <TouchableOpacity
  //           style={{ marginHorizontal: 5 }}
  //           onPress={() => {
  //             console.log(new Date().getTime());
  //             setActiveChecklistInfo(workbenchData);
  //             console.log(
  //               `Update pressed for ${workbenchData.questionCode}, ${workbenchData.checklistWorkbenchNumber}, ${workbenchData.lineNumber}`
  //             );

  //             if (props.navigation.state.params.formType === "CHECKLIST") {
  //               if (workbenchData.doesQuestionRequirePicture === "YES") {
  //                 opsxProps = {
  //                   workbenchData: workbenchData,
  //                   lastRouteName: props.navigation.state.routeName,
  //                 };
  //                 navigate("Camera", opsxProps);
  //               } else {
  //                 // checklist does not require picture update

  //                 // workbenchData.taskStatus === "COMPLETED"
  //                 //   ? setIsTaskCompleted(true)
  //                 //   : setIsTaskCompleted(false);
  //                 // workbenchData.checklistStatus === "COMPLETED"
  //                 //   ? setIsChecklistCompleted(true)
  //                 //   : setIsChecklistCompleted(false);
  //                 // setTaskComments(workbenchData.taskComments);
  //                 // setTaskProgress(workbenchData.taskProgress);
  //                 // setChecklistProgress(workbenchData.checklistProgress);
  //                 setUpdateModalVisible(true);
  //               }
  //             } else if (props.navigation.state.params.formType === "TASK") {
  //               if (workbenchData.doesTaskRequirePicture === "YES") {
  //                 opsxProps = {
  //                   workbenchData: workbenchData,
  //                   lastRouteName: props.navigation.state.routeName,
  //                 };
  //                 navigate("Camera", opsxProps);
  //               } else {
  //                 // checklist does not require picture update

  //                 workbenchData.taskStatus === "COMPLETED"
  //                   ? setIsTaskCompleted(true)
  //                   : setIsTaskCompleted(false);
  //                 workbenchData.checklistStatus === "COMPLETED"
  //                   ? setIsChecklistCompleted(true)
  //                   : setIsChecklistCompleted(false);
  //                 setTaskComments(workbenchData.taskComments);
  //                 setTaskProgress(workbenchData.taskProgress);
  //                 setChecklistProgress(workbenchData.checklistProgress);
  //                 setUpdateModalVisible(true);
  //               }
  //             }
  //             console.log(new Date().getTime());
  //           }}
  //         >
  //           <Avatar.Icon
  //             icon={
  //               props.navigation.state.params.formType === "CHECKLIST"
  //                 ? workbenchData.doesQuestionRequirePicture === "YES"
  //                   ? "camera"
  //                   : "thumb-up"
  //                 : props.navigation.state.params.formType === "TASK"
  //                 ? workbenchData.doesTaskRequirePicture === "YES"
  //                   ? "camera"
  //                   : "thumb-up"
  //                 : null
  //             }
  //             size={30}
  //           />
  //         </TouchableOpacity> */}
  //           <Thumbupdate 
  //           props={props}
  //           workbenchData={workbenchData} 
  //         //   checkProps={checkProps}
  //         //   headerRoot={headerRoot} 
  //         //   isChecklistCompleted={isChecklistCompleted}
  //         //  setIsTaskCompleted={setIsTaskCompleted}
  //         //  setIsChecklistCompleted={setIsChecklistCompleted}
  //         //   setUpdateModalVisible={setUpdateModalVisible}
  //         //   setTaskProgress={setTaskProgress}
  //         //   setChecklistProgress={setChecklistProgress}
  //           />
          
  //       </Card.Actions>
  //     </Card>
       
    

  //     </View>
  //   );
  // };

  return (
    <>
    
     <Appbar.Header >
     
     <TouchableOpacity
          onPress={() => {
            opsxProps = {
              lastRouteName:props.navigation.state.routeName,
              snackBarText: "",
            };
            navigate("HomePage", opsxProps);
          }}
          style={{ paddingLeft:25}}
        >
          <Ionicons name="ios-arrow-back" size={25}   
          
          color={currentMode === "dark" ? "white" : "black"} //ADDED ON 27/11/2023 BY POOBALAN
          />

          
        </TouchableOpacity>

        <Appbar.Content title={props.navigation.state.params.appBarTitle}   />
      
         {/* <TouchableOpacity 
         onPress={()=>{
          

         }}
        
         >
             <Ionicons name="filter" size={24} color="white" />
         </TouchableOpacity>
         */}

         
 </Appbar.Header>








 <Provider>
        {/* <SafeAreaView> */}
        <View
          style={{
            backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",flex:1}}> 
            {/* ADDED ON 27/11/2023 BY POOBALAN */}

        <Portal>
          {/* Activity indicator modal */}
          <Modal
            visible={activityIndicatorModalVisible}
            onDismiss={()=>{setActivityIndicatorModalVisible(false)}}
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

{/* Modal to display picture and update checklist placed in Newpicture.js component*/}
          {/* 
              <Modal
            visible={updateModalVisible}
            onDismiss={()=>setUpdateModalVisible(false)}
            contentContainerStyle={containerStyle}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#6a00ff",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            >
              <Text
                style={{
                  alignSelf: "center",
                  paddingTop: 10,
                  color: "white",
                }}
              >
                {props.navigation.state.params.formType === "TASK"
                  ? "Task Update"
                  : props.navigation.state.params.formType === "CHECKLIST"
                  ? "Checklist Update"
                  : ""}
              </Text> 
             </View> 
             <ScrollView>
                <View style={{ padding: 10 }}>
              {(checkProps === "CHECKLIST" &&
                activeChecklistInfo.doesQuestionRequirePicture === "YES" &&
                cameraPicData !== null) ||
              (checkProps === "TASK" &&
                activeChecklistInfo.doesTaskRequirePicture === "YES" &&
                cameraPicData !== null) ? ( //do not show pic when checklist does not need pic and pic data variable is null
               
                <View
                  style={{
                    height: 200,
                    backgroundColor: "transparent",
                    margin: 3,
                  }}
                >
                 
                  <Image
                    style={{
                      height: "100%",
                      // resizeMode: "contain", // commented on 04-FEB-2023
                      resizeMode: "contain",
                      borderRadius: 10,
                    }}
                    source={{
                      uri:cameraPicData.uri,
                    }}
                  />
                </View>
              ) : null} 
             
 {/* <View
                style={{
                  height: 150,
                  backgroundColor: "transparent",
                  margin: 5,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Text >Task Progress: {taskProgress}</Text>
                  <Slider 
                    value={taskProgress}
                    // onValueChange={value => setTaskProgress({value})}
                    onValueChange={setTaskProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    
                  />

                  
                  <Caption style={{ fontSize: 15,paddingTop:4 }}>
                    Is task completed ?
                  </Caption>

                  <Text style={{paddingTop:20}} >CheckList Progress: {checklistProgress}</Text>
                  <Slider 
                    value={checklistProgress}
                    // onValueChange={value => setChecklistProgress({value})}
                    onValueChange={setChecklistProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    disabled={
                      checkProps === "CHECKLIST"
                        ? false
                        : true
                    }
                  />

                  <Caption style={{ fontSize: 15,paddingTop:4 }}>
                    Is checklist completed ?
                  </Caption>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                     paddingTop:40,
                     gap:60
                   
                  }}
                >
                  <Switch

                  
                    value={isTaskCompleted}
                    onValueChange={onToggleTaskSwitch}
                  
                  />

                  <Switch
                    value={isChecklistCompleted}
                    disabled={
                      checkProps === "CHECKLIST"
                        ? false
                        : true
                    }
                    onValueChange={onToggleChecklistSwitch}
                  />
                </View>
              </View>

              <View
                style={{
                  // height: 35,
                  backgroundColor: "transparent",
                  margin: 3,
                  flexDirection: "row",
                  justifyContent: "space-around",
                marginTop:45
                }}
              >
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={() => {
                    // setActivityIndicatorAnimating(true);
                    // setActivityIndicatorModalVisible(true);

                    workbenchData.taskProgress=taskProgress;
                    workbenchData.checklistProgress=checklistProgress;
                   submitChecklistUpdate();
                 setUpdateModalVisible(false)
                  }}
                >
                  Submit
                </Button>

                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={()=>setUpdateModalVisible(false)}
                >
                  Cancel
                </Button>
              </View>  */}
             {/* </View>     

            </ScrollView>
           </Modal>      */} 

          
    

        </Portal>
     
        
       <SnackbarProvider style={{paddingTop:50}}>

        {taskData.length >0 ? (

           <FlatList
           data={taskData}
           renderItem={_renderChecklistItem}
           keyExtractor={(item, index) => index.toString()}
           showsVerticalScrollIndicator={true}
           keyboardShouldPersistTaps="always"
           keyboardDismissMode="on-drag"
           initialNumToRender={5}
           contentContainerStyle={{paddingBottom:30}}
           scrollIndicatorInsets={{ right: 1 }}
           refreshControl={
             <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
           }
         />

        ) : (
           //8-12-2023 vasagi added for animation card
          loadTask===false?
          <Skeleton/>: <Text style={{textAlign:'center', marginTop:15,
        fontWeight:'400', fontSize:15, color:currentMode === "dark" ? "white" : "black"
        }}>{emptyScreenText}</Text>

        
         )
        
            
          
        }
       </SnackbarProvider>
      
      
       
       <View style={{ position: "absolute",
    bottom: 0,
    marginTop: 20,}}>
        <Snackbar
          visible={snackbar}
          onDismiss={()=>setSnackbar(false)}
          duration={2000}
          action={{
            onPress: () => {},
          }}
        >
          <View style={{flexDirection: "row",
    alignItems: "center",}}>
            <Avatar.Icon size={50} icon="check" style={{ backgroundColor: "green",
    marginRight: 12,}} />
          </View>
        </Snackbar>
      </View>
       {/* Snackbar Called from Context component */}
        {/* <Snackbar
          visible={snackBarVisible}
          onDismiss={onDismissSnackBar}
        //  duration={1800}
        autoHideDuration={6000}
        //  elevation={0}
          // Shadow persists in android in spite of background color being transparent.
          // TODO : need to take care of this in future.
          style={
            Platform.OS == "ios"
              ? { width: 70, backgroundColor: "transparent" }
              : { width: 70 }
          }

          // action={{
          //   label: "Ok",
          //   onPress: () => {
          //     // Do something
          //   },
          // }}
        >
          {/* {snackBarText} */}
          {/* <Avatar.Icon
            icon={snackBarMode === "SUCCESS" ? "check" : "alert-decagram"}
            size={40}
            style={
              snackBarMode === "SUCCESS"
                ? { backgroundColor: "green" }
                : { backgroundColor: "orange" }
            } */}
          {/* /> */}
        {/* </Snackbar> */} 
        {/* </SafeAreaView> */}
      </View>
      </Provider>
      
    </>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: "#f0e6ff",
    padding: 10,
    marginVertical: 3,
    // marginHorizontal: 5,
    borderRadius: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height:500,
    width:300,
    margin: 20,
    
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
   // backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  outsideModal: {
    backgroundColor: "rgba(1, 1, 1, 0.2)",
    flex: 1,
  }

 
});

export default ChecklistScreen;
