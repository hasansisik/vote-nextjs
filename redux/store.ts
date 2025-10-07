// redux/store.ts
import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducers/userReducer";
import { menuReducer } from "./reducers/menuReducer";
import { testCategoryReducer } from "./reducers/testCategoryReducer";
import { testReducer } from "./reducers/testReducer";
import { notificationReducer } from "./reducers/notificationReducer";
import { settingsReducer } from "./reducers/settingsReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    menu: menuReducer,
    testCategory: testCategoryReducer,
    test: testReducer,
    notification: notificationReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
