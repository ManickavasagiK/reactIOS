import React, { useState, useEffect,useRef} from 'react'; 
import { View, StyleSheet, Text, Easing,Appearance} from 'react-native'; 
import { Divider,
  Appbar,
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Modal,
  Portal,
  Provider,
  Caption,
  Switch,
  TextInput,
  Snackbar,
  ActivityIndicator,
  useTheme } from 'react-native-paper';
  import Svg, { Rect } from 'react-native-svg';
  import ContentLoader, { Circle} from 'react-content-loader/native'
//import ContentLoader from 'react-native-masked-loader';
  import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
  //import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
 // import theme from '@/theme'
 // import { StyleSheet } from "react-native";
//import Animated from "react-native-reanimated";
  //import { Skeleton } from "@mui/material"; 
 // import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
  import { MaterialCommunityIcons } from "@expo/vector-icons";
  import { List } from 'react-content-loader'
  const getCurrentAppearanceMode = () => Appearance.getColorScheme(); // ADDED ON 06/12/2023 BY POOBALAN
 const Skeletoncard=()=>{
  const theme = useTheme();
 
  
  

  const currentMode = getCurrentAppearanceMode();
return(
    <>
       
       <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", 
          // backgroundColor: "#f0e6ff",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
        
          <ContentLoader
    height={150}
    speed={0.5}
    // backgroundColor={'#AF7AC5'}
    // foregroundColor={'#F6F6F6'}
    // backgroundColor={'#e1dcf2'}
    // foregroundColor={'#1d1b1e'}
    backgroundColor={currentMode== "dark" ?'#e1dcf2':'#AF7AC5'}
    foregroundColor={currentMode== "dark" ?'#1d1b1e':'#F6F6F6'}
    viewBox="0 0 380 80"
  >
    
   
    <Rect x="0" y="17" rx="4" ry="4" width="300" height="13"/>
    <Rect x="0" y="40" rx="3" ry="3" width="250" height="10"/>
    <Rect x="0" y="60" rx="3" ry="3" width="300" height="10"/>
    <Rect x="0" y="80" rx="3" ry="3" width="200" height="10"/>
    <Divider style={{ backgroundColor: "#8080ff" }} />
    <Circle cx="270" cy="100" r="15" />
    <Circle cx="305" cy="100" r="15" />
    <Circle cx="340" cy="100" r="15" />
    
   
  </ContentLoader>
          
       
         
</Card.Content>
    
      </Card>
      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", 
          // backgroundColor: "#f0e6ff",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
        
          <ContentLoader
    height={150}
    speed={0.5}
    // backgroundColor={'#AF7AC5'}
    // foregroundColor={'#F6F6F6'}
    // backgroundColor={'#e1dcf2'}
    // foregroundColor={'#1d1b1e'}
    backgroundColor={currentMode== "dark" ?'#e1dcf2':'#AF7AC5'}
    foregroundColor={currentMode== "dark" ?'#1d1b1e':'#F6F6F6'}
    viewBox="0 0 380 80"
  >
    
   
    <Rect x="0" y="17" rx="4" ry="4" width="300" height="13"/>
    <Rect x="0" y="40" rx="3" ry="3" width="250" height="10"/>
    <Rect x="0" y="60" rx="3" ry="3" width="300" height="10"/>
    <Rect x="0" y="80" rx="3" ry="3" width="200" height="10"/>
    <Divider style={{ backgroundColor: "#8080ff" }} />
    <Circle cx="270" cy="100" r="15" />
    <Circle cx="305" cy="100" r="15" />
    <Circle cx="340" cy="100" r="15" />
    
   
  </ContentLoader>
          
       
         
</Card.Content>
    
      </Card>
      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", 
          // backgroundColor: "#f0e6ff",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
        
          <ContentLoader
    height={150}
    speed={0.5}
    // backgroundColor={'#AF7AC5'}
    // foregroundColor={'#F6F6F6'}
    // backgroundColor={'#e1dcf2'}
    // foregroundColor={'#1d1b1e'}
    backgroundColor={currentMode== "dark" ?'#e1dcf2':'#AF7AC5'}
    foregroundColor={currentMode== "dark" ?'#1d1b1e':'#F6F6F6'}
    viewBox="0 0 380 80"
  >
    
   
    <Rect x="0" y="17" rx="4" ry="4" width="300" height="13"/>
    <Rect x="0" y="40" rx="3" ry="3" width="250" height="10"/>
    <Rect x="0" y="60" rx="3" ry="3" width="300" height="10"/>
    <Rect x="0" y="80" rx="3" ry="3" width="200" height="10"/>
    <Divider style={{ backgroundColor: "#8080ff" }} />
    <Circle cx="270" cy="100" r="15" />
    <Circle cx="305" cy="100" r="15" />
    <Circle cx="340" cy="100" r="15" />
    
   
  </ContentLoader>
          
       
         
</Card.Content>
    
      </Card>

      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", 
          // backgroundColor: "#f0e6ff",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
        
          <ContentLoader
    height={150}
    speed={0.5}
    // backgroundColor={'#AF7AC5'}
    // foregroundColor={'#F6F6F6'}
    // backgroundColor={'#e1dcf2'}
    // foregroundColor={'#1d1b1e'}
    backgroundColor={currentMode== "dark" ?'#e1dcf2':'#AF7AC5'}
    foregroundColor={currentMode== "dark" ?'#1d1b1e':'#F6F6F6'}
    viewBox="0 0 380 80"
  >
    
   
    <Rect x="0" y="17" rx="4" ry="4" width="300" height="13"/>
    <Rect x="0" y="40" rx="3" ry="3" width="250" height="10"/>
    <Rect x="0" y="60" rx="3" ry="3" width="300" height="10"/>
    <Rect x="0" y="80" rx="3" ry="3" width="200" height="10"/>
    <Divider style={{ backgroundColor: "#8080ff" }} />
    <Circle cx="270" cy="100" r="15" />
    <Circle cx="305" cy="100" r="15" />
    <Circle cx="340" cy="100" r="15" />
    
   
  </ContentLoader>
          
       
         
</Card.Content>
    
      </Card>

      <Card
        style={{
          marginHorizontal: 10,
          marginTop: 10,
          backgroundColor: currentMode === "dark" ? "#1d1b1e" : "#e1dcf2", 
          // backgroundColor: "#f0e6ff",
        }}
      >
        <Card.Content
          style={{
            backgroundColor: "transparent",
            paddingTop: 0,
            marginTop: 0,
          }}
        >
        
          <ContentLoader
    height={150}
    speed={0.5}
    // backgroundColor={'#AF7AC5'}
    // foregroundColor={'#F6F6F6'}
    // backgroundColor={'#e1dcf2'}
    // foregroundColor={'#1d1b1e'}
    backgroundColor={currentMode== "dark" ?'#e1dcf2':'#AF7AC5'}
    foregroundColor={currentMode== "dark" ?'#1d1b1e':'#F6F6F6'}
    viewBox="0 0 380 80"
  >
    
   
    <Rect x="0" y="17" rx="4" ry="4" width="300" height="13"/>
    <Rect x="0" y="40" rx="3" ry="3" width="250" height="10"/>
    <Rect x="0" y="60" rx="3" ry="3" width="300" height="10"/>
    <Rect x="0" y="80" rx="3" ry="3" width="200" height="10"/>
    <Divider style={{ backgroundColor: "#8080ff" }} />
    <Circle cx="270" cy="100" r="15" />
    <Circle cx="305" cy="100" r="15" />
    <Circle cx="340" cy="100" r="15" />
    
   
  </ContentLoader>
          
       
         
</Card.Content>
    
      </Card>
      
    </>
)
    }

export default Skeletoncard;
const styles = StyleSheet.create({ 
    container: { 
        backgroundColor: '#F6F6F6', 
        borderRadius: 13, 
        padding: 25, 
        marginBottom: 16, 
        marginTop: 50, 
    }, 
    placeholder: { 
        backgroundColor: '#AF7AC5', 
        height: 10, 
        borderRadius: 4, 
        marginBottom: 10, 
       // padding:20
    }, 
    circleplaceholder:{
       
            width: 20,
          height: 20,
         backgroundColor: "#AF7AC5",
         borderRadius: 1000,
         justifyContent: "flex-end",
        //  flex: 1,
       flexDirection: 'row',
        //  alignItems: 'end',
        //  justifyContent: 'flex-start'
          
    },
    container: {
      backgroundColor: '#fff',
      padding: '35px 24px 0 24px',
      height: 285,
    }
    
    
})
