import React, { useLayoutEffect } from 'react';
import { useRef , useState , useEffect } from 'react';
import { Dimensions, Image, KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import axios from 'axios';
import setting from '../setting';

let style = {
  chatroom_container:{
    width: '100%',
    height: '100%',
  },
  scroll_view:{ 
    backgroundColor: 'skyblue',
  },
  abstract:{
    marginTop: 10,
    width: "100%",
    textAlign: "center",
  },
  header:{
    width: "100%",
    height: 30,
  },
  header_text:{
    color: "white",
    fontSize: 30,
    textAlign: "center",
  },
  loading_div:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  chat_container:{
    flex:1,
    flexDirection: 'column'
  },  
  message_container:{

  },
  per_message_container_left_side:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  per_message_container_right_side:{
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  sender_avatar:{
    position: 'absolute',
    left: 5,
    top: 7,
    width: 15,
    height: 15,
    borderRadius:15,
  },
  div_message:{
    marginTop: 5,
    marginHorizontal: 30,
    paddingVertical: 5,
    borderColor: '#9B9B9B',
    borderWidth: 1,
    borderRadius: 20,
    backgroundColor: 'white',
    alignSelf: 'flex-start',
  },
  message_text:{
    marginHorizontal: 5,
    alignSelf: 'flex-start',
    maxWidth: '80%',
  },
  typing_container:{
    height: 35,
    width: "100%",
    flexDirection: 'row' ,   
    backgroundColor: 'grey',
    justifyContent: 'center',
  },   
  text_input:{
    width: "70%",
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  send_message_container:{
    alignSelf: 'flex-end'
  },
  send_message:{
    height: "100%",
    aspectRatio: 1,
  }
}

export default function ChatRoom(){
  const dispatch =useDispatch();
  const input_text = useRef(null);

  const props = useSelector( state => {
    return({
      user_info: state.user_info,
      currentRoomID: state.currentRoomID,
      currentRoom : state.currentRoom,
      roomList: state.roomList,
      LOADING_ROOM : state.LOADING_ROOM,
      prePage: state.prevPage,
      token: state.token,
    })
  });
  
  const [ userText , setUserText ] = useState('');
  const [ getMoreMessage , setGetMoreMessage ] = useState(false);

  useEffect( ()=>{  
    if( props.currentRoom.message.length > 0){
      if( props.currentRoom.message[ props.currentRoom.message.length - 1].status !== setting.MESSAGE_STATUS.SEEN ){
        axios.put(setting.url+ '/room/user_seen_message' ,
          {
            room_id: props.currentRoomID,
            token: props.token,
          }
        );
      }
    }
  },[props.currentRoomID ])

  // const loadImageSource = async ( id )=>{
  //   let url = "https://drive.google.com/uc?export=view&id=" + id;
  //   try{
  //     let response = await fetch(url);
  //     console.log(response.text)
  //     return response;
  //   }catch(e){
  //     console.log(e)
  //   }
  // }

  // const loadImage = async ()=>{
  //   let list = props.currentRoom.message.map( message => message.owner_avatar );
  //   list = list.filter( (item, index) => index === list.indexOf(item));

  //   let t = {};
  //   for(let i=0 ; i<list.length ; i++){
  //     t[list[i]] =  await loadImageSource(list[i]);
  //   }

  //   setAvatarSourceList( {...avatarSourceList, ...t});
  //   console.log(t)
  // }

  // useLayoutEffect( ()=>{
  //   loadImage();
  // },[]);
  
  const onChangeText = (text)=>{
    setUserText(text);
  }

  const onSendMessageClick = async (e)=>{
    if( userText ){
      input_text.current.clear();
      setUserText(null);

      try{
        axios.post(setting.url + '/room/message/new',
        {
          room_id: props.currentRoomID,
          message: userText,
          token: props.token,
        })
        .then( (response)=>{
          dispatch({
            type: 'USER_SEND_MESSAGE',
            payload: response.data.data, 
          })
        })
      }catch(e){

      }
    }else{
      alert("Khong duoc trong");
    }
   
  }
  
  const onGetMoreMessage = async ()=>{
    let response = await axios.get(setting.url+'/room/message/get',{
      params:{
        token: props.token,
        ind: props.currentRoom.message_index,
        room_id: props.currentRoomID,
      }
    })

    dispatch({
      type: 'MERGE_MESSAGE',
      payload: {
        room_id: props.currentRoomID,
        list: response.data.data,
      }
    })
  }

  const renderRoom = function(){
    if( props.LOADING_ROOM || !props.currentRoom){
      return(
        <View style={{flex:1,alignItems:'center'}}>
          <Image style={{height:50, aspectRatio: 1}} source={ require('../assets/loading.gif') } />
        </View>
      )
    }else{
      return(
        <View style={style.chatroom_container}>
          <View style={style.header}>  
            <Text style={style.header_text}> {props.currentRoom.name } </Text>
          </View>      

          <KeyboardAvoidingView style={style.chat_container} behavior='padding' keyboardVerticalOffset= { 80 } > 
            <View style={{flex:1}}>
              <ScrollView  style={style.scroll_view} contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps='handled' refreshControl={
                <RefreshControl refreshing={getMoreMessage} onRefresh={ onGetMoreMessage } />
              }
              >
                <View style={style.chat_container}>          
                  <View style={style.message_container}>
                  { 
                    props.currentRoom.message.map( (message , index) => {
                      let style_temp,source;
                      if( props.user_info._id === message.owner){
                        style_temp = style.per_message_container_right_side;
                        switch(message.status){
                          case setting.MESSAGE_STATUS.SENT:{
                            source = require('../assets/sent.png') ;
                            break;
                          }
                          case setting.MESSAGE_STATUS.RECEIVED:{
                            source = require('../assets/received.png');
                            break;  
                          }
                          case setting.MESSAGE_STATUS.SEEN:{
                            source = {uri: setting.image_url + props.user_info.avatar };
                            break;  
                          }
                        }
                      }else{
                        style_temp = style.per_message_container_left_side;
                        source = {uri: setting.image_url + props.currentRoom.member_info[ message.owner ].avatar };
                      }

                      if( index === props.currentRoom.message.length - 1 || props.user_info._id !== message.owner || ( message.status === setting.MESSAGE_STATUS.RECEIVED || message.status === setting.MESSAGE_STATUS.SENT )){
                        return(
                          <View style={style_temp}  key={message._id}>
                            <Image style={style.sender_avatar} source={ source } /> 
                            <TouchableHighlight style={style.div_message} >
                              <Text style={style.message_text}> {message.detail} </Text>
                            </TouchableHighlight>
                          </View>
                        )
                      }else{
                        return(
                          <View style={style_temp}  key={message._id}>
                            <TouchableHighlight style={style.div_message} >
                              <Text style={style.message_text}> {message.detail} </Text>
                            </TouchableHighlight>
                          </View>
                        )
                      }                      
                    })
                  } 
                  </View>  
                </View> 
              </ScrollView>   
            </View>

            <View style={style.typing_container} >
              <TextInput ref={ input_text }style={style.text_input} placeholder="AaBb..." onChangeText={ onChangeText}/>
              <TouchableOpacity style={style.send_message_container} onPress={ onSendMessageClick} >
                <Image style={style.send_message} source={require('../assets/send_message.png')} />
              </TouchableOpacity>
            </View> 
          </KeyboardAvoidingView >                 
        </View>
      )
    }
  }

  return(
    <View style={style.chatroom_container}>
      { renderRoom() }
    </View>
  )
}