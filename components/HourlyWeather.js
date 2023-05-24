import { StatusBar } from 'expo-status-bar';
import React from 'react';
//import { Dimensions, Button, StyleSheet, Text, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { Dimensions, Button, StyleSheet, Text, Image, View, SafeAreaView, Platform, ScrollView } from 'react-native';
//import { useDimensions, useDeviceOrientation } from '@react-native-community/hooks';
//import Location from "../components/Location.js";


export default function HourlyWeather({ hourData }) {

    const [toggleWindow, setToggleWindow] = React.useState(false);
    const [className, setClassName] = React.useState("");

    /**
     * Takes a Unix UTC timestamp and converts to the hour in meridiem time.
     * @param {int} timeStamp - int of Unix UTC timestamp 
     * @returns {String} String of the hour in meridiem time
     */
    const getHourConversion = (timeStamp) => {
        let hour = new Date(timeStamp * 1000);
        hour = hour.toLocaleTimeString("default");
        const hourNum = hour.substring(0, hour.indexOf(":"));
        const meridiem = hour.substring(hour.length - 2, hour.length);
        return hourNum + " " + meridiem;
    }

    /**
     * Takes an icon id and returns the URL to display the weather icon associated with the icon id.
     * @param {string} iconId - 3 digit icon id that corresponds with a weather icon
     * @returns {string} String of URL to display icon
     */
    const getImageSrc = (iconId) => {
        return "https://openweathermap.org/img/wn/" + iconId + "@2x.png";
    }

    /**
     * Takes a meter measurement and converts to kilometers
     * if greater than or equal to 1000 meters.
     * @param {int} meters - kilometer measurement 
     * @returns {string} String with kilometer or meter measurement indicator
     */
    const getVisibility = (meters) => {
        let visibility;
        if(meters >= 1000){
            visibility = meters / 1000 + " km";
        } else {
            visibility += " m";
        }
        return visibility;
    }

    /**
     * Takes a angle in degrees of the wind direction and converts to cardinal direction.
     * @param {int} degree - degree of wind direction  
     * @returns {string} String of wind direction in cardinal direction.
     */
    const getWindDirection = (degree) => {
        let direction;

        if(degree > 15 && degree <= 75){
            direction = "NE";
        } else if(degree > 75 && degree <= 105){
            direction = "E";
        } else if(degree > 105 && degree <= 165){
            direction = "SE";
        } else if(degree > 165 && degree <= 195){
            direction = "S";
        } else if(degree > 195 && degree <= 255){
            direction = "SW";
        } else if(degree > 255 && degree <= 345){
            direction = "NW";
        } else if((degree > 345 && degree <= 360) || (degree >= 0 && degree <= 15)){
            direction = "N";
        } else {
            direction = "Error finding wind direction";
        }
        return direction;
    }

    return (
        <View style={styles.container}>
            <Text style={[styles.hourWeatherData, styles.textWithShadow]}>{getHourConversion(hourData.dt)}</Text>
            <Image style={styles.icon}
                source={{
                    width: 40,
                    height: 40,
                    uri: getImageSrc(hourData.weather[0].icon),
                }} 
            />
            <Text style={[styles.hourWeatherData, styles.textWithShadow]}>{Math.round(hourData.temp)}&#176;</Text>
            {hourData.pop > 0 &&
                <Text style={[styles.hourWeatherData, styles.textWithShadow]}>{Math.round((hourData.pop + Number.EPSILON) * 100)}&#37;</Text>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginLeft: 12,
        marginRight: 12,
    },
    column: {
        textAlign: "center",
        fontSize: 20,
        marginLeft: "5%",
        marginRight: "5%",
        marginTop: "auto",
        marginBottom: "auto"
    },
    icon: {
        marginLeft: "auto",
        marginRight: "auto",
        shadowColor: 'black',
        shadowOffset: {width: 2, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 3
    },
    hourWeatherData: {
        textAlign: "center",
        fontSize: 20,
        marginTop: "auto",
        marginBottom: "auto"
    },
    textWithShadow: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3
    }
});