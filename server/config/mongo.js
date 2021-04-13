const setting = require('./setting');
const mongoose = require('mongoose');

module.exports = class Database{
  constructor(){
    let uri = 'mongodb://' + setting.db.url + '/' + setting.db.name;

    mongoose.connect( uri , {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })

    this.connection = mongoose.connection;
    this.connection.once('open',()=>{
      console.log("Connect to database <:");
    })

    this.connection.on('error',(error)=>{
      console.log(error)
    })
  }
}
