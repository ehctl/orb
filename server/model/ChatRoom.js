const mongoose = require('mongoose');
const { defaultAvatar } = require('../config/setting');
const user = require('../controller/user');
const { MESSAGE_STATUS , Message } = require('./Message');
const User = require('./User');
const setting = require('../config/setting')

const chatRoom = new mongoose.Schema({
  name:{
    type: String,
    required: true,
  },
  avatar:{
    type: String,
    required: true,
  },
  message:{
    type: Array,
    required: false,
  },
  owner:{
    type: String,
    required: true,
  },
  member:{
    type:Array,
    required: true,
  }
},{
  timestamps: true,
  collection: 'chat_rooms',
})

chatRoom.statics.createRoom = async function(params){
  try{
    let room = await this.create({
      name: params.name,
      avatar: defaultAvatar[ Math.floor(Math.random()*3) ],
      owner: params.owner,
      member: params.member,
    })

    let list = [ params.owner , ...params.member];
    room = room.toJSON();
    room.member_info = {};
    for(let i=0 ; i<list.length ; i++){
      let user = await User.findById(list[i]);
      user.chat_room.push(room._id.toString());
      room.member_info[ list[i]] = {
        username: user.username,
        avatar: user.avatar,
      }
      room.message_index = 0;

      await user.save();
    }

    list.splice(0,1);

    return { room , member_list:list };
  }catch(err){
    throw err
  }
}

chatRoom.statics.findByID = async function(id){
  try{
    
    let list = await this.findById(id);
    let message_list = await Message.getMessageListByRoomID(id);
    list.message = message_list;

    return list;
  }catch(err){
    throw err
  }
}

chatRoom.statics.findAllRoomOfUser = async function(user_id){
  try{
    let list = await this.find({ owner: user_id });
    list = [...list , ... (await this.find({ member:{'$in' : [user_id]}})) ];

    for(let i=0 ; i<list.length ; i++){
      list[i] = list[i].toJSON();

      let member = [...list[i].member , list[i].owner];
      member = member.filter( item => item !== user_id);
      list[i].member_info = {};
      for(let j=0 ; j < member.length ; j++){
        let user_basic_info =await  User.findById( member[j], {'_id':0 , 'username':1, 'avatar':1});
        if( user){
          list[i].member_info[ member[j] ] = user_basic_info;
        }
      } 

      let message_list = list[i].message.length <= setting.MESSAGE_GET_STEP ? list[i].message : setting.getNumberOfItemInArray( list[i].message, list[i].message.length, list[i].message.length-setting.MESSAGE_GET_STEP);
      list[i].message = await Message.getListOfMessages( message_list);
      list[i].message_index = message_list.length;
    }

    return list;
  }catch(err){
    throw err
  }
}

chatRoom.statics.newMessage = async function(info){
  try{
    let new_message = await Message.newMessage(info);
    let room = await this.findById(info.room_id);
    let member_list = [...room.member];
    member_list.push( room.owner);

    room.message.push( new_message._id.toString());
    await room.save();
    
    return { new_message , member_list };
  }catch(e){
    throw e;
  }
}

chatRoom.statics.getMessages = async function(room_id, ind){  
  try{
    let message_list = [];
    let room = await this.findById(room_id);
    if( ind <= room.message.length ){
      let ind_end = room.message.length - ind - setting.MESSAGE_GET_STEP >= 0 ? setting.MESSAGE_GET_STEP : room.message.length - ind ;  
      message_list = setting.getNumberOfItemInArray(room.message , room.message.length - ind , room.message.length - ind - ind_end);
      console.log(room.message.length - ind , room.message.length - ind - ind_end);
      message_list = await  Message.getListOfMessages(message_list);
    }
    console.log(message_list)
    return message_list;  
  }catch(e){
    throw e;
  }
}

// tam thoi chua dung den=)))))))
// chatRoom.statics.userReceivedAllMessage = async function(room_list ,receiver){
//   try{
//     let sender_list = [];
//     console.log('????')
//     console.log(room_list)
//     for(let i=0 ; i<room_list.length ; i++){
//       let room = await this.findById(room_list[i], 'message');
//       sender_list[i] = [];
//       for(let j= room.message.length -1 ; j>=0 ; j--){
//         let message = await Message.findById( room.message[j] );
//         if( message.status === MESSAGE_STATUS.SENT && message.owner !== receiver){
//           break;
//         }else{
//           if( sender_list[i].indexOf(message.owner) === -1 ){
//             sender_list[i].push( message.owner);
//           }
//           message.status === MESSAGE_STATUS.RECEIVED;
//           await message.save();
//         }
//       }
//     }      
//     return sender_list;
//   }catch(e){
//     throw e;
//   }
// }

chatRoom.statics.userSeenMessage = async function(room_id,user_id){
  try{
    let room = await this.findById(room_id);
    let message_list = room.message;
    let sender_list = [];

    // co the toi uu bang cach di nguoc 
    for(let i=0 ; i<message_list.length ; i++){
      let message = await Message.findById(message_list[i],'owner status');
      if( message.owner !== user_id && ( message.status === MESSAGE_STATUS.RECEIVED || message.status === MESSAGE_STATUS.SENT)){
        if( sender_list.indexOf(message.owner ) === -1){
          sender_list.push( message.owner);
        }
        message.status = MESSAGE_STATUS.SEEN;
        await message.save();
      }
    }

    return sender_list;
    
  }catch(e){
    throw e
  }
}

module.exports = mongoose.model('chat_room',chatRoom)