import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserState, UserType } from "../types";

const initialState: UserState = {
    userData: null
}
const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUserData: (state, action:PayloadAction<UserType>) => {
            state.userData = action.payload
        },
        clearUserData: (state) => {
            state.userData = null
        }
    }
});

export const { setUserData, clearUserData } = UserSlice.actions;

export default UserSlice.reducer;