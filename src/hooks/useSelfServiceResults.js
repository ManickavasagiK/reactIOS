import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [selfServicePasswordResetResults, setSelfServicePasswordResetResults] =
    useState({});
  const [selfServiceErrorMessage, setSelfServiceErrorMessage] = useState({});

  const selfServicePasswordReset = async (token, passwordResetDto) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "CHECKWKBH",
          lastUpdatedMachine: Device.modelName,
          "Content-Type": "application/json",
        },
      };
      let data = passwordResetDto;
      const response = await opsxApi.post(
        "/passwordReset/selfServiceReset",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      setSelfServicePasswordResetResults(tempResponse);
    } catch (err) {
      console.log(err);
      let tempErrorMessage = {
        status: err.response.status,
        message: "Password reset failed",
      };
      setSelfServiceErrorMessage(tempErrorMessage);
    }
  };
  return [
    selfServicePasswordReset,
    selfServicePasswordResetResults,
    selfServiceErrorMessage,
  ];
};
