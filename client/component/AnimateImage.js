import React, { Component, useRef } from 'react';
import { render } from 'react-dom';
import { Image, View , Text, Animated  } from 'react-native';
import { useSelector, useDispatch  } from "react-redux";

class AnimateImage extends Component{
  state = {
    loadingImageOpacity : new Animated.Value(0),
  }

  onImageLoading = ()=>{
    Animated.timing(this.state.loadingImageOpacity,{
      toValue: 1,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  onLoaded = ()=>{
    Animated.timing(this.state.loadingImageOpacity,{
      toValue:0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }

  render(){      
    return(
      <View> 
          <Animated.Image style={this.props.style} source={this.props.source} onLoad={this.onLoaded} />
          <Animated.Image style={[ { position:"absolute",  opacity: this.state.loadingImageOpacity } , this.props.style ]} source={require("../assets/loading.gif")} onLoad={this.onImageLoading}/>
      </View>

    )
  }
}

export default AnimateImage;

