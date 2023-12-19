import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  BackHandler,
  RefreshControl,
  Platform,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Modal,
  Portal,
  Provider,
  Caption,
  Switch,
  TextInput,
  Snackbar,
  ActivityIndicator,
  Surface,
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useTaskResults from "../hooks/useTaskResults";
import Accordion from "react-native-collapsible/Accordion";
import moment from "moment";

const TasksScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  const [
    getTasksBySupervisor,
    taskList,
    getPicturesByTask,
    pictureList,
    updateTask,
    taskUpdateResponse,
    getChecklistBySupervisor,
    checklistList,
    getEmployeesBySupervisor,
    employeesBySupervisorResponse,
    errorMessage,
  ] = useTaskResults();

  // Refresh control
  const [refreshing, setRefreshing] = useState(false);

  // Declarations for Modal starts

  const [modalVisible, setModalVisible] = React.useState(false);

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setSnackBarText("Task update cancelled.");
    setModalVisible(false);
    setSnackBarVisible(true);
  };

  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
  };

  const containerStyle = {
    backgroundColor: "white",
    padding: 0,
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
  };

  //activity indicator - initial value is true - waits for the api calls to be completed. Changes to false in useEffect.
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(true);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(true);

  const [cameraPicData, setCameraPicData] = useState({});
  const [isTaskCompleted, setIsTaskCompleted] = React.useState(false);
  const [isChecklistCompleted, setIsChecklistCompleted] = React.useState(false);
  const onToggleTaskSwitch = () => setIsTaskCompleted(!isTaskCompleted);
  const onToggleChecklistSwitch = () =>
    setIsChecklistCompleted(!isChecklistCompleted);

  const [taskComments, setTaskComments] = React.useState("");
  const [activeTaskInfo, setActiveTaskInfo] = useState({});

  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };
  const [snackBarText, setSnackBarText] = useState("");

  const [taskIconColor, setTaskIconColor] = useState("green");
  const [checklistIconColor, setChecklistIconColor] = useState("green");

  //Declaration for Modal ends

  const _goBack = () => console.log("Went back");

  let opsxProps = {};

  var taskData;

  useEffect(() => {
    // console.log(props.navigation);
    validateToken();
    // BackHandler.removeEventListener("hardwareBackPress", () => false);
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    getTasksBySupervisor(token.jwt);
  }, []);

  useEffect(() => {
    if (taskList.data) {
      taskData = taskList.data;
      if (taskList.status === 200) {
        console.log(taskList.data.length);
        setActivityIndicatorAnimating(false);
        setActivityIndicatorModalVisible(false);
      }
    }

    // console.log(taskData);

    //refresh control
    setRefreshing(false);
  }, [taskList]);

  useEffect(() => {
    // console.log(props.navigation.state);
    // console.log(props.navigation.state.params);
    if (props.navigation.state.params != undefined) {
      if (
        props.navigation.state.params.picData &&
        props.navigation.state.params.action === "COMPLETED"
      ) {
        setModalVisible(true);
        setCameraPicData(props.navigation.state.params.picData);
        setActiveTaskInfo(props.navigation.state.params.workbenchData);
      }
      if (props.navigation.state.params.snackBarText) {
        setSnackBarText(props.navigation.state.params.snackBarText);
        setSnackBarVisible(true);
      }
    }
    console.log("Error message : " + errorMessage);
  }, [props.navigation.state]);

  useEffect(() => {
    // Code to assign task status to Switch based on workbench record

    console.log(
      "activeTaskInfo.taskStatus : " + JSON.stringify(activeTaskInfo.taskStatus)
    );
    activeTaskInfo.taskStatus
      ? activeTaskInfo.taskStatus === "COMPLETED"
        ? setIsTaskCompleted(true)
        : setIsTaskCompleted(false)
      : null;
    // Code to assign checklist status to Switch based on workbench record
    console.log(
      "activeTaskInfo.checklistStatus : " +
        JSON.stringify(activeTaskInfo.checklistStatus)
    );
    activeTaskInfo.checklistStatus
      ? activeTaskInfo.checklistStatus === "COMPLETED"
        ? setIsChecklistCompleted(true)
        : setIsChecklistCompleted(false)
      : null;

    setTaskComments(activeTaskInfo.checklistComments);
  }, [activeTaskInfo]);

  useEffect(() => {
    // console.log("Task update response : " + JSON.stringify(taskUpdateResponse));
    setModalVisible(false);
    setActivityIndicatorAnimating(false);
    setActivityIndicatorModalVisible(false);
    setIsTaskCompleted(false);
    setIsChecklistCompleted(false);
    setTaskComments("");

    if (
      taskUpdateResponse.picturesSavedToTable === true &&
      taskUpdateResponse.responseSavedToTable === true
    ) {
      setSnackBarText("Success! Task updated.");
      setSnackBarVisible(true);
    }
  }, [taskUpdateResponse]);

  const [activeSections, setActiveSections] = useState([]);

  const _renderSectionTitle = (section) => {
    return (
      <View>
        <Text>{section.taskStatus}</Text>
      </View>
    );
  };

  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  const truncateToDecimals = (num, dec) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  const countDownTimer = (dateString, timeString) => {
    // var dateTime = new Date(dateString + " " + timeString);
    // var timeNow = new Date();
    var dateTime = moment(dateString + "T" + timeString).valueOf();
    var timeNow = new Date().getTime();

    var timeRemainingInMiliseconds = dateTime - timeNow;
    let h, m, s;
    // h = Math.floor(timeRemainingInMiliseconds / 1000 / 60 / 60);
    // m = Math.floor((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60);
    // s = Math.floor(
    //   ((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60
    // );

    h = truncateToDecimals(timeRemainingInMiliseconds / 1000 / 60 / 60, 0);
    m = Math.floor((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60);
    s = Math.floor(
      ((timeRemainingInMiliseconds / 1000 / 60 / 60 - h) * 60 - m) * 60
    );

    // TODO : minus sign comes in between 0 and hour. This needs to be fixed

    h < 10 ? (h = `0${h}`) : (h = `${h}`);
    m < 10 ? (m = `0${m}`) : (m = `${m}`);
    s < 10 ? (s = `0${s}`) : (s = `${s}`);

    // console.log(h + ":" + m + ":" + s);

    var timeRemaining = `${h}:${m}:${s}`;
    // var timeRemainingObject = { timeRemaining: timeRemaining, overdue: false };
    var timeRemainingObject;
    timeRemainingInMiliseconds > 0
      ? (timeRemainingObject = {
          timeRemaining: timeRemaining,
          isOverdue: false,
        })
      : (timeRemainingObject = {
          timeRemaining: timeRemaining,
          isOverdue: true,
        });
    // console.log(timeRemainingObject);
    return timeRemainingObject;
  };

  const _renderHeader = (section) => {
    return (
      <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
        <Card style={styles.cardHeader}>
          <Card.Title
            title={section.facilityName}
            subtitle={section.taskInLanguage}
            left={LeftContent}
            right={
              section.taskStatus === "COMPLETED"
                ? () => (
                    <View style={{ paddingRight: 5 }}>
                      <MaterialCommunityIcons
                        name="alpha-t-circle"
                        size={24}
                        color={
                          section.isTaskCompletedOnTime === "YES"
                            ? "green"
                            : "red"
                        }
                      />
                    </View>
                  )
                : () => {}
            }
          />
          <Card.Actions>
            <Grid>
              <Row>
                <Col size={30}>
                  <Button
                    mode="contained"
                    icon={
                      section.doesTaskRequirePicture === "YES"
                        ? "camera"
                        : "thumb-up"
                    }
                    onPress={() => {
                      console.log(
                        `Update pressed for ${section.taskCode}, ${section.checklistWorkbenchNumber}, ${section.lineNumber}`
                      );
                      // console.log(section);
                      // console.log("Has Permission ? " + hasPermission);
                      // showModal();
                      if (section.doesTaskRequirePicture === "YES") {
                        opsxProps = {
                          workbenchData: section,
                          lastRouteName: props.navigation.state.routeName,
                        };
                        navigate("Camera", opsxProps);
                      } else {
                        // task does not require picture update ; modified : 28-AUG-2022
                        setActiveTaskInfo(section);
                        activeTaskInfo.taskStatus === "COMPLETED"
                          ? setIsTaskCompleted(true)
                          : setIsTaskCompleted(false);
                        activeTaskInfo.checklistStatus === "COMPLETED"
                          ? setIsChecklistCompleted(true)
                          : setIsChecklistCompleted(false);
                        setTaskComments(activeTaskInfo.taskComments);
                        setModalVisible(true);
                      }
                    }}
                  >
                    Update
                  </Button>
                </Col>
                <Col size={30}>
                  <View
                    style={{
                      paddingLeft: 5,
                      backgroundColor: "transparent",
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      alignItems: "center",
                    }}
                  >
                    {/* <Button mode="text" icon="clock" disabled={false}> */}
                    <View style={{ flex: 0.3 }}>
                      <Avatar.Icon size={24} icon="clock" />
                    </View>
                    <View style={{ flex: 0.7 }}>
                      <Text
                        style={{
                          fontSize: 12,
                          fontWeight: "bold",
                          // color: "#6200ee",
                          color:
                            section.checklistStatus !== "COMPLETED" &&
                            countDownTimer(
                              section.taskDate,
                              section.taskEndTime
                            ).isOverdue === true
                              ? "red"
                              : "#6200ee",
                        }}
                      >
                        {section.checklistStatus === "COMPLETED"
                          ? "DONE"
                          : countDownTimer(
                              section.taskDate,
                              section.taskEndTime
                            ).isOverdue === false
                          ? countDownTimer(
                              section.taskDate,
                              section.taskEndTime
                            ).timeRemaining
                          : "OVERDUE"}
                      </Text>
                    </View>
                    {/* </Button> */}
                  </View>
                </Col>
                <Col size={40}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                      alignContent: "center",
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        alignSelf: "center",
                      }}
                      onPress={() => {
                        section.hasDetail
                          ? ((opsxProps = {
                              workbenchData: section,
                              lastRouteName: props.navigation.state.routeName,
                              mode: "EDIT",
                              sourceOfData: "CURRENT",
                              formType: "CHECKLIST",
                              formName: "Task Detail",
                            }),
                            navigate("ChecklistDetail", opsxProps))
                          : ((opsxProps = {
                              workbenchData: section,
                              lastRouteName: props.navigation.state.routeName,
                              mode: "ADD",
                              sourceOfData: "CURRENT",
                              formType: "CHECKLIST",
                              formName: "Task Detail",
                            }),
                            navigate("ChecklistDetail", opsxProps));
                      }}
                    >
                      {section.hasDetail ? (
                        <Avatar.Icon size={24} icon="format-list-bulleted" />
                      ) : (
                        <Avatar.Icon size={24} icon="playlist-plus" />
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{ width: "40%" }}
                      onPress={() => {
                        console.log(
                          `Task screen: Pic array length = ${section.pictureMetaDataDtoList.length}`
                        );

                        // console.log(pictureList);
                        opsxProps = {
                          pictureMetaDataDtoList:
                            section.pictureMetaDataDtoList,
                          lastRouteName: props.navigation.state.routeName,
                          sourceOfData: "CURRENT",
                        };
                        navigate("Pictures", opsxProps);
                        // navigate("Pictures", section.pictureMetaDataDtoList);
                      }}
                    >
                      {Object.keys(section.pictureMetaDataDtoList).length >
                      0 ? (
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View style={{ flex: 0.5, justifyContent: "center" }}>
                            <Avatar.Icon size={24} icon="attachment" />
                          </View>
                          <View style={{ flex: 0.5, justifyContent: "center" }}>
                            <Text>
                              {"(" +
                                Object.keys(section.pictureMetaDataDtoList)
                                  .length +
                                ")"}
                            </Text>
                          </View>
                        </View>
                      ) : null}
                    </TouchableOpacity>
                  </View>
                </Col>
              </Row>
            </Grid>
          </Card.Actions>
        </Card>
      </View>
    );
  };

  const _renderContent = (section) => {
    return (
      <View style={{ paddingHorizontal: 5, paddingTop: 0 }}>
        <Card style={styles.cardContent}>
          <Card.Content>
            <Title>{section.taskInLanguage}</Title>
            <Grid>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Task status : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.taskStatus}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Task date : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.taskDate}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Task end time : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.taskEndTime}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Facility Name : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.facilityName}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Workbench number : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.checklistWorkbenchNumber}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Line number : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.lineNumber}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Completed on time ? : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.isTaskCompletedOnTime}</Paragraph>
                </Col>
              </Row>
            </Grid>
          </Card.Content>
        </Card>
      </View>
    );
  };

  const _updateSections = (activeSections) => {
    setActiveSections(activeSections);
  };

  const submitTaskUpdate = () => {
    console.log("submit task update function called");
    // console.log(activeTaskInfo);
    var formdata = new FormData();
    try {
      if (activeTaskInfo) {
        var checklistWorkbenchUserActionDto = {
          checklistWorkbenchNumber: activeTaskInfo.checklistWorkbenchNumber,
          lineNumber: activeTaskInfo.lineNumber,
          assetUsed: activeTaskInfo.assetUsed,
          taskStatus: isTaskCompleted ? "COMPLETED" : "PENDING",
          checklistStatus: activeTaskInfo.checklistStatus,
          supervisorNumber: activeTaskInfo.supervisorNumber,
          employeeNumber: activeTaskInfo.employeeNumber,
          checklistComments: taskComments,
          taskDate: activeTaskInfo.taskDate,
          taskEndTime: activeTaskInfo.taskEndTime,
          checklistEndTime: activeTaskInfo.checklistEndTime,
        };

        formdata.append(
          "checklistWorkbenchUserActionDto",
          JSON.stringify(checklistWorkbenchUserActionDto)
        );

        if (
          // Commented following line as activeTaskInfo has the necessary data; modifled - 28-AUG-2022
          // props.navigation.state.params.workbenchData.doesTaskRequirePicture ===
          // "YES"
          activeTaskInfo.doesTaskRequirePicture === "YES"
        ) {
          var today = new Date();
          var pictureName =
            activeTaskInfo.taskCode +
            "_" +
            activeTaskInfo.employeeNumber +
            "_" +
            today.toISOString().substring(0, 19) +
            ".jpg";
          formdata.append("pictureFileList", {
            uri: cameraPicData.uri,
            type: "image/jpeg",
            name: pictureName,
            created: today,
          });
        }
        // console.log(formdata);
        updateTask(token.jwt, formdata);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // Refresh control
  const onRefresh = () => {
    setRefreshing(true);
    getTasksBySupervisor(token.jwt);
  };

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
          <Ionicons name="ios-arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Appbar.Content title="My tasks" />
      </Appbar.Header>

      <Portal>
        <Modal
          visible={activityIndicatorModalVisible}
          onDismiss={hideActivityIndicatorModal}
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
            visible={modalVisible}
            onDismiss={hideModal}
            contentContainerStyle={containerStyle}
          >
            <View
              style={{
                height: 40,
                backgroundColor: "#6a00ff",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            >
              <Text
                style={{ alignSelf: "center", paddingTop: 10, color: "white" }}
              >
                Task Update
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              {activeTaskInfo.doesTaskRequirePicture === "YES" &&
              cameraPicData !== null ? ( //do not show pic when checklist does not need pic and pic data variable is null
                <View
                  style={{
                    height: 200,
                    backgroundColor: "transparent",
                    margin: 3,
                  }}
                >
                  <Image
                    style={{
                      height: "100%",
                      resizeMode: "contain",

                      // marginBottom: 10,
                      // padding: 5,

                      borderRadius: 10,
                    }}
                    source={{
                      uri: cameraPicData.uri,
                    }}
                  />
                </View>
              ) : null}
              <View
                style={{
                  height: 70,
                  backgroundColor: "transparent",
                  margin: 3,
                  flexDirection: "row",
                }}
              >
                <View
                  style={{
                    flex: 0.7,
                    flexDirection: "column",
                    justifyContent: "space-around",
                  }}
                >
                  <Caption style={{ fontSize: 15 }}>
                    Is task completed ?
                  </Caption>

                  <Caption style={{ fontSize: 15 }}>
                    Is checklist completed ?
                  </Caption>
                </View>
                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Switch
                    value={isTaskCompleted}
                    onValueChange={onToggleTaskSwitch}
                  />

                  <Switch
                    value={isChecklistCompleted}
                    disabled={true}
                    onValueChange={onToggleChecklistSwitch}
                  />
                </View>
              </View>
              {/* Comments field may be needed in the future. Hence commenting it. Correct styling need be done */}
              {/* <TextInput
                    mode="outlined"
                    label="Comments"
                    disabled={true}
                    value={taskComments}
                    onChangeText={(taskComments) =>
                      setTaskComments(taskComments)
                    }
                    dense={true}
                    // 11-MAR-2022 - Added secureTextEntry and keyboardType to avoid duplicate text printed in few devices
                    secureTextEntry={Platform.OS === "ios" ? false : true}
                    keyboardType={
                      Platform.OS === "ios" ? null : "visible-password"
                    }
                  />
              */}

              <View
                style={{
                  height: 40,
                  backgroundColor: "transparent",
                  margin: 3,
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <Button
                  style={{ marginLeft: 0 }}
                  mode="contained"
                  onPress={() => {
                    submitTaskUpdate();
                    setActivityIndicatorAnimating(true);
                    setActivityIndicatorModalVisible(true);
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
          </Modal>
        </Portal>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Wait for data loaded to taskList and then check length of taskList.data */}
          {taskList.data != undefined ? (
            taskList.data.length > 0 ? (
              <Accordion
                underlayColor={"#c299ff"}
                sections={taskList.data ? taskList.data : []}
                activeSections={activeSections}
                // renderSectionTitle={_renderSectionTitle}
                renderHeader={_renderHeader}
                renderContent={_renderContent}
                onChange={_updateSections}
              />
            ) : (
              <View
                style={{
                  paddingVertical: 20,
                  flex: 1,
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text>No pending tasks</Text>
              </View>
            )
          ) : null}
        </ScrollView>
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
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  cardHeader: {
    borderLeftWidth: 1,
    borderLeftColor: "#3399FF",
    borderBottomWidth: 1,
    borderBottomColor: "#3399FF",
    shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
  cardContent: {
    borderLeftWidth: 1,
    borderLeftColor: "#3399FF",
    borderBottomWidth: 1,
    borderBottomColor: "#006600",
    shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
});

export default TasksScreen;
