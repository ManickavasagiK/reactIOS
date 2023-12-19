import React, { createContext, useState,memo,useCallback,useContext}  from "react";
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
    Modal,
    Appearance,
    Dimensions
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
 
import { useEffect } from "react";
import Slider from '@react-native-community/slider';
import empReassign from '../hooks/empReassign';
import useTaskResults from "../hooks/useTaskResults";
import { Context as AuthContext } from "../context/AuthContext";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
//Added by poobalan for Dark and light Mode Theme
const Newpicture=({imageData,lastProps,selecteddata})=>{
    const {
        state: { token, isTokenValid },
        validateToken,
      } = useContext(AuthContext);
     
      const[updateTask,
        taskUpdateResponse,
          ]=empReassign()
          const [snackbar, setSnackbar] = useState(false);
  
          const [activityIndicatorModalVisible,setActivityIndicatorModalVisible]=useState(false)
          const [snackBarMode,setSnackBarMode]=useState("SUCCESS")
      const [taskProgress, setTaskProgress] = useState(selecteddata.taskProgress);
      const [checklistProgress, setChecklistProgress] = useState(selecteddata.checklistProgress);
     // const [selecteddata,setSelecteddata]=useState([])
      const [isTaskCompleted, setIsTaskCompleted] = React.useState(false);
        const [isChecklistCompleted, setIsChecklistCompleted] = React.useState(false);
    const [taskComments, setTaskComments] = React.useState("");
    const [updateModalVisible,setUpdateModalVisible]=useState(true)
    const [isCheck,setIscheck]=useState("")
    const [isTask,setIstask]=useState("")
 const [isUpdated,setIsupdatated]=useState(false)
      



const containerStyle = {
    backgroundColor: "white",
    padding: 0,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  }; 

useEffect(()=>{
console.log("picture screen")
console.log(selecteddata)
    console.log(selecteddata.checklistStatus)
    console.log(selecteddata.taskStatus)
      if(selecteddata.checklistStatus==="COMPLETED"){
         setIsChecklistCompleted(true)
      }
      else{
        setIsChecklistCompleted(false)
      }
      if(selecteddata.taskStatus==="COMPLETED"){
        setIsTaskCompleted(true)
     }
     else{
       setIsTaskCompleted(false)
     }


},[])




const submitChecklistUpdate = () => {
  console.log("submit task update function called");

  // console.log(cameraPicData);
  var formdata = new FormData();
  try {
    if (selecteddata) {
      var checklistWorkbenchUserActionDto = {
        checklistWorkbenchNumber:
          selecteddata.checklistWorkbenchNumber,
        lineNumber: selecteddata.lineNumber,
        companyCode: selecteddata.companyCode,
        divisionCode: selecteddata.divisionCode,
        wingCode: selecteddata.wingCode,
        blockCode: selecteddata.blockCode,
        floorCode: selecteddata.floorCode,
        taskCode: selecteddata.taskCode,
        checklistCode: selecteddata.questionCode,
        taskProgress: selecteddata.taskProgress,
        checklistProgress: selecteddata.checklistProgress,
        assetUsed: selecteddata.assetUsed,
        taskStatus: selecteddata.taskStatus,
        checklistStatus: selecteddata.checklistStatus,
        supervisorNumber: selecteddata.supervisorNumber,
        employeeNumber: selecteddata.employeeNumber,
        checklistComments: "", // todo - for future use
        taskDate: selecteddata.taskDate,
        taskEndTime: selecteddata.taskEndTime,
        checklistEndTime: selecteddata.checklistEndTime,
        taskStartDate: selecteddata.taskStartDate,
        checklistStartDate: selecteddata.checklistStartDate,
        checklistEndDate: selecteddata.checklistEndDate,
        taskStartTime: selecteddata.taskStartTime,
        checklistStartTime: selecteddata.checklistStartTime,
        belongsToProject: selecteddata.belongsToProject,
        isScheduledTask: selecteddata.isScheduledTask,
        
      };

      formdata.append(
        "checklistWorkbenchUserActionDto",
        JSON.stringify(checklistWorkbenchUserActionDto)
      );

     

//         // 24-JAN-2023
//         // prepare picture data for checklist update

        if (
          selecteddata.doesQuestionRequirePicture === "YES" &&
          lastProps === "Checklist"
        ) {

        //  console.log("picture update")
          var today = new Date();
          var pictureName =
            selecteddata.questionCode +
            "_" +
            selecteddata.supervisorNumber +
            "_" +
            today.toISOString().substring(0, 19) +
            ".jpg";
          formdata.append("pictureFileList", {
            uri: imageData.uri,
            type: "image/jpeg",
            name: pictureName,
            created: today,
          });
          updateTask(token.jwt, formdata);
          if(taskUpdateResponse){
            // console.log(taskUpdateResponse)
      
            // setIsupdatated(true)
            // console.log("updated status with in if",isUpdated)
            
           
          let  opsxProps = {
              lastRouteName: "New Picture",
             sourceOfData: "CURRENT",
              formType: "CHECKLIST",
              appBarTitle: "My Checklist",
              status:"true"
            };
         // console.log("new picture",lastProps)
          navigate("Checklist", opsxProps);
          // selecteddata.pictureMetaDataDtoList={uri: imageData.uri,
          //   type: "image/jpeg",
          //   name: pictureName,
          //   created: today,}
        }
        else{
          console.log("Update faild")
        }
      
      
      }
        // 24-JAN-2023
        // prepare picture data for task update

        if (
          selecteddata.doesTaskRequirePicture === "YES" &&
          lastProps === "TASK"
        ) {
          var today = new Date();
          var pictureName =
            selecteddata.taskCode +
            "_" +
            selecteddata.employeeNumber +
            "_" +
            today.toISOString().substring(0, 19) +
            ".jpg";
          formdata.append("pictureFileList", {
            uri: imageData.uri,
            type: "image/jpeg",
            name: pictureName,
            created: today,
          });
         
          updateTask(token.jwt, formdata);
          if(taskUpdateResponse){
            let  opsxProps = {
              lastRouteName: "New Picture",
                sourceOfData: "CURRENT",
                formType: "TASK",
                appBarTitle: "My Tasks",
                status:"true"
                
              };
        //  console.log("new picture",lastProps)
          navigate("Checklist", opsxProps);}

        }
        else{
          console.log("Update faild")
        }
  
    
    // var  opsxProps = {
      
    //   action: "COMPLETED"
    // };
    //  navigate(lastProps,opsxProps);
    // console.log(selecteddata)
     
  }
  } catch (err) {
  console.log(err);
  }
};


const onToggleTaskSwitch = () =>
{ setIsTaskCompleted(!isTaskCompleted);}

  const onToggleChecklistSwitch = () =>
  {
    setIsChecklistCompleted(!isChecklistCompleted);
  }
   
//Added by poobalan for Dark and light Mode Theme
  const currentMode = getCurrentAppearanceMode();
    return(
        <>
        <View  style={{
    backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", flex:1}}>
  <ScrollView 
  // persistentScrollbar={true} 
   //ADDED
  >
    
             <View
                  style={{
                    flex:2,
                    flexDirection:"row",
                   marginTop:10,
                    justifyContent:'center',
                    alignItems:'center',
                  //  paddingLeft:1,
                   // paddingRight:10,
                 //  marginLeft:-50,
                  // marginRight:20,
                   //padding:10,
                  
                   
                  }}
                >
                <View style={{ height: 450,
                    backgroundColor: "transparent",
                   
                 //  marginLeft:-50,
                  // marginRight:20,
                   //padding:10,
                    width:450}}>
                  <Image
            source={{ uri:imageData.uri }}
             style={{ 
              // flex: 1, height: undefined,
            //    width: undefined,
            //    resizeMode: 'cover',
            //   marginLeft:13
            width: '100%',
            height: undefined,
            aspectRatio: 1,
            resizeMode:'contain'
             }}
          />
             </View>
                  {/* <Image
                    style={{
                      height: "100%",
                      // resizeMode: "contain", // commented on 04-FEB-2023
                      resizeMode: "contain",
                      borderRadius: 10,
                    }}
                    source={{
                      uri:imageData.uri,
                    }}
                  />
   */}
  
                </View>
               
               <View  style={{padding:5,marginLeft:20,marginRight:15,marginTop:10}}>
                <View
                style={{
                //  height: 150,
                  backgroundColor: "transparent",
               //   margin: 20,
                  flexDirection: "row",
                  gap:5
                }}
              >

                 <View
                  style={{
                    flex: 1.5,
                    flexDirection: "column",
                    justifyContent: "space-around",
                    gap:5
                    
                  }}
                >
                  <Text style={{color: currentMode === "dark" ? "white" : "black",marginLeft:-5}}> Task Progress: {taskProgress}
                  </Text>
                  <Slider 
                    value={taskProgress}
                    // onValueChange={value => setTaskProgress({value})}
                    onValueChange={setTaskProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    style={{marginLeft:-15}}
                  />

               </View>

              

                </View>
                <View
                style={{
                 
                  backgroundColor: "transparent",
             //     margin: 5,
                  flexDirection: "row",
                 // justifyContent: "space-around",
                  alignItems:'center',
                 // marginTop:-10
                // marginTop:1
              
                  
                }}
              >
                <Caption style={{ fontSize: 15, flex:1,
                color: currentMode === "dark" ? "white" : "black",
                
                }}>
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
                  <Caption style={{ fontSize: 15, color:'green',
                  color: currentMode === "dark" ? "#20d40c" : "green",
                 }}>
                     Task completed
                  </Caption>:null}
                 </View>
                 <View
                style={{
                //  height: 150,
                  backgroundColor: "transparent",
                  //margin: 5,
                  flexDirection: "row",
                 // marginTop:1
                }}
              >

                 <View
                  style={{
                    flex: 1,
                    flexDirection: "column",
                    justifyContent: "space-around",
                     marginTop:10,
                     gap:5
                  }}
                >
                  <Text style={{color: currentMode === "dark" ? "white" : "black",marginLeft:-1}} >CheckList Progress: {checklistProgress}</Text>
                  <Slider 
                    value={checklistProgress}
                    // onValueChange={value => setChecklistProgress({value})}
                    onValueChange={setChecklistProgress}
                    step={1}
                    minimumValue={0}
                    maximumValue={100}
                    // disabled={
                    //   props.navigation.state.params.formType === "CHECKLIST"
                    //     ? false
                    //     : true
                    // }
                    style={{marginLeft:-15}}
                  />
               </View>

              

                </View>
                



                <View
                style={{
                 
                  backgroundColor: "transparent",
              //    margin: 5,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  alignItems:'center',
                   marginTop:-5
                  
                  
                }}
              >
                 <Caption style={{ fontSize: 15,flex:1,
                color: currentMode === "dark" ? "white" : "black",
                
                }}>
                    Is checklist completed ?
                  </Caption>
                  <Switch
                    value={isChecklistCompleted}
                    // disabled={
                    //   props.navigation.state.params.formType === "CHECKLIST"
                    //     ? false
                    //     : true
                    // }
                    onValueChange={onToggleChecklistSwitch}
                  />
                 


                 </View>
                 <View>
                 {isChecklistCompleted? 
                  <Caption style={{ fontSize: 15,  color: currentMode === "dark" ? "#20d40c" : "green",}}>
                     CheckList completed
                  </Caption>:null}
                 </View>
                 </View>
              <View
                style={{
                  // height: 35,
                  backgroundColor: "transparent",
                //  margin: 3,
                flexDirection: "row",
                  justifyContent: "space-around",
               // marginTop:1,
               // marginTop:15,
                padding:5,marginLeft:20,marginRight:15,marginTop:10
                }}
              >
                <TouchableOpacity
                  style={{ marginLeft: 0, width:100}}
                  mode="contained"
                  onPress={() => {
                  isChecklistCompleted?selecteddata.checklistStatus="COMPLETED":selecteddata.taskStatus="PENDING"
                  isTaskCompleted?selecteddata.taskStatus="COMPLETED":selecteddata.taskStatus="PENDING"
                   selecteddata.taskProgress=taskProgress;
                     selecteddata.checklistProgress=checklistProgress;
                   submitChecklistUpdate();
                 //setUpdateModalVisible(false)
                  }}
                >
                  <Text style={{backgroundColor:'blue', color:'white',height:40, borderRadius:20, textAlign:'center', padding:10, fontWeight:'500'}}>Submit</Text> 
                </TouchableOpacity>

                <TouchableOpacity
                  style={{ marginLeft: 0,width:100 }}
                  mode="contained"
                  onPress={()=>{
                    let opsxProps = {
                        // workbenchData: props.navigation.state.params.workbenchData,
                       lastRouteName:"Camera",
                        snackBarText: "Update cancelled",
                        action: "CANCELLED",
                      };
                      setIsChecklistCompleted(false)
                      setIsTaskCompleted(false)
                      setTaskProgress(0)
              setChecklistProgress(0)
                      console.log("cancel")
                      navigate("Checklist");
                  } }
                  
                >
                 <Text style={{backgroundColor:'blue', color:'white',height:40, borderRadius:20, textAlign:'center', padding:10, fontWeight:'500'}}>Cancel</Text> 
                </TouchableOpacity>
              </View> 
              {/* <View style={{ position: "absolute",
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
       
      </View>        */}

         

      </ScrollView>
      </View>
        </>
    )
}
const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 0,
    },
    modalView: {
      height:600,
      width:600,
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
export default Newpicture;