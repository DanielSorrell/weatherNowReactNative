import { StatusBar } from "expo-status-bar";
import React from "react";
import { ImageBackground, ActivityIndicator, Dimensions, Button, StyleSheet, Text, TextInput, View, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import defaultBackground from "../imageBackgrounds/default.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setLocations, createLocation, deleteLocation, login, logout } from "../redux/actions";
import * as SecureStore from "expo-secure-store";

export default function Home({ navigation }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [isLoading, setIsLoading] = React.useState("");
  const [error, setError] = React.useState("");
  const dispatch = useDispatch();

  /**
   * Sends backend request for user login with user defined email and password.
   */
  const attemptLogin = async () => {
    setIsLoading(true);

    //Backend request to validate user email and password
    const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/user/login", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ email, password })
    });

    const json = await response.json();

    if(!response.ok){
      setError(json.error);
      console.log("Error adding user: ");
      console.log(json.error);
    }

    if(response.ok){
      dispatch(login(json));
 
      if(json.locations){
        dispatch(setLocations(json.locations));
      }
     
      try {
        await SecureStore.setItemAsync("userToken", JSON.stringify(json.token));
        await AsyncStorage.setItem("user", JSON.stringify({email: email, locations: json.locations}));
      } catch (error) {
        console.log("Error adding user to async/secure storage:: " + error);
      }

    }
    setIsLoading(false);
    navigation.navigate("Weather");
  }

  return (
    <SafeAreaView style={isLoading ? styles.container : styles.loadingContainer}>
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
              style={styles.loginButton}
              onPress={() => attemptLogin()}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          </View> 
          :
          <View style={{alignItems: "center", marginTop: "auto", marginBottom: "auto"}}>
            <Text style={{fontWeight: "bold", fontSize: 30}}>Attempting login...</Text>
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
  loadingContainer: {
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
  loginButton: {
    marginTop: "20%",
    backgroundColor: "black",
    padding: "5%",
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 20,
  },
  loginButtonText: {
    fontSize: 30,
    color: "white",
    textAlign: "center"
  },
  backgroundImage: {
    flex: 1,
   },
});