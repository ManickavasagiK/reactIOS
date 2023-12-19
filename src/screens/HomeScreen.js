import React, { useContext, useEffect, useState, useRef } from "react";
import {
  Appearance,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  BackHandler,
  Alert,
  RefreshControl,
  AppState,
} from "react-native";
import {
  Appbar,
  Provider,
  Portal,
  ActivityIndicator,
  Modal,
  Button,
  Snackbar,
  FAB,
  Avatar,
  TextInput,
  Badge,
  Divider,
} from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { Context as AuthContext } from "../context/AuthContext";
import ProgressCircle from "react-native-progress-circle";
import { Col, Row, Grid } from "react-native-easy-grid";
import useDashboardResults from "../hooks/useDashboardResults";
import { navigate } from "../navigationRef";
import useEmployeePicResults from "../hooks/useEmployeePicResults";
import { NavigationEvents } from "react-navigation";
import useSelfServiceResults from "../hooks/useSelfServiceResults";
import useNotificationResults from "../hooks/useNotificationResults";
import useSystemResults from "../hooks/useSystemResults";

//colors
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
const currentMode = getCurrentAppearanceMode(); //ADDED ON 28/11/2023 BY POOBALAN to get  device current theme
const cardHeaderBackgroundColor = "#e1ccff";
const cardHeaderBorderColor = "#e1ccff";
const cardHeaderTextColor = "#8833ff"; // Old #a666ff";
const progressCircleGreenStatusColor = "#aeeaae"; // Old #85e085";
const progressCircleYellowStatusColor = "#ffbd66"; // Old #FF9712";
const progressCircleRedStatusColor = "#fd7768"; // Old #FC1B04";

