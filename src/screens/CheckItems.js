import React, { useCallback, useContext, useEffect,setstate, useState,createContext, useMemo } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Col, Row, Grid } from "react-native-easy-grid";


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
import Emp from './Emp'
import Comment from "./Comment/Comment";
//import Snackbarcomp from "./Snackbarcomp";
import { SnackbarProvider } from './Snackbarcomp';
//import Filter from "./Checkheader/Filter";
//import Filter from "./Checkheader/Filter";
import Skeleton from "./Skeletoncard";
//import { from } from "core-js/core/array";
import Thumbupdate from "./Thumbupdate"
//import Modalthumbs from "./Modalthumbs";
//import Thumbmodal from "./Thumbmodal";
//import { turn } from "core-js/core/array";
//import { tokens } from "react-native-paper/lib/typescript/styles/themes/v3/tokens";

// import empReassign from "../hooks/empReassign";
//import Checkls from "./Checkls/Checkls";
// import checkList from "../hooks/checkList";
// import gettaskbyHook from "../hooks/gettaskbyHook";
// import employeeSup from "../hooks/employeeSup";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
//Added by poobalan for Dark and light Mode Theme
const getCurrentAppearanceMode = () => Appearance.getColorScheme(); // ADDED ON 06/12/2023 BY POOBALAN
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

export function formatDateTime(dateString, timeString) {
  const taskDate = new Date(dateString);
  const taskTime = new Date(`1970-01-01T${timeString}`);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = taskDate.getDate();
  const month = monthNames[taskDate.getMonth()];
  const year = taskDate.getFullYear();

  const hours = taskTime.getHours();
  const minutes = taskTime.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
 
  // return {
  //      day1:day,
  //      month1:month,
  //      year1:year,
  //      hrs:formattedHours,
  //      mins:formattedMinutes,
  //      ampm1:ampm


  // }



 return `${day} ${month}, ${year} ${formattedHours}:${formattedMinutes} ${ampm}`;
}




export const calculateTimeRemaining = (taskDate, taskEndTime) => {
  const currentDateTime = new Date();
  const taskEndDateTime = new Date(taskDate + " " + taskEndTime);

  if (currentDateTime > taskEndDateTime) {
    return {
      text: "OVERDUE",
      style: { color: "red", fontWeight: "bold" },
    };
  } else {
    const timeDiff = taskEndDateTime - currentDateTime;
    const millisecondsInADay = 1000 * 60 * 60 * 24;

    if (timeDiff >= millisecondsInADay) {
      const days = Math.floor(timeDiff / millisecondsInADay);
      let remainingTime = timeDiff % millisecondsInADay; // Remove days from timeDiff
      const hours = Math.floor(remainingTime / (1000 * 60 * 60));
      const minutes = Math.floor(
        (remainingTime % (1000 * 60 * 60)) / (1000 * 60)
      );

      let text = `${days} day${days > 1 ? "s" : ""}`;
      if (hours > 0 || minutes > 0) {
        text += ` ${hours}h ${minutes}m`;
      }
      //return text
      return {
        text,
        //Added by poobalan for Dark and light Mode Theme
        style: {
          color: currentMode === "dark" ? "#20d40c" : "green", //ADDED
          fontWeight: "bold",
          // color: "black", //ADDED
          //fontWeight: "bold",
        },
      };

    } else {
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      const text = `${hours}h:${minutes}m:${seconds}s`;
     // return text
      return {
        text,
        //Added by poobalan for Dark and light Mode Theme
        style: {
          color: currentMode === "dark" ? "#20d40c" : "green", //ADDED
          fontWeight: "bold",
        },

       // style: { color: "black", fontWeight: "bold" },
      };
    }
  }}

