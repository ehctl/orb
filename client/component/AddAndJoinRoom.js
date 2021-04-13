import React from 'react';
import { useRef , useState , useEffect } from 'react';
import { Dimensions, Image, FlatList , KeyboardAvoidingView, RefreshControl, ScrollView, StyleSheet, Text, TextInput, TouchableHighlight, TouchableOpacity, View, Keyboard } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import axios from '../m_axios';
import axios_ct from 'axios';
import setting from '../setting';

import SearchBarItem from './SearchBarItem';

const style = StyleSheet.create({
  room_container:{ 
    width: '100%' , 
    height: '100%' ,
    flexDirection: 'column',
  },
  text_input:{
    width: "100%",
    fontSize: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 30,
    backgroundColor: 'white',
    textAlign: 'center'
  },
  label:{
    marginVertical: 5,
    fontSize: 20 ,
    width: '100%',
    textAlign: 'center' 
  },
  flat_list:{
    width: '100%',
    justifyContent: "center",
    alignItems: 'center'
  },
  confirm_container:{
    position: 'absolute',
    bottom: 0,
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirm_button:{
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#12CDED'
  }
})

export default function AddAndJoinRoom(){
  const [ selectedList , setSelectedList ] = useState([]);
  const [ searchList , setSearchList ] = useState([]);
  const [ searchNotiText , setSearchNotiText ] = useState("");
  const [ roomName , setRoomName ] = useState('');

  var source;
  const dispatch = useDispatch();
  const props = useSelector( state=>{
    return({
      token : state.token,
    })
  })
  
  var temp_arr = [
    { name: 'Robert' },
    { name: 'Bryan' },
    { name: 'Vicente' },
    { name: 'Tristan' },
    { name: 'Marie' },
    { name: 'Onni' },
    { name: 'sophie' },
    { name: 'Brad' },
    { name: 'Samual' },
    { name: 'Omur' },
    { name: 'Ower' },
    { name: 'Awery' },
    { name: 'Ann' },
    { name: 'Jhone' },
    { name: 'z' },
    { name: 'bb' },
    { name: 'cc' },
    { name: 'd' },
    { name: 'e' },
    { name: 'f' },
    { name: 'g' },
    { name: 'h' },
    { name: 'i' },
    { name: 'j' },
    { name: 'k' },
    { name: 'l' },
  ];

  const addItemToSeletedList = (item)=>{
    setSelectedList([...selectedList , item]);
    setSearchList( searchList.filter( i => i._id !== item._id))
  }

  const removeItemFromSelectedList = (item)=>{
    setSelectedList( selectedList.filter( i => i._id !== item._id));
    setSearchList([...searchList, item])
  }

  const renderItem = ({item}) =>(
    <SearchBarItem value={item}  buttons={["Remove"]} functions={[removeItemFromSelectedList]}/>
  )

  const checkDup = (item)=>{
    for(let i=0 ; i< selectedList.length ; i++){
      if( selectedList[i]._id === item._id){
        return true;
      }
    }
    return false;
  }

  const renderSearchList = ({item}) =>{
    if( !checkDup(item)){
      return(
        <SearchBarItem value={item} buttons={["Add"]} functions={[addItemToSeletedList]}/>
      )
    }else{
      setSearchList( searchList.filter( i => i._id !== item._id) )
    }
  }

  const findFriend = async (name)=>{
    try{
      if( source){
        source.cancel();
      }

      source = axios_ct.CancelToken.source();
      let response = await axios.get(setting.url + '/user/search',
      {
        params:{
          n: name,
          token: props.token
        },
        cancelToken: source.token,
      })

      return response.data.data;
    }catch(err){
      if (axios_ct.isCancel(err)) {
      } else {
        console.log(err);
      }

      return [];
    }
  }

  const findFriendTextChange = async (text)=>{
    let temp = await findFriend(text);
    setSearchList(temp);   
    setSearchNotiText( temp.length === 0 && text ? "No name matches!" : "");
  }

  const onConfirmPress = async ()=>{
    let response = await axios.post(setting.url + '/room/create',
    {
      name: roomName,
      member: selectedList.map( item => item._id ) ,
      token: props.token
    }) 

    dispatch({
      type: 'NEW_ROOM',
      payload: response.data.data,
    })
  }

  return(
    <View style={ style.room_container } onStartShouldSetResponder={ Keyboard.dismiss } nestedScrollEnabled={true}>
      <Text style={style.label}>Create room:</Text>
      <TextInput placeholder='Room name...' style={style.text_input} onChangeText={(text)=> setRoomName(text)}/>
      <Text style={style.label}>Members: </Text>
      <FlatList 
        data={selectedList} 
        renderItem={renderItem}
        keyExtractor={item => item._id}
        extraData={selectedList}
        nestedScrollEnabled={true}
      />
      <TextInput placeholder='Add more...' style={ style.text_input } onChangeText={ findFriendTextChange}/>
      <FlatList 
        data={searchList} 
        renderItem={renderSearchList}
        keyExtractor={item => item._id}
        extraData={searchList}
        nestedScrollEnabled={true}
      />
      <Text style={style.label}> {searchNotiText} </Text>

      <View style={style.confirm_container}>
        <TouchableOpacity style={style.confirm_button} onPress={onConfirmPress}>
          <Text style={style.label}>Confirm</Text>
        </TouchableOpacity>
      </View>
     
    </View>
  )
}