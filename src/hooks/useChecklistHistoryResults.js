import { useState, useContext } from "react";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  // state variables
  const [checkHistoryErrorMessage, setCheckHistoryErrorMessage] = useState("");
  const [checklistHistoryResult, setChecklistHistoryResult] = useState({});
  const [checklistHistoryDetailResult, setChecklistHistoryDetailResult] =
    useState([]);
  const [checklistHistoryPictureResult, setChecklistHistoryPictureResult] =
    useState([]);
  const [checklistHistoryCommentsResult, setChecklistHistoryCommentsResult] =
    useState([]);

  const getChecklistHistoryRecord = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKHIS",
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkHistory/findById/checklistWorkbenchNumber/" +
          checklistWorkbenchNumber +
          "/lineNumber/" +
          lineNumber,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };

      setChecklistHistoryResult(tempResponse);
    } catch (err) {
      console.log(err);
      setCheckHistoryErrorMessage("Getting checklist history record failed");
    }
  };

  const getChecklistHistoryDetail = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKHIS",
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkDetailHistory/findById/checklistWorkbenchNumber/" +
          checklistWorkbenchNumber +
          "/lineNumber/" +
          lineNumber,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistHistoryDetailResult(tempResponse);
    } catch (err) {
      console.log(err);
      setCheckHistoryErrorMessage("Getting checklist history detail failed");
    }
  };

  const getChecklistHistoryPicture = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    try {
      console.log("Get picture from history called");
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKHIS",
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkPictureHistory/getPicturesByChecklistNumberAndLineNumberThenSendThemToApp/checklistWorkbenchNumber/" +
          checklistWorkbenchNumber +
          "/lineNumber/" +
          lineNumber,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      // console.log(tempResponse);
      setChecklistHistoryPictureResult(tempResponse);
    } catch (err) {
      console.log(err);
      setCheckHistoryErrorMessage("Getting checklist history picture failed");
    }
  };

  const getChecklistHistoryComments = async (
    token,
    checklistWorkbenchNumber,
    lineNumber
  ) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKHIS",
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.get(
        "/ckBuster/checkCommentsHistory/findById/checklistWorkbenchNumber/" +
          checklistWorkbenchNumber +
          "/lineNumber/" +
          lineNumber,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setChecklistHistoryCommentsResult(tempResponse);
    } catch (err) {
      console.log(err);
      setCheckHistoryErrorMessage("Getting checklist history comments failed");
    }
  };
  return [
    getChecklistHistoryRecord,
    checklistHistoryResult,
    getChecklistHistoryDetail,
    checklistHistoryDetailResult,
    getChecklistHistoryPicture,
    checklistHistoryPictureResult,
    getChecklistHistoryComments,
    checklistHistoryCommentsResult,
    checkHistoryErrorMessage,
  ];
};
