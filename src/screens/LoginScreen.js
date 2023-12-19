import React, { useContext, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  // TextInput,
  TouchableOpacity,
  Image,
  BackHandler,
  Alert,
  Appearance,
} from "react-native";
import {
  TextInput,
  Portal,
  ActivityIndicator,
  Modal,
} from "react-native-paper";
import { NavigationEvents } from "react-navigation";
import { Context as AuthContext } from "../context/AuthContext";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { navigate } from "../navigationRef";
import Constants from 'expo-constants'
const getCurrentAppearanceMode = () => Appearance.getColorScheme();
//Added by poobalan for Dark and light Mode Theme
//import { black } from "react-native-paper/lib/typescript/styles/themes/v2/colors";
const LoginScreen = (props) => {
  const {
    state: { errorMessage, opsxApi },
    signin,
    clearErrorMessage,
    tryLocalSignin,
    buildOpsxApi,
  } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [tenantId, setTenantId] = useState("");
  var errorText = errorMessage; // changed state.errorMessage to errorMessage as state is deconstructed

  //activity indicator - initial value is true - waits for the api calls to be completed. Changes to false in useEffect.
  const [activityIndicatorAnimating, setActivityIndicatorAnimating] =
    useState(false);
  const [activityIndicatorModalVisible, setActivityIndicatorModalVisible] =
    useState(false);

  // secure password based on user preference
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  // 10-NOV-2022 - Try to request token access in login screen
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  useEffect(() => {
    //try local sign in

    tryLocalSignin();

    return () => {
      console.log("unmounting log in screen");
      setActivityIndicatorAnimating(false);
      setActivityIndicatorModalVisible(false);
    };
  }, []);

  useEffect(() => {
    // blank out variables after sign out
    setEmail("");
    setPassword("");
    setTenantId("");
    // Following code block is to handle a localSignIn when app is brought to foreground
    // If there is a better fix, this block to be removed. Date added 01-March-2022
    // #### STARTS #####
    if (props.navigation.state.params) {
      if (props.navigation.state.params.appStateChange) {
        tryLocalSignin();
      }
    }
    // #### ENDS #####
  }, [props]);

  const hideActivityIndicatorModal = () => {
    setActivityIndicatorModalVisible(false);
  };

  const backAction = () => {
    Alert.alert("Exit App!", "Are you sure you want to exit OpsX?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "Yes", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  useEffect(() => {
    console.log("Login screen back handler UE2");

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      backHandler.remove();
    };
  }, [props]);

  // 10-NOV-2022 - Try to request token access in login screen
  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );
  }, []);

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
     
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
        alert("case 2 existingStatus not granted ",)
      }
      if (finalStatus !== "granted") {
        
        alert("Failed to get push token for push notification!");
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({'projectId': Constants.expoConfig.extra.eas.projectId,})).data;
      console.log("Push notification login screen",token);
      
     
      
    } else {
      
      alert("Must use physical device for Push Notifications");
    }

    return token;
  }
  const currentMode = getCurrentAppearanceMode();
  //Added by poobalan for Dark and light Mode Theme
  // useEffect(() => {
  //   console.log("API value changed");
  // }, [opsxApi]);

  return (
    <>
      <Portal>
        {/*This modal is not functional - 10-DEC-2022 */}
        <Modal
          visible={activityIndicatorModalVisible}
          onDismiss={hideActivityIndicatorModal}
          theme={{
            colors: {
              backdrop: "transparent",
            },
          }}
        >
          <ActivityIndicator
            animating={activityIndicatorAnimating}
            size="large"
          />
        </Modal>
      </Portal>
      <View
        style={[
          styles.container,
          { backgroundColor: currentMode === "dark" ? "#424242" : "white" },
        ]}
      >
        <Image
          source={require("../images/logo.png")}
          style={{ marginBottom: 40 }}
        />
        <NavigationEvents onWillBlur={clearErrorMessage} />
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            // placeholder="Username / Email"
            label="Username / Email"
            mode="outlined"
            placeholderTextColor="#003f5c"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            secureTextEntry={isPasswordSecure}
            style={styles.inputText}
            // placeholder="Password"
            label="Password"
            mode="outlined"
            placeholderTextColor="#003f5c"
            autoCapitalize="none"
            autoCorrect={false}
            value={password}
            onChangeText={setPassword}
            right={
              <TextInput.Icon
                icon={isPasswordSecure ? "eye" : "eye-off"}
             //   iconColor="black"
             //  color={"#a300ee"}
                onPressIn={() => {
                  isPasswordSecure
                    ? setIsPasswordSecure(false)
                    : setIsPasswordSecure(true);
                }}
              />
            }
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.inputText}
            // placeholder="Tenant ID"
            label="Tenant ID"
            mode="outlined"
            placeholderTextColor="#003f5c"
            autoCapitalize="characters"
            autoCorrect={false}
            value={tenantId}
            onChangeText={setTenantId}
          />
        </View>
        {/* changed state.errorMessage to errorMessage in the next 2 lines as state is deconstructed */}
        {errorMessage ? (
          <Text style={styles.errorMessage}> {errorMessage} </Text>
        ) : null}

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => {
            // setActivityIndicatorAnimating(true);
            // setActivityIndicatorModalVisible(true);

            signin({ email, password, tenantId });
          }}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <View style={[styles.companyName]}>
          <Text style={{ color: currentMode === "dark" ? "white" : "black" }}>
            A product from HexCM
          </Text>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 50,
    color: "#fb5b5a",
    marginBottom: 40,
  },
  inputView: {
    width: "80%",
    borderRadius: 5,
    height: 50,
    marginBottom: 20,
    justifyContent: "center",
    // padding: 20,
    // borderWidth: 1,
    borderColor: "#000",
    // fontSize: 35,
  },
  inputText: {
    width: "100%",
    height: 60,
    // following 3 lines to fix text cutoff issue in android
    // untested as of 08-NOV-2022
    padding: 0,
    margin: 0,
    borderWidth: 0,
  },
  forgot: {
    color: "white",
    fontSize: 11,
  },
  loginBtn: {
    width: "80%",
    backgroundColor: "#fb5b5a",
    borderRadius: 5,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
    fontSize: 55,
  },
  loginText: {
    color: "white",
  },
  companyName: {
    alignItems: "center",
    justifyContent: "center",
    left: 0,
    right: 0,
    bottom: 10,
    top: 50,
  },
  errorMessage: {
    fontSize: 16,
    color: "red",
    // marginLeft: 5,
    // marginTop: 5
  },
});

export default LoginScreen;
