import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  ScrollView,
  View,
  Text,
  Platform,
  PermissionsAndroid,
  Image,
  Appearance
} from "react-native";
import { Appbar, Button, Modal, Portal } from "react-native-paper";

import { navigate } from "../navigationRef";
import useTaskResults from "../hooks/useTaskResults";
import useChecklistHistoryResults from "../hooks/useChecklistHistoryResults";
import { Ionicons } from "@expo/vector-icons";
import { SliderBox } from "react-native-image-slider-box";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
const PictureScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  // The number of props and the order of props should not change even though if a prop is not utilized here
  // Consider this a rule for other context as well
  const [
    getTasksBySupervisor,
    taskList,
    getPicturesByTask,
    pictureList,
    updateTask,
    taskUpdateResponse,
    getChecklistBySupervisor,
    checklistList,
    //errorMessage,
  ] = useTaskResults();

  const [
    getChecklistHistoryRecord,
    checklistHistoryResult,
    getChecklistHistoryDetail,
    checklistHistoryDetailResult,
    getChecklistHistoryPicture,
    checklistHistoryPictureResult,
    getChecklistHistoryComments,
    checklistHistoryCommentsResult,
    checkHistoryErrorMessage,
  ] = useChecklistHistoryResults();

  //download modal
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 20,
    width: "75%",
    borderRadius: 10,
    height: 150,
  };
  const hideModal = () => {
    setDownloadModalVisible(false);
  };

  //download pic to local storage
  // const dirs = RNFetchBlob.fs.dirs;

  const [pictureArray, setPictureArray] = useState([]);
  const [pictureArrayWithoutInfo, setPictureArrayWithoutInfo] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  var pictArray = [];
  let opsxProps = {};
  const [activePictureIndex, setActivePictureIndex] = useState("");
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(null);

  useEffect(() => {
    // console.log(props.navigation.state.params[0].checklistWorkbenchNumber);
    // console.log(props.navigation.state.params[0].lineNumber);
    // console.log(props.navigation.state.params);

    // props.navigation.state.params.pictureMetaDataDtoList[0]
    //   .checklistWorkbenchNumber &&
    // props.navigation.state.params.pictureMetaDataDtoList[0].lineNumber
    //   ? getPicturesByTask(
    //       token.jwt,
    //       props.navigation.state.params.pictureMetaDataDtoList[0]
    //         .checklistWorkbenchNumber,
    //       props.navigation.state.params.pictureMetaDataDtoList[0].lineNumber
    //     )
    //   : null;

    if (
      props.navigation.state.params.pictureMetaDataDtoList.length > 0 &&
      props.navigation.state.params.pictureMetaDataDtoList[0]
        .checklistWorkbenchNumber &&
      props.navigation.state.params.pictureMetaDataDtoList[0].lineNumber
    ) {
     
      if (props.navigation.state.params.sourceOfData === "CURRENT") {
       
        getPicturesByTask(
          token.jwt,
          props.navigation.state.params.pictureMetaDataDtoList[0]
            .checklistWorkbenchNumber,
          props.navigation.state.params.pictureMetaDataDtoList[0].lineNumber
        );
      } else if (props.navigation.state.params.sourceOfData === "HISTORY") {
        getChecklistHistoryPicture(
          token.jwt,
          props.navigation.state.params.pictureMetaDataDtoList[0]
            .checklistWorkbenchNumber,
          props.navigation.state.params.pictureMetaDataDtoList[0].lineNumber
        );
      }
    }

    // code commented below as we are using expo media library instead of for rn-fetch-blob and react-native-fs
    // // Handle local storage read write permissions - for rn-fetch-blob and react-native-fs

    // console.log("Platform : " + Platform.OS);
    // try {
    //   if (Platform.OS === "android") {
    //     console.log("inside if");
    //     (async () => {
    //       const status = await PermissionsAndroid.requestMultiple(
    //         [
    //           PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    //           PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
    //         ],
    //         {
    //           title: "OpsX read / write permission",
    //           message:
    //             "OpsX needs permission to read or write" +
    //             "pictures to local storage.",
    //           buttonNeutral: "Ask Me Later",
    //           buttonNegative: "Cancel",
    //           buttonPositive: "OK",
    //         }
    //       );

    //       if (
    //         status["android.permission.WRITE_EXTERNAL_STORAGE"] ===
    //           PermissionsAndroid.RESULTS.GRANTED &&
    //         status["android.permission.READ_EXTERNAL_STORAGE"] ===
    //           PermissionsAndroid.RESULTS.GRANTED
    //       ) {
    //         console.log("Permission granted to use local storage");
    //       } else {
    //         console.log(
    //           "Permission not granted to use local storage" +
    //             JSON.stringify(status)
    //         );
    //         //if permission not granted, go back to old page
    //         opsxProps = {
    //           lastRouteName: props.navigation.state.routeName,
    //           snackBarText: "No permission to access local storage",
    //         };
    //         navigate(props.navigation.state.params.lastRouteName, opsxProps);
    //       }
    //     })();
    //   }
    // } catch (err) {
    //   console.log("Android permission error : " + err);
    //   opsxProps = {
    //     lastRouteName: props.navigation.state.routeName,
    //     snackBarText: "Error in local storage permission",
    //   };
    //   navigate(props.navigation.state.params.lastRouteName, opsxProps);
    // }

    // setIsLoading(false);
    //handling backpress - SHOULD be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  // //useEffect for expo-media-library access - TODO : this code does not work
  // useEffect(() => {
  //   validateToken();
  //   (async () => {
  //     const { status } = await MediaLibrary.requestPermissionsAsync();
  //     // const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  //     // setHasMediaLibraryPermission(status === "granted");
  //     if (status === "granted") {
  //       setHasMediaLibraryPermission(true);
  //     }
  //   })();
  //   console.log("hasPermission : " + hasMediaLibraryPermission);
  // }, []);

  useEffect(() => {
  //  console.log("picture",pictureList.checklistPictureList);
    if (
      pictureList.checklistPictureList != undefined ||
      checklistHistoryPictureResult.data != undefined
    ) {
      if (props.navigation.state.params.sourceOfData === "CURRENT") {
        pictArray = pictureList.checklistPictureList;
        // console.log("picture",pictureList.checklistPictureList);
      } else if (props.navigation.state.params.sourceOfData === "HISTORY") {
        console.log(
          checklistHistoryPictureResult.data.checklistPictureList.length
        );
        pictArray = checklistHistoryPictureResult.data.checklistPictureList;
        console.log(pictArray.length);
      }
    }

    // console.log(
    //   "checklist pictures list length : " +
    //     pictureList.checklistPictureList.length
    // );
    if (pictArray) {
      var tempPictureArray = pictArray.map((res) => ({
        title: res.pictureName,
        caption: res.lastUpdatedDate + " " + res.lastUpdatedTime,
        url: "data:" + res.pictureType + ";base64," + res.pictureByteArray + "",
        lastUpdatedBy: res.lastUpdatedBy,
        pictureType: res.pictureType,
        pictureId: res.pictureId,
        checklistWorkbenchNumber: res.checklistWorkbenchNumber,
        lineNumber: res.lineNumber,
      }));

      // console.log(pictArray);
      // console.log(tempPictureArray);

      setPictureArray(tempPictureArray);

      setIsLoading(false);
    }

    console.log("Picture Array length outside IF : " + pictureArray.length);

    if (tempPictureArray) {
      console.log("Picture Array length : " + pictureArray.length);
      setPictureArrayWithoutInfo(tempPictureArray.map(({ url }) => url));
      console.log(
        "Size of pictureArrayWithoutInfo : " + pictureArrayWithoutInfo.length
      );
    }

    //########

    console.log(isLoading);
  }, [pictureList, checklistHistoryPictureResult]);

  useEffect(() => {
    isLoading != true ? console.log("3rd useEffect " + pictArray.length) : null;
  }, [isLoading]);

  useEffect(() => {
    console.log(
      "picture array without info size from UE : " +
        pictureArrayWithoutInfo.length
    );
  }, [pictureArrayWithoutInfo]);

  // // consitions to check media permissions inside useEffect - TODO : this code does not work

  // useEffect(() => {
  //   if (hasMediaLibraryPermission === null) {
  //     console.log("null permission");
  //     return <View />;
  //   }
  //   if (hasMediaLibraryPermission === false) {
  //     console.log("No access to camera");
  //     let opsxProps = {
  //       lastRouteName: props.navigation.state.routeName,
  //       snackBarText: "Allow media library access from settings !",
  //       action: "CANCELLED",
  //     };
  //     navigate(props.navigation.state.params.lastRouteName, opsxProps);
  //     // return <Text>No access to camera</Text>;
  //   }
  // }, [hasMediaLibraryPermission]);

  const downloadPictureToLocalStorage = async (index) => {
    try {
      console.log(pictureArray[index].title);
      const base64Code = pictureArray[index].url.split(
        "data:image/jpeg;base64,"
      )[1];
      // console.log(base64Code);
      const fileName = FileSystem.documentDirectory + pictureArray[index].title;
      console.log(fileName);
      await FileSystem.writeAsStringAsync(fileName, base64Code, {
        encoding: FileSystem.EncodingType.Base64,
      });

      let temp = await FileSystem.getInfoAsync(fileName);
      console.log("File info : " + temp);
      // const asset = await MediaLibrary.saveToLibraryAsync(fileName);
      const asset = await MediaLibrary.createAssetAsync(fileName);
      const album = await MediaLibrary.getAlbumAsync("Download");
      if (album == null) {
        await MediaLibrary.createAlbumAsync("Download", asset, false);
      } else {
        await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
      }

      console.log(asset);
    } catch (err) {
      console.log(err);
    }
  };
  const currentMode = getCurrentAppearanceMode();

  return (
    <>
      <Appbar.Header>
        <TouchableOpacity
          onPress={() => {
            // console.log(props.navigation.state.params);
            console.log(
              "Navigating to : " + props.navigation.state.params.lastRouteName
            );
            opsxProps = {
              lastRouteName: props.navigation.state.routeName,
            };
            // At present opsxProps is not sent as params as this slows down page load when we click back button.
            navigate(props.navigation.state.params.lastRouteName);
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24}  color={currentMode === "dark" ? "white" : "black"} />
        </TouchableOpacity>

        <Appbar.Content title="Attachments" />
      </Appbar.Header>
      {/* <Button
        onPress={() => {
          console.log(pictureArray);
        }}
      >
        Test
      </Button> */}
      <Portal>
        <Modal
          visible={downloadModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          style={{ alignItems: "center", borderColor: "#fff" }}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
            }}
          >
            <Text>Do you want to download this image to local storage ?</Text>
          </View>
          <View
            style={{
              // flex: 0.4,
              flexDirection: "row",
              justifyContent: "space-around",
              paddingBottom: 0,
            }}
          >
            <Button
              style={{ marginLeft: 0, width: 100 }}
              mode="contained"
              onPress={() => {
                // console.log(pictureArray[activePictureIndex].title);
                downloadPictureToLocalStorage(activePictureIndex);
              }}
            >
              Yes
            </Button>
            <Button
              style={{ marginLeft: 0, width: 100 }}
              mode="contained"
              onPress={hideModal}
            >
              No
            </Button>
          </View>
        </Modal>
      </Portal>
      <View
          style={{
            backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",flex:1}}> 
      <ScrollView>
     
        <SliderBox
          images={pictureArrayWithoutInfo}
          sliderBoxHeight={600}
          // onCurrentImagePressed={
          //   (((index) => console.warn(`image ${index} pressed`),
          //   console.log("Inside sliderbox : " + pictureArrayWithoutInfo.length)),
          //   console.log("PictureArray inside sliderBox: " + pictureArray.length))
          // }
          onCurrentImagePressed={(index) => {
            // console.warn(`image ${index} pressed`);
            // setDownloadModalVisible(true);
            setActivePictureIndex(index);
            console.log("Inside sliderbox : " + pictureArrayWithoutInfo.length);
            console.log(
              "PictureArray inside sliderBox: " +
                JSON.stringify(pictureArray[index].title)
            );
          }}
          dotColor="#FFEE58"
          inactiveDotColor="#90A4AE"
          paginationBoxVerticalPadding={20}
          autoPlay={false}
          resizeMethod={"resize"}
          resizeMode={"cover"}
          imageLoader={"ActivityIndicator"}
          paginationBoxStyle={{
            position: "absolute",
            bottom: 0,
            padding: 0,
            alignItems: "center",
            alignSelf: "center",
            justifyContent: "center",
            paddingVertical: 10,
          }}
          dotStyle={{
            width: 15,
            height: 15,
            borderRadius: 5,
            marginHorizontal: 0,
            padding: 0,
            margin: 0,
            backgroundColor: "rgba(128, 128, 128, 0.92)",
          }}
          ImageComponentStyle={{ borderRadius: 10, width: "97%", marginTop: 5 }}
          imageLoadingColor="#2196F3"
        />
       
      </ScrollView>
       </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default PictureScreen;
