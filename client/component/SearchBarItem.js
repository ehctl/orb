import React, { Component } from 'react';
import { Image, View , Text ,StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';


const style = StyleSheet.create({
  container:{
    flexDirection: 'row',
    marginHorizontal: 10,
    marginVertical: 2,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainer:{
    flexDirection: 'row',
  },
  per_button_container:{
    marginHorizontal: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: 'grey',
  },
  butotn_text:{
    width: '100%',
    textAlign: 'center'
  },

})

class SearchBarItem extends Component{
  render(){
    return(
      <View style={style.container}>
        <Text>{this.props.value.username}</Text>
        <View style={style.buttonContainer}>

        { 
          this.props.buttons.map( (button , index)  =>{
            return(
              <TouchableOpacity style={style.per_button_container} onPress={ ()=>{ this.props.functions[index](this.props.value) }} key={ Math.random() * 123454} > 
                <Text style={style.button_text}> { button} </Text>
              </TouchableOpacity>
            )       
          })
        }

        </View>
      </View>  
    )
  }
}

export default SearchBarItem;