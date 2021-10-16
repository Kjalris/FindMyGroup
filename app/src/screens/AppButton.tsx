import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";




export default function AppButton(props){
    TouchableOpacity.defaultProps = { activeOpacity: 0.8 };
    return(
    <TouchableOpacity onPress={props.onPress} 
    style={styles.appButtonContainer}
    >
      <Text style={styles.appButtonText}>{props.title}</Text>
    </TouchableOpacity>
  );
}

  const styles = StyleSheet.create({
    // ...
    appButtonContainer: {
      elevation: 8,
      backgroundColor: "#008A9B",
      borderRadius: 10,
      paddingVertical: 10,
      paddingHorizontal: 12,
      left:65,
      height:80,
      width:250,
      shadowColor:"#0000",
      margin:20
          
    },
    appButtonText: {
      fontSize: 32,
      color: "#FFE7B0",
      fontWeight: "bold",
      alignSelf: "center",
      
    }
  });

