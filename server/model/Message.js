const mongoose = require('mongoose');
const User = require('./User');

const MESSAGE_STATUS = {
  'SENT' : 0,
  'RECEIVED' : 1,
  'SEEN' : 2,
}

const message = new mongoose.Schema({
  detail:{
    type: String,
    required: true,
  },
  room_id:{
    type: String,
    require: true,
  },
  owner:{
    type: String,
    required: true,
  },
  status:{
    type: Number,
    require: true,
  }
},{
  timestamps: true,
  collection: 'messages',
})

message.statics.newMessage = async function({room_id,user_id, message}){
  try{
    let new_message = await this.create({
      detail: message,
      owner: user_id,
      room_id : room_id,
      status: MESSAGE_STATUS.SENT,
    })
      
    return new_message;
  }catch(e){
    throw e
  }
}

message.statics.getListOfMessages = async function( list){
  try{
    let message_list = [];
    for(let i=0 ; i<list.length ; i++){
      let m = await this.findById( list[i]);
      message_list.push(m);
    }      
    return message_list;
  }catch(e){
    throw e;
  }
}

message.statics.getMessageListByRoomID = async function(room_id){
  try{
    let list = await this.find({room_id: room_id});

    return list;
  }catch(e){
    throw e
  }
}

message.statics.userReceivedMessage = async function(message_id){
  try{
    let m = await this.findById(message_id);
    if(m){
      if( m.status === MESSAGE_STATUS.SENT){
        m.status = MESSAGE_STATUS.RECEIVED;
        await m.save();

        return m.owner;
      }
    }
    return null; 
  }catch(e){
    throw e;
  }
}

module.exports = {
  MESSAGE_STATUS : MESSAGE_STATUS,
  Message : mongoose.model('message', message),
}