import setting from "./setting";

var initialState = {
  logged_in: false,
  user_info:{ }, 
  page: "home",
  prevPage:"",
  roomList:[
    {
      _id: "-1",
      avatar: "14OaMFuqNgr2ZoyL7oxUt01gvE1oKBM3C",
      name: "Creating room",
    }
  ],
  currentRoomID:null,
  currentRoom: null,
}

let handleSendOrReceiveData = (state, action)=>{
  switch(action.type){
    case 'USER_SEND_MESSAGE':{
      let cr = {...state.currentRoom}; 
      cr.message.push({
        sender_id: state.user_info.id ,
        sender_name: state.user_info.username,
        sender_avatar: "1BxKsRv5V-yM2_xljX2kivTYjOQ2pL8rA",
        ...action.payload,
      })

      return{
        ...state,
        currentRoom : cr,
      }
    }
    case 'NEW_ROOM':{
      let dup = setting.checkDuplicateByID(state.roomList , action.payload._id);
      if(!dup){
        let rl = [ state.roomList[0] , action.payload , ...state.roomList.filter( item => item._id !== '-1') ];
        return{
          ...state,
          roomList: rl,
        }
      }
    }
    case 'NEW_MESSAGE':{
      if( action.payload.owner !== state.user_info._id){ 
        let rl = [...state.roomList];
        for(let i=0 ; i<rl.length ; i++){
          if( rl[i]._id === action.payload.room_id){
            // co the toi uu duoc nhung chua can
            let dup = false;
            for(let j=0 ; j< rl[i].message.length ; j++){
              if( rl[i].message[j]._id === action.payload._id){
                dup = true;
              }
            }

            if(!dup){
              rl[i].message.push( action.payload);
            }
          }
        }
        return{
          ...state,
          roomList : rl,
        }
      }else{
        return state;
      }     
    }
    case 'MERGE_MESSAGE':{
      let rl = [...state.roomList];
      for(let i=0 ; i<rl.length ; i++){
        if( rl[i]._id === action.payload.room_id){
          rl[i].message = [...action.payload.list , ...rl[i].message];
          rl[i].message_index += action.payload.list.length;
        }
      }

      return{
        ...state,
        roomList: rl,
      }
    }
    case 'RECEIVER_RECEIVED_MESSAGE':{
      let rl = [...state.roomList];
      for(let i=0 ; i<rl.length ; i++){
        if( rl[i]._id === action.payload.room_id){
          for(let j=0 ; j< rl[i].message.length ; j++){
            if( rl[i].message[j]._id === action.payload.message_id){
              rl[i].message[j].status = setting.MESSAGE_STATUS.RECEIVED;
            }
          }
        }
      }
      return{
        ...state,
        roomList : rl,
      }
    }
    case 'RECEIVER_SEEN_MESSAGE':{
      let room_id = action.payload;
      let rl = [...state.roomList];

      for(let i=0 ; i<rl.length ; i++){
        if( rl[i]._id === room_id){
          for(let j=0 ; j< rl[i].message.length ; j++){
            if( rl[i].message[j].status !== setting.MESSAGE_STATUS.SEEN){
              rl[i].message[j].status = setting.MESSAGE_STATUS.SEEN;
            }
          }
        }
      }

      return{
        ...state,
        roomList : rl,
      }
    }
    default:{
      return state;
    }
  }
}

let handleLoadingData = (state, action)=>{
  switch(action.type){
    case 'LOADING_ROOMLIST_BEGIN':{
      return{
        ...state,
        LOADING_ROOMLIST: true,
      }
    }
    case 'LOADING_ROOMLIST_SUCCESS':{
      let roomList = action.payload.data.room_list;
      return{
        ...state,
        LOADING_ROOMLIST: false,
        roomList: [ state.roomList[0],...roomList],
      }
    }
    case "LOAD_ROOM_BEGIN":{
      return{
        ...state,
        LOADING_ROOM: true,
      }
    }
    case "LOAD_ROOM_SUCCESS":{
      return{
        ...state,
        currentRoom: action.payload.data ,
        LOADING_ROOM: false,
      }
    }
    default:{
      return handleSendOrReceiveData(state,action);
    }
  }
}

let handleBtnClick = ( state , action)=>{
  switch(action.type){
    case "PAGE_CHANGE":{
      return{
        ...state,
        prevPage: state.page,
        page: action.payload,
      }
    }
    case "ROOM_CHANGE":{
      let cr;
      for(let i=0 ; i<state.roomList.length ; i++){
        if( state.roomList[i]._id === action.payload){
          cr = state.roomList[i];
          break;
        }
      }
      return{
        ...state,
        currentRoomID: action.payload,
        currentRoom: cr,
      }
    }
    case "LOGIN_SUCCESSFUL":{
      return{
        ...state,
        logged_in: true,
        user_info: action.payload.data.user_info,
        token: action.payload.data.token,
      }
    }
    default:{
      return handleLoadingData(state,action);
    }
  }
}

function reducer(state = initialState , action){
  return handleBtnClick(state, action);
}



export {  reducer }