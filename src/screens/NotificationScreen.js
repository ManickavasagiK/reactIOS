import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TouchableHighlight,
  BackHandler,
  Appearance,
} from "react-native";
import {
  Appbar,
  Avatar,
  Snackbar,
  Provider,
  Text,
  Title,
  Subheading,
  Caption,
  Card,
  Button,
} from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Context as AuthContext } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { navigate } from "../navigationRef";
import useNotificationResults from "../hooks/useNotificationResults";

const getCurrentAppearanceMode = () => Appearance.getColorScheme(); // ADDED ON 27/11/2023 by POOBALAN
const NotificationScreen = (props) => {
  const {
    state: { token },
    validateToken,
  } = useContext(AuthContext);

  const [
    getNotificationsForUser,
    notificationsForUserResults,
    changeNotificationToRead,
    changeNotificationToReadResults,
    deleteNotification,
    deleteNotificationResults,
    getCountOfUnreadNotifications,
    countOfUnreadNotificationResults,
    notificationErrorMessage,
  ] = useNotificationResults();

  let opsxProps = {};
  const currentMode = getCurrentAppearanceMode(); // ADDED ON 27/11/2023 by POOBALAN
  //snack bar
  const [snackBarVisible, setSnackBarVisible] = useState(false);
  const [snackBarText, setSnackBarText] = useState("");
  const onDismissSnackBar = () => {
    setSnackBarVisible(false);
    setSnackBarText("");
  };

  // flat list
  const [flatListData, setFlatListData] = useState([]);

  useEffect(() => {
    // console.log(props.navigation);
    console.log("Notifications UE1");
    validateToken();
    getNotificationsForUser(token.jwt, token.content.employeeNumber);

    //handling backpress - should be last block of code for this useEffect
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () =>
      props.navigation.goBack()
    );

    return () => {
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    console.log("Notifications UE2");
    if (notificationsForUserResults.data) {
      // console.log(notificationsForUserResults.data[0]);
      setFlatListData(notificationsForUserResults.data);
    }
  }, [notificationsForUserResults]);

  useEffect(() => {
    console.log("Notifications UE3");
    if (notificationErrorMessage.notificationErrorMessage) {
      setSnackBarText(notificationErrorMessage.message);
      setSnackBarVisible(true);
      console.log(notificationErrorMessage);
    }
  }, [notificationErrorMessage]);

  const renderItem = ({ item }) => (
    <Item
      id={item.notificationId}
      title={item.notificationTitle}
      body={item.notificationBody}
      notificationType={item.notificationType}
      notificationReadStatus={item.notificationReadStatus}
    />
  );

  const leftSwipeActions = () => {
    return (
      <View
        style={{
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "flex-start",
        }}
      >
        <Button icon="delete-sweep" mode="text">
          Delete
        </Button>
      </View>
    );
  };

  const rightSwipeActions = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "transparent",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Button icon="check" mode="text">
          Mark Read
        </Button>
      </View>
    );
  };
  const styles = StyleSheet.create({
    flatListItemRead: {
      // backgroundColor: "#f0e6ff",

      // padding: 10,
      marginVertical: 2,
      marginHorizontal: 5,
      borderRadius: 5,
    },
    notificationCardHeaderRead: {
      borderLeftWidth: 1,
      borderLeftColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", //"#3399FF", ADDED
      borderBottomWidth: 2,
      borderBottomColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", //"#3399FF",
      shadowColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", // "#3399FF",
      backgroundColor: currentMode === "dark" ? "gray" : "#ffffff", // backgroundColor: "#ffffff",
    },
    notificationCardHeaderUnread: {
      borderLeftWidth: 1,
      borderLeftColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", //borderLeftColor: "#3399FF",
      borderBottomWidth: 2,
      borderBottomColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", //borderBottomColor: "#3399FF",
      shadowColor: currentMode === "dark" ? " #1d1b1e" : "#3399FF", //"#3399FF",
      backgroundColor: currentMode === "dark" ? "gray" : "#ffffff", //backgroundColor: "#ffffff",
    },
    notificationCardContent: {
      borderLeftWidth: 1,
      borderLeftColor: "#3399FF",
      borderBottomWidth: 1,
      borderBottomColor: "#006600",
      shadowColor: "#3399FF",
      //backgroundColor: "#ffffff",
    },
  });
  const Item = ({
    id,
    title,
    body,
    notificationType,
    notificationReadStatus,
  }) => {
    return (
      <Swipeable
        renderLeftActions={leftSwipeActions}
        renderRightActions={rightSwipeActions}
        onSwipeableRightOpen={() => {
          changeNotificationToRead(token.jwt, id);
          changeFlatListNotificationsToRead(id);
        }}
        onSwipeableLeftOpen={() => {
          deleteNotification(token.jwt, id);
          deleteFromNotificationFlatList(id);
        }}
      >
        <TouchableHighlight
          style={styles.flatListItemRead}
          activeOpacity={0.4}
          underlayColor={"#8833ff"}
          onPress={() => {
            console.log(body);
          }}
          onLongPress={() => {
            // nothing happens here
          }}
        >
          <Card
            style={
              notificationReadStatus === "YES"
                ? styles.notificationCardHeaderRead
                : styles.notificationCardHeaderUnread
            }
            mode="elevated"
          >
            <Card.Title
              title={title}
              titleStyle={{
                fontSize: 15,
                color: currentMode === "dark" ? "white" : "black",
              }} // ADDED ON 27/11/2023 by POOBALAN
              titleNumberOfLines={2}
              subtitle={body}
              subtitleStyle={{
                fontSize: 15,
                color: currentMode === "dark" ? "white" : "black",
              }} // ADDED ON 27/11/2023 by POOBALAN
              subtitleNumberOfLines={2}
              left={() =>
                notificationType === "TASK" ? (
                  <Avatar.Icon icon="playlist-plus" size={40} />
                ) : notificationType === "CHECKLIST" ? (
                  <Avatar.Icon icon="clipboard-check" size={40} />
                ) : (
                  <Avatar.Icon icon="folder" size={40} />
                )
              }
              // right={}
            ></Card.Title>
          </Card>
        </TouchableHighlight>
      </Swipeable>
    );
  };

  const notificationCardLeftContent = (props) => {
    // console.log(props);
    return <Avatar.Icon {...props} icon="folder" />;
  };

  const deleteFromNotificationFlatList = (id) => {
    let tempArray = [...flatListData]; // without ... array location will not change for state to re-render => not working yet
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].notificationId === id) {
        console.log(
          "id = " + tempArray[i].notificationId + " ; " + "key = " + i
        );
        tempArray.splice(i, 1);
      }
    }
    setFlatListData(tempArray);
  };

  const changeFlatListNotificationsToRead = (id) => {
    let tempArray = [...flatListData];
    for (let i = 0; i < tempArray.length; i++) {
      if (tempArray[i].notificationId === id) {
        tempArray[i].notificationReadStatus = "YES";
      }
    }
    setFlatListData(tempArray);
  };

  return (
    <>
      <Appbar.Header>
        <TouchableOpacity
          onPress={() => {
            opsxProps = {
              lastRouteName: props.navigation.state.routeName,
              snackBarText: "",
            };
            navigate(props.navigation.state.params.lastRouteName);
          }}
          style={{ paddingLeft: 10 }}
        >
          <Ionicons
            name="ios-arrow-back"
            size={24}
            color={currentMode === "dark" ? "white" : "black"} // ADDED ON 27/11/2023 by POOBALAN
          />
        </TouchableOpacity>

        <Appbar.Content title="Notifications" />
      </Appbar.Header>
      <Provider>
        <View
          style={{
            backgroundColor: currentMode === "dark" ? "#424242" : "#f2f2f2", //ADDED
            flex: 1,
          }}
        >
          <FlatList
            data={flatListData}
            // extraData={flatListData}
            renderItem={renderItem}
            // keyExtractor={(item) => item.employeeId}
            keyExtractor={(item, index) => index.toString()}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            keyboardDismissMode="on-drag"
          />
          <Snackbar
            visible={snackBarVisible}
            onDismiss={onDismissSnackBar}
            duration={3000}
            action={{
              label: "Ok",
              onPress: () => {
                // Do something
              },
            }}
          >
            {snackBarText}
          </Snackbar>
        </View>
      </Provider>
    </>
  );
};

/*const styles = StyleSheet.create({
  flatListItemRead: {
    // backgroundColor: "#f0e6ff",

    // padding: 10,
    marginVertical: 2,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  notificationCardHeaderRead: {
    borderLeftWidth: 1,
    borderLeftColor: "#3399FF",
    borderBottomWidth: 2,
    borderBottomColor: "#3399FF",
    shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
  notificationCardHeaderUnread: {
    borderLeftWidth: 1,
    borderLeftColor: "#3399FF",
    borderBottomWidth: 2,
    borderBottomColor: "#3399FF",
    shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
  notificationCardContent: {
    borderLeftWidth: 1,
    borderLeftColor: "#3399FF",
    borderBottomWidth: 1,
    borderBottomColor: "#006600",
    shadowColor: "#3399FF",
    backgroundColor: "#ffffff",
  },
});
*/
export default NotificationScreen;
