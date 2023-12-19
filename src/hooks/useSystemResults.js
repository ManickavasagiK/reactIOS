import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);
  const [systemErrorMessage, setSystemErrorMessage] = useState("");
  const [udcsForDdListGetResponse, setUdcsForDdListGetResponse] = useState({});
  const [accessInformationGetResponse, setAccessInformationGetResponse] =
    useState({});

  const getUdcsForDdList = async (token, ddList) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "SYSDATA",
          "Content-Type": "application/json",
        },
      };
      let data = ddList;
      const response = await opsxApi.post(
        "/system/dd/getUdcRecordsBasedOnDDs",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setUdcsForDdListGetResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setSystemErrorMessage("Can't get DD and UDC details");
    }
  };

  const getAccessInformationForRole = async (token, applicationCodes) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "MOBHOME",
          "Content-Type": "application/json",
        },
        params: {
          applicationCodes: applicationCodes,
        },
      };

      const response = await opsxApi.get(
        "/system/appRoleMapping/getByRoleCodeAndApplicationList",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setAccessInformationGetResponse(tempResponse);
    } catch (err) {
      console.log(err);
      setSystemErrorMessage("Can't get access information");
    }
  };

  return [
    getUdcsForDdList,
    udcsForDdListGetResponse,
    getAccessInformationForRole,
    accessInformationGetResponse,
    systemErrorMessage,
  ];
};
