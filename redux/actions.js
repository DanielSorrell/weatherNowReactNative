export const SET_LOCATIONS = 'SET_LOCATIONS';
export const CREATE_LOCATION = 'CREATE_LOCATION';
export const DELETE_LOCATION = 'DELETE_LOCATION';
export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

export const setLocations = savedLocations => dispatch => {
    dispatch({
        type: SET_LOCATIONS,
        payload: savedLocations,
    });
}

export const createLocation = location => dispatch => {
    dispatch({
        type: CREATE_LOCATION,
        payload: location,
    });
}

export const deleteLocation = location => dispatch => {
    dispatch({
        type: DELETE_LOCATION,
        payload: location,
    });
}

export const login = (user) => dispatch => {
    dispatch({
        type: LOGIN,
        payload: user
    });
}

export const logout = () => dispatch => {
    dispatch({
        type: LOGOUT
    });
}