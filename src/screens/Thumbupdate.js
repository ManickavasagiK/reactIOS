import React, { useState,memo,useContext, useCallback}  from "react";
import { useRef } from "react";
import { navigate } from "../navigationRef";
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
    Appearance,
    Modal
  } from "react-native";
  import {
    Appbar,
    Avatar,
    Button,
    Card,
    Title,
    Paragraph,
   
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
  //import Modalthumbs from "./Modalthumbs";
import { useEffect } from "react";
import Slider from '@react-native-community/slider';
import empReassign from '../hooks/empReassign';
import { useSnackbar } from './Snackbarcomp';
import { Context as AuthContext } from "..//context/AuthContext";
//import Thumbmodal from "./Thumbmodal";
//import { navigate } from "../navigationRef";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
  const Thumbupdate=({props,workbenchData,updateModalVisible,setUpdateModalVisible
  })=>{
    const[updateTask,
      taskUpdateResponse,
        ]=empReassign()

        const { showSnackbar } = useSnackbar();
        const {
          state: { token, isTokenValid },
          validateToken,
        } = useContext(AuthContext);
        const [isTaskCompleted, setIsTaskCompleted] = React.useState(false);
        const [isChecklistCompleted, setIsChecklistCompleted] = React.useState(false);
    const [taskComments, setTaskComments] = React.useState("");
    const [image,setImage]=useState({})
    const [checklistComment, setChecklistComment] = React.useState(""); // comments from comments table
    const [taskProgress, setTaskProgress] = useState(workbenchData.taskProgress);
    const [checklistProgress, setChecklistProgress] = useState(workbenchData.checklistProgress);
    //const [selecteddata,setSelecteddata]=useState([])
    // const [updateModalVisible,setUpdateModalVisible]=useState(false)



useEffect(() => {
  
    if(taskUpdateResponse===true){
      console.log(taskUpdateResponse)
     
      showSnackbar('true')
   
    }

}, [taskUpdateResponse]);

useEffect(()=>{
  
     
   //   console.log(workbenchData.taskStatus)
        if(workbenchData.checklistStatus==="COMPLETED"){
           setIsChecklistCompleted(true)
        }
        else{
          setIsChecklistCompleted(false)
        }
        if(workbenchData.taskStatus==="COMPLETED"){
          setIsTaskCompleted(true)
       }
       else{
         setIsTaskCompleted(false)
       }
  
  
  },[updateModalVisible])
  
  
//console.log("thumbs up modal",workbenchData)
const onToggleTaskSwitch = () =>
{ setIsTaskCompleted(!isTaskCompleted);}

  const onToggleChecklistSwitch = () =>
  {
    setIsChecklistCompleted(!isChecklistCompleted);
  }
   

const containerStyle = {
    backgroundColor: "white",
    padding: 0,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  };
  

 // console.log(workbenchData)

const submitChecklistUpdate = () => {
    console.log("submit task update function called");

    // console.log(cameraPicData);
    var formdata = new FormData();
    try {
      if (workbenchData) {
        var checklistWorkbenchUserActionDto = {
          checklistWorkbenchNumber:
            workbenchData.checklistWorkbenchNumber,
          lineNumber: workbenchData.lineNumber,
          companyCode: workbenchData.companyCode,
          divisionCode: workbenchData.divisionCode,
          wingCode: workbenchData.wingCode,
          blockCode: workbenchData.blockCode,
          floorCode: workbenchData.floorCode,
          taskCode: workbenchData.taskCode,
          checklistCode: workbenchData.questionCode,
          taskProgress: workbenchData.taskProgress,
          checklistProgress: workbenchData.checklistProgress,
          assetUsed: workbenchData.assetUsed,
          taskStatus: workbenchData.taskStatus,
          checklistStatus: workbenchData.checklistStatus,
          supervisorNumber: workbenchData.supervisorNumber,
          employeeNumber: workbenchData.employeeNumber,
          checklistComments: "", // todo - for future use
          taskDate: workbenchData.taskDate,
          taskEndTime: workbenchData.taskEndTime,
          checklistEndTime: workbenchData.checklistEndTime,
          taskStartDate: workbenchData.taskStartDate,
          checklistStartDate: workbenchData.checklistStartDate,
          checklistEndDate: workbenchData.checklistEndDate,
          taskStartTime: workbenchData.taskStartTime,
          checklistStartTime: workbenchData.checklistStartTime,
          belongsToProject: workbenchData.belongsToProject,
          isScheduledTask: workbenchData.isScheduledTask,
        };

        formdata.append(
          "checklistWorkbenchUserActionDto",
          JSON.stringify(checklistWorkbenchUserActionDto)
        );

       


        updateTask(token.jwt, formdata);
        setUpdateModalVisible(false)
        console.log(workbenchData)
      
       
    }
    } catch (err) {
    console.log(err);
    }
  };




  const currentMode = getCurrentAppearanceMode();

  return(
    <>
        
  <Modal
            visible={updateModalVisible}
            onRequestClose={() => {
              //Alert.alert('Modal has been closed.');
              setUpdateModalVisible(!updateModalVisible);
            
            }}
            transparent={true}
            contentContainerStyle={containerStyle}
          >
              <Pressable style={styles.outsideModal}
          onPress={(event) => { if (event.target == event.currentTarget) { 
            setUpdateModalVisible(false);
            setIsChecklistCompleted(false)
            setIsTaskCompleted(false)
            setTaskProgress(0)
            setChecklistProgress(0)
             } }} >
               <View style={styles.centeredView}>
          <View style={[
                styles.modalView,
                {
                  backgroundColor:
                    currentMode === "dark" ? "#424242" : "#f2f2f2",
                }, //ADDED
              ]}
            >
         
              
          <View
                style={{
                  height: 350,

                  // borderTopRightRadius: 1,
                  // borderTopLeftRadius: 10,
                  width: 300,
                }}
              >
             
              <View
              style={{
                height: 40,
                backgroundColor:
                      currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff",
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
                {props.navigation.state.params.formType=== "TASK"
                  ? "Task Update"
                  : props.navigation.state.params.formType=== "CHECKLIST"
                  ? "Checklist Update"
                  : ""}
              </Text> 
             </View>  
         
                <View style={{ padding: 10 }}>
                <View
                style={{
                //  height: 150,
                  backgroundColor: "transparent",
                  margin: 5,
                  flexDirection: "row",
                }}
              >

                 <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                    
                  }}
                >
                  <Text style={{paddingBottom:10,color: currentMode === "dark" ? "white" : "black",}}>Task Progress: {taskProgress}</Text>
                  <Slider 
                    value={taskProgress}
                    // onValueChange={value => setTaskProgress({value})}
                    onValueChange={setTaskProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    style={{marginLeft:-13}}
                  />

               </View>

              

                </View>
                <View
                style={{
                 
                  backgroundColor: "transparent",
                  margin: 5,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems:'center',
                  marginTop:-10
                  
                  
                }}
              >
                <Caption style={{ fontSize: 15,
                  color: currentMode === "dark" ? "white" : "black",
                  flex:1 }}>
                    Is task completed ?
                  </Caption>
                  <Switch

                        style={{ }}
                          value={isTaskCompleted}
                          onValueChange={onToggleTaskSwitch}

                          />
                 </View>
                 <View>
                 {isTaskCompleted? 
                  <Caption style={{ fontSize: 15, color: currentMode === "dark" ? "#20d40c" : "green",marginTop:-15,
                  marginLeft:4}}>
                     Task completed
                  </Caption>:null}
                 </View>
                 <View
                style={{
                //  height: 150,
                  backgroundColor: "transparent",
                  margin: 5,
                  flexDirection: "row",
                  marginTop:1
                }}
              >

                 <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Text style={{paddingTop:5,
                  color: currentMode === "dark" ? "white" : "black",
                    paddingBottom:15}} >CheckList Progress: {checklistProgress}</Text>
                  <Slider 
                    value={checklistProgress}
                    // onValueChange={value => setChecklistProgress({value})}
                    onValueChange={setChecklistProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    disabled={
                      props.navigation.state.params.formType === "CHECKLIST"
                        ? false
                        : true
                    }
                    style={{marginLeft:-13}}
                  />
               </View>

              

                </View>
                



                <View
                style={{
                 
                  backgroundColor: "transparent",
                  margin: 6,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems:'center',
                  marginTop:-10
                  
                  
                }}
              >
                 <Caption style={{ fontSize: 15,color: currentMode === "dark" ? "white" : "black",flex:1}}>
                    Is checklist completed ?
                  </Caption>
                  <Switch
                    value={isChecklistCompleted}
                    disabled={
                      props.navigation.state.params.formType === "CHECKLIST"
                        ? false
                        : true
                    }
                    onValueChange={onToggleChecklistSwitch}
                  />
                 


                 </View>
                 <View>
                 {isChecklistCompleted? 
                  <Caption style={{ fontSize: 15, color: currentMode === "dark" ? "#20d40c" : "green",
                  marginTop:-15,marginLeft:5}}>
                     CheckList completed
                  </Caption>:null}
                 </View>

                 <View
                style={{
                  // height: 35,
                  backgroundColor: "transparent",
                  margin: 3,
                  flexDirection: "row",
                  justifyContent: "space-around",
                marginTop:20
                }}
              >
                <Button
                  style={{ marginLeft: 0,backgroundColor:'#6a00ff' }}
                  mode="contained"
                  onPress={() => {
                    isChecklistCompleted?workbenchData.checklistStatus="COMPLETED":workbenchData.taskStatus="PENDING"
                  isTaskCompleted?workbenchData.taskStatus="COMPLETED":workbenchData.taskStatus="PENDING"

                   workbenchData.taskProgress=taskProgress;
                    workbenchData.checklistProgress=checklistProgress;
                   submitChecklistUpdate();
                 setUpdateModalVisible(false)
                  }}
                >
                  Submit
                </Button>

                <Button
                  style={{ marginLeft: 0,backgroundColor:'#6a00ff'  }}
                  mode="contained"
                  onPress={()=>{setUpdateModalVisible(false);
                    setIsChecklistCompleted(false)
                    setIsTaskCompleted(false)
                    setTaskProgress(0)
            setChecklistProgress(0)
                  }
                  
                  }
                >
                  Cancel
                </Button>
              </View>





{/*               
              <View
                style={{
                  height: 150,
                  backgroundColor: "transparent",
                  margin: 5,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 0.9,
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Text style={{paddingBottom:10}}>Task Progress: {taskProgress}</Text>
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
                  {isTaskCompleted? 
                  <Caption style={{ fontSize: 15,paddingTop:10 , color:'green'}}>
                     Task completed
                  </Caption>:null}

                  <Text style={{paddingTop:20,paddingBottom:15}} >CheckList Progress: {checklistProgress}</Text>
                  <Slider 
                    value={checklistProgress}
                    // onValueChange={value => setChecklistProgress({value})}
                    onValueChange={setChecklistProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    disabled={
                      props.navigation.state.params.formType === "CHECKLIST"
                        ? false
                        : true
                    }
                  />

                  <Caption style={{ fontSize: 15,paddingTop:4 }}>
                    Is checklist completed ?
                  </Caption>
                  {isTaskCompleted? 
                  <Caption style={{ fontSize: 15,paddingTop:10 , color:'green'}}>
                   Checklist Completed
                  </Caption>:null}
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
                      props.navigation.state.params.formType === "CHECKLIST"
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
                marginTop:30
                }}
              >
                <Button
                  style={{ marginLeft: 0,backgroundColor:'#6a00ff' }}
                  mode="contained"
                  onPress={() => {
                    isChecklistCompleted?workbenchData.checklistStatus="COMPLETED":workbenchData.taskStatus="PENDING"
                  isTaskCompleted?workbenchData.taskStatus="COMPLETED":workbenchData.taskStatus="PENDING"

                   workbenchData.taskProgress=taskProgress;
                    workbenchData.checklistProgress=checklistProgress;
                   submitChecklistUpdate();
                 setUpdateModalVisible(false)
                  }}
                >
                  Submit
                </Button>

                <Button
                  style={{ marginLeft: 0,backgroundColor:'#6a00ff'  }}
                  mode="contained"
                  onPress={()=>{setUpdateModalVisible(false);
                    setIsChecklistCompleted(false)
                    setIsTaskCompleted(false)
                  
                  }
                  
                  }
                >
                  Cancel
                </Button>
              </View> */}
            </View>     

           
        </View>
        
         
          
            </View>
            </View>
            </Pressable> 
           </Modal> 
   
      {/* <TouchableOpacity
            style={{ marginHorizontal: 5 }}
            onPress={() => {
              console.log(new Date().getTime());
            //  setActiveChecklistInfo(workbenchData);
          //    setSelecteddata(workbenchData)
              console.log(
                `Update pressed for ${workbenchData.questionCode}, ${workbenchData.checklistWorkbenchNumber}, ${workbenchData.lineNumber}`
              );

              if (props.navigation.state.params.formType=== "CHECKLIST") {
                if (workbenchData.doesQuestionRequirePicture === "YES") {
                  opsxProps = {
                    workbenchData: workbenchData,
                    lastRouteName:props.navigation.state.routeName,
                  };
                  navigate("Camera", opsxProps);
                } else {
                  //checklist does not require picture update

                  workbenchData.taskStatus === "COMPLETED"
                    ? setIsTaskCompleted(true)
                    : setIsTaskCompleted(false);
                  workbenchData.checklistStatus === "COMPLETED"
                    ? setIsChecklistCompleted(true)
                    : setIsChecklistCompleted(false);
                  setTaskComments(workbenchData.taskComments);
                  setTaskProgress(workbenchData.taskProgress);
                  setChecklistProgress(workbenchData.checklistProgress);
                  setUpdateModalVisible(true);
                }
              }
               else if (props.navigation.state.params.formType === "TASK") {
                if (workbenchData.doesTaskRequirePicture === "YES") {
                  opsxProps = {
                    workbenchData: workbenchData,
                    lastRouteName:props.navigation.state.routeName,
                  };
                  navigate("Camera", opsxProps);
                } else {
                  // checklist does not require picture update

                  workbenchData.taskStatus === "COMPLETED"
                    ? setIsTaskCompleted(true)
                    : setIsTaskCompleted(false);
                  workbenchData.checklistStatus === "COMPLETED"
                    ? setIsChecklistCompleted(true)
                    : setIsChecklistCompleted(false);
                  setTaskComments(workbenchData.taskComments);
                  setTaskProgress(workbenchData.taskProgress);
                  setChecklistProgress(workbenchData.checklistProgress);
                  setUpdateModalVisible(true);
                  
                }
              }
              console.log(new Date().getTime());
            }}
          >
            <Avatar.Icon
              icon={
                props.navigation.state.params.formType=== "CHECKLIST"
                  ? workbenchData.doesQuestionRequirePicture === "YES"
                    ? "camera"
                    : "thumb-up"
                  :props.navigation.state.params.formType === "TASK"
                  ? workbenchData.doesTaskRequirePicture === "YES"
                    ? "camera"
                    : "thumb-up"
                  : null
              }
              size={30}
            />
          </TouchableOpacity> 
          */}

         
    
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
    // modalView: {
    //   height: 470,
    //   width: 300,
    //  // margin: 20,
  
    //   backgroundColor: "white",
    //   borderRadius: 20,
    //   padding: 35,
    //   alignItems: "center",
    //   shadowColor: "#000",
    //   shadowOffset: {
    //     width: 0,
    //     height: 2,
    //   },
    //   shadowOpacity: 0.25,
    //   shadowRadius: 4,
    //   elevation: 5,
    // },
    modalView: {
      height:350,
      width:300,
      margin: 20,
      
      backgroundColor: 'white',
      borderRadius: 20,
     // padding: 3,
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
      backgroundColor: '#6a00ff',
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
  export default memo(Thumbupdate);