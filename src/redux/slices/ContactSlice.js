import { createSlice } from '@reduxjs/toolkit';

export const ContactSlice = createSlice({
  name: 'Contact',
  initialState: {
    recentContacts: [],
    allContacts: [],
  },
  reducers: {
    setRecentContacts(state, action) {
      state.recentContacts = action.payload;
    },
    setAllContacts(state, action) {
      state.allContacts = action.payload;
    },
    clearAllContacts(state) {
      state.allContacts = [];
      state.recentContacts = [];
    },
  },
});
