import { StatusBar } from "expo-status-bar";
import React from "react";
import RadioButtonRN from "radio-buttons-react-native";
import { Button, StyleSheet, Text, Keyboard, ActivityIndicator, TextInput, View, SafeAreaView, Platform, Switch, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import SearchResult from "../components/SearchResult.js";
import defaultBackground from "../imageBackgrounds/default.jpg";
import { useSelector, useDispatch } from "react-redux";
import { setLocations, createLocation, deleteLocation, login, logout } from "../redux/actions";

export default function AddLocation({ navigation }) {

    const session = useSelector(state => state.userReducer);
    const dispatch = useDispatch();

    const [isLoading, setIsLoading] = React.useState(false);
    const [switchEnabled, setSwitchEnabled] = React.useState(false);
    const [error, setError] = React.useState("");
    const [searchResults, setSearchResults] = React.useState("");
    const [searchCity, setSearchCity] = React.useState("");
    const [searchState, setSearchState] = React.useState("");
    const [searchZipcode, setSearchZipcode] = React.useState("");
    const [searchCountry, setSearchCountry] = React.useState("");
    const [searchForm, setSearchForm] = React.useState("");
    const [selectedCity, setSelectedCity] = React.useState("");

    /**
     * Submits and sets search results for city locations from user defined input.
     * @param {object} e - user input object 
     */
    const citySearch = async (e) => {
        parameters = searchCity;
        if(searchState){
            parameters += "," + searchState;
        }
        //If country is not specified but state is, set country to US
        if(!searchCountry && searchState){
            parameters += ",US";
        }
        if(searchCountry){
            parameters += "," + searchCountry;
        }

        const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/search/citySearch/" + parameters,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const json = await response.json();
        if(response.ok){
            setIsLoading(false);
            if(json.length === 0){
                setSearchResults(<p className="error">No matches found for {parameters.replaceAll(",", ", ")}</p>);
            } else {
                let buttonLabels = [];
                json.map((result) => {
                    let label = result.name + ", ";
                    if(result.state){
                        label += result.state;
                    }
                    if(result.zipcode){
                        label += " " + result.zipcode;
                    }
                    buttonLabels.push({
                        label: label,
                        info: result
                    });
                });
                setSearchResults(
                    <ScrollView>
                        <RadioButtonRN
                            data={buttonLabels}
                            selectedBtn={(e) => setSelectedCity({
                                city: e.info.name,
                                state: e.info.state,
                                zipcode: e.info.zipcode,
                                country: e.info.country,
                                latCoords: e.info.lat,
                                longCoords: e.info.lon
                            })}
                        />
                    </ScrollView>
                );
            }
        }

        if(!response.ok){
            setIsLoading(false);
            setSearchResults(<p className="error">Error searching for {parameters.replaceAll(",", ", ")}</p>);
            console.log("error");
            console.log(json.error);
        }
    }

    /**
     * Submits and sets search results for a zipcode location from user defined input.
     * @param {object} e - user input object 
     */
    const zipcodeSearch = async (e) => {
        parameters = searchCity;
        if(searchState){
            parameters += "," + searchState;
        }
        //If country is not specified but state is, set country to US
        if(!searchCountry && searchState){
            parameters += ",US";
        }
        if(searchCountry){
            parameters += "," + searchCountry;
        }

        const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/search/zipcodeSearch/" + parameters,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });

        const json = await response.json();
        if(response.ok){
            setIsLoading(false);
            if(json.length === 0){
                setSearchResults(<p className="error">No matches found for {parameters.replaceAll(",", ", ")}</p>);
            } else {
                let buttonLabels = [];
                json.map((result) => {
                    let label = result.name + ", ";
                    if(result.state){
                        label += result.state;
                    }
                    if(result.zipcode){
                        label += " " + result.zipcode;
                    }
                    buttonLabels.push({
                        label: label,
                        info: result
                    });
                });
                setSearchResults(
                    <ScrollView>
                        <RadioButtonRN
                            data={buttonLabels}
                            selectedBtn={(e) => setSelectedCity({
                                city: e.info.name,
                                state: e.info.state,
                                zipcode: e.info.zipcode,
                                country: e.info.country,
                                latCoords: e.info.lat,
                                longCoords: e.info.lon
                            })}
                        />
                    </ScrollView>
                );
            }
        }
        
        if(!response.ok){
            setIsLoading(false);
            setSearchResults(<p className="error">Error searching for {parameters.replaceAll(",", ", ")}</p>);
            console.log("error");
            console.log(json.error);
        }
    }

    /**
     * Closes keyboard and routes location search request to respective search type.
     */
    const handleSearch = async () => {
        Keyboard.dismiss();
        setIsLoading(true);
        setSelectedCity("");
        if(switchEnabled){
            zipcodeSearch();
        } else {
            citySearch();
        }
    }

    /**
     * Adds selected location to user"s list of locations and redirects user to the weather page
     * to view weather data for newly selected location.
     * @param {object} e - user input object 
     */
    const selectCity = async (e) => {
        dispatch(createLocation(selectedCity));
        setSearchResults("");
        navigation.navigate("Weather");
    }

    //if switchEnabled is changed, clear previous inputs
    React.useEffect(() => {
        if(switchEnabled){
            setSearchCity("");
            setSearchState("");
            setSearchCountry("");
        } else {
            setSearchZipcode("");
            setSearchCountry("");
        }
    }, [switchEnabled]);

    return (
        <SafeAreaView style={styles.container}>
            <ImageBackground 
                source={backgroundImage}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                <View style={styles.changeSearchContainer}>
                    <View><Text style={styles.switchLabel} onPress={() => setSwitchEnabled(false)}>City</Text></View>
                    <Switch
                        trackColor={{false: "#767577", true: "#81b0ff"}}
                        thumbColor={switchEnabled ? "#f5dd4b" : "#f4f3f4"}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={setSwitchEnabled}
                        value={switchEnabled}
                    />
                    <View><Text style={styles.switchLabel} onPress={() => setSwitchEnabled(true)}>Zipcode</Text></View>
                </View>

                {!switchEnabled ? 
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>City:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchCity}
                            value={searchCity}
                        />
                        <Text style={styles.inputLabel}>State: (2 letter state code, US only)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchState}
                            value={searchState}
                        />
                        <Text style={styles.inputLabel}>Country:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchCountry}
                            value={searchCountry}
                        />
                    </View>
                    :
                    <View style={styles.inputWrapper}>
                        <Text style={styles.inputLabel}>Zipcode:</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchCity}
                            value={searchCity}
                        />
                        <Text style={styles.inputLabel}>Country: (required outside of US)</Text>
                        <TextInput
                            style={styles.input}
                            onChangeText={setSearchCountry}
                            value={searchCountry}
                        />
                    </View>
                }
                <TouchableOpacity
                    style={styles.dispatchButton} 
                    onPress={() => handleSearch()}
                >
                    <Text style={styles.dispatchButtonText}>Search</Text>
                </TouchableOpacity>

                <View>
                    {isLoading ?
                        <View style={styles.loadingContainer}>
                            <Text style={styles.loadingText}>Loading search results...</Text>
                            <View>
                                <ActivityIndicator size="large" />
                            </View>
                        </View>
                        :
                        <View>
                            {searchResults && 
                                <View>
                                    <View style={selectedCity && Platform.OS === "android" ? styles.shrunkenSearchResultsContainer : styles.searchResultsContainer}>
                                        {searchResults}
                                    </View>
                                    {selectedCity && 
                                        <TouchableOpacity
                                            style={[styles.dispatchButton, styles.topMargin]} 
                                            onPress={() => selectCity()}
                                        >
                                            <Text style={styles.dispatchButtonText}>Add location</Text>
                                        </TouchableOpacity>
                                    }
                                </View>
                            }
                        </View>
                    }
                </View>
            </ImageBackground>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexShrink: 1,
        flexBasis: "auto",
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    loadingContainer: {
        alignItems: "center", 
        marginTop: "auto", 
        marginBottom: "auto"
    },
    changeSearchContainer: {
        flexDirection: "row",
        justifyContent: "space-evenly"
    },
    searchResultsContainer: {
        backgroundColor: "white",
        opacity: 0.8,
    },
    shrunkenSearchResultsContainer: {
        backgroundColor: "white",
        opacity: 0.8,
        borderColor: "black",
        borderWidth: 3,
        height: "70%",
    },
    column: {
        flexGrow: 1,
        flexBasis: 0,
    },

    switchLabel: {
        color: "white",
        fontSize: 20
    },
    inputWrapper: {
        width: "100%",
        alignItems: "center"
    },
    input: {
        color: "white",
        borderColor: "white",
        borderWidth: 1,
        backgroundColor: "black",
        margin: Platform.OS === "android" ? 5 : 12,
        height: 40,
        padding: 10,
        width: "80%",
    },
    inputLabel: {
        color: "white",
        textAlign: "center",
        fontSize: 20,
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3
    },
    backgroundImage: {
        flex: 1,
    },
    dispatchButton: {
        backgroundColor: "black",
        marginLeft: "auto",
        marginRight: "auto",
        width: "70%",
        padding: "2%",
        borderColor: "white",
        borderWidth: 5,
        borderRadius: 20,

    },
    dispatchButtonText: {
        fontSize: 20,
        color: "white",
        textAlign: "center"
    },
    topMargin: {
        marginTop: "4%"
    },
    loadingText: {
        color: "white",
        textShadowColor: "black",
        textShadowOffset: {width: 2, height: 2},
        textShadowRadius: 3,
        fontWeight: "bold", 
        fontSize: 30
    },
});