export const appContext=createContext(null);
const currentMode = getCurrentAppearanceMode();
const ChecklistItem = ({workbenchData,employeeList,props,token,cmtFlatlist})=> 
{
//   const {
//     state: { token, isTokenValid },
//     validateToken,
//   } = useContext(AuthContext);

  //ADDED ON 06/12/2023 BY POOBALAN
const [commentsModalVisible,setCommentsModalVisible]=useState(false)
const currentMode = getCurrentAppearanceMode();
const [thumbsModal,setThumbsmodal]=useState(false)
  const [cmtModal,setCmtmodal]=useState(false)
const [openModal,setOpenmodal]=useState(false)
const [modalVisible, setModalVisible] = useState(false);
const[serchFilter,setSerchfilter]=useState([])
  const [updateModalVisible,setUpdateModalVisible]=useState(false)
  const[empName,setEmpname]=useState('')
 
  
 
  
  //console.log("Employee", employeeList)
  const [taskData, setTaskData] = useState([]);
  const [tempTaskData, setTempTaskDate] = useState([]);
  let opsxProps = {};
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: "blue",
      background: "white", // Set your desired background color
      text: "black", // Set your desired text color
    },
    //mode: "light",
  };
 // const theme = useTheme();
//console.log("check",token)
//console.log("Emp list", employeeList )
  const [employeeAlphaName, setEmployeeAlphaName] = useState(
    workbenchData.employeeAlphaName
  );
  const Wdata=workbenchData;
 const dateformate=formatDateTime(workbenchData.taskDate,workbenchData.taskEndTime)
 const datecalc=calculateTimeRemaining(workbenchData.taskDate,workbenchData.taskEndTime)
 //console.log(dateformate)
 
  return(
    <>
     <View   
     //Added by poobalan for Dark and light Mode Theme  
         style={{
          backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //"black", //"#e6e6ff", ADDED
        }}
      >

      
      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
         // backgroundColor: "#e6e6ff",
          // backgroundColor: "#f0e6ff",
          //Added by poobalan for Dark and light Mode Theme
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", //"#1d1b1e", //"#e6e6ff", REMOVE #e1dcf2 #362c3f
          // backgroundColor: "#f0e6ff", #1d1b1e
        }}
      >

       
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
          {/* //Added by poobalan for Dark and light Mode Theme */}
             <Title
              style={{ color: currentMode === "dark" ? "white" : "black" }}
            >

            {workbenchData.facilityName}
          </Title>
          {/* <Paragraph>{workbenchData.taskInLanguage}</Paragraph> */}
          <Paragraph 
          //Added by poobalan for Dark and light Mode Theme
            style={{
            color: currentMode === "dark" ? "white" : "black", //color: theme.colors.onPrimaryContainer
            }}
           >
          
          {/* // style={{ color: theme.colors.onPrimaryContainer }}> */}
            {workbenchData.taskInLanguage}
          </Paragraph>

          <View style={{ marginTop: 2, marginBottom: 2, flexDirection: "row" }}>
            <View style={{ flex: 0.4 }}>
            {/* //Added by poobalan for Dark and light Mode Theme */}
            <Text
                  style={{
                    color: currentMode === "dark" ? "white" : "black", //color: theme.colors.onPrimaryContainer
                  }}
                >

              {/* <Text style={{ color: theme.colors.onPrimaryContainer }}> */}
                Time Remaining:
              </Text>
            </View>
            <View
              style={{
                flex: 0.50,
              }}
            >
              {props.navigation.state.params.formType === "CHECKLIST" ? (
                <Text
                  style={{
                    color:
                    //  workbenchData.checklistStatus !== "COMPLETED" &&
                      // countDownTimer(
                      //   workbenchData.taskDate,
                      //   workbenchData.checklistEndTime
                      // ).isOverdue === true
                      //   ? "red"
                      //   : "#6200ee",
                    datecalc.style.color,
                     fontWeight:datecalc.style.fontWeight
                  }}
                

                >
                  {/* {workbenchData.checklistStatus === "COMPLETED"
                    ? "DONE"
                    : countDownTimer(
                        workbenchData.taskDate,
                        workbenchData.checklistEndTime
                      ).isOverdue === false
                    ? countDownTimer(
                        workbenchData.taskDate,
                        workbenchData.checklistEndTime
                      ).timeRemaining
                    : "OVERDUE"} */}
                    {datecalc.text}
                    
                </Text>
              ) : props.navigation.state.params.formType === "TASK" ? (
                <Text
                  style={{
                    // color:
                    //   workbenchData.taskStatus !== "COMPLETED" &&
                    //   countDownTimer(
                    //     workbenchData.taskDate,
                    //     workbenchData.taskEndTime
                    //   ).isOverdue === true
                    //     ? "red"
                    //     : "#6200ee",
                    color:
                    //  workbenchData.checklistStatus !== "COMPLETED" &&
                      // countDownTimer(
                      //   workbenchData.taskDate,
                      //   workbenchData.checklistEndTime
                      // ).isOverdue === true
                      //   ? "red"
                      //   : "#6200ee",
                    datecalc.style.color,
                     fontWeight:datecalc.style.fontWeight
                  }}
                >
                  {/* {workbenchData.taskStatus === "COMPLETED"
                    ? "DONE"
                    : countDownTimer(
                        workbenchData.taskDate,
                        workbenchData.taskEndTime
                      ).isOverdue === false
                    ? countDownTimer(
                        workbenchData.taskDate,
                        workbenchData.taskEndTime
                      ).timeRemaining
                    : "OVERDUE"} */}
                    {datecalc.text}
                </Text>
              ) : null}
            </View>
            <View
              style={{
                flex: 0.16,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <MaterialCommunityIcons
                name="alpha-t-circle"
                size={20}
                color={
                  workbenchData.isTaskCompletedOnTime === "YES" &&
                  workbenchData.taskStatus === "COMPLETED"
                    ? "green"
                    : workbenchData.isTaskCompletedOnTime === "NO" &&
                      workbenchData.taskStatus === "COMPLETED"
                    ? "red"
                    : "transparent"
                }
              />
              <MaterialCommunityIcons
                name="alpha-c-circle"
                size={20}
                color={
                  workbenchData.isCompletedOnTime === "YES" &&
                  workbenchData.checklistStatus === "COMPLETED"
                    ? "green"
                    : workbenchData.isCompletedOnTime === "NO" &&
                      workbenchData.checklistStatus === "COMPLETED"
                    ? "red"
                    : "transparent"
                }
              />
            </View>
          </View>

          <View style={{ marginBottom: 2, flexDirection: "row" }}>
            <View style={{ flex: 0.4 }}>
               {/* Added by poobalan for dark and light mode theme */}
            <Text
                  style={{
                    color: currentMode === "dark" ? "white" : "black", //color: theme.colors.onPrimaryContainer
                  }}
                >

              {/* <Text style={{ color: theme.colors.onPrimaryContainer }}> */}
                Task End:
              </Text>
            </View>
             {/* Added by poobalan for dark and light mode theme */}
            <View
                style={{
                  flex: 0.5,
                  color: currentMode === "dark" ? "white" : "black",
                }}
              >

            {/* <View style={{flex: 0.50,}}> */}
              {/* <Text>{workbenchData.taskDate}</Text> */}
              {/* <Text>{`${dateformate.day1}.${dateformate.month1}.${dateformate.year1}`}</Text> */}
              {/* //Added by poobalan for Dark and light Mode Theme */}
              <Text
                  style={{
                    flex: 0.5,
                    color: currentMode === "dark" ? "white" : "black",
                  }}
                >
                {dateformate}</Text>
            </View>
            <View style={{ flex: 0.16 }}></View>
          </View>

          {/* <View style={{ marginBottom: 2, flexDirection: "row" }}>
            <View style={{ flex: 0.4 }}>
              <Text style={{ color: theme.colors.onPrimaryContainer }}>
                Task End Time:
              </Text>
            </View>
            <View style={{ flex: 0.44 }}>
            <Text>{`${dateformate.hrs}:${dateformate.mins} ${dateformate.ampm1}`}</Text>
            </View>
            <View style={{ flex: 0.16 }}></View>
          </View> */}

          {props.navigation.state.params.formType === "CHECKLIST" ? (
            <View style={{ marginBottom: 2, flexDirection: "row" }}>
              <View style={{ flex: 0.4 }}>
                 {/* Added by poobalan for dark and light mode theme */}
              <Text
                    style={{
                      color: currentMode === "dark" ? "white" : "black", //color: theme.colors.onPrimaryContainer
                    }}
                  >

                {/* <Text style={{ color: theme.colors.onPrimaryContainer }}> */}
                  Employee:
                </Text>
              </View>
              <View style={{ flex: 0.50, }}>
                 {/* Added by poobalan for dark and light mode theme */}
              <Text
                    style={{
                      color: currentMode === "dark" ? "white" : "black", //color: theme.colors.onPrimaryContainer
                    }}
                  >

                  
                  {employeeAlphaName} </Text>
              </View>
              <View
                style={{ flex: 0.16, alignItems: "flex-end", marginBottom: 3 }}
              >
               
               <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                     setSerchfilter(employeeList)
                     setOpenmodal(true)
                  }}
         
                >
                
                    <Avatar.Icon icon="account" size={25} 
                                          backgroundColor="#6a00ff"
                                          color="white" //ADDED
                    
                    />  
                </TouchableOpacity> 
              
               
                   
            
                
              </View>
            </View>
          ) : null}
        </Card.Content>

        <Divider style={{ backgroundColor:currentMode === "dark" ? "white" : "#a300ee"}}/>

         <Card.Actions style={{ justifyContent: "flex-end" }}>
         <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              //console.log(activeChecklistInfo);
       // setActiveChecklistInfo(workbenchData);
             //setFacname(workbenchData.facilityName)
              // getComments(
              //   token.jwt,
              //   workbenchData.checklistWorkbenchNumber,
              //   workbenchData.lineNumber
              // );
             // setRenderItemType("COMMENTS");
              // setEmpno(workbenchData.employeeNumber)
           //    setBenchno(workbenchData.checklistWorkbenchNumber)
            //   setLineno(workbenchData.lineNumber)
            setCmtmodal(true)
              setCommentsModalVisible(true);
            }}
          >
            <Avatar.Icon icon="forum" size={30} 
            backgroundColor="#6a00ff"
            color="white" //ADDED

            />
          </TouchableOpacity>  

         
         

           
            {workbenchData.pictureMetaDataDtoList != null &&
          workbenchData.pictureMetaDataDtoList.length > 0 ? (
            <TouchableOpacity
              style={{ marginHorizontal: 5 }}
              onPress={() => {
                opsxProps = {
                  pictureMetaDataDtoList: workbenchData.pictureMetaDataDtoList,
                  lastRouteName: props.navigation.state.routeName,
                  sourceOfData: "CURRENT",
                };
            
                navigate("Pictures", opsxProps);
              }}
            >
              <Avatar.Icon icon="paperclip" size={30} 
              backgroundColor="#6a00ff"
              color="white" //ADDED

              
              />
            </TouchableOpacity>
          ) : null} 
           <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              props.navigation.state.params.formType === "CHECKLIST"
                ? workbenchData.hasDetail
                  ? ((opsxProps = {
                      workbenchData: workbenchData,
                      lastRouteName: props.navigation.state.routeName,
                      mode: "EDIT",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                      formName: "Checklist Detail",
                    }),
                    navigate("ChecklistDetail", opsxProps))
                  : ((opsxProps = {
                      workbenchData: workbenchData,
                      lastRouteName: props.navigation.state.routeName,
                      mode: "ADD",
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                      formName: "Checklist Detail",
                    }),
                    navigate("ChecklistDetail", opsxProps))
                : props.navigation.state.params.formType === "TASK"
                ? workbenchData.hasDetail
                  ? ((opsxProps = {
                      workbenchData: workbenchData,
                      lastRouteName: props.navigation.state.routeName,
                      mode: "EDIT",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                      formName: "Task Detail",
                    }),
                    navigate("ChecklistDetail", opsxProps))
                  : ((opsxProps = {
                      workbenchData: workbenchData,
                      lastRouteName: props.navigation.state.routeName,
                      mode: "ADD",
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                      formName: "Task Detail",
                    }),
                    navigate("ChecklistDetail", opsxProps))
                : null;
            }}
          >
            <Avatar.Icon icon="format-list-bulleted" size={30} 
            backgroundColor="#6a00ff"
            color="white" //ADDED

            />
          </TouchableOpacity> 
          <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              console.log(new Date().getTime());
             // setActiveChecklistInfo(workbenchData);
              console.log(
                `Update pressed for ${workbenchData.questionCode}, ${workbenchData.checklistWorkbenchNumber}, ${workbenchData.lineNumber}`
              );

              if (props.navigation.state.params.formType === "CHECKLIST") {
                if (workbenchData.doesQuestionRequirePicture === "YES") {
                  opsxProps = {
                    workbenchData: workbenchData,
                    lastRouteName: props.navigation.state.routeName,
                  };
                  navigate("Camera", opsxProps);
                } else {
                  // checklist does not require picture update

                  // workbenchData.taskStatus === "COMPLETED"
                  //   ? setIsTaskCompleted(true)
                  //   : setIsTaskCompleted(false);
                  // workbenchData.checklistStatus === "COMPLETED"
                  //   ? setIsChecklistCompleted(true)
                  //   : setIsChecklistCompleted(false);
                  // setTaskComments(workbenchData.taskComments);
                  // setTaskProgress(workbenchData.taskProgress);
                  // setChecklistProgress(workbenchData.checklistProgress);
                  setThumbsmodal(true)
                  setUpdateModalVisible(true);
                }
              } else if (props.navigation.state.params.formType === "TASK") {
                if (workbenchData.doesTaskRequirePicture === "YES") {
                  opsxProps = {
                    workbenchData: workbenchData,
                   // lastRouteName: props.navigation.state.routeName,
                   lastRouteName:"TASK"
                  };
                  console.log(" task opsxprops",opsxProps)
                  setUpdateModalVisible(true)
                 navigate("Camera", opsxProps);
                } else {
                  // checklist does not require picture update

                  // workbenchData.taskStatus === "COMPLETED"
                  //   ? setIsTaskCompleted(true)
                  //   : setIsTaskCompleted(false);
                  // workbenchData.checklistStatus === "COMPLETED"
                  //   ? setIsChecklistCompleted(true)
                  //   : setIsChecklistCompleted(false);
                  // setTaskComments(workbenchData.taskComments);
                  // setTaskProgress(workbenchData.taskProgress);
                  // setChecklistProgress(workbenchData.checklistProgress);
                  setThumbsmodal(true)
                  setUpdateModalVisible(true);
                }
              }
              console.log(new Date().getTime());
            }}
          >
            <Avatar.Icon
              icon={
                props.navigation.state.params.formType === "CHECKLIST"
                  ? workbenchData.doesQuestionRequirePicture === "YES"
                    ? "camera"
                    : "thumb-up"
                  : props.navigation.state.params.formType === "TASK"
                  ? workbenchData.doesTaskRequirePicture === "YES"
                    ? "camera"
                    : "thumb-up"
                  : null
              }
              size={30}
              backgroundColor="#6a00ff"
                color="white" //ADDED

            />
          </TouchableOpacity>
             {/* <Thumbupdate 
            props={props}
            workbenchData={workbenchData} 
          //   checkProps={checkProps}
          //   headerRoot={headerRoot} 
          //   isChecklistCompleted={isChecklistCompleted}
          //  setIsTaskCompleted={setIsTaskCompleted}
          //  setIsChecklistCompleted={setIsChecklistCompleted}
          //   setUpdateModalVisible={setUpdateModalVisible}
          //   setTaskProgress={setTaskProgress}
          //   setChecklistProgress={setChecklistProgress}
            />
             */}
         </Card.Actions>  
      </Card>
      {
         cmtModal?( <Comment token={token} 
         
          workbenchData={workbenchData}
          
         cmtFlatlist={cmtFlatlist}
         commentsModalVisible={commentsModalVisible}
         setCommentsModalVisible={setCommentsModalVisible}

        />):null
      }

{thumbsModal?(<Thumbupdate updateModalVisible={updateModalVisible}

setUpdateModalVisible={setUpdateModalVisible}  props={props} workbenchData={Wdata} /> ):null}


{openModal?(<Emp modalVisible={modalVisible} setModalVisible={setModalVisible} workbenchData={Wdata}

token={token}
setEmployeeAlphaName={setEmployeeAlphaName}
serchFilter={serchFilter} setSerchfilter={setSerchfilter} employeeList={employeeList}
/>):null}


      </View>
    
    </>
  )


}
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    height:430,
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
})
export default ChecklistItem;