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
  SafeAreaView,
  BackHandler,
  RefreshControl,
  Platform,
  Appearance,
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
  FAB,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import Tooltip from "react-native-walkthrough-tooltip";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useTaskResults from "../hooks/useTaskResults";
import Accordion from "react-native-collapsible/Accordion";

import { SearchBar } from "react-native-elements";
import useChecklistDetailResults from "../hooks/useChecklistDetailResults";
import useSystemResults from "../hooks/useSystemResults";
// import DateTimePicker from "@react-native-community/datetimepicker";
import useAddTaskResults from "../hooks/useAddTaskResults";
import useChecklistHistoryResults from "../hooks/useChecklistHistoryResults";
import DateTimePickerModal from "react-native-modal-datetime-picker";

const getCurrentAppearanceMode = () => Appearance.getColorScheme(); ////ADDED ON 27/11/2023 BY POOBALAN
export function formatDateTime(dateString) {
  const taskDate = new Date(dateString);
  //const taskTime = new Date(`1970-01-01T${timeString}`);

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = taskDate.getDate();
  const month = monthNames[taskDate.getMonth()];
  const year = taskDate.getFullYear();

  //const hours = taskTime.getHours();
  //const minutes = taskTime.getMinutes();

 // const ampm = hours >= 12 ? "PM" : "AM";

  //const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

 // const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
 
  // return {
  //      day1:day,
  //      month1:month,
  //      year1:year,
  //      hrs:formattedHours,
  //      mins:formattedMinutes,
  //      ampm1:ampm


  // }

//console.log(day,month,year)

 return `${day} ${month}, ${year} `;
 
 //${formattedHours}:${formattedMinutes} ${ampm}`;
}
export function formatTime(timeString) {
 // const taskDate = new Date(dateString);
  const taskTime = new Date(`1970-01-01T${timeString}`);

  
  

  const hours = taskTime.getHours();
  const minutes = taskTime.getMinutes();

 const ampm = hours >= 12 ? "PM" : "AM";

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

 const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
 
  // return {
  //      day1:day,
  //      month1:month,
  //      year1:year,
  //      hrs:formattedHours,
  //      mins:formattedMinutes,
  //      ampm1:ampm


  // }

//console.log(formattedHours,formattedMinutes,ampm)

 return `${formattedHours}:${formattedMinutes} ${ampm}`;
 
 //${formattedHours}:${formattedMinutes} ${ampm}`;
}


const ChecklistDetailScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  const [
    getTaskDetail,
    taskDetailGetResponse,
    addTaskDetail,
    taskDetailAddResponse,
    addCommentToTask,
    addCommentToTaskResponse,
    getCommentsByTask,
    commentsByTaskGetResponse,
    getABInfoByTypes,
    abInfoByTypeGetResponse,
    errorMessage,
  ] = useChecklistDetailResults();

  const [
    getUdcsForDdList,
    udcsForDdListGetResponse,
    getAccessInformationForRole,
    accessInformationGetResponse,
    systemErrorMessage,
  ] = useSystemResults();

  const [
    addTaskToWorkbench,
    addTaskResponse,
    getDataToAddTask,
    dataToAddTaskResponse,
    //excluded errorMessage due to naming conflict
  ] = useAddTaskResults();

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
   // errorMessage,
    //excluded errorMessage due to naming conflict
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

  const [textInputMode, setTextInputMode] = useState("outlined");
  const [textInputDense, setTextInputDense] = useState(true);
  const [textInputMaxLength, setTextInputMaxLength] = useState(35);

  let opsxProps = {};
  const [udcList, setUdcList] = useState([]);
  const [commentList, setCommentList] = useState([]);

  //modal
  const [modalVisible, setModalVisible] = useState(false);
  const [addCommentModalVisible, setAddCommentModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState();
  const containerStyle = {
    //backgroundColor: "white",
    // padding: 10,
    width: "80%",
    height: 400,
    borderRadius: 10,
  };
  const [checklistComment, setChecklistComment] = useState("");

  //flat list
  const [flatListData, setFlatListData] = useState([]);
  const [renderItemType, setRenderItemType] = useState("");

  // Variables for searching
  const [searchValue, setSearchValue] = useState("");
  const [searchFunctionArrayHolder, setSearchFunctionArrayHolder] = useState(
    []
  );

  // Tooltip variables
  const [showTaskDateTooltip, setShowTaskDateToolTip] = useState(false);
  const [showTaskEndTimeTooltip, setShowTaskEndTimeTooltip] = useState(false);
  const [showChecklistEndTimeTooltip, setShowChecklistEndTimeTooltip] =
    useState(false);
  const [showTaskStatusTooltip, setShowTaskStatusTooltip] = useState(false);
  const [showChecklistStatusTooltip, setShowChecklistStatusTooltip] =
    useState(false);
  const [showEmployeeResponsibleTooltip, setShowEmployeeResponsibleTooltip] =
    useState(false);
  const [
    showSupervisorResponsibleTooltip,
    setShowSupervisorResponsibleTooltip,
  ] = useState(false);
  const [showTypeOfWorkTooltip, setShowTypeOfWorkTooltip] = useState(false);
  const [showCommentButton, setShowCommentButton] = useState(false);

  // Date picker state variables
  const today = new Date();
  const [tempDate, setTempDate] = useState(today);
  const [dateTimePickerDisplayMode, setDateTimePickerDisplayMode] =
    useState("date");
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);
  const [activeDateTimeField, setActiveDateTimeField] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  //Variable and functions for FAB
  const [fabState, setFABState] = React.useState({ open: false });
  const onStateChange = ({ open }) => setFABState({ open });
  const { open } = fabState;

  //activity indicator
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(true);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(true);

  // text input state variables
  const [workbenchData, setWorkbenchData] = useState({});
  const [textInputLabelColor, setTextInputLabelColor] = useState("#A9A9A9");
  const [isTextInputDisabled, setIsTextInputDisabled] = useState(false);

  const [checklistWorkbenchNumber, setChecklistWorkbenchNumber] = useState("");
  const [lineNumber, setLineNumber] = useState("");
  const [typeOfWork, setTypeOfWork] = useState("");
  const [typeOfWorkDescription, setTypeOfWorkDescription] = useState("");
  const [clientNumber, setClientNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [vendorNumber, setVendorNumber] = useState("");
  const [vendorName, setVendorName] = useState("");
  const [priority, setPriority] = useState("");
  const [priorityDescription, setPriorityDescription] = useState("");
  const [escalationStatus, setEscalationStatus] = useState("");
  const [escalationStatusDescription, setEscalationStatusDescription] =
    useState("");
  const [promisedDeliveryDate, setPromisedDeliveryDate] = useState("");
  const [actualDeliveryDate, setActualDeliveryDate] = useState("");
  const [invoiceStatus, setInvoiceStatus] = useState("");
  const [invoiceStatusDescription, setInvoiceStatusDescription] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [paymentStatusDescription, setPaymentStatusDescription] = useState("");
  const [goodsStatus, setGoodsStatus] = useState("");
  const [goodsStatusDescription, setGoodsStatusDescription] = useState("");
  const [isMoneyInvolved, setIsMoneyInvolved] = useState("");
  const [totalValue, setTotalValue] = useState("");
  const [currencyCode, setCurrencyCode] = useState("");
  const [currencyCodeDescription, setCurrencyCodeDescription] = useState("");
  const [typeOfGoods, setTypeOfGoods] = useState("");
  const [typeOfGoodsDescription, setTypeOfGoodsDescription] = useState("");
  const [numberOfGoods, setNumberOfGoods] = useState("");
  const [unitOfMeasure, setUnitOfMeasure] = useState("");
  const [unitOfMeasureDescription, setUnitOfMeasureDescription] = useState("");
  const [checklistWorkbenchCommentsList, setChecklistWorkbenchCommentsList] =
    useState([]);
  const [employeeId, setEmployeeId] = useState(0);
  const [employeeName, setEmployeeName] = useState("");
  const [supervisorNumber, setSupervisorNumber] = useState(0);
  const [supervisorName, setSupervisorName] = useState("");
  const [taskEndTime, setTaskEndTime] = useState("");
  const [checklistEndTime, setChecklistEndTime] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("");
  const [checklistStatus, setChecklistStatus] = useState("");

  // List of employees and supervisors
  const [employeeIdAndNameDtoList, setEmployeeIdAndNameDtoList] = useState([]);
  const [supervisorNumberAndNameDtoList, setSupervisorNumberAndNameDtoList] =
    useState([]);

  // buttons
  const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(false);
  const [isAddCommentDisabled, setIsAddCommentDisabled] = useState(false);

  //picture display
  const [pictureMetaDataDtoList, setPictureMetaDataDtoList] = useState([]);

  // Address Book information
  const [ABList, setABList] = useState([]);
  const [clientList, setClientList] = useState([]);
  const [vendorList, setVendorList] = useState([]);

  //snackbar
  const [snackBarVisible, setSnackBarVisible] = React.useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };
  //Date and time format
  const[displayDate,setDisplaydate]=useState('')
  const [disTasktime,setDisTasktime]=useState('')
  const [disChecktime,setDischecktime]=useState('')
  const showModal = () => {
    console.log("Showing Modal");
    setModalVisible(true);
  };
  const hideModal = () => {
    setModalVisible(false);
    setAddCommentModalVisible(false);
    setChecklistComment("");
    setModalHeader("");
  };
