import { useState, useContext } from "react";
// import opsxApi from "../api/opsxApi";
import { Context as AuthContext } from "../context/AuthContext";

export default () => {
  const {
    state: { opsxApi },
  } = useContext(AuthContext);

  const [empPicErrorMessage, setEmpPicErrorMessage] = useState("");
  const [employeePicResults, setEmployeePicResults] = useState({});
  const [picsOfMultipleEmployeesResults, setPicsOfMultipleEmployeesResults] =
    useState([]);

  const getEmployeePic = async (token) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "EMPMASTER",
          "Content-Type": "application/json",
        },
      };
      console.log("Get employee pic called");
      const response = await opsxApi.get(
        "/hr/employees/getPicturesByEmployeeNumberForSelfServiceApp",
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      //   console.log("tempResponse : " + tempResponse);
      setEmployeePicResults(tempResponse);
    } catch (err) {
      console.log(err);
      setEmpPicErrorMessage("Refresh checklist failed");
    }
  };

  const getPicsOfMultipleEmployees = async (token, listOfEmployees) => {
    try {
      let args = {
        headers: {
          Authorization: "Bearer " + token,
          applicationCode: "EMPMASTER",
          "Content-Type": "application/json",
        },
      };
      // console.log(listOfEmployees);
      let data = listOfEmployees;

      console.log("Get pics of multiple employees");
      const response = await opsxApi.post(
        "/hr/employees/getPicturesForMultipleEmployees",
        data,
        args
      );
      let tempResponse = {
        data: response.data,
        status: response.status,
      };
      // console.log("tempResponse : " + JSON.stringify(tempResponse));
      setPicsOfMultipleEmployeesResults(tempResponse);
    } catch (err) {
      console.log(err);
      setEmpPicErrorMessage("Refresh checklist failed");
    }
  };

  return [
    getEmployeePic,
    employeePicResults,
    getPicsOfMultipleEmployees,
    picsOfMultipleEmployeesResults,
    empPicErrorMessage,
  ];
};
