import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [
    completedTasksByReportingEmployeesResults,
    setCompletedTasksByReportingEmployeesResults,
  ] = useState({});
  const [
    pendingTasksByReportingEmployeesResults,
    setPendingTasksByReportingEmployeesResults,
  ] = useState({});
  const [
    unassignedTasksByReportingEmployeesResults,
    setUnassignedTasksByReportingEmployeesResults,
  ] = useState({});
  const [
    overdueTasksByReportingEmployeesResults,
    setOverdueTasksByReportingEmployeesResults,
  ] = useState({});
  const [
    completedChecklistsBySupervisorResults,
    setCompletedChecklistsBySupervisorResults,
  ] = useState({});

  const [
    checklistsBySupervisorNotCompletedOnTimeResults,
    setChecklistsBySupervisorNotCompletedOnTimeResults,
  ] = useState({});

  const [
    overdueChecklistsBySupervisorResult,
    setOverdueChecklistsBySupervisorResult,
  ] = useState({});

  const [
    pendingChecklistsBySupervisorResult,
    setPendingChecklistsBySupervisorResult,
  ] = useState({});

  const getCompletedTasksByReportingEmployees = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getCompletedTasksByReportingEmployees called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationOnCompletedTasksByReportingEmployees",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setCompletedTasksByReportingEmployeesResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const getPendingTasksByReportingEmployees = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getPendingTasksByReportingEmployees called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationOnPendingTasksByReportingEmployees",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log("Response length : " + tempResponse.data.length);
      setPendingTasksByReportingEmployeesResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const getUnassignedTasksByReportingEmployees = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getUnassignedTasksByReportingEmployees called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationOnUnassignedTasksByReportingEmployees",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setUnassignedTasksByReportingEmployeesResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const getOverdueTasksByReportingEmployees = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getOverdueTasksByReportingEmployees called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationOnOverdueTasksByReportingEmployees",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setOverdueTasksByReportingEmployeesResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const getCompletedChecklistsBySupervisor = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getCompletedChecklistsBySupervisor called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationForCompletedQuestionsBySupervisor",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setCompletedChecklistsBySupervisorResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const getChecklistsNotCompletedOnTimeBySuperVisor = async (
    token,
    supervisorNumber
  ) => {
    try {
      console.log("getChecklistsNotCompletedOnTimeBySuperVisor called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationQuestionsBySupervisorAndNotCompletedOnTime",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setChecklistsBySupervisorNotCompletedOnTimeResults(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const overdueChecklistsBySupervisor = async (token, supervisorNumber) => {
    try {
      console.log("overdueChecklistsBySupervisor called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationOnOverdueQuestionsBySupervisor",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log(tempResponse.data.length);
      setOverdueChecklistsBySupervisorResult(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  const pendingChecklistsBySupervisor = async (token, supervisorNumber) => {
    try {
      console.log("pendingChecklistsBySupervisor called...");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKDASH",
          "Content-Type": "application/json",
        },
        params: {
          supervisorNumber: supervisorNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/getDashboardDetailInformationForPendingQuestionsBySupervisor",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log("tempResponse length : " + tempResponse.data.length);
      setPendingChecklistsBySupervisorResult(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Failed to get dashboard information");
    }
  };

  return [
    getCompletedTasksByReportingEmployees,
    completedTasksByReportingEmployeesResults,
    getPendingTasksByReportingEmployees,
    pendingTasksByReportingEmployeesResults,
    getUnassignedTasksByReportingEmployees,
    unassignedTasksByReportingEmployeesResults,
    getOverdueTasksByReportingEmployees,
    overdueTasksByReportingEmployeesResults,
    getCompletedChecklistsBySupervisor,
    completedChecklistsBySupervisorResults,
    getChecklistsNotCompletedOnTimeBySuperVisor,
    checklistsBySupervisorNotCompletedOnTimeResults,
    overdueChecklistsBySupervisor,
    overdueChecklistsBySupervisorResult,
    pendingChecklistsBySupervisor,
    pendingChecklistsBySupervisorResult,
    errorMessage,
  ];
};