const HomeScreen = (props) => {
  // console.log({ navigation });

  // const { getSummaryInfoBySupervisor } = useContext(DashboardContext);
  const currentMode = getCurrentAppearanceMode(); //ADDED ON 28/11/2023 BY POOBALAN
  const {
    state: { token, tokenContent, opsxApi, isTokenValid },
    signout,
    getToken,
    tryLocalSignin,
    validateToken,
    buildOpsxApi,
  } = useContext(AuthContext);

  // Dashboard information - Home screen
  const [
    getDashboardInfoBySupervisor,
    dashboardResults,
    getHistoryDashboardInfo,
    historyDashboardResults,
    errorMessage,
  ] = useDashboardResults();

  // Employee profile pic
  const [
    getEmployeePic,
    employeePicResults,
    getPicsOfMultipleEmployees,
    picsOfMultipleEmployeesResults,
    empPicErrorMessage,
  ] = useEmployeePicResults();

  //self-service password reset
  const [
    selfServicePasswordReset,
    selfServicePasswordResetResults,
    selfServiceErrorMessage,
  ] = useSelfServiceResults();

  //Notification count
  const [
    getNotificationsForUser,
    notificationsForUserResults,
    changeNotificationToRead,
    changeNotificationToReadResults,
    deleteNotification,
    deleteNotificationResults,
    getCountOfUnreadNotifications,
    countOfUnreadNotificationResults,
    notificationErrorMessage,
  ] = useNotificationResults();

  //Access information for role
  const [
    getUdcsForDdList,
    udcsForDdListGetResponse,
    getAccessInformationForRole,
    accessInformationGetResponse,
    systemErrorMessage,
  ] = useSystemResults();

  //state variables - colors
  // const [cardHeaderBackgroundColor, setCardHeaderBackgroundColor] =
  //   useState("#e1ccff");
  // const [cardHeaderBorderColor, setCardHeaderBorderColor] = useState("#e1ccff");
  // const [cardHeaderTextColor, setCardHeaderTextColor] = useState("#6200ee");

  // state variables - self service password reset
  const [authModalVisible, setAuthModalVisible] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [reTypedNewPassword, setReTypedNewPassword] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  //state variables for access info
  const [checkwkbhVisible, setCheckwkbhVisible] = useState(false);
  const [checkdashVisible, setCheckdashVisible] = useState(false);
  const [ckhisdashVisible, setCkhisdashVisible] = useState(false);
  const [adminVisible, setAdminVisible] = useState(false);
  const [cwaddtaskVisible, setCwaddtaskVisible] = useState(false);
  const [execdashVisible, setExecdashVisible] = useState(false);

  // Tooltip variables
  const [showTasksTooltip, setShowTasksTooltip] = useState(false);
  const [showChecklistsTooltip, setShowChecklistsTooltip] = useState(false);
  const [showTaskDashboardTooltip, setShowTaskDashboardTooltip] =
    useState(false);
  const [showChecklistDashboardTooltip, setShowChecklistDashboardTooltip] =
    useState(false);
  const [showSummaryDashboardTooltip, setShowSummaryDashboardTooltip] =
    useState(false);

  //functions - self service password reset

  const _resetUserPassword = (email) => {
    console.log("rest password called");
    let passwordResetDto = {
      userName: "",
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    selfServicePasswordReset(token.jwt, passwordResetDto);
    hideModal();
  };

  const passwordsDoNotMatch = () => {
    console.log("Passwords do not match");
    setSnackBarText("Passwords do not match... Try again !");
    setSnackBarVisible(true);
  };

  const resetPasswordCancelled = () => {
    hideModal();
    setSnackBarText("Reset password cancelled...");
    setNewPassword("");
    setReTypedNewPassword("");
    setCurrentPassword("");
    setSnackBarVisible(true);
  };
  console.log("Home screen");
  // State variables - notifications
  const [countOfUnreadNotifications, setCountOfUnreadNotifications] =
    useState(0);
  const [badgeVisible, setBadgeVisible] = useState(false);

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);

  //Employee profile pic state variable
  const [employeePictureWithoutInfo, setEmployeePictureWithoutInfo] =
    useState("");

  // Snackbar variables
  const [snackBarText, setSnackBarText] = useState("");
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };

  // checklist history variable
  const [numberOfDaysForHistoryDashBoard, setNumberOfDaysForHistoryDashboard] =
    useState(7);

  let opsxProps = {};

  // Following block code for App bar and it's contents

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  // const hideModal = () => setVisible(false);
  const hideModal = () => {
    setVisible(false);
    setAuthModalVisible(false);
    setCurrentPassword("");
    setNewPassword("");
    setReTypedNewPassword("");
  };
  const containerStyle = {
    backgroundColor: currentMode === "dark" ? "#1d1b1e" : "white", //ADDED  ON 28/11/2023 BY POOBALAN
    // backgroundColor: "white",
    padding: 20,
    width: "75%",
    borderRadius: 10,
    height: 350,
  };
  const _goBack = () => console.log("Went back");
  const _handleNotifications = () => {
    console.log("Opening notifications");
    opsxProps = {
      lastRouteName: props.navigation.state.routeName,
    };
    navigate("Notification", opsxProps);
  };
  const _handleMore = () => console.log("Shown more");

  // const [dashboardData, setDashboardData] = useState({});
  var dashboardData = {
    checklistWorkbenchNumber: 0,
    completedQuestionsBySupervisor: 0,
    completedTasksByReportingEmployees: 0,
    completedTasksBySupervisor: 0,
    lineNumber: 0,
    numberOfOverdueQuestionsBySupervisor: 0,
    numberOfOverdueTasksBySupervisor: 0,
    numberOfQuestionsCompletedInTimeBySupervisor: 0,
    numberOfQuestionsNotCompletedInTimeBySupervisor: 0,
    numberOfTasksCompletedInTimeBySupervisor: 0,
    numberOfTasksNotCompletedInTimeBySupervisor: 0,
    overdueTasksByReportingEmployees: 0,
    pendingQuestionsBySupervisor: 0,
    pendingTasksByReportingEmployees: 0,
    pendingTasksBySupervisor: 0,
    supervisorId: 0,
    supervisorName: "",
    totalQuestionsBySupervisor: 0,
    totalTasksByReportingEmployees: 0,
    totalTasksBySupervisor: 0,
    totalUnassignedTasksBySupervisor: 0,
  };

  //Variable and functions for FAB
  const [fabState, setFABState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setFABState({ open });
  const { open } = fabState;

  // AppState variables
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [previousAppStateVisible, setPreviousAppStateVisible] = useState("");

  //activity indicator
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(true);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(true);

  // This builds the opsX api axios instance once. Will be used across the application.
  // If this code is disabled, all server api calls will fail
  useEffect(() => {
    buildOpsxApi();
    setActivityIndicatorAnimating(true);
    setActivityIndicatorModalVisible(true);
  }, []);

  useEffect(() => {
    console.log("inside app state useEffect");

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to foreground");
        setAppStateVisible(nextAppState);
        setPreviousAppStateVisible(appState.current);
        console.log("AppState", nextAppState);
        validateToken();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState+", appState.current);
      console.log("App state use effect");
    });

    return () => {
      console.log("subscription removed");
      subscription.remove(); // TODO Research on this
    };
  }, []);

  //Added 01-MARCH-2022
  //If token is not valid, only then call tryLocalSignIn
  useEffect(() => {
    // This useEffect doesn't affect code even if removed - In place to track few values by printing them in console.
    //Treat this if() carefully. High chances of circular loop resulting in endless api calls if screwed up
    if (
      isTokenValid != null &&
      isTokenValid != undefined &&
      appStateVisible === "active" &&
      previousAppStateVisible === "background"
    ) {
      // To check app state transition between foreground and background
      // Validate token and try local sign in if the app is called from background

      console.log("isTokenValid ? " + isTokenValid);
      // console.log(token.jwt);

      console.log(
        "isTokenValid : " +
          isTokenValid +
          "; AppState : " +
          appStateVisible +
          "; previous app state : " +
          previousAppStateVisible
      );
      setPreviousAppStateVisible(null);
    }
  }, [isTokenValid]);

  useEffect(() => {
    console.log("HomeScreen UE1");
    if (token && opsxApi) {
      // console.log(opsxApi);
      console.log(token.content.employeeNumber);
      console.log("Inside UE 1");
      getDashboardInfoBySupervisor(token.jwt, token.content.employeeNumber);
      // 11-MAR-2022 - api call will not happen if user has no access to application
      ckhisdashVisible
        ? getHistoryDashboardInfo(token.jwt, numberOfDaysForHistoryDashBoard)
        : null;
      getEmployeePic(token.jwt);
      getCountOfUnreadNotifications(token.jwt);

      // NOTES : get access information for user role. Add to the below list when new applications are created in home screen
      // CHECKWKBH - Tasks and checklist cards,
      // CHECKDASH - Checklist Dashboard cards,
      // CKHISDASH - Task and checklist history dashboard card,
      // ADMIN - Admin tasks card,
      // CWADDTASK - Add task and checklist FAB button
      // EXECDASH - Executive Dashboard; only for business leader

      // no space while entering application codes below after comma
      let applicationCodes =
        "CHECKWKBH,CHECKDASH,CKHISDASH,ADMIN,CWADDTASK,EXECDASH";
      getAccessInformationForRole(token.jwt, applicationCodes);
      // console.log(props.navigation.state);
    }
    // 11-MAR-2022 - Removing 'props' from the array below to restrict page from calling apis when props changes.
    // 11-MAR-2022 - User can use the pull down to refresh feature when required
    // 11-MAR-2022 - Added visible variable 'ckhisdashVisible' to control api call when user do not have access to the application
  }, [opsxApi, ckhisdashVisible]);

  useEffect(() => {
    console.log("HomeScreen UE2");
    // setDashboardData(dashboardResults);
    // console.log(dashboardResults);
    var totalQuestionsBySupervisor =
      dashboardResults.totalQuestionsBySupervisor;

    dashboardData = dashboardResults;
    // console.log(dashboardData);
  }, [dashboardResults]);

  useEffect(() => {
    console.log("HomeScreen UE3");
    // console.log(historyDashboardResults);

    setRefreshing(false);
  }, [historyDashboardResults]);

  const backAction = () => {
    Alert.alert("Exit App!", "Are you sure you want to exit OpsX?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Yes", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    console.log("HomeScreen UE4");

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("HomeScreen UE5");
    // Block executes when there is a change to state variable in props
    if (props.navigation.state.params != undefined) {
      // console.log(props.navigation.state);
      if (props.navigation.state.params.snackBarText) {
        setSnackBarText(props.navigation.state.params.snackBarText);
        setSnackBarVisible(true);
      }
    }
  }, [props.navigation.state]);

  useEffect(() => {
    console.log("HomeScreen UE6");
    if (
      employeePicResults.data &&
      employeePicResults.status === 200 &&
      employeePicResults.data.employeePictureList[0]
    ) {
      // console.log("IN IF : " + JSON.stringify(employeePicResults));
      // console.log(employeePicResults.data.employeePictureList[0].pictureName);
      var tempPictureArray = employeePicResults.data.employeePictureList.map(
        (res) => ({
          title: res.pictureName,
          caption: res.lastUpdatedDate + " " + res.lastUpdatedTime,
          url:
            "data:" + res.pictureType + ";base64," + res.pictureByteArray + "",
        })
      );

      if (tempPictureArray) {
        // setEmployeePictureWithoutInfo(tempPictureArray.map(({ url }) => url));
        setEmployeePictureWithoutInfo(tempPictureArray[0].url);
        // console.log(tempPictureArray[0].url);
        // console.log(employeePictureWithoutInfo[0]);
      }
    }
  }, [employeePicResults]);

  useEffect(() => {
    console.log("HomeScreen UE7 - self service pass reset result");
    if (selfServicePasswordResetResults.status === 200) {
      setSnackBarText("Password reset successful");
      setSnackBarVisible(true);
    }
  }, [selfServicePasswordResetResults]);

  useEffect(() => {
    console.log("HomeScreen UE8 - self service pass reset error");
    if (selfServiceErrorMessage.status) {
      setSnackBarText(selfServiceErrorMessage.message);
      setSnackBarVisible(true);
    }
  }, [selfServiceErrorMessage]);

  useEffect(() => {
    console.log("HomeScreen UE9 - Count of notifications");
    if (countOfUnreadNotificationResults.status === 200) {
      console.log(
        "Number of unread notifications : " +
          countOfUnreadNotificationResults.data
      );
      setCountOfUnreadNotifications(countOfUnreadNotificationResults.data);
      if (countOfUnreadNotificationResults.data > 0) {
        setBadgeVisible(true);
      } else {
        setBadgeVisible(false);
      }
    }
  }, [countOfUnreadNotificationResults]);

  useEffect(() => {
    console.log("Home screen UE10 - user access information get response");
    if (accessInformationGetResponse.status === 200) {
      // run functions to assign access for applications
      // console.log(accessInformationGetResponse.data);
      for (let i = 0; i < accessInformationGetResponse.data.length; i++) {
        accessInformationGetResponse.data[i].applicationCode === "CHECKWKBH" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setCheckwkbhVisible(true)
          : null;
        accessInformationGetResponse.data[i].applicationCode === "CHECKDASH" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setCheckdashVisible(true)
          : null;
        accessInformationGetResponse.data[i].applicationCode === "CKHISDASH" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setCkhisdashVisible(true)
          : null;
        accessInformationGetResponse.data[i].applicationCode === "ADMIN" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setAdminVisible(true)
          : null;
        accessInformationGetResponse.data[i].applicationCode === "CWADDTASK" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setCwaddtaskVisible(true)
          : null;
        accessInformationGetResponse.data[i].applicationCode === "EXECDASH" &&
        accessInformationGetResponse.data[i].accessToExecute === "YES"
          ? setExecdashVisible(true)
          : null;
      }
      // turn off activity indicator after all the api responses for home screen have been loaded
      setActivityIndicatorAnimating(false);
      setActivityIndicatorModalVisible(false);
    }
  }, [accessInformationGetResponse]);

  // test useEffect - Will be removed once role based access is implemented and tested
  // ##Do not delete if you need for testing in future##

  // useEffect(() => {
  //   console.log(" checkwkbhVisible: " + checkwkbhVisible);
  //   console.log(" checkdashVisible: " + checkdashVisible);
  //   console.log(" ckhisdashVisible: " + ckhisdashVisible);
  //   console.log(" adminVisible: " + adminVisible);
  //   console.log(" cwaddtaskVisible: " + cwaddtaskVisible);
  //   console.log(" execdashVisible : " + execdashVisible);
  // }, [
  //   checkwkbhVisible,
  //   checkdashVisible,
  //   ckhisdashVisible,
  //   adminVisible,
  //   cwaddtaskVisible,
  //   execdashVisible,
  // ]);

  const logout = () => {
    Alert.alert("Logout !", "Are you sure you want to log out of OpsX?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => {
          signout();
        },
      },
    ]);
    return true;
  };

  const onRefresh = () => {
    setRefreshing(true);

    getDashboardInfoBySupervisor(token.jwt, token.content.employeeNumber);
    getHistoryDashboardInfo(token.jwt, numberOfDaysForHistoryDashBoard);
    getEmployeePic(token.jwt);
    getCountOfUnreadNotifications(token.jwt);
  };

  // Activity indicator hide function
  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
    setActivityIndicatorAnimating(false);
  };

  return (
    <>
      <Appbar.Header>
        {employeePictureWithoutInfo ? (
          <Avatar.Image
            size={45}
            source={{ uri: employeePictureWithoutInfo }}
          />
        ) : (
          <Avatar.Icon
            size={45}
            icon="folder"
            color="#a300ee"
            backgroundColor="white"
          />
        )}
        {/* <Avatar.Image size={45} source={{ uri: employeePictureWithoutInfo }} /> */}
        <View style={{ padding: 10 }}>
          <Text
            style={{
              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
              //color:'black',

              fontSize: 20,
              fontWeight: "700",
            }}
          >
            OpsX
          </Text>
          {token ? (
            <Text
              style={{
                fontSize: 15,

                color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN

                // color:'black'
              }}
            >
              Hello! {token.content.firstName}
            </Text>
          ) : null}
        </View>

        {/* <View style={{paddingLeft:8}}>
   <Text style={{color:'black',fontSize: 20,fontWeight:'700'}}>OpsX</Text>
   {token?
   <Text style={{fontSize: 15,color:'black'} }>Hello! { token.content.firstName }</Text>
   :null}
</View> */}

        <Appbar.Content
        //  title="OpsX"
        //  color="black"

        // subtitle={"Hello !"}
        //  subtitle={"Hello " + token ? token.content.firstName : "" + " !"}
        //   subtitle={`Hello ${token ? token.content.firstName : ""} !`}
        />

        <Appbar.Action
          icon="information-outline"
          //  style={{marginLeft:80}}
          onPress={() => {
            setShowTasksTooltip(true);
          }}
        />

        <Appbar.Action
          icon="bell"
          onPress={_handleNotifications}
          style={{ paddingLeft: 15 }}
        />

        <Badge size={20} visible={badgeVisible} style={styles.badge}>
          {countOfUnreadNotifications}
        </Badge>

        <Appbar.Action icon="menu" onPress={showModal} />
      </Appbar.Header>

      {/* <NavigationEvents
        onWillBlur={() => {
          BackHandler.removeEventListener("hardwareBackPress", backAction);
          // BackHandler.remove;
          console.log("Back handler removed");
        }}
      /> */}

      <Portal>
        <Modal
          visible={activityIndicatorModalVisible}
          onDismiss={hideActivityIndicatorModal}
          theme={{
            colors: {
              backdrop: "transparent",
            },
          }}
        >
          <ActivityIndicator
            animating={activityIndicatorAnimating}
            size="large"
          />
        </Modal>
      </Portal>

      <Provider>
        <Portal>
          <Modal
            dismissable={true}
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
            style={styles.modal}
          >
            <View style={{ flex: 1, flexDirection: "column" }}>
              <View
                style={{
                  flex: 0.6,
                  justifyContent: "center",
                  alignSelf: "center",
                }}
              >
                {employeePictureWithoutInfo ? (
                  <Avatar.Image
                    size={150}
                    source={{ uri: employeePictureWithoutInfo }}
                  />
                ) : (
                  <Avatar.Icon size={45} icon="folder" />
                )}
              </View>
              <View style={{ flex: 0.4, justifyContent: "center" }}>
                <View style={{ paddingVertical: 5 }}>
                  <Button
                    mode="contained"
                    onPress={() => {
                      hideModal();
                      setAuthModalVisible(true);
                    }}
                  >
                    Reset Password
                  </Button>
                </View>
                <View style={{ paddingVertical: 5 }}>
                  <Button mode="contained" onPress={logout}>
                    Logout
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
        {/* Modal for self service password reset */}
        <Portal>
          <Modal
            visible={authModalVisible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
            style={{ alignItems: "center", borderColor: "#fff" }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "transparent",
                justifyContent: "flex-start",
                flexDirection: "column",
                paddingHorizontal: 10,
              }}
            >
              <TextInput
                mode="outlined"
                placeholder="User name"
                label="User name"
                editable={false}
                dense
                value={token ? token.content.email : ""} // If condition is removed, logout will error
                style={{ paddingVertical: 5 }}
              />
              <TextInput
                mode="outlined"
                // placeholder="Current password"
                label="Current password"
                value={currentPassword}
                dense
                secureTextEntry={true}
                onChangeText={(text) => {
                  setCurrentPassword(text);
                }}
                style={{ paddingVertical: 5 }}
              />
              <TextInput
                mode="outlined"
                // placeholder="New password"
                label="New password"
                value={newPassword}
                dense
                secureTextEntry={true}
                onChangeText={(text) => {
                  setNewPassword(text);
                }}
                style={{ paddingVertical: 5 }}
              />
              <TextInput
                mode="outlined"
                // placeholder="Re-type new password"
                label="Re-type new password"
                value={reTypedNewPassword}
                dense
                secureTextEntry={true}
                onChangeText={(text) => {
                  setReTypedNewPassword(text);
                }}
                style={{ paddingVertical: 5 }}
              />
            </View>
            <View
              style={{
                // flex: 0.4,
                flexDirection: "row",
                justifyContent: "space-around",
                paddingBottom: 10,
              }}
            >
              <Button
                style={{ marginLeft: 0 }}
                mode="contained"
                disabled={submitButtonDisabled}
                onPress={() => {
                  currentPassword.trim() !== "" &&
                  newPassword.trim() !== "" &&
                  reTypedNewPassword.trim() !== ""
                    ? newPassword === reTypedNewPassword
                      ? _resetUserPassword(token.content.email)
                      : passwordsDoNotMatch()
                    : (console.log("blank password"),
                      setSnackBarText("Password cannot be blank."),
                      setSnackBarVisible(true));
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

        <ScrollView
          backgroundColor={currentMode === "dark" ? "#424242" : "#f2f2f2"} //ADD ON 28/11/2023 BY POOBALAN
          scrollToOverflowEnabled={true}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Tasks and Checklists - STARTS*/}
          {checkwkbhVisible ? (
            <Tooltip
              isVisible={showTasksTooltip}
              allowChildInteraction={false}
              showChildInTooltip={true}
              content={
                <>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text style={{ fontWeight: "bold" }}>
                      Tasks and Checklists
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text>
                      Tasks section will take you to the number of pending tasks
                      to be completed.
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text>
                      Checklists section will take you to the number of pending
                      checklists to be completed.
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text>
                      Graph here will give percentage of tasks or checklists
                      completed.
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                </>
              }
              onClose={() => {
                setShowTasksTooltip(false);
                setShowTaskDashboardTooltip(true);
              }}
              placement="bottom"
            >
              <View
                style={{
                  flexDirection: "row",
                  width: "100%",
                  paddingHorizontal: 5,
                  marginTop: 5,
                  marginBottom: 3,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.tasksAndChecklistsTouchableOpacity,
                    {
                      borderColor:
                        currentMode === "dark"
                          ? "#1d1b1e"
                          : cardHeaderBorderColor, //ADDED ON 28/11/2023 BY POOBALAN
                    },
                    {
                      backgroundColor:
                        currentMode === "dark" ? "#424242" : "#FFFFFF", //ADDED ON 28/11/2023 BY POOBALAN
                    },
                  ]}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      sourceOfData: "CURRENT",
                      formType: "TASK",
                      appBarTitle: "My Tasks",
                    };
                    // Navigate
                    // navigate("Tasks");
                    navigate("Checklist", opsxProps);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 0.2,

                        backgroundColor:
                          currentMode === "dark"
                            ? "#1d1b1e"
                            : cardHeaderBackgroundColor, //ADDED ON 28/11/2023 BY POOBALAN"#1d1b1e",
                        // cardHeaderBackgroundColor,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            currentMode === "dark"
                              ? "white"
                              : cardHeaderTextColor, //cardHeaderTextColor ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        Tasks
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        width: "100%",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <ProgressCircle
                        percent={
                          dashboardResults.totalTasksBySupervisor != 0
                            ? Math.round(
                                (dashboardResults.completedTasksBySupervisor /
                                  dashboardResults.totalTasksBySupervisor) *
                                  100
                              )
                            : 0
                        }
                        radius={50}
                        borderWidth={8}
                        color={progressCircleGreenStatusColor}
                        shadowColor="#f2e6d9"
                        bgColor={currentMode === "dark" ? "grey" : "white"} //ADDED ON 28/11/2023 BY POOBALAN REMOVED bgColor="#fff"
                      >
                        <Text
                          style={[
                            styles.tasksAndChecklistsPercentText,
                            {
                              color: currentMode === "dark" ? "white" : "black", //  ADDED ON 28/11/2023 BY POOBALAN
                            },
                          ]}
                        >
                          {dashboardResults &&
                          dashboardResults.totalTasksBySupervisor !==
                            undefined &&
                          dashboardResults.totalTasksBySupervisor !== null && // ADDED
                          dashboardResults.totalTasksBySupervisor != 0 //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                            ? Math.round(
                                (dashboardResults.completedTasksBySupervisor /
                                  dashboardResults.totalTasksBySupervisor) *
                                  100
                              )
                            : 0}
                          {"%"}
                        </Text>
                        <Text
                          style={[
                            styles.tasksAndChecklistsInnerText,
                            {
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            },
                          ]}
                        >
                          {dashboardResults &&
                          dashboardResults.completedTasksBySupervisor !==
                            undefined &&
                          dashboardResults.completedTasksBySupervisor !== //ADDED
                            null &&
                          dashboardResults.totalTasksBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                            undefined &&
                          dashboardResults.totalTasksBySupervisor !== null
                            ? `${dashboardResults.completedTasksBySupervisor}/${dashboardResults.totalTasksBySupervisor}`
                            : "0/0"}
                        </Text>
                      </ProgressCircle>
                    </View>
                    {/* <Text style={styles.tasksAndChecklistsOuterText}>Tasks</Text> */}
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.tasksAndChecklistsTouchableOpacity,
                    {
                      borderColor:
                        currentMode === "dark"
                          ? "#1d1b1e"
                          : cardHeaderBorderColor, //ADDED ON 28/11/2023 BY POOBALAN
                    },
                    {
                      backgroundColor:
                        currentMode === "dark" ? "#424242" : "#FFFFFF", //ADDED ON 28/11/2023 BY POOBALAN
                    },
                  ]}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      sourceOfData: "CURRENT",
                      formType: "CHECKLIST",
                      appBarTitle: "My Checklists",
                    };
                    // Navigate
                    navigate("Checklist", opsxProps);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 0.2,
                        backgroundColor:
                          currentMode === "dark"
                            ? "#1d1b1e"
                            : cardHeaderBackgroundColor, //ADDED ON 28/11/2023 BY POOBALAN
                        //cardHeaderBackgroundColor,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        width: "100%",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        style={{
                          color:
                            currentMode === "dark"
                              ? "white"
                              : cardHeaderTextColor, //cardHeaderTextColor ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        Checklists
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 0.8,
                        width: "100%",
                        alignItems: "center",
                        padding: 5,
                      }}
                    >
                      <ProgressCircle
                        percent={
                          dashboardResults.totalQuestionsBySupervisor != 0
                            ? Math.round(
                                (dashboardResults.completedQuestionsBySupervisor /
                                  dashboardResults.totalQuestionsBySupervisor) *
                                  100
                              )
                            : 0
                        }
                        radius={50}
                        borderWidth={8}
                        color={progressCircleGreenStatusColor}
                        shadowColor="#f2e6d9"
                        bgColor={currentMode === "dark" ? "grey" : "white"} //ADDED//bgColor="#fff"
                        //ADDED ON 28/11/2023 BY POOBALAN
                      >
                        <Text
                          style={[
                            styles.tasksAndChecklistsPercentText,
                            {
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            },
                          ]}
                        >
                          {dashboardResults &&
                          dashboardResults.totalQuestionsBySupervisor !==
                            undefined &&
                          dashboardResults.totalQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                            null &&
                          dashboardResults.totalQuestionsBySupervisor != 0
                            ? Math.round(
                                (dashboardResults.completedQuestionsBySupervisor /
                                  dashboardResults.totalQuestionsBySupervisor) *
                                  100
                              )
                            : 0}
                          {"%"}
                        </Text>
                        <Text
                          style={[
                            styles.tasksAndChecklistsInnerText,
                            {
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            },
                          ]}
                        >
                          {dashboardResults &&
                          dashboardResults.completedQuestionsBySupervisor !==
                            undefined &&
                          dashboardResults.completedQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                            null &&
                          dashboardResults.totalQuestionsBySupervisor !==
                            undefined &&
                          dashboardResults.totalQuestionsBySupervisor !== null
                            ? `${dashboardResults.completedQuestionsBySupervisor}/${dashboardResults.totalQuestionsBySupervisor}`
                            : "0/0"}
                        </Text>
                      </ProgressCircle>
                    </View>
                    {/* <Text style={styles.tasksAndChecklistsOuterText}>
                    Checklist
                  </Text> */}
                  </View>
                </TouchableOpacity>
              </View>
            </Tooltip>
          ) : null}

          {/* Tasks and Checklists - ENDS*/}

          {/* Section for task  and checklist dashboard status - STARTS */}
          {checkdashVisible ? (
            <>
              <Tooltip
                isVisible={showTaskDashboardTooltip}
                allowChildInteraction={false}
                content={
                  <>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Task and Checklist dashboard
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Task status of reporting employees display graphs of
                        task statuses. Press each graph to know more detail.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Checklist status shows graphs of checklists assigned to
                        you. Pressing on each graph will show detailed
                        information by employee.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Graphs here will give percentage of tasks or checklists
                        that are various statuses.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                  </>
                }
                onClose={() => {
                  setShowTaskDashboardTooltip(false);
                  setShowSummaryDashboardTooltip(true);
                }}
                placement="bottom"
              >
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    borderWidth: 0.5,
                    borderBottomWidth: 3,
                    borderColor:
                      currentMode === "dark"
                        ? "#1d1b1e"
                        : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED ON 28/11/2023 BY POOBALAN

                    backgroundColor:
                      currentMode === "dark" ? "#424242" : "#FFFFFF", //ADDED //ADDED ON 28/11/2023 BY POOBALAN
                    //  backgroundColor: "#FFFFFF", //REMOVE
                    marginVertical: 3,
                    borderRadius: 10,
                    marginHorizontal: 8,
                    height: 140,
                    // justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      flex: 0.2,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        currentMode === "dark"
                          ? "#1d1b1e"
                          : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED //ADDED ON 28/11/2023 BY POOBALAN
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          currentMode === "dark"
                            ? "white"
                            : cardHeaderTextColor, //cardHeaderTextColor
                      }}
                    >
                      Task status - Reporting employees
                    </Text>
                  </View>

                  <View
                    style={{
                      flex: 0.8,
                      // backgroundColor: "#FFD6CC",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {/* View for completed percent progress circle */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        // style={{ backgroundColor: "#CCFFCC" }}
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "COMPLETED_TASKS_BY_REPORTING_EMPLOYEES",
                            appBarTitle: "Completed tasks - employees",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalTasksByReportingEmployees != 0
                              ? Math.round(
                                  (dashboardResults.completedTasksByReportingEmployees /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleGreenStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff"  //ADDED
                          //ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED
                              //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees != 0 //ADDED
                              ? Math.round(
                                  (dashboardResults.completedTasksByReportingEmployees /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.completedTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.completedTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null
                              ? `${dashboardResults.completedTasksByReportingEmployees}/${dashboardResults.totalTasksByReportingEmployees}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 5,
                          color: currentMode === "dark" ? "white" : "black", //ADDED  ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Completed
                      </Text>
                    </View>
                    {/* View for pending percent progress circle */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "PENDING_TASKS_BY_REPORTING_EMPLOYEES",
                            appBarTitle: "Pending tasks - employees",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalTasksByReportingEmployees != 0
                              ? Math.round(
                                  (dashboardResults.pendingTasksByReportingEmployees /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleYellowStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor="#fff" ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED
                              null &&
                            dashboardResults.totalTasksByReportingEmployees != 0 //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              ? Math.round(
                                  (dashboardResults.pendingTasksByReportingEmployees /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }} //ADDED
                          >
                            {dashboardResults &&
                            dashboardResults.pendingTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.pendingTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              undefined && //ADDED
                            dashboardResults.totalTasksByReportingEmployees !==
                              null
                              ? `${dashboardResults.pendingTasksByReportingEmployees}/${dashboardResults.totalTasksByReportingEmployees}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 5,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Pending
                      </Text>
                    </View>

                    {/* View for overdue percent progress circle */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "OVERDUE_TASKS_BY_REPORTING_EMPLOYEES",
                            appBarTitle: "Overdue tasks - employees",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalTasksByReportingEmployees -
                              dashboardResults.completedTasksByReportingEmployees !=
                            0
                              ? Math.round(
                                  (dashboardResults.overdueTasksByReportingEmployees /
                                    (dashboardResults.totalTasksByReportingEmployees -
                                      dashboardResults.completedTasksByReportingEmployees)) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleRedStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                          //ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED
                              //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED
                              0 &&
                            dashboardResults.completedTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.completedTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees -
                              dashboardResults.completedTasksByReportingEmployees != //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              0
                              ? Math.round(
                                  (dashboardResults.overdueTasksByReportingEmployees /
                                    (dashboardResults.totalTasksByReportingEmployees -
                                      dashboardResults.completedTasksByReportingEmployees)) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED
                              //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.overdueTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.overdueTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !== // ADDED
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null &&
                            dashboardResults.completedTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              undefined &&
                            dashboardResults.completedTasksByReportingEmployees !==
                              null
                              ? `${
                                  dashboardResults.overdueTasksByReportingEmployees
                                }/${
                                  dashboardResults.totalTasksByReportingEmployees -
                                  dashboardResults.completedTasksByReportingEmployees
                                }`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 5,
                          color: currentMode === "dark" ? "white" : "black",
                          //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Overdue
                      </Text>
                    </View>

                    {/* View for unassigned percent progress circle */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "UNASSIGNED_TASKS_BY_REPORTING_EMPLOYEES",
                            appBarTitle: "Unassigned tasks - employees",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalTasksByReportingEmployees != 0
                              ? Math.round(
                                  (dashboardResults.totalUnassignedTasksBySupervisor /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color="#FFC300"
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              0 &&
                            dashboardResults.totalUnassignedTasksBySupervisor !==
                              undefined &&
                            dashboardResults.totalUnassignedTasksBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null
                              ? Math.round(
                                  (dashboardResults.totalUnassignedTasksBySupervisor /
                                    dashboardResults.totalTasksByReportingEmployees) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalUnassignedTasksBySupervisor !==
                              undefined &&
                            dashboardResults.totalUnassignedTasksBySupervisor !==
                              null &&
                            dashboardResults.totalTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              undefined &&
                            dashboardResults.totalTasksByReportingEmployees !==
                              null
                              ? `${dashboardResults.totalUnassignedTasksBySupervisor}/${dashboardResults.totalTasksByReportingEmployees}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 5,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Unassigned
                      </Text>
                    </View>
                  </View>
                </View>

                {/* My checklist status */}
                <View
                  style={{
                    flexDirection: "column",
                    flex: 1,
                    borderWidth: 0.5,
                    borderBottomWidth: 3,
                    borderColor:
                      currentMode === "dark"
                        ? "#1d1b1e"
                        : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED ON 28/11/2023 BY POOBALAN

                    backgroundColor:
                      currentMode === "dark" ? "#424242" : "#FFFFFF", //ADDED ON 28/11/2023 BY POOBALAN
                    // backgroundColor: "#FFFFFF", REMOVE
                    marginVertical: 3,
                    borderRadius: 10,
                    marginHorizontal: 8,
                    height: 140,
                  }}
                >
                  <View
                    style={{
                      flex: 0.2,
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor:
                        currentMode === "dark"
                          ? "#1d1b1e"
                          : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED ON 28/11/2023 BY POOBALAN
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        color:
                          currentMode === "dark"
                            ? "white"
                            : cardHeaderTextColor, //cardHeaderTextColor ADDED ON 28/11/2023 BY POOBALAN
                      }}
                    >
                      My checklist status
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 0.8,
                      // backgroundColor: "#FFD6CC",
                      flexDirection: "row",
                      justifyContent: "space-evenly",
                    }}
                  >
                    {/* Pending checklist status */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "PENDING_CHECKLISTS_BY_SUPERVISOR",
                            appBarTitle: "My checklists - Pending",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalQuestionsBySupervisor != 0
                              ? Math.round(
                                  (dashboardResults.pendingQuestionsBySupervisor /
                                    dashboardResults.totalQuestionsBySupervisor) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleYellowStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor="#fff" ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null &&
                            dashboardResults.totalQuestionsBySupervisor !== 0 &&
                            dashboardResults.pendingQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.pendingQuestionsBySupervisor !==
                              null
                              ? Math.round(
                                  (dashboardResults.pendingQuestionsBySupervisor /
                                    dashboardResults.totalQuestionsBySupervisor) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.pendingQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              undefined &&
                            dashboardResults.pendingQuestionsBySupervisor !==
                              null &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !== null
                              ? `${dashboardResults.pendingQuestionsBySupervisor}/${dashboardResults.totalQuestionsBySupervisor}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 0,
                          padding: 0,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Pending
                      </Text>
                    </View>

                    {/* Completed in time checklist status */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "COMPLETED_CHECKLISTS_BY_SUPERVISOR",
                            appBarTitle: "My Checklists - Completed",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalQuestionsBySupervisor != 0
                              ? Math.round(
                                  (dashboardResults.completedQuestionsBySupervisor /
                                    dashboardResults.totalQuestionsBySupervisor) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleGreenStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" added //ADDED ON 28/11/2023 BY POOBALAN
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null &&
                            dashboardResults.totalQuestionsBySupervisor !== 0 &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              null
                              ? Math.round(
                                  (dashboardResults.completedQuestionsBySupervisor /
                                    dashboardResults.totalQuestionsBySupervisor) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !== null
                              ? `${dashboardResults.completedQuestionsBySupervisor}/${dashboardResults.totalQuestionsBySupervisor}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 0,
                          padding: 0,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Completed
                      </Text>
                    </View>

                    {/* Not completed in time checklist status */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "CHECKLISTS_BY_SUPERVISOR_NOT_COMPLETED_IN_TIME",
                            appBarTitle: "Checklists not completed in time",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.completedQuestionsBySupervisor != 0
                              ? Math.round(
                                  (dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor /
                                    dashboardResults.completedQuestionsBySupervisor) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleRedStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              null &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              0 &&
                            dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor !==
                              undefined &&
                            dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null
                              ? Math.round(
                                  (dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor /
                                    dashboardResults.completedQuestionsBySupervisor) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor !==
                              undefined &&
                            dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor !==
                              null &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null
                              ? `${dashboardResults.numberOfQuestionsNotCompletedInTimeBySupervisor}/${dashboardResults.completedQuestionsBySupervisor}`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 0,
                          padding: 0,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Delayed
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 0,
                          padding: 0,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        completion
                      </Text>
                    </View>

                    {/* Overdue checklist status */}
                    <View style={{ padding: 3 }}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            lastRouteName: props.navigation.state.routeName,
                            dashboardDetailType:
                              "OVERDUE_CHECKLISTS_BY_SUPERVISOR",
                            appBarTitle: "My checklists - Overdue",
                            sourceOfData: "CURRENT",
                            formType: "CHECKLIST",
                          };
                          navigate("DashboardDetail", opsxProps);
                        }}
                      >
                        <ProgressCircle
                          percent={
                            dashboardResults.totalQuestionsBySupervisor -
                              dashboardResults.completedQuestionsBySupervisor !=
                            0
                              ? Math.round(
                                  (dashboardResults.numberOfOverdueQuestionsBySupervisor /
                                    (dashboardResults.totalQuestionsBySupervisor -
                                      dashboardResults.completedQuestionsBySupervisor)) *
                                    100
                                )
                              : 0
                          }
                          radius={37}
                          borderWidth={5}
                          color={progressCircleRedStatusColor}
                          shadowColor="#f2e6d9"
                          bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor="#fff"  ADDED
                        >
                          <Text
                            style={{
                              fontSize: 15,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              null &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              null &&
                            dashboardResults.totalQuestionsBySupervisor -
                              dashboardResults.completedQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              0
                              ? Math.round(
                                  (dashboardResults.numberOfOverdueQuestionsBySupervisor /
                                    (dashboardResults.totalQuestionsBySupervisor -
                                      dashboardResults.completedQuestionsBySupervisor)) *
                                    100
                                )
                              : 0}
                            {"%"}
                          </Text>
                          <Text
                            style={{
                              fontSize: 10,
                              color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                            }}
                          >
                            {dashboardResults &&
                            dashboardResults.numberOfOverdueQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.numberOfOverdueQuestionsBySupervisor !==
                              null &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.totalQuestionsBySupervisor !==
                              null &&
                            dashboardResults.completedQuestionsBySupervisor !==
                              undefined &&
                            dashboardResults.completedQuestionsBySupervisor !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                              null
                              ? `${
                                  dashboardResults.numberOfOverdueQuestionsBySupervisor
                                }/${
                                  dashboardResults.totalQuestionsBySupervisor -
                                  dashboardResults.completedQuestionsBySupervisor
                                }`
                              : "0/0"}
                          </Text>
                        </ProgressCircle>
                      </TouchableOpacity>
                      <Text
                        style={{
                          fontSize: 10,
                          textAlign: "center",
                          margin: 0,
                          padding: 0,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                          //REMOVE
                        }}
                      >
                        Overdue
                      </Text>
                    </View>
                  </View>
                </View>
              </Tooltip>
            </>
          ) : null}

          {/* Section for task  and checklist dashboard status - ENDS */}

          {/* History summary dashboard code - STARTS */}
          {ckhisdashVisible ? (
            <Tooltip
              isVisible={showSummaryDashboardTooltip}
              allowChildInteraction={false}
              content={
                <>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text style={{ fontWeight: "bold" }}>
                      Summary of tasks and checklists from last 7 days
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text>
                      Shows graph of statuses of tasks from reporting employees,
                      your tasks and checklists worked in the last 7 days.
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                  <View>
                    <Text>
                      Pressing on the graphs in this section will not give
                      detailed information.
                    </Text>
                  </View>
                  <Divider style={{ margin: 3 }} />
                </>
              }
              onClose={() => {
                setShowSummaryDashboardTooltip(false);
              }}
              placement="top"
            >
              <View
                style={{
                  flexDirection: "column",
                  flex: 1,
                  borderWidth: 0.5,
                  borderBottomWidth: 3,
                  borderColor:
                    currentMode === "dark" ? "#1d1b1e" : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED

                  backgroundColor:
                    currentMode === "dark" ? "#424242" : "#FFFFFF", //ADDED ADDED ON 28/11/2023 BY POOBALAN
                  // backgroundColor: "#FFFFFF",
                  marginVertical: 3,
                  borderRadius: 10,
                  marginHorizontal: 8,
                  height: 420,
                }}
              >
                <View
                  style={{
                    flex: 0.06,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor:
                      currentMode === "dark"
                        ? "#1d1b1e"
                        : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED ON 28/11/2023 BY POOBALAN
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                  }}
                >
                  <Text
                    style={{
                      color:
                        currentMode === "dark" ? "white" : cardHeaderTextColor, // cardHeaderTextColor
                    }}
                  >
                    Summary - Last{" "}
                    {historyDashboardResults.numberOfDays
                      ? historyDashboardResults.numberOfDays
                      : 0}{" "}
                    days
                  </Text>
                </View>
                {/* Checklist summary */}
                <View
                  style={{
                    flex: 0.06,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  <Text
                    style={{
                      color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                    }} //REMOVE
                  >
                    Checklist
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.25,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  {/* Completed checklist summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalChecklists != 0
                          ? Math.round(
                              (historyDashboardResults.completedChecklists /
                                historyDashboardResults.totalChecklists) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalChecklists !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalChecklists !== null &&
                        historyDashboardResults.totalChecklists !== 0 &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null
                          ? Math.round(
                              (historyDashboardResults.completedChecklists /
                                historyDashboardResults.totalChecklists) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalChecklists !== undefined &&
                        historyDashboardResults.totalChecklists !== null
                          ? `${historyDashboardResults.completedChecklists}/${historyDashboardResults.totalChecklists}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        height: 30,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                  </View>

                  {/* Incomplete checklist summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalChecklists != 0
                          ? Math.round(
                              (historyDashboardResults.incompleteChecklists /
                                historyDashboardResults.totalChecklists) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalChecklists !== undefined &&
                        historyDashboardResults.totalChecklists !== null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalChecklists !== 0
                          ? Math.round(
                              (historyDashboardResults.incompleteChecklists /
                                historyDashboardResults.totalChecklists) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black", //ADDED ON 28/11/2023 BY POOBALAN
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalChecklists !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalChecklists !== null
                          ? `${
                              historyDashboardResults.incompleteChecklists || 0
                            }/${historyDashboardResults.totalChecklists || 0}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        height: 30,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Incomplete
                    </Text>
                  </View>

                  {/* Completed in time checklist summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedChecklists != 0
                          ? Math.round(
                              (historyDashboardResults.checklistsCompletedInTime /
                                historyDashboardResults.completedChecklists) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedChecklists !== 0 &&
                        historyDashboardResults.checklistsCompletedInTime !==
                          undefined &&
                        historyDashboardResults.checklistsCompletedInTime !==
                          null
                          ? Math.round(
                              (historyDashboardResults.checklistsCompletedInTime /
                                historyDashboardResults.completedChecklists) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.checklistsCompletedInTime !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.checklistsCompletedInTime !==
                          null &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null
                          ? `${historyDashboardResults.checklistsCompletedInTime}/${historyDashboardResults.completedChecklists}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      in time
                    </Text>
                  </View>

                  {/* Not completed in time checklist summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedChecklists != 0
                          ? Math.round(
                              (historyDashboardResults.checklistsNotCompletedInTime /
                                historyDashboardResults.completedChecklists) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedChecklists !== 0 &&
                        historyDashboardResults.checklistsNotCompletedInTime !==
                          undefined &&
                        historyDashboardResults.checklistsNotCompletedInTime !==
                          null
                          ? Math.round(
                              (historyDashboardResults.checklistsNotCompletedInTime /
                                historyDashboardResults.completedChecklists) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.checklistsNotCompletedInTime !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.checklistsNotCompletedInTime !==
                          null &&
                        historyDashboardResults.completedChecklists !==
                          undefined &&
                        historyDashboardResults.completedChecklists !== null
                          ? `${historyDashboardResults.checklistsNotCompletedInTime}/${historyDashboardResults.completedChecklists}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Delayed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      completion
                    </Text>
                  </View>
                </View>
                {/* Tasks summary */}
                <View
                  style={{
                    flex: 0.06,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  <Text
                    style={{
                      color: currentMode === "dark" ? "white" : "black",
                      //REMOVE
                    }}
                  >
                    {" "}
                    My tasks
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.25,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  {/* Completed task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalTasks != 0
                          ? Math.round(
                              (historyDashboardResults.completedTasks /
                                historyDashboardResults.totalTasks) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalTasks !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalTasks !== null &&
                        historyDashboardResults.totalTasks !== 0 &&
                        historyDashboardResults.completedTasks !== undefined &&
                        historyDashboardResults.completedTasks !== null
                          ? Math.round(
                              (historyDashboardResults.completedTasks /
                                historyDashboardResults.totalTasks) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasks !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedTasks !== null &&
                        historyDashboardResults.totalTasks !== undefined &&
                        historyDashboardResults.totalTasks !== null
                          ? `${historyDashboardResults.completedTasks}/${historyDashboardResults.totalTasks}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                  </View>

                  {/* Incomplete task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalTasks != 0
                          ? Math.round(
                              (historyDashboardResults.incompleteTasks /
                                historyDashboardResults.totalTasks) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalTasks !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalTasks !== null &&
                        historyDashboardResults.totalTasks !== 0 &&
                        historyDashboardResults.incompleteTasks !== undefined &&
                        historyDashboardResults.incompleteTasks !== null
                          ? Math.round(
                              (historyDashboardResults.incompleteTasks /
                                historyDashboardResults.totalTasks) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.incompleteTasks !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.incompleteTasks !== null &&
                        historyDashboardResults.totalTasks !== undefined &&
                        historyDashboardResults.totalTasks !== null
                          ? `${historyDashboardResults.incompleteTasks}/${historyDashboardResults.totalTasks}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Incomplete
                    </Text>
                  </View>

                  {/* Completed in time task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedTasks != 0
                          ? Math.round(
                              (historyDashboardResults.tasksCompletedInTime /
                                historyDashboardResults.completedTasks) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasks !== undefined && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedTasks !== null &&
                        historyDashboardResults.completedTasks !== 0 &&
                        historyDashboardResults.tasksCompletedInTime !==
                          undefined &&
                        historyDashboardResults.tasksCompletedInTime !== null
                          ? Math.round(
                              (historyDashboardResults.tasksCompletedInTime /
                                historyDashboardResults.completedTasks) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.tasksCompletedInTime !==
                          undefined &&
                        historyDashboardResults.tasksCompletedInTime !== null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedTasks !== undefined &&
                        historyDashboardResults.completedTasks !== null
                          ? `${historyDashboardResults.tasksCompletedInTime}/${historyDashboardResults.completedTasks}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      in time
                    </Text>
                  </View>

                  {/* Not completed in time task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedTasks != 0
                          ? Math.round(
                              (historyDashboardResults.tasksNotCompletedInTime /
                                historyDashboardResults.completedTasks) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasks !== undefined &&
                        historyDashboardResults.completedTasks !== null &&
                        historyDashboardResults.completedTasks !== 0 &&
                        historyDashboardResults.tasksNotCompletedInTime !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.tasksNotCompletedInTime !== null
                          ? Math.round(
                              (historyDashboardResults.tasksNotCompletedInTime /
                                historyDashboardResults.completedTasks) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.tasksNotCompletedInTime !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.tasksNotCompletedInTime !==
                          null &&
                        historyDashboardResults.completedTasks !== undefined &&
                        historyDashboardResults.completedTasks !== null
                          ? `${historyDashboardResults.tasksNotCompletedInTime}/${historyDashboardResults.completedTasks}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Delayed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      completion
                    </Text>
                  </View>
                </View>
                {/* Tasks - Reporting employees */}
                <View
                  style={{
                    flex: 0.06,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  <Text
                    style={{
                      color: currentMode === "dark" ? "white" : "black",
                      //REMOVE
                    }}
                  >
                    Tasks - Reporting employees
                  </Text>
                </View>
                <View
                  style={{
                    flex: 0.25,
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    // backgroundColor: "#CCE6FF",
                  }}
                >
                  {/* Completed employee task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalTasksByReportingEmployees !=
                        0
                          ? Math.round(
                              (historyDashboardResults.completedTasksByReportingEmployees /
                                historyDashboardResults.totalTasksByReportingEmployees) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.totalTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          null &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          0 &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          null
                          ? Math.round(
                              (historyDashboardResults.completedTasksByReportingEmployees /
                                historyDashboardResults.totalTasksByReportingEmployees) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          null &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          null
                          ? `${historyDashboardResults.completedTasksByReportingEmployees}/${historyDashboardResults.totalTasksByReportingEmployees}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                  </View>

                  {/* Incomplete employee task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.totalTasksByReportingEmployees !=
                        0
                          ? Math.round(
                              (historyDashboardResults.incompleteTasksByReportingEmployees /
                                historyDashboardResults.totalTasksByReportingEmployees) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.totalTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          null &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          0
                          ? Math.round(
                              (historyDashboardResults.incompleteTasksByReportingEmployees /
                                historyDashboardResults.totalTasksByReportingEmployees) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.incompleteTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.incompleteTasksByReportingEmployees !==
                          null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.totalTasksByReportingEmployees !==
                          null
                          ? `${historyDashboardResults.incompleteTasksByReportingEmployees}/${historyDashboardResults.totalTasksByReportingEmployees}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Incomplete
                    </Text>
                  </View>

                  {/* Completed in time employee task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedTasksByReportingEmployees !=
                        0
                          ? Math.round(
                              (historyDashboardResults.tasksCompletedInTimeByReportingEmployees /
                                historyDashboardResults.completedTasksByReportingEmployees) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleGreenStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} //bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          0
                          ? Math.round(
                              (historyDashboardResults.tasksCompletedInTimeByReportingEmployees /
                                historyDashboardResults.completedTasksByReportingEmployees) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.tasksCompletedInTimeByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.tasksCompletedInTimeByReportingEmployees !==
                          null &&
                        historyDashboardResults.completedTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          null
                          ? `${historyDashboardResults.tasksCompletedInTimeByReportingEmployees}/${historyDashboardResults.completedTasksByReportingEmployees}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Completed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      in time
                    </Text>
                  </View>

                  {/* Not completed in time employee task summary */}
                  <View style={{ padding: 3 }}>
                    <ProgressCircle
                      percent={
                        historyDashboardResults.completedTasksByReportingEmployees !=
                        0
                          ? Math.round(
                              (historyDashboardResults.tasksNotCompletedInTimeByReportingEmployees /
                                historyDashboardResults.completedTasksByReportingEmployees) *
                                100
                            )
                          : 0
                      }
                      radius={37}
                      borderWidth={5}
                      color={progressCircleRedStatusColor}
                      shadowColor="#f2e6d9"
                      bgColor={currentMode === "dark" ? "grey" : "white"} // bgColor="#fff" ADDED
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          null && //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          0
                          ? Math.round(
                              (historyDashboardResults.tasksNotCompletedInTimeByReportingEmployees /
                                historyDashboardResults.completedTasksByReportingEmployees) *
                                100
                            )
                          : 0}
                        {"%"}
                      </Text>
                      <Text
                        style={{
                          fontSize: 10,
                          color: currentMode === "dark" ? "white" : "black",
                        }}
                      >
                        {historyDashboardResults &&
                        historyDashboardResults.tasksNotCompletedInTimeByReportingEmployees !==
                          undefined &&
                        historyDashboardResults.tasksNotCompletedInTimeByReportingEmployees !==
                          null &&
                        historyDashboardResults.completedTasksByReportingEmployees !== //ADDED BY POOBALAN ON 13/12/2023 CHANGING NAN
                          undefined &&
                        historyDashboardResults.completedTasksByReportingEmployees !==
                          null
                          ? `${historyDashboardResults.tasksNotCompletedInTimeByReportingEmployees}/${historyDashboardResults.completedTasksByReportingEmployees}`
                          : "0/0"}
                      </Text>
                    </ProgressCircle>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      Delayed
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        textAlign: "center",
                        color: currentMode === "dark" ? "white" : "black",
                        //REMOVE
                      }}
                    >
                      completion
                    </Text>
                  </View>
                </View>
              </View>
            </Tooltip>
          ) : null}

          {/* History summary dashboard code - ENDS */}

          {/* Admin tasks and add task */}
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              paddingHorizontal: 5,
              height: 140,
            }}
          >
            {adminVisible ? (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderBottomWidth: 3,
                    borderColor:
                      currentMode === "dark"
                        ? "#1d1b1e"
                        : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED
                    //backgroundColor: "#FFFFFF", REMOVE
                    margin: 3,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    navigate("Admin");
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/* <Image
                  style={home_style.image}
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/2965/2965279.png",
                  }}
                  resizeMode="center"
                /> */}
                    <View
                      style={{
                        flex: 0.2,
                        justifyContent: "center",
                        width: "100%",
                        backgroundColor:
                          currentMode === "dark"
                            ? "#1d1b1e"
                            : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          // fontSize: 18,
                          textAlign: "center",
                          color:
                            currentMode === "dark"
                              ? "white"
                              : cardHeaderTextColor, //cardHeaderTextColor,
                          // paddingBottom: 10,
                        }}
                      >
                        Admin tasks
                      </Text>
                    </View>
                    <View style={{ flex: 0.8, justifyContent: "center" }}>
                      <Avatar.Icon size={80} icon="cog-outline" />
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ) : null}
            {/* Executive dashboard tile */}
            {execdashVisible ? (
              <>
                <TouchableOpacity
                  style={{
                    flexDirection: "row",
                    flex: 0.5,
                    borderWidth: 0.5,
                    borderBottomWidth: 3,
                    borderColor:
                      currentMode === "dark"
                        ? "#1d1b1e"
                        : cardHeaderBorderColor, //cardHeaderBorderColor, ADDED
                    // backgroundColor: "#FFFFFF", REMOVE
                    margin: 3,
                    borderRadius: 10,
                  }}
                  onPress={() => {
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      snackBarText: "",
                    };
                    navigate("ExecutiveDashboard", opsxProps);
                  }}
                >
                  <View
                    style={{
                      flexDirection: "column",
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        flex: 0.2,
                        justifyContent: "center",
                        width: "100%",
                        backgroundColor:
                          currentMode === "dark"
                            ? "#1d1b1e"
                            : cardHeaderBackgroundColor, //cardHeaderBackgroundColor, ADDED
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                      }}
                    >
                      <Text
                        style={{
                          // fontSize: 18,
                          textAlign: "center",
                          color:
                            currentMode === "dark"
                              ? "white"
                              : cardHeaderTextColor, //cardHeaderTextColor,
                          // paddingBottom: 10,
                        }}
                      >
                        Executive Dashboard
                      </Text>
                    </View>
                    <View style={{ flex: 0.8, justifyContent: "center" }}>
                      <Avatar.Icon size={80} icon="chart-bar" />
                    </View>
                  </View>
                </TouchableOpacity>
              </>
            ) : null}
          </View>
        </ScrollView>
        {/* code for FAB starts */}
        {cwaddtaskVisible ? (
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? "minus" : "plus"}
              actions={[
                {
                  icon: "playlist-plus",
                  label: "Add Task",
                  onPress: () => {
                    console.log("Clicked add task");
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      addItem: "TASK",
                    };
                    navigate("AddTask", opsxProps);
                  },
                  small: false,
                },
                {
                  icon: "clipboard-check",
                  label: "Add Checklist",
                  onPress: () => {
                    console.log("Clicked add checklist");
                    opsxProps = {
                      lastRouteName: props.navigation.state.routeName,
                      addItem: "CHECKLIST",
                    };
                    navigate("AddTask", opsxProps);
                  },
                  small: false,
                },
              ]}
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        ) : null}
        {/* code for FAB ends */}

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
      </Provider>
    </>
  );
};

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
  },
  tasksAndChecklistsTouchableOpacity: {
    flex: 0.5,
    borderWidth: 0.5,
    borderBottomWidth: 3,
    borderColor: cardHeaderBorderColor,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    height: 140,
    marginHorizontal: 3,
  },
  tasksAndChecklistsView: {
    flexDirection: "column",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tasksAndChecklistsPercentText: {
    fontSize: 18,
  },
  tasksAndChecklistsInnerText: {
    fontSize: 12,
  },
  tasksAndChecklistsOuterText: {
    fontSize: 18,
    textAlign: "center",
    paddingTop: 10,
  },
  badge: {
    position: "relative",
    color: "white", // ADD ON 27/11/2023 BY POOBALAN
    backgroundColor: "red", // ADD ON 27/11/2023 BY POOBALAN
    // top: 1,
    // right: 80,
    // left: 310,
    bottom: 29,
    right: 20,
  },
});

export default HomeScreen;
