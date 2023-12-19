import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Modal,
  Pressable,
  ScrollView,
  Image,
  Appearance,
} from "react-native";
import { Appbar, Button,Switch,Caption} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useNavigation } from '@react-navigation/native';

import Slider from '@react-native-community/slider';
import Newpicture from "./Newpicture";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
const CameraScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [cameraRef, setCameraRef] = useState(null);
  const [image, setImage] = useState(false);
  const [resizedImage, setResizedImage] = useState(null);
   const [updateModalVisible,setUpdateModalVisible]=useState(false)
   const [selecteddata,setSelecteddata]=useState([])
   const [imageData,setImagedata]=useState({})
   const [lastProps,setLastprops]=useState('')
 

  useEffect(() => {
   // validateToken();
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
    //handling backpress - should be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );
    console.log("camera",props.navigation.state.params.lastRouteName)
   setLastprops(props.navigation.state.params.lastRouteName)
     

    return () => {
      backHandler.remove();
    };
  }, []);

  if (hasPermission === null) {
    console.log("null permission");
    return <View />;
  }
  if (hasPermission === false) {
    console.log("No access to camera");
    let opsxProps = {
      lastRouteName: props.navigation.state.routeName,
      snackBarText: "Allow camera access from settings !",
      action: "CANCELLED",
    };
    navigate(props.navigation.state.params.lastRouteName, opsxProps);
    // return <Text>No access to camera</Text>;
  }
  //Added by poobalan for Dark and light Mode Theme
  const currentMode = getCurrentAppearanceMode();
//console.log("camera screen")
  return (
    <>
      <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}

        <TouchableOpacity
          onPress={() => {
            let opsxProps = {
              // workbenchData: props.navigation.state.params.workbenchData,
              lastRouteName: props.navigation.state.routeName,
              snackBarText: "Update cancelled",
              action: "CANCELLED",
            };
            navigate(props.navigation.state.params.lastRouteName, opsxProps);
          }}
          style={{ paddingLeft: 10 }}
        >

          <Ionicons name="ios-arrow-back" size={24} 
          //Added by poobalan for Dark and light Mode Theme
          color={currentMode === "dark" ? "white" : "black"}/> 
        </TouchableOpacity>
    {image?(<Appbar.Content title=" Picture Update " />):(<Appbar.Content title="Camera" />)}
        
      </Appbar.Header>
     
    
    

       {image ?(
        <Newpicture 
        
         lastProps={lastProps}
        imageData={imageData}
        selecteddata={selecteddata}
        
        />
       ):
       <Camera
       style={{ flex: 1 }}
       ratio="16:9"
       pictureSize="1280x720"
       // ratio="4:3"
       // pictureSize="640x480"
       flashMode={Camera.Constants.FlashMode.off}
       type={type}
       ref={(ref) => {
         setCameraRef(ref);
       }}
     >
       <View
         style={{
           flex: 1,
           backgroundColor: "transparent",
           justifyContent: "flex-end",
         }}
       >
         <View
           style={{
             backgroundColor: "transparent",
             flexDirection: "row",
             alignItems: "center",
             justifyContent: "space-between",
           }}
         >
           <Button
             icon="close"
             style={{ marginLeft: 12 }}
             mode="text"
             color="white"
             onPress={() => {
               // setModalVisible(false);
               let opsxProps = {
                 // workbenchData: props.navigation.state.params.workbenchData,
                 lastRouteName: props.navigation.state.routeName,
                 snackBarText: "Update cancelled",
                 action: "CANCELLED",
               };
               navigate(
                 props.navigation.state.params.lastRouteName,
                 opsxProps
               );
             }}
           >
             Close
           </Button>
           <TouchableOpacity
             onPress={async () => {
               if (cameraRef) {
                 let photo = await cameraRef.takePictureAsync();
                 //   setImage({ photo });

               //  let availableSizes =
                 //  await cameraRef.getAvailablePictureSizesAsync("16:9");
                 //   console.log("Image : " + JSON.stringify(photo));
                 //  console.log("Available sizes : " + availableSizes);

                 //   setModalVisible(false);
                // console.log(props.navigation.state.params.lastRouteName);
                 let opsxProps = {};
                 let tempVar = null;

                 if (
                   props.navigation.state.params.lastRouteName === "TASK" ||
                   props.navigation.state.params.lastRouteName === "Checklist"
                 ) {
                   if (photo) {
                     const manipResult = ImageManipulator.manipulateAsync(
                       photo.uri,
                       [{ resize: { width: 480 } }], // resize to width of 480 and preserve aspect ratio
                       { compress: 0.7, format: "jpeg" }
                     ).then((result) => {
                       // console.log(result);
                      
                       tempVar = result;
                       opsxProps = {
                         workbenchData:
                           props.navigation.state.params.workbenchData,
                         picData: tempVar,
                        lastRouteName: props.navigation.state.routeName,
                         action: "COMPLETED",
                       };
                       console.log(
                         "opsxProps : " + JSON.stringify(opsxProps.picData)
                       );
                       setResizedImage(result);
                       // console.log(tempVar);
                       // Not the best way but picture is not transferred to opsxApi when assignment happens outside of this block
                     
                     
                     
                       // navigate(
                       //   props.navigation.state.params.lastRouteName,
                       //   opsxProps
                       // );

                       // Changing code for After Taken picture It navigate newpicture screen
                       setImagedata(tempVar)
                       console.log('picture image',imageData)
                        setSelecteddata(props.navigation.state.params.workbenchData)            
                      setImage(true)
                    
                      });
                   }

                   // opsxProps = {
                   //   workbenchData:
                   //     props.navigation.state.params.workbenchData,
                   //   picData: tempVar,
                   //   lastRouteName: props.navigation.state.routeName,
                   //   action: "COMPLETED",
                   // };
                 }
                  else if (
                   props.navigation.state.params.lastRouteName ===
                   "EmployeePicUpload"
                 ) {
                   opsxProps = {
                     picData: photo,
                     lastRouteName: props.navigation.state.routeName,
                     employeeNumber:
                       props.navigation.state.params.employeeNumber,
                     action: "COMPLETED",
                   };
                 }
             
                 // navigate(
                 //   props.navigation.state.params.lastRouteName,
                 //   opsxProps
                 // );

            
           
                 
                
              
               }
             }}
           >
             <View
               style={{
                 borderWidth: 2,
                 borderRadius: 50,
                 borderColor: "white",
                 height: 50,
                 width: 50,
                 display: "flex",
                 justifyContent: "center",
                 alignItems: "center",
                 marginBottom: 16,
                 marginTop: 16,
               }}
             >
               <View
                 style={{
                   borderWidth: 2,
                   borderRadius: 50,
                   borderColor: "white",
                   height: 40,
                   width: 40,
                   backgroundColor: "white",
                 }}
               ></View>
             </View>
           </TouchableOpacity>
           <Button
             icon="axis-z-rotate-clockwise"
             style={{ marginRight: 12 }}
             mode="text"
             color="white"
             onPress={() => {
               setType(
                 type === Camera.Constants.Type.back
                   ? Camera.Constants.Type.front
                   : Camera.Constants.Type.back
               );
             }}
           >
             {type === Camera.Constants.Type.back ? "Front" : "Back "}
           </Button>
         </View>
       </View>
     </Camera>
       
       }


    </>
  );
};

//const styles = StyleSheet.create({});
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
    backgroundColor: "hsl(0, 100%, 90%)",
    flex: 1,
  }
})
export default CameraScreen;
