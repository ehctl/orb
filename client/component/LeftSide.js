import React, { useCallback, useEffect, useLayoutEffect, useState} from 'react';
import { Text , Image, View ,ScrollView , StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import { cos } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';
import AnimateImage from "./AnimateImage";

const axios = require('axios');
import setting from '../setting';

const style = StyleSheet.create({
  left_side:{
    backgroundColor: "#808080",
  },
  scroll_view:{

  },
  touchable_opacity:{
    marginHorizontal: 5,
    marginTop: 5,
    width: 50,
    height: 50,
  },
  image:{
    width: 50,
    height: 50,    
    borderRadius: 25,
  }
})

export default function LeftSide(){
  const dispatch = useDispatch();

  const props = useSelector( state =>{
    return({
      user_info : state.user_info,
      reloadLeftSide: state.reloadLeftSide,
      roomList: state.roomList,
      token: state.token,
      LOADING_ROOMLIST_BEGIN : state.LOADING_ROOMLIST_BEGIN,
      LOADING_ROOMLIST_SUCCESS : state.LOADING_ROOMLIST_SUCCESS,
    })
  })

  const [ refreshing , setRefreshing ]= useState(false);

  const roomBtnClicked = (roomID)=>{
    if( roomID === "-1"){
      dispatch({
        type : "ROOM_CHANGE",
        payload: "-1",
      }) 
    }else{
      dispatch({
        type: "ROOM_CHANGE",
        payload: roomID,
      })
    }
  }

  const loadRoomList = ()=>{
    const source = axios.CancelToken.source();

    const fetchData = ()=>{
      try {
        dispatch(async (dp)=>{
          dp({
            type: 'LOADING_ROOMLIST_BEGIN'
          }) 

          let response = await axios.get(setting.url + '/room/find_all',{
            params:{
              token: props.token ,
            },
            cancelToken: source.token,
          })

          let data =  response.data;

          dp({
            type: 'LOADING_ROOMLIST_SUCCESS',
            payload: data,
          })
          setRefreshing(false);
        }) 
      } catch (error) {
          if (axios.isCancel(error)) {
          } else {
              throw error
          }
      }
    }

    fetchData();
    return source;
  }

  useEffect( ()=>{ 
    let source;
    if( refreshing || props.roomList.length === 1){
      source = loadRoomList();
    } 

    if( source){
      return( ()=>{
        source.cancel();
      })
    }
  }, [refreshing])

  const onRefresh = useCallback( ()=>{
    setRefreshing(true);
  },[])

  const renderLeftSide = ()=>{
    if( props.LOAD_ROOMLIST ){
      return(
        <View style={style.loading_div} >  
          <Image style={{width: 50, height:50}} source={require('../assets/loading.gif')} />
        </View>
      )
    }else if(props.roomList.length === 0 ){
      return(
        <View>
          <Text>Join or create room to chat w your friend !😉</Text>
        </View>
      )
    }else{
     // console.log(props.roomList )
      return(
        <ScrollView  style={style.scroll_view} refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>
          }>
        {              
          props.roomList.map((room)=>{ 
            return(
              <TouchableOpacity style={style.touchable_opacity} key={room._id} onPress={ ()=>{ roomBtnClicked(room._id)} } >  
                <AnimateImage style={style.image} source={{  
                  uri: "https://drive.google.com/uc?export=view&id=" + room.avatar,
                  }} />
              </TouchableOpacity>
            ) 
          })
        }
      </ScrollView>
      )
    }
  }

  return(
    <View  style={style.left_side}>
      { renderLeftSide() }
    </View>
  )
}