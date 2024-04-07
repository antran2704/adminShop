import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slice/user";
import settingReducer from "./slice/setting";

export const store = configureStore({
  reducer: {
    user: userReducer,
    setting: settingReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;