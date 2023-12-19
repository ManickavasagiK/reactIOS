import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [notificationErrorMessage, setNotificationErrorMessage] = useState({});
  const [notificationsForUserResults, setNotificationsForUserResults] =
    useState({});
  const [changeNotificationToReadResults, setChangeNotificationToReadResults] =
    useState({});
  const [deleteNotificationResults, setDeleteNotificationResults] = useState(
    {}
  );
  const [
    countOfUnreadNotificationResults,
    setCountOfUnreadNotificationResults,
  ] = useState(0);

  const getNotificationsForUser = async (token, employeeNumber) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "NOTIFY",
          "Content-Type": "application/json",
        },
        params: {
          addressNumber: employeeNumber,
        },
      };

      const response = await opsxApi.get(
        "/system/notification/getAllNotificationsForUser",
        args
      );

      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setNotificationsForUserResults(tempResponse);
    } catch (err) {
      console.log(err);

      let tempErrorMessage = {
        status: err.response.status,
        message: "Get notifications failed",
      };
      setNotificationErrorMessage(tempErrorMessage);
    }
  };

  const changeNotificationToRead = async (token, notificationId) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "NOTIFY",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
        params: {
          notificationId: notificationId,
        },
      };

      const response = await opsxApi.put(
        "/system/notification/markNotificationAsRead",
        null,
        args
      );

      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log("Changed notification to read");
      setChangeNotificationToReadResults(tempResponse);
    } catch (err) {
      console.log(err);

      let tempErrorMessage = {
        status: err.response.status,
        message: "Get notifications failed",
      };
      setNotificationErrorMessage(tempErrorMessage);
    }
  };

  const deleteNotification = async (token, notificationId) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "NOTIFY",
          "Content-Type": "application/json",
        },
        params: {
          notificationId: notificationId,
        },
      };

      const response = await opsxApi.delete(
        "/system/notification/deleteNotification",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log("Deleted notification");
      setDeleteNotificationResults(tempResponse);
    } catch (err) {
      console.log(err);

      let tempErrorMessage = {
        status: err.response.status,
        message: "Get notifications failed",
      };
      setNotificationErrorMessage(tempErrorMessage);
    }
  };

  const getCountOfUnreadNotifications = async (token) => {
    console.log("Inside get count of notifications");
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "NOTIFY",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/system/notification/getCountOfUnreadNotificationsByUser",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      // console.log(tempResponse);
      setCountOfUnreadNotificationResults(tempResponse);
    } catch (err) {
      console.log(err);

      let tempErrorMessage = {
        status: err.response.status,
        message: "Get notifications failed",
      };
      // console.log(tempErrorMessage);
      setNotificationErrorMessage(tempErrorMessage);
    }
  };

  return [
    getNotificationsForUser,
    notificationsForUserResults,
    changeNotificationToRead,
    changeNotificationToReadResults,
    deleteNotification,
    deleteNotificationResults,
    getCountOfUnreadNotifications,
    countOfUnreadNotificationResults,
    notificationErrorMessage,
  ];
};
