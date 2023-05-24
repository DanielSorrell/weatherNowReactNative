import { StatusBar } from 'expo-status-bar';
import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, Dimensions, TouchableOpacity, Button, StyleSheet, Text, View, SafeAreaView, Platform, ImageBackground } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSelector, useDispatch } from "react-redux";
import { setLocations, createLocation, deleteLocation, login, logout } from "../redux/actions";

import WeatherComponent from "../components/Weather.js";

import clearSkies from "../imageBackgrounds/clearSky.jpg";
import clouds from "../imageBackgrounds/clouds.jpg";
import rain from "../imageBackgrounds/rain.jpeg";
import snowfall from "../imageBackgrounds/snowfall.png";
import thunderstorm from "../imageBackgrounds/thunderstorm.jpg";
import ash from "../imageBackgrounds/ash.jpg";
import mist from "../imageBackgrounds/mist.jpg";
import smoke from "../imageBackgrounds/smoke.jpg";
import dust from "../imageBackgrounds/dust.jpg";
import fog from "../imageBackgrounds/fog.jpg";
import sand from "../imageBackgrounds/dust.jpg";
import squall from "../imageBackgrounds/thunderstorm.jpg";
import tornado from "../imageBackgrounds/tornado.jpg";
import defaultBackground from "../imageBackgrounds/default.jpg";

