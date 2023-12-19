import React, {useState,memo, useCallback,useContext} from 'react';
import { useEffect } from 'react';
import {Alert, Modal, StyleSheet, Text,
   Pressable,RefreshControl,ActivityIndicator, 
  View,FlatList, TouchableHighlight,Appearance,
  TouchableOpacity} from 'react-native';
import { Input, SearchBar } from "react-native-elements";
import { Avatar, Button,Snackbar} from "react-native-paper";
//import { appContext } from './ChecklistScreen';
import empReassign from '../hooks/empReassign';
import { useSnackbar } from './Snackbarcomp';
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
//Added by poobalan for Dark and light Mode Theme
//import employeeSup from '../hooks/employeeSup';
const Emp=({employeeList,token,
  workbenchData,serchFilter,setSerchfilter,modalVisible,setModalVisible,
  setEmployeeAlphaName,})=>{
const { showSnackbar } = useSnackbar();



const[updateTask,
   taskUpdateResponse,
     ]=empReassign()
  
  const[search,setSearch]=useState([]);
 // const[serchFilter,setSerchfilter]=useState([])
  const[employeeId,setEmployeeId]=useState('')
  const[employeeName,setEmployeeName]=useState('')
  const[empUp,setEmpup]=useState(false)
  const [activeChecklistInfo, setActiveChecklistInfo] = useState({});
 
 // const [modalVisible, setModalVisible] = useState(false);
  
  const [hideModalCounter, setHideModalCounter] = useState(0);
  const currentMode = getCurrentAppearanceMode();
useEffect(()=>{
if(taskUpdateResponse===true){
  console.log(taskUpdateResponse)
  
  showSnackbar('true')
}
},[taskUpdateResponse])



  const searchFunction = (text) => {
    
    
    if (text) {
    const updatedData = employeeList.filter((item) => {
      var item_data = [],
         text_data = "";
    
        if (item) {
          // console.log(item);
          item_data = `${item.employeeName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.employeeName}`;
          text_data = text;
        }
   
      return item_data.indexOf(text_data) > -1;
    });
   
    setSerchfilter(updatedData)
     setSearch(text);
    }
    else{
      console.log('no data')
     
     
      setSerchfilter(employeeList)
      setSearch(text)
    
    }
  };
 console.log("employee modal")
  const _renderModalItem = ({ item }) => {
 
    return(
      <>
     
         <TouchableHighlight
           style={[
            styles.item,
            {
              backgroundColor: currentMode === "dark" ? "grey" : "#fcedfc", //ADDED
            },
          ]}//Added by poobalan for Dark and light Mode Theme
            activeOpacity={0.6}
            underlayColor={"#8833ff"}
            onPress={() => {
            setModalVisible(false)
             var eId=item.employeeId
             var eName=item.employeeName
           console.log(item.employeeId)
          //  setitemselected(item.employeeId)
          console.log(item.employeeName)
      
           workbenchData.employeeId=item.employeeId
           workbenchData.employeeAlphaName=item.employeeName
         
           setEmployeeAlphaName(workbenchData.employeeAlphaName)
          
          var formdata = new FormData();
      try {
         var checklistWorkbenchUserActionDto = {
        checklistWorkbenchNumber: workbenchData.checklistWorkbenchNumber,
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
        employeeNumber: eId,
        checklistComments: workbenchData.checklistComments,
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
       console.log(formdata);
     
      updateTask(token.jwt, formdata);
      
     
    } catch (err) {
      console.log(err);
    }
          
     
            }}
          >
         
            <Text 
            style={{
              color: currentMode === "dark" ? "#1d1b1e" : "black", //ADDED
            }}
            // style={{backgroundColor:"#e6e6ff" , 
            // borderRadius: 50,padding:2, marginTop:5}}
            
            >{item.employeeName}</Text>  
        
          </TouchableHighlight> 
        
    </>
    )
     }
  
  
 
      
 
  return (
   <>
   
      {/* <Modal
      //   animationType="slide"
         transparent={true}
        visible={modalVisible}
       
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        
        }}
     
     
      
        >
         <Pressable style={styles.outsideModal}
          onPress={(event) => { if (event.target == event.currentTarget) { 
            setModalVisible(false); } }} >
        
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
         
              
          <View
                style={{
                  height: 350,

                  borderTopRightRadius: 1,
                  borderTopLeftRadius: 1,
                  width: 230,
                }}
              >
                <View
                  style={{
                    height: 50,
                    backgroundColor: "#6a00ff",
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    bottom: 35,
                    marginLeft: -40,
                    marginRight: -35,
                  }}
                >
              <Text
                style={{
                  alignSelf: "center",
                  paddingTop: 10,
                  color: "white",
                }}
              >
                
                  My employees
                 
              </Text>
            </View>
              <SearchBar
                  placeholder="Type here to search"
                  lightTheme
                  round
                  containerStyle={{
                    backgroundColor: "white",
                    borderWidth: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    paddingVertical: 5,
                    paddingHorizontal: 0, // changing this value changes width
                    width:250
                  }}
                  inputContainerStyle={{
                    padding: 0,
                    margin: 0,
                    borderRadius: 5,
                  }}
                  inputStyle={{ fontSize: 14 }}
                  value={search.toString()}
                   onChangeText={text=>{searchFunction(text);
                  
                   }}
                 // onChangeText={(text)=>setSearch(text)}
                 
                  autoCorrect={false}
                />  
              
    
 {serchFilter && (
 
      <FlatList
        data={serchFilter}
        renderItem={_renderModalItem}
        keyExtractor={(item) => item.employeeId}
        keyboardShouldPersistTaps="always"
         keyboardDismissMode="on-drag"
         showsVerticalScrollIndicator={false}
        
      />
      
    )} 
    
          </View>
        </View>
        </View>
        
        
        </Pressable>
      </Modal> */}
       <Modal
        //   animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable
          style={styles.outsideModal}
          onPress={(event) => {
            if (event.target == event.currentTarget) {
              setModalVisible(false);
            }
          }}
        >
          <View style={styles.centeredView}>
          {/* <View
              style={[
                styles.modalView,
                {
                  backgroundColor:
                    currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED MODAL FULL COLOR//Added by poobalan for Dark and light Mode Theme
                }, //"#6a00ff", ADDED
              ]}
            > */}
            <View style={[styles.modalView,
            {
              backgroundColor:
                currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED MODAL FULL COLOR//Added by poobalan for Dark and light Mode Theme
            }, //"#6a00ff", ADDED
            
           ]}>
              <View
                style={{
                  height: 350,

                  borderTopRightRadius: 1,
                  borderTopLeftRadius: 10,
                  width: 230,
                }}
              >
                <View
                  style={{
                    height: 50,
                    backgroundColor:
                    currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff", ADDED//Added by poobalan for Dark and light Mode Theme
                    borderTopRightRadius: 10,
                    borderTopLeftRadius: 10,
                    bottom: 35,
                    marginLeft: -35,
                    marginRight: -35,
                  }}
                >
                  <Text
                    style={{
                      alignSelf: "center",
                      paddingTop: 15,
                      color: "white",
                    }}
                  >
                    My employees
                  </Text>
                </View>
                <SearchBar
                  placeholder="Type here to search"
                  lightTheme
                  round
                  containerStyle={{
                    backgroundColor: "white",
                    borderWidth: 0,
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    paddingVertical: 0,
                    paddingHorizontal: 0, // changing this value changes width
                  }}
                  inputContainerStyle={{
                    padding: 0,
                    marginTop: -25,
                    marginLeft: -25,
                    marginRight: -25,
                    borderRadius: 5,
                  }}
                  inputStyle={{ fontSize: 14 }}
                  value={search.toString()}
                  onChangeText={(text) => {
                    searchFunction(text);
                  }}
                  // onChangeText={(text)=>setSearch(text)}

                  autoCorrect={false}
                />

                {serchFilter && (
                  <FlatList
                    data={serchFilter}
                    renderItem={_renderModalItem}
                    keyExtractor={(item) => item.employeeId}
                    keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={true}
                    scrollIndicatorInsets={ {right:1} }
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      paddingBottom: -20,
                      borderWidth: 0,
                      marginTop: 5,
                      marginBottom: -60,
                      marginLeft: -25,
                      marginRight: -25,
                    }}
                  />
                )}
              </View>
            </View>
          </View>
          {/* </View> */}
        </Pressable>
      </Modal>
      {/* <View
                style={{ flex: 0.16, alignItems: "flex-end", marginBottom: 3 }}
              >
     
       </View>
             <TouchableOpacity
                  onPress={() => {
                    setModalVisible(!modalVisible);
                     setSerchfilter(employeeList)
                  }}
         
                >
                
                    <Avatar.Icon icon="account" size={25}  />  
                </TouchableOpacity>  */}
                

                </>
   
  );
                }
                const styles = StyleSheet.create({
                  centeredView: {
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 22,
                  },
                  item: {
                    padding: 12,
                    borderColor: "none",
                    marginTop: 5,
                    borderRadius: 5,
                    backgroundColor: "#fcedfc",
                  },
                  modalView: {
                    height: 470,
                    width: 300,
                    margin: 20,
                   
                    backgroundColor: "white",
                    borderRadius: 10,
                    padding: 35,
                    alignItems: "center",
                    shadowColor: "#000",
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
                    //backgroundColor: "#F194FF",
                  },
                  buttonClose: {
                    backgroundColor: "#2196F3",
                  },
                  textStyle: {
                    color: "white",
                    fontWeight: "bold",
                    textAlign: "center",
                  },
                  modalText: {
                    marginBottom: 15,
                    textAlign: "center",
                  },
                  outsideModal: {
                    backgroundColor: "rgba(1, 1, 1, 0.2)",
                    flex: 1,
                  },
                });
export default memo(Emp);
