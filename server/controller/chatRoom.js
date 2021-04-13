const ChatRoom = require('../model/ChatRoom');
const { MESSAGE_STATUS , Message} = require('../model/Message');
const User = require('../model/User');
const user = require('./user');

module.exports = {
  create : async (req,res,updater)=>{
    try{  
      let params = req.body;
      params.owner = req.jwtInfo.data.id;

      let { room , member_list } = await ChatRoom.createRoom(params);

      let payload = {
        type: 'NEW_ROOM',
        data: room,
      };

      res.send(payload);
      updater.sendMessageToAllOnlineMembers(member_list,payload);      
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  }, 
  find: async (req,res)=>{
    try{
      let room_id = req.query.room_id;
      let room = await ChatRoom.findByID(room_id);

      res.send({
        data: room,
      })
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  },
  findAll: async (req,res)=>{
    try{
      let user_id = req.jwtInfo.data.id;
      let roomList = await ChatRoom.findAllRoomOfUser(user_id);

      res.send({
        data:{
          room_list: roomList.reverse(),
        } 
      })
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  },
  newMessage: async (req,res, updater)=>{
    try{
      let user_id = req.jwtInfo.data.id;
      let message = req.body.message;
      let room_id = req.body.room_id;
      let { new_message , member_list } = await ChatRoom.newMessage({room_id,user_id,message});
      let payload = {
        type: 'NEW_MESSAGE',
        data: new_message 
      };
      res.send(payload);      
      updater.sendMessageToAllOnlineMembers(member_list.filter(id=> user_id !== id),payload);
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  },
  getMessages : async (req,res)=>{
    try{
      let { room_id , ind } = req.query;
      console.log(room_id,ind);
      let message_list = await ChatRoom.getMessages(room_id,ind);

      res.send({
        data: message_list
      });
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  },
  userReceiveMessages: async (req,res, updater)=>{
    try{
      let message_id = req.body.message_id;
      let room_id = req.body.room_id;

      let owner = await Message.userReceivedMessage(message_id);

      res.sendStatus(200);
      if( owner ){
        let payload = {
          type : 'RECEIVER_RECEIVED_MESSAGE',
          data : {
            room_id: room_id,
            message_id: message_id,
          }
        }

        updater.sendMessageToAllOnlineMembers( [owner], payload )
      }
    }catch(e){  
      console.log(e);
      res.sendStatus(400);
    }
  },
  // tam thoi chua dung den
  // userReceiveAllMessage: async (req,res, updater)=>{
  //   try{
  //     let room_list = req.body.room_list;

  //     let sender_list = await ChatRoom.userReceivedAllMessage(room_list ,req.jwtInfo.id);

  //     res.sendStatus(200);
  //     if( room_list.length > 0 ){
  //       for(let i=0 ; i< room_list.length ; i++){
  //         if( sender_list[i].length > 0){
  //           let payload = {
  //             type : 'RECEIVER_RECEIVED_ALL_MESSAGE',
  //             data : {
  //               room_id: room_list[i] 
  //             }
  //           }

  //           updater.sendMessageToAllOnlineMembers( sender_list[i], payload );
  //         }
  //       }
  //     }
  //   }catch(e){  
  //     console.log(e);
  //     res.sendStatus(400);
  //   }
  // },
  userSeenMessage: async (req,res,updater)=>{
    try{ 
      let room_id = req.body.room_id;
      let sender_list = await ChatRoom.userSeenMessage(room_id, req.jwtInfo.id);
      res.sendStatus(200);
      let payload = {
        type : 'RECEIVER_SEEN_MESSAGE',
        data :room_id
      }
      if( sender_list.length > 0){
        updater.sendMessageToAllOnlineMembers( sender_list , payload);      
      }
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  }
}