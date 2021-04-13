import React, { useState} from 'react';
import { Image, View ,ScrollView , StyleSheet, Alert } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

const style = StyleSheet.create({
  navbar:{
    flex: 1,
    backgroundColor: "#a3a3a3",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  scroll_view:{
    width: "100%",
    flexDirection: "row",  
    justifyContent: "center",
    alignItems: "center"
  },
  item_div:{
    marginLeft: 30,
  },
  image:{
    height: "100%",
    aspectRatio: 1,
  }
})

export default function Navbar(){
  const prop = useSelector(state => state);
  const dispatch =useDispatch();

  return(
    <View style={style.navbar}>
        <View style={style.item_div}
          onStartShouldSetResponder={ ()=>{ dispatch({ type: 'PAGE_CHANGE' , payload:"main"}); }}
        >
          <Image style={style.image} source={require("../assets/chat.png")} />
        </View> 
        <View style={style.item_div}
          onStartShouldSetResponder = { ()=>{ dispatch({  type: 'PAGE_CHANGE' , payload:"home"}) } }
        >
          <Image style={style.image} source={require("../assets/user.png")} />
        </View>
    </View>
  )
}

