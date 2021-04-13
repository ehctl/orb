const User = require('../model/User');
const jwt = require('../middleware/jwt');

module.exports = {
  login: async (req,res)=>{
    try{    
      let user = await User.login( req.query);
      let jwtToken = await jwt.generateToken(user,'30m');

      if( user){
        res.send({
          data:{
            user_info: user,
            token: jwtToken,
          }      
        });
      }else{
        throw 'User not found';
      }
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  } ,

  search : async (req,res)=>{
    try{
      let list = await User.search(req.query['n'] , req.jwtInfo.data.id);
      if( list.length > 0){
        res.send({
          data: list,
        });
      }else{
        res.send({
          data: [],
        })
      }
    }catch(e){
      console.log(e);
      res.sendStatus(400);
    }
  }
}