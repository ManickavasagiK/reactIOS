import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import { Col, Row, Grid } from "react-native-easy-grid";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  TouchableHighlight,
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
} from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useTaskResults from "../hooks/useTaskResults";
import Accordion from "react-native-collapsible/Accordion";
import moment from "moment";
import { SearchBar } from "react-native-elements";

const ChecklistScreen = (props) => {
  const {
    state: { token, isTokenValid },
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

  // For eployee and supervisor Modal
  const [modalVisible, setModalVisible] = React.useState(false);
  const [employeeListModalVisible, setEmployeeListModalVisible] =
    useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [flatListData, setFlatListData] = useState({});
  const [employeeNumber, setEmployeeNumber] = useState();
  var employeeNumberForEEUpdate = 0;
  const [supervisorNumber, setSupervisorNumber] = useState();
  const [renderItemType, setRenderItemType] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  const showModal = () => setModalVisible(true);
  const hideModal = () => {
    setSnackBarText("Checklist update cancelled.");
    setModalVisible(false);
    setSnackBarVisible(true);
  };

  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
  };

  const hideEmployeeListModal = () => {
    setEmployeeListModalVisible(false);
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
  const [activeChecklistInfo, setActiveChecklistInfo] = useState({});

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
  const [activeSections, setActiveSections] = useState([]);
  const [employeeList, setEmployeeList] = useState({});
  const [activeChecklistForEEUpdate, setActiveChecklistForEEUpdate] = useState(
    {}
  );
  const [
    indexForEmployeeSupervisorUpdate,
    setIndexForEmployeeSupervisorUpdate,
  ] = useState(0);
  let opsxProps = {};

  // var taskData;
  const [taskData, setTaskData] = useState({});

  useEffect(() => {
    validateToken();
    console.log("UE1");
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    getChecklistBySupervisor(token.jwt);
    // console.log(token.content.employeeNumber);
    getEmployeesBySupervisor(token.jwt, token.content.employeeNumber);
    console.log("UE2");
  }, []);

  useEffect(() => {
    if (checklistList.data) {
      setTaskData(checklistList.data);
      if (checklistList.status === 200) {
        console.log(checklistList.data.length);
        setActivityIndicatorAnimating(false);
        setActivityIndicatorModalVisible(false);
      }
    }
    console.log("UE3");
    // console.log(checklistList.data.length);
    //stop pull to refresh
    setRefreshing(false);

    // console.log(taskData);
  }, [checklistList]);

  useEffect(() => {
    // console.log(props.navigation.state);
    // console.log(props.navigation.state.params);
    if (props.navigation.state.params != undefined) {
      if (
        props.navigation.state.params.picData &&
        props.navigation.state.params.action === "COMPLETED" // comes from camera screen
      ) {
        // TODO - Also check if last route name was 'Camera'
        console.log("Inside if statement to trigger modal to show camera");
        setModalVisible(true);
        setCameraPicData(props.navigation.state.params.picData);
        setActiveChecklistInfo(props.navigation.state.params.workbenchData);
      }
      if (props.navigation.state.params.snackBarText) {
        setSnackBarText(props.navigation.state.params.snackBarText);
        setSnackBarVisible(true);
      }
    }
    console.log("Error message : " + errorMessage);
    console.log("UE4");
  }, [props.navigation.state]);

  useEffect(() => {
    // Code to assign task status to Switch based on workbench record

    // console.log(
    //   "activeChecklistInfo.checklistStatus : " +
    //     JSON.stringify(activeChecklistInfo.checklistStatus)
    // );
    activeChecklistInfo.taskStatus
      ? activeChecklistInfo.taskStatus === "COMPLETED"
        ? setIsTaskCompleted(true)
        : setIsTaskCompleted(false)
      : null;
    // Code to assign checklist status to Switch based on workbench record
    // console.log(
    //   "activeChecklistInfo.checklistStatus : " +
    //     JSON.stringify(activeChecklistInfo.checklistStatus)
    // );
    activeChecklistInfo.checklistStatus
      ? activeChecklistInfo.checklistStatus === "COMPLETED"
        ? setIsChecklistCompleted(true)
        : setIsChecklistCompleted(false)
      : null;

    setTaskComments(activeChecklistInfo.checklistComments);
    console.log("UE5");
  }, [activeChecklistInfo]);

  useEffect(() => {
    // console.log("Task update response : " + JSON.stringify(taskUpdateResponse));
    setModalVisible(false);
    // 16-DEC-2022 - Commented the following 2 lines as loader stops before checklist screen is fully loaded
    // setActivityIndicatorAnimating(false);
    // setActivityIndicatorModalVisible(false);
    setIsTaskCompleted(false);
    setIsChecklistCompleted(false);
    setTaskComments("");

    if (taskUpdateResponse.responseSavedToTable === true) {
      if (taskUpdateResponse.picturesSavedToTable === true) {
        setSnackBarText("Success! Checklist updated with pic.");
      } else {
        setSnackBarText("Success! Checklist updated.");
      }
      setSnackBarVisible(true);
    }

    console.log("UE6");
  }, [taskUpdateResponse]);

  useEffect(() => {
    console.log("UE7");
    if (
      employeesBySupervisorResponse.data &&
      employeesBySupervisorResponse.status === 200
    ) {
      // console.log(employeesBySupervisorResponse.data);
      setEmployeeList(employeesBySupervisorResponse.data);
    }
  }, [employeesBySupervisorResponse]);

  const _renderSectionTitle = (section) => {
    return (
      <View>
        <Text>{section.taskStatus}</Text>
      </View>
    );
  };
  const LeftContent = (props) => <Avatar.Icon {...props} icon="folder" />;

  const RightContent = (section) => {
    // console.log(JSON.stringify(section));
    // if (section.taskStatus === "COMPLETED") {
    //   setTaskIconColor("green");
    // }
    // if (section.checklistStatus === "COMPLETED") {
    //   setChecklistIconColor("green");
    // }
    return (
      <View style={{ paddingRight: 5 }}>
        <MaterialCommunityIcons
          name="alpha-t-circle"
          size={24}
          color={taskIconColor}
        />

        <MaterialCommunityIcons
          name="alpha-c-circle"
          size={24}
          color={checklistIconColor}
        />
      </View>
    );
  };

  const truncateToDecimals = (num, dec) => {
    const calcDec = Math.pow(10, dec);
    return Math.trunc(num * calcDec) / calcDec;
  };

  const countDownTimer = (dateString, timeString) => {
    // console.log(dateString + " " + timeString);
    // var dateTime = new Date(dateString + " " + timeString);
    var dateTime = moment(dateString + "T" + timeString).valueOf();

    // console.log("dateTime : " + dateTime);
    var timeNow = new Date().getTime();
    // console.log("timeNow : " + timeNow);
    var timeRemainingInMiliseconds = dateTime - timeNow;
    // console.log("timeRemaining : " + timeRemainingInMiliseconds);
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
    // The following code throws warning ## Cannot update a component (`TasksScreen`) while rendering a different component (`Accordion`) ##
    // How to handle ?
    // setTaskIconColor("transparent");
    // setChecklistIconColor("transparent");

    // section.taskStatus === "COMPLETED" ? setTaskIconColor("green") : null;
    // section.checklistStatus === "COMPLETED"
    //   ? setChecklistIconColor("green")
    //   : null;

    return (
      <View style={{ paddingHorizontal: 5, paddingTop: 5 }}>
        <Card style={styles.cardHeader}>
          <Card.Title
            title={section.facilityName}
            subtitle={section.questionInLanguage}
            left={LeftContent}
            // right={section.taskStatus === "COMPLETED" ? RightContent : () => {}}
            right={
              section.questionCode
                ? () => (
                    <>
                      <View style={{ paddingRight: 5 }}>
                        <MaterialCommunityIcons
                          name="alpha-t-circle"
                          size={24}
                          color={
                            section.isTaskCompletedOnTime === "YES" &&
                            section.taskStatus === "COMPLETED"
                              ? "green"
                              : section.isTaskCompletedOnTime === "NO" &&
                                section.taskStatus === "COMPLETED"
                              ? "red"
                              : "transparent"
                          }
                        />
                      </View>
                      <View style={{ paddingRight: 5 }}>
                        <MaterialCommunityIcons
                          name="alpha-c-circle"
                          size={24}
                          color={
                            section.isCompletedOnTime === "YES" &&
                            section.checklistStatus === "COMPLETED"
                              ? "green"
                              : section.isCompletedOnTime === "NO" &&
                                section.checklistStatus === "COMPLETED"
                              ? "red"
                              : "transparent"
                          }
                        />
                      </View>
                    </>
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
                      section.doesQuestionRequirePicture === "YES"
                        ? "camera"
                        : "thumb-up"
                    }
                    onPress={() => {
                      console.log(
                        `Update pressed for ${section.questionCode}, ${section.checklistWorkbenchNumber}, ${section.lineNumber}`
                      );
                      // console.log(section);
                      // console.log("Has Permission ? " + hasPermission);
                      // showModal();
                      if (section.doesQuestionRequirePicture === "YES") {
                        opsxProps = {
                          workbenchData: section,
                          lastRouteName: props.navigation.state.routeName,
                        };
                        navigate("Camera", opsxProps);
                      } else {
                        // checklist does not require picture update
                        setActiveChecklistInfo(section);
                        activeChecklistInfo.taskStatus === "COMPLETED"
                          ? setIsTaskCompleted(true)
                          : setIsTaskCompleted(false);
                        activeChecklistInfo.checklistStatus === "COMPLETED"
                          ? setIsChecklistCompleted(true)
                          : setIsChecklistCompleted(false);
                        setTaskComments(activeChecklistInfo.taskComments);
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
                              section.checklistEndTime
                            ).isOverdue === true
                              ? "red"
                              : "#6200ee",
                        }}
                      >
                        {section.checklistStatus === "COMPLETED"
                          ? "DONE"
                          : countDownTimer(
                              section.taskDate,
                              section.checklistEndTime
                            ).isOverdue === false
                          ? countDownTimer(
                              section.taskDate,
                              section.checklistEndTime
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
                      // alignItems: "flex-end",
                      // backgroundColor: "green",
                    }}
                  >
                    {/* <Button
                      mode="text"
                      disabled={false}
                      uppercase={false}
                      onPress={() => {
                        console.log(
                          `Checklist screen: Pic array length = ${section.pictureMetaDataDtoList.length}`
                        );

                        // console.log(pictureList);
                        opsxProps = {
                          pictureMetaDataDtoList:
                            section.pictureMetaDataDtoList,
                          lastRouteName: props.navigation.state.routeName,
                        };
                        navigate("Pictures", opsxProps);
                        // navigate("Pictures", section.pictureMetaDataDtoList);
                      }}
                    >
                      {Object.keys(section.pictureMetaDataDtoList).length > 0
                        ? "Pics (" +
                          Object.keys(section.pictureMetaDataDtoList).length +
                          ")"
                        : null}
                    </Button> */}
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
                              formName: "Checklist Detail",
                            }),
                            navigate("ChecklistDetail", opsxProps))
                          : ((opsxProps = {
                              workbenchData: section,
                              lastRouteName: props.navigation.state.routeName,
                              mode: "ADD",
                              sourceOfData: "CURRENT",
                              formType: "CHECKLIST",
                              formName: "Checklist Detail",
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
                        // console.log(
                        //   `Checklist screen: Pic array length = ${section.pictureMetaDataDtoList.length}`
                        // );

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
            <Title>{section.questionInLanguage}</Title>
            <Grid>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Checklist status : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.checklistStatus}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Checklist date : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.taskDate}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Checklist end time : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.checklistEndTime}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Employee : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 0.7 }}>
                      <Paragraph>{section.employeeAlphaName}</Paragraph>
                    </View>
                    <View
                      style={{
                        flex: 0.3,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          // console.log("Avatar pressed");
                          setRenderItemType("EMPLOYEE");
                          setActiveChecklistForEEUpdate(section); // Helps to pass workbench number and line number for adding employe
                          // console.log(
                          //   "Section :" +
                          //     JSON.stringify(activeChecklistForEEUpdate)
                          // );
                          setFlatListData(employeeList);
                          setSearchFunctionArrayHolder(employeeList);
                          setEmployeeListModalVisible(true);
                          setActiveSections([]);
                        }}
                      >
                        <Avatar.Icon size={20} icon="account" />
                      </TouchableOpacity>
                      {/* <IconButton
                        icon="clipboard-account"
                        color={Colors.red500}
                        size={10}
                        // style={{ justifyContent: "center" }}
                        onPress={() => {
                          setRenderItemType("EMPLOYEE");
                          setActiveChecklistForEEUpdate(section); // Helps to pass workbench number and line number for adding employe
                          // console.log(
                          //   "Section :" +
                          //     JSON.stringify(activeChecklistForEEUpdate)
                          // );
                          setFlatListData(employeeList);
                          setSearchFunctionArrayHolder(employeeList);
                          setEmployeeListModalVisible(true);
                          setActiveSections([]);
                        }}
                      /> */}
                    </View>
                  </View>
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
                    <Text>Picture required ? : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.doesQuestionRequirePicture}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Task completed on time ? : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.isTaskCompletedOnTime}</Paragraph>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Paragraph>
                    <Text>Checklist completed on time ? : </Text>{" "}
                  </Paragraph>
                </Col>
                <Col>
                  <Paragraph>{section.isCompletedOnTime}</Paragraph>
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

  const submitChecklistUpdate = () => {
    console.log("submit task update function called");
    // console.log(activeChecklistInfo);
    var formdata = new FormData();
    try {
      if (activeChecklistInfo) {
        var checklistWorkbenchUserActionDto = {
          checklistWorkbenchNumber:
            activeChecklistInfo.checklistWorkbenchNumber,
          lineNumber: activeChecklistInfo.lineNumber,
          assetUsed: activeChecklistInfo.assetUsed,
          taskStatus: isTaskCompleted ? "COMPLETED" : "PENDING",
          // : activeChecklistInfo.taskStatus, // hard coding this to "PENDING" as the above step
          checklistStatus: isChecklistCompleted ? "COMPLETED" : "PENDING",
          // : activeChecklistInfo.checklistStatus, // hard coding this to "PENDING" as the above step
          supervisorNumber: activeChecklistInfo.supervisorNumber,
          employeeNumber: activeChecklistInfo.employeeNumber,
          checklistComments: taskComments,
          taskDate: activeChecklistInfo.taskDate,
          taskEndTime: activeChecklistInfo.taskEndTime,
          checklistEndTime: activeChecklistInfo.checklistEndTime,
        };

        formdata.append(
          "checklistWorkbenchUserActionDto",
          JSON.stringify(checklistWorkbenchUserActionDto)
        );

        if (
          // props.navigation.state.params.workbenchData
          activeChecklistInfo.doesQuestionRequirePicture === "YES"
        ) {
          var today = new Date();
          var pictureName =
            activeChecklistInfo.questionCode +
            "_" +
            activeChecklistInfo.employeeNumber +
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

        //Following code clears the state variable so that after every picture capture, the old picture is not loaded onto the modal
        // changed 23-FEB-2022 - Need to be tested - Not working
        // setCameraPicData(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // For employee and supervisor update
  const assignEmployeeSupervisorToTask = () => {
    console.log("Assign employee function called");
    // console.log(activeChecklistInfo);

    var formdata = new FormData();
    try {
      var checklistWorkbenchUserActionDto = {
        checklistWorkbenchNumber:
          activeChecklistForEEUpdate.checklistWorkbenchNumber,
        lineNumber: activeChecklistForEEUpdate.lineNumber,
        assetUsed: activeChecklistForEEUpdate.assetUsed,
        taskStatus: activeChecklistForEEUpdate.taskStatus,
        checklistStatus: activeChecklistForEEUpdate.checklistStatus,
        supervisorNumber: activeChecklistForEEUpdate.supervisorNumber,
        employeeNumber: employeeNumberForEEUpdate,
        checklistComments: activeChecklistForEEUpdate.checklistComments,
        taskDate: activeChecklistForEEUpdate.taskDate,
        taskEndTime: activeChecklistForEEUpdate.taskEndTime,
        checklistEndTime: activeChecklistForEEUpdate.checklistEndTime,
      };

      formdata.append(
        "checklistWorkbenchUserActionDto",
        JSON.stringify(checklistWorkbenchUserActionDto)
      );

      // console.log(formdata);
      // console.log(
      //   "active checklist" + JSON.stringify(activeChecklistForEEUpdate)
      // );

      updateTask(token.jwt, formdata);
    } catch (err) {
      console.log(err);
    }
  };

  // Flatlist and search implementation functions : STARTS

  // item for flatlist implementation
  const Item = ({ id, title, checklistWorkbenchNumber, lineNumber }) => {
    return (
      <TouchableHighlight
        style={styles.item}
        activeOpacity={0.6}
        underlayColor={"#8833ff"}
        onPress={() => {
          console.log(id + " - " + title);
          if (renderItemType === "EMPLOYEE") {
            // setEmployeeNumber(id); // employee number is an integer
            employeeNumberForEEUpdate = id;

            // console.log("EmployeeNumber : " + employeeNumberForEEUpdate);

            console.log("Employee update will happen from here");
            console.log(checklistWorkbenchNumber + ";" + lineNumber);
            for (let i = 0; i < taskData.length; i++) {
              if (
                taskData[i].checklistWorkbenchNumber ===
                  checklistWorkbenchNumber &&
                taskData[i].lineNumber === lineNumber
              ) {
                var temp = i;
                setIndexForEmployeeSupervisorUpdate(temp);
                taskData[i].employeeNumber = id;
                taskData[i].employeeAlphaName = title;

                // console.log("index: " + indexForEmployeeSupervisorUpdate);

                // console.log(taskData[i]);
              }
            }
            assignEmployeeSupervisorToTask();
          } else if (renderItemType === "SUPERVISOR") {
            setSupervisorNumber(id); // supervisor number is an integer
          }
          hideEmployeeListModal();
          setSearchValue("");
        }}
      >
        <Text>{title}</Text>
      </TouchableHighlight>
    );
  };

  const renderItem = ({ item }) =>
    renderItemType === "EMPLOYEE" ? (
      <Item
        id={item.employeeId}
        title={item.employeeName}
        checklistWorkbenchNumber={
          activeChecklistForEEUpdate.checklistWorkbenchNumber
        }
        lineNumber={activeChecklistForEEUpdate.lineNumber}
      />
    ) : renderItemType === "SUPERVISOR" ? (
      <Item
        id={item.supervisorId}
        title={item.supervisorName}
        checklistWorkbenchNumber={
          activeChecklistForEEUpdate.checklistWorkbenchNumber
        }
        lineNumber={activeChecklistForEEUpdate.lineNumber}
      />
    ) : null;

  const searchFunction = (text) => {
    // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
    const updatedData = searchFunctionArrayHolder.filter((item) => {
      var item_data = [],
        text_data = "";
      if (renderItemType === "EMPLOYEE") {
        if (item) {
          // console.log(item);
          item_data = `${item.employeeName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.employeeName}`;
          text_data = text;
        }
      } else if (renderItemType === "SUPERVISOR") {
        if (item) {
          // console.log(item);
          item_data = `${item.supervisorName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.supervisorName}`;
          text_data = text;
        }
      }

      return item_data.indexOf(text_data) > -1;
    });

    setFlatListData(updatedData);
    setSearchValue(text);
  };
  // Flatlist and search implementation functions : ENDS

  //Refresh control
  const onRefresh = () => {
    setRefreshing(true);
    getChecklistBySupervisor(token.jwt);
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
            navigate("HomePage", opsxProps);
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Appbar.Content title="My checklist" />
      </Appbar.Header>

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
          {/* Modal to display picture and update checklist */}
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
                Checklist Update
              </Text>
            </View>
            <View style={{ padding: 10 }}>
              {activeChecklistInfo.doesQuestionRequirePicture === "YES" &&
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
                    disabled={false}
                    onValueChange={onToggleChecklistSwitch}
                  />
                </View>
              </View>
              {/* Text input section commented on purpose. No styling for this component in place */}
              {/* <TextInput
                    mode="outlined"
                    label="Comments"
                    disabled={false}
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
                  // height: 35,
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
                    setActivityIndicatorAnimating(true);
                    setActivityIndicatorModalVisible(true);
                    submitChecklistUpdate();
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

        <Portal>
          <Modal
            visible={employeeListModalVisible}
            onDismiss={hideEmployeeListModal}
            dismissable={true}
            contentContainerStyle={containerStyle}
            // style={{ alignItems: "center", borderColor: "#fff", height: 400 }}
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
                Select employee
              </Text>
            </View>
            <SearchBar
              placeholder="Type here to search"
              lightTheme
              round
              containerStyle={{
                backgroundColor: "white",
                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
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
            {/* 22-OCT-2022: Given height 300 to View that encloses Flatlist as I do not 
            want to modify containerStyle. */}
            <View style={{ height: 300 }}>
              <FlatList
                data={flatListData}
                renderItem={renderItem}
                // keyExtractor={(item) => item.employeeId}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                keyboardDismissMode="on-drag"
              />
            </View>
          </Modal>
        </Portal>

        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {checklistList.data != undefined ? (
            checklistList.data.length > 0 ? (
              <Accordion
                underlayColor={"#c299ff"}
                sections={
                  taskData.length > 0
                    ? taskData
                    : checklistList.data
                    ? checklistList.data
                    : []
                }
                // sections={checklistList}
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
                <Text>No pending checklists</Text>
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
  // item: {
  //   backgroundColor: "#f9c2ff",
  //   padding: 20,
  //   marginVertical: 8,
  //   marginHorizontal: 16,
  // },
  item: {
    backgroundColor: "#f0e6ff",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
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

export default ChecklistScreen;
