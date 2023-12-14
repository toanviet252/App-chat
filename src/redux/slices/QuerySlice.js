import { createSlice } from '@reduxjs/toolkit';

export const QueryUserSlice = createSlice({
  name: 'QueryUser',
  initialState: {
    queryUser: [],
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
