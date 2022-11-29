import { configureStore } from "@reduxjs/toolkit";
import commentReducer from "./reducers/commentReducer";
import locationsReducer from "./reducers/locationsReducer";
import roomReducer from "./reducers/roomReducer";
import positionReducer from "./reducers/positionReducer";
import userReducer from "./reducers/userReducer";
import signInReducer from "./reducers/signInReducer";
import authReducer from "./reducers/authReducer";
import bookingReducer from "./reducers/bookingReducer";
import modalReducer from "./reducers/modalReducer";
export const store = configureStore({
  reducer: {
    locationsReducer,
    roomReducer,
    positionReducer,
    commentReducer,
    userReducer,
    signInReducer,
    authReducer,
    bookingReducer,
    modalReducer
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
