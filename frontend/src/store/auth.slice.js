import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        role: null,
        accessToken: null,
    },
    reducers: {
        login: (state, { payload }) => {
            return {
                ...state,
                role: payload.role,
                accessToken: payload.accessToken,
            }
        },
        logout: (state) => {
            return {
                ...state,
                role: null,
                accessToken: null,
            };
        },
    }
});

export const {
    login,
    logout,
} = authSlice.actions;

export default authSlice.reducer;
