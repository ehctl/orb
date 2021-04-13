export default {
  url: 'http://192.168.1.25:6789',
  update_timeout: 12000,
  MESSAGE_STATUS:{
    'SENT' : 0,
    'RECEIVED' : 1,
    'SEEN' : 2,
  },
  // 'MESSAGE_GT_STEP': 20,
  checkDuplicateByID : (arr,id)=>{
    for(let i=0; i< arr.length ; i++){
      if( arr[i]._id === id){
        return true;
      }
    }
    return false;
  },
  image_url: "https://drive.google.com/uc?export=view&id=" ,
}