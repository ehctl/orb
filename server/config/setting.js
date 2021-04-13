module.exports = {
  Port : 6789,
  JWT_ACCESS_TOKEN: 'IJUSTWANNABETHEONEYOULOVE',
  JWT_REFRESH_TOKEN: 'IMJUSTKIDDING',
  db:{
    url: 'localhost:27017',
    name: 'Orb',
  },
  defaultAvatar:[
    '1BxKsRv5V-yM2_xljX2kivTYjOQ2pL8rA',
    '15hugczdA9fxsgNdbXy039YQywDsUVxok',
    '1ODrnt-JVMpfDxtiAnZOtPXbdM5_Tm91G',
    '15hugczdA9fxsgNdbXy039YQywDsUVxok',
  ],
  UDPATE_TIMEOUT: 100000,
  MESSAGE_GET_STEP: 20,
  getNumberOfItemInArray: ( arr , ind_start , ind_end , reverse = true)=>{
    let return_arr = [];
    if( reverse){
      for(let i= ind_start-1 ; i >= ind_end ;  i--){
        return_arr.push( arr[i]);
      } 
      return_arr.reverse();
    }else{
      for(let i= ind_start ; i < ind_end ;  i++){
        return_arr.push( arr[i]);
      } 
    }

    return return_arr;
  }
}