export default function Weather({ navigation }) {
  const session = useSelector((state) => state.userReducer);
  const [dropdownMenuOpen, setDropdownMenuOpen] = React.useState(false);
  const [weatherAlertPopup, setWeatherAlertPopup] = React.useState("");
  const [locationSelection, setLocationSelection] = React.useState([]);
  const [currentCity, setCurrentCity] = React.useState("");
  const [imgBackground, setImgBackground] = React.useState(defaultBackground);
  const dispatch = useDispatch();


 
  /**
   * Takes a 3 digit weather ID and changes 
   * page background to corresponding weather video background.
   * @param {String} weatherId - String of 3 digit weather ID
   */
  const getImageBackground = (weatherId) => {
    const id = weatherId.toString();

    if(id.charAt(0) === "2"){
      setImgBackground(thunderstorm);
    } else if(id.charAt(0) === "3" || id.charAt(0) === "5"){
      setImgBackground(rain);
    } else if(id.charAt(0) === "6"){
      setImgBackground(snowfall);
    } else if(id === "701"){
      setImgBackground(mist);
    } else if(id === "711"){
      setImgBackground(smoke);
    } else if(id === "721" || id === "741"){
      setImgBackground(fog);
    } else if(id === "731" || id === "761"){
      setImgBackground(dust);
    } else if(id === "751"){
      setImgBackground(sand);
    } else if(id === "762"){
      setImgBackground(ash);
    } else if(id === "771"){
      setImgBackground(squall);
    } else if(id === "781"){
      setImgBackground(tornado);
    } else if(id === "800"){
      setImgBackground(clearSkies);
    } else if(weatherId > 800){
      setImgBackground(clouds);
    } else {
      setImgBackground(defaultBackground);
    }
  }

  /**
   * Takes a Unix UTC timestamp and converts to meridiem time.
   * @param {int} timeStamp - int of Unix UTC timestamp 
   * @returns {string} String of meridiem time
   */
  const getTimeConversion = (timeStamp) => {
    let conversion = new Date(timeStamp * 1000);
    conversion = conversion.toLocaleTimeString("default");
    return conversion.substring(0, conversion.length - 6) + " " + conversion.substring(conversion.length - 2, conversion.length);
  }

  /**
   * Closes the dropdown menu and navigates user to the search page.
   */
  const navigateToSearch = () => {
    setDropdownMenuOpen(false);
    navigation.navigate("Add location");
  }

  /**
   * Closes the dropdown location menu and changes city view to the selected city.
   * @param {object} city - object containing data for a location
   */
  const selectCity = (city) => {
    setDropdownMenuOpen(false);
    setCurrentCity(city);
  }
  
  React.useEffect(() => {
    if(session.locations.length > 0){
      setCurrentCity(session.locations[session.locations.length - 1]);
    } else {
      navigation.navigate("Add location");
    }
  }, [session.locations]);
  
  React.useEffect(() => {
    if(session.locations){
      if(session.locations.length > 1){
        setLocationSelection(session.locations.filter((location) => 
          location.latCoords !== currentCity.latCoords &&
          location.longCoords !== currentCity.longCoords
        ));
      } else {
        setLocationSelection(session.locations);
      }
    } else {
      setCurrentCity([]);
      setImgBackground(defaultBackground);
    }
  }, [currentCity, session.locations]);

  return (  
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={imgBackground}
        style={{flex: 1}}
        resizeMode='cover'
      >

        {currentCity &&
          <View>
            <WeatherComponent 
              navigation={navigation} 
              location={currentCity} 
              getImageBackground={getImageBackground}
              setWeatherAlertPopup={setWeatherAlertPopup} 
            />
          </View>
        }

        {locationSelection ? 
          <View style={styles.changeCityButtonContainer}>
            {session.locations.length > 0 && 
              <View>
                {session.locations.length == 1 ?
                  <TouchableOpacity
                    style={styles.changeCityButton}
                    onPress={() => navigation.navigate("Add location")}
                  >
                    <Text style={styles.changeCityButtonText}>Add city</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity
                    style={styles.changeCityButton}
                    onPress={() => setDropdownMenuOpen(!dropdownMenuOpen)}
                  >
                    <Text style={styles.changeCityButtonText}>Add/Change city</Text>
                  </TouchableOpacity>
                }
              </View>
            }
          </View>
          : 
          <View style={styles.changeCityButtonContainer}>
            <Text style={styles.noLocationsText}>No locations to display weather data</Text>
            <TouchableOpacity
              style={styles.changeCityButton}
              onPress={() => navigation.navigate("Add location")}
            >
              <Text style={styles.changeCityButtonText}>Add city</Text>
            </TouchableOpacity>
          </View>
        }

        {(dropdownMenuOpen && session.locations.length > 1) && 
          <BlurView intensity={Platform.OS === 'android' ? 80 : 20} tint="dark" style={styles.blurContainer}>
            <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setDropdownMenuOpen(false)}>
              <View style={styles.dropDownMenuContainer}>
                {locationSelection.map((location) => (
                  <TouchableOpacity onPress={() => selectCity(location)}>
                    <View style={styles.dropDownOption} key={location.latCoords + ',' + location.longCoords}>
                      <View>
                        <Text style={styles.selectLocationText}>
                          {location.city}, {location.state && location.state} {location.country}
                        </Text>
                      </View>

                      <TouchableOpacity style={styles.deleteLocationButton}>
                        <Text style={{color: "white"}} onPress={() => dispatch(deleteLocation(location))}>Delete</Text>
                      </TouchableOpacity>

                    </View>
                  </TouchableOpacity>
                ))}
                {session.locations.length > 4 ?
                  <View style={{alignItems: 'center', marginBottom: '5%'}}>
                    <Text style={{color: 'red', fontStyle: 'italic'}}> Max limit of 5 cities has been met</Text>
                  </View>
                  :
                  <TouchableOpacity onPress={() => navigateToSearch()} style={styles.searchButtonText}>
                    <Text style={{color: 'white', fontWeight: 'bold',}}>Search</Text>
                  </TouchableOpacity>
                }
              </View>
            </TouchableOpacity>
          </BlurView>
        }

        {weatherAlertPopup && 
          <BlurView intensity={Platform.OS === 'android' ? 80 : 20} tint="dark" style={styles.blurContainer}>
            <TouchableOpacity style={{flex: 1}} activeOpacity={1} onPress={() => setWeatherAlertPopup("")}>
              <View style={[styles.dropDownMenuContainer, styles.weatherAlertContainer]}>
                <Text style={styles.weatherAlertText}>{weatherAlertPopup.event}</Text>
                <Text style={styles.weatherAlertText}>{getTimeConversion(weatherAlertPopup.start)} - {getTimeConversion(weatherAlertPopup.end)}</Text>
                <Text style={styles.weatherAlertText}>{weatherAlertPopup.description}</Text>
                <Text style={styles.weatherAlertText}>From: {weatherAlertPopup.sender_name}</Text>
              </View>
            </TouchableOpacity>
          </BlurView>
        }

      </ImageBackground> 
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  dropDownOption: {
    margin: "5%",
    padding: "5%",
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    borderRadius: 40,
  },
  changeCityButton: {
    backgroundColor: 'black',
    padding: Platform.OS === "android" ? '1%' : '5%',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    opacity: 0.80,
  },
  changeCityButtonText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  changeCityButtonContainer: {
    position: 'absolute', 
    bottom: Platform.OS === "android" ? '2%' : '10%',
    left: 0,
    right: 0,
  },
  blurContainer: {
    padding: 20,
    justifyContent: 'center',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    right: 0,
  },
  dropDownMenuContainer: {
    backgroundColor: "black",
    marginTop: "auto",
    marginBottom: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    width: '90%',
    borderColor: 'white',
    borderWidth: 5,
    borderRadius: 20,
    opacity: 0.8
  },
  changeLocationText: {
    color: 'black',
    fontWeight: 'bold',
    width: '80%',
  },
  deleteLocationButton: {
    marginLeft: 'auto', 
    backgroundColor: 'red', 
    borderRadius: 5, 
    justifyContent: 'center', 
    padding: '2%'
  },
  searchButtonText: {
    backgroundColor: 'green', 
    marginLeft: 'auto', marginRight: 'auto', 
    marginTop: '10%', 
    marginBottom: '10%', 
    padding: '5%', 
    borderRadius: 10, 
    borderColor: 'white', 
    borderWidth: 3
  },
  weatherAlertContainer: {
    alignItems: 'center',
    padding: '8%'
  },
  weatherAlertText: {
    color: 'white',
    fontSize: 15,
    margin: '5%'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  noLocationsText: {
    fontSize: 30,
    textAlign: 'center',
    color: 'red'
  }
});