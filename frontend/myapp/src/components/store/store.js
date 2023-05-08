import { createSlice, configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";

const darkThemeState = {
  isdarktheme: false,
};

const initialComponentShowState = {
  login: false,
};

const themeSlice = createSlice({
  name: "theme",
  initialState: darkThemeState,
  reducers: {
    toggletheme: (state) => {
      state.isdarktheme = !state.isdarktheme;
    },
  },
});

const componentSlice = createSlice({
  name: "component",
  initialState: initialComponentShowState,
  reducers: {
    setlogin: (state, action) => {
      state.login = action.payload;
    },
  },
});

const rootReducer = combineReducers({
  theme: themeSlice.reducer,
  component: componentSlice.reducer,
});

const persistConfig = {
  key: "root",
  storage: storageSession,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const toggleThemeAction = themeSlice.actions;
export const componentActions = componentSlice.actions;
export const selectTheme = (state) => state.theme.isdarktheme;
export const selectComponent = (state) => state.component;

export default store
export const persistor = persistStore(store);



