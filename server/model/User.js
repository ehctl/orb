const mongoose = require('mongoose');
const crypto = require('crypto');

var user = new mongoose.Schema({
  mail:{
      type: String,
      require: true
  },
  username:{
      type: String,
      require: true,  
  },
  gender: {
      type: String,
      require: true,
  },
  first_name:{
      type: String,
      require: true
  },
  last_name:{
      type: String,
      require: true
  },
  password:{
      type: String,
      require: true
  },
  birth_date:{
      type: String,
      require: true,
  },
  avatar:{
      type: String,
      require: true
  },
  chat_room:{
      type: Array,
      require: false
  },
  friend:{
      type: [String],
      require: false
  },
  friend_request:{
      type: Array,
      require: false
  },
  notification:{
      type: Array,
      require: false,
  },
  log : {
      type:Array,
      require: false,
  }
},{
    timestamps: true,
    collection: 'users'
})

user.statics.ex = async function(){
    try{
        let user = await this.findOne({username: 'eren'});
        let encryptPass = crypto.createHash('sha256').update('tl').digest('base64');

        if(!user){
            user = this.create({
                mail: 't@gmail.com',
                username:'eren',
                gender: 'male',
                first_name:'nguyen vu',
                last_name:'tuan linh',
                password:encryptPass,
                birth_date:'29-7-20',
                avatar:'default',
            })

            return user;
        }else{
            throw "Duplicate";
        }
    }catch(err){
        throw err
    }
}

user.statics.login = async function(query){
    try{
        let encryptPass = crypto.createHash('sha256').update(query.p).digest('base64');
        let user = this.findOne({username: query.u , password: encryptPass});
        return user;
    }catch(err){
        throw err
    }
}

user.statics.search = async function(username ,searcher){
    if( !username){
        return [];
    }

    let regex =  '\\w*' + username + '\\w*';
    try{
        let list = await this.find({username: { $regex: new RegExp(regex) , $options: 'i' }}, 'username avatar');
        if( list)
            list = list.filter(item => item._id.toString() !== searcher);

        return list;
    }catch(err){
        throw(err)
    }
}

module.exports = mongoose.model('User', user);