import React, { Fragment } from "react";
import { store } from "../../redux/store";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "../../Router/Router";

// Корень всего приложения

function App() {
    return (
        <Fragment>
            <Provider store={store}>
                <RouterProvider router={router} />
            </Provider>
        </Fragment>
    );
}

export { App };
