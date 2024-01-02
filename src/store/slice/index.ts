import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { IUserInfor } from "~/interface";

interface IInitData {
  infor: IUserInfor;
  loading: boolean;
}

const initialState: IInitData = {
  infor: {
    _id: null,
    name: "",
    email: "",
    avartar: null,
  },
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.infor = action.payload;
    },
    isLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const getUser = (state: RootState) => state.user;

export const { login, isLoading } = userSlice.actions;
export default userSlice.reducer;
