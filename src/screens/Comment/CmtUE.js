import React, {useState,memo,useImperativeHandle} from 'react';
import { useEffect,useCallback,useRef } from 'react';
import {Alert, Modal, StyleSheet, Text, Pressable, View,FlatList,
     TouchableHighlight,TouchableOpacity} from 'react-native';
import { Input, SearchBar } from "react-native-elements";
import { Avatar, Button,TextInput } from "react-native-paper";
import useChecklistDetailResults from '..//../hooks/useChecklistDetailResults'


const CmtUE = ({token,workbenchData,cmtSend,cmtClicked,setCmtclicked}) => {
 
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
      const [commentsModalVisible,setCommentsModalVisible]=useState(false)
      const [message, setMessage] = useState("");
      const[testmsg,setTestmsg]=useState("")
     const[checklistWorkbenchCommentsList,setChecklistWorkbenchCommentsList]=useState('')
     const[checklistComment,setChecklistComment]=useState('')
      useEffect(() => {
        console.log("Checklist Screen -  UE6 : Received comment get response");
        if (
          commentsByTaskGetResponse.status === 200 &&
          commentsByTaskGetResponse.data
        ) {
          setChecklistWorkbenchCommentsList(commentsByTaskGetResponse.data);
         prepareCmtFlatlist(commentsByTaskGetResponse.data); // not sure if this is best practice
            console.log('received comments')
          
        
          // stop activity monitor that was made visible from comments modal
        //  setActivityIndicatorAnimating(false);
       //   setActivityIndicatorModalVisible(false);
        }
      }, [commentsByTaskGetResponse]);
      useEffect(() => {
        console.log("Checklist Screen -  UE7 : Received comment add response");
        if (addCommentToTaskResponse.status === 200) {
        //  setChecklistComment(""); // clear comment text after adding one.
        //  setSnackBarText("Success! Comment added.");
        //  setSnackBarMode("SUCCESS");
       //   setSnackBarVisible(true);
          console.log("Getting comments list again");
          // Refresh comment list after adding one comment
          getCommentsByTask(
            token.jwt,
            workbenchData.checklistWorkbenchNumber,
            workbenchData.lineNumber
          );
        }
      }, [addCommentToTaskResponse]);

 useEffect(()=>{
    getComments(
          token.jwt,
          workbenchData.checklistWorkbenchNumber,
          workbenchData.lineNumber
        );
 },[])
  
useEffect(()=>{
    if(cmtClicked===true){
        console.log('Comment updated fl')
        addCommentToTask(token.jwt, cmtSend);
        setCmtclicked(false)
    }
}) 


const prepareCmtFlatlist=useCallback((cmtlist)=>{
        setCmtflatlist(cmtlist)
},[])
    
const getComments = (token, checklistWorkbenchNumber, lineNumber) => {
    
      getCommentsByTask(token, checklistWorkbenchNumber, lineNumber);
      
};


   
   
   const _renderModalItem=useCallback(({ item })=>{
   
     return(
      <TouchableHighlight
        style={styles.item}
        activeOpacity={0.6}
        underlayColor={"#8833ff"}
        // onPress={() => {}}
      >
        <View>
          <Text>{item.commentText}</Text>
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
                  color: "#6200ee",
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
              <Text style={{ fontSize: 9, color: "#6200ee" }}>
                {item.lastUpdatedDate + " - " + item.lastUpdatedTime}
              </Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
   
     )
   
   
   },[])
       
   
           
  return (
    <>
         {cmtFlatlist && (
                     
                <FlatList
                  data={cmtFlatlist}
                  renderItem={_renderModalItem}
                  keyExtractor={(item) => item.commentId}
                  keyboardShouldPersistTaps="always"
                    keyboardDismissMode="on-drag"
                    showsVerticalScrollIndicator={false}
                  
                />
                
                  )} 
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
      height:400,
      width:280,
      margin: 10,
      
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 2,
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
  
export default CmtUE