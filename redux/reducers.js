import React from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SET_LOCATIONS, CREATE_LOCATION, DELETE_LOCATION, LOGIN, LOGOUT } from "./actions";
import * as SecureStore from 'expo-secure-store';

/**
 * Checks local secure storage for a user json web token and returns one if found. 
 * @returns {String} token - String of user json web token
 */
const getToken = async () => {
    const token = await SecureStore.getItemAsync('userToken');
    return token;
}

/**
 * Takes a user email and location and adds location to list of locations in user's database account.
 * @param {String} user - user email
 * @param {Object} location - object containing data for a location
 */
const addLocationToDB = async (user, location) => {

    const saveLocation = {
        jsonUserEmail: user,
        jsonLatCoords: location.latCoords, 
        jsonLongCoords: location.longCoords,
        jsonCity: location.city,
        jsonCountry: location.country,
        jsonState: location.state,
        jsonZipcode: location.zipcode 
    };

    const token = getToken();
    const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/mobileLocations/add", {
        method: "POST",
        body: JSON.stringify(saveLocation),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + token
        },
    });

    const json = await response.json();
    if(!response.ok){
        console.log("Error saving location"); 
        console.log(json.error);
    }

}

/**
 * Takes a user email and location and deletes location from list of locations in user's database account.
 * @param {String} user - user email
 * @param {Object} location - object containing data for a location
 */
const deleteLocationFromDB = async (user, location) => {

    const saveLocation = {
        jsonUserEmail: user,
        jsonLatCoords: location.latCoords,
        jsonLongCoords: location.longCoords
    };

    const token = getToken();
    const response = await fetch("https://weathernowweb-384801.ue.r.appspot.com/mobileLocations/delete", {
        method: "DELETE",
        body: JSON.stringify(saveLocation),
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ` + token
        },
    });

    const json = await response.json();
    
    if(!response.ok){
        console.log("Error saving location"); 
        console.log(json.error);
    }
    
}

/**
 * Sets user's list of locations to local async storage. 
 * @param {Array} locations - array of user locations
 */
const setLocations = async (locations) => {
    try {
      await AsyncStorage.setItem("locations", JSON.stringify(locations));
    } catch (error) {
      console.log("Error setting location(s) to async storage: " + error);
    }
}

/**
 * Deletes user profile from local async storage. 
 */
const deleteLocalUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (error) {
      console.log("Error deleting user from async storage: " + error);
    }
}

const initialState = {
    user: null,
    locations: [],
}

const userReducer = (state = initialState, action) => {

    switch(action.type) {
        //Set locations from user/guest account to local storage and reducer.
        case SET_LOCATIONS:
            setLocations(action.payload);
            return {
                ...state, 
                locations: action.payload
            };
        //Adds location to local storage and reducer.
        case CREATE_LOCATION:
            if(state.user){
                addLocationToDB(state.user, action.payload);
            }
            if(state.locations){
                setLocations([...state.locations, action.payload]);
                return {
                    ...state, 
                    locations: [...state.locations, action.payload]
                };
            } else {
                setLocations([action.payload]);
                return {
                    ...state,
                    locations: [action.payload]
                };
            }
        //Deletes location from reducer and local storage
        case DELETE_LOCATION:
            if(state.user){
                deleteLocationFromDB(state.user, action.payload);
            }
            let deleteUpdate = state.locations.filter((location) => 
                location.latCoords !== action.payload.latCoords && 
                location.longCoords !== action.payload.longCoords
            );
            setLocations(deleteUpdate);
            
            return {
                ...state,
                locations: deleteUpdate
            };
        //Sets user account to reducer after logging into database.
        case LOGIN:
            if(action.payload.locations){
                return {
                    ...state,
                    user: action.payload.email,
                    locations: action.payload.locations,
                    token: action.payload.token
                }
            } else {
                return {
                    ...state,
                    user: action.payload.email,
                    locations: [],
                    token: action.payload.token
                }
            }
        //Deletes user account from local storage and reducer after logging out.
        case LOGOUT:
            deleteLocalUser();
            return {
                locations: [],
                user: null
            }
        default:
            return state;
    }
}

export default userReducer;

