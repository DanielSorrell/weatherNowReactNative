import { StatusBar } from "expo-status-bar";
import React from "react";
import { ActivityIndicator, Dimensions, Button, StyleSheet, Text, Image, View, SafeAreaView, Platform, ScrollView, TouchableOpacity } from "react-native";

import DailyWeather from "./DailyWeather.js";
import HourlyWeather from "./HourlyWeather.js";
import { BlurView } from "expo-blur";

export default function Weather({ navigation, location, getImageBackground, setWeatherAlertPopup }) {

    const [weatherData, setWeatherData] = React.useState();
    const [errors, setErrors] = React.useState([]);
    const [toggleAlert, setToggleAlert] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);

    /**
     * Takes a angle in degrees of the wind direction and converts to cardinal direction.
     * @param {int} degree - degree of wind direction  
     * @returns {string} direction - String of wind direction in cardinal direction.
     */
    const getWindDirection = (degree) => {
        let direction;

        if(degree > 15 && degree <= 75){
            direction = "NorthEast wind";
        } else if(degree > 75 && degree <= 105){
            direction = "East wind";
        } else if(degree > 105 && degree <= 165){
            direction = "SouthEast wind";
        } else if(degree > 165 && degree <= 195){
            direction = "South wind";
        } else if(degree > 195 && degree <= 255){
            direction = "SouthWest wind";
        } else if(degree > 255 && degree <= 345){
            direction = "NorthWest wind";
        } else if((degree > 345 && degree <= 360) || (degree >= 0 && degree <= 15)){
            direction = "North wind";
        } else {
            direction = "Error finding wind direction";
        }
        return direction;
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
     * Takes a Unix UTC timestamp and converts to day of the week.
     * @param {int} timeStamp - int of Unix UTC timestamp 
     * @returns {String} dayOfWeek - String of day of the week
     */
    const getDayConversion = (timeStamp) => {
        const dateObj = new Date(timeStamp * 1000);
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };
        options.timeZone = "UTC";
        options.timeZoneName = "short";
        const time = dateObj.toLocaleDateString("en-US", options);
        const dayOfWeek = time.substring(0, time.indexOf(","));
        return dayOfWeek;
    }

    /**
     * Takes latitude and longitude coordinates of a location to retrieve its weather data
     * and set the background of the weather page..
     * @param {string} latCoords - latitude coordinate of location
     * @param {string} longCoords - longitude coordinate of location
     */
    const getWeatherData = async (latCoords, longCoords) => {
        //console.log("Weather data retrieval temporary blocked from api");
        console.log("weather data request for: " + latCoords + " " + longCoords);
        setIsLoading(true);
        const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/search/getWeather/" + latCoords + "/" + longCoords,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            }
        );
        const json = await response.json();
        if(response.ok){
            console.log("weather data response success");
            setIsLoading(false);
            setWeatherData(json);
            getImageBackground(json.current.weather[0].id);
        }
        if(!response.ok){
            setIsLoading(false);
            console.log("Error retrieving weather data for " + location.city);
            console.log(json.error);
        }
        
    }

    //get and display new weather information of queried city
    React.useEffect(() => {
        getWeatherData(location.latCoords, location.longCoords);
    }, [location]);

    return (
        <View style={!isLoading ? styles.container : styles.loadingContainer}>
            {!isLoading ?
                <View>
                    {weatherData && 
                        <View>
                            <View>
                                <View style={{flexDirection: "row", justifyContent: "space-around"}}>
                                    <Text style={[styles.textWithShadow, styles.leftAlign, styles.header]}>{location.city}</Text>
                                    <Text style={[styles.textWithShadow, styles.rightAlign, styles.smallHeader]}>{location.state}, {location.country}</Text>
                                </View>
                                <View style={styles.rowDisplayContainer}>
                                    <View style={styles.currentWeatherColumn}>
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>{weatherData.current.weather[0].description.charAt(0).toUpperCase() + weatherData.current.weather[0].description.slice(1)}</Text>
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>{Math.round(weatherData.current.temp)}&#176;</Text>
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>Feels like: {Math.round(weatherData.current.feels_like)}&#176;</Text>
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>&#8593;{Math.round(weatherData.daily[0].temp.max)}&#176; &#8595;{Math.round(weatherData.daily[0].temp.min)}&#176;</Text>
                                    </View>
                                    <View style={styles.currentWeatherColumn}>
                                        {weatherData.current.wind_speed > 0 ?
                                            <View>
                                                <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>{getWindDirection(parseInt(weatherData.current.wind_deg)).replace(/[^A-Z]+/g, "")} {weatherData.current.wind_speed} mph wind</Text>
                                                {weatherData.current.wind_gust &&
                                                    <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>{weatherData.current.wind_gust} mph gust</Text>
                                                }
                                            </View>
                                            :
                                            <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>No wind</Text>
                                        }
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>Sunrise: {getTimeConversion(weatherData.current.sunrise)}</Text>
                                        <Text style={[styles.centerText, styles.subHeader, styles.textWithShadow]}>Sunset: {getTimeConversion(weatherData.current.sunset)}</Text>
                                    </View>
                                </View>
                                {weatherData.alerts &&
                                    weatherData.alerts.map((alert) => (
                                        <View>
                                            <TouchableOpacity onPress={() => setWeatherAlertPopup(alert)}>
                                                <Text style={styles.weatherAlertButton}>WEATHER ALERT: {alert.event}</Text>
                                            </TouchableOpacity>
                                        </View> 
                                    ))
                                }
                            </View>
                            <View> 
                                <ScrollView style={styles.hourlyWeatherScrollView} horizontal={true} showsHorizontalScrollIndicator={false}>
                                    {weatherData.hourly.slice(0, 25).map((hour) => (
                                        <HourlyWeather hourData={hour} key={hour.dt}/>
                                    ))}
                                </ScrollView>
                            </View>
                            <View style={styles.dailyWeatherParentContainer}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    {weatherData.daily.slice(1, weatherData.daily.length).map((day) => (
                                        <DailyWeather dayData={day} key={day.dt}/>
                                    ))}
                                </ScrollView>  
                            </View>
                        </View>
                    }
                </View>
                :
                <View>
                    <Text style={styles.loadingText}>Loading weather data...</Text>
                    <View>
                        <ActivityIndicator size="large" />
                    </View>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    centerText: {
        textAlign: "center",
    },
    header: {
        fontSize: 40,
        fontStyle: "italic",
    },
    smallHeader: {
        fontSize: 25,
        fontStyle: "italic",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
    },
    leftAlign: {
        textAlign: "center",
        width: "45%"
    },
    rightAlign: {
        textAlign: "center",
        width: "55%"
    },
    subHeader: {
        fontSize: 20,
    },
    container: {
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        flexGrow: 1,
    },
     loadingContainer: {
        flexGrow: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    loadingText: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
        fontWeight: "bold", 
        fontSize: 30
    },
    mainContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    currentWeatherColumn: {
        marginLeft: "auto",
        marginRight: "auto",
    },
    rowDisplayContainer: {
        flexDirection: "row",
        justifyContent: "center",
        flex: 0,
    },
    hourWeatherDetail: {
        textAlign: "center",
        fontSize: 20,
        marginLeft: "1%",
        marginRight: "1%",
        marginTop: "auto",
        marginBottom: "auto"
    },
    icon: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    hourlyWeatherScrollView: {
        flexGrow: 1,
        borderTopWidth: 3,
        borderBottomWidth: 3,
        borderColor: "white"
    },
    dailyWeatherParentContainer: {
        borderBottomWidth: 3,
        borderColor: "white",
        height: Platform.OS === "android" ? 280 : 280,
    },
    textWithShadow: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3
    },
    weatherAlertButton: {
        marginTop: 15,
        marginBottom: 15,
        color: "white",
        textAlign: "center",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3
    },
    alertContainer: {
        backgroundColor: "black",
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
        width: "90%",
        borderColor: "white",
        borderWidth: 5,
        borderRadius: 20,
        opacity: 0.8
    },
    blurContainer: {
        padding: 20,
        justifyContent: "center",
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    }
});