console.log("Checklist Detailed Screen")
//added by vasagi textinput color
const [parsedData,setParsedata]=useState(false)




  useEffect(() => {
    validateToken();
    console.log("Checklist Detail - UE1 - Validate token");
    console.log("Checklist Detailed Screen")
    // add the list of UDCs used in this form
    let ddList = [
      {
        dataDictionaryCode: "typeOfWork",
      },
      {
        dataDictionaryCode: "priority",
      },
      {
        dataDictionaryCode: "escalationStatus",
      },
      {
        dataDictionaryCode: "invoiceStatus",
      },
      {
        dataDictionaryCode: "paymentStatus",
      },
      {
        dataDictionaryCode: "goodsStatus",
      },
      {
        dataDictionaryCode: "isMoneyInvolved",
      },
      {
        dataDictionaryCode: "currencyCode",
      },
      {
        dataDictionaryCode: "typeOfGoods",
      },
      {
        dataDictionaryCode: "unitOfMeasure",
      },
      {
        dataDictionaryCode: "taskStatus",
      },
      {
        dataDictionaryCode: "checklistStatus",
      },
    ];

    //api call to get list of UDCs attached to data dictionary
    getUdcsForDdList(token.jwt, ddList);

    // api call to get list of employees and supervisors
    getDataToAddTask(token.jwt);

    // data preparation for api call to get address book information for clients and vendors
    let ABTypeList = [
      {
        addressBookType: "CLIENT",
      },
      {
        addressBookType: "VENDOR",
      },
    ];

    // api call to get address book information for clients and vendors
    getABInfoByTypes(token.jwt, ABTypeList);

    //handling backpress - should be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Checklist Detail - UE2 - get keys for detail");
    //console.log(props.navigation.state.params.sourceOfData);
    //console.log(props.navigation.state.params.workbenchData);
    // enable or disable save button based on source of data
    // if source of data is HISTORY, disable save button, add comments button and all text fields
    // possible values for sourceOfData are CURRENT and HISTORY
    console.log(props.navigation.state.params.sourceOfData)
    props.navigation.state.params.sourceOfData === "HISTORY"
      ? (setIsSaveButtonDisabled(true),
        setIsAddCommentDisabled(true),
        setIsTextInputDisabled(true))
      : (setIsSaveButtonDisabled(false),
        setIsAddCommentDisabled(false),
        setIsTextInputDisabled(false));

    // console.log(props.navigation.state.params);
    if (props.navigation.state.params.workbenchData) {
      
      setWorkbenchData(props.navigation.state.params.workbenchData);
         setParsedata(true)
      setChecklistWorkbenchNumber(
        props.navigation.state.params.workbenchData.checklistWorkbenchNumber.toString()
      );
      setLineNumber(
        props.navigation.state.params.workbenchData.lineNumber.toString()
      );

      // Assign employee and supervisor details to state variables from props
      // These values can change when there is employee / supervisor reassignment

      setEmployeeId(props.navigation.state.params.workbenchData.employeeId);
      setEmployeeName(
        props.navigation.state.params.workbenchData.employeeAlphaName
      );
      setSupervisorNumber(
        props.navigation.state.params.workbenchData.supervisorNumber
      );
      setSupervisorName(
        props.navigation.state.params.workbenchData.supervisorAlphaName
      );

      // assign task and checklist statuses with loaded workbench data
     

      setTaskStatus(props.navigation.state.params.workbenchData.taskStatus);
      setChecklistStatus(
        props.navigation.state.params.workbenchData.checklistStatus
      );

      // assign task date and end times
    
  //   setTaskDate(props.navigation.state.params.workbenchData.taskDate)
   
      setTaskDate(props.navigation.state.params.workbenchData.taskDate);
   
      setTaskEndTime(props.navigation.state.params.workbenchData.taskEndTime)
      setChecklistEndTime( props.navigation.state.params.workbenchData.checklistEndTime)
      //modified by vasagi for standard time 
       //  setTaskEndTime(formatTime(props.navigation.state.params.workbenchData.taskEndTime));
      // setChecklistEndTime(formatTime(
      //   props.navigation.state.params.workbenchData.checklistEndTime
      // ));
      setDisplaydate(formatDateTime(props.navigation.state.params.workbenchData.taskDate))
      setDisTasktime(formatTime(props.navigation.state.params.workbenchData.taskEndTime))
      setDischecktime(formatTime(
           props.navigation.state.params.workbenchData.checklistEndTime
         ))
      


      // assign picture meta data list
      setPictureMetaDataDtoList(
        props.navigation.state.params.workbenchData.pictureMetaDataDtoList
      );
    }
    else{
      parsedData=null
    }
  }, [props.navigation.state]);

  useEffect(() => {
    console.log("Checklist Detail - UE3 - api call happens here");
    if (
      checklistWorkbenchNumber &&
      lineNumber &&
      props.navigation.state.params.workbenchData.hasDetail
    ) {
      console.log(checklistWorkbenchNumber + " , " + lineNumber);
      // api call to get checklist detail
      // Decide whether to go to checklist work bench (current) table or history table

      if (props.navigation.state.params.sourceOfData === "CURRENT") {
        getTaskDetail(token.jwt, checklistWorkbenchNumber, lineNumber);
      } else if (props.navigation.state.params.sourceOfData === "HISTORY") {
        console.log("Get history information");
        getChecklistHistoryDetail(
          token.jwt,
          checklistWorkbenchNumber,
          lineNumber
        );
      }
    }
  }, [checklistWorkbenchNumber, lineNumber]);

  useEffect(() => {
    console.log(
      "Checklist Detail - UE4 - result from api call get task detail"
    );
    console.log(
      props.navigation.state.params.sourceOfData +
        " + " +
        props.navigation.state.params.formType
    );
    // Following condition assigns data from current table / history table based on condition
    if (
      (taskDetailGetResponse.status === 200 && taskDetailGetResponse.data) ||
      (checklistHistoryDetailResult.status === 200 &&
        checklistHistoryDetailResult.data)
    ) {
      let tempTaskOrChecklistDetail = {};
      if (taskDetailGetResponse.status === 200 && taskDetailGetResponse.data) {
        tempTaskOrChecklistDetail = taskDetailGetResponse.data;
      } else if (
        checklistHistoryDetailResult.status === 200 &&
        checklistHistoryDetailResult.data
      ) {
        tempTaskOrChecklistDetail = checklistHistoryDetailResult.data;
      }

      // console.log(tempTaskOrChecklistDetail);
      // console.log(JSON.stringify(taskDetailGetResponse.data));
      setTypeOfWork(tempTaskOrChecklistDetail.typeOfWork);
     //commented by vasagi for color of test 15/12/23
      setTypeOfWorkDescription(tempTaskOrChecklistDetail.typeOfWorkDescription);
      setClientNumber(tempTaskOrChecklistDetail.clientNumber.toString());
       //commented by vasagi for color of test 15/12/23
     setClientName(tempTaskOrChecklistDetail.clientName);
      setVendorNumber(tempTaskOrChecklistDetail.vendorNumber.toString());
     //commented by vasagi for color of test 15/12/23
     setVendorName(tempTaskOrChecklistDetail.vendorName);
      setPriority(tempTaskOrChecklistDetail.priority);
       //commented by vasagi for color of test 15/12/23
     setPriorityDescription(tempTaskOrChecklistDetail.priorityDescription);
     //commented by vasagi for color of test 15/12/23
      setEscalationStatus(tempTaskOrChecklistDetail.escalationStatus);
      setEscalationStatusDescription(
        tempTaskOrChecklistDetail.escalationStatusDescription
      );
      setPromisedDeliveryDate(tempTaskOrChecklistDetail.promisedDeliveryDate);
      setActualDeliveryDate(tempTaskOrChecklistDetail.actualDeliveryDate);
      setInvoiceStatus(tempTaskOrChecklistDetail.invoiceStatus);
      setInvoiceStatusDescription(
        tempTaskOrChecklistDetail.invoiceStatusDescription
      );
      setPaymentStatus(tempTaskOrChecklistDetail.paymentStatus);
      setPaymentStatusDescription(
        tempTaskOrChecklistDetail.paymentStatusDescription
      );
      setGoodsStatus(tempTaskOrChecklistDetail.goodsStatus);
      setGoodsStatusDescription(
        tempTaskOrChecklistDetail.goodsStatusDescription
      );
      setIsMoneyInvolved(tempTaskOrChecklistDetail.isMoneyInvolved);
      setTotalValue(tempTaskOrChecklistDetail.totalValue.toString());
      setCurrencyCode(tempTaskOrChecklistDetail.currencyCode);
      setCurrencyCodeDescription(
        tempTaskOrChecklistDetail.currencyCodeDescription
      );
      setTypeOfGoods(tempTaskOrChecklistDetail.typeOfGoods);
      setTypeOfGoodsDescription(
        tempTaskOrChecklistDetail.typeOfGoodsDescription
      );
      setNumberOfGoods(tempTaskOrChecklistDetail.numberOfGoods.toString());
      setUnitOfMeasure(tempTaskOrChecklistDetail.unitOfMeasure);
      setUnitOfMeasureDescription(
        tempTaskOrChecklistDetail.unitOfMeasureDescription
      );
      setChecklistWorkbenchCommentsList(
        tempTaskOrChecklistDetail.checklistWorkbenchCommentsList
      );
    }
  }, [taskDetailGetResponse, checklistHistoryDetailResult]);

  useEffect(() => {
    console.log("Checklist Detail UE5 - Error message");
    // TODO trigger snack bar when there is a error
    if (errorMessage) {
      setSnackBarText("Something went wrong");
      setSnackBarVisible(true);
    }
  }, [errorMessage, systemErrorMessage]);

  useEffect(() => {
    console.log("Checklist Detail UE6 : Received UDC list");
    // console.log(udcsForDdListGetResponse);
    if (
      udcsForDdListGetResponse.status === 200 &&
      udcsForDdListGetResponse.data
    )
      setUdcList(udcsForDdListGetResponse.data);
  }, [udcsForDdListGetResponse]);

  useEffect(() => {
    // if checklist is added successfully, navigate back, else stay here
    console.log("Checklist Detail UE7 : Received detail add response");
    console.log(props.navigation.state.params.formType)
    if (taskDetailAddResponse.status === 200) {
      opsxProps = {
        // commented line below to stop endless loop between checklist detail and dashboard detail - 19-AUG-2022
        // lastRouteName: props.navigation.state.routeName,
        snackBarText:
          props.navigation.state.params.formName + " - Changes saved",
        // 22-OCT-2022
        // action prop is "CANCELLED" to control unwanted modal trigger in taskScreen and checklistScreen
        action: "CANCELLED",
      };
      setActivityIndicatorAnimating(false);
      setActivityIndicatorModalVisible(false);
      navigate(props.navigation.state.params.lastRouteName, opsxProps);
    }
  }, [taskDetailAddResponse]);

  useEffect(() => {
    console.log("Checklist Detail UE8 : Received comment add response");
    if (addCommentToTaskResponse.status === 200) {
      hideModal();
      setSnackBarText("Success! Comment added.");
      setSnackBarVisible(true);
      console.log("Getting comments list again");
      // Refresh comment list after adding one comment
      getCommentsByTask(token.jwt, checklistWorkbenchNumber, lineNumber);
    }
  }, [addCommentToTaskResponse]);

  useEffect(() => {
    console.log("Checklist Detail UE9 : Received comment get response");
    if (
      commentsByTaskGetResponse.status === 200 &&
      commentsByTaskGetResponse.data
    ) {
      setChecklistWorkbenchCommentsList(commentsByTaskGetResponse.data);
    }
  }, [commentsByTaskGetResponse]);

  useEffect(() => {
    console.log(
      "Checklist Detail UE10 : Check client and vendor info loaded ?"
    );
    if (abInfoByTypeGetResponse.status === 200) {
      // console.log(abInfoByTypeGetResponse);
      setABList(abInfoByTypeGetResponse.data);
    }
  }, [abInfoByTypeGetResponse]);

  useEffect(() => {
    console.log("Checklist detail UE11: Get employee and supervisor list");
    if (dataToAddTaskResponse.employeeIdAndNameDtoList) {
       console.log(dataToAddTaskResponse.employeeIdAndNameDtoList);
      setEmployeeIdAndNameDtoList(
        dataToAddTaskResponse.employeeIdAndNameDtoList
      );
      // console.log(dataToAddTaskResponse.supervisorNumberAndNameDtoList);
      setSupervisorNumberAndNameDtoList(
        dataToAddTaskResponse.supervisorNumberAndNameDtoList
      );
      // hide activity indicator after screen data loaded in full
      setActivityIndicatorAnimating(false);
      setActivityIndicatorModalVisible(false);
    }
  }, [dataToAddTaskResponse]);

  // Date picker function STARTS

  // ### functions fo new date time picker - 05-AUG-2022 - START
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    console.log("A date has been picked: ", date)
     console.warn("A date has been picked: ", date);
    if (activeDateTimeField === "PROMISED_DELIVERY_DATE") {
      setPromisedDeliveryDate(convertDatetoYYYYMMDD(date));
    } else if (activeDateTimeField === "ACTUAL_DELIVERY_DATE") {
      setActualDeliveryDate(convertDatetoYYYYMMDD(date));
    } else if (activeDateTimeField === "TASK_DATE") {
      setTaskDate(convertDatetoYYYYMMDD(date));
    } else if (activeDateTimeField === "TASK_END_TIME") {
      setTaskEndTime(convertDateToTimeString(date));
    } else if (activeDateTimeField === "CHECKLIST_END_TIME") {
      setChecklistEndTime(convertDateToTimeString(date));
    }
    hideDatePicker();
  };
  // ### functions fo new date time picker - 05-AUG-2022 - END

  // #### Commented the following functions as
  // new component for date time picker is implemented.
  // 05-AUG-2022 ####

  // const changeSelectedDate = (event, selectedDate) => {
  //   // const currentDate = selectedDate || tempDate;
  //   const currentDate = selectedDate;
  //   // Following line of code prevents date picker being triggered
  //   // for another time even after clicking on OK
  //   setShowDateTimePicker(Platform.OS === "ios");
  //   if (currentDate !== undefined) {
  //     if (activeDateTimeField === "PROMISED_DELIVERY_DATE") {
  //       setPromisedDeliveryDate(convertDatetoYYYYMMDD(currentDate));
  //     } else if (activeDateTimeField === "ACTUAL_DELIVERY_DATE") {
  //       setActualDeliveryDate(convertDatetoYYYYMMDD(currentDate));
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
  const currentMode = getCurrentAppearanceMode(); // ADDED ON 27/11/2023 BY POOBALAN
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

  // Activity indicator hide function
  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
    setActivityIndicatorAnimating(false);
  };

  // For employee and supervisor update
  const assignEmployeeAndSupervisorToTask = () => {
    console.log("Assign employee function called");
    // console.log(activeChecklistInfo);

    var formdata = new FormData();
    try {
      var checklistWorkbenchUserActionDto = {
        checklistWorkbenchNumber: workbenchData.checklistWorkbenchNumber,
        lineNumber: workbenchData.lineNumber,
        companyCode: workbenchData.companyCode,
        divisionCode: workbenchData.divisionCode,
        wingCode: workbenchData.wingCode,
        blockCode: workbenchData.blockCode,
        floorCode: workbenchData.floorCode,
        taskCode: workbenchData.taskCode,
        checklistCode: workbenchData.questionCode,
        taskProgress: workbenchData.taskProgress,
        checklistProgress: workbenchData.checklistProgress,
        assetUsed: workbenchData.assetUsed,
        // taskStatus: workbenchData.taskStatus,
        taskStatus:
          taskStatus != workbenchData.taskStatus
            ? taskStatus
            : workbenchData.taskStatus,
        // checklistStatus: workbenchData.checklistStatus,
        checklistStatus:
          checklistStatus != workbenchData.checklistStatus
            ? checklistStatus
            : workbenchData.checklistStatus,
        supervisorNumber:
          supervisorNumber != workbenchData.supervisorNumber
            ? supervisorNumber
            : workbenchData.supervisorNumber,
        employeeNumber:
          employeeId != workbenchData.employeeId
            ? employeeId
            : workbenchData.employeeNumber,
        checklistComments: workbenchData.checklistComments,
        // ##-- taskDate, taskEndTime and checklistEndTime --##
        taskDate:
          taskDate != workbenchData.taskDate
            ? taskDate
            : workbenchData.taskDate,
        taskEndTime:
          taskEndTime != workbenchData.taskEndTime
            ? taskEndTime
            : workbenchData.taskEndTime,
        checklistEndTime:
          checklistEndTime != workbenchData.checklistEndTime
            ? checklistEndTime
            : workbenchData.checklistEndTime,

        taskStartDate: workbenchData.taskStartDate,
        checklistStartDate: workbenchData.checklistStartDate,
        checklistEndDate: workbenchData.checklistEndDate,
        taskStartTime: workbenchData.taskStartTime,
        checklistStartTime: workbenchData.checklistStartTime,
        belongsToProject: workbenchData.belongsToProject,
        isScheduledTask: workbenchData.isScheduledTask,
      };

      formdata.append(
        "checklistWorkbenchUserActionDto",
        JSON.stringify(checklistWorkbenchUserActionDto)
      );

       console.log(formdata);
      // console.log(workbenchData);

      updateTask(token.jwt, formdata);
    } catch (err) {
      console.log(err);
    }
  };

  // Date picker function ENDS
  // 1. In the following line, 'code' can be either dataDictionaryCode or addressBookType
  // 2. And dataList can be udcList or ABList
  // 3. itemType replaced renderItemType here as it takes some time for state variable renderItemType to get its value.
  const prepareFlatListData = (dataList, code, itemType) => {
    console.log(itemType);
    let tempArray = [];
    if (
      itemType === "TYPE_OF_WORK" ||
      itemType === "PRIORITY" ||
      itemType === "ESCALATION_STATUS" ||
      itemType === "INVOICE_STATUS" ||
      itemType === "PAYMENT_STATUS" ||
      itemType === "GOODS_STATUS" ||
      itemType === "IS_MONEY_INVOLVED" ||
      itemType === "CURRENCY_CODE" ||
      itemType === "TYPE_OF_GOODS" ||
      itemType === "UNIT_OF_MEASURE" ||
      itemType === "TASK_STATUS" ||
      itemType === "CHECKLIST_STATUS"
    ) {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].dataDictionaryCode === code) {
          tempArray.push(dataList[i]);
        }
      }
    } else if (itemType === "CLIENT_INFO" || itemType === "VENDOR_INFO") {
      for (let i = 0; i < dataList.length; i++) {
        if (dataList[i].addressBookType === code) {
          tempArray.push(dataList[i]);
        }
      }
    } else if (itemType === "EMPLOYEE" || itemType === "SUPERVISOR") {
      for (let i = 0; i < dataList.length; i++) {
        tempArray.push(dataList[i]);
      }
    }
    // console.log(tempArray);
    setFlatListData(tempArray);
    setSearchFunctionArrayHolder(tempArray);
    // console.log(flatListData);
    // return tempArray;
  };

  const Item = ({
    id,
    title,
    employeeName,
    lastUpdatedDate,
    lastUpdatedTime,
  }) => {
    // console.log(id + ", " + title);
    return (
      <TouchableHighlight
      style={[
        styles.item,
       
        { backgroundColor: currentMode === "dark" ? "gray" : "#f0e6ff" },
        
        //ADDED//Added by poobalan for Dark and light Mode Theme

      ]}

        activeOpacity={0.6}
        underlayColor={"#8833ff"}
        onPress={() => {
          if (renderItemType === "TYPE_OF_WORK") {
            setTypeOfWork(id);
            setTypeOfWorkDescription(title);
           
            hideModal();
          } else if (renderItemType === "PRIORITY") {
            setPriority(id);
            setPriorityDescription(title);
            hideModal();
           
          } else if (renderItemType === "ESCALATION_STATUS") {
            setEscalationStatus(id);
            setEscalationStatusDescription(title);
            hideModal();
          } else if (renderItemType === "INVOICE_STATUS") {
            setInvoiceStatus(id);
            setInvoiceStatusDescription(title);
            hideModal();
          } else if (renderItemType === "PAYMENT_STATUS") {
            setPaymentStatus(id);
            setPaymentStatusDescription(title);
            hideModal();
          } else if (renderItemType === "GOODS_STATUS") {
            setGoodsStatus(id);
            setGoodsStatusDescription(title);
            hideModal();
          } else if (renderItemType === "IS_MONEY_INVOLVED") {
            setIsMoneyInvolved(id);
            hideModal();
          } else if (renderItemType === "CURRENCY_CODE") {
            setCurrencyCode(id);
            setCurrencyCodeDescription(title);
            hideModal();
          } else if (renderItemType === "TYPE_OF_GOODS") {
            setTypeOfGoods(id);
            setTypeOfGoodsDescription(title);
            hideModal();
          } else if (renderItemType === "UNIT_OF_MEASURE") {
            setUnitOfMeasure(id);
            setUnitOfMeasureDescription(title);
            hideModal();
          } else if (renderItemType === "CLIENT_INFO") {
            setClientNumber(id.toString());
            setClientName(title);
            hideModal();
          
          } else if (renderItemType === "VENDOR_INFO") {
            setVendorNumber(id.toString());
            setVendorName(title);
            
            hideModal();
          } else if (renderItemType === "EMPLOYEE") {
            console.log(title);
            setEmployeeId(id.toString());
            setEmployeeName(title);
            hideModal();
          } else if (renderItemType === "SUPERVISOR") {
            console.log(title);
            setSupervisorNumber(id.toString());
            setSupervisorName(title);
            hideModal();
          } else if (renderItemType === "TASK_STATUS") {
            console.log(title);
            setTaskStatus(id);
            hideModal();
          } else if (renderItemType === "CHECKLIST_STATUS") {
            console.log(title);
            setChecklistStatus(id);
            hideModal();
          }

          setSearchValue("");
        }}
      >
        {renderItemType === "COMMENTS" ? (
          <View >
           <Text
            style={{ color: currentMode === "dark" ? "white" : "black" }} //ADDED #424242//Added by poobalan for Dark and light Mode Theme
          >

              
              {title}</Text>
            <View
              style={{
                height: 20,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 0.6 }}>
                <Text
                  style={{
                    fontSize: 9,
                    justifyContent: "flex-start",
                    alignItems: "center",
                    color:currentMode === "dark" ? "white" : "black"
                   // color: "#6200ee",
                  }}
                >
                  {employeeName}
                </Text>
              </View>
              <View
                style={{
                  flex: 0.4,
                  // backgroundColor: "yellow",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontSize: 9, color: currentMode === "dark" ? "white" : "#6200ee" }}>
                  {lastUpdatedDate + " - " + lastUpdatedTime}
                </Text>
              </View>
            </View>
          </View>
        ) : (
          <Text>{title}</Text>
        )}
      </TouchableHighlight>
    );
  };

  const renderItem = ({ item }) => {
    // console.log(item);
    return renderItemType === "TYPE_OF_WORK" ||
      renderItemType === "PRIORITY" ||
      renderItemType === "ESCALATION_STATUS" ||
      renderItemType === "INVOICE_STATUS" ||
      renderItemType === "PAYMENT_STATUS" ||
      renderItemType === "GOODS_STATUS" ||
      renderItemType === "IS_MONEY_INVOLVED" ||
      renderItemType === "CURRENCY_CODE" ||
      renderItemType === "TYPE_OF_GOODS" ||
      renderItemType === "UNIT_OF_MEASURE" ||
      renderItemType === "TASK_STATUS" ||
      renderItemType === "CHECKLIST_STATUS" ? (
      // Adding curly braces fixed displaying record in flatlist
      <Item
        id={item.userDefinedCodeUserCode}
        title={item.userDefinedCodeDescription01}
      />
    ) : renderItemType === "COMMENTS" ? (
      <Item
        id={item.commentId}
        title={item.commentText}
        employeeName={item.employeeName}
        lastUpdatedDate={item.lastUpdatedDate}
        lastUpdatedTime={item.lastUpdatedTime}
        // lastUpdatedTime={item.lastUpdatedTime.substring(
        //   0,
        //   item.lastUpdatedTime.length - 4 // removes milliseconds from time. TODO - Handle this in server
        // )}
      />
    ) : renderItemType === "CLIENT_INFO" || renderItemType === "VENDOR_INFO" ? (
      <Item id={item.addressBookNumber} title={item.addressBookAlphaName} />
    ) : renderItemType === "EMPLOYEE" ? (
      <Item id={item.employeeId} title={item.employeeName} />
    ) : renderItemType === "SUPERVISOR" ? (
      <Item id={item.supervisorNumber} title={item.supervisorName} />
    ) : null;
  };

  const searchFunction = (text) => {
    const updatedData = searchFunctionArrayHolder.filter((item) => {
      var item_data = [],
        text_data = "";
      if (
        renderItemType === "TYPE_OF_WORK" ||
        renderItemType === "PRIORITY" ||
        renderItemType === "ESCALATION_STATUS" ||
        renderItemType === "INVOICE_STATUS" ||
        renderItemType === "PAYMENT_STATUS" ||
        renderItemType === "GOODS_STATUS" ||
        renderItemType === "IS_MONEY_INVOLVED" ||
        renderItemType === "CURRENCY_CODE" ||
        renderItemType === "TYPE_OF_GOODS" ||
        renderItemType === "UNIT_OF_MEASURE" ||
        renderItemType === "TASK_STATUS" ||
        renderItemType === "CHECKLIST_STATUS"
      ) {
        if (item) {
          item_data = `${item.userDefinedCodeDescription01.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.userDefinedCodeDescription01}`;
          text_data = text;
        }
      } else if (renderItemType === "COMMENTS") {
        if (item) {
          item_data = `${item.commentText.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.commentText}`;
          text_data = text;
        }
      } else if (
        renderItemType === "CLIENT_INFO" ||
        renderItemType === "VENDOR_INFO"
      ) {
        if (item) {
          item_data = `${item.addressBookAlphaName.toUpperCase()})`;
          text_data = text.toUpperCase();
        } else {
          item_data = `${item.addressBookAlphaName}`;
          text_data = text;
        }
      } else if (renderItemType === "EMPLOYEE") {
        if (item) {
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
      }
      return item_data.indexOf(text_data) > -1;
    });
    setFlatListData(updatedData);
    setSearchValue(text);
  };

  const submitChecklistDetail = () => {
    let checklistWorkbenchDetail = {
      checklistWorkbenchNumber: checklistWorkbenchNumber,
      lineNumber: lineNumber,
      typeOfWork: typeOfWork,
      clientNumber: clientNumber,
      vendorNumber: vendorNumber,
      priority: priority,
      escalationStatus: escalationStatus,
      promisedDeliveryDate: promisedDeliveryDate,
      actualDeliveryDate: actualDeliveryDate,
      invoiceStatus: invoiceStatus,
      paymentStatus: paymentStatus,
      goodsStatus: goodsStatus,
      isMoneyInvolved: isMoneyInvolved,
      totalValue: totalValue,
      currencyCode: currencyCode,
      typeOfGoods: typeOfGoods,
      numberOfGoods: numberOfGoods,
      unitOfMeasure: unitOfMeasure,
      additionalNumber01: 0,
      additionalNumber02: 0,
      additionalNumber03: 0,
      additionalText01: "",
      additionalText02: "",
      additionalText03: "",
      additionalDate01: "",
      additionalDate02: "",
      additionalDate03: "",
      lastUpdatedBy: "",
      lastUpdatedDate: "",
      lastUpdatedTime: "",
      lastUpdatedApplication: "",
      lastUpdatedMachine: "",
    };

    addTaskDetail(token.jwt, checklistWorkbenchDetail);
  };

  const submitChecklistComment = () => {
    let checklistWorkbenchComments = {
      commentId: null, // DB auto generates id. do not sepcify one.
      checklistWorkbenchNumber: checklistWorkbenchNumber,
      lineNumber: lineNumber,
      employeeNumber: workbenchData.employeeId,
      commentText: checklistComment,
      parentCommentId: 0,
      lastUpdatedBy: "",
      lastUpdatedDate: "",
      lastUpdatedTime: "",
      lastUpdatedApplication: "",
      lastUpdatedMachine: "",
    };

    if (checklistComment !== "") {
      addCommentToTask(token.jwt, checklistWorkbenchComments);
    } else {
      setSnackBarText("Comment cannot be blank");
      setSnackBarVisible(true);
    }
  };

  return (
    <>
    {/* {console.log("data checking")}
    {console.log(parsedData)}
    {console.log(workbenchData)} */}
     {parsedData===true ? (
      
      <View style={{flex:1, backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2",}}>
     
   
    {/* {console.log("--------------------------")}
    {console.log(workbenchData)}
    {console.log("--------------------------")} */}

   {workbenchData?(
    <Appbar.Header>
        {/* <Appbar.Action icon="ios_book" onPress={_goBack} /> */}
       
        <TouchableOpacity
          onPress={() => {
            opsxProps = {
              // 29-JUL-2022 : commenting the following line as custom back button goes in an endles loop
              // lastRouteName: props.navigation.state.routeName,
              snackBarText:
                props.navigation.state.params.formName + " - Changes not saved",
              // 22-OCT-2022
              // action prop is "CANCELLED" to control unwanted modal trigger in taskScreen and checklistScreen
              action: "CANCELLED",
            };
            navigate(props.navigation.state.params.lastRouteName, opsxProps);
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons name="ios-arrow-back" size={25} color={currentMode === "dark" ? "white" : "black"} //ADDED ON 27/11/2023 BY POOBALAN
           />
        </TouchableOpacity>

        <Appbar.Content
          title={
            props.navigation.state.params.formType === "TASK"
              ? "Task Detail"
              : "Checklist Detail"
          }
        />
        <Appbar.Action
          icon="information-outline"
          onPress={() => {
            setShowTaskDateToolTip(true);
            // setShowTypeOfWorkTooltip(true);
          }}
        />
      </Appbar.Header>
   ):( null)}

      


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
            // size="large"
          />
        </Modal>
      </Portal>
      <SafeAreaView>
        <Portal>
          <Modal
          
            visible={modalVisible}
            onDismiss={hideModal}
            dismissable={true}
           // contentContainerStyle={containerStyle}

          //   style={{ alignItems: "center", borderColor: "#fff" }}
          // >
          //Added by poobalan for Dark and light Mode Theme
          contentContainerStyle={[
            containerStyle,
            {
              backgroundColor:
                currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED
            },
          ]}
          style={{ alignItems: "center", borderColor: "#fff" }}
        >
{/* //Added by poobalan for Dark and light Mode Theme */}
               <View
                  style={{
                    height: 40,
                    backgroundColor:
                      currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff", ADDED
                    alignItems: "center",
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 10,
                      borderRadius:0,
                     
                  }}
                >

              <Text style={{ color: "#fff", fontSize: 15 }}>{modalHeader}</Text>
            </View>
            <SearchBar
              placeholder="Type here to search"
             lightTheme
             // round
              containerStyle={{
                //backgroundColor: "white",
                backgroundColor:
                currentMode === "dark" ? "#424242" : "#f2f2f2", //"white",ADDED//Added by poobalan for Dark and light Mode Theme

                borderWidth: 0,
                borderTopWidth: 0,
                borderBottomWidth: 0,
                borderRadius:10,
                padding: 10,
                marginBottom:-2
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
              // data={udcList}
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
        <Portal>
          <Modal
            visible={addCommentModalVisible}
            onDismiss={hideModal}
            dismissable={true}
            //Added by poobalan for Dark and light Mode Theme
            contentContainerStyle={{
              backgroundColor:
                currentMode === "dark" ? "#424242" : "#f2f2f2", //"white",   ADDED
              // padding: 10,
              width: "80%",
              height: 400,
              borderRadius: 10,
              height: 170,
            }}

            style={{ alignItems: "center", borderColor: "#fff" }}
          >
            <View
              style={{
                height: 40,
                backgroundColor:
                currentMode === "dark" ? "#1d1b1e" : "#6a00ff", //"#6a00ff",//Added by poobalan for Dark and light Mode Theme

               // backgroundColor: "#6a00ff",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            >
              <Text
                style={{ alignSelf: "center", paddingTop: 10, color: "white" }}
              >
                Add comment
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "column",
                alignSelf: "center",
                width: "95%",
              }}
            >
              {/* <View style={{ flex: 0.7 }}> */}
              <View style={{ paddingTop: 5 }}>
                <TextInput
                  label="Add Comment (max length is 255)"
                  // style={{ height: 250 }}
                  mode="outlined"
                  maxLength={255}
                  multiline={true}
                  value={checklistComment}
                  onChangeText={(text) => setChecklistComment(text)}
                  // 11-MAR-2022 - Added secureTextEntry and keyboardType to avoid duplicate text printed in few devices
                  secureTextEntry={Platform.OS === "ios" ? false : true}
                  keyboardType={
                    Platform.OS === "ios" ? null : "visible-password"
                  }
                />
              </View>

              <View
                style={{
                  // flex: 0.3,
                  flexDirection: "row",
                  justifyContent: "space-around",
                  padding: 10,
                }}
              >
                <View style={{ flex: 0.5 }}>
                  <Button
                    style={{ width: "95%", alignSelf: "center" }}
                   mode="contained"
                    onPress={() => {
                      submitChecklistComment();
                    }}
                  >
                    Add
                  </Button>
                </View>
                <View style={{ flex: 0.5 }}>
                  <Button
                    style={{ width: "95%", alignSelf: "center" }}
                    mode="contained"
                    onPress={() => {
                      setAddCommentModalVisible(false);
                      setChecklistComment("");
                      setSnackBarText("Comment not added !");
                      setSnackBarVisible(true);
                    }}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </Portal>
      </SafeAreaView>
      {/* {showDateTimePicker && (
        <DateTimePicker
          value={tempDate}
          mode={dateTimePickerDisplayMode}
          is24Hour={true}
          display="default"
          onChange={changeSelectedDate}
        />
      )} */}
      
 <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="on-drag"
       
        
      >
      {/* New Date time picker component 05-AUG-2022 */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={dateTimePickerDisplayMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
     
     
        {/* View for checklist title or header starts here */}
        
      { workbenchData ? (
      
        <View style={{ ...styles.textInputContainer, paddingTop: 10 }}>
          <Card  style={[
                 
                    styles.cardHeader,
                    {
                      backgroundColor:
                        currentMode === "dark" ? "grey" : "white", //ADDED
                    },
                    {
                      borderLeftColor:
                        currentMode === "dark" ? "#1d1b1e" : "#3399FF",
                    },
                    {
                      borderBottomColor:
                        currentMode === "dark" ? "#1d1b1e" : "#3399FF",
                    },
                    {
                      shadowColor:
                        currentMode === "dark" ? "#1d1b1e" : "#3399FF",
                    },
                  ]}
                  elevation={5}
                >

          {/* {console.log("//////////")}
          
          {console.log("=============")}
         {console.log("Entering control")} */}
         {console.log(workbenchData.questionCode)}
            <Card.Title
              title={workbenchData.facilityName}
              //Added by poobalan for Dark and light Mode Theme
              titleStyle={{ fontSize: 25 ,
                color: currentMode === "dark" ? "#1d1b1e" : "black",
              }} 

              
            
              subtitle={
                props.navigation.state.params.formType === "TASK"
                  ? workbenchData.taskInLanguage
                  : workbenchData.questionInLanguage
              }
              subtitleStyle={[
                styles.cardSubtitleStyle,
                { color: currentMode === "dark" ? "#1d1b1e" : "black" },
              ]} //CHANGE THE  COLOR OF CARDSUBTITLESTYLE ADDED ON 27/11/2023 BY POOBALAN

              subtitleNumberOfLines={5}
              rightStyle={{
                // backgroundColor: "green",
                width: 30,
                height: 60,
              }}
              right={
              
                workbenchData.questionCode
                  ? () => (
                      <>
                        <View style={{ paddingRight: 5 }}>
                          <MaterialCommunityIcons
                            name="alpha-t-circle"
                            size={24}
                           
                            color={
                              workbenchData.isTaskCompletedOnTime === "YES" &&
                              workbenchData.taskStatus === "COMPLETED"
                                ? "green"
                                : workbenchData.isTaskCompletedOnTime ===
                                    "NO" &&
                                  workbenchData.taskStatus === "COMPLETED"
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
                              workbenchData.isCompletedOnTime === "YES" &&
                              workbenchData.checklistStatus === "COMPLETED"
                                ? "green"
                                : workbenchData.isCompletedOnTime === "NO" &&
                                  workbenchData.checklistStatus === "COMPLETED"
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
            {/* following view to give space between title and content */}
            <View style={{ height: 15 }}></View>
            {/* card content */}
            <Card.Content style={{marginTop:-15}} >
              <Grid >
                <Row>
                  <Col size={5}>
                    <Paragraph 
                       style={{
                              color:
                                currentMode === "dark" ? "#1d1b1e" : "black",
                            }} // ADDED ON 27/11/2023 BY POOBALAN
                          >

                    
                      <Text>Due date : </Text>{" "}
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    <Paragraph
                      style={{
                              color:
                                currentMode === "dark" ? "#1d1b1e" : "black",
                            }} //ADDED ON 27/11/2023 BY POOBALAN
                          >
  
                    {displayDate}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" &&
                      workbenchData.taskStatus !== "COMPLETED" &&
                      workbenchData.checklistStatus !== "COMPLETED" ? (
                        <TouchableOpacity
                          onPressIn={() => {
                            setActiveDateTimeField("TASK_DATE");
                            setDateTimePickerDisplayMode("date");
                            // setShowDateTimePicker(true);
                            showDatePicker();
                          }}
                        >
                          <Tooltip
                            isVisible={showTaskDateTooltip}
                            content={
                              <>
                                <Divider style={{ margin: 3 }} />
                                <View>
                                  <Text>
                                    Press buttons in this row to change
                                    respective data of a task / checklist.
                                  </Text>
                                </View>
                                <Divider style={{ margin: 3 }} />
                                <View>
                                  <Text>
                                    For example, you can change task / checklist
                                    date by pressing the highlighted button.
                                  </Text>
                                </View>
                                <Divider style={{ margin: 3 }} />
                              </>
                            }
                            onClose={() => {
                              setShowTaskDateToolTip(false);
                              setShowTypeOfWorkTooltip(true);
                            }}
                            placement="left"
                          >
                            <Avatar.Icon size={20} icon="calendar-range" />
                          </Tooltip>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                         style={{
                              color:
                                currentMode === "dark" ? "#1d1b1e" : "black",
                            }} //ADDED ON 27/11/2023 BY POOBALAN
                          >

                      <Text>Task end time : </Text>{" "}
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    <Paragraph
                                 style={{
                                  color:
                                    currentMode === "dark" ? "#1d1b1e" : "black",
                                }} //ADDED ON 27/11/2023 BY POOBALAN
                              >
     
                    
                    {disTasktime}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" &&
                      workbenchData.taskStatus !== "COMPLETED" &&
                      workbenchData.checklistStatus !== "COMPLETED" ? (
                        <TouchableOpacity
                          onPressIn={() => {
                            setActiveDateTimeField("TASK_END_TIME");
                            setDateTimePickerDisplayMode("time");
                            // setShowDateTimePicker(true);
                            showDatePicker();
                          }}
                        >
                          <Avatar.Icon size={20} icon="clock-outline" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                  style={{
                              color:
                                currentMode === "dark" ? "#1d1b1e" : "black",
                            }} //ADDED ON 27/11/2023 BY POOBALAN
                          >
              
                      <Text>Checklist end time : </Text>{" "}
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    <Paragraph
                               style={{
                                color:
                                  currentMode === "dark" ? "#1d1b1e" : "black",
                              }} //ADDED ON 27/11/2023 BY POOBALAN
                            >
      
                    {disChecktime}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" &&
                      workbenchData.taskStatus !== "COMPLETED" &&
                      workbenchData.checklistStatus !== "COMPLETED" ? (
                        <TouchableOpacity
                          onPressIn={() => {
                            setActiveDateTimeField("CHECKLIST_END_TIME");
                            setDateTimePickerDisplayMode("time");
                            // setShowDateTimePicker(true);
                            showDatePicker();
                          }}
                        >
                          <Avatar.Icon size={20} icon="clock-outline" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                             style={{
                                    color:
                                      currentMode === "dark" ? "#1d1b1e" : "black",
                                  }} //ADDED ON 27/11/2023 BY POOBALAN
                                >
                   
                      <Text>Task status : </Text>
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    {/* <Paragraph>{workbenchData.taskStatus}</Paragraph> */}
                    <Paragraph
                              style={{
                                color:
                                  currentMode === "dark" ? "#1d1b1e" : "black",
                              }} //ADDED ON 27/11/2023 BY POOBALAN
                            >
   
                    {taskStatus}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" ? (
                        <TouchableOpacity
                          onPressIn={() => {
                            prepareFlatListData(
                              udcList,
                              "taskStatus",
                              "TASK_STATUS"
                            );
                            setRenderItemType("TASK_STATUS");
                            setModalHeader("Select Task Status");
                            setModalVisible(true);
                          }}
                        >
                          <Avatar.Icon size={20} icon="reorder-horizontal" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                              style={{
                                color:
                                  currentMode === "dark" ? "#1d1b1e" : "black",
                              }} //ADDED ON 27/11/2023 BY POOBALAN
                            >
  
                    
                      <Text>Checklist status : </Text>
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    {/* <Paragraph>{workbenchData.checklistStatus}</Paragraph> */}
                    <Paragraph
                                 style={{
                                  color:
                                    currentMode === "dark" ? "#1d1b1e" : "black",
                                }} //ADDED ON 27/11/2023 BY POOBALAN
                              >
                   
                    
                    {checklistStatus}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" ? (
                        <TouchableOpacity
                          onPressIn={() => {
                            prepareFlatListData(
                              udcList,
                              "checklistStatus",
                              "CHECKLIST_STATUS"
                            );
                            setRenderItemType("CHECKLIST_STATUS");
                            setModalHeader("Select Checklist Status");
                            setModalVisible(true);
                          }}
                        >
                          <Avatar.Icon size={20} icon="reorder-horizontal" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                              style={{
                                color:
                                  currentMode === "dark" ? "#1d1b1e" : "black",
                              }} //ADDED ON 27/11/2023 BY POOBALAN
                            >
  

                      <Text>Employee responsible : </Text>
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    <Paragraph
                             style={{
                              color:
                                currentMode === "dark" ? "#1d1b1e" : "black",
                            }} //ADDED ON 27/11/2023 BY POOBALAN
                          >
     
                    
                    {employeeName}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {/* if screen displayed for history data, do not show employee selection button */}
                      {/* Also if checklist is opened by tasks from home screen, employee selection button should not be visible */}
                      {/* AND employee cannot be changed if task status or checklist status is equal to COMPLETED */}
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" &&
                      workbenchData.taskStatus !== "COMPLETED" &&
                      workbenchData.checklistStatus !== "COMPLETED" ? (
                        <TouchableOpacity
                          onPress={() => {
                            prepareFlatListData(
                              employeeIdAndNameDtoList,
                              "",
                              "EMPLOYEE"
                            );
                            setRenderItemType("EMPLOYEE");
                            setModalHeader("Select employee responsible");
                            setModalVisible(true);
                          }}
                        >
                          <Avatar.Icon size={20} icon="account" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                <Row>
                  <Col size={5}>
                    <Paragraph
                                style={{
                                  color:
                                    currentMode === "dark" ? "#1d1b1e" : "black",
                                }} //ADDED ON 27/11/2023 BY POOBALAN
                              >
                    
                      <Text>Supervisor responsible: </Text>
                    </Paragraph>
                  </Col>
                  <Col size={4.5}>
                    <Paragraph
                           style={{
                                      color:
                                        currentMode === "dark" ? "#1d1b1e" : "black",
                                    }} //ADDED ON 27/11/2023 BY POOBALAN
                                  >
                    
                    
                    
                    
                    {supervisorName}</Paragraph>
                  </Col>
                  <Col size={0.5}>
                    <View style={{ alignItems: "center" }}>
                      {/* if screen displayed for history data, do not show supervisor selection button */}
                      {/* Also if checklist is opened by checklists from home screen, supervisor selection button should not be visible */}
                      {/* AND supervisor cannot be changed if checklist status is COMPLETED */}
                      {props.navigation.state.params.sourceOfData ===
                        "CURRENT" &&
                      props.navigation.state.params.formType !== "TASK" &&
                      props.navigation.state.params.lastRouteName !==
                        "Checklist" &&
                      workbenchData.checklistStatus !== "COMPLETED" ? (
                        <TouchableOpacity
                          onPress={() => {
                            prepareFlatListData(
                              supervisorNumberAndNameDtoList,
                              "",
                              "SUPERVISOR"
                            );
                            setRenderItemType("SUPERVISOR");
                            setModalHeader("Select supervisor responsible");
                            setModalVisible(true);
                          }}
                        >
                          <Avatar.Icon size={20} icon="account" />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </Col>
                </Row>
                {pictureMetaDataDtoList.length > 0 ? (
                  <Row>
                    <Col size={5}>
                      <Paragraph  style={{
                                      color:
                                        currentMode === "dark" ? "#1d1b1e" : "black",
                                    }} //ADDED ON 27/11/2023 BY POOBALAN
                                    >
                        <Text>Attachments: </Text>
                      </Paragraph>
                    </Col>
                    <Col size={5}>
                      <TouchableOpacity
                        onPress={() => {
                          opsxProps = {
                            pictureMetaDataDtoList: pictureMetaDataDtoList,
                            lastRouteName: props.navigation.state.routeName,
                            sourceOfData:
                              props.navigation.state.params.sourceOfData,
                          };
                          navigate("Pictures", opsxProps);
                        }}
                      >
                        <Paragraph
                          style={{
                            color: "blue",
                            textDecorationLine: "underline",
                          }}
                        >
                          Pictures ({pictureMetaDataDtoList.length})
                        </Paragraph>
                      </TouchableOpacity>
                    </Col>
                  </Row>
                ) : null}
              </Grid>
            </Card.Content>
          </Card>
        </View>):null }

       
        {/* View for checklist detail starts here */}
        { workbenchData ? (
        <View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingRight: 5,
              }}
            >
              <TextInput
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                disabled
                label="Checklist Number"
                // placeholder="Checklist Number"
                value={checklistWorkbenchNumber}
                editable={false}
                onChangeText={(text) => setChecklistWorkbenchNumber(text)}
              //  outlineColor="#6200ee"
              />
            </View>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <TextInput
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                disabled
                label="Line Number"
                // placeholder="Line Number"
                value={lineNumber}
                editable={false}
                onChangeText={(text) => setLineNumber(text)}
             //   outlineColor="#6200ee"
              />
            </View>
          </View>
          {/* Type of work section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <Tooltip
                isVisible={showTypeOfWorkTooltip}
                content={
                  <>
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
                  </>
                }
                onClose={() => {
                  setShowTypeOfWorkTooltip(false);
                  setShowCommentButton(true);
                }}
                placement="top"
              >
                {/* A dummy View for tooltip */}
                
              </Tooltip>
              <TextInput
               var c=""
              //   commented by vasagi 15/12/23
                 style={[styles.textInputStyle, { color: currentMode === "dark" 
                
                 ? c="dark"  :  c="light"}]}
                 textColor={c==="dark"?"#00FFFF":"black"}
                 theme={{
                  colors: {
                       onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                  }
              }}
               //  style={{ color: currentMode === "dark" ? "white" : "black" }}
               //  theme={{ colors: { placeholder: textInputLabelColor } }}
             //     textColor={textClr?"black":"white"}
            //  backgroundColor={ backgroundColor=
            //   currentMode === "dark" ? "#424242" : "#f2f2f2",}
            //  textColor={textClr==="TYPE_OF_WORK"?c==="dark"?"white":"black":c==="dark"?"#4242425":"white"}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Type Of Work"
                // placeholder="Client Number"
                // value={typeOfWork}
                value={typeOfWorkDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      console.log(
                        "isTextInputDisabled ? : " + isTextInputDisabled
                      );
                      prepareFlatListData(
                        udcList,
                        "typeOfWork",
                        "TYPE_OF_WORK"
                      );
                      setRenderItemType("TYPE_OF_WORK");
                      setModalHeader("Select Type Of Work");
                      setModalVisible(true);
                  
                      // console.log("FLATLIST : " + JSON.stringify(flatListData));
                    }}
                  />
                }
                onChangeText={(text) => setTypeOfWork(text)}
                //outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{typeOfWorkDescription}</Caption>
            </View> */}
          </View>
          {/* client section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
                var c=""
                //   commented by vasagi 15/12/23
                   style={[styles.textInputStyle, { color: currentMode === "dark" 
                  
                   ? c="dark"  :  c="light"}]}
                   textColor={c==="dark"?"#00FFFF":"black"}
                   theme={{
                  colors: {
                       onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                  }}}
              //  textColor={textClr==="CLIENT_INFO"?c==="dark"?"white":"black":c==="dark"?"#424242":"white"}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Client"
             
             //   theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Client Number"
                // value={clientNumber}
                value={clientName}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(ABList, "CLIENT", "CLIENT_INFO");
                      setRenderItemType("CLIENT_INFO");
                      setModalHeader("Select Client");
                      setModalVisible(true);
                       
                    }}
                  />
                }
                onChangeText={(text) => setClientNumber(text)}
             //   outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{clientName}</Caption>
            </View> */}
          </View>
          {/* Vendor section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
                var c=""
                //   commented by vasagi 15/12/23
                   style={[styles.textInputStyle, { color: currentMode === "dark" 
                  
                   ? c="dark"  :  c="light"}]}
                   textColor={c==="dark"?"#00FFFF":"black"}
                   theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
       //        textColor={textClr==="VENDOR_INFO"?c==="dark"?"white":"black":c==="dark"?"#424242":"white"}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Vendor"
              //  theme={{colors: {primary: 'red' } }}
                // placeholder="Vendor Number"
                // value = {vendorNumber}
                value={vendorName}
                editable={false}
                disabled={isTextInputDisabled}
                
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(ABList, "VENDOR", "VENDOR_INFO");
                      setRenderItemType("VENDOR_INFO");
                      setModalHeader("Select Vendor");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setVendorNumber(text)}
              //  outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{vendorName}</Caption>
            </View> */}
          </View>
          {/* Priority section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
                  mode="outlined"
                
                  // it will change the color of the label, placeholder and inactive outline
                  var c=""
                  //   commented by vasagi 15/12/23
                     style={[styles.textInputStyle, { color: currentMode === "dark" 
                    
                     ? c="dark"  :  c="light"}]}
                     textColor={c==="dark"?"#00FFFF":"black"}
                     theme={{
                      colors: {
                           onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                      }
                  }}
                  // it will change the inactive outline color
                 //   outlineColor="green"
               
             //   mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Priority"
               
              //  theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={priority}
                value={priorityDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    disabled={isTextInputDisabled}
                    icon="reorder-horizontal"
                    onPressIn={() => {
                      prepareFlatListData(udcList, "priority", "PRIORITY");
                      setRenderItemType("PRIORITY");
                      setModalHeader("Select Priority");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setPriority(text)}
             //   outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{priorityDescription}</Caption>
            </View> */}
          </View>
          {/* Escalation status section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
                var c=""
                //   commented by vasagi 15/12/23
                   style={[styles.textInputStyle, { color: currentMode === "dark" 
                  
                   ? c="dark"  :  c="light"}]}
                   textColor={c==="dark"?"#00FFFF":"black"}
                   theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Escalation Status"
               // theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={escalationStatus}
                value={escalationStatusDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "escalationStatus",
                        "ESCALATION_STATUS"
                      );
                      setRenderItemType("ESCALATION_STATUS");
                      setModalHeader("Select Escalation Status");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setEscalationStatus(text)}
             //   outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>
                {escalationStatusDescription}
              </Caption>
            </View> */}
          </View>
          {/* Promised delivery date section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingRight: 5,
              }}
            >
              <TextInput
               var c=""
               //   commented by vasagi 15/12/23
                  style={[styles.textInputStyle, { color: currentMode === "dark" 
                 
                  ? c="dark"  :  c="light"}]}
                  textColor={c==="dark"?"#00FFFF":"black"}
                  theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Promised Delivery"
              //  theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Checklist Number"
                value={promisedDeliveryDate}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="calendar-range"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      setActiveDateTimeField("PROMISED_DELIVERY_DATE");
                      setDateTimePickerDisplayMode("date");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setPromisedDeliveryDate(text)}
             //   outlineColor="#6200ee"
              />
            </View>
            {/* Actual delivery date section starts */}
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <TextInput
              var c=""
              //   commented by vasagi 15/12/23
                 style={[styles.textInputStyle, { color: currentMode === "dark" 
                
                 ? c="dark"  :  c="light"}]}
                 textColor={c==="dark"?"#00FFFF":"black"}
                 theme={{
                  colors: {
                       onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                  }
              }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Actual Delivery Date"
              //  theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Line Number"
                value={actualDeliveryDate}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="calendar-range"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      setActiveDateTimeField("ACTUAL_DELIVERY_DATE");
                      setDateTimePickerDisplayMode("date");
                      // setShowDateTimePicker(true);
                      showDatePicker();
                    }}
                  />
                }
                onChangeText={(text) => setActualDeliveryDate(text)}
             //   outlineColor="#6200ee"
              />
            </View>
          </View>
          {/* Invoice status section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
              var c=""
              //   commented by vasagi 15/12/23
                 style={[styles.textInputStyle, { color: currentMode === "dark" 
                
                 ? c="dark"  :  c="light"}]}
                 textColor={c==="dark"?"#00FFFF":"black"}
                 theme={{
                  colors: {
                       onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                  }
              }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Invoice Status"
              //  theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={invoiceStatus}
                value={invoiceStatusDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "invoiceStatus",
                        "INVOICE_STATUS"
                      );
                      setRenderItemType("INVOICE_STATUS");
                      setModalHeader("Select Invoice Status");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setInvoiceStatus(text)}
            //    outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>
                {invoiceStatusDescription}
              </Caption>
            </View> */}
          </View>
          {/* Payment status section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
              var c=""
              //   commented by vasagi 15/12/23
                 style={[styles.textInputStyle, { color: currentMode === "dark" 
                
                 ? c="dark"  :  c="light"}]}
                 textColor={c==="dark"?"#00FFFF":"black"}
                 theme={{
                  colors: {
                       onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                  }
              }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Payment Status"
               // theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={paymentStatus}
                value={paymentStatusDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "paymentStatus",
                        "PAYMENT_STATUS"
                      );
                      setRenderItemType("PAYMENT_STATUS");
                      setModalHeader("Select Payment Status");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setPaymentStatus(text)}
             ///   outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>
                {paymentStatusDescription}
              </Caption>
            </View> */}
          </View>
          {/* Goods status section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
               var c=""
               //   commented by vasagi 15/12/23
                  style={[styles.textInputStyle, { color: currentMode === "dark" 
                 
                  ? c="dark"  :  c="light"}]}
                  textColor={c==="dark"?"#00FFFF":"black"}
                  theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Goods Status"
             //   theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={goodsStatus}
                value={goodsStatusDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "goodsStatus",
                        "GOODS_STATUS"
                      );
                      setRenderItemType("GOODS_STATUS");
                      setModalHeader("Select Goods Status");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setGoodsStatus(text)}
            //    outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{goodsStatusDescription}</Caption>
            </View> */}
          </View>
          {/* Is money involved section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingRight: 5,
              }}
            >
              <TextInput
                var c=""
                //   commented by vasagi 15/12/23
                   style={[styles.textInputStyle, { color: currentMode === "dark" 
                  
                   ? c="dark"  :  c="light"}]}
                   textColor={c==="dark"?"#00FFFF":"black"}
                   theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Is Money Involved ?"
            //    theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Checklist Number"
                value={isMoneyInvolved}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                  icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "isMoneyInvolved",
                        "IS_MONEY_INVOLVED"
                      );
                      setRenderItemType("IS_MONEY_INVOLVED");
                      setModalHeader("Is money involved ?");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setIsMoneyInvolved(text)}
             //   outlineColor="#6200ee"
              />
            </View>
            {/* Total value section starts */}
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <TextInput
               var c=""
               //   commented by vasagi 15/12/23
                  style={[styles.textInputStyle, { color: currentMode === "dark" 
                 
                  ? c="dark"  :  c="light"}]}
                  textColor={c==="dark"?"#00FFFF":"black"}
                  theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Total Value"
         //       theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Line Number"
                value={totalValue}
                editable={true}
                disabled={isTextInputDisabled}
                keyboardType="number-pad"
                onChangeText={(text) => setTotalValue(text)}
              //  outlineColor="#6200ee"
              />
            </View>
          </View>
          {/* Currency code section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
               var c=""
               //   commented by vasagi 15/12/23
                  style={[styles.textInputStyle, { color: currentMode === "dark" 
                 
                  ? c="dark"  :  c="light"}]}
                  textColor={c==="dark"?"#00FFFF":"black"}
                  theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="CurrencyCode"
             //   theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={currencyCode}
                value={currencyCodeDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "currencyCode",
                        "CURRENCY_CODE"
                      );
                      setRenderItemType("CURRENCY_CODE");
                      setModalHeader("Select Currency Code");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setCurrencyCode(text)}
            //    outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>
                {currencyCodeDescription}
              </Caption>
            </View> */}
          </View>
          {/* Type of goods section starts */}
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 1,
                paddingRight: 5,
              }}
            >
              <TextInput
               var c=""
               //   commented by vasagi 15/12/23
                  style={[styles.textInputStyle, { color: currentMode === "dark" 
                 
                  ? c="dark"  :  c="light"}]}
                  textColor={c==="dark"?"#00FFFF":"black"}
                  theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Type Of Goods"
               // theme={{ colors: { placeholder: textInputLabelColor } }}
                // value={typeOfGoods}
                value={typeOfGoodsDescription}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "typeOfGoods",
                        "TYPE_OF_GOODS"
                      );
                      setRenderItemType("TYPE_OF_GOODS");
                      setModalHeader("Select Type Of Goods");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setTypeOfGoods(text)}
            //    outlineColor="#6200ee"
              />
            </View>
            {/* <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Caption style={styles.caption}>{typeOfGoodsDescription}</Caption>
            </View> */}
          </View>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingRight: 5,
              }}
            >
              <TextInput
                var c=""
                //   commented by vasagi 15/12/23
                   style={[styles.textInputStyle, { color: currentMode === "dark" 
                  
                   ? c="dark"  :  c="light"}]}
                   textColor={c==="dark"?"#00FFFF":"black"}
                   theme={{
                    colors: {
                         onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                    }
                }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Number Of Goods ?"
             //   theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Checklist Number"
                value={numberOfGoods}
                editable={true}
                disabled={isTextInputDisabled}
                keyboardType="number-pad"
                onChangeText={(text) => setNumberOfGoods(text)}
            //    outlineColor="#6200ee"
              />
            </View>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <TextInput
            var c=""
            //   commented by vasagi 15/12/23
               style={[styles.textInputStyle, { color: currentMode === "dark" 
              
               ? c="dark"  :  c="light"}]}
               textColor={c==="dark"?"#00FFFF":"black"}
               theme={{
                colors: {
                     onSurfaceVariant:c==="dark"?'#A9A9A9':'#616161'
                }
            }}
                mode={textInputMode}
                dense={textInputDense}
                maxLength={textInputMaxLength}
                label="Unit Of Measure"
           //     theme={{ colors: { placeholder: textInputLabelColor } }}
                // placeholder="Line Number"
                value={unitOfMeasure}
                editable={false}
                disabled={isTextInputDisabled}
                right={
                  <TextInput.Icon
                    icon="reorder-horizontal"
                    disabled={isTextInputDisabled}
                    onPressIn={() => {
                      prepareFlatListData(
                        udcList,
                        "unitOfMeasure",
                        "UNIT_OF_MEASURE"
                      );
                      setRenderItemType("UNIT_OF_MEASURE");
                      setModalHeader("Select Unit Of Measure");
                      setModalVisible(true);
                    }}
                  />
                }
                onChangeText={(text) => setUnitOfMeasure(text)}
             //   outlineColor="#6200ee"
              />
            </View>
          </View>
          {/* If detail form is displayed for history information, save button will be disabled */}

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              // justifyContent: "space-evenly",
              marginVertical: 10,
              // height: 100,
            }}
          >
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingRight: 5,
                marginLeft:2,
                marginRight:2
              }}
            >
              <Button
                mode="contained"
              disabled={isSaveButtonDisabled}
             // disabled={true}
                onPress={() => {
                  submitChecklistDetail();
                  assignEmployeeAndSupervisorToTask();
                  setActivityIndicatorAnimating(true);
                  setActivityIndicatorModalVisible(true);
                  // opsxProps = {
                  //   lastRouteName: props.navigation.state.routeName,
                  //   snackBarText: "Checklist Detail - Changes saved",
                  // };
                }}
              >
                Save
              </Button>
            </View>
            <View
              style={{
                ...styles.textInputContainer,
                flex: 0.5,
                paddingLeft: 5,
              }}
            >
              <Button
                mode="contained"
                onPress={() => {
                  opsxProps = {
                    // 29-JUL-2022 - commenting the following line as custom back button goes in an endles loop
                    // lastRouteName: props.navigation.state.routeName,
                    snackBarText:
                      props.navigation.state.params.formName +
                      " - Changes not saved",
                    // 22-OCT-2022
                    // action prop is "CANCELLED" to control unwanted modal trigger in taskScreen and checklistScreen
                    action: "CANCELLED",
                  };
                  navigate(
                    props.navigation.state.params.lastRouteName,
                    opsxProps
                  );
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>):null }
      

      {workbenchData ? (
        workbenchData.hasDetail ? (
          <Portal>
            <FAB.Group
              open={open}
              icon={open ? "forum" : "forum"}
              // conditionally show add and edit comments FAB based on sourceOfData
              // if sourcOfData = "HISTORY" then do not show add comment icon.
              actions={
                isAddCommentDisabled
                  ? [
                      {
                        icon: "message-text",
                        label: "View Comments",
                        onPress: () => {
                          console.log("Clicked view comments");
                          setRenderItemType("COMMENTS");
                          setFlatListData(checklistWorkbenchCommentsList);
                          setSearchFunctionArrayHolder(
                            checklistWorkbenchCommentsList
                          );
                          setModalVisible(true);
                          setModalHeader("Comments for this task");
                        },
                        small: false,
                      },
                    ]
                  : [
                      {
                        icon: "message-text",
                        label: "View Comments",
                        onPress: () => {
                          console.log("Clicked view comments");
                          setRenderItemType("COMMENTS");
                          setFlatListData(checklistWorkbenchCommentsList);
                          setSearchFunctionArrayHolder(
                            checklistWorkbenchCommentsList
                          );
                          setModalVisible(true);
                          setModalHeader("Comments for this task");
                        },
                        small: false,
                      },
                      {
                        icon: "message",
                        label: "Add Comment",
                        onPress: () => {
                          console.log("Clicked add comment");
                          console.log(isAddCommentDisabled);
                          setAddCommentModalVisible(true);
                        },
                        small: false,
                      },
                    ]
              }
              onStateChange={onStateChange}
              onPress={() => {
                if (open) {
                  // do something if the speed dial is open
                }
              }}
            />
          </Portal>
        ) : null
      ) : null}

      {/* <ActivityIndicator animating={activityIndicatorAnimating} /> */}
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
    
    </View>

      
     ):(console.log("no data"))}
     

    
    </>
  );
};

const styles = StyleSheet.create({
  textInputContainer: { paddingHorizontal: 10, paddingVertical: 2 },
  caption: {
    textAlignVertical: "center",
    width: "100%",
    height: 40,
    fontSize: 14,
  },
  textInputStyle: {
    fontSize: 14,
    
  },
  item: {
   backgroundColor: "#f0e6ff",
    padding: 10,
    marginVertical: 3,
    marginHorizontal: 5,
    borderRadius: 5,
    marginLeft:1,
    marginRight:1,
    

  },
  cardHeader: {
    borderLeftWidth: 1,
  //  borderLeftColor: "#3399FF",
    borderBottomWidth: 1,
    // borderBottomColor: "#3399FF",
   // shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
    paddingVertical: 5,
  },
  cardContent: {
    borderLeftWidth: 1,
  //  borderLeftColor: "#3399FF",
    borderBottomWidth: 1,
    // borderBottomColor: "#006600",
  //  shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
  cardSubtitleStyle: {
    fontSize: 17,
    color: "#000000",
  },
});

export default ChecklistDetailScreen;
