import { configureStore, createSlice } from "@reduxjs/toolkit";

const intialAuthState = {
  isAuthenticated: false,
  currentUser: null,
  curentUserPhoto: null,
  nameFind: "",
  listContact: [],
  chooseContactUser: null,
  isChooseContact: false,
};
export const AuthSlice = createSlice({
  name: "Authentication",
  initialState: intialAuthState,
  reducers: {
    logIn(state) {
      state.isAuthenticated = true;
    },
    logOut(state) {
      state.isAuthenticated = false;
    },
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setCurrentUserPhoto(state, action) {
      state.curentUserPhoto = action.payload;
    },
    setNameFind(state, action) {
      state.nameFind = action.payload;
    },
    setChooseContactUser(state, action) {
      state.chooseContactUser = action.payload;
    },
    setIsChooseContact(state, action) {
      state.isChooseContact = action.payload;
    },
  },
});
export const QueryUserSlice = createSlice({
  name: "QueryUser",
  initialState: {
    queryUser: null,
    dataInfor: [],
    chatId: null,
  },
  reducers: {
    setQueryUser(state, action) {
      state.queryUser = action.payload;
    },
    setDataInfor(state, action) {
      state.dataInfor = action.payload;
    },
    setChatId(state, action) {
      state.chatId = action.payload;
    },
  },
});

export const store = configureStore({
  reducer: {
    Auth: AuthSlice.reducer,
    QueryReducer: QueryUserSlice.reducer,
  },
});
export const AuthAction = AuthSlice.actions;
export const QueryUserAction = QueryUserSlice.actions;
