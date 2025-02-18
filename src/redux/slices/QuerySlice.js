import { createSlice } from '@reduxjs/toolkit';

export const QueryUserSlice = createSlice({
  name: 'QueryUser',
  initialState: {
    queryUser: [],
    dataInfor: [],
    chatId: null,
    loadingQuery: false,
  },
  reducers: {
    setQueryUser(state, action) {
      state.queryUser = action.payload;
      state.loadingQuery = false;
    },
    setDataInfor(state, action) {
      state.dataInfor = action.payload;
    },
    setChatId(state, action) {
      state.chatId = action.payload;
    },
    setLoadingQueryUser(state, action) {
      state.loadingQuery = action.payload;
    },
  },
});
export const { setQueryUser, setDataInfor, setChatId, setLoadingQueryUser } =
  QueryUserSlice.actions;
