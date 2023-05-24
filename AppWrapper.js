import { StatusBar } from "expo-status-bar";
import React from "react";
import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView, Platform, Touchable, TouchableOpacity } from "react-native";
//import { useDimensions, useDeviceOrientation } from "@react-native-community/hooks";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./redux/reducers";
import { Provider } from "react-redux";

import HomeScreen from "./screens/Home.js";
import LoginScreen from "./screens/Login.js";
import RegisterScreen from "./screens/Register.js";
import WeatherScreen from "./screens/Weather.js";
import AddLocation from "./screens/AddLocation.js";

import { useSelector, useDispatch } from "react-redux";
import { store } from "./redux/store";

export default function AppWrapper() {
 
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

function App() {
 
const Stack = createNativeStackNavigator();
const session = useSelector((state) => state.userReducer);

return (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown: false}} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Create account" component={RegisterScreen} />
      
      <Stack.Screen 
        name="Weather" 
        component={WeatherScreen} 
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity
              style={{
                borderColor: "white",
                borderRadius: 15,
              }}
              onPress={() => navigation.navigate("Home")}
            >
              <Text 
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Home
              </Text>
            </TouchableOpacity>
          ),
          
          headerRight: () => (
            <TouchableOpacity
              style={{
                borderColor: "white",
                borderRadius: 15,
              }}
              onPress={() => navigation.navigate("Add location")}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 20,
                }}
              >
                Search
              </Text>
            </TouchableOpacity>
          )
        })}
      />  
      
      <Stack.Screen 
        name="Add location" 
        component={AddLocation} 
        options={({ navigation }) => ({
          headerTitleAlign: "center",
          headerLeft: () => (
            <View>
              {session.locations.length > 0 ? 
                <TouchableOpacity
                  style={{
                    borderColor: "white",
                    borderRadius: 15,
                  }}
                  onPress={() => navigation.navigate("Weather")}
                >
                  <Text 
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Weather
                  </Text>
                </TouchableOpacity>
                :
                <TouchableOpacity
                  style={{
                    borderColor: "white",
                    borderRadius: 15,
                  }}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text 
                    style={{
                      fontWeight: "bold",
                      fontSize: 20,
                    }}
                  >
                    Home
                  </Text>
                </TouchableOpacity>
              }
            </View>
          )
        })}
      /> 

    </Stack.Navigator>
  </NavigationContainer>
  );
}


