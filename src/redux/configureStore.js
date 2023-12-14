import { configureStore } from '@reduxjs/toolkit';
import { AuthSlice } from './slices/AuthSlice';
import { QueryUserSlice } from './slices/QuerySlice';
import { ContactSlice } from './slices/ContactSlice';

export const store = configureStore({
  reducer: {
    Auth: AuthSlice.reducer,
    QueryReducer: QueryUserSlice.reducer,
    ContactsReducer: ContactSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});
export const AuthAction = AuthSlice.actions;
export const QueryUserAction = QueryUserSlice.actions;
export const ContactsAction = ContactSlice.actions;
