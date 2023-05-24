import { combineReducers, applyMiddleware } from "redux";
import { configureStore } from "@reduxjs/toolkit"
import userReducer from "./reducers";

const rootReducer = combineReducers({ userReducer });

export const store = configureStore({ 
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false
    })
});