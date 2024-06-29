import { createSlice } from "@reduxjs/toolkit";
import { IUserInfor } from "~/interface";

interface IInitData {
  infor: IUserInfor;
  permission: string;
  role: string;
}

const initialState: IInitData = {
  infor: {
    _id: null,
    name: "",
    email: "",
    avartar: null,
  },
  permission: "",
  role: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginReducer: (state, action) => {
      state.infor = action.payload;
    },
    setPermisson: (state, action) => {
      state.permission = action.payload.permission;
      state.role = action.payload.role;
    },
  },
});

const userReducer = userSlice.reducer;

export const { loginReducer, setPermisson } = userSlice.actions;
export default userReducer;
