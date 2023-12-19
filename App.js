import { StatusBar } from "expo-status-bar";
import {React} from "react";
import { StyleSheet, Text, View, Appearance  } from "react-native";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import LoginScreen from "./src/screens/LoginScreen";
import { Provider as AuthProvider } from "./src/context/AuthContext";
import {
  configureFonts,
  MD2LightTheme as DefaultLightTheme,
 // MD3LightTheme as DefaultTheme,
////  Provider as PaperProvider,
} from "react-native-paper";
import { setNavigator } from "./src/navigationRef";
import HomeScreen from "./src/screens/HomeScreen";
// import TasksScreen from "./src/screens/TasksScreen";
import PictureScreen from "./src/screens/PictureScreen";
import CameraScreen from "./src/screens/CameraScreen";
import ChecklistScreen from "./src/screens/ChecklistScreen";
import AddTaskScreen from "./src/screens/AddTaskScreen";
import AdminScreen from "./src/screens/AdminScreen";
import ResetPassScreen from "./src/screens/ResetPassScreen";
import ResetTokenScreen from "./src/screens/ResetTokenScreen";
import DashboardDetailScreen from "./src/screens/DashboardDetailScreen";
import EmployeePicUploadScreen from "./src/screens/EmployeePicUploadScreen";
import ChecklistDetailScreen from "./src/screens/ChecklistDetailScreen";
import NotificationScreen from "./src/screens/NotificationScreen";
import ExecutiveDashboardScreen from "./src/screens/ExecutiveDashboardScreen";
//8/12/23 Vasagi added poobalan code for Dark and light Mode 
//import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import {
  DarkTheme,
  DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import { useState,useEffect } from "react";
//import 'expo-dev-client';
// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Text>OpsX</Text>
//       <StatusBar style="auto" />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

const stackNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    HomePage: HomeScreen,
    // Tasks: TasksScreen,
    Pictures: PictureScreen,
    Camera: CameraScreen,
    Checklist: ChecklistScreen,
    AddTask: AddTaskScreen,
    Admin: AdminScreen,
    ResetPass: ResetPassScreen,
    ResetToken: ResetTokenScreen,
    DashboardDetail: DashboardDetailScreen,
    EmployeePicUpload: EmployeePicUploadScreen,
    ChecklistDetail: ChecklistDetailScreen,
    Notification: NotificationScreen,
    ExecutiveDashboard: ExecutiveDashboardScreen,
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      title: "OpsX",
      headerShown: false,
    },
  }
);

const App = createAppContainer(stackNavigator);

const fontConfig = {
  web: {
    thin: {
      fontFamily: "HelveticaNeue-Thin",
      fontSize: 30,
    },
  },
  ios: {
    thin: {
      fontFamily: "HelveticaNeue-Thin",
      fontSize: 30,
    },
  },
  android: {
    thin: {
      fontFamily: "HelveticaNeue-Thin",
      fontSize: 30,
    },
  },
};

// const theme = {
//   ...DefaultTheme,
//   version: 3,
//   fonts: configureFonts(fontConfig),
//   animation: {
//     scale: 1.0,
//   },
//   colors: {
//     primary: "rgb(158, 42, 155)",
//     onPrimary: "rgb(255, 255, 255)",
//     primaryContainer: "rgb(255, 215, 245)",
//     onPrimaryContainer: "rgb(56, 0, 56)",
//     secondary: "rgb(109, 88, 105)",
//     onSecondary: "rgb(255, 255, 255)",
//     secondaryContainer: "rgb(247, 218, 239)",
//     onSecondaryContainer: "rgb(39, 22, 36)",
//     tertiary: "rgb(130, 83, 69)",
//     onTertiary: "rgb(255, 255, 255)",
//     tertiaryContainer: "rgb(255, 219, 209)",
//     onTertiaryContainer: "rgb(50, 18, 8)",
//     error: "rgb(186, 26, 26)",
//     onError: "rgb(255, 255, 255)",
//     errorContainer: "rgb(255, 218, 214)",
//     onErrorContainer: "rgb(65, 0, 2)",
//     background: "rgb(255, 251, 255)",
//     onBackground: "rgb(30, 26, 29)",
//     surface: "rgb(255, 251, 255)",
//     onSurface: "rgb(30, 26, 29)",
//     surfaceVariant: "rgb(238, 222, 231)",
//     onSurfaceVariant: "rgb(78, 68, 75)",
//     outline: "rgb(128, 116, 124)",
//     outlineVariant: "rgb(209, 194, 203)",
//     shadow: "rgb(0, 0, 0)",
//     scrim: "rgb(0, 0, 0)",
//     inverseSurface: "rgb(52, 47, 50)",
//     inverseOnSurface: "rgb(248, 238, 242)",
//     inversePrimary: "rgb(255, 170, 243)",
//     elevation: {
//       level0: "transparent",
//       level1: "rgb(250, 241, 250)",
//       level2: "rgb(247, 234, 247)",
//       level3: "rgb(244, 228, 244)",
//       level4: "rgb(243, 226, 243)",
//       level5: "rgb(241, 222, 241)",
//     },
//     surfaceDisabled: "rgba(30, 26, 29, 0.12)",
//     onSurfaceDisabled: "rgba(30, 26, 29, 0.38)",
//     backdrop: "rgba(55, 46, 52, 0.4)",
//   },
// };

