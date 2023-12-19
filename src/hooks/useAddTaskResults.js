import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [addTaskResponse, setAddTaskResponse] = useState({});
  const [dataToAddTaskResponse, setDataToAddTaskResponse] = useState([]);

  const addTaskToWorkbench = async (token, checklistWorkbenchDto) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CWADDTASK",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      let data = checklistWorkbenchDto;
      // console.log(data);
      const response = await opsxApi.post(
        "/ckBuster/checkWorkbench/addCheckWorkbenchRecord",
        data,
        args
      );
      console.log(response.status);
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setAddTaskResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Add task failed");
    }
  };

  const getDataToAddTask = async (token) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CWADDTASK",
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/getDataForAddingTaskAndChecklist",
        args
      );
      setDataToAddTaskResponse(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage("Can't get information to add Task");
    }
  };

  return [
    addTaskToWorkbench,
    addTaskResponse,
    getDataToAddTask,
    dataToAddTaskResponse,
    errorMessage,
  ];
};
