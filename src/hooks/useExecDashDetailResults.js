import { useState, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [execErrorMessage, setExecErrorMessage] = useState("");
  // Detail from workbench
  const [completedTasksFromWorkbench, setCompletedTasksFromWorkbench] =
    useState([]);
  const [pendingTasksFromWorkbench, setPendingTasksFromWorkbench] = useState(
    []
  );
  const [overdueTasksFromWorkbench, setOverdueTasksFromWorkbench] = useState(
    []
  );
  const [
    tasksCompletedInTimeFromWorkbench,
    setTasksCompletedInTimeFromWorkbench,
  ] = useState([]);
  const [
    tasksNotCompletedInTimeFromWorkbench,
    setTasksNotCompletedInTimeFromWorkbench,
  ] = useState([]);
  const [unassignedTasksFromWorkbench, setUnassignedTasksFromWorkbench] =
    useState([]);
  const [
    completedChecklistsFromWorkbench,
    setCompletedChecklistsFromWorkbench,
  ] = useState([]);
  const [pendingChecklistsFromWorkbench, setPendingChecklistsFromWorkbench] =
    useState([]);
  const [overdueChecklistsFromWorkbench, setOverdueChecklistsFromWorkbench] =
    useState([]);
  const [
    checklistsCompletedInTimeFromWorkbench,
    setChecklistsCompletedInTimeFromWorkbench,
  ] = useState([]);
  const [
    checklistsNotCompletedInTimeFromWorkbench,
    setChecklistsNotCompletedInTimeFromWorkbench,
  ] = useState([]);
  const [
    unassignedChecklistsFromWorkbench,
    setUnassignedChecklistsFromWorkbench,
  ] = useState([]);

  //Detail from history
  const [completedTasksByDateFromHistory, setCompletedTasksByDateFromHistory] =
    useState([]);
  const [
    incompleteTasksByDateFromHistory,
    setIncompleteTasksByDateFromHistory,
  ] = useState([]);
  const [
    tasksCompletedInTimeByDateFromHistory,
    setTasksCompletedInTimeByDateFromHistory,
  ] = useState([]);
  const [
    tasksNotCompletedInTimeByDateFromHistory,
    setTasksNotCompletedInTimeByDateFromHistory,
  ] = useState([]);
  const [
    unassignedTasksByDateFromHistory,
    setUnassignedTasksByDateFromHistory,
  ] = useState([]);
  const [
    completedChecklistsByDateFromHistory,
    setCompletedChecklistsByDateFromHistory,
  ] = useState([]);
  const [
    incompleteChecklistsByDateFromHistory,
    setIncompleteChecklistsByDateFromHistory,
  ] = useState([]);
  const [
    checklistsCompletedInTimeByDateFromHistory,
    setChecklistsCompletedInTimeByDateFromHistory,
  ] = useState([]);
  const [
    checklistsNotCompletedInTimeByDateFromHistory,
    setChecklistsNotCompletedInTimeByDateFromHistory,
  ] = useState([]);
  const [
    unassignedChecklistsByDateFromHistory,
    setUnassignedChecklistsByDateFromHistory,
  ] = useState([]);

  // API methods
  // completed tasks from workbench
  const getCompletedTasksFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getCompletedTasksForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setCompletedTasksFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get completed tasks from workbench failed");
    }
  };

  // pending tasks from workbench
  const getPendingTasksFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getPendingTasksForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setPendingTasksFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get pending tasks from workbench failed");
    }
  };

  // Overdue tasks from workbench
  const getOverdueTasksFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getOverdueTasksForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setOverdueTasksFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get overdue tasks from workbench failed");
    }
  };

  // Tasks completed in time
  const getTasksCompletedInTimeFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getTasksCompletedInTimeForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTasksCompletedInTimeFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get tasks completed in time from workbench failed");
    }
  };

  // Tasks not completed in time
  const getTasksNotCompletedInTimeFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getTasksNotCompletedInTimeForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTasksNotCompletedInTimeFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage(
        "Get tasks not completed in time from workbench failed"
      );
    }
  };

  // Unassigned tasks from workbench
  const getUnassignedTasksFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getUnassignedTasksForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUnassignedTasksFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get unassigned tasks from workbench failed");
    }
  };

  // completed checklists from workbench
  const getCompletedChecklistsFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getCompletedChecklistsForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setCompletedChecklistsFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get completed checklists from workbench failed");
    }
  };

  // pending checklists from workbench
  const getPendingChecklistsFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getPendingChecklistsForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setPendingChecklistsFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get pending checklists from workbench failed");
    }
  };

  // Overdue checklists from workbench
  const getOverdueChecklistsFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getOverdueChecklistsForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setOverdueChecklistsFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get overdue checklists from workbench failed");
    }
  };

  // Checklists completed in time
  const getChecklistsCompletedInTimeFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getChecklistsCompletedInTimeForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistsCompletedInTimeFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage(
        "Get checklists completed in time from workbench failed"
      );
    }
  };

  // Checklists not completed in time
  const getChecklistsNotCompletedInTimeFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getChecklistsNotCompletedInTimeForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistsNotCompletedInTimeFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage(
        "Get checklists not completed in time from workbench failed"
      );
    }
  };

  // Unassigned checklists from workbench
  const getUnassignedChecklistsFromWorkbench = async (token) => {
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
        "/ckBuster/checkWorkbench/dashboard/getUnassignedChecklistsForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUnassignedChecklistsFromWorkbench(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get unassigned checklists from workbench failed");
    }
  };

  // API calls from history
  // Completed tasks by date from history
  const getCompletedTasksByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getCompletedTasksForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setCompletedTasksByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get completed tasks from history failed");
    }
  };

  // Incomplete tasks by date from history
  const getIncompleteTasksByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getIncompleteTasksForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setIncompleteTasksByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get incomplete tasks from history failed");
    }
  };

  // Tasks completed in time by date from history
  const getTasksCompletedInTimeByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getTasksCompletedInTimeForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTasksCompletedInTimeByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get tasks completed in time from history failed");
    }
  };

  // Tasks not completed in time by date from history
  const getTasksNotCompletedInTimeByDateFromHistory = async (
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
        "/ckBuster/checkHistory/dashboard/getTasksNotCompletedInTimeForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTasksNotCompletedInTimeByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage(
        "Get tasks not completed in time from history failed"
      );
    }
  };

  // Unassigned tasks by date from history
  const getUnassignedTasksByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getUnassignedTasksForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUnassignedTasksByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get unassigned tasks from history failed");
    }
  };

  // Completed checklists by date from history
  const getCompletedChecklistsByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getCompletedChecklistsForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setCompletedChecklistsByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get completed checklists from history failed");
    }
  };

  // Incomplete checklists by date from history
  const getIncompleteChecklistsByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getIncompleteChecklistsForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setIncompleteChecklistsByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get incomplete checklists from history failed");
    }
  };

  // Checklists completed in time by date from history
  const getChecklistsCompletedInTimeByDateFromHistory = async (
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
        "/ckBuster/checkHistory/dashboard/getChecklistsCompletedInTimeForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistsCompletedInTimeByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get tasks completed in time from history failed");
    }
  };

  // Checklists not completed in time by date from history
  const getChecklistsNotCompletedInTimeByDateFromHistory = async (
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
        "/ckBuster/checkHistory/dashboard/getChecklistsNotCompletedInTimeForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistsNotCompletedInTimeByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage(
        "Get checklists not completed in time from history failed"
      );
    }
  };

  // Unassigned checklists by date from history
  const getUnassignedChecklistsByDateFromHistory = async (taskDate, token) => {
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
        "/ckBuster/checkHistory/dashboard/getUnassignedChecklistsForADateForExecutiveDashboard",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUnassignedChecklistsByDateFromHistory(tempResponse);
    } catch (err) {
      console.log(err);
      setExecErrorMessage("Get unassigned checklists from history failed");
    }
  };

  return [
    // Detail data from workbench
    getCompletedTasksFromWorkbench,
    completedTasksFromWorkbench,
    getPendingTasksFromWorkbench,
    pendingTasksFromWorkbench,
    getOverdueTasksFromWorkbench,
    overdueTasksFromWorkbench,
    getTasksCompletedInTimeFromWorkbench,
    tasksCompletedInTimeFromWorkbench,
    getTasksNotCompletedInTimeFromWorkbench,
    tasksNotCompletedInTimeFromWorkbench,
    getUnassignedTasksFromWorkbench,
    unassignedTasksFromWorkbench,
    getCompletedChecklistsFromWorkbench,
    completedChecklistsFromWorkbench,
    getPendingChecklistsFromWorkbench,
    pendingChecklistsFromWorkbench,
    getOverdueChecklistsFromWorkbench,
    overdueChecklistsFromWorkbench,
    getChecklistsCompletedInTimeFromWorkbench,
    checklistsCompletedInTimeFromWorkbench,
    getChecklistsNotCompletedInTimeFromWorkbench,
    checklistsNotCompletedInTimeFromWorkbench,
    getUnassignedChecklistsFromWorkbench,
    unassignedChecklistsFromWorkbench,
    // Detail data from history for selected date
    getCompletedTasksByDateFromHistory,
    completedTasksByDateFromHistory,
    getIncompleteTasksByDateFromHistory,
    incompleteTasksByDateFromHistory,
    getTasksCompletedInTimeByDateFromHistory,
    tasksCompletedInTimeByDateFromHistory,
    getTasksNotCompletedInTimeByDateFromHistory,
    tasksNotCompletedInTimeByDateFromHistory,
    getUnassignedTasksByDateFromHistory,
    unassignedTasksByDateFromHistory,
    getCompletedChecklistsByDateFromHistory,
    completedChecklistsByDateFromHistory,
    getIncompleteChecklistsByDateFromHistory,
    incompleteChecklistsByDateFromHistory,
    getChecklistsCompletedInTimeByDateFromHistory,
    checklistsCompletedInTimeByDateFromHistory,
    getChecklistsNotCompletedInTimeByDateFromHistory,
    checklistsNotCompletedInTimeByDateFromHistory,
    getUnassignedChecklistsByDateFromHistory,
    unassignedChecklistsByDateFromHistory,
    // Error message from this hook
    execErrorMessage,
  ];
};
