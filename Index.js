import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView, Platform } from 'react-native';
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./redux/reducers";
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

export default function Index() {
 
  const store = configureStore(rootReducer);

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default function App() {
 
  const Stack = createNativeStackNavigator();

    return (
      <NavigationContainer>
          <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Create account" component={RegisterScreen} />
            <Stack.Screen name="Weather" component={WeatherScreen} />  
            <Stack.Screen name="Add location" component={AddLocation} />  
          </Stack.Navigator>
      </NavigationContainer>
    );
}