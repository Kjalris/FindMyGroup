import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { Image, StyleSheet, View , TextInput} from 'react-native';
import AppButton from "./AppButton";



export default class CreateGroup extends React.Component{
    constructor(props){
        super(props);
        this.state ={groupname:"", password:""}

        
    }

   


    render(){
        return(
            <View style={styled.container}>
                <TextInput  style={styled.textfield} 
                type={"TextInput"} 
                placeholder={"Group Name"} 
                onChangeText={(groupname) => this.setState({ groupname })}
                underlineColorAndroid='transparent'
                />
                <TextInput style={styled.textfield} 
                type={"TextInput"} 
                secureTextEntry={true} 
                placeholder={"Password"} 
                onChangeText={(password) => this.setState({ password })}
                underlineColorAndroid='transparent'/>
                <AppButton title="Create Group" onPress={() => {
                    this.props.navigation.navigate('Map');
                    }}/>
            </View>
            
        );
    }

}

   

const styled = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#809C55",
        
      },
      textfield:{
        color: '#000',
        paddingRight: 5,
        paddingLeft: 5,
        fontSize: 14,
        lineHeight: 23,
        height: 40,
        margin: 12,
       


      }
});