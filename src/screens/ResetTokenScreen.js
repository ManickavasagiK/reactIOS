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
import { Appbar, Button, Snackbar } from "react-native-paper";
import { SearchBar } from "react-native-elements";
import { Context as AuthContext } from "../context/AuthContext";
import { navigate } from "../navigationRef";
import { Ionicons } from "@expo/vector-icons";
import useAdminTaskResults from "../hooks/useAdminTaskResults";
const getCurrentAppearanceMode = () => Appearance.getColorScheme(); //ADDED
const ResetTokenScreen = (props) => {
  const {
    state: { token, softSignInResponse },
    signin,
    softSignIn,
    validateToken,
  } = useContext(AuthContext);
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

  const [flatListData, setFlatListData] = useState({});
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");

  // Variables for searching
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

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
      // console.log(userListResponse);
      setFlatListData(userListResponse.data);
      setSearchFunctionArrayHolder(userListResponse.data);
      // console.log(flatListData);
    }
  }, [userListResponse]);

  useEffect(() => {
    console.log("UE3");
    if (resetUserTokenResponse.data && resetUserTokenResponse.status === 200) {
      console.log("Token reset done");

      // console.log(resetUserTokenResponse);
      setSnackBarText("Success : Token reset completed");
      setSnackBarVisible(true);
    }
  }, [resetUserTokenResponse]);

  useEffect(() => {
    console.log("UE4");
    if (errorMessage !== "") {
      setSnackBarText("Failed : Token reset did not complete");
      setSnackBarVisible(true);
    }
  }, [errorMessage]);
  const currentMode = getCurrentAppearanceMode(); //ADDED

  // item for flatlist implementation
  const Item = ({ id, title, email }) => {
    return (
      <View
        style={{
          padding: 5,
          margin: 5,
          flexDirection: "row",
        }}
      >
        <View style={{ flex: 0.7, alignSelf: "center" }}>
          <Text
            style={{
              fontSize: 16,
              color: currentMode === "dark" ? "white" : "black",
            }} //ADDED
          >
            {title}
          </Text>
        </View>
        <View style={{ flex: 0.3 }}>
          <Button
            mode="contained"
            onPress={() => {
              _resetUserToken(email);
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
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#c499ff", //"#c499ff",
          alignSelf: "center",
        }}
      />
    );
  };

  const _resetUserToken = (email) => {
    resetUserToken(token.jwt, email);
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

  return (
    <>
      <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}

        <TouchableOpacity
          onPress={() => navigate("Admin")}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons
            name="ios-arrow-back"
            size={24}
            color={currentMode === "dark" ? "white" : "black"} //color="white" ADDED
          />
        </TouchableOpacity>

        <Appbar.Content title="Reset device token" />
      </Appbar.Header>
      <SearchBar
        placeholder="Type here to search"
        lightTheme
       // round
        containerStyle={{
          backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //backgroundColor: "transparent",
          borderWidth: 0,
          borderTopWidth: 0,
          borderBottomWidth: 0,
          padding: 5,
        //  marginLeft:2,
         // marginRight:2,
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
        backgroundColor={currentMode === "dark" ? "#424242" : "#f2f2f2"} //ADDED
        renderItem={renderItem}
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

export default ResetTokenScreen;
