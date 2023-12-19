import opsxApi from "../api/opsxApi";

const DashboardApiService = () => {
  console.log("Function kicked off");
  async function fetchDashboardInfoBySupervisor(token, supervisorId) {
    console.log("Function kicked off");
    const response = await opsxApi.get(
      "/ckBuster/checkWorkbench/dashboard/findDashboardSummaryInformationBySupervisor",
      null,
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

    return response;
  }
};

export default DashboardApiService;
