import axios from 'axios';
import { setAlert } from './alert';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADER,
  AUTH_ERROR,
  LOGIN_FAIL,
  LOGIN_SUCCESS,
  LOGOUT,
  CLEAR_PROFILE,
} from './types';
import setAuthToken from '../utils/setAuthToken';

// Load User
export const loadUser = () => async (dispatch) => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  } else {
    dispatch(setAlert('No token was found'));
  }

  try {
    const res = await axios.get('/api/auth');
    console.log(res.data);

    dispatch({
      type: USER_LOADER,
      payload: res.data,
    });
    // dispatch(setAlert('Login Successful'), 'success');
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg), 'danger'));
    }

    dispatch({
      type: AUTH_ERROR,
    });
  }
};

// Registe User
export const register =
  ({ name, email, password }) =>
  async (dispatch) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    const body = JSON.stringify({ name, email, password });
    try {
      const res = await axios.post('/api/users', body, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      dispatch(loadUser());
    } catch (err) {
      const errors = err.response.data.errors;
      if (errors) {
        console.log(errors);
        errors.forEach((error) => dispatch(setAlert(error.msg), 'danger'));
      }
      dispatch({
        type: REGISTER_FAIL,
      });
    }
  };

// Login User
export const login = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const body = JSON.stringify({ email, password });
  try {
    const res = await axios.post('/api/auth', body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      console.log(errors);
      errors.forEach((error) => dispatch(setAlert(error.msg), 'danger'));
    }
    dispatch({
      type: LOGIN_FAIL,
    });
  }
};

// Logout / clear profile

export const logout = () => (dispatch) => {
  dispatch({
    type: CLEAR_PROFILE,
  });
  dispatch({
    type: LOGOUT,
  });
};
