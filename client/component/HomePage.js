import React, { Component, useState} from 'react';
import { Text,SafeAreaView , StyleSheet, View, Alert } from 'react-native';

import { useSelector, useDispatch ,connect  } from "react-redux";

import Navbar from './Navbar';
import Body from './Body';
import Header from './Header';
import Login from './Login';
import Updater from './Updater';

const style = StyleSheet.create({
  home_page:{
    flex: 1,
    height: '100%'
  }
})

const HomePage = ()=>{ 
  const props = useSelector( state =>{
    return({
      logged_in : state.logged_in,
    })
  })
  
  const render = ()=>{
    if( props.logged_in ){
      return(
        <View>
          <Updater />
          <Header />
          <Navbar />
          <Body />
        </View>
      )
    }else{
      return(
        <View>
          <Header />
          <Login />
        </View>
      )
    }
  }

  return(
    <SafeAreaView style={style.home_page}>
     { render() }
    </SafeAreaView>
  )
}

export default HomePage;

