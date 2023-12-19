import createDataContext from "./createDataContext";
import opsxApi from "../api/opsxApi";

const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "get_summaryInfoBySupervisor":
      return { ...state, dashboardInfoBySupervisor: action.payload };
    default:
      return state;
  }
};

const getSummaryInfoBySupervisor = (dispatch) => {
  return async ({ token, supervisorId }) => {
    //put the following in a try catch block
    const getResponse = await opsxApi.get(
      "/ckBuster/checkWorkbench/dashboard/findDashboardSummaryInformationBySupervisor",
      {
        params: {
          supervisorNumber: supervisorId,
        },
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "HOMEDASH",
          "Content-Type": "application/json",
        },
      }
    );

    dispatch({
      type: "get_summaryInfoBySupervisor",
      payload: getResponse.data,
    });
  };
};

export const { Provider, Context } = createDataContext(
  dashboardReducer,
  { getSummaryInfoBySupervisor },
  { dashboardInfoBySupervisor: "" }
);
