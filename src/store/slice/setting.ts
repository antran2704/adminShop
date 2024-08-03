import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface IInitData {
  darkMode: boolean;
  isShowSidebar: boolean;
}

const initialState: IInitData = {
  darkMode: false,
  isShowSidebar: false,
};

const settingSlice = createSlice({
  name: "setting",
  initialState,
  reducers: {
    changeMode: (state: IInitData, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    changeShowSideBar: (state: IInitData, action: PayloadAction<boolean>) => {
      state.isShowSidebar = action.payload;
    },
  },
});

const settingReducer = settingSlice.reducer;

export const { changeMode, changeShowSideBar } = settingSlice.actions;
export default settingReducer;
