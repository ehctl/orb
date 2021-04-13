import React from 'react';
import { Image, View , Text ,StyleSheet  } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import setting from '../setting';

let style = StyleSheet.create({
  home_container:{
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  header_container:{
    width: '100%',
    height: '30%' ,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar_container:{
    height: '80%',
    aspectRatio: 1,
  },
  avatar:{
    height: '100%',
    aspectRatio: 1,
    // borderRadius: 100,
  },
  body_container:{
    flex:1,
  }
})

export default function Home(){
  const props  = useSelector(state=>{
    return({
      user_info : state.user_info,
    })
  })

  return(
    <View  style={style.home_container}>
      <View style={style.header_container}>
        <View style={style.avatar_container}>
          <Image style={style.avatar} source={{ uri: setting.image_url + props.user_info.avatar }}/>
        </View>
        <Text style={{color:'white'}}> {props.user_info.username }</Text>
      </View>
      
      <View style={style.body_container}>
        <Text style={{color:'white'}}>Hello</Text>
      </View>
    </View>
  )
}