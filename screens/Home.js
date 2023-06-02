import { StatusBar } from "expo-status-bar";
import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView, Platform, TouchableOpacity, ImageBackground } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setLocations, createLocation, deleteLocation, login, logout } from "../redux/actions";
import defaultBackground from "../imageBackgrounds/default.jpg";

export default function Home({ navigation }) {

  const session = useSelector((state) => state.userReducer);
  const dispatch = useDispatch();

  return (
    <SafeAreaView style={{flex: 1}}>
      
      <ImageBackground 
        source={defaultBackground}
        style={styles.backgroundImage}
        resizeMode="cover"
      >

      <Text style={styles.header}>Weather Now</Text>
        {session.user ?
          <View style={styles.navContainer}>
            <Text style={styles.userWelcome}>Welcome, </Text>
            <Text style={styles.userWelcome}>{session.user}!</Text>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => session.locations ? navigation.navigate("Weather") : navigation.navigate("Add location")}>
              <Text style={styles.navLinkText}>Weather</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => dispatch(logout())}>
              <Text style={styles.navLinkText}>Logout</Text>
            </TouchableOpacity>
          </View>
          :
          <View style={styles.navContainer}>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => session.locations ? navigation.navigate("Weather") : navigation.navigate("Add location")}>
              <Text style={styles.navLinkText}>Continue as guest</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => navigation.navigate("Login")}>
              <Text style={styles.navLinkText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.navLink}
              onPress={() => navigation.navigate("Create account")}>
              <Text style={styles.navLinkText}>Create account</Text>
            </TouchableOpacity>
          </View>
        }
      
      <StatusBar style="auto" />
      
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 40,
    marginBottom: "10%",
    marginTop: "10%",
    textAlign: "center",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  navContainer: {
    alignItems: "center",
  },
  navLink: {
    backgroundColor: "black",
    padding: "8%",
    margin: "10%",
    borderColor: "white",
    borderWidth: 5,
    borderRadius: 20,
    opacity: 0.8
  },
  navLinkText: {
    fontSize: 30,
    color: "white"
  },
  backgroundImage: {
    flex: 1,
  },
  userWelcome: {
    fontSize: 25,
    textAlign: "center",
    marginBottom: "10%",
    color: "white",
    textShadowColor: "black",
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 3
  }
});