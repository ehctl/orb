import React from 'react';
import { Image, View , Text  } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

import RightSide from './RightSide';
import LeftSide from './LeftSide';
import Home from './Home';

let style = {
  bodyContainer:{
    width: "100%",
    height: "90%"
  },
  body:{
    flexDirection: "row",
    width: "100%",
    height: "100%"
  }
}

export default function Body(){
  const props = useSelector(state => {
    return({
      page: state.page
    })
  });

  let renderBody = (page)=>{
    switch(page){
      case "main":{
        return(
          <View style={style.body}> 
            <LeftSide />
            <RightSide />
          </View>
        )
      }
      case "home":{
        return(
          <View style={style.body}>  
            <Home />
          </View>
        )
      }
    }
  }

  return(  
    <View style={style.bodyContainer}>
      {renderBody(props.page)}
    </View>
  )
}