import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Provider,
  Portal,
  Modal,
  Button,
  Snackbar,
  TextInput,
  Avatar,
} from "react-native-paper";
import { Context as AuthContext } from "../context/AuthContext";
import { navigate } from "../navigationRef";
import { Ionicons } from "@expo/vector-icons";
import useAdminTaskResults from "../hooks/useAdminTaskResults";

const AdminScreen = (props) => {
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
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [userReAuthenticationStatus, setUserReAuthenticationStatus] =
    useState(false);
  const [routeAfterReAuth, setRouteAfterReAuth] = useState("");
  const [snackBarText, setSnackBarText] = useState("");
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const getCurrentAppearanceMode = () => Appearance.getColorScheme(); ////ADDED ON 27/11/2023 BY POOBALAN
  const containerStyle = {
    //backgroundColor: currentMode === "dark" ? "white" : "gray", // ADDED//"white",
    paddingBottom: 10,
    // paddingHorizontal: 10,
    width: "80%",
    // height: 250,
    borderRadius: 10,
  };

  
  
  let opsxProps = {};

  useEffect(() => {
    validateToken();
    console.log("UE1");
    // console.log(token.content);

    //handling backpress
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("UE2");
    if (softSignInResponse) {
      if (softSignInResponse.status === 200) {
        if (routeAfterReAuth === "REFRESH_CHECKLIST") {
          console.log("Re auth completed successfully");
          setUserReAuthenticationStatus(true);
          setPassword("");
          setAuthModalVisible(false);
          _refreshChecklist();
        }
        if (routeAfterReAuth === "RESET_USER_PASSWORD") {
          setRouteAfterReAuth("");
          setAuthModalVisible(false);
          setUserReAuthenticationStatus(true);
          navigate("ResetPass");
        }
        if (routeAfterReAuth === "RESET_DEVICE_TOKEN") {
          setRouteAfterReAuth("");
          setAuthModalVisible(false);
          setUserReAuthenticationStatus(true);
          navigate("ResetToken");
        }
        if (routeAfterReAuth === "EMPLOYEE_PIC_UPLOAD") {
          setRouteAfterReAuth("");
          setAuthModalVisible(false);
          setUserReAuthenticationStatus(true);
          navigate("EmployeePicUpload");
        }
      } else {
        // Else part is not reachable now
        setSnackBarText("Failed - Incorrect credentials");
        setSnackBarVisible(true);
      }
    }
  }, [softSignInResponse]);

  useEffect(() => {
    console.log("UE3");
    console.log("ue3",refreshChecklistResponse)
    if (
      routeAfterReAuth === "REFRESH_CHECKLIST" &&
      refreshChecklistResponse.status === 200
    ) {
      
      setSnackBarText("Checklist Refreshed");
      setSnackBarVisible(true);
    }
  }, [refreshChecklistResponse]);

  useEffect(() => {
    console.log("UE4");
    if (routeAfterReAuth === "REFRESH_CHECKLIST" && errorMessage !== "") {
      console.log("ue4",errorMessage);
      setSnackBarText("Checklist refresh failed - contact admin");
      setSnackBarVisible(true);
    }
  }, [errorMessage]);

  const showModal = () => setAuthModalVisible(true);
  const hideModal = () => {
    setAuthModalVisible(false);
  };
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };
  const userNeedsAuthentication = () => {
    hideModal();
    setSnackBarText("Re-authentication required to continue...");
    setPassword("");
    setSnackBarVisible(true);
  };

  const _refreshChecklist = () => {
    refreshChecklist(token.jwt);
  };
  //Added by poobalan for Dark and light Mode Theme
  const currentMode = getCurrentAppearanceMode(); 
  return (
    <>
      <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}

        <TouchableOpacity
          onPress={() => {
            opsxProps = {
              lastRouteName: props.navigation.state.routeName,
              snackBarText: "",
            };
            navigate("HomePage");
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24}
                      color={currentMode === "dark" ? "white" : "black"} //ADDED ON 27/11/2023 BY POOBALAN
                      />
             
          {/* //color="black" /> */}
        </TouchableOpacity>

        <Appbar.Content title="Admin tasks" />
      </Appbar.Header>
      <Provider>
      <View
          style={{
            backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED
            flex: 1,
          }}
        >
        <Portal>
       

          <Modal
            visible={authModalVisible}
            onDismiss={hideModal}
            //Added by poobalan for Dark and light Mode Theme
            contentContainerStyle={[
              containerStyle,
              { backgroundColor: currentMode === "dark" ? "gray" : "white" },
            ]}

            style={{ alignItems: "center", borderColor: "#fff" }}
          >
            <View
              style={{
                height: 40,
                //Added by poobalan for Dark and light Mode Theme
                backgroundColor:
                currentMode === "dark" ? "#1d1b1e" : "#6a00ff", // ADDED//"#6a00ff",

                alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 10,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 15 }}>
                Re-authentication required
              </Text>
            </View>
            <View style={{ height: 230, padding: 10 }}>
              <View
                style={{
                  flex: 0.8,
                  backgroundColor: "transparent",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  // alignSelf: "flex-start",
                  paddingHorizontal: 10,
                }}
              >
                <TextInput
                  mode="outlined"
                  placeholder="User name"
                  label="User name"
                  editable={false}
                  value={token.content.email}
                  style={{ paddingVertical: 5 }}
                />
                <TextInput
                  mode="outlined"
                  placeholder="Password"
                  label="Password"
                  value={password}
                  secureTextEntry={true}
                  onChangeText={(text) => {
                    setPassword(text);
                  }}
                  style={{ paddingVertical: 5 }}
                  autoCapitalize="none"
                />
              </View>
              <View
                style={{
                  flex: 0.2,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  paddingBottom: 10,
                }}
              >
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={() => {
                    let email = token.content.email;
                    let tenantId = token.content.aud;
                    softSignIn({ email, password, tenantId });
                  }}
                >
                  Submit
                </Button>
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={userNeedsAuthentication}
                >
                  Cancel
                </Button>
              </View>
            </View>
          </Modal>
          
        </Portal>

        <View
          style={{
            flexDirection: "row",

            width: "100%",
            paddingHorizontal: 0,
          }}
        >
          <TouchableOpacity
          //Added by poobalan for Dark and light Mode Theme
                         style={[
                          styles.adminCardTouchableOpacity,
                          {
                            backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
                          },
                          {
                            borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
                          },
                        ]}
          
            onPress={() => {
              console.log("Will open refresh checklist screen");
              setRouteAfterReAuth("REFRESH_CHECKLIST");
              if (userReAuthenticationStatus === true) {
                console.log("No re-auth needed");
               // alert("tested")
               setSnackBarVisible(true);
                setSnackBarText("Checklist refresh failed - contact admin");
                _refreshChecklist();
               

              } else {
                setAuthModalVisible(true);
              }
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="format-list-bulleted-square" />
              </View>
              <View style={{ flex: 0.5 }}>
              {/* //Added by poobalan for Dark and light Mode Theme */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

                  Refresh Checklist
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
          // Added by poobalan for dark and light mode theme */
           style={[
            styles.adminCardTouchableOpacity,
            {
              backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
            },
            {
              borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
            },
          ]}

            onPress={() => {
              console.log("Will open reset password screen");
              setRouteAfterReAuth("RESET_USER_PASSWORD");
              if (userReAuthenticationStatus === true) {
                navigate("ResetPass");
              } else {
                setAuthModalVisible(true);
              }
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="lock-reset" />
              </View>
              <View style={{ flex: 0.5 }}>
                 {/* Added by poobalan for dark and light mode theme */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

                  Reset Password
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          //Added by poobalan for Dark and light Mode Theme
                         style={[
                          styles.adminCardTouchableOpacity,
                          {
                            backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
                          },
                          {
                            borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
                          },
                        ]}
          
            onPress={() => {
              console.log("Will reset token");
              setRouteAfterReAuth("RESET_DEVICE_TOKEN");
              if (userReAuthenticationStatus === true) {
                navigate("ResetToken");
              } else {
                setAuthModalVisible(true);
              }
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="key-outline" />
              </View>
              <View style={{ flex: 0.5 }}>
              {/* //Added by poobalan for Dark and light Mode Theme */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

                  Reset User Token
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",

            width: "100%",
            paddingHorizontal: 0,
          }}
        >
          <TouchableOpacity
          //Added by poobalan for Dark and light Mode Theme
          style={[
            styles.adminCardTouchableOpacity,
            {
              backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
            },
            {
              borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
            },
          ]}

           // style={styles.adminCardTouchableOpacity}
            onPress={() => {
              console.log("Calling employee pic upload screen");
              setRouteAfterReAuth("EMPLOYEE_PIC_UPLOAD");
              if (userReAuthenticationStatus === true) {
                navigate("EmployeePicUpload");
              } else {
                setAuthModalVisible(true);
              }
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="camera-account" />
              </View>
              <View style={{ flex: 0.5 }}>
              {/* //Added by poobalan for Dark and light Mode Theme */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

                  Upload Employee Pic
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          //Added by poobalan for Dark and light Mode Theme
                        style={[
                          styles.adminCardTouchableOpacity,
                          {
                            backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
                          },
                          {
                            borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
                          },
                        ]}
          
          //  style={styles.adminCardTouchableOpacity}
            onPress={() => {
              setSnackBarText("Reserved for future");
              setSnackBarVisible(true);
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="checkbox-blank-circle" />
              </View>
              <View style={{ flex: 0.5 }}>
              {/* //Added by poobalan for Dark and light Mode */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

                  Reserved for future use
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
          //Added by poobalan for Dark and light Mode
          style={[
            styles.adminCardTouchableOpacity,
            {
              backgroundColor: currentMode === "dark" ? "gray" : "white", // ADDED
            },
            {
              borderColor: currentMode === "dark" ? "#1d1b1e" : "#3399FF", // ADDED
            },
          ]}

            //style={styles.adminCardTouchableOpacity}
            onPress={() => {
              setSnackBarText("Reserved for future");
              setSnackBarVisible(true);
            }}
          >
            <View style={styles.adminCard}>
              <View style={{ flex: 0.5 }}>
                <Avatar.Icon size={50} icon="checkbox-blank-circle" />
              </View>
              <View style={{ flex: 0.5 }}>
              {/* //Added by poobalan for Dark and light Mode Theme */}
              <Text
                    style={[
                      styles.tasksAndChecklistsOuterText,
                      {
                        color: currentMode === "dark" ? "white" : "black", // ADDED
                      },
                    ]}
                  >

               {/* <Text style={styles.tasksAndChecklistsOuterText}> */}
                  Reserved for future use
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
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
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  adminCardTouchableOpacity: {
    flexDirection: "row",
    flex: 0.33,
    borderWidth: 0.5,
    borderBottomWidth: 3,
    borderColor: "#3399FF",
    backgroundColor: "#FFFFFF",
    margin: 5,
    padding: 5,
    borderRadius: 10,
  },
  adminCard: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 100,
  },
  tasksAndChecklistsOuterText: {
    fontSize: 15,
    textAlign: "center",
    paddingTop: 5,
    paddingBottom: 5,
  },
});

export default AdminScreen;
