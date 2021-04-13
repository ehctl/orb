import axios from '../m_axios';
import React from 'react';
import { useRef , useState , useEffect } from 'react';
import { Dimensions, Image, FlatList , KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Keyboard } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import setting from '../setting';

const style = StyleSheet.create({
  login_container:{
    height: '95%',
    backgroundColor: 'grey'
  }, 
  header:{
    width: '100%',
    textAlign: 'center',
    fontSize: 30,
    color: 'white',
  },
  form_container:{
    marginTop: "10%",
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  text_input:{
    fontSize: 20,
    color: 'grey',
    marginVertical: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    width: '70%',
    height: '15%',
    textAlign: 'center'
  },
  login_button:{
    borderRadius: 10,
    backgroundColor: 'blue',
    width: '80%',
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default function Login(){
  const dispatch = useDispatch();
  const [ userName , setUserName ] = useState('tuanlinh');
  const [ password , setPassword ] = useState('tl');
  const [ warning  , setWarning ] = useState('');

  const login = async ()=>{ 
    const t = { userName,password };
    let uu = t.userName;
    let pp = t.password;
    if( userName){
      if( password){
        try{
          let response = await axios.get(setting.url +'/user/login',
          {
            params:{
              u: uu,
              p: pp,
            }
          });
          
          if( warning){
            setWarning('');
          }

          dispatch({
            type: 'LOGIN_SUCCESSFUL',
            payload: response.data,
          })
        }catch(err){
          setWarning("Login failed")
        }
        
      }else{
        setWarning('Password cannot empty')
      }
    }else{
      setWarning('Username cannot empty')
    }
  }

  return(
    <View style={style.login_container} onStartShouldSetResponder={Keyboard.dismiss}>
      <Text style={ style.header}> Welcome to Orb!!!</Text>
      <Text style={ style.header}> Welcome ,welcome !!!</Text>
      <Text style={ style.header}> First you need to login</Text>

      <View style={style.form_container}>
        <TextInput style={style.text_input} defaultValue="tuanlinh" placeholder='Username...' onChangeText={(text)=>{setUserName(text)}}/>
        <TextInput secureTextEntry={true} defaultValue="tl" style={style.text_input} placeholder='Password...' onChangeText={(text)=>{setPassword(text)}}/>
        <Text style={{color:'red'}}> {warning} </Text>
        <TouchableOpacity style={style.login_button} onPress={login}>
          <Text style={{fontSize: 30,}}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}