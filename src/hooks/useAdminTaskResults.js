import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [errorMessage, setErrorMessage] = useState("");
  const [refreshChecklistResponse, setRefreshChecklistResponse] = useState({});
  const [userListResponse, setUserListResponse] = useState({});
  const [resetUserTokenResponse, setResetUserTokenResponse] = useState({});
  const [resetUserPassResponse, setResetUserPassResponse] = useState({});
  const [updateEmployeePicResponse, setUpdateEmployeePicResponse] = useState(
    {}
  );
  const [allEmployeesResponse, setAllEmployeesResponse] = useState([]);

  const refreshChecklist = async (token) => {
    try {
      // console.log(token);
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "ADCHKREF",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      // console.log("Executing checklist refresh : " + JSON.stringify(args));
      const response = await opsxApi.post(
        "/ckBuster/checkWorkbench/refreshChecklistWorkbench",
        null,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      console.log("tempResponse : " + tempResponse);
      setRefreshChecklistResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Refresh checklist failed");
    }
  };

  const getUserList = async (token) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "ADPASSRST",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/passwordReset/getUserListForAdministratorPasswordReset",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUserListResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Fetch user list failed");
    }
  };

  const resetUserToken = async (token, email) => {
    try {
      let args = {
        params: {
          userName: email,
        },
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "ADTOKRES",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      // console.log(args);

      //It is good practice to pass null when there is no request body to be sent.
      const response = await opsxApi.post(
        "/passwordReset/resetDeviceTokenForUser",
        null,
        args
      );

      let tempResponse = {
        data: response.data,
        status: response.status,
      };

      setResetUserTokenResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Can't reset user token");
    }
  };

  const resetUserPass = async (token, email, password) => {
    try {
      let data = {
        userName: email,
        currentPassword: "",
        newPassword: password,
      };
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "ADPASSRST",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };

      const response = await opsxApi.post(
        "/passwordReset/resetByAdministrator",
        data,
        args
      );

      let tempResponse = {
        data: response.data,
        status: response.status,
      };

      setResetUserPassResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Reset password failed");
    }
  };

  const updateEmployeePic = async (token, formData) => {
    console.log("update employee pic called");
    try {
      let args = {
        headers: {
          "Content-Type": "multipart/form-data",

          Authorization: "Bearer " + token,
          applicationCode: "EMPMASTER",
          lastUpdatedMachine: Device.modelName,
          Accept: "application/json",
        },
      };

      // console.log(args);

      const response = await opsxApi.post(
        "/hr/employees/updateEmployeePicture",
        formData,
        args
      );
      // console.log(response.data);
      console.log("Employee pic update complete");
      setUpdateEmployeePicResponse(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage("Employee pic update failed");
    }
  };

  const getAllEmployees = async (token) => {
    console.log("Get all employees called");
    try {
      let args = {
        headers: {
          "Content-Type": "multipart/form-data",

          Authorization: "Bearer " + token,
          applicationCode: "EMPMASTER",
          Accept: "application/json",
        },
      };

      // console.log(args);

      const response = await opsxApi.get(
        "/hr/employees/getAllEmployeeIds",
        args
      );
      // console.log(response.data);
      let tempResponse = { status: response.status, data: response.data };
      setAllEmployeesResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setErrorMessage("Employee pic update failed");
    }
  };

  return [
    refreshChecklist,
    refreshChecklistResponse,
    getUserList,
    userListResponse,
    resetUserToken,
    resetUserTokenResponse,
    resetUserPass,
    resetUserPassResponse,
    updateEmployeePic,
    updateEmployeePicResponse,
    getAllEmployees,
    allEmployeesResponse,
    errorMessage,
  ];
};
