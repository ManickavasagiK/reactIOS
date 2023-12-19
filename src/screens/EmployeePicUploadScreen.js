import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Button,
  Snackbar,
  IconButton,
  Portal,
  Modal,
} from "react-native-paper";
import { SearchBar } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { navigate } from "../navigationRef";
import { Ionicons } from "@expo/vector-icons";
import useAdminTaskResults from "../hooks/useAdminTaskResults";
import * as ImagePicker from "expo-image-picker";
import * as ImageManipulator from "expo-image-manipulator";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
const EmployeePicUploadScreen = (props) => {
  const {
    state: { token, softSignInResponse },
    signin,
    softSignIn,
    validateToken,
  } = useContext(AuthContext);
  const currentMode = getCurrentAppearanceMode();
  const [
    refreshChecklist,
    refreshChecklistResponse,
    getUserList,
    userListResponse,
    resetUserToken,
    resetUserTokenResponse,
    resetUserPass,
    resetUserPassResponse,
    updateEmployeePic,
    updateEmployeePicResponse,
    getAllEmployees,
    allEmployeesResponse,
    errorMessage,
  ] = useAdminTaskResults();

  const [employeePicture, setEmployeePicture] = useState(null);
  const [resizedEmployeePicture, setResizedEmployeePicture] = useState(null);
  const [activeEmployeeNumber, setActiveEmployeeNumber] = useState(0);
  let opsxProps = {};

  const [flatListData, setFlatListData] = useState({});
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  // Variables for searching
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  // Declarations for Modal starts

  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setSnackBarText("Picture update cancelled.");
    setModalVisible(false);
    setSnackBarVisible(true);
    setActiveEmployeeNumber(0);
  };
  const containerStyle = {
   // backgroundColor: "white",
    padding: 10,
    width: "80%",
    height: 450,
    borderRadius: 10,
  };

  // Declaration for Modal ends

  useEffect(() => {
    console.log("UE1");
    validateToken();
    getAllEmployees(token.jwt);

    //handling backpress - should be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("UE2");
    if (allEmployeesResponse.data && allEmployeesResponse.status === 200) {
      // console.log(userListResponse);
      setFlatListData(allEmployeesResponse.data);
      setSearchFunctionArrayHolder(allEmployeesResponse.data);
      // console.log(flatListData);
    }
  }, [allEmployeesResponse]);

  useEffect(() => {
    console.log("UE3");
    if (errorMessage !== "") {
      setSnackBarText("Failed : Did not upload picture");
      setSnackBarVisible(true);
    }
  }, [errorMessage]);

  useEffect(() => {
    console.log("UE4");
    // console.log(props.navigation.state);
    // console.log(props.navigation.state.params);
    if (props.navigation.state.params != undefined) {
      if (
        props.navigation.state.params.picData &&
        props.navigation.state.params.action === "COMPLETED"
      ) {
        setModalVisible(true);
        setEmployeePicture(props.navigation.state.params.picData.uri);
      }
      if (props.navigation.state.params.snackBarText) {
        setSnackBarText(props.navigation.state.params.snackBarText);
        setSnackBarVisible(true);
      }
    }
  }, [props.navigation.state.params]);

  useEffect(() => {
    console.log("UE5");
    if (employeePicture) {
      const manipResult = ImageManipulator.manipulateAsync(
        employeePicture,
        [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
        { compress: 0.7, format: "jpeg" }
      ).then((result) => {
        // console.log(result);
        setResizedEmployeePicture(result);
      });
    }
  }, [employeePicture]);

  useEffect(() => {
    console.log("UE6");
    if (updateEmployeePicResponse.picturesSavedToTable === true) {
      setModalVisible(false);
      setSnackBarText("Success ! Employee picture updated");
      setSnackBarVisible(true);
    } else if (updateEmployeePicResponse.picturesSavedToTable === false) {
      setSnackBarText("Failed ! Employee picture not updated");
      setSnackBarVisible(true);
    }
  }, [updateEmployeePicResponse]);

  // item for flatlist implementation
  const Item = ({ id, title, email, employeeNumber }) => {
    return (
      <View style={{ padding: 5, margin: 5, flexDirection: "row" }}>
        <View style={{ flex: 0.75, alignSelf: "center" }}>
        <Text
            style={{
              fontSize: 16,
              color: currentMode === "dark" ? "white" : "black",
            }} //Added by poobalan for Dark and light Mode Theme
          >{title}</Text>
        </View>
        <View style={{ flex: 0.25, flexDirection: "row" }}>
          <View style={{ flex: 0.5 }}>
            <IconButton
              icon="folder-account"
              color={currentMode === "dark" ? "white" : "black"} ////Added by poobalan for Dark and light Mode Theme
              size={20}
              onPress={() => {
                if (id !== 0) {
                  setActiveEmployeeNumber(id);
                  pickImage();
                } else {
                  noZeroEmployeeUpdate();
                }
              }}
            />
          </View>
          <View style={{ flex: 0.5 }}>
            <IconButton
              icon="camera"
              color="#a666ff"
              size={20}
              onPress={() => {
                if (id !== 0) {
                  setActiveEmployeeNumber(id);
                  opsxProps = {
                    employeeNumber: id,
                    lastRouteName: props.navigation.state.routeName,
                  };
                  navigate("Camera", opsxProps);
                } else {
                  noZeroEmployeeUpdate();
                }
              }}
            />
          </View>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Item
      id={item.employeeId}
      title={item.employeeName}
      email={item.employeeName} //Not used
      employeeNumber={item.employeeId} // Not used
    />
  );

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
          backgroundColor: "#bfbfbf",
          alignSelf: "center",
        }}
      />
    );
  };

  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
    // setEmployeePicture("");
  };

  const searchFunction = (text) => {
    // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
    const updatedData = searchFunctionArrayHolder.filter((item) => {
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

    setFlatListData(updatedData);
    setSearchValue(text);
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    // console.log(result);

    if (!result.cancelled) {
      setEmployeePicture(result.uri);
      // setResizedEmployeePicture(
      //   await ImageManipulator.manipulateAsync(
      //     result.uri,
      //     [{ resize: { width: 300 } }], // resize to width of 300 and preserve aspect ratio
      //     { compress: 0.7, format: "jpeg" }
      //   )
      // );
      setModalVisible(true); // Slows down modal trigger by a tad bit. if it bothers move theis line above resize
    } else {
      setSnackBarText("No image selected");
      setSnackBarVisible(true);
    }
  };

  const submitEmployeePicture = () => {
    var formdata = new FormData();
    try {
      // console.log("Resized pic : " + JSON.stringify(resizedEmployeePicture));
      if (activeEmployeeNumber !== 0) {
        var employeePictureDto = {
          employeeId: activeEmployeeNumber,
        };

        formdata.append(
          "EmployeePictureDto",
          JSON.stringify(employeePictureDto)
        );
        // console.log(resizedEmployeePicture.uri);
        var today = new Date();
        var pictureName = activeEmployeeNumber + ".jpg";
        // console.log(resizedEmployeePicture.uri);
        formdata.append("pictureFileList", {
          // uri: employeePicture,
          uri: resizedEmployeePicture.uri,
          type: "image/jpeg",
          name: pictureName,
          created: today,
        });

        // console.log(formdata);
        updateEmployeePic(token.jwt, formdata);
      } else {
        setModalVisible(false);
        setSnackBarText("Can't update when employee number s 0");
        setSnackBarVisible(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const noZeroEmployeeUpdate = () => {
    setSnackBarText("Can't update when employee number s 0");
    setSnackBarVisible(true);
  };

  return (
    <>
      <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}

        <TouchableOpacity
          onPress={() => navigate("Admin")}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24} color={currentMode === "dark" ? "white" : "black"} />
        </TouchableOpacity>

        <Appbar.Content title="Upload Employee Image" />
      </Appbar.Header>
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          style={{ alignItems: "center", borderColor: "#fff" }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              // justifyContent: "flex-end",
              flexDirection: "column",
            }}
          >
            <View style={{ flex: 0.85, backgroundColor: "transparent" }}>
              <Image
                style={{
                  height: "100%",
                  resizeMode: "contain",
                  borderRadius: 10,
                }}
                source={{
                  uri: employeePicture,
                }}
              />
            </View>

            <View
              style={{
                flex: 0.15,
                backgroundColor: "transparent",
                // flexDirection: "column",
              }}
            >
              <View
                style={{
                  //   flex: 0.65,
                  paddingTop: 10,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={() => {
                    submitEmployeePicture();
                  }}
                >
                  Submit
                </Button>
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={hideModal}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </View>
        </Modal>
      </Portal>
      <SearchBar
        placeholder="Type here to search"
        lightTheme
       // round
        containerStyle={{
          backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", // backgroundColor: "transparent", ADDED//Added by poobalan for Dark and light Mode Theme
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
        //  marginLeft:2,
         // marginRight:2,
          padding: 5,
        }}
        inputContainerStyle={{
          padding: 0,
          margin: 0,
        }}
        inputStyle={{ fontSize: 14 }}
        value={searchValue}
        onChangeText={(text) => searchFunction(text)}
        autoCorrect={false}
      />
      <FlatList
        data={flatListData}
        renderItem={renderItem}
        backgroundColor={currentMode === "dark" ? "#424242" : "#f2f2f2"} //ADDED //Added by poobalan for Dark and light Mode Theme
        // keyExtractor={(item) => item.employeeId}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
        ItemSeparatorComponent={FlatListItemSeparator}
      />
      <Snackbar
        visible={snackBarVisible}
        onDismiss={onDismissSnackBar}
        duration={3000}
        action={{
          label: "Ok",
          onPress: () => {
            // Do something
          },
        }}
      >
        {snackBarText}
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({});

export default EmployeePicUploadScreen;
