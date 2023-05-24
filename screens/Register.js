import { StatusBar } from "expo-status-bar";
import React from "react";
import { TouchableOpacity, ImageBackground, ActivityIndicator, Dimensions, Button, StyleSheet, Text, TextInput, View, SafeAreaView, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import defaultBackground from "../imageBackgrounds/default.jpg";

import { useSelector, useDispatch } from "react-redux";
import { setLocations, createLocation, deleteLocation, login, logout } from "../redux/actions";

export default function Home({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState("");
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();

  /**
   * Sends backend request for user account registration with user defined email and password.
   */
  const register = async () => {
    setIsLoading(true);
    setError(null);

    //Backend request to validate user email and password
    const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
        //"Access-Control-Allow-Origin": "*", 
        //"Access-Control-Allow-Credentials" : true
      },
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if(!response.ok) {
      setIsLoading(false);
      setError(json.error);
      console.log("Error attempting to register account:");
      console.log(json.error);
    }
    if(response.ok) {
      setIsLoading(false);

      const user = {
        email: email,   
        password: password 
      };
      
      dispatch(login(user));
      navigation.navigate("Weather");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground 
        source={backgroundImage}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        {!isLoading ?
          <View style={styles.mainWrapper}>
            {error && <Text style={styles.error}>{error}</Text>}
            <Text style={styles.inputLabel}>Email:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
            />
            <Text style={styles.inputLabel}>Password:</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.registerButton}
              onPress={() => register()}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={{alignItems: "center", marginTop: "auto", marginBottom: "auto"}}>
            <Text style={{fontWeight: "bold", fontSize: 30}}>Creating account...</Text>
            <View>
              <ActivityIndicator size="large" />
            </View>
          </View>
        }
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  mainWrapper: {
    marginTop: "30%",
  },
  input: {
    color: "white",
    borderColor: "white",
    backgroundColor: "black",
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  inputLabel: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
    textShadowColor: "black",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3
  },
  error: {
    textAlign: "center",
    color: "red",
    fontSize: 30,
    marginBottom: 40
  },
  registerButton: {
    marginTop: "20%",
    backgroundColor: "black",
    padding: "5%",
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 20,
  },
  registerButtonText: {
    fontSize: 30,
    color: "white",
    textAlign: "center"
  },
  backgroundImage: {
    flex: 1,
   },
});