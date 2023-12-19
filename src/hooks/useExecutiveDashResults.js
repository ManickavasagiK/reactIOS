import { useState, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [
    executiveDashboardHistorySummaryForNumberOfDays,
    setExecutiveDashboardHistorySummaryForNumberOfDays,
  ] = useState({});
  const [
    executiveDashboardHistorySummaryForADay,
    setExecutiveDashboardHistorySummaryForADay,
  ] = useState({});
  const [
    executiveDashboardSummaryFromWorkbench,
    setExecutiveDashboardSummaryFromWorkbench,
  ] = useState({});

  // Gets information from history table
  const getExecutiveDashboardSummaryInformationForNumberOfDays = async (
    numberOfDays,
    token
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "EXECDASH",
          "Content-Type": "application/json",
        },
        params: {
          numberOfDaysBehind: numberOfDays,
        },
      };
      // console.log(args);
      const response = await opsxApi.get(
        "/ckBuster/checkHistory/dashboard/getExecutiveHistorySummaryInformationForNumberOfDays",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setExecutiveDashboardHistorySummaryForNumberOfDays(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Get executive summary history dashboard data failed");
    }
  };

  // Gets information from history table
  const getExecutiveDashboardSummaryInformationForADay = async (
    taskDate,
    token
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "EXECDASH",
          "Content-Type": "application/json",
        },
        params: {
          taskDate: taskDate,
        },
      };
      // console.log(args);
      const response = await opsxApi.get(
        "/ckBuster/checkHistory/dashboard/getExecutiveHistorySummaryInformationForADay",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setExecutiveDashboardHistorySummaryForADay(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Get executive summary history dashboard data failed");
    }
  };

  // Gets information from workbench table
  const getExecutiveDashboardSummaryInformationFromWorkbench = async (
    token
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "EXECDASH",
          "Content-Type": "application/json",
        },
      };
      // console.log(args);
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getExecutiveDashboardSummaryInformation",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setExecutiveDashboardSummaryFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Get executive summary workbench dashboard data failed");
    }
  };

  return [
    getExecutiveDashboardSummaryInformationForNumberOfDays,
    executiveDashboardHistorySummaryForNumberOfDays,
    getExecutiveDashboardSummaryInformationForADay,
    executiveDashboardHistorySummaryForADay,
    getExecutiveDashboardSummaryInformationFromWorkbench,
    executiveDashboardSummaryFromWorkbench,
    errorMessage,
  ];
};
