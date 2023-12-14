import { createSlice } from '@reduxjs/toolkit';

const intialAuthState = {
  isAuthenticated: false,
  currentUser: null,
  curentUserPhoto: null,
  nameFind: '',
  listContact: [],
  chooseContactUser: null,
  isChooseContact: false,
};
export const AuthSlice = createSlice({
  name: 'Authentication',
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
