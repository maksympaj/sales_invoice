import React, { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import {
  Backdrop,
  CircularProgress,
  Container,
  CssBaseline,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import store from "store";
import axios from "axios";

import { Invoice, Quotation, Receipt, SignIn, SignUp } from "components/Guest";
import Admin from "components/Admin";
import Standard from "components/Standard";
import { AdminRoute, GuestRoute, PrivateRoute } from "components/Common/Routes";
import DeliveryPDF from "components/Common/DeliveryPDF";

if (store.getState().auth.isLoggedIn)
  axios.defaults.headers.common["Authorization"] = `Bearer ${
    store.getState().auth.token
  }`;

const theme = createTheme({
  components: {
    MuiButton: {
      variants: [
        {
          props: { color: "aaaa" },
          style: {
            root: { color: `#888888` },
          },
        },
      ],
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        margin: "dense",
        size: "small",
      },
    },
    MuiSelect: {
      defaultProps: {
        margin: "dense",
        size: "small",
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "dense",
      },
    },
  },
});

// axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.baseURL = "https://blueoceanblue.com/api";

axios.interceptors.request.use(
  function (config) {
    store.dispatch({ type: "loading/beginLoading" });
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    store.dispatch({ type: "loading/endLoading" });
    return response;
  },
  function (error) {
    store.dispatch({ type: "loading/endLoading" });
    if (error.response && error.response.status === 401)
      store.dispatch({ type: "auth/logout" });
    return Promise.reject(error);
  }
);

const App = () => {
  const [loading, setLoading] = useState(store.getState().loading.value);
  store.subscribe(() => {
    setLoading(store.getState().loading.value);
  });
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <CssBaseline />
        <Container
          maxWidth = {false}
          disableGutters
          sx = {{
            height: "100vh",
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Backdrop
            sx = {{ color: "#fff", zIndex: (theme) => theme.zIndex.modal + 1 }}
            open = {loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          <BrowserRouter>
            <Switch>
              <Route path = "/" exact>
                <Redirect to = "/signin" />
              </Route>
              <Route path = "/invoice/:id" exact component = {Invoice} />
              <Route path = "/receipt/:id" exact component = {Receipt} />
              <Route path = "/quotation/:id" exact component = {Quotation} />
              <GuestRoute path = "/signin" exact component = {SignIn} />
              <GuestRoute path = "/signup" exact component = {SignUp} />
              <AdminRoute path = "/admin" component = {Admin} />
              <PrivateRoute path = "/user" component = {Standard} />
              <Route
                path = "/deliveryPDF/:productType/:deliveryId"
                component = {DeliveryPDF}
              />
            </Switch>
          </BrowserRouter>
        </Container>
      </Provider>
    </ThemeProvider>
  );
};

export default App;
