import React from 'react';
import { useRef , useState , useEffect } from 'react';
import { Dimensions, Image, FlatList , KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Keyboard } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import setting from '../setting';
import axios from 'axios';

export default function Updater(){
  const dispatch = useDispatch();
  const props = useSelector( state =>{
    return({
      token: state.token,
      currentRoomID : state.currentRoomID,
    })
  })

  const dynamic_prop = useRef(props);

  const [ initUpdateConnection , setInitUpdateConnection ] = useState(false);

  const handleUpdateResponse = async function(response){
    sendUpdateRequest();  
    if( response === "OK"){
      //console.log('just update');
    }else{
      switch( response.type){
        case 'NEW_MESSAGE':{
          dispatch({
            type: 'NEW_MESSAGE',
            payload: response.data,
          })

          axios.put(setting.url+ '/room/user_receive_message' ,
            {
              room_id: response.data.room_id,
              message_id: response.data._id,
              token: props.token,     
            }
          );
                    
          if( dynamic_prop.current.currentRoomID === response.data.room_id ){
            axios.put(setting.url+ '/room/user_seen_message' ,
              {
                room_id: response.data.room_id,
                token: props.token,
              }
            );
          }
          break;
        }
        case 'RECEIVER_RECEIVED_MESSAGE':{
          dispatch({
            type: 'RECEIVER_RECEIVED_MESSAGE',
            payload: response.data,
          })
          break;
        }
        case 'RECEIVER_SEEN_MESSAGE':{
          dispatch({
            type: 'RECEIVER_SEEN_MESSAGE',
            payload: response.data,
          })
          break;
        }
        case 'NEW_ROOM':{
          dispatch({
            type: 'NEW_ROOM',
            payload: response.data,
          })
          break;
        } 
        default:{
          console.log(response, "Not supported yet");
        }
      }
    }
  }

  const sendUpdateRequest = async ()=>{
    try{
      let response = await axios.get(setting.url + '/update',{
        params:{
          token: props.token,
        },
        timeout: setting.update_timeout,
      })

      handleUpdateResponse(response.data);
    }catch(e){
      if( e.response || e.request){
       sendUpdateRequest();
      }else{
        console.log(e);
      }
    }
  }

  useEffect(()=>{
    dynamic_prop.current = props;
    if( !initUpdateConnection ){
      sendUpdateRequest();
      setInitUpdateConnection(true);
    }
  },[props.currentRoomID, props.token ]);


  return(
    <View key={ props.currentRoomID}>
    </View>
  )
}