// export default () => {
//   return (
//     <AuthProvider>
//       <PaperProvider
//       // todo - Applying light theme by default is not working
//       // theme={theme}
//       >
//         <App
//           ref={(navigator) => {
//             setNavigator(navigator);
//           }}
//         />
//       </PaperProvider>
//     </AuthProvider>
//   );
// };



//   const theme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "blue",
//     background: "white", // Set your desired background color
//     text: "black", // Set your desired text color
//   },
//   //mode: "light",
// };
//8/12/23 Vasagi added poobalan code for Dark and light Mode
const lightColors = {
  colors: {
    primary: "rgb(120, 69, 172)",
    onPrimary: "rgb(255, 255, 255)",
    primaryContainer: "rgb(240, 219, 255)",
    onPrimaryContainer: "rgb(44, 0, 81)",
    secondary: "rgb(102, 90, 111)",
    onSecondary: "rgb(255, 255, 255)",
    secondaryContainer: "rgb(237, 221, 246)",
    onSecondaryContainer: "rgb(33, 24, 42)",
    tertiary: "rgb(128, 81, 88)",
    onTertiary: "rgb(255, 255, 255)",
    tertiaryContainer: "rgb(255, 217, 221)",
    onTertiaryContainer: "rgb(50, 16, 23)",
    error: "rgb(186, 26, 26)",
    onError: "rgb(255, 255, 255)",
    errorContainer: "rgb(255, 218, 214)",
    onErrorContainer: "rgb(65, 0, 2)",
    background: "rgb(255, 251, 255)",
    onBackground: "rgb(29, 27, 30)",
    surface: "rgb(255, 251, 255)",
    onSurface: "rgb(29, 27, 30)",
    surfaceVariant: "rgb(233, 223, 235)",
    onSurfaceVariant: "rgb(74, 69, 78)",
    outline: "rgb(124, 117, 126)",
    outlineVariant: "rgb(204, 196, 206)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(50, 47, 51)",
    inverseOnSurface: "rgb(245, 239, 244)",
    inversePrimary: "rgb(220, 184, 255)",
    elevation: {
      level0: "transparent",
      level1: "rgb(248, 242, 251)",
      level2: "rgb(244, 236, 248)",
      level3: "rgb(240, 231, 246)",
      level4: "rgb(239, 229, 245)",
      level5: "rgb(236, 226, 243)",
    },
    surfaceDisabled: "rgba(29, 27, 30, 0.12)",
    onSurfaceDisabled: "rgba(29, 27, 30, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
};
const darkColors = {
  colors: {
    primary: "rgb(220, 184, 255)",
    onPrimary: "rgb(71, 12, 122)",
    primaryContainer: "rgb(95, 43, 146)",
    onPrimaryContainer: "rgb(240, 219, 255)",
    secondary: "rgb(208, 193, 218)",
    onSecondary: "rgb(54, 44, 63)",
    secondaryContainer: "rgb(77, 67, 87)",
    onSecondaryContainer: "rgb(237, 221, 246)",
    tertiary: "rgb(243, 183, 190)",
    onTertiary: "rgb(75, 37, 43)",
    tertiaryContainer: "rgb(101, 58, 65)",
    onTertiaryContainer: "rgb(255, 217, 221)",
    error: "rgb(255, 180, 171)",
    onError: "rgb(105, 0, 5)",
    errorContainer: "rgb(147, 0, 10)",
    onErrorContainer: "rgb(255, 180, 171)",
    background: "rgb(29, 27, 30)",
    onBackground: "rgb(231, 225, 229)",
    surface: "rgb(29, 27, 30)",
    onSurface: "rgb(231, 225, 229)",
    surfaceVariant: "rgb(74, 69, 78)",
    onSurfaceVariant: "rgb(204, 196, 206)",
    outline: "rgb(150, 142, 152)",
    outlineVariant: "rgb(74, 69, 78)",
    shadow: "rgb(0, 0, 0)",
    scrim: "rgb(0, 0, 0)",
    inverseSurface: "rgb(231, 225, 229)",
    inverseOnSurface: "rgb(50, 47, 51)",
    inversePrimary: "rgb(120, 69, 172)",
    elevation: {
      level0: "transparent",
      level1: "rgb(39, 35, 41)",
      level2: "rgb(44, 40, 48)",
      level3: "rgb(50, 44, 55)",
      level4: "rgb(52, 46, 57)",
      level5: "rgb(56, 49, 62)",
    },
    surfaceDisabled: "rgba(231, 225, 229, 0.12)",
    onSurfaceDisabled: "rgba(231, 225, 229, 0.38)",
    backdrop: "rgba(51, 47, 55, 0.4)",
  },
};
export default () => {
  //8/12/23 Vasagi added poobalan code for Dark and light Mode 
  const [theme, setTheme] = useState(
    Appearance.getColorScheme() === "dark" ? "dark" : "light"
  );
  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => {
      listener.remove();
    };
  }, []);
  const paperTheme = {
    ...((theme === "dark" ? darkColors : lightColors) || {}),
  };

  return (
    <AuthProvider>
      <PaperProvider 
     // theme={theme}
      >
        <App
          ref={(navigator) => {
            setNavigator(navigator);
          }}
        />
      </PaperProvider>
    </AuthProvider>
  );
};