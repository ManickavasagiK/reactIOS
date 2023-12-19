import { useEffect, useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";

export default () => {
  const {
    state: { token, tokenContent, opsxApi },
    signout,
    getToken,
    buildOpsxApi,
  } = useContext(AuthContext);

  const [dashboardResults, setDashboardResults] = useState({});
  const [historyDashboardResults, setHistoryDashboardResults] = useState({});
  const [errorMessage, setErrorMessage] = useState("");
  //   let token, supervisorId;
  //   token = state.token;
  //   supervisorId = state.tokenContent.employeeNumber;

  // useEffect(() => {
  //   buildOpsxApi();
  // }, []);

  const getDashboardInfoBySupervisor = async (token, supervisorId) => {
    try {
      console.log("inside get dashboard info");
      // console.log("Bearer " + token);
      // console.log("Supervisor ID : " + supervisorId);
      let args = {
        params: {
          supervisorNumber: supervisorId,
        },
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "HOMEDASH",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkWorkbench/dashboard/findDashboardSummaryInformationBySupervisor",
        args
      );
      //   console.log(response.data);
      setDashboardResults(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage("Dashboard fetch did not work properly");
    }
  };

  const getHistoryDashboardInfo = async (token, numberOfDays) => {
    try {
      let args = {
        params: {
          numberOfDaysBehind: numberOfDays,
        },
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "HOMEDASH",
          "Content-Type": "application/json",
        },
      };
      const response = await opsxApi.get(
        "/ckBuster/checkHistory/dashboard/historySummaryInformationForLandingPage",
        args
      );
      setHistoryDashboardResults(response.data);
    } catch (err) {
      console.log(err);
      setErrorMessage("History Dashboard fetch did not work as expected");
    }
  };
console.log('useDashboard Hook')
  return [
    getDashboardInfoBySupervisor,
    dashboardResults,
    getHistoryDashboardInfo,
    historyDashboardResults,
    errorMessage,
  ];
};
