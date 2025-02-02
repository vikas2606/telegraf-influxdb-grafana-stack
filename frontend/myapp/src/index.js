import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./components/store/store";
import { Provider } from "react-redux";
import { ProSidebarProvider } from "react-pro-sidebar";
import { PersistGate } from "redux-persist/integration/react";
import {persistor} from "./components/store/store"
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <ProSidebarProvider>
    <PersistGate loading={null} persistor={persistor}>  <App /></PersistGate>
    </ProSidebarProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
