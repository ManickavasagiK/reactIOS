import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [taskDetailGetResponse, setTaskDetailGetResponse] = useState({});
  const [taskDetailAddResponse, setTaskDetailAddResponse] = useState({});
  const [addCommentToTaskResponse, setAddCommentToTaskResponse] = useState({});
  const [commentsByTaskGetResponse, setCommentsByTaskGetResponse] = useState(
    {}
  );
  const [abInfoByTypeGetResponse, setAbInfoByTypeGetResponse] = useState([]);

  const getTaskDetail = async (token, checklistWorkbenchNumber, lineNumber) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
        params: {
          checklistWorkbenchNumber: checklistWorkbenchNumber,
          lineNumber: lineNumber,
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/ckDetail/getChecklistDetailAndComments",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTaskDetailGetResponse(tempResponse);
      console.log("get task detail")
    } catch (err) {
      console.log(err);
      setErrorMessage("Unable to get task detail");
    }
  };

  const addTaskDetail = async (token, checklistWorkbenchDetail) => {
    try {
      // console.log(checklistWorkbenchDetail);
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      console.log(Device.modelName);
      let data = checklistWorkbenchDetail;
      const response = await opsxApi.post(
        "/ckBuster/checkWorkbench/ckDetail/addChecklistDetail",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setTaskDetailAddResponse(tempResponse);
      console.log("add task detail")
    } catch (err) {
      console.log(err);
      setErrorMessage("Unable to add task");
    }
  };

  const addCommentToTask = async (token, checklistWorkbenchComments) => {
    try {
      console.log('inside addcomment task')
      //console.log(checklistWorkbenchComments)
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      let data = checklistWorkbenchComments;
      const response = await opsxApi.post(
        "/ckBuster/checkWorkbench/ckComments/addComment",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log(tempResponse)
      setAddCommentToTaskResponse(tempResponse);
      setCommentsByTaskGetResponse(tempResponse);
      console.log("Add comment to task")
    } catch (err) {
      console.log(err);
      setErrorMessage("Add comment failed");
    }
  };

  const getCommentsByTask = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    console.log('inside get comments')
   
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
        params: {
          checklistWorkbenchNumber: checklistWorkbenchNumber,
          lineNumber: lineNumber,
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/ckComments/getComments",
        args
      );
     
     //  console.log(response.data);
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //console.log('response1')
    // console.log(tempResponse)
    console.log("get comment by task")
      setCommentsByTaskGetResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Getting task comments failed");
    }
  };

  const getABInfoByTypes = async (token, ABTypeList) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          "Content-Type": "application/json",
        },
      };
      let data = ABTypeList;
      const response = await opsxApi.post(
        "/functional/foundation/abmaster/getABRecordsByMultipleTypes",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setAbInfoByTypeGetResponse(tempResponse);
      console.log("getABInfoByTypes")
    } catch (err) {
      console.log(err);
      setErrorMessage("Address Book info get failed");
    }
  };

  return [
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
  ];
};
