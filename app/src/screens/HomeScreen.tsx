import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import logo from './images/LOGO.png';
import AppButton from "./AppButton";


export default class HomeScreen extends React.Component<{
  navigation: NativeStackNavigationProp<{}>;
}> {
  render() {
    return (
      <View style={styles.container}>
          <Image style={styles.logo} source={logo}/>

        <AppButton title="Create Group" onPress={() => {
            this.props.navigation.navigate('CreateGroup');
          }}/>
          

        <AppButton title="Join Group" onPress={() => {
            this.props.navigation.navigate('Map');
          }}/>
       
       
        
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:"#809C55",
    justifyContent: "center",
    
    
  },
  logo:{
    resizeMode: 'contain',
    alignItems: 'center',
    left:70
    


  },
  
  

  
});