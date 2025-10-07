// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { menuReducer } from "./reducers/menuReducer";
import { testCategoryReducer } from "./reducers/testCategoryReducer";
import { testReducer } from "./reducers/testReducer";
import { notificationReducer } from "./reducers/notificationReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    testCategory: testCategoryReducer,
    test: testReducer,
    notification: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
