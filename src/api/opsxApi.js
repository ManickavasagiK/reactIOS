import axios from "axios";
import React, { useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Context as AuthContext } from "../context/AuthContext";

const serverName = "";
const serverPort = "";
const serverContextPath = "";

const opsxApi = () => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);
  const serverDetails = {
    serverName: token.content.serverName,
    serverPort: token.content.serverPort,
    serverContextPath: token.content.serverContextPath,
  };
  return serverDetails;
};

const instance = axios.create({
  baseURL: "https://188.166.217.165:8080/hexcm-cloud-0.0.1-SNAPSHOT/api",
  // baseURL: "http://9e09-117-221-225-140.ngrok.io/api",
  //   baseURL:
  //     "http://" +
  //     serverName +
  //     ":" +
  //     serverPort +
  //     "/" +
  //     serverContextPath +
  //     "/api",
});

instance.interceptors.request.use(
  async (config) => {
    // console.log(config);
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;
