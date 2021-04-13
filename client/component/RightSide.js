import React, { useEffect, useLayoutEffect, useRef, useState} from 'react';
import { render } from 'react-dom';
import { Dimensions, Image, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux'; 

import AddAndJoinRoom from './AddAndJoinRoom';
import ChatRoom from './ChatRoom';

const axios = require("../m_axios");

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#696969',
  },
});

export default function RightSide(){
  const props  = useSelector(state =>{
    return({
        currentRoomID: state.currentRoomID,
      })
  })

  let renderRoom = ()=>{
    if( !props.currentRoomID || props.currentRoomID === '-1'){
      return(
        <AddAndJoinRoom />
      )
    }else{
      return(
        <ChatRoom />
      )
    }
  }

  return(
    <View style={style.container}>
      {renderRoom()}
    </View>
  )
}

