import React, { createContext, useContext, useState } from 'react';
import { Snackbar, Avatar } from "react-native-paper";
import { Dimensions, TouchableHighlight, Text, View } from 'react-native';
import { Modal } from 'react-native';
const SnackbarContext = createContext();


export const SnackbarProvider = ({ children }) => {
  const [snackbar, setSnackbar] = useState(false);
  

  const [snackBarMode,setSnackBarMode]=useState("SUCCESS")
  const showSnackbar = (message) => {
    setSnackbar({ message });
  };
  

  return (
    <SnackbarContext.Provider  value={{ showSnackbar}}>
      {children}


      <View style={{ position: "absolute",
    bottom: 0,
    marginTop: 20,}}>
        <Snackbar
          visible={snackbar}
          onDismiss={()=>setSnackbar(false)}
          duration={2000}
          action={{
            onPress: () => {},
          }}
        >
          <View style={{flexDirection: "row",
    alignItems: "center",}}>
            <Avatar.Icon size={50} icon="check" style={{ backgroundColor: "green",
    marginRight: 12,}} />
          </View>
        </Snackbar>
      </View>

      
    </SnackbarContext.Provider>





  );
};




export const useSnackbar = () => {
  return useContext(SnackbarContext);
};
// const styles = StyleSheet.create({
//   snackbar: {
//     position: "absolute",
//     bottom: 0,
//     marginTop: 20,
//   },
//   snackbarContent: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   snackbarAvatar: {
//     backgroundColor: "green",
//     marginRight: 12,
//   },
//   snackbarMessage: {
//     flex: 1,
//     fontSize: 16,
//   },
// });
