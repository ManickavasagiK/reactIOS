import React, { useContext, useEffect, useState } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableHighlight,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Avatar,
  Button,
  Modal,
  Portal,
  TextInput,
  Snackbar,
  Divider,
} from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useAddTaskResults from "../hooks/useAddTaskResults";
import { SearchBar } from "react-native-elements";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
const AddTaskScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  const [
    addTaskToWorkbench,
    addTaskResponse,
    getDataToAddTask,
    dataToAddTaskResponse,
    errorMessage,
  ] = useAddTaskResults();

  const [facilityMasterDtoList, setFacilityMasterDtoList] = useState([]);
  const [taskAndQuestionDetailsDtoList, setTaskAndQuestionDetailsDtoList] =
    useState([]);
  const [employeeIdAndNameDtoList, setEmployeeIdAndNameDtoList] = useState([]);
  const [supervisorNumberAndNameDtoList, setSupervisorNumberAndNameDtoList] =
    useState([]);
  const [isGetDataLoading, setIsGetDataLoading] = useState(true);

  const containerStyle = {
  //  backgroundColor: "white",
    // padding: 10,
    width: "80%",
    height: 400,
    borderRadius: 10,
  };
  const [modalVisible, setModalVisible] = React.useState(false);
  const [modalHeader, setModalHeader] = useState();
  const [flatListData, setFlatListData] = useState([]);
  const [flatListTextColor, setFlatListTextColor] = useState("black");
  const [textInputMode, setTextInputMode] = useState("outlined");
  const [textInputDense, setTextInputDense] = useState(true);
  const [textInputMaxLength, setTextInputMaxLength] = useState(40);
  const [renderItemType, setRenderItemType] = useState("");

  let opsxProps = {};

  // Variables for searching
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  // Tooltip variables
  const [showFacilityTooltip, setShowFacilityToolTip] = useState(false);

  // Text input state variables
  const [companyCode, setCompanyCode] = useState("");
  const [businessUnitCode, setBusinessUnitCode] = useState("");
  const [divisionCode, setDivisionCode] = useState("");
  const [wingCode, setWingCode] = useState("");
  const [blockCode, setBlockCode] = useState("");
  const [floorCode, setFloorCode] = useState("");
  const [areaCode, setAreaCode] = useState("");
  const [facilityCode, setFacilityCode] = useState("");
  const [taskCode, setTaskCode] = useState("");
  const [questionCode, setQuestionCode] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState(0);
  const [supervisorNumber, setSupervisorNumber] = useState(0);
  const [taskDate, setTaskDate] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [checklistEndTime, setChecklistEndTime] = useState("");

  // Text input display
  const [companyCodeDisplay, setCompanyCodeDisplay] = useState("");
  const [businessUnitCodeDisplay, setBusinessUnitCodeDisplay] = useState("");
  const [divisionCodeDisplay, setDivisionCodeDisplay] = useState("");
  const [wingCodeDisplay, setWingCodeDisplay] = useState("");
  const [blockCodeDisplay, setBlockCodeDisplay] = useState("");
  const [floorCodeDisplay, setFloorCodeDisplay] = useState("");
  const [areaCodeDisplay, setAreaCodeDisplay] = useState("");
  const [facilityCodeDisplay, setFacilityCodeDisplay] = useState("");
  const [taskCodeDisplay, setTaskCodeDisplay] = useState("");
  const [questionCodeDisplay, setQuestionCodeDisplay] = useState("");
  const [employeeNumberDisplay, setEmployeeNumberDisplay] = useState("");
  const [supervisorNumberDisplay, setSupervisorNumberDisplay] = useState("");

  // Date picker state variables
  const today = new Date();
  const [tempDate, setTempDate] = useState(today);
  const [dateTimePickerDisplayMode, setDateTimePickerDisplayMode] =
    useState("time");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  //validation
  const [isFieldValidationFailed, setIsFieldValidationFailed] = useState(false);
  const [validationFailedColor, setValidationFailedColor] = useState("#ff6666");

  // SnackBar
  const [snackBarText, setSnackBarText] = useState("");
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  //Added by poobalan for Dark and light Mode Theme
  const currentMode = getCurrentAppearanceMode();
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };

  const showModal = () => {
    console.log("Showing Modal");
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalHeader("");
    setModalVisible(false);
  };
  // item for flatlist implementation
  const Item = ({ id, title }) => {
    return (
      <TouchableHighlight
      
      style={[
        styles.item,
        //Added by poobalan for Dark and light Mode Theme
        { backgroundColor: currentMode === "dark" ? "gray" : "#f0e6ff" },
        //{ color: currentMode === "dark" ? "white" : "black" }, //ADDED
      ]}
        activeOpacity={0.6}
        underlayColor={"#8833ff"}
        onPress={() => {
          console.log(id + " - " + title);
          if (renderItemType === "EMPLOYEE") {
            setEmployeeNumberDisplay(id.toString() + " - " + title);
            setEmployeeNumber(id); // employee number is an integer
            if (props.navigation.state.params.addItem === "TASK") {
              // console.log(token.content);
              setSupervisorNumberDisplay(
                token.content.employeeNumber +
                  " - " +
                  token.content.firstName +
                  " " +
                  token.content.lastName
              );
              setSupervisorNumber(token.content.employeeNumber);
            }
          } else if (renderItemType === "SUPERVISOR") {
            setSupervisorNumberDisplay(id.toString() + " - " + title);
            setSupervisorNumber(id); // supervisor number is an integer
          } else if (renderItemType === "TASK") {
            setTaskCodeDisplay(id.toString() + " - " + title);
            setTaskCode(id.toString());
            for (let i = 0; i < flatListData.length; i++) {
              if (flatListData[i].taskCode === id) {
                setQuestionCodeDisplay(
                  flatListData[i].questionCode +
                    " - " +
                    flatListData[i].questionDescription
                );
                setQuestionCode(flatListData[i].questionCode);
              }
            }
            // console.log(flatListData);
          } else if (renderItemType === "CHECKLIST_QUESTION") {
            setQuestionCodeDisplay(id.toString() + " - " + title);
            setQuestionCode(id.toString());
            for (let i = 0; i < flatListData.length; i++) {
              if (flatListData[i].questionCode === id) {
                setTaskCodeDisplay(
                  flatListData[i].taskCode +
                    " - " +
                    flatListData[i].taskDescription
                );
                // setQuestionCode(flatListData[i].taskCode);
                setTaskCode(flatListData[i].taskCode);
              }
            }
          } else if (renderItemType === "FACILITY") {
            setFacilityCodeDisplay(id.toString() + " - " + title);
            setFacilityCode(id.toString());
            for (let i = 0; i < flatListData.length; i++) {
              if (flatListData[i].facilityCode === id) {
                setCompanyCodeDisplay(
                  flatListData[i].companyId +
                    " - " +
                    flatListData[i].companyName
                );
                setCompanyCode(flatListData[i].companyId);

                setBusinessUnitCodeDisplay(
                  flatListData[i].businessUnitCode +
                    " - " +
                    flatListData[i].businessUnitName
                );
                setBusinessUnitCode(flatListData[i].businessUnitCode);

                setDivisionCodeDisplay(
                  flatListData[i].divisionCode +
                    " - " +
                    flatListData[i].divisionName
                );
                setDivisionCode(flatListData[i].divisionCode);

                setWingCodeDisplay(
                  flatListData[i].wingCode + " - " + flatListData[i].wingName
                );
                setWingCode(flatListData[i].wingCode);

                setBlockCodeDisplay(
                  flatListData[i].blockCode + " - " + flatListData[i].blockName
                );
                setBlockCode(flatListData[i].blockCode);

                setFloorCodeDisplay(
                  flatListData[i].floorCode + " - " + flatListData[i].floorName
                );
                setFloorCode(flatListData[i].floorCode);

                setAreaCodeDisplay(
                  flatListData[i].areaCode + " - " + flatListData[i].areaName
                );
                setAreaCode(flatListData[i].areaCode);
              }
            }
          }
          hideModal();
          setSearchValue("");
        }}
      >
                <Text
          style={{ color: currentMode === "dark" ? "white" : "black" }} //ADDED
        >
{title}</Text>
      </TouchableHighlight>
    );
  };

  const renderItem = ({ item }) =>
    renderItemType === "EMPLOYEE" ? (
      <Item id={item.employeeId} title={item.employeeName} />
    ) : renderItemType === "SUPERVISOR" ? (
      <Item id={item.supervisorNumber} title={item.supervisorName} />
    ) : renderItemType === "TASK" ? (
      <Item id={item.taskCode} title={item.taskDescription} />
    ) : renderItemType === "CHECKLIST_QUESTION" ? (
      <Item id={item.questionCode} title={item.questionDescription} />
    ) : renderItemType === "FACILITY" ? (
      <Item id={item.facilityCode} title={item.facilityName} />
    ) : null;

  useEffect(() => {
    console.log("UE1");
    // console.log(new Date());
    validateToken();
    getDataToAddTask(token.jwt);
    setTaskDate(convertDatetoYYYYMMDD(today));

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
    if (dataToAddTaskResponse.facilityMasterDtoList) {
      setFacilityMasterDtoList(dataToAddTaskResponse.facilityMasterDtoList);

      setTaskAndQuestionDetailsDtoList(
        dataToAddTaskResponse.taskAndQuestionDetailsDtoList
      );

      setEmployeeIdAndNameDtoList(
        dataToAddTaskResponse.employeeIdAndNameDtoList
      );

      setSupervisorNumberAndNameDtoList(
        dataToAddTaskResponse.supervisorNumberAndNameDtoList
      );

      //   console.log(
      //     "facilityMasterDtoList : " +
      //       JSON.stringify(dataToAddTaskResponse.facilityMasterDtoList[0])
      //   );

      //   console.log(
      //     "taskAndQuestionDetailsDtoList : " +
      //       JSON.stringify(dataToAddTaskResponse.taskAndQuestionDetailsDtoList[0])
      //   );

      //   console.log(
      //     "employeeIdAndNameDtoList : " +
      //       JSON.stringify(dataToAddTaskResponse.employeeIdAndNameDtoList)
      //   );

      //   console.log(
      //     "supervisorNumberAndNameDtoList : " +
      //       JSON.stringify(dataToAddTaskResponse.supervisorNumberAndNameDtoList)
      //   );

      setIsGetDataLoading(false);
    }
  }, [dataToAddTaskResponse]);

  useEffect(() => {
    console.log("UE3");
    if (isGetDataLoading === false) {
      // State variables like facility info, questions info, employee and supervisor info are available for use here
      //   console.log(facilityMasterDtoList);
    }
  }, [isGetDataLoading]);

  useEffect(() => {
    console.log("UE4");
    // This function will be called when there is change to state variable in props
    // console.log(props.navigation.state);
  }, [props.navigation.state]);

  useEffect(() => {
    console.log("UE5");
    // This function will be called when there is a response after adding task to workbench
    if (addTaskResponse.status === 200) {
      opsxProps = {
        lastRouteName: props.navigation.state.routeName,
        snackBarText:
          props.navigation.state.params.addItem === "TASK"
            ? "Success! Task added."
            : props.navigation.state.params.addItem === "CHECKLIST"
            ? "Success! Checklist added."
            : null,
      };
      navigate("HomePage", opsxProps);
    }
  }, [addTaskResponse]);

  useEffect(() => {
    console.log("Error : " + errorMessage);
    if (errorMessage) {
      setSnackBarText("Something wrong... Contact administrator.");
      setSnackBarVisible(true);
    }
  }, [errorMessage]);

  const searchFunction = (text) => {
    // console.log("Array Holder = " + JSON.stringify(searchFunctionArrayHolder));
    const updatedData = searchFunctionArrayHolder.filter((item) => {
      var item_data = [],
        text_data = "";
      if (renderItemType === "EMPLOYEE") {
        if (item) {
          console.log(item);
          item_data = `${item.employeeName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.employeeName}`;
          text_data = text;
        }
      } else if (renderItemType === "SUPERVISOR") {
        if (item) {
          item_data = `${item.supervisorName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.supervisorName}`;
          text_data = text;
        }
      } else if (renderItemType === "TASK") {
        if (item) {
          item_data = `${item.taskDescription.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.taskDescription}`;
          text_data = text;
        }
      } else if (renderItemType === "CHECKLIST_QUESTION") {
        if (item) {
          item_data = `${item.questionDescription.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.questionDescription}`;
          text_data = text;
        }
      } else if (renderItemType === "FACILITY") {
        if (item) {
          item_data = `${item.facilityName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.facilityName}`;
          text_data = text;
        }
      }

      return item_data.indexOf(text_data) > -1;
    });

    setFlatListData(updatedData);
    setSearchValue(text);
  };

  // Date picker function STARTS

  // ### functions fo new date time picker - 05-AUG-2022 - START
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    // console.warn("A date has been picked: ", date);
    if (activeDateTimeField === "TASK_END_TIME") {
      setTaskEndTime(convertDateToTimeString(date));
    } else if (activeDateTimeField === "CHECKLIST_END_TIME") {
      setChecklistEndTime(convertDateToTimeString(date));
    } else if (activeDateTimeField === "TASK_DATE") {
      setTaskDate(convertDatetoYYYYMMDD(date));
    }
    hideDatePicker();
  };
  // ### functions fo new date time picker - 05-AUG-2022 - END

  // Commented three functions below as new date time picker is used. 05-AUG-2022

  // const changeSelectedDate = (event, selectedDate) => {
  //   // const currentDate = selectedDate || tempDate;
  //   const currentDate = selectedDate;
  //   // Following line of code prevents date picker being triggered
  //   // for another time even after clicking on OK
  //   setShowDateTimePicker(Platform.OS === "ios");
  //   if (currentDate !== undefined) {
  //     if (activeDateTimeField === "TASK_END_TIME") {
  //       setTaskEndTime(convertDateToTimeString(currentDate));
  //     } else if (activeDateTimeField === "CHECKLIST_END_TIME") {
  //       setChecklistEndTime(convertDateToTimeString(currentDate));
  //     }
  //     console.log("Before: selected date = " + currentDate);
  //     setTempDate(currentDate);
  //     console.log("After: selected date = " + currentDate);
  //     // setShowDateTimePicker(false);
  //   } else {
  //     setShowDateTimePicker(false);
  //   }
  //   // setShowDateTimePicker(false);
  // };

  // const showMode = (currentMode) => {
  //   console.log("inside showMode function...");
  //   setShowDateTimePicker(true);
  //   setDateTimePickerDisplayMode(currentMode);
  // };

  // const displayTimepicker = () => {
  //   showMode("time");
  // };

  const checkTime = (i) => {
    return i < 10 ? "0" + i : i;
  };

  const convertDateToTimeString = (date) => {
    console.log(date);
    try {
      let h = checkTime(date.getHours()),
        m = checkTime(date.getMinutes()),
        s = checkTime(date.getSeconds());
      console.log(h + ":" + m + ":" + s);
      return h + ":" + m + ":" + s;
    } catch (err) {
      console.log(err);
    }
  };

  const convertDatetoYYYYMMDD = (date) => {
    try {
      let dd = checkTime(date.getDate()),
        mm = checkTime(date.getMonth() + 1),
        yyyy = date.getFullYear();
      console.log(yyyy + "-" + mm + "-" + dd);
      return yyyy + "-" + mm + "-" + dd;
    } catch (err) {
      console.log(err);
    }
  };

  // Date picker function ENDS

  const submitAddTask = () => {
    var checklistWorkbenchDto = {
      checklistWorkbenchNumber: 0,
      lineNumber: 0,
      employeeTaskRosterNumber: 0,
      companyStructureAndQuestionMappingNumber: 0,
      companyCode: companyCode,
      businessUnitCode: businessUnitCode,
      divisionCode: divisionCode,
      wingCode: wingCode,
      blockCode: blockCode,
      floorCode: floorCode,
      areaCode: areaCode,
      facilityCode: facilityCode,
      jobType: "",
      jobStep: 0,
      taskCode: taskCode,
      questionCode: questionCode,
      taskDate: taskDate,
      shiftCode: "",
      taskStartTime: taskEndTime,
      taskEndTime: taskEndTime,
      employeeNumber: employeeNumber,
      supervisorNumber: supervisorNumber,
      assetUsed: "",
      checklistEndTime: checklistEndTime,
      taskStatus: "PENDING",
      isTaskCompletedOnTime: "",
      checklistStatus: "PENDING",
      isCompletedOnTime: "",
      checklistComments: "",
      additionalNumber01: 0,
      additionalNumber02: 0,
      additionalNumber03: 0,
      additionalText01: "",
      additionalText02: "",
      additionalText03: "",
      additionalDate01: "",
      additionalDate02: "",
      additionalDate03: "",
      lastUpdatedBy: 0,
      lastUpdatedDate: "",
      lastUpdatedTime: "",
      lastUpdatedApplication: "TEST_APP",
      lastUpdatedMachine: "SAMSUNG", //TODO
    };

    // console.log(checklistWorkbenchDto);
    if (
      checklistWorkbenchDto.facilityCode !== "" &&
      checklistWorkbenchDto.taskCode !== "" &&
      checklistWorkbenchDto.questionCode !== "" &&
      // checklistWorkbenchDto.employeeNumber > 0 && // While creating checklist, employee number will be left blank
      checklistWorkbenchDto.supervisorNumber > 0 &&
      checklistWorkbenchDto.taskDate !== "" &&
      checklistWorkbenchDto.taskEndTime !== "" &&
      checklistWorkbenchDto.checklistEndTime !== ""
    ) {
      addTaskToWorkbench(token.jwt, checklistWorkbenchDto);
      // console.log("addTaskResponse : " + JSON.stringify(addTaskResponse));
    } else {
      console.log("Required fields cannot be blank");
      setIsFieldValidationFailed(true);
      setSnackBarText("Highlighted fields need valid data...");
      setSnackBarVisible(true);
    }
  };

  return (
    <>
      <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}

        <TouchableOpacity
          onPress={() => navigate("HomePage")}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={24}
          color={currentMode === "dark" ? "white" : "black"}
          />
          {/* Added by poobalan for dark and light mode theme */}
        </TouchableOpacity>

        <Appbar.Content
          title={
            props.navigation.state.params.addItem === "TASK"
              ? "Add task"
              : props.navigation.state.params.addItem === "CHECKLIST"
              ? "Add checklist"
              : null
          }
        />
        <Appbar.Action
          icon="information-outline"
          onPress={() => {
            setShowFacilityToolTip(true);
          }}
        />
      </Appbar.Header>

      <SafeAreaView>
        <Portal>
          <Modal
            visible={modalVisible}
            onDismiss={hideModal}
            dismissable={true}
            contentContainerStyle={[
              containerStyle,
              {
                backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",
              },
            ]}

            style={{ alignItems: "center", borderColor: "#fff" }}
          >
                       <View
              style={{
                height: 40,
                //Added by poobalan for Dark and light Mode Theme
                backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff", ADDED
                alignItems: "center",
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
                padding: 10,
              }}
            >

              <Text style={{ color: "#fff", fontSize: 15 }}>{modalHeader}</Text>
            </View>
            <SearchBar
              placeholder="Type here to search"
              lightTheme
            //  round
              containerStyle={{
                backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //"white", Added by poobalan for Dark and light Mode Theme

                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                paddingHorizontal: 10,
                marginTop:4
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
              // keyExtractor={(item) => item.employeeId}
              keyExtractor={(item, index) => index.toString()}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="on-drag"
              contentContainerStyle={{
                paddingHorizontal: 10,
              }}
            />
          </Modal>
        </Portal>
      </SafeAreaView>
      {/* Commented the following component to use DateTimePickerModal */}
      {/* {showDateTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode={dateTimePickerDisplayMode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
        />
      )} */}

      {/* Date time picker modal - 05-AUG-2022 */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={dateTimePickerDisplayMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
      >
        <SafeAreaView >
          <View style={{
              backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",
            }}>
          {/* //Added by poobalan for Dark and light Mode Theme */}
          <View style={styles.textInputContainer}>

              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Company"
                placeholder="Company"
                value={companyCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("COMPANY");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setCompanyCodeDisplay(text)}
               // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Business Unit"
                placeholder="Business Unit"
                value={businessUnitCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("BUSINESS_UNIT");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setBusinessUnitCodeDisplay(text)}
               // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Division"
                placeholder="Division"
                value={divisionCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("DIVISION");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setDivisionCodeDisplay(text)}
                //outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Wing"
                placeholder="Wing"
                value={wingCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("WING");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setWingCodeDisplay(text)}
               // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Block"
                placeholder="Block"
                value={blockCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("BLOCK");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setBlockCodeDisplay(text)}
              // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Floor"
                placeholder="Floor"
                value={floorCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("FLOOR");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setFloorCodeDisplay(text)}
                // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Area"
                placeholder="Area"
                value={areaCodeDisplay}
                editable={false}
                // FOR FUTURE USE
                // right={
                //   <TextInput.Icon
                //     name="binoculars"
                //     onPressIn={() => {
                //       setFlatListData(facilityMasterDtoList);
                //       setRenderItemType("AREA");
                //       setModalVisible(true);
                //     }}
                //   />
                // }
                onChangeText={(text) => setAreaCodeDisplay(text)}
                // outlineColor="#6200ee"
              />
            </View>
            <View style={styles.textInputContainer}>
              <Tooltip
                isVisible={showFacilityTooltip}
                content={
                  <>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text style={{ fontWeight: "bold" }}>
                        Select predefined values:
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Press icon{" "}
                        <Avatar.Icon size={20} icon="reorder-horizontal" /> to
                        the right of the text fields to select from list of
                        options.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                    <View>
                      <Text>
                        Facility, Task, Checklist, Employee, Supervisor, Task
                        date, Task end time and Checklist end time are mandatory
                        fields and they cannot be left blank while saving.
                      </Text>
                    </View>
                    <Divider style={{ margin: 3 }} />
                  </>
                }
                onClose={() => {
                  setShowFacilityToolTip(false);
                }}
                placement="top"
              >
                <View></View>
              </Tooltip>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Facility"
                placeholder="Facility"
                value={facilityCodeDisplay}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    onPressIn={() => {
                      setFlatListData(facilityMasterDtoList);
                      setSearchFunctionArrayHolder(facilityMasterDtoList);
                      setRenderItemType("FACILITY");
                      setModalHeader("Select a facility");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setFacilityCodeDisplay(text)}
               // outlineColor="#6200ee"
                style={
                  isFieldValidationFailed && facilityCodeDisplay == ""
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                multiline={true}
                label="Task"
                placeholder="Task"
                value={taskCodeDisplay}
                editable={false}
                right={
                  props.navigation.state.params.addItem === "TASK" ? (
                    <TextInput.Icon
                      icon="reorder-horizontal"
                      onPressIn={() => {
                        setFlatListData(taskAndQuestionDetailsDtoList);
                        setSearchFunctionArrayHolder(
                          taskAndQuestionDetailsDtoList
                        );
                        setRenderItemType("TASK");
                        setModalHeader("Select a task");
                        setModalVisible(true);
                      }}
                    />
                  ) : null
                }
                onChangeText={(text) => setTaskCodeDisplay(text)}
              //  outlineColor="#6200ee"
                style={
                  isFieldValidationFailed &&
                  taskCodeDisplay == "" &&
                  props.navigation.state.params.addItem === "TASK"
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                multiline={true}
                label="Checklist Question"
                placeholder="Checklist Question"
                value={questionCodeDisplay}
                editable={false}
                right={
                  props.navigation.state.params.addItem === "CHECKLIST" ? (
                    <TextInput.Icon
                      icon="reorder-horizontal"
                      onPressIn={() => {
                        setFlatListData(taskAndQuestionDetailsDtoList);
                        setSearchFunctionArrayHolder(
                          taskAndQuestionDetailsDtoList
                        );
                        setRenderItemType("CHECKLIST_QUESTION");
                        setModalHeader("Select a checklist item");
                        setModalVisible(true);
                      }}
                    />
                  ) : null
                }
                onChangeText={(text) => setQuestionCodeDisplay(text)}
               // outlineColor="#6200ee"
                style={
                  isFieldValidationFailed &&
                  questionCodeDisplay == "" &&
                  props.navigation.state.params.addItem === "CHECKLIST"
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Employee"
                placeholder="Employee"
                value={employeeNumberDisplay}
                editable={false}
                right={
                  props.navigation.state.params.addItem === "TASK" ? (
                    <TextInput.Icon
                      icon="reorder-horizontal"
                      onPressIn={() => {
                        setFlatListData(employeeIdAndNameDtoList);
                        setSearchFunctionArrayHolder(employeeIdAndNameDtoList);
                        setRenderItemType("EMPLOYEE");
                        setModalHeader("Select an employee");
                        setModalVisible(true);
                      }}
                    />
                  ) : null
                }
                onChangeText={(text) => setEmployeeNumberDisplay(text)}
               // outlineColor="#6200ee"
                style={
                  isFieldValidationFailed &&
                  employeeNumberDisplay == "" &&
                  props.navigation.state.params.addItem === "TASK"
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
                //   onPressIn={showModal}
              />
            </View>
            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Supervisor"
                placeholder="Supervisor"
                value={supervisorNumberDisplay}
                editable={false}
                right={
                  props.navigation.state.params.addItem === "CHECKLIST" ? (
                    <TextInput.Icon
                      icon="reorder-horizontal"
                      onPressIn={() => {
                        setFlatListData(supervisorNumberAndNameDtoList);
                        setSearchFunctionArrayHolder(
                          supervisorNumberAndNameDtoList
                        );
                        setRenderItemType("SUPERVISOR");
                        setModalHeader("Select a supervisor");
                        setModalVisible(true);
                      }}
                    />
                  ) : null
                }
                onChangeText={(text) => setSupervisorNumberDisplay(text)}
               // outlineColor="#6200ee"
                style={
                  isFieldValidationFailed &&
                  supervisorNumberDisplay == "" &&
                  props.navigation.state.params.addItem === "CHECKLIST"
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>

            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Task date"
                placeholder="Task Date"
                value={taskDate}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="calendar-range"
                    onPressIn={() => {
                      setActiveDateTimeField("TASK_DATE");
                      setDateTimePickerDisplayMode("date");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setTaskDate(text)}
              //  outlineColor="#6200ee"
                style={
                  isFieldValidationFailed && taskDate == ""
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>

            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Task end time"
                placeholder="Task end time"
                value={taskEndTime}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="timer-outline"
                    onPressIn={() => {
                      setActiveDateTimeField("TASK_END_TIME");
                      setDateTimePickerDisplayMode("time");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setTaskEndTime(text)}
                //outlineColor="#6200ee"
                style={
                  isFieldValidationFailed && taskEndTime == ""
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>

            <View style={styles.textInputContainer}>
              <TextInput
               textColor={currentMode ==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:currentMode==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Checklist end time"
                placeholder="Checklist end time"
                value={checklistEndTime}
                editable={false}
                right={
                  <TextInput.Icon
                    icon="timer-outline"
                    onPressIn={() => {
                      setActiveDateTimeField("CHECKLIST_END_TIME");
                      setDateTimePickerDisplayMode("time");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setChecklistEndTime(text)}
//outlineColor="#6200ee"
                style={
                  isFieldValidationFailed && checklistEndTime == ""
                    ? { backgroundColor: validationFailedColor }
                    : {}
                }
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-around",
                paddingHorizontal: 5,
                paddingVertical: 10,
              }}
            >
              <Button
                style={{ marginLeft: 0 }}
                mode="contained"
                onPress={submitAddTask}
              >
                Submit
              </Button>
              <Button
                style={{ marginLeft: 0 }}
                mode="contained"
                onPress={() => {
                  opsxProps = {
                    lastRouteName: props.navigation.state.routeName,
                    snackBarText:
                      props.navigation.state.params.addItem === "TASK"
                        ? "Add task cancelled by user"
                        : props.navigation.state.params.addItem === "CHECKLIST"
                        ? "Add checklist cancelled by user"
                        : null,
                  };
                  navigate("HomePage", opsxProps);
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </SafeAreaView>
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
    </>
  );
};

const styles = StyleSheet.create({
  item: {
   // backgroundColor: "#f0e6ff",
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 5,
    marginLeft:1,
    marginRight:1
  },
  textInputContainer: { paddingHorizontal: 10, paddingVertical: 2 },
});

export default AddTaskScreen;
