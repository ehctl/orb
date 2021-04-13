const axios = require('axios');

let  t = async ()=>{
  let r = await axios.put( 'http://localhost:6789/room/user_receive_message' ,
    {
      token: '123',
    }
  );
}

t();