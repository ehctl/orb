import React ,  { useState, useEffect, useRef } from 'react';
import { StyleSheet, View , Text  } from 'react-native';

import {Provider } from "react-redux";
import { createStore , applyMiddleware  } from "redux";
import {reducer } from "./reduxSetting";
import thunk from "redux-thunk";

import HomePage from './component/HomePage';


const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: "black",
  },
});

export default function App() {
  const store = createStore( reducer, applyMiddleware(thunk));
  return (
    <Provider store={store} >
      <View style={styles.container}>
        <HomePage/>
      </View>
    </Provider>
  ); 
}


