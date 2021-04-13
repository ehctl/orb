import React from 'react';
import { Image, View , Text, TouchableOpacity  } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

let style = {
  header:{
    backgroundColor: "#35546F",
    width: "100%",
    height: "5%",
    flexDirection: "row" ,
  },
  header_text:{
    width: "100%",
    textAlign: "center",
    fontFamily: "Cochin",
    fontSize: 30,
    
  },
  header_image:{
    position: "absolute",
    height: "100%",
    marginLeft: 10,
    zIndex: 1,
  }
}

export default function Header(){
  const props = useSelector(state => (
    {
    logged_in : state.logged_in,
    }
  ));


  const dispatch =useDispatch();

  const onIconPress = ()=>{
    if( props.logged_in){
      dispatch({
        type: 'PAGE_CHANGE' , 
        payload:"main"
      })
    }
  }

  return(
    <View style={style.header} >
      <TouchableOpacity style={style.header_image} onPress={onIconPress}>
        <Image style={{height:"100%",aspectRatio: 1}}  source={require("../assets/orb.png")} /> 
      </TouchableOpacity>
      
      <Text style={style.header_text}> Orb</Text>
    </View>  
  )
}
