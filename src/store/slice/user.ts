import { createSlice } from "@reduxjs/toolkit";
import { IUserInfor } from "~/interface";

interface IInitData {
  infor: IUserInfor;
  logout: boolean;
  permissions: string[];
}

const initialState: IInitData = {
  infor: {
    _id: null,
    name: "",
    email: "",
    avartar: null,
  },
  logout: false,
  permissions: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, action) => {
      state.infor = action.payload;
    },
    logoutReducer: (state, action) => {
      state.logout = action.payload;
    },
    setPermisson: (state, action) => {
      state.permissions = action.payload;
    },
  },
});

// export const getUser = (state: RootState) => state.user;

const userReducer = userSlice.reducer;

export const { loginReducer, logoutReducer, setPermisson } = userSlice.actions;
export default userReducer;
