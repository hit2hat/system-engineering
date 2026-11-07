import { configureStore, combineReducers } from '@reduxjs/toolkit';

import authSlice from './auth.slice.js';

export const store = configureStore({
    reducer: combineReducers({
        auth: authSlice,
    }),
});

export const dispatch = store.dispatch;
