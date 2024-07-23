import { createSlice } from "@reduxjs/toolkit";
import { ERole } from "~/enums";
import { IUserInfor } from "~/interface";

interface IInitData {
  infor: IUserInfor;
  permission: string;
  role: ERole | null;
}

const initialState: IInitData = {
  infor: {
    _id: null,
    name: "",
    email: "",
    avartar: null,
  },
  permission: "",
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, action) => {
      state.infor = action.payload;
    },
    logoutReducer: (state) => {
      state.infor = initialState.infor;
    },
    setPermisson: (state, action) => {
      state.permission = action.payload.permission;
      state.role = action.payload.role;
    },
  },
});

const userReducer = userSlice.reducer;

export const { loginReducer, setPermisson, logoutReducer } = userSlice.actions;
export default userReducer;
