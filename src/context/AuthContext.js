import { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createDataContext from "./createDataContext";
// import opsxApi from "../api/opsxApi";
import { navigate } from "../navigationRef";
import jwtDecode from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from 'expo-constants'
const authReducer = (state, action) => {
  //console.log("action authreducer",action)
  switch (action.type) {
    case "add_error":
      return { ...state, errorMessage: action.payload };
    case "signin":
      return {
        ...state,
        errorMessage: "",
        token: action.payload,
       
      };
      
    case "softSignIn":
    //  console.log("softSignIn",token)
      return { ...state, softSignInResponse: action.payload };
    case "clear_error_message":
    //  console.log("clear_error_message",token)
      return { ...state, errorMessage: "" };
    case "signout":
      token=action.payload
      //console.log("signout", action)
      return { token:"" 
        };

    case "supply_jwt_contents":
      console.log("Inside supply jwt token contents");
     
      return { tokenContent: action.payload };
    case "get_token":
     // console.log("get token called",token);
      console.log("token supplied " + action.payload);
      return { ...state, token: action.payload };
    case "opsxApi":
      //console.log("opsxApi",token)
      return { ...state, opsxApi: action.payload };

    case "validate_token":
     // console.log("validate_token",token)
      return { ...state, isTokenValid: action.payload }; // added 01-MARCH-2022

    default:
      return state;
  }
};

const loginInstance = axios.create({
  //## PROD ##
  // Production login server by hostname
  baseURL:
    "https://opsx-prod-01.thehexcm.com:8443/hexcm-cloud-0.0.1-SNAPSHOT/api",

  //## DEV ##
  //Dev server by IPv4
  // baseURL: "http://188.166.217.165:8080/hexcm-cloud-0.0.1-SNAPSHOT/api",

  //## TEST ##
  // Test server by hostname
  // baseURL: "https://test.thehexcm.com:8443/hexcm-cloud-0.0.1-SNAPSHOT/api",

  // Test server by IPv4
  // baseURL: "https://128.199.91.104:8443/hexcm-cloud-0.0.1-SNAPSHOT/api",

  // Test server by IPv6
  // baseURL: "https://[2400:6180:0:d0::55c:3001]:8443/hexcm-cloud-0.0.1-SNAPSHOT/api"

  //## LOCAL ##
  // Local server using NGROK
  // baseURL: "http://4718-49-207-215-243.ngrok.io/api",
});

const tryLocalSignin = (dispatch) => async () => {
  console.log("try local sign in called");
  let token = null;
  (await AsyncStorage.getItem("token"))
    ? (token = {
        jwt: await AsyncStorage.getItem("token"),
        content: jwtDecode(await AsyncStorage.getItem("token")),
      })
    : (token = null);
  console.log("try local sign is called");
  if (token) {
    var tokenExpirationTime = token.content.exp;
    // console.log(JSON.stringify(token.content));
    if (tokenExpirationTime > new Date().getTime() / 1000) {
      dispatch({ type: "signin", payload: token }); // change to 'payload : token' if it does not work
      let opsxProps = {
        lastRouteName: "Login",
      };
      navigate("HomePage", opsxProps);
    } else {
      console.log("Token expired");
      await AsyncStorage.removeItem("token");
      //try with stored credentials
      if (SecureStore.getItemAsync("loginData")) {
        const userCredentials = JSON.parse(
          await SecureStore.getItemAsync("loginData")
        );
         console.log(userCredentials.userName);
        // Repeated login code - Need to find a way to refine this - the whole try catch block
        try {
          var data = await SecureStore.getItemAsync("loginData");
          // console.log(data);

          const response = await loginInstance.post("/auth/mobileLogin", data, {
            headers: {
              applicationCode: "LOGIN",
              "Content-Type": "application/json",
            },
          });

          await AsyncStorage.setItem("token", response.data.token);
          // console.log("Logged in from try local sign in");
          token = {
            jwt: await AsyncStorage.getItem("token"),
            content: jwtDecode(await AsyncStorage.getItem("token")),
          };

          dispatch({ type: "signin", payload: token });
          console.log("Logged in with saved credentials...");
          let opsxProps = {
            lastRouteName: "Login",
          };
          navigate("HomePage", opsxProps);
        } catch (err) {
          console.log(err);
          dispatch({
            type: "add_error",
            payload: "Something went wrong with sign in...",
          });
        }
      } else {
        navigate("Login");
      }
    }
  } else {
    console.log("token not found");
    navigate("Login");
  }
};

const validateToken = (dispatch) => async () => {
  console.log("validate token called");
  let token = null;
  (await AsyncStorage.getItem("token"))
    ? (token = {
        jwt: await AsyncStorage.getItem("token"),
        content: jwtDecode(await AsyncStorage.getItem("token")),
      })
    : (token = null);

  if (token) {
    var tokenExpirationTime = token.content.exp;
    // console.log(JSON.stringify(token.content));
    if (tokenExpirationTime > new Date().getTime() / 1000) {
      dispatch({ type: "signin", payload: token });
      dispatch({ type: "validate_token", payload: true }); //added 01-MAR-2022
      console.log("Token valid");
    } else {
      console.log("Token expired. Trying local sign in");
      // tryLocalSignin();
      dispatch({ type: "validate_token", payload: false }); //added 01-MAR-2022
      // Repeating code for try local sign in in the following block
      // ## START - try local sign in if token expired ### // added 02-MAR-2022

      await AsyncStorage.removeItem("token");
      //try with stored credentials
      if (SecureStore.getItemAsync("loginData")) {
        try {
          var data = await SecureStore.getItemAsync("loginData");
          // console.log(data);
          const response = await loginInstance.post("/auth/mobileLogin", data, {
            headers: {
              applicationCode: "LOGIN",
              "Content-Type": "application/json",
            },
          });
          await AsyncStorage.setItem("token", response.data.token);
          // console.log("Logged in from try local sign in");
          token = {
            jwt: await AsyncStorage.getItem("token"),
            content: jwtDecode(await AsyncStorage.getItem("token")),
          };
          dispatch({ type: "signin", payload: token });
          console.log("Logged in with saved credentials...");
        } catch (err) {
          console.log(err);
          dispatch({
            type: "add_error",
            payload: "Something went wrong with sign in...",
          });
        }
      } else {
        navigate("Login");
      }
      // ## END - try local sign in if token expired ###
    }
  } else {
    console.log("token not found");
    // tryLocalSignin();
    navigate("Login");
  }
};

const clearErrorMessage = (dispatch) => () => {
  dispatch({ type: "clear_error_message" });
};

const getToken = (dispatch) => async () => {
  var token = {
    jwt: await AsyncStorage.getItem("token"),
    content: jwtDecode(await AsyncStorage.getItem("token")),
  };
  console.log("get token",token.content)
  try {
    if (token) {
      console.log("inside get token");
      var tokenExpirationTime = token.content.exp;

      if (tokenExpirationTime > new Date().getTime() / 1000) {
        console.log("token not expired when getToken is called");
        dispatch({ type: "get_token", payload: token });
      } else {
        tryLocalSignin(); // This code does not work
      }
    } else {
      tryLocalSignin(); // This code does not work
    }
  } catch (err) {
    console.log(err);
  }
};

const signin =
  (dispatch) =>
  async ({ email, password, tenantId }) => {
   // console.log("sign in called");
  // alert("sign in called")
    //get unique device token
    let uniqueDeviceToken = await registerForPushNotificationsAsync();
   // console.log("Unique device token : " , uniqueDeviceToken)
    // alert("Unique device token :"+uniqueDeviceToken);
   
    let data = JSON.stringify({
      userName: email,
      password: password,
      tenantOrClientId: tenantId,
      deviceToken: uniqueDeviceToken,
    });
    // console.log(data);
    
    try {
      const response = await loginInstance.post("/auth/mobileLogin", data, {
        headers: {
          applicationCode: "LOGIN",
          "Content-Type": "application/json",
        },
      });
       //  alert("Inside try block")
      console.log("Inside try block");
      await AsyncStorage.setItem("token", response.data.token);
    //  console.log("login screen",await AsyncStorage.getItem("token"));
      await SecureStore.setItemAsync("loginData", data);
     // console.log("secure store set item",SecureStore.setItemAsync("loginData", data))

      let token = {
        content: jwtDecode(response.data.token),
        jwt: response.data.token,
        status: response.status,
      };
    //  alert(response.data.token)
      // console.log("token msg",response.data.token);
      // console.log(await AsyncStorage.getItem("token"));
      dispatch({ type: "signin", payload: token });

      // await AsyncStorage.setItem("loginData", data);

      let opsxProps = {
        lastRouteName: "Login",
      };
    //  alert("navigating home page")
      navigate("HomePage", opsxProps);
    } catch (err) {
      console.log(err);
     
      dispatch({
        type: "add_error",
        payload: "Something went wrong with sign in...",
      });
    }
  };

const softSignIn =
  (dispatch) =>
  async ({ email, password, tenantId }) => {
    console.log("soft sign in called");
    // console.log(email + ";" + password + ";" + tenantId);
    //get unique device token
    let uniqueDeviceToken = await registerForPushNotificationsAsync();

    let data = JSON.stringify({
      userName: email,
      password: password,
      tenantOrClientId: tenantId,
      deviceToken: uniqueDeviceToken,
    });
    // console.log(data);
    try {
      const response = await loginInstance.post("/auth/mobileLogin", data, {
        headers: {
          applicationCode: "LOGIN",
          "Content-Type": "application/json",
        },
      });

      console.log("Inside try block");

      let softSignInResponse = {
        status: response.status,
      };
      console.log("Soft sign in response : " + response.status);
      dispatch({ type: "softSignIn", payload: softSignInResponse });
    } catch (err) {
      console.log(err);
      let softSignInResponse = {
        status: err.response.status,
      };
      dispatch({
        // type: "add_error",
        // payload: "Something went wrong with sign in...",
        type: "softSignIn",
        payload: softSignInResponse,
      });
    }
  };

const signout = (dispatch) => {
  console.log("Authcontext screen sign out")
 // console.log("sign out hook",token)
  return async () => {
    let token = null;
  (await AsyncStorage.getItem("token"))
    ? (token = {
        jwt: await AsyncStorage.getItem("token"),
        content: jwtDecode(await AsyncStorage.getItem("token")),
      })
    : (token = null);
    
    await AsyncStorage.removeItem("token");
    
    await SecureStore.deleteItemAsync("loginData");
   
    dispatch({ type: "signout", payload: token});
   // console.log("dispatch", dispatch.type)
    //console.log('Data removed')
    let opsxProps = {
      lastRouteName: "HomePage",
      loggedOut: true,
    };
    //console.log("opsx probs", opsxProps)
    navigate("Login", opsxProps);
  };
};

const buildOpsxApi = (dispatch) => async () => {
  let tokenContent = jwtDecode(await AsyncStorage.getItem("token"));
  console.log("build opsx api called");

  // Enable following block for testing if required
  // console.log(
  //   "https://" +
  //     tokenContent.serverName +
  //     ":" +
  //     tokenContent.serverPort +
  //     "/" +
  //     tokenContent.serverContextPath +
  //     "/api"
  // );

  const instance = axios.create({
    baseURL:
      "https://" +
      tokenContent.serverName +
      ":" +
      tokenContent.serverPort +
      "/" +
      tokenContent.serverContextPath +
      "/api",
    //For local testing. Do not remove
    // baseURL: "http://e3c5-49-207-226-172.ngrok.io/api",
  });
  dispatch({ type: "opsxApi", payload: instance });
};

// Function: Get device token - unique identifier of a device
const registerForPushNotificationsAsync = async () => {

  let deviceToken;
  if (Device.isDevice) {
   
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();

    let finalStatus = existingStatus;
   // alert(finalStatus)
   // alert("hook screen case 1"+finalStatus)
  //  console.log("hook screen case 1",finalStatus)

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
     // alert(finalStatus)
     // alert("hook screen case 2"+finalStatus)

    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    deviceToken = (await Notifications.getExpoPushTokenAsync({'projectId': Constants.expoConfig.extra.eas.projectId,})).data;
    
  //  alert("divice token"+deviceToken)
     //console.log("device token",deviceToken);
  } else {
   // alert("return modal name"+Device.modelName)
    console.log("return modal name",Device.modelName)
    // alert("Must use physical device for Push Notifications");
    return Device.modelName;
  }

  return deviceToken;
};

export const { Provider, Context } = createDataContext(
  authReducer,
  {
    signin,
    softSignIn,
    signout,
    clearErrorMessage,
    tryLocalSignin,
    getToken,
    validateToken,
    buildOpsxApi,
  },
  {
    token: null,
    errorMessage: "",
    tokenContent: "",
    softSignInResponse: null,
    opsxApi: null,
    isTokenValid: null, // added 01-MAR-2022
  }
);
