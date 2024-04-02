import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import auth from './slice/auth.slice';
import counter from './slice/counter.slice';
import loading from './slice/loading.slice';

const reducer = combineReducers({
  auth,
  counter,
  loading,
});

const preloadedState = localStorage.getItem('state')
  ? JSON.parse(localStorage.getItem('state'))
  : {};

const store = configureStore({
  reducer,
  preloadedState,
});

store.subscribe(() => {
  localStorage.setItem('state', JSON.stringify(store.getState()));
});

export default store;
