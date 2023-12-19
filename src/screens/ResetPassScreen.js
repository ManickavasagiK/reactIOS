import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Portal,
  Modal,
  Button,
  Snackbar,
  TextInput,
} from "react-native-paper";
import { SearchBar } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { navigate } from "../navigationRef";
import { Ionicons } from "@expo/vector-icons";
import useAdminTaskResults from "../hooks/useAdminTaskResults";
const getCurrentAppearanceMode = () => Appearance.getColorScheme(); //ADDED
const ResetPassScreen = (props) => {
  const {
    state: { token, softSignInResponse },
    signin,
    softSignIn,
    validateToken,
  } = useContext(AuthContext);
  const currentMode = getCurrentAppearanceMode(); //ADDED
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
  const [errMsg,setErrmsg]=useState("")
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [flatListData, setFlatListData] = useState({});
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reTypedNewPassword, setReTypedNewPassword] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  // Variables for searching
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  // Variables for modal
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [activeUserName, setActiveUserName] = useState("");

  useEffect(() => {
    console.log("UE1");
    validateToken();
    getUserList(token.jwt);

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
    if (userListResponse.data && userListResponse.status === 200) {
      setFlatListData(userListResponse.data);
      setSearchFunctionArrayHolder(userListResponse.data);
    }
  }, [userListResponse]);

  useEffect(() => {
    console.log("UE3");
    if (resetUserPassResponse.data && resetUserPassResponse.status === 200) {
      console.log("Password reset done");

      // console.log(resetUserTokenResponse);
      setSnackBarText("Success : Password reset completed");
      setSnackBarVisible(true);
    }
  }, [resetUserPassResponse]);

  useEffect(() => {
    console.log("UE4");
    if (errorMessage !== "") {
      setSnackBarText("Failed : " + errorMessage);
      setSnackBarVisible(true);
    }
  }, [errorMessage]);

  // item for flatlist implementation
  const Item = ({ id, title, email }) => {
    return (
      <View style={{ padding: 5, margin: 5, flexDirection: "row" }}>
        <View style={{ flex: 0.7, alignSelf: "center" }}>
        <Text
            style={{
              fontSize: 16,
              color: currentMode === "dark" ? "white" : "black", //ADDED
            }}
          >{title}</Text>
        </View>
        <View style={{ flex: 0.3 }}>
          <Button
            mode="contained"
            onPress={() => {
              // Open modal to get new password
              setActiveUserName(email);
              setAuthModalVisible(true);
            }}
          >
            Reset
          </Button>
        </View>
      </View>
    );
  };

  const renderItem = ({ item }) => (
    <Item id={item.userId} title={item.fullName} email={item.userName} />
  );

  const FlatListItemSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "95%",
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#c499ff", // backgroundColor: "#c499ff", ADDED
          alignSelf: "center",
        }}
      />
    );
  };

  const _resetUserPassword = (email) => {
    resetUserPass(token.jwt, email, newPassword);
    hideModal();
  };

  const passwordsDoNotMatch = () => {
    console.log("Passwords do not match");
    setSnackBarText("Passwords do not match... Try again !");
    setSnackBarVisible(true);
  };

  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };

  const searchFunction = (text) => {
    // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
    const updatedData = searchFunctionArrayHolder.filter((item) => {
      var item_data = [],
        text_data = "";
      if (item) {
        console.log(item);
        item_data = `${item.fullName.toUpperCase()})`;
        text_data = text.toUpperCase();
      } else {
        item_data = `${item.fullName}`;
        text_data = text;
      }

      return item_data.indexOf(text_data) > -1;
    });

    setFlatListData(updatedData);
    setSearchValue(text);
  };

  const containerStyle = {
  // backgroundColor: "white",
  //  padding: 10,
  backgroundColor: currentMode === "dark" ? "#424242" : "white ", // backgroundColor: "#c499ff", ADDED
    width: "80%",
    height: 320,
    borderRadius: 10,
  };

  const hideModal = () => {
    setAuthModalVisible(false);
    setActiveUserName("");
    setNewPassword("");
    setReTypedNewPassword("");
  };

  const resetPasswordCancelled = () => {
    hideModal();
    setSnackBarText("Reset password cancelled...");
    setNewPassword("");
    setReTypedNewPassword("");
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
          <Ionicons name="ios-arrow-back"
           size={24} color={currentMode === "dark" ? "white" : "black"} //color="white"  ADDED
           />
        </TouchableOpacity>

        <Appbar.Content title="Reset password" />
      </Appbar.Header>

      <Portal>
        <Modal
          visible={authModalVisible}
          onDismiss={hideModal}
          contentContainerStyle={containerStyle}
          style={{ alignItems: "center", borderColor: "#fff", }}
        >
           <View
              style={{
                height: 40,
                backgroundColor:
                currentMode === "dark" ? "#1d1b1e" : "#6a00ff",// backgroundColor: "#c499ff", ADDED
               alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                justifyContent:'center'
                //padding: 10,
             //  marginTop:-10,
               // width:289,
             //   marginLeft:-10

              }}
            >
              <Text style={{ color: currentMode === "dark" ? "white" : "black", fontSize: 15 }}>
                Reset Password
              </Text>
            </View>
          {/* <View style={{ flex: 0.05, backgroundColor: "#6200ee" }}></View> */}
          <View
            style={{
              flex: 1,
              backgroundColor: "transparent",
              justifyContent: "flex-start",
              flexDirection: "column",
             // paddingVertical:20,
              paddingHorizontal: 10,
              paddingTop:10
            }}
          >
            <TextInput
              mode="outlined"
              placeholder="User name"
              label="User name"
              editable={false}
              value={activeUserName}
              style={{
                // paddingVertical: 5 
                paddingTop:1
                }}
            />
            <TextInput
              mode="outlined"
              placeholder="New password"
              label="New password"
              value={newPassword}
              secureTextEntry={isPasswordSecure}
             
              placeholderTextColor="#003f5c"
              autoCapitalize="none"
             
              onChangeText={(text) => {
                setErrmsg("")
                setNewPassword(text);
              }}
              right={
                <TextInput.Icon
                  icon={isPasswordSecure ? "eye" : "eye-off"}
                  iconColor="black"
               //  color={"#a300ee"}
                  onPressIn={() => {
                    isPasswordSecure
                      ? setIsPasswordSecure(false)
                      : setIsPasswordSecure(true);
                  }}
                />
              }
             style={{
              marginTop:5
              //paddingVertical: 5, width: "100%",
             }}
            />
            
            <TextInput
              mode="outlined"
              placeholder="Re-type new password"
              label="Re-type new password"
              value={reTypedNewPassword}
              secureTextEntry={isPasswordSecure}
              onChangeText={(text) => {
                setErrmsg("")
                setReTypedNewPassword(text);
              }}
             
             
             style={{
              // paddingVertical: 5 
              marginTop:5
              }}
            />
                <Text style={{color:'red',marginTop:5}}>
                     {errMsg}
                  </Text>
          </View>
          
          <View
            style={{
              // flex: 0.4,
              flexDirection: "row",
              justifyContent: "space-around",
           
              paddingBottom: 15,
            }}
          >
            <Button
              style={{ marginLeft: 0 }}
              mode="contained"
              disabled={submitButtonDisabled}
              onPress={() => { newPassword&&reTypedNewPassword
                 
                ?
               ( newPassword === reTypedNewPassword
                  ? _resetUserPassword(activeUserName)
                  : passwordsDoNotMatch())
                  :setErrmsg("Enter Password")
              
              }}
            >
              Submit
            </Button>
            <Button
              style={{ marginLeft: 0 }}
              mode="contained"
              onPress={resetPasswordCancelled}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    <View style={{}}>
      <SearchBar
        placeholder="Type here to search"
        lightTheme
       // round
        containerStyle={{
          backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //backgroundColor: "transparent", ADDED
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
       //   marginLeft:2,
        //  marginRight:2,
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
        backgroundColor={currentMode === "dark" ? "#424242" : "#f2f2f2"} //ADDED
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
      </View>
    </>
  );
};

const styles = StyleSheet.create({});

export default ResetPassScreen;
