import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "..";
import { handleGetUser } from "~/helper/Auth";

interface IUserInfor {
  _id: string | null;
  name: string;
  email: string;
  avartar: string | null;
}

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
