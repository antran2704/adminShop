import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitData {
  darkMode: boolean;
}

const initialState: IInitData = {
  darkMode: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeMode: (state: IInitData, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
  },
});

const settingReducer = settingSlice.reducer;

export const { changeMode } = settingSlice.actions;
export default settingReducer;
