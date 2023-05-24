import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, Image, View, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';

export default function DailyWeather({ dayData }) {

    const [toggleWindow, setToggleWindow] = React.useState(false);
    
    /**
     * Takes a Unix UTC timestamp and converts to meridiem time.
     * @param {Number} timeStamp - int of Unix UTC timestamp 
     * @returns {String} String of meridiem time
     */
    const getTimeConversion = (timeStamp) => {
        let conversion = new Date(timeStamp * 1000);
        conversion = conversion.toLocaleTimeString("default");
        return conversion.substring(0, conversion.length - 6) + " " + conversion.substring(conversion.length - 2, conversion.length);
    }

    /**
     * Takes a Unix UTC timestamp and converts to day of the week.
     * @param {int} timeStamp - int of Unix UTC timestamp 
     * @returns {String} String of day of the week
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
        const dayOfWeek = time.substring(0, time.indexOf(','));
        return dayOfWeek;
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
        <View>
            {!toggleWindow ?
                <TouchableOpacity onPress={() => setToggleWindow(!toggleWindow)}>
                    <View style={toggleWindow ? styles.expandedHeader : styles.rowDisplayContainer}>
                        <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>{getDayConversion(dayData.dt)}</Text>
                        <Image style={styles.dayWeatherData}
                            source={{
                                width: 40,
                                height: 40,
                                uri: getImageSrc(dayData.weather[0].icon),
                            }} 
                        />
                        <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>&#8593; {Math.round(dayData.temp.max)}&#176;</Text>
                        <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>&#8595; {Math.round(dayData.temp.min)}&#176;</Text>
                    </View>
                </TouchableOpacity>
                :
                <View>
                    <View style={styles.expandedWindowContainer}>
                        <TouchableOpacity onPress={() => setToggleWindow(!toggleWindow)}>
                            <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>{getDayConversion(dayData.dt)}: {dayData.weather[0].description.charAt(0).toUpperCase() + dayData.weather[0].description.slice(1)}</Text>
                            <View style={styles.precipitationContainer}>
                                {dayData.rain && 
                                    <Text style={[styles.dayWeatherData, styles.subHeader]}>
                                        <Text>Rain: </Text>
                                        <Text style={styles.textColor}>{(dayData.rain / 25.4).toFixed(3)} inches</Text>
                                    </Text>
                                }
                                {dayData.snow && 
                                    <Text style={[styles.dayWeatherData, styles.subHeader]}>
                                        <Text>Snow: </Text> 
                                        <Text style={styles.textColor}>{(dayData.snow / 25.4).toFixed(3)} inches</Text>
                                    </Text>
                                }
                            </View>
                            <View style={styles.mainDailyWeatherInfoContainer}>
                                <View style={[styles.columnContainer, styles.textColor]}>
                                    <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>&#8593; {Math.round(dayData.temp.max)}&#176;</Text>
                                    <Text style={[styles.dayWeatherData, styles.subHeader, styles.textColor]}>&#8595; {Math.round(dayData.temp.min)}&#176;</Text>
                                </View>
                                <View style={[styles.columnContainer, styles.textColor]}>
                                    <Text style={[styles.dayWeatherData, styles.subHeader]}>
                                        <Text>Sunrise: </Text>
                                        <Text style={styles.textColor}>{getTimeConversion(dayData.sunrise)}</Text>
                                    </Text>
                                    <Text style={[styles.dayWeatherData, styles.subHeader]}>
                                        <Text>Sunset: </Text>
                                        <Text style={styles.textColor}>{getTimeConversion(dayData.sunset)}</Text>
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scrollList} horizontal={true} showsHorizontalScrollIndicator={false}>
                        <Text style={styles.scrollItem}>
                            <Text >Moonrise: </Text>
                            <Text style={styles.textColor}>{getTimeConversion(dayData.moonrise)}</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>Moonset: </Text>
                            <Text style={styles.textColor}>{getTimeConversion(dayData.moonset)}</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>Moon phase: </Text>
                            <Text style={styles.textColor}>{dayData.moon_phase}</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>Humidity: </Text>
                            <Text style={styles.textColor}>{dayData.humidity}</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>UV Index: </Text>
                            <Text style={styles.textColor}>{dayData.uvi}</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>Pressure: </Text>
                            <Text style={styles.textColor}>{dayData.pressure} hPa</Text>
                        </Text>
                        <Text style={styles.scrollItem}>
                            <Text>Cloudiness: </Text>
                            <Text style={styles.textColor}>{dayData.clouds}&#37;</Text>
                        </Text>
                        {dayData.wind_speed &&
                            <Text style={styles.scrollItem}>
                                <Text>Wind Speed: </Text>
                                <Text style={styles.textColor}>{getWindDirection(dayData.wind_deg)} {dayData.wind_speed} mph</Text>
                            </Text> 
                        }
                        {dayData.wind_gust &&
                            <Text style={styles.scrollItem}>
                                <Text>Wind gust: </Text>
                                <Text style={styles.textColor}>{dayData.wind_gust} mph</Text>
                            </Text> 
                        }
                    </ScrollView>
                </View>
            }
        </View>
    );
}

const styles = StyleSheet.create({
    subHeader: {
        fontSize: 20,
    },
    rowDisplayContainer: {
        flexDirection: 'row',
        flex: 0,
    },
    expandedHeader: {
        flexDirection: 'column',
        flex: 0,
    },
    precipitationContainer: {
        flexDirection: 'row',
    },
    mainDailyWeatherInfoContainer: {
        flexDirection: 'row',
        flex: 1
    },
    columnContainer: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    dayWeatherData: {
        marginTop: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
        marginRight: "auto",
    },
    icon: {
        marginLeft: "auto",
        marginRight: "auto"
    },
    textColor: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3
    },
    altTextColor: {
        color: "black"
    },
    expandedWindowContainer: {
        backgroundColor: "rgba(255, 255, 255, 0.5)"
    },
    scrollList: {
        paddingTop: 25,
        paddingBottom: 25,
        backgroundColor: "rgba(255, 255, 255, 0.4)"
    },
    scrollItem: {
        marginLeft: 5,
        marginRight: 5
    }
});