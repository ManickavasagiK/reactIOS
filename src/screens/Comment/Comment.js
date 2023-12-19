import React, {useState,memo} from 'react';
import { useEffect,useCallback,useRef } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,FlatList,
     TouchableHighlight,TouchableOpacity,Appearance} from 'react-native';
import { Input, SearchBar } from "react-native-elements";
import { Avatar, Button,TextInput } from "react-native-paper";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
import useChecklistDetailResults from '../../hooks/useChecklistDetailResults';
import CmtUE from './CmtUE';
import { ScrollView } from 'react-native-gesture-handler';

const Comment=memo(({
  //submitChecklistComment,getComments,
  commentsModalVisible,setCommentsModalVisible,
  token,
  workbenchData,
 
 // checklistWorkbenchCommentsList,
})=>{
  const [
    getTaskDetail,
    taskDetailGetResponse,
    addTaskDetail,
    taskDetailAddResponse,
    addCommentToTask,
    addCommentToTaskResponse,
    getCommentsByTask,
    commentsByTaskGetResponse,
    getABInfoByTypes,
    abInfoByTypeGetResponse,
    // errorMessage, // errorMessage already present above. Need to handle this better in future.
  ] = useChecklistDetailResults(); 

  const[cmtFlatlist,setCmtflatlist]=useState([])
  const [workbench, setWorkbench] = useState('');
   const[errorMsg,setErrormsg]=useState('')
  const [comments,setComments]=useState("")
  const [cmtClicked, setCmtclicked] = useState(false);
  const[cmtSend,setCmtsend]=useState("")
  const[checklistWorkbenchCommentsList,setChecklistWorkbenchCommentsList]=useState('')
  const [txtMsg,setTxtmsg]=useState("")
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

  const inputRef = useRef(null);
  const childFun=React.useRef(null)


  useEffect(() => {
    console.log("Checklist Screen -  UE6 : Received comment get response");
    if (
      commentsByTaskGetResponse.status === 200 &&
      commentsByTaskGetResponse.data
    ) {
      setChecklistWorkbenchCommentsList(commentsByTaskGetResponse.data);
     prepareCmtFlatlist(commentsByTaskGetResponse.data); 
     //setChecklistComment("")
    // not sure if this is best practice
   // setCmtflatlist(commentsByTaskGetResponse)
    //console.log(cmtFlatlist)
        console.log('received comments')
     
    }
  }, [commentsByTaskGetResponse]);
  useEffect(() => {
    console.log("Checklist Screen -  UE7 : Received comment add response");
    if (addCommentToTaskResponse.status === 200) {
    
      console.log("Getting comments list again");
      // Refresh comment list after adding one comment
      getCommentsByTask(
        token.jwt,
        workbenchData.checklistWorkbenchNumber,
        workbenchData.lineNumber
      );
    }
  }, [addCommentToTaskResponse]);
  const getComments = (token, checklistWorkbenchNumber, lineNumber) => {
    
    getCommentsByTask(token, checklistWorkbenchNumber, lineNumber);
    
};
useEffect(()=>{
  getComments(
        token.jwt,
        workbenchData.checklistWorkbenchNumber,
        workbenchData.lineNumber
      );
},[])
const prepareCmtFlatlist=useCallback((cmtlist)=>{
  setCmtflatlist(cmtlist)
  console.log("FL",cmtFlatlist)
},[])
const currentMode = getCurrentAppearanceMode();
const _renderModalItem=useCallback(({ item })=>{
   
  return(
   <TouchableHighlight
   style={[
    styles.item,
    { backgroundColor: currentMode === "dark" ? "gray" : "#fcedfc" }, //ADDED
  ]}
     activeOpacity={0.6}
     underlayColor={"#8833ff"}
     // onPress={() => {}}
   >
     <View>
       <Text style={{color: currentMode === "dark" ? "white" : "black"}} >{item.commentText}</Text>
       <View
         style={{
           height: 20,
           flexDirection: "row",
           alignItems: "center",
         }}
       >
         <View style={{ flex: 0.6 }}>
           <Text
             style={{
               fontSize: 9,
               justifyContent: "flex-start",
               alignItems: "center",
               color: currentMode === "dark" ? "white" : "black",
             }}
           >
             {item.employeeName}
           </Text>
         </View>
         <View
           style={{
             flex: 0.4,
             // backgroundColor: "yellow",
             justifyContent: "flex-start",
             alignItems: "center",
           }}
         >
           <Text style={{ fontSize: 9,  color: currentMode === "dark" ? "white" : "#6200ee", }}>
             {item.lastUpdatedDate + " - " + item.lastUpdatedTime}
           </Text>
         </View>
       </View>
     </View>
   </TouchableHighlight>

  )


},[])


  const submitChecklistComment=()=> {
   
    //Commented  useref variable for not clear existing comment when we give empty comment 
   // let commentTxt=inputRef.text;
   console.log(txtMsg)
 

  //   if (inputRef.current) {
      

  //    inputRef.current.clear();
     if (txtMsg!== "") {
       
     let checklistWorkbenchComments = {
       commentId: null, // DB auto generates id. do not sepcify one.
       checklistWorkbenchNumber:workbenchData.checklistWorkbenchNumber,
       lineNumber: workbenchData.lineNumber,
       employeeName:"",
      // employeeNumber: activeChecklistInfo.employeeNumber,
      // commentText:commentTxt,
      commentText:txtMsg,
       parentCommentId: 0,
       lastUpdatedBy: "",
       lastUpdatedDate: "",
       lastUpdatedTime: "",
       lastUpdatedApplication: "",
       lastUpdatedMachine: "",
     };
   
    //setComments("")
    
    
       addCommentToTask(token.jwt, checklistWorkbenchComments);
       setTxtmsg("")
       setErrormsg("")
      
     }
      else {
       <Text>Comment cannot be blank</Text>
    
     }
      
   }


  
    

    
return(
<>
       <Modal
      //   animationType="slide"
         transparent={true}
        visible={commentsModalVisible}
       
        onRequestClose={() => {
          //Alert.alert('Modal has been closed.');
          setCommentsModalVisible(!commentsModalVisible);
        
        }}
     
        >
         <Pressable style={styles.outsideModal}
          onPress={(event) => { if (event.target == event.currentTarget) { 
            setCommentsModalVisible(false); } }} >
        
        <View style={styles.centeredView}>
        <View
                style={[
                  styles.modalView,
                  {
                    backgroundColor:
                      currentMode === "dark" ? "#424242" : "#f2f2f2",
                  },
                ]}
              >
         
          <View
                style={{
                  height: 350,
                  backgroundColor:
                  currentMode === "dark" ? "#424242" : "#f2f2f2",
                  borderTopRightRadius: 1,
                  borderTopLeftRadius: 10,
                  width: 230,
                }}
              >
             <View
                  style={{
                    height: 50,
                    backgroundColor:
                    currentMode === "dark" ? "#1d1b1e" : "#6a00ff",
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
                
                {"Comments for " + `${workbenchData.facilityName}`}
                 
              </Text>
            </View>
            {/* {/* <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignSelf: "center",
                width: "95%",
              }}
            > */}
              
              
                <View style={{marginTop:-30,width:280,marginLeft:-25  }}>
                  <TextInput
                    label="Add Comment"
                    // style={{ height: 250 }}
                    mode="outlined"
                    maxLength={255}
                    multiline={true}
                  //  ref={inputRef}
                  // onChangeText={text => inputRef.text = text }
                    
                     onChangeText={(text) => setTxtmsg(text)}
                     value={txtMsg}
                    right={
                      
                      <TextInput.Icon
                      icon={'send'}
                      iconColor={txtMsg?"#22C55E":"#B2BEB5"}
                    //  style={styles.leftIcon as StyleProp<ViewStyle>}
                    onPress={() => {
                       txtMsg?
                            submitChecklistComment()
                           
                            
                            :setErrormsg('Enter Comment')
                           
                          //  setCmtclicked(true)
                        }}
                    />
                     
                    }
                    // 11-MAR-2022 - Added secureTextEntry and keyboardType to avoid duplicate text printed in few devices
                    secureTextEntry={Platform.OS === "ios" ? false : true}
                    keyboardType={
                      Platform.OS === "ios" ? null : "visible-password"
                    }
                  />
              
             <View >
                 {errorMsg && txtMsg ===""? <Text style={{color:'red'}}>{errorMsg}</Text>:null}
               </View>
               </View>
              
                   {/* <CmtUE token={token} workbenchData={workbenchData}
                    cmtSend={cmtSend} cmtClicked={cmtClicked} setCmtclicked={setCmtclicked} 

                   /> 
                 */}
               
                
                {cmtFlatlist && (
                     
                <FlatList
                  data={cmtFlatlist}
                  renderItem={_renderModalItem}
                  keyExtractor={(item) => item.commentId}
                  keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      paddingBottom: -20,
                      borderWidth: 0,
                      marginTop: 5,
                      marginBottom: -73,
                      marginLeft: -25,
                      marginRight: -25,
                    }}
                    
                    showsVerticalScrollIndicator={true}
                    scrollIndicatorInsets={ {right:1} }
                  />
                  
                
                
                  )} 
           
           
             </View>
             </View></View>
             
             {/* </View> */}
        
        </Pressable>
      </Modal>
     
       



                

 


                

</>
)

})
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
  
export default React.memo(Comment);